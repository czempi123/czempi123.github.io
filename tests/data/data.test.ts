// Kontroly dat: schéma, existující odkazy, žádný rok nula, narození před úmrtím,
// učitel starší než žák, licence u každého obrázku, atribut u každého profilu a portrétu.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import {
  nactiData, kontrolaOdkazu, kontrolaCasu, kontrolaLicenci, kontrolaAtributu, type SurovaData,
} from '../../src/lib/kontroly';
import { cekajiciAtributy } from '../../src/lib/cekajici';
import { rozdilLet, vek, zivot } from '../../src/lib/casy';

const koren = join(import.meta.dirname, '../..');
const cti = (s: string) => readFileSync(join(koren, 'src/data', s), 'utf8');
const surova: SurovaData = {
  lide: cti('lide.yaml'), mista: cti('mista.yaml'), vztahy: cti('vztahy.yaml'),
  udalosti: cti('udalosti.yaml'), obdobi: cti('obdobi.yaml'), zdroje: cti('zdroje.yaml'), krajiny: cti('krajiny.yaml'),
};
const { data, chyby: chybySchematu } = nactiData(surova);
const smery = readdirSync(join(koren, 'src/content/smery')).filter((f) => /^[^_].*\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ''));
const souboryObrazku = data.zdroje.obrazky.map((o) => o.soubor).filter((s) => existsSync(join(koren, 'public', s)));

describe('data atlasu', () => {
  it('odpovídají schématu', () => expect(chybySchematu).toEqual([]));
  it('odkazují jen na existující osoby, místa, prameny, směry a obrázky', () =>
    expect(kontrolaOdkazu(data, { smery, souboryObrazku })).toEqual([]));
  it('nemají rok nula, narození je před úmrtím, pobyty leží uvnitř života a učitel je starší než žák', () =>
    expect(kontrolaCasu(data)).toEqual([]));
  it('mají licenci u každého obrázku', () => expect(kontrolaLicenci(data)).toEqual([]));
  it('mají atribut u každého profilu a portrétu (kromě návrhů čekajících na schválení)', () => {
    const { chyby, cekaji } = kontrolaAtributu(data, cekajiciAtributy);
    expect(chyby).toEqual([]);
    if (cekaji.length) console.info(`Atribut čeká na schválení (docs/podklady/atributy.md): ${cekaji.join(', ')}`);
  });
  it('mají osm období s navazujícími barvami a ornamenty', () => {
    expect(data.obdobi.map((o) => o.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    data.obdobi.forEach((o, i) => {
      expect(o.barva).toBe(`--p-${i + 1}`);
      expect(o.ornament.index).toBe(i);
    });
  });
});

describe('osobnosti v MDX', () => {
  const slozka = join(koren, 'src/content/osobnosti');
  const soubory = readdirSync(slozka).filter((f) => f.endsWith('.mdx'));
  it.each(soubory)('%s odkazuje na existující osobu, citát a jen hotové kapitoly mají text', (soubor) => {
    const text = readFileSync(join(slozka, soubor), 'utf8');
    const fm = parse(text.split('---')[1]);
    expect(data.lide.map((o) => o.id)).toContain(fm.osoba);
    if (fm.citat) expect(data.zdroje.citaty.map((c) => c.id)).toContain(fm.citat);
    for (const m of text.matchAll(/<Citat id="([^"]+)"/g)) expect(data.zdroje.citaty.map((c) => c.id)).toContain(m[1]);
    for (const m of text.matchAll(/osoba="([^"]+)"/g)) expect(data.lide.map((o) => o.id)).toContain(m[1]);
  });
});

describe('kontroly samy odhalí chyby', () => {
  const s = (lide: string, vztahy = '[]', zdroje?: string): SurovaData => ({
    ...surova, lide, vztahy, zdroje: zdroje ?? surova.zdroje,
  });
  const osoba = (id: string, n: number, z: number, extra = '') =>
    `- { id: ${id}, jmeno: Xaver, narozen: { rok: ${n} }, zemrel: { rok: ${z} }, obdobi: 1, hloubka: medailonek, kdo: Někdo z testu atlasu., proc: Kvůli testu atlasu., zdroje: [sep-socrates]${extra} }\n`;

  it('rok nula', () => expect(nactiData(s(osoba('a', 0, 10))).chyby.join()).toMatch(/Rok nula/));
  it('úmrtí před narozením', () => expect(kontrolaCasu(nactiData(s(osoba('a', -300, -400))).data).join()).toMatch(/před úmrtím/));
  it('mladší učitel', () => {
    const d = nactiData(s(osoba('a', -300, -250) + osoba('b', -350, -280), '- { od: a, k: b, typ: ucitel, zdroj: sep-socrates }')).data;
    expect(kontrolaCasu(d).join()).toMatch(/starší než žák/);
  });
  it('neexistující osoba a místo', () => {
    const d = nactiData(s(osoba('a', -300, -250, ', mista: [{ misto: atlantida, role: pobyt, zdroj: sep-socrates }]'), '- { od: a, k: nikdo, typ: znali-se, zdroj: sep-socrates }')).data;
    const ch = kontrolaOdkazu(d).join();
    expect(ch).toMatch(/atlantida/);
    expect(ch).toMatch(/nikdo/);
  });
  it('obrázek bez licence', () => {
    // Funguje s prázdným seznamem obrázků i se seznamem, který už obrázky má.
    const z = surova.zdroje.replace(/^obrazky:( \[\])?/m, 'obrazky:\n  - { id: busta, soubor: x.jpg, popisek: Busta, autor: X, licence: "", url: "https://example.org" }');
    expect(nactiData(s(surova.lide, surova.vztahy, z)).chyby.join()).toMatch(/licence/);
  });
  it('profil bez atributu', () => {
    const d = nactiData(s(osoba('a', -300, -250).replace('medailonek', 'profil'))).data;
    expect(kontrolaAtributu(d).chyby.join()).toMatch(/chybí atribut/);
  });
});

describe('letopočty', () => {
  it('počítají přes přelom letopočtu bez roku nula', () => {
    expect(rozdilLet(-347, 121)).toBe(467);
    expect(rozdilLet(-1, 1)).toBe(1);
    expect(vek(-427, -360)).toBe(67);
    expect(vek(-1, 65)).toBe(65);
  });
  it('píší se česky s nezlomitelnými mezerami', () => {
    expect(zivot({ narozen: { rok: -469 }, zemrel: { rok: -399 } })).toBe('469–399 př. n. l.');
    expect(zivot({ narozen: { rok: 55, priblizne: true }, zemrel: { rok: 135, priblizne: true } })).toBe('asi 55–135 n. l.');
    expect(zivot({ narozen: { rok: -1, priblizne: true }, zemrel: { rok: 65 } })).toBe('asi 1 př. n. l. – 65 n. l.');
  });
});
