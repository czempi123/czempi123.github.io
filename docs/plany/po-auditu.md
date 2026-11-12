# Plán dalšího postupu (po auditu, verze 2)

12. 11. 2026 · Fable 5.2 · nahrazuje verzi 1 z téhož dne. Podklad: `docs/revize/audit-2026-11-12.md`, `docs/revize/recenze-obsahu-2026-11-12.md`, `docs/revize/recenze-mapa-denik-2026-11-12.md` a odpovědi autora z 12. 11. Krok A0 plán 12. 11. 2026 zapsal do `docs/plany/design-v2.md` (fáze 1), `docs/plany/stredovek.md` (fáze 4), `docs/plan.md` (Další větve v pořadí, větve, modely), `docs/rozhodnuti.md` a `docs/navraty.md`; kde se tyhle soubory s tímto plánem liší, platí ony. Tady zůstává zdůvodnění, katalog aktivit a fáze 2, 3 a 5, dokud je nepřevezmou jejich větve.

## Co platí (autor, 12. 11. 2026)

- **Nejdřív dodělat design** v plném rozsahu, jak je navržený.
- **Průchod atlasem má být hlavně zábavný a pestrý:** text, interaktivní lekce, videa, zvuk, testy, hry; čím víc různých forem a druhů paměti, tím líp. Stejná aktivita na každé stránce (Kdo žil dřív?) není cíl.
- **Hotový obsah se teď nemění.** Revize obsahu je samostatná fáze, až bude atlas celý. Do té doby se postřehy jen sbírají (`docs/navraty.md`).
- **Zkoušku dělá autor sám** proklikáváním; zkouška se čtenáři přijde s revizí obsahu.
- **Závěrečná práce počká,** až bude projekt hotový.

## Fáze

| Fáze | Co | Větve | Kdy |
| --- | --- | --- | --- |
| 1 | Dokončit design a dotáhnout ho pro hry | `design-v2` | teď |
| 2 | Herna: knihovna nových aktivit | `herna-v1`, `denik-v2`, `film-0` | po sloučení designu |
| 3 | Úklid skillů a plánů, pravidla pestrosti do skillů | `uklid-v1` | před celkem 11 |
| 4 | Období 3 až 8, každé s rozpisem aktivit | `celek-11` a dál | potom |
| 5 | Revize obsahu celého atlasu, zkouška se čtenáři, zveřejnění, závěrečná práce | později | až bude atlas celý |

## Fáze 1: design dotáhnout

Zapsáno v `docs/plany/design-v2.md` (tabulka kroků, oddíly Po auditu, Vizuální zlepšení, Mapa a deník: funkce, zadání D5, K4a a K4b). Rozsah zůstává celý včetně mapy jako výstřižku, kreseb jako koláže a pojmů. Návrh z verze 1 zmenšit K7 beru zpět: kresby jsou to, co má atlas nejzábavnějšího, a mají vypadat nejlíp.

## Fáze 2: herna

### Zásada

Autor, 12. 11. 2026: aktivita je tu od toho, aby si z ní student něco vzal, a nesmí ho nechat jen přijímat. Každá projde čtyřmi otázkami:

1. **Odnese si něco?** Po aktivitě umí říct jednou větou, co se dozvěděl o filozofovi nebo o sobě.
2. **Přemýšlí sám?** Něco rozhoduje, tvoří, hledá nebo hádá; jen číst a klikat Dál nestačí.
3. **Zůstává otevřená?** Smí skončit bez hotové odpovědi. Má podnítit vlastní názor, hodnoty a kritické myšlení, ne ověřit shodu s filozofem.
4. **Chtěl by ji udělat, i kdyby nemusel?** Když ne, hledá se jiná forma téže myšlenky.

Recenze antiky (`docs/revize/recenze-obsahu-2026-11-12.md`) ukázala, že body 1 a 3 atlas plní už dnes a dobře. Slabé jsou forma (z 90 míst, kde student v cestách něco dělá, je jen 13 hraček; zbytek je volba, věta do pole a třídění) a bod 4. Nejvíc baví čtyři druhy: **vytvoř** (ceník po Kratétovi), **spočítej o sobě** (spočítej si den), **zažij** (třetí čára), **hádej a zjisti** (otrok, nebo císař?).

### Katalog aktivit

Tučně jsou hotové. Formáty se staví jednou a plní se z dat nebo z YAML; hračky jsou jedinečné a patří jedné myšlence.

| Co cvičí | Aktivity |
| --- | --- |
| Rozhodnutí a důvod | **Volba, Změň jednu věc, Spor, Kdo je na tvé straně**; Porota (vyslechneš žalobu a obhajobu, hlasuješ, pak uvidíš, jak to dopadlo: Sókratés, Hus, Galilei, Eichmann); Obhaj opak (dostaneš stranu, se kterou nesouhlasíš, a vybereš její dva nejsilnější důvody) |
| Vybavení z paměti | Kdo to řekl?; Kdo by to řekl? (dnešní věta, který filozof by ji podepsal); Doplň citát; Co ti zůstalo? (kvíz na konci období s vysvětlením, bez bodů); kartičky v deníku s rozestupem |
| Odhad a překvapení | **Kdo žil dřív?**; Tipni si (posuvník: kolik let je dělí, kolik lidí v pokusu poslechlo; pak odhalení) |
| Čas | **Dva životy, osa hlasů**; Seřaď na ose (pět karet do pořadí) |
| Prostor | **Přehrát život**; Kde to bylo? (klepni do slepé mapy); Cesta knihy (táhni Aristotela z Athén přes Bagdád a Córdobu do Paříže) |
| Stavba myšlenky | **Slož argument, Roztřiď**; Najdi slabé místo (klepni na premisu, kterou odmítáš, a uvidíš, kdo ji odmítl taky); Páry (pojem a situace, ne pojem a definice); Pravý, nebo podvržený? (citát z internetu: řekl to, nebo ne) |
| Čtení pramene | **Odkryj**; Úryvek s otázkou (označ větu); Dialog (rozhovor, který se větví) |
| Obraz a pohyb | **třináct kreseb**; Příběh v obrazech (čtyři až šest panelů koláže, student sám listuje); minutový film (animovaná scéna s titulky) |
| Sluch | Poslechni si (příběh nebo báseň nahlas, s přepisem) |
| Zkušenost | **Zkus to žít, Stoický týden, Návrat**; Zeptej se tří lidí; minuta s časovačem (pohled shora, Létající člověk se zavřenýma očima) |
| Tvorba | Napiš s formou (ceník, heslo, zákon pro partu, dopis filozofovi); Totéž znovu (stejné třídění před výkladem a po něm) |
| Vlastní čísla | **Spočítej si den**; další počítadla z vlastního života (kolik z toho, co víš, jsi viděl sám) |
| Sbírání | deník jako zápisník (fáze 1, K6) |

### Hračky podle období (výhled)

- **3 Středověk:** Parta (posuvník: kolik kamarádů je u toho?), Kolo Štěstěny, Ockhamova břitva (škrtni, co výklad nepotřebuje), Cesta knihy, Buridanův osel.
- **4 Renesance:** Descartův démon (škrtej, čím si ještě můžeš být jistý), Jsi poradce vladaře (rozhodovací příběh), Pascalova sázka jako tabulka.
- **5 Osvícenství:** Vrah za dveřmi (Dialog s Kantem), Dva obrazy (je krása věc vkusu?), Ostrov (napiš tři pravidla, pak přijde spor).
- **6 19. století:** Panoptikon (díváš se, nebo jsi viděn), Buď, anebo (rozhodovací příběh), Tvůj týden znovu a znovu.
- **7 20. století:** Je to věda? (detektiv s Popperem), Sartrův student, Brouk v krabičce (hra pro dvojici ve třídě).
- **8 Dnes:** Tramvaj s výhybkou, Závoj nevědomosti (navrhni společnost, pak si vylosuj místo v ní), Čínský pokoj (odpovídej podle pravidel na znaky, kterým nerozumíš), Poznáš člověka? (předepsané odpovědi, bez AI).

### Pravidla pestrosti

Platí od celku 11; do skillů je zapíše `uklid-v1`. Kopie je v `docs/plany/stredovek.md` › Po auditu.

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

### Větve

| Větev | Co postaví | Zkouška na obsahu |
| --- | --- | --- |
| `herna-v1` | Formáty z dat: Kdo to řekl? a Kdo by to řekl?, Tipni si, Seřaď na ose, Kde to bylo?, Doplň citát, Páry, Pravý, nebo podvržený?, Najdi slabé místo; střídání malých aktivit na stránkách osob; na mapě Výpravy a Přehrát období | každý formát jednou v dílně a na jednom místě antiky jako přídavek; hotový text se nepřepisuje |
| `denik-v2` | Co ti zůstalo? pro antiku, kartičky s rozestupem, vystřižené citáty | Tvoje antika |
| v celcích | Dialog, Úryvek s otázkou, Porota, Příběh v obrazech, Poslechni si a hračky | vzniknou v celku, který je první potřebuje |
| `film-0` (zkouška) | Jedna animovaná scéna do minuty s titulky (Augustinovy hrušky) a jedna nahrávka Poslechni si namluvená autorem | rozhodne, jestli film a zvuk dostane každý celek |

**Video a zvuk.** Vložené cizí video (YouTube) odporuje pravidlu, že atlas nic nenačítá zvenku, a odkazy stárnou. Proto vlastní krátké animované scény v kódu (jako jeskyně) a zvuk namluvený autorem: učitelův hlas je věrohodnější než strojový. Hotové video jako soubor zkusí `film-0`; jak dobře vyjde, předem nevím.

## Fáze 3: úklid

Jako ve verzi 1: skilly do 8 kB s referencemi, `pouceni.md` na tři části, krátké plány větví, katalog modelů (Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5; v `docs/plan.md` opravený už v A0). Navíc: katalog aktivit a pravidla pestrosti jako reference skillu `atlas-cesta`, rozpis aktivit jako povinná část plánu období ve skillu `atlas-obdobi`, pravidlo rytmu vět v `atlas-psani` (audit, nález 5). Model: Fable 5.2 · high.

## Fáze 4: středověk s rozpisem aktivit

Zapsáno v `docs/plany/stredovek.md` › Po auditu (rozpis aktivit celků 11 až 15 a pravidla pestrosti). `antika-dluh` zůstává v plánu období, kde je. Po souhrnné revizi středověku se změří, co období stálo, a rozhodne se hloubka období 4 až 8.

## Fáze 5: revize obsahu (později)

Do té doby se nic hotového nepřepisuje. Postřehy z autorova proklikávání i z auditu (rytmus vět, stejné konce úvodů, dlouhý poslední krok, aktivity do antiky) se zapisují do `docs/navraty.md`: kde, co, jedna věta. Fáze 5 pak: revize antiky i dalších období podle zápisníku, doplnění aktivit do antiky, zkouška se čtenáři (skill `atlas-zkouska`), zrušení `noindex`, závěrečná práce.

**Na co se při proklikávání dívat:** kde jsi přeskočil text, kde ses nudil, kterou aktivitu bys udělal znovu, kde jsi nevěděl, co máš dělat, co bylo na telefonu malé nebo pomalé, a kde sis řekl „tohle už tu bylo“.

## Co rozhodnout

Prázdná odpověď znamená souhlas s doporučením. Autor 12. 11. 2026: „U otázek souhlasím, může to tak být.“

1. **Deník jako zápisník se sbírkou** (razítka, pahýly lístků, vystřižené citáty) už v K6? Doporučuji ano.
   Odpověď: souhlasím (12. 11. 2026)

2. **Kvíz Co ti zůstalo? a kartičky:** výsledek bez bodů, jen „víš“ a „zopakuj si“ s odkazem zpět? Doporučuji ano; zásada bez bodů za názory zůstává, tady jde o znalost.
   Odpověď: souhlasím (12. 11. 2026)

3. **Přídavky v antice při stavbě herny** (každý nový formát na jednom místě, nic se nepřepisuje)? Doporučuji ano.
   Odpověď: souhlasím (12. 11. 2026)

4. **Zvuk namluvíš sám?** Doporučuji ano, zkouška ve `film-0`. Když ne, zůstane zvuk na později.
   Odpověď: souhlasím (12. 11. 2026)

5. **Odkazy na cizí videa** jako karta „Podívej se jinde“ (otevře se v novém okně, nic se nevkládá)? Doporučuji ne; raději vlastní scény.
   Odpověď: souhlasím s doporučením, tedy ne (12. 11. 2026)

6. **Klidný režim jako přepínač v záhlaví?** Doporučuji ano.
   Odpověď: souhlasím (12. 11. 2026)

7. **Tichá tečka u ikony Deník, když čeká Návrat?** Doporučuji ano. Jde proti rozhodnutí z 2. 10. (Návrat nabízí jen deník, jinde nic); bez ní ale Návrat uvidí jen ten, kdo deník otevře sám. Tady prázdná odpověď souhlas není.
   Odpověď: souhlasím, ano (12. 11. 2026)

## Zadání A0: zápis plánu do repozitáře

Hotovo 12. 11. 2026 (Opus 5.5 · medium). Zadání je v historii tohoto souboru v Projektu Claude a v gitu.
