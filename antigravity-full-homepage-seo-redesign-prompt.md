# Antigravity Master Prompt: Redesign All SEO-Heavy Home Page Sections (Aesthetic + Animated)

> **How to use:** Open the website's project folder in Antigravity. Attach (1) the desktop and mobile mockups of the "Why Choose" section as the visual reference, and (2) any screenshots of the current home page. Then paste everything under "Prompt".
> Tip: for best results, let Antigravity do the work in phases (audit, plan, build section by section) rather than all at once.

---

## Prompt

You are redesigning the home page of my photography website, **DS Photography & Films** (dishantshelarphotography.in), a premium wedding and portrait photographer in Mumbai.

**The problem:** For SEO, a lot of text was added to the home page. It is all valuable for ranking, but visually it looks like walls of text and kills the premium, portfolio-first feel of the site.

**The goal:** Keep 100% of the SEO text in the page, but present it in an **aesthetic, minimal, animated, luxury-editorial** way, so the visible page is mostly photography, big typography and short lines, and the full text is revealed through interaction, scroll or collapsed layouts.

The attached mockups show the exact visual language to follow (cream background, near-black, soft greys, light serif headings, monospace micro-labels, arch-shaped photos, numbered rows with thin line icons, a dark rounded card, thin hairlines, soft sparkle accents). Extend that same language to every other text-heavy section.

---

### PHASE 0: AUDIT FIRST (do not write code yet)

1. Inspect the project: identify the framework (plain HTML, React, Next.js, Astro, etc.), the styling approach, the animation libraries already in use, the icon library, the fonts and the CSS variables / design tokens.
2. Open the home page and list **every section** from top to bottom (hero, services, "Art and Approach", "Why Choose", FAQ, and any others), with: section name, the heading level used, the amount of text, and whether it is text-heavy.
3. **Extract the existing copy verbatim** for each text-heavy section, directly from the codebase. Do not rewrite, paraphrase or delete the original SEO copy. It must stay exactly as it is in the HTML.
4. Record the current SEO baseline so we can verify nothing is lost:
   - the `<title>`, meta description, canonical, Open Graph tags and all JSON-LD / schema
   - the heading outline (H1, H2, H3...) in order
   - the full visible text of the home page (save as a text snapshot)
   - all internal links and image alt texts
5. Give me a short report and a plan (a table: section, current problem, proposed pattern, animation). Then continue with the build. If a section is already clean and visual, leave it alone.

---

### STRICT RULES (non-negotiable)

1. **Do NOT change the colour theme.** Use only the existing cream / off-white background, near-black (#101010-ish) text and dark cards, soft greys for body text, and hairline light-grey borders. No new colours, no gold, no gradients, no colourful accents.
2. **Do NOT change the fonts.** Keep the existing light serif for headings, clean sans-serif for body, and spaced-out monospace capitals for small labels.
3. **Do NOT change** the navbar, logo, footer design, URLs, routes, page title, meta tags, schema markup or any non-home pages.
4. **Do NOT delete or shorten any SEO text in the HTML.** Only the *visible default presentation* gets shorter.
5. Keep the same thin-line icon style, rounded corners, hairlines and black pill buttons already used on the site.
6. The result must feel like **one cohesive website**: every redesigned section should look like a sibling of the "Why Choose" mockup.
7. Aesthetic is the top priority. Whenever there is a trade-off between more text on screen and a cleaner design, choose the cleaner design (as long as the SEO rules below are respected).

---

### SEO RULES (CRITICAL: Google must still read every word)

- Every word of the original copy stays in the **initial HTML** (server-rendered or statically present). Never inject it with JavaScript after a click or after load.
- Hide text only through **visual collapsing with CSS** (`max-height`, `grid-template-rows: 0fr to 1fr`, `opacity`, `clip-path`), so it is still in the DOM and readable by crawlers and screen readers.
- **Never** use: `display:none` or `visibility:hidden` for primary SEO copy, text with the same colour as the background, off-screen positioning (`text-indent: -9999px`, `left: -9999px`), or tiny font sizes. These can be treated as spam.
- The text revealed on interaction must be **genuinely reachable** by users: on hover (desktop), on tap (mobile), and on keyboard focus.
- Keep **exactly one H1** (the existing one, visible). Keep the heading hierarchy logical (H2 for sections, H3 for items).
- Keep the **FAQ as real question/answer markup** and keep (or add if missing) valid **FAQPage JSON-LD** that matches the visible FAQ content exactly.
- Keep all keywords naturally in headings, alt text, link text and body copy. Keep image alt text descriptive (with "Mumbai" keywords where relevant).
- Do not add heavy scripts or images that slow the page. Core Web Vitals (LCP, CLS, INP) must not get worse.

---

### DESIGN PATTERNS TO APPLY (choose the best fit per section)

Use each pattern where it fits. Do not use the same pattern for every section; give the page rhythm. In every pattern, the visible text is **a short heading plus one short line (max about 10 words)**, and the full SEO copy sits in the DOM, collapsed.

**A. Hero**
- Full-screen cinematic photo (or the existing hero media), the existing H1 visible, and a one-line tagline such as "Candid weddings, pre-wedding stories & portraits."
- Move the long hero paragraph into a collapsed "Read our story" disclosure (a small monospace label with a thin line and a "+" icon), or further down the page. The paragraph stays in the DOM.
- Two buttons only: primary "Reserve Your Date" (black pill), secondary "View Portfolio" (text link with arrow).

**B. Services (the four service blocks)**
- Four tall, image-led cards (arch or rounded-rectangle photos) showing only the title and a number.
- On hover (desktop) or tap (mobile), a soft dark overlay slides up and reveals the 2-line short description plus an "Explore →" link; the full paragraph is expanded inside the card or a panel and stays in the DOM.
- Alternative for mobile: a horizontal swipe carousel with snap points, or tabs (Wedding / Pre-Wedding / Portrait / Events) with a crossfade between panels.

**C. "Art and Approach" (philosophy text)**
- Large editorial serif statement with a **scroll-linked word-by-word reveal** (words go from faint grey to near-black as the user scrolls). The complete paragraph stays in the DOM as normal text.
- Optionally, a tall arch photo beside it that moves with a subtle parallax.

**D. "Why Choose DS Photography & Films?"**
- Implement exactly as in the attached desktop and mobile mockups: arch photo, five numbered rows (01 to 05) with thin line icons and arrows, an expandable full text per row, a dark "Reserve Your Date" card.
- Short lines are already defined in the mockups; the original full paragraphs stay in the DOM.

**E. FAQ**
- Smooth minimalist accordion: question in serif, a thin "+" turning into "-", a hairline between items, only one open at a time, slow height animation. Answers stay in the DOM (collapsed with CSS, not removed).
- Optionally, a numbered 01 to 06 style to match the "Why Choose" rows.

**F. Any other text-heavy block you find**
- Turn long lists of areas / locations / keywords into a **slow keyword marquee** (large outlined or light serif text separated by dots: "Wedding · Pre-Wedding · Portraits · Events · Mumbai · Destination") or a clean tag cloud of thin-border pills. Make sure the full list is also present as real, crawlable text (not only as an image or a CSS pseudo-element).
- Long paragraphs: split into a short visible lead line plus a "Read more" disclosure that expands in place.
- Prefer more whitespace, bigger type and fewer words on screen.

**G. Closing call-to-action**
- A calm dark rounded card or full-width band with a short serif line, the booking line ("Peak dates book 4 to 9 months ahead") and a white pill button "Check Availability →".

Also add **one or two** of these atmosphere touches, used sparingly: soft blurred baby's-breath or floral imagery at section edges, thin curved line accents, small four-point sparkle accents, and a very subtle film-grain overlay on photos.

---

### ANIMATION SYSTEM

**Feel:** slow, soft, luxurious, like a high-end fashion editorial. Duration 0.6 to 1.2s, easing `cubic-bezier(0.22, 1, 0.36, 1)`. Nothing bouncy, fast, spinning or flashy.

Create **one shared, reusable animation system** (CSS variables for durations / easing, a small set of utility classes, and one small IntersectionObserver script), so every section behaves consistently:

- **Reveal on scroll (once):** labels fade in, then headings rise from behind a mask line, then thin underlines draw left to right, then supporting lines fade up. Stagger siblings by about 0.1s.
- **Image reveals:** arch and card photos use a bottom-to-top `clip-path` wipe while the image inside scales from 1.1 to 1. Thin outlines draw themselves.
- **Hover / focus / tap:** soft beige highlight slides in behind rows; arrows move about 6px; icon circles darken slightly; collapsed text expands smoothly; cards lift or tilt only very slightly (max 2 degrees, desktop only).
- **Scroll-linked:** the word-by-word text reveal in "Art and Approach"; a thin vertical timeline line that draws as you scroll in "Why Choose"; very light parallax (small values) on photos.
- **Ambient:** slow Ken Burns zoom on hero and card photos (15 to 20s loop), slow twinkle on sparkle accents, a slow marquee for keywords (pause on hover).
- **Buttons:** magnetic pull toward the cursor on desktop; a gentle press-scale (0.98) and sliding arrow on mobile.

**Rules:**
- Animate only `transform` and `opacity` (plus `clip-path`). Avoid animating layout properties that cause shifts.
- Respect `prefers-reduced-motion`: turn off parallax, tilt, Ken Burns, twinkle, marquee motion and word-by-word effects, and use only simple fades. All text must be visible and readable without JavaScript animation.
- **Progressive enhancement:** if JavaScript fails, all content is still visible and readable, never stuck at opacity 0.
- No heavy libraries. Use plain CSS plus small vanilla JS, or the animation library already in the project.

---

### RESPONSIVE

- **Desktop:** multi-column editorial layouts as in the desktop mockup.
- **Tablet:** simplified two-column or stacked layouts.
- **Mobile (up to about 767px):** single column, side margins of about 24px, arch photos full width, tap-to-expand instead of hover, tap targets at least 48px, no hover-only behaviour anywhere, no horizontal scrolling at any width from 320px to 767px. Test at 360px, 390px and 430px.
- Use `aspect-ratio` and explicit width/height on images to prevent layout shift.

---

### ACCESSIBILITY

- Expandable rows and accordions use real `<button>` elements (or `role="button"`) with `aria-expanded` and `aria-controls`.
- Everything is keyboard accessible with a visible focus ring that fits the design.
- Colour contrast stays at WCAG AA for text on cream and on the dark card.
- Decorative elements (sparkles, curves, flowers) use `aria-hidden="true"` and empty alt.

---

### WORKING METHOD

1. Phase 0 audit and plan (above). Wait for no confirmation; proceed after presenting the plan.
2. Build the shared animation utilities first.
3. Then redesign sections **one at a time**, from top to bottom (hero, services, approach, why choose, FAQ, others, final CTA), checking each in the browser preview before moving on.
4. Commit or checkpoint after each section so I can roll back.
5. Final pass: performance, accessibility, responsive checks.

---

### VERIFICATION (must be done before you say you are finished)

1. **Text diff:** compare the new home page's full text content (from the DOM, including collapsed content) against the baseline snapshot from Phase 0. Report that nothing was removed or altered.
2. **Heading outline:** confirm it matches the baseline (one H1, logical H2/H3 order).
3. **Schema and meta:** confirm title, meta description, canonical, Open Graph and JSON-LD are unchanged, and the FAQ schema matches the visible FAQ.
4. **No-JS check:** confirm the page content is still present and readable with JavaScript disabled.
5. **Crawlability check:** confirm that collapsed text is in the HTML source (view-source) and not hidden with `display:none`.
6. **Performance:** run Lighthouse (mobile) and report LCP, CLS and INP before and after. They must not get worse.
7. **Screenshots:** show me desktop and mobile screenshots of each redesigned section.
8. List every file changed, and confirm no other pages or sections were touched.

---

## Notes for me (not part of the prompt)

- If the site is built on Wix, Squarespace, Framer or WordPress with a page builder, Antigravity can't edit it directly. Ask for a version of this prompt adapted to that platform.
- After Antigravity finishes, check the page in Google Search Console with "URL Inspection, Test live URL, View tested page" to see the HTML Google receives and confirm the collapsed text is there.
- Give feedback in small steps ("make the reveal slower", "reduce the tilt") instead of asking for a full redo.
