#!/usr/bin/env bash
set -uo pipefail
export COREPACK_ENABLE_STRICT=0
# Build both the Medusa backend and the Next.js storefront.
# Run from the repository root.
ROOT="$(cd "$(dirname "$0")" && pwd)"
log(){ echo "[$(date +%H:%M:%S)] $*"; }
log "=== MEDUSA: pnpm install ==="
cd "$ROOT/medusa"
corepack pnpm install --prefer-offline 2>&1 | tail -6; log "medusa install exit=${PIPESTATUS[0]}"
log "=== MEDUSA: build ==="
corepack pnpm exec medusa build 2>&1 | tail -8; log "medusa build exit=${PIPESTATUS[0]}"
log "=== STOREFRONT: npm install ==="
cd "$ROOT"
npm install --no-audit --no-fund 2>&1 | tail -6; log "storefront install exit=${PIPESTATUS[0]}"
log "=== STOREFRONT: next build ==="
npm run build 2>&1 | tail -12; log "storefront build exit=${PIPESTATUS[0]}"
log "=== ALL DONE ==="
