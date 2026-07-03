import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

// Animation variants for scroll animations
export const animationVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

// Export individual variants for direct use
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Default transition settings
const defaultTransition = {
  duration: 0.6,
  ease: 'easeOut',
};

// Reusable hook for scroll animations
export function useScrollAnimation(options = {}) {
  const {
    variant = 'fadeUp',
    threshold = 0.1,
    once = true,
    delay = 0,
    duration = 0.6,
    staggerChildren = 0,
  } = options;

  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: threshold,
    once,
  });

  const selectedVariant = animationVariants[variant] || animationVariants.fadeUp;

  const transition = {
    ...defaultTransition,
    duration,
    delay,
  };

  const containerVariants = staggerChildren > 0
    ? {
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }
    : null;

  return {
    ref,
    isInView,
    variants: selectedVariant,
    transition,
    containerVariants,
  };
}

// HOC component for scroll animations
export function ScrollAnimation({
  children,
  variant = 'fadeUp',
  threshold = 0.1,
  once = true,
  delay = 0,
  duration = 0.6,
  className = '',
  style = {},
}) {
  const { ref, variants, transition } = useScrollAnimation({
    variant,
    threshold,
    once,
    delay,
    duration,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Export as ScrollAnimated for compatibility
export { ScrollAnimation as ScrollAnimated };

// Stagger container for animating children with delay
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  threshold = 0.1,
  once = true,
  delay = 0,
  className = '',
  style = {},
}) {
  const { ref, containerVariants } = useScrollAnimation({
    threshold,
    once,
    delay,
    staggerChildren: staggerDelay,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants || {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Export as StaggerChildren for compatibility
export { StaggerContainer as StaggerChildren };

// Stagger item for children inside StaggerContainer
export function StaggerItem({
  children,
  variant = 'fadeUp',
  duration = 0.5,
  className = '',
  style = {},
}) {
  const variants = animationVariants[variant] || animationVariants.fadeUp;

  return (
    <motion.div
      variants={variants}
      transition={{ duration, ease: 'easeOut' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
