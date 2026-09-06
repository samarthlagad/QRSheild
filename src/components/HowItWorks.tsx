import { Camera, Binary, ShieldCheck, Search, AlertCircle, ArrowDown } from 'lucide-react';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-[#E5E5DC] bg-white/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono uppercase tracking-wider text-[#4338CA] font-semibold">
            Inspection Pipeline
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#1A1A1A] mt-2 mb-4 tracking-tight">
            How QRShield Neutralizes Quishing
          </h2>
          <p className="text-[#61615B] text-base sm:text-lg">
            Standard smartphone cameras execute QR redirects blindly. QRShield decouples the decode
            from the dispatch, running client-side heuristics in milliseconds.
          </p>
        </div>

        {/* 3-Step Sequence with Progressive Connector Line */}
        <div className="relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[2px] -translate-y-12 bg-gradient-to-r from-[#4338CA] via-[#E5E5DC] to-[#B91C1C] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-[#E5E5DC] p-6 paper-shadow paper-shadow-hover transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#4338CA]/10 text-[#4338CA] flex items-center justify-center border border-[#4338CA]/20">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-[#E5E5DC]">01</span>
                </div>

                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 tracking-tight">
                  1. Scan or Upload
                </h3>

                <p className="text-sm text-[#61615B] leading-relaxed mb-4">
                  Stream live video through your device camera or drop an image file. The engine
                  identifies finder patterns and extracts the raw payload safely without triggering any HTTP web request.
                </p>
              </div>

              {/* Visual Micro-Card */}
              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] font-mono text-xs text-[#61615B] space-y-1.5">
                <div className="flex justify-between items-center text-[11px] text-[#1A1A1A] font-semibold">
                  <span>INPUT INGESTION</span>
                  <span className="text-[#4338CA]">Client-Only</span>
                </div>
                <div className="text-[11px] truncate text-[#1A1A1A]">
                  📷 Live Feed / 🖼️ File Drop / 🔗 Raw
                </div>
                <div className="text-[10px] text-[#61615B]">No remote socket created</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-[#E5E5DC] p-6 paper-shadow paper-shadow-hover transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A1A]/5 text-[#1A1A1A] flex items-center justify-center border border-[#E5E5DC]">
                    <Binary className="w-6 h-6 text-[#1A1A1A]" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-[#E5E5DC]">02</span>
                </div>

                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 tracking-tight">
                  2. Deep Link Analysis
                </h3>

                <p className="text-sm text-[#61615B] leading-relaxed mb-4">
                  Deterministic local algorithms inspect the payload: raw IP addresses, lookalike typosquatting domains, high-risk TLDs (.xyz, .top), URL shorteners, and coercive urgency parameters.
                </p>
              </div>

              {/* Visual Micro-Card */}
              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] font-mono text-xs text-[#61615B] space-y-1">
                <div className="flex justify-between items-center text-[11px] text-[#1A1A1A] font-semibold">
                  <span>HEURISTIC MATRIX</span>
                  <span className="text-amber-600">8 Vector Audits</span>
                </div>
                <div className="text-[10px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>• Raw IP Detection</span>
                    <span className="text-[#B91C1C] font-semibold">Critical</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Typosquat Impersonation</span>
                    <span className="text-[#B91C1C] font-semibold">Critical</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Shortener Cloaking</span>
                    <span className="text-amber-600 font-semibold">Suspicious</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-[#E5E5DC] p-6 paper-shadow paper-shadow-hover transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#B91C1C]/10 text-[#B91C1C] flex items-center justify-center border border-[#B91C1C]/20">
                    <ShieldCheck className="w-6 h-6 text-[#B91C1C]" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-[#E5E5DC]">03</span>
                </div>

                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 tracking-tight">
                  3. Instant Verdict
                </h3>

                <p className="text-sm text-[#61615B] leading-relaxed mb-4">
                  Receive a clear 0–100 risk score and verdict: <strong className="text-emerald-700">Safe</strong>,{' '}
                  <strong className="text-amber-700">Suspicious</strong>, or{' '}
                  <strong className="text-[#B91C1C]">Critical</strong> with itemized forensic evidence and actionable defensive steps.
                </p>
              </div>

              {/* Visual Micro-Card */}
              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] font-mono text-xs text-[#61615B] space-y-1.5">
                <div className="flex justify-between items-center text-[11px] text-[#1A1A1A] font-semibold">
                  <span>SCORING VERDICT</span>
                  <span className="text-emerald-700 font-bold">Safe / Threat</span>
                </div>
                <div className="w-full bg-[#E5E5DC] h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-[#B91C1C] w-full h-full" />
                </div>
                <div className="flex justify-between text-[9px] text-[#61615B]">
                  <span>0 (Secure)</span>
                  <span>50 (Suspicious)</span>
                  <span>100 (Quish)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
