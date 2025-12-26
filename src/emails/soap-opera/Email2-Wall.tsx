/**
 * Copyright © 2025 CreaTuActivo.com
 * Soap Opera Sequence - Email 2: El Muro
 * Se envía 1 día después del registro
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

interface Email2Props {
  firstName?: string;
}

export const Email2Wall = ({
  firstName = 'Hola',
}: Email2Props) => {
  const previewText = `${firstName}, el muro que todos enfrentamos (y cómo lo derribé)`;

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
              Ayer te conté que quebré a los 40 después de 12 años emprendiendo.
            </Text>

            <Text style={paragraph}>
              Lo que no te conté fue <strong>el muro</strong> que me hizo caer.
            </Text>

            <Text style={paragraph}>
              Verás, durante esos 12 años seguí el consejo de todos los "expertos":
            </Text>

            <Text style={bulletPoint}>• "Emprende con tu pasión"</Text>
            <Text style={bulletPoint}>• "Trabaja duro y el éxito vendrá"</Text>
            <Text style={bulletPoint}>• "Invierte en tu negocio"</Text>
            <Text style={bulletPoint}>• "Escala cuando puedas"</Text>

            <Text style={paragraph}>
              Hice todo eso. Y el resultado fue:
            </Text>

            <Text style={highlightBox}>
              Más trabajo. Más estrés. Más deuda.
              <br />
              Y <strong>cero libertad</strong>.
            </Text>

            <Text style={paragraph}>
              El muro no era mi falta de esfuerzo.
              <br />
              El muro era que <strong>estaba siguiendo el plan equivocado</strong>.
            </Text>

            <Text style={paragraph}>
              El plan que te enseñan (estudia → trabaja → ahorra → jubílate) tiene
              un defecto matemático fatal que nadie te explica.
            </Text>

            <Text style={paragraph}>
              Mañana te muestro ese defecto con números reales.
              <br />
              Cuando lo veas, todo cambiará.
            </Text>

            <Text style={signature}>
              — Luis
              <br />
              <span style={signatureTitle}>PD: El cálculo que hiciste ayer es solo el comienzo.</span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Email 2 de 5 de la serie "Días de Libertad"
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Email2Wall;

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

const bulletPoint = {
  color: '#a0a0a8',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 8px',
  paddingLeft: '16px',
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
