#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if lsof -nP -iTCP:8788 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 8788 is already in use. Stop the other dev server first:"
  echo "  pkill -f \"wrangler dev\""
  exit 1
fi

if lsof -nP -iTCP:5173 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 5173 is already in use. Stop the other Vite server first:"
  echo "  pkill -f \"node_modules/.bin/vite\""
  exit 1
fi

if [[ ! -f dist/index.html ]]; then
  echo "dist/ is missing. Run: npm run build"
  exit 1
fi

if [[ ! -f dist/worker/index.js ]]; then
  echo "Worker bundle missing. Running: npm run build:worker"
  npm run build:worker
fi

cleanup() {
  if [[ -n "${VITE_PID:-}" ]]; then
    kill "$VITE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

npx vite --host 127.0.0.1 --port 5173 &
VITE_PID=$!

echo "Waiting for Vite on http://127.0.0.1:5173 ..."
for _ in $(seq 1 60); do
  if curl -sf http://127.0.0.1:5173/ >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

echo ""
echo "Full-stack dev ready → http://127.0.0.1:8788"
echo "  (Vite HMR for UI, Wrangler for /api + D1)"
echo ""

exec npx wrangler dev --port 8788 --ip 127.0.0.1 --proxy 5173
