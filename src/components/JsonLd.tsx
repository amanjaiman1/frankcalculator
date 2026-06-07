import type { JsonLdObject } from '@/lib/seo';

/**
 * Renders a JSON-LD structured-data script tag.
 * Server-safe (no 'use client'); `data` must be plain serializable data.
 */
export default function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
