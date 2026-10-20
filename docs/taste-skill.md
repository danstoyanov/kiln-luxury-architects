# Taste Skill за KILN

Подготовка за [SIN-34 / K03](https://linear.app/singularity-lab/issue/SIN-34/k03-podgotovka-na-taste-skill), 20 октомври 2026 г. Това е инструмент за K04; тук не се избира дизайн и не се променя страницата.

## Къде е и коя версия използваме

- Skill: `design-taste-frontend`, вход [SKILL.md](../.agents/skills/design-taste-frontend/SKILL.md).
- Източник: [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill).
- Точен commit: [`63aba5f43b5056758b15bbe7d683da8c86a7a7ad`](https://github.com/Leonxlnx/taste-skill/tree/63aba5f43b5056758b15bbe7d683da8c86a7a7ad).
- Upstream папка: `skills/taste-skill`; локална: `.agents/skills/design-taste-frontend/`.
- Всичките 38 upstream файла са копирани без промени, включително scripts, references, library и assets. Добавен е само [MIT LICENSE](../.agents/skills/design-taste-frontend/LICENSE) от корена на същия commit.
- [taste-skill-source.json](../taste-skill-source.json) записва източника, commit-а, инсталатора и SHA-256 за всички 39 файла. `.gitattributes` запазва байтовете им и при Windows checkout.

Копието е в Git: следващият агент няма нужда от глобална инсталация или мрежа за прочит и draw. Codex открива проектни skills в `.agents/skills/` при следващ ход/нова сесия с това worktree като работна папка. Ако каталогът не го показва, отвори директно горния SKILL.md и свързаните файлове. Не актуализирай автоматично от `main`.

## Инсталация и възпроизвеждане

Използван е вграденият Codex `skill-installer`, Python 3.14 и download методът. Командата е изпълнена от корена на worktree с празна целева папка (PowerShell):

```powershell
$codexRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
$installer = Join-Path $codexRoot 'skills/.system/skill-installer/scripts/install-skill-from-github.py'
python $installer --repo Leonxlnx/taste-skill --path skills/taste-skill --ref 63aba5f43b5056758b15bbe7d683da8c86a7a7ad --dest .agents/skills --name design-taste-frontend --method download
Invoke-WebRequest 'https://raw.githubusercontent.com/Leonxlnx/taste-skill/63aba5f43b5056758b15bbe7d683da8c86a7a7ad/LICENSE' -OutFile '.agents/skills/design-taste-frontend/LICENSE'
node scripts/verify-taste-skill.mjs
```

Инсталаторът отказва да презаписва съществуваща папка. Той не създава `skills-lock.json`; такъв файл не е генериран или премахван. `taste-skill-source.json` е отделен provenance manifest, а не lockfile на `npx skills`. Няма npm зависимости за skill-а.

Независимо възпроизвеждане без Codex installer: изтегли същия Git commit в нова временна папка, копирай upstream папката и лиценза и сравни с manifest-а. Изпълни от корена на проекта; изисква Git, Node и мрежа. Всяко изпълнение създава нова папка и не презаписва инсталираното копие:

```powershell
$ErrorActionPreference = 'Stop'
$reproRoot = Join-Path '.taste-skill' ('reproduce-' + [guid]::NewGuid().ToString('N'))
$clonePath = Join-Path $reproRoot 'upstream'
$skillPath = Join-Path $reproRoot 'design-taste-frontend'
New-Item -ItemType Directory -Path $reproRoot -Force | Out-Null
git clone --no-checkout https://github.com/Leonxlnx/taste-skill.git $clonePath
if ($LASTEXITCODE -ne 0) { throw 'Clone failed' }
git -C $clonePath -c core.autocrlf=false checkout --detach 63aba5f43b5056758b15bbe7d683da8c86a7a7ad
if ($LASTEXITCODE -ne 0) { throw 'Checkout failed' }
Copy-Item -LiteralPath (Join-Path $clonePath 'skills/taste-skill') -Destination $skillPath -Recurse
Copy-Item -LiteralPath (Join-Path $clonePath 'LICENSE') -Destination (Join-Path $skillPath 'LICENSE')
node scripts/verify-taste-skill.mjs $skillPath
if ($LASTEXITCODE -ne 0) { throw 'Verification failed' }
```

При нужда от възстановяване използвай провереното копие в нов checkout. Не изтривай локални промени. При умишлен upgrade прегледай новите инструкции, обнови commit-а и хешовете с отделен PR.

## Употреба в K04

1. Прочети Linear задачата, `AGENTS.md`, `brief.md` и `DESIGN.md`, ако вече съществува. Първоначалният план и архивите по етапи се пазят само локално и не са задължителни за нов clone. После прочети целия SKILL.md и необходимите references.
2. От корена на worktree изпълни `node scripts/verify-taste-skill.mjs` и използвай skill-а за аргумент, текстове и композиция на KILN. При изрично посочване в промпт: „Използвай $design-taste-frontend за SIN-35, според docs/taste-skill.md и ограниченията на KILN.“
3. Пример за разглеждане на три посоки (не избира посока и не създава сайт):

```sh
node .agents/skills/design-taste-frontend/scripts/draw.mjs --list sectors
node .agents/skills/design-taste-frontend/scripts/draw.mjs --sector architecture --brief "KILN fictional residential architecture studio" --sections work,about,features,how-it-works,contact,footer --tone luxury --keep palette --options 3 --seed 34
```

Избери подходяща посока според brief-а; изпълни същата команда без `--options 3`, с `--direction <chosen-id>`. Запиши seed, посока и обосновка в отчета на K04. `--keep palette` запазва началната проектна палитра; след K06 използвай `--keep palette,type` за приетата идентичност. Не твърди наличие на собствени фотографии чрез `--have photography`, преди да има такива.

Локалните direction sheets, downloads и screenshots са в игнорираната `.taste-skill/`. Предай избраните решения и нужните доказателства в Git документите на съответния етап; не разчитай следващо worktree да наследи игнорирани файлове.

## Правила на KILN с предимство

- Next.js App Router, strict TypeScript, CSS Modules, глобални CSS променливи и static export. Не копирай автоматично JS/CSS helpers и не добавяй друга framework/styling зависимост.
- Финалните изображения са точно четирите ImageGen кадъра в K08–K09. Външните колекции, допълнителното видео и минимумът от повече изображения в skill-а не са изискване на KILN. Временни кадри в K04 имат документиран източник и лиценз и после се заменят.
- Запази топлия светъл фон, графитния текст и приглушения глинен акцент от brief-а, после приетия DESIGN.md. Забрана на подобна палитра в house rules не отменя проекта.
- CTA е “Discuss your project” към демо формата. Няма `mailto:`, изпращане или запазване. Точното съобщение остава “Demo only — your enquiry has not been sent or saved.”
- Няма нова функционалност само за изискването на skill-а за „one live thing“. Менюто и демо формата изпълняват договорените взаимодействия.
- Умерено движение с reduced-motion и видимо съдържание има предимство пред motion квоти, задължителни scroll scenes и moving pictures. Не добавяй анимации за удовлетворяване на брояч.
- Не измисляй клиенти, реални поръчки, награди, отзиви или статистики. Студиото и трите проекта са ясно обозначени като демонстрационни.
- Етапите остават отделни: K03 подготвя; K04 изгражда; K06 определя идентичността; K08 генерира изображения; K12–K13 правят Impeccable оценката и поправките.

Ако taste inspector възрази срещу договорено проектно решение, запиши конкретната находка и причината в отчета. Не променяй upstream копието и не отчитай негов FAIL като PASS.

## Инструменти, проверки и ограничения

Използвай Node 22.21.0 и npm 10.9.4 от README. Draw и проверката на хешовете не изискват npm install. `inspect.mjs` изисква инсталиран Chrome, Edge или Chromium, достъпен за процеса; търсенето на изображения изисква мрежа. При ограничения използвай наличния разрешен browser tool и опиши неизпълнените проверки.

За K04 и следващи визуални етапи стартирай preview според README, после:

```sh
node .agents/skills/design-taste-frontend/scripts/lint.mjs app
node .agents/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:4173 --widths 1440,768,375
```

Портът трябва да съвпада с активния preview. Skill-ът по подразбиране проверява 390 px; KILN изисква **375, 768 и 1440 px**. Taste lint не заменя `npm run typecheck`, `npm run lint`, `npm run build`, прегледа на снимките и проверките на взаимодействията.

В този upstream commit `references/scenes.md` споменава `library/scenes.json` и отделни scene assets/demo, които не са включени в upstream skill папката. Копието тук е пълно спрямо нея; не разчитай на тези липсващи ресурси. KILN не изисква scroll scenes. Не са добавяни файлове от друга версия.

Проверки в K03: SHA-256 и точен списък на файловете; независимо възпроизвеждане от фиксирания Git commit; `draw --list sectors` и примерната команда с три посоки; проектните TypeScript, ESLint и build проверки. Няма визуални промени и K03 не оценява началната страница с taste inspector; снимки и оценка започват в K04.

Резултат от подготовката на 20 октомври 2026 г.: 39/39 файла съвпадат и в инсталираното, и в независимо възпроизведеното копие; draw командите минават; `npm run typecheck`, `npm run lint` и `npm run build` минават; `out/index.html` е създаден. `git diff --check` е чист. Browser inspector не е изпълняван в K03, защото няма визуални промени.
