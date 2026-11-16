# Větev design-v2, část: cesta, stránky z dat a deník

Část plánu větve `docs/archiv/plany/design-v2.md` (oddíl Části plánu). Plán se 15. 11. 2026 rozdělil, aby každý soubor pro Projekt Claude měl pod 35 kB; text oddílů je beze změny.

## Po K5 (14. 11. 2026)

Odpovědi po K4b byly prázdné v repozitáři i v Projektu Claude, takže platí všech sedm doporučení a bloky se neměnily. Během práce autor upozornil (14. 11. ráno), že čísla v kroužcích v průchodu jsou zase mimo střed: kroužek perem na novém lístku měl polohu z okrajů a mřížka místa ho posunula o 7 px doleva, stejně jako ve Volbě v K4a. Teď ho drží střed čísla (rozdíl pod 0,3 px na 390 i 1440 px) a hlídá to test. Snímky jsou v `Claude outputs/snimky/design-v2-k5/`.

### Co se na cestě změnilo

- **Lístek cesty, který se štípe** (`src/components/cesta/ListekCesty.astro`, bod 4): týž lístek s pahýlem jako v hlavičce profilu. Místo každého kroku je kruh s číslem tužkou; prošlý krok je vyštípnutá dírka, běžící krok číslo v kroužku perem studenta. Když student přijde Dalším krokem z předchozího kroku, dírka předchozího kroku se vyštípne (`--d-listek`, `--k-dopad`) a kroužek se dotáhne (`--d-tah`), obojí až po posunu listu. Na posledním kroku, jakmile je závěrečné pravidlo uložené, se pahýl utrhne u perforace, stočí se a spadne (`--d-list`, `--k-list`), na lístku zůstane natržený okraj. Pahýl tím „přistane v deníku“: `cesty[slug].pahyl` s časem (nové nepovinné pole, drží ho spojení deníků i další návštěvy kroků); sbírku pahýlů ukáže K6. Čtečka slyší „Cesta je za tebou. Pahýl lístku je v tvém deníku.“ Po obnovení stránky a při omezeném pohybu je všechno rovnou na konci. Stav z deníku nastaví skript před vykreslením (`stavKroku` a `pouzijStavKroku` v `src/lib/postup.ts`, vložené jako text), takže dírky ani lišta po načtení neproblikne; pohyb a zápis hlídá `src/scripts/postup-cesty.ts`.
- **Lišta cesty** (`CestaHlavicka.astro`): na notebooku pod záhlavím webu (nový slot `pod-hlavickou` v `Zakladni.astro`), mezi dvěma linkami, s Přehledem cesty vlevo, lístkem s názvem cesty a „Krok n z N“ uprostřed a Uložit a odejít vpravo; nedrží (drží záhlaví). Na telefonu (pod 900 px) je místo záhlaví webu nahoře a drží: zpět ikonou, lístek s „Krok n z N“ nad místy a s pahýlem jen s počtem kroků, Odejít. Vejde se i cesta s devíti kroky (místa 18 px). Tečky kroků s odkazy jsou pryč; na kroky vede seznam na přehledu cesty.
- **Tichý Další krok** (`CestaLista.astro`): krok s blokem s odpovědí (Volba, Odkryj, Roztřiď, Změň jednu věc, Spor, Slož argument, Kdo žil dřív?, Závěr cesty) má Další krok podtržený tužkou, dokud poslední takový blok v kroku není hotový (aktivita bloku v deníku, u závěrečného pravidla neprázdný zápis; `blokKroku` vybere blok při sestavení). Pak se Další krok rozsvítí na plný inkoust; po Začít znovu zase ztichne. Krok bez takového bloku (Příběh, kresba, zastánci) má Další krok hlavní hned. Tichý Další krok jde stisknout: tím student krok výslovně přeskočí.
- **Nic dvakrát vedle sebe:** blok v kroku cesty už pod lístkem zpětné vazby nenabízí „Další krok: …“, když vede tam, kam lišta (`BlokDal.svelte`); vlastní Kam dál na kotvu (první ze dvou bloků, šaty v cestě 1) zůstává. Pata na telefonu drží jen s tlačítkem (vlastní čin bloku), prázdný hlavní čin místo nebere.
- **Spodní lišta** podle D4: tečkovaný papír se stínem nahoru (`--lista-stin`) místo plochy s linkou, Předchozí vystouplé, Další krok tichý nebo hlavní; při posunu listu stojí.
- **Přechod mezi kroky:** krok n → n+1 a zpět (pozná se z adres přes `navigation.activation`, jinak z adresy uložené při odchodu; `typPrechoduKroku`) posune list o šířku okna (`--d-list`, `--k-list`, typy `krok-dal` a `krok-zpet`); lišta cesty, záhlaví a spodní lišta stojí. Návrat v historii z kroku 2 na krok 1 je posun zpět, z 1 na 2 posun dál. Mezi ostatními stránkami (krok → přehled, přehled → krok) se list dál otáčí jako v K2. Při omezeném pohybu je nový krok hned.
- **Přehled cesty:** nad Začít / Pokračovat stojí týž lístek bez názvu (dírky prošlých kroků, po dokončení bez pahýlu); razítka lidí místo mincí; seznam kroků jako řádky v zápisníku s čárkovanou linkou, číslo v kruhu tužkou a prošlý krok v dírce.
- **Karta cesty** (`CestaKarta.astro`; profil, otázka, období): lístek s pahýlem (počet kroků, minuty), razítka lidí, název a vstup; po najetí se pahýl u perforace odtrhne jako v hlavičce profilu. „Vydat se na cestu“ je tiché tlačítko, odkazem je celý lístek.
- **Volba jako kroužkovací arch** (připomínka autora 14. 11. během K5: možnosti A, B, C vypadaly pořád jako štípací lístky, které teď patří cestě, jen se kroužkovaly): možnosti jsou vystouplé proužky papíru bez pahýlu, perforace a dírky; na okraji písmeno jako u testu, zvolené písmeno zakroužkuje pero a proužek se vtlačí. První verze měla u každého písmene prázdné kolečko tužkou; autor chtěl kroužek až u zvolené možnosti (14. 11.). Snímky `volba/` (před volbou, s výběrem a po tahu, 390 a 1440 px, den a noc; `scripts/snimky-volba-k5.mjs`).
- **Lišta hodiny** měří výšku té hlavičky, která drží (na telefonu v kroku lišta cesty, na notebooku záhlaví webu; `src/scripts/hodina-lista.ts`).

### Přezdívky

Odškrtnuté v tabulce Po K1 (cesta K5): `--paper`, `--surface`, `--rule`, `--muted`, `--pc`, `--pc-tint`, `--pc-soft`, `--pohyb-rychle`, `--r-sm`, `--r-md`, `--r-full`. Komponenty cesty (`CestaHlavicka`, `CestaLista`, `ListekCesty`, `PostupCesty`, `CestaKarta`, přehled a krok) už žádnou přezdívku nepoužívají. Zbývá (počet `var(--…)` v `src` mimo `tokens.css`, v závorce před K5): `--paper` 18 (19), `--surface` 55 (60), `--sunk` 14 (14), `--rule` 78 (82), `--muted` 53 (55), `--pc` 75 (84), `--pc-tint` 23 (24), `--pc-soft` 7 (8), `--pohyb-rychle` 3 (4), `--pohyb` 20 (20), `--pohyb-kamera` 15 (15), `--r-sm` 22 (23), `--r-md` 17 (19), `--r-full` 13 (16), `--r-xs` 18 (18). Zbývají deník, Domů, období, osa hlasů, týden, hodina (K6), mapa a kresby (K7a, K7b).

### Testy a kontrola

- `npm run build` prošel. Vitest celý; nový `tests/data/postup.test.ts` (blok, na který krok čeká, a že každý poslední krok čeká na závěrečné pravidlo; stav lístku z deníku i z rozbitého deníku a jako text ve skriptu; typ přechodu z adres; pahýl v deníku jednou, návštěva kroku ho nesmaže, spojení deníků drží dřívější).
- Playwright `cesta`, `cesta2` až `cesta8`, `cesta33`, `cesta34`, `pruchod`, `ram-aktivity`, `ram`, `fokus-lista`, `prohlidka`, `hodina-student`, `spor-reflexe`, kresby v krocích (`saty`, `jeskyne`, `lod`, `treti-cara`, `stred`, `zrcadlo`, `kresby-pokusu`), `zaver`, `navrat`, `denik`, `domu`, `otazka`, `platon` a nový `listek-cesty.spec.ts` (lístek na 390 a 1440 px, kroužek na středu čísla, záhlaví webu jen na notebooku, tichý a rozsvícený Další krok i před hydratací, Začít znovu, přeskočení, odtržení pahýlu a deník, přehled s týmž lístkem, štípnutí jen po Dalším kroku a ne po obnovení ani při omezeném pohybu). Upravené testy: místo Kam dál z bloku se Další krok hledá v liště a musí být rozsvícený (pomůcka `dalsiVListe` v `tests/e2e/strany.ts`; cesty, `pruchod`, `spor-reflexe`, `ram-aktivity`, `hodina-student`); běžící krok se ověřuje na lístku (`aria-current="step"`), ne na tečce s odkazem; `fokus-lista` nepočítá prvky záhlaví webu, které je od K5 i nad krokem cesty na notebooku. Lišta hodiny na telefonu v kroku cesty ležela pod skrytým záhlavím webu (`hodina-student`): opraveno v `hodina-lista.ts`.
- `scripts/kontrola-fokus.mjs` na krocích 1/1, 1/2, 1/7, 6/2 a na přehledu cesty 1 (390 a 1440 px): bez nálezu.
- Klávesnicí (jednorázový skript, smazaný) na 390 × 844, 390 × 640, 1440 × 900 a 1440 × 700, kroky 1/2, 1/5 a 6/2, 40 tabulátorů dopředu a 40 zpátky: prvek s fokusem nikdy pod horní lištou cesty, spodní lištou ani držící patou bloku.
- **Přechod v opravdovém Chromu** (`scripts/overeni-prechodu.mjs`, rozšířený o kroky; Chrome 153): krok 1 → 2 typ `krok-dal` (lišta cesty, záhlaví a spodní lišta jako samostatné skupiny, root se posune) a dírka kroku 1 se štípe, krok 2 → 1 `krok-zpet`, Zpět v historii z 1 na 2 `krok-dal`. Krok → přehled a přehled → krok se otáčí (`dalsi`). Při klikání po 1,5 s Chrome přechod na přehled někdy vynechal (pět ze šesti), při 3 s proběhlo šest ze šesti: přechod se neruší, jen nezačne, dokud předchozí stránka ještě dojíždí.
- **Kontrast** nových dvojic (jednorázový skript, smazaný), nejmenší den / noc: číslo volného místa `--ink-3` na lístku 5,55 / 5,91; „Krok n z N“ `--ink-2` 10,43 / 9,61; kroužek a číslo perem 7,23 / 7,68 (sépiové); kruh místa tužkou 3,51 / 4,18; počet kroků v pahýlu (inkoust období na ploše) 5,53 / 6,03; tichý Další krok 13,68 / 14,09 a jeho podtržení 3,24 / 4,65; číslo prošlého kroku v seznamu 5,12 / 6,57. Všechny dvojice už hlídá `tests/data/kontrast.test.ts` (inkousty, pera a tužka na všech plochách, inkoust období na ploše), nové trvalé dvojice nepřibyly. Dírka proti lístku (papír na ploše 1,08 / 1,11) je ozdoba; prošlý krok nese i zmizelé číslo, stín dírky a věta pro čtečku.
- **Celé `npm test`** jednou před commitem: kontrola typů bez chyb, Vitest 1 334 testů, Playwright 740 testů, vše prošlo napoprvé (8,4 min). Po připomínkách k Volbě (kroužkovací arch, kroužek až u zvolené možnosti) prošlo celé `npm test` ještě jednou před commitem: kontrola typů, Vitest 1 334, Playwright 740 (8,8 min).
- **Snímky** v `Claude outputs/snimky/design-v2-k5/`: `lista/` (lišta cesty a spodní lišta na prvním, prostředním a posledním kroku cesty 1, poslední krok i po uloženém pravidle a přehled po dokončení; 390 a 1440 px ve dne i v noci; skládanky `telefon-light.jpg`, `telefon-dark.jpg`, `notebook-light.jpg`, `notebook-dark.jpg`; skript `scripts/snimky-lista-cesty.mjs`) a `cesty/` (cesta 1 a 6 na 390 px s odpověďmi i bez, na 1440 px v noci s odpověďmi).

### Nad čím jsem váhal a co by šlo jinak

- **Přeskočit krok bez vlastního tlačítka.** Tichý Další krok je sám výslovné přeskočení: kdo ho stiskne, odejde dál. Zvlášť „Přeskočit krok“, které by jen rozsvítilo Další krok, by byl klik navíc. Jinak: tichý odkaz „Přeskočit krok“ vlevo v patě bloku (otázka 4).
- **Blok v kroku cesty už nenabízí Další krok.** Po odpovědi se rozsvítí lišta a pata bloku zůstane se Začít znovu. Pro klávesnici je Další krok až na konci stránky (za textem kroku), dřív byl hned pod lístkem. Jinak: blok by dál nabízel „Další krok: …“ a lišta by zůstala tichá, ale pak by vedle sebe stála dvě tlačítka pro totéž, jakmile blok dojede ke spodní liště (otázka 3).
- **Pahýl se odtrhne po uloženém pravidle**, ne při příchodu na poslední krok a ne až po Dokončit cestu. Při příchodu by se odtrhl dřív, než student poslední krok udělal; po Dokončit cestu by odtržení nebylo vidět (stránka odchází). Na notebooku lišta cesty nedrží, takže odtržení uvidí jen ten, kdo je u lišty nahoře; na telefonu je lišta vidět vždy. Jinak: na notebooku lišta cesty drží pod záhlavím (o 76 px víc stálého rámu), nebo se pahýl odtrhne znovu na přehledu cesty po Dokončit cestu.
- **Místa kroků nejsou odkazy.** Na telefonu by odkazy měly 18 px a nejde je trefit; na kroky vede seznam na přehledu. Jinak: odkazy jen na notebooku (24 px).
- **Krok přeskočený skokem** (z kroku 1 rovnou na 5) nemá dírku, i když je cesta dokončená: dírka je jen za krok, který student otevřel.
- **Typ přechodu i podle historie:** Zpět z kroku 2 na krok 1 je posun zpátky, Vpřed z 1 na 2 posun dál, protože rozhoduje adresa, ne směr v historii. Odpovídá to tomu, co student vidí v lístku.
- **Lišta cesty na notebooku nedrží**, jak ji kreslí D4. Pod záhlavím by zabrala dalších 76 px stálého rámu.
- **Karta cesty má „Vydat se na cestu“ jako tiché tlačítko.** Dřív to bylo hlavní tlačítko, ale lístek je odkaz celý a na stránce otázky by vedle sebe stály čtyři hlavní tlačítka.

## Co rozhodnout po K5

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-k5/`). Prázdná odpověď znamená souhlas s doporučením.

1. **Volba jako kroužkovací arch** (snímky `volba/volba-*`, `volba-vyber-*`, `volba-po-tahu-*`): proužky papíru s písmenem na okraji, kroužek perem až u zvolené možnosti. Doporučuji ano.
   Odpověď:

2. **Lístek cesty v liště** (skládanky `lista/telefon-*.jpg` a `lista/notebook-*.jpg`): dírky prošlých kroků, kroužek perem u běžícího kroku, pahýl s počtem kroků, po posledním kroku odtržený. Doporučuji ano.
   Odpověď:

3. **Další krok tichý, dokud student neodpoví, a blok ho pak neopakuje** (snímky `lista/krok4-*` a `cesty/…-odkryt-*`): Další krok jen v liště. Doporučuji ano.
   Odpověď:

4. **Přeskočit krok:** stačí tichý Další krok (kdo ho stiskne, krok přeskočí), nebo chceš i výslovné tiché „Přeskočit krok“ v patě bloku? Doporučuji nechat jen Další krok.
   Odpověď:

5. **Pahýl se odtrhne po uloženém závěrečném pravidle** (snímky `lista/krok7-hotovo-*`, odtržení naživo v náhledu na telefonu). Doporučuji ano.
   Odpověď:

6. **Lišta cesty na notebooku pod záhlavím webu, nedrží; na telefonu místo záhlaví a drží.** Doporučuji ano.
   Odpověď:

7. **Přechod mezi kroky: posun listu** (vyzkoušej v náhledu Další krok a Předchozí; mezi ostatními stránkami se list dál otáčí). Doporučuji ano.
   Odpověď:

8. **Chceš něco změnit na snímcích po K5?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání K6: stránky z dat a deník

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K5 (prázdná odpověď znamená souhlas). Je to velký krok: když se nevejde do jednoho sezení, udělej nejdřív deník (bod 2) a zapiš, co zbylo.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K6 větve design-v2, stránky z dat a deník. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co je na kterých obrazovkách: Domů, Velká otázka 1, Období 2, Můj deník; Co se proti design systému změnilo), Po K1 (přezdívky), Po auditu (body 5, 6 a 10 z Vizuálních zlepšení, Pravidlo střídmosti, Mapa a deník: funkce), Po D5 (papírnictví období), Po K4b, Po K5 a Co rozhodnout po K5 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a oddíly Stránky období, směru, pokusu, úvodu a tradice, Velká otázka a Tvoje antika. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/Domu.dc.html, project/VelkaOtazka.dc.html, project/ObdobiHelenismus.dc.html a project/MujDenik.dc.html jen styly a tělo obrazovky (ne pult náhledu a skript), ze Zlepseni.dc.html jen bod 5. Když odpovědi po K5 něco mění, oprav nejdřív cestu.

1. Domů jako stůl s věcmi k vzetí (bod 10): první lístek cesty (ListekCesty z K5), dnešní pokus na pět minut, pohlednice s příběhem, složená mapa, a když už student něco má, pruh z jeho zápisníku; titulek s pruhem, pás období jako odtrhávací lístky s ornamenty (Po D4), tři vstupy jako karty. Pravidlo střídmosti: na obrazovce nejvýš jedna ozdoba, která nic nenese.

2. Můj deník jako opravdový zápisník (oddíl Mapa a deník: funkce): hlavní pohled Moje filozofie po velkých otázkách (na začátku, teď, kdo stál se mnou, kdo by mi nejvíc odporoval), výpis podle data až druhý; záznam jako lístek s cestou, krokem a volbou (perem studenta); záznamy podle cest; sbírka (razítka potkaných filozofů, odtržené pahýly lístků prošlých cest z cesty[slug].pahyl z K5, vystřižené citáty); přenos deníku odkazem nebo kódem QR a připomenutí zálohy po dokončené cestě; Moje filozofie na jednu stránku k vytištění; tichá tečka u ikony Deník, když čeká Návrat; volba pera (K4a) a záloha deníku v novém vzhledu. Tvoje antika a Stoický týden v témže papíru.

3. Období a pás období, papírnictví období (bod 5): tokeny v .obdobi-N (páska, začátek kapitoly, razítko podle tabulky Po D5; každé období jen svým inkoustem, žádné plné plochy ani druhá barva); hlavička stránky období s odtrženým lístkem období místo razítka (Po D4), Otázky doby a Lidé a směry (štítky směrů podle otázky 10 po D4). Živý okraj na notebooku (bod 6): poznámky tužkou, malý výstřižek mapy „kde jsme“, kapitoly jako záložky na hraně stránky; na telefonu mezi odstavci.

4. Stránky z dat: směr, otázka s osou hlasů (razítka v polovině života, Kdo z nich je ti nejblíž? s lístkem, Po D4), pokus, úvody, náboženství, Lidé, Otázky (lístky cest místo karet), příprava hodiny a promítání. Razítko člověka (RazitkoCloveka.astro / .svelte) místo mapa/Mince.svelte všude kromě Mapy a času (K7a).

5. Přepiš dotčené komponenty na nová jména tokenů (Po K1, tabulka přezdívek): --paper, --surface, --sunk, --rule, --muted, --pc, --pc-tint, --pc-soft, --period-N, --pohyb…, --r-…; co přestanou používat, odškrtni v tabulce přezdívek v plánu. Když tinty období (--pc-tint, --period-N-tint, --pc-soft) už nikdo mimo mapu a kresby nepoužívá, zapiš to; smaže je O.

6. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro domu, denik, navrat, tyden, otazka, nove-stranky, obdobi, lide, otazky, hodina-podoby, hodina-student, prohlidka, medailonky a ty, které spadnou), node scripts/kontrola-fokus.mjs na Domů, Můj deník, stránce období 1, otázce 1 a Lidech, klávesnicí na dvou výškách okna, node scripts/snimky-listy.mjs na Domů, deníku (prázdném i plném), období 1, otázce 1 a Lidech na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po K6: co se na stránkách změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K6 a zadání K7a v plném znění (podle tabulky kroků). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

8. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Po K6 (14. 11. 2026)

Odpovědi po K5 byly prázdné v repozitáři i v Projektu Claude, takže platí všech osm doporučení a cesta se neměnila. Během práce autor upozornil na osm chyb a všechny jsou opravené (14. 11.): nadpisy na stole Domů nic neříkaly („kdo žil roku 399“), na Domů chyběl lístek cesty s odtržením, úryvek pohlednice končil po pár slovech („V Athénách se roku 423 př.“), otázky v deníku byly rozházené, uříznuté a mimo střed, Domů se po posunu rozpadlo, nadpis dnešního pokusu vypadal přeškrtnutý, stránka období padala (chyběl `OkrajObdobi.astro`) a oranžové záložky otázek v Rozpracovaných končily dole nahrubo. Snímky jsou v `Claude outputs/snimky/design-v2-k6/`.

### Co se na stránkách změnilo

- **Domů jako stůl** (`src/pages/index.astro`, bod 10): titulek „Velké otázky mají dlouhé dějiny.“ s pruhem „Filozofie od Thaléta po dnešek.“, perex a Začít první cestu jako dosud. Vedle leží lístek první cesty (`CestaKarta` s novou podobou `velka`, „Nikdo není moudřejší.“) s pahýlem, který se po najetí odtrhne. Pod tím stůl se čtyřmi věcmi: kartička dnešního pokusu na pět minut (otázka pokusu jako nadpis, `otazkaPokusu`), pohlednice s příběhem z období (místo a rok, nadpis, celé věty do 320 znaků, `uryvek` a `vety` v `src/lib/stul.ts` přeskočí zkratky jako „př. n. l.“), složená mapa „Rok, kdy Athény soudily Sókrata“ s odkazem na mapu v roce 399 př. n. l. a pruh ze zápisníku („naposledy sis do zápisníku napsal“, jen když student něco má). Pokus a pohlednice se střídají po dnech (`vyberDne`, skript před vykreslením, takže nic neproblikne). Pás období jsou odtrhávací lístky s ornamenty (`PasObdobi.astro`; perforace, zářezy, „připravujeme“ u období bez stránky, na telefonu pod sebou) a tři vstupy jsou ležící karty. Ozdoba bez obsahu je jen jedna, ornamenty na lístcích období.
- **Můj deník jako zápisník** (`Denik.svelte`, `src/lib/zapisnik.ts`, nové `MojeFilozofie.svelte`, `SbirkaDeniku.svelte`, `PrenosDeniku.svelte`; popis v `docs/design.md` › Můj deník jako zápisník):
  - Titulek „Můj deník.“ s pruhem „Jen tvůj, jen v tomhle prohlížeči.“
  - Návrat na lístku s páskou a připomenutí zálohy po dokončené cestě (poznámka rukou, Uložit do souboru).
  - Rozpracované: lístky cest s pahýlem, které se po najetí odtrhnou. Otázky, ke kterým se student nevrátil, jsou oranžové záložky stejné výšky s ohybem dole.
  - **Moje filozofie** po velkých otázkách: na začátku a teď perem na linkách (oba sloupce do stejné výšky), pravidla z cest, kdo stál se mnou (razítko a jméno v řádcích) a kdo by mi nejvíc odporoval (`odpurce` v `prehledObdobi`). Vytisknout dá na papír jen tenhle oddíl.
  - Moje odpovědi a stanoviska jako lístky, podle data (výchozí) nebo podle cest.
  - Sbírka: razítka potkaných filozofů, odtržené pahýly prošlých cest a vystřižené citáty. Nůžky má každý citát na listu (`Citat.astro`, `src/scripts/vystrihnout.ts`).
  - Záloha a přenos: soubor ke stažení a nahrání a odkaz s deníkem v kotvě (`src/lib/prenos.ts`). Kdo odkaz otevře, dostane nabídku přidat deník ke svému.
  - Tichá tečka u Deníku v záhlaví a ve spodní liště, když čeká Návrat (`src/scripts/tecka-deniku.ts`, načítá se ze skriptu v `Zakladni.astro`).
  - Tvoje antika („Tvoje antika.“) má razítka místo mincí, lepicí lístek s první odpovědí a lístek s páskou u nejbližšího. Stoický týden má dny jako ležící listy a kartu týdne jako lístek s páskou.
- **Papírnictví období** (bod 5, `global.css`): v `.obdobi-N` vzor pásky (maska z SVG: meandr, vlnovka, kruhy, kříže, hvězdy, ozubení, čárky, body; přes pásku v `--pp` 90 %, v noci `--p` 80 %), ozdoba čísla kapitoly a tvar razítka místa. Každé období jen svým inkoustem; `.bez-obdobi` vzor vypne.
- **Stránka období** (`src/pages/obdobi/[obdobi].astro`): hlavička s odtrženým lístkem období (ornament, „období N“, krátký název) nad titulkem s pruhem (léta). Mezitím jinde je lístek s páskou. Otázky doby jsou řádky zápisníku (číslo velké otázky rukou) s malým lístkem cesty (`CestaKarta maly`). Lidé a směry mají vtlačené štítky směrů a razítka bez krabic.
- **Živý okraj** (bod 6, `OkrajObdobi.astro`): od 1240 px kapitoly jako záložky na pravé hraně (běžící kapitola v papíru období) a výstřižek „kde jsme“ se jmény až čtyř míst, který vede na Na mapě. Pod 1240 px a v tisku není; na telefonu zůstávají mezititulky v textu.
- **Stránky z dat:** hlavička stránky (`HlavickaStranky.astro`) je titulek na listu s tečkou na konci (otázka si nechá otazník), volitelně s pruhem. Otázka má pruh s oborem a úvod na čistém listu s páskou. Osa hlasů má razítka místo mincí, volbu „Kdo z nich je ti nejblíž?“ s razítky na vystouplých tlačítkách a věty na lístku s páskou. Lidé („Lidé a směry.“) mají razítka 72, 64 a 48 px, ležící karty, medailonky jako řádky a vtlačené směry. Otázky („Deset velkých otázek.“) mají řádky s číslem rukou a malé lístky cest. Směr, pokus, úvody, náboženství, tradice, týden, příprava hodiny (kolečka jako kroužek inkoustem, pole vtlačená) a promítání mají nová jména tokenů. `RazitkoCloveka` nahradilo Mince všude kromě Mapy a času; `ui/Mince.astro` už nikdo nepoužívá (smaže O).

### Přezdívky

Odškrtnuté v tabulce Po K1 (K6): `--period-N` (už jen přiřazení `.obdobi-N` v `global.css`), `--pc-plate`, `--pc-on-plate` (mimo přiřazení 0), `--pohyb-rychle` (0). Deník, Domů, období, osa hlasů, týden, hodina, Lidé, Otázky a stránky z dat už přezdívky nepoužívají.

Zbývá (počet `var(--…)` v `src` mimo `tokens.css`, v závorce po K5): `--paper` 10 (18), `--surface` 35 (55), `--sunk` 3 (14), `--rule` 40 (78), `--muted` 27 (53), `--pc` 30 (75), `--pc-tint` 11 (23), `--pc-soft` 3 (7), `--pohyb-rychle` 0 (3), `--pohyb` 18 (20), `--pohyb-kamera` 14 (15), `--r-sm` 10 (22), `--r-md` 4 (17), `--r-full` 4 (13), `--r-xs` 16 (18), `--stin-mapa` 7, `--stin-list` 1. Všechno je v mapě (`src/components/mapa/`, K7a), v kresbách a v pravidlech kreseb v `global.css` (K7b), v mini ose a mini mapě profilu (K7) a v nepoužívaném `ui/Mince.astro`.

**Tinty období** (`--pc-tint`, `--pc-soft`, `--period-N-tint`, `--period-N-soft`) teď používá jen mapa (`Mince.svelte`, `KartaCloveka.svelte`, `Mapa.svelte`, `Reka.svelte`, `Posuvnik.svelte`), mini osa profilu (`MiniOsa.astro`) a nepoužívaný `ui/Mince.astro`; kromě nich už jen přiřazení `.obdobi-N` v `global.css`. Po K7a a K7b je O smaže i s `--muted` (drží starou hodnotu kvůli tintám) a s přiřazením v `global.css`.

### Testy a kontrola

- `npm run build` prošel. Vitest celý (1 365 testů); nový `tests/data/zapisnik.test.ts` (odpůrce, záznamy podle cest, pahýly, potkaní filozofové, vystřižené citáty a jejich spojení, připomenutí zálohy, přenos odkazem tam a zpět, věty a úryvek pohlednice se zkratkami, výběr dne, otázka pokusu).
- Playwright: dotčené testy upravené (`domu`: titulek a jeden lístek cesty; `navrat`: tečka u Deníku jen mimo deník a jen když čeká Návrat; `nove-stranky`: titulky s tečkou; `otazka`: zápisy hledá v `.seznam--zapisy`, protože Moje filozofie ukazuje tutéž větu; `tvoje-antika`: titulek).
- `scripts/kontrola-fokus.mjs` na Domů, Můj deník, období 1, otázce 1 a Lidech (390 a 1440 px): bez nálezu.
- Klávesnicí (jednorázový skript, smazaný) na 390 × 844, 390 × 640, 1440 × 900 a 1440 × 700, Domů, plný deník, Tvoje antika, období 1, otázka 1 a Lidé, 45 tabulátorů: prvek s fokusem nikdy pod záhlavím ani spodní lištou (jediný nález je odkaz Přeskočit na obsah, který leží nad záhlavím záměrně).
- **Kontrast** nových dvojic (jednorázový skript, smazaný): text na záložce v papíru období s odleskem byl u období 4 jen 4,43, odlesk je proto jen 4 % bílé a dvojici hlídá nová trvalá zkouška v `tests/data/kontrast.test.ts` pro všech osm období. Pero a `--p` na lístku nejméně 4,8; ruka na papíře v pořádku.
- **Celé `npm test`** před commitem dvakrát. První běh našel dvě chyby navíc: skript nůžek v `Citat.astro` vložil Astro jako značku `<script>` k prvnímu citátu, ta pak rozdělila text kroku do dalšího čistého listu (`ram-aktivity`) a stala se posledním prvkem scény příběhu (`cesta3`). Skript se teď načítá v `Zakladni.astro`. Druhý běh: kontrola typů bez chyb, Vitest 1 365, Playwright 739 ze 740 (9,3 min). Neprošel jen `ram.spec.ts:85` (přechod mezi stránkami, viz Nad čím jsem váhal).
- **Snímky** v `Claude outputs/snimky/design-v2-k6/` (`scripts/snimky-listy.mjs`): Domů, deník prázdný a plný, Tvoje antika, období 1, otázka 1 a Lidé, na 390 a 1440 px ve dne i v noci.

### Nad čím jsem váhal a co by šlo jinak

- **Kód QR není.** Přenos jde odkazem (a souborem); generátor QR by byl nová závislost (`qrcode-generator`, asi 20 kB) a instalaci jsem bez tebe nepouštěl. Jinak: QR až s tvým souhlasem (otázka 3).
- **Složená mapa na stole je kresba**, ne výřez opravdové mapy: přeložený list s tečkovanou cestou. Opravdová mapa jako výstřižek přijde v K7a; pak by na stole mohl ležet její kousek.
- **Pokus a pohlednice se střídají po dnech**, ne po návštěvách: stejný den je stůl stejný a nic neproblikne.
- **Titulky stránek z dat končí tečkou** jako titulky profilů („Lidé a směry.“); otázka si nechá otazník.
- **Pruh na stránce otázky nese obor** (etika, epistemologie…), na stránce období léta. Jinak: pruh s první větou úvodu.
- **„Kde jsme“ na okraji jsou jména míst**, ne výřez mapy: výstřižek mapy by čekal na K7a.
- **Vystřižené citáty** se ukládají nůžkami u citátu na listu (kompaktní citáty v řádku nůžky nemají).
- **Rozpracované otázky jako záložky**: stejně vysoké, text uprostřed, dole tmavší ohyb téže barvy a stín. První verze s pruhem papíru pod řadou se autorovi nelíbila (bílý pruh nezapadl).
- **Přechod mezi stránkami vypadává častěji.** Test `ram.spec.ts:85` (otazky → Lidé, typ `dalsi`) v Chromiu bez okna prošel na HEAD před K6 pětkrát ze šesti, s K6 dvakrát ze šesti; nová stránka pak nedostane přechod (`pagereveal` bez `viewTransition`). Nezpůsobuje to `global.css`, stránky Otázky a Lidé ani skript tečky (zkoušeno vrácením po částech); nejvíc pomohlo vrátit záhlaví a spodní lištu, ale ani to ne spolehlivě. Na stroji s velkou zátěží (5,7) je výsledek rozkolísaný. Prověřit v opravdovém Chromu (`scripts/overeni-prechodu.mjs`) na začátku K7a (otázka 6).

## Co rozhodnout po K6

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-k6/`). Prázdná odpověď znamená souhlas s doporučením.

1. **Domů jako stůl** (snímky `domu-*`): lístek první cesty, kartička pokusu, pohlednice, složená mapa, pás období jako odtrhávací lístky, tři vstupy. Doporučuji ano.
   Odpověď:

2. **Můj deník jako zápisník** (snímky `denik-plny-*` a `denik-prazdny-*`): Moje filozofie jako hlavní pohled, výpis podle data až pod ní, sbírka, záloha a přenos, oranžové záložky rozpracovaných otázek s ohybem. Doporučuji ano.
   Odpověď:

3. **Kód QR k přenosu deníku:** smím přidat závislost `qrcode-generator` (asi 20 kB, načte se jen po klepnutí na „Ukázat kód QR“ v deníku)? Bez ní zůstává odkaz a soubor. Doporučuji ano.
   Odpověď:

4. **Stránka období** (snímky `obdobi-1-*`): odtržený lístek období nad titulkem, papírnictví období (vzor pásky, ozdoba kapitoly, razítko místa), Otázky doby jako řádky s malými lístky cest, na notebooku záložky kapitol a „kde jsme“ na pravé hraně. Doporučuji ano.
   Odpověď:

5. **Titulky stránek z dat s tečkou a pruh na otázce s oborem** (snímky `otazka-1-*`, `lide-*`). Doporučuji ano.
   Odpověď:

6. **Přechod mezi stránkami, který v testu vypadává** (Nad čím jsem váhal): na začátku K7a ho ověřit v opravdovém Chromu a příčinu opravit, než se začne s mapou. Doporučuji ano.
   Odpověď:

7. **Chceš něco změnit na snímcích po K6?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

