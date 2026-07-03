import { motion } from 'motion/react';

// Shimmer animation keyframes
const shimmerStyle = {
  background: 'linear-gradient(90deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.25) 50%, rgba(124, 58, 237, 0.1) 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s ease-in-out infinite'
};

export default function Skeleton({ className = '', style = {}, variant = 'default' }) {
  const baseStyle = {
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(124, 58, 237, 0.05)',
    ...shimmerStyle,
    ...style
  };

  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg ${className}`}
      style={baseStyle}
    />
  );
}

export function SkeletonText({ lines = 3, className = '', lineStyle = {}, height = 14 }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          style={{ 
            height, 
            width: i === lines - 1 && lines > 1 ? '70%' : '100%',
            borderRadius: 6,
            ...lineStyle
          }} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '', style = {}, height = 120 }) {
  return (
    <Skeleton
      className={className}
      style={{
        height,
        borderRadius: '1.5rem',
        ...style
      }}
    />
  );
}

export function SkeletonCircle({ size = 56, className = '', style = {} }) {
  return (
    <Skeleton
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        ...style
      }}
    />
  );
}

// Add shimmer keyframes to global styles
export function SkeletonStyles() {
  return (
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  );
}
