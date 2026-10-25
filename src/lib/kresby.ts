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
