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
  Button,
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
  const previewText = `${firstName}, tu resultado de la calculadora + mi historia`;

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
          {freedomDays !== undefined && (
            <Section style={resultBox}>
              <Text style={resultLabel}>Tu resultado:</Text>
              <Text style={resultNumber}>{freedomDays}</Text>
              <Text style={resultUnit}>Días de Libertad</Text>
            </Section>
          )}

          {/* Contenido principal */}
          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Gracias por tomarte 30 segundos para calcular tu número.
            </Text>

            <Text style={paragraph}>
              {freedomDays === 0
                ? 'Cero días. Eso significa que hoy dependes 100% de tu trabajo. No te juzgo—yo estuve exactamente ahí.'
                : freedomDays < 30
                ? `${freedomDays} días. Es un comienzo, pero sigues dependiendo mayoritariamente de tu trabajo.`
                : `${freedomDays} días. Vas por buen camino, pero aún hay trabajo por hacer.`}
            </Text>

            <Text style={paragraph}>
              Déjame contarte algo que no le cuento a cualquiera...
            </Text>

            <Text style={paragraph}>
              <strong>A los 40 años, quebré.</strong>
            </Text>

            <Text style={paragraph}>
              12 años emprendiendo. Restaurantes. Importaciones. Franquicias.
              Todo lo que "se supone" que debes hacer para tener éxito.
              Y terminé con deudas, sin ahorros, y preguntándome qué había hecho mal.
            </Text>

            <Text style={paragraph}>
              Lo peor no era el dinero. Era darme cuenta de que había seguido
              el plan equivocado durante 12 años.
            </Text>

            <Text style={paragraph}>
              Mañana te cuento qué descubrí después de tocar fondo.
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
