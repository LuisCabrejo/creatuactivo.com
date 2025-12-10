/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
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
import { BRAND } from '../lib/branding';

interface Reto12DiasConfirmationProps {
  firstName?: string;
  selectedPackage?: string;
}

export const Reto12DiasConfirmationEmail = ({
  firstName = 'Constructor',
  selectedPackage = 'Kit de Inicio',
}: Reto12DiasConfirmationProps) => {
  const previewText = `¡Bienvenido al Reto de los 12 Días! Tu registro ha sido recibido.`;

  return (
    <Html lang="es">
      <Head>
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
          body, table, td { background-color: ${BRAND.colors.dark} !important; }
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

        <Container style={{
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: BRAND.colors.dark
        }}>

          {/* Header con gradiente épico */}
          <Section style={{
            background: `linear-gradient(135deg, ${BRAND.colors.blue} 0%, ${BRAND.colors.purple} 100%)`,
            padding: '40px',
            textAlign: 'center' as const,
            borderRadius: '12px 12px 0 0'
          }} className="mobile-padding-lg">

            <Img
              src="https://creatuactivo.com/logo-email-header-200x80.png"
              width="180"
              height="72"
              alt="CreaTuActivo"
              style={{
                margin: '0 auto 24px',
                display: 'block',
                maxWidth: '100%',
                height: 'auto'
              }}
            />

            <Heading style={{
              margin: '0 0 8px',
              color: BRAND.colors.gold,
              fontSize: '32px',
              fontWeight: '800',
              letterSpacing: '-0.5px'
            }} className="mobile-heading">
              ¡FELICIDADES, {firstName.toUpperCase()}!
            </Heading>

            <Text style={{
              margin: '0',
              color: BRAND.colors.white,
              fontSize: '18px',
              fontWeight: '500',
              opacity: 0.9
            }}>
              Tu registro en el Reto de los 12 Días ha sido recibido
            </Text>

          </Section>

          {/* Contenido principal */}
          <Section style={{
            backgroundColor: BRAND.colors.darkAlt,
            padding: '40px',
            borderRadius: '0 0 12px 12px'
          }} className="mobile-padding-lg">

            {/* Status Card - Confirmación */}
            <Section style={{
              background: `linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 88, 12, 0.15) 100%)`,
              border: `2px solid ${BRAND.colors.gold}`,
              borderRadius: '16px',
              padding: '32px 24px',
              textAlign: 'center' as const,
              marginBottom: '32px'
            }}>

              <table align="center" cellPadding={0} cellSpacing={0} border={0} style={{ margin: '0 auto 20px' }}>
                <tr>
                  <td style={{
                    width: '72px',
                    height: '72px',
                    background: `linear-gradient(135deg, ${BRAND.colors.gold} 0%, #D97706 100%)`,
                    borderRadius: '50%',
                    textAlign: 'center' as const,
                    verticalAlign: 'middle',
                    fontSize: '36px',
                    color: BRAND.colors.dark,
                    lineHeight: '72px',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    &#10003;
                  </td>
                </tr>
              </table>

              <Heading style={{
                margin: '0 0 12px',
                color: BRAND.colors.gold,
                fontSize: '24px',
                fontWeight: '700'
              }} className="mobile-heading">
                ¡Estás Dentro!
              </Heading>

              <Text style={{
                margin: '0',
                color: BRAND.colors.white,
                fontSize: '16px',
                lineHeight: '24px'
              }} className="mobile-text">
                En cuestión de <strong style={{ color: BRAND.colors.gold }}>minutos</strong> recibirás la confirmación<br />
                para finalizar tu vinculación.
              </Text>

            </Section>

            {/* Paquete seleccionado */}
            <Section style={{
              backgroundColor: `rgba(30, 64, 175, 0.2)`,
              border: `1px solid rgba(30, 64, 175, 0.4)`,
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '32px'
            }}>
              <Text style={{
                margin: '0',
                color: BRAND.colors.gray[400],
                fontSize: '14px',
                textTransform: 'uppercase' as const,
                letterSpacing: '1px'
              }}>
                Paquete Seleccionado
              </Text>
              <Text style={{
                margin: '8px 0 0',
                color: BRAND.colors.white,
                fontSize: '20px',
                fontWeight: '700'
              }}>
                {selectedPackage}
              </Text>
            </Section>

            {/* Mensaje motivacional */}
            <Section style={{
              marginBottom: '32px'
            }}>
              <Text style={{
                margin: '0 0 16px',
                color: BRAND.colors.white,
                fontSize: '18px',
                fontWeight: '600',
                lineHeight: '28px'
              }}>
                {firstName}, hoy tomaste una decisión que puede cambiar tu vida.
              </Text>

              <Text style={{
                margin: '0',
                color: BRAND.colors.gray[300],
                fontSize: '16px',
                lineHeight: '26px'
              }} className="mobile-text">
                Estás a punto de construir algo extraordinario. Los próximos 12 días serán
                el comienzo de tu camino hacia la libertad financiera. No estás solo en esto.
              </Text>
            </Section>

            <Hr style={{
              border: 'none',
              borderTop: `1px solid ${BRAND.colors.gray[700]}`,
              margin: '32px 0'
            }} />

            {/* NEXUS - Tu Socio Digital */}
            <Section style={{
              background: `linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(30, 64, 175, 0.2) 100%)`,
              border: `1px solid ${BRAND.colors.purple}`,
              borderRadius: '16px',
              padding: '28px 24px',
              marginBottom: '32px'
            }}>

              <Heading style={{
                margin: '0 0 16px',
                color: BRAND.colors.purple,
                fontSize: '20px',
                fontWeight: '700'
              }}>
                Conoce a NEXUS - Tu Socio Digital
              </Heading>

              <Text style={{
                margin: '0 0 16px',
                color: BRAND.colors.gray[300],
                fontSize: '15px',
                lineHeight: '24px'
              }} className="mobile-text">
                <strong style={{ color: BRAND.colors.white }}>NEXUS</strong> es tu aliado número uno
                en el desarrollo de tu proyecto. Está disponible <strong style={{ color: BRAND.colors.gold }}>24/7</strong> para:
              </Text>

              <Text style={{
                margin: '0 0 8px',
                color: BRAND.colors.gray[300],
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: BRAND.colors.gold, marginRight: '8px' }}>▶</span>
                Responder cualquier duda sobre el negocio
              </Text>

              <Text style={{
                margin: '0 0 8px',
                color: BRAND.colors.gray[300],
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: BRAND.colors.gold, marginRight: '8px' }}>▶</span>
                Asesorarte en bienestar y salud sobre los productos
              </Text>

              <Text style={{
                margin: '0 0 8px',
                color: BRAND.colors.gray[300],
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: BRAND.colors.gold, marginRight: '8px' }}>▶</span>
                Ayudarte a explicar el modelo a tus prospectos
              </Text>

              <Text style={{
                margin: '0',
                color: BRAND.colors.gray[300],
                fontSize: '15px',
                lineHeight: '24px'
              }}>
                <span style={{ color: BRAND.colors.gold, marginRight: '8px' }}>▶</span>
                Guiarte paso a paso en tu crecimiento
              </Text>

              <Text style={{
                margin: '20px 0 0',
                color: BRAND.colors.white,
                fontSize: '15px',
                fontStyle: 'italic' as const,
                lineHeight: '24px'
              }}>
                Pregúntale lo que quieras. NEXUS será tu mejor aliado en tu camino al éxito.
              </Text>

            </Section>

            {/* Recursos para explorar */}
            <Section style={{
              marginBottom: '32px'
            }}>

              <Heading style={{
                margin: '0 0 20px',
                color: BRAND.colors.white,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Mientras esperas, explora:
              </Heading>

              {/* Link 1 - Ecosistema */}
              <table width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ marginBottom: '12px' }}>
                <tr>
                  <td style={{
                    backgroundColor: `rgba(30, 64, 175, 0.15)`,
                    border: `1px solid rgba(30, 64, 175, 0.3)`,
                    borderRadius: '10px',
                    padding: '16px 20px'
                  }}>
                    <Link
                      href="https://creatuactivo.com/ecosistema"
                      style={{
                        color: BRAND.colors.white,
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      <span style={{ color: BRAND.colors.blue, marginRight: '12px' }}>●</span>
                      El Ecosistema CreaTuActivo
                    </Link>
                    <Text style={{
                      margin: '8px 0 0 24px',
                      color: BRAND.colors.gray[400],
                      fontSize: '14px'
                    }}>
                      Descubre cómo funciona todo el sistema
                    </Text>
                  </td>
                </tr>
              </table>

              {/* Link 2 - Fundadores */}
              <table width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ marginBottom: '12px' }}>
                <tr>
                  <td style={{
                    backgroundColor: `rgba(124, 58, 237, 0.15)`,
                    border: `1px solid rgba(124, 58, 237, 0.3)`,
                    borderRadius: '10px',
                    padding: '16px 20px'
                  }}>
                    <Link
                      href="https://creatuactivo.com/fundadores"
                      style={{
                        color: BRAND.colors.white,
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      <span style={{ color: BRAND.colors.purple, marginRight: '12px' }}>●</span>
                      Comunidad de Fundadores
                    </Link>
                    <Text style={{
                      margin: '8px 0 0 24px',
                      color: BRAND.colors.gray[400],
                      fontSize: '14px'
                    }}>
                      Conoce a quienes están construyendo contigo
                    </Text>
                  </td>
                </tr>
              </table>

              {/* Link 3 - Productos */}
              <table width="100%" cellPadding={0} cellSpacing={0} border={0}>
                <tr>
                  <td style={{
                    backgroundColor: `rgba(245, 158, 11, 0.15)`,
                    border: `1px solid rgba(245, 158, 11, 0.3)`,
                    borderRadius: '10px',
                    padding: '16px 20px'
                  }}>
                    <Link
                      href="https://creatuactivo.com/sistema/productos"
                      style={{
                        color: BRAND.colors.white,
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      <span style={{ color: BRAND.colors.gold, marginRight: '12px' }}>●</span>
                      Catálogo de Productos
                    </Link>
                    <Text style={{
                      margin: '8px 0 0 24px',
                      color: BRAND.colors.gray[400],
                      fontSize: '14px'
                    }}>
                      Los mejores productos de salud y bienestar
                    </Text>
                  </td>
                </tr>
              </table>

            </Section>

            {/* CTA Principal */}
            <Section style={{
              textAlign: 'center' as const,
              marginBottom: '32px'
            }}>

              <Button
                href="https://creatuactivo.com"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.colors.gold} 0%, #D97706 100%)`,
                  color: BRAND.colors.dark,
                  padding: '18px 40px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '16px',
                  display: 'inline-block'
                }}
                className="mobile-button"
              >
                Hablar con NEXUS Ahora
              </Button>

            </Section>

            {/* Mensaje de cierre */}
            <Section style={{
              backgroundColor: `rgba(34, 197, 94, 0.1)`,
              border: `1px solid rgba(34, 197, 94, 0.3)`,
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'center' as const
            }}>
              <Text style={{
                margin: '0',
                color: BRAND.colors.white,
                fontSize: '16px',
                lineHeight: '26px'
              }}>
                <strong style={{ color: '#22C55E' }}>Recuerda:</strong> El mejor momento para empezar fue ayer.<br />
                El segundo mejor momento es <strong style={{ color: BRAND.colors.gold }}>AHORA</strong>.
              </Text>
            </Section>

            {/* Firma */}
            <Text style={{
              margin: '0',
              color: BRAND.colors.white,
              fontSize: '16px',
              lineHeight: '24px'
            }}>
              ¡Nos vemos en la cima!<br /><br />
              <strong>Luis Cabrejo & Liliana Moreno</strong><br />
              <span style={{ color: BRAND.colors.gray[400], fontSize: '14px' }}>
                Co-Fundadores de CreaTuActivo
              </span>
            </Text>

          </Section>

          {/* Footer */}
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
              © {new Date().getFullYear()} CreaTuActivo.com - Reto de los 12 Días
            </Text>

            <Text style={{
              margin: '0 0 8px',
              color: BRAND.colors.gray[500],
              fontSize: '12px',
              lineHeight: '18px'
            }}>
              Recibes este correo porque te registraste en el Reto de los 12 Días
            </Text>

            <Text style={{
              margin: '0',
              color: BRAND.colors.gray[500],
              fontSize: '11px',
              lineHeight: '16px'
            }}>
              CreaTuActivo SAS | Bogotá, Colombia<br />
              <Link
                href="https://wa.me/573102066593"
                style={{ color: BRAND.colors.gray[400], textDecoration: 'none' }}
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
