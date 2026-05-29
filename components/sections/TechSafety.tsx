import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import {
  ToolIcon,
  ShieldIcon,
  CraneIcon,
  TruckCraneIcon,
  FormworkIcon,
  SystemIcon,
  NetIcon,
  EdgeIcon,
  StairsIcon,
  DustNetIcon,
} from '@/components/icons';

const TECH_ICONS = [CraneIcon, TruckCraneIcon, FormworkIcon, SystemIcon];
const TECH_VENDORS = [null, null, 'PERI · DE', 'DOKA · AT'];
const SAFETY_ICONS = [NetIcon, EdgeIcon, StairsIcon, DustNetIcon];

export function TechSafety() {
  const t = useTranslations('tech');
  const techItems = t.raw('techItems') as string[];
  const safetyItems = t.raw('safetyItems') as string[];

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
                <ShieldIcon />
              </span>
              {t('safetyTitle')}
            </h3>
            <ul className="ts-list">
              {safetyItems.map((item, i) => {
                const Icon = SAFETY_ICONS[i];
                return (
                  <li key={item}>
                    <Icon />
                    {item}
                  </li>
                );
              })}
            </ul>
            <div className="ts-safety-stat">
              <div>
                <div className="num">
                  <CountUp to={0} />
                </div>
                <div className="lab">{t('safetyAccidents')}</div>
              </div>
              <div>
                <div className="num">
                  <CountUp to={17} />
                </div>
                <div className="lab">{t('safetyYears')}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
