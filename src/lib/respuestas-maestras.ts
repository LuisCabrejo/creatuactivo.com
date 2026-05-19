/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Respuestas Master del Director Académico de Élite — Camino A (Backend Dictador).
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARQUITECTURA                                                                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Las 2 chips canónicas que aquí se sirven concentran el ~80% del tráfico inicial:
 *   • Chip 1 ("Quiero entender la lógica…") → WHY_02 verbatim
 *   • Chip 2 ("¿Cuál es la metodología operativa…") → EAM_01 verbatim
 *
 * Servirlas verbatim desde el backend, antes del Voyage AI + Anthropic, garantiza:
 *   ✓ 100% de fidelidad al copy calibrado (sin paráfrasis del LLM)
 *   ✓ $0 en tokens de Anthropic para esas queries
 *   ✓ Latencia ~50ms vs ~2s del LLM
 *
 * El tercer texto Master (WHY_01 "¿Qué es CreaTuActivo?") NO se sirve aquí porque
 * no es chip — entra por queries naturales y se entrega via RAG con marcador
 * <verbatim_lock> en arsenal_inicial.txt (Camino B, sin bypass del LLM).
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SINCRONIZACIÓN — REGLA INVIOLABLE                                           │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Los textos aquí son réplica EXACTA de los bloques entre <verbatim_lock> en
 * `knowledge_base/arsenal_inicial.txt` v25.7:
 *   • Chip 1 → WHY_02 (BLOQUE 1)
 *   • Chip 2 → EAM_01 (BLOQUE 8)
 *
 * Si edita el arsenal, sincronice aquí. Si edita aquí, sincronice el arsenal.
 * La doctrina viva es el arsenal; este archivo es el caché operativo del backend.
 *
 * Última calibración: 18 May 2026 — Master v6.0 + v5.1 del Director Académico
 * con 8 correcciones léxicas contra Glosario v1.4 + canon v26.6.
 */

/**
 * Texto Master WHY_02 — Chip 1 ("Quiero entender la lógica…").
 * Sincronizado con arsenal_inicial.txt v25.8 BLOQUE 1.
 */
const MASTER_WHY_02 = `Para entender la mecánica de funcionamiento, primero debemos diagnosticar una inconsistencia en su economía actual: usted trabaja duro y gana bien, pero si decide detenerse por salud, por un imprevisto, o si simplemente quiere tomar 60 días de vacaciones reales, su flujo de dinero se detiene de inmediato. Eso no es éxito financiero; es una arquitectura financiera con un punto ciego de alto costo.

CreaTuActivo.com corrige este Déficit Estructural de Ingresos entregándole el control de una Base Operativa autónoma. Su funcionamiento no depende de su trabajo físico; se ejecuta mediante la sincronización de tres pilares de alto rendimiento que asumen el 90% de la fricción operativa por usted:

- **La Matriz Física (Capa Logística):** Gano Excel asume el 100% de la fricción operativa y los pasivos —fábricas, inventarios, aduanas, soporte presencial y despachos— en 70 países. Usted no financia, no gestiona variables logísticas y no asume riesgos de infraestructura.

- **El Centro de Mando (Capa Tecnológica):** Queswa.app (conmigo), mi entorno impulsado por Inteligencia Artificial. Me encargo de automatizar la prospección, el filtrado y la pre-calificación de perfiles las 24 horas, asumiendo el desgaste de buscar y explicar por usted.

- **La Metodología Automatizada (El Tridente EAM):** El protocolo de ejecución estandarizado (Comando Expandir · Comando Activar · Comando Maestría) que le entrega las coordenadas exactas de dirección para expandir su activo sin improvisaciones ni persecución manual.

Su rol es estrictamente de Dirección Ejecutiva: usted no opera la maquinaria, la dirige. Al asumir este control, el sistema monetiza un hábito biológico que el mercado no abandona: el consumo diario de café y suplementos premium. Esto consolida una Estructura Patrimonial que genera ingresos recurrentes liquidados en ciclo semanal por Gano Excel, integrándose a su dinámica profesional actual sin sumar carga a su agenda.

¿Su prioridad en este momento es auditar la secuencia operativa de cómo se expande su Base, o prefiere que simulemos en su Dashboard la matemática de los ingresos recurrentes que produce esta estructura?`;

/**
 * Texto Master EAM_01 — Chip 2 ("¿Cuál es la metodología operativa…").
 * Sincronizado con arsenal_inicial.txt v25.8 BLOQUE 8.
 */
const MASTER_EAM_01 = `Nuestra metodología elimina el mayor temor de cualquier profesional o empresario al iniciar un proyecto: la incertidumbre de tener que improvisar el camino o el riesgo de no saber exactamente cómo ejecutar. Su día a día se rige por el Tridente EAM, un protocolo de dirección estandarizado que erradica el ensayo y error por completo.

Su agenda diaria no requiere que usted aprenda a vender de forma tradicional, ni que persiga conocidos; eso está fuera de nuestro diseño. Su labor consiste únicamente en desplegar información técnica pre-estructurada desde su terminal móvil.

Una vez que un perfil ingresa al ecosistema, yo —como su Centro de Mando automatizado— asumo la carga técnica, la educación y el filtrado analítico. Su labor de seguimiento no es para convencer a curiosos, sino para ejecutar el Protocolo de Validación sobre los candidatos que yo ya he pre-calificado y que están listos para iniciar. Usted no convence; usted audita y autoriza.

Todo este engranaje se monitorea de forma visual desde su aplicación queswa.app.

¿Su prioridad en este momento es auditar los tres Comandos canónicos del Tridente, o prefiere que simulemos la matemática de los ingresos recurrentes que produce esta arquitectura?`;

/**
 * Mapa chip-text-lowercase → respuesta Master verbatim.
 * Las keys son las versiones lowercase de `QUESWA_QUICK_REPLIES` en queswa-greeting.ts.
 */
const RESPUESTAS_MAESTRAS_CHIP: Record<string, string> = {
  'quiero entender la lógica: ¿cómo funciona esta estructura patrimonial?': MASTER_WHY_02,
  '¿cuál es la metodología operativa? ¿qué hago yo en el día a día?': MASTER_EAM_01,
};

/**
 * Devuelve el texto Master verbatim si el mensaje del usuario coincide exactamente
 * con un chip-trigger canónico (Chip 1 o Chip 2). Devuelve null en caso contrario.
 *
 * El match es estricto sobre `trim().toLowerCase()` — sin similitud semántica.
 * Para queries naturales que coincidan semánticamente con WHY_02 o EAM_01, el
 * delivery va por RAG con <verbatim_lock> (Camino B), no por esta función.
 *
 * @param userMessage - Mensaje crudo del usuario (puede tener whitespace o casing variable)
 * @returns Texto verbatim de la respuesta Master, o null si no es chip-trigger
 */
export function getRespuestaMaestra(userMessage: string): string | null {
  if (!userMessage || typeof userMessage !== 'string') return null;
  const key = userMessage.trim().toLowerCase();
  return RESPUESTAS_MAESTRAS_CHIP[key] || null;
}

/**
 * Construye un ReadableStream que emite el texto verbatim simulando streaming natural.
 * Cada chunk lleva ~3 palabras + whitespace; ~15ms entre chunks → ~3s total para 250 palabras.
 *
 * Compatible con `StreamingTextResponse` del paquete `ai`.
 */
export function buildVerbatimStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const chunks = text.split(/(\s+)/); // preserva whitespace como chunks separados

  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < chunks.length; i++) {
        controller.enqueue(encoder.encode(chunks[i]));
        // Throttle cada 3 chunks para feel humano sin latencia excesiva
        if (i % 3 === 0 && i > 0) {
          await new Promise((r) => setTimeout(r, 12));
        }
      }
      controller.close();
    },
  });
}
