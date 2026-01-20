/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Día 5: La Invitación
 * "Tu turno de cumplir promesas"
 */

import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface Dia5Props {
  firstName?: string;
}

export const Dia5Invitacion = ({ firstName = 'Hola' }: Dia5Props) => {
  const previewText = `Tu turno de cumplir promesas`;

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <div style={{
              fontFamily: 'Montserrat, Inter, -apple-system, sans-serif',
              fontSize: '28px',
              fontWeight: '400',
              letterSpacing: '0.05em',
              color: '#E5E5E5',
              lineHeight: '1.2'
            }}>
              CreaTu<span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: '700', color: '#C5A059', letterSpacing: '0.02em' }}>Activo</span>
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              letterSpacing: '2.5px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '8px',
              textTransform: 'uppercase' as const
            }}>
              The Architect's Suite
            </div>
          </Section>

          <Section style={dayBadge}>
            <Text style={dayNumber}>DÍA 5</Text>
            <Text style={dayTitle}>La Invitación</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Durante estos 5 días hemos desmontado los mitos:
            </Text>

            <Text style={featureItem}>
              <span style={{ color: '#D4AF37' }}>•</span> El empleo no te dará libertad <span style={{ color: '#6b6b75' }}>(Día 1 & 2)</span>
            </Text>
            <Text style={featureItem}>
              <span style={{ color: '#D4AF37' }}>•</span> El MLM tradicional es difícil de duplicar <span style={{ color: '#6b6b75' }}>(Día 3)</span>
            </Text>
            <Text style={featureItem}>
              <span style={{ color: '#D4AF37' }}>•</span> El E-commerce es una cárcel operativa <span style={{ color: '#6b6b75' }}>(Día 4)</span>
            </Text>

            <Text style={paragraph}>
              La solución es la <strong style={{ color: '#D4AF37' }}>Arquitectura de Activos</strong>.
            </Text>

            <Text style={highlightBox}>
              Un sistema donde:<br /><br />
              <strong>1. Gano Excel</strong> pone la infraestructura ($100M+ en logística y producto).<br /><br />
              <strong>2. La Tecnología</strong> pone la atracción y educación de prospectos (el 90% del trabajo).<br /><br />
              <strong>3. Tú</strong> pones la conexión... y cobras los dividendos.
            </Text>

            <Text style={paragraph}>
              Hoy quiero invitarte a dar el siguiente paso. No es un curso. Es una invitación a asociarte con nosotros y usar este sistema.
            </Text>

            <Text style={paragraph}>
              He preparado un <strong style={{ color: '#f5f5f5' }}>Briefing Ejecutivo</strong> donde te muestro los números reales, sin hype.
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button
                href="https://creatuactivo.com/webinar?source=reto-dia5"
                style={ctaButton}
              >
                Reservar Mi Lugar en el Webinar
              </Button>
            </Section>

            <Text style={paragraph}>
              La soberanía financiera no se trata de lujos.
            </Text>

            <Text style={highlightBox}>
              Se trata de poder cumplir tu palabra.<br /><br />
              <span style={{ fontSize: '14px', color: '#a0a0a8' }}>(Como yo pude finalmente cumplir la de la casa de campo).</span>
            </Text>

            <Text style={paragraph}>
              Si eso resuena contigo, reserva tu lugar.
            </Text>

            <Text style={paragraph}>
              Nos vemos dentro.
            </Text>

            <Text style={signature}>
              — Luis
              <br />
              <span style={signatureTitle}>Día 5 de 5</span>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Reto 5 Días - Día 5 de 5 (Final)
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Dia5Invitacion;

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

const featureItem = {
  color: '#a0a0a8',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '0 0 12px',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const ctaButton = {
  backgroundColor: '#D4AF37',
  borderRadius: '8px',
  color: '#0a0a0f',
  fontSize: '18px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '16px 40px',
};

const noteText = {
  color: '#6b6b75',
  fontSize: '13px',
  fontStyle: 'italic' as const,
  textAlign: 'center' as const,
  margin: '0 0 24px',
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

const ps = {
  color: '#6b6b75',
  fontSize: '14px',
  fontStyle: 'italic' as const,
  margin: '24px 0 0',
  padding: '16px',
  backgroundColor: '#12121a',
  borderRadius: '8px',
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
