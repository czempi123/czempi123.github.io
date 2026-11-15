// Poznámky pojmů na okraji (design-v2, krok P): žádné dvě se nepřekrývají, překážky obcházejí
// a co se vedle svého odstavce nevejde, dostane null (zůstane jen lístek po klepnutí).
import { describe, it, expect } from 'vitest';
import { rozmistitPoznamky, type PoznamkaNaOkraji } from '../../src/lib/okraj-pojmu';

const p = (od: number, vyska: number, nejpozdeji = od + 200, mez = 10_000): PoznamkaNaOkraji => ({ od, vyska, nejpozdeji, mez });

describe('rozmístění poznámek na okraji', () => {
  it('poznámka stojí u svého odstavce, když jí nic nepřekáží', () => {
    expect(rozmistitPoznamky([p(100, 80)])).toEqual([100]);
  });

  it('dvě poznámky na jedné výšce dá pod sebe s mezerou', () => {
    expect(rozmistitPoznamky([p(100, 80), p(120, 60)], [], 16)).toEqual([100, 196]);
  });

  it('vrací výsledek v pořadí vstupu, i když poznámky přijdou neseřazené', () => {
    expect(rozmistitPoznamky([p(400, 50), p(100, 80)], [], 16)).toEqual([400, 100]);
  });

  it('obejde překážku v okraji (citát rukou na okraji) a začne pod ní', () => {
    expect(rozmistitPoznamky([p(100, 80)], [{ od: 60, do: 150 }], 16)).toEqual([166]);
    // překážka pod poznámkou, která se jí dotýká jen mezerou, ji také odsune
    expect(rozmistitPoznamky([p(100, 80)], [{ od: 190, do: 260 }], 16)).toEqual([276]);
  });

  it('co by začalo pod svým odstavcem, se nevejde', () => {
    expect(rozmistitPoznamky([p(100, 80, 180), p(110, 80, 150)], [], 16)).toEqual([100, null]);
  });

  it('co by přesáhlo konec listu, se nevejde a další poznámku neodsune', () => {
    expect(rozmistitPoznamky([p(100, 300, 300, 350), p(150, 50)], [], 16)).toEqual([null, 150]);
  });

  it('žádné dvě umístěné poznámky se nepřekrývají ani u hustě vyznačené stránky', () => {
    const vstup = Array.from({ length: 30 }, (_, i) => p(i * 37, 40 + (i % 4) * 25, i * 37 + 120));
    const prekazky = [{ od: 300, do: 420 }, { od: 800, do: 900 }];
    const vysledek = rozmistitPoznamky(vstup, prekazky, 12);
    const umistene = vysledek
      .map((h, i) => (h === null ? null : { od: h, do: h + vstup[i].vyska }))
      .filter((x): x is { od: number; do: number } => x !== null)
      .sort((a, b) => a.od - b.od);
    expect(umistene.length).toBeGreaterThan(5);
    for (let i = 1; i < umistene.length; i++) expect(umistene[i].od).toBeGreaterThanOrEqual(umistene[i - 1].do + 12);
    for (const u of umistene) for (const k of prekazky) expect(u.do + 12 <= k.od || u.od >= k.do + 12).toBe(true);
    vysledek.forEach((h, i) => { if (h !== null) expect(h).toBeLessThanOrEqual(vstup[i].nejpozdeji); });
  });
});
