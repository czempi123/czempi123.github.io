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
