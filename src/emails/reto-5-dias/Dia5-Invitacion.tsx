/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Día 5: La Invitación
 * "Tu siguiente paso"
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

interface Dia5Props {
  firstName?: string;
}

export const Dia5Invitacion = ({ firstName = 'Hola' }: Dia5Props) => {
  const previewText = `Día 5: ${firstName}, tu invitación está lista`;

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
            <Text style={dayNumber}>DÍA 5</Text>
            <Text style={dayTitle}>La Invitación</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Durante 4 días te conté mi historia.
            </Text>

            <Text style={paragraph}>
              Cómo viví atrapado en el plan por defecto.<br />
              Las promesas que no pude cumplir.<br />
              Las dos epifanías que cambiaron mi forma de ver el dinero.<br />
              Y por qué la tecnología es la clave.
            </Text>

            <Text style={paragraph}>
              Hoy es tu turno.
            </Text>

            <Text style={highlightBox}>
              Te invito a conocer <strong>CreaTuActivo</strong>: un sistema donde la tecnología hace el 90% del trabajo pesado.
            </Text>

            <Text style={paragraph}>
              Lo que encontrarás:
            </Text>

            <Text style={featureItem}>
              <span style={{ color: '#D4AF37' }}>✓</span> <strong>Queswa</strong> - IA que responde a tus prospectos 24/7
            </Text>
            <Text style={featureItem}>
              <span style={{ color: '#D4AF37' }}>✓</span> <strong>Sistema de contenido</strong> - Publicaciones listas para atraer prospectos
            </Text>
            <Text style={featureItem}>
              <span style={{ color: '#D4AF37' }}>✓</span> <strong>Funnels automatizados</strong> - Prospectos que llegan calificados
            </Text>
            <Text style={featureItem}>
              <span style={{ color: '#D4AF37' }}>✓</span> <strong>Mentoría directa</strong> - Acompañamiento real, no solo videos
            </Text>

            <Text style={paragraph}>
              No tienes que perseguir a nadie.<br />
              No tienes que ser experto en ventas.<br />
              No tienes que inventar el contenido.
            </Text>

            <Text style={paragraph}>
              Solo tienes que decidir que quieres algo diferente.
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button
                href="https://creatuactivo.com/fundadores?source=reto-dia5"
                style={ctaButton}
              >
                Quiero Ver Cómo Funciona
              </Button>
            </Section>

            <Text style={noteText}>
              Esta invitación es para personas que completaron el Reto 5 Días. Hay cupos limitados porque cada persona recibe acompañamiento real.
            </Text>

            <Text style={paragraph}>
              La soberanía financiera no se trata de lujos.<br />
              <strong style={{ color: '#D4AF37' }}>Se trata de poder cumplir tu palabra.</strong>
            </Text>

            <Text style={paragraph}>
              ¿Nos vemos del otro lado?
            </Text>

            <Text style={signature}>
              — Luis
              <br />
              <span style={signatureTitle}>Fundador, CreaTuActivo</span>
            </Text>

            <Text style={ps}>
              PD: Si llegaste al día 5 y no te ha servido, simplemente ignora este email. Pero si algo cambió en cómo ves tu situación... vale la pena explorar.
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
