// Script para verificar estructura de nexus_prospects
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProspectStructure() {
  console.log('🔍 Verificando estructura de nexus_prospects...\n');

  try {
    // Obtener un registro de ejemplo (el más reciente)
    const { data, error } = await supabase
      .from('nexus_prospects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('❌ Error:', error);
      return;
    }

    if (!data) {
      console.log('⚠️ No hay registros en nexus_prospects aún.\n');
      console.log('Estructura esperada según código:');
      console.log({
        fingerprint_id: 'string (PK)',
        data: {
          name: 'string',
          email: 'string',
          phone: 'string',
          occupation: 'string',
          interest_level: 'number',
          objections: 'array',
          archetype: 'string',
          momento_optimo: 'string',
          consent_granted: 'boolean', // ⚠️ IMPORTANTE
          consent_timestamp: 'timestamp'
        },
        created_at: 'timestamp',
        updated_at: 'timestamp'
      });
      return;
    }

    console.log('✅ Registro de ejemplo encontrado:');
    console.log('━'.repeat(80));
    console.log('fingerprint_id:', data.fingerprint_id?.substring(0, 30) + '...');
    console.log('\nCampos disponibles en la tabla:');
    console.log(Object.keys(data));
    console.log('\nEstructura del campo "data":');
    console.log(JSON.stringify(data.data, null, 2));
    console.log('━'.repeat(80));

    // Verificar campos críticos
    console.log('\n📊 ANÁLISIS DE CAMPOS CRÍTICOS:');
    console.log('✅ fingerprint_id:', !!data.fingerprint_id);
    console.log('✅ data.name:', !!data.data?.name);
    console.log('✅ data.consent_granted:', data.data?.consent_granted !== undefined ? data.data.consent_granted : '❌ NO EXISTE');
    console.log('✅ data.consent_timestamp:', !!data.data?.consent_timestamp);
    console.log('✅ created_at:', !!data.created_at);

    // Contar usuarios con consentimiento
    const { count: totalCount } = await supabase
      .from('nexus_prospects')
      .select('*', { count: 'exact', head: true });

    console.log('\n📈 ESTADÍSTICAS:');
    console.log('Total prospects:', totalCount);

  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

checkProspectStructure();
