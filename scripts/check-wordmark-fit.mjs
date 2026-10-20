import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { Browser, sleep } from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";

const browser = await Browser.launch();
const results = [];
try {
  for (const width of [320, 375, 663, 768, 900, 1440]) {
    const page = await browser.newPage({ width, height: 812, reducedMotion: true });
    await page.goto(process.argv[2] || "http://localhost:3001");
    for (const enlarged of [false, true]) {
      if (enlarged) {
        await page.eval(() => {
          document.documentElement.style.fontSize = "200%";
          const style = document.createElement("style");
          style.textContent = "* { letter-spacing: .12em !important; word-spacing: .16em !important; }";
          document.head.append(style);
        });
      }
      await sleep(150);
      const marks = await page.eval(() => [...document.querySelectorAll("#hero-title, footer p[aria-hidden=true]")].map(mark => {
        const frame = mark.firstElementChild;
        const letters = frame.firstElementChild;
        const range = document.createRange();
        range.selectNodeContents(letters);
        return {
          text: mark.textContent.trim(),
          lines: range.getClientRects().length,
          available: frame.getBoundingClientRect().width,
          rendered: letters.getBoundingClientRect().width,
          fontSize: getComputedStyle(letters).fontSize,
        };
      }));
      assert.equal(marks.length, 2);
      for (const mark of marks) {
        assert.equal(mark.text, "KILN");
        assert.equal(mark.lines, 1, JSON.stringify(mark));
        assert(mark.rendered <= mark.available + 1, JSON.stringify(mark));
      }
      assert.equal(await page.eval(() => document.documentElement.scrollWidth), width);
      assert.deepEqual(page.consoleErrors, []);
      results.push({ width, enlarged, marks });
    }
    await page.close();
  }
  writeFileSync("docs/sin47/wordmark-checks.json", JSON.stringify(results, null, 2) + "\n");
  console.log("PASS: both KILN wordmarks stay on one line and fit at 320/375/663/768/900/1440px, normal and enlarged text. No screenshots captured.");
} finally {
  await browser.close();
}
