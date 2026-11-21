// Najdi slabé místo (herna-v1, K3): věty argumentu na linkovaném listu (premisy a závěr, tvar jako Slož argument).
// Student přeškrtne červenou tužkou premisu, kterou nepřijímá (nebo řekne, že mu argument drží), nepovinně připíše
// proč a pak uvidí, kdo by tu větu škrtl s ním a kdo ji hájil: hlasy z dat, citát se zdrojem. Správná odpověď není.
// Do deníku jde zápis (věta a proč). Čisté funkce; ostrov src/components/ostrovy/NajdiSlabeMisto.svelte.

/** Volba „Žádnou, argument mi drží“. */
export const ZADNA = 'zadna';

export interface HlasZaznam {
  osoba: string;
  /** id citátu v zdroje.yaml; jeho osoba je tentýž člověk */
  citat: string;
  /** jedna až dvě věty: proč by ten člověk větu škrtl, nebo hájil (bez parafráze citátu) */
  proc: string;
}
export interface VetaArgumentu {
  id: string;
  text: string;
  misto: 1 | 2 | 3 | 'zaver';
  skrtl?: HlasZaznam[];
  hajil?: HlasZaznam[];
}

/** Věty v pořadí argumentu: premisy 1, 2 (3), pak závěr. */
export function poradiArgumentu<T extends { misto: 1 | 2 | 3 | 'zaver' }>(karty: readonly T[]): T[] {
  const cislo = (k: T) => (k.misto === 'zaver' ? 99 : k.misto);
  return [...karty].sort((a, b) => cislo(a) - cislo(b));
}

const bezTecky = (s: string) => s.trim().replace(/[.!?]$/, '');

/** Zápis do deníku: kterou větu student škrtl (nebo žádnou) a nepovinně proč. */
export function zapisSlabe(karty: readonly VetaArgumentu[], volba: string, proc = ''): string {
  const k = karty.find((x) => x.id === volba && x.misto !== 'zaver');
  const co = volba === ZADNA ? 'Neškrtám nic, argument mi drží.' : k ? `Škrtám větu: „${bezTecky(k.text)}“.` : '';
  if (!co) return '';
  const p = proc.trim();
  return p ? `${co} Proč: ${p}` : co;
}

export interface StavSlabe {
  /** id přeškrtnuté premisy, „zadna“, nebo null */
  volba: string | null;
  proc: string;
  /** zapsáno do deníku: ukázaly se hlasy */
  zapsano: boolean;
}

export function platnyStavSlabe(s: unknown, premisy: readonly string[]): StavSlabe | null {
  if (!s || typeof s !== 'object') return null;
  const o = s as Partial<StavSlabe>;
  const volba = typeof o.volba === 'string' && (o.volba === ZADNA || premisy.includes(o.volba)) ? o.volba : null;
  if (!volba) return null;
  return { volba, proc: typeof o.proc === 'string' ? o.proc : '', zapsano: o.zapsano === true };
}

/**
 * Chyby bloku: každá premisa má aspoň jeden hlas, který by ji škrtl; závěr hlasy nemá; citát hlasu je v datech
 * a patří témuž člověku; volba „drží mi“ má aspoň jeden hlas.
 */
export function chybySlabe(
  b: { karty: readonly VetaArgumentu[]; drzi: { hlasy: readonly HlasZaznam[] } },
  citaty: Map<string, { osoba?: string }>,
  osoby: Set<string>,
): string[] {
  const chyby: string[] = [];
  const hlas = (h: HlasZaznam, kde: string) => {
    if (!osoby.has(h.osoba)) chyby.push(`Najdi slabé místo: osoba „${h.osoba}“ (${kde}) není v lide.yaml.`);
    const c = citaty.get(h.citat);
    if (!c) chyby.push(`Najdi slabé místo: citát „${h.citat}“ (${kde}) není v zdroje.yaml.`);
    else if (c.osoba !== h.osoba) chyby.push(`Najdi slabé místo: citát „${h.citat}“ nepatří osobě „${h.osoba}“ (${kde}).`);
  };
  for (const k of b.karty) {
    if (k.misto === 'zaver') {
      if (k.skrtl?.length || k.hajil?.length) chyby.push('Najdi slabé místo: závěr nemá hlasy, škrtá se premisa.');
      continue;
    }
    if (!k.skrtl?.length) chyby.push(`Najdi slabé místo: premisa „${k.id}“ nemá nikoho, kdo by ji škrtl.`);
    for (const h of k.skrtl ?? []) hlas(h, `${k.id}, škrtl`);
    for (const h of k.hajil ?? []) hlas(h, `${k.id}, hájil`);
  }
  if (!b.drzi.hlasy.length) chyby.push('Najdi slabé místo: volba „drží mi“ nemá zastánce.');
  for (const h of b.drzi.hlasy) hlas(h, 'drží');
  return chyby;
}
