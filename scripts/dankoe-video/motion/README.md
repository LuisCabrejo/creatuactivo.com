# Motion graphics de marca (Remotion)

Inserts animados por código con identidad CreaTuActivo (Bimetálico: carbón + dorado + titanio),
para los 3 pilares y otros momentos clave de los reels. Reemplaza el b-roll de Nano Banana.

## Compositions
- **PillarIA** — Pilar 2 / Queswa: orbe con anillos pulsantes + ecualizador (eco del orbe Queswa).
- (próximas) **PillarMatriz** — Respaldo Operativo: mapa con nodos en 70 países + líneas de suministro.
- (próximas) **PillarMetodo** — Método Comprobado: path de pasos que se traza solo.

## Uso
```bash
npm install                 # una vez (baja Remotion + Chromium headless)
npm run studio              # previsualizar/ajustar en vivo (http://localhost:3000)
npm run render PillarIA out/pillar-ia.mp4              # render mp4 full-screen
# transparente (para overlay sobre el talking head):
npm run render PillarIA out/pillar-ia.mov --codec=prores --prores-profile=4444
```
1080×1920 · 30fps. Tokens en `src/brand.ts`. Textos via `defaultProps` en `src/Root.tsx`
(o `--props` por reel).

## Cómo se integra al reel
Dos modos (se decide por reel):
- **Cutaway**: el insert reemplaza el talking head durante la frase del pilar (concat).
- **Overlay**: render transparente (.mov ProRes 4444) compuesto encima con ffmpeg `overlay`.
