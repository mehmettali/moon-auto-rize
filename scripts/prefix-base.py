#!/usr/bin/env python3
"""GitHub Pages gibi alt dizinde yayın için dist içindeki kök-göreli linklere ön ek ekler.
Kullanım: python3 scripts/prefix-base.py /moon-auto-rize
"""
import re, sys, pathlib
base = sys.argv[1].rstrip('/')
root = pathlib.Path('dist')
n = 0
for p in root.rglob('*'):
    if p.suffix not in ('.html', '.css', '.js', '.xml', '.txt'):
        continue
    t = p.read_text(encoding='utf-8')
    o = t
    if p.suffix == '.html':
        t = re.sub(r'(href|src|action)="/(?!/)', lambda m: f'{m.group(1)}="{base}/', t)
        t = re.sub(r'url\("/(?!/)', f'url("{base}/', t)
        t = t.replace("'/tesekkurler/'", f"'{base}/tesekkurler/'")
    elif p.suffix == '.css':
        t = re.sub(r'url\("?/(?!/)', lambda m: m.group(0).replace('/', base + '/', 1), t)
    if t != o:
        p.write_text(t, encoding='utf-8'); n += 1
(root / '.nojekyll').write_text('')
print(f'prefixed {n} files with {base}')
