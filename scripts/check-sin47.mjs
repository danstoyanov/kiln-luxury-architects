import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Browser, sleep } from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";

const url = process.argv[2] || "http://localhost:3001";
const output = process.argv[3] || ".taste-skill/checks/sin47";
const baseline = process.argv.includes("--baseline");
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = [];

try {
  for (const [width, height] of [[375, 812], [768, 1024], [1063, 738], [1440, 900]]) {
    const page = await browser.newPage({ width, height, reducedMotion: true });
    await page.goto(url);
    await page.wheel(15000, { step: 1200, pauseMs: 10 });
    await page.eval(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode()));
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({ path: join(output, width + "-fold.jpg"), quality: 86 });
    await page.screenshot({ path: join(output, width + "-page.jpg"), quality: 80, fullPage: true });
    for (const section of ["studio", "services", "process"]) {
      await page.eval(id => document.getElementById(id).scrollIntoView({ behavior: "instant" }), section);
      await sleep(50);
      await page.screenshot({ path: join(output, width + "-" + section + ".jpg"), quality: 86 });
    }
    const state = await page.eval(() => ({
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      headings: [...document.querySelectorAll("h2,h3")].map(node => ({
        text: node.textContent.trim(), font: getComputedStyle(node).fontFamily,
        size: getComputedStyle(node).fontSize,
        clipped: node.scrollWidth > node.clientWidth + 1,
      })),
      identityFont: getComputedStyle(document.querySelector("header a[aria-label]")).fontFamily,
      iconCount: document.querySelectorAll("#studio svg, #services svg, #process svg").length,
      glass: getComputedStyle(document.querySelector("header")).backdropFilter,
      brokenImages: [...document.images].filter(image => !image.naturalWidth).length,
    }));
    assert.equal(state.documentWidth, width, "Horizontal overflow: " + width);
    assert.equal(state.brokenImages, 0);
    assert(state.headings.every(heading => !heading.clipped));
    if (!baseline) {
      assert.equal(state.iconCount, 9);
      assert(state.headings.every(heading => heading.font.includes("Bodoni Moda")));
      assert(state.identityFont.includes("Bodoni Moda"));
      assert(state.glass.includes("blur"));
    }
    assert.deepEqual(page.consoleErrors, []);
    results.push({ width, height, ...state });
    await page.close();
  }
  if (!baseline) {
    const page = await browser.newPage({ width: 375, height: 812, reducedMotion: true });
    await page.goto(url);
    await page.eval(() => document.querySelector("button[aria-controls]").click());
    await page.screenshot({ path: join(output, "375-menu.jpg"), quality: 86 });
    await page.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
    });
    const fallback = await page.eval(() => ({
      preference: matchMedia("(prefers-reduced-transparency: reduce)").matches,
      blur: getComputedStyle(document.querySelector("header")).backdropFilter,
      background: getComputedStyle(document.querySelector("header")).backgroundColor,
    }));
    assert(fallback.preference);
    assert.equal(fallback.blur, "none");
    assert.equal(fallback.background, "rgb(242, 241, 237)");
    results.push({ reducedTransparency: fallback });
    await page.screenshot({ path: join(output, "375-solid-fallback.jpg"), quality: 86 });
    await page.close();
  }
  writeFileSync(join(output, "checks.json"), JSON.stringify({ url, baseline, results }, null, 2) + "\n");
  console.log("PASS: SIN-47 screenshots, layout, fonts, resources" + (baseline ? " (baseline)." : ", icons and reduced-transparency fallback."));
} finally {
  await browser.close();
}
