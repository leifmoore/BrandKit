import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const patternSchema = JSON.parse(await readFile(join(root, "catalog/pattern.schema.json"), "utf8"));
const catalogSchema = JSON.parse(await readFile(join(root, "catalog/catalog.schema.json"), "utf8"));
const validatePattern = ajv.compile(patternSchema);
const validateCatalog = ajv.compile(catalogSchema);
const failures = [];
for (const name of (await readdir(join(root, "catalog/recipes"))).filter((item) => item.endsWith(".json")).sort()) {
  const value = JSON.parse(await readFile(join(root, "catalog/recipes", name), "utf8"));
  if (!validatePattern(value)) failures.push(`${name}: ${ajv.errorsText(validatePattern.errors, { separator: "; " })}`);
}
const catalog = JSON.parse(await readFile(join(root, "catalog/catalog.json"), "utf8"));
if (!validateCatalog(catalog)) failures.push(`catalog.json: ${ajv.errorsText(validateCatalog.errors, { separator: "; " })}`);
if (failures.length) {
  console.error(`JSON schema validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("JSON schema validation passed for 25 manifests and the add-on catalogue.");
