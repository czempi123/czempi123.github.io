// Schéma týdne cvičení (src/content/tydny/<id>.yaml): Stoický týden a další týdny v duchu Zkus to žít
// (epikurejský, sokratovský). Týden je data, ne napevno psaná stránka; stránka /tyden/<id>/ se z nich skládá.
// Sdílí ho kolekce `tydny` (src/content.config.ts) i testy (tests/data/tydny.test.ts). Že citáty a osoby
// existují, hlídá kontrolaTydne (src/lib/tydny.ts) při sestavení i v testu.
// Texty smějí obsahovat *kurzívu*; prázdný řádek dělí odstavce.
import { z } from 'astro/zod';

const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id: malá písmena bez diakritiky, číslice a pomlčky');
const Text = z.string().trim().min(1);
const Odkaz = z.object({ href: z.string().startsWith('/'), text: Text }).strict();

export const Den = z
  .object({
    /** číslo dne od 1, v pořadí */
    cislo: z.number().int().min(1),
    /** krátký název dne („Ranní příprava“) */
    nazev: Text,
    /** id osoby v lide.yaml, od které cvičení je */
    osoba: Id,
    /** jak dlouho cvičení trvá a kdy („minuta ráno“) */
    doba: Text,
    /** co student ten den udělá; prázdný řádek dělí odstavce */
    text: Text,
    /** citát dne (id v zdroje.yaml); den může být i bez citátu */
    citat: Id.optional(),
    /** odstavce za citátem: návrat k případu po citátu (atlas-psani); jen u dne s citátem */
    poCitatu: Text.optional(),
    /** kdy cvičení nechat, jednou větou */
    mez: Text,
    /** kde je celé cvičení nebo k němu víc (karta Zkus to žít, krok cesty) */
    odkaz: Odkaz.optional(),
    /** den s psaním: pole na jednu větu sobě a poznámku do deníku; popisky polí */
    psani: z.object({ veta: Text, poznamka: Text }).strict().optional(),
  })
  .strict();

export const Tyden = z
  .object({
    /** název týdne („Stoický týden“) */
    nazev: Text,
    /** barva období (1–8) */
    obdobi: z.number().int().min(1).max(8),
    /** krátký popis bez tečky pro Kam dál a deník („Sedm krátkých cvičení, jedno na den“) */
    vstup: Text,
    /** úvodní věta stránky */
    uvod: Text,
    /** nejsilnější námitka proti týdnu, jednou větou, s citátem, který na ni odpovídá */
    namitka: z.object({ text: Text, citat: Id.optional() }).strict(),
    /** pravidla týdne jednou větou („Kdykoli přestaň, den můžeš přeskočit, nic se nepočítá.“) */
    pravidla: Text,
    /** odkud se týden nabízí: Kam dál na přehledu cest a v portrétech (portréty mají odkaz v MDX, test ho hlídá) */
    nabizet: z.object({ cesty: z.array(Id).default([]), osobnosti: z.array(Id).default([]) }).strict(),
    /** prameny (id v zdroje.yaml) */
    zdroje: z.array(Id).default([]),
    dny: z.array(Den).min(1).max(10),
  })
  .strict();

export type TDen = z.infer<typeof Den>;
export type TTyden = z.infer<typeof Tyden>;
