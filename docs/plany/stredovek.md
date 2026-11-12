# Plán středověku (P12)

Plán 3. období, Středověk (400–1450), podle `docs/architektura.md` a skillu `atlas-obdobi`. Předem rozhoduje, co z architektury vznikne, v jakém pořadí a z jakých šablon: pět celků (11 až 15), vlnu medailonků, okno do Asie, souhrnnou revizi a hodinu se studenty. Plán nepíše studentský text a nemění kód ani data. Založen 6. 11. 2026 po uzavření větve `interaktivita-v2` na pokyn autora „připrav se na další celek“.

**Proč teď.** Antika je uzavřená, zveřejněná a skill `atlas-obdobi` je hotový. Středověk má jinou zátěž než antika: v datech z něj není ani jeden člověk, architektura mu dává jen čtyři cesty, zato jedenáct stránek osob, a víra a rozum v něm nejsou okrajové téma, ale jádro.

## Kroky

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| `design-v2` | Úprava designu před středověkem: styl scrapbooku s prvky neumorfismu, krátké vysvětlení pojmu po najetí na slovo (`docs/plany/design-v2.md`) | Opus 5.5 · high se skilly `frontend-design` a `atlas-komponenta`; ladí se společně s autorem | běží: D1 až K3 hotové 7. až 9. 11. 2026; po auditu přibyly D5, K3 dodatek, K4a a K4b, K7a a K7b (12. 11. 2026) |
| `herna-v1`, `denik-v2`, `film-0`, `uklid-v1` | Po auditu (oddíl Po auditu): knihovna nových aktivit, deník se sbírkou a kvízem, zkouška filmu (zvuk později), úklid skillů a plánů s pravidly pestrosti | podle `docs/plan.md` › Plány větví | čeká; před celkem 11 |
| Z | Odpovědi k tomuto plánu, větev a plán celku 11 se zadáním P6 | Opus 5.5 · medium | čeká na odpovědi; celek 11 začne po `uklid-v1` |
| `celek-11` | „Proč dělám, co nechci?“: portrét Augustina, cesta 10, stránka období Středověk, křesťanství, blok Úryvek s otázkou | P6 Opus 5.5 · high s vyhledáváním (`atlas-overeni`), P6N Opus 5.5 · high, K Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta`, P7 Opus 5.5 · high (`atlas-osobnost`, `atlas-psani`), P8 Opus 5.5 · high (`atlas-cesta`, `atlas-psani`), R a O Opus 5.5 · high (`atlas-revize`), Uzavření Opus 5.5 · medium | čeká |
| `celek-12` | „Kde je štěstí, když o všechno přijdu?“: profily Boëthia a Hildegardy z Bingenu, cesta 12, stránka otázky 10, blok Dialog, kresba Kolo Štěstěny | jako celek 11 | čeká |
| `antika-dluh` | Co antika dluží architektuře: devět profilů a pokusy Achilleus a želva a Karneadova deska | P6 Sonnet 5.5 · high s vyhledáváním, P7 Opus 5.5 · medium, K Opus 5.5 · high, R a O Opus 5.5 · high | čeká na odpověď 1 |
| `celek-13` | „Může rozum dokázat Boha?“: profily Anselma z Canterbury a Viléma Ockhama, portrét Tomáše Akvinského, cesta 9, stránka otázky 9 | jako celek 11 | čeká |
| `celek-14` | „Co když si víra a rozum odporují?“ (nová cesta 36): profily Avicenny, Averroa a Maimonida, islám, směr islámská filozofie, pokus Létající člověk | jako celek 11 | čeká na odpověď 3 |
| `celek-15` | „Smím neposlechnout, když mi to zakazuje svědomí?“: profil Jana Husa, společný portrét Abeláda a Héloïsy, cesta 11, směr scholastika, Tvoje středověk | jako celek 11 | čeká |
| `medailonky-stredovek` | Vlna medailonků (P9): Eriugena, Roger Bacon, Duns Scotus, Mistr Eckhart, Buridan s oslem, Christine de Pizan s hlasem na otázce 8 | Sonnet 5.5 · medium se skillem `atlas-data`; sporné prameny Opus 5.5 · high s `atlas-overeni` | čeká |
| `jinde-asie` | Okno Mezitím jinde s vloženou mapkou: buddhismus, čínská tradice, hinduismus a Šankara | P6N Opus 5.5 · high, K Opus 5.5 · high, texty Opus 5.5 · high | čeká na odpověď 1 |
| `revize-stredoveku` | P11 souhrnná revize období, P13 úprava skillů | P11 Fable 5.2 · high, P13 Opus 5.5 · high | čeká |
| Hodina | Jedna skutečná hodina nebo průchody se studenty (cesty 10 a 11) | autor | čeká, až autor bude mít studenty |

**Proč v tomhle pořadí**

- **Celky jdou podle doby příběhu:** Augustin v zahradě v Miláně (386), Boëthius ve vězení (524), Anselmův Proslogion (1078), Averroes před chalífou (asi 1169), Hus v Kostnici (1415). Mapa, osa a Doba a lidé se plní popořadě a každý celek má z čeho skládat: Augustin je v datech dřív než Boëthius, Avicenna dřív než Averroes, Tomáš dřív než Hus.
- **První dvě cesty mají jinou stavbu než antika.** Augustinova Vyznání se nejlíp čtou z textu (Úryvek s otázkou) a Boëthiova Útěcha filozofií je sama rozhovor (Dialog). Oba bloky vzniknou v kroku K dřív, než se napíše další cesta stavby antiky.
- **Design před středověkem** (rozhodnutí autora z 1. 11. a 7. 11. 2026): stránka období, Úryvek s otázkou, Dialog, Kolo Štěstěny i texty s pojmy vzniknou rovnou v novém stylu a nebudou se předělávat; středověk je na pojmy bohatý (univerzálie, scholastika, důkaz z pojmu).
- **Dluh antiky mezi celky 12 a 13:** profily jsou lehčí než cesty a mohou použít nové bloky. Plótínos a Hypatia navazují na Augustina a Boëthia, kteří už budou mít stránku.
- **Medailonky až po celcích** (vznikají hromadně), okno do Asie před souhrnnou revizí, aby ho revize viděla.

## Co už atlas má (6. 11. 2026)

Výpis z repozitáře (`ls src/content/*/`, výpis dat skriptem s `js-yaml`):

- **Lidé:** 50, všichni z období 1 a 2; ze středověku nikdo. Na hranici stojí Plótínos (204–270) a Hypatia (370–415), oba s medailonkem a štítkem novoplatonismus. Na středověk navážou vztahy k Aristotelovi, Platónovi, Epiktétovi a Senekovi (portréty) a k Ciceronovi, Plótínovi a Filónovi (medailonky).
- **Cesty:** 10. K otázce 1 čtyři, k otázce 3 dvě, k otázkám 4, 5, 6 a 7 po jedné, k otázkám 2, 8, 9 a 10 žádná.
- **Stránky otázek:** 8 se 42 hlasy (otázka 5 už sedm). Otázky 9 a 10 mají v `src/content/otazky/` jen záhlaví bez stránky; Co je náboženství? čeká s odkazem na otázku 9.
- **Bloky:** Slož argument stojí od `interaktivita-v1` (zatím jen v cestě 8). Dialog a Úryvek s otázkou postavené nejsou (v `src/components/bloky/` chybí).
- **Prvky z dat:** 13 kreseb na rámu `Kresba.svelte`, Dva životy, Kdo žil dřív?, osa hlasů, Přehrát život.
- **Období 3** v `src/data/obdobi.yaml`: okno 400–1450, lapis lazuli, výřez `stav: navrh` (střed 16° v. d. a 40° s. š., měřítko 720). Stránka `/obdobi/stredovek/` není; Kam dál z Helenismu a Říma na ni vede čárkovaně.
- **Události:** z období 3 jen sesazení posledního západořímského císaře (476).
- **Náboženství:** judaismus (zmiňuje Maimonida); křesťanství a islám stránku nemají.
- **Směry:** z období 3 žádný. **Deník:** Tvoje antika (`src/lib/tvoje-obdobi.ts`, `katalogObdobi`), Stoický týden.

## Obsah období

### 1. Dluh antiky (bod 1 k rozhodnutí)

Proti Kostře osobností, Náboženství světa, Myšlenkovým pokusům a fázi F3 antice chybí:

| Co chybí | Návrh |
| --- | --- |
| Stránky devíti profilů, které dnes mají jen medailonek: Thalés, Démokritos, Zénón z Eleje, Zénón z Kitia, Chrýsippos, Pyrrhón, Cicero, Hypatia, Plótínos | větev `antika-dluh` mezi celky 12 a 13 |
| Pýthagorás a Lucretius bez stránky | dál bez stránky, dokud pramen nedá vztah a místo (17. 10. 2026) |
| Pokusy Achilleus a želva (nese ho profil Zénóna z Eleje) a Karneadova deska | větev `antika-dluh` |
| Buddhismus a čínská tradice | větev `jinde-asie` s hinduismem a Šankarou, s vloženou mapkou okna |

### 2. Lidé a hloubky

Všichni jsou z Kostry osobností a všichni jsou v datech noví (bod 2 k rozhodnutí). Data osoby vznikají v celku, kde osoba poprvé mluví; stránku dostane v celku ve sloupci Stránka.

| Osoba | Hloubka | Stránka | Kde mluví | Proč |
| --- | --- | --- | --- | --- |
| Augustin | portrét | 11 | cesta 10, otázky 4, 8, 10 | Kradené hrušky, zahrada v Miláně, Boží obec po pádu Říma 410 |
| Boëthius | profil | 12 | cesta 12, otázky 3 a 10 | Útěcha filozofií ve vězení; učebnice hudby celého středověku |
| Hildegarda z Bingenu | profil | 12 | otázka 10 | Vize, hudba a dopis prelátům z Mohuče o zpěvu (1178) |
| Anselm z Canterbury | profil | 13 | cesta 9, otázka 9 | Důkaz z pojmu a Gaunilův ostrov |
| Tomáš Akvinský | portrét | 13 | cesty 9 a 11, otázka 9 | Pět cest; Anselmův důkaz odmítl; rodina ho rok věznila, aby nevstoupil k dominikánům |
| Vilém Ockham | profil | 13 | otázky 9 a 6 | Břitva, jména bez univerzálií, útěk z Avignonu 1328; co rozum o Bohu dokázat neumí |
| Avicenna | profil | 14 (data už v 13) | cesty 9 a 36, otázka 5 | Důkaz nutně jsoucího, létající člověk |
| Maimonides | profil | 14 (data už v 13) | cesta 36, otázka 9 | Průvodce zbloudilých pro žáka mezi vírou a filozofií; o Bohu jen co není |
| Averroes | profil | 14 | cesta 36, otázka 7 | Otázka chalífy, komentáře k Aristotelovi, spálené knihy v Córdobě |
| al-Ghazálí | medailonek | 14 | cesta 36 (Spor), otázka 7 | Nesoudržnost filozofů; krize pochybnosti v Bagdádu 1095 |
| al-Fárábí | medailonek | 14 | směr islámská filozofie | „Druhý učitel“; Avicenna podle vlastních slov porozuměl Aristotelově Metafyzice až z jeho knížky |
| Jan Hus | profil | 15 | cesta 11, otázka 2 | Kostnice 1415 |
| Petr Abelárd a Héloïsa | společný portrét | 15 | cesta 11 (Spor), otázka 2 (Héloïsa) | Příběh lásky a neštěstí; čin soudí úmysl |
| Jan Scotus Eriugena, Roger Bacon, Jan Duns Scotus, Mistr Eckhart, Jan Buridan, Christine de Pizan | medailonek | `medailonky-stredovek` | Christine de Pizan otázka 8 | Rodokmeny a spory scholastiky; Buridanův osel; Město dam |
| Šankara | medailonek | `jinde-asie` | okno | Mezitím jinde středověku |

**Koho do dat nepřidávám:** Gaunilo, Pelagius, Ambrož, Albert Veliký, John Wyclif, Jean Gerson, Ibn Tufajl a al-Kindí zůstanou jen v textu cest, jako Stockdale v cestě 33.

**Protihlasy po celcích** (strana Sporu, bod 9): 11 Augustin × Epiktétos, 12 Boëthius × Aristotelés, 13 Anselm × Tomáš, 14 Averroes × al-Ghazálí, 15 Abelárd × Tomáš. Žádné dva sousední celky nemají stejný protihlas, Tomáš mluví ve dvou cestách z pěti a Aristotelés v jedné. Z jiné tradice mluví v celcích 13 a 14 Avicenna, Maimonides, Averroes a al-Ghazálí, ne v okně, ale v páteři, jak chce architektura.

**Ženy jako plné hlasy:** Hildegarda (profil, otázka 10), Héloïsa (společný portrét, hlas na otázce 2, ne jako Abelárdova žačka), Christine de Pizan (medailonek, hlas na otázce 8).

### 3. Celky, otázky a cesty

**Celek 11 „Proč dělám, co nechci?“** (cesta 10, otázka 4 Jsem svobodný?)
- **Příběh:** šestnáctiletý Augustin s kamarády v noci otrhá hrušky, které ani nechtěl jíst, a hodí je prasatům. Sám by to neudělal (Vyznání II). Pak rozdělená vůle v zahradě v Miláně (Vyznání VIII).
- **Současný případ (návrh pro P6):** něco zakázaného ve skupině, co by člověk sám neudělal (zpráva do skupiny, drobná krádež „na odvahu“).
- **Odlišit od cesty 4**, která řeší, jestli stačí vědět: tady jde o vůli, která chce právě to zakázané, a o partu.
- **Spor:** Augustin × Epiktétos (vůle je jediné, co mám ve své moci; Augustin zná stoiky i Epiktétův výrok z Gellia, Boží obec IX, 4 — ověří P6).
- **Stavba a nový blok:** cesta stojí na čtení: Úryvek s otázkou (student v textu Vyznání označí větu, která odpovídá na otázku „proč to udělal?“). Blok vzniká v K1.
- **Pohyblivá myšlenka:** Přehrát život Augustina (Thagaste → Kartágo → Řím → Milán → Hippo), hotový prvek; potřebuje místa s rolí a časem.

**Celek 12 „Kde je štěstí, když o všechno přijdu?“** (cesta 12, otázka 3 Má život smysl?)
- **Příběh:** Boëthius, nejvyšší úředník Theodoricha, ve vězení v Pavii čeká na popravu. Píše žalozpěvy a k lůžku přijde Filozofie.
- **Současný případ (návrh pro P6):** někdo, komu se přes noc zhroutí to, na čem stavěl (zranění, které ukončí sportovní kariéru; ztracený účet a sledující).
- **Spor:** Boëthius × Aristotelés (bez vnějších dober štěstí není: Priamos, EN I, 10; a výslovně člověk „na kole“, EN VII, 13 — ověří P6).
- **Stavba a nový blok:** celá cesta jako rozhovor: student je vězeň a Filozofie se ho ptá (Dialog, scénář psaný předem, bez AI). Blok vzniká v K1.
- **Pohyblivá myšlenka:** nová kresba Kolo Štěstěny (K2): student posouvá člověka od obvodu kola ke středu a vidí, jak se jeho výkyvy zmenšují (Útěcha II a obraz soustředných kruhů ve IV, 6). Kresba jde zastavit a po zastavení ukáže stav omezeného pohybu.
- **Stránka otázky 10** (bod 4) s hlasy Platóna, Aristotela, Augustina, Boëthia a Hildegardy.

**Celek 13 „Může rozum dokázat Boha?“** (cesta 9, otázka 9 Je Bůh?)
- **Příběh:** Anselm hledá jediný argument a nachází ho (Proslogion, 1077–1078); mnich Gaunilo odpoví dokonalým ostrovem.
- **Současný případ (návrh pro P6):** důkaz z definice, jak ho známe z reklamy a sítí („nejlepší možný…“).
- **Spor:** Anselm × Tomáš (Tomáš důkaz z pojmu odmítl, Summa I, q. 2, a. 1, a dal pět cest ze světa). Avicenna jako třetí cesta: důkaz nutně jsoucího.
- **Pohyblivá myšlenka:** Slož argument (hotový) dvakrát: Anselmův důkaz a pak tytéž premisy s ostrovem. Jestli blok potřebuje výměnu slova, rozhodne K celku 13.
- **Stránka otázky 9**, odkaz z Co je náboženství? se vrátí. Čtení očima věřícího i nevěřícího; o pravdivosti rozhoduje otázka, ne stránka.

**Celek 14 „Co když si víra a rozum odporují?“** (nová cesta 36, otázka 7 Jak poznám, co je pravda?; bod 3)
- **Příběh:** vypráví se, že chalífa Abú Jakúb Júsuf se mladého Averroa zeptal, jestli je nebe věčné, nebo stvořené, a Averroes se bál odpovědět. Chalífa pak začal mluvit sám a Averroes dostal za úkol vyložit Aristotela (asi 1169).
- **Spor na dálku:** al-Ghazálí (Nesoudržnost filozofů: ve třech věcech filozofové bludaří, mezi nimi věčnost světa) × Averroes (Nesoudržnost Nesoudržnosti). Maimonides: kdyby byla věčnost světa dokázaná, vyložil by Písmo jinak; dokázaná není (Průvodce II, 25).
- **Současný případ (návrh pro P6):** co dělat, když si dva zdroje, kterým věříš, odporují; i spolužák, kterému víra doma říká něco jiného než hodina biologie. Čtení očima věřícího i nevěřícího (P6N).
- **Pohyblivá myšlenka:** Dva životy Averroa a Maimonida (hotový prvek): oba z Córdoby, oba vyhnaní; Maimonides četl Averroa až ve stáří (vliv textem, ověří P6).
- **K tomu:** tradice islám (P6N), směr islámská filozofie, pokus Avicennův létající člověk (hlas na otázce 5).

**Celek 15 „Smím neposlechnout, když mi to zakazuje svědomí?“** (cesta 11, otázka 2 Co je správné?)
- **Příběh:** Hus před koncilem v Kostnici odmítá odvolat, dokud mu z Písma nedokážou omyl (1415).
- **Současný případ (návrh pro P6):** trenér, šéf nebo parta chce, abys udělal něco, co považuješ za špatné.
- **Spor:** Abelárd × Tomáš: stačí jednat podle svědomí? Abelárd: hřích je v souhlasu, ne v činu (Poznej sám sebe). Tomáš: i mylné svědomí zavazuje, ale ne vždy omlouvá (Summa I-II, q. 19, a. 5 a 6).
- **Pohyblivá myšlenka:** osa hlasů otázky 2 (hotová): Sókratés a Hus, dva, kteří neodvolali, s odstupem 1800 let.
- **K tomu:** směr scholastika, Tvoje středověk.

**Vyváženost.** Etika (otázky 1 a 2) má jednu cestu z pěti. Otázka 1 další nedostává. Po středověku: otázka 1 čtyři cesty, 3 tři, 4 a 7 po dvou, 2, 5, 6 a 9 po jedné, 8 a 10 žádnou (cesty 15 a 19 přijdou v renesanci a osvícenství). Délka cest se nekrátí; pro zkoušku se studenty a pro přípravu hodiny doporučuji cestu 10 (parta a zakázané, téma blízké studentům) a cestu 11 (Hus, vazba na dějepis).

### 4. Hlasy na stránkách otázek

| Otázka | Dnes | Nové hlasy (celek) | Po období |
| --- | --- | --- | --- |
| 2 Co je správné? | 6 | Héloïsa, Hus (15) | 8 |
| 3 Má život smysl? | 5 | Boëthius (12) | 6 |
| 4 Jsem svobodný? | 4 | Augustin (11) | 5 |
| 5 Kdo vlastně jsem? | 7 | Avicenna (14) | 8 |
| 6 Co je skutečné? | 4 | Ockham (13) | 5 |
| 7 Jak poznám pravdu? | 5 | Averroes, al-Ghazálí (14) | 7 |
| 8 Jak spolu máme žít? | 6 | Augustin (11), Christine de Pizan (M) | 8 |
| 9 Je Bůh? | stránka není | Xenofanés, Epikúros, Anselm, Avicenna, Maimonides, Tomáš, Ockham (13) | 7 |
| 10 Proč nás něco dojímá? | stránka není | Platón, Aristotelés, Augustin, Boëthius, Hildegarda (12) | 5 |

Každý středověký hlas roztáhne osu přes tisíc let, takže krok T každého celku vypíše rozvržení (`npx vite-node scripts/osa-hlasu-rady.ts`) a revize celku zkontroluje osu na 390 px. Každý hlas mění katalog hodin a hlavičky profilů (`docs/pouceni.md` › Co se skládá z dat); revize vyfotí na telefonu hlavičky Augustina (cesta a tři otázky) a Tomáše. Stránka otázky 9 nebo 10 otevře otázkou, ne „Představ si…“.

### 5. Mapa, čas a data

- **Výřez:** výpis 35 míst lidí středověku (`scripts/_vyrez.mjs`, po výpisu smazaný) proti projekci z `src/lib/mapa.ts`: na notebooku (1032 × 456) se vejdou všechna od Marrákeše po Bucharu a od Fustátu po Canterbury. Na telefonu (390 × 330) padnou za okraj Bagdád, Hamadán, Isfahán, Tús a Buchara; posun středu na východ by zase vyřadil Córdobu, Fez a Marrákeš (bod 6).
- **Kotvy** (`udalosti.yaml`, `druh: kotva`, každá se zdrojem):

| Kotva | Celek |
| --- | --- |
| Vyplenění Říma 410 | 11 |
| Korunovace Karla Velikého 800 | 11 |
| Dům moudrosti v Bagdádu (9. století) | 11 (scéna stránky období) |
| Velké schizma 1054 | 11 (křesťanství) |
| Křížové výpravy 1096–1291 | 11 |
| První univerzity (Bologna, Paříž, Oxford) | 11 |
| Černá smrt 1347–1351 | 11 |
| Hidžra 622 | 14 (islám) |
| Kostnický koncil 1414–1418 | 15 |

  Události ze životů (`druh: zivot`) přidává každý celek ke svým lidem (zahrada v Miláně 386, Boëthiova poprava, útěk z Avignonu 1328, Husova smrt 1415).
- **Místa s rolí a časem** u všech portrétů a profilů ze zdroje, aby měli Život na mapě: Augustin (Thagaste, Madaura, Kartágo, Řím, Milán, Cassiciacum, Ostia, Hippo), Boëthius (Řím, Ravenna, Pavia), Hildegarda (Bermersheim, Disibodenberg, Rupertsberg u Bingenu), Anselm (Aosta, Bec, Canterbury, exil v Lyonu a Římě), Tomáš (Roccasecca, Monte Cassino, Neapol, Kolín, Paříž, Orvieto, Fossanova), Ockham (Ockham, Oxford, Avignon, Mnichov), Avicenna (Afšana u Buchary, Hamadán, Isfahán), Averroes (Córdoba, Sevilla, Marrákeš, Lucena), Maimonides (Córdoba, Fez, Fustát), al-Ghazálí (Tús, Bagdád, Damašek, Jeruzalém), Hus (Husinec, Praha, Kozí Hrádek, Kostnice), Abelárd (Le Pallet, Paříž, Saint-Denis, Paraclet, Cluny) a Héloïsa (Argenteuil, Paraclet). Tenké trasy vypíše `npx vite-node scripts/zivot-na-mape-vypis.ts`.
- **Vztahy s typem a zdrojem** (ověří P6 celku): Cicero → Augustin (Hortensius, vliv textem), Plótínos → Augustin (knihy platoniků), Augustin → Boëthius a Anselm (vliv textem), Aristotelés → Avicenna, Averroes, Tomáš, al-Fárábí → Avicenna, al-Ghazálí → Avicenna (polemika na dálku), Averroes → al-Ghazálí (polemika na dálku), Averroes → Maimonides (vliv textem), Avicenna a Maimonides → Tomáš, Anselm → Tomáš (polemika), Abelárd a Héloïsa (učitel a žák, znali se), Ockham × Duns Scotus (polemika), Ockham → Buridan.

### 6. Náboženství doby a Mezitím jinde

- **Křesťanství** (celek 11, P6N): Ježíš, církev, rozdělení 1054 a výhled k reformaci; vazby Augustin, Boëthius, Anselm, Tomáš, Abelárd, Hus, Hildegarda (pole `tradice`).
- **Islám** (celek 14, P6N): Korán, pět pilířů, sunnité a šíité; vazby Avicenna, Averroes, al-Ghazálí, al-Fárábí.
- **Judaismus** stojí; v celku 14 dostane Maimonida (`tradice: [judaismus]`) a Kam dál z jeho stránky.
- **Mezitím jinde:** Šankara dvěma větami bez odkazu na stránce období (celek 11); okno s vloženou mapkou až ve větvi `jinde-asie`.

### 7. Stránky ze šablon

| Stránka | Celek | Co |
| --- | --- | --- |
| Středověk `/obdobi/stredovek/` | 11 (K2 šablona, P8 texty) | Úvodní scéna: překladatelé v bagdádském Domě moudrosti převádějí Aristotela do arabštiny (bez jmen; neopakuje scénu žádného portrétu). Perex, odstavce k otázkám doby 4, 3, 10, 9, 7 a 2, Mezitím jinde. Mapa a čas: rok a osoba z toho, kdo je v datech (v celku 11 Augustin); po celku 14 zvážit Córdobu s Averroem. Kam dál z Helenismu a Říma přestane být čárkované. |
| Křesťanství `/nabozenstvi/krestanstvi/` | 11 | šablona tradice |
| Otázka 10 | 12 | stránka jen s hlasy lidí se stránkou, každá možnost úvodního případu má zastánce (bod 4) |
| Otázka 9 | 13 | stránka s cestou 9; odkaz z Co je náboženství? se vrátí |
| Islám `/nabozenstvi/islam/` | 14 | šablona tradice |
| Islámská filozofie (falsafa) | 14 | stránka směru: zakladatel, rodokmen al-Fárábí → Avicenna → Averroes, spor s al-Ghazálím (bod 7) |
| Pokus Létající člověk | 14 | Avicenna, otázka 5 |
| Scholastika | 15 | stránka směru: Anselm, Abelárd, Tomáš, Ockham, spor o univerzálie |
| Tvoje středověk `/denik/stredovek/` | 15 (K) | `katalogObdobi([3])`, vstup z deníku a z poslední stránky období, nese volby z osy hlasů |

Štítkem zůstávají patristika, židovská filozofie, mystika a nominalismus. Buridanův osel nebude samostatná stránka pokusu, ale prvek medailonku Buridana (dvě stejné kupy sena, al-Ghazálího dvě stejné datle).

### 8. Co připomenout v zadání každého celku

- Úvod a závěr cesty se píšou naposledy a porovnávají s hotovými cestami období; závěr se ptá na první tah té cesty.
- Názvy kroků a první bloky se neopakují mezi cestami téže otázky: cesta 10 a cesta 5 (obě otázka 4), cesta 12 a cesty 8 a 33 (otázka 3), cesta 36 a cesta 1 (otázka 7).
- Scéna patří jednomu místu: „Vezmi, čti“ (portrét × cesta 10), Kostnice (profil Husa × cesta 11 × kotva), Héloïsiny dopisy (portrét × hlas na otázce 2), chalífova otázka (profil Averroa × cesta 36). Druhé místo ji vypráví kratší s odkazem.
- Před přidělením anekdoty stránce z dat ji vyhledej v `src/content`; tentýž citát nejvýš dvakrát v celku.
- Nový případ a zastánci odpovědí jsou dva kroky; zastánci i pro odpovědi z ostatních Voleb.
- Student, kterého se téma bolestně týká: v celku 11 je otázka na vlastní selhání Volba bez pole na psaní; v celku 12 čti první obrazovku očima studenta, který o něco nebo někoho přišel, i toho, komu je zle; v celku 15 upálení a student, jehož svědomí jde proti rodičům; v celcích 13 a 14 čtení očima věřícího i nevěřícího každé tradice.
- Kresba s pohybem jde zastavit, po zastavení ukáže stav omezeného pohybu a autor ji vidí dřív, než se popíše jako hotová.
- Nová osoba a nový hlas mění testy (`otazka.spec.ts`, hlavičky, katalog hodin): celé `npm test` hned po přidání.

## Nad čím jsem váhal

- **Nová cesta 36** jde proti schválené architektuře (35 cest). Bez ní ale islámská a židovská filozofie, kterou architektura bere jako páteř středověku, nenese ani jednu cestu: Avicenna by mluvil jen v cestě 9, Averroes a Maimonides jen na profilech. Proto bod 3, ne hotová věc.
- **Ockham v celku 13, ne v 15.** Příběhem (útěk od papeže) patří k cestě 11, myšlenkou k otázkám 9 a 6. Celek 15 už nese společný portrét a Husa, a celek 13 je bez Ockhama nejlehčí.
- **Avicenna a Maimonides mluví v celku 13 jen z dat** (medailonek s atributem) a stránku dostanou až v celku 14 s falsafou. Jinak by celek 13 nesl čtyři stránky osob.
- **Spor celku 11 s Epiktétem:** historický protivník Augustina v otázce vůle je Pelagius, ten ale v Kostře není. Epiktétos navazuje na cestu 5 (stejná otázka) a Augustin se se stoiky přímo přel. Když P6 oporu nenajde, navrhne jiného.
- **Spor celku 12 s Aristotelem:** je to nejsilnější námitka, ale Aristotelés mluví v sedmi cestách antiky. Ve středověku mluví jen v této jedné.
- **Christine de Pizan jen medailonkem:** architektura ji tak vede. Její Město dam vědomě navazuje na Boëthiovu Útěchu (alegorické postavy u lůžka), takže by mohla mluvit i v celku 12; nechávám ji ve vlně medailonků s hlasem na otázce 8.
- **Scéna stránky období:** Dům moudrosti bez jmen, nebo Córdoba, kde se Averroes a Maimonides narodili dvanáct let po sobě. Córdoba je silnější, ale oba přijdou do dat až v celku 14, kdežto stránka období vzniká v celku 11.
- **Stránka otázky 10 už teď:** zaplní mezeru, ale do osvícenství se k ní nepřidá cesta. Proto bod 4.

## Co zůstává na později

- Buridanův osel jako samostatná stránka pokusu (zatím prvek medailonku).
- Pýthagorás a Lucretius bez stránky.
- Mapa a čas na stránce období: rok a osoba po celku 14.
- Výřez na telefonu pro východ (Bagdád, Persie, Buchara) se rozhodne v celku 14.
- Otázky 8 a 10 bez cesty ve středověku.
- Okno Čuang-c’ (období 2) zůstává dvěma větami do větve `jinde-asie`.

## Co rozhodnout před prvním krokem

Prázdná odpověď znamená souhlas s doporučením. U bodu 2 ne.

1. **Dluh antiky: kdy dodělat, co antika proti architektuře nemá?** Devět profilů, dva pokusy, buddhismus a čínská tradice (oddíl 1). Doporučuji souběžně: větev `antika-dluh` (profily a pokusy) mezi celky 12 a 13, buddhismus a čínská tradice ve větvi `jinde-asie` s hinduismem a Šankarou po vlně medailonků. Před prvním celkem by dluh posunul středověk asi o dva týdny; na konci období by se opakovala `antika-doplnky`.
   Odpověď:

2. **Nové osoby v datech: smím přidat 21 lidí z Kostry osobností středověku** (oddíl 2), každého až v celku, který ho potřebuje? Doporučuji ano, nikoho mimo Kostru. Lao-c’ a Čuang-c’ pro `jinde-asie` přijdou jako otázka v plánu té větve. **Tady prázdná odpověď souhlas není.**
   Odpověď:

3. **Nová cesta 36 „Co když si víra a rozum odporují?“ (otázka 7) jako celek 14?** Averroes před chalífou, spor na dálku Averroa s al-Ghazálím, Maimonides o věčnosti světa. Doporučuji ano. Když ne: Averroes a Maimonides jdou do celku 13 jako profily k otázce 9, islám, falsafa a létající člověk taky, a celek 14 odpadne.
   Odpověď:

4. **Stránka otázky 10 „Proč nás něco dojímá?“ už v celku 12** s hlasy Platóna, Aristotela, Augustina, Boëthia a Hildegardy? Doporučuji ano: otázka 10 dostane stránku o dvě období dřív než cestu a Hildegarda hlas, který nese její hudbu. Když ne, Hildegarda půjde do celku 15 a otázka 10 počká na osvícenství.
   Odpověď:

5. **Pořadí a rozdělení celků podle oddílu 3** (11 Augustin, 12 Boëthius, 13 Anselm, 14 víra a rozum, 15 Hus)? Doporučuji ano.
   Odpověď:

6. **Výřez mapy středověku schválit?** Na notebooku se vejde všech 35 míst, na telefonu ukážou Bagdád, Persie a Buchara jen štítek u okraje. Doporučuji výřez schválit (`stav: schvaleny` v kroku K2 celku 11) a o telefonu rozhodnout v celku 14, až tam lidé budou: zkusit menší měřítko telefonu jen pro období 3.
   Odpověď:

7. **Stránku dostanou směry islámská filozofie (celek 14) a scholastika (celek 15);** patristika, židovská filozofie, mystika a nominalismus zůstanou štítkem? Doporučuji ano: oba mají zakladatele, rodokmen mezi lidmi atlasu a spor s jiným směrem, patristika ne.
   Odpověď:

8. **Úprava designu: kdy?** Rozhodnuto autorem 7. 11. 2026: ještě před středověkem, jak řekl 1. 11. Větev `design-v2` běží (`docs/plany/design-v2.md`) a celek 11 začne po ní.
   Odpověď: design před celkem 11.

9. **Spory celků:** Augustin × Epiktétos, Boëthius × Aristotelés, Anselm × Tomáš, Averroes × al-Ghazálí, Abelárd × Tomáš? Doporučuji ano; podklady každého celku Spor ověří a můžou navrhnout jiný.
   Odpověď:

## Kontrola podle `references/kontrola-planu.md`

| Oblast | Jak to plán splňuje |
| --- | --- |
| Lidé | Každý z Kostry má hloubku a celek (oddíl 2); noví lidé jsou bod 2; protihlasy se střídají a dva celky mají protihlas z jiné tradice; každá strana Sporu a hlas mají v datech aspoň medailonek; tři ženy jako plné hlasy |
| Otázky a cesty | Etika jedna cesta z pěti; otázka 1 nic nedostává; každá cesta má příběh z období a současný případ; cesty 10 a 12 mají jinou stavbu a bloky v K před nimi; úvody, závěry, názvy kroků a scény v oddílu 8; cesty pro zkoušku vybrané; jeden pokus na stránce a osel jako prvek |
| Interaktivita | Každý celek má pohyblivou myšlenku (jedna nová kresba, ostatní hotové prvky); hlasy spočítané, osa se kontroluje na 390 px; hlavičky Augustina a Tomáše se fotí |
| Mapa, čas a data | Výřez spočítaný, bod 6; kotvy s celkem; místa s časem u všech portrétů a profilů; vztahy s typem a zdrojem |
| Náboženství a jinde | Křesťanství a islám mají stránku a P6N; Šankara dvěma větami bez odkazu |
| Šablony a deník | Stránka období v prvním celku, otázky 9 a 10, dva směry, pokus, dvě tradice a Tvoje středověk mají krok nejpozději v celku, který je potřebuje |
| Pořadí a tvar | Bloky a šablony před texty; na konci P11, P13 a hodina; tvar ze skillu |

## Po auditu (12. 11. 2026)

Audit atlasu a recenze obsahu antiky (`docs/revize/audit-2026-11-12.md`, `docs/revize/recenze-obsahu-2026-11-12.md`) vedly k plánu `docs/plany/po-auditu.md`, který autor 12. 11. 2026 přijal. Pro středověk z něj plyne:

- **Před celkem 11** proběhnou `design-v2` (dokončení designu), `herna-v1`, `denik-v2` a `film-0` (knihovna nových aktivit a film; zvuk je odložený) a `uklid-v1` (skilly a plány, pravidla pestrosti do skillů). Krok Z začne po nich.
- **Antika se nepřepisuje.** Postřehy k ní jsou v `docs/navraty.md` pro revizi obsahu ve fázi 5. Kde se v celku středověku ukáže slabé místo hotové stránky, zapíše se tam.
- **Každý celek má rozpis aktivit** (tabulka níž) a drží pravidla pestrosti. Podklady celku (P6) rozpis smějí změnit, ne zrušit; kontrola pravidel je součástí revize celku (P10).
- **Po souhrnné revizi středověku** se změří, co období stálo, a rozhodne se hloubka období 4 až 8 (audit, nález 3).

### Rozpis aktivit

Návrh; podklady každého celku ho můžou změnit. Kostra říká, co nese cestu, aby dvě cesty po sobě neměly stejnou (pravidlo 2).

| Celek | Kostra | Aktivity |
| --- | --- | --- |
| 11 Augustin | čtení | Úryvek s otázkou, Parta, Přehrát život, Kdo by to řekl? (Augustin, nebo Epiktétos), minutový film (Augustinovy hrušky, podle `film-0`) |
| 12 Boëthius | rozhovor | Dialog přes celou cestu, Kolo Štěstěny; Poslechni si (báseň z Útěchy, Hildegardin zpěv na otázce 10) jen tehdy, když bude zvuk do té doby vyřešený (odložený 12. 11. 2026) |
| 13 Anselm | argument | Slož argument dvakrát (Bůh a ostrov), Najdi slabé místo, Ockhamova břitva, Tipni si |
| 14 Averroes | mapa | Cesta knihy, Dva životy, tři čtení jedné věty (Roztřiď), Létající člověk s časovačem |
| 15 Hus | soud | Porota v Kostnici, Páry (Abelárdovo Ano a ne), Pravý, nebo podvržený?, osa hlasů |
| Medailonky | z dat | střídání malých aktivit podle člověka, Buridanův osel |
| Konec období | deník | Co ti zůstalo?, kartičky s rozestupem, Tvoje středověk |

Portréty mají formu podle života (pravidlo 11): Augustin jako zpověď, Abelárd a Héloïsa jako dopisy, Tomáš jako námitka a odpověď, Boëthius jako rozhovor, Hildegarda obrazem a zvukem.

### Pravidla pestrosti

Platí od celku 11. Do skillů (`atlas-cesta`, `atlas-obdobi`, `atlas-psani`) je zapíše `uklid-v1`; do té doby je zadání každého celku připomene odkazem sem.

1. Cesta má aspoň čtyři různé druhy aktivit a aspoň jednu hračku. Žádný formát víc než dvakrát.
2. Dvě cesty po sobě nemají stejnou kostru; Spor už není povinný v každé.
3. Každé období přinese aspoň dva formáty, které předchozí nemělo.
4. Stránka osoby nemá vždy totéž: malou aktivitu z dat vybírá atlas podle toho, co je u člověka zajímavé (překvapivý současník: Kdo žil dřív?; daleká cesta: Kde to bylo?; slavná věta: Kdo to řekl?), a sousední stránky se liší.
5. V každé cestě student aspoň jednou čte, rozhoduje, něčím hýbe a něco si vybavuje.
6. V každé cestě je aspoň jedna aktivita z každé čtveřice: vytvoř, spočítej o sobě, zažij, hádej a zjisti.
7. První čin přijde do 120 slov a první obrazovka je scéna nebo otázka na studenta. Kde je scéna daleko (úředník, královský dvůr), začíná cesta studentem.
8. Než vznikne pole na psaní, zkusí se z nápadu udělat hra: hádat, skládat, hledat chybu, tvořit s formou (ceník, heslo, dopis, zákon).
9. Závěr cesty má pokaždé jinou formu (pravidlo, rada kamarádovi, dopis, „dřív a teď“, otázka, kterou si odnáším, místo na škále); vždy otevřený a do deníku.
10. Poslední krok je jedna obrazovka: studentovy odpovědi a kdo stál s ním, jako lístek do deníku. Ostatní zastánci jsou na rozkliknutí.
11. Portrét má formu podle života (zpověď, dopisy, námitka a odpověď, rozhovor), ne jednu kostru; aspoň jedna hračka na portrét.
12. Aspoň jednou v cestě totéž znovu po výkladu, aby student viděl vlastní posun; kde to jde, příběh na pokračování přes všechny kroky.
13. Každý typ stránky (i směr, tradice, období) má místo k činu aspoň jednou za 250 slov.
14. Důvod jít dál, který není povinnost: sbírka v deníku, vstupy na pět minut (pokusy) viditelné z Domů, volba, kudy cestou jít.

Každá aktivita navíc projde čtyřmi otázkami (autor, 12. 11. 2026): odnese si student něco, přemýšlí sám, zůstává otevřená, chtěl by ji udělat, i kdyby nemusel.

## Zadání Z: odpovědi, větev a plán celku 11

Opus 5.5 · medium. Pusť v novém chatu v Projektu Atlas filozofie, až vyplníš odpovědi.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok Z plánu středověku, tedy zápis mých odpovědí, větev a plán celku 11. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti, kromě místa jmenovaného v kroku 2.

0. git switch main, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu období docs/plany/stredovek.md tabulku kroků, Obsah období (oddíly 2, 3 a 5 až 8), Co rozhodnout před prvním krokem s mými odpověďmi a toto zadání. Když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude (docs/plany/stredovek.md). U bodu 2 (nové osoby) prázdná odpověď souhlas není: když chybí, zapiš ostatní odpovědi, zastav se a zeptej se.

1. Odpovědi: zapiš rozhodnutí do docs/rozhodnuti.md (nový záznam nahoru, datum, krátce, co platí a co se mění proti architektuře). Do plánu období přidej oddíl Po odpovědích a podle odpovědí uprav tabulku kroků, obsah a pořadí. Když odpověď mění katalog cest nebo kostru osobností (bod 3), uprav docs/architektura.md jen v dotčených řádcích. V docs/plan.md uprav řádek plánu středověku v Plánech větví, řádek P12 v katalogu promptů a odstavec Další větve v pořadí. Commit v main.

2. git switch -c celek-11. Založ docs/plany/celek-11.md v tvaru plánu větve (skill atlas-obdobi › Tvar plánu). Jako vzor stačí z docs/archiv/plany/celek-10.md tabulka kroků a zadání P6. Obsah z plánu období › celek 11: portrét Augustina, cesta 10 „Proč dělám, co nechci?“, stránka období Středověk s kotvami a Kam dál z Helenismu a Říma, křesťanství, blok Úryvek s otázkou, Přehrát život Augustina, hlasy Augustina na otázkách 4 a 8 (na otázce 10 až s její stránkou v celku 12). Kroky: P6 podklady, P6N křesťanství, K1 blok Úryvek s otázkou, K2 šablona stránky období 3 a schválení výřezu, P7 portrét, P8 cesta 10 a texty stránky období, R, O, Uzavření; u každého model, úsilí a skilly. Dál Proč v tomhle pořadí, Co už atlas má, Obsah větve, Nad čím jsem váhal, Co zůstává na později, Co rozhodnout před prvním krokem (prázdná odpověď znamená souhlas; u stahování obrázků a nových osob ne) a zadání P6 v plném znění se skillem atlas-overeni (podkladový list docs/podklady/celek-11.md; Opus 5.5 · high s vyhledáváním). Zadání P6 ať jmenuje, co ověřit: data, místa s rolí a časem a vztahy Augustina (Cicero, Plótínos); příběhy a citáty s českým překladem a místem v díle; úryvky z Vyznání pro Úryvek s otázkou; Spor Augustin × Epiktétos a jeho oporu (Boží obec IX, 4 a Gellius XIX, 1); současný případ; scénu a kotvy stránky období se zdroji; a co z oddílu 8 plánu období platí pro celek 11.

3. Commit v celek-11, česky a stručně. Na GitHub nic neposílej. V Projektu Claude aktualizuj docs/plany/stredovek.md a docs/plan.md, přidej docs/plany/celek-11.md (a docs/architektura.md, jestli se měnila). Nic dalšího do projektu nepřidávej.

4. Pak se zastav a napiš mi krátce, co se podle odpovědí změnilo, nad čím jsi váhal a co je v plánu celku 11 k rozhodnutí. Další krok je P6 celku 11 v novém chatu.
```

## Uzavření plánu období

Po větvi `revize-stredoveku` (P11 a P13): otázka na schválení celého období, kterou zodpoví jen autor. Po ní plán do `docs/archiv/plany/stredovek.md`, řádek v `docs/plan.md` a plán dalšího období se skillem `atlas-obdobi`.
