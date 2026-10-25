# Plán větve revize-antiky: souhrnná revize antiky (P11)

Antika má hotových všech deset cest z katalogu (1–8, 33, 34), dvanáct stránek osobností (šest portrétů, šest profilů), 34 medailonků, šest plných stránek velkých otázek a přípravu hodiny. Každý celek prošel vlastní revizí, ale nikdo zatím nečetl antiku jako jeden celek: jestli se cesty neopakují, jestli drží stejná jména, data a citace, jestli student projde atlasem od Domů po deník bez slepých míst a co z plánu fáze F3 ještě chybí před zkouškou se studenty. To je úkol P11. Větev založena z hlavní větve 25. 10. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| S | Souhrnná revize antiky: čtení napříč celky, kontroly dat a rozhraní, inventura mezer vůči F3, připravenost na zkoušku se studenty | Fable 5.1 · high se skillem `atlas-revize` | hotovo 25. 10. 2026, verdikt „po opravách“ (`docs/revize/antika-2026-10-25.md`); zadání v `docs/archiv/zadani/revize-antiky.md` |
| O | Opravy po revizi | Opus 5.5 · high (xhigh u delších zásahů do UI) | zadání níž, po odpovědích v oddílu Co rozhodnout po S |
| P13 | Úprava skillů po fázi: co se v antice opakovaně nepovedlo, zobecnit do skillů a `docs/pouceni.md`; hledání místa pro interaktivní prvek i ve skillech `atlas-osobnost` (profily, medailonky) a `atlas-data` | Opus 5.5 · high | zadání vznikne po O |
| Uzavření | Schválení autorem, sloučení do hlavní větve, hlavní větev na GitHub | Opus 5.5 · medium | zadání vznikne po P13 |

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

## Zadání O

V novém chatu projektu Atlas s připojenou složkou Atlas a zapnutým Desktop Commanderem, až odpovíš na otázky výš. **Opus 5.5 · high** (xhigh, když se zasekne úprava hlavičky profilu nebo kreseb).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Krok O větve revize-antiky: opravy po souhrnné revizi antiky (P11). Záznam revize je docs/revize/antika-2026-10-25.md, moje odpovědi jsou v plánu větve docs/plany/revize-antiky.md v oddílu „Co rozhodnout po S“ (prázdná odpověď znamená souhlas s doporučením). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch revize-antiky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, skill atlas-psani a ze záznamu revize oddíl 9 Nálezy; pro úpravy UI skill atlas-komponenta. Restartuj náhled npm run dev.

1. Texty (nálezy 1, 2, 3, 4, 7 a 10, podle mých odpovědí 1, 2 a 7): nové úvody všech deseti cest a nové závěrečné odstavce posledních kroků; kapitola Věštba z Delf v portrétu Sókrata; mezititulky v posledních krocích cest 2, 7, 8, 33 a 34; krok 2 cesty 6; úvod seznamu otázek; odstavec Rozsah pro studenta v docs/architektura.md. Návrhy ze záznamu ber jako výchozí znění: ověř je proti textu cesty a datům bloků (názvy košů a vrstev), věty do 25 slov, žádné nové tvrzení bez podkladů. Každou větu, kterou měníš, najdi nejdřív v tests/ (grep -rn) a test uprav v tomtéž commitu. Commit po druzích: úvody, závěry, portrét a krok 6, mezititulky.

2. Kresby (nález 5): Třetí čára a Cesta ven v zastaveném stavu (.kresba--pohyb bez .kresba--bezi) kreslí stav jako při omezeném pohybu: šest jedniček a otazník nad „ty“, vězeň na strmé cestě. Ověř node scripts/revize-pohyb.mjs (snímky si prohlédni) a přidej test zastavení hned po načtení podle vzoru Přesýpacích hodin. Doplň Masku a Přesýpací hodiny do dílny (/dilna/bloky/).

3. Navigace (nálezy 6, 8 a 9, podle odpovědí 3, 4 a 8): hlavička profilu na telefonu, čísla cest ve studentském rozhraní, „Další cesta“ v Kam dál hotové cesty, a jestli platí odpověď 8, nahrání deníku ze souboru (ověř, že soubor ze Stáhnout deník do souboru jde nahrát zpět, a co se stane s jiným deníkem v prohlížeči). Ověř na 390 a 1440 px ve světlém i tmavém režimu, klávesnicí a node scripts/kontrola-fokus.mjs na profilech Seneky, Epikúra, Epiktéta a Aristotela; hlavičky vyfoť node scripts/revize-hlavicky.mjs.

4. Ověření: node scripts/slova-cesta.mjs pro všech deset cest a štítky minut podle výsledku; npm run build; node scripts/hodiny-katalog.mjs (Chyb: 0); celé npm test jednou na pozadí s výstupem do souboru; axe přes node scripts/revize-axe.mjs na stránkách, které jsi změnil. Snímky změněných kroků přes scripts/snimky-cesta.mjs do Claude outputs/snimky-revize-antiky-O/ a prohlédni listy.

5. Do plánu větve napiš oddíl „Po O (datum)“: co jsi změnil, nad čím jsi váhal a co jsi zvolil, a „Co rozhodnout po O“ s očíslovanými otázkami, doporučením a prázdným řádkem „Odpověď:“. Připrav zadání kroku P13 ve stejné podobě (model, úsilí, text promptu); P13 zobecní do skillů a docs/pouceni.md poučení z antiky: šablona napříč cestami (úvody, závěry, Kdo je na tvé straně), délka posledního kroku, kresba po zastavení, opakování mezi portrétem a cestou, pořadí bloků pro středověk, hledání místa pro interaktivní prvek v atlas-osobnost a atlas-data. Zadání O přesuň do docs/archiv/zadani/revize-antiky.md. Rozhodnutí zapiš do docs/rozhodnuti.md, aktualizuj řádek revize-antiky v docs/plan.md. Commit.

6. Nic neslučuj a nic neposílej na GitHub. Plán větve, docs/plan.md a docs/architektura.md (jestli se změnila) nahraj do projektu Claude. Pak mi krátce napiš, co je hotové, nad čím jsi váhal a na co mám odpovědět.
```
