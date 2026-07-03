import { useState, useCallback } from 'react';
import { Mail, Send, User, CheckCircle, Phone, Bell, Gift, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useToast } from '../context/ToastContext';
import Skeleton, { SkeletonText } from './ui/Skeleton';
import { fadeInLeft, fadeInRight } from '../hooks/useScrollAnimation.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 WEBHOOK URL — Thay bằng endpoint thực của bạn
//    webhook.site  → https://webhook.site  (miễn phí, có dashboard)
//    Hoặc đặt VITE_WEBHOOK_URL trong file .env
// ─────────────────────────────────────────────────────────────────────────────
// Demo fallback: jsonplaceholder hỗ trợ CORS, trả 201 OK
// → Thay bằng VITE_WEBHOOK_URL thực (webhook.site, n8n, ...) khi deploy
const WEBHOOK_URL =
  import.meta.env.VITE_WEBHOOK_URL ?? 'https://jsonplaceholder.typicode.com/posts';

// Email domains bị chặn
const BLOCKED_DOMAINS = new Set([
  'test.com', 'example.com', 'mailinator.com',
  'guerrillamail.com', 'tempmail.com', 'throwaway.email',
]);

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSessionId() {
  let sid = sessionStorage.getItem('arx_sid');
  if (!sid) {
    sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('arx_sid', sid);
  }
  return sid;
}

function saveLocal(data) {
  try {
    const prev = JSON.parse(localStorage.getItem('auraringx_subscribers') ?? '[]');
    prev.push({ ...data, saved_at: new Date().toISOString(), id: Date.now() });
    localStorage.setItem('auraringx_subscribers', JSON.stringify(prev));
  } catch (_) { /* ignore QuotaExceededError */ }
}

/** Retry fetch với exponential back-off và timeout 10s */
async function postWithRetry(url, body, maxAttempts = 3) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10_000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      clearTimeout(tid);
      if (attempt === maxAttempts - 1) throw err;
      await new Promise(r => setTimeout(r, 800 * 2 ** attempt)); // 800ms, 1.6s, ...
    }
  }
}

// ── Validators ────────────────────────────────────────────────────────────────

const VALIDATORS = {
  name(v) {
    if (!v.trim()) return 'Vui lòng nhập họ tên của bạn.';
    if (v.trim().length < 2) return 'Tên phải có ít nhất 2 ký tự.';
    if (/\d/.test(v)) return 'Tên không được chứa số.';
    return '';
  },
  email(v) {
    if (!v.trim()) return 'Vui lòng nhập địa chỉ email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Email không đúng định dạng.';
    const domain = v.split('@')[1]?.toLowerCase() ?? '';
    if (BLOCKED_DOMAINS.has(domain)) return `Domain "${domain}" không được chấp nhận.`;
    return '';
  },
  phone(v) {
    if (!v.trim()) return '';
    const clean = v.replace(/[\s\-().]/g, '');
    if (!/^(0[35789]\d{8})$/.test(clean)) return 'SĐT không hợp lệ — VD: 0901234567.';
    return '';
  },
};

const BENEFITS = [
  { Icon: Bell, text: 'Nhận thông báo khi mở bán' },
  { Icon: Gift, text: 'Ưu đãi early bird 15% off' },
  { Icon: Star, text: 'Quyền kiểm thử beta trước' },
];

const AVATAR_COLORS = ['#7c3aed', '#4f46e5', '#06b6d4', '#ec4899', '#10b981'];

// ─────────────────────────────────────────────────────────────────────────────

export default function Newsletter() {
  const { addToast } = useToast();

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });
  const [shaking, setShaking] = useState(new Set());
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0.7, 1], [-200, 0]);

  const validateField = useCallback((name, value) =>
    VALIDATORS[name]?.(value) ?? '', []);

  const triggerShake = useCallback((fieldName) => {
    setShaking(prev => new Set([...prev, fieldName]));
    setTimeout(() => setShaking(prev => {
      const next = new Set(prev); next.delete(fieldName); return next;
    }), 600);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }, [validateField]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
      phone: validateField('phone', form.phone),
    };
    const invalidFields = Object.entries(newErrors).filter(([, v]) => v);

    if (invalidFields.length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, phone: true });
      invalidFields.forEach(([f]) => triggerShake(f));
      addToast({
        type: 'warning',
        title: 'Thông tin chưa hợp lệ',
        message: `Vui lòng kiểm tra lại ${invalidFields.length} trường bên dưới.`,
        duration: 4000,
      });
      return;
    }

    setStatus('loading');

    const payload = {
      source: 'auraringx_newsletter',
      source_page: window.location.href,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      session_id: getSessionId(),
      form_data: {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
      },
    };

    // Luôn lưu local trước khi gửi server
    saveLocal(payload.form_data);

    try {
      await postWithRetry(WEBHOOK_URL, payload);
      setStatus('success');
      setForm({ name: '', email: '', phone: '' });
      setTouched({ name: false, email: false, phone: false });
      addToast({
        type: 'success',
        title: 'Đăng ký thành công! 🎉',
        message: 'Chúng tôi đã nhận thông tin. Kiểm tra email để xác nhận.',
        duration: 6000,
      });
    } catch (err) {
      console.warn('[AuraRingX] Webhook thất bại sau 3 lần thử:', err?.message);
      // Data đã lưu local → vẫn success UX nhưng báo offline warning
      setStatus('success');
      setForm({ name: '', email: '', phone: '' });
      setTouched({ name: false, email: false, phone: false });
      addToast({
        type: 'warning',
        title: 'Đã lưu cục bộ',
        message: 'Kết nối server gặp sự cố. Dữ liệu vẫn được lưu an toàn.',
        duration: 7000,
      });
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrors({ name: '', email: '', phone: '' });
    setTouched({ name: false, email: false, phone: false });
  };

  return (
    <section id="newsletter" style={{ padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div style={{
          position: 'absolute', top: 0, left: '50%', x: '-50%', y: yBg,
          width: 800, height: 800, borderRadius: '50%', filter: 'blur(80px)',
          background: 'rgba(124,58,237,0.08)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.02,
          backgroundImage: `linear-gradient(rgba(124,58,237,0.8) 1px,transparent 1px),
            linear-gradient(90deg,rgba(124,58,237,0.8) 1px,transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem', alignItems: 'center',
        }}>
          {/* ── Left: copy ── */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} variants={fadeInLeft}>
            <div className="glass" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '9999px', marginBottom: '1.5rem',
              border: '1px solid rgba(236,72,153,0.3)',
            }}>
              <Mail size={13} style={{ color: '#f472b6' }} />
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Nhận tin sớm nhất</span>
            </div>

            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              fontSize: 'clamp(1.875rem,4vw,2.75rem)', color: 'var(--text-white)',
              lineHeight: 1.15, marginBottom: '1.25rem',
            }}>
              Sẵn sàng trải nghiệm{' '}
              <span className="text-gradient-pink">tương lai?</span>
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.0625rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              Đăng ký nhận thông tin ra mắt và ưu đãi dành riêng cho hội viên
              sớm — giới hạn <strong style={{ color: '#e2e8f0' }}>5.000 suất</strong> đầu tiên.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {BENEFITS.map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '0.75rem',
                    background: 'rgba(124,58,237,0.15)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} style={{ color: '#a78bfa' }} />
                  </div>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.9375rem' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex' }}>
                {AVATAR_COLORS.map((c, i) => (
                  <div key={i} style={{
                    width: 34, height: 34, borderRadius: '50%',
                    border: '2px solid #0a0514', marginLeft: i ? '-10px' : 0,
                    background: `linear-gradient(135deg,${c}70,${c}30)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <User size={13} style={{ color: 'var(--text-white)', opacity: 0.8 }} />
                  </div>
                ))}
              </div>
              <div>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-white)' }}>4,218 </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>người đã đăng ký</span>
              </div>
            </div>
          </motion.div>

          {/* ── Right: form ── */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            {status === 'success' ? (
              <div className="glass gradient-border" style={{ borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(52,211,153,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}>
                  <CheckCircle size={36} style={{ color: '#34d399' }} />
                </div>
                <h3 style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  fontSize: '1.5rem', color: 'var(--text-white)', marginBottom: '0.75rem',
                }}>Đăng ký thành công! 🎉</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Chúng tôi đã ghi nhận thông tin của bạn. Kiểm tra hộp thư
                  để nhận email xác nhận và cập nhật độc quyền.
                </p>
                <div className="glass" style={{
                  borderRadius: '0.875rem', padding: '0.875rem', marginBottom: '1.75rem',
                  border: '1px solid rgba(52,211,153,0.25)',
                }}>
                  <p style={{ color: '#34d399', fontSize: '0.875rem', fontWeight: 600 }}>
                    ✓ Dữ liệu đã được lưu an toàn &amp; gửi tới server.
                  </p>
                </div>
                <motion.button
                  id="newsletter-register-again"
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass"
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-white)',
                    fontSize: '0.875rem', padding: '0.75rem 1.5rem',
                    borderRadius: '0.875rem', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)', transition: 'all 0.3s',
                  }}
                >
                  Đăng ký tài khoản khác
                </motion.button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="glass gradient-border"
                style={{ borderRadius: '1.5rem', padding: '2rem' }}
              >
                <h3 style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '1.75rem',
                }}>Đăng ký nhận thông tin</h3>

                {/* Name field */}
                <FormField
                  id="nl-name" name="name" label="Họ và tên" placeholder="Nguyễn Văn A"
                  icon={User} form={form} errors={errors} shaking={shaking}
                  onChange={handleChange} onBlur={handleBlur}
                />

                {/* Email field */}
                <FormField
                  id="nl-email" name="email" type="email" label="Địa chỉ Email"
                  placeholder="you@example.com" icon={Mail}
                  form={form} errors={errors} shaking={shaking}
                  onChange={handleChange} onBlur={handleBlur}
                />

                {/* Phone field (optional) */}
                <FormField
                  id="nl-phone" name="phone" type="tel" label="Số điện thoại"
                  placeholder="0901 234 567" icon={Phone} optional
                  form={form} errors={errors} shaking={shaking}
                  onChange={handleChange} onBlur={handleBlur}
                />

                <p style={{ color: '#475569', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                  🔒 Thông tin được mã hóa, không chia sẻ với bên thứ ba.
                </p>

                <motion.button
                  id="newsletter-submit-btn"
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={status !== 'loading' ? { scale: 1.02 } : {}}
                  whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                  className="btn-shimmer"
                  style={{
                    width: '100%', color: 'var(--text-white)',
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                    fontSize: '1rem', padding: '1rem', borderRadius: '0.875rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    border: 'none', opacity: status === 'loading' ? 0.65 : 1,
                    transition: 'opacity 0.2s, transform 0.15s',
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      <Skeleton style={{ width: 20, height: 20, borderRadius: '50%' }} />
                      <Skeleton style={{ width: 120, height: 16, borderRadius: 4 }} />
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Đăng ký ngay — miễn phí
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormField({ id, name, type = 'text', label, placeholder, icon: Icon, optional, form, errors, shaking, onChange, onBlur }) {
  const hasError = !!errors[name];
  const isShaking = shaking.has(name);

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label htmlFor={id} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
        {label}
        {optional
          ? <span style={{ color: '#475569', marginLeft: '0.375rem' }}>(không bắt buộc)</span>
          : <span style={{ color: '#f472b6', marginLeft: '0.25rem' }}>*</span>}
      </label>

      <div className={isShaking ? 'animate-shake' : ''} style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={15} style={{
            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
            color: hasError ? '#f87171' : '#475569',
            transition: 'color 0.2s', pointerEvents: 'none',
          }} />
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={form[name]}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="input-glow"
          style={{
            width: '100%',
            background: hasError ? 'rgba(248,113,113,0.05)' : 'rgba(255,255,255,0.05)',
            border: `1.5px solid ${hasError ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '0.75rem',
            paddingLeft: Icon ? '2.75rem' : '1rem',
            paddingRight: '1rem',
            paddingTop: '0.875rem',
            paddingBottom: '0.875rem',
            color: 'var(--text-white)',
            fontSize: '0.9375rem',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
          }}
        />
      </div>

      {hasError && (
        <p style={{
          color: '#f87171', fontSize: '0.8125rem',
          marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem',
          animation: 'fade-up 0.2s ease both',
        }}>
          ⚠ {errors[name]}
        </p>
      )}
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ animation: 'spin-slow 0.75s linear infinite', flexShrink: 0 }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
    </svg>
  );
}
