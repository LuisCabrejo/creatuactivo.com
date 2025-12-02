#!/bin/bash

# Script para copiar sección HERO desde presentacion-empresarial-3 a presentacion-empresarial
# Copia desde el inicio de la sección HERO hasta "Tu Equipo de 3 Partes"

SOURCE_FILE="src/app/presentacion-empresarial-3/page.tsx"
TARGET_FILE="src/app/presentacion-empresarial/page.tsx"

echo "🔄 Actualizando HERO en presentacion-empresarial..."
echo ""

# Crear backup
cp "$TARGET_FILE" "$TARGET_FILE.backup"
echo "✅ Backup creado: $TARGET_FILE.backup"

# Extraer la sección completa desde presentacion-empresarial-3
# Desde línea 310 (HERO) hasta línea 426 (fin de Tu Equipo de 3 Partes subtitle)
sed -n '310,426p' "$SOURCE_FILE" > /tmp/hero_section.txt

# Buscar líneas de inicio y fin en el archivo target
START_LINE=$(grep -n "SECCIÓN 1: WHY - Hero Emocional" "$TARGET_FILE" | cut -d: -f1)
END_LINE=$(grep -n "subtitle=\"No eres vendedor. Tienes una aplicación que hace el trabajo pesado por ti.\"" "$TARGET_FILE" | cut -d: -f1)

if [ -z "$START_LINE" ] || [ -z "$END_LINE" ]; then
  echo "❌ No se encontraron las líneas de inicio o fin"
  echo "START_LINE: $START_LINE"
  echo "END_LINE: $END_LINE"
  exit 1
fi

echo "📍 Reemplazando líneas $START_LINE a $END_LINE"

# Crear archivo temporal con el reemplazo
{
  sed -n "1,$((START_LINE-1))p" "$TARGET_FILE"
  cat /tmp/hero_section.txt
  sed -n "$((END_LINE+1)),\$p" "$TARGET_FILE"
} > "$TARGET_FILE.new"

# Reemplazar archivo original
mv "$TARGET_FILE.new" "$TARGET_FILE"

echo "✅ Sección HERO actualizada"
echo ""
echo "Cambios realizados:"
echo "- Hero con analogía Waze/Netflix"
echo "- NEXUS Demo Mockup"
echo "- Testimonio de Andrés R."
echo "- El Juego Cambió (contraste)"
echo "- Tu Equipo de 3 Partes (título)"
echo ""
echo "Para ver los cambios:"
echo "  git diff src/app/presentacion-empresarial/page.tsx"
echo ""
echo "Para revertir (si es necesario):"
echo "  mv src/app/presentacion-empresarial/page.tsx.backup src/app/presentacion-empresarial/page.tsx"
