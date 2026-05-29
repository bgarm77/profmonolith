import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { Hero } from '@/components/sections/Hero';
import { Numbers } from '@/components/sections/Numbers';
import { Projects } from '@/components/sections/Projects';
import { TechSafety } from '@/components/sections/TechSafety';
import { Process } from '@/components/sections/Process';
import { Trust } from '@/components/sections/Trust';
import { WhyUs } from '@/components/sections/WhyUs';
import { Licenses } from '@/components/sections/Licenses';
import { LeadForm } from '@/components/sections/LeadForm';
import { Contacts } from '@/components/sections/Contacts';
import { Schema } from '@/components/Schema';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });

  return (
    <>
      <Schema description={t('description')} />
      <Header />
      <main>
        <Hero />
        <Numbers />
        {/* Projects — серверный компонент (читает фото с диска) */}
        <Projects />
        <TechSafety />
        <Process />
        <Trust />
        <WhyUs />
        <Licenses />
        <LeadForm />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
