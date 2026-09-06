import { useState, useRef, DragEvent } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { decodeQrFromImage, generateQrDataUrl } from '../../utils/qrHelper';
import { SAMPLE_SCENARIOS } from '../../utils/sampleData';

interface UploadScannerProps {
  onCodeDecoded: (decodedText: string, method: 'upload') => void;
}

export function UploadScanner({ onCodeDecoded }: UploadScannerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WEBP, or GIF).');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const result = await decodeQrFromImage(file);
      if (result && result.data) {
        onCodeDecoded(result.data, 'upload');
      } else {
        setErrorMessage(
          'No readable QR code found in this image. Ensure the code is clear, well-lit, and not excessively blurred.'
        );
      }
    } catch {
      setErrorMessage('Error analyzing file. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSampleClick = async (scenarioUrl: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      // Simulate decoding the authentic sample QR
      const dataUrl = await generateQrDataUrl(scenarioUrl);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const decoded = await decodeQrFromImage(blob);
      if (decoded) {
        onCodeDecoded(decoded.data, 'upload');
      } else {
        onCodeDecoded(scenarioUrl, 'upload');
      }
    } catch {
      onCodeDecoded(scenarioUrl, 'upload');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.4/1] max-h-[260px] min-h-[190px] w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
          isDragging
            ? 'border-[#4338CA] bg-[#4338CA]/5 scale-[0.99]'
            : 'border-[#E5E5DC] bg-white hover:border-[#4338CA]/40 hover:bg-[#FAFAF8]'
        } paper-shadow`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
        />

        <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] border border-[#E5E5DC] flex items-center justify-center text-[#4338CA] mb-2.5 paper-shadow">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h4 className="text-base sm:text-lg font-serif-heading text-[#1A1A1A] mb-1">
          Drop QR code photo here or click to browse
        </h4>
        <p className="text-xs sm:text-sm text-[#61615B] max-w-sm">
          Upload screenshots, photos of physical stickers, poster snapshots, or mail inserts.
        </p>

        <div className="mt-3 flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#61615B] bg-[#FAFAF8] px-3 py-1 rounded-full border border-[#E5E5DC]">
          <span>PNG, JPG, WEBP</span>
          <span>•</span>
          <span>Max 15MB</span>
          <span>•</span>
          <span>Offline Client Decoded</span>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2 z-20">
            <div className="w-6 h-6 border-2 border-[#4338CA] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-[#1A1A1A]">
              Extracting QR matrix & parsing URL tokens...
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 bg-[#B91C1C]/10 border border-[#B91C1C]/20 rounded-xl text-xs text-[#B91C1C] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Pre-Loaded Realistic Test Scenarios */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-[#61615B] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#4338CA]" />
            Test with Real-World Quishing Samples:
          </span>
          <span className="text-[11px] text-[#61615B]">1-Click Simulation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_SCENARIOS.slice(0, 4).map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample.url)}
              disabled={isProcessing}
              className="p-3 bg-white rounded-xl border border-[#E5E5DC] hover:border-[#4338CA] text-left transition-all paper-shadow paper-shadow-hover flex items-start justify-between gap-2 group cursor-pointer"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      sample.expectedVerdict === 'critical'
                        ? 'bg-[#B91C1C]'
                        : sample.expectedVerdict === 'suspicious'
                        ? 'bg-amber-600'
                        : 'bg-emerald-600'
                    }`}
                  />
                  <span className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#4338CA] transition-colors truncate">
                    {sample.title}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#61615B] truncate">
                  {sample.physicalVector}
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase shrink-0 ${
                  sample.expectedVerdict === 'critical'
                    ? 'bg-[#B91C1C]/10 text-[#B91C1C]'
                    : sample.expectedVerdict === 'suspicious'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {sample.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
