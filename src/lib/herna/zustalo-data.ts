// Co ti zůstalo? z dat (denik-v2, K2): čte pojmy, Páry, stránky velkých otázek a kroky cest jako text (import.meta.glob),
// takže totéž skládání běží při sestavení stránky, ve Vitestu i ve výpisu pro autora (scripts/zustalo-vypis.ts).
// Kontrola (chybyZustalo) zastaví sestavení dřív, než se otázka dostane ke studentovi.
import { parse } from 'yaml';
import { osoby, citatyPodleId } from '../data';
import { tvaryJmena } from '../pojmy';
import { adresaOtazky } from '../otazky';
import { adresaCesty, adresaKroku } from '../cesty';
import { NAZVY_KRESEB, VETY_KRESEB } from '../kresby';
import { duvodZMyslenky } from '../tvoje-obdobi';
import {
  chybyZustalo, otazkyHlasu, otazkyKreseb, otazkyPojmu, pripadZTextu, vetaPredKresbou,
  type KatalogZustalo, type KresbaVstup, type OdkazZustalo, type OtazkaVstup, type PojemVstup, type ParyVstup,
} from './zustalo';

const surove = (g: Record<string, unknown>) => Object.entries(g).map(([cesta, text]) => ({ cesta, text: String(text) }));
const POJMY = surove(import.meta.glob('../../content/pojmy/[^_]*.md', { query: '?raw', import: 'default', eager: true }));
const BLOKY = surove(import.meta.glob('../../content/bloky/*.yaml', { query: '?raw', import: 'default', eager: true }));
const OTAZKY = surove(import.meta.glob('../../content/otazky/[^_]*.{md,mdx}', { query: '?raw', import: 'default', eager: true }));
const CESTY = surove(import.meta.glob('../../content/cesty/[^_]*.mdx', { query: '?raw', import: 'default', eager: true }));
const KROKY = surove(import.meta.glob('../../content/cesty/*/[^_]*.mdx', { query: '?raw', import: 'default', eager: true }));
const NAZVY = surove(import.meta.glob('../../content/{smery,pokusy,obdobi,nabozenstvi,uvody}/[^_]*.{md,mdx}', { query: '?raw', import: 'default', eager: true }));

const jmenoSouboru = (c: string) => c.split('/').pop()!.replace(/\.(mdx?|yaml)$/, '');
/** Frontmatter a tělo souboru MD/MDX. */
function rozeber(text: string): { fm: Record<string, unknown>; body: string } {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return m ? { fm: (parse(m[1]) ?? {}) as Record<string, unknown>, body: m[2] } : { fm: {}, body: text };
}

export interface VstupZustalo {
  pojmy: PojemVstup[];
  pary: ParyVstup[];
  otazky: OtazkaVstup[];
  kresby: KresbaVstup[];
  velke: { cislo: number; otazka: string }[];
  cesty: { slug: string; nazev: string; cislo: number; otazka: number; pocet: number }[];
  kroky: { cesta: string; krok: number; nazev: string }[];
  nazvy: Map<string, string>;
}

/** Vstup pro skládání z textu kolekcí, jen pro dané období (antika: 1 a 2). */
export function vstupZustalo(obdobi: readonly number[]): VstupZustalo {
  const pojmy: PojemVstup[] = POJMY.map(({ cesta, text }) => {
    const fm = rozeber(text).fm as Record<string, never>;
    return {
      id: jmenoSouboru(cesta), pojem: fm.pojem, vysvetleni: fm.vysvetleni, uKoho: fm.uKoho ?? [], priklad: fm.priklad,
      vyskyty: fm.vyskyty ?? [], obdobi: fm.obdobi ?? [], tvary: fm.tvary ?? [],
    };
  });
  const pary: ParyVstup[] = BLOKY.flatMap(({ cesta, text }) => {
    const b = parse(text) as { druh?: string; obdobi?: number; pary?: { pojem: string; situace: string }[] };
    return b?.druh === 'pary' && (!b.obdobi || obdobi.includes(b.obdobi)) ? [{ id: jmenoSouboru(cesta), pary: b.pary ?? [] }] : [];
  });

  const cestyVse = CESTY.map(({ cesta, text }) => ({ slug: jmenoSouboru(cesta), fm: rozeber(text).fm as { cislo: number; nazev: string; obdobi: number; otazka: number } }));
  const kroky = KROKY.map(({ text }) => {
    const { fm, body } = rozeber(text);
    return { cesta: fm.cesta as string, krok: fm.krok as number, nazev: fm.nazev as string, body };
  });
  const cesty = cestyVse
    .filter((c) => obdobi.includes(c.fm.obdobi))
    .sort((a, b) => a.fm.cislo - b.fm.cislo)
    .map((c) => ({ slug: c.slug, nazev: c.fm.nazev, cislo: c.fm.cislo, otazka: c.fm.otazka, pocet: kroky.filter((k) => k.cesta === c.slug).length }));
  const slugyCest = new Set(cesty.map((c) => c.slug));

  const otazkyVse = OTAZKY.map(({ cesta, text }) => {
    const { fm, body } = rozeber(text);
    return { slug: jmenoSouboru(cesta), fm: fm as { cislo: number; otazka: string; pripad?: string; hlasy?: { osoba: string; odpoved: string; myslenka: string; citat?: string }[] }, body };
  });
  const otazky: OtazkaVstup[] = otazkyVse.map((o) => ({
    slug: o.slug,
    cislo: o.fm.cislo,
    otazka: o.fm.otazka,
    adresa: adresaOtazky(o.slug, { hlasy: o.fm.hlasy as never }),
    ...(o.fm.pripad ? { pripad: o.fm.pripad } : {}),
    pripadText: pripadZTextu(o.body),
    hlasy: (o.fm.hlasy ?? []).flatMap((h) => {
      const os = osoby.get(h.osoba);
      if (!os || !obdobi.includes(os.obdobi)) return [];
      const c = h.citat ? citatyPodleId.get(h.citat) : undefined;
      const vysvetleni = c ? `„${c.cesky.trim()}“ (${c.autor}, ${c.dilo} ${c.misto})` : (duvodZMyslenky(h.myslenka) ?? '');
      return [{
        osoba: h.osoba, jmeno: os.jmeno, tvaryJmena: [os.jmeno, ...os.jmeno.split(' ').filter((s) => s.length > 3), ...(os.jmeno2 ? [os.jmeno2] : []), ...tvaryJmena(os.jmeno, os.jmeno2)],
        ...(os.zena ? { zena: true } : {}), ...(os.smery?.[0] ? { smer: os.smery[0] } : {}), odpoved: h.odpoved, vysvetleni,
      }];
    }),
  }));
  const cislaCest = new Set(cesty.map((c) => c.otazka));
  const velke = otazkyVse.filter((o) => cislaCest.has(o.fm.cislo)).sort((a, b) => a.fm.cislo - b.fm.cislo).map((o) => ({ cislo: o.fm.cislo, otazka: o.fm.otazka }));

  const kresby: KresbaVstup[] = [];
  for (const komponenta of Object.keys(NAZVY_KRESEB) as (keyof typeof NAZVY_KRESEB)[]) {
    const k = kroky.filter((x) => slugyCest.has(x.cesta)).sort((a, b) => a.cesta.localeCompare(b.cesta) || a.krok - b.krok).find((x) => new RegExp(`<${komponenta}[\\s/>]`).test(x.body));
    const c = k && cesty.find((x) => x.slug === k.cesta);
    if (!k || !c) continue;
    const veta = VETY_KRESEB[komponenta] ?? vetaPredKresbou(k.body, komponenta);
    kresby.push({ komponenta, nazev: NAZVY_KRESEB[komponenta], ...(veta ? { veta } : {}), cesta: { slug: c.slug, nazev: c.nazev, otazka: c.otazka }, krok: { n: k.krok, nazev: k.nazev } });
  }

  const nazvy = new Map<string, string>();
  for (const { cesta, text } of NAZVY) {
    const druh = { smery: 'smer', pokusy: 'pokus', obdobi: 'obdobi', nabozenstvi: 'nabozenstvi', uvody: 'uvod' }[cesta.split('/').at(-2)!];
    const n = rozeber(text).fm.nazev;
    if (druh && typeof n === 'string') nazvy.set(`${druh}/${jmenoSouboru(cesta)}`, n);
  }
  return { pojmy, pary, otazky, kresby, velke, cesty, kroky: kroky.map(({ cesta, krok, nazev }) => ({ cesta, krok, nazev })), nazvy };
}

/** Odkaz zpět pro klíč „potkal“: krok cesty, cesta, nebo stránka (profil, pojem, otázka, směr…). */
function odkazNaMisto(klic: string, v: VstupZustalo): OdkazZustalo | undefined {
  const cesta = klic.match(/^cesta\/([a-z0-9-]+)(?:\/(\d+))?$/);
  if (cesta) {
    const c = v.cesty.find((x) => x.slug === cesta[1]);
    if (!c) return undefined;
    return cesta[2] ? { href: adresaKroku(c.slug, Number(cesta[2])), text: `Zpátky do kroku ${cesta[2]} cesty ${c.nazev}` } : { href: adresaCesty(c.slug), text: `Zpátky do cesty ${c.nazev}` };
  }
  const [, druh, id] = klic.split('/');
  if (druh === 'osobnost') {
    const o = osoby.get(id);
    return o ? { href: klic, text: `Zpátky na stránku ${o.jmeno2 ?? o.jmeno}` } : undefined;
  }
  if (druh === 'otazka') {
    const o = v.otazky.find((x) => x.slug === id);
    return o ? { href: klic, text: `Zpátky k otázce ${o.otazka}` } : undefined;
  }
  if (druh === 'pojem') {
    const p = v.pojmy.find((x) => x.id === id);
    return p ? { href: klic, text: `Zpátky k pojmu ${p.pojem}` } : undefined;
  }
  const n = v.nazvy.get(`${druh}/${id}`) ?? (druh === 'nabozenstvi' && !id ? v.nazvy.get('uvod/co-je-nabozenstvi') : undefined);
  return n ? { href: klic, text: `Zpátky na stránku ${n}` } : undefined;
}

/** Katalog kvízu pro období; chyby kontroly vyhodí výjimku (zastaví sestavení). */
export function katalogZustalo(obdobi: readonly number[]): KatalogZustalo {
  const v = vstupZustalo(obdobi);
  const otazky = [...otazkyPojmu(v.pojmy, v.pary, obdobi), ...otazkyHlasu(v.otazky), ...otazkyKreseb(v.kresby, v.velke)];
  const chyby = chybyZustalo(otazky, v.pojmy);
  if (chyby.length) throw new Error(`Co ti zůstalo? neprošlo kontrolou:\n- ${chyby.join('\n- ')}`);
  const mista: Record<string, OdkazZustalo> = {};
  for (const k of new Set(otazky.flatMap((o) => o.potkal))) {
    const odkaz = odkazNaMisto(k, v);
    if (odkaz) mista[k] = odkaz;
  }
  return {
    otazky,
    mista,
    cesty: v.cesty.map((c) => {
      const o = v.otazky.find((x) => x.cislo === c.otazka);
      return { slug: c.slug, nazev: c.nazev, adresa: adresaCesty(c.slug), pocet: c.pocet, ...(o ? { otazka: o.adresa } : {}) };
    }),
  };
}
