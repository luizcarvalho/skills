---
name: breakdown
description: Gera um vídeo vertical (1080x1920, MP4) que mostra do que algo é feito, com itens caindo um a um e empilhando ao lado de uma embalagem enquanto um contador sobe (ex. cubos de açúcar numa lata de refrigerante). Use quando o usuário pedir /breakdown, "quanto X tem em Y", "mostrar em cubos/unidades", ou quiser tornar uma quantidade concreta num Reel/Short/TikTok.
---

# /breakdown: do que algo é feito de verdade

Transforma uma quantidade abstrata (gramas, calorias, litros) em objetos que dá para contar. Os itens caem um a um, empilham numa pirâmide e o contador acompanha. No fim aparece uma pílula com o número real.

## Passo a passo

1. **Descubra o número real** e a conversão (ex.: 35 g de açúcar ÷ ~4 g por cubo ≈ 9 cubos). Use dado do usuário ou de fonte confiável (rótulo, tabela nutricional) e cite-a. **Não invente.**
2. **Escreva o spec** em `./animacoes-out/breakdown.json`.
3. **Confira:** `bash <pasta-desta-skill>/render.sh ./animacoes-out/breakdown.json --sheet --out ./animacoes-out/breakdown.mp4` e olhe `breakdown-sheet.png` (faixas vermelhas = zona coberta pela interface do app).
4. **Renderize** sem `--sheet` (cerca de 20 s). `--gif` gera GIF também.
5. **Entregue** o caminho e a fonte do número.

## Spec (todos opcionais)

| campo | padrão | o que faz |
|---|---|---|
| `title` | `"Uma lata de refrigerante"` | linha de cima |
| `count` | `9` | quantos itens caem (1 a 36) |
| `unit` / `unitSingular` | `"cubos de açúcar"` / `"cubo de açúcar"` | texto ao lado do número |
| `note` | `"Isso dá cerca de 35 g"` | pílula final (`null` esconde) |
| `container` | `{kind:"can", label:"COLA", color:"#8e3a22", labelColor:"#f6eee4"}` | embalagem: `can`, `jar`, `box` ou `none` |
| `item` | `{kind:"cube", color:"#f9f8f4", shade:"#dcd8d0"}` | item: `cube` ou `ball` |
| `colors` | `{bg:"#f3e4d6", ink:"#2a1910", title:"#9a5a3a"}` | paleta |
| `duration` / `animate` | `6` / `3.6` | duração total / segundos até o último item cair |
| `tag`, `locale` | `"/breakdown"`, `"pt-BR"` | etiqueta e idioma |

## Exemplos

Prompt: `/breakdown Quanto açúcar tem numa lata de refrigerante?` → padrão.

Prompt: `/breakdown Quantas colheres de sopa de óleo tem num pote de 200 g de pasta de amendoim?` (com o número vindo do rótulo)
```json
{ "title": "Um pote de pasta de amendoim", "count": 7, "unit": "colheres de óleo", "unitSingular": "colher de óleo",
  "note": "Cerca de 100 g de gordura", "container": { "kind": "jar", "label": "AMENDOIM", "color": "#b5762f" },
  "item": { "kind": "ball", "color": "#f2c94c", "shade": "#c99a1e" } }
```

## Regras

- `count` precisa ser derivado de um dado real; explique a conta na entrega.
- `label` da embalagem: genérico (sem marcas registradas).
- Textos curtos: `unit` até ~18 caracteres.
