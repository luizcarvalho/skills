#!/usr/bin/env bash
# Renderiza esta skill.  Uso: bash render.sh spec.json [--sheet | --still <t> | --gif | --out arquivo.mp4]
# Funciona mesmo quando a pasta da skill é um link simbólico (ex.: ~/.claude/skills/<nome>).
set -euo pipefail
DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
exec node "$DIR/../../engine/render.mjs" "$(basename "$DIR")" "$@"
