#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

stop_stale_dev_port() {
  local port=$1
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port $port is in use — stopping previous dev server..."
    lsof -tiTCP:"$port" -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
}

stop_stale_dev_port 8788
stop_stale_dev_port 5173

if [[ ! -f dist/index.html ]]; then
  echo "dist/ is missing. Run: npm run build"
  exit 1
fi

if [[ ! -f dist/worker/index.js ]]; then
  echo "Worker bundle missing. Running: npm run build:worker"
  npm run build:worker
fi

WRANGLER_PID=""

cleanup() {
  if [[ -n "$WRANGLER_PID" ]]; then
    kill "$WRANGLER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

npx wrangler dev --port 8788 --ip 127.0.0.1 &
WRANGLER_PID=$!

echo "Waiting for Wrangler on http://127.0.0.1:8788 ..."
for _ in $(seq 1 120); do
  if curl -sf http://127.0.0.1:8788/api/health >/dev/null 2>&1; then
    break
  fi
  if ! kill -0 "$WRANGLER_PID" 2>/dev/null; then
    echo "Wrangler exited before becoming ready."
    exit 1
  fi
  sleep 0.5
done

if ! curl -sf http://127.0.0.1:8788/api/health >/dev/null 2>&1; then
  echo "Wrangler did not become ready on http://127.0.0.1:8788"
  exit 1
fi

echo ""
echo "Full-stack dev ready → http://127.0.0.1:5173"
echo "  (Use :5173 for UI with hot reload. Turnstile is disabled on localhost.)"
echo "  (Wrangler API + D1 on :8788 — do not use :8788 for UI unless you npm run build first)"
echo ""

npx vite --host 127.0.0.1 --port 5173
