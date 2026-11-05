// Stav Mapy a času v adrese: /mapa/?rok=-360&obdobi=1&osoba=platon&srovnat=aristoteles&stin=1.
// Adresa se dá sdílet a tlačítko Zpět vrací předchozí stav.

export interface StavAdresy {
  rok: number;
  obdobi?: number;
  osoba?: string;
  srovnat?: string;
  stin: boolean;
  /**
   * Příchod z odkazu „Přehrát život na mapě“ na stránce osoby: karta se otevře s fokusem na Přehrát
   * (při omezeném pohybu na Další zastávka). Mapa příznak po načtení z adresy smaže, nic se samo nespustí.
   */
  zivot?: boolean;
}

const idVzor = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Přečte stav z query stringu; neplatné hodnoty nahradí výchozími. Rok nula se posune na 1 n. l. */
export function prectiAdresu(
  hledani: string,
  vychozi: { rok: number; rozsah: [number, number]; osoby: Set<string>; obdobi: Set<number> },
): StavAdresy {
  const p = new URLSearchParams(hledani);
  let rok = Number.parseInt(p.get('rok') ?? '', 10);
  if (!Number.isFinite(rok)) rok = vychozi.rok;
  if (rok === 0) rok = 1;
  rok = Math.min(vychozi.rozsah[1], Math.max(vychozi.rozsah[0], rok));
  const o = Number.parseInt(p.get('obdobi') ?? '', 10);
  const osoba = p.get('osoba') ?? undefined;
  const srovnat = p.get('srovnat') ?? undefined;
  const platnaOsoba = (x?: string) => (x && idVzor.test(x) && vychozi.osoby.has(x) ? x : undefined);
  return {
    rok,
    obdobi: vychozi.obdobi.has(o) ? o : undefined,
    osoba: platnaOsoba(osoba),
    srovnat: platnaOsoba(srovnat),
    stin: p.get('stin') === '1',
    zivot: p.get('zivot') === '1' && !!platnaOsoba(osoba),
  };
}

/** Zapíše stav do query stringu (bez výchozích hodnot, aby adresa zůstala krátká). */
export function zapisAdresu(s: StavAdresy, obdobiProRok: number): string {
  const p = new URLSearchParams();
  p.set('rok', String(s.rok));
  if (s.obdobi && s.obdobi !== obdobiProRok) p.set('obdobi', String(s.obdobi));
  if (s.osoba) p.set('osoba', s.osoba);
  if (s.osoba && s.srovnat) p.set('srovnat', s.srovnat);
  if (s.stin) p.set('stin', '1');
  if (s.osoba && s.zivot) p.set('zivot', '1');
  return `?${p.toString()}`;
}
