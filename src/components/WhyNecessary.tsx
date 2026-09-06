import {
  AlertOctagon,
  Shield,
  Layers,
  EyeOff,
  UserCheck,
  CheckCircle,
  FileWarning,
  Flame,
  ArrowRight
} from 'lucide-react';

export function WhyNecessary() {
  return (
    <section id="why-necessary" className="py-20 md:py-28 border-t border-[#E5E5DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#B91C1C] font-semibold">
            Threat Landscape Analysis
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#1A1A1A] mt-2 mb-4 tracking-tight">
            Why Physical Quishing Is Breaking Traditional Cybersecurity
          </h2>
          <p className="text-[#61615B] text-base sm:text-lg">
            Traditional email spam filters and endpoint web protections never see a physical sticker pasted over a public meter. The threat lives in the real world.
          </p>
        </div>

        {/* 3 Challenge / Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl border border-[#E5E5DC] p-6 paper-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#B91C1C]/10 text-[#B91C1C] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-[#B91C1C] font-semibold uppercase mb-1">
              Challenge 01
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Physical Tampering
            </h3>
            <p className="text-sm text-[#61615B] leading-relaxed">
              Threat actors mass-print high-gloss vinyl decals with identical brand styling and affix them over genuine parking meters, EV chargers, and transit stations overnight.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5DC] p-6 paper-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#4338CA]/10 text-[#4338CA] flex items-center justify-center mb-4">
              <EyeOff className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-[#4338CA] font-semibold uppercase mb-1">
              Challenge 02
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              No Visual Warning
            </h3>
            <p className="text-sm text-[#61615B] leading-relaxed">
              Unlike plaintext hyperlinks, humans cannot read optical 2D matrix dot patterns. Malicious lookalike domains and raw IPs look completely identical to safe websites to the naked eye.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5DC] p-6 paper-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-[#1A1A1A] font-semibold uppercase mb-1">
              Challenge 03
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Trust Exploitation
            </h3>
            <p className="text-sm text-[#61615B] leading-relaxed">
              Post-pandemic society conditioned millions of citizens to trust table tents, menu QR codes, and postal slips implicitly. Attackers exploit this muscle memory without triggering suspicion.
            </p>
          </div>
        </div>

        {/* Asymmetric Two-Column Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: The Problem (Real-World Quishing Scenarios) */}
          <div className="lg:col-span-6 bg-[#FAFAF8] rounded-2xl border border-[#E5E5DC] p-6 sm:p-8 flex flex-col justify-between paper-shadow">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 rounded bg-[#B91C1C]/10 text-[#B91C1C]">
                  <AlertOctagon className="w-5 h-5" />
                </span>
                <h3 className="font-serif-heading text-2xl text-[#1A1A1A]">
                  The Attack Vectors
                </h3>
              </div>
              <p className="text-sm text-[#61615B] mb-6">
                How attackers exploit physical convenience to breach mobile devices:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-[#E5E5DC] text-sm">
                  <div className="font-semibold text-[#1A1A1A] flex items-center justify-between mb-1">
                    <span>1. Parking Meter Sticker Overlays</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#B91C1C]/10 text-[#B91C1C] rounded">
                      High Impact
                    </span>
                  </div>
                  <p className="text-xs text-[#61615B]">
                    Fake QR codes placed over city pay terminals directing victims to clone sites that steal credit card data and billing addresses while the victim receives a parking citation.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E5E5DC] text-sm">
                  <div className="font-semibold text-[#1A1A1A] flex items-center justify-between mb-1">
                    <span>2. Counterfeit Restaurant Table Codes</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#B91C1C]/10 text-[#B91C1C] rounded">
                      Credential Skimming
                    </span>
                  </div>
                  <p className="text-xs text-[#61615B]">
                    Adhesive QR codes swapped on outdoor patio tables promising "Quick Bill Pay" or "Free Wi-Fi" that harvest email/password combinations or install rogue web profiles.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E5E5DC] text-sm">
                  <div className="font-semibold text-[#1A1A1A] flex items-center justify-between mb-1">
                    <span>3. Phishing Package Redelivery Slips</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#B91C1C]/10 text-[#B91C1C] rounded">
                      Doorstep Fraud
                    </span>
                  </div>
                  <p className="text-xs text-[#61615B]">
                    Printed faux postal slips placed in mailboxes or taped to apartment doors claiming a missed delivery requires a $1.50 redelivery fee via a rogue QR link.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E5E5DC] text-sm">
                  <div className="font-semibold text-[#1A1A1A] flex items-center justify-between mb-1">
                    <span>4. Malicious Mailed Letters & Invoices</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#B91C1C]/10 text-[#B91C1C] rounded">
                      Corporate Quishing
                    </span>
                  </div>
                  <p className="text-xs text-[#61615B]">
                    Targeted physical letters mailed to corporate executives purporting to be tax documents, benefits updates, or MFA resets requiring immediate smartphone scans.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5DC] flex items-center justify-between text-xs font-mono text-[#B91C1C]">
              <span>RISK: ZERO BROWSER INSPECTION</span>
              <span>UNFILTERED PHISHING</span>
            </div>
          </div>

          {/* Right: The Solution (How QRShield's Local Analysis Protects) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5E5DC] p-6 sm:p-8 flex flex-col justify-between paper-shadow">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 rounded bg-[#4338CA]/10 text-[#4338CA]">
                  <Shield className="w-5 h-5" />
                </span>
                <h3 className="font-serif-heading text-2xl text-[#1A1A1A]">
                  The QRShield Defense
                </h3>
              </div>
              <p className="text-sm text-[#61615B] mb-6">
                How our deterministic, privacy-first local inspection engine disarms every attack vector:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] text-sm">
                  <div className="font-semibold text-[#1A1A1A] flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Air-Gapped Optical Extraction</span>
                  </div>
                  <p className="text-xs text-[#61615B]">
                    Decodes payload data strictly in JavaScript memory on the client device. The browser never initiates a TCP handshake or DNS lookup until you approve.
                  </p>
                </div>

                <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] text-sm">
                  <div className="font-semibold text-[#1A1A1A] flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Typosquatting & Brand Spoofing Classifier</span>
                  </div>
                  <p className="text-xs text-[#61615B]">
                    Detects when a domain includes keywords like "parkmobile", "usps", or "chase" on unrelated third-party hostnames or disposable registrars.
                  </p>
                </div>

                <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] text-sm">
                  <div className="font-semibold text-[#1A1A1A] flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Raw IP & Insecure Protocol Blocker</span>
                  </div>
                  <p className="text-xs text-[#61615B]">
                    Immediately flags numeric IP destinations and unencrypted HTTP connections that legitimate municipal or commercial services would never deploy.
                  </p>
                </div>

                <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] text-sm">
                  <div className="font-semibold text-[#1A1A1A] flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Redirect Cloaking & Shortener Warnings</span>
                  </div>
                  <p className="text-xs text-[#61615B]">
                    Warns against opaque short links (bit.ly, tinyurl) used on physical stickers to camouflage the final destination from phone camera previews.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5DC] flex items-center justify-between text-xs font-mono text-[#4338CA]">
              <span>CLIENT-SIDE DETERMINISTIC LOGIC</span>
              <span>100% PRIVATE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
