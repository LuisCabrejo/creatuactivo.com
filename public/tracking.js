// ========================================
// SISTEMA DE TRACKING FRAMEWORK IAA
// Identifica prospectos y mantiene atribución
// VERSION: v1.1 - Compatible con NEXUS API
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
            canvasData,
            Math.random().toString()
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
            const fingerprint = await generateFingerprint();
            const cookieId = getCookieId();
            const deviceInfo = getDeviceInfo();

            // Guardar en localStorage
            localStorage.setItem('nexus_fingerprint', fingerprint);
            localStorage.setItem('nexus_cookie', cookieId);

            console.log('🔍 Framework IAA - Identificando prospecto...');
            console.log('📊 Fingerprint generado:', fingerprint);

            // Llamar a Supabase
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
                    p_url: window.location.href,
                    p_device: deviceInfo
                })
            });

            const data = await response.json();

            if (data && data.length > 0) {
                const prospectInfo = data[0];

                // CRÍTICO: Crear API FrameworkIAA compatible con NEXUS
                window.FrameworkIAA = {
                    fingerprint: fingerprint,
                    prospect: {
                        id: prospectInfo.prospect_id,
                        constructorId: prospectInfo.constructor_id,
                        isReturning: prospectInfo.is_returning,
                        visits: prospectInfo.visits
                    },
                    // Mantener compatibilidad con código existente
                    updateProspectData: window.updateProspectData
                };

                // BACKWARD COMPATIBILITY: Mantener window.nexusProspect
                window.nexusProspect = {
                    id: prospectInfo.prospect_id,
                    constructorId: prospectInfo.constructor_id,
                    isReturning: prospectInfo.is_returning,
                    visits: prospectInfo.visits,
                    fingerprint: fingerprint
                };

                console.log('✅ Prospecto identificado:', {
                    fingerprint: fingerprint,
                    prospectId: prospectInfo.prospect_id,
                    isReturning: prospectInfo.is_returning,
                    visits: prospectInfo.visits
                });

                console.log('🌟 window.FrameworkIAA creado:', window.FrameworkIAA);

                // Si NEXUS existe, pasarle el contexto
                if (window.NEXUS) {
                    window.NEXUS.setProspectContext(window.nexusProspect);
                }

                // Emitir evento personalizado
                window.dispatchEvent(new CustomEvent('prospectIdentified', {
                    detail: {
                        fingerprint: fingerprint,
                        prospect: prospectInfo
                    }
                }));

                // Emitir evento para NEXUS específicamente
                window.dispatchEvent(new CustomEvent('nexusTrackingReady', {
                    detail: window.FrameworkIAA
                }));

            } else {
                console.error('❌ No se recibieron datos del prospecto');
            }
        } catch (error) {
            console.error('❌ Error identificando prospecto:', error);

            // Fallback: crear FrameworkIAA con datos mínimos
            const fallbackFingerprint = localStorage.getItem('nexus_fingerprint') || 'fallback_' + Date.now();
            window.FrameworkIAA = {
                fingerprint: fallbackFingerprint,
                prospect: null,
                error: error instanceof Error ? error.message : String(error)
            };

            console.log('⚠️ FrameworkIAA fallback creado:', window.FrameworkIAA);
        }
    }

    // Función para actualizar datos del prospecto
    window.updateProspectData = async function(data) {
        try {
            const fingerprint = window.FrameworkIAA?.fingerprint || localStorage.getItem('nexus_fingerprint');

            if (!fingerprint) {
                console.error('❌ No hay fingerprint disponible para actualizar datos');
                return;
            }

            console.log('📊 Actualizando datos del prospecto:', data);

            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/update_prospect_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    p_fingerprint_id: fingerprint,
                    p_data: data
                })
            });

            const result = await response.json();
            console.log('✅ Datos actualizados exitosamente:', result);

            return result;
        } catch (error) {
            console.error('❌ Error actualizando datos:', error);
        }
    };

    // Tracking de tiempo en página
    let startTime = Date.now();
    let timeSpent = 0;

    // Actualizar tiempo cada 30 segundos
    setInterval(() => {
        timeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (window.FrameworkIAA?.fingerprint && timeSpent > 30) {
            window.updateProspectData({
                tiempo_total_segundos: timeSpent
            });
        }
    }, 30000);

    // Enviar tiempo total al salir
    window.addEventListener('beforeunload', () => {
        timeSpent = Math.floor((Date.now() - startTime) / 1000);

        // Enviar tiempo total con beacon API
        if (window.FrameworkIAA?.fingerprint) {
            const payload = JSON.stringify({
                p_fingerprint_id: window.FrameworkIAA.fingerprint,
                p_data: {
                    tiempo_total_segundos: timeSpent,
                    ultima_visita: new Date().toISOString()
                }
            });

            navigator.sendBeacon(
                `${SUPABASE_URL}/rest/v1/rpc/update_prospect_data`,
                new Blob([payload], { type: 'application/json' })
            );
        }
    });

    // Función helper para obtener el contexto del prospecto (BACKWARD COMPATIBILITY)
    window.getProspectContext = function() {
        return window.nexusProspect || window.FrameworkIAA?.prospect || null;
    };

    // Función para forzar re-identificación
    window.reidentifyProspect = async function() {
        console.log('🔄 Re-identificando prospecto...');
        await identifyProspect();
    };

    // DEBUGGING: Función para verificar estado del tracking
    window.debugTracking = function() {
        console.log('🔍 ESTADO DEL TRACKING:');
        console.log('- window.FrameworkIAA:', window.FrameworkIAA);
        console.log('- Fingerprint disponible:', window.FrameworkIAA?.fingerprint);
        console.log('- localStorage fingerprint:', localStorage.getItem('nexus_fingerprint'));
        console.log('- Cookie tracking:', document.cookie.includes('nexus_prospect_id'));
        console.log('- Prospect data:', window.nexusProspect);
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', identifyProspect);
    } else {
        // Delay mínimo para asegurar que el DOM esté completamente listo
        setTimeout(identifyProspect, 100);
    }

    // Log para confirmar que el script está cargado
    console.log('🚀 Framework IAA Tracking v1.1 cargado - Compatible con NEXUS API');

    // DEBUG: Verificar configuración
    console.log('🔧 Configuración:', {
        SUPABASE_URL: SUPABASE_URL,
        TRACKING_CONFIG: window.TRACKING_CONFIG
    });
})();
