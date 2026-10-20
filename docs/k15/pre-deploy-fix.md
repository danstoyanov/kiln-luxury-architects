# K15 — поправка преди деплой

[SIN-46](https://linear.app/singularity-lab/issue/SIN-46/k15-deploj-v-gpt-sites-i-predavane), 20 октомври 2026 г.

Това е необходима поправка преди публикуване, а не финален отчет за деплой. K14 / [PR #16](https://github.com/danstoyanov/kiln-luxury-architects/pull/16) е потвърден като MERGED. Началният актуален `origin/main` е `794587126639190cafe00c95f7c0769a6bc69d5b`.

## Проблем и поправка

K14 документира загуба на keyboard focus при 900 → 899px. Възпроизведено е върху непроменения production export: след фокус върху desktop Studio и преминаване към compact навигация активният елемент става BODY вместо Menu. [Резултат преди поправката](focus-before.json): K11 exit 1, `responsiveFailures` съдържа провала.

Drawer-ът се скрива чрез visibility и inert, но неговите връзки все още имат layout boxes. Предишната blur проверка използва само getClientRects и изтрива запомнения контрол преди media обработчикът да може да възстанови фокуса. [Navigation.tsx](../../components/Navigation.tsx) вече проверява и computed visibility, и inert предшественик. Реално прехвърляне на фокус извън header продължава да изчиства запомнения контрол. При breakpoint media обработчикът може да насочи фокуса към видимия Menu бутон.

Няма промяна на CSS, layout, видими текстове, зависимости, hosting конфигурация или аудитория. Няма генерирани нови архитектурни изображения. По потребителско указание PR не включва снимки.

## Проверки

Node 22.21.0, npm 10.9.4; зависимости само в отделното управлявано worktree. Изпълнени са:

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm run build
npm exec -- serve out --listen 4260 --no-clipboard
```

В отделен терминал, срещу самия production `out/`:

```sh
node scripts/check-k11.mjs http://localhost:4260 --out .taste-skill/checks/sin46-before
# Горната команда е изпълнена ПРЕДИ поправката: exit 1.
node scripts/check-k11.mjs http://localhost:4260 --out .taste-skill/checks/sin46-after
node scripts/check-k09.mjs http://localhost:4260 --out .taste-skill/checks/sin46-images
node scripts/check-k11.mjs http://localhost:4260 --out .taste-skill/checks/sin46-final
```

- TypeScript, ESLint и production build: успешни. ESLint е изпълнен отново след разширението на regression проверката.
- [Финален K11 резултат](focus-after.json): успешен, exit 0. Проверени 375/768/1440px, клавиатура, Escape, затваряне при външен клик и избор на секция, видим focus feedback, празни полета, невалиден email, повторно валидно попълване и точното demo съобщение. 0 заявки при формата, 0 опити за browser storage/cookie/IndexedDB запис, празни хранилища и непроменен URL.
- [K11 скриптът](../../scripts/check-k11.mjs) вече прави 10 последователни round trips при 899/900px: по пет с normal и reduced motion. След затваряне focus е Menu; при връщане на desktop е Projects; независимо фокусирано form поле запазва фокуса. Няма `responsiveFailures`.
- [K09 резултат](export-images.json): успешен, exit 0. Проверени 32-та оптимизирани файла, SHA-256/bytes, четирите responsive WebP/JPEG изображения, alt/disclosure, размери и рамки, loading, CLS и delayed images на 375/768/1440px. Без липсващи ресурси, console грешки или horizontal overflow в проверените сценарии.
- JSON отчетите съдържат Git base SHA, working-tree-dirty индикатор и source/export hashes. След поправката base SHA още е `7945871`, а working tree е dirty; това описва тестваната непубликувана промяна, не одобрен нов main.
- Проверени са diff четимостта, `git diff --check` и локалните връзки в този отчет.

## Състояние на публикуването

`get_site` потвърди същия Site `appgprj_6ad7a66712308191affa1a98c4525761`: owner, custom owner-only access, без допълнителни viewers/editors/groups/external visitors. `latest_version_number: 0`, live/preview URL: null. GitHub repository остава PRIVATE. Не са извиквани save/deploy или access промени и не са записвани credentials в Git.

Деплой и проверки на хоствания сайт **още не са изпълнени**. Причината е изричното изискване в SIN-46 и [плана](../../IMPLEMENTATION_PLAN.md): всяка нужна промяна по сайта първо минава през PR и потребителски merge. Този PR е необходимата поправка; след сливането му се публикува новият одобрен `main` по [K14 процедурата](../k14/README.md#публикуване-в-k15-след-merge-на-този-pr).

След merge: обновяване на refs, потвърждаване на одобрения SHA, отделно Sites source копие, проверки на export без създаване на нови снимки, синхронизиране/пакетиране, частен деплой и проверка на хоствания сайт. Последващият PR ще съдържа само финалния отчет с буквално върнатите URL, GitHub/Sites SHA, version/deployment ID и краен статус.

Браузърните проверки тук са локални Chrome/Edge сценарии, не физически устройства или screen-reader тест. SIN-46 остава незавършена до успешен частен деплой, проверен hosted сайт и слят финален отчет.
