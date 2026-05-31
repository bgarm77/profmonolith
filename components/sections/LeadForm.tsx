'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { PhoneIcon } from '@/components/icons';
import { resolveUtm } from '@/lib/utm';
import { site } from '@/lib/site';

const schema = z.object({
  name: z.string().min(2).max(200),
  phone: z.string().min(5).max(40),
  email: z.string().email().or(z.literal('')).optional(),
  project: z.string().min(10).max(5000),
});

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldKey = 'name' | 'phone' | 'email' | 'project';

// Основное имя — NEXT_PUBLIC_WEB3FORMS_KEY (задано в Vercel). Фолбэк на
// NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY — на случай альтернативного названия в окружении.
const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ??
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export function LeadForm() {
  const t = useTranslations('form');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => {
    setUtm(resolveUtm());
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!WEB3FORMS_KEY) {
      console.error(
        'Web3Forms: переменная NEXT_PUBLIC_WEB3FORMS_KEY не задана — заявка не будет отправлена.',
      );
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrors({});

    const form = e.currentTarget;
    const data = new FormData(form);

    const parsed = schema.safeParse({
      name: data.get('name'),
      phone: data.get('phone'),
      email: data.get('email') || '',
      project: data.get('project'),
    });

    if (!parsed.success) {
      const errs: Partial<Record<FieldKey, boolean>> = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path[0] as FieldKey] = true;
      });
      setErrors(errs);
      setStatus('idle');
      return;
    }

    // Подмешиваем UTM, локаль, страницу, реферер
    Object.entries(utm).forEach(([k, v]) => data.append(k, v));
    data.append('page_locale', locale);
    data.append('page_url', window.location.href);
    data.append('referrer', document.referrer || 'direct');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="section cta-form" id="lead">
      <div className="cta-form__pattern" />
      <div className="container">
        <div className="form-grid">
          <Reveal className="form-intro">
            <p className="eyebrow eyebrow--on-dark">{t('eyebrow')}</p>
            <h2>{t('title')}</h2>
            <p>{t('sub')}</p>
            <div className="form-alt">
              <PhoneIcon />
              <div>
                <div className="l">{t('altLabel')}</div>
                <div className="p">
                  <a href={site.phoneHref}>{site.phone}</a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="form-card" delay={0.08} as="div">
            <form onSubmit={onSubmit} noValidate>
              {/* Обязательные служебные поля Web3Forms */}
              <input type="hidden" name="access_key" value={WEB3FORMS_KEY ?? ''} />
              <input type="hidden" name="subject" value="Новая заявка с сайта profmonolith.am" />
              <input type="hidden" name="from_name" value="Profmonolith Landing" />
              {/* honeypot */}
              <input
                type="checkbox"
                name="botcheck"
                className="hp-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />

              <div className="field">
                <label htmlFor="lf-name">
                  {t('labelName')} <span className="req">*</span>
                </label>
                <input
                  id="lf-name"
                  name="name"
                  type="text"
                  required
                  placeholder={t('namePlaceholder')}
                  aria-invalid={errors.name ? 'true' : undefined}
                />
                {errors.name && <span className="field-error">{t('errors.name')}</span>}
              </div>

              <div className="field">
                <label htmlFor="lf-phone">
                  {t('labelPhone')} <span className="req">*</span>
                </label>
                <input
                  id="lf-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder={t('phonePlaceholder')}
                  aria-invalid={errors.phone ? 'true' : undefined}
                />
                {errors.phone && <span className="field-error">{t('errors.phone')}</span>}
              </div>

              <div className="field">
                <label htmlFor="lf-email">{t('labelEmail')}</label>
                <input
                  id="lf-email"
                  name="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  aria-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <span className="field-error">{t('errors.email')}</span>}
              </div>

              <div className="field">
                <label htmlFor="lf-project">
                  {t('labelProject')} <span className="req">*</span>
                </label>
                <textarea
                  id="lf-project"
                  name="project"
                  required
                  placeholder={t('projectPlaceholder')}
                  aria-invalid={errors.project ? 'true' : undefined}
                />
                {errors.project && <span className="field-error">{t('errors.project')}</span>}
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full btn--lg"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? t('sending') : t('submit')}
              </button>

              <p className="form-fine">{t('consent')}</p>

              {status === 'success' && (
                <div className="form-status form-status--success" role="status">
                  {t('successMessage')}
                </div>
              )}
              {status === 'error' && (
                <div className="form-status form-status--error" role="alert">
                  {t('errorMessage')}
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
