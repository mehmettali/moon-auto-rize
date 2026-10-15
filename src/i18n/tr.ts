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
