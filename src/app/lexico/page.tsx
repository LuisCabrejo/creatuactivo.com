'use client'

/**
 * Taller de Voz — práctica diaria de pronunciación (uso interno, noindex).
 * Compañero diario: una cosa por pantalla, rutina fija + la tarea del día.
 * Las frases de práctica salen de los guiones reales (servilleta + reels).
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
type Dia = { dia: string; foco: string; pista?: string; sonidos: string[]; frase: string; origen: string }
type Semana = { titulo: string; sub: string; dias: Dia[] }

const PROGRAMA: Semana[] = [
  {
    titulo: 'La R', sub: 'simple y trino',
    dias: [
      { dia: 'Lun', foco: 'La R suave entre vocales', pista: 'Un solo toque de la lengua, como en "pe-ro".', sonidos: ['ra-re-ri-ro-ru', 'genera', 'dinero', 'mejores', 'recibe'], frase: 'Usted pasa a ser propietario de una empresa digital que genera ingresos recurrentes.', origen: 'Servilleta · su empresa' },
      { dia: 'Mar', foco: 'La R al final (ser, valor, pagar)', pista: 'No se la coma: el toque va aunque cierre la sílaba.', sonidos: ['ser', 'valor', 'pagar', 'trabajar', 'dar'], frase: 'Trabajar, pagar cuentas y volver a empezar.', origen: 'Servilleta · apertura' },
      { dia: 'Mié', foco: 'El trino al inicio (rr)', pista: 'Lengua suelta + aire de moto. No fuerce la garganta.', sonidos: ['recurrente', 'requiere', 'rápido', 'responde'], frase: 'Para multiplicar una empresa, se requiere abrir otro local.', origen: 'Servilleta · Paso 3' },
      { dia: 'Jue', foco: 'La doble RR (error, arriendo)', pista: 'Varias vibraciones. Es el sonido que más le cuesta: despacio.', sonidos: ['error', 'arriendo', 'recurrentes', 'tierra'], frase: 'Arriendo, personal, inversión… y el error.', origen: 'Servilleta · Paso 3 + su lista' },
      { dia: 'Vie', foco: 'Oído fino: pero / perro', pista: 'Una vibración cambia el significado. Escuche la diferencia.', sonidos: ['pero / perro', 'caro / carro', 'ahora / ahorra'], frase: 'Cada vez que el consumo se repite, usted recibe una parte.', origen: 'Servilleta · multiplicación' },
      { dia: 'Sáb', foco: 'Pasaje completo + grábese', pista: 'Hoy junta todo. Compare esta grabación con la del próximo sábado.', sonidos: ['lea despacio, marcando cada R'], frase: 'Detrás de su empresa digital está Gano Excel, una corporación presente en 70 países. Fabrica los productos, responde por los registros legales, despacha y da soporte en cada país.', origen: 'Servilleta · Pilar 1' },
    ],
  },
  {
    titulo: 'Los grupos', sub: 'tr · gr · pr · br · cr',
    dias: [
      { dia: 'Lun', foco: 'El grupo GR (ingreso)', pista: 'No meta vocal: es "gre", no "ge-re".', sonidos: ['in-gre-so', 'ingresos', 'gracias', 'logra'], frase: 'Mientras su ingreso dependa de que usted esté de pie, su vulnerabilidad es crítica.', origen: 'Reel informales · diagnóstico' },
      { dia: 'Mar', foco: 'El grupo TR (otro)', pista: 'Consonante + R pegadas: "o-tro", no "o-te-ro".', sonidos: ['otro', 'cuatro', 'tres', 'nuestro', 'construye'], frase: 'Para multiplicar una empresa, se requiere abrir otro local.', origen: 'Servilleta · Paso 3' },
      { dia: 'Mié', foco: 'Los grupos PR y BR', pista: 'propio · abrir. Pegado y limpio.', sonidos: ['propio', 'propietario', 'empresa', 'abrir', 'libre'], frase: 'Usted pasa a ser propietario de una empresa digital.', origen: 'Servilleta · su empresa' },
      { dia: 'Jue', foco: 'Los grupos CR y FR', pista: 'crecer · frente. La R va dentro del grupo.', sonidos: ['crecer', 'CreaTuActivo', 'frente', 'infraestructura', 'fluye'], frase: 'El sistema le da los pasos exactos para hacer crecer su empresa digital.', origen: 'Servilleta · método' },
      { dia: 'Vie', foco: 'Los grupos PL y CL', pista: 'aplicación · clic. Suaves pero completos.', sonidos: ['aplicación', 'multiplicar', 'clic', 'claridad'], frase: 'Multiplicar su empresa digital está a un clic, en todo el continente.', origen: 'Servilleta · multiplicación' },
      { dia: 'Sáb', foco: 'Pasaje completo + grábese', pista: 'Todos los grupos juntos en un solo párrafo.', sonidos: ['lea despacio, sin meter vocales'], frase: 'Para multiplicar una empresa, se requiere abrir otro local: arriendo, personal, inversión. Esa es la pared donde casi todos se detienen. Aquí no.', origen: 'Servilleta · Paso 3' },
    ],
  },
  {
    titulo: 'La S y las palabritas', sub: 'lo que se le cae',
    dias: [
      { dia: 'Lun', foco: 'La S nítida', pista: 'Que no se apague ni se vuelva "h". Crujiente.', sonidos: ['sistema', 'semana', 'países', 'pasos', 'distintas'], frase: 'Su empresa digital genera ingresos en doce velocidades distintas.', origen: 'Servilleta · simulador' },
      { dia: 'Mar', foco: '"setenta" y los números', pista: 'se-TEN-ta. No "stenta" ni "setena".', sonidos: ['setenta', 'sesenta', 'doce', 'ciento'], frase: 'Una corporación presente en 70 países.', origen: 'Servilleta · Pilar 1' },
      { dia: 'Mié', foco: 'No omitir las palabritas', pista: 'de · en · y · el · su · lo también suenan. Toque cada una.', sonidos: ['de', 'en', 'y', 'el', 'un', 'su', 'lo'], frase: 'Usted lo dirige todo desde una sola aplicación en su celular.', origen: 'Servilleta · Centro de Mando' },
      { dia: 'Jue', foco: 'Unir sin tragar (sinalefa)', pista: 'Una las vocales, pero que se oigan: "su_empresa".', sonidos: ['su empresa', 'está a un clic', 'una empresa', 'para hacer'], frase: 'Multiplicar su empresa digital está a un clic.', origen: 'Servilleta · multiplicación' },
      { dia: 'Vie', foco: '"en su celular" / "y el error"', pista: 'Sus frases marcadas: ninguna sílaba muda.', sonidos: ['en su celular', 'de mi perfil', 'y el error'], frase: 'Usted lo dirige todo desde una sola aplicación en su celular: queswa.app.', origen: 'Servilleta · Centro de Mando' },
      { dia: 'Sáb', foco: 'Pasaje completo + grábese', pista: 'Cuide la S y no se coma ninguna palabrita.', sonidos: ['lea tocando cada monosílabo'], frase: 'Su empresa digital genera ingresos en doce velocidades distintas, que cubren el corto, el mediano y el largo plazo. Analicemos dos.', origen: 'Servilleta · simulador' },
    ],
  },
  {
    titulo: 'Ritmo y anglicismos', sub: 'integración',
    dias: [
      { dia: 'Lun', foco: 'link · app · queswa.app', pista: 'Alargue la K: "lin-K". Si queda forzado, diga "el enlace de mi perfil".', sonidos: ['link', 'app', 'queswa.app', 'Waze', 'Rappi'], frase: 'Usted lo dirige todo desde una sola aplicación en su celular: queswa.app.', origen: 'Servilleta · Centro de Mando' },
      { dia: 'Mar', foco: 'Respire por bloques', pista: 'Una respiración por idea, nunca en mitad de una frase.', sonidos: ['marque las pausas con / antes de leer'], frase: 'Usted trabaja duro. Entrega sus mejores años y su salud. Y aun así, vive en el mismo ciclo mes a mes: trabajar, pagar cuentas y volver a empezar.', origen: 'Servilleta · apertura' },
      { dia: 'Mié', foco: 'Velocidad controlada', pista: 'Dígala al 60%, luego 80%, luego 100% — sin perder palabras.', sonidos: ['lento → medio → natural'], frase: 'Usted trabaja duro, pero vive "al día". Si usted se detiene, su ingreso se detiene.', origen: 'Reel informales · hook' },
      { dia: 'Jue', foco: 'Imítese a sí mismo (shadowing)', pista: 'Grabe una versión lenta, reprodúzcala y hable encima de ella.', sonidos: ['grábese lento, luego acompáñese'], frase: 'Es la consecuencia de un sistema diseñado para que usted viva en el ciclo de trabajar, pagar cuentas y repetir.', origen: 'Reel informales · diagnóstico' },
      { dia: 'Vie', foco: 'Integración total', pista: 'Aplique TODO lo del mes en un reel completo, de corrido.', sonidos: ['elija un hook + diagnóstico de nicho'], frase: 'Eso no sucede por falta de esfuerzo de su parte. Es la consecuencia de un sistema diseñado para construir el patrimonio de otros.', origen: 'Reel · cualquier nicho' },
      { dia: 'Sáb', foco: 'Reto final + grábese', pista: 'Compare con su grabación del Sábado de la Semana 1. Mida cuánto avanzó.', sonidos: ['velocidad natural, sin papel'], frase: 'Tener ingresos que no dependan de su presencia ya existe. CreaTuActivo.com ya existe. La única variable que falta en la ecuación es usted.', origen: 'Servilleta · cierre' },
    ],
  },
]

// ───────────────────────── Biblioteca de sonidos difíciles ─────────────────────────
const BIBLIOTECA = [
  {
    palabra: 'encontrará', icono: '↩',
    porque: 'Junta sus dos debilidades pegadas — el grupo TR y la R fuerte — en una palabra que carga el acento al final.',
    como: ['Empiece por la sílaba fuerte y crezca hacia atrás:', '1 · rá (sola, fuerte)', '2 · tra-rá (el corazón duro: dos toques)', '3 · con-tra-rá', '4 · en-con-tra-rá'],
    familia: ['encontrará', 'mostrará', 'entrará', 'construirá', 'logrará', 'explicará'],
  },
  {
    palabra: 'ejercicio', icono: '◐',
    porque: 'Encadena cuatro fricciones seguidas: jota → R → S → S. La lengua va atrás, salta adelante y al frente.',
    como: ['Su jota es suave (colombiana), casi una "h" soplada. Es aire, no rasguño.', '1 · "ha-he-hi-ho-hu" → "ja-je-ji-jo-ju"', '2 · la sílaba dura: "jer"', '3 · cio → ci-cio → jer-ci-cio → e-jer-ci-cio'],
    familia: ['digital (di-gi-tal)', 'dirige (di-ri-ge)', 'mejores', 'trabaja'],
  },
  {
    palabra: 'link de mi perfil', icono: '⌁',
    porque: 'Mete una terminación dura (la K, rara en español) seguida de tres palabritas átonas. Por eso suena forzado.',
    como: ['1 · Aísle la K: "lin —— K", exagerando.', '2 · Una el bloque sin tragarlo: "de-mi".', '3 · "per-fil" con toque de R.', '4 · Júntelo: "link / de mi / per-fil".'],
    familia: ['Alternativa fácil: "el enlace de mi perfil"'],
  },
]

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

  // Cargar progreso
  useEffect(() => {
    try {
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
      </div>
    </main>
  )
}
