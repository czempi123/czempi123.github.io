// Kód QR pro přenos deníku (design-v2, K7a; souhlas autora z otázky 3 po K6). Knihovna qrcode-generator se načte
// až po klepnutí na „Ukázat kód QR“ (dynamický import), takže stránka deníku bez něj nic nestahuje navíc.
// Kód kreslí deník sám jako jednu cestu SVG v inkoustu (currentColor): ve dne i v noci je tmavý na světlém listu.

/** Nejdelší odkaz, který kód QR s nejnižší opravou chyb (L) unese v bajtovém režimu (verze 40: 2 953 bajtů). */
export const QR_NEJVIC = 2953;

export interface KodQr {
  /** počet modulů na straně (bez okraje) */
  strana: number;
  /** cesta SVG: každý tmavý modul jako čtvereček 1 × 1 v souřadnicích 0…strana */
  d: string;
}

type Tvurce = (typ: number, oprava: 'L' | 'M' | 'Q' | 'H') => {
  addData(data: string, rezim?: 'Byte'): void;
  make(): void;
  getModuleCount(): number;
  isDark(radek: number, sloupec: number): boolean;
};

/** Cesta SVG kódu QR pro text; null, když je text na kód moc dlouhý. Tvůrce dostane test, stránka knihovnu. */
export function kodQr(text: string, tvurce: Tvurce): KodQr | null {
  if (new TextEncoder().encode(text).length > QR_NEJVIC) return null;
  const qr = tvurce(0, 'L');
  qr.addData(text, 'Byte');
  try { qr.make(); } catch { return null; }
  const n = qr.getModuleCount();
  const casti: string[] = [];
  for (let r = 0; r < n; r++) {
    for (let s = 0; s < n; s++) {
      // Vodorovné úseky tmavých modulů jako jeden obdélník: cesta je o řád kratší.
      if (!qr.isDark(r, s)) continue;
      let k = s;
      while (k + 1 < n && qr.isDark(r, k + 1)) k++;
      casti.push(`M${s} ${r}h${k - s + 1}v1h${-(k - s + 1)}z`);
      s = k;
    }
  }
  return { strana: n, d: casti.join('') };
}

/** Načte knihovnu a vrátí kód pro odkaz (jen v prohlížeči). */
export async function kodQrOdkazu(odkaz: string): Promise<KodQr | null> {
  const m = await import('qrcode-generator');
  const tvurce = ((m as { default?: unknown }).default ?? m) as unknown as Tvurce;
  return kodQr(odkaz, tvurce);
}
