# Provedená zadání větve interaktivita-v1

Zadání kroků v plném znění, jak byla v plánu větve (`docs/plany/interaktivita-v1.md`). Zadání K0 a K1 přesunuta 29. 10. 2026.

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

## Zadání K1

Model: Opus 5.5 · high (xhigh při zaseknutí). Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K1 větve interaktivita-v1 (blok Kdo je na tvé straně, vzor v cestě 2). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v1.md tabulku kroků, oddíl Po K0, v Obsahu větve oddíl 1 (Kdo je na tvé straně), Nad čím jsem váhal a odpovědi autora k otázkám 3, 4 a 5 (prázdná odpověď je souhlas s doporučením), a toto zadání. Načti skill atlas-komponenta a řiď se jím (tokeny, přístupnost, testy, snímky v obou režimech). Z hotových stránek čti jen: krok 8 cesty 2 (src/content/cesty/jsem-porad-tentyz-kdyz-se-menim/8-kdo-je-na-tve-strane.mdx), src/lib/zaver.ts (vzor: panel se bez zápisu v deníku neukáže), src/lib/denik.ts (stavBloku), komponenty Volba, Spor a ZmenJednuVec v src/components/bloky a ostrovy včetně bloky-typy.ts (z nich zjisti skutečný tvar uloženého stavu; nehádej ho) a tests/e2e/cesta2.spec.ts.

1. Čistá logika v src/lib (třeba strany.ts) s testy ve vitestu (tests/data): z uloženého stavu bloku (stavBloku(id)) vrať „odpověď studenta“ pro oddíl: Volba = zvolená karta, jen když ji student potvrdil; Spor = konečná poloha (blíž jedné straně, nebo uprostřed, ne první poloha); Změň jednu věc = základní rozhodnutí. Roztřiď, Odkryj, chybějící zápis, neprošlý blok i smazaný deník dají null. Testy pokryj tyhle případy a neznámé id bloku.

2. Komponenta (Svelte ostrov s obalem v Astru podle vzoru ostatních bloků; názvy drž stručné a v souladu s knihovnou bloků). Text zůstává v MDX (odpověď autora 3): obal oddílu řekne, ke kterému bloku patří (blok="…"), obal odstavce, ke které odpovědi (odpoved="A"); co patří všem odpovědím, stojí mimo obaly a je vidět vždy. Citáty (<Citat id>) beze změny. Chování: když deník ví, co student zvolil, ukáže oddíl nejdřív jeho odpověď s jejími zastánci; ostatní odpovědi jsou pod sbaleným „Kdo hájil jiné odpovědi“ (nativní details nebo stejně přístupné tlačítko). Nic se neškrtá a nic se neukládá. Bez JavaScriptu, bez deníku a u bloku, který student neprošel, je oddíl celý jako dnes bez sbalené části; kdo prošel jen některé bloky, má přeskládané jen jejich oddíly (odpovědi 4 a 5). Sestavená stránka je vždy celá a ostrov ji po hydrataci jen přeskládá: kotvy pro přípravu hodiny platí v obou stavech (docs/pouceni.md › Technika: ostrov, který před hydratací vykreslí jinou větev, musí nést kotvu v obou větvích; skrývej přes display; plynulý posun a omezený pohyb). Nové názvy a text uživatelského rozhraní česky, tykání.

3. Nasazení: cesta 2, krok 8 (8-kdo-je-na-tve-strane.mdx; Volby cesta2-je-to-ona a cesta2-ktera-je-theseova, Spor cesta2-seneca-plutarchos). Doplň obaly podle mezititulků kroku. Úvodní věta každého oddílu se musí číst s rozbalenou i sbalenou částí; uprav ji se skillem atlas-psani (T1 udělá totéž ve zbylých čtyřech cestách). Studentské věty hlídají testy přesným zněním: než větu opravíš, najdi ji v tests/ (grep -rn) a test uprav v témže commitu.

4. Testy a snímky: vitest pro logiku; v tests/e2e/cesta2.spec.ts případy bez zápisu (celý oddíl jako dnes), se zápisem (odpověď studenta první, ostatní sbalené), nepotvrzená Volba, Spor uprostřed, smazaný deník; klávesnice, axe, 390 a 1440 px, světlý i tmavý režim, omezený pohyb. Snímky skriptem scripts/snimky-cesta.mjs (krok s odpověďmi i bez) a prohlédni je; do „Claude outputs/“ dej list se třemi stavy kroku 8.

5. Příprava hodiny: skriptem scripts/hodiny-katalog.mjs ověř nad dist/, že kotvy bloků a oddílů kroku 8 platí a katalog zastavení se nezměnil (blok je přeskládání textu, ne nové zastavení). Nic nepřidávej do katalogu, dokud to autor nechce.

6. Dokumentace: do docs/design.md výjimku z pravidla „obsah bloku v YAML, v MDX jeden řádek“ (proč tady text zůstává v MDX; co obaly umí; jak se čte deník), do docs/rozhodnuti.md záznam, do docs/pouceni.md jen to, co se opravdu nepovedlo. Skill atlas-komponenta nech být; upraví se v kroku O po revizi.

7. Celé npm test (včetně astro check) pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť. Commit česky a stručně ve větvi interaktivita-v1; nic neposílej na GitHub. V plánu větve: řádek K1 na „hotovo“, oddíl „Po K1“ (co jsi postavil, nad čím jsi váhal, co jsi zvolil, výsledek npm test) a pod něj zadání T1 v plném znění ve stejném tvaru jako toto (Opus 5.5 · high, skilly atlas-psani a atlas-cesta; cesty 7, 8, 33 a 34 podle vzoru z cesty 2; text rozdělený podle odpovědí, spojovací věty, testy přesného znění); zadání K1 přesuň do docs/archiv/zadani/interaktivita-v1.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v1.md); nic dalšího do projektu nepřidávej.

8. Pak se zastav a napiš mi krátce, co jsi postavil, nad čím jsi váhal a co jsi zvolil, a ukaž list snímků. Spustit nemusím nic.
```
