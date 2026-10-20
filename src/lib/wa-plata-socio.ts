/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados. Software propietario y confidencial.
 *
 * 2.227 — «¿Con cuánta plata se arranca?», cuando la pregunta llega al SOCIO
 * (20 oct 2026).
 *
 * El video del día 43 preguntó en voz alta «¿a qué horas y con qué plata?», y a
 * los socios se lo preguntan los suyos. Hasta hoy el modelo le reenviaba al
 * socio la tabla de `FREQ_03`, escrita para el prospecto. Ahora recibe lo que
 * ÉL puede responder, en su voz y en burbuja aparte para copiarlo. Texto
 * aprobado por el Director; el mismo se le entregó al agente del Dashboard.
 *
 * ⚠️ Dos decisiones del Director que no se «corrigen»:
 *  · Va «dinero» y no «plata»: el texto se lee en dieciséis países.
 *  · No nombra la compra mensual: en este modelo se da por sentada.
 *
 * El orden es el de `FREQ_03`: el Visionario como anclaje y el Kit como la forma
 * de empezar ya. El enlace no va adentro: se ofrece, y sale cuando la persona
 * diga que sí.
 */

import { precioKit, precioVisionario, type PaisConductor } from './queswa-conductor';

/** Lo que el socio le responde a quien le pregunta con cuánta plata se arranca. */
export function respuestaPlataParaElSocio(pais: PaisConductor): string {
  return [
    'Se lo puede responder así:',
    '',
    '---',
    `El paquete más completo, el ESP-3, vale ${precioVisionario(pais)}, y se puede arrancar desde ${precioKit(pais)} con el Kit de Inicio. Ese dinero no se va en montar una empresa: el fabricante despacha cada pedido y la tecnología no tiene costo, así que lo que uno paga se convierte en producto. ¿Le mando el enlace para que Queswa le muestre las cuatro formas de empezar?`,
    '---',
  ].join('\n');
}
