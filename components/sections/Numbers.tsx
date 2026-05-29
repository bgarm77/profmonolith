import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import { CheckIcon } from '@/components/icons';

// Правильные цифры (по промпту): 17+ / 200+ / 8 / 350000+ / 0 / ✓
type Metric =
  | { to: number; suffix?: string; key: string }
  | { check: true; key: string };

const METRICS: Metric[] = [
  { to: 17, suffix: '+', key: 'years' },
  { to: 200, suffix: '+', key: 'staff' },
  { to: 8, key: 'brigades' },
  { to: 350000, suffix: '+', key: 'm2' },
  { to: 0, key: 'accidents' },
  { check: true, key: 'onTime' },
];

export function Numbers() {
  const t = useTranslations('numbers');

  return (
    <section className="section metrics">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="h-section">{t('heading')}</h2>
        </Reveal>
        <div className="metrics__grid">
          {METRICS.map((m, i) => (
            <Reveal key={m.key} className="metric" delay={0.06 * (i % 3)}>
              <div className="num">
                {'check' in m ? <CheckIcon /> : <CountUp to={m.to} suffix={m.suffix} />}
              </div>
              <div className="lab">{t(m.key)}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
