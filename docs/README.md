# docs/ — Handoffs e Investigaciones

Documentación de trabajo **interna** (fuera de `public/`, así que **no se sirve en la web**). Se organizó aquí en jul 2026 desde la raíz del repo y desde `public/contexto/handoff` + `public/investigaciones`.

> Los docs **núcleo** (contexto de negocio, branding, storytelling) siguen en la raíz del repo a propósito: `CLAUDE.md`, `README.md`, `BRANDING.md`, `POSICIONAMIENTO.md`, `EPIPHANY_BRIDGE_OFICIAL.md`, `MANIFIESTO_FUNDADORES.md`, `HANDOFF_CONTEXTO_COMPLETO.md`, `HANDOFF_QUESWA_TECNICO.md`.

## Estructura

```
docs/
├── handoff/
│   ├── reels/      → producción de reels y video (pipeline, post-producción, engagement, páginas)
│   ├── queswa/     → chatbot Queswa: léxico, voz, técnico, integraciones (WABA, GanoCafé), bugs
│   └── negocio/    → mensajes 1-a-1, sinergia estratégica
└── investigaciones/
    ├── prompts/     → PROMPT_INVESTIGACION_* (briefs para agentes de investigación)
    └── resultados/  → resultados de investigación (posicionamiento, léxico, tráfico, UX)
```

## Convenciones

- **Handoff** = documento de traspaso para un agente/persona que continúa un subsistema.
- **PROMPT_INVESTIGACION_** = el *brief* que se le da a un agente de IA para investigar (no el resultado).
- **investigaciones/resultados/** = el *output* de esas investigaciones.
- Los enlaces internos hacia código del repo usan ruta relativa `../../../` (desde profundidad 3 hasta la raíz).
