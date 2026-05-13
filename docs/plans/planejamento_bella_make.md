# 💄 Planejamento de Sistema: Bella Make

> **Conceito:** Loja de maquiagem com preço único (Tudo por R$ 10,00).

---

## 📋 Escopo do Projeto
O sistema deve gerenciar as operações diárias da loja, garantindo conformidade fiscal e controle preciso de mercadorias.

## 🛠️ Requisitos Funcionais

### 1. Frente de Caixa (PDV)
* **Abertura e Fechamento:** Controle de turno e conferência de valores.
* **Venda Rápida:** Interface otimizada para o preço único de R$ 10,00.
* **Pagamentos:** Integração com Cartão (Crédito/Débito), Dinheiro e PIX.
* **Cancelamentos:** Função para estorno de itens ou vendas completas.

### 2. Módulo Fiscal
* **Cupom Fiscal (NFC-e):** Emissão automática para o consumidor final em cada venda.
* **Nota Fiscal (NF-e):** Emissão de notas de devolução, transferência ou venda para pessoa jurídica.
* **Integração SAT/MFE:** Suporte aos módulos fiscais estaduais.

### 3. Gestão de Estoque
* **Entrada de Mercadorias:** Cadastro via importação de XML do fornecedor.
* **Controle de Inventário:** Alerta de estoque baixo para reposição.
* **Categorização:** Organização por tipo (Batom, Rímel, Base, Acessórios).
* **Movimentação:** Histórico de entradas e saídas.

### 4. Gestão Financeira (Caixa)
* **Fluxo de Caixa:** Registro detalhado de entradas e saídas.
* **Relatórios:**
    * Fechamento diário.
    * Produtos mais vendidos.
    * Ticket médio por cliente.

---

## 🏗️ Estrutura de Dados

| Entidade | Atributos Principais |
| :--- | :--- |
| **Produtos** | ID, Descrição, Categoria, Código de Barras (EAN), Qtd em Estoque |
| **Vendas** | ID da Venda, Data/Hora, Itens, Valor Total, Forma de Pagamento |
| **Fiscal** | Chave de Acesso, Protocolo, XML da Nota, Status |

---

## 🚀 Próximos Passos
1. [ ] Definir a stack tecnológica.
2. [ ] Escolher a impressora térmica para os cupons.
3. [ ] Adquirir Certificado Digital (A1 ou A3).
4. [ ] Configurar regras tributárias (NCM dos produtos).

---
*Documento gerado para Bella Make © 2024*
