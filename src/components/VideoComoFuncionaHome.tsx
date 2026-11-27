'use client'
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * El video «Cómo funciona» en el hero de la Home (Director, 1 oct 2026).
 *
 * Es el mismo corte que Queswa manda en WhatsApp al tocar «Cómo funciona»
 * (VIDEO_COMO_FUNCIONA_WA, 63 s, 720×1280): la web y el canal cuentan lo mismo,
 * con la misma voz. Responde la pregunta del 70 % —¿cómo funciona?— y trae los
 * subtítulos quemados, así que se entiende aun sin sonido.
 *
 * ⚠️ NO arranca solo, a propósito. Pesa 10,7 MB y buena parte de quien llega
 * navega con datos del celular: hasta que la persona toca, solo se carga la
 * portada (una imagen optimizada). Al tocar, el video se monta, suena con voz y
 * trae controles. El componente anterior (HomeManifestoVideo) arrancaba en
 * silencio y descargaba el video a todo el que entraba.
 *
 * La portada es el cuadro de «Tres piezas que ya existen» de la v8 (27 nov 2026),
 * sin subtítulo encima (public/images/home/como-funciona-portada-v2.jpg). Si el
 * video se vuelve a cortar, se saca la portada del corte nuevo, con nombre nuevo.
 */
import VideoHome from '@/components/VideoHome'
import { VIDEO_COMO_FUNCIONA_WA } from '@/lib/reels'

// El reproductor es el de VideoHome (27 nov 2026): el mismo que usa «Cómo entra el
// dinero» más abajo en la Home. Al terminar, en el computador abre el chat de Queswa.
export default function VideoComoFuncionaHome() {
  return (
    <VideoHome
      id="como-funciona"
      src={VIDEO_COMO_FUNCIONA_WA}
      portada="/images/home/como-funciona-portada-v2.jpg"
      rotulo="Cómo funciona · 60 segundos"
      etiqueta="Reproducir el video «Cómo funciona», 60 segundos"
      // La portada NO es decorativa: es el contenido principal del hero y, por su
      // tamaño, el elemento más grande de la primera pantalla.
      prioridad
    />
  )
}
