#!/usr/bin/env bash
# Stop local dev servers (Wrangler :8788, Vite :5173).
set -euo pipefail

cd "$(dirname "$0")/.."

stop_port() {
  local port=$1
  local pids
  pids=$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [[ -z "$pids" ]]; then
    return
  fi
  echo "Stopping port $port..."
  echo "$pids" | xargs kill -TERM 2>/dev/null || true
  sleep 1
  pids=$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "$pids" | xargs kill -9 2>/dev/null || true
  fi
}

# Match this project's dev processes (in case ports were reused).
pkill -f "wrangler dev --port 8788" 2>/dev/null || true
pkill -f "node_modules/.bin/vite" 2>/dev/null || true
pkill -f "vite --host 127.0.0.1 --port 5173" 2>/dev/null || true

stop_port 5173
stop_port 8788

if lsof -nP -iTCP:5173 -sTCP:LISTEN >/dev/null 2>&1 || lsof -nP -iTCP:8788 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Warning: something is still listening on 5173 or 8788."
  lsof -nP -iTCP:5173 -sTCP:LISTEN 2>/dev/null || true
  lsof -nP -iTCP:8788 -sTCP:LISTEN 2>/dev/null || true
  exit 1
fi

echo "Dev servers stopped."
