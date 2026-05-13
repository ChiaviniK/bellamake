# Rule: Segurança frontend

## XSS
- Nunca usar `dangerouslySetInnerHTML` sem sanitização explícita.
- Não renderizar HTML vindo de usuário ou integração externa sem sanitizar.
- Usar escaping padrão do framework.

## Tokens e sessão
- Não expor tokens em logs, URLs, query strings ou localStorage sem justificativa.
- Preferir cookies HttpOnly/Secure/SameSite quando adequado.

## CSRF
- Aplicar SameSite em cookies.
- Usar CSRF token em fluxos que dependem de cookies e mutações sensíveis.

## Dados sensíveis
- Não guardar dados sensíveis em estado global sem necessidade.
- Não persistir PII em localStorage/sessionStorage sem justificativa.
- Não exibir campos sensíveis para perfis sem permissão.

## Componentes
- Componentes devem validar props quando possível.
- Componentes visuais não devem conter regra de negócio crítica.
- A autorização visual não substitui autorização backend.

## Dependências e bundle
- Evitar bibliotecas desnecessárias.
- Não importar pacotes server-only em frontend.
- Validar impacto de bundle antes de adicionar dependência pesada.
