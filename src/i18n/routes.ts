export const LOCALES = ['tr', 'ka'] as const;
export type Lang = (typeof LOCALES)[number];

/** Gürcüce sayfalar yayınlanınca ve ana dili Gürcüce olan kişi onaylayınca false yapılır. */
export const KA_NOINDEX = true;

/** Türkçe yol → Gürcüce yol. Yalnızca çevrilen sayfalar. */
export const KA_ROUTES: Record<string, string> = {
  '/': '/ka/',
  '/rize-ppf-kaplama/': '/ka/ppf/',
  '/rize-seramik-kaplama/': '/ka/keramikuli-dafarva/',
  '/rize-cam-filmi/': '/ka/minis-firi/',
  '/fiyatlar/': '/ka/pasebi/',
  '/iletisim/': '/ka/kontakti/',
  '/randevu/': '/ka/javshani/',
};
export const TR_ROUTES: Record<string, string> = Object.fromEntries(Object.entries(KA_ROUTES).map(([tr, ka]) => [ka, tr]));

/** Türkçe hizmet slug'ı → Gürcüce sayfa yolu (yalnızca çevrilen 3 hizmet). */
export const KA_SERVICE_ROUTES: Record<string, string> = {
  'rize-ppf-kaplama': '/ka/ppf/',
  'rize-seramik-kaplama': '/ka/keramikuli-dafarva/',
  'rize-cam-filmi': '/ka/minis-firi/',
};
/** Gürcüce sayfa slug'ı ([slug].astro) → Türkçe hizmet slug'ı */
export const KA_SERVICE_SLUGS: Record<string, string> = { ppf: 'rize-ppf-kaplama', 'keramikuli-dafarva': 'rize-seramik-kaplama', 'minis-firi': 'rize-cam-filmi' };

const norm = (p: string) => (p.endsWith('/') ? p : p + '/');

export function langOfPath(path: string): Lang {
  return norm(path).startsWith('/ka/') ? 'ka' : 'tr';
}

/** Sayfanın iki dildeki yolları; eşlemesi yoksa null. */
export function alternates(path: string): { tr: string; ka: string } | null {
  const p = norm(path);
  if (KA_ROUTES[p]) return { tr: p, ka: KA_ROUTES[p] };
  if (TR_ROUTES[p]) return { tr: TR_ROUTES[p], ka: p };
  return null;
}

/** Dil anahtarının gideceği yer: karşılığı varsa o sayfa, yoksa ilgili dilin ana sayfası. */
export function switcherTarget(path: string, to: Lang): string {
  const alt = alternates(path);
  if (alt) return alt[to];
  return to === 'ka' ? '/ka/' : '/';
}

/** Türkçe hizmet slug'ı için verilen dilde link: ka çevirisi yoksa Türkçe sayfaya gider. */
export function serviceHref(lang: Lang, trSlug: string): string {
  if (lang === 'ka' && KA_SERVICE_ROUTES[trSlug]) return KA_SERVICE_ROUTES[trSlug];
  return `/${trSlug}/`;
}
