# Instrucción · Auditoría de Queswa para los videos de los días 74 y 77 (23 nov 2026)

**Para:** el agente de Claude Code en la Mac del Director (`/Users/luiscabrejo/Cta/marketing`).
**Por qué en la Mac:** la auditoría llama a Claude y la sesión en la nube no tiene clave de Anthropic. Aquí está en `.env.local`.

## Estado en que la recibe (ya hecho, no lo repita)

- `RETO_D74` («Amapola») y `RETO_D77` («Las tres condiciones para empezar, y El Ranchero en Armenia») están desplegados en los tres tenants (`creatuactivo_marketing`, `whatsapp`, `dashboard`), con vector y sin duplicados. `arsenal_inicial` va en v6.90.
- `RETO_MAS_RECIENTE` (src/lib/puerta-reto.ts) apunta al día 77 y está en `main` (commit `1787c078`).
- La recuperación ya está medida (ver CHANGELOG-arsenales.md, entrada v6.90). **No vuelva a desplegar ni a fragmentar.**

## Pasos

1. `git status` (el repo ya perdió su `.git` una vez) y `git pull origin main`.
2. Confirme que Vercel ya sirve el commit `1787c078` o uno posterior.
3. Corra la auditoría del día 77. Gasta unas 20 llamadas a Claude, menos de un dólar, de `ANTHROPIC_API_KEY_PRUEBAS` si existe:
   ```bash
   NODE_NO_WARNINGS=1 npx tsx scripts/auditar-guion-queswa.mjs public/contexto/produccion/guiones/reels/aprobados/2026-11-22-reto-90-dia-77-el-ranchero.md --detalle
   ```
4. Si el día 77 sale sin ❌, corra la del día 74 con el mismo comando y `2026-11-19-reto-90-dia-74-amapola.md`.
5. Pruebe a mano la puerta del video más reciente, en WhatsApp (`x-tenant-id: whatsapp`, cabecera `x-queswa-origen: prueba`): «vi su último video» debe responder con `RETO_D77` (`search_method` o `documents_used` en `nexus_conversations`).

## Qué hacer con el resultado

- **Le dirá dónde hay que fijarse:**
  - quien pregunte «no conozco mucha gente, ¿puedo empezar?» o «quiero hacer mi solicitud», porque no va a `RETO_D77` (va a `FREQ_03`, `FREQ_41` y `PERFIL_01`);
  - cualquier respuesta que arrastre a cifras o a salud.
- **Si hay ❌ o 🟡:** no redacte ni despliegue copy. Proponga el texto al Director en el chat, con el formato DEL-AL (estado actual → estado objetivo → pasos). Él decide, y solo entonces se toca el arsenal.
- **Si todo sale bien:** anote el resultado en los dos registros (la línea «⏳ Despliegue, medición y auditoría desde la Mac del Director» del día 77 y la del día 74) y en la entrada v6.90 del CHANGELOG. Haga commit en `main` y push en primer plano.

## Reglas que aplican

- Siempre «usted», sin promesa de ingreso ni de plazos.
- El día 77 dice «negocio» (no «empresa»). «Negocio digital» va solo en este video, sin nombrar a Gano Excel y sin el desglose de los tres elementos.
- El lugar del día 74 se llama **Amapola**, sin s.
- Ningún identificador de modelo en los commits.
