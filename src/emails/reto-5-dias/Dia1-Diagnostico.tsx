/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Día 1: El Diagnóstico
 * "Tu métrica más importante"
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
}

export const Dia1Diagnostico = ({ firstName = 'Hola' }: Dia1Props) => {
  const previewText = `Día 1: ${firstName}, tu métrica más importante`;

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
            <Img
              src="https://creatuactivo.com/logo-email-header-280x80.png"
              width="280"
              height="80"
              alt="CreaTuActivo"
              style={{ margin: '0 auto', display: 'block' }}
            />
          </Section>

          {/* Day Badge */}
          <Section style={dayBadge}>
            <Text style={dayNumber}>DÍA 1</Text>
            <Text style={dayTitle}>El Diagnóstico</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Bienvenido al Día 1 del Reto.
            </Text>

            <Text style={paragraph}>
              Hoy vamos a hablar de la métrica que cambiará tu forma de ver el dinero para siempre.
            </Text>

            <Text style={paragraph}>
              Se llama <strong style={{ color: '#D4AF37' }}>Días de Libertad</strong>.
            </Text>

            <Text style={highlightBox}>
              <strong>¿Cuántos días podrías vivir si mañana dejaras de trabajar?</strong>
            </Text>

            <Text style={paragraph}>
              La fórmula es simple:
            </Text>

            <Text style={formula}>
              Ahorros ÷ Gastos Mensuales × 30 = Días de Libertad
            </Text>

            <Text style={paragraph}>
              Si tienes $10,000 ahorrados y gastas $2,000 al mes:
              <br />
              <span style={{ color: '#D4AF37' }}>$10,000 ÷ $2,000 × 30 = 150 días</span>
            </Text>

            <Text style={paragraph}>
              Ahora, la pregunta incómoda:
            </Text>

            <Text style={paragraph}>
              <strong style={{ color: '#f5f5f5' }}>¿Cuál es TU número?</strong>
            </Text>

            <Text style={paragraph}>
              La mayoría de las personas que hacen este cálculo por primera vez descubren que tienen menos de 30 días. Algunos, cero.
            </Text>

            <Text style={paragraph}>
              No te juzgo. Yo estuve exactamente ahí.
            </Text>

            <Text style={paragraph}>
              Y esa es precisamente la razón por la que creé este reto: para mostrarte que hay otra forma.
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button
                href="https://creatuactivo.com/calculadora?source=reto-dia1"
                style={ctaButton}
              >
                Calcular mis Días de Libertad
              </Button>
            </Section>

            <Text style={paragraph}>
              Mañana te explicaré por qué tu plan actual probablemente no te llevará a donde quieres.
            </Text>

            <Text style={signature}>
              — Luis
              <br />
              <span style={signatureTitle}>Día 1 de 5</span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Reto 5 Días - Día 1 de 5
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Dia1Diagnostico;

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

const formula = {
  backgroundColor: '#12121a',
  padding: '16px 24px',
  color: '#D4AF37',
  fontSize: '16px',
  fontFamily: 'monospace',
  margin: '16px 0',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const ctaButton = {
  backgroundColor: '#D4AF37',
  borderRadius: '8px',
  color: '#0a0a0f',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 32px',
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
