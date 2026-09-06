import { useState, FormEvent } from 'react';
import { Link2, ArrowRight, ShieldAlert, CheckCircle, Sparkles } from 'lucide-react';
import { SAMPLE_SCENARIOS } from '../../utils/sampleData';

interface UrlScannerProps {
  onAnalyzeUrl: (url: string, method: 'manual') => void;
}

export function UrlScanner({ onAnalyzeUrl }: UrlScannerProps) {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please provide a URL or decoded QR payload string.');
      return;
    }
    setError(null);
    onAnalyzeUrl(trimmed, 'manual');
  };

  const handleQuickPaste = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
    setError(null);
    onAnalyzeUrl(sampleUrl, 'manual');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="qr-url-input"
            className="block text-sm font-semibold text-[#1A1A1A] mb-1.5"
          >
            Enter Decoded QR Code URL or Payload
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#61615B]">
              <Link2 className="w-5 h-5" />
            </div>
            <input
              id="qr-url-input"
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. http://city-parking-pay.top/meter/pay?urgent=true"
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5DC] rounded-xl text-sm text-[#1A1A1A] placeholder:text-[#61615B]/60 focus:outline-none focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 transition-all font-mono"
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-[#B91C1C]">{error}</p>}
        </div>

        <button
          type="submit"
          id="btn-analyze-manual"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#4338CA] text-white font-semibold text-sm hover:bg-[#3730A3] active:scale-[0.98] transition-all paper-shadow cursor-pointer"
        >
          <span>Run Deep Link Heuristics</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Select Buttons */}
      <div className="pt-4 border-t border-[#E5E5DC]">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#61615B] uppercase tracking-wider font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#4338CA]" />
          <span>Quick Test Presets:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => handleQuickPaste(scenario.url)}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E5DC] hover:border-[#4338CA] text-xs font-medium text-[#1A1A1A] hover:text-[#4338CA] transition-all paper-shadow cursor-pointer flex items-center gap-1.5"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  scenario.expectedVerdict === 'critical'
                    ? 'bg-[#B91C1C]'
                    : scenario.expectedVerdict === 'suspicious'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <span>{scenario.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
