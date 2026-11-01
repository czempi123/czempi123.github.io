// Stránky období, směrů, pokusů, úvodů a tradic (větev antika-doplnky, K1): schémata obsahu, odkazy z pásu období
// a štítků směrů jen na stránky, které jsou, rodokmen z dat, citát bez osoby a zastavení v katalogu hodin.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { parse } from 'yaml';
import { data, osoby } from '../../src/lib/data';
import { Citat } from '../../src/lib/schema';
import { ObdobiStranka, Smer, Pokus, Uvod, Nabozenstvi } from '../../src/lib/stranky-schema';
import { adresaObdobi, adresaSmeru, strankyObdobi, rodokmenSmeru, oddilyObdobi, ODDILY_OBDOBI, type StrankyAtlasu } from '../../src/lib/stranky';
import { katalogZastaveni, ID_ZASTAVENI, type StrankaKatalogu } from '../../src/lib/hodiny';
import { stitekDruhu, druhStranky, kdeStoji, DRUHY_VYBERU } from '../../src/lib/skladatel';

// Obsah stejně jako kolekce Astra: frontmatter jako data, zbytek jako body.
const C = 'src/content';
const soubor = (cesta: string) => {
  const t = readFileSync(cesta, 'utf8');
  const [, fm, ...zbytek] = t.split(/^---$/m);
  return { data: parse(fm), body: zbytek.join('---') };
};
const stem = (f: string) => f.replace(/\.mdx?$/, '');
const obsahove = (slozka: string) => readdirSync(`${C}/${slozka}`).filter((f) => /\.mdx?$/.test(f) && !f.startsWith('_'));
const kolekce = (slozka: string) => obsahove(slozka).map((f) => ({ id: stem(f), soubor: f, ...soubor(`${C}/${slozka}/${f}`) }));

const obdobi = kolekce('obdobi');
const smery = kolekce('smery');
const pokusy = kolekce('pokusy');
const uvody = kolekce('uvody');
const tradice = kolekce('nabozenstvi');

const o = strankyObdobi(obdobi, data.obdobi);
const stranky: StrankyAtlasu = {
  obdobi: o.mapa,
  smery: new Set(smery.filter((s) => s.data.perex).map((s) => s.id)),
  pokusy: new Set(pokusy.map((p) => p.id)),
  nabozenstvi: new Set(tradice.map((t) => t.id)),
};

describe('schémata nových stránek', () => {
  it('každý soubor období, směru, pokusu, úvodu a tradice odpovídá svému schématu', () => {
    const chyby: string[] = [];
    const over = (sada: typeof obdobi, schema: { safeParse: (x: unknown) => { success: boolean; error?: { message: string } } }, slozka: string) => {
      for (const z of sada) {
        const r = schema.safeParse(z.data);
        if (!r.success) chyby.push(`${slozka}/${z.soubor}: ${r.error?.message}`);
      }
    };
    over(obdobi, ObdobiStranka, 'obdobi');
    over(smery, Smer, 'smery');
    over(pokusy, Pokus, 'pokusy');
    over(uvody, Uvod, 'uvody');
    over(tradice, Nabozenstvi, 'nabozenstvi');
    expect(chyby).toEqual([]);
  });

  it('soubor období se jmenuje jako slug v obdobi.yaml a sedí na číslo období', () => {
    expect(o.chyby).toEqual([]);
    expect(strankyObdobi([{ id: 'stredovek', data: { obdobi: 2 } }], data.obdobi).chyby).toHaveLength(1);
    expect(strankyObdobi([{ id: 'neni', data: { obdobi: 1 } }], data.obdobi).chyby).toHaveLength(1);
  });

  it('směr má stránku, právě když má perex i text', () => {
    for (const s of smery) expect(!!s.data.perex, s.id).toBe(!!s.body.trim());
    expect([...stranky.smery].sort()).toEqual(['akademie', 'epikureismus', 'kynismus', 'stoicismus']);
  });

  it('citát má právě jedno z polí osoba, tradice a bezOsoby', () => {
    const zaklad = { id: 'x', autor: 'A', dilo: 'D', misto: '1', cesky: 'C', preklad: { druh: 'vlastni', podle: 'p' }, zdroj: 'cep' };
    expect(Citat.safeParse({ ...zaklad, osoba: 'platon' }).success).toBe(true);
    expect(Citat.safeParse({ ...zaklad, tradice: 'judaismus' }).success).toBe(true);
    expect(Citat.safeParse({ ...zaklad, bezOsoby: true }).success).toBe(true);
    expect(Citat.safeParse(zaklad).success).toBe(false);
    expect(Citat.safeParse({ ...zaklad, osoba: 'platon', tradice: 'judaismus' }).success).toBe(false);
  });

  it('citát s tradicí odkazuje na tradici, která má soubor', () => {
    const sTradici = data.zdroje.citaty.filter((c) => c.tradice);
    expect(sTradici.length).toBeGreaterThan(0);
    for (const c of sTradici) expect(stranky.nabozenstvi.has(c.tradice!), c.id).toBe(true);
  });

  it('místa tradice jsou v mista.yaml a Sinaj mezi nimi není', () => {
    const mista = new Set(data.mista.map((m) => m.id));
    for (const t of tradice) for (const m of t.data.mista ?? []) expect(mista.has(m.misto), `${t.id}: ${m.misto}`).toBe(true);
    expect(mista.has('sinaj')).toBe(false);
    expect(data.mista.find((m) => m.id === 'jeruzalem')?.dnes).toBe('Jeruzalém');
  });
});

describe('odkazy na období a směry jen na stránky, které jsou', () => {
  it('pás období a drobečky vedou na stránku období, když ji období má, jinak do Lidí a směrů', () => {
    for (const ob of data.obdobi) {
      const a = adresaObdobi(ob.id, stranky);
      if (stranky.obdobi.has(ob.id)) {
        expect(a).toBe(`/obdobi/${ob.slug}/`);
        expect(existsSync(`${C}/obdobi/${ob.slug}.mdx`)).toBe(true);
      } else expect(a).toBe(`/lide/#obdobi-${ob.id}`);
    }
    expect(adresaObdobi(1, stranky)).toBe('/obdobi/pocatky-a-klasicke-recko/');
    expect(adresaObdobi(3, stranky)).toBe('/lide/#obdobi-3');
  });

  it('štítek směru je odkaz jen u směru se stránkou', () => {
    for (const s of smery) {
      const a = adresaSmeru(s.id, stranky);
      expect(a, s.id).toBe(s.data.perex ? `/smer/${s.id}/` : undefined);
    }
    for (const id of new Set(data.lide.flatMap((l) => l.smery))) {
      if (!stranky.smery.has(id)) expect(adresaSmeru(id, stranky)).toBeUndefined();
    }
  });
});

describe('rodokmen směru z vztahy.yaml', () => {
  const stoa = rodokmenSmeru('stoicismus', data.lide, data.vztahy);
  const ids = stoa.map((c) => c.osoba.id);

  it('má všechny členy směru a k nim učitele zvenku', () => {
    for (const l of data.lide.filter((x) => x.smery.includes('stoicismus'))) expect(ids).toContain(l.id);
    expect(stoa.find((c) => c.osoba.id === 'zenon-z-kitia')?.ucitele.map((u) => u.id)).toContain('krates');
    expect(stoa.find((c) => c.osoba.id === 'krates')?.clen).toBe(false);
  });

  it('vliv přes texty bere jen uvnitř směru a polemiky vůbec', () => {
    for (const c of stoa) for (const t of c.cetl) expect(data.lide.find((l) => l.id === t.id)?.smery).toContain('stoicismus');
    expect(stoa.find((c) => c.osoba.id === 'marcus-aurelius')?.cetl.map((t) => t.id)).toContain('epiktetos');
    expect(ids).not.toContain('epikuros');
    expect(ids).not.toContain('karneades');
  });

  it('každý řádek stojí na vztahu z dat a lidé jdou podle začátku života', () => {
    for (const c of stoa) {
      for (const u of c.ucitele) expect(data.vztahy.some((v) => v.typ === 'ucitel' && v.od === u.id && v.k === c.osoba.id)).toBe(true);
      for (const t of c.cetl) expect(data.vztahy.some((v) => v.typ === 'vliv-textem' && v.od === t.id && v.k === c.osoba.id)).toBe(true);
    }
    expect(ids.indexOf('zenon-z-kitia')).toBeLessThan(ids.indexOf('chrysippos'));
    expect(ids.indexOf('epiktetos')).toBeLessThan(ids.indexOf('marcus-aurelius'));
  });

  it('člen bez vztahu učitel a žák v rodokmenu zůstane (Karneadés v Akademii)', () => {
    const akademie = rodokmenSmeru('akademie', data.lide, data.vztahy);
    for (const l of data.lide.filter((x) => x.smery.includes('akademie'))) expect(akademie.map((c) => c.osoba.id)).toContain(l.id);
  });

  it('tradovaný vztah nese příznak (Antisthenés a Diogenés)', () => {
    const kynici = rodokmenSmeru('kynismus', data.lide, data.vztahy);
    expect(kynici.find((c) => c.osoba.id === 'diogenes')?.ucitele).toContainEqual({ id: 'antisthenes', tradovany: true });
  });
});

describe('oddíly stránky období', () => {
  it('prázdný oddíl se neukáže a pořadí je pevné', () => {
    const vse = oddilyObdobi({ osa: 1, otazky: 1, lide: 1, cesty: 1, mapa: 1 });
    expect(vse.map((x) => x.klic)).toEqual(ODDILY_OBDOBI.map((x) => x.klic));
    expect(oddilyObdobi({ osa: 0, otazky: 2, lide: 0, cesty: 1, mapa: 0 }).map((x) => x.klic)).toEqual(['otazky', 'cesty']);
  });
});

describe('zastavení nových stránek v katalogu hodin', () => {
  const vstupStranky: StrankaKatalogu[] = [
    ...smery.filter((s) => s.data.perex).map((s) => ({ id: `smer-${s.id}`, typ: 'smer' as const, nazev: s.data.nazev, stranka: `/smer/${s.id}/`, obdobi: s.data.obdobi[0], body: s.body })),
    ...pokusy.map((p) => ({ id: `pokus-${p.id}`, typ: 'pokus' as const, nazev: p.data.nazev, stranka: `/pokus/${p.id}/`, obdobi: p.data.obdobi, body: p.body,
      zaTextem: [{ kotva: 'co-rekli', nazev: 'Co řekli filozofové' }] })),
    ...obdobi.map((x) => ({ id: `obdobi-${x.id}`, typ: 'obdobi' as const, nazev: x.id, stranka: `/obdobi/${x.id}/`, obdobi: x.data.obdobi, body: x.body,
      predTextem: [{ kotva: 'uvod', nazev: 'Úvodní scéna' }], zaTextem: ODDILY_OBDOBI.map((d) => ({ kotva: d.kotva, nazev: d.nazev })) })),
    ...uvody.map((u) => ({ id: u.id, typ: 'uvod' as const, nazev: u.data.nazev, stranka: u.id === 'co-je-nabozenstvi' ? '/nabozenstvi/' : `/${u.id}/`, obdobi: null, body: u.body })),
    ...tradice.map((t) => ({ id: `nabozenstvi-${t.id}`, typ: 'nabozenstvi' as const, nazev: t.data.nazev, stranka: `/nabozenstvi/${t.id}/`, obdobi: null, body: t.body })),
  ];
  const katalog = katalogZastaveni({
    cesty: readdirSync(`${C}/cesty`).filter((f) => f.endsWith('.mdx')).map((f) => ({ id: stem(f), ...soubor(`${C}/cesty/${f}`) })),
    kroky: readdirSync(`${C}/cesty`).filter((f) => !f.includes('.')).flatMap((s) =>
      readdirSync(`${C}/cesty/${s}`).filter((f) => /^\d.*\.mdx$/.test(f)).map((f) => soubor(`${C}/cesty/${s}/${f}`))),
    osobnosti: obsahove('osobnosti').map((f) => ({ id: stem(f), ...soubor(`${C}/osobnosti/${f}`) })),
    otazky: obsahove('otazky').map((f) => ({ id: stem(f), ...soubor(`${C}/otazky/${f}`) })),
    bloky: readdirSync(`${C}/bloky`).filter((f) => f.endsWith('.yaml')).map((f) => ({ id: f.replace(/\.yaml$/, ''), data: parse(readFileSync(`${C}/bloky/${f}`, 'utf8')) })),
    stranky: vstupStranky,
    osoby,
  });
  const z = (id: string) => katalog.find((x) => x.id === id);

  it('každá stránka je celá stránka druhu „stranka“ s platným id', () => {
    for (const st of vstupStranky) {
      const koren = z(`s:${st.id}`);
      expect(koren, st.id).toMatchObject({ druh: 'stranka', typStranky: st.typ, rodic: null, adresa: st.stranka });
      expect(ID_ZASTAVENI.test(`s:${st.id}`)).toBe(true);
      expect(stitekDruhu(koren!)).toBe('Celá stránka');
      expect(kdeStoji(koren!)).toBe(st.nazev);
    }
    expect(druhStranky(z('s:smer-stoicismus')!)).toBe('Směr');
    expect(druhStranky(z('s:pokus-gyguv-prsten')!)).toBe('Myšlenkový pokus');
    expect(druhStranky(z('s:co-je-filozofie')!)).toBe('Na začátek');
    expect(DRUHY_VYBERU.find((d) => d.id === 'stranky')!.druhy).toContain('stranka');
  });

  it('směr má oddíly z textu: založení, myšlenky, rodokmen, spor a Zkus to žít', () => {
    const oddily = katalog.filter((x) => x.rodic === 's:smer-stoicismus' && x.druh === 'oddil').map((x) => x.kotva);
    expect(oddily).toEqual(['zalozeni', 'myslenky', 'rodokmen', 'spor', 'zkus-to-zit']);
    expect(stitekDruhu(z('s:smer-stoicismus/zalozeni')!)).toBe('Oddíl');
  });

  it('období má úvodní scénu a oddíly šablony v pořadí stránky', () => {
    const deti = katalog.filter((x) => x.rodic === 's:obdobi-pocatky-a-klasicke-recko').map((x) => x.kotva);
    expect(deti).toEqual(['uvod', ...ODDILY_OBDOBI.map((d) => d.kotva)]);
  });

  it('blok z jiné stránky zastavením znovu není: Gýgův prsten zůstává u Platóna', () => {
    expect(katalog.filter((x) => x.id === 'b:platon-gyguv-prsten')).toHaveLength(1);
    expect(z('b:platon-gyguv-prsten')!.stranka).toBe('/osobnost/platon/');
    expect(z('b:pokus-gyges-predem')).toMatchObject({ stranka: '/pokus/gyguv-prsten/', druh: 'blok', typ: 'Volba' });
    expect(katalog.filter((x) => x.id === 'b:zrcadlo-casu')).toHaveLength(1);
    expect(z('s:pokus-zrcadlo-casu/co-rekli')).toBeTruthy();
  });

  it('úvody a tradice mají bloky a oddíly z textu', () => {
    expect(z('b:co-je-filozofie-pet-odpovedi')).toMatchObject({ stranka: '/co-je-filozofie/', typ: 'Odkryj' });
    expect(z('p:thales-studna')).toMatchObject({ stranka: '/co-je-filozofie/' });
    expect(z('b:nabozenstvi-co-z-toho')).toMatchObject({ stranka: '/nabozenstvi/', typ: 'Roztrid' });
    expect(z('s:co-je-nabozenstvi/tradice')).toBeTruthy();
    expect(z('s:nabozenstvi-judaismus/mista')).toBeTruthy();
  });
});
