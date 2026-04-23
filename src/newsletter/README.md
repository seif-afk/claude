# Netswick Weekly — Newsletter System

Dark-mode, brand-aligned newsletter template + publishing workflow for beehiiv.

## How it works

1. **You write content** in a small TypeScript file per issue (`content/YYYY-MM-DD.ts`) using a simple section-based schema — no HTML required.
2. **The template renders it** into a single inline-styled HTML string (beehiiv strips `<style>` and `<link>` tags, so every style is declared inline).
3. **You preview locally** by opening the generated `.preview.html` in a browser. The preview wrapper loads DynaPuff + Inter from Google Fonts so you see the design exactly as intended.
4. **You publish** to beehiiv as a draft or scheduled/immediate send via the API. Default is draft — always review before sending.

## One-time setup

1. Install deps: `npm install` (from repo root).
2. Copy `.env.example` → `.env` and fill in:
   - `BEEHIIV_API_KEY` — your beehiiv API key
   - `BEEHIIV_PUBLICATION_ID` — run `npm run newsletter:pubs` to find it
   - `NEWSLETTER_LOGO_URL` — upload your logo PNG (background removed) once to beehiiv's asset library or any CDN, paste the URL here. If left blank, the template falls back to an inline-SVG "n" diamond mark.
   - `NEWSLETTER_AVATAR_URL` — same for your profile picture (used in the "Written by" block).
   - Socials default to sensible values; override if needed.

## Weekly workflow

> **Heads-up on your plan:** beehiiv's Create Post API is **Enterprise-only**. Your current plan returns `403 SEND_API_NOT_ENTERPRISE_PLAN` on publish. Until you upgrade, use the **copy-paste path** below. Once you upgrade, the `npm run newsletter:publish` commands will start working without any code changes.

### Copy-paste path (works on any beehiiv plan)

```bash
# 1. Copy last week's file as the starting point
cp src/newsletter/content/2026-04-23.ts src/newsletter/content/2026-04-30.ts

# 2. Edit the new file (bump issueNumber, dateISO, subject, sections…)

# 3. Render it
npm run newsletter:preview -- src/newsletter/content/2026-04-30.ts

# 4. Open the preview in a browser to check it
xdg-open newsletter-dist/2026-04-30.preview.html   # linux
open newsletter-dist/2026-04-30.preview.html       # mac

# 5. Open newsletter-dist/2026-04-30.body.html in a text editor,
#    copy the full contents, and paste into beehiiv:
#    New Post → "+ Add block" → "Custom HTML" → paste → Save.
#    Set Subject Line and Preview Text in beehiiv manually (they're
#    printed by the preview command so you can copy them over).
```

### API path (Enterprise plan only)

```bash
# Draft (safe default — nothing sends)
npm run newsletter:publish -- src/newsletter/content/2026-04-30.ts

# Publish immediately
npm run newsletter:publish -- src/newsletter/content/2026-04-30.ts --publish

# Schedule for a specific time (UTC ISO-8601)
npm run newsletter:publish -- src/newsletter/content/2026-04-30.ts --publish --scheduled=2026-04-30T14:00:00Z
```

## Content schema

Every issue is one object. Subset of supported section types:

| Type | Purpose |
|---|---|
| `intro` | First paragraph, slightly larger text |
| `heading` | Section heading (DynaPuff) |
| `paragraph` | Body text (supports `**bold**`, `*italic*`, `` `code` ``, `[text](url)`) |
| `list` | Bulleted or ordered |
| `quote` | Pull quote with optional attribution |
| `callout` | Tinted box with title + body (`info` / `success` / `warn`) |
| `cta` | Full-width gradient button |
| `image` | Remote image with optional caption |
| `illustration` | Inline-SVG illustration from the library |
| `metrics` | 3-up number tiles |
| `divider` | Gradient horizontal rule |
| `html` | Raw HTML passthrough (inline styles only) |

## Illustrations

Built-in SVGs (used as `{ type: "illustration", name: "..." }`):

`rocket` · `graph` · `network` · `spark` · `bolt` · `target`

Add more in `illustrations.ts`. Keep them inline-SVG with only inline attributes (no `<style>` blocks).

## Beehiiv caveats

- **Create Post is Enterprise-only + beta** per beehiiv's docs. If `publish` returns 403, use the generated `*.body.html` file and paste it into beehiiv's web editor as an HTML block.
- `<style>` and `<link>` tags are stripped on ingest. The renderer never emits either inside `body_content` — all styles are inline.
- Custom fonts (DynaPuff) will fall back to the cursive stack in recipients' mail clients. This is a fundamental email limitation, not a bug. The fallback (Baloo 2 → Chalkboard SE → Comic Sans MS → system cursive) was chosen to stay visually close.

## Files

```
src/newsletter/
  brand.ts            # colors, fonts, gradients
  types.ts            # content schema types
  template.ts         # the renderer
  illustrations.ts    # inline-SVG library + brand mark
  beehiiv.ts          # API client
  config.ts           # env loading
  content/
    2026-04-23.ts     # issue #1 (sample)
  cli/
    preview.ts        # render → newsletter-dist/*.html
    list-publications.ts
    publish.ts        # post to beehiiv
```
