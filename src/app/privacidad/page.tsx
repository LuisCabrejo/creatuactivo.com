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
  Eye,
  Pencil,
  Trash2,
  Ban,
  AlertTriangle,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Lock,
  ShieldCheck,
  Activity,
  RefreshCw,
  Landmark,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad | CreaTuActivo.com',
  description: 'Política de Tratamiento y Protección de Datos Personales - Ley 1581 de 2012',
  robots: {
    index: false,  // No indexar (contenido legal, no aporta conversión)
    follow: true,
  },
};

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          <p className="mt-3" style={{ color: 'var(--color-text-primary)' }}>
            Política de Tratamiento y Protección de Datos Personales
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Ley Estatutaria 1581 de 2012 — Colombia
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="rounded-lg p-8 md:p-12"
          style={{ background: 'var(--color-bg-elevated)', border: '1px solid rgba(255,255,255,0.1)' }}
        >

          {/* Información del Responsable */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              1. Identificación del Responsable
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p><strong className="text-white">Responsable del Tratamiento:</strong> Luis Cabrejo Parra</p>
              <p><strong className="text-white">Domicilio:</strong> Villavicencio, Meta, Colombia</p>
              <p><strong className="text-white">Correo electrónico:</strong> luiscabrejo@creatuactivo.com</p>
              <p><strong className="text-white">Teléfono de contacto:</strong> +57 320 680 5737</p>
            </div>
          </section>

          {/* Introducción */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              2. Introducción
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                En cumplimiento de la <strong className="text-white">Ley Estatutaria 1581 de 2012</strong> y el
                <strong className="text-white"> Decreto 1377 de 2013</strong>, CreaTuActivo.com (en adelante, "el Responsable")
                se compromete a proteger la privacidad y los datos personales de todos sus usuarios,
                prospectos y constructores (en adelante, "Titulares").
              </p>
              <p>
                Esta Política de Tratamiento de Datos Personales establece los términos y condiciones
                bajo los cuales recolectamos, almacenamos, usamos, circulamos, procesamos y eliminamos
                los datos personales que usted nos proporciona a través de nuestra plataforma web y
                asistente conversacional Queswa.
              </p>
              <p>
                Al utilizar nuestros servicios y proporcionar sus datos personales, usted acepta
                expresamente esta política y autoriza el tratamiento de sus datos conforme a lo aquí
                establecido.
              </p>
            </div>
          </section>

          {/* Definiciones */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              3. Definiciones
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p><strong className="text-white">Dato Personal:</strong> Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.</p>
              <p><strong className="text-white">Titular:</strong> Persona natural cuyos datos personales sean objeto de tratamiento.</p>
              <p><strong className="text-white">Tratamiento:</strong> Cualquier operación o conjunto de operaciones sobre datos personales, tales como recolección, almacenamiento, uso, circulación o supresión.</p>
              <p><strong className="text-white">Base de Datos:</strong> Conjunto organizado de datos personales que sea objeto de tratamiento.</p>
              <p><strong className="text-white">Responsable del Tratamiento:</strong> Persona natural o jurídica que decide sobre la base de datos y/o el tratamiento de los datos.</p>
              <p><strong className="text-white">Autorización:</strong> Consentimiento previo, expreso e informado del Titular para llevar a cabo el tratamiento de datos personales.</p>
            </div>
          </section>

          {/* Datos que Recolectamos */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              4. Datos Personales que Recolectamos
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>En CreaTuActivo.com recolectamos únicamente los datos personales que son necesarios para cumplir con las finalidades descritas en esta política. Los datos que podemos recolectar incluyen:</p>

              <div className="p-4 rounded" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-titanium)' }}>
                <h3 className="font-semibold text-white mb-2">Datos de Identificación:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Nombre completo</li>
                  <li>Número de teléfono / WhatsApp</li>
                  <li>Dirección de correo electrónico</li>
                </ul>
              </div>

              <div className="p-4 rounded" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-titanium)' }}>
                <h3 className="font-semibold text-white mb-2">Datos Profesionales:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ocupación o profesión</li>
                  <li>Experiencia previa en negocios</li>
                </ul>
              </div>

              <div className="p-4 rounded" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-titanium)' }}>
                <h3 className="font-semibold text-white mb-2">Datos de Navegación y Técnicos:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador y dispositivo</li>
                  <li>Páginas visitadas y tiempo de navegación</li>
                  <li>Cookies e identificadores de sesión</li>
                </ul>
              </div>

              <p className="mt-4">
                <strong className="text-white">IMPORTANTE:</strong> No recolectamos datos sensibles (datos que revelen origen racial o étnico,
                orientación política, convicciones religiosas, pertenencia a sindicatos, organizaciones sociales,
                datos relativos a la salud, vida sexual o datos biométricos) sin su consentimiento explícito y específico.
              </p>
            </div>
          </section>

          {/* Finalidad */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              5. Finalidad del Tratamiento de Datos
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p>Los datos personales recolectados serán utilizados exclusivamente para las siguientes finalidades legítimas:</p>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li><strong className="text-white">Personalización del servicio:</strong> Adaptar la experiencia del asistente conversacional Queswa a sus necesidades e intereses específicos.</li>
                <li><strong className="text-white">Gestión de la relación comercial:</strong> Procesar su solicitud de información sobre el ecosistema CreaTuActivo.com y el modelo de construcción de activos.</li>
                <li><strong className="text-white">Comunicaciones:</strong> Enviarle información sobre productos, servicios, novedades, recursos educativos y oportunidades del ecosistema.</li>
                <li><strong className="text-white">Calificación y seguimiento:</strong> Evaluar su nivel de interés y momento óptimo para ofrecerle la mejor asesoría posible.</li>
                <li><strong className="text-white">Conexión con el equipo:</strong> Facilitar el contacto con consultores especializados cuando usted lo solicite o cuando sea estratégicamente relevante.</li>
                <li><strong className="text-white">Análisis y mejora:</strong> Realizar análisis estadísticos y estudios de mercado para mejorar nuestros servicios y productos.</li>
                <li><strong className="text-white">Cumplimiento legal:</strong> Cumplir con obligaciones legales y regulatorias aplicables.</li>
              </ul>
            </div>
          </section>

          {/* Derechos del Titular */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              6. Derechos del Titular (Sus Derechos)
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>Como Titular de sus datos personales, usted tiene los siguientes derechos fundamentales de acuerdo con el artículo 8 de la Ley 1581 de 2012:</p>

              <div className="p-6 rounded-lg space-y-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-start gap-4">
                  <Eye size={24} strokeWidth={1.5} style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 className="font-semibold text-white">Derecho de Acceso (Conocer)</h3>
                    <p>Conocer, consultar y obtener información sobre sus datos personales que se encuentran en nuestras bases de datos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Pencil size={24} strokeWidth={1.5} style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 className="font-semibold text-white">Derecho de Rectificación (Actualizar)</h3>
                    <p>Actualizar y rectificar sus datos personales cuando estos sean inexactos, incompletos o desactualizados.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Trash2 size={24} strokeWidth={1.5} style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 className="font-semibold text-white">Derecho de Supresión (Eliminar)</h3>
                    <p>Solicitar la eliminación o supresión de sus datos personales cuando considere que no están siendo tratados conforme a los principios, deberes y obligaciones de la ley.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Ban size={24} strokeWidth={1.5} style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 className="font-semibold text-white">Derecho de Oposición (Revocar)</h3>
                    <p>Revocar la autorización otorgada para el tratamiento de sus datos personales en cualquier momento, salvo cuando exista un deber legal o contractual que impida la revocatoria.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <AlertTriangle size={24} strokeWidth={1.5} style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 className="font-semibold text-white">Derecho a Presentar Quejas</h3>
                    <p>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a lo dispuesto en la Ley 1581 de 2012.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo Ejercer sus Derechos */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              7. Cómo Ejercer sus Derechos
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>Usted puede ejercer sus derechos de manera sencilla y gratuita a través de los siguientes canales:</p>

              <div className="p-6 rounded" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-brand)' }}>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <MessageCircle size={20} strokeWidth={1.5} style={{ color: 'var(--color-brand)' }} />
                  A través del Asistente Queswa (Recomendado)
                </h3>
                <p className="mb-2">Durante cualquier conversación con Queswa, puede escribir las siguientes palabras clave:</p>
                <div className="p-3 rounded" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <code style={{ color: 'var(--color-brand)' }}>"mis datos"</code> |
                  <code style={{ color: 'var(--color-brand)' }}> "privacidad"</code> |
                  <code style={{ color: 'var(--color-brand)' }}> "actualizar información"</code> |
                  <code style={{ color: 'var(--color-brand)' }}> "eliminar datos"</code>
                </div>
                <p className="mt-2 text-sm">Queswa le guiará a través de un menú interactivo para gestionar su información.</p>
              </div>

              <div className="p-6 rounded" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-titanium)' }}>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Mail size={20} strokeWidth={1.5} style={{ color: 'var(--color-titanium)' }} />
                  Por Correo Electrónico
                </h3>
                <p>Envíe su solicitud a: <a href="mailto:luiscabrejo@creatuactivo.com" className="underline font-semibold" style={{ color: 'var(--color-brand)' }}>luiscabrejo@creatuactivo.com</a></p>
                <p className="text-sm mt-2">Incluya en su solicitud:</p>
                <ul className="list-disc list-inside text-sm ml-4 mt-1">
                  <li>Nombre completo</li>
                  <li>Datos de contacto</li>
                  <li>Descripción clara de su solicitud</li>
                  <li>Copia de su documento de identidad (para verificación)</li>
                </ul>
              </div>

              <div className="p-6 rounded" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-success)' }}>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Phone size={20} strokeWidth={1.5} style={{ color: 'var(--color-success)' }} />
                  Por WhatsApp
                </h3>
                <p>Contáctenos al: <strong style={{ color: 'var(--color-success)' }}>+57 320 680 5737</strong></p>
                <p className="text-sm mt-2">Horario de atención: Lunes a Viernes, 8:00 AM - 8:00 PM (GMT-5)</p>
              </div>

              <div className="mt-6 p-4 rounded flex items-start gap-3" style={{ background: 'rgba(198,167,107,0.1)', border: '1px solid rgba(198,167,107,0.3)' }}>
                <Clock size={20} strokeWidth={1.5} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
                <p>
                  <strong className="text-white">Tiempo de respuesta:</strong> Atenderemos su solicitud en un plazo máximo de
                  <strong className="text-white"> 15 días hábiles</strong> contados a partir de la fecha de recepción. Si requiere
                  información adicional, le notificaremos dentro de los primeros 5 días hábiles.
                </p>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              8. Medidas de Seguridad
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                CreaTuActivo.com ha adoptado medidas técnicas, administrativas y humanas necesarias para
                proteger sus datos personales y evitar su adulteración, pérdida, consulta, uso o acceso no
                autorizado o fraudulento.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Lock size={20} strokeWidth={1.5} style={{ color: 'var(--color-brand)' }} />
                    Cifrado de Datos
                  </h3>
                  <p className="text-sm">Utilizamos cifrado TLS 1.3 para proteger la transmisión de datos y AES-256 para el almacenamiento.</p>
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <ShieldCheck size={20} strokeWidth={1.5} style={{ color: 'var(--color-brand)' }} />
                    Acceso Restringido
                  </h3>
                  <p className="text-sm">Solo el personal autorizado con necesidad legítima tiene acceso a sus datos personales.</p>
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Activity size={20} strokeWidth={1.5} style={{ color: 'var(--color-brand)' }} />
                    Monitoreo Continuo
                  </h3>
                  <p className="text-sm">Supervisamos constantemente nuestros sistemas para detectar y prevenir accesos no autorizados.</p>
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <RefreshCw size={20} strokeWidth={1.5} style={{ color: 'var(--color-brand)' }} />
                    Backups Seguros
                  </h3>
                  <p className="text-sm">Realizamos copias de seguridad cifradas para proteger sus datos contra pérdida accidental.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Transferencias */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              9. Transferencia y Transmisión de Datos
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Sus datos personales pueden ser compartidos con terceros únicamente en los siguientes casos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cuando sea necesario para cumplir con las finalidades descritas en esta política.</li>
                <li>Con proveedores de servicios tecnológicos (hosting, bases de datos, servicios de email) que actúan como encargados del tratamiento bajo estrictos acuerdos de confidencialidad.</li>
                <li>Cuando exista una orden judicial o requerimiento de autoridad competente.</li>
                <li>Con su consentimiento expreso para casos específicos no contemplados en esta política.</li>
              </ul>
              <p className="p-4 rounded mt-4" style={{ background: 'rgba(64,138,113,0.12)', borderLeft: '2px solid var(--color-success)' }}>
                <strong className="text-white">Importante:</strong> No vendemos, alquilamos ni comercializamos sus datos personales a terceros con fines de marketing directo sin su consentimiento explícito.
              </p>
            </div>
          </section>

          {/* Proveedores Tecnológicos y Transferencia Internacional */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              10. Proveedores Tecnológicos y Transferencia Internacional de Datos
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Para garantizar el funcionamiento de la plataforma bajo los más altos estándares de
                calidad, compartimos datos con sub-procesadores tecnológicos estratégicos. Al aceptar
                esta política, el usuario autoriza expresamente la transferencia internacional de sus
                datos (conforme al <strong className="text-white">Artículo 26 de la Ley 1581 de 2012</strong>) a servidores
                ubicados en Estados Unidos y otras jurisdicciones seguras, operados por:
              </p>
              <div className="p-4 rounded" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-brand)' }}>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-white">Supabase</strong> — Base de datos</li>
                  <li><strong className="text-white">Vercel</strong> — Hosting y servidores</li>
                  <li><strong className="text-white">Anthropic / Claude</strong> — Procesamiento de Inteligencia Artificial</li>
                  <li><strong className="text-white">Meta Platforms / WhatsApp Business</strong> — Infraestructura de mensajería</li>
                  <li><strong className="text-white">Voyage AI</strong> — Vectores y embeddings</li>
                  <li><strong className="text-white">Resend</strong> — Infraestructura de correo</li>
                  <li><strong className="text-white">ElevenLabs / OpenAI</strong> — Síntesis de voz</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Uso de WhatsApp Business y Mensajería Automatizada */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              11. Uso de WhatsApp Business y Mensajería Automatizada
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Nuestra plataforma utiliza la <strong className="text-white">API oficial de WhatsApp Business (Meta)</strong>.
                Al interactuar con nuestro número oficial o hacer clic en nuestros anuncios dirigidos
                a WhatsApp, el usuario acepta de manera explícita recibir respuestas y mensajes
                automatizados operados por nuestro asistente de inteligencia artificial
                (<strong className="text-white">Queswa</strong>). Los datos recopilados a través de este canal incluyen:
                número de teléfono, nombre de perfil y el contenido de los mensajes, para fines de
                procesamiento de la solicitud.
              </p>
              <div className="p-4 rounded" style={{ background: 'rgba(64,138,113,0.12)', borderLeft: '2px solid var(--color-success)' }}>
                <h3 className="font-semibold text-white mb-2">Derecho de exclusión (Opt-out)</h3>
                <p>
                  El usuario puede revocar su consentimiento y detener cualquier comunicación
                  automatizada en cualquier momento enviando la palabra{' '}
                  <code className="font-semibold" style={{ color: 'var(--color-success)' }}>STOP</code> o{' '}
                  <code className="font-semibold" style={{ color: 'var(--color-success)' }}>BAJA</code> al mismo chat de WhatsApp.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              12. Uso de Cookies y Tecnologías Similares
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestra plataforma,
                personalizar contenido, analizar el tráfico y recordar sus preferencias.
              </p>
              <p>
                Usted puede configurar su navegador para rechazar cookies, aunque esto puede afectar la
                funcionalidad de algunos servicios.
              </p>
              <div className="p-4 rounded" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-semibold text-white mb-2">Tipos de cookies que usamos:</h3>
                <ul className="text-sm space-y-1">
                  <li>• <strong className="text-white">Esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                  <li>• <strong className="text-white">Funcionales:</strong> Recordar sus preferencias y personalizar su experiencia</li>
                  <li>• <strong className="text-white">Analíticas:</strong> Entender cómo los usuarios interactúan con nuestro sitio</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Retención */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              13. Tiempo de Retención de Datos
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Conservaremos sus datos personales únicamente durante el tiempo que sea necesario para cumplir
                con las finalidades descritas en esta política, salvo que:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Exista una obligación legal de conservarlos por un período mayor.</li>
                <li>Sean necesarios para el ejercicio o defensa de reclamaciones legales.</li>
                <li>Usted haya autorizado expresamente su conservación.</li>
              </ul>
              <p>
                Una vez cumplida la finalidad y transcurrido el plazo legal aplicable, procederemos a la
                eliminación o anonimización de sus datos.
              </p>
            </div>
          </section>

          {/* Menores */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              14. Tratamiento de Datos de Menores de Edad
            </h2>
            <div className="space-y-3 p-6 rounded" style={{ color: 'var(--color-text-primary)', background: 'rgba(244,63,94,0.08)', borderLeft: '2px solid #F43F5E' }}>
              <p className="font-semibold flex items-center gap-2" style={{ color: '#FB7185' }}>
                <ShieldAlert size={20} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                Nuestros servicios NO están dirigidos a menores de 18 años.
              </p>
              <p>
                No recolectamos intencionalmente datos personales de menores de edad sin el consentimiento
                previo y verificable de sus padres o tutores legales. Si tenemos conocimiento de que hemos
                recolectado datos de un menor sin la debida autorización, procederemos a eliminarlos
                inmediatamente.
              </p>
            </div>
          </section>

          {/* Cambios */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              15. Modificaciones a esta Política
            </h2>
            <div className="space-y-3" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento para
                adaptarla a cambios normativos, jurisprudenciales, nuevos servicios o mejores prácticas de
                seguridad.
              </p>
              <p>
                Cualquier modificación será comunicada a través de:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Notificación en nuestra página web</li>
                <li>Correo electrónico a los usuarios registrados</li>
                <li>Mensaje en el asistente Queswa al inicio de la conversación</li>
              </ul>
              <p className="p-4 rounded mt-4" style={{ background: 'rgba(198,167,107,0.1)', borderLeft: '2px solid var(--color-warning)' }}>
                <strong className="text-white">Fecha de última actualización:</strong> 28 de mayo de 2026<br/>
                <strong className="text-white">Versión:</strong> 2.0 - Compliance Ley 1581 + WhatsApp Business API
              </p>
            </div>
          </section>

          {/* Autoridad de Control */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              16. Autoridad de Control y Reclamos
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Si considera que sus derechos de protección de datos han sido vulnerados, puede presentar una
                queja o reclamo ante la <strong className="text-white">Superintendencia de Industria y Comercio de Colombia</strong>,
                autoridad de control en materia de protección de datos personales.
              </p>
              <div className="p-6 rounded" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Landmark size={20} strokeWidth={1.5} style={{ color: 'var(--color-titanium)' }} />
                  Datos de Contacto - Superintendencia de Industria y Comercio:
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong className="text-white">Sitio web:</strong> <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-brand)' }}>www.sic.gov.co</a></p>
                  <p><strong className="text-white">Dirección:</strong> Carrera 13 No. 27 – 00, pisos 3 y 4, Bogotá D.C., Colombia</p>
                  <p><strong className="text-white">Línea gratuita nacional:</strong> 01-8000-910165</p>
                  <p><strong className="text-white">Teléfono en Bogotá:</strong> (601) 587 0000</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-brand)', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
              17. Contacto
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-primary)' }}>
              <p>
                Para cualquier consulta, comentario o solicitud relacionada con esta Política de Privacidad
                o el tratamiento de sus datos personales, puede contactarnos a través de:
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

          {/* Aceptación */}
          <section className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-8 rounded-xl" style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)' }}>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3" style={{ color: 'var(--color-brand)' }}>
                <CheckCircle2 size={28} strokeWidth={1.5} />
                Aceptación de esta Política
              </h2>
              <p className="mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Al utilizar nuestros servicios, proporcionar sus datos personales o continuar navegando en
                nuestro sitio web después de haber sido informado de esta política, usted acepta expresamente
                los términos y condiciones aquí establecidos.
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Le recomendamos leer esta política periódicamente para estar informado sobre cómo protegemos
                su información personal.
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <p>© 2026 CreaTuActivo.com - Todos los derechos reservados</p>
          <p className="mt-1">
            Esta política cumple con la <strong className="text-white">Ley Estatutaria 1581 de 2012</strong> y el
            <strong className="text-white"> Decreto 1377 de 2013</strong> de Colombia
          </p>
        </div>
      </div>
    </div>
  );
}
