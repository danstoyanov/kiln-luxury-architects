# KILN — website brief

## Goal and audience

KILN Luxury Architects is a fictional luxury residential architecture studio. We are creating a single English-language landing page for a portfolio, demonstrating convincing client-facing design with a distinct identity, built with AI assistance.

The visitor is a potential client commissioning a bespoke house or villa. The page should help them understand the studio's architectural style, services and process. The primary action is **“Discuss your project”** and leads to the contact section with a demo form.

## Content in English

All visible copy, navigation, buttons, labels, errors, alt text and demo notices are in English. Copy must be specific and clear, without unsupported claims about a real studio.

| Section | Required content and behavior |
| --- | --- |
| Navigation | Links to sections on the same page; an accessible mobile menu. |
| First screen | Main message, a large architectural image and “Discuss your project”. |
| Projects | Three conceptual residential projects with short descriptions and one final image each. The presentation must not imply that these are completed commissions. |
| Studio | An introduction to KILN's approach and architectural character. |
| Services and process | A clear description of how the studio would work with a client. |
| Contact | Name, email and message; validation and an honest demo message. |
| Demo notice | A short English statement that the studio and projects are for demonstration. |

We do not add extra pages, real client testimonials or invented awards. We do not present the concepts and generated images as evidence of real clients.

## Demo form

- Fields: name, email and message; each is required and has a visible label.
- Empty fields and an invalid email show clear errors in English, associated with the relevant fields.
- After valid input, display exactly: **“Demo only — your enquiry has not been sent or saved.”**
- No network request containing the entered data is sent, no email is sent, and no backend or external form service is used.
- Data remains only in the page's temporary state. It is not saved in a database, browser storage, cookies, the URL, logs or analytics.
- Do not show a message that implies an enquiry was successfully delivered.
- The form and menu work with a keyboard and have visible focus. The menu closes predictably.

## Visual direction

Contemporary homes in natural surroundings, natural materials, large architectural images and an editorial composition. The initial palette is a warm, light background, graphite text and a muted clay accent. Exact values, fonts, spacing, composition rules, imagery and motion are defined in `DESIGN.md` in K06 and approved through a PR.

The composition must serve the architectural content. Sections do not mechanically repeat identical cards; typography has a clear hierarchy; images share a consistent character. Motion is restrained, respects reduced motion and does not hide content.

The final images come from the built-in ImageGen: one main image and three for the projects. K08 stores the selected images and prompts; K09 prepares optimized web variants in `public/assets/`, suitable mobile crops, dimensions and meaningful alt text. Images below the first screen are lazy-loaded. Temporary images from K04 are replaced; if they come from external sources, their source and terms of use are recorded.

Taste Skill supports the initial design. Up to three Pinterest/Awwwards references in K10 and components from 21st.dev in K11 are used only for an identified need. Impeccable critique, audit, fixes and polish are the separate stages K12–K13.

## Technical boundaries

A single page with Next.js App Router, React and TypeScript strict. npm with `package-lock.json`, CSS Modules and global CSS variables. The exact supported version is chosen in K02 based on the available Node version.

GPT Sites serves the static `out/`, created with `output: 'export'` in `next.config.ts` and `npm run build`. The menu and form are Client Components. We do not use Server Actions, dynamic server routes or runtime features that require a running Next.js server. Images use pre-optimized files and `<picture>`/`<img>` with responsive variants and dimensions; there is no dependency on the server-side `next/image` optimizer.

Backend, database, accounts, CMS and extra pages are out of scope. Preparation and publishing in Sites do not replace the GitHub remote or bypass PR review. The Site remains private by default; public sharing is a separate user decision.

## Final site acceptance

- All sections and all four final ImageGen images are present; there are no temporary images.
- At 375, 768 and 1440 px, there is no broken layout, horizontal overflow, missing resources or console errors.
- Navigation, the mobile menu and the form work with a keyboard; visible focus, contrast, headings and alt text have been checked.
- Empty fields, an invalid email and valid input have been checked; no data is sent or saved.
- Motion respects reduced motion; images do not cause visible layout shifts.
- TypeScript, ESLint and the production build pass; `out/` itself has been checked through a static server, including the menu, form and images.
- The visual result has been approved through PR reviews; the code is in the private GitHub repository.
- GPT Sites confirms a successful deployment of the approved code from `main`; the report contains the URL, GitHub commit, deployment version/status and a check of the hosted site.

These are criteria for the final product, distributed across K01–K15, rather than a claim that the site has already been implemented. The original plan and stage reports are local archives outside the public source; execution rules are in [AGENTS.md](AGENTS.md), and the project entry point is [README.md](README.md).

