# Claude Code skills, plugins and MCP servers for AI video generation and editing (state as of 26 Sep 2026)

Scope: tools you can install today that let Claude Code, running on an Apple M1 Mac with 8 GB RAM, generate video clips, keyframe images and voice-over, and assemble or edit video in code. The current stack is ffmpeg + Python + Remotion (React Three Fiber), the ElevenLabs API, and Veo used by hand in the Gemini app.
Method: I pulled GitHub metadata through the public API on 26 Sep 2026 (last push date, stars, archived flag), read raw READMEs and the official docs pages, and ran web searches for the rest. "Last push" dates come from the GitHub API on that day. Anything marked **[derived]** is a command I built from Claude Code's documented `claude mcp add` syntax; the vendor does not publish it.

---

## 1. Remotion's official agent skills and Remotion MCP

### Takeaway
Remotion keeps an official, actively maintained Agent Skills repo (`remotion-dev/skills`, pushed 25 Sep 2026, ~4.7k stars). It installs with `npx skills add remotion-dev/skills`, or with `npx remotion skills add` from inside a Remotion project. The old Remotion MCP is **deprecated** and replaced by the `/remotion-docs` skill. Remotion is not listed in Anthropic's official plugin marketplace.

### Cited Findings
- Repo `remotion-dev/skills` ("Agent Skills"): last push 2026-09-25, 4,715 stars, not archived. Parent repo `remotion-dev/remotion`: last push 2026-09-26, 60.5k stars. — [GitHub API: remotion-dev/skills](https://api.github.com/repos/remotion-dev/skills)
- Install command (official README): `npx skills add remotion-dev/skills`. New projects created with `bun create video` also offer to add the skills. The README says the skills work for "Claude Code, Codex, Kimi Code or Cursor". — [remotion-dev/skills README](https://github.com/remotion-dev/skills)
- The Remotion docs give an alternative command to run from inside a project: `npx remotion skills add`. Restart the coding agent if it does not pick up the new skills. — [Remotion docs: MCP (deprecated)](https://www.remotion.dev/docs/ai/mcp)
- Skills published (README, auto-generated):
  - `/remotion-best-practices`: router that loads all the others.
  - `/remotion-create`: new project or composition.
  - `/remotion-markup`: compositions, animations, layout, typography, media, effects, audio, fonts, timing.
  - `/remotion-studio`: launches the preview.
  - `/remotion-render`: renders a video or still.
  - `/remotion-maps`: Mapbox, MapLibre, GeoJSON, CesiumJS flyovers.
  - `/remotion-captions`: captions and subtitles.
  - `/remotion-saas`: Player, Lambda, Vercel, Cloudflare.
  - `/remotion-interactivity`: editable in Studio.
  - `/remotion-docs`: searches the live docs.
  - `/remotion-upgrade`: upgrades Remotion and the installed skills.
  - `/remotion-multimedia`: Mediabunny; metadata, trim, crop.
  
  — [remotion-dev/skills README](https://github.com/remotion-dev/skills)
- `/remotion-markup` has reference files named `3d.md`, `ffmpeg.md`, `audio.md`, `sfx.md`, `silence-detection.md`, `motion-blur.md`, `light-leaks.md`, `multi-scene-video.md`, `lottie.md`, `embedding-videos.md`, `google-fonts.md`, `local-fonts.md` and `measuring-text.md`, among others. The 3D file is relevant to the R3F stack. `/remotion-captions` has `transcribe-captions.md`, `import-srt-captions.md` and `display-captions.md`. — [remotion-dev/skills repo tree](https://github.com/remotion-dev/skills/tree/main/skills)
- The router skill's frontmatter reads `version: 4.0.529`. The skill tells the agent: "If you detect a surprising change made in the meanwhile, don't overwrite it, assume it was intentional or ask for confirmation." — [remotion-best-practices/SKILL.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-best-practices/SKILL.md)
- **The Remotion MCP is deprecated.**
  - The docs say: "Install Remotion Agent Skills and use /remotion-docs instead. The hosted MCP will shut down no earlier than August 31, 2026. New installations are not recommended."
  - Reasons given: its data can be less current than the docs, Remotion pays the token costs, it is hard to install, "agents do not invoke them reliably", and it duplicates `/remotion-docs`.
  - Shutdown is tracked in GitHub issue #9055. The page was last updated 25 Sep 2026.
  
  — [Remotion docs: MCP (deprecated)](https://www.remotion.dev/docs/ai/mcp)
- I parsed `marketplace.json` from Anthropic's official plugin marketplace (314 plugins) on 26 Sep 2026. No entry matches "remotion". — [anthropics/claude-plugins-official marketplace.json](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json)

### Inferences
- For this user, the Remotion skills are the lowest-risk, highest-value install: free, local, and aimed at the framework already in use. Of all the files, `remotion-markup/3d.md` and the captions skill map most directly onto the existing pipeline.
- `npx skills` is Vercel's open "agent skills" CLI (repo `vercel-labs/skills`, 32.5k stars, pushed 18 Sep 2026). It is the de-facto cross-agent installer that Remotion, ElevenLabs, Runway, Kling and HeyGen all document. — [GitHub API: vercel-labs/skills](https://api.github.com/repos/vercel-labs/skills)

### Gaps
- I did not verify where `npx skills add` writes files for Claude Code (e.g. `.claude/skills/` in the project or `~/.claude/skills/`), or whether it asks which agent to target. Check this interactively on the first install.
- I did not check whether Remotion rendering with R3F/WebGL fits in 8 GB RAM at 1080×1920. No source found in this scope.

---

## 2. MCP servers for video, image and voice generation

### Takeaway
The most mature and easiest option for Claude Code is **fal.ai's hosted MCP**: one `claude mcp add` line, 11 tools including async job polling and a pricing lookup, and access to Kling, Veo and other models. Four other official options exist:
- **Google's genmedia MCP servers** (Veo 3.1, Nano Banana, Gemini TTS, Chirp, Lyria, plus an ffmpeg "AVTool"). Very active, but they need a GCP project, Vertex billing, application default credentials and a GCS bucket.
- **Replicate** (hosted plus an npm package, with an official Claude Code "code mode" command).
- **Runway** (MCP server plus an official skills plugin in Anthropic's marketplace).
- **MiniMax** (official, but the vendor now recommends its CLI instead).

Three options from the question are gone or stale:
- **OpenAI's Sora 2 API was shut down on 24 Sep 2026**, so every Sora MCP is dead.
- **ElevenLabs' local MCP repo is archived**, replaced by a hosted MCP that is mostly about managing voice agents.
- **Luma's MCP is stale** (last push April 2025).

### Cited Findings

#### fal.ai: official, hosted, active
- Hosted endpoint `https://mcp.fal.ai/mcp` (Streamable HTTP). Official Claude Code command:
  `claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp --header "Authorization: Bearer YOUR_FAL_KEY"`
  Then run `/mcp` in Claude Code to check that it connected. — [fal docs: Run MCP](https://docs.fal.ai/model-apis/mcp.md)
- It exposes 11 tools:
  - Discovery: `search_models`, `get_model_schema`, `get_pricing`, `search_docs`.
  - Execution: `run_model` ("bounded wait", returns a result or a request ID), `submit_job`, `check_job`, `get_job_result`, `cancel_job`.
  - Utility: `upload_file` (public URL or base64 to fal's CDN) and `recommend_model`.
  
  The docs' image-to-video example uses `submit_job` "since video generation takes longer", then polls with `check_job`. — [fal docs: Run MCP](https://docs.fal.ai/model-apis/mcp.md)
- The docs' pricing example is "How much does it cost to generate a video with Kling 3.0?", answered with `get_pricing` on `fal-ai/kling-video/v3/pro/image-to-video`. The catalog is described as "1,000+ models". — [fal docs: Run MCP](https://docs.fal.ai/model-apis/mcp.md)
- On OAuth accounts, "If access to the selected account fails, operations stop instead of using your personal credits." API-key connections bill the account that owns the key. The server logs usage metadata (tool names, model IDs, duration) but says prompts, media and payloads are not sent to its analytics. — [fal docs: Run MCP](https://docs.fal.ai/model-apis/mcp.md)
- A separate "Platform MCP" handles account operations and serverless debugging. — [fal docs: Run MCP](https://docs.fal.ai/model-apis/mcp.md)
- There is also a skills repo, `fal-ai-community/skills` (247 stars, last push 2026-05-13, about 4.5 months ago). It routes execution through the `genmedia` CLI and has skills for model catalog, prompting (Kling, GPT Image 2) and recipes (lipsync, product shot, video with audio). — [fal-ai-community/skills README](https://github.com/fal-ai-community/skills); [GitHub API](https://api.github.com/repos/fal-ai-community/skills)

#### Google Cloud genmedia MCP servers: official Google Cloud Platform (GCP) repo, very active, "not an officially supported Google product"
- The repo was renamed from `GoogleCloudPlatform/vertex-ai-creative-studio` to **`GoogleCloudPlatform/genmedia-creative-studio`** (API returns "Moved Permanently"). Last push 2026-09-26, 1,211 stars. The servers live in `experiments/mcp-genmedia/`. — [GitHub API](https://api.github.com/repos/GoogleCloudPlatform/genmedia-creative-studio)
- Latest release: v3.20.1 (21 Sep 2026), with pre-compiled binaries including `genmedia-mcp-servers_darwin_arm64.tar.gz`, so it runs natively on M1. — [GitHub releases API](https://api.github.com/repos/GoogleCloudPlatform/genmedia-creative-studio/releases)
- One-line installer; binaries go to `~/.local/bin`:
  `curl -sL https://raw.githubusercontent.com/GoogleCloudPlatform/genmedia-creative-studio/main/experiments/mcp-genmedia/mcp-genmedia-go/install-online.sh | bash`
  — [mcp-genmedia README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/tree/main/experiments/mcp-genmedia)
- The servers:
  - `mcp-veo-go`
  - `mcp-nanobanana-go`: Gemini 3.1 Flash Image and Gemini 3 Pro Image.
  - `mcp-gemini-go`: image generation plus Gemini TTS.
  - `mcp-chirp3-go`: Chirp 3 HD TTS.
  - `mcp-lyria-go`: music.
  - `mcp-avtool-go`: ffmpeg/ffprobe compositing.
  - `mcp-omni-go`: "Gemini Omni" video with optional audio, via the Vertex Interactions API.
  - `mcp-imagen-go`: deprecated; "Imagen models are deprecated as of June 30, 2026".
  
  — [mcp-genmedia-go README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/tree/main/experiments/mcp-genmedia/mcp-genmedia-go)
- **Veo server (v3.7.0) tools:**
  - `veo_t2v` and `veo_i2v`.
  - `veo_extend_video`: input must be MP4, 1–30 s, 24 fps, 720p/1080p/4k in 16:9 or 9:16; output is a 7 s extension.
  - `veo_first_last_to_video`, `veo_reference_to_video` and `veo_ingredients_to_video`.
  
  `veo_i2v` defaults: model `veo-3.1-fast-generate-001`, duration 5–8 s (default 5), 1–4 videos, aspect ratio default `16:9`. A `seed` parameter is supported. — [mcp-veo-go README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/blob/main/experiments/mcp-genmedia/mcp-genmedia-go/mcp-veo-go/README.md)
- **Veo gotchas:**
  - "Video is saved to GCS and optionally downloaded locally". A bucket, from the `bucket` parameter or `GENMEDIA_BUCKET`, is "effectively required".
  - `veo_i2v` takes the input image **as a GCS URI** (`gs://…`), not a local path.
  - `GOOGLE_CLOUD_PROJECT` is required, or the server exits.
  - Default location is `us-central1`.
  - `GCS_DOWNLOAD_TIMEOUT` defaults to `5m`; raise it for large videos.
  
  — [mcp-veo-go README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/blob/main/experiments/mcp-genmedia/mcp-genmedia-go/mcp-veo-go/README.md); [mcp-genmedia-go README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/tree/main/experiments/mcp-genmedia/mcp-genmedia-go)
- Authentication uses Application Default Credentials (`gcloud auth application-default login`) or `GOOGLE_APPLICATION_CREDENTIALS`. You may also need a `roles/storage.objectUser` binding on the bucket. Each server also supports `--transport http`. — [mcp-genmedia README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/tree/main/experiments/mcp-genmedia)
- Every generating tool takes an `output_filename`, so the agent can predict the output name. GCS outputs also come back as MCP `resource_link` items. — [mcp-genmedia-go README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/tree/main/experiments/mcp-genmedia/mcp-genmedia-go)
- The repo ships Agent Skills: `genmedia-producer`, `genmedia-video-editor` (ffmpeg composition, overlays, GIFs), `genmedia-audio-engineer`, `genmedia-image-artist`, `genmedia-voice-director`, `story-generator` and `build-mcp-genmedia`. The install docs only cover Gemini CLI (`gemini skills install … --path experiments/mcp-genmedia/skills`) and Antigravity (copy into `.agents/skills`). — [genmedia skills README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/tree/main/experiments/mcp-genmedia/skills)
- **[derived]** Adding it to Claude Code:
  `claude mcp add --env GOOGLE_CLOUD_PROJECT=<id> --env GENMEDIA_BUCKET=<bucket> --transport stdio veo -- mcp-veo-go`
  Syntax per [Claude Code MCP docs](https://code.claude.com/docs/en/mcp.md).

#### Replicate: official, hosted plus npm
- A remote hosted server is available at `mcp.replicate.com`. A local npm package, `replicate-mcp`, "is automatically updated whenever we add new features". It covers all of Replicate's HTTP API: search, compare and get models, and run predictions. — [Replicate docs: MCP server](https://replicate.com/docs/reference/mcp)
- Official Claude Code command (code mode; needs Deno):
  `claude mcp add "replicate-code-mode" --scope user --transport stdio -- npx -y replicate-mcp@alpha --tools=code`
  plus `export REPLICATE_API_TOKEN=…`. In code mode, "the model will write and execute TypeScript code using the Replicate SDK". — [Replicate docs: MCP server](https://replicate.com/docs/reference/mcp)
- There is also a skills repo, `replicate/skills` (62 stars, last push 2026-06-04). — [GitHub API](https://api.github.com/repos/replicate/skills)

#### Runway: official, active
- `runwayml/runway-api-mcp-server`: last push 2026-08-17, 23 stars.
- Tools: `runway_listModels`, `runway_generateVideo` (image plus text), `runway_generateImage`, `runway_upscaleVideo`, `runway_editVideo`, `runway_generateAudio` (TTS), `runway_getTask`, `runway_cancelTask`, `runway_getOrg`.
- Recommended defaults: Nano Banana Pro (`gemini_image3_pro`) for images, Seedance (`seedance2`) for video, Aleph (`aleph2`) for editing.
- The server checks each payload locally, against per-model constraints derived from the OpenAPI spec, before calling the API.

— [runway-api-mcp-server README](https://github.com/runwayml/runway-api-mcp-server); [GitHub API](https://api.github.com/repos/runwayml/runway-api-mcp-server)
- Setup is clone, `npm install` and `npm run build`. The sample config sets `"MCP_TOOL_TIMEOUT": "1000000"`. Warning from the README: "Images generated by the Runway API lives only for 24 hours at the generated link." It can also run as a remote HTTP MCP. — [runway-api-mcp-server README](https://github.com/runwayml/runway-api-mcp-server)
- **Runway skills plugin**: `runwayml/skills` (last push 2026-08-28). Its README says it supports "seedance2, gen4.5, veo3, Nano, Banana Pro".
  - Install for Claude Code: `claude plugin marketplace add anthropics/claude-plugins-community` then `claude plugin install runway-api-skills@claude-community`, or `npx skills add runwayml/skills`.
  - Requires a Runway developer account "with prepaid credits ($10 minimum)", `uv`, and `RUNWAYML_API_SECRET`.
  
  — [runwayml/skills README](https://github.com/runwayml/skills)
- The same repo appears in Anthropic's official marketplace as plugin `runway-api` ("Video generation at scale…"). — [claude-plugins-official marketplace.json](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json)

#### ElevenLabs: local MCP archived; hosted MCP plus official skills
- `elevenlabs/elevenlabs-mcp` is **archived** (archived=true, last push 2026-08-20). The README says: "This local MCP server is deprecated in favor of the ElevenLabs hosted MCP server… This repository is no longer actively maintained." — [elevenlabs-mcp README](https://github.com/elevenlabs/elevenlabs-mcp); [GitHub API](https://api.github.com/repos/elevenlabs/elevenlabs-mcp)
- Hosted MCP at `https://api.elevenlabs.io/v1/mcp`, OAuth (no API key in the client), listed in the Claude Desktop connector directory.
  - Its capabilities are mostly about the **Agents platform**: create, update, list, duplicate and delete agents, read transcripts, estimate cost.
  - Voice is limited to "Generate speech audio from text, returned as a short-lived download link".
  - EU, India and Singapore data-residency URLs also exist.
  
  — [ElevenLabs docs: Hosted MCP server](https://elevenlabs.io/docs/agents-platform/operate/hosted-mcp)
- Official skills, `elevenlabs/skills` (459 stars, last push 2026-09-25): install with `npx skills add elevenlabs/skills`.
  - Skills: `text-to-speech`, `speech-to-text` ("with timestamps"), `speech-engine`, `agents`, `sound-effects`, `music`, `voice-changer`, `voice-isolator`, `dubbing`, `setup-api-key`.
  - Needs `ELEVENLABS_API_KEY`.
  - CLI: `npm install -g @elevenlabs/cli` or `brew install elevenlabs/tap/elevenlabs`.
  - Warning from the README: use `@elevenlabs/elevenlabs-js`, not the outdated `elevenlabs` npm v1.x.
  
  — [elevenlabs/skills README](https://github.com/elevenlabs/skills)
- **[derived]** Hosted MCP in Claude Code: `claude mcp add --transport http elevenlabs https://api.elevenlabs.io/v1/mcp`, then complete OAuth via `/mcp`. Per [Claude Code MCP docs](https://code.claude.com/docs/en/mcp.md).

#### MiniMax (Hailuo): official MCP, but the vendor now points to its CLI
- `MiniMax-AI/MiniMax-MCP`: 1,586 stars, last push 2026-08-20.
- Tools include `generate_video`, `query_video_generation` (async), TTS, voice cloning, `voice_design` and image generation. `generate_video` supports MiniMax-Hailuo-02 at 6 s/10 s and 768P/1080P.
- Runs via `uvx`.
- Env vars: `MINIMAX_API_KEY`; `MINIMAX_API_HOST`, which must match the key's region (`https://api.minimax.io` global vs `https://api.minimaxi.com` mainland); `MINIMAX_MCP_BASE_PATH`; and `MINIMAX_API_RESOURCE_MODE` (`url` by default, or `local`).
- The README warns: "Using these tools may incur costs."

— [MiniMax-MCP README](https://github.com/MiniMax-AI/MiniMax-MCP)
- The README now recommends `MiniMax-AI/cli` (mmx-cli), which "works as an AI agent skill for Claude Code" (2,173 stars, last push 2026-09-19). — [MiniMax-MCP README](https://github.com/MiniMax-AI/MiniMax-MCP); [GitHub API](https://api.github.com/repos/MiniMax-AI/cli)

#### Kling: official hosted MCP, skills and CLI (partly verified)
- Search snippets from Kling's own guide page:
  - Custom MCP endpoint `https://kling.ai/mcp`.
  - Skill install `npx skills add klingai-tech/skills`.
  - CLI `npm i -g @klingai/cli-global`.
  - MCP and CLI use the same credit pricing as Kling's platforms, but "off-peak free generation is not available through AI assistants". MCP "currently supports only paid credits from your Personal workspace". Bonus credits cannot be used with MCP or CLI.
  
  — [Kling AI: MCP Setup & Usage Guide](https://kling.ai/app/mcp/guide). The page renders in JavaScript, so I could not fetch the text directly; these details are from the search snippet.
- I confirmed `klingai-tech/skills` exists: last push 2026-09-10, but only 1 star. Its README is just the `npx skills add klingai-tech/skills` line. — [GitHub API](https://api.github.com/repos/klingai-tech/skills)
- Community Kling MCP `199-mcp/mcp-kling`: last push 2025-06-14, **stale**. — [GitHub API](https://api.github.com/repos/199-mcp/mcp-kling)

#### OpenAI Sora: dead
- "On March 24th, 2026, we notified developers using the Videos API and Sora 2 video generation model aliases and snapshots of their deprecation and removal from the API on September 24, 2026."
  - Removed: `Videos API`, `sora-2`, `sora-2-pro` and the dated snapshots.
  - The "Recommended replacement" column is empty (—).
  
  — [OpenAI API: Deprecations](https://developers.openai.com/api/docs/deprecations)
- The Sora web and app experiences were discontinued earlier, on 26 Apr 2026. This comes from secondary sources. — [byteiota](https://byteiota.com/sora-api-shuts-down-sept-24-where-developers-must-migrate/); [OpenAI Help Center](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation), which I could not fetch as text.
- Community Sora MCPs are therefore obsolete, and were stale anyway: `Doriandarko/sora-mcp` (last push 2025-10-08) and `writingmate/sora-2-mcp` (2025-10-13). — [GitHub API](https://api.github.com/repos/Doriandarko/sora-mcp)

#### Luma: stale
- `lumalabs/luma-api-mcp`: last push **2025-04-18** (about 17 months ago), 26 stars.
- Tools: image generation (`photon-1`, `photon-flash-1`) and video generation (`ray-2`, `ray-flash-2`, `ray-1-6`), with `frame0_image`/`frame1_image` keyframes.
- Installed with `sh setup.sh`.

— [luma-api-mcp README](https://github.com/lumalabs/luma-api-mcp); [GitHub API](https://api.github.com/repos/lumalabs/luma-api-mcp)

#### Claude Code MCP mechanics that matter for slow generation jobs
- Syntax:
  - Remote: `claude mcp add --transport http <name> <url>`.
  - Stdio: `claude mcp add --env KEY=value --transport stdio <name> -- <command>`.
  - Scopes: `--scope local|project|user`.
  
  — [Claude Code docs: MCP](https://code.claude.com/docs/en/mcp.md)
- Timeouts:
  - Per-server `"timeout"` in milliseconds (e.g. `600000`) is a hard wall-clock limit per tool call. Otherwise `MCP_TOOL_TIMEOUT` applies, with a default of about 28 hours if unset.
  - HTTP servers also get a per-request timer of at least 60 s until the first response byte.
  - Idle timeout (no response and no progress notification): 5 min for HTTP servers, 30 min for stdio.
  - A main-conversation call that runs past 2 minutes moves to a background task (visible in `/tasks`).
  
  — [Claude Code docs: MCP](https://code.claude.com/docs/en/mcp.md)
- Output limits: a warning above 10,000 tokens and a default cap of 25,000 (`MAX_MCP_OUTPUT_TOKENS`). Over-limit text is saved to a file. "Tools that return image data are still subject to `MAX_MCP_OUTPUT_TOKENS`." — [Claude Code docs: MCP](https://code.claude.com/docs/en/mcp.md)

### Inferences
- **The hosted, async servers fit an 8 GB M1 best**: fal, Replicate remote, Kling, and ElevenLabs hosted. They use no local GPU or RAM, and fal's submit, check and fetch split fits Claude Code's 5-minute HTTP idle timeout. The genmedia Go binaries are also light (native arm64); the cost of that path is GCP setup, not local compute.
- **The user's Veo access in the Gemini app is almost certainly a separate entitlement** from Vertex AI API billing. Moving Veo into Claude Code means a GCP project with billing (genmedia MCP), or paying a reseller: fal and Runway both list Veo/`veo3` among their models. This is an inference; I did not verify pricing.
- Runway's 24-hour link expiry and ElevenLabs' "short-lived download link" mean a hosted-MCP pipeline needs a download step. Have the agent `curl` outputs into the project right away, or use servers that write locally (MiniMax `local` mode, genmedia `output_directory`).
- For voice, the user already calls the ElevenLabs API directly. The hosted MCP adds little; the `elevenlabs/skills` pack (especially `speech-to-text` with timestamps, for captions) is the more relevant add-on.

### Gaps
- I did not fetch the `mcp.replicate.com` page itself, so the Claude Code command for the *remote* Replicate server is unverified.
- I did not verify which Veo, Kling and Seedance model IDs and prices fal and Replicate currently list; use `get_pricing` or `search_models` live.
- The Kling hosted MCP's tool list and authentication method (OAuth vs key) are unverified because the page renders in JavaScript.
- Runway `veo3` support comes from its skills README only; I did not check it against Runway's model list.
- The `google-gemini/gemini-skills` repo (4.2k stars, pushed 23 Sep 2026) may cover Veo through the Gemini API (not Vertex). I did not inspect its contents. — [GitHub API](https://api.github.com/repos/google-gemini/gemini-skills)

---

## 3. Anthropic's skills repo, Claude Code plugin marketplaces, and community skill collections

### Takeaway
`anthropics/skills` has **no video or ffmpeg skill**. Anthropic's official plugin marketplace (314 plugins) has four video/media entries of note: **HyperFrames by HeyGen** (an HTML-to-MP4 framework built for agents, an alternative to Remotion), **Runway**, **Adobe for Creativity** and **Cloudinary**. The strongest community collection is `digitalsamba/claude-code-video-toolkit`.

### Cited Findings
- `anthropics/skills` (178.5k stars, pushed 2026-09-24) contains: `academy-guide`, `algorithmic-art`, `brand-guidelines`, `canvas-design`, `claude-api`, `discernment-nudge`, `doc-coauthoring`, `docx`, `frontend-design`, `internal-comms`, `mcp-builder`, `pdf`, `pptx`, `skill-creator`, `slack-gif-creator`, `theme-factory`, `web-artifacts-builder`, `webapp-testing`, `xlsx`. None of them is for video or ffmpeg. — [GitHub API: anthropics/skills/skills](https://api.github.com/repos/anthropics/skills/contents/skills)
- `anthropics/claude-plugins-official` ("Official, Anthropic-managed directory"; 37k stars; pushed 2026-09-25) has 314 plugins. Media-related entries from filtering `marketplace.json`:
  - `hyperframes` ("HyperFrames by HeyGen. Write HTML, render video. Compositions, GSAP… captions, voiceovers, audio-reactive visuals").
  - `runway-api`.
  - `adobe-for-creativity` (image editing, background removal, vectorization).
  - `cloudinary` (media transforms).
  - `togetherai-skills` (inference including audio, video, images).
  - `save-to-spotify` (TTS narration episodes).
  - `postiz` (social scheduling and media upload).
  - `amd-skills` (local AI on Ryzen; not applicable to a Mac).
  
  No fal, ElevenLabs, Google genmedia or Remotion entries. — [claude-plugins-official marketplace.json](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json)
- Runway's README also shows the **community** marketplace: `claude plugin marketplace add anthropics/claude-plugins-community`. — [runwayml/skills README](https://github.com/runwayml/skills)
- **HyperFrames** (`heygen-com/hyperframes`: 53.2k stars, pushed 2026-09-26): "an open-source framework for turning HTML, CSS, media, and seekable animations into deterministic MP4 videos".
  - Install: `npx skills add heygen-com/hyperframes`. Agents in non-interactive runs should use `npx hyperframes skills update`, which installs only the core set.
  - It ships 21 skills behind a `/hyperframes` router.
  - Warning from the README: `skills add` "resolves the skills.sh registry blob, which can lag `main` by hours."
  
  — [hyperframes README](https://github.com/heygen-com/hyperframes)
- **`digitalsamba/claude-code-video-toolkit`** (2,127 stars, pushed 2026-09-21, MIT, has releases):
  - Skills: `remotion`, `elevenlabs`, `ffmpeg`, `playwright-recording`, `frontend-design`, `qwen-edit`, `ideogram4`, `acestep` (music), `ltx2` (text/image-to-video), `moviepy`, `runpod`.
  - Commands: `/setup`, `/video`, `/scene-review`, `/design`, `/brand`.
  - Uses open-source models (Qwen3-TTS, FLUX.2, ACE-Step, LTX-2) deployed to your own Modal or RunPod account.
  - The author claims costs of about $0.01 per voiceover and about $0.23 per AI clip.
  - Setup: `git clone …`, `uv sync`, then run `claude` inside the toolkit.
  
  — [claude-code-video-toolkit README](https://github.com/digitalsamba/claude-code-video-toolkit)
- `wilwaldon/Claude-Code-Video-Toolkit` (Remotion, Manim, screen recording, YouTube clipping, FFmpeg): 85 stars, last push 2026-02-26 (about 7 months ago; **stale-ish**). — [GitHub API](https://api.github.com/repos/wilwaldon/Claude-Code-Video-Toolkit)

### Inferences
- The digitalsamba toolkit is the closest existing match to the user's stack (Remotion plus ElevenLabs plus ffmpeg). It is better mined for ideas (its `ltx2`, `moviepy` and `ffmpeg` skills, and its `/scene-review` pattern) than adopted wholesale. It expects to own the workspace and pushes generation to cloud GPUs.
- HyperFrames competes with Remotion rather than adding to it. Given the existing R3F work in Remotion, switching has a real cost; it is worth knowing about but not recommended by default.

### Gaps
- I did not verify install counts or the security posture of community skills. Skills run with the agent's full permissions, so review each `SKILL.md` and its scripts before installing.

---

## 4. MCP servers and skills for ffmpeg, video understanding (the agent "seeing" clips) and captions

### Takeaway
Most community ffmpeg MCP servers are small and stale. The maintained ones are Google's `mcp-avtool-go` (part of genmedia) and a cloud transcoding MCP (FFmpeg Micro). For video understanding, **TwelveLabs** has an official hosted MCP ("Jockey") and a Claude Code plugin. For captions, the Remotion `/remotion-captions` skill and ElevenLabs `speech-to-text` (with timestamps) are the official building blocks.

### Cited Findings
- Google `mcp-avtool-go` "instrument[s] ffmpeg and ffprobe": media info, format conversion, GIF creation, combining audio and video, overlaying images, concatenation, volume adjustment, audio layering. Supports local paths and GCS URIs. — [mcp-genmedia-go README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/tree/main/experiments/mcp-genmedia/mcp-genmedia-go)
- Community ffmpeg MCPs:

  | Repo | Last push | Stars | Status |
  |---|---|---|---|
  | `bitscorp-mcp/mcp-ffmpeg` | 2026-02-22 | 61 | stale-ish |
  | `misbahsy/video-audio-mcp` | 2025-05-24 | 87 | **stale** |
  | `javidjamae/ffmpeg-micro-mcp` | 2026-08-19 | 1 | active; wraps the paid FFmpeg Micro cloud REST API, not local ffmpeg |

  — GitHub API: [bitscorp](https://api.github.com/repos/bitscorp-mcp/mcp-ffmpeg), [misbahsy](https://api.github.com/repos/misbahsy/video-audio-mcp), [ffmpeg-micro-mcp](https://github.com/javidjamae/ffmpeg-micro-mcp)
- TwelveLabs MCP ("Jockey"):
  - Hosted at `https://mcp.twelvelabs.io/jockey/mcp`, added as a custom connector with TwelveLabs sign-in.
  - The docs have "Model context protocol" and "Claude Code Plugin" pages.
  - Capabilities: indexing, semantic search, analysis and embeddings of videos.
  
  — [TwelveLabs docs: MCP](https://docs.twelvelabs.io/docs/advanced/model-context-protocol); [TwelveLabs blog](https://www.twelvelabs.io/blog/twelve-labs-mcp-server)
- There is a community MCP that uses the Gemini API to turn videos into text descriptions for Claude Code: `ugarchance/mcp-gemini-video-understanding`. Maintenance status not verified. — [GitHub](https://github.com/ugarchance/mcp-gemini-video-understanding)
- Remotion `/remotion-captions` covers transcribing, importing SRT and displaying captions. The markup skill also has `silence-detection.md`. — [remotion-dev/skills tree](https://github.com/remotion-dev/skills/tree/main/skills)
- ElevenLabs `speech-to-text` skill: "Transcribe audio files to text with timestamps". — [elevenlabs/skills README](https://github.com/elevenlabs/skills)

### Inferences
- Claude Code already runs ffmpeg through Bash and can read image files. Extracting frames with ffmpeg (`-vf fps=1` or scene-change selection) and having the agent read the PNGs is a zero-install, zero-cost way for it to "see" clips. That makes an ffmpeg MCP largely redundant for a local, ffmpeg-fluent user. MCP image results count against `MAX_MCP_OUTPUT_TOKENS` ([Claude Code docs](https://code.claude.com/docs/en/mcp.md)), so frame-heavy MCP tools can hit the 25k-token cap.
- TwelveLabs is useful for searching or indexing long footage. It is overkill for checking a single 8-second generated clip.

### Gaps
- I did not verify TwelveLabs pricing or the exact tool names Jockey exposes.
- I did not verify maintenance of the Gemini video-understanding MCP or of other community "video editor" MCPs.

---

## 5. Security and cost risks of letting an agent call paid generation APIs

### Takeaway
The main controls are:
- Prepaid or credit-based billing: Runway needs a $10 minimum prepaid balance, and Kling MCP uses paid credits only.
- Claude Code's per-tool permission rules and approval prompts.
- Pricing-lookup tools (fal `get_pricing`).
- Scoped OAuth where offered (fal, ElevenLabs, TwelveLabs).

Vendor-side hard spend caps were **not** documented in the sources I checked, so budget limits need to be set in each provider's billing console.

### Cited Findings
- fal exposes `get_pricing` ("Check the cost of running a model before you use it"). With OAuth, if the selected account fails, "operations stop instead of using your personal credits". — [fal docs: Run MCP](https://docs.fal.ai/model-apis/mcp.md)
- MiniMax README: "⚠️ Warning: Using these tools may incur costs." — [MiniMax-MCP README](https://github.com/MiniMax-AI/MiniMax-MCP)
- Kling: MCP "currently supports only paid credits from your Personal workspace", with no off-peak free generation through AI assistants and no bonus credits. — [Kling AI: MCP guide](https://kling.ai/app/mcp/guide) (from the search snippet)
- Runway: prepaid credits with a $10 minimum. The server checks payloads locally, so an invalid request "fail[s] locally… and never hit[s] the network". For public HTTP deployments, `REQUIRE_AUTH=true` and "Do not set [RUNWAYML_API_SECRET] for public deployments." — [runwayml/skills README](https://github.com/runwayml/skills); [runway-api-mcp-server README](https://github.com/runwayml/runway-api-mcp-server)
- ElevenLabs hosted MCP: scoped OAuth consent. Per-tool enable, disable and "ask for confirmation first" settings are available in the MCP client. — [ElevenLabs docs: Hosted MCP](https://elevenlabs.io/docs/agents-platform/operate/hosted-mcp)
- Claude Code specifics:
  - MCP tools have callable names (`mcp__<server>__<tool>`, or `mcp__plugin_<plugin>_<server>__<tool>` when bundled in a plugin), and those names are used in permission rules, a skill's `allowed-tools` and hook matchers.
  - Project-scoped `.mcp.json` servers need interactive approval, and a cloned repo "can't approve its own servers".
  - `--strict-mcp-config` limits the session to the servers passed explicitly.
  
  — [Claude Code docs: MCP](https://code.claude.com/docs/en/mcp.md)
- The Veo server's `ENABLE_OPTIONAL_HEADER_CAPTURE` option "injects the raw ADC Bearer token" into requests for debugging. Leave it off (the default is `false`). — [mcp-veo-go README](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/blob/main/experiments/mcp-genmedia/mcp-genmedia-go/mcp-veo-go/README.md)
- fal's hosted server logs usage metadata (tool names, model IDs, duration, outcome) but not prompts or media. — [fal docs: Run MCP](https://docs.fal.ai/model-apis/mcp.md)

### Inferences
- Recommended guardrails for this user:
  1. Leave `run_model`, `submit_job` and `generate_*` tools on **ask** in Claude Code. Allow only read-only tools automatically (`search_models`, `get_model_schema`, `get_pricing`, `check_job`, `runway_listModels`).
  2. Fund prepaid accounts with small balances rather than attaching uncapped cards.
  3. Use a dedicated, revocable API key per tool, and put keys in `--env` or the header rather than in project files that get committed. This matters because the project's CLAUDE.md already forbids committing secrets.
  4. A `PreToolUse` hook on `mcp__fal-ai__submit_job` and similar could log each paid call.
- **Cost trap: multiplier parameters.** Parameters like `num_videos` (up to 4 in Veo) and batch-oriented skills (Runway's "orchestrate hundreds") can multiply spend within a single agent turn.
- **Cost trap: retries.** An agent retrying a timed-out generation may submit duplicate paid jobs. The async submit/check pattern (fal, MiniMax `query_video_generation`, Runway `getTask`) plus a long per-server `timeout` reduces this.

### Gaps
- I found no official source confirming hard monthly spend caps for fal, Replicate, Runway, Kling or ElevenLabs API accounts, or budget alerts for Vertex AI Veo. Verify in each billing console.
- I did not verify the exact Claude Code settings syntax for per-MCP-tool `ask` and `allow` rules (the permissions docs page was not fetched). The tool-name format above is confirmed.
