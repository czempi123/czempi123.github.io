---
name: atlas-obdobi
description: Plán jednoho období Atlasu myšlení (P12) podle docs/architektura.md — výběr lidí a hloubek, velké otázky doby, cesty a pořadí celků, výřez mapy a dějinné kotvy, náboženství doby a Mezitím jinde, stránky období, směrů, pokusů a tradic, Tvoje <období> v deníku, hlasy pro osu hlasů a místa s časem pro Přehrát život. Použij VŽDY, když se plánuje další období (středověk, renesance, osvícenství…), když uživatel řekne „naplánuj období“, „plán středověku“, „P12“, „co bude v dalším období“, a když se v rozpracovaném období mění výběr lidí nebo pořadí celků.
---

# Plán období v Atlasu myšlení

Období jsou podklady, stránky, cesty a revize v osmi až deseti větvích za šest až osm týdnů. Plán období rozhodne předem, co z architektury vznikne, v jakém pořadí a z jakých šablon. Nic se pak nedodělává na konci (antika potřebovala celou větev `antika-doplnky`) a deset cest nevyjde jako jeden formulář (souhrnná revize antiky). Plán nepíše studentský text a nemění kód ani data: je to rozhodnutí pro autora a zadání pro další kroky.

**Výstup:** `docs/plany/<slug>.md` (slug období z `src/data/obdobi.yaml`, třeba `stredovek`) v tvaru plánu větve (oddíl Tvar plánu), řádek v `docs/plan.md` › Plány větví a Další větve v pořadí, po odpovědích autora záznam v `docs/rozhodnuti.md`. Každý celek pak dostane vlastní větev a plán `docs/plany/<větev>.md`; plán období mu dává obsah a místo v pořadí.

## Postup

1. **Přečti** `CLAUDE.md`, `docs/styl.md`, `docs/pouceni.md` a `references/kontrola-planu.md`. V `docs/architektura.md` jen řádek období v Osm období a v Kostře osobností, cesty období z Katalogu cest a z Mapy otázek a období, zastavení období v Průřezových liniích, tradice období v Náboženství světa a řádek fáze v Pořadí výroby. Hotové stránky nečti; co atlas má, vypiš z repozitáře (reference › Jak spočítat, co atlas má).
   **Dluh předchozího období.** Porovnej předchozí období s jeho řádky v Kostře osobností, Náboženství světa, Myšlenkových pokusech a Pořadí výroby (výpis stránek, ne čtení). Co chybí, vypiš v plánu jako první otázku pro autora: dodělat před prvním celkem, souběžně, nebo později. Pro antiku je dluh v referenci › Co antika proti architektuře ještě nemá.
2. **Lidé a hloubky**, pak **otázky doby, cesty a celky** (oddíly níže).
3. **Mapa, čas a data:** výřez, kotvy, místa s časem, hlasy na ose.
4. **Náboženství doby a Mezitím jinde.**
5. **Stránky ze šablon:** období, směry, pokusy, tradice, Tvoje <období>.
6. **Pohyblivá myšlenka** ke každému celku.
7. **Pořadí větví a kroky.** Plán napiš v ustáleném tvaru a projdi ho referencí.
8. **Zastav se** u otázek pro autora. Po odpovědích zapiš rozhodnutí do `docs/rozhodnuti.md`, uprav plán a `docs/plan.md` v repozitáři i v Projektu Claude.

## Lidé a hloubky

- **Výchozí bod je Kostra osobností:** 3–5 portrétů, 7–9 profilů, asi tucet medailonků. Portrét jen tam, kde je silný životní příběh a velký vliv; dvojice se společným příběhem dostane jeden společný portrét (Kratés a Hipparchia, Abelárd a Héloïsa).
- **Kdo už je v datech** (`lide.yaml`, pole `obdobi`, `hloubka`, `medailonek`): lidé z okraje oken sousedních období tam bývají. U každé osoby plán řekne hloubku a celek, ve kterém vznikne její stránka.
- **Nová osoba v datech jen se souhlasem autora.** Plán je vypíše jako otázku s doporučením (kdo, hloubka, proč, který celek ji nese) a krok, který na ní stojí, podmíní odpovědí. Prázdná odpověď tu souhlas není. Medailonky vznikají hromadně (`atlas-data`) po celcích, které je potřebují jako hlas nebo stranu Sporu.
- **Protihlas z jiné tradice.** V antice mluví Aristotelés v sedmi cestách a na všech stránkách otázek, Seneca v pěti cestách. Plán rozloží protihlasy tak, aby každý celek měl jiný než předchozí, a v obdobích s okny i z jiné tradice (ve středověku Averroes, Maimonides, al-Ghazálí). Strana Sporu musí být v datech aspoň medailonkem s atributem.
- **Ženy jako plné hlasy** podle architektury (ve středověku Héloïsa, Hildegarda, Christine de Pizan): v celcích, ne ve zvláštní kapitole.

## Otázky doby, cesty a celky

- **Otázky doby** jsou ty, ke kterým období má cestu nebo silný hlas. Stránka období má u každé odstavec; plán je vypíše s cestami, které k nim vedou.
- **Vyváženost.** Etika (otázky 1 a 2) nejvýš třetina cest období. Otázka s nejvíc cestami v atlasu (po antice otázka 1 se čtyřmi) další nedostane, dokud otázky bez cesty (po antice 2, 8, 9, 10) nemají aspoň jednu.
- **Celek** je velká otázka s cestou a profily, které cesta potřebuje; profil bez cesty jde do celku s nejbližší otázkou. Každá cesta spíná dvě doby: příběh z období a současný případ.
- **Jiná stavba.** Deset cest antiky má stejné pořadí (Volba nebo Roztřiď, filozof, Spor, nový případ, zastánci, pravidlo) a napříč se čtou jako formulář. Plán období u aspoň jedné cesty předepíše jinou stavbu a nové bloky (Dialog, Úryvek s otázkou) dřív, než vznikne další cesta stejné stavby. Blok, který ještě není, staví `atlas-komponenta` v kroku před cestou; pořadí bloků v cestě určuje látka (`atlas-cesta` › Postup).
- **Hotové bloky:** Slož argument stojí od `interaktivita-v1` (cesta 9 ho potřebuje pro Anselmův důkaz a Gaunilův ostrov); Dialog a Úryvek s otázkou čekají na první cestu, která je potřebuje.
- **Úvody a závěry napříč.** Šablona se v jednom celku neprojeví, v deseti ano (úvody „Než si přečteš…“, závěry „Ty jsi dnes…“). Plán v zadání každého celku připomene: úvod a závěr se píšou naposledy a porovnávají s hotovými cestami období (`atlas-cesta`, `atlas-revize`).
- **Délka.** Cesty antiky mají 14 až 35 minut, průměrně 27; celá se do vyučovací hodiny nevejde. Plán s tím počítá u výběru cest pro zkoušku se studenty a pro přípravu hodiny, ne krácením.
- **Otázka bez cesty v období** dostane stránku s hlasy jen od lidí s vlastní stránkou a každá možnost úvodního případu má zastánce (`atlas-cesta` › Stránka velké otázky). Odkaz z Co je náboženství? na otázku 9 se vrátí, až otázka 9 stránku dostane.
- **Myšlenkové pokusy:** jeden dva, které stojí za vlastní stránku (ve středověku třeba Avicennův létající člověk; Gaunilův ostrov nese cesta 9). Blok nebo kresba, která už stojí jinde, se na stránku pokusu vkládá se stejným id.

## Mapa, čas a data

- **Výřez a okno** jsou v `src/data/obdobi.yaml` (`okno`, `mapa`). Když má výřez `stav: navrh`, plán projde místa lidí období a navrhne výřez schválit, nebo upravit; místo mimo výřez ukáže jen štítek u okraje.
- **Kotvy** (`udalosti.yaml`, `druh: kotva`) podle Dějinných kotev architektury, každá se zdrojem; události ze životů (`druh: zivot`) s osobou. Stránka období potřebuje rok a osobu pro Mapu a čas (`mapa: { rok, osoba }` ve frontmatteru).
- **Místa s rolí a časem pro Přehrát život.** Oddíl Život na mapě dostane jen člověk s aspoň dvěma různými místy za život. Místo bez `od` a `do` dá jen odvozenou zastávku (pravidlo „od osmnácti“) bez roku a věku. Plán u portrétů a profilů předepíše v kroku dat místa s rolí a časem ze zdroje (rodiště, působiště, exil, místo smrti); tenké trasy vypíše `npx vite-node scripts/zivot-na-mape-vypis.ts`.
- **Hlasy na osu hlasů.** Nový hlas na stránce otázky se sám objeví na ose (polovina života z `narozen` a `zemrel`, nebo z `aktivni`), přidá tlačítko pod osu a mění věty po volbě. Plán spočítá hlasy každé otázky po období: nad sedm hlasů nebo s rozpětím přes tisíc let ať krok T vypíše rozvržení (`npx vite-node scripts/osa-hlasu-rady.ts`) a revize celku zkontroluje osu na 390 px. Každý hlas posune pořadí zastavení v katalogu hodin a přidá tlačítko otázky do hlavičky profilu (`docs/pouceni.md` › Co se skládá z dat).
- **Vztahy** (učitel a žák, vliv textem) drží rodokmeny směrů, Dva životy a Kdo žil dřív?: u každé nové osoby se zdrojem.

## Náboženství doby a Mezitím jinde

- **Tradice období** podle Náboženství světa (ve středověku islám a křesťanství; judaismus stojí a naváže Maimonidem). Stránka `/nabozenstvi/<slug>/` ze šablony tradice: pole `mista` (mapka jen se jmény, seznam pod ní) a `tradice` (vazba na osoby, Kam dál z jejich medailonků). Citát z posvátného textu má `tradice`, autor mimo data `bezOsoby`.
- **Podklady k náboženství mají vlastní krok (P6N):** jiné prameny a jiná míra opatrnosti. Každou stránku čti očima věřícího té tradice i nevěřícího; výklad, o který se tradice přou, jde do otázky pro studenta; o pravdivosti rozhoduje otázka 9, ne stránka tradice.
- **Mezitím jinde** jen dvěma větami bez odkazu, dokud nové osoby nepřibývají; okno s vloženou mapkou přijde s buddhismem a čínskou tradicí.

## Stránky ze šablon

Šablony jsou v `docs/design.md` › Stránky období, směru, pokusu, úvodu a tradice. Plán je dává do celků od začátku, nejpozději do celku, který je poprvé potřebuje.

- **Stránka období** `/obdobi/<slug>/` se skládá hlavně z dat. Píše se jen úvodní scéna, perex, odstavec ke každé otázce doby a nepovinné Mezitím jinde. Scéna neopakuje scénu portrétu a o mýtu, víře a filozofii neříká nic jiného než Co je filozofie? (pět odpovědí na hrom nejsou schody); ve středověku, kde víra a rozum jsou téma (otázka 9, linie Víra a rozum), dvojnásob. Kam dál předchozího období vede na další období, které má čárkovaný okraj, dokud nemá stránku.
- **Směry:** stránku dostane směr, který nese cesty nebo portréty (v antice čtyři ze třinácti, ve středověku třeba patristika a scholastika; architektura neříká, které směry stránku dostanou); ostatní zůstávají štítkem. Směr potřebuje v datech zakladatele (`zakladatel`), vztahy učitel a žák (rodokmen se skládá sám) a spor s jiným směrem; píše se se skillem `atlas-osobnost` › Stránka směru. Spor dvou škol se vypráví na jedné stránce, sousední odkáže větou.
- **Anekdoty a citáty** hlídej napříč stránkami: stránky z dat (období, směr, otázka) je zopakují nejsnáz. Než plán přidělí anekdotu stránce, vyhledej ji v `src/content`; tentýž citát nejvýš dvakrát v celku.
- **Přehled období v deníku** (Tvoje <období>, `/denik/<slug>/`) nad `src/lib/tvoje-obdobi.ts` a `katalogObdobi([n])` v `src/components/denik/_katalog-obdobi.ts`. Vstup z deníku a z poslední stránky období, jen z toho, co student udělal, bez procent a typů; nese i volbu z osy hlasů.

## Pohyblivá myšlenka

Ke každému celku jedna myšlenka, kterou student pohne a uvidí ji líp než z textu: kresba s pohybem, Slož argument, prvek z dat (Dva životy, Kdo žil dřív?, osa hlasů, Přehrát život). Ozdoba ani hra na body ne. Plán ji u celku pojmenuje jednou větou a řekne, jestli jde o novou kresbu (`atlas-komponenta`, rám `Kresba.svelte`), nebo hotový prvek. Kresba s pohybem jde zastavit, po zastavení ukáže totéž co při omezeném pohybu a autor ji vidí dřív, než se popíše jako hotová.

## Kdy je plán hotový

- Každá osoba z Kostry má hloubku a celek; nové osoby jsou otázkou pro autora.
- Každá cesta období má celek, otázku a pohyblivou myšlenku; aspoň jedna má jinou stavbu a nový blok je naplánovaný před ní; etika nejvýš třetina cest.
- Stránka období, směry se stránkou, pokusy, tradice a Tvoje <období> mají krok nejpozději v celku, který je poprvé potřebuje.
- Výřez, kotvy, místa s časem a hlasy na ose mají krok v datech se zdrojem.
- Na konci stojí souhrnná revize období (P11, Fable 5.1 · high), úprava skillů (P13) a jedna skutečná hodina nebo průchody se studenty.
- Plán prošel `references/kontrola-planu.md` a každý otevřený bod je otázkou pro autora.

## Tvar plánu

Plán období i plán každé větve mají tvar, jak se ustálil v `antika-doplnky` a `interaktivita-v2`:

1. **Nadpis a úvod:** co větev udělá, odkud zadání přišlo, kdy a z čeho byla založená; pod tím „Proč teď“ jednou dvěma větami.
2. **Tabulka kroků** `| Krok | Co | Model | Stav |`: P6 podklady (P6N náboženství), K komponenty a šablony, T texty, R revize, O opravy po revizi a úprava skillů, Uzavření. U modelu úsilí a skilly („Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta`“), stav „čeká“, „hotovo <datum>“ nebo „čeká na odpovědi po <krok>“. Pod tabulkou „Proč v tomhle pořadí“.
3. **Co už atlas má:** soubory a funkce, na kterých větev staví, s cestami v repozitáři.
4. **Obsah větve** po oddílech s kroky v závorce, **Nad čím jsem váhal**, **Co zůstává na později**.
5. **Co rozhodnout před prvním krokem:** „Prázdná odpověď znamená souhlas s doporučením.“ a číslované otázky s tučným jádrem a doporučením, pod každou prázdné `Odpověď:`. Sloučení, GitHub, nové osoby, stahování obrázků a mazání mají otázku, u které prázdná odpověď souhlas není.
6. **Po <krok>** za každým hotovým krokem: co je hotové, nad čím jsem váhal a co jsem zvolil, co by šlo jinak, výsledek testů; případně „Co rozhodnout po <krok>“ ve stejném tvaru otázek.
7. **Zadání <další krok>** v plném znění: model a úsilí, kde ho pustit, blok `text` s kroky od 0 (větev, co číst a co ne) po „pak se zastav a napiš mi…“. Provedené zadání se přesune do `docs/archiv/zadani/<větev>.md`; v plánu zůstává jen to další.
8. **Uzavření:** otázka na schválení, kterou zodpoví jen autor; po ní plán a zadání do `docs/archiv/` a řádek v `docs/plan.md`.

## Na které skilly plán navazuje

- `atlas-overeni`: podklady P6 a P6N ke každému celku a k náboženství.
- `atlas-data`: nové osoby po souhlasu autora, místa s časem, vztahy, kotvy, vlna medailonků období.
- `atlas-osobnost`: portréty, profily, stránky směrů.
- `atlas-cesta`: cesty, stránky otázek, myšlenkové pokusy.
- `atlas-komponenta`: nové bloky a kresby, šablony stránek, Tvoje <období>.
- `atlas-psani`: každý text pro studenty, i texty stránky období.
- `atlas-revize`: revize celků a souhrnná revize období.

Model: Opus 5.5 · high (`docs/plan.md` › Katalog promptů, P12).
