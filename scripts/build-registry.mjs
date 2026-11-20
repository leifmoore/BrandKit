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

// Pattern recipes import components through repo-only paths. Rewritten copies
// go to .registry-build/ (git-ignored) so registry.json can point at real files
// and the hash-locked handoffs stay untouched. Installed recipes keep the
// source layout under src/patterns/, so imports between recipes work unchanged.
const buildDir = resolve(workspaceRoot, ".registry-build");
const patternPins = (await readJson("_pattern-lib/react/dependencies.json")).dependencies;
const componentImport = /^(?:@scudamores\/ui|\.\.\/\.\.\/\.\.\/react)\/components\/ui\/([\w-]+)$/;
const siblingImport = /^\.\.\/\.\.\/([\w-]+)\/react\/\w+$/;
const allowedPackages = new Set(["react", "lucide-react", "date-fns"]);
const importToItem = new Map();
for (const item of items.filter((item) => item.meta?.import)) {
  if (!importToItem.has(item.meta.import) || item.meta.import.endsWith(`/${item.name}`)) {
    importToItem.set(item.meta.import, item.name);
  }
}
const itemUrl = (name) => `${productionBase}/r/${name}.json`;
const sameSet = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

await rm(buildDir, { recursive: true, force: true });
const recipes = [];
for (const library of ["_comp-lib", "_pattern-lib"]) {
  const catalogueDir = resolve(workspaceRoot, library, "catalog/recipes");
  for (const file of (await readdir(catalogueDir)).filter((name) => name.endsWith(".json"))) {
    const catalogue = JSON.parse(await readFile(resolve(catalogueDir, file), "utf8"));
    const [entry] = catalogue.react.files;
    const fileName = entry.split("/").pop();
    const components = new Set();
    const siblings = new Set();
    const packages = new Set();
    const source = await readFile(resolve(workspaceRoot, library, entry), "utf8");
    const rewritten = source.replace(/((?:from|import)\s+)(["'])([^"']+)\2/g, (match, keyword, quote, specifier) => {
      const component = specifier.match(componentImport)?.[1];
      if (component) {
        const name = importToItem.get(`@/components/ui/${component}`);
        if (name) components.add(name);
        else fail(`${catalogue.id}: imports unknown component ${specifier}`);
        return `${keyword}${quote}@/components/ui/${component}${quote}`;
      }
      const sibling = specifier.match(siblingImport)?.[1];
      if (sibling) siblings.add(sibling);
      else if (allowedPackages.has(specifier)) {
        if (specifier !== "react") packages.add(specifier);
      } else fail(`${catalogue.id}: unexpected import ${specifier}`);
      return match;
    });
    const buildPath = `.registry-build/patterns/${catalogue.id}/react/${fileName}`;
    await mkdir(dirname(resolve(workspaceRoot, buildPath)), { recursive: true });
    await writeFile(resolve(workspaceRoot, buildPath), rewritten);
    recipes.push({ library, catalogue, fileName, buildPath, components, siblings, packages });
  }
}

// Every catalogue recipe must be a pattern-<id> item whose files and
// dependencies match what its source actually imports.
const recipeIds = new Set(recipes.map(({ catalogue }) => catalogue.id));
const patternItems = items.filter((item) => item.name.startsWith("pattern-"));
for (const item of patternItems) {
  if (!recipeIds.has(item.name.slice("pattern-".length))) fail(`${item.name}: no catalogue recipe with that id`);
}
for (const { library, catalogue, fileName, buildPath, components, siblings, packages } of recipes) {
  const { id } = catalogue;
  const item = byName.get(`pattern-${id}`);
  if (!item) {
    fail(`Catalogue recipe missing from registry.json: pattern-${id}`);
    continue;
  }
  for (const sibling of siblings) if (!recipeIds.has(sibling)) fail(`${id}: imports unknown recipe ${sibling}`);
  const fixture = catalogue.fixture.split("/").pop();
  const expectedFiles = [
    { path: buildPath, type: "registry:file", target: `src/patterns/${id}/react/${fileName}` },
    { path: `${library}/${catalogue.fixture}`, type: "registry:file", target: `src/patterns/${id}/fixtures/${fixture}` },
  ];
  if (JSON.stringify(item.files) !== JSON.stringify(expectedFiles)) {
    fail(`${item.name}: files should be ${JSON.stringify(expectedFiles)}`);
  }
  const expectedRegistry = ["patterns-base", ...components, ...[...siblings].map((sibling) => `pattern-${sibling}`)].map(itemUrl);
  if (!sameSet(item.registryDependencies ?? [], expectedRegistry)) {
    fail(`${item.name}: registryDependencies should be ${expectedRegistry.join(", ")}`);
  }
  const expectedPackages = [...packages].map((name) => `${name}@${patternPins[name]}`);
  if (!sameSet(item.dependencies ?? [], expectedPackages)) {
    fail(`${item.name}: dependencies should be ${expectedPackages.join(", ")}`);
  }
  // The catalogue may list indirect dependencies too, so only check that
  // nothing imported directly is missing from it.
  if (library === "_pattern-lib") {
    const declared = new Set(catalogue.dependencies.internal);
    const npm = new Set(catalogue.dependencies.npm.map((name) => name.replace(/(?<=.)@.*$/, "")));
    for (const name of [...components, ...siblings]) if (!declared.has(name)) fail(`${id}: catalogue doesn't declare ${name}`);
    for (const name of packages) if (!npm.has(name)) fail(`${id}: catalogue doesn't declare ${name}`);
  }
}
const allPatterns = byName.get("all-patterns");
if (!sameSet(allPatterns?.registryDependencies ?? [], ["patterns-base", ...patternItems.map(({ name }) => name)].map(itemUrl))) {
  fail("all-patterns: registryDependencies should be patterns-base plus every pattern item");
}

// patterns-base must carry the pattern stylesheet's rules exactly.
const patternCss = (await readFile(resolve(workspaceRoot, "_pattern-lib/react/styles/index.css"), "utf8"))
  .replace(/\/\*[\s\S]*?\*\//g, "");
const patternRules = Object.fromEntries([...patternCss.matchAll(/([^{};]+)\{([^}]*)\}/g)].map(([, selector, body]) => [
  selector.split(",").map((part) => part.trim()).join(", "),
  Object.fromEntries(body.split(";").filter((part) => part.trim()).map((part) => {
    const colon = part.indexOf(":");
    return [part.slice(0, colon).trim(), part.slice(colon + 1).trim()];
  })),
]));
if (JSON.stringify(byName.get("patterns-base")?.css) !== JSON.stringify(patternRules)) {
  fail(`patterns-base: css should be ${JSON.stringify(patternRules)}`);
}

// Only these folders may be published, so a mistaken path (e.g. .env) can't
// leak through the public registry.
const publishableRoots = ["_comp-lib/react/", "registry/", ".registry-build/"];
const isPublishable = (path) =>
  !path.split("/").includes("..") && (
    publishableRoots.some((root) => path.startsWith(root))
    || /^_(comp|pattern)-lib\/recipes\/[\w-]+\/fixtures\/[\w-]+\.json$/.test(path)
  );

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
const components = items.filter((item) => item.meta?.blade && !patternItems.includes(item));
const bundles = new Set(["all", "all-patterns", "patterns-base"]);
const foundations = items.filter((item) => !item.meta?.blade && !bundles.has(item.name));
const patternRow = (item) => {
  const beta = item.meta.maturity === "beta" ? " (beta)" : "";
  return `| ${item.name.slice("pattern-".length)} | ${item.description}${beta} | \`${item.meta.import}\` (${item.meta.exports.join(", ")}) |`;
};
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

## Scudamore's patterns

Product-shaped compositions (booking journeys, reports, toolbars) built from the components above. Check here before composing a screen from scratch.
Install with \`npx shadcn@4.23.0 add @scudamores/pattern-<pattern>\`; the components it uses and \`patterns-base\` (dark-mode contrast CSS) come with it. \`@scudamores/all-patterns\` installs every pattern.
Files land in \`src/patterns/<pattern>/react/\`, with sample data in \`src/patterns/<pattern>/fixtures/\`. Each file exports the recipe component (controlled props and callbacks: use it with real data) and a \`*Preview\` adapter that only wires the sample data to local state.
Patterns are starting points and may be adapted, but re-adding with \`--overwrite\` replaces local edits. Persistence, routing, permissions and payments stay in the app.
\`kpi-stat-grid\` has an unused \`import * as React from "react";\` line: delete it if tsconfig sets \`noUnusedLocals\` (the Vite template does).
Docs and live previews: ${productionBase}/design-system/patterns/<pattern>

| Pattern | Purpose | Import (exports) |
|---|---|---|
${patternItems.map(patternRow).join("\n")}

## Moving to Laravel Blade

When rebuilding this prototype as a Laravel Blade app, use the Scudamore's Blade kit rather than hand-porting components: ${productionBase}/blade/scudamores-blade.zip. Its guide (${productionBase}/blade/AGENTS.md) maps every \`@/components/ui/*\` and \`@/patterns/*\` import here to a Blade tag. So keep UI in installed components and patterns, and keep data and side effects in callbacks, which map to Blade events.
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
  "| Pattern | Purpose | Maturity | Blade source |",
  "|---|---|---|---|",
  ...patternItems.map((item) => `| \`${item.name}\` | ${item.description} | ${item.meta.maturity} | \`${item.meta.blade.source}\` |`),
  `| \`patterns-base\` | ${byName.get("patterns-base").description} | — | — |`,
  `| \`all-patterns\` | ${byName.get("all-patterns").description} | — | — |`,
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
