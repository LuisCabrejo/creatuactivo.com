/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Día 4: La Doble Trampa
 * "Gané dinero, pero perdí mi vida (La verdad del E-commerce)"
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

interface Dia4Props {
  firstName?: string;
}

export const Dia4Estigma = ({ firstName = 'Hola' }: Dia4Props) => {
  const previewText = `Gané dinero, pero perdí mi vida (La verdad del E-commerce)`;

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
            <Text style={dayNumber}>DÍA 4</Text>
            <Text style={dayTitle}>La Doble Trampa</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{firstName},</Heading>

            <Text style={paragraph}>
              Ayer te dejé con un cliffhanger: Era el #1, pero algo estaba mal.
            </Text>

            <Text style={paragraph}>
              La verdad es esta: <strong style={{ color: '#f5f5f5' }}>Mi éxito no se duplicaba.</strong>
            </Text>

            <Text style={paragraph}>
              Lo que para mí era natural (hablar, liderar, vender), para mi equipo era una tortura. Veía a gente buena esforzándose y fracasando. El modelo tradicional de "perseguir gente" funcionaba para mí, pero no para ellos.
            </Text>

            <Text style={paragraph}>
              Me sentí culpable. Así que busqué la "salida fácil". Pensé:
            </Text>

            <Text style={highlightBox}>
              "El problema es la gente. Me iré al E-commerce. Venderé productos por internet sin hablar con nadie."
            </Text>

            <Text style={paragraph}>
              Usé mis habilidades técnicas. Monté una tienda online. Empezamos a vender por todo el continente durante la pandemia.
            </Text>

            <Text style={paragraph}>
              ¡Los números subían! Pensé que había encontrado el Santo Grial.
            </Text>

            <Text style={paragraph}>
              <strong style={{ color: '#D4AF37' }}>Pero entonces llegó la segunda bofetada:</strong>
            </Text>

            <Text style={paragraph}>
              El E-commerce tradicional es una <strong style={{ color: '#f5f5f5' }}>pesadilla logística</strong>.
            </Text>

            <Text style={listItem}>• Pasé de "perseguir prospectos" a "perseguir paquetes".</Text>
            <Text style={listItem}>• Estaba despierto a las 3:00 AM resolviendo problemas de aduanas.</Text>
            <Text style={listItem}>• Mis márgenes se los comía la publicidad y el inventario.</Text>

            <Text style={paragraph}>
              Había cambiado un jefe por mil jefes (los clientes). Seguía sin tiempo para mi esposa y mis promesas.
            </Text>

            <Text style={paragraph}>
              En ese momento de desesperación, comparé mis dos fracasos y tuve la <strong style={{ color: '#D4AF37' }}>revelación final</strong>:
            </Text>

            <Text style={modelItem}>
              <span style={{ color: '#D4AF37', fontWeight: '600' }}>1. Red de Mercadeo</span>
              <br />
              La logística era perfecta (Gano Excel ponía todo), pero el sistema de ventas era arcaico.
            </Text>

            <Text style={modelItem}>
              <span style={{ color: '#D4AF37', fontWeight: '600' }}>2. E-commerce</span>
              <br />
              El sistema de ventas era genial (digital), pero la logística era un infierno.
            </Text>

            <Text style={paragraph}>
              Me hice la pregunta del millón:
            </Text>

            <Text style={highlightBox}>
              ¿Qué pasaría si uniera la LOGÍSTICA de Gano Excel (ellos ponen los millones y el inventario) con la TECNOLOGÍA del E-commerce (atracción automática)?
            </Text>

            <Text style={paragraph}>
              Eso, {firstName}, no es MLM tradicional. Y tampoco es E-commerce.
            </Text>

            <Text style={paragraph}>
              Es una <strong style={{ color: '#D4AF37' }}>Arquitectura de Activos</strong>.
            </Text>

            <Text style={paragraph}>
              Mañana te invito a ver los planos de esta nueva categoría.
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
              Reto 5 Días - Día 4 de 5
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Dia4Estigma;

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
