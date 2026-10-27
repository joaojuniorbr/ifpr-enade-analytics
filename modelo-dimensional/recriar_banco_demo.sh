#!/usr/bin/env bash
# Recria o banco de teste (Aiven) com seed demo para Power BI.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/modelo-dimensional"
python3 gerar_seed.py --demo
cd "$ROOT/enade-app"
node --env-file-if-exists=.env ./node_modules/prisma/build/index.js db execute \
  --schema prisma/schema.prisma \
  --file ../modelo-dimensional/carga.sql
echo "Carga demo concluída."
