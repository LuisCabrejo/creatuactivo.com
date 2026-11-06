# Programmatic access to Google Veo (Gemini API vs Vertex AI / "Gemini Enterprise Agent Platform"), state as of 26 Sep 2026

Research date: 2026-09-26. Primary sources were fetched directly (curl of the official doc HTML plus the python-genai source on GitHub). Every official page's own "Last updated" stamp is quoted next to its facts. Naming note: Google's Cloud docs have **rebranded Vertex AI's generative docs to "Gemini Enterprise Agent Platform"** (URL `docs.cloud.google.com/gemini-enterprise-agent-platform/...`). The python SDK's error messages also say "Gemini Enterprise Agent Platform" for what used to be "Vertex AI". In these notes "Vertex" = that platform.

## 1. Which Veo models exist, with exact IDs, and which are GA vs preview (Sep 2026)?

### Takeaway
On the **Gemini API** (AI Studio key), every current Veo model is **Preview**: `veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview` and `veo-3.1-lite-generate-preview`. Veo 3.0 is deprecated. On **Vertex**, `veo-3.1-generate-001` and `veo-3.1-fast-generate-001` are **GA** (released 17 Nov 2025, with a listed retirement date of "November 17, 2026 or later"), and `veo-3.1-lite-generate-001` is Preview. Separately, Google now tells Gemini API users to default to a newer non-Veo model, **Gemini Omni Flash** (`gemini-omni-1.1-flash` stable, `gemini-omni-flash-preview`). It keeps Veo 3.1 for "scene extension, last-frame control, or legacy pipelines".

### Cited Findings
- Gemini API Veo page lists these model codes: `veo-3.1-generate-preview` (latest update January 2026), `veo-3.1-fast-generate-preview` (January 2026), `veo-3.1-lite-generate-preview` (March 2026). It also lists `veo-3.0-generate-001` "Veo 3 (Deprecated)" and `veo-3.0-fast-generate-001` "Veo 3 Fast (Deprecated)" (latest update July 2025). Page last updated 2026-09-17 — [Gemini API: Generate videos with Veo 3.1](https://ai.google.dev/gemini-api/docs/veo)
- The same page's feature table gives Status "Preview" for Veo 3.1 & 3.1 Fast and for 3.1 Lite, but "Stable" for "Veo 3 & Veo 3 Fast". That contradicts the "Deprecated" labels in its own Model versions section — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)
- The Gemini API pricing page groups "Veo 3.1: `veo-3.1-generate-preview, veo-3.1-fast-generate-preview, veo-3.1-lite-generate-preview`" (last updated 2026-09-24) — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Video overview page (last updated 2026-06-30): "Use Gemini Omni Flash as your default model for video generation". Veo 3.1 is for "scene extension, last-frame control, or integration with legacy pipelines" — [Gemini API: Video generation](https://ai.google.dev/gemini-api/docs/video)
- Gemini Omni Flash model IDs: stable `gemini-omni-1.1-flash`, preview `gemini-omni-flash-preview` (page last updated 2026-08-27). The pricing page says it is "now generally available to developers on the paid tier of the Gemini API" — [Gemini Omni Flash model page](https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash); [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Vertex Veo 3.1 page (last updated 2026-09-25):
  - `veo-3.1-generate-001`: Launch stage GA, release date November 17, 2025, retirement date "November 17, 2026 or later".
  - `veo-3.1-fast-generate-001`: GA, same dates.
  - `veo-3.1-lite-generate-001`: Launch stage Preview, release date April 2, 2026.

  Source: [Vertex / Agent Platform: Veo 3.1](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate)
- The Vertex image-to-video doc also lists `veo-3.0-generate-001` and `veo-3.0-fast-generate-001` as selectable models. One Go sample there still uses `veo-3.0-generate-preview` (last updated 2026-09-25) — [Vertex: generate videos from an image](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-an-image)
- Vertex pricing still lists Veo 3, Veo 3 Fast and Veo 2 SKUs, so they remain billable there — [Vertex generative AI pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing) (fetched 2026-09-26)
- A third-party search summary confirmed `veo-3.1-generate-001` as GA, released November 17, 2025 — [search result pointing to Vertex Veo 3.1 doc](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-1-generate)

### Inferences
- If "GA with an SLA" matters, only Vertex offers GA Veo. The Gemini API only exposes preview Veo IDs, which can change or be deprecated with less notice.
- The Vertex GA models show a retirement date about 7 weeks after today ("Nov 17, 2026 or later"). Any automation should keep the model ID in a config variable, and the developer should check the model page before that date for a successor (e.g., a Veo 3.2 / Veo 4 or an Omni-based replacement).
- No "Veo 4" or "Veo 3.2" appears in any official page fetched. Gemini Omni Flash is the "newer" video model Google now promotes. It is a different product line, with a different API (Interactions API) and token-based billing.

### Gaps
- I did not find an official announcement of a Veo successor, or a firm deprecation date for the Gemini API preview Veo 3.1 IDs.
- The contradiction on the Gemini API page (Veo 3 "Stable" vs "Deprecated") is unresolved. Treat Veo 3.0 as deprecated.

## 2. Exact capabilities per model: duration, 9:16, resolution, audio, image-to-video, first+last frame, extend, reference images, negative prompt, seed, videos per request

### Takeaway
All Veo 3.1 variants generate **4, 6 or 8 s** clips at **24 fps**, in **16:9 or 9:16**.
- **1080p/4K require 8 s.** 4K is only on Veo 3.1 standard and Fast (Gemini API), not Lite.
- Image-to-video and first+last-frame interpolation work on all 3.1 variants.
- Reference images (up to 3, "asset" type) and extension are **not** available on Lite.
- On the **Gemini API**: audio is always on, 1 video per request, and per the current SDK `seed`/`generate_audio` are rejected.
- On **Vertex**: `generateAudio` can be turned off (cheaper), `sampleCount` is 1–4, and `seed` and `negativePrompt` are accepted.
- Gemini Omni Flash produces **3–10 s**, 9:16 or 16:9, 360p–4K (1080p/4K are upscaled), first+last frame, and subject references. It has **no negative-prompt parameter** and makes **multiple shots by default** unless told otherwise.

### Cited Findings
**Gemini API — Veo 3.1 parameter table** ([Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo), last updated 2026-09-17):
- `aspectRatio`: "16:9" (default), "9:16". Same for 3.1, 3.1 Lite and Veo 3.
- `durationSeconds`: "4", "6", "8". It "Must be '8' when using extension, reference images or with 1080p and 4k resolutions" (Lite: "Must be '8' when using reference images or with 1080p").
- `resolution`: "720p" (default), "1080p" (only supports 8s duration), "4k" (only supports 8s duration); "720p" only for extension. Lite: 720p/1080p only.
- `image` = "An initial image to animate". `lastFrame` = "The final image for an interpolation video… Must be used in combination with the image parameter" (supported on 3.1, 3.1 Lite and Veo 3 per the table).
- `referenceImages`: "Up to three images to be used as style and content references" (3.1 & Fast; "n/a" for Lite and Veo 3). Code samples use `reference_type="asset"`.
- `video` (extension): Veo 3.1 & Fast only.
- Audio: "✔️ Always on" for all variants.
- "Videos per request: 1" for all variants.
- Frame rate 24fps.
- Veo 3/3 Fast: 8 s only, and "720p & 1080p (16:9 only)".
- "Note that the seed parameter is also available for Veo 3 models. It doesn't guarantee determinism, but slightly improves it."
- Text input limit is 1,024 tokens per the model-version cards.

**Extension (Gemini API):** "Use Veo 3.1 to extend videos that you previously generated with Veo by 7 seconds and up to 20 times." The input must be a Veo-generated video ≤141 s, 720p, 9:16 or 16:9. The output combines input and extension "for up to 148 seconds". It is not available on Lite. Only Veo-generated videos can be extended, and only ones generated or referenced within the last two days — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)

**Latency and retention (Gemini API):**
- "Request latency: Min: 11 seconds; Max: 6 minutes (during peak hours)."
- "Generated videos are stored on the server for 2 days, after which they are removed."

Source: [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)

**What the python SDK allows per backend** (googleapis/python-genai `models.py`, main branch; latest release v2.25.0, published 2026-09-22):
- When targeting the Gemini API (mldev), the SDK raises `ValueError` for `output_gcs_uri`, `fps`, **`seed`**, `pubsub_topic`, **`generate_audio`**, `mask`, `compression_quality`, `labels` and `resize_mode`, each with the message "…only supported in Gemini Enterprise Agent Platform".
- `negative_prompt`, `enhance_prompt`, `last_frame`, `reference_images`, `number_of_videos`, `person_generation`, `resolution`, `duration_seconds` and `aspect_ratio` pass through to the Gemini API.
- `webhook_config` is Gemini-API-only.

Source: [python-genai models.py](https://github.com/googleapis/python-genai/blob/main/google/genai/models.py); [python-genai types.py `GenerateVideosConfig`](https://github.com/googleapis/python-genai/blob/main/google/genai/types.py)
- **Conflict:** the Gemini API docs say `seed` "is also available", but the current SDK blocks `seed` for the Gemini API backend. The SDK was checked on 2026-09-26.
- `negative_prompt` is a field of `GenerateVideosConfig` ("Explicitly state what should not be included in the generated videos"). It is **not listed** in the Gemini API Veo parameter table as of 2026-09-17 — [types.py](https://github.com/googleapis/python-genai/blob/main/google/genai/types.py); [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)

**Vertex Veo 3.1 spec** ([Veo 3.1 on Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate), last updated 2026-09-25):
- `veo-3.1-generate-001`:
  - Video lengths: "4, 6, or 8 seconds; reference image to video only supports 8 seconds".
  - "Maximum number of output videos per prompt: 4".
  - Image input max 20 MB.
  - Aspect ratios 9:16, 16:9.
  - Input resolutions 720p, 1080p; output 720p, 1080p, 4K; 24 FPS.
  - Capabilities: "Text to video, image to video, from first and last frame", extend videos, reference images ("Asset images"), sound generation, and "Content Credentials (C2PA) Supported".
  - Prompt languages: "English". Region: "United States: us-central1".
  - Quota line reads verbatim "Regional online prediction requests per base model per minute per base model: 50 tokens per minute".
  - Consumption: "Pay-as-you-go: Not supported", "Fixed quota: Supported", "Provisioned Throughput: Supported", "Batch inference: Not supported".
- `veo-3.1-fast-generate-001`: 4/6/8 s; output 720p/1080p (4K **not** listed in the spec, although the pricing page has a Fast 4K SKU); otherwise the same.
- `veo-3.1-lite-generate-001` (Preview): 4/6/8 s; output 720p/1080p; reference images "Not supported"; extend videos "Supported". Its modality line says Image "Not supported", while its capability line says "image to video, from first and last frame Supported". That is an internal inconsistency on the page.

**Vertex request parameters** ([Vertex image-to-video](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-an-image), last updated 2026-09-25):
- `sampleCount` "accepted range of values is 1-4". Duration for "Veo 3 models: 4, 6, or 8. The default is 8."
- `negativePrompt` (optional).
- `personGeneration`: "allow_adult" (default) or "disallow".
- `resolution`: "720p", "1080p", "4k".
- `seed`: uint32, 0-4294967295; "Specifying a seed number… without changing other parameters guides the model to produce the same videos".
- `resizeMode`: "crop" / "pad".
- `storageUri`: "If not provided, video bytes are returned in the response".

**Vertex pricing implies audio can be turned off:** it lists separate "Video + Audio generation" and "Video generation" (video-only) SKUs for Veo 3.1, 3.1 Fast, 3.1 Lite, 3 and 3 Fast — [Vertex pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing). The SDK field is `generate_audio` ("Whether to generate audio along with the video") — [types.py](https://github.com/googleapis/python-genai/blob/main/google/genai/types.py)

**Gemini Omni Flash** ([Omni Flash model page](https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash), 2026-08-27; [Omni docs](https://ai.google.dev/gemini-api/docs/omni), last updated 2026-09-23):
- Specs: output 3–10 s, 24 FPS, resolutions 360p, 720p (default), 1080p (upscaled), 4K (upscaled); `aspect_ratio` "9:16" or "16:9" (default 16:9).
- Supports image-to-video, "First and last frame interpolation" (two images in the input list), "Subject reference" (multiple images), video editing, and extension (append-only).
- Limitations: "System instructions, temperature, top_p, stop sequences, and negative prompts are not supported (you can put your negatives in the regular prompt…)". "Video references support a maximum of 3 clips, up to 3 seconds each."
- "By default Omni Flash will try to create a video with a few different shots… If you need the output video to contain a single scene, you must prompt for that: In a single unbroken scene / In a single continuous shot / No scene cuts".
- A `task` parameter (`text_to_video`, `image_to_video`, `reference_to_video`, `edit`, `extend`) is optional.

### Inferences
- For the stated workflow (8 s, 9:16, first frame, sometimes first+last frame, no need for Veo's audio), all Veo 3.1 variants fit. **Veo 3.1 Lite** also fits if 1080p is enough and no reference images or extension are needed.
- Vertex is the only route to (a) disable audio and pay the lower video-only price, (b) get up to 4 variations per request, and (c) use `seed` via the SDK.
- Omni Flash is a viable alternative (10 s max; conversational edits like "keep everything else the same"). However, its multi-shot default and lack of a negative-prompt field matter for minimalist single-shot clips. Always include "single continuous shot, no scene cuts".
- Chaining clips (last frame of clip N → first frame of clip N+1) is done client-side: extract the last frame with ffmpeg and pass it as `image=`. Veo's built-in "extend" is 720p-only on the Gemini API, which conflicts with a 1080p deliverable.

### Gaps
- I did not find the exact parameter that sets duration on Omni Flash. The docs give 3–10 s output but no `duration` field in the sections I extracted; it may be prompt-driven.
- Whether `negative_prompt` is honored or ignored by the Gemini API Veo backend is unverified. The SDK sends it, but the docs no longer list it.
- Vertex's "style" reference type for Veo 3.1 is not listed (only "Asset images"). Whether style references still exist on any Veo model was not verified.

## 3. Pricing per second (Gemini API vs Vertex), free tier/rate limits, and monthly cost for ~87 × 8 s clips

### Takeaway
**Gemini API** (per second, audio always included; page updated 2026-09-24):
- Veo 3.1 Standard: $0.40 (720p/1080p), $0.60 (4K).
- Veo 3.1 Fast: $0.10 (720p), $0.12 (1080p), $0.30 (4K).
- Veo 3.1 Lite: $0.05 (720p), $0.08 (1080p).
- Omni Flash: about $0.10/s at 720p.
- **No free tier for Veo or Omni.**

**Vertex** has the same with-audio prices plus cheaper video-only SKUs (Standard $0.20, Fast $0.08–0.10, Lite $0.03–0.05 per second). At 87 clips × 8 s = **696 s/month**, one take per clip costs roughly **$21 (Vertex Lite 720p, no audio) to $418 (Gemini API Standard 4K)**. The realistic middle is **$70–140/month**.

### Cited Findings
- **Gemini API** "Paid Tier, per second in USD" (page last updated 2026-09-24):
  - "Veo 3.1 Standard video with audio price (default)": $0.40 (720p and 1080p), $0.60 (4k).
  - "Veo 3.1 Fast…": $0.10 (720p), $0.12 (1080p), $0.30 (4k).
  - "Veo 3.1 Lite…": $0.05 (720p), $0.08 (1080p), "4k output not supported".
  - Free Tier: "Not available" for all.
  - "You will only be charged if your video is successfully generated."

  Source: [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **Gemini API, Omni Flash** (`gemini-omni-1.1-flash` and `gemini-omni-flash-preview`): input $1.50/1M tokens, text output $9.00/1M, **video output $17.50/1M tokens**. "Billing is… calculated at a rate of 5,792 tokens per second of 720p video… approximately $0.10 per second." Free Tier "Not available" — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **Vertex** (fetched 2026-09-26; units shown as "/ 1 count"):

  | Model | Video + Audio | Video only |
  |---|---|---|
  | Veo 3.1 | $0.40 (720p, 1080p), $0.60 (4k) | $0.20 (720p, 1080p), $0.40 (4k) |
  | Veo 3.1 Fast | $0.10 (720p), $0.12 (1080p), $0.30 (4k) | $0.08 (720p), $0.10 (1080p), $0.25 (4k) |
  | Veo 3.1 Lite | $0.05 (720p), $0.08 (1080p) | $0.03 (720p), $0.05 (1080p) |
  | Veo 3 | $0.40 | $0.20 |
  | Veo 3 Fast | $0.10/$0.12 | $0.08/$0.10 |
  | Veo 2 | — | $0.50 (720p); Advanced Controls $0.50 |

  Source: [Vertex generative AI pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Vertex, Omni Flash:** the same token prices. Output is 1931 tokens/s at 360p, 5792 at 720p, 8688 at 1080p and 17376 at 4K "(with audio)"; inputs are charged "1120 tokens per image" — [Vertex pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Rate limits (Gemini API):**
  - "Rate limits are applied per project, not per API key."
  - Active limits are shown in AI Studio ("View your active rate limits in AI Studio").
  - Tiers: Free = active project; **Tier 1 = "Set up and link an active billing account" (billing tier cap $250)**; Tier 2 = "Paid $100 + 3 days from first successful payment" (cap $2,000); Tier 3 = "Paid $1,000 + 30 days" ($20,000–$100,000+).
  - Page last updated 2026-09-02.

  Source: [Gemini API rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- **Stale third-party figures:** older posts quote Vertex Veo 3.1 at $0.50/s video-only and $0.75/s with audio (the Oct 2025 launch prices). Current official Vertex pricing is $0.20 / $0.40 — [search results incl. aifreeapi/akool](https://www.aifreeapi.com/en/posts/veo-3-1-pricing-per-second-gemini-api). A third-party tracker dated Sep 5, 2026 matches the current Gemini API figures ($0.40 / $0.10 / $0.05) — [costgoat](https://costgoat.com/pricing/google-veo)

**Cost for 87 clips × 8 s = 696 s/month (one generation per clip)**, computed from the official prices above:

| Route / model | Resolution | $/s | $/clip (8 s) | $/month (696 s) |
|---|---|---|---|---|
| Gemini API Veo 3.1 Standard | 720p/1080p | 0.40 | 3.20 | 278.40 |
| Gemini API Veo 3.1 Standard | 4K | 0.60 | 4.80 | 417.60 |
| Gemini API Veo 3.1 Fast | 720p | 0.10 | 0.80 | 69.60 |
| Gemini API Veo 3.1 Fast | 1080p | 0.12 | 0.96 | 83.52 |
| Gemini API Veo 3.1 Fast | 4K | 0.30 | 2.40 | 208.80 |
| Gemini API Veo 3.1 Lite | 720p | 0.05 | 0.40 | 34.80 |
| Gemini API Veo 3.1 Lite | 1080p | 0.08 | 0.64 | 55.68 |
| Vertex Veo 3.1 Standard, video-only | 720p/1080p | 0.20 | 1.60 | 139.20 |
| Vertex Veo 3.1 Standard, video-only | 4K | 0.40 | 3.20 | 278.40 |
| Vertex Veo 3.1 Fast, video-only | 1080p | 0.10 | 0.80 | 69.60 |
| Vertex Veo 3.1 Lite, video-only | 720p | 0.03 | 0.24 | 20.88 |
| Vertex Veo 3.1 Lite, video-only | 1080p | 0.05 | 0.40 | 34.80 |
| Gemini API Omni Flash | 720p (~5,792 tok/s × $17.50/M) | ≈0.101 | ≈0.81 | ≈70.55 |
| Gemini API Omni Flash | 1080p (8,688 tok/s) | ≈0.152 | ≈1.22 | ≈105.82 |

### Inferences
- Stylized clips usually need retakes. Multiply by the expected takes per keeper (e.g., ×2–3). Standard 1080p on the Gemini API at 3 takes/clip would be about $835/month. Fast 1080p would be about $250. Vertex Standard video-only would be about $418.
- Since the workflow doesn't need Veo's generated audio, Vertex video-only gives **half price on Veo 3.1 Standard** ($0.20 vs $0.40/s) versus the Gemini API, where audio is mandatory.
- A reasonable pipeline: explore with Lite or Fast (cheap drafts at 720p), then re-run the chosen prompt/first-frame on Standard at 1080p. Note that `seed` is only available via Vertex in the SDK, and even there it only "guides" rather than guarantees reproducibility.
- Tier 1 on the Gemini API caps spending at $250 (the "billing tier cap"). That is enough for the Fast/Lite scenarios but could be hit by Standard with retakes until Tier 2 unlocks (after $100 paid + 3 days).

### Gaps
- Exact Veo RPM/RPD per tier on the Gemini API is not published on the rate-limits page; it says to check AI Studio.
- The Vertex pricing table labels units "/ 1 count" rather than "per second". I infer per-second from the identical Gemini API figures, but I did not find an explicit statement.
- Vertex's Veo spec says "Pay-as-you-go: Not supported; Fixed quota: Supported". How a small account obtains quota (default allotment vs. request) was not verified.

## 4. Watermarking: SynthID vs visible sparkle — do API outputs carry a visible watermark?

### Takeaway
Official API docs mention only the **invisible SynthID watermark** for Veo and Omni. Vertex also lists **C2PA Content Credentials**. No official API doc mentions a visible mark, so API outputs should be free of the corner sparkle, but I found no explicit Google statement saying "no visible watermark via API". In the **Gemini app**, videos carry a visible watermark plus SynthID. The app now has a **"Media Watermark" setting** that turns off only the visible mark; in India, South Korea and Vietnam only AI Ultra subscribers can change it.

### Cited Findings
- Gemini API: "Watermarking: Videos created by Veo are watermarked using SynthID, our tool for watermarking and identifying AI-generated content. Videos can be verified using the SynthID verification platform." — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)
- Omni Flash: "All generated videos include SynthID watermarking, which is invisible to viewers but can be detected programmatically for provenance verification." — [Gemini API Omni docs](https://ai.google.dev/gemini-api/docs/omni)
- Vertex Veo 3.1: "Content Credentials (C2PA) Supported" for all three 3.1 models — [Vertex Veo 3.1](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate)
- Gemini app (photo-to-video, Veo 3): videos include "a visible watermark to show they are AI-generated and an invisible SynthID digital watermark" — [Google blog: photo to video in Gemini](https://blog.google/products-and-platforms/products/gemini/photo-to-video/) (via search snippet)
- Gemini Apps Help, "Manage watermark settings":
  - Steps: "go to gemini.google.com. At the bottom left, click Settings and then Media Watermark. Turn the setting on or off."
  - For video, "Visible watermarks appear as a persistent overlay on generated video content".
  - The setting "only controls the visible watermark. It doesn't affect SynthID watermarks or Content Credentials".
  - In India, South Korea and Vietnam, managing it requires an AI Ultra subscription.
  - It applies to "Gemini Apps (web and mobile), not AI features in other Google products".

  Source: [Gemini Apps Help 17405358](https://support.google.com/gemini/answer/17405358?hl=en&co=GENIE.Platform%3DDesktop)
- A third-party blog discusses an occasional "veo" visible mark in the bottom-right of **Google Flow** videos, and says Ultra users are exempt from the visible mark only in Flow. This is secondary and unverified — [apiyi blog](https://help.apiyi.com/en/veo-3-1-watermark-google-flow-video-generation-synthid-guide-en.html)

### Inferences
- Moving from the Gemini app to either API should remove the visible sparkle, because the API docs describe only SynthID/C2PA. This is inferred from omission, not an explicit statement.
- Even in the app, the user in Colombia may be able to switch off the visible watermark via Settings → Media Watermark. Colombia is not in the Ultra-only list, but eligibility was not verified for Colombia.
- SynthID and C2PA remain in every route. Stripping them is not supported and is outside policy.

### Gaps
- There is no explicit official sentence of the form "Gemini API/Vertex Veo outputs have no visible watermark". Confirm empirically on the first API clip.
- Whether the "Media Watermark" toggle is available to the user's plan (Pro vs Ultra) in Colombia is not stated.

## 5. Setup from a Mac terminal, with code patterns (Gemini API key vs Vertex)

### Takeaway
**Gemini API (simplest for Claude Code):**
1. Create an API key in AI Studio and link a billing account. Tier 1 is required because Veo has no free tier.
2. `pip install -U google-genai`.
3. `export GEMINI_API_KEY=...`.
4. Call `client.models.generate_videos(...)`, poll `client.operations.get(op)` every ~10 s, then `client.files.download(...)` within 2 days.

**Vertex:**
1. `gcloud auth application-default login`.
2. Set `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION=global` (the model is served in us-central1) and `GOOGLE_GENAI_USE_ENTERPRISE=True` (the older `GOOGLE_GENAI_USE_VERTEXAI` is still honored).
3. Use the same `generate_videos` call with `-001` model IDs. Omit `output_gcs_uri` to get video bytes back.

### Cited Findings
- **Gemini API text-to-video, 9:16** (verbatim structure from the docs):
  ```python
  import time
  from google import genai
  from google.genai import types
  client = genai.Client()
  operation = client.models.generate_videos(
      model="veo-3.1-generate-preview",
      prompt=prompt,
      config=types.GenerateVideosConfig(aspect_ratio="9:16"),
  )
  while not operation.done:
      time.sleep(10)
      operation = client.operations.get(operation)
  generated_video = operation.response.generated_videos[0]
  client.files.download(file=generated_video.video, destination="pizza_making.mp4")
  ```
  — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)
- **Image-to-video:** `image=` is passed at the top level. The doc example produces the image with Nano Banana 2 (`gemini-3.1-flash-image-preview`) and passes `image=image.parts[0].as_image()` — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo). For a local PNG, the SDK provides `types.Image.from_file(*, location: str, mime_type: Optional[str] = None)`, which "Lazy-loads an image from a local file or Google Cloud Storage" — [python-genai types.py](https://github.com/googleapis/python-genai/blob/main/google/genai/types.py)
- **First + last frame (interpolation):**
  ```python
  operation = client.models.generate_videos(
      model="veo-3.1-generate-preview",
      prompt=prompt,
      image=first_image,                       # starting frame
      config=types.GenerateVideosConfig(last_frame=last_image),
  )
  ```
  — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)
- **Reference images:** `config=types.GenerateVideosConfig(reference_images=[types.VideoGenerationReferenceImage(image=..., reference_type="asset"), ...])` (up to 3) — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)
- **Extension:** `generate_videos(model="veo-3.1-generate-preview", video=operation.response.generated_videos[0].video, prompt=..., config=types.GenerateVideosConfig(number_of_videos=1, resolution="720p"))` — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)
- **REST:** base URL `https://generativelanguage.googleapis.com/v1beta` with header `x-goog-api-key: $GEMINI_API_KEY`; the video URI is downloaded with `curl -L -o out.mp4 -H "x-goog-api-key: $GEMINI_API_KEY" "${video_uri}"` — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)
- **SDK signature:** `generate_videos(*, model, prompt=None, image=None, video=None, source=None, config=None) -> GenerateVideosOperation`. Newer SDKs add a `source` (`GenerateVideosSource`) argument. The SDK is at v2.25.0 (2026-09-22). `GenerateVideosConfig` also has `webhook_config` ("Webhook configuration for receiving notifications when the video generation operation completes"), which is Gemini-API-only and avoids polling — [python-genai models.py](https://github.com/googleapis/python-genai/blob/main/google/genai/models.py); [types.py](https://github.com/googleapis/python-genai/blob/main/google/genai/types.py)
- **Billing requirement:** Veo's Free Tier is "Not available" on the pricing page. Tier 1 requires "Set up and link an active billing account" — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing); [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- **Vertex setup:**
  - The docs set `export GOOGLE_CLOUD_PROJECT=...`, `export GOOGLE_CLOUD_LOCATION=global` and `export GOOGLE_GENAI_USE_ENTERPRISE=True`, then `pip install --upgrade google-genai`.
  - Sample: `client.models.generate_videos(model="veo-3.1-generate-001", prompt=..., image=Image(gcs_uri="gs://…/flowers.png", mime_type="image/png"), config=GenerateVideosConfig(aspect_ratio="16:9", output_gcs_uri=output_gcs_uri))`, polling `client.operations.get(operation)` every 15 s, then reading `operation.result.generated_videos[0].video.uri`.
  - The REST notes assume `gcloud init` or `gcloud auth login`. The endpoint is `POST https://us-central1-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/us-central1/publishers/google/models/MODEL_ID:predictLongRunning`, with the image as `"bytesBase64Encoded"`.

  Source: [Vertex image-to-video](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-an-image)
- The SDK reads `GOOGLE_GENAI_USE_ENTERPRISE` and `GOOGLE_GENAI_USE_VERTEXAI`. If both are set with conflicting values, "The value of GOOGLE_GENAI_USE_ENTERPRISE will be used" — [python-genai _api_client.py](https://github.com/googleapis/python-genai/blob/main/google/genai/_api_client.py)
- The genmedia MCP servers authenticate via "Application Default Credentials (ADC)" or `GOOGLE_APPLICATION_CREDENTIALS`, not API keys — [mcp-genmedia](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
- **Omni Flash** uses a different call:
  - `client.interactions.create(model="gemini-omni-1.1-flash", input=[{"type":"image","data":first_b64,"mime_type":"image/jpeg"}, {"type":"image","data":last_b64,...}, {"type":"text","text":"..."}], response_format={"type":"video","aspect_ratio":"9:16","resolution":"1080p"})`.
  - Save with `base64.b64decode(interaction.output_video.data)`.
  - For videos >4MB use `response_format={"type":"video","delivery":"uri"}` and poll `client.files.get(...)` until `ACTIVE`.

  Source: [Gemini API Omni docs](https://ai.google.dev/gemini-api/docs/omni)

### Inferences
- For Claude Code on an M1 Mac, a ~60-line Python CLI (`veo.py --first f.png [--last l.png] --prompt-file p.txt --model … --res 1080p --out clip.mp4`) wrapping the snippets above is all that's needed. Claude Code can call it via Bash, poll, and save into the reels pipeline folder. No MCP server is required.
- The Gemini API route needs only an API key. The Vertex route needs a GCP project, the Vertex AI API enabled, billing, and ADC. Vertex pays off for the video-only discount, `seed`, and up to 4 samples per request.
- For Vertex, the model is listed only in `us-central1`, yet the SDK samples use `GOOGLE_CLOUD_LOCATION=global`. If `global` fails for Veo, use `us-central1`.
- A local-file first frame on Vertex can be sent inline (`bytesBase64Encoded` in REST; `Image.from_file` in the SDK), so a GCS bucket is not strictly required when `output_gcs_uri` is omitted. This is inferred from "If not provided, video bytes are returned in the response".

### Gaps
- Enabling the Vertex AI API, and any default Veo quota a new project gets, were not documented in the pages fetched.
- Whether `Image.from_file` with a local path works identically on both backends was not tested.

## 6. Known quirks: prompt adherence, duplication, text rendering, Spanish vs English, content filters, personGeneration

### Takeaway
Official docs say **only English is fully supported**; other languages "may work but results can vary". Vertex lists the prompt language as "English". **personGeneration is locked**: `allow_adult` only for image-to-video, interpolation and reference images, and `allow_all` only for text-to-video. In EU/UK/CH/MENA only `allow_adult` is allowed. Audio-related safety blocks can kill a generation, and blocked generations aren't billed. For Omni Flash, single-shot output must be explicitly requested.

### Cited Findings
- "Language support: English (EN) is fully supported, but other languages have not been evaluated, so they may work but results can vary." — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo). The same wording appears for Omni — [Omni docs](https://ai.google.dev/gemini-api/docs/omni). Vertex Veo 3.1 "Prompt languages: English" — [Vertex Veo 3.1](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate)
- **personGeneration:**
  - Veo 3.1: "Text-to-video & Extension: 'allow_all' only; Image-to-video, Interpolation, & Reference images: 'allow_adult' only".
  - "In EU, UK, CH, MENA locations, allow_adult is the only allowed value for personGeneration".

  Source: [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo). Vertex: `"allow_adult"` (default) or `"disallow"` — [Vertex i2v](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-an-image)
- "Audio error: Veo 3.1 will sometimes block a video from generating because of safety filters or other processing issues with the audio. You will not be charged if your video is blocked." Also: "Generated videos are passed through safety filters and memorization checking processes" — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)
- "Multi-video prompting: Referencing or reasoning across multiple videos is not currently supported." — [Gemini API Veo](https://ai.google.dev/gemini-api/docs/veo)
- **Omni Flash:**
  - Makes multiple shots by default. "In a single unbroken scene / In a single continuous shot / No scene cuts" is needed.
  - Negatives go in the prompt ("No dialogue", "No embellishments", "No extra sound effects").
  - For edits, add "Keep everything else the same".
  - "Uploading and editing images containing certain recognizable people is not supported."

  Source: [Omni docs](https://ai.google.dev/gemini-api/docs/omni)
- The Vertex MCP Veo tool exposes `ALLOW_UNSAFE_MODELS` only for model-string validation; it is unrelated to safety filters — [mcp-veo-go README](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/blob/main/experiments/mcp-genmedia/mcp-genmedia-go/mcp-veo-go/README.md)

### Inferences
- **Spanish prompts:** write the prompt in English even when the project copy is Spanish. Keep any on-screen text out of the generation and add it in post (the reel pipeline already does titles and subtitles with Pillow/ffmpeg).
- **Human pictograms:** in image-to-video, `allow_adult` is the only option on the Gemini API, and it permits adult figures. Stylized pictogram figures should pass. Setting `disallow`/`dont_allow` (Vertex) would likely suppress them. Do not describe figures as children.
- **Minimalist 3D scene (one gold orb on a grid floor):** Veo already has the geometry from the first frame. Describe only camera motion and the orb's motion, and the positive inventory ("the scene contains only…"). This matches the project's existing memory note that negations invite the unwanted element. On Vertex, `negativePrompt` is available as a separate field, which keeps negatives out of the main prompt.

### Gaps
- I found no official or reputable source that quantifies object duplication (e.g., a second orb appearing) or text-rendering failure rates for Veo 3.1. A search summary claimed "text rendered within scenes is garbled more often than not" and "faces in motion degrade past about three seconds". The originating page could not be pinned to a specific reputable source, so this is unverified.
- No official statement on how the safety classifier treats abstract human pictograms.

## 7. Is there an official MCP server/tool for Veo usable by Claude Code?

### Takeaway
There is no officially supported Google MCP product for Veo. The closest is Google Cloud's open-source, "not an officially supported Google product" **mcp-genmedia** suite in `GoogleCloudPlatform/vertex-ai-creative-studio`. Its **`mcp-veo-go`** server (v3.7.0, actively maintained, commits 25–26 Sep 2026) exposes the tools `veo_t2v`, `veo_i2v`, `veo_extend_video`, `veo_first_last_to_video`, `veo_reference_to_video` and `veo_ingredients_to_video`. It is **Vertex-only** (ADC + project), always writes output to a **GCS bucket**, and takes input images as `gs://` URIs. It can run over stdio, so it can be registered in Claude Code, but its README only shows gemini-cli / ADK / Genkit configs.

### Cited Findings
- mcp-genmedia: MCP servers for "Gemini Image, Gemini TTS, Veo, Chirp, Imagen, and Lyria". They use Vertex AI and require `PROJECT_ID`/`GOOGLE_CLOUD_PROJECT`, `LOCATION`, and `GENMEDIA_BUCKET`, authenticated via ADC or `GOOGLE_APPLICATION_CREDENTIALS`, "not Gemini API keys". Disclaimer: "This is not an officially supported Google product." Installer: `curl -sL https://raw.githubusercontent.com/GoogleCloudPlatform/genmedia-creative-studio/main/experiments/mcp-genmedia/mcp-genmedia-go/install-online.sh | bash`. Sample configs exist for geminicli, ADK and Genkit — [mcp-genmedia](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
- mcp-veo-go README ("MCP Veo Server (Version: 3.7.0)"):
  - Tools: `veo_t2v`, `veo_i2v` (`image_uri` "GCS URI of the input image", default model `"veo-3.1-fast-generate-001"`, default aspect "16:9", duration "Default: `5`. Min: `5`, Max: `8`"), `veo_extend_video` (input MP4 1–30 s, 24 fps, 16:9 or 9:16; "Output is a 7s extension"), and `veo_first_last_to_video` & `veo_reference_to_video` & `veo_ingredients_to_video` (support `seed`, `output_filename`).
  - "Because Veo always writes to GCS, every Veo tool appends one MCP `resource_link`…".
  - An optional `output_directory` downloads the result locally.
  - Env vars: `GOOGLE_CLOUD_PROJECT` (required), `GOOGLE_CLOUD_LOCATION`, `GENMEDIA_BUCKET`, `ALLOW_UNSAFE_MODELS`.
  - Built with `go build`/`go install`; supports an http transport (`-transport http`).

  Source: [mcp-veo-go README](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/blob/main/experiments/mcp-genmedia/mcp-genmedia-go/mcp-veo-go/README.md)
- Recent commits to mcp-veo-go: 2026-09-25 "fix(mcp-genmedia): confine caller-supplied output directories (CWE-22 path traversal)", plus dependency bumps on 2026-09-25/26 — [GitHub commits API for mcp-veo-go](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/commits/main/experiments/mcp-genmedia/mcp-genmedia-go/mcp-veo-go). Search results also report a migration to the `GenerateVideosFromSource` API and a `veo_extend_video` tool — [mcp-genmedia repo](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)

### Inferences
- The `veo_i2v` README's "Min 5, Max 8, default 5" duration looks like a leftover from Veo 2. Veo 3.1 accepts only 4/6/8. Pass `duration: 8` explicitly.
- For this user, the MCP route adds overhead: a GCP project, a GCS bucket, uploading first frames to `gs://`, and Go binaries. It is also Vertex-only. A small local Python script on the Gemini API (or on Vertex with inline bytes) is simpler, cheaper to maintain, and fully controllable by Claude Code through Bash. The MCP server makes sense only if the goal is to let Claude call Veo as a native tool without a wrapper script.
- `googleapis/genai-toolbox` (MCP Toolbox) is database-oriented. I found no Veo/media tools in it (not verified in depth).

### Gaps
- No official Google MCP server for Veo/Gemini media that works with a Gemini API key was found.
- No documented Claude Code configuration for mcp-genmedia exists. Compatibility with a generic stdio MCP client is inferred, not tested.
