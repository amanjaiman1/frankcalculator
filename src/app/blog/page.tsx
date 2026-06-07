import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import BlogIndexClient from '@/components/blog/BlogIndexClient';
import {
  BLOG_INDEX_METADATA,
  BLOG_CATEGORIES,
  getPostsByDate,
  blogCollectionLd,
  blogIndexBreadcrumbLd,
} from '@/lib/blog';

export const metadata: Metadata = BLOG_INDEX_METADATA;

export default function BlogIndexPage() {
  const posts = getPostsByDate();

  return (
    <>
      <JsonLd data={blogCollectionLd()} />
      <JsonLd data={blogIndexBreadcrumbLd()} />
      <BlogIndexClient posts={posts} categories={BLOG_CATEGORIES} />
    </>
  );
}
