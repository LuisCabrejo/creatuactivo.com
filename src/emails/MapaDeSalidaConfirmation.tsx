/**
 * Copyright © 2025 CreaTuActivo.com
 * Mapa de Salida - Email de Confirmación de Registro
 * Diseño Quiet Luxury (gold + dark)
 */

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

interface MapaDeSalidaConfirmationProps {
  firstName?: string;
}

export const MapaDeSalidaConfirmationEmail = ({
  firstName = 'Hola',
}: MapaDeSalidaConfirmationProps) => {
  const previewText = `${firstName}, tu Mapa de Salida está listo — y dice algo importante`;

  const colors = {
    bg: '#0a0a0f',
    cardBg: '#12121a',
    cardBorder: '#2a2a35',
    text: '#f5f5f5',
    textMuted: '#a0a0a8',
    textSubtle: '#6b6b75',
    gold: '#D4AF37',
  };

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{`
          body, table, td { background-color: ${colors.bg} !important; }
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; padding: 16px !important; }
            .card { padding: 20px 16px !important; }
            .heading-main { font-size: 26px !important; }
            .text-body { font-size: 15px !important; }
          }
        `}</style>
      </Head>

      <Preview>{previewText}</Preview>

      <Body style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
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

          {/* Logo */}
          <Section style={{ textAlign: 'center' as const, marginBottom: '24px', padding: '16px 0' }}>
            <Text style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              fontWeight: '400',
              color: '#E5E5E5',
              lineHeight: '1.2'
            }}>
              CreaTu<span style={{ fontWeight: '700', color: '#C5A059' }}>Activo</span>
            </Text>
          </Section>

          {/* Título */}
          <Section style={{ textAlign: 'center' as const, marginBottom: '32px' }}>
            <Heading
              className="heading-main"
              style={{
                margin: 0,
                color: colors.text,
                fontSize: '28px',
                fontWeight: '500',
                lineHeight: '1.3'
              }}
            >
              {firstName}, tu Mapa llegó.
            </Heading>
          </Section>

          {/* Card principal */}
          <Section
            className="card"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '28px 24px',
              marginBottom: '24px'
            }}
          >
            <Text
              className="text-body"
              style={{
                margin: '0 0 20px',
                color: colors.text,
                fontSize: '16px',
                lineHeight: '28px',
                textAlign: 'center' as const
              }}
            >
              Completaste tu <span style={{ color: colors.gold, fontWeight: '600' }}>Mapa de Salida</span>.
            </Text>

            <Text
              className="text-body"
              style={{
                margin: '0 0 20px',
                color: colors.textMuted,
                fontSize: '16px',
                lineHeight: '28px',
                textAlign: 'center' as const
              }}
            >
              Eso ya te separa de la mayoría. El primer paso es ver con claridad dónde estás — y eso ya lo hiciste.
            </Text>

            <Hr style={{
              border: 'none',
              borderTop: `1px solid ${colors.cardBorder}`,
              margin: '20px 0'
            }} />

            <Text
              style={{
                margin: 0,
                color: colors.gold,
                fontSize: '14px',
                textAlign: 'center' as const,
                fontWeight: '500'
              }}
            >
              Pronto recibirás el siguiente paso en tu camino.
            </Text>
          </Section>

          {/* WhatsApp CTA */}
          <Section style={{ marginBottom: '24px', textAlign: 'center' as const }}>
            <Text style={{
              margin: '0 0 16px',
              color: colors.textMuted,
              fontSize: '14px',
              lineHeight: '24px'
            }}>
              ¿Tienes preguntas? Escríbeme directamente:
            </Text>
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ margin: '0 auto' }}>
              <tr>
                <td align="center">
                  <Button
                    href={`https://wa.me/573215193909?text=${encodeURIComponent(`Hola Luis, soy ${firstName}. Acabo de completar mi Mapa de Salida.`)}`}
                    style={{
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      padding: '16px 32px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '16px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
                    }}
                  >
                    Escribir por WhatsApp
                  </Button>
                </td>
              </tr>
            </table>
          </Section>

          {/* Tips para recibir emails */}
          <Section style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <Text style={{
              margin: '0 0 12px',
              color: colors.gold,
              fontSize: '13px',
              fontWeight: '600',
              textAlign: 'center' as const
            }}>
              IMPORTANTE: Para no perderte ningún mensaje
            </Text>
            <Text style={{
              margin: 0,
              color: colors.textMuted,
              fontSize: '13px',
              lineHeight: '20px'
            }}>
              • Si este correo llegó a <strong style={{ color: colors.text }}>Promociones</strong> o <strong style={{ color: colors.text }}>Spam</strong>, muévelo a tu bandeja <strong style={{ color: colors.text }}>Principal</strong><br />
              • Agrega <strong style={{ color: colors.text }}>hola@creatuactivo.com</strong> a tus contactos
            </Text>
          </Section>

          {/* Firma */}
          <Section style={{ marginBottom: '32px', textAlign: 'center' as const }}>
            <Text style={{
              margin: 0,
              color: colors.text,
              fontSize: '15px',
              lineHeight: '24px'
            }}>
              Hacia tu soberanía,<br /><br />
              <strong>Luis Cabrejo</strong><br />
              <span style={{ color: colors.gold, fontSize: '13px' }}>
                Arquitecto de Activos
              </span>
            </Text>
          </Section>

          <Hr style={{
            border: 'none',
            borderTop: `1px solid ${colors.cardBorder}`,
            margin: '0 0 24px'
          }} />

          {/* Footer */}
          <Section style={{ textAlign: 'center' as const }}>
            <Text style={{
              margin: '0 0 8px',
              color: colors.textSubtle,
              fontSize: '12px'
            }}>
              © {new Date().getFullYear()} CreaTuActivo.com
            </Text>
            <Text style={{
              margin: '0 0 12px',
              color: colors.textSubtle,
              fontSize: '11px'
            }}>
              Recibes este correo porque completaste el Mapa de Salida
            </Text>
            <Link
              href="https://wa.me/573215193909"
              style={{ color: colors.textMuted, fontSize: '11px', textDecoration: 'none' }}
            >
              WhatsApp: +57 321 519 3909
            </Link>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default MapaDeSalidaConfirmationEmail;
