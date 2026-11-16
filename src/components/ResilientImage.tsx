import { Film } from 'lucide-react';
import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-[#121218] to-neutral-950 text-neutral-400 p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Film className="w-8 h-8 mb-2 text-neutral-500" aria-hidden="true" />
        {fallbackTitle && (
          <span className="font-display text-sm tracking-wide text-neutral-300 uppercase">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
