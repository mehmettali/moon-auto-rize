export interface District {
  slug: string;
  name: string;
  population: number;
  distanceKm: number;
  driveMin: number;
  intro: string;
  landmarks: string;
}

/** Nüfus: ADNKS 2025. Mesafeler Rize Merkez İslampaşa'dan yaklaşık karayolu. */
export const DISTRICTS: District[] = [
  {
    slug: 'cayeli', name: 'Çayeli', population: 42032, distanceKm: 18, driveMin: 20,
    intro: "Çayeli'nden Moon Auto'ya sahil yolu üzerinden 20 dakikada ulaşırsınız. Çayeli sanayi ve çay fabrikası bölgesinde çalışan araçların yoğun kirlenmesi için detaylı iç-dış temizlik ve boya koruma paketleri hazırlıyoruz.",
    landmarks: 'Çayeli sahil yolu, Madenli, Kaptanpaşa',
  },
  {
    slug: 'ardesen', name: 'Ardeşen', population: 43519, distanceKm: 40, driveMin: 40,
    intro: "Ardeşen ve Fırtına Vadisi çevresinden gelen müşterilerimiz için aynı gün teslim seramik ve pasta cila randevusu ayırıyoruz. Yaylalara çıkan SUV ve pick-up araçların çamur ve reçine temizliğinde uzmanız.",
    landmarks: 'Fırtına Deresi, Tunca, Ardeşen sahil',
  },
  {
    slug: 'pazar', name: 'Pazar', population: 32144, distanceKm: 32, driveMin: 33,
    intro: "Pazar ilçesinden Moon Auto'ya 35 dakikalık yolculuk için randevunuzu önceden alın; aracınızı teslim edip Rize merkezde işlerinizi halledebilirsiniz. Uzun süreli seramik ve PPF uygulamalarında araç teslim saati esnekliği sağlıyoruz.",
    landmarks: 'Pazar sahil, Hemşin yolu, Kızılay',
  },
  {
    slug: 'guneysu', name: 'Güneysu', population: 15013, distanceKm: 12, driveMin: 15,
    intro: "Güneysu, Moon Auto'ya en yakın ilçelerden biri. 15 dakikalık mesafeden gelen müşterilerimiz için hızlı premium yıkama ve far parlatma gibi 1-2 saatlik hizmetlerde bekleme salonumuzu kullanabilirsiniz.",
    landmarks: 'Güneysu merkez, Çamlıhemşin yolu kavşağı',
  },
  {
    slug: 'derepazari', name: 'Derepazarı', population: 6772, distanceKm: 9, driveMin: 12,
    intro: "Derepazarı'ndan 12 dakikada ulaşabileceğiniz Moon Auto, İyidere-Derepazarı hattındaki ticari araç ve kamyonetler için motor temizliği ve antibakteriyel kabin temizliği paketleri sunar.",
    landmarks: 'Derepazarı sahil, Rize-Trabzon yolu',
  },
  {
    slug: 'iyidere', name: 'İyidere', population: 8495, distanceKm: 14, driveMin: 16,
    intro: "İyidere ve lojistik limanı çevresinden gelen araçlar deniz tuzu ve toz nedeniyle hızlı kirlenir; boya koruma (seramik / PPF) tam da bu koşullar için tasarlandı. İyidere'den Moon Auto'ya 16 dakika.",
    landmarks: 'İyidere Lojistik Limanı, Rize-Trabzon sahil yolu',
  },
];
