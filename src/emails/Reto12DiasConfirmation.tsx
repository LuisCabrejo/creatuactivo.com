/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// Template de email minimalista estilo Apple/Jobs
// Reto de los 12 Días - Confirmación de Registro
import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link
} from '@react-email/components';
interface Reto12DiasConfirmationProps {
  firstName?: string;
  selectedPackage?: string;
}

export const Reto12DiasConfirmationEmail = ({
  firstName = 'Constructor',
  selectedPackage = 'Kit de Inicio',
}: Reto12DiasConfirmationProps) => {
  const previewText = `¡Bienvenido al Reto de los 12 Días, ${firstName}!`;

  // Paleta minimalista
  const colors = {
    bg: '#0f172a',           // Fondo principal (slate-900)
    cardBg: '#1e293b',       // Fondo de cards (slate-800)
    cardBorder: '#334155',   // Borde de cards (slate-700)
    text: '#f8fafc',         // Texto principal (slate-50)
    textMuted: '#94a3b8',    // Texto secundario (slate-400)
    textSubtle: '#64748b',   // Texto sutil (slate-500)
    accent: '#f59e0b',       // Acento dorado (amber-500)
    purple: '#a78bfa',       // Púrpura claro para NEXUS
  };

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{`
          body, table, td { background-color: ${colors.bg} !important; }

          /* Responsive - ancho completo en móvil */
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; padding: 16px !important; }
            .content { padding: 0 !important; }
            .card { padding: 20px 16px !important; margin-bottom: 16px !important; }
            .heading-main { font-size: 28px !important; }
            .heading-card { font-size: 18px !important; }
            .text-body { font-size: 15px !important; line-height: 24px !important; }
            .footer-text { font-size: 11px !important; }
            .package-label { font-size: 12px !important; }
            .package-value { font-size: 16px !important; }
          }
        `}</style>
      </Head>

      <Preview>{previewText}</Preview>

      <Body style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: colors.bg,
        color: colors.text,
        margin: 0,
        padding: 0
      }}>

        <Container
          className="container"
          style={{
            maxWidth: '560px',
            width: '100%',
            margin: '0 auto',
            padding: '32px 20px',
            backgroundColor: colors.bg
          }}
        >

          {/* Logo - Text only for perfect clarity */}
          <Section style={{ textAlign: 'center' as const, marginBottom: '32px', padding: '20px 0' }}>
            <div style={{
              fontFamily: 'Montserrat, Inter, -apple-system, sans-serif',
              fontSize: '22px',
              fontWeight: '400',
              letterSpacing: '0.05em',
              color: colors.text,
              lineHeight: '1.2'
            }}>
              CreaTu<span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: '700', color: '#C5A059', letterSpacing: '0.02em' }}>Activo</span>
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '8px',
              letterSpacing: '2px',
              color: '#666666',
              marginTop: '6px',
              textTransform: 'uppercase' as const
            }}>
              The Architect's Suite
            </div>
          </Section>

          {/* Título principal - limpio y grande */}
          <Section style={{ textAlign: 'center' as const, marginBottom: '32px' }}>
            <Heading
              className="heading-main"
              style={{
                margin: 0,
                color: colors.text,
                fontSize: '32px',
                fontWeight: '700',
                letterSpacing: '-0.5px',
                lineHeight: '1.2'
              }}
            >
              ¡Bienvenido, {firstName}!
            </Heading>
          </Section>

          {/* Card principal - confirmación */}
          <Section
            className="card"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '28px 24px',
              marginBottom: '20px'
            }}
          >
            <Heading
              className="heading-card"
              style={{
                margin: '0 0 12px',
                color: colors.text,
                fontSize: '20px',
                fontWeight: '600',
                textAlign: 'center' as const
              }}
            >
              Tu Registro Ha Sido Recibido
            </Heading>

            <Text
              className="text-body"
              style={{
                margin: 0,
                color: colors.textMuted,
                fontSize: '16px',
                lineHeight: '26px',
                textAlign: 'center' as const
              }}
            >
              Diste el paso más importante: decidiste{' '}
              <span style={{ color: colors.accent, fontWeight: '600' }}>construir tu futuro</span>{' '}
              en lugar de solo soñarlo.
            </Text>
          </Section>

          {/* Contenido - sin rectángulos llamativos */}
          <Section className="content" style={{ marginBottom: '24px', padding: '0 4px' }}>

            {/* Paquete seleccionado - sutil */}
            <Text
              className="package-label"
              style={{
                margin: '0 0 4px',
                color: colors.textSubtle,
                fontSize: '13px',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px'
              }}
            >
              Paquete Seleccionado
            </Text>
            <Text
              className="package-value"
              style={{
                margin: '0 0 24px',
                color: colors.text,
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              {selectedPackage}
            </Text>

            {/* Mensaje motivacional - directo */}
            <Text
              className="text-body"
              style={{
                margin: '0 0 24px',
                color: colors.textMuted,
                fontSize: '16px',
                lineHeight: '26px'
              }}
            >
              En cuestión de minutos recibirás la confirmación para finalizar tu vinculación.
              Mientras tanto, conoce a tu aliado:
            </Text>

            {/* NEXUS - card sutil */}
            <Section
              className="card"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                padding: '24px 20px',
                marginBottom: '24px'
              }}
            >
              <Text style={{
                margin: '0 0 16px',
                color: colors.purple,
                fontSize: '16px',
                fontWeight: '600'
              }}>
                NEXUS - Tu Socio Digital 24/7
              </Text>

              <Text style={{
                margin: '0 0 12px',
                color: colors.textMuted,
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: colors.accent, marginRight: '10px' }}>▸</span>
                Responde dudas sobre el negocio
              </Text>

              <Text style={{
                margin: '0 0 12px',
                color: colors.textMuted,
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: colors.accent, marginRight: '10px' }}>▸</span>
                Te asesora sobre productos
              </Text>

              <Text style={{
                margin: '0 0 12px',
                color: colors.textMuted,
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: colors.accent, marginRight: '10px' }}>▸</span>
                Te ayuda a explicar el modelo
              </Text>

              <Text style={{
                margin: 0,
                color: colors.textMuted,
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: colors.accent, marginRight: '10px' }}>▸</span>
                Te guía paso a paso
              </Text>
            </Section>

          </Section>

          {/* CTA principal - tabla para centrado garantizado en móvil */}
          <table width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ marginBottom: '24px' }}>
            <tr>
              <td align="center">
                <Button
                  href="https://creatuactivo.com"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.bg,
                    padding: '14px 32px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}
                >
                  Hablar con NEXUS
                </Button>
              </td>
            </tr>
          </table>

          {/* Enlaces secundarios - separados verticalmente para móvil */}
          <table width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ marginBottom: '32px' }}>
            <tr>
              <td align="center" style={{ paddingBottom: '16px' }}>
                <Link
                  href="https://creatuactivo.com/ecosistema"
                  style={{
                    color: colors.textMuted,
                    fontSize: '14px',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px'
                  }}
                >
                  Explorar Ecosistema →
                </Link>
              </td>
            </tr>
            <tr>
              <td align="center">
                <Link
                  href="https://creatuactivo.com/sistema/productos"
                  style={{
                    color: colors.textMuted,
                    fontSize: '14px',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px'
                  }}
                >
                  Ver Productos →
                </Link>
              </td>
            </tr>
          </table>

          {/* Firma simple */}
          <Section style={{ marginBottom: '32px' }}>
            <Text style={{
              margin: 0,
              color: colors.text,
              fontSize: '15px',
              lineHeight: '24px'
            }}>
              ¡Nos vemos en la cima!<br /><br />
              <strong>Luis Cabrejo & Liliana Moreno</strong><br />
              <span style={{ color: colors.textSubtle, fontSize: '13px' }}>
                Co-Fundadores de CreaTuActivo
              </span>
            </Text>
          </Section>

          {/* Separador sutil */}
          <Hr style={{
            border: 'none',
            borderTop: `1px solid ${colors.cardBorder}`,
            margin: '0 0 24px'
          }} />

          {/* Footer minimalista */}
          <Section style={{ textAlign: 'center' as const }}>
            <Text
              className="footer-text"
              style={{
                margin: '0 0 8px',
                color: colors.textSubtle,
                fontSize: '12px',
                lineHeight: '18px'
              }}
            >
              © {new Date().getFullYear()} CreaTuActivo.com - Reto de los 12 Días
            </Text>

            <Text
              className="footer-text"
              style={{
                margin: '0 0 12px',
                color: colors.textSubtle,
                fontSize: '11px',
                lineHeight: '16px'
              }}
            >
              Recibes este correo porque te registraste en el Reto de los 12 Días
            </Text>

            <Text
              className="footer-text"
              style={{
                margin: 0,
                color: colors.textSubtle,
                fontSize: '11px',
                lineHeight: '16px'
              }}
            >
              <Link
                href="https://wa.me/573102066593"
                style={{ color: colors.textMuted, textDecoration: 'none' }}
              >
                WhatsApp: +57 310 206 6593
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default Reto12DiasConfirmationEmail;
