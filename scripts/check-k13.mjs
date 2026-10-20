import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Browser, sleep } from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";
import { prepareRun } from "./qa-output.mjs";

const { url, output, metadata } = prepareRun("k13", "http://localhost:4240");
const browser = await Browser.launch();
const results = [];

async function press(page, key) {
  for (const type of ["keyDown", "keyUp"]) {
    await page.send("Input.dispatchKeyEvent", {
      type, key, code: key, windowsVirtualKeyCode: { Tab: 9, Enter: 13 }[key],
      text: type === "keyDown" && key === "Enter" ? "\r" : undefined,
    });
  }
  await sleep(80);
}
async function fill(page, selector, text) {
  await page.eval(target => {
    const input = document.querySelector(target);
    input.focus();
    input.select();
  }, selector);
  await page.send("Input.insertText", { text });
}
async function submit(page) {
  await page.eval(() => document.querySelector("button[type=submit]").focus());
  await press(page, "Enter");
}
async function checkError(page, field, capture) {
  // Measure the actual post-submit position before any screenshot scrolling.
  const state = await page.eval(name => {
    const input = document.getElementById("enquiry-" + name);
    const wrapper = input.parentElement;
    const rect = wrapper.getBoundingClientRect();
    const label = wrapper.querySelector("label");
    const error = document.getElementById(name + "-error");
    const style = getComputedStyle(input);
    return {
      field: name, focused: document.activeElement === input,
      top: rect.top, bottom: rect.bottom, viewportHeight: innerHeight,
      labelVisible: label.getBoundingClientRect().top >= 0,
      errorVisible: error.getBoundingClientRect().bottom <= innerHeight,
      invalid: input.getAttribute("aria-invalid"),
      described: input.getAttribute("aria-describedby").split(" ").every(id => document.getElementById(id)),
      outline: { style: style.outlineStyle, width: style.outlineWidth },
      scroll: scrollY,
    };
  }, field);
  assert(state.focused && state.labelVisible && state.errorVisible, JSON.stringify(state));
  assert(state.top >= 8 && state.bottom <= state.viewportHeight - 8, JSON.stringify(state));
  assert.equal(state.invalid, "true");
  assert(state.described);
  assert.deepEqual(state.outline, { style: "solid", width: "3px" });
  await sleep(250);
  assert.equal(await page.eval(() => scrollY), state.scroll, "Error recovery must not animate scrolling");
  await page.screenshot({ path: join(output, capture + "-" + field + "-error.jpg"), quality: 88 });
  return state;
}

try {
  for (const [width, height] of [[375, 812], [768, 1024], [1440, 900], [375, 420]]) {
    for (const reducedMotion of [false, true]) {
      const page = await browser.newPage({ width, height, reducedMotion });
      await page.goto(url);
      const prefix = width + "x" + height + (reducedMotion ? "-reduce" : "-normal");
      await press(page, "Tab");
      await press(page, "Tab");
      const home = await page.eval(() => ({
        text: document.activeElement.textContent.trim(), name: document.activeElement.getAttribute("aria-label"),
        href: document.activeElement.getAttribute("href"), outline: getComputedStyle(document.activeElement).outlineWidth,
      }));
      assert(home.name.includes(home.text) && home.text === "Luxury Architects");
      assert.equal(home.href, "#main");
      assert.equal(home.outline, "3px");
      const ax = await page.send("Accessibility.getFullAXTree");
      const accessibleHome = ax.nodes.find(node => node.role?.value === "link" && node.name?.value === home.name);
      assert(accessibleHome, "Home label must be present in the accessibility tree");
      await press(page, "Enter");
      assert.equal(await page.eval(() => document.activeElement.id), "main");
      await submit(page);
      const name = await checkError(page, "name", prefix);
      await fill(page, "#enquiry-name", "Example Person");
      await fill(page, "#enquiry-email", "invalid-email");
      await submit(page);
      const email = await checkError(page, "email", prefix);
      await fill(page, "#enquiry-email", "example@example.com");
      await submit(page);
      const message = await checkError(page, "message", prefix);
      assert.deepEqual(page.consoleErrors, []);
      results.push({ width, height, reducedMotion, home, accessibleName: accessibleHome.name.value, name, email, message });
      await page.close();
    }
  }
  for (const width of [375, 768, 1440]) {
    const page = await browser.newPage({ width, height: width === 375 ? 812 : 1024, reducedMotion: true });
    await page.goto(url);
    await page.eval(() => {
      document.documentElement.style.fontSize = "200%";
      const style = document.createElement("style");
      style.textContent = "* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }";
      document.head.append(style);
    });
    await page.wheel(20000, { step: 1000, pauseMs: 10 });
    const text = await page.eval(() => ({
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      clipped: [...document.querySelectorAll("h1,h2,h3,p,label,button,input,textarea,nav a")]
        .filter(element => element.getClientRects().length && element.scrollWidth > element.clientWidth + 1)
        .map(element => ({ tag: element.tagName, text: element.textContent.slice(0, 60) })),
    }));
    assert.equal(text.scrollWidth, text.width);
    assert.deepEqual(text.clipped, []);
    await page.eval(() => document.querySelector("#contact").scrollIntoView({ behavior: "instant" }));
    await page.screenshot({ path: join(output, width + "-text-200-spacing.jpg"), quality: 88 });
    results.push({ fontScale: "200% root", textSpacing: "WCAG 1.4.12 values simultaneously", ...text });
    await page.close();
  }
  writeFileSync(join(output, "fix-checks.json"), JSON.stringify({ ...metadata, results }, null, 2) + "\n");
  console.log("PASS: K13 home DOM/AX, visible error groups with keyboard focus, normal/reduced motion and enlarged text/spacing. " + output);
} finally {
  await browser.close();
}
