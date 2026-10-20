# K11 — Компоненти и взаимодействия

[SIN-42](https://linear.app/singularity-lab/issue/SIN-42/k11-komponenti-i-vzaimodejstviya), 20 октомври 2026 г. Изпълнено лично, без други агенти. База: `412030563d8abd5824ee939dc0cc406b5c92c835`, потвърден merge на [K10 PR #11](https://github.com/danstoyanov/kiln-luxury-architects/pull/11). Remote refs са обновени преди създаване на управляваното worktree `sin-42-interactions`; клон `codex/sin-42-components-interactions`.

## Наблюдавани проблеми и промени

[Началната проверка](before/findings.json) върху непроменения static export потвърди фокус върху `body` след избор от мобилното меню и след преминаване към desktop. Трите вече коригирани полета продължаваха да показват грешките от предишния submit.

- `main` и секционните anchor цели вече са фокусируеми с `tabIndex={-1}`. Native anchor навигацията премества фокуса към съдържанието; Tab редът не получава нови спирки. Това покрива и Skip to content, hero CTA и Back to top.
- Менюто запазва disclosure модела, `aria-expanded`, нормалния поток, Escape, избор, външен клик и затваряне при излизане с Tab/Shift+Tab. Няма focus trap. При външен клик върху поле то получава фокус; при клик върху обикновено съдържание фокусът не остава в скритото меню.
- При пресичане на 899/900px скритият Menu предава фокуса на Projects, а скритата desktop връзка — на Menu. Последният header контрол се пази само за случая, в който CSS го скрие преди media събитието; обикновено излизане от header го изчиства. Фокусът извън header не се премества.
- Грешката на редактирано невалидно поле се обновява и изчезва при валидна корекция. Всяко submit действие валидира отново всички полета. Фокусът към първата грешка се мести след render на описанията. Статусът остава `role="status"`, с `aria-atomic="true"`; нова редакция го изчиства.
- Menu/Close има моментално underline при hover/focus; полетата имат graphite hover рамка. Invalid рамката запазва error цвета и при hover, а graphite focus outline остава отделен. Междинната проверка откри CSS specificity конфликт и той е поправен преди финалните резултати.

Наличните компоненти решават нуждата; няма външен компонент от 21st.dev, нова зависимост, страница или ново движение. Hero анимациите и press feedback от DESIGN.md са запазени. Формата изчиства полетата след валиден вход и показва точно **“Demo only — your enquiry has not been sent or saved.”** Стойностите се четат временно от DOM; няма реално изпращане или съхранение.

## Доказателства

| Състояние | 375px | 768px | 1440px |
| --- | --- | --- | --- |
| Меню и видим фокус | [Снимка](after/375-menu-focus.jpg) | [Снимка](after/768-menu-focus.jpg) | Desktop навигация в [overview](overview/desktop-fold.jpg) |
| Празна форма | [Снимка](after/375-form-errors.jpg) | [Снимка](after/768-form-errors.jpg) | [Снимка](after/1440-form-errors.jpg) |
| Коригирани полета | [Снимка](after/375-form-corrected.jpg) | [Снимка](after/768-form-corrected.jpg) | [Снимка](after/1440-form-corrected.jpg) |
| Точен демо статус | [Снимка](after/375-form-complete.jpg) | [Снимка](after/768-form-complete.jpg) | [Снимка](after/1440-form-complete.jpg) |

Desktop сравнение на корекцията: [преди — остарели грешки](before/1440-corrected-fields.jpg), [след — валидни полета](after/1440-form-corrected.jpg). [Мобилно меню преди](before/375-menu.jpg). Прегледани са всички осем финални Taste fold/sheet изображения и засегнатите interaction състояния на трите основни ширини. Композицията и идентичността са запазени; няма видимо преливане или застъпване на контролите.

## Изпълнени проверки

- `npm run typecheck`, `npm run lint`, `npm run build` — успешни след финалната CSS поправка. `out/index.html` се обслужва от `serve out` на порт 4220, без Next.js runtime.
- `node scripts/check-k11.mjs http://localhost:4220 --out docs/k11/after` — [interaction report](after/interaction-checks.json). Реални CDP Tab/Shift+Tab, Enter/Space и Escape; секционен фокус; излизане от менюто в двете посоки; външен pointer клик върху съдържание и поле; пет двупосочни прехода 899/900px; запазен фокус извън header.
- Същата проверка покрива празни полета, whitespace, невалиден имейл, корекция без нов submit, фокус към всяко първо невалидно поле, наличие на описанията в момента на focus, валидно и повторно валидно попълване, field reset и изчистване на статуса при редакция. На 375/768/1440px: **0 заявки по време на формата; 0 опита за Storage/cookie/IndexedDB запис; празни localStorage/sessionStorage/cookies/databases; непроменен URL**. Има проверки на computed hover/error/focus стилове и runtime включване на reduced motion.
- `node scripts/check-k07.mjs http://localhost:4220 --out docs/k11/regression` — [identity/motion](regression/identity-checks.json), [targeted scenarios](regression/behaviour/targeted-checks.json), [browser/privacy regression](regression/behaviour/regression/browser-checks.json). Запазени шрифтове, цветове, image ratios/lazy loading, видим focus, normal hover/press, reduced motion, нисък desktop, wide frame и 200% основен текст. Няма console/resource errors или overflow в проверените сценарии. Това е симулация на увеличен основен текст, не всеки browser zoom режим.
- `node scripts/verify-taste-skill.mjs` — 39/39 оригинални файла от commit `63aba5f43b5056758b15bbe7d683da8c86a7a7ad`. Няма нов draw; следва се приетата посока от K04/K06.
- Taste source lint за `app` и `components` — 0 FAIL / 0 WARN. [Финалният inspector](overview/report.json) на 1440/768/375 връща **1 FAIL / 3 WARN**, без allowances: същите като [приетия K10 отчет](../k10/taste-after.json). `still-page` е конфликт с изрично умереното движение; `palette-cream` е приетата mineral/clay палитра; `no-footage` е договорът за точно четири ImageGen кадъра; `name-only-title` не отчита видимото описание с договорените mobile 17px. FAIL не се отчита като PASS и не е повод за нови анимации/видео извън обхвата.
- `git diff --check`, ръчен преглед на четимостта и локалните Markdown връзки — проверени преди PR. Междинните QA опити са локално архивирани под игнорираната `.taste-skill/k11-attempts/`; в този отчет са финалните успешни проверки.

`run.json` файловете записват base commit, dirty state, source/export SHA-256 по време на проверката. Различните кадри на формата са от един и същ export; намаляването на височината след корекция е очаквано, защото изчезват error параграфите. Използвани са само синтетични примерни данни.

```text
ROUND 1 — interaction refinement, final render
Seen in one second: архитектурният праг и KILN; ясни графитни focus рамки при взаимодействие.
Idea: материалната тежест на името свързва терена и обитаването.
Live thing: достъпно disclosure меню и локална демо форма.
Layout: hero=image-name / projects=wall / studio=text / services=open-columns / process=sheet / contact=split / footer=inverse-name.
Scores: design 7.5 · usability 8 · creativity 6 · content 8 → overall 7.4, capped at 6.0.
Caps applied: наследеният still-page FAIL; позната архитектурна посока. Субективна Taste оценка, не K12 Impeccable audit.
Top problems addressed: before/findings.json — загубен anchor/resize focus; before/1440-corrected-fields.jpg — остарели грешки; hover/error specificity — поправен и проверен.
```

## Повторение и ограничения

Node 22.21.0 / npm 10.9.4 и наличен Chrome/Edge/Chromium. В свое worktree:

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm exec -- serve out --listen 4220 --no-clipboard
```

В друг терминал изпълни горните QA команди с нови `--out` директории. Inspector: `node .agents/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:4220 --widths 1440,768,375 --out .taste-skill/k11-new`.

Няма Safari/Firefox, реален screen reader, hosted-site, Lighthouse или пълен WCAG одит. Наличието и връзката на ARIA описанията са проверени в DOM; реално произнасяне от screen reader не е заявено. Петте наследени high npm audit записа остават без промяна на зависимостите. Няма публикуване или започване на K12. След отваряне на PR SIN-42 остава In Review и чатът червен; Done и зелено са след човешки merge и приемане. Worktree-то се запазва за ревю.
