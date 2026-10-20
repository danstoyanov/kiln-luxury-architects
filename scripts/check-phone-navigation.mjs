import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { Browser, sleep } from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";
const browser = await Browser.launch();
const results = [];
try {
  for (const width of [375, 768]) {
  for (const reducedMotion of [false, true]) {
    const page = await browser.newPage({ width, height: 812, reducedMotion });
    await page.goto("http://localhost:3001/?review=6");
    const measure = () => page.eval(() => {
      const header = document.querySelector("header").getBoundingClientRect();
      const image = document.querySelector("main img").getBoundingClientRect();
      const skip = document.querySelector('a[href="#main"]');
      return { headerHeight: header.height, headerBottom: header.bottom, imageTop: image.top,
        skipClip: getComputedStyle(skip).clipPath,
        closedInert: document.querySelector("nav").parentElement.parentElement.inert,
        expanded: document.querySelector("button[aria-controls]").ariaExpanded };
    });
    const closed = await measure();
    assert.equal(closed.skipClip, "inset(50%)");
    assert(closed.closedInert);
    await page.eval(() => document.querySelector("button[aria-controls]").click());
    await sleep(70);
    const opening = await measure();
    await sleep(350);
    const open = await measure();
    assert.equal(open.expanded, "true");
    assert(!open.closedInert);
    assert(open.imageTop >= open.headerBottom, "Image must start below the whole expanded menu");
    if (!reducedMotion) assert(opening.headerHeight > closed.headerHeight && opening.headerHeight < open.headerHeight);
    await page.eval(() => document.querySelector("button[aria-controls]").click());
    await sleep(70);
    const closing = await measure();
    assert(closing.closedInert);
    await sleep(350);
    const restored = await measure();
    assert(Math.abs(restored.imageTop - closed.imageTop) < 1);
    if (!reducedMotion) assert(closing.headerHeight > closed.headerHeight && closing.headerHeight < open.headerHeight);
    assert.deepEqual(page.consoleErrors, []);
    results.push({ width, reducedMotion, closed, opening, open, closing, restored });
    await page.close();
  }
  }
  writeFileSync("docs/sin47/compact-motion-checks.json", JSON.stringify(results, null, 2) + "\n");
  console.log("PASS: phone/tablet menu expands/collapses, image clears panel and returns, closed links inert, reduced motion. No screenshots or visual review.");
} finally { await browser.close(); }
