/**
 * Pre-build script: regenerates public/sitemap.xml from the blog/calculator
 * data so it stays in sync. Designed to NEVER fail the build — if anything
 * goes wrong, it logs a warning and exits 0, leaving the committed
 * public/sitemap.xml in place as a fallback.
 *
 * Run with: node scripts/generate-sitemap.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://frankcalculator.com';

try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const projectRoot = resolve(__dirname, '..');
  const today = new Date().toISOString().split('T')[0];

  const calculatorSlugs = [
    'personal-loan',
    'compound-interest',
    'debt-payoff',
    'business-loan',
    'credit-card-payoff',
    'sip',
    'retirement',
    'workers-compensation',
  ];

  const postFiles = [
    'posts-workers-comp.ts',
    'posts-loans.ts',
    'posts-credit-debt.ts',
    'posts-investing.ts',
    'posts-retirement.ts',
    'posts-personal-finance.ts',
  ];

  const libBlog = join(projectRoot, 'src', 'lib', 'blog');
  const blogSlugs = [];
  for (const file of postFiles) {
    const content = readFileSync(join(libBlog, file), 'utf-8');
    const matches = content.matchAll(/^\s{4}slug:\s*'([^']+)'/gm);
    for (const m of matches) blogSlugs.push(m[1]);
  }

  const infoPages = ['/about', '/contact', '/privacy', '/terms', '/disclaimer'];

  const urlEntry = (loc, priority, changefreq) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const urls = [
    urlEntry(`${SITE_URL}/`, '1.0', 'weekly'),
    ...calculatorSlugs.map((s) => urlEntry(`${SITE_URL}/calculators/${s}`, '0.9', 'monthly')),
    urlEntry(`${SITE_URL}/blog`, '0.8', 'weekly'),
    ...blogSlugs.map((s) => urlEntry(`${SITE_URL}/blog/${s}`, '0.7', 'monthly')),
    ...infoPages.map((p) => urlEntry(`${SITE_URL}${p}`, '0.4', 'yearly')),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

  const outPath = join(projectRoot, 'public', 'sitemap.xml');
  writeFileSync(outPath, xml);
  console.log(
    `[sitemap] Generated ${blogSlugs.length} blog posts, ${calculatorSlugs.length} calculators, ${infoPages.length} info pages`,
  );
} catch (err) {
  // Never block the build over the sitemap — the committed public/sitemap.xml
  // remains as a fallback.
  console.warn('[sitemap] Skipped regeneration (using committed sitemap.xml):', err?.message ?? err);
  process.exit(0);
}
