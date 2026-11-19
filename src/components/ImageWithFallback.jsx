import { useEffect, useState } from 'react';

/**
 * Image that degrades gracefully. If the source is missing or fails to load,
 * a branded placeholder is shown instead of a broken-image icon.
 */
export default function ImageWithFallback({ src, alt, className = '', label = 'VELUXE', ...rest }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || 'Image unavailable'}
        className={`flex items-center justify-center bg-gradient-to-br from-forest via-forest-light to-charcoal ${className}`}
      >
        <div className="px-4 text-center">
          <p className="font-serif text-xl tracking-[0.2em] text-gold">{label}</p>
          <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-ivory/50">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
