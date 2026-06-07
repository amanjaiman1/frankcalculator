import type { Metadata } from 'next';
import { LegalShell, H2, P } from '@/components/legal/LegalShell';
import ContactForm from '@/components/ContactForm';
import { SITE_NAME, SITE_EMAIL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with the ${SITE_NAME} team. Send us feedback, corrections, partnership enquiries or suggestions for new calculators.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <LegalShell
      eyebrow="Contact"
      title="Contact Us"
      intro={`Questions, feedback, a correction, or an idea for a new calculator? We’d genuinely like to hear from you.`}
    >
      <H2>Email us directly</H2>
      <P>
        The fastest way to reach us is by email at{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="text-electric-blue hover:underline">{SITE_EMAIL}</a>.
        We read every message and aim to respond within a few business days.
      </P>

      <H2>What you can contact us about</H2>
      <P>
        We welcome feedback on our calculators and guides, reports of any errors or broken links, suggestions
        for tools you’d like us to build, accessibility concerns, and advertising or partnership enquiries.
        For anything related to your data, see our Privacy Policy.
      </P>

      <H2>Send a message</H2>
      <P>
        Use the form below and your email app will open with the details ready to send. We never store the
        information you enter here on our servers.
      </P>

      <div className="pt-2">
        <ContactForm />
      </div>
    </LegalShell>
  );
}
