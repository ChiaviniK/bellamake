import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async createSale(data: {
    items: { productId: string; quantity: number }[];
    paymentMethod: string;
    cashierSessionId: string;
  }) {
    // 1. Validar sessão de caixa aberta
    const session = await this.prisma.cashierSession.findUnique({
      where: { id: data.cashierSessionId },
    });

    if (!session || session.status !== 'OPEN') {
      throw new BadRequestException('Sessão de caixa não encontrada ou fechada.');
    }

    // 2. Calcular total e preparar itens
    let total = 0;
    const itemsToCreate: { productId: string; quantity: number; price: number }[] = [];

    for (const item of data.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Produto ${item.productId} não encontrado.`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para o produto ${product.name}.`);
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      itemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 3. Executar transação: Criar Venda e Atualizar Estoque
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          total,
          paymentMethod: data.paymentMethod,
          cashierSessionId: data.cashierSessionId,
          items: {
            create: itemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      // Atualizar estoque
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return sale;
    });
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
