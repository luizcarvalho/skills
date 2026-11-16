# skills

Skills reutilizáveis para assistentes de IA (Claude Code, Codex CLI e outros que leem `SKILL.md` / `AGENTS.md`).

## Catálogo

| pasta | skills | o que faz |
|---|---|---|
| [`animacoes/`](animacoes/) | `/breakdown`, `/deep-dive`, `/one-line`, `/8-bit`, `/flight-path`, `/graph` | 6 skills que geram animações verticais (1080×1920, MP4) para Reels, Shorts e TikTok |
| [`desenvolvimento/sabatina/`](desenvolvimento/sabatina/) | `/sabatina` | Conduz uma sabatina baseada em árvore de decisões para eliminar suposições ocultas e blindar planos, arquiteturas ou ideias de negócio antes da execução |

## Pré-requisitos gerais

Clone o repositório uma vez:

```bash
git clone https://github.com/luizcarvalho/skills.git ~/skills
```

- **Para `desenvolvimento/sabatina/`:** nenhuma dependência extra.
- **Para `animacoes/`:** requer Node 18+, `ffmpeg` e o Chromium do Playwright (veja os detalhes em [`animacoes/README.md`](animacoes/README.md)).

## Como instalar cada skill separadamente

Cada skill funciona de forma independente quando ligada (via link simbólico) na pasta de skills do seu assistente:

| assistente | pasta global | pasta por projeto |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex CLI | `~/.codex/skills/` | `.agents/skills/` |
| Outros compatíveis com `SKILL.md` | pasta configurada na ferramenta | `.agents/skills/` |

### 1. `/sabatina` (`desenvolvimento/sabatina`)

Basta criar o diretório de destino (se ainda não existir) e ligar a pasta da skill:

```bash
# Claude Code
mkdir -p ~/.claude/skills
ln -sfn ~/skills/desenvolvimento/sabatina ~/.claude/skills/sabatina

# Codex CLI
mkdir -p ~/.codex/skills
ln -sfn ~/skills/desenvolvimento/sabatina ~/.codex/skills/sabatina

# Outro assistente / pasta local do projeto
mkdir -p .agents/skills
ln -sfn ~/skills/desenvolvimento/sabatina .agents/skills/sabatina
```

### 2. Skills de animação (`breakdown`, `deep-dive`, `one-line`, `8-bit`, `flight-path`, `graph`)

As skills de animação compartilham o motor em `animacoes/engine/`. Primeiro instale as dependências do motor **sem** criar links para todas as skills:

```bash
cd ~/skills/animacoes && ./install.sh --no-link
```

Depois, ligue apenas as skills que você quiser (substitua `<nome>` por `breakdown`, `deep-dive`, `one-line`, `8-bit`, `flight-path` ou `graph`):

```bash
# Claude Code
mkdir -p ~/.claude/skills
ln -sfn ~/skills/animacoes/skills/<nome> ~/.claude/skills/<nome>

# Codex CLI
mkdir -p ~/.codex/skills
ln -sfn ~/skills/animacoes/skills/<nome> ~/.codex/skills/<nome>

# Exemplo: instalar só /graph e /flight-path no Claude Code
ln -sfn ~/skills/animacoes/skills/graph ~/.claude/skills/graph
ln -sfn ~/skills/animacoes/skills/flight-path ~/.claude/skills/flight-path
```

O `render.sh` de cada skill resolve o link simbólico automaticamente até o `engine/render.mjs`.

## Instalar todas as skills de animação de uma vez

```bash
cd ~/skills/animacoes
./install.sh          # instala dependências e liga as 6 skills em ~/.claude/skills/
./install.sh --codex  # também liga em ~/.codex/skills/
./install.sh --to DIR # liga em outra pasta de skills
```

## Remover uma skill instalada

Como a instalação usa links simbólicos, basta apagar o link correspondente (os arquivos originais no repositório permanecem intactos):

```bash
rm ~/.claude/skills/<nome>
```
