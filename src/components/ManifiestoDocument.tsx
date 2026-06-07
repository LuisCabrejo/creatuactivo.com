/**
 * Copyright © 2026 CreaTuActivo.com
 * Documento Fundacional — historia empática (Epiphany Bridge) + Manifiesto 01–08.
 * Fuente de copy: MANIFIESTO_FUNDADORES.md · Estética Bimetálica v3.0.
 *
 * Render compartido por dos rutas:
 *   /manifiesto          → versión orgánica (menú), sin atribución.
 *   /{slug}/manifiesto   → versión del Propietario: inyecta su ref (vía slug) en
 *                          localStorage para que tracking.js atribuya la visita,
 *                          con URL LIMPIA (sin ?ref). El CTA va al WhatsApp del
 *                          arquitecto con un mensaje de acuerdo; el botón comparte
 *                          /{slug}/manifiesto.
 */

import { IndustrialHeader } from '@/components/IndustrialHeader'
import ManifiestoShare from '@/components/ManifiestoShare'

const WHATSAPP_ORGANICO = '+573206805737'

interface ManifiestoDocumentProps {
  refId?: string | null
  slug?: string | null
  whatsapp?: string | null
  architectName?: string | null
}

export default function ManifiestoDocument({
  refId = null,
  slug = null,
  whatsapp = null,
  architectName = null,
}: ManifiestoDocumentProps) {
  // Inyecta el ref del arquitecto en localStorage ANTES del tracking.js diferido.
  // Sin ?ref en la URL: tracking.js lo toma de localStorage (fallback). URL limpia.
  const trackingScript = refId
    ? `(function(){try{localStorage.setItem('constructor_ref',${JSON.stringify(refId)});}catch(e){}})();`
    : null

  // CTA → WhatsApp. Enviar el mensaje ES la declaración de acuerdo.
  const waNumber = (whatsapp || WHATSAPP_ORGANICO).replace(/\D/g, '')
  const saludo = architectName ? `Hola ${architectName.split(' ')[0]}, ` : 'Hola, '
  const waText = `${saludo}leí el Manifiesto de los Fundadores y estoy de acuerdo. Quiero iniciar la activación de mi Base Operativa. ¿Cuál es el siguiente paso?`
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`

  return (
    <main className="min-h-screen text-[#E5E5E5]">
      {trackingScript && <script dangerouslySetInnerHTML={{ __html: trackingScript }} />}

      <div className="relative z-10">
        <IndustrialHeader
          title="NUESTRA FILOSOFÍA"
          subtitle="Las cosas no pasan. Se hacen pasar."
          refCode="DOCUMENTO_FUNDACIONAL_V1"
          imageSrc="/images/header-manifiesto.jpg"
          imageAlt=""
        />

        {/* ═══════════════ LA HISTORIA (Epiphany Bridge) ═══════════════ */}
        <article className="py-0 px-6" style={{ marginTop: '-1rem' }}>
          <div
            className="max-w-2xl mx-auto"
            style={{
              background: 'rgba(22, 24, 29, 0.70)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(212, 175, 55, 0.1)',
              borderRadius: '0',
              padding: 'clamp(2rem, 5vw, 4rem)',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Opening — la promesa */}
            <div className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                La cuenta de mi vida no cuadraba.
              </h2>
              <div className="prose-drop-cap space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  Hace años llevé a mi novia —hoy mi esposa— a un lugar llamado Buena Vista.
                  Mirando el horizonte, le hice tres promesas: una casa de campo,
                  poder comprar sin mirar el precio, y tres hijos.
                </p>
                <p>
                  Catorce años después, la cuenta no daba.
                  <span className="text-[#E5E5E5]"> De las tres, solo había cumplido una: los tres hijos.</span>
                </p>
              </div>
            </div>

            {/* El sueldo y el negocio que esclaviza */}
            <div className="mb-20">
              <p className="text-lg text-[#A3A3A3] leading-relaxed mb-6">
                Y no era por falta de trabajo. Empecé como empleado en el sector automotriz, donde
                aprendí lo que es que el sueldo llegue… y a los quince días ya no quede nada. Después
                monté empresas en varios sectores, y entendí algo duro:
                <span className="text-[#E5E5E5]"> el éxito de hoy no garantiza el de mañana</span> —
                impuestos que cambian, proveedores, nómina, cosas que uno no controla. La vida se
                volvía el mismo círculo: trabajar, pagar cuentas y repetir.
              </p>
              <div className="p-8 bg-[#16181D] border-l-2 border-[#C5A059] my-10">
                <p className="text-xl text-[#E5E5E5] font-serif italic">
                  Era como pedalear una bicicleta estática: mucho esfuerzo, y cero avance.
                </p>
              </div>
            </div>

            {/* La epifanía */}
            <div className="mb-20">
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">
                La epifanía
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                El problema no era mi esfuerzo. Era el sistema.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  Un día caí en cuenta de algo: yo no estaba fallando. Estaba dentro de
                  <span className="text-[#E5E5E5]"> un sistema diseñado para la asfixia mensual</span> —
                  no para construir verdadera libertad financiera.
                </p>
              </div>
            </div>

            {/* El pivote */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">
                El pivote
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                Lo logré… y descubrí que no bastaba.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  Buscando la salida, me apalancué en un gigante —Gano Excel— y en un producto de
                  consumo diario presente en todo el continente. Funcionó: llegué a
                  <span className="text-[#E5E5E5]"> Diamante en dos años y medio</span>, y alcancé lo que
                  muchos buscan: independencia financiera y viajar por el mundo.
                </p>
                <p>
                  Pero algo me confrontó: mi éxito no se reflejaba en mi equipo. A otros no les
                  resultaba. Y al mismo tiempo veía cómo otras industrias daban el salto con
                  tecnología —del mapa de papel a Waze, del correo al WhatsApp, de alquilar películas
                  a Netflix.
                </p>
                <div className="p-8 bg-[#16181D] border border-[#C5A059]/20 my-10">
                  <p className="text-xl text-[#E5E5E5] font-serif text-center">
                    Mi sueño de ayudar a cuatro millones de familias era posible.
                    <br />
                    Pero necesitaba una herramienta que hiciera el éxito
                    <span className="text-[#C5A059]"> replicable para todos</span>, no solo para los más hábiles.
                  </p>
                </div>
                <p>
                  Así nacieron CreaTuActivo y Queswa: para que cualquiera pueda construir lo que yo
                  construí, con la tecnología cargando el trabajo pesado. No es un canal educativo, ni
                  un equipo de ventas, ni una red de mercadeo.
                </p>
                <p className="text-[#E5E5E5]">
                  De ese camino nació una filosofía — y este documento la contiene. Lo que sigue no es
                  información para hojear: es el criterio que define quién está listo para dirigir una
                  Base Operativa. Si usted va a asumirla, primero tiene que estar de acuerdo con esto.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* ═══════════════ EL MANIFIESTO ═══════════════ */}
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto space-y-20">

            {/* §1 — El Principio */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">01 · El Principio</p>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#E5E5E5] leading-tight mb-8">
                Las cosas no pasan.<br />Se hacen pasar.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  Ninguna estructura de ingresos recurrentes se construyó jamás por inercia o azar. Detrás de
                  cada activo que produce de forma ininterrumpida, sin depender de su dueño, hubo una
                  <span className="text-[#E5E5E5]"> decisión quirúrgica</span> y una secuencia de acciones
                  consecuentes que la hicieron existir.
                </p>
                <p>
                  La suerte ciega es para los apostadores. En la construcción de patrimonio, la suerte
                  se diseña: se transmuta en un <span className="text-[#C5A059]">destino determinista</span> mediante
                  infraestructuras inimitables y una reputación inquebrantable.
                </p>
                <p className="text-[#E5E5E5]">
                  Esto no es una invitación a creer. Es la descripción de lo que vamos a hacer pasar —
                  y del criterio que se requiere para dirigirlo.
                </p>
              </div>
            </div>

            {/* §2 — La Visión */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">02 · La Visión</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                Cuatro millones de Bases Operativas en los próximos 3 a 7 años.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  El mercado libre no es un pastel de suma cero donde, para que uno gane, otro deba
                  perder. La verdadera innovación expande los recursos disponibles para todos.
                </p>
                <p>
                  Nuestra estrella polar es la activación de cuatro millones de Bases Operativas a lo
                  largo del continente americano. No competimos por una porción del mercado existente:
                  estructuramos un ecosistema que suprime la fricción de distribución en 15 países de
                  América, abriendo paso a la abundancia a través del <span className="text-[#E5E5E5]">consumo orgánico
                  diario</span>. La única manera de ganar, aquí, es haciendo ganar a otros.
                </p>
              </div>
            </div>

            {/* §3 — El Cambio de Paradigma */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">03 · El Cambio de Paradigma</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                La desvinculación absoluta.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  El intercambio lineal de horas de vida por dinero es la falla arquitectónica más
                  grave en la economía de un profesional. El tiempo es finito e inelástico: si su
                  ingreso depende de su presencia física, usted opera con una
                  <span className="text-[#E5E5E5]"> vulnerabilidad crítica</span> en el diseño de su modelo.
                </p>
                <p>
                  Un ingreso constante —un sueldo fijo, la facturación de un comercio— resuelve la
                  liquidez de hoy, pero no corrige la fragilidad de su mañana.
                  <span className="text-[#E5E5E5]"> Ese es el punto ciego del exitoso.</span>
                </p>
                <p>
                  La verdadera riqueza no es la exhibición de estatus: es la
                  <span className="text-[#C5A059]"> soberanía financiera</span>, el control total sobre su tiempo. Y
                  exige divorciar, de forma definitiva, la unidad de entrada —su reloj— de la unidad de
                  salida —su rendimiento: instalar una estructura de ingresos recurrentes en paralelo
                  que opere de forma autónoma.
                </p>
              </div>
            </div>

            {/* §4 — Qué es una Base Operativa */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">04 · Qué es una Base Operativa</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                Un activo que trabaja con usted, o sin usted.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  Una Base Operativa es el activo que materializa esa estructura: produce ingreso
                  recurrente a partir del consumo real, y le pertenece. No vive de su esfuerzo diario.
                  Vive del consumo de productos que las personas ya realizan, todos los días, exista
                  usted o no. Mientras ese consumo ocurre, su estructura acumula volumen, y ese volumen
                  le paga — semana tras semana, sin el techo de las horas y sin fecha de vencimiento.
                </p>
                <p>
                  No se hace más grande trabajando más horas. Se hace más grande
                  <span className="text-[#E5E5E5]"> activando nuevas Bases Operativas</span>. Esa es la unidad que se
                  replica — la pieza con la que un grupo pequeño se convierte en una estructura de
                  cuatro millones.
                </p>
                <p>
                  Usted no la construye solo, ni desde cero. Llega montada sobre una máquina que ya
                  existe.
                </p>
              </div>
            </div>

            {/* §5 — La Máquina: los Tres Pilares */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">05 · La Máquina</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                Tres pilares. Usted no los construye: los dirige.
              </h2>
              <ul className="space-y-6 text-lg">
                <li className="p-6 bg-[#16181D] border-l-2 border-[#C5A059]">
                  <p className="text-[#C5A059] mb-2">Pilar 1 — El Respaldo Operativo</p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    Usted deja la operación pesada —fábricas, inventarios, despachos, pasivos— en
                    manos de Gano Excel, una empresa real con presencia en 70 países. El peso que
                    hundiría a cualquier emprendedor, usted no lo carga.
                  </p>
                </li>
                <li className="p-6 bg-[#16181D] border-l-2 border-[#C5A059]">
                  <p className="text-[#C5A059] mb-2">Pilar 2 — Queswa, su Centro de Mando</p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    Usted deja lo que más desgasta —explicar, persuadir, filtrar— en manos de una
                    inteligencia artificial propia que lo hace las 24 horas. Trabaja mientras usted
                    duerme, viaja o vive. No pide permiso ni descansa.
                  </p>
                </li>
                <li className="p-6 bg-[#16181D] border-l-2 border-[#C5A059]">
                  <p className="text-[#C5A059] mb-2">Pilar 3 — El Método Comprobado</p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    Usted no improvisa el camino: lo deja en manos de un método ya probado —Expandir,
                    Activar, Maestría— que erradica el ensayo y el error. Quien lo sigue no reinventa
                    nada; solo escala.
                  </p>
                </li>
              </ul>
              <p className="text-lg text-[#A3A3A3] leading-relaxed mt-8">
                Entre los tres, la tecnología hace cerca del <span className="text-[#E5E5E5]">90% del trabajo pesado</span>.
                El apalancamiento que a otros les toma años y capital levantar, usted lo recibe ya
                construido. Lo único que el sistema no puede poner es la
                <span className="text-[#C5A059]"> dirección</span>. Esa es suya.
              </p>
            </div>

            {/* §6 — El Propietario de Base Operativa */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">06 · El Propietario de Base Operativa</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                Si la máquina ejecuta, usted dirige.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  Ese es el rol — y el nombre. No es quien teclea, ni presiona, ni anda detrás de nadie. Es quien
                  toma las decisiones de expansión y dirige los tres pilares hacia un objetivo.
                  Labor de dirección, no de operación.
                </p>
                <p>
                  Cuando una fuerza se multiplica —y aquí la tecnología la multiplica— lo que decide
                  el destino no es cuánto se esfuerza, sino hacia dónde apunta. Un grado de desviación
                  en la dirección, amplificado por la máquina, separa una estructura sólida de un
                  esfuerzo desperdiciado. El esfuerzo bruto es barato y abundante; el
                  <span className="text-[#E5E5E5]"> juicio</span> —saber qué activar, cuándo y dónde— es la habilidad escasa.
                </p>
                <div className="p-8 bg-[#16181D] border border-[#C5A059]/20 my-4">
                  <p className="text-xl text-[#E5E5E5] font-serif text-center">
                    No llega más lejos por remar más rápido.
                    <br />
                    Llega más lejos por gobernar mejor el timón.
                  </p>
                </div>
              </div>
            </div>

            {/* §7 — El Pacto de los Fundadores */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">07 · El Pacto de los Fundadores</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                Lo que creemos (y no negociamos).
              </h2>
              <ul className="space-y-5 text-lg text-[#A3A3A3] leading-relaxed border-l-2 border-[#C5A059]/30 pl-6">
                <li>Que el ingreso no debe depender de la presencia física de quien lo genera.</li>
                <li>Que no se presiona: se construye. No se convence: se selecciona. Aquí nadie ruega; cada quien elige.</li>
                <li>Que la tecnología ejecuta y nosotros dirigimos. La máquina hace el 90%; nuestro 10% es el que decide.</li>
                <li>Que la maestría es la ventaja injusta: cada semana de aprendizaje acorta la curva que a otros les tomó años.</li>
                <li>Que se construye en silencio. El estatus se pelea a la vista de todos; el patrimonio se levanta callado.</li>
                <li>Que el momento no se espera. El momento se hace.</li>
              </ul>
              <div className="p-8 bg-[#16181D] border border-[#C5A059]/20 my-10">
                <p className="text-xl text-[#E5E5E5] font-serif leading-relaxed">
                  Y por encima de todas, una sola: la <span className="text-[#C5A059]">soberanía financiera no se trata de lujos</span>.
                  Se trata de poder cumplir tu palabra — de estar presente para quienes amas, sin
                  pedirle permiso a nadie. El patrimonio no se construye para presumirlo. Se construye
                  para no volver a depender.
                </p>
              </div>
              <p className="text-lg text-[#E5E5E5] leading-relaxed">
                Si esto lo describe, usted ya piensa como un fundador. Solo falta que lo decida.
              </p>
            </div>

            {/* §8 — Por qué 15, por qué ahora */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">08 · Por qué 15, por qué ahora</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                Quince no es una cifra. Es un límite real.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  La plataforma puede sostener a un millón de personas mañana mismo. Lo que no es
                  infinito es el tiempo del núcleo directivo para acompañar, persona a persona, la
                  cimentación de las primeras Bases Operativas. Esa banda directiva es el recurso más
                  escaso del sistema — no la tecnología. Y alcanza para 15.
                </p>
                <p>
                  No hay una fecha en un calendario que cree la urgencia. La crea esto: una vez
                  consolidada la base fundacional, el despliegue se abre al mercado masivo, y el
                  acompañamiento directo y cercano que hoy ofrecemos deja de ser posible. No porque se
                  cierre una puerta con llave, sino porque la estructura cambia de fase.
                </p>
                <p>
                  Por eso elegimos con cuidado. Un activo de largo plazo se construye con personas de
                  largo plazo: alineadas, íntegras, con la decisión ya tomada de no volver a depender.
                  <span className="text-[#E5E5E5]"> No buscamos a los más. Buscamos a los 15 correctos.</span>
                </p>
                <p className="text-[#E5E5E5] font-serif text-xl">
                  Si llegó hasta aquí y algo en usted ya decidió, no se trata de pensarlo más. Se trata
                  de hacerlo pasar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA — acuerdo + contacto directo ═══════════════ */}
        <section className="py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] mb-8 leading-relaxed">
              No estoy aquí para persuadirle.
            </h2>
            <div className="p-8 bg-[#16181D] border border-[#C5A059]/20 mb-12">
              <p className="text-[#A3A3A3] leading-relaxed">
                Este documento es el criterio, no un folleto. Si lo leyó y se reconoce en él, el
                siguiente paso no es pensarlo más — es decirlo. Confírmelo y comencemos la activación
                de su Base Operativa.
              </p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-base cta-whatsapp"
              style={{ padding: '1.125rem 2.5rem', fontSize: '0.95rem' }}
            >
              Estoy de acuerdo · Quiero iniciar →
            </a>
            <p className="text-sm mt-6 text-[#6B7280]">
              Contacto directo por WhatsApp
            </p>

            {/* Firma del fundador */}
            <div className="mt-16 pt-8 border-t border-[rgba(197,160,89,0.15)] max-w-sm mx-auto">
              <p className="font-serif text-lg text-[#E5E5E5]">Luis Cabrejo Parra</p>
              <p className="text-sm text-[#A3A3A3] mt-1">CEO y fundador de CreaTuActivo &amp; Queswa</p>
            </div>

            {/* Compartir — solo en la versión del Propietario (con slug) */}
            {slug && (
              <div className="max-w-sm mx-auto">
                <ManifiestoShare slug={slug} />
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-10 border-t border-[rgba(229, 194, 121, 0.1)]">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm text-[#6B7280]">
              © 2026 CreaTuActivo.com ·
              <a href="/privacidad" className="hover:text-[#A3A3A3] ml-2">
                Privacidad
              </a>
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
