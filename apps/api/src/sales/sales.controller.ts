import { Controller, Get, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() data: any) {
    return this.salesService.createSale(data);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }
}
