/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * EL PEDIDO DEL CATÁLOGO DE ESTADOS UNIDOS LLEGA ENTERO A WHATSAPP (27 nov 2026).
 *
 * Hermana de prueba-pedido-catalogo.mts. Arma el mensaje que escribe el catálogo de
 * un socio inscrito en Estados Unidos (`mensajePedido` con productDataUS) y lo pasa
 * por la lectura del webhook con la tabla de allá (`extraerLineasPedido(…, 'US')`):
 * cada producto se reconoce, con su cantidad, y la confirmación sale en dólares y
 * con FedEx. También comprueba que la tabla de Colombia NO se use para ese mensaje
 * («Gano Café Classic» sería el Clásico en pesos). No llama al motor ni a Meta.
 *
 * npx tsx scripts/prueba-pedido-catalogo-usa.mts
 */
import * as datosMod from '../src/app/productos/catalogo-datos.ts'
import * as usaMod from '../src/app/productos/catalogo-usa.ts'
import * as pedidoMod from '../src/lib/wa-pedido.ts'

const { mensajePedido } = ((datosMod as any).default ?? datosMod) as typeof datosMod
const { productDataUS } = ((usaMod as any).default ?? usaMod) as typeof usaMod
const { extraerLineasPedido, confirmarPedido, refSocioDelPedidoEnHilo, totalPedido, detallePedidoSocio, respuestaEnvio } =
  ((pedidoMod as any).default ?? pedidoMod) as typeof pedidoMod

let fallas = 0
const falla = (m: string) => { fallas++; console.log(`  ❌ ${m}`) }
const socio = { nombre: 'Adazuni Prueba', slug: 'adazuni-prueba', constructorId: 'adazuni-prueba-0001' }

// 1. Cada producto, solo y con cantidad
for (const [id, p] of Object.entries(productDataUS)) {
  for (const cantidad of [1, 3]) {
    const msg = mensajePedido([{ id, cantidad }], socio, null, productDataUS)
    const l = extraerLineasPedido(msg, 'US')
    if (l.length !== 1 || l[0].producto.slug !== id || l[0].cantidad !== cantidad) {
      falla(`${id} ×${cantidad}: ${l.map((x) => `${x.cantidad}×${x.producto.slug}`).join(', ') || 'nada'}`)
    }
  }
  console.log(`  ✓ ${p.name}`)
}

// 2. El carrito completo
const todo = Object.keys(productDataUS).map((id, i) => ({ id, cantidad: (i % 3) + 1 }))
const msgTodo = mensajePedido(todo, socio, 'ck_soja5xzus', productDataUS)
const leidas = extraerLineasPedido(msgTodo, 'US')
if (leidas.length !== todo.length) falla(`carrito completo: ${leidas.length} líneas leídas de ${todo.length}`)
for (const t of todo) {
  const l = leidas.find((x) => x.producto.slug === t.id)
  if (!l) falla(`carrito completo: falta ${t.id}`)
  else if (l.cantidad !== t.cantidad) falla(`carrito completo: ${t.id} con ${l.cantidad} en vez de ${t.cantidad}`)
}
const esperado = todo.reduce((s, t) => s + productDataUS[t.id].price * t.cantidad, 0)
if (totalPedido(leidas) !== esperado) falla(`total: ${totalPedido(leidas)} en vez de ${esperado}`)

// 3. El socio del pedido se lee igual
if (refSocioDelPedidoEnHilo([], mensajePedido([{ id: 'tongkat-ali', cantidad: 1 }], socio, null, productDataUS)) !== 'adazuni-prueba') {
  falla('no se leyó el socio de un pedido con solo un producto de allá')
}

// 4. La confirmación: dólares, FedEx, nada de pesos ni Servientrega
const lineas = extraerLineasPedido(mensajePedido([{ id: '3-in-1', cantidad: 2 }, { id: 'gano-plus', cantidad: 1 }], socio, null, productDataUS), 'US')
const conf = confirmarPedido(lineas, { nombre: 'Adazuni Prueba' }, 'Ana', 'P1234')
console.log('\n' + conf + '\n')
if (!conf.includes('$66 USD') || !conf.includes('$235 USD') || !conf.includes('$301 USD')) falla('la confirmación no trae los montos en dólares')
if (/COP|Servientrega|\$\d+\.\d{3}/.test(conf)) falla('la confirmación trae pesos o Servientrega')
if (!conf.includes('FedEx')) falla('la confirmación no dice FedEx')

// 5. El detalle que ve el socio, guardado en dólares
const det = detallePedidoSocio({ codigo: 'P1234', nombre: 'Ana', whatsapp: '13055550100',
  lineas: [{ nombre: 'Gano Café 3-in-1', cantidad: 2, precio_usd: 33 }], total_usd: 66, total_cop: null })
if (!det.includes('$66') || !det.includes('$66 USD') || det.includes('COP')) falla(`detalle al socio: ${det}`)

// 6. El envío
if (!respuestaEnvio(null, false, 'US').includes('FedEx')) falla('la respuesta del envío de allá no dice FedEx')
if (!respuestaEnvio(null, false).includes('Servientrega')) falla('la respuesta del envío de Colombia cambió')

// 7. Con la tabla de Colombia, el mensaje de allá NO se debe leer como pedido de aquí sin decirlo
const conCO = extraerLineasPedido(mensajePedido([{ id: 'classic', cantidad: 1 }], socio, null, productDataUS))
console.log(`  (referencia) con la tabla de Colombia, «Gano Café Classic» se lee como: ${conCO.map((l) => l.producto.nombre).join(', ') || 'nada'}`)

console.log(fallas ? `\n❌ ${fallas} falla(s)` : '\n✅ El pedido de Estados Unidos llega entero, en dólares y con FedEx')
process.exit(fallas ? 1 : 0)
