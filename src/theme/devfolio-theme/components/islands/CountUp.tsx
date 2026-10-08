import { useEffect, useState } from 'react';

type Props = { value: number; prefix?: string; suffix?: string; duration?: number };

/** Eased count-up. Server render shows the final number so there is no layout shift or SEO loss. */
export default function CountUp({ value = 0, prefix = '', suffix = '', duration = 1400 }: Props) {
  const [n, setN] = useState(value);
  // Preserve the precision the editor typed, e.g. 96.3 animates as 96.3, not 96
  const decimals = (String(value).split('.')[1] || '').length;

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Number((eased * value).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      <span className="df-gradient-text">{n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>
      {suffix}
    </span>
  );
}
