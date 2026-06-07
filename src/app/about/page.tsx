import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalShell, H2, P, UL } from '@/components/legal/LegalShell';
import { SITE_NAME, SITE_EMAIL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_NAME} — our mission to make financial math simple with free, accurate calculators and clear, no-nonsense guides.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <LegalShell
      eyebrow="About"
      title={`About ${SITE_NAME}`}
      intro={`${SITE_NAME} exists to make everyday financial decisions less intimidating — with free calculators and frank, easy-to-read guides anyone can use.`}
    >
      <H2>Our mission</H2>
      <P>
        Money decisions are too often wrapped in jargon, sales pitches and hidden fees. {SITE_NAME} was
        built to cut through that. We give you fast, accurate tools and plain-English explanations so you
        can understand a loan payment, a payoff timeline, or an investment projection in seconds — without
        signing up for anything or handing over your personal data.
      </P>

      <H2>What we offer</H2>
      <UL
        items={[
          'A growing suite of free financial calculators covering loans, debt payoff, credit cards, compound interest, SIP investing, retirement and workers’ compensation settlements.',
          'In-depth, regularly reviewed articles that explain the concepts behind each calculator in clear language.',
          'A privacy-first experience: the calculators run in your browser, and we do not require accounts or store the figures you enter.',
        ]}
      />

      <H2>How we approach our content</H2>
      <P>
        Every calculator is built on transparent, well-documented formulas, and every guide is written to be
        genuinely useful rather than to sell you something. We aim to explain the math, show worked examples,
        and answer the real questions people ask. Where figures such as contribution limits, rates or
        settlement ranges are cited, we base them on current, reputable sources and update them over time.
      </P>

      <H2>How we keep it free</H2>
      <P>
        {SITE_NAME} is free to use. To support the cost of building and maintaining the site, we display
        advertising from third parties, including Google AdSense. Ads are clearly distinguishable from our
        content, and they never influence the math behind our calculators or the substance of our guides.
        You can learn more about how advertising and cookies work on our{' '}
        <Link href="/privacy" className="text-electric-blue hover:underline">Privacy Policy</Link>.
      </P>

      <H2>Important note</H2>
      <P>
        {SITE_NAME} provides educational tools and information only. We are not a bank, lender, broker, law
        firm or financial advisory firm, and nothing on this site is financial, investment, legal or tax
        advice. Please read our full{' '}
        <Link href="/disclaimer" className="text-electric-blue hover:underline">disclaimer</Link>.
      </P>

      <H2>Get in touch</H2>
      <P>
        We welcome feedback, corrections and suggestions for new calculators. Reach us any time at{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="text-electric-blue hover:underline">{SITE_EMAIL}</a>{' '}
        or through our{' '}
        <Link href="/contact" className="text-electric-blue hover:underline">contact page</Link>.
      </P>
    </LegalShell>
  );
}
