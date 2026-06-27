# HANDOFF — Funcionalidad de Voz de Queswa

> Estado: **producción** (jun 2026). Objetivo de la auditoría: **mejor UX · menor costo · menos latencia.**
> Última ronda de cambios: gesto dual de micrófono, Flash v2.5, caché TTS, retrieval por vector search in-memory, STT mini-transcribe, normalización compartida.

---

## 1. Mapa de archivos

| Archivo | Rol |
|---|---|
| [src/components/UnifiedQueswaOrb.tsx](src/components/UnifiedQueswaOrb.tsx) | Motor de grabación: `getUserMedia` + `MediaRecorder` + VAD (auto-stop por silencio) + barras reactivas + reproducción del audio de respuesta. Orbe flotante. |
| [src/components/nexus/NEXUSWidget.tsx](src/components/nexus/NEXUSWidget.tsx) | UI del chat. Botón de micrófono con **gesto dual** (toque / mantener), `VoicePanel` (estados grabando/procesando/respondiendo/error) y botón **"ESCUCHAR"** (TTS por mensaje). |
| [src/app/api/voice-command/route.ts](src/app/api/voice-command/route.ts) | Pipeline de voz: STT → recuperación → LLM → TTS. `nodejs`, `maxDuration=60`. |
| [src/app/api/nexus/tts/route.ts](src/app/api/nexus/tts/route.ts) | TTS del botón "ESCUCHAR": texto → audio. `edge`, `30s`. |
| [src/lib/tts-normalize.ts](src/lib/tts-normalize.ts) | `normalizarParaVoz()` — fuente única de conversión de símbolos/cifras a palabras. |
| [src/lib/vectorSearch.ts](src/lib/vectorSearch.ts) | Embeddings Voyage + cosine. La voz usa `vectorSearchVoyage` (in-memory). |
| `src/middleware.ts` | Inyecta `x-tenant-id` por dominio en `/api/voice-command` y `/api/nexus`. |

---

## 2. Flujo end-to-end

```
[Usuario toca/mantiene el mic]
   │  UnifiedQueswaOrb.startRecording() → MediaRecorder + VAD
   ▼
[Soltar / silencio] → stopAndSend()
   │  POST FormData(audio) → /api/voice-command   (header x-tenant-id por middleware)
   ▼
1. OÍDO     gpt-4o-mini-transcribe (es)            [fallback whisper-1]
2. RETRIEVAL fetchRelevantFragment(transcript,tenant)
              · vector search in-memory sobre embedding_512 (= chat de texto)
              · fallback: clasificador regex + textSearch
3. CEREBRO   Claude Haiku 4.5, system en 2 bloques
              · Bloque 1: prompt entrenado del tenant (cacheado por Anthropic)
              · Bloque 2: reglas de VOZ + FUENTE DE VERDAD (fragment)
4. VOZ       normalizarParaVoz → TTS
              · cache hit → buffer · si no → ElevenLabs /stream (flash_v2_5)
              · [fallback OpenAI tts-1 buffer]
   ▼
[respuesta] audio/mpeg (stream) + headers x-transcript / x-reply
   │  UnifiedQueswaOrb.playVoiceResponse: MediaSource (chunks) o blob (fallback)
   │  NEXUSWidget inyecta transcript+reply al historial (evento queswa-voice-exchange)
```

---

## 3. UX — gesto dual del micrófono

Un solo botón, dos modos (mejores prácticas 2026: ofrecer ambos, dejar elegir):

| Gesto | Quién termina la grabación | Caso de uso |
|---|---|---|
| **Toque corto** (<280 ms) | El VAD (auto-stop tras ~900 ms de silencio) | Manos libres, ambiente tranquilo |
| **Mantener** (≥280 ms) | El usuario al soltar (walkie-talkie) | Control total, ambiente ruidoso |

**Detalle crítico (no romper):** la captura del puntero va en `inputContainerRef` (elemento **estable**), NO en el botón. Al iniciar la grabación, el botón se reemplaza por `VoicePanel` y se desmonta; si la captura estuviera en el botón, el navegador dispara un `pointercancel` al desmontarlo y aborta el "mantener". `touch-action:none` + `WebkitTouchCallout:none` suprimen el menú/háptica nativa del long-press en iOS.

**Háptica:** `vibrate(15)` al iniciar · `vibrate(50)` al confirmar el "mantener" · `vibrate([20,30,20,30,40])` cuando la respuesta está lista · `vibrate([30,50,30])` en auto-stop por VAD.

**Parámetros VAD** (UnifiedQueswaOrb): `SILENCE_THRESHOLD=12`, `SILENCE_HOLD_MS=900`, `MIN_RECORD_MS=800`. En modo "mantener" el VAD se desactiva (`holdModeRef`).

---

## 4. Recuperación (lo que costó)

La voz usa el **mismo motor que el chat de texto**: `vectorSearchVoyage` (Voyage `voyage-3-lite` 512-dim → cosine en memoria sobre `embedding_512`).

⚠️ **NO usar el RPC `match_documents`** aquí: exige dimensión exacta y revienta con `different vector dimensions 1536 and 512`. El cosine en memoria tolera longitudes distintas (`Math.min(a.length,b.length)`).

- `getTenantFragments(tenantId)`: carga fragmentos con `embedding_512` por tenant, **excluye docs maestros** (`MASTER_CATEGORIES`), caché 5 min.
- `fetchRelevantFragment`: top-3, umbral 0.30; fallback al clasificador regex + textSearch si falta `VOYAGE_API_KEY` o no hay hits.
- Validado: "precio del Ganocafé 3 en 1" → `catalogo_productos_BEB_01` ($110,900) en top-3. Antes el regex no lo atrapaba y el modelo improvisaba el handoff a la directiva.

---

## 5. Costo por interacción (~10 s audio, respuesta ~200 caracteres)

| Etapa | Modelo | Costo aprox. | Notas |
|---|---|---|---|
| STT | `gpt-4o-mini-transcribe` ($0.003/min) | ~$0.0005 | era whisper-1 ($0.006/min) → −50% |
| Embedding | `voyage-3-lite` | ~$0.0001 | |
| LLM | `claude-haiku-4-5` (con caché) | ~$0.001 | |
| TTS | ElevenLabs `eleven_flash_v2_5` | ~$0.01–0.02 | era multilingual_v2 (~$0.02–0.04) → ~−50% |

**El TTS sigue siendo el grueso del costo.** Caché en memoria (`_ttsCache`, TTL 1h) recorta frases repetidas. Para recortar más: pre-renderizar respuestas verbatim (chips WHY_02/EAM_01, saludos).

> Decisión: **NO** migrar a speech-to-speech (OpenAI Realtime ~$0.25–0.35/min; Gemini Live más barato pero por minuto). Para turnos cortos de Q&A el pipeline modular es ~10× más barato; Realtime solo gana en conversación larga continua.

---

## 6. Latencia (~6–7 s hoy) y roadmap

Presupuesto secuencial aproximado: STT ~2 s · retrieval ~0.3 s · Haiku ~1 s · TTS ~1–2 s + descarga.

| Palanca | Impacto latencia | Estado |
|---|---|---|
| TTS Flash v2.5 (vs Multilingual v2) | −0.5 a −1 s | ✅ hecho |
| Caché de fragmentos (no recargar 155 docs/llamada) | menor | ✅ hecho |
| STT mini-transcribe | ≈ igual o algo menor | ✅ hecho |
| **TTS streaming** (ElevenLabs `/stream` → reproducir mientras sintetiza) | **−1 a −2 s percibidos** (empieza a oírse en ~300–500 ms) | ✅ hecho |
| Prompt caching agresivo (ya 2 bloques) | menor | parcial |

**TTS streaming (hecho):** el backend devuelve el `ReadableStream` de ElevenLabs `/stream` (`optimize_streaming_latency=3`); el cliente reproduce por chunks con **MediaSource** (`playVoiceResponse` en UnifiedQueswaOrb). Fallback automático a buffer completo (blob) si el navegador no soporta MSE `audio/mpeg` o si el streaming falla → sin regresión. En cache-hit se devuelve buffer; el streaming no escribe caché (las respuestas del LLM rara vez se repiten).

---

## 7. Config (env vars)

| Servicio | Modelo | Env var |
|---|---|---|
| STT | `gpt-4o-mini-transcribe` (fallback `whisper-1`) | `OPENAI_API_KEY` |
| LLM | `claude-haiku-4-5-20251001` | `ANTHROPIC_API_KEY` |
| Embeddings | `voyage-3-lite` | `VOYAGE_API_KEY` |
| TTS | ElevenLabs `eleven_flash_v2_5` → OpenAI `tts-1` | `ELEVENLABS_API_KEY` · `ELEVENLABS_VOICE_ID` |

**Multi-tenant:** el `x-tenant-id` (middleware por dominio) selecciona prompt (`nexus_main` / `marca_personal` / `ganocafe_main`) y filtra fragmentos del tenant.

---

## 8. Pendientes / notas

- **Pre-render de respuestas verbatim** para caché TTS casi gratis en rutas calientes.
- Precios de **productos individuales por país** distinto a Colombia: el catálogo solo tiene COP (gap conocido, ajeno a la voz).
- La clave de etapa `'maestria'` en las tools del dashboard es contrato con queswa.app (NO renombrar; las etiquetas visibles ya dicen "Multiplicación").
