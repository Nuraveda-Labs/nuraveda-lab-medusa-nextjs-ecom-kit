#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

npm run build
sudo systemctl restart your-storefront.service
attempt=0
while [ "$attempt" -lt 30 ]; do
  if curl -fsS http://127.0.0.1:8080/ >/dev/null; then
    exit 0
  fi
  attempt=$((attempt + 1))
  sleep 1
done

echo "deploy health check failed after restart" >&2
exit 1
