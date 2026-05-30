import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import {
  ToolIcon,
  QualityIcon,
  CraneIcon,
  TruckCraneIcon,
  FormworkIcon,
  SystemIcon,
  TargetIcon,
  GeodesyIcon,
  SupervisionIcon,
} from '@/components/icons';

const TECH_ICONS = [CraneIcon, TruckCraneIcon, FormworkIcon, SystemIcon];
const TECH_VENDORS = [null, null, 'PERI · DE', 'DOKA · AT'];
const QUALITY_ICONS = [TargetIcon, GeodesyIcon, SupervisionIcon];

export function TechSafety() {
  const t = useTranslations('tech');
  const techItems = t.raw('techItems') as string[];
  const qualityItems = t.raw('qualityItems') as { title: string; text: string }[];

  return (
    <section className="section dark-block">
      <div className="dark-block__pattern" />
      <div className="container">
        <div className="ts-grid">
          <Reveal className="ts-col">
            <p className="eyebrow eyebrow--on-dark">{t('eyebrowLeft')}</p>
            <h3>
              <span className="ic">
                <ToolIcon />
              </span>
              {t('techTitle')}
            </h3>
            <ul className="ts-list">
              {techItems.map((item, i) => {
                const Icon = TECH_ICONS[i];
                return (
                  <li key={item}>
                    <Icon />
                    {item}
                    {TECH_VENDORS[i] && <span className="vendor">{TECH_VENDORS[i]}</span>}
                  </li>
                );
              })}
            </ul>
            <p className="ts-note">{t('techNote')}</p>
          </Reveal>

          <Reveal className="ts-col" delay={0.08}>
            <p className="eyebrow eyebrow--on-dark">{t('eyebrowRight')}</p>
            <h3>
              <span className="ic">
                <QualityIcon />
              </span>
              {t('qualityTitle')}
            </h3>
            <ul className="ts-quality-list">
              {qualityItems.map((item, i) => {
                const Icon = QUALITY_ICONS[i];
                return (
                  <li key={item.title}>
                    <span className="qic">
                      <Icon />
                    </span>
                    <div>
                      <div className="qt">{item.title}</div>
                      <div className="qd">{item.text}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="ts-standards">
              <p className="ts-standards__label">{t('qualityStdLabel')}</p>
              <p className="ts-standards__line">{t('qualityStandards')}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
