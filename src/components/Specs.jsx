import { useState, useRef, useEffect } from 'react';
import { Cpu, Battery, Droplets, Weight, Ruler, Thermometer, Clock, Zap } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, useMotionValueEvent } from 'motion/react';
import { StaggerChildren, fadeInUp } from '../hooks/useScrollAnimation.jsx';

const tabs = ['Kích thước & Vật liệu', 'Cảm biến', 'Kết nối', 'Hiệu năng'];

const specData = {
  'Kích thước & Vật liệu': [
    { icon: Ruler, label: 'Đường kính trong', value: '17–22 mm', color: '#a78bfa' },
    { icon: Weight, label: 'Trọng lượng', value: '2.3 g', color: '#22d3ee' },
    { icon: Ruler, label: 'Độ dày vành', value: '2.5 mm', color: '#818cf8' },
    { icon: Droplets, label: 'Chống nước', value: 'IP68 (100m/2h)', color: '#34d399' },
    { icon: Thermometer, label: 'Chất liệu', value: 'Titanium Grade 5', color: '#f472b6' },
    { icon: Thermometer, label: 'Lớp phủ', value: 'DLC Carbon Coating', color: '#fbbf24' },
  ],
  'Cảm biến': [
    { icon: Cpu, label: 'PPG Quang học', value: '4 LED + 4 PD', color: '#fb7185' },
    { icon: Cpu, label: 'Gia tốc & Con quay', value: '6-axis IMU', color: '#a78bfa' },
    { icon: Thermometer, label: 'Nhiệt độ', value: 'ΔT ±0.05°C', color: '#22d3ee' },
    { icon: Cpu, label: 'Đo điện trở da', value: 'EDA Sensor', color: '#34d399' },
    { icon: Cpu, label: 'NFC', value: 'ISO 14443 Type A/B', color: '#818cf8' },
    { icon: Cpu, label: 'Từ trường', value: '3-axis Magnetometer', color: '#f472b6' },
  ],
  'Kết nối': [
    { icon: Zap, label: 'Bluetooth', value: 'BLE 5.4', color: '#60a5fa' },
    { icon: Cpu, label: 'ANT+', value: 'v2.1 Ultra Low Power', color: '#a78bfa' },
    { icon: Cpu, label: 'NFC', value: 'Thanh toán / Unlock', color: '#22d3ee' },
    { icon: Clock, label: 'Phạm vi BLE', value: 'Lên đến 30m', color: '#34d399' },
    { icon: Cpu, label: 'API dữ liệu', value: 'REST & WebSocket', color: '#fbbf24' },
    { icon: Cpu, label: 'SDK', value: 'iOS, Android, Web', color: '#f472b6' },
  ],
  'Hiệu năng': [
    { icon: Cpu, label: 'Chip xử lý', value: 'AuraSoC X1 (7nm)', color: '#a78bfa' },
    { icon: Battery, label: 'Dung lượng pin', value: '21 mAh Graphene Li', color: '#34d399' },
    { icon: Clock, label: 'Pin liên tục', value: '7 ngày (typical)', color: '#22d3ee' },
    { icon: Clock, label: 'Thời gian sạc', value: '45 phút (0–100%)', color: '#fbbf24' },
    { icon: Cpu, label: 'RAM', value: '512 KB SRAM', color: '#818cf8' },
    { icon: Cpu, label: 'Bộ nhớ', value: '64 MB Flash Storage', color: '#f472b6' },
  ],
};

const sizeGuide = [
  { size: 6, mm: 16.9, label: 'XS' },
  { size: 7, mm: 17.5, label: 'S' },
  { size: 8, mm: 18.2, label: 'S/M' },
  { size: 9, mm: 18.9, label: 'M' },
  { size: 10, mm: 19.8, label: 'M/L' },
  { size: 11, mm: 20.6, label: 'L' },
  { size: 12, mm: 21.4, label: 'XL' },
  { size: 13, mm: 22.2, label: 'XXL' },
];

// Counter animation hook
function useCounter(value) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (value - start) * easeOut;
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  return { ref, displayValue };
}

const performanceMetrics = [
  { label: 'Độ chính xác nhịp tim', value: 99.2, unit: '%', from: '#ec4899', to: '#f43f5e' },
  { label: 'Độ chính xác SpO₂', value: 98.7, unit: '%', from: '#06b6d4', to: '#6366f1' },
  { label: 'Phát hiện ngủ', value: 96.5, unit: '%', from: '#7c3aed', to: '#9333ea' },
  { label: 'Phát hiện cử chỉ', value: 94.1, unit: '%', from: '#f59e0b', to: '#f97316' },
];

export default function Specs() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [metricsVisible, setMetricsVisible] = useState(false);

  const { scrollY } = useScroll();
  const yBg1 = useTransform(scrollY, [500, 1500], [0, -150]);
  const yBg2 = useTransform(scrollY, [500, 1500], [0, 150]);

  const currentSpecs = specData[activeTab];

  return (
    <section id="specs" style={{ padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div style={{ position: 'absolute', top: 0, right: 0, width: 500, height: 500, background: 'rgba(79,70,229,0.08)', borderRadius: '50%', filter: 'blur(80px)', y: yBg1 }} />
        <motion.div style={{ position: 'absolute', bottom: 0, left: 0, width: 400, height: 400, background: 'rgba(6,182,212,0.08)', borderRadius: '50%', filter: 'blur(80px)', y: yBg2 }} />
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            className="glass"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', marginBottom: '1.25rem', border: '1px solid rgba(6,182,212,0.3)' }}
          >
            <Cpu size={14} style={{ color: '#22d3ee' }} />
            <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Thông số kỹ thuật</span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-white)', marginBottom: '1.25rem' }}>
            Kỹ thuật <span className="text-gradient">đỉnh cao</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.75 }}>
            Từng chi tiết được tinh chỉnh để mang lại hiệu suất tốt nhất trong một chiếc nhẫn mỏng nhất thế giới.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', marginBottom: '2.5rem', paddingBottom: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              id={`spec-tab-${tab.replace(/\s/g, '-').toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={activeTab === tab ? 'tab-active' : 'glass'}
              style={{
                whiteSpace: 'nowrap', padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
                fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: activeTab === tab ? 'white' : '#94a3b8',
                fontFamily: 'Space Grotesk, sans-serif',
                transition: 'all 0.3s',
              }}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
          {currentSpecs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={`${activeTab}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
                className="glass"
                style={{
                  borderRadius: '1rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                  transition: 'background 0.3s',
                }}
              >
                <div
                  className="glass"
                  style={{ width: 44, height: 44, borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <Icon size={20} style={{ color: spec.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: 500 }}>{spec.label}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: spec.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spec.value}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Performance Bars */}
        <motion.div onViewportEnter={() => setMetricsVisible(true)} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.7 }} whileHover={{ scale: 1.01 }} className="glass" style={{ borderRadius: '1.5rem', padding: '2rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '1.75rem' }}>Độ chính xác cảm biến</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem 2.5rem' }}>
            {performanceMetrics.map((metric, i) => {
              const { displayValue } = useCounter(metric.value);
              return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{metric.label}</span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: 'var(--text-white)', fontSize: '0.875rem' }}>
                    {metricsVisible ? displayValue.toFixed(1) : '0'}{metric.unit}
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    className="progress-bar"
                    initial={{ width: '0%' }}
                    animate={{ width: metricsVisible ? `${metric.value}%` : '0%' }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${metric.from}, ${metric.to})`,
                    }}
                  />
                </div>
              </div>
              );
            })}
          </div>
        </motion.div>

        {/* Size Guide */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.7 }} className="glass" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '0.5rem' }}>Hướng dẫn chọn cỡ nhẫn</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Đo chu vi ngón tay và chọn cỡ phù hợp (mm = đường kính trong)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.5rem' }}>
            {sizeGuide.map((item) => (
              <motion.button
                key={item.size}
                id={`size-select-${item.size}`}
                onClick={() => setSelectedSize(item.size === selectedSize ? null : item.size)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '0.75rem 0.25rem', borderRadius: '1rem', cursor: 'pointer',
                  border: selectedSize === item.size ? '1px solid rgba(124,58,237,0.8)' : '1px solid rgba(255,255,255,0.1)',
                  background: selectedSize === item.size ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                  color: selectedSize === item.size ? 'white' : '#94a3b8',
                  transition: 'all 0.3s',
                  boxShadow: selectedSize === item.size ? '0 4px 20px rgba(124,58,237,0.2)' : 'none',
                }}
              >
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.2 }}>{item.size}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: 2 }}>{item.mm}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: 4, color: selectedSize === item.size ? '#c4b5fd' : '#64748b' }}>{item.label}</span>
              </motion.button>
            ))}
          </div>
          {selectedSize && (
            <div
              className="animate-fade-up"
              style={{ marginTop: '1.25rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ruler size={18} style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <span style={{ color: 'var(--text-white)', fontWeight: 600 }}>Cỡ {selectedSize}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: 8 }}>
                  = {sizeGuide.find(s => s.size === selectedSize)?.mm} mm — {sizeGuide.find(s => s.size === selectedSize)?.label} size
                </span>
                <p style={{ color: 'var(--text-dark)', fontSize: '0.75rem', marginTop: 4 }}>Có dịch vụ đổi cỡ miễn phí trong 30 ngày đầu.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
