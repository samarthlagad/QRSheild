interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = '', size = 32, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-white border border-[#E5E5DC] paper-shadow p-1.5 transition-transform hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#1A1A1A]"
        >
          {/* Outer Shield Contour */}
          <path
            d="M24 4L9 9.5V22C9 32.5 15.5 41.5 24 44C32.5 41.5 39 32.5 39 22V9.5L24 4Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#1A1A1A]"
          />
          {/* Stylized QR Finder Corner / Inner Shield Monoline */}
          <path
            d="M17 17H23M17 17V23M17 17L21 21"
            stroke="#4338CA"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Top Right QR Position Marker */}
          <rect
            x="26"
            y="15"
            width="6"
            height="6"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          {/* Bottom Center Finder Pulse */}
          <path
            d="M20 28H28M24 25V31"
            stroke="#B91C1C"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Center Sensor Dot */}
          <circle cx="24" cy="24" r="1.5" fill="#4338CA" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-semibold text-lg tracking-tight text-[#1A1A1A] flex items-center gap-1">
            QR<span className="text-[#4338CA]">Shield</span>
          </span>
          <span className="text-[10px] tracking-wider uppercase font-medium text-[#61615B] -mt-1 font-mono">
            Anti-Quishing Heuristics
          </span>
        </div>
      )}
    </div>
  );
}
