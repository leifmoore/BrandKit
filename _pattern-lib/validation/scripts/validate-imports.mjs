import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(path);
  }
  return files;
}
const failures = [];
const forbidden = [
  /AppContext/, /sql\.js/, /getDb\b/, /useQuery\b/, /mockUsers/, /localStorage/,
  /sessionStorage/, /from\s+["'][^"']*\/src\//, /from\s+["'][^"']*_comp-lib/,
  /permission/i, /window\.location/,
];
for (const path of await walk(join(root, "recipes"))) {
  const source = await readFile(path, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(source)) failures.push(`${path.replace(`${root}/`, "")}: forbidden ${pattern}`);
  }
  for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
    const value = match[1];
    if (value.startsWith("@scudamores/ui/") || value.startsWith(".") || ["react", "lucide-react", "date-fns"].includes(value) || value.startsWith("date-fns/")) continue;
    failures.push(`${path.replace(`${root}/`, "")}: undeclared import ${value}`);
  }
}
if (failures.length) {
  console.error(`Import isolation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("Import isolation passed: application coupling and escaping imports absent.");
