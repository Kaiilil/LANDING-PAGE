import { useState, useRef } from 'react';
import {
  Heart, Moon, Activity, Cpu, Zap, Shield, Fingerprint, Smartphone, Bluetooth, Wifi
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { StaggerChildren, fadeInUp, scaleIn } from '../hooks/useScrollAnimation.jsx';

const features = [
  {
    icon: Heart,
    colorFrom: '#ec4899', colorTo: '#f43f5e',
    glow: 'rgba(236,72,153,0.3)',
    title: 'Theo dõi sức khỏe 24/7',
    description: 'Cảm biến quang học thế hệ mới đo nhịp tim, oxy máu SpO₂, HRV và huyết áp liên tục không gián đoạn.',
    tags: ['Nhịp tim', 'SpO₂', 'HRV', 'Huyết áp'],
  },
  {
    icon: Moon,
    colorFrom: '#6366f1', colorTo: '#7c3aed',
    glow: 'rgba(99,102,241,0.3)',
    title: 'Phân tích giấc ngủ AI',
    description: 'Mô hình AI phân tích chu kỳ giấc ngủ REM, NREM và đề xuất thời điểm thức dậy tối ưu cho cơ thể bạn.',
    tags: ['REM/NREM', 'Score ngủ', 'Gợi ý AI'],
  },
  {
    icon: Fingerprint,
    colorFrom: '#06b6d4', colorTo: '#14b8a6',
    glow: 'rgba(6,182,212,0.3)',
    title: 'Kiểm soát cử chỉ thông minh',
    description: 'Vuốt, gõ ngón tay và nhúng nhẹ để điều khiển điện thoại, nhà thông minh và thiết bị IoT xung quanh.',
    tags: ['Gesture', 'Smart Home', 'IoT Control'],
  },
  {
    icon: Cpu,
    colorFrom: '#7c3aed', colorTo: '#9333ea',
    glow: 'rgba(139,92,246,0.3)',
    title: 'Chip AI Edge Computing',
    description: 'Chip AuraSoC X1 xử lý AI ngay trên nhẫn, không cần điện thoại, bảo vệ dữ liệu tuyệt đối.',
    tags: ['AuraSoC X1', 'On-device AI', 'Private'],
  },
  {
    icon: Zap,
    colorFrom: '#f59e0b', colorTo: '#f97316',
    glow: 'rgba(245,158,11,0.3)',
    title: 'Pin siêu bền 7 ngày',
    description: 'Công nghệ pin graphene thế hệ mới, sạc đầy chỉ 45 phút qua đế sạc không dây thông minh.',
    tags: ['7 ngày', '45 phút sạc', 'Wireless'],
  },
  {
    icon: Shield,
    colorFrom: '#10b981', colorTo: '#22c55e',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Bảo mật sinh trắc học',
    description: 'Xác thực đa lớp: nhịp tim độc nhất + gia tốc kế, tạo token bảo mật không thể giả mạo.',
    tags: ['Biometric', 'Zero-Trust', 'E2E Encrypt'],
  },
];

function FeatureCard({ feature, index }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const Icon = feature.icon;

  // 3D tilt effect on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 10, y: -x * 10 }); // Rotate around X and Y axes
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        handleMouseLeave();
      }}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="glass flex-shrink-0"
      style={{
        borderRadius: '1.5rem',
        padding: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transformStyle: 'preserve-3d',
        rotateX: tilt.x,
        rotateY: tilt.y,
        transition: 'transform 0.3s ease-out',
      }}
    >
      {/* Glow on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 30% 30%, ${feature.glow}, transparent 70%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.5s ease',
        borderRadius: '1.5rem',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: '1rem',
        background: `linear-gradient(135deg, ${feature.colorFrom}, ${feature.colorTo})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.25rem',
        boxShadow: `0 8px 24px ${feature.glow}`,
        position: 'relative', zIndex: 1,
        transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
        transition: 'transform 0.4s ease',
        flexShrink: 0,
      }}>
        <Icon size={26} style={{ color: 'var(--text-white)' }} />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-white)',
        fontSize: '1.125rem', marginBottom: '0.75rem', position: 'relative', zIndex: 1,
      }}>{feature.title}</h3>

      {/* Description */}
      <p style={{
        color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7,
        marginBottom: '1.25rem', position: 'relative', zIndex: 1,
      }}>{feature.description}</p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
        {feature.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-light)',
            }}
          >{tag}</span>
        ))}
      </div>

      <div style={{
        position: 'absolute', top: -32, right: -32, width: 96, height: 96, borderRadius: '50%',
        background: `linear-gradient(135deg, ${feature.colorFrom}, ${feature.colorTo})`,
        opacity: hovered ? 0.2 : 0.08, filter: 'blur(20px)',
        transition: 'opacity 0.5s ease', pointerEvents: 'none',
      }} />
    </motion.div>
  );
}

export default function Features() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <section id="features" style={{ padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <motion.div style={{
        position: 'absolute', top: '20%', left: '50%',
        x: '-50%', y: yBg,
        width: 700, height: 700,
        background: 'rgba(124,58,237,0.05)', borderRadius: '50%', filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            textAlign: 'center', marginBottom: '4rem',
          }}
        >
          <div
            className="glass"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '9999px', marginBottom: '1.25rem',
              border: '1px solid rgba(124,58,237,0.3)',
            }}
          >
            <Activity size={14} style={{ color: '#a78bfa' }} />
            <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Tính năng nổi bật</span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-white)', marginBottom: '1.25rem' }}>
            Được thiết kế để{' '}
            <span className="text-gradient">vượt trội</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto', lineHeight: 1.75 }}>
            Mỗi tính năng được xây dựng dựa trên nghiên cứu khoa học và công nghệ tiên tiến nhất
            để mang lại trải nghiệm thực sự khác biệt.
          </p>
        </motion.div>

        {/* Feature grid */}
        <StaggerChildren delay={0.1}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
              >
                <FeatureCard feature={feature} index={i} />
              </motion.div>
            ))}
          </div>
        </StaggerChildren>

        {/* Bottom highlight bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          whileHover={{ scale: 1.01 }}
          className="glass"
          style={{
            marginTop: '4rem', borderRadius: '1.5rem', padding: '2rem',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem',
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Bluetooth, Wifi, Smartphone].map((Icon, i) => (
                <div key={i} className="glass" style={{ width: 40, height: 40, borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color: '#a78bfa' }} />
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: 'var(--text-white)' }}>Kết nối đa nền tảng</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>iOS, Android, Web Dashboard & API</div>
            </div>
          </div>
          <motion.button
            id="features-connect-cta"
            onClick={() => document.querySelector('#connect')?.scrollIntoView({ behavior: 'smooth' })}
            className="glass"
            whileHover={{ scale: 1.05, background: 'rgba(124,58,237,0.15)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd', fontWeight: 500,
              fontSize: '0.875rem', padding: '0.75rem 1.5rem', borderRadius: '1rem',
              cursor: 'pointer', background: 'rgba(124,58,237,0.08)', transition: 'all 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            Xem tích hợp dữ liệu
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
