# Gürcüce (ka) dil sürümü — tasarım

Tarih: 15 Ekim 2026
Durum: onaylandı (kullanıcı: "top sende")

## Amaç

Gürcistan'dan (özellikle Batum / Acara) gelebilecek müşteriler için sitenin
odaklı bir Gürcüce sürümünü yayınlamak. Gürcistan'da PPF ve seramik kaplama
uygulayıcısı bulmak zor; Rize, Sarp sınır kapısına ~95 km / 1,5 saat. Hedef:
Gürcü müşteri siteyi kendi dilinde okuyup WhatsApp'tan Gürcüce yazabilsin ve
randevu alabilsin.

Kullanıcı kararları (15 Ekim):
- Kapsam: odaklı set (7 sayfa). İlçe sayfaları ve blog çevrilmez.
- Mustafa Bey tarafında Gürcüce bilen biri var → WhatsApp mesajları ve form
  tamamen Gürcüce.
- Şimdilik yalnızca Gürcüce. Altyapı çok dilli kurulur; Rusça/İngilizce
  sonradan sözlük + sayfa ekleyerek gelir.

## Yaklaşım

Astro'nun yerleşik `i18n` ayarı açılır (`defaultLocale: 'tr'`,
`locales: ['tr', 'ka']`, `prefixDefaultLocale: false`). Türkçe sayfalar ve
URL'leri değişmez. Gürcüce sayfalar `src/pages/ka/` altında ayrı `.astro`
dosyaları olarak yazılır. Ortak bileşenler `lang` parametresi alır ve
metinlerini `src/i18n/` sözlüğünden çeker; `lang` verilmezse davranış bugünkü
Türkçe ile birebir aynıdır.

Reddedilen alternatifler: bileşenleri kopyalayıp bağımsız Gürcüce sayfalar
(kod çatallanır, fiyat/NAP iki yerde güncellenir); tüm siteyi `[lang]` dinamik
rotaya taşımak (7 sayfa için aşırı, Türkçe URL riski).

## URL ve sayfa eşlemesi

| Gürcüce URL | Türkçe karşılığı | Kaynak sayfa |
|---|---|---|
| `/ka/` | `/` | `src/pages/ka/index.astro` |
| `/ka/ppf/` | `/rize-ppf-kaplama/` | `src/pages/ka/ppf.astro` |
| `/ka/keramikuli-dafarva/` | `/rize-seramik-kaplama/` | `src/pages/ka/keramikuli-dafarva.astro` |
| `/ka/minis-firi/` | `/rize-cam-filmi/` | `src/pages/ka/minis-firi.astro` |
| `/ka/pasebi/` | `/fiyatlar/` | `src/pages/ka/pasebi.astro` |
| `/ka/kontakti/` | `/iletisim/` | `src/pages/ka/kontakti.astro` |
| `/ka/javshani/` | `/randevu/` | `src/pages/ka/javshani.astro` |

Eşleme tek yerde tutulur: `src/i18n/routes.ts` (`tr → ka` ve `ka → tr`
yönlerini veren iki yardımcı). Hreflang, dil anahtarı ve breadcrumb bu
tabloyu kullanır. Slug'lar Latin harfli Gürcüce transliterasyondur.

## Dosya yapısı

```
src/i18n/
  routes.ts        # tr↔ka URL eşlemesi, locale listesi, yardımcılar
  tr.ts            # arayüz sözlüğü (bugünkü Türkçe metinler, bileşenlerden taşınır)
  ka.ts            # arayüz sözlüğü (Gürcüce)
  index.ts         # getT(lang) → sözlük; tip tanımı (UI shape)
src/i18n/ka/
  pages.ts         # Gürcüce sayfa içerikleri: hero, hizmet anlatımları, faydalar, SSS,
                   # "Gürcistan'dan gelenler" bölümü, fiyat tablosu başlıkları, CTA metinleri
src/pages/ka/      # 7 sayfa
public/fonts/NotoSansGeorgian-*.woff2   # kendi sunucumuzdan, yalnız ka sayfalarında
```

Arayüz sözlüğü (`UI` tipi) alanları: nav (6 menü + telefon + randevu butonu),
header logo alt başlığı ve aria etiketleri, footer başlıkları ve alt satır,
WhatsApp balonu aria + varsayılan mesaj, alt çağrı çubuğu (Ara / Randevu),
Cta varsayılan başlık/metin/WhatsApp mesajı, Faq başlığı, breadcrumb "Ana
Sayfa", PriceTable sütun başlıkları ve "Fiyat için arayın" etiketi,
BookingForm etiketleri/ipuçları/hata ve durum mesajları/WhatsApp mesaj
şablonu, dil anahtarı etiketleri.

Fiyatlar, NAP, çalışma saatleri, puan: `SITE` ve `SERVICES` üzerinden
okunur; Gürcüce dosyalarda rakam tekrarlanmaz. Gürcüce hizmet adları
`pages.ts` içinde `slug → ad` haritasıyla verilir (form seçenekleri ve
fiyat tablosu için).

## Bileşen değişiklikleri

- `Base.astro`: `lang?: 'tr' | 'ka'` (varsayılan tr). `<html lang>`,
  `og:locale` (`tr_TR` / `ka_GE`), hreflang: eşlemesi olan her sayfada
  `tr`, `ka` ve `x-default` (= tr) `<link rel="alternate">`; eşlemesi olmayan
  Türkçe sayfalarda hreflang yazılmaz. Gürcüce sayfalarda JSON-LD
  işletme bloğuna `inLanguage: 'ka'` ve `areaServed`'e `Batumi`, `Adjara`,
  `Georgia` eklenir; Türkçe sayfalarda blok değişmez. Noto Sans Georgian
  `@font-face` ve `body { font-family }` override'ı yalnızca `lang === 'ka'`
  iken `<head>`'e basılır. Meta Pixel ve olaylar aynen kalır.
- `Header.astro`: `lang` alır; menü linkleri sözlükten; Gürcüce sayfalarda
  linkler `/ka/...` hedeflerine gider (menüde karşılığı olmayan Galeri,
  Blog, Hakkımızda Gürcüce menüde yer almaz; Gürcüce menü: PPF,
  კერამიკა, მინის ფირი, ფასები, კონტაქტი, telefon, ჯავშანი butonu; logo
  `/ka/`'ya gider).
  Dil anahtarı: `TR | ქარ`; mevcut sayfanın karşılığına, karşılığı yoksa
  `/ka/` ya da `/`'a gider. Anahtar her iki dilde de görünür.
- `Footer.astro`: `lang` alır. Gürcüce'de hizmet listesi yalnızca 3
  çevrilmiş hizmeti, kurumsal listesi 7 Gürcüce sayfayı gösterir; ilçe
  sütunu yerine "Gürcistan'dan gelenler" kısa bilgi (sınır mesafesi, WhatsApp).
- `WhatsApp.astro`, `Cta.astro`, `Faq.astro`, `Breadcrumbs.astro`,
  `PriceTable.astro`: `lang` alır; metinler sözlükten; linkler ka
  rotalarına. PriceTable Gürcüce'de hizmet adını `pages.ts` haritasından,
  karşılığı olmayan hizmetleri Türkçe adıyla ve Türkçe sayfasına linkle
  gösterir (fiyat şeffaflığı için tüm liste görünür).
- `BookingForm.astro`: `lang` alır. Gürcüce etiketler; telefon ipucu
  `+995 5xx xxx xxx`; WhatsApp mesaj şablonu tamamen Gürcüce; Pazar
  kontrolü ve durum mesajları Gürcüce. Seçenek listesi Gürcüce hizmet
  adları + "სხვა / რამდენიმე სერვისი".

Türkçe sayfalar bileşenleri `lang` vermeden kullanmaya devam eder; görünür
çıktı bugünkü ile aynı kalmalıdır (regresyon şartı).

## İçerik ilkeleri (Gürcüce)

- Türkçe sayfaların birebir çevirisi değil; Gürcü müşterinin sorularına
  göre yazılır: neden Rize (yakınlık, fiyat, kapalı stüdyo, 4,9 puan),
  nasıl gelinir (Sarp → Rize ~95 km / 1,5 saat; Batum → Rize ~150 km /
  2,5 saat), gerekli belgeler (pasaport, araç ruhsatı, yeşil kart sigortası),
  süre ve konaklama (PPF 1–4 gün, seramik 1–2 gün; aracı bırakıp Rize'de
  konaklama ya da belirlenen günde teslim), ödeme (TL nakit veya kart;
  GEL/USD kuru gösterilmez, "güncel kur üzerinden TL" notu), iletişim
  ("WhatsApp'a Gürcüce yazabilirsiniz, Gürcüce yanıt veriyoruz").
- Ana sayfada ayrı "საქართველოდან ჩამოსულთათვის" (Gürcistan'dan gelenler
  için) bölümü; bu bölüm `kontakti` sayfasında da kısa olarak tekrar eder.
- Marka adı geçmez ("dünyaca ünlü marka ürünler" kuralı), "polen" ve
  "vakum" iddiası yok, Google 4,9 puanı geçebilir (reklam kısıtı yalnızca
  avatar videosu içindi).
- Terimler: PPF = დამცავი ფირი (PPF); seramik kaplama = კერამიკული
  დაფარვა; cam filmi = მინის დაბურვა; pasta cila = პოლირება; oto
  detailing = ავტო დეტეილინგი.
- Her Gürcüce sayfanın `<title>` ve açıklaması Gürcüce, "რიზე" (Rize) ve
  "თურქეთი" (Türkiye) anahtar kelimeleriyle.

## SEO

- Hreflang `Base.astro` içinden elle yazılır. `@astrojs/sitemap`'in
  `i18n` seçeneği **kullanılmaz** çünkü eklenti her URL için tüm dillerde
  alternate üretir ve çevrilmemiş sayfalar için var olmayan `/ka/` URL'leri
  listelenir. Sitemap `/ka/` sayfalarını normal URL olarak zaten içerir.
- Gürcüce sayfalar canonical olarak kendi `/ka/...` URL'sini taşır. Ana
  dili Gürcüce olan kişinin onayına kadar `noindex` ile yayınlanır (Base'in
  mevcut `noindex` parametresi; tek bir `KA_NOINDEX` sabitiyle yönetilir);
  onay sonrası sabit kapatılır.
- Yayın sonrası Search Console'da 7 Gürcüce URL için dizin isteği.

## Yazı tipi

Noto Sans Georgian (OFL lisansı) Regular ve Bold woff2 olarak
`public/fonts/` altına konur ve yalnızca `lang === 'ka'` sayfalarda
`@font-face` + `font-display: swap` ile yüklenir. Dış CDN kullanılmaz.
Font dosyalarının indirilmesi uygulama sırasında yapılır (Google Fonts
GitHub deposu); dosya boyutu toplam < 200 KB beklenir.

## Test ve doğrulama

1. `npm run check` ve `npm run build` hatasız.
2. `scripts/check-ka.py`: `dist/` içinde 7 Gürcüce sayfanın varlığı,
   her birinde `lang="ka"`, canonical, `tr`/`ka`/`x-default` hreflang
   üçlüsü; Türkçe karşılıklarında `ka` hreflang'ın bulunması; eşlemesi
   olmayan Türkçe sayfada (ör. `/hakkimizda/`) hreflang olmaması; Gürcüce
   sayfalarda Latin "Randevu Al" gibi çevrilmemiş arayüz metni kalmaması.
3. Türkçe regresyon: build öncesi/sonrası `dist/index.html`,
   `dist/fiyatlar/index.html`, `dist/rize-ppf-kaplama/index.html`
   karşılaştırılır; yalnızca hreflang satırları ve dil anahtarı farkı
   beklenir.
4. Tarayıcı (preview): `/ka/` mobil genişlikte Gürcüce glifler, menü, dil
   anahtarı; `/ka/javshani/` formu doldurulup gönderildiğinde açılan
   WhatsApp URL'sinin Gürcüce şablonu içerdiği doğrulanır.
5. Yayın şartı: Gürcüce metinleri Mustafa Bey'in Gürcüce bilen kişisi
   okuyup onaylar. Onaya kadar sayfalar `noindex` ile yayınlanabilir;
   onay sonrası `noindex` kaldırılır ve dizin isteği yapılır.

## Kapsam dışı (sonraki adımlar)

İlçe sayfaları ve blogun çevirisi; Rusça/İngilizce; Gürcistan (Batum)
hedefli Meta reklam kampanyası; Google İşletme Profili'ne Gürcüce açıklama;
Gürcüce Instagram içeriği.
