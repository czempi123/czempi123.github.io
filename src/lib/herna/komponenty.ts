// Jméno komponenty každé hry herny podle druhu bloku v YAML (herna-v1, T). Čte ho obal HraStranky.astro (hra ve
// frontmatteru stránky období a otázky) i katalog hodin, aby obě místa skládala zastavení stejně.

export const KOMPONENTA_HRY = {
  serad: 'SeradNaOse',
  'kdo-rekl': 'KdoToRekl',
  tipni: 'TipniSi',
  kde: 'KdeToBylo',
  doplnit: 'DoplnCitat',
  pary: 'Pary',
  pravy: 'PravyNeboPodvrzeny',
  slabe: 'NajdiSlabeMisto',
  'kdo-by': 'KdoByToRekl',
} as const;

export type DruhHry = keyof typeof KOMPONENTA_HRY;

export const jeHra = (druh: string | undefined): druh is DruhHry => !!druh && druh in KOMPONENTA_HRY;
