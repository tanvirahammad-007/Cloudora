import { SyntheticEvent, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SafeImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'auto' | 'sync';
  role?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export default function SafeImage({ className, fallbackClassName, alt, onError, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--text-main)]/[0.04] text-[var(--text-muted)]',
          className,
          fallbackClassName
        )}
        aria-label={alt || 'Image unavailable'}
        role="img"
      >
        <ImageOff size={22} strokeWidth={1.8} />
      </div>
    );
  }

  return (
    <img
      {...props}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
