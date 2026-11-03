// Které stránky období, směrů, pokusů a tradic v atlasu jsou (při sestavení z kolekcí Astra).
// Jediné místo, odkud Domů, Lidé a směry, drobečky, hlavičky osob a Kam dál berou odkaz na nové typy stránek:
// když stránka vznikne, odkazy na ni se objeví všude samy (a dokud není, vedou tam, kam dosud).
import { getCollection } from 'astro:content';
import { data } from './data';
import { adresaObdobi, adresaSmeru, strankyObdobi, type StrankyAtlasu } from './stranky';

let ulozene: Promise<StrankyAtlasu> | null = null;

async function nacti(): Promise<StrankyAtlasu> {
  const [obdobi, smery, pokusy, nabozenstvi] = await Promise.all([
    getCollection('obdobi'),
    getCollection('smery'),
    getCollection('pokusy'),
    getCollection('nabozenstvi'),
  ]);
  const o = strankyObdobi(obdobi, data.obdobi);
  if (o.chyby.length) throw new Error(o.chyby.join('\n'));
  for (const s of smery) {
    const maText = !!s.body?.trim();
    if (!!s.data.perex !== maText) {
      throw new Error(`Směr „${s.id}“: stránku má směr s perexem i textem; ${s.data.perex ? 'text chybí' : 'perex chybí'}.`);
    }
  }
  return {
    obdobi: o.mapa,
    smery: new Set(smery.filter((s) => s.data.perex).map((s) => s.id)),
    pokusy: new Set(pokusy.map((p) => p.id)),
    nabozenstvi: new Set(nabozenstvi.map((n) => n.id)),
  };
}

/** Seznam nových stránek (načte se jednou za sestavení). */
export function strankyAtlasu(): Promise<StrankyAtlasu> {
  if (import.meta.env.DEV) return nacti();
  ulozene ??= nacti();
  return ulozene;
}

/** Adresy období a směrů nad tím, co v atlasu je. */
export async function adresyStranek(): Promise<{ obdobi: (id: number) => string; smer: (id: string) => string | undefined }> {
  const s = await strankyAtlasu();
  return { obdobi: (id) => adresaObdobi(id, s), smer: (id) => adresaSmeru(id, s) };
}
