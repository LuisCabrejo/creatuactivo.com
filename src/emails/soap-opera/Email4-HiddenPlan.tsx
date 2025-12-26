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
  const previewText = `${firstName}, lo que los "gurús" no te cuentan`;

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
              Ayer te conté mi epifanía sobre la diferencia entre
              <em> ganar dinero</em> y <em>tener libertad</em>.
            </Text>

            <Text style={paragraph}>
              Hoy quiero contarte lo que descubrí después
              —y por qué me tomó 2.5 años llegar donde estoy.
            </Text>

            <Text style={paragraph}>
              Cuando entendí que necesitaba un <strong>activo</strong>
              (algo que genere ingresos sin mi tiempo),
              empecé a investigar las opciones:
            </Text>

            <Text style={bulletPoint}>• Bienes raíces: Necesitas capital inicial grande</Text>
            <Text style={bulletPoint}>• Acciones/dividendos: Años para generar algo significativo</Text>
            <Text style={bulletPoint}>• Negocios digitales: Requieren habilidades técnicas</Text>
            <Text style={bulletPoint}>• Franquicias: Más del mismo problema (compras un empleo)</Text>

            <Text style={paragraph}>
              Entonces encontré un modelo que matemáticamente funcionaba.
            </Text>

            <Text style={paragraph}>
              Pero había un problema...
            </Text>

            <Text style={highlightBox}>
              <strong>El modelo correcto existía.</strong>
              <br />
              <strong>La infraestructura estaba rota.</strong>
              <br /><br />
              Herramientas obsoletas. Entrenamiento genérico.
              Sistemas que no escalaban.
              <br /><br />
              Así que lo construí de la manera difícil.
              2.5 años hasta llegar a Diamante.
            </Text>

            <Text style={paragraph}>
              Después me pregunté:
            </Text>

            <Text style={epiphanyBox}>
              ¿Qué hubiera pasado si hubiera tenido
              las herramientas correctas desde el día uno?
            </Text>

            <Text style={paragraph}>
              Esa pregunta se convirtió en <strong>CreaTuActivo</strong>.
            </Text>

            <Text style={paragraph}>
              Mañana te invito a algo especial.
              <br />
              Algo que hubiera querido tener hace 2.5 años.
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

// Estilos (mismos que los anteriores)
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
