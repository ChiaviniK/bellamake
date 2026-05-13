import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CashierService {
  constructor(private prisma: PrismaService) {}

  async openSession(data: { userId: string; initialAmount: number }) {
    // Verificar se já existe uma sessão aberta para o usuário (opcional, regra de negócio)
    const activeSession = await this.prisma.cashierSession.findFirst({
      where: { userId: data.userId, status: 'OPEN' },
    });

    if (activeSession) {
      throw new BadRequestException('Já existe uma sessão de caixa aberta para este usuário.');
    }

    return this.prisma.cashierSession.create({
      data: {
        userId: data.userId,
        initialAmount: data.initialAmount,
        status: 'OPEN',
      },
    });
  }

  async closeSession(id: string, data: { finalAmount: number }) {
    const session = await this.prisma.cashierSession.findUnique({
      where: { id },
    });

    if (!session || session.status !== 'OPEN') {
      throw new BadRequestException('Sessão de caixa não encontrada ou já fechada.');
    }

    return this.prisma.cashierSession.update({
      where: { id },
      data: {
        finalAmount: data.finalAmount,
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });
  }

  async getActiveSession(userId: string) {
    return this.prisma.cashierSession.findFirst({
      where: { userId, status: 'OPEN' },
    });
  }
}
