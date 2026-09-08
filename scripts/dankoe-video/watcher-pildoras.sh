#!/bin/zsh
# Vigila la carpeta de entrada del reto en Drive y procesa cada video con pildora.py.
# Lo dispara launchd cada minuto (com.creatuactivo.pildoras).
# Instrucciones opcionales: un .txt con el MISMO nombre del video.

export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
BASE="/Users/luiscabrejo/Cta/marketing/scripts/dankoe-video"
DRIVE="/Users/luiscabrejo/Library/CloudStorage/GoogleDrive-sistema@creatuactivo.com/Mi unidad/videos/reto-90"
ENTRADA="$DRIVE/entrada"; SALIDA="$DRIVE/salida"; HECHOS="$DRIVE/entrada/procesados"
PY="$BASE/captions/.venv/bin/python"
LOCK="/tmp/creatuactivo-pildoras.lock"

mkdir -p "$ENTRADA" "$SALIDA" "$HECHOS"

# un candado huérfano de una corrida muerta se suelta a la hora. Va ANTES de intentar
# tomarlo: si va después, un candado atascado deja el vigilante mudo para siempre.
find /tmp -maxdepth 1 -name "creatuactivo-pildoras.lock" -mmin +60 -exec rmdir {} \; 2>/dev/null

# un solo proceso a la vez: un render tarda minutos y launchd dispara cada minuto
if ! mkdir "$LOCK" 2>/dev/null; then exit 0; fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT INT TERM

avisar() { osascript -e "display notification \"$1\" with title \"CreaTuActivo · video\"" 2>/dev/null; }

if ! ls "$ENTRADA" >/dev/null 2>&1; then
  echo "[$(date '+%F %T')] ⛔ no puedo leer $ENTRADA — falta Acceso completo al disco para este agente"
  avisar "Sin permiso para leer la carpeta de Drive"
  exit 1
fi

setopt NULL_GLOB
for f in "$ENTRADA"/*.(mp4|MP4|mov|MOV|m4v|M4V); do
  nombre="${f:t:r}"

  # esperar a que Drive termine de bajarlo: el tamaño tiene que dejar de cambiar
  s1=-1; s2=$(stat -f%z "$f" 2>/dev/null || echo 0)
  intentos=0
  while [[ "$s1" != "$s2" && $intentos -lt 40 ]]; do
    s1=$s2; sleep 5; s2=$(stat -f%z "$f" 2>/dev/null || echo 0); ((intentos++))
  done
  [[ "$s2" -lt 100000 ]] && continue          # todavía es un marcador, no el archivo

  # instrucciones del .txt hermano
  flags=()
  nota="$ENTRADA/$nombre.txt"
  [[ -f "$ENTRADA/$nombre.TXT" ]] && nota="$ENTRADA/$nombre.TXT"
  if [[ -f "$nota" ]]; then
    txt=$(tr '[:upper:]' '[:lower:]' < "$nota" | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null || cat "$nota")
    [[ "$txt" == *"sin musica"* || "$txt" == *"sin música"* ]] && flags+=(--sin-musica)
    [[ "$txt" == *"lut"* || "$txt" == *"d-log"* || "$txt" == *"dlog"* ]] && flags+=(--lut)
    [[ "$txt" == *"outro"* || "$txt" == *"emblema"* || "$txt" == *"cierre de marca"* ]] && flags+=(--outro)
  fi

  echo "[$(date '+%F %T')] ▸ $nombre  flags=${flags[*]:-ninguno}"
  if "$PY" "$BASE/pildora.py" "$f" $flags 2>&1; then
    mv -f "$f" "$HECHOS/" 2>/dev/null
    [[ -f "$nota" ]] && mv -f "$nota" "$HECHOS/" 2>/dev/null
    echo "[$(date '+%F %T')] ✅ $nombre"
    avisar "Listo: $nombre"
  else
    # el error viaja a Drive para que se vea desde el celular
    {
      echo "No se pudo procesar $nombre"
      echo "$(date '+%F %T')"
      echo "Mire el detalle en ~/Library/Logs/creatuactivo-pildoras.log"
    } > "$SALIDA/$nombre-ERROR.txt"
    echo "[$(date '+%F %T')] ❌ $nombre"
    avisar "Falló: $nombre"
  fi
done
