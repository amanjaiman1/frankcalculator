import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import ArticleBody from '@/components/blog/ArticleBody';
import BlogCard from '@/components/blog/BlogCard';
import RelatedCalculators from '@/components/blog/RelatedCalculators';
import { accentClasses } from '@/components/blog/blogStyles';
import {
  getPost,
  getAllPostSlugs,
  getRelatedPosts,
  buildPostMetadata,
  blogPostingLd,
  blogBreadcrumbLd,
  blogFaqLd,
} from '@/lib/blog';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!getPost(slug)) return {};
  return buildPostMetadata(slug);
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const a = accentClasses(post.accent);
  const related = getRelatedPosts(post, 3);
  const faqLd = blogFaqLd(slug);

  return (
    <>
      <JsonLd data={blogPostingLd(slug)} />
      <JsonLd data={blogBreadcrumbLd(slug)} />
      {faqLd && <JsonLd data={faqLd} />}

      <article className="relative">
        {/* Hero / header */}
        <header className="relative pt-24 pb-8 overflow-hidden">
          <div className={`aurora-orb top-[-30%] left-[10%] w-[26rem] h-[26rem] ${a.softBg}`} />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-gray-500">
                <li>
                  <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
                </li>
                <li aria-hidden>/</li>
                <li className={a.text}>{post.category}</li>
              </ol>
            </nav>

            <span className={`text-[11px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${a.softBg} ${a.text}`}>
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-display)] tracking-[-0.02em] leading-[1.08] mt-4">
              {post.title}
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed mt-4">{post.excerpt}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 text-sm text-gray-500">
              <span className="text-gray-300">{post.author}</span>
              <span aria-hidden>•</span>
              <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
              <span aria-hidden>•</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <div className="section-divider mb-8" />
          <ArticleBody blocks={post.content} accent={post.accent} />
        </div>

        {/* FAQ */}
        {post.faqs.length > 0 && (
          <section className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {post.faqs.map((faq) => (
                <details key={faq.q} className="glass-card p-5 group">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-white font-medium">
                    <span>{faq.q}</span>
                    <span className={`${a.text} text-xl transition-transform group-open:rotate-45`}>+</span>
                  </summary>
                  <p className="text-sm text-gray-400 leading-relaxed mt-3">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related calculators */}
        {post.relatedCalculators.length > 0 && (
          <section className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-2 mb-5">
              <span className={`w-1.5 h-1.5 rounded-full ${a.bg}`} />
              <h2 className="text-xs uppercase tracking-[0.18em] text-gray-400">Calculators in this guide</h2>
            </div>
            <RelatedCalculators slugs={post.relatedCalculators} />
          </section>
        )}

        {/* Disclaimer */}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-xs text-gray-600 leading-relaxed border-t border-white/5 pt-6">
            This article is for general informational purposes only and is not financial, legal or tax advice.
            Figures and rules cited (such as contribution limits, rates and settlement ranges) can change and vary
            by situation and jurisdiction. Always consult a qualified professional before making decisions.
          </p>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="section-divider mb-10" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mb-8 text-center">
              Keep <span className="gradient-text">Reading</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/blog" className="ghost-button px-6 py-3 text-sm">
                ← Back to all articles
              </Link>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
