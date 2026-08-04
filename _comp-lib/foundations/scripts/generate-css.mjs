#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dataDirectory = join(here, '..', 'data');
const cssDirectory = join(here, '..', 'css');
const tokens = JSON.parse(readFileSync(join(dataDirectory, 'tokens.json'), 'utf8'));
const brands = JSON.parse(readFileSync(join(dataDirectory, 'brands.json'), 'utf8'));

const declarationBlock = (selector, entries) => [
  `${selector} {`,
  ...entries.map(([name, value]) => `  --${name}: ${value};`),
  '}',
].join('\n');

const tokenEntries = Object.entries(tokens.tokens);
const lightEntries = tokenEntries.map(([name, token]) => [name, token.light]);
const darkEntries = tokenEntries
  .filter(([, token]) => token.dark !== token.light)
  .map(([name, token]) => [name, token.dark]);

const tokenCss = [
  '/* Generated-equivalent output of ../data/tokens.json. Do not hand-edit. */',
  '',
  declarationBlock(':root', lightEntries),
  '',
  declarationBlock('.dark', darkEntries),
  '',
].join('\n');

const brandBlocks = [];
for (const [id, preset] of Object.entries(brands.presets)) {
  brandBlocks.push(declarationBlock(`.brand-${id}`, Object.entries(preset.light)));
}
for (const [id, preset] of Object.entries(brands.presets)) {
  brandBlocks.push(declarationBlock(`.dark.brand-${id}`, Object.entries(preset.dark)));
}
const brandCss = [
  '/* Generated-equivalent output of ../data/brands.json. Do not hand-edit. */',
  '',
  brandBlocks.join('\n\n'),
  '',
].join('\n');

const themeLines = [
  '/* Generated-equivalent Tailwind v4 aliases for tokens.json. */',
  '',
  '@custom-variant dark (&:where(.dark, .dark *));',
  '',
  '@theme {',
  `  --font-sans: ${tokens.tailwindAliases.font.sans};`,
  '}',
  '',
  '@theme inline {',
  ...tokens.tailwindAliases.colors.map((name) => `  --color-${name}: var(--${name});`),
  ...Object.entries(tokens.tailwindAliases.radii).map(([name, value]) => `  --radius-${name}: ${value};`),
  '}',
  '',
];
const themeCss = themeLines.join('\n');

const outputs = new Map([
  [join(cssDirectory, 'tokens.css'), tokenCss],
  [join(cssDirectory, 'brands.css'), brandCss],
  [join(cssDirectory, 'tailwind-theme.css'), themeCss],
]);

const write = process.argv.includes('--write');
let stale = false;
for (const [path, expected] of outputs) {
  if (write) {
    writeFileSync(path, expected);
    continue;
  }

  const actual = readFileSync(path, 'utf8');
  if (actual !== expected) {
    stale = true;
    console.error(`stale generated CSS: ${path}`);
  }
}

if (stale) {
  console.error('Run `node foundations/scripts/generate-css.mjs --write` from _comp-lib, then review the diff.');
  process.exit(1);
}

if (!write) console.log('Foundation CSS matches tokens.json and brands.json.');
