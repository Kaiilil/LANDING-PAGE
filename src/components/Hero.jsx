import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Activity, Shield, Cpu } from 'lucide-react';
import { useScroll, useTransform, motion } from 'motion/react';
import { SkeletonCircle, SkeletonStyles } from './ui/Skeleton';
import { ScrollAnimated, fadeInUp, scaleIn } from '../hooks/useScrollAnimation.jsx';

const stats = [
  { value: '7', unit: 'ngày', label: 'Pin liên tục', icon: Activity },
  { value: 'IP68', unit: '', label: 'Chống nước', icon: Shield },
  { value: 'AI', unit: 'Core', label: 'Xử lý tích hợp', icon: Cpu },
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [ringLoaded, setRingLoaded] = useState(false);
  const ringRef = useRef(null);

  const { scrollY } = useScroll();
  const yContent = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityContent = useTransform(scrollY, [0, 300], [1, 0]);
  const yRing = useTransform(scrollY, [0, 500], [0, 50]);
  const scaleRing = useTransform(scrollY, [0, 500], [1, 0.9]);
  const yBg = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    const ringTimer = setTimeout(() => setRingLoaded(true), 300);
    return () => {
      clearTimeout(timer);
      clearTimeout(ringTimer);
    };
  }, []);

  // Parallax mouse effect on ring
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ringRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 12;
      const y = (clientY / innerHeight - 0.5) * 8;
      ringRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <SkeletonStyles />
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingTop: '80px',
          paddingBottom: '40px',
        }}
      >
      {/* Background gradients */}
      <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', y: yBg }}>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-3xl" />
        <div
          style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      {/* Floating particles (added parallax) */}
      {[
        { w: 6, h: 6, bg: 'rgba(124,58,237,0.7)', top: '15%', left: '8%', delay: '0s', yOffset: useTransform(scrollY, [0, 500], [0, -50]) },
        { w: 4, h: 4, bg: 'rgba(6,182,212,0.7)', top: '25%', right: '12%', delay: '1s', yOffset: useTransform(scrollY, [0, 500], [0, -80]) },
        { w: 8, h: 8, bg: 'rgba(79,70,229,0.5)', top: '65%', left: '5%', delay: '2s', yOffset: useTransform(scrollY, [0, 500], [0, -110]) },
        { w: 5, h: 5, bg: 'rgba(236,72,153,0.6)', top: '75%', right: '8%', delay: '0.5s', yOffset: useTransform(scrollY, [0, 500], [0, -140]) },
        { w: 3, h: 3, bg: 'rgba(52,211,153,0.7)', top: '40%', left: '3%', delay: '1.5s', yOffset: useTransform(scrollY, [0, 500], [0, -170]) },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{ width: p.w, height: p.h, background: p.bg, top: p.top, left: p.left, right: p.right, animationDelay: p.delay, y: p.yOffset }}
        />
      ))}

      {/* Main content wrapper */}
      <div style={{ width: '100%', maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '3rem',
          }}
          className="hero-inner"
        >
          {/* Left — Text content */}
          <motion.div
            style={{
              flex: 1,
              textAlign: 'center',
              opacity: loaded ? opacityContent : 0,
              y: yContent,
              transform: loaded ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 1s ease, transform 1s ease',
              width: '100%',
              maxWidth: '600px',
            }}
          >
            <div
              className="glass"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', borderRadius: '9999px', marginBottom: '1.5rem',
                border: '1px solid rgba(124,58,237,0.3)',
              }}
            >
              <span style={{ width: 8, height: 8, background: '#34d399', borderRadius: '50%', display: 'inline-block', animation: 'pulse-glow 2s ease-in-out infinite' }} />
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 500 }}>Ra mắt Q3 - 2026</span>
            </div>

            <h1
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}
              className="text-5xl sm:text-6xl xl:text-7xl"
            >
              <ScrollAnimated variant={fadeInUp} delay={0.1}>
                <span style={{ color: 'var(--text-white)', display: 'block' }}>Tương lai</span>
              </ScrollAnimated>
              <ScrollAnimated variant={fadeInUp} delay={0.2}>
                <span className="text-gradient" style={{ display: 'block' }}>trên ngón tay</span>
              </ScrollAnimated>
              <ScrollAnimated variant={fadeInUp} delay={0.3}>
                <span style={{ color: 'var(--text-white)', display: 'block' }}>của bạn</span>
              </ScrollAnimated>
            </h1>

            <p
              style={{ color: 'var(--text-muted)', fontSize: '1.125rem', lineHeight: 1.75, marginBottom: '2.5rem', fontFamily: 'Inter, sans-serif', maxWidth: '36rem', margin: '0 auto 2.5rem' }}
            >
              AuraRing X là nhẫn thông minh mỏng nhất thế giới với cảm biến sức khỏe AI tích hợp,
              kiểm soát cử chỉ và pin 7 ngày. Đeo vào — cuộc sống thay đổi.
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
            }}>
              <motion.button
                id="hero-cta-preorder"
                onClick={() => document.querySelector('#newsletter')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-shimmer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  border: '1px solid rgba(124,58,237,0.5)', color: 'var(--text-white)', fontWeight: 600,
                  fontSize: '1rem', padding: '1rem 2rem', borderRadius: '1rem',
                  display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                  cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                  transition: 'all 0.3s',
                }}
              >
                Đặt trước miễn phí
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                id="hero-cta-features"
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                className="glass"
                whileHover={{ scale: 1.04, borderColor: 'rgba(124,58,237,0.6)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-white)', fontWeight: 500,
                  fontSize: '1rem', padding: '1rem 2rem', borderRadius: '1rem',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  cursor: 'pointer', background: 'rgba(255,255,255,0.04)', fontFamily: 'Space Grotesk, sans-serif',
                  transition: 'border-color 0.3s',
                }}
              >
                Khám phá tính năng
              </motion.button>
            </div>

            {/* Hero stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="stat-card glass"
                    style={{ padding: '0.75rem 1.25rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '0.75rem', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color: '#a78bfa' }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-white)', fontSize: '1.25rem', lineHeight: 1.2 }}>
                        {stat.value}<span style={{ color: '#a78bfa', fontSize: '0.875rem', marginLeft: 2 }}>{stat.unit}</span>
                      </div>
                      <div style={{ color: 'var(--text-dark)', fontSize: '0.75rem' }}>{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right — Ring visual */}
          <motion.div
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: loaded ? opacityContent : 0,
              y: yRing,
              scale: scaleRing,
              transform: loaded ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 1s ease 0.3s, transform 1s ease 0.3s',
              width: '100%',
            }}
          >
            {!ringLoaded ? (
              <SkeletonCircle size={340} style={{ borderRadius: '50%' }} />
            ) : (
              <div
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 340, height: 340, flexShrink: 0 }}
              >
              {/* Outer orbital rings */}
              <div className="animate-spin-slow" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.2)' }} />
              <div className="animate-spin-slow" style={{ position: 'absolute', inset: 24, borderRadius: '50%', border: '1px solid rgba(79,70,229,0.15)', animationDirection: 'reverse', animationDuration: '15s' }} />
              <div className="animate-spin-slow" style={{ position: 'absolute', inset: 48, borderRadius: '50%', border: '1px solid rgba(6,182,212,0.1)', animationDuration: '25s' }} />

              {/* Orbiting dots */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 12, height: 12, background: 'rgba(124,58,237,0.9)', borderRadius: '50%', boxShadow: '0 0 15px rgba(124,58,237,0.8)', animation: 'orbit 8s linear infinite', position: 'absolute' }} />
                <div style={{ width: 8, height: 8, background: 'rgba(6,182,212,0.9)', borderRadius: '50%', boxShadow: '0 0 10px rgba(6,182,212,0.8)', animation: 'orbit2 12s linear infinite', position: 'absolute' }} />
                <div style={{ width: 10, height: 10, background: 'rgba(236,72,153,0.9)', borderRadius: '50%', boxShadow: '0 0 12px rgba(236,72,153,0.8)', animation: 'orbit3 16s linear infinite', position: 'absolute' }} />
              </div>

              {/* Main Ring 3D */}
              <div
                ref={ringRef}
                className="animate-float"
                style={{ perspective: '800px', transformStyle: 'preserve-3d', transition: 'transform 0.1s ease-out' }}
              >
                <div className="ring-3d">
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)', zIndex: 1 }} />
                  <div style={{ position: 'absolute', inset: '30%', top: '35%', left: '35%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.8) 0%, rgba(79,70,229,0.4) 50%, transparent 100%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', zIndex: 3 }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--text-white)', fontSize: 22 }}>72</div>
                      <div style={{ color: 'rgba(167,139,250,0.9)', fontSize: 10, letterSpacing: 1 }}>BPM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating data badges */}
              <div
                className="glass animate-fade-up"
                style={{ position: 'absolute', top: -8, right: -8, padding: '0.5rem 0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(52,211,153,0.3)', animationDelay: '0.5s', animationFillMode: 'both', whiteSpace: 'nowrap' }}
              >
                <div style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>SpO₂ 98%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Oxy máu</div>
              </div>
              <div
                className="glass animate-fade-up"
                style={{ position: 'absolute', bottom: -8, left: -8, padding: '0.5rem 0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(6,182,212,0.3)', animationDelay: '0.8s', animationFillMode: 'both', whiteSpace: 'nowrap' }}
              >
                <div style={{ color: '#22d3ee', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>HRV 68ms</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Hồi phục TT</div>
              </div>
              <div
                className="glass animate-fade-up"
                style={{ position: 'absolute', top: '50%', right: -48, padding: '0.5rem 0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(167,139,250,0.3)', animationDelay: '1.1s', animationFillMode: 'both', transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}
              >
                <div style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>7.2h</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Giấc ngủ</div>
              </div>
            </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'bounce 2s infinite' }}>
        <span style={{ color: '#475569', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Khám phá</span>
        <ChevronDown size={20} style={{ color: '#475569' }} />
      </div>

      {/* Responsive CSS for hero layout */}
      <style>{`
        @media (min-width: 1024px) {
          .hero-inner {
            flex-direction: row !important;
            align-items: center !important;
            text-align: left;
          }
          .hero-inner > div:first-child {
            text-align: left !important;
            max-width: none !important;
          }
          .hero-inner > div:first-child p {
            margin-left: 0 !important;
          }
          .hero-inner > div:first-child .flex-wrap {
            justify-content: flex-start !important;
          }
        }
        @media (max-width: 640px) {
          .ring-3d {
            width: 220px !important;
            height: 220px !important;
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
      `}</style>
    </section>
    </>
  );
}
