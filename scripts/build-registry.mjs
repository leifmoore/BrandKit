// Builds the shadcn registry served at /r/<name>.json from registry.json.
// Dependency-free equivalent of `shadcn build`: each item is written with its
// file contents inlined. Source files are read in place, so _comp-lib stays
// untouched. Also validates registry.json against the catalogue and tokens,
// and regenerates docs/prototype-claude-index.md and the REGISTRY.md item table.
//
// REGISTRY_BASE_URL rewrites cross-item URLs for local testing, e.g.
// REGISTRY_BASE_URL=http://localhost:4173 node scripts/build-registry.mjs

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const productionBase = "https://brand-kit-ashen.vercel.app";
const baseUrl = (process.env.REGISTRY_BASE_URL ?? productionBase).replace(/\/$/, "");
const outputDir = resolve(workspaceRoot, "public/r");
const indexPath = resolve(workspaceRoot, "docs/prototype-claude-index.md");
const itemSchema = "https://ui.shadcn.com/schema/registry-item.json";

const readJson = async (path) => JSON.parse(await readFile(resolve(workspaceRoot, path), "utf8"));
const registry = await readJson("registry.json");
const dependencies = await readJson("_comp-lib/react/dependencies.json");
const errors = [];
const fail = (message) => errors.push(message);

const items = registry.items;
const byName = new Map(items.map((item) => [item.name, item]));
if (byName.size !== items.length) fail("Duplicate item names in registry.json");

const nameFromUrl = (url) => url.startsWith(`${productionBase}/r/`)
  ? url.slice(`${productionBase}/r/`.length, -".json".length)
  : null;

// Every registry dependency must be one of our own items. A bare name would
// silently resolve to the public shadcn registry instead.
for (const item of items) {
  for (const dependency of item.registryDependencies ?? []) {
    const name = nameFromUrl(dependency);
    if (!name || !byName.has(name)) fail(`${item.name}: unknown registry dependency ${dependency}`);
  }
}

// Every catalogue component must be an item with the catalogue's npm packages
// at the handoff's pinned versions.
const catalogueDir = resolve(workspaceRoot, "_comp-lib/catalog/components");
const pinned = { ...dependencies.dependencies, ...dependencies.styleDependencies };
for (const file of (await readdir(catalogueDir)).filter((name) => name.endsWith(".json"))) {
  const component = JSON.parse(await readFile(resolve(catalogueDir, file), "utf8"));
  const item = byName.get(component.id);
  if (!item) {
    fail(`Catalogue component missing from registry.json: ${component.id}`);
    continue;
  }
  const expected = (component.react.npmDependencies ?? []).map(({ name }) => `${name}@${pinned[name]}`).sort();
  const actual = [...(item.dependencies ?? [])].sort();
  if (expected.join() !== actual.join()) {
    fail(`${component.id}: dependencies ${actual.join(", ")} differ from catalogue ${expected.join(", ")}`);
  }
}
for (const item of items) {
  for (const dependency of item.dependencies ?? []) {
    const at = dependency.lastIndexOf("@");
    const name = dependency.slice(0, at);
    if (pinned[name] !== dependency.slice(at + 1)) fail(`${item.name}: ${dependency} is not the handoff pin`);
  }
}

// Theme variables must match the generated foundation CSS exactly.
const declarations = (body) => Object.fromEntries(
  [...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [key, value.trim()]),
);
const block = (css, selector) => {
  const match = css.match(new RegExp(`(?:^|\\n)${selector.replace(/[.]/g, "\\.")}\\s*\\{([^}]*)\\}`));
  return match ? declarations(match[1]) : {};
};
const tokens = await readFile(resolve(workspaceRoot, "_comp-lib/foundations/css/tokens.css"), "utf8");
const brands = await readFile(resolve(workspaceRoot, "_comp-lib/foundations/css/brands.css"), "utf8");
const theme = byName.get("theme");
for (const [mode, selector] of [["light", ":root"], ["dark", ".dark"]]) {
  if (JSON.stringify(theme?.cssVars?.[mode]) !== JSON.stringify(block(tokens, selector))) {
    fail(`theme: cssVars.${mode} is out of sync with _comp-lib/foundations/css/tokens.css`);
  }
}
const tailwindTheme = await readFile(resolve(workspaceRoot, "_comp-lib/foundations/css/tailwind-theme.css"), "utf8");
const darkVariant = tailwindTheme.match(/@custom-variant dark \([^;]+\)/)?.[0];
if (!darkVariant || !(darkVariant in (theme?.css ?? {}))) {
  fail("theme: css is missing the @custom-variant dark rule from tailwind-theme.css");
}
const themeAliases = declarations(tailwindTheme);
for (const [key, value] of Object.entries(theme?.cssVars?.theme ?? {})) {
  if (themeAliases[key] !== value) fail(`theme: cssVars.theme.${key} differs from tailwind-theme.css`);
}
for (const [, selector, body] of brands.matchAll(/(\.[\w.-]+)\s*\{([^}]*)\}/g)) {
  const expected = Object.fromEntries(Object.entries(declarations(body)).map(([key, value]) => [`--${key}`, value]));
  if (JSON.stringify(theme?.css?.[selector]) !== JSON.stringify(expected)) {
    fail(`theme: css["${selector}"] is out of sync with _comp-lib/foundations/css/brands.css`);
  }
}

// Only these folders may be published, so a mistaken path (e.g. .env) can't
// leak through the public registry.
const publishableRoots = ["_comp-lib/react/", "registry/"];
const isPublishable = (path) =>
  !path.split("/").includes("..") && publishableRoots.some((root) => path.startsWith(root));

// Inline file contents.
const built = [];
for (const item of items) {
  const files = [];
  for (const file of item.files ?? []) {
    if (!isPublishable(file.path)) {
      fail(`${item.name}: ${file.path} is outside the publishable folders (${publishableRoots.join(", ")})`);
      continue;
    }
    try {
      files.push({ ...file, content: await readFile(resolve(workspaceRoot, file.path), "utf8") });
    } catch {
      fail(`${item.name}: missing file ${file.path}`);
    }
  }
  const output = { $schema: itemSchema, ...item };
  if (item.files) output.files = files;
  if (item.registryDependencies) {
    output.registryDependencies = item.registryDependencies.map((url) => url.replace(productionBase, baseUrl));
  }
  built.push(output);
}

if (errors.length) {
  console.error(`Registry build failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
for (const item of built) {
  await writeFile(resolve(outputDir, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
}
await writeFile(resolve(outputDir, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`);

// Compact index for the prototype repo's CLAUDE.md.
const install = (name) => `\`npx shadcn@4.23.0 add @scudamores/${name}\``;
const row = (item) => {
  const blade = item.meta?.blade
    ? `\`${item.meta.blade.tag}\` (${item.meta.blade.installPath})`
    : item.meta?.bladeEquivalent ?? "—";
  const beta = item.meta?.maturity === "beta" ? " (beta)" : "";
  return `| ${item.name} | ${item.description}${beta} | ${install(item.name)} | ${blade} |`;
};
const components = items.filter((item) => item.meta?.blade);
const foundations = items.filter((item) => !item.meta?.blade && item.name !== "all");
const importExceptions = components
  .filter((item) => item.meta.import !== `@/components/ui/${item.name}`)
  .map((item) => `${item.name} → \`${item.meta.import}\``);
const bladeDir = resolve(workspaceRoot, "_comp-lib/blade/library/resources/views/components/ui");
const pairedBlade = new Set(components.flatMap((item) => [item.name, item.meta.blade.installPath.split("/").pop().replace(".blade.php", "")]));
const bladeOnly = (await readdir(bladeDir))
  .filter((file) => file.endsWith(".blade.php"))
  .map((file) => file.replace(".blade.php", ""))
  .filter((name) => !pairedBlade.has(name));
const index = `<!-- Generated by scripts/build-registry.mjs from registry.json. Do not edit by hand. -->
## Scudamore's components

Install UI from the Scudamore's Brand Kit registry; don't hand-write primitives that exist here.
Setup (once): React 18.3.1, Tailwind v4, \`.npmrc\` with \`save-exact=true\`, \`npx shadcn@4.23.0 init\`, then add to \`components.json\`:
\`"registries": { "@scudamores": "${productionBase}/r/{name}.json" }\`.
Install \`theme\` first, then \`theme-provider\` (wrap the app in \`<ThemeProvider>\`). \`@scudamores/all\` installs everything.
Add one component at a time; dependencies come with it. Never edit installed files to restyle; re-add to update.
Import from \`@/components/ui/<name>\`, except ${importExceptions.join(", ")}.
\`calendar\` needs \`"verbatimModuleSyntax": false\` in tsconfig.app.json.
Docs and live previews: ${productionBase}/design-system/components/<name>
Blade paths are relative to the Laravel app root (source: \`_comp-lib/blade/library/\` in the Brand Kit repo).

| Item | Purpose | Install | Blade equivalent |
|---|---|---|---|
${[...foundations, ...components].map(row).join("\n")}

Blade-only (no React version yet): ${bladeOnly.join(", ")}.
Icons: React uses lucide-react; Blade uses Phosphor, so icon names differ.
`;
await mkdir(dirname(indexPath), { recursive: true });
await writeFile(indexPath, index);

// Item table in REGISTRY.md, between the registry-items markers.
const docsPath = resolve(workspaceRoot, "REGISTRY.md");
const docs = await readFile(docsPath, "utf8");
const table = [
  "| Item | Purpose | Maturity | Blade tag | Blade path |",
  "|---|---|---|---|---|",
  ...[...foundations, ...components].map((item) => {
    const blade = item.meta?.blade;
    return `| \`${item.name}\` | ${item.description} | ${item.meta?.maturity ?? "—"} | ${blade ? `\`${blade.tag}\`` : "—"} | ${blade ? `\`${blade.installPath}\`` : item.meta?.bladeEquivalent ?? "React only"} |`;
  }),
  `| \`all\` | ${byName.get("all").description} | — | — | — |`,
  "",
  `Blade-only components (no React version yet): ${bladeOnly.map((name) => `\`${name}\``).join(", ")}.`,
].join("\n");
const updatedDocs = docs.replace(
  /(<!-- registry-items:start -->\n)[\s\S]*?(<!-- registry-items:end -->)/,
  `$1${table}\n$2`,
);
if (updatedDocs === docs && !docs.includes(table)) throw new Error("REGISTRY.md is missing the registry-items markers");
await writeFile(docsPath, updatedDocs);

console.log(`Registry built: ${built.length} items → public/r/ (base ${baseUrl})`);
