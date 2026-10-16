import type { Lang } from './routes';

export interface UI {
  lang: Lang;
  htmlLang: string;     // 'tr' | 'ka'
  ogLocale: string;     // 'tr_TR' | 'ka_GE'
  nav: {
    items: { label: string; href: string }[];
    book: string; bookHref: string;
    menu: string; navLabel: string; logoHome: string; logoSub: string;
  };
  switcher: { label: string; tr: string; ka: string };
  footer: {
    about: string; services: string; regions: string; corporate: string;
    corporateLinks: { label: string; href: string }[];
    rights: string;
    hours: string;
    bottomRight: (rating: number, count: number) => string;
    georgiaTitle: string; georgiaText: string;   // tr'de boş string
  };
  wa: { aria: string; defaultText: string; callNow: string; book: string; bookHref: string };
  cta: { title: string; text: string; wa: string; book: string; whatsapp: string; bookHref: string };
  faq: { title: string };
  reviews: { eyebrow: string; h2: (rating: number, count: number) => string; all: string; stars: (n: number) => string };
  breadcrumbs: { home: string; homeHref: string; aria: string };
  price: {
    service: string; car: string; suv: string; duration: string; note: string;
    extras: string; price: string; callForPrice: string; from: (tl: string) => string;
  };
  /** Türkçe hizmet slug → bu dildeki ad (tr'de SERVICES.name) */
  serviceName: (trSlug: string, fallback: string) => string;
  /** Türkçe hizmet slug → fiyat notu (tr'de SERVICES.priceNote) */
  priceNote: (trSlug: string, fallback: string) => string;
  /** SERVICES.duration (Türkçe metin) → bu dildeki süre */
  duration: (trDuration: string) => string;
  /** EXTRA_PRICES.key → { name, note } */
  extra: (key: string, fallback: { name: string; note: string }) => { name: string; note: string };
  form: {
    service: string; choose: string; multi: string;
    car: string; carPlaceholder: string;
    date: string; dateHint: string; time: string; timeHint: (n: number) => string;
    name: string; phone: string; phonePlaceholder: string;
    note: string; noteHint: string; submit: string; hint: string;
    /** form script'e JSON olarak gider */
    js: { sunday: string; opening: string; greeting: string; labels: { service: string; car: string; date: string; time: string; name: string; phone: string; note: string } };
  };
}
