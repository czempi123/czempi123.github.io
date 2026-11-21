// Zamíchání se semínkem (herna-v1, K1): stejné pořadí při sestavení, po hydrataci i po obnovení stránky.
// Semínko je text (id bloku, id karty); z něj FNV-1a a generátor mulberry32. Žádné Math.random: náhoda by se
// po každém načtení měnila a student by se ke stejné hře nevrátil (plán herna-v1, Co rozhodnout, otázka 4).

/** 32bitové semínko z textu (FNV-1a). */
export function semeno(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Generátor čísel 0 ≤ x < 1 ze semínka (mulberry32). */
export function generator(s: number): () => number {
  let a = s >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Nová řada v pořadí podle semínka (Fisher–Yates); vstup se nemění. */
export function zamichej<T>(pole: readonly T[], klic: string): T[] {
  const vysledek = [...pole];
  const dalsi = generator(semeno(klic));
  for (let i = vysledek.length - 1; i > 0; i--) {
    const j = Math.floor(dalsi() * (i + 1));
    [vysledek[i], vysledek[j]] = [vysledek[j], vysledek[i]];
  }
  return vysledek;
}
