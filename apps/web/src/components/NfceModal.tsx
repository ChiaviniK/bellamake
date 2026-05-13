'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Receipt,
  Hash,
  QrCode as QrCodeIcon,
  ExternalLink,
  X,
  AlertTriangle,
  Download,
  Copy,
} from 'lucide-react';
import QRCode from 'qrcode';

interface NfceData {
  status: 'AUTORIZADO' | 'SIMULADO' | 'REJEITADO';
  chave: string;
  numero: number;
  serie: number;
  qrCode: string;
  danfceUrl: string;
  emitidoEm: string;
  mensagem?: string;
}

interface NfceModalProps {
  data: NfceData | null;
  total: number;
  onClose: () => void;
}

function ChaveFormatada({ chave }: { chave: string }) {
  const grupos = chave.match(/.{1,4}/g) || [];
  const [copied, setCopied] = React.useState(false);

  const copiar = () => {
    navigator.clipboard.writeText(chave);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <code
        style={{
          flex: 1,
          fontSize: '0.7rem',
          color: '#9ca3af',
          letterSpacing: '0.05em',
          lineHeight: 1.8,
          wordBreak: 'break-all',
        }}
      >
        {grupos.join(' ')}
      </code>
      <button
        onClick={copiar}
        title="Copiar chave"
        style={{
          flexShrink: 0,
          padding: '6px',
          background: copied ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          color: copied ? 'var(--primary)' : '#6b7280',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

function QrCodeCanvas({ url }: { url: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 160,
        margin: 2,
        color: { dark: '#ffffff', light: '#00000000' },
      });
    }
  }, [url]);

  return <canvas ref={canvasRef} style={{ borderRadius: '8px' }} />;
}

export function NfceModal({ data, total, onClose }: NfceModalProps) {
  if (!data) return null;

  const isSimulado = data.status === 'SIMULADO';
  const statusColor = isSimulado ? 'var(--accent)' : 'var(--primary)';
  const statusRgb = isSimulado ? 'var(--accent-rgb)' : 'var(--primary-rgb)';
  const statusLabel = isSimulado ? 'SIMULADO' : 'AUTORIZADO';

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(14,14,14,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              overflow: 'hidden',
              boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background: `rgba(var(--${isSimulado ? 'accent' : 'primary'}-rgb), 0.1)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: statusColor,
                    boxShadow: `0 0 20px rgba(var(--${isSimulado ? 'accent' : 'primary'}-rgb), 0.2)`,
                  }}
                >
                  {isSimulado ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.2 }}>
                    NFC-e {statusLabel}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>
                    {isSimulado
                      ? 'Nota não transmitida à SEFAZ (modo simulação)'
                      : 'Documento eletrônico autorizado pela SEFAZ'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  color: '#6b7280',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Total + Número */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '16px',
                  }}
                >
                  <p style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 4 }}>Valor Total</p>
                  <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                    R$ {total.toFixed(2)}
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '16px',
                    minWidth: 100,
                  }}
                >
                  <p style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 4 }}>Nº / Série</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    {String(data.numero).padStart(6, '0')} / {data.serie}
                  </p>
                </div>
              </div>

              {/* QR Code + Chave */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    flexShrink: 0,
                    background: '#000',
                    borderRadius: 12,
                    padding: 12,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <QrCodeCanvas url={data.qrCode} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: '0.72rem', color: '#6b7280' }}>Chave de Acesso</p>
                  <ChaveFormatada chave={data.chave} />
                  <p style={{ fontSize: '0.68rem', color: '#4b5563' }}>
                    Emitida em {new Date(data.emitidoEm).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Aviso simulação */}
              {isSimulado && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 10,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}
                >
                  <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: '0.8rem', color: '#fbbf24', lineHeight: 1.5 }}>
                    <strong>Modo Simulação Ativo.</strong> A nota foi gerada localmente e não foi enviada à SEFAZ. Configure o token do Focus NFe nas configurações para ativar a emissão real.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href={data.danfceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Download size={18} />
                  DANFC-e (PDF)
                </a>
                <a
                  href={data.qrCode}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#9ca3af',
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <ExternalLink size={16} />
                  Consultar
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
