# Provedená zadání větve interaktivita-v1

Zadání kroků v plném znění, jak byla v plánu větve (`docs/plany/interaktivita-v1.md`). Zadání K0, K1, T1 a K2 přesunuta 29. 10. 2026, zadání K3 a T2 30. 10. 2026, zadání R, O a Uzavření 31. 10. 2026.

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

## Zadání T1

Model: Opus 5.5 · high. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok T1 větve interaktivita-v1 (Kdo je na tvé straně v cestách 7, 8, 33 a 34 podle vzoru z cesty 2). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v1.md tabulku kroků a oddíl Po K1, v docs/design.md oddíl Bloky › Kdo je na tvé straně a toto zadání. Načti skilly atlas-psani a atlas-cesta a řiď se jimi. Vzor je hotový krok 8 cesty 2 (src/content/cesty/jsem-porad-tentyz-kdyz-se-menim/8-kdo-je-na-tve-strane.mdx) a jeho testy v tests/e2e/cesta2.spec.ts (poradiStran, sDenikem, jakoDnes, kotvy); komponentu neměň, jen ji používej.

1. Kroky: cesta 7, krok 7 (src/content/cesty/ci-zivot-vlastne-ziju/7-kdo-je-na-tve-strane.mdx); cesta 8, krok 9, oddíl Kdo je na tvé straně (src/content/cesty/proc-se-bat-smrti/9-tvoje-pravidlo.mdx); cesta 33, krok 8 (src/content/cesty/co-kdyz-prijde-to-nejhorsi/8-kdo-je-na-tve-strane.mdx); cesta 34, krok 8 (src/content/cesty/kam-mi-mizi-cas/8-kdo-je-na-tve-strane.mdx). Cesty 1, 3, 4, 5 a 6 takový krok nemají a nepřidávej ho. U každého mezititulku zjisti, ke kterému bloku patří (grep id Voleb, Sporů a Změň jednu věc v krocích té cesty a jejich YAML v src/content/bloky), a skutečné kódy odpovědí vezmi z YAML (písmena podle pořadí možností, id osob stran, id možností); nehádej je. Oddíl, který k žádnému bloku s odpovědí nepatří (Roztřiď, Odkryj, text bez bloku), nech bez obalu.

2. Obaly: <Strany blok="…"> pod nadpisem oddílu (nadpis i s kotvou zůstává mimo), <Strana odpoved="…"> kolem odstavců jedné odpovědi, odstavec pro víc odpovědí odpoved="C D"; co patří všem odpovědím, stojí mimo obaly. Citáty (<Citat id>) beze změny, jen jdou se svou odpovědí. Každá možnost bloku musí mít v oddílu svůj odstavec (pouceni.md › Celek: zastánci všech odpovědí); když některá chybí, napiš ho z toho, co krok už o zastáncích říká, a nic nového z hlavy netvrď. Spor uprostřed dostane odstavec jen tam, kde krok pro střed opravdu někoho má; jinak zůstane oddíl pro studenta uprostřed nepřeskládaný.

3. Text se skillem atlas-psani: úvodní věta oddílu mimo obaly se musí číst nad rozbalenou i sbalenou částí; každý odstavec Strana stojí sám, protože může být první (žádné „taky“, „i on“, „třetí odpověď“, „A jestli…“ navazující na jinou odpověď); společný text za odpověďmi stojí za sbalenou částí, tak ať má svůj podmět. Měň jen to, co tohle vyžaduje: obsah, zastánci a citáty zůstávají. Shrnutí pramene drží rozdíly z podkladů (pouceni.md › Prameny a formulace). Studentské věty hlídají testy přesným zněním: než větu opravíš, najdi ji v tests/ (grep -rn) a test uprav v témže commitu.

4. Testy: v testu každé cesty (tests/e2e/cesta7.spec.ts, cesta8.spec.ts, cesta33.spec.ts, cesta34.spec.ts) případ bez zápisu (oddíly celé jako dnes) a se zápisem (odpověď studenta první, ostatní sbalené) po vzoru cesta2.spec.ts; u cesty s Sporem i Spor uprostřed, u cesty se Změň jednu věc její základní rozhodnutí; axe a kotvy. Průchody, které bloky odpovídají, musí po přeskládání pořád projít; uprav jejich očekávané pořadí, ne komponentu. Pomocné funkce z cesta2.spec.ts klidně přesuň do sdíleného souboru v tests/e2e/ a použij v obou.

5. Snímky: node scripts/snimky-cesta.mjs <slug> 390 light odkryt a zavreno pro poslední krok každé cesty, prohlédni je; do „Claude outputs/“ dej list posledních kroků všech čtyř cest se zápisem a bez něj.

6. Čas cesty na štítku přepočítej (node scripts/slova-cesta.mjs <slug>) jen tam, kde se text kroku změnil o víc než pár slov. Skill atlas-komponenta ani komponentu Strany neměň; když narazíš na její chybu, zapiš ji do plánu pro krok R. Do docs/pouceni.md jen to, co se opravdu nepovedlo.

7. Celé npm test (včetně astro check) pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť. Commit česky a stručně ve větvi interaktivita-v1; nic neposílej na GitHub. V plánu větve: řádek T1 na „hotovo“, oddíl „Po T1“ (co jsi změnil v kterém kroku, nad čím jsi váhal, co jsi zvolil, výsledek npm test) a pod něj zadání K2 v plném znění ve stejném tvaru jako toto (Opus 5.5 · high, skilly atlas-komponenta a atlas-data; Dva životy v Době a lidech a Kdo žil dřív? v šabloně medailonku podle oddílů 3 a 4 Obsahu větve a odpovědí autora k otázkám 6 a 7); zadání T1 přesuň do docs/archiv/zadani/interaktivita-v1.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v1.md); nic dalšího do projektu nepřidávej.

8. Pak se zastav a napiš mi krátce, co jsi změnil, nad čím jsi váhal a co jsi zvolil, a ukaž list snímků. Spustit nemusím nic.
```

## Zadání K2

Model: Opus 5.5 · high. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K2 větve interaktivita-v1 (Dva životy v Době a lidech na všech stránkách osob a Kdo žil dřív? v šabloně medailonku, obojí z dat). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v1.md tabulku kroků, v Obsahu větve oddíly 3 (Dva životy) a 4 (Kdo žil dřív? u medailonků), v Co rozhodnout otázky 6 a 7 (prázdná odpověď je souhlas s doporučením) a oddíl Po T1, v docs/design.md oddíly Bloky › Kdo žil dřív? a Komponenty (Doba a lidé, mini osa) a toto zadání. Načti skilly atlas-komponenta, atlas-data a atlas-psani a řiď se jimi. Hotové kusy, na kterých stavíš: vzdalenost() v src/lib/cas-mapy.ts, src/components/osobnost/DobaALide.astro a MiniOsa.astro, ostrov src/components/ostrovy/KdoZilDriv.svelte s vložením src/components/bloky/KdoZilDriv.astro a šablona src/components/osobnost/StrankaMedailonku.astro.

1. Pravidla výběru v src/lib jako čisté funkce s testy v tests/data/: (a) výchozí dvojice Dvou životů je osoba stránky a její první učitel nebo žák z src/data/vztahy.yaml, u osoby bez takového vztahu nejbližší současník s vlastní stránkou; (b) druhý člověk pro Kdo žil dřív? na medailonku je osoba s portrétem nebo profilem, nejbližší podle poloviny života a bez vztahu s osobou stránky, aby otázka nebyla zjevná. Obojí pevně, ne náhodně: stránka je pokaždé stejná a testy i zastavení v přípravě hodiny drží. Rok nula neexistuje; přibližná data ber jako cas-mapy.ts. Pusť obě pravidla přes všechny osoby se stránkou a vypiš dvojice; kde výsledek nic neříká nebo by mátl, zapiš to do plánu a výjimky do dat nepřidávej.

2. Dva životy v Době a lidech, tedy na všech stránkách osob najednou (medailonky, profily, portréty): dva vodorovné pruhy na jedné ose, překryv zvýrazněný, pod nimi věta z vzdalenost() („Žili současně 37 let“, „Dělí je 519 let, asi sedm lidských životů“). Student vybere jiného člověka ze seznamu, nejdřív lidi z Doby a lidí, pak ostatní podle období; druhý pruh se posune a věta se přepíše (aria-live), při omezeném pohybu pruh skočí. Nic se neukládá. Bez JavaScriptu stojí výchozí dvojice s větou. Ostrov podle atlas-komponenta: design tokeny, světlý i tmavý režim, klávesnice, cíle 44 px, axe. Věty a popisky se skillem atlas-psani; popisky musí znát rod obou lidí (pouceni.md › Co se skládá z dat). Prohlédni si Dobu a lidi i v čtenářském sloupci profilu na 1440 px (pouceni.md › Technika: blok v profilu má 680 px).

3. Kdo žil dřív? v šabloně medailonku nad Dobou a lidmi (Doba a lidé by odpověď prozradila), druh pořadí, druhý člověk podle pravidla (b). Blok je hotový, jen ho vlož. V přípravě hodiny má tři podoby: ověř, že zastavení z medailonků mají pevné id a podoby a že node scripts/hodiny-katalog.mjs hlásí 0 chyb.

4. Testy: logika v tests/data/; e2e pro medailonek, profil a portrét po vzoru tests/e2e/medailonky.spec.ts a doba-odkazy.spec.ts: výchozí dvojice a věta, výběr jiného člověka jen klávesnicí, omezený pohyb, bez JavaScriptu, axe na 390 a 1440 px ve světlém i tmavém režimu. Testy, které drží přesný obsah Doby a lidí, seznamy odkazů nebo počty zastavení v hodině, uprav v témže commitu (pouceni.md › Technika).

5. Snímky: node scripts/snimky-listy.mjs pro jeden medailonek, jeden profil a jeden portrét (390 světlý, 1440 tmavý); prohlédni hlavně hlavičku a Dobu a lidi na telefonu. Do „Claude outputs/“ dej list.

6. Do docs/design.md zapiš oba prvky (Komponenty › Dva životy, Bloky › Kdo žil dřív? s pravidlem výběru na medailonku). Skill atlas-data teď neměň (to je krok O); co do něj patří, zapiš do plánu. Do docs/pouceni.md jen to, co se opravdu nepovedlo. Po změně komponent restartuj běžící npm run dev.

7. Celé npm test (včetně astro check) pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť. Commit česky a stručně ve větvi interaktivita-v1; nic neposílej na GitHub. V plánu větve: řádek K2 na „hotovo“, oddíl „Po K2“ (co vzniklo, nad čím jsi váhal, co jsi zvolil, vypsané dvojice, které nic neříkají, výsledek npm test) a pod něj zadání K3 v plném znění ve stejném tvaru jako toto (Opus 5.5 · high, xhigh při zaseknutí, skill atlas-komponenta; Slož argument podle oddílu 2 Obsahu větve a odpovědi autora k otázce 8: komponenta, ukázka v dílně, zastavení a podoby v přípravě hodiny; obsah pro cestu 8 až v kroku T2); zadání K2 přesuň do docs/archiv/zadani/interaktivita-v1.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v1.md); nic dalšího do projektu nepřidávej.

8. Pak se zastav a napiš mi krátce, co jsi postavil, nad čím jsi váhal a co jsi zvolil, a ukaž list snímků. Spustit nemusím nic.
```

## Zadání K3

Model: Opus 5.5 · high (xhigh při zaseknutí). Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K3 větve interaktivita-v1 (blok Slož argument: komponenta, ukázka v dílně, zastavení a podoby v přípravě hodiny; obsah pro cestu 8 až v kroku T2). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v1.md tabulku kroků, v Obsahu větve oddíl 2 (Slož argument), v Co rozhodnout otázku 8 (prázdná odpověď je souhlas s doporučením) a oddíl Po K2, v docs/plan.md jen řádek Slož argument v tabulce oddílu Mechanismy učení, v docs/design.md oddíly Bloky (Jak blok vložit do MDX, Co se ukládá, Volba s důvodem, Roztřiď, Společné pro všechny bloky) a Komponenty › Podoba na plátně, a toto zadání. Načti skilly atlas-komponenta a atlas-psani a řiď se jimi. Vzory, na kterých stavíš: Roztřiď (src/components/ostrovy/Roztrid.svelte: přesun karty klepnutím, tažením i klávesnicí) a Volba (src/components/ostrovy/Volba.svelte: nepovinný důvod a zápis do deníku), schéma bloků src/lib/bloky-schema.ts, deník src/lib/denik.ts, katalog hodin src/lib/hodiny.ts (BLOKY_Z_YAML, podobyZastaveni) a styly podob src/styles/promitani.css.

1. Rozhraní dřív než kód: obsah v YAML (src/content/bloky/<id>.yaml, nový druh ve schématu), v MDX jeden řádek <SlozArgument id="…" />. Schéma: otázka, karty (premisy a závěr, každá s textem a místem v argumentu), skrytý předpoklad (text a zpětná vazba k němu), místo, kde se dá argument napadnout (ke které premise a proč), zpětná vazba po složení, volba „Kterou premisu bys napadl ty?“ s nepovinným důvodem, zdroje, kOvereni, dal. Logika (vyhodnocení pořadí, platný stav z deníku, popis pro čtečky, text zpětné vazby podle toho, co student složil) v src/lib jako čisté funkce s testy v tests/data/.

2. Komponenta podle oddílu 2 Obsahu větve: vlevo karty, vpravo řádky „1“, „2“, „Závěr“ a řádek s otazníkem pro skrytý předpoklad. Kartu student přesune klepnutím (vybere kartu, pak řádek), tažením i klávesnicí; pohne se jen karta na své místo, při omezeném pohybu skočí. Po „Zkontrolovat“ zpětná vazba vidí, co student složil, a vysvětluje důvod, ne známku; pak se odkryje skrytý předpoklad a místo, kde se dá argument napadnout. Nakonec volba „Kterou premisu bys napadl ty?“ s nepovinným důvodem, která jde do deníku (je to názor). Stav vydrží obnovení stránky, Zkusit znovu ho smaže. Design tokeny, světlý i tmavý režim, cíle 44 px, fokus jen z klávesnice, axe; na 390 px karty nad řádky. Prohlédni blok i v čtenářském sloupci profilu (680 px) a v kroku cesty (960 px).

3. Ukázka v dílně (/dilna/bloky/) s obsahem, který není z cesty 8 a nečeká na ověření (třeba klasický sylogismus o smrtelnosti Sókrata); blok s neprázdným kOvereni smí stát jen v dílně. Do cesty 8 nic nepiš: obsah, premisy z Dopisu Menoikeovi a navázání textu kroku jsou krok T2.

4. Příprava hodiny: blok přibude do BLOKY_Z_YAML, a tím do katalogu, jakmile má id. Zapiš jeho podoby (celý blok, jen otázka a možnosti, otevřená otázka; co patří do „možností“) do podobyZastaveni, značky data-cast do komponenty a řádek do tabulky podob v docs/design.md. Ověř node scripts/hodiny-katalog.mjs (0 chyb) a promítání v podobách testem jako u ostatních bloků (tests/e2e/hodina-podoby.spec.ts).

5. Testy: logika v tests/data/; e2e podle skillu atlas-komponenta: klepnutí, tažení (i skutečným dotykem přes CDP), jen klávesnice, obnovení stránky, omezený pohyb, axe na 390 a 1440 px ve světlém i tmavém režimu, zápis volby do deníku a jeho smazání, Zkusit znovu. Testy, které drží počty bloků v dílně nebo v katalogu, uprav v témže commitu.

6. Snímky: node scripts/snimky-prvek.mjs ve stavech před složením, po kontrole a po volbě, 390 světlý a 1440 tmavý; node scripts/snimky-montaz.mjs je slož do jednoho listu v „Claude outputs/“. Do docs/design.md zapiš blok (Bloky › Slož argument s API a tím, co se ukládá; řádek v tabulce Co se ukládá), rozhodnutí do docs/rozhodnuti.md, do docs/pouceni.md jen to, co se opravdu nepovedlo. Po změně komponent restartuj běžící npm run dev.

7. Celé npm test (včetně astro check) pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť. Commit česky a stručně ve větvi interaktivita-v1; nic neposílej na GitHub. V plánu větve: řádek K3 na „hotovo“, oddíl „Po K3“ (co vzniklo, nad čím jsi váhal, co jsi zvolil, výsledek npm test) a pod něj zadání T2 v plném znění ve stejném tvaru jako toto (Opus 5.5 · high se skilly atlas-overeni, atlas-psani a atlas-cesta; Slož argument v cestě 8, krok 3 podle oddílu 2 Obsahu větve a odpovědi k otázce 8: premisy a skrytý předpoklad „smrtí všechno končí“ z Dopisu Menoikeovi 124–125 ověřené proti podkladům celku 6 a v prameni, zpětná vazba, navázání textu kroku tak, aby blok nepředbíhal námitku, kterou cesta proti argumentu staví); zadání K3 přesuň do docs/archiv/zadani/interaktivita-v1.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v1.md); nic dalšího do projektu nepřidávej.

8. Pak se zastav a napiš mi krátce, co jsi postavil, nad čím jsi váhal a co jsi zvolil, a ukaž list snímků. Spustit nemusím nic.
```

## Zadání T2

Model: Opus 5.5 · high se skilly atlas-overeni, atlas-psani a atlas-cesta. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok T2 větve interaktivita-v1 (Slož argument v cestě 8 „Proč se bát smrti?“, krok 3: obsah bloku ověřený v prameni, zpětná vazba a navázání textu kroku). Komponentu neměň, jen kdybys v ní našel chybu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v1.md tabulku kroků, v Obsahu větve oddíl 2 (Slož argument), v Co rozhodnout otázku 8 (prázdná odpověď je souhlas s doporučením) a oddíl Po K3, v docs/design.md oddíl Bloky › Slož argument a Bloky › Jak blok vložit do MDX, v podkladech celku 6 (docs/podklady/celek-6-proc-se-bat-smrti.md) jen oddíly o Dopisu Menoikeovi 124–125 a o námitkách proti Epikúrovu argumentu, a toto zadání. Načti skilly atlas-overeni, atlas-psani a atlas-cesta a řiď se jimi. Cesta 8: src/content/cesty/proc-se-bat-smrti.mdx (přehled) a kroky 3 až 6 (3-netyka-se-nas.mdx, 4-zrcadlo.mdx, 5-host-u-stolu.mdx, 6-tyka-se-nas.mdx), abys věděl, kde cesta staví námitku. Vzor obsahu: src/content/bloky/dilna-sokrates-zemre.yaml.

1. Ověření (atlas-overeni): Epikúrův argument z Dopisu Menoikeovi 124–125 (u Diogena Laertia X, 124–125) v řeckém textu a v českém překladu, ze kterého atlas cituje (menoikeus-124, menoikeus-125 v src/data/zdroje.yaml). Premisy a závěr formuluj tak, aby každá stála na tom, co pramen říká (dobré a zlé je ve vnímání; smrt je ztráta vnímání; proto se nás smrt netýká; dokud jsme my, není smrt), a skrytý předpoklad „smrtí všechno končí“ (žádné vnímání po smrti) tak, aby bylo jasné, že ho Epikúros neříká v téhle větě, ale jeho argument ho potřebuje. Ověř, kde ho Epikúros říká jinde (atomy, duše se rozptýlí), a zapiš do podkladového listu celku 6 krátký doplněk s místy v pramenech; pramen do `zdroje` bloku je id pramene (dl-x-122), ne citátu (pouceni › Id ze zadání ověř v datech).

2. Obsah bloku src/content/bloky/<id>.yaml (druh: argument, obdobi: 2) podle docs/design.md › Slož argument: dvě až tři premisy a závěr v kartách v pořadí, které neprozradí argument; skrytý předpoklad „smrtí všechno končí“; napadnout podle toho, kde cesta argument napadá (námitka v krocích 4 až 6), s `proc`, které začne tím, o jakou větu jde; `zpetna` po složení, která ukáže na mezeru a ptá se dál; `vZaveru` u premisy, kterou student nejspíš dá do závěru; `kdyzNapadnes` u každé premisy, u skrytého předpokladu a `zadnou`. Žádná zpětná vazba nepředbíhá námitku, kterou cesta staví v dalších krocích: blok ukáže, kde se dá argument napadnout, cesta pak ukáže, jak to udělali (Plútarchos, Lucretius, Nagel podle podkladů). Ověř každou formulaci proti podkladům a prameni. Čti i očima studenta, kterému někdo zemřel nebo umírá, a studenta s myšlenkami na smrt (pouceni › Student, kterého se téma bolestně týká: celek 6): souměrné „nezbude nikdo, kdo by cokoli zakoušel, dobré ani zlé“, žádné „nebude to bolet“.

3. Krok 3 (3-netyka-se-nas.mdx): blok vlož tam, kde student argument poprvé uvidí celý, a text kolem něj navaž tak, aby se nic neříkalo dvakrát (citáty menoikeus-124 a menoikeus-125 zůstanou, blok je neparafrázuje) a aby text za blokem stál i bez složení. V kroku je už Odkryj: první blok dostane vlastní Kam dál na kotvu pod sebou (pouceni › Bloky: krok se dvěma bloky). Se skillem atlas-psani přečti krok třikrát; úvodní větu bloku (scena) a otázku piš jako část kroku, ne jako pokyn.

4. Testy a data, které nový blok změní: přesné znění kroku 3 v tests/e2e/cesta8.spec.ts (grep -rn nejdřív), průchod cesty 8 se složením argumentu a volbou, počet bloků a zastavení v katalogu hodin, skutečné zastavení b:<id> v podobách v tests/e2e/hodina-podoby.spec.ts (jen otázka a možnosti a otevřená otázka na plátně 1280 × 720), node scripts/hodiny-katalog.mjs (0 chyb), node scripts/slova-cesta.mjs proc-se-bat-smrti a čas na štítku cesty, jestli se změnil. Zápis do deníku ověř na stránce Můj deník.

5. Snímky: node scripts/snimky-cesta.mjs proc-se-bat-smrti 390 light odkryt 3 a 1440 dark; node scripts/snimky-prvek.mjs bloku ve stavech před složením, po kontrole a po volbě (DENIK=<soubor.json> pro stavy po kontrole, viz docs/design.md › Slož argument), 390 světlý a 1440 tmavý; node scripts/snimky-montaz.mjs je slož do jednoho listu v „Claude outputs/“. Rozhodnutí do docs/rozhodnuti.md, do docs/pouceni.md jen to, co se opravdu nepovedlo. Po změně obsahu restartuj běžící npm run dev.

6. Celé npm test (včetně astro check) pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť. Commit česky a stručně ve větvi interaktivita-v1; nic neposílej na GitHub. V plánu větve: řádek T2 na „hotovo“, oddíl „Po T2“ (co vzniklo, nad čím jsi váhal, co jsi zvolil, výsledek npm test) a pod něj zadání R v plném znění ve stejném tvaru jako toto (Opus 5.5 · high se skillem atlas-revize: revize celé větve, K0 až T2, podle skillu, záznam do docs/revize/interaktivita-v1-<datum>.md, drobnosti opravit rovnou, zásadní nálezy seřadit podle dopadu s návrhem opravy; zvlášť: Kdo je na tvé straně v cestách 2, 7, 8, 33 a 34, Dva životy a Kdo žil dřív? na medailoncích, Slož argument v cestě 8 a v dílně, čas na štítcích cest se sbalenými odstavci, „Zkusit znovu“ × „Začít znovu“); zadání T2 přesuň do docs/archiv/zadani/interaktivita-v1.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v1.md); nic dalšího do projektu nepřidávej.

7. Pak se zastav a napiš mi krátce, co jsi napsal, nad čím jsi váhal a co jsi zvolil, a ukaž list snímků. Spustit nemusím nic.
```

## Zadání R

Model: Opus 5.5 · high se skillem atlas-revize. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok R větve interaktivita-v1 (revize celé větve, K0 až T2, podle skillu atlas-revize). Drobnosti oprav rovnou, zásadní nálezy seřaď podle dopadu s návrhem opravy. Čti jen to, co revize potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v1.md tabulku kroků, Obsah větve, Co rozhodnout (prázdné odpovědi jsou souhlas s doporučením) a oddíly Po K0 až Po T2, v docs/design.md oddíly Bloky › Kdo je na tvé straně, Bloky › Slož argument, Bloky › Kdo žil dřív? a Komponenty › Dva životy, v docs/rozhodnuti.md záznamy větve (26.–30. 10. 2026) a toto zadání. Načti skilly atlas-revize a atlas-psani a řiď se jimi; atlas-komponenta, atlas-cesta a atlas-data otevři u perspektiv, kterých se týkají. Rozdíl větve proti hlavní větvi: git diff main...interaktivita-v1 --stat, pak jen soubory, které revize potřebuje.

1. Revize podle skillu atlas-revize (všechny perspektivy, u textů skill atlas-psani), zvlášť:
   - Kdo je na tvé straně v posledních krocích cest 2, 7, 8, 33 a 34: projdi každý oddíl se zápisem každé odpovědi i bez něj. Stojí odstavec každé odpovědi sám jako první? Čte se úvodní věta oddílu nad rozbalenou i sbalenou částí? Je štítek „Na tvé straně“ srozumitelný? Probliknutí na první obrazovce kroku 8 cesty 2 (Po K1) a cesta 8 jako tři oddíly k jedné Volbě (Po T1): rozhodni, jestli to tak nechat.
   - Dva životy na stránkách osob a Kdo žil dřív? na medailoncích: dvojice, které nic neříkají nebo matou, a opakování téže otázky (seznam v Po K2), věta o lidských životech zaokrouhlená na 75 let („Dělí je asi 100 let. To je asi jeden lidský život.“), nabídka Druhý život klávesnicí a čtečkou.
   - Slož argument v cestě 8, krok 3, a v dílně: obsah bloku proti podkladům celku 6 (oddíl Jádro: Epikúros › Slož argument v kroku 3) a proti prameni, jestli žádná zpětná vazba nepředbíhá námitku z kroků 4 až 6, čtení očima studenta, kterému někdo zemřel nebo umírá, a studenta s myšlenkami na smrt (pouceni › Student, kterého se téma bolestně týká: celek 6), opakování předpokladu v bloku a v textu pod ním, blok na telefonu i na 1440 px, jen klávesnicí, dotykem a v podobách na plátně.
   - Čas na štítcích cest se sbalenými odstavci: `slova-cesta.mjs` počítá jen viditelný text (Po T1). Rozhodni, který čas na štítek patří, když student s odpověďmi čte míň, a podle toho zkontroluj štítky cest 2, 7, 8, 33 a 34.
   - „Zkusit znovu“ ve Slož argument × „Začít znovu“ v ostatních blocích: navrhni, jestli sjednotit.
   - Kontrola typů: npm test pouští astro check; ověř, že ho pouští i `.github/workflows/kontroly.yml` stejně.

2. Záznam revize do docs/revize/interaktivita-v1-<datum>.md ve tvaru ze skillu: verdikt, nálezy seřazené podle dopadu s návrhem opravy (hotovým zněním u textů), co jsi rovnou opravil. Opravy drobností s testy přesného znění v témže commitu (grep -rn v tests/ nejdřív). Po změně obsahu restartuj běžící npm run dev.

3. Snímky jen tam, kde nález stojí na tom, jak věc vypadá: node scripts/snimky-cesta.mjs, node scripts/snimky-prvek.mjs (DENIK=<soubor.json> pro stavy bloku po odpovědi), node scripts/snimky-montaz.mjs do jednoho listu v „Claude outputs/“.

4. Celé npm test pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť. Commit česky a stručně ve větvi interaktivita-v1; nic neposílej na GitHub. V plánu větve: řádek R na „hotovo“, oddíl „Po R“ (verdikt, nálezy jednou větou, co jsi opravil, nad čím jsi váhal, výsledek npm test), pod něj „Co rozhodnout po R“ s otázkami k zásadním nálezům a doporučením (prázdná odpověď je souhlas) a zadání O v plném znění ve stejném tvaru jako toto (Opus 5.5 · high: opravy nálezů podle odpovědí a úprava skillů: atlas-cesta krok se zastánci jako blok Strany a Slož argument, atlas-data prvky medailonku Dva životy a Kdo žil dřív? podle Po K2, atlas-komponenta, co se z revize opakuje; kopie skillů ve skills/). Zadání R přesuň do docs/archiv/zadani/interaktivita-v1.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v1.md); nic dalšího do projektu nepřidávej.

5. Pak se zastav a napiš mi krátce verdikt, zásadní nálezy s doporučením a co jsi rovnou opravil, a ukaž list snímků, jestli vznikl. Spustit nemusím nic.
```

## Zadání O

Model: Opus 5.5 · high (xhigh při zaseknutí) se skilly atlas-komponenta, atlas-psani, atlas-cesta a atlas-data. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok O větve interaktivita-v1 (opravy nálezů z revize R podle mých odpovědí a úprava skillů). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v1.md tabulku kroků, oddíly Po R a Co rozhodnout po R (prázdné odpovědi jsou souhlas s doporučením) a toto zadání, záznam revize docs/revize/interaktivita-v1-2026-10-31.md celý, v docs/design.md oddíly Bloky › Slož argument, Bloky › Kdo žil dřív?, Bloky › Kdo je na tvé straně a Komponenty › Dva životy. Načti skilly atlas-komponenta a atlas-psani; atlas-cesta a atlas-data u kroků, kterých se týkají.

1. Opravy podle odpovědí (u každého nálezu hotové znění nebo přesný zásah v záznamu revize):
   - Nález 1, Slož argument ve dvou zastaveních: po Zkontrolovat titulek a zpětná vazba s tlačítkem „Ukázat chybějící větu“; pak řádek s otazníkem, oddíl Skrytý předpoklad a volba; oddíl Kde se dá argument napadnout a silnější okraj řádku až po Tohle bych napadl. Stav vydrží obnovení v každém zastavení. Uprav logiku v src/lib/argument.ts s testy, ostrov, podoby na plátně (jen otázka a možnosti bez Kde se dá napadnout), design.md, scripts/slova-cesta.mjs, scripts/snimky-cesta.mjs, pruchod.spec.ts, sloz-argument.spec.ts, cesta8.spec.ts a hodina-podoby.spec.ts.
   - Nález 2, Kdo žil dřív? na medailoncích: druhyKdoZilDriv bere známou osobu (profil nebo portrét) bez vztahu, jejíž život se s osobou stránky nepřekrývá, nejbližší podle poloviny života, každou nejvýš na třech medailoncích (přidělení v pořadí lide.yaml); kdo takovou nemá, dostane dnešní. Vypiš dvojice (VYPIS=1 npx vitest run tests/data/dvojice.test.ts), uprav testy a ověř katalog hodin (node scripts/hodiny-katalog.mjs).
   - Nález 3, probliknutí: skript před vykreslením hned za obalem Strany skryje cizí odpovědi podle deníku; pravidlo odpovědi zůstane jedna funkce ze src/lib/strany.ts, ne opis. Test, že se zápisem cizí odpověď nebliká (snímek hned po načtení), a že bez JavaScriptu a bez zápisu je oddíl celý.
   - Nález 4, Dva životy: vychoziDvojice za učitelem a žákem bere vliv-textem (koho osoba četla, pak kdo četl ji; z lidí s vlastní stránkou nejbližší v čase), pak dnešní pravidlo. Dvojice, které i pak nic neříkají, vypiš v Po O.
   - Nález 5, věta o lidských životech ve vzdalenost() podle pravidla v záznamu revize, s testem na každou větev (Mapa a čas: „asi šest lidských životů“ se nemění).
   - Nález 6, bezDuvodu ve schématu Slož argument a v cesta8-argument; v dílně pole zůstane.
   - Nález 7, nové znění ztrata.kdyzNapadnes a věty za citátem 125 v kroku 3 cesty 8.
   - Nález 8, „Začít znovu“ ve Slož argument (komponenta, design.md, testy).
   - Nález 9, nabídka Druhý život za </figure> ve společném obalu s id dva-zivoty.
   Větu, kterou měníš, najdi nejdřív v tests/ (grep -rn) a test uprav v tomtéž commitu. Po změně obsahu restartuj běžící npm run dev.

2. Úprava skillů (kopie ve skills/ a návrh do účtu nástrojem propose_skills, jeden návrh na skill, celý SKILL.md):
   - atlas-cesta: krok se zastánci jako blok Strany (obaly Strany a Strana, kódy odpovědí, úvodní věta oddílu se čte nad sbalenou i rozbalenou částí, každý odstavec odpovědi stojí sám jako první, odpověď bez zastánce se nevymýšlí, oddíl k víc tématům jedné Volby smí být víckrát); Slož argument (kdy ho dát do cesty, karty a skrytý předpoklad z pramene ověřené v podkladech, napadnout.proc začíná tím, o jakou větu jde, a nepředbíhá námitku dalších kroků, bezDuvodu, když v kroku následuje pole s námitkou, Kam dál na kotvu pod blokem, čas na štítku z viditelného textu po odpovědích).
   - atlas-data: oddíl Prvky z dat podle Po K2 a O: Dva životy s výchozí dvojicí (vychoziDvojice: učitel, žák, vliv textem, současník), Kdo žil dřív? s pevným pravidlem druhyKdoZilDriv místo náhodného současníka; nový vztah nebo profil může změnit druhého člověka, a tím id bloku a zastavení v uložených hodinách; po změně vztahů nebo stránek VYPIS výpis a dva-zivoty.spec.ts.
   - atlas-komponenta: co se z revize opakuje: přeskládání po hydrataci na první obrazovce problikne (skript před vykreslením), blok neodkrývá odpověď ani zvýraznění dřív, než se student rozhodne, figcaption je první nebo poslední potomek figure, „Začít znovu“ ve všech blocích, nový druh bloku musí znát pruchod.spec.ts, slova-cesta.mjs a snimky-cesta.mjs.
   Do docs/pouceni.md jednou větou, co se z revize má dodržovat (nejvýš tři věty), a rozhodnutí do docs/rozhodnuti.md.

3. Snímky jen tam, kde oprava mění vzhled (Slož argument po kontrole, po odkrytí a po volbě na 390 a 1440 px; Dva životy s nabídkou): node scripts/snimky-prvek.mjs (DENIK=<soubor.json>), node scripts/snimky-montaz.mjs do jednoho listu v „Claude outputs/“.

4. Celé npm test pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť. Commit česky a stručně ve větvi interaktivita-v1; nic neposílej na GitHub. V plánu větve: řádek O na „hotovo“, oddíl „Po O“ (co jsi opravil po nálezech, nad čím jsi váhal, dvojice Dvou životů a Kdo žil dřív?, které nic neříkají, výsledek npm test), pod něj „Co rozhodnout před uzavřením“ jen tehdy, když něco zbylo, a zadání Uzavření v plném znění ve stejném tvaru jako toto (Opus 5.5 · medium: schválení autorem, sloučení do hlavní větve, push, kontroly na GitHubu včetně prvního sestavení a Playwrightu podle Po K0). Zadání O přesuň do docs/archiv/zadani/interaktivita-v1.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v1.md); nic dalšího do projektu nepřidávej.

5. Pak se zastav a napiš mi krátce, co jsi opravil, nad čím jsi váhal a co jsi zvolil, a ukaž list snímků. Spustit nemusím nic.
```

## Zadání Uzavření

Model: Opus 5.5 · medium. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: uzavření větve interaktivita-v1 (schválení autorem, sloučení do hlavní větve, push, kontroly na GitHubu). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, v plánu větve docs/plany/interaktivita-v1.md tabulku kroků, oddíly Po K0 (kontroly na GitHubu) a Po O a toto zadání.

1. Schválení: zeptej se mě jednou větou, jestli větev schvaluji (stačí „schvaluji“), a připomeň dvě věci z Po O, nad kterými jsi váhal (mez 20 let u Kdo žil dřív? na medailoncích, Kdo žil dřív? s „Zkusit znovu“). Dokud neschválím, nic neslučuj ani neposílej. Když budu chtít změnu, udělej ji, pusť dotčené testy a pak celé npm test jednou na pozadí s výstupem do souboru.

2. Po schválení: celé npm test jednou na pozadí s výstupem do souboru, výsledek čti zvlášť (jen když se od Po O něco změnilo). git switch main, git merge --no-ff interaktivita-v1 s českou zprávou (co větev přinesla jednou větou), git push origin main. Větev interaktivita-v1 nemaž.

3. Kontroly na GitHubu (Po K0: sestavení a Playwright tam poběží poprvé): přes gh run list a gh run watch počkej na běh kontroly.yml a pages.yml pro nový commit. Kontrola typů, vitest, sestavení i Playwright mají být zelené a pages.yml má web nasadit. Když něco spadne, přečti log (gh run view --log-failed), oprav to ve větvi interaktivita-v1, slouč znovu a pošli; co na Linuxu s CI: true padá a na Macu ne, zapiš do docs/pouceni.md jednou větou. Nakonec otevři https://czempi123.github.io/cesta/proc-se-bat-smrti/3/ a ověř, že web má noindex a že Slož argument má po kontrole tlačítko „Ukázat chybějící větu“.

4. V plánu větve: řádek Uzavření na „hotovo“ s datem, krátký oddíl „Po uzavření“ (commit sloučení, výsledek běhů na GitHubu, co jsi případně opravil). V docs/plan.md v rozcestníku větví interaktivita-v1 jako uzavřenou a další krok podle plánu (antika-doplnky). Plán větve přesuň do docs/archiv/plany/, zadání Uzavření do docs/archiv/zadani/interaktivita-v1.md. V Projektu Claude odstraň docs/plany/interaktivita-v1.md a aktualizuj docs/plan.md; nic dalšího do projektu nepřidávej. Commit česky a stručně, push hlavní větve.

5. Pak se zastav a napiš mi krátce, co se sloučilo, jak dopadly kontroly na GitHubu a co jsi případně opravil. Spustit nemusím nic.
```
