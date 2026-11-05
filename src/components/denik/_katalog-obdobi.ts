// Katalog pro Tvoje antika (src/lib/tvoje-obdobi.ts): otázky s důvody z hlasů, cesty období se závěrečným pravidlem
// a bloky cest (Volba, Spor, Změň jednu věc) se zastánci každé odpovědi. Skládá se při sestavení z kolekcí;
// zastánce bere z oddílů Kdo je na tvé straně (atribut `osoby` u <Strana>) a ze stran Sporů.
import { getCollection } from 'astro:content';
import { osoby as osobyDat, citatyPodleId } from '../../lib/data';
import { adresaStranekOsob } from '../../lib/stranky-osob';
import { adresaOtazky } from '../../lib/otazky';
import { adresaKroku, adresaCesty, krokyCesty } from '../../lib/cesty';
import { popisStran, platneKody, UPROSTRED } from '../../lib/strany';
import { nezlomitelne } from '../../lib/sazba.js';
import type { TBlok } from '../../lib/bloky-schema';
import {
  blokyZMdx, duvodZMyslenky, pravidloZMdx, stranyZMdx, zastanciOdpovedi,
  type BlokKatalogu, type CestaKatalogu, type KatalogObdobi, type OdpovedKatalogu, type OsobaKatalogu, type OtazkaKatalogu, type StranaZMdx,
} from '../../lib/tvoje-obdobi';

/** Odpověď studenta, který ve Sporu zůstal uprostřed. */
const UPROSTRED_TEXT = 'Uprostřed sporu';

/** Katalog cest daných období (antika: 1 a 2) a první cesta období pro prázdný stav. */
export async function katalogObdobi(obdobi: number[]): Promise<{ katalog: KatalogObdobi; prvniCesta?: { nazev: string; adresa: string } }> {
  const adresaOsoby = await adresaStranekOsob();
  const cesty = (await getCollection('cesty')).filter((c) => obdobi.includes(c.data.obdobi)).sort((a, b) => a.data.cislo - b.data.cislo);
  const kroky = (await getCollection('kroky')).map((k) => ({ ...k.data, body: k.body ?? '' }));
  const bloky = new Map((await getCollection('bloky')).map((b) => [b.id, b.data as TBlok]));
  const citat = (id: string) => citatyPodleId.get(id)?.cesky;

  const osoby: Record<string, OsobaKatalogu> = {};
  const pridejOsobu = (id: string) => {
    const o = osobyDat.get(id);
    if (!o) throw new Error(`Tvoje antika: osoba „${id}“ není v src/data/lide.yaml.`);
    const adresa = adresaOsoby(id);
    osoby[id] ??= { id, jmeno: o.jmeno, obdobi: o.obdobi, ...(adresa ? { adresa } : {}), ...(o.atribut ? { ikona: o.atribut.ikona } : {}), ...(o.zena ? { zena: true as const } : {}) };
  };

  const katalogCest: CestaKatalogu[] = [];
  const katalogBloku: BlokKatalogu[] = [];
  for (const c of cesty) {
    const k = krokyCesty(kroky, c.id);
    const posledni = k[k.length - 1];
    const idPravidla = posledni ? pravidloZMdx(posledni.body) : undefined;
    katalogCest.push({
      slug: c.id,
      nazev: c.data.nazev,
      cislo: c.data.cislo,
      otazka: c.data.otazka,
      ...(idPravidla ? { pravidlo: { id: idPravidla, adresa: `${adresaKroku(c.id, posledni.krok)}#${idPravidla}` } } : {}),
    });

    // Oddíly Kdo je na tvé straně ze všech kroků cesty; bloky v pořadí kroků.
    const oddily = new Map<string, StranaZMdx[]>();
    const kde = new Map<string, number>();
    for (const krok of k) {
      for (const [blok, strany] of stranyZMdx(krok.body, citat)) oddily.set(blok, [...(oddily.get(blok) ?? []), ...strany]);
      for (const id of blokyZMdx(krok.body)) if (!kde.has(id)) kde.set(id, krok.krok);
    }
    for (const [id, n] of kde) {
      const blok = bloky.get(id);
      const popis = popisStran(blok);
      if (!blok || !popis) continue;
      const strany = oddily.get(id);
      const spor = blok.druh === 'spor' ? blok.strany : undefined;
      const odpovedi: OdpovedKatalogu[] = platneKody(popis).map((kod, i) => {
        let text = '';
        if (blok.druh === 'volba') text = blok.moznosti[i].text;
        else if (blok.druh === 'zmena') text = blok.moznosti.find((m) => m.id === kod)?.text ?? '';
        else if (blok.druh === 'spor') text = kod === UPROSTRED ? UPROSTRED_TEXT : blok.strany[i].postoj;
        const zastanci = zastanciOdpovedi(kod, strany, spor).map((z) => ({ osoba: z.osoba, ...(z.duvod ? { duvod: nezlomitelne(z.duvod) } : {}) }));
        zastanci.forEach((z) => pridejOsobu(z.osoba));
        return { kod, text: nezlomitelne(text.replace(/\s+/g, ' ').trim()), zastanci };
      });
      if (odpovedi.some((o) => o.zastanci.length)) katalogBloku.push({ id, cesta: c.id, adresa: `${adresaKroku(c.id, n)}#${id}`, popis, odpovedi });
    }
  }

  // Hlasy otázek: kdo z nich je studentovi nejblíž, zvolí na ose hlasů (src/lib/osa-hlasu.ts).
  const otazky = await getCollection('otazky');
  otazky.forEach((o) => o.data.hlasy.forEach((h) => pridejOsobu(h.osoba)));
  const katalogOtazek: OtazkaKatalogu[] = otazky.map((o) => ({
    cislo: o.data.cislo,
    slug: o.id,
    otazka: o.data.otazka,
    adresa: adresaOtazky(o.id, o.data),
    hlasy: o.data.hlasy.map((h) => h.osoba),
    duvody: Object.fromEntries(
      o.data.hlasy.flatMap((h) => {
        const d = duvodZMyslenky(h.myslenka);
        return d ? [[h.osoba, nezlomitelne(d)]] : [];
      }),
    ),
  }));

  const prvni = cesty[0];
  return {
    katalog: { otazky: katalogOtazek, cesty: katalogCest, bloky: katalogBloku, osoby },
    ...(prvni ? { prvniCesta: { nazev: prvni.data.nazev, adresa: adresaCesty(prvni.id) } } : {}),
  };
}
