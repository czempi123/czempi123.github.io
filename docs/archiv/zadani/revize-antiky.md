# Provedená zadání větve revize-antiky

Plné znění zadání, která už proběhla. Stav a výsledky jsou v plánu větve `docs/plany/revize-antiky.md`.

## Zadání S

V novém chatu projektu Atlas s připojenou složkou Atlas a zapnutým Desktop Commanderem. **Fable 5.1 · high.** Běží dlouho; nech ho pracovat a vrať se k hotovému záznamu.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Krok S větve revize-antiky: souhrnná revize celé antiky (P11). Plán větve je v projektu Claude i v repozitáři jako docs/plany/revize-antiky.md; řiď se oddílem „Co revize prověří“ (devět bodů). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv otevři jen tam, kde to plán jmenuje.

0. git switch revize-antiky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, skill atlas-revize (kontrolní seznam platí pro každou stránku; plán větve přidává pohled napříč) a skill atlas-psani (čtivost, úvody, citáty, lidský hlas; v oddílu Postup při revizi jsou příkazy, které vypíšou úvody cest a první věty kroků vedle sebe). Restartuj náhled npm run dev.

1. Inventura: vypiš si všechny stránky antiky (cesty, osobnosti, medailonky, otázky, deník, mapa, hodina), délky cest přes scripts/slova-cesta.mjs, seznam kreseb a animací v src/components/ostrovy s tím, na kterých stránkách jsou (a které typy stránek nemají žádnou), a citátů podle id v src/content (které id se používá na víc stránkách). Inventuru dej do záznamu jako první oddíl.

2. Čtení napříč: projdi cesty v pořadí katalogu, pak osobnosti a otázky, s otevřeným zápisníkem opakování (citát, příběh, případ, Zkus to žít, obrat, stavba kroku). Snímky přes scripts/snimky-listy.mjs a scripts/snimky-cesta.mjs; prohlížej listy, ne jednotlivé obrazovky. Záznam piš průběžně do docs/revize/antika-<dnešní datum>.md po oddílech plánu, ať se při dlouhé práci nic neztratí.

3. Kontroly: konzistence jmen, dat, citací a překladů proti src/data; odkazy; zastavený pohyb u všech kreseb (obsah vidět bez pohybu i při omezeném pohybu); hlavička Seneky na 390 px; oprav nestálý test tests/e2e/cesta.spec.ts:79 a ověř ho třikrát po sobě; celé npm test jednou na pozadí s výstupem do souboru; axe přes scripts/revize-axe.mjs.

4. Drobnosti (překlep, rozbitý odkaz, nesoulad roku s daty, oprava testu) oprav rovnou, každý druh v samostatném commitu, a zapiš je do záznamu. Zásadní nálezy neopravuj: seřaď je podle dopadu (blokující, důležité, drobné) ve formátu skillu atlas-revize, každý s konkrétním návrhem opravy.

5. Do záznamu přidej oddíl „Co z plánu F3 chybí“ (bod 7 plánu) jako tabulku s doporučením u každé položky (před zkouškou / před středověkem / později) a návrh pořadí dalších větví, a oddíl „Zkouška se studenty“ (bod 8): které cesty, co sledovat, a podklad pro rozhodnutí o zveřejnění (bez zveřejňování), a oddíl „Interaktivita“ (bod 9) s tabulkou návrhů; u tří nejlepších popiš, co student uvidí v zastaveném obrázku a co se pohne. Verdikt revize: schváleno / po opravách / přepracovat.

6. Do plánu větve napiš oddíl „Po S (datum)“: co jsi našel, nad čím jsi váhal a co jsi zvolil, a oddíl „Co rozhodnout po S“ s očíslovanými otázkami, každou s doporučením a prázdným řádkem „Odpověď:“ (prázdná odpověď znamená souhlas). Připrav tam i zadání kroku O ve stejné podobě jako toto (model, úsilí, text promptu). Zadání S přesuň do docs/archiv/zadani/revize-antiky.md. Rozhodnutí zapiš do docs/rozhodnuti.md, aktualizuj řádek revize-antiky v docs/plan.md. Commit.

7. Nic neslučuj a nic neposílej na GitHub. Plán větve a docs/plan.md nahraj do projektu Claude. Pak mi krátce napiš verdikt, tři nejdůležitější nálezy a na co mám odpovědět.
```

Provedeno 25. 10. 2026 (Opus 5.5 místo Fable 5.1 v tomto chatu); záznam `docs/revize/antika-2026-10-25.md`.
