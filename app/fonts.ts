import { Montserrat, Orbitron, Noto_Sans_Armenian } from 'next/font/google';

// UI-шрифт: латиница + кириллица
export const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Числа / мета (только латиница)
export const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-orbitron',
});

// Армянский
export const notoArmenian = Noto_Sans_Armenian({
  subsets: ['armenian'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-noto-armenian',
});

export const fontVariables = `${montserrat.variable} ${orbitron.variable} ${notoArmenian.variable}`;
