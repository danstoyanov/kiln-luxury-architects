# SIN-38 / K07 — прилагане на идентичността

20 октомври 2026 г. [Linear задача](https://linear.app/singularity-lab/issue/SIN-38/k07-prilagane-na-identichnostta).

## Резултат и граница

Приетият [DESIGN.md](../../DESIGN.md) е приложен към съществуващата страница. Управлявано worktree `sin-38-identity`, клон `codex/sin-38-apply-identity`, база `a9178e2ffb5392a522f4162a5234fab5cdf13fc3` от актуалния `origin/main`. Предходният [PR #7 / SIN-37](https://github.com/danstoyanov/kiln-luxury-architects/pull/7) е потвърден MERGED; refs са обновени и преди финалния PR.

- Минерален фон, graphite текст, limestone полета и fired-clay действия; контекстен светъл фокус в тъмните секции.
- Panchang само за името; Switzer 400/500 за четене, заглавия и контроли. React preload API излъчва точно два font preload тага, за Panchang 700 и Switzer 400; няма външни font заявки.
- Договорени rem gutters и section paddings; вътрешна рамка 1920px с full-bleed цветни полета и hero фотография.
- По-голям hero кадър; desktop име вляво и описание/CTA вдясно. Projects са стена 7/5/10 колони с 96px offset за Ridge; под 900px са една колона. И трите кадъра са 3:2.
- Studio, отворени Services колони, тъмен Process със светъл лист, Contact и inverse footer следват договора.
- Само две еднократни hero анимации, background hover и 1px press; reduced motion премахва transforms, animations, transitions и smooth scroll.

Английските текстове, anchor IDs и редът на секциите са запазени. `app/page.tsx` променя само класа на hero `<picture>` за локално clip на анимацията. Менюто и формата нямат промени в TypeScript логиката. Зависимостите, четирите временни изображения, техните автори/лицензи и историческите K04–K06 доказателства са непроменени. Няма нови страници, изпращане, съхранение, генериране на изображения или публикуване; K08–K09 остават отделни задачи.

## Проверена адаптация на договора

Първата версия на прилагането откри преливане при 375px / 200% основен текст: footer името запазва vw размера си, докато rem gutters стават 32px. Document width беше 378px. Вместо скриване на преливането display размерът на името е ограничен от наличната вътрешна ширина. Формулите и минималната промяна на стандартния mobile footer (104.9px вместо 106.1px) са записани в DESIGN.md. Основният текст и контролите не се намаляват.

Допълнителната QA проверка откри дублирани font preload тагове от JSX `<link>` и Next.js resource hints; React preload API отстрани дублирането. Един детайлен screenshot беше заснет преди paint след scroll; QA helper-ът вече изчаква frame и decode. Тези непълни изпълнения са отделени в игнорираната `.taste-skill/`; предаваният комплект е `after/`.

## Изпълнени проверки

- `npm ci`: Node 22.21.0 / npm 10.9.4, успешно. Познатите пет high development findings от K02 остават; `package.json` и lockfile са непроменени.
- `node scripts/verify-taste-skill.mjs`: 39/39 файла съвпадат с фиксирания commit `63aba5f43b5056758b15bbe7d683da8c86a7a7ad`.
- `npm run typecheck`, `npm run lint`, `npm run build`: успешни за крайното приложение; lint без предупреждения. `out/index.html` е създаден и обслужван чрез `serve` на `http://localhost:4197`.
- `node scripts/check-k05.mjs http://localhost:4197 --out docs/k07/before`: baseline преди редакциите. `node scripts/check-k07.mjs http://localhost:4197 --out docs/k07/after`: окончателният комплект, включително наследените K04/K05 сценарии.
- 1440×900, 768×1024, 375×812: без хоризонтално преливане, HTTP/console/runtime грешки или липсващи изображения. Един h1, заглавия до два реда при стандартен текст, четири заредени изображения с alt. Проектите запазват `loading="lazy"`; hero е high priority.
- Меню: Enter/Tab/Escape, фокус след Escape, затваряне след избор и външен клик, всички пет anchors и hero CTA. Видим keyboard focus и footer focus контраст **12.67:1**.
- Форма: празни полета, невалиден имейл, фокус върху първата грешка, валидно попълване и изчистване; точен статус **“Demo only — your enquiry has not been sent or saved.”** Нула заявки по време на формата; празни и непроменени local/session storage, cookies и IndexedDB списък.
- 1366×768, 1440×900, 375×812: описание и CTA в първия екран; CTA долен край съответно **723.97**, **843.77**, **609.39px**. Header е в нормалния поток и не застъпва кадъра.
- 200% `html font-size` при 375, 768, 900 и 1440px: без overflow, четим reflow и всички navigation links достижими с Tab. При увеличен текст hero естествено продължава под сгъвката.
- 375, 768, 1440 и 2560px: точни color roles, заредени три font faces, само двата договорени preload-а, body 17/18px, Switzer секционни заглавия, еднакви gutters и 3:2 проектни кадри. При 2560px padding е 352px от всяка страна — центрирана 1920px рамка.
- Reduced motion: няма активни animations/transforms/transitions. Normal motion: KILN 480ms, hero image 800ms, opacity 1, без анимации под hero. Двата CTA контрола: clay hover без повдигане, active transform 1px.
- Допълнително измерен сбор на layout shifts в локалните reduced-motion сесии: между 0 и 0.00001. Това е конкретно наблюдение при локалното зареждане, не Lighthouse/field CLS сертификация.
- `node .agents/skills/design-taste-frontend/scripts/lint.mjs app components`: **0 FAIL, 0 WARN**. Еднократният Impeccable mechanical detector за променените UI файлове върна `[]`.
- Финален преглед на четимостта, diff-а, локалните Markdown връзки и `git diff --check`.

[Регресионни резултати](after/behaviour/regression/browser-checks.json) · [ниски екрани, 200% и focus](after/behaviour/targeted-checks.json) · [идентичност и движение](after/identity-checks.json).

Всеки QA run записва UTC време, URL, source commit, dirty състояние, source SHA-256 и export HTML SHA-256. `before/` е от чистата база; `after/` е преди commit, затова посочва базовия commit и `workingTreeDirty: true`. Hash-овете описват заснетото състояние. След окончателното заснемане няма промени по приложението. Taste inspector е изпълнен върху същия визуален CSS преди техническата замяна на font preload API; финалният K07 run проверява коригирания export.

## Снимки преди / след

| Сценарий | Преди | След |
| --- | --- | --- |
| Desktop 1440×900 | [Първи екран](before/regression/1440-fold.jpg), [страница](before/regression/1440-page.jpg) | [Първи екран](after/behaviour/regression/1440-fold.jpg), [страница](after/behaviour/regression/1440-page.jpg) |
| Tablet 768×1024 | [Първи екран](before/regression/768-fold.jpg), [страница](before/regression/768-page.jpg) | [Първи екран](after/behaviour/regression/768-fold.jpg), [страница](after/behaviour/regression/768-page.jpg) |
| Phone 375×812 | [Първи екран](before/regression/375-fold.jpg), [страница](before/regression/375-page.jpg) | [Първи екран](after/behaviour/regression/375-fold.jpg), [страница](after/behaviour/regression/375-page.jpg) |
| 1366×768 | [Първи екран](before/1366x768-100-fold.jpg) | [Първи екран](after/behaviour/1366x768-100-fold.jpg) |
| 375px / 200% | [Първи екран](before/375x812-200-fold.jpg) | [Първи екран](after/behaviour/375x812-200-fold.jpg) |
| 900px / 200% | [Навигация](before/900x900-200-fold.jpg) | [Навигация](after/behaviour/900x900-200-fold.jpg) |
| Детайли | — | [Desktop projects](after/1440-detail.jpg), [tablet projects](after/768-detail.jpg), [mobile process](after/375-detail.jpg) |

## Taste inspector и визуален преглед

[Непроменен inspector отчет](taste-inspector.json): **2 FAIL, 3 WARN**, exit 1. Не се отчита като PASS:

| Находка | Причина за запазване |
| --- | --- |
| FAIL `still-page` | Два движещи се hero елемента. DESIGN.md изрично ограничава движението и забранява section reveals/квоти. |
| FAIL `eyebrow` при 768/375 | Евристиката разпознава задължителния временен image credit като label над следващото h2. Той остава под hero, както изискват договорът и честната attribution. |
| WARN `palette-cream` | Фиксираната mineral/clay палитра е приета с K06; skill-ът не я заменя. |
| WARN `no-footage` | Точно четири кадъра; видео е извън обхвата и motion договора. |
| WARN `name-only-title` при 768/375 | „Residential architecture.“ е видимо под KILN. Евристиката изисква 18px, докато приетият mobile body е 17px. |

Прегледани са всички осем крайни inspector fold/sheet изображения, както и предаваните before/after и целеви снимки. Запазена е посоката **The name as a monument**, seed **35**, без нов draw. Идеята е материалната маса на името да споделя първия екран с архитектурата; менюто и локалната демо форма са договореното live thing. Произходът на временните фотографии и Fontshare шрифтовете е в [temporary-assets.md](../temporary-assets.md); credits остават до изображенията и във footer-а.

ROUND 1 — преди прилагането
Seen in one second: KILN доминира над тесния архитектурен кадър.
Idea (one sentence): името е архитектурната маса между кадъра и жилищните концепции.
Live thing: меню и локална демо форма.
Layout words by section: hero=monument / projects=staggered / studio=text / services=columns / process=sheet / contact=split / footer=inverse-name.
Scores: design 6.5 · usability 8 · creativity 6 · content 7 → overall 6.9.
Caps applied: запазеният still-page от K05 ограничава общата оценка до 6.0.
Top three problems:
1. before/regression/1440-fold.jpg — името доминира; приложена е договорената по-голяма image площ и desktop intro отдясно.
2. before/regression/768-page.jpg — тесен Ridge и две колони; под 900px проектите вече са една колона с 3:2 кадри.
3. before/regression/1440-page.jpg — временни цветове/отстояния; приложени са точните роли и по-стегнатата секционна скала.

ROUND 2 — след прилагането
Seen in one second: архитектурен кадър, KILN и ясно действие към контактната секция.
Idea (one sentence): минералната основа и плътното име свързват материала с пространството за обитаване.
Live thing: проверени меню и локална демо форма.
Layout words by section: hero=image-name / projects=wall / studio=text / services=open-columns / process=sheet / contact=split / footer=inverse-name.
Scores: design 7 · usability 8 · creativity 6 · content 7 → overall 7.1, capped at 6.0.
Caps applied: оставащите inspector FAILs и идеята, приложима и за други студиа; субективна оценка, не независимо жури.
Top three problems / оставащи граници:
1. after/behaviour/regression/1440-page.jpg — временните фотографии са различни реални жилища; общата оригинална серия е K08–K09.
2. after/behaviour/regression/375-fold.jpg — временният двуредов credit заема площ; той е задължителен до замяната на изображенията.
3. after/behaviour/regression/1440-page.jpg — посоката е позната за архитектурни студиа; нови композиционни референции и финален audit са K10 и K12–K13.

## Повторно изпълнение и ограничения

От worktree-то след `npm ci` и `npm run build`, в отделен терминал:

```sh
npm exec -- serve out --listen 4197
```

После:

```sh
node scripts/check-k07.mjs http://localhost:4197
```

По подразбиране резултатите са в нова timestamp папка под `.taste-skill/checks/k07/`. За нов предаван комплект използвай `--out docs/k07/<new-run>`; не презаписвай before/after. Проверено с Chromium 155 на Windows. Safari, Firefox, screen reader, пълен WCAG и Lighthouse audit не са изпълнявани. 200% основен текст е конкретна reflow симулация, не всички browser zoom режими.

PR остава за човешко ревю и merge; задачата е In Review и чатът червен до приемането. Worktree-то остава налично за поправки в същия PR.
