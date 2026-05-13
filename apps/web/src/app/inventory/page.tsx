'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Package, 
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.includes(searchTerm)
  );

  return (
    <div className="p-8 flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-outfit">Estoque</h1>
          <p className="text-text-muted">Gerencie seu catálogo de produtos e níveis de estoque.</p>
        </div>
        <button className="btn-glow flex items-center gap-2">
          <Plus size={20} />
          Novo Produto
        </button>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou SKU..."
            className="glass-input w-full pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="premium-card px-4 flex items-center gap-2 text-text-muted hover:text-white">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      <div className="premium-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-4 font-semibold text-text-muted">Produto</th>
              <th className="p-4 font-semibold text-text-muted">SKU</th>
              <th className="p-4 font-semibold text-text-muted">Categoria</th>
              <th className="p-4 font-semibold text-text-muted">Preço</th>
              <th className="p-4 font-semibold text-text-muted text-center">Estoque</th>
              <th className="p-4 font-semibold text-text-muted text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, i) => (
              <motion.tr 
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center">
                      <Package size={18} className="text-primary" />
                    </div>
                    <span className="font-bold">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-text-muted font-mono text-sm">{p.sku}</td>
                <td className="p-4 text-text-muted">{p.category || 'Geral'}</td>
                <td className="p-4 font-bold">R$ {p.price.toFixed(2)}</td>
                <td className="p-4">
                  <div className={`flex items-center justify-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
                    p.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {p.stock < 10 && <AlertTriangle size={14} />}
                    {p.stock} un
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
