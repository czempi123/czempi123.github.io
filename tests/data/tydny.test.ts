// Týdny cvičení (Stoický týden): schéma a kontrola dat, počty citátů v týdnu i v atlasu, který den otevřít,
// hotové dny, nabídka týdne z portrétů a deník s polem tydny (uložení, starší deník, export, spojení se souborem).
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { Tyden } from '../../src/lib/tydny-schema';
import { citatyTydne, cisteDny, denKOtevreni, hotoveDnyText, idVyzvyTydne, kontrolaTydne, oznacDen, pocetCitatu, zZe } from '../../src/lib/tydny';
import { citatyPodleId, osoby, pramenyPodleId } from '../../src/lib/data';
import {
  nacti, prijmiVyzvu, stavTydne, sTydnem, ulozTyden, ulozPoznamkuVyzvy, spojDeniky, rozeberDenik, _zapomenPamet, type Denik,
} from '../../src/lib/denik';

const SLOZKA = 'src/content/tydny';
const tydny = readdirSync(SLOZKA).filter((f) => f.endsWith('.yaml') && !f.startsWith('_')).map((f) => ({
  id: f.replace(/\.yaml$/, ''),
  data: Tyden.parse(parse(readFileSync(join(SLOZKA, f), 'utf8'))),
}));
const znam = { citaty: new Set(citatyPodleId.keys()), prameny: new Set(pramenyPodleId.keys()), osoby: new Set(osoby.keys()) };
const stoicky = tydny.find((t) => t.id === 'stoicky')!.data;

/** Všechny soubory obsahu kromě týdnů (MDX, MD, YAML). */
function soubory(slozka: string): string[] {
  return readdirSync(slozka).flatMap((f) => {
    const p = join(slozka, f);
    if (statSync(p).isDirectory()) return p === SLOZKA ? [] : soubory(p);
    return /\.(mdx?|ya?ml)$/.test(f) ? [p] : [];
  });
}
const obsah = soubory('src/content').map((p) => readFileSync(p, 'utf8')).join('\n');
/** Kolikrát citát zazní v atlasu mimo týdny: <Citat id="…" /> a `citat: …` (frontmatter, hlasy, bloky). */
const vAtlasu = (id: string) => (obsah.match(new RegExp(String.raw`(?:id="${id}"|citat:\s*${id}\b)`, 'g')) ?? []).length;

describe('data týdnů', () => {
  it('každý týden projde schématem a kontrolou (citáty, prameny, osoby, čísla dnů)', () => {
    expect(tydny.length).toBeGreaterThan(0);
    for (const t of tydny) expect(kontrolaTydne(t.id, t.data, znam)).toEqual([]);
  });

  it('Stoický týden má sedm dnů 1…7, psaní jen v posledním a nabízí se z cest 5, 33, 34 a tří portrétů', () => {
    expect(stoicky.dny.map((d) => d.cislo)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(stoicky.dny.filter((d) => d.psani).map((d) => d.cislo)).toEqual([7]);
    expect(stoicky.nabizet.cesty).toEqual(['co-mam-ve-svych-rukou', 'co-kdyz-prijde-to-nejhorsi', 'kam-mi-mizi-cas']);
    expect(stoicky.nabizet.osobnosti).toEqual(['seneca', 'epiktetos', 'marcus-aurelius']);
  });

  it('žádný citát týdne nezazní v týdnu víc než dvakrát, ani v týdnu a zbytku atlasu dohromady', () => {
    for (const t of tydny) {
      for (const [c, n] of pocetCitatu(citatyTydne(t.data))) {
        expect(n, `${c} v týdnu ${t.id}`).toBeLessThanOrEqual(2);
        expect(n + vAtlasu(c), `${c} v týdnu a v atlasu`).toBeLessThanOrEqual(2);
      }
    }
  });

  it('portrét, ze kterého se týden nabízí, na něj odkazuje v Kam dál', () => {
    for (const t of tydny) {
      for (const o of t.data.nabizet.osobnosti) {
        expect(readFileSync(`src/content/osobnosti/${o}.mdx`, 'utf8'), o).toContain(`href: '/tyden/${t.id}/'`);
      }
      for (const c of t.data.nabizet.cesty) expect(statSync(`src/content/cesty/${c}.mdx`).isFile(), c).toBe(true);
    }
  });

  it('kontrola najde chybějící citát, osobu, pramen, mezeru v číslech, trojí citát i dvě psaní', () => {
    const den = stoicky.dny[0];
    const spatny = {
      ...stoicky,
      zdroje: ['neni-pramen'],
      namitka: { text: 'x', citat: 'hovory-v-1' },
      dny: [
        { ...den, cislo: 1, citat: 'hovory-v-1' },
        { ...den, cislo: 3, osoba: 'nikdo', citat: 'hovory-v-1', psani: { veta: 'a', poznamka: 'b' } },
        { ...den, cislo: 4, citat: 'neni-citat', psani: { veta: 'a', poznamka: 'b' } },
      ],
    };
    const chyby = kontrolaTydne('x', spatny, znam).join('\n');
    expect(chyby).toContain('den na místě 2 má číslo 3');
    expect(chyby).toContain('osoba „nikdo“');
    expect(chyby).toContain('citát „neni-citat“');
    expect(chyby).toContain('pramen „neni-pramen“');
    expect(chyby).toContain('„hovory-v-1“ zazní 3krát');
    expect(chyby).toContain('psaní smí mít nejvýš jeden den');
  });

  it('schéma odmítne neznámé pole a odkaz mimo atlas', () => {
    const den = stoicky.dny[0];
    expect(() => Tyden.parse({ ...stoicky, navic: 1 })).toThrow();
    expect(() => Tyden.parse({ ...stoicky, dny: [{ ...den, odkaz: { href: 'https://x.cz', text: 'x' } }] })).toThrow();
  });
});

describe('který den otevřít a hotové dny', () => {
  it('nový student den 1; jinak den, na kterém skončil; jinak den po posledním hotovém', () => {
    expect(denKOtevreni(undefined, 7)).toBe(1);
    expect(denKOtevreni({ hotove: [] }, 7)).toBe(1);
    expect(denKOtevreni({ hotove: [1, 2], den: 5 }, 7)).toBe(5);
    expect(denKOtevreni({ hotove: [1, 2] }, 7)).toBe(3);
    // Přeskočený den nic nemění: po dnech 1 a 4 se pokračuje pátým.
    expect(denKOtevreni({ hotove: [1, 4] }, 7)).toBe(5);
    expect(denKOtevreni({ hotove: [1, 2, 7] }, 7)).toBe(3);
    expect(denKOtevreni({ hotove: [1, 2, 3, 4, 5, 6, 7] }, 7)).toBe(7);
    expect(denKOtevreni({ den: 9 }, 7)).toBe(1);
  });

  it('označení a zrušení dne; nesmysly z deníku vypadnou', () => {
    expect(oznacDen([1, 3], 2, true)).toEqual([1, 2, 3]);
    expect(oznacDen([1, 2, 3], 2, false)).toEqual([1, 3]);
    expect(oznacDen([1], 1, true)).toEqual([1]);
    expect(cisteDny([3, 1, 1, 0, 'x', 2.5, 8], 7)).toEqual([1, 3]);
    expect(cisteDny('x')).toEqual([]);
  });

  it('počet hotových dnů jen „N z M“, bez procent; předložka podle čísla', () => {
    expect(hotoveDnyText(3, 7)).toBe('Hotové dny: 3\u00a0ze\u00a07');
    expect(hotoveDnyText(0, 7)).toBe('Hotové dny: zatím žádný');
    expect(hotoveDnyText(2, 5)).toBe('Hotové dny: 2\u00a0z\u00a05');
    expect([1, 2, 3, 4, 5, 6, 7, 8].map(zZe)).toEqual(['z', 'ze', 'ze', 'ze', 'z', 'ze', 'ze', 'z']);
    expect(hotoveDnyText(3, 7)).not.toMatch(/%/);
  });
});

class Uloziste {
  data = new Map<string, string>();
  getItem(k: string) { return this.data.get(k) ?? null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}
const g = globalThis as unknown as { localStorage?: unknown };
const prazdny = (): Denik => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {} });

describe('deník: týdny cvičení', () => {
  let u: Uloziste;
  beforeEach(() => { u = new Uloziste(); g.localStorage = u; _zapomenPamet(); });
  afterEach(() => { delete g.localStorage; });

  it('hotové dny, den a věta se uloží do pole tydny, vydrží obnovení a jsou v uložených datech (tedy v exportu)', () => {
    ulozTyden('stoicky', { hotove: [1, 2], den: 3 });
    ulozTyden('stoicky', { veta: 'Vstávej k práci.' });
    _zapomenPamet();
    const ulozeny = JSON.parse(u.getItem('atlas-denik')!);
    expect(ulozeny.verze).toBe(1);
    expect(ulozeny.tydny.stoicky).toMatchObject({ hotove: [1, 2], den: 3, veta: 'Vstávej k práci.' });
    expect(stavTydne('stoicky')).toMatchObject({ hotove: [1, 2], den: 3 });
    // Žádné datum u dnů: jen jeden čas poslední změny pro spojení se souborem.
    expect(Object.keys(ulozeny.tydny.stoicky).sort()).toEqual(['den', 'hotove', 'kdy', 'veta']);
  });

  it('prázdná věta z deníku zmizí; poznámka jde k přijaté výzvě, k nepřijaté ne', () => {
    ulozTyden('stoicky', { veta: 'x' });
    ulozTyden('stoicky', { veta: '' });
    expect(stavTydne('stoicky')!.veta).toBeUndefined();
    ulozPoznamkuVyzvy(idVyzvyTydne('stoicky'), 'nic');
    expect(nacti().vyzvy).toEqual([]);
    prijmiVyzvu({ id: idVyzvyTydne('stoicky'), nazev: 'Stoický týden', odkaz: '/tyden/stoicky/' });
    ulozPoznamkuVyzvy(idVyzvyTydne('stoicky'), '  Pomohl mi den 4.  ');
    expect(nacti().vyzvy[0]).toMatchObject({ id: 'tyden-stoicky', poznamka: 'Pomohl mi den 4.' });
    expect(nacti().vyzvy[0].upraveno).toMatch(/^\d{4}-/);
    ulozPoznamkuVyzvy(idVyzvyTydne('stoicky'), '');
    expect(nacti().vyzvy[0].poznamka).toBeUndefined();
  });

  it('starší deník bez pole se načte beze změny; rozbité záznamy vypadnou', () => {
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [] }));
    expect(nacti().tydny).toBeUndefined();
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, tydny: [] }));
    expect(nacti().tydny).toBeUndefined();
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, tydny: { a: { hotove: [2, 'x', 1, 1], kdy: 't', den: 'x' }, b: { hotove: [1] }, c: 5 } }));
    expect(nacti().tydny).toEqual({ a: { hotove: [1, 2], kdy: 't' } });
  });

  it('spojení se souborem: u téhož týdne vyhraje novější, co je jen v jednom, zůstane', () => {
    const ten = sTydnem(sTydnem(prazdny(), 'stoicky', { hotove: [1] }, '2026-10-26T10:00:00Z'), 'epikurejsky', { hotove: [2] }, '2026-10-20T10:00:00Z');
    const soubor = sTydnem(sTydnem(prazdny(), 'stoicky', { hotove: [1, 2, 3], veta: 'Ze souboru.' }, '2026-10-27T10:00:00Z'), 'epikurejsky', { hotove: [] }, '2026-10-19T10:00:00Z');
    const s = spojDeniky(ten, soubor);
    expect(s.tydny!.stoicky).toMatchObject({ hotove: [1, 2, 3], veta: 'Ze souboru.' });
    expect(s.tydny!.epikurejsky.hotove).toEqual([2]);
    expect(spojDeniky(prazdny(), soubor).tydny!.stoicky.hotove).toEqual([1, 2, 3]);
    expect(spojDeniky(ten, prazdny()).tydny!.stoicky.hotove).toEqual([1]);
    expect(spojDeniky(prazdny(), prazdny()).tydny).toBeUndefined();
  });

  it('spojení výzvy týdne: dřívější přijetí, poznámka z té strany, kde se měnila později, jinak ta, která je', () => {
    const v = (prijato: string, poznamka?: string, upraveno?: string) => ({ id: 'tyden-stoicky', nazev: 'Stoický týden', odkaz: '/tyden/stoicky/', prijato, ...(poznamka ? { poznamka } : {}), ...(upraveno ? { upraveno } : {}) });
    const d = (x: ReturnType<typeof v>): Denik => ({ ...prazdny(), vyzvy: [x] });
    let s = spojDeniky(d(v('2026-10-26', 'tady', '2026-10-27')), d(v('2026-10-20', 'v souboru', '2026-10-28')));
    expect(s.vyzvy).toHaveLength(1);
    expect(s.vyzvy[0]).toMatchObject({ prijato: '2026-10-20', poznamka: 'v souboru', upraveno: '2026-10-28' });
    s = spojDeniky(d(v('2026-10-26', 'tady')), d(v('2026-10-27')));
    expect(s.vyzvy[0]).toMatchObject({ prijato: '2026-10-26', poznamka: 'tady' });
    s = spojDeniky(d(v('2026-10-26')), d(v('2026-10-27', 'jen v souboru', '2026-10-27')));
    expect(s.vyzvy[0].poznamka).toBe('jen v souboru');
  });

  it('deník ze souboru s polem tydny projde rozborem; poškozené pole ho nerozbije', () => {
    const d = rozeberDenik(JSON.stringify({ ...prazdny(), tydny: { stoicky: { hotove: [1, 3], kdy: '2026-10-26' } } }))!;
    expect(d.tydny!.stoicky.hotove).toEqual([1, 3]);
    expect(rozeberDenik(JSON.stringify({ ...prazdny(), tydny: 'x' }))!.tydny).toBeUndefined();
  });
});
