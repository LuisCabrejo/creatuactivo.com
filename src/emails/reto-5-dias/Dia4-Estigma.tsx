/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Día 4: El Estigma
 * "La verdad sobre el network"
 */

import * as React from 'react';
import {
  Body,
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

interface Dia4Props {
  firstName?: string;
}

export const Dia4Estigma = ({ firstName = 'Hola' }: Dia4Props) => {
  const previewText = `Día 4: ${firstName}, la verdad incómoda`;

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://creatuactivo.com/logo-email-header-280x80.png"
              width="280"
              height="80"
              alt="CreaTuActivo"
              style={{ margin: '0 auto', display: 'block' }}
            />
          </Section>

          <Section style={dayBadge}>
            <Text style={dayNumber}>DÍA 4</Text>
            <Text style={dayTitle}>El Estigma</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Ayer te conté que encontré un modelo que funcionaba.
            </Text>

            <Text style={paragraph}>
              Pero había un problema.
            </Text>

            <Text style={paragraph}>
              Cuando miraba a mi equipo, veía personas esforzándose... pero no logrando los mismos resultados que yo. Lo que para mí era natural, para ellos era una lucha constante.
            </Text>

            <Text style={highlightBox}>
              Mi éxito personal no se duplicaba.
            </Text>

            <Text style={paragraph}>
              Y esa fue mi primera gran epifanía: <strong style={{ color: '#f5f5f5' }}>un sistema que solo funciona para algunos no es una solución real.</strong>
            </Text>

            <Text style={paragraph}>
              Además, el modelo tradicional de network marketing carga con un estigma enorme:
            </Text>

            <Text style={listItem}>• "Haz una lista de 100 contactos"</Text>
            <Text style={listItem}>• "Llama a tus amigos y familiares"</Text>
            <Text style={listItem}>• "Invítalos a una reunión"</Text>

            <Text style={paragraph}>
              <strong style={{ color: '#f5f5f5' }}>¿El resultado?</strong> Relaciones incómodas, reuniones vacías, y la sensación de estar pidiendo un favor.
            </Text>

            <Text style={paragraph}>
              Entonces me hice una pregunta:
            </Text>

            <Text style={highlightBox}>
              ¿Qué pasaría si la tecnología hiciera el 90% del trabajo pesado?
            </Text>

            <Text style={paragraph}>
              ¿Qué pasaría si los prospectos llegaran a ti en lugar de tú perseguirlos?
            </Text>

            <Text style={paragraph}>
              ¿Qué pasaría si pudieras construir sin vergüenza, sin incomodar a nadie, sin parecer vendedor?
            </Text>

            <Text style={paragraph}>
              Esa pregunta nos llevó a crear algo completamente nuevo. No un "MLM mejorado", sino una nueva categoría.
            </Text>

            <Text style={paragraph}>
              Mañana te lo muestro.
            </Text>

            <Text style={signature}>
              — Luis
              <br />
              <span style={signatureTitle}>Día 4 de 5</span>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Reto 5 Días - Día 4 de 5
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Dia4Estigma;

const main = {
  backgroundColor: '#0a0a0f',
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
  color: '#D4AF37',
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '2px',
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

const listItem = {
  color: '#a0a0a8',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '0 0 8px',
  paddingLeft: '8px',
};

const highlightBox = {
  backgroundColor: '#12121a',
  borderLeft: '4px solid #D4AF37',
  padding: '20px 24px',
  color: '#f5f5f5',
  fontSize: '18px',
  lineHeight: '1.6',
  margin: '24px 0',
  borderRadius: '0 8px 8px 0',
};

const signature = {
  color: '#f5f5f5',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0 0',
};

const signatureTitle = {
  color: '#D4AF37',
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
