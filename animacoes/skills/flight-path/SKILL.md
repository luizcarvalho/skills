---
name: flight-path
description: Gera um vídeo vertical (1080x1920, MP4) com uma rota de voo animada entre duas cidades, avião percorrendo o arco, cartão com códigos dos aeroportos, distância e tempo contando até "Pousou". Use quando o usuário pedir /flight-path, "rota de voo", "de X para Y", "mostrar a viagem no mapa", ou quiser mostrar uma viagem num Reel/Short/TikTok.
---

# /flight-path: rota animada entre duas cidades

O mapa é orientado pela direção real entre as cidades (latitude e longitude). A distância é calculada em linha reta (grande círculo) e o tempo é estimado, a menos que o usuário informe os valores.

## Passo a passo

1. **Identifique as cidades e os aeroportos** (código IATA de 3 letras) e as coordenadas aproximadas (latitude e longitude). Se o usuário souber a distância ou o tempo reais do voo, use-os.
2. **Escreva o spec** em `./animacoes-out/flight-path.json`.
3. **Confira:** `bash <pasta-desta-skill>/render.sh ./animacoes-out/flight-path.json --sheet --out ./animacoes-out/flight-path.mp4`. Nomes longos não podem sair da tela.
4. **Renderize** sem `--sheet` (cerca de 20 s).
5. **Entregue** o caminho e diga se distância e tempo são calculados/estimados.

## Spec (todos opcionais)

| campo | padrão | o que faz |
|---|---|---|
| `from` | `{name:"Palmas", code:"PMW", lat:-10.291, lon:-48.357}` | origem |
| `to` | `{name:"Rio de Janeiro", code:"GIG", lat:-22.81, lon:-43.251}` | destino |
| `distanceKm` | `null` | `null` = linha reta pelas coordenadas |
| `durationMin` | `null` | `null` = estimativa: distância ÷ 780 km/h + 30 min |
| `units` | `"km"` | `km` ou `mi` |
| `landedLabel` | `"✓ Pousou"` | selo ao chegar |
| `accent` | `"#ff8a2b"` | cor da rota |
| `colors` | `{bg, card, line, sub}` | paleta |
| `duration` / `animate` | `6` / `3.8` | duração total / segundos de voo |

## Exemplo

Prompt: `/flight-path De São Paulo para Lisboa`
```json
{ "from": { "name": "São Paulo", "code": "GRU", "lat": -23.435, "lon": -46.473 },
  "to": { "name": "Lisboa", "code": "LIS", "lat": 38.774, "lon": -9.134 } }
```

## Regras

- Distância calculada é em linha reta; o tempo padrão é estimativa. Diga isso na entrega.
- Não afirme que existe voo direto sem confirmar.
