#!/usr/bin/env bash
# Renderiza o exemplo padrão de todas as skills em ./animacoes-out/
set -euo pipefail
DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/.." && pwd)"
for S in "$DIR"/skills/*/; do
  N="$(basename "$S")"; echo "== $N"
  node "$DIR/engine/render.mjs" "$N" --out "animacoes-out/$N.mp4"
done
