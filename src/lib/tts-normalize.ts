/**
 * normalizarParaVoz — prepara texto para síntesis de voz (TTS).
 *
 * Convierte símbolos y abreviaturas a palabras antes de enviarlas a ElevenLabs/OpenAI.
 * Sin esto, el motor lee "$200 USD" como "dollar sign 200 U-S-D" y "%" como "percent".
 *
 * Fuente única compartida por:
 *   - /api/voice-command  (pipeline de voz: Whisper → Claude → TTS)
 *   - /api/nexus/tts      (botón "ESCUCHAR" en burbujas del chat)
 */
export function normalizarParaVoz(text: string): string {
  return text
    // Millones en dólares: $100M USD / 100M USD → "100 millones de dólares"
    .replace(/\$?([\d.]+)M\s*USD/gi, (_, n) => `${n} millones de dólares`)
    // Miles en dólares: $200K USD / 200K USD → "200 mil dólares"
    .replace(/\$?([\d.]+)K\s*USD/gi, (_, n) => `${n} mil dólares`)
    // Dólares simples: $200 USD / 500 USD / $1,000 USD → "200 dólares"
    .replace(/\$?([\d,]+)\s*USD/gi, (_, n) => `${n.replace(/,/g, '')} dólares`)
    // Millones en pesos: $2.25M COP → "2.25 millones de pesos colombianos"
    .replace(/\$?([\d.]+)M\s*COP/gi, (_, n) => `${n} millones de pesos colombianos`)
    // Miles en pesos: $900K COP → "900 mil pesos colombianos"
    .replace(/\$?([\d.]+)K\s*COP/gi, (_, n) => `${n} mil pesos colombianos`)
    // Pesos simples: $900 COP → "900 pesos colombianos"
    .replace(/\$?([\d,]+)\s*COP/gi, (_, n) => `${n.replace(/,/g, '')} pesos colombianos`)
    // USD / COP solos que hayan quedado
    .replace(/\bUSD\b/gi, 'dólares')
    .replace(/\bCOP\b/gi, 'pesos colombianos')
    // Signo $ suelto antes de número
    .replace(/\$([\d])/g, '$1')
    // % solo
    .replace(/%/g, ' por ciento')
}
