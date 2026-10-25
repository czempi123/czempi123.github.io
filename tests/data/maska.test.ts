// Kresba „Strhni masku“ (cesta 33, krok 4): geometrie a texty v src/lib/maska.ts.
// Pod první maskou je tvář menší, pod druhou skoro stejně velká; obě se pod maskou schovají celé. Maska po strhnutí
// leží vedle tváře, nepřekrývá ji a nevyjede z plátna. Texty pod kresbou mají věty do 25 slov.
import { describe, expect, it } from 'vitest';
import { MASKA, MASKA_VEDLE, PLATNO, POHLEDY_MASKY, POPISKY, TVARE, TVAR_STRED, popisMasky, rozmerTvare, tvar } from '../../src/lib/maska';

describe('maska', () => {
  it('má dva pohledy: první a druhou masku', () => {
    expect(POHLEDY_MASKY.map((p) => p.id)).toEqual(['mensi', 'stejna']);
  });

  it('obě tváře se pod maskou schovají celé', () => {
    for (const p of POHLEDY_MASKY) {
      const r = rozmerTvare(p.id);
      expect(r.sirka).toBeLessThan(MASKA.sirka);
      expect(r.vyska).toBeLessThan(MASKA.vyska);
    }
  });

  it('první tvář je zřetelně menší, druhá skoro stejně velká jako maska', () => {
    expect(rozmerTvare('mensi').vyska).toBeLessThan(MASKA.vyska * 0.6);
    expect(rozmerTvare('stejna').vyska).toBeGreaterThan(MASKA.vyska * 0.9);
    expect(rozmerTvare('stejna').sirka).toBeGreaterThan(MASKA.sirka * 0.9);
  });

  it('maska po strhnutí leží vedle tváře a nevyjede z plátna', () => {
    // Natočení přidá k poloviční šířce nejvýš sin(úhlu) × poloviční výška.
    const uhel = (MASKA_VEDLE.natoceni * Math.PI) / 180;
    const pulSirka = (MASKA.sirka / 2) * Math.cos(uhel) + (MASKA.vyska / 2) * Math.sin(uhel);
    const levyOkraj = TVAR_STRED.x + MASKA_VEDLE.dx - pulSirka;
    const pravyOkraj = TVAR_STRED.x + MASKA_VEDLE.dx + pulSirka;
    expect(levyOkraj).toBeGreaterThan(TVAR_STRED.x + rozmerTvare('stejna').sirka / 2);
    expect(pravyOkraj).toBeLessThan(PLATNO.sirka);
    expect(TVAR_STRED.x - MASKA.sirka / 2).toBeGreaterThan(0);
    expect(TVAR_STRED.y - MASKA.vyska / 2).toBeGreaterThan(0);
    expect(POPISKY.y).toBeLessThan(PLATNO.vyska);
    expect(POPISKY.y).toBeGreaterThan(TVAR_STRED.y + MASKA_VEDLE.dy + MASKA.vyska / 2);
  });

  it('tvář má dvě oči, dvě uši a vlasy nad obrysem', () => {
    const t = tvar(TVARE.mensi.rx, TVARE.mensi.ry);
    expect(t.oci).toHaveLength(2);
    expect(t.usi).toHaveLength(2);
    expect(t.vlasy.startsWith('M ')).toBe(true);
    expect(t.oci[0].r).toBeGreaterThanOrEqual(2.2);
  });

  it('texty pod kresbou: věty do 25 slov, bez dlouhé pomlčky a se Senekou u druhé masky', () => {
    for (const p of POHLEDY_MASKY) {
      const text = popisMasky(p.id);
      expect(text).not.toMatch(/—/);
      for (const veta of text.split(/(?<=[.?!])\s+/)) expect(veta.split(/\s+/).length).toBeLessThanOrEqual(25);
    }
    expect(popisMasky('stejna')).toContain('Podle Seneky');
    expect(popisMasky('mensi')).toContain('vedle');
  });
});
