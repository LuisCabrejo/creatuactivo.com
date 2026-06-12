/**
 * Copyright © 2026 CreaTuActivo.com
 * El Diagnóstico de 5 Días — Día 3
 * "[Día 3] La Máquina: cómo se arma su empresa digital"
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

interface Dia3Props {
  firstName?: string;
  trackingUrl?: string;
  videoUrl?: string;
}

export const Dia3Modelo = ({
  firstName: _firstName,
  trackingUrl,
  videoUrl = 'https://creatuactivo.com/empresa-digital/dia-3',
}: Dia3Props) => {
  const previewText = `Su Día 3: cómo se arma la máquina que trabaja por usted.`;

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

          {/* Día badge */}
          <Section style={badgeSection}>
            <Text style={badgeLabel}>DÍA 3 DE 5 · LA MÁQUINA</Text>
          </Section>

          {/* Content */}
          <Section style={content}>

            <Text style={openingLine}>
              Ayer vio por qué hacerlo todo a mano tiene un techo — y por qué necesita una palanca.
            </Text>

            <Text style={paragraph}>
              El problema de siempre es que montar una empresa así desde cero cuesta{' '}
              <strong style={{ color: '#E5E5E5' }}>mucho dinero y un desgaste enorme</strong>.
            </Text>

            <Text style={paragraph}>
              La salida no es construir esa máquina; es{' '}
              <strong style={{ color: '#E5E5E5' }}>engancharse a una que ya existe y ya funciona</strong>.
            </Text>

            <Text style={paragraph}>
              Hoy le muestro cómo se arma su empresa digital: una empresa real presente en 70 países y una inteligencia artificial, trabajando juntas bajo su dirección.
            </Text>

            {/* Pasos */}
            <Section style={protocolBox}>
              <Text style={protocolTitle}>CÓMO APROVECHARLO</Text>
              {[
                'Saque 15 minutos tranquilos.',
                'Entre por el enlace de abajo.',
                'Vea cómo encajan las dos partes que trabajan por usted.',
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
                      VER EL DÍA 3: LA MÁQUINA →
                    </Button>
                  </td>
                </tr>
              </table>
            </Section>

            <Text style={closingLine}>
              Ahí lo espera. Mírelo con calma.
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
              El Diagnóstico de 5 Días — Día 3 de 5
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

export default Dia3Modelo;

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
