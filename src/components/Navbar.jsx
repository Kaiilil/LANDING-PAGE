import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Tính năng', href: '#features' },
  { label: 'Thông số', href: '#specs' },
  { label: 'Kết nối', href: '#connect' },
  { label: 'Đăng ký', href: '#newsletter' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (href) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark shadow-lg shadow-violet-500/10 py-3' : 'py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40 group-hover:shadow-violet-500/60 transition-shadow duration-300">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-['Space_Grotesk'] font-700 text-xl tracking-tight">
            <span className="text-gradient">Aura</span>
            <span className="text-white">Ring</span>
            <span className="text-violet-400 ml-1 text-sm font-500">X</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              id={`nav-${link.label.toLowerCase()}`}
              onClick={() => handleNav(link.href)}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-violet-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button
            id="nav-cta-preorder"
            onClick={() => handleNav('#newsletter')}
            className="btn-shimmer text-white font-600 text-sm px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 font-['Space_Grotesk']"
          >
            Đặt trước ngay
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-white/5 mt-3 mx-4 rounded-2xl p-5 flex flex-col gap-4 animate-fade-up">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="text-slate-300 hover:text-white text-left text-base font-medium py-2 border-b border-white/5 last:border-0 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('#newsletter')}
            className="btn-shimmer text-white font-600 text-sm py-3 rounded-xl mt-2"
          >
            Đặt trước ngay
          </button>
        </div>
      )}
    </header>
  );
}
