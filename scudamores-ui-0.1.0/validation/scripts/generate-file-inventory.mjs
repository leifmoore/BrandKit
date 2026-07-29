import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const output = "validation/reports/file-inventory.json";
const excludedSegments = new Set(["node_modules", "vendor", ".cache", "dist", "build", "tmp", "releases"]);

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    const rel = relative(root, path).split(sep).join("/");
    if (rel === output || rel.split("/").some((segment) => excludedSegments.has(segment))) continue;
    if (entry.isDirectory()) result.push(...await walk(path));
    else if (entry.isFile()) result.push(rel);
  }
  return result;
}

const files = (await walk(root)).sort();
const items = [];
for (const path of files) {
  const data = await readFile(join(root, path));
  const details = await stat(join(root, path));
  items.push({ path, bytes: details.size, sha256: createHash("sha256").update(data).digest("hex") });
}

const aggregate = createHash("sha256");
for (const item of items) aggregate.update(`${item.sha256}  ${item.path}\n`);
await writeFile(join(root, output), `${JSON.stringify({ schemaVersion: 1, generatedAt: "2026-07-28", algorithm: "sha256", count: items.length, aggregate: aggregate.digest("hex"), items }, null, 2)}\n`);
console.log(`Inventoried ${items.length} release files.`);
