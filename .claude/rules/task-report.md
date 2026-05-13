# Rule: Relatório de Task obrigatório

Ao final de cada task implementada, você DEVE criar um documento de relatório em `docs/tasks/YYYY-MM-DD-[feature].md`.

## Conteúdo do Relatório
1. **Resumo** da implementação e arquivos alterados.
2. **Queries Graphify executadas** durante a task (query, modo, nós surfaced, tokens estimados).
3. **Cálculo comparativo de tokens:**
   - Tokens com Graphify = tokens das queries + tokens dos arquivos lidos após o grafo.
   - Tokens sem Graphify = estimativa de leitura naive de todos os arquivos do projeto.
   - Redução = tokens_sem / tokens_com.
4. **Assertividade do Graphify** = nós efetivamente usados / nós totais surfaced pelas queries.
5. **Testes executados** e resultado.
6. **Riscos remanescentes**.

## Fórmulas de cálculo
- tokens_arquivo ≈ tamanho_em_bytes ÷ 4
- tokens_com_graphify = Σ(tokens de cada query) + Σ(tokens dos arquivos lidos)
- tokens_sem_graphify = Σ(tokens de TODOS os arquivos que seriam lidos sem o grafo)
- redução = tokens_sem_graphify ÷ tokens_com_graphify
- assertividade = nós_usados_na_implementação ÷ nós_surfaced_pelas_queries × 100%
