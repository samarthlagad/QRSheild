import { useState } from 'react';
import { ScanReport } from '../../types';
import { RiskGauge } from './RiskGauge';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Camera,
  Image as ImageIcon,
  Link2,
  Clock,
  Globe,
  Lock,
  Unlock,
  Sliders,
  ChevronDown,
  ChevronUp,
  Info,
  Bot,
} from 'lucide-react';

interface ScanReportViewProps {
  report: ScanReport;
  onReset: () => void;
  onScanAnother: () => void;
  onAskAi?: (report: ScanReport) => void;
}

export function ScanReportView({ report, onReset, onScanAnother, onAskAi }: ScanReportViewProps) {
  const [copied, setCopied] = useState(false);
  const [showSandboxModal, setShowSandboxModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodIcon = () => {
    switch (report.method) {
      case 'camera':
        return <Camera className="w-3.5 h-3.5 text-[#4338CA]" />;
      case 'upload':
        return <ImageIcon className="w-3.5 h-3.5 text-[#4338CA]" />;
      default:
        return <Link2 className="w-3.5 h-3.5 text-[#4338CA]" />;
    }
  };

  const methodLabel = () => {
    switch (report.method) {
      case 'camera':
        return 'Live Camera Capture';
      case 'upload':
        return 'Image Upload Decode';
      default:
        return 'Direct URL Input';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Top Banner with Verdict and Gauge */}
      <div className="bg-white rounded-2xl border border-[#E5E5DC] p-6 sm:p-8 paper-shadow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Gauge */}
          <div className="md:col-span-4 flex justify-center border-b md:border-b-0 md:border-r border-[#E5E5DC] pb-6 md:pb-0 md:pr-6">
            <RiskGauge score={report.riskScore} verdict={report.verdict} size={170} />
          </div>

          {/* Right: Verdict Summary & Metadata */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#FAFAF8] border border-[#E5E5DC] flex items-center gap-1.5 text-xs font-mono text-[#1A1A1A]">
                  {methodIcon()}
                  <span>{methodLabel()}</span>
                </span>
                {report.threatVector && (
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#B91C1C]/10 text-[#B91C1C] font-semibold">
                    {report.threatVector}
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-[#61615B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Audited in {report.scanDurationMs}ms</span>
              </div>
            </div>

            <div>
              <h3 className="font-serif-heading text-2xl sm:text-3xl text-[#1A1A1A] tracking-tight">
                {report.verdictTitle}
              </h3>
              <p className="text-sm text-[#61615B] mt-1.5 leading-relaxed">
                {report.verdictSummary}
              </p>
            </div>

            {/* Decoded URL Box with Action Buttons */}
            <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#61615B]">
                <span>RAW DECODED PAYLOAD:</span>
                <button
                  onClick={handleCopy}
                  className="hover:text-[#1A1A1A] flex items-center gap-1 text-[#4338CA] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-[#1A1A1A] break-all bg-white p-2 rounded border border-[#E5E5DC]/80 select-all">
                {report.url}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScanAnother}
                id="btn-scan-another"
                className="px-5 py-2.5 rounded-lg bg-[#4338CA] text-white font-semibold text-xs hover:bg-[#3730A3] active:scale-[0.98] transition-all paper-shadow flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan Another Code</span>
              </button>

              <button
                onClick={() => setShowSandboxModal(true)}
                className="px-4 py-2.5 rounded-lg bg-white border border-[#E5E5DC] text-[#1A1A1A] font-semibold text-xs hover:bg-[#F4F4F0] flex items-center gap-1.5 paper-shadow cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Inspect in Isolated Sandbox</span>
              </button>

              {onAskAi && (
                <button
                  onClick={() => onAskAi(report)}
                  id="btn-ask-ai-report"
                  className="px-4 py-2.5 rounded-lg bg-indigo-50/80 border border-[#4338CA]/30 text-[#4338CA] font-semibold text-xs hover:bg-indigo-100/80 flex items-center gap-1.5 paper-shadow cursor-pointer transition-all"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI Threat Advisor</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* URL Architectural Breakdown */}
      <div className="bg-white rounded-2xl border border-[#E5E5DC] p-6 paper-shadow">
        <h4 className="text-sm font-semibold text-[#1A1A1A] font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#4338CA]" />
          <span>Payload Forensic Anatomy</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC]">
            <span className="text-[10px] font-mono text-[#61615B] uppercase block mb-1">
              Protocol Security
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold">
              {report.parsedUrl.protocol === 'https' ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">HTTPS (TLS Encrypted)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-[#B91C1C]" />
                  <span className="text-[#B91C1C]">HTTP (Insecure Cleartext)</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC]">
            <span className="text-[10px] font-mono text-[#61615B] uppercase block mb-1">
              Host Destination
            </span>
            <div className="font-mono text-xs font-semibold text-[#1A1A1A] truncate" title={report.parsedUrl.hostname}>
              {report.parsedUrl.hostname}
            </div>
            {report.parsedUrl.isRawIp && (
              <span className="text-[10px] text-[#B91C1C] font-mono block mt-0.5">
                ⚠ Unresolved Direct Numeric IP
              </span>
            )}
          </div>

          <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC]">
            <span className="text-[10px] font-mono text-[#61615B] uppercase block mb-1">
              Top-Level Domain (TLD)
            </span>
            <div className="font-mono text-xs font-semibold text-[#1A1A1A]">
              .{report.parsedUrl.tld || 'none'}
            </div>
            <span
              className={`text-[10px] font-mono block mt-0.5 ${
                report.parsedUrl.isHighRiskTld ? 'text-[#B91C1C]' : 'text-[#61615B]'
              }`}
            >
              {report.parsedUrl.isHighRiskTld ? '⚠ High disposable scam churn' : 'Standard registry'}
            </span>
          </div>

          <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC]">
            <span className="text-[10px] font-mono text-[#61615B] uppercase block mb-1">
              Subdomain Entropy
            </span>
            <div className="font-mono text-xs font-semibold text-[#1A1A1A]">
              {report.parsedUrl.entropy} bits
            </div>
            <span className="text-[10px] text-[#61615B] font-mono block mt-0.5">
              {report.parsedUrl.entropy > 3.5 ? 'Algorithmic / High variance' : 'Natural naming'}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Evidence Checklist */}
      <div className="bg-white rounded-2xl border border-[#E5E5DC] p-6 paper-shadow">
        <h4 className="text-sm font-semibold text-[#1A1A1A] font-mono uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Itemized Evidence Checklist ({report.evidence.length})</span>
          <span className="text-xs text-[#61615B] font-normal">Deterministic Rule Evaluation</span>
        </h4>

        <div className="space-y-3">
          {report.evidence.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.severity === 'critical'
                  ? 'bg-[#B91C1C]/5 border-[#B91C1C]/30'
                  : item.severity === 'suspicious'
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-emerald-500/5 border-emerald-500/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        item.severity === 'critical'
                          ? 'bg-[#B91C1C] text-white'
                          : item.severity === 'suspicious'
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {item.severity}
                    </span>
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                      {item.rule}
                    </span>
                  </div>
                  <p className="text-xs text-[#61615B] leading-relaxed">
                    {item.description}
                  </p>
                  {item.details && (
                    <p className="text-[11px] font-mono text-[#61615B] pt-0.5">
                      ↳ {item.details}
                    </p>
                  )}
                </div>

                {item.points > 0 && (
                  <span
                    className={`font-mono text-xs font-bold shrink-0 px-2 py-1 rounded ${
                      item.severity === 'critical' ? 'text-[#B91C1C] bg-white' : 'text-amber-700 bg-white'
                    }`}
                  >
                    +{item.points} pts
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Defensive Recommendations */}
      <div className="bg-[#FAFAF8] rounded-2xl border border-[#E5E5DC] p-6 paper-shadow">
        <h4 className="text-sm font-semibold text-[#1A1A1A] font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#4338CA]" />
          <span>Recommended Defensive Action</span>
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-[#61615B]">
          {report.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono text-[#4338CA] font-bold">•</span>
              <span className="text-[#1A1A1A]">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sandbox Isolation Modal */}
      {showSandboxModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E5DC] max-w-lg w-full p-6 space-y-4 paper-shadow">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DC]">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#4338CA]" />
                <h3 className="font-serif-heading text-lg text-[#1A1A1A]">
                  Isolated Sandbox Simulation
                </h3>
              </div>
              <button
                onClick={() => setShowSandboxModal(false)}
                className="text-[#61615B] hover:text-[#1A1A1A] text-sm font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-[#61615B] leading-relaxed">
              QRShield acts as a pre-execution barrier. In production, opening this link in an air-gapped web sandbox simulates browser render while stripping storage tokens and credential autofill.
            </p>

            <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] text-xs font-mono space-y-1.5">
              <div className="text-[#1A1A1A] font-semibold">SANDBOX ENVIRONMENT STATUS:</div>
              <div className="text-emerald-700">✓ Cookies & LocalStorage: ISOLATED</div>
              <div className="text-emerald-700">✓ Password Autofill: BLOCKED</div>
              <div className="text-emerald-700">✓ GPS Location Sensors: NULLIFIED</div>
              <div className="text-amber-700">⚠ Live HTTP request blocked for safety</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSandboxModal(false)}
                className="px-4 py-2 rounded-lg bg-[#4338CA] text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
