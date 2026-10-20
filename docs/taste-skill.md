# Taste Skill for KILN

Preparation for [SIN-34 / K03](https://linear.app/singularity-lab/issue/SIN-34/k03-podgotovka-na-taste-skill), 20 October 2026. This is a tool for K04; no design is selected and no page changes are made here.

## Location and pinned version

- Skill: `design-taste-frontend`, entry point [SKILL.md](../.agents/skills/design-taste-frontend/SKILL.md).
- Source: [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill).
- Exact commit: [`63aba5f43b5056758b15bbe7d683da8c86a7a7ad`](https://github.com/Leonxlnx/taste-skill/tree/63aba5f43b5056758b15bbe7d683da8c86a7a7ad).
- Upstream directory: `skills/taste-skill`; local directory: `.agents/skills/design-taste-frontend/`.
- All 38 upstream files were copied without changes, including scripts, references, library and assets. The only addition is the [MIT LICENSE](../.agents/skills/design-taste-frontend/LICENSE) from the root of the same commit.
- [taste-skill-source.json](../taste-skill-source.json) records the source, commit, installer and SHA-256 hashes for all 39 files. `.gitattributes` preserves their bytes on Windows checkout as well.

The copy is tracked in Git: the next agent does not need a global installation or network access to read it and run draw. Codex discovers project skills in `.agents/skills/` on the next turn or in a new session with this worktree as the working directory. If the catalog does not list it, open the SKILL.md linked above and its related files directly. Do not update automatically from `main`.

## Installation and reproduction

The bundled Codex `skill-installer`, Python 3.14 and the download method were used. The command was run from the worktree root with an empty destination directory (PowerShell):

```powershell
$codexRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
$installer = Join-Path $codexRoot 'skills/.system/skill-installer/scripts/install-skill-from-github.py'
python $installer --repo Leonxlnx/taste-skill --path skills/taste-skill --ref 63aba5f43b5056758b15bbe7d683da8c86a7a7ad --dest .agents/skills --name design-taste-frontend --method download
Invoke-WebRequest 'https://raw.githubusercontent.com/Leonxlnx/taste-skill/63aba5f43b5056758b15bbe7d683da8c86a7a7ad/LICENSE' -OutFile '.agents/skills/design-taste-frontend/LICENSE'
node scripts/verify-taste-skill.mjs
```

The installer refuses to overwrite an existing directory. It does not create `skills-lock.json`; no such file was generated or removed. `taste-skill-source.json` is a separate provenance manifest, not an `npx skills` lockfile. The skill has no npm dependencies.

To reproduce the copy independently without the Codex installer, download the same Git commit into a new temporary directory, copy the upstream directory and license, and compare them with the manifest. Run from the project root; Git, Node and network access are required. Each run creates a new directory and does not overwrite the installed copy:

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

If recovery is needed, use the verified copy in a new checkout. Do not delete local changes. For an intentional upgrade, review the new instructions and update the commit and hashes in a separate PR.

## Use in K04

1. Read the Linear issue, `AGENTS.md`, `brief.md` and `DESIGN.md`, if it already exists. The original plan and stage archives are kept locally only and are not required for a new clone. Then read the full SKILL.md and the necessary references.
2. From the worktree root, run `node scripts/verify-taste-skill.mjs` and use the skill for KILN's rationale, copy and composition. To invoke it explicitly in a prompt: “Use $design-taste-frontend for SIN-35, following docs/taste-skill.md and KILN's constraints.”
3. Example for exploring three directions (does not select a direction or create a site):

```sh
node .agents/skills/design-taste-frontend/scripts/draw.mjs --list sectors
node .agents/skills/design-taste-frontend/scripts/draw.mjs --sector architecture --brief "KILN fictional residential architecture studio" --sections work,about,features,how-it-works,contact,footer --tone luxury --keep palette --options 3 --seed 34
```

Choose a suitable direction based on the brief; run the same command without `--options 3`, adding `--direction <chosen-id>`. Record the seed, direction and rationale in the K04 report. `--keep palette` preserves the initial project palette; after K06, use `--keep palette,type` for the approved identity. Do not claim to have original photography through `--have photography` before it exists.

Local direction sheets, downloads and screenshots are stored in the ignored `.taste-skill/` directory. Hand over the selected decisions and necessary evidence in the Git documents for the relevant stage; do not rely on the next worktree inheriting ignored files.

## KILN rules that take precedence

- Next.js App Router, strict TypeScript, CSS Modules, global CSS custom properties and static export. Do not automatically copy JS/CSS helpers or add another framework or styling dependency.
- The final images are exactly the four ImageGen images from K08–K09. External collections, additional video and the skill's higher minimum image count are not KILN requirements. Temporary images in K04 have a documented source and license and are replaced later.
- Preserve the warm light background, graphite text and muted clay accent from the brief, then follow the approved DESIGN.md. A ban on a similar palette in the house rules does not override the project.
- The CTA is “Discuss your project” and leads to the demo form. There is no `mailto:`, sending or saving. The exact message remains “Demo only — your enquiry has not been sent or saved.”
- Do not add functionality solely to meet the skill's “one live thing” requirement. The menu and demo form provide the agreed interactions.
- Moderate motion with reduced-motion support and visible content takes precedence over motion quotas, mandatory scroll scenes and moving pictures. Do not add animations to meet a count.
- Do not invent clients, real commissions, awards, testimonials or statistics. The studio and the three projects are clearly labeled as demonstrations.
- The stages remain separate: K03 prepares; K04 builds; K06 defines the identity; K08 generates images; K12–K13 cover the Impeccable assessment and fixes.

If the taste inspector flags an agreed project decision, record the specific finding and the reason in the report. Do not modify the upstream copy or report its FAIL as PASS.

## Tools, checks and limitations

Use Node 22.21.0 and npm 10.9.4 from the README. Draw and hash verification do not require npm install. `inspect.mjs` requires an installed Chrome, Edge or Chromium accessible to the process; image search requires network access. If there are restrictions, use the available permitted browser tool and describe any checks that were not performed.

For K04 and subsequent visual stages, start the preview according to the README, then run:

```sh
node .agents/skills/design-taste-frontend/scripts/lint.mjs app
node .agents/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:4173 --widths 1440,768,375
```

The port must match the active preview. The skill checks 390 px by default; KILN requires **375, 768 and 1440 px**. Taste lint does not replace `npm run typecheck`, `npm run lint`, `npm run build`, screenshot review or interaction checks.

In this upstream commit, `references/scenes.md` mentions `library/scenes.json` and separate scene assets/demo that are not included in the upstream skill directory. The copy here is complete relative to that directory; do not rely on these missing resources. KILN does not require scroll scenes. No files from another version were added.

Checks in K03: SHA-256 and the exact file list; independent reproduction from the pinned Git commit; `draw --list sectors` and the example command with three directions; the project's TypeScript, ESLint and build checks. There are no visual changes, and K03 does not assess the initial page with the taste inspector; screenshots and assessment begin in K04.

Preparation results on 20 October 2026: 39/39 files match in both the installed and independently reproduced copies; the draw commands pass; `npm run typecheck`, `npm run lint` and `npm run build` pass; `out/index.html` was created. `git diff --check` is clean. The browser inspector was not run in K03 because there were no visual changes.
