/**
 * Copyright © 2025 CreaTuActivo.com
 * Soap Opera Sequence - Email 4: El Plan Oculto
 * Se envía 3 días después del registro
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

interface Email4Props {
  firstName?: string;
}

export const Email4HiddenPlan = ({
  firstName = 'Hola',
}: Email4Props) => {
  const previewText = `${firstName}, por qué tardé 2.5 años (y tú no tienes que)`;

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
              Cuando entendí que necesitaba un activo que generara ingresos sin mi tiempo, analicé las opciones:
            </Text>

            <Text style={bulletPoint}>• <strong>Bienes raíces:</strong> Capital inicial grande</Text>
            <Text style={bulletPoint}>• <strong>Acciones/dividendos:</strong> Décadas para algo significativo</Text>
            <Text style={bulletPoint}>• <strong>E-commerce:</strong> Lo intenté. Funciona, pero sigue siendo un empleo</Text>
            <Text style={bulletPoint}>• <strong>Franquicias:</strong> Compras un empleo más caro</Text>

            <Text style={paragraph}>
              Entonces encontré un modelo que matemáticamente funcionaba.
            </Text>

            <Text style={paragraph}>
              Ingresos escalables. Residuales. Sin techo.
            </Text>

            <Text style={paragraph}>
              <strong>Pero había un problema.</strong>
            </Text>

            <Text style={highlightBox}>
              El modelo correcto existía.
              <br />
              <strong>La infraestructura estaba rota.</strong>
              <br /><br />
              Herramientas del siglo pasado. Listas de contactos que se acaban.
              Sistemas que no escalaban.
              <br /><br />
              Así que lo construí de la manera difícil.
              <br />
              <strong>2.5 años hasta llegar al #1.</strong>
            </Text>

            <Text style={paragraph}>
              Logré lo que buscaba: libertad de tiempo, ingresos que entran sin trabajar, viajar por el mundo.
            </Text>

            <Text style={paragraph}>
              Pero después me pregunté algo:
            </Text>

            <Text style={epiphanyBox}>
              ¿Qué hubiera pasado si desde el día uno hubiera tenido las herramientas correctas?
            </Text>

            <Text style={paragraph}>
              Esa pregunta se convirtió en <strong>CreaTuActivo</strong>.
            </Text>

            <Text style={paragraph}>
              Antes usábamos CDs. Ahora Spotify.
              <br />
              Antes mapas de papel. Ahora Waze.
            </Text>

            <Text style={paragraph}>
              ¿Por qué seguir construyendo con metodologías del siglo pasado?
            </Text>

            <Text style={paragraph}>
              Mañana te invito a ver cómo se ve cuando haces fácil lo difícil.
            </Text>

            <Text style={signature}>
              — Luis
              <br />
              <span style={signatureTitle}>PD: No es un curso. No es coaching. Es un sistema.</span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Email 4 de 5 de la serie "Días de Libertad"
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Email4HiddenPlan;

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
