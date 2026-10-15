#!/usr/bin/env python3
"""Gürcüce (ka) sürüm build doğrulaması. Kullanım: python3 scripts/check-ka.py  (önce npm run build)"""
import pathlib, re, sys

DIST = pathlib.Path('dist')
SITE = 'https://www.moonauto.com.tr'
PAIRS = {  # tr yol → ka yol (src/i18n/routes.ts ile aynı)
    '/': '/ka/', '/rize-ppf-kaplama/': '/ka/ppf/', '/rize-seramik-kaplama/': '/ka/keramikuli-dafarva/',
    '/rize-cam-filmi/': '/ka/minis-firi/', '/fiyatlar/': '/ka/pasebi/', '/iletisim/': '/ka/kontakti/', '/randevu/': '/ka/javshani/',
}
NO_PAIR = ['/hakkimizda/', '/sss/', '/galeri/']
TR_UI = ['Randevu Al', 'Hemen Ara', 'Hizmetler', 'Fiyatlar', 'İletişim', 'Ana Sayfa', 'Sık Sorulan', 'Tüm hakları', 'Seçin…', 'WhatsApp ile yazın', 'Google Yorumları', 'Detaylar →']
errors = []

def html(path):
    p = DIST / path.strip('/') / 'index.html'
    if not p.exists():
        errors.append(f'eksik sayfa: {path}'); return None
    return p.read_text(encoding='utf-8')

def hreflang(doc, lang):
    m = re.search(r'<link rel="alternate" hreflang="%s" href="([^"]+)"' % lang, doc)
    return m.group(1) if m else None

for tr, ka in PAIRS.items():
    kd = html(ka); td = html(tr)
    if kd is None or td is None: continue
    if '<html lang="ka"' not in kd: errors.append(f'{ka}: lang="ka" yok')
    if f'<link rel="canonical" href="{SITE}{ka}"' not in kd: errors.append(f'{ka}: canonical yanlış')
    if 'og:locale" content="ka_GE"' not in kd: errors.append(f'{ka}: og:locale ka_GE yok')
    if 'noto-sans-georgian-400.woff2' not in kd: errors.append(f'{ka}: Gürcüce font yok')
    if '"inLanguage":"ka"' not in kd: errors.append(f'{ka}: JSON-LD inLanguage yok')
    for doc, name in ((kd, ka), (td, tr)):
        if hreflang(doc, 'tr') != SITE + tr: errors.append(f'{name}: hreflang tr != {tr}')
        if hreflang(doc, 'ka') != SITE + ka: errors.append(f'{name}: hreflang ka != {ka}')
        if hreflang(doc, 'x-default') != SITE + tr: errors.append(f'{name}: x-default != {tr}')
    if '<html lang="tr"' not in td: errors.append(f'{tr}: lang="tr" bozuldu')
    if 'noto-sans-georgian' in td: errors.append(f'{tr}: Türkçe sayfada Gürcüce font yüklenmiş')
    body = kd.split('<body', 1)[-1]
    for s in TR_UI:
        if s in body: errors.append(f'{ka}: çevrilmemiş arayüz metni "{s}"')
    if not re.search(r'[ა-ჿ]', body): errors.append(f'{ka}: Gürcüce harf yok')

for p in NO_PAIR:
    d = html(p)
    if d and 'hreflang=' in d: errors.append(f'{p}: eşlemesi olmayan sayfada hreflang var')

for e in errors: print('HATA', e)
print('OK' if not errors else f'{len(errors)} hata')
sys.exit(1 if errors else 0)
