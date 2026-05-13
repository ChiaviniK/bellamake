# Rule: Autenticação segura

## Login
- Nunca retornar se o erro foi usuário inexistente ou senha incorreta; use mensagem genérica.
- Aplicar rate limiting e proteção contra brute force.
- Usar MFA para perfis administrativos quando possível.

## Senhas
- Nunca armazenar senha em texto puro.
- Nunca logar senha.
- Exigir política mínima de senha compatível com o risco do sistema.
- Fluxo de recuperação de senha deve usar token curto, único e expirável.

## Tokens
- Access token deve ter expiração curta.
- Refresh token deve ser revogável e armazenado com segurança.
- Cookies de autenticação devem usar HttpOnly, Secure e SameSite adequado.
- Não armazenar tokens sensíveis em localStorage se houver alternativa mais segura.

## Sessões
- Invalidar sessão em logout.
- Revogar sessões após troca de senha.
- Registrar eventos críticos de autenticação.
