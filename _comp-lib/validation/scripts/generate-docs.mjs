import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestsDir = join(root, "catalog/components");
const outputDir = join(root, "docs/components");

const list = (values = []) => values.length ? values.map((value) => `- \`${typeof value === "string" ? value : value.name}\``).join("\n") : "- None";
const propTable = (props = []) => props.length
  ? ["| Prop | Type | Required | Default |", "| --- | --- | :---: | --- |", ...props.map((prop) => `| \`${prop.name}\` | \`${String(prop.type).replaceAll("|", "\\|")}\` | ${prop.required ? "Yes" : "No"} | ${Object.hasOwn(prop, "default") ? `\`${JSON.stringify(prop.default)}\`` : "—"} |`)].join("\n")
  : "This component adds no local props beyond the underlying element or primitive contract.";

await mkdir(outputDir, { recursive: true });
const catalog = JSON.parse(await readFile(join(root, "catalog/catalog.json"), "utf8"));
const files = (await readdir(manifestsDir)).filter((file) => file.endsWith(".json")).sort();

for (const file of files) {
  const component = JSON.parse(await readFile(join(manifestsDir, file), "utf8"));
  const findings = component.accessibility.findings.length
    ? component.accessibility.findings.map((finding) => `- **${finding.severity}:** ${finding.summary} (\`${finding.status}\`)`).join("\n")
    : "- No unresolved finding is currently recorded. Check the audit status before treating this as a pass.";
  const differences = component.parity.intentionalDifferences.length
    ? component.parity.intentionalDifferences.map((difference) => `- ${difference}`).join("\n")
    : "- No intentional visual or behavioral differences are recorded.";

  const markdown = `# ${component.title}

${component.description}

- Catalogue ID: \`${component.id}\`
- Category: \`${component.category}\`
- Maturity: \`${component.maturity}\`
- Parity: \`${component.parity.classification}\`

## React

Implementation files:

${list(component.react.files)}

Exports:

${list(component.react.exports)}

### Props and defaults

${propTable(component.react.props)}

Internal component dependencies:

${list(component.react.internalDependencies)}

Exact NPM dependencies:

${component.react.npmDependencies.length ? component.react.npmDependencies.map((dependency) => `- \`${dependency.name}@${dependency.version}\``).join("\n") : "- None beyond shared React/style dependencies."}

Example: \`${component.react.exampleFiles[0]}\`

## Blade

Canonical tag: \`${component.blade.canonicalTag}\`

Implementation files:

${list(component.blade.files)}

### Props and defaults

${propTable(component.blade.props)}

Slots:

${list(component.blade.slots)}

Events:

${list(component.blade.events)}

Compatibility tags:

${list(component.blade.legacyTags)}

Runtime dependencies:

${component.blade.runtimeDependencies.length ? component.blade.runtimeDependencies.map((dependency) => `- \`${dependency.name}@${dependency.version}\``).join("\n") : "- None."}

Example: \`${component.blade.exampleFiles[0]}\`

## Variants, sizes, and states

- Variants: ${component.shared.variants.map((item) => `\`${item.name}\``).join(", ") || "None"}
- Sizes: ${component.shared.sizes.map((item) => `\`${item.name}\``).join(", ") || "None"}
- Documented states: ${component.shared.states.map((state) => `\`${state}\``).join(", ")}

## Parity notes

${differences}

The React edition is the visual target. An unrecorded difference is a defect. Consumer classes may control layout and spacing; Blade visual variants and sizes remain explicit props.

## Accessibility

- Target: \`${component.accessibility.wcagTarget}\`
- Audit status: \`${component.accessibility.auditStatus}\`

${findings}

Visual parity is the release priority. Fix issues that do not alter the approved design and keep every unresolved WCAG issue visible in the manifest and reports.

## Provenance

- Source commit: \`${component.source.commit}\`
- Verified: \`${component.source.verifiedAt}\`
- Source evidence: ${component.source.files.map((source) => `\`${source.path}\` (\`${source.sha256}\`)`).join(", ")}
- Machine-readable contract: \`catalog/components/${component.id}.json\`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
`;
  await writeFile(join(outputDir, `${component.id}.md`), markdown);
}

for (const component of catalog.deferredComponents) {
  const markdown = `# ${component.title}

This component is inventory-only and intentionally has no distributable React or Blade implementation in version 0.1.0.

- Catalogue ID: \`${component.id}\`
- Source evidence: \`${component.source}\`
- Disposition: \`deferred\`

## Why it is deferred

${component.reason}

## Revisit when

${component.revisitWhen}

Do not expose copy actions or interactive previews for this entry. Its metadata may appear in inventory and roadmap views.
`;
  await writeFile(join(outputDir, `${component.id}.md`), markdown);
}

console.log(`Generated ${files.length} paired and ${catalog.deferredComponents.length} deferred component documentation pages.`);
