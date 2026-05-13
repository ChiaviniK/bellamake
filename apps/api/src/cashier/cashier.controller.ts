import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { CashierService } from './cashier.service';

@Controller('cashier')
export class CashierController {
  constructor(private readonly cashierService: CashierService) {}

  @Post('open')
  open(@Body() data: { userId: string; initialAmount: number }) {
    return this.cashierService.openSession(data);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Body() data: { finalAmount: number }) {
    return this.cashierService.closeSession(id, data);
  }

  @Get('active')
  getActive(@Query('userId') userId: string) {
    return this.cashierService.getActiveSession(userId);
  }
}
