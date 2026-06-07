import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { buildMetadata, softwareApplicationLd, breadcrumbLd, faqPageLd } from '@/lib/seo';

const SLUG = 'debt-payoff';

export const metadata: Metadata = buildMetadata(SLUG);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={softwareApplicationLd(SLUG)} />
      <JsonLd data={breadcrumbLd(SLUG)} />
      <JsonLd data={faqPageLd(SLUG)} />
      {children}
    </>
  );
}
