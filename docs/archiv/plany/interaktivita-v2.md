# Plán větve interaktivita-v2: osa hlasů, Přehrát život a skill atlas-obdobi

Souhrnná revize antiky navrhla v oddílu Interaktivita sedm věcí (`docs/revize/antika-2026-10-25.md`, oddíl 12). Větev `interaktivita-v1` postavila čtyři, `antika-doplnky` deník na konci období (Tvoje antika). Zbyly dvě, které revize dala „před středověk“: **osa hlasů** na stránkách velkých otázek a **Přehrát život** na mapě. Tahle větev je postaví a k nim napíše skill `atlas-obdobi`, který plán středověku (P12) potřebuje. Větev založena z hlavní větve 5. 11. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: středověk přidá hlasy na stránky otázek a desítky lidí na mapu. Osa hlasů, která vznikne teď, dostane středověké hlasy sama, bez úprav osmi hotových stránek; Přehrát život potřebuje jen místa s rolí a časem, která skill `atlas-data` u nových lidí stejně vyplňuje.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| K1 | Osa hlasů: logika rozestupů a volby v `src/lib`, ostrov na začátku oddílu Proč to tak viděli na všech osmi stránkách otázek, zápis do deníku, Tvoje antika, zastavení v přípravě hodiny | Opus 5.5 · high (xhigh při zaseknutí) se skilly `atlas-komponenta` a `atlas-psani` | hotovo 5. 11. 2026 |
| K2 | Přehrát život: zastávky života z `kdeVRoce`, oddíl v kartě člověka na mapě, přehrávání roku, odkaz ze stránek osob | Opus 5.5 · high se skillem `atlas-komponenta` | hotovo 5. 11. 2026 |
| S | Skill `atlas-obdobi`: postup plánu období podle architektury, poznámek z antiky a hotových šablon; `skills/atlas-obdobi/SKILL.md`, poznámky zapracované a smazané | Opus 5.5 · high | hotovo 6. 11. 2026 |
| R | Revize větve | Opus 5.5 · high se skillem `atlas-revize` | hotovo 6. 11. 2026 |
| O | Opravy po revizi a úprava skillů (`atlas-komponenta`, `atlas-cesta` › Stránka velké otázky, `atlas-data` › místa pro Přehrát život) | Opus 5.5 · high | hotovo 6. 11. 2026 |
| Uzavření | Schválení autorem, sloučení, push hlavní větve (nasadí web), kontroly na GitHubu zelené | Opus 5.5 · medium | hotovo 6. 11. 2026: schváleno, sloučeno a na GitHubu |

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
- **Platónova první cesta na Sicílii** (`rok: -387`) v Životě na mapě ani na mapě není: Akademie `od: -387` stojí v datech za ní a při shodě začátku vyhrává (Po O). Stačí v `lide.yaml` přesunout cestu za Akademii; je to změna dat osoby s portrétem, proto až se zadáním `atlas-data`.
- **`od` u tří pobytů jen s „do“** (Seneca v Římě, Epiktétos v Římě, Anaxagorás v Athénách), kde ho pramen dává; pravidlo z kroku O pak zůstane jen jako náhrada.
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

## Po K2

Hotovo 5. 11. 2026 (Opus 5.5). Přehrát život stojí v kartě člověka na mapě a odkaz na něj pod mini mapou na stránkách osob; odpovědi autora 6 až 8 byly prázdné, tedy souhlas s doporučeními.

**Co jsem postavil**

- **Logika** `src/lib/zivot-na-mape.ts`: zastávky z `kdeVRoce` rok po roku (`zastavkyZivota`), kdo oddíl má (`maZastavky`, aspoň dvě různá místa), aktuální, předchozí a další zastávka (přes rok nula), plán přehrávání (`planPrehravani`, `rokVCase`, `casProRok` pro pokračování po Zastavit), řádek a oznámení zastávky a texty na jednom místě (`ZIVOT_NA_MAPE`). Testy `tests/data/zivot-na-mape.test.ts` (20): Aristotelés, Epikúros, Platón, Sókratés, Seneca přes přelom letopočtu, člověk jen s dobou činnosti, Hérakleitos a Hipparchia bez oddílu, nejistý pobyt (Prótagorás), Plótínos, plán a adresa.
- **Karta člověka** (`KartaCloveka.svelte`): oddíl Život na mapě pod boxem „V roce …“. Nahoře Předchozí, Přehrát (během běhu Zastavit) a Další, pod nimi svislá linka zastávek; prošlé plné, aktuální větší s názvem v barvě období. Seznam je jedna zastávka tabulátoru se šipkami, Předchozí a Další mají na krajích života `aria-disabled`. Oblast `aria-live` oznamuje jen příchod na jinou zastávku.
- **Přehrávání** v `MapaACas.svelte` (`requestAnimationFrame`): rok přes posuvník, řeku i mapu, období člověka drží kameru. První posun založí jeden záznam historie, pak se adresa jen přepisuje (nový režim `prehravani` v `zapisAdresy`, nejvýš pětkrát za vteřinu). Zastaví ho posuvník i tažení okna, pás období, jiný člověk, zavření karty, zastávka, Předchozí, Další, Zpět a zapnutí omezeného pohybu. Testy zkracují čas přes `window.atlasPrehravani`.
- **Adresa:** `StavAdresy.zivot` (`zivot=1`, jen s osobou). Mapa příznak přečte, dá fokus na Přehrát (při omezeném pohybu na Další zastávka) a smaže ho z adresy.
- **Stránky osob:** v Době a lidech pod mini mapou obrysový odkaz „Přehrát život na mapě“ (`DobaALide.astro`, adresa ze `zapisAdresu`), jen u lidí se zastávkami.
- **Testy v prohlížeči** `tests/e2e/zivot-na-mape.spec.ts` (12): zastávky a klepnutí, Předchozí a Další s historií, klávesnice v seznamu a Seneca přes rok nula, Přehrát do konce (rok jen roste, projde všemi zastávkami, jeden záznam historie, Zpět), Zastavit a pokračování, posuvník, jiný člověk a zavření karty, odkaz ze stránky osoby (rok, karta, fokus, nic se nespustí, mezerník spustí), omezený pohyb na telefonu, člověk s jediným místem, axe a rozměry na 390 a 1440 px ve světlém i tmavém režimu, odkaz pod mini mapou. Ostatní testy kvůli novému oddílu upravovat nebylo třeba.
- **Skripty:** `scripts/zivot-na-mape-vypis.ts` (kdo oddíl dostane a čí trasa je tenká; `npx vite-node scripts/zivot-na-mape-vypis.ts --podrobne` vypíše i zastávky) a `scripts/snimky-zivot-na-mape.mjs` (snímky celé obrazovky s kartou posunutou na oddíl; `snimky-prvek.mjs` na telefonu uřízne oddíl posuvným panelem).
- **Dokumentace:** `docs/design.md` (Mapa a čas › Život na mapě), `docs/rozhodnuti.md` (5. 11. 2026, K2), `docs/pouceni.md` (`onDestroy` běží i při sestavení; `vizualne-skryte` v posuvném panelu bez umístěného předka protáhne stránku).
- **Snímky:** `Claude outputs/zivot-na-mape-k2.jpg` (1440 světlý; během přehrávání v tmavém; telefon světlý a s omezeným pohybem v tmavém; odkaz pod mini mapou Aristotela na 390 a 1440 px).

**Kdo oddíl dostane (27 z 50, výpis skriptu)**

Sókratés (7 zastávek), Platón (5), Aristotelés (8), Pýthagorás (4), Prótagorás (4), Xenofanés (2), Anaxagorás (4), Gorgiás (4), Konfucius (2), Eudoxos (2), Aristippos (2), Alkibiadés (5), Xenokratés (2), Diogenés (3), Epikúros (5), Seneca (3), Epiktétos (2), Marcus Aurelius (3), Zénón z Kitia (2), Chrýsippos (2), Plútarchos (2), Plótínos (3), Kratés (2), Kleanthés (2), Musonius Rufus (3), Theofrastos (3), Karneadés (4).

Bez oddílu (jedno místo za život): Thalés, Hérakleitos, Parmenidés, Démokritos, Zénón z Eleje, Anaximandros, Anaximenés, Empedoklés, Aspasie, Xenofón, Archytás, Isokratés, Antisthenés, Chairefón, Kritón, Aristofanés, Speusippos, Pyrrhón, Lucretius, Cicero, Hypatia, Hipparchia, Filón Alexandrijský.

**Tenké trasy** (žádné místo s časem kromě rodiště a místa smrti), podklad pro `atlas-data` se zdrojem: Xenofanés, Konfucius, Eudoxos, Aristippos, Diogenés, Kratés. Jejich druhá zastávka vzniká jen pravidlem „od osmnácti“, proto v kartě nemá rok ani věk. Totéž platí o jedné zastávce u Prótagora (první příchod do Athén), Anaxagora (Lampsakos), Theofrasta (Assos), Musonia (Řím) a Karneada (Athény). Za doplnění by stály i životy, které z dat vycházejí chudší než z pramenů: Platónova první cesta na Sicílii (kolem 388 př. n. l.) a Senekovo mládí v Římě (Řím má v datech jen „do 41“, takže Seneca jde rovnou z Cordoby na Korsiku).

**Nad čím jsem váhal a co jsem zvolil**

1. **Rok a věk u odvozené zastávky.** Pravidlo mapy přesune člověka na působiště bez času v osmnácti. Karta by pak tvrdila „Athény · působení · asi 472 př. n. l. · asi 18 let“, ale tohle data neříkají. Zvolil jsem jen místo a roli („Athény · působení“) a v oznámení „Athény, působení.“. V přehrávání se na ní rok zastaví jako jinde, protože tam člověka ukazuje i mapa.
2. **„Asi“ u návratu.** Návrat do rodiště hned po pobytu s časem (Sókratés z Potidaie, Gorgiás z Athén) má rok jistý, i když místo samo čas nemá. „Asi“ nese jen první zastávka u přibližného narození a věk u přibližného narození.
3. **Ovládání nad seznamem, ne pod ním.** Na telefonu je karta v posuvném panelu pod mapou a pod osmi zastávkami by Přehrát nikdo neviděl. Nahoře je hned pod nadpisem a student během přehrávání vidí mapu i tlačítko Zastavit.
4. **Historie.** „Na konci přibude jeden záznam“ jsem udělal tak, že záznam založí první posun roku a přehrávání ho pak přepisuje. Kdyby se záznam přidal až na konci, přepisování by smazalo výchozí stav a Zpět by vedlo doprostřed života.
5. **Pokračování po Zastavit.** Přehrát pokračuje z roku, kde přehrávání stojí; na zastávce postojí znovu, z roku smrti jede od narození. Začínat vždy od narození by zastavení dělalo zbytečným.
6. **Kamera.** Mapa má výřez podle období a kamera se hýbe jen mezi obdobími. „Drží člověka v záběru“ proto znamená, že přehrávání drží období člověka, dokud rok leží v jeho okně (Aristotelés zůstane v Řecku i po roce 350 př. n. l.). Místo mimo výřez ukáže štítek u okraje, jako dosud.
7. **Plótínos v Alexandrii.** V roce narození ho data ukazují v Alexandrii, kde studoval (rodiště v datech není). Řádek proto nemá „narodil se“, jen „studium · asi 204 n. l.“.

Co by šlo jinak: zastávky na mapě jako tečkovaná trasa celého života (dnes jen poslední přesun), oddíl rozbalovací kvůli délce karty na notebooku, rychlost přehrávání podle délky života místo pevných deseti vteřin.

**npm test:** kontrola typů bez chyb, vitest 989 z 989, Playwright 711 ze 712. První běh chytil skutečnou chybu: skrytá oblast `aria-live` v kartě protáhla stránku Mapy a času na telefonu o 486 px (deset testů `mapa.spec.ts`); oprava v kartě, nový test to hlídá. Ve druhém běhu spadl jen `cesta.spec.ts:88` (průchod cesty 1): kresba Šaty v kroku 6 má při načtení nulovou výšku, takže se `client:visible` někdy nespustí. Padá i samotný, asi jednou ze čtyř, a mapy ani stránek osob se netýká; nález pro revizi R.

## Po S

Hotovo 6. 11. 2026 (Opus 5.5). Skill `atlas-obdobi` je ve `skills/atlas-obdobi/`: `SKILL.md` (102 řádků) a `references/kontrola-planu.md`. Poznámky jsou zapracované a `poznamky.md` je smazaný. Kód ani data se neměnily; žádný test ani skript `skills/` ani `poznamky.md` nečte (grep v `tests`, `scripts`, `src`, `.github`, `package.json`), testy proto neběžely.

**Co skill obsahuje**

- **Výstup P12:** `docs/plany/<slug>.md` ve tvaru plánu větve, řádek v `docs/plan.md`, rozhodnutí v `docs/rozhodnuti.md`; každý celek pak dostane vlastní větev a plán.
- **Postup v osmi krocích** s tím, které oddíly architektury číst a co vypsat z repozitáře místo čtení stránek.
- **Oddíly:** Lidé a hloubky (nová osoba jen se souhlasem autora, protihlas z jiné tradice, ženy jako plné hlasy), Otázky doby, cesty a celky (vyváženost, jiná stavba a nové bloky, úvody a závěry napříč, délka, otázky bez cesty, pokusy), Mapa, čas a data (výřez, kotvy, místa s časem pro Přehrát život, hlasy na ose hlasů), Náboženství doby a Mezitím jinde, Stránky ze šablon (období, směry, anekdoty, Tvoje <období>), Pohyblivá myšlenka, Kdy je plán hotový, Tvar plánu (osm částí), Na které skilly plán navazuje.
- **Reference** `kontrola-planu.md`: kontrolní seznam po oblastech, příkazy k výpisu, antika jako ukázka (tabulka čísel ověřená výpisem 6. 11. 2026), co doplnila `antika-doplnky` a nálezy souhrnné revize převedené na body plánu.
- **Odkazy:** CLAUDE.md › Workflow a skilly (všech osm skillů je ve `skills/`), `docs/plan.md` (řádek `atlas-obdobi`, řádek P13 a řádek této větve v rozcestníku; i v Projektu Claude), `docs/pouceni.md` (odkaz na poznámky vede na skill).

**Kam šly poznámky** (15 bodů)

| Poznámka | Kam |
| --- | --- |
| Stavba cest | SKILL › Otázky doby, cesty a celky › Jiná stavba; reference › Otázky a cesty |
| Protihlas z jiné tradice | SKILL › Lidé a hloubky; reference › Lidé |
| Vyváženost otázek | SKILL › Vyváženost; reference › Otázky a cesty |
| Délka | SKILL › Délka; reference › Otázky a cesty |
| Úvody a závěry napříč | SKILL › Úvody a závěry napříč; reference spolu s nálezy 1 a 2 souhrnné revize |
| Interaktivita v plánu | SKILL › Pohyblivá myšlenka a Hotové bloky (Slož argument pro cestu 9 už stojí); reference › Interaktivita |
| Šablony od začátku (úvod oddílu z `antika-doplnky`) | SKILL › Stránky ze šablon, úvodní věta; reference › Co po celcích chybělo |
| Šablona období | SKILL › Stránka období; kotvy, rok a osoba v Mapa, čas a data; otázky doby v Otázky doby |
| Scéna období | SKILL › Stránka období |
| Směry | SKILL › Směry a Anekdoty a citáty |
| Náboženství doby | SKILL › Náboženství doby; odkaz na otázku 9 v Otázka bez cesty v období |
| Myšlenkové pokusy | SKILL › Myšlenkové pokusy |
| Stránky otázek bez cesty | SKILL › Otázka bez cesty v období |
| Přehled období v deníku | SKILL › Přehled období v deníku |
| Mezitím jinde | SKILL › Mezitím jinde |

**Nad čím jsem váhal a co jsem zvolil**

1. **Kde žije plán období.** Plán i architektura znají jen plány větví. Zvolil jsem `docs/plany/<slug>.md` ve stejném tvaru, s celky jako budoucími větvemi; každý celek pak dostane vlastní plán. Šlo by i jako oddíl v `docs/plan.md`, ten je ale už teď dlouhý a Projekt Claude ho drží celý.
2. **Co do SKILL a co do reference.** Postup a pravidla jsou ve SKILL, kontrolní seznam a čísla antiky v referenci: čísla zastarají a v referenci je jde přepočítat bez sahání na postup.
3. **Strop hlasů na ose.** K1 má nejvíc sedm hlasů a ve středověku se osa natáhne o tisíc let. Pevný strop jsem nedal; skill chce nad sedm hlasů nebo přes tisíc let rozpětí výpis rozvržení (`scripts/osa-hlasu-rady.ts`) a kontrolu na 390 px v revizi celku. Strop rozhodne revize středověku, jak říká Nad čím jsem váhal.
4. **Prázdná odpověď u nových osob.** Nové osoby smí podle CLAUDE.md rozhodnout jen autor, proto u nich prázdná odpověď souhlas není, stejně jako u sloučení, GitHubu, obrázků a mazání.
5. **Datum.** Zadání chtělo „Hotový 5. 11. 2026“; skill vznikl 6. 11., proto je v `docs/plan.md` 6. 11. 2026.
6. **Výpis dat.** Python na Macu nemá modul `yaml` a skript mimo repozitář nenajde `js-yaml`; reference proto radí krátký skript ve `scripts/`, který se po výpisu smaže (tak vznikla čísla antiky).

Co by šlo jinak: ukázka hotového plánu období jako druhá reference (vymyšlený středověk by ale P12 jen opsal), nebo inventura období jako stálý skript ve `scripts/` (kód, který tenhle krok psát neměl).

## Po R

Hotovo 6. 11. 2026 (Opus 5.5) se skillem `atlas-revize`. **Verdikt: po opravách** (záznam `docs/archiv/revize/interaktivita-v2-2026-11-06.md`). Osa hlasů na všech osmi stránkách, volba, změna, „Nikdo z nich“, obnovení, Začít znovu, Tvoje antika, Přehrát život i odkaz ze stránky osoby fungují; nálezy jsou v tom, co ukazují data, a v letopočtech.

**Nálezy**

1. **[blokující] Místo jen s „do“ platí jen v jediném roce:** Epiktétos v Životě na mapě nikdy není v Římě, Seneca jde z Cordoby rovnou na Korsiku a Anaxagorás odchází do vyhnanství dřív, než přijde do Athén (pravidlo v `kdeVRoce`).
2. **[důležité] Osa hlasů na telefonu nemá letopočet n. l.:** na šesti stránkách stojí Epiktétos a Marcus Aurelius za značkou „250 př. n. l.“ bez popisku.
3. **[důležité] Zastávky ztrácejí „asi“:** karta Aristotela píše „Athény · studium · 367 př. n. l. · 17 let“, mini mapa na jeho stránce u téhož „asi 367“.
4. **[důležité] Návrat domů má roli „rodiště“:** Sókratés má třikrát „Athény · rodiště · 431 př. n. l. · 38 let“.
5. **[důležité] Skill `atlas-obdobi` nevidí dluh antiky vůči architektuře:** 11 profilů bez stránky, buddhismus, čínská tradice a dva pokusy; plán středověku by je přeskočil.
6. **[drobné] Průchod cesty 1 padal na plynulém posunu stránky:** `scrollTo` se za 40 ms posune o 11 px a `scrollIntoView` na ostrovu s `display: contents` nedělá nic; v `cesta.spec.ts` opraveno, šest dalších souborů má stejnou smyčku.
7. **[drobné] Druhá věta po volbě:** „asi 376 let“ bez zaokrouhlení a podruhé „To je … lidských životů“.
8. **[drobné] Popis osy pro čtečku bez „asi“** u přibližného roku.
9. **[drobné] Mini mapa a karta jmenují role jinak** („studia“ × „studium“, „válečné“ × „vojenské tažení“).
10. **[drobné] Rozhodnutí kroku S chybí v `docs/rozhodnuti.md`.**

**Opraveno rovnou:** „napsat tvou odpověď“ → „napsat svou odpověď“ ve větě po „Nikdo z nich“ (`osa-hlasu.ts`, test, `docs/design.md`; v Po K1 výš zůstává původní znění); příprava stránky v `tests/e2e/cesta.spec.ts` s `behavior: 'instant'` a posunem prvního potomka ostrova (průchod cesty 1 čtyřikrát souběžně bez chyby). Nový skript `scripts/revize-osa-hlasu.mjs` (osa na třech stránkách bez volby, s volbou, se změnou, s „Nikdo z nich“ a po obnovení; Tvoje antika). Snímky jsou v `Claude outputs/revize-interaktivita-v2/`.

**Nad čím jsem váhal**

- Nález 1 je starší než větev (mapa ho měla), ale Život na mapě z něj dělá vyprávění. Za blokující ho mám, protože student čte opak toho, co se stalo, a oprava je malá.
- Pravidlo, nebo data: doplnit `od` ke třem místům by chtělo zdroj u každého a nová data se podle rozhodnutí z 2. 10. 2026 zatím nepřidávají. Pravidlo „s do bez od platí od osmnácti“ dělá, co „do“ znamená, a opraví i místa, která přibudou.
- „Zpátky doma“ místo „návrat“ (zní jako cesta) nebo „doma“ (u Sókrata po čtyřiceti letech v Athénách divné samo).
- `kontrola-fokus.mjs` hlásí na Mapě a čase překryvy; na telefonu jsou to prvky karty odrolované z posuvného panelu (Hérakleitos bez oddílu jich má sedm), na notebooku značky a kotvy mimo větev. Nepočítám je jako nález.

**npm test:** kontrola typů bez chyb, vitest 989 z 989, Playwright 712 z 712 (6,8 min), včetně průchodu cesty 1.

### Co rozhodnout po R

Prázdná odpověď znamená souhlas s doporučením.

1. **Místa s „do“ a bez „od“ opravit pravidlem:** pobyt platí od osmnácti let (nebo od konce předchozího pobytu s časem) do roku „do“, beze změny dat. Doporučuji.
   Odpověď:
2. **Osa hlasů:** na každé ose přes přelom letopočtu značka „1 n. l.“, sousední značky blíž než šest písmen odpadnou, každá kresba aspoň dvě značky. Doporučuji.
   Odpověď:
3. **„Asi“ u zastávek** z přibližného pobytu a u návratu po něm, i u věku („Assos · pobyt · asi 347 př. n. l. · asi 37 let“). Doporučuji.
   Odpověď:
4. **Návrat do rodiště jako „zpátky doma“** („Athény · zpátky doma · 431 př. n. l. · 38 let“); první zastávka zůstává „rodiště · … · narodil se“. Doporučuji.
   Odpověď:
5. **Dluh předchozího období ve skillu `atlas-obdobi`:** nový bod v Postupu, krok 1, a oddíl „Co antika proti architektuře ještě nemá“ v referenci. Co s dluhem antiky udělat (dodělat před středověkem, souběžně, nebo později), bude první otázkou plánu středověku (P12), ne téhle větve. Doporučuji.
   Odpověď:
6. **Drobné nálezy 6 až 10 v kroku O:** společná příprava stránky v `tests/e2e/strany.ts` pro sedm souborů, jedna zaokrouhlená věta „Nejdál od sebe tu žili Aristotelés a Epiktétos: dělí je asi 380 let.“, „asi“ v popisu osy, jeden slovník rolí („studium“, „vojenské tažení“), záznam S v `docs/rozhodnuti.md`. Doporučuji.
   Odpověď:

## Po O

Hotovo 6. 11. 2026 (Opus 5.5). Odpovědi 1 až 6 po R byly prázdné, tedy souhlas s doporučeními. Opravených je všech deset nálezů; rozhodnutí jsou v `docs/rozhodnuti.md` (6. 11. 2026, krok O, a zpětně krok S).

**Co je opravené**

- **Nález 1, pobyt jen s „do“** (`kdeVRoce` a nová `zacatekPobytuDo` v `src/lib/cas-mapy.ts`): pobyt platí od osmnácti let, nebo od konce předchozího pobytu s časem, je-li pozdější, až do roku „do“; u člověka bez rodiště v datech od narození. Epiktétos: Hierapolis → Řím → Níkopolis (asi 93). Seneca: Corduba → Řím → Korsika (41) → Řím (49). Anaxagorás: Klazomeny → Athény → Lampsakos (asi 435). Příchod je odvozená zastávka (jen místo a role) a mapa k němu nekreslí tečkovanou cestu (`prichodOdvozeny`). Na mapě se změnili jen tihle tři: Seneca je v Římě od 18 n. l., Epiktétos asi od 73 n. l., Anaxagorás v Athénách asi od 482 a v Lampsaku od asi 435 př. n. l. Čtvrté takové místo, Epikúrův Samos, platí od narození jako dosud. Ostatní volání `kdeVRoce` (`Mapa`, `Reka`, `MapaACas`, karta) berou jen místo a roli.
- **Nález 2, letopočty na ose hlasů** (`znackyLet` v `src/lib/osa-hlasu.ts`): osa přes přelom má na každé šířce „1 n. l.“ s předností před sousedy; sousedé blíž než šest písmen nebo s popisky blíž než dvě písmena odpadnou. Na telefonu teď stojí „400 př. n. l. | 1 n. l.“ (Kdo vlastně jsem?, Co je správné?, Jak spolu máme žít?), „300 př. n. l. | 1 n. l.“ (Jsem svobodný?, Má život smysl?) a „400 | 200 př. n. l. | 1 n. l.“ (Jak mám žít?). Test na všech osmi stránkách a třech šířkách hlídá „1 n. l.“, rok př. n. l. a aspoň dvě značky.
- **Nález 3, „asi“ u zastávek:** `kdeVRoce` vrací u pobytu `priblizne` a `zacatek`; zastávka má „asi“, když její rok pochází ze začátku přibližného pobytu, kam člověk přišel, nebo z konce přibližného pobytu, odkud se vrátil, a věk u takového roku také. Aristotelés: „Athény · studium · asi 367 př. n. l. · asi 17 let“, „Assos · pobyt · asi 347 př. n. l. · asi 37 let“, „Stageira · zpátky doma · asi 340 př. n. l. · asi 44 let“, „Athény · působení · 335 př. n. l. · 49 let“. Oznámení pro čtečku totéž.
- **Nález 4, „zpátky doma“:** návrat do rodiště má tuhle roli v řádku i v oznámení („Athény, zpátky doma, 431 př. n. l., 38 let.“); první zastávka zůstává „rodiště · … · narodil se“.
- **Nález 6, příprava stránky v testech:** `projedStranku` a `pripravitStranku` v `tests/e2e/strany.ts` (okamžitý posun, ostrov do okna přes prvního potomka, čekání na hydrataci 15 s); používají je `cesta`, `cesta3`, `cesta4`, `cesta5`, `cesta8`, `pruchod` a `prohlidka` (ten jen projetí) a `pripravitKrok` cest se stranami je teď totéž.
- **Nálezy 7 a 8:** druhá věta po volbě je jedna a zaokrouhlená („Nejdál od sebe tu žili Aristotelés a Epiktétos: dělí je asi 380 let.“, u Jak mám žít? „Diogenés a Seneca: … asi 320 let“); popis osy pro čtečku „od roku asi 540 př. n. l. do roku 180 n. l.“.
- **Nález 9, slovník rolí:** `ROLE_MISTA` a `ROLE_UDALOSTI` v `src/lib/cas-mapy.ts`; karta člověka a Život na mapě berou první, mini mapa druhý („studium“, „vojenské tažení“; u místa s rokem „narození“ a „smrt“).
- **Nález 10:** záznamy S a O v `docs/rozhodnuti.md`.
- **Nález 5 a skilly** (kopie ve `skills/`, autor je uloží do účtu Claude): `atlas-obdobi` (Postup, krok 1: Dluh předchozího období; Směry „ve středověku třeba patristika a scholastika“; reference: „vlastní stránku má 13 z 24 portrétů a profilů“ a oddíl Co antika proti architektuře ještě nemá s 11 profily, buddhismem a čínskou tradicí a dvěma pokusy), `atlas-komponenta` (tři pasti: osa přes přelom na každé šířce, „asi“ cestou přes logiku, ostrov s `display: contents`), `atlas-cesta` › Stránka velké otázky (osa hlasů a výpis `osa-hlasu-rady.ts`), `atlas-data` (nový oddíl Místa pro Přehrát život). Dvě poučení v `docs/pouceni.md`.
- **Dokumentace:** `docs/design.md` › Osa hlasů a Život na mapě.
- **Testy:** nové a upravené v `tests/data/cas-mapy.test.ts` (Seneca v roce 20 v Římě, „asi“ z dat), `zivot-na-mape.test.ts` (trasy Epiktéta, Seneky, Anaxagora a Epikúra, „asi“ u Aristotela, „zpátky doma“ u Sókrata), `osa-hlasu.test.ts`, `mini-mapa.test.ts`; v prohlížeči `zivot-na-mape.spec.ts` (nový test Epiktéta, Seneca se čtyřmi zastávkami), `osa-hlasu.spec.ts`, `mini-mapa.spec.ts`.
- **Snímky** v `Claude outputs/oprava-interaktivita-v2/`: osy tří stránek bez volby, s volbou, se změnou a s „Nikdo z nich“ (390 světlý, 1440 tmavý; skript `revize-osa-hlasu.mjs`), přehled `osa-390.jpg`; karty Epiktéta (80 n. l.), Seneky (20 n. l.), Sókrata (431 př. n. l.) a Aristotela (340 př. n. l.) na 390 a 1440 px ve světlém i tmavém režimu, přehledy `karty-390.jpg` a `karty-1440.jpg`. Skript `snimky-zivot-na-mape.mjs` dostal proměnnou `OSOBY` (`OSOBY=epiktetos:80,seneca:20`).

**Nad čím jsem váhal a co jsem zvolil**

1. **Přednost přelomu nestačila.** Na úzké kresbě Co je správné? by po ní zbyla jediná značka „1 n. l.“: „250 př. n. l.“ je k ní moc blízko a „500“ leží před začátkem měřítka. Doplnil jsem náhradu: když osa přes přelom nemá žádný rok př. n. l., dostane nejstarší kulatou stovku, která se vejde. Jiný kulatý krok jen pro úzkou kresbu by přeskládal i stránky, které byly v pořádku.
2. **Konec předchozího pobytu** beru jen u pobytů s „od“ nebo „do“, ne u jednoročních (`rok`, vojenské tažení): krátká cesta nemá určovat, odkdy člověk někde žil. V datech zatím žádný pobyt s „do“ začátek z předchozího pobytu nebere; všechny tři začínají v osmnácti.
3. **„Asi“ u návratu podle toho, odkud se člověk vrací.** Platón je v Athénách „asi 365“ (po přibližné cestě 366), ale „360“ bez „asi“ (po přesné cestě 361), přestože Akademie má v datech `priblizne`: rok návratu pochází z konce cesty, ne ze začátku Akademie.
4. **„Zpátky doma“ i v oznámení pro čtečku.** U ostatních zastávek role v oznámení není (jako dosud); bez ní by „Athény, 431 př. n. l., 38 let.“ zněla jako další pobyt.
5. **Mini mapa si „narození“ a „smrt“ nechává** (popisek u místa s rokem je událost), ostatní role jsou společné s kartou.
6. **Platónova první cesta na Sicílii** (`rok: -387`) v zastávkách není: Akademie `od: -387` stojí v datech za ní a při shodě začátku vyhrává. Je to pořadí v datech osoby s portrétem, proto jsem data neměnil; zapsané v Co zůstává na později a ve skillu `atlas-data`.

Co by šlo jinak: doplnit `od` ke třem pobytům se zdrojem místo pravidla; u „Nikdo z nich“ ukázat i větu o vzdálenosti; na telefonu ukázat na ose i rok n. l. za přelomem, kde se vejde.

**npm test** (jednou na konci, `/tmp/atlas-test-o.log`): kontrola typů bez chyb, vitest 995 z 995, Playwright 713 z 713 (6,8 min), včetně průchodů cest se společnou přípravou stránky. Předtím dotčené soubory v prohlížeči zvlášť: 258 z 258.

### Co rozhodnout po O

Tady prázdná odpověď souhlas není: sloučení do hlavní větve a push na GitHub rozhoduje jen autor.

1. **Schvaluješ větev `interaktivita-v2`** (osa hlasů, Přehrát život, skill `atlas-obdobi` a opravy po revizi) ke sloučení do hlavní větve a k poslání na GitHub, čímž se nasadí web?
   Odpověď: Ano, schvaluji (6. 11. 2026, v chatu Uzavření).

## Po uzavření

Hotovo 6. 11. 2026 (Opus 5.5). Autor větev schválil, sloučení `--no-ff` do hlavní větve, celé `npm test` v hlavní větvi zelené (kontrola typů bez chyb, vitest 995 z 995, Playwright 713 z 713). Plán, záznam revize a zadání jsou v `docs/archiv/`, řádek větve v `docs/plan.md`.
