// Mapa a čas jako výstřižek staré mapy (design-v2, K7a): lidé roku na přišpendlených lístečcích, jeden lísteček
// na místo. Tady je logika bez DOM: rozmístění lístečků bez překryvů, co se v místě dělo dřív, razítko člověka
// z výtahu dat mapy a první výprava (první návštěva). Ostrov je v src/components/mapa/Mapa.svelte.
import type { OsobaV, MistoV, UdalostV } from './mapa-vstup';
import { zivotOsoby, kdeVRoce } from './cas-mapy';
import { stredRazitka } from './razitko';
import type { UdajeRazitka } from '../components/ostrovy/bloky-typy';

/** Roh lístečku, ve kterém je špendlík: lísteček leží od místa vpravo dolů, vlevo nahoru, vpravo nahoru, vlevo dolů. */
export type Roh = 'pd' | 'ln' | 'pn' | 'ld';
/** Špendlík leží 13 px od svislé a 11 px od vodorovné hrany lístečku (plátno MapaCas, .mst). */
export const SPENDLIK: [number, number] = [13, 11];

export interface BodMapy {
  id: string;
  /** poloha místa v px na mapě */
  x: number;
  y: number;
  /** rozměr zavřeného lístečku */
  w: number;
  h: number;
}
export type Obdelnik = [number, number, number, number];
export interface Umisteni {
  roh: Roh;
  /** posun lístečku od místa, když se k místu nevešel (pak ho s místem spojí nit) */
  posun: number;
  box: Obdelnik;
  /** lísteček se nikam nevešel bez překryvu: na mapě zůstane jen špendlík, lísteček se ukáže po klepnutí */
  jenSpendlik?: boolean;
}

const prekryv = (a: Obdelnik, b: Obdelnik) =>
  Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));

/** Obdélník lístečku pro roh a svislý posun. */
export function boxListku(b: BodMapy, roh: Roh, posun = 0): Obdelnik {
  const [sx, sy] = SPENDLIK;
  const vpravo = roh === 'pd' || roh === 'pn';
  const dolu = roh === 'pd' || roh === 'ld';
  const x1 = vpravo ? b.x - sx : b.x + sx - b.w;
  const y1 = (dolu ? b.y - sy : b.y + sy - b.h) + posun;
  return [x1, y1, x1 + b.w, y1 + b.h];
}

/**
 * Rozmístí lístečky v pořadí přednosti (první dostane místo první): nejdřív čtyři rohy přímo u místa,
 * pak lístečky posunuté nahoru nebo dolů (s nití k místu). Lísteček nesmí přesáhnout mapu, zakrýt jiný lísteček
 * ani špendlík jiného místa, ani překážku (lístečky lidí mimo výřez, přepínač, růžici s měřítkem).
 * Když nic z toho nejde, dostane polohu s nejmenším překryvem.
 */
export function rozmistiListky(body: BodMapy[], sirka: number, vyska: number, okraj = 6, mezera = 4, prekazky: Obdelnik[] = [], nejvicKroku = 3): Map<string, Umisteni> {
  const out = new Map<string, Umisteni>();
  const obsazeno: Obdelnik[] = [...prekazky];
  const spendliky: Obdelnik[] = body.map((b) => [b.x - 7, b.y - 7, b.x + 7, b.y + 7]);
  const rohy: Roh[] = ['pd', 'ln', 'pn', 'ld'];
  for (const [i, b] of body.entries()) {
    const kandidati: Umisteni[] = [];
    for (const roh of rohy) kandidati.push({ roh, posun: 0, box: boxListku(b, roh) });
    // Daleko od místa by lísteček vypadal jako lísteček jiného místa: nejvýš pár kroků, pak už jen špendlík.
    for (let k = 1; k <= nejvicKroku; k++) {
      for (const smer of [1, -1]) {
        for (const roh of rohy) {
          const posun = smer * k * (b.h + mezera);
          kandidati.push({ roh, posun, box: boxListku(b, roh, posun) });
        }
      }
    }
    let nej: Umisteni | null = null;
    let nejCena = Infinity;
    let nejVolny = false;
    for (const k of kandidati) {
      const [x1, y1, x2, y2] = k.box;
      const venku = Math.max(0, okraj - x1) + Math.max(0, x2 - (sirka - okraj)) + Math.max(0, okraj - y1) + Math.max(0, y2 - (vyska - okraj));
      const roz: Obdelnik = [x1 - mezera / 2, y1 - mezera / 2, x2 + mezera / 2, y2 + mezera / 2];
      let cena = venku * 1000;
      for (const o of obsazeno) cena += prekryv(roz, o) * 10;
      const volny = cena === 0;
      // Zakrytý cizí špendlík schová místo: dražší než lísteček o krok dál s nití, levnější než překryv lístečků.
      for (const [j, s] of spendliky.entries()) if (j !== i) cena += prekryv(k.box, s) * 0.06;
      // Posunutý lísteček je až poslední možnost: přirážka podle vzdálenosti od místa.
      cena += Math.abs(k.posun) * 0.2;
      if (cena === 0) { nej = k; nejVolny = true; break; }
      // Volné místo má vždy přednost před překryvem, i když je dál od místa.
      if ((volny && !nejVolny) || (volny === nejVolny && cena < nejCena)) { nejCena = cena; nej = k; nejVolny = volny; }
    }
    if (nejVolny) {
      out.set(b.id, nej!);
      obsazeno.push(nej!.box);
    } else {
      // Bez místa: jen špendlík (zabere kousek kolem místa), aby se nic nepřekrývalo.
      out.set(b.id, { ...nej!, jenSpendlik: true });
      obsazeno.push(spendliky[i]);
    }
  }
  return out;
}

/** Odhad šířky zavřeného lístečku, dokud ostrov nezměří písmo (Kalam 700): název, počet a okraje. */
export function sirkaListku(nazev: string, pocet: number, telefon: boolean): number {
  const znak = telefon ? 7.4 : 8.9;
  const text = nazev.length * znak + String(pocet).length * 7 + (telefon ? 44 : 50);
  return Math.max(telefon ? 84 : 104, Math.ceil(text));
}

export interface CoTuBylo {
  /** lidé z atlasu, kteří v místě byli dřív a teď tu nejsou (nejdřív ti nejbližší zvolenému roku) */
  drive: OsobaV[];
  /** události v místě do zvoleného roku (nejdřív ty nejbližší) */
  udalosti: UdalostV[];
}

/** Co se v místě dělo do zvoleného roku: klepnutí na město ukáže i ty, kdo už tu nejsou. */
export function coTuBylo(misto: string, rok: number, lide: OsobaV[], udalosti: UdalostV[]): CoTuBylo {
  const drive: { o: OsobaV; kdy: number }[] = [];
  for (const o of lide) {
    const z = zivotOsoby(o);
    if (!z || z.od > rok) continue;
    if (kdeVRoce(o, rok)?.misto === misto) continue;
    let kdy = -Infinity;
    for (const m of o.mista ?? []) {
      if (m.misto !== misto) continue;
      const od = m.rok ?? m.od ?? z.od;
      if (od > rok) continue;
      kdy = Math.max(kdy, Math.min(rok, m.rok ?? m.do ?? z.do));
    }
    if (kdy > -Infinity) drive.push({ o, kdy });
  }
  // Nejdřív ti, kdo už nežijí (z místa zmizeli úplně), pak ti, kdo odešli jinam; v obou skupinách nejbližší rokem.
  const zije = (o: OsobaV) => { const z = zivotOsoby(o)!; return rok <= z.do; };
  drive.sort((a, b) => Number(zije(a.o)) - Number(zije(b.o)) || b.kdy - a.kdy || a.o.jmeno.localeCompare(b.o.jmeno, 'cs'));
  const u = udalosti.filter((x) => x.misto === misto && x.od <= rok).sort((a, b) => b.od - a.od);
  return { drive: drive.map((d) => d.o), udalosti: u };
}

/** Razítko člověka z výtahu dat mapy (jako clovek() v blocích): jméno, roky, atribut, bez něj rodiště. */
export function razitkoOsoby(o: OsobaV, mista: Map<string, MistoV>): UdajeRazitka {
  return {
    id: o.id, jmeno: o.jmeno, roky: o.zivot, ikona: o.atribut?.ikona, atribut: o.atribut?.nazev,
    // stredRazitka z atributu čte jen to, jestli je: výtah mapy nese atribut bez pramene.
    stred: stredRazitka({ atribut: o.atribut, mista: o.mista ?? [], narozen: o.narozen } as Parameters<typeof stredRazitka>[0], (m) => mista.get(m)?.nazev),
  };
}

/**
 * První výprava: při první návštěvě má mapa jen rok, mapu a tuhle jednu otázku (zbytek je pod „Víc“).
 * Odpověď skládá ostrov z dat (kdeVRoce): místo a role v tom roce.
 */
export const PRVNI_VYPRAVA = {
  osoba: 'sokrates',
  rok: -424,
  otazka: 'Kde byl Sókratés roku 424\u00a0př.\u00a0n.\u00a0l.?',
  pokyn: 'Posuň rok, najdi na mapě jeho lísteček a\u00a0otevři ho.',
} as const;

/** Klíč v localStorage: student už mapu viděl celou (klepl na Víc). */
export const KLIC_MAPA_VIC = 'atlas-mapa-vic';
