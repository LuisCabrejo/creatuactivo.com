// src/app/api/fundadores/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // 1. Parse form data
    const formData = await request.formData();
    const nombre = formData.get('nombre') as string;
    const email = formData.get('email') as string;
    const telefono = formData.get('telefono') as string;
    const arquetipo = formData.get('arquetipo') as string;
    const inversion = formData.get('inversion') as string;

    // Validation
    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    const firstName = nombre.split(' ')[0];
    const personalizedURL = `https://creatuactivo.com/ecosistema?nombre=${encodeURIComponent(firstName)}`;

    console.log('Processing founder application:', { nombre: firstName, email });

    // 2. Internal notification email
    const internalEmailData = {
      from: 'Sistema CreaTuActivo <sistema@creatuactivo.com>',
      to: ['luis@creatuactivo.com', 'liliana@creatuactivo.com'],
      subject: `🔥 Nueva Aplicación de Fundador: ${nombre}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af, #7c3aed, #f59e0b); padding: 2px; border-radius: 12px;">
            <div style="background: #ffffff; padding: 30px; border-radius: 10px;">
              <h2 style="color: #0f172a; margin-bottom: 20px;">🔥 Nueva Aplicación Recibida</h2>

              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">Datos del Fundador:</h3>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Arquetipo:</strong> ${arquetipo}</p>
                <p><strong>Inversión:</strong> ${inversion}</p>
              </div>

              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                  <strong>Acción requerida:</strong> Revisar aplicación y programar llamada estratégica.
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    };

    // 3. User confirmation email with HTML fallback
    const userEmailData = {
      from: 'CreaTuActivo <confirmacion@creatuactivo.com>',
      to: email,
      subject: `Confirmación de tu solicitud de Fundador, ${firstName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #ffffff;">
          <!-- Header -->
          <div style="text-align: center; padding: 30px 20px;">
            <img src="https://creatuactivo.com/logo-email-header-200x80.png" alt="CreaTuActivo" style="max-width: 200px; height: auto;" />
          </div>

          <!-- Main Content -->
          <div style="padding: 0 30px 30px;">
            <!-- Greeting -->
            <div style="background: linear-gradient(135deg, rgba(30, 64, 175, 0.15), rgba(124, 58, 237, 0.15), rgba(245, 158, 11, 0.15)); backdrop-filter: blur(10px); border-radius: 12px; padding: 30px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <h1 style="color: #f59e0b; margin: 0 0 15px 0; font-size: 24px; font-weight: 700;">¡Hola ${firstName}!</h1>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #e2e8f0;">
                Hemos recibido tu solicitud para formar parte de nuestro selecto grupo de <strong style="color: #f59e0b;">Fundadores CreaTuActivo</strong>.
              </p>
            </div>

            <!-- What's Next -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #f59e0b; font-size: 20px; margin-bottom: 15px;">¿Qué sigue ahora?</h2>
              <div style="background: rgba(30, 64, 175, 0.1); border-radius: 8px; padding: 20px; border-left: 4px solid #1e40af;">
                <p style="margin: 0 0 15px 0; color: #e2e8f0; line-height: 1.6;">
                  Nuestro equipo de Arquitectos revisará tu perfil. Si tu visión se alinea con la de un verdadero <strong>Fundador</strong>, recibirás una invitación a una conversación estratégica exclusiva en las próximas 24 horas.
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px; font-style: italic;">
                  Solo contactamos a aquellos constructores que demuestran potencial real de transformación.
                </p>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${personalizedURL}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; text-decoration: none; font-weight: 700; font-size: 16px; padding: 15px 30px; border-radius: 8px; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;">
                Explora el Ecosistema de Fundadores
              </a>
            </div>

            <!-- Signature -->
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                Construyendo el futuro, un sistema a la vez
              </p>
              <img src="https://creatuactivo.com/logo-email-footer-120x48.png" alt="CreaTuActivo" style="max-width: 120px; height: auto; opacity: 0.7;" />
            </div>
          </div>
        </div>
      `
    };

    // Send emails with error handling
    const emailResults = await Promise.allSettled([
      resend.emails.send(internalEmailData),
      resend.emails.send(userEmailData)
    ]);

    // Log results
    emailResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Email ${index + 1} sent successfully:`, result.value.id);
      } else {
        console.error(`Email ${index + 1} failed:`, result.reason);
      }
    });

    // Check if at least user email was sent
    const userEmailResult = emailResults[1];
    if (userEmailResult.status === 'rejected') {
      throw new Error(`Failed to send confirmation email: ${userEmailResult.reason}`);
    }

    // ====================================================================
    // 🎨 EMAIL 2: CONFIRMACIÓN USUARIO - AHORA USA REACT EMAIL OPTIMIZADO
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
                      <a href="${BRAND.urls.base}/ecosistema?nombre=${encodeURIComponent(firstName)}"
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
        react: FounderConfirmationEmail({ firstName }) // ← Usando el nuevo componente React Email
      });

      if (confirmationError) {
        console.error('Error enviando email de confirmación:', confirmationError);
        // No falla completamente si el email de confirmación falla
        // El email interno ya se envió exitosamente
        console.warn('Continuando después de error en email de confirmación');
      }

      console.log('✅ Emails enviados:', {
        internal: mainEmail?.id,
        confirmation: confirmationEmail?.id || 'failed',
        user: formData.nombre,
        method: 'hybrid-html-react'
      });

      return NextResponse.json({
        success: true,
        message: 'Solicitud procesada exitosamente',
        emailId: mainEmail?.id,
        confirmationEmailId: confirmationEmail?.id
      });

    } catch (reactEmailError) {
      console.error('Error con React Email, usando fallback HTML:', reactEmailError);

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
    console.error('Error in fundadores API:', error);

    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
