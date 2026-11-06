// Mini mapa osoby: výřez podle míst a strana popisků (src/lib/mapa.ts).
import { describe, expect, it } from 'vitest';
import { rok } from '../../src/lib/casy';
import { projekce, radkyPopisku, stranyPopisku, umisteniPopisku, vyrezMiniMapy, VYREZY_OBDOBI_1, type MistoMiniMapy } from '../../src/lib/mapa';

const misto = (nazev: string, souradnice: [number, number], radky: string[] = ['působení']): MistoMiniMapy => ({ nazev, souradnice, radky });
const athenes = misto('Athény', [23.727, 37.984]);
const korinth = misto('Korinth', [22.88, 37.906], ['pobyt', 'smrt 323 př. n. l.']);
const sinope = misto('Sinópé', [35.15, 42.02], ['narození']);
const thurioi = misto('Thurioi', [16.49, 39.72], ['působení 444 př. n. l.']);
const abdera = misto('Abdéra', [24.98, 40.95], ['narození']);
const potidaia = misto('Potidaia', [23.33, 40.19], ['vojenské tažení 432 př. n. l.']);

const naVyrezu = (mista: MistoMiniMapy[]) => {
  const v = vyrezMiniMapy(mista);
  const p = projekce(v, 1e6);
  return { v, xy: mista.map((m) => p(m.souradnice) as [number, number]) };
};

describe('výřez mini mapy', () => {
  it('bez míst a s místy kolem Egejského moře zůstává výchozí', () => {
    expect(vyrezMiniMapy([])).toBe(VYREZY_OBDOBI_1.mini);
    expect(vyrezMiniMapy([athenes, potidaia])).toBe(VYREZY_OBDOBI_1.mini);
  });

  it('místo mimo výchozí výřez mapu oddálí, až jsou vidět všechna', () => {
    for (const mista of [[sinope, athenes, korinth], [abdera, athenes, thurioi]]) {
      const { v, xy } = naVyrezu(mista);
      expect(v.meritko).toBeLessThan(VYREZY_OBDOBI_1.mini.meritko);
      expect(v.sirka).toBe(VYREZY_OBDOBI_1.mini.sirka);
      for (const [x, y] of xy) {
        expect(x).toBeGreaterThan(8);
        expect(x).toBeLessThan(v.sirka - 8);
        expect(y).toBeGreaterThan(20);
        expect(y).toBeLessThan(v.vyska - 20);
      }
    }
  });

  it('nechá pod bodem místo na řádky popisku', () => {
    const { v, xy } = naVyrezu([sinope, athenes, korinth]);
    const korinthY = xy[2][1];
    expect(korinthY + korinth.radky.length * 22).toBeLessThan(v.vyska);
  });
});

describe('výřez mini mapy, když by popisek vyjel ven', () => {
  // Aristotelés: všech šest míst je ve výchozím výřezu vidět, ale Pella má popisek vlevo (vpravo těsně leží Stageira)
  // a ten by na telefonu vyjel přes levý okraj mapy.
  const aristoteles = [
    misto('Stageira', [23.75, 40.53], [`narození ${rok(-384)}`]),
    misto('Athény', [23.727, 37.984], [`studium asi ${rok(-367)}`, `působení ${rok(-335)}`]),
    misto('Assos', [26.34, 39.49], [`pobyt asi ${rok(-347)}`]),
    misto('Lesbos', [26.3, 39.2], [`pobyt asi ${rok(-345)}`]),
    misto('Pella', [22.52, 40.76], [`působení asi ${rok(-343)}`]),
    misto('Chalkis', [23.6, 38.46], [`smrt ${rok(-322)}`]),
  ];
  const radky = (mista: MistoMiniMapy[], v = vyrezMiniMapy(mista)) => {
    const p = projekce(v, 1e6);
    const b = mista.map((m) => ({ xy: p(m.souradnice) as [number, number], nazev: m.nazev, radky: m.radky }));
    const u = umisteniPopisku(b, v.sirka);
    return b.flatMap((x, i) => radkyPopisku(x, u[i]));
  };

  it('ve výchozím výřezu popisek Pelly vyčnívá vlevo', () => {
    expect(Math.min(...radky(aristoteles, VYREZY_OBDOBI_1.mini).map((r) => r[0]))).toBeLessThan(-12);
  });

  it('výřez se o málo oddálí a posune, až se vejdou všechny body i popisky', () => {
    const v = vyrezMiniMapy(aristoteles);
    expect(v).not.toBe(VYREZY_OBDOBI_1.mini);
    expect(v.meritko).toBeGreaterThan(VYREZY_OBDOBI_1.mini.meritko * 0.75);
    expect(v.meritko).toBeLessThan(VYREZY_OBDOBI_1.mini.meritko);
    for (const r of radky(aristoteles, v)) {
      expect(r[0]).toBeGreaterThanOrEqual(-12);
      expect(r[2]).toBeLessThanOrEqual(v.sirka + 12);
      expect(r[1]).toBeGreaterThanOrEqual(-12);
      expect(r[3]).toBeLessThanOrEqual(v.vyska + 12);
    }
  });

});

describe('strana popisku', () => {
  it('u pravého okraje vlevo, jinak vpravo', () => {
    expect(stranyPopisku([[100, 100], [400, 300]], 520)).toEqual(['vpravo', 'vlevo']);
  });

  it('bod, který má těsně vpravo souseda ve stejné výšce, dostane popisek vlevo', () => {
    expect(stranyPopisku([[178, 250], [200, 248]], 520)).toEqual(['vlevo', 'vpravo']);
  });

  it('soused nad nebo pod bodem stranu nemění', () => {
    expect(stranyPopisku([[180, 250], [190, 300]], 520)).toEqual(['vpravo', 'vpravo']);
  });
});

describe('umístění popisků', () => {
  const body = (mista: MistoMiniMapy[]) => {
    const { v, xy } = naVyrezu(mista);
    return { v, b: mista.map((m, i) => ({ xy: xy[i], nazev: m.nazev, radky: m.radky })) };
  };
  const prekryvy = (b: ReturnType<typeof body>['b'], u: ReturnType<typeof umisteniPopisku>) => {
    const radky = b.map((x, i) => radkyPopisku(x, u[i]));
    let n = 0;
    for (let i = 0; i < radky.length; i++) for (let j = i + 1; j < radky.length; j++) {
      if (radky[i].some((a) => radky[j].some((c) => a[0] < c[2] && c[0] < a[2] && a[1] < c[3] && c[1] < a[3]))) n++;
    }
    return n;
  };

  it('kde si popisky nepřekážejí, zůstávají u bodu', () => {
    const { v, b } = body([sinope, athenes, korinth]);
    expect(umisteniPopisku(b, v.sirka).map((u) => u.nahoru)).toEqual([false, false, false]);
  });

  it('Epikúros: popisek Kolofónu se vysune nad bod, ať nevjede do řádků Athén', () => {
    const mista = [
      misto('Samos', [26.93, 37.69], ['pobyt']),
      misto('Athény', [23.727, 37.984], ['pobyt 323 př. n. l.', 'působení 306 př. n. l.', 'smrt 270 př. n. l.']),
      misto('Kolofón', [27.14, 38.1], ['pobyt 321 př. n. l.']),
      misto('Mytiléna', [26.55, 39.11], ['působení 311 př. n. l.']),
      misto('Lampsakos', [26.69, 40.35], ['působení']),
    ];
    const { v, b } = body(mista);
    // Bez vysunutí se řádek „pobyt 321“ u Kolofónu potká s řádkem „pobyt 323“ u Athén.
    expect(prekryvy(b, stranyPopisku(b.map((x) => x.xy), v.sirka).map((strana) => ({ strana, nahoru: false })))).toBeGreaterThan(0);
    const u = umisteniPopisku(b, v.sirka);
    expect(u.map((x) => x.nahoru)).toEqual([false, false, true, false, false]);
    expect(prekryvy(b, u)).toBe(0);
    // Vysunutý popisek zůstává ve výřezu.
    expect(Math.min(...radkyPopisku(b[2], u[2]).map((r) => r[1]))).toBeGreaterThan(0);
  });

  it('vysunutý popisek má poslední řádek rolí u bodu a název nad ním', () => {
    const bod = { xy: [300, 200] as [number, number], nazev: 'Kolofón', radky: ['pobyt 321 př. n. l.'] };
    const [nazev, role] = radkyPopisku(bod, { strana: 'vlevo', nahoru: true });
    expect(role[3]).toBeLessThan(205);
    expect(nazev[3]).toBeLessThanOrEqual(role[1] + 1);
    expect(nazev[2]).toBeLessThan(300);
  });
});
