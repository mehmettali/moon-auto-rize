# Moon Auto Rize — Web Sitesi

Astro ile yapılmış statik, SEO odaklı oto detailing sitesi. 33 sayfa: 10 hizmet, 6 ilçe, 5 blog, kurumsal sayfalar, online randevu.

## Komutlar
```bash
npm install      # bağımlılıklar
npm run dev      # http://localhost:4321
npm run build    # dist/ klasörüne statik çıktı
npm run preview  # build çıktısını yerelde görüntüle
```

## Önizleme adresi (GitHub Pages)
https://mehmettali.github.io/moon-auto-rize/ — depo: https://github.com/mehmettali/moon-auto-rize

Güncellemek için:
```bash
npm run build:pages && cd dist && git init -q && git checkout -q -b gh-pages && git add -A && git commit -qm deploy && git push -qf https://github.com/mehmettali/moon-auto-rize.git gh-pages && cd .. && rm -rf dist/.git
```
`build:pages` betiği linklere `/moon-auto-rize` ön ekini ekler; kendi alan adında yayınlarken normal `npm run build` kullanın.

## Alan adı: moonauto.com.tr
Canonical adres `https://www.moonauto.com.tr` (site.ts, robots.txt, sitemap, JSON-LD ve OG etiketleri buna göre). Alan adı GitHub Pages'e bağlanacaksa DNS'te şu kayıtlar girilir:

| Tür | Ad | Değer |
|---|---|---|
| CNAME | www | mehmettali.github.io |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

DNS yayıldıktan sonra: depo → Settings → Pages → Custom domain: `www.moonauto.com.tr`, "Enforce HTTPS" işaretlenir. Bu andan itibaren `npm run build` (ön eksiz) ile deploy edilir; `build:pages` yalnızca github.io alt dizini içindir.

## Yayına alma (alternatif hosting)
1. `npm run build` → `dist/` klasörünü Netlify / Vercel / Cloudflare Pages'e sürükleyin **veya** cPanel'de `public_html` içine yükleyin.
4. Google Search Console + Yandex Webmaster'a `sitemap-index.xml` gönderin.
5. Google İşletme Profili'ne web sitesi adresini ekleyin.

## Randevu formu
Form, girilen bilgileri hazır bir WhatsApp mesajına çevirip `site.ts` içindeki `whatsapp` numarasına gönderir. Sunucu veya e-posta servisi gerekmez. İleride e-posta bildirimi istenirse Web3Forms benzeri bir form servisi `BookingForm.astro` içine eklenebilir.

## İçerik güncelleme
| Ne | Nerede |
|---|---|
| Adres, telefon, saatler, puan | `src/config/site.ts` |
| Fiyatlar, hizmet metinleri, SSS | `src/data/services.ts` (`priceFrom` alanı) |
| İlçe sayfaları | `src/data/districts.ts` |
| Ürün markaları | `src/data/brands.ts` |
| Google yorum alıntıları | `src/data/reviews.ts` |
| Blog yazısı | `src/content/blog/yeni-yazi.md` (frontmatter örneği mevcut yazılarda) |
| Galeri fotoğrafları | `public/images/galeri/*.webp` — otomatik listelenir, dosya adı alt metne dönüşür (örn. `23-seramik-bmw.webp`) |
| Hizmet görselleri | `public/images/services/<key>.webp` (seramik, ppf, pasta, ic-temizlik, yikama, cam-filmi, antibakteriyel, far, motor, car-studio) |
| Ana görsel / vitrin | `public/images/hero.webp`, `vitrin.webp`, `vitrin-gece.webp` |
| OG paylaşım görseli | `public/images/og-moon-auto-rize.jpg` (1200×630) |

## Fiyatlar
14 Eylül 2026'da Mustafa Karadağ'ın ilettiği tarife işlendi: `src/data/services.ts` (`priceFrom` otomobil, `priceSuv`, `priceMinibus`, `EXTRA_PRICES`) ve `src/data/serviceDetails.ts` (`packages[].from`). Motor temizliği ve car studio için fiyat verilmedi; `0` olarak duruyor ve sitede "Fiyat için arayın" görünüyor.

## İçerik katmanları
| Dosya | İçerik |
|---|---|
| `src/data/services.ts` | Hizmet temel metni, faydalar, adımlar, SSS, başlangıç fiyatı |
| `src/data/serviceDetails.ts` | Kimler için, paketler, Rize notu, bakım, sık hatalar, ek SSS, ilgili blog |
| `src/data/districts.ts` | İlçe temel bilgisi (nüfus, mesafe, giriş) |
| `src/data/districtDetails.ts` | Yol tarifi, yıpratan koşullar, popüler hizmetler, mahalleler, ipucu, ek SSS |
