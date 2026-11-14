// Stůl na Domů (design-v2, K6, bod 10): co se na stole střídá po dnech (dnešní pokus, pohlednice s příběhem)
// a odkud se to bere. Čisté funkce; vyberDne se vkládá i do skriptu před vykreslením (jako text funkce),
// takže smí sahat jen na své parametry.

/** Index věci pro dnešní den (podle data v čase prohlížeče): každý den další, dokola. */
export function vyberDne(ted: number, pocet: number): number {
  if (!(pocet > 0)) return 0;
  var den = Math.floor((ted - new Date(ted).getTimezoneOffset() * 60000) / 86400000);
  return ((den % pocet) + pocet) % pocet;
}

/** Zkratky, po kterých tečka větu nekončí („423 př. n. l. hrála…“, „tzv.“, „např.“). */
const ZKRATKY = new Set(['př', 'n', 'l', 'tzv', 'např', 'sv', 'r', 'st', 'tj', 'resp']);

/** Věty textu: konec je tečka, otazník, vykřičník nebo trojtečka a za ní mezera a velké písmeno (nebo konec textu). */
export function vety(text: string): string[] {
  const t = text.replace(/\s+/g, ' ').trim();
  const vysledek: string[] = [];
  let od = 0;
  const hranice = /[.!?…]+(?= \p{Lu}| „|$)/gu;
  for (const m of t.matchAll(hranice)) {
    const konec = m.index! + m[0].length;
    const slovo = /(\p{L}+)$/u.exec(t.slice(od, m.index!))?.[1]?.toLowerCase();
    if (m[0] === '.' && slovo && ZKRATKY.has(slovo)) continue;
    vysledek.push(t.slice(od, konec).trim());
    od = konec;
  }
  if (od < t.length) vysledek.push(t.slice(od).trim());
  return vysledek.filter(Boolean);
}

/** První věta textu (zkratky letopočtu větu nekončí). */
export function prvniVeta(text: string): string {
  return vety(text)[0] ?? text.trim();
}

/** Nejvýš tolik znaků smí mít úryvek na pohlednici, aby se dal přečíst na jeden pohled. */
export const DELKA_URYVKU = 320;

/**
 * Úryvek příběhu na pohlednici: celé věty od začátku, dokud se vejdou do DELKA_URYVKU, aspoň dvě věty,
 * aby úryvek dovedl scénu k něčemu, kvůli čemu chce student číst dál (nikdy useknutá věta).
 */
export function uryvek(text: string): string {
  const v = vety(text);
  let u = v[0] ?? '';
  for (let i = 1; i < v.length; i++) {
    const dalsi = `${u} ${v[i]}`;
    if (i >= 2 && dalsi.length > DELKA_URYVKU) break;
    u = dalsi;
  }
  return u;
}

export interface Pohlednice {
  obdobi: number;
  /** místo a rok scény („Řím, 155 př. n. l.“) */
  kde: string;
  titulek: string;
  /** úryvek příběhu (celé věty, uryvek) */
  text: string;
  osoba?: string;
  adresa: string;
}

/** Atribut značky v MDX: nazev="…" (bez uvozovek uvnitř). */
const atribut = (znacka: string, nazev: string) => new RegExp(`\\b${nazev}="([^"]*)"`).exec(znacka)?.[1];

/**
 * Pohlednice z úvodní scény stránky období: první <Pribeh …> v textu MDX (nadtitulek je místo a rok, titulek
 * název, první věta textu). Kurzíva v titulku (*…*) se z textu vypustí. Bez příběhu žádná pohlednice.
 */
export function pohledniceZObdobi(mdx: string, obdobi: { id: number }, adresa: string): Pohlednice[] {
  const m = /<Pribeh\b([^>]*)>([\s\S]*?)<\/Pribeh>/.exec(mdx);
  if (!m) return [];
  const titulek = atribut(m[1], 'titulek')?.replace(/\*/g, '');
  const kde = atribut(m[1], 'nadtitulek');
  const odstavec = m[2].split(/\n\s*\n/).map((x) => x.trim()).find((x) => x && !x.startsWith('<') && !x.startsWith('{'));
  if (!titulek || !kde || !odstavec) return [];
  const osoba = atribut(m[1], 'osoba');
  return [{ obdobi: obdobi.id, kde, titulek, text: uryvek(odstavec.replace(/\*+/g, '')), ...(osoba ? { osoba } : {}), adresa }];
}

/**
 * Nadpis kartičky s pokusem: otázka, kterou pokus klade, když jí perex začíná („Co bys dělal, kdybys byl
 * neviditelný…?“); jinak první věta. Zbytek je druhá věta (nebo nic), aby kartička neopakovala nadpis.
 */
export function otazkaPokusu(perex: string): { titulek: string; zbytek?: string } {
  const [prvni = perex.trim(), druha] = vety(perex);
  return { titulek: prvni, ...(druha ? { zbytek: druha } : {}) };
}
