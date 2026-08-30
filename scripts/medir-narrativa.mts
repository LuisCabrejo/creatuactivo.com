/**
 * © CreaTuActivo.com — Propietario y confidencial.
 *
 * MEDIDOR DE NARRATIVA — la rúbrica de fluidez del canal, sobre producción.
 *
 * Nació de la investigación del 29 ago 2026 (docs/investigaciones/resultados/
 * BRECHA_NARRATIVA_MEDIDA_AGO2026.md), que midió por qué las respuestas de
 * Gemini fluyen y las nuestras no. La conclusión: no es el largo de la frase
 * (16,3 vs 16,9 palabras) ni las negaciones (nosotros negamos MENOS). Es la
 * BISAGRA —la palabra que anuncia qué tipo de paso viene— y la traducción del
 * dato a lo que significa para quien lee.
 *
 * Uso:  npx tsx scripts/medir-narrativa.mts [--dias 45]
 *
 * Mide SOLO lo que el modelo compone: los textos dictados por el backend los
 * escribimos nosotros y no dicen nada de cómo está redactando el modelo.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
const { createClient } = await import('@supabase/supabase-js');

const dias = Number(process.argv[process.argv.indexOf('--dias') + 1]) || 45;
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const { data } = await s.from('nexus_conversations').select('messages')
  .like('fingerprint_id', 'wa_%').gte('created_at', new Date(Date.now() - dias*864e5).toISOString()).limit(5000);

/** Prefijos de los nodos dictados. Al añadir un nodo nuevo, súmelo aquí. */
const DICTADO = /Le pongo el ejemplo|Le pongo un ejemplo|Con la tarifa del|Comprendo su objetivo|Comprendo su consulta|Le agradezco la confianza|Le entiendo, y ojalá|quedó cargado su pedido|Hola\. Un gusto saludarle|Aquí lo tiene de nuevo|Atienden a quienes|Con gusto se la daría|Eso lo acuerda|Claro que sí\. Ya le avisé|Con gusto le cargo su Ganocafé|No logré identificar|Permítame precisarlo|Lo que me describe necesita|\[Foto|Portafolio Gano Excel|·\s*INVIMA|Con gusto\. El \*Ganocafé Clásico\* se prepara/;

const textos: string[] = [];
for (const c of data ?? []) for (const m of (c.messages ?? []) as any[]) {
  if (m?.role !== 'assistant' || typeof m.content !== 'string') continue;
  const t = m.content.trim(); if (t.length < 180 || DICTADO.test(t)) continue; textos.push(t);
}

export const BISAGRA = /^(dicho esto|sin embargo|ahora bien|por eso|por esta raz[oó]n|esto significa|es decir|en ese caso|de hecho|as[ií] que|lo que s[ií]|en cambio|adem[aá]s|de ah[ií]|por lo que|para orientarle|para serle|es importante|lo importante|con eso|y (por eso|as[ií])|de modo que|y ah[ií] es donde|lo que hace)/i;
const LECTOR = /\b(le (brinda|da|permite|aporta|entrega|cubre|queda|sirve|ayuda|conviene|resulta|deja|rinde)|para usted|en su (caso|rutina|d[ií]a|ma[ñn]ana|semana)|su rutina|si usted|lo ve en)\b/gi;
const PUENTE = /(por eso|as[ií] que|con eso|entonces|de ah[ií]|lo que sigue|el siguiente paso|ahora que|una vez|cuando|y ah[ií])/i;
const frases = (t: string) => t.replace(/\n+/g, ' ').split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(x => x.length > 3);

let nF = 0, nP = 0, bisTotal = 0, bisInterna = 0, internas = 0, conBisagra = 0, lec = 0, puentes = 0, conCierre = 0;
for (const t of textos) {
  const fs = frases(t); if (!fs.length) continue;
  nF += fs.length; nP += t.split(/\s+/).length;
  let tiene = 0;
  fs.forEach((f, i) => { if (BISAGRA.test(f)) { bisTotal++; if (i > 0) { bisInterna++; tiene++; } } if (i > 0) internas++; });
  if (tiene) conBisagra++;
  lec += (t.match(LECTOR) ?? []).length;
  if (/\?$/.test(fs[fs.length - 1]) && fs.length > 1) { conCierre++; if (PUENTE.test(fs[fs.length - 2])) puentes++; }
}

const meta = (v: number, m: number) => (v >= m ? '✅' : '⚠️ ') + ` (meta ≥ ${m})`;
const pct = (a: number, b: number) => (a / b * 100);
console.log(`\n╔═ NARRATIVA DEL CANAL · ${textos.length} respuestas compuestas · últimos ${dias} días ═╗\n`);
console.log(`  Frases que abren con bisagra          ${pct(bisTotal, nF).toFixed(1)} %   ${meta(pct(bisTotal, nF), 12)}`);
console.log(`  Respuestas con bisagra interna        ${pct(conBisagra, textos.length).toFixed(0)} %   ${meta(pct(conBisagra, textos.length), 60)}`);
console.log(`  Puente antes de la pregunta final     ${pct(puentes, conCierre).toFixed(0)} %   ${meta(pct(puentes, conCierre), 50)}`);
console.log(`  Orientación al lector / 100 palabras  ${(lec / nP * 100).toFixed(2)}   ${meta(lec / nP * 100, 1.0)}`);
console.log(`\n  Línea base del 29 ago 2026: 2,3 % · 13 % · 12 % · 0,27`);
console.log(`  ⚠️ Si esto sube y los bloqueos del guardarraíl suben con ello, la glosa`);
console.log(`     se fue al RESULTADO. Correr test-guardarrail-salud y -negocio.\n`);
