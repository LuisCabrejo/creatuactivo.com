/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿`detectarProducto` encuentra lo que la persona nombra — y SOLO eso?
 *
 *   npx tsx scripts/prueba-detector-producto.mts   (exit 1 si falla)
 *
 * Sin red y sin modelo. Nació del caso Marlon (27 sep 2026): «Cómo es el TEma
 * de los 12 niveles» recibió la ficha del té Rooibos, porque el alias «el te»
 * casaba por `includes` dentro de «el tema». La pregunta más caliente del
 * embudo, respondida con una infusión — y el hilo murió ahí. El arreglo es la
 * frontera de palabra (`coincideConFrontera` en wa-productos.ts), que admite
 * el plural pegado («capuchinos») pero no otra palabra.
 *
 * ⚠️ Los NEGATIVOS pesan igual que los positivos: recibir la ficha de un
 * producto que nadie nombró es el mismo fallo que costó a Marlon. Todo falso
 * positivo nuevo que aparezca en una auditoría se agrega aquí con su fecha.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { detectarProducto } from '../src/lib/wa-productos.ts';

const CASOS: { frase: string; espera: string | null; nota?: string }[] = [
  // ── Negativos: frases que NO nombran un producto ──────────────────────────
  { frase: 'Cómo es el tema de los 12 niveles', espera: null,
    nota: 'Marlon, 27 sep 2026 — «el te» dentro de «el tema»' },
  { frase: 'Estoy preguntando sobre el negocio los 12 ciclos o niveles', espera: null },
  { frase: 'ese es otro tema', espera: null },
  { frase: 'hablemos del tema del dinero', espera: null },
  { frase: 'el sistema de distribución', espera: null },
  { frase: 'me interesa el proyecto', espera: null },

  // ── Positivos: lo que ya funcionaba tiene que seguir funcionando ──────────
  { frase: 'cuánto cuesta el te', espera: 'bebida-oleaf-gano-rooibos' },
  { frase: 'me interesa el te rojo', espera: 'bebida-oleaf-gano-rooibos' },
  { frase: 'precio del rooibos', espera: 'bebida-oleaf-gano-rooibos' },
  { frase: 'precio del ganocafe 3 en 1', espera: 'ganocafe-3-en-1' },
  { frase: 'me gustan los capuchinos', espera: 'ganocafe-3-en-1',
    nota: 'el plural pegado («s»/«es») sigue pasando la frontera' },
  { frase: 'cuánto cuesta el cordygold', espera: 'capsulas-cordygold',
    nota: 'la pasada por distancia (12 sep 2026) no se toca' },
  { frase: 'cuánto cuesta el cordigold', espera: 'capsulas-cordygold' },
  { frase: 'el gano schokolade', espera: 'gano-schokoladde',
    nota: 'con frontera, «choko» ya ni siquiera casa dentro de «schokolade»' },
  { frase: 'quiero el shoko rico', espera: 'ganorico-shoko-rico' },
  { frase: 'cuanto cuesta el luvoco fuerte', espera: 'luvoco-fuerte' },
  { frase: 'el colageno', espera: 'bebida-colageno-reskine' },
];

let fallos = 0;
console.log(`🔍 ¿detectarProducto encuentra lo nombrado — y solo eso?  (${CASOS.length} casos)\n`);
for (const c of CASOS) {
  const r = detectarProducto(c.frase);
  const slug = r?.slug ?? null;
  const ok = slug === c.espera;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} «${c.frase}» → ${slug ?? '(nada)'}${ok ? '' : ` — esperaba ${c.espera ?? '(nada)'}`}${c.nota ? `   — ${c.nota}` : ''}`);
}
console.log(`\n${'─'.repeat(70)}`);
if (fallos) { console.log(`🔴 ${fallos} caso(s) fallaron.`); process.exit(1); }
console.log('✅ Todos los casos pasan.');
