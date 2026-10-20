import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve, sep } from "node:path";

export function prepareRun(label, defaultUrl) {
  const args = process.argv.slice(2);
  const url = args[0] && !args[0].startsWith("--") ? args.shift() : defaultUrl;
  let output;
  let updateBaseline = false;
  while (args.length) {
    const argument = args.shift();
    if (argument === "--out") output = args.shift();
    else if (argument === "--update-baseline") updateBaseline = true;
    else throw new Error("Unknown argument: " + argument);
    if (argument === "--out" && !output)
      throw new Error("--out needs a directory.");
  }
  const timestamp = new Date().toISOString();
  output ??=
    ".taste-skill/checks/" + label + "/" + timestamp.replaceAll(/[:.]/g, "-");
  const baseline = resolve("docs/k04");
  const destination = resolve(output);
  if (
    (destination === baseline || destination.startsWith(baseline + sep)) &&
    !updateBaseline
  ) {
    throw new Error(
      "K04 is a historical baseline. Use --update-baseline only for an intentional replacement.",
    );
  }
  if (existsSync(output) && readdirSync(output).length && !updateBaseline) {
    throw new Error(
      "Output directory is not empty. Choose a new --out directory.",
    );
  }
  mkdirSync(output, { recursive: true });
  const hash = createHash("sha256");
  function addDirectory(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort(
      (a, b) => a.name.localeCompare(b.name),
    )) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) addDirectory(file);
      else
        hash
          .update(relative(".", file).replaceAll("\\", "/"))
          .update(readFileSync(file));
    }
  }
  for (const directory of ["app", "components", "public", "scripts"])
    addDirectory(directory);
  for (const file of ["package.json", "package-lock.json", "next.config.ts"])
    hash.update(file).update(readFileSync(file));
  const metadata = {
    timestamp,
    url,
    sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    workingTreeDirty: Boolean(
      execFileSync("git", ["status", "--porcelain"], {
        encoding: "utf8",
      }).trim(),
    ),
    sourceSha256: hash.digest("hex"),
    exportHtmlSha256: createHash("sha256")
      .update(readFileSync("out/index.html"))
      .digest("hex"),
  };
  writeFileSync(
    join(output, "run.json"),
    JSON.stringify(metadata, null, 2) + "\n",
  );
  return { url, output, metadata };
}
