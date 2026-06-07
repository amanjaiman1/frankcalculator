'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';

/* =========================================================================
 * FrankCalculator — premium route-transition system
 *
 * Clicking ANY internal page link triggers a branded "slat" curtain:
 *   1. cover  — vertical panels sweep up to cover the screen (staggered),
 *               the logo + shimmer hold for a beat (the intentional delay),
 *   2. (the router navigates underneath while fully covered),
 *   3. reveal — the panels sweep away, uncovering the new page.
 *
 * A single document-level capture listener intercepts every internal <a>
 * click, so this applies to every link site-wide without touching components.
 * Same-page anchors, external links, downloads, new-tab and modified clicks
 * are left to the browser. Respects prefers-reduced-motion.
 * ===================================================================== */

type Phase = 'idle' | 'cover' | 'reveal';

const SLATS = 6;
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SLAT_DURATION = 0.5;
const STAGGER = 0.05;
const HOLD_MS = 240; // branded pause while fully covered, before navigating

const containerVariants: Variants = {
  initial: {},
  cover: { transition: { staggerChildren: STAGGER } },
  reveal: { transition: { staggerChildren: STAGGER } },
};

const slatVariants: Variants = {
  initial: { y: '105%' },
  cover: { y: '0%', transition: { duration: SLAT_DURATION, ease: EASE } },
  reveal: { y: '-105%', transition: { duration: SLAT_DURATION, ease: EASE } },
};

const brandVariants: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 8 },
  cover: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: 0.3, duration: 0.4, ease: 'easeOut' },
  },
  reveal: {
    opacity: 0,
    scale: 1.06,
    y: -8,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

interface TransitionContextValue {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

/** Optional hook for programmatic transitions (e.g. router.push replacements). */
export function usePageTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('usePageTransition must be used within PageTransitionProvider');
  return ctx;
}

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>('idle');
  const phaseRef = useRef<Phase>('idle');
  const pendingPath = useRef<string | null>(null);
  const pendingDest = useRef<string | null>(null);
  const reduced = useRef(false);
  const holdTimer = useRef<number | null>(null);
  const safetyTimer = useRef<number | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const clearTimers = useCallback(() => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
    holdTimer.current = null;
    safetyTimer.current = null;
  }, []);

  const navigate = useCallback(
    (href: string) => {
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      const dest = url.pathname + url.search + url.hash;

      // Same page (no hash) → nothing to do.
      if (url.pathname === window.location.pathname && !url.hash) return;

      // Reduced motion → navigate immediately, no curtain.
      if (reduced.current) {
        router.push(dest);
        return;
      }

      if (phaseRef.current !== 'idle') return;

      pendingPath.current = url.pathname;
      pendingDest.current = dest;
      try {
        router.prefetch?.(dest);
      } catch {
        /* prefetch is best-effort */
      }
      setPhase('cover');
    },
    [router],
  );

  /* Global link interception (capture phase, before React/Next handlers). */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a');
      if (!anchor) return;
      if (anchor.dataset.noTransition !== undefined) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      const targetAttr = anchor.getAttribute('target');
      if (targetAttr && targetAttr !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const rel = anchor.getAttribute('rel') ?? '';
      if (rel.includes('external')) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Only handle same-origin http(s) navigations.
      if (url.origin !== window.location.origin) return;
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

      const samePath = url.pathname === window.location.pathname;
      // Same-page anchor → let the browser smooth-scroll.
      if (url.hash && samePath) return;
      // Same page, no hash → just block the reload.
      if (samePath && !url.hash) {
        e.preventDefault();
        return;
      }

      // Take over: stop Next's client navigation and run our curtain.
      e.preventDefault();
      e.stopPropagation();
      navigate(url.pathname + url.search + url.hash);
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  /* When the route actually changes to our target, sweep the curtain away.
   * We track the "origin" pathname at time of navigation start so we only
   * reveal when the pathname genuinely transitions FROM the origin TO the
   * pending destination (avoids false matches when pathname hasn't changed yet). */
  const originPath = useRef<string | null>(null);

  useEffect(() => {
    if (phase !== 'cover' && phase !== 'reveal') {
      originPath.current = pathname;
    }
  }, [pathname, phase]);

  useEffect(() => {
    if (
      phase === 'cover' &&
      pendingPath.current &&
      pathname === pendingPath.current &&
      pathname !== originPath.current
    ) {
      setPhase('reveal');
    }
  }, [pathname, phase]);

  useEffect(() => clearTimers, [clearTimers]);

  const handleSlatsComplete = useCallback(
    (definition: unknown) => {
      if (definition === 'cover') {
        // Hold on the branded screen briefly, then navigate underneath.
        holdTimer.current = window.setTimeout(() => {
          if (pendingDest.current) {
            router.push(pendingDest.current);
          }
          // Safety net: if the route never resolves (or same-path edge case),
          // force reveal after a generous timeout.
          safetyTimer.current = window.setTimeout(() => {
            if (phaseRef.current === 'cover') {
              // If pathname still hasn't changed, force a hard navigation.
              if (pendingDest.current && pendingDest.current !== window.location.pathname) {
                window.location.href = pendingDest.current;
              }
              setPhase('reveal');
            }
          }, 3000);
        }, HOLD_MS);
      } else if (definition === 'reveal') {
        clearTimers();
        pendingPath.current = null;
        pendingDest.current = null;
        setPhase('idle');
      }
    },
    [router, clearTimers],
  );

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning: phase !== 'idle' }}>
      {children}

      {phase !== 'idle' && (
        <div className="fixed inset-0 z-[200] overflow-hidden" aria-hidden="true">
          {/* Slat curtain */}
          <motion.div
            className="absolute inset-0 flex"
            variants={containerVariants}
            initial="initial"
            animate={phase}
            onAnimationComplete={handleSlatsComplete}
          >
            {Array.from({ length: SLATS }).map((_, i) => (
              <motion.div
                key={i}
                className="relative h-full flex-1"
                variants={slatVariants}
                style={{
                  background:
                    'linear-gradient(180deg, #0c0c16 0%, #07070b 60%, #050509 100%)',
                  boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.03)',
                }}
              >
                {/* glowing leading edge */}
                <span
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(0,212,255,0.45), transparent)',
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Ambient brand glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[40rem] h-[40rem] max-w-[80vw] max-h-[80vw] rounded-full bg-electric-blue/10 blur-[120px]" />
          </div>

          {/* Brand mark + shimmer */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            variants={brandVariants}
            initial="initial"
            animate={phase}
          >
            <div className="relative">
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-electric-blue to-neon-green blur-2xl opacity-50" />
              <span className="relative flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-to-br from-electric-blue via-accent-cyan to-neon-green text-3xl font-bold text-dark-base font-[family-name:var(--font-display)] shadow-2xl">
                F
              </span>
            </div>

            <div className="mt-5 text-lg font-bold tracking-tight text-white font-[family-name:var(--font-display)]">
              Frank<span className="font-normal text-gray-500">Calculator</span>
            </div>

            <div className="mt-4 h-0.5 w-28 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-electric-blue to-neon-green"
                animate={{ x: ['-110%', '230%'] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </TransitionContext.Provider>
  );
}
