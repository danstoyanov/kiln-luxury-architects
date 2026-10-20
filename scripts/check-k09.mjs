import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Browser, sleep } from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";
import { prepareRun } from "./qa-output.mjs";

const { url, output, metadata } = prepareRun("k09", "http://localhost:4200");
const manifest = JSON.parse(readFileSync("docs/k09/assets.json", "utf8"));
// Fetch every derivative from out/, including formats not selected by this browser.
for (const file of manifest.files) {
  const response = await fetch(new URL(file.path.replace("public/", ""), url));
  assert.equal(response.status, 200, file.path);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.length, file.bytes, file.path);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256);
}
assert.equal(manifest.files.length, 32);
const browser = await Browser.launch();
const results = [];

async function imageMetrics(page) {
  return page.eval(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    layoutShift: window.kilnLayoutShift,
    images: [...document.images].map(image => {
      const rect = image.getBoundingClientRect();
      const css = getComputedStyle(image);
      return {
        src: new URL(image.currentSrc || image.src).pathname,
        loaded: image.complete && image.naturalWidth > 0,
        alt: image.alt, loading: image.loading, priority: image.fetchPriority,
        width: image.width, height: image.height,
        intrinsicWidth: image.getAttribute("width"), intrinsicHeight: image.getAttribute("height"),
        frame: { x: rect.x, top: rect.top + scrollY, width: rect.width, height: rect.height },
        focal: css.objectPosition,
        source: image.parentElement.querySelector("source").getAttribute("srcset"),
        sizes: image.sizes,
      };
    }),
    disclosure: document.body.textContent.includes("AI-generated imagery") &&
      document.body.textContent.includes("Fictional projects"),
    imageCaptions: document.querySelectorAll("figure figcaption").length,
    titleGaps: [...document.querySelectorAll("#projects article")].map(article =>
      article.querySelector("h3").parentElement.getBoundingClientRect().top -
      article.querySelector("img").getBoundingClientRect().bottom),
    temporary: /temporary reference|unsplash/i.test(document.body.textContent),
  }));
}

try {
  for (const [width, height, dsf] of [[375,812,1], [768,1024,1], [1440,900,1], [375,812,2]]) {
    const page = await browser.newPage({ width, height, dsf, reducedMotion: true });
    const errors = [];
    await page.send("Network.enable");
    await page.send("Network.setCacheDisabled", { cacheDisabled: true });
    browser.on(page.sessionId, "Network.responseReceived", event => {
      if (event.response.status >= 400) errors.push(event.response.url + " " + event.response.status);
    });
    browser.on(page.sessionId, "Runtime.consoleAPICalled", event => {
      if (["warning", "error"].includes(event.type)) errors.push(JSON.stringify(event.args));
    });
    await page.send("Page.addScriptToEvaluateOnNewDocument", { source:
      "window.kilnLayoutShift = 0; new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.kilnLayoutShift += entry.value; }).observe({type:'layout-shift',buffered:true});"
    });
    await page.goto(url);
    const initial = await imageMetrics(page);
    await page.wheel(10000, { step: 700, pauseMs: 25 });
    await page.eval(async () => { await Promise.all([...document.images].map(image => image.decode())); });
    await sleep(200);
    const metrics = await imageMetrics(page);
    assert.equal(metrics.overflow, false);
    assert.equal(metrics.images.length, 4);
    assert.equal(metrics.disclosure, true);
    assert.equal(metrics.temporary, false);
    assert.equal(metrics.imageCaptions, 0);
    assert(metrics.titleGaps.every(gap => Math.abs(gap - 16) < 0.1));
    assert(metrics.layoutShift < 0.001, JSON.stringify(metrics));
    for (const [index, image] of metrics.images.entries()) {
      assert(image.loaded && image.src.endsWith(".webp"));
      assert(image.alt.startsWith("Concept visualisation:"));
      assert.equal(image.intrinsicWidth, "1536");
      assert.equal(image.intrinsicHeight, "1024");
      assert.equal(image.source.split(",").length, 4);
      if (index === 0) {
        assert.equal(image.loading, "eager");
        assert.equal(image.priority, "high");
        assert.equal(image.focal, width < 600 ? "58% 50%" : "50% 55%");
      } else {
        assert.equal(image.loading, "lazy");
        assert(Math.abs(image.frame.width / image.frame.height - 1.5) < 0.01);
      }
    }
    if (dsf === 1) {
      await page.eval(() => window.scrollTo({top:0,behavior:"instant"}));
      await page.screenshot({ path: join(output, `${width}-fold.jpg`), quality: 88 });
      await page.screenshot({ path: join(output, `${width}-page.jpg`), quality: 85, fullPage: true });
      await page.eval(() => document.querySelector("#projects").scrollIntoView({behavior:"instant"}));
      const clip = await page.eval(() => {
        const rect = document.querySelector("#projects").getBoundingClientRect();
        return { x: 0, y: rect.top + scrollY, width: innerWidth, height: rect.height };
      });
      const { data } = await page.send("Page.captureScreenshot", {
        format: "jpeg", quality: 88, captureBeyondViewport: true,
        clip: { ...clip, scale: 1 },
      });
      writeFileSync(join(output, `${width}-projects.jpg`), Buffer.from(data, "base64"));
    }
    // An unsupported source type makes the browser use the real JPEG fallback.
    await page.eval(async () => {
      for (const source of document.querySelectorAll("picture source")) source.type = "image/x-unsupported";
      await new Promise(resolve => requestAnimationFrame(resolve));
      await Promise.all([...document.images].map(image => image.decode()));
    });
    const fallback = await imageMetrics(page);
    assert(fallback.images.every(image => image.loaded && image.src.endsWith(".jpg")));
    assert.deepEqual(errors, []);
    assert.deepEqual(page.consoleErrors, []);
    results.push({ width, height, dsf, initial, metrics, fallback, errors });
    await page.close();
  }

  // Hold image responses until the empty frames have been measured, then release.
  for (const [width, height] of [[375,812], [1440,900]]) {
    const page = await browser.newPage({ width, height, reducedMotion: true });
    await page.send("Network.enable");
    await page.send("Network.setCacheDisabled", { cacheDisabled: true });
    const pending = [];
    let hold = true;
    browser.on(page.sessionId, "Fetch.requestPaused", event => {
      if (hold) pending.push(event.requestId);
      else page.send("Fetch.continueRequest", { requestId: event.requestId });
    });
    await page.send("Fetch.enable", { patterns: [{ urlPattern: "*/assets/*" }] });
    await page.send("Page.navigate", {url});
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await page.eval(() => document.images.length === 4 && document.readyState !== "loading")) break;
      await sleep(50);
    }
    await page.eval(async () => { await document.fonts.ready; });
    const before = await imageMetrics(page);
    assert.equal(before.images.length, 4);
    assert(before.images.every(image => !image.loaded && image.frame.height > 0));
    hold = false;
    await Promise.all(pending.map(requestId => page.send("Fetch.continueRequest", { requestId })));
    await page.wheel(10000, { step: 700, pauseMs: 25 });
    await page.eval(async () => { await Promise.all([...document.images].map(image => image.decode())); });
    const after = await imageMetrics(page);
    assert(after.images.every(image => image.loaded));
    assert.deepEqual(after.images.map(image => image.frame), before.images.map(image => image.frame));
    results.push({ width, delayedImages: { before, after } });
    await page.close();
  }
  writeFileSync(join(output, "image-checks.json"), JSON.stringify({ ...metadata, filesVerified: 32, results }, null, 2) + "\n");
  console.log("PASS: 32 exported files, responsive WebP/JPEG, frames, disclosures, CLS and delayed images. " + output);
} finally {
  await browser.close();
}
