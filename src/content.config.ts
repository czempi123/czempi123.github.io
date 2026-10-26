// Obsahové kolekce Atlasu myšlení (docs/plan.md, oddíl Obsahový model).
// Datové soubory v src/data (lide, vztahy, mista, udalosti, obdobi, zdroje) mají vlastní schémata
// v src/lib/schema.ts a ověřují se v src/lib/data.ts.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { Blok } from './lib/bloky-schema';

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const obdobi = z.number().int().min(1).max(8);
const otazka = z.number().int().min(1).max(10);
const vsechny = (slozka: string) => glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${slozka}` });

const osobnosti = defineCollection({
  loader: vsechny('osobnosti'),
  schema: z.object({
    /** id osoby v src/data/lide.yaml */
    osoba: id,
    /**
     * Další osoby téže stránky (společný profil Kratéta a Hipparchie: `dalsi: [hipparchia]`).
     * Hlavní osoba (`osoba`) dává stránce období a pořadí; adresu všech osob skládá adresaOsoby (src/lib/adresa-osoby.ts).
     */
    dalsi: z.array(id).optional(),
    nadtitulek: z.string(),
    /** titulek bez tečky, např. „Sókratés“ */
    titulek: z.string(),
    /** pointa titulku, vysází se kurzívou („Muž, který se ptal.“) */
    pointa: z.string(),
    /** hlavní citát stránky (id v zdroje.yaml) */
    citat: id.optional(),
    kapitoly: z.array(
      z.object({
        cislo: z.string().regex(/^\d{2}$/),
        kotva: id,
        nazev: z.string(),
        /** hotovo = napsaná v tomto souboru; osnova = zatím jen plán */
        stav: z.enum(['hotovo', 'osnova']),
        osnova: z.string().optional(),
      }),
    ),
  }),
});

const smery = defineCollection({
  loader: vsechny('smery'),
  schema: z.object({
    nazev: z.string(),
    obdobi: z.array(obdobi).min(1),
    /** pořadí na stránce Lidé a směry */
    poradi: z.number().int(),
  }),
});

const obdobiTexty = defineCollection({
  loader: vsechny('obdobi'),
  schema: z.object({ obdobi, perex: z.string() }),
});

const otazky = defineCollection({
  loader: vsechny('otazky'),
  schema: z.object({
    cislo: otazka,
    otazka: z.string(),
    disciplina: z.string(),
    /** otázka úvodního případu, na kterou odpovídají všichni myslitelé („Komu věřit?“) */
    pripad: z.string().trim().min(1).optional(),
    /**
     * Hlasy myslitelů na stránce /otazka/<slug>/ (pořadí podle narození dopočítá stránka).
     * `odpoved`: jedna až dvě věty, jak by myslitel naložil s úvodním případem (nahoře, vedle sebe).
     * `myslenka`: proč to tak viděl, 2–4 věty z podkladů; prázdný řádek dělí odstavce (časová osa).
     * Otázka bez hlasů zatím nemá vlastní stránku, jen řádek v přehledu /otazky/.
     */
    hlasy: z
      .array(
        z
          .object({
            osoba: id,
            odpoved: z.string().trim().min(1),
            myslenka: z.string().trim().min(1),
            citat: id.optional(),
            zdroje: z.array(id).default([]),
          })
          .strict(),
      )
      .default([]),
  }),
});

/** Cesta: přehled v src/content/cesty/<slug>.mdx, kroky v src/content/cesty/<slug>/<n>-<název>.mdx. */
const cesty = defineCollection({
  loader: glob({ pattern: '[^_]*.{md,mdx}', base: './src/content/cesty' }),
  schema: z.object({
    cislo: z.number().int().min(1),
    nazev: z.string(),
    obdobi,
    otazka,
    /** jedna věta pod názvem na přehledu cesty a na kartě */
    vstup: z.string(),
    filozofove: z.array(id),
    /** odhad délky v minutách */
    minut: z.number().int().min(5).max(60).optional(),
    /** odkaz do Mapy a času v Kam dál na přehledu cesty: rok, vybraná osoba a text odkazu */
    mapa: z.object({ rok: z.number().int(), osoba: id, text: z.string() }).strict().optional(),
    /**
     * Začátek cesty: id bloku, ve kterém student poprvé sám odpověděl (Volba, Odkryj, Roztřiď, Změň jednu věc, Spor).
     * Poslední krok ukáže jeho zápis z deníku vedle závěrečného pravidla („Na začátku“ × „Teď“).
     * Sestavení se zastaví, když blok nestojí v některém dřívějším kroku téže cesty (zacatekCesty v src/lib/cesty.ts).
     */
    zacatek: id.optional(),
    /**
     * Cesty, které Kam dál po této cestě jako „Další cestu“ nenabídne, i když by na ně přišla řada (poradiDalsichCest).
     * Cesta 8: po strachu ze smrti ne hned „Co když přijde to nejhorší?“ (slovo, kterému se cesta 8 vyhýbá).
     */
    nenabizet: z.array(id).optional(),
  }),
});

const kroky = defineCollection({
  loader: glob({ pattern: '*/[0-9]*.mdx', base: './src/content/cesty' }),
  schema: z.object({
    /** slug cesty (název souboru přehledu) */
    cesta: id,
    /** pořadí kroku od 1 */
    krok: z.number().int().min(1),
    /** krátký název kroku: v postupu, v liště Další krok */
    nazev: z.string(),
    /** „Kde jsme“: místo a chvíle příběhu (volitelné) */
    kdeJsme: z.string().optional(),
  }),
});

const pokusy = defineCollection({
  loader: vsechny('pokusy'),
  schema: z.object({ nazev: z.string(), obdobi, otazka: otazka.optional(), osoby: z.array(id).default([]) }),
});

const pojmy = defineCollection({
  loader: vsechny('pojmy'),
  schema: z.object({ pojem: z.string(), puvod: z.string().optional(), kratce: z.string() }),
});

const pribehy = defineCollection({
  loader: vsechny('pribehy'),
  schema: z.object({ nazev: z.string(), obdobi, osoby: z.array(id).default([]), zdroj: id }),
});

const nabozenstvi = defineCollection({
  loader: vsechny('nabozenstvi'),
  schema: z.object({ nazev: z.string(), poradi: z.number().int(), obdobi: z.array(obdobi).default([]) }),
});

/** Obsah interaktivních bloků (Volba, Změň jednu věc, Spor); do MDX se vkládají jedním řádkem podle id. */
const bloky = defineCollection({
  loader: glob({ pattern: '**/[^_]*.yaml', base: './src/content/bloky' }),
  schema: Blok,
});

export const collections = { osobnosti, smery, obdobi: obdobiTexty, otazky, cesty, pokusy, pojmy, pribehy, nabozenstvi, bloky, kroky };
