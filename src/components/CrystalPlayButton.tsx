import { Play } from 'lucide-react';

interface CrystalPlayButtonProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function CrystalPlayButton({
  size = 'md',
  className = '',
}: CrystalPlayButtonProps) {
  const dimensions = size === 'sm' ? 'w-12 h-12' : 'w-14 h-14';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex items-center justify-center ${dimensions} transition-transform duration-200 ${className}`}
    >
      {/* Transparent Frosted Crystal Glass Core */}
      <span className="absolute inset-0 ext-crystal-clip ext-crystal-play-glass backdrop-blur-md" />

      {/* Faceted Cut-Crystal Edge & Inner Specular Lines */}
      <svg
        viewBox="0 0 64 64"
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_4px_14px_rgba(93,90,240,0.4)]"
        fill="none"
      >
        {/* Top-left crystal reflection facet */}
        <polygon
          points="32,2 58,17 32,25 6,17"
          fill="rgba(255,255,255,0.24)"
        />
        {/* Subtle bottom-right lavender prism refraction */}
        <polygon
          points="58,17 58,47 32,62 32,39"
          fill="rgba(149,125,249,0.16)"
        />
        {/* Crisp outer crystal rim */}
        <polygon
          points="32,2 58,17 58,47 32,62 6,47 6,17"
          stroke="rgba(255,255,255,0.92)"
          strokeWidth="1.75"
          strokeLinejoin="miter"
        />
        {/* Inner beveled facet rim */}
        <polygon
          points="32,8 52,20 52,44 32,56 12,44 12,20"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1"
        />
      </svg>

      {/* Translucent Crystal Play Icon */}
      <Play
        className={`relative z-10 ${iconSize} text-white/95 fill-white/85 ml-0.5 drop-shadow-[0_2px_8px_rgba(22,20,62,0.55)]`}
      />
    </span>
  );
}
