/**
 * Copyright © 2025 CreaTuActivo.com
 * Soap Opera Sequence - Email 3: La Epifanía
 * Se envía 2 días después del registro
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

interface Email3Props {
  firstName?: string;
}

export const Email3Epiphany = ({
  firstName = 'Hola',
}: Email3Props) => {
  const previewText = `${firstName}, la pregunta que cambió todo`;

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="light dark" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src="https://creatuactivo.com/api/logo-email"
              width="280"
              height="80"
              alt="CreaTuActivo"
              style={logo}
            />
          </Section>

          {/* Contenido principal */}
          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Hoy te prometí contarte la pregunta que lo cambió todo.
            </Text>

            <Text style={paragraph}>
              Aquí está:
            </Text>

            <Text style={questionBox}>
              <strong>"¿Cuántos días podrías vivir si mañana dejaras de trabajar?"</strong>
            </Text>

            <Text style={paragraph}>
              Cuando me hice esa pregunta a los 40, la respuesta era: <strong>cero</strong>.
            </Text>

            <Text style={paragraph}>
              Veinte años trabajando. Cero días de libertad.
            </Text>

            <Text style={paragraph}>
              Ahí entendí el problema:
            </Text>

            <Text style={paragraph}>
              No estaba construyendo un <strong>activo</strong>.
              <br />
              Había comprado un <strong>empleo</strong>.
            </Text>

            <Text style={paragraph}>
              Un empleo más elegante (mi propio negocio), pero un empleo al fin.
              Si yo no trabajaba, el dinero no entraba.
            </Text>

            <Text style={paragraph}>
              La epifanía fue simple pero poderosa:
            </Text>

            <Text style={epiphanyBox}>
              <strong>La libertad no viene de cuánto GANAS.</strong>
              <br />
              <strong>Viene de cuánto ENTRA sin que trabajes.</strong>
            </Text>

            <Text style={paragraph}>
              Esa fórmula que usaste en la calculadora—(Ingreso Pasivo ÷ Gastos × 365)—es la métrica más importante que nadie te enseña.
            </Text>

            <Text style={paragraph}>
              Cuando entendí esto, empecé a buscar un vehículo diferente.
            </Text>

            <Text style={paragraph}>
              Uno que generara ingresos <strong>sin</strong> depender de mi tiempo.
            </Text>

            <Text style={paragraph}>
              Mañana te cuento qué encontré—y por qué me tomó 2.5 años hacerlo funcionar.
            </Text>

            <Text style={signature}>
              — Luis
              <br />
              <span style={signatureTitle}>PD: No tuve que renunciar a nada para empezar.</span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Email 3 de 5 de la serie "Días de Libertad"
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Email3Epiphany;

// Estilos
const main = {
  backgroundColor: '#0a0a0f',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logoSection = {
  padding: '32px 20px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '0 20px',
};

const h1 = {
  color: '#f5f5f5',
  fontSize: '28px',
  fontWeight: '500',
  margin: '0 0 24px',
  fontFamily: "'Playfair Display', Georgia, serif",
};

const paragraph = {
  color: '#a0a0a8',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '0 0 20px',
};

const questionBox = {
  backgroundColor: '#12121a',
  padding: '24px',
  color: '#f5f5f5',
  fontSize: '20px',
  lineHeight: '1.6',
  margin: '24px 0',
  borderRadius: '12px',
  border: '1px solid #2a2a35',
  textAlign: 'center' as const,
};

const epiphanyBox = {
  backgroundColor: 'rgba(212, 175, 55, 0.1)',
  borderLeft: '4px solid #D4AF37',
  padding: '24px',
  color: '#f5f5f5',
  fontSize: '20px',
  lineHeight: '1.6',
  margin: '24px 0',
  borderRadius: '0 12px 12px 0',
  fontFamily: "'Playfair Display', Georgia, serif",
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
