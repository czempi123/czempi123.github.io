#!/usr/bin/env python3
"""Výpis komponent pro docs/design.md › Komponenty: soubor, první věta úvodního komentáře a ukázka použití.
Použití: python3 scripts/komponenty-api.py > /tmp/komponenty.md (pak výpis zkrátit ručně)."""
import glob, re

def uvod(text):
    if text.startswith('---'):
        telo = text.split('---', 2)[1]
        radky = [l.strip()[2:].strip() for l in telo.splitlines() if l.strip().startswith('//')]
    else:
        m = re.search(r'<script[^>]*>(.*?)</script>', text, re.S)
        radky = [l.strip()[2:].strip() for l in (m.group(1) if m else '').splitlines() if l.strip().startswith('//')]
    ukazka = next((r for r in radky if r.startswith('<') or 'Použití:' in r), '')
    veta = ' '.join(r for r in radky if not r.startswith('<'))
    veta = re.split(r'(?<=[.:])\s', veta, 1)[0] if veta else ''
    return veta[:220], ukazka[:200]

for f in sorted(glob.glob('src/components/**/*.astro', recursive=True) + glob.glob('src/components/**/*.svelte', recursive=True)):
    veta, ukazka = uvod(open(f, encoding='utf-8').read())
    u = ('`' + ukazka.replace('|', '\\|') + '`') if ukazka else ''
    print('| `' + f[len('src/components/'):] + '` | ' + veta + ' | ' + u + ' |')
