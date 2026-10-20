Method: dual-agent (A: `/root/impeccable_design` · B: `/root/impeccable_audit`), независими контексти, последователно изпълнение; синтез от `/root`.

# K12 — Финална оценка с Impeccable

[SIN-43](https://linear.app/singularity-lab/issue/SIN-43/k12-finalna-ocenka-s-impeccable), 20 октомври 2026 г. Оценен е непромененият static `out/` от `2046370b302363c52d25198de57ebe931676ebb0`, след потвърден merge на [K11 PR #12](https://github.com/danstoyanov/kiln-luxury-architects/pull/12). [Commit/hashes/build](run.json) · [произход](provenance.md) · [независима A оценка](assessment-a.md) · [независима B оценка](technical/assessment-b.md).

**Резултат:** coherent/product-specific implementation; **2 приети находки — P0: 0, P1: 1, P2: 1, P3: 0**. Няма основание за редизайн. K13 трябва да поправи достъпното име на home връзката и видимостта на етикета при фокус към грешка. K12 добавя само доклад и доказателства; не поправя сайта, не започва K13 и не публикува.

## Critique — 27/32, Good

KILN има конкретна идентичност: геометричен знак, минерална палитра, архитектура в човешки мащаб и различни секционни композиции. Hero споделя първия екран със знака и CTA; desktop проектната стена преминава в четим мобилен ред. Няма повтарящи се декоративни cards, измислени награди или подвеждащо доставено запитване. Най-полезното подобрение е запазване на контекста при взаимодействие.

| Nielsen heuristic | Синтез /4 | Основание |
| --- | --- | --- |
| Visibility of system status | 3 | Ясни Menu/Close, errors и демо статус; F-02. |
| Match system / real world | 4 | Разбираеми проекти, услуги и процес. |
| User control and freedom | 3 | Anchor навигация и предвидимо затваряне. |
| Consistency and standards | 3 | Последователен дизайн; F-01 нарушава label/name съответствието. |
| Error prevention | 3 | Required labels и демо указания. |
| Recognition rather than recall | 4 | Видими действия и достатъчен контекст. |
| Flexibility and efficiency | n/a | Едностранично портфолио; експертни ускорители не са нужни. |
| Aesthetic and minimalist design | 4 | Изображенията и типографията водят. |
| Error recovery | 3 | Конкретни грешки, запазен невалиден вход, F-02. |
| Help and documentation | n/a | Прост flow с контекстни указания. |
| **Общо** | **27/32 — 84.4%, Good** | A самостоятелно даде 28/32; синтезът намалява consistency с 1 след F-01 от parent. |

Когнитивно натоварване: low, 1/8 checklist failures — петте познати навигационни опции са единствената група над четири; не оправдават ново меню. Няма memory bridge или принудително превключване между екрани. Емоционалният път е архитектура → различни концепции → спокоен текст → тъмен Process → честна демо форма → завършващ знак. Няма значителна долина, която изисква ново съдържание.

## Audit — 17/20, Good

| Измерение | /4 | Извод и граница |
| --- | --- | --- |
| Accessibility | 3 | Добър контраст, структура и keyboard flow; F-01/F-02 остават. Не е пълна WCAG сертификация. |
| Performance | 3 | Локални responsive ресурси и три lazy images; няма измерени Web Vitals/slow network. |
| Responsive | 3 | 375/768/1440 и допълнителен 320px reflow; zoom/text spacing не са изпълнени. |
| Theming | 4 | Последователни tokens в договорената светла тема. Dark mode не е изискване. |
| Implementation integrity | 4 | Продуктова система, честен demo flow, без излишни зависимости. |
| **Общо** | **17/20** | Същият ограничен score като B; финалният списък допълва B с A/parent доказателства. |

[Impeccable detector](technical/detector.json), `detect --json app components`: **0 findings**, няма rule names/locations или false positives за отхвърляне. Това не е пълен accessibility scanner: той пропуска F-01; F-02 е установена във визуалния преглед. Независимият B не потвърди дефект в своя ограничен обхват; синтезът не представя този резултат като общо „няма проблеми“.

## F-01 — P1: достъпното име на home връзката не съдържа видимия текст

- **Място:** [components/Navigation.tsx:93](../../components/Navigation.tsx#L93), всички ширини.
- **Доказателство:** [жив DOM и AX](home-label.json), [снимка](visual/home-label.png). Видимото `Luxury Architects` е заменено с `aria-label="KILN home"`; accessibility tree също показва `KILN home`.
- **Ефект/стандарт:** потребител с гласово управление не може надеждно да използва видимия надпис като команда. Това нарушава [WCAG 2.5.3 Label in Name, Level A](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) и пречи на AA съответствие. Няма заявен тест с реално speech-control приложение.
- **Поправка в K13:** включи целия видим текст в accessible name, напр. `Luxury Architects — KILN home`, или остави native името от текста. Запази видимия copy и `href="#main"`; промяната не изисква нов визуален дизайн. Команда: `$impeccable harden`.
- **Приемане:** при 375/768/1440 DOM/AX accessible name съдържа `Luxury Architects`; Tab показва фокус; Enter продължава да фокусира main; Menu/anchor regression остава успешен.

## F-02 — P2: фокусът към грешка скрива етикета над мобилния екран

- **Място:** [components/EnquiryForm.tsx:44](../../components/EnquiryForm.tsx#L44), автоматичният `.focus()` след render на errors.
- **Доказателство:** [375×812, празен submit](visual/a/375-errors.png): Name input е до горния ръб, а `Name (required)` е над viewport. Грешката и outline са видими; flow не е блокиран. Източник A-01.
- **Ефект:** Casey/Sam губят визуалното групиране label–control–error и трябва да превъртят или да възстановят контекста от грешката. Това е usability находка; не се твърди отделно доказано WCAG нарушение.
- **Поправка в K13:** запази focus-after-render и ARIA връзките, но осигури scroll позиция към целия field wrapper. Използвай preventScroll плюс целево позициониране или подходящ scroll margin; при reduced motion няма анимиран scroll. Команда: `$impeccable harden`.
- **Приемане:** празна форма и първа грешка поотделно в Name/Email/Message на 375/768/1440. Когато височината позволява, label, фокусираният контрол и error са едновременно видими. Провери и 375×812 с клавиатура; не добавяй focus trap или ново движение.

## Успешни проверки и доказателства

| Проверка | Текущ резултат |
| --- | --- |
| Production основа | `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build` — успешни; преглеждан е самият `out/` през static server на 4230. |
| 375 / 768 / 1440 | Цялата страница е прегледана; без хоризонтално преливане, счупени изображения или наблюдавани застъпвания. Допълнителен 320px reflow е успешен. |
| Клавиатура | Реални Tab/Enter/Escape: Skip to content, Menu, Projects, затваряне/връщане на фокус, anchor target; Enter активира формата. |
| Форма | Празни полета, невалиден email, корекция и валиден примерен вход; видими labels, aria-invalid/describedby, фокус към първа грешка; полетата се изчистват при валиден вход. |
| Точен статус | `Demo only — your enquiry has not been sent or saved.`; role=status и aria-atomic. |
| Контраст | [Computed pairs](technical/contrast.json): основен 12.67:1, limestone 10.86:1, muted 5.67:1, CTA 5.64:1; нормалните измерени текстове над 4.5:1. Hover 7.62:1 от token/source проверка. |
| Семантика/ресурси | Един h1, h2/h3 йерархия, четири различни concept alt текста; fonts/images loaded; hero eager/high priority и три lazy images с размери/srcset. Console warning/error reads: `[]`. |

[Измервания](technical/browser-measurements.json) · [A desktop fold](visual/a/1440-fold.png) · [A tablet fold](visual/a/768-fold.png) · [A phone fold](visual/a/375-fold.png) · [desktop page](visual/a/1440-page.png) · [tablet page](visual/a/768-page.png) · [phone page](visual/a/375-page.png) · [menu](visual/a/375-menu.png) · [точен статус](visual/a/375-complete.png) · [независими B снимки](technical/screenshots/).

Персони: Jordan разбира категорията и демо статуса; Casey среща F-02; Sam/speech-input потребител среща F-01 и визуалния контекст на F-02; Riley преминава през празен, невалиден и валиден вход без счупен flow.

## Непроведени проверки и запазени ограничения

- **Reduced motion:** проверен е source договорът (`auto` scroll, без transforms/animations/transitions и no-preference guards). Текущ live тест не е изпълнен — браузърният инструмент не предлага media emulation. Предишният [K11 motion/privacy отчет](../k11/README.md) е историческо доказателство за същия production код, не нов K12 PASS.
- **Network/storage:** текущото поведение е потвърдено чрез source (preventDefault, local validation/reset, без send/save операции). Няма текущо runtime interception за network, local/session storage, cookies или IndexedDB. Не се твърди „0 заявки/записи измерени в K12“.
- **Zoom/text spacing и точна breakpoint граница:** няма поддържана инжекция/zoom emulation; 200% текст/spacing не са тествани. При номинални 899px B получи противоречиви innerWidth/matchMedia данни — exact 899/900 резултатът е inconclusive, без да е обявен за дефект. Основните три ширини работят.
- Няма реален screen reader/speech control, Safari/Firefox, Lighthouse, throttling, CLS/LCP/INP trace, no-JS или hosted-site тест. Натоварените изображения са видени без видим скок в ограниченото наблюдение; количествена CLS гаранция не се дава. Native master 1536px остава известният таван за детайл.
- Overlay/live-server са пропуснати поради read-only evaluate и липса на mutable injection API. Няма потребителски overlay; fallback са CLI JSON, DOM/AX, computed styles и снимки.
- A-02 за ↗ остава само предложение: [DESIGN.md](../../DESIGN.md), раздел 6, изрично я запазва. Няма приета P3 находка и няма препоръка за тиха промяна на идентичността. Няма detector false positives; историческите Taste сигнали не са текущ Impeccable резултат.

## Предаване към K13

Поправи F-01, после F-02 с `$impeccable harden`; изпълни конкретните acceptance retests и финален `$impeccable polish`, без нови секции, copy claims или изображения. Повтори TypeScript/ESLint/build и static `out/` прегледа на трите ширини. Довърши непроведените live reduced-motion, zoom/text-spacing и network/storage проверки с подходящ инструмент; ако остават недостъпни, запиши ограничението отново. Не представяй този доклад като разрешение за деплой с нерешен F-01.

За локално повторение от свое worktree: `npm ci`, `npm run build`, после `npm exec -- serve out --listen 4230 --no-clipboard`. Използвай нови evidence директории, без презаписване на K12. Двете изолирани оценки са със Sol 6.1 / Medium, разрешени от потребителя специално за Impeccable.

Questions skipped: 2 Priority Issues; K12 е доклад за отделния K13 етап, а обхватът и приоритетите са определени от задачата.
