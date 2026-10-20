import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Browser, sleep } from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";
import { prepareRun } from "./qa-output.mjs";

const { url, output, metadata } = prepareRun("k07", "http://localhost:4197");
// Reuse the behaviour checks so visual changes cannot weaken the demo contract.
execFileSync(process.execPath, ["scripts/check-k05.mjs", url, "--out", join(output, "behaviour")], { stdio: "inherit" });
const browser = await Browser.launch();
const results = [];
try {
  for (const width of [375, 768, 1440, 2560]) {
    const page = await browser.newPage({ width, height: width === 375 ? 812 : 1024, reducedMotion: true });
    await page.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `window.kilnLayoutShift = 0; new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.kilnLayoutShift += entry.value; }).observe({type: 'layout-shift', buffered: true});`,
    });
    await page.goto(url);
    await page.wheel(10000, { step: 700, pauseMs: 15 });
    const identity = await page.eval(() => {
      const style = selector => getComputedStyle(document.querySelector(selector));
      const bounds = selector => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
      };
      const projects = [...document.querySelectorAll("#projects article")];
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        background: style("body").backgroundColor,
        text: style("body").color,
        bodySize: style("body").fontSize,
        fonts: [...document.fonts].map(font => ({ family: font.family, weight: font.weight, status: font.status })),
        preloads: [...document.querySelectorAll('link[rel="preload"][as="font"]')].map(link => link.getAttribute("href")).sort(),
        headings: [...document.querySelectorAll("h2,h3")].map(element => ({ text: element.textContent, family: getComputedStyle(element).fontFamily, weight: getComputedStyle(element).fontWeight })),
        sectionPadding: style("#projects").paddingLeft,
        sections: [...document.querySelectorAll("main > section[id]")].map(section => ({ id: section.id, left: getComputedStyle(section).paddingLeft, right: getComputedStyle(section).paddingRight })),
        projects: projects.map(article => {
          const image = article.querySelector("img");
          const rect = image.getBoundingClientRect();
          return { x: rect.left, top: rect.top + scrollY, width: rect.width, ratio: rect.width / rect.height, loading: image.loading };
        }),
        name: { ...bounds("h1"), client: document.querySelector("h1").clientWidth, scroll: document.querySelector("h1").scrollWidth },
        footerName: { ...bounds('footer [aria-hidden="true"]'), client: document.querySelector('footer [aria-hidden="true"]').clientWidth, scroll: document.querySelector('footer [aria-hidden="true"]').scrollWidth },
        identityLink: bounds('header a[aria-label="Luxury Architects — KILN home"]'),
        processFocus: style("#process").getPropertyValue("--color-focus").trim(),
        sheetFocus: style("#process ol").getPropertyValue("--color-focus").trim(),
        footerFocus: style("footer").getPropertyValue("--color-focus").trim(),
        reduced: [...document.querySelectorAll("*")].every(element => {
          const css = getComputedStyle(element);
          return css.animationName === "none" && css.transform === "none" && parseFloat(css.transitionDuration) === 0;
        }),
        layoutShift: window.kilnLayoutShift,
      };
    });
    assert.equal(identity.overflow, false);
    assert.equal(identity.background, "rgb(242, 241, 237)");
    assert.equal(identity.text, "rgb(40, 43, 40)");
    assert.equal(identity.bodySize, width < 900 ? "17px" : "18px");
    assert.deepEqual(identity.preloads, ["/fonts/panchang-bold.woff2", "/fonts/switzer-regular.woff2"]);
    assert(identity.fonts.every(font => font.status === "loaded"));
    assert(identity.headings.every(heading => heading.family.includes("Switzer")));
    assert(identity.sections.every(section => section.left === section.right));
    assert(identity.projects.every(project => Math.abs(project.ratio - 1.5) < 0.01 && project.loading === "lazy"));
    if (width < 900) {
      assert(identity.projects.every(project => project.x === identity.projects[0].x && project.width === identity.projects[0].width));
      assert(identity.projects[0].top < identity.projects[1].top && identity.projects[1].top < identity.projects[2].top);
    }
    if (width === 2560) assert.equal(identity.sectionPadding, "352px");
    assert(identity.identityLink.height >= 44);
    assert.equal(identity.reduced, true);
    assert.equal(identity.processFocus, "#f2f1ed");
    assert.equal(identity.sheetFocus, "#282b28");
    assert.equal(identity.footerFocus, "#f2f1ed");
    results.push({ width, identity });
    if (width !== 2560) {
      const target = width === 375 ? "#process" : "#projects";
      await page.eval(selector => document.querySelector(selector).scrollIntoView({ behavior: "instant" }), target);
      // Wait for the scrolled frame and lazy image pixels before capturing evidence.
      await sleep(500);
      await page.eval(async () => {
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
      });
      await page.screenshot({ path: join(output, width + "-detail.jpg"), quality: 88 });
    }
    await page.close();
  }
  const page = await browser.newPage({ width: 1440, height: 900 });
  await page.goto(url);
  const motion = await page.eval(() => {
    const style = selector => getComputedStyle(document.querySelector(selector));
    return {
      name: { animation: style("h1").animationName, duration: style("h1").animationDuration, opacity: style("h1").opacity },
      image: { animation: style("main img").animationName, duration: style("main img").animationDuration },
      controls: ["main a[href='#contact']", "button[type='submit']"].map(selector => ({ background: style(selector).backgroundColor, weight: style(selector).fontWeight, transition: style(selector).transitionDuration })),
      lowerAnimations: [...document.querySelectorAll("main section[id] *")].filter(element => getComputedStyle(element).animationName !== "none").length,
    };
  });
  assert.equal(motion.name.duration, "0.48s");
  assert.equal(motion.name.opacity, "1");
  assert.equal(motion.image.duration, "0.8s");
  assert.equal(motion.lowerAnimations, 0);
  assert(motion.controls.every(control => control.background === "rgb(128, 85, 66)" && control.weight === "500"));
  const { root } = await page.send("DOM.getDocument");
  await page.send("DOM.enable");
  await page.send("CSS.enable");
  for (const selector of ["main a[href='#contact']", "button[type='submit']"]) {
    const { nodeId } = await page.send("DOM.querySelector", { nodeId: root.nodeId, selector });
    await page.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: ["hover"] });
    await sleep(250);
    const hover = await page.eval(target => {
      const css = getComputedStyle(document.querySelector(target));
      return { color: css.backgroundColor, transform: css.transform };
    }, selector);
    assert.equal(hover.color, "rgb(104, 67, 51)");
    assert.equal(hover.transform, "none");
    await page.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: ["active"] });
    await sleep(200);
    const active = await page.eval(target => getComputedStyle(document.querySelector(target)).transform, selector);
    assert.equal(active, "matrix(1, 0, 0, 1, 0, 1)");
    results.push({ selector, hover, active });
    await page.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
  }
  results.push({ motion });
  await page.close();
  writeFileSync(join(output, "identity-checks.json"), JSON.stringify({ ...metadata, results }, null, 2) + "\n");
  console.log("PASS: K07 identity, crops, frame, fonts, contextual focus and motion. Report: " + output);
} finally {
  await browser.close();
}
