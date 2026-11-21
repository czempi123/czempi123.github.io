// Kdo by to řekl? (herna-v1, K3): dnešní věta jako výstřižek (chat, reklama, rada kamaráda). Student razítkem vybere
// filozofa, který by ji podepsal (pod jménem věta z pole proc v lide.yaml), a nepovinně připíše proč. Pak lístek
// „Atlas by vybral…“ s důvodem z pramene a s tím, kdo by větu odmítl. Volba studenta zůstává a nehodnotí se;
// do deníku jde zápis. Čisté funkce; ostrov src/components/ostrovy/KdoByToRekl.svelte.
import type { HlasZaznam } from './slabe';

/** Odkud dnešní věta je: popisek nad výstřižkem a jeho podoba (bublina chatu, nebo plakátek). */
export const ODKUD = {
  chat: { popisek: 'Zpráva v chatu', podoba: 'bublina' },
  kamarad: { popisek: 'Rada kamaráda', podoba: 'bublina' },
  komentar: { popisek: 'Komentář pod videem', podoba: 'bublina' },
  reklama: { popisek: 'Reklama', podoba: 'plakat' },
  obrazek: { popisek: 'Motivační obrázek', podoba: 'plakat' },
  sit: { popisek: 'Příspěvek na síti', podoba: 'bublina' },
} as const;
export type Odkud = keyof typeof ODKUD;

/** Otázka zápisu v deníku: otázka bloku a dnešní věta, aby zápis řekl, ke které větě patří. */
export const otazkaZapisuKdoBy = (otazka: string, veta: string) => `${otazka.trim()} „${veta.trim().replace(/[.!?]$/, '')}“`;

/** Zápis do deníku: koho student vybral a nepovinně proč. */
export function zapisKdoBy(jmeno: string, proc = ''): string {
  const p = proc.trim();
  return p ? `Můj výběr: ${jmeno}. Proč: ${p}` : `Můj výběr: ${jmeno}.`;
}

export interface StavKdoBy { osoba: string | null; proc: string; zapsano: boolean }

export function platnyStavKdoBy(s: unknown, moznosti: readonly string[]): StavKdoBy | null {
  if (!s || typeof s !== 'object') return null;
  const o = s as Partial<StavKdoBy>;
  const osoba = typeof o.osoba === 'string' && moznosti.includes(o.osoba) ? o.osoba : null;
  if (!osoba) return null;
  return { osoba, proc: typeof o.proc === 'string' ? o.proc : '', zapsano: o.zapsano === true };
}

/**
 * Chyby bloku: možnosti se neopakují a jsou v datech; každý, koho by atlas vybral, je mezi možnostmi; citát hlasu
 * je v datech a patří témuž člověku; nikdo není zároveň mezi vybranými i odmítajícími.
 */
export function chybyKdoBy(
  b: { moznosti: readonly string[]; atlas: readonly HlasZaznam[]; odmitl: readonly HlasZaznam[] },
  citaty: Map<string, { osoba?: string }>,
  osoby: Set<string>,
): string[] {
  const chyby: string[] = [];
  if (new Set(b.moznosti).size !== b.moznosti.length) chyby.push('Kdo by to řekl?: možnost se opakuje.');
  for (const o of b.moznosti) if (!osoby.has(o)) chyby.push(`Kdo by to řekl?: osoba „${o}“ není v lide.yaml.`);
  for (const h of b.atlas) if (!b.moznosti.includes(h.osoba)) chyby.push(`Kdo by to řekl?: atlas vybírá „${h.osoba}“, který mezi možnostmi není.`);
  for (const h of [...b.atlas, ...b.odmitl]) {
    const c = citaty.get(h.citat);
    if (!c) chyby.push(`Kdo by to řekl?: citát „${h.citat}“ není v zdroje.yaml.`);
    else if (c.osoba !== h.osoba) chyby.push(`Kdo by to řekl?: citát „${h.citat}“ nepatří osobě „${h.osoba}“.`);
  }
  const vybrani = new Set(b.atlas.map((h) => h.osoba));
  for (const h of b.odmitl) if (vybrani.has(h.osoba)) chyby.push(`Kdo by to řekl?: „${h.osoba}“ je mezi vybranými i odmítajícími.`);
  return chyby;
}
