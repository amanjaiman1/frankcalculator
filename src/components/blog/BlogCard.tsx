'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/blog';
import { blogPostPath } from '@/lib/blog';
import { accentClasses } from './blogStyles';

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const a = accentClasses(post.accent);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link href={blogPostPath(post.slug)} className="block group h-full">
        <div className="glass-card p-6 h-full relative overflow-hidden flex flex-col">
          {/* accent top line */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${a.gradient} opacity-70 group-hover:opacity-100 transition-opacity`} />

          {/* header: emoji + category */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${a.gradient} blur-md opacity-40 group-hover:opacity-70 transition-opacity`} />
              <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-xl ring-1 ring-white/10`}>
                {post.emoji}
              </div>
            </div>
            <span className={`text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full ${a.softBg} ${a.text}`}>
              {post.category}
            </span>
          </div>

          {/* title */}
          <h3 className="text-base font-semibold text-white mb-2 group-hover:text-electric-blue transition-colors font-[family-name:var(--font-display)] tracking-tight leading-snug">
            {post.title}
          </h3>

          {/* excerpt */}
          <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>

          {/* footer meta */}
          <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(post.datePublished)}</span>
            <span className="flex items-center gap-1.5">
              {post.readingTime} min read
              <svg
                className={`w-3.5 h-3.5 ${a.text} opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
