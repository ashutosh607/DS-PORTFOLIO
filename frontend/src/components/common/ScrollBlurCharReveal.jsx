import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

/**
 * Individual Character Item
 * Subscribes to container's scroll progress and animates:
 * - filter: blur(Npx) -> blur(0px)
 * - opacity: initialOpacity -> 1.0
 * - y: yOffset -> 0
 * - scale: 0.97 -> 1.0
 * 
 * Powered by Framer Motion motion templates for 60/120fps GPU performance without re-renders.
 */
function CharItem({ char, progress, range, blurAmount, initialOpacity, yOffset }) {
  const opacity = useTransform(progress, range, [initialOpacity, 1]);
  const blurVal = useTransform(progress, range, [blurAmount, 0]);
  const y = useTransform(progress, range, [yOffset, 0]);
  const scale = useTransform(progress, range, [0.97, 1]);
  const filter = useMotionTemplate`blur(${blurVal}px)`;

  return (
    <motion.span
      style={{
        display: 'inline-block',
        opacity,
        filter,
        y,
        scale,
        willChange: 'opacity, filter, transform',
      }}
    >
      {char}
    </motion.span>
  );
}

/**
 * ScrollBlurCharReveal
 * 
 * Takes text and reveals each character one-by-one from blurred to razor sharp
 * directly scrubbed according to the user's scroll position.
 * 
 * - Preserves natural word wrapping by wrapping words in inline-blocks
 * - Smooth overlapping character progression
 * - Responsive to both forward and backward scrolling
 */
export default function ScrollBlurCharReveal({
  children,
  text,
  as = 'p',
  className = '',
  style = {},
  blurAmount = 12,
  initialOpacity = 0.14,
  yOffset = 5,
  windowOverlap = 0.18,
  offset = ['start 0.90', 'start 0.32'],
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  const rawText = text || (typeof children === 'string' ? children : '');

  // Pre-calculate words and character ranges with smooth overlap
  const { wordsData } = useMemo(() => {
    if (!rawText) return { wordsData: [], totalChars: 0 };

    const words = rawText.split(' ');
    // Count total non-space characters
    let count = 0;
    for (const w of words) {
      count += w.length;
    }
    const totalChars = Math.max(1, count);

    // Calculate window size per character
    const windowSize = Math.min(0.28, Math.max(0.08, windowOverlap));
    const step = totalChars > 1 ? (1 - windowSize) / (totalChars - 1) : 0;

    let charCounter = 0;
    const computedWords = words.map((word, wIdx) => {
      const chars = word.split('').map((char) => {
        const start = Math.max(0, Math.min(1, charCounter * step));
        const end = Math.max(0, Math.min(1, start + windowSize));
        charCounter++;
        return { char, range: [start, end] };
      });
      return { id: wIdx, chars };
    });

    return { wordsData: computedWords, totalChars };
  }, [rawText, windowOverlap]);

  // Support custom tag dynamically (e.g. h1, h2, h3, p, span, div)
  const Component = as;

  if (!rawText) {
    return (
      <Component ref={containerRef} className={className} style={style}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={containerRef}
      className={className}
      style={{
        ...style,
        position: 'relative',
      }}
    >
      {wordsData.map((wordObj, wIdx) => (
        <React.Fragment key={wordObj.id}>
          <span
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {wordObj.chars.map((cObj, cIdx) => (
              <CharItem
                key={cIdx}
                char={cObj.char}
                progress={scrollYProgress}
                range={cObj.range}
                blurAmount={blurAmount}
                initialOpacity={initialOpacity}
                yOffset={yOffset}
              />
            ))}
          </span>
          {wIdx < wordsData.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.28em' }}>&nbsp;</span>
          )}
        </React.Fragment>
      ))}
    </Component>
  );
}
