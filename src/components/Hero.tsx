import { useState, useEffect } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Lock,
  RefreshCw,
} from 'lucide-react';

interface HeroProps {
  onTryNow: () => void;
  onLearnMore: () => void;
}

export function Hero({ onTryNow, onLearnMore }: HeroProps) {
  // Stat counters
  const stat1 = useCountUp({ end: 587, duration: 2000 });
  const stat2 = useCountUp({ end: 94, duration: 1800 });
  const stat3 = useCountUp({ end: 18.4, decimals: 1, duration: 1600 });

  // Hero interactive animation state: sweeps across QR code, then decodes
  const [scanStep, setScanStep] = useState<'scanning' | 'locked' | 'resolved'>('scanning');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setScanStep('locked');
    }, 2200);

    const timer2 = setTimeout(() => {
      setScanStep('resolved');
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleRestartDemo = () => {
    setScanStep('scanning');
    setTimeout(() => setScanStep('locked'), 2000);
    setTimeout(() => setScanStep('resolved'), 3400);
  };

  return (
    <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Eyebrow badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E5DC] text-xs font-semibold text-[#4338CA] paper-shadow">
            <span className="w-2 h-2 rounded-full bg-[#B91C1C] animate-pulse" />
            <span>Active Threat Advisory — Quishing on Physical Infrastructure</span>
          </div>
        </div>

        {/* Main 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] leading-[1.12] tracking-tight">
              Don't Let a Sticker{' '}
              <span className="hand-drawn-underline text-[#B91C1C]">Steal Your Bank</span>{' '}
              Account.
            </h1>

            <p className="text-lg sm:text-xl text-[#61615B] leading-relaxed max-w-xl">
              QR codes on parking meters, restaurant tables, and postal slips are now a premier vector
              for credential harvesting. <strong className="text-[#1A1A1A] font-semibold">QRShield</strong>{' '}
              safely extracts and deterministically audits the underlying link before your browser ever connects.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onTryNow}
                id="hero-try-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#4338CA] text-white font-semibold text-sm hover:bg-[#3730A3] active:scale-[0.98] transition-all paper-shadow cursor-pointer"
              >
                <span>Try Live Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onLearnMore}
                id="hero-learn-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-[#E5E5DC] text-[#1A1A1A] font-semibold text-sm hover:bg-[#F4F4F0] active:scale-[0.98] transition-all paper-shadow cursor-pointer"
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Stat Counters Row */}
            <div className="pt-8 border-t border-[#E5E5DC] grid grid-cols-3 gap-4 sm:gap-6">
              <div ref={stat1.elementRef} className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A] font-mono">
                  +{stat1.count}%
                </div>
                <p className="text-xs sm:text-sm text-[#61615B] leading-snug">
                  Quishing attacks reported since 2023
                </p>
              </div>

              <div ref={stat2.elementRef} className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A] font-mono">
                  {stat2.count}%
                </div>
                <p className="text-xs sm:text-sm text-[#61615B] leading-snug">
                  Of mobile users never verify decoded URLs
                </p>
              </div>

              <div ref={stat3.elementRef} className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#B91C1C] font-mono">
                  {stat3.count}s
                </div>
                <p className="text-xs sm:text-sm text-[#61615B] leading-snug">
                  Average time to credential harvest on rogue meters
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Self-Scanning Hero Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-full bg-white rounded-2xl border border-[#E5E5DC] p-5 sm:p-6 paper-shadow">
              {/* Header of Scanner Frame */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#E5E5DC]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
                  <span className="text-xs font-mono font-medium text-[#61615B]">
                    OPTICAL_VIEWFINDER // AUTO-RESOLVE
                  </span>
                </div>
                <button
                  onClick={handleRestartDemo}
                  title="Re-run hero simulation"
                  className="text-xs text-[#61615B] hover:text-[#1A1A1A] flex items-center gap-1 font-mono transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Replay
                </button>
              </div>

              {/* Viewfinder stage with decreased aspect ratio to fit width */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl bg-[#FAFAF8] border border-[#E5E5DC] p-4 sm:p-5 flex items-center justify-center overflow-hidden">
                {/* Corner bracket viewfinder overlays */}
                <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#4338CA]" />
                <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#4338CA]" />
                <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#4338CA]" />
                <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#4338CA]" />

                {/* Simulated Real QR Grid */}
                <div
                  className={`relative p-2.5 bg-white rounded-lg border border-[#E5E5DC] transition-transform duration-500 ${
                    scanStep === 'locked' ? 'scale-105 border-[#B91C1C]' : ''
                  }`}
                >
                  <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-36 sm:h-36 text-[#1A1A1A]">
                    {/* Corner 1 Top Left */}
                    <rect x="10" y="10" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="19" y="19" width="12" height="12" fill="currentColor" />

                    {/* Corner 2 Top Right */}
                    <rect x="80" y="10" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="89" y="19" width="12" height="12" fill="currentColor" />

                    {/* Corner 3 Bottom Left */}
                    <rect x="10" y="80" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="19" y="89" width="12" height="12" fill="currentColor" />

                    {/* Data Matrix Dots representing a phishing sticker payload */}
                    <rect x="48" y="14" width="8" height="8" fill="currentColor" />
                    <rect x="62" y="14" width="8" height="8" fill="currentColor" />
                    <rect x="48" y="28" width="8" height="8" fill="currentColor" />
                    <rect x="58" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="72" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="20" y="48" width="8" height="8" fill="currentColor" />
                    <rect x="34" y="48" width="8" height="8" fill="currentColor" />
                    <rect x="48" y="48" width="8" height="8" fill="currentColor" />
                    <rect x="62" y="48" width="8" height="8" fill="currentColor" />
                    <rect x="76" y="48" width="8" height="8" fill="currentColor" />
                    <rect x="90" y="48" width="8" height="8" fill="currentColor" />
                    <rect x="14" y="62" width="8" height="8" fill="currentColor" />
                    <rect x="38" y="62" width="8" height="8" fill="currentColor" />
                    <rect x="58" y="62" width="8" height="8" fill="currentColor" />
                    <rect x="82" y="62" width="8" height="8" fill="currentColor" />
                    <rect x="48" y="76" width="8" height="8" fill="currentColor" />
                    <rect x="68" y="76" width="8" height="8" fill="currentColor" />
                    <rect x="88" y="76" width="8" height="8" fill="currentColor" />
                    <rect x="48" y="94" width="8" height="8" fill="currentColor" />
                    <rect x="62" y="94" width="8" height="8" fill="currentColor" />
                    <rect x="76" y="94" width="8" height="8" fill="currentColor" />
                    <rect x="94" y="94" width="8" height="8" fill="currentColor" />
                  </svg>

                  {/* Physical sticker tag badge overlay */}
                  <div className="absolute -top-3 -right-3 bg-[#B91C1C] text-white text-[10px] font-mono px-2 py-0.5 rounded shadow">
                    COUNTERFEIT STICKER
                  </div>
                </div>

                {/* Animated Scan Line Sweep */}
                {scanStep === 'scanning' && (
                  <div className="absolute left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[#4338CA] to-transparent animate-scanline pointer-events-none shadow-[0_0_12px_#4338CA]" />
                )}

                {/* Locked Focus Flash */}
                {scanStep === 'locked' && (
                  <div className="absolute inset-4 rounded-xl border-2 border-[#B91C1C] bg-[#B91C1C]/10 flex items-center justify-center animate-pulse">
                    <span className="bg-[#B91C1C] text-white px-3 py-1 rounded text-xs font-mono font-semibold">
                      LOCKED ON PAYLOAD
                    </span>
                  </div>
                )}

                {/* Resolved Result Tooltip Overlay */}
                {scanStep === 'resolved' && (
                  <div className="absolute inset-x-4 bottom-4 p-3.5 bg-white/95 backdrop-blur-md rounded-xl border border-[#B91C1C] shadow-lg transition-all transform animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-md bg-[#B91C1C]/10 text-[#B91C1C] shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#B91C1C] font-mono uppercase tracking-wide">
                            CRITICAL THREAT BLOCKED
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#B91C1C]/10 text-[#B91C1C] rounded">
                            Score 85/100
                          </span>
                        </div>
                        <p className="text-xs font-mono text-[#1A1A1A] truncate">
                          http://city-parking-pay.top/meter/pay...
                        </p>
                        <p className="text-[11px] text-[#61615B] leading-tight">
                          Counterfeit parking overlay detected. Bypasses SSL on high-churn TLD.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status footer under scanner */}
              <div className="mt-4 flex items-center justify-between text-xs text-[#61615B] font-mono">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      scanStep === 'resolved'
                        ? 'bg-[#B91C1C]'
                        : scanStep === 'locked'
                        ? 'bg-[#EAB308]'
                        : 'bg-[#4338CA] animate-pulse'
                    }`}
                  />
                  {scanStep === 'scanning' && 'Scanning optical matrix...'}
                  {scanStep === 'locked' && 'Extracting embedded URL...'}
                  {scanStep === 'resolved' && 'Threat analysis complete'}
                </span>
                <span className="text-[#1A1A1A] font-semibold">Pre-Execution Shield</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
