import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';

type Step = { title: string; text: string };

export function Process() {
  const t = useTranslations('process');
  const steps = t.raw('steps') as Step[];

  return (
    <section className="section process">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="h-section">{t('heading')}</h2>
        </Reveal>
        <div className="timeline">
          {steps.map((step, i) => (
            <Reveal key={step.title} className="step" delay={0.08 * i}>
              <div className="step__num">{i + 1}</div>
              <div className="step__txt">
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
