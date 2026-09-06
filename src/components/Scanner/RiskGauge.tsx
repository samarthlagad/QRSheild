import { ThreatLevel } from '../../types';

interface RiskGaugeProps {
  score: number; // 0 - 100
  verdict: ThreatLevel;
  size?: number;
}

export function RiskGauge({ score, verdict, size = 160 }: RiskGaugeProps) {
  // SVG circular arc settings
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc for gauge look
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#059669'; // safe green
  let bgColor = 'rgba(5, 150, 105, 0.1)';
  let verdictText = 'SAFE';

  if (verdict === 'critical') {
    color = '#B91C1C'; // crimson
    bgColor = 'rgba(185, 28, 28, 0.1)';
    verdictText = 'CRITICAL';
  } else if (verdict === 'suspicious') {
    color = '#D97706'; // amber
    bgColor = 'rgba(217, 119, 6, 0.1)';
    verdictText = 'SUSPICIOUS';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E5DC"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Dynamic Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#61615B]">
            RISK SCORE
          </span>
          <span
            className="text-4xl font-bold font-mono tracking-tight my-0.5"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-[10px] font-mono text-[#61615B]">/ 100</span>
        </div>
      </div>

      {/* Verdict Pill Badge */}
      <div
        className="mt-2.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide uppercase flex items-center gap-1.5"
        style={{ backgroundColor: bgColor, color }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span>{verdictText} VERDICT</span>
      </div>
    </div>
  );
}
