/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

import type { Metadata } from 'next';
import {
  ArrowLeft,
  Bot,
  Ban,
  ShieldCheck,
  Copyright,
  Server,
  Scale,
  ShieldAlert,
  Landmark,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | CreaTuActivo.com',
  description: 'Términos y Condiciones de Uso de la plataforma CreaTuActivo.com y el asistente de inteligencia artificial Queswa.',
  robots: {
    index: false,  // No indexar (contenido legal, no aporta conversión)
    follow: true,
  },
};

export default function TerminosPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}
    >
      {/* Header */}
      <div style={{ background: 'var(--color-bg-elevated)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 mb-6 transition-colors"
            style={{ color: 'var(--color-titanium)' }}
          >
            <ArrowLeft size={16} strokeWidth={1.75} />
            Volver a CreaTuActivo.com
          </a>
          <h1
            className="text-3xl md:text-4xl"
            style={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-brand)',
            }}
          >
            Términos y Condiciones
          </h1>
          <p className="mt-3" style={{ color: 'var(--color-text-primary)' }}>
            Términos y Condiciones de Uso de la Plataforma
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            CreaTuActivo.com — Asistente de Inteligencia Artificial Queswa
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="rounded-lg p-8 md:p-12"
          style={{ background: 'var(--color-bg-elevated)', border: '1px solid rgba(255,255,255,0.1)' }}
        >

          {/* Aceptación */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              1. Aceptación de los Términos
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Los presentes Términos y Condiciones de Uso (en adelante, "los Términos") regulan el acceso
                y la utilización de la plataforma web CreaTuActivo.com, sus subdominios y el asistente
                conversacional de inteligencia artificial Queswa (en adelante, "la Plataforma" o "el Servicio").
              </p>
              <p>
                Al acceder, navegar o utilizar la Plataforma por cualquier canal —incluido el sitio web y la
                interfaz de WhatsApp—, usted (en adelante, "el Usuario") declara haber leído, comprendido y
                aceptado de manera expresa e incondicional estos Términos. Si no está de acuerdo con alguno de
                ellos, deberá abstenerse de utilizar el Servicio.
              </p>
            </div>
          </section>

          {/* Identificación del Operador */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              2. Identificación del Operador
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p>El Servicio es operado por:</p>
              <p><strong className="text-white">Operador:</strong> Luis Cabrejo Parra</p>
              <p><strong className="text-white">Jurisdicción / Domicilio:</strong> Villavicencio, Meta, Colombia</p>
              <p><strong className="text-white">Correo electrónico:</strong> luiscabrejo@creatuactivo.com</p>
              <p><strong className="text-white">Teléfono de contacto:</strong> +57 320 680 5737</p>
            </div>
          </section>

          {/* Definiciones */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              3. Definiciones
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p><strong className="text-white">Plataforma:</strong> El conjunto de sitios web, subdominios, herramientas y servicios digitales operados bajo la marca CreaTuActivo.com.</p>
              <p><strong className="text-white">Queswa:</strong> El asistente conversacional de inteligencia artificial integrado en la Plataforma y en WhatsApp.</p>
              <p><strong className="text-white">Usuario:</strong> Toda persona natural que acceda o utilice la Plataforma por cualquier canal.</p>
              <p><strong className="text-white">Contenido:</strong> Textos, gráficos, software, prompts, flujos conversacionales, metodologías y demás materiales disponibles en la Plataforma.</p>
            </div>
          </section>

          {/* Naturaleza del Servicio — CRÍTICA */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              4. Naturaleza del Servicio
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <div className="p-6 rounded flex items-start gap-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-brand)' }}>
                <Bot size={24} strokeWidth={1.5} style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }} />
                <p>
                  <strong className="text-white">Queswa es un asistente de inteligencia artificial</strong> diseñado para
                  acompañar al Usuario en la optimización y construcción de activos dentro del ecosistema
                  CreaTuActivo.com. Su propósito es informativo, educativo y orientativo.
                </p>
              </div>
              <p>
                <strong className="text-white">La información proporcionada por Queswa o por la Plataforma NO constituye
                asesoría financiera, de inversión, contable, tributaria, médica ni legal vinculante.</strong> Las respuestas
                generadas por inteligencia artificial pueden contener imprecisiones y no sustituyen el criterio de un
                profesional certificado.
              </p>
              <p>
                Cualquier decisión que el Usuario tome con base en la información del Servicio es de su exclusiva
                responsabilidad. Le recomendamos validar toda decisión relevante con asesores profesionales
                independientes antes de actuar. Las proyecciones, simulaciones o ejemplos de ingresos son ilustrativos
                y no representan garantía de resultados.
              </p>
            </div>
          </section>

          {/* Elegibilidad */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              5. Elegibilidad
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                El Servicio está dirigido exclusivamente a personas mayores de 18 años con capacidad legal para
                contratar. Al utilizar la Plataforma, el Usuario declara cumplir con este requisito. El uso por parte
                de menores de edad está prohibido conforme a nuestra Política de Privacidad.
              </p>
            </div>
          </section>

          {/* Uso Aceptable — CRÍTICA */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              6. Uso Aceptable y Conducta del Usuario
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                El Usuario se compromete a utilizar la Plataforma y el asistente Queswa —incluyendo su interfaz de
                WhatsApp— de manera lícita, responsable y conforme a estos Términos. En particular, el Usuario
                <strong className="text-white"> se compromete a NO</strong>:
              </p>
              <div className="p-6 rounded space-y-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-titanium)' }}>
                <div className="flex items-start gap-3">
                  <Ban size={20} strokeWidth={1.5} style={{ color: 'var(--color-titanium)', flexShrink: 0, marginTop: 2 }} />
                  <p>Enviar, publicar o transmitir contenido ilícito, difamatorio, fraudulento, obsceno o que vulnere derechos de terceros.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Ban size={20} strokeWidth={1.5} style={{ color: 'var(--color-titanium)', flexShrink: 0, marginTop: 2 }} />
                  <p>Enviar spam, mensajes masivos no solicitados, publicidad no autorizada o cualquier forma de comunicación abusiva a través de la interfaz de WhatsApp de Queswa.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Ban size={20} strokeWidth={1.5} style={{ color: 'var(--color-titanium)', flexShrink: 0, marginTop: 2 }} />
                  <p>Introducir código malicioso, virus, malware o cualquier tecnología que pueda dañar, sobrecargar o comprometer la Plataforma o su infraestructura.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Ban size={20} strokeWidth={1.5} style={{ color: 'var(--color-titanium)', flexShrink: 0, marginTop: 2 }} />
                  <p>Intentar acceder sin autorización a sistemas, datos o cuentas, ni realizar ingeniería inversa sobre el Servicio o el asistente Queswa.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Ban size={20} strokeWidth={1.5} style={{ color: 'var(--color-titanium)', flexShrink: 0, marginTop: 2 }} />
                  <p>Suplantar la identidad de terceros o proporcionar información falsa.</p>
                </div>
              </div>
              <p className="p-4 rounded flex items-start gap-3" style={{ background: 'rgba(198,167,107,0.1)', border: '1px solid rgba(198,167,107,0.3)' }}>
                <ShieldCheck size={20} strokeWidth={1.5} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong className="text-white">Suspensión:</strong> El Operador se reserva el derecho de suspender o
                  cancelar el acceso de cualquier Usuario que incumpla estas normas de uso aceptable, sin previo aviso.
                </span>
              </p>
            </div>
          </section>

          {/* Propiedad Intelectual — CRÍTICA */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              7. Propiedad Intelectual
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <div className="p-6 rounded flex items-start gap-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-brand)' }}>
                <Copyright size={24} strokeWidth={1.5} style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }} />
                <p>
                  <strong className="text-white">Todo el código fuente, los prompts, los flujos conversacionales, los diseños,
                  las marcas, los contenidos y las metodologías de "Sovereign Economy" pertenecen exclusivamente a
                  CreaTuActivo.com</strong> y están protegidos por las leyes de propiedad intelectual e industrial aplicables.
                </p>
              </div>
              <p>
                Estos Términos no conceden al Usuario ninguna licencia ni derecho de propiedad sobre el Contenido. Queda
                prohibida la reproducción, distribución, modificación, descompilación, comunicación pública o explotación
                de cualquier elemento de la Plataforma sin autorización previa, expresa y por escrito del Operador.
              </p>
              <p>
                Las marcas, logotipos y signos distintivos de CreaTuActivo.com y Queswa son de propiedad del Operador y no
                podrán ser utilizados sin su consentimiento.
              </p>
            </div>
          </section>

          {/* Disponibilidad / SLA — CRÍTICA */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              8. Disponibilidad del Servicio
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <div className="p-6 rounded flex items-start gap-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-titanium)' }}>
                <Server size={24} strokeWidth={1.5} style={{ color: 'var(--color-titanium)', flexShrink: 0, marginTop: 2 }} />
                <p>
                  La Plataforma opera sobre infraestructura en la nube (entre otros, <strong className="text-white">Vercel</strong> y
                  <strong className="text-white"> Supabase</strong>) y depende de servicios y APIs de terceros
                  (<strong className="text-white">Meta / WhatsApp</strong>, <strong className="text-white">Anthropic</strong>, entre otros).
                </p>
              </div>
              <p>
                Aunque trabajamos para ofrecer un servicio estable y continuo, <strong className="text-white">no garantizamos
                una disponibilidad del 100% ni un funcionamiento libre de interrupciones</strong>. El Servicio puede verse
                afectado o suspendido temporalmente por tareas de mantenimiento, actualizaciones, fallos técnicos, o por
                caídas o limitaciones de las APIs de terceros, sin que ello genere responsabilidad alguna para el Operador.
              </p>
              <p>
                El Operador se reserva el derecho de modificar, suspender o discontinuar, total o parcialmente, el Servicio
                en cualquier momento.
              </p>
            </div>
          </section>

          {/* Limitación de Responsabilidad */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              9. Limitación de Responsabilidad
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <div className="p-6 rounded flex items-start gap-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-titanium)' }}>
                <Scale size={24} strokeWidth={1.5} style={{ color: 'var(--color-titanium)', flexShrink: 0, marginTop: 2 }} />
                <p>
                  El Servicio se ofrece "tal cual" y "según disponibilidad". En la máxima medida permitida por la ley, el
                  Operador no será responsable por daños indirectos, incidentales, lucro cesante o pérdida de datos
                  derivados del uso o la imposibilidad de uso de la Plataforma.
                </p>
              </div>
              <p>
                El Usuario es el único responsable de las decisiones que adopte con base en la información del Servicio,
                conforme a la <strong className="text-white">Sección 4 (Naturaleza del Servicio)</strong>.
              </p>
            </div>
          </section>

          {/* Indemnización */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              10. Indemnización
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                El Usuario se compromete a mantener indemne al Operador frente a cualquier reclamación, daño, pérdida o
                gasto (incluidos honorarios legales razonables) derivados del incumplimiento de estos Términos o del uso
                indebido de la Plataforma.
              </p>
            </div>
          </section>

          {/* Datos Personales */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              11. Tratamiento de Datos Personales
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                El tratamiento de los datos personales del Usuario se rige por nuestra{' '}
                <a href="/privacidad" className="underline font-semibold" style={{ color: 'var(--color-brand)' }}>Política de Privacidad</a>,
                la cual forma parte integral de estos Términos y cumple con la Ley Estatutaria 1581 de 2012 de Colombia.
              </p>
            </div>
          </section>

          {/* Modificaciones */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              12. Modificaciones a los Términos
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                El Operador podrá modificar estos Términos en cualquier momento para adaptarlos a cambios normativos,
                técnicos o de negocio. Las modificaciones entrarán en vigor desde su publicación en la Plataforma. El uso
                continuado del Servicio tras dichas modificaciones implica la aceptación de los Términos actualizados.
              </p>
            </div>
          </section>

          {/* Ley Aplicable y Jurisdicción */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              13. Ley Aplicable y Jurisdicción
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <div className="p-6 rounded flex items-start gap-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-titanium)' }}>
                <Landmark size={24} strokeWidth={1.5} style={{ color: 'var(--color-titanium)', flexShrink: 0, marginTop: 2 }} />
                <p>
                  Estos Términos se rigen e interpretan de acuerdo con las leyes de la <strong className="text-white">República de
                  Colombia</strong>. Para cualquier controversia derivada de su interpretación o ejecución, las partes se
                  someten a la jurisdicción de los jueces y tribunales competentes de <strong className="text-white">Villavicencio,
                  Meta, Colombia</strong>, renunciando a cualquier otro fuero que pudiera corresponderles.
                </p>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              14. Contacto
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Para cualquier consulta relacionada con estos Términos y Condiciones, puede contactarnos a través de:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Mail size={32} strokeWidth={1.5} style={{ color: 'var(--color-brand)', margin: '0 auto 8px' }} />
                  <h3 className="font-semibold text-white mb-2">Email</h3>
                  <a href="mailto:luiscabrejo@creatuactivo.com" className="underline text-sm" style={{ color: 'var(--color-brand)' }}>
                    luiscabrejo@creatuactivo.com
                  </a>
                </div>
                <div className="p-6 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Phone size={32} strokeWidth={1.5} style={{ color: 'var(--color-success)', margin: '0 auto 8px' }} />
                  <h3 className="font-semibold text-white mb-2">WhatsApp</h3>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>+57 320 680 5737</p>
                </div>
                <div className="p-6 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <MessageCircle size={32} strokeWidth={1.5} style={{ color: 'var(--color-titanium)', margin: '0 auto 8px' }} />
                  <h3 className="font-semibold text-white mb-2">Chat Queswa</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Disponible 24/7 en nuestro sitio web</p>
                </div>
              </div>
            </div>
          </section>

          {/* Aceptación final */}
          <section className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-8 rounded-xl" style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)' }}>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3" style={{ color: 'var(--color-brand)' }}>
                <CheckCircle2 size={28} strokeWidth={1.5} />
                Aceptación de estos Términos
              </h2>
              <p className="mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Al acceder o utilizar la Plataforma y el asistente Queswa por cualquier canal, usted declara haber leído,
                comprendido y aceptado expresamente estos Términos y Condiciones de Uso.
              </p>
              <p className="p-4 rounded mt-2" style={{ background: 'rgba(198,167,107,0.1)', borderLeft: '2px solid var(--color-warning)' }}>
                <strong className="text-white">Fecha de última actualización:</strong> mayo de 2026<br/>
                <strong className="text-white">Versión:</strong> 1.0
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <p>© 2026 CreaTuActivo.com - Todos los derechos reservados</p>
          <p className="mt-1">
            Servicio operado por <strong className="text-white">Luis Cabrejo Parra</strong> — Villavicencio, Meta, Colombia
          </p>
        </div>
      </div>
    </div>
  );
}
