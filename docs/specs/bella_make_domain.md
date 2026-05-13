# Bella Make — domain.md

## Linguagem ubíqua
- **Produto Único**: Item vendido pelo preço padrão de R$ 10,00.
- **Sangria**: Retirada de dinheiro do caixa durante o turno.
- **Suprimento**: Adição de dinheiro ao caixa (ex: troco).
- **DANFE**: Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica.

## Entidades
### Produto
- SKU (EAN-13)
- Nome
- Preço (Default: 10.00)
- NCM (Obrigatório para fiscal)

### Venda
- Itens (Produto, Quantidade, Valor Unitário)
- Valor Total
- Forma de Pagamento (Dinheiro, PIX, Cartão)
- Status (Pendente, Concluída, Cancelada, Fiscal_Emitida)

### Sessão de Caixa (Turno)
- Operador
- Valor Inicial
- Valor Final
- Diferença (Quebra de caixa)

## Invariantes
- O preço de um "Produto Único" deve ser sempre >= R$ 10,00 (exceto descontos autorizados).
- Uma venda não pode ser concluída sem forma de pagamento válida.
- O estoque não pode ser negativo (bloqueio opcional por configuração).
