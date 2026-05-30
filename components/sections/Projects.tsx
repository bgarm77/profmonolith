import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { getProjectsWithPhotos, type ProjectWithPhotos } from '@/lib/projects';

export async function Projects() {
  const t = await getTranslations('projects');
  const items = await getProjectsWithPhotos();

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="h-section">
            {t('headingLine1')}
            <br />
            {t('headingLine2')}
          </h2>
        </Reveal>

        <div className="projects__grid">
          {items.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export type { ProjectWithPhotos };
