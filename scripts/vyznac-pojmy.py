#!/usr/bin/env python3
"""Vyznačí pojmy v MDX komponentou <Pojem id="…">slovo</Pojem> (design-v2, krok P).

Pravidla (docs/podklady/pojmy-antika.md): jen první výskyt na stránce, nejvýš jeden pojem v odstavci,
ne v nadpisu, odkazu, citátu, atributu ani v obsahu ostrovu (Pribeh, Strana, NejdrivSam …); hotová věta se nemění,
jen se obalí slovo. Odstavec, který už pojem má, přeskočí a vezme další výskyt téhož slova na stránce.
Pořadí v PLAN je přednost: vzácné pojmy dřív, ať je nepřebije častá obec.

Použití: python3 scripts/vyznac-pojmy.py            (jen vypíše, co by udělal)
         python3 scripts/vyznac-pojmy.py --zapsat   (zapíše a doplní import)
Další vlna: doplň PLAN a pusť znovu; co už je vyznačené, skript pozná a nechá být."""
import glob, re, sys, pathlib

ZAPSAT = '--zapsat' in sys.argv
POVOLENE = {'Kapitola', 'Myslenka', 'Myslenky', 'Oddil'}

# (id pojmu, regulární výraz slova, [(klíč výskytu, vyznačit?)])
PLAN = [
    ('atom', r'atom(ů|y|ech|u|em)?', [('cesta/proc-se-bat-smrti/3', True)]),
    ('osud', r'osud(u|em)?', [('smer/stoicismus', True), ('osobnost/seneca', False)]),
    ('rozpominani', r'rozpomín\w*', [('osobnost/platon', True)]),
    ('neovladnuti', r'neovládnutí', [('cesta/staci-vedet-co-je-spravne/5', True)]),
    ('soud', r'soud(y|ech|ů|em|u)?', [('cesta/co-mam-ve-svych-rukou/4', True)]),
    ('religionistika', r'religionist\w*', [('uvod/co-je-nabozenstvi', True)]),
    ('latka', r'lát(ka|ky|ce|ku|kou)', [('uvod/co-je-filozofie', True), ('cesta/jsem-porad-tentyz-kdyz-se-menim/8', True)]),
    ('lhostejne-veci', r'lhostejn(é|ost)', [('cesta/co-mam-ve-svych-rukou/5', True), ('cesta/co-kdyz-prijde-to-nejhorsi/8', True)]),
    ('tyran', r'tyran(a|ovi|em|y|ů)?', [('osobnost/platon', True), ('osobnost/epiktetos', True)]),
    ('vestirna', r'věštírn\w*', [('osobnost/sokrates', True), ('osobnost/diogenes', True),
        ('cesta/kdy-mam-dobry-duvod-verit/1', True), ('cesta/kdy-mam-dobry-duvod-verit/7', False)]),
    ('v-nasi-moci', r'v naší moci', [('cesta/co-mam-ve-svych-rukou/3', True), ('cesta/co-kdyz-prijde-to-nejhorsi/3', True),
        ('smer/stoicismus', True)]),
    ('protipriklad', r'protipříklad\w*', [('osobnost/sokrates', True), ('cesta/kdy-mam-dobry-duvod-verit/3', True)]),
    ('stred', r'střed(u|em)?', [('cesta/staci-vedet-co-je-spravne/6', False), ('cesta/staci-vedet-co-je-spravne/8', True)]),
    ('pricina', r'příčin(a|y|u|ou|ě)', [('osobnost/aristoteles', True), ('smer/stoicismus', True)]),
    ('idea', r'ide(a|u|ou|je|ji|jí|jím|jích|jemi)', [('osobnost/platon', True),
        ('cesta/je-to-co-vidim-cela-skutecnost/5', False), ('cesta/je-to-co-vidim-cela-skutecnost/8', True),
        ('smer/akademie', True), ('smer/kynismus', True)]),
    ('slast', r'slast(i|í|em|mi)?', [('osobnost/epikuros', True), ('cesta/kolik-je-dost/1', True),
        ('cesta/kolik-je-dost/3', False), ('smer/epikureismus', True)]),
    ('klid', r'klid(u|em)?', [('osobnost/epikuros', True), ('cesta/co-mam-ve-svych-rukou/3', True),
        ('cesta/kolik-je-dost/7', True), ('cesta/co-kdyz-prijde-to-nejhorsi/4', True)]),
    ('stesti', r'štěstí(m)?', [('cesta/co-mam-ve-svych-rukou/5', True), ('smer/stoicismus', True)]),
    ('mytus', r'mýt(us|u|em|y|ů|ech)', [('osobnost/protagoras', True), ('uvod/co-je-filozofie', False),
        ('uvod/co-je-nabozenstvi', False)]),
    ('etika', r'etik(a|y|u|ou)|etice', [('uvod/co-je-filozofie', True), ('cesta/staci-vedet-co-je-spravne/4', True),
        ('osobnost/aristoteles', True), ('cesta/staci-vedet-co-je-spravne/8', False)]),
    ('vedeni', r'vědění(m)?', [('cesta/staci-vedet-co-je-spravne/3', True), ('osobnost/seneca', True),
        ('osobnost/sokrates', False), ('cesta/staci-vedet-co-je-spravne/1', False), ('cesta/staci-vedet-co-je-spravne/2', False),
        ('cesta/staci-vedet-co-je-spravne/5', False), ('cesta/staci-vedet-co-je-spravne/8', False)]),
    ('ctnost', r'ctnost(i|í|em|mi)?', [('osobnost/sokrates', True), ('osobnost/aristoteles', False),
        ('osobnost/krates-a-hipparchia', True), ('cesta/kam-mi-mizi-cas/8', True),
        ('cesta/staci-vedet-co-je-spravne/4', False), ('cesta/staci-vedet-co-je-spravne/6', True), ('smer/stoicismus', True)]),
    ('duse', r'duš(e|i|í|ím|ích|emi)', [('osobnost/platon', True), ('osobnost/aristoteles', True), ('osobnost/epikuros', True),
        ('osobnost/seneca', True), ('cesta/je-to-co-vidim-cela-skutecnost/7', True),
        ('cesta/jsem-porad-tentyz-kdyz-se-menim/5', True), ('cesta/proc-se-bat-smrti/3', True)]),
    ('dialog', r'dialog(u|em|y|ů|ech|ům)?', [('osobnost/protagoras', True), ('cesta/je-to-co-vidim-cela-skutecnost/1', True),
        ('cesta/jsem-porad-tentyz-kdyz-se-menim/5', True), ('cesta/proc-se-bat-smrti/9', True),
        ('cesta/staci-vedet-co-je-spravne/3', True), ('cesta/staci-vedet-co-je-spravne/4', False),
        ('cesta/staci-vedet-co-je-spravne/8', False), ('otazka/co-je-skutecne', True)]),
    ('rozum', r'rozum(u|em)?', [('osobnost/platon', True), ('smer/akademie', True), ('smer/stoicismus', True),
        ('cesta/staci-vedet-co-je-spravne/5', True), ('cesta/staci-vedet-co-je-spravne/4', False)]),
    ('obec', r'ob(ec|ce|ci|cí|cemi|cích)', [('osobnost/sokrates', True), ('osobnost/platon', True), ('osobnost/aristoteles', True),
        ('osobnost/protagoras', True), ('osobnost/diogenes', True), ('cesta/kdy-mam-dobry-duvod-verit/5', True),
        ('cesta/je-to-co-vidim-cela-skutecnost/7', True), ('cesta/kam-mi-mizi-cas/8', True), ('smer/stoicismus', True),
        ('smer/epikureismus', True), ('osobnost/marcus-aurelius', False), ('osobnost/herakleitos', False),
        ('osobnost/krates-a-hipparchia', False), ('osobnost/epikuros', False), ('cesta/ci-zivot-vlastne-ziju/5', False),
        ('cesta/ci-zivot-vlastne-ziju/7', False), ('cesta/staci-vedet-co-je-spravne/1', False),
        ('cesta/staci-vedet-co-je-spravne/6', False)]),
]

SLOZKA = {'osobnost': 'osobnosti', 'smer': 'smery', 'otazka': 'otazky', 'uvod': 'uvody', 'nabozenstvi': 'nabozenstvi'}

def soubor(klic):
    druh, id_, *krok = klic.split('/')
    if druh == 'cesta':
        if krok:
            return glob.glob(f'src/content/cesty/{id_}/{krok[0]}-*.mdx')[0]
        return f'src/content/cesty/{id_}.mdx'
    for pripona in ('.mdx', '.md'):
        p = f'src/content/{SLOZKA[druh]}/{id_}{pripona}'
        if pathlib.Path(p).exists():
            return p
    raise SystemExit(f'Nenašel jsem soubor pro {klic}')

ZAKAZANE = re.compile(r'<Pojem\b.*?</Pojem>|<[^>]*>|\[[^\]]*\]\([^)]*\)|`[^`]*`|\{[^}]*\}')

def odstavce(radky):
    """Vrátí seznam (index odstavce, číslo řádku) pro řádky, kde smí pojem stát."""
    vysledek, zasobnik, fm, odst, minuly_prazdny, rozepsana = [], [], 0, 0, True, None
    for n, r in enumerate(radky):
        s = r.strip()
        if fm < 2:
            if s == '---':
                fm += 1
            continue
        if not s:
            if not minuly_prazdny:
                odst += 1
            minuly_prazdny = True
            continue
        minuly_prazdny = False
        if s.startswith(('import ', 'export ')):
            continue
        # Značka komponenty rozepsaná na víc řádků: <NejdrivSam client:visible … (atributy) … > nebo … />
        if rozepsana:
            if s == '>' or (s.endswith('>') and not s.endswith('/>') and not s.endswith('=>')):
                zasobnik.append(rozepsana)
                rozepsana = None
            elif s.endswith('/>'):
                rozepsana = None
            continue
        m = re.match(r'^<([A-Z][A-Za-z]*)\b(?!.*>\s*$)', s)
        if m and '/>' not in s:
            rozepsana = m.group(1)
            continue
        for m in re.finditer(r'<(/?)([A-Z][A-Za-z]*)\b([^>]*?)(/?)>', s):
            if m.group(4):
                continue
            if m.group(1):
                if zasobnik and zasobnik[-1] == m.group(2):
                    zasobnik.pop()
            else:
                zasobnik.append(m.group(2))
        if s.startswith(('<', '#', '>', '|', '*', '- ', '1.')) and not s.startswith('<Pojem'):
            continue
        if any(z not in POVOLENE for z in zasobnik):
            continue
        vysledek.append((odst, n))
    return vysledek

def vyznac(cesta, pojem, vzor):
    radky = pathlib.Path(cesta).read_text(encoding='utf-8').split('\n')
    if any(f'<Pojem id="{pojem}"' in r for r in radky):
        return radky, 'už vyznačeno', None
    mista = odstavce(radky)
    obsazene = {o for o, n in mista if '<Pojem ' in radky[n]}
    rx = re.compile(r'(?<![\wÀ-ž])(' + vzor + r')(?![\wÀ-ž])', re.I)
    preskoceno = ''
    for o, n in mista:
        r = radky[n]
        zakazane = [(m.start(), m.end()) for m in ZAKAZANE.finditer(r)]
        for m in rx.finditer(r):
            if any(a <= m.start() < b for a, b in zakazane):
                continue
            if o in obsazene:
                preskoceno = ' (první výskyt v odstavci s jiným pojmem přeskočen)'
                break
            radky[n] = r[:m.start()] + f'<Pojem id="{pojem}">{m.group(1)}</Pojem>' + r[m.end():]
            return radky, f'ř. {n + 1}{preskoceno}: …{r[max(0, m.start() - 50):m.end() + 40]}…', n
    return radky, 'NENALEZENO' + preskoceno, None

def import_(radky, cesta):
    if any('components/ui/Pojem.astro' in r for r in radky):
        return radky
    hloubka = len(pathlib.Path(cesta).relative_to('src').parts) - 1
    radek = f"import Pojem from '{'../' * hloubka}components/ui/Pojem.astro';"
    posledni = max((i for i, r in enumerate(radky) if r.startswith('import ')), default=None)
    if posledni is None:
        konec_fm = [i for i, r in enumerate(radky) if r.strip() == '---'][1]
        radky.insert(konec_fm + 1, radek)
    else:
        radky.insert(posledni + 1, radek)
    return radky

for pojem, vzor, mista in PLAN:
    for klic, vyznacit in mista:
        if not vyznacit:
            continue
        cesta = soubor(klic)
        if cesta.endswith('.md'):
            print(f'{pojem:15} {klic:45} .md, nejde vyznačit')
            continue
        radky, zprava, n = vyznac(cesta, pojem, vzor)
        print(f'{pojem:15} {klic:45} {zprava}')
        if ZAPSAT and n is not None:
            pathlib.Path(cesta).write_text('\n'.join(import_(radky, cesta)), encoding='utf-8')
