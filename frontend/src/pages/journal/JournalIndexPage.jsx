import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JOURNAL_ARTICLES } from './journalData';
import SEOHead from '../../components/common/SEOHead';
import { buildBreadcrumbSchema } from '../../utils/structuredData';
import { SEO_CONFIG } from '../../utils/seoConfig';

export default function JournalIndexPage() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Journal & Guides', url: '/journal' },
  ]);

  return (
    <div
      className="min-h-screen bg-[#FDFCF8] text-[#101010] selection:bg-[#E3DBCC] selection:text-[#101010]"
      style={{
        paddingTop: 'clamp(120px, 11vw, 160px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)',
      }}
    >
      <SEOHead
        title="Photography Guides, Locations & Journal | DS Photography Mumbai"
        description="Editorial photography guides, wedding timeline advice, and curated pre-wedding shoot locations in Mumbai and Maharashtra by Dishant Shelar."
        keywords="pre wedding shoot locations mumbai, wedding photography guide, what to wear pre wedding shoot, photography blog mumbai, ds photography journal"
        canonicalUrl={`${SEO_CONFIG.siteUrl}/journal`}
        breadcrumbs={breadcrumbs}
      />

      <div
        style={{
          maxWidth: '1440px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
          width: '100%',
        }}
      >
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.24em] text-[#7A7770] uppercase mb-4">
            <span className="w-8 h-[1px] bg-[#E3DBCC]" />
            <span>ATELIER ARCHIVE &amp; GUIDES</span>
            <span className="w-8 h-[1px] bg-[#E3DBCC]" />
          </div>

          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[36px] sm:text-[48px] md:text-[56px] text-[#101010] font-normal leading-tight tracking-[-0.02em] mb-4"
          >
            Stories, Guides &amp; Perspectives
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#7A7770] leading-relaxed">
            Thoughtful considerations on wedding planning, destination location scouting in Maharashtra, and timeless styling.
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {JOURNAL_ARTICLES.map((article, idx) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col justify-between bg-[#FAF8F5] rounded-2xl border border-[#E3DBCC] overflow-hidden hover:shadow-[0_16px_36px_-8px_rgba(16,16,16,0.08)] hover:border-[#101010]/30 transition-all duration-300"
            >
              <div>
                <Link to={`/journal/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-[#F3EFE6]">
                  <img
                    src={article.coverImage}
                    alt={article.imageAlt || article.title}
                    width="600"
                    height="375"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#101010]/75 backdrop-blur-xs text-[#FDFCF8] text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full">
                    {article.category}
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#7A7770] tracking-wider uppercase mb-3">
                    <span>{article.dateFormatted}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h2
                    style={{ fontFamily: 'var(--font-serif)' }}
                    className="text-xl sm:text-2xl text-[#101010] font-normal leading-snug tracking-tight mb-2 group-hover:text-[#2B579A] transition-colors"
                  >
                    <Link to={`/journal/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="font-sans text-xs sm:text-[13px] text-[#55493A] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[#E3DBCC]/50 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider text-[#7A7770] uppercase">
                  BY {article.author}
                </span>
                <Link
                  to={`/journal/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-[#101010] group-hover:text-[#2B579A] font-semibold transition-colors"
                >
                  <span>Read Guide</span>
                  <span>→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
