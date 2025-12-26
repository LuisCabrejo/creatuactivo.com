/**
 * Copyright © 2025 CreaTuActivo.com
 * Soap Opera Sequence - Email 1: El Backstory
 * Se envía inmediatamente después del registro en la calculadora
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

interface Email1Props {
  firstName?: string;
  freedomDays?: number;
}

export const Email1Backstory = ({
  firstName = 'Hola',
  freedomDays = 0,
}: Email1Props) => {
  const previewText = `${firstName}, tu resultado + una confesión`;

  // Mensaje personalizado según días de libertad
  const getResultMessage = () => {
    if (freedomDays === 0) {
      return 'Cero. Eso significa que hoy dependes 100% de tu trabajo. No te juzgo—yo estuve exactamente ahí.';
    } else if (freedomDays < 30) {
      return 'Menos de un mes de respaldo. Una emergencia y todo cambia.';
    } else {
      return 'Vas por buen camino, pero aún hay trabajo por hacer.';
    }
  };

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

          {/* Resultado personalizado */}
          <Section style={resultBox}>
            <Text style={resultLabel}>Tu resultado:</Text>
            <Text style={resultNumber}>{freedomDays}</Text>
            <Text style={resultUnit}>Días de Libertad</Text>
          </Section>

          {/* Contenido principal */}
          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Gracias por calcular tu número.
            </Text>

            <Text style={paragraph}>
              <strong>{freedomDays} días de libertad.</strong>
            </Text>

            <Text style={paragraph}>
              {getResultMessage()}
            </Text>

            <Text style={paragraph}>
              Déjame contarte algo que no le cuento a cualquiera...
            </Text>

            <Text style={paragraph}>
              Durante 20 años viví atrapado en lo que llamo <strong>"el plan por defecto"</strong>: trabajar, pagar cuentas, repetir.
            </Text>

            <Text style={paragraph}>
              Como empleado, mi techo era bajo—limitado por un sueldo y por el tiempo.
            </Text>

            <Text style={paragraph}>
              Como emprendedor, la expectativa era más alta... pero solo 1 de cada 100 negocios sobrevive 10 años. Yo no fui la excepción.
            </Text>

            <Text style={highlightBox}>
              <strong>A los 40, quebrado.</strong>
            </Text>

            <Text style={paragraph}>
              Pensé que sería millonario a los 30. Después a los 40. Ninguna de las dos pasó.
            </Text>

            <Text style={paragraph}>
              Lo peor no era el dinero. Era darme cuenta de que había seguido el plan equivocado durante dos décadas.
            </Text>

            <Text style={paragraph}>
              Mañana te cuento qué descubrí cuando toqué fondo.
            </Text>

            <Text style={signature}>
              — Luis Cabrejo
              <br />
              <span style={signatureTitle}>Fundador, CreaTuActivo</span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Recibiste este email porque te registraste en la Calculadora de Libertad.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Email1Backstory;

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

const resultBox = {
  backgroundColor: '#12121a',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '0 20px 32px',
  border: '1px solid #2a2a35',
};

const resultLabel = {
  color: '#a0a0a8',
  fontSize: '14px',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const resultNumber = {
  color: '#D4AF37',
  fontSize: '64px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1',
  fontFamily: "'Playfair Display', Georgia, serif",
};

const resultUnit = {
  color: '#f5f5f5',
  fontSize: '18px',
  margin: '8px 0 0',
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
