#!/bin/bash
# Script para corregir todas las referencias a "patente" en archivos de producción
# Fecha: 3 Dic 2025

echo "🔧 CORRECCIÓN MASIVA: Patente → Tecnología Propietaria"
echo "======================================================="
echo ""

# Contador
TOTAL=0

# Función para reemplazar en archivo
replace_in_file() {
    local file="$1"
    local old="$2"
    local new="$3"

    if grep -q "$old" "$file" 2>/dev/null; then
        sed -i.bak "s/$old/$new/g" "$file"
        rm "${file}.bak" 2>/dev/null
        echo "✅ Actualizado: $file"
        ((TOTAL++))
    fi
}

cd /Users/luiscabrejo/Cta/marketing

# Correcciones específicas por archivo

# StrategicNavigation.tsx
replace_in_file "src/components/StrategicNavigation.tsx" \
    "El motor de valor con patente mundial\\." \
    "El motor de valor con tecnología propietaria única."

# ecosistema/page.tsx
replace_in_file "src/app/ecosistema/page.tsx" \
    "Productos únicos con patente mundial\\." \
    "Productos únicos con tecnología propietaria."

replace_in_file "src/app/ecosistema/page.tsx" \
    "un hongo medicinal con patente mundial" \
    "un hongo medicinal con tecnología propietaria"

# ecosistema-2/page.tsx
replace_in_file "src/app/ecosistema-2/page.tsx" \
    "Productos únicos con patente mundial\\." \
    "Productos únicos con tecnología propietaria."

replace_in_file "src/app/ecosistema-2/page.tsx" \
    "un hongo medicinal con patente mundial" \
    "un hongo medicinal con tecnología propietaria"

# fundadores/page.tsx
replace_in_file "src/app/fundadores/page.tsx" \
    "El producto lo pone <strong className=\"text-white\">Gano Excel</strong> (Patente Mundial)\\." \
    "El producto lo pone <strong className=\"text-white\">Gano Excel</strong> (Tecnología Propietaria)."

# fundadores-network/page.tsx
replace_in_file "src/app/fundadores-network/page.tsx" \
    "Producto con patente mundial (Gano Excel, 30\\+ años)" \
    "Producto con tecnología propietaria (Gano Excel, 30+ años)"

replace_in_file "src/app/fundadores-network/page.tsx" \
    "Duplicación\\. Residual\\. Binario\\. Patente mundial\\." \
    "Duplicación. Residual. Binario. Tecnología propietaria."

# fundadores-profesionales/page.tsx
replace_in_file "src/app/fundadores-profesionales/page.tsx" \
    "Gano Excel</strong> con patente mundial" \
    "Gano Excel</strong> con tecnología propietaria"

replace_in_file "src/app/fundadores-profesionales/page.tsx" \
    "una patente mundial que garantiza su unicidad" \
    "tecnología propietaria protegida por secretos industriales que garantiza su unicidad"

# inicio-2/page.tsx
replace_in_file "src/app/inicio-2/page.tsx" \
    "productos únicos con patente mundial" \
    "productos únicos con tecnología propietaria"

replace_in_file "src/app/inicio-2/page.tsx" \
    "Productos con Patente" \
    "Productos con Tecnología Propietaria"

replace_in_file "src/app/inicio-2/page.tsx" \
    "una patente mundial que garantiza su unicidad" \
    "tecnología propietaria protegida por secretos industriales que garantiza su unicidad"

replace_in_file "src/app/inicio-2/page.tsx" \
    "Gano Excel - Patente Mundial" \
    "Gano Excel - Tecnología Propietaria"

replace_in_file "src/app/inicio-2/page.tsx" \
    "productos con patente mundial" \
    "productos con tecnología propietaria"

echo ""
echo "======================================================="
echo "✅ Corrección completada: $TOTAL archivos actualizados"
echo "======================================================="
