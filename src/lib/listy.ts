// Čtení a dělání vypadají jinak (design-v2, K3 dodatek, bod 1 z Vizuálních zlepšení): souvislý text kapitoly
// leží na čistém listu vlepeném do zápisníku, aktivity (bloky, kresby, ostrovy) mezi listy zůstávají na tečkách.
// Kapitola.astro vykreslí svůj obsah do řetězce a tahle funkce ho rozdělí na úseky; čte jen prvky nejvyšší
// úrovně (odstavce z MDX, citáty, bloky), dovnitř bloků nesahá. Čisté funkce bez DOM, testy v tests/data/listy.test.ts.

const PRAZDNE = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const SUROVE = new Set(['script', 'style', 'textarea', 'title']);
/** Prvky souvislého textu; citát (figure.citat) se čte s textem a leží na listu s ním. */
const TEXT = new Set(['p', 'ul', 'ol', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr', 'dl', 'table']);

export interface Uzel {
  html: string;
  /** jméno prvku malými písmeny; text a komentář ho nemají */
  tag?: string;
  /** hodnota atributu class */
  trida?: string;
}

/** Rozdělí HTML na uzly nejvyšší úrovně (prvky, text, komentáře). Počítá s HTML, jaké skládá Astro a MDX. */
export function uzlyNejvyssiUrovne(html: string): Uzel[] {
  const uzly: Uzel[] = [];
  let i = 0;
  let hloubka = 0;
  let zacatek = 0;
  let tag: string | undefined;
  let trida: string | undefined;
  const konecZnacky = (od: number): number => {
    let uvozovka = '';
    for (let j = od; j < html.length; j++) {
      const z = html[j];
      if (uvozovka) { if (z === uvozovka) uvozovka = ''; }
      else if (z === '"' || z === "'") uvozovka = z;
      else if (z === '>') return j;
    }
    return html.length - 1;
  };
  while (i < html.length) {
    if (html.startsWith('<!--', i)) {
      const k = html.indexOf('-->', i + 4);
      const za = k < 0 ? html.length : k + 3;
      if (hloubka === 0) uzly.push({ html: html.slice(i, za) });
      i = za;
      continue;
    }
    if (html[i] === '<' && html[i + 1] === '/') {
      const k = konecZnacky(i);
      i = k + 1;
      hloubka = Math.max(0, hloubka - 1);
      if (hloubka === 0 && tag) { uzly.push({ html: html.slice(zacatek, i), tag, trida }); tag = undefined; }
      continue;
    }
    if (html[i] === '<' && /[a-zA-Z]/.test(html[i + 1] ?? '')) {
      const k = konecZnacky(i);
      const znacka = html.slice(i, k + 1);
      const jmeno = /^<([a-zA-Z][\w:-]*)/.exec(znacka)![1].toLowerCase();
      const samoUzavrena = znacka.endsWith('/>');
      if (hloubka === 0) {
        zacatek = i;
        tag = jmeno;
        trida = /\sclass\s*=\s*"([^"]*)"/.exec(znacka)?.[1] ?? /\sclass\s*=\s*'([^']*)'/.exec(znacka)?.[1];
      }
      i = k + 1;
      if (PRAZDNE.has(jmeno) || samoUzavrena) {
        if (hloubka === 0) { uzly.push({ html: html.slice(zacatek, i), tag, trida }); tag = undefined; }
        continue;
      }
      if (SUROVE.has(jmeno)) {
        const m = new RegExp(`</${jmeno}\\s*>`, 'i').exec(html.slice(i));
        i = m ? i + m.index + m[0].length : html.length;
        if (hloubka === 0) { uzly.push({ html: html.slice(zacatek, i), tag, trida }); tag = undefined; }
        continue;
      }
      hloubka++;
      continue;
    }
    // Text: na nejvyšší úrovni až k další značce, uvnitř prvku se jen přeskočí.
    const dalsi = html.indexOf('<', i + 1);
    const za = dalsi < 0 ? html.length : dalsi;
    if (hloubka === 0) uzly.push({ html: html.slice(i, za) });
    i = za;
  }
  return uzly;
}

/** Je uzel souvislý text (patří na list)? Prázdný text a komentář nejsou ani text, ani aktivita. */
export function druhUzlu(u: Uzel): 'text' | 'aktivita' | 'nic' {
  if (!u.tag) return u.html.trim() === '' || u.html.startsWith('<!--') ? 'nic' : 'text';
  if (TEXT.has(u.tag)) return 'text';
  if (u.tag === 'figure' && /(^|\s)citat(\s|$)/.test(u.trida ?? '')) return 'text';
  return 'aktivita';
}

export interface Usek { druh: 'text' | 'aktivita'; html: string }

/**
 * Úseky obsahu kapitoly: souvislý text (na list) a aktivity (na tečky), v pořadí stránky.
 * Prázdné uzly a komentáře se přidají k úseku, ve kterém stojí; úsek z nich samých nevznikne.
 */
export function useky(html: string): Usek[] {
  const vysledek: Usek[] = [];
  let odlozene = '';
  for (const u of uzlyNejvyssiUrovne(html)) {
    const d = druhUzlu(u);
    if (d === 'nic') { odlozene += u.html; continue; }
    const posledni = vysledek[vysledek.length - 1];
    if (posledni && posledni.druh === d) posledni.html += odlozene + u.html;
    else {
      if (posledni) posledni.html += odlozene;
      vysledek.push({ druh: d, html: (posledni ? '' : odlozene) + u.html });
    }
    odlozene = '';
  }
  if (odlozene) {
    if (vysledek.length) vysledek[vysledek.length - 1].html += odlozene;
  }
  return vysledek;
}

/** Způsoby, jak je citát na stránce přichycený (bod 7). Páska patří listům, citát ji nebere. */
export const UCHYCENI = ['sponka', 'spendlik', 'roh', 'okraj'] as const;
export type Uchyceni = (typeof UCHYCENI)[number];

/** Nejdelší citát, který smí být napsaný rukou na okraji (Pravidlo střídmosti: rukou jen poznámka). */
export const OKRAJ_NEJVYS_ZNAKU = 110;

/**
 * Uchycení citátů v pořadí na stránce: sponka, špendlík, zastrčený roh, rukou na okraji a znovu.
 * Rukou jen krátký citát, ne velký citát pod úvodem; ten okraj přeskočí a řada jde dál, ať se dva stejné nesejdou.
 */
export function uchyceniCitatu(citaty: { delka: number; velky: boolean }[]): Uchyceni[] {
  let p = 0;
  return citaty.map((c) => {
    if (UCHYCENI[p % UCHYCENI.length] === 'okraj' && (c.velky || c.delka > OKRAJ_NEJVYS_ZNAKU)) p++;
    return UCHYCENI[p++ % UCHYCENI.length];
  });
}

/**
 * Doplní citátům v HTML stránky třídu uchycení podle pořadí (citat--sponka …). Kompaktní citát nic nedostane.
 * Citát nese data-delka a data-velky (Citat.astro); vnořený citát (lepicí lístek) třídu dostane, ale CSS ji nepoužije.
 */
export function uchytCitaty(html: string): string {
  const vzor = /<figure class="citat([^"]*)"([^>]*)>/g;
  const nalezene = [...html.matchAll(vzor)].filter((m) => !/citat--kompaktni/.test(m[1]));
  const druhy = uchyceniCitatu(nalezene.map((m) => ({
    delka: Number(/data-delka="(\d+)"/.exec(m[2])?.[1] ?? 999),
    velky: /citat--velky/.test(m[1]),
  })));
  let i = 0;
  return html.replace(vzor, (cele, tridy: string, zbytek: string) => {
    if (/citat--kompaktni/.test(tridy)) return cele;
    return `<figure class="citat${tridy} citat--${druhy[i++]}"${zbytek}>`;
  });
}
