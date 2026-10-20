import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { Browser, sleep } from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";

const browser = await Browser.launch();
const results = [];
try {
  for (const width of [375, 768, 1440]) {
    for (const reducedMotion of [false, true]) {
      const page = await browser.newPage({ width, height: 812, reducedMotion });
      await page.goto("http://localhost:3001/?review=8");
      for (const id of ["projects", "studio", "services", "process", "contact"]) {
        await page.eval(() => window.scrollTo({ top: 0, behavior: "instant" }));
        if (width < 900) {
          await page.eval(() => document.querySelector("button[aria-controls]").click());
          await sleep(reducedMotion ? 30 : 350);
        }
        await page.eval(target => document.querySelector('nav a[href="#' + target + '"]').click(), id);
        let state;
        let previousTop;
        let stableSamples = 0;
        for (let attempt = 0; attempt < 90; attempt++) {
          await sleep(25);
          state = await page.eval(target => {
            const section = document.getElementById(target);
            const heading = section.querySelector("h2").getBoundingClientRect();
            return {
              top: section.getBoundingClientRect().top,
              margin: parseFloat(getComputedStyle(section).scrollMarginTop),
              headingTop: heading.top, headingBottom: heading.bottom,
              focused: document.activeElement.id,
              hash: location.hash,
              expanded: document.querySelector("button[aria-controls]").ariaExpanded,
            };
          }, id);
          const aligned = Math.abs(state.top - state.margin) < 2 && state.focused === id;
          stableSamples = aligned && previousTop !== undefined && Math.abs(state.top - previousTop) < 0.1
            ? stableSamples + 1
            : 0;
          previousTop = state.top;
          if (stableSamples >= 3) break;
        }
        assert(Math.abs(state.top - state.margin) < 2, JSON.stringify({ width, reducedMotion, id, state }));
        assert.equal(state.focused, id);
        assert.equal(state.hash, "#" + id);
        assert(state.headingTop >= 0 && state.headingBottom <= 812);
        assert.equal(state.expanded, "false");
        await sleep(100);
        const stableTop = await page.eval(target => document.getElementById(target).getBoundingClientRect().top, id);
        assert(Math.abs(stableTop - state.top) < 2, JSON.stringify({ message: "Destination shifted after landing", width, reducedMotion, id, state, stableTop }));
        results.push({ width, reducedMotion, id, ...state });
      }
      assert.deepEqual(page.consoleErrors, []);
      await page.close();
    }
  }
  writeFileSync("docs/sin47/menu-anchor-checks.json", JSON.stringify(results, null, 2) + "\n");
  console.log("PASS: all five menu anchors land on section starts with visible headings and correct focus at 375/768/1440px, normal/reduced motion. No screenshots.");
} finally {
  await browser.close();
}
