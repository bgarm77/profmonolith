'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { useLocale } from 'next-intl';

type CountUpProps = {
  /** целевое число */
  to: number;
  /** суффикс (например "+") — рендерится отдельным span с акцентом */
  suffix?: string;
  /** класс для суффикса (accent и т.п.) */
  suffixClassName?: string;
  durationMs?: number;
};

const localeMap: Record<string, string> = { hy: 'hy-AM', ru: 'ru-RU', en: 'en-US' };

/** Анимированный счётчик: считает от 0 до `to` при попадании в вьюпорт. */
export function CountUp({ to, suffix, suffixClassName, durationMs = 1500 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const locale = useLocale();
  const nf = new Intl.NumberFormat(localeMap[locale] ?? 'ru-RU');
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, durationMs]);

  return (
    <span ref={ref}>
      {nf.format(Math.round(value))}
      {suffix ? <span className={suffixClassName}>{suffix}</span> : null}
    </span>
  );
}
