# AGENTS.md: como qualquer IA usa estas skills

Este arquivo vale para qualquer assistente que rode comandos no terminal (Claude Code, Codex CLI, Gemini CLI, Cursor, GitHub Copilot, Windsurf, Aider, etc.).

## O que tem aqui

Seis geradores de vídeo vertical (1080x1920, 30 fps, MP4, sem áudio) para Reels, Shorts e TikTok. Cada um vive em `skills/<nome>/`:

| skill | quando usar |
|---|---|
| `breakdown` | "quanto X tem em Y": itens caem e empilham ao lado de uma embalagem |
| `deep-dive` | profundidade com marcos no caminho (oceano, poço, mina) |
| `one-line` | frase curta + uma linha que oscila e sobe (minimalista) |
| `8-bit` | cena retrô em pixel art com sprites, planeta e legenda digitada |
| `flight-path` | rota de voo animada entre duas cidades, com distância e tempo |
| `graph` | número grande subindo + barras crescendo, a partir de dados reais |

## Fluxo (siga sempre)

1. Escolha a skill pelo pedido e **leia `skills/<nome>/SKILL.md`**: ele traz o spec completo, exemplos e regras.
2. Escreva um JSON só com os campos que mudam em `./animacoes-out/<nome>.json`.
3. Gere a folha de contato e **olhe a imagem**:
   `node engine/render.mjs <nome> ./animacoes-out/<nome>.json --sheet --out ./animacoes-out/<nome>.mp4`
   As faixas vermelhas marcam a área coberta pela interface do app. Texto importante não pode ficar nelas, nada pode sair da tela.
4. Corrija o spec se precisar e renderize o vídeo (mesmo comando sem `--sheet`; `--gif` gera GIF também).
5. Entregue o caminho do arquivo e explique de onde vieram os números.

Para conferir um momento específico: `--still <segundos>` gera um PNG.

## Regras

- **Nunca invente dados.** Números vêm do usuário ou de fonte citada. Estimativas são ditas como estimativas.
- Mude o comportamento pelo spec, não editando o template. Só crie ou edite templates quando o usuário pedir uma skill nova.
- Textos curtos: o vídeo é visto num celular em poucos segundos.
- Sem marcas, logos, personagens ou arte de terceiros.

## Requisitos

Node 18+, ffmpeg e o Chromium do Playwright (`./install.sh --no-link` instala). Se já houver um Chrome/Chromium, use `CHROME_PATH=/caminho/do/chrome`.

## Criar uma skill nova

Copie `skills/graph/` para `skills/<novo-nome>/` e edite:
- `template.html`: chama `E.register({ defaults, setup(spec, E), draw(ctx, t, spec, state, E) })`. `draw` precisa ser função pura do tempo `t` (sem timers, sem `Math.random`; use `E.rng(seed)`). Helpers em `engine/core.js`.
- `SKILL.md`: frontmatter `name` + `description` (quando usar), passo a passo, tabela do spec, exemplo, regras.
- `example.json` e `render.sh` (o `render.sh` é igual em todas).

Depois rode `./install.sh` de novo para ligar a skill nova.
