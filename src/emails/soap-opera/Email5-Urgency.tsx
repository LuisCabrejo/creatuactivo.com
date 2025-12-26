/**
 * Copyright © 2025 CreaTuActivo.com
 * Soap Opera Sequence - Email 5: La Invitación (CTA)
 * Se envía 4 días después del registro
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

interface Email5Props {
  firstName?: string;
  freedomDays?: number;
}

export const Email5Urgency = ({
  firstName = 'Hola',
  freedomDays = 0,
}: Email5Props) => {
  const previewText = `${firstName}, tu invitación`;

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
              Durante 4 días te conté mi historia.
            </Text>

            <Text style={paragraph}>
              Cómo viví 20 años atrapado en el plan por defecto.
              <br />
              El muro que me hizo caer a los 40.
              <br />
              La epifanía que cambió mi forma de ver el dinero.
              <br />
              Y cómo 2.5 años después logré la libertad que buscaba.
            </Text>

            <Text style={paragraph}>
              Hoy es tu turno.
            </Text>

            {/* Recordatorio del resultado */}
            <Section style={resultReminder}>
              <Text style={resultLabel}>Tu resultado fue:</Text>
              <Text style={resultNumber}>{freedomDays}</Text>
              <Text style={resultUnit}>Días de Libertad</Text>
              <Text style={resultQuestion}>
                ¿Quieres cambiar ese número?
              </Text>
            </Section>

            <Text style={paragraph}>
              Te invito al <strong>Reto de 5 Días</strong>.
            </Text>

            <Text style={paragraph}>
              5 días. 15 minutos al día. Por WhatsApp.
            </Text>

            <Text style={bulletPoint}>✓ <strong>Día 1:</strong> El Diagnóstico — dónde estás realmente</Text>
            <Text style={bulletPoint}>✓ <strong>Día 2:</strong> Los Vehículos — qué opciones tienes</Text>
            <Text style={bulletPoint}>✓ <strong>Día 3:</strong> El Nuevo Modelo — la matemática que funciona</Text>
            <Text style={bulletPoint}>✓ <strong>Día 4:</strong> El Estigma — cómo construir sin vergüenza</Text>
            <Text style={bulletPoint}>✓ <strong>Día 5:</strong> La Invitación — tu siguiente paso</Text>

            <Text style={paragraph}>
              <strong>100% gratis.</strong> Sin tarjeta. Sin compromiso.
            </Text>

            {/* CTA Principal */}
            <Section style={ctaSection}>
              <Button
                href="https://creatuactivo.com/reto-5-dias?source=email-sequence"
                style={ctaButton}
              >
                Quiero unirme al Reto
              </Button>
            </Section>

            <Text style={urgencyText}>
              El próximo reto inicia pronto. Los cupos son limitados
              porque cada persona recibe acompañamiento real.
            </Text>

            <Text style={signature}>
              — Luis
              <br />
              <span style={signatureTitle}>
                PD: Si llegas al día 5 y no te ha servido, simplemente deja de abrir los mensajes. Pero si algo cambia... habrá valido la pena.
              </span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Email 5 de 5 de la serie "Días de Libertad"
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Email5Urgency;

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
  color: '#f5f5f5',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '0 0 8px',
  paddingLeft: '8px',
};

const resultReminder = {
  backgroundColor: '#12121a',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '32px 0',
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
  fontSize: '56px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1',
  fontFamily: "'Playfair Display', Georgia, serif",
};

const resultUnit = {
  color: '#f5f5f5',
  fontSize: '18px',
  margin: '8px 0 16px',
};

const resultQuestion = {
  color: '#D4AF37',
  fontSize: '16px',
  margin: '16px 0 0',
  fontStyle: 'italic' as const,
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const ctaButton = {
  backgroundColor: '#D4AF37',
  borderRadius: '12px',
  color: '#0a0a0f',
  fontSize: '18px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 48px',
};

const urgencyText = {
  color: '#6b6b75',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0 0 32px',
  fontStyle: 'italic' as const,
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
  display: 'block',
  marginTop: '12px',
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
