# v3 — Opus 5.5 redacta (comparación de modelos, 5 nov 2026)

Mismo código que v1. Lo único distinto: el servidor de ensayo arranca con
`QUESWA_MODELO_PRUEBA=claude-opus-5-5` (esfuerzo `low`, razonamiento adaptativo,
`max_tokens` + 4.000 de margen). Ver `src/lib/modelo-redaccion.ts`.
Siguen en Sonnet 4.6: la envoltura de los candados, la radicación, los avisos y el
supervisor (apagado). Las consultas simples siguen en Haiku 4.5.
Pregunta: ¿los 9 casos que fallan son del modelo o de las instrucciones?
