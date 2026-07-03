import { useState, useEffect } from 'react';
import { Menu, X, Zap, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { label: 'Tính năng', href: '#features' },
  { label: 'Thông số', href: '#specs' },
  { label: 'Kết nối', href: '#connect' },
  { label: 'Đăng ký', href: '#newsletter' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
            <motion.button
              key={link.label}
              id={`nav-${link.label.toLowerCase()}`}
              onClick={() => handleNav(link.href)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
            >
              {link.label}
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-violet-500 to-cyan-400"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-full glass border border-white/10 text-slate-300 hover:text-white hover:border-violet-500/40 transition-all duration-300 theme-btn"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <motion.button
            id="nav-cta-preorder"
            onClick={() => handleNav('#newsletter')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-shimmer text-white font-600 text-sm px-6 py-2.5 rounded-full transition-all duration-300 font-['Space_Grotesk']"
          >
            Đặt trước ngay
          </motion.button>
        </div>

        {/* Mobile Hamburger */}
        <motion.button
          id="mobile-menu-toggle"
          className="md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-white/5 mt-3 mx-4 rounded-2xl p-5 flex flex-col gap-4 animate-fade-up">
          {navLinks.map((link) => (
            <motion.button
              key={link.label}
              onClick={() => handleNav(link.href)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="text-slate-300 hover:text-white text-left text-base font-medium py-2 border-b border-white/5 last:border-0 transition-colors"
            >
              {link.label}
            </motion.button>
          ))}
          <div className="flex gap-3 mt-2">
            <motion.button
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 glass rounded-xl flex items-center justify-center gap-2 text-slate-300 hover:text-white transition-colors theme-btn"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.button
              onClick={() => handleNav('#newsletter')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-[2] btn-shimmer text-white font-600 text-sm py-3 rounded-xl"
            >
              Đặt trước ngay
            </motion.button>
          </div>
        </div>
      )}
    </header>
  );
}
