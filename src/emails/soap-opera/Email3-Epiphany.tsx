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
  const previewText = `${firstName}, el momento que cambió todo para mí`;

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
              Hoy te prometí mostrarte el defecto matemático del plan tradicional.
            </Text>

            <Text style={paragraph}>
              Aquí está:
            </Text>

            <Text style={highlightBox}>
              <strong>El Plan Tradicional:</strong>
              <br /><br />
              Trabajas 40 años.
              <br />
              Ahorras el 10% de tu ingreso.
              <br />
              Esperas tener suficiente para jubilarte.
              <br /><br />
              <span style={{ color: '#D4AF37' }}>
                Resultado: A los 65 años, tal vez tengas para vivir 10-15 años más.
                Si la inflación no te come primero.
              </span>
            </Text>

            <Text style={paragraph}>
              Cuando vi esto por primera vez, entendí por qué había fracasado.
            </Text>

            <Text style={paragraph}>
              <strong>No estaba construyendo un activo. Estaba comprando un empleo.</strong>
            </Text>

            <Text style={paragraph}>
              Un empleo más elegante (mi propio negocio), pero un empleo al fin.
              Si yo no trabajaba, el dinero no entraba.
            </Text>

            <Text style={paragraph}>
              La epifanía fue esta:
            </Text>

            <Text style={epiphanyBox}>
              La libertad no viene de cuánto <em>ganas</em>.
              <br />
              Viene de cuánto <em>entra sin que trabajes</em>.
            </Text>

            <Text style={paragraph}>
              Esa fórmula simple que usaste en la calculadora
              (Ingreso Pasivo ÷ Gastos × 365) es la métrica más importante
              que nadie te enseña.
            </Text>

            <Text style={paragraph}>
              Mañana te cuento qué hice con esta revelación
              —y por qué tardé 2.5 años en llegar donde estoy hoy.
            </Text>

            <Text style={signature}>
              — Luis
              <br />
              <span style={signatureTitle}>PD: No tuve que dejar mi trabajo para empezar.</span>
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

const highlightBox = {
  backgroundColor: '#12121a',
  padding: '24px',
  color: '#f5f5f5',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '24px 0',
  borderRadius: '12px',
  border: '1px solid #2a2a35',
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
