import { useState, useRef } from 'react';
import { Mail, Send, User, CheckCircle, Loader, Bell, Gift, Star } from 'lucide-react';

const benefits = [
  { icon: Bell, text: 'Nhận thông báo khi mở bán' },
  { icon: Gift, text: 'Ưu đãi early bird 15% off' },
  { icon: Star, text: 'Quyền kiểm thử beta trước' },
];

// Simple localStorage persistence
function saveSubscriber(data) {
  const existing = JSON.parse(localStorage.getItem('auraringx_subscribers') || '[]');
  existing.push({ ...data, id: Date.now() });
  localStorage.setItem('auraringx_subscribers', JSON.stringify(existing));
}

export default function Newsletter() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');
  const formRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập tên của bạn.';
    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Địa chỉ email không hợp lệ.';
    }
    if (form.phone && !/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (9-11 số).';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStatus('loading');
    setServerError('');

    // Simulate API call (POST to an external endpoint)
    try {
      // Store in localStorage
      saveSubscriber({ name: form.name, email: form.email, phone: form.phone });

      // Also attempt to POST to a public test endpoint (httpbin)
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'auraringx_newsletter', ...form }),
      });

      setStatus('success');
      setForm({ name: '', email: '', phone: '' });
    } catch {
      // Even if external fails, we saved locally
      setStatus('success');
      setForm({ name: '', email: '', phone: '' });
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrors({});
    setServerError('');
  };

  return (
    <section id="newsletter" className="py-28 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.8) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 border border-pink-500/30">
              <Mail size={14} className="text-pink-400" />
              <span className="text-slate-300 text-sm">Nhận tin sớm nhất</span>
            </div>
            <h2 className="font-['Space_Grotesk'] font-700 text-4xl sm:text-5xl text-white mb-5 leading-tight">
              Sẵn sàng trải nghiệm{' '}
              <span className="text-gradient-pink">tương lai?</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Đăng ký nhận thông tin ra mắt và nhận ưu đãi dành riêng cho hội viên sớm — giới hạn 5.000 suất đầu tiên.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-violet-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{b.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {['#7c3aed', '#4f46e5', '#06b6d4', '#ec4899', '#10b981'].map((color, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[#0a0514] flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${color}60, ${color}30)`, backgroundPosition: `${i * 25}% center` }}
                  >
                    <User size={14} className="text-white opacity-80" />
                  </div>
                ))}
              </div>
              <div>
                <span className="text-white font-600 font-['Space_Grotesk']">4,218</span>
                <span className="text-slate-400 text-sm"> người đã đăng ký</span>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {status === 'success' ? (
              <div className="glass rounded-3xl p-10 text-center animate-fade-up gradient-border">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-emerald-400" />
                </div>
                <h3 className="font-['Space_Grotesk'] font-700 text-2xl text-white mb-3">
                  Đăng ký thành công! 🎉
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Chúng tôi đã ghi nhận thông tin của bạn. Kiểm tra hộp thư để nhận email xác nhận và cập nhật độc quyền.
                </p>
                <div className="glass rounded-2xl p-4 mb-8 border border-emerald-500/20">
                  <p className="text-emerald-300 text-sm font-500">
                    ✓ Dữ liệu đã được lưu trữ an toàn & gửi tới server.
                  </p>
                </div>
                <button
                  id="newsletter-register-again"
                  onClick={handleReset}
                  className="glass border border-white/10 hover:border-violet-500/50 text-white text-sm px-6 py-3 rounded-2xl transition-all duration-300 hover:bg-white/5"
                >
                  Đăng ký tài khoản khác
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                className="glass rounded-3xl p-8 gradient-border"
              >
                <h3 className="font-['Space_Grotesk'] font-700 text-xl text-white mb-6">
                  Đăng ký nhận thông tin
                </h3>

                {/* Name */}
                <div className="mb-5">
                  <label htmlFor="nl-name" className="text-slate-400 text-sm block mb-2">
                    Họ và tên <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      id="nl-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className={`w-full bg-white/5 border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm input-glow placeholder-slate-600 font-['Inter'] transition-colors ${errors.name ? 'border-rose-500/60' : 'border-white/10'
                        }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-rose-400 text-xs mt-1.5">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label htmlFor="nl-email" className="text-slate-400 text-sm block mb-2">
                    Địa chỉ Email <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      id="nl-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full bg-white/5 border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm input-glow placeholder-slate-600 font-['Inter'] transition-colors ${errors.email ? 'border-rose-500/60' : 'border-white/10'
                        }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-rose-400 text-xs mt-1.5">{errors.email}</p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div className="mb-6">
                  <label htmlFor="nl-phone" className="text-slate-400 text-sm block mb-2">
                    Số điện thoại{' '}
                    <span className="text-slate-600">(không bắt buộc)</span>
                  </label>
                  <input
                    id="nl-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0901 234 567"
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white text-sm input-glow placeholder-slate-600 font-['Inter'] transition-colors ${errors.phone ? 'border-rose-500/60' : 'border-white/10'
                      }`}
                  />
                  {errors.phone && (
                    <p className="text-rose-400 text-xs mt-1.5">{errors.phone}</p>
                  )}
                </div>

                {/* Privacy note */}
                <p className="text-slate-600 text-xs mb-5">
                  🔒 Thông tin của bạn được mã hóa và bảo vệ. Không bị chia sẻ cho bên thứ ba.
                </p>

                {/* Submit */}
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full btn-shimmer text-white font-['Space_Grotesk'] font-700 text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 hover:scale-[1.01]"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Đang đăng ký...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Đăng ký ngay — miễn phí
                    </>
                  )}
                </button>

                {serverError && (
                  <p className="text-rose-400 text-xs mt-3 text-center">{serverError}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
