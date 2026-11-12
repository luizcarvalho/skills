#!/usr/bin/env bash
# Instala as skills de animação.
#
#   ./install.sh            instala dependências e liga as skills no Claude Code (~/.claude/skills)
#   ./install.sh --codex    também liga no Codex CLI (~/.codex/skills)
#   ./install.sh --to DIR   liga em outra pasta de skills (repita para várias)
#   ./install.sh --no-link  só instala dependências (para usar via AGENTS.md ou linha de comando)
set -euo pipefail
DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
TARGETS=("$HOME/.claude/skills")
LINK=1
while [[ $# -gt 0 ]]; do
  case "$1" in
    --codex) TARGETS+=("$HOME/.codex/skills") ;;
    --to) TARGETS+=("$2"); shift ;;
    --no-link) LINK=0 ;;
    -h|--help) sed -n '2,8p' "$0"; exit 0 ;;
    *) echo "opção desconhecida: $1"; exit 1 ;;
  esac
  shift
done

need() { command -v "$1" >/dev/null 2>&1 || { echo "✗ falta '$1'. $2"; exit 1; }; }
need node "Instale Node 18+ (macOS: brew install node | Ubuntu/WSL: https://nodejs.org ou nvm)."
need ffmpeg "Instale o ffmpeg (macOS: brew install ffmpeg | Ubuntu/WSL: sudo apt install ffmpeg)."
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[[ "$NODE_MAJOR" -ge 18 ]] || { echo "✗ Node $NODE_MAJOR encontrado; precisa do 18 ou mais novo."; exit 1; }

echo "→ instalando dependências (Playwright)…"
(cd "$DIR" && npm install --no-fund --no-audit --loglevel=error)
if [[ -z "${CHROME_PATH:-}" ]]; then
  echo "→ baixando o Chromium usado na renderização (uma vez, ~150 MB)…"
  (cd "$DIR" && npx playwright install chromium)
else
  echo "→ usando o Chrome de CHROME_PATH=$CHROME_PATH"
fi

if [[ "$LINK" == 1 ]]; then
  for T in "${TARGETS[@]}"; do
    mkdir -p "$T"
    for S in "$DIR"/skills/*/; do
      S="${S%/}"; NAME="$(basename "$S")"
      if [[ -e "$T/$NAME" && ! -L "$T/$NAME" ]]; then echo "  ! $T/$NAME já existe e não é um link; pulei"; continue; fi
      ln -sfn "$S" "$T/$NAME"
    done
    echo "→ skills ligadas em $T"
  done
fi

echo "→ teste rápido…"
(cd "$DIR" && node engine/render.mjs graph --still 4 --out "$DIR/animacoes-out/teste.png" >/dev/null) && echo "✓ pronto. Teste em $DIR/animacoes-out/teste.png"
echo
echo "Experimente no Claude Code:  /graph Um centavo, dobrando todo dia por 30 dias"
echo "Ou sem IA:                   node $DIR/engine/render.mjs graph"
