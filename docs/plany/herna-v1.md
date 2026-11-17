# Větev herna-v1: knihovna nových aktivit

Plán 16. 11. 2026 (Opus 5.5). Fáze 2 plánu po auditu (`docs/plany/po-auditu.md` › Fáze 2: zásada, katalog, pravidla pestrosti, větve) a přídavky z kurikula (`docs/plany/kurikulum.md`, řádek `herna-v1`). Vzhled předmětů a herní pohyb navrhl krok D5 větve design-v2 (`docs/archiv/plany/design-v2-4-audit-d5.md` › Po D5, plátno Herní prvky). Společný rám aktivity (`RamAktivity.svelte`) a tokeny jsou hotové (`docs/design.md` › Bloky a aktivity, Pohyb).

## Proč

Z devadesáti míst, kde student v antice něco dělá, je jen třináct hraček, zbytek je volba, věta do pole a třídění. Na každém medailonku je tatáž aktivita (Kdo žil dřív?). Herna postaví formáty, které se plní z dat a z YAML, takže je pak každý celek jen vybere. Každý formát musí projít čtyřmi otázkami zásady (odnese si něco, přemýšlí sám, zůstává otevřená, chtěl by ji udělat i bez povinnosti) a nosným pilířem: co si z toho student odnese do života.

## Co platí

- **Hotový text se nepřepisuje.** Každý nový formát se objeví jednou v dílně (`/dilna/bloky/`) a na jednom místě antiky jako přídavek: nový blok mezi hotové odstavce nebo na konec stránky, bez změny okolních vět. Postřehy k hotovému obsahu jdou do `docs/navraty.md`.
- **Data, ne ruční text.** Jména, roky a místa z `src/data/`; citáty jen ze `zdroje.yaml`; každý nový citát, číslo nebo připsání projde skillem `atlas-overeni`.
- **Předmět podle D5.** Seřaď na ose je šňůra s kolíčky, Tipni si pravítko, Kdo to řekl? otočná kartička, Doplň citát vystřižená slova, Pravý, nebo podvržený? dvě razítka, Najdi slabé místo červená tužka. „Sedí“ a „zkus to jinak“ jsou jediná dvojice pro správně a jinak, bez červené a zelené.
- **Bez bodů a skóre.** Znalostní formáty říkají „sedí“ nebo „zkus to jinak“ s jednou větou, kam se podívat. Názorové formáty (Kdo by to řekl?, Najdi slabé místo) nemají správnou odpověď: student uvidí, kdo stál s ním.
- **Každé tažení má cestu bez tažení** (klepnutí, klávesnice); cíle aspoň 44 px; omezený pohyb a Klidný režim vypnou zamíchání i otočení.
- **Do deníku jen to, co si student vytvořil nebo zvolil** (stanovisko, sebehodnocení, slabé místo). Znalostní hry ukládají jen stav, aby šly obnovit.

## Kroky

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| P6 | Podklady pro formáty: citáty pro Kdo to řekl? a Doplň citát, podvržené citáty s doloženým původem, věty pro Kdo by to řekl?, situace pro Páry, čísla pro Tipni si, otázky pro Výpravy, látka stránky Argumentační klamy a manipulace | Opus 5.5 · high se skillem `atlas-overeni` | hotovo 17. 11. 2026 (Po P6) |
| K1 | Herní jádro a první dva formáty: sdílená logika v `src/lib/herna/`, herní pohyb (zamíchání, otočení karty, razítko), **Seřaď na ose** a **Kdo to řekl?** | Opus 5.5 · high se skillem `atlas-komponenta` | hotovo 17. 11. 2026 (Po K1) |
| K2 | **Tipni si**, **Kde to bylo?** (slepá mapa), **Doplň citát** | totéž | na řadě |
| K3 | **Páry**, **Pravý, nebo podvržený?**, **Najdi slabé místo**, **Kdo by to řekl?** | totéž | čeká na K2 |
| K4 | Stránky osob a mapa: **střídání malých aktivit** na medailoncích a profilech, **Výpravy** pro období 1 a 2, **Přehrát období**, trasy na mini mapě | totéž | čeká na K3 |
| K5 | Kurikulum: karta **Do hodiny**, **sebehodnocení** na konci cesty, stránka **Argumentační klamy a manipulace** | komponenty `atlas-komponenta`, text `atlas-psani` · Opus 5.5 · high | čeká na K4 |
| T | Přídavky v antice: každý formát na jednom místě (tabulka v Co rozhodnout, otázka 1), zadání a zpětné vazby skillem `atlas-psani`, zápis bloků do skillu `atlas-cesta` | Opus 5.5 · high se skilly `atlas-cesta` a `atlas-psani` | čeká na K5 |
| R | Revize větve: čtyři otázky zásady u každého formátu, 390 a 1440 px, světlý i tmavý režim, Klidný režim, klávesnice, čtečka, dotyk skutečnými událostmi, výkon stránek osob | Opus 5.5 · high se skillem `atlas-revize` a pluginem Design | čeká na T |
| O | Opravy po revizi, referenční snímky nových formátů, `docs/design.md` a `docs/pouceni.md` | Opus 5.5 · high | čeká na R |
| Uzavření | Schválení autorem, sloučení, GitHub, kontrola nasazeného webu a běhu kontrol, plán do archivu | Opus 5.5 · medium | čeká na O |

Každý krok končí commitem ve větvi `herna-v1`, oddílem „Po <krok>“ v tomto souboru a otázkami, jen když něco smí rozhodnout jen autor. Na GitHub se nic neposílá až do Uzavření.

## Formáty

| Formát | Co student dělá | Z čeho se plní | Uloží | Otázka pilíře (co si odnese) |
| --- | --- | --- | --- | --- |
| Seřaď na ose | Pět karet (lidé, události, díla) seřadí na šňůru; roky se ukážou až po správném pořadí | `lide.yaml`, `udalosti.yaml`, výběr id v YAML bloku | stav | kdo navazoval na koho; dějiny jako řetěz rozhovorů |
| Kdo to řekl? | Otočí kartičku s větou a tipne, čí je ze tří až čtyř lidí; po otočení dílo a místo | `zdroje.yaml` (jen ověřené citáty) | stav | poznat hlas myslitele podle toho, co ho trápilo |
| Doplň citát | Do vtlačené mezery vloží jedno ze tří vystřižených slov; pak celý citát s místem | `zdroje.yaml` a slova v YAML bloku | stav | slovo, na kterém věta stojí |
| Tipni si | Posuvníkem na pravítku odhadne číslo (roky mezi dvěma lidmi, délku života, vzdálenost); pak ryska a svorka rozdílu | data osob a míst, nebo ověřené číslo v YAML | stav | jak daleko a jak blízko jsou dějiny; překvapení |
| Kde to bylo? | Klepne do slepé mapy, kde se něco stalo; špendlík, razítko místa a čárkovaná spojnice ke správnému místu | `mista.yaml`, podklad mapy z `src/lib/podklad-sdileny.ts` | stav | odkud kdo byl a kam musel odejít |
| Páry | Spojí pojem se situací ze života (ne s definicí) | kolekce `pojmy` a situace v YAML bloku | stav | pojem jako nástroj na vlastní den |
| Pravý, nebo podvržený? | U citátu z internetu otiskne razítko „řekl to“, nebo „neřekl to“; pak kdo to doopravdy řekl, nebo odkud věta pochází | ověřené podvržené připsání v `zdroje.yaml` (nový druh záznamu) | stav | ověřit si citát dřív, než ho pošlu dál |
| Najdi slabé místo | Červenou tužkou přeškrtne premisu argumentu, kterou odmítá; pak vidí, kdo ji odmítl taky a proč | argument z YAML (stejný tvar jako Slož argument) | deník | najít v argumentu místo, kde se dá nesouhlasit |
| Kdo by to řekl? | K dnešní větě (z chatu, z reklamy, od kamaráda) vybere filozofa, který by ji podepsal, a připíše proč; pak uvidí, koho atlas navrhuje a proč | věty a vazby na hlasy v YAML | deník | spojit starou myšlenku s dnešní situací |
| Výpravy | Tři až pět otázek na období v Mapě a čase: tipni, ověř na mapě, zapiš | YAML výprav nad daty osob | stav | orientace v době, ne jen v lidech |
| Přehrát období | Minuta, kdy rok běží sám a lidé se objevují a mizí; dá se zastavit | data osob a období (`src/lib/zivot-na-mape.ts`) | nic | kdo žil s kým, kolik generací uplynulo |

Formáty se staví jednou jako ostrov v rámu aktivity a vkládají se jedním řádkem (`<SeradNaOse id="…" />`); obsah je v `src/content/bloky/<id>.yaml` se schématem v `src/lib/bloky-schema.ts`. Medailonek dostane formát bez YAML, sestavený z dat (K4).

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

## Zadání K2: Tipni si, Kde to bylo?, Doplň citát

Jako K1 (čtení, testy, zápis, zastavení), navíc Po K1.

1. **Tipni si:** papírové pravítko s jezdcem v barvě pera, měřítko podle čísla (roky, kilometry, procenta), posuvník je `input type="range"` s popisem pro čtečku; po odhalení ryska a čárkovaná svorka rozdílu, věta „Dělí je … let, asi … lidských životů“ z dat (`src/lib/` už počítá vzdálenost dvou životů: najdi a použij).
2. **Kde to bylo?:** slepý výřez mapy ze sdíleného podkladu, klepnutí položí špendlík, z klávesnice kříž šipkami a Enter; po klepnutí razítko místa a spojnice; vzdálenost jen slovem („blízko“, „o moře dál“), bez kilometrů a bodů. Popisky míst se nesmí potkat (pouceni: obdélníky jednotlivých řádků).
3. **Doplň citát:** vystřižená slova jako ve vzkazu z novin, vložení do vtlačené mezery tažením i klepnutím; po vložení celý citát s místem.

## Zadání K3: Páry, Pravý, nebo podvržený?, Najdi slabé místo, Kdo by to řekl?

Jako K1, navíc Po K2.

1. **Páry:** dvě řady lístků, spojení klepnutím na jeden a druhý (čára tužkou), z klávesnice výběrem v seznamu; po spojení všech jedna věta ke každému páru.
2. **Pravý, nebo podvržený?:** citát jako ústřižek z obrazovky telefonu, dvě razítka (kulaté „řekl to“, hranaté „neřekl to“); po otisku původ a jedna věta, jak si citát příště ověřit sám.
3. **Najdi slabé místo:** věty argumentu na linkovaném listu (tvar YAML jako Slož argument), tah červenou tužkou přes zvolenou premisu, pak kdo ji odmítl a proč (hlasy z dat); nejde o správnou odpověď, uloží se do deníku.
4. **Kdo by to řekl?:** dnešní věta jako výstřižek, výběr filozofa razítkem a důvod do pole; pak lístek „atlas by vybral…“ s důvodem z pramene a s tím, kdo by větu odmítl. Volba studenta zůstává a nehodnotí se.

## Zadání K4: stránky osob a mapa

Jako K1, navíc Po K3 a `docs/design.md` › Mapa a čas a Stránky z dat.

1. **Střídání malých aktivit** na medailoncích a profilech (pravidlo pestrosti 4): funkce v `src/lib/` vybere pro osobu podle dat jednu aktivitu (překvapivý současník: Kdo žil dřív?; daleká cesta: Kde to bylo?; ověřený citát: Kdo to řekl?; dlouhý život nebo mezera: Tipni si) tak, aby se sousední stránky v seznamu Lidé lišily. Výběr je při sestavení pevný, ne náhodný při každém načtení. Test projde všech 34 medailonků.
2. **Výpravy** pro období 1 a 2 v Mapě a čase nad dnešní Výpravou (jedna a pevná, Sókratés 424 př. n. l.): výběr výpravy podle období na pásu, lístek s otázkou, ověření na mapě, razítko „Sedí“. Jedna páska na obrazovku.
3. **Přehrát období:** tlačítko u pásu období, rok běží sám asi minutu, Zastavit a pokračovat, při omezeném pohybu a v Klidném režimu skoky po desetiletích bez animace. Navazuje na Přehrát život (`src/lib/zivot-na-mape.ts`).
4. **Trasy na mini mapě** v Době a lidech: oblouky se šipkou a rokem mezi místy (plátno D4, `docs/navraty.md` › mini mapa), jen kde jsou roky pobytu v datech.

## Zadání K5: Do hodiny, sebehodnocení, Argumentační klamy a manipulace

Jako K1, navíc Po K4, `docs/plany/kurikulum.md` (jen řádek `herna-v1` a odpovědi), skill `atlas-psani` pro všechny texty.

1. **Do hodiny:** karta s jednou otázkou do dvojice a jednou pro třídu, data v YAML k cestě, vzhled lístku pro učitele; v cestě ji student vidí jen v promítání hodiny a v přípravě hodiny, jinak ne. Zkouška v cestě 1.
2. **Sebehodnocení na konci cesty** (podle odpovědi 6): dvě krátké otázky (co už umím, v čem si jistý nejsem), bez bodů, do deníku k cestě; v deníku vedle Na začátku × Teď.
3. **Stránka Argumentační klamy a manipulace** podle odpovědi 7, z podkladů P6: úvod podle `atlas-psani`, u každého klamu antický a dnešní případ, uprostřed Najdi slabé místo a Pravý, nebo podvržený?, na konci odkaz do deníku. Odkazy na stránku z Otázek a z Kam dál cesty 1 (bez přepsání textu cesty). Stránka do `nove-stranky.spec.ts` a katalogu hodin.

## Zadání T: přídavky v antice

Ve větvi `herna-v1`. Přečti `CLAUDE.md`, `docs/styl.md`, `docs/pouceni.md`, v tomto plánu Formáty, odpovědi a oddíly Po K1 až Po K5, skilly `atlas-cesta` a `atlas-psani`.

1. Každý formát vlož na jedno místo antiky podle tabulky v Co rozhodnout, otázka 1. Napiš jen zadání, scénu a zpětné vazby nového bloku; okolní text se nemění. Kde se přídavek k místu nehodí, navrhni jiné a zapiš proč.
2. U každého přídavku čtyři otázky zásady a otázka pilíře, odpovědi do Po T.
3. Nové bloky do skillu `atlas-cesta` (knihovna bloků, jedna řádka a příklad) i do jeho kopie ve `skills/`; pravidla pestrosti tam zapíše až `uklid-v1`.
4. Celé `npm test`, commit, Po T, snímky kroků se skriptem `scripts/snimky-cesta.mjs`, plán do Projektu. Zastav se.

## Zadání R a O

**R** podle skillu `atlas-revize` s perspektivami student, učitel, uživatel a přístupnost (`design:accessibility-review`, `design:design-critique`): u každého formátu čtyři otázky zásady, otázka pilíře, telefon a notebook v obou režimech, Klidný režim, jen klávesnice, VoiceOver jen s autorem (pouceni: nastavení přístupnosti mění autor), dotyk skutečnými událostmi, váha stránek osob po K4. Záznam do `docs/revize/herna-v1.md`, nálezy podle dopadu, drobnosti rovnou opravit.

**O** opraví nálezy, přidá referenční snímky nových formátů do `tests/e2e/snimky.spec.ts`, doplní `docs/design.md` a `docs/pouceni.md` a skončí otázkou na schválení větve, kterou zodpoví jen autor.

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

Další krok: K2 (Tipni si, Kde to bylo?, Doplň citát) v novém chatu, Opus 5.5 · high se skillem `atlas-komponenta`; zadání je výš.

## Co zůstává na později

- Porota, Dialog, Úryvek s otázkou, Příběh v obrazech a hračky vzniknou v celku, který je první potřebuje (`docs/plany/po-auditu.md` › Větve).
- Co ti zůstalo?, kartičky s rozestupem a vystřižené citáty: `denik-v2`.
- Zvuk (Poslechni si) a film: `film-0`, zvuk později.
- Pravidla pestrosti a katalog aktivit do skillů: `uklid-v1`.
- Kontrola VoiceOverem z design-v2 (`docs/archiv/plany/design-v2.md` › Co zůstává na později) se hodí k revizi R, když bude autor u Macu.
