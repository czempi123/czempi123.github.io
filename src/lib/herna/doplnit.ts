// Doplň citát (herna-v1, K2): z citátu ze zdroje.yaml se vystřihne jedno slovo, student do mezery vloží jedno ze tří
// vystřižených. Nejde o to trefit slovo z paměti: ke každé záměně zpětná vazba, co by věta s tím slovem tvrdila
// a čím se to liší (slova a vazby v YAML bloku, z podkladů P6). Čisté funkce; ostrov src/components/ostrovy/DoplnCitat.svelte.
import { zamichej } from './michani';

/** Citát rozdělený kolem vystřiženého slova (výskyt `vyskyt`, od 1); null, když tam slovo není jako celé slovo. */
export function rozdelCitat(text: string, slovo: string, vyskyt = 1): { pred: string; po: string } | null {
  const hranice = '[\\p{L}\\p{N}]';
  const vzor = new RegExp(`(?<!${hranice})${slovo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!${hranice})`, 'gu');
  let n = 0;
  for (const m of text.matchAll(vzor)) {
    n += 1;
    if (n === vyskyt) return { pred: text.slice(0, m.index), po: text.slice(m.index! + slovo.length) };
  }
  return null;
}

export interface ZamenaZaznam { slovo: string; vazba: string }

/** Lístky v pořadí podle semínka (id bloku): stejné při sestavení i po obnovení. */
export function listkyDoplnit(slovo: string, zameny: readonly ZamenaZaznam[], klic: string): string[] {
  return zamichej([slovo, ...zameny.map((z) => z.slovo)], klic);
}

/** Chyby bloku: citát nebo slovo chybí, záměna je stejná jako slovo nebo se opakuje. */
export function chybyDoplnit(
  b: { citat: string; slovo: string; vyskyt?: number; zameny: readonly ZamenaZaznam[] },
  citaty: Map<string, { cesky: string; osoba?: string }>,
): string[] {
  const chyby: string[] = [];
  const c = citaty.get(b.citat);
  if (!c) return [`Doplň citát: citát „${b.citat}“ není v zdroje.yaml.`];
  if (!rozdelCitat(c.cesky, b.slovo, b.vyskyt)) chyby.push(`Doplň citát: slovo „${b.slovo}“ (výskyt ${b.vyskyt ?? 1}) není v citátu „${b.citat}“.`);
  const slova = [b.slovo, ...b.zameny.map((z) => z.slovo)].map((s) => s.toLocaleLowerCase('cs'));
  if (new Set(slova).size !== slova.length) chyby.push(`Doplň citát: u „${b.citat}“ se slovo opakuje mezi lístky.`);
  return chyby;
}

/** Stav bloku: slova v pořadí, jak je student vkládal (poslední je v mezeře). */
export interface StavDoplnit { vlozeno: string[] }

export function platnyStavDoplnit(s: unknown, listky: readonly string[]): StavDoplnit | null {
  if (!s || typeof s !== 'object') return null;
  const v = (s as Partial<StavDoplnit>).vlozeno;
  if (!Array.isArray(v)) return null;
  const vlozeno = v.filter((x): x is string => typeof x === 'string' && listky.includes(x));
  return vlozeno.length ? { vlozeno } : null;
}
