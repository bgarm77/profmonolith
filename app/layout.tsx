import type { ReactNode } from 'react';

// Корневой layout-проходник: реальная <html> создаётся в [locale]/layout.tsx,
// чтобы выставить корректные lang/dir по локали.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
