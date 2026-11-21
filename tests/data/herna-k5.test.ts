// Herna K5 (herna-v1): karta Do hodiny (schéma, kontrola obsahu, katalog hodin), sebehodnocení na konci cesty
// (id, texty, zápis do deníku a Moje filozofie) a obsah stránky Argumentační klamy a manipulace (bloky proti
// datům, deset klamů, úvod). Chování na stránce hlídá tests/e2e/herna-k5.spec.ts.
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { DoHodiny, chybyDoHodiny, dlouheVety, idDoHodiny, NADTITULEK_DO_HODINY, type TDoHodiny } from '../../src/lib/do-hodiny';
import {
  OTAZKY_SEBEHODNOCENI, NADPIS_SEBEHODNOCENI, UVOD_SEBEHODNOCENI, idSebehodnoceni, kotvaSebehodnoceni, otazkaZapisu, sebehodnoceniZDeniku,
} from '../../src/lib/sebehodnoceni';
import { katalogZastaveni, podobyZastaveni, type VstupKatalogu } from '../../src/lib/hodiny';
import { ulozZapis, smazZapis, nacti, _zapomenPamet } from '../../src/lib/denik';
import { prehledObdobi, type KatalogObdobi } from '../../src/lib/tvoje-obdobi';
import { BlokSlabe, BlokPravy } from '../../src/lib/bloky-schema';
import { Uvod } from '../../src/lib/stranky-schema';
import { chybySlabe, chybyPravy } from '../../src/lib/herna';
import { Pripsani, type TOsoba, type TPripsani } from '../../src/lib/schema';

const C = 'src/content';
const soubor = (cesta: string) => {
  const t = readFileSync(cesta, 'utf8');
  const [, fm, ...zbytek] = t.split(/^---$/m);
  return { data: parse(fm), body: zbytek.join('---') };
};
const stem = (f: string) => f.replace(/\.mdx?$/, '');
const slugyCest = readdirSync(`${C}/cesty`).filter((f) => /\.mdx$/.test(f) && !f.startsWith('_')).map(stem);
const karty = readdirSync(`${C}/do-hodiny`).filter((f) => f.endsWith('.yaml') && !f.startsWith('_'))
  .map((f) => ({ id: f.replace(/\.yaml$/, ''), data: DoHodiny.parse(parse(readFileSync(`${C}/do-hodiny/${f}`, 'utf8'))) }));
const kroky = slugyCest.flatMap((s) => readdirSync(`${C}/cesty/${s}`).filter((f) => /^\d.*\.mdx$/.test(f)).map((f) => soubor(`${C}/cesty/${s}/${f}`)));
const lide = parse(readFileSync(`src/data/lide.yaml`, 'utf8')) as TOsoba[];
const osoby = new Map(lide.map((o) => [o.id, o]));
const zdroje = parse(readFileSync('src/data/zdroje.yaml', 'utf8')) as {
  prameny: { id: string }[];
  citaty: { id: string; osoba?: string; cesky: string; autor: string; dilo: string; misto: string }[];
  pripsani: TPripsani[];
};
const citaty = new Map(zdroje.citaty.map((c) => [c.id, c]));

const vstup = (doHodiny?: VstupKatalogu['doHodiny']): VstupKatalogu => ({
  cesty: slugyCest.map((id) => ({ id, ...soubor(`${C}/cesty/${id}.mdx`) })),
  kroky,
  osobnosti: [],
  otazky: [],
  bloky: readdirSync(`${C}/bloky`).filter((f) => f.endsWith('.yaml')).map((f) => ({ id: f.replace(/\.yaml$/, ''), data: parse(readFileSync(`${C}/bloky/${f}`, 'utf8')) })),
  doHodiny,
  osoby,
});

const SLOV = (v: string) => v.split(/\s+/).filter(Boolean).length;
const vety = (t: string) => t.split(/(?<=[.!?])\s+/);

// ─── Do hodiny ────────────────────────────────────────────────────────────────

describe('Do hodiny: schéma a kontrola obsahu', () => {
  it('karta má právě dvě otázky; jiné pole nebo prázdná otázka neprojde', () => {
    expect(DoHodiny.safeParse({ dvojice: 'A?', trida: 'B?' }).success).toBe(true);
    expect(DoHodiny.safeParse({ dvojice: 'A?' }).success).toBe(false);
    expect(DoHodiny.safeParse({ dvojice: ' ', trida: 'B?' }).success).toBe(false);
    expect(DoHodiny.safeParse({ dvojice: 'A?', trida: 'B?', reseni: 'C' }).success).toBe(false);
  });

  it('soubor patří cestě a věty mají nejvýš 25 slov', () => {
    const dlouha = Array.from({ length: 26 }, () => 'slovo').join(' ') + '.';
    expect(dlouheVety({ dvojice: dlouha, trida: 'Krátká.' })).toHaveLength(1);
    expect(chybyDoHodiny([{ id: 'neni-cesta', data: { dvojice: 'A.', trida: 'B.' } }], [{ id: 'kolik-je-dost' }])[0]).toMatch(/neni-cesta/);
    expect(chybyDoHodiny(karty, slugyCest.map((id) => ({ id })))).toEqual([]);
  });

  it('každá karta stojí na konci posledního kroku své cesty jako <DoHodiny />', () => {
    expect(karty.map((k) => k.id)).toContain('kdy-mam-dobry-duvod-verit');
    for (const k of karty) {
      const kc = kroky.filter((x) => x.data.cesta === k.id).sort((a, b) => a.data.krok - b.data.krok);
      const posledni = kc.at(-1)!;
      expect(posledni.body.trimEnd().endsWith('<DoHodiny />'), k.id).toBe(true);
      expect(kc.slice(0, -1).some((x) => x.body.includes('<DoHodiny')), k.id).toBe(false);
    }
  });

  it('otázky jsou pro dvojici a pro třídu, bez bodů a bez správné odpovědi', () => {
    for (const k of karty) {
      for (const t of [k.data.dvojice, k.data.trida]) {
        expect(t).toMatch(/\?|\.$/);
        expect(t).not.toMatch(/správn|bod[ůy]?\b|známk/);
        for (const v of vety(t)) expect(SLOV(v), v).toBeLessThanOrEqual(25);
      }
      // Do dvojice: sloveso v množném čísle nebo „každý“; pro třídu: celá třída spolu.
      expect(k.data.dvojice).toMatch(/te\b|Každý/);
    }
  });

  it('katalog hodin zná kartu jako zastavení pod posledním krokem, s oběma otázkami a jen celou podobou', () => {
    const kat = katalogZastaveni(vstup(karty));
    const z = kat.find((x) => x.id === `b:${idDoHodiny(1)}`)!;
    expect(z).toMatchObject({ druh: 'blok', typ: 'DoHodiny', nadtitulek: NADTITULEK_DO_HODINY, kotva: 'cesta1-do-hodiny', rodic: 'k:kdy-mam-dobry-duvod-verit/7', krok: 7, cesta: 'kdy-mam-dobry-duvod-verit' });
    expect(z.nazev).toBe(karty.find((k) => k.id === 'kdy-mam-dobry-duvod-verit')!.data.trida);
    expect(z.doHodiny).toEqual(karty.find((k) => k.id === 'kdy-mam-dobry-duvod-verit')!.data);
    expect(z.adresa).toBe('/cesta/kdy-mam-dobry-duvod-verit/7/#cesta1-do-hodiny');
    expect(podobyZastaveni(z)).toEqual(['cely']);
    // Karta je v kroku poslední, za závěrem cesty.
    const vKroku = kat.filter((x) => x.rodic === 'k:kdy-mam-dobry-duvod-verit/7');
    expect(vKroku.at(-1)!.id).toBe('b:cesta1-do-hodiny');
  });

  it('chybějící soubor karty zastaví katalog; starší vstup bez karet ji vynechá', () => {
    expect(() => katalogZastaveni(vstup([]))).toThrow(/Do hodiny/);
    expect(katalogZastaveni(vstup(undefined)).some((x) => x.typ === 'DoHodiny')).toBe(false);
    const cizi = [{ id: 'neni-cesta', data: { dvojice: 'A.', trida: 'B.' } as TDoHodiny }, ...karty];
    expect(() => katalogZastaveni(vstup(cizi))).toThrow(/neni-cesta/);
  });
});

// ─── Sebehodnocení ────────────────────────────────────────────────────────────

describe('Sebehodnocení na konci cesty', () => {
  beforeEach(() => _zapomenPamet());

  it('id, kotva a otázka zápisu se skládají ze slugu a názvu cesty', () => {
    expect(idSebehodnoceni('kolik-je-dost', 'umim')).toBe('kolik-je-dost-umim');
    expect(idSebehodnoceni('kolik-je-dost', 'nejsem')).toBe('kolik-je-dost-nejsem');
    expect(kotvaSebehodnoceni('kolik-je-dost')).toBe('kolik-je-dost-sebehodnoceni');
    expect(otazkaZapisu('Kolik je dost?', 'umim')).toBe('Kolik je dost? Co už umím');
  });

  it('texty nic nehodnotí a nenesou rod studenta', () => {
    const vse = [NADPIS_SEBEHODNOCENI, UVOD_SEBEHODNOCENI, ...Object.values(OTAZKY_SEBEHODNOCENI)].join(' ');
    expect(vse).not.toMatch(/\bbod|skóre|jistý|jistá|došel|došla|\bsprávně\b/);
    for (const v of vety(UVOD_SEBEHODNOCENI)) expect(SLOV(v)).toBeLessThanOrEqual(25);
  });

  it('zápis do deníku ukládá jen to, co student napsal; prázdné se nepočítá', () => {
    expect(sebehodnoceniZDeniku([], 'kolik-je-dost')).toBeNull();
    ulozZapis({ id: idSebehodnoceni('kolik-je-dost', 'umim'), otazka: otazkaZapisu('Kolik je dost?', 'umim'), odpoved: 'Rozlišit potřebu a chuť.', odkaz: '/cesta/kolik-je-dost/7/#kolik-je-dost-sebehodnoceni', druh: 'sebehodnoceni' });
    ulozZapis({ id: idSebehodnoceni('kolik-je-dost', 'nejsem'), otazka: otazkaZapisu('Kolik je dost?', 'nejsem'), odpoved: '   ', odkaz: '/cesta/kolik-je-dost/7/', druh: 'sebehodnoceni' });
    const d = nacti();
    expect(d.zapisy.find((z) => z.id === 'kolik-je-dost-umim')).toMatchObject({ druh: 'sebehodnoceni', otazka: 'Kolik je dost? Co už umím' });
    expect(sebehodnoceniZDeniku(d.zapisy, 'kolik-je-dost')).toEqual({ umim: 'Rozlišit potřebu a chuť.' });
    expect(sebehodnoceniZDeniku(d.zapisy, 'kam-mi-mizi-cas')).toBeNull();
    smazZapis('kolik-je-dost-umim');
    expect(sebehodnoceniZDeniku(nacti().zapisy, 'kolik-je-dost')).toBeNull();
  });

  it('Moje filozofie ukáže sebehodnocení u otázky cesty, i když student nenapsal pravidlo', () => {
    const K: KatalogObdobi = {
      otazky: [{ cislo: 1, slug: 'jak-zit', otazka: 'Jak mám žít?', adresa: '/otazka/jak-zit/', duvody: {} }],
      cesty: [{ slug: 'kolik-je-dost', nazev: 'Kolik je dost?', cislo: 6, otazka: 1, pravidlo: { id: 'cesta6-moje-pravidlo', adresa: '/cesta/kolik-je-dost/7/#cesta6-moje-pravidlo' } }],
      bloky: [],
      osoby: {},
    };
    const d = { verze: 1 as const, zapisy: [{ id: 'kolik-je-dost-nejsem', otazka: 'x', odpoved: 'Kolik je moc.', odkaz: '/', kdy: '2026-11-19T10:00:00.000Z' }], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {} };
    const p = prehledObdobi(d, K);
    expect(p).toHaveLength(1);
    expect(p[0].sebehodnoceni).toEqual([{ cesta: 'Kolik je dost?', adresa: '/cesta/kolik-je-dost/7/#kolik-je-dost-sebehodnoceni', nejsem: 'Kolik je moc.' }]);
    expect(p[0].pravidla).toEqual([]);
    // Bez zápisů nic.
    expect(prehledObdobi({ ...d, zapisy: [] }, K)).toEqual([]);
  });

  it('dostane ho každá cesta: všechny poslední kroky končí Závěrem cesty a text cest sebehodnocení nepíše', () => {
    for (const slug of slugyCest) {
      const kc = kroky.filter((x) => x.data.cesta === slug).sort((a, b) => a.data.krok - b.data.krok);
      expect(kc.at(-1)!.body, slug).toMatch(/<ZaverCesty\b/);
      expect(kc.some((x) => /Sebehodnoceni/.test(x.body)), slug).toBe(false);
    }
  });
});

// ─── Argumentační klamy a manipulace ─────────────────────────────────────────

describe('Stránka Argumentační klamy a manipulace', () => {
  const str = soubor(`${C}/uvody/argumentacni-klamy.mdx`);
  const fm = Uvod.parse(str.data);

  it('úvod říká, o čem stránka je a co si student odnese; věty do 25 slov', () => {
    expect(fm.nazev).toBe('Argumentační klamy a manipulace');
    for (const v of vety(fm.perex)) expect(SLOV(v), v).toBeLessThanOrEqual(25);
    expect(fm.perex).toMatch(/Na konci stránky/);
    expect(fm.perex).not.toMatch(/Nejdřív|Projdeme|V této stránce|naučíš/);
    const prameny = new Set(zdroje.prameny.map((p) => p.id));
    for (const z of fm.zdroje) expect(prameny.has(z), z).toBe(true);
  });

  it('deset klamů, u každého antický i dnešní případ (dnešní v uvozovkách nebo jako situace dneška)', () => {
    const casti = str.body.split(/^### /m).slice(1);
    expect(casti.map((c) => c.split('\n')[0])).toEqual(['Útok na osobu', 'Důraz na autoritu', 'Důraz na většinu', 'Apel na soucit', 'Slaměný panák', 'Falešné dilema', 'Šikmá plocha', 'Logický kruh', 'Vytržení z kontextu', 'Podvržený citát']);
    for (const c of casti) {
      const text = c.split(/<\/Oddil>/)[0];
      expect(text, c.split('\n')[0]).toMatch(/Sókrat|Platón|Aristotel|Cicero|Pólos|Prótagor|Seneca|Athén|Lykei/);
      expect(text, c.split('\n')[0]).toMatch(/„[^“]+“|Dnes|Sestříhané video/);
    }
  });

  it('citáty v textu jsou v datech a žádný se neopakuje; nejvýš jeden v oddílu klamu', () => {
    const ids = [...str.body.matchAll(/<Citat id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(citaty.has(id), id).toBe(true);
    for (const c of str.body.split(/^### /m).slice(1)) expect((c.match(/<Citat /g) ?? []).length).toBeLessThanOrEqual(1);
  });

  it('bloky uprostřed stránky jsou nové (ne z dílny) a projdou kontrolou proti datům', () => {
    const slabe = BlokSlabe.parse(parse(readFileSync(`${C}/bloky/klamy-slabe-video.yaml`, 'utf8')));
    expect(chybySlabe(slabe, citaty as never, new Set(lide.map((o) => o.id)))).toEqual([]);
    expect(slabe.kOvereni).toEqual([]);
    const pravy = BlokPravy.parse(parse(readFileSync(`${C}/bloky/klamy-pravy.yaml`, 'utf8')));
    const pripsani = new Map(zdroje.pripsani.map((p) => [p.id, Pripsani.parse(p)]));
    expect(chybyPravy(pravy.karty, pripsani)).toEqual([]);
    const dilna = BlokPravy.parse(parse(readFileSync(`${C}/bloky/dilna-pravy.yaml`, 'utf8')));
    const spolecne = pravy.karty.filter((k) => dilna.karty.some((d) => d.pripsani === k.pripsani));
    expect(spolecne.length).toBeLessThanOrEqual(1);
    // Aspoň jedna věta je pravá, ať má razítko „řekl to“ smysl.
    expect(pravy.karty.some((k) => pripsani.get(k.pripsani)!.verdikt === 'rekl')).toBe(true);
    expect(str.body).toMatch(/<NajdiSlabeMisto id="klamy-slabe-video" \/>/);
    expect(str.body).toMatch(/<PravyNeboPodvrzeny id="klamy-pravy" \/>/);
  });

  it('na konci vede Kam dál do deníku', () => {
    const kamDal = str.body.slice(str.body.indexOf('<KamDal'));
    expect(kamDal.indexOf("href: '/denik/'")).toBeGreaterThan(0);
    expect(kamDal.indexOf("href: '/denik/'")).toBeLessThan(kamDal.indexOf("href: '/cesta/"));
  });

  it('cesta 1 na stránku vede z Kam dál přehledu; text cesty se nemění', () => {
    const c1 = soubor(`${C}/cesty/kdy-mam-dobry-duvod-verit.mdx`);
    expect(c1.data.kamDal).toEqual([{ href: '/argumentacni-klamy/', text: expect.stringContaining('Argumentační klamy a manipulace') }]);
    expect(c1.body).not.toMatch(/argumentacni-klamy/);
  });
});
