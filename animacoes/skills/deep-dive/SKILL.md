---
name: deep-dive
description: Gera um vídeo vertical (1080x1920, MP4) de uma descida pelo oceano (ou qualquer profundidade) com um contador em metros e marcos que passam pelo submarino até chegar ao fundo. Use quando o usuário pedir /deep-dive, "qual a profundidade de", "mostrar a escala de profundidade", ou quiser comparar profundidades num Reel/Short/TikTok.
---

# /deep-dive: descida com marcos

Um submarino (ou mergulhador) desce enquanto o contador sobe. Cada marco cruza o veículo exatamente quando o contador passa pelo valor dele. A luz some, o farol acende e, no fim, o fundo (com ou sem naufrágio) aparece.

## Passo a passo

1. **Pegue a profundidade alvo e 2 a 5 marcos reais** no caminho (ex.: limite do mergulho, fim da luz do sol, zona dos cachalotes). Use fontes confiáveis e cite-as. **Não invente valores.**
2. **Escreva o spec** em `./animacoes-out/deep-dive.json`. Marcos em ordem crescente e todos menores que `target`.
3. **Confira:** `bash <pasta-desta-skill>/render.sh ./animacoes-out/deep-dive.json --sheet --out ./animacoes-out/deep-dive.mp4` e olhe a folha de contato.
4. **Renderize** sem `--sheet` (cerca de 25 s).
5. **Entregue** o caminho e as fontes.

## Spec (todos opcionais)

| campo | padrão | o que faz |
|---|---|---|
| `target` | `3800` | profundidade final |
| `unit` | `"m"` | unidade |
| `subtitle` | `"abaixo da superfície"` | texto durante a descida |
| `finalSubtitle` | `"Naufrágio do Titanic, Atlântico Norte"` | texto ao chegar (`null` mantém o anterior) |
| `markers` | 40, 200, 1.000, 2.250 m | lista `{value, label}` |
| `floor` | `"wreck"` | `wreck` (navio), `seabed` (só o fundo) ou `none` |
| `vehicle` | `"submarine"` | `submarine`, `diver` ou `none` |
| `colors` | `{top:"#3f80ad", deep:"#020a14", sky:"#b9d3e3", vehicle:"#f3c11a"}` | paleta |
| `duration` / `animate` | `6` / `4` | duração total / segundos de descida |

## Exemplo

Prompt: `/deep-dive Até onde chega um mergulhador livre?`
```json
{ "target": 214, "subtitle": "abaixo da superfície", "finalSubtitle": "Recorde de apneia sem limites",
  "markers": [ { "value": 18, "label": "Mergulho recreativo" }, { "value": 40, "label": "Limite do mergulho autônomo" },
               { "value": 100, "label": "Pressão de 11 atmosferas" } ],
  "floor": "seabed", "vehicle": "diver" }
```
(confirme o recorde atual numa fonte antes de usar)

## Regras

- Os valores precisam ser verificáveis; se não tiver certeza, pergunte ou pesquise.
- Rótulos de marco curtos (até ~28 caracteres).
