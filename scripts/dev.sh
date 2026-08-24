#!/bin/bash
# Dev entrypoint for the preview environment.
# Ignores extra CLI args (e.g. --port) passed by the runner and always
# serves the web app on port 8080.
cd "$(dirname "$0")/.."
exec pnpm --filter @oneallhost/web exec next dev -p 8080
