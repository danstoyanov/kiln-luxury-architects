# K09 / SIN-40 — Интегриране на изображенията

20 октомври 2026 г. · [Linear SIN-40](https://linear.app/singularity-lab/issue/SIN-40/k09-integrirane-na-izobrazheniyata)

Четирите временни референции са заменени с подбраните K08 ImageGen концепции. Страницата използва предварително оптимизирани WebP/JPEG варианти, конкретен английски alt текст, видими AI/fictional бележки и отложено зареждане за проектите. Няма нов layout, зависимости, страници, backend или деплой.

Предходният [K08 PR #9](https://github.com/danstoyanov/kiln-luxury-architects/pull/9) е потвърден MERGED на 20 октомври 2026 г., 13:45:38 UTC. След `git fetch origin` е създадено отделно управлявано Codex worktree от `37aa3506aed68ff6ddeee3775c81a9c2a1a16b3d`, клон `codex/sin-40-integrate-images`. Задачата е изпълнена лично, без други агенти.

## Файлове, компресия и произход

Непроменените [оригинали и точни промптове](../k08/README.md) остават извън `public/`. [prepare-k09-images.py](../../scripts/prepare-k09-images.py) проверява SHA-256 на masters спрямо K08 manifest-а и генерира 32 файла в [public/assets](../../public/assets): четири ширини × два формата × четири кадъра. [assets.json](assets.json) съдържа точни размери, bytes, качество и SHA-256 на всяка производна.

- Masters: 1536×1024. Варианти: 480×320, 768×512, 1280×853, 1536×1024. Няма 1920px файл или upscaling.
- Python 3 с Pillow 12.0.0; Lanczos resize, WebP method 6, progressive optimized JPEG quality 82. Готовите файлове са в Git; нормалният npm build не изисква Pillow.
- WebP започва от quality 80. За 1280/1536px: hero/courtyard/ridge quality 65, woodland quality 38. По-високата сложност на гората изисква по-силна компресия, за да се постигне бюджетът. Прегледът на 1280px версии и браузърните снимки потвърждава четими дървесни повърхности, опори, стъпала, вход и маса; фината растителност е по-мека от master-а. Няма ретуш, цветни филтри или нови композиции.

| WebP | Измерени bytes | Цел в DESIGN.md | Резултат |
| --- | ---: | --- | --- |
| Hero 768px | 109,346 | ≤110 KB | Спазена |
| Hero native 1536px | 271,848 | 280 KB при 1920px | Под 280 KB; оригиналът не позволява 1920px |
| Courtyard 1280px | 177,110 | ≤180 KB | Спазена |
| Ridge 1280px | 172,562 | ≤180 KB | Спазена |
| Woodland 1280px | 177,308 | ≤180 KB | Спазена |

KB в таблицата е 1000 bytes. Четирите ширини имат една и съща 3:2 композиция; mobile hero се изрязва с CSS според приетия frame. `ConceptImage` подава WebP source и реален JPEG fallback с отделни `srcSet` и `sizes`, native fallback `width=1536` / `height=1024`. Hero е eager/high priority; проектите са lazy/async. `sizes` съответства на 12-колонната стена и лимита 1920px. Няма сървърен `next/image` оптимизатор.

Петте стари JPEG файла са премахнати от `public/assets/temporary`; старите фотографии не се включват в текущия export. [Историческият произход](../temporary-assets.md) и K04–K08 артефактите са запазени. ImageGen не се представя като фотография на реално построени KILN поръчки.

## Проверки на самия static export

Изпълнени: `npm ci`, `node scripts/verify-taste-skill.mjs` (39/39), `npm run typecheck`, `npm run lint`, `npm run build`. Build създава `out/`. То е обслужено с `npm exec -- serve out --listen 4200`; не е използван `next dev` за приемането.

[check-k09.mjs](../../scripts/check-k09.mjs) и [image-checks.json](after/image-checks.json):

- Всичките 32 файла са върнати с HTTP 200 и проверени byte-for-byte по SHA-256 спрямо assets manifest-а.
- Реален Chromium при 375×812, 768×1024, 1440×900 и 375×812 с DPR 2; cold cache. Четирите WebP се зареждат с responsive избор, английски alt текстове и реални размери. При превключване на source към неподдържан MIME type браузърът избира и успешно декодира JPEG fallback-а.
- Няма хоризонтално преливане, липсващи ресурси или console/runtime errors. Всички проектни рамки са 3:2. Hero focal е 58% 50% на телефон и 50% 55% на tablet/desktop; Ridge е 50% 55%.
- CLS е под 0.001 във всички сценарии (практически нулев, с възможна субпикселна стойност). Това е локално измерване с PerformanceObserver, не field performance или Lighthouse оценка.
- Отделно на 375 и 1440px image responses са задържани, докато всички празни рамки бъдат измерени. След освобождаване и decode позициите и размерите на четирите рамки са идентични. Няма видим image layout shift.
- Lazy атрибутите са проверени. Точният момент на предварително зареждане под сгъвката се избира от браузъра; не се твърди, че native lazy чака самото появяване на кадъра.

Избран WebP payload за четирите изображения след пълно разглеждане: приблизително 175 KB при 375/DPR1, 432 KB при 768/DPR1 и 375/DPR2, 721 KB при 1440/DPR1. Това са само image bytes, без HTML/CSS/JS/fonts/HTTP headers. Браузърът не изтегля всичките 32 варианта.

Повторена е и съществуващата `check-k07.mjs` регресия: [identity-checks.json](regression-final/identity-checks.json), [targeted-checks.json](regression-final/behaviour/targeted-checks.json), [K04 behaviour report](regression-final/behaviour/regression/browser-checks.json). Проверени са навигация, keyboard focus, затваряне на менюто с Escape/избор/outside click, увеличен основен текст до 200%, 1366×768, 2560px рамка, reduced motion и hover/press. Формата е проверена с празни полета, невалиден имейл и валидни примерни стойности; точният demo текст остава, без мрежова заявка или browser storage/cookies/IndexedDB запис. Контрастите, заглавията и локалните шрифтове запазват проверките на K07.

Старият K05 QA скрипт очакваше точно две footer връзки, включително Unsplash License. След нейното правилно премахване първото регресионно изпълнение спря при focus на несъществуващата втора връзка. Скриптът вече изисква поне една footer връзка и проверява фокуса/контраста на всички налични връзки. Повторната пълна регресия е успешна; историческите отчети не са променяни.

`run.json` файловете записват base commit, dirty state, source tree hash и export HTML hash. Проверките са направени преди commit; hash-ът включва и QA скриптовете. Финалната корекция на screenshot capture в K09 не променя application кода или export-а.

## Снимки и визуален преглед

| Viewport | Преди — цяла страница | След — първи екран | След — цяла страница | След — проекти |
| --- | --- | --- | --- | --- |
| 1440px | [Before](before/1440.jpg) | [Fold](after/1440-fold.jpg) | [Page](after/1440-page.jpg) | [Projects](after/1440-projects.jpg) |
| 768px | [Before](before/768.jpg) | [Fold](after/768-fold.jpg) | [Page](after/768-page.jpg) | [Projects](after/768-projects.jpg) |
| 375px | [Before](before/375.jpg) | [Fold](after/375-fold.jpg) | [Page](after/375-page.jpg) | [Projects](after/375-projects.jpg) |

Прегледани са before снимките, всички осем inspector fold/sheet изображения и финалните project кадри на трите ширини. Hero запазва градинския праг, навеса и видимото жилищно пространство. Courtyard показва четим засаден двор и връзка към дневна; Ridge запазва целия покрив и хоризонталния обем; Woodland показва защитения вход, стъпалата и общата маса. Серията споделя материали и светлина, без stock/fictional смесване.

## Taste проверка и граници

Използвано е фиксираното проектно копие на `design-taste-frontend`, commit `63aba5f43b5056758b15bbe7d683da8c86a7a7ad`. Запазени са посоката **The name as a monument**, seed **35**, приетата палитра, типография, layout и motion; няма нов draw. Taste lint: 0 FAIL / 0 WARN. Inspector е изпълнен на 1440/768/375px без allowances: **1 FAIL / 3 WARN**, записани без промяна в [raw report](taste/report.json).

| Finding | Оценка спрямо приетия DESIGN.md |
| --- | --- |
| FAIL `still-page` | Два движещи се hero елемента. Договорът изрично запазва умереното движение без квоти и section reveals. Не се променя в K09. |
| WARN `palette-cream` | Mineral/clay палитрата е приета в K06. |
| WARN `no-footage` | Договорени са точно четири ImageGen изображения; видео не е част от задачата. |
| WARN `name-only-title` на 768/375 | „Residential architecture.“ е четимо под името в кадрите. Евристиката изисква 18px; приетият mobile body е 17px. |

Inspector FAIL не е отчетен като PASS. Raw report пази локалните пътища от изпълнението; съответните снимки са копирани в тази [taste папка](taste).

```text
ROUND 1 — финална интеграция на K09
Seen in one second: минерален дом и плътният знак KILN.
Idea (one sentence): материалната маса на името свързва земята, прага и пространството за обитаване.
Live thing: съществуващите меню и локална demo форма.
Layout words by section: hero=image-name / projects=wall / studio=text / services=open-columns / process=sheet / contact=split / footer=inverse-name.
Scores: design 7.5 · usability 8 · creativity 6 · content 8 → overall 7.4, capped at 6.0.
Caps applied: оставащият still-page FAIL и идеята, приложима и за други архитектурни студиа. Субективна оценка, не независимо жури.
Top three problems / оставащи граници:
1. after/1440-fold.jpg — native hero е 1536px; на големи/high-DPR дисплеи детайлът е ограничен от оригинала. Не е увеличаван изкуствено.
2. after/1440-projects.jpg — Woodland запазва входа/масата, но компресираната фина растителност е по-мека от master-а; приет компромис за 180KB целта.
3. after/375-page.jpg — композиционната посока е позната за архитектурни студиа; референции и финален audit остават отделните K10/K12/K13.
```

Не са изпълнявани Safari/Firefox, screen reader, пълен WCAG, Lighthouse или hosted-site проверки. JPEG fallback е проверен чрез unsupported source selection, а не в стар браузър без WebP. 200% основен текст е reflow симулация, не всеки zoom режим. npm ci запазва вече документираните 5 high development dependency записа от K02; няма dependency промяна. Няма публикуване и следваща задача.

## Възпроизвеждане

От worktree-то, с Node 22.21.0 / npm 10.9.4 и Chrome/Edge/Chromium:

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm exec -- serve out --listen 4200
```

В друг терминал:

```sh
node scripts/check-k09.mjs http://localhost:4200
node scripts/check-k07.mjs http://localhost:4200
node .agents/skills/design-taste-frontend/scripts/lint.mjs app
node .agents/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:4200 --widths 1440,768,375
```

Новите QA резултати са в `.taste-skill/checks/`; за нов комплект за ревю използвай `--out <new-directory>`. Не презаписвай историческите снимки. За image regeneration с вече инсталиран Pillow 12.0.0: `python scripts/prepare-k09-images.py`, после нов build и image check. Спри static сървъра с Ctrl+C.

PR остава за човешки review/merge. Worktree-то се запазва за поправки в същия PR; SIN-40 става Done и чатът зелен след потвърден merge и приемане.


## Корекции след потребителско ревю — текущ изглед

Премахнати са отделните AI бележки под hero и трите проекта. Заглавието/Concept вече е на 16px от изображението, следвано от 6px до setting и 12px до описанието при стандартен root. Глобалното fictional/AI обозначение остава в Projects intro и footer. Актуализиран е и DESIGN.md спрямо изричното искане.

Снимките в `after/` по-горе са първата версия за ревю. **Текущите снимки** са [desktop projects](review/1440-projects.jpg), [tablet projects](review/768-projects.jpg), [phone projects](review/375-projects.jpg), [desktop fold](review/1440-fold.jpg) и [phone fold](review/375-fold.jpg).

Повторно преминаха TypeScript, ESLint и production build, както и [image checks](review/image-checks.json) на самия export при 375/768/1440 и DPR 2: нула per-image captions, измерен gap 16px за трите проекта, четири заредени кадъра, без overflow/errors, CLS под 0.001 и непроменени рамки при забавени image responses. Повторната [K07 identity regression](review/regression/identity-checks.json), [targeted checks](review/regression/targeted-checks.json) и [interaction/privacy checks](review/regression/browser-checks.json) са успешни. Всички осем крайни inspector снимки са визуално прегледани. Inspector запазва същите 1 FAIL / 3 WARN от приетите проектни решения — [raw report](review/taste-report.json); Taste lint остава 0 FAIL / 0 WARN.

```text
ROUND 2 — корекция по ревю
Seen in one second: домът и KILN, без отделен image label.
Idea (one sentence): материалната маса на името свързва терена с обитаването.
Live thing: меню и локална demo форма.
Layout words by section: hero=image-name / projects=wall / studio=text / services=open-columns / process=sheet / contact=split / footer=inverse-name.
Scores: design 7.5 · usability 8 · creativity 6 · content 8 → overall 7.4, capped at 6.0.
Caps applied: still-page и познатата за архитектурни студиа посока.
Top three problems / граници: native 1536px hero; по-мека Woodland растителност; позната композиционна посока. Няма нов проблем от премахването на labels или уплътняването.
```
