import type { Faq } from './services';

export interface DistrictDetail {
  route: string;            // yol tarifi paragrafı
  conditions: string[];     // ilçede araçları yıpratan koşullar
  popular: { slug: string; why: string }[];
  neighborhoods: string[];  // ilçedeki mahalle/köy adları (yerel arama)
  tip: string;
  extraFaqs: Faq[];
}

export const DISTRICT_DETAILS: Record<string, DistrictDetail> = {
  cayeli: {
    route: "Çayeli merkezden D-010 sahil yolu ile batı yönüne ilerleyin; Rize Merkez girişinde Recep Tayyip Erdoğan Bulvarı'nı takip edip İslampaşa Mahallesi'ne dönün. Stüdyomuz Barbaros Sokak No:33/A'da, bulvara birkaç yüz metre. Kavşaklarda \"Moon Auto Rize\" araması Google Haritalar'da doğrudan kapımıza getirir.",
    conditions: [
      'Çay fabrikaları çevresinde yoğun toz ve organik kalıntı',
      'Madenli ve Kaptanpaşa yollarında çamur ve mıcır',
      'Sahil şeridinde deniz tuzu ile hızlanan korozyon',
      'Yaz aylarında Çayeli sahilinde otoparkta kuş pisliği ve reçine',
    ],
    popular: [
      { slug: 'rize-seramik-kaplama', why: 'Sahil tuzu ve fabrika tozuna karşı kir tutmayan yüzey' },
      { slug: 'rize-detayli-ic-temizlik', why: 'Çay bahçesi ve fabrika çalışanlarının araçlarında biriken toprak ve nem' },
      { slug: 'rize-motor-temizligi', why: 'Madenli hattındaki çamur sonrası motor bölümü' },
    ],
    neighborhoods: ['Çayeli merkez', 'Madenli', 'Kaptanpaşa', 'Büyükköy', 'Eskipazar', 'Sabuncular', 'Yeşiltepe'],
    tip: "Çayeli'nden gelen müşterilerimizin çoğu aracı sabah bırakıp Rize merkezde işlerini hallediyor; seramik ve detaylı iç temizlik için sabah 08:30 randevusu en verimlisi.",
    extraFaqs: [
      { q: "Çayeli'de seramik kaplama yapan var mı?", a: "Çayeli sanayisinde birkaç yıkama noktası var; kapalı, tozsuz stüdyo ve boya kalınlığı ölçümü ile seramik uygulaması için 20 dakika uzaklıktaki Moon Auto Rize'ye gelen müşterilerimiz artıyor." },
    ],
  },
  ardesen: {
    route: "Ardeşen'den D-010 sahil yolu ile Pazar ve Çayeli üzerinden Rize Merkez'e yaklaşık 40 dakika. Merkez girişinde Recep Tayyip Erdoğan Bulvarı'nı takip edip İslampaşa Mahallesi Barbaros Sokak'a dönün.",
    conditions: [
      'Fırtına Vadisi ve Çamlıhemşin yolunda mıcır, taş çarpması ve reçine',
      'Yaylaya çıkan SUV ve pick-up araçlarda çamur, alt takımda tuz-toprak karışımı',
      'Tunca ve sahil kesiminde deniz tuzu',
      'Turizm sezonunda uzun süre açıkta park: UV ve kuş pisliği',
    ],
    popular: [
      { slug: 'rize-ppf-kaplama', why: 'Fırtına Vadisi ve yayla yolu taş çarpmasına karşı ön set koruması' },
      { slug: 'rize-oto-yikama', why: 'Yayla dönüşü çamur ve alt takım yıkama' },
      { slug: 'rize-pasta-cila', why: 'Dal sürtmesi ve yıkama çiziklerinin giderilmesi' },
    ],
    neighborhoods: ['Ardeşen merkez', 'Tunca', 'Fırtına', 'Yeniyol', 'Işıklı', 'Kurtuluş', 'Duygulu'],
    tip: "Ardeşen'den seramik veya PPF için gelenlere aracı 2 gün bırakma seçeneği sunuyoruz; dönüşte aracınız stüdyoda kapalı alanda bekler.",
    extraFaqs: [
      { q: "Ardeşen'den PPF için Trabzon'a mı gitmeliyim?", a: "Hayır. Ardeşen–Rize 40 dakika, Ardeşen–Trabzon 2 saat. Moon Auto Rize'de TPU film ile plotter kesim PPF uygulanıyor." },
    ],
  },
  pazar: {
    route: "Pazar merkezden sahil yolu ile batıya, Çayeli'ni geçip Rize Merkez'e yaklaşık 33 dakika. Kızılay ve Hemşin yolundan gelenler önce sahil yoluna inip aynı güzergâhı kullanabilir.",
    conditions: [
      'Hemşin yolu ve yayla güzergâhında mıcır ve çamur',
      'Pazar sahilinde deniz tuzu ve rüzgârla taşınan kum',
      'Kış aylarında Hemşin geçişinde tuzlama sonrası korozyon',
    ],
    popular: [
      { slug: 'rize-seramik-kaplama', why: 'Sahil tuzu ve kuma karşı kolay temizlenen yüzey' },
      { slug: 'rize-far-parlatma', why: 'Uzun sahil yolu sürüşünde sararmış far görüş kaybı' },
      { slug: 'rize-antibakteriyel-arac-temizligi', why: 'Nemli iklimde klima kokusu şikâyeti' },
    ],
    neighborhoods: ['Pazar merkez', 'Kızılay', 'Hamidiye', 'Yücehisar', 'Sivrikale', 'Akbucak', 'Hemşin yolu'],
    tip: "Pazar'dan gelen müşterilerimiz için Cumartesi sabah randevuları en yoğun; hafta içi öğleden sonra daha esnek saat bulabilirsiniz.",
    extraFaqs: [
      { q: "Pazar'dan aynı gün gidiş-dönüş yapabilir miyim?", a: 'Evet. Yıkama, far parlatma ve tek aşamalı pasta cila 1–5 saat sürer; sabah gelip öğleden sonra dönebilirsiniz.' },
    ],
  },
  guneysu: {
    route: "Güneysu merkezden Rize yönüne inen yolu takip edin; Rize Merkez'e 12 km, yaklaşık 15 dakika. Şehir merkezine girmeden İslampaşa Mahallesi'ne yönelin, Barbaros Sokak No:33/A.",
    conditions: [
      'Vadi içi yollarda sürekli nem ve yosun kaynaklı kaygan, kirli zemin',
      'Çay bahçesi yollarında toprak ve organik kalıntı',
      'Dağ yolunda dal sürtmesi ve yan çizikler',
    ],
    popular: [
      { slug: 'rize-pasta-cila', why: 'Dar köy yollarında dal sürtmesi ve yan panel çizikleri' },
      { slug: 'rize-detayli-ic-temizlik', why: 'Çay hasadı döneminde araç içine taşınan toprak ve nem' },
      { slug: 'rize-oto-yikama', why: '15 dakikalık mesafe ile haftalık premium yıkama' },
    ],
    neighborhoods: ['Güneysu merkez', 'Ulucami', 'Kıbledağı', 'Selamet', 'Ortaköy', 'Gürgen', 'Yeşilköy'],
    tip: "Güneysu'ya en yakın profesyonel detailing stüdyosuyuz; 1–2 saatlik hizmetlerde bekleme salonumuzu kullanabilir, aracı beklerken alabilirsiniz.",
    extraFaqs: [
      { q: 'Güneysu\'dan gelip beklerken aracımı alabilir miyim?', a: 'Evet. Yıkama, far parlatma ve antibakteriyel temizlik 1–2 saatte biter; bekleme alanımızda çay ve Wi-Fi var.' },
    ],
  },
  derepazari: {
    route: "Derepazarı'ndan sahil yolu ile doğuya, Rize Merkez'e 9 km, 12 dakika. Recep Tayyip Erdoğan Bulvarı'ndan İslampaşa Mahallesi'ne dönün.",
    conditions: [
      'Rize–Trabzon yolu üzerindeki ağır trafik: egzoz isi ve yol kiri',
      'Deniz kenarında tuz ve nem',
      'Ticari araç ve kamyonetlerde yük kaynaklı iç kirlenme',
    ],
    popular: [
      { slug: 'rize-motor-temizligi', why: 'Ticari araç ve kamyonetlerde bakım öncesi motor temizliği' },
      { slug: 'rize-antibakteriyel-arac-temizligi', why: 'Servis ve ticari araçlarda hijyen' },
      { slug: 'rize-oto-yikama', why: '12 dakikalık mesafeyle düzenli iç-dış yıkama' },
    ],
    neighborhoods: ['Derepazarı merkez', 'Merkez Mahallesi', 'Sandıktaş', 'Çukurlu', 'Kirazlık'],
    tip: 'Derepazarı ve İyidere hattındaki ticari filolar için toplu araç yıkama ve dezenfeksiyon planı yapıyoruz; WhatsApp\'tan araç sayısını yazın.',
    extraFaqs: [
      { q: 'Derepazarı\'ndan filo araçları için indirim var mı?', a: 'Evet, 3 ve üzeri araçta filo fiyatı uygulanır. Sabah teslim, akşam alım şeklinde planlanır.' },
    ],
  },
  iyidere: {
    route: "İyidere'den Rize–Trabzon sahil yolu ile doğuya 14 km, yaklaşık 16 dakika. Derepazarı'nı geçip Rize Merkez girişinde İslampaşa Mahallesi'ne yönelin.",
    conditions: [
      'Lojistik limanı çevresinde toz, tuz ve ağır vasıta trafiği',
      'Sahil şeridinde deniz tuzu kaynaklı korozyon ve boya matlaşması',
      'Trabzon–Rize hattı uzun yol sürüşünde taş çarpması',
    ],
    popular: [
      { slug: 'rize-ppf-kaplama', why: 'Sahil yolu taş çarpmasına karşı kaput ve ön set koruması' },
      { slug: 'rize-seramik-kaplama', why: 'Liman tozu ve tuza karşı kir tutmayan yüzey' },
      { slug: 'rize-cam-filmi', why: 'Sahil yolunda ısı ve UV kontrolü' },
    ],
    neighborhoods: ['İyidere merkez', 'Sarayköy', 'Fıçıtaşı', 'Denizgören', 'Yalıköy', 'Köşklü'],
    tip: "Trabzon tarafından gelen müşterilerimiz için İyidere ilk durak; Trabzon'a gitmek yerine Rize'de aynı kalitede PPF ve seramik hizmeti alabilirsiniz.",
    extraFaqs: [
      { q: 'İyidere\'de PPF kaplama yapan var mı?', a: 'İyidere\'de kapalı stüdyoda PPF uygulaması yapan bir merkez bulunmuyor; en yakın nokta 16 dakika uzaklıktaki Moon Auto Rize.' },
    ],
  },
};
