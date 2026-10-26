// Příprava hodiny: katalog zastavení z obsahu a dat, adresa hodiny, neznámé zastavení a „Doma projdi“.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { osoby } from '../../src/lib/data';
import {
  katalogZastaveni, znackyMdx, adresaHodiny, hodinaZAdresy, hodinaProStudenty, hodinaZeSouboru, najdiZastaveni, domaProjdi,
  ID_ZASTAVENI, NENI_V_ATLASU, type VstupKatalogu, type UlozenaHodina,
} from '../../src/lib/hodiny';

// Obsah stejně jako kolekce Astra (src/content.config.ts): frontmatter jako data, zbytek jako body.
const C = 'src/content';
const soubor = (cesta: string) => {
  const t = readFileSync(cesta, 'utf8');
  const [, fm, ...zbytek] = t.split(/^---$/m);
  return { data: parse(fm), body: zbytek.join('---') };
};
const stem = (f: string) => f.replace(/\.mdx?$/, '');
const obsahove = (slozka: string) => readdirSync(`${C}/${slozka}`).filter((f) => /\.mdx?$/.test(f) && !f.startsWith('_'));
const slugyCest = obsahove('cesty').map(stem);

const vstup: VstupKatalogu = {
  cesty: slugyCest.map((id) => ({ id, ...soubor(`${C}/cesty/${id}.mdx`) })),
  kroky: slugyCest.flatMap((s) => readdirSync(`${C}/cesty/${s}`).filter((f) => /^\d.*\.mdx$/.test(f)).map((f) => soubor(`${C}/cesty/${s}/${f}`))),
  osobnosti: obsahove('osobnosti').map((f) => ({ id: stem(f), ...soubor(`${C}/osobnosti/${f}`) })),
  otazky: obsahove('otazky').map((f) => ({ id: stem(f), ...soubor(`${C}/otazky/${f}`) })),
  bloky: readdirSync(`${C}/bloky`).filter((f) => f.endsWith('.yaml')).map((f) => ({ id: f.replace(/\.yaml$/, ''), data: parse(readFileSync(`${C}/bloky/${f}`, 'utf8')) })),
  tydny: readdirSync(`${C}/tydny`).filter((f) => f.endsWith('.yaml')).map((f) => ({ id: f.replace(/\.yaml$/, ''), data: parse(readFileSync(`${C}/tydny/${f}`, 'utf8')) })),
  osoby,
};
const katalog = katalogZastaveni(vstup);
const z = (id: string) => katalog.find((x) => x.id === id)!;

describe('katalog zastavení z obsahu a dat', () => {
  it('týden cvičení je jedno zastavení celé stránky (t:stoicky), bez dnů a bez rodiče', () => {
    expect(z('t:stoicky')).toMatchObject({
      druh: 'tyden', nazev: 'Stoický týden', kde: 'Stoický týden', stranka: '/tyden/stoicky/', adresa: '/tyden/stoicky/', kotva: null, obdobi: 2, rodic: null,
    });
    expect(katalog.filter((x) => x.stranka === '/tyden/stoicky/')).toHaveLength(1);
    expect(ID_ZASTAVENI.test('t:stoicky')).toBe(true);
    // Starší vstup bez týdnů katalog složí taky.
    expect(katalogZastaveni({ ...vstup, tydny: undefined }).some((x) => x.druh === 'tyden')).toBe(false);
  });

  it('každá cesta má přehled a tolik kroků, kolik má souborů', () => {
    for (const s of slugyCest) {
      const pocet = readdirSync(`${C}/cesty/${s}`).filter((f) => /^\d.*\.mdx$/.test(f)).length;
      expect(z(`k:${s}`).druh).toBe('cesta');
      expect(katalog.filter((x) => x.druh === 'krok' && x.cesta === s).map((x) => x.krok)).toEqual(Array.from({ length: pocet }, (_, i) => i + 1));
    }
    expect(katalog.filter((x) => x.druh === 'krok' && x.cesta === 'kdy-mam-dobry-duvod-verit')).toHaveLength(7);
    expect(katalog.filter((x) => x.druh === 'krok' && x.cesta === 'proc-se-bat-smrti')).toHaveLength(9);
  });

  it('krok: název z frontmatteru, adresa stránky, bloky v kroku mají krok za rodiče', () => {
    expect(z('k:kdy-mam-dobry-duvod-verit/3')).toMatchObject({
      druh: 'krok', nazev: 'Politik, básníci, řemeslníci', adresa: '/cesta/kdy-mam-dobry-duvod-verit/3/', kotva: null, obdobi: 1,
    });
    expect(z('b:cesta1-jak-zjistit')).toMatchObject({
      druh: 'blok', typ: 'Volba', nazev: 'Co uděláš, abys zjistil, jestli má věštírna pravdu?',
      adresa: '/cesta/kdy-mam-dobry-duvod-verit/2/#cesta1-jak-zjistit', rodic: 'k:kdy-mam-dobry-duvod-verit/2', krok: 2, poradi: 1,
    });
    // Příběh bez značek kurzívy, kresba s názvem z NAZVY_KRESEB, závěr cesty s otázkou z MDX.
    expect(z('p:odpoved-z-delf').nazev).toBe('Nikdo není moudřejší.');
    expect(z('b:lod-po-prknech')).toMatchObject({ typ: 'Lod', nazev: 'Loď po prknech' });
    expect(z('b:cesta1-moje-pravidlo')).toMatchObject({ typ: 'ZaverCesty', rodic: 'k:kdy-mam-dobry-duvod-verit/7' });
  });

  it('Sókratés: kapitoly z frontmatteru v pořadí, oddíly a bloky v kapitolách', () => {
    const kapitoly = katalog.filter((x) => x.druh === 'kapitola' && x.osoba === 'sokrates');
    expect(kapitoly.map((x) => [x.cislo, x.kotva, x.nazev])).toEqual([
      ['01', 'delfy', 'Věštba z Delf'],
      ['02', 'muz-z-agory', 'Muž z agory'],
      ['03', 'ustup-od-delia', 'Ústup od Délia'],
      ['04', 'soud', 'Soud'],
      ['05', 'posledni-den', 'Poslední den'],
    ]);
    expect(z('o:sokrates/soud').adresa).toBe('/osobnost/sokrates/#soud');
    expect(z('o:sokrates')).toMatchObject({ druh: 'profil', nazev: 'Sókratés', kotva: null, obdobi: 1 });
    expect(z('o:sokrates/myslenky')).toMatchObject({ druh: 'oddil', nazev: 'Dvě velké myšlenky' });
    expect(z('o:sokrates/zkus-to-zit').nazev).toBe('Zkus to žít: Jeden sokratovský rozhovor');
    expect(z('o:sokrates/doba-a-lide').nazev).toBe('Doba a lidé');
    expect(z('b:sokrates-navrh-trestu').rodic).toBe('o:sokrates/soud');
    expect(z('b:utek-z-vezeni').rodic).toBe('o:sokrates/posledni-den');
    // Kdo žil dřív? skládá id i otázku stejně jako blok.
    expect(z('b:kdo-sokrates-platon-vzdalenost')).toMatchObject({ nazev: 'Jak daleko od sebe žili Sókratés a Platón?', rodic: 'o:sokrates/doba-a-lide' });
    // Pořadí na stránce roste tak, jak části za sebou stojí.
    const naStrance = katalog.filter((x) => x.stranka === '/osobnost/sokrates/').map((x) => x.poradi);
    expect(naStrance).toEqual([...naStrance].sort((a, b) => a - b));
  });

  it('blok nese nadtitulek, jak stojí na stránce: z YAML, z MDX, výchozí komponenty, u kresby z NADTITULKY_KRESEB', () => {
    expect(z('b:cesta1-jak-zjistit').nadtitulek).toBe('Tvůj tah');
    expect(z('b:cesta1-podle-ceho-poznas').nadtitulek).toBe('Nejdřív sám');
    expect(z('b:sokrates-co-je-odvaha').nadtitulek).toBe('Než budeš číst dál');
    expect(z('b:sokrates-kdo-je-moudry')).toMatchObject({ typ: 'NejdrivSam', nadtitulek: 'Než budeš číst dál' });
    expect(z('b:kdo-sokrates-platon-vzdalenost').nadtitulek).toBe('Kdo žil dřív?');
    expect(z('b:lod-po-prknech').nadtitulek).toBe('Zkus si to');
    // Závěr cesty nadtitulek nemá; ostatní části (kroky, kapitoly, hlasy) taky ne.
    expect(z('b:cesta1-moje-pravidlo').nadtitulek).toBeUndefined();
    expect(z('o:sokrates/soud').nadtitulek).toBeUndefined();
    for (const x of katalog) if (x.druh === 'blok' && x.typ !== 'ZaverCesty') expect(x.nadtitulek, x.id).toBeTruthy();
  });

  it('společný profil má název stránky z titulku a jiné titulky Myšlenek', () => {
    expect(z('o:krates-a-hipparchia')).toMatchObject({ osoba: 'krates', stranka: '/osobnost/krates-a-hipparchia/' });
    expect(z('o:krates-a-hipparchia/myslenky').nazev).toBe('Tři velké myšlenky');
  });

  it('otázka 1: stránka a hlasy v pořadí časové osy, jméno z dat', () => {
    const fm = vstup.otazky.find((q) => q.id === 'jak-zit')!.data.hlasy!.map((h) => h.osoba);
    const hlasy = katalog.filter((x) => x.druh === 'hlas' && x.otazka === 'jak-zit');
    expect(hlasy.map((h) => h.osoba).sort()).toEqual([...fm].sort());
    expect(hlasy.map((h) => h.poradi)).toEqual(fm.map((_, i) => i + 1));
    expect(hlasy[0].osoba).toBe('diogenes');
    expect(z('h:jak-zit/epikuros')).toMatchObject({ nazev: 'Epikúros', adresa: '/otazka/jak-zit/#hlas-epikuros', rodic: 'h:jak-zit' });
    expect(z('h:jak-zit')).toMatchObject({ druh: 'otazka', obdobi: null });
    // Otázka bez hlasů stránku nemá, a tak ani zastavení.
    const bezHlasu = vstup.otazky.filter((q) => !q.data.hlasy?.length).map((q) => `h:${q.id}`);
    expect(bezHlasu.length).toBeGreaterThan(0);
    for (const id of bezHlasu) expect(katalog.some((x) => x.id === id)).toBe(false);
  });

  it('id jsou jedinečná a platná, rodiče existují, medailonky v katalogu nejsou', () => {
    const ids = katalog.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const x of katalog) {
      expect(ID_ZASTAVENI.test(x.id), x.id).toBe(true);
      if (x.rodic) expect(ids, x.id).toContain(x.rodic);
    }
    const medailonky = [...osoby.values()].filter((o) => o.medailonek).map((o) => `o:${o.id}`);
    expect(medailonky.length).toBeGreaterThan(0);
    for (const id of medailonky) expect(ids).not.toContain(id);
  });

  it('kapitola, která nesedí na frontmatter, a dvojí id sestavení zastaví', () => {
    const s = vstup.osobnosti.find((p) => p.id === 'sokrates')!;
    const bezSoudu = { ...s, body: s.body!.replace('kotva="soud"', 'kotva="soudni-sin"') };
    expect(() => katalogZastaveni({ ...vstup, osobnosti: [bezSoudu] })).toThrow(/soudni-sin/);
    const dvakrat = { ...s, body: `${s.body}\n<Volba id="sokrates-navrh-trestu" />\n` };
    expect(() => katalogZastaveni({ ...vstup, osobnosti: [dvakrat] })).toThrow(/dvakrát/);
  });

  it('značky v MDX: víc řádků, výrazy ve složených závorkách, komentáře', () => {
    const z = znackyMdx('{/* <Volba id="ne" /> */}\n<Odkryj\n  id="a"\n  otazka="Proč? A „co“?"\n  filozof="sokrates"\n>\n<KamDal odkazy={[ { href: "/x/", text: "Y" } ]} />\n<Myslenky titulek="Tři" />');
    expect(z.map((x) => x.jmeno)).toEqual(['Odkryj', 'KamDal', 'Myslenky']);
    expect(z[0].atributy).toMatchObject({ id: 'a', otazka: 'Proč? A „co“?' });
  });
});

const hodina: UlozenaHodina = {
  verze: 1,
  id: 'h1',
  nazev: 'Delfy a soud',
  poznamka: 'Začít otázkou na tabuli.',
  zastaveni: [
    { id: 'k:kdy-mam-dobry-duvod-verit/1', poznamka: 'Číst nahlas' },
    { id: 'b:cesta1-jak-zjistit', poznamka: 'Hlasovat rukou' },
    { id: 'o:sokrates/soud', poznamka: '' },
    { id: 'h:jak-poznam-pravdu/protagoras', poznamka: 'Tajná poznámka' },
  ],
  zmeneno: '2026-10-17T10:00:00.000Z',
};

describe('adresa hodiny', () => {
  it('nese verzi, název a pořadí zastavení, nikdy poznámky', () => {
    const a = adresaHodiny(hodinaProStudenty(hodina));
    expect(a).toBe(
      '/hodina/?v=1&n=Delfy%20a%20soud&z=k:kdy-mam-dobry-duvod-verit/1,b:cesta1-jak-zjistit,o:sokrates/soud,h:jak-poznam-pravdu/protagoras',
    );
    expect(adresaHodiny(hodina)).toBe(a);
    expect(a).not.toMatch(/Tajn|nahlas|tabuli/);
  });

  it('tam a zpět, i když prohlížeč adresu zakóduje', () => {
    const a = adresaHodiny(hodina);
    expect(hodinaZAdresy(a)).toEqual(hodinaProStudenty(hodina));
    expect(hodinaZAdresy(`https://atlas.example${a}#nahore`)).toEqual(hodinaProStudenty(hodina));
    const zakodovana = `?${new URLSearchParams({ v: '1', n: hodina.nazev, z: hodinaProStudenty(hodina).zastaveni.join(',') })}`;
    expect(hodinaZAdresy(zakodovana)).toEqual(hodinaProStudenty(hodina));
  });

  it('neznámá verze, smetí a opakování', () => {
    expect(hodinaZAdresy('/hodina/?v=2&z=o:sokrates')).toBeNull();
    expect(hodinaZAdresy('/hodina/?z=o:sokrates')).toBeNull();
    expect(hodinaZAdresy('/hodina/?v=1&z=o:sokrates,<script>,o:sokrates,,x:y,o:platon')).toEqual({ nazev: '', zastaveni: ['o:sokrates', 'o:platon'] });
    expect(hodinaZAdresy(`/hodina/?v=1&n=${'a'.repeat(300)}&z=`)!.nazev).toHaveLength(120);
  });

  it('soubor hodiny: import pročistí zastavení, cizí soubor odmítne', () => {
    const zpet = hodinaZeSouboru(JSON.stringify({ ...hodina, zastaveni: [...hodina.zastaveni, { id: 'k:kdy-mam-dobry-duvod-verit/1', poznamka: 'znovu' }, { id: 'zlé' }] }));
    expect(zpet).toEqual(hodina);
    expect(hodinaZeSouboru('{"verze":1,"zapisy":[]}')).toBeNull();
    expect(hodinaZeSouboru('není json')).toBeNull();
  });
});

describe('neznámé zastavení', () => {
  it('místo, které atlas mezitím zrušil, nespadne', () => {
    const n = najdiZastaveni(katalog, ['o:sokrates/soud', 'o:sokrates/kapitola-ktera-uz-neni', 'b:cesta1-jak-zjistit']);
    expect(n.map((x) => x.nalezeno)).toEqual([true, false, true]);
    expect(n[1]).toEqual({ id: 'o:sokrates/kapitola-ktera-uz-neni', nalezeno: false, text: NENI_V_ATLASU });
  });
});

describe('Doma projdi', () => {
  const ids = [...hodinaProStudenty(hodina).zastaveni, 'o:neni-v-atlasu'];

  it('kroky a kapitoly dotčených stránek, které v hodině nebyly; co student prošel', () => {
    const doma = domaProjdi(ids, katalog, { kroky: { 'kdy-mam-dobry-duvod-verit': [1, 2, 5] }, kapitoly: { '/osobnost/sokrates/': ['delfy'] } });
    expect(doma.map((s) => s.zastaveni.id)).toEqual(['k:kdy-mam-dobry-duvod-verit', 'o:sokrates']);
    // Krok 1 je v hodině sám, krok 2 přes svůj blok; zbývají 3 až 7, z nich 5 student otevřel.
    expect(doma[0].polozky.map((p) => [p.zastaveni.krok, p.proslo])).toEqual([[3, false], [4, false], [5, true], [6, false], [7, false]]);
    expect(doma[1].polozky.map((p) => [p.zastaveni.kotva, p.proslo])).toEqual([
      ['delfy', true], ['muz-z-agory', false], ['ustup-od-delia', false], ['posledni-den', false],
    ]);
  });

  it('blok v kapitole kapitolu pokryje, celý profil všechny; přehled cesty kroky nepokrývá', () => {
    const prazdne = { kroky: {}, kapitoly: {} };
    const soud = domaProjdi(['b:sokrates-navrh-trestu'], katalog, prazdne);
    expect(soud[0].polozky.map((p) => p.zastaveni.kotva)).not.toContain('soud');
    expect(domaProjdi(['o:sokrates', 'o:sokrates/soud'], katalog, prazdne)).toEqual([]);
    expect(domaProjdi(['k:kolik-je-dost'], katalog, prazdne)[0].polozky).toHaveLength(7);
    // Stránka otázky ani hlas „Doma projdi“ nedělají.
    expect(domaProjdi(['h:jak-zit', 'h:jak-zit/epikuros'], katalog, prazdne)).toEqual([]);
  });
});
