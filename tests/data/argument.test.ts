// Logika bloku Slož argument (src/lib/argument.ts) a jeho schéma (src/lib/bloky-schema.ts › BlokArgument).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import {
  radkyArgumentu, nazevRadku, vRadku, volneKarty, poloz, vrat, jeSlozeno, vyhodnot, zpetnaArgumentu, hlaseniPolozeni, popisRadku,
  moznostiNapadeni, napadnutelne, zapisArgumentu, platnyStavArgumentu, radekKarty, otazkaZapisu, OTAZKA_NAPADENI, ZAVER,
} from '../../src/lib/argument';
import { BlokArgument, Blok } from '../../src/lib/bloky-schema';

const N = '\u00a0';
const ukazka = BlokArgument.parse(parse(readFileSync(new URL('../../src/content/bloky/dilna-sokrates-zemre.yaml', import.meta.url), 'utf8')));
const zaklad = {
  druh: 'argument' as const,
  obdobi: 2,
  otazka: 'Jak z nich složíš argument?',
  karty: [
    { id: 'a', text: 'Premisa A.', misto: 1, kdyzNapadnes: 'Na A.' },
    { id: 'z', text: 'Závěr Z.', misto: 'zaver' },
    { id: 'b', text: 'Premisa B.', misto: 2, kdyzNapadnes: 'Na B.', vZaveru: 'B do závěru nepatří, ptej se proč.' },
  ],
  skryty: { text: 'Skrytá S.', zpetna: 'Bez S to neplyne.', kdyzNapadnes: 'Na S.' },
  napadnout: { karta: 'skryty', proc: 'S je slabá.' },
  zpetna: 'Složeno. Co ten skok drží?',
  zadnou: 'Drží ti. Co by to změnilo?',
};
const blok = BlokArgument.parse(zaklad);

describe('Slož argument: řádky a přesuny', () => {
  it('řádky podle počtu premis, závěr poslední; názvy a pády', () => {
    expect(radkyArgumentu(blok)).toEqual(['1', '2', ZAVER]);
    expect(radkyArgumentu({ karty: [...blok.karty, { id: 'c', text: 'C.', misto: 3, kdyzNapadnes: 'x' }] })).toEqual(['1', '2', '3', ZAVER]);
    expect(nazevRadku('1')).toBe('1');
    expect(nazevRadku(ZAVER)).toBe('Závěr');
    expect(vRadku('2')).toBe(`v řádku${N}2`);
    expect(vRadku(ZAVER)).toBe('v závěru');
  });

  it('volné karty drží pořadí bloku, ne pořadí argumentu', () => {
    expect(volneKarty(blok, {}).map((k) => k.id)).toEqual(['a', 'z', 'b']);
    expect(volneKarty(blok, { '1': 'z' }).map((k) => k.id)).toEqual(['a', 'b']);
  });

  it('položení do prázdného řádku, přesun mezi řádky a výměna', () => {
    let r = poloz({}, 'a', '1');
    expect(r).toEqual({ rozlozeni: { '1': 'a' }, vymenena: null });
    // Z hromádky na obsazený řádek: původní karta jde zpátky mezi karty.
    r = poloz(r.rozlozeni, 'b', '1');
    expect(r).toEqual({ rozlozeni: { '1': 'b' }, vymenena: 'a' });
    expect(volneKarty(blok, r.rozlozeni).map((k) => k.id)).toEqual(['a', 'z']);
    // Z řádku na obsazený řádek: karty se prohodí.
    r = poloz({ '1': 'a', '2': 'b' }, 'a', '2');
    expect(r).toEqual({ rozlozeni: { '1': 'b', '2': 'a' }, vymenena: 'b' });
    // Z řádku na prázdný řádek: starý řádek se uvolní.
    r = poloz({ '1': 'a' }, 'a', ZAVER);
    expect(r).toEqual({ rozlozeni: { [ZAVER]: 'a' }, vymenena: null });
    // Na totéž místo: nic se nemění.
    expect(poloz({ '1': 'a' }, 'a', '1')).toEqual({ rozlozeni: { '1': 'a' }, vymenena: null });
    expect(vrat({ '1': 'a', '2': 'b' }, 'a')).toEqual({ '2': 'b' });
    expect(vrat({ '2': 'b' }, 'a')).toEqual({ '2': 'b' });
    expect(radekKarty({ '2': 'b' }, 'b')).toBe('2');
    expect(radekKarty({ '2': 'b' }, 'a')).toBeNull();
  });

  it('složeno teprve se všemi řádky obsazenými', () => {
    expect(jeSlozeno(blok, {})).toBe(false);
    expect(jeSlozeno(blok, { '1': 'a', '2': 'b' })).toBe(false);
    expect(jeSlozeno(blok, { '1': 'a', '2': 'b', [ZAVER]: 'z' })).toBe(true);
    expect(jeSlozeno(blok, { '1': 'a', '2': 'b', [ZAVER]: 'nic' })).toBe(false);
  });
});

describe('Slož argument: zpětná vazba podle toho, co student složil', () => {
  it('závěr na místě: zpětná vazba bloku; premisy v jiném pořadí nevadí a věta to řekne', () => {
    expect(vyhodnot(blok, { '1': 'a', '2': 'b', [ZAVER]: 'z' })).toEqual({ zaverNaMiste: true, vZaveru: blok.karty[1], kdeJeZaver: null, jinePoradi: false });
    const z = zpetnaArgumentu(blok, { '1': 'a', '2': 'b', [ZAVER]: 'z' });
    expect(z).toEqual({ titulek: 'Tvůj závěr: „Závěr Z“.', text: 'Složeno. Co ten skok drží?' });
    const jinak = zpetnaArgumentu(blok, { '1': 'b', '2': 'a', [ZAVER]: 'z' });
    expect(jinak.text).toBe('Složeno. Co ten skok drží?\n\nPremisy máš v jiném pořadí, než je napsal autor. Na tom nezáleží: závěr potřebuje všechny.');
  });

  it('premisa v závěru: obecná věta řekne, kde student skutečný závěr nechal, a ptá se dál', () => {
    const roz = { '1': 'z', '2': 'b', [ZAVER]: 'a' };
    expect(vyhodnot(blok, roz).kdeJeZaver).toBe('1');
    const z = zpetnaArgumentu(blok, roz);
    expect(z.titulek).toBe('Tvůj závěr: „Premisa A“.');
    expect(z.text).toBe(`Argument tuhle větu nedokazuje, vychází z ní. Větu, kterou ostatní karty podpírají, máš v řádku${N}1: „Závěr Z“. Přečti ji nahlas a za ni „protože“ s ostatními kartami. Dává to smysl?`);
    expect(z.text).not.toMatch(/správně|špatně|chyba/i);
  });

  it('premisa s vlastní větou pro závěr ji použije místo obecné', () => {
    expect(zpetnaArgumentu(blok, { '1': 'a', '2': 'z', [ZAVER]: 'b' }).text).toBe('B do závěru nepatří, ptej se proč.');
  });

  it('hlášení pro čtečky: položení i výměna; popis řádku', () => {
    expect(hlaseniPolozeni(blok, 'a', '1', null, { '1': 'a' })).toBe(`„Premisa A“ je v řádku${N}1.`);
    expect(hlaseniPolozeni(blok, 'b', '1', 'a', { '1': 'b' })).toBe(`„Premisa B“ je v řádku${N}1. „Premisa A“ je zpátky mezi kartami.`);
    expect(hlaseniPolozeni(blok, 'a', ZAVER, 'z', { [ZAVER]: 'a', '1': 'z' })).toBe(`„Premisa A“ je v závěru. „Závěr Z“ je v řádku${N}1.`);
    expect(popisRadku(blok, { '1': 'a' }, '1')).toBe('Řádek 1: „Premisa A“');
    expect(popisRadku(blok, {}, ZAVER)).toBe('Závěr: prázdný');
  });
});

describe('Slož argument: kterou premisu bys napadl', () => {
  it('možnosti: premisy v pořadí argumentu, skrytý předpoklad, žádnou; každá má zpětnou vazbu', () => {
    const m = moznostiNapadeni(blok);
    expect(m.map((x) => x.id)).toEqual(['a', 'b', 'skryty', 'zadnou']);
    expect(m.map((x) => x.stitek)).toEqual(['Premisa', 'Premisa', 'Skrytý předpoklad', '']);
    expect(m.every((x) => x.zpetna.length > 0)).toBe(true);
    expect(OTAZKA_NAPADENI).toBe('Kterou premisu bys napadl ty?');
    expect(otazkaZapisu(blok)).toBe('Jak z nich složíš argument? Kterou premisu bys napadl ty?');
  });

  it('místo k napadení: premisa i skrytý předpoklad', () => {
    expect(napadnutelne(blok)).toEqual({ id: 'skryty', stitek: 'Skrytý předpoklad', text: 'Skrytá S.', proc: 'S je slabá.' });
    const naB = BlokArgument.parse({ ...zaklad, napadnout: { karta: 'b', proc: 'B.' } });
    expect(napadnutelne(naB)).toEqual({ id: 'b', stitek: 'Premisa', text: 'Premisa B.', proc: 'B.' });
  });

  it('zápis do deníku: volba a nepovinný důvod', () => {
    expect(zapisArgumentu(blok, 'b')).toBe('Napadl bych premisu: „Premisa B“.');
    expect(zapisArgumentu(blok, 'skryty', '  minulost není budoucnost ')).toBe('Napadl bych skrytý předpoklad: „Skrytá S“. Proč: minulost není budoucnost');
    expect(zapisArgumentu(blok, 'zadnou')).toBe('Nenapadl bych žádnou premisu, argument mi drží.');
    expect(zapisArgumentu(blok, 'nic')).toBe('');
  });
});

describe('Slož argument: stav po obnovení', () => {
  it('platný stav projde celý', () => {
    const s = { rozlozeni: { '1': 'a', '2': 'b', [ZAVER]: 'z' }, zkontrolovano: true, napadnout: 'skryty', proc: 'Proto.', zapsano: true };
    expect(platnyStavArgumentu(s, blok)).toEqual(s);
  });
  it('neznámé řádky, karty a zdvojené karty se zahodí; kontrola jen se složeným argumentem', () => {
    const s = platnyStavArgumentu({ rozlozeni: { '1': 'a', '2': 'a', '7': 'b', [ZAVER]: 'nic' }, zkontrolovano: true, napadnout: 'a', zapsano: true }, blok);
    expect(s).toEqual({ rozlozeni: { '1': 'a' }, zkontrolovano: false, napadnout: null, proc: '', zapsano: false });
  });
  it('volba bez kontroly ani neznámá volba neplatí; zapsáno jen s volbou', () => {
    const roz = { '1': 'a', '2': 'b', [ZAVER]: 'z' };
    expect(platnyStavArgumentu({ rozlozeni: roz, zkontrolovano: false, napadnout: 'a' }, blok)?.napadnout).toBeNull();
    expect(platnyStavArgumentu({ rozlozeni: roz, zkontrolovano: true, napadnout: 'nic', zapsano: true }, blok)).toMatchObject({ napadnout: null, zapsano: false });
  });
  it('prázdný nebo cizí stav je null', () => {
    expect(platnyStavArgumentu(undefined, blok)).toBeNull();
    expect(platnyStavArgumentu('x', blok)).toBeNull();
    expect(platnyStavArgumentu({ rozlozeni: {} }, blok)).toBeNull();
  });
});

describe('Slož argument: schéma', () => {
  const chyba = (zmena: object) => BlokArgument.safeParse({ ...zaklad, ...zmena }).success;
  it('ukázka z dílny projde a nečeká na ověření; patří do sjednoceného schématu bloků', () => {
    expect(ukazka.kOvereni).toEqual([]);
    expect(Blok.parse({ ...zaklad }).druh).toBe('argument');
    expect(radkyArgumentu(ukazka)).toEqual(['1', '2', ZAVER]);
  });
  it('právě jeden závěr a premisy 1, 2 (a 3) bez mezery', () => {
    expect(chyba({ karty: zaklad.karty.map((k) => (k.id === 'b' ? { ...k, misto: 'zaver', kdyzNapadnes: undefined, vZaveru: undefined } : k)) })).toBe(false);
    expect(chyba({ karty: zaklad.karty.map((k) => (k.id === 'b' ? { ...k, misto: 3 } : k)) })).toBe(false);
    expect(chyba({ karty: zaklad.karty.map((k) => (k.id === 'b' ? { ...k, misto: 1 } : k)) })).toBe(false);
  });
  it('premisa potřebuje kdyzNapadnes, závěr ho mít nesmí; vyhrazená a opakovaná id', () => {
    expect(chyba({ karty: zaklad.karty.map((k) => (k.id === 'a' ? { ...k, kdyzNapadnes: undefined } : k)) })).toBe(false);
    expect(chyba({ karty: zaklad.karty.map((k) => (k.id === 'z' ? { ...k, kdyzNapadnes: 'x' } : k)) })).toBe(false);
    expect(chyba({ karty: zaklad.karty.map((k) => (k.id === 'a' ? { ...k, id: 'skryty' } : k)), napadnout: { karta: 'skryty', proc: 'x' } })).toBe(false);
    expect(chyba({ karty: zaklad.karty.map((k) => (k.id === 'a' ? { ...k, id: 'b' } : k)) })).toBe(false);
  });
  it('místo k napadení je premisa nebo skrytý předpoklad, ne závěr', () => {
    expect(chyba({ napadnout: { karta: 'z', proc: 'x' } })).toBe(false);
    expect(chyba({ napadnout: { karta: 'nic', proc: 'x' } })).toBe(false);
    expect(chyba({ napadnout: { karta: 'a', proc: 'x' } })).toBe(true);
  });
  it('tři až čtyři karty', () => {
    expect(chyba({ karty: zaklad.karty.slice(0, 2) })).toBe(false);
  });
});
