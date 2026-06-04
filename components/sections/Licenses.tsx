import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { LicenseGallery, type LicenseCard } from '@/components/ui/LicenseGallery';

type LicenseText = { title: string; code: string };

/** Сканы лицензий: мета (одинакова для всех локалей), сопоставляется по коду. */
const LICENSE_MEDIA: Record<string, { src: string; width: number; height: number }> = {
  'ՔՊԼ-000231': { src: '/docs/license-KPL-000231.png', width: 2100, height: 1480 },
};

export function Licenses() {
  const t = useTranslations('licenses');
  const texts = (t.raw('items') as LicenseText[]) ?? [];

  const items: LicenseCard[] = texts
    .map((it) => {
      const media = LICENSE_MEDIA[it.code];
      return media ? { ...it, ...media } : null;
    })
    .filter((c): c is LicenseCard => c !== null);

  return (
    <section className="section licenses section--tight">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="h-section">{t('heading')}</h2>
        </Reveal>
        <Reveal>
          <LicenseGallery items={items} viewLabel={t('view')} />
        </Reveal>
      </div>
    </section>
  );
}
