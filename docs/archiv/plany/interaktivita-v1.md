# Plán větve interaktivita-v1: interaktivita z revize antiky

Souhrnná revize antiky prošla všechny typy stránek s měřítkem „student něco udělá a uvidí myšlenku, kterou by z textu pochopil hůř“ a navrhla, co postavit (`docs/revize/antika-2026-10-25.md`, oddíl 12 a nález 4). Tahle větev postaví první čtyři věci z toho seznamu: blok, který na konci cesty ukáže nejdřív zastánce studentových odpovědí, blok Slož argument z knihovny bloků a dva prvky z dat pro medailonky (Dva životy a Kdo žil dřív?). K tomu na začátku jedna technická oprava: kontrola typů na GitHubu padá od prvního běhu 2. 10. 2026 (v plánu bylo původně 17. 10., viz Po K0) a lokální `npm test` ji nepouštěl. Větev založena z hlavní větve 26. 10. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: zkouška se studenty počká, až je autor bude mít (rozhodnutí 26. 10. 2026); atlas je ale veřejný, takže domácí průchody jsou možné už dnes a nejdelší místo antiky, poslední krok cest 2, 7, 8, 33 a 34, čte každý, kdo cestu dojde. Středověk přidá cestu 9 (Anselmův důkaz, který potřebuje Slož argument) a desítky medailonků: prvek, který vznikne z dat teď, dostanou všechny najednou bez psaní textu.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| K0 | Kontrola typů: oprava typu pluginu sazby, `astro check` v `npm test`, aby chyba neprošla lokálně | Sonnet 5.5 · medium | hotovo 29. 10. 2026 (Po K0) |
| K1 | Blok Kdo je na tvé straně: logika čtení deníku, komponenta podle `atlas-komponenta`, nasazení v cestě 2 jako vzor | Opus 5.5 · high (xhigh při zaseknutí) | hotovo 29. 10. 2026 (Po K1) |
| T1 | Poslední kroky cest 7, 8, 33 a 34 v bloku: text rozdělený podle odpovědí, spojovací věty se skillem `atlas-psani`, testy přesného znění | Opus 5.5 · high se skilly `atlas-psani` a `atlas-cesta` | hotovo 29. 10. 2026 (Po T1) |
| K2 | Dva životy a Kdo žil dřív? z dat: pravidlo výběru dvojice v `src/lib`, Dva životy v Době a lidech, Kdo žil dřív? v šabloně medailonku | Opus 5.5 · high se skilly `atlas-komponenta` a `atlas-data` | hotovo 29. 10. 2026 (Po K2) |
| K3 | Slož argument: komponenta podle knihovny bloků, ukázka v dílně, zastavení a podoby v přípravě hodiny | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | hotovo 30. 10. 2026 (Po K3) |
| T2 | Slož argument v cestě 8, krok 3: premisy a skrytý předpoklad z Dopisu Menoikeovi 124–125 ověřené proti podkladům celku 6, zpětná vazba, navázání textu kroku | Opus 5.5 · high se skilly `atlas-overeni`, `atlas-psani` a `atlas-cesta` | hotovo 30. 10. 2026 (Po T2) |
| R | Revize větve | Opus 5.5 · high se skillem `atlas-revize` | hotovo 31. 10. 2026 (Po R) |
| O | Opravy po revizi a úprava skillů (`atlas-cesta`: krok se zastánci jako blok, Slož argument; `atlas-data`: prvky medailonku; `atlas-komponenta`) | Opus 5.5 · high | hotovo 31. 10. 2026 (Po O) |
| Uzavření | Schválení autorem, sloučení, push hlavní větve (nasadí web), kontroly na GitHubu zelené | Opus 5.5 · medium | hotovo 31. 10. 2026 (Po uzavření) |

**Proč v tomhle pořadí.** K0 je první, protože dokud kontroly na GitHubu padají na staré chybě, nová chyba z dalších kroků v nich zapadne. Kdo je na tvé straně jde hned potom: revize ho dala nejvýš (nález 4, „před zkouškou, jestli budou domácí průchody“), mění pět hotových cest a jeho text píše autor nejvíc; K1 ho postaví na jedné cestě, T1 přenese zbylé čtyři. Prvky medailonků (K2) jsou nejlevnější a mění šablonu najednou; přijdou před Slož argument, protože ten jako jediný potřebuje nový obsah ověřený v pramenech (T2) a do středověku stačí, když je hotový na konci větve. Komponenty vznikají před texty (K před T), stejně jako ve větvi `stoicky-tyden`.

## Co už atlas má

- **Kdo žil dřív?** (`src/components/ostrovy/KdoZilDriv.svelte`, vložení `src/components/bloky/KdoZilDriv.astro`): odhad pořadí (karty A / B / Žili ve stejné době) nebo vzdálenosti (přetažení života na ose), `a` a `b` jsou id z `lide.yaml`, do deníku nic (je to fakt, ne názor), jen stav bloku. Stojí na profilech; v přípravě hodiny má tři podoby. Na medailonky ho stačí vložit z šablony s dvojicí z dat.
- **Výpočet vzdálenosti** `vzdalenost()` v `src/lib/cas-mapy.ts` (Změř vzdálenost na mapě: „žili současně 14 let“, „dělí je 519 let“) a **mini osa současníků** (`MiniOsa.astro` v Době a lidech). Z nich se postaví Dva životy bez nové časové logiky.
- **Deník** (`src/lib/denik.ts`, záznam `atlas-denik`): `stavBloku(id)` vrací stav kteréhokoli bloku. Z něj jde přečíst zvolená karta Volby (a jestli ji student potvrdil), první a konečná poloha ve Sporu a základní rozhodnutí i odpovědi v podmínkách Změň jednu věc. Roztřiď dává karty v koších, Odkryj jen vlastní text; ty se k zastáncům nehodí.
- **Závěr cesty** už deník čte (`castiZacatku` v `src/lib/zaver.ts`) a umí se zachovat, když zápis chybí: panel se neukáže a text kroku stojí sám. To je vzor pro Kdo je na tvé straně.
- **Poslední kroky se zastánci** mají od kroku O revize antiky mezititulky podle bloků: cesta 2, krok 8 (Volby `cesta2-je-to-ona` a `cesta2-ktera-je-theseova`, Spor `cesta2-seneca-plutarchos`); cesta 7, krok 7; cesta 8, krok 9 (oddíl Kdo je na tvé straně); cesta 33, krok 8; cesta 34, krok 8. Mezititulky odpovídají Volbám, Sporům a Změň jednu věc těch cest.
- **Šablona medailonku** (`src/components/osobnost/StrankaMedailonku.astro`): hlavička se vstupy, deska, Doba a lidé, Kam dál, Prameny; 34 stránek z dat.
- **Příprava hodiny** zná zastavení z bloků a kreseb a jejich podoby na plátně (`docs/design.md` › Komponenty, tabulka podob). Nový blok do katalogu přibude sám, jen když má id; podobu je třeba zapsat.
- **Knihovna bloků** v `docs/plan.md` › Mechanismy učení: Slož argument (seřadí premisy a závěr, najde skrytý předpoklad) je jediný z plánovaných bloků, který revize pro antiku navrhla; Dialog a Úryvek s otázkou přijdou ve středověku.

## Obsah větve

### 1. Kdo je na tvé straně (K1, T1)

Poslední krok pěti cest vyjmenuje zastánce každé odpovědi z každého bloku cesty: „Jestli jsi řekl… Jestli jsi řekl…“, až 625 slov na konci cesty, kdy je student nejunavenější. Blok přečte z deníku, co student zvolil, a v každém oddílu ukáže nejdřív jeho odpověď s jejími zastánci; ostatní odpovědi jsou pod sbaleným „Kdo hájil jiné odpovědi“. Nic se neškrtá a nic se neukládá.

Navrhuju, aby text zůstal v MDX, kde je dnes: obal oddílu řekne, ke kterému bloku patří, obal odstavce, ke které odpovědi (`<Strana blok="cesta2-je-to-ona" odpoved="A">…</Strana>`); co patří všem (věta „Totéž dřevo? Ne…“), stojí mimo obaly a je vidět vždy. Citáty (`<Citat id>`) zůstanou, jak jsou, a autor i skill `atlas-psani` pracují s textem jako dřív. Pravidlo z 1. 10. 2026 (obsah bloku v YAML, v MDX jeden řádek) by tu znamenalo přestěhovat stovky slov prózy s citáty do YAML; tohle není blok s úkolem, jen jiné pořadí textu. Otázka 3.

Bez JavaScriptu, bez deníku a u bloku, který student neprošel, je oddíl celý jako dnes. Sestavená stránka je vždy celá a ostrov ji po hydrataci jen přeskládá, takže kotvy pro přípravu hodiny platí v obou stavech (`docs/pouceni.md` › Technika). Odpověď ze Sporu je strana, ke které má student po argumentech blíž, nebo „uprostřed“; ze Změň jednu věc základní rozhodnutí. Otázky 4 a 5.

Kde: cesta 2, krok 8 (K1, vzor); cesta 7, krok 7, cesta 8, krok 9, cesta 33, krok 8 a cesta 34, krok 8 (T1). Cesty 1, 3, 4, 5 a 6 takový krok nemají a T1 je nepřidává. Úvodní věta každého oddílu se musí číst s rozbalenou i sbalenou částí; to je práce T1 se skillem `atlas-psani`.

### 2. Slož argument (K3, T2)

Blok z knihovny: vlevo tři až čtyři karty (premisy a závěr), vpravo řádky „1“, „2“, „Závěr“ a řádek s otazníkem pro skrytý předpoklad. Student karty přesune klepnutím, tažením nebo klávesnicí; po kontrole se odkryje skrytý předpoklad a místo, kde se dá argument napadnout. Pohne se jen karta na své místo, při omezeném pohybu skočí. Navrhuju po složení ještě jednu volbu „Kterou premisu bys napadl ty?“ s nepovinným důvodem: to je názor, takže do deníku, a dá bloku smysl i pro toho, kdo pořadí uhádne hned. Obsah v YAML jako u ostatních bloků.

První použití: cesta 8, krok 3 (`3-netyka-se-nas.mdx`), Epikúrův argument z Dopisu Menoikeovi 124–125, skrytý předpoklad „smrtí všechno končí“. Formulace premis ověří T2 proti podkladům celku 6 (`docs/podklady/celek-6-proc-se-bat-smrti.md`) a v prameni; blok stojí před námitkou, kterou cesta proti argumentu staví, a nepředbíhá ji. Cesta 9 (Anselm a Gaunilův ostrov) ho použije ve středověku. Otázka 8.

### 3. Dva životy (K2)

Dva vodorovné pruhy na jedné ose, překryv zvýrazněný, pod nimi věta „Žili současně 37 let“ nebo „Dělí je 519 let, asi sedm lidských životů“. Výchozí dvojice je osoba stránky a první učitel nebo žák z `vztahy.yaml` (u osoby bez vztahu nejbližší současník s vlastní stránkou); student vybere jiného člověka ze seznamu, nejdřív z Doby a lidí, pak z ostatních podle období. Druhý pruh se posune a věta se přepíše; při omezeném pohybu pruh skočí. Nic se neukládá. Vše z dat přes `vzdalenost()` a hotovou osu.

Navrhuju ho dát do Doby a lidí, tedy na všechny stránky osob (medailonky, profily, portréty) najednou, ne jen do šablony medailonku: Doba a lidé je jedna komponenta a revize ji jmenuje spolu s medailonky. Otázka 6.

### 4. Kdo žil dřív? u medailonků (K2)

Hotový blok v šabloně medailonku nad Dobou a lidmi (Doba a lidé by odpověď prozradila), druh pořadí. Druhého člověka vybere pravidlo v `src/lib`: osoba s portrétem nebo profilem, kterou student zná, nejbližší podle poloviny života a bez vztahu s osobou stránky, aby otázka nebyla zjevná. Pravidlo je pevné, ne náhodné: stránka je pokaždé stejná, testy i odkazy v přípravě hodiny drží. Revize navrhovala „náhodného člověka z dat“; náhoda za běhu by rozbila zastavení v hodině a test. Otázka 7.

## Nad čím jsem váhal

- **Text Kdo je na tvé straně v MDX, nebo v YAML.** YAML by držel pravidlo o blocích, ale přestěhoval by pět hotových kroků s citáty a autor by je pak četl jinde než ostatní text cesty. Zvolil jsem obaly v MDX; cena je nová výjimka z pravidla, kterou zapíšu do `docs/design.md`. Otázka 3.
- **Co je „studentova odpověď“ u Sporu.** Spor má první a konečnou polohu. Beru konečnou, protože poslední krok má mluvit o tom, kde student skončil. Ukázat zastánce obou poloh tomu, kdo se posunul, by sbalilo méně a krok by se zase prodloužil; navrhuju jen konečnou polohu. Otázka 4.
- **Dva životy jen u medailonků, nebo všude.** Revize mluví o medailoncích a Době a lidech. Prvek v Době a lidech změní i hotové portréty, a tím i jejich snímky a testy; zato vznikne jednou. Otázka 6.
- **Náhoda u Kdo žil dřív?.** Viz výš; pevné pravidlo je méně hravé, ale atlas nemá prvky, které se mění samy (`CLAUDE.md` › Do atlasu nepatří: automaticky se měnící karusely). Otázka 7.
- **Kontrola typů v `npm test`.** Prodlouží každé `npm test` o desítky sekund. Git hook před pushem by byl rychlejší pro běžnou práci, ale je neviditelný a push dělá Claude jen při uzavření; chyba by se našla stejně pozdě. Otázka 2.
- **Slož argument až na konci.** Revize ho dala „před středověkem“, ne před zkouškou. Kdyby se větev protáhla, dá se K3 a T2 oddělit do vlastní větve bez dopadu na ostatní kroky.

## Co zůstává na později

- **Osa hlasů na stránkách otázek** (student postaví svou značku k hlasu, který je mu nejblíž), **Přehrát život** na mapě a **deník na konci období** (vlastní myšlenkový autoportrét): revize je dala před středověk; patří do další větve interaktivity nebo do `antika-doplnky`, podle toho, co ukáže tahle.
- **Kresba „odkud se vzalo zpuchřelé prkno“** v profilu Parmenida: revize ji dala na později.
- **Dialog a Úryvek s otázkou** z knihovny bloků: přijdou s první cestou středověku, která je potřebuje.
- **Zkouška se studenty**, až je autor bude mít; do té doby `noindex`.
- **Chybějící vztahy, kvůli kterým Dva životy ukazují současníka bez důvodu** (Po O): Theofrastos jako Aristotelův žák, Chairefón a Kritón se Sókratem (`znali-se`), Karneadés a Chrýsippos (`vliv-textem`). Doplnit se zdrojem skillem `atlas-data`; změní výchozí dvojice a možná i Kdo žil dřív? na medailoncích.
- `antika-doplnky`, skill `atlas-obdobi` a plán středověku (P12) v pořadí z 26. 10. 2026.

## Co rozhodnout před prvním krokem

Prázdná odpověď znamená souhlas s doporučením.

1. **Pořadí kroků** K0, K1, T1, K2, K3, T2, R, O, Uzavření (důvod pod tabulkou). Doporučuji.
   Odpověď:
2. **Kontrola typů v `npm test`:** `"test": "astro check && vitest run && playwright test"`, totéž zapsat do `CLAUDE.md` › Co číst a jak šetřit (Testy) a jednou větou do `docs/pouceni.md`; při uzavření každé větve pohled, jestli kontroly na GitHubu prošly. Doporučuji.
   Odpověď:
3. **Kdo je na tvé straně s textem v MDX** (obaly oddílů a odpovědí), ne v YAML; výjimka zapsaná v `docs/design.md`. Doporučuji.
   Odpověď:
4. **Které odpovědi blok čte:** Volba (zvolená karta), Spor (konečná poloha: blíž jedné straně, nebo uprostřed), Změň jednu věc (základní rozhodnutí); Roztřiď a Odkryj ne. Doporučuji.
   Odpověď:
5. **Kdo blok neprošel nebo deník smazal**, vidí oddíl celý jako dnes, bez sbalené části; kdo prošel jen některé bloky, má přeskládané jen jejich oddíly. Doporučuji.
   Odpověď:
6. **Dva životy v Době a lidech** na všech stránkách osob (medailonky, profily, portréty), výchozí dvojice z vztahů, výběr ze seznamu lidí, nic se neukládá. Doporučuji.
   Odpověď:
7. **Kdo žil dřív? na medailoncích** nad Dobou a lidmi, druh pořadí, druhý člověk podle pevného pravidla (známá osoba se stránkou, nejbližší v čase, bez vztahu), ne náhodný. Doporučuji.
   Odpověď:
8. **Slož argument** poprvé v cestě 8, krok 3 (Epikúros), s volbou „Kterou premisu bys napadl ty?“ a nepovinným důvodem do deníku; Anselm až v cestě 9. Doporučuji.
   Odpověď:
9. **Osa hlasů, Přehrát život a deník na konci období** zůstávají mimo tuto větev. Doporučuji.
   Odpověď:

## Po K0

Hotovo 29. 10. 2026, commit ve větvi `interaktivita-v1`; na GitHub se nic neposlalo.

- **Co bylo špatně:** plugin `sazbaMdast` měl v JSDoc ručně psaný typ parametru `ctx`, jehož `parent` bere `unknown`; knihovna satteri chce uzel mdast, a `astro check` proto hlásil ts(2322) v `astro.config.mjs`.
- **Co se změnilo:** `src/lib/sazba.js` bere typ z balíčku (`@type {MdastPluginDefinition}`), ruční typ je pryč a chování je stejné. `satteri` ^0.10.5 je nově v devDependencies (v `package-lock.json` přibyl jediný řádek, nainstalovaná verze 0.10.5 zůstala). `tests/data/sazba.test.ts` volá plugin přes úzký typ, protože mu podává jen části uzlu a kontextu, které plugin používá; zkoušky jsou stejné. `npm test` začíná `astro check` (`CLAUDE.md` a `docs/pouceni.md` doplněné).
- **Výstup beze změny:** vitest 753 testů v 37 souborech prošel; sestavení větve a hlavní větve (151 stránek) dalo všech 265 souborů v `dist` shodných bajt po bajtu, tedy i portrét Sókrata a krok 1 cesty 1 s nezlomitelnými mezerami; `astro check` hlásí 0 chyb. Celé `npm test`: astro check 0 chyb, vitest 753 testů, Playwright 570 testů, vše prošlo (29. 10. 2026).
- **Příčina „od 17. 10.“:** datum v zadání nesedí, kontrola na GitHubu je červená od prvního běhu 2. 10. 2026, protože chybu zavedl commit da40801 (sazba) téhož dne.
  - Seznam běhů `kontroly.yml` na veřejné stránce Actions ukazuje 21 běhů z 21 červených, první č. 1 z 2. 10. (commit 0f145eb, 33 s).
  - Lokálně se stejnou chybou a stejnými verzemi z lock souboru (satteri 0.10.5 od 29. 9.) padá `astro check` na da40801, b883943 (15. 10.) i a11d695 (17. 10.); `kontroly.yml` se od 29. 9. nezměnil.
  - Doba běhů kolem půl minuty odpovídá `npm ci`, vitestu a `astro check`: sestavení a Playwright na GitHubu od 2. 10. nikdy neproběhly. Který krok přesně selhal, log bez přihlášení neukáže; tohle je odvozené, ne přečtené.
- **Na co dát pozor při uzavření větve:** kontroly na GitHubu se ověří po pushi hlavní větve. Kontrola typů má být zelená; sestavení a Playwright poběží na GitHubu poprvé, takže u nich může vyjít něco, co na Macu nevadí (Linux, `CI: true`, čistá instalace).
- **Nad čím jsem váhal:** `satteri` jako `^0.10.5` (jako ostatní závislosti) nebo přesná verze. Zvolil jsem `^`; lock drží 0.10.5 a `@astrojs/markdown-satteri` chce `^0.10.3`, takže zůstane jedna kopie.

## Po K1

Hotovo 29. 10. 2026, commit ve větvi `interaktivita-v1`; na GitHub se nic neposlalo.

- **Co vzniklo:** logika `src/lib/strany.ts` (`popisStran`, `odpovedStudenta`, `rozvrhOddilu`) s testy `tests/data/strany.test.ts`; obaly `Strany.astro` a `Strana.astro` v `src/components/bloky` (export z `index.ts`) a ostrov `src/components/ostrovy/Strany.svelte`. V MDX: `<Strany blok="…">` kolem oddílu pod jeho nadpisem a `<Strana odpoved="…">` kolem odstavců jedné odpovědi; co patří všem, stojí mimo. Kódy: Volba A–D, Spor id osoby strany a `uprostred`, Změň jednu věc id možnosti; víc kódů mezerou (`odpoved="C D"`). Neznámý kód, Roztřiď, Odkryj nebo obal bez `Strana` zastaví sestavení.
- **Chování:** po hydrataci (`client:load`) ostrov přečte `stavBloku` a oddíl přeskládá: společný úvod zůstane nahoře, pod ním štítek „Na tvé straně“ (barva období) a studentova odpověď s linkou 3 px, pod ní nativní `<details>` „Kdo hájil jiné odpovědi“ s ostatními v původním pořadí, pak zbytek společného textu. Uzly se přesouvají, takže kotvy, citáty a odkazy platí. Bez JS, bez zápisu, se smazaným deníkem, s nepotvrzenou Volbou, se Sporem bez konečné polohy a u odpovědi bez odstavce je oddíl celý jako dřív.
- **Cesta 2, krok 8:** obaly ve třech oddílech (Loď z prvního kroku, Dvě lodě ze čtvrtého kroku, Člověk); Řeka a bohyně blok nemá a zůstal. Se skillem `atlas-psani` upravené věty, které by jako první nedávaly smysl: „máš taky Hobbese“ → „máš na své straně Hobbese“; Dvě lodě rozdělené na čtyři odpovědi; Hobbesovo shrnutí má podmět („Hobbes otázku dělí podle jména, pod kterým se ptáš.“); Seneka bez „v jiném spise“ („A Plútarchos, který jinde hájí opak, nechal stejně mluvit svého učitele:“); Diotima je odpověď `uprostred` („Jestli jsi ve sporu zůstal uprostřed, máš na své straně Diotimu z Platónova Symposia…“). Testy přesného znění upravené v témže commitu.
- **Příprava hodiny:** katalog zastavení po sestavení bajt po bajtu stejný jako před K1; `scripts/hodiny-katalog.mjs` 0 chyb. Kotvy oddílů, Zkus to žít a závěru drží test v obou stavech.
- **Nad čím jsem váhal:**
  - *Probliknutí.* Oddíl Loď z prvního kroku je na první obrazovce kroku 8: kdo má zápis, uvidí ho na okamžik celý, než ho ostrov po hydrataci sbalí. Zadání chtělo přeskládání až po hydrataci a kotvy v obou stavech, tak jsem ho tak nechal. Šlo by to bez probliknutí skriptem hned za oddílem, který přeskládá ještě před vykreslením (jako hlavní tlačítko na Domů); kotvy by zůstaly, ostrov by jen nic nedělal. Rozhodni, jestli to stojí za druhou cestu kódu.
  - *Spor uprostřed* by bez vlastního odstavce dostal oddíl nepřeskládaný. Diotima v kroku už byla jako „třetí odpověď“, tak jsem ji udělal odpovědí `uprostred`; je to naše přiřazení, ne tvrzení o Diotimě.
  - *Hobbesovo shrnutí* („Totéž dřevo? Ne…“) nechávám mimo obaly podle plánu, ale stojí za sbalenou částí, takže dostalo vlastní podmět.
  - *Štítek „Na tvé straně“* zadání nežádalo; bez něj student nepozná, proč oddíl začíná zrovna touhle odpovědí.
  - *Čas na štítku cesty* (35 minut) jsem neměnil: `slova-cesta.mjs` dává 33,5 i se sbalenými odstavci (skript počítá všechno), a rozdíl byl i před K1.
- **Snímky:** `Claude outputs/krok8-tri-stavy-light.jpg` a `-dark.jpg` (bez zápisu, se zápisem, rozbaleno; 390 px), celé kroky v `Claude outputs/snimky/jsem-porad-tentyz-kdyz-se-menim-{390-light,1440-dark}-odkryt-8.jpg` a `-{390-dark,1440-light}-zavreno-8.jpg`. Pracovní skript listu je `Claude outputs/snimky-strany.mjs` (mimo git).
- **npm test:** astro check 0 chyb (271 souborů), vitest 765 testů v 38 souborech, Playwright 576 testů, vše prošlo (29. 10. 2026).

## Po T1

Hotovo 29. 10. 2026, commit ve větvi `interaktivita-v1`; na GitHub se nic neposlalo. Komponentu `Strany` ani skill `atlas-komponenta` jsem neměnil; chybu v nich jsem nenašel.

- **Cesta 7, krok 7:** obaly ve třech oddílech. Hipparchiino rozhodnutí patří k Volbě `cesta7-komu-patri` (A–D), Diogenés na kobercích k Změň jednu věc `cesta7-nikdo-se-nediva` (základní rozhodnutí `kynicky`, `nadutost`, `zalezi`), Předposlední židle k Volbě `cesta7-tvoje-rada` (A–D). Proti kynikům patří všem; Spor ze čtvrtého kroku vlastní oddíl nemá a T1 ho nepřidal. Věty, které by jako první nestály samy: „máš Aristotela podruhé“ → „máš na své straně Aristotela“; „Jestli jiná nadutost“ → „Jestli je to podle tebe jiná nadutost“; „A jestli záleží…, máš zase Epiktéta. I on se ptal…“ → „Jestli podle tebe záleží…, máš Epiktéta. Ptal se…“; „A jestli počkáš“ → „Jestli počkáš“. Úvodní věty Diogena a židle jsou teď vlastní odstavec nad odpověďmi.
- **Cesta 8, krok 9:** všechny tři oddíly patří k Volbě `cesta8-je-rozumne` z prvního kroku, každý jinou částí odpovědí: Bojíš se, nebo ne? (A, C), Umírání a ti druzí (B; „ti druzí“ k žádné odpovědi nepatří a stojí pod ní pro všechny), Co je potom (D, i se dvěma citáty). Každý oddíl má vlastní `<Strany blok="cesta8-je-rozumne">`; přeskládá se jen ten, kde je studentova odpověď. Text beze změny. Úvodní oddíl Kdo je na tvé straně obal nemá.
- **Cesta 33, krok 8:** Pod padákem (Volba `cesta33-pod-padakem`, A–D), Senátor (Volba `cesta33-senator`, A–D; jeden odstavec rozdělený na úvod a čtyři odpovědi), Mezi Senekou a Epikúrem (Spor `cesta33-predem-spor`: `epikuros`, `seneca`, `uprostred`), Tři týdny před výběrem (Změň jednu věc `cesta33-nominace`: `promyslim`, `nepredstavuji`, `kazdy-den`). Jedna věta ke všem radám patří všem. Věty: „máš Epikúra podruhé“ → „máš na své straně Epikúra“; „A jestli jsi nevěděl“ a „A jestli na to chceš“ bez „A“; uprostřed „máš zase Seneku, který obě rady napsal do jednoho dopisu“ → „máš Seneku. Promyslet to předem a netrápit se předem radí v jednom dopise obojí.“ Jako první odstavec by „obě rady“ nikam neukazovaly; znění drží podklady celku 10 (b12 a b18: Dopisy 13, 14 a 98, 5–8).
- **Cesta 34, krok 8:** Máš dost času? (Volba `cesta34-dost-casu`, A–D; „máš Seneku podruhé“ → „máš na své straně Seneku“), Odejít, nebo zůstat (Spor `cesta34-odejit-spor`: `seneca`, `marcus-aurelius`, `uprostred`; „Jestli zůstat“ → „Jestli podle tebe zůstat“; uprostřed „máš zase Seneku: jinde radil…“ → „máš Seneku. Paulinovi radil odejít, jinde ale radil neutíkat hned a mísit volno s prací.“ podle podkladů celku 9, O duševním klidu 4, 8). Dvě hodiny s telefonem obal nemá: text sám říká „Ať jsi odpověděl jakkoli“ a k odpovědím `moje`, `napul`, `cizi` krok zastánce nemá; psát je z hlavy zadání nedovolilo. Je volno výsada? a Než napíšeš pravidlo blok nemají.
- **Testy:** pomůcky v `tests/e2e/strany.ts` (deník předem, pořadí oddílu i pro víc oddílů téhož bloku, kotvy, příprava kroku, axe, „nic se neuložilo“); `cesta2.spec.ts` je používá místo vlastních kopií. V `cesta7`, `cesta8`, `cesta33` a `cesta34.spec.ts`: bez zápisu, s rozpracovaným blokem, se smazaným deníkem a bez JavaScriptu oddíly celé; se zápisem na 390 px světle a 1440 px tmavě studentova odpověď první, ostatní sbalené, rozbalení klávesnicí, axe před i po, kotvy, nic se neukládá; Spor uprostřed (33, 34) i blíž jedné straně, Změň jednu věc podle základního rozhodnutí i se změněnou podmínkou (7, 33), cesta 8 s odpovědí v prvním i druhém oddílu. Průchody cest 7 a 8 kontrolují přeskládání po skutečných odpovědích, průchody bez odkrytí, že se nic nepřeskládalo. Upravené přesné znění v `cesta7.spec.ts` (čtyři věty).
- **Snímky:** `Claude outputs/kdo-je-na-tve-strane-T1-light.jpg` (poslední kroky cest 7, 8, 33 a 34 bez zápisu a se zápisem, 390 px; pracovní skript `Claude outputs/snimky-strany-t1.mjs` mimo git) a `Claude outputs/snimky/<slug>-390-light-{odkryt,zavreno}-<krok>.jpg`. Výška oddílů na telefonu se zápisem: cesta 7 2750 → 1539 px, cesta 8 2265 → 2206, cesta 33 2771 → 1937, cesta 34 2367 → 1950.
- **Nad čím jsem váhal:**
  - *Cesta 8 jako tři oddíly k jedné Volbě, nebo jeden.* Zvolil jsem tři: nadpisy, kotvy pro přípravu hodiny i text zůstaly, jen každý oddíl dostal obal. Zkrácení je proto malé: přeskládá se jen oddíl se studentovou odpovědí a Co je potom (jen D) dostane jen štítek. Jeden oddíl pod nadpisem Kdo je na tvé straně by sbalil tři čtvrtiny textu, ale vzal by kroku mezititulky a kotvy. Rozhodni.
  - *Krátké odpovědi jako první odstavec.* „Jestli ti připadal připravený, viděl ho tak Epiktétos.“ nebo „Jestli si to promyslíš a pustíš z hlavy, máš Seneku.“ stojí samy, ale pod štítkem vypadají holé. Doplnit je z kroků 3 a 7 by bylo nové psaní nad rámec T1; nechal jsem je.
  - *Spor cesty 7 a Změň jednu věc cesty 34* oddíl se zastánci nemají. Nový oddíl ani nové zastánce jsem nepsal; jestli je chceš, patří do kroku O.
  - *Čas na štítku* jsem neměnil: text se změnil o pár slov. `slova-cesta.mjs` ale po odpovědích počítá viditelný text, takže sbalené odpovědi nepočítá: cesta 7 vychází 28,1 min (štítek 30), cesta 8 32,2 (32), cesta 33 27,8 (29), cesta 34 27,7 (28), cesta 2 33,5 (35). Oddíl Po K1 psal, že skript počítá všechno; počítá jen viditelné. Pro krok R: rozhodnout, který čas na štítek patří, když student s odpověďmi čte míň.
- **npm test:** astro check 0 chyb, vitest 765 testů v 38 souborech, Playwright 588 testů (o 12 víc než po K1), vše prošlo (29. 10. 2026).

## Po K2

Hotovo 29. 10. 2026, commit ve větvi `interaktivita-v1`; na GitHub se nic neposlalo.

- **Co vzniklo:**
  - **Pravidla** v `src/lib/dvojice.ts` jako čisté funkce: `vychoziDvojice` (první učitel, jinak první žák, jinak nejbližší současník s vlastní stránkou podle poloviny života), `druhyKdoZilDriv` (nejbližší osoba s profilem nebo portrétem bez jakéhokoli vztahu), `soucasniciNaOse` (současníci mini osy, beze změny výsledku přesunutí z `MiniOsa.astro`) a `vyberDruhehoZivota` (nabídka: „Z Doby a lidí“, pak „Období N: název“). Při shodě rozhoduje pořadí v `lide.yaml`. Testy `tests/data/dvojice.test.ts`; `VYPIS=1 npx vitest run tests/data/dvojice.test.ts` vypíše dvojice všech stránek.
  - **Dva životy** (`src/components/osobnost/DvaZivoty.astro`, ostrov `src/components/ostrovy/DvaZivoty.svelte`) v Době a lidech pod mini osou, tedy na 46 stránkách osob najednou. Popisek osoby stránky nad pruhy, druhého pod nimi, společná léta jako tint mezi pruhy, mezera jako čárkovaná čára, věta z `vzdalenost()` s `aria-live`, nabídka „Druhý život“ (nativní `select`) až po hydrataci (`client:idle`). Pruhy jedou 600 ms, při omezeném pohybu skočí. Nic se neukládá.
  - **Kdo žil dřív?** na všech 34 medailoncích ve čtenářském sloupci nad Dobou a lidmi (`StrankaMedailonku.astro`, druhý člověk přes `kdoZilNaMedailonku` v `src/lib/stranky-osob.ts`).
  - **Katalog hodin** nese medailonky: celá stránka (`o:<id>`, druh `profil` s příznakem `medailonek`, štítek „Celý medailonek“, ve výběru „Medailonek“) a pod ní blok Kdo žil dřív? se třemi podobami. `node scripts/hodiny-katalog.mjs`: 440 zastavení (profil 46, blok 170), 160 nadtitulků ověřeno, 0 chyb. `doba-odkazy-vypis.mjs`: 0 chyb.
  - `vzdalenost()` u dvou žen píše „Žily současně“. Zápis v `docs/design.md` (Komponenty › Dva životy, Bloky › Kdo žil dřív? › Na medailonku) a v `docs/rozhodnuti.md`.
- **Nad čím jsem váhal a co jsem zvolil:**
  - *Medailonky v katalogu.* Zadání chtělo zastavení z medailonků s pevným id, ale katalog medailonky dosud vůbec neměl. Přidal jsem stránku i blok, protože blok potřebuje rodiče a učitel si medailonek dá do hodiny i celý. Skladatel má teď ve skupině Profily o 34 stránek víc; kdyby to bylo moc, šlo by medailonky dát do vlastní skupiny.
  - *Popisky.* První verze měla zvýraznění společných let přes oba řádky a čárkovaný okraj přetínal jméno a roky. Popisek osoby stránky je teď nad pruhy, druhého pod nimi.
  - *Nabídka až po hydrataci.* Bez JavaScriptu by nefunkční `select` mátl. Zvolil jsem `client:idle` místo `client:visible`: nabídka se objeví dřív, než student k Době a lidem dojede, a obsah pod ní se mu při čtení neposune.
  - *Dva životy jen jako prvek, ne blok.* Nemá nadtitulek, Kam dál ani zastavení v hodině. Kdyby ho učitel chtěl promítat, je to další krok.
  - *Společný profil* srovnává hlavní osobu (Kratés); Hipparchia ani Kratés v nabídce nejsou.
  - *Věta o lidských životech* zaokrouhluje na 75 let: „Dělí je asi 100 let. To je asi jeden lidský život.“ (Hypatia a Plótínos). Je to tatáž věta jako v Mapě a čase a v Kdo žil dřív?; neměnil jsem ji, pro krok R.
- **Dvojice, které nic neříkají nebo by mohly mást** (výjimky do dat jsem nepřidal):
  - *Dva životy bez učitele a žáka:* Seneca → Filón Alexandrijský a Cicero → Filón Alexandrijský (nic je nespojuje; u Cicerona navíc „dělí je asi 28 let“, nejbližší „současník“ s ním nežil), Hypatia → Plótínos (dělí 100 let; Plótína četla, ale pravidlo bere jen učitele a žáky), Plótínos → Marcus Aurelius (dělí 24 let), Pyrrhón → Hipparchia, Aspasie → Chairefón, Démokritos ↔ Aristofanés, Prótagorás a Anaxagorás → Zénón z Eleje, Hérakleitos → Xenofanés, Epikúros → Zénón z Kitia, Theofrastos → Kratés. Všichni ostatní mají učitele nebo žáka. Kdyby pravidlo bralo i „vliv textem“ (Koho četl), dostala by Hypatia Plótína z důvodu, Seneca by ale zůstal bez.
  - *Kdo žil dřív? na medailoncích:* u dvojic s dlouhým společným životem je odpověď „Žili ve stejné době“ a kdo se narodil dřív, rozhoduje pár let (Isokratés → Platón 80 let spolu, Xenofón → Platón 77, Theofrastos → Kratés 78, Aristippos → Platón 72). Nemate, ale je to spíš chyták. Dobře vychází Thalés a Anaximandros → Hérakleitos (dělí je 6 let), Cicero → Seneca (42 let), Hypatia → Marcus Aurelius (190 let), Karneadés → Epikúros (56 let).
  - *Opakování:* Prótagorás je druhým člověkem u sedmi medailonků (Zénón z Eleje, Empedoklés, Anaxagorás, Aspasie, Chairefón, Kritón, Alkibiadés), Platón u pěti, Diogenés a Epikúros u čtyř. Kdo prochází medailonky po sobě, potká stejnou otázku několikrát.
- **Pro skill `atlas-data` (krok O):** oddíl Prvky z dat má „Kdo žil dřív? s náhodným současníkem nebo předchůdcem“: opravit na pevné pravidlo (`druhyKdoZilDriv`) a Dva životy s výchozí dvojicí (`vychoziDvojice`). Připsat, že nový vztah nebo nový profil může změnit druhého člověka na medailonku, a tím id bloku (`kdo-<osoba>-<druhý>-poradi`) i zastavení v uložených hodinách (učitel pak uvidí „Tohle místo už v atlasu není“), a že po změně vztahů nebo hloubek se pustí `VYPIS=1 npx vitest run tests/data/dvojice.test.ts` a `tests/e2e/dva-zivoty.spec.ts`. Úplné roky a vztahy učitel a žák rozhodují, koho Dva životy ukážou jako první.
- **Testy:** `tests/e2e/dva-zivoty.spec.ts` (medailonek, profil, portrét: výchozí dvojice a věta, výběr napsáním jména, Tab, omezený pohyb, bez JavaScriptu, společný profil, axe a přetečení na 390 a 1440 px v obou režimech, Kdo žil dřív? na všech medailoncích nad Dobou a lidmi a jeho průchod). Upravené: `mini-mapa.spec.ts` (lokátor popisku mini osy: ve sloupci jsou teď dva `figcaption`) a `hodina-podoby.spec.ts` (strop tabulátoru 160: výběr skladatele má o 34 souhrnů víc).
- **Snímky:** `Claude outputs/k2-telefon-390-light.jpg` (hlavička a Kdo žil dřív? Anaximandra, Doba a lidé Anaximandra, Diogena a Sókrata) a `Claude outputs/k2-notebook-1440-dark.jpg` (Doba a lidé týchž tří); celé stránky v `Claude outputs/snimky/k2-<osoba>-{390-light,1440-dark}-<n>.jpg`.
- **npm test:** astro check 0 chyb, vitest 862 testů v 39 souborech, Playwright 601 testů, vše prošlo (29. 10. 2026). První běh našel dva testy, které spadly kvůli novému obsahu (`mini-mapa.spec.ts`, `hodina-podoby.spec.ts`); po jejich úpravě prošel celý druhý běh.

## Po K3

Hotovo 30. 10. 2026, commit ve větvi `interaktivita-v1`; na GitHub se nic neposlalo.

- **Co vzniklo:**
  - **Schéma** `BlokArgument` (druh `argument`) v `src/lib/bloky-schema.ts`: karty (3–4, text nejvýš 140 znaků, `misto` 1, 2, 3 nebo `zaver`, u premis povinné `kdyzNapadnes`, nepovinné `vZaveru`), `skryty` (text, `zpetna`, `kdyzNapadnes`), `napadnout` (`karta` je id premisy nebo `skryty`, `proc`), `zpetna` po složení, `zadnou`; vyhrazená id `skryty` a `zadnou`. Schéma hlídá jeden závěr a místa premis bez mezery.
  - **Logika** `src/lib/argument.ts` s testy `tests/data/argument.test.ts` (20): řádky, položení s výměnou, vrácení mezi karty, vyhodnocení a zpětná vazba podle toho, co student složil, hlášení pro čtečky, možnosti „Kterou premisu bys napadl ty?“, zápis do deníku a platný stav po obnovení.
  - **Ostrov** `src/components/ostrovy/SlozArgument.svelte`, obal `src/components/bloky/SlozArgument.astro` (export v `index.ts`), v MDX `<SlozArgument id="…" />`. Vlevo karty, vpravo řádky „1“, „2“, řádek s otazníkem („Jedna věta tu chybí.“) a pod čarou „Závěr“; od 600 px uvnitř bloku vedle sebe (krok cesty i sloupec profilu), na telefonu karty nad řádky. Přesun klepnutím (karta, pak řádek), tažením myší i prstem a klávesnicí (Enter na kartě, fokus na první prázdný řádek, Tab po řádcích, Enter položí, Escape zruší výběr); karta na obsazený řádek se prohodí. Pohne se jen přesouvaná karta (220 ms), při omezeném pohybu skočí. Zkontrolovat, pak zpětná vazba „Tvůj závěr: „…“.“, odkrytý skrytý předpoklad v řádku s otazníkem, oddíly Skrytý předpoklad a Kde se dá argument napadnout (řádek místa má silnější okraj). Nakonec volba s nepovinným „Proč právě tahle?“ a Tohle bych napadl: zápis do deníku a zpětná vazba k volbě. Stav vydrží obnovení, Zkusit znovu smaže stav i zápis.
  - **Ukázka v dílně** `src/content/bloky/dilna-sokrates-zemre.yaml` mezi Kdo žil dřív? a Návratem; perex dílny „Všech devět bloků“.
  - **Příprava hodiny:** `SlozArgument` v `BLOKY_Z_YAML` (katalog), podoby celý blok, jen otázka a možnosti, otevřená otázka (`PODOBY_BLOKU`), štítek „Slož argument“ ve skladateli, výchozí nadtitulek v `nadtitulky.ts`, značky `data-cast` v komponentě, řádek v tabulce podob. Blok se zápisem smí být i začátkem cesty (`BLOKY_SE_ZAPISEM`); Závěr cesty ho čte jako „jiný“. Druh `argument` v deníku (`Zapis.druh`, `DruhBloku`). `node scripts/hodiny-katalog.mjs`: 0 chyb (blok zatím na žádné stránce atlasu nestojí).
  - **Testy:** `tests/e2e/sloz-argument.spec.ts` (12): jen klávesnicí na 390 a 1440 px v obou režimech s axe před i po, snímkem a obnovením; klepnutí, výměna a vrácení, premisa v závěru; tažení myší i na hromádku; prstem událostmi ukazatele i skutečným dotykem přes CDP (stránka se neposune); omezený pohyb; zápis do deníku a jeho smazání; šířka sloupce profilu (680 px) a kroku cesty (960 px); podoby na plátně. Navíc katalog hodin se Slož argument v kroku (`hodiny.test.ts`), podoby (`podoby.test.ts`) a šestý druh bloku v obsahu (`bloky.test.ts`).
  - **Skript snímků:** `scripts/snimky-prvek.mjs` umí `DENIK=<soubor.json>` (deník v localStorage před načtením) a spodní lištu telefonu skryje i s odkazy.
  - Zápisy v `docs/design.md` (Bloky › Slož argument, Co se ukládá, tabulka podob), `docs/rozhodnuti.md` a jedna věta v `docs/pouceni.md`.
- **Nad čím jsem váhal a co jsem zvolil:**
  - *Ukázka v dílně.* Klasický sylogismus „všichni lidé jsou smrtelní, Sókratés je člověk“ skrytý předpoklad nemá. Zvolil jsem jeho podobu s mezerou: „Sókratés je člověk. Ještě žádný člověk nežil věčně. → Sókratés jednou zemře.“ Skrytý předpoklad je skok od minulosti k budoucnosti; žádné historické tvrzení, proto bez pramenů.
  - *Řádek s otazníkem není cíl.* Skrytý předpoklad student mezi kartami nehledá, odkryje se po kontrole (oddíl 2). Kartu navíc jako návnadu by šlo přidat do schématu, kdybys chtěl, aby ho student hledal.
  - *Jedna kontrola.* Po Zkontrolovat se odkryje všechno, i když student dal do závěru premisu; zpětná vazba řekne, ve kterém řádku skutečný závěr nechal, a znovu jde přes Zkusit znovu. Druhý pokus před odkrytím by z bloku dělal zkoušení.
  - *Pořadí premis* je jedno: zpětná vazba to jen řekne větou. Premisy jsou v argumentu logicky rovnocenné.
  - *Kde se dá napadnout* necituje větu znovu (stála by tam potřetí, v řádku i ve volbě); řádek má silnější okraj a `proc` má začít tím, o jakou větu jde. Skill `atlas-cesta` to v kroku O dostane jako pravidlo.
  - *„Zkusit znovu“* podle zadání; ostatní bloky mají „Začít znovu“. Sjednotit v kroku O, nebo nechat.
  - *Promítání v podobách* ověřuje test v dílně (třídy promítání nastavené ručně), protože blok v katalogu bude až s T2. T2 pak přidá skutečné zastavení do `hodina-podoby.spec.ts`.
  - *Kdo je na tvé straně* volbu ze Slož argument nečte (`strany.ts` zná Volbu, Spor a Změň jednu věc). Pro poslední krok cesty 8 by šla přidat; patří do kroku O, jestli ji bude T2 chtít.
- **npm test:** astro check 0 chyb (281 souborů), vitest 884 testů ve 40 souborech, Playwright 613 testů (o 12 víc než po K2), vše prošlo (30. 10. 2026).

## Po T2

Hotovo 30. 10. 2026, commit ve větvi `interaktivita-v1`; na GitHub se nic neposlalo. Komponentu `SlozArgument` ani skilly jsem neměnil; chybu v nich jsem nenašel.

- **Ověření:** řecký text Dopisu Menoikeovi 124–125 a Dopisu Hérodotovi 65–66 v XML PerseusDL (Hicks), Lucretius III, 830–831 v latinském XML PerseusDL. Citáty `menoikeus-124` a `menoikeus-125` sedí na řecký text slovo od slova. Skrytý předpoklad Epikúros v dopise Menoikeovi neříká, jen s ním počítá (125: „když je tu smrt, nejsme tu už my“). Výslovně ho má Dopis Hérodotovi 65–66 (když se celé složení rozpadne, duše se rozptýlí a nemá vnímání), zkratkou Hlavní myšlenky 2 a Lucretius ho dává jako důvod k závěru („protože přirozenost ducha se ukazuje smrtelná“). Doplněk s tabulkou je v podkladech celku 6 (Jádro: Epikúros › Slož argument v kroku 3); `zdroje` bloku jsou prameny `dl-x-122` a `dl-x-63`.
- **Blok** `src/content/bloky/cesta8-argument.yaml`: karty „Smrt je ztráta vnímání.“ (2), „Smrt se nás netýká.“ (závěr) a „Všechno dobré i zlé je ve vnímání.“ (1). V citátu stojí závěr první a „ztráta“ poslední, proto má `vZaveru` právě „ztráta“: kdo skládá podle pořadí v dopise, dá ji do závěru. Skrytý předpoklad „Po smrti z nás nezbude nic, co by mohlo vnímat.“; jeho zpětná vazba ukazuje mezeru na tom, kdo věří, že duše žije dál (že mrtvé tělo nevnímá, uzná i on). Napadnout: první premisa, protože na ni míří námitka ztráty v krocích 4 až 6; `proc` neříká, kdo ji napadl ani jak. Zpětná vazba po složení končí „Přidal bys k argumentu větu, kterou k tomu potřebuje?“, `zadnou` se ptá, jestli s argumentem zmizí i strach a na který koš z druhého kroku míří zbytek. O konci vnímání jen souměrně; žádné „nebude to bolet“ ani „nebude nikdo, komu by bylo zle“.
- **Krok 3:** blok stojí hned za citátem 124, kde student argument poprvé vidí celý, a má vlastní Kam dál na nadpis „Věta, která v dopise chybí“ (`#veta-ktera-chybi`). Pod nadpisem: „Že smrtí všechno končí, napsal Epikúros jinde.“ a věta o atomech z dřívějšího odstavce, přepsaná podle Dopisu Hérodotovi („když se tělo rozpadne, rozptýlí se a přestane vnímat“). Citát 125 uvádí „Dopis s tím počítá i v další větě:“; dřívější „Říká to ještě jednou, krok za krokem“ by pod tím nadpisem tvrdilo, že dopis tu větu říká. Odstavec „Celý argument stojí na jednom předpokladu…“ je zkrácený na „Kdo věří, že po smrti něco je, toho argument nepřesvědčí. V posledním kroku potkáš dva myslitele, kteří to viděli jinak.“ Citáty 124, 125 a vs-31 i Odkryj zůstaly beze změny. Krok jsem přečetl třikrát podle `atlas-psani`, i očima studenta, kterému někdo zemřel, a studenta s myšlenkami na smrt.
- **Čas:** `node scripts/slova-cesta.mjs proc-se-bat-smrti` dává 34,7 min (po T1 32,2), štítek je 35 místo 32. `slova-cesta.mjs` a `snimky-cesta.mjs` Slož argument neuměly a na kroku 3 padaly; mají novou větev (karty z hromádky po řadě do řádků, kontrola, první možnost).
- **Testy:** `cesta8.spec.ts`: krok 3 se dvěma čtenářskými sloupci, složení jen klávesnicí, zpětná vazba, skrytý předpoklad, volba s důvodem, Kam dál na kotvu a text pod blokem; zápis na stránce Můj deník („Napadl bych premisu: „Všechno dobré i zlé je ve vnímání“. Proč: …“ s otázkou „Jak z nich Epikúros složil argument? Kterou premisu bys napadl ty?“); nové věty kroku 3 v průchodu bez odkrytí. `pruchod.spec.ts` blok skládá jako ostatní bloky. `hodina-podoby.spec.ts`: skutečné zastavení `b:cesta8-argument` jen s otázkou a možnostmi (i po kontrole, bez pole Proč) a jako otevřená otázka na plátně 1280 × 720 v obou režimech, s axe a snímky v `Claude outputs/hodiny/`. Katalog hodin: 441 zastavení (blok 171), `node scripts/hodiny-katalog.mjs` 0 chyb.
- **Snímky:** `Claude outputs/t2-sloz-argument-list.jpg` (blok před složením, po kontrole a po volbě; 390 px světle a 1440 px tmavě), celé kroky v `Claude outputs/snimky/proc-se-bat-smrti-{390-light,1440-dark}-odkryt-3.jpg`. Deníky pro stavy po kontrole a po volbě a pracovní skripty jsou v `Claude outputs/` (mimo git).
- **Nad čím jsem váhal:**
  - *Dvě premisy, nebo tři.* Věta ze 125 „když je tu smrt, nejsme tu už my“ by šla jako třetí karta, ale řekla by skrytý předpoklad za studenta. Zvolil jsem dvě premisy a závěr ze 124. Pořadí karet je proto skoro uhádnutelné; váhu nese skrytý předpoklad a volba, co napadnout.
  - *Co napadnout.* Námitka ztráty míří na první premisu, víra v posmrtný život na skrytý předpoklad. Cesta staví v krocích 4 až 6 tu první, tak ji blok ukazuje. Volba skrytého předpokladu dostala rozlišení „jestli je argument dobře složený, nebo jestli je pravda, co předpokládá“, aby věřící student nečetl, že argument nepochopil.
  - *Opakování předpokladu.* Zazní v bloku a pod nadpisem; text musí stát i bez složení, takže úplně se tomu vyhnout nejde. Třetí výskyt („Celý argument stojí…“) jsem vypustil.
  - *Kdo je na tvé straně* volbu ze Slož argument dál nečte (Po K3); poslední krok cesty 8 ji nepotřebuje, oddíly stojí na Volbě z prvního kroku.
  - *Snímek před složením na telefonu* `snimky-prvek.mjs` ořízne: blok je vyšší než okno a spodek zakryje pozadí stránky. Ten stav jsem vyfotil pracovním skriptem s `fullPage` a `clip`. Opravit skript patří do kroku O, jestli se to bude hodit.
- **npm test:** astro check 0 chyb (283 souborů), vitest 885 testů ve 40 souborech, Playwright 615 testů, vše prošlo (30. 10. 2026). První celý běh spadl na `pruchod.spec.ts` (cesta 8): průchod všemi cestami Slož argument neznal; má teď vlastní větev v `odpovez` (bez nepovinného Proč) a poučení je v `docs/pouceni.md`.

## Po R

Hotovo 31. 10. 2026, commit ve větvi `interaktivita-v1`; na GitHub se nic neposlalo. Záznam: `docs/revize/interaktivita-v1-2026-10-31.md`.

- **Verdikt:** po opravách. Nic blokujícího; čtyři nálezy důležité, pět drobných.
- **Nálezy jednou větou** (podle dopadu):
  1. *Slož argument* ukáže skrytý předpoklad i místo k napadení najednou po kontrole a teprve pak se ptá, co by student napadl; zpětná vazba se ptá na větu, která stojí o řádek výš.
  2. *Kdo žil dřív? na medailoncích* má u 28 z 34 stránek odpověď „Žili ve stejné době“ a Prótagorás je druhým člověkem sedmkrát.
  3. *Kdo je na tvé straně* problikne celé a pak uskočí na první obrazovce všech pěti posledních kroků, ne jen v cestě 2.
  4. *Dva životy* dávají 21 ze 46 stránek „současníka“ bez vztahu (Seneca → Filón Alexandrijský, Cicero → Filón).
  5. Věta o lidských životech zaokrouhluje hrubě (56 let = „asi jeden lidský život“).
  6. Krok 3 cesty 8 chce námitku napsat dvakrát (pole Proč v bloku a hned potom Odkryj).
  7. V kroku 3 se konec vnímání opakuje a zpětná vazba k druhé premise mluví o „mrtvém těle“.
  8. „Zkusit znovu“ ve Slož argument × „Začít znovu“ v ostatních blocích.
  9. V Dvou životech stojí nabídka za `figcaption` uvnitř `figure`.
- **Co jsem rovnou opravil:** „To je asi tři lidské životy“ → „To jsou asi tři lidské životy“ (`vzdalenost()`, s testem); odpověď B v cestě 2, kroku 8 stojí sama („druhá strana sporu, o kterém vypráví Plútarchos“); scéna bloku `cesta8-argument` („Epikúrova rada má tři věty: dva důvody a to, co z nich plyne.“); štítky času cest 2 (34 min), 7 (28) a 33 (28); zastaralá poznámka v `kontroly.yml`.
- **Rozhodnuto v revizi** (zadání R chtělo rozhodnout): čas na štítku je čas studenta, který bloky prochází, tedy viditelný text po odpovědích z `slova-cesta.mjs`, zaokrouhlený na minuty; cesta 8 zůstává ve třech oddílech k jedné Volbě; štítek „Na tvé straně“ zůstává; probliknutí opravit (nález 3); „Začít znovu“ všude (nález 8). `kontroly.yml` pouští `astro check` stejně jako `npm test`, jen v jiném pořadí. Zápis v `docs/rozhodnuti.md`.
- **Nad čím jsem váhal:**
  - *Slož argument ve dvou zastaveních.* Mění komponentu, testy, podoby i skripty, a K3 schválně zvolil jednu kontrolu. Druhé zastavení ale není druhý pokus: student nic neskládá znovu, jen dostane chvíli na otázku, kterou mu blok klade, a vybírá dřív, než vidí, kam mířili jiní. Bez toho by „Kterou premisu bys napadl ty?“ byla volba podle zvýraznění.
  - *Kdo žil dřív? jen s lidmi, kteří se nepřekrývají.* Karta „Žili ve stejné době“ pak na medailoncích nebude nikdy správně; zůstane jako možnost, na kterou student může vsadit. Šlo by nechat každou třetí dvojici současníky, ale pravidlo by bylo složitější a výsledek méně čitelný.
  - *Probliknutí.* Oprava přidá do stránky skript před vykreslením, tedy druhé místo, kde se čte deník. Navrhuju jednu funkci vloženou do stránky, ne opis; kdyby to bylo křehké, zbývá nechat probliknutí být.
  - *Holé odpovědi v posledních krocích* („Jestli ti připadal připravený, viděl ho tak Epiktétos.“) a senátor D v cestě 33 bez zastánce: nechal jsem je. Doplnit je by znamenalo psát tvrzení bez podkladu.
  - *Krok 3 cesty 8:* text pod blokem jsem neměnil, i když se v něm konec vnímání opakuje: je to text schválený s celkem 6 a návrh je v nálezu 7.
- **Snímky:** `Claude outputs/r-sloz-argument-po-kontrole.jpg` (blok po kontrole, 390 px světle a 1440 px tmavě; ještě se starou scénou); jednotlivé v `Claude outputs/snimky/r-argument-kontrola-*.png`.
- **npm test:** astro check 0 chyb, vitest 886 testů ve 40 souborech, Playwright 615 testů, vše prošlo napoprvé (31. 10. 2026).

## Co rozhodnout po R

Prázdná odpověď znamená souhlas s doporučením. Podrobnosti a hotová znění jsou v `docs/revize/interaktivita-v1-2026-10-31.md`.

1. **Slož argument ve dvou zastaveních** (nález 1): po Zkontrolovat zpětná vazba a tlačítko „Ukázat chybějící větu“; pak skrytý předpoklad a volba „Kterou premisu bys napadl ty?“; oddíl Kde se dá argument napadnout a zvýraznění řádku až po volbě. Platí pro cestu 8 i dílnu, texty YAML se nemění. Doporučuji.
   Odpověď:
2. **Kdo žil dřív? na medailoncích s lidmi, kteří spolu nežili** (nález 2): známá osoba bez vztahu, jejíž život se nepřekrývá, nejbližší v čase, každá nejvýš na třech medailoncích; id bloků se změní. Doporučuji.
   Odpověď:
3. **Bez probliknutí** (nález 3): skript před vykreslením skryje cizí odpovědi, ostrov doplní štítek a sbalenou část. Doporučuji.
   Odpověď:
4. **Dva životy: koho osoba četla nebo kdo četl ji**, až potom současník (nález 4). Doporučuji.
   Odpověď:
5. **Věta o lidských životech** podle nálezu 5 („skoro jeden“, „víc než jeden“, „asi šest“, „skoro sedm“). Doporučuji.
   Odpověď:
6. **`bezDuvodu: true` pro Slož argument v cestě 8** (nález 6): do deníku jde jen zvolená věta, námitku student napíše v Odkryj. V dílně pole zůstane. Doporučuji.
   Odpověď:
7. **Krok 3 cesty 8** (nález 7): nové znění `ztrata.kdyzNapadnes` a za citátem 125 jen „Říká, že se netýká nás.“ Doporučuji.
   Odpověď:
8. **„Začít znovu“ i ve Slož argument** (nález 8). Doporučuji.
   Odpověď:
9. **Nabídka Druhý život za `figure`** (nález 9). Doporučuji.
   Odpověď:

## Po O

Hotovo 31. 10. 2026, commit ve větvi `interaktivita-v1`; na GitHub se nic neposlalo. Všech devět odpovědí na Co rozhodnout po R zůstalo prázdných, tedy souhlas s doporučením.

- **Co jsem opravil po nálezech:**
  1. *Slož argument ve třech zastaveních* (nález 1): po Zkontrolovat jen titulek, zpětná vazba a tlačítko **Ukázat chybějící větu**; po něm řádek s otazníkem, oddíl Skrytý předpoklad a volba; teprve po Tohle bych napadl zpětná vazba k volbě, pod ní **Kde se dá argument napadnout** a silnější okraj řádku. Stav `odkryto` v `src/lib/argument.ts` vydrží obnovení v každém zastavení (starší stav s vybranou možností se čte jako odkrytý), s testy. Na plátně v podobě „jen otázka a možnosti“ oddíl Kde se dá napadnout chybí (`data-cast="napadnout"` v `promitani.css`). Upravené `design.md`, `slova-cesta.mjs`, `snimky-cesta.mjs`, `pruchod.spec.ts`, `sloz-argument.spec.ts` (nový test obnovení ve všech třech zastaveních), `cesta8.spec.ts`, `hodina-podoby.spec.ts`. Texty YAML se kromě nálezu 7 neměnily.
  2. *Kdo žil dřív? na medailoncích* (nález 2): známá osoba bez vztahu, kterou s osobou stránky dělí aspoň 20 let, nejbližší podle poloviny života, každá nejvýš na třech medailoncích (`druziKdoZilDriv`, přidělení v pořadí `lide.yaml`). Všech 34 medailonků má teď odpověď A, nebo B; jedenáct známých osob je druhým člověkem třikrát (strop), Platón jednou, nikdo víc. Katalog hodin: `node scripts/hodiny-katalog.mjs` Chyb: 0, id bloků se změnila (třeba `kdo-anaximandros-parmenides-poradi`).
  3. *Bez probliknutí* (nález 3): skript hned za obalem Strany (`skriptStranPredem` v `src/lib/strany.ts`) skryje cizí odpovědi atributem `hidden` ještě před vykreslením. Odpověď počítá `odpovedStudenta` vložená do skriptu jako text; aby to šlo, bere pomůcky z `bloky.ts` parametrem, takže pravidlo je dál jedno. Ostrov po hydrataci skryté ukáže pod „Kdo hájil jiné odpovědi“; pojistka je ukáže 4 s po načtení, kdyby se ostrov nehydratoval. Testy: skript nad napodobeninou stránky ve Vitestu, v `cesta2.spec.ts` co je vidět při DOMContentLoaded a stránka se zablokovanými moduly (skript skryje, pojistka ukáže); bez JavaScriptu a bez zápisu drží oddíl celý dosavadní testy všech pěti cest.
  4. *Dva životy* (nález 4): za učitelem a žákem `vliv-textem` (koho osoba četla, pak kdo četl ji, nejbližší s vlastní stránkou), pak současník. Současníka bez vztahu teď dostane 9 osob se stránkou místo 21.
  5. *Věta o lidských životech* (nález 5): `prirovnaniKZivotum` v `src/lib/cas-mapy.ts` podle pravidla z revize, test na každou větev; Mapa a čas dál „asi šest lidských životů“.
  6. *`bezDuvodu`* ve schématu Slož argument (výchozí `false`) a v `cesta8-argument`; v dílně pole zůstalo (nález 6).
  7. *Krok 3 cesty 8* (nález 7): nové `ztrata.kdyzNapadnes` a za citátem 125 jen „Říká, že se netýká nás.“
  8. *„Začít znovu“* ve Slož argument (nález 8).
  9. *Nabídka Druhý život* za `</figure>` ve společném obalu `#dva-zivoty`; `figcaption` je poslední potomek `figure`, s testem (nález 9).
- **Skilly** (kopie ve `skills/`, návrhy do účtu): `atlas-cesta` (krok se zastánci jako blok Strany, Slož argument), `atlas-data` (Prvky z dat: Dva životy a Kdo žil dřív? s pevnými pravidly, co změní nový vztah nebo stránka), `atlas-komponenta` (nic neodkrývat před rozhodnutím, „Začít znovu“, probliknutí po hydrataci, `figcaption`, nový druh bloku a skripty průchodu). `docs/pouceni.md` dvě věty, rozhodnutí v `docs/rozhodnuti.md`.
- **Nad čím jsem váhal:**
  - *Mez 20 let u Kdo žil dřív?* je navíc proti doporučení revize. S pravidlem jen „nepřekrývají se“ vyšlo 21 z 34 dvojic s mezerou 1 až 15 let (Anaxagorás a Platón „Dělí je asi 1 rok“, Antisthenés a Kratés, Plútarchos a Marcus Aurelius). S přibližnými roky je to past: karta „Žili ve stejné době“ je skoro pravda a odkrytí ji označí za omyl. Se 20 lety je nejmenší mezera 20 let; daň je, že čtyři medailonky (Aristippos, Speusippos, Plútarchos, Filón Alexandrijský) dostanou kvůli mezi a stropu tří člověka vzdáleného přes 300 let. Šlo by mez nedávat, nebo ji zvednout na 30 (pak by vzdálených dvojic bylo víc).
  - *Kdo žil dřív? má dál „Zkusit znovu“.* Je to odhad a tlačítko dává nový odhad bez zápisu v deníku; „zkusit“ tam sedí. Ve skillu je to jediná výjimka.
  - *Pojistka probliknutí* (4 s po načtení ukáže skryté, když se ostrov nehydratoval). Bez ní by student při selhání skriptů neviděl ostatní odpovědi vůbec; se 4 s je to dost dlouho na pomalý telefon.
  - *Na plátně Kde se dá napadnout chybí i po volbě třídy.* Učitel ho ukáže přepnutím na celý blok; v diskusi by předjímal, co má třída říct sama.
- **Dva životy, které ani teď nic neříkají** (současník bez vztahu, `VYPIS=1 npx vitest run tests/data/dvojice.test.ts`): Prótagorás → Zénón z Eleje, Aspasie → Chairefón, Alkibiadés → Gorgiás, Aristofanés → Démokritos, Hipparchia → Pyrrhón, Theofrastos → Kratés. Další tři mají v datech jen chybějící vztah, i když dvojice sama dává smysl: Chairefón → Sókratés a Kritón → Sókratés (přátelé, v datech bez `znali-se`), Karneadés → Chrýsippos (četl ho). Nejvíc zarazí Theofrastos, Aristotelův žák, který v datech vztah k Aristotelovi nemá; doplnit vztahy se zdrojem je práce pro `atlas-data` (viz Co zůstává na později).
- **Kdo žil dřív?, které nic neříká:** po mezi 20 let žádná dvojice „Žili ve stejné době“ ani mezera pod 20 let. Vzdálené dvojice kvůli stropu: Aristippos → Seneca (354 let), Speusippos → Seneca (338), Plútarchos → Diogenés (367), Filón Alexandrijský → Diogenés (308); otázka je snadná, ale odkrytí aspoň ukáže staletí.
- **Snímky:** `Claude outputs/o-sloz-argument-dva-zivoty.jpg` (Slož argument v cestě 8 po kontrole, po odkrytí a po volbě na 390 px světle a 1440 px tmavě; Dva životy Seneky s nabídkou).
- **npm test:** astro check 0 chyb (283 souborů), vitest 901 testů ve 40 souborech, Playwright 618 testů, vše prošlo napoprvé (31. 10. 2026).

## Po uzavření

Hotovo 31. 10. 2026. Autor větev schválil („Schvaluju“); od Po O se nic nezměnilo, takže se celé `npm test` před sloučením znovu nepouštělo.

- **Sloučení:** 0c773e2 (`git merge --no-ff interaktivita-v1`), push do `main`. Větev `interaktivita-v1` zůstává.
- **Kontroly na GitHubu poprvé celé:** u 0c773e2 kontrola typů, vitest i sestavení zelené (sestavení na GitHubu proběhlo poprvé), `pages.yml` web nasadil. Playwright spadl v jediném testu z 618: „prstem“ v `sloz-argument.spec.ts`, klepnutí na kartu hned po dotykovém tažení přes CDP.
- **Co jsem opravil:**
  - První pokus (146b8bc) čekal na výběr karty, protože jsem si spad vyložil jako závod klepnutí. Na GitHubu pak spadl na tom čekání.
  - Příčinu ukázal až běh na Linuxu v cloudovém prostředí (klon veřejného repozitáře, `CI=true`): Chromium tam z `tap()` do zhruba 300 ms po tažení přes `Input.dispatchTouchEvent` nevyrobí `click`. Na Macu ano. Komponenta je v pořádku, student tak rychle po puštění karty neklepne.
  - Test po tažení počká 500 ms a ověří výběr karty i tlačítko Sem (b0e6c6d, sloučeno ve větvi a znovu v `main`). Na Linuxu prošel 10× z 10.
  - Celé `npm test` po první opravě: astro check 0 chyb, vitest 901, Playwright 618, vše prošlo. Poučení je v `docs/pouceni.md`.
- **Běhy u b0e6c6d:** Sestavení a kontroly zelené (Playwright 618 testů za 11,5 min), Zveřejnění na GitHub Pages zelené.
- **Živý web** (`/cesta/proc-se-bat-smrti/3/`, ověřeno Playwrightem z Macu): `<meta name="robots" content="noindex">`; Slož argument po Zkontrolovat ukáže tlačítko „Ukázat chybějící větu“ a volbu zatím ne. Snímek: `Claude outputs/uzavreni-web-krok3.png`.
- **Na co dát pozor:** na Macu chybí `gh`; běhy jsem sledoval přes veřejné API GitHubu, které bez přihlášení povolí 60 dotazů za hodinu a log neukáže, jen anotace (název testu a chybu). GitHub hlásí, že akce `checkout`, `setup-node` a `upload-artifact` ve verzi v4 běží na Node 20, který končí; zatím je jen varování.
