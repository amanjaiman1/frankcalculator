import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalShell, H2, P, UL } from '@/components/legal/LegalShell';
import { SITE_NAME, SITE_EMAIL, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The terms and conditions for using ${SITE_NAME} — acceptable use, intellectual property, disclaimers, and limitation of liability.`,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms of Service"
      intro={`These terms govern your use of ${SITE_NAME}. By accessing or using the site, you agree to them.`}
      updated="June 7, 2026"
    >
      <H2>Acceptance of terms</H2>
      <P>
        By accessing {SITE_URL} (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Service and our{' '}
        <Link href="/privacy" className="text-electric-blue hover:underline">Privacy Policy</Link>. If you do
        not agree, please do not use the Site.
      </P>

      <H2>Use of the site</H2>
      <UL
        items={[
          'You may use our calculators and content for your own personal, non-commercial purposes.',
          'You agree not to misuse the Site, interfere with its operation, attempt to gain unauthorized access, or use automated means to scrape or overload it.',
          'You will not use the Site for any unlawful purpose or in any way that could damage, disable or impair it.',
        ]}
      />

      <H2>No professional advice</H2>
      <P>
        {SITE_NAME} provides educational tools and general information only. It is not financial, investment,
        legal, tax, or other professional advice, and no client or advisory relationship is created by your
        use of the Site. Always consult a qualified professional before making decisions. See our full{' '}
        <Link href="/disclaimer" className="text-electric-blue hover:underline">disclaimer</Link>.
      </P>

      <H2>Accuracy of results</H2>
      <P>
        Our calculators rely on the inputs you provide and on standard formulas and assumptions. Results are
        estimates for illustration only and may differ from real-world figures, which depend on actual terms,
        rates, fees, taxes and other factors. We do not warrant that results are accurate, complete or
        suitable for your situation.
      </P>

      <H2>Intellectual property</H2>
      <P>
        The Site&rsquo;s design, text, calculators and original content are owned by {SITE_NAME} or its licensors
        and are protected by applicable laws. You may not copy, reproduce, republish or distribute our content
        without permission, except for normal personal use of the Site.
      </P>

      <H2>Third-party content and ads</H2>
      <P>
        The Site displays third-party advertising (including Google AdSense) and may link to third-party
        sites. We do not control and are not responsible for third-party content, products, services or
        privacy practices. Your dealings with third parties are solely between you and them.
      </P>

      <H2>Disclaimer of warranties</H2>
      <P>
        The Site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, whether express or
        implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not
        guarantee that the Site will be uninterrupted, secure or error-free.
      </P>

      <H2>Limitation of liability</H2>
      <P>
        To the fullest extent permitted by law, {SITE_NAME} and its contributors will not be liable for any
        indirect, incidental, special, consequential or punitive damages, or any loss arising from your use of
        — or inability to use — the Site or reliance on its content or calculator results.
      </P>

      <H2>Changes to the site and terms</H2>
      <P>
        We may modify, suspend or discontinue any part of the Site at any time, and we may update these terms
        from time to time. Continued use of the Site after changes take effect constitutes acceptance of the
        revised terms.
      </P>

      <H2>Governing terms</H2>
      <P>
        These terms constitute the entire agreement between you and {SITE_NAME} regarding the Site. If any
        provision is found unenforceable, the remaining provisions will remain in full effect.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about these terms? Email{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="text-electric-blue hover:underline">{SITE_EMAIL}</a>.
      </P>
    </LegalShell>
  );
}
