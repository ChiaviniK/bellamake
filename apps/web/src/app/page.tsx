'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Barcode,
  ShoppingCart,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Search,
  AlertCircle,
  Zap,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { NfceModal } from '@/components/NfceModal';

const API_URL = 'http://localhost:3001';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PAYMENT_METHODS = [
  { id: 'PIX', label: 'PIX', icon: QrCode, color: 'var(--primary)' },
  { id: 'DINHEIRO', label: 'Dinheiro', icon: Banknote, color: '#f59e0b' },
  { id: 'CARTAO_CREDITO', label: 'Crédito', icon: CreditCard, color: '#3b82f6' },
  { id: 'CARTAO_DEBITO', label: 'Débito', icon: CreditCard, color: '#8b5cf6' },
];

export default function PDVPage() {
  const [skuInput, setSkuInput] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [nfceData, setNfceData] = useState<any>(null);
  const [lastTotal, setLastTotal] = useState(0);
  const skuRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (skuRef.current && !showProductSearch) skuRef.current.focus();
  }, [cart, session, showProductSearch]);

  useEffect(() => {
    const init = async () => {
      try {
        const [sessionRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/cashier/active?userId=admin`).catch(() => ({ data: null })),
          axios.get(`${API_URL}/products`),
        ]);
        if (sessionRes.data) setSession(sessionRes.data);
        setProducts(productsRes.data || []);
      } catch (err) {
        console.error('Init error:', err);
      }
    };
    init();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.includes(productSearch)
  );

  const addItemToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowProductSearch(false);
    setProductSearch('');
  };

  const addBySku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuInput) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products/${skuInput}`);
      if (res.data) {
        addItemToCart(res.data);
        setSkuInput('');
      } else {
        showFeedback('error', 'Produto não encontrado');
      }
    } catch {
      showFeedback('error', 'Produto não encontrado para o SKU informado');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const finalizeSale = async () => {
    if (!session) return showFeedback('error', 'Abra o caixa antes de vender!');
    if (cart.length === 0) return;
    setLoading(true);
    const saleTotal = total;
    try {
      // 1. Criar a venda
      const saleRes = await axios.post(`${API_URL}/sales`, {
        items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })),
        paymentMethod,
        cashierSessionId: session.id,
      });
      setCart([]);
      setLastTotal(saleTotal);

      // 2. Emitir NFC-e automaticamente
      try {
        const fiscalRes = await axios.post(`${API_URL}/fiscal/nfce/${saleRes.data.id}`);
        setNfceData(fiscalRes.data);
      } catch (fiscalErr) {
        console.error('Erro fiscal:', fiscalErr);
        showFeedback('success', `Venda R$ ${saleTotal.toFixed(2)} realizada (sem cupom fiscal)`);
      }
    } catch {
      showFeedback('error', 'Falha ao processar a venda. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const openCashier = async () => {
    try {
      const res = await axios.post(`${API_URL}/cashier/open`, {
        userId: 'admin',
        initialAmount: 0,
      });
      setSession(res.data);
      showFeedback('success', 'Caixa aberto com sucesso!');
    } catch {
      showFeedback('error', 'Erro ao abrir o caixa');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* LEFT COLUMN: Scanner + Items */}
      <div className="flex-1 flex flex-col p-8 gap-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-outfit">Ponto de Venda</h1>
            <p className="text-text-muted text-sm">
              {session ? (
                <span className="text-primary">● Caixa Aberto</span>
              ) : (
                <span className="text-red-400">● Caixa Fechado</span>
              )}
              {' '} — Operador: Daniel
            </p>
          </div>
          {!session && (
            <button onClick={openCashier} className="btn-glow flex items-center gap-2 py-2 px-5 text-sm">
              <Zap size={16} />
              Abrir Caixa
            </button>
          )}
        </div>

        {/* Scanner Input */}
        <form onSubmit={addBySku} className="relative">
          <Barcode
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            size={22}
          />
          <input
            ref={skuRef}
            type="text"
            value={skuInput}
            onChange={(e) => setSkuInput(e.target.value)}
            placeholder="Escaneie o código de barras ou digite o SKU..."
            className="glass-input w-full pl-12 pr-36 py-4 text-lg"
            disabled={!session || loading}
          />
          <button
            type="button"
            onClick={() => setShowProductSearch(true)}
            className="absolute right-24 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-white transition-colors"
            title="Buscar produto"
          >
            <Search size={20} />
          </button>
          <button
            type="submit"
            disabled={!session || loading}
            className="absolute right-2 top-2 bottom-2 px-5 bg-primary hover:bg-primary-light disabled:opacity-40 text-white font-bold rounded-xl transition-all"
          >
            ADD
          </button>
        </form>

        {/* Cart Items */}
        <div className="flex-1 premium-card overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <ShoppingCart size={18} className="text-primary" />
              Carrinho
              {totalItems > 0 && (
                <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </h2>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X size={14} /> Limpar
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <AnimatePresence initial={false}>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-16">
                  <Barcode size={72} strokeWidth={1} />
                  <p className="mt-4 text-lg">Aguardando produtos...</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {item.category?.[0] || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-text-muted font-mono">{item.sku}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center hover:text-red-400 transition-colors rounded"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center hover:text-primary transition-colors rounded"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right flex-shrink-0 w-20">
                      <p className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-text-muted">R$ {item.price.toFixed(2)} un</p>
                    </div>
                    <button
                      onClick={() => updateQuantity(item.id, -item.quantity)}
                      className="text-text-muted hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Payment Summary */}
      <div className="w-80 border-l border-white/5 flex flex-col p-6 gap-6 bg-black/30">
        <h2 className="text-xl font-bold font-outfit">Resumo</h2>

        {/* Totals */}
        <div className="premium-card p-5 flex flex-col gap-3">
          <div className="flex justify-between text-text-muted text-sm">
            <span>{totalItems} item(s)</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-text-muted text-sm">
            <span>Desconto</span>
            <span className="text-green-500">- R$ 0,00</span>
          </div>
          <div className="border-t border-white/5 pt-3 flex justify-between items-end">
            <span className="font-bold text-lg">Total</span>
            <span className="text-3xl font-black text-primary">
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm text-text-muted uppercase tracking-widest">
            Forma de Pagamento
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-sm ${
                  paymentMethod === m.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-white/5 bg-white/[0.02] text-text-muted hover:bg-white/5'
                }`}
              >
                <m.icon size={22} />
                <span className="font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Alert */}
        {!session && (
          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>Abra o caixa para habilitar as vendas.</span>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={finalizeSale}
            disabled={cart.length === 0 || loading || !session}
            className="w-full btn-glow py-5 text-lg tracking-wider shadow-2xl shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? 'PROCESSANDO...' : 'FINALIZAR VENDA'}
          </motion.button>
        </div>
      </div>

      {/* Product Search Modal */}
      <AnimatePresence>
        {showProductSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowProductSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="premium-card w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold mb-4">Buscar Produto</h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Nome ou SKU..."
                    className="glass-input w-full pl-12"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addItemToCart(p)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                      {p.category?.[0] || 'P'}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{p.name}</p>
                      <p className="text-xs text-text-muted">{p.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">R$ {p.price.toFixed(2)}</p>
                      <p className="text-xs text-text-muted">{p.stock} un</p>
                    </div>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <p className="text-center text-text-muted py-8">Nenhum produto encontrado.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NFC-e Modal */}
      <NfceModal
        data={nfceData}
        total={lastTotal}
        onClose={() => setNfceData(null)}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 font-bold text-white ${
              message.type === 'success'
                ? 'bg-primary'
                : 'bg-red-400'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
