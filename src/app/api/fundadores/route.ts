/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// /src/app/api/fundadores/route.ts - CORREGIDO
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { FounderConfirmationEmail } from '@/emails/FounderConfirmation';
import { BRAND } from '@/lib/branding'; // ← USAR IMPORTACIÓN ÚNICA
import { createClient } from '@supabase/supabase-js';

// ✅ FIX: Lazy initialization para evitar error en build-time
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// ✅ FIX: Lazy initialization de Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
}

// ID del usuario Sistema para usar como fallback cuando no hay referente
const SISTEMA_USER_ID = '0456e1b9-a661-48c9-9fa1-9dc24fe007b9';

// 🎯 MAPEO: Texto descriptivo → Código corto (para consistencia con Dashboard)
function normalizePlanType(planText: string | undefined): 'inicial' | 'estrategico' | 'visionario' | 'asesoria' {
  if (!planText) return 'estrategico'; // Default

  const lowerText = planText.toLowerCase();

  // Detectar "asesoría personalizada" en el texto
  if (lowerText.includes('asesore') || lowerText.includes('asesor') || lowerText.includes('luis o liliana')) {
    return 'asesoria';
  }

  // Detectar "inicial" en el texto
  if (lowerText.includes('inicial') || lowerText.includes('$900,000') || lowerText.includes('$200')) {
    return 'inicial';
  }

  // Detectar "visionario" en el texto
  if (lowerText.includes('visionario') || lowerText.includes('$4,500,000') || lowerText.includes('$1,000')) {
    return 'visionario';
  }

  // Default: estrategico (nombre correcto según CreaTuActivo.com)
  return 'estrategico';
}

// 🎯 HELPER: Email Container Component - SOLO para email interno
const emailContainer = (content: string, isDark: boolean = true) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    @media (prefers-color-scheme: dark) {
      .dark-logo { display: block !important; }
      .light-logo { display: none !important; }
      .dark-bg { background-color: ${BRAND.colors.dark} !important; }
      .dark-text { color: ${BRAND.colors.white} !important; }
    }
    @media only screen and (max-width: 600px) {
      .mobile-padding { padding: 16px !important; }
      .mobile-padding-lg { padding: 24px !important; }
      .mobile-text { font-size: 15px !important; line-height: 22px !important; }
      .mobile-heading { font-size: 22px !important; }
      .mobile-button {
        width: 100% !important;
        display: block !important;
        text-align: center !important;
      }
      .mobile-width { width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: ${BRAND.fonts.stack}; background-color: ${isDark ? BRAND.colors.dark : BRAND.colors.gray[100]};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // ✅ VALIDACIONES
    if (!formData.email || !formData.nombre || !formData.telefono) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // ====================================================================
    // 💾 GUARDAR EN BASE DE DATOS (pending_activations)
    // ====================================================================

    console.log('🔍 [DB] Iniciando guardado en pending_activations...');
    console.log('🔍 [DB] Email prospecto:', formData.email);
    console.log('🔍 [DB] Nombre prospecto:', formData.nombre);

    // Verificar si ya existe solicitud para este email
    const { data: existingRequestRaw, error: checkError } = await getSupabaseClient()
      .from('pending_activations')
      .select('id, email, status')
      .eq('email', formData.email.toLowerCase())
      .eq('status', 'pending')
      .single();

    const existingRequest = existingRequestRaw as { id: string; email: string; status: string } | null;
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ [DB] Error verificando duplicados:', checkError);
    }

    if (existingRequest) {
      console.log('⚠️ [DB] Ya existe solicitud pendiente para:', formData.email);
      console.log('⚠️ [DB] ID existente:', existingRequest.id);
      // No bloqueamos, pero lo registramos
    } else {
      console.log('✅ [DB] Email no existe, procediendo a insertar...');

      // Obtener constructor_id del referral si existe
      let invitedById = null;
      let refParam: string | null = null;

      // ESTRATEGIA 1: Intentar obtener desde query param (?ref=...)
      refParam = new URL(request.url).searchParams.get('ref');

      if (!refParam) {
        // ESTRATEGIA 2: Extraer desde referer header
        const referer = request.headers.get('referer');
        console.log('🔍 [DB] Referer completo:', referer);

        if (referer) {
          // Opción A: Query param en referer (?ref=...)
          const queryMatch = referer.match(/[?&]ref=([^&]+)/);
          if (queryMatch) {
            refParam = queryMatch[1];
            console.log('🔍 [DB] Constructor ID extraído desde query param:', refParam);
          } else {
            // Opción B: Slug en la ruta (/fundadores/luis-cabrejo-parra-4871288)
            const pathMatch = referer.match(/\/fundadores\/([a-z0-9-]+)/);
            if (pathMatch) {
              refParam = pathMatch[1];
              console.log('🔍 [DB] Constructor ID extraído desde ruta:', refParam);
            }
          }
        }
      } else {
        console.log('🔍 [DB] Constructor ID desde query param directo:', refParam);
      }

      console.log('🔍 [DB] Parámetro ref FINAL:', refParam || 'NINGUNO');

      if (refParam) {
        // Buscar constructor por slug o ID
        const { data: constructorRaw, error: constructorError } = await getSupabaseClient()
          .from('private_users')
          .select('id, name, email')
          .or(`constructor_id.eq.${refParam},constructor_id.like.%${refParam}%`)
          .single();

        const constructor = constructorRaw as { id: string; name: string; email: string } | null;
        if (constructorError) {
          console.log('⚠️ [DB] Constructor no encontrado para ref:', refParam);
          console.log('⚠️ [DB] Error details:', constructorError.message);
        } else if (constructor) {
          invitedById = constructor.id;
          console.log('✅ [DB] Constructor referente encontrado:', constructor.name, '-', constructor.email);
        }
      }

      // 🛡️ FALLBACK: Si no se encontró constructor, usar usuario Sistema
      if (!invitedById) {
        invitedById = SISTEMA_USER_ID;
        console.log('⚠️ [DB] No se encontró constructor referente, usando Sistema como fallback');
        console.log('🔍 [DB] Sistema User ID:', SISTEMA_USER_ID);
      }

      // Normalizar plan_type antes de insertar
      const normalizedPlanType = normalizePlanType(formData.inversion);

      // Insertar en pending_activations
      console.log('🔍 [DB] Intentando INSERT con datos:', {
        name: formData.nombre.trim(),
        email: formData.email.toLowerCase().trim(),
        whatsapp: formData.telefono.trim(),
        gano_excel_id: 'PENDING',
        plan_type: normalizedPlanType,
        plan_type_original: formData.inversion, // Para logging
        status: 'pending',
        invited_by: invitedById
      });

      const { data: insertedRequestRaw, error: insertError } = await getSupabaseClient()
        .from('pending_activations')
        .insert({
          name: formData.nombre.trim(),
          email: formData.email.toLowerCase().trim(),
          whatsapp: formData.telefono.trim(),
          gano_excel_id: 'PENDING', // Se completa cuando pague
          plan_type: normalizedPlanType, // ✅ Código corto normalizado
          status: 'pending',
          invited_by: invitedById,
        })
        .select()
        .single();

      const insertedRequest = insertedRequestRaw as { id: string; email: string; name: string } | null;
      if (insertError) {
        console.error('❌ [DB] Error insertando en pending_activations:', insertError);
        console.error('❌ [DB] Error code:', insertError.code);
        console.error('❌ [DB] Error message:', insertError.message);
        console.error('❌ [DB] Error details:', insertError.details);
        console.error('❌ [DB] Error hint:', insertError.hint);

        // 🛡️ CRÍTICO: Si no se guarda en BD, NO continuar con el flujo
        return NextResponse.json(
          {
            success: false,
            error: 'Error al guardar tu solicitud. Por favor intenta de nuevo o contáctanos por WhatsApp.',
            technicalDetails: insertError.message,
            whatsapp: '+573206805737'
          },
          { status: 500 }
        );
      }

      console.log('✅ [DB] Prospecto guardado exitosamente en BD!');
      console.log('✅ [DB] ID asignado:', insertedRequest?.id);
      console.log('✅ [DB] Email guardado:', insertedRequest?.email);

      // ====================================================================
      // 🎯 ACTUALIZAR TABLA PROSPECTS (para Dashboard Mi Sistema IAA)
      // ====================================================================
      console.log('\n🔍 [PROSPECTS] Buscando prospect existente del constructor...');

      // Buscar prospect existente del constructor (puede existir si visitó la página antes)
      const { data: existingProspectsRaw, error: prospectSearchError } = await getSupabaseClient()
        .from('prospects')
        .select('id, fingerprint_id, device_info, stage, created_at')
        .eq('constructor_id', invitedById)
        .order('created_at', { ascending: false })
        .limit(5); // Últimos 5 prospects del constructor

      type ProspectRecord = { id: string; fingerprint_id: string; device_info: Record<string, unknown>; stage: string; created_at: string };
      const existingProspects = existingProspectsRaw as ProspectRecord[] | null;

      if (prospectSearchError) {
        console.error('⚠️ [PROSPECTS] Error buscando prospects:', prospectSearchError.message);
      } else {
        console.log(`🔍 [PROSPECTS] Encontrados ${existingProspects?.length || 0} prospects del constructor`);

        // Intentar encontrar el prospect correcto (por email, nombre o fecha cercana)
        let targetProspect: ProspectRecord | null | undefined = null;

        if (existingProspects && existingProspects.length > 0) {
          // Estrategia 1: Buscar por email en device_info
          targetProspect = existingProspects.find(p =>
            (p.device_info as { email?: string })?.email?.toLowerCase() === formData.email.toLowerCase()
          );

          // Estrategia 2: Buscar por nombre parcial
          if (!targetProspect) {
            targetProspect = existingProspects.find(p =>
              (p.device_info as { name?: string })?.name?.toLowerCase().includes(formData.nombre.toLowerCase().split(' ')[0])
            );
          }

          // Estrategia 3: El más reciente sin datos completos (creado en los últimos 30 minutos)
          if (!targetProspect) {
            const now = new Date();
            targetProspect = existingProspects.find(p => {
              const createdAt = new Date(p.created_at);
              const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;
              const deviceInfo = p.device_info as { name?: string; phone?: string };
              const hasIncompleteData = !deviceInfo?.name || !deviceInfo?.phone;
              return diffMinutes < 30 && hasIncompleteData;
            });
          }
        }

        if (targetProspect) {
          console.log('✅ [PROSPECTS] Prospect encontrado, actualizando...');
          console.log('🔍 [PROSPECTS] Fingerprint:', targetProspect.fingerprint_id);
          console.log('🔍 [PROSPECTS] Stage actual:', targetProspect.stage);

          // Preparar datos completos para actualizar
          const prospectData = {
            name: formData.nombre.trim(),
            email: formData.email.toLowerCase().trim(),
            phone: formData.telefono.trim(),
            whatsapp: formData.telefono.trim(),
            archetype: formData.arquetipo || null,
            package: normalizedPlanType,
            interest_level: 10, // Formulario enviado = máximo interés (stage debería avanzar a ACOGER)
            consent_granted: true,
            form_submitted: true,
            form_submitted_at: new Date().toISOString()
          };

          console.log('🔍 [PROSPECTS] Datos a actualizar:', prospectData);

          // Llamar al RPC update_prospect_data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: rpcResult, error: rpcError } = await (getSupabaseClient().rpc as any)('update_prospect_data', {
            p_fingerprint_id: targetProspect.fingerprint_id,
            p_data: prospectData,
            p_constructor_id: invitedById
          });

          const rpcData = rpcResult as { stage?: string; advanced?: boolean } | null;
          if (rpcError) {
            console.error('❌ [PROSPECTS] Error actualizando con RPC:', rpcError.message);
          } else {
            console.log('✅ [PROSPECTS] Prospect actualizado exitosamente!');
            console.log('✅ [PROSPECTS] Resultado RPC:', rpcData);
            console.log('✅ [PROSPECTS] Nuevo stage:', rpcData?.stage || 'unknown');
            console.log('✅ [PROSPECTS] Avanzó a ACOGER:', rpcData?.advanced || false);
          }
        } else {
          console.log('⚠️ [PROSPECTS] No se encontró prospect existente para actualizar');
          console.log('🎯 [PROSPECTS] Creando nuevo prospect desde formulario...');

          // Generar fingerprint único para el prospect
          const crypto = require('crypto');
          const fingerprintData = `${formData.email}-${formData.telefono}-${Date.now()}`;
          const fingerprint = crypto.createHash('sha256').update(fingerprintData).digest('hex');

          console.log('🔍 [PROSPECTS] Fingerprint generado:', fingerprint);

          // Preparar datos completos para el nuevo prospect
          const prospectData = {
            name: formData.nombre.trim(),
            email: formData.email.toLowerCase().trim(),
            phone: formData.telefono.trim(),
            whatsapp: formData.telefono.trim(),
            archetype: formData.arquetipo || null,
            package: normalizedPlanType,
            interest_level: 10, // Formulario enviado = máximo interés
            consent_granted: true,
            form_submitted: true,
            form_submitted_at: new Date().toISOString()
          };

          console.log('🔍 [PROSPECTS] Datos del nuevo prospect:', prospectData);

          // Llamar al RPC para crear el prospect
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: rpcResult2, error: rpcError2 } = await (getSupabaseClient().rpc as any)('update_prospect_data', {
            p_fingerprint_id: fingerprint,
            p_data: prospectData,
            p_constructor_id: invitedById
          });

          const rpcData2 = rpcResult2 as { stage?: string; advanced?: boolean } | null;
          if (rpcError2) {
            console.error('❌ [PROSPECTS] Error creando prospect con RPC:', rpcError2.message);
            console.error('❌ [PROSPECTS] RPC Error details:', rpcError2);
          } else {
            console.log('✅ [PROSPECTS] Prospect creado exitosamente!');
            console.log('✅ [PROSPECTS] Resultado RPC:', rpcData2);
            console.log('✅ [PROSPECTS] Stage inicial:', rpcData2?.stage || 'INICIAR');
            console.log('✅ [PROSPECTS] Avanzó a ACOGER:', rpcData2?.advanced || false);
          }
        }
      }
    }

    // ====================================================================
    // 📧 EMAIL 1: NOTIFICACIÓN INTERNA
    // ====================================================================
    const internalEmailContent = `
      <!-- Header -->
      <tr>
        <td style="background-color: ${BRAND.colors.blue}; padding: 30px 40px; text-align: center;" class="mobile-padding-lg">
          <h1 style="margin: 0; color: ${BRAND.colors.white}; font-size: 24px; font-weight: 700;" class="mobile-heading">
            Nueva Solicitud de Fundador
          </h1>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="background-color: ${BRAND.colors.white}; padding: 40px;" class="mobile-padding-lg">

          <!-- Applicant Info Card -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                 style="background-color: ${BRAND.colors.gray[100]}; border-radius: 8px; margin-bottom: 30px;">
            <tr>
              <td style="padding: 24px;" class="mobile-padding">
                <h2 style="margin: 0 0 20px; color: ${BRAND.colors.dark}; font-size: 20px; font-weight: 600;">
                  ${formData.nombre}
                </h2>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="8" border="0">
                  <tr>
                    <td width="30%" style="color: ${BRAND.colors.gray[500]}; font-size: 14px; min-width: 80px;">Email:</td>
                    <td style="color: ${BRAND.colors.dark}; font-size: 14px;" class="mobile-text">
                      <a href="mailto:${formData.email}" style="color: ${BRAND.colors.blue}; text-decoration: none;">
                        ${formData.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: ${BRAND.colors.gray[500]}; font-size: 14px;">WhatsApp:</td>
                    <td style="color: ${BRAND.colors.dark}; font-size: 14px;" class="mobile-text">
                      <a href="https://wa.me/${formData.telefono.replace(/\D/g, '')}"
                         style="color: ${BRAND.colors.purple}; text-decoration: none;">
                        ${formData.telefono}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: ${BRAND.colors.gray[500]}; font-size: 14px; vertical-align: top;">Perfil:</td>
                    <td style="color: ${BRAND.colors.dark}; font-size: 14px; line-height: 20px;" class="mobile-text">
                      ${formData.arquetipo || 'No especificado'}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: ${BRAND.colors.gray[500]}; font-size: 14px; vertical-align: top;">Inversión:</td>
                    <td style="color: ${BRAND.colors.dark}; font-size: 14px; line-height: 20px;" class="mobile-text">
                      ${formData.inversion || 'No especificado'}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- CTA Button -->
          <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" class="mobile-width">
            <tr>
              <td style="background-color: ${BRAND.colors.gold}; border-radius: 8px;" class="mobile-button">
                <a href="https://wa.me/${formData.telefono.replace(/\D/g, '')}"
                   style="display: block; padding: 16px 32px; color: ${BRAND.colors.dark}; text-decoration: none; font-weight: 700; font-size: 16px; text-align: center;">
                  Contactar por WhatsApp →
                </a>
              </td>
            </tr>
          </table>

          <!-- Metadata -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                 style="margin-top: 30px; border-top: 1px solid ${BRAND.colors.gray[300]}; padding-top: 20px;">
            <tr>
              <td style="color: ${BRAND.colors.gray[500]}; font-size: 12px; line-height: 20px;">
                <strong>Timestamp:</strong> ${new Date().toLocaleString('es-CO', {
                  timeZone: 'America/Bogota',
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}<br>
                <strong>Fuente:</strong> Página /fundadores<br>
                <strong>IP:</strong> ${request.headers.get('x-forwarded-for') || 'N/A'}
              </td>
            </tr>
          </table>

        </td>
      </tr>
    `;

    // ✅ ENVÍO EMAIL INTERNO
    const { data: mainEmail, error: mainError } = await getResendClient().emails.send({
      from: 'Sistema CreaTuActivo <sistema@creatuactivo.com>',
      to: 'sistema@creatuactivo.com',
      subject: `🚀 Nueva Solicitud: ${formData.nombre}`,
      html: emailContainer(internalEmailContent, false)
    });

    if (mainError) {
      console.error('Error enviando email interno:', mainError);
      return NextResponse.json({ error: 'Error en notificación' }, { status: 500 });
    }

    // ====================================================================
    // 📧 EMAIL 2: CONFIRMACIÓN USUARIO - USANDO REACT EMAIL
    // ====================================================================

    // Extraer primer nombre para personalización
    const firstName = formData.nombre.split(' ')[0];

    try {
      // Intentar con React Email primero
      const { data: confirmationEmail, error: confirmationError } = await getResendClient().emails.send({
        from: 'CreaTuActivo <noreply@creatuactivo.com>',
        to: formData.email,
        subject: `✅ Confirmación de Solicitud - ${firstName}`,
        react: FounderConfirmationEmail({ firstName }) // ← CORRECTO: Pasar como objeto
      });

      if (confirmationError) {
        throw new Error(`Error React Email: ${confirmationError.message}`);
      }

      console.log('✅ Emails enviados exitosamente:', {
        internal: mainEmail?.id,
        confirmation: confirmationEmail?.id,
        user: formData.nombre,
        method: 'react-email'
      });

      return NextResponse.json({
        success: true,
        message: 'Solicitud procesada exitosamente',
        emailId: mainEmail?.id,
        confirmationEmailId: confirmationEmail?.id
      });

    } catch (reactEmailError) {
      console.error('Error con React Email, usando HTML fallback:', reactEmailError);

      // 🔄 FALLBACK: HTML directo si React Email falla
      const fallbackUserEmailContent = `
        <!-- Header con Logo -->
        <tr>
          <td style="background-color: ${BRAND.colors.dark}; padding: 30px 20px; text-align: center;" class="dark-bg mobile-padding-lg">
            <img src="${BRAND.urls.logo}" alt="CreaTuActivo"
                 style="height: 40px; width: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;"
                 width="150" height="40">
            <h1 style="margin: 0; color: ${BRAND.colors.white}; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;" class="dark-text mobile-heading">
              Hola ${firstName}
            </h1>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="background-color: ${BRAND.colors.darkAlt}; padding: 30px 20px;" class="mobile-padding-lg">

            <!-- Status Card -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                   style="background-color: rgba(30, 64, 175, 0.1); border: 1px solid rgba(30, 64, 175, 0.2);
                          border-radius: 12px; margin-bottom: 30px;">
              <tr>
                <td align="center" style="padding: 28px 16px;" class="mobile-padding">
                  <div style="font-size: 48px; margin: 0 0 20px 0;"></div>
                  <h2 style="margin: 0 0 16px; color: ${BRAND.colors.white}; font-size: 24px; font-weight: 600;" class="mobile-heading">
                    Solicitud Recibida
                  </h2>
                  <p style="margin: 0; color: ${BRAND.colors.gray[400]}; font-size: 15px; line-height: 24px; padding: 0 10px;" class="mobile-text">
                    Tu aplicación para ser Fundador está siendo<br>
                    evaluada por nuestro Comité de Arquitectos
                  </p>
                </td>
              </tr>
            </table>

            <!-- CTA Section -->
            <table role="presentation" align="center" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" style="padding: 24px 0 16px;">
                  <p style="margin: 0 0 24px; color: ${BRAND.colors.gray[400]}; font-size: 15px;" class="mobile-text">
                    Mientras esperas, explora el ecosistema:
                  </p>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="mobile-width">
                    <tr>
                      <td style="background-color: ${BRAND.colors.gold}; border-radius: 8px;">
                        <a href="${BRAND.urls.base}/ecosistema?nombre=${encodeURIComponent(firstName)}"
                           style="display: block; padding: 16px 32px; color: ${BRAND.colors.dark};
                                  text-decoration: none; font-weight: 700; font-size: 16px; text-align: center; line-height: 24px;">
                          Explora el Ecosistema de Fundadores
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: ${BRAND.colors.dark}; padding: 24px 20px; text-align: center;
                     border-top: 1px solid rgba(255,255,255,0.1);" class="mobile-padding">
            <p style="margin: 0 0 8px; color: ${BRAND.colors.gray[400]}; font-size: 14px;">
              Luis Cabrejo
            </p>
            <p style="margin: 0 0 16px; color: ${BRAND.colors.gray[500]}; font-size: 12px;">
              Co-Fundadores de CreaTuActivo
            </p>
            <p style="margin: 0; color: ${BRAND.colors.gray[500]}; font-size: 11px; line-height: 18px;">
              © ${new Date().getFullYear()} CreaTuActivo.com<br>
              El primer ecosistema tecnológico para construcción de activos en América
            </p>
          </td>
        </tr>
      `;

      // Enviar email de fallback
      const { data: fallbackEmail } = await getResendClient().emails.send({
        from: 'CreaTuActivo <noreply@creatuactivo.com>',
        to: formData.email,
        subject: `✅ Confirmación de Solicitud - ${firstName}`,
        html: emailContainer(fallbackUserEmailContent, true)
      });

      console.log('✅ Email enviado con HTML fallback:', {
        internal: mainEmail?.id,
        confirmation: fallbackEmail?.id,
        user: formData.nombre,
        method: 'html-fallback'
      });

      return NextResponse.json({
        success: true,
        message: 'Solicitud procesada exitosamente',
        emailId: mainEmail?.id,
        confirmationEmailId: fallbackEmail?.id,
        note: 'Usado fallback HTML para confirmación'
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ✅ OPTIONS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
