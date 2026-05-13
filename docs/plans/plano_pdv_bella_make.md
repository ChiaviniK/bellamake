# Plano de Valor de Desenvolvimento (PVD): PDV Bella Make

Este documento detalha o planejamento técnico para a implementação do Módulo de Frente de Caixa (PDV) da Bella Make.

## 1. Visão Geral
O PDV será uma interface de alta performance focada na venda rápida de produtos de preço único (R$ 10,00), com integração fiscal total e controle de caixa.

## 2. Arquitetura Proposta
- **Frontend**: Next.js (Client-side rendering para o PDV) com LocalStorage para resiliência offline.
- **Backend**: API REST em NestJS para processamento de vendas e regras fiscais.
- **Integração Fiscal**: Módulo desacoplado para comunicação com SEFAZ via API de mensageria.

## 3. Estratégia de Desenvolvimento

### Fase 1: Core PDV
- Interface de venda (entrada de itens via código de barras ou busca).
- Carrinho de compras com aplicação de descontos ou cancelamento de itens.
- Finalização de venda com múltiplas formas de pagamento.

### Fase 2: Gestão de Caixa
- Abertura de turno com valor inicial (fundo de reserva).
- Sangrias e suprimentos.
- Fechamento de caixa com conferência cega.

### Fase 3: Integração Fiscal (NFC-e)
- Geração do JSON/XML da nota.
- Assinatura digital (Certificado A1).
- Transmissão e impressão do DANFE resumido em impressora térmica.

## 4. Estrutura de Dados (Extensão)
- `CashierSession`: id, userId, openedAt, closedAt, initialAmount, finalAmount, status.
- `Transaction`: id, sessionId, type (SALE, REFUND, CASH_IN, CASH_OUT), amount, paymentMethod.

## 5. Cronograma Estimado
- **Semana 1**: Setup e Core PDV.
- **Semana 2**: Gestão de Caixa e Fluxo Financeiro.
- **Semana 3**: Integração NFC-e e Homologação.
