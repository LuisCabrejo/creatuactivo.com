import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | CreaTuActivo.com',
  description: 'Política de Tratamiento y Protección de Datos Personales - Ley 1581 de 2012',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <a
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            ← Volver a CreaTuActivo.com
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Política de Privacidad
          </h1>
          <p className="mt-2 text-gray-600">
            Política de Tratamiento y Protección de Datos Personales
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Ley Estatutaria 1581 de 2012 - Colombia
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

          {/* Información del Responsable */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              1. Identificación del Responsable
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Razón Social:</strong> CreaTuActivo.com</p>
              <p><strong>Domicilio:</strong> Colombia</p>
              <p><strong>Correo electrónico:</strong> privacidad@creatuactivo.com</p>
              <p><strong>Teléfono de contacto:</strong> +57 310 206 6593</p>
            </div>
          </section>

          {/* Introducción */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              2. Introducción
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y el
                <strong> Decreto 1377 de 2013</strong>, CreaTuActivo.com (en adelante, "el Responsable")
                se compromete a proteger la privacidad y los datos personales de todos sus usuarios,
                prospectos y constructores (en adelante, "Titulares").
              </p>
              <p>
                Esta Política de Tratamiento de Datos Personales establece los términos y condiciones
                bajo los cuales recolectamos, almacenamos, usamos, circulamos, procesamos y eliminamos
                los datos personales que usted nos proporciona a través de nuestra plataforma web y
                asistente conversacional NEXUS.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              3. Definiciones
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Dato Personal:</strong> Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.</p>
              <p><strong>Titular:</strong> Persona natural cuyos datos personales sean objeto de tratamiento.</p>
              <p><strong>Tratamiento:</strong> Cualquier operación o conjunto de operaciones sobre datos personales, tales como recolección, almacenamiento, uso, circulación o supresión.</p>
              <p><strong>Base de Datos:</strong> Conjunto organizado de datos personales que sea objeto de tratamiento.</p>
              <p><strong>Responsable del Tratamiento:</strong> Persona natural o jurídica que decide sobre la base de datos y/o el tratamiento de los datos.</p>
              <p><strong>Autorización:</strong> Consentimiento previo, expreso e informado del Titular para llevar a cabo el tratamiento de datos personales.</p>
            </div>
          </section>

          {/* Datos que Recolectamos */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              4. Datos Personales que Recolectamos
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>En CreaTuActivo.com recolectamos únicamente los datos personales que son necesarios para cumplir con las finalidades descritas en esta política. Los datos que podemos recolectar incluyen:</p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Datos de Identificación:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Nombre completo</li>
                  <li>Número de teléfono / WhatsApp</li>
                  <li>Dirección de correo electrónico</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Datos Profesionales:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ocupación o profesión</li>
                  <li>Experiencia previa en negocios</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Datos de Navegación y Técnicos:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador y dispositivo</li>
                  <li>Páginas visitadas y tiempo de navegación</li>
                  <li>Cookies e identificadores de sesión</li>
                </ul>
              </div>

              <p className="mt-4">
                <strong>IMPORTANTE:</strong> No recolectamos datos sensibles (datos que revelen origen racial o étnico,
                orientación política, convicciones religiosas, pertenencia a sindicatos, organizaciones sociales,
                datos relativos a la salud, vida sexual o datos biométricos) sin su consentimiento explícito y específico.
              </p>
            </div>
          </section>

          {/* Finalidad */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              5. Finalidad del Tratamiento de Datos
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Los datos personales recolectados serán utilizados exclusivamente para las siguientes finalidades legítimas:</p>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Personalización del servicio:</strong> Adaptar la experiencia del asistente conversacional NEXUS a sus necesidades e intereses específicos.</li>
                <li><strong>Gestión de la relación comercial:</strong> Procesar su solicitud de información sobre el ecosistema CreaTuActivo.com y el modelo de construcción de activos.</li>
                <li><strong>Comunicaciones:</strong> Enviarle información sobre productos, servicios, novedades, recursos educativos y oportunidades del ecosistema.</li>
                <li><strong>Calificación y seguimiento:</strong> Evaluar su nivel de interés y momento óptimo para ofrecerle la mejor asesoría posible.</li>
                <li><strong>Conexión con el equipo:</strong> Facilitar el contacto con consultores especializados cuando usted lo solicite o cuando sea estratégicamente relevante.</li>
                <li><strong>Análisis y mejora:</strong> Realizar análisis estadísticos y estudios de mercado para mejorar nuestros servicios y productos.</li>
                <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y regulatorias aplicables.</li>
              </ul>
            </div>
          </section>

          {/* Derechos del Titular */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              6. Derechos del Titular (Sus Derechos)
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Como Titular de sus datos personales, usted tiene los siguientes derechos fundamentales de acuerdo con el artículo 8 de la Ley 1581 de 2012:</p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Derecho de Acceso (Conocer)</h3>
                    <p>Conocer, consultar y obtener información sobre sus datos personales que se encuentran en nuestras bases de datos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">✏️</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Derecho de Rectificación (Actualizar)</h3>
                    <p>Actualizar y rectificar sus datos personales cuando estos sean inexactos, incompletos o desactualizados.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🗑️</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Derecho de Supresión (Eliminar)</h3>
                    <p>Solicitar la eliminación o supresión de sus datos personales cuando considere que no están siendo tratados conforme a los principios, deberes y obligaciones de la ley.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">⛔</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Derecho de Oposición (Revocar)</h3>
                    <p>Revocar la autorización otorgada para el tratamiento de sus datos personales en cualquier momento, salvo cuando exista un deber legal o contractual que impida la revocatoria.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Derecho a Presentar Quejas</h3>
                    <p>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a lo dispuesto en la Ley 1581 de 2012.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo Ejercer sus Derechos */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              7. Cómo Ejercer sus Derechos
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Usted puede ejercer sus derechos de manera sencilla y gratuita a través de los siguientes canales:</p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
                <h3 className="font-bold text-gray-900 mb-3">💬 A través del Asistente NEXUS (Recomendado)</h3>
                <p className="mb-2">Durante cualquier conversación con NEXUS, puede escribir las siguientes palabras clave:</p>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <code className="text-blue-700">"mis datos"</code> |
                  <code className="text-blue-700"> "privacidad"</code> |
                  <code className="text-blue-700"> "actualizar información"</code> |
                  <code className="text-blue-700"> "eliminar datos"</code>
                </div>
                <p className="mt-2 text-sm">NEXUS le guiará a través de un menú interactivo para gestionar su información.</p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded">
                <h3 className="font-bold text-gray-900 mb-3">📧 Por Correo Electrónico</h3>
                <p>Envíe su solicitud a: <a href="mailto:privacidad@creatuactivo.com" className="text-purple-700 underline font-semibold">privacidad@creatuactivo.com</a></p>
                <p className="text-sm mt-2">Incluya en su solicitud:</p>
                <ul className="list-disc list-inside text-sm ml-4 mt-1">
                  <li>Nombre completo</li>
                  <li>Datos de contacto</li>
                  <li>Descripción clara de su solicitud</li>
                  <li>Copia de su documento de identidad (para verificación)</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                <h3 className="font-bold text-gray-900 mb-3">📱 Por WhatsApp</h3>
                <p>Contáctenos al: <strong className="text-green-700">+57 310 206 6593</strong></p>
                <p className="text-sm mt-2">Horario de atención: Lunes a Viernes, 8:00 AM - 8:00 PM (GMT-5)</p>
              </div>

              <p className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded">
                <strong>📅 Tiempo de respuesta:</strong> Atenderemos su solicitud en un plazo máximo de
                <strong> 15 días hábiles</strong> contados a partir de la fecha de recepción. Si requiere
                información adicional, le notificaremos dentro de los primeros 5 días hábiles.
              </p>
            </div>
          </section>

          {/* Seguridad */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              8. Medidas de Seguridad
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                CreaTuActivo.com ha adoptado medidas técnicas, administrativas y humanas necesarias para
                proteger sus datos personales y evitar su adulteración, pérdida, consulta, uso o acceso no
                autorizado o fraudulento.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">🔒 Cifrado de Datos</h3>
                  <p className="text-sm">Utilizamos cifrado TLS 1.3 para proteger la transmisión de datos y AES-256 para el almacenamiento.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">🛡️ Acceso Restringido</h3>
                  <p className="text-sm">Solo el personal autorizado con necesidad legítima tiene acceso a sus datos personales.</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">📊 Monitoreo Continuo</h3>
                  <p className="text-sm">Supervisamos constantemente nuestros sistemas para detectar y prevenir accesos no autorizados.</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">🔄 Backups Seguros</h3>
                  <p className="text-sm">Realizamos copias de seguridad cifradas para proteger sus datos contra pérdida accidental.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Transferencias */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              9. Transferencia y Transmisión de Datos
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Sus datos personales pueden ser compartidos con terceros únicamente en los siguientes casos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cuando sea necesario para cumplir con las finalidades descritas en esta política.</li>
                <li>Con proveedores de servicios tecnológicos (hosting, bases de datos, servicios de email) que actúan como encargados del tratamiento bajo estrictos acuerdos de confidencialidad.</li>
                <li>Cuando exista una orden judicial o requerimiento de autoridad competente.</li>
                <li>Con su consentimiento expreso para casos específicos no contemplados en esta política.</li>
              </ul>
              <p className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mt-4">
                <strong>Importante:</strong> No vendemos, alquilamos ni comercializamos sus datos personales a terceros con fines de marketing directo sin su consentimiento explícito.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              10. Uso de Cookies y Tecnologías Similares
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestra plataforma,
                personalizar contenido, analizar el tráfico y recordar sus preferencias.
              </p>
              <p>
                Usted puede configurar su navegador para rechazar cookies, aunque esto puede afectar la
                funcionalidad de algunos servicios.
              </p>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Tipos de cookies que usamos:</h3>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                  <li>• <strong>Funcionales:</strong> Recordar sus preferencias y personalizar su experiencia</li>
                  <li>• <strong>Analíticas:</strong> Entender cómo los usuarios interactúan con nuestro sitio</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Retención */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              11. Tiempo de Retención de Datos
            </h2>
            <div className="space-y-3 text-gray-700">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              12. Tratamiento de Datos de Menores de Edad
            </h2>
            <div className="space-y-3 text-gray-700 bg-red-50 border-l-4 border-red-600 p-6 rounded">
              <p className="font-bold text-red-900">
                ⚠️ Nuestros servicios NO están dirigidos a menores de 18 años.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              13. Modificaciones a esta Política
            </h2>
            <div className="space-y-3 text-gray-700">
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
                <li>Mensaje en el asistente NEXUS al inicio de la conversación</li>
              </ul>
              <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
                <strong>Fecha de última actualización:</strong> 19 de octubre de 2025<br/>
                <strong>Versión:</strong> 1.0 (Compliance Ley 1581/2012)
              </p>
            </div>
          </section>

          {/* Autoridad de Control */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              14. Autoridad de Control y Reclamos
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Si considera que sus derechos de protección de datos han sido vulnerados, puede presentar una
                queja o reclamo ante la <strong>Superintendencia de Industria y Comercio de Colombia</strong>,
                autoridad de control en materia de protección de datos personales.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-6 rounded">
                <h3 className="font-bold text-gray-900 mb-3">📍 Datos de Contacto - Superintendencia de Industria y Comercio:</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Sitio web:</strong> <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">www.sic.gov.co</a></p>
                  <p><strong>Dirección:</strong> Carrera 13 No. 27 – 00, pisos 3 y 4, Bogotá D.C., Colombia</p>
                  <p><strong>Línea gratuita nacional:</strong> 01-8000-910165</p>
                  <p><strong>Teléfono en Bogotá:</strong> (601) 587 0000</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              15. Contacto
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Para cualquier consulta, comentario o solicitud relacionada con esta Política de Privacidad
                o el tratamiento de sus datos personales, puede contactarnos a través de:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-2">📧</div>
                  <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                  <a href="mailto:privacidad@creatuactivo.com" className="text-blue-700 underline text-sm">
                    privacidad@creatuactivo.com
                  </a>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
                  <p className="text-gray-700 text-sm font-semibold">+57 310 206 6593</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <h3 className="font-bold text-gray-900 mb-2">Chat NEXUS</h3>
                  <p className="text-gray-700 text-sm">Disponible 24/7 en nuestro sitio web</p>
                </div>
              </div>
            </div>
          </section>

          {/* Aceptación */}
          <section className="border-t-2 border-gray-200 pt-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">✅ Aceptación de esta Política</h2>
              <p className="text-blue-50 mb-4">
                Al utilizar nuestros servicios, proporcionar sus datos personales o continuar navegando en
                nuestro sitio web después de haber sido informado de esta política, usted acepta expresamente
                los términos y condiciones aquí establecidos.
              </p>
              <p className="text-sm text-blue-100">
                Le recomendamos leer esta política periódicamente para estar informado sobre cómo protegemos
                su información personal.
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>© 2025 CreaTuActivo.com - Todos los derechos reservados</p>
          <p className="mt-1">
            Esta política cumple con la <strong>Ley Estatutaria 1581 de 2012</strong> y el
            <strong> Decreto 1377 de 2013</strong> de Colombia
          </p>
        </div>
      </div>
    </div>
  );
}
