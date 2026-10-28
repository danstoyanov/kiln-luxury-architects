# KILN — Design system

Visual contract for [SIN-37 / K06](https://linear.app/singularity-lab/issue/SIN-37/k06-designmd-za-kiln), 20 October 2026.

**Status:** system accepted through [K06 PR #7](https://github.com/danstoyanov/kiln-luxury-architects/pull/7), merged on 20 October 2026; applied in K07. The direction is “Material architecture”, retaining the geometric KILN wordmark. The verified adjustment for enlarged text is described in section 9. The changes requested by the user for SIN-47 are described in section 13; it supersedes the old rules for navigation, serif typography and the three affected sections.

Visual board (local archive) · desktop (local archive) · tablet (local archive) · phone (local archive). The board shows the palette, fonts and states, rather than a final layout. Its temporary photograph is not a final image.

## 1. Idea and character

**Ground → material → a lived-in home.** The name KILN provides the material starting point: raw material gains character through conditions and care. On the page, this becomes a light mineral ground, a solid wordmark, clay reserved for actions, and images that show light, surfaces and the human scale of a home.

The character is confident, warm and specific. Luxury comes from proportions, materials and image quality. We do not add gold, glossy interface surfaces, a resort aesthetic or claims about awards and real clients.

We retain the sections, order, English copy, anchor IDs and working interactions from K05. The geometric KILN remains the distinctive wordmark, but shares the first screen with the architecture. There is no new slogan: “Ground. Material. A place to live.” on the board explains the direction and does not replace the site content.

## 2. Colours

Use these global CSS variables. Components use colour roles, without local alternative shades.

| Variable | Value | Usage |
| --- | --- | --- |
| `--color-background` | `#F2F1ED` | Mineral ground; light text in dark areas and buttons. |
| `--color-surface` | `#E3E0D8` | Limestone: Studio and the light sheet in Process. |
| `--color-text` | `#282B28` | Graphite: body text; Process and Footer background. |
| `--color-muted` | `#5C605A` | Secondary information only, on the two light backgrounds. |
| `--color-accent` | `#805542` | Fired clay: primary CTA and submit button. |
| `--color-accent-hover` | `#684333` | Hover state for clay actions. |
| `--color-error` | `#983D32` | Form error text and border. |
| `--color-focus` | `var(--color-text)` | 3px focus outline on light backgrounds. |

In Process and Footer, set `--color-focus: var(--color-background)` locally. All text and links on graphite use `--color-background`; do not use `--color-muted` or accent for text/focus on graphite. The light Process sheet uses graphite text and restores `--color-focus: var(--color-text)`.

The mineral ground is more neutral than the temporary `#F4F1EB`; it has no yellow cream tint. The accent remains the clay specified in the brief. Do not apply the accent to headings, project names, markers, images or entire sections. It covers less than 5% of the visible screen outside the colour swatch document.

| Pair | Calculated contrast |
| --- | --- |
| Graphite / mineral ground | 12.67:1 |
| Graphite / limestone | 10.86:1 |
| Stone grey / mineral ground | 5.67:1 |
| Stone grey / limestone | 4.86:1 |
| Mineral ground / fired clay | 5.64:1 |
| Mineral ground / clay hover | 7.62:1 |
| Error / mineral ground | 6.09:1 |
| Error / limestone | 5.22:1 |

These are sRGB luminance calculations for solid colours, not audit results for the future implementation. There is no text over photography and no reduced text opacity. Global selection: accent background and text in the background colour.

## 3. Fonts and scale

We retain the existing self-hosted files and the licence in [public/fonts](public/fonts/FFL.txt). We do not add a new family or external font requests.

- **Panchang 700:** only KILN in the hero and its repetition in the footer. `--font-heading: "Panchang", Arial, Helvetica, sans-serif` remains the wordmark role.
- **Switzer 400:** all section headings, paragraphs, secondary text and the studio statement. `--font-body: "Switzer", Arial, Helvetica, sans-serif`.
- **Switzer 500:** project titles, services, process headings, identity link, controls and form status.

Files: `panchang-bold.woff2`, `switzer-regular.woff2`, `switzer-medium.woff2`. `font-display: swap`; no synthetic italic/bold. In K07, preload only Panchang 700 and Switzer 400, which are used above the fold; Switzer 500 loads through CSS. Keep the full FFL and the [file provenance](docs/temporary-assets.md#fonts).

At the standard root size of 16px:

| Role / CSS token | Size | Weight / leading / tracking |
| --- | --- | --- |
| Notes `--step-small` | `0.875rem` (14px) | 400 / 1.45 / 0 |
| Body `--step-body` | `1.125rem` (18px); below 900px `1.0625rem` (17px) | 400 / 1.5 / 0 |
| Lead and h3 `--step-lead` | `clamp(1.25rem, 1.8vw, 1.625rem)` (20–26px) | Lead 400, h3 500 / 1.3 / -0.015em |
| h2 `--step-head` | `clamp(2rem, 4vw, 3.5rem)` (32–56px) | 400 / 1.08 / -0.035em |
| KILN hero | ≥900px `clamp(3rem, 18.5vw, 22.2rem)`; below 900px `27.3vw` | 700 / 0.9 / -0.055em |
| KILN footer | `min(28.3vw, 33.96rem)` | 700 / 1 / -0.055em |

The wordmark is a separate display role; it is not used for h2/h3. The hero description, navigation, labels, errors, status and buttons use the body size. Do not enlarge the long Studio statement to heading size.

One `h1`: KILN. The visible description immediately beside/below it says “Residential architecture.” and retains “Shaped by the land. Made for living.”. Each section keeps its existing h2; projects/services/stages use h3. Use normal case outside KILN, without tracked uppercase, decorative italic or a coloured word in a heading.

Body text: maximum 52ch, Studio paragraphs 40ch, hero description 34ch, contact description 34ch; no forced narrow minimum on phones. Headings stay within two lines at standard text size and the agreed widths. With enlarged text, readability and reflow take priority: do not shrink the font, truncate or hide content to meet this limit. Keep authored breaks in Process/Contact. Do not add nowrap to text. KILN stays on one line at standard settings; with increased user spacing, it may wrap as clarified in K13.

## 4. Frame, spacing and responsive contract

Margins and gutters use rem to respect enlarged text. The widths below are CSS px; the table assumes standard text size.

| Rule | 375–599px | 600–899px | ≥900px |
| --- | --- | --- | --- |
| `--page-gutter` on each side | 1rem / 16px | 1.5rem / 24px | 2rem / 32px |
| `--grid-gap` | 1rem / 16px | 1.5rem / 24px | 1.5rem / 24px |
| `--space-section` — top and bottom padding of each section | 2.5rem / 40px | 4rem / 64px | 5rem / 80px |
| Intro → main content | 2rem / 32px | 2.5rem / 40px | 3rem / 48px |
| Between individual projects | 3rem / 48px | 3rem / 48px | row-gap 3rem / 48px |
| Main layout | 1 column | 1 or 2, depending on the section below | 12 columns |

Adjacent sections with the same background have a total of 80/128/160px between their content. Do not add extra section margin on top of these paddings. Header, hero and footer use their own values from section 5.

Internal spacing scale: `0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`, `6rem`. Elements within a group are 8–24px apart; 32–48px separates groups. 96px is only the desktop offset of the second project.

Use equal outer margins in all sections. The inner frame has a maximum width of 1920px and is centred on wider screens; hero photography and colour fields remain full bleed. Do not draw grid lines. All grid children use `min-width: 0`; unexpected long words can wrap. Do not conceal overflow with a global `overflow-x: hidden`.

## 5. Composition by section

This refines the existing structure rather than creating a new page. Keep anchor IDs and DOM order. These decisions are for K07; K06 does not change application source.

### Header and hero

The header stays in normal flow, on mineral ground. Padding `1rem var(--page-gutter)`, gap 16px; visible identity link “Luxury Architects”, the existing five anchor links. Navigation uses body size, gap `clamp(1rem, 2.6vw, 3rem)`. Menu/Close appears below 900px. Controls are at least 44×44px. The header can grow and wrap elements with enlarged text; there is no fixed height or compensating offset on the hero.

The architectural image stays **above the name**, without text over it. On desktop, it occupies up to 56svh instead of the current maximum of 36svh. Initial CSS geometry:

```css
/* At 900px and above. Reserve room for the name, header and supporting text. */
.heroImage {
  height: clamp(12rem, calc(100svh - 16.65vw - 9rem), 56svh);
  object-fit: cover;
  object-position: 50% 55%;
}
.heroBand {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--grid-gap);
  align-items: end;
  padding: 1.5rem var(--page-gutter) 0;
}
.monument { grid-column: 1 / 9; }
.heroIntro {
  grid-column: 9 / 13;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin: 0;
}
```

The formula `16.65vw` is the display size `18.5vw × 0.9`. The wordmark sits on the left; the existing description and CTA are stacked on the right. This change uses the existing `.heroBand`, `.monument`, `.heroIntro`; there is no new headline, additional CTA or hidden copy.

At 600–899px: hero image `height: clamp(15rem, 40svh, 28rem)`, band is block with 24px top padding; intro is a flex row with wrap, gap 24px, margin-top 24px. Below 600px: image `height: clamp(12rem, 34svh, 20rem)`, focal `58% 50%`; band top padding 20px; intro is a flex column with gap 20px and margin-top 24px. Between the intro and temporary credit: 16px; the credit uses the small size on mineral ground. No absolute positioning for the credit.

In K07, the visibility of the description and CTA at standard text size must be confirmed again at 1366×768, 1440×900 and 375×812. The formula is a specific starting geometry, not a claim that the new hero has already been verified. With enlarged text, the hero grows naturally and content may continue below the fold.

### Projects — `#projects`

“Living studies” and the existing introduction: above 899px, a 12-column grid with the shared 24px gap; heading in columns 1–6 (`1 / 7`), introduction in 8–12 (`8 / 13`), aligned at the top; 48px below. The introduction follows the left edge of Ridge House. This is the K10 refinement; Services uses the same intro geometry. Below 900px, the introduction sits below the heading with a 24px gap.

Desktop wall: Courtyard House in columns **1–7** (`1 / 8`), Ridge House in **8–12** (`8 / 13`), with **96px** top padding. Woodland Retreat in **3–12** (`3 / 13`), after the row with a 48px gap, without negative margin. Images are **3:2** for all three projects; Ridge no longer has a narrow portrait crop. All captions sit below the images. The name/Concept row wraps with a 16px gap; the setting follows, then the description in DOM order. From 1200px, only Woodland has a two-column caption below the image: a nested 10-column grid, gap 24px, name/Concept and setting in 1–5, description in 6–10 at 16px below the image. The description starts on the same axis as Ridge and the Projects intro; the setting has no extra bottom margin in this mode. Below 1200px, the caption remains sequential. There is no change to the image frame, crops or `sizes`.

Below 900px, all three projects form one column in the same DOM order, gap 48px, without offsets; a shared 3:2 ratio. This removes the narrow Ridge column at 768px. Projects are articles, without raised cards, outlines, background tiles, hover zoom or fake links to nonexistent case studies.

### Studio — `#studio`

Limestone background. Above 899px, two areas in a 1:2 proportion with a 48px gap: heading on the left, the existing three paragraphs on the right. The statement spans the whole right area at lead size; the two explanatory paragraphs below it form two equal columns with a 32px gap. At 600–899px, the heading sits above the area with a 32px gap; the two paragraphs remain in two columns. Below 600px, everything forms one column, gap 24px. There is no fifth image or decorative texture.

### Services — `#services`

Mineral ground; heading/introduction with the same intro geometry as Projects. Architecture, Interiors and Landscape are open text columns with a 32px gap. Use the existing safe grid `repeat(auto-fit, minmax(min(100%, 14rem), 1fr))`; explicitly one column below 600px. h3 → paragraph: 16px. No icons, separate cards or numbers. The columns may also become two/one on desktop with enlarged text.

### Process — `#process`

One main dark section, graphite background and mineral text. Above 899px, intro/list form two equal columns, gap 64px. The existing list is a single limestone sheet with graphite text, 40px internal padding and a 32px gap between the four stages. The semantic `ol` is retained; no visible decorative numbering, timeline or icons.

Below 900px, intro and sheet form one column with a 32px gap; the sheet has 24px padding. This preserves readability at 768px and with large text. No sticky or pinned section.

### Contact — `#contact`

Mineral ground. Above 899px, two equal columns with a 64px gap: heading/explanations on the left, form on the right. Below 900px, one column with a 48px gap. The form takes the full available width of its column; labels and fields are left aligned. The demo notice precedes the fields and stays visible.

### Footer

Graphite background with mineral text and light focus. Top padding 48px, shared page gutters horizontally. Fictional studio disclosure and Back to top form one row with wrap and a 32px gap; below 600px, they stack with a 24px gap. Temporary attribution/licence notes remain until K09. Below them, KILN returns at a wide display size, with margin-top 32px; only the decorative footer repetition may be cropped at the bottom by up to `0.1em`. It remains `aria-hidden`; links and text are never cropped. Do not add a sitemap, social icons or contact details for a real studio.

## 6. Controls, form and states

- CTA copy is **“Discuss your project”** everywhere. The hero CTA is an anchor to `#contact`, submit is a button. Square corners (`border-radius: 0`), accent fill, text in the background colour, Switzer 500, body size, `min-height: 48px`, padding `0.75rem 1.5rem`, gap 24px. The decorative ↗ in the hero remains `aria-hidden`; do not add an icon to submit.
- Hover: `--color-accent-hover`. Active: hover colour and `translateY(1px)` only with no-preference. No hover lift, shadow or font weight change. Focus: **3px solid `--color-focus`**, offset **5px**, without disabling the outline. On buttons, the light gap separates the outline from the fill.
- Text navigation links: graphite; hover/focus adds an underline with offset `0.25em`, thickness `0.07em`. Inline links in text and temporary credits are always underlined. The same behaviour applies in dark sections with mineral text.
- Menu/Close: square graphite button, mineral text, minimum height and width 44px. The menu expands in normal flow below the header; no transparent/blurred floating surface and no height animation. Keep `aria-expanded`, closing with Escape, after selection and on outside click, and focus return as implemented in the working component.
- Fields: mineral background, graphite text, **1px solid muted** border, `border-radius: 0`, padding 12px, minimum height 48px. Textarea: the existing 4 rows, vertical resize, min-height 128px. Label → field: 8px; between field groups: 24px. Labels/errors use body size; do not use a placeholder as a label.
- Invalid: error border and separate error text below the field with an 8px gap, the existing `aria-invalid` and `aria-describedby`. Focus stays clearly distinct from the error. Do not rely on colour alone.
- Keep the current validation of name, email and message, focus on the first error and clearing after valid input. Status remains `role="status"`, body 500, with at least `3rem` reserved space; the height may grow for the long text.
- Exact status: **“Demo only — your enquiry has not been sent or saved.”** No success toast, green checkmark, email sending, backend, analytics or storage in browser storage, cookies, URL or logs. All visible text, including errors and alt text, remains in English.

### K11 — completed interactions

The anchor targets `main` and the five sections have `tabIndex={-1}`: native navigation moves focus to the content being read, without new stops in the Tab order. The menu remains a disclosure in the flow; Tab/Shift+Tab continue to the page, without a focus trap. When crossing 899/900px, focus moves from the hidden Menu to Projects, and from a hidden desktop link to Menu. An outside click does not leave focus in hidden navigation and preserves focus on a selected external control.

Menu/Close gets an immediate underline on hover/focus. Fields get a graphite border on hover; an invalid border stays in the error colour even on hover. The global 3px focus outline with 5px offset is retained. A field error updates during correction and disappears as soon as the value is valid; validation on submit remains mandatory. Focus moves to the first error after its `aria-describedby` descriptions have rendered. The demo status is an atomic `role="status"`; editing clears it. No new motion or dependencies. Report and screenshots (local archive).

## 7. Architectural images — contract for K08–K09

Exactly **four** final images from the built-in ImageGen: the hero and the three existing concepts. Generation and final prompts belong to K08; replacement and web optimisation belong to K09. Until then, temporary images and their honest credits remain. We do not buy/add a stock series in K06.

Shared character: contemporary low residential volumes, light limestone or mineral render, natural wood, thin dark frames, restrained planting. Soft side daylight, moderate contrast, natural greens; human scale through furniture and passageways, without needing people. Camera at human eye level, the visual character of a 28–35mm lens and straight verticals. No dramatic HDR, sunset orange, infinity pool, oversized car, fantastical structure, text, watermark or third-party logo. Do not imitate a specific living architect or an existing house.

The three concepts are different places, but look as though they were captured with a shared photographic discipline. Do not present them as the same construction project or as real commissions. Keep a temperate-climate atmosphere, without tropical resorts/palms. Do not add invented coordinates, floor areas or completion years.

| Slot | What must be visible | Master and crop |
| --- | --- | --- |
| Hero | A low mineral home, timber threshold/canopy and garden; the connection from ground through a sheltered threshold to a lived-in space. | Landscape 3:2 master; the main home stays within the central 60% of the width and middle 40% of the height for a wide desktop strip. Desktop focal 50% 55%, mobile 58% 50%; mobile frame close to 4:3 according to the height in section 5. |
| Courtyard House | A clearly legible planted courtyard, light walls, shade and at least one connection to a living room. | Landscape 3:2 master and 3:2 web frame; focal 50% 50% at all widths. |
| Ridge House | A horizontal house along the slope, deep eaves and an open horizon; a visible connection to the ground. | Landscape 3:2 master and 3:2 web frame; focal 50% 55%. Do not cut off the eaves or the end of the volume with a portrait crop. |
| Woodland Retreat | A compact timber home among trees, a sheltered entrance and a warm interior with a shared table, visible through an opening. | Landscape 3:2 master and 3:2 web frame; focal 50% 50%. The roof does not have to be A-frame; that is only the current temporary reference. |

Do not stretch an image or add CSS saturation/sepia/gradient overlay. Rectangular images without borders, radius or drop shadow. The hero has no text over it. If a crop destroys a required detail, K08 regenerates/selects a suitable master; K09 does not compensate with an arbitrary portrait crop or stretching.

K08 checks the geometry of openings, supports, eaves, perspectives, connection to the terrain, reflections, repetitive vegetation and implausible furniture. It checks both the wide hero strip and mobile crop before selection. Keep the originals and exact prompts in the project; do not claim they are photographs of built KILN homes.

K09 web contract:

- `<picture>` with WebP source and JPEG fallback; variants at 480, 768 and 1280px wide plus the native master width, if larger. The hero also gets a 1920px variant **only if the master is at least 1920px**. Do not upscale the originals. Names include slot and width; final files live under `public/assets/`.
- Initial compression quality: WebP 80, JPEG 82; reduce only if visible surfaces and details are preserved. Target WebP budgets: hero up to 280KB at 1920px and up to 110KB at 768px; each project up to 180KB at 1280px. These are K09 targets, not measured K06 results.
- Hero uses `fetchPriority="high"`, without lazy loading. The three projects: `loading="lazy"`, `decoding="async"`. Actual `width`/`height` for the fallback file, a fixed frame and the correct ratio prevent layout shift.
- `sizes`: hero `100vw`; projects below 600px `calc(100vw - 32px)`, 600–899px `calc(100vw - 48px)`; desktop Courtyard `calc((min(100vw, 1920px) - 64px - 264px) * 7 / 12 + 144px)`, Ridge `calc((min(100vw, 1920px) - 64px - 264px) * 5 / 12 + 96px)`, Woodland `calc((min(100vw, 1920px) - 64px - 264px) * 10 / 12 + 216px)`. These formulas are for a grid of 12 columns and 11 gaps of 24px.
- Alt text describes what is actually visible, in English, starting with “Concept visualisation:”; it does not describe the intended interior if it cannot be seen. The visible project disclosure continues to state that these are fictional concepts. K09 replaces temporary credits with an honest note about AI-generated concept imagery; it does not hide the demo status.

## 8. Motion

Motion supports the weight of the name and feedback from controls. There is no quota for moving elements. No scroll scenes, parallax, pinned stages, marquee, autoplay video, custom cursor, preloader or animation library.

| Element | Exact behaviour with `no-preference` |
| --- | --- |
| Hero KILN | Once-only `translateY(6px)` → `0`, 480ms, `cubic-bezier(0.16, 1, 0.3, 1)`. Opacity stays at 1; no letter masking. |
| Hero image, only ≥900px | Once-only `scale(1.015)` → `1`, 800ms with the same curve, in its own frame with local clipping. No loop or scroll connection. |
| Buttons | Background hover 180ms ease; press `translateY(1px)` 120ms ease-out. |
| Menu and section links | Immediate state; native smooth scroll is allowed only with no-preference. |
| Everything below the hero | Static, without entrance reveals or a hidden initial state. |

With `prefers-reduced-motion: reduce`: no transforms, animation, transitions or smooth scroll; all content is in its final visible position. The heading, description and CTA are readable at first paint. Do not apply `will-change` permanently. K07 applies the base styles/states; K11 completes and verifies interaction/motion behaviour without choosing another direction.

## 9. Practical review criteria

The system is successfully applied when:

- The architecture and KILN share the first screen; the description and CTA are visible in the standard target scenarios. The header does not overlap content.
- The name is the only display lettering in Panchang; all h2/h3/paragraphs follow the scale and have a clear hierarchy.
- Colours have fixed roles; body text is graphite, accent marks actions. Focus is light in dark areas.
- Projects form an editorial wall on desktop and a readable sequence at 375/768px; no narrow portrait Ridge crop or mechanical row of cards.
- Sections retain distinct compositions: image/name → project wall → studio text → open service columns → dark process sheet → contact split → inverse name.
- After K09, the four images share a character, show their specific concepts, have no visible AI defects and work with the agreed crops.
- The menu, keyboard focus, form, enlarged text and reduced motion retain their verified behaviour. There is no network request or storage of form data.

K07 checks the affected sections in a real browser at 375, 768 and 1440px, the short desktop viewport of 1366×768 and the enlarged-text scenarios from K05; it takes before/after screenshots and runs TypeScript/ESLint/production build. K06 checks completeness, links, colour calculations and the review board. This document does not claim that browser verification of the future site has been completed.

### K07 — verified correction for enlarged text

At 375px and 200% body text, rem gutters become 32px each, but the name's pure vw size does not account for this narrower inner frame. Browser verification found footer overflow (378px document width in a 375px viewport). K07 therefore adds an upper limit based on available width: mobile hero `min(27.3vw, calc((100vw - 2 * var(--page-gutter)) / 3.27))`; footer `min(28.3vw, 33.96rem, calc((min(100vw, 1920px) - 2 * var(--page-gutter)) / 3.27))`. The divisor accounts for the width of the four Panchang letters with the accepted tracking. This affects only the display wordmark, keeps it on one line and does not reduce body text, labels or headings. Overflow is not hidden. At standard 375px, the footer size is about 104.9px instead of 106.1px; desktop values remain unchanged.

## 10. Provenance and boundaries

The initial direction is **The name as a monument**, seed **35**, from the K04 direction (local archive), retained in K05. K06 does not make a new draw or mix in new layout references: it refines this foundation according to the user's choice and [brief.md](brief.md). Pinterest/Awwwards research remains in K10; the final Impeccable audit remains in K12–K13.

The verified project [Taste Skill](docs/taste-skill.md), commit `63aba5f43b5056758b15bbe7d683da8c86a7a7ad`, was used for guidance on type, colour, layout and motion. The local original plan and [AGENTS.md](AGENTS.md) take priority: warm light background/clay, exactly four ImageGen images, CSS Modules, restrained motion and a local demo form. We do not automatically accept the skill's proposed scenes, video, motion quotas or alternative palette. There is no new functionality for its “live thing”; the existing menu and form provide the interactions.

After merge, this file is the source of precise visual decisions for the following stages. If real verification reveals a conflict, the fix includes a specific change to this contract in the relevant PR, rather than a silent deviation. K06 does not apply the identity, generate final images or publish a site.

### K09 — correction after user review

At an explicit request in the SIN-40 review, we remove the individual AI notes below the hero and the three project images. The general fictional/AI imagery disclosure remains in the Projects intro and footer. At the standard 16px root: image → project title/Concept is 16px (`1rem`), title → setting is 6px (`0.375rem`), setting → description is 12px (`0.75rem`). Spacing remains in rem for enlarged text. This supersedes the previous rules for per-image credits/captions and larger spacing in project text; the wall composition and image dimensions are retained.

## 11. K10 — composition refinement

The SIN-41 report and comparison (local archive) document the two changes in section 5: a shared desktop axis for the Projects/Services intro and a two-column Woodland caption from 1200px. They use the accepted 12-column grid, without changing the palette, fonts, copy, section order, image frames, CTA or motion. The mobile/tablet layout and desktop caption below 1200px remain sequential. References are evaluated as principles; third-party images, code or interactions are not copied.


## 12. K13 — accessible focus and reflow

The SIN-44 report (local archive) closes the two accepted K12 findings. The home link retains the visible “Luxury Architects” and href="#main", while its accessible name is “Luxury Architects — KILN home”. After errors render, the form focuses the first invalid field with preventScroll and positions the entire field wrapper with scrollIntoView({ behavior: "instant", block: "nearest" }); the wrapper has 1rem scroll margin at the top and bottom. Label, field and error stay together when they fit in the viewport. There is no new animation.

With both 200% root text and increased letter-spacing: .12em, KILN's forced nowrap causes a 409px document width in a 375px viewport. The hero and footer wordmarks now allow normal wrapping through the existing overflow-wrap: anywhere. Standard sizes, tracking, fonts and the single-line appearance are retained. This is an exception for user-expanded text: it does not shrink the font or hide letters. The normal final screenshots and technical stress-test screenshots are clearly separated in the report.

## 13. SIN-47 — user design review before deployment

**Eighth review — navigation after closing:** below 900px, selecting an ordinary menu link first closes the drawer, waits for the actual CSS closing transitions through animation.finished, then sets the fragment URL, focuses the target section without automatic scrolling and scrolls to its start with the agreed scroll margin. There is no fixed timeout that could fall out of sync with the animation. Reduced motion runs immediately; desktop and modified clicks retain native anchor behaviour. This prevents the downward offset caused by simultaneous menu collapse and native smooth scroll.

**Seventh review — bold and Services:** all Manrope h2/h3 and “Luxury Architects” (desktop and drawer) use weight 700. The local variable file supports this weight; @font-face declares 500–700, without synthetic bold. In Services, each icon and its heading share a grid block with align-items:center, without the icon's previous margin-top. The description is the separate right column; on phones, it sits below the shared block and aligns with the heading.

**Sixth review — the same menu on phone and tablet:** all rules for the centred capsule, drawer, image displacement, inert and animation now apply below 900px, including tablet. This supersedes the previous 600px menu breakpoint; the other responsive sections do not change. Menu/Close uses `--color-menu-control: rgb(40 43 40 / 8%)` with graphite text — a darker translucent area instead of solid black. Desktop navigation remains the same.

**Fifth review — expansion and skip link:** below 600px, navigation uses a grid drawer from 0fr to 1fr over 320ms, reversing on close. The outer spacing is animated so that, with the menu fully open, the opening image starts after the entire panel, with a 1rem gap. The glass surface is a separate pseudo-element expanding from the compact capsule to the panel width. Closed phone links are inert immediately, including during animated closing. Reduced motion removes the animation. The skip link is moved before the header and visually hidden with clip-path; it appears on keyboard focus-visible in a separate viewport panel. No fragment of it appears above Menu. This supersedes the previous immediate expansion and negative spacing with the phone menu open.

**Phone menu after the fourth review:** only below 600px, the closed glass panel is compact and centred, showing only Menu. On opening, the panel expands within the shared gutters; the home link “Luxury Architects” appears below Close, followed after a 1rem gap by Projects, Studio, Services, Process and Contact vertically. Above 599px, the composition remains as before. There is only one visible home link at each breakpoint; focus is preserved at 599/600 and 899/900px. There are no new screenshots; the user performs the visual review.

**KILN after the third review:** hero and footer use a shared FittedWordmark. The four letters stay on one line; when the actual width is insufficient, the size is reduced according to the measured text and container. ResizeObserver and a font loading event update the size on responsive transitions and font loading. There is no cropping or horizontal scale. This supersedes the wrapping exception in section 12. Ordinary text and headings continue to enlarge and wrap normally.

**Current revision after the second user review:** Manrope replaces Bodoni Moda for the identity and all h2/h3. Local `manrope-latin-variable.woff2`, weights 500–600, font-display swap and preload. h2 is 500, `clamp(2.25rem, 4.4vw, 4rem)` / 1.12; h3 is 600, `clamp(1.5rem, 2.1vw, 2rem)` / 1.25; identity is 600, `clamp(1.25rem, 1.8vw, 1.375rem)` / 1.25. Glass opacity is 64%, blur 16px, saturation 130%, edge 55%; the shadow is 10% black. These values supersede the corresponding initial values below. The new review takes place directly in the browser; at an explicit request, there are no new screenshots.

Rationale: four specific browser comments — Apple Liquid Glass navigation, premium headings and a clearer structure with icons in Studio, Services and Process. These decisions supersede the restrictions in sections 3 and 5 for the relevant elements; the palette, four images, content and section order remain the foundation.

### Typography

- Local **Bodoni Moda 400–600**, Latin variable WOFF2, optical sizing auto: all h2/h3 and “Luxury Architects”. `--font-editorial` is the role; heading 400, subheadings and identity 500.
- h2: `clamp(2.5rem, 4.8vw, 4.5rem)`, leading 1.06, tracking -0.03em. h3: `clamp(1.75rem, 2.6vw, 2.5rem)`, leading 1.15, tracking -0.025em.
- Identity: `clamp(1.375rem, 2.2vw, 1.75rem)`, leading 1.1. KILN retains Panchang 700; body text, navigation links and the form retain Switzer. Panchang is a separate brand wordmark, while Bodoni/Switzer are the two content families.
- The new file is preloaded, uses font-display swap and is self-hosted. There is no runtime request to Google Fonts. Provenance and OFL licence (local archive).

### Navigation

The floating glass panel has a 1rem top offset and the shared page gutters. Height starts at 4.25rem; 0.625rem/1.5rem padding, 2.25rem radius (1.75rem below 900px), a light edge and soft shadow. `--color-glass` is mineral ground at 86% opacity; blur 22px and saturation 140%. The panel overlaps only the hero image, stays in normal flow and grows with enlarged text or an open menu. It is not fixed/sticky and does not obscure anchor targets or form errors during scrolling.

Without backdrop-filter and with prefers-reduced-transparency, the background is solid mineral ground. Forced colors retains a system outline. The menu, Escape, outside click, focus and breakpoint behaviour are retained. The glass effect and new icons are explicit user exceptions to the Taste Skill rules on glass and ornaments.

### Studio, Services, Process

- Studio: two areas at 1:1 with a 5rem gap on desktop. The heading and existing statement are on the left; on the right, two thematic blocks — “A sense of place” and “Material & light”, with an icon and the existing text. On tablet, the blocks form two columns below the intro; on phones, one sequence.
- Services: a semantic list with three open rows — icon, heading and description. On phones, the description sits below the heading. No cards, badge backgrounds or decorative borders.
- Process: graphite field without the previous light sheet. Intro/list are 5:7; the four stages form a semantic ol in a 2×2 grid, and one column on phones. The stages have icons for conversation, direction, detail resolution and home. The layout follows the natural DOM order.
- Nine small authored outline SVG icons (32px viewBox, stroke 1.4, currentColor); decorative and hidden from the accessibility tree. Their meaning is always also present in the text. The icons have no animations or separate library dependency.

## 14. SIN-103 — navigation, fallback fonts and scroll effects

Changes from [SIN-103](https://linear.app/singularity-lab/issue/SIN-103/ui-podobreniya-i-efekti-sled-impeccable-kritika), after an Impeccable critique and the user's choices. They supersede the matching rules in sections 5, 8 and 13; everything else stays.

### Quick navigation

- The main header keeps its section 13 behaviour: it stays in the normal flow, and below 900px its drawer still moves the hero image down. This was a user decision in SIN-47.
- A second, compact glass bar (`components/QuickNav.tsx`) is fixed at the bottom centre, `max(1rem, safe-area)` from the edge. It appears only after the hero has left the screen, and only while the visitor scrolls up (8px threshold). It hides when scrolling down, and when Contact fills the lower 60% of the screen, so it never covers the form, its errors or anchor targets at the top.
- From 900px: the five section links and a clay “Discuss your project” pill. Below 900px: Menu and the same CTA; Menu opens the links above the controls. Escape, an outside click, a link and blur close the list. Keyboard focus inside the bar keeps it visible; when hidden it is `inert`.
- The CTA uses a full pill radius inside the bar to match the glass shape. This is the only exception to the square clay buttons in section 6.
- Shows/hides with transform and opacity (320ms in, 220ms out). With reduced motion it switches instantly. Reduced transparency and forced colours use the same fallbacks as the header.

### Fonts

`Panchang Fallback` and `Switzer Fallback` are local Arial faces with `size-adjust`, `ascent-override` and `descent-override`, measured with canvas text metrics against the real files: Panchang 149.3% / 65% / 17.4% (matched on “KILN”), Switzer 400 100.1% / 97.9% / 25%, Switzer 500 101.3% / 96.7% / 24.7%. A fresh clone without the Fontshare files keeps the same text widths and line heights. `npm run build` runs `scripts/verify-fonts.mjs` first and prints a warning that lists missing files. It does not stop the build, because the public repository must still build without them.

### Studio and Process

- Studio: below the statement, a 5:4 close crop of the existing Ridge House image shows the limestone wall, timber eave and a dark window frame (`max-width: 28rem`). It reuses the same files, so there are still exactly four images. The crop uses size and offset, not transform, so it looks the same with reduced motion.
- Studio and Services keep their icons (user decision in SIN-47). Process no longer has icons: the semantic `ol` is one column, with a thin vertical line (mineral at 40%) on the left and a short mineral tick at each stage heading. From 600px each stage is a row: heading 4fr, description 8fr. The line shows the order from Listen to Realise; there is still no visible numbering.

### Motion — replaces “Everything below the hero is static” in section 8

One idea links the effects: the home rises from the ground. All of them run once, use `cubic-bezier(0.16, 1, 0.3, 1)` unless stated, and exist only with `prefers-reduced-motion: no-preference`.

| Element | Behaviour |
| --- | --- |
| Project images and the Studio detail | Clip from `inset(32% 0 0 0)` to full, 900ms; project images also go from `scale(1.06)` to 1, 1100ms. The image is never fully hidden. |
| Process line | Draws downwards with `scaleY(0 → 1)`, 1400ms, `cubic-bezier(0.65, 0, 0.35, 1)`; the four ticks grow from the left with 350ms steps. |
| Footer KILN | Rises from `translateY(0.18em)`, 900ms. The footer clips this movement, so the page height does not change. Opacity stays 1. |
| Project image hover | Only on hover-capable devices: `scale(1.025)` over 1100ms. No cursor change, because the projects are not links. |
| Hero CTA arrow | `translate(3px, -3px)` on hover and focus, 180ms. |

`components/RevealObserver.tsx` uses IntersectionObserver (bottom margin −12%). It sets `data-reveal-state="pending"` only on `[data-reveal]` elements that start below the fold. The server HTML has no pending state, so text and images are complete without JavaScript, and text is never hidden. There is still no parallax, pinned section, scroll-linked animation or animation library.

### Copy

- Contact: the second paragraph (“Please use sample details…”) is removed. The form notice before the fields remains and is now linked to all three fields through `aria-describedby`.
- Footer: one line, “KILN is a fictional studio. Its homes are imagined concepts, illustrated with ImageGen.” It replaces the two-line disclosure and the separate ImageGen note.
- The Projects intro disclosure and the exact demo status remain unchanged.
