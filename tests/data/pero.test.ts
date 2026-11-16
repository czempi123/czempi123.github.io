// Studentova ruka (design-v2, K4a, bod 3): pero v deníku a skript, který ho před vykreslením nastaví na <html>.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PERA, VYCHOZI_PERO, jePero, skriptPera } from '../../src/lib/pero';
import { nacti, peroDeniku, ulozPero, spojDeniky, _zapomenPamet, type Denik } from '../../src/lib/denik';

class Uloziste {
  data = new Map<string, string>();
  getItem(k: string) { return this.data.get(k) ?? null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}
const g = globalThis as unknown as { localStorage?: unknown; document?: unknown };

describe('pero', () => {
  it('tři pera, výchozí modré', () => {
    expect(PERA.map((p) => p.id)).toEqual(['modra', 'fialova', 'sepiova']);
    expect(VYCHOZI_PERO).toBe('modra');
    expect(jePero('fialova')).toBe(true);
    expect(jePero('zelena')).toBe(false);
  });

  it('skript nastaví jen nevýchozí platné pero a poškozený deník ho nezastaví', () => {
    const spust = (text: string | null) => {
      const html = { dataset: {} as Record<string, string> };
      g.document = { documentElement: html };
      new Function(skriptPera(JSON.stringify(text)))();
      delete g.document;
      return html.dataset.pero;
    };
    expect(spust(JSON.stringify({ verze: 1, pero: 'sepiova' }))).toBe('sepiova');
    expect(spust(JSON.stringify({ verze: 1, pero: 'modra' }))).toBeUndefined();
    expect(spust(JSON.stringify({ verze: 1, pero: 'zelena' }))).toBeUndefined();
    expect(spust('{rozbité')).toBeUndefined();
    expect(spust(null)).toBeUndefined();
  });
});

describe('pero v deníku', () => {
  let u: Uloziste;
  beforeEach(() => { u = new Uloziste(); g.localStorage = u; _zapomenPamet(); });
  afterEach(() => { delete g.localStorage; });

  it('bez volby není, uložené vydrží obnovení; neplatné se zahodí', () => {
    expect(peroDeniku()).toBeUndefined();
    ulozPero('fialova');
    _zapomenPamet();
    expect(peroDeniku()).toBe('fialova');
    u.setItem('atlas-denik', JSON.stringify({ ...nacti(), pero: 'zelena' }));
    _zapomenPamet();
    expect(nacti().pero).toBeUndefined();
  });

  it('spojení se souborem: pero z prohlížeče vyhraje, jinak se vezme ze souboru', () => {
    const zaklad = (d: Partial<Denik>): Denik => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, ...d });
    expect(spojDeniky(zaklad({ pero: 'modra' }), zaklad({ pero: 'sepiova' })).pero).toBe('modra');
    expect(spojDeniky(zaklad({}), zaklad({ pero: 'sepiova' })).pero).toBe('sepiova');
    expect(spojDeniky(zaklad({}), zaklad({ pero: 'zelena' as never })).pero).toBeUndefined();
  });
});
