'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    dailyRevenue: 0,
    activeSessions: 0,
    lowStock: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [salesRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/sales`),
          axios.get(`${API_URL}/products`)
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todaysSales = salesRes.data.filter((s: any) => s.createdAt.startsWith(today));
        const revenue = todaysSales.reduce((acc: number, s: any) => acc + s.total, 0);
        const lowStockCount = productsRes.data.filter((p: any) => p.stock < 10).length;

        setStats({
          totalSales: todaysSales.length,
          dailyRevenue: revenue,
          activeSessions: 1, // Simulado
          lowStock: lowStockCount
        });
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Vendas Hoje', value: stats.totalSales, icon: ShoppingCart, trend: '+12%', color: 'var(--primary)' },
    { label: 'Faturamento', value: `R$ ${stats.dailyRevenue.toFixed(2)}`, icon: DollarSign, trend: '+8%', color: '#3b82f6' },
    { label: 'Estoque Baixo', value: stats.lowStock, icon: Package, trend: '-2', color: 'var(--accent)' },
    { label: 'Clientes', value: '42', icon: Users, trend: '+5', color: '#a855f7' },
  ];

  return (
    <div className="p-8 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold font-outfit">Dashboard</h1>
        <p className="text-text-muted">Bem-vindo de volta, Daniel. Aqui está o resumo de hoje.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6 flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-xl bg-white/5" style={{ color: card.color }}>
                <card.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${card.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {card.trend}
                {card.trend.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <div>
              <p className="text-text-muted text-sm font-medium">{card.label}</p>
              <h2 className="stat-value">{card.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 premium-card p-8 min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Desempenho Semanal</h3>
          <div className="h-full flex items-center justify-center text-text-muted">
            {/* Aqui entraria um gráfico tipo Recharts */}
            <p>Gráfico de Vendas em tempo real...</p>
          </div>
        </div>

        <div className="premium-card p-8">
          <h3 className="text-xl font-bold mb-6">Produtos Populares</h3>
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/5" />
                <div className="flex-1">
                  <p className="font-bold">Batom Matte Red</p>
                  <p className="text-sm text-text-muted">34 vendas hoje</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold">R$ 340</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
