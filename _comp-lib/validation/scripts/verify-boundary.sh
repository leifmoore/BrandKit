#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$repo_root"

approved_commit="d1511e224305585680723101a0b76be93eb9f2f0"
approved_hash="82b55ce6513ce99a55146a1fcc81533b7ecf5e53200a088135b0e8313afc1b6d"

actual_commit="$(git rev-parse HEAD)"
if [[ "$actual_commit" != "$approved_commit" ]]; then
  echo "Source commit changed: expected $approved_commit, received $actual_commit" >&2
  exit 1
fi

actual_hash="$(find src docs/design-system '_style-reference/multi-channel-sales-platform-main 2/resources/views/components' '_style-reference/multi-channel-sales-platform-main 2/app/View/Components' -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | awk '{print $1}')"
if [[ "$actual_hash" != "$approved_hash" ]]; then
  echo "Approved source aggregate changed: expected $approved_hash, received $actual_hash" >&2
  exit 1
fi

outside_changes="$(git status --short --untracked-files=all | awk '$2 !~ /^_comp-lib\// { print }')"
if [[ -n "$outside_changes" ]]; then
  echo "Changes outside _comp-lib were detected:" >&2
  echo "$outside_changes" >&2
  exit 1
fi

echo "Boundary verification passed: approved sources are unchanged and all workspace changes are inside _comp-lib/."
