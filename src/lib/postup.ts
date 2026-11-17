// Postup v cestě (design-v2, K5; plátno Zlepseni.dc.html › 4 a KrokCesty.dc.html): lístek cesty, který se štípe,
// tichý Další krok a typ přechodu mezi kroky. Funkce stavKroku, pouzijStavKroku a typPrechoduKroku sahají jen na své
// parametry a globální document: vkládají se jako text do skriptů před vykreslením (CestaLista.astro, Zakladni.astro).

/**
 * Bloky, ve kterých student odpovídá. Krok s některým z nich má Další krok tichý, dokud poslední z nich v kroku
 * není hotový (deník: aktivita bloku, u závěrečného pravidla zápis). Kresby, Příběh a zastánci odpověď nečekají.
 */
export const BLOKY_S_ODPOVEDI = ['Volba', 'Odkryj', 'Roztrid', 'ZmenJednuVec', 'Spor', 'SlozArgument', 'KdoZilDriv', 'SeradNaOse', 'KdoToRekl', 'TipniSi', 'KdeToBylo', 'DoplnCitat', 'Pary', 'PravyNeboPodvrzeny', 'NajdiSlabeMisto', 'KdoByToRekl', 'ZaverCesty'] as const;

/** Id posledního bloku s odpovědí v textu kroku (MDX), nebo undefined: krok bez něj má Další krok hlavní hned. */
export function blokKroku(telo: string): string | undefined {
  const vzor = new RegExp(`<(?:${BLOKY_S_ODPOVEDI.join('|')})\\b[^>]*?\\bid=["']([^"']+)["']`, 'g');
  let posledni: string | undefined;
  for (const m of telo.matchAll(vzor)) posledni = m[1];
  return posledni;
}

/** Místo kroku na lístku: vyštípnutá dírka (krok prošlý), běžící krok (číslo v kroužku perem), nebo zatím nic. */
export type Misto = 'dirka' | 'ted' | 'volne';
export interface StavKroku {
  mista: Misto[];
  /** krok je hotový: student odpověděl v posledním bloku s odpovědí, nebo krok žádný nemá */
  hotovy: boolean;
  /** pahýl lístku je odtržený (v deníku) */
  cely: boolean;
}

/**
 * Stav lístku a lišty z deníku (objekt, jak ho čte nacti(), nebo cokoli rozbitého). `krok` 0 znamená přehled cesty
 * (žádný běžící krok), `ceka` id bloku, na který krok čeká ('' = na nic). Na posledním kroku po odtržení pahýlu
 * je dírka i místo běžícího kroku. Bez závislostí: vkládá se do skriptu před vykreslením.
 */
export function stavKroku(d: unknown, slug: string, krok: number, pocet: number, ceka: string): StavKroku {
  var o = d as { cesty?: Record<string, { navstivene?: unknown; pahyl?: unknown }>; aktivita?: unknown; zapisy?: unknown } | null;
  var c = o && o.cesty && typeof o.cesty === 'object' ? o.cesty[slug] : undefined;
  var nav: unknown[] = c && Array.isArray(c.navstivene) ? c.navstivene : [];
  var cely = !!c && typeof c.pahyl === 'string';
  var hotovy = true;
  if (ceka) {
    hotovy = false;
    var najdi = function (pole: unknown): { hotovo?: unknown; odpoved?: unknown } | null {
      if (!Array.isArray(pole)) return null;
      var p = pole as Array<{ id?: unknown; hotovo?: unknown; odpoved?: unknown } | null>;
      for (var i = 0; i < p.length; i++) { var x = p[i]; if (x && x.id === ceka) return x; }
      return null;
    };
    var a = najdi(o && o.aktivita);
    if (a) hotovy = a.hotovo === true;
    else {
      var z = najdi(o && o.zapisy);
      hotovy = !!z && typeof z.odpoved === 'string' && z.odpoved.trim() !== '';
    }
  }
  var mista: Misto[] = [];
  for (var k = 1; k <= pocet; k++) {
    if (k === krok) mista.push(cely && krok === pocet ? 'dirka' : 'ted');
    else mista.push(nav.indexOf(k) >= 0 ? 'dirka' : 'volne');
  }
  return { mista: mista, hotovy: hotovy, cely: cely };
}

/**
 * Promítne stav do stránky: místa na lístcích (`[data-listek-cesty]`, data-misto a věta pro čtečku), odtržený pahýl
 * (data-cely) a v liště kroku Další krok hlavní, nebo tichý (`[data-dalsi-krok]`). Bez závislostí, jako stavKroku.
 */
export function pouzijStavKroku(s: StavKroku, doc: Document): void {
  var STAV: Record<string, string> = { dirka: ' (prošel jsi)', ted: ' (teď)', volne: '' };
  var listky = doc.querySelectorAll('[data-listek-cesty]');
  for (var i = 0; i < listky.length; i++) {
    var mista = listky[i].querySelectorAll('[data-misto]');
    for (var j = 0; j < mista.length; j++) {
      var m = s.mista[j] || 'volne';
      mista[j].setAttribute('data-misto', m);
      var stav = mista[j].querySelector('[data-misto-stav]');
      if (stav) stav.textContent = STAV[m];
    }
    listky[i].toggleAttribute('data-cely', s.cely);
  }
  var dal = doc.querySelector('[data-dalsi-krok]');
  if (dal) {
    dal.classList.toggle('blok__tl--hlavni', s.hotovy);
    dal.classList.toggle('blok__tl--tiche', !s.hotovy);
  }
}

/** Adresa stránky, ze které student odešel (sessionStorage; ukládá ji pageswap v Zakladni.astro), pro prohlížeče bez navigation.activation. */
export const KLIC_ODKUD = 'atlas-odkud';

/** Odkud student přišel: z navigation.activation, jinak z adresy uložené při odchodu (KLIC_ODKUD). */
export function adresaOdkud(): string {
  try {
    const a = (window as { navigation?: { activation?: { from?: { url?: string | null } | null } } }).navigation?.activation;
    if (a?.from?.url) return new URL(a.from.url).pathname;
    return sessionStorage.getItem(KLIC_ODKUD) ?? '';
  } catch {
    return '';
  }
}

/**
 * Typ přechodu z adresy (ne z odkazu): krok n → n+1 téže cesty je 'krok-dal', n → n−1 'krok-zpet', jinak null
 * (pak se list otočí jako mezi ostatními stránkami). Bez závislostí: vkládá se do skriptu v hlavičce.
 */
export function typPrechoduKroku(z: string, na: string): string | null {
  var vzor = /\/cesta\/([^/]+)\/(\d+)\/?(?:[?#].*)?$/;
  var a = vzor.exec(z);
  var b = vzor.exec(na);
  if (!a || !b || a[1] !== b[1]) return null;
  var rozdil = Number(b[2]) - Number(a[2]);
  return rozdil === 1 ? 'krok-dal' : rozdil === -1 ? 'krok-zpet' : null;
}
