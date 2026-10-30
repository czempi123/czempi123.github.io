// Schémata obsahu interaktivních bloků (src/content/bloky/*.yaml).
// Blok s více možnostmi (Volba s důvodem, Změň jednu věc, Spor, Roztřiď) se píše do YAML a do MDX se vkládá
// jedním řádkem: <Volba id="…" />. Sdílí je kolekce `bloky` (src/content.config.ts) i testy (tests/data).
// Texty smějí obsahovat *kurzívu*; prázdný řádek dělí odstavce.
import { z } from 'astro/zod';

const idVzor = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const Id = z.string().regex(idVzor, 'id: malá písmena bez diakritiky, číslice a pomlčky');
const Text = z.string().trim().min(1);
const Obdobi = z.number().int().min(1).max(8);

/** Společné pro všechny bloky z YAML. */
const zaklad = {
  /** barva období (1–8) */
  obdobi: Obdobi,
  /** krátký nadtitulek v barvě období */
  nadtitulek: Text.optional(),
  /** úvodní scéna před otázkou (volitelná) */
  scena: Text.optional(),
  /** otázka bloku; ukládá se do deníku jako otázka zápisu */
  otazka: Text,
  /** prameny (id v src/data/zdroje.yaml), ze kterých stojí historická tvrzení bloku */
  zdroje: z.array(Id).default([]),
  /**
   * Co ještě čeká na ověření (atlas-overeni). Blok s neprázdným seznamem smí být jen v dílně
   * (/dilna/); na jiné stránce zastaví sestavení.
   */
  kOvereni: z.array(Text).default([]),
  /** „Kam dál“ po dokončení bloku (v cestě se doplní další krok sám) */
  dal: z.object({ href: z.string().startsWith('/'), text: Text }).strict().optional(),
};

export const BlokVolba = z
  .object({
    druh: z.literal('volba'),
    ...zaklad,
    moznosti: z
      .array(
        z
          .object({
            text: Text,
            /** krátký popis tahu do titulku zpětné vazby: „Tvůj tah: zeptat se znovu.“ */
            tah: Text,
            /** zpětná vazba k této volbě: vysvětluje důvod, nehodnotí souhlas */
            zpetna: Text,
            /** tuhle cestu zvolil filozof z oddílu „Co udělal …“ */
            jeho: z.boolean().default(false),
          })
          .strict(),
      )
      .min(2)
      .max(4),
    /** oddíl „Co udělal …“ po volbě; osoba je id v lide.yaml */
    coUdelal: z
      .object({
        osoba: Id,
        /** když student zvolil stejně jako filozof */
        stejne: Text,
        /** když zvolil jinak */
        jinak: Text,
      })
      .strict()
      .optional(),
    /**
     * Blok bez pole „Proč právě tohle?“: student volí jen možnost a do deníku se uloží jen ona.
     * Pro otázky, u kterých by důvod byl zpověď (cesta 4: „Co ti tehdy chybělo?“).
     */
    bezDuvodu: z.boolean().default(false),
  })
  .strict()
  .refine((b) => !b.coUdelal || b.moznosti.filter((m) => m.jeho).length === 1, {
    message: 'S oddílem coUdelal musí mít právě jedna možnost jeho: true.',
  })
  .refine((b) => b.coUdelal || b.moznosti.every((m) => !m.jeho), {
    message: 'Možnost s jeho: true potřebuje oddíl coUdelal.',
  });

export const BlokZmena = z
  .object({
    druh: z.literal('zmena'),
    ...zaklad,
    /** rozhodnutí, mezi kterými student volí (stejná pro základ i všechny podmínky) */
    moznosti: z.array(z.object({ id: Id, text: Text }).strict()).min(2).max(4),
    /** podmínky, které se dají přepnout; každá mění jednu věc ve scéně */
    podminky: z
      .array(
        z
          .object({
            id: Id,
            /** krátký popisek přepínače: „Rozsudek je spravedlivý“ */
            prepinac: Text,
            /** co se ve scéně změnilo („Teď si představ, že…“) */
            zmena: Text,
            /** zpětná vazba, když se odpověď posunula */
            posun: Text,
            /** zpětná vazba, když zůstala stejná */
            stejne: Text,
          })
          .strict(),
      )
      .min(1)
      .max(3),
    /**
     * co udělal skutečný člověk (volitelné, ukáže se po prvním posunu nebo nezměně);
     * `nadpis` nahradí „Co udělal …“ tam, kde text říká, co by lidé nejspíš řekli k vymyšlenému případu
     */
    coUdelal: z.object({ osoba: Id, nadpis: Text.optional(), text: Text }).strict().optional(),
  })
  .strict()
  .refine((b) => new Set(b.moznosti.map((m) => m.id)).size === b.moznosti.length, { message: 'Id možností se opakuje.' })
  .refine((b) => new Set(b.podminky.map((m) => m.id)).size === b.podminky.length, { message: 'Id podmínek se opakuje.' });

export const StranaSporu = z
  .object({
    /**
     * id osoby v lide.yaml; jméno se vezme z dat. Smí chybět jen u strany, za kterou mluví autor,
     * kterého atlas v datech nemá (Plútarchos v cestě 8): ta pak musí mít `oznaceni` a její mince je prázdná.
     */
    osoba: Id.optional(),
    /**
     * Jak stranu nazvat místo jména osoby, když za ni mluví celý směr („kynici“). Malým písmenem,
     * jak stojí uprostřed věty; na škále a v nadpisech se první písmeno zvětší samo. Mince zůstává osoby.
     * U strany bez osoby je to jméno autora, kterého atlas v datech nemá.
     */
    oznaceni: Text.optional(),
    /** postoj jednou větou: „To, co pochopím.“ */
    postoj: Text,
    /** nejsilnější argumenty (1–3 odstavce) */
    argumenty: z.array(Text).min(1).max(3),
  })
  .strict()
  .refine((s) => !!s.osoba || !!s.oznaceni, { message: 'Strana sporu potřebuje osobu z lide.yaml, nebo označení.' });

export const BlokSpor = z
  .object({
    druh: z.literal('spor'),
    ...zaklad,
    /** levý a pravý konec škály */
    strany: z.tuple([StranaSporu, StranaSporu]),
  })
  .strict()
  .refine((b) => !b.strany[0].osoba || b.strany[0].osoba !== b.strany[1].osoba, { message: 'Spor potřebuje dvě různé osoby.' })
  .refine((b) => (b.strany[0].oznaceni ?? b.strany[0].osoba) !== (b.strany[1].oznaceni ?? b.strany[1].osoba), { message: 'Strany sporu se jmenují stejně.' })
  .refine((b) => b.strany.some((s) => s.osoba), { message: 'Aspoň jedna strana sporu je osoba z lide.yaml.' });

export const BlokRoztrid = z
  .object({
    druh: z.literal('roztrid'),
    ...zaklad,
    /** koše, do kterých student třídí */
    kose: z
      .array(
        z
          .object({
            id: Id,
            /** krátký název: „Potřebuju“ */
            nazev: Text,
            /** jedna věta, podle čeho do koše věc patří */
            popis: Text.optional(),
          })
          .strict(),
      )
      .min(2)
      .max(4),
    /** karty k roztřídění */
    karty: z
      .array(
        z
          .object({
            id: Id,
            text: Text.max(60),
            /** zpětná vazba ke kartě po roztřídění, ať leží v kterémkoli koši: důvod a otázka dál */
            zpetna: Text.optional(),
            /** zpětná vazba jen pro některý koš (id koše → text); má přednost před `zpetna` */
            kdyz: z.record(Id, Text).optional(),
          })
          .strict(),
      )
      .min(3)
      .max(8),
    /** vlastní karty, které smí student přidat */
    vlastni: z
      .object({
        pocet: z.number().int().min(1).max(3),
        /** popisek pole: „Přidej vlastní věc z tohoto týdne“ */
        vyzva: Text,
        /** zpětná vazba k vlastní kartě (stejná pro všechny koše) */
        zpetna: Text.optional(),
      })
      .strict()
      .optional(),
    /** srovnání po roztřídění; s osobou má minci filozofa a smí stát jen na doložených faktech */
    srovnani: z.object({ osoba: Id.optional(), nadpis: Text, text: Text }).strict().optional(),
  })
  .strict()
  .refine((b) => new Set(b.kose.map((k) => k.id)).size === b.kose.length, { message: 'Id košů se opakuje.' })
  .refine((b) => new Set(b.karty.map((k) => k.id)).size === b.karty.length, { message: 'Id karet se opakuje.' })
  .refine((b) => b.karty.every((k) => !/^vlastni-\d+$/.test(k.id)), { message: 'Id „vlastni-N“ je vyhrazené kartám studenta.' })
  .refine((b) => b.karty.every((k) => Object.keys(k.kdyz ?? {}).every((kos) => b.kose.some((x) => x.id === kos))), {
    message: 'Zpětná vazba `kdyz` odkazuje na koš, který v bloku není.',
  });

/** Id vyhrazená volbě „Kterou premisu bys napadl ty?“: skrytý předpoklad a žádná premisa. */
export const ID_SKRYTY = 'skryty';
export const ID_ZADNOU = 'zadnou';

/**
 * Slož argument: student seřadí premisy a závěr do řádků „1“, „2“ (případně „3“) a „Závěr“. Po kontrole
 * se odkryje skrytý předpoklad (řádek s otazníkem) a místo, kde se dá argument napadnout; nakonec student
 * zvolí, kterou premisu by napadl on (názor, jde do deníku). Žádné řazení není známka: zpětná vazba vysvětluje.
 */
export const BlokArgument = z
  .object({
    druh: z.literal('argument'),
    ...zaklad,
    /** premisy a závěr; místo je řádek, na který karta v argumentu patří */
    karty: z
      .array(
        z
          .object({
            id: Id,
            text: Text.max(140),
            /** řádek v argumentu: 1, 2, 3, nebo závěr */
            misto: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal('zaver')]),
            /** zpětná vazba, když student dá tuhle premisu do závěru (nepovinné; jinak obecná věta) */
            vZaveru: Text.optional(),
            /** zpětná vazba, když tuhle premisu student zvolí jako tu, kterou by napadl (u premis povinné) */
            kdyzNapadnes: Text.optional(),
          })
          .strict(),
      )
      .min(3)
      .max(4),
    /** skrytý předpoklad: věta, kterou argument potřebuje a neříká; odkryje se po kontrole */
    skryty: z
      .object({
        text: Text.max(140),
        /** proč ho argument potřebuje */
        zpetna: Text,
        /** zpětná vazba, když ho student zvolí jako ten, který by napadl */
        kdyzNapadnes: Text,
      })
      .strict(),
    /** kde se dá argument napadnout: id premisy nebo „skryty“, a proč */
    napadnout: z.object({ karta: Id, proc: Text }).strict(),
    /** zpětná vazba po kontrole, když závěr stojí v řádku Závěr */
    zpetna: Text,
    /** zpětná vazba k volbě „Žádnou, argument mi drží“ */
    zadnou: Text,
  })
  .strict()
  .refine((b) => new Set(b.karty.map((k) => k.id)).size === b.karty.length, { message: 'Id karet se opakuje.' })
  .refine((b) => b.karty.every((k) => k.id !== ID_SKRYTY && k.id !== ID_ZADNOU), { message: 'Id „skryty“ a „zadnou“ jsou vyhrazená.' })
  .refine((b) => b.karty.filter((k) => k.misto === 'zaver').length === 1, { message: 'Argument má právě jeden závěr.' })
  .refine(
    (b) => {
      const mista = b.karty.filter((k) => k.misto !== 'zaver').map((k) => k.misto as number).sort((x, y) => x - y);
      return mista.every((m, i) => m === i + 1);
    },
    { message: 'Premisy mají místa 1, 2 (a 3) bez mezery a bez opakování.' },
  )
  .refine((b) => b.karty.every((k) => (k.misto === 'zaver' ? !k.kdyzNapadnes && !k.vZaveru : !!k.kdyzNapadnes)), {
    message: 'Každá premisa má kdyzNapadnes; závěr nemá kdyzNapadnes ani vZaveru.',
  })
  .refine((b) => b.napadnout.karta === ID_SKRYTY || b.karty.some((k) => k.id === b.napadnout.karta && k.misto !== 'zaver'), {
    message: 'napadnout.karta je id premisy, nebo „skryty“.',
  });

/**
 * Návrat: krátký nový případ, který deník nabídne několik dní po dokončení cesty. Student na něm zkouší
 * vlastní závěrečné pravidlo; nic se nehodnotí. Otázka („Platí tvoje pravidlo i tady?“) a možnosti jsou
 * pro všechny návraty stejné a píše je blok; v YAML je jen případ a věta po každé odpovědi.
 */
export const BlokNavrat = z
  .object({
    druh: z.literal('navrat'),
    obdobi: Obdobi,
    /** slug cesty, ke které návrat patří (nejvýš jeden návrat na cestu) */
    cesta: Id,
    /** id závěrečného pravidla v posledním kroku cesty (`<ZaverCesty id="…" />`) */
    pravidlo: Id,
    /** krátký název případu: stojí v zápisu v deníku („Návrat · Nový telefon: …“) */
    nazev: Text,
    /** nový případ („Představ si…“), bez historických osob a bez tvrzení, která by potřebovala pramen */
    scena: Text,
    /** věta po odpovědi: jedna, ptá se dál a nehodnotí */
    po: z.object({ ano: Text, upravim: Text, nevim: Text }).strict(),
    zdroje: zaklad.zdroje,
    kOvereni: zaklad.kOvereni,
  })
  .strict();

export const Blok = z.union([BlokVolba, BlokZmena, BlokSpor, BlokRoztrid, BlokArgument, BlokNavrat]);

export type TBlokVolba = z.infer<typeof BlokVolba>;
export type TBlokZmena = z.infer<typeof BlokZmena>;
export type TBlokSpor = z.infer<typeof BlokSpor>;
export type TBlokRoztrid = z.infer<typeof BlokRoztrid>;
export type TBlokArgument = z.infer<typeof BlokArgument>;
export type TBlokNavrat = z.infer<typeof BlokNavrat>;
export type TBlok = z.infer<typeof Blok>;
