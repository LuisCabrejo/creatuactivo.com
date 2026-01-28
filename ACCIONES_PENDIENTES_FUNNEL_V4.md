# Acciones Pendientes - Protocolo Funnel v4

**Fecha**: Enero 2026
**Referencia**: `public/.md/Protocolo Maestro CreaTuActivo v4 (Auditado y Optimizado).md`

---

## Resumen de Cambios Completados

### Emails (Soap Opera Sequence)

| Día | Cambio | Estado |
|-----|--------|--------|
| 3 | Cliffhanger mejorado: "Aunque ganaba dinero, no tenía libertad real" | ✅ |
| 4 | Epifanía del E-commerce agregada (la fuga crítica) | ✅ |
| 5 | Resumen mejorado con los 3 mitos desmontados + Arquitectura de Activos | ✅ |
| Todos | Subject lines actualizados según protocolo v4 | ✅ |

### Subject Lines Actualizados

```
Día 1: La métrica que te quita el sueño (Días de Libertad)
Día 2: Por qué trabajar duro no te hará rico
Día 3: Las 3 promesas que le hice a mi esposa (y las 2 que rompí)
Día 4: Gané dinero, pero perdí mi vida (La verdad del E-commerce)
Día 5: Tu turno de cumplir promesas
```

---

## Cambios Pendientes en Páginas

### 1. Home (page.tsx) - PRIORIDAD ALTA

**Problema actual**: Funciona como menú de opciones (Blog, Quién Soy, etc.)

**Corrección requerida**: Debe funcionar como **Squeeze Page Híbrida**.

**Hero Section nuevo**:
- **Headline**: "¿Sigues operando bajo el Plan por Defecto?"
- **Subheadline**: "Descubre cuántos días de libertad real tienes antes de que se acabe el dinero."
- **CTA Único**: "Hacer el Diagnóstico" → enlace a calculadora

**Eliminar**: Enlaces de navegación excesivos que saquen al usuario del camino crítico.

---

### 2. Página Calculadora - PRIORIDAD ALTA

**Objetivo**: Micro-compromiso + Captura de Lead

**Lógica de flujo**:
1. Usuario ingresa Ahorros y Gastos
2. Clic en "Calcular"
3. **Pop-up / Paso Intermedio**: "Para enviarte tu reporte de libertad y el plan de acción, ¿a dónde te lo enviamos?" (Captura Email AQUÍ)
4. **Resultado Semafórico**:
   - `< 30 días`: **ROJO** - "Zona de Peligro Inminente"
   - `30-180 días`: **AMARILLO** - "Estabilidad Falsa"
   - `> 180 días`: **VERDE** - "Listo para Invertir"
5. **CTA Final**: "Ver la Solución (Reto 5 Días)"

---

### 3. Bridge Page (/reto-5-dias/gracias) - PRIORIDAD CRÍTICA

**Estado actual**: Tiene la historia de Buena Vista en texto, pero falta VIDEO.

**Elemento obligatorio**: Video VSL de Luis (3-5 min)

**Guion del video (esquema)**:
1. **Validación**: "Felicidades por registrarte. Acabas de dar el paso que el 99% no da."
2. **Epiphany Corta**: Historia de Buena Vista (las 3 promesas, 14 años, solo cumplí los hijos)
3. **Lo que viene**: "En los próximos 5 días, voy a desmontar todo lo que crees saber sobre hacer dinero."
4. **CTA Único**: "El primer paso es unirte al Grupo de WhatsApp para no perderte los materiales."

**Nota**: Sin este video, la conexión emocional es cero. NO vendas el producto aquí. Vende la asistencia al Día 1.

---

### 4. Página del Reto (/reto-5-dias) - Mejora menor

**Headline sugerido**: "5 Días para Diseñar tu Salida del Sistema Tradicional"

**Bullets**:
- Día 1: Tu número real
- Día 2: Por qué tu empleo no te salvará
- Día 3: La Arquitectura de Activos

**Prueba social**: Si hay testimonios, van aquí. Si no, usar historia de Luis (autoridad).

---

## Flujo del Funnel Corregido

```
Tráfico Frío (Ads/Redes)
         ↓
    HOME (Hero: Plan por Defecto?)
         ↓
    CALCULADORA (Captura email + Semáforo)
         ↓
    /reto-5-dias (Squeeze Page)
         ↓
    /reto-5-dias/gracias (Bridge + VIDEO VSL + WhatsApp)
         ↓
    Soap Opera Emails (5 días)
         ↓
    /webinar (Perfect Webinar)
         ↓
    /fundadores (Oferta)
```

---

## Archivos Modificados (Enero 2026)

- `src/emails/reto-5-dias/Dia3-Modelo.tsx`
- `src/emails/reto-5-dias/Dia4-Estigma.tsx`
- `src/emails/reto-5-dias/Dia5-Invitacion.tsx`
- `src/app/api/cron/reto-5-dias/route.ts`

---

## Próximos Pasos Ejecutables

1. [ ] **Grabar VSL de Bridge Page** (Luis narra Buena Vista, 3-5 min)
2. [ ] **Configurar grupo WhatsApp** para asistencia al Reto
3. [ ] **Crear calculadora** con lógica de captura + semáforo
4. [ ] **Ajustar Home** como squeeze híbrida
5. [ ] **Agregar columnas Supabase**: `reto_email_day` y `reto_last_email_at` a `funnel_leads`
