import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { FiscalService } from './fiscal.service';

@Controller('fiscal')
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Post('nfce/:saleId')
  emitir(@Param('saleId') saleId: string) {
    return this.fiscalService.emitirNfce(saleId);
  }

  @Get('nfce/:saleId')
  consultar(@Param('saleId') saleId: string) {
    return this.fiscalService.consultarNfce(saleId);
  }

  @Post('nfce/:saleId/cancel')
  cancelar(
    @Param('saleId') saleId: string,
    @Body() body: { justificativa: string },
  ) {
    return this.fiscalService.cancelarNfce(saleId, body.justificativa);
  }
}
