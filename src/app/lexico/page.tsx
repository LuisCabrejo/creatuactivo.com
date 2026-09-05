'use client'

/**
 * Taller de Voz — práctica diaria de pronunciación (uso interno, noindex).
 * Compañero diario: una cosa por pantalla, rutina fija + la tarea del día.
 * Las frases de práctica salen del léxico VIVO: los candados del arsenal
 * (`knowledge_base/arsenal_inicial.txt`), la Home y el cierre del guion de la
 * servilleta. Auditada el 5 sep 2026 contra la doctrina vigente; el criterio es
 * que una frase que se ensaya cien veces se aprende de memoria, así que aquí
 * solo va copy que hoy se le diría a un prospecto. Cuando el arsenal cambie
 * una frase con candado, esta página se actualiza con él (y `PROGRAMA_VERSION`
 * sube, para que el progreso guardado no mezcle frases viejas con nuevas).
 */

import { useState, useEffect } from 'react'

// ───────────────────────── Paleta (cálida, calma) ─────────────────────────
const C = {
  bg: '#0F1115',
  card: '#16191F',
  cardSoft: '#1B1F26',
  line: 'rgba(255,255,255,0.08)',
  text: '#ECECEC',
  muted: '#9AA1AC',
  faint: '#6B7280',
  green: '#10B981',
}

// Acento por semana
const ACENTOS = ['#C5A059', '#94A3B8', '#7FB2A6', '#C0917A']

// ───────────────────────── Rutina fija (el "temple") ─────────────────────────
const RUTINA = [
  { t: '2 min', titulo: 'Respire y suelte', detalle: 'Inhale 4 segundos, sostenga 4, exhale 6. Cinco veces. Suelte la mandíbula (bostece), la lengua y los labios. La tensión es enemiga de la R.' },
  { t: '3 min', titulo: 'Caliente la boca', detalle: 'Trino de labios "brrr" ×3 · trino de lengua "rrr" de moto ×3 · "pa-ta-ka" rápido y claro · vocales A — E — I — O — U bien abiertas.' },
  { t: '7 min', titulo: 'La escalera de hoy', detalle: 'escalera' }, // usa sonidos del día
  { t: '8 min', titulo: 'Su frase de hoy', detalle: 'frase' },       // usa frase del día
  { t: '3 min', titulo: 'Grábese y escúchese', detalle: 'Grabe la frase. Escúchela. ¿Qué palabra se cayó? ¿Qué grupo se comió la vocal? Subráyelo y dígala una vez más, corrigiendo. Busque UNA corrección consciente, no la perfección.' },
  { t: '2 min', titulo: 'Cierre suave', detalle: 'Diga la frase a velocidad natural, ya sin pensar en la técnica. Que su cuerpo sienta cómo se oye bien.' },
]

// ───────────────────────── Programa de 4 semanas ─────────────────────────
// Los números van en letras a propósito: la práctica es hablada.
type Dia = { dia: string; foco: string; pista?: string; sonidos: string[]; frase: string; origen: string }
type Semana = { titulo: string; sub: string; dias: Dia[] }

const PROGRAMA: Semana[] = [
  {
    titulo: 'La R', sub: 'simple y trino',
    dias: [
      { dia: 'Lun', foco: 'La R suave entre vocales', pista: 'Un solo toque de la lengua, como en "quie-ra".', sonidos: ['ra-re-ri-ro-ru', 'quiera', 'interés', 'dinero', 'ahora'], frase: 'Su día a día se resume en dos acciones. Compartir: usted pasa un enlace a quien quiera. Recibir: usted saluda a quien llega con interés.', origen: 'Arsenal · EAM_01 (candado)' },
      { dia: 'Mar', foco: 'La R al final (pagar, repetir)', pista: 'No se la coma: el toque va aunque cierre la sílaba.', sonidos: ['trabajar', 'pagar', 'repetir', 'compartir', 'recibir'], frase: 'Es un ciclo de trabajar, pagar cuentas y repetir.', origen: 'Arsenal · STORY_03 (candado) · Home' },
      { dia: 'Mié', foco: 'El trino al inicio (rr)', pista: 'Lengua suelta + aire de moto. No fuerce la garganta.', sonidos: ['resuelve', 'recibe', 'repite', 'recurrente', 'respaldo'], frase: 'Conversa por WhatsApp con cada persona interesada, le resuelve las dudas y madura su decisión de avanzar, a toda hora.', origen: 'Home · Queswa' },
      { dia: 'Jue', foco: 'La doble RR (arriendo, error)', pista: 'Varias vibraciones. Es el sonido que más le cuesta: despacio.', sonidos: ['arriendo', 'error', 'recurrente', 'carro', 'ahorra'], frase: 'En un negocio tradicional usted paga arriendo, nómina, inventario y transporte.', origen: 'Arsenal · EMPRESA_DIGITAL_01 (candado)' },
      { dia: 'Vie', foco: 'Oído fino: pero / perro', pista: 'Una vibración cambia el significado. Escuche la diferencia — y la frase de hoy arranca justo con "pero".', sonidos: ['pero / perro', 'caro / carro', 'ahora / ahorra', 'entero / entierro'], frase: 'Usted trabaja el mes entero, pero al día siguiente de que le entra la plata, ese dinero ya tiene dueño: el banco, las cuotas, los recibos.', origen: 'Arsenal · STORY_03 (candado) · Servilleta · Slide 1' },
      { dia: 'Sáb', foco: 'Pasaje completo + grábese', pista: 'Hoy junta todo. Compare esta grabación con la del próximo sábado.', sonidos: ['lea despacio, marcando cada R'], frase: 'Gano Excel, con treinta años y presencia en más de sesenta países, pone las fábricas, el inventario y la logística: fabrica, almacena y despacha cada pedido directo a la casa del cliente.', origen: 'Arsenal · WHY_02 (candado)' },
    ],
  },
  {
    titulo: 'Los grupos', sub: 'tr · gr · pr · br · cr',
    dias: [
      { dia: 'Lun', foco: 'El grupo GR (ingreso)', pista: 'No meta vocal: es "gre", no "ge-re".', sonidos: ['in-gre-so', 'ingreso', 'gracias', 'logra', 'genérica'], frase: 'Construye un ingreso que corre en paralelo a su actividad actual, y que sale del consumo que se repite cada mes entre sus clientes y sus distribuidores.', origen: 'Arsenal · WHY_05 (candado)' },
      { dia: 'Mar', foco: 'El grupo TR (tres, distribuir)', pista: 'Consonante + R pegadas: "tres", no "te-res". Y "dis-tri-buir" lleva el grupo en medio.', sonidos: ['tres', 'otro', 'nuestro', 'distribuir', 'distribución'], frase: 'Tres cosas hacen falta para distribuir en serio. Las tres ya están resueltas.', origen: 'Servilleta · Slide 2 (deck)' },
      { dia: 'Mié', foco: 'Los grupos PR y BR', pista: 'propio · cobra. Pegado y limpio.', sonidos: ['propio', 'producto', 'premium', 'prueba', 'cobra'], frase: 'Sea dueño de su propio canal de distribución. Lo maneja desde el celular, y cobra cada vez que mueve producto.', origen: 'Home · titular' },
      { dia: 'Jue', foco: 'Los grupos CR y FR', pista: 'crecer · fricción. La R va dentro del grupo.', sonidos: ['crecer', 'concreto', 'CreaTuActivo', 'fricción', 'fábrica'], frase: 'Lo que le queda es decidir con quién lo comparte y ver crecer su canal.', origen: 'Arsenal · WHY_05 (candado)' },
      { dia: 'Vie', foco: 'Los grupos PL y CL (clave · clientes)', pista: 'La C de "clave" y "clientes" suena K+L pegadas: "cla-ve". No meta vocal.', sonidos: ['aplicación', 'clic', 'clave', 'clientes', 'plata'], frase: 'Y aquí está la clave de la estabilidad: quien prueba el producto nota la diferencia en su energía y no vuelve a la marca genérica.', origen: 'Arsenal · WHY_02 (candado)' },
      { dia: 'Sáb', foco: 'Pasaje completo + grábese', pista: 'Todos los grupos juntos en un solo párrafo.', sonidos: ['lea despacio, sin meter vocales'], frase: 'Todo parte de algo concreto: usted monta su propio canal de distribución, apoyado en una línea premium de café y suplementos con Ganoderma. La ganancia sale de ahí, y es simple: por cada producto que se compra a través de su canal, a usted le queda un porcentaje.', origen: 'Arsenal · WHY_02 (candado)' },
    ],
  },
  {
    titulo: 'La S y las palabritas', sub: 'lo que se le cae',
    dias: [
      { dia: 'Lun', foco: 'La S nítida (sus socios)', pista: 'Que no se apague ni se vuelva "h". Ojo con las dos eses pegadas de "sus socios" y "dos formas".', sonidos: ['sus socios', 'dos formas', 'sedes', 'sesenta', 'sistema'], frase: 'Se vende de dos formas: al detal, a quien solo quiere consumirlo, y en paquetes empresariales, a quien arranca su propio canal.', origen: 'Arsenal · WHY_04 (candado)' },
      { dia: 'Mar', foco: '"sesenta" — sola sale, en la frase se cae', pista: 'Aislada la dice perfecta. El truco es el bloque: "con presencia / en más de sesenta / países". Baje la velocidad justo en la unión. Y ojo: son tres eses seguidas.', sonidos: ['sesenta', 'más de sesenta', 'sesenta países', 'con presencia en más de sesenta países'], frase: 'Una empresa con más de treinta años y presencia en más de sesenta países.', origen: 'Arsenal · WHY_01 (candado) · Home' },
      { dia: 'Mié', foco: 'No omitir las palabritas', pista: 'de · en · y · el · su · lo también suenan. Toque cada una.', sonidos: ['de', 'en', 'y', 'el', 'un', 'su', 'lo'], frase: 'Su canal se maneja desde una aplicación, y buena parte desde WhatsApp.', origen: 'Home · lo que antes era complicado' },
      { dia: 'Jue', foco: 'Unir sin tragar + cadena de eses', pista: 'Una las vocales sin tragarlas. "esa compra que se repite es la que le sostiene el ingreso" lleva seis eses: que suenen todas.', sonidos: ['esa compra que se repite', 'es la que le sostiene', 'se sostiene', 'está a un clic'], frase: 'Esa compra que se repite es la que le sostiene el ingreso.', origen: 'Arsenal · WHY_02 (candado)' },
      { dia: 'Vie', foco: '"desde el celular" / "y cobrar"', pista: 'Sus frases marcadas: ninguna sílaba muda.', sonidos: ['desde el celular', 'en su celular', 'y cobrar', 'a toda hora'], frase: 'A usted le quedan dos acciones, y las hace desde el celular: compartir su enlace con quien decida, y cobrar cada vez que su canal factura.', origen: 'Arsenal · WHY_02 (candado)' },
      { dia: 'Sáb', foco: 'Pasaje completo + grábese', pista: 'Cuide la S y no se coma ninguna palabrita.', sonidos: ['lea tocando cada monosílabo'], frase: 'Quien le consigna es Gano Excel, y lo hace en su cuenta bancaria cada viernes. Producto que sale de una fábrica y llega a una dirección; plata que sale de una empresa de treinta años y llega a su banco.', origen: 'Arsenal · WHY_04 (candado)' },
    ],
  },
  {
    titulo: 'Ritmo y anglicismos', sub: 'integración',
    dias: [
      { dia: 'Lun', foco: 'link · app · WhatsApp · queswa.app', pista: 'Alargue la K: "lin-K". "WhatsApp" es "guats-ap", sin vocal de apoyo al final. Si "link" queda forzado, diga "mi enlace".', sonidos: ['link', 'app', 'WhatsApp', 'queswa.app', 'Gano Excel'], frase: 'Lo que antes era complicado de desarrollar, hoy es sencillo: una inteligencia artificial explica y atiende a cada interesado por WhatsApp, a toda hora.', origen: 'Home · lo que antes era complicado' },
      { dia: 'Mar', foco: 'Respire por bloques', pista: 'Una respiración por idea, nunca en mitad de una frase.', sonidos: ['marque las pausas con / antes de leer'], frase: 'Usted trabaja el mes entero, pero al día siguiente de que le entra la plata, ese dinero ya tiene dueño: el banco, las cuotas, los recibos. Es un ciclo de trabajar, pagar cuentas y repetir.', origen: 'Arsenal · STORY_03 (candado) · Servilleta · Slide 1' },
      { dia: 'Mié', foco: 'Velocidad controlada', pista: 'Dígala al 60%, luego 80%, luego 100% — sin perder palabras. Es la frase más larga del mes.', sonidos: ['lento → medio → natural'], frase: 'Hoy, la estabilidad económica de la mayoría depende de variables que no controla, donde basta un recorte de personal, un mal trimestre en su sector o una semana de poco trabajo para que todo tambalee.', origen: 'Arsenal · WHY_05 (candado)' },
      { dia: 'Jue', foco: 'Imítese a sí mismo (shadowing)', pista: 'Grabe una versión lenta, reprodúzcala y hable encima. Cuide "exactamente igual": la X suena "ks" y la G de "gana" e "igual" es dura.', sonidos: ['gana', 'igual', 'exactamente igual', 'grábese lento y acompáñese'], frase: 'Y no pasa por falta de capacidad ni de esfuerzo: le pasa exactamente igual al que gana dos millones y al que gana más de veinte.', origen: 'Arsenal · STORY_03 (candado)' },
      { dia: 'Vie', foco: 'Integración total', pista: 'Aplique TODO lo del mes en un candado completo, de corrido.', sonidos: ['elija WHY_02 o EAM_01 y dígalo entero'], frase: 'Y quien inicia con usted hace exactamente lo mismo, con las mismas dos acciones. De ahí salen la multiplicación de su negocio y el aumento de su facturación.', origen: 'Arsenal · EAM_01 (candado)' },
      { dia: 'Sáb', foco: 'Reto final + grábese', pista: 'Compare con su grabación del Sábado de la Semana 1. Mida cuánto avanzó.', sonidos: ['velocidad natural, sin papel'], frase: 'Lo que hace es empezar a construirle una parte que sí sea suya: un viernes en que entra algo que no le debe nada a nadie. CreaTuActivo.com ya existe.', origen: 'Servilleta · cierre (v6.8)' },
    ],
  },
]

// ───────────────────────── Biblioteca de sonidos difíciles ─────────────────────────
const BIBLIOTECA = [
  {
    palabra: 'encontrará', icono: '↩',
    porque: 'Junta sus dos debilidades pegadas — el grupo TR y la R fuerte — en una palabra que carga el acento al final.',
    como: ['Empiece por la sílaba fuerte y crezca hacia atrás:', '1 · rá (sola, fuerte)', '2 · tra-rá (el corazón duro: dos toques)', '3 · con-tra-rá', '4 · en-con-tra-rá'],
    familia: ['encontrará', 'mostrará (le mostrará en minutos…)', 'construirá', 'logrará', 'explicará', 'distribuirá'],
  },
  {
    palabra: 'ejercicio', icono: '◐',
    porque: 'Encadena cuatro fricciones seguidas: jota → R → S → S. La lengua va atrás, salta adelante y al frente.',
    como: ['Su jota es suave (colombiana), casi una "h" soplada. Es aire, no rasguño.', '1 · "ha-he-hi-ho-hu" → "ja-je-ji-jo-ju"', '2 · la sílaba dura: "jer"', '3 · cio → ci-cio → jer-ci-cio → e-jer-ci-cio'],
    familia: ['digital (di-gi-tal)', 'maneja (ma-ne-ja)', 'genérica (ge-né-ri-ca)', 'trabaja'],
  },
  {
    palabra: 'link de mi perfil', icono: '⌁',
    porque: 'Mete una terminación dura (la K, rara en español) seguida de tres palabritas átonas. Por eso suena forzado.',
    como: ['1 · Aísle la K: "lin —— K", exagerando.', '2 · Una el bloque sin tragarlo: "de-mi".', '3 · "per-fil" con toque de R.', '4 · Júntelo: "link / de mi / per-fil".'],
    familia: ['Alternativa fácil: "mi enlace"'],
  },
  {
    palabra: 'sus socios · se sostiene', icono: '∿',
    porque: 'Cuando la S se repite muy seguida, la lengua quiere saltarse una. "sus clientes y sus socios" tiene cinco eses; "se sos-tie-ne" tiene dos pegadas.',
    como: ['Marque cada S y que ninguna se apague ni se vuelva "h".', '1 · "sus —— so-cios" (dos eses pegadas, las dos suenan)', '2 · "se · sos · tie · ne", despacio', '3 · "se-sen-ta" (tres eses en una sola palabra)'],
    familia: ['sus clientes y sus socios', 'se sostiene el ingreso', 'sesenta países', 'sistema · semana · sedes'],
  },
]

// Cambia cuando cambian las frases: el progreso guardado deja de tener sentido.
const PROGRAMA_VERSION = '2026-09-05'

const REGLAS = [
  'Su mente corre: baje el ritmo interno un 20%.',
  'Ninguna palabra es muda: de, en, y, el, su también suenan.',
  'En los grupos (tr, gr, pr) no meta vocal: es "gre", no "ge-re".',
  'Exagere en el ensayo para acertar en lo natural.',
  'Respire en las pausas, nunca en mitad de una idea.',
  'Grábese siempre: lo que no se oye, no se corrige.',
]

// ───────────────────────── Componente ─────────────────────────
export default function LexicoPage() {
  const [s, setS] = useState(0)
  const [d, setD] = useState(0)
  const [done, setDone] = useState<Record<string, number[]>>({})
  const [openBib, setOpenBib] = useState<number | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Cargar progreso. Si el programa cambió de versión, el progreso viejo se
  // descarta y se arranca desde la Semana 1 (frases nuevas, grabaciones nuevas).
  useEffect(() => {
    try {
      if (localStorage.getItem('lexico_v') !== PROGRAMA_VERSION) {
        localStorage.removeItem('lexico_pos')
        localStorage.removeItem('lexico_done')
        localStorage.setItem('lexico_v', PROGRAMA_VERSION)
      }
      const pos = JSON.parse(localStorage.getItem('lexico_pos') || 'null')
      if (pos && typeof pos.s === 'number') { setS(pos.s); setD(pos.d) }
      const dn = JSON.parse(localStorage.getItem('lexico_done') || '{}')
      if (dn && typeof dn === 'object') setDone(dn)
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem('lexico_pos', JSON.stringify({ s, d }))
  }, [s, d, hydrated])

  const acento = ACENTOS[s]
  const semana = PROGRAMA[s]
  const dia = semana.dias[d]
  const key = `s${s}d${d}`
  const hechos = done[key] || []
  const completo = hechos.length === RUTINA.length

  const toggle = (i: number) => {
    setDone((prev) => {
      const cur = prev[key] || []
      const next = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]
      const upd = { ...prev, [key]: next }
      try { localStorage.setItem('lexico_done', JSON.stringify(upd)) } catch {}
      return upd
    })
  }

  const reiniciar = () => {
    if (!confirm('¿Borrar el progreso y volver a la Semana 1?')) return
    try { localStorage.removeItem('lexico_pos'); localStorage.removeItem('lexico_done') } catch {}
    setDone({}); setS(0); setD(0)
  }

  const irSiguiente = () => {
    if (d < 5) { setD(d + 1) } else if (s < 3) { setS(s + 1); setD(0) }
  }

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '28px 18px 80px' }}>

        {/* Encabezado */}
        <p style={{ fontSize: 12, letterSpacing: '0.18em', color: C.faint, textTransform: 'uppercase', margin: 0 }}>Taller de Voz</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 4px', lineHeight: 1.2 }}>¿Qué practico hoy?</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>20–30 minutos al día. Mejore su pronunciación mientras se aprende los guiones.</p>

        {/* El secreto */}
        <div style={{ marginTop: 16, padding: '14px 16px', background: C.cardSoft, border: `1px solid ${C.line}`, borderRadius: 14 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text }}>
            <strong style={{ color: acento }}>El secreto:</strong> su mente corre y su boca queda atrás —por eso se come palabras. Baje el ritmo interno un 20%, dígalo todo (hasta el <em>de</em> y el <em>su</em>) y grábese para auditar.
          </p>
        </div>

        {/* En la frase se cae */}
        <div style={{ marginTop: 12, padding: '14px 16px', background: C.cardSoft, border: `1px solid ${C.line}`, borderRadius: 14 }}>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.text }}>
            <strong style={{ color: acento }}>¿Aislada le sale, pero en la frase se cae?</strong> Es lo normal: el problema casi nunca es el sonido, es la <em>unión</em> entre palabras. Parta la frase en bloques cortos, respire solo entre bloques y ensaye las <em>uniones</em>, no las palabras sueltas.
          </p>
          <p style={{ margin: 0, fontSize: 14, color: C.muted, lineHeight: 1.9, fontFamily: 'var(--font-mono, monospace)' }}>
            con presencia&nbsp;/&nbsp;en más de sesenta&nbsp;/&nbsp;países<br />
            esa compra que se repite&nbsp;/&nbsp;es la que le sostiene&nbsp;/&nbsp;el ingreso<br />
            le pasa exactamente igual&nbsp;/&nbsp;al que gana dos millones&nbsp;/&nbsp;y al que gana más de veinte
          </p>
        </div>

        {/* Selector de semana */}
        <div style={{ display: 'flex', gap: 8, marginTop: 22, overflowX: 'auto', paddingBottom: 4 }}>
          {PROGRAMA.map((w, i) => {
            const activo = i === s
            return (
              <button key={i} onClick={() => { setS(i); setD(0) }}
                style={{ flex: '1 0 auto', minWidth: 130, textAlign: 'left', cursor: 'pointer', padding: '10px 12px', borderRadius: 12,
                  background: activo ? `${ACENTOS[i]}1A` : C.card, border: `1px solid ${activo ? ACENTOS[i] : C.line}`, transition: 'all .15s' }}>
                <span style={{ fontSize: 11, color: activo ? ACENTOS[i] : C.faint, letterSpacing: '0.08em' }}>SEMANA {i + 1}</span>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: activo ? C.text : C.muted }}>{w.titulo}</span>
                <span style={{ fontSize: 11, color: C.faint }}>{w.sub}</span>
              </button>
            )
          })}
        </div>

        {/* Selector de día */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {semana.dias.map((dd, i) => {
            const activo = i === d
            const dk = `s${s}d${i}`
            const hechoDia = (done[dk]?.length || 0) === RUTINA.length
            return (
              <button key={i} onClick={() => setD(i)}
                style={{ flex: 1, cursor: 'pointer', padding: '8px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: activo ? acento : C.card, color: activo ? C.bg : (hechoDia ? C.green : C.muted),
                  border: `1px solid ${activo ? acento : C.line}` }}>
                {dd.dia}{hechoDia && !activo ? ' ✓' : ''}
              </button>
            )
          })}
        </div>

        {/* Tarjeta del día */}
        <div style={{ marginTop: 18, background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ padding: '18px 18px 6px', borderBottom: `1px solid ${C.line}` }}>
            <p style={{ margin: 0, fontSize: 12, color: acento, letterSpacing: '0.06em' }}>SEMANA {s + 1} · {dia.dia.toUpperCase()}</p>
            <h2 style={{ margin: '4px 0 0', fontSize: 21, fontWeight: 700, lineHeight: 1.25 }}>{dia.foco}</h2>
            {dia.pista && <p style={{ margin: '8px 0 14px', fontSize: 13.5, color: C.muted }}>{dia.pista}</p>}
          </div>

          {/* Pasos de la rutina */}
          <div style={{ padding: '8px 0' }}>
            {RUTINA.map((paso, i) => {
              const marcado = hechos.includes(i)
              return (
                <button key={i} onClick={() => toggle(i)}
                  style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 'none',
                    display: 'flex', gap: 12, padding: '12px 18px', alignItems: 'flex-start' }}>
                  {/* Casilla */}
                  <span style={{ flexShrink: 0, marginTop: 1, width: 22, height: 22, borderRadius: 7,
                    border: `1.5px solid ${marcado ? C.green : C.faint}`, background: marcado ? C.green : 'transparent',
                    color: C.bg, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {marcado ? '✓' : ''}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: marcado ? C.faint : C.text, textDecoration: marcado ? 'line-through' : 'none' }}>{paso.titulo}</span>
                      <span style={{ fontSize: 11, color: C.faint, border: `1px solid ${C.line}`, borderRadius: 20, padding: '1px 7px' }}>{paso.t}</span>
                    </span>

                    {/* Detalle: escalera / frase / texto */}
                    {paso.detalle === 'escalera' ? (
                      <span style={{ display: 'block', marginTop: 8 }}>
                        <span style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 8 }}>Suba despacio y exagerado: sonido → sílaba → palabra → frase. Hoy:</span>
                        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {dia.sonidos.map((w, k) => (
                            <span key={k} style={{ fontSize: 13.5, fontWeight: 600, color: acento, background: `${acento}14`, border: `1px solid ${acento}40`, borderRadius: 8, padding: '4px 10px' }}>{w}</span>
                          ))}
                        </span>
                      </span>
                    ) : paso.detalle === 'frase' ? (
                      <span style={{ display: 'block', marginTop: 8 }}>
                        <span style={{ display: 'block', fontSize: 17, lineHeight: 1.5, color: C.text, fontStyle: 'italic', borderLeft: `3px solid ${acento}`, paddingLeft: 12 }}>
                          “{dia.frase}”
                        </span>
                        <span style={{ display: 'block', fontSize: 11, color: C.faint, marginTop: 6, paddingLeft: 12 }}>{dia.origen}</span>
                        <span style={{ display: 'block', fontSize: 13, color: C.muted, marginTop: 10 }}>
                          1 · Marque cada sílaba con el dedo.&nbsp;&nbsp;2 · Divídala en bloques y respire ahí.&nbsp;&nbsp;3 · Dígala 5 veces, cada vez más fluida.&nbsp;&nbsp;4 · Dígala sin mirar.
                        </span>
                      </span>
                    ) : (
                      <span style={{ display: 'block', marginTop: 5, fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{paso.detalle}</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Pie de la tarjeta */}
          <div style={{ padding: '14px 18px 18px', borderTop: `1px solid ${C.line}`, background: C.cardSoft }}>
            {completo ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 12px', fontSize: 15, color: C.green, fontWeight: 600 }}>¡Listo por hoy! 🎉 Su boca se lo agradece.</p>
                {!(s === 3 && d === 5) && (
                  <button onClick={irSiguiente}
                    style={{ cursor: 'pointer', background: acento, color: C.bg, border: 'none', borderRadius: 12, padding: '11px 22px', fontSize: 14, fontWeight: 700 }}>
                    Siguiente día →
                  </button>
                )}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: C.faint, textAlign: 'center' }}>
                Marque cada paso a medida que lo hace · {hechos.length}/{RUTINA.length}
              </p>
            )}
          </div>
        </div>

        {/* Atajo 10 min */}
        <div style={{ marginTop: 14, padding: '12px 16px', background: C.cardSoft, border: `1px dashed ${C.line}`, borderRadius: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
            <strong style={{ color: C.text }}>¿Día corto? Atajo de 10 min:</strong> caliente la boca (2) · escalera (3) · su frase 5 veces + grábela (5). Mejor 10 minutos diarios que una hora un solo día.
          </p>
        </div>

        {/* Biblioteca de sonidos difíciles */}
        <h3 style={{ fontSize: 13, letterSpacing: '0.12em', color: C.faint, textTransform: 'uppercase', margin: '32px 0 12px' }}>Palabras que se le traban</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {BIBLIOTECA.map((b, i) => {
            const abierto = openBib === i
            return (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, overflow: 'hidden' }}>
                <button onClick={() => setOpenBib(abierto ? null : i)}
                  style={{ width: '100%', cursor: 'pointer', background: 'transparent', border: 'none', color: C.text,
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', textAlign: 'left' }}>
                  <span style={{ fontSize: 18, color: acento, width: 22, textAlign: 'center' }}>{b.icono}</span>
                  <span style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>{b.palabra}</span>
                  <span style={{ color: C.faint, fontSize: 18, transform: abierto ? 'rotate(45deg)' : 'none', transition: 'transform .15s' }}>+</span>
                </button>
                {abierto && (
                  <div style={{ padding: '0 16px 16px 50px' }}>
                    <p style={{ margin: '0 0 10px', fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}><strong style={{ color: C.text }}>Por qué cuesta: </strong>{b.porque}</p>
                    {b.como.map((l, k) => (
                      <p key={k} style={{ margin: '2px 0', fontSize: 14, color: C.text }}>{l}</p>
                    ))}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {b.familia.map((f, k) => (
                        <span key={k} style={{ fontSize: 12.5, color: acento, background: `${acento}14`, border: `1px solid ${acento}40`, borderRadius: 8, padding: '3px 9px' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Reglas de oro */}
        <h3 style={{ fontSize: 13, letterSpacing: '0.12em', color: C.faint, textTransform: 'uppercase', margin: '32px 0 12px' }}>Las 6 reglas de oro</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {REGLAS.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, color: C.muted }}>
              <span style={{ color: acento, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span>{r}</span>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 36, fontSize: 11, color: C.faint, textAlign: 'center' }}>
          Práctica constante, no intensa. La voz es músculo. 🪢
        </p>
        <p style={{ marginTop: 10, textAlign: 'center' }}>
          <button onClick={reiniciar}
            style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: C.faint, fontSize: 11, textDecoration: 'underline' }}>
            Volver a empezar desde la Semana 1
          </button>
        </p>
      </div>
    </main>
  )
}
