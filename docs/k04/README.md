# SIN-35 / K04 — first complete version

20 October 2026. [Linear task](https://linear.app/singularity-lab/issue/SIN-35/k04-purva-cyalostna-versiya).

## Scope and baseline

Built from origin/main at 7f2a232, which includes merged SIN-34 PR #3. Branch: codex/sin-35-first-version. One page, with hero, three fictional residential projects, studio, services, process, accessible mobile navigation and a local-only demo form. No deployment or next-stage work.

The page is complete enough for design review. It is an initial baseline, not the final visual identity. DESIGN.md remains a K06 deliverable; final images remain K08–K09 work.

## Taste direction and decisions

Verified all 39 skill files against commit 63aba5f43b5056758b15bbe7d683da8c86a7a7ad. Direction: **The name as a monument**, seed **35**, palette kept from the brief. The final [direction sheet](direction.json) is retained with the two explicit section redraws.

Subject inventory: the KILN name; clay transformed by heat; mineral walls; timber surfaces; stone thresholds; warm ground; graphite ink; muted clay action; sheltered courtyard; open ridge; woodland edge; the constraint of being a fictional portfolio practice. The last three settings are authored concept content, not actual sites.

Idea: On this page, KILN's name and material character become an architectural mass: broad letters between a large reference image and the small, practical descriptions of living spaces. The inverse name closes the page. The live interactions are the agreed menu and demo form; no extra feature was added.

Argument and evidence:
- Residential homes shaped by their setting → the hero reference and plain residential description.
- Three different ways to inhabit a landscape → specific courtyard, ridge and woodland concept descriptions.
- A material-led studio approach → the kiln analogy, mineral walls, stone and timber.
- Architecture, interiors and landscape are related → three concrete service descriptions.
- A residential project needs a clear sequence → Listen, Explore, Resolve and Realise, without invented deadlines.
- Start with how you want to live → the clearly marked demo form.

Redraws and project adaptations:
- work: giant-title uneven wall assumed 9–16 projects. Replaced its slot with staggered tiles, reduced to the required three concepts, with one full-width stack on phones.
- contact: address display rows assumed a real address and no form. Replaced with the coupon form slot, retaining a simple split between invitation and required fields. Square, open styling follows KILN's restrained treatment; no fictitious address.
- Studio retains the wide paragraph and shared column line. No founded date, team size, awards or clients were invented to fill the original template.
- Services are static text columns with all descriptions visible on every device; no hover-only information.
- Process retains the contrasting slip and four actual stages, without decorative receipt cuts or invented durations.
- Hero puts the name before its supporting line so that the full name, category and action fit the first screen. Slight entrance travel and control feedback replace scaling-on-scroll or quota-driven motion.
- The project palette takes precedence over the skill's cream/clay ban. No video, extra photos, scroll scenes or unrelated live feature were added.

No bundled “Hands and making” photos or code drawings stand in for project imagery. The temporary references, credits, license and font provenance are listed in [temporary-assets.md](../temporary-assets.md). Each image is visibly credited and explicitly temporary; none is claimed as a KILN commission. All project names, settings and service/process copy are authored demonstration content. They must remain labelled as such.

## Verification performed

- npm ci, Node 22.21.0 / npm 10.9.4.
- npm run typecheck — passed.
- npm run lint — passed with no warnings.
- npm run build — passed; out/index.html and static assets generated.
- Taste source lint on app and components — 0 FAIL, 0 WARN.
- Static out/ served locally at port 4174; no reliance on next dev.
- node scripts/check-k04.mjs http://localhost:4174 — passed at 1440×900, 768×1024 and 375×812. [Machine-readable results](browser-checks.json).
- All four images load with alt text; no horizontal overflow; one h1 and headings at most two lines.
- All section anchors and primary CTA work. At tablet/phone sizes: Enter opens the menu, Tab reaches the links, Escape closes and restores button focus, selecting a link and clicking outside close the menu.
- Empty form: three associated errors and focus to name. Invalid email: email error and focus. Valid input: exact required demo text and cleared fields.
- Zero requests while completing the form; no localStorage, sessionStorage, cookies or IndexedDB databases before/after; no third-party requests on the page. Inputs have no name attributes, avoiding accidental form value serialization in the HTML fallback. Source review confirmed no data logging, analytics, persistence or submission endpoint.
- Reduced-motion mode disables animation and smooth scrolling. Text remains visible without an entrance animation.
- No failed resource requests, JavaScript exceptions or console errors in the final browser scenarios. The missing favicon found in the first run was fixed.
- Final full-page and fold screenshots were reviewed at all widths. Inspector sheets were also opened after the final visual change.
- Git diff whitespace check passed.

This is Chromium-based automated browser verification and visual inspection, not a screen-reader audit or a cross-browser certification. No hosted site was tested or deployed.

## Taste inspector findings

[Unmodified final report](taste-inspector.json): **1 FAIL, 2 WARN**; exit code 1. It is not reported as passing.

- FAIL still-page: only one animated element is measured; the skill asks for at least eight. KILN explicitly prioritises moderate motion over quotas, so the 8px name entrance and control feedback are retained.
- WARN palette-cream: the warm background and clay accent are the required project palette.
- WARN no-footage: KILN requires four still-image slots, with final ImageGen images in K08. Video is outside this stage's scope.

No findings were hidden and no upstream scripts were modified. The earlier duplicate h1, clipped desktop name and mobile CTA-as-eyebrow finding were fixed before the retained report.

## Visual critique

ROUND 1
Seen in one second: a house image and a large, partly clipped KILN.
Idea (one sentence): the KILN name becomes a broad architectural mass.
Live thing: section navigation and the local demo form.
Layout words by section: hero=monument / projects=staggered / studio=wide-paragraph / services=columns / process=slip / contact=split / footer=inverse-name.
Scores: design 6.5 · usability 7 · creativity 6 · content 6 → overall 6.55, capped at 6.0.
Caps applied: retained inspector FAIL; temporary images do not establish a coherent project portfolio.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Original desktop fold clipped the bottom of the name → reduce the image height and put the complete name before supporting text.
2. Original phone fold left the name short of the right margin → increase its width to use the established frame.
3. Initial project sheets show unrelated details and a historic doorway → identify them as references, keep all credits, and replace the set with coherent ImageGen concepts in the scheduled image stages.

ROUND 2
Seen in one second: KILN under one large architectural image.
Idea (one sentence): the heavy, material-like name frames a quieter sequence of places to live.
Live thing: keyboard-operable menu and validated demo form.
Layout words by section: hero=monument / projects=staggered / studio=wide-paragraph / services=columns / process=slip / contact=split / footer=inverse-name.
Scores: design 7 · usability 8 · creativity 6 · content 6 → overall 7.1, capped at 6.0.
Caps applied: inspector's still-page FAIL remains under the project motion exception. This is a first-version baseline, not a 7.5+ final claim.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. 1440-page and 375-page: the historic doorway differs from the modern references → replace all temporary slots in K08–K09.
2. 1440-page: project imagery shows material atmosphere rather than the whole proposed dwelling → use consistent generated architectural views in K08–K09.
3. 768-page: some project descriptions form narrow columns → review again with actual image crops and the accepted K06 typography; current copy remains fully visible and readable.

## Baseline screenshots

These are initial comparison artifacts for K05 and later stages, captured from the static export with reduced motion and after lazy images had loaded.

| Width | First screen | Complete page |
| --- | --- | --- |
| 1440 | [Desktop](1440-fold.jpg) | [Desktop page](1440-page.jpg) |
| 768 | [Tablet](768-fold.jpg) | [Tablet page](768-page.jpg) |
| 375 | [Phone](375-fold.jpg) | [Phone page](375-page.jpg) |

## Handoff

Worktree and branch remain available for review and requested fixes. The user reviews and merges the PR. SIN-35 stays In Review and the chat stays red until confirmed merge and accepted criteria. No K05 agent or task has been started.

Existing dependency limitations from K02 remain: npm ci reports five development-only high findings in the known ESLint dependency chain. No dependency versions were changed by K04.

## Саморевю след merge

По заявка на потребителя е извършено допълнително [SIN-35-Self-Review](self-review/SIN-35-Self-Review.md). Документът съдържа шест констатации, измервания и снимки; кратките насоки са предадени в SIN-36. Саморевюто не променя приложението или първоначалните снимки по-горе.
