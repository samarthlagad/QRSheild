import { useState, useEffect } from 'react';
import { SAMPLE_SCENARIOS } from '../../utils/sampleData';
import { SampleAttackScenario } from '../../types';
import { generateQrDataUrl } from '../../utils/qrHelper';
import { AlertTriangle, ArrowRight, ShieldCheck, QrCode, Download } from 'lucide-react';

interface ScenariosViewProps {
  onSelectScenario: (scenario: SampleAttackScenario) => void;
}

export function ScenariosView({ onSelectScenario }: ScenariosViewProps) {
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate authentic QR images for each scenario
    SAMPLE_SCENARIOS.forEach(async (sc) => {
      const dataUrl = await generateQrDataUrl(sc.url);
      setQrImages((prev) => ({ ...prev, [sc.id]: dataUrl }));
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#FAFAF8] rounded-2xl border border-[#E5E5DC] p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-[#E5E5DC] text-[#4338CA] shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1A1A1A]">
              Live Attack Template Matrix
            </h4>
            <p className="text-xs text-[#61615B] leading-relaxed mt-0.5">
              These authentic templates represent active physical quishing campaigns. You can audit them directly, download the QR image to test file upload, or point your webcam/phone camera at the codes below to test optical lock!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SAMPLE_SCENARIOS.map((scenario) => (
          <div
            key={scenario.id}
            className="bg-white rounded-2xl border border-[#E5E5DC] p-5 paper-shadow paper-shadow-hover transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span
                  className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded font-bold ${
                    scenario.expectedVerdict === 'critical'
                      ? 'bg-[#B91C1C]/10 text-[#B91C1C]'
                      : scenario.expectedVerdict === 'suspicious'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {scenario.tag}
                </span>

                <span className="text-[11px] font-mono text-[#61615B]">
                  {scenario.category}
                </span>
              </div>

              <h4 className="text-base font-semibold text-[#1A1A1A] mb-1">
                {scenario.title}
              </h4>
              <p className="text-xs text-[#61615B] leading-relaxed mb-4">
                {scenario.description}
              </p>

              {/* QR Image and Context */}
              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-white rounded-lg border border-[#E5E5DC] p-1 shrink-0 flex items-center justify-center">
                  {qrImages[scenario.id] ? (
                    <img
                      src={qrImages[scenario.id]}
                      alt={scenario.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-4 h-4 border-2 border-[#4338CA] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-mono text-[#61615B] uppercase block">
                    Physical Delivery Medium:
                  </span>
                  <span className="text-xs font-semibold text-[#1A1A1A] block truncate">
                    {scenario.physicalVector}
                  </span>
                  <span className="text-[10px] font-mono text-[#61615B] truncate block">
                    {scenario.url}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E5E5DC]">
              {qrImages[scenario.id] && (
                <a
                  href={qrImages[scenario.id]}
                  download={`qrshield-${scenario.id}.png`}
                  className="text-xs text-[#61615B] hover:text-[#1A1A1A] flex items-center gap-1 font-mono transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save QR</span>
                </a>
              )}

              <button
                onClick={() => onSelectScenario(scenario)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#4338CA] transition-all cursor-pointer ml-auto"
              >
                <span>Audit This Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
