# Happy Birthday, Elizabeth

A one-page birthday site for **Elizabeth (Maame Esi)** — hero, heartfelt letter,
memory catalog with a lightbox, wish-cake with confetti, and a curtain intro.

## Deploy to GitHub Pages

1. Push everything in this folder to the root of the repo:
   ```
   git init
   git add .
   git commit -m "Happy birthday Maame Esi"
   git branch -M main
   git remote add origin https://github.com/Justice-Mensah/Maame-Esi-birthday.git
   git push -u origin main
   ```
2. In the repo on GitHub → **Settings → Pages** → Source: `Deploy from branch`,
   Branch: `main` / `/ (root)` → Save.
3. Wait ~1 min. Site will be live at:
   **https://justice-mensah.github.io/Maame-Esi-birthday/**

## WhatsApp preview (the big one)

WhatsApp caches link previews aggressively. If the preview doesn't show the
image immediately, two things to do:

- The site already includes an OG image (`og-image.jpg`, 238KB, under
  WhatsApp's 300KB thumbnail cap) with absolute URLs — this is the key
  requirement.
- To force a re-scrape if WhatsApp cached an old version, append a query
  string when sharing:
  `https://justice-mensah.github.io/Maame-Esi-birthday/?v=2`

Test your preview before sending:
- https://www.opengraph.xyz/url/https%3A%2F%2Fjustice-mensah.github.io%2FMaame-Esi-birthday%2F
- https://developers.facebook.com/tools/debug/ (use the Sharing Debugger to
  force Facebook/WhatsApp to refresh the cache)

## Customize

- **Her real birthdate** (for the "trips around the sun" counter):
  [`script.js`](script.js) → `const BIRTHDAY = new Date('2000-04-18')`
- **The letter**: [`index.html`](index.html) → `.letter__body`
- **Captions on each photo**: [`index.html`](index.html) → `.frame__cap`
- **Palette**: [`styles.css`](styles.css) → `:root` custom properties

## Files

- `index.html` — structure + OG meta
- `styles.css` — all styling
- `script.js` — reveals, lightbox, confetti, petals, candle, count-up
- `og-image.jpg` — WhatsApp preview (optimized from images/4.jpeg)
- `images/` — the memory catalog
