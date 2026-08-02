# Visual Re-skin — baanpermsook.com

Date: 2026-08-02
Baseline tag: `v0.3.0`
Branch: `reskin/visual-system`

## Problem

A design audit on 2026-08-02 graded the site **C+ overall, D on AI-slop**. The
technical foundation is strong (115ms load, zero console errors, complete JSON-LD,
bilingual, `prefers-reduced-motion` honored). The weakness is entirely in the visual
layer and in which assets the design chose to show.

Three root causes:

1. **No design token layer.** 270 custom `.bps-*` rules reference raw values. The
   `:root` block at line 21 of `styles.css` is Bootstrap's, not ours. Result: 26
   unique non-gray colors (six near-identical creams), ten border-radius values, and
   `h2` rendering at five different size/weight combinations.
2. **The best photograph is buried and the worst is the hero.** `bps-g-garden.jpg`
   (banyan tree, koi pond, ferns) sits in the gallery while the hero uses
   `header_background.webp`, a walkway between orange buildings.
3. **Template-shaped layout.** Icon-in-orange-circle over a bold centered title over
   a two-line centered description, repeated three times, appears in three places on
   the homepage and on all six ad landing pages.

## Constraint that shapes everything

**No new photography is available.** The design must work with the existing library.

The library splits cleanly:

| Strength | Files | Treatment |
|---|---|---|
| Strong | `bps-g-garden.jpg`, `overview.jpg`, `bps-g-deck.jpg` | Full-bleed, large |
| Weak | room shots (yellow cast, cluttered), `bps-g-lounge.jpg` (night, muddy), `bps-g-breakfast.jpg` (phone shot on floral vinyl) | Small, tightly cropped, colour-corrected |

## Design concept

**The garden sells with pictures. The rooms sell with facts.**

Lead with the garden, which photographs beautifully and matches the brand promise of a
garden-style resort. Shrink the room photography and let numbers carry those cards:
฿1,090, breakfast included, 7-10 minutes to IMPACT, 24-hour late check-in. This works
*with* the constraint rather than fighting it.

## Non-goals

- No URL changes, no new or removed pages, no redirects.
- No changes to JSON-LD, meta tags, canonical, `hreflang`, `sitemap.xml`, `llms.txt`,
  or `robots.txt`.
- No copy rewrites beyond the two factual corrections listed below.
- No new dependencies, no build step, no framework.
- **No invented numbers.** Promotion discount figures are not known; slots are marked
  for the owner and left factual in the meantime.

## SEO and AI impact: honestly, near zero

A re-skin does not move ranking. Google ranks on content, links, and Core Web Vitals
(already 115ms). AI crawlers read text and structured data, which is already complete.
The only plausible SEO effect is second-order: lower bounce rate is a weak positive
signal. Content depth for AI answers is separate work, tracked as a follow-up.

---

## 1. Design tokens

Add a `:root` block at the head of the custom section of `src/css/styles.css`
(around line 989, before `.bps-highlight-box`). Existing rules are migrated to
reference the tokens.

### Colour: 26 → 10

```css
--bps-orange:        #fc7e0f;  /* brand, unchanged */
--bps-orange-ink:    #d96c0d;  /* hover, per CLAUDE.md */
--bps-ink:           #21252a;  /* headings, dark surfaces */
--bps-ink-soft:      #5c6470;  /* secondary text */
--bps-line:          #e8e0d6;  /* borders, dividers */
--bps-surface:       #ffffff;
--bps-surface-warm:  #fff7ef;  /* replaces 6 near-identical creams */
--bps-surface-deep:  #ffeacc;  /* highlight blocks */
--bps-green:         #16a34a;  /* LINE / success, replaces 4 greens */
--bps-scrim:         20 16 12; /* RGB triplet for hero gradient alphas */
```

Google blue and Facebook blue stay as one-off literals on the review buttons only.
They are brand-locked colours belonging to those platforms, not part of our system.

### Type: five steps, ratio 1.25

Prompt for display, Sarabun for body — the two families already loaded.

```css
--bps-t-display: clamp(2rem, 5vw, 3.25rem);   /* h1 only */
--bps-t-h2:      clamp(1.5rem, 3vw, 2rem);    /* every h2, one value */
--bps-t-h3:      1.25rem;
--bps-t-body:    1rem;
--bps-t-small:   0.875rem;
```

The five current `h2` treatments collapse to one. Sections that genuinely need more
weight get `.bps-h2-lead`, applied deliberately rather than by accident.

### Radius: ten values → three

```css
--bps-r-sm:   6px;
--bps-r-md:  12px;
--bps-r-pill: 999px;
```

### Spacing: 8px base

`--bps-s-1: 8px` through `--bps-s-6: 96px` (8/16/24/40/64/96).

### Hard constraint

`styles.css` was processed with PurgeCSS (284KB → 72KB). **Every new style must live
in the `.bps-*` custom section.** Adding a Bootstrap utility class to markup will
silently do nothing because it was purged. JS-toggled classes remain safelisted.

## 2. Hero

Applies to `index.html`, `en/index.html`, and the six ad landing pages.

- **Image:** `bps-g-garden.jpg`, cropped to drop the left ~14% (removes a "TOILET"
  sign) and a little off the top (removes a blue tarp). Exported to
  `assets/images/derived/hero-garden-{1600,800}.webp`. Originals untouched.
- **Scrim:** replace the floating translucent rounded panel with a full-bleed
  gradient — transparent at top, ~78% at the bottom. This removes the stray-grey-box
  artefact *and* fixes the white-on-photo contrast failure in one change.
- **Alignment:** content moves bottom-left. Centring everything is the most
  recognisable template signal on the page; left alignment reads editorial.
- **Price, added:** `เริ่ม ฿1,090/คืน · รวมอาหารเช้า`. Hidden pricing is the single
  largest goodwill drain in the audit.
- **Badge correction:** `รีวิว 5 ดาวจากผู้เข้าพัก` → `รีวิว 4.2 ★ (128 รีวิว)`.
  The claim currently contradicts the site's own review section, JSON-LD, and
  `concert.html`.
- **Thai line-breaking:** `word-break: keep-all; overflow-wrap: normal` on `h1` so
  อิมแพ็ค stops splitting across lines at 390px.
- `text-shadow` on the subhead.

`overview.jpg` becomes the image band for the Location section.

## 3. Room cards

- Photo cropped tight to the bed, excluding sofa, table, and cabling.
- Colour correction via CSS: `filter: saturate(.88) hue-rotate(-6deg) brightness(1.04)`
  to tame the yellow-orange cast. Reversible, costs nothing, no re-encode.
- Price moves off the image and becomes the largest element on the card.
- Amenity chips capped at four plus a `+N` overflow chip. Uncapped wrapping is what
  currently pushes the three CTAs to different heights.
- `margin-top: auto` on the button so all three align regardless of body length.
- All three CTAs orange. Today the cheapest room — the entry point — has the weakest
  button.

## 4. Remove the template grids

Homepage promotions, homepage audiences, and all six landing pages.

- Drop the orange circle. Keep the icon inline at text size beside the heading.
- Left-align card text.
- **Promotion cards lead with a fact, set in display type.** Only facts already
  published on the site are used: `7-10 นาที`, `2 คืน+`, `จ.–พฤ.`. Real discount
  figures are unknown, so each card carries an HTML comment marking where the owner
  inserts one, matching the existing owner-placeholder convention in this repo.
  **No figure is invented.**

## 5. Rollout

One commit per step so any single change can be reverted alone.

1. Tokens + image derivation
2. `index.html`
3. `en/index.html`
4. Six ad landing pages
5. `events.html`
6. Articles + article index
7. Consistency pass and cleanup

## Verification

- Re-run the design audit; compare before/after screenshots at 1440×900 and 390×844.
- Assert no horizontal scroll at 320/390/768/1024/1440.
- Diff the `<head>` of every page to prove JSON-LD, canonical, `hreflang`, OG, and
  Twitter tags are byte-identical.
- Confirm `sitemap.xml` URL set is unchanged.
- Confirm no console errors and that load time has not regressed from ~115ms.
- Verify the booking form still submits and redirects to `/thanks.html`.

## Risks

| Risk | Mitigation |
|---|---|
| PurgeCSS silently drops a new class | All new styles in the `.bps-*` section; verify rendered output, not source |
| Token migration changes a colour unintentionally | One commit per step; before/after screenshots each step |
| Hero image is only 1280px wide, softer at 1440 | Detailed foliage under a dark scrim hides softness; acceptable |
| A landing page diverges from the homepage | Final consistency pass compares all eight hero implementations |
| Deploying an unreviewed redesign to production | Work stays on a branch; PR gives an Azure preview URL; `main` untouched |

## Deviations from this plan, found during implementation

1. **No hue rotation on room photos.** The plan called for
   `saturate(.88) hue-rotate(-6deg)`. On inspection the yellow is the actual
   wall colour, not a white-balance error, so a hue shift would have
   misrepresented the rooms. Shipped with `saturate(.94)` only.

2. **`word-break: keep-all` does not fix Thai.** Per spec it governs breaks
   between CJK characters only; Thai is not CJK, so Chromium kept applying its
   Thai dictionary line-breaker and อิมแพ็ค still split. Replaced with explicit
   `.bps-nobr` nowrap spans around the compounds in every hero heading.

3. **Defining tokens did not collapse anything.** The first pass added the
   `:root` block and assumed the numbers would drop. They did not: element
   selectors like `section h2` lose to the class selectors already in the file,
   and the existing rules still carried hardcoded values. A second pass was
   needed to bind the real class names (`.bps-section-title`,
   `.bps-problem-title`, …) to the tokens and to merge duplicate hex values in
   the stylesheet. Measured before/after is recorded in the PR.

4. **Two extra fixes, both pre-existing.** The Thai brand name overflowed the
   viewport at 320px, and the 22-row event table crushed four columns into
   350px on mobile. Both were in scope-adjacent territory and cheap to fix.

## Owner follow-ups (not code)

- Real promotion discount figures.
- The Google Business listing shows "Tambon Ban Mai"; the correct address is
  ต.บางพูด. Owner-side fix on Google.
