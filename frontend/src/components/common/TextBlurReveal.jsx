import React from 'react';
import { motion } from 'framer-motion';

/**
 * TextBlurReveal
 * High-end editorial word-by-word reveal inspired by motion.dev.
 * Each word transitions from an optical lens blur (blur(12px) -> blur(0px)),
 * subtle Y displacement (y -> 0), and opacity (0 -> 1) with silky staggering.
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
  const rawText = text || (typeof children === 'string' ? children : '');
  const words = rawText ? rawText.split(' ') : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: `blur(${blurAmount}px)`,
      y: yOffset,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration,
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
        style={{ display: 'inline' }}
      >
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            variants={wordVariants}
            style={{
              display: 'inline-block',
              willChange: 'transform, opacity, filter',
            }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}
