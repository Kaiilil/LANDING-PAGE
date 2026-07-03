import { useState } from 'react';
import { Smartphone, Activity, Download, HeartPulse, Share2, CheckCircle2, Heart, ShieldPlus, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import Skeleton, { SkeletonText } from './ui/Skeleton';
import { StaggerChildren, fadeInUp, fadeInLeft, fadeInRight } from '../hooks/useScrollAnimation.jsx';

const apps = [
  {
    id: 'apple-health',
    name: 'Apple Health',
    icon: Heart,
    color: '#ff2d55', // Apple Health pink/red
    dataSync: ['Bản đồ Giấc ngủ', 'Nhịp tim 24/7', 'Oxy trong máu (SpO₂)', 'Năng lượng tiêu hao'],
    desc: 'Đồng bộ hai chiều với sinh thái Apple. Xem mọi chỉ số sức khỏe của AuraRing trực tiếp trên bảng điều khiển iPhone của bạn một cách liền mạch.'
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    icon: Activity,
    color: '#4285F4', // Google Blue
    dataSync: ['Điểm nhịp tim', 'Chỉ số hoạt động', 'Nhịp thở', 'Chất lượng giấc ngủ'],
    desc: 'Tích hợp mượt mà với điện thoại Android. AuraRing tự động phân tích và tích lũy điểm Hoạt động (Heart Points) cho bạn mỗi ngày.'
  },
  {
    id: 'strava',
    name: 'Strava',
    icon: HeartPulse,
    color: '#FC4C02', // Strava Orange
    dataSync: ['Nhịp tim tập luyện', 'Vùng nhịp tim (HR Zones)', 'Cường độ gắng sức', 'Phục hồi'],
    desc: 'Dành cho người yêu thể thao. Tự động đẩy biểu đồ nhịp tim vào các bài tập chạy bộ hoặc đạp xe trên Strava mà không cần mang theo điện thoại.'
  }
];

export default function DataConnect() {
  const [activeApp, setActiveApp] = useState(apps[0]);
  const [isLoading, setIsLoading] = useState(false);

  const { scrollY } = useScroll();
  const yBg1 = useTransform(scrollY, [1500, 2500], [0, -150]);
  const yBg2 = useTransform(scrollY, [1500, 2500], [0, 150]);

  const handleAppChange = (app) => {
    if (app.id === activeApp.id) return;
    setIsLoading(true);
    setActiveApp(app);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <section id="connect" style={{ padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div style={{ position: 'absolute', top: '10%', left: '10%', width: 400, height: 400, background: 'rgba(252, 76, 2, 0.05)', borderRadius: '50%', filter: 'blur(80px)', y: yBg1 }} />
        <motion.div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 500, height: 500, background: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', filter: 'blur(80px)', y: yBg2 }} />
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div
            className="glass"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', marginBottom: '1.25rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}
          >
            <Smartphone size={14} style={{ color: '#60a5fa' }} />
            <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Hệ sinh thái mở</span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-white)', marginBottom: '1.25rem' }}>
            Kết nối với <span className="text-gradient">ứng dụng yêu thích</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto', lineHeight: 1.75 }}>
            Bạn không cần thay đổi thói quen. Dữ liệu từ AuraRing X tự động chạy vào các ứng dụng sức khỏe mà bạn đang sử dụng mỗi ngày.
          </p>
        </motion.div>

        {/* Layout Split */}
        <StaggerChildren delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

          {/* Left Column: App Integrations */}
          <motion.div variants={fadeInLeft} whileHover={{ scale: 1.01 }} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="glass" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '1.5rem' }}>
              Đồng bộ ứng dụng sức khỏe
            </h3>

            {/* App Selectors */}
            <StaggerChildren delay={0.05}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {apps.map((app) => (
                  <motion.button
                    key={app.id}
                    onClick={() => handleAppChange(app)}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    variants={fadeInUp}
                    style={{
                      flex: 1, padding: '1rem 0.5rem', borderRadius: '1rem', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                      background: activeApp.id === app.id ? `${app.color}15` : 'rgba(255,255,255,0.03)',
                      border: activeApp.id === app.id ? `1px solid ${app.color}60` : '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s'
                    }}
                  >
                  <div style={{
                    width: 48, height: 48, borderRadius: '1rem',
                    background: activeApp.id === app.id ? app.color : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <app.icon size={24} style={{ color: activeApp.id === app.id ? 'white' : '#64748b' }} />
                  </div>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 600,
                    color: activeApp.id === app.id ? 'white' : '#94a3b8'
                  }}>
                    {app.name}
                  </span>
                </motion.button>
                ))}
              </div>
            </StaggerChildren>

            {/* Active App Preview */}
            <div className="preview-card" style={{ borderRadius: '1.25rem', padding: '1.5rem', minHeight: '220px' }}>
              {isLoading ? (
                <div className="animate-fade-up">
                  <SkeletonText lines={2} className="mb-6" />
                  <Skeleton style={{ width: '120px', height: '14px', marginBottom: '16px' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Skeleton style={{ height: '24px', borderRadius: '4px' }} />
                    <Skeleton style={{ height: '24px', borderRadius: '4px' }} />
                    <Skeleton style={{ height: '24px', borderRadius: '4px' }} />
                    <Skeleton style={{ height: '24px', borderRadius: '4px' }} />
                  </div>
                </div>
              ) : (
                <div className="animate-fade-up" key={activeApp.id}>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {activeApp.desc}
                  </p>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block' }}>
                      Dữ liệu được đồng bộ:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {activeApp.dataSync.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={16} style={{ color: activeApp.color }} />
                          <span style={{ color: 'var(--text-white)', fontSize: '0.875rem', fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: PDF Report & Family Sharing */}
          <motion.div variants={fadeInRight} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Medical Report Card */}
            <motion.div whileHover={{ scale: 1.02, y: -5 }} className="glass" style={{ borderRadius: '1.5rem', padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'rgba(52, 211, 153, 0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />

              <div style={{ width: 56, height: 56, borderRadius: '1.25rem', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Download size={28} style={{ color: '#34d399' }} />
              </div>

              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-white)', marginBottom: '0.75rem' }}>
                Xuất báo cáo cho Bác sĩ
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Chỉ với 1 chạm duy nhất trên ứng dụng AuraRing, bạn có thể xuất ra file PDF báo cáo y tế toàn diện (xu hướng nhịp tim, HRV, huyết áp) để gửi trực tiếp cho bác sĩ của bạn.
              </p>

              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(52, 211, 153, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.4)',
                  padding: '0.75rem 1.25rem', borderRadius: '1rem', fontWeight: 600, fontSize: '0.875rem',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content', cursor: 'pointer', transition: 'all 0.3s'
                }}
              >
                Tải mẫu báo cáo y tế
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>

            {/* Family Sharing Card */}
            <motion.div whileHover={{ scale: 1.02, y: -5 }} className="glass" style={{ borderRadius: '1.5rem', padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: -50, right: -50, width: 150, height: 150, background: 'rgba(167, 139, 250, 0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />

              <div style={{ width: 56, height: 56, borderRadius: '1.25rem', background: 'rgba(167, 139, 250, 0.15)', border: '1px solid rgba(167, 139, 250, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Share2 size={28} style={{ color: '#a78bfa' }} />
              </div>

              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-white)', marginBottom: '0.75rem' }}>
                Chia sẻ với Người thân
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Tính năng <span style={{ color: 'var(--text-white)', fontWeight: 500 }}>Aura Care</span> cho phép bạn theo dõi từ xa tình trạng sức khỏe của cha mẹ hoặc người thân. Tự động gửi cảnh báo khẩn cấp (SMS) nếu có dấu hiệu sinh tồn bất thường.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </StaggerChildren>
      </div>
    </section>
  );
}
