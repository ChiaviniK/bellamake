# Rule: Segurança de bibliotecas e dependências

## Antes de adicionar biblioteca
- Verifique se a funcionalidade já existe no projeto.
- Avalie manutenção, comunidade, frequência de atualização, licença e reputação.
- Prefira bibliotecas pequenas, estáveis e específicas.
- Evite dependências abandonadas, sem tipagem, sem testes ou com histórico recorrente de vulnerabilidades.

## Versionamento
- Use lockfile versionado: pnpm-lock.yaml, package-lock.json, poetry.lock, uv.lock, requirements.lock, packages.lock.json ou equivalente.
- Proibido usar versões flutuantes sem justificativa: `latest`, `*`, ranges amplos ou snapshots instáveis.
- Atualizações devem rodar testes, build e scanner de vulnerabilidades.

## Supply chain
- Proibido instalar pacote de origem desconhecida.
- Proibido executar script remoto sem revisão.
- Validar nomes parecidos para evitar typosquatting.
- Não permitir postinstall perigoso sem auditoria.
- Usar registry confiável.

## Dependências frontend
- Evitar bibliotecas pesadas para tarefas simples.
- Validar impacto no bundle.
- Não importar bibliotecas server-side em componentes client-side.

## Dependências backend
- Validar compatibilidade com runtime e framework.
- Validar CVEs e vulnerabilidades conhecidas.
- Nunca adicionar biblioteca de criptografia caseira ou pouco confiável.
