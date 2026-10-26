# Plán větve interaktivita-v1: interaktivita z revize antiky

Souhrnná revize antiky prošla všechny typy stránek s měřítkem „student něco udělá a uvidí myšlenku, kterou by z textu pochopil hůř“ a navrhla, co postavit (`docs/revize/antika-2026-10-25.md`, oddíl 12 a nález 4). Tahle větev postaví první čtyři věci z toho seznamu: blok, který na konci cesty ukáže nejdřív zastánce studentových odpovědí, blok Slož argument z knihovny bloků a dva prvky z dat pro medailonky (Dva životy a Kdo žil dřív?). K tomu na začátku jedna technická oprava: kontrola typů na GitHubu padá od 17. 10. 2026 a lokální `npm test` ji nepouští. Větev založena z hlavní větve 26. 10. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: zkouška se studenty počká, až je autor bude mít (rozhodnutí 26. 10. 2026); atlas je ale veřejný, takže domácí průchody jsou možné už dnes a nejdelší místo antiky, poslední krok cest 2, 7, 8, 33 a 34, čte každý, kdo cestu dojde. Středověk přidá cestu 9 (Anselmův důkaz, který potřebuje Slož argument) a desítky medailonků: prvek, který vznikne z dat teď, dostanou všechny najednou bez psaní textu.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| K0 | Kontrola typů: oprava typu pluginu sazby, `astro check` v `npm test`, aby chyba neprošla lokálně | Sonnet 5.5 · medium | zadání níž |
| K1 | Blok Kdo je na tvé straně: logika čtení deníku, komponenta podle `atlas-komponenta`, nasazení v cestě 2 jako vzor | Opus 5.5 · high (xhigh při zaseknutí) | čeká |
| T1 | Poslední kroky cest 7, 8, 33 a 34 v bloku: text rozdělený podle odpovědí, spojovací věty se skillem `atlas-psani`, testy přesného znění | Opus 5.5 · high se skilly `atlas-psani` a `atlas-cesta` | čeká |
| K2 | Dva životy a Kdo žil dřív? z dat: pravidlo výběru dvojice v `src/lib`, Dva životy v Době a lidech, Kdo žil dřív? v šabloně medailonku | Opus 5.5 · high se skilly `atlas-komponenta` a `atlas-data` | čeká |
| K3 | Slož argument: komponenta podle knihovny bloků, ukázka v dílně, zastavení a podoby v přípravě hodiny | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | čeká |
| T2 | Slož argument v cestě 8, krok 3: premisy a skrytý předpoklad z Dopisu Menoikeovi 124–125 ověřené proti podkladům celku 6, zpětná vazba, navázání textu kroku | Opus 5.5 · high se skilly `atlas-overeni`, `atlas-psani` a `atlas-cesta` | čeká |
| R | Revize větve | Opus 5.5 · high se skillem `atlas-revize` | čeká |
| O | Opravy po revizi a úprava skillů (`atlas-cesta`: krok se zastánci jako blok, Slož argument; `atlas-data`: prvky medailonku) | Opus 5.5 · high | čeká |
| Uzavření | Schválení autorem, sloučení, push hlavní větve (nasadí web), kontroly na GitHubu zelené | Opus 5.5 · medium | čeká |

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

## Zadání K0

Model: Sonnet 5.5 · medium. Nový chat v Projektu Atlas.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K0 větve interaktivita-v1 (kontrola typů). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch interaktivita-v1, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/pouceni.md (oddíl Technika) a v docs/plany/interaktivita-v1.md tabulku kroků, otázku 2 v Co rozhodnout před prvním krokem a toto zadání. Odpovědi autora pod otázkami platí; prázdná odpověď je souhlas s doporučením.

1. Chyba: `npx astro check` hlásí ts(2322) v astro.config.mjs:16 u `satteri({ mdastPlugins: [sazbaMdast] })`. Plugin `sazbaMdast` v src/lib/sazba.js má v JSDoc ručně psaný typ parametru `ctx`, který neodpovídá typu `MdastVisitorContext` z balíčku satteri (jeho `parent` bere uzel mdast, ne `unknown`). Oprav typ, ne chování: typ pluginu a kontextu ber z balíčku satteri (exportuje `MdastPluginDefinition`, `MdastPluginInstance`, `MdastVisitorContext`). Satteri je zatím jen závislost @astrojs/markdown-satteri; když na něj má odkazovat náš kód, přidej ho do devDependencies ve verzi z package-lock.json, aby se import typu nerozbil při další aktualizaci. Varování v scripts/revize-hodiny.mjs (nepoužité proměnné) nech být, nejsou to chyby.

2. Ověř, že se výstup nezměnil: `npx vitest run` (test sazby), pak `npx astro build` a porovnej s hlavní větví dvě sestavené stránky s nezlomitelnými mezerami (třeba portrét Sókrata a krok 1 cesty 1): stejné bajty. `npx astro check` musí skončit bez chyby.

3. Najdi, proč kontrola na GitHubu padá právě od 17. 10. 2026, když se sazba.js ani package-lock.json od 2. 10. nezměnily (git log kolem 17. 10., soubory, které astro check kontroluje; gh na Macu není, takže bez přístupu k Actions). Příčinu zapiš jednou větou do Po K0; když ji nenajdeš, napiš, co jsi ověřil.

4. Aby se to neopakovalo (podle odpovědi 2): v package.json `"test": "astro check && vitest run && playwright test"`; v CLAUDE.md › Co číst a jak šetřit řádek Testy doplň, že celé npm test pouští i kontrolu typů; do docs/pouceni.md › Technika jedna věta (ručně psaný typ pluginu v JSDoc se rozejde s knihovnou a lokální npm test to dřív nepoznal). Celé npm test pusť jednou na pozadí s výstupem do souboru a výsledek čti zvlášť.

5. Commit česky a stručně, ve větvi interaktivita-v1; nic neposílej na GitHub. V plánu větve: řádek K0 na „hotovo“, oddíl „Po K0“ (co jsi změnil, příčina, že kontroly na GitHubu se ověří po pushi při uzavření větve) a pod něj zadání K1 v plném znění ve stejném tvaru jako toto (Opus 5.5 · high, skill atlas-komponenta). Rozhodnutí do docs/rozhodnuti.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/interaktivita-v1.md); nic dalšího do projektu nepřidávej.

6. Pak se zastav a napiš mi krátce, co bylo špatně, co jsi změnil a co mám spustit, jestli vůbec něco.
```
