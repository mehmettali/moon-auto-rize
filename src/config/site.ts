/**
 * Tek yerden yönetilen firma bilgileri (NAP) ve site ayarları.
 * Buradaki değerler Google İşletme Profili, Instagram ve Facebook ile birebir aynı olmalı.
 */
export const SITE = {
  // Alan adı alındığında burayı güncelleyin (sonda / olmasın).
  url: 'https://www.moonauto.com.tr',
  brand: 'Moon Auto',
  legalName: 'Moon Auto Detailing & Car Studio',
  tagline: "Rize'nin Profesyonel Oto Bakım Merkezi",
  description:
    "Moon Auto Rize: seramik kaplama, PPF, pasta cila, detaylı iç temizlik, cam filmi ve premium oto yıkama. Rize Merkez'de 4,9 puanlı oto kuaför. Online randevu.",
  phoneDisplay: '0542 553 78 53',
  phoneE164: '+905425537853',
  whatsapp: '905425537853',
  // Randevu bildirimlerinin düşeceği e-posta (Web3Forms'a kayıtlı adres).
  email: 'info@moonauto.com.tr',
  // https://web3forms.com adresinden e-posta ile alınan ücretsiz erişim anahtarı.
  // Boş bırakılırsa randevu formu WhatsApp mesajı olarak gönderilir.
  web3formsKey: '',
  address: {
    street: 'İslampaşa Mah. 2 Nolu, Barbaros Sk. No:33/A',
    district: 'Merkez',
    city: 'Rize',
    postalCode: '53100',
    country: 'TR',
    full: 'İslampaşa Mah. 2 Nolu, Barbaros Sk. No:33/A, 53100 Merkez / Rize',
  },
  geo: { lat: 41.0314, lng: 40.5599 },
  plusCode: '2HJ5+HX Rize Merkez',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Moon+AUTO+Rize+oto+y%C4%B1kama+kuaf%C3%B6r&query_place_id=',
  mapsShare: 'https://share.google/udxLmMkt5G7gJeujV',
  mapsEmbed:
    'https://www.google.com/maps?q=Moon+AUTO+Rize+oto+y%C4%B1kama+kuaf%C3%B6r+Car+Studio&output=embed',
  hours: {
    open: '08:30',
    close: '18:30',
    // 0 = Pazar … 6 = Cumartesi
    closedDays: [0],
    text: 'Pazartesi – Cumartesi 08:30 – 18:30 · Pazar kapalı',
  },
  capacity: 5, // aynı anda araç
  rating: { value: 4.9, count: 69 },
  social: {
    instagram: 'https://www.instagram.com/moonautodetailingrize/',
    facebook: 'https://www.facebook.com/moonautodetailingrize/',
  },
  founded: '2019',
} as const;

export const OG_IMAGE = '/images/og-moon-auto-rize.jpg';
