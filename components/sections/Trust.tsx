import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';

type Org = { year: string; name: string };
type Loyalty = { company: string; text: string };

// Годы лояльности (по промпту): 11 / 9 / 10+
const LOYALTY_YEARS: { to: number; suffix?: string }[] = [
  { to: 11 },
  { to: 9 },
  { to: 10, suffix: '+' },
];

export function Trust() {
  const t = useTranslations('trust');
  const gov = t.raw('govItems') as Org[];
  const dev = t.raw('devItems') as Org[];
  const loyalty = t.raw('loyaltyItems') as Loyalty[];

  return (
    <section className="section trust">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="h-section">{t('heading')}</h2>
        </Reveal>

        {/* 6.1 Государство и крупный бизнес */}
        <Reveal className="trust__sub">
          <h3>{t('govTitle')}</h3>
          <p>{t('govSub')}</p>
        </Reveal>
        <Reveal className="org-grid">
          {gov.map((o) => (
            <div className="orgcard" key={o.name}>
              <span className="year">{o.year}</span>
              <span className="name">{o.name}</span>
            </div>
          ))}
        </Reveal>

        {/* 6.2 Девелоперы */}
        <Reveal className="trust__sub trust__sub--gap">
          <h3>{t('devTitle')}</h3>
          <p>{t('devSub')}</p>
        </Reveal>
        <Reveal className="org-grid org-grid--dev">
          {dev.map((o) => (
            <div className="orgcard" key={o.name}>
              <span className="year">{o.year}</span>
              <span className="name">{o.name}</span>
            </div>
          ))}
        </Reveal>

        {/* 6.3 Возвращаются годами */}
        <Reveal className="trust__sub trust__sub--gap">
          <h3>{t('loyaltyTitle')}</h3>
          <p>{t('loyaltySub')}</p>
        </Reveal>
        <Reveal className="loyalty">
          {loyalty.map((l, i) => (
            <div className="loyalty__cell" key={l.company}>
              <div className="num">
                <CountUp to={LOYALTY_YEARS[i].to} suffix={LOYALTY_YEARS[i].suffix} />
                <span>&nbsp;{t('loyaltyUnit')}</span>
              </div>
              <div className="txt">
                <b>{l.company}</b> {l.text}
              </div>
            </div>
          ))}
        </Reveal>
        <Reveal>
          <p className="loyalty__line">{t('loyaltyLine')}</p>
        </Reveal>
      </div>
    </section>
  );
}
