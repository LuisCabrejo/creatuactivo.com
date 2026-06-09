/**
 * Copyright © 2026 CreaTuActivo.com
 * El Diagnóstico de 5 Días — Día 5
 * "[Día 5] La Decisión: con los números sobre la mesa"
 * Registro accesible
 */

import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface Dia5Props {
  firstName?: string;
  trackingUrl?: string;
  videoUrl?: string;
}

export const Dia5Invitacion = ({
  firstName: _firstName,
  trackingUrl,
  videoUrl = 'https://creatuactivo.com/negocio-digital/dia-5',
}: Dia5Props) => {
  const previewText = `Su Día 5: con los números sobre la mesa, usted decide.`;

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={brandText}>
              CreaTu<span style={{ fontWeight: '700', color: '#C8A84B' }}>Activo</span>
            </Text>
          </Section>

          {/* Coordenada badge */}
          <Section style={badgeSection}>
            <Text style={badgeLabel}>DÍA 5 DE 5 · LA DECISIÓN</Text>
          </Section>

          {/* Content */}
          <Section style={content}>

            <Text style={openingLine}>
              En estos cinco días usted miró sus propios números, sin filtros.
            </Text>

            <Text style={paragraph}>
              Vimos de qué depende su ingreso hoy, por qué hacerlo todo a mano tiene techo, cómo se arma la máquina que trabaja por usted, y de dónde sale el ingreso.{' '}
              <strong style={{ color: '#E5E5E5' }}>Las cuentas están sobre la mesa.</strong>
            </Text>

            <Text style={paragraph}>
              Hoy se cierra el diagnóstico.
            </Text>

            <Text style={paragraph}>
              En este último día no hay técnicas para convencerlo. Hay{' '}
              <strong style={{ color: '#E5E5E5' }}>tres formas de empezar</strong>{' '}
              —según con cuánto inventario quiera arrancar— y el paso final para activar su negocio digital.
            </Text>

            {/* Protocolo de Ejecución */}
            <Section style={protocolBox}>
              <Text style={protocolTitle}>CÓMO APROVECHARLO</Text>
              {[
                'Saque 15 minutos tranquilos, los últimos.',
                'Entre por el enlace de abajo.',
                'Decida, con los números en la mano, si arranca.',
              ].map((step, i) => (
                <Text key={i} style={protocolStep}>
                  <span style={{ color: '#C8A84B', fontWeight: '700', marginRight: '10px' }}>
                    0{i + 1}
                  </span>
                  {step}
                </Text>
              ))}
            </Section>

            {/* CTA */}
            <Section style={ctaSection}>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tr>
                  <td align="center">
                    <Button href={videoUrl} style={ctaButton}>
                      VER EL DÍA 5: LA DECISIÓN →
                    </Button>
                  </td>
                </tr>
              </table>
            </Section>

            <Text style={closingLine}>
              Gracias por estos cinco días. La decisión es suya.
            </Text>

            <Text style={signature}>
              Luis Cabrejo Parra
              <br />
              <span style={signatureTitle}>Fundador · CreaTuActivo</span>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footerSection}>
            <Text style={footerText}>
              © 2026 CreaTuActivo.com
              <br />
              El Diagnóstico de 5 Días — Día 5 de 5 (Final)
            </Text>
          </Section>

        </Container>
        {trackingUrl && (
          <Img src={trackingUrl} width={1} height={1} alt="" style={{ display: 'block', border: 'none' }} />
        )}
      </Body>
    </Html>
  );
};

export default Dia5Invitacion;

/* ─── Styles ─── */

const main = {
  backgroundColor: '#080808',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};
const container = { margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' };
const header = { padding: '32px 20px 24px', textAlign: 'center' as const, borderBottom: '1px solid #1c1c1c' };
const brandText = { margin: 0, fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '400' as const, color: '#E5E5E5', lineHeight: '1.2', textAlign: 'center' as const };
const badgeSection = { textAlign: 'center' as const, padding: '24px 20px 0' };
const badgeLabel = { color: '#C8A84B', fontSize: '11px', fontWeight: '600' as const, letterSpacing: '3px', margin: 0, fontFamily: "'Courier New', monospace" };
const content = { padding: '28px 28px 0' };
const openingLine = { color: '#F5F5F0', fontSize: '18px', lineHeight: '1.6', margin: '0 0 20px', fontWeight: '500' as const };
const paragraph = { color: '#8A8A7A', fontSize: '15px', lineHeight: '1.8', margin: '0 0 20px' };
const protocolBox = { backgroundColor: '#0d0d0d', border: '1px solid #1c1c1c', borderLeft: '2px solid #C8A84B', padding: '20px 24px', margin: '24px 0' };
const protocolTitle = { color: '#C8A84B', fontSize: '10px', letterSpacing: '3px', fontFamily: "'Courier New', monospace", margin: '0 0 16px' };
const protocolStep = { color: '#8A8A7A', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' };
const ctaSection = { margin: '32px 0' };
const ctaButton = { backgroundColor: '#C8A84B', color: '#000000', padding: '16px 28px', textDecoration: 'none', fontWeight: '800' as const, fontSize: '13px', fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: '1px', display: 'inline-block' as const };
const closingLine = { color: '#6B6B5A', fontSize: '14px', lineHeight: '1.7', margin: '0 0 28px', fontStyle: 'italic' as const };
const signature = { color: '#F5F5F0', fontSize: '15px', lineHeight: '1.6', margin: '0' };
const signatureTitle = { color: '#C8A84B', fontSize: '12px', letterSpacing: '1px' };
const hr = { borderColor: '#1c1c1c', margin: '32px 20px' };
const footerSection = { padding: '0 20px' };
const footerText = { color: '#444', fontSize: '11px', lineHeight: '1.6', textAlign: 'center' as const, fontFamily: "'Courier New', monospace", letterSpacing: '0.5px' };
