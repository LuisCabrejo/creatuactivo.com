/**
 * ¿El pedido que arma el catálogo lo entiende el webhook? (17 oct 2026)
 *
 *   npx tsx scripts/prueba-pedido-catalogo.mts
 *
 * Sin red. Arma el mensaje con la MISMA función que usa la página
 * (`mensajePedido` de src/app/productos/catalogo-datos.ts) y lo pasa por los
 * detectores del canal, en el orden en que corren:
 *   - 2.24 (enlace al catálogo) NO debe atenderlo: el texto no dice «catálogo».
 *   - 2.45 (pedido) SÍ: `detectarIntencionCompra` + `extraerLineasPedido`, con el
 *     producto y la cantidad exactos de cada línea.
 *   - La referencia del socio queda como candidato de `resolverPatrocinador`.
 * Y el caso escrito a mano: «quiero pedir 2 cajas del 3 en 1 que vi en el
 * catálogo» va al pedido, no al enlace.
 *
 * Exit 1 si algo falla.
 */

import { createRequire } from 'node:module'
import { productData, mensajePedido } from '../src/app/productos/catalogo-datos.ts'
import {
  detectarIntencionCompra, extraerLineasPedido, pedirNombrePedido, RE_PIDIO_NOMBRE_PEDIDO,
  confirmarPedido, RE_PEDIDO_CARGADO, cuandoEscribe, firmaPedido, mismoNumero, resumenLineas,
  detallePedidoSocio, avisoPedidoEnTexto, telefonoLegible, esBotonVerPedido, PAYLOAD_VER_PEDIDO,
} from '../src/lib/wa-pedido.ts'
// wa-onboarding.ts por require: tsx lo compila como CommonJS y el lexer de Node se
// detiene en la «ñ» de `notificarDueño`, así que los exports que vienen después no
// se ven como import con nombre (ver asignar-slugs-por-defecto.mts).
const require = createRequire(import.meta.url)
const { pideEnlaceCatalogo } = require('../src/lib/wa-onboarding.ts')
const { extraerCookieWeb, limpiarCookieWeb } = require('../src/lib/wa-avisos-contexto.ts')

let fallas = 0
const falla = (m: string) => { fallas++; console.log(`  ❌ ${m}`) }

// El candidato de patrocinador, igual que resolverPatrocinador (webhook/route.ts)
const candidatos = (t: string) => t.toLowerCase().match(/[a-záéíóúñ]+(?:-[a-záéíóúñ]+)+(?:-\d{4})?/g) ?? []

const socio = { nombre: 'Luis Cabrejo', slug: 'luis-cabrejo', constructorId: 'luis-cabrejo-1288' }
const ids = Object.keys(productData)

// 1. Cada producto solo, con cantidad 1, 2 y 3
for (const id of ids) {
  for (const cantidad of [1, 2, 3]) {
    const msg = mensajePedido([{ id, cantidad }], socio)
    const lineas = extraerLineasPedido(msg)
    if (!detectarIntencionCompra(msg)) falla(`${id} ×${cantidad}: no abre el pedido`)
    if (pideEnlaceCatalogo(msg)) falla(`${id} ×${cantidad}: lo atendería el enlace del catálogo`)
    if (lineas.length !== 1) { falla(`${id} ×${cantidad}: ${lineas.length} líneas (${lineas.map((l) => l.producto.slug).join(', ')})`); continue }
    if (lineas[0].producto.slug !== id) falla(`${id} ×${cantidad}: leyó ${lineas[0].producto.slug}`)
    if (lineas[0].cantidad !== cantidad) falla(`${id} ×${cantidad}: leyó cantidad ${lineas[0].cantidad}`)
  }
}

// 2. El carrito entero, con cantidades distintas
const todo = ids.map((id, i) => ({ id, cantidad: (i % 3) + 1 }))
const msgTodo = mensajePedido(todo, socio)
const leidas = extraerLineasPedido(msgTodo)
for (const l of todo) {
  const hallada = leidas.find((x) => x.producto.slug === l.id)
  if (!hallada) falla(`carrito completo: falta ${l.id}`)
  else if (hallada.cantidad !== l.cantidad) falla(`carrito completo: ${l.id} con cantidad ${hallada.cantidad}, era ${l.cantidad}`)
}
if (leidas.length !== todo.length) falla(`carrito completo: ${leidas.length} líneas leídas de ${todo.length}`)

// 3. El socio se encuentra
if (!candidatos(msgTodo).includes('luis-cabrejo')) falla('el slug del socio no queda como candidato')
const sinSlug = mensajePedido([{ id: 'ganocafe-3-en-1', cantidad: 1 }], { nombre: 'Luis Cabrejo', constructorId: 'luis-cabrejo-1288' })
if (!candidatos(sinSlug).includes('luis-cabrejo-1288')) falla('sin slug, el constructor_id no queda como candidato')
// …y ningún nombre de producto se confunde con un socio (los tres primeros candidatos cuentan)
const primeros = candidatos(msgTodo).slice(0, 3)
if (primeros[0] !== 'luis-cabrejo') falla(`el primer candidato es «${primeros[0]}», no el socio`)

// 4. Escrito a mano
const aMano = 'Hola, quiero pedir 2 cajas del 3 en 1 que vi en el catálogo'
const lm = extraerLineasPedido(aMano)
if (!detectarIntencionCompra(aMano) || lm.length !== 1 || lm[0].producto.slug !== 'ganocafe-3-en-1' || lm[0].cantidad !== 2) {
  falla(`a mano: «${aMano}» → ${lm.map((l) => `${l.cantidad} ${l.producto.slug}`).join(', ') || 'nada'}`)
}

// 5. Los textos del canal (17 oct 2026) y sus reconocedores
const socioWA = { nombre: 'Luis Cabrejo', whatsapp: '573203415438', constructorId: 'luis-cabrejo-1288', slug: 'luis-cabrejo' }
for (const s of [socioWA, null]) {
  const pide = pedirNombrePedido(s?.nombre)
  if (!RE_PIDIO_NOMBRE_PEDIDO.test(pide)) falla(`la pregunta del nombre no se reconoce: «${pide}»`)
}
if (!RE_PIDIO_NOMBRE_PEDIDO.test('Con mucho gusto. ¿A nombre de quién dejo el pedido? Así Luis Cabrejo sabe con quién se va a comunicar.')) falla('la pregunta del nombre ANTERIOR ya no se reconoce (hilos abiertos)')
const lineasConf = extraerLineasPedido(msgTodo).slice(0, 2)
const mediodia = new Date('2026-10-17T17:00:00Z')   // 12:00 Bogotá
const noche = new Date('2026-10-18T01:30:00Z')      // 20:30 Bogotá
const conf = confirmarPedido(lineasConf, socioWA, 'Juán Rulfo', '48213', mediodia)
if (!RE_PEDIDO_CARGADO.test(conf)) falla('la confirmación nueva no se reconoce como pedido cargado')
if (!RE_PEDIDO_CARGADO.test('Con mucho gusto, Juán. Ya quedó cargado su pedido:')) falla('la confirmación ANTERIOR ya no se reconoce')
if (/este mismo medio|por aqu[ií] mismo/i.test(conf)) falla('la confirmación promete que el socio escribe por el chat de Queswa')
if (!/N\.º 48213/.test(conf)) falla('la confirmación no lleva el número de pedido')
if (!/Luis Cabrejo le escribe hoy por WhatsApp/.test(conf)) falla('al mediodía no dice «le escribe hoy»')
if (!/le escribe mañana/.test(confirmarPedido(lineasConf, socioWA, 'Juan', '48213', noche))) falla('a las 8:30 p. m. no dice «mañana»')
if (cuandoEscribe(new Date('2026-10-17T23:59:00Z')) !== 'hoy') falla('6:59 p. m. debería ser hoy')
if (cuandoEscribe(new Date('2026-10-18T00:00:00Z')) !== 'mañana') falla('7:00 p. m. debería ser mañana')
if (/cat[aá]logo|¿/.test(conf)) falla('la confirmación volvió a llevar el catálogo o una pregunta')
const f1 = await firmaPedido('48213'), f2 = await firmaPedido('48213')
if (f1 !== f2 || !/^[A-Za-z0-9_-]{10}$/.test(f1) || f1 === await firmaPedido('48214')) falla(`firma del enlace inestable o débil: ${f1}`)

// 6. El aviso nunca va al número que pidió; el resumen no se enreda con «·»
if (!mismoNumero('573206805737', '+57 320 680 5737') || !mismoNumero('+573203415438', '3203415438')) falla('mismoNumero no reconoce el mismo teléfono con otro formato')
if (mismoNumero('573206805737', '573203415438') || mismoNumero('', '')) falla('mismoNumero confunde teléfonos distintos o vacíos')
const luvoco = extraerLineasPedido(mensajePedido([{ id: 'ganocafe-3-en-1', cantidad: 1 }, { id: 'luvoco-medio', cantidad: 1 }, { id: 'luvoco-fuerte', cantidad: 2 }], socio))
const resumen = resumenLineas(luvoco)
if (resumen !== '1 × Ganocafé 3 en 1, 1 × Luvoco Medio · 15 cápsulas, 2 × Luvoco Fuerte · 15 cápsulas') falla(`resumen para el socio: «${resumen}»`)
if (/cápsulas\* \(caja de cápsulas\)/.test(confirmarPedido(luvoco, socioWA, 'Juan', '11111', mediodia))) falla('la Luvoco repite la presentación en la confirmación')

// 6b. El código del navegador viaja al final y no estorba (18 oct 2026)
const conCodigo = mensajePedido([{ id: 'ganocafe-3-en-1', cantidad: 2 }, { id: 'luvoco-medio', cantidad: 1 }], socio, 'ck_soja5xzus')
if (!conCodigo.endsWith(' c:soja5xzus')) falla(`el pedido no lleva el código del navegador al final: «${conCodigo.slice(-40)}»`)
if (extraerCookieWeb(conCodigo) !== 'ck_soja5xzus') falla('el webhook no reconoce el código del navegador en el pedido')
const sinCodigo = limpiarCookieWeb(conCodigo)
if (sinCodigo !== mensajePedido([{ id: 'ganocafe-3-en-1', cantidad: 2 }, { id: 'luvoco-medio', cantidad: 1 }], socio)) falla(`el pedido sin el código no queda igual al de siempre: «${sinCodigo}»`)
if (resumenLineas(extraerLineasPedido(sinCodigo)) !== '2 × Ganocafé 3 en 1, 1 × Luvoco Medio · 15 cápsulas') falla('las líneas del pedido cambian con el código')
if (mensajePedido([{ id: 'ganocafe-3-en-1', cantidad: 1 }], socio, 'cualquier-cosa').includes(' c:')) falla('un código que no es de la cookie entra al mensaje')

// 7. El aviso al socio en viñetas (v2, 17 oct 2026)
const guardado = {
  codigo: '47004', nombre: 'Efraín Reyes', whatsapp: '573206805737', total_cop: 563500,
  lineas: [
    { nombre: 'Ganocafé 3 en 1', cantidad: 1, precio_cop: 110900 },
    { nombre: 'Luvoco Medio · 15 cápsulas', cantidad: 2, precio_cop: 110900 },
  ],
}
const detalle = detallePedidoSocio(guardado)
const esperado = '*Pedido N.º 47004 · Efraín Reyes*\n\n• 1 × Ganocafé 3 en 1 · $110.900\n• 2 × Luvoco Medio · 15 cápsulas · $221.800\n\nTotal de productos: *$563.500 COP*'
if (detalle !== esperado) falla(`detalle para el socio:\n${detalle}`)
const aviso = avisoPedidoEnTexto(guardado, ' (atiende Luis Cabrejo)')
if (!aviso.startsWith('*Nuevo pedido N.º 47004 de su catálogo*\n\nCliente: Efraín Reyes, +57 320 680 5737 (atiende Luis Cabrejo)\n\n• 1 × Ganocafé 3 en 1') || !aviso.endsWith('Escríbale hoy para acordar el pago y la entrega.')) falla(`aviso en texto:\n${aviso}`)
if (telefonoLegible('573206805737') !== '+57 320 680 5737' || telefonoLegible('CO.1497020585516131') !== 'sin número visible' || telefonoLegible('13055550100') !== '+13055550100') falla('telefonoLegible')
if (!esBotonVerPedido(`${PAYLOAD_VER_PEDIDO}47004`, 'Ver el pedido') || !esBotonVerPedido(undefined, 'Ver el pedido') || esBotonVerPedido(undefined, 'quiero ver el pedido de café')) falla('esBotonVerPedido')

console.log(`\n${msgTodo.split('\n').slice(0, 6).join('\n')}\n…\n`)
console.log(conf + '\n')
console.log(fallas ? `❌ ${fallas} falla(s)` : `✅ ${ids.length} productos × 3 cantidades, el carrito completo, el socio, el pedido a mano y los textos del canal`)
process.exit(fallas ? 1 : 0)
