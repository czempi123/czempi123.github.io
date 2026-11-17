// Herna K4: malá aktivita na stránkách osob (výběr z dat, sousedé se liší, každá hra má dost dat), Výpravy,
// Přehrát období a trasy na mini mapě. Výpis výběru pro všechny stránky: npx vite-node scripts/herna-k4-vypis.ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { nactiData } from '../../src/lib/kontroly';
import { druziKdoZilDriv, mezeraZivotu, zijiZaroven } from '../../src/lib/dvojice';
import { vzdalenost, kdeVRoce, naAstro, LIDSKY_ZIVOT } from '../../src/lib/cas-mapy';
import { projekce, radkyPopisku, umisteniPopisku, vyrezMiniMapy, prekryv, type MistoMiniMapy, type Obdelnik } from '../../src/lib/mapa';
import {
  aktivityStranekOsob, kandidatiAktivit, obsahAktivity, poradiLidi, vyberAktivity, idAktivity, delkaZivota, kmMeziMisty,
  DLOUHY_ZIVOT, DALEKA_CESTA, type Aktivita, type KontextAktivit,
} from '../../src/lib/herna/aktivity';
import { chybyKdoRekl, chybyVetKdoRekl, prvniVeta } from '../../src/lib/herna/citaty';
import { pobytOsoby } from '../../src/lib/herna/mista';
import {
  Vypravy, chybyVyprav, odpovedVypravy, pokynVypravy, vypravyObdobi, dalsiVyprava, splnenaVyprava, platnyStavVyprav,
} from '../../src/lib/herna/vypravy';
import {
  zastavkyZivota, planObdobi, rokVCase, casProRok, desetiletiDal, desetiletiZpet, zacatekObdobi, PREHRAT_OBDOBI,
} from '../../src/lib/zivot-na-mape';
import { trasyMiniMapy, rokyTrasy, obdelnikRoku } from '../../src/lib/trasy-mapy';

const koren = join(import.meta.dirname, '../..');
const cti = (s: string) => readFileSync(join(koren, 'src/data', s), 'utf8');
const { data } = nactiData({
  lide: cti('lide.yaml'), mista: cti('mista.yaml'), vztahy: cti('vztahy.yaml'), udalosti: cti('udalosti.yaml'),
  obdobi: cti('obdobi.yaml'), zdroje: cti('zdroje.yaml'), krajiny: cti('krajiny.yaml'),
});
const profily = new Set<string>();
for (const f of readdirSync(join(koren, 'src/content/osobnosti'))) {
  const t = readFileSync(join(koren, 'src/content/osobnosti', f), 'utf8');
  for (const m of t.matchAll(/^(?:osoba: (.+)|dalsi: \[(.+)\])$/gm)) (m[1] ?? m[2]).split(',').forEach((x) => profily.add(x.trim()));
}
const osoba = (id: string) => data.lide.find((o) => o.id === id)!;
const maStranku = (id: string) => profily.has(id) || !!osoba(id)?.medailonek;
const medailonky = data.lide.filter((o) => o.medailonek).map((o) => o.id);
const druzi = druziKdoZilDriv(medailonky.map(osoba), data.lide, data.vztahy, (id) => profily.has(id));
const mista = new Map(data.mista.map((m) => [m.id, m]));
// Váhy citátů jako na stránce (src/lib/stranky-osob.ts › vahyCitatu): hlasy otázek 2, <Citat id> v textech 1.
const vahy = new Map<string, number>();
for (const f of readdirSync(join(koren, 'src/content'), { recursive: true }) as string[]) {
  if (!f.endsWith('.mdx')) continue;
  for (const m of readFileSync(join(koren, 'src/content', f), 'utf8').matchAll(/<Citat id="([a-z0-9-]+)"/g)) vahy.set(m[1], 1);
}
for (const f of readdirSync(join(koren, 'src/content/otazky'))) {
  for (const m of readFileSync(join(koren, 'src/content/otazky', f), 'utf8').matchAll(/citat: ?"?([a-z0-9-]+)/g)) vahy.set(m[1], 2);
}
const k: KontextAktivit = {
  lide: data.lide, vztahy: data.vztahy, citaty: data.zdroje.citaty, mista, maStranku,
  kdoZil: (id) => druzi.get(id) ?? null, znama: (id) => profily.has(id), vahaCitatu: (id) => vahy.get(id) ?? 0,
};
const citaty = new Map(data.zdroje.citaty.map((c) => [c.id, c]));

describe('výběr malé aktivity (vyberAktivity)', () => {
  const a = (druh: Aktivita['druh'], sila: number): Aktivita =>
    druh === 'kdo-zil' ? { druh, sila, b: 'x' } : druh === 'kde' ? { druh, sila, misto: 'm', role: 'exil', km: null }
      : druh === 'tipni' ? { druh, sila, a: 'x', b: 'y', duvod: 'cetl' } : { druh, sila, citat: 'c', mluvci: 'm', jini: [] };

  it('sousedé nikdy stejný druh, i když všichni mají radši tentýž', () => {
    const s = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, kandidati: [a('kdo-rekl', 3), a('kdo-zil', 1)] }));
    const v = vyberAktivity(s);
    const druhy = s.map((x) => v.get(x.id)!.druh);
    for (let i = 1; i < druhy.length; i++) expect(druhy[i]).not.toBe(druhy[i - 1]);
  });

  it('silnější kandidát má přednost, když sousedé dovolí', () => {
    const v = vyberAktivity([{ id: 'a', kandidati: [a('kdo-zil', 1), a('kde', 3)] }, { id: 'b', kandidati: [a('tipni', 2), a('kdo-zil', 1)] }]);
    expect(v.get('a')!.druh).toBe('kde');
    expect(v.get('b')!.druh).toBe('tipni');
  });

  it('pevná aktivita (profil) se nemění a soused se jí vyhne; dvě pevné vedle sebe řadu nerozbijí', () => {
    const v = vyberAktivity([
      { id: 'p1', pevna: 'kdo-zil', kandidati: [] },
      { id: 'p2', pevna: 'kdo-zil', kandidati: [] },
      { id: 'm', kandidati: [a('kdo-zil', 3), a('kde', 2)] },
      { id: 'n', kandidati: [a('kde', 3), a('kdo-zil', 1)] },
    ]);
    expect(v.get('p1')).toBeNull();
    expect(v.get('m')!.druh).toBe('kde');
    expect(v.get('n')!.druh).toBe('kdo-zil');
  });

  it('výběr je pevný: dvakrát týž vstup, týž výsledek', () => {
    const s = ['x', 'y', 'z'].map((id) => ({ id, kandidati: [a('kdo-rekl', 2), a('tipni', 2), a('kde', 2)] }));
    expect([...vyberAktivity(s)].map(([i, x]) => `${i}:${x!.druh}`)).toEqual([...vyberAktivity(s)].map(([i, x]) => `${i}:${x!.druh}`));
  });
});

describe('malá aktivita na všech medailoncích', () => {
  const vyber = aktivityStranekOsob(k, profily);
  const poradi = poradiLidi(data.lide.filter((o) => maStranku(o.id)));

  it('medailonků je 34 a každý má aktivitu; profil nemá vybranou (má svou v MDX)', () => {
    expect(medailonky).toHaveLength(34);
    for (const id of medailonky) expect(vyber.get(id), id).toBeTruthy();
    for (const id of profily) if (vyber.has(id)) expect(vyber.get(id)).toBeNull();
  });

  it('žádné dva sousední medailonky v seznamu Lidé nemají stejnou hru; vedle profilu jinou, kde je z čeho vybrat', () => {
    const druh = (id: string) => (profily.has(id) ? 'kdo-zil' : vyber.get(id)!.druh);
    for (let i = 1; i < poradi.length; i++) {
      const [p, q] = [poradi[i - 1].id, poradi[i].id];
      if (profily.has(p) && profily.has(q)) continue;
      const medailonek = profily.has(p) ? q : p;
      if (druh(p) === druh(q)) expect(kandidatiAktivit(osoba(medailonek), k).length, `${p} a ${q}`).toBe(1);
    }
  });

  it('hry se střídají: každý ze čtyř druhů aspoň na pěti medailoncích', () => {
    const pocty = new Map<string, number>();
    for (const id of medailonky) pocty.set(vyber.get(id)!.druh, (pocty.get(vyber.get(id)!.druh) ?? 0) + 1);
    for (const d of ['kdo-zil', 'kde', 'kdo-rekl', 'tipni']) expect(pocty.get(d) ?? 0, d).toBeGreaterThanOrEqual(5);
  });

  it('Kdo to řekl? se na dvou medailoncích nikdy neopakuje se stejným citátem', () => {
    const c = medailonky.map((id) => vyber.get(id)!).filter((x) => x.druh === 'kdo-rekl').map((x) => (x as { citat: string }).citat);
    expect(new Set(c).size).toBe(c.length);
  });

  it.each(medailonky.map((id) => [id] as const))('%s: hra má dost dat a projde schématem', (id) => {
    const o = osoba(id);
    const a = vyber.get(id)!;
    const ob = obsahAktivity(o, a, k);
    expect(ob.id).toBe(idAktivity(id, a));
    switch (ob.druh) {
      case 'kdo-zil': {
        expect(ob.b).toBe(druzi.get(id));
        expect(vzdalenost(o, osoba(ob.b))).not.toBeNull();
        break;
      }
      case 'kde': {
        const pobyt = pobytOsoby(o, ob.blok.misto, ob.blok.role);
        expect(pobyt).not.toBeNull();
        expect(ob.blok.kde).toBe(mista.get(ob.blok.misto)!.kde);
        // Místo leží ve výřezu mini mapy osoby (tentýž výřez má hra).
        const body: MistoMiniMapy[] = o.mista.map((m) => ({ nazev: mista.get(m.misto)!.nazev, souradnice: mista.get(m.misto)!.souradnice as [number, number], radky: [] }));
        const v = vyrezMiniMapy(body);
        const xy = projekce(v, 1e6)(mista.get(ob.blok.misto)!.souradnice as [number, number]) as [number, number];
        expect(xy[0] > 0 && xy[0] < v.sirka && xy[1] > 0 && xy[1] < v.vyska).toBe(true);
        if (ob.blok.role !== 'exil') {
          const rodiste = o.mista.find((m) => m.role === 'narozeni')!;
          expect(kmMeziMisty(mista.get(rodiste.misto)!.souradnice, mista.get(ob.blok.misto)!.souradnice)).toBeGreaterThanOrEqual(DALEKA_CESTA);
        }
        break;
      }
      case 'kdo-rekl': {
        const karta = ob.blok.karty[0];
        const proc = new Map(data.lide.map((x) => [x.id, x.proc]));
        expect(chybyKdoRekl(ob.blok.karty, citaty, new Set(data.lide.map((x) => x.id)))).toEqual([]);
        expect(chybyVetKdoRekl(ob.blok.karty, citaty, proc)).toEqual([]);
        expect(karta.jini).toHaveLength(2);
        expect(karta.jini).not.toContain(id);
        const mluvci = citaty.get(karta.citat)!.osoba!;
        expect(mluvci).not.toBe(id);
        // Mluvčí je ve vztahu s osobou stránky a rub to řekne.
        expect(data.vztahy.some((v) => (v.od === id && v.k === mluvci) || (v.od === mluvci && v.k === id))).toBe(true);
        expect(karta.pointa).toContain(osoba(id).jmeno);
        for (const j of [mluvci, ...karta.jini]) expect(prvniVeta(osoba(j).proc).length).toBeGreaterThan(10);
        break;
      }
      case 'tipni': {
        const [A, B] = [osoba(ob.blok.a), osoba(ob.blok.b)];
        const d = vzdalenost(A, B);
        expect(d).not.toBeNull();
        if (a.druh === 'tipni' && a.duvod === 'cetl') {
          expect(d!.druh).toBe('deli');
          expect(d!.let).toBeGreaterThanOrEqual(LIDSKY_ZIVOT);
          expect(data.vztahy.some((v) => v.typ === 'vliv-textem' && v.od === A.id && v.k === B.id)).toBe(true);
        } else {
          expect(delkaZivota(A)!).toBeGreaterThanOrEqual(DLOUHY_ZIVOT);
          expect(zijiZaroven(A, B)).toBe(true);
          expect(mezeraZivotu(A, B)).toBe(0);
          expect(A.zemrel!.rok - B.narozen!.rok).toBeGreaterThanOrEqual(20);
        }
        expect(ob.blok.scena).toBeTruthy();
        break;
      }
    }
  });
});

describe('výpravy', () => {
  const vypravy = Vypravy.parse(parse(cti('vypravy.yaml')));
  const lide = new Map(data.lide.map((o) => [o.id, o]));

  it('sedí na data: člověk v roce žije a mapa ho ukáže v místě výpravy, rok leží v okně období', () => {
    expect(chybyVyprav(vypravy, lide, data.obdobi)).toEqual([]);
  });

  it('první výprava období 1 je ta z první návštěvy mapy; obě období mají aspoň čtyři', () => {
    expect(vypravyObdobi(vypravy, 1)[0]).toMatchObject({ id: 'sokrates-424', osoba: 'sokrates', rok: -424, misto: 'delion' });
    expect(vypravyObdobi(vypravy, 1).length).toBeGreaterThanOrEqual(4);
    expect(vypravyObdobi(vypravy, 2).length).toBeGreaterThanOrEqual(4);
  });

  it('chyba v datech se ozve: jiné místo, rok mimo život, rok mimo období', () => {
    const v = vypravy[0];
    expect(chybyVyprav([{ ...v, misto: 'athenes' }], lide, data.obdobi)[0]).toContain('delion');
    expect(chybyVyprav([{ ...v, rok: -200 }], lide, data.obdobi).join(' ')).toContain('nežije');
    expect(chybyVyprav([{ ...v, obdobi: 2 }], lide, data.obdobi).join(' ')).toContain('mimo okno');
  });

  it('odpověď skládají data: pobyt s rolí, rodiště, věta navíc', () => {
    const s = (id: string) => { const v = vypravy.find((x) => x.id === id)!; return odpovedVypravy(v, lide.get(v.osoba)!, mista); };
    expect(s('sokrates-424')).toMatch(/^U Délia byl Sókratés na vojenském tažení roku 424/);
    expect(s('pythagoras-520')).toContain('V Krotónu');
    expect(s('pythagoras-520')).toContain('Narodil se na Samu.');
    expect(s('seneca-45')).toContain('Na Korsice žil Seneca ve vyhnanství');
    expect(s('diogenes-323')).toContain('Vypráví se');
    expect(pokynVypravy({ zena: true })).toContain('její');
  });

  it('splnění, další výprava dokola, uložený stav jen se známými výpravami', () => {
    const v = vypravy[0];
    expect(splnenaVyprava(v, 'sokrates', -424)).toBe(true);
    expect(splnenaVyprava(v, 'sokrates', -423)).toBe(false);
    const o1 = vypravyObdobi(vypravy, 1);
    expect(dalsiVyprava(o1, o1[o1.length - 1].id)!.id).toBe(o1[0].id);
    const ids = new Set(vypravy.map((x) => x.id));
    expect(platnyStavVyprav({ aktualni: { 1: 'pythagoras-520', 9: 'x', 2: 'neni' }, splnene: ['sokrates-424', 'neni', 'sokrates-424'] }, ids))
      .toEqual({ aktualni: { 1: 'pythagoras-520' }, splnene: ['sokrates-424'] });
    expect(platnyStavVyprav('nesmysl', ids)).toEqual({ aktualni: {}, splnene: [] });
  });
});

describe('přehrát období', () => {
  it('rok běží rovnoměrně od začátku do konce okna asi minutu, i přes rok nula', () => {
    expect(PREHRAT_OBDOBI.delka).toBe(60_000);
    const p = planObdobi(-350, 550, 1000);
    expect(rokVCase(p, 0)).toBe(-350);
    expect(rokVCase(p, 1000)).toBe(550);
    const roky = Array.from({ length: 101 }, (_, i) => rokVCase(p, i * 10));
    expect(roky).not.toContain(0);
    for (let i = 1; i < roky.length; i++) expect(naAstro(roky[i])).toBeGreaterThanOrEqual(naAstro(roky[i - 1]));
    // Pokračovat: čas pro rok vrátí týž rok.
    for (const r of [-300, -1, 1, 200]) expect(rokVCase(p, casProRok(p, r))).toBe(r);
  });

  it('skoky po desetiletích přes přelom letopočtu a v mezích okna', () => {
    expect(desetiletiDal(-424, 550)).toBe(-420);
    expect(desetiletiDal(-420, 550)).toBe(-410);
    expect(desetiletiDal(-10, 550)).toBe(1);
    expect(desetiletiDal(1, 550)).toBe(10);
    expect(desetiletiDal(545, 550)).toBe(550);
    expect(desetiletiZpet(-424, -650)).toBe(-430);
    expect(desetiletiZpet(10, -650)).toBe(-10);
    expect(desetiletiZpet(1, -650)).toBe(-10);
    expect(desetiletiZpet(15, -650)).toBe(10);
    expect(desetiletiZpet(-645, -650)).toBe(-650);
  });

  it('přehrávání začne v aktuálním roce, jen když leží v okně a ne na konci', () => {
    expect(zacatekObdobi(-424, -650, -300)).toBe(-424);
    expect(zacatekObdobi(-300, -650, -300)).toBe(-650);
    expect(zacatekObdobi(100, -650, -300)).toBe(-650);
  });
});

describe('trasy na mini mapě', () => {
  it('roky trasy: letopočet jednou, „asi“, když je některý přibližný', () => {
    const nb = (s: string) => s.replace(/\u00a0/g, ' ');
    expect(nb(rokyTrasy([{ rok: -432, asiRok: false }]))).toBe('432 př. n. l.');
    expect(nb(rokyTrasy([{ rok: -366, asiRok: true }, { rok: -361, asiRok: false }]))).toBe('asi 366 a 361 př. n. l.');
    expect(nb(rokyTrasy([{ rok: -10, asiRok: false }, { rok: 5, asiRok: false }]))).toBe('10 př. n. l. a 5 n. l.');
  });

  /** Mini mapa osoby jako na stránce (MiniMapa.astro): výřez, popisky míst a trasy. */
  function mapa(id: string) {
    const o = osoba(id);
    const body = new Map<string, MistoMiniMapy>();
    for (const m of o.mista) {
      const b = body.get(m.misto) ?? { nazev: mista.get(m.misto)!.nazev, souradnice: mista.get(m.misto)!.souradnice as [number, number], radky: [] };
      b.radky.push(`${m.role} ${m.rok ?? m.od ?? ''}`.trim());
      body.set(m.misto, b);
    }
    const v = vyrezMiniMapy([...body.values()]);
    const p = projekce(v, 1e6);
    const polozky = [...body.entries()].map(([mid, b]) => ({ id: mid, ...b, xy: p(b.souradnice) as [number, number] }));
    const u = umisteniPopisku(polozky, v.sirka);
    const popisky = polozky.map((b, i) => ({ xy: b.xy, nazev: b.nazev, radky: b.radky, umisteni: u[i] }));
    const trasy = trasyMiniMapy({ zastavky: zastavkyZivota(o), xy: new Map(polozky.map((b) => [b.id, b.xy])), popisky, sirka: v.sirka, vyska: v.vyska });
    return { trasy, popisky, v };
  }

  it('kreslí se jen přechody s rokem příchodu v datech; tam a zpět jsou dva oblouky', () => {
    expect(mapa('diogenes').trasy.map((t) => `${t.od}>${t.kam}`)).toEqual(['athenes>korinth']);
    expect(mapa('platon').trasy.map((t) => `${t.od}>${t.kam}`)).toEqual(['athenes>syrakusy', 'syrakusy>athenes']);
    expect(mapa('platon').trasy[0].rok.replace(/\u00a0/g, ' ')).toBe('asi 366 a 361 př. n. l.');
    expect(mapa('krates').trasy).toEqual([]);
  });

  it.each(['sokrates', 'platon', 'aristoteles', 'gorgias', 'epikuros', 'seneca', 'karneades', 'alkibiades', 'plotinos'])(
    '%s: rok trasy se nepotká s názvem, rolí, bodem ani jiným rokem a leží ve výřezu', (id) => {
      const { trasy, popisky, v } = mapa(id);
      expect(trasy.length).toBeGreaterThan(0);
      const roky: Obdelnik[] = trasy.filter((t) => t.popisek).map((t) => obdelnikRoku(t.rok, t.popisek!.x, t.popisek!.y));
      const mista: Obdelnik[] = popisky.flatMap((p) => [...radkyPopisku(p, p.umisteni), [p.xy[0] - 9, p.xy[1] - 9, p.xy[0] + 9, p.xy[1] + 9] as Obdelnik]);
      roky.forEach((r, i) => {
        expect(r[0] >= 0 && r[1] >= 0 && r[2] <= v.sirka && r[3] <= v.vyska).toBe(true);
        for (const m of mista) expect(prekryv(r, m, 0)).toBe(false);
        roky.forEach((s, j) => { if (j !== i) expect(prekryv(r, s, 0)).toBe(false); });
      });
    });

  it('kdeVRoce a trasy mluví o týchž místech (rok příchodu = rok zastávky)', () => {
    const t = mapa('sokrates').trasy.find((x) => x.kam === 'potidaia')!;
    expect(t.rok.replace(/\u00a0/g, ' ')).toBe('432 př. n. l.');
    expect(kdeVRoce(osoba('sokrates'), -432)?.misto).toBe('potidaia');
  });
});
