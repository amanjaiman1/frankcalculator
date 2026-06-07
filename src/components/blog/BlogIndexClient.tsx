'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { BlogPost, BlogCategory } from '@/lib/blog';
import BlogCard from './BlogCard';

type Filter = 'All' | BlogCategory;

export default function BlogIndexClient({
  posts,
  categories,
}: {
  posts: BlogPost[];
  categories: BlogCategory[];
}) {
  const [active, setActive] = useState<Filter>('All');

  const filters: Filter[] = ['All', ...categories];

  const visible = useMemo(
    () => (active === 'All' ? posts : posts.filter((p) => p.category === active)),
    [active, posts],
  );

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="aurora-orb top-[-20%] left-[-5%] w-[28rem] h-[28rem] bg-electric-blue/15" />
        <div className="aurora-orb top-[-10%] right-[-5%] w-[24rem] h-[24rem] bg-vivid-purple/15" style={{ animationDelay: '5s' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="eyebrow-chip text-xs uppercase tracking-[0.2em] text-electric-blue mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-glow" />
              The Frank Blog
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.02] mb-5 font-[family-name:var(--font-display)] tracking-[-0.02em]">
              <span className="text-white">Money, Explained</span>{' '}
              <span className="gradient-text">Clearly.</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              In-depth, no-nonsense guides on loans, debt, credit cards, investing, retirement and
              workers&rsquo; compensation — each paired with a free calculator so you can run your own numbers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-dark-base/70 backdrop-blur-xl border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {filters.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-electric-blue to-neon-green text-dark-base font-semibold'
                      : 'text-gray-300 border border-white/10 hover:border-electric-blue/40 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-500">
              {visible.length} article{visible.length === 1 ? '' : 's'}
              {active !== 'All' && <span className="text-gray-400"> in {active}</span>}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
