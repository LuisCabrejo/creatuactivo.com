/**
 * CreaTuActivo.com - Service Worker v1.0.9
 *
 * Estrategia Híbrida:
 * - Cache-first para navegación (HTML)
 * - Cache-first para assets estáticos (JS, CSS, imágenes)
 * - Network-first para datos dinámicos
 * - Auto-cache HTML cuando se detecta navegación cliente
 *
 * Basado en Dashboard SW v1.0.9 (2025-12-17)
 */

const CACHE_VERSION = 'v1.0.9';
const CACHE_NAME = `creatuactivo-marketing-${CACHE_VERSION}`;

// Assets críticos que SIEMPRE deben estar en cache
const CRITICAL_ASSETS = [
  '/',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/og-image.jpg'
];

// Rutas que NUNCA se cachean (APIs, auth, tracking)
const BYPASS_CACHE_PATTERNS = [
  '/api/',
  '/auth/',
  '/_next/webpack-hmr',
  '/tracking.js',  // Siempre fresh para fingerprinting
  'supabase.co',
  'anthropic.com'
];

// ============================================================================
// INSTALL EVENT
// ============================================================================
self.addEventListener('install', (event) => {
  console.warn('🚀 [SW] Service Worker v' + CACHE_VERSION + ' instalando...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.warn('📦 [SW] Pre-cacheando assets críticos...');
        // Cachear uno por uno para evitar que un 404 rompa todo
        return Promise.allSettled(
          CRITICAL_ASSETS.map(url =>
            cache.add(url).catch(err => {
              console.warn('⚠️ [SW] No se pudo cachear:', url);
            })
          )
        );
      })
      .then(() => {
        console.warn('✅ [SW] Instalación completada');
      })
  );

  // Activar inmediatamente sin esperar
  self.skipWaiting();
});

// ============================================================================
// ACTIVATE EVENT
// ============================================================================
self.addEventListener('activate', (event) => {
  console.warn('🔄 [SW] Activando Service Worker v' + CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar caches antiguos
            if (cacheName.startsWith('creatuactivo-marketing-') && cacheName !== CACHE_NAME) {
              console.warn('🗑️ [SW] Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.warn('✅ [SW] Service Worker v' + CACHE_VERSION + ' activo');
      })
  );

  // Tomar control de todas las páginas inmediatamente
  self.clients.claim();
});

// ============================================================================
// FETCH EVENT - Estrategia Híbrida
// ============================================================================
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Solo manejar GET requests
  if (request.method !== 'GET') {
    return;
  }

  // BYPASS: Rutas que nunca se cachean
  if (shouldBypassCache(url)) {
    return;
  }

  // NAVEGACIÓN (HTML) → Cache-first
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // NEXT.JS DATA (navegación cliente) → Cache-first + auto-cache HTML
  if (url.pathname.startsWith('/_next/data/')) {
    event.respondWith(handleNextData(request, url));
    return;
  }

  // ASSETS ESTÁTICOS → Cache-first
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // OTROS → Network-first
  event.respondWith(handleDynamic(request));
});

// ============================================================================
// ESTRATEGIAS DE CACHE
// ============================================================================

/**
 * Cache-first para navegación (páginas HTML)
 */
async function handleNavigation(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.warn('📦 [SW] Cache-first HIT:', request.url);
      // Actualizar cache en background (stale-while-revalidate)
      fetchAndCache(request, cache);
      return cachedResponse;
    }

    // No hay cache, ir a red
    console.warn('🌐 [SW] Cache-first MISS, fetching:', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      console.warn('✅ [SW] Página cacheada:', request.url);
    }

    return networkResponse;

  } catch (error) {
    console.warn('❌ [SW] Error en navegación:', error.message);
    return createOfflineFallback();
  }
}

/**
 * Manejar navegación cliente de Next.js (/_next/data/)
 * Auto-cachea el HTML correspondiente
 */
async function handleNextData(request, url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.warn('📦 [SW] NextData cache HIT:', url.pathname);
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      console.warn('✅ [SW] NextData cacheado:', url.pathname);

      // AUTO-CACHE: También cachear el HTML de la página
      cacheHTMLForNextData(url.href);
    }

    return networkResponse;

  } catch (error) {
    console.warn('❌ [SW] Error en NextData:', error.message);
    const cachedResponse = await caches.match(request);
    return cachedResponse || createOfflineFallback();
  }
}

/**
 * Cache-first para assets estáticos
 */
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;

  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    // Para imágenes faltantes, devolver placeholder transparente
    if (request.url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i)) {
      return new Response('', {
        status: 200,
        headers: { 'Content-Type': 'image/png' }
      });
    }

    throw error;
  }
}

/**
 * Network-first para contenido dinámico
 */
async function handleDynamic(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;

  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.warn('📦 [SW] Fallback a cache:', request.url);
      return cachedResponse;
    }
    throw error;
  }
}

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

/**
 * Determina si una URL debe bypass el cache
 */
function shouldBypassCache(url) {
  const fullUrl = url.href;
  return BYPASS_CACHE_PATTERNS.some(pattern => fullUrl.includes(pattern));
}

/**
 * Determina si es un asset estático
 */
function isStaticAsset(url) {
  const pathname = url.pathname;
  return pathname.startsWith('/_next/static/') ||
         pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$/i);
}

/**
 * Fetch y cachear en background (para stale-while-revalidate)
 */
function fetchAndCache(request, cache) {
  fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response);
      }
    })
    .catch(() => {});
}

/**
 * Auto-cachear HTML cuando se detecta navegación cliente
 * (Cuando /_next/data/BUILD_ID/ruta.json es cacheado, también cachear /ruta)
 */
function cacheHTMLForNextData(nextDataUrl) {
  try {
    const url = new URL(nextDataUrl);
    const pathname = url.pathname;

    // Extraer: /_next/data/BUILD_ID/productos.json → /productos
    const match = pathname.match(/\/_next\/data\/[^/]+\/(.+)\.json$/);

    if (!match || !match[1]) {
      return;
    }

    let pagePath = '/' + match[1];
    if (match[1] === 'index') {
      pagePath = '/';
    }

    const htmlUrl = url.origin + pagePath;

    // Crear Request object (importante para matching correcto)
    const htmlRequest = new Request(htmlUrl, {
      method: 'GET',
      headers: { 'Accept': 'text/html' }
    });

    console.warn('🔗 [SW] Auto-cacheando HTML:', htmlUrl);

    caches.open(CACHE_NAME)
      .then(cache => cache.match(htmlRequest))
      .then(existingResponse => {
        if (existingResponse) {
          console.warn('📦 [SW] HTML ya existe en cache:', htmlUrl);
          return;
        }

        console.warn('📡 [SW] Descargando HTML:', htmlUrl);
        return fetch(htmlRequest)
          .then(response => {
            if (response.ok) {
              const responseToCache = response.clone();
              return caches.open(CACHE_NAME)
                .then(cache => cache.put(htmlRequest, responseToCache))
                .then(() => {
                  console.warn('✅ [SW] HTML CACHEADO:', htmlUrl);
                });
            }
          });
      })
      .catch(err => {
        console.warn('⚠️ [SW] Error cacheando HTML:', htmlUrl, err.message || err);
      });

  } catch (err) {
    console.warn('⚠️ [SW] Error en cacheHTMLForNextData:', err.message || err);
  }
}

/**
 * Crear respuesta offline fallback
 */
function createOfflineFallback() {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sin Conexión | CreaTuActivo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 400px;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 24px;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    button {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
    }
    .footer {
      margin-top: 48px;
      color: #475569;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>Sin Conexión</h1>
    <p>Parece que no tienes conexión a internet. Verifica tu conexión e intenta nuevamente.</p>
    <button onclick="window.location.reload()">Reintentar</button>
    <div class="footer">CreaTuActivo.com</div>
  </div>
</body>
</html>
  `.trim();

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}

// Log de carga
console.warn('🚀 [SW] Service Worker v' + CACHE_VERSION + ' cargado');
