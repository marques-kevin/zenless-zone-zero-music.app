#!/bin/bash
set -euo pipefail

if [[ -z "${ROOT_WORKTREE_PATH:-}" ]]; then
  echo "ROOT_WORKTREE_PATH is not set" >&2
  exit 1
fi

if [[ -f "$ROOT_WORKTREE_PATH/.env" ]]; then
  cp "$ROOT_WORKTREE_PATH/.env" .env
  echo "Copied .env from root worktree"
else
  echo "Warning: no .env found at $ROOT_WORKTREE_PATH/.env" >&2
fi

yarn install
