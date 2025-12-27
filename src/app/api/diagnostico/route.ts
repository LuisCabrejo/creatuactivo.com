/**
 * Copyright © 2025 CreaTuActivo.com
 * API: Diagnóstico de Arquitectura Soberana
 * Guarda los resultados del quiz y datos de contacto
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, whatsapp, answers, timestamp, page } = body;

    if (!email || !whatsapp) {
      return NextResponse.json(
        { error: 'Email y WhatsApp son requeridos' },
        { status: 400 }
      );
    }

    // Calcular archetype basado en respuestas
    const radarData = {
      potenciaIngreso: 85,
      autonomiaOperativa: answers?.autonomia || 0,
      resilienciaGeografica: answers?.resiliencia || 0,
      escalabilidadSistemica: answers?.apalancamiento || 0,
      eficienciaPatrimonial: answers?.eficiencia || 0,
    };

    const avgSupport = (
      radarData.autonomiaOperativa +
      radarData.escalabilidadSistemica +
      radarData.eficienciaPatrimonial
    ) / 3;

    let archetype = 'CONSTRUCTOR_EN_PROGRESO';
    if (radarData.potenciaIngreso >= 70 && avgSupport <= 40) {
      archetype = 'GIGANTE_PIES_BARRO';
    } else if (avgSupport <= 30) {
      archetype = 'OPERADOR_AGOTADO';
    }

    // Guardar en Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await supabase
      .from('diagnosticos')
      .insert({
        email,
        whatsapp,
        answers,
        radar_data: radarData,
        archetype,
        source_page: page || 'home-diagnostico',
        created_at: timestamp || new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error guardando diagnóstico:', insertError);
      // No fallar si la tabla no existe, solo logear
    }

    // También intentar crear/actualizar prospecto
    try {
      const { error: prospectError } = await supabase.rpc('identify_prospect', {
        p_fingerprint: `diag_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        p_session_id: `session_${Date.now()}`,
        p_user_agent: 'diagnostico-web',
        p_ip_address: null,
        p_referrer: page || 'home-diagnostico',
        p_utm_source: null,
        p_utm_medium: null,
        p_utm_campaign: null,
        p_utm_content: null,
        p_utm_term: null,
        p_landing_page: '/',
      });

      if (!prospectError) {
        // Actualizar datos del prospecto
        await supabase.rpc('update_prospect_data', {
          p_fingerprint: `diag_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
          p_email: email,
          p_phone: whatsapp,
          p_archetype: archetype.toLowerCase().replace(/_/g, '-'),
        });
      }
    } catch (prospectErr) {
      console.error('Error actualizando prospecto:', prospectErr);
    }

    return NextResponse.json({
      success: true,
      archetype,
      radarData,
    });
  } catch (error) {
    console.error('Error en API diagnóstico:', error);
    return NextResponse.json(
      { error: 'Error procesando diagnóstico' },
      { status: 500 }
    );
  }
}
