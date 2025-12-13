/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Template de email para Admin - Pre-registro Reto 12 Días
 * Notificación con datos del prospecto
 */

import * as React from 'react';
import {
  Body,
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

interface PreRegistroAdminProps {
  fullName: string;
  email: string;
  phone: string;
  selectedPackage: string;
  fechaRegistro: string;
}

export const PreRegistroAdminEmail = ({
  fullName = 'Nombre del Prospecto',
  email = 'email@ejemplo.com',
  phone = '+57 300 000 0000',
  selectedPackage = 'No especificado',
  fechaRegistro = 'Fecha no disponible',
}: PreRegistroAdminProps) => {
  const previewText = `Nuevo pre-registro: ${fullName} - ${selectedPackage}`;

  const colors = {
    bg: '#0f172a',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textSubtle: '#64748b',
    accent: '#f59e0b',
    green: '#22c55e',
    blue: '#3b82f6',
  };

  // Limpiar teléfono para enlace WhatsApp
  const phoneClean = phone.replace(/\D/g, '');

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{`
          body, table, td { background-color: ${colors.bg} !important; }
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

        <Container style={{
          maxWidth: '560px',
          width: '100%',
          margin: '0 auto',
          padding: '32px 20px',
          backgroundColor: colors.bg
        }}>

          {/* Header */}
          <Section style={{ marginBottom: '24px' }}>
            <Text style={{
              margin: 0,
              color: colors.accent,
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase' as const,
              letterSpacing: '1px'
            }}>
              Reto de los 12 Días
            </Text>
            <Heading style={{
              margin: '8px 0 0',
              color: colors.text,
              fontSize: '28px',
              fontWeight: '700'
            }}>
              Nuevo Pre-registro
            </Heading>
            <Text style={{
              margin: '8px 0 0',
              color: colors.textSubtle,
              fontSize: '14px'
            }}>
              {fechaRegistro}
            </Text>
          </Section>

          {/* Paquete destacado */}
          <Section style={{
            backgroundColor: `${colors.accent}15`,
            border: `1px solid ${colors.accent}40`,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            textAlign: 'center' as const
          }}>
            <Text style={{
              margin: 0,
              color: colors.textSubtle,
              fontSize: '11px',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px'
            }}>
              Paquete de Interés
            </Text>
            <Text style={{
              margin: '8px 0 0',
              color: colors.accent,
              fontSize: '20px',
              fontWeight: '700'
            }}>
              {selectedPackage}
            </Text>
          </Section>

          {/* Datos del prospecto */}
          <Section style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <Text style={{
              margin: '0 0 16px',
              color: colors.text,
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Datos del Prospecto
            </Text>

            {/* Nombre */}
            <Text style={{
              margin: '0 0 4px',
              color: colors.textSubtle,
              fontSize: '11px',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px'
            }}>
              Nombre Completo
            </Text>
            <Text style={{
              margin: '0 0 16px',
              color: colors.text,
              fontSize: '16px'
            }}>
              {fullName}
            </Text>

            {/* Email */}
            <Text style={{
              margin: '0 0 4px',
              color: colors.textSubtle,
              fontSize: '11px',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px'
            }}>
              Correo Electrónico
            </Text>
            <Text style={{ margin: '0 0 16px' }}>
              <Link
                href={`mailto:${email}`}
                style={{ color: colors.blue, fontSize: '16px', textDecoration: 'none' }}
              >
                {email}
              </Link>
            </Text>

            {/* Teléfono */}
            <Text style={{
              margin: '0 0 4px',
              color: colors.textSubtle,
              fontSize: '11px',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px'
            }}>
              WhatsApp
            </Text>
            <Text style={{ margin: 0 }}>
              <Link
                href={`https://wa.me/${phoneClean}`}
                style={{ color: colors.green, fontSize: '16px', textDecoration: 'none' }}
              >
                {phone}
              </Link>
            </Text>
          </Section>

          {/* Acciones rápidas */}
          <Section style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <Text style={{
              margin: '0 0 12px',
              color: colors.text,
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Acciones Rápidas
            </Text>

            <table width="100%" cellPadding={0} cellSpacing={0} border={0}>
              <tr>
                <td style={{ paddingRight: '8px' }}>
                  <Link
                    href={`https://wa.me/${phoneClean}?text=Hola%20${encodeURIComponent(fullName.split(' ')[0])}%2C%20soy%20del%20equipo%20CreaTuActivo.%20Recibimos%20tu%20pre-registro%20en%20el%20Reto%20de%20los%2012%20D%C3%ADas.`}
                    style={{
                      display: 'block',
                      backgroundColor: colors.green,
                      color: '#ffffff',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '13px',
                      textAlign: 'center' as const
                    }}
                  >
                    Contactar por WhatsApp
                  </Link>
                </td>
                <td style={{ paddingLeft: '8px' }}>
                  <Link
                    href={`mailto:${email}?subject=Tu%20Pre-registro%20en%20CreaTuActivo&body=Hola%20${encodeURIComponent(fullName.split(' ')[0])}%2C`}
                    style={{
                      display: 'block',
                      backgroundColor: colors.blue,
                      color: '#ffffff',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '13px',
                      textAlign: 'center' as const
                    }}
                  >
                    Enviar Email
                  </Link>
                </td>
              </tr>
            </table>
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
              margin: 0,
              color: colors.textSubtle,
              fontSize: '12px'
            }}>
              © {new Date().getFullYear()} CreaTuActivo.com - Sistema de Notificaciones
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default PreRegistroAdminEmail;
