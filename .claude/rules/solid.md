# Rule: SOLID e arquitetura sustentável

## S — Single Responsibility Principle
- Cada classe, função, hook, service ou componente deve ter uma responsabilidade clara.
- Controller não deve conter regra de negócio.
- Repository não deve conter regra de apresentação.
- Componente visual não deve conter chamada direta complexa de infraestrutura.

## O — Open/Closed Principle
- O código deve permitir extensão sem alteração excessiva de código estável.
- Use estratégias, adapters ou composição quando houver variação real.
- Não criar abstração prematura apenas por previsão incerta.

## L — Liskov Substitution Principle
- Implementações devem respeitar o contrato da abstração.
- Não criar subclasses ou implementações que quebrem expectativas do consumidor.

## I — Interface Segregation Principle
- Prefira interfaces pequenas e específicas.
- Não obrigue consumidores a depender de métodos que não usam.
- DTOs de entrada, saída e persistência devem ser separados quando tiverem responsabilidades diferentes.

## D — Dependency Inversion Principle
- Casos de uso devem depender de contratos, não de detalhes externos.
- Infraestrutura deve implementar portas/adapters do domínio.
- Integrações externas devem ficar isoladas atrás de clients/services.

## Aplicação prática por camada
- Controller/Route: recebe requisição, valida entrada, chama caso de uso e retorna resposta.
- Use Case/Service: coordena regra de negócio.
- Domain: concentra invariantes e comportamento essencial.
- Repository/Gateway: abstrai persistência ou integração externa.
- DTO/Schema: define contrato de entrada e saída.
