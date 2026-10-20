import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Browser, sleep } from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";
import { prepareRun } from "./qa-output.mjs";

const { url, output, metadata } = prepareRun("k11", "http://localhost:4220");
const browser = await Browser.launch();
const results = [];
const responsiveFailures = [];
const toggle = "button[aria-controls]";
const submit = "button[type=submit]";

async function press(page, key, shift = false) {
  const virtualKey = { Enter: 13, Tab: 9, Escape: 27, " ": 32 }[key];
  for (const type of ["keyDown", "keyUp"]) {
    await page.send("Input.dispatchKeyEvent", {
      type, key, code: key === " " ? "Space" : key,
      windowsVirtualKeyCode: virtualKey, modifiers: shift ? 8 : 0,
      text: type === "keyDown" && key === "Enter" ? "\r" : undefined,
    });
  }
  await sleep(60);
}
async function focus(page, selector) {
  await page.eval(target => document.querySelector(target).focus(), selector);
}
async function activate(page, selector) {
  await focus(page, selector);
  await press(page, "Enter");
}
async function fill(page, selector, text) {
  await page.eval(target => {
    document.querySelector(target).focus();
    document.querySelector(target).select();
  }, selector);
  await page.send("Input.insertText", { text });
  await sleep(50);
}
async function expectFocus(page, selector) {
  assert.equal(await page.eval(target => document.activeElement.matches(target), selector), true, "Expected focus: " + selector);
}
async function expectClosed(page) {
  assert.equal(await page.eval(() => document.querySelector("button[aria-controls]").ariaExpanded), "false");
}
async function capture(page, width, state, selector) {
  await page.eval(target => document.querySelector(target).scrollIntoView({ behavior: "instant", block: "start" }), selector);
  await sleep(100);
  await page.screenshot({ path: join(output, width + "-" + state + ".jpg"), quality: 88 });
}
async function click(page, selector) {
  const point = await page.eval(target => {
    const rect = document.querySelector(target).getBoundingClientRect();
    return { x: rect.left + Math.min(rect.width / 2, 20), y: rect.top + 10 };
  }, selector);
  for (const type of ["mousePressed", "mouseReleased"]) {
    await page.send("Input.dispatchMouseEvent", { ...point, type, button: "left", clickCount: 1 });
  }
  await sleep(60);
}

try {
  for (const width of [375, 768, 1440]) {
    const height = width === 375 ? 812 : width === 768 ? 1024 : 900;
    const page = await browser.newPage({ width, height, reducedMotion: true });
    const requests = [];
    const errors = [];
    await page.send("Network.enable");
    browser.on(page.sessionId, "Network.requestWillBeSent", event => requests.push(event.request));
    browser.on(page.sessionId, "Network.responseReceived", event => {
      if (event.response.status >= 400) errors.push(event.response.status + " " + event.response.url);
    });
    browser.on(page.sessionId, "Runtime.consoleAPICalled", event => {
      if (["warning", "error"].includes(event.type)) errors.push(event.type);
    });
    // Detect attempted writes as well as persistent state after form interaction.
    await page.send("Page.addScriptToEvaluateOnNewDocument", { source: `
      window.demoWrites = [];
      for (const method of ['setItem', 'removeItem', 'clear']) {
        const original = Storage.prototype[method];
        Storage.prototype[method] = function(...args) { window.demoWrites.push('storage:' + method); return original.apply(this, args); };
      }
      const cookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
      Object.defineProperty(Document.prototype, 'cookie', { ...cookie, set(value) { window.demoWrites.push('cookie'); cookie.set.call(this, value); } });
      for (const method of ['open', 'deleteDatabase']) {
        const original = IDBFactory.prototype[method];
        IDBFactory.prototype[method] = function(...args) { window.demoWrites.push('indexedDB:' + method); return original.apply(this, args); };
      }
      window.errorFocus = [];
      document.addEventListener('focusin', event => {
        if (event.target.getAttribute('aria-invalid') === 'true') {
          const ids = event.target.getAttribute('aria-describedby')?.split(' ') || [];
          window.errorFocus.push({ id: event.target.id, descriptionsReady: ids.length > 0 && ids.every(id => document.getElementById(id)) });
        }
      });
    ` });
    await page.goto(url);
    await page.wheel(10000, { step: 800, pauseMs: 15 });
    await page.eval(async () => Promise.all([...document.images].map(image => image.decode())));
    await page.eval(() => window.scrollTo({ top: 0, behavior: "instant" }));

    await press(page, "Tab");
    await expectFocus(page, 'a[href="#main"]');
    await press(page, "Enter");
    await expectFocus(page, "#main");
    if (width < 900) {
      await focus(page, toggle);
      await press(page, " ");
      await press(page, "Tab");
      // The current compact drawer has a home link before Projects.
      await expectFocus(page, 'nav a[href="#main"]');
      await capture(page, width, "menu-focus", "header");
      await press(page, "Escape");
      await expectFocus(page, toggle);
      await expectClosed(page);
      await press(page, "Enter");
      await press(page, "Tab");
      await expectFocus(page, 'nav a[href="#main"]');
      for (const section of ["projects", "studio", "services", "process", "contact"]) {
        await press(page, "Tab");
        await expectFocus(page, 'nav a[href="#' + section + '"]');
      }
      await press(page, "Tab");
      await expectFocus(page, 'main a[href="#contact"]');
      await expectClosed(page);
      await activate(page, toggle);
      await press(page, "Tab", true);
      await expectFocus(page, 'a[href="#main"]:not(header a)');
      await expectClosed(page);
      await activate(page, toggle);
      await press(page, "Tab");
      await click(page, "h1");
      await expectClosed(page);
      assert.equal(await page.eval(() => document.activeElement.closest("nav") === null), true);
      await activate(page, toggle);
      await press(page, "Tab");
      await page.eval(() => document.querySelector("#enquiry-name").scrollIntoView({ behavior: "instant", block: "center" }));
      await click(page, "#enquiry-name");
      await expectFocus(page, "#enquiry-name");
      await expectClosed(page);
    }
    for (const section of ["projects", "studio", "services", "process", "contact"]) {
      if (width < 900) await activate(page, toggle);
      await activate(page, 'nav a[href="#' + section + '"]');
      await expectFocus(page, "#" + section);
      assert.equal(await page.eval(() => location.hash), "#" + section);
      if (width < 900) await expectClosed(page);
    }
    await activate(page, 'main a[href="#contact"]');
    await expectFocus(page, "#contact");
    await press(page, "Tab");
    await expectFocus(page, "#enquiry-name");

    const baseline = requests.length;
    const hashBeforeForm = await page.eval(() => location.href);
    await press(page, "Tab");
    await expectFocus(page, "#enquiry-email");
    await press(page, "Tab");
    await expectFocus(page, "#enquiry-message");
    await press(page, "Tab");
    await expectFocus(page, submit);
    await press(page, "Enter");
    await expectFocus(page, "#enquiry-name");
    assert.equal(await page.eval(() => document.querySelectorAll('[aria-invalid="true"]').length), 3);
    await capture(page, width, "form-errors", "#contact");
    await fill(page, "#enquiry-name", "   ");
    await fill(page, "#enquiry-email", "   ");
    await fill(page, "#enquiry-message", "   ");
    await activate(page, submit);
    await expectFocus(page, "#enquiry-name");
    await fill(page, "#enquiry-name", "Example Person");
    assert.equal(await page.eval(() => document.querySelector("#name-error") === null), true);
    await press(page, "Tab");
    await expectFocus(page, "#enquiry-email");
    await page.send("Input.insertText", { text: "invalid-email" });
    await press(page, "Tab");
    await expectFocus(page, "#enquiry-message");
    await page.send("Input.insertText", { text: "A sample woodland home." });
    await press(page, "Tab");
    await press(page, "Enter");
    await expectFocus(page, "#enquiry-email");
    assert.equal(await page.eval(() => document.querySelector("#email-error").textContent), "Please enter a valid email address.");
    await fill(page, "#enquiry-email", "example@example.com");
    assert.equal(await page.eval(() => document.querySelectorAll('[aria-invalid="true"]').length), 0);
    await expectFocus(page, "#enquiry-email");
    await capture(page, width, "form-corrected", "#contact");
    await press(page, "Tab");
    await press(page, "Tab");
    await expectFocus(page, submit);
    await press(page, "Enter");
    assert.equal(await page.eval(() => document.querySelector('[role="status"]').textContent), "Demo only — your enquiry has not been sent or saved.");
    assert.equal(await page.eval(() => [...document.querySelectorAll("input,textarea")].every(input => input.value === "")), true);
    await capture(page, width, "form-complete", width < 900 ? "#enquiry-message" : "#contact");
    await press(page, "Tab", true);
    await expectFocus(page, "#enquiry-message");
    await page.send("Input.insertText", { text: "Another sample" });
    assert.equal(await page.eval(() => document.querySelector('[role="status"]').textContent), "");
    await activate(page, submit);
    await expectFocus(page, "#enquiry-name");
    await fill(page, "#enquiry-name", "Sample Person");
    await fill(page, "#enquiry-email", "sample@example.com");
    await fill(page, "#enquiry-message", " ");
    await activate(page, submit);
    await expectFocus(page, "#enquiry-message");
    await fill(page, "#enquiry-message", "Second sample project.");
    await activate(page, submit);
    assert.equal(await page.eval(() => document.querySelector('[role="status"]').textContent), "Demo only — your enquiry has not been sent or saved.");
    await sleep(200);
    assert.equal(requests.length, baseline, "No requests during form interaction");
    const privacy = await page.eval(async () => ({
      writes: window.demoWrites, local: { ...localStorage }, session: { ...sessionStorage },
      cookie: document.cookie, databases: await indexedDB.databases(), sameUrl: location.href,
    }));
    assert.deepEqual(privacy, { writes: [], local: {}, session: {}, cookie: "", databases: [], sameUrl: hashBeforeForm });
    const errorFocus = await page.eval(() => window.errorFocus);
    assert(errorFocus.length >= 3 && errorFocus.every(event => event.descriptionsReady));
    const reduced = await page.eval(() => ({
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
      static: [...document.querySelectorAll("*")].every(element => {
        const css = getComputedStyle(element);
        return css.animationName === "none" && css.transform === "none" && parseFloat(css.transitionDuration) === 0;
      }),
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    assert.deepEqual(reduced, { scroll: "auto", static: true, overflow: false });
    assert.deepEqual(errors, []);
    assert.deepEqual(page.consoleErrors, []);
    results.push({ width, height, requestsDuringForm: requests.length - baseline, privacy, errorFocus, reduced, errors });

    if (width === 375) {
      // Keep checking the other export widths when a breakpoint regression fails.
      try {
        for (let iteration = 0; iteration < 5; iteration++) {
          await focus(page, toggle);
          await page.setViewport({ width: 900, height: 900 });
          await sleep(150);
          await expectFocus(page, 'nav a[href="#projects"]');
          await focus(page, 'nav a[href="#studio"]');
          await page.setViewport({ width: 899, height: 900 });
          await sleep(150);
          await expectFocus(page, toggle);
          await expectClosed(page);
        }
        await focus(page, "#enquiry-name");
        await page.setViewport({ width: 1440, height: 900 });
        await sleep(150);
        await expectFocus(page, "#enquiry-name");
        results.push({ responsiveFocus: "5 boundary round trips at 899/900; unrelated field focus preserved" });
      } catch (error) {
        const active = await page.eval(() => ({ tag: document.activeElement.tagName, id: document.activeElement.id }));
        responsiveFailures.push({ check: "899/900 focus recovery", error: String(error), active });
      }
    }
    await page.close();
  }
  const page = await browser.newPage({ width: 375, height: 812 });
  await page.goto(url);
  await page.send("DOM.enable");
  await page.send("CSS.enable");
  const { root } = await page.send("DOM.getDocument");
  const feedback = [];
  for (const selector of [toggle, "#enquiry-name", "#enquiry-email", "#enquiry-message"]) {
    const { nodeId } = await page.send("DOM.querySelector", { nodeId: root.nodeId, selector });
    await page.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: ["hover"] });
    const hover = await page.eval(target => {
      const css = getComputedStyle(document.querySelector(target));
      return { border: css.borderColor, decoration: css.textDecorationLine, transform: css.transform };
    }, selector);
    if (selector === toggle) assert.equal(hover.decoration, "underline");
    else assert.equal(hover.border, "rgb(40, 43, 40)");
    assert.equal(hover.transform, "none");
    await page.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
    feedback.push({ selector, hover });
  }
  await activate(page, submit);
  const { nodeId: invalidField } = await page.send("DOM.querySelector", { nodeId: root.nodeId, selector: "#enquiry-name" });
  await page.send("CSS.forcePseudoState", { nodeId: invalidField, forcedPseudoClasses: ["hover", "focus-visible"] });
  const invalidFocus = await page.eval(() => {
    const css = getComputedStyle(document.querySelector("#enquiry-name"));
    return { border: css.borderColor, outline: css.outlineColor, width: css.outlineWidth, offset: css.outlineOffset };
  });
  assert.deepEqual(invalidFocus, { border: "rgb(152, 61, 50)", outline: "rgb(40, 43, 40)", width: "3px", offset: "5px" });
  await page.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  const runtimeReduced = await page.eval(() => [...document.querySelectorAll("*")].every(element => {
    const css = getComputedStyle(element);
    return css.transform === "none" && css.animationName === "none" && parseFloat(css.transitionDuration) === 0;
  }));
  assert.equal(runtimeReduced, true);
  results.push({ feedback, invalidFocus, runtimeReduced });
  await page.close();
  writeFileSync(join(output, "interaction-checks.json"), JSON.stringify({ ...metadata, results, responsiveFailures }, null, 2) + "\n");
  assert.deepEqual(responsiveFailures, [], "Responsive focus failures; see interaction-checks.json");
  console.log("PASS: K11 keyboard, focus recovery, error correction, repeat demo, privacy and reduced motion. " + output);
} finally {
  await browser.close();
}
