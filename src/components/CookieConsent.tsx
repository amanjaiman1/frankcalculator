'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'fc-cookie-consent';

/**
 * Lightweight cookie/consent notice.
 *
 * Informs visitors that the site uses cookies (including third-party
 * advertising cookies via Google AdSense) and links to the Privacy Policy —
 * a best practice for AdSense and basic GDPR/ePrivacy transparency.
 *
 * Choice is stored in localStorage so the banner does not reappear.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Defer to a frame after mount so we never call setState synchronously
    // inside the effect body (and to avoid a hydration flash).
    const id = requestAnimationFrame(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        /* localStorage unavailable — fail silently */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const decide = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
      <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-dark-card/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="flex-1 text-sm text-gray-300 leading-relaxed">
            We use cookies to keep the site running and, with your consent, to serve personalized ads
            through partners like Google AdSense. See our{' '}
            <Link href="/privacy" className="text-electric-blue hover:underline">Privacy Policy</Link> for details.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => decide('declined')}
              className="px-4 py-2 text-sm rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-white/25 transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => decide('accepted')}
              className="glow-button px-5 py-2 text-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
