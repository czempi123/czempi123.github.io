// Česká sazba: nezlomitelná mezera za jednopísmennými předložkami a spojkami (src/lib/sazba.js).
import { describe, it, expect } from 'vitest';
import { nezlomitelne, sazbaMdast } from '../../src/lib/sazba.js';
import { radek, odstavce } from '../../src/lib/bloky';

const N = ' ';

describe('nezlomitelne', () => {
  it('váže předložky a spojky k dalšímu slovu', () => {
    expect(nezlomitelne('četl křivky o penězích')).toBe(`četl křivky o${N}penězích`);
    expect(nezlomitelne('Kynik i Epikúros jedli chléb a pili vodu.')).toBe(`Kynik i${N}Epikúros jedli chléb a${N}pili vodu.`);
    expect(nezlomitelne('nic z toho, k tomu, s přáteli, u stolu, v zahradě')).toBe(`nic z${N}toho, k${N}tomu, s${N}přáteli, u${N}stolu, v${N}zahradě`);
  });
  it('i na začátku věty a textu, po závorce a uvozovce', () => {
    expect(nezlomitelne('V jednom z nich prosí:')).toBe(`V${N}jednom z${N}nich prosí:`);
    expect(nezlomitelne('Stačí málo. A přece chce víc. U většiny lidí')).toBe(`Stačí málo. A${N}přece chce víc. U${N}většiny lidí`);
    expect(nezlomitelne('(v létě) „s holí“')).toBe(`(v${N}létě) „s${N}holí“`);
  });
  it('dvě jednopísmenná slova za sebou', () => {
    expect(nezlomitelne('hůl a v zimě plášť')).toBe(`hůl a${N}v${N}zimě plášť`);
    expect(nezlomitelne('i s mošnou')).toBe(`i${N}s${N}mošnou`);
  });
  it('nechá být písmena uvnitř slov, zkratky, čísla knih a už nezlomitelné mezery', () => {
    expect(nezlomitelne('dva a půl')).toBe(`dva a${N}půl`);
    expect(nezlomitelne('Diogenés Laertios X, 11')).toBe('Diogenés Laertios X, 11');
    expect(nezlomitelne('Etika Nikomachova I, 7')).toBe('Etika Nikomachova I, 7');
    expect(nezlomitelne('R. D. Hicks')).toBe('R. D. Hicks');
    expect(nezlomitelne(`306${N}př.${N}n.${N}l.`)).toBe(`306${N}př.${N}n.${N}l.`);
    expect(nezlomitelne('slova')).toBe('slova');
    expect(nezlomitelne('')).toBe('');
    expect(nezlomitelne('končí na a')).toBe('končí na a');
  });
  it('texty bloků ji dostanou přes radek a odstavce', () => {
    expect(radek('Do kterého koše *která* patří a proč?')).toBe(`Do kterého koše <em>která</em> patří a${N}proč?`);
    expect(odstavce('Kdo vydrží, dokáže, že nic z\ntoho nepotřebuje.')).toEqual([`Kdo vydrží, dokáže, že nic z${N}toho nepotřebuje.`]);
  });
});

describe('sazbaMdast (plugin pro Markdown a MDX)', () => {
  // Plugin používá z uzlu jen value a z kontextu parent, indexOf a setProperty; test jim podává jen tyhle části,
  // proto se návštěvník volá jako funkce s volnými parametry (typy pluginu jsou z balíčku satteri).
  const text = sazbaMdast.text as unknown as (uzel: unknown, ctx: unknown) => void;
  const projdi = (value: string, sourozencu = 1, index = 0) => {
    const uzel = { type: 'text', value };
    let vysledek = value;
    text(uzel, {
      parent: () => ({ children: Array.from({ length: sourozencu }) }),
      indexOf: () => index,
      setProperty: (_n: unknown, _klic: string, hodnota: string) => { vysledek = hodnota; },
    });
    return vysledek;
  };
  it('upraví textový uzel', () => {
    expect(projdi('Učil v zahradě, kterou koupil v Athénách.')).toBe(`Učil v${N}zahradě, kterou koupil v${N}Athénách.`);
  });
  it('předložku na konci textu přiváže, jen když za ní následuje další uzel', () => {
    expect(projdi('Jeho škole se v ', 3, 0)).toBe(`Jeho škole se v${N}`);
    expect(projdi('Jeho škole se v ', 1, 0)).toBe('Jeho škole se v ');
  });
  it('text beze změny nepřepisuje', () => {
    let zapsano = false;
    text({ value: 'Slast má strop.' }, { parent: () => undefined, indexOf: () => undefined, setProperty: () => { zapsano = true; } });
    expect(zapsano).toBe(false);
  });
});
