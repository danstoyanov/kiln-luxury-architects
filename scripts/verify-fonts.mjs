// Warn before a build when the local Fontshare files are missing.
// They are not in Git (see README "Font setup"), so a fresh clone builds with
// the tuned Arial fallbacks. The warning makes that visible instead of silent.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const fontshareFiles = [
  "panchang-bold.woff2",
  "switzer-regular.woff2",
  "switzer-medium.woff2",
];

const fontsFolder = new URL("../public/fonts/", import.meta.url);
const missing = fontshareFiles.filter(
  (file) => !existsSync(fileURLToPath(new URL(file, fontsFolder))),
);

if (missing.length > 0) {
  console.warn(
    [
      "",
      "WARNING: Fontshare font files are missing from public/fonts/:",
      ...missing.map((file) => `  - ${file}`),
      "The site will build with Arial fallbacks instead of Panchang and Switzer.",
      "See README.md, section \"Font setup\", to add the files before deploying.",
      "",
    ].join("\n"),
  );
}
