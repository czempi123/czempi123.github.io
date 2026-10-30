// Logika bloku Slož argument (src/components/ostrovy/SlozArgument.svelte): rozložení karet do řádků,
// vyhodnocení podle toho, co student složil, hlášení pro čtečky, volba „Kterou premisu bys napadl ty?“,
// zápis do deníku a platný stav po obnovení. Čisté funkce bez DOM; testy v tests/data/argument.test.ts.
// Nic se neboduje: zpětná vazba popíše, co student složil, a ptá se dál.
import { ID_SKRYTY, ID_ZADNOU, type TBlokArgument } from './bloky-schema';

export type ObsahArgumentu = Pick<TBlokArgument, 'karty' | 'skryty' | 'napadnout' | 'zpetna' | 'zadnou'>;
export type Karta = TBlokArgument['karty'][number];
/** Řádek argumentu: „1“, „2“, „3“ (premisy) nebo „zaver“. */
export type Radek = string;
/** Které karty leží ve kterém řádku (řádek → id karty). */
export type Rozlozeni = Record<Radek, string>;

export const ZAVER = 'zaver';

/** Řádky argumentu v pořadí shora: premisy podle počtu premis, pak závěr. */
export function radkyArgumentu(blok: Pick<TBlokArgument, 'karty'>): Radek[] {
  const premis = blok.karty.filter((k) => k.misto !== ZAVER).length;
  return [...Array.from({ length: premis }, (_, i) => String(i + 1)), ZAVER];
}

/** Krátký název řádku na obrazovce: „1“, „2“, „Závěr“. */
export const nazevRadku = (r: Radek) => (r === ZAVER ? 'Závěr' : r);

/** Řádek ve větě: „v řádku 1“, „v závěru“. */
export const vRadku = (r: Radek) => (r === ZAVER ? 'v závěru' : `v řádku\u00a0${r}`);

/** Řádek jako cíl: „do řádku 1“, „do závěru“. */
export const doRadku = (r: Radek) => (r === ZAVER ? 'do závěru' : `do řádku\u00a0${r}`);

const karta = (blok: Pick<TBlokArgument, 'karty'>, id: string) => blok.karty.find((k) => k.id === id);

/** Řádek, ve kterém karta leží, nebo null (je mezi kartami). */
export function radekKarty(roz: Rozlozeni, id: string): Radek | null {
  return Object.keys(roz).find((r) => roz[r] === id) ?? null;
}

/** Karty, které ještě neleží v žádném řádku, v pořadí bloku (autor je v YAML nepíše v pořadí argumentu). */
export function volneKarty(blok: Pick<TBlokArgument, 'karty'>, roz: Rozlozeni): Karta[] {
  const polozene = new Set(Object.values(roz));
  return blok.karty.filter((k) => !polozene.has(k.id));
}

/**
 * Položí kartu do řádku. Karta, která tam ležela, se vymění: jde na místo, odkud položená karta přišla
 * (jiný řádek), nebo zpátky mezi karty. Vrátí nové rozložení a id vyměněné karty.
 */
export function poloz(roz: Rozlozeni, id: string, cil: Radek): { rozlozeni: Rozlozeni; vymenena: string | null } {
  const odkud = radekKarty(roz, id);
  if (odkud === cil) return { rozlozeni: roz, vymenena: null };
  const puvodni = roz[cil] ?? null;
  const nove: Rozlozeni = { ...roz, [cil]: id };
  if (odkud) {
    if (puvodni) nove[odkud] = puvodni;
    else delete nove[odkud];
  }
  return { rozlozeni: nove, vymenena: puvodni };
}

/** Vrátí kartu z řádku zpátky mezi karty. */
export function vrat(roz: Rozlozeni, id: string): Rozlozeni {
  const odkud = radekKarty(roz, id);
  if (!odkud) return roz;
  const { [odkud]: _pryc, ...zbytek } = roz;
  return zbytek;
}

/** Jsou všechny řádky obsazené? Teprve pak jde argument zkontrolovat. */
export function jeSlozeno(blok: Pick<TBlokArgument, 'karty'>, roz: Rozlozeni): boolean {
  return radkyArgumentu(blok).every((r) => !!karta(blok, roz[r] ?? ''));
}

export interface Vyhodnoceni {
  /** závěr bloku stojí v řádku Závěr */
  zaverNaMiste: boolean;
  /** karta, kterou student dal do závěru */
  vZaveru: Karta | null;
  /** řádek, ve kterém student nechal skutečný závěr (když není v závěru) */
  kdeJeZaver: Radek | null;
  /** premisy stojí v jiném pořadí než v bloku (na tom nezáleží, zpětná vazba to jen řekne) */
  jinePoradi: boolean;
}

export function vyhodnot(blok: Pick<TBlokArgument, 'karty'>, roz: Rozlozeni): Vyhodnoceni {
  const zaver = blok.karty.find((k) => k.misto === ZAVER)!;
  const vZaveru = karta(blok, roz[ZAVER] ?? '') ?? null;
  const zaverNaMiste = vZaveru?.id === zaver.id;
  const jinePoradi = zaverNaMiste && blok.karty.some((k) => k.misto !== ZAVER && roz[String(k.misto)] !== k.id);
  return { zaverNaMiste, vZaveru, kdeJeZaver: zaverNaMiste ? null : radekKarty(roz, zaver.id), jinePoradi };
}

/** Bez koncové tečky: věta karty uvnitř uvozovek ve větě zpětné vazby. */
const bezTecky = (s: string) => s.trim().replace(/\.$/, '');

/** Zpětná vazba po kontrole: titulek říká, co student dal do závěru, text vysvětluje a ptá se dál. */
export function zpetnaArgumentu(blok: ObsahArgumentu, roz: Rozlozeni): { titulek: string; text: string } {
  const v = vyhodnot(blok, roz);
  const titulek = v.vZaveru ? `Tvůj závěr: „${bezTecky(v.vZaveru.text)}“.` : 'Tvůj argument nemá závěr.';
  if (v.zaverNaMiste) {
    const poradi = v.jinePoradi ? '\n\nPremisy máš v jiném pořadí, než je napsal autor. Na tom nezáleží: závěr potřebuje všechny.' : '';
    return { titulek, text: `${blok.zpetna}${poradi}` };
  }
  const zaver = blok.karty.find((k) => k.misto === ZAVER)!;
  const kde = v.kdeJeZaver ? `máš ${vRadku(v.kdeJeZaver)}` : 'ti zůstala mezi kartami';
  const obecne = `Argument tuhle větu nedokazuje, vychází z ní. Větu, kterou ostatní karty podpírají, ${kde}: „${bezTecky(zaver.text)}“. Přečti ji nahlas a za ni „protože“ s ostatními kartami. Dává to smysl?`;
  return { titulek, text: v.vZaveru?.vZaveru ?? obecne };
}

/** Hlášení pro čtečky po položení karty. */
export function hlaseniPolozeni(blok: Pick<TBlokArgument, 'karty'>, id: string, cil: Radek, vymenena: string | null, roz: Rozlozeni): string {
  const t = karta(blok, id)?.text ?? '';
  const veta = `„${bezTecky(t)}“ je ${vRadku(cil)}.`;
  if (!vymenena) return veta;
  const kam = radekKarty(roz, vymenena);
  const v = karta(blok, vymenena)?.text ?? '';
  return `${veta} „${bezTecky(v)}“ je ${kam ? vRadku(kam) : 'zpátky mezi kartami'}.`;
}

/** Popis řádku pro čtečky (tlačítko cíle a obsah řádku). */
export function popisRadku(blok: Pick<TBlokArgument, 'karty'>, roz: Rozlozeni, r: Radek): string {
  const k = karta(blok, roz[r] ?? '');
  const nazev = r === ZAVER ? 'Závěr' : `Řádek ${r}`;
  return k ? `${nazev}: „${bezTecky(k.text)}“` : `${nazev}: prázdný`;
}

// ─── Kterou premisu bys napadl ty? ────────────────────────────────────────────

export interface MoznostNapadeni {
  id: string;
  /** štítek nad textem: „Premisa“, „Skrytý předpoklad“; u „žádnou“ prázdný */
  stitek: string;
  text: string;
  zpetna: string;
}

/** Možnosti volby: premisy v pořadí argumentu, skrytý předpoklad a „žádnou“. */
export function moznostiNapadeni(blok: ObsahArgumentu): MoznostNapadeni[] {
  const premisy = blok.karty
    .filter((k) => k.misto !== ZAVER)
    .sort((a, b) => (a.misto as number) - (b.misto as number))
    .map((k) => ({ id: k.id, stitek: 'Premisa', text: k.text, zpetna: k.kdyzNapadnes ?? '' }));
  return [
    ...premisy,
    { id: ID_SKRYTY, stitek: 'Skrytý předpoklad', text: blok.skryty.text, zpetna: blok.skryty.kdyzNapadnes },
    { id: ID_ZADNOU, stitek: '', text: 'Žádnou. Argument mi drží.', zpetna: blok.zadnou },
  ];
}

/** Otázka volby po složení; stejná ve všech blocích. */
export const OTAZKA_NAPADENI = 'Kterou premisu bys napadl ty?';

/** Otázka zápisu v deníku: otázka bloku a otázka volby, aby zápis řekl, ke kterému argumentu patří. */
export const otazkaZapisu = (blok: Pick<TBlokArgument, 'otazka'>) => `${blok.otazka.trim()} ${OTAZKA_NAPADENI}`;

/** Věta, kterou argument podle autora nejsnáz napadneš: premisa, nebo skrytý předpoklad. */
export function napadnutelne(blok: ObsahArgumentu): { id: string; stitek: string; text: string; proc: string } {
  const id = blok.napadnout.karta;
  if (id === ID_SKRYTY) return { id, stitek: 'Skrytý předpoklad', text: blok.skryty.text, proc: blok.napadnout.proc };
  return { id, stitek: 'Premisa', text: karta(blok, id)?.text ?? '', proc: blok.napadnout.proc };
}

/** Zápis do deníku: kterou premisu by student napadl a nepovinně proč. */
export function zapisArgumentu(blok: ObsahArgumentu, volba: string, proc = ''): string {
  const m = moznostiNapadeni(blok).find((x) => x.id === volba);
  if (!m) return '';
  const co =
    m.id === ID_ZADNOU
      ? 'Nenapadl bych žádnou premisu, argument mi drží.'
      : `Napadl bych ${m.id === ID_SKRYTY ? 'skrytý předpoklad' : 'premisu'}: „${bezTecky(m.text)}“.`;
  const p = proc.trim();
  return p ? `${co} Proč: ${p}` : co;
}

// ─── Stav po obnovení ─────────────────────────────────────────────────────────

export interface StavArgumentu {
  rozlozeni: Rozlozeni;
  /** po Zkontrolovat: zpětná vazba, skrytý předpoklad a místo k napadení jsou vidět */
  zkontrolovano: boolean;
  /** zvolená možnost v „Kterou premisu bys napadl ty?“ (id premisy, „skryty“, „zadnou“) */
  napadnout: string | null;
  proc: string;
  /** volba je potvrzená a zapsaná v deníku */
  zapsano: boolean;
}

/** Uložený stav, nebo null. Zahodí neznámé řádky a karty; kontrola platí jen se složeným argumentem. */
export function platnyStavArgumentu(s: unknown, blok: ObsahArgumentu): StavArgumentu | null {
  if (!s || typeof s !== 'object') return null;
  const x = s as Partial<Record<keyof StavArgumentu, unknown>>;
  const radky = new Set(radkyArgumentu(blok));
  const karty = new Set(blok.karty.map((k) => k.id));
  const rozlozeni: Rozlozeni = {};
  const videne = new Set<string>();
  if (x.rozlozeni && typeof x.rozlozeni === 'object') {
    for (const [r, id] of Object.entries(x.rozlozeni as Record<string, unknown>)) {
      if (radky.has(r) && typeof id === 'string' && karty.has(id) && !videne.has(id)) {
        rozlozeni[r] = id;
        videne.add(id);
      }
    }
  }
  const zkontrolovano = x.zkontrolovano === true && jeSlozeno(blok, rozlozeni);
  const moznosti = new Set(moznostiNapadeni(blok).map((m) => m.id));
  const napadnout = zkontrolovano && typeof x.napadnout === 'string' && moznosti.has(x.napadnout) ? x.napadnout : null;
  const proc = typeof x.proc === 'string' ? x.proc : '';
  const zapsano = x.zapsano === true && napadnout !== null;
  if (!Object.keys(rozlozeni).length) return null;
  return { rozlozeni, zkontrolovano, napadnout, proc, zapsano };
}
