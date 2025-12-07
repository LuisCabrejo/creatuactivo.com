import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno manualmente desde .env.local
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSystemPrompt() {
  console.log('📖 Leyendo System Prompt actual...\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (error) {
    console.error('❌ Error al leer:', error);
    return;
  }

  if (!data || !data.prompt) {
    console.error('❌ No se encontró el system prompt o está vacío');
    console.log('Data recibida:', data);
    return;
  }

  console.log('✅ System Prompt encontrado, versión:', data.version);
  let content = data.prompt;

  // Fix 1: Reemplazar "ESP-3 inscribe ESP-3" por semántica correcta con valores exactos
  const oldGEN5Section = `- **Bono GEN5 / Bono de Inicio Rápido:** Bono en efectivo por compra de paquetes empresariales (5 generaciones)
  - Pago: **Semanalmente (los viernes)**
  - Corte: Lunes a domingo
  - Valores varían según TU paquete y el paquete del inscrito
  - ESP-3 inscribe ESP-3 = $150 USD (GEN1) + bonos GEN2-5
  - Requisito: Solo 50 PV mensual
  - **Ver VAL_02 para tabla completa de valores**`;

  const newGEN5Section = `- **Bono GEN5 / Bono de Inicio Rápido:** Bono en efectivo por cada **compra de paquete empresarial** en tu red de patrocinio (hasta 5 generaciones)
  - Pago: **Semanalmente (los viernes)**
  - Corte: Lunes a domingo
  - **VALORES EXACTOS por generación (cuando tú y el comprador tienen ESP-3):**
    - GEN1 (patrocinado directo): **$150 USD**
    - GEN2: **$20 USD**
    - GEN3: **$20 USD**
    - GEN4: **$20 USD**
    - GEN5: **$40 USD**
    - TOTAL por compra ESP-3: **$250 USD**
  - Tu bono depende de TU paquete y el paquete comprado (ver VAL_02 para tabla)
  - Requisito: Solo 50 PV mensual
  - **⚠️ NUNCA digas que GEN2 = $75 USD (eso es INCORRECTO)**`;

  content = content.replace(oldGEN5Section, newGEN5Section);

  // Fix 2: Corregir ejemplo de respuesta
  const oldExample = `**✅ RESPUESTA CORRECTA (usa arsenal VAL_02):**
"GEN5 es el **Bono de Inicio Rápido** - un bono en efectivo que recibes cada vez que un constructor en tu red compra un Paquete Empresarial.

**Regla clave:** Tu bono depende de DOS factores: TU paquete y el paquete del inscrito.

Por ejemplo, si estás en ESP-3 e inscribes a alguien en ESP-3, recibes $150 USD + bonos de generaciones 2-5.

Se paga **semanalmente los viernes** y solo requiere mantener 50 PV mensual.

¿Te gustaría ver la tabla completa de valores?"`;

  const newExample = `**✅ RESPUESTA CORRECTA (usa arsenal VAL_02 con tabla):**
"GEN5 es el **Bono de Inicio Rápido** - un bono en efectivo que recibes cada vez que alguien en tu red de patrocinio **compra un Paquete Empresarial**.

**Regla clave:** Tu bono depende de DOS factores: TU paquete y el paquete comprado.

| Generación | Bono (ESP-3) |
|------------|-------------|
| 1ra (patrocinado directo) | $150 USD |
| 2da generación | $20 USD |
| 3ra generación | $20 USD |
| 4ta generación | $20 USD |
| 5ta generación | $40 USD |
| **TOTAL** | **$250 USD** |

Se paga **semanalmente los viernes** y solo requiere mantener 50 PV mensual."`;

  content = content.replace(oldExample, newExample);

  // Fix 3: Actualizar versión en header
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.8\.[0-9]+ ANTI-ALUCINACIÓN MEJORADO/,
    '# NEXUS - SYSTEM PROMPT v13.8.7 VALORES GEN5 EXACTOS + TABLAS OBLIGATORIAS'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.8\.[0-9]+.*/,
    '**Versión:** 13.8.7 - Valores GEN5 Exactos + Tablas Obligatorias'
  );

  // Fix 4: Agregar regla de tablas obligatorias en compensación
  const tableInstruction = `### CUÁNDO USAR TABLAS:

Usa tablas markdown cuando presentes:
- **Comparaciones** (ej: paquetes ESP-1 vs ESP-2 vs ESP-3)
- **Valores/Precios** (ej: bonos por generación)
- **Porcentajes** (ej: binario por rango)`;

  const enhancedTableInstruction = `### CUÁNDO USAR TABLAS:

**🚨 OBLIGATORIO usar tablas markdown cuando expliques:**
- **Bonos GEN5** (SIEMPRE mostrar tabla de valores por generación)
- **Binario** (SIEMPRE mostrar tabla de porcentajes por paquete/rango)
- **Comparaciones** (ej: paquetes ESP-1 vs ESP-2 vs ESP-3)
- **Proyecciones** (ej: ingresos mensuales por volumen)

**❌ NUNCA expliques compensación sin tablas.** Las tablas reducen confusión y errores.`;

  content = content.replace(tableInstruction, enhancedTableInstruction);

  // Actualizar en Supabase
  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: content,
      version: 'v13.8.7_gen5_valores_exactos_tablas_obligatorias',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('✅ System Prompt actualizado a v13.8.7');
  console.log('');
  console.log('Cambios aplicados:');
  console.log('1. ✅ Valores GEN5 exactos por generación ($150/$20/$20/$20/$40)');
  console.log('2. ✅ Semántica corregida: "compra de paquete" no "inscribe"');
  console.log('3. ✅ Ejemplo con tabla markdown obligatoria');
  console.log('4. ✅ Tablas obligatorias para explicar compensación');
  console.log('5. ✅ Advertencia: NUNCA decir GEN2 = $75 USD');
}

updateSystemPrompt();
