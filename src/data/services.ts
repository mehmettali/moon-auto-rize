export interface Faq { q: string; a: string }
export interface Service {
  slug: string;          // URL: /<slug>/
  key: string;           // kısa anahtar (form vb.)
  name: string;          // menü adı
  h1: string;            // sayfa başlığı
  title: string;         // <title>
  description: string;   // meta description (≤160 karakter)
  short: string;         // kart açıklaması
  icon: string;          // emoji/simge
  priceFrom: number;     // TL, otomobil başlangıç fiyatı (0 = telefonla teklif)
  priceSuv?: number;     // TL, SUV / hafif ticari
  priceMinibus?: number; // TL, minibüs
  priceNote: string;
  duration: string;
  intro: string[];       // paragraflar
  benefits: string[];
  steps: string[];
  faqs: Faq[];
  related: string[];     // slug listesi
  featured?: boolean;
}

/**
 * FİYATLAR: 14 Eylül 2026'da Mustafa Karadağ'ın ilettiği tarife.
 * priceFrom = otomobil, priceSuv = SUV / hafif ticari, priceMinibus = minibüs.
 * 0 = fiyat verilmedi, sitede "Fiyat için arayın" görünür.
 */
export const SERVICES: Service[] = [
  {
    slug: 'rize-seramik-kaplama', key: 'seramik', name: 'Seramik Kaplama',
    h1: 'Rize Seramik Kaplama',
    title: 'Rize Seramik Kaplama | 9H Boya Koruma – Moon Auto',
    description: "Rize'de profesyonel seramik kaplama. Gyeon, IGL ve Koch Chemie ile 9H sertlikte, 2-5 yıl garantili boya koruma. Rize Merkez İslampaşa. Online randevu.",
    short: 'Boyaya cam gibi sert, hidrofobik ve UV dirençli koruma katmanı. Yağmurun bol olduğu Rize için en mantıklı yatırım.',
    icon: '💎', priceFrom: 15000, priceSuv: 20000, priceNote: 'Otomobil 15.000 · SUV / hafif ticari 20.000', duration: '1–2 gün', featured: true,
    intro: [
      "Rize yılda 180'den fazla gün yağış alan, Türkiye'nin en nemli ilidir. Yağmur suyu, asit yağmuru ve deniz tuzu boyanın üst katmanını her gün biraz daha matlaştırır. Seramik kaplama, boyanın üzerine 9H sertliğinde nano-seramik (SiO₂) bir katman oluşturarak bu etkileri yıllarca engeller.",
      "Moon Auto'da seramik kaplama öncesi araç iki aşamalı yıkama, kil uygulaması ve ihtiyaca göre pasta-cila ile hazırlanır; kaplama tozsuz kapalı alanda uygulanır ve kürlenme süresi boyunca araç bizde kalır. Gyeon, IGL Coatings ve Koch Chemie serilerini kullanıyoruz.",
    ],
    benefits: [
      'Hidrofobik yüzey: su boncuklanıp akar, araç daha uzun süre temiz kalır',
      'UV ve oksidasyona karşı koruma, renk derinliği ve ayna parlaklığı',
      'Kuş pisliği, reçine ve böcek lekelerinin boyaya işlemesini engeller',
      'Yıkama sıklığı ve süresi belirgin şekilde azalır',
      '2 ila 5 yıl dayanım (pakete göre), ikinci el değerini korur',
    ],
    steps: [
      'Ön inceleme ve boya kalınlığı ölçümü',
      'İki kovalı yıkama, demir tozu sökücü ve kil uygulaması',
      'Boya düzeltme: tek veya çok aşamalı pasta-cila',
      'IPA ile yağ alma, panel panel seramik uygulaması',
      'Kürlenme (12–24 saat) ve teslim öncesi kalite kontrolü',
    ],
    faqs: [
      { q: 'Seramik kaplama ne kadar dayanır?', a: 'Kullandığımız pakete göre 2 ile 5 yıl arasında. Yılda bir bakım yıkaması ve seramik takviyesiyle ömrü uzar.' },
      { q: "Sıfır araca seramik kaplama gerekli mi?", a: "Evet, en iyi sonuç sıfır boyada alınır. Boya henüz çizilmeden koruma altına alınır ve düzeltme maliyeti çıkmaz." },
      { q: 'Seramik kaplamalı araç nasıl yıkanır?', a: 'Fırçalı otomatik yıkamadan kaçının. pH nötr şampuanla elde veya bizim seramik bakım yıkamamızla yıkanmalı.' },
      { q: 'Seramik kaplama fiyatı Rize\'de ne kadar?', a: 'Otomobil 15.000 TL, SUV ve hafif ticari 20.000 TL. Fiyata boya düzeltme dahildir; boya durumu çok ağırsa ek düzeltme için önceden bilgi veririz.' },
    ],
    related: ['rize-ppf-kaplama', 'rize-pasta-cila', 'rize-oto-yikama'],
  },
  {
    slug: 'rize-ppf-kaplama', key: 'ppf', name: 'PPF Boya Koruma Filmi',
    h1: 'Rize PPF Kaplama (Boya Koruma Filmi)',
    title: 'Rize PPF Kaplama | Boya Koruma Filmi – Moon Auto',
    description: "Rize'de PPF boya koruma filmi. Kendini onaran TPU film ile taş çarpması ve çiziğe karşı 5-10 yıl garanti. Kaput, ön set veya full kaplama.",
    short: 'Kendini onaran şeffaf TPU film. Taş çarpması, çizik ve anahtar izine karşı fiziksel kalkan. Trabzon\'a gitmeden Rize\'de.',
    icon: '🛡️', priceFrom: 70000, priceNote: 'Panel sayısına göre; 70.000 TL\'den başlar', duration: '1–4 gün', featured: true,
    intro: [
      "PPF (Paint Protection Film), boyanın üzerine uygulanan 150–200 mikron kalınlığında, şeffaf ve kendini onarabilen bir poliüretan filmdir. Karadeniz sahil yolu ve yayla yollarındaki çakıl taşları, kamyon arkasından fırlayan taşlar ve Rize'nin yoğun yağmurunda oluşan kum çizikleri boyaya değil filme gelir.",
      "Moon Auto, Rize'de PPF uygulaması için plotter kesim ve el kesimi seçeneklerini sunar. 3M ve TPU tabanlı premium filmlerle çalışıyoruz; sararma yapmayan, 5–10 yıl garantili ürünler tercih ediyoruz. Kaput + çamurluk ön set, tampon, ayna veya full araç paketleri mevcuttur.",
    ],
    benefits: [
      'Taş çarpması, çizik ve anahtar izlerine karşı fiziksel koruma',
      'Kendini onaran üst katman: küçük çizikler sıcakla kaybolur',
      'Sararma ve matlaşma yapmayan TPU film, 5–10 yıl garanti',
      'İstendiğinde ize bırakmadan sökülebilir, orijinal boya korunur',
      'Seramik ile kombinlenerek en üst düzey koruma sağlanır',
    ],
    steps: [
      'Araç ve panel seçimi, kesim planı (plotter / el kesim)',
      'Detaylı yıkama, kil ve boya düzeltme',
      'Panellere film uygulaması ve kenar sarma',
      'Isı ile şekillendirme, kürlenme süresi',
      'Kontrol ve teslim, bakım talimatı',
    ],
    faqs: [
      { q: 'PPF mi seramik mi?', a: 'PPF fiziksel darbelere (taş, çizik) karşı korur; seramik kimyasal etkilere (UV, kir, su) karşı korur ve parlaklık verir. En iyi çözüm ön sete PPF, tüm araca seramiktir.' },
      { q: 'PPF görünür mü?', a: 'Kaliteli TPU film uygulandığında fark edilmez; kenarlar sarıldığı için çizgi görünmez.' },
      { q: 'PPF kaç yıl dayanır?', a: 'Ürüne göre 5–10 yıl. Garantili ürünlerle çalışıyoruz.' },
      { q: 'Rize\'de PPF uygulayan var mı?', a: 'Evet. Moon Auto Rize Merkez İslampaşa\'da kapalı ve tozsuz uygulama alanında PPF uygular; Trabzon\'a gitmenize gerek yok.' },
    ],
    related: ['rize-seramik-kaplama', 'rize-cam-filmi', 'rize-pasta-cila'],
  },
  {
    slug: 'rize-pasta-cila', key: 'pasta', name: 'Pasta Cila',
    h1: 'Rize Pasta Cila ve Boya Düzeltme',
    title: 'Rize Pasta Cila | Çizik Giderme, Boya Düzeltme – Moon Auto',
    description: "Rize'de profesyonel pasta cila: Menzerna ve Koch Chemie ile çok aşamalı boya düzeltme, hologram ve mikro çizik giderme. Rize Merkez oto kuaför.",
    short: 'Menzerna ve Koch Chemie ile çok aşamalı boya düzeltme. Mikro çizikler, hologramlar ve matlaşma gider, derinlik geri gelir.',
    icon: '✨', priceFrom: 9000, priceSuv: 14000, priceNote: 'Otomobil 9.000 · SUV / hafif ticari 14.000 · Wax 2.000 · Hare giderme 3.000', duration: '4–8 saat',
    intro: [
      "Otomatik yıkama fırçaları, yanlış bezle silme ve güneş/yağmur döngüsü boya üzerinde örümcek ağı çizikleri ve matlaşma bırakır. Pasta cila, boyanın en üst şeffaf katmanını mikron seviyesinde düzelterek çizikleri giderir ve fabrika parlaklığını geri getirir.",
      "Moon Auto'da pasta cila makine ile, boya kalınlığı ölçülerek ve kalınlığa uygun aşındırıcı seçilerek yapılır. Menzerna, Koch Chemie ve 3D pastaları, profesyonel polisaj makineleri ile uygulanır. Sonrasında Soft99 veya Angelwax wax, ya da seramik ile koruma önerilir.",
    ],
    benefits: [
      'Mikro çizik, hologram ve oksidasyonun giderilmesi',
      'Boya kalınlığı ölçümü ile güvenli aşındırma',
      'Ayna parlaklığı ve renk derinliğinin geri kazanılması',
      'Satış öncesi araç değerini artırır',
      'Seramik/PPF için ideal hazırlık',
    ],
    steps: [
      'Boya kalınlığı ölçümü ve çizik analizi',
      'Detaylı yıkama, kil ve maskeleme',
      'Kesme pastası (ağır çizikler)',
      'Finish pastası ile hologramsız parlaklık',
      'Wax veya seramik koruma, teslim',
    ],
    faqs: [
      { q: 'Pasta cila boyaya zarar verir mi?', a: 'Ölçüm yapılmadan ve yanlış ürünle yapılırsa verir. Biz her panelde boya kalınlığı ölçerek çalışırız.' },
      { q: 'Pasta cila ne kadar sürer?', a: 'Tek aşamalı işlem 4–5 saat, çok aşamalı düzeltme 1 tam gün sürebilir.' },
      { q: 'Derin çizikler pasta ile gider mi?', a: 'Tırnak takılan derin çizikler astara inmişse pasta ile gitmez; boyasız rötuş veya lokal boya gerekir. Ücretsiz inceleyip söyleriz.' },
    ],
    related: ['rize-seramik-kaplama', 'rize-far-parlatma', 'rize-oto-yikama'],
  },
  {
    slug: 'rize-detayli-ic-temizlik', key: 'ic-temizlik', name: 'Detaylı İç Temizlik',
    h1: 'Rize Detaylı Oto İç Temizlik',
    title: 'Rize Detaylı İç Temizlik | Koltuk Sökülerek – Moon Auto',
    description: "Rize'de koltuk ve halılar sökülerek yapılan detaylı iç temizlik. Buharlı döşeme yıkama, deri bakımı, koku giderme. Rize Merkez oto kuaför.",
    short: 'Koltuklar ve halılar sökülür; taban, tavan, döşeme ve havalandırma kanalları buhar ve ekstraktörle temizlenir.',
    icon: '🧼', priceFrom: 9000, priceSuv: 10000, priceNote: 'Otomobil 9.000 · SUV / hafif ticari 10.000', duration: '6–10 saat', featured: true,
    intro: [
      "Standart iç yıkama koltuğun üstünü siler; detaylı iç temizlikte ise koltuklar, konsol kapakları ve halılar sökülür. Yıllardır biriken kum, çay yaprağı, evcil hayvan tüyü, dökülmüş içecek ve nemden kaynaklanan küf kaynağından temizlenir.",
      "Moon Auto'da iç temizlik ekstraktör, kuru buhar, Koch Chemie iç temizlik kimyasalları ve deri koltuklar için özel bakım ürünleriyle yapılır. İşlem sonunda araç ozonlanarak koku giderilir.",
    ],
    benefits: [
      'Koltuk altı, ray ve taban dahil eksiksiz temizlik',
      'Buhar ile kimyasalsız dezenfeksiyon',
      'Deri koltuk temizliği ve besleme',
      'Sigara, nem ve evcil hayvan kokusunun giderilmesi',
      'Alerjen ve küf sporlarının uzaklaştırılması',
    ],
    steps: [
      'Koltuk, halı ve kapak sökümü',
      'Kuru temizlik, fırça ile gevşetme',
      'Ekstraktör ile döşeme ve halı yıkama',
      'Buhar ile plastik, havalandırma ve dikiş temizliği',
      'Kurutma, montaj, ozon ve teslim',
    ],
    faqs: [
      { q: 'Detaylı iç temizlik kaç saat sürer?', a: 'Aracın boyutuna ve kirliliğine göre 6–10 saat. Genellikle sabah teslim, akşam alım.' },
      { q: 'Koltuklar sökülünce airbag sorunu olur mu?', a: 'Hayır. Akü bağlantısı kesilerek ve prosedüre uygun sökülür; arıza lambası yanmaz.' },
      { q: 'Deri koltuk temizliği dahil mi?', a: 'Evet, deri koltuklar özel temizleyici ve besleyici ile bakımdan geçer.' },
    ],
    related: ['rize-antibakteriyel-arac-temizligi', 'rize-oto-yikama', 'rize-motor-temizligi'],
  },
  {
    slug: 'rize-oto-yikama', key: 'yikama', name: 'İç-Dış Oto Yıkama',
    h1: 'Rize İç Dış Oto Yıkama (Standart ve Premium)',
    title: 'Rize Oto Yıkama | Premium İç Dış Elde Yıkama – Moon Auto',
    description: "Rize'de fırçasız, iki kovalı elde oto yıkama. Premium iç dış yıkama, jant ve lastik bakımı, cam parlatma, wax. Rize Merkez İslampaşa, aynı anda 5 araç.",
    short: 'Fırçasız iki kovalı elde yıkama, jant-lastik bakımı, iç temizlik ve plastik bakımı. Boyayı çizmeyen, seramik dostu yıkama.',
    icon: '🚿', priceFrom: 800, priceSuv: 900, priceMinibus: 1000, priceNote: 'İç-dış otomobil 800 · SUV / hafif ticari 900 · minibüs 1.000 · Premium 20.000', duration: '1–2 saat',
    intro: [
      "Fırçalı otomatik yıkamalar boyada örümcek ağı çiziklerinin bir numaralı sebebidir. Moon Auto'da her araç iki kovalı yöntemle, pH nötr şampuan ve mikrofiber eldivenle elle yıkanır; jantlar demir tozu sökücüyle, lastikler besleyiciyle işlenir.",
      "Premium iç-dış pakette torpido ve kapı içi temizliği, cam temizliği, plastik bakımı ve dış yüzeye spray wax dahildir. Seramik kaplamalı araçlar için özel bakım yıkaması yapılır.",
    ],
    benefits: [
      'Fırçasız, çizik yapmayan yöntem',
      'Jant, lastik ve davlumbaz temizliği',
      'İç temizlik, plastik ve cam bakımı',
      'Seramik/PPF uyumlu pH nötr ürünler',
      'Aynı anda 5 araç kapasitesi, kısa bekleme',
    ],
    steps: ['Ön yıkama köpüğü', 'İki kovalı elde yıkama', 'Jant ve lastik bakımı', 'Kurutma ve spray wax', 'İç temizlik, cam ve plastik bakımı'],
    faqs: [
      { q: 'Randevu gerekli mi?', a: 'Standart yıkamada gerekmez ama randevulu müşteriye öncelik veriyoruz. Randevu sayfasından 1 dakikada alabilirsiniz.' },
      { q: 'Yıkama ne kadar sürer?', a: 'Standart iç-dış 1 saat, premium paket 2 saat.' },
      { q: 'Pazar açık mısınız?', a: 'Hayır, Pazar günleri kapalıyız. Pazartesi–Cumartesi 08:30–18:30 hizmet veriyoruz.' },
    ],
    related: ['rize-detayli-ic-temizlik', 'rize-pasta-cila', 'rize-seramik-kaplama'],
  },
  {
    slug: 'rize-cam-filmi', key: 'cam-filmi', name: 'Cam Filmi',
    h1: 'Rize Cam Filmi Uygulaması',
    title: 'Rize Cam Filmi | Isı ve UV Kesen, Yasal Ton – Moon Auto',
    description: "Rize'de profesyonel cam filmi uygulaması. 3M ve premium nano-seramik filmlerle UV ve ısı kontrolü, mahremiyet, yasal tonlar. Garantili, kabarmaz.",
    short: 'Isı ve UV kesen, kabarmayan premium cam filmi. Yasal tonlar ve garantili uygulama.',
    icon: '🪟', priceFrom: 6000, priceNote: 'Tüm camlar, yasal tonda', duration: '2–4 saat',
    intro: [
      "Cam filmi sadece görünüm değil; kabin sıcaklığını düşürür, UV ışınlarını %99 keser ve döşemenin solmasını önler. Rize'nin nemli yazlarında klimaya binen yükü azaltır.",
      "Moon Auto'da 3M ve nano-seramik film seçenekleri, plotter kesimle uygulanır. Yasal ton sınırları konusunda bilgilendirir, muayeneye uygun uygulama yaparız.",
    ],
    benefits: ['%99 UV koruma', 'Isı yalıtımı ve klima verimliliği', 'Mahremiyet ve hırsızlığa karşı caydırıcılık', 'Kabarma ve renk atma yapmayan garantili film', 'Muayeneye uygun tonlar'],
    steps: ['Ton ve seri seçimi', 'Cam temizliği ve plotter kesim', 'Film uygulaması ve sıvı alma', 'Kurutma süresi', 'Kontrol ve teslim'],
    faqs: [
      { q: 'Cam filmi yasal mı?', a: 'Ön camlarda belirli ışık geçirgenliği zorunludur. Muayeneye uygun tonlarla çalışıyoruz ve bilgilendiriyoruz.' },
      { q: 'Kaç gün sonra cam açılabilir?', a: 'Uygulamadan sonra 2–3 gün camları açmamanızı öneririz.' },
    ],
    related: ['rize-ppf-kaplama', 'rize-seramik-kaplama', 'rize-far-parlatma'],
  },
  {
    slug: 'rize-antibakteriyel-arac-temizligi', key: 'antibakteriyel', name: 'Antibakteriyel Temizlik',
    h1: 'Rize Antibakteriyel Araç Temizliği ve Dezenfeksiyon',
    title: 'Rize Antibakteriyel Araç Temizliği | Buhar & Ozon – Moon Auto',
    description: "Rize'de antibakteriyel araç temizliği: kuru buhar, ozon jeneratörü ve klima kanalı dezenfeksiyonu. Küf, bakteri ve koku giderme. Aile ve ticari araçlar için.",
    short: 'Kuru buhar, ozon ve klima kanalı dezenfeksiyonu ile küf, bakteri ve koku giderme.',
    icon: '🦠', priceFrom: 2000, priceNote: 'Ozonlama dahil', duration: '1–2 saat',
    intro: [
      "Rize'nin yüksek nemi araç içinde küf ve bakteri için ideal ortam yaratır; klima kanallarındaki koku bunun ilk belirtisidir. Antibakteriyel temizlik, yüzeyleri kimyasalsız kuru buharla dezenfekte eder, ozon ile havayı ve kanalları arındırır.",
      "Çocuklu aileler, taksi-servis-kiralık araçlar ve satış öncesi araçlar için ideal paket.",
    ],
    benefits: ['Kuru buhar ile %99 bakteri ve virüs azaltımı', 'Klima kanalı ve polen filtresi dezenfeksiyonu', 'Ozon ile kalıcı koku giderme', 'Kimyasal kalıntı bırakmaz', 'Alerjen azaltımı'],
    steps: ['Ön temizlik', 'Kuru buhar uygulaması', 'Klima kanalı dezenfeksiyonu', 'Ozon uygulaması', 'Havalandırma ve teslim'],
    faqs: [
      { q: 'Ozon zararlı mı?', a: 'Uygulama boşken yapılır, ardından araç havalandırılır. Teslimde kalıntı kalmaz.' },
      { q: 'Ne sıklıkla yapılmalı?', a: 'Kişisel araçlarda yılda 1–2, ticari araçlarda 3 ayda bir öneriyoruz.' },
    ],
    related: ['rize-detayli-ic-temizlik', 'rize-oto-yikama'],
  },
  {
    slug: 'rize-far-parlatma', key: 'far', name: 'Far Parlatma',
    h1: 'Rize Far Parlatma ve Far Koruma',
    title: 'Rize Far Parlatma | Sararmış Far Yenileme – Moon Auto',
    description: "Rize'de far parlatma: sararmış ve matlaşmış farlar zımpara-pasta-UV kaplama ile yenilenir. Görüş güvenliği ve muayene için. Hızlı, uygun fiyatlı.",
    short: 'Sararmış, matlaşmış farlar zımpara ve pasta ile yenilenir, UV kaplama veya PPF ile korunur.',
    icon: '💡', priceFrom: 3000, priceNote: 'Çift far', duration: '1–2 saat',
    intro: [
      "Polikarbonat farlar UV ve yağmurla sararır; ışık verimi %50'ye kadar düşer ve muayeneden kalma sebebi olur. Far parlatma ile far şeffaflığı geri getirilir.",
      "Moon Auto'da farlar kademeli zımpara ve pasta ile yenilenir, ardından UV kaplama ya da isteğe göre PPF ile korunur; böylece sararma tekrar etmez.",
    ],
    benefits: ['Gece görüşünde belirgin artış', 'Muayene ve güvenlik', 'Far değişiminden çok daha ekonomik', 'UV kaplama veya PPF ile kalıcı sonuç'],
    steps: ['Maskeleme', 'Kademeli ıslak zımpara', 'Pasta ile parlatma', 'UV kaplama / PPF', 'Teslim'],
    faqs: [
      { q: 'Far parlatma kalıcı mı?', a: 'Sadece pasta yapılırsa 6–12 ay; UV kaplama veya PPF ile 2–5 yıl.' },
    ],
    related: ['rize-pasta-cila', 'rize-ppf-kaplama'],
  },
  {
    slug: 'rize-motor-temizligi', key: 'motor', name: 'Motor Temizliği',
    h1: 'Rize Motor Temizliği ve Motor Bakımı',
    title: 'Rize Motor Temizliği | Güvenli Buharlı Yıkama – Moon Auto',
    description: "Rize'de güvenli motor temizliği: elektronik korunarak buhar ile yağ, çamur ve tuz giderme, plastik koruma. Satış öncesi ve periyodik bakım.",
    short: 'Elektronik aksam korunarak buhar ve özel kimyasallarla motor bölümü temizliği ve plastik koruma.',
    icon: '⚙️', priceFrom: 0, priceNote: 'Araç tipine göre telefonla', duration: '1–2 saat',
    intro: [
      "Rize'nin çamurlu yolları ve deniz tuzu motor bölümünde korozyon ve kaçak gizler. Temiz motor, sızıntıların erken fark edilmesini sağlar ve satışta güven verir.",
      "Motor temizliği yüksek basınçla değil, elektronik aksam kapatılarak kontrollü buhar ve yağ sökücüyle yapılır; sonrasında plastik ve hortumlara koruyucu uygulanır.",
    ],
    benefits: ['Elektronik güvenli yöntem', 'Yağ, çamur ve tuz giderme', 'Kaçak ve arızaların erken tespiti', 'Plastik ve hortum koruması', 'Satış öncesi değer artışı'],
    steps: ['Elektronik aksamın korunması', 'Yağ sökücü uygulaması', 'Buhar / kontrollü durulama', 'Kurutma', 'Koruyucu uygulama'],
    faqs: [
      { q: 'Motor yıkama araca zarar verir mi?', a: 'Basınçlı su ile yapılırsa verebilir. Biz buhar ve düşük basınçla, aksamı kapatarak çalışırız.' },
    ],
    related: ['rize-detayli-ic-temizlik', 'rize-oto-yikama'],
  },
  {
    slug: 'rize-oto-cekici', key: 'oto-cekici', name: 'Oto Çekici & Yol Yardım',
    h1: 'Rize Oto Çekici ve Yol Yardım',
    title: 'Rize Oto Çekici | Yol Yardım, Çayeli, Ardeşen, Pazar – Moon Auto',
    description: "Rize'de oto çekici ve yol yardım: çözüm ortaklarımızla Merkez, Çayeli, Ardeşen, Pazar ve tüm ilçelerde aracınızı güvenle taşıyoruz. Stüdyomuza veya istediğiniz servise teslim. Hemen arayın.",
    short: 'Aracınız yolda kaldıysa Rize genelindeki çekici çözüm ortaklarımızı devreye alıyoruz; aracınız stüdyomuza veya istediğiniz servise taşınır.',
    icon: '🚚', priceFrom: 0, priceNote: 'Mesafe ve araç tipine göre telefonla teklif', duration: 'Aynı gün',
    intro: [
      "Rize'nin dar vadi yolları, dik yayla rampaları ve sahil yolundaki yoğun trafikte araç yolda kalabilir, kaza geçirebilir ya da çalışmaz hale gelebilir. Moon Auto olarak Rize genelinde çalışan çekici çözüm ortaklarımızla bu anlarda tek telefonla yanınızdayız: aracınızı bulunduğu noktadan alıp stüdyomuza, anlaşmalı servise veya istediğiniz adrese taşıyoruz.",
      "Çekici hizmetimiz detailing paketlerimizle de birleşiyor: kaza veya arıza sonrası aracınız bize taşınır, onarım dönüşünde iç-dış temizlik, pasta cila veya boya koruma ile ilk günkü haline getirilir. Hasarsız araç taşıma (kaplamalı, alçak veya klasik araçlar) için düz platformlu çekici talep edebilirsiniz.",
    ],
    benefits: [
      'Rize Merkez ve tüm ilçelerde çözüm ortağı ağı',
      'Düz platform (kaydırmalı) çekici seçeneği: kaplamalı ve alçak araçlar için hasarsız taşıma',
      'Stüdyomuza, anlaşmalı servise veya istediğiniz adrese teslim',
      'Kaza sonrası araç toplama ve sigorta süreci için fotoğraflı teslim tutanağı',
      'Arıza dönüşünde detailing paketleriyle avantajlı fiyat',
    ],
    steps: [
      'Bizi arayın veya WhatsApp\'tan konum gönderin',
      'Araç tipi ve durumuna göre en yakın çözüm ortağı yönlendirilir',
      'Tahmini varış süresi ve fiyat telefonda onaylanır',
      'Araç platforma alınır, fotoğraflı tutanak tutulur',
      'Stüdyomuza veya belirttiğiniz adrese teslim',
    ],
    faqs: [
      { q: 'Çekici hizmeti Moon Auto\'nun kendi aracı mı?', a: 'Hayır. Rize genelinde çalışan, güvendiğimiz çekici çözüm ortaklarımızla hizmet veriyoruz; koordinasyonu biz yapıyoruz, tek muhatabınız biziz.' },
      { q: 'Fiyat nasıl belirleniyor?', a: 'Aracın bulunduğu nokta ile teslim noktası arasındaki mesafe, araç tipi (binek, SUV, ticari) ve platform türüne göre telefonda net fiyat verilir. Sürpriz ücret yoktur.' },
      { q: 'Seramik veya PPF kaplamalı araç çekiciyle zarar görür mü?', a: 'Düz platformlu çekici talep edin; araç çekilmez, platforma alınır. Kaplamalı araçlarımızda bunu standart olarak öneriyoruz.' },
      { q: 'Hangi ilçelere gidiliyor?', a: 'Merkez, Çayeli, Ardeşen, Pazar, Güneysu, Derepazarı, İyidere, Kalkandere, Fındıklı ve diğer ilçeler. Uzak ilçelerde varış süresi değişir.' },
    ],
    related: ['rize-oto-yikama', 'rize-pasta-cila', 'rize-detayli-ic-temizlik'],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
/** priceFrom 0 ise fiyat mesafeye/teklife bağlıdır */
export const priceLabel = (n: number) => (n > 0 ? formatTL(n) + "'den" : 'Fiyat için arayın');
/** Fiyat listesinde ayrı satır olarak gösterilen ek hizmetler */
export const EXTRA_PRICES = [
  { name: 'Premium oto yıkama (kapsamlı paket)', price: 20000, slug: 'rize-oto-yikama', note: 'Detaylı iç-dış bakım paketi' },
  { name: 'Wax cila', price: 2000, slug: 'rize-pasta-cila', note: 'Yıkama sonrası koruyucu wax' },
  { name: 'Hare (hologram) giderme', price: 3000, slug: 'rize-pasta-cila', note: 'Polisaj izlerinin giderilmesi' },
  { name: 'İç-dış yıkama – minibüs', price: 1000, slug: 'rize-oto-yikama', note: 'Standart paket' },
];
export const FEATURED = SERVICES.filter((s) => s.featured);
export const formatTL = (n: number) => n.toLocaleString('tr-TR') + ' TL';
