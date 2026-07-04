# CLAUDE.md

Guidance for working in this repository.

## What this is

Marketing website for **โรงแรมบ้านเพิ่มสุข (Baan Perm Sook Hotel)** — a garden-style
hotel/resort near Impact Arena, Muang Thong Thani (ปากเกร็ด, นนทบุรี). Single-page
Thai-language landing site. Live at https://www.baanpermsook.com/

Target audiences: concert/event goers, business travelers, and pet owners (Pet Friendly).
Primary booking channel is **LINE** (`https://line.me/ti/p/FI5YYjJS-X`).

## Stack

- Static HTML + **Bootstrap 5** (no framework, no build step)
- Hand-written custom CSS in `src/css/styles.css` (Bootstrap is bundled inline here — the
  file is large; most of it is the framework, only `bps-*` classes are custom)
- Self-hosted **Sarabun** Thai font (`src/font/Sarabun/`)
- Icons: Font Awesome 6 + Bootstrap Icons (both via CDN, loaded in `<head>`)
- Analytics: Google Tag Manager (`GTM-PLKLTZT`) + GA4 (`G-CG82G9GPN5`)

## Structure

- `src/index.html` — the landing page (Hero → Problem → About → Audiences → Rooms →
  Objections → Testimonials → Gallery → FAQ → CTA → Contact/Map). Section anchors:
  `#about`, `#room`, `#gallery`, `#faq`, `#cotract` (note: "cotract" is the existing
  contact anchor id).
- `src/articles/` — blog/content-marketing pages targeting long-tail Thai keywords.
  `index.html` is the article listing; each article is a standalone page with its own
  `BlogPosting` JSON-LD, OG tags, and a LINE CTA. Assets are referenced with `../`
  (e.g. `../css/styles.css`). Add new articles here AND to `sitemap.xml`.
- `src/404.html` — error page (Azure rewrites 404s here via `staticwebapp.config.json`)
- `src/css/styles.css` — all styles. Custom classes are prefixed `bps-`. Later features
  (gallery, FAQ, articles, sticky nav, reveal, lightbox, hero badges) are appended in
  labelled "Phase B" / "Phase C" blocks at the end of the file.
- `src/js/scripts.js` — vanilla JS, linked at the bottom of every page. Handles: mobile
  navbar toggle (Bootstrap JS is NOT loaded), smooth scroll, sticky-navbar shadow +
  active-link highlighting (IntersectionObserver), scroll-reveal fade-ins, and an image
  lightbox for gallery/room photos. In-page anchors are validated with `isValidHash`
  before `querySelector` (the "หน้าหลัก" link uses `href="#!"`, which is not a valid
  selector and throws otherwise).
- `src/sitemap.xml`, `src/robots.txt` — SEO crawl files. Keep sitemap URLs in sync with
  pages that exist.
- `src/googlede4b9980330bd0c6.html` — Google Search Console file-verification token
- `src/assets/images/` — WebP/JPG/PNG assets (not all are used on the page)
- `src-backup/` — an older version snapshot; ignore for edits.

## Run locally

```
npm start          # serves ./src at http://localhost:8000 via sirv
```

Note: sirv caches files and may serve a stale/truncated version after you edit —
restart it (or run `npx sirv-cli ./src --dev`) so changes are picked up.

## Deploy

Auto-deploys via **Azure Static Web Apps** GitHub Actions on push to `main`
(`.github/workflows/azure-static-web-apps-proud-tree-015047703.yml` — the single live
workflow; `app_location`/`output_location` = `./src`, no build step). Merging/pushing to
`main` publishes to production. Site is served at `www.baanpermsook.com` only (the apex
`baanpermsook.com` has no DNS). Google Search Console is verified via the HTML file
`src/googlede4b9980330bd0c6.html`; the GSC property must be the URL-prefix
`https://www.baanpermsook.com`.

## Conventions & notes

- Brand color: orange `#fc7e0f` (hover `#d96c0d`). Font: Sarabun.
- Content is Thai. Match the existing warm, conversational marketing tone.
- SEO matters here (goal: rank on Google + AI search). Keep intact and update when
  content changes: JSON-LD in `index.html` `<head>` (`Hotel` + `FAQPage` + reviews),
  per-article `BlogPosting` JSON-LD, Open Graph / Twitter tags, `sitemap.xml`, canonical
  URL, one `<h1>` per page. The visible FAQ section and the `FAQPage` JSON-LD must stay
  in sync (Google requires markup to match on-page content).
- Contact/social: phone `094-962-5955`, Facebook `https://www.facebook.com/baan.permsook.2024`,
  LINE `FI5YYjJS-X`. Keep these consistent across the page copy, links, and JSON-LD `sameAs`.
- After editing structured data, validate at https://validator.schema.org/ and
  Google Rich Results Test before deploying.
