import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User, Compass, BookmarkCheck } from 'lucide-react';
import { JOURNAL_ARTICLES } from './journalData';
import SEOHead from '../../components/common/SEOHead';
import { buildBreadcrumbSchema } from '../../utils/structuredData';
import { SEO_CONFIG } from '../../utils/seoConfig';

export default function JournalArticlePage() {
  const { slug } = useParams();
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return <Navigate to="/journal" replace />;
  }

  const canonicalUrl = `${SEO_CONFIG.siteUrl}/journal/${article.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage],
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: SEO_CONFIG.photographerRole,
      url: `${SEO_CONFIG.siteUrl}/#dishant`,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.brandName,
      logo: {
        '@type': 'ImageObject',
        url: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.logoDark}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Journal', url: '/journal' },
    { name: article.title, url: `/journal/${article.slug}` },
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
        title={`${article.title} | DS Photography Guides`}
        description={article.excerpt}
        canonicalUrl={canonicalUrl}
        ogImage={article.coverImage}
        ogType="article"
        schema={articleSchema}
        breadcrumbs={breadcrumbs}
      />

      <article className="max-w-[880px] mx-auto px-4 sm:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 mb-8 text-xs font-mono uppercase tracking-[0.2em] text-[#7A7770]">
          <Link to="/" className="hover:text-[#101010] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/journal" className="hover:text-[#101010] transition-colors">Journal</Link>
          <span>/</span>
          <span className="text-[#101010] font-semibold truncate max-w-[200px] sm:max-w-none">{article.category}</span>
        </div>

        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E3DBCC] bg-[#FAF8F5] text-[10px] font-mono tracking-[0.2em] text-[#7A6E5D] uppercase mb-5">
          <Compass size={12} className="text-[#A48D78]" />
          <span>{article.category}</span>
        </div>

        {/* Title */}
        <h1
          style={{ fontFamily: 'var(--font-serif)' }}
          className="text-[32px] sm:text-[44px] md:text-[52px] text-[#101010] font-normal leading-[1.12] tracking-[-0.02em] mb-4"
        >
          {article.title}
        </h1>

        {/* Subtitle */}
        <p className="font-serif italic text-lg sm:text-xl text-[#7A7770] leading-relaxed mb-6">
          {article.subtitle}
        </p>

        {/* Article Meta Bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-4 border-y border-[#E3DBCC] font-mono text-[11px] text-[#7A7770] uppercase tracking-wider mb-8">
          <div className="flex items-center gap-1.5">
            <User size={13} />
            <span>By {article.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>{article.dateFormatted}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-12 border border-[#E3DBCC] shadow-md bg-[#F3EFE6]">
          <img
            src={article.coverImage}
            alt={article.imageAlt || article.title}
            width="880"
            height="550"
            className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
            loading="eager"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-neutral max-w-none text-[#332F2B] font-sans leading-relaxed text-base sm:text-[17px] space-y-8">
          <p className="font-serif text-xl sm:text-2xl text-[#101010] leading-relaxed italic border-l-2 border-[#101010] pl-6 my-6">
            {article.excerpt}
          </p>

          {article.content.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3 pt-4">
              <h2
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-2xl sm:text-3xl text-[#101010] font-normal leading-snug tracking-tight"
              >
                {section.heading}
              </h2>
              <p className="text-[#4A4844] leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action Box: Commission Inquiry */}
        <div className="my-14 p-8 sm:p-10 rounded-2xl bg-[#FAF8F5] border border-[#E3DBCC] text-center">
          <div className="inline-flex items-center gap-2 mb-3 text-[10px] font-mono tracking-[0.24em] text-[#7A6E5D] uppercase">
            <BookmarkCheck size={14} className="text-[#A48D78]" />
            <span>COMMISSION INQUIRY</span>
          </div>
          <h3
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-2xl sm:text-3xl text-[#101010] font-normal mb-3"
          >
            Planning an upcoming wedding or monograph shoot in Mumbai?
          </h3>
          <p className="font-sans text-sm text-[#7A7770] max-w-lg mx-auto mb-6">
            Review our seasonal calendar to reserve your date with principal photographer Dishant Shelar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/services#book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#101010] text-[#FAF8F5] font-sans text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#2B2824] transition-all shadow-sm"
            >
              <span>Explore Packages &amp; Reserve Date</span>
              <span>→</span>
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D5CBB9] bg-[#FDFCF8] text-[#101010] font-sans text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#F3EFE6] transition-all"
            >
              <span>View Collections Gallery</span>
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-[#E3DBCC] flex items-center justify-between">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#7A7770] hover:text-[#101010] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to All Guides</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
