/**
 * Copyright © 2025 CreaTuActivo.com
 * Mapa de Salida - Coordenada 1
 * "Por qué sudas mucho, pero no avanzas"
 */

import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface Dia1Props {
  firstName?: string;
  trackingUrl?: string;
  videoUrl?: string;
}

export const Dia1Diagnostico = ({ firstName = 'Hola', trackingUrl, videoUrl = 'https://creatuactivo.com/mapa-de-salida/dia-1' }: Dia1Props) => {
  const previewText = `Coordenada 1: Por qué sudas mucho, pero no avanzas`;

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
            <Text style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              fontWeight: '400',
              color: '#E5E5E5',
              lineHeight: '1.2',
              textAlign: 'center' as const
            }}>
              CreaTu<span style={{ fontWeight: '700', color: '#C5A059' }}>Activo</span>
            </Text>
          </Section>

          {/* Day Badge */}
          <Section style={dayBadge}>
            <Text style={dayNumber}>COORDENADA 1 DE 5</Text>
            <Text style={dayTitle}>El Diagnóstico</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>Hola {firstName},</Heading>

            <Text style={paragraph}>
              Ayer, apenas confirmaste tu acceso al mapa, te conté la historia de mi promesa en el mirador Buena Vista. Te hablé de esa frustrante sensación de estar en una bicicleta estática: pedaleando con todas tus fuerzas, agotado, pero terminando el mes en el mismo exacto lugar.
            </Text>

            <Text style={paragraph}>
              Hoy empezamos oficialmente tu ruta de escape.
            </Text>

            <Text style={paragraph}>
              El primer paso no es darte motivación vacía ni decirte que "te esfuerces más". El primer paso es <strong style={{ color: '#E5E5E5' }}>auditar tu realidad actual usando matemáticas</strong>.
            </Text>

            <Text style={paragraph}>
              En el breve video de hoy (tu Coordenada 1), te voy a explicar por qué el <strong style={{ color: '#C5A059' }}>"Plan por Defecto"</strong> que la sociedad nos vendió tiene una falla de diseño estructural. Vas a descubrir por qué intercambiar tiempo por dinero es un modelo inherentemente frágil, y por qué trabajar más duro no te hará más libre si estás operando el vehículo equivocado.
            </Text>

            {/* Video CTA */}
            <Section style={videoCta}>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tr>
                  <td align="center">
                    <Button
                      href={videoUrl}
                      style={{
                        backgroundColor: '#C5A059',
                        color: '#0F1115',
                        padding: '16px 32px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '16px',
                        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                        letterSpacing: '0.5px',
                      }}
                    >
                      👉 VER COORDENADA 1
                    </Button>
                  </td>
                </tr>
              </table>
            </Section>

            <Text style={highlightBox}>
              Al final del video te daré las instrucciones para calcular tu <strong>"Número de Fragilidad"</strong>. Es un ejercicio de 2 minutos que te dará total claridad sobre dónde estás parado hoy.
            </Text>

            <Text style={paragraph}>
              Haz clic en el enlace, mira el video y haz el cálculo.
            </Text>

            <Text style={paragraph}>
              Te veo dentro,
            </Text>

            <Text style={signature}>
              Luis Cabrejo
              <br />
              <span style={signatureTitle}>Arquitecto de Activos</span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Mapa de Salida — Coordenada 1 de 5
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

export default Dia1Diagnostico;

const main = {
  backgroundColor: '#0F1115',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const header = {
  padding: '32px 20px',
  textAlign: 'center' as const,
};

const dayBadge = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const dayNumber = {
  color: '#C5A059',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '3px',
  margin: '0 0 4px',
};

const dayTitle = {
  color: '#f5f5f5',
  fontSize: '24px',
  fontWeight: '500',
  margin: '0',
  fontFamily: "Georgia, serif",
};

const content = {
  padding: '0 20px',
};

const h1 = {
  color: '#f5f5f5',
  fontSize: '28px',
  fontWeight: '500',
  margin: '0 0 24px',
  fontFamily: "Georgia, serif",
};

const paragraph = {
  color: '#a0a0a8',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '0 0 20px',
};

const highlightBox = {
  backgroundColor: '#1A1D23',
  borderLeft: '4px solid #C5A059',
  padding: '20px 24px',
  color: '#E5E5E5',
  fontSize: '17px',
  lineHeight: '1.6',
  margin: '24px 0',
  borderRadius: '0 8px 8px 0',
};

const videoCta = {
  margin: '32px 0',
};

const signature = {
  color: '#f5f5f5',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0 0',
};

const signatureTitle = {
  color: '#C5A059',
  fontSize: '14px',
};

const hr = {
  borderColor: '#2a2a35',
  margin: '32px 20px',
};

const footer = {
  padding: '0 20px',
};

const footerText = {
  color: '#6b6b75',
  fontSize: '12px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
};
