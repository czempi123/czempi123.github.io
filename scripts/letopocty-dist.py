#!/usr/bin/env python3
"""Vypíše v dist/ letopočty s obyčejnou mezerou (místo nezlomitelné) podle místa výskytu.
Použití: python3 scripts/letopocty-dist.py [--vse]"""
import re, glob, sys, collections, html

VZOR = re.compile(r'\d+(?:[–-]\d+)?[  ]?(?:př\.[  ]n\.[  ]l\.|n\.[  ]l\.)|př\. n\.|n\. l\.')

def mista(s):
    """Text mimo <script>, <style> a atributy; vrací (začátek, text) úseků textu."""
    s = re.sub(r'<(script|style)\b.*?</\1>', lambda m: ' ' * len(m.group(0)), s, flags=re.S)
    for m in re.finditer(r'>([^<]+)<', s):
        yield m.start(1), m.group(1)

def main():
    vse = '--vse' in sys.argv
    pocty = collections.Counter(); priklady = {}
    for f in sorted(glob.glob('dist/**/*.html', recursive=True)):
        s = open(f, encoding='utf-8').read()
        for zac, text in mista(s):
            t = html.unescape(text)
            for m in VZOR.finditer(t):
                if ' ' not in m.group(0):
                    continue
                # třída nejbližšího otevřeného prvku
                pred = s[max(0, zac - 400):zac]
                tridy = re.findall(r'class="([^"]*)"', pred)
                klic = (tridy[-1].split(' data-')[0].split()[0] if tridy else '?')
                pocty[klic] += 1
                priklady.setdefault(klic, []).append(f'{f}: …{t[max(0, m.start()-40):m.end()+10]}…')
    print('celkem', sum(pocty.values()))
    for k, n in pocty.most_common():
        print(f'{n:4}  {k}')
        for p in priklady[k][: (99 if vse else 2)]:
            print('      ', p.replace('\n', ' '))

main()
