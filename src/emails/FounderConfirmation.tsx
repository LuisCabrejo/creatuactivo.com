/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// /src/emails/FounderConfirmation.tsx
import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link
} from '@react-email/components';
import { BRAND } from '../lib/branding';

interface FounderConfirmationProps {
  firstName?: string;
}

export const FounderConfirmationEmail = ({
  firstName = 'Fundador',
}: FounderConfirmationProps) => {
  const previewText = `Confirmación de tu solicitud de Fundador en CreaTuActivo.com`;

  return (
    <Html lang="es">
      <Head>
        {/* Control proactivo del modo oscuro */}
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{`
          @media (prefers-color-scheme: dark) {
            .dark-text { color: ${BRAND.colors.white} !important; }
            .dark-link { color: ${BRAND.colors.gold} !important; }
            .dark-bg { background-color: ${BRAND.colors.dark} !important; }
          }
          [data-ogsc] .dark-text { color: ${BRAND.colors.white} !important; }
          [data-ogsc] .dark-link { color: ${BRAND.colors.gold} !important; }
          [data-ogsc] .dark-bg { background-color: ${BRAND.colors.dark} !important; }

          /* Asegurar que el fondo se mantenga oscuro en todos los clientes */
          body, table, td { background-color: ${BRAND.colors.dark} !important; }

          /* Responsive móvil */
          @media only screen and (max-width: 600px) {
            .mobile-padding { padding: 16px !important; }
            .mobile-padding-lg { padding: 24px !important; }
            .mobile-text { font-size: 15px !important; line-height: 22px !important; }
            .mobile-heading { font-size: 22px !important; }
            .mobile-button { width: 100% !important; display: block !important; text-align: center !important; }
            .mobile-width { width: 100% !important; }
          }
        `}</style>
      </Head>

      <Preview>{previewText}</Preview>

      <Body style={{
        fontFamily: BRAND.fonts.stack,
        backgroundColor: BRAND.colors.dark,
        color: BRAND.colors.white,
        margin: '0',
        padding: '20px 10px'
      }}>

        {/* Container principal */}
        <Container style={{
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: BRAND.colors.dark
        }}>

          {/* Header con logo */}
          <Section style={{
            backgroundColor: BRAND.colors.blue,
            padding: '32px 40px',
            textAlign: 'center' as const,
            borderRadius: '12px 12px 0 0'
          }} className="mobile-padding-lg">

            <Img
              src="https://creatuactivo.com/logo-email-header-200x80.png"
              width="200"
              height="80"
              alt="CreaTuActivo - Ecosistema Tecnológico"
              style={{
                margin: '0 auto 20px',
                display: 'block',
                maxWidth: '100%',
                height: 'auto'
              }}
            />

            <Heading style={{
              margin: '0',
              color: BRAND.colors.white,
              fontSize: '28px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }} className="mobile-heading">
              Hola {firstName}
            </Heading>

          </Section>

          {/* Contenido principal */}
          <Section style={{
            backgroundColor: BRAND.colors.darkAlt,
            padding: '40px',
            borderRadius: '0 0 12px 12px'
          }} className="mobile-padding-lg">

            {/* Status Card - Solicitud Recibida */}
            <Section style={{
              backgroundColor: `rgba(30, 64, 175, 0.15)`,
              border: `1px solid rgba(30, 64, 175, 0.3)`,
              borderRadius: '12px',
              padding: '32px 24px',
              textAlign: 'center' as const,
              marginBottom: '32px'
            }}>

              {/* Icono premium - Sin emoji que se convierta en imagen */}
              <table align="center" cellPadding={0} cellSpacing={0} border={0} style={{ margin: '0 auto 24px' }}>
                <tr>
                  <td style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: BRAND.colors.blue,
                    borderRadius: '12px',
                    textAlign: 'center' as const,
                    verticalAlign: 'middle',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: BRAND.colors.white,
                    lineHeight: '64px',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    &#10003;
                  </td>
                </tr>
              </table>

              <Heading style={{
                margin: '0 0 16px',
                color: BRAND.colors.white,
                fontSize: '24px',
                fontWeight: '600'
              }} className="mobile-heading">
                Solicitud Recibida
              </Heading>

              <Text style={{
                margin: '0',
                color: BRAND.colors.gray[400],
                fontSize: '16px',
                lineHeight: '24px'
              }} className="mobile-text">
                Tu aplicación para ser Fundador está siendo<br />
                evaluada por nuestro Comité de Arquitectos
              </Text>

            </Section>

            {/* Próximos Pasos */}
            <Section style={{
              backgroundColor: `rgba(124, 58, 237, 0.15)`,
              border: `1px solid rgba(124, 58, 237, 0.3)`,
              borderRadius: '12px',
              padding: '28px 24px',
              marginBottom: '40px'
            }}>

              <Heading style={{
                margin: '0 0 24px',
                color: BRAND.colors.white,
                fontSize: '20px',
                fontWeight: '600'
              }}>
                Próximos Pasos
              </Heading>

              <Text style={{
                margin: '0 0 12px',
                color: BRAND.colors.gray[400],
                fontSize: '15px',
                lineHeight: '24px'
              }} className="mobile-text">
                <span style={{
                  color: BRAND.colors.gold,
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginRight: '8px'
                }}>▶</span>
                Revisión de tu perfil (24-48 horas)
              </Text>

              <Text style={{
                margin: '0 0 12px',
                color: BRAND.colors.gray[400],
                fontSize: '15px',
                lineHeight: '24px'
              }} className="mobile-text">
                <span style={{
                  color: BRAND.colors.gold,
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginRight: '8px'
                }}>▶</span>
                Contacto directo si calificas
              </Text>

              <Text style={{
                margin: '0',
                color: BRAND.colors.gray[400],
                fontSize: '15px',
                lineHeight: '24px'
              }} className="mobile-text">
                <span style={{
                  color: BRAND.colors.gold,
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginRight: '8px'
                }}>▶</span>
                Consultoría estratégica exclusiva
              </Text>

            </Section>

            {/* CTA Section - Estratégico para mantener engagement */}
            <Section style={{
              textAlign: 'center' as const,
              marginBottom: '32px'
            }}>

              <Text style={{
                margin: '0 0 24px',
                color: BRAND.colors.gray[400],
                fontSize: '16px'
              }} className="mobile-text">
                Mientras esperas, explora el ecosistema:
              </Text>

              <Button
                href={`${BRAND.urls.base}/ecosistema`}
                style={{
                  backgroundColor: BRAND.colors.gold,
                  color: BRAND.colors.dark,
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '16px',
                  display: 'inline-block',
                  transition: 'all 0.2s ease'
                }}
                className="mobile-button"
              >
                Explorar el Ecosistema
              </Button>

            </Section>

            {/* Firma personal */}
            <Text style={{
              margin: '0',
              color: BRAND.colors.white,
              fontSize: '16px',
              lineHeight: '24px'
            }}>
              Atentamente,<br />
              <strong>Luis Cabrejo & Liliana Moreno</strong><br />
              <span style={{ color: BRAND.colors.gray[400], fontSize: '14px' }}>
                Co-Fundadores de CreaTuActivo
              </span>
            </Text>

          </Section>

          {/* Footer profesional y de confianza */}
          <Hr style={{
            border: 'none',
            borderTop: `1px solid ${BRAND.colors.gray[700]}`,
            margin: '32px 0'
          }} />

          <Section style={{
            padding: '0 20px 20px',
            textAlign: 'center' as const
          }}>

            <Text style={{
              margin: '0 0 8px',
              color: BRAND.colors.gray[500],
              fontSize: '13px',
              lineHeight: '20px'
            }}>
              © {new Date().getFullYear()} CreaTuActivo.com
            </Text>

            <Text style={{
              margin: '0 0 8px',
              color: BRAND.colors.gray[500],
              fontSize: '12px',
              lineHeight: '18px'
            }}>
              El primer ecosistema tecnológico para construcción de activos en América
            </Text>

            <Text style={{
              margin: '0 0 16px',
              color: BRAND.colors.gray[500],
              fontSize: '12px',
              lineHeight: '18px'
            }}>
              Recibes este correo porque solicitaste unirte al programa de Fundadores
            </Text>

            <Text style={{
              margin: '0',
              color: BRAND.colors.gray[500],
              fontSize: '11px',
              lineHeight: '16px'
            }}>
              CreaTuActivo SAS | Bogotá, Colombia<br />
              <Link
                href={`${BRAND.urls.base}/contacto`}
                style={{ color: BRAND.colors.gray[400], textDecoration: 'none' }}
              >
                Gestionar preferencias
              </Link>
            </Text>

          </Section>

        </Container>

      </Body>
    </Html>
  );
};

export default FounderConfirmationEmail;
