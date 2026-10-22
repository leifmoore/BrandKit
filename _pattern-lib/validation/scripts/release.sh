#!/usr/bin/env bash
set -euo pipefail

pattern_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$pattern_root"

for command_name in jq node sha256sum unzip zip; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required release command: $command_name" >&2
    exit 1
  fi
done

# This timestamp is also recorded by generate-file-inventory.mjs. Callers may
# override it for a later release while retaining reproducible archive bytes.
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-1785801600}"
if [[ ! "$SOURCE_DATE_EPOCH" =~ ^[0-9]+$ ]] || (( SOURCE_DATE_EPOCH < 315532800 )); then
  echo "SOURCE_DATE_EPOCH must be an integer at or after 1980-01-01." >&2
  exit 1
fi
export TZ=UTC

node validation/scripts/generate-catalog.mjs
node validation/scripts/generate-preview-registry.mjs
node validation/scripts/validate-structure.mjs
node validation/scripts/validate-schemas.mjs
node validation/scripts/validate-imports.mjs
node validation/scripts/validate-blade.mjs
php validation/scripts/validate-blade-render.php
npm run typecheck
node validation/scripts/validate-react.mjs
node validation/scripts/validate-interactions.mjs
node validation/scripts/review-accessibility.mjs
node validation/scripts/validate-visual-baselines.mjs
bash validation/scripts/verify-boundary.sh
node validation/scripts/generate-validation-summary.mjs

# Validators write release evidence, so inventory generation must be last.
node validation/scripts/generate-file-inventory.mjs

version="$(tr -d '[:space:]' < VERSION)"
archive="releases/scudamores-patterns-${version}.zip"
checksum="${archive}.sha256"
mkdir -p validation/tmp
staging_root="$(mktemp -d "$pattern_root/validation/tmp/release.XXXXXX")"
trap 'rm -rf -- "$staging_root"' EXIT
staging_content="$staging_root/content"
first_archive="$staging_root/first.zip"
second_archive="$staging_root/second.zip"
unpack_root="$staging_root/unpacked"
archive_basename="$(basename "$archive")"
checksum_basename="$(basename "$checksum")"

mkdir -p "$staging_content" "$unpack_root"

# The manifest is the archive allow-list. This prevents caches, dependencies,
# build output, releases and unrelated later files from entering the ZIP.
while IFS= read -r source_path; do
  if [[ -z "$source_path" \
    || "$source_path" == /* \
    || "$source_path" == ".." \
    || "$source_path" == ../* \
    || "$source_path" == */../* \
    || "$source_path" == */.. ]]; then
    echo "Unsafe path in export-manifest.json: $source_path" >&2
    exit 1
  fi
  mkdir -p "$staging_content/$(dirname "$source_path")"
  cp -- "$source_path" "$staging_content/$source_path"
done < <(jq -r '.files[].path' export-manifest.json)
cp -- export-manifest.json "$staging_content/export-manifest.json"

# Normalize permissions and timestamps without mutating the maintained tree.
find "$staging_content" -type d -exec chmod 0755 {} +
find "$staging_content" -type f -exec chmod 0644 {} +
find "$staging_content" -exec touch -h -d "@$SOURCE_DATE_EPOCH" {} +

(
  cd "$staging_content"
  find . -type f -print | LC_ALL=C sort | sed 's#^./##' | zip -9 -X -q "$first_archive" -@
  find . -type f -print | LC_ALL=C sort | sed 's#^./##' | zip -9 -X -q "$second_archive" -@
)

if ! cmp -s "$first_archive" "$second_archive"; then
  echo "Reproducibility check failed: two archive builds differ." >&2
  exit 1
fi

unzip -tq "$first_archive" >/dev/null
unzip -q "$first_archive" -d "$unpack_root"

# Verify the unpacked payload against every recorded size and digest, and
# reject any unrecorded file other than the self-describing manifest.
node --input-type=module - "$unpack_root" <<'NODE'
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const unpackRoot = process.argv[2];
const manifest = JSON.parse(await readFile(join(unpackRoot, "export-manifest.json"), "utf8"));
const expected = new Map(manifest.files.map((file) => [file.path, file]));

async function walk(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(absolute));
    else if (entry.isFile()) paths.push(absolute);
    else throw new Error(`Unsupported unpacked entry: ${absolute}`);
  }
  return paths;
}

const actual = (await walk(unpackRoot))
  .map((path) => relative(unpackRoot, path).split(sep).join("/"))
  .filter((path) => path !== "export-manifest.json")
  .sort();
const listed = [...expected.keys()].sort();
if (JSON.stringify(actual) !== JSON.stringify(listed)) {
  throw new Error("Unpacked file set does not match export-manifest.json.");
}

const rootHash = createHash("sha256");
for (const { path, bytes, sha256 } of manifest.files) {
  const content = await readFile(join(unpackRoot, path));
  const digest = createHash("sha256").update(content).digest("hex");
  if (content.byteLength !== bytes || digest !== sha256) {
    throw new Error(`Unpacked file failed size/hash verification: ${path}`);
  }
  rootHash.update(`${path}\0${bytes}\0${sha256}\n`);
}
if (rootHash.digest("hex") !== manifest.rootSha256) {
  throw new Error("Unpacked root hash does not match export-manifest.json.");
}
NODE

cp -- "$first_archive" "$staging_root/$archive_basename"
(
  cd "$staging_root"
  sha256sum "$archive_basename" > "$checksum_basename"
  sha256sum --check "$checksum_basename" >/dev/null
)

archive_sha256="$(sha256sum "$staging_root/$archive_basename" | awk '{print $1}')"

mkdir -p releases
mv -- "$staging_root/$archive_basename" "$archive"
mv -- "$staging_root/$checksum_basename" "$checksum"
(
  cd releases
  sha256sum --check "$checksum_basename" >/dev/null
)
echo "Created $archive"
echo "SHA-256: $archive_sha256"
echo "Verified: deterministic rebuild, ZIP integrity, unpacked manifest, and checksum."
