# Provedená zadání větve interaktivita-v1

Zadání kroků v plném znění, jak byla v plánu větve (`docs/plany/interaktivita-v1.md`). Zadání K0, K1, T1 a K2 přesunuta 29. 10. 2026.

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
