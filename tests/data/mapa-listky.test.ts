import { describe, expect, it } from 'vitest';
import { rozmistiListky, boxListku, coTuBylo, razitkoOsoby, sirkaListku, type BodMapy, type Obdelnik } from '../../src/lib/mapa-listky';
import { vstupMapy } from '../../src/lib/mapa-vstup-build';
import { zijeVRoce, kdeVRoce } from '../../src/lib/cas-mapy';

const prekryva = (a: Obdelnik, b: Obdelnik) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

describe('lístečky lidí na mapě', () => {
  it('lísteček leží od špendlíku vpravo dolů, vlevo nahoru a do dalších rohů', () => {
    const b: BodMapy = { id: 'a', x: 100, y: 100, w: 104, h: 36 };
    expect(boxListku(b, 'pd')).toEqual([87, 89, 191, 125]);
    expect(boxListku(b, 'ln')).toEqual([9, 75, 113, 111]);
  });

  it('blízká místa dostanou lístečky, které se nepřekrývají a nepřesahují mapu', () => {
    const body: BodMapy[] = [
      { id: 'athenes', x: 200, y: 150, w: 120, h: 36 },
      { id: 'pireus', x: 196, y: 158, w: 110, h: 36 },
      { id: 'megara', x: 180, y: 140, w: 110, h: 36 },
      { id: 'korinth', x: 165, y: 152, w: 118, h: 36 },
      { id: 'delion', x: 214, y: 128, w: 104, h: 36 },
    ];
    const u = rozmistiListky(body, 390, 300);
    const boxy = [...u.values()].map((x) => x.box);
    for (let i = 0; i < boxy.length; i++) {
      for (let j = i + 1; j < boxy.length; j++) expect(prekryva(boxy[i], boxy[j]), `${i} a ${j}`).toBe(false);
      expect(boxy[i][0]).toBeGreaterThanOrEqual(0);
      expect(boxy[i][2]).toBeLessThanOrEqual(390);
    }
    // Žádný lísteček nezakryje celý špendlík jiného místa (raději se posune s nití).
    for (const b of body) {
      const pin: Obdelnik = [b.x - 7, b.y - 7, b.x + 7, b.y + 7];
      for (const [id, x] of u) if (id !== b.id && !x.jenSpendlik) expect(pin[0] >= x.box[0] && pin[2] <= x.box[2] && pin[1] >= x.box[1] && pin[3] <= x.box[3], `${id} zakrývá ${b.id}`).toBe(false);
    }
  });

  it('u pravého okraje se lísteček otočí doleva', () => {
    const u = rozmistiListky([{ id: 'x', x: 380, y: 100, w: 104, h: 36 }], 390, 300);
    expect(['ln', 'ld']).toContain(u.get('x')!.roh);
  });

  it('odhad šířky drží nejmenší lísteček z plátna', () => {
    expect(sirkaListku('Ion', 1, false)).toBe(104);
    expect(sirkaListku('Ion', 1, true)).toBe(84);
    expect(sirkaListku('Alexandrie', 12, false)).toBeGreaterThan(104);
  });
});

describe('co tu bylo a razítko z dat mapy', () => {
  const vstup = vstupMapy(() => undefined);
  const mista = new Map(vstup.mista.map((m) => [m.id, m]));

  it('v Athénách roku 360 př. n. l. bylo dřív Sókratovo místo a stál tam jeho proces', () => {
    const c = coTuBylo('athenes', -360, vstup.lide, vstup.udalosti);
    expect(c.drive.map((o) => o.id)).toContain('sokrates');
    expect(c.drive.every((o) => kdeVRoce(o, -360)?.misto !== 'athenes')).toBe(true);
    const proces = vstup.udalosti.find((u) => u.misto === 'athenes' && u.od === -399);
    if (proces) expect(c.udalosti.map((u) => u.id)).toContain(proces.id);
    expect(c.udalosti.every((u) => u.od <= -360)).toBe(true);
  });

  it('nikdo narozený po zvoleném roce mezi dřívějšími není', () => {
    const c = coTuBylo('athenes', -470, vstup.lide, vstup.udalosti);
    expect(c.drive.map((o) => o.id)).not.toContain('sokrates');
  });

  it('razítko z výtahu mapy: atribut, jinak rodiště', () => {
    const s = razitkoOsoby(vstup.lide.find((o) => o.id === 'sokrates')!, mista);
    expect(s.ikona).toBeTruthy();
    expect(s.stred).toBeUndefined();
    const bez = vstup.lide.find((o) => !o.atribut && o.mista.some((m) => m.role === 'narozeni'));
    if (bez) expect(razitkoOsoby(bez, mista).stred?.mesto).toBeTruthy();
  });

  it('první výprava má odpověď v datech: Sókratés roku 424 př. n. l. žije a někde je', () => {
    const s = vstup.lide.find((o) => o.id === 'sokrates')!;
    expect(zijeVRoce(s, -424)).toBe(true);
    expect(kdeVRoce(s, -424)?.misto).toBe('delion');
  });
});

describe('lísteček bez místa', () => {
  it('když se nikam nevejde, zůstane jen špendlík a nic se nepřekrývá', () => {
    const body = Array.from({ length: 6 }, (_, i) => ({ id: `m${i}`, x: 60 + i * 4, y: 40 + i * 3, w: 110, h: 44 }));
    const u = rozmistiListky(body, 200, 90, 6);
    const viditelne = [...u.values()].filter((x) => !x.jenSpendlik).map((x) => x.box);
    expect([...u.values()].some((x) => x.jenSpendlik)).toBe(true);
    for (let i = 0; i < viditelne.length; i++) for (let j = i + 1; j < viditelne.length; j++) expect(prekryva(viditelne[i], viditelne[j])).toBe(false);
  });
});
