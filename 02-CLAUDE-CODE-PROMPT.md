# Promпт для Claude Code — production-лендинг Profmonolith

> **Как использовать:** скопируйте всё содержимое после линии и вставьте в Claude Code как первое сообщение в новой сессии. Убедитесь что находитесь в пустой папке `profmonolith/`. Claude Code должен сначала прочитать всё, задать уточняющие вопросы (если есть), потом переключиться в **Plan Mode** и показать план задач, и только после вашего одобрения начинать выполнение.

---

# ROLE

Ты — senior fullstack-разработчик, специализируешься на Next.js 15 (App Router), TypeScript, Tailwind, Vercel, корпоративных лендингах с акцентом на конверсию и производительность. Тебе доверили production-сборку B2B-лендинга для строительной компании в Армении.

Действуй методично. Прежде чем писать код:

1. Прочитай **весь** этот документ от начала до конца.
2. Изучи **все** входные материалы из папки `inputs/` (дизайн от Claude Design, фото из портфолио, логотипы, брендбук).
3. Если что-то непонятно или входные данные противоречат друг другу — задай вопросы пользователю. **Не угадывай.**
4. После прочтения переключись в **Plan Mode** и предложи декомпозицию на задачи. Дождись одобрения плана.
5. Выполняй задачи **по одной**, после каждой делай commit с осмысленным сообщением.
6. После каждой логически завершённой задачи — `git push` (если репозиторий уже настроен). Vercel автоматически развернёт.

---

# КОНТЕКСТ ПРОЕКТА

**Заказчик:** ООО «Профмонолит» (profmonolith.am) — подрядчик по монолитному строительству в Армении. Работают с 2008 года. Директор: Арман Карапетян. Адрес: Ереван, ул. Грибоедова 54/1. Телефон: +374 99 050488. Email: monilitarmenia@gmail.com.

**Цель сайта:** B2B-лендинг для привлечения заявок от **девелоперов** (юридические лица — застройщики жилья). Главная метрика — заявка через форму или звонок.

**Что у тебя уже есть на входе** (папка `inputs/`):

- `inputs/design/` — готовый дизайн от Claude Design: `Profmonolith Landing.html` + `styles.css` + `script.js` + `i18n.js` + `assets/` (логотипы + паттерны). **Это твой главный визуальный референс.** Структура секций, типографика, цвета, иконки SVG, разметка — берём отсюда. Но это статический HTML — твоя задача переписать его на Next.js + Tailwind, исправив баги (см. секцию «Что исправить» ниже).
- `inputs/brandbook/` — PDF брендбука Profmonolith 2026 + логотипы (RGB, white, black, CMYK) + палитра + паттерны.
- `inputs/portfolio/` — PDF корпоративного портфолио 2026. Источник фотографий проектов. Извлечь нужно фото 5 ЖК (Гюрджян Каскад, Ани Премиум, Ленинградян Резиденс, Firdus Prime, Рубинянц Комплекс) — 4–6 фото на каждый проект (рендеры + фото со стройки).
- `inputs/photos/` (если есть отдельно) — фото объектов высокого разрешения.

---

# ТЕХНИЧЕСКИЙ СТЕК

- **Next.js 15** (App Router, RSC по умолчанию)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (через `@tailwindcss/postcss`)
- **next-intl** v3+ для i18n с URL-сегментами (`/hy`, `/ru`, `/en`)
- **next/font** для шрифтов (Montserrat, Orbitron, Noto Sans Armenian)
- **next/image** для оптимизации фото (AVIF/WebP, lazy-load, responsive sizes)
- **Framer Motion** для появлений секций при скролле и count-up чисел
- **PhotoSwipe v5** для лайтбокса фото проектов
- **Web3Forms** для отправки заявок (см. секцию «Форма заявки» ниже)
- **Zod** для клиентской валидации формы
- **Vercel** для хостинга + аналитика (`@vercel/analytics`)

**Никаких лишних библиотек.** Если что-то делается одной строкой нативно — не тяни пакет.

---

# СТРУКТУРА ПРОЕКТА (создать именно так)

```
profmonolith/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                    # корневой layout с NextIntlClientProvider
│   │   ├── page.tsx                      # главная страница (собирает все секции)
│   │   └── opengraph-image.tsx           # OG-изображение для шеринга
│   ├── robots.ts                         # robots.txt
│   ├── sitemap.ts                        # sitemap.xml с тремя локалями
│   └── globals.css                       # Tailwind + кастомные CSS-переменные брендбука
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Numbers.tsx
│   │   ├── Projects.tsx
│   │   ├── TechSafety.tsx
│   │   ├── Process.tsx
│   │   ├── Trust.tsx
│   │   ├── WhyUs.tsx
│   │   ├── Licenses.tsx
│   │   ├── LeadForm.tsx
│   │   └── Contacts.tsx
│   ├── ui/
│   │   ├── Header.tsx                    # sticky nav + lang switch + бургер
│   │   ├── Footer.tsx                    # лого + FB/IG + копирайт
│   │   ├── LanguageSwitcher.tsx
│   │   ├── Button.tsx
│   │   ├── Lightbox.tsx                  # PhotoSwipe wrapper
│   │   ├── CountUp.tsx                   # анимированный счётчик чисел
│   │   └── Reveal.tsx                    # обёртка для fade-in при скролле
│   └── icons/                            # SVG-иконки как React-компоненты
├── i18n/
│   ├── request.ts                        # next-intl config
│   ├── routing.ts                        # locales: ['hy','ru','en'], defaultLocale: 'hy'
│   └── messages/
│       ├── hy.json
│       ├── ru.json
│       └── en.json
├── lib/
│   ├── geo.ts                            # определение языка по IP (Vercel geolocation)
│   └── utm.ts                            # хелпер для UTM-параметров
├── middleware.ts                         # next-intl + geo-redirect для дефолтной локали
├── public/
│   ├── photos/
│   │   ├── gyurjyan/                     # фото ЖК Гюрджян Каскад (4-6 файлов)
│   │   ├── ani/
│   │   ├── leningradyan/
│   │   ├── firdus/
│   │   └── rubinyants/
│   ├── logos/
│   │   ├── logo-white.png
│   │   ├── logo-color.png
│   │   └── logo-black.png
│   ├── patterns/
│   │   ├── pattern-navy.png
│   │   └── pattern-gray.png
│   ├── favicon.ico                       # сгенерировать из логотипа
│   ├── apple-touch-icon.png
│   └── og-image.jpg                      # 1200×630 для шеринга
├── .env.example
├── .env.local                            # (gitignored) реальные ключи
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── package.json
└── README.md
```

---

# ДИЗАЙН-СИСТЕМА (из брендбука)

В `app/globals.css` или Tailwind config объяви эти переменные:

```css
:root {
  /* Brand colors */
  --color-navy: #204266;      /* primary brand */
  --color-blue: #3A86FF;      /* accent / CTA */
  --color-steel: #90A1AD;     /* secondary text */
  --color-cream: #F5F6F8;     /* light section bg */
  --color-dark: #0d1822;      /* darkest bg */
  --color-white: #FFFFFF;
  
  /* Typography */
  --font-main: 'Montserrat', 'Noto Sans Armenian', sans-serif;
  --font-tech: 'Orbitron', monospace;
  
  /* Patterns (используй существующие из inputs/brandbook/) */
  --pattern-navy: url('/patterns/pattern-navy.png');
  --pattern-gray: url('/patterns/pattern-gray.png');
}
```

Все размеры — через `clamp()` (например `font-size: clamp(28px, 5vw, 48px)`). **Никаких inline-стилей с фиксированными px** на тексте или ширине контейнеров.

---

# I18N И ГЕО-ДЕФОЛТ ЯЗЫКА

**Маршрутизация:** `/hy`, `/ru`, `/en` через next-intl. Корневой `/` редиректит на одну из локалей в зависимости от IP.

**Логика гео-дефолта** (в `middleware.ts`, использовать `request.geo.country` из Vercel Edge):

```typescript
function getDefaultLocale(country?: string): 'hy' | 'ru' | 'en' {
  if (!country) return 'hy';
  if (country === 'AM') return 'hy';
  if (['RU','BY','KZ','KG','UZ','TJ','MD','UA','GE'].includes(country)) return 'ru';
  return 'en';
}
```

Переключатель языка в шапке сохраняет выбор в cookie `NEXT_LOCALE` (это стандарт next-intl). При следующем визите cookie перекрывает гео.

**Файлы переводов** — `i18n/messages/{hy,ru,en}.json`. Структура ключей:

```json
{
  "nav": { "home": "...", "projects": "...", "advantages": "...", "contact": "...", "cta": "..." },
  "hero": { "eyebrow": "...", "title": "...", "titleAccent": "...", "sub": "...", "ctaPrimary": "...", "ctaSecondary": "..." },
  "stats": { "m2": "...", "years": "...", "accidents": "...", "active": "..." },
  "numbers": { ... },
  "projects": { "heading": "...", "sub": "...", "viewPhotos": "...", "items": { "gyurjyan": {...}, "ani": {...}, ... } },
  ...
}
```

**ВАЖНО — точные тексты** возьми из `inputs/design/i18n.js` (там Claude Design уже сделал переводы), но проверь критичные строки против этого документа (секция «КОНТЕНТ» ниже).

---

# КОНТЕНТ — ЗАФИКСИРОВАННЫЕ ТЕКСТЫ И ЦИФРЫ

### Hero (вариант **A** — большой логотип + заголовок)

| Поле | Русский | Армянский | English |
|---|---|---|---|
| Eyebrow | Монолитное строительство · Ереван · с 2008 | Մոնոլիտ շինարարություն · Երևան · 2008-ից | Monolithic construction · Yerevan · since 2008 |
| Title (часть 1) | Монолитное строительство | Մոնոլիտ շինարարություն | Monolithic construction |
| Title (часть 2, accent) | для лидеров Армении | Հայաստանի առաջատարների համար | for Armenia's leaders |
| Sub | 17 лет работаем с девелоперами, государством и крупным бизнесом. От Армянской АЭС до жилых комплексов премиум-класса. | 17 տարի աշխատում ենք դևելոպերների, պետության և խոշոր բիզնեսների հետ։ Հայկական ԱԷԿ-ից մինչև պրեմիում դասի բնակելի համալիրներ։ | For 17 years working with developers, government and large business. From Armenian NPP to premium residential complexes. |
| CTA primary | Получить расчёт за 24 часа | Ստանալ հաշվարկ 24 ժամում | Get an estimate in 24h |
| CTA secondary | +374 99 050488 | +374 99 050488 | +374 99 050488 |

> 🔴 **КРИТИЧЕСКИ ВАЖНО:** Claude Design в варианте hero написал «Профессиональное строительство». Везде заменить на «**Монолитное строительство**» (русский) / «**Մոնոլիտ շինարարություն**» (армянский) / «**Monolithic construction**» (английский).

### Hero stats (4 цифры внизу первого экрана)

| Число | Подпись (ru) | Подпись (hy) | Подпись (en) |
|---|---|---|---|
| 350,000+ | м² монолита реализовано | մ² մոնոլիտ իրականացված | m² of monolith delivered |
| 17 | лет на рынке | տարի շուկայում | years on the market |
| 0 | несчастных случаев | դժբախտ պատահար | accidents |
| 5 | ЖК в работе сейчас | բնակելի համալիր ընթացքում | residential complexes in progress |

### Секция «Цифры» (Numbers)

🔴 **КРИТИЧЕСКАЯ ОШИБКА В ДИЗАЙНЕ:** Claude Design написал неправильные цифры (11 лет, 130 сотрудников, 5 бригад, 226 941 м²). **Используй ТОЛЬКО эти цифры:**

| Число | Подпись (ru) |
|---|---|
| 17+ | лет на рынке |
| 200+ | сотрудников и инженеров |
| 8 | специализированных бригад |
| 350,000+ | м² монолита реализовано |
| 0 | несчастных случаев |
| ✓ (галочка) | всегда раньше срока |

Заголовок секции: «**Масштаб, который говорит сам за себя**».

### Проекты (5 ЖК)

| Slug | Название | Адрес | Этажи | м² | Статус | Фото |
|---|---|---|---|---|---|---|
| gyurjyan | Гюрджян Каскад | Нор Норк, Гюрджян 14/1 | 18 зданий, 12–16 эт. | 196,679 м² | В работе (6 сдано, 9 строится, 3 в очереди) | 6 фото |
| ani | Ани Премиум | Адонц 19/4 | 3 здания, 16 эт. | 50,000 м² | Сдан · январь 2026 | 5 фото |
| leningradyan | Ленинградян Резиденс | Ленинградян 19/12 | 3 здания, 16 эт. | 45,000 м² | В работе (на 2.5 мес раньше срока) | 5 фото |
| firdus | Firdus Prime | Ханджян 9/6 · PREMIUM | этап: –2 этаж | ~17,000 м² | В работе | 4 фото |
| rubinyants | Рубинянц Комплекс | Рубинянц 27/16 | 3 здания, 16 эт. | 45,000 м² | В работе | 5 фото |

**Гюрджян Каскад — флагман,** показывается крупнее остальных (полная ширина первого ряда на десктопе).

### Технологии и безопасность

**Технологии:**
- 7 собственных башенных кранов
- 4 собственных автокрана
- Опалубка **PERI** (Германия)
- Системы **DOKA** (Австрия)
- Пометка: «Собственный парк = независимость от субподрядчиков и предсказуемые сроки»

**Безопасность:**
- Защитные сетки ЗУС
- Edge Protection System (защита краёв этажей)
- Защита лестничных клеток и шахт
- Пылеподавляющие экосетки на объектах
- Внизу: **0** несчастных случаев · **17** лет безопасной работы

### Процесс (5 шагов)

1. **Анализ проекта** — изучаем архитектурный и инженерный проект, оцениваем объём.
2. **Планирование ресурсов** — график, команда, материалы и техника под ваш объект.
3. **Строительство** — монолитные работы с опалубкой PERI и системами DOKA.
4. **Контроль качества** — проверка на каждом этапе: геометрия, бетон, армирование.
5. **Сдача в срок или раньше** — документирование и передача готового монолита заказчику.

### Trust — три подблока

**Заголовок секции:** «Нам доверяют» / «350 000+ м² для лидеров Армении»

**6.1 Государство и крупный бизнес** (9 текстовых карточек на тёмно-синем фоне с диагональным паттерном):

| Год | Организация |
|---|---|
| 2014 | Министерство обороны РА |
| 2016 | Министерство образования и науки РА |
| 2022 | Армянская АЭС (Мецамор) |
| 2022 | Спорткомплекс им. К. Демирчяна |
| 2015–2016 | Веолия Джур · Հայջրմուղկոյուղի |
| 2014 | ProCredit Bank |
| 2022 | Yandex.Taxi Armenia |
| 2021 | Telecom Armenia |
| 2022 | Hotel Aghveran |

**6.2 Девелоперы выбирают нас** (9 текстовых карточек, светлее по тону):

| Год | Девелопер |
|---|---|
| 2021 | MGS Development |
| 2021 | Modern Town |
| 2021 | ArtCo · artco.am |
| 2022 | San Holding |
| 2022 | De Builders |
| 2022 | SAF Capital |
| 2023 | Binam |
| 2023 | Black Stone |
| 2023 | Atlant Shin |

**6.3 Возвращаются годами** (полоса с 3 крупными цифрами):

- **11 лет** — Es-Ti-Service сотрудничает с нами с 2013 года
- **9 лет** — Elektron BBE — постоянный клиент с 2015 года
- **10+ лет** — Diaconia Foundation — повторяющийся заказчик

Финальная строка: «Возвращаются — значит, не подвели ни разу».

### Почему мы (4 пункта)

1. **Сдаём раньше срока** — Стабильно на 1–2 месяца, на крупных ЖК — до 2.5 месяцев раньше договора.
2. **Сильная безопасность** — 0 несчастных случаев за 17 лет работы на всех объектах.
3. **Свой технический парк** — Краны, опалубка и техника в собственности — независимость от субподрядчиков.
4. **Доверие лидеров** — 17 лет девелоперы и государство выбирают нас своим подрядчиком.

### Лицензии (заглушка)

Заголовок: «Лицензии и сертификаты».
Подзаголовок: «Раздел в наполнении — сканы документов будут добавлены».
4 пустые пунктирные карточки с иконкой документа и подписью «СКОРО».

### Форма заявки (Lead Form)

**Левая колонка (intro на тёмном фоне):**
- Eyebrow: «Для девелоперов»
- Title: «Получить расчёт за 24 часа»
- Sub: «Расскажите о проекте — пришлём оценку монолитных работ в течение 1 рабочего дня. Без обязательств.»
- Альтернатива: «Или позвоните напрямую: **+374 99 050488**» (кликабельный tel:)

**Правая колонка (форма):**
- Имя / Название компании * (text, required, min 2 chars)
- Телефон * (tel, required, любой формат)
- Email (email, optional, но если заполнено — валидировать)
- Описание проекта * (textarea, required, min 10 chars) — placeholder: «Адрес, этажность, общая площадь монолита (м²)…»
- Кнопка «Отправить заявку» (full-width, primary)
- Микро-копирайт: «Нажимая кнопку, вы соглашаетесь с обработкой данных.»
- После успешной отправки: «Спасибо! Заявка принята — мы свяжемся с вами в течение 1 рабочего дня.»

**Скрытые поля (для UTM):** при загрузке страницы прочитать `?utm_source=...&utm_medium=...&utm_campaign=...&utm_content=...&utm_term=...` из URL, сохранить в `sessionStorage`, добавить в payload формы.

### Контакты + футер

**Контакты:**
- Директор: Арман Карапетян
- Адрес: Армения, г. Ереван, Грибоедова 54/1
- Телефон: +374 99 050488 (tel:)
- Email: monilitarmenia@gmail.com (mailto:)
- Сайт: profmonolith.am

**Карта:** Google Maps embed (или OpenStreetMap embed, как в Design — оба варианта приемлемы; на Vercel оба работают). Координаты офиса найди через геокодинг адреса.

**Футер:**
- Логотип PROFMONOLITH (белый)
- Иконки **Facebook** и **Instagram** (SVG, ссылки `#` — заглушки, добавим позже когда заказчик пришлёт)
- Копирайт: «© 2008 — 2026 PROFMONOLITH LLC. Все права защищены.»
- **УБРАТЬ** надпись «SITE BY CLAUDE CODE» — она была в дизайне, не нужна.

---

# ЧТО ИСПРАВИТЬ ПО СРАВНЕНИЮ С ДИЗАЙНОМ

Дизайн от Claude Design — отличный референс, но имеет конкретные баги. Их нужно исправить при переписывании на Next.js:

### 🔴 Критичные

1. **Цифры в Numbers неправильные.** Используй цифры из таблицы выше (17, 200, 8, 350000, 0, ✓). НЕ 11/130/5/226941.
2. **Inline-стили в hero ломают мобильную адаптивность.** В исходном HTML на логотипе `style="width: 709px; height: 113px"`, на заголовке `style="font-size: 46px"`. Заменить на адаптивные классы Tailwind с `clamp()`:
   - Логотип: `max-width: clamp(280px, 50vw, 720px); width: 100%; height: auto;`
   - Заголовок h1: `text-[clamp(28px,5.5vw,56px)]` или эквивалент через Tailwind arbitrary values.
3. **Горизонтальный overflow на мобильном.** На `<html>` и `<body>` поставить `overflow-x: hidden`. Проверить все widgets — особенно Process timeline (горизонтальный flex без wrap), Trust grids.
4. **«Профессиональное строительство» → «Монолитное строительство»** в hero title (все 3 локали).
5. **«SITE BY CLAUDE CODE»** в футере — удалить.

### 🟡 Средние

6. Главная CTA-кнопка в hero (`Получить расчёт за 24 часа`) — должна быть **яркой синей** (`bg-[#3A86FF]`), не прозрачной с белой рамкой.
7. Удалить из HTML/JSX все ссылки на `tweaks-panel.jsx`, `tweaks.jsx`, `<div id="tweaks-root">`, React-скрипты с unpkg — это служебная панель самого Claude Design.
8. Все SVG-иконки из исходного HTML вынести в отдельные React-компоненты в `components/icons/`.
9. `script.js` от Design — не подключать. Перепиши его логику на React (count-up через Framer Motion, lightbox через PhotoSwipe, sticky-nav через `useEffect`).

### 🟢 Мелкие

10. Фавикон — сгенерируй из `inputs/brandbook/PROFMONOLITH LOGO RGB_.png` (используй favicon-генератор или ручную нарезку). Положи в `public/favicon.ico` + `public/apple-touch-icon.png` (180×180).
11. Open Graph image (`og-image.jpg` 1200×630) — собери из логотипа на тёмно-синем фоне с подзаголовком.
12. Используй паттерны (`pattern-navy.png`, `pattern-gray.png`) из `inputs/design/assets/` как в исходном дизайне — для декоративных фонов тёмных и светлых секций.

---

# ФОРМА ЗАЯВКИ — ПОДРОБНО ПО WEB3FORMS

Web3Forms — это бесплатный сервис отправки форм без бэкенда. Заявка с формы уходит прямо на их API через `fetch`, и они мгновенно пересылают её по email. Никаких серверных функций, никакого SDK, никакой верификации домена.

**Преимущества для нашего случая:**
- 250 заявок/мес бесплатно (для B2B-лендинга реально хватит — обычно приходит 5–30 в месяц)
- Не нужны серверные API routes — форма работает чистым клиентским fetch
- Встроенный honeypot (поле `botcheck`) против ботов
- Поддерживает reply-to — при ответе на письмо отвечаете напрямую клиенту

**Минус, который нужно знать:** письма приходят от `noreply@web3forms.com` (это видно в поле "From"). Тема и содержимое — наши. Если в будущем заказчик захочет фирменный отправитель типа `noreply@profmonolith.am` — переключимся на Resend. Это записано в TODO.

### Как настроить Web3Forms

1. Заказчик идёт на [web3forms.com](https://web3forms.com), вводит email `monilitarmenia@gmail.com`, получает на почту **access key** (это бесплатно, регистрация не требуется).
2. Этот ключ кладётся в `.env.local` как `NEXT_PUBLIC_WEB3FORMS_KEY`.
3. Всё. Форма работает.

### Реализация формы (компонент `components/sections/LeadForm.tsx`)

Это **клиентский компонент** (`'use client'`), без серверных route. Логика:

```tsx
'use client';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';

const schema = z.object({
  name: z.string().min(2).max(200),
  phone: z.string().min(5).max(40),
  email: z.string().email().or(z.literal('')).optional(),
  project: z.string().min(10).max(5000),
});

export function LeadForm() {
  const t = useTranslations('form');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [utm, setUtm] = useState<Record<string,string>>({});

  // Читаем UTM из URL при загрузке
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u: Record<string,string> = {};
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k => {
      const v = params.get(k);
      if (v) u[k] = v;
    });
    // Если в URL есть UTM — сохраняем в sessionStorage (чтобы пережили навигацию)
    if (Object.keys(u).length) {
      sessionStorage.setItem('utm', JSON.stringify(u));
      setUtm(u);
    } else {
      // Иначе восстанавливаем из sessionStorage
      try {
        const saved = sessionStorage.getItem('utm');
        if (saved) setUtm(JSON.parse(saved));
      } catch {}
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrors({});

    const form = e.currentTarget;
    const data = new FormData(form);

    // Клиентская валидация
    const parsed = schema.safeParse({
      name: data.get('name'),
      phone: data.get('phone'),
      email: data.get('email') || '',
      project: data.get('project'),
    });
    if (!parsed.success) {
      const errs: Record<string,string> = {};
      parsed.error.issues.forEach(i => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      setStatus('idle');
      return;
    }

    // Подмешиваем UTM, locale, страницу
    Object.entries(utm).forEach(([k,v]) => data.append(k, v));
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
    <form onSubmit={onSubmit} className="...">
      {/* ВАЖНО: эти три hidden-поля обязательны для Web3Forms */}
      <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY} />
      <input type="hidden" name="subject" value="Новая заявка с сайта profmonolith.am" />
      <input type="hidden" name="from_name" value="Profmonolith Landing" />
      
      {/* honeypot — Web3Forms игнорирует заявки где это поле заполнено */}
      <input type="checkbox" name="botcheck" style={{display:'none'}} tabIndex={-1} autoComplete="off" />

      <input name="name" required placeholder={t('namePlaceholder')} />
      {errors.name && <span className="error">{t('errors.name')}</span>}
      
      <input name="phone" type="tel" required placeholder={t('phonePlaceholder')} />
      <input name="email" type="email" placeholder={t('emailPlaceholder')} />
      <textarea name="project" required placeholder={t('projectPlaceholder')} />

      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('sending') : t('submit')}
      </button>

      {status === 'success' && <div className="success">{t('successMessage')}</div>}
      {status === 'error' && <div className="error">{t('errorMessage')}</div>}
      
      <p className="fine">{t('consent')}</p>
    </form>
  );
}
```

**Замечание для тебя как разработчика:**
- Поле `access_key` должно быть `NEXT_PUBLIC_*`, потому что оно используется на клиенте. Это безопасно — ключ Web3Forms привязан к email, а не к секретам; даже если кто-то его узнает, спам легко фильтруется через rate-limit и honeypot.
- Web3Forms сам в письме добавляет все поля формы. Поэтому достаточно подмешать UTM-данные через `FormData.append()` — они окажутся в письме как обычные поля.
- Если в будущем нужна более продвинутая логика (например, разные шаблоны писем по локали, дополнительная защита, тяжёлая антиспам-логика) — это сигнал переключаться на Resend.

### Переменные окружения

`.env.local`:
```bash
NEXT_PUBLIC_WEB3FORMS_KEY=ваш_access_key_от_web3forms
NEXT_PUBLIC_SITE_URL=https://profmonolith.am
```

`.env.example` (коммитится в git):
```bash
# Web3Forms access key — получить на https://web3forms.com (бесплатно, по email)
NEXT_PUBLIC_WEB3FORMS_KEY=

# Production URL сайта (для canonical, OG, sitemap)
NEXT_PUBLIC_SITE_URL=https://profmonolith.am
```

**Запомни:** access_key пользователь получит сам — не пытайся его придумать или подставить. До получения ключа форма не будет работать, но это нормально — на этапе разработки можно проверить, что fetch выполняется и validation работает.

### Что приходит в письме

Web3Forms отправляет email в таком формате:

```
Subject: Новая заявка с сайта profmonolith.am
From: noreply@web3forms.com
To: monilitarmenia@gmail.com
Reply-To: (email клиента, если он указан)

────────────────────────────────────
name: Девелоперская компания «Глобал»
phone: +374 99 123456
email: contact@global.am
project: ЖК на проспекте Маштоца, 14 этажей, 38000 м²

page_locale: ru
page_url: https://profmonolith.am/ru#lead
referrer: https://google.com
utm_source: google
utm_medium: cpc
utm_campaign: developers_q1
────────────────────────────────────
```

Это все автоматически — мы только определяем какие поля отправляем, Web3Forms сам формирует письмо.

---

# ПРОИЗВОДИТЕЛЬНОСТЬ — ТРЕБОВАНИЯ

- **Lighthouse Performance ≥ 95** на десктопе и мобильном.
- **LCP < 2.5 сек** на 4G.
- **CLS < 0.1** (без перепрыгивания при загрузке шрифтов и изображений).
- Все фото — через `next/image` с явными `width`/`height` и `sizes`. Hero-фото — `priority`, остальные — `loading="lazy"`.
- Шрифты — через `next/font` с `display: swap` и `preload`. Кириллица + латиница + армянский — все subset включены.
- CSS — минифицирован. JS бандл первого экрана < 100 КБ gzipped.
- Анимации — только GPU-friendly (`transform`, `opacity`), без `width`/`top`/`left`.
- Все SVG — инлайн в JSX (не <img>), это убирает запросы.

---

# SEO

- `<title>` + `<meta description>` для каждой локали (через `generateMetadata` в `app/[locale]/page.tsx`)
- Open Graph (title, description, image, locale)
- Twitter Card
- `hreflang` для трёх локалей (next-intl делает автоматически)
- Schema.org `ConstructionCompany` + `LocalBusiness` JSON-LD в `<head>`
- `sitemap.xml` через `app/sitemap.ts` — три URL: `/hy`, `/ru`, `/en`
- `robots.txt` через `app/robots.ts` — `Allow: /`

---

# ДЕПЛОЙ НА VERCEL

1. Создай репозиторий на GitHub (`profmonolith-site` или `profmonolith.am`). Если у пользователя уже есть — используй существующий.
2. Подключи к Vercel через GitHub-integration.
3. Добавь переменные окружения в Vercel Dashboard:
   - `NEXT_PUBLIC_WEB3FORMS_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Подключи домен **profmonolith.am**:
   - Если домен у регистратора, дай пользователю инструкцию какие DNS-записи добавить (Vercel сам подскажет).
   - Включи автоматический редирект `www → apex` (или наоборот, по выбору пользователя).
5. Включи `@vercel/analytics` через `<Analytics />` в `app/[locale]/layout.tsx`.

### Региональные настройки

Vercel Edge функции для middleware (geo-detect) — деплоить в регион `iad1` (US East) или `fra1` (Frankfurt — ближе к Армении, рекомендую). В `next.config.ts`:

```typescript
export default {
  // ...
  experimental: {
    // ничего особенного
  },
};
```

---

# CHECKLIST ВЫПОЛНЕНИЯ

Перед тем как сказать пользователю «готово», убедись:

- [ ] `npm run build` проходит без ошибок и предупреждений
- [ ] `npm run lint` проходит
- [ ] Открыл главную страницу в браузере локально (`npm run dev`) — все секции рендерятся
- [ ] Переключатель языков работает: HY → RU → EN, тексты меняются, URL меняется (`/hy` → `/ru` → `/en`)
- [ ] Гео-определение языка: эмулируй разные IP в DevTools или тесте, проверь редиректы
- [ ] Форма отправляет тестовое письмо через Web3Forms и оно приходит на `monilitarmenia@gmail.com`. Проверь, что в письме есть все поля + UTM + locale + page_url.
- [ ] Лайтбокс открывается при клике на «Смотреть фото», работают next/prev/close, swipe на мобиле
- [ ] Sticky-nav прячется при скролле вниз, появляется при скролле вверх
- [ ] Бургер-меню на мобильном открывается и закрывается
- [ ] Count-up чисел анимируется при появлении секции
- [ ] Все секции корректно рендерятся на 1920px, 1440px, 768px, 390px, 360px
- [ ] **Никаких горизонтальных скроллбаров** ни на одной ширине
- [ ] Lighthouse Performance ≥ 95 на десктопе и мобильном
- [ ] Все ссылки tel: и mailto: работают
- [ ] `git push` → Vercel задеплоил → открыл prod URL → всё работает

---

# ОТЛОЖЕННЫЕ ЗАДАЧИ (НЕ ДЕЛАТЬ СЕЙЧАС, ЗАПИСАТЬ В TODO.md)

Эти фичи обсуждались но решено отложить:

- [ ] **Переключение формы с Web3Forms на Resend** — когда заказчик захочет фирменный отправитель `noreply@profmonolith.am` (потребует верификации домена в Resend), или превысит лимит 250 заявок/мес. Переход = добавить `app/api/lead/route.ts` с Resend SDK, поменять `action` формы.
- [ ] Дублирование заявок в Telegram-бот (если потом понадобится — `node-telegram-bot-api` + Vercel API route).
- [ ] Google Analytics 4 / Meta Pixel (если решат запускать рекламу).
- [ ] Раздел «Лицензии» — наполнить сканами документов когда заказчик пришлёт.
- [ ] Реальные ссылки Facebook и Instagram в футере (сейчас заглушки `href="#"`).
- [ ] Возможно — отдельная страница для частных заказчиков (особняки), если позже передумают.
- [ ] Расширение блока партнёров логотипами в высоком качестве (когда найдутся).

Запиши это в `TODO.md` в корне проекта.

---

# ЧТО ДЕЛАТЬ ПРИ КОНФЛИКТЕ ИНСТРУКЦИЙ

Если что-то в этом документе противоречит исходному дизайну от Claude Design — **этот документ выигрывает**. Если что-то непонятно или отсутствует — спроси пользователя, не угадывай.

Особенно ОБЯЗАТЕЛЬНО спроси у пользователя:

- Получил ли он уже **access key от Web3Forms** (если нет — направь его на [web3forms.com](https://web3forms.com), там нужно только ввести email `monilitarmenia@gmail.com` и подтвердить, ключ придёт на почту, регистрация не нужна).
- Если он уже создал GitHub-репозиторий, дай ссылку — иначе создавать с нуля?
- Vercel-аккаунт уже привязан к GitHub?
- Домен profmonolith.am уже подключён к Vercel или нужно подключать?
- Есть ли у него реальные ссылки на Facebook/Instagram (если нет — иконки оставляем как `href="#"` с aria-label, и в TODO записываем добавить).

---

# СТАРТ

После того как прочитаешь этот документ:

1. Скажи коротко, что прочитал и понял задачу.
2. Перечисли уточняющие вопросы (если есть).
3. После ответов — переключись в **Plan Mode** и предложи список задач (примерно 12–18 задач), сгруппированных по фазам:
   - Фаза 1: инициализация (Next.js, Tailwind, базовые конфиги)
   - Фаза 2: дизайн-система (цвета, шрифты, паттерны, базовые компоненты)
   - Фаза 3: i18n + middleware
   - Фаза 4: секции (по одной — Hero → Numbers → Projects → ...)
   - Фаза 5: форма (Web3Forms client-side fetch)
   - Фаза 6: SEO + Open Graph + Analytics
   - Фаза 7: оптимизация, тестирование на разных экранах
   - Фаза 8: деплой на Vercel + домен
4. Жди одобрения пользователем.
5. После одобрения — выполняй по одной задаче, коммить, пушь.

Удачи 🚀
