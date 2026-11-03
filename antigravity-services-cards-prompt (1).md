# Antigravity Prompt: Update the Services Page Cards (Pre-Wedding, Birthday, Baby Shower)

> **How to use:** Open the website's project folder in Antigravity. Attach the screenshots of the existing Weddings tab (they show the approved card design to copy). If you have a ChatGPT design for the new tabs, attach that too. Then paste everything under "Prompt".

---

## Prompt

I'm attaching screenshots of the **Services page** (`/services`) of my photography website (dishantshelarphotography.in). The page has category tabs and package cards. The **Weddings** tab is already finished and approved, so **do not touch it**. I need you to update the remaining tabs using my client's service list, with the same card design as the Weddings tab.

---

### THE CLIENT'S MESSAGE (source of truth)

```
Pre Wedding
Album
Cinematic Video
Traditional Video
Reel
Raw photos

Birthday
Album
Cinematic Video
Traditional Video
Reel
Raw photos

Baby Shower
Album
Cinematic Video
Traditional Video
Reel
Raw photos
```

**In short:** three services (Pre-Wedding, Birthday, Baby Shower), and every one of them includes the same five deliverables: **Album, Cinematic Video, Traditional Video, Reel, Raw Photos**.

---

### STEP 0: EXPLORE FIRST (do not write code yet)

1. Find how the Services page is built: the framework, the tab bar, the card component, where the card data lives (JSON, CMS config, constants file or hard-coded), and how URLs like `/services?category=wedding&tier=signature` work.
2. List the cards that exist today for the Pre-Wedding and Birthdays tabs (they may be placeholders or not yet updated).
3. Check how the "Select & Book" / "Continue to Booking" button passes the chosen category and tier to the booking form, so the new cards follow the same logic.
4. Tell me your plan in a few lines, then proceed.

---

### STRICT RULES

1. **Do NOT touch the Weddings tab or its cards in any way.** It is done. Use it only as the design reference.
2. **Do NOT change the design.** Reuse the existing card component and styles exactly: cream background, near-black text, soft grey body text, hairline borders, the thick black border on the selected card, serif titles and prices, italic serif sub-line, monospace capital labels, rounded photo with a caption chip at the bottom-left, thin dividers, black pill button for the selected card. No new colours, fonts or gradients.
3. **Do NOT invent content.** The client gave only the five deliverables per service. Do not add prices, album page counts, coverage hours, numbers of photos, film lengths, extra deliverables or extra packages. Price stays "Price on request".
4. Use the client's **exact wording** for the five deliverables: `Album`, `Cinematic Video`, `Traditional Video`, `Reel`, `Raw Photos` (capital P in "Photos"), in this order.
5. **Every card must contain all five** deliverables.
6. Do not change the navbar, footer, other pages, URLs or routes. Keep the existing `?category=` and `?tier=` deep links working.
7. Keep the tab panels' text in the HTML (not injected after a click), so the page stays crawlable. Keep the heading hierarchy and use descriptive image alt text (with Mumbai keywords where relevant).
8. Tabs: keep all existing tabs. Update **Pre-Wedding** and **Birthdays**, and **add a new "Baby Shower" tab** (same style as the other tabs, placed after Birthdays). Leave **Portraits, Events and Commercial** exactly as they are today.

---

### SHARED CARD STRUCTURE

Each card shows these parts, top to bottom (the same as the Wedding cards):

1. Status label in monospace capitals: `SELECTED COLLECTION` (with a black dot)
2. Title in serif capitals
3. Italic serif sub-line
4. Rounded photo with a small caption chip at the bottom-left
5. `COMMISSION INVESTMENT` label, then **Price on request**, then a short grey line
6. Thin divider, then the `INCLUDED DELIVERABLES` label
7. The deliverables list
8. The black pill button: `SELECTED · CONTINUE TO BOOKING →`

Fields marked **(suggested)** are my proposals, because the client did not provide them. Keep them unless I say otherwise, and keep the wording short.

---

## CARD 1: Pre-Wedding

- **Tab / URL:** Pre-Wedding, `?category=pre-wedding` *(use the existing slug from the code)*
- **Status label:** SELECTED COLLECTION
- **Title:** PRE-WEDDING COLLECTION *(suggested)*
- **Italic sub-line:** Candid couple stories *(suggested)*
- **Photo:** a real pre-wedding photograph from the site's own Collections (`/collections/pre-wedding`): a couple in a scenic or golden-hour setting, a strong uncluttered subject, a good crop in the card frame, not used elsewhere on the page.
- **Photo caption chip:** Golden Hour Specimen *(suggested)*
- **Price block:** COMMISSION INVESTMENT, **Price on request**, grey line: "Archival proofing & master curation included" *(reuse the wording from the Wedding cards)*
- **Included deliverables (exactly these five, in this order):**
  1. Album
  2. Cinematic Video
  3. Traditional Video
  4. Reel
  5. Raw Photos
- **Button:** SELECTED · CONTINUE TO BOOKING →

## CARD 2: Birthday

- **Tab / URL:** Birthdays, `?category=birthday` *(use the existing slug from the code)*
- **Status label:** SELECTED COLLECTION
- **Title:** BIRTHDAY COLLECTION *(suggested)*
- **Italic sub-line:** Celebrations, beautifully kept *(suggested)*
- **Photo:** a real birthday photograph from the site's Collections: a warm, candid celebration (cake, candles, laughter, family). If the Collections have no birthday photo, leave a clearly named placeholder and tell me.
- **Photo caption chip:** Milestone Specimen *(suggested)*
- **Price block:** COMMISSION INVESTMENT, **Price on request**, grey line: "Archival proofing & master curation included"
- **Included deliverables (exactly these five, in this order):**
  1. Album
  2. Cinematic Video
  3. Traditional Video
  4. Reel
  5. Raw Photos
- **Button:** SELECTED · CONTINUE TO BOOKING →

## CARD 3: Baby Shower (new tab and new content)

- **Tab / URL:** Baby Shower (new tab after Birthdays), `?category=baby-shower`
- **Status label:** SELECTED COLLECTION
- **Title:** BABY SHOWER COLLECTION *(suggested)*
- **Italic sub-line:** Welcoming little joys *(suggested)*
- **Photo:** a real baby shower or maternity-style photograph from the site's Collections: soft, elegant, florals or gentle details. If none exists, leave a clearly named placeholder and tell me.
- **Photo caption chip:** Gentle Moments Specimen *(suggested)*
- **Price block:** COMMISSION INVESTMENT, **Price on request**, grey line: "Archival proofing & master curation included"
- **Included deliverables (exactly these five, in this order):**
  1. Album
  2. Cinematic Video
  3. Traditional Video
  4. Reel
  5. Raw Photos
- **Button:** SELECTED · CONTINUE TO BOOKING →

---

### BOOKING FLOW

- Each card's button must pass its category and tier to the existing booking brief form, the same way the Wedding cards do today, so the form is pre-filled with the chosen service (for example "Baby Shower").
- Add "Baby Shower" as an option anywhere the booking form lists the event type, if such a list exists.

### PHOTO SELECTION RULES

- Use only photos from the site's own Collections that clearly match the category. Do not use stock images or reuse another category's photo.
- Match the warm, film-toned look of the Wedding card photos, the same aspect ratio and a similar crop.
- Use optimized WebP with explicit width/height, lazy loading, and descriptive alt text (for example "Candid pre-wedding couple shoot in Mumbai by Dishant Shelar").

### RESPONSIVE AND ACCESSIBILITY

- The tab bar must scroll horizontally on mobile without clipping the new "Baby Shower" tab. Cards stack in a single column on mobile, with a button at least 48px tall.
- No horizontal page scroll at any width from 320px to 1920px.
- Tabs are keyboard accessible with a visible focus ring. Keep the existing `aria` attributes and add them to the new tab.
- No text may be cut off in the deliverables list.

---

### FINAL CHECKLIST (report each item as pass or fail)

| Card | Album | Cinematic Video | Traditional Video | Reel | Raw Photos |
|------|:-----:|:---------------:|:-----------------:|:----:|:----------:|
| 1. Pre-Wedding | | | | | |
| 2. Birthday | | | | | |
| 3. Baby Shower | | | | | |

Also confirm:

1. No prices, numbers or deliverables were invented.
2. The design (colours, fonts, spacing, button styles) is unchanged and the new cards are structurally identical to the Wedding cards.
3. The Weddings, Portraits, Events and Commercial tabs were not changed.
4. Deep links (`?category=...`) work for every card, and each button pre-fills the booking form.
5. The panel text is present in the HTML source (view-source), not only after a click.
6. Screenshots of every updated tab on desktop and mobile.
7. The list of files changed.

---

## Decisions for me to confirm (not part of the prompt)

- **One card per tab:** the client gave one set of deliverables per service, so each tab has a single card with no tiers. If the client has different packages, send the details so I can add them.
- **Suggested text:** titles, sub-lines and caption chips are my suggestions. Replace them with the client's own wording if they have it.
- **Portraits, Events, Commercial:** these tabs were not in the client's message, so they are left alone. Tell me if they should be hidden or updated.
