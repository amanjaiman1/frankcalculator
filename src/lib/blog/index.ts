/* =========================================================================
 * FrankCalculator — Blog registry & helpers
 *
 * Aggregates every article from the category files into a single ordered
 * registry, and exposes lookup helpers plus JSON-LD / Metadata builders that
 * mirror the patterns in lib/seo.ts.
 * ===================================================================== */

import type { Metadata } from 'next';
import {
  SITE_URL,
  SITE_NAME,
  type JsonLdObject,
} from '@/lib/seo';
import type { BlogPost, BlogCategory } from './types';

import { workersCompPosts } from './posts-workers-comp';
import { loanPosts } from './posts-loans';
import { creditDebtPosts } from './posts-credit-debt';
import { investingPosts } from './posts-investing';
import { retirementPosts } from './posts-retirement';
import { personalFinancePosts } from './posts-personal-finance';

export type {
  BlogPost,
  BlogCategory,
  ContentBlock,
  AccentToken,
} from './types';

export const BLOG_BASE_PATH = '/blog';
export const BLOG_AUTHOR = 'The FrankCalculator Team';

/* ------------------------------ registry ------------------------------ */

/**
 * All posts in publication order (newest-intent first). The blog index can
 * re-sort by date; this preserves an intentional editorial ordering.
 */
export const BLOG_POSTS: BlogPost[] = [
  ...workersCompPosts,
  ...loanPosts,
  ...creditDebtPosts,
  ...investingPosts,
  ...retirementPosts,
  ...personalFinancePosts,
];

/** Display order for category chips on the index page. */
export const BLOG_CATEGORIES: BlogCategory[] = [
  'Workers Comp',
  'Loans',
  'Credit & Debt',
  'Investing',
  'Retirement',
  'Personal Finance',
];

/* ------------------------------ lookups ------------------------------ */

const BY_SLUG = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

export function getPost(slug: string): BlogPost | undefined {
  return BY_SLUG.get(slug);
}

/** Throws on an unknown slug — surfaces routing/data mistakes early. */
export function getPostOrThrow(slug: string): BlogPost {
  const post = BY_SLUG.get(slug);
  if (!post) throw new Error(`Unknown blog slug: ${slug}`);
  return post;
}

export function getAllPostSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

/** Posts sorted newest-first by modified date (used on the index). */
export function getPostsByDate(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => +new Date(b.dateModified) - +new Date(a.dateModified),
  );
}

/**
 * Resolve related posts for an article. Uses explicit `relatedPosts` first,
 * then fills with same-category articles, then any remaining posts, always
 * excluding the current article. Returns up to `limit` posts.
 */
export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const picked: BlogPost[] = [];
  const seen = new Set<string>([post.slug]);

  const add = (candidate?: BlogPost) => {
    if (!candidate || seen.has(candidate.slug) || picked.length >= limit) return;
    seen.add(candidate.slug);
    picked.push(candidate);
  };

  (post.relatedPosts ?? []).forEach((slug) => add(getPost(slug)));
  getPostsByCategory(post.category).forEach(add);
  BLOG_POSTS.forEach(add);

  return picked.slice(0, limit);
}

/* ---------------------------- metadata ---------------------------- */

export function blogPostPath(slug: string): string {
  return `${BLOG_BASE_PATH}/${slug}`;
}

/** Per-article Metadata (title, description, keywords, canonical, OG, Twitter). */
export function buildPostMetadata(slug: string): Metadata {
  const post = getPostOrThrow(slug);
  const url = `${SITE_URL}${blogPostPath(slug)}`;
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: blogPostPath(slug) },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title: post.metaTitle,
      description: post.metaDescription,
      locale: 'en_US',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export const BLOG_INDEX_METADATA: Metadata = {
  title: 'Personal Finance Blog – Guides, Tips & Calculators',
  description:
    'Free, in-depth personal finance guides on loans, debt payoff, credit cards, investing, retirement and workers’ compensation — each paired with a calculator to run your own numbers.',
  keywords: [
    'personal finance blog',
    'financial calculators guide',
    'loan tips',
    'debt payoff guide',
    'investing for beginners',
    'retirement planning blog',
    'workers compensation settlement guide',
    'credit card payoff tips',
  ],
  alternates: { canonical: BLOG_BASE_PATH },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${BLOG_BASE_PATH}`,
    siteName: SITE_NAME,
    title: `Personal Finance Blog – ${SITE_NAME}`,
    description:
      'In-depth, no-nonsense personal finance guides, each paired with a free calculator so you can run your own numbers.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Personal Finance Blog – ${SITE_NAME}`,
    description:
      'In-depth, no-nonsense personal finance guides, each paired with a free calculator.',
  },
};

/* ---------------------------- JSON-LD ---------------------------- */

/** BlogPosting structured data for a single article. */
export function blogPostingLd(slug: string): JsonLdObject {
  const post = getPostOrThrow(slug);
  const url = `${SITE_URL}${blogPostPath(slug)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    inLanguage: 'en-US',
    author: { '@type': 'Organization', name: post.author, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** BreadcrumbList: Home → Blog → Article. */
export function blogBreadcrumbLd(slug: string): JsonLdObject {
  const post = getPostOrThrow(slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}${BLOG_BASE_PATH}` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}${blogPostPath(slug)}`,
      },
    ],
  };
}

/** FAQPage structured data built from an article's FAQ list. */
export function blogFaqLd(slug: string): JsonLdObject | null {
  const post = getPostOrThrow(slug);
  if (!post.faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/** Blog/CollectionPage structured data for the index, listing all articles. */
export function blogCollectionLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}${BLOG_BASE_PATH}`,
    description:
      'In-depth personal finance guides on loans, debt, credit cards, investing, retirement and workers’ compensation.',
    inLanguage: 'en-US',
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    blogPost: getPostsByDate().map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}${blogPostPath(post.slug)}`,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
    })),
  };
}

/** BreadcrumbList: Home → Blog (for the index). */
export function blogIndexBreadcrumbLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}${BLOG_BASE_PATH}` },
    ],
  };
}
