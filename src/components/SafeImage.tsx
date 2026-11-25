import { useState } from 'react';
import { Leaf } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function SafeImage({
  src,
  alt,
  fallbackTitle,
  className = '',
  loading = 'lazy',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#E6EFEA] via-[#F2EFE8] to-[#DCE8E0] text-[#143D2C] p-6 text-center ${className}`}
      >
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-emerald-700 border border-emerald-900/10">
          <Leaf className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="font-display text-sm font-semibold tracking-tight">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
