import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { ClockIcon, ShieldIcon, CraneIcon, UsersIcon } from '@/components/icons';

type Item = { title: string; text: string };
const ICONS = [ClockIcon, ShieldIcon, CraneIcon, UsersIcon];

export function WhyUs() {
  const t = useTranslations('why');
  const items = t.raw('items') as Item[];

  return (
    <section className="section why" id="why">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="h-section">{t('heading')}</h2>
        </Reveal>
        <div className="why__grid">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={item.title} className="whycard" delay={0.06 * (i % 2)}>
                <div className="whycard__ic">
                  <Icon />
                </div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
