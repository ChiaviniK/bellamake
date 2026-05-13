'use client';

import React, { useEffect, useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  ChevronDown,
  QrCode,
  Banknote,
  CreditCard,
  CheckCircle2,
  XCircle,
  Eye,
  TrendingUp,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const PAYMENT_ICONS: Record<string, any> = {
  PIX: QrCode,
  DINHEIRO: Banknote,
  CARTAO_CREDITO: CreditCard,
  CARTAO_DEBITO: CreditCard,
};

const PAYMENT_LABELS: Record<string, string> = {
  PIX: 'PIX',
  DINHEIRO: 'Dinheiro',
  CARTAO_CREDITO: 'Crédito',
  CARTAO_DEBITO: 'Débito',
};

export default function HistoryPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(`${API_URL}/sales`);
        setSales(res.data.reverse());
      } catch (err) {
        console.error('Erro ao buscar vendas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const avgTicket = sales.length ? totalRevenue / sales.length : 0;

  const filtered = sales.filter(
    (s) =>
      s.id.includes(search) ||
      (PAYMENT_LABELS[s.paymentMethod] || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold font-outfit">Histórico de Vendas</h1>
        <p className="text-text-muted">Consulte todas as transações realizadas.</p>
      </header>

      {/* Mini Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total de Vendas', value: sales.length, icon: ShoppingBag, color: 'var(--primary)' },
          { label: 'Faturamento Total', value: `R$ ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: '#3b82f6' },
          { label: 'Ticket Médio', value: `R$ ${avgTicket.toFixed(2)}`, icon: TrendingUp, color: 'var(--accent)' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="premium-card p-5 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${stat.color}18`, color: stat.color }}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Buscar por ID ou forma de pagamento..."
            className="glass-input w-full pl-12 py-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="premium-card px-4 flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm">
          <Filter size={18} />
          Filtros
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Sales Table */}
      <div className="premium-card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-text-muted">Carregando vendas...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 flex flex-col items-center gap-4 text-text-muted">
            <Receipt size={48} strokeWidth={1} />
            <p>Nenhuma venda encontrada.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 text-sm font-semibold text-text-muted">ID da Venda</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Data/Hora</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Pagamento</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Itens</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Status</th>
                <th className="p-4 text-sm font-semibold text-text-muted text-right">Total</th>
                <th className="p-4 text-sm font-semibold text-text-muted text-center">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sale, i) => {
                const PayIcon = PAYMENT_ICONS[sale.paymentMethod] || CreditCard;
                const isExpanded = expandedId === sale.id;
                const date = new Date(sale.createdAt);

                return (
                  <React.Fragment key={sale.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 font-mono text-xs text-text-muted">
                        #{sale.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="p-4 text-sm">
                        <div className="font-medium">
                          {date.toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-text-muted text-xs">
                          {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <PayIcon size={16} className="text-primary" />
                          <span>{PAYMENT_LABELS[sale.paymentMethod] || sale.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-text-muted">
                        {sale.items?.length || 0} produto(s)
                      </td>
                      <td className="p-4">
                        {sale.status === 'COMPLETED' ? (
                          <span className="flex items-center gap-1.5 text-green-500 text-xs font-semibold bg-green-500/10 px-2.5 py-1 rounded-full w-fit">
                            <CheckCircle2 size={12} />
                            Concluída
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-500/10 px-2.5 py-1 rounded-full w-fit">
                            <XCircle size={12} />
                            Cancelada
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-black text-primary text-lg">
                        R$ {sale.total.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : sale.id)}
                          className={`p-2 rounded-lg transition-all ${
                            isExpanded
                              ? 'bg-primary text-white'
                              : 'text-text-muted hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </motion.tr>

                    {/* Expanded Row */}
                    <AnimatePresence>
                      {isExpanded && sale.items && (
                        <tr>
                          <td colSpan={7} className="p-0">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-white/[0.02] border-b border-white/5 overflow-hidden"
                            >
                              <div className="px-12 py-4 flex flex-col gap-2">
                                <p className="text-xs text-text-muted font-semibold uppercase tracking-widest mb-2">
                                  Itens da Venda
                                </p>
                                {sale.items.map((item: any) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-4 text-sm"
                                  >
                                    <div className="w-6 h-6 bg-primary/10 rounded text-primary text-xs flex items-center justify-center font-bold">
                                      {item.quantity}
                                    </div>
                                    <span className="flex-1 text-text-muted">
                                      {item.product?.name || item.productId}
                                    </span>
                                    <span className="font-medium">
                                      R$ {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
