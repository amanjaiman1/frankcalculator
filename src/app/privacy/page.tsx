import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalShell, H2, P, UL } from '@/components/legal/LegalShell';
import { SITE_NAME, SITE_EMAIL, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} handles data, cookies and third-party advertising (including Google AdSense), plus your privacy choices under GDPR and CCPA.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`This policy explains what information ${SITE_NAME} collects, how it is used, the role of cookies and advertising partners, and the choices you have.`}
      updated="June 7, 2026"
    >
      <H2>Overview</H2>
      <P>
        {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website at {SITE_URL}. We respect your privacy and
        keep data collection to a minimum. Our calculators run in your browser, and we do not require you to
        create an account or submit personal financial details to use them. By using the site, you agree to
        the practices described in this policy.
      </P>

      <H2>Information we collect</H2>
      <UL
        items={[
          'Calculator inputs: the numbers you enter into our calculators are processed in your browser to show results. We do not require accounts and do not store these figures on our servers.',
          'Contact information: if you email us or use the contact form, we receive the details you choose to share (such as your name, email address and message) so we can respond.',
          'Usage and log data: like most websites, our hosting and analytics may automatically collect standard technical data such as your IP address, browser type, device, referring pages and the pages you visit.',
          'Cookies and similar technologies: small files stored on your device that help the site function and that our advertising and analytics partners may use (see below).',
        ]}
      />

      <H2>How we use information</H2>
      <UL
        items={[
          'To operate, maintain and improve the website and its calculators.',
          'To respond to your enquiries and feedback.',
          'To understand how the site is used so we can make it better.',
          'To display advertising that helps keep the site free.',
          'To comply with legal obligations and protect against misuse.',
        ]}
      />

      <H2>Cookies</H2>
      <P>
        Cookies and similar technologies help the site remember preferences (such as your cookie-consent
        choice), measure traffic, and serve ads. You can control or delete cookies through your browser
        settings; disabling some cookies may affect how parts of the site work.
      </P>

      <H2>Advertising and Google AdSense</H2>
      <P>
        We use third-party advertising companies, including Google, to serve ads when you visit the site.
        These companies may use cookies and similar technologies to show ads based on your prior visits to
        this and other websites.
      </P>
      <UL
        items={[
          'Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.',
          'Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the internet.',
          'You may opt out of personalized advertising by visiting Google’s Ads Settings, and you can opt out of a third-party vendor’s use of cookies for personalized advertising via the relevant industry opt-out pages.',
          'Where required, ads may be served on a non-personalized basis, which still uses cookies for purposes such as frequency capping, aggregated reporting and fraud prevention.',
        ]}
      />
      <P>
        For more information about how Google uses data when you use our partners&rsquo; sites or apps, see
        Google&rsquo;s &ldquo;How Google uses information from sites or apps that use our services&rdquo; page, and you can
        manage ad personalization at{' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
          google.com/settings/ads
        </a>{' '}
        or{' '}
        <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
          aboutads.info
        </a>.
      </P>

      <H2>Analytics</H2>
      <P>
        We may use privacy-respecting analytics to understand aggregate traffic patterns. Any such provider
        processes data on our behalf to help us improve the site and does not use it to personally identify you.
      </P>

      <H2>How we share information</H2>
      <P>
        We do not sell your personal information. We share data only with service providers who help us run
        the site (such as hosting, analytics and advertising partners), or when required by law. These
        providers are expected to handle data in line with applicable privacy laws.
      </P>

      <H2>Your privacy choices and rights</H2>
      <UL
        items={[
          'Cookie controls: adjust or clear cookies in your browser at any time, and use the consent notice shown on the site.',
          'Ad personalization: opt out via Google Ads Settings and industry opt-out tools linked above.',
          'GDPR (EEA/UK): you may have rights to access, correct, delete, restrict or object to processing of your personal data, and to data portability.',
          'CCPA (California): you may have rights to know, delete, and opt out of the “sale” or “sharing” of personal information. We do not sell personal information.',
        ]}
      />
      <P>
        To exercise any of these rights, contact us at{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="text-electric-blue hover:underline">{SITE_EMAIL}</a>.
      </P>

      <H2>Data retention and security</H2>
      <P>
        We keep contact correspondence only as long as needed to address your enquiry and meet legal
        requirements. We take reasonable measures to protect information, though no method of transmission or
        storage over the internet is completely secure.
      </P>

      <H2>Children&rsquo;s privacy</H2>
      <P>
        Our site is intended for a general, adult audience and is not directed to children under 13 (or the
        equivalent minimum age in your jurisdiction). We do not knowingly collect personal information from
        children.
      </P>

      <H2>Third-party links</H2>
      <P>
        Our content may link to third-party websites. We are not responsible for the privacy practices of
        those sites and encourage you to review their policies.
      </P>

      <H2>Changes to this policy</H2>
      <P>
        We may update this Privacy Policy from time to time. We will revise the &ldquo;Last updated&rdquo; date above
        when we do, and significant changes will be reflected on this page.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about this policy? Email us at{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="text-electric-blue hover:underline">{SITE_EMAIL}</a>{' '}
        or visit our{' '}
        <Link href="/contact" className="text-electric-blue hover:underline">contact page</Link>.
      </P>
    </LegalShell>
  );
}
