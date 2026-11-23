// Názvy kreseb (blok Kresba): nadpis nad kresbou i název zastavení v katalogu hodin (src/lib/hodiny.ts).
// Klíč je jméno komponenty bloku, jak se píše v MDX (<Lod id="…" />).
export const NAZVY_KRESEB = {
  DvePulky: 'Roztrhni kartu',
  Jeskyne: 'Dva pohledy do jeskyně',
  JeskyneVen: 'Cesta ven',
  KdeJeStred: 'Kde je střed?',
  KolikJeDost: 'Kdy je dost?',
  Lod: 'Loď po prknech',
  Maska: 'Strhni masku',
  PresypaciHodiny: 'Přesýpací hodiny',
  Saty: 'Stejné šaty, jiné světlo',
  StejnyVitr: 'Stejný vítr',
  TretiCara: 'Třetí čára',
  ZdvojCtverec: 'Zdvoj čtverec',
  Zrcadlo: 'Zrcadlo času',
} as const;

export type Kresba = keyof typeof NAZVY_KRESEB;

/** Nadtitulek nad kresbou (rám Kresba.svelte) i štítek zastavení u studenta na stránce hodiny. */
export const NADTITULKY_KRESEB = {
  DvePulky: 'Zkus si to',
  Jeskyne: 'Podívej se',
  JeskyneVen: 'Podívej se',
  KdeJeStred: 'Zkus si to',
  KolikJeDost: 'Zkus si to',
  Lod: 'Zkus si to',
  Maska: 'Podívej se',
  PresypaciHodiny: 'Zkus si to',
  Saty: 'Zkus si to',
  StejnyVitr: 'Zkus si to',
  TretiCara: 'Podívej se',
  ZdvojCtverec: 'Zkus si to',
  Zrcadlo: 'Zkus si to',
} as const satisfies Record<Kresba, string>;

/**
 * Co student v kresbě dělal nebo viděl, pro otázku Obraz a otázka v Co ti zůstalo? (denik-v2, K2): úsek textu kroku
 * cesty, kde kresba stojí, doslova (první písmeno smí být velké). Kde chybí, vezme se věta nad kresbou sama
 * (`vetaPredKresbou`). Že úsek v kroku opravdu stojí, hlídá tests/data/zustalo.test.ts.
 */
export const VETY_KRESEB: Partial<Record<Kresba, string>> = {
  DvePulky: 'Tady jsou tři karty z koše Zčásti. Každou roztrhni a pak zkoušej, co všechno se může stát na druhé půlce.',
  Jeskyne: 'Vězni z toho všeho vidí jen stíny, které oheň vrhá na stěnu.',
  JeskyneVen: 'Musí si zvykat. Nejdřív rozezná stíny, potom odrazy ve vodě, pak věci samé. Nebe snese nejdřív v noci. Slunce uvidí až nakonec.',
  KdeJeStred: 'Na břehu stojí člověk. Co je pro něj odvaha? Zkus měnit, kdo to je a jaká je voda.',
  Maska: 'Pod první maskou byla tvář menší, než se zdálo. Pod druhou ale byla skoro stejně velká.',
  PresypaciHodiny: 'Zkus to na jednom obyčejném všedním dni. Rozděl jeho hodiny podle toho, kdo o nich rozhodl: spánek, škola a rodina, tvoje volba, někdo nebo něco jiného. Co nerozdělíš, proteklo.',
  Saty: 'Šaty na ní mají pořád stejné dvě barvy, modrou a hnědou, jako body na té fotce. Posuvník mění jen světlo v místnosti.',
  TretiCara: 'Na tabuli visela karta s jednou čárou a vedle ní karta se třemi. Každý měl nahlas říct, která ze tří je stejně dlouhá jako ta první.',
  Zrcadlo: 'Je rok 1914 a začíná světová válka. Kde jsi byl? Vadilo ti, že u toho nejsi?',
};

/**
 * Proč obraz k velké otázce patří, pro rub otázky Obraz a otázka v Co ti zůstalo? (denik-v2, O): úsek doslova z textu
 * kroku, kde kresba stojí, nebo ze závěru cesty (poslední krok). Stojí před větou o cestě. Nic nového se nepíše:
 * kde taková věta v kroku ani v závěru není, nebo by bez okolí nedávala smysl („podle něj“ bez jména), kresba zůstane
 * jen s větou o cestě (Kdy je dost?, Loď po prknech, Zrcadlo času). Že úsek opravdu stojí v kroku nebo v závěru,
 * hlídá tests/data/zustalo.test.ts.
 */
export const PROC_KRESEB: Partial<Record<Kresba, string>> = {
  // závěr cesty Co mám ve svých rukou?
  DvePulky: 'Otrok a císař se shodli: ve tvých rukou je to, co si myslíš, co chceš a co uděláš. Epiktétos v tom viděl svobodu, Marcus pevnost.',
  Jeskyne: 'Kdyby spolu mohli mluvit, měli by stíny za skutečné věci.',
  JeskyneVen: 'Někdo mu říká, že teprve teď je blíž skutečnosti, a ptá se, co která věc je.',
  KdeJeStred: 'Dobrým se podle Aristotela člověk stává tím, že dobře jedná.',
  PresypaciHodiny: 'Čas není vidět, a proto se s ním podle Seneky zachází, jako by byl zadarmo.',
  Saty: 'Fotka byla jedna, a lidé na ní přesto viděli různé barvy.',
  // závěr cesty Čí život vlastně žiju?
  TretiCara: 'Aschův pokus zkoušel, jak snadno člověk pustí, co sám viděl, když skoro všichni před ním řeknou něco jiného.',
};

/** Náhled kresby v klidovém stavu (Co ti zůstalo?, kartička): WebP ve světlém a tmavém režimu, vyrábí ho scripts/nahledy-kreseb.mjs (přes scripts/snimky-prvek.mjs). */
export const nahledKresby = (k: string) => ({ svetly: `/kresby/nahled/${k}-svetly.webp`, tmavy: `/kresby/nahled/${k}-tmavy.webp` });

/**
 * Velké otázky, na které by obraz poctivě odpovídal taky, i když jeho cesta patří k jiné (denik-v2, T): v Co ti
 * zůstalo? nejsou mezi možnostmi, aby správná odpověď byla jen jedna. Když po nich nezbudou dvě jiné otázky, kresba
 * do kvízu nepřijde (Maska: tvář pod maskou svádí ke skutečnosti, k pravdě i k tomu, kdo jsem). Čísla otázek: 1 Jak mám žít?, 3 Má život
 * smysl?, 4 Jsem svobodný?, 5 Kdo vlastně jsem?, 6 Co je skutečné?, 7 Jak poznám, co je pravda?
 */
export const BLIZKE_OTAZKY_KRESEB: Partial<Record<Kresba, number[]>> = {
  DvePulky: [1], // co je v mých rukou, je i rada, jak žít
  Jeskyne: [7, 4], // stíny jsou i otázka poznání; vězni v poutech svádějí ke svobodě
  JeskyneVen: [7, 4],
  KolikJeDost: [4], // kdo chce pořád víc, je otrokem svých tužeb
  Lod: [6], // totožnost lodi je i otázka, co je skutečné
  Maska: [6, 1, 7, 5], // tvář pod maskou svádí ke skutečnosti, k pravdě i k sobě; strach z nejhoršího k tomu, jak žít
  PresypaciHodiny: [4, 3], // kdo o hodinách rozhodl, je otázka svobody; promrhaný čas i smyslu
  Saty: [6], // barvy, které nejsou, jsou i otázka skutečnosti
  TretiCara: [4, 5, 7], // podřídit se skupině je otázka svobody i toho, kdo jsem; vlastní oči proti většině i pravdy
  Zrcadlo: [5, 1], // čas před narozením svádí k otázce, kdo jsem; strach ze smrti k tomu, jak žít
};

/**
 * Natržený pruh papíru (koláž kreseb, design-v2 K7b): zem, horizont, břeh. Horní hrana je natržená, zbytek rovný.
 * Zuby jsou pseudonáhodné, ale pro stejné `semeno` vždy stejné, takže se kresba při každém vykreslení nemění
 * a sestavená stránka se shoduje s hydratovanou.
 * @param x0 levý okraj, @param x1 pravý okraj, @param y výška natržené hrany, @param dole spodní hrana pruhu
 * @param zub nejvyšší výchylka hrany (jednotky kresby), @param krok vzdálenost zubů
 */
export function natrzenyPruh(x0: number, x1: number, y: number, dole: number, { zub = 2.6, krok = 7, semeno = 1 } = {}): string {
  let s = (semeno * 9301 + 49297) % 233280;
  const nahodne = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const body: string[] = [`M${x0},${dole}`, `L${x0},${r(y)}`];
  for (let x = x0 + krok; x < x1; x += krok) body.push(`L${r(x + (nahodne() - 0.5) * krok * 0.5)},${r(y + (nahodne() - 0.5) * 2 * zub)}`);
  body.push(`L${x1},${r(y)}`, `L${x1},${dole}`, 'Z');
  return body.join(' ');
}

/** Natržený obdélník (lísteček, karta v kresbě): všechny čtyři hrany lehce nerovné. */
export function natrzenyList(x: number, y: number, sirka: number, vyska: number, { zub = 0.9, semeno = 1 } = {}): string {
  let s = (semeno * 7919 + 104729) % 233280;
  const n = () => {
    s = (s * 9301 + 49297) % 233280;
    return (s / 233280 - 0.5) * 2 * zub;
  };
  const kroky = (delka: number) => Math.max(2, Math.round(delka / 9));
  const body: string[] = [];
  const kh = kroky(sirka);
  const kv = kroky(vyska);
  for (let i = 0; i <= kh; i++) body.push(`${r(x + (sirka * i) / kh)},${r(y + n())}`);
  for (let i = 1; i <= kv; i++) body.push(`${r(x + sirka + n())},${r(y + (vyska * i) / kv)}`);
  for (let i = kh - 1; i >= 0; i--) body.push(`${r(x + (sirka * i) / kh)},${r(y + vyska + n())}`);
  for (let i = kv - 1; i >= 1; i--) body.push(`${r(x + n())},${r(y + (vyska * i) / kv)}`);
  return `M${body.join(' L')} Z`;
}

const r = (c: number) => Math.round(c * 10) / 10;
