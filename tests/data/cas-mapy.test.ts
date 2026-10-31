// Časová logika Mapy a času: věk, „žije v roce“, vzdálenost mezi lidmi, přechod přes rok nula,
// poloha v daném roce a stín odkazu. Počítá se na skutečných datech atlasu.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { nactiData } from '../../src/lib/kontroly';
import {
  prirovnaniKZivotum,
  posunRok, naAstro, zAstro, zijeVRoce, vekVRoce, vzdalenost, kdeVRoce, odkudPrisla, zpravaOSmrti,
  poznamkaVRoce, vetaOVeku, stinOdkazu, zivotOsoby, oknoReky, lideVOkne, obdobiProRok, zijiciVRoce, let_,
} from '../../src/lib/cas-mapy';

const koren = join(import.meta.dirname, '../..');
const cti = (s: string) => readFileSync(join(koren, 'src/data', s), 'utf8');
const { data } = nactiData({
  lide: cti('lide.yaml'), mista: cti('mista.yaml'), vztahy: cti('vztahy.yaml'), udalosti: cti('udalosti.yaml'),
  obdobi: cti('obdobi.yaml'), zdroje: cti('zdroje.yaml'), krajiny: cti('krajiny.yaml'),
});
const os = (id: string) => data.lide.find((o) => o.id === id)!;
const NB = '\u00A0';
const bez = (s: string) => s.replaceAll(NB, ' ');

describe('rok nula neexistuje', () => {
  it('posun přes přelom letopočtu', () => {
    expect(posunRok(-1, 1)).toBe(1);
    expect(posunRok(1, -1)).toBe(-1);
    expect(posunRok(-5, 10)).toBe(6);
    expect(posunRok(-360, 10)).toBe(-350);
    expect(posunRok(-4, 4)).toBe(1);
  });
  it('astronomické číslování je vzájemně inverzní a nulu přeskočí', () => {
    for (const r of [-650, -2, -1, 1, 2, 2026]) expect(zAstro(naAstro(r))).toBe(r);
    expect([-2, -1, 0, 1, 2].map(zAstro)).toEqual([-3, -2, -1, 1, 2]);
  });
});

describe('žije v roce', () => {
  it('od narození do úmrtí včetně', () => {
    expect(zijeVRoce(os('sokrates'), -469)).toBe(true);
    expect(zijeVRoce(os('sokrates'), -399)).toBe(true);
    expect(zijeVRoce(os('sokrates'), -398)).toBe(false);
    expect(zijeVRoce(os('sokrates'), -470)).toBe(false);
  });
  it('ukázka z plánu pro rok 360 př. n. l.', () => {
    const r = -360;
    expect(['sokrates', 'demokritos', 'epikuros', 'zenon-z-kitia'].map((id) => zijeVRoce(os(id), r))).toEqual([false, false, false, false]);
    expect(['platon', 'diogenes', 'aristoteles'].map((id) => zijeVRoce(os(id), r))).toEqual([true, true, true]);
  });
  it('přes přelom letopočtu (Seneca asi 1 př. n. l. – 65 n. l.)', () => {
    expect(zijeVRoce(os('seneca'), -1)).toBe(true);
    expect(zijeVRoce(os('seneca'), 1)).toBe(true);
    expect(zijeVRoce(os('seneca'), -2)).toBe(false);
  });
  it('u lidí se známou jen dobou činnosti platí doba činnosti', () => {
    expect(zijeVRoce(os('aspasie'), -440)).toBe(true);
    expect(zijeVRoce(os('aspasie'), -428)).toBe(false);
  });
});

describe('věk', () => {
  it('bez ohledu na měsíc narození', () => {
    expect(vekVRoce(os('platon'), -360)).toBe(67);
    expect(vekVRoce(os('aristoteles'), -360)).toBe(24);
    expect(vekVRoce(os('sokrates'), -399)).toBe(70);
    expect(vekVRoce(os('marcus-aurelius'), 161)).toBe(40);
  });
  it('přes rok nula', () => {
    expect(vekVRoce(os('seneca'), 1)).toBe(1);
    expect(vekVRoce(os('seneca'), 65)).toBe(65);
    expect(vekVRoce({ narozen: { rok: -1 } }, 1)).toBe(1);
    expect(vekVRoce({ narozen: { rok: -10 } }, 10)).toBe(19);
  });
  it('věty do karty', () => {
    expect(bez(vetaOVeku(os('platon'), -360)!)).toBe('V roce 360 př. n. l. je mu asi 67 let.');
    expect(bez(vetaOVeku(os('hypatia'), 400)!)).toBe('V roce 400 n. l. je jí asi 30 let.');
    expect(vetaOVeku(os('aspasie'), -440)).toBeNull();
    expect(bez(let_(2))).toBe('2 roky');
  });
});

describe('vzdálenost mezi dvěma lidmi', () => {
  it('žili současně', () => {
    expect(bez(vzdalenost(os('platon'), os('aristoteles'))!.text)).toBe('Žili současně asi 37 let.');
    expect(bez(vzdalenost(os('sokrates'), os('platon'))!.text)).toBe('Žili současně asi 28 let.');
  });
  it('dělí je roky, přes chybějící rok nula', () => {
    // Sókratés zemřel 399 př. n. l., Epiktétos se narodil asi 55 n. l.: 399 + 55 − 1 = 453 let
    const v = vzdalenost(os('sokrates'), os('epiktetos'))!;
    expect(v.druh).toBe('deli');
    expect(v.let).toBe(453);
    expect(bez(v.text)).toBe('Dělí je asi 453 let. To je asi šest lidských životů.');
    // pořadí nehraje roli
    expect(vzdalenost(os('epiktetos'), os('sokrates'))!.let).toBe(453);
  });
  it('víc než dva lidské životy (190 let)', () => {
    const a = { id: 'a', jmeno: 'A', narozen: { rok: -400 }, zemrel: { rok: -330 }, mista: [] };
    const b = { id: 'b', jmeno: 'B', narozen: { rok: -140 }, zemrel: { rok: -80 }, mista: [] };
    expect(bez(vzdalenost(a, b)!.text)).toBe('Dělí je 190 let. To je víc než dva lidské životy.');
  });
  it('lidské životy: každá větev věty', () => {
    const p = (n: number) => bez(prirovnaniKZivotum(n));
    expect(p(49)).toBe('');
    expect(p(50)).toBe(' To je skoro jeden lidský život.');
    expect(p(56)).toBe(' To je skoro jeden lidský život.');
    expect(p(74)).toBe(' To je skoro jeden lidský život.');
    expect(p(80)).toBe(' To je asi jeden lidský život.');
    expect(p(100)).toBe(' To je víc než jeden lidský život.');
    expect(p(140)).toBe(' To jsou skoro dva lidské životy.');
    expect(p(160)).toBe(' To jsou asi dva lidské životy.');
    expect(p(230)).toBe(' To jsou asi tři lidské životy.');
    expect(p(260)).toBe(' To je víc než tři lidské životy.');
    expect(p(290)).toBe(' To jsou skoro čtyři lidské životy.');
    expect(p(370)).toBe(' To je skoro pět lidských životů.');
    expect(p(453)).toBe(' To je asi šest lidských životů.');
    expect(p(519)).toBe(' To je skoro sedm lidských životů.');
  });
  it('těsně přes přelom letopočtu', () => {
    const a = { id: 'a', jmeno: 'A', narozen: { rok: -60 }, zemrel: { rok: -2 }, mista: [] };
    const b = { id: 'b', jmeno: 'B', narozen: { rok: 2 }, zemrel: { rok: 70 }, mista: [] };
    expect(vzdalenost(a, b)!.let).toBe(3);
    expect(bez(vzdalenost(a, b)!.text)).toBe('Dělí je 3 roky.');
  });
});

describe('kde je člověk v daném roce', () => {
  it('Aristotelés: Stageira → Athény → Assos → Lesbos → Pella → Athény → Chalkis', () => {
    const kde = (r: number) => kdeVRoce(os('aristoteles'), r)?.misto;
    expect([-380, -360, -346, -344, -342, -330, -322].map(kde)).toEqual(['stageira', 'athenes', 'assos', 'lesbos', 'pella', 'athenes', 'chalkis']);
  });
  it('Platón se roku 361 př. n. l. vrátil ze Syrákús', () => {
    expect(kdeVRoce(os('platon'), -361)?.misto).toBe('syrakusy');
    expect(kdeVRoce(os('platon'), -360)?.misto).toBe('athenes');
    expect(odkudPrisla(os('platon'), -360)).toBe('syrakusy');
    expect(kdeVRoce(os('platon'), -347)?.role).toBe('smrt');
  });
  it('Sókratés u Délia a doma', () => {
    expect(kdeVRoce(os('sokrates'), -424)?.misto).toBe('delion');
    expect(kdeVRoce(os('sokrates'), -410)?.misto).toBe('athenes');
  });
  it('Epikúros: dětství na Samu, pak Kolofón, Mytiléna a Athény', () => {
    const kde = (r: number) => kdeVRoce(os('epikuros'), r)?.misto;
    expect([-335, -315, -308, -300].map(kde)).toEqual(['samos', 'kolofon', 'mytilena', 'athenes']);
  });
  it('mimo život nikde', () => expect(kdeVRoce(os('platon'), -300)).toBeNull());
});

describe('zprávy a poznámky', () => {
  it('úmrtí vybraného člověka', () => {
    expect(bez(zpravaOSmrti(os('platon')))).toBe('Platón zemřel roku 347 př. n. l.');
    expect(bez(zpravaOSmrti(os('sokrates')))).toBe('Sókratés zemřel roku 399 př. n. l.');
    expect(bez(zpravaOSmrti(os('hypatia')))).toBe('Hypatia zemřela roku 415 n. l.');
    expect(bez(zpravaOSmrti(os('kriton')))).toBe('Kritón zemřel po roce 399 př. n. l.');
    expect(bez(zpravaOSmrti(os('aspasie')))).toBe('Poslední zpráva o Aspasii je z roku 429 př. n. l.');
  });
  it('poznámky ke vztahům v roce 360 př. n. l.', () => {
    expect(bez(poznamkaVRoce(os('sokrates'), -360))).toBe('zemřel před 39 lety');
    expect(bez(poznamkaVRoce(os('epikuros'), -360))).toBe('narodí se za 19 let');
    expect(bez(poznamkaVRoce(os('aristoteles'), -360))).toBe('je mu 24 let');
  });
});

describe('mapa v čase', () => {
  it('rok 323 př. n. l.: Diogenés a Aristotelés ještě žijí, Platón ne', () => {
    const ids = zijiciVRoce(data.lide, -323).map((o) => o.id);
    expect(ids).toContain('diogenes');
    expect(ids).toContain('aristoteles');
    expect(ids).not.toContain('platon');
  });
  it('stín odkazu: Sókratés v roce 360 př. n. l. žije v Platónovi a Xenofóntovi', () => {
    const stin = stinOdkazu(data.lide, data.vztahy, -360).map((o) => o.id);
    expect(stin).toContain('sokrates');
    expect(stin).not.toContain('platon');
    // Thalés nemá v roce 360 žádného žijícího pokračovatele
    expect(stin).not.toContain('thales');
  });
  it('stín odkazu u polemiky: zůstává ten, s kým se žijící pře, ne zesnulý kritik', () => {
    const lide = [
      { id: 'starsi', narozen: { rok: -300 }, zemrel: { rok: -200 } },
      { id: 'kritik', narozen: { rok: -220 }, zemrel: { rok: -130 } },
    ] as unknown as typeof data.lide;
    // Kritik polemizuje se starším, který už nežije: starší má stín, dokud kritik žije.
    expect(stinOdkazu(lide, [{ od: 'kritik', k: 'starsi', typ: 'polemika' }], -150).map((o) => o.id)).toEqual(['starsi']);
    expect(stinOdkazu(lide, [{ od: 'kritik', k: 'starsi', typ: 'polemika' }], -120)).toEqual([]);
    // Obráceně to neplatí: zesnulý kritik nemá stín jen proto, že žije ten, koho kritizoval.
    expect(stinOdkazu(lide, [{ od: 'starsi', k: 'kritik', typ: 'polemika' }], -150)).toEqual([]);
    // Ostatní typy drží svůj směr: žák a čtenář navazují na `od`, známí na sebe navzájem.
    for (const typ of ['ucitel', 'vliv-textem'] as const) {
      expect(stinOdkazu(lide, [{ od: 'starsi', k: 'kritik', typ }], -150).map((o) => o.id)).toEqual(['starsi']);
      expect(stinOdkazu(lide, [{ od: 'kritik', k: 'starsi', typ }], -150)).toEqual([]);
    }
    expect(stinOdkazu(lide, [{ od: 'kritik', k: 'starsi', typ: 'znali-se' }], -150).map((o) => o.id)).toEqual(['starsi']);
    expect(stinOdkazu(lide, [{ od: 'starsi', k: 'kritik', typ: 'znali-se' }], -150).map((o) => o.id)).toEqual(['starsi']);
  });
  it('stín odkazu na datech: Chrýsippos zůstává, dokud žije Karneadés, který se s ním pře', () => {
    const stin = (r: number) => stinOdkazu(data.lide, data.vztahy, r).map((o) => o.id);
    const [chrysippos, karneades] = [zivotOsoby(os('chrysippos'))!, zivotOsoby(os('karneades'))!];
    expect(chrysippos.do).toBeLessThan(karneades.do);
    expect(stin(karneades.do)).toContain('chrysippos');
    expect(stin(karneades.do)).not.toContain('karneades');
    // Sókratés po smrti: pře se s ním Aristofanés a navazují na něj žáci.
    expect(stin(-390)).toContain('sokrates');
  });
  it('okno řeky drží šířku a nevyjede z rozsahu', () => {
    expect(oknoReky(-360, 240, [-650, 550])).toEqual([-480, -240]);
    expect(oknoReky(-640, 240, [-650, 550])).toEqual([-650, -410]);
    // přes přelom: 240 let kolem 1 n. l.
    const [od, do_] = oknoReky(1, 240, [-650, 550]);
    expect([od, do_]).toEqual([-120, 121]);
    expect(lideVOkne(data.lide, [-480, -240]).map((o) => o.id)).toContain('platon');
  });
  it('období podle roku (okna se překrývají, aktuální období se drží)', () => {
    expect(obdobiProRok(data.obdobi, -360)).toBe(1);
    expect(obdobiProRok(data.obdobi, -323, 2)).toBe(2);
    expect(obdobiProRok(data.obdobi, -323, 1)).toBe(1);
    expect(obdobiProRok(data.obdobi, 121)).toBe(2);
  });
});
