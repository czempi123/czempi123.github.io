// Osa hlasů na stránkách velkých otázek (src/lib/osa-hlasu.ts): poloha v poměru let, řádky mincí, zlom a dnešek,
// věty po volbě a volba v deníku. Všech osm stránek otázek s hlasy z dat.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { osoby } from '../../src/lib/data';
import { seradHlasy, klicOtazky } from '../../src/lib/otazky';
import { zivot, ROK_DNES } from '../../src/lib/casy';
import {
  rozlozeniOsy, polohaHlasu, letDoDneska, zaokrouhliLeta, cislo, sirkaTextu, popisOsy,
  vetaOVzdalenosti, vetaONejdelsiVzdalenosti, vetyPoVolbe, volbaZeStavu, stavZVolby, NIKDO, ROZMERY, VETA_NIKDO,
  type HlasOsy, type SirkaOsy,
} from '../../src/lib/osa-hlasu';

const NB = '\u00a0';
const bezNb = (s: string | null | undefined) => (s ?? '').replaceAll(NB, ' ');

const hlas = (id: string): HlasOsy => {
  const o = osoby.get(id)!;
  return { id: o.id, jmeno: o.jmeno, jmeno2: o.jmeno2, zena: o.zena, narozen: o.narozen, zemrel: o.zemrel, aktivni: o.aktivni, obdobi: o.obdobi, ikona: o.atribut?.ikona, zivotText: zivot(o) };
};

const slozka = 'src/content/otazky';
const OTAZKY = readdirSync(slozka)
  .filter((f) => /^[^_].*\.mdx?$/.test(f))
  .map((f) => ({ slug: f.replace(/\.mdx?$/, ''), fm: parse(readFileSync(`${slozka}/${f}`, 'utf8').split('---')[1]) }))
  .filter((o) => (o.fm.hlasy ?? []).length > 0)
  .map((o) => ({ slug: o.slug, hlasy: seradHlasy(o.fm.hlasy as { osoba: string }[], osoby).map((h) => hlas(h.osoba)) }));
const SIRKY: SirkaOsy[] = ['uzka', 'stredni', 'siroka'];

describe('osa hlasů: data', () => {
  it('osm stránek otázek s hlasy', () => {
    expect(OTAZKY.map((o) => o.slug).sort()).toEqual([
      'co-je-skutecne', 'co-je-spravne', 'jak-poznam-pravdu', 'jak-spolu-mame-zit', 'jak-zit', 'jsem-svobodny', 'kdo-vlastne-jsem', 'ma-zivot-smysl',
    ]);
  });
  it('žádná osoba v datech nemá id „nikdo“', () => {
    expect(osoby.has(NIKDO)).toBe(false);
  });
  it('klíč deníku je odvozený ze slugu', () => {
    expect(klicOtazky('jak-zit').osa).toBe('otazka-jak-zit-osa');
  });
});

describe('osa hlasů: poloha a pruh života', () => {
  it('mince stojí v polovině života, přes přelom letopočtu bez roku nula', () => {
    // Seneca asi 1 př. n. l. – 65 n. l.: astronomicky 0 až 65, polovina 32,5.
    const s = polohaHlasu(hlas('seneca'))!;
    expect(s).toMatchObject({ od: 0, do: 65, stred: 32.5, priblizne: true });
    const a = polohaHlasu(hlas('aristoteles'))!;
    expect(a).toMatchObject({ od: -383, do: -321, priblizne: false });
  });
  it('hlas jen s dobou činnosti (Hipparchia) má polohu a je přibližný', () => {
    const h = polohaHlasu(hlas('hipparchia'))!;
    expect(h.priblizne).toBe(true);
    expect(h.stred).toBe((-329 + -299) / 2);
  });
  it('na každé otázce a šířce leží mince v pořadí let a uvnitř měřítka', () => {
    for (const o of OTAZKY) {
      for (const s of SIRKY) {
        const r = rozlozeniOsy(o.hlasy, s);
        expect(r.mince, `${o.slug} ${s}`).toHaveLength(o.hlasy.length);
        const R = ROZMERY[s];
        for (const m of r.mince) {
          expect(m.x - R.r, `${o.slug} ${s} ${m.id}`).toBeGreaterThanOrEqual(0);
          expect(m.doX, `${o.slug} ${s} ${m.id}`).toBeLessThanOrEqual(r.konec + 0.001);
          expect(m.odX).toBeLessThan(m.x);
          expect(m.doX).toBeGreaterThan(m.x);
        }
        const xs = [...r.mince].map((m) => m.x);
        const podleStredu = o.hlasy.map((h) => polohaHlasu(h)!.stred);
        for (let i = 0; i < xs.length; i++) for (let j = 0; j < xs.length; j++) {
          if (podleStredu[i] < podleStredu[j]) expect(xs[i]).toBeLessThan(xs[j]);
        }
        expect(r.zlom).toBeGreaterThan(r.konec);
        expect(r.dnes).toBeGreaterThan(r.zlom);
      }
    }
  });
  it('vzdálenosti jsou v poměru let: Aristotelés–Marcus je na ose dál než Hérakleitos–Aristotelés', () => {
    const o = OTAZKY.find((x) => x.slug === 'kdo-vlastne-jsem')!;
    const r = rozlozeniOsy(o.hlasy, 'siroka');
    const x = (id: string) => r.mince.find((m) => m.id === id)!.x;
    const pomer = (x('marcus-aurelius') - x('aristoteles')) / (x('aristoteles') - x('herakleitos'));
    const roky = (polohaHlasu(hlas('marcus-aurelius'))!.stred - polohaHlasu(hlas('aristoteles'))!.stred) / (polohaHlasu(hlas('aristoteles'))!.stred - polohaHlasu(hlas('herakleitos'))!.stred);
    expect(pomer).toBeCloseTo(roky, 6);
  });
});

describe('osa hlasů: řádky mincí', () => {
  /** Co v řádku zabírá mince: mince, pruh a na širších kresbách jméno. */
  const zabira = (m: ReturnType<typeof rozlozeniOsy>['mince'][number], r: number) => [
    Math.min(m.x - r, m.odX, m.popisek ? m.popisek.x - m.popisek.sirka / 2 : Infinity),
    Math.max(m.x + r, m.doX, m.popisek ? m.popisek.x + m.popisek.sirka / 2 : -Infinity),
  ];
  it('v jednom řádku se nic nepotká, na žádné otázce a šířce (i 390 a 960 px)', () => {
    for (const o of OTAZKY) {
      for (const s of SIRKY) {
        const r = rozlozeniOsy(o.hlasy, s);
        const R = ROZMERY[s];
        for (const a of r.mince) for (const b of r.mince) {
          if (a === b || a.rada !== b.rada) continue;
          const [al, ar] = zabira(a, R.r);
          const [bl, br] = zabira(b, R.r);
          expect(ar <= bl || br <= al, `${o.slug} ${s}: ${a.id} × ${b.id}`).toBe(true);
        }
      }
    }
  });
  it('dva hlasy se stejným rokem jdou do dvou řádků', () => {
    const a = hlas('platon');
    const b = { ...hlas('aristoteles'), id: 'dvojnik', narozen: a.narozen, zemrel: a.zemrel };
    const r = rozlozeniOsy([a, b], 'siroka');
    expect(r.mince[0].x).toBe(r.mince[1].x);
    expect(r.mince[0].rada).not.toBe(r.mince[1].rada);
    expect(r.rad).toBe(2);
  });
  it('Seneca a Epiktétos se na telefonu rozestoupí do dvou řádků; vzdálený hlas zůstane v prvním', () => {
    const o = OTAZKY.find((x) => x.slug === 'ma-zivot-smysl')!;
    const u = rozlozeniOsy(o.hlasy, 'uzka');
    const rada = (id: string) => u.mince.find((m) => m.id === id)!.rada;
    expect(rada('seneca')).not.toBe(rada('epiktetos'));
    expect(rada('seneca')).toBe(0);
  });
  it('úzká kresba nemá jména (nese je výzva), širší ano', () => {
    const o = OTAZKY[0];
    expect(rozlozeniOsy(o.hlasy, 'uzka').mince.every((m) => !m.popisek)).toBe(true);
    expect(rozlozeniOsy(o.hlasy, 'siroka').mince.every((m) => !!m.popisek)).toBe(true);
  });
  it('kresby nejsou vyšší, než je třeba: nejvýš čtyři řádky', () => {
    for (const o of OTAZKY) {
      expect(rozlozeniOsy(o.hlasy, 'uzka').rad, o.slug).toBeLessThanOrEqual(4);
      expect(rozlozeniOsy(o.hlasy, 'siroka').rad, o.slug).toBeLessThanOrEqual(4);
    }
  });
});

describe('osa hlasů: letopočty, zlom a dnešek', () => {
  it('značky jsou bez roku nula, éra jen u posledního roku př. n. l. a prvního n. l.', () => {
    for (const o of OTAZKY) {
      for (const s of SIRKY) {
        const z = rozlozeniOsy(o.hlasy, s).znacky;
        expect(z.length, `${o.slug} ${s}`).toBeGreaterThan(0);
        expect(z.some((x) => /^0\b/.test(x.text))).toBe(false);
        const s_era = z.filter((x) => /n\.\u00a0l\.$/.test(x.text));
        expect(s_era.length).toBeGreaterThanOrEqual(1);
        expect(s_era.length).toBeLessThanOrEqual(2);
        for (let i = 1; i < z.length; i++) expect(z[i].x).toBeGreaterThan(z[i - 1].x);
        // Popisky značek se nepotkají a nevyjedou za konec měřítka.
        const R = ROZMERY[s];
        const kon = rozlozeniOsy(o.hlasy, s).konec;
        for (let i = 0; i < z.length; i++) {
          expect(z[i].x + sirkaTextu(z[i].text, R.pismo) / 2).toBeLessThanOrEqual(kon + 4);
          if (i) expect(z[i - 1].x + sirkaTextu(z[i - 1].text, R.pismo) / 2).toBeLessThan(z[i].x - sirkaTextu(z[i].text, R.pismo) / 2);
        }
      }
    }
  });
  it('osa přes přelom letopočtu má na každé šířce značku „1 n. l.“; každá kresba aspoň dvě značky', () => {
    let presPrelom = 0;
    for (const o of OTAZKY) {
      const p = o.hlasy.map((h) => polohaHlasu(h)!);
      const prelom = Math.min(...p.map((x) => x.od)) <= 0 && Math.max(...p.map((x) => x.do)) >= 1;
      if (prelom) presPrelom++;
      for (const s of SIRKY) {
        const z = rozlozeniOsy(o.hlasy, s).znacky.map((x) => bezNb(x.text));
        expect(z.length, `${o.slug} ${s}: ${z.join(' | ')}`).toBeGreaterThanOrEqual(2);
        if (prelom) {
          expect(z, `${o.slug} ${s}`).toContain('1 n. l.');
          expect(z.some((t) => t.endsWith('př. n. l.')), `${o.slug} ${s}: ${z.join(' | ')}`).toBe(true);
        }
      }
    }
    // Šest stránek sahá přes přelom (revize R: na telefonu u nich chyběl letopočet n. l.).
    expect(presPrelom).toBe(6);
  });
  it('osa přes přelom letopočtu má éru dvakrát', () => {
    const o = OTAZKY.find((x) => x.slug === 'kdo-vlastne-jsem')!;
    const z = rozlozeniOsy(o.hlasy, 'siroka').znacky.map((x) => bezNb(x.text));
    expect(z.filter((t) => t.endsWith('př. n. l.'))).toHaveLength(1);
    expect(z.filter((t) => / n\. l\.$/.test(t) && !t.endsWith('př. n. l.'))).toHaveLength(1);
  });
  it('do dneška: od konce posledního života, zaokrouhleně, s „asi“', () => {
    expect(zaokrouhliLeta(1846)).toBe(1850);
    expect(zaokrouhliLeta(321)).toBe(320);
    expect(zaokrouhliLeta(66)).toBe(66);
    const kdo = OTAZKY.find((x) => x.slug === 'kdo-vlastne-jsem')!;
    expect(letDoDneska(kdo.hlasy)).toEqual({ let: 1850, asi: true });
    expect(bezNb(rozlozeniOsy(kdo.hlasy, 'uzka').doDneska)).toBe('asi 1 850 let');
    // Aristotelés zemřel 322 př. n. l.: do roku 2026 je to 2 347 let.
    const skut = OTAZKY.find((x) => x.slug === 'co-je-skutecne')!;
    expect(letDoDneska(skut.hlasy)).toEqual({ let: 2350, asi: true });
    expect(ROK_DNES).toBe(2026);
  });
  it('popis pro čtečky říká rozsah a dnešek', () => {
    const kdo = OTAZKY.find((x) => x.slug === 'kdo-vlastne-jsem')!;
    // Hérakleitův rok narození je přibližný, Markův rok smrti ne.
    expect(bezNb(popisOsy(kdo.hlasy))).toBe('Hlasy na ose času v poměru let, od roku asi 540 př. n. l. do roku 180 n. l., a pak asi 1 850 let do dneška.');
  });
  it('čísla od tisíce mají nezlomitelnou mezeru', () => {
    expect(cislo(2300)).toBe(`2${NB}300`);
    expect(cislo(850)).toBe('850');
  });
});

describe('osa hlasů: věty po volbě', () => {
  it('Epikúros: vzdálenost do dneška a přirovnání k životům', () => {
    expect(bezNb(vetaOVzdalenosti(hlas('epikuros')))).toBe(
      'Od Epikúra tě dělí asi 2 300 let. To je víc než 30 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.',
    );
  });
  it('Hipparchia (jen doba činnosti, žena)', () => {
    expect(bezNb(vetaOVzdalenosti(hlas('hipparchia')))).toBe(
      'Od Hipparchie tě dělí asi 2 350 let. To je víc než 31 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako ona.',
    );
  });
  it('Marcus Aurelius (po n. l.)', () => {
    expect(bezNb(vetaOVzdalenosti(hlas('marcus-aurelius')))).toBe(
      'Od Marca Aurelia tě dělí asi 1 850 let. To je víc než 24 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.',
    );
  });
  it('bez 2. pádu jméno v 1. pádě', () => {
    const h = { ...hlas('epikuros'), jmeno2: undefined };
    expect(bezNb(vetaOVzdalenosti(h))).toMatch(/^Epikúros žil asi před 2 300 lety\./);
  });
  it('nejdál od sebe na každé otázce', () => {
    const cekane: Record<string, string> = {
      'jak-zit': 'Nejdál od sebe tu žili Diogenés a Seneca: dělí je asi 320 let.',
      'kdo-vlastne-jsem': 'Nejdál od sebe tu žili Hérakleitos a Marcus Aurelius: dělí je asi 600 let.',
    };
    for (const o of OTAZKY) {
      const v = bezNb(vetaONejdelsiVzdalenosti(o.hlasy));
      // Jedna věta, zaokrouhlená jako první (zaokrouhliLeta), bez druhého „To je … lidských životů“.
      expect(v, o.slug).toMatch(/^Nejdál od sebe tu žili \S.* a \S.*: dělí je (asi )?\d+ (let|roky|rok)\.$/);
      if (cekane[o.slug]) expect(v, o.slug).toBe(cekane[o.slug]);
    }
  });
  it('kdo spolu žili, nedostanou větu o vzdálenosti', () => {
    expect(vetaONejdelsiVzdalenosti([hlas('platon'), hlas('aristoteles')])).toBeNull();
    expect(vetaONejdelsiVzdalenosti([hlas('platon')])).toBeNull();
  });
  it('vetyPoVolbe: hlas, nikdo, nic, neznámé id', () => {
    const o = OTAZKY.find((x) => x.slug === 'jak-zit')!;
    const v = vetyPoVolbe('epikuros', o.hlasy);
    expect(v.vzdalenost).toBeTruthy();
    expect(v.nejdal).toBeTruthy();
    expect(vetyPoVolbe(NIKDO, o.hlasy)).toEqual({ nikdo: true });
    expect(vetyPoVolbe(null, o.hlasy)).toEqual({});
    expect(vetyPoVolbe('sokrates', o.hlasy)).toEqual({});
    expect(bezNb(VETA_NIKDO.text)).toMatch(/v oddílu $/);
  });
  it('věty mají nezlomitelnou mezeru za jednopísmennou spojkou', () => {
    const o = OTAZKY.find((x) => x.slug === 'jak-zit')!;
    expect(vetaONejdelsiVzdalenosti(o.hlasy)).toContain(` a${NB}Seneca`);
  });
});

describe('osa hlasů: volba v deníku', () => {
  const hlasy = ['epikuros', 'seneca'];
  it('čte id hlasu a „nikdo“', () => {
    expect(volbaZeStavu(stavZVolby('epikuros'), hlasy)).toBe('epikuros');
    expect(volbaZeStavu(stavZVolby(NIKDO), hlasy)).toBe(NIKDO);
  });
  it('neznámé id, cizí hlas a poškozený stav jsou null', () => {
    expect(volbaZeStavu({ volba: 'platon' }, hlasy)).toBeNull();
    expect(volbaZeStavu({ volba: 'neexistuje' }, hlasy)).toBeNull();
    expect(volbaZeStavu({ volba: 3 }, hlasy)).toBeNull();
    expect(volbaZeStavu('epikuros', hlasy)).toBeNull();
    expect(volbaZeStavu(['epikuros'], hlasy)).toBeNull();
    expect(volbaZeStavu(undefined, hlasy)).toBeNull();
    expect(volbaZeStavu(null, hlasy)).toBeNull();
  });
});
