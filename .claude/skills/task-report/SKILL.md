---
name: task-report
description: Gera o documento de relatório obrigatório ao fim de cada task. Registra tokens com/sem Graphify, assertividade do grafo, arquivos alterados, testes e riscos.
---

## Quando invocar
Ao concluir qualquer task — antes de considerar o trabalho pronto.

## Passos
1. Coletar métricas: queries executadas, nós surfaced, arquivos lidos
2. Calcular tokens_com_graphify = tokens_queries + tokens_arquivos_lidos
3. Calcular tokens_sem_graphify = leitura naive de todos os arquivos relevantes
4. Calcular assertividade = nós_usados / nós_surfaced × 100%
5. Criar docs/tasks/YYYY-MM-DD-[feature].md com o template completo

## Template mínimo
| Seção | Conteúdo |
|---|---|
| Resumo | O que foi implementado |
| Arquivos | Criados/alterados com motivo |
| Tokens com Graphify | Queries + arquivos lidos |
| Tokens sem Graphify | Estimativa naive |
| Assertividade | Nós usados / nós surfaced |
| Testes | Resultado do lint/test/build |
| Riscos | Remanescentes com severidade |
