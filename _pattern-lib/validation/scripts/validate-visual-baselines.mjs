import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const reportPath = join(root, "validation/reports/visual-baselines.json");
const report = JSON.parse(await readFile(reportPath, "utf8"));
const failures = [];

if (report.status !== "passed") failures.push("Report status is not passed.");
if (report.coverage?.patterns !== 25) failures.push("Expected 25 captured patterns.");
if (report.coverage?.screenshots !== 150) failures.push("Expected 150 screenshots.");
if (JSON.stringify(report.coverage?.themes) !== JSON.stringify(["light", "dark"])) {
  failures.push("Expected light and dark themes.");
}
if (JSON.stringify(report.coverage?.viewportWidths) !== JSON.stringify([360, 768, 1280])) {
  failures.push("Expected 360, 768 and 1280px viewport widths.");
}

const records = report.records ?? [];
const uniqueKeys = new Set();
for (const record of records) {
  const key = `${record.pattern}/${record.theme}/${record.viewport?.width}`;
  if (uniqueKeys.has(key)) failures.push(`Duplicate baseline record: ${key}`);
  uniqueKeys.add(key);

  const resolved = normalize(join(root, record.path ?? ""));
  if (relative(root, resolved).split(sep)[0] === "..") {
    failures.push(`Baseline path escapes package: ${record.path}`);
    continue;
  }
  try {
    const content = await readFile(resolved);
    const digest = createHash("sha256").update(content).digest("hex");
    if (content.byteLength !== record.bytes || digest !== record.sha256) {
      failures.push(`Baseline size/hash mismatch: ${record.path}`);
    }
    if (content.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
      failures.push(`Baseline is not a PNG: ${record.path}`);
    }
  } catch (error) {
    failures.push(`Cannot read baseline ${record.path}: ${error.message}`);
  }
}
if (records.length !== 150 || uniqueKeys.size !== 150) {
  failures.push(`Expected 150 unique records; found ${records.length}/${uniqueKeys.size}.`);
}

if (failures.length) {
  console.error(`Visual baseline validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("Visual baseline validation passed: 25 patterns / 150 hashed React screenshots.");
