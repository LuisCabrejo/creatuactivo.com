#!/bin/bash
# Script para limpiar knowledge_base dejando solo archivos activos de Supabase

echo "🧹 Limpieza del directorio knowledge_base"
echo "=========================================="
echo ""

KB_DIR="/Users/luiscabrejo/Cta/marketing/knowledge_base"

echo "📋 Archivos que se MANTENDRÁN (descargados de Supabase):"
echo "   ✅ arsenal_inicial.txt"
echo "   ✅ arsenal_manejo.txt"
echo "   ✅ arsenal_cierre.txt"
echo "   ✅ catalogo_productos.txt"
echo "   ✅ arsenal_productos.txt"
echo "   ✅ productos_ciencia.txt"
echo "   ✅ framework_iaa.txt"
echo "   ✅ escalacion_liliana.txt"
echo "   ✅ system-prompt-nexus-v13.6_construccion_sistema_analogia_edificio.md"
echo "   ✅ RESUMEN_ARSENALES.md (documentación)"
echo ""

echo "🗑️  Archivos que se ELIMINARÁN (obsoletos/duplicados):"
echo "   ❌ arsenal_avanzado.txt (duplicado)"
echo "   ❌ ACTUALIZAR_FECHAS_ARSENALES.js (script obsoleto)"
echo "   ❌ EJECUTAR_2_arsenal_manejo_JOBS_STYLE.sql (obsoleto)"
echo "   ❌ LIMPIEZA_COMPLETA_NOV17.md (obsoleto)"
echo "   ❌ README.md (obsoleto)"
echo "   ❌ SUBIR_ARSENAL_AVANZADO_FINAL.js (obsoleto)"
echo "   ❌ nexus-system-prompt-ACTUAL-v18.0_clean_capture_no_solicitar.md (obsoleto)"
echo "   ❌ nexus-system-prompt-v12.2-jobs-style-legal.md (obsoleto)"
echo "   ❌ nexus-system-prompt-v12.3-jobs-style-legal.md (obsoleto)"
echo "   ❌ system_promt_jobs-style_UPGRADE SOBRE v11.9_cap_temprana.sql (obsoleto)"
echo ""

read -p "¿Confirmas la limpieza? (escribe SI para continuar): " confirm

if [ "$confirm" != "SI" ]; then
    echo "❌ Operación cancelada"
    exit 1
fi

echo ""
echo "🗑️  Eliminando archivos obsoletos..."

cd "$KB_DIR"

# Eliminar arsenal duplicado
rm -f arsenal_avanzado.txt

# Eliminar scripts obsoletos
rm -f ACTUALIZAR_FECHAS_ARSENALES.js
rm -f SUBIR_ARSENAL_AVANZADO_FINAL.js
rm -f EJECUTAR_2_arsenal_manejo_JOBS_STYLE.sql
rm -f "system_promt_jobs-style_UPGRADE SOBRE v11.9_cap_temprana.sql"

# Eliminar documentación obsoleta
rm -f LIMPIEZA_COMPLETA_NOV17.md
rm -f README.md

# Eliminar system prompts obsoletos
rm -f nexus-system-prompt-ACTUAL-v18.0_clean_capture_no_solicitar.md
rm -f nexus-system-prompt-v12.2-jobs-style-legal.md
rm -f nexus-system-prompt-v12.3-jobs-style-legal.md

echo "✅ Limpieza completada"
echo ""
echo "📊 Archivos restantes en knowledge_base:"
echo "========================================"
ls -lh | tail -n +2 | awk '{printf "   %s (%s)\n", $9, $5}'
echo ""
echo "✨ Directorio limpio y sincronizado con Supabase"
