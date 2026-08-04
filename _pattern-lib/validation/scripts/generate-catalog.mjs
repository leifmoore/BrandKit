import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestsDirectory = join(root, "catalog/recipes");
const manifestNames = (await readdir(manifestsDirectory))
  .filter((name) => name.endsWith(".json"))
  .sort();
const manifests = await Promise.all(manifestNames.map(async (name) =>
  JSON.parse(await readFile(join(manifestsDirectory, name), "utf8"))
));

if (manifests.length !== 25) {
  throw new Error(`Expected 25 pattern manifests; found ${manifests.length}`);
}

const entries = manifests
  .map((manifest) => ({
    id: manifest.id,
    title: manifest.title,
    description: manifest.description,
    category: manifest.category,
    maturity: manifest.maturity,
    kind: manifest.kind,
    manifest: `catalog/recipes/${manifest.id}.json`,
    frameworks: ["react", "blade"],
    searchTerms: manifest.searchTerms,
  }))
  .sort((left, right) => left.title.localeCompare(right.title));

const catalog = {
  schemaVersion: "1.0.0",
  version: "0.1.0",
  name: "Scudamore's Pattern Library",
  baseLibrary: "catalog/base-library.json",
  patterns: entries,
  counts: { patterns: entries.length, react: entries.length, blade: entries.length },
};
await writeFile(join(root, "catalog/catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);

const base = JSON.parse(await readFile(join(root, "../_comp-lib/catalog/catalog.json"), "utf8"));
const baseIds = new Set((base.recipes ?? []).map(({ id }) => id));
const duplicate = entries.find(({ id }) => baseIds.has(id));
if (duplicate) throw new Error(`Pattern ID duplicates the base catalogue: ${duplicate.id}`);

const combined = {
  schemaVersion: "1.0.0",
  generatedFrom: {
    base: "_comp-lib/catalog/catalog.json",
    addOn: "_pattern-lib/catalog/catalog.json",
  },
  version: { base: base.version, patterns: catalog.version },
  components: base.components,
  patterns: [...(base.recipes ?? []), ...entries],
  foundations: base.foundations,
  utilities: base.utilities,
  deferredComponents: base.deferredComponents,
  counts: {
    components: base.components.length,
    patterns: (base.recipes ?? []).length + entries.length,
    basePatterns: (base.recipes ?? []).length,
    addOnPatterns: entries.length,
  },
};
await writeFile(join(root, "catalog/combined-catalog.json"), `${JSON.stringify(combined, null, 2)}\n`);
console.log(`Generated pattern catalogue: ${entries.length} add-on / ${combined.counts.patterns} combined.`);
