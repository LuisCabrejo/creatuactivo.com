#!/usr/bin/env python3
"""
DaVinci Resolve — Automatización de color grade estilo Naval / Dan Koe
para videos de CreaTuActivo (epifania, mapa de salida, etc.)

REQUISITOS:
  1. DaVinci Resolve instalado y ABIERTO (no puede estar cerrado)
  2. LUT generado: python3 scripts/generate_lut.py
  3. Python 3.x (incluido con DaVinci o el del sistema)

USO:
  python3 scripts/davinci_naval.py --input /ruta/al/video-original.mp4 --name epifania

  Genera automáticamente en public/videos/:
    epifania-1080p.mp4   ← para web (principal)
    epifania-720p.mp4    ← para móvil
    epifania-poster.jpg  ← thumbnail (frame 3s)

EJEMPLOS:
  python3 scripts/davinci_naval.py --input ~/Desktop/epifania-raw.mp4 --name epifania
  python3 scripts/davinci_naval.py --input ~/Desktop/mapa-salida-raw.mp4 --name mapa-salida
"""

import sys
import os
import argparse
import subprocess

# ─── Rutas del proyecto ────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
LUT_PATH     = os.path.join(SCRIPT_DIR, "naval_style.cube")
OUTPUT_DIR   = os.path.join(PROJECT_ROOT, "public", "videos")

# ─── Configuración de DaVinci ──────────────────────────────────────────
DAVINCI_RESOLVE_LIB_PATHS = [
    "/Applications/DaVinci Resolve/DaVinci Resolve.app/Contents/Libraries/Fusion/",
    "/Applications/DaVinci Resolve/DaVinci Resolve.app/Contents/Frameworks/",
]

RENDER_PRESETS = {
    "1080p": {
        "FormatWidth": 1920,
        "FormatHeight": 1080,
        "VideoQuality": "Restrict to",
        "VideoBitRate": 10000,
        "AudioCodec": "aac",
        "AudioBitRate": "192",
        "suffix": "1080p",
    },
    "720p": {
        "FormatWidth": 1280,
        "FormatHeight": 720,
        "VideoQuality": "Restrict to",
        "VideoBitRate": 5000,
        "AudioCodec": "aac",
        "AudioBitRate": "128",
        "suffix": "720p",
    },
}


def connect_to_resolve():
    """Conectar a DaVinci Resolve en ejecución vía API Python."""
    # Agregar rutas de DaVinci al path de Python
    for path in DAVINCI_RESOLVE_LIB_PATHS:
        if os.path.exists(path) and path not in sys.path:
            sys.path.append(path)

    try:
        import DaVinciResolveScript as dvr_script
        resolve = dvr_script.scriptapp("Resolve")
        if resolve is None:
            raise RuntimeError("resolve es None")
        print("✅ Conectado a DaVinci Resolve")
        return resolve
    except (ImportError, RuntimeError) as e:
        print("❌ No se pudo conectar a DaVinci Resolve.")
        print("   → Asegúrate de que DaVinci Resolve esté ABIERTO")
        print("   → En DaVinci: Preferences → General → Enable scripting API")
        print(f"   Error: {e}")
        sys.exit(1)


def setup_project(resolve, video_name):
    """Crear proyecto nuevo en DaVinci."""
    project_manager = resolve.GetProjectManager()
    project_name = f"CreaTuActivo-{video_name}"

    # Cerrar proyecto actual si hay uno abierto
    current = project_manager.GetCurrentProject()
    if current:
        project_manager.CloseProject(current)

    # Crear nuevo proyecto
    project = project_manager.CreateProject(project_name)
    if not project:
        # Si ya existe, abrirlo
        project = project_manager.LoadProject(project_name)
    if not project:
        print(f"❌ No se pudo crear/abrir proyecto: {project_name}")
        sys.exit(1)

    print(f"✅ Proyecto: {project_name}")
    return project


def import_and_create_timeline(project, input_path, video_name):
    """Importar video y crear timeline."""
    media_pool = project.GetMediaPool()
    root_folder = media_pool.GetRootFolder()

    # Importar video al Media Pool
    clips = media_pool.ImportMedia([input_path])
    if not clips:
        print(f"❌ No se pudo importar el video: {input_path}")
        sys.exit(1)

    clip = clips[0]
    print(f"✅ Video importado: {os.path.basename(input_path)}")

    # Crear timeline
    timeline = media_pool.CreateTimelineFromClips(
        f"Timeline-{video_name}", [clip]
    )
    if not timeline:
        print("❌ No se pudo crear el timeline")
        sys.exit(1)

    project.SetCurrentTimeline(timeline)
    print("✅ Timeline creado")
    return timeline, clip


def apply_lut_to_timeline(project, timeline):
    """Aplicar naval_style.cube en el nodo de color del primer clip."""
    if not os.path.exists(LUT_PATH):
        print(f"❌ LUT no encontrado: {LUT_PATH}")
        print("   → Ejecuta primero: python3 scripts/generate_lut.py")
        sys.exit(1)

    # Obtener el primer clip del timeline en la pista de video
    track_count = timeline.GetTrackCount("video")
    if track_count == 0:
        print("❌ No hay pistas de video en el timeline")
        sys.exit(1)

    items = timeline.GetItemListInTrack("video", 1)
    if not items:
        print("❌ No hay clips en la pista de video")
        sys.exit(1)

    clip_item = items[0]

    # Aplicar LUT en el nodo de color (node 1 = Input)
    # DaVinci usa índice de nodo (1-based)
    result = clip_item.SetLUT(1, LUT_PATH)
    if result:
        print(f"✅ LUT aplicado: naval_style.cube")
    else:
        print("⚠️  No se pudo aplicar LUT vía SetLUT() — puede requerir Color page manual")
        print("   → En DaVinci Color page: clic derecho en nodo → Apply LUT → naval_style.cube")


def render_outputs(project, video_name):
    """Exportar en 1080p y 720p a public/videos/."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    render_jobs = []

    for quality, settings in RENDER_PRESETS.items():
        suffix = settings["suffix"]
        output_filename = f"{video_name}-{suffix}.mp4"
        output_path = os.path.join(OUTPUT_DIR, output_filename)

        project.SetRenderSettings({
            "SelectAllFrames": True,
            "TargetDir": OUTPUT_DIR,
            "CustomName": f"{video_name}-{suffix}",
            "ExportVideo": True,
            "ExportAudio": True,
            "FormatWidth": settings["FormatWidth"],
            "FormatHeight": settings["FormatHeight"],
            "VideoQuality": settings["VideoQuality"],
            "VideoBitRate": settings["VideoBitRate"],
            "AudioCodec": settings["AudioCodec"],
            "AudioBitRate": settings["AudioBitRate"],
        })

        job_id = project.AddRenderJob()
        if job_id:
            render_jobs.append((job_id, output_filename))
            print(f"✅ Job de render agregado: {output_filename}")
        else:
            print(f"⚠️  No se pudo agregar job de render para {quality}")

    if render_jobs:
        print(f"\n🎬 Iniciando render de {len(render_jobs)} archivos...")
        project.StartRendering()

        # Esperar a que termine
        import time
        while project.IsRenderingInProgress():
            status = project.GetRenderJobStatus(render_jobs[0][0])
            progress = status.get("JobProgress", 0) if status else 0
            print(f"\r   Progreso: {progress:.0f}%", end="", flush=True)
            time.sleep(2)

        print("\n✅ Render completado")

        for job_id, filename in render_jobs:
            out_path = os.path.join(OUTPUT_DIR, filename)
            if os.path.exists(out_path):
                size = os.path.getsize(out_path) / (1024 * 1024)
                print(f"   📁 {filename} — {size:.1f} MB")


def generate_poster(video_name):
    """Extraer frame en segundo 3 como poster JPG usando FFmpeg."""
    input_path = os.path.join(OUTPUT_DIR, f"{video_name}-1080p.mp4")
    output_path = os.path.join(OUTPUT_DIR, f"{video_name}-poster.jpg")

    if not os.path.exists(input_path):
        print(f"⚠️  No se encontró {input_path} para generar poster")
        return

    cmd = [
        "ffmpeg", "-i", input_path,
        "-ss", "00:00:03",
        "-vframes", "1",
        "-q:v", "2",
        "-y", output_path
    ]
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode == 0:
        print(f"✅ Poster generado: {video_name}-poster.jpg")
    else:
        print("⚠️  No se pudo generar el poster — hazlo manualmente desde el video 1080p")


def main():
    parser = argparse.ArgumentParser(
        description="DaVinci Resolve automation — Naval/Dan Koe color grade"
    )
    parser.add_argument(
        "--input", required=True,
        help="Ruta al video original sin editar (ej: ~/Desktop/epifania-raw.mp4)"
    )
    parser.add_argument(
        "--name", required=True,
        help="Nombre del video (ej: epifania, mapa-salida, fundadores)"
    )
    args = parser.parse_args()

    input_path = os.path.expanduser(args.input)
    video_name = args.name

    if not os.path.exists(input_path):
        print(f"❌ Video no encontrado: {input_path}")
        sys.exit(1)

    print()
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("   DAVINCI NAVAL — CreaTuActivo Color Grade")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"   Video:  {os.path.basename(input_path)}")
    print(f"   Nombre: {video_name}")
    print(f"   LUT:    {LUT_PATH}")
    print(f"   Output: {OUTPUT_DIR}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()

    resolve   = connect_to_resolve()
    project   = setup_project(resolve, video_name)
    timeline, _ = import_and_create_timeline(project, input_path, video_name)
    apply_lut_to_timeline(project, timeline)
    render_outputs(project, video_name)
    generate_poster(video_name)

    print()
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("   ✅ PROCESO COMPLETADO")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()
    print("   Archivos listos en public/videos/:")
    for quality in RENDER_PRESETS:
        print(f"     {video_name}-{RENDER_PRESETS[quality]['suffix']}.mp4")
    print(f"     {video_name}-poster.jpg")
    print()
    print("   Siguiente paso:")
    print("     node scripts/upload-to-blob.mjs")
    print()


if __name__ == "__main__":
    main()
