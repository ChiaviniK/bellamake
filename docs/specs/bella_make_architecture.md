# Bella Make — architecture.md

## Visão arquitetural
Modular Monolith (BFF + API) com suporte a LocalFirst no PDV para garantir operação offline.

## Containers principais
- `apps/api`: Backend NestJS (Node.js).
- `apps/pdv`: Frontend Next.js (React) com IndexedDB para cache offline.
- `apps/admin`: Dashboard administrativo.
- `packages/shared`: Tipos, DTOs e regras de negócio de preço único.

## Padrões arquiteturais
- **Clean Architecture**: Domínio isolado de detalhes de infraestrutura (SEFAZ, Banco).
- **Event-Driven**: Notificação de venda concluída para disparar emissão fiscal de forma assíncrona.
- **Repository Pattern**: Abstração do banco de dados (PostgreSQL).

## Integrações
- SEFAZ (via API de mensageria).
- Impressoras térmicas (Protocolo ESC/POS).
