import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
}

/**
 * Lightweight compositor-only scroll reveal using native IntersectionObserver.
 * Starts at opacity-95 so critical content is immediately readable even before scrolling.
 */
export function RevealOnScroll({ children, className = '' }: RevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -32px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`transition-[opacity,transform] duration-300 ease-out will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-95 translate-y-3'
      } ${className}`}
    >
      {children}
    </div>
  );
}
