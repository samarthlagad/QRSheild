import { Logo } from './Logo';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-[#E5E5DC] bg-[#FAFAF8] py-12 text-[#61615B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E5E5DC]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-3">
            <Logo size={36} />
            <p className="text-xs text-[#61615B] max-w-sm leading-relaxed">
              QRShield is an optical threat intelligence engine built to protect mobile users from physical QR tampering, brand spoofing, and malicious credential harvesting before browser execution.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#1A1A1A]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero telemetry payload retention. Local deterministic inspection.</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-mono uppercase text-[#1A1A1A] font-semibold tracking-wider mb-2">
              Navigation
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('home')}
                  className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  Home (Threat Overview)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  How It Works (Heuristic Pipeline)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('why-necessary')}
                  className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  Why It's Necessary (Attack Vectors)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('scanner-section')}
                  className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  Interactive Scanner Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contact')}
                  className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  Contact & Enterprise Pilot
                </button>
              </li>
            </ul>
          </div>

          {/* Reference & Source Links */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-mono uppercase text-[#1A1A1A] font-semibold tracking-wider mb-2">
              Threat Intelligence Sources
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <a
                  href="https://www.ic3.gov/Media/Y2022/PSA220118"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#4338CA] flex items-center gap-1 transition-colors"
                >
                  <span>FBI IC3 Public PSA: Cybercriminals Tampering with QR Codes</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cisa.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#4338CA] flex items-center gap-1 transition-colors"
                >
                  <span>CISA Alert: Social Engineering Via Quick Response Codes</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://consumer.ftc.gov/consumer-alerts/2023/12/scammers-are-using-qr-codes-steal-your-personal-information"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#4338CA] flex items-center gap-1 transition-colors"
                >
                  <span>FTC Advisory: Quishing on Parking Meters & Postal Slips</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#61615B]">
          <div>
            © {new Date().getFullYear()} QRShield Security Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>RFC 3986 Compliance</span>
            <span>•</span>
            <span>Deterministic Heuristic Engine v2.4</span>
            <span>•</span>
            <span>Zero Remote Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
