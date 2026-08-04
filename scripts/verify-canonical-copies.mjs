import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(workspaceRoot, "scripts/canonical-copies.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const requiredCopyDestinations = new Set([
  "src/components/ui/badge.tsx",
  "src/components/ui/button.tsx",
  "src/components/ui/card.tsx",
  "src/components/ui/dialog.tsx",
  "src/components/ui/input.tsx",
  "src/components/ui/label.tsx",
  "src/components/ui/popover.tsx",
  "src/components/ui/scroll-area.tsx",
  "src/components/ui/select.tsx",
  "src/components/ui/separator.tsx",
  "src/components/ui/slider.tsx",
  "src/components/ui/sonner.tsx",
  "src/components/ui/tabs.tsx",
  "src/components/ui/tooltip.tsx",
  "src/components/ui/utils.ts",
  "src/runtime/theme.tsx",
]);
const requiredAdapterDestinations = new Set([
  "src/components/ui/chart.tsx",
  "src/components/ui/command.tsx",
]);

if (
  manifest.schemaVersion !== 1
  || !Array.isArray(manifest.copies)
  || !Array.isArray(manifest.adapters)
) {
  throw new Error("Unsupported canonical-copy manifest");
}

const handoffRoot = resolve(workspaceRoot, manifest.handoffRoot);
const seenSources = new Set();
const seenDestinations = new Set();
const failures = [];

function compareDestinationPolicy(actualEntries, required, label) {
  const actual = new Set(actualEntries.map((entry) => entry.destination));
  const missing = [...required].filter((path) => !actual.has(path));
  const unexpected = [...actual].filter((path) => !required.has(path));
  if (missing.length > 0) failures.push(`${label} policy missing: ${missing.join(", ")}`);
  if (unexpected.length > 0) {
    failures.push(`${label} policy has unexpected entries: ${unexpected.join(", ")}`);
  }
}

compareDestinationPolicy(manifest.copies, requiredCopyDestinations, "Canonical copy");
compareDestinationPolicy(manifest.adapters, requiredAdapterDestinations, "Host adapter");

function resolveInside(root, path, label) {
  const absolute = resolve(root, path);
  const child = relative(root, absolute);
  if (child === "" || child === ".." || child.startsWith(`..${sep}`)) {
    throw new Error(`${label} escapes its allowed root: ${path}`);
  }
  return absolute;
}

for (const copy of manifest.copies) {
  if (!copy.source || !copy.destination || !copy.cohort) {
    throw new Error("Each canonical copy needs cohort, source, and destination");
  }
  if (seenSources.has(copy.source)) throw new Error(`Duplicate source: ${copy.source}`);
  if (seenDestinations.has(copy.destination)) {
    throw new Error(`Duplicate destination: ${copy.destination}`);
  }
  seenSources.add(copy.source);
  seenDestinations.add(copy.destination);

  const sourcePath = resolveInside(handoffRoot, copy.source, "Source");
  const destinationPath = resolveInside(
    workspaceRoot,
    copy.destination,
    "Destination",
  );

  let source;
  let destination;
  try {
    [source, destination] = await Promise.all([
      readFile(sourcePath),
      readFile(destinationPath),
    ]);
  } catch (error) {
    failures.push(`${copy.destination}: ${error.message}`);
    continue;
  }

  if (!source.equals(destination)) {
    const digest = (buffer) =>
      createHash("sha256").update(buffer).digest("hex").slice(0, 12);
    failures.push(
      `${copy.destination}: differs from ${copy.source} (${digest(destination)} != ${digest(source)})`,
    );
  }
}

for (const adapter of manifest.adapters) {
  if (!adapter.destination || !adapter.reason) {
    throw new Error("Each host adapter needs destination and reason");
  }
  if (seenDestinations.has(adapter.destination)) {
    throw new Error(`Duplicate destination: ${adapter.destination}`);
  }
  seenDestinations.add(adapter.destination);

  const adapterPath = resolveInside(
    workspaceRoot,
    adapter.destination,
    "Adapter destination",
  );
  try {
    await readFile(adapterPath);
  } catch (error) {
    failures.push(`${adapter.destination}: ${error.message}`);
  }
}

async function listTypeScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return listTypeScriptFiles(path);
      if (!entry.isFile() || (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx"))) {
        return [];
      }
      return [relative(workspaceRoot, path).split(sep).join("/")];
    }),
  );
  return files.flat();
}

const uiRoot = resolve(workspaceRoot, "src/components/ui");
const uiFiles = await listTypeScriptFiles(uiRoot);
const unclassified = uiFiles.filter((path) => !seenDestinations.has(path));
if (unclassified.length > 0) {
  failures.push(`Unclassified UI files: ${unclassified.join(", ")}`);
}

if (failures.length > 0) {
  throw new Error(`Canonical copy verification failed:\n- ${failures.join("\n- ")}`);
}

const cohorts = [...new Set(manifest.copies.map((copy) => copy.cohort))].join(", ");
console.log(
  `Canonical copies verified: ${manifest.copies.length} exact files across cohort(s) ${cohorts}; ${manifest.adapters.length} host adapters classified.`,
);
