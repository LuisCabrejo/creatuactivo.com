/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Día 1: El Diagnóstico
 * "Sobre el número que acabas de ver..."
 *
 * FLUJO HÍBRIDO: Funciona para usuarios que:
 * 1. Ya usaron la Calculadora en Home (valida su dolor)
 * 2. Entraron directo al Reto (los invita a calcular)
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

interface Dia1Props {
  firstName?: string;
}

export const Dia1Diagnostico = ({ firstName = 'Hola' }: Dia1Props) => {
  const previewText = `Sobre el número que acabas de ver... (El Diagnóstico)`;

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
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

          {/* Day Badge */}
          <Section style={dayBadge}>
            <Text style={dayNumber}>DÍA 1</Text>
            <Text style={dayTitle}>El Diagnóstico</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>Hola {firstName},</Heading>

            <Text style={paragraph}>
              Te damos la bienvenida al Día 1 del Reto.
            </Text>

            <Text style={paragraph}>
              Si llegaste aquí a través de nuestra página de inicio, es probable que ya hayas pasado por la <strong style={{ color: '#C5A059' }}>Calculadora de Libertad</strong> y hayas visto tu número.
            </Text>

            <Text style={inlineLink}>
              (Si aún no lo has hecho, <a href="https://creatuactivo.com/calculadora?source=reto-dia1" style={link}>calcula tu número aquí</a> antes de seguir leyendo.)
            </Text>

            <Text style={paragraph}>
              Ahora, hablemos con la verdad sobre ese número.
            </Text>

            <Text style={highlightBox}>
              Para la gran mayoría de personas, el resultado es <strong>menos de 30 días</strong>. Eso significa que estás a un solo mes de distancia de la quiebra técnica si tu ingreso principal se detiene.
            </Text>

            <Text style={paragraph}>
              Ese número no es para juzgarte. <strong style={{ color: '#E5E5E5' }}>Es para despertarte.</strong>
            </Text>

            <Text style={paragraph}>
              Yo estuve ahí. Tenía lo que muchos llamarían "estabilidad", pero mis Días de Libertad eran casi cero. Vivía en lo que llamo la <strong style={{ color: '#C5A059' }}>Zona de Peligro</strong>: corriendo cada vez más rápido solo para quedarme en el mismo lugar.
            </Text>

            <Text style={paragraph}>
              La razón por la que tu número es bajo no es porque gastes mucho o ganes poco. Es porque estás operando bajo el <strong style={{ color: '#E5E5E5' }}>"Plan por Defecto"</strong>.
            </Text>

            <Text style={paragraph}>
              El sistema tradicional (empleo o autoempleo lineal) está diseñado matemáticamente para que tus gastos crezcan a la par de tus ingresos, manteniéndote atrapado en ese ciclo de 30 días.
            </Text>

            <Text style={highlightBox}>
              <strong>La buena noticia:</strong> No necesitas "ahorrar más" (eso es lento y doloroso). Necesitas <strong style={{ color: '#C5A059' }}>cambiar de vehículo</strong>.
            </Text>

            <Text style={paragraph}>
              Mañana, en el Día 2, te voy a mostrar por qué tu vehículo actual tiene un "motor defectuoso" para crear libertad, y cuál es la alternativa que usan los verdaderos Arquitectos de Activos.
            </Text>

            <Text style={paragraph}>
              <strong style={{ color: '#C5A059' }}>Tu viaje para cambiar ese número rojo a verde acaba de empezar.</strong>
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

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 CreaTuActivo.com
              <br />
              Reto 5 Días - Día 1 de 5
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Dia1Diagnostico;

const main = {
  backgroundColor: '#0F1115',
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
  color: '#C5A059',
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
  backgroundColor: '#1A1D23',
  borderLeft: '4px solid #C5A059',
  padding: '20px 24px',
  color: '#E5E5E5',
  fontSize: '17px',
  lineHeight: '1.6',
  margin: '24px 0',
  borderRadius: '0 8px 8px 0',
};

const inlineLink = {
  color: '#A3A3A3',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
  fontStyle: 'italic' as const,
};

const link = {
  color: '#C5A059',
  textDecoration: 'underline',
};

const signature = {
  color: '#f5f5f5',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0 0',
};

const signatureTitle = {
  color: '#C5A059',
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
