// Výchozí nadtitulky bloků: slovo nad blokem na stránce, když ho autor v YAML ani v MDX nepřepíše.
// Čtou je komponenty bloků i katalog hodin (src/lib/hodiny.ts), aby student na stránce hodiny viděl nad
// zastavením totéž slovo jako na stránce atlasu. Klíč je jméno komponenty, jak se píše v MDX.
// Nadtitulky kreseb jsou v src/lib/kresby.ts (NADTITULKY_KRESEB). Závěr cesty nadtitulek nemá.
export const VYCHOZI_NADTITULKY = {
  Volba: 'Co uděláš?',
  Roztrid: 'Roztřiď',
  ZmenJednuVec: 'Myšlenkový pokus',
  Spor: 'Spor',
  Odkryj: 'Než budeš číst dál',
  NejdrivSam: 'Než budeš číst dál',
  KdoZilDriv: 'Kdo žil dřív?',
  SlozArgument: 'Slož argument',
} as const;

export type BlokSNadtitulkem = keyof typeof VYCHOZI_NADTITULKY;
