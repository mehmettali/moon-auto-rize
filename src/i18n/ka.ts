import type { UI } from './types';

/** Türkçe hizmet slug → Gürcüce ad */
export const KA_SERVICE_NAMES: Record<string, string> = {
  'rize-seramik-kaplama': 'კერამიკული დაფარვა',
  'rize-ppf-kaplama': 'PPF დამცავი ფირი',
  'rize-pasta-cila': 'პოლირება',
  'rize-detayli-ic-temizlik': 'სალონის ქიმწმენდა',
  'rize-oto-yikama': 'შიდა-გარე რეცხვა',
  'rize-cam-filmi': 'მინის დაბურვა',
  'rize-antibakteriyel-arac-temizligi': 'ანტიბაქტერიული წმენდა',
  'rize-far-parlatma': 'ფარების პოლირება',
  'rize-motor-temizligi': 'ძრავის წმენდა',
  'rize-oto-cekici': 'ევაკუატორი და გზის დახმარება',
};
/** Türkçe hizmet slug → fiyat tablosu notu (rakamlar services.ts'ten; burada yalnız açıklama) */
export const KA_PRICE_NOTES: Record<string, string> = {
  'rize-seramik-kaplama': 'მსუბუქი ავტომობილი / ჯიპი და მსუბუქი კომერციული',
  'rize-ppf-kaplama': 'კაპოტი · კაპოტი + ფრთები · სრული ავტომობილი; დამოკიდებულია მოდელზე',
  'rize-pasta-cila': 'საღებავის მდგომარეობის მიხედვით',
  'rize-detayli-ic-temizlik': 'სავარძლების მოხსნით, სრული სალონი',
  'rize-oto-yikama': 'სტანდარტული შიდა-გარე რეცხვა',
  'rize-cam-filmi': 'ყველა მინა, ლეგალური ტონით',
  'rize-antibakteriyel-arac-temizligi': 'სალონის დეზინფექცია',
  'rize-far-parlatma': 'წყვილი ფარი, დამცავი ფენით',
  'rize-motor-temizligi': 'ძრავის განყოფილების უსაფრთხო წმენდა',
  'rize-oto-cekici': 'ფასი მანძილის მიხედვით — დაგვირეკეთ',
};
/** EXTRA_PRICES.key → Gürcüce ad ve not */
export const KA_EXTRAS: Record<string, { name: string; note: string }> = {
  'premium-yikama': { name: 'პრემიუმ რეცხვა', note: 'თიხა, ცვილი და პლასტმასის/ტყავის მოვლა შედის' },
  'detailing-oto': { name: 'შიდა-გარე დეტეილინგის პაკეტი — მსუბუქი ავტომობილი', note: 'სალონის ქიმწმენდა + პოლირება + დაცვა; მანქანის მდგომარეობის მიხედვით' },
  'detailing-suv': { name: 'შიდა-გარე დეტეილინგის პაკეტი — ჯიპი / მსუბუქი კომერციული', note: 'იგივე პაკეტი, დიდი ავტომობილი' },
  'wax': { name: 'ცვილით პოლირება', note: 'დამცავი ცვილი რეცხვის შემდეგ' },
  'hare': { name: 'ჰოლოგრამების მოცილება', note: 'პოლირების კვალის მოცილება' },
  'yikama-minibus': { name: 'შიდა-გარე რეცხვა — მინივენი', note: 'სტანდარტული პაკეტი' },
};

export const ka: UI = {
  lang: 'ka', htmlLang: 'ka', ogLocale: 'ka_GE',
  nav: {
    items: [
      { label: 'PPF', href: '/ka/ppf/' }, { label: 'კერამიკა', href: '/ka/keramikuli-dafarva/' }, { label: 'მინის ფირი', href: '/ka/minis-firi/' },
      { label: 'ფასები', href: '/ka/pasebi/' }, { label: 'კონტაქტი', href: '/ka/kontakti/' },
    ],
    book: 'ჯავშანი', bookHref: '/ka/javshani/', menu: 'მენიუ', navLabel: 'მთავარი მენიუ',
    logoHome: 'Moon Auto რიზე — მთავარი გვერდი', logoSub: 'Detailing & Car Studio · რიზე, თურქეთი',
  },
  switcher: { label: 'ენა', tr: 'TR', ka: 'ქარ' },
  footer: {
    about: 'პროფესიონალური ავტო დეტეილინგი რიზეში, თურქეთი: PPF, კერამიკული დაფარვა, პოლირება, სალონის ქიმწმენდა და პრემიუმ რეცხვა.',
    services: 'სერვისები', regions: '', corporate: 'გვერდები',
    corporateLinks: [
      { label: 'მთავარი', href: '/ka/' }, { label: 'ფასები', href: '/ka/pasebi/' }, { label: 'ონლაინ ჯავშანი', href: '/ka/javshani/' }, { label: 'კონტაქტი', href: '/ka/kontakti/' },
    ],
    rights: 'ყველა უფლება დაცულია.',
    hours: 'ორშაბათი – შაბათი 08:30 – 18:30 · კვირა დასვენება',
    bottomRight: (r, c) => `რიზე · ისლამფაშა · Google ${r} ★ (${c} შეფასება)`,
    georgiaTitle: 'საქართველოდან ჩამოსულთათვის',
    georgiaText: 'სარფის საზღვრიდან ≈95 კმ, ბათუმიდან ≈150 კმ. მოგვწერეთ WhatsApp-ზე ქართულად — ქართულად გიპასუხებთ.',
  },
  wa: { aria: 'მოგვწერეთ WhatsApp-ზე', defaultText: 'გამარჯობა Moon Auto, ჯავშნის აღება მინდა.', callNow: '☎ დარეკვა', book: '📅 ჯავშანი', bookHref: '/ka/javshani/' },
  cta: { title: 'დაჯავშნეთ თქვენი ავტომობილისთვის', text: 'ონლაინ ჯავშანს 1 წუთი სჭირდება. დადასტურებას WhatsApp-ით მიიღებთ — ქართულად.', wa: 'გამარჯობა Moon Auto, ჯავშნის აღება მინდა.', book: '📅 ონლაინ ჯავშანი', whatsapp: 'WhatsApp', bookHref: '/ka/javshani/' },
  faq: { title: 'ხშირად დასმული კითხვები' },
  reviews: { eyebrow: 'Google შეფასებები', h2: (r, c) => `რიზეში ${r} ★ · ${c} მომხმარებლის შეფასება`, all: 'ყველა შეფასება Google რუკებზე →', stars: (n) => `${n} ვარსკვლავი` },
  breadcrumbs: { home: 'მთავარი', homeHref: '/ka/', aria: 'გვერდის გზა' },
  price: { service: 'სერვისი', car: 'მსუბუქი ავტომობილი', suv: 'ჯიპი / მსუბუქი კომერციული', duration: 'ხანგრძლივობა', note: 'შენიშვნა', extras: 'დამატებითი სერვისები', price: 'ფასი', callForPrice: 'ფასი — დაგვირეკეთ', from: (tl) => tl + '-დან' },
  serviceName: (slug, fallback) => KA_SERVICE_NAMES[slug] ?? fallback,
  priceNote: (slug, fallback) => KA_PRICE_NOTES[slug] ?? fallback,
  duration: (d) => d.replace('Aynı gün', 'იმავე დღეს').replace(' gün', ' დღე').replace(' saat', ' საათი'),
  extra: (key, fallback) => KA_EXTRAS[key] ?? fallback,
  form: {
    service: 'სერვისი', choose: 'აირჩიეთ…', multi: 'რამდენიმე სერვისი / შეთავაზება მინდა',
    car: 'ავტომობილი (მარკა / მოდელი / წელი)', carPlaceholder: 'მაგ.: Toyota Corolla 2022, თეთრი',
    date: 'თარიღი', dateHint: 'კვირას დაკეტილია', time: 'საათი', timeHint: (n) => `ერთდროულად ${n} მანქანას ვიღებთ`,
    name: 'სახელი, გვარი', phone: 'ტელეფონი', phonePlaceholder: '+995 5xx xxx xxx',
    note: 'შენიშვნა', noteHint: 'მანქანის მდგომარეობა, სასურველი პაკეტი, დამატებითი თხოვნა',
    submit: 'ჯავშნის გაგზავნა WhatsApp-ით',
    hint: 'მონაცემები მზა WhatsApp შეტყობინებად გადაიქცევა; „გაგზავნის“ შემდეგ მოგვწვდება და საათის დადასტურებით ქართულად გიპასუხებთ.',
    js: {
      sunday: 'კვირას დაკეტილი ვართ. გთხოვთ, აირჩიოთ სხვა დღე.',
      opening: 'WhatsApp იხსნება… არ დაგავიწყდეთ შეტყობინების გაგზავნა.',
      greeting: 'გამარჯობა Moon Auto, ჯავშნის მოთხოვნა:',
      labels: { service: 'სერვისი', car: 'ავტომობილი', date: 'თარიღი', time: 'საათი', name: 'სახელი', phone: 'ტელეფონი', note: 'შენიშვნა' },
    },
  },
};
