import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * EditorialScrollStory
 * 
 * Home landing page feature showcase: "What We Do"
 * A continuous, multi-stage scroll journey showcasing the studio's primary features & disciplines.
 * 
 * Flow:
 * - Before each sentence appears, it has a proper smooth scroll-driven entrance (blur-to-sharp, vertical glide, scale, opacity).
 * - Each feature sentence holds its focus, then transitions out cleanly (blur, lift, fade).
 * - "One sentence gone it should not be seen again" — each phase strictly transitions out and stays gone!
 * - Asymmetric, random luxury photographs glide and reposition with independent physics.
 */
export default function EditorialScrollStory() {
  const containerRef = useRef(null);

  // 420vh gives ample room for 4 distinct, unhurried feature storytelling phases
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // =========================================================================
  // STAGE 01: THE OVERVIEW / WHAT WE DO
  // (Enters 0.00->0.08, Holds 0.08->0.18, Exits 0.18->0.25, then GONE forever)
  // =========================================================================
  const stage1Opacity = useTransform(scrollYProgress, [0.00, 0.07, 0.18, 0.25], [0, 1, 1, 0]);
  const stage1Y = useTransform(scrollYProgress, [0.00, 0.07, 0.18, 0.25], [60, 0, 0, -75]);
  const stage1Scale = useTransform(scrollYProgress, [0.00, 0.07, 0.18, 0.25], [0.96, 1.0, 1.0, 0.94]);
  const stage1Blur = useTransform(
    scrollYProgress,
    [0.00, 0.07, 0.18, 0.25],
    ['blur(16px)', 'blur(0px)', 'blur(0px)', 'blur(14px)']
  );

  // =========================================================================
  // STAGE 02: FEATURE 01 — EDITORIAL & HAUTE COUTURE CAMPAIGNS
  // (Enters 0.25->0.32, Holds 0.32->0.43, Exits 0.43->0.50, then GONE forever)
  // =========================================================================
  const stage2Opacity = useTransform(scrollYProgress, [0.25, 0.32, 0.43, 0.50], [0, 1, 1, 0]);
  const stage2Y = useTransform(scrollYProgress, [0.25, 0.32, 0.43, 0.50], [70, 0, 0, -75]);
  const stage2Scale = useTransform(scrollYProgress, [0.25, 0.32, 0.43, 0.50], [0.96, 1.0, 1.0, 0.94]);
  const stage2Blur = useTransform(
    scrollYProgress,
    [0.25, 0.32, 0.43, 0.50],
    ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(14px)']
  );

  // =========================================================================
  // STAGE 03: FEATURE 02 — ARCHITECTURAL & SPATIAL COMMISSIONS
  // (Enters 0.50->0.57, Holds 0.57->0.68, Exits 0.68->0.75, then GONE forever)
  // =========================================================================
  const stage3Opacity = useTransform(scrollYProgress, [0.50, 0.57, 0.68, 0.75], [0, 1, 1, 0]);
  const stage3Y = useTransform(scrollYProgress, [0.50, 0.57, 0.68, 0.75], [70, 0, 0, -75]);
  const stage3Scale = useTransform(scrollYProgress, [0.50, 0.57, 0.68, 0.75], [0.96, 1.0, 1.0, 0.94]);
  const stage3Blur = useTransform(
    scrollYProgress,
    [0.50, 0.57, 0.68, 0.75],
    ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(14px)']
  );

  // =========================================================================
  // STAGE 04: FEATURE 03 — FINE ART MONOGRAPHS & ARCHIVAL PRINTS
  // (Enters 0.75->0.83, Holds 0.83->0.94, Exits 0.94->0.99)
  // =========================================================================
  const stage4Opacity = useTransform(scrollYProgress, [0.75, 0.83, 0.94, 0.99], [0, 1, 1, 0]);
  const stage4Y = useTransform(scrollYProgress, [0.75, 0.83, 0.94, 0.99], [70, 0, 0, -50]);
  const stage4Scale = useTransform(scrollYProgress, [0.75, 0.83, 0.94, 0.99], [0.96, 1.0, 1.0, 0.96]);
  const stage4Blur = useTransform(
    scrollYProgress,
    [0.75, 0.83, 0.94, 0.99],
    ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(10px)']
  );

  // =========================================================================
  // 5 INDEPENDENT ASYMMETRIC PHOTOGRAPHS (Smooth multi-vector drift)
  // =========================================================================

  // Photo 1: High Fashion Chiaroscuro Portrait (Top Right)
  const p1Y = useTransform(scrollYProgress, [0.02, 0.55], [260, -220]);
  const p1Scale = useTransform(scrollYProgress, [0.02, 0.55], [0.92, 1.06]);
  const p1Opacity = useTransform(scrollYProgress, [0.02, 0.10, 0.46, 0.55], [0, 1, 1, 0]);
  const p1Blur = useTransform(scrollYProgress, [0.02, 0.10, 0.46, 0.55], ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);

  // Photo 2: Brutalist Architecture Light Slit (Lower Left)
  const p2X = useTransform(scrollYProgress, [0.12, 0.72], [-160, 50]);
  const p2Y = useTransform(scrollYProgress, [0.12, 0.72], [180, -140]);
  const p2Scale = useTransform(scrollYProgress, [0.12, 0.72], [0.92, 1.03]);
  const p2Opacity = useTransform(scrollYProgress, [0.12, 0.20, 0.65, 0.73], [0, 1, 1, 0]);
  const p2Blur = useTransform(scrollYProgress, [0.12, 0.20, 0.65, 0.73], ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);

  // Photo 3: Editorial Silhouette & Kinetic Movement (Mid Right)
  const p3X = useTransform(scrollYProgress, [0.24, 0.75], [100, -40]);
  const p3Y = useTransform(scrollYProgress, [0.24, 0.75], [240, -180]);
  const p3Scale = useTransform(scrollYProgress, [0.24, 0.75], [0.88, 1.04]);
  const p3Opacity = useTransform(scrollYProgress, [0.24, 0.32, 0.68, 0.76], [0, 0.95, 0.95, 0]);
  const p3Blur = useTransform(scrollYProgress, [0.24, 0.32, 0.68, 0.76], ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);

  // Photo 4: Marble Sculpture / Fine Art Drapery (Upper Left / Center Parallax)
  const p4Y = useTransform(scrollYProgress, [0.44, 0.96], [280, -160]);
  const p4Scale = useTransform(scrollYProgress, [0.44, 0.96], [0.90, 1.05]);
  const p4Opacity = useTransform(scrollYProgress, [0.44, 0.54, 0.90, 0.98], [0, 0.9, 0.9, 0]);
  const p4Blur = useTransform(scrollYProgress, [0.44, 0.54, 0.90, 0.98], ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);

  // Photo 5: Archival Interior / Minimalist Monolith (Bottom Right)
  const p5X = useTransform(scrollYProgress, [0.60, 0.98], [60, -30]);
  const p5Y = useTransform(scrollYProgress, [0.60, 0.98], [260, -120]);
  const p5Scale = useTransform(scrollYProgress, [0.60, 0.98], [0.92, 1.02]);
  const p5Opacity = useTransform(scrollYProgress, [0.60, 0.70, 0.92, 0.99], [0, 1, 1, 0]);
  const p5Blur = useTransform(scrollYProgress, [0.60, 0.70, 0.92, 0.99], ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);

  return (
    <section
      ref={containerRef}
      id="what-we-do"
      className="relative w-full bg-[var(--color-off-white)]"
      style={{
        // 420vh gives cinematic room for all 4 features to breathe
        height: '420vh',
      }}
    >
      {/* Pinned 100vh Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-24 py-10 md:py-14 select-none pointer-events-none">
        
        {/* ===================================================================
            TOP BAR: SECTION IDENTIFIER & CHAPTER TRACKER
            =================================================================== */}
        <div className="w-full flex items-center justify-between border-b border-[var(--color-nude-subtle)] pb-4 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-obsidian)]" />
            <span className="font-sans text-[0.675rem] font-semibold tracking-[0.24em] uppercase text-[var(--color-obsidian-light)]">
              Maison Édouard · What We Do
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[0.65rem] tracking-widest text-[var(--color-obsidian-light)] uppercase">
            <span className="hidden sm:inline-block">Disciplines & Atelier Craft</span>
            <span className="text-[var(--color-obsidian)] font-semibold">
              SCROLL TO REVEAL
            </span>
          </div>
        </div>

        {/* ===================================================================
            MAIN STAGE: FLOATING ASYMMETRIC PHOTOGRAPHY CANVAS
            =================================================================== */}
        <div className="relative flex-1 w-full flex items-center justify-center">

          {/* ---------------------------------------------------------------
              PHOTO 04: Marble Sculpture / Fine Art Drapery (Upper-Left Parallax)
              --------------------------------------------------------------- */}
          <motion.div
            style={{
              y: p4Y,
              scale: p4Scale,
              opacity: p4Opacity,
              filter: p4Blur,
            }}
            className="hidden lg:block absolute left-[8%] top-[10%] w-[190px] xl:w-[230px] aspect-[3/4] z-10 overflow-hidden shadow-[0_24px_50px_-12px_rgba(16,14,12,0.12)] border border-[rgba(227,219,204,0.35)]"
          >
            <img
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop"
              alt="Fine art sculptural drapery study"
              loading="lazy"
              className="w-full h-full object-cover grayscale contrast-115 brightness-95"
            />
            <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[0.55rem] font-mono tracking-wider uppercase text-white/90 mix-blend-difference">
              <span>FIG. 04</span>
              <span>PLASTIQUE</span>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              PHOTO 01: High Fashion Chiaroscuro Portrait (Top Right Flank)
              --------------------------------------------------------------- */}
          <motion.div
            style={{
              y: p1Y,
              scale: p1Scale,
              opacity: p1Opacity,
              filter: p1Blur,
            }}
            className="absolute right-0 sm:right-4 md:right-8 lg:right-12 top-[14%] sm:top-[12%] w-[160px] sm:w-[220px] md:w-[270px] lg:w-[310px] xl:w-[350px] aspect-[3/4] z-20 overflow-hidden shadow-[0_30px_60px_-15px_rgba(16,14,12,0.16)] border border-[rgba(227,219,204,0.4)]"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1400&auto=format&fit=crop"
              alt="Haute couture portrait study"
              loading="lazy"
              className="w-full h-full object-cover contrast-105 brightness-95"
            />
            <div className="absolute bottom-2.5 left-3.5 right-3.5 flex justify-between items-center text-[0.575rem] font-mono tracking-widest uppercase text-white/90 drop-shadow-sm">
              <span>FIG. 01</span>
              <span>EDITORIAL</span>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              PHOTO 02: Brutalist Light Slit Architecture (Lower-Left Flank)
              --------------------------------------------------------------- */}
          <motion.div
            style={{
              x: p2X,
              y: p2Y,
              scale: p2Scale,
              opacity: p2Opacity,
              filter: p2Blur,
            }}
            className="absolute left-0 sm:left-4 md:left-8 lg:left-12 bottom-[8%] sm:bottom-[10%] w-[180px] sm:w-[240px] md:w-[300px] lg:w-[360px] aspect-[16/10] z-20 overflow-hidden shadow-[0_28px_56px_-14px_rgba(16,14,12,0.14)] border border-[rgba(227,219,204,0.4)]"
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop"
              alt="Architectural space and chiaroscuro light slit"
              loading="lazy"
              className="w-full h-full object-cover contrast-110 brightness-95"
            />
            <div className="absolute bottom-2.5 left-3.5 right-3.5 flex justify-between items-center text-[0.575rem] font-mono tracking-widest uppercase text-white/90 drop-shadow-sm">
              <span>FIG. 02</span>
              <span>ARCHITECTURE</span>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              PHOTO 03: Editorial Silhouette & Movement (Mid-Right Accent)
              --------------------------------------------------------------- */}
          <motion.div
            style={{
              x: p3X,
              y: p3Y,
              scale: p3Scale,
              opacity: p3Opacity,
              filter: p3Blur,
            }}
            className="hidden md:block absolute right-[18%] bottom-[16%] w-[170px] xl:w-[210px] aspect-[4/5] z-10 overflow-hidden shadow-[0_22px_45px_-10px_rgba(16,14,12,0.13)] border border-[rgba(227,219,204,0.35)]"
          >
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
              alt="Kinetic high fashion silhouette"
              loading="lazy"
              className="w-full h-full object-cover grayscale contrast-110 brightness-95"
            />
            <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[0.55rem] font-mono tracking-wider uppercase text-white/90 drop-shadow-sm">
              <span>FIG. 03</span>
              <span>CINÉTIQUE</span>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              PHOTO 05: Archival Interior / Minimalist Monolith (Lower-Right Flank)
              --------------------------------------------------------------- */}
          <motion.div
            style={{
              x: p5X,
              y: p5Y,
              scale: p5Scale,
              opacity: p5Opacity,
              filter: p5Blur,
            }}
            className="hidden sm:block absolute right-[4%] bottom-[6%] w-[200px] md:w-[260px] lg:w-[310px] aspect-[16/10] z-20 overflow-hidden shadow-[0_28px_56px_-14px_rgba(16,14,12,0.15)] border border-[rgba(227,219,204,0.4)]"
          >
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
              alt="Archival interior spatial monolith"
              loading="lazy"
              className="w-full h-full object-cover contrast-105 brightness-95"
            />
            <div className="absolute bottom-2.5 left-3.5 right-3.5 flex justify-between items-center text-[0.575rem] font-mono tracking-widest uppercase text-white/90 drop-shadow-sm">
              <span>FIG. 05</span>
              <span>ESPACE</span>
            </div>
          </motion.div>

          {/* ===============================================================
              4-STAGE TRANSITIONAL TYPOGRAPHY SEQUENCE
              Each sentence has a smooth entrance scroll effect, holds, and
              then leaves forever without returning!
              =============================================================== */}

          {/* ---------------------------------------------------------------
              STAGE 01: OVERVIEW — WHAT WE DO
              --------------------------------------------------------------- */}
          <motion.div
            style={{
              opacity: stage1Opacity,
              y: stage1Y,
              scale: stage1Scale,
              filter: stage1Blur,
            }}
            className="absolute inset-0 flex flex-col justify-center max-w-3xl z-30 pointer-events-auto"
          >
            <div className="mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-3">
                <span className="w-5 h-[1px] bg-[var(--color-nude)]" />
                <span className="font-sans text-[0.675rem] sm:text-[0.75rem] font-semibold tracking-[0.26em] uppercase text-[var(--color-obsidian-light)]">
                  Overview · What We Do
                </span>
              </div>
            </div>

            <h2
              className="font-serif text-[clamp(2.2rem,4.8vw,4.5rem)] font-normal text-[var(--color-obsidian)] leading-[1.08] tracking-[-0.025em] mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Visual architecture for those who value{' '}
              <span className="italic font-serif text-[var(--color-obsidian-muted)]">
                permanence
              </span>{' '}
              over trends.
            </h2>

            <p className="font-sans text-sm sm:text-base md:text-lg text-[var(--color-obsidian-muted)] max-w-xl leading-relaxed font-light">
              From our Paris atelier to international commissions, we craft high-fashion editorial campaigns,
              monumental spatial folios, and museum-grade archival acquisitions.
            </p>

            <div className="mt-8 flex items-center gap-4 text-[0.675rem] font-mono tracking-[0.2em] text-[var(--color-obsidian-light)] uppercase">
              <span>01 / 04</span>
              <span className="w-12 h-[1px] bg-[var(--color-nude)]" />
              <span>Scroll for Features</span>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              STAGE 02: FEATURE 01 — EDITORIAL & HAUTE COUTURE
              --------------------------------------------------------------- */}
          <motion.div
            style={{
              opacity: stage2Opacity,
              y: stage2Y,
              scale: stage2Scale,
              filter: stage2Blur,
            }}
            className="absolute inset-0 flex flex-col justify-center items-start sm:items-end text-left sm:text-right max-w-3xl ml-auto z-30 pointer-events-auto pr-0 lg:pr-8"
          >
            <div className="mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-3">
                <span className="font-sans text-[0.675rem] sm:text-[0.75rem] font-semibold tracking-[0.26em] uppercase text-[var(--color-obsidian-light)]">
                  Feature 01 · Editorial & Fashion
                </span>
                <span className="w-5 h-[1px] bg-[var(--color-nude)]" />
              </div>
            </div>

            <h2
              className="font-serif text-[clamp(2.2rem,4.8vw,4.5rem)] font-normal text-[var(--color-obsidian)] leading-[1.08] tracking-[-0.025em] mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              High-fashion spreads & luxury campaigns framed in{' '}
              <span className="italic font-serif text-[var(--color-obsidian-muted)]">
                chiaroscuro
              </span>.
            </h2>

            <p className="font-sans text-sm sm:text-base md:text-lg text-[var(--color-obsidian-muted)] max-w-xl leading-relaxed font-light ml-0 sm:ml-auto">
              Art-directed lighting treatments on medium format 100-megapixel sensors and analog 35mm Tri-X film.
              Custom color science engineered for leading international maisons and magazines.
            </p>

            <div className="mt-8 flex items-center gap-4 text-[0.675rem] font-mono tracking-[0.2em] text-[var(--color-obsidian-light)] uppercase ml-0 sm:ml-auto">
              <span>Campaign Direction</span>
              <span className="w-12 h-[1px] bg-[var(--color-nude)]" />
              <span>02 / 04</span>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              STAGE 03: FEATURE 02 — ARCHITECTURAL & SPATIAL COMMISSIONS
              --------------------------------------------------------------- */}
          <motion.div
            style={{
              opacity: stage3Opacity,
              y: stage3Y,
              scale: stage3Scale,
              filter: stage3Blur,
            }}
            className="absolute inset-0 flex flex-col justify-center max-w-3xl z-30 pointer-events-auto pl-0 lg:pl-6"
          >
            <div className="mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-3">
                <span className="w-5 h-[1px] bg-[var(--color-nude)]" />
                <span className="font-sans text-[0.675rem] sm:text-[0.75rem] font-semibold tracking-[0.26em] uppercase text-[var(--color-obsidian-light)]">
                  Feature 02 · Architectural Monograph
                </span>
              </div>
            </div>

            <h2
              className="font-serif text-[clamp(2.2rem,4.8vw,4.5rem)] font-normal text-[var(--color-obsidian)] leading-[1.08] tracking-[-0.025em] mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Monumental structures captured in the poetry of{' '}
              <span className="italic font-serif text-[var(--color-obsidian-muted)]">
                ambient light
              </span>.
            </h2>

            <p className="font-sans text-sm sm:text-base md:text-lg text-[var(--color-obsidian-muted)] max-w-xl leading-relaxed font-light">
              Perspective-corrected large-format 4×5 sheet film, solar alignment studies, and bespoke monograph folios
              for renowned architects, private estates, and cultural foundations.
            </p>

            <div className="mt-8 flex items-center gap-4 text-[0.675rem] font-mono tracking-[0.2em] text-[var(--color-obsidian-light)] uppercase">
              <span>Spatial Mastery</span>
              <span className="w-12 h-[1px] bg-[var(--color-nude)]" />
              <span>03 / 04</span>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              STAGE 04: FEATURE 03 — FINE ART ARCHIVAL MONOGRAPHS & PRINTS
              --------------------------------------------------------------- */}
          <motion.div
            style={{
              opacity: stage4Opacity,
              y: stage4Y,
              scale: stage4Scale,
              filter: stage4Blur,
            }}
            className="absolute inset-0 flex flex-col justify-center items-start sm:items-end text-left sm:text-right max-w-3xl ml-auto z-30 pointer-events-auto pr-0 lg:pr-8"
          >
            <div className="mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-3">
                <span className="font-sans text-[0.675rem] sm:text-[0.75rem] font-semibold tracking-[0.26em] uppercase text-[var(--color-obsidian-light)]">
                  Feature 03 · Fine Art & Archival
                </span>
                <span className="w-5 h-[1px] bg-[var(--color-nude)]" />
              </div>
            </div>

            <h2
              className="font-serif text-[clamp(2.2rem,4.8vw,4.5rem)] font-normal text-[var(--color-obsidian)] leading-[1.08] tracking-[-0.025em] mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Limited edition darkroom prints on handmade{' '}
              <span className="italic font-serif text-[var(--color-obsidian-muted)]">
                Japanese washi
              </span>{' '}
              and cotton rag.
            </h2>

            <p className="font-sans text-sm sm:text-base md:text-lg text-[var(--color-obsidian-muted)] max-w-xl leading-relaxed font-light ml-0 sm:ml-auto">
              Mastered on platinum-palladium gelatin silver emulsions and bound in custom Belgian linen folios.
              Accompanied by verified provenance documentation for private collector archives.
            </p>

            <div className="mt-8 flex items-center gap-4 text-[0.675rem] font-mono tracking-[0.2em] text-[var(--color-obsidian-light)] uppercase ml-0 sm:ml-auto">
              <span>Darkroom Mastery</span>
              <span className="w-12 h-[1px] bg-[var(--color-nude)]" />
              <span>04 / 04</span>
            </div>
          </motion.div>

        </div>

        {/* ===================================================================
            FOOTER: LAT/LONG AND CONTINUOUS SCROLL PROGRESS BAR
            =================================================================== */}
        <div className="w-full flex items-center justify-between border-t border-[var(--color-nude-subtle)] pt-4 z-30">
          <div className="flex items-center gap-6 font-mono text-[0.625rem] tracking-wider text-[var(--color-obsidian-light)] uppercase">
            <span>Atelier Paris</span>
            <span className="hidden md:inline">· 48.8566° N, 2.3522° E</span>
            <span>· All Works Archival</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.625rem] tracking-widest text-[var(--color-obsidian-light)] uppercase">
              Scroll Story
            </span>
            <div className="w-28 h-[1.5px] bg-[var(--color-nude)] relative overflow-hidden">
              <motion.div
                style={{
                  scaleX: scrollYProgress,
                  transformOrigin: 'left',
                }}
                className="absolute inset-0 bg-[var(--color-obsidian)]"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
