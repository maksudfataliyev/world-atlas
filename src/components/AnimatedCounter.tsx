import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // in ms
  formatter?: (val: number) => string;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1200,
  formatter,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const observerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  // Auto formatter to abbreviate large numbers (e.g. 1.2M, 330M)
  const defaultFormatter = (num: number) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    }
    return Math.floor(num).toLocaleString();
  };

  const activeFormatter = formatter || defaultFormatter;

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;
          const startValue = 0;

          const step = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing out quadratic
            const easeProgress = progress * (2 - progress);
            const currentValue = startValue + easeProgress * (value - startValue);
            
            countRef.current = currentValue;
            setCount(currentValue);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={observerRef} className="font-mono tabular-nums">
      {prefix}
      {activeFormatter(count)}
      {suffix}
    </span>
  );
}
