import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const exec = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.name.endsWith(".blade.php")) files.push(path);
  }
  return files;
}
const files = (await walk(join(root, "recipes"))).sort();
const failures = [];
const records = [];
for (const path of files) {
  const source = await readFile(path, "utf8");
  const name = relative(root, path);
  if (!source.includes("@props(")) failures.push(`${name}: missing @props declaration`);
  if (!source.includes("<x-ui.")) failures.push(`${name}: does not compose a canonical base component`);
  if (/\b(jquery|livewire|route\(|DB::|Auth::|Gate::)\b/i.test(source)) failures.push(`${name}: contains application/runtime coupling`);
  try {
    const { stdout, stderr } = await exec("php", ["-l", path]);
    records.push({ path: name, lint: `${stdout}${stderr}`.trim() });
  } catch (error) {
    failures.push(`${name}: PHP lint failed: ${error.stderr || error.message}`);
  }
}
await mkdir(join(root, "validation/reports"), { recursive: true });
await writeFile(join(root, "validation/reports/blade-static.json"), `${JSON.stringify({ schemaVersion: "1.0.0", generatedAt: "2026-08-04", files: records, failures }, null, 2)}\n`);
if (files.length !== 25) failures.push(`Expected 25 primary Blade files; found ${files.length}`);
if (failures.length) {
  console.error(`Blade static validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Blade static validation passed: ${files.length} paired recipe files.`);
await exec("php", [join(root, "validation/scripts/compile-blade.php")]);
