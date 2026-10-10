/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La explicación en texto de /servilleta (8 oct 2026, Director). Reescrita el
 * 10 oct 2026 para la presentación ÚNICA (la columna de /presentacion, mudada
 * aquí): de «las cuatro pantallas» a lo que cuentan las diez, con el encuadre de
 * los tres elementos de WHY_02 v6.69 (fabricante · tecnología que atiende ·
 * saber qué hacer, en una sola aplicación).
 *
 * POR QUÉ EXISTE. Hasta este día Google sabía de qué trataba /servilleta solo por
 * sus metadatos: el cuerpo tenía unas 260 palabras, no decía «servilleta» ni una
 * vez y la página no tenía <h1> desde el 16 jun 2026 (commit 451f59c). Con eso se
 * sostenía en el puesto 6–7 de «plan servilleta gano excel», detrás de cinco
 * resultados que ni siquiera explican el plan. El deck sigue siendo la pieza del
 * 1-a-1; esta sección es lo que Google, y su respuesta de IA, tienen para leer.
 * Investigación completa: reports/Plan servilleta top 3 Google.md
 *
 * ⚠️ AQUÍ VIVE EL ÚNICO <h1> DE LA PÁGINA. El deck no usa IndustrialHeader y sus
 * portadas son <h2>; si alguien vuelve a poner un <h1> en una diapositiva, la
 * página queda con dos.
 *
 * ⚠️ CUMPLIMIENTO, que es la razón de cada frase:
 *  · Nunca «oficial»: la línea de distribuidores independientes va pegada al H1,
 *    porque Gano Excel Colombia usa el mismo nombre para su presentación.
 *  · Sin cifras de comisión y sin precios: los precios viven en /paquetes y las
 *    cifras en el simulador, que lleva aquí su nota («un ejemplo del cálculo, no un
 *    ingreso esperado»). En el panel del simulador NO va nota: el Director retiró
 *    esa letra pequeña el 2 ago 2026 porque competía con la cifra.
 *  · El GEN5 se cuenta en COMPRAS de paquetes, nunca en personas, y lleva la
 *    cláusula del Kit («si usted inicia con un paquete empresarial»): el Kit no
 *    tiene GEN5.
 *  · Las formas de ganar no se numeran: el plan tiene doce.
 *  · Sin pregunta de «¿es legal?»: nombrar la duda la siembra en quien no la traía.
 *
 * Se oculta en pantalla completa y en el modo kiosco (el iframe del modo vertical):
 * ahí la página es solo el deck que se presenta.
 */

'use client';

import { abrirConversacionQueswa, leerRefSocio } from '@/lib/orbe-config';

// Se cambia SOLO cuando la página cambia de verdad. Poner la fecha al día sin
// cambios reales es, para Google, una señal de contenido hecho para buscadores.
const ACTUALIZADA = { iso: '2026-10-10', texto: 'octubre de 2026' };

const FORMAS_DE_EMPEZAR = [
  { nombre: 'ESP-3 Visionario', detalle: '35 productos · Binario 17 % por 6 meses · Bono GEN5 activo' },
  { nombre: 'ESP-2 Empresarial', detalle: '18 productos · Binario 16 % por 4 meses · Bono GEN5 activo' },
  { nombre: 'ESP-1 Inicial', detalle: '7 productos · Binario 15 % por 2 meses · Bono GEN5 activo' },
  { nombre: 'Kit de Inicio', detalle: '4 cajas de producto · su código y su sistema abiertos desde el primer día' },
];

const CSS = `
  .guia-servilleta {
    position: relative;
    background: var(--color-bg-primary);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--color-text-body);
    font-family: var(--font-sans);
    padding: 88px 16px 112px;
  }
  .kiosk .guia-servilleta, :fullscreen .guia-servilleta { display: none; }
  .guia-servilleta .guia-wrap { max-width: 720px; margin: 0 auto; }
  .guia-servilleta h1 {
    font-family: var(--font-serif); font-weight: 600;
    font-size: clamp(1.9rem, 5vw, 2.8rem); line-height: 1.15;
    color: #FFFFFF; margin: 0 0 18px;
  }
  .guia-servilleta .guia-firma {
    font-size: 0.95rem; line-height: 1.6; color: var(--color-text-muted);
    margin: 0 0 56px; padding-left: 14px;
    border-left: 2px solid rgba(197, 160, 89, 0.5);
  }
  .guia-servilleta h2 {
    font-family: var(--font-serif); font-weight: 600;
    font-size: clamp(1.45rem, 3.6vw, 1.9rem); line-height: 1.25;
    color: var(--color-text-primary); margin: 56px 0 16px;
  }
  .guia-servilleta h3 {
    font-family: var(--font-sans); font-weight: 600;
    font-size: 1.08rem; line-height: 1.4;
    color: var(--color-text-primary); margin: 30px 0 8px;
  }
  .guia-servilleta p { font-size: 1.05rem; line-height: 1.72; margin: 0 0 16px; }
  .guia-servilleta ul { list-style: none; padding: 0; margin: 0 0 18px; }
  .guia-servilleta li {
    position: relative; padding-left: 22px; margin: 0 0 12px;
    font-size: 1.05rem; line-height: 1.65;
  }
  .guia-servilleta li::before {
    content: ''; position: absolute; left: 2px; top: 0.72em;
    width: 7px; height: 7px; background: var(--color-brand);
  }
  .guia-servilleta strong { color: var(--color-text-primary); font-weight: 600; }
  .guia-servilleta a { color: var(--color-brand); text-underline-offset: 4px; }
  .guia-servilleta a:hover { color: var(--color-brand-hover); }
  .guia-servilleta .guia-faq { border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 4px; }
  .guia-servilleta .guia-cta { margin-top: 28px; }
`;

export default function GuiaPlanServilleta() {
  return (
    <section className="guia-servilleta" aria-labelledby="guia-servilleta-titulo">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="guia-wrap">
        <h1 id="guia-servilleta-titulo">
          Plan servilleta de Gano Excel: la presentación del negocio, paso a paso
        </h1>
        <p className="guia-firma">
          Preparada por CreaTuActivo, un equipo de distribuidores independientes de Gano Excel. La
          presentación corporativa la publica Gano Excel en sus propios canales. Actualizada:{' '}
          <time dateTime={ACTUALIZADA.iso}>{ACTUALIZADA.texto}</time>.
        </p>

        <h2>Qué es el plan servilleta</h2>
        <p>
          Plan servilleta es el nombre de la forma más corta de explicar un negocio de distribución:
          en pocos minutos, sobre lo que haya a mano (muchas veces una servilleta), se dibuja quién
          fabrica, cómo llega el producto al cliente y cómo se gana. El formato lo popularizó Don
          Failla con sus presentaciones en servilleta, y en Colombia Gano Excel usa ese mismo nombre
          para su presentación de negocio.
        </p>
        <p>
          Esta versión lo cuenta en las diez pantallas de arriba, de la idea que la mueve a los
          números, y trae dos simuladores para hacer las cuentas.
        </p>

        <h2>Lo que cuenta la presentación servilleta</h2>

        <h3>1. El problema</h3>
        <p>
          Usted trabaja el mes entero, pero al día siguiente de que le entra la plata, ese dinero ya
          tiene dueño: el banco, las cuotas, los recibos. Es un ciclo de trabajar, pagar cuentas y
          repetir, y le pasa exactamente igual al que gana dos millones y al que gana más de veinte.
        </p>
        <p>
          La presentación lo pone en cifras: 9 de cada 10 hogares colombianos dicen que su ingreso no
          alcanza o alcanza solo para lo mínimo (DANE, Encuesta de Calidad de Vida 2025); el 54,6 % de
          las personas que trabajan lo hacen en la informalidad (DANE, mayo a julio de 2026), y 3 de
          cada 4 colombianos en edad de pensionarse no reciben una pensión (Colpensiones y Universidad
          Javeriana, 2022).
        </p>

        <h3>2. La oportunidad</h3>
        <p>
          Muchas industrias se modernizaron frente a nuestros ojos: los domicilios pasaron a Rappi,
          los taxis a Uber y la fila del banco a Nequi. La presentación ve esa misma oportunidad en dos
          sectores: la industria del network marketing y el sector laboral.
        </p>

        <h3>3. Los tres elementos</h3>
        <p>
          Montar una empresa de distribución moderna requiere tres elementos, y aquí cada uno tiene
          quien lo haga:
        </p>
        <ul>
          <li>
            <strong>Un fabricante:</strong> Gano Excel fabrica, empaca y despacha cada pedido hasta la
            casa del cliente.
          </li>
          <li>
            <strong>Una tecnología que atiende:</strong> Queswa, la inteligencia artificial de
            CreaTuActivo, conversa con cada interesado, le resuelve las dudas y madura su decisión de
            avanzar, a toda hora.
          </li>
          <li>
            <strong>Saber qué hacer:</strong> como en Waze, usted le dice a Queswa a dónde quiere
            llegar, y ella le va marcando la ruta, paso a paso.
          </li>
        </ul>
        <p>
          Los tres llegan armados en una sola aplicación, Queswa.app. Y cada cliente que llega a su
          empresa queda a su nombre.
        </p>

        <h3>4. Qué hace usted</h3>
        <p>
          Su día a día se resume en dos acciones: compartir su enlace con quien quiera y recibir a quien
          llega con interés. Entre las dos está Queswa, que conversa con cada persona y le avisa cuando
          alguien está listo. Solo se multiplica lo que es sencillo: quien inicia con usted hace
          exactamente lo mismo, con las mismas dos acciones.
        </p>

        <h3>5. El producto</h3>
        <p>
          Café, bebidas y suplementos con Ganoderma, y una línea de cuidado personal: 22 productos
          premium de bienestar en cuatro líneas. El cliente los incorpora a su rutina, nota la
          diferencia y vuelve a pedir, y esa recompra es la que mueve el negocio.
        </p>

        <h3>6. Los números</h3>
        <p>
          La pantalla de los números muestra las dos formas de ganar con las que se comienza, cada una
          con su simulador. Aquí abajo va cada una con su nombre en el plan.
        </p>

        <h2>Cómo se gana en el plan de compensación de Gano Excel</h2>
        <p>
          Todo lo que paga el plan sale del producto que se mueve por su sistema de distribución. El
          plan tiene doce formas de ganar, y al comenzar se explican dos, cada una por lo que la
          mueve.
        </p>

        <h3>Bono Binario: el consumo que se repite</h3>
        <p>
          Sale de las compras que se repiten en su red de clientes y distribuidores, y crece por
          acumulación: cada pedido se suma al volumen que ya venía. El sistema empareja los puntos de
          su canal izquierdo con los de su canal derecho y paga un porcentaje sobre lo emparejado.
          Por ejemplo, con 1.000 puntos en el canal izquierdo y 5.000 en el derecho, se emparejan
          1.000 de cada canal, y los 4.000 que sobran se guardan para el ciclo siguiente.
        </p>
        <p>
          La base es el 10 %. Con el paquete Visionario (ESP-3) el Binario arranca en el 17 % durante
          seis meses, y después el sistema aplica el más alto entre la base, su rango y las
          promociones de Gano Excel. El porcentaje corre sobre el GCV, la suma del volumen comisional
          (CV) que Gano Excel le asigna a cada producto, que es distinto del precio de venta.
        </p>

        <h3>Bono GEN5: la compra de paquetes empresariales</h3>
        <p>
          Si usted inicia con un paquete empresarial, cada vez que se compra uno en su sistema de
          distribución Gano Excel le paga una comisión directa, hasta la quinta generación. El monto
          lo fija el menor entre el tope de su propio paquete y lo que genera el paquete que se
          compró.
        </p>
        <p>Gano Excel liquida cada viernes, por ciclos semanales.</p>

        <h2>Las formas de empezar</h2>
        <p>Son cuatro, y en las cuatro lo que se paga se convierte en producto:</p>
        <ul>
          {FORMAS_DE_EMPEZAR.map((f) => (
            <li key={f.nombre}>
              <strong>{f.nombre}:</strong> {f.detalle}
            </li>
          ))}
        </ul>
        <p>
          Los precios en pesos colombianos están en <a href="/paquetes">la página de paquetes</a>;
          para otro país, Queswa se los da en su moneda.
        </p>

        <h2>Cómo leer los simuladores</h2>
        <p>
          Los dos simuladores de la pantalla de los números aplican las tablas del plan. El primero
          proyecta el Bono Binario nivel por nivel, en la estrategia de los 12 niveles, con el
          porcentaje de la forma de empezar que usted elija. El segundo calcula el Bono GEN5 por los
          paquetes empresariales que se compran en su sistema. Las cifras son un ejemplo del cálculo
          del plan, no un ingreso esperado ni garantizado: lo que cada quien gana depende de las
          compras que de verdad ocurren en su sistema de distribución.
        </p>

        <h2>Si usted ya es distribuidor: cómo presentar el plan servilleta</h2>
        <p>
          Esta presentación está hecha para una conversación uno a uno. Avanza con un clic, con las
          flechas del teclado o deslizando el dedo, y la tecla F la pone en pantalla completa.
          Algunas pantallas avanzan por partes, una idea por clic; el resto lo pone quien presenta.
          Si la comparte con su enlace, la última pantalla muestra su nombre y su WhatsApp.
        </p>

        <div className="guia-faq">
          <h2>Preguntas frecuentes</h2>

          <h3>¿Es la presentación oficial de Gano Excel?</h3>
          <p>
            No. Es la versión de CreaTuActivo, un equipo de distribuidores independientes. La
            presentación corporativa la publica Gano Excel en sus propios canales.
          </p>

          <h3>¿Qué tipo de empresa es Gano Excel?</h3>
          <p>
            Es la empresa que fabrica, empaca y despacha los productos, y la que liquida las
            comisiones. Tiene 30 años y presencia en más de 60 países.
          </p>

          <h3>¿En qué países está Gano Excel?</h3>
          <p>En más de 60. El catálogo y los precios cambian de un país a otro.</p>

          <h3>¿Puedo preguntar algo que no esté aquí?</h3>
          <p>Sí. Queswa responde a cualquier hora por WhatsApp.</p>
          {/* Abre WhatsApp directo, sin el evento `open-queswa`. En /servilleta ese
              evento abre el chat WEB a propósito (RUTAS_ORBE_QUESWA_WEB): el botón
              «PREGÚNTALE ALGO EN VIVO» es la demo que el socio hace delante del
              prospecto, sin sacarlo de la presentación. Quien llega a esta sección
              lee solo, desde Google, y va al canal principal: WhatsApp. */}
          <button
            type="button"
            className="cta-base cta-primary guia-cta"
            onClick={() => abrirConversacionQueswa(leerRefSocio(), 'general')}
          >
            Preguntarle a Queswa →
          </button>
        </div>
      </div>
    </section>
  );
}
