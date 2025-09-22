// /src/app/api/fundadores/route.ts - HYBRID APPROACH: HTML + React Email
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { FounderConfirmationEmail } from '@/emails/FounderConfirmation'; // ← Nuevo componente React Email

const resend = new Resend(process.env.RESEND_API_KEY);

// 🎨 DESIGN TOKENS - Mantenemos para el email interno (funciona perfecto)
const BRAND = {
  colors: {
    blue: '#1E40AF',
    purple: '#7C3AED',
    gold: '#F59E0B',
    dark: '#0f172a',
    darkAlt: '#1e293b',
    white: '#FFFFFF',
    gray: {
      100: '#f1f5f9',
      300: '#cbd5e1',
      500: '#64748b',
      700: '#334155'
    }
  },
  fonts: {
    stack: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  urls: {
    base: 'https://creatuactivo.com',
    logo: 'https://creatuactivo.com/logo-email-header-200x80.png'
  }
};

// 🎯 HELPER: Email Container Component - SOLO para email interno
const emailContainer = (content: string, isDark: boolean = true) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
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

    // ✅ VALIDACIONES - Se mantienen exactamente iguales
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
    // 📧 EMAIL 1: NOTIFICACIÓN INTERNA - SE MANTIENE EXACTAMENTE IGUAL
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

    // ✅ ENVÍO EMAIL INTERNO - Se mantiene exactamente igual
    const { data: mainEmail, error: mainError } = await resend.emails.send({
      from: 'Sistema CreaTuActivo <sistema@creatuactivo.com>',
      to: ['luiscabrejo7@gmail.com', 'lilianapatriciamoreno7@gmail.com'],
      subject: `🚀 Nueva Solicitud: ${formData.nombre}`,
      html: emailContainer(internalEmailContent, false)
    });

    if (mainError) {
      console.error('Error enviando email interno:', mainError);
      return NextResponse.json({ error: 'Error en notificación' }, { status: 500 });
    }

    // ====================================================================
    // 📧 EMAIL 2: CONFIRMACIÓN USUARIO - USANDO HTML CONFIABLE TEMPORAL
    // ====================================================================

    // Extraer primer nombre para personalización
    const firstName = formData.nombre.split(' ')[0];

    // TEMPORAL: Usar HTML directo mientras resolvemos React Email
    const userEmailContent = `
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
                <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 24px;">
                  <tr>
                    <td style="width: 64px; height: 64px; background-color: ${BRAND.colors.blue}; border-radius: 12px; text-align: center; vertical-align: middle; font-size: 32px; font-weight: bold; color: ${BRAND.colors.white}; line-height: 64px; font-family: Arial, sans-serif;">

                    </td>
                  </tr>
                </table>
                <h2 style="margin: 0 0 16px; color: ${BRAND.colors.white}; font-size: 24px; font-weight: 600;" class="mobile-heading">
                  Solicitud Recibida
                </h2>
                <p style="margin: 0; color: ${BRAND.colors.gray[300]}; font-size: 15px; line-height: 24px; padding: 0 10px;" class="mobile-text">
                  Tu aplicación para ser Fundador está siendo<br>
                  evaluada por nuestro Comité de Arquitectos
                </p>
              </td>
            </tr>
          </table>

          <!-- Timeline -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                 style="background-color: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.2);
                        border-radius: 12px; margin-bottom: 36px;">
            <tr>
              <td style="padding: 24px 20px;" class="mobile-padding">
                <h3 style="margin: 0 0 20px; color: ${BRAND.colors.white}; font-size: 18px; font-weight: 600;">
                  Próximos Pasos
                </h3>
                <p style="margin: 0 0 12px; color: ${BRAND.colors.gray[300]}; font-size: 14px; line-height: 22px;" class="mobile-text">
                  <strong style="color: ${BRAND.colors.gold};">▶</strong>
                  Revisión de tu perfil (24-48 horas)
                </p>
                <p style="margin: 0 0 12px; color: ${BRAND.colors.gray[300]}; font-size: 14px; line-height: 22px;" class="mobile-text">
                  <strong style="color: ${BRAND.colors.gold};">▶</strong>
                  Contacto directo si calificas
                </p>
                <p style="margin: 0; color: ${BRAND.colors.gray[300]}; font-size: 14px; line-height: 22px;" class="mobile-text">
                  <strong style="color: ${BRAND.colors.gold};">▶</strong>
                  Consultoría estratégica exclusiva
                </p>
              </td>
            </tr>
          </table>

          <!-- CTA Section -->
          <table role="presentation" align="center" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="padding: 24px 0 16px;">
                <p style="margin: 0 0 24px; color: ${BRAND.colors.gray[300]}; font-size: 15px;" class="mobile-text">
                  Mientras esperas, explora el ecosistema:
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="mobile-width">
                  <tr>
                    <td style="background-color: ${BRAND.colors.gold}; border-radius: 8px;">
                      <a href="${BRAND.urls.base}/"
                         style="display: block; padding: 16px 32px; color: ${BRAND.colors.dark};
                                text-decoration: none; font-weight: 700; font-size: 16px; text-align: center; line-height: 24px;">
                        Explorar CreaTuActivo.com
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
          <p style="margin: 0 0 8px; color: ${BRAND.colors.gray[300]}; font-size: 14px;">
            Luis Cabrejo & Liliana Moreno
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

    try {
      const { data: confirmationEmail, error: confirmationError } = await resend.emails.send({
        from: 'CreaTuActivo <noreply@creatuactivo.com>',
        to: formData.email,
        subject: `✅ Confirmación de Solicitud - ${firstName}`,
        html: emailContainer(userEmailContent, true) // ← Usando HTML confiable temporalmente
      });

      if (confirmationError) {
        console.error('Error enviando email de confirmación:', confirmationError);
        console.warn('Continuando después de error en email de confirmación');
      }

      console.log('✅ Emails enviados:', {
        internal: mainEmail?.id,
        confirmation: confirmationEmail?.id || 'failed',
        user: formData.nombre,
        method: 'html-only-temporary'
      });

      return NextResponse.json({
        success: true,
        message: 'Solicitud procesada exitosamente',
        emailId: mainEmail?.id,
        confirmationEmailId: confirmationEmail?.id
      });

    } catch (htmlEmailError) {
      console.error('Error con email HTML:', htmlEmailError);

      // 🔄 FALLBACK: Si React Email falla, usar el HTML original como backup
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
                  <div style="font-size: 48px; margin: 0 0 20px 0;">✅</div>
                  <h2 style="margin: 0 0 16px; color: ${BRAND.colors.white}; font-size: 24px; font-weight: 600;" class="mobile-heading">
                    Solicitud Recibida
                  </h2>
                  <p style="margin: 0; color: ${BRAND.colors.gray[300]}; font-size: 15px; line-height: 24px; padding: 0 10px;" class="mobile-text">
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
                  <p style="margin: 0 0 24px; color: ${BRAND.colors.gray[300]}; font-size: 15px;" class="mobile-text">
                    Mientras esperas, explora el ecosistema:
                  </p>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="mobile-width">
                    <tr>
                      <td style="background-color: ${BRAND.colors.gold}; border-radius: 8px;">
                        <a href="${BRAND.urls.base}/ecosistema"
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
            <p style="margin: 0 0 8px; color: ${BRAND.colors.gray[300]}; font-size: 14px;">
              Luis Cabrejo & Liliana Moreno
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
      const { data: fallbackEmail } = await resend.emails.send({
        from: 'CreaTuActivo <noreply@creatuactivo.com>',
        to: formData.email,
        subject: `✅ Confirmación de Solicitud - ${firstName}`,
        html: emailContainer(fallbackUserEmailContent, true)
      });

      console.log('✅ Email enviado con fallback HTML:', {
        internal: mainEmail?.id,
        confirmation: fallbackEmail?.id,
        user: formData.nombre,
        method: 'fallback-html'
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

// ✅ OPTIONS - Se mantiene exactamente igual
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
