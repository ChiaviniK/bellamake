# Rule: Segurança DevOps

## CI/CD
- Pipeline deve rodar lint, testes, build e scanner de dependências.
- Deploy em produção deve exigir aprovação conforme criticidade.
- Segredos de pipeline devem ficar em secret manager da plataforma.

## Containers
- Usar imagens oficiais e atualizadas.
- Evitar rodar container como root.
- Não copiar `.env`, `.git`, chaves ou arquivos locais para imagem.
- Usar multi-stage build quando possível.
- Reduzir superfície da imagem final.

## Cloud
- Aplicar menor privilégio em IAM.
- Não expor banco publicamente sem necessidade.
- Usar rede privada para serviços internos.
- Configurar backup, retenção e restore testado.

## Observabilidade
- Monitorar erro, latência, uso de CPU/memória, filas e banco.
- Criar alertas para falhas de autenticação, picos de erro e indisponibilidade.
