import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollCardReveal
 * Modern motion.dev pop-up style scroll entrance for cards, grids, and elements.
 * Combines spring-like scale (0.94 -> 1.0), subtle vertical glide (y: 35px -> 0px),
 * and optical de-blurring with stagger and responsive hover dynamics.
 */
export default function ScrollCardReveal({
  children,
  index = 0,
  delay = 0,
  stagger = 0.1,
  yOffset = 32,
  initialScale = 0.94,
  blurAmount = 8,
  duration = 0.65,
  hoverEffect = true,
  hoverY = -5,
  className = '',
  style = {},
  once = true,
  margin = '-40px',
  onClick,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        scale: initialScale,
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{ once, margin }}
      transition={{
        duration,
        delay: delay + index * stagger,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        hoverEffect
          ? {
              y: hoverY,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      onClick={onClick}
      className={className}
      style={{
        willChange: 'transform, opacity, filter',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
