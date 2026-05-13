# Rule: Autorização segura

## Controle de acesso
- Todo endpoint privado deve validar usuário autenticado.
- Toda ação sensível deve validar permissão, papel ou política.
- Nunca confiar apenas na regra do frontend.
- Validar acesso no backend em nível de recurso.

## IDOR / BOLA
- Nunca buscar recurso apenas por ID sem verificar se pertence ao usuário/tenant/autorização.
- IDs sequenciais não substituem autorização.
- Multi-tenant deve filtrar por tenantId em todas as queries sensíveis.

## Perfis administrativos
- Ações administrativas devem ter logs de auditoria.
- Mudanças críticas exigem confirmação adicional ou dupla checagem.
