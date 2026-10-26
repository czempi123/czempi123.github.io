# Plán větve revize-antiky: souhrnná revize antiky (P11)

Antika má hotových všech deset cest z katalogu (1–8, 33, 34), dvanáct stránek osobností (šest portrétů, šest profilů), 34 medailonků, šest plných stránek velkých otázek a přípravu hodiny. Každý celek prošel vlastní revizí, ale nikdo zatím nečetl antiku jako jeden celek: jestli se cesty neopakují, jestli drží stejná jména, data a citace, jestli student projde atlasem od Domů po deník bez slepých míst a co z plánu fáze F3 ještě chybí před zkouškou se studenty. To je úkol P11. Větev založena z hlavní větve 25. 10. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| S | Souhrnná revize antiky: čtení napříč celky, kontroly dat a rozhraní, inventura mezer vůči F3, připravenost na zkoušku se studenty | Fable 5.1 · high se skillem `atlas-revize` | hotovo 25. 10. 2026, verdikt „po opravách“ (`docs/revize/antika-2026-10-25.md`); zadání v `docs/archiv/zadani/revize-antiky.md` |
| O | Opravy po revizi | Opus 5.5 · high (xhigh u delších zásahů do UI) | hotovo 26. 10. 2026 (`c20d1f1` až `fa227da`), oddíl Po O; zadání v `docs/archiv/zadani/revize-antiky.md` |
| P13 | Úprava skillů po fázi: co se v antice opakovaně nepovedlo, zobecnit do skillů a `docs/pouceni.md`; hledání místa pro interaktivní prvek i ve skillech `atlas-osobnost` (profily, medailonky) a `atlas-data` | Opus 5.5 · high | hotovo 26. 10. 2026, oddíl Po P13; zadání v `docs/archiv/zadani/revize-antiky.md` |
| Uzavření | Schválení autorem, sloučení do hlavní větve, hlavní větev na GitHub, zveřejnění na GitHub Pages s `noindex` | Opus 5.5 · medium | příprava hotová 26. 10. 2026 (oddíl Po Uzavření – příprava); čeká na „schvaluji“ a na přejmenování a zveřejnění repozitáře |

Stav a zadání dalších kroků se zapisují sem. Provedená zadání se v plném znění přesouvají do `docs/archiv/zadani/revize-antiky.md`.

## Proč teď a proč takhle

- **Pořadí z `docs/plan.md` a `docs/rozhodnuti.md` (25. 10. 2026):** cesta 33 byla poslední cesta antiky; další je P11, Stoický týden a zkouška se studenty.
- **Fable 5.1 podle katalogu promptů:** souhrnná revize potřebuje držet v hlavě desítky stránek najednou a hledat souvislosti, které revize jednoho celku nevidí.
- **Stoický týden jako vlastní větev po P11, ne uvnitř revize** (o tom jsem váhal, viz níž). Revize jen řekne, kam se týden napojí (Zkus to žít v cestách 5, 33 a 34, hlavička Seneky) a co z ověřených cvičení už je připravené.
- **Odložené úkoly z celků 9 a 10** patří sem (rozhodnutí z 23. a 25. 10. 2026): zastavený pohyb u ostatních kreseb, hlavička Seneky se třemi cestami na telefonu, nestálý test `cesta.spec.ts:79`.

## Co revize prověří (nad rámec revize jednoho celku)

### 1. Antika jako celek

- **Opakování napříč cestami:** stejný citát, příběh, případ, Zkus to žít nebo stavba kroku ve více cestách. Nejvíc hrozí u tří stoických cest (5, 33, 34), u kyniků a epikurejců (6, 7, profily Diogena, Kratéta a Hipparchie) a u Seneky, který nese cesty 8, 33 a 34.
- **Vyváženost:** otázka 1 „Jak mám žít?“ má čtyři cesty (4, 6, 7, 34), otázka 3 dvě, otázky 2, 8, 9 a 10 žádnou. Etika má podle architektury mít nejvýš třetinu cest; jak na tom je antika a co z toho plyne pro středověk.
- **Délka cest:** cíl je 15–20 minut, cesta 33 má podle `scripts/slova-cesta.mjs` 29. Změřit všech deset a říct, kde je délka problém (autor nechce zkracovat kvůli délce, takže doporučení musí stát na jiném důvodu, třeba únavě uprostřed kroku nebo opakování).
- **Monotónnost:** jestli všech deset cest nepoužívá stejnou šablonu kroků, stejné obraty („Představ si…“, závěrečné pravidlo) a stejné typy bloků ve stejném pořadí.

### 2. Konzistence

- Jména (závazná podoba v `src/data/lide.yaml`), letopočty, přepisy, citace (autor, dílo, místo), překlady stejného citátu na různých stránkách.
- Text proti datům: roky, místa a vztahy ve vyprávění proti `lide.yaml`, `vztahy.yaml`, `mista.yaml` a `udalosti.yaml`.
- Odkazy mezi stránkami: Kam dál, karty cest na otázkách, Doba a lidé, medailonky.

### 3. Průchod studenta napříč atlasem

- Domů → první cesta → pokračování → další cesta → deník. Kudy student z hotové cesty pokračuje a jestli atlas někde nekončí slepou uličkou.
- **Deník na konci období:** plán slibuje, že student na konci období uvidí, ke kterým odpovědím na velké otázky se přiklonil („V otázce dobrého života máš blízko k Epikúrovi…“). Ověřit, jestli to deník umí, a pokud ne, navrhnout, jak a kdy.
- Mapa a čas pro celou antiku: všech 50 lidí, kamera, řeka životů, vztahy, události.

### 4. Učitel

- Příprava hodiny: jsou v katalogu všechny cesty, bloky, kapitoly a hlasy z celé antiky?
- Učitelské podklady v `ucitel/` jsou jen pro celky 5 až 8; co chybí a jestli je to potřeba před zkouškou.
- Mapování na RVP G: které výstupy antika pokrývá a které ne.

### 5. Rozhraní a technika

- Zastavený pohyb u všech kreseb a animací v `src/components/ostrovy` (Jeskyně, Kde je střed, Kolik je dost, Loď, Maska, Přesýpací hodiny, Stejný vítr, Třetí čára, Zdvoj čtverec, Zrcadlo a další): obsah musí být vidět i bez pohybu (pravidlo z celku 9).
- Hlavička Seneky se třemi cestami na telefonu, s výhledem na Stoický týden.
- Nestálý test `cesta.spec.ts:79`: oprava (čekání na hydrataci v `pripravit` delší než pět vteřin, nebo posun po menších krocích).
- Celé `npm test`, axe, snímky klíčových stránek na 390 a 1440 px ve světlém i tmavém režimu.

### 6. Lidský hlas a čtivost napříč

Podle skillu `atlas-psani` (vznikl 25. 10. 2026). Znaky strojového textu, které se v jednom celku neprojeví, ale v deseti ano: oblíbené obraty, stejné otevírání kroků, stejná stavba zpětné vazby. Dál:

- **Úvody všech deseti cest a stránek otázek:** říkají, o čem cesta je a co si student odnese, nebo shrnují kroky a končí pořád stejnou větou („Než si přečteš…, odpověz sám“)? U úvodů cest navrhni nové znění všech deseti, i těch, které obstojí, ať se nečtou stejně.
- **Citáty:** odpovídá každý na otázku textu před ním, nebo jsou někde sbírkou? Zkouška zakrytím u citátů, které se opakují napříč celky.
- **Čtivost:** kde by student v cestě přestal číst; holá fakta na začátku profilů a kapitol.

### 7. Co z plánu F3 chybí

Inventura proti `docs/plan.md` (Plán etap, F3) a `docs/architektura.md` (Pořadí výroby, F3), každá položka s doporučením „před zkouškou se studenty“, „před středověkem“, nebo „později“:

- stránka období `/obdobi/antika` (kolekce `obdobi` je prázdná);
- stránky směrů (13 směrů má jen název, stránku žádný);
- myšlenkové pokusy jako samostatné stránky (Gygův prsten, Achilleus a želva, Karneadova deska, Lucretiovo zrcadlo času);
- pojmy, Příběh týdne, náboženství (Co je filozofie?, Co je náboženství?, judaismus, buddhismus, čínská tradice) a okno „Mezitím jinde“;
- stránky otázek 2, 8, 9 a 10 jsou prázdné, přitom antika na ně má hlasy z hotových stránek (Gygův prsten u Platóna, obec u Aristotela); doplnit z hotových osob, nebo počkat na další období? (nové osoby se nepřidávají);
- Stoický týden;
- skill `atlas-obdobi` (podle plánu vlna 3, po dokončení antiky).

### 8. Připravenost na zkoušku se studenty

Co je potřeba, aby šla jedna skutečná hodina nebo několik domácích průchodů: které cesty vybrat, co sledovat, jak sbírat zjištění. Web zatím běží jen lokálně; plán z 29. 9. 2026 říká, že o zveřejnění se rozhodne před zkouškou. Revize připraví podklad pro to rozhodnutí (GitHub Pages: co by se zveřejnilo, licence obrázků, co by se muselo dodělat), rozhodne autor.

### 9. Interaktivita: kde chybí kresba, animace nebo hra s myšlenkou

Přání autora z 25. 10. 2026: pohyblivé kresby a interaktivní prvky jsou pro učení to nejlepší, co atlas má (jeskyně v cestě 3 a další), a mají být všude, kde dávají smysl, klidně i u medailonků. Dnes jsou hlavně v cestách a v části profilů; medailonky, stránky otázek a mapa mají jen statické prvky (`MiniMapa`, `MiniOsa`, Doba a lidé).

Revize projde všechny typy stránek antiky a u každé řekne, kde by interaktivní prvek něco naučil. **Měřítko účelnosti:** student něco udělá (posune, přetáhne, přepne, odhadne) a uvidí myšlenku, kterou by z textu pochopil hůř. Ozdoba, hra na body nebo pohyb bez obsahu do atlasu nepatří. Platí pravidla, která už máme: obsah je vidět i v zastaveném obrázku a při omezeném pohybu, jde to ovládat klávesnicí a myší i prstem, žádný kód v rozhraní, nejdřív znovu použít hotovou komponentu.

Náměty k prověření (revize je může zamítnout a přidat vlastní):

- **Medailonky, z dat a pro všechny najednou:** „Kdo žil dřív?“ s náhodným současníkem nebo předchůdcem z dat; „žili současně 14 let / dělí je 519 let“ s posuvníkem dvou životů; trasa života na mini-mapě, kde se podle let rozsvěcují místa s rolí (narození, působení, exil). Prvek z dat poslouží 34 medailonkům dnes a stovce dalších v pozdějších obdobích bez psaní textu.
- **Profily a portréty:** velké myšlenky, které stojí jen na textu, i když by je ukázala kresba (třeba Parmenidovo „co není, nemůže být“ nebo Prótagorovo „člověk je měrou“); kresby z cest, na které by profil mohl odkázat místo vlastní.
- **Stránky otázek:** rozhovor napříč staletími jako posuvná osa hlasů, kde se student postaví k tomu, kdo je mu nejblíž, a uvidí, jak daleko od sebe ti lidé žili.
- **Mapa a čas:** co z plánu mapy (Změř vzdálenost, stín odkazu, trasa míst podle let) je hotové a co by antice nejvíc pomohlo.

Výstupem je tabulka: místo, co student dělá, co tím pochopí, hotová nebo nová komponenta, odhad náročnosti, priorita (před zkouškou se studenty / před středověkem / později). Drobné použití hotové komponenty může jít do O; nové komponenty mají vlastní větev se skillem `atlas-komponenta`.

## Nad čím jsem váhal

- **Stoický týden uvnitř P11, nebo zvlášť:** zvolil jsem zvlášť. Je to nový obsah se sedmi cvičeními, nejspíš i s novou komponentou (týdenní výzva v deníku), a potřebuje vlastní podklady, psaní a revizi. V revizi by se míchalo hodnocení hotového s psaním nového. Kdybys ho chtěl v téhle větvi, stačí říct; přibude krok mezi O a P13.
- **Jedna revize, nebo po částech:** jedno zadání pro Fable s pokynem psát záznam průběžně po oddílech. Rozdělit revizi do několika chatů by šetřilo kontext, ale ztratilo by se právě to, kvůli čemu P11 existuje: srovnání napříč.

## Co zůstává na později

- **Stoický týden** jako vlastní větev po P11 (`stoicky-tyden`); ověřená cvičení jsou v `docs/podklady/k-overeni.md` (večerní ohlédnutí, představa nejhoršího „Pět minut, jedna věc“).
- **Interaktivní prvky z bodu 9** jako vlastní větev (`interaktivita-v1`) se skillem `atlas-komponenta`; revize doporučí, jestli před zkouškou se studenty, nebo po ní.
- **Zkouška se studenty** po P11 a Stoickém týdnu; před ní rozhodnutí o zveřejnění.
- **Plán středověku (P12)** se skillem `atlas-obdobi`, cesta 9 „Je Bůh?“ jako první celek období 3.

## Po S (25. 10. 2026)

Krok S hotový, záznam je `docs/revize/antika-2026-10-25.md`. **Verdikt: po opravách.** Blokující nález není: žádná věcná chyba, podvržený citát ani nefunkční krok, axe na 30 stránkách bez nálezu, žádný rozbitý odkaz. Revize prošla všech devět bodů plánu (zadání v chatu mluvilo o osmi; bod 9 přibyl v `004169c`). Běžela na Opus 5.5 (model tohoto chatu), ne na Fable 5.1 z katalogu; kdybys chtěl druhý pohled napříč, stojí za to dát Fable přečíst jen záznam a nálezy 1 až 4.

Co jsem našel napříč:

- **Jedna šablona ve všech cestách.** Osm úvodů z deseti končí pokynem „Než si přečteš…, odpověz sám“, všech deset závěrů má odstavec „Ty jsi dnes [výčet]. Vrať se ke svému tahu…“, pět cest končí krokem „Kdo je na tvé straně“ s řadou „Jestli jsi řekl…“, cesty 5 a 6 mají stejný krok 2 „Tři koše“. Každá věta zvlášť obstojí; student ji pozná od třetí cesty. Návrhy nového znění všech deseti úvodů a závěrů jsou v nálezech 1 a 2.
- **Nejdelší krok je na konci.** Poslední kroky cest 2, 7, 8, 33 a 34 mají 445 až 625 slov, hlavně zastánce odpovědí, které student nezvolil (nález 4). Průměrná cesta má 27 minut, v cíli 15–20 jsou jen cesty 1 a 6.
- **Portrét Sókrata opakuje cestu 1 slovo od slova** v kapitole Věštba z Delf (nález 3).
- **Třetí čára a Cesta ven** po okamžitém zastavení pohybu ukazují začátek, ne obsah (nález 5); ostatních šest kreseb s pohybem je v pořádku.
- **Hlavička Seneky** (a Epikúra a Epiktéta) na telefonu odsune desku pod první obrazovku (nález 6).
- **Deník** neumí nahrát stažený soubor zpět ani přehled na konci období; cesty 33 a 34 se studentům ukazují s čísly z katalogu; hotová cesta nenabízí další (nálezy 8 a 9).
- **Opravil jsem rovnou:** štítky času cest 1, 3, 5 a 6 (`7a8d816`), nestálý test průchodu cesty 1 (`19477bb`), prázdný deník a zdvojenou větu v Epiktétově portrétu (`524627b`), pracovní skripty revize (`504a169`). Celé `npm test` po opravách: vitest 727 a Playwright 543 prošlo, průchod cesty 1 i v souběhu; katalog hodin Chyb: 0.

Nad čím jsem váhal a co jsem zvolil:

- **Úvody cest opravit rovnou, nebo navrhnout.** Navrhl jsem: mění to, co cesta studentovi slibuje, a skill `atlas-psani` takové zásahy předává autorovi. Návrhy mají věty do 25 slov a drží se obsahu cest; před zapsáním je potřeba projít `tests/`.
- **Stejná stavba cest (pořadí bloků).** Antiku kvůli tomu nepřestavuji: cesty jsou schválené a každá obstojí. Zapsal jsem to jako poučení pro plán středověku (nové bloky Dialog, Slož argument, Úryvek s otázkou dřív než další cesta stejné stavby).
- **Délka.** Autor nekrátí kvůli délce, takže z ní nedělám nález. Z délky plynou nález 4 (konec cesty) a výběr cest pro zkoušku; přepočet rozsahu v architektuře je otázka 7.
- **Zkouška, nebo Stoický týden dřív.** Plán říká Stoický týden před zkouškou. Doporučuji obráceně (otázka 5): zkouška ukáže, co v deseti hotových cestách nefunguje, a to se pak promítne do týdne i do středověku.
- **Kdo žil dřív? na medailoncích do O.** Hotová komponenta a skoro bez práce, ale mění šablonu medailonku pro všech 34 osob najednou; nechávám ho pro `interaktivita-v1` (otázka 10).

## Co rozhodnout po S

Prázdná odpověď znamená souhlas s doporučením.

1. **Úvody a závěrečné odstavce všech deseti cest** přepsat podle návrhů v záznamu (nálezy 1 a 2), s úpravami, které uznáš za vhodné. Doporučuji ano, v kroku O.
   Odpověď:
2. **Poslední krok „Kdo je na tvé straně“:** v O jen mezititulky po blocích, ať student skočí ke své odpovědi; blok, který ukáže nejdřív zastánce studentových odpovědí z deníku, ve větvi `interaktivita-v1`. Doporučuji ano.
   Odpověď:
3. **Hlavička profilu na telefonu:** pod 600 px ukázat cesty jako jeden řádek odkazů (jen názvy) místo karet, od 600 px karty jako dnes. Doporučuji tuto podobu; druhá možnost je přesunout karty cest pod desku a první odstavec.
   Odpověď:
4. **Čísla cest ve studentském rozhraní:** skrýt (Domů, přehled cesty, karty cest, hlavičky profilů), nechat je v datech a v přípravě hodiny. Doporučuji skrýt.
   Odpověď:
5. **Pořadí: zkouška se studenty před Stoickým týdnem.** Doporučuji ano (proti plánu z 25. 10.): zkouška hned po uzavření této větve, Stoický týden po ní.
   Odpověď:
6. **Zveřejnění před zkouškou:** bez webu jde jen hodina ve třídě z tvého notebooku, domácí průchody ne. Doporučuji zveřejnit na GitHub Pages po uzavření této větve, s `noindex` do konce zkoušky; podklad (co se zveřejní, licence, nastavení) je v záznamu, oddíl Zkouška se studenty. Rozhoduješ ty.
   Odpověď:
7. **Rozsah v architektuře:** přepsat odhad „35 cest po 15–20 minutách, 10 až 11 hodin“ podle antiky (průměr 27 minut, kolem 16 hodin). Doporučuji ano, v kroku O.
   Odpověď:
8. **Deník:** nahrání staženého souboru zpět jen tehdy, když budou domácí průchody (pak před zkouškou, v O); přehled na konci období před středověkem ve větvi `antika-doplnky`. Doporučuji.
   Odpověď:
9. **Otázky 2 a 8 z hotových osob antiky** (Platón, Aristotelés, Prótagorás, Epikúros, Sókratés) před středověkem; otázka 9 s cestou 9 ve středověku, otázka 10 s osvícenstvím. Doporučuji.
   Odpověď:
10. **Interaktivita:** pořadí ve větvi `interaktivita-v1` Kdo je na tvé straně z deníku, Slož argument (zkouška na Epikúrovi, potřeba pro Anselma v cestě 9), Dva životy u medailonků; Kdo žil dřív? na medailoncích také tam, ne v O. Doporučuji.
    Odpověď:
11. **Další větve v pořadí:** O, P13 a uzavření této větve; zkouška se studenty; `stoicky-tyden`; `interaktivita-v1`; `antika-doplnky` (Co je filozofie?, stránky období 1 a 2, čtyři směry, otázky 2 a 8, pokusy Gygův prsten a Zrcadlo, Co je náboženství? a judaismus, deník na konci období); skill `atlas-obdobi` a plán středověku (P12). Doporučuji.
    Odpověď:

## Po O (26. 10. 2026)

Krok O hotový v devíti commitech (`c20d1f1` až `fa227da`) a jednom s dokumenty, podle odpovědí 1 až 11 (všechny prázdné, tedy souhlas s doporučením). Celé `npm test` po opravách prošlo (vitest 735, Playwright 547), axe na 23 změněných stránkách bez nálezu, `kontrola-fokus` na profilech Seneky, Epikúra, Epiktéta a Aristotela, v deníku a na přehledu cesty 6 v pořádku, katalog hodin Chyb: 0. Snímky jsou v `Claude outputs/snimky-revize-antiky-O/` (pohyb, hlavičky, navigace, kroky).

Co se změnilo:

- **Úvody všech deseti cest** (nález 1) podle návrhů revize: otázka ze studentova života a co si odnese, bez pokynu „Než si přečteš…“. Úvod seznamu otázek bez pokynu k vlastnímu pokusu.
- **Závěrečné odstavce** (nález 2): výčet činností pryč, místo něj otázka na první tah té cesty. Cesta 8 má jen „Vrať se ke svému tahu z kroku 1. Odpověděl bys teď stejně?“, jak revize radila.
- **Portrét Sókrata** (nález 3): kapitola Věštba z Delf je jen scéna s odkazem na krok 3 cesty 1; citát `obrana-21d` v ní není. Blok Nejdřív sám zůstal.
- **Mezititulky v posledních krocích** cest 2, 7, 8, 33 a 34 (nález 4) podle bloků a odpovědí („Loď z prvního kroku“, „Předposlední židle“, „Co je potom“, „Senátor“, „Dvě hodiny s telefonem“…). V cestě 2 se odstavec o řece a bohyni přesunul za oddíl Člověk a věta „Podobně se dělí i dvě lodě ze čtvrtého kroku“ je teď „I tady se zastánci dělí podobně“ (pod mezititulkem by se opakovala).
- **Kresby** (nález 5): Třetí čára a Cesta ven po zastavení hned po načtení kreslí totéž co při omezeném pohybu (všech sedm bublin s otazníkem, vězeň na strmé cestě); testy zastavení. Maska a Přesýpací hodiny jsou v dílně (13 kreseb).
- **Hlavička profilu na telefonu** (nález 6): pod 600 px jsou cesty řádek odkazů „Cesta“ + název, bez desky, kroků, minut a šipky; od 600 px karty jako dřív. Společný profil Kratéta a Hipparchie má dál své malé karty vedle otázky (jinak by první odstavec spadl pod lištu).
- **Krok 2 cesty 6** (nález 7): „Nutné, přirozené, prázdné“ a poslední věta „Jak je rozeznával, uvidíš, až karty roztřídíš. Jsou to věci z obyčejného týdne, možná i z tvého.“
- **Deník ze souboru** (nález 8): tlačítko „Nahrát deník ze souboru“ vedle stažení. Soubor se k deníku v prohlížeči přidá: co je jen v jednom, zůstane; u téže odpovědi, stavu bloku nebo hodiny vyhraje novější; postup v cestě sečte otevřené kroky. Cizí soubor deník nezmění. Ověřeno testem: stažení na jednom „zařízení“, nahrání na druhém s jiným deníkem, opakované nahrání nic nezdvojí.
- **Čísla cest** (nález 9) student nevidí: Domů „První cesta“, karty a hlavičky „Cesta · 8 kroků · asi 30 minut“, Lidé „Cesta: …“, Kam dál profilů „Cesta“. Zůstala v datech, v přípravě hodiny a u velkých otázek (ty jsou číslované 1 až 10 bez mezer).
- **Další cesta** (nález 9): Kam dál hotové cesty nabídne první cestu, kterou student podle deníku ještě nemá hotovou, nejdřív z téže otázky, pak podle katalogu (`poradiDalsichCest` v `src/lib/cesty.ts`). Když má hotové všechny, odkaz zmizí.
- **Drobnosti** (nález 10): stránky otázek 4 a 7 začínají otázkou, ne „Představ si“; cesta 4 odkazuje na Epiktéta jen jménem cesty (parafrázi Rukojeti 5 má cesta 8); odkaz na otázku Jak mám žít? je v cestách 5 a 6 řečený jinak.
- **Rozsah** (odpověď 7): `docs/architektura.md` počítá s cestami 14 až 35 minut, průměrně 27, a s kolem 16 hodinami na 35 cest. Štítek cesty 1 je podle skriptu 14 minut (dřív 15); ostatní štítky sedí.

Co jsem našel cestou a opravil: závěr cesty 4 psal „Odpovídají tam i tři další“, na stránce otázky 1 ale mluví pět hlasů (Hipparchia a Seneca přibyli v celcích 8 a 9); teď „čtyři další“.

Nad čím jsem váhal a co jsem zvolil:

- **Úvody jsem od návrhů revize na čtyřech místech odchýlil.** Cesta 4: návrh říkal, že se Aristotelés „přel se Sókratem“; Aristotelés se narodil patnáct let po Sókratově smrti, takže „nesouhlasil se Sókratovou odpovědí“. Cesta 4 taky nezačíná „Každý to zná“ (skill `atlas-psani` takové otevírky zakazuje). Cesta 6: místo „a přesto se přeli, proč“ je „ale každý z jiného důvodu“. Cesta 34 nekončí druhým „opravdu tvůj“.
- **Závěry cest 6 a 34 jinak než návrh.** Návrh pro cestu 6 („Která touha by neprošla Epikúrovou zkouškou?“) opakoval otázku, kterou student dostane už ve zpětné vazbě kroku 2; teď „Bez které věci z koše „Těší mě“ bys teď uměl být?“ (Epikúrovo „jen bez něj musíš umět být“ z kroku 3). Cesta 34: panel Na začátku vedle pravidla ukazuje tah z kroku 1 a Přesýpací hodiny nic neukládají, proto „Podívej se na svůj tah z kroku 1 a rozděl v duchu znovu den ze třetího kroku…“.
- **Cesta 8 nenabízí jako Další cestu cestu 33** „Co když přijde to nejhorší?“: test cesty 8 hlídá, že slovo „nejhorší“ na jejích stránkách nestojí, a po cestě o strachu ze smrti by ten název četl student, kterému někdo umírá, jinak, než je myšlen. Přibylo pole `nenabizet` v přehledu cesty; cesta 8 nabídne cestu 34. Otázka 1.
- **Deník se spojuje, nepřepisuje.** Student, který má odpovědi na telefonu i na počítači, by přepsáním o jedny přišel. Otázka 2.
- **Hlavička na telefonu:** řádek odkazů s nadtitulkem „Cesta“ u každého, ne jeden nadpis „Cesty“ nad řádkem: ten byl vyšší a u společného profilu se nevešel. Na 390 × 844 je deska u Seneky na první obrazovce; na 390 × 667 (menší telefon) začíná pod lištou. Otázka 3.
- **Mezititulky v cestě 8** jsou na stejné úrovni jako „Kdo je na tvé straně“ nad nimi: menší nadpis by potřeboval nový styl a kroky jiných cest ho nemají.

## Co rozhodnout po O

Prázdná odpověď znamená souhlas s doporučením.

1. **Cesta 8 a cesta 33:** Kam dál cesty 8 nenabízí jako další cestu „Co když přijde to nejhorší?“, nabízí „Kam mi mizí čas?“. Doporučuji nechat; druhá možnost je nabízet i ji a z testu cesty 8 odkaz vyjmout.
   Odpověď:
2. **Deník ze souboru:** soubor se k deníku v prohlížeči přidá, nic nepřepíše. Doporučuji nechat; kdyby se hodilo i „nahradit tímhle souborem“, přibude druhé tlačítko.
   Odpověď:
3. **Hlavička na malém telefonu (390 × 667):** u Seneky začíná deska pod lištou, na běžném telefonu (390 × 844) je vidět. Doporučuji přijmout a Stoický týden do hlavičky nedávat (patří do Zkus to žít v cestách 5, 33 a 34); druhá možnost je skrýt na malých telefonech nadtitulek „Cesta“ u druhé a další cesty.
   Odpověď:
4. **Odchylky od návrhů revize** (úvody cest 4, 6 a 34, závěry cest 6 a 34, výše v Nad čím jsem váhal). Doporučuji nechat, jak jsou.
   Odpověď:
5. **Další krok:** P13 (skilly a poučení) v novém chatu podle zadání níž, pak uzavření větve se zveřejněním na GitHub Pages s `noindex` do konce zkoušky (odpověď 6 po S). Doporučuji.
   Odpověď:

## Po P13 (26. 10. 2026)

Krok P13 hotový v jednom commitu, podle odpovědí 1 až 5 po O (všechny prázdné, tedy souhlas). Poučení z antiky jsou v těch skillech, které je při psaní a revizi použijí; `docs/pouceni.md` má jen řádek s odkazem. `atlas-psani` jsem neměnil: pravidla čtivosti (úvody, šablona napříč) zůstávají jen v něm a ostatní skilly na něj odkazují.

Co se změnilo:

- **`atlas-cesta`:** délka cesty podle antiky (14 až 35 minut, průměrně 27) místo 15–20; v osnově **Stavba podle látky** (každé období aspoň jedna cesta jiné stavby, nové bloky dřív než další cesta stejné stavby, výpis bloků a názvů kroků hotových cest, žádný druhý krok „Tři koše“); úvod a **závěrečný odstavec** se píšou naposledy a porovnávají s cestami období, závěr se ptá na první tah té cesty a nevyjmenovává; krok **Kdo je na tvé straně** s mezititulky podle bloků, nad asi 450 slov vždy (slova kroků vypíše `slova-cesta.mjs`); číslo cesty jen v datech a v přípravě hodiny, Další cesta a pole `nenabizet`; scéna z portrétu (portrét ji pak vypráví kratší s odkazem); **počty z jiných stránek** do textu nepsat; zastavená kresba ukáže obsah. Tři nové Časté chyby a dva body Kdy je hotovo.
- **`atlas-revize`:** nový krok 3 **Srovnej celek s ostatními cestami období** (úvody, závěry, názvy kroků, bloky, portrét vedle kroku cesty; vzor potřetí je nález „důležité“), kroky přečíslované 1–7; místo „vejít se do 20 minut“ věta, že délka sama nález není, nález je krok, kde by student přestal číst; v kontrolním seznamu zastavená kresba, počty, mezititulky, portrét × cesta, číslo cesty a Další cesta, závěr na první tah.
- **`atlas-komponenta`:** past **Zastavená kresba kreslí obsah, ne začátek smyčky** (pod `.kresba--pohyb:not(.kresba--bezi)` jméno animace `none`, test zastavení hned po načtení); totéž v `references/kontrolni-seznam.md`.
- **`atlas-osobnost`:** **Scénu, kterou nese cesta, vyprávěj kratší** (odkaz na krok, citát z kapitoly pryč, citát v celku nejvýš dvakrát); u velkých myšlenek **Mohl by student myšlenkou pohnout?** s měřítkem účelnosti a „nejdřív hotová komponenta“; šablona Kam dál „Cesta“ bez čísla a poznámka k tomu; dva body Rychlé kontroly.
- **`atlas-data`:** nový oddíl **Prvky z dat** (Kdo žil dřív?, Dva životy, trasa míst; proto úplné roky, místa s `od`/`do` a vztahy; náměty do podkladů vlny; staví `atlas-komponenta` ve větvi `interaktivita-v1`).
- **`skills/atlas-obdobi/poznamky.md`** (nový): co skill `atlas-obdobi` musí převzít z antiky: stavba cest, protihlas z jiné tradice, vyváženost otázek, délka, úvody a závěry napříč, jeden prvek k pohybu na celek a Slož argument před cestou 9.
- **`docs/pouceni.md`:** šest řádků v oddílu Celek s odkazy na skilly, řádek o kresbě v Technice zobecněný na všechny kresby, hlavička (celky 1 až 10 a souhrnná revize).
- **`docs/design.md`:** Kresba s pohybem › Pohyb: zastavená kresba = stav při omezeném pohybu, test zastavení; Přesýpací hodiny už nejsou odchylka. Navíc jsem dopsal, co O v `design.md` nechal po staru: čísla cest (Začátek na Domů, Karta cesty, Vstupy osobnosti, Cesta › Přehled a Vstupy), řádek odkazů pod 600 px, Kam dál s Další cestou, pole `nenabizet` a délku cesty.

Délka skillů po úpravě: `atlas-cesta` 4 811 slov (dřív 4 364), `atlas-osobnost` 2 970 (2 790), `atlas-revize` 2 315 (2 124), `atlas-komponenta` 1 418 (1 344), `atlas-data` 1 383 (1 259), `atlas-psani` beze změny 3 180.

Nad čím jsem váhal a co jsem zvolil:

- **Poznámky pro `atlas-obdobi`.** Skill ještě není. Zapsal jsem je do `skills/atlas-obdobi/poznamky.md`, do složky budoucího skillu: v `docs/architektura.md` (schválený stav) by překážely a v `docs/pouceni.md` by se ztratily mezi poučeními z psaní. Do účtu Claude se soubor neukládá. Otázka 1.
- **Pravidlo o konci úvodu** („Než si přečteš…“) jsem do `atlas-cesta` nepsal: je v `atlas-psani` › Úvody. `atlas-cesta` má jen postup (napsat naposledy, porovnat). Závěrečný odstavec ano: je to pravidlo stavby závěru cesty a `atlas-psani` o něm nemluví.
- **`atlas-cesta` přerostl k 4 800 slovům.** Nezkracoval jsem ho: zkracovat schválená pravidla je jiný zásah než zobecnit poučení. Otázka 2.
- **Práh „potřetí“** v revizi napříč: revize antiky psala, že student šablonu pozná od třetí cesty; dvě stejné věty v období nález nejsou.
- **`design.md` mimo kresbu.** Zadání jmenovalo jen oddíl Kresba s pohybem; čísla cest a hlavičku na telefonu jsem opravil taky, jinak by další komponenta stavěla podle popisu, který neplatí.
- **Zveřejnění.** Repozitář je `czempi123/atlas`, na GitHub Pages by atlas byl na adrese `czempi123.github.io/atlas/`. V obsahu a komponentách je asi 180 odkazů, které začínají `/` (k tomu odkazy skládané ve skriptech): pod podadresou by vedly mimo atlas. Rozhodnout je potřeba před Uzavřením (otázky 3 a 4).

## Co rozhodnout po P13

Prázdná odpověď znamená souhlas s doporučením.

1. **Poznámky pro `atlas-obdobi`** v `skills/atlas-obdobi/poznamky.md`; až skill vznikne, zapracují se do něj a soubor zmizí. Doporučuji nechat.
   Odpověď:
2. **Délka `atlas-cesta`:** při tvorbě skillu `atlas-obdobi` přesunout oddíly Jak psát bloky a Stránka velké otázky do `skills/atlas-cesta/references/`, ať `SKILL.md` drží postup a skill se načítá levněji. Doporučuji tehdy, ne teď.
   Odpověď:
3. **Adresa webu:** (a) přejmenovat repozitář na `czempi123.github.io`, atlas bude v kořeni a odkazy zůstanou, jak jsou; (b) vlastní doména (placená, také kořen); (c) podadresa `/atlas/` a úprava všech odkazů na `base` (velký zásah, vlastní větev, zveřejnění by se posunulo). Doporučuji (a).
   Odpověď:
4. **Veřejný repozitář:** GitHub Pages na bezplatném účtu chce veřejný repozitář, takže budou vidět i `docs/`, `ucitel/`, podklady a historie commitů. Uzavření předtím projde repozitář, jestli v něm není nic, co veřejné být nemá. Doporučuji ano; rozhoduješ ty.
   Odpověď:
5. **`noindex`:** značka `<meta name="robots" content="noindex">` v základním rozvržení na všech stránkách, bez zákazu v `robots.txt` (vyhledávač musí stránku přečíst, aby značku viděl). Po zkoušce ji jeden commit sundá. Doporučuji.
   Odpověď:

## Po Uzavření – příprava (26. 10. 2026)

Příprava podle odpovědí 1 až 5 po P13 (všechny prázdné, tedy souhlas): adresa (a), veřejný repozitář, `noindex`. Nic se neslučovalo ani neposílalo.

- **Adresa:** `astro.config.mjs` má `site: 'https://czempi123.github.io'`, bez `base`. Atlas pojede v kořeni, až se repozitář `czempi123/atlas` přejmenuje na `czempi123.github.io`.
- **`noindex`:** základní rozvržení dává každé stránce `<meta name="robots" content="noindex">` s komentářem „do konce zkoušky se studenty“; dílna má dál `noindex, nofollow` (jedna značka na stránku). `robots.txt` atlas nemá. Test `tests/e2e/noindex.spec.ts` čte všechny stránky v `dist/`.
- **Workflow** `.github/workflows/pages.yml`: po pushi do `main` (a ručně) `npm ci`, `npm run build` s Pagefindem, `actions/upload-pages-artifact` z `dist/` a `actions/deploy-pages`; Node 22 jako v `kontroly.yml`. `kontroly.yml` je beze změny (jeho první komentář „Web se nenasazuje“ teď neplatí; zadání ho kázalo nechat).
- **Licence obrázků:** všech 17 obrázků v `zdroje.yaml` zveřejnění na webu dovoluje: jedenáct CC0 nebo Public Domain z muzeí (Met, Art Institute of Chicago, Rijksmuseum, NGA), tři volná díla (dva odlitky ze SMK, rytina z roku 1715), Stockdale jako dílo federální vlády USA (PD-USGov-Military-Navy), Sókratés CC BY-SA 2.5 a dvě fotografie Seneky CC BY-NC-SA 4.0 (atlas je nekomerční; obě vyžadují jméno a licenci, ty jsou na profilu v Pramenech). Nejasná licence žádná.
- **Licence vidět na stránce:** profily je mají v Pramenech, ale čtyři vstupy cest s obrazem (cesta 2 číše s loděmi, cesta 3 jeskyně, cesta 7 Cats, cesta 33 Stockdale) ukazovaly jen popisek. `Pribeh.astro` teď v kroku cesty přidá pod popisek řádek „autor. Licence [licence s odkazem].“; profil ho nemá (zdvojil by Prameny). Test `tests/e2e/obrazky-licence.spec.ts`: každá stránka v `dist/` s obrázkem ze `zdroje.yaml` má jeho licenci i odkaz na zdroj. Snímky na 390 a 1440 px ve světlém i tmavém režimu jsou v `Claude outputs/snimky-uzavreni/`.
- **Písma a ostatní:** Newsreader a Instrument Sans jsou pod SIL Open Font License 1.1 (zveřejnění na webu dovoluje); ikony v `public/ikony/` jsou vlastní; podklad mapy je Natural Earth (volné dílo) z balíčku world-atlas (ISC).
- **Kontrola repozitáře (soubory i historie):** žádné tokeny, klíče, hesla ani soubory `.env`; v historii čtyři shody vzoru klíče jsou náhodné řetězce uvnitř base64 obrázku. Telefony a e-maily v souborech jsou jen veřejné kontakty linek pomoci (Linka bezpečí, Vigvam, Anabell, 116 123) v podkladech, listech pro učitele a v `zdroje.yaml`; patří tam. Jména studentů, údaje o škole, kanceláři nebo bydlišti v repozitáři nejsou. Uživatelské jméno na Macu je v cestách v `CLAUDE.md` a v zadáních (`/Users/vojtechczempka/Atlas`). Dva commity mají autora `czempi123 <angelus.cz@gmail.com>`, ostatní (423) `czempi123@users.noreply.github.com`: po zveřejnění bude ta adresa u dvou commitů vidět; historie se nepřepisovala.
- **Testy:** celé `npm test` (vitest 735, Playwright 548 prošlo, 1 spadl: průchod cesty 1 `cesta.spec.ts:88` čekal přes 15 s na hydrataci ostrovu při plném souběhu). Po úpravě Příběhu nové sestavení a dotčené testy (licence, `noindex`, odkazy, cesty 1, 2, 3, 7 a 33): 70 prošlo, průchod cesty 1 také.
- **Náhled** (`npx astro preview`, `scripts/kontrola-zverejneni.mjs`): Domů, krok cesty 1 a 33, profil Seneky a deník 200 s `noindex` a ikonami, hledání „Epiktétos“ pět výsledků (první profil Epiktéta), žádný požadavek s chybou.
- **CLAUDE.md:** místo „Web zatím běží jen lokálně“ adresa, workflow a `noindex` do konce zkoušky. Rozhodnutí v `docs/rozhodnuti.md`.

Nad čím jsem váhal a co jsem zvolil:

- **Kde ukázat licenci v cestě.** Řádek pod popiskem Příběhu jen v kroku cesty, ne Prameny na konci kroku: krok žádné Prameny nemá a čtyři obrázky by kvůli tomu dostaly nový oddíl. U PD a CC0 to zákon nežádá, ale zadání chce autora a licenci vidět všude.
- **Nestálý test průchodu cesty 1** spadl při plném souběhu znovu (revize S ho opravovala delším čekáním). Samostatně i v menší sadě prochází. Nechal jsem ho být; patří k `interaktivita-v1` nebo dalšímu zásahu do testů, ne k zveřejnění.

## Zadání Uzavření

V novém chatu projektu Atlas s připojenou složkou Atlas a zapnutým Desktop Commanderem, až odpovíš na otázky výš. **Opus 5.5 · medium.**

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Krok Uzavření větve revize-antiky: připravit zveřejnění na GitHub Pages s noindex, po mém schválení sloučit do hlavní větve, poslat na GitHub a zveřejnit. Moje odpovědi jsou v plánu větve docs/plany/revize-antiky.md v oddílu „Co rozhodnout po P13“ (prázdná odpověď znamená souhlas). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch revize-antiky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/pouceni.md, v plánu větve oddíly Po P13 a Co rozhodnout po P13 a v záznamu revize docs/revize/antika-2026-10-25.md oddíl 11 (Zkouška se studenty, Podklad pro rozhodnutí o zveřejnění).

1. Příprava ve větvi revize-antiky:
   - astro.config: `site` podle odpovědi 3 (a `base` jen tehdy, když jsem zvolil podadresu; pak se zastav a napiš mi, co úprava odkazů obnáší, nic nepřepisuj).
   - noindex podle odpovědi 5: značka v src/layouts/Zakladni.astro s komentářem „do konce zkoušky se studenty“; test, že ji má každá stránka v dist/.
   - Workflow .github/workflows/pages.yml: po pushi do hlavní větve npm ci, npm run build (s Pagefindem) a nasazení dist/ přes actions/deploy-pages; Node jako v kontroly.yml. kontroly.yml nech beze změny.
   - Licence před zveřejněním: projdi všechny obrázky v zdroje.yaml › obrazky (licence dovoluje zveřejnění na webu, autor a licence jsou na stránce vidět) a zvlášť fotografie 20. století (Stockdale) a vše, co není CC, PD nebo vlastní kresba; licence písem v public/ (OFL a podobné). Obrázek s nejasnou licencí nemaž ani nestahuj: zapiš ho do plánu větve a zastav se, rozhodnu já.
   - Projdi repozitář (soubory i historii, git log -p jen hledáním), jestli v něm není nic, co nemá být veřejné: osobní údaje, e-maily mimo commity, tokeny a klíče, jména studentů. Nálezy mi napiš, nic nepřepisuj v historii.
   - npm test celé (na pozadí s výstupem do souboru), npm run build a npx astro preview: projdi Domů, cestu, profil, hledání a deník pod cílovou adresou.
   - CLAUDE.md: věta „Web zatím běží jen lokálně“ podle stavu po zveřejnění (adresa, noindex do konce zkoušky).
   - Do plánu větve oddíl „Po Uzavření – příprava (datum)“, rozhodnutí do docs/rozhodnuti.md, commit.

2. Pak se zastav a napiš mi krátce: co je připravené, výsledek licencí a kontroly repozitáře, co musím udělat sám na GitHubu (přejmenování nebo zveřejnění repozitáře, Settings › Pages › Source: GitHub Actions) a že čekáš na moje „schvaluji“. Bez něj nic neslučuj a nic neposílej.

3. Po mém schválení: git switch main, git merge --no-ff revize-antiky, npm test celé, git push origin main. Po doběhnutí workflow ověř zveřejněný web (Domů, jedna cesta, jeden profil, hledání, ikony, noindex přes curl). Do plánu větve oddíl „Po Uzavření (datum)“, řádek revize-antiky v docs/plan.md (hotovo, sloučeno, zveřejněno, adresa) a odstavec Další větve v pořadí (další je zkouška se studenty), zadání Uzavření přesuň do docs/archiv/zadani/revize-antiky.md, plán větve přesuň do docs/archiv/plany/. Commit a push hlavní větve.

4. docs/plan.md a plán větve (z archivu) nahraj do projektu Claude. Napiš mi adresu webu a jednou větou, jak noindex po zkoušce sundat.
```
