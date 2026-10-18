/**
 * «¿Cómo prefiere pagarlo?» — pagar a Gano Excel o con el socio (17 oct 2026). Sin red.
 *   npx tsx scripts/prueba-forma-de-pago.mts   (exit 1 si algo falla)
 */
import assert from 'node:assert/strict'
import {
  confirmarPedidoConFormaDePago, RE_PREGUNTO_FORMA_PAGO, botonesFormaDePago, botonPagoElegido,
  codigoDelPedidoEnTexto, leerFormaDePagoEscrita, tituloBotonSocio, enlacePagoGano, textoPagoGano, textoPagoSocio, firmaPedido,
} from '../src/lib/wa-pedido'
import { PRODUCTOS_WA } from '../src/lib/wa-productos'
import { lineasAItemsGano, leerCarritoDeUrl, carritoAUrl, INVENTARIO_GANO, DEPARTAMENTOS_CON_ENVIO, SIN_ENVIO_GANO } from '../src/lib/gano-inventario'

process.env.WA_BRIDGE_SECRET ||= 'prueba'
let n = 0
const ok = (c: boolean, msg: string) => { n++; assert.ok(c, msg) }

const cafe = PRODUCTOS_WA.find((p) => p.slug === 'ganocafe-3-en-1')!
const lineas = [{ producto: cafe, cantidad: 2 }]

// La confirmación cierra en la pregunta y la regex la reconoce
const conf = confirmarPedidoConFormaDePago(lineas, 'Milena❤️', '47004')
ok(conf.startsWith('Listo, Milena.'), 'saluda por el nombre limpio')
ok(conf.includes('N.º 47004'), 'lleva el número de pedido')
ok(RE_PREGUNTO_FORMA_PAGO.test(conf), 'termina en la pregunta')
ok(codigoDelPedidoEnTexto(conf) === '47004', 'el código se lee del texto')
ok(!RE_PREGUNTO_FORMA_PAGO.test('¿Le muestro el catálogo?'), 'otra pregunta no dispara')

// Botones: ids con el código, títulos ≤ 20 (tope de Meta)
const botones = botonesFormaDePago('47004', 'Luis Cabrejo')
ok(botones.length === 2 && botones.every((b) => b.title.length <= 20), 'dos botones de ≤ 20 caracteres')
ok(botonPagoElegido(botones[0].id)?.via === 'gano' && botonPagoElegido(botones[0].id)?.codigo === '47004', 'botón Gano')
ok(botonPagoElegido(botones[1].id)?.via === 'socio', 'botón socio')
ok(botonPagoElegido('pedido_ver:47004') === null && botonPagoElegido(undefined) === null, 'otros payloads no')
ok(tituloBotonSocio('Luis Cabrejo') === 'Pagar con Luis', 'Pagar con Luis')
ok(tituloBotonSocio('Maximiliano Constantino') === 'Con mi distribuidor', 'nombre largo → genérico')
ok(tituloBotonSocio(undefined) === 'Con mi distribuidor', 'sin socio → genérico')

// Lo escrito
for (const [t, esperado] of [['a Gano', 'gano'], ['Por PSE', 'gano'], ['1', 'gano'], ['directo a gano excel', 'gano'], ['con Luis', 'socio'], ['2', 'socio'], ['con mi distribuidor', 'socio'], ['¿cuánto vale el envío?', null], ['gracias', null]] as const) {
  ok(leerFormaDePagoEscrita(t) === esperado, `«${t}» → ${esperado}`)
}

// El enlace al catálogo con el pedido y la hoja de pago abierta
const url = await enlacePagoGano({ nombre: 'Luis Cabrejo', slug: 'luis-cabrejo', constructorId: 'luis-cabrejo-1288' }, '47004')
ok(url === `https://creatuactivo.com/productos/luis-cabrejo?pedido=47004-${await firmaPedido('47004')}&pagar=1`, 'enlace con slug, firma y pagar=1')
const url2 = await enlacePagoGano({ nombre: 'X', constructorId: 'juan-rodriguez-1234' }, '47004')
ok(url2.includes('/productos/juan-rodriguez-1234?'), 'sin slug usa el código')

// Textos en usted y sin promesas
for (const t of [textoPagoGano('Milena'), textoPagoSocio({ nombre: 'Luis Cabrejo' })]) {
  ok(!/\b(tu|tus|te|tienes|puedes)\b/i.test(t), `sin tuteo: ${t.slice(0, 40)}`)
}
ok(textoPagoGano('Milena').startsWith('Milena, perfecto.'), 'texto Gano saluda')
ok(/le escribe (hoy|mañana) por WhatsApp/.test(textoPagoSocio({ nombre: 'Luis Cabrejo' })), 'texto socio dice cuándo')

// El mapa de productos cubre los 22 slugs de los dos catálogos
ok(PRODUCTOS_WA.every((p) => INVENTARIO_GANO[p.slug]), 'todo slug de WhatsApp tiene inventoryId')
const { items, desconocidos } = lineasAItemsGano([{ slug: 'ganocafe-3-en-1', cantidad: 2 }, { id: 'luvoco-suave', cantidad: 1 }, { id: 'ganocafe-3-en-1', cantidad: 1 }, { id: 'no-existe', cantidad: 1 }])
ok(items.length === 2 && items[0].inventoryId === 501 && items[0].quantity === 3 && desconocidos.join() === 'no-existe', 'líneas → ítems, sumando repetidos')
ok(JSON.stringify(leerCarritoDeUrl('ganocafe-3-en-1:2,luvoco-suave,ganocafe-3-en-1')) === JSON.stringify([{ id: 'ganocafe-3-en-1', cantidad: 3 }, { id: 'luvoco-suave', cantidad: 1 }]), '?carrito= con cantidades y forma vieja')
ok(carritoAUrl([{ id: 'a', cantidad: 1 }, { id: 'b', cantidad: 3 }]) === 'a,b:3', 'carrito → url')

// Los departamentos a los que Gano no despacha no se ofrecen (lista de Gano, 17 oct 2026)
ok(DEPARTAMENTOS_CON_ENVIO.length === 27 && !DEPARTAMENTOS_CON_ENVIO.some((d) => SIN_ENVIO_GANO.has(d.code)), '27 departamentos con envío; sin Amazonas, Guainía, Guaviare, San Andrés, Vaupés ni Vichada')

console.log(`✅ forma de pago: ${n} comprobaciones`)
