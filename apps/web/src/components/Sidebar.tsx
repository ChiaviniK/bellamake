'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  History,
  Settings,
  LogOut,
  Sparkles,
  Palette,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingCart,    label: 'PDV',        href: '/'          },
  { icon: Package,         label: 'Estoque',    href: '/inventory' },
  { icon: History,         label: 'Histórico',  href: '/history'   },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside
      style={{
        width: '230px',
        flexShrink: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        gap: '2rem',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0.5rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            background: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            transition: 'all 0.3s ease',
          }}
        >
          <Sparkles size={18} color="white" />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontWeight: 800,
            fontSize: '1.1rem',
            letterSpacing: '-0.02em',
          }}
        >
          Bella Make
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <p
          style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '0 0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          Navegação
        </p>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item${active ? ' active' : ''}`}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Theme Switcher */}
        <div style={{ marginTop: '1.5rem' }}>
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0 0.5rem',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Palette size={12} /> Personalização
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0 0.5rem' }}>
            <button
              onClick={() => setTheme('emerald')}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#10b981',
                border: theme === 'emerald' ? '2px solid white' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: theme === 'emerald' ? '0 0 10px rgba(16,185,129,0.5)' : 'none'
              }}
              title="Esmeralda"
            />
            <button
              onClick={() => setTheme('pink')}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#db2777',
                border: theme === 'pink' ? '2px solid white' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: theme === 'pink' ? '0 0 10px rgba(219,39,119,0.5)' : 'none'
              }}
              title="Rosa"
            />
          </div>
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Link href="/settings" className={`sidebar-item${pathname === '/settings' ? ' active' : ''}`}>
          <Settings size={19} />
          <span>Configurações</span>
        </Link>
        <button className="sidebar-item" style={{ color: '#f87171' }}>
          <LogOut size={19} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
