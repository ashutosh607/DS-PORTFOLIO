import React, { useRef, useState, useEffect, useMemo } from 'react';

/**
 * buildLetterData
 * Helper function to parse segments or text into a structured tree of:
 * Segments -> Words -> Characters (with Fisher-Yates randomized delays).
 */
function buildLetterData(segmentsProp, textProp, minDelay = 0, maxDelay = 1.2) {
  let segs = segmentsProp;
  if (!segs || !Array.isArray(segs) || segs.length === 0) {
    segs = [{ text: textProp || '', className: '', style: {} }];
  }

  const fullText = segs
    .map((s) => s.text || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // First pass: count total non-whitespace characters across all segments
  let totalChars = 0;
  segs.forEach((seg) => {
    const rawWords = (seg.text || '').trim().split(/\s+/).filter(Boolean);
    rawWords.forEach((w) => {
      totalChars += w.length;
    });
  });

  // Fisher-Yates shuffle to generate a unique random rank for each character
  const indices = Array.from({ length: totalChars }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Pre-calculate per-character random delays across [minDelay, maxDelay]
  const delays = new Array(totalChars);
  const range = Math.max(0.01, maxDelay - minDelay);
  for (let rank = 0; rank < totalChars; rank++) {
    const delay = minDelay + (rank / Math.max(1, totalChars - 1)) * range;
    delays[indices[rank]] = Number(delay.toFixed(3));
  }

  // Second pass: structure segments -> words -> characters with assigned delay
  let globalCharIndex = 0;
  const structuredSegments = segs.map((seg, sIdx) => {
    const rawWords = (seg.text || '').trim().split(/\s+/).filter(Boolean);
    const words = rawWords.map((wordStr, wIdx) => {
      const chars = wordStr.split('').map((char) => {
        const charIdx = globalCharIndex++;
        return {
          char,
          charIndex: charIdx,
          delay: delays[charIdx] ?? 0,
        };
      });
      return {
        id: `s${sIdx}-w${wIdx}`,
        word: wordStr,
        chars,
      };
    });

    return {
      id: `seg-${sIdx}`,
      className: seg.className || '',
      style: seg.style || {},
      words,
    };
  });

  return { fullText, totalChars, delays, segments: structuredSegments };
}

/**
 * RandomReveal Component
 *
 * Cinematic scroll-triggered random letter reveal:
 * - Words stay intact via `white-space: nowrap` and `inline-block` wrappers (no mid-word breaks).
 * - Full paragraph layout space is reserved on mount (zero layout shift).
 * - Each character reveals at a random delay (Fisher-Yates distributed between minDelay and maxDelay).
 * - Accessible: full text exposed in `aria-label` while letter spans have `aria-hidden="true"`.
 * - Respects prefers-reduced-motion: renders instantly when motion is reduced.
 * - Supports multiple segments for two-tone or multi-tone styling (e.g. dark + muted).
 */
export default function RandomReveal({
  text,
  segments,
  as: Component = 'p',
  className = '',
  style = {},
  minDelay = 0,
  maxDelay = 1.2,
  duration = 0.4,
  blurAmount = 4,
  yOffset = 6,
  threshold = 0.25,
  once = true,
  ...restProps
}) {
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect user's reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setIsRevealed(true);
    }
    const handler = (e) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) setIsRevealed(true);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver to trigger animation when scrolled into view
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const effectiveThreshold = isMobile ? Math.min(0.15, threshold) : threshold;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once) {
            observer.unobserve(node);
            observer.disconnect();
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      {
        threshold: effectiveThreshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, prefersReducedMotion, threshold]);

  // Generate randomized character delays once via useMemo
  const letterData = useMemo(() => {
    return buildLetterData(segments, text, minDelay, maxDelay);
  }, [segments, text, minDelay, maxDelay]);

  return (
    <Component
      ref={containerRef}
      className={`relative ${className}`}
      style={style}
      {...restProps}
    >
      {/* Screen-reader accessible full text string */}
      <span className="sr-only">{letterData.fullText}</span>

      {/* Decorative animated characters hidden from screen readers */}
      <span aria-hidden="true" className="inline">
        {letterData.segments.map((seg) => (
          <span key={seg.id} className={seg.className} style={seg.style}>
            {seg.words.map((word) => (
              <span
                key={word.id}
                className="random-reveal-word inline-block whitespace-nowrap mr-[0.28em]"
              >
                {word.chars.map((charObj) => (
                  <span
                    key={charObj.charIndex}
                    className={`random-reveal-char inline-block ${
                      isRevealed ? 'is-revealed' : ''
                    }`}
                    style={{
                      opacity: isRevealed || prefersReducedMotion ? 1 : 0,
                      filter: prefersReducedMotion
                        ? 'none'
                        : isRevealed
                        ? 'blur(0px)'
                        : `blur(${blurAmount}px)`,
                      transform: prefersReducedMotion
                        ? 'none'
                        : isRevealed
                        ? 'translateY(0px)'
                        : `translateY(${yOffset}px)`,
                      transitionProperty: 'opacity, filter, transform',
                      transitionDuration: prefersReducedMotion ? '0s' : `${duration}s`,
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDelay: prefersReducedMotion
                        ? '0s'
                        : isRevealed
                        ? `${charObj.delay}s`
                        : '0s',
                      willChange: isRevealed ? 'auto' : 'opacity, filter, transform',
                    }}
                  >
                    {charObj.char}
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Component>
  );
}

