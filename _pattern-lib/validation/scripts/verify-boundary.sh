#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$repo_root"

expected_source="82b55ce6513ce99a55146a1fcc81533b7ecf5e53200a088135b0e8313afc1b6d"
actual_source="$(find src docs/design-system '_style-reference/multi-channel-sales-platform-main 2/resources/views/components' '_style-reference/multi-channel-sales-platform-main 2/app/View/Components' -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1)"
[[ "$actual_source" == "$expected_source" ]] || { echo "Application source lock mismatch: $actual_source" >&2; exit 1; }

expected_base="50c4b09bb6ac1d25191e884057129d9ef5e9890b2cb3d52cab52876a1ca3cfea"
actual_base="$(find _comp-lib -type f ! -path '_comp-lib/releases/*' -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1)"
[[ "$actual_base" == "$expected_base" ]] || { echo "Base library lock mismatch: $actual_base" >&2; exit 1; }

if ! git diff --quiet -- _comp-lib src docs _style-reference HANDOFF.md package.json; then
  echo "A read-only existing path has changed." >&2
  git diff --stat -- _comp-lib src docs _style-reference HANDOFF.md package.json >&2
  exit 1
fi

echo 'Boundary validation passed: source and _comp-lib hashes match; no tracked existing path changed.'
