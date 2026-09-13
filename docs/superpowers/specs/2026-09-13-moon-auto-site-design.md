# Moon Auto Rize — Site Tasarım Kararları

Tarih: 13 Eylül 2026. Müşteri kararı: yapı ve SEO mimarisi tamamen geliştiriciye bırakıldı, ek soru sorulmayacak.

## Verilen kesin bilgiler
- Marka: **Moon Auto** (alt başlık: Auto Detailing & Car Studio, Rize)
- Pazar günleri kapalı. Pzt–Cmt 08:30 açılış (Google). Kapanış saati verilmedi → **18:30 varsayıldı**, `src/config/site.ts` içinden değiştirilir.
- Fiyatlar sitede gösterilecek. Gerçek tarife verilmedi → piyasa aralıklarından **"… TL'den başlayan" başlangıç fiyatları** `src/data/services.ts` içine yazıldı; tek dosyadan güncellenir.
- Kapasite: aynı anda 5 araç → randevu formunda saat başına 5 slot varsayımı, sadece bilgi amaçlı (statik sitede gerçek doluluk kontrolü yok).
- Ürün markaları: Slopes, Polytop, Menzerna, 3M, 3D, Soft99, Angelwax, Gyeon, IGL, Koch Chemie, Moben.
- Alan adı: müşteri anahtar kelimeli bir domain alacak; site adı yine Moon Auto. Domain `site.ts` içinde tek satır.

## Platform kararı: Astro (statik)
Gerekçe: en yüksek Lighthouse/Core Web Vitals, sıfır güvenlik bakımı, herhangi bir hosting'e (Netlify/Vercel/Cloudflare Pages veya cPanel'e dosya yükleme) çalışır, içerik TypeScript veri dosyaları + Markdown ile yönetilir. WordPress reddedildi: Rize'deki rakiplerle fark yaratacak şey hız + içerik derinliği; eklenti bakım yükü gereksiz.

## Randevu
- `/randevu/` sayfası: hizmet, tarih (Pazar seçilemez), saat (08:30–17:30, yarım saat), araç, ad, telefon, not.
- Gönderim: **Web3Forms** (ücretsiz, 250/ay, e-postaya düşer). Erişim anahtarı `site.ts` → `web3formsKey`. Anahtar boşsa form otomatik olarak **WhatsApp'a ön-doldurulmuş mesaj** olarak düşer; yani site ilk günden çalışır.
- Her sayfada sabit WhatsApp butonu + tıkla-ara.

## URL / SEO mimarisi
- Hizmet sayfaları kök seviyede, anahtar kelime URL'de: `/rize-seramik-kaplama/`, `/rize-ppf-kaplama/` … (11 sayfa)
- İlçe sayfaları: `/hizmet-bolgeleri/cayeli/` … (6 ilçe: Çayeli, Ardeşen, Pazar, Güneysu, Derepazarı, İyidere) — her biri özgün paragraf + mesafe/süre bilgisi, hizmet listesine iç link.
- Blog: `/blog/<slug>/` (5 bilgi amaçlı yazı, uzun kuyruk).
- Diğer: `/`, `/hizmetler/`, `/fiyatlar/`, `/randevu/`, `/galeri/`, `/hakkimizda/`, `/sss/`, `/iletisim/`, `/tesekkurler/`, `404`.
- Şema: `AutoWash` (LocalBusiness) sitewide; hizmet sayfalarında `Service` + `FAQPage` + `BreadcrumbList`; blogda `Article`.
- `@astrojs/sitemap`, `robots.txt`, canonical, Open Graph, Türkçe `lang="tr"`.
- Görseller: müşteri fotoğrafları gelene kadar SVG/CSS yer tutucular; `public/images/` altına konulunca otomatik kullanılır.

## Bileşenler
Base layout (head/SEO/JSON-LD/header/footer/WhatsApp), Hero, ServiceCard, PriceTable, FAQ (details/summary), Breadcrumbs, BookingForm (vanilla JS), Reviews (Google'dan alıntılar), Brands, CTA, DistrictCard.

## Test / doğrulama
`npm run build` hatasız, `dist/` içinde tüm sayfalar, sitemap üretimi, HTML'de JSON-LD geçerliliği (basit script), tarayıcıda mobil/masaüstü kontrol.
