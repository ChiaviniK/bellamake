# PROJ_DANIEL — architecture.md

## Visão arquitetural
[Descreva se o sistema será monólito modular, microserviços, modular monolith, serverless, BFF, monorepo, etc.]

## Containers principais
- `apps/api`: backend da aplicação
- `apps/web`: frontend da aplicação
- `packages/shared`: contratos, schemas, tipos e utilitários compartilhados
- `packages/ui`: componentes visuais reutilizáveis
- `packages/config-*`: configurações compartilhadas de lint, testes, build e TypeScript
- Banco de dados principal: [MySQL/PostgreSQL/SQL Server/etc.]
- Cache: [Redis/outro]
- Filas: [RabbitMQ/Kafka/SQS/BullMQ/Celery/Hangfire]

## Padrões arquiteturais
- Clean Architecture ou arquitetura em camadas
- Separação entre controller, use case/service, domínio e infraestrutura
- DTOs ou schemas em toda fronteira externa
- Validação de entrada obrigatória
- Tratamento padronizado de erros
- Observabilidade com logs, métricas e traces
- Idempotência em operações críticas
- Rate limiting em endpoints sensíveis
- Circuit breaker e timeout em integrações externas

## Decisões arquiteturais registradas
- ADR-001: Escolha do banco de dados
- ADR-002: Estratégia de autenticação
- ADR-003: Estratégia de autorização
- ADR-004: Padrão de deploy
- ADR-005: Estratégia de logs e monitoramento
