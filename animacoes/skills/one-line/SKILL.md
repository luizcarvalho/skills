---
name: one-line
description: Gera um vídeo vertical minimalista (1080x1920, MP4), preto e branco, com uma linha que oscila mas sobe (ou cai) enquanto uma ou duas frases curtas aparecem. Use quando o usuário pedir /one-line, uma citação ou mensagem motivacional animada, "linha que sobe", ou ideias sobre progresso, hábitos, paciência e consistência num Reel/Short/TikTok.
---

# /one-line: uma ideia, uma linha

Fundo puro, uma linha tracejada reta como referência e uma linha viva que sobe, cai e volta, terminando acima de onde começou. Uma frase no começo e outra na virada.

## Passo a passo

1. **Escreva duas frases curtas** com o usuário (minúsculas, até ~45 caracteres cada). A segunda é a virada.
2. **Escreva o spec** em `./animacoes-out/one-line.json`.
3. **Confira:** `bash <pasta-desta-skill>/render.sh ./animacoes-out/one-line.json --sheet --out ./animacoes-out/one-line.mp4`.
4. **Renderize** sem `--sheet` (cerca de 15 s).
5. **Entregue** o caminho.

## Spec (todos opcionais)

| campo | padrão | o que faz |
|---|---|---|
| `line1` | `"o progresso não é uma linha reta."` | primeira frase |
| `line2` | `"mas ele ainda sobe."` | frase da virada (`null` mantém só a primeira) |
| `theme` | `"dark"` | `dark` (branco no preto) ou `light` |
| `trend` | `"up"` | `up`, `down` ou `flat` |
| `seed` | `7` | muda o desenho das oscilações |
| `waves` | `3.3` | quantidade de subidas e quedas |
| `amplitude` | `120` | altura das oscilações (px) |
| `duration` / `animate` | `5.5` / `3.6` | duração total / segundos da linha |

## Exemplo

Prompt: `/one-line Todo passo parece pequeno até você olhar para trás`
```json
{ "line1": "todo passo parece pequeno.", "line2": "até você olhar para trás.", "theme": "light", "seed": 21 }
```

## Regras

- Menos é mais: no máximo duas frases e nenhum outro elemento.
- Se a linha ficar estranha, troque `seed` em vez de mexer no template.
