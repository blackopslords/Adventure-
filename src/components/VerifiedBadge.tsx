interface VerifiedBadgeProps {
  className?: string;
}

export function VerifiedBadge({ className = 'w-[1em] h-[1em]' }: VerifiedBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {/* Animated emerald ambient lighting halo behind badge */}
      <span className="verified-badge-aura pointer-events-none absolute -inset-[28%]" />

      {/* Verified badge image */}
      <img
        src="/assets/aistudio/icons8-verified-account-48_a6fd8a00.png"
        alt=""
        className="relative z-10 w-full h-full object-contain verified-badge-img"
      />

      {/* Animated diagonal light sweep masked strictly to the badge silhouette */}
      <span className="verified-badge-mask pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <span className="verified-badge-sweep block w-[65%] h-[160%] -mt-[30%]" />
      </span>
    </span>
  );
}
