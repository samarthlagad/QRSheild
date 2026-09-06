import { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Link2, History, Layers, Sparkles } from 'lucide-react';
import { CameraViewfinder } from './CameraViewfinder';
import { UploadScanner } from './UploadScanner';
import { UrlScanner } from './UrlScanner';
import { ScanReportView } from './ScanReportView';
import { HistoryView } from './HistoryView';
import { ScenariosView } from './ScenariosView';
import { analyzeTarget } from '../../utils/threatEngine';
import { ScanMethod, ScanReport, SampleAttackScenario } from '../../types';

interface ScannerDashboardProps {
  onAskAi?: (report: ScanReport) => void;
  onReportChange?: (report: ScanReport | null) => void;
}

export function ScannerDashboard({ onAskAi, onReportChange }: ScannerDashboardProps = {}) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'url' | 'scenarios' | 'history'>('camera');
  const [currentReport, setCurrentReport] = useState<ScanReport | null>(null);
  const [history, setHistory] = useState<ScanReport[]>([]);
  const [autoScanNext, setAutoScanNext] = useState(false);

  // Load history from localStorage on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('qrshield_scan_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        // Seed with 1 initial sample scan for immediate rich presentation
        const seedReport = analyzeTarget('http://city-parking-pay.top/meter/pay-fine?meterId=4921&urgent=true', 'upload');
        setHistory([seedReport]);
      }
    } catch {
      // Fallback
    }
  }, []);

  const saveReport = (report: ScanReport) => {
    setCurrentReport(report);
    onReportChange?.(report);
    setHistory((prev) => {
      const updated = [report, ...prev.filter((r) => r.id !== report.id)].slice(0, 30);
      try {
        localStorage.setItem('qrshield_scan_history', JSON.stringify(updated));
      } catch {
        // Ignore storage quotas
      }
      return updated;
    });
  };

  const handleDecoded = (decodedText: string, method: ScanMethod) => {
    const report = analyzeTarget(decodedText, method);
    saveReport(report);
  };

  const handleScenarioAudit = (scenario: SampleAttackScenario) => {
    const report = analyzeTarget(scenario.url, 'upload');
    report.threatVector = scenario.physicalVector;
    saveReport(report);
  };

  const handleScanAnother = () => {
    setCurrentReport(null);
    onReportChange?.(null);
    if (autoScanNext) {
      setActiveTab('camera');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('qrshield_scan_history');
    } catch {
      // Ignore
    }
  };

  return (
    <section id="scanner-section" className="py-20 md:py-28 border-t border-[#E5E5DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E5DC] text-xs font-semibold text-[#4338CA] mb-3 paper-shadow">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Scanner Studio</span>
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Quishing Inspection Terminal
          </h2>
          <p className="text-[#61615B] text-base mt-2">
            Decode QR codes directly from camera, image uploads, or raw URLs. Deterministic threat logic executes locally before network dispatch.
          </p>
        </div>

        {/* Studio Shell Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E5DC] p-4 sm:p-8 paper-shadow">
          {/* Main Mode Selector Tabs */}
          {!currentReport && (
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-[#E5E5DC]">
              {/* Primary 3-Way Mode Selector */}
              <div className="inline-flex p-1 rounded-xl bg-[#FAFAF8] border border-[#E5E5DC] shadow-inner max-w-full overflow-x-auto">
                <button
                  onClick={() => setActiveTab('camera')}
                  id="tab-camera"
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'camera'
                      ? 'bg-white text-[#1A1A1A] paper-shadow'
                      : 'text-[#61615B] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Camera className="w-4 h-4 text-[#4338CA]" />
                  <span>📷 Live Camera</span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  id="tab-upload"
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-white text-[#1A1A1A] paper-shadow'
                      : 'text-[#61615B] hover:text-[#1A1A1A]'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-[#4338CA]" />
                  <span>🖼️ Upload Image</span>
                </button>

                <button
                  onClick={() => setActiveTab('url')}
                  id="tab-url"
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'url'
                      ? 'bg-white text-[#1A1A1A] paper-shadow'
                      : 'text-[#61615B] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Link2 className="w-4 h-4 text-[#4338CA]" />
                  <span>🔗 Paste URL</span>
                </button>
              </div>

              {/* Secondary Tools: Attack Templates & History */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('scenarios')}
                  id="tab-scenarios"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeTab === 'scenarios'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-[#FAFAF8] text-[#61615B] border-[#E5E5DC] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Threat Scenarios</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  id="tab-history"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-[#FAFAF8] text-[#61615B] border-[#E5E5DC] hover:text-[#1A1A1A]'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Logs</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#E5E5DC] text-[10px] text-[#1A1A1A]">
                    {history.length}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Active View State */}
          {currentReport ? (
            <ScanReportView
              report={currentReport}
              onReset={() => {
                setCurrentReport(null);
                onReportChange?.(null);
              }}
              onScanAnother={handleScanAnother}
              onAskAi={onAskAi}
            />
          ) : (
            <div>
              {activeTab === 'camera' && (
                <CameraViewfinder
                  onCodeDetected={handleDecoded}
                  autoScanNext={autoScanNext}
                  onToggleAutoScan={setAutoScanNext}
                  onSwitchToUpload={() => setActiveTab('upload')}
                  onSwitchToManual={() => setActiveTab('url')}
                />
              )}

              {activeTab === 'upload' && (
                <UploadScanner onCodeDecoded={handleDecoded} />
              )}

              {activeTab === 'url' && (
                <UrlScanner onAnalyzeUrl={handleDecoded} />
              )}

              {activeTab === 'scenarios' && (
                <ScenariosView onSelectScenario={handleScenarioAudit} />
              )}

              {activeTab === 'history' && (
                <HistoryView
                  history={history}
                  onSelectReport={(rep) => setCurrentReport(rep)}
                  onClearHistory={handleClearHistory}
                  onScanNew={() => setActiveTab('camera')}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
