// Pojmy (design-v2, krok P): data v src/content/pojmy odpovídají schématu, prameny jsou v zdroje.yaml, každé
// vyznačení <Pojem> v textech je ve výskytech a každý výskyt má na stránce tvar slova; jen první výskyt na stránce
// a nejvýš jeden pojem v odstavci. K tomu adresy výskytů a české tvary jmen pro hledání.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { pramenyPodleId, data } from '../../src/lib/data';
import { Pojem, adresaVyskytu, klicSouboru, tvaryJmena, adresaPojmu } from '../../src/lib/pojmy';

const C = 'src/content';
const pojmy = readdirSync(`${C}/pojmy`)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  .map((f) => ({ id: f.replace(/\.md$/, ''), data: parse(readFileSync(`${C}/pojmy/${f}`, 'utf8').split(/^---$/m)[1]) }));
const podleId = new Map(pojmy.map((p) => [p.id, Pojem.parse(p.data)]));

function vsechnySoubory(slozka: string): string[] {
  return readdirSync(slozka, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? vsechnySoubory(join(slozka, d.name)) : /\.mdx?$/.test(d.name) && !d.name.startsWith('_') ? [join(slozka, d.name)] : []);
}
const texty = vsechnySoubory(C).filter((f) => !f.includes('/pojmy/')).map((f) => {
  const t = readFileSync(f, 'utf8');
  return { soubor: f, klic: klicSouboru(f), body: t.split(/^---$/m).slice(2).join('---') };
});
const podleKlice = new Map(texty.filter((t) => t.klic).map((t) => [t.klic!, t]));
const vyznaceni = texty.flatMap((t) => [...t.body.matchAll(/<Pojem id="([^"]+)">([^<]*)<\/Pojem>/g)].map((m) => ({ ...t, id: m[1], slovo: m[2] })));

describe('data pojmů', () => {
  it('každý pojem odpovídá schématu a má aspoň dvacet pět sousedů', () => {
    const chyby = pojmy.flatMap((p) => { const r = Pojem.safeParse(p.data); return r.success ? [] : [`${p.id}: ${r.error.message}`]; });
    expect(chyby).toEqual([]);
    expect(pojmy.length).toBeGreaterThanOrEqual(25);
  });

  it('prameny pojmů jsou v zdroje.yaml', () => {
    const chybi = [...podleId].flatMap(([id, p]) => p.prameny.filter((z) => !pramenyPodleId.has(z)).map((z) => `${id}: ${z}`));
    expect(chybi).toEqual([]);
  });

  it('každý výskyt vede na existující stránku a stojí na ní tvar slova', () => {
    const chyby: string[] = [];
    for (const [id, p] of podleId) {
      const tvary = [p.pojem, ...p.tvary].map((t) => t.toLocaleLowerCase('cs'));
      for (const v of p.vyskyty) {
        const t = podleKlice.get(v);
        if (!t) { chyby.push(`${id}: ${v} (stránka neexistuje)`); continue; }
        const text = t.body.toLocaleLowerCase('cs');
        const najde = tvary.some((tvar) => new RegExp(`(?<![\\p{L}])${tvar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`, 'u').test(text));
        if (!najde) chyby.push(`${id}: ${v} (slovo na stránce není)`);
      }
    }
    expect(chyby).toEqual([]);
  });

  it('vysvětlení nezačínají všechna stejně (žádná slovníková šablona)', () => {
    const zacatky = [...podleId.values()].map((p) => p.vysvetleni.split(' ').slice(0, 2).join(' '));
    const nejcastejsi = Math.max(...Object.values(zacatky.reduce<Record<string, number>>((a, z) => ({ ...a, [z]: (a[z] ?? 0) + 1 }), {})));
    expect(nejcastejsi).toBeLessThanOrEqual(2);
  });
});

describe('vyznačení v textech', () => {
  it('každý vyznačený pojem existuje a jeho stránka je mezi výskyty', () => {
    const chyby = vyznaceni.flatMap((v) => {
      const p = podleId.get(v.id);
      if (!p) return [`${v.soubor}: pojem ${v.id} není`];
      return p.vyskyty.includes(v.klic!) ? [] : [`${v.soubor}: ${v.id} chybí ve výskytech (${v.klic})`];
    });
    expect(chyby).toEqual([]);
    expect(vyznaceni.length).toBeGreaterThanOrEqual(50);
  });

  it('každý pojem je na stránce vyznačený nejvýš jednou', () => {
    const pocty = new Map<string, number>();
    for (const v of vyznaceni) pocty.set(`${v.soubor} ${v.id}`, (pocty.get(`${v.soubor} ${v.id}`) ?? 0) + 1);
    expect([...pocty].filter(([, n]) => n > 1)).toEqual([]);
  });

  it('v jednom odstavci nestojí dva pojmy a pojem nestojí v nadpisu', () => {
    const chyby: string[] = [];
    for (const t of texty) {
      for (const odst of t.body.split(/\n\s*\n/)) {
        const n = (odst.match(/<Pojem /g) ?? []).length;
        if (n > 1) chyby.push(`${t.soubor}: ${n} pojmy v odstavci „${odst.trim().slice(0, 60)}…“`);
        if (n && /^\s*#/m.test(odst.split('\n').find((r) => r.includes('<Pojem ')) ?? '')) chyby.push(`${t.soubor}: pojem v nadpisu`);
      }
    }
    expect(chyby).toEqual([]);
  });

  it('soubor s pojmem komponentu importuje', () => {
    const bez = texty.filter((t) => t.body.includes('<Pojem ') && !t.body.includes("components/ui/Pojem.astro'")).map((t) => t.soubor);
    expect(bez).toEqual([]);
  });
});

describe('adresy a tvary', () => {
  it('klíč výskytu ze souboru a adresa stránky', () => {
    expect(klicSouboru('src/content/osobnosti/sokrates.mdx')).toBe('osobnost/sokrates');
    expect(klicSouboru('src/content/cesty/kolik-je-dost/3-kde-ma-slast-strop.mdx')).toBe('cesta/kolik-je-dost/3');
    expect(klicSouboru('src/content/cesty/kolik-je-dost.mdx')).toBe('cesta/kolik-je-dost');
    expect(klicSouboru('src/content/bloky/x.yaml')).toBeUndefined();
    expect(adresaVyskytu('osobnost/sokrates')).toBe('/osobnost/sokrates/');
    expect(adresaVyskytu('cesta/kolik-je-dost/3')).toBe('/cesta/kolik-je-dost/3/');
    expect(adresaVyskytu('uvod/co-je-filozofie')).toBe('/co-je-filozofie/');
    expect(adresaVyskytu('uvod/co-je-nabozenstvi')).toBe('/nabozenstvi/');
    expect(adresaVyskytu('smer/stoicismus')).toBe('/smer/stoicismus/');
    expect(adresaPojmu('ctnost')).toBe('/pojem/ctnost/');
  });

  it('adresy úvodů existují jako stránky', () => {
    expect(existsSync('src/pages/co-je-filozofie.astro')).toBe(true);
    expect(existsSync('src/pages/nabozenstvi/index.astro')).toBe(true);
  });

  it('české tvary jmen pro hledání', () => {
    expect(tvaryJmena('Sókratés', 'Sókrata')).toEqual(['Sókrata', 'Sókratovi', 'Sókratem']);
    expect(tvaryJmena('Seneca', 'Seneky')).toEqual(['Seneky', 'Senekovi', 'Senekou']);
    expect(tvaryJmena('Hipparchia', 'Hipparchie')).toEqual(['Hipparchie', 'Hipparchii', 'Hipparchií']);
    expect(tvaryJmena('Marcus Aurelius', 'Marca Aurelia')).toEqual(['Marca Aurelia', 'Marcovi Aureliovi', 'Marcem Aureliem']);
    expect(tvaryJmena('Konfucius')).toEqual([]);
  });

  it('každá osoba s druhým pádem dostane aspoň tři tvary', () => {
    const malo = data.lide.filter((o) => o.jmeno2 && o.jmeno2 !== o.jmeno && tvaryJmena(o.jmeno, o.jmeno2).length < 3).map((o) => o.id);
    expect(malo).toEqual([]);
  });
});
