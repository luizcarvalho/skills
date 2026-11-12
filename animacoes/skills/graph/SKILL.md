---
name: graph
description: Gera um vídeo vertical (1080x1920, MP4) em que um número grande sobe enquanto um gráfico de barras se forma, terminando no valor final. Use quando o usuário pedir /graph, "gráfico animado", "animar crescimento", "mostrar evolução de seguidores/faturamento/juros compostos" ou quiser transformar uma série de números num Reel/Short/TikTok.
---

# /graph: gráfico que cresce

Um número grande conta até o valor final enquanto as barras se formam da esquerda para a direita. Fundo preto (ou branco), uma cor de destaque, nada mais.

## Passo a passo

1. **Colete os números reais.** Peça os valores, um por ponto (dia, mês, ano). Se o usuário descrever uma regra ("um centavo dobrando por 30 dias"), use `series` em vez de `values`. **Nunca invente dados.** Se faltar algo, pergunte.
2. **Escreva o spec** em `./animacoes-out/graph.json` (só os campos que mudam; o resto usa o padrão).
3. **Confira a composição:** `bash <pasta-desta-skill>/render.sh ./animacoes-out/graph.json --sheet --out ./animacoes-out/graph.mp4` e abra `graph-sheet.png`. Faixas vermelhas = áreas cobertas pelos botões do Reels. Texto importante não pode ficar nelas; títulos não podem estourar a largura.
4. **Renderize:** o mesmo comando sem `--sheet` (adicione `--gif` se quiserem GIF). Leva cerca de 15 a 20 s.
5. **Entregue** o caminho do MP4 e diga de onde vieram os números.

## Spec (todos os campos são opcionais)

| campo | padrão | o que faz |
|---|---|---|
| `title` | `"Um centavo, dobrando todo dia"` | linha acima do número |
| `values` | `null` | lista de valores reais, um por ponto |
| `series` | `{start: 0.01, factor: 2, count: 30}` | gera os valores por regra (quando `values` é null) |
| `labels` | `null` | rótulos dos pontos (`["jan","fev",...]`); se null usa `"<xLabel> N"` |
| `xLabel` | `"Dia"` | prefixo dos rótulos automáticos |
| `currency` | `"BRL"` | moeda ISO (`BRL`, `USD`, `EUR`) ou `null` para número simples |
| `unit` | `""` | sufixo quando `currency` é null (`"%"`, `" kg"`) |
| `decimalsBelow` | `1000` | abaixo disso mostra centavos |
| `theme` | `"dark"` | `dark` ou `light` |
| `accent` | `"#f7c23b"` | cor do número e das barras |
| `pills` | `true` | pílulas "primeiro ponto" e "último ponto" no rodapé |
| `duration` / `animate` | `6` / `4` | duração total / segundos até o valor final |
| `locale` | `"pt-BR"` | formato dos números |
| `tag` | `"/graph"` | etiqueta no topo (`null` esconde) |

## Exemplos

Prompt: `/graph Um centavo, dobrando todo dia por 30 dias` → padrão (R$ 0,01 até R$ 5.368.709).

Prompt: `/graph seguidores: jan 1.200, mar 3.400, mai 9.800, jul 31.000, set 100.000`
```json
{ "title": "Seguidores no Instagram", "values": [1200, 3400, 9800, 31000, 100000],
  "labels": ["jan", "mar", "mai", "jul", "set"], "currency": null, "theme": "light", "accent": "#2f6fe0" }
```

## Regras

- Só números fornecidos pelo usuário ou de fonte citada. Se for estimativa, diga isso na entrega.
- Título curto (até ~40 caracteres). Até ~40 pontos ficam legíveis.
- Não mude o template para um caso específico: ajuste pelo spec.
