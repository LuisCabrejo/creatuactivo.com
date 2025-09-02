// CreaTuActivo.com Service Worker
// Versión básica para desarrollo - resuelve 404s sin afectar funcionalidad

const CACHE_NAME = 'creatuactivo-v1';
const STATIC_ASSETS = [
  '/',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/og-image.jpg'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('CreaTuActivo SW: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('CreaTuActivo SW: Caching static assets');
        // Solo cachear assets que existen - evitar 404s
        return cache.addAll(['/']);
      })
      .catch((err) => {
        console.warn('CreaTuActivo SW: Cache failed, continuing without cache', err);
      })
  );

  // Activar inmediatamente
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('CreaTuActivo SW: Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('CreaTuActivo SW: Cleaning old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Tomar control inmediatamente
  self.clients.claim();
});

// Fetch event - estrategia Network First para desarrollo
self.addEventListener('fetch', (event) => {
  // Solo manejar requests GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requests de Next.js internal
  if (event.request.url.includes('/_next/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es exitosa, devuélvela
        if (response && response.status === 200) {
          return response;
        }

        // Si falla, intentar desde cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            return cachedResponse || response;
          });
      })
      .catch((error) => {
        console.warn('CreaTuActivo SW: Fetch failed for', event.request.url, error);

        // Intentar desde cache como fallback
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // Para favicons faltantes, devolver respuesta vacía en lugar de 404
            if (event.request.url.includes('favicon') ||
                event.request.url.includes('.png') ||
                event.request.url.includes('.ico')) {
              return new Response('', {
                status: 200,
                statusText: 'OK',
                headers: {
                  'Content-Type': 'image/png',
                  'Cache-Control': 'public, max-age=86400'
                }
              });
            }

            // Para otros recursos, permitir que falle naturalmente
            throw error;
          });
      })
  );
});

// Mensaje de debug
console.log('CreaTuActivo SW: Service Worker loaded successfully');
