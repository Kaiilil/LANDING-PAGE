import { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const CONFIGS = {
  success: { Icon: CheckCircle, border: 'rgba(52,211,153,0.35)', iconBg: 'rgba(52,211,153,0.12)', iconColor: '#34d399', bar: '#34d399' },
  error:   { Icon: XCircle,    border: 'rgba(248,113,113,0.35)', iconBg: 'rgba(248,113,113,0.12)', iconColor: '#f87171', bar: '#f87171' },
  warning: { Icon: AlertTriangle, border: 'rgba(251,191,36,0.35)', iconBg: 'rgba(251,191,36,0.12)', iconColor: '#fbbf24', bar: '#fbbf24' },
  info:    { Icon: Info,       border: 'rgba(96,165,250,0.35)',  iconBg: 'rgba(96,165,250,0.12)',  iconColor: '#60a5fa', bar: '#60a5fa' },
};

export default function Toast({ type = 'info', title, message, duration = 5000, onClose }) {
  const cfg = CONFIGS[type] ?? CONFIGS.info;
  const { Icon } = cfg;

  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'rgba(12,8,28,0.96)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${cfg.border}`,
        borderRadius: '0.875rem', padding: '0.875rem 1rem',
        width: '320px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        marginBottom: '0.625rem',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '3px', background: cfg.bar,
        borderRadius: '0.875rem 0 0 0.875rem',
      }} />

      {/* Icon */}
      <div style={{
        width: 34, height: 34, borderRadius: '0.625rem',
        background: cfg.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginLeft: '6px',
      }}>
        <Icon size={17} color={cfg.iconColor} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
            color: '#f1f5f9', fontSize: '0.875rem', lineHeight: 1.3,
            marginBottom: message ? '0.2rem' : 0,
          }}>
            {title}
          </div>
        )}
        {message && (
          <div style={{ color: '#94a3b8', fontSize: '0.8125rem', lineHeight: 1.5 }}>
            {message}
          </div>
        )}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Đóng"
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#475569', padding: '2px', lineHeight: 1, flexShrink: 0,
          transition: 'color 0.15s', marginTop: '1px',
        }}
        onMouseOver={e => (e.currentTarget.style.color = '#e2e8f0')}
        onMouseOut={e => (e.currentTarget.style.color = '#475569')}
      >
        <X size={13} />
      </button>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '100%', height: '2px',
        background: 'rgba(255,255,255,0.06)',
      }}>
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          style={{ height: '100%', background: cfg.bar, opacity: 0.7, transformOrigin: 'left' }}
        />
      </div>
    </motion.div>
  );
}
