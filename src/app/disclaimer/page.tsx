import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalShell, H2, P, UL } from '@/components/legal/LegalShell';
import { SITE_NAME, SITE_EMAIL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `${SITE_NAME} provides free calculators and educational content for informational purposes only — not financial, investment, legal or tax advice.`,
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Disclaimer"
      intro={`${SITE_NAME} offers educational tools and information only. Please read this disclaimer carefully before relying on anything you find here.`}
      updated="June 7, 2026"
    >
      <H2>Informational purposes only</H2>
      <P>
        All calculators, articles and other content on {SITE_NAME} are provided for general informational and
        educational purposes only. They do not constitute financial, investment, lending, accounting, legal,
        tax or other professional advice, and should not be relied upon as a substitute for advice from a
        qualified professional who understands your individual circumstances.
      </P>

      <H2>No professional relationship</H2>
      <P>
        Using this site does not create any advisor-client, fiduciary or professional relationship between you
        and {SITE_NAME}. We are not a bank, lender, broker-dealer, investment adviser, law firm or tax
        preparer.
      </P>

      <H2>Estimates, not guarantees</H2>
      <UL
        items={[
          'Calculator results are estimates based on the inputs you provide and on standard formulas and assumptions.',
          'Actual figures depend on real-world factors such as a lender’s exact terms, interest rates, fees, taxes, market performance and your jurisdiction’s rules.',
          'Investment-related projections (such as compound interest or SIP returns) are illustrative and not promises of future performance; investments can lose value.',
          'Workers’ compensation settlement estimates are educated approximations and not legal advice or a prediction of any specific outcome.',
        ]}
      />

      <H2>Accuracy and currency of information</H2>
      <P>
        We make a good-faith effort to keep our calculators and content accurate and up to date, including
        figures such as contribution limits and typical rates. However, laws, rates and product terms change,
        and we make no warranty that all information is current, complete or error-free.
      </P>

      <H2>Third-party links and advertising</H2>
      <P>
        Our content may include links to third-party websites and displays third-party advertising, including
        Google AdSense. We do not endorse and are not responsible for third-party content, products or
        services. See our{' '}
        <Link href="/privacy" className="text-electric-blue hover:underline">Privacy Policy</Link> and{' '}
        <Link href="/terms" className="text-electric-blue hover:underline">Terms of Service</Link> for more.
      </P>

      <H2>Your responsibility</H2>
      <P>
        You are solely responsible for any decisions you make. Before acting on any result or information from
        this site, verify the details with the relevant institution and consult a qualified professional. To
        the fullest extent permitted by law, {SITE_NAME} disclaims liability for any loss arising from your use
        of the site.
      </P>

      <H2>Questions</H2>
      <P>
        If anything here is unclear, contact us at{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="text-electric-blue hover:underline">{SITE_EMAIL}</a>.
      </P>
    </LegalShell>
  );
}
