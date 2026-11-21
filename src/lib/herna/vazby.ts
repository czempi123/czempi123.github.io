// Co spojuje dva lidi ve hře (herna-v1, K2; zásada Pointa není paměť): vztah z vztahy.yaml (učitel a žák, znali se,
// četl ho, přel se; tradovaný s „vypráví se“), jinak „mohli se potkat“, když se jejich životy překrývají a oba byli
// dospělí. Kdo žil v jiné tradici (Konfucius vedle Parmenida), o tom atlas netvrdí ani setkání, ani že o sobě nevěděli:
// „žili ve stejné době“. Seřaď na ose to ukazuje mezi sousedními kartami, Tipni si po odhalení.
// Čisté funkce; testy tests/data/herna.test.ts.
import { zijiZaroven } from '../dvojice';
import { mohliSePrit, sporNaDalku } from '../vztahy';
import type { TOsoba, TVztah } from '../schema';

export type OsobaVazby = Pick<TOsoba, 'id' | 'jmeno' | 'narozen' | 'zemrel' | 'aktivni'> & {
  jmeno2?: string;
  zena?: boolean;
  tradice?: string;
};
export type VztahVazby = Pick<TVztah, 'od' | 'k' | 'typ'> & { tradovany?: boolean; poznamka?: string };

export interface VazbaDvou {
  druh: 'vztah' | 'potkat' | 'soucasne';
  typ?: TVztah['typ'];
  /** krátký popisek mezi kartami: „učitel a žák“, „četl ho“, „mohli se potkat“ */
  text: string;
  /** podmětem popisku je druhý (pozdější) člověk a míří k prvnímu: šipka zpět („← četl ho“) */
  kPrvnimu: boolean;
  tradovany: boolean;
  /** celá věta: „Antisthenés se učil u Sókrata.“, „Vypráví se, že se Diogenés učil u Antisthena.“ */
  veta: string;
  /** poznámka ke vztahu z dat (studentský text), když ji vztah má */
  poznamka?: string;
}

const tvar = (o: { zena?: boolean }, muz: string, zena: string) => (o.zena ? zena : muz);
const mnozne = (a: { zena?: boolean }, b: { zena?: boolean }, muzi: string, zeny: string) => (a.zena && b.zena ? zeny : muzi);
const gen = (o: OsobaVazby) => o.jmeno2 ?? o.jmeno;
/** Pořadí typů, když mají dva lidé víc vztahů (Platón a Aristotelés: učitel i spor). */
const PORADI_TYPU: TVztah['typ'][] = ['ucitel', 'znali-se', 'vliv-textem', 'polemika'];

/** Věta „Vypráví se, že…“ u tradovaného vztahu: „Diogenés se učil…“ → „Vypráví se, že se Diogenés učil…“ */
function vypravi(veta: string, tradovany: boolean): string {
  if (!tradovany) return veta;
  const se = veta.match(/^(.+?) se (.+)$/);
  return se ? `Vypráví se, že se ${se[1]} ${se[2]}` : `Vypráví se, že ${veta}`;
}

/**
 * Co spojuje `prvni` (dřívější karta) a `druhy` (pozdější): nejdřív vztah z dat (netradovaný před tradovaným, pak
 * podle PORADI_TYPU), jinak „mohli se potkat“ nebo „žili ve stejné době“; jinak null (atlas nic netvrdí).
 */
export function vazbaDvou(prvni: OsobaVazby, druhy: OsobaVazby, vztahy: readonly VztahVazby[]): VazbaDvou | null {
  const spolecne = vztahy
    .filter((v) => (v.od === prvni.id && v.k === druhy.id) || (v.od === druhy.id && v.k === prvni.id))
    .sort((x, y) => Number(!!x.tradovany) - Number(!!y.tradovany) || PORADI_TYPU.indexOf(x.typ) - PORADI_TYPU.indexOf(y.typ));
  const v = spolecne[0];
  if (v) {
    const [od, k] = v.od === prvni.id ? [prvni, druhy] : [druhy, prvni];
    const tradovany = !!v.tradovany;
    const zaklad = { druh: 'vztah' as const, typ: v.typ, tradovany, poznamka: v.poznamka };
    switch (v.typ) {
      case 'ucitel': {
        const text = od === prvni
          ? `${tvar(od, 'učitel', 'učitelka')} a ${tvar(k, 'žák', 'žákyně')}`
          : `${tvar(k, 'žák', 'žákyně')} a ${tvar(od, 'učitel', 'učitelka')}`;
        return { ...zaklad, text, kPrvnimu: false, veta: vypravi(`${k.jmeno} se ${tvar(k, 'učil', 'učila')} u ${gen(od)}.`, tradovany) };
      }
      case 'znali-se':
        return { ...zaklad, text: mnozne(od, k, 'znali se', 'znaly se'), kPrvnimu: false, veta: vypravi(`${prvni.jmeno} a ${druhy.jmeno} se ${mnozne(od, k, 'znali', 'znaly')}.`, tradovany) };
      case 'vliv-textem':
        return {
          ...zaklad,
          text: `${tvar(k, 'četl', 'četla')} ${tvar(od, 'ho', 'ji')}`,
          kPrvnimu: k === druhy,
          veta: vypravi(`${k.jmeno} ${tvar(k, 'četl', 'četla')} texty ${gen(od)}.`, tradovany),
        };
      case 'polemika': {
        const naDalku = sporNaDalku(v, od, k);
        return {
          ...zaklad,
          text: naDalku ? 'spor na dálku' : `${tvar(od, 'přel', 'přela')} se s ${tvar(k, 'ním', 'ní')}`,
          kPrvnimu: !naDalku && od === druhy,
          veta: vypravi(naDalku
            ? `${od.jmeno} se ${tvar(od, 'přel', 'přela')} s učením ${gen(k)}, i když spolu nežili.`
            : `${prvni.jmeno} a ${druhy.jmeno} se ${mnozne(od, k, 'přeli', 'přely')}.`, tradovany),
        };
      }
    }
  }
  if (!zijiZaroven(prvni, druhy)) return null;
  const zili = mnozne(prvni, druhy, 'žili', 'žily');
  if ((prvni.tradice ?? '') === (druhy.tradice ?? '') && mohliSePrit(prvni, druhy)) {
    return {
      druh: 'potkat', text: mnozne(prvni, druhy, 'mohli se potkat', 'mohly se potkat'), kPrvnimu: false, tradovany: false,
      veta: `${prvni.jmeno} a ${druhy.jmeno} ${zili} ve stejné době a ${mnozne(prvni, druhy, 'mohli', 'mohly')} se potkat.`,
    };
  }
  return { druh: 'soucasne', text: `${zili} ve stejné době`, kPrvnimu: false, tradovany: false, veta: `${prvni.jmeno} a ${druhy.jmeno} ${zili} ve stejné době.` };
}

/** Věta vazby s poznámkou z dat: „Marcus Aurelius četl texty Epiktéta: Epiktétovy zápisky mu půjčil učitel Rusticus.“ */
export function vetaVazby(v: VazbaDvou): string {
  if (!v.poznamka || v.typ === 'polemika') return v.veta;
  return `${v.veta.replace(/\.$/, '')}: ${v.poznamka.replace(/\.$/, '')}.`;
}
