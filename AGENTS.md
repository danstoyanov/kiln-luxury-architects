# Agent rules — KILN

## Context and scope

Read the specific Linear issue, [README.md](README.md), [brief.md](brief.md) and `DESIGN.md`, if it exists. Do not rely on the history of other chats. IMPLEMENTATION_PLAN.md and the archives of completed stages are local materials, not required context from GitHub.

Work only on the assigned task. Follow the project constraints and the scope of the specific Linear issue. Project requirements, the specific stage and the use of ImageGen take precedence over skill suggestions for a different workflow or final images. Do not expand the scope with extra pages, a backend, a database, accounts or a CMS.

## Communication and sequence

- Describe each planned action and its reason in advance, using short bullet points in Bulgarian.
- Get the actual Linear ID and rename the current chat to `🔴 <ID>` at the start. It stays red while a PR is open.
- Use separate agents, started manually and sequentially with Sol 6.1 / Medium according to the plan. Do not start the next agent or carry out the next task.
- Before K02–K15, confirm that the previous task's PR has been merged. K01 / SIN-32 is first and has no previous task. The mappings between K01–K15 and the actual IDs are in the plan.
- Update remote refs. Create a new managed Codex worktree from the latest `origin/main`, including the merged previous task, and a new branch `codex/<linear-id>-<short-description>`; use the lowercase ID in the branch.
- Edit only in your own worktree. Do not change the main checkout or another task's worktree. Dependencies, build files and the preview server are local to the worktree. If another preview is running, use a different port.
- In Linear: `In Progress` at the start, `In Review` after opening a PR, `Done` only after merge and fulfillment of the criteria. Use the corresponding available team statuses.
- The user reviews and merges. Do not merge PRs. Requested fixes are made by the same agent in the same worktree and PR.
- After a confirmed merge and fulfillment of the criteria, mark the task Done and rename the same chat to `🟢 <ID>`.
- Keep the worktree during review. After merge and handover of the required files, it may be archived through Codex. Do not delete results that have not been handed over.

## Local archives and public source

- IMPLEMENTATION_PLAN.md, docs/k*, docs/qa, docs/sin47, .impeccable and the supporting stage QA/image preparation scripts are kept locally and excluded through .gitignore. Do not add them back to Git, delete them or require them to be present in a new clone.
- Final web images in public/assets/ and font licenses remain in Git. Normal npm install/build commands do not depend on the local archives.
- Completed K01–K15 stages are development history; future tasks follow their explicit scope. Making GitHub public is a separate task after source and history preparation.
- For the current documentation preparation and translation series, the user explicitly excludes screenshots, browser/preview, ImageGen, audit, tests, TypeScript, ESLint and build. Do not change the site or report these checks as completed.

## Readable TypeScript and React

- Enable TypeScript `strict` in K02 and keep it enabled. Type props, data models, form states and module boundaries. Let TypeScript infer obvious local types.
- Do not use `any`, type assertions or disabled checks to hide errors. For unknown input, use `unknown` and validate it before use.
- Use clear English names, small functions and components with one understandable responsibility. Separate presentation, data and non-trivial logic when it improves readability.
- Write idiomatic functional React components with hooks and composition.
- Prefer simple conditions and explicit data flow over nested ternary expressions, overly terse syntax and unnecessary abstractions.
- Add comments for non-trivial logic, constraints or the reason for a decision. Write them in simple English at B1 level, close to the relevant block. Do not restate obvious code.
- Review readability before every PR.

## Technical contract

- Next.js App Router, React, TypeScript strict and npm. K02 chooses a supported stable version compatible with the available Node version; keep `package-lock.json`.
- `app/` contains the page and layout, `components/` contains sections and interactive components, and `public/assets/` contains final web images. Add `lib/` and `scripts/` when there is a real need.
- Use CSS Modules and global CSS variables. Use Phosphor only where it serves a purpose. Apply the approved `DESIGN.md` once it is created in K06.
- Set `output: 'export'` in `next.config.ts`. `npm run build` must create `out/` for GPT Sites. The menu and demo form are Client Components.
- Do not use Server Actions, dynamic server routes or features that require a running Next.js server.
- Optimize images in advance; use `<picture>`/`<img>`, responsive variants and explicit dimensions. Do not rely on the server-side `next/image` optimizer.
- Do not commit `node_modules/`, `.next/`, `.next-dev/` or `out/`. Keep `skills-lock.json` if the chosen installer creates it. Do not commit credentials.
- In K03, record the exact commit, source and usage instructions for Taste Skill. Final architectural images come from the built-in ImageGen in K08; keep the prompts. Record the source and terms of use for external temporary images.
- All visible copy is in English. The CTA is “Discuss your project”. The demo form validates name, email and message and, after valid input, displays exactly “Demo only — your enquiry has not been sent or saved.” It does not send or store data or imply delivery of an enquiry. Details are in brief.md.

## Checks

- For documentation tasks, check completeness, consistency and link validity. Do not add formal tests without a practical need. Do not report future npm commands as completed.
- For code changes, run the TypeScript check, ESLint and production build using the commands configured in K02. README must contain the exact commands after that stage.
- Browser checks begin with the first complete version; K05 is a separate checkpoint. After every visual change, check the affected sections on desktop and mobile; the main widths are 375, 768 and 1440 px.
- Check overflow, readability, navigation, resource loading and console errors. For interactions, check keyboard operation, visible focus, predictable menu closing and reduced motion.
- Check form labels and errors with empty fields, an invalid email and valid input. Confirm that no network request is made and entered data is not saved.
- Before deployment, open `out/` itself through a static server and check the menu, form and images. A working `next dev` is not sufficient.
- Check contrast, headings, alt text, image dimensions, the absence of visible layout shifts and lazy loading below the first screen. Follow the final criteria in the plan.
- If a check cannot be run, describe the limitation; do not report it as successful.

## PRs and publishing

Open a GitHub PR to `main` with the actual Linear ID in the title and a link to the issue in the description. Describe what changed, how it was checked and any material limitations. For visual changes, add desktop/mobile screenshots; when a comparison is required, add before/after images. Documentation task K01 does not require screenshots of a page that does not yet exist.

GitHub is the main location for code and review; GPT Sites is for publishing. Sites synchronization must not replace the GitHub remote, bypass the PR process or introduce unchecked changes. If needed, prepare a separate copy of the approved source for deployment.

K14 registers a private Site and adds its identifier and the static configuration for `out/` through a PR, without publishing. K15 publishes the approved code from `main` and records the URL, GitHub commit and returned deployment version/status, with a check of the hosted site. The subsequent PR is only a handover report. If a site change is needed, it first goes through a PR and merge, then the new approved version is published.

The Site remains private by default; public sharing is a separate user decision. The GitHub repository remains private.

## Taste Skill (K03)

For K04, read [docs/taste-skill.md](docs/taste-skill.md), then [.agents/skills/design-taste-frontend/SKILL.md](.agents/skills/design-taste-frontend/SKILL.md). The skill and all its supporting files are in Git; do not use a floating version from main. Verify the copy with `node scripts/verify-taste-skill.mjs`; the source, commit and SHA-256 are in `taste-skill-source.json`. KILN and stage constraints, ImageGen, the demo form, CSS Modules and restrained motion take precedence over conflicting skill rules.
