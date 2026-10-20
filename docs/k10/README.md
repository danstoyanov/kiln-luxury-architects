# K10 — Подобряване на композицията

[SIN-41](https://linear.app/singularity-lab/issue/SIN-41/k10-podobryavane-na-kompoziciyata), 20 октомври 2026 г. Изпълнено лично, без други агенти. База: `7de41fdf1515d389d7188659257612baf1539654`, потвърден merge на [K09 PR #10](https://github.com/danstoyanov/kiln-luxury-architects/pull/10). Управлявано worktree `sin-41-composition`, клон `codex/sin-41-composition`.

## Референции и решения

Разгледани на 20 октомври 2026 г. чрез Awwwards и реалните сайтове. Няма изтеглен чужд код, шрифт или изображение.

| Референция | Наблюдение и приложение към KILN |
| --- | --- |
| [GNWA Architects — Awwwards](https://www.awwwards.com/sites/gnwa-architects), [Projects](https://www.gnwa.ch/portfolio/projekte) | Ясни общи ръбове на изображенията и непосредствено свързани с тях надписи. Пренасяме принципа за повторяеми вертикални опори: Projects/Services intro следват Ridge, а описанието на Woodland използва същата ос. Двуколонният надпис е собствено решение за наличната KILN решетка, а не копие. Не приемаме хоризонтален scroll, дребни кодови captions, линии, lightbox или входната анимация. |
| [Forte Architetti — Awwwards](https://www.awwwards.com/sites/forte-architetti), [Projects](https://fortearch.it/projects.html) | Големият кадър има ясна тежест спрямо вторичната информация. Сравнението потвърди, че hero на KILN вече изпълнява тази роля. Нова hero промяна не помага: текстът върху фотография, каруселът, цветовете, serif заглавията и дългите анимирани преходи противоречат на приетата идентичност. Не ги прилагаме. |

## Какво се промени и защо

1. Над 899px Projects и Services използват 12-колонната решетка: heading в 1–6, intro в 8–12, подравнени отгоре. Преди intro започваше на отделна половинна ос и заглавието беше подравнено отдолу. Сега десният ръб на съдържанието има обща опора с Ridge House.
2. От 1200px Woodland caption има две области: име/Concept и setting вляво, описание вдясно по оста на Ridge. Това балансира текста под широкия финален кадър. Под 1200px остава последователен надпис. Име и setting са групирани, за да запазят 6px gap без разтягане на grid редовете.

[DESIGN.md](../../DESIGN.md) записва точно тези уточнения. Запазени са палитра, Panchang/Switzer, текстове, DOM ред на информацията, секции, 3:2 изображения, responsive sizes, CTA, меню, форма и motion. Не са добавени зависимости, функционалности или страници.

[Измерванията](composition-metrics.json) потвърждават общ x=848.65625px за Projects intro, Services intro, Ridge и Woodland описание на 1440px. Image → title е 16px, title → setting е 6px. Няма overflow при 375, 768, 900, 1199, 1200, 1366, 1440 и 2560px; границите 1199/1200 са проверени изрично. Измерванията използват viewport height 900px; основните снимки са 375×812, 768×1024, 1440×900.

## Сравнение преди/след

| Ширина | Projects преди | Projects след | Цяла страница преди | Цяла страница след | Services след |
| --- | --- | --- | --- | --- | --- |
| 1440px | [Преди](before/1440-projects.jpg) | [След](after/1440-projects.jpg) | [Преди](before/1440-page.jpg) | [След](after/1440-page.jpg) | [Services](after/1440-services.jpg) |
| 768px | [Преди](before/768-projects.jpg) | [След](after/768-projects.jpg) | [Преди](before/768-page.jpg) | [След](after/768-page.jpg) | [Services](after/768-services.jpg) |
| 375px | [Преди](before/375-projects.jpg) | [След](after/375-projects.jpg) | [Преди](before/375-page.jpg) | [След](after/375-page.jpg) | [Services](after/375-services.jpg) |

Прегледани са трите project сравнения и всички осем финални inspector fold/sheet изображения. Desktop стената получава по-ясни общи ръбове и по-балансиран завършек; 375/768 запазват четимата последователност. Hero и останалите секции запазват характера си.

## Проверки

- `npm run typecheck`, `npm run lint`, `npm run build` — успешни след финалната промяна; build създава `out/`.
- `node scripts/check-k09.mjs http://localhost:4210 --out docs/k10/after` — [image report](after/image-checks.json): 32 файла със съвпадащи hashes, WebP/JPEG fallback, responsive избор, четири изображения, lazy loading под hero, 16px caption gap, липса на overflow/console/resource errors, CLS под 0.001 и непроменени рамки при забавени image responses.
- `node scripts/check-k07.mjs http://localhost:4210 --out docs/k10/regression` — [identity](regression/identity-checks.json), [targeted](regression/behaviour/targeted-checks.json), [behaviour/privacy](regression/behaviour/regression/browser-checks.json): navigation, keyboard/focus, menu Escape/избор/outside click, празна форма, невалиден имейл, валидни примерни данни и точен demo статус без network/storage/cookies/IndexedDB запис; reduced motion, hover/press, 200% основен текст, нисък desktop и wide frame.
- `node scripts/verify-taste-skill.mjs` — 39/39 файла за фиксирания commit `63aba5f43b5056758b15bbe7d683da8c86a7a7ad`. Няма нов draw.
- Taste source lint — 0 FAIL / 0 WARN. Inspector на 1440/768/375: [преди](taste-before.json), [след](taste-after.json) — същите **1 FAIL / 3 WARN**, без allowances. FAIL `still-page` е следствие на изрично умереното движение. WARN `palette-cream` е приетата mineral/clay система; `no-footage` е договорът за четири ImageGen кадъра; `name-only-title` е евристика с минимум 18px при видимо описание на договорените mobile 17px. FAIL не е отчетен като PASS.
- `git diff --check` и локалните документни връзки — проверени преди PR.

`run.json` файловете записват base commit, dirty state и hashes на source/export по време на проверките. Междинното измерване откри разтегнат title/setting gap; финалното групиране го поправи и пълните проверки бяха повторени. Предишните K04–K09 артефакти не са променяни.

```text
ROUND 1 — baseline
Seen in one second: архитектурният праг и геометричният KILN.
Idea (one sentence): материалната маса на името свързва терена и обитаването.
Live thing: меню и локална демо форма.
Layout words by section: hero=image-name / projects=wall / studio=text / services=open-columns / process=sheet / contact=split / footer=inverse-name.
Scores: design 7 · usability 8 · creativity 6 · content 8 → overall 7.2, capped at 6.0.
Caps applied: still-page FAIL; позната архитектурна посока.
Top three problems: before/1440-projects.jpg — отделна intro ос; широк Woodland надпис с текст вляво; before/1440-fold.jpg — native 1536px детайлът остава ограничен.

ROUND 2 — финален резултат след корекцията на групирането
Seen in one second: архитектура и KILN; обща ос през проектната стена.
Idea (one sentence): същата материална идентичност с по-ясни текстови опори.
Live thing: меню и локална демо форма.
Layout words by section: hero=image-name / projects=wall / studio=text / services=open-columns / process=sheet / contact=split / footer=inverse-name.
Scores: design 7.5 · usability 8 · creativity 6 · content 8 → overall 7.4, capped at 6.0.
Caps applied: същият still-page FAIL и познатата архитектурна посока. Субективна оценка, не независимо жури.
Top three remaining limits: native 1536px hero; по-мека фина Woodland растителност от K09 компресията; общата композиционна посока остава позната. Няма допълнителна промяна, която е обоснована в обхвата на K10.
```

## Възпроизвеждане и ограничения

Node 22.21.0 / npm 10.9.4, Chrome/Edge/Chromium. От своето worktree:

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm exec -- serve out --listen 4210 --no-clipboard
```

В друг терминал използвай горните QA команди с нови `--out` директории; inspector: `node .agents/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:4210 --widths 1440,768,375 --out .taste-skill/k10-new`. Taste lint: `node .agents/skills/design-taste-frontend/scripts/lint.mjs app`.

Няма Safari/Firefox, screen reader, пълен WCAG, Lighthouse или hosted-site проверка. 200% е симулация на основния текст, не всеки zoom режим. Наследени са 5 high npm audit записа без промяна на зависимости. Няма публикуване, merge или започване на K11. Worktree-то остава за ревю; SIN-41 остава In Review и чатът червен до човешки merge и приемане.
