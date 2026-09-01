# CLAUDE.md

Guidance for working in this repository.

## What this is

Marketing website for **โรงแรมบ้านเพิ่มสุข (Baan Perm Sook Hotel)** — a garden-style
hotel/resort near Impact Arena, Muang Thong Thani (ปากเกร็ด, นนทบุรี). Bilingual
(Thai + English) marketing site: a main landing page plus a blog, an events page, and
dedicated ad landing pages. Live at https://www.baanpermsook.com/

Target audiences: concert/event goers, business travelers, and pet owners (Pet Friendly).
Primary booking channel is **LINE** (`https://line.me/ti/p/FI5YYjJS-X`).

## Stack

- Static HTML + **Bootstrap 5** (no framework, no build step)
- Hand-written custom CSS in `src/css/styles.css` (Bootstrap is bundled inline here — the
  file is large; most of it is the framework, only `bps-*` classes are custom)
- Self-hosted **Sarabun** Thai font (`src/font/Sarabun/`)
- Icons: Font Awesome 6 + Bootstrap Icons (both via CDN, loaded in `<head>`)
- Analytics: Google Tag Manager (`GTM-PLKLTZT`) + GA4 (`G-CG82G9GPN5`, property
  "Baanpermsook - GA4"). Paid traffic runs from Google Ads account `798-838-0532`
  (campaign `BPS Ads`) — see the Analytics note under Conventions before touching either.

## Structure

- `src/index.html` — the landing page (Hero → Problem → Brand story → Audiences → Rooms
  → Promotions → Objections → Testimonials+review links → Gallery → FAQ → CTA →
  Location/distances → Booking form → Contact/Map). Section anchors: `#about`, `#room`,
  `#promo`, `#gallery`, `#faq`, `#reviews`, `#location`, `#booking`, `#contact` (the
  contact id was renamed from the original "cotract" typo).
- `src/events.html` — "อีเวนต์เมืองทอง" page (Impact events + book-nearby CTA). The event
  table lists REAL upcoming IMPACT events pulled from impact.co.th/en/visitors/event-calendar;
  refresh it periodically (it's a static snapshot).
- `src/en/index.html` — English version of the landing page (assets via `../`). Linked
  to the Thai page via `hreflang` on both; nav has a TH↔EN switch. Keep the two pages in
  sync when content changes.
- `src/pet-friendly.html`, `src/concert.html`, `src/business.html` and their `src/en/`
  counterparts — dedicated **Google Ads landing pages** (one per ad group × 2 languages,
  6 total). Conversion-focused, minimal nav, `noindex,follow`. Each booking form has a
  hidden `ที่มา`/`Source` field (e.g. "Landing Page: Pet Friendly") for lead attribution.
- `src/thanks.html` — booking-form success page (noindex). The inquiry form on every page
  submits via FormSubmit AJAX (see scripts.js) to `baanpermsook@gmail.com` (already
  activated) and redirects here on success.
- `src/articles/` — blog/content-marketing pages targeting long-tail Thai keywords (7 so
  far). `index.html` is the article listing; each article is standalone with its own
  `BlogPosting` JSON-LD, OG tags, GTM/GA, and a LINE CTA. Assets referenced with `../`.
  Add new articles here AND to `sitemap.xml` AND to the article-index grid.
- `src/llms.txt` — markdown summary of the hotel (facts + links) for LLM/AI crawlers.
- `docs/google-analytics-setup.md` — the analytics runbook: the `send_to` bug and its
  proof, every event the site sends, the real GA4 and Google Ads click paths (both
  differ from what the help pages describe), and a log of what was changed in the live
  Ads account. Read it before changing anything analytics-related.
  `docs/google-ads-audit.md` — audit of the live Ads account (1 Sep 2026).
- `docs/google-ads.md` — ready-to-paste Google Ads copy (TH + EN headlines, descriptions,
  sitelinks, callouts) + ad-group→landing-page mapping. NOT deployed (outside `src/`).
- `docs/marketing-plan.md` — the overall marketing plan. `docs/agoda_improve.md` and
  `docs/booking_improve.md` are the per-OTA audits + price ladders that hang off it
  (Agoda property 5728170, Booking hotel_id 6536661). Both price off the same Google
  Sheet of daily target prices, and both shelf-price tables are deliberately identical
  so the guest-facing price matches across OTAs (rate parity). Read the relevant one
  before touching prices, promotions, or availability on either platform.
- `src/404.html` — error page (Azure rewrites 404s here via `staticwebapp.config.json`)
- `src/css/styles.css` — all styles. Custom classes are prefixed `bps-`. Later features
  (gallery, FAQ, articles, sticky nav, reveal, lightbox, hero badges) are appended in
  labelled "Phase B/C/D" blocks at the end of the file. NOTE: the Bootstrap portion was
  PurgeCSS'd down to only classes used in the HTML/JS (284KB → ~72KB). If you add a new
  Bootstrap utility class to any page and it has no effect, it was purged — re-run purge
  or add the rule to the custom section. JS-toggled classes (show, scrolled, open,
  active, bps-visible/reveal, lightbox) are safelisted.
- `src/js/scripts.js` — vanilla JS, linked at the bottom of every page. Handles: mobile
  navbar toggle (Bootstrap JS is NOT loaded), smooth scroll, sticky-navbar shadow +
  active-link highlighting, scroll-reveal, image lightbox, the booking form (FormSubmit
  AJAX → redirect to `/thanks.html`), and GA4 event tracking (see the Analytics note
  under Conventions). In-page anchors are validated with `isValidHash` before
  `querySelector` (the "หน้าหลัก" link uses `href="#!"`).
  NOTE: Azure serves `Referrer-Policy: same-origin`, which nulls Origin on a normal
  cross-origin form POST and makes FormSubmit reject it — hence the AJAX approach (fetch
  always sends Origin). staticwebapp.config.json also sets `strict-origin-when-cross-origin`.
- `src/sitemap.xml`, `src/robots.txt` — SEO crawl files. Keep sitemap URLs in sync with
  pages that exist.
- `src/googlede4b9980330bd0c6.html` — Google Search Console file-verification token
- `src/assets/images/` — WebP/JPG/PNG assets (not all are used on the page).
  `derived/` holds the sized exports actually referenced by the pages. The hero and
  og:image use `hero-exterior-2000.webp` / `hero-exterior-1200.webp` /
  `og-exterior-1200x630.jpg` — the orange cottages.
  **Cut those from `header_background.webp` (4628x2711), not from
  `bps-g-exterior.jpg`.** The two are the same photograph, but `bps-g-exterior.jpg`
  is only a 1280px downscale, so anything derived from it is soft once a hero
  stretches it across a full-width viewport. Check `sips -g pixelWidth` before
  picking a source. The older `hero-garden-*` / `og-garden-*` files are still used
  by `articles/pak-kret-day-trip.html` — do not delete them. Regenerate exports with
  `dwebp` + `sips` + `cwebp` (no ImageMagick/PIL on this machine).
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
- Owner-customizable placeholder content (marked with HTML comments in the source): the
  brand story copy, promotion terms/prices, and location distances.
- **The pet fee is `300 THB per pet, PER NIGHT`** (owner-confirmed 2 Sep 2026), and every
  place that quotes it must say "per night" / "ต่อคืน". It is currently written in 21
  places across `index.html`, `pet-friendly.html`, `articles/hotel-pet-friendly-pakkret.html`,
  `llms.txt` and the `en/` counterparts — meta descriptions and OG tags included. Omitting
  "per night" understates a 2-night stay by half and is what drove Booking.com's
  value-for-money score to 6.3. Do not confuse it with the extra-bed fee, which is also
  300 THB but genuinely per night already.
- **The `FAQPage` JSON-LD is hand-maintained, not generated.** There is no build step in
  this repo (`package.json` has only `start`), so editing a visible `.bps-faq-answer`
  means editing the matching `acceptedAnswer.text` by hand in BOTH `index.html` and
  `en/index.html` (15 Q&A each). Verify by extracting both lists and comparing them
  byte-for-byte — Google requires them to match.
- **Analytics: always fire events through `track()` in `scripts.js`, never `gtag()` directly.**
  Every page loads `gtm.js` before `gtag.js` on the same `dataLayer`, so the GTM container
  owns the default gtag destination — an event sent without `send_to` lands in
  GTM-PLKLTZT, matches no trigger, and never reaches GA4 (verified in-browser: no
  `/g/collect` request at all). `track()` adds `send_to: 'G-CG82G9GPN5'` plus
  `page_path`/`page_lang`, mirrors to `dataLayer` for GTM, and fires the Google Ads
  conversion when the `ADS` block at the top of that section is filled in (empty = off).
  Events: `booking_form_submit` (thank-you page, the key conversion), `line_click`,
  `phone_click`, `map_click`, `social_click`, `ota_click`, `form_start`.
  Setup/verification steps for the GA4 + Ads UI: `docs/google-analytics-setup.md`.
- **Verify analytics changes over the network, never from the console.** A dropped event
  throws no error and logs nothing — that is exactly how the `send_to` bug survived. Load
  the page, filter network requests for `/g/collect`, fire the interaction, and confirm a
  request whose `en=` matches the event name (single events carry `en=` in the URL;
  several at once are batched into the POST body, so read the body too). GA4's own Events
  list is not a check — it only lists events it has already processed, hours later.
- **OTA operating facts** (both accounts were worked on 2 Sep 2026 — read
  `docs/booking_improve.md` / `docs/agoda_improve.md` before touching either):
  - **Availability stops at 15 Dec 2026.** That ceiling is the owner's decision, already
    applied on both platforms. Do not propose reopening 2027 unless the owner raises it.
  - **Agoda enforces a 1,400 THB minimum rate** ("Rate must be between 1,400 and 999,000"),
    so the shared shelf-price ladder's base tier cannot be 1,350 there. Booking has no such
    floor and currently sits at 1,350 — a 3.6% rate-parity gap that is still an open
    decision, not an oversight.
  - **Room allocation is deliberate**: 1 room/night to Booking, 2 to Agoda, out of 4
    registered. Not a bug; do not "fix" it.
  - Booking commission measured from real invoices is **14.9%** (not 15%).
  - Discounts **compound** on both platforms. Before adding any promotion, check what it
    stacks with, or the ladder silently under-sells.
- robots.txt explicitly welcomes AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, etc.).
- Testimonials are REAL Google reviews (Sutasinee W., Waraporn S., Napaporn M.) mirrored
  in the Hotel JSON-LD `review` array; the visible "4.2 / 128 reviews" badge and the
  `bps-platform-google` link (`https://maps.app.goo.gl/EBG2Zk9efFbtqHaT7`) point to the
  real Google Business listing. Do NOT add `aggregateRating` to JSON-LD (self-serving —
  disallowed for rich results) and do not fabricate reviews/`Event` schema.
- Address: owner confirmed "ต.บางพูด" (Bang Phut) is correct — the site is right. The
  Google Business listing shows "Tambon Ban Mai" (owner to fix on Google's side).
- After editing structured data, validate at https://validator.schema.org/ and
  Google Rich Results Test before deploying.
