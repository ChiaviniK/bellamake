# Rule: Segurança backend

## Endpoints
- Todo endpoint deve declarar método, rota, autenticação, autorização, DTO de entrada e DTO de saída.
- Não expor stack trace para cliente.
- Usar respostas de erro padronizadas.
- Aplicar rate limit em login, recuperação de senha, upload, busca e endpoints caros.

## Integrações externas
- Definir timeout curto e retry com backoff.
- Usar circuit breaker quando necessário.
- Validar assinatura de webhooks.
- Tratar conteúdo externo como não confiável.

## Dados
- Usar paginação em listagens.
- Nunca retornar campos sensíveis sem necessidade.
- Aplicar filtros por usuário, tenant ou permissão.
- Evitar N+1 queries.

## Transações
- Usar transações em operações multi-tabela.
- Garantir idempotência em operações críticas.
- Evitar side effects antes de commit quando possível.

## Uploads
- Limitar tamanho.
- Validar tipo real do arquivo.
- Renomear arquivo no servidor.
- Armazenar fora da pasta pública quando sensível.
- Escanear arquivos quando aplicável.
