/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// ========================================
// SISTEMA DE TRACKING FRAMEWORK IAA
// Identifica prospectos y mantiene atribución
// VERSION: v1.3 - Debug Mejorado + Error Handling
// ========================================

(function() {
    // Configuración Supabase desde window o valores por defecto
    const SUPABASE_URL = window.TRACKING_CONFIG?.SUPABASE_URL || 'https://cvadzbmdypnbrbnkznpb.supabase.co';
    const SUPABASE_ANON_KEY = window.TRACKING_CONFIG?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2YWR6Ym1keXBuYnJibmt6bnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4OTI3MzIsImV4cCI6MjA3MTQ2ODczMn0.H_FJnsHnkcafwvWdX7AA6zNsUTr32qiR3g4dwK2oYGo';

    // Generar fingerprint único del navegador
    async function generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fingerprint', 2, 2);
        const canvasData = canvas.toDataURL();

        const components = [
            navigator.userAgent,
            navigator.language,
            screen.colorDepth,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvasData
            // ⚠️ Sin componente aleatorio (22 sep 2026): con `Math.random()` cada
            // carga de página era una huella nueva, o sea un prospecto nuevo y un
            // aviso «Nuevo visitante» nuevo al socio en cada recarga (16 avisos en
            // 12 minutos por un solo teléfono). La huella tiene que ser la misma
            // para el mismo navegador; lo que cambia por visita lo cuenta `visits`.
        ];

        const fingerprint = await crypto.subtle.digest('SHA-256',
            new TextEncoder().encode(components.join('|'))
        );

        return Array.from(new Uint8Array(fingerprint))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Obtener o crear cookie
    function getCookieId() {
        let cookieId = document.cookie
            .split('; ')
            .find(row => row.startsWith('nexus_prospect_id='))
            ?.split('=')[1];

        if (!cookieId) {
            cookieId = 'ck_' + Math.random().toString(36).substr(2, 9);
            document.cookie = `nexus_prospect_id=${cookieId}; max-age=31536000; path=/; SameSite=Lax`;
        }

        return cookieId;
    }

    // Obtener parámetro ref del URL (query param o path)
    function getConstructorRef() {
        let ref = null;

        // Opción 1: Leer de query param (retrocompatibilidad)
        const urlParams = new URLSearchParams(window.location.search);
        ref = urlParams.get('ref');

        // Opción 2: Leer desde el path (NUEVO formato limpio)
        // Ejemplo: /fundadores/luiscabrejo-4871288 → luiscabrejo-4871288
        if (!ref) {
            const pathParts = window.location.pathname.split('/').filter(part => part);
            const lastPart = pathParts[pathParts.length - 1];

            // Validar que el último segmento tiene formato de constructor_id
            // Formato esperado: nombre-apellido-GANOEXCELID (termina con guión y dígitos)
            // Ejemplos válidos: luiscabrejo-4871288, juan-perez-123456
            if (lastPart && /^[a-z0-9-]+-\d+$/.test(lastPart)) {
                ref = lastPart;
                console.log('✅ Constructor REF detectado desde path:', ref);
            }
        }

        // Si no hay ref en URL (ni query ni path), buscar en localStorage (visitas posteriores)
        if (!ref) {
            ref = localStorage.getItem('constructor_ref');
        } else {
            // Guardar ref en localStorage para futuras visitas
            localStorage.setItem('constructor_ref', ref);
            console.log('✅ Constructor REF guardado en localStorage:', ref);
        }

        return ref;
    }

    // Detectar dispositivo
    function getDeviceInfo() {
        const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
        const isTablet = /iPad|Tablet/i.test(navigator.userAgent);

        return {
            device: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
            browser: navigator.userAgent.match(/(firefox|chrome|safari|edge)/i)?.[0] || 'unknown',
            os: navigator.platform
        };
    }

    // Identificar prospecto al cargar
    async function identifyProspect() {
        try {
            // La huella se conserva entre visitas: si ya se generó en este
            // navegador, se reutiliza (es lo que hace que `is_returning` y
            // `visits` signifiquen algo). Solo se genera si no hay una válida.
            let fingerprint = null;
            try { fingerprint = localStorage.getItem('nexus_fingerprint'); } catch (e) {}
            if (!fingerprint || !/^[0-9a-f]{64}$/.test(fingerprint)) fingerprint = await generateFingerprint();
            const cookieId = getCookieId();
            const deviceInfo = getDeviceInfo();
            const constructorRef = getConstructorRef();

            // Guardar en localStorage
            localStorage.setItem('nexus_fingerprint', fingerprint);
            localStorage.setItem('nexus_cookie', cookieId);

            console.log('🎯 Framework IAA - Identificando prospecto...');
            console.log('🔑 Fingerprint generado:', fingerprint);

            if (constructorRef) {
                console.log('👤 Constructor REF detectado:', constructorRef);
            }

            // Construir URL con ref si existe y no está ya en la URL
            let currentUrl = window.location.href;
            if (constructorRef && !currentUrl.includes('?ref=') && !currentUrl.includes('&ref=')) {
                currentUrl = currentUrl + (currentUrl.includes('?') ? '&' : '?') + `ref=${constructorRef}`;
            }

            console.log('📡 Llamando a identify_prospect RPC...');

            // Llamar a Supabase RPC
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/identify_prospect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    p_fingerprint: fingerprint,
                    p_cookie: cookieId,
                    p_url: currentUrl,
                    p_device: deviceInfo
                })
            });

            console.log('📥 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error HTTP:', response.status, response.statusText);
                console.error('❌ Error body:', errorText);
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Datos recibidos de identify_prospect:', data);

            if (data && data.length > 0) {
                const prospectInfo = data[0];

                // Actualizar FrameworkIAA existente (no reemplazar, para preservar referencias)
                window.FrameworkIAA.fingerprint = fingerprint;
                window.FrameworkIAA.constructorRef = constructorRef;
                window.FrameworkIAA.prospect = {
                    id: prospectInfo.prospect_id,
                    constructorId: prospectInfo.constructor_id,
                    isReturning: prospectInfo.is_returning,
                    visits: prospectInfo.visits
                };
                window.FrameworkIAA.updateProspectData = window.updateProspectData;
                window.FrameworkIAA.ready = true;
                window.FrameworkIAA.error = null;

                // BACKWARD COMPATIBILITY
                window.nexusProspect = {
                    id: prospectInfo.prospect_id,
                    constructorId: prospectInfo.constructor_id,
                    isReturning: prospectInfo.is_returning,
                    visits: prospectInfo.visits,
                    fingerprint: fingerprint,
                    constructorRef: constructorRef
                };

                console.log('✅ Prospecto identificado:', {
                    fingerprint: fingerprint,
                    prospectId: prospectInfo.prospect_id,
                    constructorRef: constructorRef,
                    isReturning: prospectInfo.is_returning,
                    visits: prospectInfo.visits
                });

                console.log('✅ window.FrameworkIAA creado:', window.FrameworkIAA);

                // Si NEXUS existe, pasarle el contexto
                if (window.NEXUS) {
                    window.NEXUS.setProspectContext(window.nexusProspect);
                }

                // Emitir eventos
                window.dispatchEvent(new CustomEvent('prospectIdentified', {
                    detail: {
                        fingerprint: fingerprint,
                        prospect: prospectInfo,
                        constructorRef: constructorRef
                    }
                }));

                window.dispatchEvent(new CustomEvent('nexusTrackingReady', {
                    detail: window.FrameworkIAA
                }));

            } else {
                console.error('❌ No se recibieron datos del prospecto');
            }
        } catch (error) {
            console.error('❌ Error identificando prospecto:', error);
            console.error('❌ Error name:', error.name);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error stack:', error.stack);

            // Actualizar FrameworkIAA con error (mantener stub existente)
            window.FrameworkIAA.error = error instanceof Error ? error.message : String(error);
            window.FrameworkIAA.ready = false;

            console.log('⚠️ FrameworkIAA con error:', window.FrameworkIAA);
        }
    }

    // Función para actualizar datos del prospecto (MEJORADA CON DEBUG)
    window.updateProspectData = async function(data) {
        try {
            const fingerprint = window.FrameworkIAA?.fingerprint || localStorage.getItem('nexus_fingerprint');

            if (!fingerprint) {
                console.error('❌ No hay fingerprint disponible para actualizar datos');
                return false;
            }

            console.log('📤 Actualizando datos del prospecto:', data);

            const payload = {
                p_fingerprint_id: fingerprint,
                p_data: data
            };

            console.log('📦 Payload completo:', payload);

            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/update_prospect_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify(payload)
            });

            console.log('📥 update_prospect_data - Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error HTTP en update_prospect_data:', response.status);
                console.error('❌ Error body:', errorText);
                throw new Error(`HTTP error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Datos actualizados exitosamente:', result);

            return result;
        } catch (error) {
            console.error('❌ Error actualizando datos:', error);
            console.error('❌ Error name:', error.name);
            console.error('❌ Error message:', error.message);
            return false;
        }
    };

    // Tracking de tiempo en página
    let startTime = Date.now();
    let timeSpent = 0;

    // Actualizar tiempo cada 30 segundos
    setInterval(() => {
        timeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (window.FrameworkIAA?.fingerprint && timeSpent > 30) {
            console.log('⏱️ Actualizando tiempo (30s interval):', timeSpent, 'segundos');
            window.updateProspectData({
                tiempo_total_segundos: timeSpent
            });
        }
    }, 30000);

    // Enviar tiempo total al salir (DEBUG MEJORADO)
    window.addEventListener('beforeunload', () => {
        timeSpent = Math.floor((Date.now() - startTime) / 1000);

        if (window.FrameworkIAA?.fingerprint) {
            const payload = {
                p_fingerprint_id: window.FrameworkIAA.fingerprint,
                p_data: {
                    tiempo_total_segundos: timeSpent,
                    ultima_visita: new Date().toISOString()
                }
            };

            console.log('🔍 DEBUG beforeunload - Enviando:', payload);
            console.log('🔍 DEBUG - Tiempo total:', timeSpent, 'segundos');

            // Usar fetch con keepalive
            fetch(`${SUPABASE_URL}/rest/v1/rpc/update_prospect_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify(payload),
                keepalive: true
            }).then(response => {
                console.log('✅ beforeunload - Response status:', response.status);
                console.log('✅ beforeunload - Response headers:', [...response.headers.entries()]);
                return response.text();
            }).then(text => {
                console.log('✅ beforeunload - Response body:', text);
            }).catch(err => {
                console.error('❌ ERROR COMPLETO en beforeunload:', err);
                console.error('❌ Error name:', err.name);
                console.error('❌ Error message:', err.message);
                console.error('❌ Error stack:', err.stack);
            });
        }
    });

    // BACKWARD COMPATIBILITY
    window.getProspectContext = function() {
        return window.nexusProspect || window.FrameworkIAA?.prospect || null;
    };

    // Función para forzar re-identificación
    window.reidentifyProspect = async function() {
        console.log('🔄 Re-identificando prospecto...');
        await identifyProspect();
    };

    // DEBUGGING MEJORADO
    window.debugTracking = function() {
        console.log('═══════════════════════════════════════');
        console.log('🔍 ESTADO COMPLETO DEL TRACKING');
        console.log('═══════════════════════════════════════');
        console.log('📊 window.FrameworkIAA:', window.FrameworkIAA);
        console.log('🔑 Fingerprint:', window.FrameworkIAA?.fingerprint);
        console.log('👤 Constructor REF:', window.FrameworkIAA?.constructorRef);
        console.log('💾 localStorage fingerprint:', localStorage.getItem('nexus_fingerprint'));
        console.log('💾 localStorage ref:', localStorage.getItem('constructor_ref'));
        console.log('🍪 Cookie tracking:', document.cookie.includes('nexus_prospect_id'));
        console.log('👥 Prospect data:', window.nexusProspect);
        console.log('⏱️ Tiempo actual en página:', Math.floor((Date.now() - startTime) / 1000), 'segundos');
        console.log('🌐 URL actual:', window.location.href);
        console.log('🔧 Supabase URL:', SUPABASE_URL);
        console.log('═══════════════════════════════════════');
    };

    // ========================================
    // OPTIMIZACIÓN PAGESP INSIGHTS:
    // Diferir identify_prospect hasta que el navegador esté idle
    // Crear stub inmediato para evitar race conditions con NEXUS
    // ========================================

    // PASO 1: Crear stub inmediato (sincrónico, no bloquea render)
    const fallbackFingerprint = localStorage.getItem('nexus_fingerprint') || 'pending_' + Date.now();
    const constructorRef = getConstructorRef();

    window.FrameworkIAA = {
        fingerprint: fallbackFingerprint,
        constructorRef: constructorRef,
        prospect: null,
        ready: false,
        error: null,
        // Función para esperar a que esté listo
        whenReady: function(callback) {
            if (this.ready) {
                callback(this);
            } else {
                window.addEventListener('nexusTrackingReady', () => callback(this));
            }
        }
    };

    console.log('⚡ FrameworkIAA stub creado (optimizado):', window.FrameworkIAA);

    // PASO 2: Diferir identify_prospect hasta que el navegador esté idle
    function scheduleIdentifyProspect() {
        // Usar requestIdleCallback si está disponible (mejor para performance)
        if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
                console.log('⚡ Ejecutando identify_prospect en idle callback');
                await identifyProspect();
                window.FrameworkIAA.ready = true;
            }, { timeout: 2000 }); // Max 2s de espera
        } else {
            // Fallback: setTimeout con delay mínimo
            setTimeout(async () => {
                console.log('⚡ Ejecutando identify_prospect en setTimeout fallback');
                await identifyProspect();
                window.FrameworkIAA.ready = true;
            }, 0);
        }
    }

    // PASO 3: Esperar a que el DOM esté listo antes de programar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleIdentifyProspect);
    } else {
        scheduleIdentifyProspect();
    }

    console.log('═══════════════════════════════════════');
    console.log('🚀 Framework IAA Tracking v1.3 cargado');
    console.log('🔧 Compatible con NEXUS API');
    console.log('🐛 Debug Mode: ACTIVADO');
    console.log('═══════════════════════════════════════');
    console.log('Configuracion:', {
        SUPABASE_URL: SUPABASE_URL,
        TRACKING_CONFIG: window.TRACKING_CONFIG
    });
})();
