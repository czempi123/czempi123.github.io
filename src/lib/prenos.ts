// Přenos deníku odkazem (design-v2, K6; oddíl Mapa a deník: funkce): celý deník se zabalí (deflate) do kotvy adresy
// deníku, /denik/#prenos=…, a druhý prohlížeč ho po otevření odkazu přidá ke svému (spojDeniky, nic se nesmaže).
// Kotva se na server neposílá: deník zůstává mezi dvěma prohlížeči studenta. Kód QR čeká na rozhodnutí autora
// (knihovna navíc, plán větve › Co rozhodnout po K6).
import { rozeberDenik, type Denik } from './denik';

export const KOTVA_PRENOSU = 'prenos=';

/** Bajty na text base64url (bez =). */
function naBase64(b: Uint8Array): string {
  let s = '';
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function zBase64(t: string): Uint8Array {
  const s = atob(t.replace(/-/g, '+').replace(/_/g, '/'));
  const b = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
  return b;
}

async function proud(b: Uint8Array, s: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const vystup = new Blob([b as BlobPart]).stream().pipeThrough(s);
  return new Uint8Array(await new Response(vystup).arrayBuffer());
}

/** Deník jako kód do kotvy adresy. */
export async function zakodujDenik(d: Denik): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(d));
  return naBase64(await proud(json, new CompressionStream('deflate-raw')));
}

/** Deník z kódu v kotvě, nebo null (poškozený nebo cizí odkaz). */
export async function dekodujDenik(kod: string): Promise<Denik | null> {
  try {
    const json = await proud(zBase64(kod), new DecompressionStream('deflate-raw'));
    return rozeberDenik(new TextDecoder().decode(json));
  } catch {
    return null;
  }
}

/** Kód z kotvy adresy („#prenos=…“), nebo null. */
export function kodZKotvy(kotva: string): string | null {
  const k = kotva.replace(/^#/, '');
  return k.startsWith(KOTVA_PRENOSU) && k.length > KOTVA_PRENOSU.length ? k.slice(KOTVA_PRENOSU.length) : null;
}

/** Odkaz, který deník přenese do jiného prohlížeče. */
export function odkazPrenosu(puvod: string, kod: string): string {
  return `${puvod.replace(/\/$/, '')}/denik/#${KOTVA_PRENOSU}${kod}`;
}
