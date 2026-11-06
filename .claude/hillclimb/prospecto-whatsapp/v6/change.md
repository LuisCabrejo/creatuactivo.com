# v6 — dos ajustes sobre v5 (5 nov 2026), corrida parcial de 8 casos

1. `route.ts`: la oferta cuenta como compuesta solo si no está literal en el arsenal Y el
   turno anterior lo redactó el modelo (`search_method`). En v5 la regla tomaba por
   compuestas las ofertas del código («¿Le detallo exactamente qué productos trae el
   paquete Visionario?»).
2. `ficha-producto.ts`: `productosNombrados` parte en tramos el renglón que nombra dos
   productos. BEB_DIF_01 los nombra de a dos, y el pin de «¿y qué beneficios tiene cada
   uno?» se quedaba vacío (beneficios-cada-uno 2/3 → 0/3 en v5).
