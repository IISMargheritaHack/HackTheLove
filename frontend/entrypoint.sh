#!/bin/sh

echo "🚀 Starting bun on 4000..."
bun run start --host 0.0.0.0 --port 4000 &

# Attendi finché Bun non è pronto
while ! nc -z 0.0.0.0 4000; do
  echo "⏳ waiting bun..."
  sleep 1
done

echo "🚀 Starting ngnix reverse proxy..."
exec nginx -g "daemon off;"
