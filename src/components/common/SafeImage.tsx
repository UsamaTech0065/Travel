import React, { useState } from 'react';
import { Mountain } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className = '', fallbackTitle }) => {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#102A43] via-[#168AAD] to-[#243447] text-white p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Mountain className="w-8 h-8 text-[#E5AD50] mb-2 opacity-90" />
        <span className="text-xs font-medium tracking-wide opacity-90 line-clamp-2">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
    />
  );
};
