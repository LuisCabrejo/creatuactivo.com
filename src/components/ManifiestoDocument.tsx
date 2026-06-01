/**
 * Copyright © 2026 CreaTuActivo.com
 * Documento Fundacional — historia empática (Epiphany Bridge) + Manifiesto 01–08.
 * Fuente de copy: MANIFIESTO_FUNDADORES.md · Estética Bimetálica v3.0.
 *
 * Render compartido por dos rutas:
 *   /manifiesto          → versión orgánica (menú), sin atribución.
 *   /{slug}/manifiesto   → versión del Arquitecto: inyecta su ref (vía slug) en
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
          title="MEMORÁNDUM DIRECTIVO"
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
            {/* Opening */}
            <div className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                La arquitectura estaba fracturada.
              </h2>
              <div className="prose-drop-cap space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  Hace años, llevé a mi novia (hoy mi esposa) a un lugar llamado Buena Vista.
                  Mirando al horizonte, le hice tres promesas: una casa de campo,
                  compras sin mirar el precio, y tres hijos.
                </p>
                <p>
                  Catorce años después, la matemática de mi vida no cuadraba.
                  <span className="text-[#E5E5E5]"> Solo había cumplido con los tres hijos.</span>
                </p>
              </div>
            </div>

            {/* La Cinta Estática */}
            <div className="mb-20">
              <p className="text-lg text-[#A3A3A3] leading-relaxed mb-6">
                No era por falta de esfuerzo. Mi perfil era el del &quot;buen profesional&quot;.
                Trabajaba e invertía horas, pero mi liquidez no escalaba.
                Vivía en el ciclo <span className="text-[#E5E5E5]">trabajar, pagar cuentas y repetir</span>.
              </p>
              <div className="p-8 bg-[#16181D] border-l-2 border-[#C5A059] my-10">
                <p className="text-xl text-[#E5E5E5] font-serif italic">
                  Era el equivalente a correr en una cinta estática: máxima fricción operativa,
                  nulo desplazamiento financiero.
                </p>
              </div>
            </div>

            {/* La Falla Estructural */}
            <div className="mb-20">
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">
                La Falla Estructural
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                El problema no era el esfuerzo. Era la estructura.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  Entendí que no importaba cuánto trabajara si la estructura sobre la
                  que construía era matemáticamente ineficiente.
                </p>
                <p>
                  Al evaluar modelos tradicionales y de comercio electrónico, detecté dos fallas
                  críticas: primero, la fricción operativa de filtrar prospectos manualmente;
                  y segundo, convertirse en el operador permanente de la propia logística.
                </p>
              </div>
            </div>

            {/* El Pivote */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">
                El Pivote
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                La Reingeniería
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  La obsesión se convirtió en una pregunta técnica: ¿Existe una forma de construir
                  un activo que tenga la logística de una corporación global pero la libertad de un
                  inversionista?
                </p>
                <div className="p-8 bg-[#16181D] border border-[#C5A059]/20 my-10">
                  <p className="text-xl text-[#E5E5E5] font-serif text-center">
                    La solución no era convertirse en un mejor vendedor,
                    <br />
                    sino en un
                    <span className="text-[#C5A059]"> Arquitecto de Patrimonio</span>.
                  </p>
                </div>
                <p>
                  Hoy dirijo CreaTuActivo: una infraestructura diseñada para desvincular la
                  generación de ingresos del agotamiento físico. No es un canal educativo, ni un
                  equipo de ventas, ni una red de mercadeo.
                </p>
                <p className="text-[#E5E5E5]">
                  De esa reingeniería nació una filosofía — y este documento la contiene. Lo que
                  sigue no es información para hojear: es el criterio que define quién está listo
                  para dirigir una Base Operativa. Si usted va a asumir esa dirección, primero
                  tiene que estar de acuerdo con esto.
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
                  Ninguna estructura patrimonial se construyó jamás por inercia o azar. Detrás de
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
                  salida —su rendimiento: instalar una Estructura Patrimonial en paralelo que opere de
                  forma autónoma.
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
                  <p className="text-[#C5A059] mb-2">Pilar 1 — La Matriz Física</p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    Gano Excel: una corporación con presencia en 70 países que asume el músculo
                    logístico — inventarios, despachos, pasivos, operación. El peso que hundiría a
                    cualquier emprendedor ya está resuelto.
                  </p>
                </li>
                <li className="p-6 bg-[#16181D] border-l-2 border-[#C5A059]">
                  <p className="text-[#C5A059] mb-2">Pilar 2 — Queswa, su Centro de Mando</p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    Una inteligencia artificial propietaria que filtra y califica interesados las 24
                    horas, los 7 días. Trabaja mientras usted duerme, viaja o vive. No pide permiso
                    ni descansa.
                  </p>
                </li>
                <li className="p-6 bg-[#16181D] border-l-2 border-[#C5A059]">
                  <p className="text-[#C5A059] mb-2">Pilar 3 — La Metodología Automatizada</p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    El Tridente EAM: un protocolo exacto de ejecución — Expandir, Activar, Maestría —
                    que erradica el ensayo y el error. Quien sigue el método no reinventa nada; solo
                    escala.
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

            {/* §6 — El Arquitecto de Patrimonio */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">06 · El Arquitecto de Patrimonio</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                Si la máquina ejecuta, usted dirige.
              </h2>
              <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                <p>
                  Ese es el rol — y el nombre. No es quien teclea, prospecta ni persigue. Es quien
                  toma las decisiones de expansión y orquesta los tres pilares hacia un objetivo.
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
                <li>Que no se persigue: se construye. No se convence: se selecciona. Aquí nadie ruega; cada quien elige.</li>
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

            {/* Compartir — solo en la versión del arquitecto (con slug) */}
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
