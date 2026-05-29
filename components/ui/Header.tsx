'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import logoWhite from '@/public/logos/logo-white.png';

const NAV_LINKS = [
  { href: '#top', key: 'home' },
  { href: '#projects', key: 'projects' },
  { href: '#why', key: 'advantages' },
  { href: '#contacts', key: 'contacts' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // sticky + hide-on-scroll
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 480 && y > lastY + 4) setHidden(true);
      else if (y < lastY - 4) setHidden(false);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // блокировка скролла при открытом drawer
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navClass = ['nav', scrolled ? 'is-scrolled' : '', hidden ? 'is-hidden' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={navClass} id="nav">
        <div className="container nav__inner">
          <a href="#top" aria-label="PROFMONOLITH">
            <Image
              className="nav__logo"
              src={logoWhite}
              alt="PROFMONOLITH"
              priority
              height={30}
              style={{ width: 'auto', height: '30px' }}
            />
          </a>
          <nav>
            <ul className="nav__menu">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{t(l.key)}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__right">
            <LanguageSwitcher />
            <a href="#lead" className="btn btn--primary nav__cta">
              {t('cta')}
            </a>
            <button
              type="button"
              className={drawerOpen ? 'burger is-open' : 'burger'}
              aria-label="Menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={drawerOpen ? 'drawer is-open' : 'drawer'} id="drawer">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setDrawerOpen(false)}>
            {t(l.key)}
          </a>
        ))}
        <a href="#lead" className="btn btn--primary btn--lg" onClick={() => setDrawerOpen(false)}>
          {t('cta')}
        </a>
      </div>
    </>
  );
}
