# Provedená zadání větve interaktivita-v2

Zadání kroků v plném znění, jak byla v plánu větve (`docs/plany/interaktivita-v2.md`), přesunutá po provedení kroku.

## Zadání K1

Model: Opus 5.5 · high (xhigh při zaseknutí). Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K1 větve interaktivita-v2 (osa hlasů na stránkách velkých otázek). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v2.md tabulku kroků, Co už atlas má, v Obsahu větve oddíl 1 (Osa hlasů), Nad čím jsem váhal a odpovědi autora k otázkám 2 až 5 (prázdná odpověď je souhlas s doporučením), a toto zadání. Načti skilly atlas-komponenta a atlas-psani a řiď se jimi (tokeny, přístupnost, testy, snímky v obou režimech; texty bez strojových obratů). Z hotového kódu čti jen: src/pages/otazka/[otazka].astro, src/components/otazka/HlasyOsa.astro, src/lib/otazky.ts, src/lib/cas-mapy.ts (zivotOsoby, vzdalenost, prirovnaniKZivotum, rok bez nuly), src/lib/denik.ts (stavBloku, ulozStavBloku, deník promítání), src/lib/tvoje-obdobi.ts s TvojeObdobi.svelte a src/components/denik/_katalog-obdobi.ts, src/components/mapa/Reka.svelte jen kvůli rozestupu mincí do řádků, a testy stránek otázek v tests/e2e (najdi je grep -rln "otazka/" tests/e2e).

1. Čistá logika v src/lib (třeba osa-hlasu.ts) s testy ve vitestu (tests/data): poloha každého hlasu v poměru let (polovina života, pruh života, rok bez nuly), rozestup mincí do řádků, když by se překrývaly (pro 390 a 960 px), zlom osy a počet let do dneška (rok 2026 ber z jednoho místa, ne natvrdo na víc místech), věty po volbě ze vzdalenost() a prirovnaniKZivotum (kolik let studenta dělí od zvoleného hlasu; nejdelší vzdálenost mezi hlasy otázky), čtení a zápis volby (stav bloku otazka-<slug>-osa: id osoby nebo „nikdo“). Testy: všech osm stránek otázek, hlas s přibližnými daty, dva hlasy se stejným rokem, hlas před naším letopočtem a po něm, neznámé id v deníku.

2. Ostrov (Svelte) s obalem v Astru na začátku oddílu Proč to tak viděli podle plánu: osa, výzva „Kdo z nich je ti nejblíž?“, tlačítko u každé mince a „Nikdo z nich“, značka „Ty“, dvě věty po volbě, změna a zrušení volby, štítek „Tobě nejblíž“ u hlasu v seznamu HlasyOsa. Mince zároveň vedou na #hlas-<osoba>; jak oddělit skok a volbu, rozhodni podle atlas-komponenta, obojí klávesnicí i čtečkou. Bez JavaScriptu statická osa s odkazy, bez výzvy. Při omezeném pohybu značka skočí. Před prvním názorem je oddíl skrytý jako dnes. Šablony vět napiš se skillem atlas-psani; ukaž mi je v Po K1 na jedné otázce celé.

3. Tvoje antika: u každé otázky nad myslitelem seznamem řádek „Na stránce otázky ses postavil k …“ s mincí (u „nikdo“ nic nebo krátká věta, rozhodni a zdůvodni), změna jen v tvoje-obdobi.ts a TvojeObdobi.svelte s testy; myslitelé podle cest zůstávají.

4. Příprava hodiny: osa jako zastavení s id <slug>-osa a podoba na plátně bez značky a bez vět po volbě (docs/design.md › Komponenty, tabulka podob); ověř skriptem scripts/hodiny-katalog.mjs nad dist/, že přibylo osm zastavení a ostatní se nezměnila.

5. Testy a snímky: vitest pro logiku; e2e na stránce otázky s nejvíc hlasy (kdo-vlastne-jsem) a s nejmíň (co-je-skutecne): bez volby, volba, změna, zrušení, „Nikdo z nich“, obnovení stránky, smazaný deník, bez JavaScriptu, klávesnice, axe, 390 a 1440 px, světlý i tmavý režim, omezený pohyb; Tvoje antika s volbou. Snímky skriptem scripts/snimky-prvek.mjs (DENIK=<soubor.json> pro stav po volbě) a scripts/snimky-montaz.mjs do jednoho listu v „Claude outputs/“ a prohlédni je.

6. Dokumentace: docs/design.md (oddíl Osa hlasů: co ukazuje, měřítko a zlom, volba a deník, podoba na plátně), docs/rozhodnuti.md záznam podle odpovědí, docs/pouceni.md jen to, co se opravdu nepovedlo. Skilly nech být; upraví se v kroku O.

7. Celé npm test (včetně astro check) pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť. Commit česky a stručně ve větvi interaktivita-v2; nic neposílej na GitHub. V plánu větve: řádek K1 na „hotovo“, oddíl „Po K1“ (co jsi postavil, šablony vět, nad čím jsi váhal, co jsi zvolil, výsledek npm test) a pod něj zadání K2 v plném znění ve stejném tvaru jako toto (Opus 5.5 · high se skillem atlas-komponenta; Přehrát život podle oddílu 2 plánu a odpovědí 6 až 8; seznam lidí se zastávkami a tenkých tras do Po K2); zadání K1 přesuň do docs/archiv/zadani/interaktivita-v2.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v2.md); nic dalšího do projektu nepřidávej.

8. Pak se zastav a napiš mi krátce, co jsi postavil, nad čím jsi váhal a co jsi zvolil, a ukaž list snímků. Spustit nemusím nic.
```

## Zadání K2

Model: Opus 5.5 · high se skillem `atlas-komponenta`. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K2 větve interaktivita-v2 (Přehrát život v kartě člověka na mapě). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v2.md tabulku kroků, Co už atlas má, v Obsahu větve oddíl 2 (Přehrát život), Nad čím jsem váhal, odpovědi autora k otázkám 6 až 8 (prázdná odpověď je souhlas s doporučením), oddíl Po K1 a toto zadání. Načti skill atlas-komponenta a řiď se jím (tokeny, přístupnost, testy, snímky v obou režimech); krátké texty (popisky, oznámení pro čtečku) piš podle skillu atlas-psani. V docs/design.md čti jen oddíl Mapa a čas. Z hotového kódu čti jen: src/lib/cas-mapy.ts (kdeVRoce, odkudPrisla, zivotOsoby, vekVRoce, posunRok, rok bez nuly), src/lib/adresa-mapy.ts, src/components/mapa/MapaACas.svelte (rok, zapisAdresy, zmenaRoku, vyber, kamera), src/components/mapa/KartaCloveka.svelte, src/components/mapa/Posuvnik.svelte, src/lib/pohyb.ts, src/components/osobnost/MiniMapa.astro a v src/components/osobnost/DobaALide.astro jen místo, kde stojí mini mapa, a testy tests/e2e/mapa.spec.ts a tests/e2e/mini-mapa.spec.ts.

1. Čistá logika v src/lib (třeba zivot-na-mape.ts) s testy ve vitestu (tests/data): zastávky života z kdeVRoce po letech od narození do smrti (nová zastávka, kdykoli se změní místo; místo, role, rok, věk, „asi“ u urcite: false a u přibližného roku narození), kdo zastávky má (aspoň dvě různá místa za život), rok pro Předchozí a Další zastávku z daného roku, časový plán přehrávání (celý život asi za deset vteřin, na každé zastávce vteřina zastavení; funkce rok podle uplynulého času, přes rok nula) a text zastávky pro řádek a pro oblast aria-live („Assos, 347 př. n. l., 37 let“). Testy: Aristotelés (7 míst, všechna s časem), Epikúros, Platón, Sókratés, Seneca přes přelom letopočtu, člověk jen s dobou činnosti, člověk s jediným místem (oddíl nemá) a nejistý pobyt.

2. V kartě člověka na mapě (KartaCloveka.svelte) nový oddíl „Život na mapě“ podle plánu: řádek zastávek (klepnutí nastaví rok) a tlačítko Přehrát, během běhu Zastavit; Předchozí a Další zastávka vždy (i pro klávesnici). Přehrávání v MapaACas.svelte: rok běží přes posuvník a kameru, kamera drží člověka v záběru, adresa se jen přepisuje (replaceState) a na konci přibude jeden záznam do historie; jakýkoli zásah do posuvníku, výběr jiného člověka nebo zavření karty přehrávání zastaví; na konci stojí rok v roce smrti a karta zůstane otevřená. Aktuální zastávku oznamuje oblast aria-live. Při omezeném pohybu tlačítko Přehrát chybí a nic se samo nespouští. Oddíl mají jen lidé se zastávkami.

3. Ze stránek osob: u lidí se zastávkami dostane mini mapa v Době a lidech odkaz „Přehrát život na mapě“, který otevře Mapu a čas v roce narození s otevřenou kartou a fokusem na tlačítku Přehrát (při omezeném pohybu na Další zastávka); samo se nespustí. Adresu skládej přes zapisAdresu, ne ručně.

4. Žádná nová data (rozhodnutí z 2. 10. 2026). Vypiš skriptem (do scripts/), kdo oddíl dostane a čí trasa je tenká (místa bez času, jen rodiště a místo smrti), a výpis dej do Po K2 jako podklad pro pozdější atlas-data.

5. Testy a snímky: vitest pro logiku; e2e v mapě a na stránce osoby: zastávky, klepnutí na zastávku, Předchozí a Další, Přehrát a Zastavit (s pohybem zkrácený čas přes proměnnou nebo hodiny Playwrightu), zásah do posuvníku a výběr jiného člověka přehrávání zastaví, adresa a historie (jeden záznam navíc), aria-live, omezený pohyb, odkaz ze stránky osoby (rok, karta, fokus), člověk bez zastávek, klávesnice, axe, 390 a 1440 px, světlý i tmavý režim. Uprav testy, které padnou kvůli novému oddílu v kartě (seznam tlačítek, výška karty na telefonu). Snímky skriptem scripts/snimky-prvek.mjs a scripts/snimky-montaz.mjs do jednoho listu v „Claude outputs/“ a prohlédni je.

6. Dokumentace: docs/design.md (Mapa a čas › Život na mapě: zastávky, přehrávání, omezený pohyb, adresa, odkaz ze stránky osoby), docs/rozhodnuti.md záznam podle odpovědí, docs/pouceni.md jen to, co se opravdu nepovedlo. Skilly nech být; upraví se v kroku O.

7. Celé npm test (včetně astro check) pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť. Commit česky a stručně ve větvi interaktivita-v2; nic neposílej na GitHub. V plánu větve: řádek K2 na „hotovo“, oddíl „Po K2“ (co jsi postavil, seznam lidí se zastávkami a tenkých tras, nad čím jsi váhal, co jsi zvolil, výsledek npm test) a pod něj zadání kroku S v plném znění ve stejném tvaru jako toto (Opus 5.5 · high; skill atlas-obdobi podle oddílu 3 plánu, poznámky ze skills/atlas-obdobi/poznamky.md zapracovat a soubor smazat, ukázkou je hotová antika); zadání K2 přesuň do docs/archiv/zadani/interaktivita-v2.md pod zadání K1. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v2.md); nic dalšího do projektu nepřidávej.

8. Pak se zastav a napiš mi krátce, co jsi postavil, nad čím jsi váhal a co jsi zvolil, a ukaž list snímků. Spustit nemusím nic.
```

## Zadání S

Model: Opus 5.5 · high. Nový chat v Projektu Atlas. Krok jde pustit i souběžně s revizí, na K1 a K2 nezávisí kódem.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok S větve interaktivita-v2 (skill atlas-obdobi). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit).

0. git switch interaktivita-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v2.md tabulku kroků, v Obsahu větve oddíl 3 (Skill atlas-obdobi), Nad čím jsem váhal, oddíly Po K1 a Po K2 a toto zadání. Přečti celé skills/atlas-obdobi/poznamky.md. Tvar skillu (frontmatter, délka, referenční soubory) převezmi z skills/atlas-data/SKILL.md a skills/atlas-komponenta/ (jen stavbu, ne obsah). V docs/architektura.md čti jen oddíly Osm období, Kostra osobností, Průřezové linie, Náboženství světa a Pořadí výroby a z Katalogu cest řádky období 3; v docs/plan.md jen Sada skillů, Výrobní workflow jednoho celku a Plán etap. Ukázkou je hotová antika: jako vzor tvaru plánu větve smíš z archivu číst docs/archiv/plany/antika-doplnky.md (tabulka kroků, Co rozhodnout před prvním krokem, jeden oddíl Po a jedno zadání) a docs/revize/antika-2026-10-25.md jen oddíl se souhrnem nálezů; jinak archiv nečti. Co antika má, zjisti výpisem z repozitáře (src/content, src/data), ne čtením stránek.

1. Napiš skills/atlas-obdobi/SKILL.md (krátký, postup a kritéria hotového): jak z architektury udělat plán jednoho období (P12). Výběr lidí a hloubek (portrét, profil, medailonek; nová osoba v datech jen se souhlasem autora), velké otázky doby, cesty a pořadí celků (každé období aspoň jedna cesta jiné stavby a nové bloky), výřez mapy a dějinné kotvy, náboženství doby a Mezitím jinde, stránky ze šablon období, směru, pokusu a tradice, přehled období v deníku (Tvoje <období>), hlasy pro osu hlasů na stránkách otázek (K1), místa s rolí a časem pro Přehrát život (K2: kdo bez času dostane jen odvozenou zastávku) a jedna pohyblivá myšlenka (kresba s pohybem) na celek. K tomu tvar plánu větve, jak se ustálil: tabulka kroků s modelem a úsilím, otázky s doporučením a prázdnou odpovědí jako souhlasem, oddíly Po, zadání dalšího kroku v plném znění a archiv provedených zadání. Na konci, na které skilly plán navazuje (atlas-overeni, atlas-data, atlas-osobnost, atlas-cesta, atlas-komponenta, atlas-psani, atlas-revize).

2. Jeden referenční soubor skills/atlas-obdobi/references/kontrola-planu.md: kontrolní seznam plánu období s hotovou antikou jako ukázkou (co antika má podle typů stránek a dat, co chybělo a doplnila větev antika-doplnky, co našla souhrnná revize). Čísla ověř výpisem z repozitáře.

3. Každou poznámku ze skills/atlas-obdobi/poznamky.md zapracuj do SKILL.md nebo do reference; pak soubor smaž (git rm). V Po S napiš, kam která poznámka šla.

4. Odkazy: CLAUDE.md › Workflow a skilly (atlas-obdobi už existuje), docs/plan.md › Sada skillů, řádek atlas-obdobi („Hotový 5. 11. 2026: skills/atlas-obdobi/SKILL.md“). Plán docs/plan.md uprav i v Projektu Claude.

5. Žádný kód ani data. Ověř grepem, jestli nějaký test nebo skript čte skills/ nebo poznamky.md; pokud ano, pusť dotčené testy (npx vitest run). Celé npm test netřeba.

6. Commit česky a stručně ve větvi interaktivita-v2; nic neposílej na GitHub. V plánu větve: řádek S na „hotovo“, oddíl „Po S“ (co skill obsahuje, kam šly poznámky, nad čím jsi váhal, co jsi zvolil) a pod něj zadání kroku R v plném znění ve stejném tvaru jako toto (Opus 5.5 · high se skillem atlas-revize: revize větve, tedy osy hlasů K1, Přehrát život K2 a skillu S, s čtyřmi pohledy skillu a průchodem v prohlížeči na 390 a 1440 px); zadání S přesuň do docs/archiv/zadani/interaktivita-v2.md pod zadání K2. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v2.md); nic dalšího do projektu nepřidávej.

7. Pak se zastav a napiš mi krátce, co skill obsahuje, nad čím jsi váhal a co jsi zvolil, a jedním pokynem, jak skill uložím do účtu Claude.
```

## Zadání R

Model: Opus 5.5 · high se skillem `atlas-revize`. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok R větve interaktivita-v2, revize celé větve se skillem atlas-revize: osa hlasů (K1), Přehrát život (K2) a skill atlas-obdobi (S). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit).

0. git switch interaktivita-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/interaktivita-v2.md tabulku kroků, Obsah větve, Nad čím jsem váhal, Co rozhodnout před prvním krokem, oddíly Po K1, Po K2 a Po S a toto zadání. V docs/design.md čti jen Velká otázka › Osa hlasů, Tvoje antika, Mapa a čas › Život na mapě a v Komponentách řádek Osa hlasů v tabulce podob; v docs/rozhodnuti.md jen záznamy z 5. a 6. 11. 2026. Archiv nečti. Co větev mění, ukáže git diff main...interaktivita-v2 --stat; otevři jen soubory, které revize potřebuje.

1. Čtyři pohledy skillu (filozof, historik, student, učitel) a k nim z kontrolního seznamu skillu rozhraní, stránky z dat a lidský hlas, nad tím, co větev mění: osm stránek otázek s osou hlasů a štítkem „Tobě nejblíž“, věty po volbě a po „Nikdo z nich“ (src/lib/osa-hlasu.ts, OSA_HLASU), Tvoje antika s volbou z osy, zastavení b:<slug>-osa v přípravě hodiny a na plátně; karta člověka s oddílem Život na mapě (zastávky, Předchozí, Přehrát, Další, oznámení), přehrávání na mapě a odkaz „Přehrát život na mapě“ v Době a lidech; skill skills/atlas-obdobi/SKILL.md a references/kontrola-planu.md (čísla v referenci ověř výpisem z repozitáře, postup proti docs/architektura.md › Osm období a Pořadí výroby, tvar plánu proti tomuto plánu). Texty pro studenty čti se skillem atlas-psani.

2. Průchod v prohlížeči (npm run build na pozadí, pak npx astro preview --port 4323) na 390 a 1440 px ve světlém i tmavém režimu a klávesnicí: aspoň tři stránky otázek (Kdo vlastně jsem? se sedmi hlasy, Co je správné? a jedna se čtyřmi hlasy) bez volby, s volbou, se změnou, s „Nikdo z nich“ a po obnovení stránky; Tvoje antika s volbou; Mapa a čas s Aristotelem (Přehrát do konce, Zastavit, Zpět v prohlížeči), Senekou přes rok nula, Plótínem a Hérakleitem bez oddílu; odkaz ze stránky Aristotela; omezený pohyb (scripts/revize-pohyb.mjs nebo ručně). Fokus pod lištou zkontroluj scripts/kontrola-fokus.mjs. Snímky skládej scripts/snimky-listy.mjs a scripts/snimky-zivot-na-mape.mjs do Claude outputs/revize-interaktivita-v2/.

3. Odložený nález z Po K2: cesta.spec.ts:88 (kresba Šaty v kroku 6 cesty 1 má při načtení nulovou výšku, client:visible se někdy nespustí). Zjisti příčinu a zapiš ji jako nález s návrhem opravy; oprav jen, když je to drobnost.

4. Drobnosti (překlep, mezera, zjevně chybný odkaz) oprav rovnou a zapiš do záznamu revize. Zásadní nálezy seřaď podle dopadu ve formátu skillu (kde, co je špatně, proč to vadí studentovi, oprava v plném znění), nejvýš deset. Záznam ulož do docs/revize/interaktivita-v2-<datum>.md s verdiktem.

5. Celé npm test jednou na konci, na pozadí s výstupem do souboru; výsledek zapiš do záznamu.

6. Commit česky a stručně ve větvi interaktivita-v2; nic neposílej na GitHub. V plánu větve: řádek R na „hotovo <datum>; čeká na odpovědi po R“, oddíl „Po R“ (verdikt, nálezy jednou větou s odkazem na záznam, nad čím jsi váhal) s „Co rozhodnout po R“ (otázky s doporučením, prázdná odpověď znamená souhlas) a pod ním zadání kroku O v plném znění ve stejném tvaru jako toto (Opus 5.5 · high: opravy po revizi, úprava skillů atlas-komponenta, atlas-cesta › Stránka velké otázky a atlas-data › místa pro Přehrát život, poučení do docs/pouceni.md). Zadání R přesuň do docs/archiv/zadani/interaktivita-v2.md pod zadání S. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v2.md); nic dalšího do projektu nepřidávej.

7. Pak se zastav a napiš mi krátce verdikt, nejdůležitější nálezy a co mám rozhodnout.
```
