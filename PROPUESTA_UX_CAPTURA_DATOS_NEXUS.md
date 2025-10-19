# 📋 Propuesta UX: Captura de Datos en NEXUS

**Versión:** 1.0
**Fecha:** 19 de Octubre 2025
**Problema:** Las preguntas de captura de datos (nombre, teléfono, ocupación) se pierden en el flujo conversacional y los usuarios las olvidan.

---

## 🔍 INVESTIGACIÓN - Hallazgos Clave

### **Problema Identificado:**
Según las capturas de pantalla analizadas, cuando NEXUS pregunta datos personales (nombre, teléfono, ocupación) dentro del flujo conversacional:

1. **Las preguntas se pierden** entre mensajes largos
2. **El usuario se distrae** con sus 1000 quehaceres
3. **Olvida** que le preguntaron algo al principio
4. **No hay recordatorio visual** persistente

---

### **Datos de Investigación (2025):**

#### **Conversacional vs Formularios:**
- **Chatbots aumentan conversión 10-100%** vs formularios tradicionales (dependiendo implementación)
- **Abandono de formularios tradicionales: 67-81%**
- **Live chat convierte 33-50% mejor** que web forms tradicionales
- Caso Perfecto Mobile: **6% → 20% conversión** con chatbot

#### **Mejores Prácticas UX:**
1. **Formularios inline** superan a preguntas conversacionales perdidas
2. **Botones de respuesta rápida** reducen fricción y abandono
3. **Contexto persistente visible** mejora completitud
4. **Menú persistente** en la parte inferior mejora UX
5. **Sticky headers** mantienen acciones importantes visibles

---

## 💡 SOLUCIONES PROPUESTAS (De Menor a Mayor Complejidad)

---

### **SOLUCIÓN 1: Sticky Form Card (Recomendada - Quick Win)**

#### **Concepto:**
Cuando NEXUS detecta "momento óptimo = caliente" o captura datos, mostrar una **tarjeta sticky** en la parte superior del chat que mantiene visible los campos solicitados.

#### **Implementación Visual:**

```
┌─────────────────────────────────────────────────────┐
│ 📝 NEXUS está recopilando tu información           │
│                                                     │
│ ✅ Nombre: Luis Cabrejo                           │
│ ⏳ Teléfono: [Pendiente]                          │
│ ⏳ Ocupación: [Pendiente]                         │
│                                                     │
│ 3 de 4 completados                         [X]     │
└─────────────────────────────────────────────────────┘
```

#### **Características:**
- **Posición:** Sticky top (siempre visible al hacer scroll)
- **Auto-actualización:** Marca campos ✅ cuando se capturan
- **Progreso visual:** Barra de progreso "3 de 4 completados"
- **Dismissible:** Usuario puede cerrar [X] si ya respondió
- **Pulsante:** Animación suave en el campo pendiente

#### **Código de Ejemplo:**

```tsx
// Nuevo componente: NEXUSDataCaptureCard.tsx

interface DataCaptureCardProps {
  capturedData: {
    nombre?: string;
    telefono?: string;
    email?: string;
    ocupacion?: string;
  };
  onDismiss: () => void;
}

export function NEXUSDataCaptureCard({ capturedData, onDismiss }: DataCaptureCardProps) {
  const fields = [
    { key: 'nombre', label: 'Nombre', icon: '👤' },
    { key: 'telefono', label: 'Teléfono', icon: '📱' },
    { key: 'email', label: 'Email', icon: '📧' },
    { key: 'ocupacion', label: 'Ocupación', icon: '💼' }
  ];

  const completedCount = Object.values(capturedData).filter(v => v).length;
  const totalFields = fields.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200 p-4 shadow-lg"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <h3 className="font-semibold text-gray-800">NEXUS está recopilando tu información</h3>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {fields.map(field => {
            const value = capturedData[field.key as keyof typeof capturedData];
            const isCompleted = !!value;

            return (
              <div
                key={field.key}
                className={`flex items-center gap-2 p-2 rounded ${
                  isCompleted ? 'bg-green-100' : 'bg-white animate-pulse'
                }`}
              >
                <span>{isCompleted ? '✅' : '⏳'}</span>
                <span className="text-sm">
                  {field.icon} {field.label}:{' '}
                  <span className={isCompleted ? 'font-medium' : 'text-gray-400'}>
                    {value || '[Pendiente]'}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalFields) * 100}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {completedCount} de {totalFields}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
```

#### **Cuándo Mostrar:**
```typescript
// En NEXUSWidget.tsx

const [showDataCard, setShowDataCard] = useState(false);
const [capturedData, setCapturedData] = useState({});

useEffect(() => {
  // Mostrar card si:
  // 1. Momento óptimo = caliente
  // 2. O si hay al menos 1 dato capturado pero faltan otros
  const hasPartialData = Object.keys(capturedData).length > 0 &&
                         Object.keys(capturedData).length < 4;

  setShowDataCard(hasPartialData || momentoOptimo === 'caliente');
}, [capturedData, momentoOptimo]);
```

#### **Beneficios:**
- ✅ Recordatorio visual persistente
- ✅ Usuario ve progreso en tiempo real
- ✅ No interrumpe flujo conversacional
- ✅ Fácil de implementar (2-4 horas)
- ✅ Reduce olvido de preguntas

---

### **SOLUCIÓN 2: Inline Form Injection (Complejidad Media)**

#### **Concepto:**
Cuando NEXUS hace una pregunta de datos, inyectar un **mini-formulario inline** directamente en el mensaje de NEXUS.

#### **Implementación Visual:**

```
┌─────────────────────────────────────────────────────┐
│ NEXUS                                         15:42 │
├─────────────────────────────────────────────────────┤
│ Perfecto, veo que estás interesado. Para           │
│ personalizar la experiencia, déjame conocerte:      │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ 📝 Tu información                            │   │
│ │                                              │   │
│ │ 👤 Nombre                                    │   │
│ │ [___________________________________]        │   │
│ │                                              │   │
│ │ 📱 Teléfono (opcional)                       │   │
│ │ [___________________________________]        │   │
│ │                                              │   │
│ │ 💼 Ocupación                                 │   │
│ │ [___________________________________]        │   │
│ │                                              │   │
│ │            [Continuar conversación]          │   │
│ └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### **Código de Ejemplo:**

```tsx
// NEXUSInlineForm.tsx

interface InlineFormProps {
  onSubmit: (data: any) => void;
  fields: Array<{
    key: string;
    label: string;
    icon: string;
    required: boolean;
  }>;
}

export function NEXUSInlineForm({ onSubmit, fields }: InlineFormProps) {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 my-4 border-2 border-blue-200 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📝</span>
        <h3 className="font-semibold text-gray-800">Tu información</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.icon} {field.label} {!field.required && '(opcional)'}
            </label>
            <input
              type="text"
              value={formData[field.key] || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                [field.key]: e.target.value
              }))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
        >
          Continuar conversación →
        </button>
      </form>
    </div>
  );
}
```

#### **Cuándo Inyectar:**
```typescript
// Modificar en route.ts para incluir flag especial

// Si la respuesta de Claude incluye "INJECT_FORM", reemplazar con formulario

if (completion.includes('[INJECT_CONTACT_FORM]')) {
  return {
    type: 'form',
    fields: [
      { key: 'nombre', label: 'Nombre', icon: '👤', required: true },
      { key: 'telefono', label: 'Teléfono', icon: '📱', required: false },
      { key: 'ocupacion', label: 'Ocupación', icon: '💼', required: false }
    ]
  };
}
```

#### **Beneficios:**
- ✅ Captura estructurada (no regex)
- ✅ Validación en frontend
- ✅ Menos errores de interpretación
- ✅ UX familiar (formulario tradicional)
- ⚠️ Rompe un poco el flujo conversacional

---

### **SOLUCIÓN 3: Quick Reply Buttons (Más Natural)**

#### **Concepto:**
Cuando NEXUS pregunta datos, mostrar **botones de respuesta rápida** con opciones predefinidas o input field contextual.

#### **Implementación Visual:**

```
┌─────────────────────────────────────────────────────┐
│ NEXUS                                         15:42 │
├─────────────────────────────────────────────────────┤
│ ¡Genial! Para personalizar tu experiencia,         │
│ ¿cuál es tu ocupación actual?                      │
│                                                     │
│ ┌─────────────────┐ ┌──────────────────┐          │
│ │ 💼 Emprendedor   │ │ 👔 Profesional   │          │
│ └─────────────────┘ └──────────────────┘          │
│                                                     │
│ ┌─────────────────┐ ┌──────────────────┐          │
│ │ 👨‍👩‍👧 Padre/Madre│ │ 🎓 Estudiante     │          │
│ └─────────────────┘ └──────────────────┘          │
│                                                     │
│ ┌──────────────────────────────────────┐           │
│ │ ✏️ Escribir otra: [____________]     │           │
│ └──────────────────────────────────────┘           │
└─────────────────────────────────────────────────────┘
```

#### **Código de Ejemplo:**

```tsx
// NEXUSQuickReply.tsx

interface QuickReplyProps {
  question: string;
  options: Array<{
    value: string;
    label: string;
    icon: string;
  }>;
  allowCustom?: boolean;
  onSelect: (value: string) => void;
}

export function NEXUSQuickReply({ question, options, allowCustom, onSelect }: QuickReplyProps) {
  const [customValue, setCustomValue] = useState('');

  return (
    <div className="space-y-3">
      <p className="text-gray-800">{question}</p>

      <div className="grid grid-cols-2 gap-2">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
          >
            <span className="text-xl">{option.icon}</span>
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {allowCustom && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
            placeholder="✏️ Escribir otra..."
          />
          <button
            onClick={() => onSelect(customValue)}
            disabled={!customValue}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}
```

#### **Beneficios:**
- ✅ Reduce tipeo (más rápido)
- ✅ Estandariza respuestas (arquetipos)
- ✅ Mejor para móvil
- ✅ Mantiene flujo conversacional
- ✅ Permite opción custom

---

### **SOLUCIÓN 4: Hybrid Approach (Recomendado para Máximo Impacto)**

#### **Concepto:**
Combinar las 3 soluciones anteriores de forma inteligente según el contexto.

#### **Flujo Híbrido:**

```typescript
// Lógica de decisión

function getDataCaptureStrategy(momentoOptimo: string, messageCount: number) {
  // CASO 1: Usuario muy interesado (caliente) + conversación corta
  if (momentoOptimo === 'caliente' && messageCount < 5) {
    return 'INLINE_FORM'; // Formulario inline inmediato
  }

  // CASO 2: Usuario tibio + conversación media
  if (momentoOptimo === 'tibio' && messageCount >= 3) {
    return 'QUICK_REPLIES'; // Botones de respuesta rápida
  }

  // CASO 3: Conversación larga + datos parcialmente capturados
  if (messageCount >= 7 && hasPartialData()) {
    return 'STICKY_CARD'; // Tarjeta sticky recordatorio
  }

  // CASO 4: Default - conversacional puro
  return 'CONVERSATIONAL';
}
```

#### **Beneficios Combinados:**
- ✅ Máxima conversión (adapta UX al usuario)
- ✅ Reduce fricción
- ✅ No pierde contexto
- ✅ Captura datos estructurados
- ✅ Mantiene naturalidad conversacional

---

## 📊 COMPARATIVA DE SOLUCIONES

| Solución | Complejidad | Tiempo | Conversión | Naturalidad | Móvil |
|----------|-------------|--------|------------|-------------|-------|
| **Sticky Card** | Baja | 2-4h | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Inline Form** | Media | 6-8h | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Quick Replies** | Media | 4-6h | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Hybrid** | Alta | 12-16h | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 RECOMENDACIÓN INMEDIATA

### **FASE 1 (Implementar YA - Esta semana):**
✅ **Sticky Data Capture Card**

**Razones:**
1. Quick win (2-4 horas)
2. No rompe flujo conversacional
3. Soluciona problema inmediato (olvido de preguntas)
4. Fácil de A/B test
5. Compatible con mejoras futuras

---

### **FASE 2 (Próximas 2 semanas):**
✅ **Quick Reply Buttons** para ocupación y datos específicos

**Razones:**
1. Reduce fricción en móvil
2. Estandariza arquetipos
3. Complementa sticky card
4. Mejora conversión

---

### **FASE 3 (1-2 meses):**
✅ **Inline Form** para "momento caliente"

**Razones:**
1. Máxima conversión en prospectos calientes
2. Captura estructurada garantizada
3. Reduce dependencia de regex
4. Analytics más precisos

---

## 💻 IMPLEMENTACIÓN TÉCNICA

### **Archivos a Modificar:**

1. **Nuevo componente:**
   - `src/components/nexus/NEXUSDataCaptureCard.tsx`

2. **Modificar:**
   - `src/components/nexus/NEXUSWidget.tsx` (agregar sticky card)
   - `src/app/api/nexus/route.ts` (tracking de datos capturados)

3. **Crear utils:**
   - `src/utils/nexus/dataCaptureLogic.ts` (lógica de cuándo mostrar)

---

## 📈 MÉTRICAS DE ÉXITO

**Antes:**
- Tasa de captura de datos: ~40% (estimado, según regex)
- Datos incompletos: ~60%

**Después (esperado):**
- Tasa de captura de datos: 75-85%
- Datos completos: 70-80%
- Tiempo de captura: -50% (más rápido con botones)

---

## 🔥 PRÓXIMO PASO

¿Quieres que implemente la **Sticky Data Capture Card** (FASE 1) ahora mismo?

Es un quick win que resuelve tu problema inmediato y solo toma 2-4 horas.
