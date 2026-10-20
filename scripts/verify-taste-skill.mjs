import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = JSON.parse(await readFile(path.join(root, "taste-skill-source.json"), "utf8"));
const skillRoot = path.resolve(root, process.argv[2] ?? source.localPath);

async function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) {
      files.push(...await listFiles(path.join(directory, entry.name), relative + "/"));
    } else {
      files.push(relative);
    }
  }
  return files.sort();
}

const actual = await listFiles(skillRoot);
const expected = Object.keys(source.files).sort();
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  throw new Error("Taste Skill file list differs from taste-skill-source.json.");
}
for (const relative of expected) {
  const bytes = await readFile(path.join(skillRoot, relative));
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== source.files[relative]) {
    throw new Error(`Taste Skill SHA-256 mismatch: ${relative}`);
  }
}
console.log(`Verified ${expected.length} files for ${source.name} at ${source.commit}.`);
