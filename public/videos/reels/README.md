# Reels por Nicho — Fase Orgánica (WhatsApp)

5 reels verticales 9:16, uno por nicho. Cada uno alimenta una página
`creatuactivo.com/{slug-arquitecto}/reel/{nicho}` con CTA → presentación servilleta
(YouTube unlisted xHWZfg6prs8) + WhatsApp del arquitecto.

## Archivos (.mp4 en esta carpeta)
| Archivo            | Nicho (Reel)                | Slug ruta     | Audiencia                          |
|--------------------|-----------------------------|---------------|------------------------------------|
| `corporativo.mp4`  | A — Devaluación Corporativa | `corporativo` | Empleado corporativo / ejecutivo   |
| `empleados.mp4`    | B — Ilusión de Estabilidad  | `empleados`   | Empleado del Estado / sector público |
| `empresarios.mp4`  | C — Prisión Operativa       | `empresarios` | Empresario / dueño de negocio      |
| `diaspora.mp4`     | D — Trampa de la Diáspora   | `diaspora`    | Latinos en el exterior             |
| `informales.mp4`   | E — Economía Popular        | `informales`  | Trabajador independiente / informal |

Copy de cada página: ver `COPY_PAGINAS.md`.

## Hosting
- `*.mp4` aquí están **gitignored** (no se commitean).
- Fase actual: subir a **Vercel Blob** (`node scripts/upload-to-blob.mjs`) → URL al env/página.
- Fase escala: migrar a **Bunny Stream** cuando el egress lo justifique.
- Servilleta (7 min, 1.3 GB) NO va aquí → YouTube unlisted `xHWZfg6prs8`.
