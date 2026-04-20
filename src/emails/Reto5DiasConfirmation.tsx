/**
 * Copyright © 2025 CreaTuActivo.com
 * Auditoría de Arquitectura Patrimonial — Email de Confirmación de Registro v4.0
 * Diseño Lujo Clínico (gold + dark)
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
  firstName = 'Director',
}: Reto5DiasConfirmationProps) => {
  const previewText = `${firstName}, su Auditoría de Arquitectura Patrimonial está activada.`;

  // Lujo Clínico palette
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

          {/* Eyebrow */}
          <Section style={{ textAlign: 'center' as const, marginBottom: '8px' }}>
            <Text style={{
              margin: 0,
              color: colors.gold,
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase' as const,
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              AUDITORÍA DE ARQUITECTURA PATRIMONIAL — ACCESO CONFIRMADO
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
              {firstName}, le damos la bienvenida.
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
              Su acceso a la <span style={{ color: colors.gold, fontWeight: '600' }}>Auditoría de Arquitectura Patrimonial</span> está confirmado.
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
              Durante los próximos 5 días, le mostraré exactamente cómo construir un activo que genere sin su presencia constante.
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
              Mañana recibirá la Coordenada 01: "Diagnóstico Estructural"
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
              Para garantizar la entrega de todos los módulos,<br />
              confirme su registro por WhatsApp:
            </Text>
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ margin: '0 auto' }}>
              <tr>
                <td align="center">
                  <Button
                    href={`https://wa.me/573206805737?text=${encodeURIComponent(`Hola Luis, soy ${firstName}. Acabo de confirmar mi acceso a la Auditoría Patrimonial.`)}`}
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
                    ✓ Confirmar por WhatsApp
                  </Button>
                </td>
              </tr>
            </table>
          </Section>

          {/* Hoja de ruta de coordenadas */}
          <Section style={{ marginBottom: '24px', padding: '0 4px' }}>
            <Text style={{
              margin: '0 0 16px',
              color: colors.textMuted,
              fontSize: '13px',
              textTransform: 'uppercase' as const,
              letterSpacing: '1px',
              textAlign: 'center' as const,
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              Hoja de ruta — 5 coordenadas
            </Text>

            {[
              { day: '01', title: 'Diagnóstico Estructural', desc: 'Análisis de su modelo actual' },
              { day: '02', title: 'El Techo Técnico', desc: 'Análisis de Escalabilidad' },
              { day: '03', title: 'Acoplamiento Híbrido', desc: 'La Máquina Operativa' },
              { day: '04', title: 'Matriz de Amortización', desc: 'Ingeniería de Liquidez' },
              { day: '05', title: 'Protocolo de Activación', desc: 'Decisión Directiva' },
            ].map((item) => (
              <Text key={item.day} style={{
                margin: '0 0 8px',
                color: colors.textMuted,
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: colors.gold, marginRight: '12px' }}>Coordenada {item.day}</span>
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
              textAlign: 'center' as const,
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              IMPORTANTE: Para no perder ningún módulo
            </Text>
            <Text style={{
              margin: 0,
              color: colors.textMuted,
              fontSize: '13px',
              lineHeight: '20px'
            }}>
              • Si este correo llegó a <strong style={{ color: colors.text }}>Promociones</strong> o <strong style={{ color: colors.text }}>Importantes</strong>, muévalo a su bandeja <strong style={{ color: colors.text }}>Principal</strong><br />
              • Agregue <strong style={{ color: colors.text }}>hola@creatuactivo.com</strong> a sus contactos<br />
              • Esto entrena a Gmail para que los próximos módulos lleguen directamente a su bandeja principal
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
              Hacia su soberanía,<br /><br />
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
              Recibe este correo porque solicitó acceso a la Auditoría de Arquitectura Patrimonial
            </Text>
            <Link
              href="https://wa.me/573206805737"
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
