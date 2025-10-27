# ⏱️ Contador Dinámico de Cupos de Fundadores

## 📊 Especificación del Contador

### Parámetros de Configuración

- **Fecha de inicio:** Lunes 27 de Octubre 2025 a las 10:00 AM (UTC-5 Colombia)
- **Cupos iniciales:** 150
- **Reducción por hora:** 1 cupo cada hora en punto
- **Reducción diaria:** 10 cupos por día
- **Duración de Lista Privada:** 27 de Octubre - 16 de Noviembre (21 días)

---

## 🔢 Lógica del Contador

### Comportamiento Diario

Cada día tiene 10 horas de reducción (de 10:00 AM a 7:00 PM aproximadamente):

```
Día 1 (27 Oct): 150 cupos al inicio (10:00 AM)
  - 11:00 AM → 149 cupos (-1)
  - 12:00 PM → 148 cupos (-2)
  - 13:00 PM → 147 cupos (-3)
  - 14:00 PM → 146 cupos (-4)
  - 15:00 PM → 145 cupos (-5)
  - 16:00 PM → 144 cupos (-6)
  - 17:00 PM → 143 cupos (-7)
  - 18:00 PM → 142 cupos (-8)
  - 19:00 PM → 141 cupos (-9)
  - 20:00 PM → 140 cupos (-10, fin del día)

Día 2 (28 Oct): 140 cupos al inicio (10:00 AM)
  - 11:00 AM → 139 cupos (-1)
  - 12:00 PM → 138 cupos (-2)
  ...
  - 20:00 PM → 130 cupos (-10, fin del día)

Día 3 (29 Oct): 130 cupos al inicio (10:00 AM)
  ...y así sucesivamente
```

### Fórmula de Cálculo

```typescript
cuposDisponibles = 150 - (díasCompletos × 10) - (horasCompletas)
```

Donde:
- `díasCompletos` = días desde el 27 de Octubre 10:00 AM
- `horasCompletas` = horas desde el inicio del día actual (máximo 10 por día)

---

## 💻 Implementación Técnica

### Archivo Modificado
- **Ruta:** [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)

### Función Principal

```typescript
function calcularCuposDisponibles(): number {
  const ahora = new Date()
  const inicioLista = new Date('2025-10-27T10:00:00-05:00')

  // Lógica de cálculo aquí...

  return cuposActuales
}
```

### Hook de Actualización

```typescript
useEffect(() => {
  // Calcular cupos iniciales
  setSpotsLeft(calcularCuposDisponibles())

  // Actualizar cada minuto (detecta cambios de hora)
  const interval = setInterval(() => {
    setSpotsLeft(calcularCuposDisponibles())
  }, 60000)

  return () => clearInterval(interval)
}, [])
```

---

## 📅 Proyección de Cupos

| Día | Fecha | Cupos Inicio | Cupos Fin | Reducción |
|-----|-------|-------------|-----------|-----------|
| 1 | 27 Oct | 150 | 140 | -10 |
| 2 | 28 Oct | 140 | 130 | -10 |
| 3 | 29 Oct | 130 | 120 | -10 |
| 4 | 30 Oct | 120 | 110 | -10 |
| 5 | 31 Oct | 110 | 100 | -10 |
| 6 | 01 Nov | 100 | 90 | -10 |
| 7 | 02 Nov | 90 | 80 | -10 |
| 8 | 03 Nov | 80 | 70 | -10 |
| 9 | 04 Nov | 70 | 60 | -10 |
| 10 | 05 Nov | 60 | 50 | -10 |
| 11 | 06 Nov | 50 | 40 | -10 |
| 12 | 07 Nov | 40 | 30 | -10 |
| 13 | 08 Nov | 30 | 20 | -10 |
| 14 | 09 Nov | 20 | 10 | -10 |
| 15 | 10 Nov | 10 | 0 | -10 |

**Nota:** La lista completa se agotaría en 15 días si sigue la proyección automática.

---

## 🔧 Ajuste Manual

### Método de Ajuste

Al final de cada día, puedes ajustar manualmente el valor si la realidad difiere de la proyección automática.

**Para ajustar el contador:**

1. Edita el archivo [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)
2. Modifica la función `calcularCuposDisponibles()` agregando un offset:

```typescript
function calcularCuposDisponibles(): number {
  const ahora = new Date()
  const inicioLista = new Date('2025-10-27T10:00:00-05:00')

  // ... cálculo normal ...

  let cuposActuales = cuposBaseDia - cuposRestadosPorHora

  // AJUSTE MANUAL - Modificar según datos reales
  const ajusteManual = 0 // Cambiar este valor para ajustar
  cuposActuales += ajusteManual

  return Math.max(cuposActuales, 0)
}
```

### Ejemplo de Ajuste

Si al final del día 1 quedan **145 cupos reales** en lugar de los 140 proyectados:

```typescript
const ajusteManual = 5 // Agregar 5 cupos a la proyección
```

---

## 🎯 Casos de Uso

### Antes del 27 de Octubre (10:00 AM)
- **Resultado:** Muestra 150 cupos
- **Comportamiento:** Estático hasta la fecha de inicio

### Durante la Lista Privada (27 Oct - 16 Nov)
- **Resultado:** Contador dinámico activo
- **Actualización:** Cada minuto (detecta cambios de hora)

### Después del 16 de Noviembre
- **Resultado:** Dependerá de si se alcanzó el objetivo de 150 fundadores
- **Opción 1:** Si se llenó, mostrar "Cupos agotados"
- **Opción 2:** Si no se llenó, continuar con contador

---

## 🧪 Testing

### Pruebas Locales

Para probar diferentes fechas/horas sin esperar:

```typescript
// Simular una fecha específica (solo para testing)
const ahora = new Date('2025-10-28T15:30:00-05:00') // Día 2, 3:30 PM
```

### Escenarios de Prueba

1. **Antes del inicio:**
   ```typescript
   // Fecha: 26 Oct 2025 (cualquier hora)
   // Esperado: 150 cupos
   ```

2. **Inicio exacto:**
   ```typescript
   // Fecha: 27 Oct 2025 10:00 AM
   // Esperado: 150 cupos
   ```

3. **Primera hora:**
   ```typescript
   // Fecha: 27 Oct 2025 11:00 AM
   // Esperado: 149 cupos
   ```

4. **Fin del primer día:**
   ```typescript
   // Fecha: 27 Oct 2025 19:00 PM (10 horas después)
   // Esperado: 140 cupos
   ```

5. **Inicio del segundo día:**
   ```typescript
   // Fecha: 28 Oct 2025 10:00 AM
   // Esperado: 140 cupos
   ```

---

## 📱 Visualización en la Página

El contador se muestra en la sección "Urgencia y Timeline":

```jsx
<div className="bg-emerald-600/10 border border-emerald-600/30 rounded-2xl text-center p-6">
  <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">
    Cupos de Fundador Disponibles
  </p>
  <p className="text-6xl font-bold text-green-400 animate-pulse">
    {spotsLeft}
  </p>
  <p className="text-slate-400">de 150</p>
</div>
```

---

## ⚡ Optimización de Performance

- **Actualización:** Cada 60 segundos (no en tiempo real para reducir carga)
- **Cleanup:** El intervalo se limpia al desmontar el componente
- **Hydration:** Usa `useState` + `useEffect` para evitar problemas de SSR

---

## 📝 Notas Importantes

1. **Zona Horaria:** El contador usa UTC-5 (hora de Colombia)
2. **Primer render:** Puede mostrar 150 brevemente antes del cálculo inicial
3. **Ajuste diario:** Luis debe revisar y ajustar manualmente según datos reales
4. **Cupos agotados:** Cuando llega a 0, se mantiene en 0

---

## 🔄 Próximas Actualizaciones Posibles

- [ ] Conectar a base de datos para cupos reales vendidos
- [ ] Notificación cuando quedan menos de 10 cupos
- [ ] Dashboard de administración para ajustes en vivo
- [ ] Histórico de cupos por día

---

**Última actualización:** 26 de Octubre 2025
**Responsable:** Claude Code
**Estado:** ✅ Activo y funcionando
