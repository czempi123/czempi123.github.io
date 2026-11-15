# Větev design-v2, část: plátno: obrazovky, a základ kódu (tokeny, přezdívky)

Část plánu větve `docs/plany/design-v2.md` (oddíl Části plánu). Plán se 15. 11. 2026 rozdělil, aby každý soubor pro Projekt Claude měl pod 35 kB; text oddílů je beze změny.

## Po D4 (8. 11. 2026)

**Na plátně** pod Pohybem přibyla řada „D4 Obrazovky“: osm obrazovek, každá ve čtyřech artboardech (notebook 1440 ve dne, notebook v nočním zápisníku, telefon 390 ve dne, telefon v noci). Den na notebooku je komponenta (`project/<Obrazovka>.dc.html`), ostatní tři ji vkládají s režimem `noc`; telefon je táž stránka v úzkém rámu (rozvržení přes container queries, jako to bude v kódu). Nahoře na každé obrazovce je pult **Náhled pohybu** s čárkovanou hranou, který k obrazovce nepatří: spouští pohyb, který obrazovka má, a přepíná Omezený pohyb a Čtyřikrát pomaleji jako stránka Pohyb. Domů a Období mají v panelu vlastností přepínač `titulek` 104 / 148 px. Obsah je ze skutečných stránek (`src/content`, `src/data`), mapy z Natural Earth (`world-atlas`, `geoConicConformal` jako `src/lib/mapa.ts`).

**Komentáře autora během D4:** medailonky (kolečka s písmenem) se nelíbily, autor zvolil razítko s ikonou a pak poštovní razítko se jménem po obvodu; mapa života v profilu má mít šipky a oblouky místo rovných čar. Po prohlídce (8. 11. odpoledne): štítky otázek v hlavičce profilu se nelíbily, autor zvolil záložky v deníku; mapa v Mapě a čase má vypadat jako mapa; v pásu období mají ornamenty zapadnout přirozeněji a mezi lístky má být perforace z teček; vykrojení na okrajích má zůstat, ale jako skutečný výsek v papíře, ne kolečko navrch, které přesahovalo ven; jména na mapě mají lépe sednout do mapy; trasy na mapě v profilu mají vypadat nakreslené rukou a mapa nesmí přesahovat rámeček; kresby (JS animace) mají dostat týž scrapbookový vzhled. Všechno provedeno, pás i v design systému.

### Co je na kterých obrazovkách

- **Domů** (`Domu`): titulek na vytrženém listu „Velké otázky mají dlouhé dějiny.“ s pruhem „Filozofie od Thaléta po dnešek.“, perex, hlavní tlačítko Začít první cestu s údajem a tiché Poznat Sókrata; první cesta jako velký lístek s pahýlem (7 kroků, asi 14 min) a razítky Sókrata a Prótagora; Osm období jako pás odtrhávacích lístků s ornamenty (na telefonu svisle, perforace vodorovně), lístky 3 až 8 bez odkazu s „připravujeme“; tři vstupy jako karty; Na začátek. Pohyb: příchod (titulek, pruh).
- **Mapa a čas** (`MapaCas`): malý pás období (zvolené období vtlačené, na telefonu vodorovně posuvný), Egejské moře jako vystřižená stará mapa přilepená páskou (moře šrafované tužkou, vodní linky podél pobřeží, pevnina na lístkovém papíře, rámeček se stupnicí, názvy moří kurzívou a krajů prostrkaně, větrná růžice, měřítko 100 km), lidé roku 424 př. n. l. na přišpendlených lístečcích u Athén, Délia a Abdéry, posuvník 560 až 300 př. n. l. s drážkou a jezdcem jako razítko, věta „žije 8 lidí z atlasu“, karta člověka na listu s páskou (razítko, kdo, proč, rámeček V roce…, Život na mapě se zastávkami, Předchozí a Další, Otevřít stránku). Pohyb: lístečky se při posunu roku objeví a zmizí, rozvinou se po klepnutí (`--d-listek`), karta se vymění při výběru člověka.
- **Profil Sókrata** (`ProfilSokrates`): celá hlavička (razítko místa, titulek, pruh, dva lístky cest, tři záložky velkých otázek, deska s bustou a dvěma páskami, Proč kalich, popisek), úvod, velký citát, kapitola 01 s pojmem „Delfy“ (poznámka na okraji na notebooku, lístek po klepnutí na telefonu) a blokem Nejdřív sám (srovnání se rozloží jako lístek), Doba a lidé (Současníci na ose, Kde žil: tři tažení obloukem se šipkou a rokem, Žáci a Znali se s razítky), Zkus to žít na listu s páskou, Kam dál. Pohyb: přechod z Lidí (list se otočí kolem levé hrany) a příchod (titulek, pruh, dvě pásky).
- **Krok cesty** (`KrokCesty`): cesta 1, krok 2. Lišta cesty s drážkou postupu, titulek kroku na listu, „kde jsme“ rukou, Volba se čtyřmi možnostmi z `cesta1-jak-zjistit`, Proč právě tohle, Tohle je můj tah (zakázané, dokud nevybereš), zpětná vazba jako lístek s páskou a pod ní Co udělal Sókratés; Další krok posune list na krok 3. Telefon: horní lišta (zpět, postup, Odejít) a spodní lišta Předchozí a Další krok. Pohyb: vtlačení, kroužek tužkou, rozložení lístku, posun kroku.
- **Velká otázka 1** (`VelkaOtazka`): titulek „Jak mám žít?“ s pruhem bez období „Pět odpovědí na jedno léto.“, případ Sklad, nebo tábor? na listu, pět hlasů, osa Kdy žili (razítka v polovině života ve dvou řadách, na telefonu ve čtyřech, pruhy životů, zlom, dnes), Kdo z nich je ti nejblíž? (razítko se na ose zvýrazní, u dneška se objeví Ty, věty z `vetyPoVolbe` na lístku), Cesty k otázce.
- **Období 2** (`ObdobiHelenismus`): místo razítka odtržený lístek období 2 z pásu (ornament mozaika a oblouk), titulek a pruh v tyrském purpuru, deska s mapou Středomoří roku 161 n. l., Příběh Tři filozofové v senátu, Otázky doby (pět, s lístky cest), Lidé a směry (štítky směrů, osm lidí s razítky). Pohyb: příchod.
- **Můj deník** (`MujDenik`): titulek a pruh bez období, Rozpracované, záznam cesty 1 s razítkem Cesta prošlá, Na začátku × Teď, odpovědi z kroků, Návrat (Zpráva před čtvrtletkou) na lístku s páskou, stanovisko, přijatá výzva s Označit jako hotové, deník v souboru. Pohyb: razítko dopadne (`--k-dopad`).
- **Kresba** (`KresbaVitr`): Stejný vítr v kapitole 01 Prótagora jako koláž: plátno je tečkovaný papír s linkou, zem natržený pruh papíru, postavy vystřižené z listu se stínem výstřižku (bez obrysu), šála z papíru období, repliky na lístečcích přilepených páskou, mráček z papíru, který se zvolna posouvá, vítr jako tečkované stopy tužkou, po kterých poryvem přeletí tah, papírové listí unášené větrem a postava, které je zima, se třese, přepínače čekání a chůze ve vtlačené drážce, Zastavit pohyb; s Omezeným pohybem kresba stojí a text pod ní říká totéž.

### Co se proti design systému změnilo

- **Poštovní razítko člověka místo mince** (autor 8. 11.: medailonky s písmenem a pak prosté kruhové razítko „nejsou v topu“, zvolil poštovní razítko). Dva soustředné kruhy v inkoustu období, po obvodu nahoře jméno a dole roky (Instrument Sans), mezi nimi dvě tečky, uprostřed atribut z dat (`atribut.ikona`); kdo atribut nemá, má uprostřed razítkové vlnovky. Inkoust je trochu nedotištěný (SVG filtr se šumem), bez stínu, každé razítko natočené jinak (−14° až +12° podle id). Velikost `--mv`: 72 px v Doba a lidé, 78 na kartě v Mapě a čase, 64 u hlasů a lidí období, 56 na ose; pod 48 px (osa na telefonu, tlačítka volby) obvod mizí a zůstane kruh s atributem. Ikony jsou na plátně nakreslené nově; v kódu je K3 sjednotí se spritem atlasu.
- **Záložky velkých otázek místo štítků** (v hlavičce profilu): papírové záložky v barvě období zastrčené pod okrajem listu, každá trochu jinak vysoko, nahoře rukou „otázka 7“, pod tím znění; po najetí se povytáhnou (`--d-stisk`). Na telefonu vyčnívají zleva pod sebou z listu vpravo. Záložka je i v deníku (otázka, ke které ses ještě nevrátil). Štítky směrů a Otázky doby na stránce období zatím zůstávají (otázka 10).
- **Lidé na mapě** nemají na mapě jména (autor: „pořád vypadají agresivně“), mapa drží vzhled opravdové mapy na nástěnce: každé místo je lísteček (post-it, `--listek`, horní lepicí proužek, natočený podle místa) přišpendlený špendlíkem v papíru období přesně na místo; na lístečku rukou název a počet lidí. Klepnutí lísteček rozvine a pod názvem jsou jména rukou; vybraný člověk je podtržený barvou období. Na notebooku je lísteček vybraného člověka otevřený, na telefonu jsou všechny zavřené (cíle 44 px). Trasy v mini mapě profilu jsou ručně kreslené (rozechvělá čára se slabším druhým tahem a nesouměrná šipka). Všechno na mapě je oříznuté vnitřním rámečkem.
- **Mapa jako výstřižek:** Mapa a čas, mini mapa v profilu a mapa na desce období jsou vystřižená stará mapa: moře šrafované tužkou, tři vodní linky podél pobřeží, pevnina `--listek` s obrysem `--ink-2`, dvojitý rámeček se stupnicí; v Mapě a čase páska, názvy moří a krajů, větrná růžice a měřítko. Jen tokeny, ve dne i v noci.
- **Pruh bez období:** stránky, které nepatří jednomu období (velká otázka, Můj deník), mají pruh v inkoustu (`--ink`, text `--na-inkoustu`).
- **Odtržený lístek období** na stránce období místo razítka místa: týž lístek jako v pásu na Domů, s ornamentem a perforací.
- **Tinty období nahradil lístek s páskou** (otázka 5 po D2): zpětná vazba Volby, věty po volbě na ose hlasů, Návrat, srovnání v Nejdřív sám; Zkus to žít je list s páskou. Karta týdne a kolečka v hodině na obrazovkách nejsou; navrhuji totéž.
- **Plátna nejsou vtlačená.** Mapa, mini mapa a kresba jsou tečkovaný papír s tenkou linkou; vtlačené zůstává jen zvolené a aktivní.
- **Pás období:** výseky nahoře a dole i perforace mezi nimi jsou opravdu vykrojené (maska na každém lístku, polovina výseku a každé dírky na každé straně hranice, takže sedí na střed); stín pásu je `drop-shadow` celého pásu, takže jde i do výseků a dírek. Po najetí se lístek u perforace natrhne: pootočí se kolem horní hrany a klesne o pár px (`--d-listek`, `--k-papir`), na telefonu se vysune do strany; ornament jde přes celou šířku lístku a do ztracena dolů k názvu, takže sousední ornamenty na sebe navazují (opraveno i v design systému). Na telefonu svisle; malý pás v Mapě a čase se zvoleným obdobím vtlačeným; lístky bez stránky nesou „připravujeme“ a po najetí se nezvednou.
- **Navigace:** odkazy v záhlaví i spodní lišta telefonu jsou ploché, aktivní je vtlačený (jako ve Spojení); vystupuje jen Můj deník. Autor 8. 11. chtěl, aby název seděl ke zbytku a nerušil, a zvolil nový úderný název **Agora** (athénské tržiště, kde se Sókratés ptal lidí); jak daleko přejmenování sahá, je otázka 11. Logo je koláž bez piktogramu: pět písmen A-g-o-r-a, každé na vlastním vytrženém útržku papíru (`--list` a `--listek`, Newsreader 23 px), mírně natočených a přes sebe; velké A je o kus větší a nese barvu období, ve kterém student je (papír `--pp`, text `--na-papiru`: purpur na stránce Helenismu, terakota v profilu Sókrata, v kroku cesty 1, v Mapě a čase roku 424 př. n. l.); na stránkách bez období (Domů, velká otázka, Můj deník) je v inkoustu (`--ink`, text `--na-inkoustu`) jako pruh bez období. V kódu ho K2 vezme z období stránky. Celek má jeden společný měkký stín, po najetí se písmena srovnají do řady (`--d-stisk`, respektuje Omezený pohyb). Na telefonu 19 px. Odkaz má popisek „Agora, domů“, jednotlivá písmena čtečka nečte.
- **Lístek se rozkládá při vložení** (`@keyframes` s `rotateX`, `--d-listek`, `--k-papir`), takže v kódu nemusí čekat schovaný v rozvržení.
- **Display:** 104 px stačí. Na Domů láme 148 px větu do tří řádků a přebije pás období; jméno období drží 104 px jako jméno člověka. `display-1` ani `display-2` nepřidávám.

- **Kresby jako koláž** (pravidla pro K7 a všech 13 kreseb): plátno je tečkovaný papír přilepený na list; postavy a předměty jsou výstřižky (`--list`, `--listek`, papír období `--pp`) se stínem výstřižku, bez obrysových čar; zem a horizont natržený pruh papíru; směr, pohyb a síly (vítr, šipky, paprsky) tužkou (`--tuzka`, čárkovaně); barva období jen na jednom nositeli významu; text v kresbě na lístečku s páskou Kalamem, popisky Instrument Sans; v noci tytéž tokeny. Pohyb jen `transform`, `opacity` a tah tužky; s Omezeným pohybem kresba stojí a text pod ní říká totéž.

### Kontrola

- **Kontrast** 19 nových dvojic ve dne i v noci výpočtem (`scripts/kontrast-d4.mjs`, po výpisu smazaný): všechny projdou. Nejnižší text 4,72 : 1 (popisek na lístku v noci), nejnižší netextový prvek 3,24 : 1 (vítr tužkou na papíru ve dne).
- **Telefon a notebook:** zdroje obrazovek jsem vykreslil v Chrome na 390 a 1440 px ve dne i v noci (vlastním jednoduchým během komponent, bez písem z Google, ne v editoru plátna). Nic nepřetéká do stran; všechny dotykové cíle mají aspoň 44 × 44 px kromě pojmu v řádku textu („z Delf“ 42 × 27), který má plochu klepnutí zvětšenou neviditelným okrajem (výjimka pro odkaz v textu). Výšky artboardů jsou podle změřené výšky s rezervou na otevřené lístky.

### Nad čím jsem váhal a co by šlo jinak

- **Pult náhledu přímo nad obrazovkou.** Ovládání pohybu je vidět u obrazovky, kterou spouští, a čárkovaná hrana ho odděluje. Jinak: obrazovky čisté a ovládání v samostatném artboardu, ale pak by se pohyb spouštěl daleko od místa, kde se děje.
- **Poštovní razítko** nese jméno a roky po obvodu, takže je čitelné i samo; vedle jména v seznamu je to zdvojení, ale razítko pak funguje i tam, kde jméno vedle není (osa hlasů). Text po obvodu je od 56 px dolů drobný (asi 6 px), proto pod 48 px mizí. Jinak: razítko bez textu, jen dva kruhy a atribut, menší a klidnější. Ikony jsou jednoduché tahy (kalich, jeskyně, váhy, lucerna, přesýpací hodiny, vavřín…); lidé bez atributu mají vlnovky jako na poštovním razítku.
- **Lístky období bez stránky** vypadají jako ostatní, protože pás je jeden předmět. Jinak: zploštit je a dát čárkovaný okraj jako zakázaným prvkům; pás by pak vypadal rozbitý.
- **Krok cesty na notebooku** má záhlaví webu i lištu cesty. Jinak: jen lišta cesty, víc soustředění, ale z kroku by nebylo vidět, kde v atlasu student je.
- **Lidé v Mapě a čase na lístečcích:** jména se nepřekrývají a mapa zůstane čistá, ale kdo kde je, uvidí student až po klepnutí. Jinak: rozklikávací tabulka vedle mapy, přehlednější, ale mapa by pak nenesla lidi.
- **Osa hlasů** skládá razítka do řad, aby se nepřekrývala (Diogenés a Aristotelés žili skoro současně). Jinak: jedna řada a razítka menší.
- **Přechod v profilu** ukazuje otočení listu a příchod; let fotky z karty na desku je jen na stránce Pohyb, protože na obrazovce není karta, ze které by vyletěla.

## Co rozhodnout po D4

Prázdná odpověď znamená souhlas s doporučením. Jen u otázky 9 potřebuji výslovnou odpověď.

1. **Poštovní razítko s atributem místo mince v celém atlasu** (Lidé, Mapa a čas, osa hlasů, Doba a lidé, karta týdne, příprava hodiny)? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

2. **Pruh bez období v inkoustu** na stránkách, které nepatří jednomu období (otázka, deník, Otázky, Lidé)? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

3. **Odtržený lístek období** v hlavičce stránky období místo razítka? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

4. **Lístek s páskou místo tint i u karty týdne a koleček v přípravě hodiny?** Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

5. **Bez většího displeje:** titulky na Domů i na stránce období 104 px jako jméno člověka? Doporučuji ano (přepínač `titulek` na plátně ukáže 148 px).
   Odpověď: (prázdná, souhlas s doporučením)

6. **Pás období na telefonu svisle na Domů a vodorovně posuvný v Mapě a čase?** Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

7. **Krok cesty na notebooku se záhlavím webu nad lištou cesty?** Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

8. **Chceš něco změnit na obrazovkách?** Napiš kterou a co (nebo komentář na plátně). Bez odpovědi zůstává, jak je.
   Odpověď: (prázdná, souhlas s doporučením)

9. **Brána: schvaluješ návrh na plátně (design systém, pohyb a obrazovky) jako podklad pro kód?** Bez výslovného „ano“ K1 nezačne.
   Odpověď: ano (8. 11. 2026)

10. **Záložky i jinde místo vtlačených štítků** (Otázky doby na stránce období, štítky směrů)? Doporučuji ano u otázek, štítky směrů nechat vtlačené.
   Odpověď: (prázdná, souhlas s doporučením)

11. **Jak daleko sahá nový název Agora?** Doporučuji: záhlaví, titulek stránek v prohlížeči, popis pro sdílení, úvodní věta na Domů a README; repozitář, adresa webu a soubory v `docs/` zůstávají, jak jsou (o přejmenování adresy rozhodneš zvlášť). V textech pro studenty zůstává „atlas“ tam, kde mluví o tom, jak se v něm pohybovat.
   Odpověď: (prázdná, souhlas s doporučením)

## Po K1 (8. 11. 2026)

Odpovědi po D4: otázka 9 (brána) „ano“, ostatní prázdné, takže platí doporučení. Plátno se kvůli nim neměnilo: všechny potvrzují stav, který na něm je (otázky 4 a 10 se týkají K4 a K6).

### Co je v `tokens.css`

- **Papír, plochy, inkousty a tužka** pro den a noční zápisník podle `<helmet>` design systému (`--papir`, `--tecka`, `--list`, `--plocha`, `--plocha-m`, `--listek`, `--linka`, `--tuzka`, `--ink`, `--ink-2`, `--ruka`, `--ink-3`, `--na-inkoustu`, `--na-papiru`). Noc běží jako dřív: podle systému (`prefers-color-scheme`, když student nezvolil den) a ručně přes `data-theme` z přepínače režimu.
- **Osm období:** inkoust `--p-1` až `--p-8` (v noci zesvětlený) a papír `--pp-1` až `--pp-8` (ve dne i v noci stejný). Hodnoty jsou tytéž jako dosud, jen pod novým jménem. Podstromu je nastaví třída `.obdobi-N` (`--p`, `--pp`, `--na-pp`), bez třídy nebo s `.bez-obdobi` je pruh i páska v inkoustu.
- **Stíny** `--vyst`, `--vyst-m`, `--zved`, `--vtla`, `--vtla-mele`, `--vtla-hl`, `--vyst-ink`, `--zved-ink`, `--vtla-ink`, `--lezi`, `--lezi-zved`, `--lezi-tlak`, filtr `--odlep`, a navíc z obrazovek D4 `--deska` (rám fotky), `--pas-stin` (pás období) a `--lista-stin` (spodní lišta telefonu). V tisku jsou všechny stíny `none`.
- **Páska** `--paska-a`, `--paska-b` a tvar `--paska-tvar`, **vytržený okraj** `--trh`, **filtr fotky** `--foto`, krok teček `--tecky-krok` (22 px, na telefonu 20 px).
- **Písma:** `--font-ruka` (Kalam) a stupnice z D2: `--fs-jmeno` 104 / 56 px, `--fs-h1` 64 / 40, `--fs-h2` 44 / 30, `--fs-h3` 30 / 24, `--fs-citat` 31 / 23, `--fs-perex` 23 / 19, `--fs-text` 21 / 18, `--fs-ruka-l` 40 / 26, `--fs-ruka` 19 / 17, ovládání a popisky beze změny.
- **Zaoblení** `--r-papir` 0, `--r-razitko` 3, `--r-ovladani` 10, `--r-plne` 999; **okraj stránky** 16 px na telefonu, 48 px na notebooku (dřív 80); mezery beze změny.
- **Pohyb:** `--d-stisk` 120 ms až `--d-kamera` 600 ms, `--z-prichod` 80 ms, křivky `--k-stisk`, `--k-papir`, `--k-list`, `--k-dopad`. Při omezeném pohybu jsou všechny délky 0.

### Co je v `global.css`

- **Tečkovaný papír** na `body` jen v CSS (`radial-gradient`, tečka 1,1 px), třída `.papir` pro plochy uvnitř stránky (plátno mapy, kresby).
- **Vytržený okraj** `.trh` (clip-path) a `.odlep` (stín, který sleduje zubatý okraj; patří obalu).
- **Třídy papíru:** `.papirovy-list` (ležící list), `.paska` s polohami `--nahore`, `--vlevo`, `--vpravo` a menší `--mala`, `.razitko-mista`, titulek s pruhem `.titulek` › `.titulek__list` › `.titulek__jmeno` a `.titulek-pruh` › `.titulek-pruh__papir` (Kalam 700 v papíru období), `.razitko-cloveka` (velikost `--mv`, natočení `--rr`, části SVG `.rz-k`, `.rz-b`, `.rz-ik`, `.rz-t`, `.rz-r`, pod 48 px `--bez-obvodu`), `.listek-paska` (lístek místo tinty období).
- **Vrstvy stínu bez přechodu `box-shadow`:** `.vystouple` (varianty `--m` a `--ink` pro hlavní tlačítko) a `.lezi-odkaz` (karta). Prvek nese vtlačený stín, `::before` plochu se stínem vystouplého, `::after` stín zvednutého; najetí, stisk a zvolení (`aria-pressed`, `aria-current`, `aria-selected`) mění jen `opacity` vrstev a `transform`.
- **Zakázaný prvek** (`.zakazane`, `:disabled`, `aria-disabled`): bez stínu a vrstev, čárkovaný okraj tužkou, text `--ink-3`. **Fokus** z klávesnice zůstává rámeček 2 px v inkoustu, i u zakázaného a na plném inkoustu.
- **Klíčové snímky:** `listek-rozlozit` (třída `.rozlozit`: `rotateX` od horní hrany, `--d-listek`, `--k-papir`) a `razitko-dopad` (třída `.dopad`: z 1,35 na 1, `--k-dopad`, bez odskoku).
- **Omezený pohyb:** přechody a animace trvají 0,01 ms a zpoždění se ruší, takže stav je hned na konci; `.rozlozit` a `.dopad` nemají animaci vůbec.
- **Kalam** lokálně z `@fontsource/kalam` (latin a latin-ext, 400 a 700) v `Pisma.astro`, bez přednačtení, protože ho zatím žádná stránka nepoužívá. Ověřeno vykreslením: obě podmnožiny i oba řezy se načtou, česká písmena včetně ď, ť, ů a Ů jsou v Kalamu, žádný požadavek mimo web (`Claude outputs/snimky/design-v2-k1/kalam-cestina.png`).

### Přezdívky: co zůstalo a pro který krok

| Staré jméno | Ukazuje na | Kdo ho používá | Nahradí |
| --- | --- | --- | --- |
| `--paper` | `--papir` | 18 míst (dřív 35; ✓ bloky K4b, ✓ cesta K5): deník, mapa, kresby, zbylé bloky; ✓ rám (K2), ✓ stránky osob (K3), ✓ rám aktivity, Volba, Odkryj, tlačítka (K4a); po K6 10 (✓ stránky z dat, Domů, deník, období, hodina; zbývá mapa a kresby) | K4 až K7 podle komponenty |
| `--surface` | `--list` | 55 míst (dřív 73; ✓ bloky K4b, ✓ lišty cesty, karta a přehled cesty K5): zbylé karty, deník, mapa; ✓ rám (K2), ✓ stránky osob (K3; zbývá bod mini mapy, K7), ✓ rám aktivity, Volba, Odkryj (K4a); po K6 35 (✓ stránky z dat, Domů, deník, období, hodina; zbývá mapa a kresby) | K4 (bloky), K5, K6, K7 |
| `--sunk` | papír smíchaný s linkou (`color-mix`) | 14 míst (dřív 20; ✓ bloky K4b): přepínače, najetí, podklady; ✓ rám (K2: hledání, lišta hodiny), ✓ tlačítka bloků a Tlacitko.astro (K4a); po K6 3 (✓ stránky z dat, Domů, deník, období, hodina; zbývá mapa a kresby) | K4 a K7 (vtlačené místo barvy) |
| `--rule` | `--linka` | 78 míst (dřív 115; ✓ bloky K4b, ✓ cesta K5); ✓ rám (K2), ✓ stránky osob (K3; zbývá mini osa, K7), ✓ rám aktivity, Volba, Odkryj, tlačítka (K4a); po K6 40 (✓ stránky z dat, Domů, deník, období, hodina; zbývá mapa a kresby) | K4 až K7; kde je linka jedinou hranicí ovládání, přejde na stín nebo tužku |
| `--muted` | stará hodnota `#6B6154` / `#A69B8A` | 53 míst (dřív 88; ✓ bloky K4b, ✓ postup cesty K5); ✓ rám (K2), ✓ stránky osob (K3; zbývá mini osa, K7), ✓ rám aktivity, pole na psaní, Volba, Odkryj, tlačítka (K4a); po K6 27 (✓ stránky z dat, Domů, deník, období, hodina; zbývá mapa a kresby) | K3 až K7; nový `--ink-3` je o odstín světlejší a na tintě období 2 by měl 4,47 : 1, proto přezdívka drží starou hodnotu, dokud tinty nezmizí |
| `--period-N` | `--p-N` | jen přiřazení `.obdobi-N` v `global.css` (✓ deník a Domů, K6); ✓ stránky osob (K3, nepoužívaly ho) | O s tintami |
| `--pc`, `--pc-tint`, `--pc-soft`, `--pc-plate`, `--pc-on-plate` (třída `.obdobi-N`) | staré tinty a desky | 359 míst (`--pc` 257, tint 55, soft 28, plate 10, on-plate 9); ✓ desky (K3: deska je list s páskami, `--pc-plate` už jen kresby v `global.css` a hlavička stránky období přes `--period-N-plate`), ✓ stránky osob mimo mini mapu a mini osu (K7), ✓ Volba a Odkryj (K4a: lístek s páskou místo tinty), ✓ všechny bloky (K4b: `.blok__zpetna` smazaná, bloky tinty nepoužívají), ✓ cesta (K5: lišta, přehled, karta cesty; po K5 `--pc` 75, tint 23, soft 7), ✓ stránky z dat a deník (K6: zbývá `--pc` 30, tint 11, soft 3, plate a on-plate 0; tinty jen mapa, `MiniOsa.astro` a nepoužívaný `ui/Mince.astro`) | K4 (tinty ve zpětné vazbě, Mince v blocích), K6 (hlavička období), K7 (kresby, mini mapa, mini osa) |
| `--period-N-tint`, `-soft`, `-plate`, `-on-plate` | dnešní hodnoty | přes `--pc-*` | K3 až K7, pak smazat |
| `--fs-display-1`, `--fs-display-2` | `--fs-jmeno` | jen třídy `.t-display-*` v `global.css`; ✓ stránky osob (K3: titulek s pruhem), žádná komponenta je už nepoužívá | O je smaže i s třídami (K6 je nepotřebuje) |
| `--r-xs`, `--r-sm`, `--r-md`, `--r-lg`, `--r-full` | `--r-razitko`, `--r-ovladani`, `--r-plne` | 70 míst (dřív 132; `--r-sm` 22, `--r-md` 17, `--r-full` 13, `--r-xs` 18); ✓ rám (K2), ✓ rám aktivity, Volba, Odkryj, tlačítka (K4a), ✓ bloky (K4b), ✓ cesta (K5); `--r-lg` už nepoužívá nikdo; po K6 `--r-sm` 10, `--r-md` 4, `--r-full` 4, `--r-xs` 16 (✓ K6) | K3 až K7, `--r-lg` smaže O |
| `--stin-mapa`, `--stin-list` | `--lezi`, `--lista-stin` | ✓ 0 (K7a: Mapa a čas); ✓ rám (K2: hledání) | O je smaže |
| `--pohyb-rychle`, `--pohyb`, `--pohyb-kamera` | `--d-stisk`, `--d-listek`, `--d-kamera` | 117 výskytů (počítáno i s `var(--pohyb…)` v hodnotách); ✓ stránky osob (K3: vstupy, obsah profilu), ✓ tlačítka bloků, Volba, Odkryj, Tlacitko.astro (K4a: `--pohyb-rychle` 18 místo 26), ✓ bloky (K4b), ✓ cesta (K5: `--pohyb-rychle` 3, `--pohyb` 20, `--pohyb-kamera` 15); po K6 `--pohyb-rychle` 0, `--pohyb` 18, `--pohyb-kamera` 14 (kresby, K7b) | K6, K7 |
| `--map-*` | od K7a přezdívky na `--list`, `--tuzka`, `--listek`, `--ink-2` | ✓ Mapa a čas (K7a); zbývá jen `MiniMapa.astro` (9) | K7b (mini mapa jako výstřižek), O je smaže |

**Co přezdívka nepokryje (práce pro K2 až K7):**

- ~~**K2:** hlavička a spodní lišta mají plné pozadí `--paper` bez stínu; logo Agora, vtlačená aktivní položka, vystouplý Můj deník a hledání ve vtlačené drážce chybí.~~ Hotovo v K2 (oddíl Po K2).
- ~~**K3:** desky s fotkou jsou dál v duotónu období (`--pc-plate`), ne na listu s páskami a filtrem `--foto`; jméno není na vytrženém listu s pruhem; mince místo razítka člověka.~~ Hotovo v K3 (oddíl Po K3).
- ~~**K4:** bloky jsou plochá karta `--surface` s linkou a zaoblením 10 px; hlavní tlačítko je plný inkoust bez `--vyst-ink`; možnosti Volby nejsou vystouplé; zpětná vazba je tinta, ne `.listek-paska` s `.rozlozit`; pole na psaní nejsou v Kalamu.~~ Hotovo v K4a a K4b (oddíly Po K4a, Po K4b).
- ~~**K5:** lišta cesty a drážka postupu jsou ploché; lístek cesty nemá pahýl.~~ Hotovo v K5 (oddíl Po K5).
- ~~**K6:** pás období je dnešní plynulý pruh, ne odtrhávací lístky; štítky otázek, karta týdne a kolečka hodiny jsou tinty.~~ Hotovo v K6 (oddíl Po K6).
- **K7:** mapa má moře a pevninu z `--map-*`, ne výstřižek staré mapy; kresby berou tři tóny z desky (`--pc-plate`, `--pc-on-plate`), ne koláž z papíru.

### Co se na webu změnilo už teď

Každá stránka leží na tečkovaném papíře v nových barvách: papír je chladnější a šedší (`#EFEDE6` místo `#F4EFE6`), noc je noční zápisník (`#1D1B18`). Inkoust je o odstín teplejší. Nadpisy h2, h3 a citát jsou o kus menší, text na telefonu má 18 px. Okraj stránky na notebooku je 48 px místo 80, takže obsah je širší. Tlačítka a bloky mají zaoblení 10 px místo 8 a 14. Najetí je rychlejší (120 ms místo 150) a při omezeném pohybu se ruší i zpoždění. Rozvržení, komponenty a texty zůstávají, jak byly; stránky se nerozbily (snímky níž).

### Testy a kontrola

- `npm run build` prošel. Kontrola typů (`astro check`) bez chyb, Vitest: 1 121 testů prošlo. `tests/data/kontrast.test.ts` hlídá nově 234 dvojic ve dne i v noci: čtyři inkousty na papíru, listu, ploše a lístku, tužka jako hranice 3 : 1, text na hlavním tlačítku, inkoust období na papíru, listu a lístku, text na pruhu všech osmi období, razítko místa s průhledností, a do K7 staré tinty a desky.
- Kontrast nových dvojic jsem spočítal i jednorázovým skriptem (`scripts/kontrast-k1.mjs`, po výpisu smazaný): nejnižší text ve dne 4,71 : 1 (razítko místa období 4 na papíře), v noci 4,58 : 1 (razítko místa období 1 na lístku); nejnižší hranice tužkou 3,24 : 1 ve dne a 3,34 : 1 v noci. Text na pruhu období má nejméně 5,48 : 1 (období 4).
- Playwright (celá sada, 713 testů) prošel po třech opravách: prohlídka a přepínač režimu ověřovaly barvu papíru natvrdo (`prohlidka.spec.ts`), graf barvu inkoustu (`graf.spec.ts`) a axe našel `--muted` na tintě období 2 (Mapa a čas, Dva životy) s 4,47 : 1, což vyřešila stará hodnota přezdívky. Celé `npm test` pak prošlo až na dva testy kreseb v `jeskyne.spec.ts`, které po tabulátoru měřily polohu tlačítka nad lištou cesty hned, ještě během plynulého posunu (text 18 px na telefonu posunul tlačítko blíž k liště a závod se projevil zhruba jednou z pěti). Měří teď až po dojetí posunu (`expect.poll`); deset běhů po sobě prošlo.
- **Snímky:** testy v repozitáři žádné referenční snímky nemají (snímky v `test-results/` jsou jen pro prohlédnutí a Playwright je maže), takže se žádné neaktualizovaly. Snímky pro autora jsou v `Claude outputs/snimky/design-v2-k1/`: `domu-`, `sokrates-` a `krok2-` (cesta 1, krok 2) na 390 a 1440 px ve dne (`light`) i v noci (`dark`), a `kalam-cestina.png`.

### Nad čím jsem váhal a co by šlo jinak

- **Průhlednost razítka místa 0,96 místo 0,92 z plátna.** S 0,92 má text razítka období 4 ve dne a období 1, 2 a 7 na lístku v noci 4,32 až 4,44 : 1. Jinak: nechat 0,92 a ztmavit inkoust období, ale inkousty drží barvy, které student zná z mapy a osy.
- **Natočení ve vlastnosti `rotate`, ne v `transform`.** List, páska, razítko a karta se tak dají rozložit, otisknout nebo zvednout animací `transform`, a natočení zůstane. Jinak: natočení v `transform` a animace s ním v každém snímku, což by každá komponenta musela opakovat.
- **Omezený pohyb 0,01 ms místo `none`.** Animace tak skončí ve svém posledním snímku a události konce přijdou jako jindy (na nich stojí některé ostrovy); zpoždění se ruší, takže příchod po částech je hned celý. Rozložení lístku a dopad razítka mají `none`, protože jejich klidový styl už je konec pohybu.
- **`--sunk` jako papír smíchaný s linkou.** Nový systém zapuštěnou barvu nemá (vtlačené je papír se stínem), ale 25 míst ji dnes používá jako podklad přepínačů a najetí; bez ní by splynula s papírem. Zmizí s K4 a K7.
- **Okraj 48 px už v K1.** Je to hodnota z D2 a rám ji v K2 stejně převezme. Jinak: nechat 80 px do K2; obsah na notebooku by se pak rozšířil až s novou hlavičkou.
- **Display jako jméno.** `--fs-display-1` a `-2` ukazují na `--fs-jmeno` (104 / 56 px), protože Po D4 větší display nepřidává. Dnes je žádná stránka nepoužívá, takže se nic nezměnilo.
- **Razítko člověka jen jako CSS.** SVG s textem po obvodu, ikonou atributu a filtrem nedotištěného inkoustu je komponenta; postaví ji K3 místo `Mince.svelte`, aby ikony šly ze spritu atlasu.
- **Kalam bez přednačtení.** Zatím ho nic nepoužívá, takže se ani nestáhne; přednačtení latin podmnožiny 700 přijde s pruhem se jménem v K3 (je na první obrazovce profilu).
- **Jména tříd** jsem volil tak, aby se nepotkala s třídami komponent: `list`, `pruh`, `mince`, `karta`, `deska` a `tecky` už v komponentách jsou, proto `.papirovy-list`, `.titulek-pruh`, `.razitko-cloveka`, `.lezi-odkaz` a `.papir`.

