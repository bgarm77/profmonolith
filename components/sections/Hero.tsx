import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import { PhoneIcon } from '@/components/icons';
import { site } from '@/lib/site';
import logoWhite from '@/public/logos/logo-white.png';

type Stat = { to: number; suffix?: string; key: string };
const STATS: Stat[] = [
  { to: 350000, suffix: '+', key: 'm2' },
  { to: 17, key: 'years' },
  { to: 0, key: 'accidents' },
  { to: 5, key: 'active' },
];

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="hero" id="top">
      <div className="hero__media">
        <div className="hero__placeholder" />
      </div>
      <div className="hero__overlay" />
      <div className="hero__pattern" />

      <div className="container hero__inner">
        <div className="hero__content">
          <Reveal>
            <Image
              className="hero__logo"
              src={logoWhite}
              alt="PROFMONOLITH"
              priority
              sizes="(max-width: 720px) 50vw, 720px"
              style={{ width: '100%', height: 'auto' }}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow" style={{ color: '#f8f9fa' }}>
              {t('eyebrow')}
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <h1 className={locale === 'hy' ? 'h1--hy' : undefined}>
              {t('title')}
              <br />
              <span className="accent">{t('titleAccent')}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="hero__sub">{t('sub')}</p>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="hero__actions">
              <a href="#lead" className="btn btn--primary btn--lg">
                {t('ctaPrimary')}
              </a>
              <a href={site.phoneHref} className="btn btn--ghost-light btn--lg">
                <PhoneIcon />
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container">
        <div className="hero__stats">
          {STATS.map((s, i) => (
            <Reveal key={s.key} className="hero__stat" delay={0.08 * (i + 1)}>
              <div className="num">
                <CountUp to={s.to} suffix={s.suffix} suffixClassName="accent" />
              </div>
              <div className="lab">{t(`stats.${s.key}`)}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
