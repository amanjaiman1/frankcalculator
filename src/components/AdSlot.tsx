'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from '@/lib/seo';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * A single responsive AdSense display unit.
 *
 * Renders nothing until a valid publisher ID is configured (ADSENSE_ENABLED),
 * so the layout stays clean before approval. After you set your publisher ID
 * and create an ad unit in AdSense, pass its `slot` ID here.
 */
export default function AdSlot({
  slot,
  className = '',
  format = 'auto',
}: {
  slot: string;
  className?: string;
  format?: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_ENABLED || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* adsbygoogle not ready yet — ignore */
    }
  }, []);

  if (!ADSENSE_ENABLED) return null;

  return (
    <div className={`my-8 text-center ${className}`}>
      <span className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 mb-1">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
