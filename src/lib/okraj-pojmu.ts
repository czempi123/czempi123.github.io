// Poznámky pojmů na okraji stránky (design-v2, krok P): kam která poznámka padne, aby se žádné dvě nepřekrývaly
// a žádná neležela přes věc, která do okraje zasahuje (citát rukou na okraji, široký blok). Čistá funkce bez DOM:
// skript v Pojem.astro změří odstavce a překážky a podle výsledku poznámky umístí. Co se nevejde (null), zůstane
// jen lístkem po klepnutí pod odstavcem. Test: tests/data/okraj-pojmu.test.ts.

export interface PoznamkaNaOkraji {
  /** kde by poznámka chtěla začít: horní hrana odstavce se slovem (px od začátku stránky) */
  od: number;
  /** výška poznámky */
  vyska: number;
  /** nejníž, kde smí začít: dolní hrana jejího odstavce, jinak už nestojí vedle svého slova */
  nejpozdeji: number;
  /** kam smí sahat: konec listu nebo sloupce, ve kterém odstavec stojí */
  mez: number;
}

export interface PrekazkaNaOkraji {
  od: number;
  do: number;
}

/**
 * Vrátí horní hranu každé poznámky, nebo null, když se vedle svého odstavce nevejde.
 * Poznámky se berou shora dolů; další začne nejdřív `mezera` pod předchozí a pod každou překážkou, na kterou narazí.
 */
export function rozmistitPoznamky(
  poznamky: PoznamkaNaOkraji[],
  prekazky: PrekazkaNaOkraji[] = [],
  mezera = 16,
): (number | null)[] {
  const vysledek: (number | null)[] = poznamky.map(() => null);
  const poradi = poznamky.map((p, i) => ({ p, i })).sort((a, b) => a.p.od - b.p.od || a.i - b.i);
  const prek = [...prekazky].sort((a, b) => a.od - b.od);
  let volnoOd = -Infinity;
  for (const { p, i } of poradi) {
    let horni = Math.max(p.od, volnoOd);
    for (let posun = true; posun; ) {
      posun = false;
      for (const k of prek) {
        if (horni < k.do + mezera && horni + p.vyska + mezera > k.od) {
          horni = k.do + mezera;
          posun = true;
        }
      }
    }
    if (horni > p.nejpozdeji || horni + p.vyska > p.mez) continue;
    vysledek[i] = horni;
    volnoOd = horni + p.vyska + mezera;
  }
  return vysledek;
}
