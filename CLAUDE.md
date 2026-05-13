# PROJ_DANIEL — Contexto Agêntico

Este arquivo serve como memória central para o desenvolvimento do projeto seguindo o **Guia Universal de Desenvolvimento Agêntico**.

## Workflow Obrigatório
- **Research**: Antes de qualquer mudança, leia `docs/specs/` e mapeie o impacto.
- **Plan**: Crie um plano de implementação detalhado e aguarde aprovação.
- **Implement**: Implemente em blocos pequenos, rodando testes e lint.
- **Task Report**: Ao concluir, gere o relatório em `docs/tasks/`.

## Estrutura do Projeto
- `docs/specs/`: Especificações (main, architecture, domain, security, quality).
- `.claude/rules/`: Regras universais de segurança, clean code e SOLID.
- `.claude/skills/`: Skills personalizadas (Graphify, Task Report).

## Graphify (Memória Persistente)
O projeto utiliza grafos de conhecimento para reduzir consumo de tokens e preservar entendimento arquitetural.
- Local: `graphify-out/`
- Skill: `.claude/skills/graphify-context/`
- Comando: `/graphify query "[contexto]"`

## Comandos Úteis
- Build: `npm run build`
- Testes: `npm test`
- Lint: `npm run lint`
