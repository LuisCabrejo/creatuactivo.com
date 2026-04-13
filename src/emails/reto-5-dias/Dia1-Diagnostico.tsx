/**
 * Copyright © 2026 CreaTuActivo.com
 * Auditoría de Arquitectura Patrimonial — Coordenada 01
 * "[COORDENADA 01] Diagnóstico Estructural Habilitado"
 * Lujo Clínico — Due Diligence framing
 */

import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface Dia1Props {
  firstName?: string;
  trackingUrl?: string;
  videoUrl?: string;
}

export const Dia1Diagnostico = ({
  firstName: _firstName,
  trackingUrl,
  videoUrl = 'https://creatuactivo.com/auditoria-patrimonial/dia-1',
}: Dia1Props) => {
  const previewText = `Módulo 01 habilitado. Su auditoría estructural comienza ahora.`;

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
            <Text style={brandText}>
              CreaTu<span style={{ fontWeight: '700', color: '#C8A84B' }}>Activo</span>
            </Text>
          </Section>

          {/* Coordenada badge */}
          <Section style={badgeSection}>
            <Text style={badgeLabel}>COORDENADA 01 — ACCESO HABILITADO</Text>
          </Section>

          {/* Content */}
          <Section style={content}>

            <Text style={openingLine}>
              El sistema ha habilitado su primer módulo de auditoría.
            </Text>

            <Text style={paragraph}>
              A partir de este momento, usted deja de ser un espectador y asume la postura de un <strong style={{ color: '#E5E5E5' }}>analista de riesgos</strong>.
            </Text>

            <Text style={paragraph}>
              El objetivo de la sesión de hoy no es presentarle nuestro ecosistema, sino someter a estrés su infraestructura financiera actual. Vamos a auditar la matemática detrás de su flujo de caja y a medir su nivel de exposición al riesgo.
            </Text>

            {/* Protocolo de Ejecución */}
            <Section style={protocolBox}>
              <Text style={protocolTitle}>PROTOCOLO DE EJECUCIÓN</Text>
              {[
                'Aísle 15 minutos de ancho de banda mental.',
                'Ingrese al enlace seguro a continuación.',
                'Ejecute el cálculo de caducidad financiera que se expone en el informe.',
              ].map((step, i) => (
                <Text key={i} style={protocolStep}>
                  <span style={{ color: '#C8A84B', fontWeight: '700', marginRight: '10px' }}>
                    0{i + 1}
                  </span>
                  {step}
                </Text>
              ))}
            </Section>

            {/* CTA */}
            <Section style={ctaSection}>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tr>
                  <td align="center">
                    <Button
                      href={videoUrl}
                      style={ctaButton}
                    >
                      ACCEDER AL MÓDULO 01: DIAGNÓSTICO ESTRUCTURAL →
                    </Button>
                  </td>
                </tr>
              </table>
            </Section>

            <Text style={closingLine}>
              El escrutinio técnico ha comenzado. Nos vemos en la sala de análisis.
            </Text>

            <Text style={signature}>
              Luis Cabrejo Parra
              <br />
              <span style={signatureTitle}>Dirección Estratégica | CreaTuActivo</span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © 2026 CreaTuActivo.com
              <br />
              Auditoría de Arquitectura Patrimonial — Coordenada 01 de 05
            </Text>
          </Section>

        </Container>
        {trackingUrl && (
          <Img src={trackingUrl} width={1} height={1} alt="" style={{ display: 'block', border: 'none' }} />
        )}
      </Body>
    </Html>
  );
};

export default Dia1Diagnostico;

/* ─── Styles ─── */

const main = {
  backgroundColor: '#080808',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const header = {
  padding: '32px 20px 24px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #1c1c1c',
};

const brandText = {
  margin: 0,
  fontFamily: 'Georgia, serif',
  fontSize: '22px',
  fontWeight: '400' as const,
  color: '#E5E5E5',
  lineHeight: '1.2',
  textAlign: 'center' as const,
};

const badgeSection = {
  textAlign: 'center' as const,
  padding: '24px 20px 0',
};

const badgeLabel = {
  color: '#C8A84B',
  fontSize: '11px',
  fontWeight: '600' as const,
  letterSpacing: '3px',
  margin: 0,
  fontFamily: "'Courier New', monospace",
};

const content = {
  padding: '28px 28px 0',
};

const openingLine = {
  color: '#F5F5F0',
  fontSize: '18px',
  lineHeight: '1.6',
  margin: '0 0 20px',
  fontWeight: '500' as const,
};

const paragraph = {
  color: '#8A8A7A',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0 0 20px',
};

const protocolBox = {
  backgroundColor: '#0d0d0d',
  border: '1px solid #1c1c1c',
  borderLeft: '2px solid #C8A84B',
  padding: '20px 24px',
  margin: '24px 0',
};

const protocolTitle = {
  color: '#C8A84B',
  fontSize: '10px',
  letterSpacing: '3px',
  fontFamily: "'Courier New', monospace",
  margin: '0 0 16px',
};

const protocolStep = {
  color: '#8A8A7A',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0 0 10px',
};

const ctaSection = {
  margin: '32px 0',
};

const ctaButton = {
  backgroundColor: '#C8A84B',
  color: '#000000',
  padding: '16px 28px',
  textDecoration: 'none',
  fontWeight: '800' as const,
  fontSize: '13px',
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  letterSpacing: '1px',
  display: 'inline-block' as const,
};

const closingLine = {
  color: '#6B6B5A',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0 0 28px',
  fontStyle: 'italic' as const,
};

const signature = {
  color: '#F5F5F0',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
};

const signatureTitle = {
  color: '#C8A84B',
  fontSize: '12px',
  letterSpacing: '1px',
};

const hr = {
  borderColor: '#1c1c1c',
  margin: '32px 20px',
};

const footerSection = {
  padding: '0 20px',
};

const footerText = {
  color: '#444',
  fontSize: '11px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  fontFamily: "'Courier New', monospace",
  letterSpacing: '0.5px',
};
