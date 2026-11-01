// Skupiny vztahů v oddílu Doba a lidé: vliv přes texty ani spor na dálku nesmí skončit pod nadpisem „Znali se a přeli se“.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { roleVztahu, skupinyVztahu, mohliSePrit, sporNaDalku, VEK_SPORU, LEGENDA_VZTAHU, LEGENDA_TRADOVANY, type VztahOsoby } from '../../src/lib/vztahy';
import { TypVztahu } from '../../src/lib/schema';
import { vztahyOsoby, osoba } from '../../src/lib/data';

const v = (typ: 'ucitel' | 'znali-se' | 'vliv-textem' | 'polemika', smer: 'od' | 'k', druhy: string): VztahOsoby<string> =>
  ({ vztah: { od: smer === 'od' ? 'ja' : druhy, k: smer === 'od' ? druhy : 'ja', typ } as VztahOsoby['vztah'], druhy, smer });

describe('skupinyVztahu', () => {
  it('dělí vztahy na učitele, žáky, známé a vliv přes texty podle směru', () => {
    const s = skupinyVztahu([v('vliv-textem', 'k', 'autor'), v('ucitel', 'od', 'zak'), v('polemika', 'k', 'kritik'), v('ucitel', 'k', 'ucitel'), v('vliv-textem', 'od', 'ctenar'), v('znali-se', 'od', 'pritel')]);
    expect(s.map((x) => x.nazev)).toEqual(['Učitelé', 'Žáci', 'Znali se a přeli se', 'Četli ho a navázali', 'Koho četl']);
    expect(s.map((x) => x.lide.map((l) => l.druhy))).toEqual([['ucitel'], ['zak'], ['kritik', 'pritel'], ['ctenar'], ['autor']]);
  });
  it('prázdné skupiny vynechá', () => {
    expect(skupinyVztahu([])).toEqual([]);
    expect(skupinyVztahu([v('vliv-textem', 'od', 'ctenar')]).map((x) => x.nazev)).toEqual(['Četli ho a navázali']);
  });
  it('pod „Znali se a přeli se“ nikdy nestojí vliv přes texty', () => {
    for (const id of ['epiktetos', 'marcus-aurelius', 'epikuros', 'sokrates', 'diogenes', 'protagoras']) {
      const znali = skupinyVztahu(vztahyOsoby(id)).find((x) => x.nazev === 'Znali se a přeli se');
      expect(znali?.lide.every((l) => l.vztah.typ !== 'vliv-textem') ?? true, id).toBe(true);
    }
  });
  it('Epiktétos a Marcus Aurelius se neznali: jeden navázal, druhý četl', () => {
    const e = skupinyVztahu(vztahyOsoby('epiktetos'));
    expect(e.find((x) => x.nazev === 'Četli ho a navázali')?.lide.map((l) => l.druhy.id)).toEqual(['marcus-aurelius']);
    expect(e.some((x) => x.nazev === 'Znali se a přeli se')).toBe(false);
    const m = skupinyVztahu(vztahyOsoby('marcus-aurelius'));
    expect(m.find((x) => x.nazev === 'Koho četl')?.lide.map((l) => l.druhy.id)).toEqual(['herakleitos', 'epiktetos']);
    expect(m.some((x) => x.nazev === 'Znali se a přeli se')).toBe(false);
  });
});

describe('spor na dálku', () => {
  const zil = (od: number, do_: number) => ({ narozen: { rok: od }, zemrel: { rok: do_ } });
  it('osobně se mohli přít jen ti, kdo žili zároveň a oběma bylo aspoň patnáct', () => {
    expect(VEK_SPORU).toBe(15);
    expect(mohliSePrit(zil(-427, -347), zil(-384, -322))).toBe(true); // Platón a Aristotelés
    expect(mohliSePrit(zil(-469, -399), zil(-384, -322))).toBe(false); // Sókratés zemřel před Aristotelovým narozením
    expect(mohliSePrit(zil(-280, -207), zil(-214, -129))).toBe(false); // Karneadovi bylo sedm, když Chrýsippos zemřel
    expect(mohliSePrit(zil(-280, -199), zil(-214, -129))).toBe(true); // v patnácti už ano
    expect(mohliSePrit(zil(-280, -200), zil(-214, -129))).toBe(false);
    expect(mohliSePrit(zil(-384, -322), zil(-469, -399))).toBe(false); // na pořadí nezáleží
  });
  it('počítá přes přelom letopočtu bez roku nula a chybějící roky nechává být', () => {
    expect(mohliSePrit(zil(-30, 14), zil(-1, 60))).toBe(false); // ve 14 n. l. je mladšímu čtrnáct
    expect(mohliSePrit(zil(-30, 15), zil(-1, 60))).toBe(true);
    expect(mohliSePrit({ narozen: { rok: -384 } }, zil(-469, -399))).toBe(true);
    expect(mohliSePrit({ aktivni: { od: -450, do: -420 } }, zil(-469, -399))).toBe(true); // roky činnosti se berou celé
  });
  it('sporem na dálku je jen polemika', () => {
    expect(sporNaDalku({ typ: 'polemika' }, zil(-384, -322), zil(-469, -399))).toBe(true);
    expect(sporNaDalku({ typ: 'polemika' }, zil(-384, -322), zil(-427, -347))).toBe(false);
    expect(sporNaDalku({ typ: 'vliv-textem' }, zil(-384, -322), zil(-469, -399))).toBe(false);
  });
  it('má vlastní dvě skupiny podle toho, kdo se přel', () => {
    const dalku = (smer: 'od' | 'k', druhy: string) => ({ ...v('polemika', smer, druhy), naDalku: true });
    const s = skupinyVztahu([dalku('k', 'pozdejsi-kritik'), v('polemika', 'k', 'soucasnik'), dalku('od', 'davny-protivnik'), v('znali-se', 'od', 'pritel')]);
    expect(s.map((x) => x.nazev)).toEqual(['Znali se a přeli se', 'S kým se přel na dálku', 'Kdo se s ním přel později']);
    expect(s.map((x) => x.lide.map((l) => l.druhy))).toEqual([['soucasnik', 'pritel'], ['davny-protivnik'], ['pozdejsi-kritik']]);
  });
  it('Aristotelés se se Sókratem a Prótagorem přel na dálku, s Platónem tváří v tvář', () => {
    const jmena = (id: string, nazev: string) => skupinyVztahu(vztahyOsoby(id)).find((x) => x.nazev === nazev)?.lide.map((l) => l.druhy.id) ?? [];
    expect(jmena('aristoteles', 'S kým se přel na dálku')).toEqual(['sokrates', 'protagoras', 'herakleitos']);
    expect(jmena('aristoteles', 'Znali se a přeli se')).toEqual(expect.arrayContaining(['platon', 'xenokrates']));
    // Theofrastos je od T1 větve antika-doplnky Aristotelův žák (Diogenés Laertios V, 36), ne jen známý.
    expect(jmena('aristoteles', 'Žáci')).toContain('theofrastos');
    expect(jmena('aristoteles', 'Znali se a přeli se')).not.toContain('sokrates');
    expect(jmena('sokrates', 'Kdo se s ním přel později')).toEqual(['aristoteles']);
    expect(jmena('sokrates', 'Znali se a přeli se')).toContain('aristofanes');
    expect(jmena('protagoras', 'Kdo se s ním přel později')).toEqual(['aristoteles']);
    expect(jmena('platon', 'Znali se a přeli se')).toEqual(expect.arrayContaining(['aristoteles', 'diogenes']));
  });
  it('pod „Znali se a přeli se“ nestojí nikdo, s kým se osoba stránky přít nemohla', () => {
    for (const o of ['sokrates', 'platon', 'aristoteles', 'protagoras', 'epikuros', 'diogenes', 'epiktetos', 'marcus-aurelius', 'karneades', 'chrysippos']) {
      const znali = skupinyVztahu(vztahyOsoby(o)).find((x) => x.nazev === 'Znali se a přeli se');
      for (const l of znali?.lide ?? []) expect(mohliSePrit(osoba(o), l.druhy), `${o} a ${l.druhy.id}`).toBe(true);
    }
  });
  it('Hérakleitos a Parmenidés: žádný vztah mezi nimi; Aristotelés se s Hérakleitem přel na dálku', () => {
    const jmena = (id: string, nazev: string) => skupinyVztahu(vztahyOsoby(id)).find((x) => x.nazev === nazev)?.lide.map((l) => l.druhy.id) ?? [];
    // Jestli jeden o druhém věděl, nevíme: proti sobě je postavil až Platón (podklady celku 7).
    expect(vztahyOsoby('herakleitos').some((x) => x.druhy.id === 'parmenides')).toBe(false);
    expect(vztahyOsoby('parmenides').some((x) => x.druhy.id === 'herakleitos')).toBe(false);
    expect(jmena('herakleitos', 'Kdo se s ním přel později')).toEqual(['aristoteles']);
    expect(jmena('herakleitos', 'Znali se a přeli se')).toEqual([]);
    expect(jmena('herakleitos', 'Četli ho a navázali')).toEqual(expect.arrayContaining(['platon', 'seneca', 'marcus-aurelius']));
    // Setkání se Sókratem je Platónova scéna: v datech tradované, ne doložené.
    const setkani = vztahyOsoby('sokrates').find((x) => x.druhy.id === 'parmenides');
    expect(setkani?.vztah.typ).toBe('znali-se');
    expect(setkani?.vztah.tradovany).toBe(true);
    expect(jmena('seneca', 'Koho četl')).toContain('herakleitos');
  });
  it('Karneadés a Chrýsippos: spor na dálku z obou stran', () => {
    expect(vztahyOsoby('karneades').find((x) => x.druhy.id === 'chrysippos')?.naDalku).toBe(true);
    expect(vztahyOsoby('chrysippos').find((x) => x.druhy.id === 'karneades')?.naDalku).toBe(true);
  });
});

describe('roleVztahu', () => {
  it('spor na dálku má vlastní popisek, polemika současníků starý', () => {
    expect(roleVztahu({ typ: 'polemika' }, 'od', true)).toBe('přel se s jeho učením');
    expect(roleVztahu({ typ: 'polemika' }, 'k', true)).toBe('přel se s jeho učením');
    expect(roleVztahu({ typ: 'polemika' }, 'od')).toBe('polemizoval s ním');
    expect(roleVztahu({ typ: 'znali-se' }, 'od', true)).toBe('znali se');
  });
  it('u vlivu přes texty říká, kdo na koho navázal', () => {
    expect(roleVztahu({ typ: 'vliv-textem' }, 'od')).toBe('navázal na jeho texty');
    expect(roleVztahu({ typ: 'vliv-textem' }, 'k')).toBe('znal ho z textů');
  });
  it('učitel a žák podle směru', () => {
    expect(roleVztahu({ typ: 'ucitel' }, 'od')).toBe('žák');
    expect(roleVztahu({ typ: 'ucitel' }, 'k')).toBe('učitel');
  });
  it('rod podle toho, kdo je podmět: čtenář u vlivu přes texty, kritik u polemiky', () => {
    const zena = { zena: true }, muz = {};
    expect(roleVztahu({ typ: 'vliv-textem' }, 'k', false, { ja: zena, druhy: muz })).toBe('znala ho z textů');
    expect(roleVztahu({ typ: 'vliv-textem' }, 'od', false, { ja: muz, druhy: zena })).toBe('navázala na jeho texty');
    expect(roleVztahu({ typ: 'vliv-textem' }, 'od', false, { ja: zena, druhy: muz })).toBe('navázal na její texty');
    expect(roleVztahu({ typ: 'polemika' }, 'od', true, { ja: zena, druhy: muz })).toBe('přela se s jeho učením');
    expect(roleVztahu({ typ: 'polemika' }, 'k', true, { ja: zena, druhy: muz })).toBe('přel se s jejím učením');
    expect(roleVztahu({ typ: 'polemika' }, 'k', false, { ja: zena, druhy: muz })).toBe('polemizoval s ní');
    expect(roleVztahu({ typ: 'ucitel' }, 'od', false, { ja: muz, druhy: zena })).toBe('žákyně');
    expect(roleVztahu({ typ: 'ucitel' }, 'k', false, { ja: muz, druhy: zena })).toBe('učitelka');
  });
  it('Hypatia: nadpisy a popisky v ženském rodě na její stránce i na stránce Plótína', () => {
    const hypatia = osoba('hypatia');
    expect(hypatia.zena).toBe(true);
    const s = skupinyVztahu(vztahyOsoby('hypatia'), hypatia.zena);
    const cetla = s.find((x) => x.nazev === 'Koho četla');
    expect(cetla?.lide.map((l) => l.druhy.id)).toContain('plotinos');
    expect(s.some((x) => x.nazev === 'Koho četl')).toBe(false);
    const plotinos = cetla!.lide.find((l) => l.druhy.id === 'plotinos')!;
    expect(roleVztahu(plotinos.vztah, plotinos.smer, plotinos.naDalku, { ja: hypatia, druhy: plotinos.druhy })).toBe('znala ho z textů');
    const naPlotinovi = vztahyOsoby('plotinos').find((x) => x.druhy.id === 'hypatia')!;
    expect(roleVztahu(naPlotinovi.vztah, naPlotinovi.smer, naPlotinovi.naDalku, { ja: osoba('plotinos'), druhy: naPlotinovi.druhy })).toBe('navázala na jeho texty');
  });
  it('nadpisy skupin v ženském rodě', () => {
    const dalku = (smer: 'od' | 'k', druhy: string) => ({ ...v('polemika', smer, druhy), naDalku: true });
    const s = skupinyVztahu([dalku('od', 'a'), dalku('k', 'b'), v('vliv-textem', 'od', 'c'), v('vliv-textem', 'k', 'd')], true);
    expect(s.map((x) => x.nazev)).toEqual(['S kým se přela na dálku', 'Kdo se s ní přel později', 'Četli ji a navázali', 'Koho četla']);
  });
});

describe('legenda čar mezi životy', () => {
  it('má právě čtyři typy vztahů ze schématu dat, každý jednou a s vlastní čárou', () => {
    expect(LEGENDA_VZTAHU.map((v) => v.typ)).toEqual([...TypVztahu.options]);
    expect(new Set(LEGENDA_VZTAHU.map((v) => v.cara)).size).toBe(4);
  });
  it('pojmenování sedí s CLAUDE.md a s kartou člověka', () => {
    const pravidla = readFileSync(join(import.meta.dirname, '../../CLAUDE.md'), 'utf8');
    const veta = pravidla.split('\n').find((r) => r.includes('Vztah mezi lidmi má vždy typ'))!;
    for (const v of LEGENDA_VZTAHU) expect(veta, v.nazev).toContain(v.nazev);
    const karta = readFileSync(join(import.meta.dirname, '../../src/components/mapa/KartaCloveka.svelte'), 'utf8');
    expect(karta).toContain(`· ${LEGENDA_TRADOVANY}`);
  });
});
