import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'white' | 'ghost-light';

const variantClass: Record<Variant, string> = {
  primary: 'btn btn--primary',
  white: 'btn btn--white',
  'ghost-light': 'btn btn--ghost-light',
};

type Common = {
  variant?: Variant;
  size?: 'md' | 'lg';
  full?: boolean;
  children: ReactNode;
  className?: string;
};

function classes({ variant = 'primary', size = 'md', full, className }: Common) {
  return [
    variantClass[variant],
    size === 'lg' ? 'btn--lg' : '',
    full ? 'btn--full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

/** Кнопка-ссылка (<a>). */
export function ButtonLink({
  variant,
  size,
  full,
  className,
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes({ variant, size, full, className, children })} {...rest}>
      {children}
    </a>
  );
}

/** Кнопка-действие (<button>). */
export function Button({
  variant,
  size,
  full,
  className,
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes({ variant, size, full, className, children })} {...rest}>
      {children}
    </button>
  );
}
