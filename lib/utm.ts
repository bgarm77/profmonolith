export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

/**
 * Читает UTM-параметры из URL; если их нет — восстанавливает из sessionStorage.
 * При наличии в URL — сохраняет в sessionStorage (переживают навигацию).
 * Только для клиента.
 */
export function resolveUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) fromUrl[k] = v;
  }
  if (Object.keys(fromUrl).length) {
    try {
      sessionStorage.setItem('utm', JSON.stringify(fromUrl));
    } catch {
      /* ignore */
    }
    return fromUrl;
  }
  try {
    const saved = sessionStorage.getItem('utm');
    if (saved) return JSON.parse(saved) as Record<string, string>;
  } catch {
    /* ignore */
  }
  return {};
}
