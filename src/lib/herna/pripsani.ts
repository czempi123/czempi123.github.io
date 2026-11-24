// Pravý, nebo podvržený? (herna-v1, K3): věta, která koluje pod jménem filozofa (druh záznamu pripsani
// v zdroje.yaml), jako ústřižek z obrazovky telefonu. Student otiskne razítko „řekl to“, nebo „neřekl to“; pak
// původ z dat (co doopravdy stojí v pramenu, kdo větu napsal, nebo že původ neznáme) a jedna věta, jak si citát
// příště ověřit sám. Podvržená věta nikdy nestojí bez opravy: po otisku má ústřižek proužek s opravou a souhrn
// ji nese u každé věty. Čisté funkce; ostrov src/components/ostrovy/PravyNeboPodvrzeny.svelte.
import type { TPripsani } from '../schema';

export type Razitko = 'rekl' | 'nerekl';
export const RAZITKA: Razitko[] = ['rekl', 'nerekl'];

const tvar = (zena: boolean | undefined, muz: string, zenaTvar: string) => (zena ? zenaTvar : muz);

/** Text razítka podle rodu: „řekl to“, „neřekla to“. */
export const textRazitka = (r: Razitko, zena?: boolean) => (r === 'rekl' ? tvar(zena, 'řekl to', 'řekla to') : tvar(zena, 'neřekl to', 'neřekla to'));

/** Sedí otisk? Řekl to u pravého citátu, neřekl to u ostatních. */
export const sediRazitko = (tip: Razitko, p: Pick<TPripsani, 'verdikt'>) => tip === p.verdikt;

interface CitatDat { cesky: string; autor: string; dilo: string; misto: string }

export interface PuvodKarty {
  /** první věta lístku podle druhu: „Řekl to.“, „Takhle to neřekl.“, „Napsal opak.“ */
  titulek: string;
  /** co doopravdy stojí v pramenu (skutečný citát, nebo citát původu), když ho data mají */
  /** citát z pramene s id (nůžky po verdiktu, denik-v2, K4) */
  citat?: { id: string; text: string; kde: string };
  /** kdo větu napsal, když to nebyl on: „Will Durant, The Story of Philosophy, 1926“ */
  autor?: string;
  /** popis původu z dat */
  popis: string;
  /** kde věta koluje (z dat) */
  koluje: string;
  /** proužek s opravou na ústřižku: „Neřekl to · Will Durant, 1926“ */
  oprava: string;
}

const kdeCitatu = (c: CitatDat) => `${c.autor}, ${c.dilo} ${c.misto}`;

/**
 * Původ věty z dat pro lístek a proužek na ústřižku. U pravého citátu i přepsaného a obráceného je citát to,
 * co člověk opravdu řekl (skutecne); u cizí věty citát původu, když ho data mají (Plútarchos), jinak autor a dílo.
 */
export function puvodPripsani(p: TPripsani, citaty: Map<string, CitatDat>, zena?: boolean): PuvodKarty {
  const skutecne = p.skutecne ? citaty.get(p.skutecne) : undefined;
  const puvodni = p.puvod.citat ? citaty.get(p.puvod.citat) : undefined;
  const neRekl = tvar(zena, 'Neřekl to', 'Neřekla to');
  const zaklad = { popis: p.puvod.popis, koluje: p.koluje.kde };
  switch (p.druh) {
    case 'pravy':
      return { ...zaklad, titulek: `${tvar(zena, 'Řekl to', 'Řekla to')}.`, citat: skutecne && { id: p.skutecne!, text: skutecne.cesky, kde: kdeCitatu(skutecne) }, oprava: `${tvar(zena, 'Řekl to', 'Řekla to')} · ${skutecne ? `${skutecne.dilo} ${skutecne.misto}` : 'pramen v datech'}` };
    case 'prepsany':
      return { ...zaklad, titulek: `Takhle to ${tvar(zena, 'neřekl', 'neřekla')}.`, citat: skutecne && { id: p.skutecne!, text: skutecne.cesky, kde: kdeCitatu(skutecne) }, oprava: `${neRekl} takhle · ${skutecne ? `${skutecne.dilo} ${skutecne.misto}` : 'jinými slovy'}` };
    case 'obraceny':
      return { ...zaklad, titulek: `${tvar(zena, 'Napsal', 'Napsala')} opak.`, citat: skutecne && { id: p.skutecne!, text: skutecne.cesky, kde: kdeCitatu(skutecne) }, oprava: `${neRekl} · ${tvar(zena, 'napsal', 'napsala')} opak${skutecne ? `, ${skutecne.dilo} ${skutecne.misto}` : ''}` };
    case 'cizi': {
      const rok = p.puvod.rok === undefined ? undefined : p.puvod.rok < 0 ? `${-p.puvod.rok} př. n. l.` : String(p.puvod.rok);
      const autor = [p.puvod.autor, p.puvod.dilo && `${p.puvod.dilo}${p.puvod.misto ? ` ${p.puvod.misto}` : ''}`, rok].filter(Boolean).join(', ');
      const kratce = [p.puvod.autor, rok ?? (p.puvod.misto && `${p.puvod.dilo} ${p.puvod.misto}`)].filter(Boolean).join(', ');
      return { ...zaklad, titulek: `${neRekl}. Je to věta jiného autora.`, autor, citat: puvodni && { id: p.puvod.citat!, text: puvodni.cesky, kde: kdeCitatu(puvodni) }, oprava: `${neRekl} · ${kratce}` };
    }
    case 'neznamy':
      return { ...zaklad, titulek: `${neRekl}. Odkud věta je, nevíme.`, oprava: `${neRekl} · původ neznámý` };
  }
}

/** Stav série v deníku: běžící karta a otisk u každé karty (null = ještě neotiskl). */
export interface StavPravy { karta: number; tipy: (Razitko | null)[] }

export const hotovaSeriePravy = (s: StavPravy) => s.tipy.every((t) => t !== null);

export function platnyStavPravy(s: unknown, pocet: number): StavPravy | null {
  if (!s || typeof s !== 'object') return null;
  const o = s as Partial<StavPravy>;
  if (!Number.isInteger(o.karta) || (o.karta as number) < 0 || (o.karta as number) >= pocet) return null;
  if (!Array.isArray(o.tipy) || o.tipy.length !== pocet) return null;
  const tipy = o.tipy.map((t) => (t === 'rekl' || t === 'nerekl' ? t : null));
  // Karta, na které student stojí, nesmí předbíhat neotištěnou kartu před ní.
  const prvniVolna = tipy.findIndex((t) => t === null);
  const karta = prvniVolna === -1 ? (o.karta as number) : Math.min(o.karta as number, prvniVolna);
  if (tipy.every((t) => t === null)) return null;
  return { karta, tipy };
}

/** Chyby karet: připsání není v datech nebo se opakuje. */
export function chybyPravy(karty: readonly { pripsani: string }[], pripsani: Map<string, unknown>): string[] {
  const chyby: string[] = [];
  const videno = new Set<string>();
  for (const k of karty) {
    if (!pripsani.has(k.pripsani)) chyby.push(`Pravý, nebo podvržený?: připsání „${k.pripsani}“ není v zdroje.yaml.`);
    if (videno.has(k.pripsani)) chyby.push(`Pravý, nebo podvržený?: připsání „${k.pripsani}“ je v sérii dvakrát.`);
    videno.add(k.pripsani);
  }
  return chyby;
}
