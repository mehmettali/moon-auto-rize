# Moon Auto Rize — Web Sitesi

Astro ile yapılmış statik, SEO odaklı oto detailing sitesi. 33 sayfa: 10 hizmet, 6 ilçe, 5 blog, kurumsal sayfalar, online randevu.

## Komutlar
```bash
npm install      # bağımlılıklar
npm run dev      # http://localhost:4321
npm run build    # dist/ klasörüne statik çıktı
npm run preview  # build çıktısını yerelde görüntüle
```

## Canlı site ve deploy
Site **https://www.moonauto.com.tr** adresinde cPanel hostingde yayında. `main` dalına her push, GitHub Actions ile otomatik build + SFTP deploy tetikler. Ayrıntılar: [docs/DEPLOY.md](docs/DEPLOY.md). Eski github.io önizlemesi (`build:pages`, gh-pages dalı) artık kullanılmıyor.

## Alan adı: moonauto.com.tr
Canonical adres `https://www.moonauto.com.tr`; http ve www'suz varyantlar `.htaccess` ile 301 yönlenir. DNS Cloudflare üzerinden.

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
