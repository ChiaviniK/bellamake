# Rule: Validação de entrada

## Backend
- Validar todo dado recebido por HTTP, fila, webhook, arquivo, formulário ou integração externa.
- Usar DTOs, schemas ou validators.
- Rejeitar campos inesperados quando possível.
- Definir limites de tamanho, tipo, formato e range.

## Frontend
- Validação frontend melhora UX, mas não substitui validação backend.
- Mensagens de erro devem ser claras e não revelar detalhes internos.

## Sanitização e encoding
- Para HTML, aplicar escaping/encoding antes de renderizar conteúdo do usuário.
- Para SQL, usar parâmetros, ORM ou query builder parametrizado.
- Para comandos de sistema, evitar interpolação de entrada do usuário.
- Para arquivos, validar nome, extensão, MIME type, tamanho e conteúdo.
