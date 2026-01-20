/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Día 3: El Modelo
 * "Las 3 promesas que le hice a mi esposa (y las 2 que rompí)"
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

interface Dia3Props {
  firstName?: string;
}

export const Dia3Modelo = ({ firstName = 'Hola' }: Dia3Props) => {
  const previewText = `Las 3 promesas que le hice a mi esposa (y las 2 que rompí)`;

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
            <Text style={dayNumber}>DÍA 3</Text>
            <Text style={dayTitle}>El Modelo</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Voy a contarte algo personal.
            </Text>

            <Text style={paragraph}>
              Cuando estaba de novio con mi esposa, la llevé a un mirador en los Llanos que se llama Buena Vista. Y ahí le hice tres promesas:
            </Text>

            <Text style={listItem}>• Una casa de campo para que los niños corrieran</Text>
            <Text style={listItem}>• Que pudiera ir de compras sin mirar la etiqueta</Text>
            <Text style={listItem}>• Tres hijos</Text>

            <Text style={paragraph}>
              Catorce años después...
            </Text>

            <Text style={highlightBox}>
              De las tres promesas, solo había cumplido con los tres hijos.
            </Text>

            <Text style={paragraph}>
              No era por falta de esfuerzo. Trabajaba sin descanso. Pero mi vida se había convertido en el <strong style={{ color: '#f5f5f5' }}>Plan por Defecto</strong>: trabajar, pagar cuentas, repetir.
            </Text>

            <Text style={paragraph}>
              Entonces entendí algo crucial:
            </Text>

            <Text style={paragraph}>
              <strong style={{ color: '#D4AF37' }}>El problema no era mi esfuerzo. Era el vehículo.</strong>
            </Text>

            <Text style={paragraph}>
              Necesitaba un modelo que funcionara matemáticamente diferente. Un modelo con tres características:
            </Text>

            <Text style={modelItem}>
              <span style={{ color: '#D4AF37', fontWeight: '600' }}>1. Ingresos Recurrentes</span>
              <br />
              No vender una vez, sino crear clientes que paguen mes a mes.
            </Text>

            <Text style={modelItem}>
              <span style={{ color: '#D4AF37', fontWeight: '600' }}>2. Apalancamiento</span>
              <br />
              Que mi trabajo de hoy siga generando resultados mañana.
            </Text>

            <Text style={modelItem}>
              <span style={{ color: '#D4AF37', fontWeight: '600' }}>3. Duplicación</span>
              <br />
              Que otros puedan replicar el sistema sin ser expertos.
            </Text>

            <Text style={paragraph}>
              Encontré ese modelo en la industria de la distribución. Trabajé 2 horas extra al día.
            </Text>

            <Text style={paragraph}>
              En 2.5 años, pasé de cero a ser el #1 de mi organización. Viajes, premios, reconocimiento.
            </Text>

            <Text style={paragraph}>
              Parecía que lo había logrado. Parecía que iba a cumplir las promesas.
            </Text>

            <Text style={highlightBox}>
              Pero aunque ganaba dinero, no tenía libertad real, y mi conciencia no estaba tranquila.
            </Text>

            <Text style={paragraph}>
              Mañana te cuento por qué mi "éxito" se sentía como un fracaso.
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
              Reto 5 Días - Día 3 de 5
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Dia3Modelo;

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

const listItem = {
  color: '#a0a0a8',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '0 0 8px',
  paddingLeft: '8px',
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

const modelItem = {
  color: '#a0a0a8',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
  padding: '16px',
  backgroundColor: '#12121a',
  borderRadius: '8px',
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
