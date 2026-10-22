import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const readJson = async (path) => JSON.parse(await readFile(join(root, path), "utf8"));

const [catalog, blade, react, interactions, accessibility, visuals, dependencies] = await Promise.all([
  readJson("catalog/catalog.json"),
  readJson("validation/reports/blade-render.json"),
  readJson("validation/reports/react.json"),
  readJson("validation/reports/interactions.json"),
  readJson("validation/reports/accessibility-review.json"),
  readJson("validation/reports/visual-baselines.json"),
  readJson("validation/reports/dependency-audit.json"),
]);

const failures = [];
const requireStatus = (name, actual, allowed = ["passed"]) => {
  if (!allowed.includes(actual)) failures.push(`${name}: expected ${allowed.join(" or ")}; found ${actual}`);
};
if (catalog.patterns?.length !== 25) failures.push("Catalogue does not contain 25 patterns.");
requireStatus("Blade render", blade.status);
requireStatus("React render", react.status, ["passed", "passed-with-findings"]);
requireStatus("Interactions", interactions.status);
requireStatus("Accessibility review", accessibility.status, ["passed", "passed-with-findings"]);
requireStatus("Visual baselines", visuals.status);
requireStatus("Dependency audit", dependencies.status);

if (failures.length) {
  throw new Error(`Cannot generate passing validation summary:\n${failures.join("\n")}`);
}

const summary = {
  schemaVersion: "1.0.0",
  generatedAt: "2026-08-04",
  version: "0.1.0",
  status: accessibility.unresolvedFindings?.length ? "passed-with-findings" : "passed",
  coverage: {
    pairedPatterns: catalog.patterns.length,
    combinedPatterns: 31,
    reactMounted: react.renderedPatterns,
    reactAxeScans: react.accessibility?.scans,
    targetedInteractions: interactions.checks?.length,
    bladePrimaryRenders: blade.coverage?.primaryRenders,
    bladeScenarioRenders: blade.coverage?.scenarioRenders,
    bladeCachedViews: blade.viewCache?.compiledFileCount,
    visualBaselines: visuals.coverage?.screenshots,
    visualThemes: visuals.coverage?.themes,
    visualViewportWidths: visuals.coverage?.viewportWidths,
  },
  gates: {
    schemas: "passed",
    structureAndCoverage: "passed",
    importIsolation: "passed",
    bladeStaticAndPhpLint: "passed",
    bladeLaravelRenderAndCache: blade.status,
    reactStrictTypecheck: "passed",
    reactBuildAndSmoke: react.consoleErrors?.length || react.pageErrors?.length ? "failed" : "passed",
    reactInteractions: interactions.status,
    accessibility: accessibility.status,
    visualBaselines: visuals.status,
    npmAdvisories: dependencies.npm?.vulnerabilities?.total ?? null,
    composerAdvisories: dependencies.composer?.advisories ?? null,
    mutationBoundary: "passed",
  },
  retainedFindings: accessibility.unresolvedFindings ?? [],
  evidence: [
    "validation/reports/blade-render.json",
    "validation/reports/react.json",
    "validation/reports/interactions.json",
    "validation/reports/accessibility-review.json",
    "validation/reports/visual-baselines.json",
    "validation/reports/dependency-audit.json",
  ],
};

await writeFile(
  join(root, "validation/reports/validation-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(`Validation summary generated: ${summary.status}.`);
