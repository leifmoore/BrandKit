#!/usr/bin/env bash
set -euo pipefail

comp_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$comp_root"

version="$(tr -d '[:space:]' < VERSION)"
archive="releases/scudamores-ui-${version}.zip"
checksum="${archive}.sha256"

node validation/scripts/generate-catalog.mjs
node validation/scripts/generate-docs.mjs
node foundations/scripts/generate-css.mjs
node validation/scripts/validate-recipes.mjs
node validation/scripts/validate-structure.mjs
node validation/scripts/generate-file-inventory.mjs
bash validation/scripts/verify-boundary.sh

mkdir -p releases
if [[ -f "$archive" ]]; then
  mv "$archive" "${archive}.previous"
fi
if [[ -f "$checksum" ]]; then
  mv "$checksum" "${checksum}.previous"
fi

zip -q -r "$archive" . \
  -x 'releases/*' \
  -x '*/node_modules/*' \
  -x '*/vendor/*' \
  -x '*/.cache/*' \
  -x '*/dist/*' \
  -x '*/build/*' \
  -x '*/tmp/*'

sha256sum "$archive" | sed "s#  releases/#  #" > "$checksum"
rm -f "${archive}.previous" "${checksum}.previous"

echo "Created $archive and $checksum"
