// Builds the Laravel Blade kit served at /blade/: one zip laid out like a
// Laravel app root (so it unzips in place) plus the agent guide (AGENTS.md) and
// the developer guide (README.md, from registry/), both published on their own
// as well. Source files are read in place, so the hash-locked handoffs stay
// untouched. Library CSS paths are rewritten from a fixed table and anything
// unexpected fails the build. The zip is reproducible:
// sorted entries and fixed timestamps, so the same source gives the same bytes.

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as zlib from "node:zlib";

const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
const siteBase = "https://brand-kit-ashen.vercel.app";
const outputDir = resolve(workspaceRoot, "public/blade");
const zipName = "scudamores-blade.zip";
const zipUrl = `${siteBase}/blade/${zipName}`;
const guideUrl = `${siteBase}/blade/AGENTS.md`;
const installCommand = `curl -fsSL ${zipUrl} -o ${zipName} && unzip -o ${zipName} && rm ${zipName}`;

const errors = [];
const fail = (message) => errors.push(message);
if (typeof zlib.crc32 !== "function") throw new Error("Node 22.2 or newer is required (zlib.crc32)");

const read = (path) => readFile(resolve(workspaceRoot, path));
const readJson = async (path) => JSON.parse(await readFile(resolve(workspaceRoot, path), "utf8"));
const listFiles = async (dir) => (await readdir(resolve(workspaceRoot, dir), { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => relative(resolve(workspaceRoot, dir), resolve(entry.parentPath, entry.name)))
  .sort();

const kit = new Map();
const add = (path, content) => {
  if (kit.has(path)) fail(`Two sources for ${path}`);
  kit.set(path, Buffer.isBuffer(content) ? content : Buffer.from(content));
};
const copyTree = async (from, to) => {
  for (const file of await listFiles(from)) add(`${to}/${file}`, await read(`${from}/${file}`));
};

// Rewrites the relative @import/@source lines of a library stylesheet for its
// place in a Laravel app (resources/css/scudamores/). null drops the line.
const rewriteCss = (path, css, table) => {
  const used = new Set();
  const lines = css.split("\n").flatMap((line) => {
    if (line.trim() in table) {
      used.add(line.trim());
      return table[line.trim()] === null ? [] : [table[line.trim()]];
    }
    if (/^\s*@(import|source)\s+["']\.{1,2}\//.test(line)) fail(`${path}: unexpected relative path: ${line.trim()}`);
    return [line];
  });
  for (const line of Object.keys(table)) if (!used.has(line)) fail(`${path}: expected line not found: ${line}`);
  return lines.join("\n");
};

// Library: drop-in app files.
const blade = "_comp-lib/blade";
await copyTree(`${blade}/library/app`, "app");
await copyTree(`${blade}/library/resources/views`, "resources/views");
await copyTree(`${blade}/library/resources/js`, "resources/js");
for (const name of ["tokens", "brands", "tailwind-theme", "fonts"]) {
  add(`resources/css/scudamores/${name}.css`, await read(`_comp-lib/foundations/css/${name}.css`));
}
add("resources/css/scudamores/ui.css", rewriteCss(
  `${blade}/library/resources/css/index.css`,
  (await read(`${blade}/library/resources/css/index.css`)).toString(),
  {
    "/* Ready-to-copy Blade stylesheet. Adjust relative paths after installation. */":
      "/* Scudamore's UI for Laravel. Paths already point at this app's layout. */",
    '@import "../../../../foundations/css/tokens.css";': '@import "./tokens.css";',
    '@import "../../../../foundations/css/brands.css";': '@import "./brands.css";',
    '@import "../../../../foundations/css/tailwind-theme.css";': '@import "./tailwind-theme.css";',
    '@import "../../../../foundations/css/fonts.css";': '@import "./fonts.css";',
    '@source "../views/**/*.blade.php";': '@source "../../views/**/*.blade.php";',
    '@source "../../app/View/Components/**/*.php";': '@source "../../../app/View/Components/**/*.php";',
    '@source "../js/**/*.js";': '@source "../../js/**/*.js";',
    // Compatibility views land under resources/views when used, which the line above covers.
    '@source "../../../compatibility/resources/views/components/**/*.blade.php";': null,
    '@source "../../../examples/**/*.blade.php";': null,
  },
));
add("resources/css/scudamores/patterns.css", rewriteCss(
  "_pattern-lib/blade/styles/tailwind.css",
  (await read("_pattern-lib/blade/styles/tailwind.css")).toString(),
  { '@source "../../recipes/*/blade/**/*.blade.php";': null },
));

// Patterns: one anonymous component each, used as <x-patterns.<id>>.
const patterns = [];
for (const library of ["_comp-lib", "_pattern-lib"]) {
  const catalogueDir = `${library}/catalog/recipes`;
  for (const file of await listFiles(catalogueDir)) {
    const catalogue = await readJson(`${catalogueDir}/${file}`);
    const { id } = catalogue;
    if (catalogue.blade.files.length !== 1) fail(`${id}: expected one Blade file, found ${catalogue.blade.files.length}`);
    add(`resources/views/components/patterns/${id}.blade.php`, await read(`${library}/${catalogue.blade.files[0]}`));
    await copyTree(`${library}/recipes/${id}/fixtures`, `scudamores/reference/fixtures/${id}`);
    add(`scudamores/reference/patterns/${id}.md`, await read(`${library}/recipes/${id}/README.md`));
    patterns.push({ library, catalogue });
  }
}
patterns.sort((a, b) => a.catalogue.id.localeCompare(b.catalogue.id));

// Reference material for the agent; not part of the running app.
await copyTree(`${blade}/examples`, "scudamores/reference/examples");
await copyTree(`${blade}/compatibility`, "scudamores/reference/compatibility");
add("scudamores/reference/migration-crosswalk.json", await read("_comp-lib/catalog/blade-crosswalk.json"));
add("scudamores/reference/patterns/README.md", await read("_comp-lib/recipes/README.md"));
add("scudamores/reference/docs/ui-install.md", await read(`${blade}/INSTALL.md`));
add("scudamores/reference/docs/ui-accessibility.md", await read(`${blade}/ACCESSIBILITY.md`));
add("scudamores/reference/docs/patterns-install.md", await read("_pattern-lib/blade/INSTALL.md"));
const readme = await read("registry/blade-kit-README.md");
add("scudamores/README.md", readme);

// Blade doesn't compile @js()/@json() inside a component tag's attributes
// (e.g. <x-ui.button x-on:click="… @js($id)">), so the handoff's uses reach the
// browser as raw text and break Alpine. Rewrite them in the kit's copies to the
// echo form Blade does compile there. Laravel also prints a component
// attribute's double quotes as \", which ends the HTML attribute early, so
// they become &quot; (the browser decodes it before Alpine reads the value).
const componentTags = (source) => {
  const tags = [];
  for (const match of source.matchAll(/<x-[\w.:-]+/g)) {
    // The tag ends at the first > outside quotes and brackets (so `=>` in
    // @class([...]) doesn't end it).
    let end = match.index;
    for (let quote = null, depth = 0; end < source.length; end++) {
      const char = source[end];
      if (quote) quote = char === quote ? null : quote;
      else if (char === '"' || char === "'") quote = char;
      else if (char === "(" || char === "[") depth++;
      else if (char === ")" || char === "]") depth--;
      else if (char === ">" && depth === 0) break;
    }
    tags.push([match.index, end]);
  }
  return tags;
};
const echoDirectives = (tag) => {
  let output = "";
  let index = 0;
  for (const match of tag.matchAll(/@json\(|@js\(/g)) {
    if (match.index < index) continue;
    let depth = 1;
    let end = match.index + match[0].length;
    for (; end < tag.length && depth; end++) depth += tag[end] === "(" ? 1 : tag[end] === ")" ? -1 : 0;
    output += `${tag.slice(index, match.index)}{{ \\Illuminate\\Support\\Js::from(${tag.slice(match.index + match[0].length, end - 1)}) }}`;
    index = end;
  }
  return output + tag.slice(index);
};
const singleQuotedAttribute = /(\s(?!:)[\w:.@-]+=')([^']*)(')/g;
const fixTag = (tag) => echoDirectives(tag.replace(singleQuotedAttribute, (match, start, value, end) => start + value.replaceAll('"', "&quot;") + end));

// Handoff bugs the rewrite above can't cover. Each must match exactly once, so a
// fixed handoff release fails the build until its patch is removed.
const patches = {
  // A Blade loop inside <x-ui.card x-data="…"> is never compiled; loop in JS instead.
  "resources/views/components/patterns/report-filter-builder.blade.php": [[
    "            @foreach ($filters as $filter)\n                this.draft.selections[@js($filter['id'])] = [];\n            @endforeach",
    "            for (const id of @js(array_column($filters, 'id'))) this.draft.selections[id] = [];",
  ]],
};
for (const [path, replacements] of Object.entries(patches)) {
  let source = kit.get(path)?.toString() ?? "";
  for (const [from, to] of replacements) {
    if (source.split(from).length !== 2) fail(`${path}: patch no longer matches; remove it if the handoff fixed this`);
    source = source.replace(from, to);
  }
  kit.set(path, Buffer.from(source));
}
const fixedFiles = [];
for (const [path, content] of kit) {
  if (!path.endsWith(".blade.php")) continue;
  const source = content.toString();
  let fixed = source;
  for (const [start, end] of componentTags(source).reverse()) {
    fixed = fixed.slice(0, start) + fixTag(fixed.slice(start, end)) + fixed.slice(end);
  }
  if (fixed !== source) {
    kit.set(path, Buffer.from(fixed));
    fixedFiles.push(path);
  }
  for (const [start, end] of componentTags(fixed)) {
    const tag = fixed.slice(start, end);
    if (/@json\(|@js\(/.test(tag)) fail(`${path}: @js/@json left inside a component tag`);
    if (/@(foreach|forelse|for|while|if|unless|isset|empty|switch|php)\b/.test(tag)) {
      fail(`${path}: Blade directive inside a component tag, which Blade won't compile`);
    }
  }
}

// One dependency list. The two handoffs must agree on every shared pin.
const uiDependencies = await readJson(`${blade}/dependencies.json`);
const patternDependencies = await readJson("_pattern-lib/blade/dependencies.json");
const fontPin = (await readJson("_comp-lib/react/dependencies.json")).styleDependencies["@fontsource/instrument-sans"];
for (const group of ["composer", "npm"]) {
  for (const [name, version] of Object.entries(patternDependencies[group])) {
    if (uiDependencies[group][name] !== version) fail(`${group} ${name}: patterns pin ${version}, library pins ${uiDependencies[group][name]}`);
  }
}
const dependencies = {
  framework: uiDependencies.framework,
  composer: uiDependencies.composer,
  npm: { ...uiDependencies.npm, "@fontsource/instrument-sans": fontPin },
  forbidden: uiDependencies.forbidden,
};
add("scudamores/dependencies.json", `${JSON.stringify(dependencies, null, 2)}\n`);

// Version: library versions plus a hash of everything above.
const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");
const contentHash = sha256([...kit.keys()].sort().map((path) => `${path} ${sha256(kit.get(path))}`).join("\n")).slice(0, 12);
const uiVersion = (await read("_comp-lib/VERSION")).toString().trim();
const patternsVersion = (await read("_pattern-lib/VERSION")).toString().trim();
const version = `ui ${uiVersion}, patterns ${patternsVersion}, content ${contentHash}`;
add("scudamores/VERSION", `ui ${uiVersion}\npatterns ${patternsVersion}\ncontent ${contentHash}\n`);

// AGENTS.md: how an agent turns the React prototype into Blade with this kit.
const registry = await readJson("registry.json");
const componentRows = [];
const bladeTags = new Set();
const differences = [];
for (const item of registry.items.filter((item) => item.meta?.blade && !item.name.startsWith("pattern-"))) {
  const catalogue = await readJson(`_comp-lib/catalog/components/${item.name}.json`);
  const parts = catalogue.blade.files
    .map((file) => file.match(/components\/ui\/(.+)\.blade\.php$/)?.[1])
    .filter((path) => path?.includes("/"))
    .map((path) => `\`<x-ui.${path.replace(/\//g, ".")}>\``);
  bladeTags.add(item.meta.blade.installPath.split("/").pop().replace(".blade.php", ""));
  bladeTags.add(catalogue.blade.canonicalTag.slice("<x-ui.".length, -1));
  componentRows.push(`| \`${item.meta.import}\` | ${item.meta.exports.join(", ")} | \`${catalogue.blade.canonicalTag}\`${parts.length ? ` (${parts.join(", ")})` : ""} |`);
  for (const difference of catalogue.parity?.intentionalDifferences ?? []) {
    if (!/Lucide/.test(difference)) differences.push(`${item.name}: ${difference}`);
  }
}
const bladeOnly = (await readdir(resolve(workspaceRoot, `${blade}/library/resources/views/components/ui`)))
  .filter((file) => file.endsWith(".blade.php"))
  .map((file) => file.replace(".blade.php", ""))
  .filter((name) => !bladeTags.has(name))
  .map((name) => `\`<x-ui.${name}>\``);
const patternRows = patterns.map(({ catalogue }) => {
  const item = registry.items.find((item) => item.name === `pattern-${catalogue.id}`);
  const events = catalogue.blade.events?.length ? catalogue.blade.events.map((event) => `\`${event}\``).join(", ") : "see its README";
  for (const difference of catalogue.parity?.differences ?? []) {
    if (!/Lucide/.test(difference)) differences.push(`${catalogue.id}: ${difference}`);
  }
  return `| \`${item.meta.import}\` | \`<x-patterns.${catalogue.id}>\` | ${events} |`;
});
const npmInstall = Object.entries(dependencies.npm).map(([name, pin]) => `${name}@${pin}`).join(" ");

const guide = `<!-- Generated by scripts/build-blade-kit.mjs. Do not edit by hand. -->
# Scudamore's Blade kit

Version: ${version}. Latest kit: ${zipUrl} (this guide: ${guideUrl}).

The Laravel Blade edition of the Scudamore's Brand Kit components and patterns. Use it to rebuild
a React prototype made with the \`@scudamores\` shadcn registry as a Laravel 12 Blade app. Every
React component and pattern in the prototype has a Blade equivalent listed below.

**Library-owned** (replace on update, never edit): \`app/View/Components/Ui/\`,
\`resources/views/components/ui/\`, \`resources/js/ui/\`, \`resources/css/scudamores/\`.
**Adaptable:** \`resources/views/components/patterns/\` are starting points; edit them freely.
**Reference only:** \`scudamores/\` (this guide, version, manifest, examples, fixtures, docs).
For people: \`scudamores/README.md\` explains the kit to the app's developers (ownership, wiring
patterns to the backend, updates). Leave it in place when handing the app over.

## Install (once)

Requires PHP 8.2+, Laravel 12, Tailwind CSS 4 and Vite (the Laravel 12 starter has them). From the
app root:

1. Download and unpack the kit in place:

   \`\`\`sh
   ${installCommand}
   \`\`\`

2. Install the dependencies at their exact versions:

   \`\`\`sh
   composer require ${Object.entries(dependencies.composer).map(([name, pin]) => `${name}:${pin}`).join(" ")}
   npm i -E ${npmInstall}
   \`\`\`

3. In \`resources/css/app.css\`, directly below \`@import 'tailwindcss';\`, add:

   \`\`\`css
   @import './scudamores/ui.css';
   @import './scudamores/patterns.css';
   \`\`\`

4. In \`resources/js/app.js\`, add:

   \`\`\`js
   import { Alpine } from './ui/index.js';
   window.Alpine = Alpine;
   Alpine.start();
   \`\`\`

   If the app already starts Alpine elsewhere, call \`registerUi(Alpine)\` from \`./ui/index.js\`
   before it starts instead. Don't add Livewire or jQuery.

5. In the layout, load both through \`@vite(['resources/css/app.css', 'resources/js/app.js'])\` and
   put \`x-data\` on \`<body>\`. Several patterns (\`booking-card\`, \`report-workspace-tabs\`,
   \`contextual-action-dock\` …) have no Alpine scope of their own and rely on the page's to
   dispatch their events. Dark mode is the \`dark\` class on \`<html>\`; the app decides when to
   set it.

## Translating the prototype

Components: replace each React import with its Blade tag. React sub-components become dotted tags:
\`CardContent\` → \`<x-ui.card.content>\`, \`DialogTitle\` → \`<x-ui.dialog.title>\`. Props keep their
names in kebab-case (\`variant="outline"\`, \`size="sm"\`); bind PHP values with \`:\`.
Usage examples for every component are in \`scudamores/reference/examples/<component>/\`.

| React import | Exports | Blade |
|---|---|---|
${componentRows.join("\n")}

Blade-only components (no React version): ${bladeOnly.join(", ")}.

Patterns: each React pattern in \`src/patterns/<pattern>/\` is a Blade component. Its props mirror
the React props (kebab-case in the tag, e.g. \`:time-bands="$timeBands"\`). Sample data for every
state is in \`scudamores/reference/fixtures/<pattern>/\`; props, events and payloads are in
\`scudamores/reference/patterns/<pattern>.md\`.

| React import | Blade | Events |
|---|---|---|
${patternRows.join("\n")}

Rules:

- React callbacks (\`onSubmit\`, \`onChange\` …) become browser events dispatched with Alpine
  (\`ui:<pattern>:change\`, \`ui:<pattern>:action\`); listen with \`x-on:\` or progressively enhance
  to a normal Laravel form submission.
- Icons: React uses Lucide, Blade uses Phosphor (\`<x-phosphor-check />\`), so names differ.
- \`Input\`, \`Checkbox\`, \`Radio\`, \`Select\`, \`Textarea\` and \`Error\` are class-backed and keep
  \`old()\` values and validation errors. Use \`<x-ui.form>\` for CSRF, method spoofing and uploads.
- Persistence, authentication, permissions, routing, payments and calculations belong to the app,
  not the kit. Replace the prototype's mock data and local state with real controllers and models.

Known differences from React:

${differences.map((difference) => `- ${difference}`).join("\n")}

Fixed in this kit: Blade doesn't compile \`@js()\` or \`@json()\` inside a component tag's attributes,
so the original source sent them to the browser as raw text. The kit rewrites those uses to
\`{{ \\Illuminate\\Support\\Js::from(...) }}\` in ${fixedFiles.length} files, and replaces a Blade loop inside
\`report-filter-builder\`'s card with a JavaScript loop. Laravel also prints double quotes in a
component attribute as \`\\"\`, which ends the HTML attribute early, so the kit writes them as
\`&quot;\`. Do the same in new code: inside \`<x-…>\` tags, use
\`{{ \\Illuminate\\Support\\Js::from($value) }}\`, no Blade directives, and \`&quot;\` or single quotes
for JavaScript strings. Plain HTML elements can keep \`@js()\`.

Pass pattern props explicitly, one attribute per prop. Fixtures can hold preview-only keys (e.g.
\`previewRecords\`) that aren't props. Always pass \`:errors\` to \`<x-patterns.checkout-details-panel>\`
(\`[]\` when there are none): Laravel shares its own \`$errors\` with every view, and without the
attribute the pattern receives that object instead of an array and fails.

## Updating

1. Download the new kit into a temporary folder:
   \`mkdir -p /tmp/scudamores-kit && curl -fsSL ${zipUrl} -o /tmp/scudamores-kit/kit.zip && unzip -o -q /tmp/scudamores-kit/kit.zip -d /tmp/scudamores-kit\`.
2. Compare \`/tmp/scudamores-kit/scudamores/VERSION\` with the installed \`scudamores/VERSION\`.
3. Copy the library-owned folders and \`scudamores/\` over the app's copies.
4. For each file in \`resources/views/components/patterns/\`, compare its sha256 with the installed
   \`scudamores/manifest.json\`. If it matches, the app hasn't edited it: replace it. If it differs, the
   app adapted it: merge the new version by hand.
5. Reinstall dependencies if \`scudamores/dependencies.json\` changed, then rebuild assets.

## Existing apps

When migrating an app that uses the older tags, copy
\`scudamores/reference/compatibility/resources/views/components/\` into
\`resources/views/components/\` while pages are moved over. The legacy tags delegate to \`<x-ui.*>\`
with these variant mappings: \`primary → default\`, \`secondary → outline\`, \`danger → destructive\`,
\`base → default\`. \`scudamores/reference/migration-crosswalk.json\` maps each old file to its
replacement. Remove the compatibility files once nothing uses them.

## Feeding changes back

Don't edit library-owned files. When a component or pattern needs to change (a missing variant, a
bug, a new pattern worth sharing), note it in \`scudamores/FEEDBACK.md\` in the app: what, where,
why, and the code if you wrote a local version. That file goes back to the Brand Kit, which updates
the React and Blade editions together and publishes a new kit.
`;
add("scudamores/AGENTS.md", guide);

// Manifest: sha256 of every other file, used to detect local edits on update.
const manifest = {
  version,
  files: Object.fromEntries([...kit.keys()].sort().map((path) => [path, sha256(kit.get(path))])),
};
add("scudamores/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);

if (errors.length) {
  console.error(`Blade kit build failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

// Minimal zip writer (deflate, UTF-8 names, fixed 1980-01-01 timestamps).
const zip = (entries) => {
  const local = [];
  const central = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const nameBytes = Buffer.from(name);
    const compressed = zlib.deflateRawSync(data, { level: 9 });
    const crc = zlib.crc32(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x0800, 6);
    header.writeUInt16LE(8, 8);
    header.writeUInt16LE(0x0021, 12);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(compressed.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(nameBytes.length, 26);
    local.push(header, nameBytes, compressed);
    const record = Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50, 0);
    record.writeUInt16LE(20, 4);
    record.writeUInt16LE(20, 6);
    record.writeUInt16LE(0x0800, 8);
    record.writeUInt16LE(8, 10);
    record.writeUInt16LE(0x0021, 14);
    record.writeUInt32LE(crc, 16);
    record.writeUInt32LE(compressed.length, 20);
    record.writeUInt32LE(data.length, 24);
    record.writeUInt16LE(nameBytes.length, 28);
    record.writeUInt32LE(offset, 42);
    central.push(record, nameBytes);
    offset += header.length + nameBytes.length + compressed.length;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
};

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await writeFile(resolve(outputDir, zipName), zip([...kit.entries()].sort(([a], [b]) => a.localeCompare(b))));
await writeFile(resolve(outputDir, "AGENTS.md"), guide);
await writeFile(resolve(outputDir, "README.md"), readme);
console.log(`Blade kit built: ${kit.size} files → public/blade/${zipName} (${version})`);
