import { useState } from 'react';
import { ScanReport, ThreatLevel } from '../../types';
import {
  Camera,
  Image as ImageIcon,
  Link2,
  Trash2,
  Filter,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface HistoryViewProps {
  history: ScanReport[];
  onSelectReport: (report: ScanReport) => void;
  onClearHistory: () => void;
  onScanNew: () => void;
}

export function HistoryView({
  history,
  onSelectReport,
  onClearHistory,
  onScanNew,
}: HistoryViewProps) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = history.filter((item) => {
    if (filter === 'all') return true;
    return item.verdict === filter;
  });

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'camera':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Camera className="w-3 h-3" />
            <span>Camera</span>
          </span>
        );
      case 'upload':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <ImageIcon className="w-3 h-3" />
            <span>Upload</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
            <Link2 className="w-3 h-3" />
            <span>Manual</span>
          </span>
        );
    }
  };

  const getVerdictPill = (verdict: ThreatLevel, score: number) => {
    if (verdict === 'critical') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B91C1C]/10 text-[#B91C1C] font-bold">
          CRITICAL ({score})
        </span>
      );
    }
    if (verdict === 'suspicious') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
          SUSPICIOUS ({score})
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
        SAFE ({score})
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E5DC]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#61615B]" />
          <span className="text-xs font-mono text-[#61615B] uppercase font-semibold">
            Filter:
          </span>
          <div className="flex items-center gap-1">
            {['all', 'critical', 'suspicious', 'safe'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-[#1A1A1A] text-white font-semibold'
                    : 'text-[#61615B] hover:text-[#1A1A1A] hover:bg-[#FAFAF8]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-mono text-[#B91C1C] hover:text-[#B91C1C]/80 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      {/* History Items */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#FAFAF8] rounded-2xl border border-[#E5E5DC] space-y-3">
          <Clock className="w-8 h-8 text-[#61615B] mx-auto opacity-50" />
          <h4 className="text-base font-semibold text-[#1A1A1A]">
            No Inspection Logs Found
          </h4>
          <p className="text-xs text-[#61615B] max-w-xs mx-auto">
            Scans captured via live camera, uploaded images, or tested scenarios will appear here with forensic history.
          </p>
          <div className="pt-2">
            <button
              onClick={onScanNew}
              className="px-4 py-2 rounded-lg bg-[#4338CA] text-white text-xs font-semibold hover:bg-[#3730A3] cursor-pointer"
            >
              Start First Scan
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="p-4 bg-white rounded-xl border border-[#E5E5DC] hover:border-[#4338CA] transition-all paper-shadow paper-shadow-hover cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {getVerdictPill(report.verdict, report.riskScore)}
                  {getMethodBadge(report.method)}
                  <span className="text-[11px] font-mono text-[#61615B]">
                    {new Date(report.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
                <div className="font-mono text-xs text-[#1A1A1A] truncate group-hover:text-[#4338CA] transition-colors">
                  {report.url}
                </div>
                <div className="text-[11px] text-[#61615B] truncate">
                  {report.threatVector || report.verdictSummary}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-[#4338CA] shrink-0 self-end sm:self-center">
                <span>View Full Audit</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
