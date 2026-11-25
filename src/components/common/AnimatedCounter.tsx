import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  suffix = '',
  prefix = '',
  durationMs = 1100,
}) => {
  const [value, setValue] = useState(end);
  const hasAnimated = useRef(false);
  const elRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || hasAnimated.current) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(end * eased));
            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );

    if (elRef.current) observer.observe(elRef.current);
    return () => observer.disconnect();
  }, [end, durationMs]);

  return (
    <span ref={elRef} className="tabular-nums">
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};
