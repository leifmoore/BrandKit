import { access, readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const expected = [
  "availability-time-picker", "booking-criteria-panel", "booking-progress-indicator",
  "booking-review-summary", "capacity-product-selector", "checkout-details-panel",
  "collection-state-panel", "collection-toolbar", "configuration-workbench",
  "contextual-action-dock", "customer-booking-journey", "discount-builder",
  "epos-booking-journey", "grouped-results-table", "kpi-stat-grid",
  "mobile-bottom-navigation", "multi-query-manager", "quote-builder", "quote-lookup",
  "reference-redemption-journey", "report-breakdown-table", "report-filter-builder",
  "report-workspace-tabs", "responsive-data-collection", "visit-time-heat-map",
].sort();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const names = (await readdir(join(root, "catalog/recipes")))
  .filter((name) => name.endsWith(".json"))
  .map((name) => name.replace(/\.json$/, ""))
  .sort();
check(JSON.stringify(names) === JSON.stringify(expected), `Expected exact pattern IDs; found ${names.join(", ")}`);

const requiredManifestKeys = ["schemaVersion", "id", "title", "description", "category", "maturity", "kind", "searchTerms", "fixture", "documentation", "scenarios", "react", "blade", "contract", "dependencies", "responsiveBehavior", "accessibility", "parity", "source"];
const assertPath = async (manifest, path, label) => {
  check(typeof path === "string" && path.length > 0, `${manifest.id}: ${label} is not a path`);
  if (typeof path !== "string") return;
  const resolved = normalize(join(root, path));
  check(relative(root, resolved).split(sep)[0] !== "..", `${manifest.id}: ${label} escapes the package`);
  try { await access(resolved); } catch { failures.push(`${manifest.id}: missing ${label} ${path}`); }
};
for (const id of names) {
  const manifest = JSON.parse(await readFile(join(root, `catalog/recipes/${id}.json`), "utf8"));
  for (const key of requiredManifestKeys) check(Object.hasOwn(manifest, key), `${id}: missing manifest key ${key}`);
  check(manifest.id === id, `${id}: manifest id mismatch`);
  check(manifest.schemaVersion === "1.0.0" && manifest.maturity === "beta" && manifest.kind === "recipe", `${id}: invalid fixed metadata`);
  check(
    manifest.accessibility?.status === "passed" || manifest.accessibility?.status === "passed-with-findings",
    `${id}: accessibility status must be released as passed or passed-with-findings (not pending)`,
  );
  check(Array.isArray(manifest.accessibility?.findings), `${id}: accessibility findings must be an array`);
  check(
    manifest.accessibility?.status !== "passed" || manifest.accessibility?.findings.length === 0,
    `${id}: accessibility findings require passed-with-findings status`,
  );
  check(Array.isArray(manifest.scenarios) && manifest.scenarios.length > 0, `${id}: needs scenarios`);
  check(manifest.fixture === manifest.react.exampleData && manifest.fixture === manifest.blade.exampleData, `${id}: default compatibility fixture mismatch`);
  await assertPath(manifest, manifest.fixture, "fixture");
  await assertPath(manifest, manifest.documentation, "documentation");
  await assertPath(manifest, manifest.react.entry, "React entry");
  for (const path of manifest.react.files ?? []) await assertPath(manifest, path, "React file");
  for (const path of manifest.blade.files ?? []) await assertPath(manifest, path, "Blade file");
  for (const scenario of manifest.scenarios ?? []) await assertPath(manifest, scenario.fixture, `scenario ${scenario.id}`);
  for (const file of manifest.source?.files ?? []) {
    try {
      const content = await readFile(join(root, "..", file.path));
      const sha = createHash("sha256").update(content).digest("hex");
      check(sha === file.sha256, `${id}: source hash mismatch for ${file.path}`);
    } catch { failures.push(`${id}: missing source file ${file.path}`); }
  }
}

const catalog = JSON.parse(await readFile(join(root, "catalog/catalog.json"), "utf8"));
const combined = JSON.parse(await readFile(join(root, "catalog/combined-catalog.json"), "utf8"));
check(catalog.patterns?.length === 25, "Add-on catalogue must contain 25 patterns");
check(combined.counts?.components === 39 && combined.counts?.patterns === 31, "Combined catalogue must report 39 components and 31 patterns");

if (failures.length) {
  console.error(`Structure validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("Structure validation passed: 25 paired patterns / 31 combined patterns.");
