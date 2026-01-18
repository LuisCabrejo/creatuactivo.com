/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Template de email para usuario - Pre-registro Reto 12 Días
 * Diseño minimalista estilo Apple
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
  Img,
  Preview,
  Section,
  Text,
  Link
} from '@react-email/components';

interface PreRegistroUserProps {
  firstName?: string;
  selectedPackage?: string;
}

export const PreRegistroUserEmail = ({
  firstName = 'Constructor',
  selectedPackage = 'Por definir',
}: PreRegistroUserProps) => {
  const previewText = `¡${firstName}, tu pre-registro en el Reto de los 12 Días está confirmado!`;

  const colors = {
    bg: '#0f172a',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textSubtle: '#64748b',
    accent: '#f59e0b',
    blue: '#3b82f6',
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
            .heading-main { font-size: 28px !important; }
            .text-body { font-size: 15px !important; }
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

          {/* Logo */}
          <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
            <Img
              src="https://creatuactivo.com/logo-email-footer-180x48.png"
              width="180"
              height="48"
              alt="CreaTuActivo"
              style={{ margin: '0 auto', display: 'block' }}
            />
          </Section>

          {/* Titulo */}
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
              ¡Pre-registro Confirmado!
            </Heading>
            <Text style={{
              margin: '16px 0 0',
              color: colors.textMuted,
              fontSize: '16px'
            }}>
              Hola {firstName}, diste el primer paso.
            </Text>
          </Section>

          {/* Card principal */}
          <Section
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '28px 24px',
              marginBottom: '24px'
            }}
          >
            <Text style={{
              margin: '0 0 8px',
              color: colors.textSubtle,
              fontSize: '12px',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px'
            }}>
              Paquete de Interés
            </Text>
            <Text style={{
              margin: '0 0 20px',
              color: colors.accent,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              {selectedPackage}
            </Text>

            <Text
              className="text-body"
              style={{
                margin: 0,
                color: colors.textMuted,
                fontSize: '15px',
                lineHeight: '24px'
              }}
            >
              Tu solicitud ha sido recibida. Un asesor Fundador te contactará en las próximas horas para guiarte en el proceso de inscripción.
            </Text>
          </Section>

          {/* Siguientes pasos */}
          <Section style={{ marginBottom: '24px' }}>
            <Text style={{
              margin: '0 0 16px',
              color: colors.text,
              fontSize: '16px',
              fontWeight: '600'
            }}>
              ¿Qué sigue?
            </Text>

            <Text style={{
              margin: '0 0 12px',
              color: colors.textMuted,
              fontSize: '14px',
              lineHeight: '22px'
            }}>
              <span style={{ color: colors.blue, marginRight: '8px' }}>1.</span>
              Revisa tu WhatsApp - Te contactaremos pronto
            </Text>

            <Text style={{
              margin: '0 0 12px',
              color: colors.textMuted,
              fontSize: '14px',
              lineHeight: '22px'
            }}>
              <span style={{ color: colors.blue, marginRight: '8px' }}>2.</span>
              Mientras tanto, conoce NEXUS, tu asistente 24/7
            </Text>

            <Text style={{
              margin: 0,
              color: colors.textMuted,
              fontSize: '14px',
              lineHeight: '22px'
            }}>
              <span style={{ color: colors.blue, marginRight: '8px' }}>3.</span>
              Prepara tus dudas - Las resolveremos todas
            </Text>
          </Section>

          {/* CTA */}
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

          {/* Firma */}
          <Section style={{ marginBottom: '32px' }}>
            <Text style={{
              margin: 0,
              color: colors.text,
              fontSize: '15px',
              lineHeight: '24px'
            }}>
              ¡Nos vemos pronto!<br /><br />
              <strong>Equipo CreaTuActivo</strong>
            </Text>
          </Section>

          {/* Separador */}
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
              © {new Date().getFullYear()} CreaTuActivo.com - Reto de los 12 Días
            </Text>

            <Text style={{
              margin: 0,
              color: colors.textSubtle,
              fontSize: '11px'
            }}>
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

export default PreRegistroUserEmail;
