# Rule: Segurança e integridade de banco

## Queries
- Proibido SQL concatenado.
- Queries devem ser parametrizadas.
- Queries sensíveis devem respeitar tenantId, userId ou política de acesso.

## Migrations
- Toda migration deve ter plano de rollback.
- Alterações destrutivas devem seguir estratégia em fases.
- Nunca rodar migration de produção sem backup, janela ou runbook.
- Colunas NOT NULL em tabela existente exigem default ou backfill.

## Privilégios
- Aplicação deve usar usuário com permissões mínimas.
- MCP e agentes devem usar usuário read-only por padrão.
- Separar usuário de migration do usuário da aplicação.

## Dados sensíveis
- Criptografar ou tokenizar quando necessário.
- Mascarar dumps de homologação.
- Evitar copiar produção para desenvolvimento.
