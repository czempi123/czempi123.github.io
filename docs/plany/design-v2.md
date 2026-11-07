# Větev design-v2: nový vzhled a pohyb

Nový vzhled atlasu ve stylu scrapbooku s prvky neumorfismu, přechody a animace, díky kterým web působí živě a odpovídá na každý čin studenta, a krátké vysvětlení pojmu po najetí na slovo (třeba „ontologie“). Přání autora z 1. 11. 2026, ladí se společně s ním; podle rozhodnutí ze 7. 11. 2026 běží ještě před prvním celkem středověku. Větev založena 7. 11. 2026, plátno: https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ

**Proč teď.** Středověk přinese nové šablony a bloky (stránka období, Úryvek s otázkou, Dialog, Kolo Štěstěny) a hodně pojmů. V novém vzhledu a s novým pohybem vzniknou jen jednou.

## Kroky

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| D1 | Tři směry na plátně a jejich spojení podle autora | Opus 5.5 · high se skillem `frontend-design` | hotovo 7. 11. 2026; spojení autor schválil 7. 11. 2026 |
| D2 | Design systém na plátně: tokeny (papír, plochy, stíny vystouplé a vtlačené, inkousty, páska a razítko pro osm období, písma a jejich role), knihovna prvků ve všech stavech, tmavý režim („noční zápisník“); kontrast AA výpočtem | Opus 5.5 · high se skillem `frontend-design` | čeká na odpovědi níže |
| D3 | Pohyb na plátně: živé ukázky celého jazyka pohybu (oddíl Pohyb) a jeho pravidla | Opus 5.5 · high se skillem `frontend-design` | čeká |
| D4 | Obrazovky na plátně: Domů, Mapa a čas, profil, krok cesty, stránka otázky, stránka období jiné barvy (Helenismus a Řím), Můj deník a jedna kresba; notebook a telefon, světlý a tmavý režim | Opus 5.5 · high se skillem `frontend-design` | čeká |
| Brána | Autor schválí návrh na plátně; teprve potom kód | autor | čeká |
| K1 | Základ: `tokens.css` a `global.css` podle D2, Kalam lokálně (podmnožiny latin a latin-ext), textura papíru jen v CSS, stíny, tokeny pohybu, omezený pohyb | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | čeká |
| K2 | Rám webu: hlavička, drobečky, spodní lišta, přepínač režimu, hledání, stránka 404; přechody mezi stránkami | totéž | čeká |
| K3 | Stránky osob: hlavička profilu (titulek s pruhem, razítko, deska s fotkou a páskou, lístky cest, štítky otázek, Proč kalich), kapitoly, citát, Doba a lidé, myšlenky, Zkus to žít, Kam dál, Prameny, obsah profilu, medailonky; snímky pro autora | totéž | čeká |
| K4 | Bloky a jejich pohyb: Volba, Odkryj, Roztřiď, Změň jednu věc, Spor, Slož argument, Kdo žil dřív?, Příběh, Kdo je na tvé straně, Návrat, Závěr cesty, Moje stanovisko, první názor | totéž | čeká |
| K5 | Cesta: hlavička s postupem, spodní lišta, přehled cesty, karta cesty, přechod mezi kroky; snímky pro autora | totéž | čeká |
| K6 | Stránky z dat a deník: Domů, období a pás období, směr, otázka s osou hlasů, pokus, úvody, náboženství, Lidé, Otázky, Můj deník, Tvoje antika, Stoický týden, příprava hodiny a promítání | totéž | čeká |
| K7 | Mapa a čas a kresby: podklad mapy, karta člověka, řeka životů, posuvník, mince, Přehrát život; 13 kreseb na rámu `Kresba.svelte` v novém papíru a v tmavém režimu; snímky pro autora | totéž | čeká |
| P | Pojmy: kolekce `pojmy`, komponenta Pojem (poznámka na okraji na notebooku, lístek po klepnutí na telefonu, fokus z klávesnice), stránka `/pojem/<id>/`, první vlna pojmů z antiky s podklady, vyznačení v textech | podklady Opus 5.5 · high (`atlas-overeni`), komponenta Opus 5.5 · high (`atlas-komponenta`), texty `atlas-psani` | čeká |
| R | Revize celé větve: všechny typy stránek na 390 a 1440 px ve světlém i tmavém režimu, kontrast, klávesnice, čtečka, omezený pohyb, výkon na telefonu | Opus 5.5 · high se skillem `atlas-revize` (a pluginem Design, když ho přidáš) | čeká |
| O | Opravy po revizi, nový `docs/design.md`, skill `atlas-komponenta` s oddíly Papír a Pohyb, `docs/pouceni.md` | Opus 5.5 · high | čeká |
| Uzavření | Sloučení, GitHub, kontrola nasazeného webu | Opus 5.5 · medium | čeká |

**Proč v tomhle pořadí**

- **Nejdřív plátno, pak kód.** Vzhled, pohyb i obrazovky se ladí na plátně, kde se dají změnit za minuty; kód začne až po schválení (brána).
- **Kód od základu nahoru.** Komponenty berou barvy skoro jen z tokenů (2 642 odkazů na tokeny, 4 pevné barvy), takže K1 změní najednou většinu webu. Pak rám, který je na každé stránce, potom stránky podle toho, jak často je student vidí.
- **Jedna větev až do konce.** Na veřejném webu nesmějí vedle sebe stát dva styly. Kontrolní body se snímky pro autora jsou po K3, K5 a K7.
- **Pojmy až na novém vzhledu**, protože poznámka na okraji a lístek jsou jeho součást.

## Co už atlas má (7. 11. 2026)

Výpis z repozitáře:

- **Komponenty:** 125 souborů (28 bloků a kreseb v Astru, 40 ostrovů ve Svelte, 14 osobnost, 8 mapa, 8 stránka, 8 ui, 6 rozvržení, 4 cesta, 3 otázka, 3 hodina, 2 týden, 1 deník); 20 tras stránek, rozvržení `Zakladni` a `Dilna`, styly `tokens.css` (154 řádků), `global.css` (275), `promitani.css` (104).
- **Barvy a stíny:** 2 642 odkazů `var(--…)`, 4 pevné barvy, 39 stínů.
- **Pohyb dnes:** 24 animací v kresbách, odkrytí v blocích (`in:odkryti`), příjezd a odjezd v Promítání, kamera mapy 600 ms; omezený pohyb vypíná všechno.
- **Písma** lokálně z balíčků `@fontsource` (Newsreader, Instrument Sans).
- **Testy:** 52 souborů v Playwrightu, z toho 31 fotí; testy rozvržení a snímky se budou měnit.
- **Verze:** Astro 7.3, Svelte 5.57.
- **Plátno:** spojení je v souborech `project/Spojeni.dc.html` a `project/Spojeni-telefon.dc.html`; směry A, B a C pod ním zůstávají pro srovnání.

## Obsah větve

### Vzhled: Spojení

Schválené 7. 11. 2026 („tohle se mi hodně líbí“):

- **Z A:** tečkovaný papír, fotka a citát přilepené páskou v barvě období, razítko období, cesty jako lístky s pahýlem (kroky a minuty), otázky vtlačené do papíru, pojem s poznámkou na okraji, na telefonu karta s páskou, lístek pojmu, zakroužkovaná vtlačená možnost a linkované pole.
- **Z B:** záhlaví (aktivní vstup a hledání vtlačené, Můj deník vystouplý) a Proč kalich (ikona ve vtlačeném kolečku, tučná otázka a text); na telefonu horní lišta s vystouplým tlačítkem zpět a postupem ve vtlačené drážce.
- **Z C:** jméno na vytrženém bílém listu a pod ním pruh papíru v barvě období s větou o člověku; na telefonu na vytrženém listu i nadpis kroku.
- **Písmo z A:** Newsreader na nadpisy a čtení, Kalam na poznámky, lístky a pruh se jménem, Instrument Sans na ovládání a popisky.
- **Pravidlo pro všechno:** co vystupuje z papíru, jde zmáčknout; co je vtlačené, je zvolené nebo aktivní.

### Pohyb (návrh pro D3)

**Zásady**

1. **Pohyb odpovídá na čin studenta:** stisk, volba, odkrytí, otevření pojmu, další krok. Sám od sebe se hýbe jen jeden okamžik při příchodu na stránku a kresby, které pohyb mají v sobě.
2. **Pohyb papíru:** věci se zvedají, pokládají, lepí, otáčejí a překládají. Nic neodskakuje jako plast a oddíly při posouvání stránky nevyjíždějí.
3. **Krátce:** odezva na stisk asi 120 ms, rozložení lístku nebo odkrytí 200 až 300 ms, přechod mezi stránkami 350 až 450 ms; kamera mapy zůstává 600 ms.
4. **Omezený pohyb:** každá animace má klidový stav, který řekne totéž (pravidlo kreseb platí pro všechno).
5. **Lehkost:** jen `transform` a `opacity`, plynule i na levném telefonu.

**Katalog**

| Kde | Co se stane | Technika |
| --- | --- | --- |
| Mezi stránkami | stránka se vymění jako list v deníku; fotka z karty v Lidech přeletí na desku profilu, lístek cesty do hlavičky cesty | přechody mezi dokumenty v prohlížeči (`@view-transition`, `view-transition-name`) |
| Další krok cesty | list se posune doleva, zpátky doprava | totéž, směr podle tlačítka |
| Příchod na profil | páska se jednou přilepí na fotku, titulek a pruh se usadí | CSS, jednou za návštěvu stránky |
| Lístek, karta, tlačítko | najetí zvedne (stín roste), stisk vtlačí | CSS přechody stínu a `transform` |
| Volba | zvolená možnost se vtlačí, tužka dokreslí kroužek, zpětná vazba se rozloží jako lístek | Svelte `draw` a vlastní přechod |
| Odkryj | odpovědi se odklopí jako přeložený papír | Svelte (dnešní `in:odkryti`) |
| Roztřiď | karta přeletí do koše | Svelte `animate:flip` |
| Spor | mince studenta se přesune po škále | CSS `transform` |
| Pojem | lístek se rozbalí ze slova; na notebooku se poznámka na okraji zvýrazní | CSS a Svelte |
| Můj deník | po dokončení cesty se otiskne razítko | CSS, jednou |
| Mapa a čas | kamera (je), body lidí se objevují a mizí s rokem | stávající |

**Technika.** CSS a vestavěné přechody Svelte, žádná knihovna navíc (GSAP, Motion): web zůstane lehký a nic se nemění v tom, jak se načítají ostrovy a deník. Přechody mezi stránkami umí prohlížeč sám: Chrome a Edge od verze 126, Safari od verze 18.2; kde to neumí (zatím Firefox), stránka se přepne bez animace jako dnes.

### Pojmy (krok P)

- **Vzhled podle Spojení:** vlnité podtržení tužkou; na notebooku vysvětlení rukou na okraji, na telefonu lístek po klepnutí, z klávesnice fokusem; „Celý pojem“ vede na stránku pojmu.
- **Data:** kolekce `src/content/pojmy/` (dnes prázdná) se schématem: pojem, původ slova, vysvětlení na dvě věty, příklad, kde se objevuje, prameny.
- **Vyznačení v textu:** ručně v MDX, jen první výskyt na stránce.
- **První vlna:** asi 25 pojmů z antiky, které studenti v textech potkávají (třeba ataraxia, apatheia, ctnost, logos, idea, elenchos, eudaimonia, akrasia); výběr udělají podklady kroku P výpisem z textů.

### Skilly a nástroje

- **Skill na pohyb a přechody** v katalogu není. Pravidla pohybu a papíru proto zapíše krok O do skillu `atlas-komponenta` (oddíly Papír a Pohyb), aby je používaly i další větve.
- **Plugin Design od Anthropicu** (kritika návrhu, kontrola přístupnosti, design systém) se hodí do revize R. Přidat ho jde v Claude; bez něj revize proběhne jen se skillem `atlas-revize`.

## Historie D1

- **D1 (7. 11. 2026):** tři směry na plátně: A Cestovní deník, B Slepotisk, C Koláž; profil Sókrata na notebooku a krok 2 cesty 1 na telefonu.
- **Odpovědi autora:** u každého se mi něco líbí. A je nejlepší jako celek, hlavně části dál v průchodu a lepky; z B navigace v záhlaví a část Proč kalich; z C popis jména. Písmo se mi nejvíc líbí u A.
- **Spojení:** na plátně jako první řada; pruh se jménem psaný rukou (Kalam) a razítko nad jménem zůstaly (bez připomínek). Autor: „Tohle se mi hodně líbí. Ještě bude dobré, aby web měl dobré přechody a animace, aby vypadal dostatečně interaktivně.“

## Nad čím jsem váhal

- **Jedna větev, nebo vlny sloučené zvlášť.** Po vlnách by bylo kam se vrátit, ale veřejný web by týdny míchal starý a nový styl. Jedna větev s kontrolními snímky po K3, K5 a K7 dá totéž bezpečí bez míchání.
- **Přechody mezi stránkami nativně, nebo přes router Astra.** Router dělá z webu jednostránkovou aplikaci: animuje všude, ale mění načítání skriptů, ostrovů a deníku a rozbije část testů. Nativní přechody nic z toho nemění; ve Firefoxu zatím animace nebude.
- **Žádné vyjíždění oddílů při posouvání.** Vypadá to živě, ale je to poznávací znak generovaných webů a zdržuje čtení. Život dá webu odezva na to, co student dělá.
- **Razítko v deníku po dokončené cestě** je jediná „odměna“ a nic nepočítá; zásadě bez bodů a sérií neodporuje.
- **Pojmy ručně, ne automaticky:** automatické vyznačování by podtrhlo i slovo, které na tom místě znamená něco jiného, a v jednom odstavci by podtrhávalo víc slov najednou.

## Co zůstává na později

- Režim třídy v novém vzhledu (navazuje na přípravu hodiny; samostatně).
- Kartičky ke sdílení (obsahová vrstva F5).

## Co rozhodnout před D2

Prázdná odpověď znamená souhlas s doporučením.

1. **Jedna větev až do konce s kontrolními snímky po K3, K5 a K7?** Doporučuji ano.
   Odpověď:

2. **Přechody mezi stránkami nativně v prohlížeči, bez routeru Astra?** Doporučuji ano.
   Odpověď:

3. **Bez další knihovny animací (jen CSS a Svelte)?** Doporučuji ano.
   Odpověď:

4. **Pojmy ručně, jen první výskyt na stránce, první vlna asi 25 pojmů z antiky?** Doporučuji ano.
   Odpověď:

5. **Razítko v deníku po dokončené cestě?** Doporučuji ano.
   Odpověď:

6. **Plugin Design pro revizi:** přidáš ho? Bez odpovědi revize proběhne bez něj.
   Odpověď:

## Zadání D2: design systém na plátně

Opus 5.5 · high. Pusť v novém chatu v Projektu Atlas filozofie, až vyplníš odpovědi (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok D2 větve design-v2, design systém na plátně. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Vzhled: Spojení, Pohyb, Co rozhodnout před D2 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. V docs/design.md jen Principy, Barvy, Typografie, Mezery, mřížka, tvary a Komponenty. Načti skill frontend-design. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti moje komentáře a soubory project/Spojeni.dc.html a project/Spojeni-telefon.dc.html.

1. Na plátno přidej stránku Design systém: tokeny jako vzorník (papír a plochy, stíny vystouplé a vtlačené, inkousty, pigmenty osmi období s páskou a razítkem, písma a jejich role se stupnicí velikostí, zaoblení, mezery) a knihovnu prvků ve všech stavech (klid, najetí, stisk, zvoleno, zakázáno, fokus z klávesnice): tlačítka, lístek cesty, štítek otázky, karta, pole pro text, možnost Volby, citát s páskou, deska s fotkou, titulek s pruhem, razítko, Proč kalich, pojem na okraji a lístek pojmu. Všechno ve světlém i tmavém režimu (noční zápisník).

2. Kontrast AA všech textů a hranic ovládání ověř výpočtem (krátký skript v scripts/, po výpisu ho smaž), ne odhadem.

3. Do plánu větve zapiš oddíl Po D2: tokeny jako tabulky (světlý a tmavý), výsledek kontroly kontrastu, nad čím jsi váhal a co by šlo jinak, otázky Co rozhodnout po D2 a zadání D3 v plném znění. docs/design.md nepřepisuj (to udělá krok O). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

4. Pak se zastav a napiš mi, na co se mám na plátně podívat.
```

## Uzavření

Po revizi a opravách otázka na schválení, kterou zodpoví jen autor. Po ní sloučení do hlavní větve, GitHub, plán a zadání do `docs/archiv/`, řádek v `docs/plan.md` a na řadě krok Z plánu středověku.
