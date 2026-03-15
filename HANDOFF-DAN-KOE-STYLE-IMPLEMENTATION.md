# HANDOFF TÉCNICO: IMPLEMENTACIÓN ESTILO DAN KOE
## Guía de Implementación para Animaciones Canvas React

**Proyecto:** Día 7 - Eliminación Radical  
**Cliente:** CreaTuActivo.com - Luis Cabrejo  
**Versión Final:** v10 (100% Dan Koe Style)  
**Stack:** React + TypeScript + Canvas API + MediaRecorder  
**Formato:** 1080×1920 (9:16 vertical), 60 FPS, 38 segundos

---

## ÍNDICE

1. [Arquitectura Base](#arquitectura-base)
2. [Tier 1: Quick Wins (v5→v6)](#tier-1-quick-wins)
3. [Tier 2A: Densidad Visual (v6→v7)](#tier-2a-densidad-visual)
4. [Tier 2B: Efectos Dramáticos (v7→v8)](#tier-2b-efectos-dramaticos)
5. [Tier 3: Sofisticación (v8→v9)](#tier-3-sofisticacion)
6. [Tier 4: Perfección (v9→v10)](#tier-4-perfeccion)
7. [Parámetros de Referencia](#parametros-de-referencia)
8. [Troubleshooting](#troubleshooting)

---

## ARQUITECTURA BASE

### Stack Técnico Completo

```typescript
// Dependencies
import React, { useRef, useState, useEffect } from 'react';

// Canvas Configuration
const FPS = 60;
const WIDTH = 1080;
const HEIGHT = 1920;
const DURATION = 38; // seconds

// MediaRecorder Configuration
const CODEC = 'video/webm;codecs=vp9';
const BITRATE = 30000000; // 30 Mbps

// Performance Optimization
const CTX_OPTIONS = { alpha: false }; // Remove transparency layer
```

### Estructura de Scene Object

El objeto `scene` centraliza todo el estado de la animación:

```typescript
interface Scene {
  // Grid System (3 layers for parallax)
  gridItems: GridElement[];
  gridPhase2: GridElement[];
  gridPhase3: GridElement[];
  gridMultiplied: boolean;
  
  // Particle Systems
  floatingParticles: FloatingParticle[];
  explosionParticles: ExplosionParticle[];
  shatterFragments: ShatterFragment[];
  finalBurstParticles: ExplosionParticle[];
  
  // Animation State
  tools: Tool[];
  diamond: Diamond3D;
  orbitalAngle: number;
  
  // Hero Navigation (Fase 4)
  heroNavX: number;
  heroNavY: number;
  heroNavTX: number; // Target X
  heroNavTY: number; // Target Y
  heroNavTimer: number;
  
  // Triggers
  finalBurstTriggered: boolean;
}
```

### Timing System (Critical)

```javascript
// Timestamps clave (segundos exactos)
const T1 = 1.12;  // End of Fase 1A
const T2 = 4.08;  // End of Fase 1B
const T3 = 8.06;  // End of Fase 1 / Start FALSO
const T4 = 13.16; // End of Fase 2 / Start Stone
const T5 = 18.20; // End of Fase 3 / Start Eliminating
const T6 = 32.06; // End of Fase 4 / Start Breakthrough
const T7 = 34.09; // End of Fase 5 / Start Card
const T8 = 37.08; // End of Card / Hold Final

// Uso en código
if (time < T3) {
  // Fase 1 logic
} else if (time < T4) {
  // Fase 2 logic
}
```

---

## TIER 1: QUICK WINS (v5→v6)

**Objetivo:** Transformar look básico a 60% Dan Koe con cambios rápidos de alto impacto.

### 1.1 FILM GRAIN (Textura Cinematográfica)

**Características Dan Koe:**
- Grano monocromático (blanco puro)
- Stop-motion effect (actualiza cada 3 frames)
- Cobertura 1.5% del canvas
- Grain size: 2×2px

**Implementación:**

```javascript
const drawFilmGrain = (ctx, W, H, intensity = 0.08, frameCount) => {
  const grainSize = 2;
  const cols = Math.floor(W / grainSize);
  const rows = Math.floor(H / grainSize);
  
  // Stop-motion: grain cambia cada 3 frames
  const grainSeed = Math.floor(frameCount / 3);
  
  ctx.save();
  ctx.globalAlpha = intensity;
  ctx.fillStyle = '#ffffff';
  
  // 1.5% de píxeles = suficiente para textura sin ruido excesivo
  const pixelCount = cols * rows * 0.015;
  
  for (let i = 0; i < pixelCount; i++) {
    // Seeded random para consistencia entre frames
    const seed = (grainSeed * 9301 + i * 49297) % 233280;
    const rnd = seed / 233280.0;
    
    const x = (rnd * cols) * grainSize;
    const y = ((seed * 0.397) % rows) * grainSize;
    
    ctx.fillRect(x, y, grainSize, grainSize);
  }
  
  ctx.restore();
};

// APLICAR: Última capa antes de finalizar cada frame
drawFilmGrain(ctx, WIDTH, HEIGHT, 0.08, frameCount);
```

**Parámetros Críticos:**
- `intensity`: 0.08 (8% opacity) - No más, se ve sucio
- `grainSize`: 2px - Mimics película analógica
- `coverage`: 1.5% - Balance entre textura y limpieza
- `seedMultiplier`: 9301, 49297, 233280 - Primos para distribución uniforme

---

### 1.2 VELOCIDAD AUMENTADA (Animaciones Snappy)

**Principio Dan Koe:** Animaciones entre 0.2-0.4s (12-24 frames), NO 0.6-1.2s.

**Cambios Específicos:**

```javascript
// ❌ ANTES (v5): Lento, somnoliento
const pillFadeIn = 0.28;  // 17 frames
const pillFadeOut = 0.38;  // 23 frames
const heroEmerge = 0.18;   // 11 frames

// ✅ DESPUÉS (v6): Snappy, Dan Koe style
const pillFadeIn = 0.18;   // 11 frames ✓
const pillFadeOut = 0.28;  // 17 frames ✓
const heroEmerge = 0.12;   // 7 frames ✓
```

**Tabla de Conversión Completa:**

| Animación | v5 (frames) | v6 (frames) | Reducción | Prioridad |
|-----------|-------------|-------------|-----------|-----------|
| Pills aparición | 17 | 11 | -35% | ALTA |
| Pills fade out | 23 | 17 | -26% | ALTA |
| Hero emerge | 11 | 7 | -36% | ALTA |
| Orbital ring | 15 | 9 | -40% | ALTA |
| FALSO slam | ~36 | 5 | -86% | CRÍTICA |
| Ecuación 1 | 8 | 6 | -25% | MEDIA |
| Ecuación 2 | 11 | 7 | -36% | MEDIA |
| Stone chips | 4 | 3 | -25% | BAJA |
| Tool elimination | 53 | 36 | -32% | ALTA |
| Card slide | 6 | 5 | -17% | MEDIA |

**Regla General:** Si tarda más de 24 frames (0.4s), acortar a 12-18 frames (0.2-0.3s).

---

### 1.3 PARTÍCULAS AMBIENTALES (Background Activity)

**Concepto:** El canvas nunca está "vacío" — siempre hay movimiento sutil.

**Implementación:**

```javascript
class FloatingParticle {
  constructor(W, H) {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.8; // -0.4 a +0.4 px/frame
    this.vy = (Math.random() - 0.5) * 0.8;
    this.size = 1 + Math.random() * 2; // 1-3px
    this.opacity = 0.1 + Math.random() * 0.15; // 10-25%
    this.life = 1;
  }

  update(W, H, parallaxSpeed = 1.0) {
    this.x += this.vx * parallaxSpeed;
    this.y += this.vy * parallaxSpeed;
    
    // Wrap around edges (infinite loop)
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// INICIALIZACIÓN: 80 partículas (v6) → 120 (v10)
const floatingParticles = [];
for (let i = 0; i < 80; i++) {
  floatingParticles.push(new FloatingParticle(W, H));
}

// UPDATE LOOP: Aplicar parallax speed
scene.floatingParticles.forEach(p => {
  p.update(W, H, 0.6); // 60% speed = background layer
  p.draw(ctx);
});
```

**Cuándo Mostrar:**
- Fase 1 (0-8s): ✅ Durante acumulación
- Fase 2 (8-13s): ❌ Ocultas (demasiado caos)
- Fase 3 (13-18s): ❌ Ocultas (stone polygon es protagonista)
- Fase 4 (18-32s): ✅ Durante eliminación
- Fase 5+ (32s+): ❌ Ocultas (fade to card)

---

## TIER 2A: DENSIDAD VISUAL (v6→v7)

**Objetivo:** Multiplicar elementos 45 → 291 para crear sensación de sobrecarga.

### 2.1 GRID MULTIPLICADOR (Cascada Progresiva)

**Estrategia:** 3 olas de densificación en Fase 1.

```javascript
// FASE 1A (0-1.12s): Grid inicial
const gridPhase1 = createGrid(5, 9, W, H); // 45 elementos

// FASE 1B (1.12-4.08s): Primera multiplicación
if (!scene.gridMultiplied && t1B >= 0.30) {
  scene.gridPhase2 = createGrid(8, 12, W, H); // +96 = 141 total
  scene.gridMultiplied = true;
}

// FASE 1C (4.08-8.06s): Segunda multiplicación
if (scene.gridPhase3.length === 0 && t1C >= 0.20) {
  scene.gridPhase3 = createGrid(10, 15, W, H); // +150 = 291 total
}
```

**Timing Crítico:**
- Trigger 1: `t1B >= 0.30` (30% dentro de 1B) → Primera ola
- Trigger 2: `t1C >= 0.20` (20% dentro de 1C) → Segunda ola
- Gap entre olas: ~2-3 segundos → Permite al ojo adaptarse

**Fade-In Progresivo:**

```javascript
// Phase 2: Fade in suave
const fadeT = Math.min(1, (t1B - 0.30) / 0.25); // 0.25s = 15 frames
const phase2Alpha = Easing.easeOutCubic(fadeT) * gridAlpha * 0.7;

// Phase 3: Fade in suave
const fadeT = Math.min(1, (t1C - 0.20) / 0.30); // 0.30s = 18 frames
const phase3Alpha = Easing.easeOutCubic(fadeT) * gridAlpha * 0.55;
```

**Alpha Layering:**
- Layer 1 (original): 100% alpha
- Layer 2 (8×12): 70% alpha → Más sutil
- Layer 3 (10×15): 55% alpha → Aún más sutil

**Razón:** Evita "wall of white" — capas más lejanas más transparentes.

---

### 2.2 FORMAS VARIADAS (Triángulos + Hexágonos)

**Distribución:**
- 50% Boxes (wireframe 3D original)
- 25% Triángulos
- 25% Hexágonos

```javascript
const createGrid = (cols, rows, W, H) => {
  const items = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const shapeType = Math.random();
      items.push({
        cx: (c + 0.5) * (W / cols),
        cy: (r + 0.5) * (H / rows),
        size: 60 + Math.random() * 40, // 60-100px
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        type: shapeType < 0.5 ? 'box' : 
              shapeType < 0.75 ? 'triangle' : 
              'hexagon'
      });
    }
  }
  return items;
};
```

**Implementación Triángulo:**

```javascript
const drawTriangle = (ctx, cx, cy, size, angle, alpha) => {
  if (alpha <= 0) return;
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  
  // Triángulo exterior (equilátero)
  const h = size * Math.sqrt(3) / 2;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.67);
  ctx.lineTo(-size / 2, h * 0.33);
  ctx.lineTo(size / 2, h * 0.33);
  ctx.closePath();
  ctx.stroke();
  
  // Triángulo interior (50% size, rotado 180°)
  const innerSize = size * 0.5;
  const ih = innerSize * Math.sqrt(3) / 2;
  ctx.rotate(Math.PI); // Flip 180°
  ctx.beginPath();
  ctx.moveTo(0, -ih * 0.67);
  ctx.lineTo(-innerSize / 2, ih * 0.33);
  ctx.lineTo(innerSize / 2, ih * 0.33);
  ctx.closePath();
  ctx.stroke();
  
  ctx.restore();
};
```

**Implementación Hexágono:**

```javascript
const drawHexagon = (ctx, cx, cy, size, angle, alpha) => {
  if (alpha <= 0) return;
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  
  // Hexágono exterior (regular)
  const r = size / 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  
  // Hexágono interior (60% size, rotado 30°)
  const ir = r * 0.6;
  ctx.rotate(Math.PI / 6); // Rotate 30°
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const x = ir * Math.cos(a);
    const y = ir * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  
  ctx.restore();
};
```

**Rendering Dinámico:**

```javascript
scene.gridItems.forEach(g => {
  if (g.type === 'box') drawWireBox(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
  else if (g.type === 'triangle') drawTriangle(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
  else drawHexagon(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
});
```

---

## TIER 2B: EFECTOS DRAMÁTICOS (v7→v8)

**Objetivo:** Añadir "wow moments" con explosiones, shatters y bursts.

### 2.3 SHATTER EFFECT (Pills Explotan)

**Trigger:** Cada pill explota cuando desaparece (90% de fade-out).

```javascript
class ShatterFragment {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 2; // Upward bias
    this.size = 4 + Math.random() * 8; // 4-12px
    this.life = 1;
    this.decay = 0.022 + Math.random() * 0.018; // 2.2-4.0% per frame
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.25;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.25; // Gravity
    this.vx *= 0.96; // Air friction
    this.rotation += this.rotationSpeed;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life) * 0.8;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Red fragment (pill piece)
    ctx.fillStyle = 'rgba(255, 60, 60, 0.9)';
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    
    ctx.restore();
  }
}

// TRIGGER EN PILL LOOP
pillData.forEach((p, idx) => {
  if (t1C >= p.show[0] && t1C <= p.show[1]) {
    const local = (t1C - p.show[0]) / (p.show[1] - p.show[0]);
    const pAlpha = local < 0.10 ? local / 0.10 : 
                   local > 0.70 ? Math.max(0, (1 - (local - 0.70) / 0.30)) : 1;
    drawPill(ctx, p.pos.x, p.pos.y, p.label, pAlpha * 0.9);
    
    // ✅ Shatter trigger at 90% fade
    if (local > 0.90 && local < 0.92 && !pillData[idx].shattered) {
      pillData[idx].shattered = true;
      
      // Create 12 fragments in circular pattern
      for (let j = 0; j < 12; j++) {
        const angle = (Math.PI * 2 * j / 12) + (Math.random() - 0.5) * 0.4;
        const speed = 6 + Math.random() * 8; // 6-14 px/frame
        scene.shatterFragments.push(new ShatterFragment(p.pos.x, p.pos.y, angle, speed));
      }
    }
  }
});
```

**Parámetros Críticos:**
- `fragmentCount`: 12 por pill (suficiente para efecto, no excesivo)
- `upwardBias`: -2 → Fragmentos vuelan hacia arriba inicialmente
- `speed`: 6-14 px/frame → Explosión energética
- `decay`: 2.2-4.0% → Vida ~25-45 frames (0.4-0.75s)

---

### 2.4 MINI-EXPLOSIONES (Tool Eliminado)

**Trigger:** Cuando `tool.eliminated` cambia de `false` → `true`.

```javascript
class ExplosionParticle {
  constructor(x, y, angle, speed, size, shape = 'rect') {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = size;
    this.life = 1;
    this.decay = 0.018 + Math.random() * 0.012;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    this.shape = shape; // 'rect', 'circle', 'line'
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.15; // Gravity
    this.vx *= 0.98; // Friction
    this.rotation += this.rotationSpeed;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#ffffff';
    
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'line') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-this.size, 0);
      ctx.lineTo(this.size, 0);
      ctx.stroke();
    } else {
      // Rectangle
      const w = this.size;
      const h = this.size * (0.4 + Math.random() * 0.6);
      ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    
    ctx.restore();
  }
}

// TRIGGER EN TOOL ELIMINATION LOOP
scene.tools.forEach((tool, i) => {
  const elimTime = T5 + (T6 - T5) * ELIM_START + i * ELIM_INTERVAL;
  
  if (time >= elimTime && !tool.eliminated) {
    tool.eliminated = true;
    
    // ✅ Create 25 varied particles
    for (let j = 0; j < 25; j++) {
      const angle = (Math.PI * 2 * j / 25) + (Math.random() - 0.5) * 0.3;
      const speed = 4 + Math.random() * 6;
      const size = 3 + Math.random() * 5;
      
      // Shape variety (v10)
      const shapeRand = Math.random();
      const shape = shapeRand < 0.4 ? 'rect' : 
                    shapeRand < 0.7 ? 'circle' : 'line';
      
      scene.explosionParticles.push(
        new ExplosionParticle(orX, orY, angle, speed, size, shape)
      );
    }
  }
});
```

**Variaciones (v8 vs v10):**
- v8: 20 partículas, solo rectángulos
- v10: 25 partículas, 3 formas (40% rect, 30% circle, 30% line)

---

### 2.5 PARTICLE BURST FINAL (Breakthrough)

**Trigger:** Al entrar en Fase 5 (32.06s), una única vez.

```javascript
// CHECK EN FASE 5
if (!scene.finalBurstTriggered) {
  scene.finalBurstTriggered = true;
  
  // Create 400 particles in full circle
  for (let i = 0; i < 400; i++) {
    const angle = (Math.PI * 2 * i / 400) + (Math.random() - 0.5) * 0.2;
    const speed = 8 + Math.random() * 22; // 8-30 px/frame (muy rápido)
    const size = 2 + Math.random() * 6;
    
    // Shape variety
    const shapeRand = Math.random();
    const shape = shapeRand < 0.5 ? 'rect' : 
                  shapeRand < 0.75 ? 'circle' : 'line';
    
    scene.finalBurstParticles.push(
      new ExplosionParticle(CX, CY, angle, speed, size, shape)
    );
  }
}
```

**Parámetros Críticos:**
- `particleCount`: 400 (masivo)
- `speed`: 8-30 px/frame → Algunas muy rápidas (30 = medio canvas en 18 frames)
- `angleJitter`: ±0.2 rad → Distribución menos uniforme, más orgánica
- `shape distribution`: 50% rect, 25% circle, 25% line

**Sincronización:** Ocurre simultáneamente con:
- Hero creciendo (56 → 88px)
- 4 expanding rings
- Orbital ring desapareciendo

---

## TIER 3: SOFISTICACIÓN (v8→v9)

**Objetivo:** Agregar profundidad 3D y interconexión visual.

### 3.1 LÍNEAS CONECTORAS DINÁMICAS

**Principio:** Elementos cercanos se conectan automáticamente.

```javascript
const drawConnectionLine = (ctx, x1, y1, x2, y2, opacity, maxDistance = 250) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Don't draw if too far
  if (dist > maxDistance) return;
  
  // Opacity inversely proportional to distance
  const alpha = Math.max(0, 1 - dist / maxDistance) * opacity;
  
  ctx.save();
  ctx.globalAlpha = alpha * 0.15; // Base opacity muy sutil
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
};
```

**Aplicaciones:**

**Fase 1B: Orbital Nodes ↔ Grid**
```javascript
const orbitalNodes = [];
for (let i = 0; i < 4; i++) {
  const na = (Math.PI * 2 * i) / 4 + t1B * Math.PI * 1.5;
  const nr = 140 + i * 20;
  const nx = CX + Math.cos(na) * nr;
  const ny = CY + Math.sin(na) * nr;
  orbitalNodes.push({ x: nx, y: ny });
}

// Draw connections to nearby grid elements
orbitalNodes.forEach(node => {
  scene.gridItems.forEach(g => {
    drawConnectionLine(ctx, node.x, node.y, g.cx, g.cy, 
                      Easing.easeOutCubic(t1B), 200); // maxDist: 200px
  });
});
```

**Fase 4: Hero ↔ Active Tools**
```javascript
scene.tools.forEach((tool, i) => {
  const rank = i - elimCount;
  
  if (!tool.eliminated && rank < 3) { // Only top 3 remaining tools
    drawConnectionLine(ctx, scene.heroNavX, scene.heroNavY, 
                      orX, orY, 0.8, 400); // maxDist: 400px
  }
});
```

**Parámetros por Fase:**
- Fase 1B: `maxDistance = 200px` → Red densa local
- Fase 4: `maxDistance = 400px` → Conexiones más largas al objetivo

---

### 3.2 PARALLAX LAYERING (Profundidad 3D)

**Concepto:** Capas lejanas se mueven más lento que capas cercanas.

**Configuración de Capas:**

| Layer | Elementos | Parallax Speed | Depth |
|-------|-----------|---------------|-------|
| Background | Floating particles | 60% | Más lejos |
| Layer 3 | Grid Phase 3 (10×15) | 50% | Lejos |
| Layer 2 | Grid Phase 2 (8×12) | 75% | Medio |
| Layer 1 | Grid Phase 1 (5×9) | 100% | Cerca |
| Foreground | Hero, Pills, Tools | 100% | Más cerca |

**Implementación:**

```javascript
// Floating particles (background)
scene.floatingParticles.forEach(p => {
  p.update(W, H, 0.6); // 60% speed
  p.draw(ctx);
});

// Grid Phase 1 (foreground)
scene.gridItems.forEach(g => {
  g.angle += g.rotSpeed * 1.0; // 100% speed
  drawShape(ctx, g);
});

// Grid Phase 2 (middle)
scene.gridPhase2.forEach(g => {
  g.angle += g.rotSpeed * 0.75; // 75% speed
  drawShape(ctx, g);
});

// Grid Phase 3 (background)
scene.gridPhase3.forEach(g => {
  g.angle += g.rotSpeed * 0.50; // 50% speed
  drawShape(ctx, g);
});
```

**Regla:** `layerSpeed = baseSpeed * parallaxMultiplier`

**Efecto Visual:** 
- Al rotar, capas más lejanas van más lento
- Crea profundidad sin renderizado 3D real
- El ojo percibe "espacio" entre capas

---

### 3.3 GLITCH RGB (Chromatic Aberration)

**Concepto:** En momentos de tensión, el hero se descompone en canales RGB.

**Implementación:**

```javascript
const drawHero = (ctx, x, y, r, opacity, sx = 1, sy = 1, glow = 40, glitchIntensity = 0) => {
  // ... auras normales ...
  
  // ✅ RGB Chromatic Aberration
  if (glitchIntensity > 0) {
    const offset = glitchIntensity * 3; // 3px per intensity unit
    
    // Red channel (left)
    ctx.save();
    ctx.globalAlpha = opacity * 0.5;
    ctx.shadowBlur = glow * 0.5;
    ctx.shadowColor = 'rgba(255, 0, 0, 0.6)';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(x - offset, y, r * sx, r * sy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    
    // Blue channel (right)
    ctx.save();
    ctx.globalAlpha = opacity * 0.5;
    ctx.shadowBlur = glow * 0.5;
    ctx.shadowColor = 'rgba(0, 100, 255, 0.6)';
    ctx.fillStyle = 'rgba(0, 100, 255, 0.7)';
    ctx.beginPath();
    ctx.ellipse(x + offset, y, r * sx, r * sy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  
  // Main white hero (center)
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.shadowBlur = glow;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x, y, r * sx, r * sy, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
};
```

**Triggers de Glitch:**

**1. Fase 1C: Compresión (t > 0.7)**
```javascript
const glitchIntensity = t1C > 0.7 ? (t1C - 0.7) / 0.3 * 2 : 0;
// Resultado: 0 → 2 durante últimos 30% de Fase 1C
drawHero(ctx, CX + sx2, CY + sy2, 46 * breathe, 1, strX, strY, hGlow, glitchIntensity);
```

**2. Fase 2: Pre-FALSO (FREEZE → SLAM)**
```javascript
const glitchIntensity = (t2 < SLAM && t2 > FREEZE) 
  ? (SLAM - t2) / (SLAM - FREEZE) * 4 
  : 0;
// Resultado: 4 → 0 durante 0.08s antes de SLAM (máxima tensión)
drawHero(ctx, CX, CY + 80, 50 * breathe, heroT, 1, 1, 50 + t2 * 22, glitchIntensity);
```

**3. Fase 4: Tool Eliminado**
```javascript
let justEliminated = false;

scene.tools.forEach((tool, i) => {
  if (time >= elimTime && !tool.eliminated) {
    tool.eliminated = true;
    justEliminated = true; // Flag para este frame
  }
});

const vibGlitch = justEliminated ? 1.5 : 0;
// Resultado: Spike de 1.5 por 1 frame cuando se elimina tool
drawHero(ctx, scene.heroNavX, scene.heroNavY, heroR * breathe, 1, 1, 1, heroGlow, vibGlitch);
```

**Parámetros:**
- `offset`: 3px por unidad de intensidad
- `opacity`: 50% para canales RGB (no opacar el blanco principal)
- Colors: Red (#FF0000) left, Blue (#0064FF) right

---

## TIER 4: PERFECCIÓN (v9→v10)

**Objetivo:** Últimos 5% para alcanzar 100% Dan Koe.

### 4.1 VARIEDAD DE PARTÍCULAS (4 Tipos)

**Antes (v9):** Solo círculos.  
**Después (v10):** Círculos, líneas, puntos, cuadrados.

```javascript
class FloatingParticle {
  constructor(W, H) {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.size = 1 + Math.random() * 3;
    this.opacity = 0.1 + Math.random() * 0.2;
    this.life = 1;
    
    // ✅ Random shape type
    const shapeRand = Math.random();
    if (shapeRand < 0.4) {
      this.shape = 'circle'; // 40%
    } else if (shapeRand < 0.6) {
      this.shape = 'line'; // 20%
      this.lineLength = 8 + Math.random() * 12;
      this.lineAngle = Math.random() * Math.PI * 2;
      this.lineRotSpeed = (Math.random() - 0.5) * 0.03;
    } else if (shapeRand < 0.8) {
      this.shape = 'dot'; // 20%
      this.size = 1 + Math.random() * 1.5;
    } else {
      this.shape = 'square'; // 20%
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.05;
    }
  }

  update(W, H, parallaxSpeed = 1.0) {
    this.x += this.vx * parallaxSpeed;
    this.y += this.vy * parallaxSpeed;
    
    // Update shape-specific properties
    if (this.shape === 'line') {
      this.lineAngle += this.lineRotSpeed;
    } else if (this.shape === 'square') {
      this.rotation += this.rotSpeed;
    }
    
    // Wrap around
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (this.shape === 'line') {
      ctx.lineWidth = 1;
      const x1 = this.x + Math.cos(this.lineAngle) * this.lineLength / 2;
      const y1 = this.y + Math.sin(this.lineAngle) * this.lineLength / 2;
      const x2 = this.x - Math.cos(this.lineAngle) * this.lineLength / 2;
      const y2 = this.y - Math.sin(this.lineAngle) * this.lineLength / 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
    } else if (this.shape === 'dot') {
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      
    } else if (this.shape === 'square') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
    
    ctx.restore();
  }
}
```

**Incrementar Cantidad:**
- v6-v9: 80 partículas
- v10: 120 partículas (+50%)

---

### 4.2 BACKGROUND GRID PERSISTENTE

**Concepto:** Grid sutil 120×120px presente en TODAS las fases.

```javascript
const drawBackgroundGrid = (ctx, W, H, time, opacity) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.5; // Muy delgado
  
  const gridSpacing = 120;
  
  // Slow drift para movimiento sutil
  const offsetX = (time * 15) % gridSpacing; // 15px/s
  const offsetY = (time * 10) % gridSpacing; // 10px/s
  
  // Vertical lines
  for (let x = -gridSpacing + offsetX; x < W + gridSpacing; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let y = -gridSpacing + offsetY; y < H + gridSpacing; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  
  ctx.restore();
};
```

**Opacidad por Fase:**

```javascript
const bgGridOpacity = time < T3 ? 0.03 :   // Fase 1: Sutil
                     time < T4 ? 0.02 :     // Fase 2: Más sutil (FALSO)
                     time < T5 ? 0.025 :    // Fase 3: Balance
                     time < T6 ? 0.03 :     // Fase 4: Presente
                     time < T7 ? 0.02 :     // Fase 5: Fade
                     0.015;                  // Firma: Mínimo

drawBackgroundGrid(ctx, W, H, time, bgGridOpacity);
```

**IMPORTANTE:** Dibujar ANTES de cualquier otro elemento (primera capa).

**Parámetros Críticos:**
- `gridSpacing`: 120px (9 líneas verticales, 16 horizontales en 1080×1920)
- `lineWidth`: 0.5px (sutil, no invasivo)
- `opacity`: 0.015-0.03 (muy bajo, solo textura)
- `drift speed`: 15px/s horizontal, 10px/s vertical (diagonal suave)

---

## PARÁMETROS DE REFERENCIA

### Timing General

```javascript
// Fade speeds (Dan Koe standard)
const FADE_IN_FAST = 0.12;    // 7 frames
const FADE_IN_MEDIUM = 0.18;  // 11 frames
const FADE_OUT_FAST = 0.10;   // 6 frames
const FADE_OUT_MEDIUM = 0.16; // 10 frames

// Easing functions (importancia por uso)
const PRIMARY_EASE = Easing.easeOutCubic;  // 80% de animaciones
const IMPACT_EASE = Easing.easeOutBack;    // Slams, apariciones dramáticas
const SMOOTH_EASE = Easing.easeOutQuad;    // Movimientos suaves
const SLOW_START_EASE = Easing.easeInQuart; // Fade to black
```

### Partículas

```javascript
// Floating particles
const PARTICLE_COUNT = 120;
const PARTICLE_SIZE_MIN = 1;
const PARTICLE_SIZE_MAX = 3;
const PARTICLE_SPEED = 0.8; // ±0.4 px/frame
const PARTICLE_OPACITY_MIN = 0.1;
const PARTICLE_OPACITY_MAX = 0.25;

// Shatter fragments (pills)
const SHATTER_COUNT_PER_PILL = 12;
const SHATTER_SPEED_MIN = 6;
const SHATTER_SPEED_MAX = 14;
const SHATTER_UPWARD_BIAS = -2;
const SHATTER_GRAVITY = 0.25;
const SHATTER_FRICTION = 0.96;

// Explosion particles (tools)
const EXPLOSION_COUNT_PER_TOOL = 25; // v10
const EXPLOSION_SPEED_MIN = 4;
const EXPLOSION_SPEED_MAX = 10;
const EXPLOSION_GRAVITY = 0.15;
const EXPLOSION_FRICTION = 0.98;

// Final burst
const BURST_COUNT = 400; // v10
const BURST_SPEED_MIN = 8;
const BURST_SPEED_MAX = 30; // Muy rápido
```

### Grid y Formas

```javascript
// Grid dimensions
const GRID_PHASE_1 = { cols: 5, rows: 9 };   // 45 elementos
const GRID_PHASE_2 = { cols: 8, rows: 12 };  // 96 elementos
const GRID_PHASE_3 = { cols: 10, rows: 15 }; // 150 elementos

// Shape sizes
const SHAPE_SIZE_MIN = 60;
const SHAPE_SIZE_MAX = 100;

// Rotation speeds
const ROT_SPEED_MIN = -0.01;
const ROT_SPEED_MAX = 0.01;

// Shape distribution
const SHAPE_BOX_PROB = 0.50;      // 50%
const SHAPE_TRIANGLE_PROB = 0.75; // 25% (0.50-0.75)
const SHAPE_HEXAGON_PROB = 1.00;  // 25% (0.75-1.00)
```

### Parallax

```javascript
const PARALLAX_BACKGROUND = 0.6;  // Floating particles
const PARALLAX_LAYER_3 = 0.50;    // Grid Phase 3
const PARALLAX_LAYER_2 = 0.75;    // Grid Phase 2
const PARALLAX_LAYER_1 = 1.0;     // Grid Phase 1
const PARALLAX_FOREGROUND = 1.0;  // Hero, Pills, Tools
```

### Glitch

```javascript
// Glitch intensities
const GLITCH_COMPRESSION = 2.0;   // Fase 1C
const GLITCH_PRE_SLAM = 4.0;      // Fase 2 (máximo)
const GLITCH_ELIMINATION = 1.5;   // Fase 4 spike

// RGB offset
const GLITCH_OFFSET_MULTIPLIER = 3; // 3px per intensity unit

// Colors
const GLITCH_RED = 'rgba(255, 0, 0, 0.7)';
const GLITCH_BLUE = 'rgba(0, 100, 255, 0.7)';
```

### Film Grain

```javascript
const GRAIN_SIZE = 2;              // 2×2px blocks
const GRAIN_INTENSITY = 0.08;      // 8% opacity
const GRAIN_COVERAGE = 0.015;      // 1.5% of pixels
const GRAIN_UPDATE_INTERVAL = 3;   // Change every 3 frames
```

### Background Grid

```javascript
const BG_GRID_SPACING = 120;       // 120×120px cells
const BG_GRID_LINE_WIDTH = 0.5;    // Very subtle
const BG_GRID_DRIFT_X = 15;        // 15px/second
const BG_GRID_DRIFT_Y = 10;        // 10px/second
const BG_GRID_OPACITY_MIN = 0.015; // Firma
const BG_GRID_OPACITY_MAX = 0.03;  // Fase 1, 4
```

---

## TROUBLESHOOTING

### Problema: Performance bajo (<60 FPS)

**Diagnóstico:**
```javascript
// Add FPS counter
let lastTime = performance.now();
let frameCount = 0;

function update() {
  const now = performance.now();
  frameCount++;
  
  if (now - lastTime > 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastTime = now;
  }
  
  // ... rest of update logic
}
```

**Soluciones por orden de impacto:**

1. **Reducir partículas activas:**
```javascript
// Filter dead particles más agresivamente
scene.explosionParticles = scene.explosionParticles.filter(p => p.life > 0.1);
// En lugar de > 0
```

2. **Optimizar connection lines:**
```javascript
// Solo dibujar cada N frames
if (frameCount % 2 === 0) {
  drawConnectionLine(...);
}
```

3. **Simplificar film grain:**
```javascript
// Reducir coverage de 1.5% a 1.0%
const pixelCount = cols * rows * 0.010;
```

4. **Usar OffscreenCanvas para layers estáticos:**
```javascript
// Pre-render background grid una vez
const bgGridCanvas = new OffscreenCanvas(WIDTH, HEIGHT);
const bgCtx = bgGridCanvas.getContext('2d');
drawBackgroundGrid(bgCtx, WIDTH, HEIGHT, 0, 0.03);

// En update loop: solo draw
ctx.drawImage(bgGridCanvas, 0, 0);
```

---

### Problema: Video no graba o se corta

**Verificar codec support:**
```javascript
const isVP9Supported = MediaRecorder.isTypeSupported('video/webm;codecs=vp9');
console.log('VP9 support:', isVP9Supported);

if (!isVP9Supported) {
  // Fallback a VP8
  mediaRecorder = new MediaRecorder(stream, { 
    mimeType: 'video/webm;codecs=vp8' 
  });
}
```

**Aumentar timeout de grabación:**
```javascript
// Añadir buffer de 1 segundo
setTimeout(() => {
  if (mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
}, DURATION * 1000 + 1000); // +1000ms buffer
```

**Manejar chunks grandes:**
```javascript
mediaRecorder.ondataavailable = (e) => {
  if (e.data.size > 0) {
    recordedChunks.push(e.data);
    console.log(`Chunk: ${e.data.size} bytes`);
  }
};
```

---

### Problema: Timing desincronizado

**Usar performance.now() NO Date.now():**
```javascript
// ❌ INCORRECTO
const elapsed = (Date.now() - startTime) / 1000;

// ✅ CORRECTO
const elapsed = (performance.now() - startTime) / 1000;
```

**Clamp time al máximo:**
```javascript
const time = Math.min(elapsed, DURATION);
// Evita que animaciones continúen post-DURATION
```

**Reset completo en restart:**
```javascript
const restart = () => {
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
  }
  startTimeRef.current = null;
  sceneRef.current = null; // IMPORTANTE: Reset scene
  setProgress(0);
  setIsPlaying(false);
};
```

---

### Problema: Glitch no visible

**Verificar orden de draw:**
```javascript
// ORDEN CORRECTO:
// 1. RGB channels (desplazados)
if (glitchIntensity > 0) {
  drawRedChannel(...);
  drawBlueChannel(...);
}
// 2. Main white hero (encima, centrado)
drawMainHero(...);

// Si se dibuja al revés, glitch queda tapado
```

**Aumentar offset si no se ve:**
```javascript
// Default: 3px per unit
const offset = glitchIntensity * 5; // Aumentar a 5px
```

---

### Problema: Partículas "salen" del canvas

**Wrap-around implementation:**
```javascript
update(W, H, parallaxSpeed = 1.0) {
  this.x += this.vx * parallaxSpeed;
  this.y += this.vy * parallaxSpeed;
  
  // ✅ Wrap (no reset to 0)
  if (this.x < 0) this.x = W;        // Left edge → right edge
  if (this.x > W) this.x = 0;        // Right edge → left edge
  if (this.y < 0) this.y = H;        // Top edge → bottom edge
  if (this.y > H) this.y = 0;        // Bottom edge → top edge
  
  // ❌ NO hacer esto:
  // if (this.x < 0 || this.x > W) this.x = W/2; // Teleport to center
}
```

---

### Problema: Memoria leak durante grabación larga

**Limpiar particles regularmente:**
```javascript
// En update loop
if (frameCount % 120 === 0) { // Cada 2 segundos
  // Remove particles con life negativa
  scene.explosionParticles = scene.explosionParticles.filter(p => p.life > -0.5);
  scene.shatterFragments = scene.shatterFragments.filter(p => p.life > -0.5);
  scene.finalBurstParticles = scene.finalBurstParticles.filter(p => p.life > -0.5);
}
```

**Limitar arrays máximos:**
```javascript
// Prevenir explosión de memoria
if (scene.explosionParticles.length > 500) {
  scene.explosionParticles = scene.explosionParticles.slice(0, 500);
}
```

---

## CHECKLIST DE IMPLEMENTACIÓN

Usar esta checklist para cada nuevo proyecto:

### Tier 1 (Crítico - 2-3 horas)
- [ ] Film grain implementado (stop-motion cada 3 frames)
- [ ] Velocidades de animación acortadas 30-40%
- [ ] 80-120 partículas flotantes agregadas
- [ ] Parallax en partículas (0.6 speed)

### Tier 2A (Alta prioridad - 3-4 horas)
- [ ] Grid multiplicador con 2-3 fases
- [ ] Fade-in progresivo de cada fase (0.25-0.30s)
- [ ] Triángulos wireframe implementados
- [ ] Hexágonos wireframe implementados
- [ ] Distribución 50/25/25 verificada

### Tier 2B (Alto impacto - 4-5 horas)
- [ ] Shatter effect en elementos que desaparecen
- [ ] 12 fragmentos por elemento
- [ ] Mini-explosiones en eventos clave
- [ ] 20-25 partículas por explosión
- [ ] Particle burst final (350-400 partículas)
- [ ] Variedad de formas en explosiones

### Tier 3 (Sofisticación - 5-6 horas)
- [ ] Líneas conectoras dinámicas implementadas
- [ ] Distancia-based opacity funcionando
- [ ] Parallax en 3-5 capas
- [ ] Velocidades: 100%, 75%, 60%, 50%
- [ ] Glitch RGB en 3 momentos clave
- [ ] Chromatic aberration visible

### Tier 4 (Perfección - 2-3 horas)
- [ ] Variedad de partículas: círculos, líneas, puntos, cuadrados
- [ ] Distribución: 40%, 20%, 20%, 20%
- [ ] Background grid persistente
- [ ] Grid spacing 120×120px
- [ ] Drift diagonal (15px/s, 10px/s)
- [ ] Opacidad adaptativa por fase

### Testing Final
- [ ] 60 FPS consistente durante todo el video
- [ ] Grabación completa sin cortes
- [ ] Audio sincronizado (si aplica)
- [ ] File size razonable (38s @ 30Mbps ≈ 570MB)
- [ ] No memory leaks durante grabación

---

## NOTAS FINALES

### Lo que NO se incluye en este documento

Por decisión del cliente, los siguientes elementos se implementarán en CapCut post-producción:

- **Subtítulos word-by-word (After Effects style)**
- **Camera shake en momentos de impacto**

Estos elementos requieren:
- Subtítulos: Transcripción + word-level timing + fade animations
- Camera shake: Keyframe animation en editor de video

Ambos son más eficientes en post-producción que en Canvas real-time.

---

### Recursos de Referencia

**Fonts:**
- Primary: Montserrat (Google Fonts)
- Weights: 300, 400, 600, 700, 900
- `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap');`

**Easings (copiar a proyecto):**
```javascript
const Easing = {
  easeOutExpo: (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
  easeOutBack: (x) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  easeOutQuad: (x) => 1 - (1 - x) * (1 - x),
  easeInQuart: (x) => x * x * x * x,
  easeOutQuart: (x) => 1 - Math.pow(1 - x, 4),
  easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
  easeInOutCubic: (x) => x < 0.5 
    ? 4 * x * x * x 
    : 1 - Math.pow(-2 * x + 2, 3) / 2
};
```

**Color Palette:**
- Background: `#050505` (almost black)
- Primary white: `#ffffff`
- Glitch red: `rgba(255, 0, 0, 0.7)`
- Glitch blue: `rgba(0, 100, 255, 0.7)`
- Destruction red: `rgba(255, 60, 60, 0.9)`

---

## VERSIONADO

Este documento corresponde a la implementación final:

- **v5**: Baseline (40% Dan Koe)
- **v6**: Tier 1 Quick Wins (60% Dan Koe)
- **v7**: Tier 2A Densidad (75% Dan Koe)
- **v8**: Tier 2B Drama (85% Dan Koe)
- **v9**: Tier 3 Sofisticación (95% Dan Koe)
- **v10**: Tier 4 Perfección (100% Dan Koe) ← **VERSIÓN FINAL**

**Última actualización:** Febrero 18, 2026  
**Autor:** Claude (Anthropic)  
**Cliente:** CreaTuActivo.com - Luis Cabrejo

---

## CONTACTO Y FEEDBACK

Para implementaciones futuras, considerar:

1. **Optimizaciones adicionales:**
   - WebGL rendering para >500 elementos simultáneos
   - Web Workers para particle systems
   - WASM para physics calculations

2. **Features avanzados:**
   - Audio reactivity (particles respond to music)
   - Interactive mode (user can manipulate elements)
   - Real-time parameter tweaking (GUI controls)

3. **Export improvements:**
   - Direct MP4 export (sin reencoding)
   - Frame-by-frame PNG sequence
   - Transparent background option

**Para consultas técnicas, contactar mediante:**
- GitHub Issues en repositorio del proyecto
- Slack channel #animations
- Email: tech@creatuactivo.com

---

**FIN DEL HANDOFF TÉCNICO**
