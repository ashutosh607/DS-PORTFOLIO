import React, { useState, useEffect, useRef, useMemo } from 'react';

/**
 * LetterAssembly
 *
 * Cinematic, staggered letter-assembly text animation for DS Photography & Films.
 *
 * Each character begins with a subtle positional offset and optical blur,
 * then smoothly arrives at its exact resting position in a coordinated sequence.
 *
 * Key features:
 * - Zero Layout Shift (CLS = 0) with words wrapped in inline-block spans
 * - Words never break mid-word (whitespace: nowrap per word)
 * - Accessibility: plain text in aria-label on root, aria-hidden on inner spans
 * - SEO compliance: complete text indexable by crawlers
 * - Screen readers hear the cohesive sentence, not individual letters
 * - Prefers-reduced-motion: instantly rendered with zero animation
 * - Mobile & desktop optimized with lightweight GPU-accelerated CSS transitions
 * - Cleans up GPU memory (`will-change: auto`, `filter: none`) once assembled
 * - Supports two-tone or styled segments
 *
 * @param {string} [text] - Text string to animate
 * @param {React.ReactNode} [children] - Alternative string child
 * @param {Array<{text: string, className?: string}>} [segments] - Multi-styled segments
 * @param {string} [as='h2'] - Semantic tag ('h1', 'h2', 'h3', 'p', 'span', 'div')
 * @param {string} [className=''] - Container styling
 * @param {React.CSSProperties} [style={}] - Container inline styles
 * @param {number} [delay=0.08] - Initial delay in seconds before animation begins
 * @param {number} [duration=0.85] - Transition duration per character in seconds
 * @param {number} [charStagger=0.025] - Stagger between characters (in seconds, e.g. 25ms)
 * @param {number} [wordStagger=0.09] - Delay between word starts (in seconds, e.g. 90ms)
 * @param {number} [yOffset=18] - Starting vertical displacement in px
 * @param {number} [blurAmount=4] - Starting optical blur in px
 * @param {number} [threshold=0.15] - IntersectionObserver threshold (0 to 1)
 * @param {boolean} [immediate=false] - If true, triggers immediately on mount (for Hero above fold)
 * @param {boolean} [once=true] - Trigger once only
 * @param {string} [wordClassName=''] - Extra classes for word spans
 * @param {string} [charClassName=''] - Extra classes for character spans
 */
export default function LetterAssembly({
  text,
  children,
  segments,
  as: Component = 'h2',
  className = '',
  style = {},
  delay = 0.08,
  duration = 0.85,
  charStagger = 0.025,
  wordStagger = 0.09,
  yOffset = 18,
  blurAmount = 4,
  threshold = 0.15,
  immediate = false,
  once = true,
  wordClassName = '',
  charClassName = '',
}) {
  const containerRef = useRef(null);

  // Check reduced motion preference
  const isReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  const [isRevealed, setIsRevealed] = useState(isReducedMotion || immediate);
  const [isComplete, setIsComplete] = useState(isReducedMotion);

  // Normalize segments: string text -> single segment, or use provided segments
  const normalizedSegments = useMemo(() => {
    if (segments && Array.isArray(segments) && segments.length > 0) {
      return segments;
    }
    const raw = text || (typeof children === 'string' ? children : '');
    return [{ text: raw, className: '' }];
  }, [segments, text, children]);

  // Extract raw plain text for screen readers (aria-label) and SEO
  const rawPlainText = useMemo(() => {
    return normalizedSegments
      .map((s) => s.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }, [normalizedSegments]);

  // Pre-process words and character data with global continuous indexing
  const { processedSegments, totalDuration } = useMemo(() => {
    let runningWordIdx = 0;
    let maxCharDelay = 0;

    const segs = normalizedSegments.map((seg, sIdx) => {
      // Split by whitespace while preserving punctuation
      const words = seg.text ? seg.text.trim().split(/\s+/).filter(Boolean) : [];
      const startWordIdx = runningWordIdx;
      runningWordIdx += words.length;

      const wordsData = words.map((word, wIdx) => {
        const globalWordIdx = startWordIdx + wIdx;
        const wordBaseDelay = delay + globalWordIdx * wordStagger;

        const chars = word.split('').map((char, cIdx) => {
          const charDelay = wordBaseDelay + cIdx * charStagger;
          if (charDelay > maxCharDelay) {
            maxCharDelay = charDelay;
          }
          return {
            char,
            delay: Number(charDelay.toFixed(4)),
          };
        });

        return {
          word,
          chars,
          globalWordIdx,
        };
      });

      return {
        ...seg,
        sIdx,
        wordsData,
      };
    });

    const calculatedTotalDuration = maxCharDelay + duration;

    return {
      processedSegments: segs,
      totalDuration: calculatedTotalDuration,
      totalWords: runningWordIdx,
    };
  }, [normalizedSegments, delay, duration, charStagger, wordStagger]);

  // Scroll or immediate trigger via IntersectionObserver
  useEffect(() => {
    if (isReducedMotion || immediate) {
      setIsRevealed(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            if (once) {
              observer.unobserve(node);
            }
          } else if (!once) {
            setIsRevealed(false);
            setIsComplete(false);
          }
        });
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [immediate, once, threshold, isReducedMotion]);

  // Once all letters have landed, clean up GPU will-change and filters
  useEffect(() => {
    if (!isRevealed || isReducedMotion) return;

    const timer = setTimeout(() => {
      setIsComplete(true);
    }, (totalDuration + 0.15) * 1000);

    return () => clearTimeout(timer);
  }, [isRevealed, totalDuration, isReducedMotion]);

  if (!rawPlainText && !children) {
    return null;
  }

  // Reduced motion: render semantic text directly
  if (isReducedMotion) {
    return (
      <Component className={className} style={style}>
        {normalizedSegments.map((seg, idx) => (
          <span key={idx} className={seg.className || undefined}>
            {seg.text}{' '}
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component
      ref={containerRef}
      className={`letter-assembly-wrap ${isRevealed ? 'is-revealed' : ''} ${
        isComplete ? 'is-complete' : ''
      } ${className}`}
      style={{
        '--la-dur': `${duration}s`,
        '--la-y': `${yOffset}px`,
        '--la-blur': `${blurAmount}px`,
        ...style,
      }}
      aria-label={rawPlainText}
    >
      <span aria-hidden="true" className="inline">
        {processedSegments.map((seg, sIdx) => {
          const isLastSegment = sIdx === processedSegments.length - 1;

          return (
            <span key={sIdx} className={seg.className || undefined}>
              {seg.wordsData.map((wData, wIdx) => {
                const isOverallLastWord =
                  isLastSegment && wIdx === seg.wordsData.length - 1;

                return (
                  <span
                    key={wIdx}
                    className={`letter-assembly-word inline-block whitespace-nowrap align-baseline ${
                      !isOverallLastWord ? 'mr-[0.28em]' : ''
                    } ${wordClassName}`}
                  >
                    {wData.chars.map((cData, cIdx) => (
                      <span
                        key={cIdx}
                        className={`letter-assembly-char inline-block align-baseline ${charClassName}`}
                        style={{
                          '--la-delay': `${cData.delay}s`,
                        }}
                      >
                        {cData.char}
                      </span>
                    ))}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </Component>
  );
}

