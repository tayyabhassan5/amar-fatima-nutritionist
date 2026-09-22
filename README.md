# Amar Fatima — Dietitian & Nutritionist (Sahiwal)

**Live:** https://tayyabhassan5.github.io/amar-fatima-nutritionist/
**Repo:** https://github.com/tayyabhassan5/amar-fatima-nutritionist

A modern, fast, single-page website for Amar Fatima, consulting dietitian at Royal Hospital
Sahiwal. Plain HTML, CSS and JavaScript — no build step, no frameworks, no dependencies.
Open `index.html` in a browser and it works.

---

## What's in the box

```
amar-fatima-nutritionist/
├── index.html              ← all the content lives here
├── assets/
│   ├── css/styles.css      ← design system, themes, layout
│   ├── js/main.js          ← nav, BMI tool, form, open/closed status
│   └── img/                ← the two clinic pamphlets
├── robots.txt
├── sitemap.xml
└── README.md
```

**Sections:** hero · about · 8 services · weight-management programme · BMI calculator ·
how it works · clinic timings · appointment form · FAQs · contact + map · footer.

**Built in:**

- Fully responsive, mobile-first — tested down to 320px wide
- Light **and** dark theme (follows the phone's setting, with a manual toggle)
- Appointment form that opens WhatsApp with the patient's details pre-written
- Live "Open now / Closed now" pill and today's row highlighted in the timings table
- BMI calculator with metric and imperial units
- Floating WhatsApp button, back-to-top, scroll animations, sticky nav with active-section tracking
- SEO: meta + Open Graph tags, and `MedicalBusiness`/`Nutritionist` structured data so Google can
  show the address, hours and services
- Accessible: skip link, keyboard-navigable, labelled form fields, `prefers-reduced-motion` respected

---

## ⚠️ The site is already live — confirm these

Four things were filled in with sensible defaults because they weren't supplied. Search
`index.html` for `EDIT ME` to find the first two.

| What | Current value | Where to change it |
|---|---|---|
| **Clinic timings** | Mon–Thu 10–4, Fri 10–12:30 & 2:30–4, Sat 10–2, Sun closed | 4 places: the top bar, the `#timings` table, the footer, and the `openingHoursSpecification` block in the JSON-LD at the bottom of `index.html`. Also update `HOURS` in `assets/js/main.js` so the "Open now" pill stays honest. |
| **Social links** | removed — only WhatsApp, call and directions are linked | When the Facebook / Instagram / YouTube profiles exist, add an `<a class="social">` in the `.socials` block of `#contact` and in the footer |
| **Street address** | 89/G Ganj Shakar Colony, Main M.Pur Road, Sahiwal | The colony name was partly covered on the pamphlet. Google Maps labels the locality beside Royal Hospital Sahiwal as **Ganj Shakar Colony**, so that's what the site says — please confirm. 4 places in `index.html`: contact card, FAQ answer, footer, JSON-LD |
| **Email address** | not shown anywhere | Add a `ccard` block in `#contact` if you want one listed |

The two phone numbers are wired up everywhere already:

- **0304-0401367** — the dietitian's line, used for WhatsApp and the appointment form
- **0319-0460826** — the hospital appointments desk

To change the WhatsApp number, edit **one** line at the top of `assets/js/main.js`:

```js
var WHATSAPP_NUMBER = "923040401367";
```

…then update the `wa.me/…` and `tel:…` links in `index.html` (a find-and-replace on the number
catches all of them).

---

## Swapping in a proper photo

Right now the portrait in the hero and the About section is **cropped out of the pamphlet artwork
with CSS** — no photo editor was available, so `background-position` isolates the headshot from
the poster. It looks clean, but a real photo will always look better.

When you have one:

1. Drop it in `assets/img/` as `portrait.jpg` (square, at least 800×800, face centred).
2. In `assets/css/styles.css`, find `.portrait__media--expertise` and replace the three
   properties with:

```css
.portrait__media--expertise{
  background-image:url("../img/portrait.jpg");
  background-size:cover;
  background-position:center;
}
```

3. Do the same for `.portrait__media--weight` (the About photo) if you have a second image.

---

## Updating the live site

It's hosted free on **GitHub Pages**, served from the `main` branch of
[tayyabhassan5/amar-fatima-nutritionist](https://github.com/tayyabhassan5/amar-fatima-nutritionist).
To publish a change, edit the files in this folder and then:

```bash
cd ~/Desktop/amar-fatima-nutritionist
git add -A
git commit -m "Update clinic timings"
git push
```

The live site refreshes about a minute later. If it looks unchanged, hard-refresh
(⌘⇧R) — the browser caches the CSS.

### Using a custom domain later

If she buys a domain (e.g. `amarfatima.com`, roughly $10–15 a year from any registrar):

1. In the repo: **Settings → Pages → Custom domain**, enter the domain, save. Tick
   **Enforce HTTPS** once it appears — the certificate is free and automatic.
2. At the registrar, add these DNS records:
   - `A` records for the root domain → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - a `CNAME` for `www` → `tayyabhassan5.github.io`
3. Then update the URL in four places: `<link rel="canonical">`, `og:url` and `og:image` in
   `index.html`, the `<loc>` in `sitemap.xml`, and the `Sitemap:` line in `robots.txt`.

### Getting found on Google

The single highest-impact step isn't on this site: add this URL to her **Google Business
Profile** (she already has a Google listing). After that, add the site to
[Google Search Console](https://search.google.com/search-console) and submit `sitemap.xml`.

### Other hosts

Nothing ties the site to GitHub — it's plain files. It will run just as well on Netlify
(drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop)), Vercel
(`npx vercel`), or any cPanel host (upload the contents into `public_html`).

---

## If you'd rather the form emailed you

The form deliberately has no backend — it hands off to WhatsApp, which is how most patients in
Pakistan actually book. If you'd also like the details by email, the quickest route is
[Formspree](https://formspree.io) (free tier):

1. Create a form there and copy the endpoint URL.
2. In `index.html`, add `action="https://formspree.io/f/XXXX" method="POST"` to the
   `<form id="appointmentForm">` tag.
3. In `assets/js/main.js`, remove the `e.preventDefault()` line in the submit handler (or send a
   `fetch()` to the endpoint just before opening WhatsApp, so you get both).

---

## Notes

- Fonts load from Google Fonts. If the clinic's internet blocks it, the site falls back to the
  system font stack and still looks fine.
- The map is a keyless Google Maps embed pointed at "Royal Hospital Sahiwal". If the pin lands in
  the wrong place, replace the `src` in the `.map iframe` with the embed code from Google Maps →
  Share → Embed a map.
- No analytics or trackers are included. Paste a Google Analytics or Plausible snippet before
  `</head>` if you want visitor stats.
- Medical disclaimer is in the footer — worth keeping for a health site.
