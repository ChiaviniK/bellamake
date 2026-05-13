# Rule: Clean Code universal

## Clareza
- Código deve ser lido como uma explicação do problema.
- Nomes devem revelar intenção.
- Evite abreviações obscuras.
- Funções devem fazer uma coisa principal.

## Tamanho e complexidade
- Evite funções longas.
- Evite classes ou componentes com múltiplas responsabilidades.
- Reduza aninhamento excessivo com early return.
- Extraia funções quando houver repetição real ou regra de negócio relevante.

## Comentários
- Comentários devem explicar o porquê, não repetir o que o código já diz.
- Remova código comentado.
- Use documentação para decisões arquiteturais e regras de negócio complexas.

## Erros
- Não engolir exceções silenciosamente.
- Não retornar `null` de forma ambígua quando houver alternativa segura.
- Erros devem ser tratados de forma consistente.

## Duplicação
- Não copie e cole regra de negócio.
- Centralize validações e transformações comuns.
- Extraia componentes, hooks, services ou helpers quando houver reaproveitamento real.

## Simplicidade
- Prefira solução simples e explícita.
- Não criar abstração antes de existir necessidade concreta.
- Evite overengineering.
