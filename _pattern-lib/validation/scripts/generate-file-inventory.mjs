import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const ignoredDirectories = new Set([
  ".cache",
  ".git",
  ".next",
  ".nuxt",
  ".parcel-cache",
  ".svelte-kit",
  ".turbo",
  ".vite",
  "build",
  "cache",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "releases",
  "storage",
  "tmp",
  "vendor",
]);
const ignoredFiles = new Set([".DS_Store", "export-manifest.json"]);
const ignoredFileSuffixes = [".previous"];

const sourceDateEpochInput = process.env.SOURCE_DATE_EPOCH ?? "1785801600";
if (!/^\d+$/.test(sourceDateEpochInput)) {
  throw new Error("SOURCE_DATE_EPOCH must contain decimal digits only.");
}
const sourceDateEpoch = Number.parseInt(sourceDateEpochInput, 10);
if (!Number.isSafeInteger(sourceDateEpoch) || sourceDateEpoch < 315532800) {
  throw new Error("SOURCE_DATE_EPOCH must be an integer at or after 1980-01-01.");
}

async function walk(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name, "en"));

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    if (
      entry.isFile()
      && (
        ignoredFiles.has(entry.name)
        || ignoredFileSuffixes.some((suffix) => entry.name.endsWith(suffix))
      )
    ) continue;

    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile()) files.push(path);
    else {
      throw new Error(
        `Unsupported filesystem entry in release source: ${relative(root, path)}`,
      );
    }
  }
  return files;
}

const files = (await walk(root)).sort((left, right) =>
  relative(root, left).localeCompare(relative(root, right), "en"),
);
const inventory = [];
for (const path of files) {
  const content = await readFile(path);
  inventory.push({
    path: relative(root, path).split(sep).join("/"),
    bytes: content.byteLength,
    sha256: createHash("sha256").update(content).digest("hex"),
  });
}

const rootHash = createHash("sha256");
for (const file of inventory) {
  rootHash.update(`${file.path}\0${file.bytes}\0${file.sha256}\n`);
}

const version = (await readFile(join(root, "VERSION"), "utf8")).trim();
await writeFile(join(root, "export-manifest.json"), `${JSON.stringify({
  schemaVersion: "1.0.0",
  version,
  generatedAt: new Date(sourceDateEpoch * 1000).toISOString(),
  sourceDateEpoch,
  rootSha256: rootHash.digest("hex"),
  excludedDirectories: [...ignoredDirectories].sort(),
  excludedFileSuffixes: [...ignoredFileSuffixes].sort(),
  files: inventory,
}, null, 2)}\n`);
console.log(
  `Generated file inventory: ${inventory.length} files for version ${version}.`,
);
