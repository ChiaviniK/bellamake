# Rule: Segurança da informação

## Classificação de dados
- Classifique dados como públicos, internos, confidenciais, pessoais ou sensíveis.
- Dados pessoais e sensíveis exigem minimização, mascaramento e controle de acesso.
- Colete apenas dados necessários para a finalidade da feature.

## Segredos e credenciais
- Segredos devem estar em secret manager, variáveis de ambiente seguras ou vault.
- Nunca versionar `.env`, certificados, chaves privadas, tokens, dumps de banco ou arquivos de produção.
- Rotacionar credenciais expostas imediatamente.

## Logs
- Logs não devem conter senha, token, CPF, documento, cartão, chave privada, refresh token ou payload sensível.
- Use correlationId/requestId para rastreio.
- Mascarar dados pessoais quando necessário.

## Criptografia
- Use HTTPS/TLS em trânsito.
- Use algoritmos confiáveis e bibliotecas maduras.
- Senhas devem usar hash forte com salt, como Argon2, bcrypt ou PBKDF2.
- Nunca criar algoritmo criptográfico próprio.

## Ambientes
- Separar desenvolvimento, homologação e produção.
- Dados reais não devem ser usados em ambiente local sem anonimização.
- Acesso à produção deve ser auditável e restrito.
