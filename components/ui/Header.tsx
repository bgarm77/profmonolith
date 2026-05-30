'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Link, usePathname } from '@/i18n/navigation';
import logoWhite from '@/public/logos/logo-white.png';

const NAV_LINKS = [
  { href: '#top', key: 'home', page: false },
  { href: '#projects', key: 'projects', page: false },
  { href: '#why', key: 'advantages', page: false },
  { href: '/safety', key: 'safety', page: true },
  { href: '#contacts', key: 'contacts', page: false },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const isHome = pathname === '/';
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

  // Якорь главной: на главной — обычный плавный скролл (<a>),
  // с других страниц — переход на главную с тем же якорем (next-intl Link).
  const Anchor = ({
    hash,
    className,
    onClick,
    children,
  }: {
    hash: string;
    className?: string;
    onClick?: () => void;
    children: ReactNode;
  }) =>
    isHome ? (
      <a href={hash} className={className} onClick={onClick}>
        {children}
      </a>
    ) : (
      <Link href={`/${hash}`} className={className} onClick={onClick}>
        {children}
      </Link>
    );

  return (
    <>
      <header className={navClass} id="nav">
        <div className="container nav__inner">
          {isHome ? (
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
          ) : (
            <Link href="/" aria-label="PROFMONOLITH">
              <Image
                className="nav__logo"
                src={logoWhite}
                alt="PROFMONOLITH"
                priority
                height={30}
                style={{ width: 'auto', height: '30px' }}
              />
            </Link>
          )}
          <nav>
            <ul className="nav__menu">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  {l.page ? (
                    <Link href={l.href}>{t(l.key)}</Link>
                  ) : (
                    <Anchor hash={l.href}>{t(l.key)}</Anchor>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__right">
            <LanguageSwitcher />
            <Anchor hash="#lead" className="btn btn--primary nav__cta">
              {t('cta')}
            </Anchor>
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
        {NAV_LINKS.map((l) =>
          l.page ? (
            <Link key={l.href} href={l.href} onClick={() => setDrawerOpen(false)}>
              {t(l.key)}
            </Link>
          ) : (
            <Anchor key={l.href} hash={l.href} onClick={() => setDrawerOpen(false)}>
              {t(l.key)}
            </Anchor>
          )
        )}
        <Anchor hash="#lead" className="btn btn--primary btn--lg" onClick={() => setDrawerOpen(false)}>
          {t('cta')}
        </Anchor>
      </div>
    </>
  );
}
