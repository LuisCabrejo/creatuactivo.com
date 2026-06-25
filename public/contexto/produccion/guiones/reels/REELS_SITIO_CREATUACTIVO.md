# Reels del Sitio — creatuactivo.com

Guiones de los reels **incrustados en el sitio web** (no orgánicos de historias, no de
nicho). A diferencia de los reels de documentación (despiertan curiosidad) y los de
nicho (abordan una oportunidad de negocio directa), estos responden con claridad a
quien **ya llegó con la pregunta "¿de qué se trata?"** formada.

- **Voz:** neutra / explainer (no "soy Luis") — la home la alimentan todos los
  arquitectos con su propio `?ref`, así que el video debe ser reutilizable.
- **Léxico:** el activo que se entrega es **la empresa digital** (la corona es de
  CreaTuActivo; Gano Excel es el Respaldo Operativo, el músculo que carga el peso); produce
  **ingresos recurrentes** · la meta aspiracional es la **tranquilidad financiera** (NO
  "patrimonio" — el latino ya cree tenerlo) · usted dirige, el sistema hace el trabajo.
- **Diagnóstico = el CICLO DEL PRESENTE** (recalibrado jun 2026 al latino): el villano NO es
  el miedo a la ausencia / "cuando usted no esté" (eso es la cabeza del americano) — es el
  agobio de HOY: hoy ni el empleo da estabilidad ni hacer empresa es seguro, y la vida se
  resume en el ciclo «trabajar, pagar cuentas y repetir». El villano es **activo**: un sistema
  diseñado «para tomar sus mejores años y salud, no para darle tranquilidad financiera». No
  culpa al héroe (no es error suyo) ni ataca el empleo. Ver [[feedback_latino_presente_no_futuro]]
  + [[feedback_aspiracion_tranquilidad_financiera]].
- **Distinto de** `REELS_DIARIOS_DOCUMENTACION.md` y `REELS_NICHOS_DOCUMENTACION.md`.

---

## HOME · Encabezado — Explainer "¿De qué se trata?"
*Evergreen · voz neutra · ~110s · hero de la home (HomeManifestoVideo)*

**Conducto:** historia orgánica (reel de documentación) + enlace
`creatuactivo.com?ref=…` → la persona llega a la home con la pregunta ya formada.
El video explica; Queswa (ahí mismo en la página) profundiza.

Si llegó hasta aquí, es porque quiere entender de qué se trata. Se lo explico en un minuto.

Casi todos compartimos el mismo problema financiero: hoy ni el empleo garantiza estabilidad, ni hacer empresa es el camino seguro. Al final, la vida de la mayoría se resume en lo mismo — trabajar, pagar cuentas y repetir. Y no es un error suyo: es la consecuencia matemática de un sistema diseñado para tomar sus mejores años y su salud, no para darle seguridad financiera.

CreaTuActivo invierte ese ciclo con apalancamiento: usted pasa a ser propietario de una empresa digital que sí puede darle esa seguridad.

¿Y qué es, en palabras simples, una empresa digital? Diferenciemos. Una empresa de toda la vida necesita local, empleados, y si usted se aleja un poco, empieza a tambalear. Una empresa digital, en cambio, vive en internet y produce aunque usted duerma. Piense en Amazon o MercadoLibre: no fabrican lo que venden — son el puente que conecta a millones y gana por cada transacción, de forma automática.

¿Y cómo se construye una empresa digital así? Usted tiene dos caminos. Con sus propias manos, desde cero: el desarrollo tecnológico, los proveedores, la logística, los permisos en cada país, y asumir los riesgos de cualquier proyecto empresarial. O tomarla ya construida y poder empezar de inmediato. Eso es lo que le entregamos: una empresa digital lista, sobre tres pilares.

El primero, el músculo: Gano Excel, una corporación con más de 30 años y presencia en 70 países que hace por usted todo el trabajo pesado — fabrica, sostiene el inventario, responde por lo legal y despacha en cada país. No es una promesa de internet; es músculo real.

El segundo, Queswa: la aplicación desde la que usted dirige todo, en su celular. Desde ahí usted comparte con un clic y ve en tiempo real quién visita la información. Del resto se encarga Queswa: atiende y madura en cada interesado la decisión de avanzar — las 24 horas. Es su oficina digital completa.

Y el tercero, un método ya probado que le marca los pasos exactos. No necesita experiencia digital. ¿Su rol? El de dueño: usted dirige, la tecnología hace el trabajo. Y cada vez que el consumo se repite en los hogares de su organización, usted recibe una parte, una y otra vez, de forma continua. Una empresa que crece sin techo y le da seguridad financiera.

¿Quiere entenderlo a fondo? Aquí mismo, pregúntele a Queswa lo que quiera — se lo explica mejor que nadie.

---

### Notas de calibración (HOME)

- **Arco completo (23 jun 2026):** ahora incluye **¿qué es una empresa digital?** (puente
  Amazon/MercadoLibre → "gana por cada transacción") + **dos caminos** (desde cero vs. ya
  construida) + **los 3 pilares** — sincronizado con la servilleta Slide 1+2 y el reel Día 10
  "El puente". Antes saltaba del enunciado "empresa digital" directo a los pilares (hueco
  cerrado). "operación" → **"transacción"** (dibuja dinero en movimiento); "equipo de
  ingenieros" **retirado** del camino "desde cero" (contradecía el Día 11: la IA ya lo hace)
  → "asumir los riesgos de cualquier proyecto empresarial".
- **Gano Excel nombrado:** el guion nombra a **Gano Excel** como el respaldo (la audiencia
  orgánica ya asocia a Luis con Gano) + **"30 años · 70 países"** como prueba de autoridad
  (no es empresa fantasma). La corona sigue siendo de CreaTuActivo (lo digital); Gano Excel
  es el **músculo real** que carga el peso — nunca el titular del ingreso.
- **Un solo CTA:** Queswa (el orbe está en la misma página). "Suscríbete" vive aparte, en el
  menú — no compite dentro del reel.
- **Implementación:** hero de la home vía [`HomeManifestoVideo`](src/components/HomeManifestoVideo.tsx)
  en [src/app/page.tsx](src/app/page.tsx). ⚠️ **El video desplegado tiene el arco viejo** (cláusula
  Gano-titular + sin puente) → este guión exige **re-producción** del reel home antes de calzar.

---

*Próximos reels del sitio: agregar debajo (ej. servilleta, paquetes, auditoría).*
