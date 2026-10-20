import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  Browser,
  sleep,
} from "../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs";
import { prepareRun } from "./qa-output.mjs";

const { url, output, metadata } = prepareRun("k05", "http://localhost:4186");
execFileSync(
  process.execPath,
  ["scripts/check-k04.mjs", url, "--out", join(output, "regression")],
  { stdio: "inherit" },
);
const browser = await Browser.launch();
const results = [];

async function pressTab(page) {
  for (const type of ["keyDown", "keyUp"]) {
    await page.send("Input.dispatchKeyEvent", {
      type,
      key: "Tab",
      code: "Tab",
      windowsVirtualKeyCode: 9,
    });
  }
}

function contrast(first, second) {
  function luminance(color) {
    const [red, green, blue] = color
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map((value) => {
        const channel = Number(value) / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  }
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

try {
  const viewports = [
    [1366, 768, 100],
    [1440, 900, 100],
    [375, 812, 100],
    [375, 812, 200],
    [768, 1024, 200],
    [900, 900, 200],
    [1440, 900, 200],
  ];
  for (const [width, height, fontScale] of viewports) {
    const page = await browser.newPage({ width, height });
    await page.goto(url);
    await page.eval((scale) => {
      document.documentElement.style.fontSize = scale + "%";
    }, fontScale);
    await sleep(600);
    const layout = await page.eval(() => {
      function bounds(selector) {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, width: rect.width };
      }
      return {
        viewport: { width: innerWidth, height: innerHeight },
        overflow: document.documentElement.scrollWidth > innerWidth,
        header: bounds("header"),
        image: bounds("main img"),
        intro: bounds("main section p"),
        cta: bounds('main a[href="#contact"]'),
      };
    });
    assert.equal(
      layout.overflow,
      false,
      JSON.stringify({ width, fontScale, layout }),
    );
    assert(
      Math.abs(layout.image.top - layout.header.bottom) <= 1,
      "Hero image must follow the header without overlap or fixed compensation.",
    );
    if (fontScale === 100) {
      assert(
        layout.cta.bottom <= height,
        "Hero action must be inside the first screen.",
      );
      assert(
        layout.intro.bottom <= height,
        "Hero copy must be inside the first screen.",
      );
    }
    // Check that every navigation item is reachable with real keyboard events.
    await pressTab(page);
    await pressTab(page);
    if (width < 900) {
      await pressTab(page);
      for (const type of ["keyDown", "keyUp"])
        await page.send("Input.dispatchKeyEvent", {
          type,
          key: "Enter",
          code: "Enter",
          windowsVirtualKeyCode: 13,
          text: type === "keyDown" ? "\r" : undefined,
        });
    }
    for (const label of [
      "Projects",
      "Studio",
      "Services",
      "Process",
      "Contact",
    ]) {
      await pressTab(page);
      const focused = await page.eval(() => {
        const rect = document.activeElement.getBoundingClientRect();
        return {
          text: document.activeElement.textContent,
          left: rect.left,
          right: rect.right,
          focus: getComputedStyle(document.activeElement).outlineStyle,
        };
      });
      assert.equal(focused.text, label);
      assert(
        focused.left >= 0 && focused.right <= width,
        "Navigation must remain within the screen.",
      );
      assert.equal(focused.focus, "solid");
    }
    await page.eval(() => document.activeElement.blur());
    await page.eval(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: join(output, width + "x" + height + "-" + fontScale + "-fold.jpg"),
      quality: 85,
    });
    results.push({
      width,
      height,
      fontScale,
      motion: "normal",
      layout,
      checks: [
        "no overflow",
        "header in flow",
        "keyboard navigation and focus",
        ...(fontScale === 100 ? ["first-screen copy and action"] : []),
      ],
    });
    await page.close();
  }

  const page = await browser.newPage({
    width: 1440,
    height: 900,
    reducedMotion: true,
  });
  await page.goto(url);
  await pressTab(page);
  for (let index = 0; index < 2; index++) {
    await page.eval(
      (position) => document.querySelectorAll("footer a")[position].focus(),
      index,
    );
    const focus = await page.eval(() => ({
      text: document.activeElement.textContent,
      color: getComputedStyle(document.activeElement).outlineColor,
      style: getComputedStyle(document.activeElement).outlineStyle,
      background: getComputedStyle(document.querySelector("footer"))
        .backgroundColor,
    }));
    const ratio = contrast(focus.color, focus.background);
    assert.equal(focus.style, "solid");
    assert(ratio >= 3, "Footer focus contrast must be at least 3:1.");
    results.push({ footer: focus, contrast: ratio });
    await page.screenshot({
      path: join(output, "footer-focus-" + index + ".jpg"),
      quality: 85,
    });
  }
  results.push({ browser: await page.eval(() => navigator.userAgent) });
  writeFileSync(
    join(output, "targeted-checks.json"),
    JSON.stringify({ ...metadata, results }, null, 2) + "\n",
  );
  console.log("PASS: K05 targeted scenarios. Report: " + output);
} finally {
  await browser.close();
}
