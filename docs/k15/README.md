# K15 — частен деплой и предаване

[SIN-46](https://linear.app/singularity-lab/issue/SIN-46/k15-deploj-v-gpt-sites-i-predavane), 20 октомври 2026 г.

**Успешно публикувана версия 1:** [KILN Luxury Architects](https://kiln-luxury-architects.stoyanov-dann.chatgpt.site). Sites върна `status: succeeded`, без failure message. Достъпът остава само за собственика. Този отчет не променя приложението, asset файловете, hosting конфигурацията или аудиторията.

## Одобрена версия и произход

- K14 / [PR #16](https://github.com/danstoyanov/kiln-luxury-architects/pull/16) е слят.
- Необходимата focus поправка / [PR #17](https://github.com/danstoyanov/kiln-luxury-architects/pull/17) е слята от потребителя преди публикуване. [Предварителният отчет](pre-deploy-fix.md) запазва възпроизвеждането и проверката на поправката.
- Публикуван GitHub main: [`0ede8ff846620b6ae9fd99c4fd2410295ff43103`](https://github.com/danstoyanov/kiln-luxury-architects/commit/0ede8ff846620b6ae9fd99c4fd2410295ff43103).
- Sites source commit: `cf82d99ae512a199266696c58b9a73e80c9da38e`.
- Git tree и в двете хранилища: `00b6912a6adbaa399dc26922986113115408cd48`. Отделният Sites commit има различна история, но напълно еднакви tracked файлове с одобрения GitHub main.
- Site ID: `appgprj_6ad7a66712308191affa1a98c4525761`.
- Version ID: `appgprj_6ad7a66712308191affa1a98c4525761~appgver_fc48c78c86fc81918edd6ed87d9bb510`, номер **1**.
- Deployment ID: `appgdep_6ad7d00e20108191aa041b9d86fbc26a`; краен статус **succeeded**, върнат на `2026-10-20T20:33:53.516491+00:00` (23:33:53 Europe/Kyiv).
- Пълният безопасен snapshot, локалният archive SHA-256 и metadata за запазената версия са в [deployment.json](deployment.json). Native archive content hash се отнася до съхранения tar; локалният SHA-256 е за подадения tar.gz и е отделна стойност.

## Изграждане и публикуване

Използвано е същото управлявано worktree на SIN-46. Новият report клон `codex/sin-46-handover` започва от одобрения main. Deployment source е отделно копие чрез `git archive` от точния GitHub SHA, с отделен Git repository; GitHub origin остава непроменен и repository остава PRIVATE.

В deployment копието са изпълнени успешно `npm ci --no-audit --no-fund`, `npm run typecheck`, `npm run lint` и `npm run build` с Node 22.21.0 / npm 10.9.4. Проверен е самият `out/` през static server на порт 4261 с K11 и K09 преди native deploy. И двете проверки завършиха с exit 0, без създаване на снимки.

Официалният Sites source helper синхронизира source и подготви deployment архива. Първото директно `npm` стартиране през helper не се поддържаше от Windows spawn; typecheck/lint минаха чрез Node + npm CLI. Build helper-ът също срещна Windows npm shim проблем; production build мина директно през PowerShell. При финалното пакетиране успешните команди бяха пропуснати с `commands: []`, съгласно Sites workflow. Използван е наличният Git Bash в PATH и `TAR_OPTIONS=--force-local`, за да не се разчита C: като remote tar адрес. Няма промени по application source или plugin файловете.

Next.js предупреди за родителския lockfile извън отделния Sites repository; build използва локалното копие и завърши успешно. Няма промяна на turbopack конфигурацията. Няма Vinext/Worker миграция, runtime environment variables, backend, database или форма услуга.

Пакетът е проверен, остана непроменен и беше подаден заедно с verified Sites source SHA към `save_version_and_deploy_private`. `get_site_version` потвърди source SHA, version 1 и същия deployment ID. След успешния native резултат не е стартиран втори deploy.

## Проверки на хоствания сайт

Проведени са върху буквално върнатия production URL, с owner authentication само в паметта. Не е сменяна частната видимост и не е генериран/ротиран bypass token. Credentials не са записвани във файлове, Git, URL, shell аргументи или отчета.

- [Hosted K11](hosted-interactions.json): exit 0. На 375/768/1440px са проверени секционните anchor връзки, CTA, keyboard/Tab ред, Escape, външен клик и затваряне след избор. Проверени са error focus, hover/focus feedback и reduced motion. 10 round trips при 899/900px с normal/reduced motion завършват с правилния фокус; `responsiveFailures` е празен.
- Формата: празни/whitespace полета, невалиден email, валидно и повторно попълване; точното съобщение `Demo only — your enquiry has not been sent or saved.` и изчистване на полетата. За всеки viewport: 0 заявки по време на взаимодействието, 0 Storage/cookie/IndexedDB writes, празни хранилища и непроменен URL. Това проверява поведението на формата; не твърди, че първоначалното зареждане няма ресурсни заявки.
- [Hosted K09](hosted-assets.json): exit 0. Всичките 32 image файла връщат HTTP 200 и съвпадат по bytes/SHA-256. Четирите изображения са налични и декодирани, responsive WebP/JPEG работят, включително 375px DPR 2. Проверени са alt, demo disclosure, eager/lazy loading, intrinsic размери, aspect ratio/crops, рамки преди зареждане и липса на промяна на рамките при delayed responses. CLS е под зададения праг 0.001.
- В проверените viewport сценарии няма horizontal overflow, липсващи ресурси, console warnings/errors или runtime exceptions.
- [K11 runner](hosted-interactions-runner.json) и [K09 runner](hosted-assets-runner.json) потвърждават изключени screenshots. [QA wrapper](verify-without-images.mjs) замества само screenshot метода с no-op и задава authentication в паметта. Не променя assertions или application source. Нови изображения или снимки не са създавани по време на тази deployment фаза.

За повторение: от checkout на одобрения source с инсталирани зависимости и изграден `out/`, изпълни wrapper-а от report checkout-а:

```sh
node <report-checkout>/docs/k15/verify-without-images.mjs k11 <site-url> .taste-skill/new-hosted-k11 --auth
node <report-checkout>/docs/k15/verify-without-images.mjs k09 <site-url> .taste-skill/new-hosted-k09 --auth
```

`--auth` очаква JSON с token на скрит stdin, подаден програмно от agent memory; не го въвеждай като shell аргумент или записан файл. За локален static server пропусни `--auth`. Използвай нови output папки. Wrapper-ът не генерира снимки.

## Достъп, ограничения и приемане

След деплоя `get_site` потвърди live URL и версия 1, `current_user_role: owner`, `access_mode: custom`, един allowed owner, 0 други editors, групи или external visitors. Не са извиквани access update операции. Сайтът се отваря с акаунта на собственика; публичното споделяне остава отделно решение на потребителя.

Това са browser automation проверки в локален Chrome/Edge върху хоствания сайт. Не са тест с физически телефон, screen reader или ново визуално ревю чрез снимки. По потребителско указание няма нови изображения; layout е проверен чрез DOM/computed metrics. Предходните приети визуални ревюта остават в GitHub.

Кодът, оригиналите и промптовете на четирите ImageGen кадъра, оптимизираните WebP/JPEG файлове и лицензите остават в частното GitHub хранилище. Входът към предишните етапи е [README](../../README.md). Worktree-то се пази за ревюто на този report PR.

Деплой и hosted проверки са изпълнени. SIN-46 остава In Review и чатът е червен до потребителски merge на финалния report PR; след потвърден merge и изпълнени критерии може да се маркира Done.
