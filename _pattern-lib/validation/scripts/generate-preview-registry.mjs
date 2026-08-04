import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const output = join(root, "react/preview-registry.tsx");
const names = (await readdir(join(root, "catalog/recipes")))
  .filter((name) => name.endsWith(".json"))
  .sort();
const manifests = await Promise.all(names.map(async (name) =>
  JSON.parse(await readFile(join(root, "catalog/recipes", name), "utf8"))
));

const toImport = (path) => {
  const value = relative(dirname(output), join(root, path)).split(sep).join("/");
  return value.startsWith(".") ? value : `./${value}`;
};
const imports = ["import type { ComponentType } from \"react\";"];
const rows = [];
let fixtureIndex = 0;
for (const [index, manifest] of manifests.entries()) {
  const component = `Pattern${index}`;
  imports.push(`import { ${manifest.react.export} as ${component} } from ${JSON.stringify(toImport(manifest.react.entry))};`);
  const scenarios = [];
  for (const scenario of manifest.scenarios) {
    const fixture = `fixture${fixtureIndex++}`;
    imports.push(`import ${fixture} from ${JSON.stringify(toImport(scenario.fixture))};`);
    scenarios.push(`${JSON.stringify(scenario.id)}: { title: ${JSON.stringify(scenario.title)}, fixture: ${fixture} }`);
  }
  rows.push(`${JSON.stringify(manifest.id)}: { Component: ${component}, scenarios: { ${scenarios.join(", ")} } }`);
}
const source = `${imports.join("\n")}\n\nexport interface PatternPreviewRegistration {\n  Component: ComponentType<any>;\n  scenarios: Record<string, { title: string; fixture: unknown }>;\n}\n\nexport const patternPreviewRegistry = {\n  ${rows.join(",\n  ")}\n} satisfies Record<string, PatternPreviewRegistration>;\n\nexport type PatternPreviewId = keyof typeof patternPreviewRegistry;\n`;
await writeFile(output, source);
console.log(`Generated React preview registry: ${manifests.length} patterns / ${fixtureIndex} scenarios.`);
