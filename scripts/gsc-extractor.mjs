#!/usr/bin/env node
/**
 * Google Search Console Data Extractor
 * CreaTuActivo.com - Enero 2026
 *
 * Extrae datos de rendimiento de GSC automáticamente
 *
 * Uso:
 *   node scripts/gsc-extractor.mjs
 *
 * Primera vez:
 *   1. Configura credenciales en Google Cloud Console
 *   2. Descarga credentials.json a scripts/
 *   3. Ejecuta el script - abrirá navegador para autorizar
 *   4. Los datos se guardan en data/gsc/
 */

import { google } from 'googleapis';
import { createReadStream, createWriteStream, existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { createInterface } from 'readline';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración
const CONFIG = {
  SITE_URL: 'https://creatuactivo.com/', // Tu sitio en GSC
  CREDENTIALS_PATH: join(__dirname, 'gsc-credentials.json'),
  TOKEN_PATH: join(__dirname, 'gsc-token.json'),
  OUTPUT_DIR: join(__dirname, '..', 'data', 'gsc'),
  SCOPES: ['https://www.googleapis.com/auth/webmasters.readonly'],
  // Período de datos (últimos 90 días)
  DATE_RANGE: {
    startDate: getDateDaysAgo(90),
    endDate: getDateDaysAgo(1) // Ayer (GSC tiene delay de ~2 días)
  }
};

// Helpers
function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

function formatNumber(num) {
  return num?.toLocaleString('es-CO') || '0';
}

function formatPercent(num) {
  return num ? `${(num * 100).toFixed(2)}%` : '0%';
}

// Crear directorio de salida si no existe
function ensureOutputDir() {
  if (!existsSync(CONFIG.OUTPUT_DIR)) {
    mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
    console.log(`📁 Directorio creado: ${CONFIG.OUTPUT_DIR}`);
  }
}

// Cargar credenciales
async function loadCredentials() {
  if (!existsSync(CONFIG.CREDENTIALS_PATH)) {
    console.error(`
❌ No se encontró el archivo de credenciales.

📋 PASOS PARA CONFIGURAR:

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo o selecciona uno existente
3. Ve a "APIs y servicios" → "Biblioteca"
4. Busca "Google Search Console API" y habilítala
5. Ve a "APIs y servicios" → "Credenciales"
6. Click "Crear credenciales" → "ID de cliente OAuth"
7. Tipo de aplicación: "Aplicación de escritorio"
8. Descarga el JSON
9. Renómbralo a "gsc-credentials.json"
10. Muévelo a: ${CONFIG.CREDENTIALS_PATH}

Luego ejecuta este script de nuevo.
    `);
    process.exit(1);
  }

  const content = readFileSync(CONFIG.CREDENTIALS_PATH, 'utf-8');
  return JSON.parse(content);
}

// Autorización OAuth2
async function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Verificar si ya tenemos token guardado
  if (existsSync(CONFIG.TOKEN_PATH)) {
    const token = JSON.parse(readFileSync(CONFIG.TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(token);

    // Verificar si el token está expirado
    if (token.expiry_date && token.expiry_date < Date.now()) {
      console.log('🔄 Token expirado, renovando...');
      try {
        const { credentials: newCredentials } = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials(newCredentials);
        writeFileSync(CONFIG.TOKEN_PATH, JSON.stringify(newCredentials));
        console.log('✅ Token renovado');
      } catch (error) {
        console.log('⚠️ No se pudo renovar, solicitando nueva autorización...');
        return getNewToken(oAuth2Client);
      }
    }

    return oAuth2Client;
  }

  return getNewToken(oAuth2Client);
}

// Obtener nuevo token (primera vez)
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: CONFIG.SCOPES,
  });

  console.log(`
🔐 AUTORIZACIÓN REQUERIDA

1. Abre esta URL en tu navegador:

${authUrl}

2. Autoriza la aplicación con tu cuenta de Google
3. Copia el código que te da Google
4. Pégalo aquí abajo:
  `);

  // Intentar abrir el navegador automáticamente
  try {
    const openCommand = process.platform === 'darwin' ? 'open' :
                        process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(openCommand, [authUrl], { detached: true, stdio: 'ignore' });
  } catch (e) {
    // Si no puede abrir, el usuario lo hace manualmente
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Código de autorización: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code.trim());
        oAuth2Client.setCredentials(tokens);
        writeFileSync(CONFIG.TOKEN_PATH, JSON.stringify(tokens));
        console.log('✅ Token guardado exitosamente');
        resolve(oAuth2Client);
      } catch (error) {
        reject(new Error(`Error obteniendo token: ${error.message}`));
      }
    });
  });
}

// Extraer datos de rendimiento
async function fetchPerformanceData(auth, dimensions, rowLimit = 1000) {
  const searchConsole = google.searchconsole({ version: 'v1', auth });

  try {
    const response = await searchConsole.searchanalytics.query({
      siteUrl: CONFIG.SITE_URL,
      requestBody: {
        startDate: CONFIG.DATE_RANGE.startDate,
        endDate: CONFIG.DATE_RANGE.endDate,
        dimensions: dimensions,
        rowLimit: rowLimit,
        // Ordenar por clics descendente
        // dimensionFilterGroups: [],
      }
    });

    return response.data.rows || [];
  } catch (error) {
    console.error(`❌ Error extrayendo datos (${dimensions.join(', ')}):`, error.message);
    return [];
  }
}

// Guardar datos como CSV
function saveToCSV(data, filename, headers) {
  const filepath = join(CONFIG.OUTPUT_DIR, filename);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const value = row[h];
      // Escapar comillas y valores con comas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  writeFileSync(filepath, csvContent, 'utf-8');
  console.log(`💾 Guardado: ${filepath}`);
  return filepath;
}

// Guardar datos como JSON (para análisis programático)
function saveToJSON(data, filename) {
  const filepath = join(CONFIG.OUTPUT_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`💾 Guardado: ${filepath}`);
  return filepath;
}

// Procesar y formatear datos de queries
function processQueryData(rows) {
  return rows.map(row => ({
    query: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: (row.ctr * 100).toFixed(2),
    position: row.position.toFixed(1)
  }));
}

// Procesar y formatear datos de páginas
function processPageData(rows) {
  return rows.map(row => ({
    page: row.keys[0].replace(CONFIG.SITE_URL, '/'),
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: (row.ctr * 100).toFixed(2),
    position: row.position.toFixed(1)
  }));
}

// Procesar datos por fecha
function processDateData(rows) {
  return rows.map(row => ({
    date: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: (row.ctr * 100).toFixed(2),
    position: row.position.toFixed(1)
  }));
}

// Procesar datos por país
function processCountryData(rows) {
  return rows.map(row => ({
    country: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: (row.ctr * 100).toFixed(2),
    position: row.position.toFixed(1)
  }));
}

// Procesar datos por dispositivo
function processDeviceData(rows) {
  return rows.map(row => ({
    device: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: (row.ctr * 100).toFixed(2),
    position: row.position.toFixed(1)
  }));
}

// Generar resumen de análisis
function generateSummary(data) {
  const { queries, pages, dates, countries, devices } = data;

  // Calcular totales
  const totalClicks = queries.reduce((sum, q) => sum + q.clicks, 0);
  const totalImpressions = queries.reduce((sum, q) => sum + q.impressions, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : 0;
  const avgPosition = queries.length > 0
    ? (queries.reduce((sum, q) => sum + parseFloat(q.position), 0) / queries.length).toFixed(1)
    : 0;

  // Quick Wins: queries en posición 5-20 con buen CTR potencial
  const quickWins = queries.filter(q =>
    parseFloat(q.position) >= 5 &&
    parseFloat(q.position) <= 20 &&
    q.impressions >= 10
  ).sort((a, b) => b.impressions - a.impressions).slice(0, 20);

  // Top performers
  const topQueries = queries.slice(0, 20);
  const topPages = pages.slice(0, 10);

  // Tendencia (comparar primera y última semana)
  const sortedDates = [...dates].sort((a, b) => a.date.localeCompare(b.date));
  const firstWeek = sortedDates.slice(0, 7);
  const lastWeek = sortedDates.slice(-7);
  const firstWeekClicks = firstWeek.reduce((sum, d) => sum + d.clicks, 0);
  const lastWeekClicks = lastWeek.reduce((sum, d) => sum + d.clicks, 0);
  const trend = firstWeekClicks > 0
    ? ((lastWeekClicks - firstWeekClicks) / firstWeekClicks * 100).toFixed(1)
    : 0;

  return {
    period: {
      start: CONFIG.DATE_RANGE.startDate,
      end: CONFIG.DATE_RANGE.endDate
    },
    totals: {
      clicks: totalClicks,
      impressions: totalImpressions,
      avgCTR: `${avgCTR}%`,
      avgPosition: avgPosition
    },
    trend: {
      firstWeekClicks,
      lastWeekClicks,
      percentChange: `${trend}%`,
      direction: parseFloat(trend) >= 0 ? '📈 Subiendo' : '📉 Bajando'
    },
    quickWins,
    topQueries,
    topPages,
    countries: countries.slice(0, 10),
    devices
  };
}

// Generar reporte markdown
function generateMarkdownReport(summary) {
  const report = `# Reporte Google Search Console - CreaTuActivo.com

**Período:** ${summary.period.start} a ${summary.period.end}
**Generado:** ${new Date().toISOString().split('T')[0]}

---

## Resumen General

| Métrica | Valor |
|---------|-------|
| **Clics totales** | ${formatNumber(summary.totals.clicks)} |
| **Impresiones totales** | ${formatNumber(summary.totals.impressions)} |
| **CTR promedio** | ${summary.totals.avgCTR} |
| **Posición promedio** | ${summary.totals.avgPosition} |

### Tendencia (últimos 90 días)

${summary.trend.direction}

- Primera semana: ${formatNumber(summary.trend.firstWeekClicks)} clics
- Última semana: ${formatNumber(summary.trend.lastWeekClicks)} clics
- Cambio: ${summary.trend.percentChange}

---

## Quick Wins (Oportunidades de Mejora)

Queries en posición 5-20 con potencial de subir a top 3:

| Query | Posición | Impresiones | Clics | CTR |
|-------|----------|-------------|-------|-----|
${summary.quickWins.map(q =>
  `| ${q.query.substring(0, 50)} | ${q.position} | ${formatNumber(q.impressions)} | ${formatNumber(q.clicks)} | ${q.ctr}% |`
).join('\n')}

---

## Top 20 Queries (Por Clics)

| Query | Clics | Impresiones | CTR | Posición |
|-------|-------|-------------|-----|----------|
${summary.topQueries.map(q =>
  `| ${q.query.substring(0, 50)} | ${formatNumber(q.clicks)} | ${formatNumber(q.impressions)} | ${q.ctr}% | ${q.position} |`
).join('\n')}

---

## Top 10 Páginas

| Página | Clics | Impresiones | CTR | Posición |
|--------|-------|-------------|-----|----------|
${summary.topPages.map(p =>
  `| ${p.page} | ${formatNumber(p.clicks)} | ${formatNumber(p.impressions)} | ${p.ctr}% | ${p.position} |`
).join('\n')}

---

## Distribución por País

| País | Clics | Impresiones | CTR |
|------|-------|-------------|-----|
${summary.countries.map(c =>
  `| ${c.country} | ${formatNumber(c.clicks)} | ${formatNumber(c.impressions)} | ${c.ctr}% |`
).join('\n')}

---

## Distribución por Dispositivo

| Dispositivo | Clics | Impresiones | CTR |
|-------------|-------|-------------|-----|
${summary.devices.map(d =>
  `| ${d.device} | ${formatNumber(d.clicks)} | ${formatNumber(d.impressions)} | ${d.ctr}% |`
).join('\n')}

---

## Recomendaciones

### 1. Quick Wins Prioritarios
${summary.quickWins.slice(0, 5).map((q, i) =>
  `${i + 1}. **"${q.query}"** - Posición ${q.position}, ${formatNumber(q.impressions)} impresiones. Optimizar contenido para subir a top 3.`
).join('\n')}

### 2. Acciones Sugeridas
- Revisar meta descriptions de páginas con CTR < 2%
- Crear contenido para queries con muchas impresiones pero pocos clics
- Optimizar títulos para queries en posición 4-10

---

*Reporte generado automáticamente por gsc-extractor.mjs*
`;

  return report;
}

// Main
async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  Google Search Console Extractor - CreaTuActivo.com       ║
╚═══════════════════════════════════════════════════════════╝
`);

  console.log(`📅 Período: ${CONFIG.DATE_RANGE.startDate} a ${CONFIG.DATE_RANGE.endDate}\n`);

  // Preparar
  ensureOutputDir();

  // Cargar credenciales y autorizar
  console.log('🔑 Cargando credenciales...');
  const credentials = await loadCredentials();

  console.log('🔐 Autorizando...');
  const auth = await authorize(credentials);

  console.log('✅ Autorizado exitosamente\n');

  // Extraer datos
  console.log('📊 Extrayendo datos de Search Console...\n');

  console.log('  → Queries...');
  const queryRows = await fetchPerformanceData(auth, ['query'], 1000);
  const queries = processQueryData(queryRows);

  console.log('  → Páginas...');
  const pageRows = await fetchPerformanceData(auth, ['page'], 500);
  const pages = processPageData(pageRows);

  console.log('  → Por fecha...');
  const dateRows = await fetchPerformanceData(auth, ['date'], 500);
  const dates = processDateData(dateRows);

  console.log('  → Por país...');
  const countryRows = await fetchPerformanceData(auth, ['country'], 50);
  const countries = processCountryData(countryRows);

  console.log('  → Por dispositivo...');
  const deviceRows = await fetchPerformanceData(auth, ['device'], 10);
  const devices = processDeviceData(deviceRows);

  console.log('\n✅ Datos extraídos\n');

  // Guardar CSVs
  console.log('💾 Guardando archivos...\n');

  const timestamp = new Date().toISOString().split('T')[0];

  saveToCSV(queries, `queries_${timestamp}.csv`, ['query', 'clicks', 'impressions', 'ctr', 'position']);
  saveToCSV(pages, `pages_${timestamp}.csv`, ['page', 'clicks', 'impressions', 'ctr', 'position']);
  saveToCSV(dates, `dates_${timestamp}.csv`, ['date', 'clicks', 'impressions', 'ctr', 'position']);
  saveToCSV(countries, `countries_${timestamp}.csv`, ['country', 'clicks', 'impressions', 'ctr', 'position']);
  saveToCSV(devices, `devices_${timestamp}.csv`, ['device', 'clicks', 'impressions', 'ctr', 'position']);

  // Guardar JSON completo
  const allData = { queries, pages, dates, countries, devices };
  saveToJSON(allData, `gsc_data_${timestamp}.json`);

  // Generar resumen
  console.log('\n📈 Generando análisis...\n');
  const summary = generateSummary(allData);
  saveToJSON(summary, `summary_${timestamp}.json`);

  // Generar reporte markdown
  const report = generateMarkdownReport(summary);
  const reportPath = join(CONFIG.OUTPUT_DIR, `REPORTE_GSC_${timestamp}.md`);
  writeFileSync(reportPath, report, 'utf-8');
  console.log(`📄 Reporte: ${reportPath}`);

  // Mostrar resumen en consola
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    RESUMEN RÁPIDO                         ║
╚═══════════════════════════════════════════════════════════╝

📊 TOTALES (últimos 90 días)
   Clics: ${formatNumber(summary.totals.clicks)}
   Impresiones: ${formatNumber(summary.totals.impressions)}
   CTR: ${summary.totals.avgCTR}
   Posición promedio: ${summary.totals.avgPosition}

📈 TENDENCIA
   ${summary.trend.direction} (${summary.trend.percentChange})

🎯 TOP 5 QUICK WINS
${summary.quickWins.slice(0, 5).map((q, i) =>
  `   ${i + 1}. "${q.query.substring(0, 40)}..." (pos: ${q.position})`
).join('\n')}

📂 Archivos guardados en: ${CONFIG.OUTPUT_DIR}

✅ ¡Extracción completada!
`);
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
