# docs/ — Handoffs e Investigaciones

Documentación de trabajo **interna** (fuera de `public/`, así que **no se sirve en la web**). Se organizó aquí en jul 2026 desde la raíz del repo y desde `public/contexto/handoff` + `public/investigaciones`.

> Los docs **núcleo** (contexto de negocio, branding, storytelling) siguen en la raíz del repo a propósito: `CLAUDE.md`, `README.md`, `BRANDING.md`, `POSICIONAMIENTO.md`, `EPIPHANY_BRIDGE_OFICIAL.md`, `MANIFIESTO_FUNDADORES.md`, `HANDOFF_CONTEXTO_COMPLETO.md`, `HANDOFF_QUESWA_TECNICO.md`.

## Estructura

```
docs/
├── SERVILLETA.md   → arquitectura del deck /servilleta (y de su copia /12-niveles)
├── handoff/
│   ├── reels/      → producción de reels y video (pipeline, post-producción, engagement, páginas)
│   ├── queswa/     → chatbot Queswa: léxico, voz, técnico, integraciones (WABA, GanoCafé), bugs
│   └── negocio/    → estrategia de contenido y voz, mensajes 1-a-1, sinergia estratégica
└── investigaciones/
    ├── prompts/     → PROMPT_INVESTIGACION_* (briefs para agentes de investigación)
    └── resultados/  → resultados de investigación (posicionamiento, léxico, tráfico, UX)
```

## Extraídos de CLAUDE.md (4 ago 2026)

CLAUDE.md se carga entero en cada sesión, así que lo que es **referencia** (se consulta) se movió aquí y allá quedó solo el **puntero + las reglas que rompen producción**:

| Documento | Qué contiene |
|---|---|
| [SERVILLETA.md](SERVILLETA.md) | Deck de 4 slides: arquitectura mobile, b-rolls 3D, beat del colapso, comandos de re-render, reglas de iconos |
| [handoff/reels/VIDEO_Y_ANIMACIONES.md](handoff/reels/VIDEO_Y_ANIMACIONES.md) | Flujo de video estándar, color grade DaVinci (Naval/Dan Koe), animaciones Canvas de `src/app/animaciones/` |
| [handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md](handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md) | Two-Pronged (tráfico vs conversión), voz de Queswa en 3 niveles, mapa y estado de la migración léxica, doctrina del copy, historia del fundador |
| [../scripts/dankoe-video/PIPELINE.md](../scripts/dankoe-video/PIPELINE.md) | Post-producción de reels (extraído jul 2026) + patrón "PROPIO" con keyword |
| [../BRANDING.md](../BRANDING.md) | Design System completo + tablas de léxico aprobado/prohibido (§7) |

## Convenciones

- **Handoff** = documento de traspaso para un agente/persona que continúa un subsistema.
- **PROMPT_INVESTIGACION_** = el *brief* que se le da a un agente de IA para investigar (no el resultado).
- **investigaciones/resultados/** = el *output* de esas investigaciones.
- Los enlaces internos hacia código del repo usan ruta relativa `../../../` (desde profundidad 3 hasta la raíz).
