/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * PAGAR A GANO EXCEL — el cliente del socio paga su pedido directo a la fábrica
 * (17 oct 2026, decisión del Director: dos opciones en igualdad, pagar con el
 * distribuidor o pagar a Gano Excel; esta hoja es la segunda).
 *
 * Dos pasos (la tercera versión del día, con el Director):
 *   1. Sus datos y la dirección → «Ver el total con el envío». El envío lo dice
 *      Gano: es por zona de Servientrega y por cantidad o monto, no se deduce
 *      (13.500 a Medellín y 20.500 a Apartadó, medido el 17 oct 2026). queswa.app
 *      lo consulta con la cuenta del Director —no la del distribuidor, para que no
 *      le quede un carrito en su back office— y lo guarda por destino y pedido: la
 *      segunda vez sale al instante.
 *   2. El total exacto y cómo paga: PSE (su banco; el enlace vale 20 minutos) o
 *      efectivo (consigna con el número de orden). «Pagar» crea la orden en la
 *      cuenta del distribuidor y vuelve a comprobar el flete: si Gano cobrara más
 *      que lo mostrado, no finaliza y pide confirmar el total nuevo.
 *
 * Dos formas de recibir (25 oct 2026, Director: «es clave»): Gano Excel lo despacha
 * a la dirección del cliente, o el cliente lo recoge en una oficina de Gano Excel.
 * La orden es de la cuenta del distribuidor, así que en la oficina solo se la
 * entregan a un tercero autorizado: quien recoge escribe su nombre y su documento
 * (puede ser el cliente o alguien de su confianza). En oficina no hay envío y el
 * total sale sin consultar a Gano. Sin tarjeta. Los datos del formulario se quedan
 * en el aparato.
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import { Truck, Building2, Landmark, Banknote, ChevronLeft, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react'
import type { Socio } from './page'
import { productData, pesos } from './catalogo-datos'
import { DEPARTAMENTOS_CON_ENVIO, OFICINAS_GANO, oficinaGano, direccionOficina } from '@/lib/gano-inventario'

interface Linea { id: string; cantidad: number }
interface Banco { code: string; name: string }
interface Cotizacion { subtotal: number; flete: number; total: number; bancos: Banco[]; fuente: 'gano' | 'guardado'; ciudad?: string }
interface Resultado { orderNumber: string; subtotal: number; total: number; flete: number; pago: 'pse' | 'efectivo'; payUrl?: string | null; convenios: { entidad: string; convenio: string }[] | null }
interface FleteNuevo { orderNumber: string; subtotal: number; flete: number; total: number; mensaje: string }

export interface PagoGanoProps {
  carrito: Linea[]
  socio: Socio
  subtotal: number
  prefill?: { nombre?: string; telefono?: string } | null
  /** «codigo-firma» cuando el pedido lo tomó Queswa por WhatsApp. */
  pedidoClave?: string | null
  alPagar: () => void
  volver: () => void
}

type Paso = 'datos' | 'cotizando' | 'cotizado' | 'pagando' | 'flete' | 'pse' | 'efectivo' | 'fallo'

const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Lo que falta se dice en el campo y en una línea junto al botón (18 oct 2026: el
// botón apagado sin explicación dejaba al cliente tocándolo sin que pasara nada).
type CampoDatos = 'nombre' | 'telefono' | 'departamento' | 'municipio' | 'linea1' | 'oficina' | 'docRecoge'
type CampoPago = 'banco' | 'cedula' | 'correo'
const CAMPOS_ENVIO: CampoDatos[] = ['nombre', 'telefono', 'departamento', 'municipio', 'linea1']
const CAMPOS_OFICINA: CampoDatos[] = ['oficina', 'nombre', 'docRecoge', 'telefono']
const CAMPOS_PAGO: CampoPago[] = ['banco', 'cedula', 'correo']
const AYUDA: Record<CampoDatos | CampoPago, string> = {
  nombre: 'Escriba el nombre y el apellido.',
  telefono: 'Escriba el celular: 10 cifras, empieza por 3.',
  departamento: 'Elija el departamento.',
  municipio: 'Elija el municipio.',
  linea1: 'Escriba la dirección con su número, como en el ejemplo.',
  oficina: 'Elija la oficina donde va a recoger.',
  docRecoge: 'Escriba el número de documento: en la oficina se lo piden.',
  banco: 'Elija su banco.',
  cedula: 'Escriba el número de documento, solo las cifras.',
  correo: 'Revise el correo: ahí le llega el comprobante.',
}
const NOMBRE_CAMPO: Record<CampoDatos | CampoPago, string> = {
  nombre: 'el nombre', telefono: 'el celular', departamento: 'el departamento', municipio: 'el municipio', linea1: 'la dirección',
  oficina: 'la oficina', docRecoge: 'el documento de quien recoge',
  banco: 'el banco', cedula: 'el número de documento', correo: 'el correo',
}
// El pasaporte lleva letras; los demás documentos, solo cifras (igual que valida queswa.app).
const limpiarDoc = (tipo: string, valor: string) => valor.toUpperCase().replace(tipo === 'PP' ? /[^A-Z0-9]/g : /\D/g, '')
const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
function enLista(xs: string[]): string {
  if (xs.length <= 1) return xs[0] ?? ''
  return `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`
}
// Los bancos más usados primero; el resto en orden alfabético (la lista viene de PayU).
const BANCOS_PRIMERO = ['1007', '1507', '1051', '1551', '1001', '1023', '1013', '1809']
// Lista fija mientras no haya respuesta de Gano: la misma que tiene queswa.app.
const BANCOS_FIJOS: Banco[] = [
  { code: '1007', name: 'Bancolombia' }, { code: '1507', name: 'Nequi' }, { code: '1051', name: 'Davivienda' }, { code: '1551', name: 'Daviplata' },
  { code: '1001', name: 'Banco de Bogotá' }, { code: '1023', name: 'Banco de Occidente' }, { code: '1013', name: 'BBVA Colombia' }, { code: '1809', name: 'NU' },
  { code: '1002', name: 'Banco Popular' }, { code: '1052', name: 'Banco AV Villas' }, { code: '1032', name: 'Banco Caja Social' }, { code: '1040', name: 'Banco Agrario' },
  { code: '1012', name: 'GNB Sudameris' }, { code: '1006', name: 'Banco Itaú' }, { code: '1009', name: 'Citibank' }, { code: '1062', name: 'Banco Falabella' },
  { code: '1060', name: 'Banco Pichincha' }, { code: '1065', name: 'Banco Santander' }, { code: '1069', name: 'Banco Serfinanza' }, { code: '1303', name: 'Banco Unión' },
  { code: '1059', name: 'Bancamía' }, { code: '1047', name: 'Banco Mundo Mujer' }, { code: '1066', name: 'Coopcentral' }, { code: '1061', name: 'Bancoomeva' },
  { code: '1070', name: 'Lulo Bank' }, { code: '1811', name: 'RappiPay' }, { code: '1804', name: 'Ualá' }, { code: '1801', name: 'Movii' }, { code: '1019', name: 'DAVIbank' }, { code: '1063', name: 'Banco Finandina' },
]
// Los datos del formulario se quedan en el aparato (Director, 17 oct 2026: salió a
// mirar algo, volvió y el formulario estaba vacío). Solo en este navegador, como el
// carrito; se borran al pagar.
const CLAVE_DATOS = 'pago_gano_datos'
interface DatosGuardados { nombre?: string; telefono?: string; recibe?: 'envio' | 'oficina'; oficina?: number; tipoDocRecoge?: string; docRecoge?: string; departamento?: string; municipio?: string; linea1?: string; linea2?: string; tipoDoc?: string; cedula?: string; correo?: string; banco?: string; pago?: 'pse' | 'efectivo' }
function leerDatos(): DatosGuardados {
  try { const d = JSON.parse(localStorage.getItem(CLAVE_DATOS) || '{}'); return d && typeof d === 'object' ? d : {} } catch { return {} }
}
function huella(): string | null {
  try { return (window as unknown as { FrameworkIAA?: { fingerprint?: string } }).FrameworkIAA?.fingerprint || localStorage.getItem('nexus_fingerprint') } catch { return null }
}

export default function PagoGano({ carrito, socio, subtotal, prefill, pedidoClave, alPagar, volver }: PagoGanoProps) {
  const [guardado] = useState<DatosGuardados>(() => (typeof window === 'undefined' ? {} : leerDatos()))
  const [paso, setPaso] = useState<Paso>('datos')
  const [nombre, setNombre] = useState(prefill?.nombre ?? guardado.nombre ?? '')
  const [telefono, setTelefono] = useState(prefill?.telefono ?? guardado.telefono ?? '')
  const [recibe, setRecibe] = useState<'envio' | 'oficina'>(guardado.recibe === 'oficina' ? 'oficina' : 'envio')
  const [oficina, setOficina] = useState<number | null>(oficinaGano(guardado.oficina)?.id ?? null)
  const [tipoDocRecoge, setTipoDocRecoge] = useState(guardado.tipoDocRecoge ?? 'CC')
  const [docRecoge, setDocRecoge] = useState(guardado.docRecoge ?? '')
  // Un departamento guardado que ya no tiene envío (o de una versión vieja) no se restaura: el selector mostraría «Elija» con otro valor por dentro.
  const [departamento, setDepartamento] = useState(DEPARTAMENTOS_CON_ENVIO.some((d) => d.code === guardado.departamento) ? guardado.departamento ?? '' : '')
  const [municipio, setMunicipio] = useState(guardado.municipio ?? '')
  // Los municipios de cada departamento, como los ofrece el checkout de Gano (25 oct
  // 2026, Director: elegirlos de la lista, como en el back office). Se cargan aparte
  // al abrir la hoja (17 KB) para que el catálogo no los pague. Si no cargan, el
  // campo vuelve a ser de escribir y queswa.app lo valida contra Gano, como antes.
  const [listas, setListas] = useState<typeof import('@/lib/gano-municipios') | null>(null)
  const [sinLista, setSinLista] = useState(false)
  const [linea1, setLinea1] = useState(guardado.linea1 ?? '')
  const [linea2, setLinea2] = useState(guardado.linea2 ?? '')
  const [candidatos, setCandidatos] = useState<string[]>([])
  const [pago, setPago] = useState<'pse' | 'efectivo'>(guardado.pago === 'efectivo' ? 'efectivo' : 'pse')
  const [banco, setBanco] = useState(guardado.banco ?? '')
  const [tipoDoc, setTipoDoc] = useState(guardado.tipoDoc ?? 'CC')
  const [cedula, setCedula] = useState(guardado.cedula ?? '')
  const [correo, setCorreo] = useState(guardado.correo ?? '')
  const [bancos, setBancos] = useState<Banco[]>(BANCOS_FIJOS)
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [fleteNuevo, setFleteNuevo] = useState<FleteNuevo | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  // Al tocar el botón con datos incompletos se marcan los campos que faltan (antes el botón quedaba apagado sin decir por qué).
  const [revisarDatos, setRevisarDatos] = useState(false)
  const [revisarPago, setRevisarPago] = useState(false)

  useEffect(() => { if (prefill?.nombre && !nombre) setNombre(prefill.nombre); if (prefill?.telefono && !telefono) setTelefono(prefill.telefono) }, [prefill, nombre, telefono])
  // Cada cambio queda en el aparato; al pagar se borra.
  useEffect(() => {
    try { localStorage.setItem(CLAVE_DATOS, JSON.stringify({ nombre, telefono, recibe, oficina, tipoDocRecoge, docRecoge, departamento, municipio, linea1, linea2, tipoDoc, cedula, correo, banco, pago })) } catch { /* sin almacenamiento */ }
  }, [nombre, telefono, recibe, oficina, tipoDocRecoge, docRecoge, departamento, municipio, linea1, linea2, tipoDoc, cedula, correo, banco, pago])
  useEffect(() => {
    let vivo = true
    import('@/lib/gano-municipios').then((m) => { if (vivo) setListas(m) }).catch(() => { if (vivo) setSinLista(true) })
    return () => { vivo = false }
  }, [])
  const opcionesMunicipio = listas && departamento ? listas.MUNICIPIOS_GANO[departamento] ?? [] : []
  const etiqueta = (m: string) => (listas ? listas.etiquetaMunicipio(m) : m)
  // Un municipio guardado que no es el nombre exacto de Gano (escrito a mano en la
  // versión anterior) se cambia por el de la lista, o se borra; si el departamento
  // tiene uno solo (Bogotá), queda puesto.
  useEffect(() => {
    if (!listas || !departamento) return
    const lista = listas.MUNICIPIOS_GANO[departamento] ?? []
    if (lista.length === 1) { if (municipio !== lista[0]) setMunicipio(lista[0]); return }
    if (!municipio || lista.includes(municipio)) return
    const q = sinTildes(municipio)
    setMunicipio(lista.find((m) => sinTildes(m) === q || sinTildes(listas.etiquetaMunicipio(m)) === q) ?? '')
  }, [listas, departamento, municipio])

  const ref = socio.slug ?? socio.constructorId ?? ''
  const primerNombre = socio.primerNombre
  const tel10 = telefono.replace(/\D/g, '').replace(/^57(?=\d{10}$)/, '')
  const lineas = carrito.filter((l) => productData[l.id])
  // El flete que ve el cliente es el que dijo Gano al cotizar; al pagar se vuelve a comprobar.
  const flete = fleteNuevo?.flete ?? cotizacion?.flete ?? 0
  const total = subtotal + flete

  const enOficina = recibe === 'oficina'
  const sede = oficinaGano(oficina)
  const docRecogeLimpio = limpiarDoc(tipoDocRecoge, docRecoge)
  const faltaDatos: Record<CampoDatos, boolean> = {
    nombre: nombre.trim().length < 3,
    telefono: !/^3\d{9}$/.test(tel10),
    departamento: !departamento,
    municipio: sinLista ? municipio.trim().length < 2 : !opcionesMunicipio.includes(municipio),
    linea1: linea1.trim().length < 5,
    oficina: !sede,
    docRecoge: !/^[A-Z0-9]{5,15}$/.test(docRecogeLimpio),
  }
  const camposDatos = enOficina ? CAMPOS_OFICINA : CAMPOS_ENVIO
  const datosListos = !camposDatos.some((c) => faltaDatos[c])
  const faltaPago: Record<CampoPago, boolean> = {
    banco: pago === 'pse' && !banco,
    cedula: pago === 'pse' && !/^\d{5,12}$/.test(cedula.replace(/\D/g, '')),
    correo: pago === 'pse' && !RE_CORREO.test(correo.trim()),
  }
  const pagoListo = !CAMPOS_PAGO.some((c) => faltaPago[c])
  const marcaDatos = (c: CampoDatos) => revisarDatos && faltaDatos[c]
  const marcaPago = (c: CampoPago) => revisarPago && faltaPago[c]

  const bancosOrdenados = useMemo(() => {
    const primero = BANCOS_PRIMERO.map((c) => bancos.find((b) => b.code === c)).filter(Boolean) as Banco[]
    const resto = bancos.filter((b) => !BANCOS_PRIMERO.includes(b.code)).sort((a, b) => a.name.localeCompare(b.name, 'es'))
    return [...primero, ...resto]
  }, [bancos])

  async function llamar(accion: 'cotizar' | 'pagar', fleteMostrado?: number): Promise<{ status: number; json: Record<string, unknown> }> {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 125_000)
    try {
      const r = await fetch('/api/pedido-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref, accion,
          ...(pedidoClave ? { pedido: pedidoClave } : { carrito }),
          cliente: { nombre: nombre.trim(), telefono: tel10, tipoDoc, cedula: cedula.replace(/\D/g, ''), email: correo.trim() },
          ...(enOficina
            ? { reclamacion: 'oficina', oficina: sede?.id, tercero: { nombre: nombre.trim(), tipoDoc: tipoDocRecoge, numeroDoc: docRecogeLimpio } }
            : { reclamacion: 'envio', direccion: { departamento, municipio: municipio.trim(), linea1: linea1.trim(), linea2: linea2.trim() } }),
          ...(accion === 'pagar' ? { pago, banco: pago === 'pse' ? banco : undefined, fleteMostrado } : {}),
          fingerprint: huella(),
        }),
        signal: ctl.signal,
      })
      return { status: r.status, json: (await r.json().catch(() => ({}))) as Record<string, unknown> }
    } catch (e) {
      const abort = e instanceof DOMException && e.name === 'AbortError'
      return { status: 0, json: { error: abort ? 'Gano Excel tardó demasiado en responder. Vuelva a intentar en un momento.' : 'No hay conexión. Revise su internet y vuelva a intentar.' } }
    } finally { clearTimeout(t) }
  }

  function intentarCotizar() {
    if (!datosListos) {
      setRevisarDatos(true)
      const primero = camposDatos.find((c) => faltaDatos[c])
      if (primero) document.getElementById(`pg-${primero}`)?.focus()
      return
    }
    setRevisarDatos(false)
    void cotizar()
  }

  function intentarPagar(fleteMostrado: number) {
    if (!pagoListo) {
      setRevisarPago(true)
      const primero = CAMPOS_PAGO.find((c) => faltaPago[c])
      if (primero) document.getElementById(`pg-${primero}`)?.focus()
      return
    }
    setRevisarPago(false)
    void pagar(fleteMostrado)
  }

  async function cotizar() {
    setError(null); setCandidatos([]); setPaso('cotizando')
    const { status, json } = await llamar('cotizar')
    if (status === 200 && json.success) {
      const b = Array.isArray(json.bancos) && (json.bancos as Banco[]).length >= 5 ? (json.bancos as Banco[]) : BANCOS_FIJOS
      setBancos(b)
      setCotizacion({ subtotal: Number(json.subtotal), flete: Number(json.flete), total: Number(json.total), bancos: b, fuente: json.fuente === 'guardado' ? 'guardado' : 'gano', ciudad: (json.envio as { ciudad?: string } | null)?.ciudad })
      // Lo más común es que pague quien recoge: su documento ya está escrito.
      if (enOficina && !cedula) { setCedula(docRecogeLimpio); setTipoDoc(tipoDocRecoge) }
      setPaso('cotizado')
      return
    }
    setPaso('datos')
    setError(String(json.error || 'No se pudo consultar el envío con Gano Excel. Vuelva a intentar.'))
    if (Array.isArray(json.candidatos)) setCandidatos(json.candidatos as string[])
  }

  async function pagar(fleteMostrado: number) {
    setError(null); setCandidatos([]); setPaso('pagando')
    const { status, json } = await llamar('pagar', fleteMostrado)

    if (status === 200 && json.success) {
      const r: Resultado = { orderNumber: String(json.orderNumber), subtotal: Number(json.subtotal), total: Number(json.total), flete: Number(json.flete), pago: json.pago === 'pse' ? 'pse' : 'efectivo', payUrl: typeof json.payUrl === 'string' ? json.payUrl : null, convenios: (json.convenios as Resultado['convenios']) ?? null }
      setResultado(r)
      try { localStorage.removeItem(CLAVE_DATOS) } catch { /* nada */ }
      alPagar()
      setPaso(r.pago === 'pse' && r.payUrl ? 'pse' : 'efectivo')
      return
    }
    if (json.motivo === 'flete_distinto' && json.orderNumber) {
      // Gano cobra hoy otro envío: no se finalizó nada; se confirma el total nuevo.
      setFleteNuevo({ orderNumber: String(json.orderNumber), subtotal: Number(json.subtotal), flete: Number(json.flete), total: Number(json.total), mensaje: String(json.error || '') })
      if (Array.isArray(json.bancos) && (json.bancos as Banco[]).length >= 5) setBancos(json.bancos as Banco[])
      setPaso('flete')
      return
    }
    if (json.motivo === 'pse_sin_enlace' && json.orderNumber) {
      // La orden pudo quedar creada: se dice, con los convenios si los hay.
      setResultado({ orderNumber: String(json.orderNumber), subtotal: Number(json.subtotal), total: Number(json.total), flete: Number(json.flete), pago: 'efectivo', convenios: (json.convenios as Resultado['convenios']) ?? null })
      setAviso(String(json.error))
      if (json.convenios) { alPagar(); setPaso('efectivo') } else setPaso('fallo')
      return
    }
    if (Array.isArray(json.candidatos) && (json.candidatos as string[]).length) { setPaso('datos'); setCandidatos(json.candidatos as string[]) } else setPaso('cotizado')
    setError(String(json.error || 'No se pudo generar el pago. Vuelva a intentar.'))
  }

  // ── Resultado: camino al banco ──────────────────────────────────────────
  if (paso === 'pse' && resultado) {
    return (
      <div className="tienda-hoja-cuerpo tienda-pago">
        <div className="tienda-pago-listo">
          <CheckCircle2 className="h-7 w-7" />
          <div>
            <p className="tienda-pago-titulo">Su orden N.º {resultado.orderNumber} quedó creada en Gano Excel</p>
            <p>Total: <strong>{pesos(resultado.total)}</strong>{resultado.flete ? ` (incluye ${pesos(resultado.flete)} de envío)` : ''}.</p>
          </div>
        </div>
        <a className="tienda-boton tienda-enviar" href={resultado.payUrl ?? '#'}>
          <Landmark className="h-5 w-5" /> Ir a mi banco y pagar <ExternalLink className="h-4 w-4" />
        </a>
        {enOficina && sede
          ? <p className="tienda-pago-parrafo">Tiene 20 minutos para terminar el pago. Cuando el banco lo apruebe, el pedido queda para recoger en la oficina de Gano Excel de <strong>{sede.nombre}</strong>, {direccionOficina(sede)}. <strong>{nombre.trim()}</strong> lo recoge con su documento de identidad.</p>
          : <p className="tienda-pago-parrafo">Tiene 20 minutos para terminar el pago. Cuando el banco lo apruebe, Gano Excel despacha a su dirección, normalmente de un día para otro.</p>}
        <p className="tienda-pago-nota">Si el banco no abrió o se pasó el tiempo, vuelva a esta página y genere el pago de nuevo.</p>
      </div>
    )
  }

  // ── Resultado: efectivo ─────────────────────────────────────────────────
  if (paso === 'efectivo' && resultado) {
    return (
      <div className="tienda-hoja-cuerpo tienda-pago">
        {aviso && <p className="tienda-pago-aviso"><AlertTriangle className="h-4 w-4" /> {aviso}</p>}
        <div className="tienda-pago-listo">
          <CheckCircle2 className="h-7 w-7" />
          <div>
            <p className="tienda-pago-titulo">Su orden N.º {resultado.orderNumber} quedó registrada en Gano Excel</p>
            <p>Total a consignar: <strong>{pesos(resultado.total)}</strong>{resultado.flete ? ` (incluye ${pesos(resultado.flete)} de envío)` : ''}.</p>
          </div>
        </div>
        <p className="tienda-pago-parrafo">Consigne en cualquiera de estos convenios, con el <strong>número de orden {resultado.orderNumber}</strong> como referencia:</p>
        <ul className="tienda-pago-convenios">
          {(resultado.convenios ?? []).map((c) => <li key={c.entidad}><span>{c.entidad}</span><strong>{c.convenio}</strong></li>)}
        </ul>
        {enOficina && sede
          ? <p className="tienda-pago-parrafo">Cuando Gano Excel registre el pago, el pedido queda para recoger en la oficina de Gano Excel de <strong>{sede.nombre}</strong>, {direccionOficina(sede)}. <strong>{nombre.trim()}</strong> lo recoge con su documento de identidad. Consigne hoy o mañana: la orden queda esperando su pago.</p>
          : <p className="tienda-pago-parrafo">Gano Excel despacha a su dirección cuando registra el pago, normalmente de un día para otro. Consigne hoy o mañana: la orden queda esperando su pago.</p>}
        <p className="tienda-pago-nota">{primerNombre} recibió el aviso de su pedido. Guarde una foto de esta pantalla.</p>
      </div>
    )
  }

  if (paso === 'fallo') {
    return (
      <div className="tienda-hoja-cuerpo tienda-pago">
        <p className="tienda-pago-aviso"><AlertTriangle className="h-4 w-4" /> {aviso || error}</p>
        <button type="button" className="tienda-boton-sec" onClick={() => { setPaso(cotizacion ? 'cotizado' : 'datos'); setAviso(null) }}>Volver a intentar</button>
      </div>
    )
  }

  // ── Gano cobra otro envío: confirmar el total nuevo ─────────────────────
  if (paso === 'flete' && fleteNuevo) {
    return (
      <>
        <div className="tienda-hoja-cuerpo tienda-pago">
          <p className="tienda-pago-aviso"><AlertTriangle className="h-4 w-4" /> {fleteNuevo.mensaje}</p>
          <div className="tienda-pedido-suma tienda-pago-suma">
            {lineas.map((l) => <div key={l.id}><span>{l.cantidad} × {productData[l.id].name}</span><span>{pesos(productData[l.id].price * l.cantidad)}</span></div>)}
            <div><span>Envío a {etiqueta(municipio.trim())}, según Gano Excel</span><span>{pesos(fleteNuevo.flete)}</span></div>
            <div className="total"><span>Total</span><span>{pesos(fleteNuevo.total)}</span></div>
          </div>
          <p className="tienda-pago-parrafo">Todavía no se ha cobrado nada. Si está de acuerdo, siga con el pago; si no, vuelva y cambie el pedido.</p>
        </div>
        <div className="tienda-hoja-pie">
          <button type="button" className="tienda-boton tienda-enviar" onClick={() => pagar(fleteNuevo.flete)}>
            {pago === 'pse' ? `Pagar ${pesos(fleteNuevo.total)} por PSE` : `Generar la orden por ${pesos(fleteNuevo.total)}`}
          </button>
          <button type="button" className="tienda-enlace" onClick={() => { setFleteNuevo(null); setPaso('cotizado') }}>Volver</button>
        </div>
      </>
    )
  }

  // ── Paso 2: el total exacto y cómo paga ────────────────────────────────
  if ((paso === 'cotizado' || paso === 'pagando') && cotizacion) {
    const pagando = paso === 'pagando'
    return (
      <>
        <div className="tienda-hoja-cuerpo tienda-pago">
          <button type="button" className="tienda-enlace tienda-pago-volver" onClick={() => setPaso('datos')} disabled={pagando}><ChevronLeft className="h-4 w-4" /> {enOficina ? 'Cambiar la oficina' : 'Cambiar la dirección'}</button>
          <div className="tienda-pedido-suma tienda-pago-suma">
            {lineas.map((l) => <div key={l.id}><span>{l.cantidad} × {productData[l.id].name}</span><span>{pesos(productData[l.id].price * l.cantidad)}</span></div>)}
            {enOficina
              ? <div><span>Recoge en la oficina de {sede?.nombre}</span><span>Sin envío</span></div>
              : <div><span>Envío a {etiqueta(municipio.trim())}, por Gano Excel</span><span>{pesos(cotizacion.flete)}</span></div>}
            <div className="total"><span>Total</span><span>{pesos(total)}</span></div>
          </div>
          {enOficina && sede
            ? <p className="tienda-pago-parrafo">Lo recoge <strong>{nombre.trim()}</strong> ({tipoDocRecoge} {docRecogeLimpio}) en la oficina de Gano Excel de {sede.nombre}: {direccionOficina(sede)}.</p>
            : <p className="tienda-pago-parrafo">Llega a nombre de <strong>{nombre.trim()}</strong>, {linea1.trim()}{linea2.trim() ? `, ${linea2.trim()}` : ''}, {etiqueta(municipio.trim())}.</p>}

          <p className="tienda-pago-rotulo">¿Cómo paga?</p>
          <div className="tienda-pago-opciones" role="radiogroup" aria-label="Forma de pago">
            <label className={`tienda-pago-opcion${pago === 'pse' ? ' activa' : ''}`}>
              <input type="radio" name="pago" value="pse" checked={pago === 'pse'} onChange={() => setPago('pse')} disabled={pagando} />
              <Landmark className="h-5 w-5" />
              <span><strong>PSE, desde su banco</strong><small>Paga ahora en línea. El enlace vale 20 minutos.</small></span>
            </label>
            <label className={`tienda-pago-opcion${pago === 'efectivo' ? ' activa' : ''}`}>
              <input type="radio" name="pago" value="efectivo" checked={pago === 'efectivo'} onChange={() => setPago('efectivo')} disabled={pagando} />
              <Banknote className="h-5 w-5" />
              <span><strong>Efectivo</strong><small>Consigna en Efecty, Davivienda o Banco de Occidente con el número de orden.</small></span>
            </label>
          </div>
          {pago === 'pse' && (
            <div className="tienda-pago-campos">
              <label className="tienda-campo">
                <span>Su banco</span>
                <select id="pg-banco" value={banco} onChange={(e) => setBanco(e.target.value)} disabled={pagando} autoComplete="off" aria-invalid={marcaPago('banco') || undefined} aria-describedby={marcaPago('banco') ? 'pg-banco-falta' : undefined}>
                  <option value="">Elija su banco</option>
                  {bancosOrdenados.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
                </select>
                {marcaPago('banco') && <small id="pg-banco-falta" className="tienda-campo-falta">{AYUDA.banco}</small>}
              </label>
              <div className="tienda-campo-fila">
                <label className="tienda-campo tienda-campo-corto">
                  <span>Documento</span>
                  <select value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)} disabled={pagando}>
                    <option value="CC">CC</option><option value="CE">CE</option><option value="NIT">NIT</option><option value="PP">PP</option>
                  </select>
                </label>
                <label className="tienda-campo">
                  <span>Número de documento</span>
                  <input id="pg-cedula" type="text" inputMode="numeric" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="El del titular de la cuenta" disabled={pagando} autoComplete="off" aria-invalid={marcaPago('cedula') || undefined} aria-describedby={marcaPago('cedula') ? 'pg-cedula-falta' : undefined} />
                  {marcaPago('cedula') && <small id="pg-cedula-falta" className="tienda-campo-falta">{AYUDA.cedula}</small>}
                </label>
              </div>
              <label className="tienda-campo">
                <span>Correo</span>
                <input id="pg-correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Ahí le llega el comprobante del pago" disabled={pagando} autoComplete="email" aria-invalid={marcaPago('correo') || undefined} aria-describedby={marcaPago('correo') ? 'pg-correo-falta' : undefined} />
                {marcaPago('correo') && <small id="pg-correo-falta" className="tienda-campo-falta">{AYUDA.correo}</small>}
              </label>
            </div>
          )}
          {error && <p className="tienda-pago-aviso"><AlertTriangle className="h-4 w-4" /> {error}</p>}
        </div>
        <div className="tienda-hoja-pie">
          <button type="button" className="tienda-boton tienda-enviar" onClick={() => intentarPagar(cotizacion.flete)} disabled={pagando}>
            {pagando ? 'Creando su orden en Gano Excel…' : pago === 'pse' ? `Pagar ${pesos(total)} por PSE` : `Generar la orden por ${pesos(total)}`}
          </button>
          {revisarPago && !pagoListo
            ? <p className="tienda-hoja-pie-nota falta" role="alert">Para seguir falta {enLista(CAMPOS_PAGO.filter((c) => faltaPago[c]).map((c) => NOMBRE_CAMPO[c]))}.</p>
            : <p className="tienda-hoja-pie-nota">{pagando ? 'Unos 15 segundos.' : pago === 'pse' ? 'Lo lleva a la página de su banco.' : 'Después consigna con el número de orden.'}</p>}
        </div>
      </>
    )
  }

  // ── Paso 1: sus datos y la dirección ───────────────────────────────────
  const cotizando = paso === 'cotizando'
  return (
    <>
      <div className="tienda-hoja-cuerpo tienda-pago">
        <button type="button" className="tienda-enlace tienda-pago-volver" onClick={volver} disabled={cotizando}><ChevronLeft className="h-4 w-4" /> Volver al pedido</button>
        <p className="tienda-pago-rotulo">¿Cómo lo recibe?</p>
        <div className="tienda-pago-opciones" role="radiogroup" aria-label="Cómo recibe el pedido">
          <label className={`tienda-pago-opcion${!enOficina ? ' activa' : ''}`}>
            <input type="radio" name="recibe" value="envio" checked={!enOficina} onChange={() => { setRecibe('envio'); setError(null) }} disabled={cotizando} />
            <Truck className="h-5 w-5" />
            <span><strong>Envío a su dirección</strong><small>Gano Excel lo despacha por Servientrega. El envío depende de la ciudad.</small></span>
          </label>
          <label className={`tienda-pago-opcion${enOficina ? ' activa' : ''}`}>
            <input type="radio" name="recibe" value="oficina" checked={enOficina} onChange={() => { setRecibe('oficina'); setError(null); setCandidatos([]) }} disabled={cotizando} />
            <Building2 className="h-5 w-5" />
            <span><strong>Recoger en una oficina de Gano Excel</strong><small>Sin costo de envío. Lo recoge usted o alguien de su confianza.</small></span>
          </label>
        </div>
        {enOficina ? (
          <div className="tienda-pedido-sigue">
            <Building2 className="h-5 w-5" />
            <p>El pedido se crea en Gano Excel con el código de {primerNombre}. En la oficina se lo entregan a la persona que usted escriba aquí, con su documento: <strong>puede ser usted o alguien de su confianza</strong>.</p>
          </div>
        ) : (
          <div className="tienda-pedido-sigue">
            <Truck className="h-5 w-5" />
            <p>El pedido se crea en Gano Excel con el código de {primerNombre}, a nombre suyo, y <strong>Gano Excel lo despacha a su dirección</strong> por Servientrega. El envío depende de la ciudad: lo consultamos con Gano antes de que pague.</p>
          </div>
        )}
        {enOficina ? (
        <div className="tienda-pago-campos">
          <label className="tienda-campo">
            <span>Oficina de Gano Excel</span>
            <select id="pg-oficina" value={sede?.id ?? ''} onChange={(e) => setOficina(e.target.value ? Number(e.target.value) : null)} disabled={cotizando} aria-invalid={marcaDatos('oficina') || undefined} aria-describedby={marcaDatos('oficina') ? 'pg-oficina-falta' : undefined}>
              <option value="">Elija la oficina</option>
              {OFICINAS_GANO.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}
            </select>
            {sede && <small className="tienda-campo-nota">{direccionOficina(sede)}</small>}
            {marcaDatos('oficina') && <small id="pg-oficina-falta" className="tienda-campo-falta">{AYUDA.oficina}</small>}
          </label>
          <label className="tienda-campo">
            <span>Nombre completo de quien recoge</span>
            <input id="pg-nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" disabled={cotizando} aria-invalid={marcaDatos('nombre') || undefined} aria-describedby={marcaDatos('nombre') ? 'pg-nombre-falta' : undefined} />
            {marcaDatos('nombre') && <small id="pg-nombre-falta" className="tienda-campo-falta">{AYUDA.nombre}</small>}
          </label>
          <div className="tienda-campo-fila">
            <label className="tienda-campo tienda-campo-corto">
              <span>Documento</span>
              <select value={tipoDocRecoge} onChange={(e) => setTipoDocRecoge(e.target.value)} disabled={cotizando}>
                <option value="CC">CC</option><option value="CE">CE</option><option value="PP">PP</option>
              </select>
            </label>
            <label className="tienda-campo">
              <span>Número de documento</span>
              <input id="pg-docRecoge" type="text" inputMode={tipoDocRecoge === 'PP' ? 'text' : 'numeric'} value={docRecoge} onChange={(e) => setDocRecoge(e.target.value)} placeholder="Se lo piden en la oficina" autoComplete="off" disabled={cotizando} aria-invalid={marcaDatos('docRecoge') || undefined} aria-describedby={marcaDatos('docRecoge') ? 'pg-docRecoge-falta' : undefined} />
              {marcaDatos('docRecoge') && <small id="pg-docRecoge-falta" className="tienda-campo-falta">{AYUDA.docRecoge}</small>}
            </label>
          </div>
          <label className="tienda-campo">
            <span>Celular</span>
            <input id="pg-telefono" type="tel" inputMode="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="300 123 4567" autoComplete="tel" disabled={cotizando} aria-invalid={marcaDatos('telefono') || undefined} aria-describedby={marcaDatos('telefono') ? 'pg-telefono-falta' : undefined} />
            {marcaDatos('telefono') && <small id="pg-telefono-falta" className="tienda-campo-falta">{AYUDA.telefono}</small>}
          </label>
        </div>
        ) : (
        <div className="tienda-pago-campos">
          <label className="tienda-campo">
            <span>Nombre completo de quien recibe</span>
            <input id="pg-nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" disabled={cotizando} aria-invalid={marcaDatos('nombre') || undefined} aria-describedby={marcaDatos('nombre') ? 'pg-nombre-falta' : undefined} />
            {marcaDatos('nombre') && <small id="pg-nombre-falta" className="tienda-campo-falta">{AYUDA.nombre}</small>}
          </label>
          <label className="tienda-campo">
            <span>Celular</span>
            <input id="pg-telefono" type="tel" inputMode="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="300 123 4567" autoComplete="tel" disabled={cotizando} aria-invalid={marcaDatos('telefono') || undefined} aria-describedby={marcaDatos('telefono') ? 'pg-telefono-falta' : undefined} />
            {marcaDatos('telefono') && <small id="pg-telefono-falta" className="tienda-campo-falta">{AYUDA.telefono}</small>}
          </label>
          <label className="tienda-campo">
            <span>Departamento</span>
            <select id="pg-departamento" value={departamento} onChange={(e) => { setDepartamento(e.target.value); setMunicipio(''); setCandidatos([]) }} disabled={cotizando} aria-invalid={marcaDatos('departamento') || undefined} aria-describedby={marcaDatos('departamento') ? 'pg-departamento-falta' : undefined}>
              <option value="">Elija el departamento</option>
              {DEPARTAMENTOS_CON_ENVIO.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
            </select>
            {marcaDatos('departamento') && <small id="pg-departamento-falta" className="tienda-campo-falta">{AYUDA.departamento}</small>}
          </label>
          <label className="tienda-campo">
            <span>Municipio</span>
            {sinLista ? (
              <input id="pg-municipio" type="text" value={municipio} onChange={(e) => { setMunicipio(e.target.value); setCandidatos([]) }} autoComplete="address-level2" disabled={cotizando} aria-invalid={marcaDatos('municipio') || undefined} aria-describedby={marcaDatos('municipio') ? 'pg-municipio-falta' : undefined} />
            ) : (
              <select id="pg-municipio" value={opcionesMunicipio.includes(municipio) ? municipio : ''} onChange={(e) => { setMunicipio(e.target.value); setCandidatos([]) }} disabled={cotizando || !departamento || !listas} aria-invalid={marcaDatos('municipio') || undefined} aria-describedby={marcaDatos('municipio') ? 'pg-municipio-falta' : undefined}>
                <option value="">{!departamento ? 'Primero elija el departamento' : !listas ? 'Cargando los municipios…' : 'Elija el municipio'}</option>
                {opcionesMunicipio.map((m) => <option key={m} value={m}>{etiqueta(m)}</option>)}
              </select>
            )}
            {marcaDatos('municipio') && <small id="pg-municipio-falta" className="tienda-campo-falta">{sinLista ? 'Escriba el municipio.' : AYUDA.municipio}</small>}
          </label>
          {candidatos.length > 0 && (
            <div className="tienda-pago-candidatos">
              <span>¿Es alguno de estos?</span>
              {candidatos.map((c) => <button key={c} type="button" className="tienda-chip" onClick={() => { setMunicipio(c); setCandidatos([]); setError(null) }}>{etiqueta(c)}</button>)}
            </div>
          )}
          <label className="tienda-campo">
            <span>Dirección</span>
            <input id="pg-linea1" type="text" value={linea1} onChange={(e) => setLinea1(e.target.value)} placeholder="Calle 10 # 20-30" autoComplete="street-address" disabled={cotizando} aria-invalid={marcaDatos('linea1') || undefined} aria-describedby={marcaDatos('linea1') ? 'pg-linea1-falta' : undefined} />
            {marcaDatos('linea1') && <small id="pg-linea1-falta" className="tienda-campo-falta">{AYUDA.linea1}</small>}
          </label>
          <label className="tienda-campo">
            <span>Barrio, apartamento o referencia <em>(opcional)</em></span>
            <input type="text" value={linea2} onChange={(e) => setLinea2(e.target.value)} disabled={cotizando} />
          </label>
        </div>
        )}
        {error && <p className="tienda-pago-aviso"><AlertTriangle className="h-4 w-4" /> {error}</p>}
      </div>
      <div className="tienda-hoja-pie">
        <button type="button" className="tienda-boton tienda-enviar" onClick={intentarCotizar} disabled={cotizando}>
          {enOficina
            ? (cotizando ? 'Preparando su pedido…' : 'Ver el total')
            : (cotizando ? 'Consultando el envío con Gano Excel…' : 'Ver el total con el envío')}
        </button>
        {revisarDatos && !datosListos
          ? <p className="tienda-hoja-pie-nota falta" role="alert">Para seguir falta {enLista(camposDatos.filter((c) => faltaDatos[c]).map((c) => NOMBRE_CAMPO[c]))}.</p>
          : <p className="tienda-hoja-pie-nota">{cotizando ? (enOficina ? 'Un momento.' : 'Hasta 15 segundos.') : enOficina ? `Productos: ${pesos(subtotal)} · sin costo de envío. Todavía no paga nada.` : `Productos: ${pesos(subtotal)} · el envío lo dice Gano Excel. Todavía no paga nada.`}</p>}
      </div>
    </>
  )
}

export const ESTILOS_PAGO = `
.tienda-pago { display: grid; gap: 14px; align-content: start; }
.tienda-pago-volver { padding: 0; align-self: start; }
.tienda-pago-volver:disabled { opacity: .5; }
.tienda-pago-campos { display: grid; gap: 12px; }
.tienda-campo { display: grid; gap: 6px; font-size: 14px; color: var(--t-tinta-2); }
.tienda-campo span { font-weight: 600; color: var(--t-tinta); }
.tienda-campo em { font-style: normal; font-weight: 400; color: var(--t-tinta-3); }
.tienda-campo input, .tienda-campo select { font: inherit; font-size: 16px; color: var(--t-tinta); background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: 10px; min-height: 46px; padding: 0 12px; width: 100%; }
.tienda-campo input:focus, .tienda-campo select:focus { outline: 2px solid var(--t-oro); outline-offset: 1px; border-color: var(--t-oro); }
.tienda-campo input:disabled, .tienda-campo select:disabled { opacity: .6; }
.tienda-campo input[aria-invalid="true"], .tienda-campo select[aria-invalid="true"] { border-color: #B4472D; }
.tienda-campo-falta { font-size: 13px; font-weight: 500; line-height: 1.35; color: #A3361F; }
.tienda-campo-nota { font-size: 13px; line-height: 1.4; color: var(--t-tinta-3); }
.tienda-hoja-pie-nota.falta { color: #A3361F; font-weight: 500; }
.tienda-campo-fila { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tienda-campo-fila .tienda-campo-corto { max-width: 110px; }
.tienda-pago-candidatos { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 14px; color: var(--t-tinta-2); }
.tienda-pago-candidatos .tienda-chip { cursor: pointer; }
.tienda-pago-aviso { display: flex; gap: 8px; align-items: flex-start; margin: 0; font-size: 14px; line-height: 1.45; background: #FFF6E0; border: 1px solid #EAD7A8; border-radius: 10px; padding: 12px; color: var(--t-tinta); }
.tienda-pago-aviso svg { flex-shrink: 0; margin-top: 2px; color: var(--t-oro-texto); }
.tienda-pago-suma { margin-top: 0; }
.tienda-pago-parrafo { margin: 0; font-size: 14.5px; line-height: 1.5; color: var(--t-tinta-2); }
.tienda-pago-parrafo strong { color: var(--t-tinta); }
.tienda-pago-rotulo { margin: 4px 0 0; font-weight: 700; font-size: 15px; }
.tienda-pago-opciones { display: grid; gap: 10px; }
.tienda-pago-opcion { display: flex; gap: 12px; align-items: center; background: var(--t-superficie); border: 1.5px solid var(--t-linea); border-radius: var(--t-radio); padding: 12px 14px; cursor: pointer; }
.tienda-pago-opcion.activa { border-color: var(--t-tinta); }
.tienda-pago-opcion input { accent-color: var(--t-tinta); width: 18px; height: 18px; flex-shrink: 0; }
.tienda-pago-opcion svg { color: var(--t-oro-texto); flex-shrink: 0; }
.tienda-pago-opcion span { display: grid; gap: 2px; font-size: 14.5px; }
.tienda-pago-opcion small { font-size: 13px; color: var(--t-tinta-3); line-height: 1.4; }
.tienda-pago-listo { display: flex; gap: 12px; align-items: flex-start; background: var(--t-vitrina); border-radius: var(--t-radio); padding: 14px; }
.tienda-pago-listo svg { color: var(--t-oro-texto); flex-shrink: 0; margin-top: 2px; }
.tienda-pago-listo p { margin: 0; font-size: 14.5px; line-height: 1.5; color: var(--t-tinta-2); }
.tienda-pago-titulo { font-weight: 700; color: var(--t-tinta) !important; font-size: 16px !important; margin-bottom: 4px !important; }
.tienda-pago-convenios { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.tienda-pago-convenios li { display: flex; justify-content: space-between; gap: 12px; background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: 10px; padding: 10px 12px; font-size: 14.5px; }
.tienda-pago-convenios strong { font-variant-numeric: tabular-nums; text-align: right; }
.tienda-pago-nota { margin: 0; font-size: 13px; color: var(--t-tinta-3); line-height: 1.45; }
.tienda-pago a.tienda-boton { text-decoration: none; }
.tienda-pago-eleccion { display: grid; gap: 10px; margin-top: 16px; }
.tienda-pago-eleccion-titulo { margin: 16px 0 0; font-weight: 700; font-size: 15px; }
.tienda-opcion { display: flex; gap: 12px; align-items: center; text-align: left; width: 100%; background: var(--t-superficie); border: 1.5px solid var(--t-linea); border-radius: var(--t-radio); padding: 14px; color: var(--t-tinta); cursor: pointer; }
.tienda-opcion:hover { border-color: var(--t-tinta); }
.tienda-opcion svg { flex-shrink: 0; color: var(--t-oro-texto); }
.tienda-opcion.whatsapp svg { color: #25D366; }
.tienda-opcion span { display: grid; gap: 2px; }
.tienda-opcion strong { font-size: 15px; }
.tienda-opcion small { font-size: 13px; color: var(--t-tinta-3); line-height: 1.4; }
.tienda-opcion .tienda-opcion-flecha { margin-left: auto; color: var(--t-tinta-3); }
`
