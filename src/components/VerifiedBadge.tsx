import { useId } from 'react';

interface VerifiedBadgeProps {
  className?: string;
}

const SEAL_PATH = (() => {
  const cx = 24;
  const cy = 24;
  const lobes = 10;
  const rValley = 19.4;
  const rCtrl = 25.4;
  const step = (Math.PI * 2) / lobes;
  const segments: string[] = [];

  for (let i = 0; i < lobes; i++) {
    const peakAngle = -Math.PI / 2 + i * step;
    const prevValleyAngle = peakAngle - step / 2;
    const nextValleyAngle = peakAngle + step / 2;

    if (i === 0) {
      const sx = cx + rValley * Math.cos(prevValleyAngle);
      const sy = cy + rValley * Math.sin(prevValleyAngle);
      segments.push(`M ${sx.toFixed(2)} ${sy.toFixed(2)}`);
    }

    const qx = cx + rCtrl * Math.cos(peakAngle);
    const qy = cy + rCtrl * Math.sin(peakAngle);
    const ex = cx + rValley * Math.cos(nextValleyAngle);
    const ey = cy + rValley * Math.sin(nextValleyAngle);
    segments.push(
      `Q ${qx.toFixed(2)} ${qy.toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`
    );
  }

  segments.push('Z');
  return segments.join(' ');
})();

export function VerifiedBadge({ className = 'w-[1em] h-[1em]' }: VerifiedBadgeProps) {
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const clipId = `verified-seal-clip-${safeId}`;
  const gradId = `verified-seal-grad-${safeId}`;
  const sweepGradId = `verified-sweep-grad-${safeId}`;

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex items-center justify-center shrink-0 select-none align-middle ${className}`}
    >
      {/* Subtle emerald ambient lighting halo behind badge */}
      <span className="verified-badge-aura pointer-events-none absolute -inset-[8%]" />

      {/* Crisp self-contained vector seal + clipped soft diagonal light sweep */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full verified-badge-svg"
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="8"
            y1="4"
            x2="40"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#1DB960" />
            <stop offset="55%" stopColor="#169C4E" />
            <stop offset="100%" stopColor="#117E3F" />
          </linearGradient>
          <linearGradient id={sweepGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <clipPath id={clipId}>
            <path d={SEAL_PATH} />
          </clipPath>
        </defs>

        <path d={SEAL_PATH} fill={`url(#${gradId})`} />

        {/* Subtle animated feathered light glint clipped strictly inside the badge */}
        <g clipPath={`url(#${clipId})`}>
          <polygon
            points="-12,-8 6,-8 -14,56 -32,56"
            fill={`url(#${sweepGradId})`}
            className="verified-badge-sweep"
          />
        </g>

        <path
          d="M 16.2 24.4 L 21.3 29.5 L 32.0 18.8"
          stroke="#FFFFFF"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
