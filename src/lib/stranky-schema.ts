// Schémata kolekcí pro stránky období, směrů, myšlenkových pokusů, úvodů a náboženství (větev antika-doplnky, K1).
// Sdílí je src/content.config.ts i testy (tests/data/stranky.test.ts). Texty těchto stránek jsou v MDX; frontmatter
// nese jen to, co stránka skládá sama (hlavička, otázky doby, hlasy, místa na mapce).
import { z } from 'astro/zod';

const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id: malá písmena bez diakritiky, číslice a pomlčky');
const Text = z.string().trim().min(1);
const Obdobi = z.number().int().min(1).max(8);
const Otazka = z.number().int().min(1).max(10);
const Rok = z.number().int().refine((r) => r !== 0, 'Rok nula neexistuje.');

/** Odkaz v Kam dál na konci stránky (stejný tvar jako KamDal.astro). */
export const OdkazKamDal = z.object({ href: z.string().startsWith('/').optional(), nadtitulek: Text, text: Text }).strict();

/**
 * Stránka období /obdobi/<slug>/: soubor src/content/obdobi/<slug>.mdx, slug z src/data/obdobi.yaml.
 * Text MDX je úvodní scéna. Osa kotev, lidé a směry, cesty a mapa se skládají z dat.
 */
export const ObdobiStranka = z
  .object({
    obdobi: Obdobi,
    /** jedna dvě věty pod názvem období */
    perex: Text,
    /** otázky doby: číslo velké otázky a krátký odstavec, proč ji ta doba kladla */
    otazky: z.array(z.object({ cislo: Otazka, text: Text }).strict()).default([]),
    /** Mezitím jinde: jedna dvě věty bez odkazu (jen období 1) */
    jinde: Text.optional(),
    /** Mapa a čas: rok, kdy období vrcholí, a osoba, která se v mapě vybere */
    mapa: z.object({ rok: Rok, osoba: Id.optional() }).strict(),
  })
  .strict();

/**
 * Směr: soubor src/content/smery/<id>.md(x). Směr s perexem má vlastní stránku /smer/<id>/ a jeho text MDX
 * nese založení, myšlenky, rodokmen, spor, Zkus to žít a Kam dál; směr bez perexu zůstává štítkem v Lidech a směrech.
 */
export const Smer = z
  .object({
    nazev: Text,
    obdobi: z.array(Obdobi).min(1),
    /** pořadí na stránce Lidé a směry */
    poradi: z.number().int(),
    /** jen směr s vlastní stránkou: jedna dvě věty pod názvem */
    perex: Text.optional(),
    /** zakladatel (id osoby v lide.yaml): mince v hlavičce stránky směru */
    zakladatel: Id.optional(),
  })
  .strict();

/** Hlas na stránce pokusu: jako hlas velké otázky, jen bez odpovědi na úvodní případ. */
export const HlasPokusu = z
  .object({
    osoba: Id,
    /** co by k pokusu řekl, 2–4 věty; prázdný řádek dělí odstavce */
    myslenka: Text,
    citat: Id.optional(),
    zdroje: z.array(Id).default([]),
  })
  .strict();

/**
 * Myšlenkový pokus /pokus/<slug>/: soubor src/content/pokusy/<slug>.mdx. Text MDX je scéna a bloky
 * (Volba předem, Změň jednu věc nebo kresba); hlasy „Co řekli filozofové“ a Kam dál skládá stránka.
 */
export const Pokus = z
  .object({
    nazev: Text,
    obdobi: Obdobi,
    /** velká otázka, ke které pokus patří (drobečky a Kam dál) */
    otazka: Otazka.optional(),
    /** filozofové pokusu (id v lide.yaml): mince v hlavičce */
    osoby: z.array(Id).default([]),
    /** odkud pokus je: „Platón, Ústava II“ */
    pramen: Text,
    perex: Text,
    hlasy: z.array(HlasPokusu).default([]),
    kamDal: z.array(OdkazKamDal).max(4).default([]),
  })
  .strict();

/**
 * Úvodní stránka nad celým oddílem atlasu: Co je filozofie? (/co-je-filozofie/) a Co je náboženství? (/nabozenstvi/).
 * Soubor src/content/uvody/<id>.mdx; celý obsah je v MDX (scéna, bloky, oddíly, Kam dál).
 */
export const Uvod = z
  .object({
    nazev: Text,
    nadtitulek: Text,
    perex: Text,
    /** barva stránky (období, ze kterého je první příběh) */
    obdobi: Obdobi,
  })
  .strict();

/** Role místa v dějinách tradice: kde vznikla, kde bylo její centrum, kam ji vyhnali a kde žila v rozptýlení. */
export const RoleMistaTradice = z.enum(['vznik', 'centrum', 'exil', 'diaspora']);

/**
 * Náboženská tradice /nabozenstvi/<slug>/: soubor src/content/nabozenstvi/<slug>.mdx. Text MDX nese scénu a oddíly;
 * mapka míst se skládá z pole `mista` (id z mista.yaml).
 */
export const Nabozenstvi = z
  .object({
    nazev: Text,
    /** pořadí v seznamu tradic na stránce Co je náboženství? */
    poradi: z.number().int(),
    /** období, ve kterých tradice v atlasu vystupuje; první dává barvu stránky */
    obdobi: z.array(Obdobi).min(1),
    perex: Text,
    mista: z
      .array(
        z
          .object({
            misto: Id,
            role: RoleMistaTradice,
            od: Rok.optional(),
            do: Rok.optional(),
            zdroj: Id,
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

export type TObdobiStranka = z.infer<typeof ObdobiStranka>;
export type TSmer = z.infer<typeof Smer>;
export type TPokus = z.infer<typeof Pokus>;
export type TNabozenstvi = z.infer<typeof Nabozenstvi>;
