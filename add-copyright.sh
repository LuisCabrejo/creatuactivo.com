#!/bin/bash

# Script para agregar copyright notice a archivos fuente
# Solo agrega si no existe ya

COPYRIGHT_NOTICE="/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */"

# Contador de archivos modificados
count=0

# Función para agregar copyright a un archivo
add_copyright() {
  local file="$1"

  # Verificar si ya tiene copyright
  if ! grep -q "Copyright.*CreaTuActivo" "$file" 2>/dev/null; then
    # Crear archivo temporal con copyright + contenido original
    echo "$COPYRIGHT_NOTICE" > "$file.tmp"
    echo "" >> "$file.tmp"
    cat "$file" >> "$file.tmp"

    # Reemplazar archivo original
    mv "$file.tmp" "$file"

    echo "✅ Agregado copyright: $file"
    ((count++))
  else
    echo "⏭️  Ya tiene copyright: $file"
  fi
}

# Procesar archivos en src/
echo "🔍 Buscando archivos fuente en src/..."
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
  add_copyright "$file"
done

# Procesar archivos en public/ (solo .js importantes)
echo ""
echo "🔍 Buscando archivos JavaScript en public/..."
if [ -f "public/tracking.js" ]; then
  add_copyright "public/tracking.js"
fi

echo ""
echo "✨ Proceso completado: $count archivos modificados"
