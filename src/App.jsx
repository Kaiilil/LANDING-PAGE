import { lazy, Suspense } from 'react';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load heavy components
const Features = lazy(() => import('./components/Features'));
const Specs = lazy(() => import('./components/Specs'));
const DataConnect = lazy(() => import('./components/DataConnect'));
const Newsletter = lazy(() => import('./components/Newsletter'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen theme-bg relative transition-colors duration-500">
      {/* Global decorative bg — static so it doesn't repaint often */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={<LoadingFallback />}>
            <Features />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <Specs />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <DataConnect />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <Newsletter />
          </Suspense>
        </main>
        <Footer />
      </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
