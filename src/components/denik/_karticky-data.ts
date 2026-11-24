// Data kartiček pro Můj deník (denik-v2, K3), skládaná při sestavení: pojmy (líc a rub, místa, kde stojí) a z kvízu
// Co ti zůstalo? jen id, podnět, zadání, text správné možnosti, vysvětlení a odkaz zpět. Případ otázky, který se
// u hlasů téže otázky opakuje, je v `podnety` jednou. Logika kartiček v src/lib/karticky.ts.
import { katalogZustalo, pojmyKarticek } from '../../lib/herna/zustalo-data';
import { nezlomitelne } from '../../lib/sazba.js';
import type { DataKarticek, OtazkaKarticky, PojemKarticky } from '../../lib/karticky';

/** Kartičky pojmů a otázek Co ti zůstalo? daných období (antika: 1 a 2); `barva` je období stránky Tvoje antika. */
export function dataKarticek(obdobi: number[], barva: number): DataKarticek {
  const n = (t: string) => nezlomitelne(t);
  const pojmy: Record<string, PojemKarticky> = {};
  for (const p of pojmyKarticek()) {
    pojmy[p.id] = { ...p, vysvetleni: n(p.vysvetleni), priklad: n(p.priklad), mista: p.mista.map((m) => ({ ...m, text: n(m.text) })) };
  }
  const podnety: string[] = [];
  const index = new Map<string, number>();
  const zustalo: Record<string, OtazkaKarticky> = {};
  for (const o of katalogZustalo(obdobi).otazky) {
    const text = n(o.podnet);
    if (!index.has(text)) {
      index.set(text, podnety.length);
      podnety.push(text);
    }
    zustalo[o.id] = {
      id: o.id,
      podnet: index.get(text)!,
      zadani: n(o.zadani),
      spravna: n(o.moznosti.find((m) => m.id === o.spravna)?.text ?? ''),
      vysvetleni: n(o.vysvetleni),
      zpet: { href: o.zpet.href, text: n(o.zpet.text) },
      ...(o.obraz ? { obraz: o.obraz } : {}),
    };
  }
  return { pojmy, zustalo, podnety, obdobiZustalo: barva };
}
