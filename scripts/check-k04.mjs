import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { Browser, sleep } from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";

const url = process.argv[2] || "http://localhost:4174";
const output = "docs/k04";
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = [];

async function press(page, key, code = key) {
  const virtualKey = { Enter: 13, Tab: 9, Escape: 27 }[key];
  await page.send("Input.dispatchKeyEvent", { type: "keyDown", key, code, text: key === "Enter" ? "\r" : undefined, windowsVirtualKeyCode: virtualKey, nativeVirtualKeyCode: virtualKey });
  await page.send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: virtualKey, nativeVirtualKeyCode: virtualKey });
}
async function activate(page, selector) {
  await page.eval((target) => document.querySelector(target).focus(), selector);
  await press(page, "Enter");
  await sleep(100);
}
async function fill(page, selector, text) {
  await page.eval((target) => {
    const element = document.querySelector(target);
    element.focus();
    element.select();
  }, selector);
  await page.send("Input.insertText", { text });
}
try {
  for (const width of [1440, 768, 375]) {
    const height = width === 1440 ? 900 : width === 768 ? 1024 : 812;
    const page = await browser.newPage({ width, height, reducedMotion: true });
    const requests = [];
    const errors = [];
    await page.send("Network.enable");
    browser.on(page.sessionId, "Network.requestWillBeSent", (event) => requests.push({ method: event.request.method, url: event.request.url, body: event.request.postData }));
    browser.on(page.sessionId, "Network.responseReceived", (event) => {
      if (event.response.status >= 400) errors.push(event.response.status + " " + event.response.url);
    });
    browser.on(page.sessionId, "Runtime.consoleAPICalled", (event) => {
      if (event.type === "error") errors.push("Console error");
    });
    await page.goto(url);
    await page.wheel(9000, { step: 700, pauseMs: 15 });
    await page.eval(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await sleep(200);
    const layout = await page.eval(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      headings: [...document.querySelectorAll("h1,h2,h3")].map((heading) => { const range = document.createRange(); range.selectNodeContents(heading); return { text: heading.textContent, lines: new Set([...range.getClientRects()].filter((rect) => rect.width > 0).map((rect) => Math.round(rect.top))).size }; }),
      images: [...document.images].map((image) => ({ src: image.getAttribute("src"), loaded: image.complete && image.naturalWidth > 0, alt: image.alt })),
      animation: [...document.querySelectorAll("*")].some((element) => getComputedStyle(element).animationName !== "none"),
    }));
    assert.equal(layout.overflow, false);
    assert.equal(await page.eval(() => document.querySelectorAll("h1").length), 1);
    assert.equal(layout.images.length, 4);
    assert(layout.images.every((image) => image.loaded && image.alt));
    assert(layout.headings.every((heading) => heading.lines <= 2.1), JSON.stringify(layout.headings));
    assert.equal(layout.animation, false);
    await page.screenshot({ path: output + "/" + width + "-fold.jpg", quality: 85 });
    await page.screenshot({ path: output + "/" + width + "-page.jpg", quality: 80, fullPage: true });

    if (width < 900) {
      await activate(page, 'button[aria-controls="main-navigation"]');
      assert.equal(await page.eval(() => document.querySelector('button[aria-controls]').getAttribute("aria-expanded")), "true");
      await press(page, "Tab");
      assert.equal(await page.eval(() => document.activeElement.textContent), "Projects");
      await press(page, "Escape");
      assert.equal(await page.eval(() => document.activeElement.textContent), "Menu");
      assert.equal(await page.eval(() => document.querySelector('button[aria-controls]').getAttribute("aria-expanded")), "false");
      await activate(page, 'button[aria-controls]');
      await activate(page, 'nav a[href="#studio"]');
      assert.equal(await page.eval(() => location.hash), "#studio");
      assert.equal(await page.eval(() => document.querySelector('button[aria-controls]').getAttribute("aria-expanded")), "false");
      await page.eval(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await activate(page, 'button[aria-controls]');
      await page.send("Input.dispatchMouseEvent", { type: "mousePressed", x: 10, y: 450, button: "left", clickCount: 1 });
      await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: 10, y: 450, button: "left", clickCount: 1 });
      await sleep(100);
      assert.equal(await page.eval(() => document.querySelector('button[aria-controls]').getAttribute("aria-expanded")), "false");
    }
    for (const target of ["projects", "studio", "services", "process", "contact"]) {
      if (width < 900) await activate(page, 'button[aria-controls]');
      await activate(page, 'nav a[href="#' + target + '"]');
      assert.equal(await page.eval(() => location.hash), "#" + target);
    }
    await activate(page, 'main a[href="#contact"]');
    assert.equal(await page.eval(() => location.hash), "#contact");


    const baseline = requests.length;
    const beforeStorage = await page.eval(async () => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookie: document.cookie, databases: (await indexedDB.databases()).map((database) => database.name) }));
    await activate(page, 'button[type="submit"]');
    assert.equal(await page.eval(() => document.querySelectorAll('[aria-invalid="true"]').length), 3);
    assert.equal(await page.eval(() => document.activeElement.id), "enquiry-name");
    assert.equal(await page.eval(() => getComputedStyle(document.activeElement).outlineStyle), "solid");
    await fill(page, "#enquiry-name", "Example Person");
    await fill(page, "#enquiry-email", "invalid-email");
    await fill(page, "#enquiry-message", "A sample home in a woodland setting.");
    await activate(page, 'button[type="submit"]');
    assert.equal(await page.eval(() => document.querySelector("#email-error").textContent), "Please enter a valid email address.");
    assert.equal(await page.eval(() => document.activeElement.id), "enquiry-email");
    await fill(page, "#enquiry-email", "example@example.com");
    await activate(page, 'button[type="submit"]');
    assert.equal(await page.eval(() => document.querySelector('[role="status"]').textContent), "Demo only — your enquiry has not been sent or saved.");
    assert.equal(await page.eval(() => [...document.querySelectorAll("input,textarea")].every((input) => input.value === "")), true);
    await sleep(200);
    assert.equal(requests.length, baseline, "No request may be made during form interaction");
    const afterStorage = await page.eval(async () => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookie: document.cookie, databases: (await indexedDB.databases()).map((database) => database.name) }));
    assert.deepEqual(afterStorage, beforeStorage);
    assert.deepEqual(afterStorage, { local: {}, session: {}, cookie: "", databases: [] });
    assert.deepEqual(errors, []);
    assert.deepEqual(page.consoleErrors, []);
    assert(requests.every((request) => new URL(request.url).origin === new URL(url).origin));
    results.push({ width, layout, checks: ["resources", "no overflow", "headings", "navigation", "keyboard menu", "empty fields", "invalid email", "valid demo", "field reset", "visible focus", "no form requests", "no storage/cookies/databases", "reduced motion", "no console errors"], requestsDuringForm: requests.length - baseline });
    await page.close();
  }
  writeFileSync(output + "/browser-checks.json", JSON.stringify({ url, results }, null, 2) + "\n");
  console.log("PASS: static export at 1440, 768 and 375px; navigation, keyboard, form, privacy, images and console.");
} finally {
  await browser.close();
}
