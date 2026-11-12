---
name: 8-bit
description: Gera um vídeo vertical (1080x1920, MP4) em pixel art retrô, estilo videogame dos anos 80: céu estrelado, planeta, chão, sprites que se movem por trajetos (módulo lunar, astronauta, foguete, OVNI, bandeiras) e uma legenda digitada letra a letra. Use quando o usuário pedir /8-bit, "em pixel art", "estilo videogame retrô", ou quiser recontar um momento histórico ou uma história curta num Reel/Short/TikTok.
---

# /8-bit: cenas retrô em pixel art

A cena é montada por **atores**: cada um é um sprite com um trajeto no tempo. O padrão recria o pouso na Lua de 1969 com a bandeira do Brasil.

## Passo a passo

1. **Defina a história em 3 a 5 batidas** (quem entra, para onde vai, o que acontece) e a legenda final (até ~20 caracteres, maiúsculas).
2. **Monte o spec** em `./animacoes-out/8-bit.json`: título, planeta, cores e a lista `actors`. Use os sprites prontos ou desenhe novos em `sprites`.
3. **Confira:** `bash <pasta-desta-skill>/render.sh ./animacoes-out/8-bit.json --sheet --out ./animacoes-out/8-bit.mp4`. Atores precisam aparecer inteiros e não cobrir a legenda.
4. **Renderize** sem `--sheet` (cerca de 20 s).

## Spec

| campo | padrão | o que faz |
|---|---|---|
| `title` | `"1969"` | texto grande no topo (fonte pixel) |
| `caption` / `captionAt` | `"UM PEQUENO PASSO"` / `1.7` | legenda digitada e quando começa (s) |
| `planet` | `{kind:"earth", x:836, y:470, size:208}` | `earth`, `moon`, `sun`, `mars` ou `null` |
| `groundY` | `1300` | altura do chão |
| `colors` | `{sky, title, ground, groundTop, crater, caption}` | paleta |
| `stars`, `craters` | `150`, `true` | detalhes |
| `actors` | módulo lunar, astronauta, bandeira | ver abaixo |
| `sprites` | `{}` | sprites próprios |
| `pixel` | `8` | tamanho do pixel |

**Ator:** `{ "sprite": "lander", "path": [[t, x, y], ...], "appear": t, "flame": true, "dust": true, "walk": true, "pole": true }`
- `path`: pontos no tempo (s) com x,y do canto superior esquerdo; `y` pode ser `"ground"` (apoiado no chão).
- `flame`: fogo embaixo enquanto se move. `dust`: poeira ao chegar. `walk`: alterna os quadros de animação. `pole`: desenha um mastro e põe o sprite no topo (bandeiras).

**Sprites prontos:** `lander`, `astronaut` (2 quadros), `rocket`, `ufo`, `flag-brasil`, `flag-eua`, `flag-portugal`.

**Sprite próprio:** cada string é uma fileira; cada letra é uma cor da paleta; `.` é transparente.
```json
"sprites": { "gato": { "pixel": 8, "pal": { "P": "#222222", "W": "#ffffff" },
  "rows": ["P...P", "PPPPP", "PWPWP", "PPPPP", ".P.P."] } }
```

## Exemplo

Prompt: `/8-bit O primeiro foguete brasileiro decolando`
```json
{ "title": "1965", "caption": "DECOLAGEM", "planet": { "kind": "sun", "x": 840, "y": 470, "size": 180 },
  "colors": { "sky": "#0b1033", "ground": "#6f8f4a", "groundTop": "#8fb35e", "crater": "#5a7a3a" }, "craters": false,
  "actors": [ { "sprite": "flag-brasil", "appear": 0.2, "path": [[0.2, 180, "ground"]], "pole": true },
              { "sprite": "rocket", "path": [[0, 500, "ground"], [0.8, 500, "ground"], [3.2, 500, -200]], "flame": true } ] }
```
(confira o fato histórico antes de usar)

## Regras

- Fatos históricos precisam ser verdadeiros; na dúvida, pergunte ou pesquise.
- Sem personagens, logos ou arte de jogos existentes: crie sprites originais.
