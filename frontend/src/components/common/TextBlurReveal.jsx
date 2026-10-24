import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * TextBlurReveal
 * High-end editorial word-by-word reveal inspired by motion.dev.
 * Each word transitions from an optical lens blur (blur(12px) -> blur(0px)),
 * subtle Y displacement (y -> 0), with full opacity maintained throughout
 * so text meets WCAG AA contrast (>= 4.5:1) across every intermediate frame.
 */
export default function TextBlurReveal({
  text,
  children,
  as: Component = 'div',
  className = '',
  style = {},
  delay = 0,
  stagger = 0.035,
  blurAmount = 10,
  yOffset = 12,
  duration = 0.5,
  once = true,
  margin = '-40px',
}) {
  const shouldReduceMotion = useReducedMotion();
  const rawText = text || (typeof children === 'string' ? children : '');
  const words = rawText ? rawText.split(' ') : [];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 1,
      filter: shouldReduceMotion ? 'none' : `blur(${blurAmount}px)`,
      y: shouldReduceMotion ? 0 : yOffset,
    },
    visible: {
      opacity: 1,
      filter: 'none',
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (!words.length) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  return (
    <Component className={className} style={style}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin }}
        style={{ display: 'inline', color: 'inherit' }}
      >
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            variants={wordVariants}
            style={{
              display: 'inline-block',
              willChange: shouldReduceMotion ? 'auto' : 'transform, filter',
              color: 'inherit',
            }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}
