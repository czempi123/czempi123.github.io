// Kontroly dat Atlasu myšlení. Čisté funkce bez závislosti na Astru:
// používá je stavba webu (src/lib/data.ts, chyba zastaví sestavení) i testy (tests/data).
import { parse } from 'yaml';
import type { z } from 'astro/zod';
import {
  Obdobi, Osoba, Misto, Udalost, Vztah, Zdroje, Krajina,
  type TKrajina, type TMisto, type TObdobi, type TOsoba, type TUdalost, type TVztah, type TZdroje,
} from './schema';

export interface SurovaData {
  lide: string;
  mista: string;
  vztahy: string;
  udalosti: string;
  obdobi: string;
  zdroje: string;
  /** popisky krajin a moří (nepovinné kvůli starším testům) */
  krajiny?: string;
}

export interface Data {
  lide: TOsoba[];
  mista: TMisto[];
  vztahy: TVztah[];
  udalosti: TUdalost[];
  obdobi: TObdobi[];
  zdroje: TZdroje;
  krajiny: TKrajina[];
}

export interface Kontext {
  /** id směrů z kolekce src/content/smery */
  smery?: string[];
  /** id náboženských tradic z kolekce src/content/nabozenstvi (pole `tradice` u citátu) */
  tradice?: string[];
  /** existující soubory obrázků (cesty relativně k public/) */
  souboryObrazku?: string[];
}

function naformatuj(soubor: string, e: z.ZodError): string[] {
  return e.issues.map((i) => `${soubor}: ${i.path.join('.') || '(kořen)'}: ${i.message}`);
}

function nactiPole<T>(soubor: string, text: string, schema: z.ZodType<T>, chyby: string[]): T[] {
  const surove = parse(text);
  if (!Array.isArray(surove)) {
    chyby.push(`${soubor}: očekávám seznam záznamů`);
    return [];
  }
  const vysledek: T[] = [];
  surove.forEach((zaznam, i) => {
    const r = schema.safeParse(zaznam);
    if (r.success) vysledek.push(r.data);
    else chyby.push(...naformatuj(`${soubor}[${i}${zaznam?.id ? ` ${zaznam.id}` : ''}]`, r.error));
  });
  return vysledek;
}

/** Načte a ověří schémata. Vrací data a chyby schématu. */
export function nactiData(s: SurovaData): { data: Data; chyby: string[] } {
  const chyby: string[] = [];
  const lide = nactiPole('lide.yaml', s.lide, Osoba, chyby);
  const mista = nactiPole('mista.yaml', s.mista, Misto, chyby);
  const vztahy = nactiPole('vztahy.yaml', s.vztahy, Vztah, chyby);
  const udalosti = nactiPole('udalosti.yaml', s.udalosti, Udalost, chyby);
  const obdobi = nactiPole('obdobi.yaml', s.obdobi, Obdobi, chyby);
  const krajiny = s.krajiny ? nactiPole('krajiny.yaml', s.krajiny, Krajina, chyby) : [];
  const zr = Zdroje.safeParse(parse(s.zdroje));
  if (!zr.success) chyby.push(...naformatuj('zdroje.yaml', zr.error));
  const zdroje: TZdroje = zr.success ? zr.data : { prameny: [], citaty: [], obrazky: [] };
  return { data: { lide, mista, vztahy, udalosti, obdobi, zdroje, krajiny }, chyby };
}

function duplicity(soubor: string, ids: string[], chyby: string[]) {
  const videno = new Set<string>();
  for (const id of ids) {
    if (videno.has(id)) chyby.push(`${soubor}: id „${id}“ je dvakrát`);
    videno.add(id);
  }
}

/** Existující odkazy: každé id, na které data odkazují, musí existovat. */
export function kontrolaOdkazu(d: Data, k: Kontext = {}): string[] {
  const chyby: string[] = [];
  duplicity('lide.yaml', d.lide.map((o) => o.id), chyby);
  duplicity('mista.yaml', d.mista.map((m) => m.id), chyby);
  duplicity('udalosti.yaml', d.udalosti.map((u) => u.id), chyby);
  duplicity('obdobi.yaml', d.obdobi.map((o) => String(o.id)), chyby);
  duplicity('zdroje.yaml (prameny)', d.zdroje.prameny.map((p) => p.id), chyby);
  duplicity('zdroje.yaml (citáty)', d.zdroje.citaty.map((c) => c.id), chyby);
  duplicity('zdroje.yaml (obrázky)', d.zdroje.obrazky.map((o) => o.id), chyby);

  const lide = new Set(d.lide.map((o) => o.id));
  const mista = new Set(d.mista.map((m) => m.id));
  const prameny = new Set(d.zdroje.prameny.map((p) => p.id));
  const obrazky = new Set(d.zdroje.obrazky.map((o) => o.id));
  const obdobi = new Set(d.obdobi.map((o) => o.id));
  const smery = k.smery ? new Set(k.smery) : null;

  const pramen = (kde: string, id: string) => {
    if (!prameny.has(id)) chyby.push(`${kde}: pramen „${id}“ není v zdroje.yaml`);
  };

  for (const o of d.lide) {
    const kde = `lide.yaml ${o.id}`;
    o.zdroje.forEach((z) => pramen(kde, z));
    for (const m of o.mista) {
      if (!mista.has(m.misto)) chyby.push(`${kde}: místo „${m.misto}“ není v mista.yaml`);
      pramen(`${kde} (místo ${m.misto})`, m.zdroj);
    }
    if (o.atribut) pramen(`${kde} (atribut)`, o.atribut.zdroj);
    if (o.obrazek && !obrazky.has(o.obrazek)) chyby.push(`${kde}: obrázek „${o.obrazek}“ není v zdroje.yaml`);
    if (!obdobi.has(o.obdobi)) chyby.push(`${kde}: období ${o.obdobi} není v obdobi.yaml`);
    if (smery) for (const s of o.smery) if (!smery.has(s)) chyby.push(`${kde}: směr „${s}“ nemá soubor v src/content/smery`);
  }
  for (const v of d.vztahy) {
    const kde = `vztahy.yaml ${v.od} → ${v.k}`;
    if (!lide.has(v.od)) chyby.push(`${kde}: osoba „${v.od}“ není v lide.yaml`);
    if (!lide.has(v.k)) chyby.push(`${kde}: osoba „${v.k}“ není v lide.yaml`);
    if (v.od === v.k) chyby.push(`${kde}: vztah sám se sebou`);
    pramen(kde, v.zdroj);
  }
  for (const u of d.udalosti) {
    const kde = `udalosti.yaml ${u.id}`;
    if (u.misto && !mista.has(u.misto)) chyby.push(`${kde}: místo „${u.misto}“ není v mista.yaml`);
    u.obdobi.forEach((n) => obdobi.has(n) || chyby.push(`${kde}: období ${n} není v obdobi.yaml`));
    for (const o of u.osoby) if (!lide.has(o)) chyby.push(`${kde}: osoba „${o}“ není v lide.yaml`);
    pramen(kde, u.zdroj);
  }
  duplicity('krajiny.yaml', d.krajiny.map((k) => k.id), chyby);
  for (const k of d.krajiny) {
    const kde = `krajiny.yaml ${k.id}`;
    k.obdobi.forEach((n) => obdobi.has(n) || chyby.push(`${kde}: období ${n} není v obdobi.yaml`));
    pramen(kde, k.zdroj);
  }
  for (const c of d.zdroje.citaty) {
    const kde = `zdroje.yaml citát ${c.id}`;
    if (c.osoba && !lide.has(c.osoba)) chyby.push(`${kde}: osoba „${c.osoba}“ není v lide.yaml`);
    if (c.tradice && k.tradice && !k.tradice.includes(c.tradice)) chyby.push(`${kde}: tradice „${c.tradice}“ nemá soubor v src/content/nabozenstvi`);
    pramen(kde, c.zdroj);
  }
  if (k.souboryObrazku) {
    const soubory = new Set(k.souboryObrazku);
    for (const o of d.zdroje.obrazky) {
      if (!soubory.has(o.soubor)) chyby.push(`zdroje.yaml obrázek ${o.id}: soubor „${o.soubor}“ neexistuje`);
    }
  }
  return chyby;
}

/** Všechny letopočty v datech (pro kontrolu roku nula). */
function vsechnyRoky(d: Data): [string, number][] {
  const r: [string, number][] = [];
  for (const o of d.lide) {
    if (o.narozen) r.push([`${o.id} narozen`, o.narozen.rok], ...(o.narozen.rozmezi ?? []).map((x): [string, number] => [`${o.id} narozen (rozmezí)`, x]));
    if (o.zemrel) r.push([`${o.id} zemřel`, o.zemrel.rok], ...(o.zemrel.rozmezi ?? []).map((x): [string, number] => [`${o.id} zemřel (rozmezí)`, x]));
    if (o.aktivni) r.push([`${o.id} aktivní od`, o.aktivni.od], ...(o.aktivni.do !== undefined ? [[`${o.id} aktivní do`, o.aktivni.do] as [string, number]] : []));
    for (const m of o.mista) for (const k of ['rok', 'od', 'do'] as const) if (m[k] !== undefined) r.push([`${o.id} ${m.misto} ${k}`, m[k]!]);
  }
  for (const u of d.udalosti) r.push([`${u.id} od`, u.od], ...(u.do !== undefined ? [[`${u.id} do`, u.do] as [string, number]] : []));
  for (const o of d.obdobi) r.push([`období ${o.id} od`, o.okno.od], [`období ${o.id} do`, o.okno.do]);
  return r;
}

/** Časové kontroly: žádný rok nula, narození před úmrtím, pobyty uvnitř života, učitel starší než žák. */
export function kontrolaCasu(d: Data): string[] {
  const chyby: string[] = [];
  for (const [kde, rok] of vsechnyRoky(d)) if (rok === 0) chyby.push(`${kde}: rok nula neexistuje`);

  const podleId = new Map(d.lide.map((o) => [o.id, o]));
  for (const o of d.lide) {
    const n = o.narozen?.rok;
    const z = o.zemrel?.rok;
    if (n !== undefined && z !== undefined && !(n < z)) chyby.push(`${o.id}: narození (${n}) musí být před úmrtím (${z})`);
    if (o.aktivni?.do !== undefined && o.aktivni.do < o.aktivni.od) chyby.push(`${o.id}: aktivní „do“ je před „od“`);
    if (o.zemrel?.nejdrive && o.zemrel.nejpozdeji) chyby.push(`${o.id}: úmrtí nemůže být zároveň „nejdříve“ i „nejpozději“`);
    for (const r of [o.narozen?.rozmezi, o.zemrel?.rozmezi]) if (r && r[0] > r[1]) chyby.push(`${o.id}: rozmezí je obrácené`);
    for (const m of o.mista) {
      const kde = `${o.id} (${m.misto}, ${m.role})`;
      if (m.od !== undefined && m.do !== undefined && m.do < m.od) chyby.push(`${kde}: „do“ je před „od“`);
      // Pobyt musí ležet uvnitř života; u přibližných dat tolerujeme 10 let.
      const tol = o.narozen?.priblizne || o.zemrel?.priblizne || m.priblizne ? 10 : 0;
      for (const rok of [m.rok, m.od, m.do]) {
        if (rok === undefined) continue;
        if (n !== undefined && rok < n - tol) chyby.push(`${kde}: rok ${rok} je před narozením (${n})`);
        if (z !== undefined && rok > z + tol) chyby.push(`${kde}: rok ${rok} je po úmrtí (${z})`);
      }
      if (m.role === 'narozeni' && m.rok !== undefined && n !== undefined && m.rok !== n) chyby.push(`${kde}: rok narození se liší od pole narozen`);
      if (m.role === 'smrt' && m.rok !== undefined && z !== undefined && m.rok !== z) chyby.push(`${kde}: rok smrti se liší od pole zemrel`);
    }
  }
  for (const v of d.vztahy) {
    if (v.typ !== 'ucitel') continue;
    const ucitel = podleId.get(v.od)?.narozen?.rok;
    const zak = podleId.get(v.k)?.narozen?.rok;
    if (ucitel !== undefined && zak !== undefined && !(ucitel < zak)) {
      chyby.push(`vztahy.yaml ${v.od} → ${v.k}: učitel (nar. ${ucitel}) musí být starší než žák (nar. ${zak})`);
    }
  }
  for (const u of d.udalosti) if (u.do !== undefined && u.do < u.od) chyby.push(`udalosti.yaml ${u.id}: „do“ je před „od“`);
  for (const o of d.obdobi) if (!(o.okno.od < o.okno.do)) chyby.push(`obdobi.yaml ${o.id}: okno je obrácené`);
  return chyby;
}

/** Licence u každého obrázku (a obrázek jen tam, kde licence je). */
export function kontrolaLicenci(d: Data): string[] {
  return d.zdroje.obrazky
    .filter((o) => !o.licence?.trim() || !o.autor?.trim() || !o.url)
    .map((o) => `zdroje.yaml obrázek ${o.id}: chybí licence, autor nebo odkaz`);
}

/**
 * Atribut u každého profilu a portrétu. Osoby, jejichž atribut čeká na schválení autorem
 * (docs/podklady/atributy.md), se předají v seznamu `ceka`; kontrola je vypíše zvlášť.
 */
export function kontrolaAtributu(d: Data, ceka: string[] = []): { chyby: string[]; cekaji: string[] } {
  const chyby: string[] = [];
  const cekaji: string[] = [];
  for (const o of d.lide) {
    if (o.hloubka === 'medailonek' || o.atribut) {
      if (o.atribut && ceka.includes(o.id)) chyby.push(`${o.id}: má atribut, smaž ho ze seznamu čekajících`);
      continue;
    }
    if (ceka.includes(o.id)) cekaji.push(o.id);
    else chyby.push(`${o.id} (${o.hloubka}): chybí atribut`);
  }
  return { chyby, cekaji };
}

export function vsechnyKontroly(s: SurovaData, k: Kontext = {}, cekajiciAtributy: string[] = []) {
  const { data, chyby } = nactiData(s);
  return {
    data,
    chyby: [
      ...chyby,
      ...kontrolaOdkazu(data, k),
      ...kontrolaCasu(data),
      ...kontrolaLicenci(data),
      ...kontrolaAtributu(data, cekajiciAtributy).chyby,
    ],
  };
}
