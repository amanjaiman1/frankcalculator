/* =========================================================================
 * FrankCalculator — Blog content model
 *
 * A typed, fully-serializable model for long-form SEO articles. Each post is
 * plain data so it can be statically rendered, fed to JSON-LD, and consumed by
 * both the blog index and the dynamic [slug] route.
 *
 * Content is expressed as an ordered list of "blocks" (headings, paragraphs,
 * lists, callouts, quotes, key-takeaways and calculator CTAs) so articles stay
 * structured, accessible and easy to render consistently.
 * ===================================================================== */

import type { FaqItem } from '@/lib/seo';

export type { FaqItem };

/** Accent color tokens defined in globals.css @theme (kept literal for JIT). */
export type AccentToken =
  | 'electric-blue'
  | 'neon-green'
  | 'hot-orange'
  | 'vivid-purple'
  | 'electric-pink'
  | 'accent-cyan';

/** Top-level content groupings used for filtering on the blog index. */
export type BlogCategory =
  | 'Workers Comp'
  | 'Loans'
  | 'Credit & Debt'
  | 'Investing'
  | 'Retirement'
  | 'Personal Finance';

/* ------------------------- content blocks ------------------------- */

export interface HeadingBlock {
  type: 'heading';
  /** Rendered as an <h2>. Doubles as an in-page anchor target. */
  text: string;
}

export interface SubheadingBlock {
  type: 'subheading';
  /** Rendered as an <h3>. */
  text: string;
}

export interface ParagraphBlock {
  type: 'paragraph';
  /** Supports lightweight inline markup: **bold** and [label](href). */
  text: string;
}

export interface ListBlock {
  type: 'list';
  ordered?: boolean;
  items: string[];
}

export interface CalloutBlock {
  type: 'callout';
  /** Optional eyebrow/title above the callout body. */
  title?: string;
  text: string;
}

export interface QuoteBlock {
  type: 'quote';
  text: string;
  cite?: string;
}

export interface StatBlock {
  type: 'stats';
  items: { value: string; label: string }[];
}

export interface KeyTakeawaysBlock {
  type: 'takeaways';
  items: string[];
}

/** Inline CTA that links to one of the site's calculators. */
export interface CalculatorCtaBlock {
  type: 'calculatorCta';
  /** A calculator slug from lib/seo.ts CALCULATORS. */
  slug: string;
  /** Optional override copy; falls back to a sensible default. */
  heading?: string;
  text?: string;
}

export type ContentBlock =
  | HeadingBlock
  | SubheadingBlock
  | ParagraphBlock
  | ListBlock
  | CalloutBlock
  | QuoteBlock
  | StatBlock
  | KeyTakeawaysBlock
  | CalculatorCtaBlock;

/* ------------------------------ post ------------------------------ */

export interface BlogPost {
  slug: string;
  /** On-page H1 (can be longer / more natural than the meta title). */
  title: string;
  /** <title> tag, keyword-first, <= ~60 chars (site name appended via template). */
  metaTitle: string;
  /** Meta description, ~150–160 chars with primary + secondary keywords. */
  metaDescription: string;
  /** Short summary used on cards, OG and the article intro. */
  excerpt: string;
  keywords: string[];
  category: BlogCategory;
  tags: string[];
  author: string;
  /** ISO date (YYYY-MM-DD). */
  datePublished: string;
  /** ISO date (YYYY-MM-DD). */
  dateModified: string;
  /** Estimated reading time in minutes. */
  readingTime: number;
  accent: AccentToken;
  /** Emoji used as the article/card glyph. */
  emoji: string;
  /** Calculator slugs most relevant to this article (drives cross-linking). */
  relatedCalculators: string[];
  /** Other blog slugs to surface as "keep reading". Optional. */
  relatedPosts?: string[];
  /** Ordered article body. */
  content: ContentBlock[];
  /** On-page FAQ — also emitted as FAQPage JSON-LD. */
  faqs: FaqItem[];
}
