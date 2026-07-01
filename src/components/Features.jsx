import { useEffect, useRef, useState } from 'react';
import {
  Heart, Moon, Activity, Cpu, Zap, Shield, Fingerprint, Smartphone, Bluetooth, Wifi
} from 'lucide-react';

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
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const Icon = feature.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass"
      style={{
        borderRadius: '1.5rem',
        padding: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        cursor: 'default',
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
        <Icon size={26} style={{ color: 'white' }} />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'white',
        fontSize: '1.125rem', marginBottom: '0.75rem', position: 'relative', zIndex: 1,
      }}>{feature.title}</h3>

      {/* Description */}
      <p style={{
        color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7,
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
              color: '#cbd5e1',
            }}
          >{tag}</span>
        ))}
      </div>

      {/* BG deco corner */}
      <div style={{
        position: 'absolute', top: -32, right: -32, width: 96, height: 96, borderRadius: '50%',
        background: `linear-gradient(135deg, ${feature.colorFrom}, ${feature.colorTo})`,
        opacity: hovered ? 0.2 : 0.08, filter: 'blur(20px)',
        transition: 'opacity 0.5s ease', pointerEvents: 'none',
      }} />
    </div>
  );
}

export default function Features() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.3 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" style={{ padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 700,
        background: 'rgba(124,58,237,0.05)', borderRadius: '50%', filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            textAlign: 'center', marginBottom: '4rem',
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease',
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
            <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Tính năng nổi bật</span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white', marginBottom: '1.25rem' }}>
            Được thiết kế để{' '}
            <span className="text-gradient">vượt trội</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto', lineHeight: 1.75 }}>
            Mỗi tính năng được xây dựng dựa trên nghiên cứu khoa học và công nghệ tiên tiến nhất
            để mang lại trải nghiệm thực sự khác biệt.
          </p>
        </div>

        {/* Feature grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>

        {/* Bottom highlight bar */}
        <div
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
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: 'white' }}>Kết nối đa nền tảng</div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>iOS, Android, Web Dashboard & API</div>
            </div>
          </div>
          <button
            id="features-connect-cta"
            onClick={() => document.querySelector('#connect')?.scrollIntoView({ behavior: 'smooth' })}
            className="glass"
            style={{
              border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd', fontWeight: 500,
              fontSize: '0.875rem', padding: '0.75rem 1.5rem', borderRadius: '1rem',
              cursor: 'pointer', background: 'rgba(124,58,237,0.08)', transition: 'all 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            Xem tích hợp dữ liệu
          </button>
        </div>
      </div>
    </section>
  );
}
