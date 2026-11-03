// Medailonky (větev medailonky, P9): osoba s `medailonek: true` má úplná data (roky, místo, jedna věta kdo a proč,
// aspoň jeden vztah), nemá profil v MDX a její stránka i odkazy dostanou adresu /osobnost/<id>/.
// Pouštěj po každém vyplnění dat skillem atlas-data: npx vitest run tests/data/medailonky.test.ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { nactiData, type SurovaData } from '../../src/lib/kontroly';
import { adresaOsoby } from '../../src/lib/adresa-osoby';
import { chybiMedailonku, kamDalMedailonku, pocetVet, posun, roleNaKarte, rokNaMape } from '../../src/lib/medailonek';
import type { TOsoba } from '../../src/lib/schema';

const koren = join(import.meta.dirname, '../..');
const cti = (s: string) => readFileSync(join(koren, 'src/data', s), 'utf8');
const surova: SurovaData = {
  lide: cti('lide.yaml'), mista: cti('mista.yaml'), vztahy: cti('vztahy.yaml'),
  udalosti: cti('udalosti.yaml'), obdobi: cti('obdobi.yaml'), zdroje: cti('zdroje.yaml'), krajiny: cti('krajiny.yaml'),
};
const { data } = nactiData(surova);
const medailonky = data.lide.filter((o) => o.medailonek);
const profily = readdirSync(join(koren, 'src/content/osobnosti'))
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => ({ id: f.replace(/\.mdx?$/, ''), data: parse(readFileSync(join(koren, 'src/content/osobnosti', f), 'utf8').split('---')[1]) }));

describe('medailonky v datech', () => {
  it('jsou aspoň dva (šablona je vidět v náhledu)', () => expect(medailonky.length).toBeGreaterThanOrEqual(2));

  it.each(medailonky.map((o) => [o.id, o] as const))('%s má úplná data', (_, o) => {
    expect(chybiMedailonku(o, data.vztahy)).toEqual([]);
  });

  it('nikdo nemá profil i medailonek a každý medailonek má adresu /osobnost/<id>/', () => {
    const adresa = adresaOsoby(profily, medailonky.map((o) => o.id));
    for (const o of medailonky) expect(adresa(o.id)).toBe(`/osobnost/${o.id}/`);
  });
});

const osoba = (x: Partial<TOsoba>): TOsoba => ({
  id: 'x', jmeno: 'Iks', obdobi: 1, hloubka: 'medailonek', tradice: 'zapadni', smery: [], otazky: [], linie: [], mista: [],
  kdo: 'Filozof z Athén, žák Sókratův.', proc: 'Psal krátké dialogy o odvaze.', zdroje: ['p'], ...x,
});

describe('kritéria medailonku samy odhalí chybu', () => {
  const vztah = [{ od: 'sokrates', k: 'x' }];
  const uplna = osoba({ narozen: { rok: -400 }, zemrel: { rok: -330 }, mista: [{ misto: 'athenes', role: 'pusobeni', zdroj: 'p' }] });
  it('úplná osoba projde', () => expect(chybiMedailonku(uplna, vztah)).toEqual([]));
  it('chybějící roky, místo a vztah', () => {
    const ch = chybiMedailonku(osoba({}), []).join(' | ');
    expect(ch).toMatch(/roky/);
    expect(ch).toMatch(/místa/);
    expect(ch).toMatch(/vztahy/);
  });
  it('dvě věty, tykání a dlouhá věta', () => {
    expect(chybiMedailonku({ ...uplna, proc: 'Psal dialogy. Učil v Athénách.' }, vztah).join()).toMatch(/jedna věta/);
    expect(chybiMedailonku({ ...uplna, kdo: 'Filozof, kterého znáš z Platóna.' }, vztah).join()).toMatch(/oslovuje/);
    expect(chybiMedailonku({ ...uplna, kdo: `${'slovo '.repeat(26)}konec.` }, vztah).join()).toMatch(/slov/);
  });
  it('zkratka letopočtu větu nekončí', () => {
    expect(pocetVet('V komedii Oblaka (423 př. n. l.) zesměšnil Sókrata.')).toBe(1);
    expect(pocetVet('Zemřel roku 65 n. l. v Římě.')).toBe(1);
  });
});

describe('odkaz do Mapy a času', () => {
  it('posun přes přelom letopočtu vynechá rok nula', () => {
    expect(posun(-20, 40)).toBe(21);
    expect(posun(-331, 40)).toBe(-291);
  });
  it('bere první působení, jinak rok kolem čtyřicítky, nejvýš rok úmrtí', () => {
    expect(rokNaMape(osoba({ mista: [{ misto: 'athenes', role: 'pusobeni', od: -312, priblizne: true, zdroj: 'p' }] }))).toMatchObject({ rok: -312, priblizne: true, misto: 'athenes', sloveso: 'působil' });
    expect(rokNaMape(osoba({ narozen: { rok: -400 }, zemrel: { rok: -330 } }))?.rok).toBe(-360);
    expect(rokNaMape(osoba({ narozen: { rok: -400 }, zemrel: { rok: -370 } }))?.rok).toBe(-370);
  });
});

describe('Kam dál z medailonku', () => {
  const lide: Record<string, TOsoba> = {
    x: osoba({ narozen: { rok: -400 }, zemrel: { rok: -330 }, mista: [{ misto: 'athenes', role: 'pusobeni', od: -360, zdroj: 'p' }] }),
    sokrates: osoba({ id: 'sokrates', jmeno: 'Sókratés', narozen: { rok: -469 }, zemrel: { rok: -399 } }),
    platon: osoba({ id: 'platon', jmeno: 'Platón', narozen: { rok: -427 }, zemrel: { rok: -347 } }),
    bez: osoba({ id: 'bez', jmeno: 'Bez stránky', narozen: { rok: -420 }, zemrel: { rok: -350 } }),
  };
  const polozky = kamDalMedailonku({
    osoba: lide.x,
    vztahy: [
      { od: 'platon', k: 'x', typ: 'znali-se', zdroj: 'p' },
      { od: 'sokrates', k: 'x', typ: 'ucitel', zdroj: 'p' },
      { od: 'bez', k: 'x', typ: 'ucitel', zdroj: 'p' },
    ],
    osobaPodleId: (id) => lide[id],
    cil: (id) => (id === 'bez' ? undefined : { href: `/osobnost/${id}/`, druh: 'Portrét', text: lide[id].jmeno }),
    nazevMista: () => 'Athény',
    obdobi: { id: 1, nazev: 'Počátky a klasické Řecko' },
  });
  it('učitel před známým, člověk bez stránky vynechán, pak mapa; nejvýš tři položky', () => {
    expect(polozky.map((p) => p.href)).toEqual(['/osobnost/sokrates/', '/osobnost/platon/', '/mapa/?rok=-360&osoba=x']);
    expect(polozky[0].nadtitulek).toBe('Portrét · Učitel');
    expect(polozky[2].text.replace(/\u00a0/g, ' ')).toBe('Athény roku 360 př. n. l., kdy tam Iks působil');
  });
  it('bez lidí se stránkou doplní řadu Lidé a směry', () => {
    const jen = kamDalMedailonku({
      osoba: lide.x, vztahy: [], osobaPodleId: (id) => lide[id], cil: () => undefined,
      nazevMista: () => 'Athény', obdobi: { id: 1, nazev: 'Počátky a klasické Řecko' },
    });
    expect(jen.map((p) => p.nadtitulek)).toEqual(['Mapa a čas', 'Lidé a směry']);
  });
  it('osoba z tradice se stránkou: karta tradice místo druhého člověka (Filón a judaismus)', () => {
    const s = kamDalMedailonku({
      osoba: lide.x,
      vztahy: [
        { od: 'sokrates', k: 'x', typ: 'ucitel', zdroj: 'p' },
        { od: 'platon', k: 'x', typ: 'znali-se', zdroj: 'p' },
      ],
      osobaPodleId: (id) => lide[id],
      cil: (id) => ({ href: `/osobnost/${id}/`, druh: 'Portrét', text: lide[id].jmeno }),
      nazevMista: () => 'Athény',
      obdobi: { id: 1, nazev: 'Počátky a klasické Řecko' },
      tradice: { href: '/nabozenstvi/judaismus/', nazev: 'Judaismus' },
    });
    expect(s.map((p) => p.href)).toEqual(['/osobnost/sokrates/', '/nabozenstvi/judaismus/', '/mapa/?rok=-360&osoba=x']);
    expect(s[1].nadtitulek).toBe('Náboženství');
  });
});

describe('Kam dál z medailonku: nadtitulek říká, kdo je ve vztahu činný', () => {
  // Karta stojí bez nadpisu skupiny a jméno pod nadtitulkem čte student jako podmět (revize větve, nález 1).
  const podleId = (id: string) => data.lide.find((o) => o.id === id)!;
  const karta = (stranka: string, druhy: string) =>
    kamDalMedailonku({
      osoba: podleId(stranka), vztahy: data.vztahy, osobaPodleId: podleId,
      cil: (id) => (id === druhy ? { href: `/osobnost/${id}/`, druh: 'Portrét', text: podleId(id).jmeno } : undefined),
      nazevMista: () => 'Athény', obdobi: { id: 2, nazev: 'Helenismus a Řím' },
    })[0].nadtitulek;
  it('Cicero četl Platóna a přel se na dálku s Epikúrem', () => {
    expect(karta('cicero', 'platon')).toBe('Portrét · Koho četl');
    expect(karta('cicero', 'epikuros')).toBe('Portrét · S kým se přel na dálku');
    expect(karta('epikuros', 'cicero')).toBe('Portrét · Přel se s jeho učením');
  });
  it('Hypatia četla Plótína; na Plótínově stránce s rodem obou', () => {
    expect(karta('hypatia', 'plotinos')).toBe('Portrét · Koho četla');
    expect(karta('plotinos', 'hypatia')).toBe('Portrét · Četla ho a navázala');
  });
  it('Aristofanés polemizoval se Sókratem, ne naopak', () => {
    expect(karta('aristofanes', 'sokrates')).toBe('Portrét · S kým se přel');
    expect(karta('sokrates', 'aristofanes')).toBe('Portrét · Polemizoval s ním');
  });
  it('učitel a žák s rodem osoby karty', () => {
    expect(roleNaKarte({ typ: 'ucitel' }, 'od', false, {}, { zena: true })).toBe('Žákyně');
    expect(roleNaKarte({ typ: 'ucitel' }, 'k', false, { zena: true }, {})).toBe('Učitel');
    expect(roleNaKarte({ typ: 'znali-se' }, 'od', false, {}, {})).toBe('Znali se');
  });
});
