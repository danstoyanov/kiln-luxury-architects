# SIN-47 — потребителско дизайн ревю

## Седма ревизия — bold заглавия и подравнени service икони

Всички Manrope заглавия и „Luxury Architects“ вече са weight 700. Официалният CSS за Manrope 500–700 сочи същия локален variable asset; @font-face е актуализиран без синтетичен bold или нов font download. Services групира иконата и заглавието в общ подравнен блок, без вертикалния offset на иконата. Няма нови скрийншоти или визуално ревю от агента.

## Шеста ревизия — tablet като phone

Центрираната Menu капсула, identity в разгънатия панел, анимацията и избутването на изображението вече са еднакви при всички ширини под 900px. Бутонът Menu/Close има graphite фон с 8% opacity и graphite текст вместо плътно черно. Desktop навигацията е запазена. TypeScript, ESLint и static build минаха. Техническите phone/tablet DOM проверки са в [compact-motion-checks.json](compact-motion-checks.json); няма скрийншоти или визуално ревю от агента.

## Пета ревизия — плавно меню, изображение под него и скрита skip връзка

Поправена е подаващата се бяла skip връзка: изнесена е извън glass контейнера и се показва само при клавиатурен focus-visible. Телефонното меню се разгъва/прибира за 320ms в нормалния поток; отвореният панел избутва изображението изцяло под себе си. Затворените връзки са inert и анимацията е изключена при reduced motion.

TypeScript, ESLint и production build минаха. Техническите DOM измервания при 375px потвърждават междинно положение при отваряне/затваряне, image top след header bottom, възстановяване на началната позиция, inert и reduced motion: [JSON](phone-motion-checks.json). Няма скрийншоти или визуално ревю от агента. Повторение: `node scripts/check-phone-navigation.mjs` при локален export на порт 3001.

## Четвърта ревизия — компактно телефонно меню

Под 600px затвореното меню е центрирана glass капсула само с Menu. Отварянето показва Close, после „Luxury Architects“ и вертикалните връзки с разстояние след името. Desktop и tablet стиловете са запазени. Добавено е прехвърляне към видим контрол при преход през телефонния breakpoint; desktop фокусът от Menu продължава към Projects. Няма скрийншоти или ново визуално ревю от агента. Старите K11/K13 тестове за втория Tab като home връзка не описват новия телефонен ред: home е достъпна след отваряне на Menu.

## Трета ревизия — KILN на един ред

По потребителска бележка двата KILN надписа вече използват общ `FittedWordmark`: измерва реалната ширина на целия текст спрямо контейнера и при нужда намалява font-size. Буквите остават на един ред, без изрязване или деформиране. Размерът се обновява при resize, увеличен текст и зареждане на шрифта. Това заменя предишното разрешено пренасяне на знака при увеличено spacing.

`typecheck`, ESLint и production build минаха. `node scripts/check-wordmark-fit.mjs http://localhost:3001` проверява DOM размерите при 320/375/663/768/900/1440px, стандартен и 200% root текст с увеличено letter/word spacing. [Измервания](wordmark-checks.json). Няма нови скрийншоти; визуалното приемане е от потребителя в браузъра.

## Текуща ревизия — по-четим шрифт и по-прозрачно стъкло

След второто потребителско ревю: Manrope 500–600 заменя Bodoni Moda за всички заглавия и identity. Glass opacity намалява от 86% на 64%, blur от 22px на 16px. Проверени `typecheck`, `lint` и production build. Потребителят изрично поиска директно локално ревю без нови скрийншоти; снимките и browser отчетите по-долу са от първата ревизия и не представят новия шрифт като проверен. Актуалните стойности са в DESIGN.md, раздел 13.

Новият self-hosted Manrope Latin WOFF2 е 24,836 bytes, SHA-256 `a30ddcd349703aff7464c34bef3fffdff405ee50c113440d7c8693c02d210972`. [Официален asset](https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSg.woff2), [локален OFL лиценз](../../public/fonts/Manrope-OFL.txt). Старият Bodoni asset и лиценз остават като произход за първото ревю; не се preload-ват и не се използват в CSS.

## Първа ревизия — исторически доказателства

[Linear задача](https://linear.app/singularity-lab/issue/SIN-47/dizajn-revyu-glass-navigaciya-tipografiya-i-sekcii). Основа: `cd5ea20`, слетият PR #14 за SIN-44. Отделно worktree и клон `codex/sin-47-design-review`.

## Какво се промени

- Glass навигация над архитектурния кадър: светла прозрачност, blur, светъл ръб и мека сянка. Панелът расте с менюто и текста; няма fixed слой над секциите. Без поддръжка на blur или при reduced transparency използва плътен фон.
- Bodoni Moda за „Luxury Architects“ и всички h2/h3. Panchang остава знакът KILN, Switzer — четимият основен текст и контролите.
- Studio: intro и две именувани теми с икони; Services: три отворени реда; Process: четири етапа върху общото тъмно поле, без предишния светъл лист.
- Девет малки outline SVG икони, нарисувани в проекта. Не носят самостоятелно значение и са скрити от accessibility tree. Няма нова JavaScript зависимост.

Текстовете, четирите изображения, CTA, anchor IDs, мобилното меню и локалната демо форма са запазени. Добавените две Studio подзаглавия обобщават съществуващия текст. Точните нови роли и изключения са в [DESIGN.md, раздел 13](../../DESIGN.md#13-sin-47--потребителско-дизайн-ревю-преди-деплой).

## Преди / след

Преди: последният main `cd5ea20`, обслужван от development сървъра на порт 3000. След: новият production static export на порт 3001. Всички кадри са при стандартен текст, с reduced motion за стабилно сравнение. Отделните interaction проверки обхващат и normal motion.

| Изглед | Преди | След |
| --- | --- | --- |
| Desktop 1440×900 | [Първи екран](before/1440-fold.jpg), [цяла страница](before/1440-page.jpg) | [Първи екран](after/1440-fold.jpg), [цяла страница](after/1440-page.jpg) |
| Ширина на потребителските бележки 1063×738 | [Първи екран](before/1063-fold.jpg), [Studio](before/1063-studio.jpg), [Services](before/1063-services.jpg), [Process](before/1063-process.jpg) | [Първи екран](after/1063-fold.jpg), [Studio](after/1063-studio.jpg), [Services](after/1063-services.jpg), [Process](after/1063-process.jpg) |
| Tablet 768×1024 | [Първи екран](before/768-fold.jpg), [цяла страница](before/768-page.jpg) | [Първи екран](after/768-fold.jpg), [цяла страница](after/768-page.jpg) |
| Phone 375×812 | [Първи екран](before/375-fold.jpg), [цяла страница](before/375-page.jpg) | [Първи екран](after/375-fold.jpg), [цяла страница](after/375-page.jpg), [меню](after/375-menu.jpg), [плътен fallback](after/375-solid-fallback.jpg) |

## Проверки

- `npm run typecheck`, `npm run lint`, `npm run build`: PASS. Next.js създава статичния `out/`.
- `node scripts/check-sin47.mjs http://localhost:3001 docs/sin47/after`: PASS на 375, 768, 1063 и 1440 px — няма хоризонтално преливане, отрязани заглавия или счупени изображения; проверени Bodoni роли, 9 икони, blur и reduced-transparency fallback. [JSON](after/checks.json).
- `node scripts/check-k11.mjs http://localhost:3001`: PASS — keyboard меню, Escape, фокус на 899/900px, anchors, корекция на form грешки, точен demo статус и reduced motion. Няма заявки или опити за запис при демо формата. [JSON](interaction-checks.json).
- `node scripts/check-k13.mjs http://localhost:3001`: PASS — достъпно home име, видими label/поле/грешка, normal/reduced motion, 375×420 viewport, 200% root текст с увеличени spacing стойности. [JSON](fix-checks.json).
- Impeccable `detect --json` върху петте променени UI файла: `[]`, без находки.

Проверки на реален браузър чрез фиксирания проектен Chrome/Edge CDP помощник. Няма ново твърдение за Safari/Firefox, физическа мобилна клавиатура или hosted-site проверка. Glass е CSS интерпретация на заявения стил, без GPU displacement/refraction и нова анимация.

### Taste инспекция и изключения

[Първоначален отчет](taste-initial.json): един фалшив FAIL — hero CTA “Discuss your project” е класифициран като eyebrow към следващата секция “Living studies”. В markup това е работеща връзка в hero, а не етикет над h2. Запазваме изрично изискания CTA. Предупреждението `name-only-title` също е фалшиво: “Residential architecture.” е видимо в първия екран, но е с договорените 17px под 900px, под евристичния праг на инспектора. `palette-cream` сочи вече приетия минерален фон #F2F1ED.

Финалната инспекция допуска тези три конкретни сигнала, както и документално приетите glass ръб/сянка/pill, глинен CTA, брандов знак като трето семейство, умерено движение и липса на видео. Не се изключват проверки за overflow, contrast, broken-image, скрито съдържание или фокус. [Финален отчет](taste-final.json).

Финален резултат: 0 FAIL / 0 WARN с описаните изключения. Source lint на Taste отчита 2 FAIL за shadow и 7 WARN за glass/outline — всички в Navigation.module.css, включително декларациите за изключване на ефектите в fallback/forced-colors. Това са очаквани сигнали от правилото срещу изрично заявения glass ефект; не са ESLint грешки и не са представени като чист source lint.

### Визуална оценка

```text
ROUND 1 — завършената промяна
Seen in one second: архитектурна фотография, стъклена навигация и геометричен KILN.
Idea (one sentence): геометричният знак и минералната архитектура получават контраст от редакционен serif и светло стъкло.
Live thing: достъпно мобилно меню и честна локална демо форма.
Layout words by section: hero=image/name / projects=editorial wall / studio=statement/notes / services=open rows / process=dark stages / contact=split / footer=name.
Scores: design 7 · usability 8 · creativity 7 · content 8 → overall 7.4.
Caps applied: сдържаното движение остава договорено; познатата редакционна посока ограничава creativity до 7.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. 375-menu.jpg: отвореното меню измества hero надолу. Преднамерено disclosure в потока, за да расте с текста; запазено вместо overlay.
2. 1440-page.jpg: подходът е редакционен, без нова уникална интеракция. Запазено по обхвата на задачата.
3. 1063-studio.jpg: въведените подзаглавия са интерпретация на текущото съдържание. Показани за човешко ревю преди merge.
```

Няма установен видим дефект, изискващ допълнителна промяна след първия batched преглед. Вторият инспекторен рунд потвърждава финалния export с горните изключения, без допълнително полиране.

## Font

Bodoni Moda, Owen Earl / The Bodoni Moda Project Authors, SIL Open Font License 1.1. Източник: [Google Fonts metadata](https://github.com/google/fonts/blob/main/ofl/bodonimoda/METADATA.pb). [Локален лиценз](../../public/fonts/BodoniModa-OFL.txt).

Файлът `bodoni-moda-latin-variable.woff2` е Latin subset, нормален стил, weights 400–600, optical size 6–96; 46,260 bytes. Изтеглен от [официалния Google Fonts asset](https://fonts.gstatic.com/s/bodonimoda/v28/aFTQ7PxzY382XsXX63LUYJSKSKg.woff2) чрез CSS2 заявка за тези оси. SHA-256: `c032219ef636f7b4932f7d1dc91bdab602c970f090770b546bea4effaab3463c`. Лицензът на оригиналните Panchang/Switzer е запазен.

## Повторение

В своето worktree: `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`. Стартирай `npm exec -- serve out --listen 3001 --no-clipboard`, после трите browser команди по-горе; за нови снимки избери друга output директория. Запази старите before/after доказателства. Нужни са Node 22 и локален Chrome/Edge.

Задачата очаква човешко ревю и merge. SIN-45 е блокирана от SIN-47; няма деплой.
