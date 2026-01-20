/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Día 2: Los Vehículos
 * "Por qué tu plan no funciona"
 */

import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface Dia2Props {
  firstName?: string;
}

export const Dia2Vehiculos = ({ firstName = 'Hola' }: Dia2Props) => {
  const previewText = `Día 2: ${firstName}, por qué tu plan no funciona`;

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
            <Text style={dayNumber}>DÍA 2</Text>
            <Text style={dayTitle}>Los Vehículos</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Ayer calculaste tus Días de Libertad.
            </Text>

            <Text style={paragraph}>
              Hoy quiero mostrarte por qué, probablemente, tu plan actual no te llevará a donde quieres.
            </Text>

            <Text style={paragraph}>
              La mayoría de la gente sigue uno de estos tres caminos:
            </Text>

            {/* Vehicle 1 */}
            <Text style={vehicleTitle}>
              <span style={{ color: '#D4AF37' }}>1.</span> El Empleo Tradicional
            </Text>
            <Text style={vehicleDesc}>
              Intercambias tiempo por dinero. Tu techo está limitado por las horas del día y la decisión de un jefe. El 95% de los empleados nunca lograrán libertad financiera.
            </Text>

            {/* Vehicle 2 */}
            <Text style={vehicleTitle}>
              <span style={{ color: '#D4AF37' }}>2.</span> El Emprendimiento Clásico
            </Text>
            <Text style={vehicleDesc}>
              Más riesgo, potencialmente más recompensa. Pero solo 1 de cada 100 negocios sobrevive 10 años. Y muchos emprendedores terminan siendo esclavos de su propio negocio.
            </Text>

            {/* Vehicle 3 */}
            <Text style={vehicleTitle}>
              <span style={{ color: '#D4AF37' }}>3.</span> Las Inversiones
            </Text>
            <Text style={vehicleDesc}>
              Excelente... si ya tienes capital. Para generar $3,000/mes de ingresos pasivos con inversiones tradicionales (7% anual), necesitarías $500,000 invertidos.
            </Text>

            <Text style={highlightBox}>
              <strong>El problema no es tu esfuerzo. Es el vehículo.</strong>
            </Text>

            <Text style={paragraph}>
              Yo seguí el "plan por defecto" durante 20 años. Trabajar, pagar cuentas, repetir. A los 40, quebrado.
            </Text>

            <Text style={paragraph}>
              No fue hasta que cambié de vehículo que todo cambió.
            </Text>

            <Text style={paragraph}>
              Mañana te mostraré el modelo matemático que lo hizo posible.
            </Text>

            <Text style={signature}>
              Hacia tu soberanía,
              <br /><br />
              Luis Cabrejo
              <br />
              <span style={signatureTitle}>Arquitecto de Activos</span>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Reto 5 Días - Día 2 de 5
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Dia2Vehiculos;

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

const vehicleTitle = {
  color: '#f5f5f5',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 8px',
};

const vehicleDesc = {
  color: '#a0a0a8',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
  paddingLeft: '20px',
  borderLeft: '2px solid #2a2a35',
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
