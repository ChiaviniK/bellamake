import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Simula a resposta de uma NFC-e autorizada pela SEFAZ via Focus NFe.
 * Quando o modoSimulacao = false, este método é substituído pela chamada real à API.
 */
function gerarChaveAcessoFake(cnpj: string, numero: number, serie: number): string {
  const uf = '35'; // SP
  const now = new Date();
  const aamm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const cnpjLimpo = cnpj.replace(/\D/g, '').padStart(14, '0');
  const mod = '65'; // NFC-e
  const serieStr = String(serie).padStart(3, '0');
  const numStr = String(numero).padStart(9, '0');
  const tpEmis = '1';
  const cNF = String(Math.floor(Math.random() * 99999999)).padStart(8, '0');
  const base = `${uf}${aamm}${cnpjLimpo}${mod}${serieStr}${numStr}${tpEmis}${cNF}`;
  // Dígito verificador simplificado (apenas para simulação)
  const dv = (base.split('').reduce((acc, d) => acc + parseInt(d), 0) % 9).toString();
  return base + dv;
}

export interface NfceResult {
  status: 'AUTORIZADO' | 'REJEITADO' | 'SIMULADO';
  chave: string;
  numero: number;
  serie: number;
  qrCode: string;
  danfceUrl: string;
  emitidoEm: Date;
  mensagem?: string;
}

@Injectable()
export class FiscalService {
  private readonly logger = new Logger(FiscalService.name);

  constructor(private prisma: PrismaService) {}

  async emitirNfce(saleId: string): Promise<NfceResult> {
    // 1. Buscar configuração da loja
    let config = await this.prisma.storeConfig.findUnique({ where: { id: 'default' } });

    if (!config) {
      // Criar configuração padrão (modo simulação)
      config = await this.prisma.storeConfig.create({
        data: { id: 'default' },
      });
    }

    // 2. Buscar dados da venda
    const sale = await this.prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!sale) throw new Error('Venda não encontrada');
    if (sale.nfceStatus === 'AUTORIZADO') {
      // Já foi emitida — retornar dados existentes
      return {
        status: 'AUTORIZADO',
        chave: sale.nfceChave!,
        numero: sale.nfceNumero!,
        serie: sale.nfceSerie!,
        qrCode: sale.nfceQrCode!,
        danfceUrl: sale.nfceDanfceUrl!,
        emitidoEm: sale.nfceEmitidoEm!,
      };
    }

    // 3. Incrementar número sequencial
    const novoNumero = config.nfceUltNumero + 1;
    await this.prisma.storeConfig.update({
      where: { id: 'default' },
      data: { nfceUltNumero: novoNumero },
    });

    // 4. Modo simulado ou real
    let resultado: NfceResult;

    if (config.modoSimulacao) {
      resultado = this.simularEmissao(config, sale, novoNumero);
    } else {
      resultado = await this.emitirViaFocusNfe(config, sale, novoNumero);
    }

    // 5. Persistir resultado na venda
    await this.prisma.sale.update({
      where: { id: saleId },
      data: {
        nfceRef: `BELLMK-${saleId.slice(0, 8).toUpperCase()}`,
        nfceStatus: resultado.status,
        nfceChave: resultado.chave,
        nfceNumero: resultado.numero,
        nfceSerie: resultado.serie,
        nfceQrCode: resultado.qrCode,
        nfceDanfceUrl: resultado.danfceUrl,
        nfceEmitidoEm: resultado.emitidoEm,
      },
    });

    this.logger.log(
      `NFC-e ${resultado.status} | Venda ${saleId} | Chave: ${resultado.chave}`,
    );

    return resultado;
  }

  private simularEmissao(config: any, sale: any, numero: number): NfceResult {
    const chave = gerarChaveAcessoFake(config.cnpj, numero, config.nfceSerie);
    const emitidoEm = new Date();

    // QR Code real da SEFAZ aponta para consulta pública. No modo simulado, usamos URL de exemplo.
    const qrCode = `https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx?p=${chave}|2|1|1|${chave.slice(-8)}`;
    const danfceUrl = `https://focusnfe.com.br/danfce/${chave}.pdf`; // simulado

    return {
      status: 'SIMULADO',
      chave,
      numero,
      serie: config.nfceSerie,
      qrCode,
      danfceUrl,
      emitidoEm,
      mensagem: '⚠️ Modo Simulação — Nota não transmitida à SEFAZ',
    };
  }

  /**
   * Integração real com Focus NFe.
   * Descomentar e configurar quando tiver token e certificado digital.
   */
  private async emitirViaFocusNfe(config: any, sale: any, numero: number): Promise<NfceResult> {
    // Monta o payload no formato Focus NFe
    const ref = `BELLMK-${sale.id.slice(0, 8).toUpperCase()}`;
    const payload = this.montarPayloadNfce(config, sale, numero, ref);

    const url = config.focusNfeAmbiente === 'producao'
      ? `https://api.focusnfe.com.br/v2/nfce?ref=${ref}`
      : `https://homologacao.focusnfe.com.br/v2/nfce?ref=${ref}`;

    const axios = (await import('axios')).default;
    const response = await axios.post(url, payload, {
      auth: { username: config.focusNfeToken, password: '' },
    });

    const data = response.data;
    return {
      status: data.status_sefaz === '100' ? 'AUTORIZADO' : 'REJEITADO',
      chave: data.chave_nfe,
      numero: data.numero,
      serie: data.serie,
      qrCode: data.qrcode_url,
      danfceUrl: data.danfe_url,
      emitidoEm: new Date(data.data_emissao),
      mensagem: data.mensagem_sefaz,
    };
  }

  private montarPayloadNfce(config: any, sale: any, numero: number, ref: string) {
    const mapPayment: Record<string, string> = {
      DINHEIRO: '01',
      CARTAO_CREDITO: '03',
      CARTAO_DEBITO: '04',
      PIX: '17',
    };

    return {
      // Emitente
      cnpj_emitente: config.cnpj,
      nome_emitente: config.razaoSocial,
      nome_fantasia_emitente: config.nomeFantasia,
      inscricao_estadual_emitente: config.ie,
      regime_tributario_emitente: config.crt.toString(),
      logradouro_emitente: config.logradouro,
      numero_emitente: config.numero,
      bairro_emitente: config.bairro,
      municipio_emitente: config.municipio,
      uf_emitente: config.uf,
      cep_emitente: config.cep,
      telefone_emitente: config.telefone,

      // Nota
      numero: numero.toString(),
      serie: config.nfceSerie.toString(),
      natureza_operacao: 'VENDA AO CONSUMIDOR',
      forma_pagamento: '0',
      finalidade_emissao: '1',
      consumidor_final: '1',
      presenca_comprador: '1',
      data_emissao: new Date().toISOString(),
      local_destino: '1',
      indicador_inscricao_estadual_destinatario: '9',
      cpf_destinatario: sale.cpfConsumidor || '',

      // Itens
      items: sale.items.map((item: any, idx: number) => ({
        numero_item: idx + 1,
        codigo_produto: item.product.sku,
        descricao: item.product.name,
        codigo_ncm: (item.product.ncm || '3304.99.90').replace('.', '').replace('.', ''),
        cfop: item.product.cfop || '5102',
        unidade_comercial: item.product.unidade || 'UN',
        quantidade_comercial: item.quantity.toString(),
        valor_unitario_comercial: item.price.toFixed(2),
        valor_bruto: (item.price * item.quantity).toFixed(2),
        unidade_tributavel: item.product.unidade || 'UN',
        quantidade_tributavel: item.quantity.toString(),
        valor_unitario_tributavel: item.price.toFixed(2),
        codigo_situacao_tributaria: item.product.cst || '400',
        origem_mercadoria: '0',
        valor_item: (item.price * item.quantity).toFixed(2),
        inclui_no_total: '1',
        pis_situacao_tributaria: '07',
        cofins_situacao_tributaria: '07',
      })),

      // Totais
      valor_produtos: sale.total.toFixed(2),
      valor_total: sale.total.toFixed(2),
      valor_pis: '0.00',
      valor_cofins: '0.00',
      valor_icms: '0.00',
      valor_icms_desonerado: '0.00',

      // Pagamento
      formas_pagamento: [
        {
          forma_pagamento: mapPayment[sale.paymentMethod] || '99',
          valor_pagamento: sale.total.toFixed(2),
        },
      ],
    };
  }

  async consultarNfce(saleId: string) {
    const sale = await this.prisma.sale.findUnique({ where: { id: saleId } });
    if (!sale) throw new Error('Venda não encontrada');
    return {
      saleId,
      nfceStatus: sale.nfceStatus,
      nfceChave: sale.nfceChave,
      nfceNumero: sale.nfceNumero,
      nfceSerie: sale.nfceSerie,
      nfceQrCode: sale.nfceQrCode,
      nfceDanfceUrl: sale.nfceDanfceUrl,
      emitidoEm: sale.nfceEmitidoEm,
    };
  }

  async cancelarNfce(saleId: string, justificativa: string) {
    const sale = await this.prisma.sale.findUnique({ where: { id: saleId } });
    if (!sale || sale.nfceStatus !== 'AUTORIZADO') {
      throw new Error('NFC-e não autorizada ou não encontrada');
    }

    // Em modo simulado, apenas muda o status
    const config = await this.prisma.storeConfig.findUnique({ where: { id: 'default' } });
    if (config?.modoSimulacao) {
      await this.prisma.sale.update({
        where: { id: saleId },
        data: { nfceStatus: 'CANCELADO', status: 'CANCELLED' },
      });
      return { status: 'CANCELADO', mensagem: 'Cancelamento simulado com sucesso' };
    }

    // TODO: Chamar Focus NFe real para cancelamento
    return { status: 'CANCELADO', mensagem: 'Cancelamento enviado à SEFAZ' };
  }
}
