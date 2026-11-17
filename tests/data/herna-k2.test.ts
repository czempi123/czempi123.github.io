// Logika her herny z K2 (herna-v1): vazby dvou lidí (Seřaď na ose, Tipni si), odhad v lidských životech, slepá mapa,
// Doplň citát, věta pod razítkem v Kdo to řekl? a obsah nových her v src/content/bloky proti datům.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import {
  vazbaDvou, vetaVazby, zivotuMezi, delkaPravitka, sediOdhad, verdiktOdhadu, popisOdhadu, platnyStavOdhadu,
  vzdalenostSlovem, kmMezi, vetaPobytu, pobytOsoby, stranyKde, platnyStavKde,
  rozdelCitat, listkyDoplnit, chybyDoplnit, platnyStavDoplnit, prvniVeta, prozrazuje, chybyVetKdoRekl,
  spravnePoradi, kartaOsy, type VztahVazby,
} from '../../src/lib/herna';
import { vzdalenost } from '../../src/lib/cas-mapy';
import type { TOsoba } from '../../src/lib/schema';
import { BlokTipni, BlokKde, BlokDoplnit, BlokSerad, BlokKdoRekl } from '../../src/lib/bloky-schema';

const N = '\u00a0';
const lide = parse(readFileSync(new URL('../../src/data/lide.yaml', import.meta.url), 'utf8')) as TOsoba[];
const vztahy = parse(readFileSync(new URL('../../src/data/vztahy.yaml', import.meta.url), 'utf8')) as VztahVazby[];
const zdroje = parse(readFileSync(new URL('../../src/data/zdroje.yaml', import.meta.url), 'utf8')) as { citaty: { id: string; osoba?: string; cesky: string }[] };
const mista = parse(readFileSync(new URL('../../src/data/mista.yaml', import.meta.url), 'utf8')) as { id: string }[];
const osoba = (id: string) => lide.find((o) => o.id === id)!;
const citaty = new Map(zdroje.citaty.map((c) => [c.id, c]));

describe('vazba dvou lidí', () => {
  it('učitel a žák, tradovaný s „vypráví se“', () => {
    const v = vazbaDvou(osoba('sokrates'), osoba('antisthenes'), vztahy)!;
    expect(v).toMatchObject({ druh: 'vztah', typ: 'ucitel', text: 'učitel a žák', tradovany: false, kPrvnimu: false });
    expect(v.veta).toBe('Antisthenés se učil u Sókrata.');
    const t = vazbaDvou(osoba('antisthenes'), osoba('diogenes'), vztahy)!;
    expect(t.tradovany).toBe(true);
    expect(t.veta).toBe('Vypráví se, že se Diogenés učil u Antisthena.');
  });
  it('četl ho míří k prvnímu, poznámka z dat jde do věty', () => {
    const v = vazbaDvou(osoba('epiktetos'), osoba('marcus-aurelius'), vztahy)!;
    expect(v).toMatchObject({ typ: 'vliv-textem', text: 'četl ho', kPrvnimu: true });
    expect(vetaVazby(v)).toBe('Marcus Aurelius četl texty Epiktéta: Epiktétovy zápisky mu půjčil učitel Rusticus.');
  });
  it('učitel přednost před sporem; spor na dálku bez šipky', () => {
    expect(vazbaDvou(osoba('platon'), osoba('aristoteles'), vztahy)!.typ).toBe('ucitel');
    const s = vazbaDvou(osoba('sokrates'), osoba('aristoteles'), vztahy)!;
    expect(s).toMatchObject({ typ: 'polemika', text: 'spor na dálku', kPrvnimu: false });
  });
  it('bez vztahu: mohli se potkat, jiná tradice jen „ve stejné době“, jinak nic', () => {
    expect(vazbaDvou(osoba('demokritos'), osoba('platon'), vztahy)?.druh).toBe('potkat');
    const k = vazbaDvou(osoba('konfucius'), osoba('parmenides'), vztahy)!;
    expect(k).toMatchObject({ druh: 'soucasne', text: 'žili ve stejné době' });
    expect(k.veta).not.toMatch(/potkat|nevěděl/);
    expect(vazbaDvou(osoba('thales'), osoba('hypatia'), vztahy)).toBeNull();
  });
  it('řetěz v dílně má mezi každými sousedy vztah', () => {
    const b = BlokSerad.parse(parse(readFileSync(new URL('../../src/content/bloky/dilna-serad-narozeni.yaml', import.meta.url), 'utf8')));
    const karty = b.karty.map((k) => kartaOsy(k, new Map(lide.map((o) => [o.id, o])), new Map()));
    const p = spravnePoradi(karty.map((k) => k.rok));
    const vazby = p.slice(1).map((k, i) => vazbaDvou(osoba(b.karty[p[i]].osoba!), osoba(b.karty[k].osoba!), vztahy));
    expect(vazby.filter((v) => v?.druh === 'vztah').length).toBeGreaterThanOrEqual(2);
  });
});

describe('Tipni si: odhad v lidských životech', () => {
  it('vzdálenost z dat: Thalés a Hypatia asi dvanáct životů, Epiktétos a Marcus současníci', () => {
    const d = vzdalenost(osoba('thales'), osoba('hypatia'))!;
    expect(d.text).toBe(`Dělí je asi${N}915${N}let. To je asi dvanáct lidských životů.`);
    expect(zivotuMezi(d)).toBeCloseTo(12.2, 1);
    const s = vzdalenost(osoba('epiktetos'), osoba('marcus-aurelius'))!;
    expect(zivotuMezi(s)).toBe(0);
  });
  it('délka pravítka s rezervou, vlastní má přednost', () => {
    expect(delkaPravitka(0)).toBe(6);
    expect(delkaPravitka(12.2)).toBe(20);
    expect(delkaPravitka(12.2)).toBeGreaterThan(12.2 * 1.3);
    expect(delkaPravitka(3, 15)).toBe(15);
  });
  it('rozumné rozpětí: u současníků jen 0, jinak o život nebo čtvrtinu', () => {
    expect(sediOdhad(0, 0)).toBe(true);
    expect(sediOdhad(1, 0)).toBe(false);
    expect(sediOdhad(12, 12.2)).toBe(true);
    expect(sediOdhad(10, 12.2)).toBe(true);
    expect(sediOdhad(9, 12.2)).toBe(false);
    expect(sediOdhad(0, 0.3)).toBe(false);
    expect(sediOdhad(1, 0.3)).toBe(true);
    expect(verdiktOdhadu(4, 12.2).veta).toBe('Je jich víc, než myslíš.');
    expect(verdiktOdhadu(19, 12.2).veta).toBe('Je jich míň, než myslíš.');
    expect(verdiktOdhadu(3, 0).veta).toMatch(/nepřekrývají/);
  });
  it('popis jezdce a stav', () => {
    expect(popisOdhadu(0)).toBe('mohli se potkat');
    expect(popisOdhadu(1)).toBe('jeden lidský život');
    expect(popisOdhadu(3)).toBe('tři lidské životy');
    expect(popisOdhadu(12)).toBe('12 lidských životů');
    expect(platnyStavOdhadu({ odhad: 3, pokusy: [2, 3, 99], hotovo: true }, 20)).toEqual({ odhad: 3, pokusy: [2, 3], hotovo: true, ukazano: false });
    expect(platnyStavOdhadu({ odhad: 30 }, 20)).toBeNull();
  });
});

describe('Kde to bylo?: slepá mapa', () => {
  it('vzdálenost jen slovem', () => {
    expect(vzdalenostSlovem(50)).toEqual({ slovo: 'přesně tam', sedi: true });
    expect(vzdalenostSlovem(200).sedi).toBe(true);
    expect(vzdalenostSlovem(400)).toEqual({ slovo: 'kus dál', sedi: false });
    expect(vzdalenostSlovem(1500).slovo).toBe('o moře dál');
    expect(kmMezi([0, 0], [30, 40], { px: 100, km: 200 })).toBe(100);
  });
  it('věta z dat o pobytu', () => {
    const s = osoba('seneca');
    expect(vetaPobytu(s, pobytOsoby(s, 'korsika', 'exil')!, 'na Korsice')).toBe(`Na Korsice žil Seneca ve vyhnanství v letech 41–49${N}n.${N}l.`);
    const e = osoba('epiktetos');
    expect(vetaPobytu(e, pobytOsoby(e, 'nikopolis')!, 'v Nikopoli')).toBe(`V Nikopoli učil Epiktétos a působil v letech asi 93–135${N}n.${N}l.`);
    expect(pobytOsoby(s, 'athenes')).toBeNull();
  });
  it('popisky na opačných stranách, u blízkého tipu jen název', () => {
    expect(stranyKde([400, 200], [200, 200], 520)).toEqual({ misto: 'vlevo', tip: 'vpravo' });
    expect(stranyKde([150, 200], [300, 200], 520)).toEqual({ misto: 'vpravo', tip: 'vlevo' });
    expect(stranyKde([210, 205], [200, 200], 520).tip).toBeNull();
    expect(platnyStavKde({ tip: [10, 20] }, 520, 400)).toEqual({ tip: [10, 20] });
    expect(platnyStavKde({ tip: [600, 20] }, 520, 400)).toBeNull();
  });
});

describe('Doplň citát', () => {
  it('rozdělí citát kolem celého slova a výskytu', () => {
    expect(rozdelCitat('Komu je málo to, co stačí, tomu nestačí nic.', 'stačí')).toEqual({ pred: 'Komu je málo to, co ', po: ', tomu nestačí nic.' });
    expect(rozdelCitat('Komu je málo to, co stačí, tomu nestačí nic.', 'stačí', 2)).toBeNull();
    expect(rozdelCitat('Na ty, kdo vstupují do týchž řek', 'týchž')?.po).toBe(' řek');
    expect(rozdelCitat('Na ty, kdo', 'kd')).toBeNull();
  });
  it('lístky se semínkem, chyby, stav', () => {
    const z = [{ slovo: 'různých', vazba: 'a' }, { slovo: 'hlubokých', vazba: 'b' }];
    expect(listkyDoplnit('týchž', z, 'x')).toEqual(listkyDoplnit('týchž', z, 'x'));
    expect(listkyDoplnit('týchž', z, 'x').sort()).toEqual(['hlubokých', 'různých', 'týchž']);
    expect(chybyDoplnit({ citat: 'herakleitos-b12', slovo: 'týchž', zameny: z }, citaty)).toEqual([]);
    expect(chybyDoplnit({ citat: 'herakleitos-b12', slovo: 'jiných', zameny: z }, citaty)).toHaveLength(1);
    expect(platnyStavDoplnit({ vlozeno: ['různých', 'cizí', 'týchž'] }, ['týchž', 'různých', 'hlubokých'])).toEqual({ vlozeno: ['různých', 'týchž'] });
    expect(platnyStavDoplnit({ vlozeno: [] }, ['a'])).toBeNull();
  });
});

describe('Kdo to řekl?: věta pod razítkem', () => {
  it('první věta nekončí u „př. n. l.“', () => {
    expect(prvniVeta('Zkoumal živou přírodu, úsudek i obec. Dobrým se podle něj…')).toBe('Zkoumal živou přírodu, úsudek i obec.');
    expect(prvniVeta(`Roku 427 př.${N}n.${N}l. přijel do Athén. Pak…`)).toBe(`Roku 427 př.${N}n.${N}l. přijel do Athén.`);
  });
  it('věta, která citát opisuje, se pozná', () => {
    expect(prozrazuje(osoba('demokritos').proc, citaty.get('dl-ix-72-demokritos')!.cesky)).toBe(true);
    expect(prozrazuje(osoba('epiktetos').proc, citaty.get('rukojet-5')!.cesky)).toBe(false);
    expect(chybyVetKdoRekl([{ citat: 'dl-ix-72-demokritos', jini: [] }], citaty, new Map(lide.map((o) => [o.id, o.proc])))).toHaveLength(1);
  });
});

// ─── Nové hry v src/content/bloky proti datům ────────────────────────────────

const slozka = new URL('../../src/content/bloky/', import.meta.url);
const hry = readdirSync(slozka).filter((s) => s.endsWith('.yaml'))
  .map((s) => ({ s, d: parse(readFileSync(new URL(s, slozka), 'utf8')) }))
  .filter((x) => ['tipni', 'kde', 'doplnit', 'kdo-rekl'].includes(x.d.druh));
const vety = (t: string) => t.split(/(?<=[.!?])\s+(?=\p{Lu})/u).length;

describe('nové hry v src/content/bloky', () => {
  it('dílna má všechny tři formáty K2', () => {
    expect(hry.map((h) => h.d.druh)).toEqual(expect.arrayContaining(['tipni', 'kde', 'doplnit']));
  });
  for (const { s, d } of hry) {
    it(`${s}: schéma a data`, () => {
      if (d.druh === 'tipni') {
        const b = BlokTipni.parse(d);
        expect(vzdalenost(osoba(b.a), osoba(b.b))).not.toBeNull();
      } else if (d.druh === 'kde') {
        const b = BlokKde.parse(d);
        expect(mista.some((m) => m.id === b.misto)).toBe(true);
        expect(pobytOsoby(osoba(b.osoba), b.misto, b.role)).not.toBeNull();
      } else if (d.druh === 'doplnit') {
        const b = BlokDoplnit.parse(d);
        expect(chybyDoplnit(b, citaty)).toEqual([]);
        expect(vety(b.pointa)).toBe(1);
      } else {
        const b = BlokKdoRekl.parse(d);
        for (const k of b.karty) expect(vety(k.pointa)).toBe(1);
        expect(chybyVetKdoRekl(b.karty, citaty, new Map(lide.map((o) => [o.id, o.proc])))).toEqual([]);
      }
    });
  }
});
