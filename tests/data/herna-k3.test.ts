// Logika her herny z K3 (herna-v1): Páry, Pravý, nebo podvržený?, Najdi slabé místo, Kdo by to řekl? a obsah
// nových bloků v src/content/bloky proti datům (pojmy, připsání, citáty a osoby).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import {
  situacePar, sediPar, spojPar, hotovePary, platnyStavPar, chybyPar, verdiktPar, pokusPar, idPasti, PRAZDNY_STAV_PAR,
  puvodPripsani, sediRazitko, textRazitka, platnyStavPravy, hotovaSeriePravy, chybyPravy,
  poradiArgumentu, zapisSlabe, platnyStavSlabe, chybySlabe, ZADNA,
  zapisKdoBy, otazkaZapisuKdoBy, platnyStavKdoBy, chybyKdoBy, ODKUD, prvniVeta, SEDI, ZKUS_JINAK,
} from '../../src/lib/herna';
import { BlokPary, BlokPravy, BlokSlabe, BlokKdoBy } from '../../src/lib/bloky-schema';
import { Pripsani, type TPripsani, type TOsoba } from '../../src/lib/schema';

const lide = parse(readFileSync(new URL('../../src/data/lide.yaml', import.meta.url), 'utf8')) as TOsoba[];
const zdroje = parse(readFileSync(new URL('../../src/data/zdroje.yaml', import.meta.url), 'utf8')) as {
  citaty: { id: string; osoba?: string; cesky: string; autor: string; dilo: string; misto: string }[];
  pripsani: TPripsani[];
};
const citaty = new Map(zdroje.citaty.map((c) => [c.id, c]));
const pripsani = new Map(zdroje.pripsani.map((p) => [p.id, Pripsani.parse(p)]));
const osoby = new Set(lide.map((o) => o.id));
const slozkaPojmu = new URL('../../src/content/pojmy/', import.meta.url);
const souboryPojmu = readdirSync(slozkaPojmu).filter((s) => s.endsWith('.md') && !s.startsWith('_'));
const pojmy = new Set(souboryPojmu.map((s) => s.replace(/\.md$/, '')));
const slovoPojmu = new Map(souboryPojmu.map((s) => [s.replace(/\.md$/, ''), readFileSync(new URL(s, slozkaPojmu), 'utf8').match(/^pojem: "(.+)"$/m)![1]]));

const PARY = [
  { pojem: 'soud', situace: 'A', jinak: 'ukazuje A', vazba: 'věta A' },
  { pojem: 'klid', situace: 'B', jinak: 'ukazuje B', vazba: 'věta B' },
  { pojem: 'stred', situace: 'C', jinak: 'ukazuje C', vazba: 'věta C' },
];
const PASTI = [{ situace: 'Soud u okresu', pripomina: 'soud', jinak: 'úřad' }];

describe('Páry', () => {
  it('situace se zamíchají se semínkem a pasti mají vlastní id', () => {
    const a = situacePar(PARY, PASTI, 'blok');
    expect(a).toEqual(situacePar(PARY, PASTI, 'blok'));
    expect(a.map((s) => s.id).sort()).toEqual(['klid', idPasti(0), 'soud', 'stred'].sort());
    expect(a.find((s) => s.id === 'past-1')).toMatchObject({ past: true, jinak: 'úřad' });
  });
  it('pár sedí jen se svou situací; past nesedí nikdy', () => {
    expect(sediPar('soud', 'soud')).toBe(true);
    expect(sediPar('soud', 'past-1')).toBe(false);
    const s = situacePar(PARY, PASTI, 'x').find((x) => x.id === 'past-1')!;
    expect(verdiktPar('soud', s)).toEqual({ sedi: false, slovo: ZKUS_JINAK, veta: 'úřad' });
    expect(verdiktPar('klid', { id: 'klid', text: '', jinak: '', past: false }).slovo).toBe(SEDI);
  });
  it('spojení: správné přibude, vedle se zapamatuje jako poslední; spojený pojem ani situace znovu nejdou', () => {
    let s = spojPar(PRAZDNY_STAV_PAR, 'soud', 'klid');
    expect(s).toMatchObject({ spojeno: [], vedle: ['soud|klid'], posledni: 'soud|klid' });
    s = spojPar(s, 'soud', 'soud');
    expect(s).toMatchObject({ spojeno: ['soud'], posledni: null });
    expect(spojPar(s, 'soud', 'past-1')).toBe(s);
    expect(spojPar(s, 'klid', 'soud')).toBe(s);
    s = spojPar(spojPar(s, 'klid', 'klid'), 'stred', 'stred');
    expect(hotovePary(s, ['soud', 'klid', 'stred'])).toBe(true);
    expect(hotovePary({ ...PRAZDNY_STAV_PAR, ukazano: true }, ['soud'])).toBe(true);
  });
  it('platný stav jen s pojmy a situacemi bloku', () => {
    expect(platnyStavPar({ spojeno: ['soud', 'cizi'], vedle: ['soud|klid', 'soud|soud', 'x|y'], posledni: 'soud|klid', ukazano: false }, ['soud', 'klid'], ['soud', 'klid', 'past-1']))
      .toEqual({ spojeno: ['soud'], vedle: ['soud|klid'], posledni: 'soud|klid', ukazano: false });
    expect(platnyStavPar({ spojeno: [], vedle: [] }, ['soud'], ['soud'])).toBeNull();
    expect(platnyStavPar('nic', ['soud'], ['soud'])).toBeNull();
    expect(pokusPar('a', 'b')).toBe('a|b');
  });
  it('chyby: pojem mimo kolekci, past k pojmu mimo blok, opakovaná situace', () => {
    expect(chybyPar({ pary: PARY, pasti: PASTI }, pojmy)).toEqual([]);
    expect(chybyPar({ pary: [{ ...PARY[0], pojem: 'neni' }], pasti: [] }, pojmy)[0]).toContain('není v src/content/pojmy');
    expect(chybyPar({ pary: PARY, pasti: [{ ...PASTI[0], pripomina: 'idea' }] }, pojmy)[0]).toContain('který v bloku není');
    expect(chybyPar({ pary: PARY, pasti: [{ ...PASTI[0], situace: 'a' }] }, pojmy)).toContain('Páry: situace se v bloku opakuje.');
  });
});

describe('Pravý, nebo podvržený?', () => {
  const p = (id: string) => pripsani.get(id)!;
  it('razítka podle rodu a verdiktu z dat', () => {
    expect(textRazitka('rekl')).toBe('řekl to');
    expect(textRazitka('nerekl', true)).toBe('neřekla to');
    expect(sediRazitko('nerekl', p('vim-ze-nic-nevim'))).toBe(true);
    expect(sediRazitko('nerekl', p('vic-nas-strasi'))).toBe(false);
  });
  it('původ: přepsaný ukáže skutečný citát, cizí autora a rok, obrácený opak', () => {
    const v = puvodPripsani(p('vim-ze-nic-nevim'), citaty);
    expect(v.titulek).toBe('Takhle to neřekl.');
    expect(v.citat?.text).toContain('ani si nemyslím, že vím');
    expect(v.oprava).toBe('Neřekl to takhle · Obrana Sókratova 21d');
    const d = puvodPripsani(p('opakovane-delame'), citaty);
    expect(d.autor).toBe('Will Durant, The Story of Philosophy, 1926');
    expect(d.oprava).toBe('Neřekl to · Will Durant, 1926');
    const o = puvodPripsani(p('skola-zivot'), citaty);
    expect(o.titulek).toBe('Napsal opak.');
    expect(o.citat?.text).toBe('Neučíme se pro život, ale pro školu.');
    const n = puvodPripsani(p('nadoba-a-ohen'), citaty);
    expect(n.citat?.kde).toContain('O poslouchání 48C');
    expect(puvodPripsani(p('pomsta-nebyt-jako-on'), citaty).oprava).toBe('Řekl to · Hovory k sobě VI, 6');
  });
  it('každé připsání v datech dá původ s opravou a popisem', () => {
    for (const z of pripsani.values()) {
      const v = puvodPripsani(z, citaty);
      expect(v.oprava.length, z.id).toBeGreaterThan(10);
      expect(v.popis, z.id).toBe(z.puvod.popis);
      if (z.verdikt === 'nerekl') expect(v.oprava, z.id).toMatch(/^Neřekl/);
    }
  });
  it('stav série: karta nepředbíhá neotištěnou, prázdný stav je null', () => {
    expect(platnyStavPravy({ karta: 3, tipy: ['rekl', null, null, null] }, 4)).toEqual({ karta: 1, tipy: ['rekl', null, null, null] });
    expect(platnyStavPravy({ karta: 0, tipy: [null, null] }, 2)).toBeNull();
    expect(platnyStavPravy({ karta: 0, tipy: ['ano', 'nerekl'] }, 2)).toEqual({ karta: 0, tipy: [null, 'nerekl'] });
    expect(hotovaSeriePravy({ karta: 1, tipy: ['rekl', 'nerekl'] })).toBe(true);
    expect(chybyPravy([{ pripsani: 'vim-ze-nic-nevim' }, { pripsani: 'vim-ze-nic-nevim' }, { pripsani: 'neni' }], pripsani)).toHaveLength(2);
  });
});

describe('Najdi slabé místo', () => {
  const karty = [
    { id: 'z', text: 'Tedy tohle.', misto: 'zaver' as const },
    { id: 'b', text: 'Druhá věta.', misto: 2 as const },
    { id: 'a', text: 'První věta.', misto: 1 as const },
  ];
  it('pořadí argumentu a zápis bez rodu', () => {
    expect(poradiArgumentu(karty).map((k) => k.id)).toEqual(['a', 'b', 'z']);
    expect(zapisSlabe(karty, 'a')).toBe('Škrtám větu: „První věta“.');
    expect(zapisSlabe(karty, 'a', ' Protože. ')).toBe('Škrtám větu: „První věta“. Proč: Protože.');
    expect(zapisSlabe(karty, ZADNA)).toBe('Neškrtám nic, argument mi drží.');
    expect(zapisSlabe(karty, 'z')).toBe('');
  });
  it('stav jen s premisou nebo „drží mi“', () => {
    expect(platnyStavSlabe({ volba: 'a', proc: 'x', zapsano: true }, ['a', 'b'])).toEqual({ volba: 'a', proc: 'x', zapsano: true });
    expect(platnyStavSlabe({ volba: ZADNA }, ['a'])).toEqual({ volba: ZADNA, proc: '', zapsano: false });
    expect(platnyStavSlabe({ volba: 'z' }, ['a'])).toBeNull();
  });
  it('chyby: premisa bez hlasu, citát jiné osoby, závěr s hlasem', () => {
    const h = { osoba: 'epiktetos', citat: 'rukojet-5', proc: 'Proč:' };
    expect(chybySlabe({ karty: [{ ...karty[2], skrtl: [h] }, { ...karty[1], skrtl: [h] }, karty[0]], drzi: { hlasy: [h] } }, citaty, osoby)).toEqual([]);
    const chyby = chybySlabe({ karty: [karty[2], { ...karty[1], skrtl: [{ ...h, osoba: 'seneca' }] }, { ...karty[0], skrtl: [h] }], drzi: { hlasy: [] } }, citaty, osoby);
    expect(chyby.join(' ')).toContain('nemá nikoho, kdo by ji škrtl');
    expect(chyby.join(' ')).toContain('nepatří osobě „seneca“');
    expect(chyby.join(' ')).toContain('závěr nemá hlasy');
    expect(chyby.join(' ')).toContain('nemá zastánce');
  });
});

describe('Kdo by to řekl?', () => {
  it('zápis a otázka zápisu', () => {
    expect(zapisKdoBy('Epikúros')).toBe('Můj výběr: Epikúros.');
    expect(zapisKdoBy('Epikúros', ' touhy ')).toBe('Můj výběr: Epikúros. Proč: touhy');
    expect(otazkaZapisuKdoBy('Kdo by ji podepsal?', 'Méně je víc.')).toBe('Kdo by ji podepsal? „Méně je víc“');
    expect(Object.keys(ODKUD)).toEqual(['chat', 'kamarad', 'komentar', 'reklama', 'obrazek', 'sit']);
  });
  it('stav a chyby', () => {
    expect(platnyStavKdoBy({ osoba: 'diogenes', proc: 'x', zapsano: true }, ['diogenes'])).toEqual({ osoba: 'diogenes', proc: 'x', zapsano: true });
    expect(platnyStavKdoBy({ osoba: 'platon' }, ['diogenes'])).toBeNull();
    const atlas = [{ osoba: 'diogenes', citat: 'dl-vi-104', proc: 'Proč:' }];
    const odmitl = [{ osoba: 'aristoteles', citat: 'etika-1099a', proc: 'Proč:' }];
    expect(chybyKdoBy({ moznosti: ['diogenes', 'aristoteles'], atlas, odmitl }, citaty, osoby)).toEqual([]);
    const chyby = chybyKdoBy({ moznosti: ['aristoteles', 'aristoteles'], atlas, odmitl: [...odmitl, { ...atlas[0] }] }, citaty, osoby).join(' ');
    expect(chyby).toContain('možnost se opakuje');
    expect(chyby).toContain('mezi možnostmi není');
    expect(chyby).toContain('mezi vybranými i odmítajícími');
  });
});

// ─── Obsah bloků K3 proti datům ───────────────────────────────────────────────
const slozka = new URL('../../src/content/bloky/', import.meta.url);
const hry = readdirSync(slozka).filter((s) => s.endsWith('.yaml'))
  .map((s) => ({ s, d: parse(readFileSync(new URL(s, slozka), 'utf8')) }))
  .filter((x) => ['pary', 'pravy', 'slabe', 'kdo-by'].includes(x.d.druh));
const vety = (t: string) => t.split(/(?<=[.!?:])\s+(?=\p{Lu})/u).length;
const proc = new Map(lide.map((o) => [o.id, o.proc ?? o.kdo ?? '']));

describe('nové hry K3 v src/content/bloky', () => {
  it('dílna má všechny čtyři formáty', () => {
    expect(hry.map((h) => h.d.druh)).toEqual(expect.arrayContaining(['pary', 'pravy', 'slabe', 'kdo-by']));
  });
  for (const { s, d } of hry) {
    it(`${s}: schéma a data`, () => {
      if (d.druh === 'pary') {
        const b = BlokPary.parse(d);
        expect(chybyPar(b, pojmy)).toEqual([]);
        for (const p of b.pary) expect(vety(p.vazba), p.pojem).toBe(1);
        // Věta „jinak“ neříká jméno pojmu, ke kterému situace patří (prozradila by pár).
        for (const p of b.pary) expect(p.jinak.toLocaleLowerCase('cs'), p.pojem).not.toContain(slovoPojmu.get(p.pojem)!);
      } else if (d.druh === 'pravy') {
        const b = BlokPravy.parse(d);
        expect(chybyPravy(b.karty, pripsani)).toEqual([]);
        // V sérii je aspoň jedna pravá a jedna podvržená věta.
        const verdikty = new Set(b.karty.map((k) => pripsani.get(k.pripsani)!.verdikt));
        expect([...verdikty].sort()).toEqual(['nerekl', 'rekl']);
        for (const k of b.karty) expect(prvniVeta(proc.get(pripsani.get(k.pripsani)!.osoba)!), k.pripsani).not.toBe('');
      } else if (d.druh === 'slabe') {
        const b = BlokSlabe.parse(d);
        expect(chybySlabe(b, citaty, osoby)).toEqual([]);
      } else {
        const b = BlokKdoBy.parse(d);
        expect(chybyKdoBy(b, citaty, osoby)).toEqual([]);
        for (const o of b.moznosti) expect(prvniVeta(proc.get(o)!), o).not.toBe('');
      }
    });
  }
});
