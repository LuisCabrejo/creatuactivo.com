# Non-Veo AI video models with public APIs + aggregator APIs (state as of 26 Sep 2026)

Scope: models an agent (Claude Code, Mac terminal) could call to make 9:16, 8–10 s, image-to-video clips of a stylized minimalist 3D scene (matte gray geometry, dark flat grid floor, one gold sphere, pictogram humans, a smartphone with simple UI icons), with first+last-frame control, stable object counts, no grid warping, no garbled text, consistent style across dozens of clips, and no visible watermark.

Research date: 26 Sep 2026. "Accessed" = fetched on that date. Prices are list prices from the page cited; many third-party pages are resellers/SEO blogs and are labeled as such. Official vendor docs for Kling and BytePlus (Seedance) are JavaScript-rendered and could not be read directly; their figures come from resellers and are flagged.

## 1. Which models/versions have API access right now (Sep 2026)?

### Takeaway
The landscape moved a lot in mid-2026: **OpenAI's Sora 2 / Sora 2 Pro API was discontinued on 24 Sep 2026 (two days before this research)**, so it is not an option. The current API-accessible leaders are MiniMax H3 (Jul 31, 2026), Wan 3.0 (Aug 2026, API beta; weights not officially released), Seedance 2.0 / 2.5 (2.5 launched Jul 31, 2026), Kling 3.0 / O3, Runway Gen-4.5 (+ Aleph 2), Luma Ray3.2 (Jun 9, 2026), PixVerse V6, LTX-2.3 / LTX-2.5 (open weights), Grok Imagine Video 1.5, Vidu Q3, BACH 1.0, HappyHorse 1.0/1.1 — plus Google's non-Veo **Gemini Omni Flash**, which currently tops the Artificial Analysis image-to-video arena.

### Cited Findings
**OpenAI Sora 2 / Sora 2 Pro — DISCONTINUED**
- Sora web/app discontinued 26 Apr 2026; Sora API discontinued 24 Sep 2026 — [NewsBytes](https://www.newsbytesapp.com/news/science/sora-api-shuts-down-september-24-what-users-should-do/story); [OpenAI Help Center article title "What to know about the Sora discontinuation"](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation) (page returned 403 to the fetcher; date relayed by search snippet and secondary sources).
- "Sora API shuts down on September 24, 2026, with no replacement" — [Teamday, Sep 2026](https://www.teamday.ai/blog/ai-image-video-api-providers-comparison-2026).
- Pre-shutdown pricing (historical only): Sora 2 $0.10/s (720p), Sora 2 Pro $0.30/s 720p, $0.50/s 1024p, $0.70/s 1080p; Batch ~50% off; durations Sora 2: 4/8/12 s, Pro: 10/15/25 s — [CostGoat, Sep 2026](https://costgoat.com/pricing/sora). Replicate's collection page still lists `openai/sora-2` and `sora-2-pro` — [Replicate](https://replicate.com/collections/text-to-video) (likely stale listing after 24 Sep; not verified whether calls still succeed).

**MiniMax (Hailuo) — MiniMax H3 / H3 Max**
- H3 launched 31 Jul 2026, live in the platform API as `MiniMax-H3` and in the Hailuo app — [search summary of MiniMax/MarkTechPost coverage](https://www.marktechpost.com/2026/08/01/minimax-releases-minimax-h3-an-omni-modal-video-model-that-generates-15-second-2k-clips-with-native-stereo-audio/); release date confirmed by [MiniMax blog](https://www.minimax.io/blog/minimax-h3).
- Official docs now list two video models: `MiniMax-H3` (4–15 s, integer; 768P / 2K) and `MiniMax-H3 Max` ("a fal.ai post-trained variant", 5–15 s; 480P / 768P) — [MiniMax API docs](https://platform.minimax.io/docs/guides/video-generation). Older Hailuo 02 / 2.3 are not listed in that doc; `minimax/hailuo-2.3` is still on Replicate — [Replicate](https://replicate.com/collections/text-to-video).
- Open weights: MiniMax said "we plan to open up the model weights in the coming days, subject to applicable laws and regulations" — [MiniMax blog](https://www.minimax.io/blog/minimax-h3); fal markets it as "Open-Weights General-Purpose Multimodal Video Model" — [fal](https://fal.ai/minimax-h3). Actual weight release not independently verified.

**Alibaba Wan**
- Wan 3.0 public beta 6 Aug 2026 on Alibaba Cloud Model Studio / Qwen Cloud; "public beta does not mean … downloadable model weights" — [search summary, wan27.org / kingy.ai](https://kingy.ai/blog/wan-3-0-analysis/). Official API reference exists with model IDs `wan3.0-video` and `wan3.0-video-prime` ("High-speed version") — [Alibaba Cloud Wan3.0 API reference](https://www.alibabacloud.com/help/en/model-studio/wan3-video-generation-api-reference).
- Open weights: conflicting. "Alibaba has not published official Wan 3.0 model weights as of September 14, 2026" — [wan27.org](https://wan27.org/blog/wan-3-open-source); contradicted by a claim of 1.3B/14B open-weight releases "reported by industry trackers in late April 2026" (same search results; unverified, likely confusion with Wan 2.x). Last confirmed open-weight Wan line = Wan 2.2 (Apache 2.0) per the same sources. Wan 2.7 also has an official API — [Alibaba Cloud Wan 2.7 I2V](https://www.alibabacloud.com/help/en/model-studio/image-to-video-general-api-reference).
- Alibaba's "HappyHorse 1.0" (ATH Innovation Unit; China grayscale test from 27 Apr 2026; 15B params; 1080p, 24 fps, 5–8 s, joint audio) — [search summary / GitHub info page](https://github.com/FreeyW/HappyHorse); fal is an "Official API Partner" — [fal HappyHorse](https://fal.ai/happyhorse-1.0). Vendor/SEO pages claim it is "#1 on the Artificial Analysis Video Arena"; the current AA leaderboard does **not** show it at #1 (see §3) — claim is stale or promotional.

**ByteDance Seedance**
- Seedance 2.5 announced 23 Jun 2026, launched 31 Jul 2026 — [search summary, CineD / Apiframe](https://www.cined.com/bytedance-seedance-2-5-api-goes-live-30-second-single-shot-clips-50-reference-inputs-and-3d-camera-blockouts/); official blog confirms 31 Jul 2026, "up to 30 seconds per generation", references "up to 30 images, 10 video clips, and 10 audio clips", and clay-render (textureless 3D) referencing for camera/blocking; at blog time "API access coming soon via BytePlus ModelArk" — [ByteDance Seed blog](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5).
- Current tiers per a reseller (31 Aug 2026): Seedance 2.0 Mini, 2.0 Fast, 2.0, 2.5 — [ofox.ai](https://ofox.ai/blog/seedance-api-guide-tiers-pricing-2026/). Live model ID cited: `dreamina-seedance-2-5-260628` — [search summary citing BytePlus docs](https://apiframe.ai/guides/seedance-2-5-guide).

**Kuaishou Kling**
- Kling Video 3.0 (Standard / Pro / Turbo / 4K) and Kling O3 (Omni) are live on fal — [fal Kling v3 Pro I2V](https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video); `kwaivgi/kling-v3-omni-video` on Replicate — [Replicate](https://replicate.com/collections/text-to-video). Official developer platform: [kling.ai/dev](https://kling.ai/dev) (prepaid resource packages).

**Runway**
- API models: Gen-4.5, Gen-4 Turbo, Aleph 2, Act-Two — plus Runway now resells third-party models via the same key: Wan 3.0, Seedance 2 / 2 Fast / 2 Mini / 2.5, Grok Imagine 1.5, H3 Max, Hailuo3, Veo 3.1 / 3.1 Fast, Happy Horse 1.0, Gemini Omni Flash — [Runway API pricing](https://docs.dev.runwayml.com/guides/pricing/) (accessed 26 Sep 2026). Runway offers "Model Routers" that auto-select a model by cost/latency/quality "at no additional charge" — [Runway models guide](https://docs.dev.runwayml.com/guides/models/).

**Luma**
- Ray3.2 released 9 Jun 2026: 1080p, "up to 20 seconds long at 1080p", "up to 16 keyframes within a single clip", native HDR + 16-bit EXR — [Luma](https://lumalabs.ai/news/introducing-ray-3-2). Public API page lists Ray3.2 as the current video model — [Luma API](https://lumalabs.ai/api). Note: [docs.lumalabs.ai video-generation](https://docs.lumalabs.ai/docs/video-generation) still documents only `ray-2` / `ray-flash-2` (docs appear partially stale).

**Lightricks LTX**
- LTX-2.3: open weights under the "LTX-2 Community License (no cost under $10M revenue)", keyframe conditioning with last-frame interpolation, "native 1080x1920 portrait support" — [search summary, TheRundown / Wikipedia](https://www.therundown.ai/tools/ltx-2-3). LTX-2.5 Fast/Pro are the current API tier (Aug 2026) — [search summary, TheRundown](https://www.therundown.ai/tools/ltx-2).

**Others**
- PixVerse V6 (API + "Transition" first-last-frame endpoint) — [PixVerse Platform Docs](https://docs.platform.pixverse.ai/how-to-use-transitionfirst-last-frame-feature-882973m0).
- xAI Grok Imagine Video (and Video 1.5): 1–15 s, 24 fps, 480p/720p, seven aspect ratios — [search summary of xAI docs](https://docs.x.ai/developers/models/grok-imagine-video).
- Vidu Q3 Pro/Turbo on Replicate ("start-end-to-video mode") — [Replicate](https://replicate.com/collections/text-to-video).
- BACH 1.0 (Video Rebirth, launched 7 May 2026; native 1080p/30 fps; multi-shot, character consistency) — [search summary, Tellers / AA on X](https://tellers.ai/blog/bach_1_0_new_ai_video_engine_multi_shot_films_2026-05-11). API availability not verified.
- Pika: API is served through fal ("Pika API is now powered by fal") — [fal blog](https://blog.fal.ai/pika-api-is-now-powered-by-fal); fal lists Pika v2.2 I2V and "Pikaframes" — [fal Pika v2.2](https://fal.ai/models/fal-ai/pika/v2.2/image-to-video). Claims that Pika 2.5 is on the API come from a low-quality aggregator blog — [agentsapis](https://agentsapis.com/api/pika-api/) (not verified).
- Google Gemini Omni Flash (Google, but not Veo): public preview 30 Jun 2026, stable `gemini-omni-1.1-flash` GA 27 Aug 2026 — [search summary of Gemini API docs](https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash); model page lists "3s-10s", "360p/720p/1080p/4K, 24 FPS" — [Gemini API docs](https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash).

### Inferences
- Sora should be removed from any plan; any code/tutorial referencing `sora-2` is now dead.
- Runway's API has effectively become an aggregator itself (one Runway key → Gen-4.5, Wan 3.0, Seedance, H3 Max, Veo 3.1, Gemini Omni Flash), competing with fal/Replicate.

### Gaps
- Could not read the official Kling and BytePlus docs (JS-rendered) — model IDs, official per-second rates and defaults for those two come from resellers.
- Whether Wan 3.0 or MiniMax H3 weights are actually downloadable today: not verified.
- BACH 1.0 / HappyHorse official API endpoints and prices: not verified.

## 2. Per-model specs: duration, 9:16, resolution, I2V, first+last frame, references, audio, watermark, price, latency

### Takeaway
For 9:16 clips of 8–10 s with a first frame and a last frame, the verified fits are **Kling 3.0** (3–15 s, `end_image_url`, aspect taken from start image; fal $0.112/s Pro no audio), **MiniMax H3** (4–15 s, 0/1/2 frame images, 9:16, up to 9 reference images; Runware $0.08/s at 768p), **Wan 3.0** (2–30 s, `first_frame`+`last_frame`, 9:16, watermark default **false**; Runway API $0.10/s at 720p), **Luma Ray3.2** (9:16, up to 16 keyframes/clip; 10 s 720p $0.90 as listed), **Runway Gen-4.5** (first/last via `position`, 720×1280; $0.12/s), **PixVerse V6 Transition** (1–15 s, up to 1080p) and **LTX-2.3** (open weights, last-frame interpolation, native 1080×1920). Seedance is capable but has conflicting reports on which tier supports first+last frame and a strict real-face filter. Almost no provider documents "no visible watermark" explicitly for API output; Wan (official) and Kling (reseller doc) default watermark = off.

### Cited Findings
**Kling 3.0 (via fal; official docs unreadable)**
- Params: `start_image_url` (required), optional `end_image_url`, `duration` 3–15 s (default 5), `generate_audio` (default **true**), `elements` (character/object injection as @Element1…), `negative_prompt` (default "blur, distort, and low quality"), `cfg_scale` 0–1 (default 0.5), `multi_prompt` + `shot_type`; "Aspect ratio derives from start image, not parameters" — [fal Kling v3 Pro I2V](https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video) (accessed 26 Sep 2026).
- fal prices (accessed 26 Sep 2026): v3 Standard $0.084/s (audio off), $0.126 (audio on), $0.154 (voice control); v3 Pro $0.112 / $0.168 / $0.196; v3 4K $0.42/s; v3 Turbo Standard $0.112/s; v3 Turbo Pro $0.14/s; all support `end_image_url` — [fal search summary](https://fal.ai/models/fal-ai/kling-video/v3/standard/image-to-video).
- Official: 1 unit = $0.14 list; 180-day package from $700 / 5,000 units, 20 concurrent; failed tasks not charged — [search summary of WaveSpeed/eesel](https://wavespeed.ai/blog/ai-api-pricing/kling-ai-api-pricing/) (per-second unit rates not found; WaveSpeed article of 11 Aug 2026 itself says to check [kling.ai/dev/pricing](https://kling.ai/dev/pricing)).
- Replicate charges ~$0.224/s for Kling v3 vs fal $0.112/s — [Teamday, Sep 2026](https://www.teamday.ai/blog/ai-image-video-api-providers-comparison-2026). Runware: Kling 3.0 $0.168/s with audio — [search summary of Runware](https://runware.ai/collections/best-video-models).
- Watermark: Kling API field `watermark_info.enabled`, "defaulting to `false`" — [MaasUnion Kling doc mirror](https://docs.maasunion.com/en/docs/api/ai-model/videos/kling/standard-video) (reseller mirror of the official schema; official page not readable). `image_tail` = end-frame image in the native API (same source).

**MiniMax H3 / H3 Max (official docs)**
- H3: 4–15 s, 768P / 2K; H3 Max: 5–15 s, 480P / 768P; "Common ratios or adaptive"; first/last-frame images: 0, 1 or 2; up to 9 reference images; up to 3 reference videos (total ≤15 s) and 3 audio clips; async: `POST /v2/video_generation` → `task_id` → poll until "succeeded" → download `content.url` — [MiniMax API docs](https://platform.minimax.io/docs/guides/video-generation). Watermark parameter not mentioned there.
- Aspect ratios 21:9, 16:9, 4:3, 1:1, 3:4, **9:16**, adaptive; native stereo audio on all generations; 24 fps — [fal H3 landing](https://fal.ai/minimax-h3). fal claims H3 Max renders "5-second clips under 3 seconds" (vendor claim, not verified).
- In first+last mode the output "matches the aspect ratio of the anchor image"; works best when the two frames "share a composition and differ in one thing"; "small, physical movements preserve the likeness, while large actions … tend to warp it" — [Runware H3 first/last guide](https://runware.ai/docs/models/minimax-h3/guides/first-and-last-frame).
- Prices: Runware H3 $0.08/s (768p), $0.13/s (1440p/2K) — [search summary of Runware](https://runware.ai/minimax-h3); AA lists H3 at $7.80/min and "H3 Max (post-trained by fal)" at $2.40/min — [Artificial Analysis I2V leaderboard](https://artificialanalysis.ai/video/leaderboard/image-to-video) (accessed 26 Sep 2026); Runway API: H3 Max 5–8 credits/s ($0.05–0.08/s), Hailuo3 10–15 credits/s — [Runway API pricing](https://docs.dev.runwayml.com/guides/pricing/). MiniMax itself claims "At 2K, H3's per-second price is less than a third of mainstream models" — [MiniMax blog](https://www.minimax.io/blog/minimax-h3). MiniMax also claims strengths in "accurate text and brand rendering" (vendor claim) — same source.

**Wan 3.0 (official Alibaba Cloud docs)**
- Tasks: T2V, I2V via `first_frame` or `first_frame` + `last_frame`, reference-based generation, editing, extension; duration 2–30 s (default 5 s); `1080P` / `720P` / `480P`; ratios `adaptive` (default), 21:9, 16:9, 4:3, 1:1, 3:4, **9:16**; audio default **true**; **watermark default `false`**; 30 fps; async create → `task_id` → poll → `video_url`, which is "valid for only 24 hours" — [Alibaba Cloud Wan3.0 API reference](https://www.alibabacloud.com/help/en/model-studio/wan3-video-generation-api-reference) (official price not shown there).
- Runway API: Wan 3.0 5 / 10 / 20 credits/s at 480p / 720p / 1080p = $0.05 / $0.10 / $0.20 per s (credits $0.01 each) — [Runway API pricing](https://docs.dev.runwayml.com/guides/pricing/). Replicate had "50% off until Aug 30" on `alibaba/wan-3` — [Replicate](https://replicate.com/collections/text-to-video).
- Wan 2.2 has a dedicated first-and-last-frame API (`kf2v`, e.g. `wan2.2-kf2v-flash`) and Wan 2.7 I2V supports first-and-last-frame — [Alibaba Cloud docs search summary](https://www.alibabacloud.com/help/en/model-studio/image-to-video-first-and-last-frames-guide).

**Luma Ray3.2 (official)**
- Pricing billed per 5-s block (as parsed from the page): T2V/I2V 5 s: $0.15 (540p) / $0.30 (720p) / $1.20 (1080p); 10 s: $0.45 / $0.90 / $3.60; V2V 5 s $0.72 / $1.44 / $2.16; HDR = 2× SDR, HDR+EXR = 3×; ratios **9:16**, 3:4, 1:1, 4:3, 16:9, 21:9; "Up to 16 keyframes inside a single clip"; Build tier "Rate limits apply, no latency SLA" — [Luma API page](https://lumalabs.ai/api) (accessed 26 Sep 2026). Note the 10 s price is 3× the 5 s price, which is inconsistent with "per 5-second block" — treat as unverified parse.
- Build tier: 10 concurrent Ray generations, 20 create req/min, $5,000/month cap — [search summary, eesel/Apiframe](https://www.eesel.ai/blog/luma-ai-pricing).
- API keyframes: `frame0` / `frame1` objects with `type` + `url` (image or prior generation ID); `callback_url` webhook; `loop`; "Concepts" style presets — [Luma docs](https://docs.lumalabs.ai/docs/video-generation) (doc shows Ray 2 models; Ray3.2 param names not independently confirmed). Watermark: not documented.

**Runway Gen-4.5 (official + integrator docs)**
- API price 12 credits/s = $0.12/s; Gen-4 Turbo 5 credits/s; Aleph 2 28 credits/s (56 min) — [Runway API pricing](https://docs.dev.runwayml.com/guides/pricing/) (accessed 26 Sep 2026). App subscription credits do not work in the API — [search summary, magichour](https://magichour.ai/blog/runway-ml-pricing).
- `promptImage` can be an array with `position` "first" or "last"; allowed sizes 1280×720, **720×1280**, 1104×832, 832×1104, 960×960 — [search summary of Runway / Runware docs](https://runware.ai/docs/models/runway-gen-4-5/guides/directing-motion). Whether Gen-4.5 accepts BOTH a first and a last image in the same call: not verified (the Runware summary says `frameImages` "takes exactly one image").
- Gen-4.5 outputs ProRes / PNG sequences / 10-bit and "true HDR renders" via API — [Runway models guide](https://docs.dev.runwayml.com/guides/models/). Durations for Gen-4.5 API: not verified.
- Watermark: "invisible C2PA watermarks embedded in metadata" on all outputs — [search summary of Runway safety/terms pages](https://runway.com/safety) (no visible watermark reported; not verified from a primary doc).

**Seedance 2.0 / 2.5 (resellers; official docs unreadable)**
- Reseller prices (31 Aug 2026): 2.0 Mini $0.04/s 480p, $0.08/s 720p; 2.0 Fast $0.06 / $0.13; 2.0 $0.07 / $0.16 / $0.34 (1080p) / $1.37 (4K); 2.5 $0.11 / $0.24 / $0.60 (1080p) — [ofox.ai](https://ofox.ai/blog/seedance-api-guide-tiers-pricing-2026/). OpenRouter: Seedance 2.0 from $0.06726/s (480p) to $0.7776/s (4K) — [OpenRouter](https://openrouter.ai/bytedance/seedance-2.0). Runway API: Seedance 2.5 720p = 30 credits/s output + 15 credits/s reference ($0.30/s + $0.15/s), 80-credit minimum — [Runway API pricing](https://docs.dev.runwayml.com/guides/pricing/). fal's Seedance is "approximately double BytePlus's direct price" — [Teamday](https://www.teamday.ai/blog/ai-image-video-api-providers-comparison-2026).
- First+last frame: **conflicting**. Seedance 2.0 "can be steered with a first frame and last frame image", 4–15 s — [seedance-2-0-api.github.io](https://seedance-2-0-api.github.io/) and [PiAPI](https://piapi.ai/seedance-2-0); vs. "Only Seedance 2.5 supports this feature, which requires omitting the aspect ratio parameter" (specifying ratio with first+last → HTTP 400) — [ofox.ai](https://ofox.ai/blog/seedance-api-guide-tiers-pricing-2026/).
- Resolution of 2.5: **conflicting** — "BytePlus … documentation lists 480p and 720p output for dreamina-seedance-2-5-260628, at 24 fps" — [search summary, Apiframe/vidmuse](https://apiframe.ai/guides/seedance-2-5-guide) vs. ofox listing a 1080p price.
- Ratios 16:9, 4:3, 1:1, 3:4, **9:16**, 21:9 (2.0) — [seedance-2-0-api.github.io](https://seedance-2-0-api.github.io/).
- Latency: OpenRouter median end-to-end 123.9 s; kie.ai "roughly four to five minutes" — [seedance-2-0-api.github.io](https://seedance-2-0-api.github.io/); "83-253 seconds for identical jobs" — [ofox.ai](https://ofox.ai/blog/seedance-api-guide-tiers-pricing-2026/). Unsigned result URLs expire within 24 h (ofox).
- Watermark default for Seedance video: not verified (BytePlus exposes a boolean `watermark` for Seededit images — [BytePlus docs search](https://docs.byteplus.com/en/docs/ModelArk/1824691)).

**LTX (Lightricks)**
- LTX-2.5 API: Fast $0.09/s 720p, $0.13 1080p, $0.19 2K, $0.30 4K; Pro $0.12 720p, $0.17 1080p (Aug 2026) — [search summary, TheRundown](https://www.therundown.ai/tools/ltx-2). LTX-2.3 endpoints $0.10–0.40/s (retake/extend/reframe/HDR) — same source.
- API accepts prompt, optional image, audio, **last frame**, camera motion, resolution, orientation, duration, fps; open weights allow local/self-hosted runs (ComfyUI FLF2V workflows exist) — [search summary, TheRundown LTX-2.3](https://www.therundown.ai/tools/ltx-2-3); [RunComfy FLF workflow](https://www.runcomfy.com/comfyui-workflows/ltx-2-3-first-last-frame-in-comfyui-keyframe-to-smooth-video).

**PixVerse V6**
- Transition (first+last frame): up to 1080p, 1–15 s, synchronized audio — [search summary of PixVerse docs/WaveSpeed](https://wavespeed.ai/models/pixverse/pixverse-v6/transition). Official exchange: "$1 = 5 videos (v6, 720p, 5s, no audio, with Starter pack)" — [PixVerse Platform pricing (search summary)](https://docs.platform.pixverse.ai/pricing-796039m0). Reseller: EmpirioLabs $0.10–0.14/s at 360p–540p — [EmpirioLabs](https://empiriolabs.ai/models/pixverse-v6). The "$0.025 per run" figures on WaveSpeed/Atlas look implausibly low and are unverified.

**xAI Grok Imagine Video**
- Official: $0.05/s (480p) – $0.07/s (720p); Video 1.5: $0.08 / $0.14 / $0.25 per s at 480p / 720p / 1080p; image input $0.002/image; 1–15 s, 24 fps, seven aspect ratios — [search summary of xAI pricing pages](https://docs.x.ai/developers/models/grok-imagine-video). Replicate: clips "in around 30 seconds" — [Replicate](https://replicate.com/collections/text-to-video). First+last frame: not verified.

**Gemini Omni Flash (Google, non-Veo)**
- `gemini-omni-1.1-flash`: 3–10 s; 360p/720p/1080p/4K, 24 fps — [Gemini API docs](https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash). v1.1 reportedly added first-and-last-frame control and extension to 40 s cumulative — [search summary, third-party](https://myclaw.ai/blog/gemini-omni-1-1-flash) (not verified on the official page). AA price $6.00/min — [AA leaderboard](https://artificialanalysis.ai/video/leaderboard/image-to-video). Runway API: 10–11 credits/s — [Runway API pricing](https://docs.dev.runwayml.com/guides/pricing/).

**Pika**
- fal Pika v2.2 image-to-video and Pikaframes (keyframe) endpoints — [fal](https://fal.ai/models/fal-ai/pika/v2.2/pikaframes/api). Price/specs not verified.

### Inferences
- Cheapest verified 10 s 9:16 first+last-frame clip: Wan 3.0 720p via Runway (~$1.00), MiniMax H3 768p via Runware (~$0.80), Kling v3 Standard via fal with audio off (~$0.84), Luma Ray3.2 720p (~$0.90 as listed), Runway Gen-4.5 ($1.20). Dozens of clips (e.g., 50 × 10 s) would cost roughly $40–60 at 720p on these tiers, before retries.
- Audio defaults to ON for Kling (fal), Wan 3.0 and H3 — for silent motion-graphics clips, pass `generate_audio=false`/`audio=false` where supported to avoid surcharges (Kling audio-on is +50%).
- Because aspect ratio follows the input frame for Kling and H3 (first/last mode) and Seedance errors if you pass a ratio with first+last, the reliable way to get 9:16 is to supply 9:16 (e.g., 1080×1920 or 720×1280) keyframe images.
- For "exactly one gold sphere" and a non-warping grid, the strongest lever is tight keyframing: Luma's 16-keyframe control or short first→last interpolations where both frames share composition (Runware's H3 guidance) — the model interpolates rather than invents.

### Gaps
- No provider page reviewed explicitly states "API output has no visible watermark" except via default flags (Wan official `watermark=false`; Kling `watermark_info.enabled=false` via a reseller mirror). Luma, MiniMax, Seedance, PixVerse, LTX, Grok: not verified.
- Latency figures exist only for Seedance (≈1.5–5 min), Grok (~30 s, Replicate), H3 Max (vendor claim). AA's generation-time chart did not render in text. Kling/Runway/Luma/Wan latency: not verified.
- Official Kling per-second unit rates; official BytePlus Seedance prices; Runway Gen-4.5 durations; whether Gen-4.5 takes first+last in one call.

## 3. Which models are reputed best (benchmarks/reviews), esp. for stylized/abstract 3D motion graphics and prompt adherence?

### Takeaway
On the Artificial Analysis Image-to-Video arena (blind votes, accessed 26 Sep 2026), the top no-audio models are Gemini Omni Flash (1369), Wan 3.0 (1363), Bach 1.0 Pro (1363), MiniMax H3 (1357) and PixVerse V6 (1340); with audio, fal's MiniMax H3 Max leads (1195). There is no public category breakdown for stylized/abstract/3D motion graphics, and the review-site claims about "best for stylized" are low-quality and partly outdated (they cite Runway Gen-4 Turbo and Sora 2).

### Cited Findings
- AA I2V (no audio): Gemini Omni Flash 1369, Wan 3.0 1363, Bach 1.0 Pro 1363, MiniMax H3 1357, PixVerse V6 1340 — [Artificial Analysis I2V leaderboard](https://artificialanalysis.ai/video/leaderboard/image-to-video).
- AA I2V (with audio): Minimax H3 Max (post-trained by fal) 1195 ($2.40/min, Aug 2026); MiniMax H3 1181 ($7.80/min, Jul 2026); Gemini Omni Flash 1178 ($6.00/min); Dreamina Seedance 2.0 720p 1176 ($9.07/min); HiDream-O1-Video 1175 ($5.80/min) — [Artificial Analysis I2V leaderboard](https://artificialanalysis.ai/video/leaderboard/image-to-video). Snapshot date not shown; includes Aug 2026 releases.
- AA's model list (text) also names Veo 3.1 Fast, Wan 2.7, HappyHorse-1.1/1.0, Kling 3.0 720p Standard and 1080p Pro, SkyReels V4, LTX-2.3 Fast/Pro, Vidu Q3 Pro/Turbo; no category breakdown (3D, stylized, abstract) found — [AA video models](https://artificialanalysis.ai/video/models).
- Bach-1.0 Preview debuted #6 on AA text-to-video (no audio), "similar performance to Vidu Q3 Pro, Kling 3.0 Omni 1080p (Pro), and grok-imagine-video" — [Artificial Analysis on X](https://x.com/ArtificialAnlys/status/2051236578455110010).
- Replicate still labels `runwayml/gen-4.5` "Ranked #1 on Artificial Analysis benchmark" — [Replicate](https://replicate.com/collections/text-to-video); it is not in the current I2V top 5, so that label is stale.
- Review claims (low-quality, SEO-style): "Runway leading in non-photorealistic and stylized video — VFX-oriented aesthetics, abstract content"; "Kling 3.0 handles bold color palettes, exaggerated proportions, and stylized motion … strong temporal consistency" — [search summary, Atlas Cloud / media.io etc.](https://atlascloud.ai/blog/guides/best-ai-video-generation-models-2026). These cite Gen-4 Turbo and Sora 2 as current, so they predate mid-2026.
- Seedance 2.5 supports "clay render" referencing — "build a scene's spatial structure, character poses, motion paths, and camera angles using textureless 3D models" — [ByteDance Seed blog](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5). This is the closest documented feature to "matte gray geometry" scenes.

### Inferences
- Arena Elo mostly reflects general/photoreal preference; it does not measure object-count stability, grid rigidity, or UI-text fidelity. For this use case a small in-house bake-off (same 2 keyframes × 4–5 models) is the only reliable signal.
- Seedance 2.5's clay-render input is conceptually aligned with a gray-geometry look (blockout → final), but that feature targets turning untextured 3D into realistic/stylized final shots; whether it preserves a deliberately untextured look is untested.

### Gaps
- No credible benchmark found on stylized/abstract 3D motion graphics, object-count consistency, or on-screen text/number fidelity in video.
- AA snapshot date and methodology for "post-trained by fal" variants not captured.

## 4. Aggregators: fal.ai, Replicate, Runware, WaveSpeed, Runway-as-aggregator, OpenRouter — coverage, markup, SDK pattern, Veo

### Takeaway
One key gets most of this list: **fal** hosts Kling v3/O3, Seedance 2.5, Wan 3.0, LTX-2.3, MiniMax H3 (+ its own H3 Max), Grok Imagine 1.5, HappyHorse, Pika, PixVerse and **Veo 3.1**; **Replicate** hosts Veo 3.1, Runway Gen-4.5, Kling v3 Omni, Seedance 2.0, Hailuo 2.3, Wan 3, Luma Ray3.2, Grok, PixVerse, Vidu Q3, LTX; **Runway's API** now resells Wan 3.0, Seedance, H3 Max, Veo 3.1 and Gemini Omni Flash; **Runware** hosts Kling, Veo, Hailuo/H3, Seedance, PixVerse, Vidu (+ Runway Gen-4.5, Luma Ray3.2 guides). Direct is usually cheapest; markups vary widely (Replicate Kling v3 ≈2× fal; fal Seedance ≈2× BytePlus).

### Cited Findings
- fal hosts Veo 3.1, Kling v3, Seedance 2.5, Wan 3.0, LTX-2.3, MiniMax H3, Grok Imagine 1.5; Replicate hosts Veo 3.1, Kling v3, Seedance 2.0, Wan 2.6, LTX-2.3; "Direct was the cheapest or tied route for most first-party models"; fal Seedance ≈ double BytePlus direct; Replicate Kling v3 $0.224/s vs fal $0.112/s — [Teamday, Sep 2026](https://www.teamday.ai/blog/ai-image-video-api-providers-comparison-2026).
- Replicate video collection lists google/veo-3.1, runwayml/gen-4.5, kwaivgi/kling-v3-omni-video, bytedance/seedance-2.0, minimax/hailuo-2.3, alibaba/wan-3, luma/ray-3.2, xai/grok-imagine-video, pixverse/pixverse-v5.6, vidu/q3-pro ("start-end-to-video"), openai/sora-2(-pro), lightricks/ltx-video — [Replicate](https://replicate.com/collections/text-to-video) (accessed 26 Sep 2026).
- fal Veo 3.1 I2V: $0.20/s no audio / $0.40 with audio (720p/1080p), 4K $0.40 / $0.60; Veo 3.1 Fast $0.10 / $0.15 (720p/1080p), 4K $0.30 / $0.35; first/last-frame supported — [fal Veo 3.1 (search summary)](https://fal.ai/models/fal-ai/veo3.1/image-to-video). fal also has Veo 3.1 Lite — [fal](https://fal.ai/models/fal-ai/veo3.1/lite/image-to-video).
- fal queue pattern: `https://queue.fal.run/{endpoint}`; header `Authorization: Key $FAL_KEY`; states `IN_QUEUE` → `IN_PROGRESS` → `COMPLETED`; Python `fal_client.submit(...)` → handler (`.status(with_logs=True)`, `.iter_events()`, `.get()`, `.cancel()`), or blocking `fal_client.subscribe(...)`; `webhook_url` on submit; returns `request_id` — [fal queue docs](https://fal.ai/docs/model-apis/model-endpoints/queue). JS: `fal.subscribe("fal-ai/kling-video/v3/pro/image-to-video", { input, logs, onQueueUpdate })`; output is a video object with URL, content type, filename, size — [fal Kling v3 Pro](https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video).
- Runware: requests use `taskType: "videoInference"` (async), frames via `inputs.frameImages` with `frame: "first"|"last"`, model AIR IDs like `minimax:h3@0`, response `videoUUID` / `videoURL` — [Runware H3 guide](https://runware.ai/docs/models/minimax-h3/guides/first-and-last-frame). Runware catalog: KlingAI, Google Veo, MiniMax Hailuo, Seedance, PixVerse, Vidu (LTX/Wan "planned" in the launch post) — [Runware blog (search summary)](https://runware.ai/blog/lowest-cost-ai-video-generation-now-on-runware); H3 $0.08/s (768p), $0.13/s (2K); Kling 3.0 $0.168/s with audio — [Runware (search summary)](https://runware.ai/minimax-h3). Runware also documents Runway Gen-4.5 and Luma Ray3.2 endpoints — [Runware Gen-4.5 guide](https://runware.ai/docs/models/runway-gen-4-5/guides/directing-motion); [Runware Ray3.2 guide](https://runware.ai/docs/models/luma-ray3-2/guides/reframing-video).
- Runway API as aggregator: credits $0.01 each; third-party models incl. Veo 3.1 (10–40 credits/s by audio), Veo 3.1 Fast (10–15), Wan 3.0, Seedance 2/2.5, H3 Max, Hailuo3, Grok Imagine 1.5, Happy Horse 1.0 (15–30), Gemini Omni Flash (10–11) — [Runway API pricing](https://docs.dev.runwayml.com/guides/pricing/).
- WaveSpeed hosts PixVerse V6 Transition, LTX-2 Fast I2V, MiniMax H3 guides — [WaveSpeed PixVerse](https://wavespeed.ai/models/pixverse/pixverse-v6/transition); [WaveSpeed LTX-2 fast](https://wavespeed.ai/models/lightricks/ltx-2-fast/image-to-video). Markup/SDK: not verified.
- OpenRouter lists Seedance 2.0 / 2.5 and Grok Imagine Video — [OpenRouter Seedance 2.0](https://openrouter.ai/bytedance/seedance-2.0); [OpenRouter Grok Imagine](https://openrouter.ai/x-ai/grok-imagine-video).
- Result URLs are short-lived on several backends (Wan `video_url` 24 h; Seedance unsigned URLs < 24 h) — [Alibaba Cloud](https://www.alibabacloud.com/help/en/model-studio/wan3-video-generation-api-reference); [ofox.ai](https://ofox.ai/blog/seedance-api-guide-tiers-pricing-2026/).

### Inferences
- For a Claude Code agent on a Mac, fal (`pip install fal-client`, one `FAL_KEY`) covers Kling, H3, Wan 3.0, Seedance 2.5, LTX, PixVerse, Pika and Veo with an identical submit/poll/download loop — the lowest-friction way to A/B several models against the same keyframes. Runway's API is a strong second single-key option if Gen-4.5 is wanted alongside Wan/Seedance/Veo.
- Always download the MP4 immediately after completion (URLs expire in ~24 h on several providers).

### Gaps
- Replicate's Python pattern (`replicate.run` / predictions + webhooks) and exact per-second prices for each Replicate video model were not fetched.
- WaveSpeed pricing/markup and whether it hosts Veo: not verified.

## 5. Content-policy quirks relevant to pictogram human figures and a smartphone

### Takeaway
The main documented quirk is ByteDance's hard filter on real human faces in Seedance 2.x inputs (HTTP 400 "may contain a real person"); pictogram/faceless figures should not trigger it, and nothing found suggests stylized pictograms or a generic smartphone are restricted anywhere. Brand/IP filters (e.g., a recognizable phone brand or app logos) are reported for Seedance; keep phone and UI generic.

### Cited Findings
- "Seedance 2.0 series models do not support direct upload of reference images/videos containing real human faces"; rejection returns HTTP 400 `InputImageSensitiveContentDetected.PrivacyInformation` — "The request failed because the input image may contain a real person"; sanctioned workarounds: preset virtual avatars, AI-generated portraits, asset-ID authorization — [search summary, YingTu / MindStudio / clipdance](https://yingtu.ai/en/blog/seedance-2-0-human-face).
- Seedance has "Face and IP filters" — [MindStudio](https://www.mindstudio.ai/blog/seedance-2-0-content-restrictions-workarounds) (title; details not fetched).
- Runway runs an in-house visual moderation system with automatic suspensions for repeat triggers; embeds invisible C2PA provenance — [search summary of Runway safety / dev moderation docs](https://docs.dev.runwayml.com/api-details/moderation/).
- Kling `negative_prompt` default "blur, distort, and low quality" (useful to add "extra spheres, text, numbers, watermark") — [fal Kling v3 Pro](https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video).

### Inferences
- Faceless pictogram figures sidestep the real-face filters that are the most common rejection cause (Seedance). A smartphone with generic icons (no Apple/Google logos, no real app UIs) avoids IP filters.
- For "no garbled text/numbers", the safer design is to keep UI icons as simple glyphs present in the keyframe images and prompt for minimal motion on the phone; no model reviewed documents reliable in-video text preservation (MiniMax's "accurate text and brand rendering" is a vendor claim).

### Gaps
- No documentation found on how Kling, MiniMax, Luma, Wan, LTX or PixVerse moderate stylized human figures or device imagery.
- Visible-watermark policy for API output is undocumented for most providers (see §2 Gaps); C2PA/invisible marks are expected on Runway and possibly others.
