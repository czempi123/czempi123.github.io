// Schémata dat Atlasu myšlení (src/data/*.yaml).
// Sdílí je stavba webu (src/lib/data.ts) i kontroly (tests/data).
// Letopočty jsou celá čísla: záporná = př. n. l., kladná = n. l. Rok nula neexistuje.
import { z } from 'astro/zod';
import ikony from '../../docs/design/atributy-ikony.json';

const idVzor = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const Id = z.string().regex(idVzor, 'id: malá písmena bez diakritiky, číslice a pomlčky');

/** Letopočet; nula se odmítne už tady. */
export const Rok = z
  .number()
  .int()
  .refine((r) => r !== 0, { message: 'Rok nula neexistuje (po 1 př. n. l. následuje 1 n. l.)' });

/** Datum narození nebo úmrtí. */
export const Datum = z
  .object({
    rok: Rok,
    /** přibližné datum, ve studentském textu „asi“ */
    priblizne: z.boolean().optional(),
    /** prameny dávají jen horní mez („nejpozději“, např. zemřel před rokem 399 př. n. l.) */
    nejpozdeji: z.boolean().optional(),
    /** prameny dávají jen dolní mez: v tom roce ještě žil („zemřel po roce …“) */
    nejdrive: z.boolean().optional(),
    /** rozpětí, které udávají prameny, pokud je rok odhadem uprostřed */
    rozmezi: z.tuple([Rok, Rok]).optional(),
  })
  .strict();

export const RoleMista = z.enum(['narozeni', 'studium', 'pusobeni', 'pobyt', 'exil', 'tazeni', 'smrt']);

export const PobytNaMiste = z
  .object({
    misto: Id,
    role: RoleMista,
    /** jednorázová událost (narození, bitva, smrt) */
    rok: Rok.optional(),
    od: Rok.optional(),
    do: Rok.optional(),
    priblizne: z.boolean().optional(),
    zdroj: Id,
  })
  .strict();

export const Hloubka = z.enum(['medailonek', 'profil', 'portret']);
export const Tradice = z.enum(['zapadni', 'cinska', 'indicka', 'islamska', 'zidovska', 'africka']);
export const Linie = z.enum(['autenticita', 'stoicismus', 'vira-a-rozum', 'spolecnost', 'veda']);

/** Ikony atributů: klíče z docs/design/atributy-ikony.json, ze kterého vzniká public/ikony/atributy.svg. */
export const IkonaAtributu = z.enum(Object.keys(ikony) as [string, ...string[]]);

export const Atribut = z
  .object({
    ikona: IkonaAtributu,
    /** český název atributu („kalich“) */
    nazev: z.string().min(2),
    /** odpověď na „Proč …?“ */
    proc: z.string().min(10),
    zdroj: Id,
  })
  .strict();

export const Osoba = z
  .object({
    id: Id,
    /** závazná česká podoba jména */
    jmeno: z.string().min(2),
    /** jméno v 2. pádě pro věty typu „Proč …?“ a „Co udělal …“ */
    jmeno2: z.string().min(2).optional(),
    /** žena (kvůli tvarům „je jí“, „zemřela“) */
    zena: z.boolean().optional(),
    narozen: Datum.optional(),
    zemrel: Datum.optional(),
    /** jen když prameny nedávají narození ani úmrtí, ale dobu činnosti */
    aktivni: z
      .object({ od: Rok, do: Rok.optional(), priblizne: z.boolean().optional() })
      .strict()
      .optional(),
    obdobi: z.number().int().min(1).max(8),
    /** plánovaná hloubka zpracování (medailonek, profil, portrét); stránku dává až profil v MDX nebo `medailonek: true` */
    hloubka: Hloubka,
    /**
     * Data jsou úplná a ověřená a osoba dostane stránku medailonku /osobnost/<id>/, generovanou jen z dat
     * (src/components/osobnost/StrankaMedailonku.astro). Kritéria hlídá tests/data/medailonky.test.ts;
     * až osoba dostane profil v MDX, příznak se smaže. Postup vyplňování: skill atlas-data.
     */
    medailonek: z.literal(true).optional(),
    tradice: Tradice.default('zapadni'),
    smery: z.array(Id).default([]),
    otazky: z.array(z.number().int().min(1).max(10)).default([]),
    linie: z.array(Linie).default([]),
    mista: z.array(PobytNaMiste).default([]),
    /** jedna věta: kdo to byl */
    kdo: z.string().min(10),
    /** jedna věta: proč si ho pamatujeme */
    proc: z.string().min(10),
    atribut: Atribut.optional(),
    obrazek: Id.optional(),
    zdroje: z.array(Id).min(1, 'Každá osoba potřebuje aspoň jeden pramen'),
  })
  .strict();

export const Misto = z
  .object({
    id: Id,
    nazev: z.string(),
    /** dobový název, pokud se liší */
    dobovy: z.string().optional(),
    /** dnešní místo a stát */
    dnes: z.string(),
    /** [zeměpisná délka, šířka] ve stupních */
    souradnice: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
    pleiades: z.string().regex(/^\d+$/).optional(),
    /** ostrov nebo krajina místo města */
    oblast: z.boolean().optional(),
    /** místo v 6. pádu s předložkou pro věty z dat („v Athénách“, „na Korsice“, „u Délia“) */
    kde: z.string().regex(/^(v|ve|na|u) \S/).optional(),
  })
  .strict();

/** Popisek krajiny nebo moře na mapě: dobový název, případně dnešní v závorce. */
export const Krajina = z
  .object({
    id: Id,
    nazev: z.string().min(2),
    dnes: z.string().optional(),
    druh: z.enum(['more', 'krajina']),
    obdobi: z.array(z.number().int().min(1).max(8)).min(1),
    souradnice: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
    zdroj: Id,
  })
  .strict();

export const TypVztahu = z.enum(['ucitel', 'znali-se', 'vliv-textem', 'polemika']);

export const Vztah = z
  .object({
    od: Id,
    k: Id,
    /** ucitel: od = učitel, k = žák; vliv-textem: od působil na k; polemika: od polemizoval s k */
    typ: TypVztahu,
    /** tradovaný vztah (antická tradice, kterou odborné prameny nepotvrzují jistě) */
    tradovany: z.boolean().optional(),
    poznamka: z.string().optional(),
    zdroj: Id,
  })
  .strict();

export const Udalost = z
  .object({
    id: Id,
    nazev: z.string(),
    od: Rok,
    do: Rok.optional(),
    obdobi: z.array(z.number().int().min(1).max(8)).min(1),
    misto: Id.optional(),
    /** lidé z lide.yaml, kterých se událost týká */
    osoby: z.array(Id).default([]),
    /** kotva = dějinná událost pro posuvník; zivot = událost z života lidí v atlasu */
    druh: z.enum(['kotva', 'zivot']),
    zdroj: Id,
  })
  .strict();

export const Obdobi = z
  .object({
    id: z.number().int().min(1).max(8),
    slug: Id,
    nazev: z.string(),
    kratce: z.string(),
    okno: z.object({ od: Rok, do: Rok }).strict(),
    pigment: z.string(),
    /** CSS proměnná barvy období */
    barva: z.string().regex(/^--p-[1-8]$/),
    ornament: z.object({ index: z.number().int().min(0).max(7), nazev: z.string() }).strict(),
    mapa: z
      .object({
        popis: z.string(),
        stred: z.tuple([z.number(), z.number()]),
        meritko: z.number().positive(),
        rovnobezky: z.tuple([z.number(), z.number()]),
        /** výřez převzatý ze schváleného návrhu, nebo návrh k doladění v P4 */
        stav: z.enum(['schvaleny', 'navrh']),
      })
      .strict(),
  })
  .strict();

export const Pramen = z
  .object({
    id: Id,
    druh: z.enum(['encyklopedie', 'pramen', 'monografie', 'data']),
    nazev: z.string(),
    autor: z.string().optional(),
    dilo: z.string().optional(),
    url: z.url().optional(),
    /** datum ověření */
    overeno: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    poznamka: z.string().optional(),
  })
  .strict();

export const Citat = z
  .object({
    id: Id,
    /**
     * kdo citát vyslovil nebo napsal (id osoby). Chybí jen u citátu z textu tradice (`tradice`: verš Bible, Mišna,
     * Talmud) nebo od autora, který v datech není a nepřibude (`bezOsoby: true`: religionista Durkheim, Otto).
     */
    osoba: Id.optional(),
    /** citát z textu náboženské tradice: id tradice v src/content/nabozenstvi (judaismus) */
    tradice: Id.optional(),
    /** autor citátu není v lide.yaml; jméno nese jen `autor` a citát nikam neodkazuje */
    bezOsoby: z.literal(true).optional(),
    /** údaj pod citátem: autor díla, dílo, místo */
    autor: z.string(),
    dilo: z.string(),
    misto: z.string(),
    cesky: z.string(),
    original: z.string().optional(),
    preklad: z
      .object({
        druh: z.enum(['vlastni', 'publikovany']),
        prekladatel: z.string().optional(),
        podle: z.string(),
      })
      .strict(),
    zdroj: Id,
  })
  .strict()
  .refine((c) => [c.osoba, c.tradice, c.bezOsoby].filter(Boolean).length === 1, {
    message: 'Citát má právě jedno z polí osoba, tradice a bezOsoby.',
  });

export const Obrazek = z
  .object({
    id: Id,
    soubor: z.string(),
    popisek: z.string(),
    autor: z.string(),
    instituce: z.string().optional(),
    licence: z.string().min(2, 'Obrázek bez licence nesmí do atlasu'),
    url: z.url(),
    /**
     * Střed výřezu na desce (CSS object-position, „50% 37%“), když výchozí výřez pro busty
     * (tvář v horní třetině) usekne to, o co na obrázku jde.
     */
    vyrez: z.string().regex(/^\d{1,3}% \d{1,3}%$/, 'vyrez: dvě procenta, např. „50% 37%“').optional(),
    /**
     * Střed výřezu pro desku na šířku (hlavička osobnosti na telefonu, 16 : 10), když se má lišit od `vyrez`:
     * rytina na výšku potřebuje v nízké desce jiný střed, jinak přijde o hlavu.
     */
    vyrezNaSirku: z.string().regex(/^\d{1,3}% \d{1,3}%$/, 'vyrezNaSirku: dvě procenta, např. „50% 10%“').optional(),
  })
  .strict();

/**
 * Věta, která koluje pod jménem filozofa (formát Pravý, nebo podvržený?, herna-v1). Do atlasu jde jen s dokladem,
 * kde koluje (`koluje`), i s původem (`puvod`). Podklady: docs/podklady/herna.md.
 */
export const DruhPripsani = z.enum([
  /** skutečný citát: řekl to */
  'pravy',
  /** myšlenka je jeho, slova ne (Vím, že nic nevím) */
  'prepsany',
  /** napsal opak (Neučíme se pro školu, ale pro život) */
  'obraceny',
  /** řekl to někdo jiný (Durant, Maclaren, Plútarchos) */
  'cizi',
  /** původ neznáme */
  'neznamy',
]);
export const Pripsani = z
  .object({
    id: Id,
    /** věta, jak koluje */
    cesky: z.string(),
    /** komu ji internet připisuje */
    osoba: Id,
    /** komu dalšímu se připisuje */
    tez: z.array(Id).optional(),
    /** razítko: řekl to, nebo neřekl */
    verdikt: z.enum(['rekl', 'nerekl']),
    druh: DruhPripsani,
    /** co ten člověk opravdu řekl (citát v datech) */
    skutecne: Id.optional(),
    /** doklad, že a kde věta koluje */
    koluje: z.object({ kde: z.string(), zdroj: Id }).strict(),
    /** odkud věta doopravdy je */
    puvod: z
      .object({
        citat: Id.optional(),
        autor: z.string().optional(),
        dilo: z.string().optional(),
        misto: z.string().optional(),
        rok: Rok.optional(),
        popis: z.string(),
        zdroj: Id,
      })
      .strict(),
  })
  .strict()
  .superRefine((p, ctx) => {
    if ((p.verdikt === 'rekl') !== (p.druh === 'pravy'))
      ctx.addIssue({ code: 'custom', message: 'Razítko „řekl to“ patří právě k pravému citátu (druh pravy).' });
    if (['pravy', 'prepsany', 'obraceny'].includes(p.druh) && !p.skutecne)
      ctx.addIssue({ code: 'custom', message: `Připsání druhu ${p.druh} potřebuje skutecne: citát, co ten člověk opravdu řekl.` });
    if (p.druh === 'cizi' && !p.puvod.autor && !p.puvod.citat)
      ctx.addIssue({ code: 'custom', message: 'Cizí věta potřebuje v původu autora nebo citát.' });
  });

export const Zdroje = z
  .object({
    prameny: z.array(Pramen),
    citaty: z.array(Citat).default([]),
    obrazky: z.array(Obrazek).default([]),
    pripsani: z.array(Pripsani).default([]),
  })
  .strict();

export type TOsoba = z.infer<typeof Osoba>;
export type TMisto = z.infer<typeof Misto>;
export type TKrajina = z.infer<typeof Krajina>;
export type TVztah = z.infer<typeof Vztah>;
export type TUdalost = z.infer<typeof Udalost>;
export type TObdobi = z.infer<typeof Obdobi>;
export type TZdroje = z.infer<typeof Zdroje>;
export type TCitat = z.infer<typeof Citat>;
export type TPripsani = z.infer<typeof Pripsani>;
export type TDatum = z.infer<typeof Datum>;
