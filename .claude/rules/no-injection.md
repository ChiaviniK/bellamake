# Rule: Prevenção contra injeção

## SQL Injection
- Proibido concatenar strings em queries SQL.
- Use ORM, prepared statements ou query builder parametrizado.

## NoSQL Injection
- Validar operadores recebidos do cliente.
- Nunca repassar objeto JSON livre diretamente para consulta.

## Command Injection
- Evitar executar shell com entrada do usuário.
- Quando inevitável, usar lista de argumentos e allowlist.

## Template Injection
- Não renderizar templates com conteúdo não confiável sem escaping.

## LDAP/XPath/GraphQL Injection
- Validar entrada, usar parâmetros e limitar profundidade/complexidade em GraphQL.
