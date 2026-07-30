import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceCommit = "d1511e224305585680723101a0b76be93eb9f2f0";
const aggregate = "82b55ce6513ce99a55146a1fcc81533b7ecf5e53200a088135b0e8313afc1b6d";
const paired = ["accordion", "alert", "alert-dialog", "aspect-ratio", "avatar", "badge", "breadcrumb", "button", "calendar", "card", "checkbox", "collapsible", "dialog", "dropdown-menu", "form", "input", "input-otp", "label", "page-container", "page-header", "pagination", "popover", "progress", "radio-group", "scroll-area", "select", "separator", "sheet", "skeleton", "slider", "toast", "stepper", "switch", "table", "tabs", "textarea", "toggle", "toggle-group", "tooltip"];
const stable = ["alert", "alert-dialog", "badge", "button", "calendar", "card", "checkbox", "collapsible", "dialog", "dropdown-menu", "input", "input-otp", "label", "page-container", "page-header", "popover", "radio-group", "scroll-area", "select", "separator", "sheet", "toast", "stepper", "switch", "table", "tabs", "textarea", "toggle", "toggle-group", "tooltip"];
const beta = ["accordion", "aspect-ratio", "avatar", "breadcrumb", "form", "pagination", "progress", "skeleton", "slider"];
const deferred = ["carousel", "chart", "command-palette", "context-menu", "drawer", "hover-card", "menubar", "navigation-menu", "resizable-panels", "sidebar"];
const recipes = ["quick-launch", "availability-toggle-list", "channel-logo-picker", "booking-card", "booking-details-dialog", "people-popover-content"];
const expectedCrosswalk = { canonical: 34, alias: 21, reference: 18, exclude: 7 };
const requiredManifestFields = ["$schema", "schemaVersion", "id", "title", "description", "category", "maturity", "searchTerms", "react", "blade", "shared", "previews", "parity", "accessibility", "source"];
const requiredReactFields = ["files", "exports", "props", "internalDependencies", "npmDependencies", "exampleFiles"];
const requiredBladeFields = ["files", "canonicalTag", "legacyTags", "props", "slots", "events", "phpDependencies", "runtimeDependencies", "installTargets", "exampleFiles"];
const failures = [];
const warnings = [];
const checks = [];

function check(condition, message) {
  checks.push({ passed: Boolean(condition), message });
  if (!condition) failures.push(message);
}

async function json(path) {
  try { return JSON.parse(await readFile(join(root, path), "utf8")); }
  catch (error) { failures.push(`${path}: ${error.message}`); return null; }
}

async function exists(path) {
  if (!path || typeof path !== "string") return false;
  try { return (await stat(join(root, path))).isFile(); } catch { return false; }
}

async function walk(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else if (entry.isFile()) paths.push(relative(root, path).split(sep).join("/"));
  }
  return paths;
}

const catalog = await json("catalog/catalog.json");
check(catalog?.schemaVersion === "1.0.0", "catalogue schema version is 1.0.0");
check(catalog?.components?.length === 39, "catalogue contains exactly 39 paired component entries");
check(catalog?.recipes?.length === 6, "catalogue contains exactly six recipe entries");
check(catalog?.deferredComponents?.length === 10, "catalogue contains exactly ten deferred inventory entries");
check(catalog?.utilities?.length === 1 && catalog.utilities[0].id === "device-preview-frame", "catalogue contains one Device Preview Frame utility");
check(catalog?.counts?.stable === 30 && catalog?.counts?.beta === 9, "catalogue records 30 stable and nine beta components");
check(new Set(catalog?.components?.map((item) => item.id)).size === 39, "catalogue component IDs are unique");
check(paired.every((id) => catalog?.components?.some((item) => item.id === id)), "catalogue contains every approved paired component ID");
check(deferred.every((id) => catalog?.deferredComponents?.some((item) => item.id === id)), "catalogue contains every approved deferred ID");

const manifestNames = (await readdir(join(root, "catalog/components"))).filter((name) => name.endsWith(".json")).map((name) => name.slice(0, -5)).sort();
check(manifestNames.length === 39, "exactly 39 per-component manifests exist");
check(paired.every((id) => manifestNames.includes(id)), "every paired component has a manifest");

const sourceLock = await json("provenance/source-lock.json");
const lockedFiles = new Map((sourceLock?.perFileLocks ?? []).map((item) => [item.path, item.sha256]));
check(sourceLock?.commit?.expected === sourceCommit && sourceLock?.commit?.actual === sourceCommit && sourceLock?.commit?.status === "match", "source lock records a matching approved commit");
check(sourceLock?.aggregate?.expected === aggregate && sourceLock?.aggregate?.actual === aggregate && sourceLock?.aggregate?.status === "match", "source lock records a matching approved aggregate");
check(sourceLock?.aggregate?.fileCount === 253, "source lock records all 253 baseline files");

for (const id of paired) {
  const manifest = await json(`catalog/components/${id}.json`);
  check(requiredManifestFields.every((field) => Object.hasOwn(manifest ?? {}, field)), `${id}: all required component-manifest fields exist`);
  check(manifest?.id === id, `${id}: manifest ID matches its filename`);
  check(manifest?.schemaVersion === "1.0.0", `${id}: schema version is 1.0.0`);
  check(manifest?.maturity === (beta.includes(id) ? "beta" : "stable"), `${id}: approved maturity is recorded`);
  check(requiredReactFields.every((field) => Object.hasOwn(manifest?.react ?? {}, field)), `${id}: complete React contract exists`);
  check(requiredBladeFields.every((field) => Object.hasOwn(manifest?.blade ?? {}, field)), `${id}: complete Blade contract exists`);
  check(manifest?.blade?.canonicalTag === `<x-ui.${id}>`, `${id}: canonical Blade tag is consistent`);
  check(Array.isArray(manifest?.react?.props) && manifest.react.props.every((prop) => typeof prop.name === "string" && typeof prop.type === "string" && typeof prop.required === "boolean"), `${id}: React props are structured`);
  check(Array.isArray(manifest?.blade?.props) && manifest.blade.props.every((prop) => typeof prop.name === "string" && typeof prop.type === "string" && typeof prop.required === "boolean"), `${id}: Blade props are structured`);
  check(manifest?.react?.npmDependencies?.every((dependency) => dependency.name && dependency.version && !dependency.version.includes("missing")), `${id}: exact React dependencies are declared`);
  check(manifest?.blade?.runtimeDependencies?.every((dependency) => dependency.name && dependency.version && dependency.version !== "latest-compatible"), `${id}: exact Blade runtime dependencies are declared`);
  check(Array.isArray(manifest?.shared?.variants) && Array.isArray(manifest?.shared?.sizes) && Array.isArray(manifest?.shared?.states), `${id}: shared variants, sizes, and states exist`);
  check(manifest?.shared?.tokens?.every((token) => /^--[a-z0-9-]+$/.test(token)), `${id}: shared token references use CSS custom-property names`);
  check(["exact", "framework-equivalent", "documented-exception"].includes(manifest?.parity?.classification), `${id}: parity classification is valid`);
  check(manifest?.accessibility?.wcagTarget === "WCAG 2.2 AA" && ["pending", "passed", "passed-with-findings", "failed"].includes(manifest?.accessibility?.auditStatus), `${id}: WCAG target and audit state are explicit`);
  check(manifest?.source?.commit === sourceCommit, `${id}: approved source commit is recorded`);
  check(manifest?.source?.files?.every((source) => /^[0-9a-f]{64}$/.test(source.sha256) && lockedFiles.get(source.path) === source.sha256), `${id}: source paths and hashes match the centralized lock`);
  for (const path of [...(manifest?.react?.files ?? []), ...(manifest?.blade?.files ?? []), ...(manifest?.react?.exampleFiles ?? []), ...(manifest?.blade?.exampleFiles ?? [])]) check(await exists(path), `${id}: declared handoff path exists (${path})`);
  check(await exists(`docs/components/${id}.md`), `${id}: generated documentation exists`);
}

check(stable.length === 30, "approved stable scope contains exactly 30 components");
check(beta.length === 9, "approved beta scope contains exactly nine components");
for (const id of deferred) check(await exists(`docs/components/${id}.md`), `${id}: deferred documentation exists`);

for (const id of recipes) {
  const manifest = await json(`catalog/recipes/${id}.json`);
  check(manifest?.id === id && manifest?.kind === "recipe", `${id}: recipe manifest exists and identifies itself`);
  check(manifest?.contract?.standaloneApi === false, `${id}: recipe is not advertised as a standalone component API`);
  for (const path of [manifest?.fixture, manifest?.documentation, ...(manifest?.react?.files ?? []), ...(manifest?.blade?.files ?? [])].filter(Boolean)) check(await exists(path), `${id}: recipe path exists (${path})`);
  check(manifest?.source?.files?.every((source) => lockedFiles.get(source.path) === source.sha256), `${id}: recipe provenance matches the source lock`);
}

check(await exists("docs/playground/DevicePreviewFrame.tsx"), "the Device Preview Frame utility exists");

const crosswalk = await json("catalog/blade-crosswalk.json");
check(crosswalk?.items?.length === 80, "Blade crosswalk contains exactly 80 source dispositions");
check(new Set(crosswalk?.items?.map((item) => item.path)).size === 80, "Blade crosswalk paths are unique");
for (const [name, count] of Object.entries(expectedCrosswalk)) check(crosswalk?.counts?.[name] === count, `Blade crosswalk has exactly ${count} ${name} dispositions`);
check(crosswalk?.items?.every((item) => item.source && item.migration && Object.hasOwn(item, "target")), "every Blade disposition includes source, target, and migration guidance");
check(crosswalk?.phpClasses?.length === 7, "Blade crosswalk records seven supporting PHP classes");

const phpFiles = (await walk(join(root, "blade/library/app/View/Components/Ui"))).filter((path) => path.endsWith(".php"));
check(phpFiles.length === 7, "exactly seven canonical PHP component classes exist");
const aliases = (await walk(join(root, "blade/compatibility/resources/views/components"))).filter((path) => path.endsWith(".blade.php"));
check(aliases.length === 21, "exactly 21 compatibility alias views exist");
const bladeExamples = (await walk(join(root, "blade/examples"))).filter((path) => path.endsWith("/basic.blade.php"));
const reactExamples = (await walk(join(root, "react/examples"))).filter((path) => path.endsWith("/basic.tsx"));
check(bladeExamples.length === 39, "exactly 39 canonical Blade examples exist");
check(reactExamples.length === 39, "exactly 39 canonical React examples exist");

const reactRegistry = await json("react/registry.json");
const registryComponents = reactRegistry?.items?.filter((item) => ["registry:ui", "registry:component"].includes(item.type)) ?? [];
check(registryComponents.length === 39, "React registry exposes exactly 39 copyable component entries plus shared library records");
for (const item of reactRegistry?.items ?? []) for (const file of item.files ?? []) {
  const path = typeof file === "string" ? file : file.path;
  check(await exists(`react/${path}`), `React registry path exists (${path})`);
}

const tokens = await json("foundations/data/tokens.json");
const brands = await json("foundations/data/brands.json");
check(JSON.stringify(tokens).includes("light") && JSON.stringify(tokens).includes("dark"), "tokens contain light and dark semantic modes");
check(JSON.stringify(tokens).includes("chart") && JSON.stringify(tokens).includes("sidebar") && JSON.stringify(tokens).includes("status"), "tokens contain chart, sidebar, and status roles");
const brandCount = Array.isArray(brands?.brands) ? brands.brands.length : Array.isArray(brands) ? brands.length : Object.keys(brands?.presets ?? brands ?? {}).filter((key) => !["$schema", "schemaVersion", "description"].includes(key)).length;
check(brandCount === 7, "exactly seven brand presets are declared");
check(await exists("foundations/licenses/OFL-1.1.txt"), "Instrument Sans licence is retained");

const allFiles = await walk(root);
for (const path of allFiles.filter((path) => /\.(?:[cm]?[jt]sx?|php|blade\.php|css)$/.test(path))) {
  if (path.startsWith("validation/tmp/") || path.startsWith("validation/scripts/") || path.startsWith("releases/")) continue;
  const source = await readFile(join(root, path), "utf8");
  const forbidden = [
    [/AppContext/, "references AppContext"], [/sql\.js/, "references sql.js"], [/(?:mockData|mock-data|productTypes)/i, "references product mock data or product types"],
    [/(?:from|import)\s*["'][^"']*(?:src\/app|_style-reference|docs\/design-system)/, "imports an upstream repository path"],
  ];
  for (const [pattern, reason] of forbidden) if (pattern.test(source)) failures.push(`${path}: ${reason}`);
  if (path.startsWith("blade/") && /(?:livewire|jquery)/i.test(source)) failures.push(`${path}: references a forbidden Blade runtime`);

  if (/\.[cm]?[jt]sx?$/.test(path)) {
    for (const match of source.matchAll(/(?:from\s+|import\s*)["'](\.\.\/[^"']+)["']/g)) {
      const resolved = resolve(dirname(join(root, path)), match[1]);
      if (!(resolved === root || resolved.startsWith(`${root}${sep}`))) failures.push(`${path}: relative import escapes _comp-lib (${match[1]})`);
    }
  }
}

for (const path of allFiles.filter((path) => path.endsWith(".json") && !path.startsWith("validation/tmp/") && !path.includes("/node_modules/"))) await json(path);

const cssInputs = ["foundations/data/tokens.json", "foundations/data/brands.json"];
for (const path of cssInputs) {
  const content = await readFile(join(root, path));
  check(createHash("sha256").update(content).digest("hex").length === 64, `${path}: maintained token input is hashable`);
}

const uniqueFailures = [...new Set(failures)];
const report = {
  schemaVersion: "1.0.0", generatedAt: verifiedAt(), status: uniqueFailures.length ? "failed" : "passed",
  summary: { checks: checks.length, passed: checks.filter((item) => item.passed).length, failures: uniqueFailures.length, warnings: warnings.length },
  scope: { paired: paired.length, stable: stable.length, beta: beta.length, deferred: deferred.length, recipes: recipes.length, playgroundUtilities: 1, bladeDispositions: crosswalk?.items?.length ?? 0, phpClasses: phpFiles.length },
  failures: uniqueFailures, warnings, checks,
};
await writeFile(join(root, "validation/reports/structural-validation.json"), `${JSON.stringify(report, null, 2)}\n`);

if (uniqueFailures.length) {
  console.error(`Structural validation failed with ${uniqueFailures.length} finding(s).`);
  for (const failure of uniqueFailures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Structural validation passed (${checks.length} checks).`);

function verifiedAt() { return "2026-07-28"; }
