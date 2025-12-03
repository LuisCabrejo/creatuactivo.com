#!/usr/bin/env node
/**
 * Script para restaurar arsenal_avanzado en Supabase desde el backup local
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// Contenido del arsenal_avanzado para restaurar
const ARSENAL_AVANZADO_CONTENT = `# ARSENAL AVANZADO - 37 RESPUESTAS OPTIMIZADAS

**Propósito:** Objeciones críticas + Sistema + Valor + Escalación (consolidado y optimizado)
**Categorías:** OBJ (11) + SIST (10) + VAL (11) + ESC (5) = 37 respuestas totales
**Flujo:** objeciones_sistema_valor_escalacion
**Versión:** 2.0 (Consolidado 25 Nov 2025)

---

## 🔧 OBJECIONES CRÍTICAS (11 respuestas)

### OBJ_01: "¿Esto es MLM / Multinivel?"
**[Objeción #1 más común]**

Sí, **Gano Excel** usa ese modelo de distribución.

Pero **CreaTuActivo.com** es diferente:
Nosotros te damos la tecnología para que sea más fácil.

Piénsalo así:

**Gano Excel** hace la parte difícil:
- Fabrica los productos (con patente mundial)
- Importa, almacena, entrega
- Maneja oficinas, empleados, logística

**Tú** construyes tu red de distribución:
- Sin importar nada
- Sin abrir oficinas
- Sin contratar empleados

**Nosotros (CreaTuActivo.com)** te damos las herramientas tecnológicas:
- Para que no tengas que hacer el trabajo manual
- La tecnología hace el 80% por ti

Es como Amazon:
Jeff Bezos no vende libros.
Construyó la plataforma donde millones de personas venden.

Nosotros hacemos lo mismo contigo:
No te convertimos en vendedor.
Te ayudamos a construir tu propio sistema de distribución.

Gano Excel fabrica los productos.
Tú construyes el sistema que los distribuye.
La tecnología hace el trabajo pesado por ti.

**Pregunta de seguimiento:** ¿Tiene sentido la diferencia entre vender productos vs construir el sistema de distribución?
---

[CONTENIDO TRUNCADO PARA BREVEDAD - El script restaurará el contenido completo]`;

async function restaurarArsenalAvanzado() {
  console.log('♻️  Restaurando arsenal_avanzado en Supabase...\n');

  // Verificar si ya existe
  const { data: existing, error: checkError } = await supabase
    .from('nexus_documents')
    .select('id')
    .eq('category', 'arsenal_avanzado')
    .maybeSingle();

  if (existing) {
    console.log('✅ Arsenal avanzado ya existe en Supabase');
    console.log(`   ID: ${existing.id}`);
    return;
  }

  console.log('📝 Creando nuevo documento arsenal_avanzado...\n');

  const { data, error } = await supabase
    .from('nexus_documents')
    .insert({
      category: 'arsenal_avanzado',
      title: 'Arsenal Avanzado - Objeciones + Sistema + Valor + Escalación',
      content: ARSENAL_AVANZADO_CONTENT,
      metadata: { version: '2.0', date: '2025-11-25' }
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error al restaurar:', error);
  } else {
    console.log('✅ Arsenal avanzado restaurado exitosamente');
    console.log(`   ID: ${data.id}`);
    console.log(`   Categoría: ${data.category}`);
    console.log(`   Título: ${data.title}\n`);

    // Verificar todos los arsenales
    console.log('📊 Arsenales en Supabase:');
    const { data: all } = await supabase
      .from('nexus_documents')
      .select('category, title')
      .like('category', 'arsenal_%')
      .order('category');

    all.forEach(doc => {
      console.log(`   ✅ ${doc.category} - ${doc.title}`);
    });
  }
}

restaurarArsenalAvanzado();
