# PROJ_DANIEL — domain.md

## Linguagem ubíqua
- [Termo do negócio]: [definição]
- [Entidade principal]: [definição]
- [Processo principal]: [definição]

## Entidades e agregados
### [ENTIDADE]
Atributos principais:
- id
- createdAt
- updatedAt
- status

Invariantes:
- [Regra que sempre deve ser verdadeira]
- [Regra de transição de status]
- [Regra de consistência de dados]

Eventos de domínio:
- [EntidadeCriada]
- [EntidadeAtualizada]
- [EntidadeCancelada]

## Políticas de dados
- Quais dados são pessoais?
- Quais dados são sensíveis?
- Qual o tempo de retenção?
- Como ocorre anonimização ou exclusão?
- Quais logs devem mascarar dados?
