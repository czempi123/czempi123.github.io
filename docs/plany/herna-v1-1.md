# Větev herna-v1, část 1: hotové kroky P6 až K2

Zadání a záznamy kroků P6, K1 a K2 a odpovědi před P6, přesunuté z `docs/plany/herna-v1.md`, aby se plán vešel do Projektu Claude (pod 35 kB). Platný stav, zásady, další zadání a poslední oddíl Po jsou v hlavním plánu.

## Zadání P6: podklady pro formáty

Pracuješ v repozitáři atlas na mém Macu (`/Users/vojtechczempka/Atlas`, Desktop Commander), ve větvi `herna-v1`. Přečti `CLAUDE.md`, `docs/pouceni.md`, v tomto plánu Co platí, Formáty a odpovědi v Co rozhodnout před P6, a skill `atlas-overeni`. Archiv nečti.

1. Do `docs/podklady/herna.md` sestav podkladový list ve tvaru skillu `atlas-overeni`, oddíl na každý formát:
   - **Kdo to řekl? a Doplň citát:** z citátů, které už jsou v `zdroje.yaml`, vyber pro antiku dvanáct až patnáct krátkých vět, které jdou poznat podle myšlenky (ne podle jména v nich); u každé tři až čtyři lidi, mezi kterými se bude hádat, a jedno slovo, na kterém věta stojí, se dvěma věrohodnými záměnami.
   - **Pravý, nebo podvržený?:** pět až osm vět, které internet připisuje antickým filozofům. U každé doložené připsání (kde koluje) i skutečný původ (dílo, místo, autor), nebo že původ není znám. Bez doložení věta do atlasu nejde. Mezi nimi dvě až tři pravé věty, aby nebyla odpověď vždy „neřekl“. Ověř i větu o nádobě a ohni (Plútarchos, O poslouchání 48C) a hlasovací kotoučky z D5 (Aristotelés, Athénská ústava 68).
   - **Kdo by to řekl?:** osm dnešních vět (chat, reklama, motivační citát, rada kamaráda), u každé jeden až dva myslitelé z antiky, kteří by ji podepsali, a jeden, který by ji odmítl, s důvodem z pramene.
   - **Páry:** ke dvanácti pojmům z kolekce `pojmy` situace ze života šestnáctiletého člověka, která pojem ukazuje, a jedna, která ho jen připomíná.
   - **Tipni si a Seřaď na ose:** pět až osm čísel a pětic z dat, které překvapí (současníci, které by nikdo nečekal, dlouhé mezery); každé číslo spočítej z dat skriptem, ne z hlavy.
   - **Výpravy:** čtyři otázky na období 1 a čtyři na období 2, odpověď z dat.
   - **Argumentační klamy a manipulace:** osm až deset klamů a manipulačních technik pro RVP G (útok na osobu, slaměný panák, falešné dilema, kluzký svah, odvolání na autoritu, na většinu, kruh, vytržení z kontextu, podvržený citát, citové vydírání), u každého případ z antiky, kde ho filozof pojmenoval nebo použil, a dnešní případ ze sociálních sítí. Zdroje: Aristotelés, O sofistických důkazech, Platón, Euthydémos a Gorgiás, česká učebnice logiky nebo kritického myšlení.
2. Nové citáty a podvržená připsání zapiš do `zdroje.yaml` (u podvržených navrhni nový druh záznamu, ať je schéma pozná) a doplň testy dat.
3. Nejisté body do `docs/podklady/k-overeni.md`. Nové osoby do dat nepřidávej; když nějakou potřebuješ, napiš ji do otázek.
4. `npx vitest run`, commit, oddíl Po P6 v tomto plánu (co je ověřené, co vypadlo a proč), plán do Projektu Claude. Zastav se.

## Zadání K1: herní jádro, Seřaď na ose a Kdo to řekl?

Ve větvi `herna-v1` na Macu. Přečti `CLAUDE.md`, `docs/pouceni.md`, `docs/design.md` (Pohyb, Bloky a aktivity, Komponenty), v tomto plánu Co platí, Formáty, Po P6, odpovědi v Co rozhodnout, skill `atlas-komponenta` a z plátna D5 popis předmětů (`docs/archiv/plany/design-v2-4-audit-d5.md` › Po D5, jen tenhle oddíl).

1. **Sdílená logika** v `src/lib/herna/` jako čisté funkce s testy ve Vitestu: zamíchání se semínkem (stejné pořadí po obnovení stránky), vyhodnocení pořadí (které dvojice sedí), výběr možností k citátu, stav hry v deníku (`src/lib/denik.ts`, stav bloku), „sedí“ a „zkus to jinak“ s větou, kam se podívat.
2. **Herní pohyb** jako třídy v `global.css` a tokeny z oddílu Pohyb (`--z-karta` z D5 doplň do `tokens.css`): rozdání karet po jedné, otočení karty, otisk razítka. Při omezeném pohybu a v Klidném režimu stav hned na konci.
3. **Seřaď na ose:** šňůra s kolíčky (na telefonu svisle), přesun tažením i klepnutím dvou karet, z klávesnice šipkami; roky až po správném pořadí; po třech pokusech „Ukázat pořadí“.
4. **Kdo to řekl?:** otočná kartička, tři až čtyři razítka lidí jako odpovědi, po otočení dílo, místo a odkaz na stránku osoby; série karet s „Další karta“ v patě rámu.
5. Oba formáty do `bloky/index.ts`, schéma do `bloky-schema.ts`, do dílny a do `pruchod.spec.ts`, `scripts/slova-cesta.mjs` a `scripts/snimky-cesta.mjs` (pouceni: nový druh bloku musí znát i to, co cestu prochází samo).
6. Testy: Vitest na logiku; Playwright na 390 a 1440 px, světlý a tmavý režim, axe, jen klávesnicí, dotyk přes CDP, obnovení stránky, bez `localStorage`, omezený pohyb, Klidný režim. Snímky si prohlédni.
7. `docs/design.md` (Bloky a aktivity, jedna řádka na formát), celé `npm test`, commit, Po K1, restart `npm run dev`, plán do Projektu. Zastav se a napiš, na které snímky se mám podívat.

## Zadání K2: úprava her z K1, Tipni si, Kde to bylo?, Doplň citát

Opus 5.5 · high, skill `atlas-komponenta`, nový chat.

```
Ve větvi herna-v1 na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Přečti CLAUDE.md, docs/pouceni.md, docs/design.md (Pohyb, Bloky a aktivity, Komponenty), v docs/plany/herna-v1.md Co platí (hlavně Pointa není paměť), Formáty, Po P6 a Po K1, skill atlas-komponenta a z podkladů docs/podklady/herna.md jen oddíly 1 (Kdo to řekl? a Doplň citát) a 5 (Tipni si a Seřaď na ose). Archiv nečti.

Zásada kroku: student se nemá učit citáty nazpaměť, hádat, o koho jde, ani znát přesné roky. Hra mu dá do ruky, podle čeho může uvažovat (myšlenku osoby, vztahy z dat), a odkrytí řekne, o čem věta je a kdo na koho navázal. Roky jsou jen drobný údaj.

0. Úprava her z K1 (src/lib/herna, ostrovy SeradNaOse.svelte a KdoToRekl.svelte, YAML v dílně, testy):
   - Kdo to řekl?: u každého razítka pod jménem jedna věta z dat, čím se člověk zabýval (pole proc v lide.yaml), aby student hledal, komu myšlenka sedí, ne koho si pamatuje. Pokyn nad razítky v duchu „Nemusíš to vědět: hledej, čí myšlence věta sedí.“ (skill atlas-psani). Na rubu karty nahoře jedna věta, o čem věta je (nové pole pointa u karty v YAML), dílo a místo menší pod ní. Ověř, že se razítka s větou vejdou na 390 px; když ne, dvě pod sebou.
   - Seřaď na ose: po správném pořadí (i po Ukázat pořadí) ukaž mezi kartami vztahy z vztahy.yaml (učitel a žák, znali se, četl ho, přel se; tradovaný s „vypráví se“) a u lidí, jejichž životy se překrývají, „mohli se potkat“; roky drobně pod jménem. Vysvětlení v YAML mluví o tom, kdo na koho mohl navázat. Pětice v dílně vyber jako řetěz vlivu z podkladů (nebo ji z dat sestav tak, aby aspoň dva vztahy na šňůře byly); Konfucius smí zůstat jako překvapení (žil ve stejném století jako Parmenidés), ale bez tvrzení, že o sobě nevěděli.
   - docs/design.md a testy podle toho.
1. Tipni si: papírové pravítko s jezdcem v barvě pera, posuvník input type="range" s popisem pro čtečku. Odhaduje se v lidských životech a generacích, ne v přesných letech: „Kolik lidských životů je mezi nimi?“, „Mohli se potkat?“. Po odhalení ryska a čárkovaná svorka rozdílu a věta z dat „Dělí je asi … let, zhruba … lidských životů“ (src/lib už počítá vzdálenost dvou životů: najdi a použij); odhad v rozumném rozpětí je „sedí“, žádné body. Čísla jen z dat nebo z podkladů P6.
2. Kde to bylo?: slepý výřez mapy ze sdíleného podkladu (src/lib/podklad-sdileny.ts), klepnutí položí špendlík, z klávesnice kříž šipkami a Enter; po klepnutí razítko místa, spojnice a vzdálenost jen slovem („blízko“, „o moře dál“), bez kilometrů a bodů. Pointa je, proč tam člověk byl (odchod, vyhnanství, škola): po odhalení jedna věta z dat o tom, co ho tam přivedlo. Popisky míst se nesmí potkat (pouceni: obdélníky jednotlivých řádků).
3. Doplň citát: vystřižená slova jako ve vzkazu z novin, vložení do vtlačené mezery tažením i klepnutím, z klávesnice. Nejde o to trefit slovo z paměti: ke každé záměně zpětná vazba, co by věta s tím slovem tvrdila a čím se to liší (slova a vazby v YAML, z podkladů P6); po vložení celý citát s místem a věta, o čem je.
4. Všechny tři formáty do bloky/index.ts, schéma do bloky-schema.ts, do dílny, do katalogu hodin a do pruchod.spec.ts, scripts/slova-cesta.mjs a scripts/snimky-cesta.mjs; nové stavy do scripts/snimky-herna.mjs.
5. Testy: Vitest na logiku; Playwright na 390 a 1440 px, světlý a tmavý režim, axe, jen klávesnicí, dotyk přes CDP, obnovení stránky, bez localStorage, omezený pohyb, Klidný režim. Snímky si prohlédni.
6. docs/design.md (Bloky a aktivity, jedna řádka na formát), celé npm test, commit, oddíl Po K2 v plánu, restart npm run dev, plán do Projektu Claude. Na konci zprávy napiš, na které snímky se mám podívat, a celý prompt pro K3 (do zprávy i do plánu), s modelem a úsilím.
```

## Co rozhodnout před P6

Prázdná odpověď znamená souhlas s doporučením.

1. **Kam v antice přídavky?** Návrh: Seřaď na ose na stránce období 1, Tipni si na stránce období 2, Kdo to řekl? na stránce směru Stoicismus, Doplň citát na konci kapitoly o soudu v portrétu Sókrata, Páry na stránce směru Epikureismus, Pravý, nebo podvržený? v posledním kroku cesty 1 (Jak poznám, co je pravda?) a na stránce klamů, Najdi slabé místo v kroku cesty 8 s Epikúrovým argumentem a na stránce klamů, Kdo by to řekl? na stránce otázky 1 (Jak mám žít?), Kde to bylo? na medailoncích přes střídání (K4), Do hodiny v cestě 1. Doporučuji tak.
   Odpověď:

2. **Pravý, nebo podvržený? jen s doloženým připsáním:** do atlasu jde jen věta, u které umíme ukázat, kde koluje, i odkud doopravdy je (nebo že původ není znám). Doporučuji ano, i kdyby vět zbylo jen pět.
   Odpověď:

3. **Kdo by to řekl? bez správné odpovědi:** atlas po volbě ukáže svůj návrh s důvodem z pramene, studentovu volbu nehodnotí a uloží ji do deníku. Doporučuji ano.
   Odpověď:

4. **Střídání aktivit na stránkách osob pevně při sestavení,** ne náhodně při každém načtení (náhodná změna by šla proti zákazu automaticky se měnících prvků a student by se ke stejné hře nevrátil). Doporučuji pevně.
   Odpověď:

5. **Výpravy:** čtyři na období 1 a čtyři na období 2, výprava se vybírá podle období na pásu. Doporučuji ano.
   Odpověď:

6. **Sebehodnocení na konci všech deseti cest** jako jedna komponenta za Závěrem cesty (žádný text cesty se nemění), nebo jen v cestě 1 jako zkouška? Doporučuji všech deset: otázky jsou stejné a kurikulum je chce na konci cesty.
   Odpověď:

7. **Stránka Argumentační klamy a manipulace** jako stránka úvodu oddílu (šablona jako Co je filozofie?, adresa `/argumentacni-klamy/`), odkaz z Otázek a z Kam dál cesty 1. Doporučuji tak.
   Odpověď:

## Po P6 (17. 11. 2026)

Odpovědi v Co rozhodnout před P6 zůstaly prázdné: platí všech sedm doporučení. Podklady jsou v `docs/podklady/herna.md`, nejisté body v `docs/podklady/k-overeni.md` (oddíl Větev herna-v1).

**Co je ověřené**

- **Kdo to řekl? a Doplň citát:** patnáct vět, které už v datech jsou, každá se třemi až čtyřmi lidmi a slovem se dvěma záměnami. U tří vět jsem vyřadil z možností člověka, kterému prameny podobnou větu dávají taky: Sókratés u „občana světa“ (Cicero, Tuskulské hovory V, 108) a u změny mysli (Seneca, Dopisy 28, 2), Aristotelés u údivu (Metafyzika 982b).
- **Pravý, nebo podvržený?:** osm vět, šest „neřekl to“ a dvě „řekl to“ (Marcus VI, 6; Seneca 13, 4). U každé doklad, kde koluje, i původ. Věta o nádobě a ohni je Plútarchova (O poslouchání 48C, čteno řecky i anglicky), ale o mysli posluchače, ne o vzdělání; Sókratovi ani Yeatsovi nepatří. Hlasovací kotoučky (Athénská ústava 68, čteno řecky) sedí jako popis soudů 30. a 20. let 4. století, ne Sókratova procesu.
- **Kdo by to řekl?:** osm dnešních vět, u každé jeden až dva podepisující a jeden odmítající s důvodem z citátu v datech.
- **Páry:** dvanáct pojmů, situace, která pojem ukazuje, a situace, kde jde jen o stejné slovo.
- **Tipni si a Seřaď na ose:** sedm čísel a pět pětic, spočítané skriptem `scripts/herna-cisla.ts` z dat (Isokratés 98 let, Diogenés a Aristotelés zemřeli rok po sobě, Démokritos přežil Sókrata asi o 29 let, Konfucius narozený před Parmenidem).
- **Výpravy:** čtyři a čtyři otázky „Kde byl…?“, odpověď vždy z pobytu s časem.
- **Argumentační klamy a manipulace:** deset klamů, každý s antickým místem (Obrana 23d, 19c a 34c–35c, Euthydémos 275e, Gorgiás 471e, Kritón 47b, Ústava 564a, Prótagorás 339c, O sofistických důkazech 5, 22 a 27, Cicero O povaze bohů I, 10, Plútarchos Proti Kólótovi, dopisy Seneky a Pavla) a dnešním případem ze sítí; české názvy podle příručky MELIA pro střední školy.
- **Data:** třináct nových citátů a dvacet jedna pramenů v `zdroje.yaml`; nový druh záznamu `pripsani` (osm vět) se schématem `Pripsani` v `src/lib/schema.ts`, kontrolami odkazů v `src/lib/kontroly.ts` a testy v `tests/data/data.test.ts`. `npx vitest run` prošel.

**Co vypadlo a proč**

- Věty o smrti ze hry s otáčením karet (Kdo to řekl?) a situace s jídlem u Párů: pouceni, Student, kterého se téma bolestně týká.
- „Jen mrtví viděli konec války“ (Santayana) a „Člověk je měřítkem všech věcí“ zůstaly jako záloha: první má doložený původ jen z výtahů, druhá by byla třetí „řekl to“.
- Sorités u Chrýsippa ke klamu šikmá plocha: Lucullus v PerseusDL není; místo něj Ústava VIII, 564a, kde Platón řetěz sám podává jako pravděpodobný.
- „Bez kamarádů nejsi nic“ u Kdo by to řekl?: Seneca (Dopisy 9, 13) by ji odmítl jen napůl; ověřeno, ale do dat nepřidáno.
- Musonius Rufus do výprav: má vyhnanství od 65 bez konce, mapa ho nechá na Gyaru až do smrti. Zapsáno do `docs/navraty.md`.

**Nad čím jsem váhal:** u Dionýsodóra v Euthydémovi jsem citát zapsal s `bezOsoby: true` (v datech není a nemá být); pod citátem pak stojí „Platón, Euthydémos 275e“ a jméno mluvčího musí říct text. Druh `prepsany` u Hérakleitovy řeky by šel vést i jako `neznamy` (dodatek o člověku); zvolil jsem přepsaný, protože první půlka je jeho myšlenka.

**Otázky jen pro autora:** žádné nové osoby. Jen jedna věc k rozhodnutí: kde plátno D5 kotoučky použilo; pokud u Sókratova procesu, doporučuji je přesunout k obecnému popisu athénského soudu. Prázdná odpověď znamená souhlas.

Další krok: K1 (herní jádro, Seřaď na ose, Kdo to řekl?) v novém chatu, Opus 5.5 · high se skillem `atlas-komponenta`.

## Po K1 (17. 11. 2026)

Odpověď na otázku po P6 (kotoučky) zůstala prázdná: platí doporučení, kotoučky patří k obecnému popisu athénského soudu, až vznikne Porota (Co zůstává na později).

**Co vzniklo**

- **Sdílená logika** `src/lib/herna/` (testy `tests/data/herna.test.ts`): `zamichej` se semínkem z textu (FNV-1a a mulberry32, stejné pořadí při sestavení, po hydrataci i po obnovení), `verdikt` („Sedí.“, nebo „Zkus to jinak.“ s jednou větou, kam se podívat), pro Seřaď na ose karty z dat s „asi“ (`kartaOsy`), `dvojice` a `vyhodnotPoradi`, `zamichaniOsy` (nikdy hotové, nejvýš polovina dvojic sedí), `presun`, `prohod`, `verdiktPoradi` a `platnyStavOsy`; pro Kdo to řekl? `moznostiCitatu`, `puvodCitatu` („Zapsal Platón: Obrana Sókratova 38a“, když mluví postava), `chybyKdoRekl`, `hotovaSerie` a `platnyStavKdoRekl`. Deník zná druhy aktivit `serad` a `kdo-rekl`; ukládá se jen stav bloku, žádný zápis.
- **Herní pohyb** v `global.css` (oddíl Herní pohyb): `.rozdat` (zpoždění `--i` × nový token `--z-karta`, 40 ms), `.otocna` s otočením `--d-list`, `.herni-otisk` s dopadem `.otisk`. Při omezeném pohybu i v Klidném režimu stojí na konci (test pro plný pohyb, omezený a Klidný).
- **Seřaď na ose** (`SeradNaOse.astro`, `ostrovy/SeradNaOse.svelte`, druh `serad`): šňůra s kolíčky, pod 560 px šířky rámu svisle; tažení myší i prstem, klepnutí na dvě karty je prohodí, z klávesnice šipky, Enter kartu zvedne a položí, Escape ji vrátí. Po špatné kontrole značky dvojic (✓, ⇄) a lístek „zkus to jinak“; roky až po správném pořadí, otisk „sedí“; po třech kontrolách Ukázat pořadí.
- **Kdo to řekl?** (`KdoToRekl.astro`, `ostrovy/KdoToRekl.svelte`, druh `kdo-rekl`): otočná kartička s větou, odpovědi jako razítka lidí; špatné razítko zůstane zakázané a lístek řekne, kam se podívat; po trefě se karta otočí (jméno, věta, dílo a místo, Otevřít stránku), Další karta v patě; po poslední kartě souhrn.
- **Zapojení:** `bloky/index.ts`, schémata `BlokSerad` a `BlokKdoRekl` v `bloky-schema.ts`, nadtitulek „Hra“ v `nadtitulky.ts`, `BLOKY_S_ODPOVEDI` (lišta kroku), katalog hodin (bloky z YAML), dílna (dva nové oddíly s `dilna-serad-narozeni` a `dilna-kdo-rekl`, obsah z podkladů P6), `pruchod.spec.ts`, `scripts/slova-cesta.mjs` a `scripts/snimky-cesta.mjs`.
- **Testy:** `tests/e2e/herna.spec.ts` (390 a 1440 px, světlý i tmavý režim, jen klávesnicí, axe, obnovení stránky, tři kontroly a Ukázat pořadí, tažení myší, dotyk přes CDP, cíle 44 px, bez `localStorage`, plný, omezený pohyb a Klidný režim). Snímky pro kontrolu skládá `node scripts/snimky-herna.mjs` do `Claude outputs/snimky/herna-*.png`.
- `docs/design.md` (Pohyb, Klidný režim, Bloky a aktivity, Komponenty) a `docs/rozhodnuti.md` (17. 11. 2026).
- **Celé `npm test`:** kontrola typů, 1439 testů ve Vitestu a 810 z 811 v Playwrightu. Spadl jen `denik-kapitoly.spec.ts:101` (klávesnice v kapitolách deníku, 5,7 s místo obvyklých 0,3 s při zátěži); sám čtyřikrát po sobě prošel a hry se ho netýkají. Kdyby se objevil znovu, patří do revize R.

**Nad čím jsem váhal a co by šlo jinak**

- **Značky u všech dvojic, nebo jen věta o první obrácené.** Zadání chtělo „které dvojice sedí“, tak je značky ukazují všechny; lístek jmenuje jen první obrácenou. Jinak: jen počet nebo jen věta, hra by byla těžší.
- **Kontrola čeká na změnu pořadí** a pokus se počítá jen za kontrolu jiného pořadí. Jinak by tři klepnutí na Zkontrolovat hned otevřela Ukázat pořadí.
- **Rozdání karet jen po činu studenta** (Začít znovu, Další karta), ne při načtení stránky: pravidlo pohybu dovoluje pohyb jen po činu nebo jednou při příchodu na profil.
- **Nabídka pera** se ukáže i po první odpovědi ve hře (rám ji nabízí při první zpětné vazbě vůbec). Ve hře student perem nepíše, jen jeho obrys nese zvednutá karta; nechal jsem to, protože pero je jedno pro celý atlas. Jinak: rám by nabídku ve hrách vynechal.
- **Otisk „sedí“** stojí přes konec šňůry a roh poslední karty (vodorovně) nebo první karty (svisle); pod šňůrou se potkával s páskou lístku. Tučných 19 px drží v tmavém režimu kontrast velkého textu.
- **Napovědy ke Kdo to řekl? v dílně** jsem napsal sám (jedna věta, bez jména); u Aristotela „se žáky sbíral ústavy řeckých obcí“ podle toho, že Athénskou ústavu data vedou jako dílo školy. Do antiky je projde krok T se skillem `atlas-psani`.

**Na které snímky se podívat** (`Claude outputs/snimky/`): `herna-serad-klid-390-svetly.png` a `herna-serad-klid-1440-tmavy.png` (šňůra svisle a vodorovně), `herna-serad-zkus-390-svetly.png` (značky dvojic a lístek), `herna-serad-sedi-1440-svetly.png` (roky a otisk), `herna-kdo-zkus-390-svetly.png` (zakázané razítko a napověda), `herna-kdo-otocena-1440-tmavy.png` (rub karty). V dílně: `/dilna/bloky/#dilna-serad-narozeni` a `#dilna-kdo-rekl`.

Další krok: K2 v novém chatu, Opus 5.5 · high se skillem `atlas-komponenta`. Autor 17. 11. 2026 doplnil zásadu Pointa není paměť (Co platí), proto K2 začne úpravou obou her z K1; celé znění promptu je v Zadání K2.

