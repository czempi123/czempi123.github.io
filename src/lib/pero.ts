// Studentova ruka (design-v2, K4a; bod 3 z Vizuálních zlepšení, plátno Zlepseni.dc.html › 3): co student napíše
// nebo zvolí, je jeho perem: kroužek kolem písmene ve Volbě, text v poli, později záznam v deníku, jezdec a mince.
// Pero si vybere jednou ze tří (výchozí modré); volba je v deníku (pole `pero`, součást exportu) a na <html>
// ji před vykreslením nastaví hlavička Zakladni.astro (data-pero), barvy jsou v tokens.css (--pero-*).

export const PERA = [
  { id: 'modra', nazev: 'modré' },
  { id: 'fialova', nazev: 'fialové' },
  { id: 'sepiova', nazev: 'sépiové' },
] as const;
export type Pero = (typeof PERA)[number]['id'];
export const VYCHOZI_PERO: Pero = 'modra';

export function jePero(x: unknown): x is Pero {
  return PERA.some((p) => p.id === x);
}

/**
 * Skript do hlavičky: z textu deníku (výraz TEXT_DENIKU_SKRIPT) nastaví data-pero na <html> před vykreslením.
 * Výchozí modré atribut nemá.
 */
export function skriptPera(textDeniku: string): string {
  const platna = JSON.stringify(PERA.map((p) => p.id).filter((p) => p !== VYCHOZI_PERO));
  return `try { var t = ${textDeniku}; var p = t ? JSON.parse(t).pero : null; if (${platna}.indexOf(p) >= 0) document.documentElement.dataset.pero = p; } catch (e) {}`;
}

/** Nastaví pero na stránce (bez uložení). */
export function ukazPero(p: Pero): void {
  if (typeof document === 'undefined') return;
  if (p === VYCHOZI_PERO) delete document.documentElement.dataset.pero;
  else document.documentElement.dataset.pero = p;
}
