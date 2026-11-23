// Co ti zůstalo? (denik-v2, K2): skládání otázek z dat, kontrola, výběr kola podle deníku a stav kola.
import { describe, it, expect } from 'vitest';
import {
  blizkePojmy, chybyZustalo, dalsiOtazka, jmenuje, konecKola, kZopakovani, noveKolo, odpovez, otazkyHlasu, otazkyKreseb, otazkyPojmu,
  platnyStavZustalo, potkaneZDeniku, pozvanka, pripadZTextu, vetaPredKresbou, vyberKola, zpetPro,
  ZUSTALO_DRUHU_NEJVYS, ZUSTALO_KOLO, type OtazkaZustalo, type PojemVstup,
} from '../../src/lib/herna/zustalo';
import { katalogZustalo, vstupZustalo } from '../../src/lib/herna/zustalo-data';
import { BLIZKE_OTAZKY_KRESEB, VETY_KRESEB } from '../../src/lib/kresby';
import { prostyText } from '../../src/lib/tvoje-obdobi';
import { VIS, ZOPAKUJ_SI, vybaveni } from '../../src/lib/herna/verdikt';

const ANTIKA = [1, 2];
const pojem = (id: string, o: Partial<PojemVstup> = {}): PojemVstup => ({
  id, pojem: id, vysvetleni: `${id} je první věta. Druhá věta.`, uKoho: [], priklad: `Příklad bez slova.`, vyskyty: [`cesta/c/${id.length}`], obdobi: [2], tvary: [], ...o,
});
const otazka = (id: string, druh: OtazkaZustalo['druh'], potkal = [`/x/${id}/`]): OtazkaZustalo => ({
  id, druh, nazev: id, podnet: 'Podnět.', zadani: 'Zadání?', moznosti: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }, { id: 'c', text: 'C' }],
  spravna: 'a', vysvetleni: 'Vysvětlení.', zpet: { href: `/x/${id}/`, text: 'Zpátky' }, potkal,
});
const sada = (druh: OtazkaZustalo['druh'], n: number) => Array.from({ length: n }, (_, i) => otazka(`${druh}:${i}`, druh));

describe('text', () => {
  it('jmenuje: celá slova a tvary, bez ohledu na velikost písmen', () => {
    expect(jmenuje('Telefon pípne a ataraxia v malém.', ['klid', 'ataraxia'])).toBe(true);
    expect(jmenuje('Klidně si sedni.', ['klid'])).toBe(false);
    expect(jmenuje('Je to v naší moci.', ['v naší moci'])).toBe(true);
  });
  it('úvodní případ: odstavce před první komponentou, bez odstavce, který uvádí citát', () => {
    const body = '\nPrvní odstavec.\n\nDruhý *odstavec*.\n\nŘíká host z Eleje:\n\n<Citat id="x" />\n\nDál.\n';
    expect(pripadZTextu(body)).toBe('První odstavec.\n\nDruhý odstavec.');
  });
  it('věta nad kresbou: odzadu první věta s aspoň pěti slovy', () => {
    const body = 'import { Lod } from "x";\n\n<div class="ctenarsky">\n\nÚvod. Vyměň tolik prken, kolik chceš, a zastav. Jestli vůbec.\n\n<Lod id="lod" />';
    expect(vetaPredKresbou(body, 'Lod')).toBe('Vyměň tolik prken, kolik chceš, a zastav.');
    expect(vetaPredKresbou(body, 'Maska')).toBeUndefined();
  });
  it('Víš. a Zopakuj si. vedle Sedí. a Zkus to jinak.', () => {
    expect([vybaveni(true), vybaveni(false)]).toEqual([VIS, ZOPAKUJ_SI]);
    expect([VIS, ZOPAKUJ_SI]).toEqual(['Víš.', 'Zopakuj si.']);
  });
});

describe('skládání', () => {
  it('pojem: situace z Párů má přednost, další možnosti z téhož bloku; příklad, který pojem jmenuje, se nepoužije', () => {
    const pojmy = [pojem('klid', { priklad: 'Ataraxia v malém.', tvary: ['ataraxia'] }), pojem('slast'), pojem('stesti'), pojem('osud', { priklad: 'Osud tě dožene.' }), pojem('soud')];
    const pary = [{ id: 'epikureismus-pary', pary: [{ pojem: 'klid', situace: 'Boty tě netahají.' }, { pojem: 'slast', situace: 'Nic tě nebolí.' }, { pojem: 'stesti', situace: 'Celý život.' }] }];
    const o = otazkyPojmu(pojmy, pary, ANTIKA);
    const klid = o.find((x) => x.id === 'pojem:klid')!;
    expect(klid.podnet).toBe('Boty tě netahají.');
    expect(klid.moznosti.map((m) => m.id).sort()).toEqual(['klid', 'slast', 'stesti']);
    expect(o.some((x) => x.id === 'pojem:osud')).toBe(false);
    expect(o.find((x) => x.id === 'pojem:soud')!.moznosti).toHaveLength(3);
    expect(klid.potkal).toContain('/pojem/klid/');
    expect(klid.vysvetleni).toBe('klid je první věta. Druhá věta.');
    expect(klid.zadani).toBe('Který pojem v tom poznáš?');
  });
  it('pojem: pojem, který vysvětlení správného jmenuje (nebo naopak), mezi možnostmi není', () => {
    const slast = pojem('slast', { vysvetleni: 'Slast je cílem. Je to klid těla a mysli.' });
    const klid = pojem('klid', { tvary: ['klidu'] });
    expect(blizkePojmy(slast, klid)).toBe(true);
    expect(blizkePojmy(klid, slast)).toBe(true);
    expect(blizkePojmy(klid, pojem('stesti'))).toBe(false);
    const pojmy = [klid, slast, pojem('stesti'), pojem('soud'), pojem('osud')];
    const pary = [{ id: 'epikureismus-pary', pary: [{ pojem: 'klid', situace: 'Boty tě netahají.' }, { pojem: 'slast', situace: 'Nic tě nebolí.' }, { pojem: 'stesti', situace: 'Celý život.' }] }];
    const o = otazkyPojmu(pojmy, pary, ANTIKA);
    for (const id of ['pojem:klid', 'pojem:slast']) {
      const x = o.find((y) => y.id === id)!;
      expect(x.moznosti, id).toHaveLength(3);
      expect(x.moznosti.map((m) => m.id).filter((m) => ['klid', 'slast'].includes(m)), id).toHaveLength(1);
    }
  });
  it('hlas: tři odpovědi téže otázky, přednostně jiného směru; odpověď se jménem mluvčího vypadne', () => {
    const h = (osoba: string, smer: string, odpoved = `Rada číslo ${osoba.length}${smer}.`) => ({ osoba, jmeno: osoba, tvaryJmena: [osoba], smer, odpoved, vysvetleni: `„${osoba}“` });
    const o = otazkyHlasu([{ slug: 'q', cislo: 1, otazka: 'Jak?', adresa: '/otazka/q/', pripadText: 'Případ.', hlasy: [h('seneca', 'stoa'), h('epiktetos', 'stoa'), h('epikuros', 'zahrada'), h('platon', 'akademie'), h('diogenes', 'kynici', 'Jako diogenes.')] }]);
    expect(o.map((x) => x.id)).not.toContain('hlas:q:diogenes');
    const seneca = o.find((x) => x.id === 'hlas:q:seneca')!;
    expect(seneca.moznosti.map((m) => m.id)).not.toContain('epiktetos');
    expect(seneca.moznosti.map((m) => m.id)).not.toContain('diogenes');
    expect(seneca.zadani).toBe('Co by ti na to řekl seneca?');
  });
  it('kresba: správná je otázka cesty, další dvě jiné velké otázky', () => {
    const o = otazkyKreseb([{ komponenta: 'Lod', nazev: 'Loď', veta: 'Vyměň prkna.', cesta: { slug: 'c', nazev: 'Cesta', otazka: 5 }, krok: { n: 4, nazev: 'Loď' } }],
      [{ cislo: 1, otazka: 'Jak mám žít?' }, { cislo: 5, otazka: 'Kdo vlastně jsem?' }, { cislo: 6, otazka: 'Co je skutečné?' }]);
    expect(o[0].spravna).toBe('5');
    expect(o[0].moznosti).toHaveLength(3);
    expect(o[0].potkal).toEqual(['cesta/c/4']);
    expect(o[0].podnet).toBe('Kresba „Loď“\n\nVyměň prkna.');
    expect(o[0].vysvetleni).toBe('Kresba patří k cestě *Cesta*, která hledá odpověď na otázku *Kdo vlastně jsem?*');
  });
  it('kresba: otázka, na kterou by obraz poctivě odpovídal taky, mezi možnostmi není', () => {
    const velke = [1, 3, 4, 5, 6, 7].map((cislo) => ({ cislo, otazka: `Otázka ${cislo}?` }));
    const o = otazkyKreseb([{ komponenta: 'Jeskyne', nazev: 'Jeskyně', veta: 'Stíny.', cesta: { slug: 'c', nazev: 'Cesta', otazka: 6 }, krok: { n: 1, nazev: 'Jeskyně' }, blizke: [7, 4] }], velke);
    expect(o[0].moznosti.map((m) => m.id)).not.toContain('7');
    expect(o[0].moznosti.map((m) => m.id)).not.toContain('4');
    expect(o[0].moznosti).toHaveLength(3);
  });
  it('kontrola najde situaci se jménem pojmu, dvě stejné možnosti a chybějící vysvětlení', () => {
    const spatna = { ...otazka('pojem:klid', 'pojem'), spravna: 'klid', podnet: 'To je klid.', moznosti: [{ id: 'klid', text: 'Klid' }, { id: 'b', text: 'Klid' }, { id: 'c', text: 'C' }], vysvetleni: ' ' };
    const chyby = chybyZustalo([spatna], [pojem('klid')]);
    expect(chyby.join('\n')).toMatch(/jmenuje svůj pojem/);
    expect(chyby.join('\n')).toMatch(/stejný text/);
    expect(chyby.join('\n')).toMatch(/vysvětlení/);
  });
});

describe('data antiky', () => {
  const k = katalogZustalo(ANTIKA);
  const v = vstupZustalo(ANTIKA);
  it('všechny tři druhy, kontrola bez chyb, každá otázka má odkaz zpět na každé místo, kde ji student potká', () => {
    for (const d of ['pojem', 'hlas', 'kresba'] as const) expect(k.otazky.filter((o) => o.druh === d).length).toBeGreaterThanOrEqual(4);
    expect(chybyZustalo(k.otazky, v.pojmy)).toEqual([]);
    for (const o of k.otazky) for (const p of o.potkal.filter((x) => !x.startsWith('cesta/') || /\/\d+$/.test(x))) expect(k.mista[p], `${o.id} → ${p}`).toBeDefined();
  });
  it('blízké otázky kreseb nejsou mezi možnostmi; kresba, které nezbudou dvě jiné otázky, v kvízu není', () => {
    for (const [komponenta, blizke] of Object.entries(BLIZKE_OTAZKY_KRESEB)) {
      expect(v.kresby.some((x) => x.komponenta === komponenta), komponenta).toBe(true);
      const o = k.otazky.find((x) => x.id === `kresba:${komponenta}`);
      const zbude = v.velke.length - 1 - blizke!.length;
      expect(!!o, komponenta).toBe(zbude >= 2);
      if (!o) continue;
      for (const c of blizke!) expect(o!.moznosti.map((m) => m.id), komponenta).not.toContain(String(c));
    }
  });
  it('žádná dvojice blízkých pojmů (slast a klid, soud a v naší moci) není v jedné otázce', () => {
    for (const o of k.otazky.filter((x) => x.druh === 'pojem')) {
      const p = v.pojmy.find((x) => x.id === o.spravna)!;
      for (const m of o.moznosti.filter((x) => x.id !== p.id)) expect(blizkePojmy(p, v.pojmy.find((x) => x.id === m.id)!), `${o.id} × ${m.id}`).toBe(false);
    }
    const klid = k.otazky.find((x) => x.id === 'pojem:klid')!;
    expect(klid.moznosti.map((m) => m.id)).not.toContain('slast');
    const soud = k.otazky.find((x) => x.id === 'pojem:soud')!;
    expect(soud.moznosti.map((m) => m.id)).not.toContain('v-nasi-moci');
  });
  it('hlas, u kterého citát mluví o jiné části myšlenky, má vysvětlení z citátu odpovědi nebo z myšlenky', () => {
    expect(k.otazky.find((x) => x.id === 'hlas:co-je-skutecne:parmenides')!.vysvetleni).toMatch(/^„Proto je jen jménem všechno/);
    expect(k.otazky.find((x) => x.id === 'hlas:kdo-vlastne-jsem:marcus-aurelius')!.vysvetleni).toMatch(/mínění o sobě si cení méně než cizího\.$/);
  });
  it('žádná situace nejmenuje svůj pojem', () => {
    for (const o of k.otazky.filter((x) => x.druh === 'pojem')) {
      const p = v.pojmy.find((x) => x.id === o.spravna)!;
      expect(jmenuje(o.podnet, [p.pojem, ...p.tvary]), o.id).toBe(false);
    }
  });
  it('hlas: možnosti jsou odpovědi hlasů téže otázky a vysvětlení je citát s údajem nebo důvod', () => {
    for (const o of k.otazky.filter((x) => x.druh === 'hlas')) {
      const ot = v.otazky.find((x) => x.slug === o.id.split(':')[1])!;
      for (const m of o.moznosti) expect(ot.hlasy.find((h) => h.osoba === m.id)?.odpoved.trim(), o.id).toBe(m.text);
      expect(o.vysvetleni.length).toBeGreaterThan(20);
    }
  });
  it('věty kreseb stojí doslova v kroku cesty, kde kresba je', () => {
    for (const komponenta of Object.keys(VETY_KRESEB)) {
      const kresba = v.kresby.find((x) => x.komponenta === komponenta);
      expect(kresba, komponenta).toBeDefined();
    }
    const raw = import.meta.glob('../../src/content/cesty/*/*.mdx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    for (const kr of v.kresby) {
      const veta = VETY_KRESEB[kr.komponenta as keyof typeof VETY_KRESEB];
      if (!veta) continue;
      const soubor = Object.entries(raw).find(([c, t]) => c.includes(`/cesty/${kr.cesta.slug}/${kr.krok.n}-`) && t.includes(`<${kr.komponenta}`));
      expect(soubor, kr.komponenta).toBeDefined();
      const text = prostyText(soubor![1]).toLocaleLowerCase('cs');
      expect(text.includes(veta.toLocaleLowerCase('cs')), `${kr.komponenta}: ${veta}`).toBe(true);
    }
  });
});

describe('výběr kola', () => {
  const vse = [...sada('pojem', 10), ...sada('hlas', 10), ...sada('kresba', 10)];
  const vsude = new Set(vse.flatMap((o) => o.potkal));
  const druh = (id: string) => id.split(':')[0];
  it('osm otázek, nejvýš čtyři jednoho druhu, dva stejné druhy nikdy po sobě', () => {
    for (let kolo = 1; kolo <= 30; kolo++) {
      const k = vyberKola(vse, vsude, kolo);
      expect(k).toHaveLength(ZUSTALO_KOLO);
      for (const d of ['pojem', 'hlas', 'kresba']) expect(k.filter((x) => druh(x) === d).length).toBeLessThanOrEqual(ZUSTALO_DRUHU_NEJVYS);
      for (let i = 1; i < k.length; i++) expect(druh(k[i]), `kolo ${kolo}`).not.toBe(druh(k[i - 1]));
      expect(new Set(k).size).toBe(k.length);
    }
  });
  it('stejné kolo dá stejné otázky, jiné kolo jiné', () => {
    expect(vyberKola(vse, vsude, 3)).toEqual(vyberKola(vse, vsude, 3));
    expect(vyberKola(vse, vsude, 3)).not.toEqual(vyberKola(vse, vsude, 4));
  });
  it('jen potkané; když převládá jeden druh, kolo se zkrátí, aby se druhy střídaly', () => {
    const jen = new Set(['/x/pojem:0/', '/x/pojem:1/', '/x/pojem:2/', '/x/pojem:3/', '/x/kresba:0/']);
    const k = vyberKola(vse, jen, 1);
    expect(k.every((id) => ['pojem:0', 'pojem:1', 'pojem:2', 'pojem:3', 'kresba:0'].includes(id))).toBe(true);
    expect(k).toHaveLength(3);
    expect(k.map(druh)).toEqual(['pojem', 'kresba', 'pojem']);
    expect(vyberKola(vse, new Set(), 1)).toEqual([]);
  });
});

describe('deník a stav kola', () => {
  it('potkané z kroků cest, navštívených stránek, čtení a aktivity; poškozený deník nic', () => {
    const p = potkaneZDeniku({
      cesty: { 'kolik-je-dost': { navstivene: [1, 3] }, rozbita: { navstivene: 'x' } },
      navstivene: [{ odkaz: '/osobnost/epikuros/', nazev: 'Epikúros', kdy: '' }, { odkaz: 'mimo' }],
      aktivita: [{ odkaz: '/otazka/jak-zit/#x' }],
      prectene: { '/osobnost/seneca/': ['a'] },
      cteni: { '/smer/stoicismus': 'b' },
    });
    expect([...p].sort()).toEqual(['/cesta/kolik-je-dost/1/', '/cesta/kolik-je-dost/3/', '/osobnost/epikuros/', '/osobnost/seneca/', '/otazka/jak-zit/', '/smer/stoicismus/', 'cesta/kolik-je-dost', 'cesta/kolik-je-dost/1', 'cesta/kolik-je-dost/3'].sort());
    expect(potkaneZDeniku(null).size).toBe(0);
    expect(potkaneZDeniku({ cesty: 5, navstivene: {} }).size).toBe(0);
  });
  it('odkaz zpět vede tam, kde student byl', () => {
    const o = { ...otazka('pojem:klid', 'pojem'), potkal: ['/osobnost/epikuros/', 'cesta/kolik-je-dost/7'] };
    const mista = { '/osobnost/epikuros/': { href: '/osobnost/epikuros/', text: 'Epikúros' }, 'cesta/kolik-je-dost/7': { href: '/cesta/kolik-je-dost/7/', text: 'Krok 7' } };
    expect(zpetPro(o, new Set(['cesta/kolik-je-dost/7']), mista).text).toBe('Krok 7');
    expect(zpetPro(o, new Set(), mista)).toEqual(o.zpet);
  });
  it('jedna odpověď, rub, další otázka, konec a co zopakovat', () => {
    const vse = [...sada('pojem', 3), ...sada('hlas', 3)];
    let s = noveKolo(1, vse, new Set(vse.flatMap((o) => o.potkal)));
    expect(s.poradi).toHaveLength(6);
    const podleId = new Map(vse.map((o) => [o.id, o]));
    expect(dalsiOtazka(s)).toBe(s);
    s.poradi.forEach((id, i) => {
      s = odpovez(s, podleId.get(id)!, i % 2 ? 'a' : 'b');
      expect(odpovez(s, podleId.get(id)!, 'a')).toBe(s);
      s = dalsiOtazka(s);
    });
    expect(konecKola(s)).toBe(true);
    expect(kZopakovani(s)).toEqual(s.poradi.filter((_, i) => i % 2 === 0));
    expect(s.volby[s.poradi[0]]).toBe('b');
  });
  it('uložený stav: platí jen na otázky katalogu; pozice se nevrátí za nezodpovězenou', () => {
    const vse = sada('pojem', 4);
    expect(platnyStavZustalo({ kolo: 2, poradi: ['pojem:0', 'pojem:9'], pozice: 0, odpovedi: {} }, vse)).toBeNull();
    expect(platnyStavZustalo({ kolo: 0, poradi: ['pojem:0'] }, vse)).toBeNull();
    const s = platnyStavZustalo({ kolo: 2, poradi: ['pojem:0', 'pojem:1'], pozice: 2, odpovedi: { 'pojem:0': 'vim', 'pojem:1': 'nic' }, volby: { 'pojem:0': 'a', 'pojem:1': 'z' } }, vse)!;
    expect(s).toEqual({ kolo: 2, poradi: ['pojem:0', 'pojem:1'], pozice: 1, odpovedi: { 'pojem:0': 'vim' }, volby: { 'pojem:0': 'a' } });
  });
  it('pozvánka do první nedokončené cesty', () => {
    const cesty = [{ slug: 'a', nazev: 'A', adresa: '/cesta/a/', pocet: 2 }, { slug: 'b', nazev: 'B', adresa: '/cesta/b/', pocet: 2 }];
    expect(pozvanka(cesty, null)?.slug).toBe('a');
    expect(pozvanka(cesty, { cesty: { a: { navstivene: [1, 2], pocet: 2 } } })?.slug).toBe('b');
  });
});
