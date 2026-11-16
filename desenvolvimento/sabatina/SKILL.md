---
name: sabatina
description: Submeta qualquer plano, arquitetura ou ideia de negócio a uma sabatina implacável baseada em árvore de decisões. Elimina suposições ocultas e pontos cegos antes da execução. Use quando o usuário quiser blindar um projeto, testar a solidez de uma ideia ou acionar gatilhos como "/sabatina", "faça uma sabatina", "prova de fogo", "teste de estresse" ou "me interrogue".
---

Conduza uma sabatina implacável com o usuário até alcançarem um entendimento absoluto e blindado sobre o projeto. Mapeie todo o raciocínio como uma **árvore de decisões**: cada escolha abre ramificações para as próximas decisões que dependem dela.

Avance pela árvore em **rodadas**. A **fronteira** representa todas as decisões cujos pré-requisitos já foram resolvidos: são as perguntas que você pode fazer _agora_, sem precisar adivinhar respostas que ainda não ouviu. Dispare toda a fronteira de uma só vez na mesma rodada: numere cada pergunta e entregue imediatamente a sua recomendação estratégica. Depois, aguarde as respostas do usuário antes de avançar para a próxima rodada.

Estruture cada rodada exatamente neste formato:


```

* ❓ **P1**
**<título direto da decisão>**: <contexto e pergunta detalhada, podendo conter múltiplos parágrafos e opções claras de escolha>

➡️ 

---

* ❓ **P2**
**<título direto da decisão>**: <contexto e pergunta detalhada, podendo conter múltiplos parágrafos e opções claras de escolha>

➡️ 

```

Formule cada pergunta de modo que um simples "sim" do usuário aprove imediatamente a sua recomendação.

A cada rodada respondida, a árvore se reconfigura: decisões tomadas empurram a fronteira para frente e desbloqueiam as perguntas que dependiam delas. Recalcule a nova fronteira e dispare a próxima rodada. Qualquer pergunta que dependa de uma resposta ainda em aberto nesta rodada pertence a uma rodada _futura_, nunca à atual.

Buscar _fatos_ é sua obrigação, jamais do usuário. Sempre que uma pergunta da fronteira exigir um dado concreto do ambiente (arquivos, ferramentas, sistema, etc.), acione um subagente com janela de contexto limpa para investigar; nunca pergunte ao usuário algo que você mesmo pode descobrir. Não trave o fluxo por causa disso: uma investigação em andamento é um pré-requisito pendente, então apenas as perguntas dependentes dela aguardam o retorno do subagente; dispare o restante da fronteira imediatamente. As _decisões_ pertencem ao usuário: coloque cada uma na mesa e aguarde.

A sessão só termina quando a fronteira estiver vazia: cada galho da árvore de decisões explorado, sem nenhuma premissa oculta ou suposição silenciosa. Não execute nenhuma ação final até que o usuário confirme que vocês chegaram a um entendimento sólido e compartilhado. Por fim pergunte ao usuário o que ele deseja fazer com o resultado da sabatina.

