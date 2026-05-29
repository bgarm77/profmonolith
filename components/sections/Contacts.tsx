import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { UsersIcon, PinIcon, PhoneIcon, MailIcon, GlobeIcon } from '@/components/icons';
import { site } from '@/lib/site';

export function Contacts() {
  const t = useTranslations('contacts');

  return (
    <section className="section contacts" id="contacts">
      <div className="container">
        <div className="contacts__grid">
          <Reveal>
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="h-section">{t('heading')}</h2>
            <ul className="contact-list">
              <li>
                <span className="ic">
                  <UsersIcon />
                </span>
                <div>
                  <div className="l">{t('directorLabel')}</div>
                  <div className="v">{t('directorName')}</div>
                </div>
              </li>
              <li>
                <span className="ic">
                  <PinIcon />
                </span>
                <div>
                  <div className="l">{t('addressLabel')}</div>
                  <div className="v">{t('addressValue')}</div>
                </div>
              </li>
              <li>
                <span className="ic">
                  <PhoneIcon />
                </span>
                <div>
                  <div className="l">{t('phoneLabel')}</div>
                  <a className="v" href={site.phoneHref}>
                    {site.phone}
                  </a>
                </div>
              </li>
              <li>
                <span className="ic">
                  <MailIcon />
                </span>
                <div>
                  <div className="l">{t('emailLabel')}</div>
                  <a className="v" href={site.emailHref}>
                    {site.email}
                  </a>
                </div>
              </li>
              <li>
                <span className="ic">
                  <GlobeIcon />
                </span>
                <div>
                  <div className="l">{t('siteLabel')}</div>
                  <a className="v" href="#top">
                    {site.domain}
                  </a>
                </div>
              </li>
            </ul>
          </Reveal>
          <Reveal className="map-embed" delay={0.08}>
            <iframe src={site.mapEmbed} loading="lazy" title={t('mapTitle')} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
