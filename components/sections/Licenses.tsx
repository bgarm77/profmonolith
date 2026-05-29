import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { FileIcon } from '@/components/icons';

export function Licenses() {
  const t = useTranslations('licenses');

  return (
    <section className="section licenses section--tight">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="h-section">{t('heading')}</h2>
          <p className="lead">{t('lead')}</p>
        </Reveal>
        <div className="lic-grid">
          {[0, 1, 2, 3].map((i) => (
            <Reveal key={i} className="lic-ph" delay={0.06 * i}>
              <FileIcon />
              <span>{t('soon')}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
