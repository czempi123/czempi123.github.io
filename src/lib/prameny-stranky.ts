// Prameny stránky z jejího textu MDX: citáty (<Citat id="…">), prameny bloků z YAML (Volba, Změň jednu věc, Spor,
// Roztřiď, Slož argument) a obrázky příběhů. Stránky období, směrů, pokusů, úvodů a tradic (K1 větve antika-doplnky)
// skládají Prameny odsud; profil má totéž přímo ve StrankaProfilu.astro.
import { getEntry } from 'astro:content';
import { citatyPodleId } from './data';

export interface PramenyStranky {
  prameny: string[];
  citaty: string[];
  obrazky: string[];
}

export async function pramenyZTextu(body: string | undefined, navic: Partial<PramenyStranky> = {}): Promise<PramenyStranky> {
  const text = body ?? '';
  const citaty = [...(navic.citaty ?? []), ...[...text.matchAll(/<Citat id="([^"]+)"/g)].map((m) => m[1])];
  const bloky = [...text.matchAll(/<(?:Volba|ZmenJednuVec|Spor|Roztrid|SlozArgument) id="([^"]+)"/g)].map((m) => m[1]);
  const zdrojeBloku = (await Promise.all(bloky.map((id) => getEntry('bloky', id)))).flatMap((b) => b?.data.zdroje ?? []);
  const obrazky = [...(navic.obrazky ?? []), ...[...text.matchAll(/<Pribeh [^>]*obrazek="([^"]+)"/g)].map((m) => m[1])];
  const prameny = [
    ...(navic.prameny ?? []),
    ...zdrojeBloku,
    ...citaty.map((id) => {
      const c = citatyPodleId.get(id);
      if (!c) throw new Error(`Citát „${id}“ není v zdroje.yaml`);
      return c.zdroj;
    }),
  ];
  return { prameny, citaty, obrazky };
}
