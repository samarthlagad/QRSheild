import { useState, useRef, useEffect, useCallback, TouchEvent, WheelEvent } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  CameraOff,
  AlertCircle,
  RefreshCw,
  Zap,
  Sparkles,
  Check,
  Video,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Sliders,
} from 'lucide-react';

interface CameraViewfinderProps {
  onCodeDetected: (decodedText: string, method: 'camera') => void;
  autoScanNext: boolean;
  onToggleAutoScan: (value: boolean) => void;
  onSwitchToUpload: () => void;
  onSwitchToManual: () => void;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function CameraViewfinder({
  onCodeDetected,
  autoScanNext,
  onToggleAutoScan,
  onSwitchToUpload,
  onSwitchToManual,
}: CameraViewfinderProps) {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Camera inactive');
  const [aspectRatioMode, setAspectRatioMode] = useState<'fit-width' | 'ultrawide' | 'standard'>('fit-width');
  const [isDetected, setIsDetected] = useState(false);
  const [detectedBox, setDetectedBox] = useState<BoundingBox | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);

  // Zoom management states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hardwareZoomSupported, setHardwareZoomSupported] = useState(false);
  const [zoomRange, setZoomRange] = useState({ min: 1, max: 4, step: 0.1 });
  const [showZoomSlider, setShowZoomSlider] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isScanningRef = useRef(false);

  // Fast synchronous refs for rendering & detection loops
  const zoomLevelRef = useRef(1);
  const hardwareZoomRef = useRef(false);
  const pinchDistanceRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);

  // Apply native hardware zoom if supported by the camera sensor
  const applyHardwareZoom = (zoomVal: number) => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      const constraints = { advanced: [{ zoom: zoomVal } as any] };
      videoTrack.applyConstraints(constraints).catch((err) => {
        console.warn('Native zoom constraint application error:', err);
      });
    }
  };

  // Unified zoom adjuster (handles both hardware zoom and digital fallback)
  const updateZoom = useCallback((newZoom: number) => {
    const clamped = Math.min(Math.max(newZoom, zoomRange.min), zoomRange.max);
    const rounded = Math.round(clamped * 10) / 10;
    setZoomLevel(rounded);
    zoomLevelRef.current = rounded;

    if (hardwareZoomRef.current) {
      applyHardwareZoom(rounded);
    }
  }, [zoomRange]);

  // Touch gesture handlers for mobile pinch-to-zoom
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchDistanceRef.current = dist;
      touchStartZoomRef.current = zoomLevelRef.current;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && pinchDistanceRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / pinchDistanceRef.current;
      updateZoom(touchStartZoomRef.current * factor);
    }
  };

  const handleTouchEnd = () => {
    pinchDistanceRef.current = null;
  };

  // Double-tap on video toggles 1x and 2x zoom
  const handleDoubleTap = () => {
    if (zoomLevelRef.current > 1.2) {
      updateZoom(1.0);
    } else {
      updateZoom(2.0);
    }
  };

  // Mouse wheel over active viewfinder smoothly zooms in/out
  const handleWheel = (e: WheelEvent) => {
    if (!isActive) return;
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    updateZoom(zoomLevelRef.current + delta);
  };

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    isScanningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setZoomLevel(1);
    zoomLevelRef.current = 1;
    setIsActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Handle successful detection
  const handleFoundCode = useCallback(
    (codeData: string, location?: any) => {
      if (!isScanningRef.current) return;
      isScanningRef.current = false;

      setIsDetected(true);
      setStatusText('QR code detected — analyzing payload...');
      setIsFlashActive(true);

      // If bounding box coordinates exist from jsQR
      if (location && videoRef.current) {
        const vid = videoRef.current;
        const scaleX = vid.clientWidth / (vid.videoWidth || 1);
        const scaleY = vid.clientHeight / (vid.videoHeight || 1);

        const minX = Math.min(
          location.topLeftCorner.x,
          location.topRightCorner.x,
          location.bottomLeftCorner.x,
          location.bottomRightCorner.x
        );
        const maxX = Math.max(
          location.topLeftCorner.x,
          location.topRightCorner.x,
          location.bottomLeftCorner.x,
          location.bottomRightCorner.x
        );
        const minY = Math.min(
          location.topLeftCorner.y,
          location.topRightCorner.y,
          location.bottomLeftCorner.y,
          location.bottomRightCorner.y
        );
        const maxY = Math.max(
          location.topLeftCorner.y,
          location.topRightCorner.y,
          location.bottomLeftCorner.y,
          location.bottomRightCorner.y
        );

        setDetectedBox({
          x: Math.max(0, minX * scaleX),
          y: Math.max(0, minY * scaleY),
          width: Math.max(40, (maxX - minX) * scaleX),
          height: Math.max(40, (maxY - minY) * scaleY),
        });
      }

      // Freeze video feed briefly
      if (videoRef.current) {
        videoRef.current.pause();
      }

      // Remove flash after 250ms
      setTimeout(() => {
        setIsFlashActive(false);
      }, 300);

      // Crossfade transition to Report after 800ms
      setTimeout(() => {
        stopCamera();
        onCodeDetected(codeData, 'camera');
      }, 750);
    },
    [onCodeDetected, stopCamera]
  );

  // Optical detection frame loop using canvas and jsQR with digital zoom cropping
  const scanFrame = useCallback(() => {
    if (!isScanningRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        canvas.width = width;
        canvas.height = height;

        const currentZoom = zoomLevelRef.current;
        // If digital zoom is active and not hardware optical zoom, crop center to magnify QR matrix for jsQR
        if (currentZoom > 1 && !hardwareZoomRef.current) {
          const cropWidth = width / currentZoom;
          const cropHeight = height / currentZoom;
          const cropX = (width - cropWidth) / 2;
          const cropY = (height - cropHeight) / 2;
          ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);
        } else {
          ctx.drawImage(video, 0, 0, width, height);
        }

        const imageData = ctx.getImageData(0, 0, width, height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (qrCode && qrCode.data) {
          handleFoundCode(qrCode.data, qrCode.location);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  }, [handleFoundCode]);

  // Start the video stream
  const startCamera = async () => {
    setErrorMessage(null);
    setStatusText('Requesting optical sensor access...');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage(
        'Camera API is not supported in this browser context or requires HTTPS. You can upload an image or paste a URL instead.'
      );
      setHasPermission(false);
      return;
    }

    try {
      // Prefer rear camera on phones
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Check for native hardware optical zoom capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities && videoTrack.getCapabilities()) as any;
        if (capabilities && capabilities.zoom) {
          setHardwareZoomSupported(true);
          hardwareZoomRef.current = true;
          setZoomRange({
            min: capabilities.zoom.min || 1,
            max: Math.min(capabilities.zoom.max || 5, 8),
            step: capabilities.zoom.step || 0.1,
          });
        } else {
          setHardwareZoomSupported(false);
          hardwareZoomRef.current = false;
          setZoomRange({ min: 1, max: 4, step: 0.1 });
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // iOS requirement
        await videoRef.current.play();
      }

      setZoomLevel(1);
      zoomLevelRef.current = 1;
      setIsActive(true);
      setHasPermission(true);
      setIsDetected(false);
      setDetectedBox(null);
      setStatusText('Searching for QR code...');

      isScanningRef.current = true;
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      let msg = 'Unable to access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg =
          'Camera permission was denied. Please allow camera permissions in your browser or switch to image upload.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No video recording camera found on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera is currently in use by another application or tab.';
      }
      setErrorMessage(msg);
      setHasPermission(false);
      setIsActive(false);
    }
  };

  // Manual fallback capture: runs immediate analysis on current frame with zoom cropping
  const handleManualCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    const currentZoom = zoomLevelRef.current;
    if (currentZoom > 1 && !hardwareZoomRef.current) {
      const cropWidth = width / currentZoom;
      const cropHeight = height / currentZoom;
      const cropX = (width - cropWidth) / 2;
      const cropY = (height - cropHeight) / 2;
      ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);
    } else {
      ctx.drawImage(video, 0, 0, width, height);
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    if (qrCode && qrCode.data) {
      handleFoundCode(qrCode.data, qrCode.location);
    } else {
      setStatusText('No valid QR matrix in view. Hold closer or adjust zoom.');
      setTimeout(() => {
        if (isScanningRef.current) {
          setStatusText('Searching for QR code...');
        }
      }, 2500);
    }
  };

  const aspectClass =
    aspectRatioMode === 'fit-width'
      ? 'aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.2/1] max-h-[360px]'
      : aspectRatioMode === 'ultrawide'
      ? 'aspect-[21/9] sm:aspect-[2.5/1] max-h-[300px]'
      : 'aspect-[4/3] sm:aspect-[16/10] max-h-[460px]';

  return (
    <div className="space-y-3">
      {/* Hidden offscreen canvas for frame processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Aspect Ratio & Frame Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#61615B]">
          <span className="font-semibold uppercase text-[#1A1A1A]">Viewfinder Frame:</span>
          <span>(Decreased ratio to fit width)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom quick status in top toolbar when camera active */}
          {isActive && (
            <div className="flex items-center gap-1 bg-[#FAFAF8] border border-[#E5E5DC] rounded-lg px-2 py-0.5 text-xs font-mono text-[#1A1A1A]">
              <ZoomIn className="w-3 h-3 text-[#4338CA]" />
              <span className="font-bold">{zoomLevel.toFixed(1)}x</span>
            </div>
          )}

          <div className="inline-flex p-0.5 rounded-lg bg-[#FAFAF8] border border-[#E5E5DC]">
            <button
              type="button"
              onClick={() => setAspectRatioMode('fit-width')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                aspectRatioMode === 'fit-width'
                  ? 'bg-white text-[#4338CA] font-bold paper-shadow'
                  : 'text-[#61615B] hover:text-[#1A1A1A]'
              }`}
            >
              Fit Width (16:9 / 2:1)
            </button>
            <button
              type="button"
              onClick={() => setAspectRatioMode('ultrawide')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                aspectRatioMode === 'ultrawide'
                  ? 'bg-white text-[#4338CA] font-bold paper-shadow'
                  : 'text-[#61615B] hover:text-[#1A1A1A]'
              }`}
            >
              Ultra-Wide (21:9)
            </button>
            <button
              type="button"
              onClick={() => setAspectRatioMode('standard')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                aspectRatioMode === 'standard'
                  ? 'bg-white text-[#4338CA] font-bold paper-shadow'
                  : 'text-[#61615B] hover:text-[#1A1A1A]'
              }`}
            >
              Standard (4:3)
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewfinder Frame with Decreased Aspect Ratio */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
        onWheel={handleWheel}
        className={`relative ${aspectClass} w-full bg-[#FAFAF8] rounded-2xl border border-[#E5E5DC] overflow-hidden paper-shadow flex items-center justify-center transition-all duration-300 select-none`}
      >
        {/* Flash visual ripple effect */}
        {isFlashActive && (
          <div className="absolute inset-0 bg-white/80 z-30 pointer-events-none transition-opacity duration-300" />
        )}

        {/* State A: Camera Inactive Empty State */}
        {!isActive && !errorMessage && (
          <div className="p-4 sm:p-6 text-center max-w-md mx-auto space-y-2.5 z-10">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E5DC] paper-shadow mx-auto flex items-center justify-center text-[#4338CA]">
              <Camera className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg sm:text-xl font-serif-heading text-[#1A1A1A]">
                Point Camera at Any Physical QR Code
              </h4>
              <p className="text-xs sm:text-sm text-[#61615B] leading-relaxed line-clamp-2 sm:line-clamp-none">
                Scan parking meter stickers, flyers, restaurant tables, or screens in real-time.
                QRShield intercepts the raw payload before any connection is attempted.
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={startCamera}
                id="btn-enable-camera"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4338CA] text-white font-semibold text-xs sm:text-sm hover:bg-[#3730A3] active:scale-[0.98] transition-all paper-shadow cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Enable Camera</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 text-[11px] text-[#61615B] pt-1">
              <span>🔒 100% Local Optical Processing</span>
              <span>•</span>
              <span>No Video Uploaded</span>
            </div>
          </div>
        )}

        {/* State B: Error State / Graceful Fallback */}
        {errorMessage && (
          <div className="p-6 text-center max-w-md mx-auto space-y-3 z-10">
            <div className="w-12 h-12 rounded-xl bg-[#B91C1C]/10 border border-[#B91C1C]/20 mx-auto flex items-center justify-center text-[#B91C1C]">
              <CameraOff className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-semibold text-[#1A1A1A]">
                Camera Access Unavailable
              </h4>
              <p className="text-xs sm:text-sm text-[#61615B] leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={startCamera}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E5E5DC] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F4F4F0] flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Permission</span>
              </button>
              <button
                onClick={onSwitchToUpload}
                className="px-3.5 py-1.5 rounded-lg bg-[#4338CA] text-xs font-semibold text-white hover:bg-[#3730A3] cursor-pointer"
              >
                Switch to Upload
              </button>
              <button
                onClick={onSwitchToManual}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E5E5DC] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F4F4F0] cursor-pointer"
              >
                Paste URL
              </button>
            </div>
          </div>
        )}

        {/* State C: Live Video Stream with Smooth Zoom scaling */}
        <video
          ref={videoRef}
          style={{
            transform: !hardwareZoomSupported && zoomLevel > 1 ? `scale(${zoomLevel})` : undefined,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          muted
          autoPlay
          playsInline
        />

        {/* Overlaid Viewfinder Reticle & Guides (Editorial Paper Aesthetic) */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Soft dark vignette around video */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Viewfinder Bounding Target Zone adjusted for decreased aspect ratio */}
            <div className="absolute inset-4 sm:inset-8 flex items-center justify-center">
              <div className="relative w-full max-w-[200px] sm:max-w-[250px] aspect-square max-h-[85%]">
                {/* Thin Indigo/Crimson Corner Brackets */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#4338CA] rounded-tl-sm transition-all duration-300" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#4338CA] rounded-tr-sm transition-all duration-300" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#4338CA] rounded-bl-sm transition-all duration-300" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#4338CA] rounded-br-sm transition-all duration-300" />

                {/* Animated scanline sweeping up and down */}
                {!isDetected && (
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#4338CA] to-transparent animate-scanline shadow-[0_0_8px_#4338CA]" />
                )}

                {/* Detected Snap Box */}
                {isDetected && (
                  <div className="absolute inset-0 border-2 border-[#B91C1C] bg-[#B91C1C]/15 rounded-lg flex items-center justify-center animate-pulse">
                    <span className="bg-[#B91C1C] text-white px-2.5 py-1 rounded text-xs font-mono font-bold">
                      QR CAPTURED
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Optical coordinate tags on video */}
            <div className="absolute top-3 left-4 text-[10px] font-mono text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
              OPTICAL_STREAM // ENV_CAM
            </div>

            <div className="absolute top-3 right-4 text-[10px] font-mono text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE</span>
              <span className="text-white/40">|</span>
              <span className="text-amber-300 font-bold">{zoomLevel.toFixed(1)}x</span>
            </div>
          </div>
        )}

        {/* Floating On-Screen Optical/Digital Zoom HUD */}
        {isActive && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] sm:w-auto max-w-sm pointer-events-auto">
            <div className="bg-black/75 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 flex items-center justify-between sm:justify-center gap-2 text-white paper-shadow shadow-xl">
              {/* Zoom Out Button */}
              <button
                type="button"
                onClick={() => updateZoom(zoomLevel - 0.5)}
                disabled={zoomLevel <= zoomRange.min}
                className="p-1 rounded-full hover:bg-white/20 active:scale-95 disabled:opacity-30 transition-all cursor-pointer text-white"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              {/* Preset pills: 1x, 1.5x, 2x, 3x */}
              <div className="flex items-center gap-1">
                {[1, 1.5, 2, 3].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateZoom(preset)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                      Math.abs(zoomLevel - preset) < 0.05
                        ? 'bg-white text-[#1A1A1A] shadow-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {preset}x
                  </button>
                ))}
              </div>

              {/* Zoom In Button */}
              <button
                type="button"
                onClick={() => updateZoom(zoomLevel + 0.5)}
                disabled={zoomLevel >= zoomRange.max}
                className="p-1 rounded-full hover:bg-white/20 active:scale-95 disabled:opacity-30 transition-all cursor-pointer text-white"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {/* Toggle Slider Drawer */}
              <button
                type="button"
                onClick={() => setShowZoomSlider(!showZoomSlider)}
                className={`p-1 rounded-full transition-all cursor-pointer ${
                  showZoomSlider ? 'bg-[#4338CA] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title="Fine-tune zoom slider"
              >
                <Sliders className="w-3 h-3" />
              </button>

              {/* Current Zoom Level Badge & Engine Indicator */}
              <div className="border-l border-white/20 pl-2 hidden xs:flex items-center gap-1 text-[10px] font-mono text-white/90">
                <span className="font-bold text-amber-300">{zoomLevel.toFixed(1)}x</span>
                <span className="text-[9px] text-white/60">
                  {hardwareZoomSupported ? 'OPTICAL' : 'DIGITAL'}
                </span>
              </div>
            </div>

            {/* Fine-tune smooth slider expandable popout */}
            {showZoomSlider && (
              <div className="mt-1.5 bg-black/85 backdrop-blur-md border border-white/20 rounded-xl p-2.5 flex items-center gap-3 text-white text-xs font-mono shadow-xl">
                <span className="text-[10px] text-white/60">{zoomRange.min}x</span>
                <input
                  type="range"
                  min={zoomRange.min}
                  max={zoomRange.max}
                  step={0.1}
                  value={zoomLevel}
                  onChange={(e) => updateZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#4338CA] h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-white/60">{zoomRange.max}x</span>
                <span className="text-[11px] font-bold text-amber-300 min-w-[28px] text-right">
                  {zoomLevel.toFixed(1)}x
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Viewfinder Controls & Status Bar */}
      {isActive && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#E5E5DC] paper-shadow">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isDetected ? 'bg-[#B91C1C]' : 'bg-[#4338CA] animate-pulse'
              }`}
            />
            <span className="font-semibold text-[#1A1A1A]">{statusText}</span>
            {zoomLevel > 1 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                {zoomLevel.toFixed(1)}x Zoom Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick 1x Reset button when zoomed */}
            {zoomLevel > 1 && (
              <button
                onClick={() => updateZoom(1.0)}
                className="px-2.5 py-1.5 rounded-lg bg-[#FAFAF8] border border-[#E5E5DC] text-xs font-mono text-[#61615B] hover:text-[#1A1A1A] hover:bg-[#F4F4F0] cursor-pointer"
                title="Reset zoom to 1x"
              >
                Reset 1x
              </button>
            )}

            {/* Fallback Manual Capture Button */}
            <button
              onClick={handleManualCapture}
              className="px-3 py-1.5 rounded-lg bg-[#FAFAF8] border border-[#E5E5DC] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F4F4F0] flex items-center gap-1.5 cursor-pointer"
              title="Manually trigger frame analysis"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Manual Capture</span>
            </button>

            {/* Stop Camera Button */}
            <button
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E5DC] text-xs font-semibold text-[#B91C1C] hover:bg-[#B91C1C]/5 cursor-pointer"
            >
              Stop Camera
            </button>
          </div>
        </div>
      )}

      {/* Auto-Scan Next Code Toggle Bar & Zoom Gestures Hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#FAFAF8] rounded-xl border border-[#E5E5DC] text-xs text-[#61615B]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#1A1A1A]">
            Continuous inspection mode:
          </span>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoScanNext}
              onChange={(e) => onToggleAutoScan(e.target.checked)}
              className="w-4 h-4 rounded text-[#4338CA] focus:ring-[#4338CA]"
            />
            <span className="text-xs text-[#1A1A1A]">
              Auto-scan next code immediately
            </span>
          </label>
        </div>

        {isActive && (
          <span className="text-[11px] font-mono text-[#61615B] hidden sm:inline-block">
            Tip: Pinch, scroll wheel, or double-tap viewfinder to zoom
          </span>
        )}
      </div>
    </div>
  );
}
