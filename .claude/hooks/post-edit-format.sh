#!/usr/bin/env bash
set +e

if [ -f "pnpm-lock.yaml" ]; then
  pnpm -s lint:fix 2>/dev/null || true
  pnpm -s format 2>/dev/null || true
fi

if [ -f "package-lock.json" ]; then
  npm run lint -- --fix 2>/dev/null || true
  npm run format 2>/dev/null || true
fi

if [ -f "pom.xml" ]; then
  ./mvnw spotless:apply -q 2>/dev/null || true
fi

if ls *.sln >/dev/null 2>&1; then
  dotnet format --verbosity quiet 2>/dev/null || true
fi

if [ -f "pyproject.toml" ]; then
  ruff check --fix . 2>/dev/null || true
  black . 2>/dev/null || true
fi

exit 0
