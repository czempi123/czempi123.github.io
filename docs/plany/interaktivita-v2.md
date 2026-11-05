# Plán větve interaktivita-v2: osa hlasů, Přehrát život a skill atlas-obdobi

Souhrnná revize antiky navrhla v oddílu Interaktivita sedm věcí (`docs/revize/antika-2026-10-25.md`, oddíl 12). Větev `interaktivita-v1` postavila čtyři, `antika-doplnky` deník na konci období (Tvoje antika). Zbyly dvě, které revize dala „před středověk“: **osa hlasů** na stránkách velkých otázek a **Přehrát život** na mapě. Tahle větev je postaví a k nim napíše skill `atlas-obdobi`, který plán středověku (P12) potřebuje. Větev založena z hlavní větve 5. 11. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: středověk přidá hlasy na stránky otázek a desítky lidí na mapu. Osa hlasů, která vznikne teď, dostane středověké hlasy sama, bez úprav osmi hotových stránek; Přehrát život potřebuje jen místa s rolí a časem, která skill `atlas-data` u nových lidí stejně vyplňuje.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| K1 | Osa hlasů: logika rozestupů a volby v `src/lib`, ostrov na začátku oddílu Proč to tak viděli na všech osmi stránkách otázek, zápis do deníku, Tvoje antika, zastavení v přípravě hodiny | Opus 5.5 · high (xhigh při zaseknutí) se skilly `atlas-komponenta` a `atlas-psani` | čeká |
| K2 | Přehrát život: zastávky života z `kdeVRoce`, oddíl v kartě člověka na mapě, přehrávání roku, odkaz ze stránek osob | Opus 5.5 · high se skillem `atlas-komponenta` | čeká |
| S | Skill `atlas-obdobi`: postup plánu období podle architektury, poznámek z antiky a hotových šablon; `skills/atlas-obdobi/SKILL.md`, poznámky zapracované a smazané | Opus 5.5 · high | čeká |
| R | Revize větve | Opus 5.5 · high se skillem `atlas-revize` | čeká |
| O | Opravy po revizi a úprava skillů (`atlas-komponenta`, `atlas-cesta` › Stránka velké otázky, `atlas-data` › místa pro Přehrát život) | Opus 5.5 · high | čeká |
| Uzavření | Schválení autorem, sloučení, push hlavní větve (nasadí web), kontroly na GitHubu zelené | Opus 5.5 · medium | čeká |

**Proč v tomhle pořadí.** Osa hlasů je větší ze dvou prvků a mění osm hotových stránek, deník i přípravu hodiny; jde první, aby revize měla nejvíc času na to, co je nejvíc vidět. Přehrát život stojí na hotových funkcích mapy (`kdeVRoce`, `odkudPrisla`, posuvník) a je menší. Skill `atlas-obdobi` jde po obou, protože plán období má počítat i s nimi (hlasy na ose, místa s časem pro Přehrát život); na K1 a K2 jinak nezávisí, takže ho jde pustit i souběžně v jiném chatu. Revize projde všechno najednou.

## Co už atlas má

- **Stránka velké otázky** (`src/pages/otazka/[otazka].astro`): úvod, Tvůj první názor (`PrvniNazor.svelte`), Tentýž případ s kartami odpovědí (`HlasyOdpovedi.astro`), Proč to tak viděli (`HlasyOsa.astro`, svislý seznam hlasů seřazený podle narození, kotvy `#hlas-<osoba>`), cesty, Změnil se? (`ZmenilSe.svelte`), Kam dál, Prameny. Do prvního názoru nebo „Přeskočit“ je zbytek stránky skrytý.
- **Osm stránek s hlasy:** otázky 1 až 8 mají 4 až 7 hlasů (nejvíc „Kdo vlastně jsem?“ se sedmi); otázky 9 a 10 stránku zatím nemají.
- **Tvoje antika** (`src/lib/tvoje-obdobi.ts`, `TvojeObdobi.svelte`): u každé otázky studentovy odpovědi a myslitelé, kteří to viděli podobně (nejvýš `NEJBLIZ` = 3), s důvodem z jejich hlasu na stránce otázky. Katalog skládá `src/components/denik/_katalog-obdobi.ts`.
- **Čas a vzdálenost** v `src/lib/cas-mapy.ts`: `zivotOsoby`, `vzdalenost()` („žili současně 14 let“, „dělí je 519 let, asi sedm lidských životů“), `prirovnaniKZivotum`, rok bez nuly (`posunRok`, `naAstro`).
- **Kde člověk v roce byl:** `kdeVRoce(o, r)` vrací místo s rolí a příznakem `urcite`, `odkudPrisla` místo, odkud se přestěhoval (na mapě tečkovaná cesta). Z 50 lidí v datech má 21 aspoň tři místa; nejbohatší trasy mají Aristotelés (7 míst, všechna s časem), Epikúros (7), Platón (6), Sókratés a Seneca (5).
- **Mapa a čas** (`MapaACas.svelte`): rok, období, vybraná osoba a srovnání jsou v adrese (`zapisAdresu`), tažení posuvníku přepisuje adresu nejvýš pětkrát za vteřinu; kamera mapy se přesouvá animací, při omezeném pohybu skočí. Karta člověka (`KartaCloveka.svelte`) má vztahy, Změř vzdálenost a tlačítka Otevřít stránku a Najít v Lidech a směrech.
- **Příprava hodiny** zná zastavení z bloků a kreseb s id a jejich podoby na plátně (`docs/design.md` › Komponenty, tabulka podob).
- **Poznámky pro skill `atlas-obdobi`** (`skills/atlas-obdobi/poznamky.md`): co z antiky a z `antika-doplnky` musí plán dalšího období převzít.

## Obsah větve

### 1. Osa hlasů (K1)

Dnes jsou hlasy pod sebou ve stejných rozestupech, takže Hérakleitos a Parmenidés vypadají stejně daleko od sebe jako Aristotelés a Marcus Aurelius, mezi kterými je pět set let. Osa hlasů to ukáže a dá studentovi jednu otázku navíc: ke komu z nich by se postavil.

**Jak vypadá.** Na začátku oddílu Proč to tak viděli vodorovná osa v poměru let: mince hlasů v polovině života, pod nimi tenký pruh života, nad osou letopočty. Za posledním hlasem zlom osy a značka „dnes“ s počtem let („a pak 1 850 let do dneška“). Pod osou výzva „Kdo z nich je ti nejblíž?“ a tlačítko u každé mince (a „Nikdo z nich“). Mince, které by se překrývaly (Seneca, Epiktétos, Marcus), se rozestoupí do dvou řádků jako na řece životů. Na telefonu má osa celou šířku sloupce; na 1440 px šířku širokého oddílu (960 px).

**Co se stane po volbě.** Studentova značka „Ty“ se přesune k vybrané minci (při omezeném pohybu skočí), mince se zvýrazní barvou období a pod osou se objeví dvě věty z dat: kolik let studenta dělí od člověka, kterého si vybral („Epikúros psal před 2 300 lety. Na tvé otázce s ním dnes souhlasíš.“), a jak daleko od sebe žili ti, kdo se na otázku ptali nejdál od sebe („Mezi Hérakleitem a Epiktétem je asi šest set let, osm lidských životů, a přesto si odpovídají.“). Přesné znění vět napíše K1 se skillem `atlas-psani`; tady jsou jen ukázky. Ve svislém seznamu pod osou dostane zvolený hlas štítek „Tobě nejblíž“. Volbu jde kdykoli změnit klepnutím na jinou minci nebo zrušit. „Nikdo z nich“ dá větu, která studenta pošle k Změnil se? na konci stránky.

**Deník.** Volba je názor, takže se ukládá: stav bloku `otazka-<slug>-osa` s id osoby nebo `nikdo`. Pole pro důvod nedávám; stránka už má dvě textová pole (první názor a Změnil se?) a třetí by z ní udělalo formulář. Tvoje antika u každé otázky ukáže nad myslitelem seznamem „Na stránce otázky ses postavil k Epikúrovi“ s jeho mincí; myslitelé podle cest zůstanou pod tím.

**Bez JavaScriptu** je osa vidět jako statický obrázek v poměru let, mince jsou odkazy na `#hlas-<osoba>` a výzva s tlačítky chybí. Se smazaným deníkem nebo bez volby je osa bez značky. Mince jsou zároveň navigace: klepnutí mimo režim volby (nebo Enter na minci) skočí na hlas v seznamu. Jak oddělit „skoč na hlas“ a „postav se k němu“, rozhodne K1 podle skillu `atlas-komponenta` (například mince = skok, tlačítko pod mincí = volba); obojí musí jít klávesnicí a číst se čtečkou.

**Příprava hodiny:** osa je zastavení s id `<slug>-osa`; na plátně bez studentovy značky a bez vět po volbě, aby třída mohla hlasovat zvednutím ruky.

**Texty** jsou jen výzva, tlačítka a šablony vět z dat; žádná stránka otázky nedostane ručně psaný text. Šablony projdou skillem `atlas-psani` v K1, testy hlídají přesné znění.

### 2. Přehrát život (K2)

Aristotelés se narodil ve Stageiře, dvacet let žil v Athénách u Platóna, pak učil v Assu, v Makedonii vychovával Alexandra, vrátil se do Athén a umřel v Chalkidě. Dnes to student na mapě uvidí, jen když posune rok přesně na správné místo. Přehrát život projede život vybraného člověka a mapa ukazuje, kde zrovna byl a kdo tou dobou žil kolem něj.

**Kde.** V kartě člověka na mapě nový oddíl „Život na mapě“: řádek zastávek (místo, role, rok a věk: „Assos, 347 př. n. l., 37 let“) a tlačítko Přehrát. Zastávky vznikají z `kdeVRoce` po letech od narození do smrti: nová zastávka, kdykoli se změní místo; nejisté pobyty (`urcite: false`) mají „asi“. Klepnutí na zastávku nastaví rok. Oddíl mají jen lidé s aspoň dvěma různými místy za život.

**Přehrávání.** Rok běží od narození do smrti tak, aby celý život trval asi deset vteřin, a na každé zastávce se na vteřinu zastaví; kamera mapy drží člověka v záběru, ostatní lidé se objevují a mizí podle let. Tlačítko se během běhu mění na Zastavit; jakýkoli zásah do posuvníku nebo výběr jiného člověka přehrávání zastaví. Na konci stojí rok v roce smrti a karta zůstane otevřená. Adresa se během přehrávání jen přepisuje (`replaceState`), do historie přibude jeden záznam na konci. Aktuální zastávku oznamuje oblast `aria-live`. **Při omezeném pohybu** se nic samo nespouští: místo Přehrát jsou tlačítka Předchozí a Další zastávka (ta jsou i jinak, pro klávesnici).

**Ze stránek osob:** u lidí se zastávkami dostane mini mapa v Době a lidech odkaz „Přehrát život na mapě“. Otevře Mapu a čas v roce narození s otevřenou kartou a fokusem na tlačítku Přehrát; samo se nespustí.

**Data** se v této větvi nedoplňují (žádní noví lidé ani místa, pravidlo z 2. 10. 2026). K2 vypíše do Po K2, kdo oddíl dostane a čí trasa je tenká (místa bez času), jako podklad pro `atlas-data`.

### 3. Skill atlas-obdobi (S)

Osmý skill z plánu (`docs/plan.md` › Sada skillů): postup, jak z architektury (`docs/architektura.md`) udělat plán jednoho období, tedy výběr lidí a hloubek, velké otázky doby, cesty a pořadí celků, výřez mapy a dějinné kotvy, náboženství doby, Mezitím jinde, stránky ze šablon období, směru, pokusu a tradice, přehled období v deníku a jedna pohyblivá myšlenka na celek. Do skillu se zapracují `skills/atlas-obdobi/poznamky.md` (pak se soubor smaže) a tvar plánu větve, jak se ustálil (tabulka kroků s modelem, otázky s doporučením a prázdnou odpovědí jako souhlasem, oddíly Po, zadání dalšího kroku v plném znění). Krátký `SKILL.md` a jeden referenční soubor s kontrolou plánu období; ukázkou je hotová antika, ne vymyšlený příklad. Skill pak autor uloží do účtu Claude.

## Nad čím jsem váhal

- **Osa hlasů nahoře v oddílu, nebo jako samostatný oddíl.** Samostatný oddíl „Kdo je ti nejblíž?“ mezi kartami odpovědí a Proč to tak viděli by byl jasnější, ale stránka by měla další nadpis a student by volil dřív, než si přečte důvody. Nahoře v Proč to tak viděli slouží osa zároveň jako mapa seznamu a volba může přijít i po čtení. Otázka 2.
- **Dnešek na ose.** Osa do roku 2026 by stlačila antiku do první třetiny. Zlom osy drží měřítko mezi hlasy a vzdálenost k dnešku řekne číslem. Ve středověku se osa natáhne na dva tisíce let; jestli se pak antické hlasy stlačí moc, rozhodne revize středověku, ne tahle větev. Otázka 3.
- **Důvod k volbě.** Bez něj je volba jen klepnutí; s ním by stránka měla třetí pole. Kdo chce důvod napsat, má Změnil se?. Otázka 4.
- **Rozestupy ve svislém seznamu** („o 120 let později“ mezi hlasy) by vzdálenost ukázaly i bez osy, ale opakovaly by ji a seznam by zhoustl. Nedávám je.
- **Přehrát život, nebo jen zastávky.** Zastávky s klávesnicí stačí na všechno, co student pochopí; přehrání přidává to, co je vidět jen v pohybu: kdo se kolem objevuje a mizí. Proto obojí, a při omezeném pohybu jen zastávky. Otázka 6.
- **Samospuštění z odkazu na stránce osoby.** Odkaz „Přehrát život“ by mohl rovnou přehrávat, ale stránka, která se po otevření sama hýbe, porušuje omezený pohyb a překvapí. Otevře se připravená. Otázka 7.
- **Skill atlas-obdobi v této větvi, nebo zvlášť.** Plán ho chce „souběžně“. Vlastní větev pro jeden soubor ve `skills/` by znamenala další revizi a další uzavření; v této větvi ho revize přečte spolu s ostatním. Otázka 1.

## Co zůstává na později

- **Hlavička Aristotela s osmi tlačítky otázek** (`docs/archiv/plany/antika-doplnky.md`, Po R, bod 3): patří do úpravy designu, ne do interaktivity.
- **Úprava designu** (styl scrapbooku s prvky neumorfismu, vysvětlení pojmu po najetí na slovo v textu), kterou chce autor ladit společně; kam ji zařadit, rozhodne autor.
- **Doplnění časů k místům** u lidí s tenkou trasou (seznam v Po K2) skillem `atlas-data` se zdrojem.
- **Kresba „odkud se vzalo zpuchřelé prkno“** v profilu Parmenida (revize antiky: později).
- **Dialog a Úryvek s otázkou** z knihovny bloků: s první cestou středověku, která je potřebuje.
- **Zkouška se studenty**, až je autor bude mít; do té doby `noindex`.
- Plán středověku (P12) se skillem `atlas-obdobi` po uzavření této větve.

## Co rozhodnout před prvním krokem

Prázdná odpověď znamená souhlas s doporučením.

1. **Obsah a pořadí kroků** K1, K2, S, R, O, Uzavření; skill `atlas-obdobi` uvnitř této větve, S lze pustit souběžně v jiném chatu. Doporučuji.
   Odpověď:
2. **Osa hlasů na začátku oddílu Proč to tak viděli** na všech osmi stránkách otázek, zároveň navigace na hlasy v seznamu; seznam pod ní beze změny kromě štítku „Tobě nejblíž“. Doporučuji.
   Odpověď:
3. **Měřítko osy:** v poměru let od prvního do posledního hlasu, dnešek za zlomem osy s počtem let. Doporučuji.
   Odpověď:
4. **Volba na ose:** jeden hlas nebo „Nikdo z nich“, bez pole pro důvod, do deníku jako stav bloku (jde změnit i zrušit); věty po volbě jen z dat; Tvoje antika ukáže volbu nad myslitelem seznamem u otázky. Doporučuji.
   Odpověď:
5. **Osa v přípravě hodiny** jako zastavení `<slug>-osa`, na plátně bez značky studenta a bez vět po volbě. Doporučuji.
   Odpověď:
6. **Přehrát život v kartě člověka:** zastávky z `kdeVRoce`, přehrání asi za deset vteřin se zastavením na každé zastávce, Předchozí a Další zastávka vždy, při omezeném pohybu bez přehrávání; jen lidé s aspoň dvěma místy. Doporučuji.
   Odpověď:
7. **Odkaz „Přehrát život na mapě“ z mini mapy na stránkách osob**, otevře mapu v roce narození s kartou a fokusem na Přehrát, bez samospuštění. Doporučuji.
   Odpověď:
8. **Žádná nová data v této větvi;** seznam tenkých tras v Po K2 jako podklad pro pozdější `atlas-data`. Doporučuji.
   Odpověď:
9. **Aristotelova hlavička a úprava designu mimo tuto větev.** Doporučuji.
   Odpověď:

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
