# Gürcüce (ka) Dil Sürümü — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** moonauto.com.tr'ye `/ka/` altında 7 sayfalık, Gürcistan'dan gelen müşteriye yönelik Gürcüce sürüm eklemek; Türkçe sayfalar görünür olarak değişmeden kalır.

**Architecture:** Astro yerleşik `i18n` ayarı (tr varsayılan, ön eksiz; ka `/ka/`). Gürcüce sayfalar `src/pages/ka/` altında; ortak bileşenler opsiyonel `lang` prop'u alır ve metinleri `src/i18n/` sözlüğünden okur (`lang` yoksa bugünkü Türkçe davranış). tr↔ka URL eşlemesi tek tabloda (`src/i18n/routes.ts`); hreflang ve dil anahtarı bu tabloyu kullanır. Gürcüce sayfa içerikleri `src/i18n/ka/pages.ts` içinde; fiyat/NAP `SITE` ve `SERVICES`'tan okunur.

**Tech Stack:** Astro 5 (statik), TypeScript, @astrojs/sitemap, Python 3 (doğrulama scripti), Noto Sans Georgian woff2 (self-host).

Spec: `docs/superpowers/specs/2026-10-15-gurcuce-dil-design.md`

## Global Constraints

- Türkçe sayfaların HTML çıktısı yalnızca şu farkları içerebilir: hreflang `<link rel="alternate">` satırları ve header'daki dil anahtarı. Başka fark = regresyon.
- Gürcüce metinlerde ürün marka adı geçmez ("მსოფლიოში ცნობილი ბრენდების" denir), "polen" ve "vakum" iddiası yok.
- Fiyat rakamları Gürcüce dosyalarda tekrar edilmez; `SITE`/`SERVICES`/`EXTRA_PRICES`'tan okunur. Tek istisna: PPF paket fiyatları (Türkçe'de de yalnızca `priceNote` metninde var) — `ka/pages.ts` içinde yorumla işaretli olarak yazılır.
- Gürcüce sayfalar `KA_NOINDEX = true` iken `noindex`; ana dili Gürcüce olan kişi onaylayana kadar bu sabit `true` kalır.
- Hreflang `Base.astro` içinden elle yazılır; `@astrojs/sitemap`'in `i18n` seçeneği KULLANILMAZ.
- Dış CDN yok: font dosyaları `public/fonts/` altından sunulur.
- Her commit mesajı sonunda: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`
- Bu makinede `head` komutu bir Perl HTTP aracına bağlı; dosya başı okumak için `sed -n 1,20p` kullan.
- Test altyapısı yok; doğrulama = `npm run check`, `npm run build`, `python3 scripts/check-ka.py`, Türkçe regresyon diff'i.

---

## Dosya Yapısı

| Dosya | Sorumluluk |
|---|---|
| `src/i18n/routes.ts` | Locale tipi, tr↔ka URL eşlemesi, `alternates()`, `switcherTarget()`, `KA_SERVICE_ROUTES`, `KA_NOINDEX` |
| `src/i18n/types.ts` | `UI` arayüz sözlüğünün tipi |
| `src/i18n/tr.ts` | Türkçe arayüz sözlüğü (bileşenlerdeki bugünkü sabit metinler) |
| `src/i18n/ka.ts` | Gürcüce arayüz sözlüğü + Gürcüce hizmet adları/notları |
| `src/i18n/index.ts` | `getT(lang)` |
| `src/i18n/ka/pages.ts` | Gürcüce sayfa içerikleri (ana sayfa, 3 hizmet, fiyatlar, iletişim, randevu) |
| `src/layouts/Base.astro` | `lang` prop: html lang, og:locale, hreflang, font, JSON-LD, noindex; Header/Footer/WhatsApp'a lang geçirir |
| `src/components/{Header,Footer,WhatsApp,Cta,Faq,Breadcrumbs,PriceTable,BookingForm}.astro` | `lang` prop'u, metinler sözlükten |
| `src/pages/ka/index.astro` | Gürcüce ana sayfa |
| `src/pages/ka/[slug].astro` | 3 Gürcüce hizmet sayfası (ppf, keramikuli-dafarva, minis-firi) |
| `src/pages/ka/pasebi.astro`, `kontakti.astro`, `javshani.astro` | Fiyatlar, iletişim, randevu |
| `public/fonts/noto-sans-georgian-{400,700}.woff2` | Gürcüce yazı tipi |
| `scripts/check-ka.py` | Build çıktısı doğrulaması |
| `astro.config.mjs` | `i18n` bloğu |
| `src/data/services.ts` | `EXTRA_PRICES` satırlarına `key` alanı |

---

### Task 1: i18n altyapısı — rotalar, tipler, sözlükler, Astro i18n ayarı

**Files:**
- Create: `src/i18n/routes.ts`, `src/i18n/types.ts`, `src/i18n/tr.ts`, `src/i18n/ka.ts`, `src/i18n/index.ts`
- Modify: `astro.config.mjs`, `src/data/services.ts:298-305` (EXTRA_PRICES)

**Interfaces:**
- Produces: `type Lang = 'tr' | 'ka'`; `alternates(path: string): { tr: string; ka: string } | null`; `switcherTarget(path: string, to: Lang): string`; `KA_SERVICE_ROUTES: Record<string, string>` (Türkçe hizmet slug → ka URL); `KA_NOINDEX: boolean`; `getT(lang: Lang): UI`; `UI` tipi (aşağıda); `EXTRA_PRICES[i].key: string`.

- [ ] **Step 1: Türkçe regresyon için taban çıktı al**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run build && rm -rf /tmp/moon-baseline && cp -R dist /tmp/moon-baseline && ls /tmp/moon-baseline | wc -l
```
Expected: build hatasız; dizin sayısı > 20.

- [ ] **Step 2: `src/i18n/routes.ts` yaz**

```ts
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
```

- [ ] **Step 3: `src/i18n/types.ts` yaz**

```ts
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
```

- [ ] **Step 4: `src/i18n/tr.ts` yaz (bugünkü sabit metinler, birebir)**

```ts
import type { UI } from './types';

export const tr: UI = {
  lang: 'tr', htmlLang: 'tr', ogLocale: 'tr_TR',
  nav: {
    items: [
      { label: 'Hizmetler', href: '/hizmetler/' }, { label: 'Fiyatlar', href: '/fiyatlar/' }, { label: 'Galeri', href: '/galeri/' },
      { label: 'Blog', href: '/blog/' }, { label: 'Hakkımızda', href: '/hakkimizda/' }, { label: 'İletişim', href: '/iletisim/' },
    ],
    book: 'Randevu Al', bookHref: '/randevu/', menu: 'Menü', navLabel: 'Ana menü',
    logoHome: 'Moon Auto Rize ana sayfa', logoSub: 'Detailing & Car Studio · Rize',
  },
  switcher: { label: 'Dil', tr: 'TR', ka: 'ქარ' },
  footer: {
    about: 'Seramik kaplama, PPF, pasta cila, detaylı iç temizlik ve premium oto yıkama.',
    services: 'Hizmetler', regions: 'Hizmet Bölgeleri', corporate: 'Kurumsal',
    corporateLinks: [
      { label: 'Hakkımızda', href: '/hakkimizda/' }, { label: 'Fiyat Listesi', href: '/fiyatlar/' }, { label: 'Online Randevu', href: '/randevu/' },
      { label: 'Galeri', href: '/galeri/' }, { label: 'Sık Sorulan Sorular', href: '/sss/' }, { label: 'Blog', href: '/blog/' }, { label: 'İletişim', href: '/iletisim/' },
    ],
    rights: 'Tüm hakları saklıdır.',
    bottomRight: (r, c) => `Rize Merkez · İslampaşa · Google'da ${r} ★ (${c} yorum)`,
    georgiaTitle: '', georgiaText: '',
  },
  wa: { aria: 'WhatsApp ile yazın', defaultText: 'Merhaba Moon Auto, randevu almak istiyorum.', callNow: '☎ Hemen Ara', book: '📅 Randevu Al', bookHref: '/randevu/' },
  cta: { title: 'Aracınız için randevu alın', text: 'Online randevu 1 dakika sürer. Onay bilgisi telefonunuza WhatsApp ile gelir.', wa: 'Merhaba Moon Auto, randevu almak istiyorum.', book: '📅 Online Randevu', whatsapp: 'WhatsApp', bookHref: '/randevu/' },
  faq: { title: 'Sık Sorulan Sorular' },
  reviews: { eyebrow: 'Google Yorumları', h2: (r, c) => `Rize'de ${r} ★ · ${c} müşteri yorumu`, all: "Tüm yorumları Google Haritalar'da görün →", stars: (n) => `${n} yıldız` },
  breadcrumbs: { home: 'Ana Sayfa', homeHref: '/', aria: 'Sayfa yolu' },
  price: { service: 'Hizmet', car: 'Otomobil', suv: 'SUV / Hafif Ticari', duration: 'Süre', note: 'Not', extras: 'Ek hizmetler', price: 'Fiyat', callForPrice: 'Fiyat için arayın', from: (tl) => tl + "'den" },
  serviceName: (_slug, fallback) => fallback,
  priceNote: (_slug, fallback) => fallback,
  extra: (_key, fallback) => fallback,
  form: {
    service: 'Hizmet', choose: 'Seçin…', multi: 'Birden fazla hizmet / teklif istiyorum',
    car: 'Araç (marka / model / yıl)', carPlaceholder: 'Örn: Toyota Corolla 2022, beyaz',
    date: 'Tarih', dateHint: 'Pazar günleri kapalıyız', time: 'Saat', timeHint: (n) => `Aynı anda ${n} araç alıyoruz`,
    name: 'Adınız Soyadınız', phone: 'Telefon', phonePlaceholder: '05xx xxx xx xx',
    note: 'Not', noteHint: 'Aracın durumu, istediğiniz paket, ek talepler',
    submit: 'WhatsApp ile Randevu Talebi Gönder',
    hint: 'Bilgileriniz hazır bir WhatsApp mesajına dönüşür; "Gönder"e bastığınızda bize ulaşır ve saati onaylayarak dönüş yaparız.',
    js: {
      sunday: 'Pazar günleri kapalıyız. Lütfen başka bir gün seçin.',
      opening: 'WhatsApp açılıyor… Mesajı göndermeyi unutmayın.',
      greeting: 'Merhaba Moon Auto, randevu talebim:',
      labels: { service: 'Hizmet', car: 'Araç', date: 'Tarih', time: 'Saat', name: 'Ad Soyad', phone: 'Telefon', note: 'Not' },
    },
  },
};
```

- [ ] **Step 5: `src/i18n/ka.ts` yaz**

```ts
import type { UI } from './types';

/** Türkçe hizmet slug → Gürcüce ad */
export const KA_SERVICE_NAMES: Record<string, string> = {
  'rize-seramik-kaplama': 'კერამიკული დაფარვა',
  'rize-ppf-kaplama': 'PPF დამცავი ფირი',
  'rize-pasta-cila': 'პოლირება',
  'rize-detayli-ic-temizlik': 'სალონის ქიმწმენდა',
  'rize-oto-yikama': 'შიდა-გარე რეცხვა',
  'rize-cam-filmi': 'მინის დაბურვა',
  'rize-antibakteriyel-arac-temizligi': 'ანტიბაქტერიული წმენდა',
  'rize-far-parlatma': 'ფარების პოლირება',
  'rize-motor-temizligi': 'ძრავის წმენდა',
  'rize-oto-cekici': 'ევაკუატორი და გზის დახმარება',
};
/** Türkçe hizmet slug → fiyat tablosu notu (rakamlar services.ts'ten; burada yalnız açıklama) */
export const KA_PRICE_NOTES: Record<string, string> = {
  'rize-seramik-kaplama': 'მსუბუქი ავტომობილი / ჯიპი და მსუბუქი კომერციული',
  'rize-ppf-kaplama': 'კაპოტი · კაპოტი + ფრთები · სრული ავტომობილი; დამოკიდებულია მოდელზე',
  'rize-pasta-cila': 'საღებავის მდგომარეობის მიხედვით',
  'rize-detayli-ic-temizlik': 'სავარძლების მოხსნით, სრული სალონი',
  'rize-oto-yikama': 'სტანდარტული შიდა-გარე რეცხვა',
  'rize-cam-filmi': 'ყველა მინა, ლეგალური ტონით',
  'rize-antibakteriyel-arac-temizligi': 'სალონის დეზინფექცია',
  'rize-far-parlatma': 'წყვილი ფარი, დამცავი ფენით',
  'rize-motor-temizligi': 'ძრავის განყოფილების უსაფრთხო წმენდა',
  'rize-oto-cekici': 'ფასი მანძილის მიხედვით — დაგვირეკეთ',
};
/** EXTRA_PRICES.key → Gürcüce ad ve not */
export const KA_EXTRAS: Record<string, { name: string; note: string }> = {
  'premium-yikama': { name: 'პრემიუმ რეცხვა', note: 'თიხა, ცვილი და პლასტმასის/ტყავის მოვლა შედის' },
  'detailing-oto': { name: 'შიდა-გარე დეტეილინგის პაკეტი — მსუბუქი ავტომობილი', note: 'სალონის ქიმწმენდა + პოლირება + დაცვა; მანქანის მდგომარეობის მიხედვით' },
  'detailing-suv': { name: 'შიდა-გარე დეტეილინგის პაკეტი — ჯიპი / მსუბუქი კომერციული', note: 'იგივე პაკეტი, დიდი ავტომობილი' },
  'wax': { name: 'ცვილით პოლირება', note: 'დამცავი ცვილი რეცხვის შემდეგ' },
  'hare': { name: 'ჰოლოგრამების მოცილება', note: 'პოლირების კვალის მოცილება' },
  'yikama-minibus': { name: 'შიდა-გარე რეცხვა — მინივენი', note: 'სტანდარტული პაკეტი' },
};

export const ka: UI = {
  lang: 'ka', htmlLang: 'ka', ogLocale: 'ka_GE',
  nav: {
    items: [
      { label: 'PPF', href: '/ka/ppf/' }, { label: 'კერამიკა', href: '/ka/keramikuli-dafarva/' }, { label: 'მინის ფირი', href: '/ka/minis-firi/' },
      { label: 'ფასები', href: '/ka/pasebi/' }, { label: 'კონტაქტი', href: '/ka/kontakti/' },
    ],
    book: 'ჯავშანი', bookHref: '/ka/javshani/', menu: 'მენიუ', navLabel: 'მთავარი მენიუ',
    logoHome: 'Moon Auto რიზე — მთავარი გვერდი', logoSub: 'Detailing & Car Studio · რიზე, თურქეთი',
  },
  switcher: { label: 'ენა', tr: 'TR', ka: 'ქარ' },
  footer: {
    about: 'პროფესიონალური ავტო დეტეილინგი რიზეში, თურქეთი: PPF, კერამიკული დაფარვა, პოლირება, სალონის ქიმწმენდა და პრემიუმ რეცხვა.',
    services: 'სერვისები', regions: '', corporate: 'გვერდები',
    corporateLinks: [
      { label: 'მთავარი', href: '/ka/' }, { label: 'ფასები', href: '/ka/pasebi/' }, { label: 'ონლაინ ჯავშანი', href: '/ka/javshani/' }, { label: 'კონტაქტი', href: '/ka/kontakti/' },
    ],
    rights: 'ყველა უფლება დაცულია.',
    bottomRight: (r, c) => `რიზე · ისლამფაშა · Google ${r} ★ (${c} შეფასება)`,
    georgiaTitle: 'საქართველოდან ჩამოსულთათვის',
    georgiaText: 'სარფის საზღვრიდან ≈95 კმ, ბათუმიდან ≈150 კმ. მოგვწერეთ WhatsApp-ზე ქართულად — ქართულად გიპასუხებთ.',
  },
  wa: { aria: 'მოგვწერეთ WhatsApp-ზე', defaultText: 'გამარჯობა Moon Auto, ჯავშნის აღება მინდა.', callNow: '☎ დარეკვა', book: '📅 ჯავშანი', bookHref: '/ka/javshani/' },
  cta: { title: 'დაჯავშნეთ თქვენი ავტომობილისთვის', text: 'ონლაინ ჯავშანს 1 წუთი სჭირდება. დადასტურებას WhatsApp-ით მიიღებთ — ქართულად.', wa: 'გამარჯობა Moon Auto, ჯავშნის აღება მინდა.', book: '📅 ონლაინ ჯავშანი', whatsapp: 'WhatsApp', bookHref: '/ka/javshani/' },
  faq: { title: 'ხშირად დასმული კითხვები' },
  reviews: { eyebrow: 'Google შეფასებები', h2: (r, c) => `რიზეში ${r} ★ · ${c} მომხმარებლის შეფასება`, all: 'ყველა შეფასება Google რუკებზე →', stars: (n) => `${n} ვარსკვლავი` },
  breadcrumbs: { home: 'მთავარი', homeHref: '/ka/', aria: 'გვერდის გზა' },
  price: { service: 'სერვისი', car: 'მსუბუქი ავტომობილი', suv: 'ჯიპი / მსუბუქი კომერციული', duration: 'ხანგრძლივობა', note: 'შენიშვნა', extras: 'დამატებითი სერვისები', price: 'ფასი', callForPrice: 'ფასი — დაგვირეკეთ', from: (tl) => tl + '-დან' },
  serviceName: (slug, fallback) => KA_SERVICE_NAMES[slug] ?? fallback,
  priceNote: (slug, fallback) => KA_PRICE_NOTES[slug] ?? fallback,
  extra: (key, fallback) => KA_EXTRAS[key] ?? fallback,
  form: {
    service: 'სერვისი', choose: 'აირჩიეთ…', multi: 'რამდენიმე სერვისი / შეთავაზება მინდა',
    car: 'ავტომობილი (მარკა / მოდელი / წელი)', carPlaceholder: 'მაგ.: Toyota Corolla 2022, თეთრი',
    date: 'თარიღი', dateHint: 'კვირას დაკეტილია', time: 'საათი', timeHint: (n) => `ერთდროულად ${n} მანქანას ვიღებთ`,
    name: 'სახელი, გვარი', phone: 'ტელეფონი', phonePlaceholder: '+995 5xx xxx xxx',
    note: 'შენიშვნა', noteHint: 'მანქანის მდგომარეობა, სასურველი პაკეტი, დამატებითი თხოვნა',
    submit: 'ჯავშნის გაგზავნა WhatsApp-ით',
    hint: 'მონაცემები მზა WhatsApp შეტყობინებად გადაიქცევა; „გაგზავნის“ შემდეგ მოგვწვდება და საათის დადასტურებით ქართულად გიპასუხებთ.',
    js: {
      sunday: 'კვირას დაკეტილი ვართ. გთხოვთ, აირჩიოთ სხვა დღე.',
      opening: 'WhatsApp იხსნება… არ დაგავიწყდეთ შეტყობინების გაგზავნა.',
      greeting: 'გამარჯობა Moon Auto, ჯავშნის მოთხოვნა:',
      labels: { service: 'სერვისი', car: 'ავტომობილი', date: 'თარიღი', time: 'საათი', name: 'სახელი', phone: 'ტელეფონი', note: 'შენიშვნა' },
    },
  },
};
```

- [ ] **Step 6: `src/i18n/index.ts` yaz**

```ts
import type { Lang } from './routes';
import type { UI } from './types';
import { tr } from './tr';
import { ka } from './ka';

export type { Lang, UI };
export { LOCALES, KA_NOINDEX, KA_ROUTES, KA_SERVICE_ROUTES, KA_SERVICE_SLUGS, alternates, switcherTarget, langOfPath, serviceHref } from './routes';

const DICT: Record<Lang, UI> = { tr, ka };
export const getT = (lang: Lang = 'tr'): UI => DICT[lang] ?? tr;
```

- [ ] **Step 7: `astro.config.mjs` içine i18n bloğu ekle**

`trailingSlash: 'always',` satırının altına:

```js
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'ka'],
    routing: { prefixDefaultLocale: false },
  },
```

- [ ] **Step 8: `EXTRA_PRICES` satırlarına `key` ekle (`src/data/services.ts`)**

Her satırın başına `key:` ekle; sırayla: `'premium-yikama'`, `'detailing-oto'`, `'detailing-suv'`, `'wax'`, `'hare'`, `'yikama-minibus'`. Örnek ilk satır:

```ts
  { key: 'premium-yikama', name: 'Premium oto yıkama', price: 2000, slug: 'rize-oto-yikama', note: 'Kil, wax ve plastik-deri bakımı dahil' },
```

- [ ] **Step 9: Tip kontrolü, build ve regresyon diff'i**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run check && npm run build && diff -r /tmp/moon-baseline dist && echo "IDENTICAL"
```
Expected: `astro check` 0 hata; diff çıktısı boş, `IDENTICAL` yazar (henüz hiçbir bileşen değişmedi).

- [ ] **Step 10: Commit**

```bash
git add src/i18n astro.config.mjs src/data/services.ts
git commit -m "i18n: tr/ka rota eşlemesi, arayüz sözlükleri ve Astro i18n ayarı

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Doğrulama scripti, Gürcüce font ve `Base.astro` dil desteği

**Files:**
- Create: `scripts/check-ka.py`, `public/fonts/noto-sans-georgian-400.woff2`, `public/fonts/noto-sans-georgian-700.woff2`
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `alternates`, `KA_NOINDEX`, `getT`, `Lang` (Task 1).
- Produces: `Base.astro` prop `lang?: Lang` (varsayılan `'tr'`); Header/Footer/WhatsApp'a `lang` geçirir (bu bileşenler Task 3–4'te prop'u kullanır; o zamana kadar fazladan prop zararsızdır).

- [ ] **Step 1: `scripts/check-ka.py` yaz (önce başarısız olacak test)**

```python
#!/usr/bin/env python3
"""Gürcüce (ka) sürüm build doğrulaması. Kullanım: python3 scripts/check-ka.py  (önce npm run build)"""
import pathlib, re, sys

DIST = pathlib.Path('dist')
SITE = 'https://www.moonauto.com.tr'
PAIRS = {  # tr yol → ka yol (src/i18n/routes.ts ile aynı)
    '/': '/ka/', '/rize-ppf-kaplama/': '/ka/ppf/', '/rize-seramik-kaplama/': '/ka/keramikuli-dafarva/',
    '/rize-cam-filmi/': '/ka/minis-firi/', '/fiyatlar/': '/ka/pasebi/', '/iletisim/': '/ka/kontakti/', '/randevu/': '/ka/javshani/',
}
NO_PAIR = ['/hakkimizda/', '/sss/', '/galeri/']
TR_UI = ['Randevu Al', 'Hemen Ara', 'Hizmetler', 'Fiyatlar', 'İletişim', 'Ana Sayfa', 'Sık Sorulan', 'Tüm hakları', 'Seçin…', 'WhatsApp ile yazın', 'Google Yorumları', 'Detaylar →']
errors = []

def html(path):
    p = DIST / path.strip('/') / 'index.html'
    if not p.exists():
        errors.append(f'eksik sayfa: {path}'); return None
    return p.read_text(encoding='utf-8')

def hreflang(doc, lang):
    m = re.search(r'<link rel="alternate" hreflang="%s" href="([^"]+)"' % lang, doc)
    return m.group(1) if m else None

for tr, ka in PAIRS.items():
    kd = html(ka); td = html(tr)
    if kd is None or td is None: continue
    if '<html lang="ka"' not in kd: errors.append(f'{ka}: lang="ka" yok')
    if f'<link rel="canonical" href="{SITE}{ka}"' not in kd: errors.append(f'{ka}: canonical yanlış')
    if 'og:locale" content="ka_GE"' not in kd: errors.append(f'{ka}: og:locale ka_GE yok')
    if 'noto-sans-georgian-400.woff2' not in kd: errors.append(f'{ka}: Gürcüce font yok')
    if '"inLanguage":"ka"' not in kd: errors.append(f'{ka}: JSON-LD inLanguage yok')
    for doc, name in ((kd, ka), (td, tr)):
        if hreflang(doc, 'tr') != SITE + tr: errors.append(f'{name}: hreflang tr != {tr}')
        if hreflang(doc, 'ka') != SITE + ka: errors.append(f'{name}: hreflang ka != {ka}')
        if hreflang(doc, 'x-default') != SITE + tr: errors.append(f'{name}: x-default != {tr}')
    if '<html lang="tr"' not in td: errors.append(f'{tr}: lang="tr" bozuldu')
    if 'noto-sans-georgian' in td: errors.append(f'{tr}: Türkçe sayfada Gürcüce font yüklenmiş')
    body = kd.split('<body', 1)[-1]
    for s in TR_UI:
        if s in body: errors.append(f'{ka}: çevrilmemiş arayüz metni "{s}"')
    if not re.search(r'[ა-ჿ]', body): errors.append(f'{ka}: Gürcüce harf yok')

for p in NO_PAIR:
    d = html(p)
    if d and 'hreflang=' in d: errors.append(f'{p}: eşlemesi olmayan sayfada hreflang var')

for e in errors: print('HATA', e)
print('OK' if not errors else f'{len(errors)} hata')
sys.exit(1 if errors else 0)
```

- [ ] **Step 2: Scripti çalıştır, başarısız olduğunu gör**

```bash
cd /Users/mehmetalikose/mustafakaradag && python3 scripts/check-ka.py
```
Expected: `HATA eksik sayfa: /ka/` … ve `7 hata` (veya daha fazla), exit 1.

- [ ] **Step 3: Font dosyalarını indir (OFL lisanslı Noto Sans Georgian, Gürcüce alt kümesi)**

```bash
cd /Users/mehmetalikose/mustafakaradag && mkdir -p public/fonts && \
curl -sL "https://unpkg.com/@fontsource/noto-sans-georgian/files/noto-sans-georgian-georgian-400-normal.woff2" -o public/fonts/noto-sans-georgian-400.woff2 && \
curl -sL "https://unpkg.com/@fontsource/noto-sans-georgian/files/noto-sans-georgian-georgian-700-normal.woff2" -o public/fonts/noto-sans-georgian-700.woff2 && \
ls -la public/fonts && file public/fonts/*.woff2
```
Expected: iki dosya, her biri 10–60 KB, `file` çıktısında "Web Open Font Format (Version 2)". Dosya 1 KB'den küçükse veya HTML ise URL'yi `https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-georgian/files/...` ile tekrar dene.

- [ ] **Step 4: `Base.astro` frontmatter'ını güncelle**

Import satırlarına ekle:

```ts
import { getT, alternates, KA_NOINDEX, type Lang } from '../i18n';
```

`interface Props` içine `lang?: Lang;` ekle. Props destructure satırını şununla değiştir:

```ts
const { title, description, canonical = Astro.url.pathname, ogImage = OG_IMAGE, noindex = false, type = 'website', jsonLd, waText, lang = 'tr' } = Astro.props;
const t = getT(lang);
const canonicalUrl = new URL(canonical, SITE.url).toString();
const alt = alternates(canonical);
const robotsNoindex = noindex || (lang === 'ka' && KA_NOINDEX);
```

`business` nesnesini oluşturduktan sonra (`const ldBlocks` satırından önce) ekle:

```ts
if (lang === 'ka') {
  (business as any).inLanguage = 'ka';
  (business as any).areaServed = [...business.areaServed, { '@type': 'City', name: 'Batumi' }, { '@type': 'State', name: 'Adjara' }, { '@type': 'Country', name: 'Georgia' }];
}
const FONT_CSS = `@font-face{font-family:"Noto Sans Georgian";src:url(/fonts/noto-sans-georgian-400.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap;unicode-range:U+10A0-10FF,U+1C90-1CBF,U+2D00-2D2F}@font-face{font-family:"Noto Sans Georgian";src:url(/fonts/noto-sans-georgian-700.woff2) format("woff2");font-weight:700;font-style:normal;font-display:swap;unicode-range:U+10A0-10FF,U+1C90-1CBF,U+2D00-2D2F}:root{--font:"Noto Sans Georgian",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}`;
```

- [ ] **Step 5: `Base.astro` şablonunu güncelle**

`<html lang="tr">` → `<html lang={t.htmlLang}>`.
`{noindex && <meta name="robots" ... />}` → `{robotsNoindex && <meta name="robots" content="noindex,nofollow" />}`.
`<meta property="og:locale" content="tr_TR" />` → `<meta property="og:locale" content={t.ogLocale} />`.
`<link rel="canonical" ... />` satırının hemen altına:

```astro
  {alt && (
    <>
      <link rel="alternate" hreflang="tr" href={SITE.url + alt.tr} />
      <link rel="alternate" hreflang="ka" href={SITE.url + alt.ka} />
      <link rel="alternate" hreflang="x-default" href={SITE.url + alt.tr} />
    </>
  )}
  {lang === 'ka' && <style set:html={FONT_CSS} />}
```

Body'de: `<Header />` → `<Header lang={lang} />`, `<Footer />` → `<Footer lang={lang} />`, `<WhatsApp text={waText} />` → `<WhatsApp lang={lang} text={waText} />`.

- [ ] **Step 6: Build ve regresyon diff'i (yalnızca hreflang farkı beklenir)**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run check && npm run build && diff -r /tmp/moon-baseline dist | grep '^[<>]' | grep -v 'hreflang=' ; echo "exit=$?"
```
Expected: `astro check` temiz; grep çıktısı boş (hreflang dışında fark yok), son satır `exit=1` (grep eşleşme bulamadı). Ayrıca `grep -c hreflang dist/index.html` → 3, `grep -c hreflang dist/hakkimizda/index.html` → 0.

- [ ] **Step 7: Commit**

```bash
git add scripts/check-ka.py public/fonts src/layouts/Base.astro
git commit -m "Base: lang prop, hreflang, Gürcüce font ve ka doğrulama scripti

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Header (dil anahtarı) ve Footer

**Files:**
- Modify: `src/components/Header.astro`, `src/components/Footer.astro`

**Interfaces:**
- Consumes: `getT`, `switcherTarget`, `serviceHref`, `Lang` (Task 1); `Base` `lang` geçirir (Task 2).
- Produces: her iki bileşen `lang?: Lang` prop'u alır; Header `.lang-switch` sınıfı ile `TR | ქარ` linkleri üretir.

- [ ] **Step 1: `Header.astro`'yu yeniden yaz**

```astro
---
import { SITE } from '../config/site';
import { getT, switcherTarget, type Lang } from '../i18n';
const { lang = 'tr' } = Astro.props as { lang?: Lang };
const t = getT(lang);
const path = Astro.url.pathname;
const toTr = switcherTarget(path, 'tr');
const toKa = switcherTarget(path, 'ka');
---
<header class="header">
  <div class="container">
    <a href={t.breadcrumbs.homeHref} class="logo" aria-label={t.nav.logoHome}>
      <span class="moon" aria-hidden="true"></span>
      <span>Moon Auto<small>{t.nav.logoSub}</small></span>
    </a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="nav" aria-label={t.nav.menu}>☰</button>
    <nav class="nav" id="nav" aria-label={t.nav.navLabel}>
      {t.nav.items.map((i) => <a href={i.href}>{i.label}</a>)}
      <a href={`tel:${SITE.phoneE164}`} class="btn btn-outline">☎ {SITE.phoneDisplay}</a>
      <a href={t.nav.bookHref} class="btn btn-primary">{t.nav.book}</a>
      <span class="lang-switch" aria-label={t.switcher.label}>
        <a href={toTr} hreflang="tr" lang="tr" aria-current={lang === 'tr' ? 'true' : undefined}>{t.switcher.tr}</a>
        <span aria-hidden="true">|</span>
        <a href={toKa} hreflang="ka" lang="ka" aria-current={lang === 'ka' ? 'true' : undefined}>{t.switcher.ka}</a>
      </span>
    </nav>
  </div>
</header>
<style>
  .lang-switch { display: inline-flex; gap: .4rem; align-items: center; font-size: .85rem; color: var(--muted); margin-left: .5rem; }
  .lang-switch a { color: var(--muted); }
  .lang-switch a[aria-current="true"] { color: var(--text); font-weight: 700; }
</style>
<script>
  const t = document.querySelector('.nav-toggle');
  const n = document.getElementById('nav');
  t?.addEventListener('click', () => {
    const open = n!.classList.toggle('open');
    t.setAttribute('aria-expanded', String(open));
  });
</script>
```

Not: Türkçe'de `t.nav.logoSub` = `'Detailing & Car Studio · Rize'`; eski şablondaki `&amp;` Astro tarafından otomatik kaçışlanır, çıktı aynı kalır.

- [ ] **Step 2: `Footer.astro`'yu yeniden yaz**

```astro
---
import { SITE } from '../config/site';
import { SERVICES } from '../data/services';
import { DISTRICTS } from '../data/districts';
import { getT, serviceHref, KA_SERVICE_ROUTES, type Lang } from '../i18n';
const { lang = 'tr' } = Astro.props as { lang?: Lang };
const t = getT(lang);
const year = new Date().getFullYear();
const services = lang === 'ka' ? SERVICES.filter((s) => KA_SERVICE_ROUTES[s.slug]) : SERVICES;
---
<footer class="footer">
  <div class="container grid grid-4">
    <div>
      <h4>Moon Auto Rize</h4>
      <p>{lang === 'tr' ? `${SITE.tagline}. ` : ''}{t.footer.about}</p>
      <p><a href={SITE.mapsShare} target="_blank" rel="noopener">{SITE.address.full}</a></p>
      <p><a href={`tel:${SITE.phoneE164}`}>{SITE.phoneDisplay}</a><br />{SITE.hours.text}</p>
      <p><a href={SITE.social.instagram} target="_blank" rel="noopener">Instagram</a> · <a href={SITE.social.facebook} target="_blank" rel="noopener">Facebook</a></p>
    </div>
    <div>
      <h4>{t.footer.services}</h4>
      <ul>{services.map((s) => <li><a href={serviceHref(lang, s.slug)}>{lang === 'tr' ? s.h1 : t.serviceName(s.slug, s.name)}</a></li>)}</ul>
    </div>
    <div>
      {lang === 'tr' ? (
        <>
          <h4>{t.footer.regions}</h4>
          <ul>
            <li><a href="/hizmet-bolgeleri/">Rize Merkez</a></li>
            {DISTRICTS.map((d) => <li><a href={`/hizmet-bolgeleri/${d.slug}/`}>{d.name} Oto Kuaför</a></li>)}
          </ul>
        </>
      ) : (
        <>
          <h4>{t.footer.georgiaTitle}</h4>
          <p>{t.footer.georgiaText}</p>
          <p><a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t.wa.defaultText)}`} target="_blank" rel="noopener">WhatsApp</a></p>
        </>
      )}
    </div>
    <div>
      <h4>{t.footer.corporate}</h4>
      <ul>{t.footer.corporateLinks.map((l) => <li><a href={l.href}>{l.label}</a></li>)}</ul>
    </div>
  </div>
  <div class="container bottom">
    <span>© {year} {SITE.legalName}. {t.footer.rights}</span>
    <span>{t.footer.bottomRight(SITE.rating.value, SITE.rating.count)}</span>
  </div>
</footer>
```

- [ ] **Step 3: Build ve regresyon diff'i**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run check && npm run build && diff -r /tmp/moon-baseline dist | grep '^[<>]' | grep -v 'hreflang=' | grep -v 'lang-switch' | grep -v 'astro-' ; echo "exit=$?"
```
Expected: `exit=1` (fark yok). `astro-` filtresi: Header'a `<style>` eklendiği için Astro scoped-class hash'leri değişebilir; eğer satırlar yalnızca `data-astro-cid` / `class="... astro-XXXX"` farkıysa kabul edilir. Diff'te Türkçe metin farkı görürsen (örn. footer paragrafı) düzelt: Türkçe çıktı `Rize'nin Profesyonel Oto Bakım Merkezi. Seramik kaplama, PPF, ...` olmalı.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "Header/Footer: lang prop, dil anahtarı, Gürcüce footer

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: WhatsApp, Cta, Faq, Breadcrumbs, PriceTable

**Files:**
- Modify: `src/components/WhatsApp.astro`, `src/components/Cta.astro`, `src/components/Faq.astro`, `src/components/Breadcrumbs.astro`, `src/components/PriceTable.astro`, `src/components/Reviews.astro`

**Interfaces:**
- Consumes: `getT`, `serviceHref`, `Lang`; `EXTRA_PRICES[i].key` (Task 1).
- Produces: her bileşen `lang?: Lang`; Cta `title/text/wa` verilmezse sözlük varsayılanı; Faq `title` verilmezse sözlük; Breadcrumbs `items` + `lang`.

- [ ] **Step 1: `WhatsApp.astro`**

```astro
---
import { SITE } from '../config/site';
import { getT, type Lang } from '../i18n';
const { lang = 'tr', text } = Astro.props as { lang?: Lang; text?: string };
const t = getT(lang);
const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text ?? t.wa.defaultText)}`;
---
<a class="wa-float" href={href} target="_blank" rel="noopener" aria-label={t.wa.aria}>
  <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.5.7 4.9 2 6.9L3 29l6.7-2.2a12.9 12.9 0 0 0 6.3 1.6c7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23a10.5 10.5 0 0 1-5.6-1.6l-.4-.2-4 1.3 1.3-3.8-.3-.4a10.3 10.3 0 0 1-1.7-5.7C5.3 9.9 10.1 5.2 16 5.2s10.7 4.7 10.7 10.4S21.9 26 16 26zm5.8-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.6 8.6 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.7 1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9 2.1.9 2.9 1 3.9.8.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.3z"/></svg>
</a>
<div class="call-bar">
  <a class="c" href={`tel:${SITE.phoneE164}`}>{t.wa.callNow}</a>
  <a class="r" href={t.wa.bookHref}>{t.wa.book}</a>
</div>
```

- [ ] **Step 2: `Cta.astro`**

```astro
---
import { SITE } from '../config/site';
import { getT, type Lang } from '../i18n';
const { lang = 'tr', title, text, wa } = Astro.props as { lang?: Lang; title?: string; text?: string; wa?: string };
const t = getT(lang);
const waText = wa ?? t.cta.wa;
---
<div class="cta">
  <h2>{title ?? t.cta.title}</h2>
  <p style="color:var(--muted)">{text ?? t.cta.text}</p>
  <div class="btn-row" style="justify-content:center">
    <a class="btn btn-primary" href={t.cta.bookHref}>{t.cta.book}</a>
    <a class="btn btn-wa" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener">{t.cta.whatsapp}</a>
    <a class="btn btn-outline" href={`tel:${SITE.phoneE164}`}>☎ {SITE.phoneDisplay}</a>
  </div>
</div>
```

- [ ] **Step 3: `Faq.astro`**

```astro
---
import type { Faq } from '../data/services';
import { getT, type Lang } from '../i18n';
const { faqs, title, schema = true, lang = 'tr' } = Astro.props as { faqs: Faq[]; title?: string; schema?: boolean; lang?: Lang };
const t = getT(lang);
const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
---
<section class="faq">
  <h2>{title ?? t.faq.title}</h2>
  {faqs.map((f) => <details><summary>{f.q}</summary><p>{f.a}</p></details>)}
</section>
{schema && <script type="application/ld+json" set:html={JSON.stringify(ld)} />}
```

- [ ] **Step 4: `Breadcrumbs.astro`**

```astro
---
import { SITE } from '../config/site';
import { getT, type Lang } from '../i18n';
interface Crumb { name: string; href?: string }
const { items, lang = 'tr' } = Astro.props as { items: Crumb[]; lang?: Lang };
const t = getT(lang);
const all: Crumb[] = [{ name: t.breadcrumbs.home, href: t.breadcrumbs.homeHref }, ...items];
const ld = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, ...(c.href ? { item: SITE.url + c.href } : {}) })),
};
---
<nav class="breadcrumbs container" aria-label={t.breadcrumbs.aria}>
  <ol>{all.map((c) => <li>{c.href ? <a href={c.href}>{c.name}</a> : <span aria-current="page">{c.name}</span>}</li>)}</ol>
</nav>
<script type="application/ld+json" set:html={JSON.stringify(ld)} />
```

- [ ] **Step 5: `PriceTable.astro`**

```astro
---
import { SERVICES, EXTRA_PRICES, formatTL } from '../data/services';
import { getT, serviceHref, type Lang } from '../i18n';
const { lang = 'tr' } = Astro.props as { lang?: Lang };
const t = getT(lang);
const cell = (n?: number) => (n && n > 0 ? formatTL(n) : '—');
const from = (n: number) => (n > 0 ? t.price.from(formatTL(n)) : t.price.callForPrice);
---
<div class="table-wrap">
  <table class="table">
    <thead><tr><th>{t.price.service}</th><th>{t.price.car}</th><th>{t.price.suv}</th><th>{t.price.duration}</th><th>{t.price.note}</th></tr></thead>
    <tbody>
      {SERVICES.map((s) => <tr><td><a href={serviceHref(lang, s.slug)}>{t.serviceName(s.slug, s.name)}</a></td><td class="price">{s.priceFrom > 0 ? formatTL(s.priceFrom) : from(0)}</td><td class="price">{cell(s.priceSuv)}</td><td>{s.duration}</td><td style="color:var(--muted)">{t.priceNote(s.slug, s.priceNote)}</td></tr>)}
    </tbody>
  </table>
</div>
<h2 style="margin-top:2rem">{t.price.extras}</h2>
<div class="table-wrap">
  <table class="table">
    <thead><tr><th>{t.price.service}</th><th>{t.price.price}</th><th>{t.price.note}</th></tr></thead>
    <tbody>
      {EXTRA_PRICES.map((e) => { const x = t.extra(e.key, { name: e.name, note: e.note }); return <tr><td><a href={serviceHref(lang, e.slug)}>{x.name}</a></td><td class="price">{formatTL(e.price)}</td><td style="color:var(--muted)">{x.note}</td></tr>; })}
    </tbody>
  </table>
</div>
```

Not: Türkçe'de `from(0)` = `priceLabel(0)` = `'Fiyat için arayın'` ile aynı; `s.duration` ("1–2 gün") Gürcüce tabloda Türkçe kalır — kabul edilen küçük istisna; `check-ka.py` bunu test etmez.

- [ ] **Step 6: `Reviews.astro`**

```astro
---
import { REVIEWS } from '../data/reviews';
import { SITE } from '../config/site';
import { getT, type Lang } from '../i18n';
const { lang = 'tr' } = Astro.props as { lang?: Lang };
const t = getT(lang);
---
<section class="section">
  <div class="container">
    <p class="eyebrow">{t.reviews.eyebrow}</p>
    <h2>{t.reviews.h2(SITE.rating.value, SITE.rating.count)}</h2>
    <div class="grid grid-3" style="margin-top:1.5rem">
      {REVIEWS.map((r) => <blockquote class="review"><div class="stars" aria-label={t.reviews.stars(r.stars)}>{'★'.repeat(r.stars)}</div><p>"{r.text}"</p><footer>— {r.name}, Google</footer></blockquote>)}
    </div>
    <p style="margin-top:1rem"><a href={SITE.mapsShare} target="_blank" rel="noopener">{t.reviews.all}</a></p>
  </div>
</section>
```

Yorum metinleri (`REVIEWS[].text`) Türkçe kalır; Gürcüce sayfada Google yorumu olduğu için kabul edilir.

- [ ] **Step 7: Build ve regresyon diff'i**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run check && npm run build && diff -r /tmp/moon-baseline dist | grep '^[<>]' | grep -v 'hreflang=' | grep -v 'lang-switch' | grep -v 'astro-' ; echo "exit=$?"
```
Expected: `exit=1`. Özellikle `dist/fiyatlar/index.html` tablo satırları ve `dist/index.html` yorum bölümü birebir aynı olmalı.

- [ ] **Step 8: Commit**

```bash
git add src/components/WhatsApp.astro src/components/Cta.astro src/components/Faq.astro src/components/Breadcrumbs.astro src/components/PriceTable.astro src/components/Reviews.astro
git commit -m "Bileşenler: WhatsApp, Cta, Faq, Breadcrumbs, PriceTable, Reviews lang desteği

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: BookingForm dil desteği

**Files:**
- Modify: `src/components/BookingForm.astro`

**Interfaces:**
- Consumes: `getT`, `Lang`; `t.form.*`.
- Produces: `BookingForm` prop'ları `preset?: string` (Türkçe hizmet slug'ı), `lang?: Lang`. Form elementinde `data-i18n` (JSON: `t.form.js`), `data-wa`. Script bu JSON'dan mesajı kurar.

- [ ] **Step 1: Frontmatter ve şablonu güncelle**

```astro
---
import { SITE } from '../config/site';
import { SERVICES } from '../data/services';
import { getT, type Lang } from '../i18n';
const { preset = '', lang = 'tr' } = Astro.props as { preset?: string; lang?: Lang };
const t = getT(lang);
const slots: string[] = [];
for (let h = 8, m = 30; h < 18; ) { slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`); m += 30; if (m === 60) { m = 0; h++; } }
---
<form class="form" id="booking" data-wa={SITE.whatsapp} data-i18n={JSON.stringify(t.form.js)} novalidate>
  <div class="row">
    <label>{t.form.service}
      <select name="hizmet" required>
        <option value="">{t.form.choose}</option>
        {SERVICES.map((s) => <option value={t.serviceName(s.slug, s.name)} selected={s.slug === preset}>{t.serviceName(s.slug, s.name)}</option>)}
        <option value={t.form.multi}>{t.form.multi}</option>
      </select>
    </label>
    <label>{t.form.car}
      <input name="arac" placeholder={t.form.carPlaceholder} required />
    </label>
  </div>
  <div class="row">
    <label>{t.form.date} <span class="hint">{t.form.dateHint}</span>
      <input type="date" name="tarih" id="tarih" required />
    </label>
    <label>{t.form.time} <span class="hint">{t.form.timeHint(SITE.capacity)}</span>
      <select name="saat" required>{slots.map((x) => <option value={x}>{x}</option>)}</select>
    </label>
  </div>
  <div class="row">
    <label>{t.form.name}<input name="ad" autocomplete="name" required /></label>
    <label>{t.form.phone}<input name="telefon" type="tel" inputmode="tel" autocomplete="tel" placeholder={t.form.phonePlaceholder} required /></label>
  </div>
  <label>{t.form.note} <span class="hint">{t.form.noteHint}</span>
    <textarea name="not" rows="3"></textarea>
  </label>
  <div class="form-status" id="status" role="status"></div>
  <div class="btn-row" style="margin-top:.2rem">
    <button class="btn btn-wa" type="submit" style="font-size:1.05rem">{t.form.submit}</button>
  </div>
  <p class="hint">{t.form.hint}</p>
</form>
```

- [ ] **Step 2: Script'i güncelle (yalnızca `compose` ve mesajlar değişir)**

```astro
<script>
  const form = document.getElementById('booking') as HTMLFormElement;
  const status = document.getElementById('status')!;
  const dateEl = document.getElementById('tarih') as HTMLInputElement;
  const i18n = JSON.parse(form.dataset.i18n || '{}') as { sunday: string; opening: string; greeting: string; labels: Record<string, string> };

  // Bugünden öncesi seçilemez; 60 gün ileriye kadar
  const fmt = (d: Date) => { const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 10); };
  const today = new Date(); dateEl.min = fmt(today);
  const max = new Date(); max.setDate(max.getDate() + 60); dateEl.max = fmt(max);

  // Alana tıklanınca tarayıcının takvimini aç (Chrome/Edge/Android); desteklenmiyorsa klavye ile girilir
  const openPicker = () => { try { (dateEl as any).showPicker?.(); } catch {} };
  dateEl.addEventListener('click', openPicker);
  dateEl.addEventListener('focus', openPicker);

  const show = (cls: 'ok' | 'err', msg: string) => { status.className = `form-status ${cls}`; status.textContent = msg; };

  const compose = () => {
    const d = new FormData(form);
    const g = (k: string) => String(d.get(k) ?? '').trim();
    const [y, m, day] = g('tarih').split('-');
    const tarih = y ? `${day}.${m}.${y}` : '-';
    const L = i18n.labels;
    return `${i18n.greeting}\n• ${L.service}: ${g('hizmet')}\n• ${L.car}: ${g('arac')}\n• ${L.date}: ${tarih}\n• ${L.time}: ${g('saat')}\n• ${L.name}: ${g('ad')}\n• ${L.phone}: ${g('telefon')}\n• ${L.note}: ${g('not') || '-'}`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new Date(dateEl.value + 'T12:00:00');
    if (d.getDay() === 0) { show('err', i18n.sunday); dateEl.focus(); return; }
    const url = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(compose())}`;
    show('ok', i18n.opening);
    const w = window.open(url, '_blank');
    if (!w) window.location.href = url;
  });
</script>
```

- [ ] **Step 3: Build ve regresyon diff'i**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run check && npm run build && diff /tmp/moon-baseline/randevu/index.html dist/randevu/index.html | grep '^[<>]' | grep -v 'hreflang=' | grep -v 'lang-switch' | grep -v 'astro-' | grep -v 'data-i18n' | grep -v '<script'
```
Expected: boş çıktı. Form HTML'i (etiketler, placeholder'lar, seçenekler) Türkçe'de birebir aynı; sadece `data-i18n` özniteliği ve script gövdesi değişti. Script'teki Türkçe mesajlar artık `data-i18n` JSON'unda — `grep -c 'Pazar günleri kapalıyız' dist/randevu/index.html` ≥ 1 olmalı.

- [ ] **Step 4: Commit**

```bash
git add src/components/BookingForm.astro
git commit -m "BookingForm: lang desteği, WhatsApp mesaj şablonu sözlükten

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Gürcüce sayfa içerikleri (`src/i18n/ka/pages.ts`)

**Files:**
- Create: `src/i18n/ka/pages.ts`

**Interfaces:**
- Produces: `KA_HOME`, `KA_SERVICES` (ppf | keramikuli-dafarva | minis-firi), `KA_PRICES`, `KA_CONTACT`, `KA_BOOKING` sabitleri (tipler aşağıda). Task 7–8 bu sabitleri okur.

- [ ] **Step 1: Dosyayı yaz**

```ts
import type { Faq } from '../../data/services';

export interface KaService {
  trSlug: string;            // services.ts içindeki slug (fiyat ve süre oradan okunur)
  title: string; description: string; eyebrow: string; h1: string;
  intro: string[]; benefits: string[]; steps: string[];
  priceNote: string;         // tablo notu (rakamsız) — PPF paketleri hariç
  faqs: Faq[]; wa: string; ctaTitle: string;
}

export const KA_HOME = {
  title: 'Moon Auto რიზე | PPF, კერამიკული დაფარვა, ავტო დეტეილინგი თურქეთში',
  description: 'PPF დამცავი ფირი, კერამიკული დაფარვა, პოლირება და სალონის ქიმწმენდა რიზეში, თურქეთი — სარფის საზღვრიდან 95 კმ. ვპასუხობთ ქართულად WhatsApp-ზე. Google 4,9 ★.',
  eyebrow: 'რიზე, თურქეთი · სარფიდან 95 კმ',
  h1: 'PPF და კერამიკული დაფარვა რიზეში — საქართველოდან 1,5 საათში',
  lead: 'დამცავი ფირი, კერამიკული დაფარვა, პოლირება, სალონის ქიმწმენდა და მინის დაბურვა — დახურულ, უმტვერო სტუდიაში. მოგვწერეთ WhatsApp-ზე ქართულად, ქართულად გიპასუხებთ.',
  btnBook: '📅 ონლაინ ჯავშანი', btnWa: 'ფასი WhatsApp-ით', btnPrices: 'ფასები',
  waHero: 'გამარჯობა Moon Auto, საქართველოდან გწერთ, ფასის გაგება მინდა.',
  stats: { reviews: 'Google შეფასება', capacity: 'მანქანა ერთდროულად', days: 'ორშ–შაბ', studio: 'დახურული სტუდია', studioSub: 'უმტვერო სამუშაო სივრცე' },
  georgia: {
    eyebrow: 'საქართველოდან ჩამოსულთათვის',
    h2: 'როგორ მუშაობს საქართველოდან ჩამოსვლა',
    items: [
      { b: 'მანძილი:', t: 'სარფის საზღვარი → რიზე ≈ 95 კმ (≈1,5 სთ სანაპირო გზით); ბათუმი → რიზე ≈ 150 კმ (≈2,5 სთ).' },
      { b: 'საბუთები:', t: 'პასპორტი, მანქანის ტექპასპორტი და მწვანე ბარათი (საერთაშორისო დაზღვევა) — ჩვეულებრივი საზღვრის გადაკვეთა.' },
      { b: 'ვადები:', t: 'PPF 1–4 დღე, კერამიკა 1–2 დღე, მინის დაბურვა 2–4 საათი. მანქანას ტოვებთ ჩვენთან; შეგიძლიათ დარჩეთ რიზეში ან ჩამოხვიდეთ შეთანხმებულ დღეს.' },
      { b: 'გადახდა:', t: 'თურქული ლირით, ნაღდი ფულით ან ბარათით. საიტზე ფასები ლირაშია; ზუსტ თანხას წინასწარ შევათანხმებთ.' },
      { b: 'ენა:', t: 'WhatsApp-ზე მოგვწერეთ ქართულად — გუნდში გვყავს ქართულენოვანი თანამშრომელი.' },
    ],
  },
  services: { eyebrow: 'სერვისები', h2: 'რას ვაკეთებთ', lead: 'ქვემოთ სამი ძირითადი სერვისია, რისთვისაც საქართველოდან ჩამოდიან. სრული სია და ფასები — ფასების გვერდზე.', more: 'დეტალები →' },
  why: {
    eyebrow: 'რატომ Moon Auto', h2: 'რატომ ღირს რიზემდე ჩამოსვლა',
    items: [
      { b: 'ახლოს:', t: 'ბათუმიდან 2,5 საათი — ტრაბზონამდე ან სტამბოლამდე გზა აღარ გჭირდებათ.' },
      { b: 'საღებავის სისქის გაზომვა:', t: 'პოლირებამდე და დაფარვამდე ყველა პანელი იზომება; საღებავი არ ზიანდება.' },
      { b: 'პროფესიონალური პროდუქტები:', t: 'კერამიკაში, ფირსა და პოლირებაში — მსოფლიოში ცნობილი ბრენდების პროდუქტები.' },
      { b: 'დახურული, უმტვერო სტუდია:', t: 'კერამიკა და PPF კეთდება არა ღია ცის ქვეშ, არამედ კონტროლირებად სივრცეში.' },
      { b: 'გამჭვირვალე ფასი:', t: 'საწყისი ფასები საიტზეა; მოულოდნელობა არ იქნება.' },
      { b: 'Google 4,9 ★:', t: 'რიზეში ყველაზე მაღალი შეფასების მქონე დეტეილინგის სტუდია.' },
    ],
    imgAlt: 'Moon Auto Detailing & Car Studio — რიზე, ისლამფაშა, სტუდიის ფასადი',
  },
  faqs: [
    { q: 'სად მდებარეობს Moon Auto?', a: 'რიზე, ისლამფაშას უბანი, ბარბაროსის ქუჩა 33/A — სარფის საზღვრიდან დაახლოებით 95 კმ სანაპირო გზით (D010). მისამართი და რუკა კონტაქტის გვერდზეა.' },
    { q: 'საჭიროა წინასწარი ჯავშანი?', a: 'PPF-ისთვის, კერამიკისა და სალონის ქიმწმენდისთვის — დიახ. მოგვწერეთ WhatsApp-ზე სასურველი თარიღი და მანქანის მოდელი, ან გამოიყენეთ ონლაინ ჯავშანი.' },
    { q: 'რამდენ ხანს სჭირდება სამუშაოს?', a: 'PPF 1–4 დღე, კერამიკული დაფარვა 1–2 დღე, პოლირება 1–2 დღე, მინის დაბურვა 2–4 საათი. ზუსტ ვადას მანქანის ნახვისთანავე გეტყვით.' },
    { q: 'როგორ ვიხდი?', a: 'თურქული ლირით — ნაღდი ფულით ან საბანკო ბარათით. ფასს წინასწარ, WhatsApp-ზე შევთანხმდებით.' },
    { q: 'ქართულად შეგიძლიათ პასუხი?', a: 'დიახ. გუნდში გვყავს ქართულენოვანი თანამშრომელი; WhatsApp-ზე ქართულად გიპასუხებთ.' },
  ],
  cta: { title: 'მოგვწერეთ ქართულად — დღესვე გიპასუხებთ', text: 'გამოგვიგზავნეთ მანქანის მოდელი და ფოტო WhatsApp-ზე; ზუსტ ფასს და თავისუფალ დღეს ქართულად გეტყვით.', wa: 'გამარჯობა Moon Auto, საქართველოდან გწერთ. მანქანა: ' },
};

export const KA_SERVICES: Record<string, KaService> = {
  ppf: {
    trSlug: 'rize-ppf-kaplama',
    title: 'PPF დამცავი ფირი რიზეში, თურქეთი | Moon Auto — საქართველოდან 1,5 სთ',
    description: 'PPF (საღებავის დამცავი ფირი) რიზეში: თვითაღდგენადი TPU ფირი ქვის დარტყმისა და ნაკაწრებისგან, 5–10 წლიანი გარანტია. კაპოტი, წინა კომპლექტი ან სრული ავტომობილი. ვპასუხობთ ქართულად.',
    eyebrow: '🛡️ რიზე · PPF', h1: 'PPF — საღებავის დამცავი ფირი რიზეში',
    intro: [
      'PPF (Paint Protection Film) არის 150–200 მიკრონი სისქის გამჭვირვალე, თვითაღდგენადი პოლიურეთანის ფირი, რომელიც საღებავს იცავს ქვის დარტყმის, ნაკაწრებისა და ქვიშის მიკრონაკაწრებისგან. შავი ზღვის სანაპირო და მთის გზებზე ხრეში და ქვები ფირს ხვდება და არა საღებავს.',
      'Moon Auto-ში ვმუშაობთ მსოფლიოში ცნობილი ბრენდების TPU ფირებით — პლოტერით ან ხელით ჭრით. ფირი არ ყვითლდება, 5–10 წლიანი გარანტიით. პაკეტები: კაპოტი, კაპოტი + ფრთები (წინა კომპლექტი), ბამპერი, სარკეები ან სრული ავტომობილი. საქართველოში ხარისხიანი PPF-ის სტუდიის პოვნა რთულია — რიზე ბათუმიდან 2,5 საათშია.',
    ],
    benefits: [
      'ფიზიკური დაცვა ქვის დარტყმის, ნაკაწრებისა და გასაღების კვალისგან',
      'თვითაღდგენადი ზედა ფენა: წვრილი ნაკაწრები სითბოსგან ქრება',
      'არ ყვითლდება და არ ხუნდება — TPU ფირი 5–10 წლიანი გარანტიით',
      'საჭიროებისას იხსნება უკვალოდ, ქარხნული საღებავი უცვლელი რჩება',
      'კერამიკასთან კომბინაციით — მაქსიმალური დაცვა',
    ],
    steps: [
      'დათვალიერება და საღებავის სისქის გაზომვა',
      'ორეტაპიანი რეცხვა, რკინის ნაწილაკების მოცილება, თიხის დამუშავება',
      'საჭიროებისას პოლირება — ფირის ქვეშ იდეალური ზედაპირისთვის',
      'ფირის ჭრა (პლოტერი / ხელით) და დადება დახურულ, უმტვერო სტუდიაში',
      'გაშრობა, ხარისხის კონტროლი და ჩაბარება',
    ],
    // Rakamlar services.ts 'rize-ppf-kaplama'.priceNote ile aynı (Türkçe'de de yalnızca metinde): kaput 10.000 · kaput+çamurluk 20.000 · full 70.000
    priceNote: 'კაპოტი 10.000 ₺ · კაპოტი + ფრთები 20.000 ₺ · სრული ავტომობილი 70.000 ₺-დან; დამოკიდებულია მოდელსა და სამუშაოს მოცულობაზე',
    faqs: [
      { q: 'რამდენ ხანს ძლებს PPF?', a: 'ხარისხიანი TPU ფირი 5–10 წელი. განსაკუთრებული მოვლა არ სჭირდება — ჩვეულებრივი, pH-ნეიტრალური შამპუნით რეცხვა საკმარისია.' },
      { q: 'შეიძლება მხოლოდ კაპოტზე დადება?', a: 'დიახ. ყველაზე პოპულარულია წინა კომპლექტი: კაპოტი + წინა ფრთები + ბამპერი + სარკეები — იქ, სადაც ქვები ყველაზე ხშირად ხვდება.' },
      { q: 'რამდენი დრო სჭირდება?', a: 'კაპოტი ან წინა კომპლექტი 1–2 დღე, სრული ავტომობილი 3–4 დღე. მანქანას ტოვებთ ჩვენთან.' },
      { q: 'ახალ მანქანაზე ღირს?', a: 'საუკეთესო შედეგი სწორედ ახალ, დაუზიანებელ საღებავზე მიიღება — კორექციის ხარჯი არ ემატება.' },
      { q: 'ზუსტი ფასი როგორ გავიგო?', a: 'მოგვწერეთ WhatsApp-ზე მანქანის მოდელი და რამდენიმე ფოტო; ზუსტ შეთავაზებას ქართულად გამოგიგზავნით.' },
    ],
    wa: 'გამარჯობა Moon Auto, საქართველოდან გწერთ, PPF-ის ფასი და თავისუფალი დღე მაინტერესებს. მანქანა: ',
    ctaTitle: 'დაჯავშნეთ PPF',
  },
  'keramikuli-dafarva': {
    trSlug: 'rize-seramik-kaplama',
    title: 'კერამიკული დაფარვა რიზეში, თურქეთი | 9H დაცვა — Moon Auto',
    description: 'კერამიკული დაფარვა რიზეში: 9H სიმტკიცის ნანო-კერამიკა, ჰიდროფობიური ზედაპირი, 2–5 წლიანი ხანგრძლივობა. საქართველოდან 1,5 საათში, ვპასუხობთ ქართულად.',
    eyebrow: '💎 რიზე · კერამიკა', h1: 'კერამიკული დაფარვა რიზეში — 9H დაცვა საღებავისთვის',
    intro: [
      'კერამიკული დაფარვა საღებავზე ქმნის 9H სიმტკიცის ნანო-კერამიკულ (SiO₂) ფენას, რომელიც წლების განმავლობაში იცავს ულტრაიისფერი სხივების, მჟავა წვიმის, ზღვის მარილისა და ფრინველის ნარჩენებისგან. ზედაპირი ჰიდროფობიური ხდება — წყალი წვეთებად ცურდება და მანქანა დიდხანს სუფთა რჩება.',
      'Moon Auto-ში დაფარვამდე მანქანა გადის ორეტაპიან რეცხვას, თიხის დამუშავებას და საჭიროებისას პოლირებას; დაფარვა კეთდება დახურულ, უმტვერო სტუდიაში და მანქანა გამყარებამდე ჩვენთან რჩება. ვიყენებთ მსოფლიოში ცნობილი ბრენდების კერამიკულ პროდუქტებს.',
    ],
    benefits: [
      'ჰიდროფობიური ზედაპირი: წყალი და ჭუჭყი ნაკლებად ეკვრება',
      'UV-სა და დაჟანგვისგან დაცვა, ფერის სიღრმე და სარკისებრი ბზინვარება',
      'ფრინველის ნარჩენები, ფისი და მწერები საღებავში აღარ იჭრება',
      'რეცხვა უფრო იშვიათი და მარტივი ხდება',
      '2–5 წლიანი ხანგრძლივობა (პაკეტის მიხედვით), ინარჩუნებს მანქანის ფასს',
    ],
    steps: [
      'დათვალიერება და საღებავის სისქის გაზომვა',
      'ორეტაპიანი რეცხვა, რკინის ნაწილაკების მოცილება, თიხის დამუშავება',
      'საღებავის კორექცია: ერთ- ან მრავალსაფეხურიანი პოლირება',
      'IPA-თი გაუცხიმოვნება და დაფარვა პანელ-პანელ',
      'გამყარება (12–24 სთ) და ხარისხის კონტროლი ჩაბარებამდე',
    ],
    priceNote: 'მსუბუქი ავტომობილი / ჯიპი და მსუბუქი კომერციული; საღებავის კორექცია ფასშია',
    faqs: [
      { q: 'რამდენ ხანს ძლებს კერამიკა?', a: 'პაკეტის მიხედვით 2–5 წელი. წელიწადში ერთხელ მოვლითი რეცხვა და კერამიკის განახლება ვადას ახანგრძლივებს.' },
      { q: 'როგორ ვრეცხო დაფარული მანქანა?', a: 'ჯაგრისიანი ავტომატური სამრეცხაო არ არის რეკომენდებული. ხელით, pH-ნეიტრალური შამპუნით — ან ჩვენთან, კერამიკის მოვლითი რეცხვით.' },
      { q: 'პოლირება ფასშია?', a: 'დიახ, საღებავის კორექცია ფასშია შედის. ძალიან დაზიანებული საღებავის შემთხვევაში დამატებით სამუშაოზე წინასწარ გეტყვით.' },
      { q: 'კერამიკა თუ PPF?', a: 'PPF ფიზიკურად იცავს ქვის დარტყმისა და ნაკაწრებისგან, კერამიკა — ქიმიური ზემოქმედებისა და ჭუჭყისგან, ამარტივებს მოვლას. საუკეთესო კომბინაცია: წინა ნაწილზე PPF, დანარჩენზე კერამიკა.' },
    ],
    wa: 'გამარჯობა Moon Auto, საქართველოდან გწერთ, კერამიკული დაფარვის ფასი და თავისუფალი დღე მაინტერესებს. მანქანა: ',
    ctaTitle: 'დაჯავშნეთ კერამიკული დაფარვა',
  },
  'minis-firi': {
    trSlug: 'rize-cam-filmi',
    title: 'მინის დაბურვა რიზეში, თურქეთი | UV და სითბოს დამცავი ფირი — Moon Auto',
    description: 'ავტომობილის მინის დაბურვა რიზეში: 99% UV დაცვა, სითბოს იზოლაცია, არ ბუშტდება, გარანტიით. 2–4 საათი. საქართველოდან 1,5 საათში.',
    eyebrow: '🪟 რიზე · მინის ფირი', h1: 'მინის დაბურვა რიზეში — სითბოსა და UV-ს დამცავი ფირი',
    intro: [
      'მინის დაბურვა მხოლოდ იერსახე არ არის: ის ამცირებს სალონის ტემპერატურას, 99%-ით ბლოკავს ულტრაიისფერ სხივებს და იცავს სალონს გახუნებისგან. ცხელ, ნესტიან ზაფხულში კონდიციონერს ნაკლები დატვირთვა აქვს.',
      'Moon Auto-ში ვიყენებთ პრემიუმ ნანო-კერამიკულ ფირებს, რომლებიც არ ბუშტდება და ფერს არ კარგავს; ვჭრით პლოტერით, გარანტიით. ტონს თქვენი ქვეყნის წესების გათვალისწინებით შევარჩევთ — გეტყვით, რომელი ტონი გაივლის ტექდათვალიერებას.',
    ],
    benefits: ['99% UV დაცვა', 'სითბოს იზოლაცია და კონდიციონერის ეფექტურობა', 'პრივატულობა და ქურდობის შემაკავებელი ეფექტი', 'არ ბუშტდება და არ ხუნდება — ფირი გარანტიით', 'სწრაფი შესრულება: 2–4 საათი, იმავე დღეს ბრუნდებით'],
    steps: ['ტონისა და სერიის შერჩევა', 'მინის გაწმენდა და პლოტერით ჭრა', 'ფირის დადება და სითხის მოცილება', 'გაშრობა', 'კონტროლი და ჩაბარება'],
    priceNote: 'ყველა მინა, ლეგალური ტონით',
    faqs: [
      { q: 'რამდენ ხანში შეიძლება მინის ჩამოწევა?', a: 'დადების შემდეგ 2–3 დღე გირჩევთ, მინები არ ჩამოწიოთ.' },
      { q: 'რომელი ტონი ავირჩიო?', a: 'რამდენიმე ვარიანტი გვაქვს. წინა და წინა გვერდითი მინებისთვის გირჩევთ ღია ტონს, რომ ტექდათვალიერებაზე პრობლემა არ შეგექმნათ; უკანა მინებზე — თქვენი სურვილით.' },
      { q: 'იმავე დღეს დავბრუნდები?', a: 'დიახ. სამუშაოს 2–4 საათი სჭირდება; შეგიძლიათ რიზეში ისადილოთ და მანქანა მზად დაგხვდებათ.' },
    ],
    wa: 'გამარჯობა Moon Auto, საქართველოდან გწერთ, მინის დაბურვის ფასი მაინტერესებს. მანქანა: ',
    ctaTitle: 'დაჯავშნეთ მინის დაბურვა',
  },
};

export const KA_SERVICE_PAGE = {
  benefits: 'უპირატესობები', steps: 'როგორ ვაკეთებთ', faqTitle: (name: string) => `${name} — ხშირად დასმული კითხვები`,
  priceFrom: 'საწყისი ფასი', priceSuv: 'ჯიპი / მსუბუქი კომერციული', duration: 'ხანგრძლივობა', book: '📅 ჯავშანი', waBtn: 'შეთავაზება WhatsApp-ით',
  aside: { title: 'Moon Auto რიზე', georgia: 'სარფის საზღვრიდან ≈95 კმ · ბათუმიდან ≈150 კმ' },
  related: 'სხვა სერვისები', crumb: 'სერვისები',
  priceHint: 'ფასები დღგ-ს ჩათვლით, თურქულ ლირაში. ზუსტი ფასისთვის გამოგვიგზავნეთ მანქანის ფოტო WhatsApp-ზე.',
  imgAlt: (h1: string) => `${h1} — Moon Auto რიზე, სტუდია`,
};

export const KA_PRICES = {
  title: 'ფასები | Moon Auto რიზე — PPF, კერამიკა, დეტეილინგი (₺)',
  description: 'Moon Auto რიზეს ფასები თურქულ ლირაში: კერამიკული დაფარვა, PPF, პოლირება, სალონის ქიმწმენდა, მინის დაბურვა და რეცხვა. გადახდა ნაღდი ან ბარათით.',
  crumb: 'ფასები', h1: 'ფასები — Moon Auto რიზე',
  lead: 'ფასები მითითებულია თურქულ ლირაში (₺), დღგ-ს ჩათვლით. მსუბუქი ავტომობილისა და ჯიპის / მსუბუქი კომერციულის ფასები განსხვავდება. PPF: კაპოტი, კაპოტი + ფრთები ან სრული ავტომობილი — დამოკიდებულია მოდელზე. ზუსტი შეთავაზებისთვის გამოგვიგზავნეთ მანქანის ფოტო WhatsApp-ზე.',
  note: 'განახლებულია: 14 სექტემბერი 2026. გადახდა ნაღდი ფულით ან ბარათით, ლირაში. ძალიან დაზიანებული საღებავის შემთხვევაში დამატებითი კორექცია შეიძლება დასჭირდეს — ამაზე წინასწარ გეტყვით.',
  faqs: [
    { q: 'რატომ განსხვავდება მსუბუქი ავტომობილისა და ჯიპის ფასი?', a: 'ჯიპსა და მსუბუქ კომერციულს მეტი ზედაპირი და მოცულობა აქვს; იზრდება პროდუქტისა და სამუშაო დროის რაოდენობა.' },
    { q: 'როგორია PPF-ის ფასები?', a: 'კაპოტიდან იწყება; წინა კომპლექტი (კაპოტი + ფრთები) და სრული ავტომობილი ცალკე პაკეტებია. მოდელი და სამუშაოს მოცულობა ფასს ცვლის — მოგვწერეთ მოდელი WhatsApp-ზე.' },
    { q: 'რა ვალუტაში ვიხდი?', a: 'თურქულ ლირაში, ნაღდი ფულით ან ბარათით. ლარში ან დოლარში ფასს არ ვაფიქსირებთ, რადგან კურსი იცვლება; ზუსტ თანხას ლირაში წინასწარ შევათანხმებთ.' },
    { q: 'არის პაკეტური ფასდაკლება?', a: 'დიახ: კერამიკა + PPF, პოლირება + კერამიკა და სალონის ქიმწმენდა + ანტიბაქტერიული წმენდა კომბინაციებზე ფასდაკლება მოქმედებს.' },
  ],
  cta: { title: 'ზუსტი ფასისთვის გამოგვიგზავნეთ მანქანის ფოტო', wa: 'გამარჯობა Moon Auto, საქართველოდან გწერთ, ზუსტი ფასი მინდა. ფოტოებს ვაგზავნი.' },
};

export const KA_CONTACT = {
  title: 'კონტაქტი | Moon Auto რიზე — მისამართი, WhatsApp, როგორ ჩამოვიდეთ საქართველოდან',
  description: 'Moon Auto რიზე: ისლამფაშა, ბარბაროსის ქ. 33/A. WhatsApp ქართულად. სარფის საზღვრიდან 95 კმ, ბათუმიდან 150 კმ. ორშ–შაბ 08:30–18:30.',
  crumb: 'კონტაქტი', h1: 'კონტაქტი',
  lead: 'გელოდებით რიზეში, ისლამფაშას უბანში. ჯავშნისა და ფასისთვის ყველაზე სწრაფი გზა — WhatsApp, ქართულად.',
  imgAlt: 'Moon Auto Detailing & Car Studio — რიზე, ისლამფაშა, ბარბაროსის ქუჩა, სტუდიის შენობა',
  cards: {
    address: 'მისამართი', directions: 'მარშრუტი რუკაზე', phone: 'ტელეფონი და WhatsApp', waText: 'გამარჯობა Moon Auto, საქართველოდან გწერთ, ინფორმაცია მინდა.',
    hours: 'სამუშაო საათები', hoursText: 'ორშაბათი – შაბათი 08:30 – 18:30 · კვირა დასვენება', capacity: (n: number) => `ერთდროულად ${n} მანქანა`,
    social: 'სოციალური ქსელები', maps: (r: number) => `Google რუკები (${r} ★)`,
  },
  mapTitle: 'Moon Auto რიზე — რუკა',
  howTo: {
    h3: 'როგორ ჩამოვიდეთ საქართველოდან',
    text: 'სარფის საზღვრის გადაკვეთის შემდეგ სანაპირო გზით (D010) დასავლეთისკენ: ჰოფა → არჰავი → ფინდიკლი → არდეშენი → ჩაელი → რიზე, ≈95 კმ, დაახლოებით 1,5 საათი. ბათუმიდან სულ ≈150 კმ (≈2,5 სთ). რიზეში რეჯეფ თაიფ ერდოღანის ბულვარიდან შეუხვიეთ ისლამფაშას უბანში; ბარბაროსის ქუჩა 33/A ბულვარიდან რამდენიმე ასეულ მეტრშია. სტუდიის წინ და გვერდით პარკინგია. საჭირო საბუთები: პასპორტი, ტექპასპორტი, მწვანე ბარათი.',
  },
  cta: { title: 'დასაჯავშნად', text: 'ონლაინ ჯავშნის გვერდზე აირჩიეთ სერვისი და საათი, ან პირდაპირ WhatsApp-ზე მოგვწერეთ ქართულად.' },
};

export const KA_BOOKING = {
  title: 'ონლაინ ჯავშანი | Moon Auto რიზე — PPF, კერამიკა, დეტეილინგი',
  description: 'Moon Auto რიზეს ონლაინ ჯავშანი: აირჩიეთ სერვისი, თარიღი და საათი — მოთხოვნა WhatsApp-ით მოგვწვდება, ქართულად გიპასუხებთ. ორშ–შაბ 08:30–18:30.',
  crumb: 'ჯავშანი', h1: 'ონლაინ ჯავშანი',
  lead: 'აირჩიეთ სერვისი, თარიღი და საათი; მონაცემები მზა WhatsApp შეტყობინებად გადაიქცევა, საათს დავადასტურებთ და ქართულად გიპასუხებთ. საქართველოდან ჩამოსვლას 1,5–2,5 საათი სჭირდება — თარიღის არჩევისას გაითვალისწინეთ.',
  aside: {
    hours: 'სამუშაო საათები', hoursText: 'ორშაბათი – შაბათი 08:30 – 18:30 · კვირა დასვენება', address: 'მისამართი', directions: 'მარშრუტი',
    durations: 'ხანგრძლივობა', items: ['პრემიუმ რეცხვა: 1–2 საათი', 'მინის დაბურვა: 2–4 საათი', 'პოლირება: 1–2 დღე', 'სალონის ქიმწმენდა: 1–2 დღე', 'კერამიკა: 1–2 დღე', 'PPF: 1–4 დღე'],
  },
};
```

- [ ] **Step 2: Tip kontrolü**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run check
```
Expected: 0 hata (dosya henüz import edilmiyor ama `astro check` tüm `src` TS dosyalarını derler).

- [ ] **Step 3: Commit**

```bash
git add src/i18n/ka/pages.ts
git commit -m "i18n: Gürcüce sayfa içerikleri (ana sayfa, PPF, kerámika, cam filmi, fiyat, iletişim, randevu)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Gürcüce ana sayfa ve hizmet sayfaları

**Files:**
- Create: `src/pages/ka/index.astro`, `src/pages/ka/[slug].astro`

**Interfaces:**
- Consumes: `KA_HOME`, `KA_SERVICES`, `KA_SERVICE_PAGE` (Task 6); `KA_SERVICE_SLUGS`, `serviceHref`, `getT` (Task 1); bileşenlerin `lang` prop'u (Task 2–5); `SERVICES`, `getService`, `formatTL` (`src/data/services.ts`); `SITE`.
- Produces: `/ka/`, `/ka/ppf/`, `/ka/keramikuli-dafarva/`, `/ka/minis-firi/`.

- [ ] **Step 1: `src/pages/ka/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Reviews from '../../components/Reviews.astro';
import Cta from '../../components/Cta.astro';
import Faq from '../../components/Faq.astro';
import { SITE } from '../../config/site';
import { SERVICES, formatTL } from '../../data/services';
import { getT, KA_SERVICE_ROUTES } from '../../i18n';
import { KA_HOME as H } from '../../i18n/ka/pages';
const t = getT('ka');
const featured = SERVICES.filter((s) => KA_SERVICE_ROUTES[s.slug]);
const wa = (text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
const glob = import.meta.glob('/public/images/services/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const imgs: Record<string, string> = Object.fromEntries(featured.filter((s) => Object.keys(glob).includes(`/public/images/services/${s.key}.webp`)).map((s) => [s.key, `/images/services/${s.key}.webp`]));
---
<Base lang="ka" title={H.title} description={H.description} canonical="/ka/" waText={t.wa.defaultText}>
  <section class="hero hero--img">
    <div class="container">
      <p class="eyebrow">{H.eyebrow} · {SITE.rating.value} ★ Google</p>
      <h1>{H.h1}</h1>
      <p class="lead">{H.lead}</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="/ka/javshani/">{H.btnBook}</a>
        <a class="btn btn-wa" href={wa(H.waHero)} target="_blank" rel="noopener">{H.btnWa}</a>
        <a class="btn btn-outline" href="/ka/pasebi/">{H.btnPrices}</a>
      </div>
      <div class="hero-stats">
        <div><strong>{SITE.rating.value} <span class="stars">★</span></strong><span>{SITE.rating.count} {H.stats.reviews}</span></div>
        <div><strong>{SITE.capacity}</strong><span>{H.stats.capacity}</span></div>
        <div><strong>{H.stats.days}</strong><span>{SITE.hours.open}–{SITE.hours.close}</span></div>
        <div><strong>{H.stats.studio}</strong><span>{H.stats.studioSub}</span></div>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <p class="eyebrow">{H.georgia.eyebrow}</p>
      <h2>{H.georgia.h2}</h2>
      <ul class="checks">{H.georgia.items.map((i) => <li><strong>{i.b}</strong> {i.t}</li>)}</ul>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <p class="eyebrow">{H.services.eyebrow}</p>
      <h2>{H.services.h2}</h2>
      <p class="lead">{H.services.lead}</p>
      <div class="grid grid-3" style="margin-top:1.5rem">
        {featured.map((s) => (
          <article class="card">
            {imgs[s.key] && <a href={KA_SERVICE_ROUTES[s.slug]}><img src={imgs[s.key]} alt={`${t.serviceName(s.slug, s.name)} – Moon Auto რიზე`} width="700" height="438" loading="lazy" decoding="async" /></a>}
            <div class="icon" aria-hidden="true">{s.icon}</div>
            <h3><a href={KA_SERVICE_ROUTES[s.slug]}>{t.serviceName(s.slug, s.name)}</a></h3>
            <p style="color:var(--muted)">{t.priceNote(s.slug, s.priceNote)}</p>
            <div class="price">{s.priceFrom > 0 ? t.price.from(formatTL(s.priceFrom)) : t.price.callForPrice} · {s.duration}</div>
            <a href={KA_SERVICE_ROUTES[s.slug]} style="font-weight:700">{H.services.more}</a>
          </article>
        ))}
      </div>
      <p style="margin-top:1rem"><a href="/ka/pasebi/">{H.btnPrices} →</a></p>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container two-col">
      <div>
        <p class="eyebrow">{H.why.eyebrow}</p>
        <h2>{H.why.h2}</h2>
        <ul class="checks">{H.why.items.map((i) => <li><strong>{i.b}</strong> {i.t}</li>)}</ul>
      </div>
      <div>
        <img src="/images/vitrin.webp" alt={H.why.imgAlt} width="1600" height="739" loading="lazy" style="border-radius:14px;width:100%;height:auto" />
      </div>
    </div>
  </section>

  <Reviews lang="ka" />

  <section class="section section--alt"><div class="container"><Faq lang="ka" faqs={H.faqs} /></div></section>
  <section class="section"><div class="container"><Cta lang="ka" title={H.cta.title} text={H.cta.text} wa={H.cta.wa} /></div></section>
</Base>
```

Not: `ServiceCard.astro` Türkçe linkler ürettiği için burada kullanılmaz; kart markup'ı `ServiceCard.astro` ile aynı sınıfları (`article.card`, `div.icon`, `h3 a`, `div.price`) kullanır. `Reviews` Task 4'te `lang` desteği aldı; yorum metinleri Türkçe kalır.

- [ ] **Step 2: `src/pages/ka/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import Faq from '../../components/Faq.astro';
import Cta from '../../components/Cta.astro';
import { SITE } from '../../config/site';
import { getService, formatTL } from '../../data/services';
import { getT, KA_SERVICE_SLUGS, KA_SERVICE_ROUTES } from '../../i18n';
import { KA_SERVICES, KA_SERVICE_PAGE as P } from '../../i18n/ka/pages';

export function getStaticPaths() { return Object.keys(KA_SERVICES).map((slug) => ({ params: { slug } })); }
const slug = Astro.params.slug!;
const k = KA_SERVICES[slug];
const s = getService(k.trSlug)!;
const t = getT('ka');
const path = `/ka/${slug}/`;
const name = t.serviceName(s.slug, s.name);
const others = Object.entries(KA_SERVICE_SLUGS).filter(([x]) => x !== slug).map(([x, tr]) => ({ href: `/ka/${x}/`, name: t.serviceName(tr, tr) }));
const ld = {
  '@context': 'https://schema.org', '@type': 'Service', inLanguage: 'ka',
  name: k.h1, serviceType: name, description: k.description,
  provider: { '@id': SITE.url + '/#business' },
  areaServed: [{ '@type': 'City', name: 'Rize' }, { '@type': 'City', name: 'Batumi' }, { '@type': 'Country', name: 'Georgia' }],
  ...(s.priceFrom > 0 ? { offers: { '@type': 'Offer', priceCurrency: 'TRY', price: s.priceFrom, availability: 'https://schema.org/InStock', url: SITE.url + path } } : {}),
};
const imgs = import.meta.glob('/public/images/services/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const img = Object.keys(imgs).includes(`/public/images/services/${s.key}.webp`) ? `/images/services/${s.key}.webp` : null;
const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(k.wa)}`;
---
<Base lang="ka" title={k.title} description={k.description} canonical={path} jsonLd={ld} waText={k.wa}>
  <Breadcrumbs lang="ka" items={[{ name: P.crumb, href: '/ka/pasebi/' }, { name }]} />
  <section class="section" style="padding-top:1.5rem">
    <div class="container two-col">
      <article class="prose">
        <p class="eyebrow">{k.eyebrow}</p>
        <h1>{k.h1}</h1>
        {k.intro.map((p) => <p>{p}</p>)}
        {img && <img src={img} alt={P.imgAlt(k.h1)} width="1400" height="875" loading="eager" style="border-radius:14px;margin:1.5rem 0;width:100%;height:auto" />}
        <h2>{P.benefits}</h2>
        <ul class="checks">{k.benefits.map((b) => <li>{b}</li>)}</ul>
        <h2>{P.steps}</h2>
        <ol class="steps">{k.steps.map((st) => <li><span>{st}</span></li>)}</ol>
        <p class="hint" style="color:var(--muted);font-size:.9rem">{P.priceHint}</p>
        <div style="margin-top:2.5rem"><Faq lang="ka" faqs={k.faqs} title={P.faqTitle(name)} /></div>
      </article>
      <aside class="aside">
        <div class="card">
          <p class="eyebrow">{P.priceFrom}</p>
          <div class="price" style="font-size:1.8rem">{s.priceFrom > 0 ? t.price.from(formatTL(s.priceFrom)) : t.price.callForPrice}</div>
          {s.priceSuv && <p style="color:var(--muted);margin:.3rem 0 0">{P.priceSuv}: {formatTL(s.priceSuv)}</p>}
          <p style="color:var(--muted);margin:.3rem 0 0">{k.priceNote}. {P.duration}: {s.duration}.</p>
          <div class="btn-row" style="flex-direction:column">
            <a class="btn btn-primary" href={`/ka/javshani/?hizmet=${s.slug}`}>{P.book}</a>
            <a class="btn btn-wa" href={waHref} target="_blank" rel="noopener">{P.waBtn}</a>
            <a class="btn btn-outline" href={`tel:${SITE.phoneE164}`}>☎ {SITE.phoneDisplay}</a>
          </div>
        </div>
        <div class="card">
          <h3>{P.aside.title}</h3>
          <p style="color:var(--muted);margin:0">{SITE.address.full}<br />{P.aside.georgia}<br />Google: {SITE.rating.value} ★ ({SITE.rating.count})</p>
        </div>
      </aside>
    </div>
  </section>
  <section class="section section--alt"><div class="container">
    <h2>{P.related}</h2>
    <div class="grid grid-3">{others.map((o) => <a class="card" href={o.href}><h3>{o.name}</h3></a>)}</div>
  </div></section>
  <section class="section"><div class="container"><Cta lang="ka" title={k.ctaTitle} wa={k.wa} /></div></section>
</Base>
```

Not: `s.duration` ("1–4 gün") Türkçe kalır; "gün" kelimesi kısa ve rakamla okunur — kabul edilen istisna. İstenirse `KA_SERVICES[slug].duration` alanı eklenebilir, bu planda eklenmez.

- [ ] **Step 3: Build ve kısmi doğrulama**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run check && npm run build && ls dist/ka && python3 scripts/check-ka.py; echo "exit=$?"
```
Expected: `dist/ka` içinde `index.html`, `ppf/`, `keramikuli-dafarva/`, `minis-firi/`; check-ka'da yalnızca `eksik sayfa: /ka/pasebi/`, `/ka/kontakti/`, `/ka/javshani/` hataları (3 hata). Başka hata varsa (örn. "çevrilmemiş arayüz metni") kaynağını bul ve düzelt.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ka/index.astro "src/pages/ka/[slug].astro"
git commit -m "ka: Gürcüce ana sayfa ve PPF / kerámika / cam filmi sayfaları

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Gürcüce fiyat, iletişim ve randevu sayfaları

**Files:**
- Create: `src/pages/ka/pasebi.astro`, `src/pages/ka/kontakti.astro`, `src/pages/ka/javshani.astro`

**Interfaces:**
- Consumes: `KA_PRICES`, `KA_CONTACT`, `KA_BOOKING` (Task 6); `PriceTable`, `BookingForm`, `Breadcrumbs`, `Faq`, `Cta` `lang` prop'ları (Task 4–5); `KA_SERVICE_NAMES` (`src/i18n/ka.ts`).
- Produces: `/ka/pasebi/`, `/ka/kontakti/`, `/ka/javshani/`.

- [ ] **Step 1: `pasebi.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import PriceTable from '../../components/PriceTable.astro';
import Faq from '../../components/Faq.astro';
import Cta from '../../components/Cta.astro';
import { KA_PRICES as K } from '../../i18n/ka/pages';
---
<Base lang="ka" title={K.title} description={K.description} canonical="/ka/pasebi/" waText={K.cta.wa}>
  <Breadcrumbs lang="ka" items={[{ name: K.crumb }]} />
  <section class="section" style="padding-top:1.5rem"><div class="container">
    <h1>{K.h1}</h1>
    <p class="lead">{K.lead}</p>
    <div style="margin-top:1.5rem"><PriceTable lang="ka" /></div>
    <p style="color:var(--muted);margin-top:1rem;font-size:.9rem">{K.note}</p>
    <div style="margin-top:2.5rem"><Faq lang="ka" faqs={K.faqs} /></div>
  </div></section>
  <section class="section"><div class="container"><Cta lang="ka" title={K.cta.title} wa={K.cta.wa} /></div></section>
</Base>
```

- [ ] **Step 2: `kontakti.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import Cta from '../../components/Cta.astro';
import { SITE } from '../../config/site';
import { KA_CONTACT as K } from '../../i18n/ka/pages';
const C = K.cards;
---
<Base lang="ka" title={K.title} description={K.description} canonical="/ka/kontakti/" waText={C.waText}>
  <Breadcrumbs lang="ka" items={[{ name: K.crumb }]} />
  <section class="section" style="padding-top:1.5rem"><div class="container">
    <h1>{K.h1}</h1>
    <p class="lead">{K.lead}</p>
    <img src="/images/vitrin.webp" alt={K.imgAlt} width="1600" height="739" loading="eager" style="border-radius:14px;margin:1.5rem 0" />
    <div class="grid grid-4">
      <div class="card"><h3>{C.address}</h3><p style="color:var(--muted)">{SITE.address.full}<br />Plus code: {SITE.plusCode}</p><a class="btn btn-outline" href={SITE.mapsShare} target="_blank" rel="noopener">{C.directions}</a></div>
      <div class="card"><h3>{C.phone}</h3><p style="color:var(--muted)"><a href={`tel:${SITE.phoneE164}`}>{SITE.phoneDisplay}</a></p><a class="btn btn-wa" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(C.waText)}`} target="_blank" rel="noopener">WhatsApp</a></div>
      <div class="card"><h3>{C.hours}</h3><p style="color:var(--muted)">{C.hoursText}</p><p style="color:var(--muted);font-size:.9rem">{C.capacity(SITE.capacity)}</p></div>
      <div class="card"><h3>{C.social}</h3><p><a href={SITE.social.instagram} target="_blank" rel="noopener">Instagram @moonautodetailingrize</a><br /><a href={SITE.social.facebook} target="_blank" rel="noopener">Facebook</a><br /><a href={SITE.mapsShare} target="_blank" rel="noopener">{C.maps(SITE.rating.value)}</a></p></div>
    </div>
    <div style="margin-top:1.5rem;border-radius:14px;overflow:hidden;border:1px solid var(--line)">
      <iframe src={SITE.mapsEmbed} width="100%" height="380" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title={K.mapTitle}></iframe>
    </div>
    <div class="card" style="margin-top:1.5rem">
      <h3>{K.howTo.h3}</h3>
      <p style="color:var(--muted);margin:0">{K.howTo.text}</p>
    </div>
  </div></section>
  <section class="section"><div class="container"><Cta lang="ka" title={K.cta.title} text={K.cta.text} /></div></section>
</Base>
```

- [ ] **Step 3: `javshani.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import BookingForm from '../../components/BookingForm.astro';
import { SITE } from '../../config/site';
import { KA_BOOKING as K } from '../../i18n/ka/pages';
import { KA_SERVICE_NAMES } from '../../i18n/ka';
---
<Base lang="ka" title={K.title} description={K.description} canonical="/ka/javshani/">
  <Breadcrumbs lang="ka" items={[{ name: K.crumb }]} />
  <section class="section" style="padding-top:1.5rem"><div class="container two-col">
    <div>
      <h1>{K.h1}</h1>
      <p class="lead">{K.lead}</p>
      <div class="card" style="margin-top:1.5rem"><BookingForm lang="ka" /></div>
    </div>
    <aside class="aside">
      <div class="card">
        <h3>{K.aside.hours}</h3>
        <p style="color:var(--muted)">{K.aside.hoursText}</p>
        <h3>{K.aside.address}</h3>
        <p style="color:var(--muted)">{SITE.address.full}</p>
        <a class="btn btn-outline" href={SITE.mapsShare} target="_blank" rel="noopener">{K.aside.directions}</a>
      </div>
      <div class="card">
        <h3>{K.aside.durations}</h3>
        <ul class="checks" style="color:var(--muted)">{K.aside.items.map((i) => <li>{i}</li>)}</ul>
      </div>
    </aside>
  </div></section>
  <script define:vars={{ names: KA_SERVICE_NAMES }}>
    // URL'den gelen ?hizmet=<türkçe slug> ile Gürcüce hizmet adını önceden seç
    const p = new URLSearchParams(location.search).get('hizmet');
    const sel = document.querySelector('select[name=hizmet]');
    if (p && sel && names[p]) sel.value = names[p];
  </script>
</Base>
```

- [ ] **Step 4: Build ve tam doğrulama**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run check && npm run build && python3 scripts/check-ka.py && diff -r /tmp/moon-baseline dist | grep '^[<>]' | grep -v 'hreflang=' | grep -v 'lang-switch' | grep -v 'astro-' | grep -v 'data-i18n' | grep -v '<script' | grep -v '^> ' ; echo "exit=$?"
```
Expected: check-ka `OK`, exit 0; diff filtresi boş (`exit=1`). Not: `grep -v '^> '` yeni `dist/ka/*` dosyalarını ("Only in dist: ka") eler; "Only in" satırı kalırsa sorun değil.

- [ ] **Step 5: Sitemap kontrolü**

```bash
cd /Users/mehmetalikose/mustafakaradag && grep -o 'moonauto.com.tr/ka/[a-z-]*/' dist/sitemap-0.xml | sort -u
```
Expected: 7 satır (`/ka/`, `/ka/ppf/`, `/ka/keramikuli-dafarva/`, `/ka/minis-firi/`, `/ka/pasebi/`, `/ka/kontakti/`, `/ka/javshani/`). `/ka/` için çıktı `moonauto.com.tr/ka/` olarak görünür.

- [ ] **Step 6: Commit**

```bash
git add src/pages/ka/pasebi.astro src/pages/ka/kontakti.astro src/pages/ka/javshani.astro
git commit -m "ka: fiyatlar, iletişim ve randevu sayfaları

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Tarayıcı doğrulaması, yayın ve dokümantasyon

**Files:**
- Modify: `docs/DEPLOY.md` (kısa "Gürcüce sürüm" bölümü), `docs/superpowers/plans/2026-10-15-gurcuce-dil.md` (bu dosya: kutuları işaretle)
- Modify: `.claude/launch.json` (yoksa oluştur)

**Interfaces:**
- Consumes: Task 1–8 çıktıları.

- [ ] **Step 1: Dev sunucusunu preview ile aç**

`.claude/launch.json` yoksa oluştur:

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "astro-dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 4321 }
  ]
}
```

`preview_start {name: "astro-dev"}` ile aç; `navigate` → `http://localhost:4321/ka/`.

- [ ] **Step 2: Mobil genişlikte kontrol**

`resize_window {preset: "mobile"}`; `/ka/` sayfasında `read_page` ile: `<html lang="ka">`, menüde `PPF · კერამიკა · მინის ფირი · ფასები · კონტაქტი`, dil anahtarı `TR | ქარ`; `screenshot` ile Gürcüce gliflerin düzgün (kutu/soru işareti yok) ve kalın başlıkların Noto 700 ile çıktığını gör. `javascript_tool`: `getComputedStyle(document.querySelector('h1')).fontFamily` → `"Noto Sans Georgian"` ile başlar.

- [ ] **Step 3: Dil anahtarı ve hreflang**

`/ka/ppf/` → anahtarda TR tıkla → `/rize-ppf-kaplama/` açılmalı; oradan `ქარ` → `/ka/ppf/`. `/hakkimizda/` → `ქარ` → `/ka/` (karşılığı yok). `read_console_messages` hata yok.

- [ ] **Step 4: Randevu formu**

`/ka/javshani/?hizmet=rize-ppf-kaplama` aç: hizmet seçimi `PPF დამცავი ფირი` olarak önceden seçili. `form_input` ile araç, tarih (Pazar olmayan bir gün), ad, telefon doldur; `javascript_tool` ile `window.open = (u) => { window.__wa = u; return {}; }` tanımla; formu gönder; `window.__wa` değerini oku → `https://wa.me/905425537853?text=` ile başlar, decode edilince `გამარჯობა Moon Auto, ჯავშნის მოთხოვნა:` ve `• სერვისი: PPF დამცავი ფირი` içerir. Pazar günü seçildiğinde durum metni `კვირას დაკეტილი ვართ…`.

- [ ] **Step 5: Türkçe sayfa görsel kontrolü**

`/` ve `/randevu/` açıp `screenshot`: Türkçe menü ve form bugünkü gibi; header'da ek olarak yalnızca `TR | ქარ`.

- [ ] **Step 6: `docs/DEPLOY.md` sonuna bölüm ekle**

```markdown
## Gürcüce sürüm (/ka/)

- Sayfalar: `src/pages/ka/`; metinler `src/i18n/ka.ts` (arayüz) ve `src/i18n/ka/pages.ts` (içerik). Fiyat/NAP Türkçe veriden okunur.
- Yeni bir Türkçe sayfayı Gürcüce'ye bağlamak için `src/i18n/routes.ts` içindeki `KA_ROUTES` tablosuna ekle; hreflang ve dil anahtarı otomatik gelir.
- Doğrulama: `npm run build && python3 scripts/check-ka.py`.
- `KA_NOINDEX` (`src/i18n/routes.ts`) ana dili Gürcüce olan kişi metinleri onaylayana kadar `true`; onaydan sonra `false` yap, push et, Search Console'da 7 `/ka/` URL'si için dizin isteği gönder.
```

- [ ] **Step 7: Son kontrol, commit, push (deploy GitHub Actions ile otomatik)**

```bash
cd /Users/mehmetalikose/mustafakaradag && npm run check && npm run build && python3 scripts/check-ka.py && git add -A && git status --short
```
`tmp-upload/` ve `dist/` git-ignored; `git status` yalnızca docs/launch.json göstermeli.

```bash
git commit -m "Gürcüce sürüm: dokümantasyon ve preview ayarı

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git push origin main
```

Push sonrası 3 dakika bekleyip canlıyı doğrula:

```bash
curl -s https://www.moonauto.com.tr/ka/ | grep -o '<html lang="ka"\|hreflang="ka"\|noindex' | sort | uniq -c
```
Expected: üçü de en az 1 kez (noindex, onay gelene kadar).

- [ ] **Step 8: Kullanıcıya rapor**

Rapor şunları içerir: 7 Gürcüce URL; `noindex` açık ve onay beklendiği; onay için Mustafa Bey'in Gürcüce bilen kişisine gönderilecek sayfa listesi; onay sonrası yapılacak tek değişiklik (`KA_NOINDEX = false`).

---

## Plan Öz-Denetimi

- **Spec kapsamı:** URL eşlemesi (T1), dosya yapısı (T1, T6), Base/hreflang/font/JSON-LD/noindex (T2), Header/Footer/dil anahtarı (T3), diğer bileşenler (T4), BookingForm (T5), içerik ilkeleri ve Gürcistan bölümü (T6–T7), fiyat/iletişim/randevu (T8), sitemap i18n kullanılmaması (T2 notu, T8 Step 5 kontrolü), test maddeleri 1–4 (T2 script, T8 Step 4, T9), ana dil onayı yayın şartı (KA_NOINDEX, T9 Step 6–8), kapsam dışı maddeler plana alınmadı.
- **Yer tutucu taraması:** Tüm kod blokları tam; "TBD/TODO" yok. Kabul edilen bilinçli istisnalar açıkça yazıldı (`s.duration` Türkçe, Reviews başlığı Türkçe).
- **Tip tutarlılığı:** `getT(lang)`, `alternates(path)`, `switcherTarget(path, to)`, `serviceHref(lang, slug)`, `KA_SERVICE_ROUTES`, `KA_SERVICE_SLUGS`, `KA_NOINDEX`, `EXTRA_PRICES[].key`, `t.form.js` (data-i18n), `KA_HOME/KA_SERVICES/KA_SERVICE_PAGE/KA_PRICES/KA_CONTACT/KA_BOOKING` adları T1–T8 boyunca aynı. `Faq` tipi `src/data/services.ts`'ten (`{ q, a }`).
