# skills

Skills reutilizáveis para assistentes de IA (Claude Code, ChatGPT/Codex CLI, Antigravity, Cursor, Gemini CLI e outros que leem `SKILL.md` / `AGENTS.md`).

---

## ⚡ Instalação Fácil (Recomendado via IA)

A forma mais simples de instalar qualquer uma dessas skills é **pedir diretamente para o seu assistente de IA** (Claude Code, ChatGPT/Codex, Antigravity, Cursor, etc.). Você não precisa rodar comandos manuais — basta copiar o endereço direto da skill e pedir para a IA instalar.

### Exemplo de prompt para a IA:

```text
Instale a skill sabatina para mim a partir de:
https://github.com/luizcarvalho/skills/tree/main/desenvolvimento/sabatina
```

ou para uma animação:

```text
Instale a skill graph para mim a partir de:
https://github.com/luizcarvalho/skills/tree/main/animacoes/skills/graph
```

A IA identifica o repositório, clona ou copia os arquivos necessários, resolve dependências e configura o link na pasta de skills do seu ambiente automaticamente.

### Links diretos das skills para copiar e colar:

| Skill | Comando | Link direto para enviar à IA | O que faz |
|---|---|---|---|
| **Sabatina** | `/sabatina` | `https://github.com/luizcarvalho/skills/tree/main/desenvolvimento/sabatina` | Blinda planos, arquiteturas e ideias com árvore de decisões |
| **Graph** | `/graph` | `https://github.com/luizcarvalho/skills/tree/main/animacoes/skills/graph` | Gera gráfico de barras animado e contador em vídeo vertical |
| **Flight Path** | `/flight-path` | `https://github.com/luizcarvalho/skills/tree/main/animacoes/skills/flight-path` | Animação de rota de voo entre cidades com distância e tempo |
| **Breakdown** | `/breakdown` | `https://github.com/luizcarvalho/skills/tree/main/animacoes/skills/breakdown` | Mostra composição de produtos empilhando itens |
| **Deep Dive** | `/deep-dive` | `https://github.com/luizcarvalho/skills/tree/main/animacoes/skills/deep-dive` | Animação de descida em profundidade com marcos |
| **One Line** | `/one-line` | `https://github.com/luizcarvalho/skills/tree/main/animacoes/skills/one-line` | Linha viva minimalista acompanhando frase/conceito |
| **8-Bit** | `/8-bit` | `https://github.com/luizcarvalho/skills/tree/main/animacoes/skills/8-bit` | Cenas retrô em pixel art com sprites espaciais e legenda |

---

## 🛠️ Instalação Manual (Linha de Comando)

Se preferir instalar manualmente pelo terminal, siga os passos abaixo.

### 1. Clone o repositório

```bash
git clone https://github.com/luizcarvalho/skills.git ~/skills
```

- **Para `desenvolvimento/sabatina/`:** nenhuma dependência externa necessária.
- **Para `animacoes/`:** requer Node 18+, `ffmpeg` e o Chromium do Playwright (detalhes em [`animacoes/README.md`](animacoes/README.md)).

### 2. Onde as skills são instaladas

| Assistente | Pasta global | Pasta por projeto |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex CLI | `~/.codex/skills/` | `.agents/skills/` |
| Antigravity / Outros | Pasta configurada na ferramenta | `.agents/skills/` ou `.gemini/skills/` |

---

### Instalação individual manual

#### `/sabatina` (`desenvolvimento/sabatina`)

Basta criar a pasta de destino (se não existir) e criar o link simbólico:

```bash
# Claude Code
mkdir -p ~/.claude/skills
ln -sfn ~/skills/desenvolvimento/sabatina ~/.claude/skills/sabatina

# Codex CLI
mkdir -p ~/.codex/skills
ln -sfn ~/skills/desenvolvimento/sabatina ~/.codex/skills/sabatina

# Antigravity / pasta local do projeto
mkdir -p .agents/skills
ln -sfn ~/skills/desenvolvimento/sabatina .agents/skills/sabatina
```

#### Skills de animação individualmente

As skills de animação compartilham o motor em `animacoes/engine/`. Primeiro instale as dependências do motor:

```bash
cd ~/skills/animacoes && ./install.sh --no-link
```

Depois crie o link apenas para a skill que deseja (substitua `<nome>` por `breakdown`, `deep-dive`, `one-line`, `8-bit`, `flight-path` ou `graph`):

```bash
# Exemplo: instalar /graph no Claude Code
ln -sfn ~/skills/animacoes/skills/graph ~/.claude/skills/graph

# Exemplo: instalar /flight-path no Codex CLI
ln -sfn ~/skills/animacoes/skills/flight-path ~/.codex/skills/flight-path
```

---

### Instalar todas as skills de animação de uma vez

```bash
cd ~/skills/animacoes
./install.sh          # instala dependências e liga as 6 skills em ~/.claude/skills/
./install.sh --codex  # também liga em ~/.codex/skills/
./install.sh --to DIR # liga em outra pasta customizada
```

---

### Remover uma skill

Basta remover o link simbólico correspondente:

```bash
rm ~/.claude/skills/<nome>
```
