# Happy Birthday, Eunice

A one-page birthday site for **Asantewaa Eunice** — curtain intro, hero, a
heartfelt letter, three blessings, a wish-cake with confetti, and a warm OG
preview for WhatsApp/Twitter. It also **silently records each visitor's IP and
approximate location to a Google Sheet** you own (no database).

Live URL (once pushed):
**https://justice-mensah.github.io/Maame-Esi-birthday/eunice/**

---

## 1. Turn on visitor logging (Google Sheet — ~5 min)

The page is static (GitHub Pages), so visits are logged to a Google Sheet via a
tiny Apps Script Web App.

1. Create a new sheet: go to <https://sheets.new>, name it e.g. *Eunice Visits*.
2. **Extensions ▸ Apps Script**. Delete the sample, paste **all** of
   [`apps-script.gs`](apps-script.gs), click **Save**.
3. **Deploy ▸ New deployment ▸ (gear) Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy**, then **Authorize access** → allow.
4. Copy the **Web app URL** (ends with `/exec`).
5. Open [`index.html`](index.html) and paste it into:
   ```js
   window.LOG_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
   ```
6. Save. Done — every visit now appends a row (Time, IP, City, Region, Country,
   Latitude, Longitude, a clickable map link, ISP, Device, etc.).

> Until you paste a real URL, logging stays **off** (the page still works fine).

### What's captured
IP address, city / region / country, latitude & longitude (city-level, from the
IP), ISP, device/user-agent, language, screen size, timezone, referrer, and the
page URL. This is **IP-based and automatic** — it shows **no "allow location"
popup**, so the visitor isn't tipped off. (Ask me if you also want the precise
GPS prompt like the KingsLabor page.)

---

## 2. Deploy to GitHub Pages

This folder lives inside the existing **Maame-Esi-birthday** repo, so you just
commit and push:

```bash
cd /Applications/MAMP/htdocs/birthday
git add eunice
git commit -m "Add Eunice birthday page"
git push origin main
```

Pages is already enabled on that repo, so in ~1 minute the site is live at:
**https://justice-mensah.github.io/Maame-Esi-birthday/eunice/**

---

## 3. WhatsApp / link preview

`og-image.jpg` (1200×630, ~41KB — well under WhatsApp's 300KB cap) is already
wired with absolute URLs. If WhatsApp shows a stale/blank preview, force a
re-scrape by adding a query string when sharing:

```
https://justice-mensah.github.io/Maame-Esi-birthday/eunice/?v=2
```

Test the preview:
- <https://www.opengraph.xyz/>
- <https://developers.facebook.com/tools/debug/> (Sharing Debugger → Scrape Again)

---

## Customize

- **The letter** → [`index.html`](index.html) → `.letter__body`
- **Hero + curtain wording** → [`index.html`](index.html) top sections
- **Her photo as the preview** → replace `og-image.jpg` (keep it ≤300KB, ideally
  1200×630 or portrait; update `og:image:width/height` if you change the size)
- **Palette** → [`styles.css`](styles.css) → `:root`

## Files

- `index.html` — structure + OG meta + the `LOG_ENDPOINT` config
- `styles.css` — all styling
- `script.js` — curtain, reveals, confetti, candle, copy-link, **visitor logging**
- `apps-script.gs` — the Google Apps Script you deploy (not served to visitors)
- `og-image.jpg` — the link preview
