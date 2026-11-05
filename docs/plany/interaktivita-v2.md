# Plán větve interaktivita-v2: osa hlasů, Přehrát život a skill atlas-obdobi

Souhrnná revize antiky navrhla v oddílu Interaktivita sedm věcí (`docs/revize/antika-2026-10-25.md`, oddíl 12). Větev `interaktivita-v1` postavila čtyři, `antika-doplnky` deník na konci období (Tvoje antika). Zbyly dvě, které revize dala „před středověk“: **osa hlasů** na stránkách velkých otázek a **Přehrát život** na mapě. Tahle větev je postaví a k nim napíše skill `atlas-obdobi`, který plán středověku (P12) potřebuje. Větev založena z hlavní větve 5. 11. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: středověk přidá hlasy na stránky otázek a desítky lidí na mapu. Osa hlasů, která vznikne teď, dostane středověké hlasy sama, bez úprav osmi hotových stránek; Přehrát život potřebuje jen místa s rolí a časem, která skill `atlas-data` u nových lidí stejně vyplňuje.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| K1 | Osa hlasů: logika rozestupů a volby v `src/lib`, ostrov na začátku oddílu Proč to tak viděli na všech osmi stránkách otázek, zápis do deníku, Tvoje antika, zastavení v přípravě hodiny | Opus 5.5 · high (xhigh při zaseknutí) se skilly `atlas-komponenta` a `atlas-psani` | hotovo 5. 11. 2026 |
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

## Po K1

Hotovo 5. 11. 2026 (Opus 5.5). Osa hlasů stojí na všech osmi stránkách otázek; odpovědi autora 1 až 9 byly prázdné, tedy souhlas s doporučeními.

**Co jsem postavil**

- **Logika** `src/lib/osa-hlasu.ts`: poloha hlasu (polovina života, pruh, rok bez nuly), rozvržení pro tři šířky kresby (`rozlozeniOsy`: řádky mincí zleva, letopočty s érou jen u posledního roku př. n. l. a prvního n. l., zlom, „dnes“ a „asi N let“), věty po volbě (`vetyPoVolbe`), čtení a zápis volby (`volbaZeStavu`, stav bloku `otazka-<slug>-osa`) a texty na jednom místě (`OSA_HLASU`). Rok dneška je `ROK_DNES` v `src/lib/casy.ts`. Testy `tests/data/osa-hlasu.test.ts` (27) na všech osmi stránkách.
- **Ostrov** `src/components/ostrovy/OsaHlasu.svelte` s obalem `src/components/otazka/OsaHlasu.astro` na začátku oddílu Proč to tak viděli, pod nadtitulkem „Kdy žili“, v šířce širokého oddílu. Mince jsou odkazy na hlas v seznamu; pod osou výzva „Kdo z nich je ti nejblíž?“, tlačítko s mincí a jménem pro každý hlas a „Nikdo z nich“. Po volbě se mince vyplní, do pásu pod mincemi dojede značka „Ty“ s čárou k minci, pod tlačítky jsou dvě věty a Začít znovu; hlas v seznamu dostane štítek „Tobě nejblíž“ (`HlasyOsa.astro`).
- **Tvoje antika:** u otázky nad mysliteli z cest řádek „Na stránce otázky je ti nejblíž Epikúros.“ s mincí a důvodem z hlasu (`tvoje-obdobi.ts`, `TvojeObdobi.svelte`, katalog nese u otázky `hlasy`). Testy v `tests/data/tvoje-obdobi.test.ts`.
- **Příprava hodiny:** zastavení `b:<slug>-osa` (blok `OsaHlasu`, nadtitulek „Kdy žili“, jen celá podoba); na plátně osa a otázka bez tlačítek, značky a vět. `scripts/hodiny-katalog.mjs`: 531 zastavení, 0 chyb. Nový `scripts/katalog-rozdil.mjs` proti katalogu před K1: přibylo osm `b:<slug>-osa`, nic neubylo ani se nezměnilo; 42 hlasů má jen pořadí o jedno dál.
- **Testy v prohlížeči** `tests/e2e/osa-hlasu.spec.ts` (13): bez volby, volba, změna, obnovení, Začít znovu, Nikdo z nich, klávesnice, axe, 390, 768 a 1440 px ve světlém i tmavém režimu (nic se nepřekrývá, osa nevyjede), omezený pohyb, pohyb od dneška k minci, poškozený a smazaný deník, bez JavaScriptu, plátno, Tvoje antika. Upravené `otazky.test.ts` (klíč `osa`) a `hodiny.test.ts` (osa a pořadí hlasů).
- **Dokumentace:** `docs/design.md` (Velká otázka › Osa hlasů, Tvoje antika, tabulka podob), `docs/rozhodnuti.md` (5. 11. 2026), `docs/pouceni.md` (lokátor `svg:visible` chytí i mince v tlačítkách). Pomocný výpis rozvržení `scripts/osa-hlasu-rady.ts` (`npx vite-node scripts/osa-hlasu-rady.ts`).
- **Snímky:** `Claude outputs/osa-hlasu-k1.jpg` (telefon bez volby, s volbou, „Nikdo z nich“ v tmavém režimu, Tvoje antika; 768 px; 1440 px světlý a tmavý).

**Šablony vět, otázka „Kdo vlastně jsem?“ celá**

Po volbě hlasu (první věta podle hlasu, druhá je pro otázku stejná):

- Hérakleitos: „Od Hérakleita tě dělí asi 2 500 let. To je víc než 33 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.“
- Sókratés: „Od Sókrata tě dělí asi 2 400 let. To je asi 32 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.“
- Platón: „Od Platóna tě dělí asi 2 350 let. To je víc než 31 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.“
- Aristotelés: „Od Aristotela tě dělí asi 2 350 let. To je víc než 31 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.“
- Epikúros: „Od Epikúra tě dělí asi 2 300 let. To je víc než 30 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.“
- Epiktétos: „Od Epiktéta tě dělí asi 1 900 let. To je víc než 25 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.“
- Marcus Aurelius: „Od Marca Aurelia tě dělí asi 1 850 let. To je víc než 24 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.“
- Druhá věta: „Nejdál od sebe tu žili Hérakleitos a Marcus Aurelius. Dělí je asi 600 let. To je asi osm lidských životů.“
- Po „Nikdo z nich“: „Žádný z nich to nevidí jako ty. Tím spíš stojí za to napsat tvou odpověď vlastními slovy, dole v oddílu Změnil se?“ (odkaz na Změnil se?).
- Na ose: „dnes“ a „asi 1 850 let“; čtečka slyší „Hlasy na ose času v poměru let, od roku 540 př. n. l. do roku 180 n. l., a pak asi 1 850 let do dneška.“
- U hlasu v seznamu: „Tobě nejblíž“. V Tvoje antika: „Na stránce otázky je ti nejblíž Epikúros.“ (Hipparchie: „je ti nejblíž Hipparchia“.)

Vzdálenost do dneška se počítá od konce života (u Hipparchie od konce doby činnosti), od tisíce let zaokrouhleně na padesátky, a nese „asi“. Ženský hlas má „jako ona“, dvě ženy by „žily“.

**Nad čím jsem váhal a co jsem zvolil**

1. **Skok a volba.** Tlačítko pod každou mincí se na telefonu nevejde (sedm mincí na 230 jednotkách osy). Zvolil jsem mince jako odkazy na hlas a pod osou řadu tlačítek s mincí a jménem. Klávesnicí jde obojí, čtečka slyší odkaz „Epikúros, 341–270 př. n. l.“ a tlačítko „Epikúros“ se stavem stisknuto.
2. **Jména na telefonu.** S jmény pod mincemi by osa „Co je správné?“ měla na telefonu pět řádků. Úzká kresba je bez jmen; nesou je tlačítka se stejnou mincí hned pod osou. Od 520 px šířky obalu jména pod mincemi jsou.
3. **Tři kresby místo jedné přepočítané.** SVG v pevných šířkách stojí i bez JavaScriptu a po hydrataci nic neposkočí; přepočet podle šířky okna by obojí ztratil.
4. **„A přesto si odpovídají“** z plánu jsem vypustil: Hérakleitos s Markem Aureliem spolu nemluvili a věta by tvrdila rozhovor (pravidlo o spojovacích větách). Druhá věta jen říká, jak daleko od sebe žili.
5. **Tvoje antika a pád jména.** „Ses postavil k Epikúrovi“ chce 3. pád, který v datech není; odvozovat ho z 2. pádu by u dalších jmen selhalo (Tomáš Akvinský, Hildegarda). Zvolil jsem 1. pád: „Na stránce otázky je ti nejblíž Epikúros.“ U „Nikdo z nich“ v přehledu nic nestojí a otázku to samo nepřidá: řádek „nikomu ses nepřiblížil“ by zněl jako „chybí ti“.
6. **Kudy vede čára k „Ty“.** Mince v nižším řádku může ležet pod zvolenou. Čára jde za mincemi a pruhy a jména mají obrys v barvě papíru, takže čára text nepřetne; objeví se, až značka dojede.
7. **Plátno.** Na plátně zůstane osa a výzva; tlačítka by třídu svedla klikat místo hlasovat zvednutím ruky, proto jsou skrytá spolu se značkou a větami. Jiná podoba než celá osa nemá smysl.
8. **Pořadí v katalogu hodin.** Osa je na stránce nad hlasy, takže dostala pořadí 1 a hlasy o jedno dál. Uložené hodiny se nemění (pořadí se v nich neukládá).

Co by šlo jinak: jména i na telefonu (osa by byla vyšší), věty sčítat od narození studenta (nevíme ho), u „Nikdo z nich“ ukázat i druhou větu.

**npm test:** kontrola typů bez chyb, vitest 969 z 969, Playwright 699 ze 700. Spadl jen `cesta.spec.ts` › cesta4 · přehled a kroky · 390 px (ostrov se pod zátěží nehydratoval do 15 s; stránky otázek se netýká); samotný prošel třikrát po sobě.

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
