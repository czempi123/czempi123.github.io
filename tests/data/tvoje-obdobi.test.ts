import { describe, it, expect } from 'vitest';
import {
  prehledObdobi, duvodZMyslenky, duvodStranySporu, prostyText, stranyZMdx, blokyZMdx, pravidloZMdx, zastanciOdpovedi,
  type KatalogObdobi,
} from '../../src/lib/tvoje-obdobi';
import { popisStran } from '../../src/lib/strany';
import type { Denik } from '../../src/lib/denik';

// Malý katalog: otázka 1 se dvěma cestami (Volba a Spor), otázka 3 s jednou cestou bez bloků, otázka 2 bez cest.
const KATALOG: KatalogObdobi = {
  otazky: [
    { cislo: 3, slug: 'ma-zivot-smysl', otazka: 'Má život smysl?', adresa: '/otazka/ma-zivot-smysl/', duvody: {} },
    { cislo: 1, slug: 'jak-zit', otazka: 'Jak mám žít?', adresa: '/otazka/jak-zit/', duvody: { seneca: 'Život je dlouhý, když ho umíš použít.' }, hlasy: ['epikuros', 'diogenes', 'seneca'] },
    { cislo: 2, slug: 'co-je-spravne', otazka: 'Co je správné?', adresa: '/otazka/co-je-spravne/', duvody: {} },
  ],
  cesty: [
    { slug: 'kolik-je-dost', nazev: 'Kolik je dost?', cislo: 6, otazka: 1, pravidlo: { id: 'cesta6-moje-pravidlo', adresa: '/cesta/kolik-je-dost/8/#cesta6-moje-pravidlo' } },
    { slug: 'kam-mi-mizi-cas', nazev: 'Kam mi mizí čas?', cislo: 34, otazka: 1, pravidlo: { id: 'cesta34-moje-pravidlo', adresa: '/cesta/kam-mi-mizi-cas/8/#cesta34-moje-pravidlo' } },
    { slug: 'proc-se-bat-smrti', nazev: 'Proč se bát smrti?', cislo: 8, otazka: 3, pravidlo: { id: 'cesta8-moje-pravidlo', adresa: '/cesta/proc-se-bat-smrti/9/#cesta8-moje-pravidlo' } },
  ],
  bloky: [
    {
      id: 'cesta6-kynici-spor', cesta: 'kolik-je-dost', adresa: '/cesta/kolik-je-dost/4/#cesta6-kynici-spor',
      popis: popisStran({ druh: 'spor', strany: [{ osoba: 'diogenes' }, { osoba: 'epikuros' }] })!,
      odpovedi: [
        { kod: 'diogenes', text: 'Potřebovat co nejméně.', zastanci: [{ osoba: 'diogenes', duvod: 'Každá potřeba je provázek.' }] },
        { kod: 'epikuros', text: 'Vědět, co mi stačí.', zastanci: [{ osoba: 'epikuros', duvod: 'Slast má strop.' }] },
        { kod: 'uprostred', text: 'Uprostřed sporu', zastanci: [{ osoba: 'diogenes', duvod: 'Každá potřeba je provázek.' }, { osoba: 'epikuros', duvod: 'Slast má strop.' }] },
      ],
    },
    {
      id: 'cesta34-dost-casu', cesta: 'kam-mi-mizi-cas', adresa: '/cesta/kam-mi-mizi-cas/1/#cesta34-dost-casu',
      popis: popisStran({ druh: 'volba', moznosti: [{}, {}, {}, {}] })!,
      odpovedi: [
        { kod: 'A', text: 'Nemám. Mám moc povinností.', zastanci: [{ osoba: 'marcus-aurelius', duvod: 'I on si zapsal, že číst nemůže.' }] },
        { kod: 'B', text: 'Mám, ale nějak mi mizí.', zastanci: [{ osoba: 'seneca', duvod: 'Ani o sobě netvrdil, že nic neztrácí.' }] },
        { kod: 'C', text: 'Mám dost.', zastanci: [{ osoba: 'seneca', duvod: 'Ani o sobě netvrdil, že nic neztrácí.' }, { osoba: 'epikuros', duvod: 'Ani o sobě netvrdil, že nic neztrácí.' }] },
        { kod: 'D', text: 'Nevím.', zastanci: [] },
      ],
    },
    {
      id: 'cesta34-odejit-spor', cesta: 'kam-mi-mizi-cas', adresa: '/cesta/kam-mi-mizi-cas/6/#cesta34-odejit-spor',
      popis: popisStran({ druh: 'spor', strany: [{ osoba: 'seneca' }, { osoba: 'marcus-aurelius' }] })!,
      odpovedi: [
        { kod: 'seneca', text: 'Odejít.', zastanci: [{ osoba: 'seneca' }, { osoba: 'epikuros', duvod: 'Moudrý se do veřejných věcí nepouští.' }] },
        { kod: 'marcus-aurelius', text: 'Zůstat.', zastanci: [{ osoba: 'marcus-aurelius' }] },
        { kod: 'uprostred', text: 'Uprostřed sporu', zastanci: [{ osoba: 'seneca' }] },
      ],
    },
  ],
  osoby: {
    diogenes: { id: 'diogenes', jmeno: 'Diogenés', obdobi: 1, adresa: '/osobnost/diogenes/', ikona: 'sud' },
    epikuros: { id: 'epikuros', jmeno: 'Epikúros', obdobi: 2, adresa: '/osobnost/epikuros/' },
    seneca: { id: 'seneca', jmeno: 'Seneca', obdobi: 2, adresa: '/osobnost/seneca/' },
    'marcus-aurelius': { id: 'marcus-aurelius', jmeno: 'Marcus Aurelius', obdobi: 2, adresa: '/osobnost/marcus-aurelius/' },
  },
};

const T = '2026-11-01T10:00:00.000Z';
const zapis = (id: string, odpoved: string) => ({ id, otazka: id, odpoved, odkaz: '/', kdy: T });
const prazdny = (): Denik => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {} });

describe('Tvoje antika z deníku', () => {
  it('prázdný deník nic neukáže', () => {
    expect(prehledObdobi(prazdny(), KATALOG)).toEqual([]);
    expect(prehledObdobi(null, KATALOG)).toEqual([]);
  });

  it('kdo prošel jedinou cestu, uvidí jedinou otázku a jen to, co udělal', () => {
    const d = prazdny();
    d.zapisy = [zapis('cesta6-moje-pravidlo', 'Stačí, když nic nebolí.')];
    d.bloky = { 'cesta6-kynici-spor': { prvni: 1, konecna: 3, duvod: '' } };
    const p = prehledObdobi(d, KATALOG);
    expect(p).toHaveLength(1);
    expect(p[0]).toMatchObject({ cislo: 1, otazka: 'Jak mám žít?', pravidla: [{ cesta: 'Kolik je dost?', text: 'Stačí, když nic nebolí.' }] });
    expect(p[0].zacatek).toBeUndefined();
    expect(p[0].ted).toBeUndefined();
    expect(p[0].blizci.map((b) => b.osoba.id)).toEqual(['epikuros']);
    expect(p[0].blizci[0]).toMatchObject({ duvod: 'Slast má strop.', stopy: [{ cesta: 'Kolik je dost?', odpoved: 'Vědět, co mi stačí.' }] });
  });

  it('nepotvrzená volba a první poloha Sporu bez konečné se nepočítají', () => {
    const d = prazdny();
    d.bloky = { 'cesta34-dost-casu': { vyber: 0, proc: '', potvrzeno: false }, 'cesta6-kynici-spor': { prvni: 0, konecna: null, duvod: '' } };
    expect(prehledObdobi(d, KATALOG)).toEqual([]);
  });

  it('plný deník: otázky podle čísla, odpověď na začátku i teď, myslitelé podle počtu setkání', () => {
    const d = prazdny();
    d.zapisy = [
      zapis('otazka-jak-zit-prvni', 'Hlavně neublížit.'),
      zapis('otazka-jak-zit-ted', 'Mít čas na přátele.'),
      zapis('cesta34-moje-pravidlo', 'Můj čas je můj, když vím, komu ho dávám.'),
      zapis('cesta6-moje-pravidlo', 'Stačí, když nic nebolí.'),
      zapis('otazka-co-je-spravne-prvni', 'Nevracet křivdu.'),
      zapis('cesta8-moje-pravidlo', '   '),
    ];
    d.bloky = {
      'cesta6-kynici-spor': { prvni: 2, konecna: 2, duvod: '' },
      'cesta34-dost-casu': { vyber: 1, proc: '', potvrzeno: true },
      'cesta34-odejit-spor': { prvni: 0, konecna: 0, duvod: '' },
    };
    const p = prehledObdobi(d, KATALOG);
    expect(p.map((o) => o.cislo)).toEqual([1, 2]);
    const [o1, o2] = p;
    expect(o1).toMatchObject({ zacatek: 'Hlavně neublížit.', ted: 'Mít čas na přátele.' });
    // Pravidla v pořadí cest; prázdné pravidlo cesty 8 se neukáže a otázka 3 tím pádem vůbec ne.
    expect(o1.pravidla.map((x) => x.cesta)).toEqual(['Kolik je dost?', 'Kam mi mizí čas?']);
    // Seneca dvakrát, Epikúros dvakrát (uprostřed Sporu a Odejít), Diogenés jednou.
    expect(o1.blizci.map((b) => b.osoba.id)).toEqual(['epikuros', 'seneca', 'diogenes']);
    // Důvod z cesty má přednost před hlasem u otázky.
    expect(o1.blizci.find((b) => b.osoba.id === 'seneca')!.duvod).toBe('Ani o sobě netvrdil, že nic neztrácí.');
    expect(o1.blizci.find((b) => b.osoba.id === 'seneca')!.stopy.map((s) => s.odpoved)).toEqual(['Mám, ale nějak mi mizí.', 'Odejít.']);
    expect(o2).toMatchObject({ slug: 'co-je-spravne', zacatek: 'Nevracet křivdu.', pravidla: [], blizci: [] });
  });

  it('stejný důvod u dvou myslitelů stojí jen u prvního', () => {
    const d = prazdny();
    d.bloky = { 'cesta34-dost-casu': { vyber: 2, proc: '', potvrzeno: true } };
    const [o] = prehledObdobi(d, { ...KATALOG, otazky: KATALOG.otazky.map((x) => ({ ...x, duvody: {} })) });
    expect(o.blizci.map((b) => [b.osoba.id, b.duvod])).toEqual([['seneca', 'Ani o sobě netvrdil, že nic neztrácí.'], ['epikuros', undefined]]);
  });

  it('hlas u otázky doplní důvod, kde ho cesta nemá nebo ho už řekla výš', () => {
    const d = prazdny();
    d.bloky = { 'cesta34-dost-casu': { vyber: 2, proc: '', potvrzeno: true }, 'cesta34-odejit-spor': { prvni: 2, konecna: 2, duvod: '' } };
    const k = { ...KATALOG, otazky: KATALOG.otazky.map((x) => (x.cislo === 1 ? { ...x, duvody: { ...x.duvody, epikuros: 'Klid je nejvyšší slast.' } } : x)) };
    const [o] = prehledObdobi(d, k);
    expect(o.blizci.map((b) => [b.osoba.id, b.duvod])).toEqual([['seneca', 'Ani o sobě netvrdil, že nic neztrácí.'], ['epikuros', 'Klid je nejvyšší slast.']]);
  });

  it('nic se nepočítá na procenta ani body: ve výsledku nejsou čísla kromě čísla otázky', () => {
    const d = prazdny();
    d.bloky = { 'cesta34-dost-casu': { vyber: 1, proc: '', potvrzeno: true }, 'cesta34-odejit-spor': { prvni: 4, konecna: 4, duvod: '' } };
    const text = JSON.stringify(prehledObdobi(d, KATALOG));
    expect(text).not.toMatch(/%|skóre|body|chybí/i);
    expect(JSON.stringify(prehledObdobi(d, KATALOG)[0].blizci)).not.toMatch(/"(pocet|skore|procenta)"/);
  });

  it('starý deník bez polí bloky a aktivita, s poškozenými zápisy, nespadne', () => {
    const stary = { verze: 1, zapisy: [zapis('otazka-jak-zit-prvni', 'Žít poctivě.'), null, { id: 'cesta6-moje-pravidlo', odpoved: 42 }], vyzvy: [], navstivene: [] } as unknown as Denik;
    const p = prehledObdobi(stary, KATALOG);
    expect(p).toHaveLength(1);
    expect(p[0]).toMatchObject({ cislo: 1, zacatek: 'Žít poctivě.', pravidla: [], blizci: [] });
    expect(prehledObdobi({ verze: 1 } as unknown as Denik, KATALOG)).toEqual([]);
    expect(prehledObdobi({ verze: 1, bloky: [], zapisy: 'x' } as unknown as Denik, KATALOG)).toEqual([]);
  });

  it('osoba, kterou katalog nezná, se neukáže', () => {
    const k: KatalogObdobi = { ...KATALOG, osoby: { seneca: KATALOG.osoby.seneca } };
    const d = prazdny();
    d.bloky = { 'cesta34-dost-casu': { vyber: 0, proc: '', potvrzeno: true } };
    expect(prehledObdobi(d, k)).toEqual([]);
  });
});

describe('Tvoje antika: volba na ose hlasů', () => {
  const sVolbou = (slug: string, volba: unknown) => ({ ...prazdny(), bloky: { [`otazka-${slug}-osa`]: volba } });

  it('volba sama otázku ukáže, s důvodem z hlasu a odkazem na osu', () => {
    const p = prehledObdobi(sVolbou('jak-zit', { volba: 'seneca' }), KATALOG);
    expect(p).toHaveLength(1);
    expect(p[0].nejbliz).toEqual({ osoba: KATALOG.osoby.seneca, adresa: '/otazka/jak-zit/#jak-zit-osa', duvod: 'Život je dlouhý, když ho umíš použít.' });
    expect(p[0].blizci).toEqual([]);
  });

  it('důvod z hlasu se u téhož myslitele z cest neopakuje', () => {
    const d = { ...sVolbou('jak-zit', { volba: 'seneca' }), bloky: { 'otazka-jak-zit-osa': { volba: 'seneca' }, 'cesta34-odejit-spor': { prvni: 0, konecna: 0, duvod: '' } } };
    const p = prehledObdobi(d, KATALOG);
    const seneca = p[0].blizci.find((b) => b.osoba.id === 'seneca')!;
    expect(seneca.duvod).toBeUndefined();
    expect(p[0].nejbliz?.duvod).toBe('Život je dlouhý, když ho umíš použít.');
  });

  it('„nikdo“, neznámé id, hlas jiné otázky a poškozený stav nic neukážou', () => {
    for (const v of [{ volba: 'nikdo' }, { volba: 'neexistuje' }, { volba: 'marcus-aurelius' }, 'seneca', { volba: 3 }, null]) {
      expect(prehledObdobi(sVolbou('jak-zit', v), KATALOG), JSON.stringify(v)).toEqual([]);
    }
  });

  it('otázka bez seznamu hlasů v katalogu (starší katalog) volbu nečte', () => {
    expect(prehledObdobi(sVolbou('ma-zivot-smysl', { volba: 'seneca' }), KATALOG)).toEqual([]);
  });

  it('u otázky s jinými zápisy stojí volba vedle nich', () => {
    const d = { ...sVolbou('jak-zit', { volba: 'epikuros' }), zapisy: [zapis('otazka-jak-zit-prvni', 'Neublížit.')] };
    const p = prehledObdobi(d, KATALOG);
    expect(p[0].zacatek).toBe('Neublížit.');
    expect(p[0].nejbliz?.osoba.id).toBe('epikuros');
    expect(p[0].nejbliz?.duvod).toBeUndefined();
  });
});

describe('čtení katalogu z textů', () => {
  it('důvod z hlasu: první odstavec bez věty, která uvádí citát', () => {
    expect(duvodZMyslenky('Štěstí není pocit. Je to činnost.\n\nK dobrému životu patří i přátelé.')).toBe('Štěstí není pocit. Je to činnost.');
    expect(duvodZMyslenky('Svobodný je ten, kdo nic nepotřebuje. Vypráví se, že na lidi volal:')).toBe('Svobodný je ten, kdo nic nepotřebuje.');
    expect(duvodZMyslenky('Řekl to větou:')).toBeUndefined();
    // První věta, která ukazuje na citát nebo případ nad sebou, bez stránky otázky nedává smysl.
    expect(duvodZMyslenky('Seneca to napsal příteli. K životu máme všechno.')).toBeUndefined();
    expect(duvodZMyslenky('Tvůj případ je starší, než vypadá. Platón…')).toBeUndefined();
    expect(duvodZMyslenky('Štěstí není pocit. Je to činnost.')).toBe('Štěstí není pocit. Je to činnost.');
  });

  it('strana Sporu jako důvod: postoj a první argument', () => {
    expect(duvodStranySporu({ postoj: 'Potřebovat co nejméně.', argumenty: ['Každá potřeba\n je provázek.', 'Druhý.'] })).toBe('Potřebovat co nejméně. Každá potřeba je provázek.');
  });

  it('MDX do prostého textu: citát v uvozovkách, odkaz jen textem, bez značek', () => {
    const t = prostyText('Máš Epiktéta, který říkal:\n\n<Citat id="ench-1" kompaktni />\n\nVíc u [otázky](/otazka/jak-zit/) a *jinde*.', (id) => (id === 'ench-1' ? 'Něco je v naší moci' : undefined));
    expect(t).toBe('Máš Epiktéta, který říkal: „Něco je v naší moci“ Víc u otázky a jinde.');
  });

  it('oddíly Kdo je na tvé straně, bloky kroku a závěrečné pravidlo', () => {
    const body = `
<Strany blok="cesta8-je-rozumne">
<Strana odpoved="A" osoby="aristoteles plutarchos">

Jestli se bojíš, máš Aristotela.

</Strana>
</Strany>
Text mezi.
<Strany blok="cesta8-je-rozumne">
<Strana odpoved="B">

Jestli se bojíš umírání…

</Strana>
</Strany>
<Volba id="cesta8-je-rozumne" />
<Spor id="cesta8-epikuros-plutarchos" dal={{ href: '#x', text: 'Dál' }} />
<ZaverCesty id="cesta8-moje-pravidlo" otazka="Je rozumné bát se smrti?" />`;
    const s = stranyZMdx(body).get('cesta8-je-rozumne')!;
    expect(s).toEqual([
      { kody: ['A'], osoby: ['aristoteles', 'plutarchos'], text: 'Jestli se bojíš, máš Aristotela.' },
      { kody: ['B'], text: 'Jestli se bojíš umírání…' },
    ]);
    expect(blokyZMdx(body)).toEqual(['cesta8-je-rozumne', 'cesta8-epikuros-plutarchos']);
    expect(pravidloZMdx(body)).toBe('cesta8-moje-pravidlo');
    expect(pravidloZMdx('nic')).toBeUndefined();
  });

  it('zastánci odpovědi: oddíl má přednost, jinak strany Sporu, Volba bez oddílu nikoho', () => {
    const spor = [
      { osoba: 'seneca', postoj: 'Odejít.', argumenty: ['Volno je pro přemýšlení.'] },
      { osoba: 'marcus-aurelius', postoj: 'Zůstat.', argumenty: ['Volno je uvnitř.'] },
    ];
    const oddil = [{ kody: ['seneca'], osoby: ['seneca', 'epikuros'], text: 'Máš Seneku a Epikúra.' }, { kody: ['marcus-aurelius'], text: 'Máš Marca.' }, { kody: ['uprostred'], text: 'Máš Diotimu.' }];
    // Text oddílu patří prvnímu jmenovanému; druhý dostane důvod jinde (hlas u otázky), nebo žádný.
    expect(zastanciOdpovedi('seneca', oddil, spor)).toEqual([{ osoba: 'seneca', duvod: 'Máš Seneku a Epikúra.' }, { osoba: 'epikuros' }]);
    expect(zastanciOdpovedi('marcus-aurelius', oddil, spor)).toEqual([{ osoba: 'marcus-aurelius', duvod: 'Máš Marca.' }]);
    // Oddíl uprostřed bez osob (Diotima v datech není): nikdo.
    expect(zastanciOdpovedi('uprostred', oddil, spor)).toEqual([]);
    // Spor bez oddílu: uprostřed obě strany s postojem a prvním argumentem.
    expect(zastanciOdpovedi('uprostred', undefined, spor)).toEqual([
      { osoba: 'seneca', duvod: 'Odejít. Volno je pro přemýšlení.' },
      { osoba: 'marcus-aurelius', duvod: 'Zůstat. Volno je uvnitř.' },
    ]);
    expect(zastanciOdpovedi('A', undefined)).toEqual([]);
    expect(zastanciOdpovedi('A', [{ kody: ['A'], text: 'Máš Asche.' }])).toEqual([]);
  });
});
