import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // Современные форматы для фото проектов (next/image)
    formats: ['image/avif', 'image/webp'],
  },
  // Чуть строже к качеству продакшена
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
