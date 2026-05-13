import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { SalesModule } from './sales/sales.module';
import { CashierModule } from './cashier/cashier.module';
import { FiscalModule } from './fiscal/fiscal.module';

@Module({
  imports: [PrismaModule, SalesModule, CashierModule, FiscalModule],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
