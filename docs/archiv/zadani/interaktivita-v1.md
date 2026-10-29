# Provedená zadání větve interaktivita-v1

Zadání kroků v plném znění, jak byla v plánu větve (`docs/plany/interaktivita-v1.md`). Zadání K0 přesunuto 29. 10. 2026.

## Zadání K0

Model: Sonnet 5.5 · medium. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K0 větve interaktivita-v1 (kontrola typů). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/pouceni.md (oddíl Technika) a v docs/plany/interaktivita-v1.md tabulku kroků, otázku 2 v Co rozhodnout před prvním krokem a toto zadání. Odpovědi autora pod otázkami platí; prázdná odpověď je souhlas s doporučením.

1. Chyba: `npx astro check` hlásí ts(2322) v astro.config.mjs:16 u `satteri({ mdastPlugins: [sazbaMdast] })`. Plugin `sazbaMdast` v src/lib/sazba.js má v JSDoc ručně psaný typ parametru `ctx`, který neodpovídá typu `MdastVisitorContext` z balíčku satteri (jeho `parent` bere uzel mdast, ne `unknown`). Oprav typ, ne chování: typ pluginu a kontextu ber z balíčku satteri (exportuje `MdastPluginDefinition`, `MdastPluginInstance`, `MdastVisitorContext`). Satteri je zatím jen závislost @astrojs/markdown-satteri; když na něj má odkazovat náš kód, přidej ho do devDependencies ve verzi z package-lock.json, aby se import typu nerozbil při další aktualizaci. Varování v scripts/revize-hodiny.mjs (nepoužité proměnné) nech být, nejsou to chyby.

2. Ověř, že se výstup nezměnil: `npx vitest run` (test sazby), pak `npx astro build` a porovnej s hlavní větví dvě sestavené stránky s nezlomitelnými mezerami (třeba portrét Sókrata a krok 1 cesty 1): stejné bajty. `npx astro check` musí skončit bez chyby.

3. Najdi, proč kontrola na GitHubu padá právě od 17. 10. 2026, když se sazba.js ani package-lock.json od 2. 10. nezměnily (git log kolem 17. 10., soubory, které astro check kontroluje; gh na Macu není, takže bez přístupu k Actions). Příčinu zapiš jednou větou do Po K0; když ji nenajdeš, napiš, co jsi ověřil.

4. Aby se to neopakovalo (podle odpovědi 2): v package.json `"test": "astro check && vitest run && playwright test"`; v CLAUDE.md › Co číst a jak šetřit řádek Testy doplň, že celé npm test pouští i kontrolu typů; do docs/pouceni.md › Technika jedna věta (ručně psaný typ pluginu v JSDoc se rozejde s knihovnou a lokální npm test to dřív nepoznal). Celé npm test pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť.

5. Commit česky a stručně, ve větvi interaktivita-v1; nic neposílej na GitHub. V plánu větve: řádek K0 na „hotovo“, oddíl „Po K0“ (co jsi změnil, příčina, že kontroly na GitHubu se ověří po pushi při uzavření větve) a pod něj zadání K1 v plném znění ve stejném tvaru jako toto (Opus 5.5 · high, skill atlas-komponenta). Rozhodnutí do docs/rozhodnuti.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v1.md); nic dalšího do projektu nepřidávej.

6. Pak se zastav a napiš mi krátce, co bylo špatně, co jsi změnil a co mám spustit, jestli vůbec něco.
```
