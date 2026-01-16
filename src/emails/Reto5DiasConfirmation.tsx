/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Email de Confirmación de Registro
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

interface Reto5DiasConfirmationProps {
  firstName?: string;
}

export const Reto5DiasConfirmationEmail = ({
  firstName = 'Hola',
}: Reto5DiasConfirmationProps) => {
  const previewText = `¡${firstName}, tu registro al Reto 5 Días está confirmado!`;

  // Quiet Luxury palette
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

          {/* Logo - Using table for email client compatibility */}
          <table width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ marginBottom: '24px' }}>
            <tr>
              <td align="center">
                <table cellPadding={0} cellSpacing={0} border={0}>
                  <tr>
                    <td
                      align="center"
                      valign="middle"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: colors.gold,
                        borderRadius: '8px',
                      }}
                    >
                      <span style={{
                        color: colors.bg,
                        fontSize: '28px',
                        fontWeight: '700',
                        fontFamily: 'Georgia, serif',
                        lineHeight: '48px',
                      }}>C</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

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
              ¡Bienvenido al Reto, {firstName}!
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
              Tu registro al <span style={{ color: colors.gold, fontWeight: '600' }}>Reto de 5 Días</span> está confirmado.
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
              Durante los próximos 5 días, te mostraré exactamente cómo construir un activo que genere sin tu presencia constante.
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
              Mañana recibirás el Día 1: "El Diagnóstico"
            </Text>
          </Section>

          {/* Lo que aprenderás */}
          <Section style={{ marginBottom: '24px', padding: '0 4px' }}>
            <Text style={{
              margin: '0 0 16px',
              color: colors.textMuted,
              fontSize: '13px',
              textTransform: 'uppercase' as const,
              letterSpacing: '1px',
              textAlign: 'center' as const
            }}>
              Lo que aprenderás
            </Text>

            {[
              { day: '1', title: 'El Diagnóstico', desc: 'Tu métrica más importante' },
              { day: '2', title: 'Los Vehículos', desc: 'Por qué tu plan no funciona' },
              { day: '3', title: 'El Modelo', desc: 'La fórmula matemática' },
              { day: '4', title: 'El Estigma', desc: 'La verdad sobre el network' },
              { day: '5', title: 'La Invitación', desc: 'Tu siguiente paso' },
            ].map((item) => (
              <Text key={item.day} style={{
                margin: '0 0 8px',
                color: colors.textMuted,
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: colors.gold, marginRight: '12px' }}>Día {item.day}</span>
                <span style={{ color: colors.text }}>{item.title}</span>
                <span style={{ color: colors.textSubtle }}> — {item.desc}</span>
              </Text>
            ))}
          </Section>

          {/* CTA */}
          <table width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ marginBottom: '24px' }}>
            <tr>
              <td align="center">
                <Button
                  href="https://creatuactivo.com"
                  style={{
                    backgroundColor: colors.gold,
                    color: colors.bg,
                    padding: '14px 32px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '15px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  Conocer a Queswa (IA)
                </Button>
              </td>
            </tr>
          </table>

          {/* Firma */}
          <Section style={{ marginBottom: '32px', textAlign: 'center' as const }}>
            <Text style={{
              margin: 0,
              color: colors.text,
              fontSize: '15px',
              lineHeight: '24px'
            }}>
              ¡Nos vemos mañana!<br /><br />
              <strong>Luis Cabrejo</strong><br />
              <span style={{ color: colors.textSubtle, fontSize: '13px' }}>
                Fundador de CreaTuActivo
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
              Recibes este correo porque te registraste en el Reto de 5 Días
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

export default Reto5DiasConfirmationEmail;
