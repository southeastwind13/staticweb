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

- `src/index.html` — the entire landing page (Hero → Problem → About → Audiences →
  Rooms → FAQ/objections → Testimonials → CTA → Contact/Map). Section anchors:
  `#about`, `#room`, `#cotract` (note: "cotract" is the existing contact anchor id).
- `src/404.html` — error page (Azure rewrites 404s here via `staticwebapp.config.json`)
- `src/css/styles.css` — all styles. Custom classes are prefixed `bps-`.
- `src/js/scripts.js` — currently empty; add page JS here.
- `src/sitemap.xml`, `src/robots.txt` — SEO crawl files
- `src/googlede4b9980330bd0c6.html` — Google Search Console file-verification token
- `src/assets/images/` — WebP/JPG/PNG assets (not all are used on the page)
- `src-backup/` — an older version snapshot; ignore for edits.

## Run locally

```
npm start          # serves ./src at http://localhost:8000 via sirv
```

## Deploy

Auto-deploys via **Azure Static Web Apps** GitHub Actions on push to `main`
(`.github/workflows/azure-static-web-apps-*.yml`). App + output location is `./src`,
no build step. Merging/pushing to `main` publishes to production.

## Conventions & notes

- Brand color: orange `#fc7e0f` (hover `#d96c0d`). Font: Sarabun.
- Content is Thai. Match the existing warm, conversational marketing tone.
- SEO matters here (goal: rank on Google + AI search). Keep intact and update when
  content changes: JSON-LD in `index.html` `<head>` (`Hotel` + `FAQPage` + reviews),
  Open Graph / Twitter tags, `sitemap.xml`, canonical URL, one `<h1>` per page.
- Contact/social: phone `094-962-5955`, Facebook `https://www.facebook.com/baan.permsook.2024`,
  LINE `FI5YYjJS-X`. Keep these consistent across the page copy, links, and JSON-LD `sameAs`.
- After editing structured data, validate at https://validator.schema.org/ and
  Google Rich Results Test before deploying.
