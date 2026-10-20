# K14 — подготовка за GPT Sites

[SIN-45](https://linear.app/singularity-lab/issue/SIN-45/k14-podgotovka-za-gpt-sites), 20 октомври 2026 г.

Регистриран е частен, непубликуван **KILN Luxury Architects** Site. Единствената hosting промяна е [`.openai/hosting.json`](../../.openai/hosting.json): реалният `project_id` и `static.directory: "out"`. Next.js вече използва `output: "export"` в [next.config.ts](../../next.config.ts); няма промяна в application source, зависимости или дизайна.

## Регистрация и достъп

- Site ID: `appgprj_6ad7a66712308191affa1a98c4525761`
- Slug: `kiln-luxury-architects`
- `get_site` потвърждава `current_user_role: owner`, `access_mode: custom`, един allowed user с роля owner, без други потребители, editors, групи или external visitors.
- `latest_version_number: 0`, `current_live_url: null`, `current_preview_url: null`; няма публикувана версия. `status: active` е статус на регистрирания проект, не на deployment.
- Не са извиквани save/deploy операции или промени на достъпа. Не е заявено publish-on-push. URL за бъдещия сайт не е доказателство за деплой и не се предполага от slug-а.
- В Git са само идентификаторът и static конфигурацията. Credentials се обработват само в паметта на изпълняващия агент; не се записват в manifest, файлове, shell аргументи или отчет.

Началният GitHub commit е `3b9b282c529ac6b4538bd3b91fbe5122dd3675f0` от актуалния `origin/main`, включващ [SIN-44 / PR #14](https://github.com/danstoyanov/kiln-luxury-architects/pull/14) и [SIN-47 / PR #15](https://github.com/danstoyanov/kiln-luxury-architects/pull/15). И двата PR-а са потвърдени като MERGED. GitHub repository остава PRIVATE; `origin` остава `https://github.com/danstoyanov/kiln-luxury-architects.git`.

## Build и локална проверка

Node `22.21.0`, npm `10.9.4`. В новото worktree:

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm run build
npm exec -- serve out --listen 4250 --no-clipboard
```

В друг терминал:

```sh
node scripts/check-k11.mjs http://localhost:4250
node scripts/check-k09.mjs http://localhost:4250
```

K11 проверява менюто, клавиатурата, формата, reduced motion и липсата на заявки/запис; K09 проверява responsive изображенията, 32-та export ресурса и подредбата на 375/768/1440px. Новите резултати се записват под игнорираната `.taste-skill/checks/`; историческите отчети остават непроменени. Сървърът обслужва само production `out/`, не `next dev`. Спира се с Ctrl+C.

Резултати от изпълнението:

- TypeScript, ESLint и production build: успешни. ESLint е повторен след промяната в QA скрипта. Export-ът съдържа out/index.html.
- K09: успешен; 32-та файла съвпадат по bytes/SHA-256, WebP/JPEG responsive варианти, рамки, disclosure, layout shift и delayed images са проверени. Виж JSON отчета в тази папка.
- K11: **неуспешен общ резултат**, exit 1. При фиксирани 375/768/1440px минават клавиатура, Escape/външен клик/затваряне след избор, формата с празни полета, невалиден email и повторно валидно попълване, error focus, hover/focus и reduced motion. При формата има 0 заявки, 0 storage/cookie/IndexedDB writes, празно хранилище и непроменен URL. [Пълният отчет](interaction-checks.json) запазва както тези резултати, така и провала.
- Потвърден съществуващ дефект в слетия SIN-47 код: при desktop → compact (900 → 899px), след фокус върху Studio, понякога активният елемент става BODY вместо Menu. Възпроизведено и с отделна диагностична сесия; не е само остаряло очакване. Намалява keyboard focus continuity при resize. Поправката е нужна преди публикуване в K15 и трябва да мине през GitHub PR и merge.
- Историческият K11 скрипт първо спираше на стария Tab ред: текущото компактно меню вече започва с home връзка, а Shift+Tab от Menu води към Skip to content. Очакванията са актуализирани без application промяна. Breakpoint assertion-ите са запазени; грешките се събират, за да приключат другите проверки, записват се в JSON и командата пак завършва с exit 1.
- Hosting JSON, локалните документни връзки и diff-ът са проверени; няма credentials в добавените файлове. [Безопасен snapshot на Sites състоянието](site-state.json) съдържа само разрешените metadata полета.

## Публикуване в K15 след merge на този PR

Това е инструкция за следващия етап, не отчет за извършен деплой. K14 приключва след потребителско ревю и merge; K15 се стартира отделно от потребителя.

1. Обнови remote refs и потвърди merge на SIN-45. Вземи точния одобрен GitHub `origin/main` SHA и чисто worktree за K15. Прочети актуалния Sites skill и запази GitHub SHA за отчета.
2. Прочети `.openai/hosting.json`. Използвай същия `project_id`; не регистрирай нов Site. Извикай `get_site`, потвърди owner-only достъпа и запази тази аудитория. Ако има вече започнат деплой, първо установи неговото състояние.
3. Подготви отделна локална папка за Sites source. Копирай точно одобрените tracked файлове от GitHub commit-а (например чрез `git archive` и разархивиране). Не пренасяй `.git`, credentials, `node_modules`, build output или локални QA файлове. Не стартирай Sites source helper-а в GitHub worktree: той управлява собствен Git remote и commits.
4. В deployment копието изпълни `npm ci`. Получи нова краткотрайна credential чрез `create_source_repository_write_credential` за същия Site, без publish-on-push. Предай целия върнат credential object само през скрит stdin на Sites helper-а. Не го копирай в shell команда, файл или Git URL.
5. Използвай `scripts/site-workflow.mjs --project-id <точния ID>` от инсталирания Sites plugin в deployment копието. Стартирай го в retained terminal с `tty: true`; след `Ready for Site workflow JSON on stdin (input is hidden).` подай newline-terminated JSON object с `credential`, абсолютен `archivePath` и ordered `commands`: typecheck, lint, после `node <plugin-root>/scripts/build-site.mjs`. Последният използва съществуващия npm build, който създава `out/`. Следвай актуалния skill за точните аргументи и пренеси целия предходен `source` result, ако има такъв. Helper-ът синхронизира source и връща verified `project_id`, `commit_sha`, `archive`.
6. Преди native save/deploy обслужи получения `out/` със static server и повтори проверките на менюто, формата и изображенията. Не променяй архивa след packaging. Свери source файловете с одобрения GitHub commit; Sites `commit_sha` може да е различен заради отделното source repository. Запиши и двата SHA, без да ги смесваш. Ако е нужна промяна по сайта, първо GitHub PR и merge, после нов export и пакет от одобрения код.
7. Само в K15: за потвърдения owner-private Site предай verified `project_id`, Sites `commit_sha` и `archive` директно на `save_version_and_deploy_private`; ако не е наличен — `save_site_version`, после `deploy_private_site_version` за върнатата saved version. Не променяй достъпа на public. При нетерминален статус следи съществуващия deployment до краен резултат, без дублиране.
8. Провери хоствания сайт и запиши буквално върнатите URL, version ID, deployment ID/статус и GitHub SHA. Последващият PR е само отчетът за предаване. Публичното споделяне остава отделно решение на потребителя.

Не са нужни Vinext starter, Worker, runtime environment variables, база данни, bindings или външна услуга за формата. Статичният export и съществуващите локални ресурси са достатъчни.

## Ограничения и приемане

Hosting конфигурацията определя Site идентичността и static output; частният достъп се потвърждава отделно през Sites API. Този етап не проверява хостван сайт, защото публикуване още няма. Проверките в браузър са върху локалния export и не са тест на физически телефон. Приемането на SIN-45 изисква merge от потребителя; до тогава задачата остава In Review и чатът е червен.
