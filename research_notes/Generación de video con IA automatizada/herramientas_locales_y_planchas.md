# Local tools for an 8 GB Apple M1 and keyframe image models with API access (state as of 26 Sep 2026)

Context for the report writer: the target machine was checked locally on 26 Sep 2026. It runs **macOS 26.6.2 (build 25G83)** with **8 GB unified memory** (`sysctl hw.memsize` = 8589934592). **ffmpeg 8.1.1** (Homebrew) is installed with `delogo`, `removelogo`, `minterpolate`, `framerate` and `scale_vt` filters. It does **not** have `libplacebo` or `zscale`. `rife-ncnn-vulkan` and `realesrgan-ncnn-vulkan` are **not** installed. The repo already runs BiRefNet as ONNX (`~/.u2net/birefnet-general.onnx`, 973 MB) through onnxruntime `CPUExecutionProvider` in `scripts/dankoe-video/process_video.py`. It does not use the CoreML execution provider, even though CLAUDE.md describes it as "CoreML M1". All of this comes from a local shell inspection, not from a web source.

## A1. Frame interpolation (RIFE, FILM, rife-ncnn-vulkan, Practical-RIFE) on Apple Silicon at 1080×1920

### Takeaway
The most practical option on an 8 GB M1 is the **rife-ncnn-vulkan** binary, which runs on Metal through MoltenVK and ships a macOS executable. A second option is Apple's own **VTFrameProcessor frame-rate conversion**, which is built into macOS 15.4+ (so this macOS 26 machine has it), but it needs a small Swift wrapper. **Practical-RIFE** (PyTorch, newest models v4.25/4.26) does not document Mac/MPS support. ffmpeg `minterpolate` is always available as a CPU fallback. I found no published fps or runtime numbers for 1080×1920 on an M1, so speed has to be measured.

### Cited Findings
- **rife-ncnn-vulkan** (nihui) is RIFE on the ncnn engine with Vulkan. The README lists "Windows/Linux/MacOS Executable for Intel/AMD/Nvidia GPU" on the releases page. The newest model bundled in the ncnn port is **rife-v4.6** (older v4, v3.x and v2.x are also included). Flags: `-n` target frame count, `-m` model path, `-j load:proc:save` threads, `-x` spatial TTA, `-u` UHD mode. For macOS it can be built with `-DUSE_STATIC_MOLTENVK=ON` to avoid linking the Vulkan loader — [nihui/rife-ncnn-vulkan](https://github.com/nihui/rife-ncnn-vulkan)
- nihui announced that "dain/cain/rife-ncnn-vulkan now supports Apple M1 Silicon" (Patreon post title) — [Patreon](https://www.patreon.com/posts/dain-cain-rife-45238303)
- On Apple Silicon, MoltenVK 1.1.1 (Dec 2020) added Vulkan support. The Homebrew route is to install `vulkan-loader` + `molten-vk`. "Some GPUs like Apple M1 can only accept 1 GPU thread" — [search summary citing nihui/MoltenVK sources](https://github.com/nihui/rife-ncnn-vulkan); [MoltenVK](https://en.wikipedia.org/wiki/MoltenVK)
- A Python binding exists on PyPI (`rife-ncnn-vulkan-python`) — [PyPI](https://pypi.org/project/rife-ncnn-vulkan-python/)
- **Practical-RIFE** (hzwer): newest model **v4.26 (21 Sep 2024)**, with v4.25 recommended as the default. Install with `git clone` + `pip3 install -r requirements.txt` (Python ≤ 3.11). Usage: `python3 inference_video.py --multi=2 --video=video.mp4`, where `--exp` gives a 2^exp multiplier. `--scale=0.5` (or `--UHD`) is recommended for 4K. MIT license. **Apple MPS/Mac is not mentioned** — [hzwer/Practical-RIFE](https://github.com/hzwer/Practical-RIFE)
- **Apple VTFrameProcessor** (Video Toolbox): "Starting in macOS 15.4, Video Toolbox was enhanced with VTFrameProcessor API. A new set of ML-based video processing algorithms optimized for Apple Silicon." The effects are **Frame Rate Conversion** (including slow motion), **Super Resolution**, Motion Blur, Temporal Noise Filter, Low Latency Frame Interpolation and Low Latency Super Resolution. Frame rate conversion is configured with `VTFrameRateConversionConfiguration(frameWidth:, frameHeight:, usePrecomputedFlow:, qualityPrioritization:, revision:)` — [WWDC25 session 300](https://developer.apple.com/videos/play/wwdc2025/300); [Apple docs: VTFrameProcessor](https://developer.apple.com/documentation/videotoolbox/vtframeprocessor)
- One third-party report (macOS 26.7, M4) says the *low-latency* super-resolution scaler is capped at a 921,600-pixel budget (max 960×960 source), and that `VTSuperResolutionScaler` is 4× only and needs a model download. This is secondary and unverified — [search snippet; lrylnx/frameinterp release notes](https://github.com/lrylnx/frameinterp/releases/tag/v1.4)
- A third-party open-source Mac player (FrameInterp) does real-time interpolation on the Apple Neural Engine, 24/30 → 60/96 fps. This shows the hardware path works, but it is a player, not a batch tool — [lrylnx/frameinterp](https://github.com/lrylnx/frameinterp)
- **ffmpeg-native:** `minterpolate` has modes `dup`, `blend` and `mci` (motion-compensated), and there is also a `framerate` filter — [FFmpeg filters doc](https://ffmpeg.org/ffmpeg-filters.html#delogo). Both are present in the local ffmpeg 8.1.1 build (local check).

### Inferences
- Recommended order for this machine: (1) the `rife-ncnn-vulkan` macOS release binary with model `rife-v4.6`, called from Python via subprocess on extracted PNG frames (`-n` to double the frames); (2) a ~50-line Swift CLI around `VTFrameRateConversionConfiguration`, which Claude Code can write, has zero model downloads and is Apple-supported; (3) `minterpolate=mi_mode=mci` only as a last resort. On flat matte geometry over a regular grid floor, `mci` typically produces warping and "swimming" of grid lines.
- On an 8 GB M1 a 1080×1920 RIFE pass should fit in memory, because RIFE is a small optical-flow network and ncnn runs it tile-free at 1080p. Throughput has not been measured, though. Run a 2-second benchmark before committing to it.
- For AI-generated clips, interpolation is mainly useful for 24→30/60 fps conformance or slow motion. Remotion can also just play 24 fps clips inside a 30 fps composition. Interpolation may not be needed at all.
- **FILM** (Google) is TensorFlow-based. I found no Apple Silicon build and did not research it further, so it is not recommended here.

### Gaps
- No measured fps or seconds-per-frame for any of these tools on an 8 GB M1 at 1080×1920. I could not find a published benchmark.
- I did not confirm whether a Homebrew formula exists for `rife-ncnn-vulkan`. The README only points to GitHub releases. I also did not confirm the date of the latest release tag or whether the macOS zip is arm64 or universal.
- Whether Practical-RIFE runs with `device=mps` (PyTorch on Metal) is undocumented. It would need testing.
- The published VTFrameProcessor docs I read do not state its resolution limits.

## A2. Upscaling (Real-ESRGAN ncnn, Topaz Video, ffmpeg-native)

### Takeaway
**realesrgan-ncnn-vulkan** has macOS binaries and runs through Vulkan/MoltenVK. It is the realistic free AI upscaler for 8 GB. **Topaz Video officially requires 16 GB RAM minimum on Apple Silicon**, so it is out of spec for this machine. ffmpeg's native path here is Lanczos scaling (`scale=...:flags=lanczos`), because this Homebrew build lacks libplacebo and zscale. Apple's VTFrameProcessor Super Resolution is a native alternative with caveats.

### Cited Findings
- Real-ESRGAN-ncnn-vulkan models: `realesr-animevideov3`, `realesrgan-x4plus`, `realesrgan-x4plus-anime`, `realesnet-x4plus`. Flags: `-s` scale (2/3/4), `-t` tile size (smaller tiles use less GPU memory), `-n` model, `-f` png/jpg/webp, `-j` threads — [xinntao/Real-ESRGAN-ncnn-vulkan](https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan)
- macOS zips are published (e.g., `realesrgan-ncnn-vulkan-20220424-macos.zip`, v0.2.5.0) — [SourceForge mirror](https://sourceforge.net/projects/real-esrgan.mirror/files/v0.2.5.0/realesrgan-ncnn-vulkan-20220424-macos.zip/download)
- On Apple chips, "arm64 single-architecture performance is better than universal2" (search summary of Real-ESRGAN community notes). This is secondary — [SourceForge project](https://sourceforge.net/projects/real-esrgan-ncnn-vulkan.mirror/)
- A community script adapts realesrgan-ncnn-vulkan for faster video rendering on macOS — [JustinButler700/realesrgan-video-script](https://github.com/JustinButler700/realesrgan-video-script)
- **Topaz Video (official):** minimum macOS 13, "M-series" with **16 GB RAM** minimum. Recommended: macOS 26, M-series Pro/Max/Ultra, 32 GB+. The Starlight models need M-series Pro/Max/Ultra with 36 GB. Starlight Precise 2.5/Hyperion 2 need macOS 26 + 16 GB (24 GB+ recommended) — [Topaz Video system requirements](https://docs.topazlabs.com/topaz-video/system-requirements)
- Topaz Video moved to a subscription for new customers: **$299/year** Personal plan (third-party reviews, 2026) — [VideoProc review](https://www.videoproc.com/resource/topaz-video-ai-review.htm)
- Apple VTFrameProcessor includes a "Super Resolution" effect that "enhances video resolution and restores fine details" (macOS 15.4+) — [WWDC25 session 300](https://developer.apple.com/videos/play/wwdc2025/300). The claim that it is 4× only and needs a model download comes from a third-party report and is unverified — [lrylnx/frameinterp](https://github.com/lrylnx/frameinterp/releases/tag/v1.4)
- Local ffmpeg 8.1.1 has `scale_vt` (VideoToolbox scaling) but no `libplacebo`/`zscale` (local check).

### Inferences
- For this workflow, upscaling matters mainly if clips come out at 720p. Veo 3.1 via API defaults to 720p and offers 1080p/4K only for 8-second clips; see [Gemini API Veo docs](https://ai.google.dev/gemini-api/docs/veo). Generating at 1080p natively is better than upscaling.
- For clean stylized CG (flat matte gray, hard edges), `realesr-animevideov3` (fast, made for video) is likely a better fit than the photographic `realesrgan-x4plus`, and Lanczos 720→1080 (1.5×) may be visually sufficient. This is an inference; test both.
- Real-ESRGAN at ×4 on 1080×1920 creates 4320×7680 intermediates that must be downscaled back, which wastes time and memory. Use `-s 2` from 720p and let ffmpeg finish the resize.

### Gaps
- No verified M1 throughput numbers for Real-ESRGAN-ncnn on video. The latest release tag and date were not confirmed from the GitHub releases page.
- Not verified whether VTSuperResolutionScaler accepts 1080×1920 portrait input and at what ratios.

## A3. Background/object removal and video matting on M1 (BiRefNet, RMBG-2.0, SAM 2, Robust Video Matting)

### Takeaway
**BiRefNet (MIT)** is the right default. It is already in the repo (ONNX, CPU provider). **RMBG-2.0 is CC BY-NC 4.0**, so commercial reels need a BRIA agreement. **Robust Video Matting** ships ready-made **CoreML models at 1920×1080**, but it is GPL-3.0 and trained for humans. **SAM 2.1** runs on MPS and has an MLX port, but video tracking memory is tight on 8 GB.

### Cited Findings
- **BiRefNet** variants: general (2048×2048 and a lighter swin_v1_tiny), **BiRefNet_lite-2K** (inputs up to 2560×1440), BiRefNet_HR (2048², Feb 2025), **BiRefNet_HR-matting**, and BiRefNet_dynamic (256²–2304²). Inference memory at 1024² is **4.8 GB FP32 / 3.5 GB FP16** (measured on NVIDIA). ONNX conversion is supported but runs "~90% more time" than PyTorch on A100. **MIT license.** Latest news: 23 Sep 2025 (SDPA attention) — [ZhengPeng7/BiRefNet](https://github.com/ZhengPeng7/BiRefNet)
- **RMBG-2.0** (BRIA) is built on the BiRefNet architecture with a proprietary dataset, takes 1024×1024 input, and is licensed CC BY-NC 4.0: "Commercial deployment requires a commercial agreement with BRIA." — [HF briaai/RMBG-2.0](https://huggingface.co/briaai/RMBG-2.0)
- **Robust Video Matting**: exports to PyTorch, TorchScript, ONNX, TF, TF.js and **CoreML**, with CoreML models at 1280×720 (downsample 0.375) and **1920×1080 (downsample 0.25)** in FP16 and INT8. Recommended `downsample_ratio`: 0.25 for HD, 0.125 for 4K. **GPL-3.0**. Last update Nov 2021 — [PeterL1n/RobustVideoMatting](https://github.com/PeterL1n/RobustVideoMatting)
- **SAM 2.1** runs on Apple Silicon via PyTorch MPS (community repo, Tiny model 74.5 MB) — [ice-ice-bear/sam2-mac-test](https://github.com/ice-ice-bear/sam2-mac-test). An **MLX port** supports video object tracking — [eisneim/sam2.1_mlx](https://github.com/eisneim/sam2.1_mlx). For reference, SAM 3.1 tracks 720p video at ~1.3 fps with a ~7 GB peak on an M5 (PR description) — [facebookresearch/sam3 PR #627](https://github.com/facebookresearch/sam3/pull/627)
- Local: the repo's `process_video.py` loads `birefnet-general.onnx` with `providers = ["CPUExecutionProvider"]`. Its `preprocess()` resizes to **320×320** (docstring says "u2net"), while the comment on the output says `(1, 1, 1024, 1024)` (local file inspection).

### Inferences
- For 3D explainer compositing, matting is mostly needed to lift a figure or object from one generated clip and place it over another. For stylized matte geometry on a dark grid, **BiRefNet_lite-2K or BiRefNet_HR-matting** per frame is the best license and quality fit. Its per-frame output flickers at edges, so add a temporal smoothing pass, such as an alpha EMA or median over 3 frames.
- Switching the existing ONNX session to `CoreMLExecutionProvider` (or exporting to CoreML) could speed things up, but that is untested. The **320×320 preprocessing is likely leaving quality on the table**, since BiRefNet is trained at 1024². Worth checking, but outside this research scope.
- RVM's portrait-matting training suits human subjects only. It is a poor fit for gray geometry or parcels, and GPL-3.0 matters if the code is redistributed. RMBG-2.0 is excluded for commercial use without a license.
- Often the cheaper path for compositing is to ask the image or video model for a clean plate or a solid-color background, rather than matting.

### Gaps
- No M1 timings for BiRefNet ONNX/CoreML at 1080×1920. The NVIDIA memory figures may not map 1:1 to unified memory.
- SAM 2.1 video-mode memory at 1080p on 8 GB is not documented.

## A4. Removing or covering the small Gemini-app corner watermark: technical options and ToS/legal

### Takeaway
The cleanest route is not removal but **avoidance**. The Gemini app has a **"Media Watermark" setting that turns the visible watermark off** (except in India, South Korea and Vietnam, where only AI Ultra users get the toggle). **Veo through the Gemini API/Vertex carries only the invisible SynthID** watermark. Technically, `crop`+`scale`, `delogo`/`removelogo`, LaMa inpainting or a Remotion overlay can all hide a corner mark. **SynthID survives all of them**, so removal does not hide AI provenance. Google's published policies I checked **do not explicitly ban** removing the visible mark; they ban misrepresenting provenance to deceive.

### Cited Findings
- **Gemini app setting:** go to gemini.google.com → Settings → **"Media Watermark"** to toggle the visible watermark for images, videos and music. "This setting only controls the visible watermark. It doesn't affect SynthID watermarks or Content Credentials for media you create with Gemini Apps." "If you are in India, South Korea, or Vietnam, you'll only see this setting if you have an AI Ultra subscription." — [Gemini Apps Help: Manage watermark settings](https://support.google.com/gemini/answer/17405358?hl=en)
- "All AI-generated media created or edited with Gemini Apps includes an invisible SynthID watermark" — [Gemini Apps Help: Verify AI-generated content](https://support.google.com/gemini/answer/16722517?hl=en&co=GENIE.Platform%3DDesktop)
- **Veo via Gemini API:** "Videos created by Veo are watermarked using SynthID." Model IDs are `veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview` and `veo-3.1-lite-generate-preview`. It supports **first + last frame** interpolation, 16:9 and **9:16**, 720p default, and 1080p/4K only for 8 s clips (4K not on Lite) — [Gemini API Veo docs](https://ai.google.dev/gemini-api/docs/veo). The docs mention SynthID only, not a visible mark. Secondary sources state explicitly "API-generated videos have no visible watermark" — [aifreeapi Veo 3.1 watermarks guide (Jan 2026)](https://www.aifreeapi.com/en/posts/veo-3-1-watermarks-synthid)
- In the Gemini app the visible mark is a "Veo" wordmark on video (usually bottom corner) or a four-point sparkle on images, as described by a watermark-remover vendor (a biased source). Flow users report a visible ✦ on videos even with Google AI Ultra — [Gemini Community thread](https://support.google.com/gemini/thread/451900454/google-ai-ultra-visible-%E2%9C%A6-watermark-appears-on-every-flow-generated-video?hl=en)
- **Google Generative AI Prohibited Use Policy** (last modified 17 Dec 2024) prohibits "Misrepresenting the provenance of generated content by claiming it was created solely by a human, in order to deceive" and "Circumvention of abuse protections or safety filters." It does **not** mention watermarks or SynthID — [policies.google.com](https://policies.google.com/terms/generative-ai/use-policy)
- **Gemini API Additional Terms** (last modified 23 Mar 2026): "Google won't claim ownership over that content." No clause on watermarks or removing notices was found — [ai.google.dev/gemini-api/terms](https://ai.google.dev/gemini-api/terms)
- **ffmpeg** `delogo` (x, y, w, h, `show`) removes a logo by interpolating surrounding pixels. `removelogo` uses a mask image. Both are in the local build — [FFmpeg filters](https://ffmpeg.org/ffmpeg-filters.html#delogo)
- **LaMa via IOPaint** (Apache-2.0) runs on `--device=mps`. Batch mode: `iopaint run --model=lama --device=... --image=<dir> --mask=<dir> --output=<dir>`. **The repo was archived on 13 Aug 2025** (read-only, unmaintained) — [Sanster/IOPaint](https://github.com/Sanster/IOPaint); install `pip3 install iopaint` — [iopaint.com/install](https://www.iopaint.com/install)
- **ProPainter** (video inpainting) needs 7 GB (fp16) for 720×480×50 frames and 19 GB (fp16) for 1280×720×50 frames of GPU memory. It is licensed **NTU S-Lab License 1.0, non-commercial only** — [sczhou/ProPainter](https://github.com/sczhou/ProPainter)
- **EU AI Act Art. 50** transparency obligations apply from **2 Aug 2026**. Deployers of deepfake video must disclose it, and "cannot simply rely on the machine-readable marking embedded… by the provider." The provider marking obligations have a grace period to 2 Dec 2026 for systems already on the market — [artificialintelligenceact.eu guide](https://artificialintelligenceact.eu/transparency-rules-article-50/). Deadlines were being amended by the EU (digital omnibus) — [Latham & Watkins](https://www.lw.com/en/insights/ai-act-update-eu-resolves-to-change-rules-and-extend-deadlines)
- Watermark-remover sites claim removal "is legal in most places." They are commercially interested and cite no law — [example vendor](https://creatorlanehq.com/tools/remove-video-watermark). Treat as non-authoritative.

### Inferences
- **Recommended:** turn off "Media Watermark" in the Gemini app settings, since the user is in Colombia, outside the restricted countries. Alternatively, generate through the Gemini API (Veo 3.1 with `lastFrame`), which has no visible mark and supports 9:16 plus first/last frame. Both are Google-sanctioned, need no post-processing and carry no ToS ambiguity.
- For already-generated clips, the least destructive technical fix on a static camera is a **Remotion overlay** (brand bug or lower-third over the corner) or a **crop + rescale**. For example, crop ~6–8% off the watermark corner and scale back to 1080×1920 with Lanczos; this slightly zooms the frame and must be applied identically to every clip in a sequence to keep continuity. `delogo` on a dark grid floor will visibly smear grid lines. Per-frame LaMa flickers unless the region is static. ProPainter is both too heavy for 8 GB at this resolution and non-commercial.
- Removing the visible mark does not remove SynthID, and the clips remain machine-detectable as Google AI. For a stylized abstract explainer (not a realistic depiction of real people or places), the EU "deepfake" disclosure is unlikely to apply, and the user operates in Colombia. This is not legal advice. Platform AI-labeling rules (Meta/TikTok) were not researched.

### Gaps
- I did not verify the Google Terms of Service (general, which govern the consumer Gemini app) for a clause on altering notices or brand features. Only the Prohibited Use Policy and the Gemini API terms were read.
- Whether the Gemini-app "Media Watermark" toggle depends on plan (free vs AI Pro) outside the three named countries is not stated explicitly.
- No Colombian legal source on AI watermark removal was researched.

## A5. Can open video generation models (Wan 2.x, LTX-2.x, HunyuanVideo, CogVideoX, Mochi) run locally on an 8 GB M1?

### Takeaway
**No, not realistically.** The smallest current models need 24 GB of VRAM on CUDA (Wan 2.2 TI2V-5B), and the LTX-2.5 download alone is ~66 GiB. Even a **64 GB M1 Max** took **82 minutes for a 2-second 832×480 Wan 2.2 clip**, and FP8 does not work on Metal. On 8 GB unified memory, the weights plus text encoder do not fit, so these belong on cloud APIs.

### Cited Findings
- **Wan 2.2:** T2V-A14B / I2V-A14B need "at least 80GB VRAM" (reducible with offloading). **TI2V-5B** (720p) needs "at least 24GB VRAM (e.g., RTX 4090)" and makes 5 s of 720p in under 9 min. No Apple Silicon/MPS mention. Latest news 13 Nov 2025 — [Wan-Video/Wan2.2](https://github.com/Wan-Video/Wan2.2)
- **LTX-2.x:** the current recommended model is **LTX-2.5 (22B distilled and dev)**, and LTX-2.3 is legacy. The full download is **~66 GiB**; FP8 and CPU/disk offload lower the footprint. `natten` is "Linux + CUDA only". There is no explicit Apple Silicon/MLX support. It does support first/last-frame keyframe pipelines (`KeyframeInterpolationPipeline`, `ICLoraPipeline`) — [Lightricks/LTX-2](https://github.com/Lightricks/LTX-2)
- **Measured on an M1 Max with 64 GB** (article from 1 Mar 2026, updated 29 Apr 2026): Wan 2.2 GGUF Q4_K_S (24 GB of files) took **82 min per 2 s clip** (832×480, 33 frames at 16 fps). LTX-2 GGUF took 6 min 54 s for 512×288 T2V and 13 min 42 s for 768×512 I2V (33 frames, with LoRA); LTX-2 files total ~42 GB. **FP8 failed on Metal** ("Undefined type Float8_e4m3fn"). GGUF ran "with quality issues." Tooling: ComfyUI + city96/ComfyUI-GGUF, no MLX — [lilting.ch](https://lilting.ch/en/articles/ltx2-wan22-mac-local-video-gen)
- **CogVideoX:** with all diffusers optimizations (CUDA), CogVideoX-2B needs "4GB minimum" (FP16), 5B "5GB minimum", 5B-I2V "4GB minimum" (720×480 or variable, max 49 frames, ~90–180 s on A100), and 1.5-5B "from 10GB" (1360×768, 81 frames, ~1000 s on A100). No MPS mention. Latest news 24 Mar 2025 — [zai-org/CogVideo](https://github.com/zai-org/CogVideo)
- General guidance: 8 GB Macs "can run tiny 3B models but cannot run anything genuinely useful" (LLM context) — [SitePoint 2026](https://www.sitepoint.com/local-llms-apple-silicon-mac-2026/)

### Inferences
- CogVideoX's 4–5 GB figures are *VRAM with sequential CPU offload on NVIDIA*, which assumes plentiful separate system RAM for the offloaded weights (including a large T5 text encoder). On an 8 GB **unified** machine there is no separate pool to offload to, so these minimums do not carry over. Extrapolating from the M1 Max numbers, even if it loaded, runtime would be hours per clip at sub-HD resolution, and native output is landscape 720×480, not 9:16.
- HunyuanVideo and Mochi are larger than the models above, so they are also infeasible on 8 GB (inference, not separately verified).
- Conclusion for the workflow: use the M1 only for ffmpeg, Python, Remotion, interpolation, upscaling and matting. Generate clips via cloud APIs (e.g., Veo 3.1 via Gemini API, which supports 9:16 plus first and last frame).

### Gaps
- I did not fetch the HunyuanVideo or Mochi READMEs to quote their exact memory requirements.
- No report found of anyone running any of these video models on an 8 GB M1 at all, successfully or not.

## B1. Keyframe image models with API: editing, 9:16, max resolution, price, access route, watermark

### Takeaway
All the major API image models now do **instruction-based editing of an input image**. The strongest mid-price option with native 9:16 up to 4K is **Google Nano Banana 2 (`gemini-3.1-flash-image`, $0.067 per 1K image, $0.101 per 2K)**. **Imagen 4 was shut down on the Gemini API (17 Aug 2026)**, and **Gemini 2.5 Flash Image (original Nano Banana) shuts down 2 Oct 2026**. OpenAI's newest are `gpt-image-2.5-sunburst`/`-flare` and `gpt-image-2`. BFL's current line is FLUX.2, with Kontext now "previous generation." None of the API outputs verified here carry a *visible* watermark by default, with one exception: **Seedream's BytePlus API has a `watermark` parameter** that adds a visible "AI generated" label in the lower-right when true.

### Cited Findings — Google (Gemini API key via AI Studio; also Vertex AI)
- Gemini API pricing page (last updated **24 Sep 2026**):
  - **Gemini 3.1 Flash Image "Nano Banana 2"** `gemini-3.1-flash-image`: input $0.50/1M tokens, output $60/1M tokens = **$0.045 (0.5K), $0.067 (1K), $0.101 (2K), $0.151 (4K) per image**. Batch is half price ($0.022/$0.034/$0.050/$0.076).
  - **Gemini 3.1 Flash Lite Image "Nano Banana 2 Lite"** `gemini-3.1-flash-lite-image`: ~$0.0336 per 1K image (batch ~$0.0168).
  - **Gemini 3 Pro Image "Nano Banana Pro"** `gemini-3-pro-image`: **$0.134 (1K/2K), $0.24 (4K)**.
  - **Gemini 2.5 Flash Image "Nano Banana"** `gemini-2.5-flash-image`: $0.039 per image, **deprecated, shutdown 2 Oct 2026**.
  - Source: [ai.google.dev pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Aspect ratios for 3.1 Flash/Flash Lite are 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, **9:16**, 16:9 and 21:9 (Pro supports the same). 3.1 Flash offers 512px, 1K, 2K and 4K; Flash Lite 1K only; 3 Pro 1K/2K/4K. Parameters: `aspect_ratio`, `image_size` ("1K", with uppercase K required). Editing works as "text-and-image-to-image… add, remove, or modify elements," and the docs' own example instruction is *"Do not change any other elements of the image."* Reference images: up to 14 (3.1 Flash: 10 objects + 4 characters), 3 Pro up to 8. "All generated images include a SynthID watermark," which is invisible — [Gemini API image generation docs](https://ai.google.dev/gemini-api/docs/image-generation)
- Nano Banana 2 launched **26 Feb 2026**. It maintains "character resemblance of up to five characters and the fidelity of up to 14 objects in a single workflow," outputs 512px to 4K, and is available in the Gemini app, AI Studio/Gemini API (preview), Vertex AI (preview) and Flow. Provenance is SynthID + C2PA Content Credentials — [Google blog](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/)
- **Imagen 4** (`imagen-4.0-generate-001`, `-ultra-`, `-fast-`) was deprecated 15 Jun 2026 and **shut down on the Gemini API 17 Aug 2026**. Google maps all three to `gemini-3.1-flash-image` (secondary reporting of Google's deprecations table) — [kingy.ai tracker](https://kingy.ai/ai-launch-tracker/google-will-shut-down-three-imagen-4-api-models-august-17/); [Virtual Arc](https://www.virtualarcsoftware.com/blog/google-imagen4-gemini-api-shutdown/). Imagen 4 was also a text-to-image model, not an instruction editor.

### Cited Findings — OpenAI (OpenAI API key; Images API `generations` and `edits` endpoints)
- Models on the pricing page (accessed 26 Sep 2026) are `gpt-image-2.5-sunburst`, `gpt-image-2.5-flare`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1-mini`, `gpt-image-1` and `chatgpt-image-latest`. Output per 1M tokens: $30 (2.5 variants and gpt-image-2), $32 (1.5), $8 (1-mini), $40 (gpt-image-1). Image input $8 (2.5/2/1.5). Batch ≈50% — [OpenAI API pricing](https://developers.openai.com/api/docs/pricing)
- `gpt-image-2.5-*` sizes: 1024×1024, 1536×1024 and **1024×1536 (portrait)**, plus **custom `WIDTHxHEIGHT`** (multiples of 16, aspect ratio between 1:3 and 3:1, max edge 3840 px, total 655,360–8,294,400 px). **That means 1088×1920-class 9:16 is possible; 1080 itself is not a multiple of 16, so 1088×1936 or 1152×2048 would be the nearest.** Quality levels: low, medium, high, xhigh, max, auto. The edits endpoint takes multiple reference images and an optional alpha mask; the mask is "guidance," not exact — [OpenAI image generation guide](https://developers.openai.com/api/docs/guides/image-generation)
- Per-image prices: Artificial Analysis lists **GPT Image 2.5 Sunburst/Flare (max) at $210.7/1k** and **GPT Image 2 (high) at $211.0/1k** — [Artificial Analysis editing leaderboard](https://artificialanalysis.ai/image/leaderboard/editing). A third-party calculator (dated 5 Sep 2026) gives ranges of GPT Image 2 $0.005–$0.211, 1.5 $0.009–$0.20, 1-mini $0.005–$0.052 and gpt-image-1 $0.011–$0.25 (**gpt-image-1 deprecating 23 Oct 2026**). It notes portrait and widescreen are "slightly cheaper at Medium and High" on GPT Image 2 — [CostGoat](https://costgoat.com/pricing/openai-images)
- Provenance: OpenAI images from ChatGPT, Codex and the API carry **C2PA metadata + SynthID** (announced ~May 2026; secondary reports) — [PetaPixel 20 May 2026](https://petapixel.com/2026/05/20/openai-gets-serious-about-detecting-fake-images/); [Krasa.ai](https://www.krasa.ai/news/openai-synthid-c2pa-image-watermark-verification-tool-provenance-may-2026). No source found stating a visible watermark on API outputs.

### Cited Findings — Black Forest Labs (BFL API key at api.bfl.ai; also fal/Replicate)
- BFL pricing (accessed 26 Sep 2026): **FLUX.2 [klein] 4B** from $0.014/MP, [klein] 9B from $0.015/MP, **[pro] from $0.03/MP T2I and $0.045/MP editing**, [flex] from $0.05/MP, **[max] from $0.07/MP**. Previous generation: **FLUX.1 Kontext [pro] $0.04/image, Kontext [max] $0.08/image**, FLUX1.1 [pro] $0.04 — [docs.bfl.ai pricing](https://docs.bfl.ai/quick_start/pricing)
- Kontext editing works at aspect ratios **3:7 to 7:3** at ~**1 MP** and by default matches input dimensions (rounded to multiples of 32). Parameters include `seed`, `prompt_upsampling`, `output_format` jpeg/png and `safety_tolerance` 0–6. BFL recommends FLUX.2 for new projects: "multi-reference support (up to 10 images)… output up to 4MP." The docs mention no watermark or C2PA — [BFL Kontext editing docs](https://docs.bfl.ai/kontext/kontext_image_editing)

### Cited Findings — ByteDance Seedream (BytePlus ModelArk; also fal/Replicate)
- **Seedream 5.0 Pro** on official BytePlus costs **$0.045 at ≤2.36 MP and $0.09 above**. The first reference image is free and each additional one is $0.003. The official API does **1K and 2K, not 4K** (Seedream 5.0 Lite covers 3K/4K) — [AtlasCloud blog (secondary)](https://www.atlascloud.ai/blog/ai-updates/seedream-5-0-pro-price). Artificial Analysis lists Seedream 5.0 Pro at $90/1k — [AA](https://artificialanalysis.ai/image/leaderboard/editing)
- Seedream 4.5 on fal is $0.04/image, up to 4 MP (2048×2048) — [fal.ai](https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/text-to-image)
- The ModelArk API `watermark` parameter adds an **"AI-generated" visible watermark in the lower-right** when true. Defaults differ by version, so **set `watermark: false` explicitly**. Verified via search summary, not a full doc fetch — [BytePlus ModelArk image generation API](https://docs.byteplus.com/en/docs/ModelArk/1541523); [APIYI docs](https://docs.apiyi.com/en/api-capabilities/seedream-image/overview)

### Cited Findings — Qwen-Image-Edit (Alibaba; open weights; fal/Alibaba Cloud)
- **Qwen Image Edit 2511** on fal costs **$0.03 per megapixel** and accepts multiple input images — [fal.ai](https://fal.ai/models/fal-ai/qwen-image-edit-2511). Artificial Analysis lists "Qwen Image Edit Plus 2511" at $60/1k, which conflicts with fal's per-MP price (likely a different provider or resolution) — [AA](https://artificialanalysis.ai/image/leaderboard/editing)
- **Qwen-Image-2.1** leads the *open-weights* editing arena (Elo 1067), ahead of HunyuanImage 3.0 Instruct (1028) and Qwen Image Edit Plus 2511 (1023) — [AA open-weights editing](https://artificialanalysis.ai/image/leaderboard/editing/open-weights)

### Inferences
- **Best price/quality for this workflow:** Nano Banana 2 at 2K 9:16 ($0.101, or $0.050 via batch). It is native 9:16 at a resolution that downsamples cleanly to 1080×1920, has no visible watermark via API, takes the same Gemini API key as Veo, and Google's docs literally recommend the "Do not change any other elements" phrasing.
- **Kontext [pro]/[max] cap at ~1 MP** (about 768×1344 at 9:16, inferred from the 1 MP limit and multiples-of-32 rounding). They would need upscaling to 1080×1920 and are superseded by FLUX.2 (up to 4 MP).
- OpenAI custom sizes let you hit near-9:16 at up to 3840 px, but at ~$0.21 per max-quality image it costs about 2–3× Nano Banana 2.

### Gaps
- The exact pixel dimensions Gemini returns for 9:16 at each tier (1K/2K/4K) were not in the fetched docs.
- OpenAI's official per-image price table by size and quality was not retrievable. A third-party snippet claimed $0.165 for GPT Image 2 at 1024×1536 high, but I could not verify it.
- Qwen-Image-Edit: exact max resolution and aspect options, and the weights license, were not confirmed in this session. MAI-Image-2.6 (#3/#4 on the AA editing arena) and "Muse Image" (#6, $10/1k) were not researched for API route, 9:16 or watermark.
- BFL watermark/C2PA behavior on API outputs is undocumented in the pages read.

## B2. Which model is best at "edit this exact scene, add one object, keep everything else identical"?

### Takeaway
On blind human-preference editing Elo (Artificial Analysis, accessed 26 Sep 2026), the top is **OpenAI GPT Image 2.5 Sunburst/Flare (1180/1161)**, then Microsoft MAI-Image-2.6, GPT Image 2 (high) at 1121, **Nano Banana 2 at 1107 (#8)** and **Seedream 5.0 Pro at 1106 (#9)**. FLUX.2 [pro] (1007) and **FLUX.1 Kontext [max] (927)** are far behind. No public benchmark I found isolates "keep camera, lighting and grid pixel-identical," so the arena Elo is only a proxy.

### Cited Findings
- Artificial Analysis Image Editing Arena (Elo, $/1k images, release month), accessed 26 Sep 2026 — [artificialanalysis.ai editing leaderboard](https://artificialanalysis.ai/image/leaderboard/editing):
  - #1 GPT Image 2.5 Sunburst (max) 1180 ($210.7, Sep 2026)
  - #2 GPT Image 2.5 Flare (max) 1161 ($210.7, Sep 2026)
  - #3 MAI-Image-2.6 1134 ($38.9, Aug 2026)
  - #4 MAI-Image-2.6-Flash 1124 ($19.5, Sep 2026)
  - #5 GPT Image 2 (high) 1121 ($211, Apr 2026)
  - #6 Muse Image 1117 ($10, Jul 2026)
  - #8 **Nano Banana 2** 1107 ($67)
  - #9 **Seedream 5.0 Pro** 1106 ($90)
  - #13 **Nano Banana Pro** 1098 ($134)
  - #29 Seedream 4.5 1034 ($40)
  - #31 Qwen Image Edit Plus 2511 1023 ($60)
  - #34 Seedream 4.0 1013 ($30)
  - #38 FLUX.2 [pro] 1007 ($45)
  - #43 FLUX.2 [dev] 1000 ($24)
  - #47 Nano Banana (2.5 Flash) 985 ($39)
  - #62 FLUX.1 Kontext [max] 927 ($80)
  - #65 Qwen Image Edit (original) 918 ($30)
- Methodology: users compare edited outputs "from the same input image and editing instruction" and pick the preferred result, and rankings are Elo from blind votes. This measures overall preference, not specifically preservation of unedited regions — [AA via search summary](https://artificialanalysis.ai/image/leaderboard/editing)
- Google positions Nano Banana 2 on consistency: "fidelity of up to 14 objects in a single workflow," and the docs suggest "Do not change any other elements of the image" for multi-turn edits — [Google blog](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/); [Gemini docs](https://ai.google.dev/gemini-api/docs/image-generation)
- Kontext keeps input dimensions by default and exposes a `seed` for reproducibility — [BFL docs](https://docs.bfl.ai/kontext/kontext_image_editing). OpenAI's mask is "guidance… may not follow its exact shape with complete precision" — [OpenAI guide](https://developers.openai.com/api/docs/guides/image-generation)

### Inferences
- **Practical pick:** Nano Banana 2 as the default (top-10 editing Elo at a third of GPT Image 2.5's price, 9:16 up to 4K, same key as Veo). Use GPT Image 2.5 Sunburst for hard edits where Nano Banana drifts. Seedream 5.0 Pro is a peer alternative; set `watermark:false`.
- **"Wider camera" is a different task from "add an object."** Pulling the camera back means outpainting new floor and grid, and every model will re-render the grid rather than preserve it. For that case, a deterministic approach may beat any model: pad the canvas in code, place the original render centered at reduced scale, then ask the model to fill only the border (or generate the wide shot first and crop in for the close shot, since a crop is pixel-exact).
- **Deterministic safeguard for "keep everything identical":** after the model edits, composite in Python. Take the edit's pixels only inside a dilated mask around the added object (e.g., from BiRefNet or a diff threshold) and keep the original render everywhere else. This guarantees the camera, lighting and grid match exactly outside the edit, which no model guarantees. Also, the gold sphere and matte gray surfaces should be color-checked after any edit, because models tend to shift global tone. Both are inferences from how these models are described, not benchmarked.
- The arena ranks aesthetics and instruction-following together. A model can win votes while subtly re-rendering untouched regions, which is exactly the failure mode that breaks first-frame/last-frame video continuity.

### Gaps
- No benchmark found that measures unedited-region preservation (e.g., PSNR/SSIM outside the edit mask) across these models as of Sep 2026.
- API access routes, 9:16 support and watermark behavior for MAI-Image-2.6 and Muse Image (ranks 3–6) were not researched.
- No head-to-head test on stylized 3D renders like the target look (matte gray geometry, dark grid, gold sphere) was found.
