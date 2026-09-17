import type { Faq } from './services';

export interface Package { name: string; from: number; includes: string[]; best?: boolean }
export interface ServiceDetail {
  forWhom: string[];
  rizeNote: string;
  packages: Package[];
  care: string[];
  mistakes: string[];        // sık yapılan hatalar / neden bize
  extraFaqs: Faq[];
  blog: string[];            // ilgili blog slug'ları
}

/**
 * Hizmet sayfalarının zengin içerik katmanı. Paket fiyatları da başlangıç
 * fiyatı mantığıyla yazıldı; gerçek tarife gelince buradan güncellenir.
 */
export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'rize-oto-cekici': {
    forWhom: [
      'Yolda kalan, çalışmayan veya kaza geçiren araç sahipleri',
      'Kaplamalı, alçak veya klasik araçlar: düz platformla hasarsız taşıma isteyenler',
      'Aracını servise veya stüdyomuza taşıtıp aynı anda bakım yaptırmak isteyenler',
      'İlçelerden Rize Merkez\'e araç taşıması gerekenler',
    ],
    rizeNote: "Rize'de yol yardım ihtiyacı en çok yayla dönüşlerinde (Ovit, Ayder, İkizdere), sahil yolundaki zincirleme yavaşlamalarda ve kış aylarında Hemşin, Çamlıhemşin geçişlerinde ortaya çıkıyor. Dar vadi yollarında her çekici manevra yapamaz; çözüm ortaklarımızı aracın bulunduğu yola ve araç tipine göre seçiyoruz. Merkez ve yakın ilçelerde varış süresi kısadır; Ardeşen, Fındıklı gibi uzak noktalarda süreyi telefonda net söyleriz.",
    packages: [
      { name: 'Şehir İçi', from: 0, includes: ['Rize Merkez sınırları içi', 'Stüdyoya veya servise teslim', 'Telefonda sabit fiyat'] },
      { name: 'İlçeler Arası', from: 0, best: true, includes: ['Çayeli, Ardeşen, Pazar, Güneysu, Derepazarı, İyidere ve diğerleri', 'Düz platform seçeneği', 'Fotoğraflı teslim tutanağı'] },
      { name: 'Çekici + Bakım', from: 0, includes: ['Taşıma + istenen detailing paketi', 'Onarım dönüşü iç-dış temizlik', 'Paket fiyatında indirim'] },
    ],
    care: ['Konumunuzu WhatsApp\'tan paylaşın; en yakın çözüm ortağını hızlı yönlendirelim', 'Aracın ruhsatı ve anahtarı yanınızda olsun', 'Kaza durumunda önce güvenlik: reflektör ve güvenli bölge'],
    mistakes: ['Kaplamalı aracı halatla çektirmek: tampon ve boya hasarı', 'Fiyatı yolda öğrenmek: biz telefonda netleştiriyoruz'],
    extraFaqs: [
      { q: 'Gece veya hafta sonu ulaşabilir miyim?', a: 'Çekici çözüm ortaklarımızın çalışma saatleri stüdyomuzdan farklı olabilir; arayın, uygun ortağı yönlendirelim.' },
    ],
    blog: ['rize-yagmurlu-iklimde-arac-bakimi'],
  },
  'rize-seramik-kaplama': {
    forWhom: [
      'Sıfır veya 1–3 yaş araç sahipleri: boya henüz bozulmadan koruma altına alınır',
      'Aracını açıkta park edenler: yağmur, kuş pisliği ve deniz tuzuna karşı',
      'Yıkamaya az vakit ayıranlar: kir tutmayan yüzey, yıkama süresini yarıya indirir',
      'Koyu renk araç sahipleri: siyah ve lacivertte çizik ve hologram en çok görünür, seramik derinliği geri getirir',
      'Aracını 2–3 yıl sonra satmayı planlayanlar: korunmuş boya ikinci el fiyatını yükseltir',
    ],
    rizeNote: "Rize'de bir araç yılda ortalama 184 gün yağmur görür; İslampaşa, Fener ve sahil yolu hattında buna deniz tuzu da eklenir. Yağmur suyu kuruduğunda bıraktığı mineral lekeleri korumasız boyada aylar içinde matlaşma yapar. Seramik kaplamalı yüzeyde su boncuklanıp akar, mineraller boyaya değil kaplamaya yapışır ve basit bir durulamayla gider. Bu yüzden Rize'de seramik kaplamayı estetik değil, koruyucu bakım olarak öneriyoruz.",
    packages: [
      { name: 'Otomobil', from: 15000, best: true, includes: ['Kil ve demir tozu arındırma', 'Boya düzeltme (pasta cila)', 'Seramik kaplama ve kürlenme', 'Bakım talimatı'] },
      { name: 'SUV / Hafif Ticari', from: 20000, includes: ['Kil ve demir tozu arındırma', 'Boya düzeltme (pasta cila)', 'Seramik kaplama ve kürlenme', 'Bakım talimatı'] },
    ],
    care: [
      'İlk 7 gün aracı yıkamayın; kaplama tam sertleşmeden suya maruz kalmasın',
      'Fırçalı otomatik yıkamaya sokmayın; iki kovalı elde yıkama veya bizim bakım yıkamamız',
      'pH nötr şampuan kullanın; asidik jant temizleyicilerden uzak durun',
      'Kuş pisliği ve reçineyi 24 saat içinde temizleyin',
      '6–12 ayda bir seramik takviye spreyi ile hidrofobik etkiyi tazeleyin',
    ],
    mistakes: [
      'Boya düzeltme yapmadan kaplama: çizikler seramiğin altında kilitlenir',
      'Açık havada, tozlu ortamda uygulama: kaplama içinde toz taneleri kalır',
      'Kürlenme süresine uymadan teslim: ilk yağmurda kaplama lekelenir',
      '"Sıvı cam" sprey ürünlerini seramik diye satmak: 3–6 ayda biter',
    ],
    extraFaqs: [
      { q: 'Seramik kaplama çizik önler mi?', a: 'Hafif yıkama çiziklerine ve mikro çiziklere karşı direnç sağlar; ancak taş çarpması ve anahtar çiziği gibi fiziksel darbelere karşı PPF gerekir.' },
      { q: 'Kaplama sonrası araç ne zaman teslim edilir?', a: 'Genellikle ertesi gün. Kaplamanın kapalı alanda 12–24 saat kürlenmesi gerekir; bu süreyi kısaltmıyoruz.' },
      { q: 'Matte (mat) boyaya seramik yapılır mı?', a: 'Evet, mat boyaya özel parlaklık vermeyen seramik serileri kullanıyoruz.' },
    ],
    blog: ['seramik-kaplama-mi-ppf-mi', 'seramik-kaplama-fiyatlari', 'rize-yagmurlu-iklimde-arac-bakimi'],
  },
  'rize-ppf-kaplama': {
    forWhom: [
      'Sıfır araç alanlar: bayiden çıkar çıkmaz ön set koruması',
      'Sahil yolu ve yayla yolunu sık kullananlar: kamyon arkası taş ve çakıl',
      'Premium ve koyu renkli araç sahipleri: boya onarımı pahalı, film ekonomik',
      'Orijinal boyayı korumak isteyenler: PPF sökülünce boya ilk günkü gibi kalır',
      'Kapı eşiği, bagaj eşiği ve kapı kolu altı gibi çizik alan bölgeler için',
    ],
    rizeNote: "Rize–Trabzon sahil yolu ve Ovit, Ayder, İkizdere yayla yolları çakıl ve mıcır bakımından Türkiye'nin en yıpratıcı güzergâhları arasında. Kaput ve ön çamurluklarda taş izleri bir yaz sezonunda birikir. PPF bu darbeleri boya yerine filmin üzerine alır; küçük izler ise filmin kendini onaran üst katmanı sayesinde güneşte kaybolur. Rize'de PPF için Trabzon'a gitmenize gerek yok; kapalı ve tozsuz stüdyomuzda plotter kesim veya el kesimi ile uyguluyoruz.",
    packages: [
      { name: 'PPF Boya Koruma Kaplama', from: 70000, best: true, includes: ['TPU boya koruma filmi', 'Kenar sarma, plotter kesim', 'Kürlenme ve teslim', '70.000 TL\'den başlar; aracın modeline ve işçiliğe göre değişir'] },
      { name: 'Panel Bazlı (kaput, ön set)', from: 0, includes: ['Sadece istenen paneller', 'Araç modeline göre kesim', 'Telefonda net teklif'] },
    ],
    care: [
      'İlk 48 saat aracı yıkamayın; film kenarları oturmadan su girmesin',
      'Basınçlı yıkamada tabancayı film kenarlarına 30 cm\'den yakın tutmayın',
      'Filmi güneşte kendini onarması için bırakın; küçük çizikler sıcakla kaybolur',
      'Seramik takviye spreyleri filmle uyumludur, kullanabilirsiniz',
    ],
    mistakes: [
      'Ucuz PVC film: 1–2 yılda sararır, sökerken boyaya zarar verir',
      'Kenarları sarmadan kesme: kenardan kir girer, film kalkar',
      'Tozlu ortamda uygulama: film altında toz kabarcıkları',
    ],
    extraFaqs: [
      { q: 'PPF sökülünce boyaya zarar verir mi?', a: 'Kaliteli TPU film orijinal fabrika boyasından iz bırakmadan sökülür. Boyanmış (lokal boya) panellerde önce boya kalitesini kontrol ederiz.' },
      { q: 'Mat PPF var mı?', a: 'Evet; parlak boyayı mat görünüme çeviren mat PPF seçeneği mevcuttur.' },
      { q: 'Uygulama kaç gün sürer?', a: 'Kaput 1 gün, ön set 1–2 gün, full araç 3–4 gün.' },
    ],
    blog: ['sifir-araca-ppf-yaptirmali-mi', 'seramik-kaplama-mi-ppf-mi'],
  },
  'rize-pasta-cila': {
    forWhom: [
      'Boyası matlaşmış, örümcek ağı çizikli araçlar',
      'Otomatik yıkama fırçasının izlerini silmek isteyenler',
      'Aracını satışa hazırlayanlar: ilan fotoğrafında fark yaratır',
      'Seramik veya PPF öncesi zemin hazırlığı',
      'Lokal boyalı panellerde renk ve parlaklık eşitleme',
    ],
    rizeNote: "Rize'de sürekli nemli hava, boya üzerinde kuruyan yağmur damlalarını mineral lekesine çevirir; güneşli birkaç gün bu lekeleri boyaya iyice işler. Buna otomatik yıkama fırçaları eklendiğinde, 3–4 yaşındaki bir aracın boyası bile ışık altında mat ve çizgili görünür. Pasta cila ile bu katmanı mikron seviyesinde düzeltiyor, ardından koruma öneriyoruz; koruma yapılmazsa aynı iklim 1 yıl içinde aynı sonucu doğurur.",
    packages: [
      { name: 'Pasta Cila – Otomobil', from: 9000, best: true, includes: ['Boya kalınlığı ölçümü', 'Yıkama + kil', 'Çok aşamalı pasta ve finish', 'Koruma'] },
      { name: 'Pasta Cila – SUV / Hafif Ticari', from: 14000, includes: ['Boya kalınlığı ölçümü', 'Yıkama + kil', 'Çok aşamalı pasta ve finish', 'Koruma'] },
      { name: 'Wax Cila', from: 2000, includes: ['Yıkama sonrası koruyucu wax', 'Parlaklık ve su itme', 'Seramik öncesi geçici koruma'] },
      { name: 'Hare (Hologram) Giderme', from: 3000, includes: ['Polisaj izlerinin finish pasta ile giderilmesi', 'Koyu renk araçlarda belirgin fark'] },
    ],
    care: [
      'İlk hafta yıkamayın; wax ve pastanın oturması için',
      'Kuru bezle silmeyin; toz, kuru silmede çizik yapar',
      'Mikrofiber ve iki kovalı yıkama yöntemini benimseyin',
      'Kalıcı sonuç için seramik veya en az 3 ayda bir wax',
    ],
    mistakes: [
      'Kalınlık ölçmeden agresif pasta: boya incelir, lokal boya ihtiyacı doğar',
      'Tek pasta ile her şeyi çözmeye çalışmak: hologram kalır',
      'Kurumuş polisaj pedi kullanmak: yeni mikro çizikler',
    ],
    extraFaqs: [
      { q: 'Pasta cila kaç kez yapılabilir?', a: 'Fabrika boyasında kalınlığa göre 3–5 kez güvenle yapılabilir. Her seferinde ölçüm yapıyoruz.' },
      { q: 'Pasta sonrası koruma şart mı?', a: 'Şart değil ama Rize ikliminde korumasız boya 6–12 ayda tekrar matlaşır. En azından wax öneririz.' },
    ],
    blog: ['rize-yagmurlu-iklimde-arac-bakimi', 'seramik-kaplama-fiyatlari'],
  },
  'rize-detayli-ic-temizlik': {
    forWhom: [
      'İkinci el araç alanlar: önceki sahibin izini tamamen silmek için',
      'Çocuklu ve evcil hayvanlı aileler',
      'Sigara, nem ve küf kokusu olan araçlar',
      'Taksi, servis ve kiralık araç işletmeleri',
      'Aracını satacak olanlar: temiz kabin ilan fiyatını yükseltir',
    ],
    rizeNote: "Rize'nin %75'in üzerindeki ortalama nemi, araç halısının altında biriken nemi kurutmaz; sonuç küf kokusu ve tavan döşemesinde lekelenmedir. Islak şemsiye, çamurlu bot ve çay bahçesinden gelen toprak koltuk altlarında birikir. Standart iç yıkama bu tabakaya ulaşmaz. Koltukları ve halıyı sökerek yaptığımız detaylı temizlikte taban sacı kurutulur, halı ekstraktörle yıkanır ve araç ozonlanır.",
    packages: [
      { name: 'Otomobil', from: 9000, best: true, includes: ['Koltuk ve halı sökümü', 'Ekstraktör ile döşeme yıkama', 'Kuru buhar, plastik ve cam', 'Kurutma, montaj ve koku giderme'] },
      { name: 'SUV / Hafif Ticari', from: 10000, includes: ['Koltuk ve halı sökümü', 'Ekstraktör ile döşeme yıkama', 'Kuru buhar, plastik ve cam', 'Kurutma, montaj ve koku giderme'] },
      { name: 'İç-Dış Detailing Paketi – Otomobil', from: 20000, includes: ['Detaylı iç temizlik', 'Dış pasta cila ve boya düzeltme', 'Wax koruma, jant ve plastik bakımı', 'Aracın durumuna göre fiyat değişebilir'] },
      { name: 'İç-Dış Detailing Paketi – SUV / Hafif Ticari', from: 25000, includes: ['Detaylı iç temizlik', 'Dış pasta cila ve boya düzeltme', 'Wax koruma, jant ve plastik bakımı', 'Aracın durumuna göre fiyat değişebilir'] },
    ],
    care: [
      'Lastik paspas kullanın; nemli mevsimde kumaş paspas küf kaynağıdır',
      'Islak eşyayı araçta bırakmayın, kabini haftada bir havalandırın',
      'Dökülen içeceği hemen kuru bezle alın; şekerli sıvı kokuya döner',
      'Yılda bir klima kanalı dezenfeksiyonu yaptırın',
    ],
    mistakes: [
      'Koltuğu sökmeden altını "uzanarak" temizlemek: kum ve küf kaynağı yerinde kalır',
      'Islak halıyı kurutmadan montaj: koku bir hafta içinde geri gelir',
      'Sert kimyasal ile deri temizliği: deri kurur ve çatlar',
    ],
    extraFaqs: [
      { q: 'Aracımı ne zaman alabilirim?', a: 'İşlem 1–2 gün sürer; halı ve döşemenin tam kuruması için aracı bir gece bizde bırakmanızı öneririz. Teslim gününü randevuda birlikte belirleriz.' },
      { q: 'Alcantara ve kumaş tavan temizlenir mi?', a: 'Evet, tavan döşemesi düşük nemli özel yöntemle temizlenir; sarkma yapmaz.' },
    ],
    blog: ['detayli-ic-temizlik-ne-kadar-surer', 'rize-yagmurlu-iklimde-arac-bakimi'],
  },
  'rize-oto-yikama': {
    forWhom: [
      'Seramik veya PPF kaplamalı araç sahipleri: fırçasız, pH nötr bakım yıkaması',
      'Aracını her hafta yıkatan ve boyasını çizdirmek istemeyenler',
      'İş çıkışı 1 saatte tertemiz araç isteyenler',
      'Yayla ve çamur dönüşü kapsamlı temizlik ihtiyacı olanlar',
    ],
    rizeNote: "Rize'de yıkama sıklığı Türkiye ortalamasının iki katı; bu yüzden yıkamanın kendisi boyaya zarar vermemeli. Fırçalı yıkamalar Rize'de en yaygın boya çizik nedenidir. Moon Auto'da her yıkama iki kovalı, mikrofiber eldivenli ve ön köpüklü yapılır; jantlar demir tozu sökücüyle, lastikler besleyiciyle işlenir. Aynı anda 5 araç kapasitemiz sayesinde randevulu müşteri bekletilmez.",
    packages: [
      { name: 'İç-Dış Yıkama – Otomobil', from: 800, best: true, includes: ['Ön köpük + iki kovalı elde yıkama', 'Jant ve lastik', 'Torpido ve cam', 'Kurutma'] },
      { name: 'İç-Dış Yıkama – SUV / Hafif Ticari', from: 900, includes: ['Aynı içerik, büyük araç'] },
      { name: 'İç-Dış Yıkama – Minibüs', from: 1000, includes: ['Aynı içerik, minibüs'] },
      { name: 'Premium Oto Yıkama', from: 2000, includes: ['İç-dış yıkama', 'Demir tozu sökücü + kil', 'Plastik, deri ve lastik bakımı', 'Wax koruma'] },
    ],
    care: [
      'Yağmur sonrası aracı 1–2 gün içinde en azından durulatın',
      'Kuş pisliğini bekletmeyin; 24 saatte boyaya işler',
      'Kışın tuzlu yol sonrası alt takımı yıkatın',
    ],
    mistakes: [
      'Tek kova ve sünger: kir tekrar boyaya sürülür',
      'Güneş altında yıkama: su lekesi ve kireç izi',
      'Jant temizleyicisini boyaya sıçratmak: asidik lekeler',
    ],
    extraFaqs: [
      { q: 'Beklerken ne yapabilirim?', a: 'Bekleme alanımızda çay ve Wi-Fi var; standart yıkama 1 saat sürer.' },
      { q: 'Ticari araç ve kamyonet yıkıyor musunuz?', a: 'Evet, kamyonet ve panelvan için ayrı fiyatlandırma uygulanır.' },
    ],
    blog: ['rize-yagmurlu-iklimde-arac-bakimi'],
  },
  'rize-cam-filmi': {
    forWhom: [
      'Yazın kabin sıcaklığını ve klima yükünü azaltmak isteyenler',
      'Mahremiyet ve hırsızlığa karşı caydırıcılık isteyenler',
      'Deri ve kumaş döşemenin solmasını önlemek isteyenler',
      'Bebek ve çocukla seyahat edenler: %99 UV koruması',
    ],
    rizeNote: "Rize'de bulutlu gün sayısı fazla olsa da yaz aylarında nem ile birleşen sıcaklık kabini bunaltıcı hale getirir. Isı kesen nano-seramik film, kabin sıcaklığını belirgin düşürür ve klimanın yakıt tüketimini azaltır. Muayeneye uygun ışık geçirgenliği konusunda bilgilendirir, yasal sınırların dışına çıkmayız.",
    packages: [
      { name: 'Cam Filmi', from: 6000, best: true, includes: ['Tüm camlar, yasal tonda', 'Plotter kesim', 'Kabarmaz, renk atmaz', 'Garantili'] },
    ],
    care: [
      'İlk 3 gün camları açmayın',
      'Cam temizliğinde amonyaklı ürün kullanmayın',
      'Kazıyıcı ve sert bez kullanmayın',
    ],
    mistakes: ['Kalitesiz film: 1 yılda mor renge döner ve kabarır', 'Kesim payı bırakmadan uygulama: kenarlarda çizgi'],
    extraFaqs: [
      { q: 'Ön cama film olur mu?', a: 'Ön cama sadece şeffaf ısı kesen film uygulanabilir; tonlu film yasal değildir.' },
    ],
    blog: ['rize-yagmurlu-iklimde-arac-bakimi'],
  },
  'rize-antibakteriyel-arac-temizligi': {
    forWhom: [
      'Bebekli ve alerjik aile üyeleri olanlar',
      'Taksi, servis, kiralık ve şirket araçları',
      'Klima kokusu ve nem kokusu olan araçlar',
      'İkinci el araç alanlar',
    ],
    rizeNote: "Yüksek nem, kapalı araçta 24 saat içinde bakteri ve küf sporlarının çoğalması için yeterli. Rize'de klima kanalı kokusu en sık aldığımız şikâyetlerden. Kuru buhar 150°C'de yüzeyleri kimyasalsız dezenfekte eder, ozon ise kanallara ve kumaş içine kadar ulaşarak kokuyu kaynağında yok eder.",
    packages: [
      { name: 'Antibakteriyel Temizlik + Ozonlama', from: 2000, best: true, includes: ['Kuru buhar tüm yüzeyler', 'Ozon ile koku ve bakteri giderme', 'Klima kanalı spreyi'] },
    ],
    care: ['Klimayı kapatmadan 2–3 dk önce soğutmayı kapatıp fanı açık bırakın; kanal kurur', 'Haftada bir kabini havalandırın', 'Yılda bir polen filtresi'],
    mistakes: ['Sadece koku giderici sprey: kokuyu maskeler, kaynağı kalır', 'Islak ortamda ozon: etkisi azalır'],
    extraFaqs: [
      { q: 'İşlem sonrası araç hemen kullanılabilir mi?', a: 'Evet; ozon sonrası 15–20 dk havalandırma yapıyoruz, teslimde kalıntı kalmaz.' },
    ],
    blog: ['rize-yagmurlu-iklimde-arac-bakimi', 'detayli-ic-temizlik-ne-kadar-surer'],
  },
  'rize-far-parlatma': {
    forWhom: ['Farları sararmış, matlaşmış araçlar', 'Muayeneye girecek araçlar', 'Gece görüşü azalanlar', 'Far değişimi yerine ekonomik çözüm arayanlar'],
    rizeNote: "Rize'de sık bulut gece sürüşünde farın verimini daha da önemli kılar. Sararmış polikarbonat far ışığın yarısını emer. Far parlatma 1 saatte çözer; UV kaplama veya far PPF'i ile sararmanın tekrar etmesini engelleriz.",
    packages: [
      { name: 'Far Parlatma – Çift', from: 3000, best: true, includes: ['Kademeli zımpara', 'Pasta', 'UV koruyucu kaplama'] },
      { name: 'Far Parlatma + Far PPF', from: 0, includes: ['Parlatma', 'Şeffaf far koruma filmi', 'Telefonda teklif'] },
    ],
    care: ['UV kaplamalı farı 1 hafta yıkamayın', 'Far PPF varsa basınçlı suyu kenarlara yaklaştırmayın'],
    mistakes: ['Sadece pasta: 3 ayda tekrar sararır', 'Diş macunu ve ev yöntemleri: yüzeyi çizer'],
    extraFaqs: [{ q: 'Far içi buğu giderilir mi?', a: 'Far içi buğu conta kaynaklıdır; parlatma çözmez. İnceleyip yönlendiririz.' }],
    blog: ['rize-yagmurlu-iklimde-arac-bakimi'],
  },
  'rize-motor-temizligi': {
    forWhom: ['Aracını satışa hazırlayanlar', 'Yağ kaçağı kontrolü isteyenler', 'Çamur ve tuzlu yol sonrası bakım', 'Periyodik bakım öncesi temiz motor isteyen servisler'],
    rizeNote: "Çay bahçesi yolları ve sahil tuzu motor bölümünde çamur ve korozyon bırakır. Temiz motor bölümü kaçakları görünür kılar ve alıcıya güven verir. Yüksek basınçlı su ile değil, elektronik aksam kapatılarak buhar ve düşük basınçla çalışıyoruz.",
    packages: [
      { name: 'Motor Temizliği', from: 0, best: true, includes: ['Elektronik koruma', 'Yağ sökücü + buhar', 'Kurutma ve plastik koruyucu', 'Araç tipine göre telefonda fiyat'] },
    ],
    care: ['Yıkama sonrası 30 dk motoru çalıştırıp kurutma yaparız; siz de 1–2 gün kısa mesafede su birikimine dikkat edin'],
    mistakes: ['Basınçlı su ile motor yıkama: sensör ve soket arızası', 'Sıcak motora soğuk su: çatlak riski'],
    extraFaqs: [{ q: 'Elektrikli ve hibrit araçlarda motor temizliği yapılır mı?', a: 'Hibritte yüksek voltaj bölgeleri korunarak yapılır; tam elektrikli araçlarda sadece ön bölme kuru temizlik uygulanır.' }],
    blog: ['rize-yagmurlu-iklimde-arac-bakimi'],
  },
};
