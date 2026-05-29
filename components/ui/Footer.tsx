import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { site } from '@/lib/site';
import { FacebookIcon, InstagramIcon } from '@/components/icons';
import logoWhite from '@/public/logos/logo-white.png';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <Image
            className="footer__logo"
            src={logoWhite}
            alt="PROFMONOLITH"
            height={30}
            style={{ width: 'auto', height: '30px' }}
          />
          <div className="footer__social">
            {/* Заглушки: реальные ссылки добавим позже (см. TODO.md) */}
            <a href={site.facebook} aria-label={t('facebook')} rel="noopener noreferrer">
              <FacebookIcon />
            </a>
            <a href={site.instagram} aria-label={t('instagram')} rel="noopener noreferrer">
              <InstagramIcon />
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>{t('rights')}</span>
        </div>
      </div>
    </footer>
  );
}
