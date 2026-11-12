# Větev design-v2: nový vzhled a pohyb

Nový vzhled atlasu ve stylu scrapbooku s prvky neumorfismu, přechody a animace, díky kterým web působí živě a odpovídá na každý čin studenta, a krátké vysvětlení pojmu po najetí na slovo (třeba „ontologie“). Přání autora z 1. 11. 2026, ladí se společně s ním; podle rozhodnutí ze 7. 11. 2026 běží ještě před prvním celkem středověku. Větev založena 7. 11. 2026, plátno: https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ

**Proč teď.** Středověk přinese nové šablony a bloky (stránka období, Úryvek s otázkou, Dialog, Kolo Štěstěny) a hodně pojmů. V novém vzhledu a s novým pohybem vzniknou jen jednou.

## Kroky

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| D1 | Tři směry na plátně a jejich spojení podle autora | Opus 5.5 · high se skillem `frontend-design` | hotovo 7. 11. 2026; spojení autor schválil 7. 11. 2026 |
| D2 | Design systém na plátně: tokeny (papír, plochy, stíny vystouplé a vtlačené, inkousty, páska a razítko pro osm období, písma a jejich role), knihovna prvků ve všech stavech, tmavý režim („noční zápisník“); kontrast AA výpočtem | Opus 5.5 · high se skillem `frontend-design` | hotovo 8. 11. 2026 (oddíl Po D2) |
| D3 | Pohyb na plátně: živé ukázky celého jazyka pohybu (oddíl Pohyb) a jeho pravidla | Opus 5.5 · high se skillem `frontend-design` | hotovo 8. 11. 2026 (oddíl Po D3); odpovědi po D3 8. 11. 2026 |
| D4 | Obrazovky na plátně: Domů, Mapa a čas, profil, krok cesty, stránka otázky, stránka období jiné barvy (Helenismus a Řím), Můj deník a jedna kresba; notebook a telefon, světlý a tmavý režim | Opus 5.5 · high se skillem `frontend-design` | hotovo 8. 11. 2026 (oddíl Po D4) |
| Brána | Autor schválí návrh na plátně; teprve potom kód | autor | schváleno 8. 11. 2026 (Co rozhodnout po D4, otázka 9) |
| K1 | Základ: `tokens.css` a `global.css` podle D2, Kalam lokálně (podmnožiny latin a latin-ext), textura papíru jen v CSS, stíny, tokeny pohybu, omezený pohyb | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | hotovo 8. 11. 2026 (oddíl Po K1) |
| K2 | Rám webu: hlavička, drobečky, spodní lišta, přepínač režimu, hledání, stránka 404; přechody mezi stránkami | totéž | hotovo 8. 11. 2026 (oddíl Po K2) |
| K3 | Stránky osob: hlavička profilu (titulek s pruhem, razítko, deska s fotkou a páskou, lístky cest, štítky otázek, Proč kalich), kapitoly, citát, Doba a lidé, myšlenky, Zkus to žít, Kam dál, Prameny, obsah profilu, medailonky; snímky pro autora | totéž | hotovo 9. 11. 2026 (oddíl Po K3); kontrolní bod se snímky |
| D5 | Herní prvky a vizuální zlepšení na plátně (oddíl Po auditu): společný rám aktivity, předmět pro každou rodinu aktivit, otočení karty, zamíchání, přichycení karty na osu a do koše, klepnutí do mapy, odhad posuvníkem a odhalení, razítko „sedí“ a lístek „zkus to jinak“ (bez červené a zelené), panel příběhu v obrazech (přehrávač zvuku odložený se zvukem, 12. 11. 2026); body 1 až 5 z Vizuálních zlepšení | Opus 5.5 · high se skillem `frontend-design` | čeká; jedno až dvě sezení na plátně |
| K3 dodatek | Stránky osob: body 1, 7, 8 a 9 z Vizuálních zlepšení (kapitola na čistém listu, vlepené věci různě, razítko s městem a rokem, obraz ke kapitole); na telefonu záložky otázek až za úvodní odstavec profilu; nejdřív ověřit přechod listu a let fotky v opravdovém Chromu (otázka 8 po K3) | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | čeká |
| K4a | Společný rám aktivity pro všechny dnešní i budoucí aktivity (hlava, zadání, plocha, zpětná vazba jako lístek, Začít znovu) a první bloky: Volba, Odkryj, tlačítka, pole; studentova ruka (bod 3), aktivita na telefonu přes celou šířku (bod 11); tři snímky čtenářského sloupce (tečky, ztlumené tečky, čistý list) k rozhodnutí | totéž | čeká |
| K4b | Zbylé bloky: Roztřiď, Změň jednu věc, Spor, Slož argument, Kdo žil dřív?, Příběh, Kdo je na tvé straně, Návrat, Závěr cesty, Moje stanovisko, první názor, Zkus to žít, Dva životy; každá rodina aktivit jako svůj předmět (bod 2); razítko člověka v blocích | totéž | čeká |
| K5 | Cesta: hlavička s postupem jako lístek, který se štípe (bod 4), spodní lišta, přehled cesty, karta cesty. **Další krok je tichý, dokud student neodpoví** nebo krok výslovně nepřeskočí; hlavní je tlačítko bloku. Přechod mezi kroky krátký (posun listu), otočení listu zůstává mezi stránkami; snímky pro autora | totéž | čeká |
| K6 | Stránky z dat a deník: Domů jako stůl s věcmi k vzetí (bod 10), období a pás období, papírnictví období (bod 5, tokeny `.obdobi-N`), živý okraj (bod 6), směr, otázka s osou hlasů, pokus, úvody, náboženství, Lidé, Otázky, **Můj deník jako opravdový zápisník** (Moje filozofie, sbírka, záznam jako lístek, přenos a záloha, tichá tečka u ikony Deník, když čeká Návrat; oddíl Mapa a deník: funkce), Tvoje antika, Stoický týden, příprava hodiny a promítání | totéž | čeká |
| K7a | Mapa a čas: podklad mapy jako výstřižek, karta člověka, řeka životů, posuvník, mince, Přehrát život a funkce z oddílu Mapa a deník: funkce; kontrolní snímky | totéž | čeká |
| K7b | Třináct kreseb jako koláž na rámu `Kresba.svelte` v novém papíru a v tmavém režimu (pravidla v Po D4); obraz ke kapitole (bod 9) tam, kde ho nese kresba; kontrolní snímky | totéž | čeká |
| P | Pojmy: kolekce `pojmy`, komponenta Pojem (poznámka na okraji na notebooku, lístek po klepnutí na telefonu, fokus z klávesnice), stránka `/pojem/<id>/`, první vlna pojmů z antiky s podklady, vyznačení v textech; české tvary jmen pro hledání (Pagefind neskloňuje) | podklady Opus 5.5 · high (`atlas-overeni`), komponenta Opus 5.5 · high (`atlas-komponenta`), texty `atlas-psani` | čeká |
| R | Revize celé větve: všechny typy stránek na 390 a 1440 px ve světlém i tmavém režimu, kontrast, klávesnice, čtečka, omezený pohyb, výkon na autorově telefonu a na jednom levném se systémem Android (když otočení listu trhá, přepne se samo na krátký přechod), váha HTML stránek osob, Zod v ostrovu `SlozArgument` | Opus 5.5 · high se skillem `atlas-revize` a pluginem Design (`design:accessibility-review`, `design:design-critique`) | čeká |
| O | Opravy po revizi, **přepínač Klidný režim** v záhlaví (krátké přechody i bez nastavení systému, čistý papír; bod 12), `docs/design.md` napsat znovu a krátce (dnes 144 kB), do testů dvanáct referenčních snímků klíčových obrazovek, skill `atlas-komponenta` s oddíly Papír a Pohyb, `docs/pouceni.md` | Opus 5.5 · high | čeká |
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

## Po D2 (8. 11. 2026)

**Na plátně** vpravo od Spojení přibyly dvě stránky: „Design systém: den“ a „Design systém: noční zápisník“. Je to táž stránka (`project/DesignSystem.dc.html`, noc ji vkládá s režimem `noc`); přepínač Den / Noční zápisník je i v její hlavičce. Obsah: papír a plochy, stíny, inkousty, osm období, písma se stupnicí, zaoblení, mezery a prvky ve všech stavech; nahoře list Zkus si to s opravdovými prvky na klávesnici a myši. Kontrast u inkoustů a období stránka počítá přímo ze zobrazených barev.

Komentáře na plátně žádné nebyly. Odpovědi před D2 byly prázdné, takže platí všech šest doporučení (plugin Design zatím nepřidán).

### Tokeny: papír, plochy, inkousty

Světlé hodnoty jsou ze schváleného Spojení beze změny; noční zápisník je nový.

| Token | Den | Noc | Použití |
| --- | --- | --- | --- |
| `--papir` | `#EFEDE6` | `#1D1B18` | pozadí stránky; také vtlačená plocha (liší ji jen stín) |
| `--tecka` | `#CBC4B6` | `#36322C` | tečky papíru po 22 px (na telefonu 20), jen ozdoba |
| `--list` | `#FBFAF6` | `#2A2723` | vytržený list se jménem, citát, rám fotky, karta |
| `--plocha` | `#F8F6F1` | `#27241F` | vystouplé: lístek cesty, možnost, vedlejší tlačítko |
| `--plocha-m` | `#F3F1EB` | `#23211D` | malé vystouplé: Můj deník, zpět, přepínač |
| `--listek` | `#F6EFD9` | `#3A3426` | lístek pojmu, poznámka na okraji po najetí |
| `--linka` | `#D8D1C3` | `#3D3832` | řádky pole, perforace pahýlu, dělicí linky; nikdy jediná hranice ovládání |
| `--tuzka` | `#8A8277` | `#8C8476` | jen hranice (3 : 1): vlnovka pojmu, spodní linka pole, čárkovaný okraj zakázaného |
| `--ink` | `#24211D` | `#EEE8DD` | nadpisy, text, hlavní tlačítko, rámeček fokusu |
| `--ink-2` | `#3F3A33` | `#D3CBBE` | perexy, text lístků a štítků, popisky polí |
| `--ruka` | `#4C4740` | `#C6BDAE` | poznámky Kalamem, písmena možností |
| `--ink-3` | `#6A6258` | `#A89F90` | popisky obrázků, „Cesta“ nad názvem, drobečky, zakázaný text |
| `--na-inkoustu` | `#F8F6F1` | `#1D1B18` | text na hlavním tlačítku |
| `--na-papiru` | `#FBF4EE` | `#FBF4EE` | text na pruhu v barvě období |

### Stíny

| Token | Den | Noc | Kdy |
| --- | --- | --- | --- |
| `--vyst` | `-5px -5px 12px rgb(255 255 255 / .95), 5px 6px 13px rgb(150 140 124 / .4)` | `-4px -4px 10px rgb(255 236 210 / .045), 5px 6px 14px rgb(0 0 0 / .6)` | vystouplé v klidu |
| `--vyst-m` | `-3px -3px 8px … / .95, 3px 4px 9px rgb(150 140 124 / .38)` | `-3px -3px 7px … / .045, 3px 4px 9px rgb(0 0 0 / .55)` | malé vystouplé |
| `--zved` | `-6px -6px 14px … / .95, 8px 11px 20px rgb(150 140 124 / .46)` | `-5px -5px 12px … / .06, 8px 11px 22px rgb(0 0 0 / .66)` | najetí na vystouplé |
| `--vtla` | `inset 3px 3px 7px rgb(150 140 124 / .45), inset -3px -3px 7px rgb(255 255 255 / .95)` | `inset 3px 3px 7px rgb(0 0 0 / .6), inset -3px -3px 7px rgb(255 236 210 / .045)` | zvolené, aktivní, štítek otázky, drážka |
| `--vtla-mele` | `inset 2px 2px 4px … / .32, inset -2px -2px 4px … / .9` | `inset 2px 2px 4px rgb(0 0 0 / .45), …` | najetí na vtlačený štítek |
| `--vtla-hl` | `inset 4px 4px 9px … / .58, inset -2px -2px 6px … / .9` | `inset 4px 4px 10px rgb(0 0 0 / .72), …` | okamžik stisku |
| `--vyst-ink`, `--zved-ink`, `--vtla-ink` | stín hlavního tlačítka v klidu, po najetí a při stisku | totéž v noci | hlavní tlačítko |
| `--lezi` | `0 1px 1px rgb(0 0 0 / .06), 0 12px 22px -12px rgb(60 50 40 / .35)` | `0 1px 1px rgb(0 0 0 / .3), 0 12px 22px -12px rgb(0 0 0 / .75)` | citát, karta, lístek pojmu |
| `--lezi-zved`, `--lezi-tlak` | karta po najetí (`0 22px 30px -14px`) a po stisku (`0 4px 8px -4px`) | totéž tmavší | karta, která vede jinam |
| `--odlep` | `drop-shadow(0 7px 8px rgb(60 50 40 / .28))` | `drop-shadow(0 7px 9px rgb(0 0 0 / .55))` | filtr pro vytržený list a pruh (stín sleduje zubatý okraj) |

Přesné hodnoty všech stínů jsou v `<helmet>` souboru `project/DesignSystem.dc.html`; K1 je přenese do `tokens.css`.

### Osm období

Každé období má **inkoust** `--p` (text, razítko, kroužek tužkou, pahýl, postup) a **papír** `--pp` (pruh se jménem, páska). Papír je ve dne i v noci stejný kus barevného papíru, inkoust se v noci zesvětlí. Páska: pruhy po 7 px pod úhlem −45°, papír období na 62 a 42 % (noc 52 a 34 %), zubaté konce.

| N | Období | Pigment | Papír (den i noc) | Inkoust den | Inkoust noc |
| --- | --- | --- | --- | --- | --- |
| 1 | Počátky a klasické Řecko | terakota | `#A34329` | `#A34329` | `#E48B68` |
| 2 | Helenismus a Řím | tyrský purpur | `#7B3565` | `#7B3565` | `#D48DBF` |
| 3 | Středověk | lapis lazuli | `#2D4E9B` | `#2D4E9B` | `#95ACEE` |
| 4 | Renesance a raný novověk | olovnato-cínová žluť | `#865B0F` | `#865B0F` | `#E0B359` |
| 5 | Osvícenství | pruská modř | `#1C5B6B` | `#1C5B6B` | `#6DBFCE` |
| 6 | 19. století | smaragdová zeleň | `#3D6B38` | `#3D6B38` | `#93C486` |
| 7 | 20. století: krize a hledání | kadmiová červeň | `#A12538` | `#A12538` | `#F0848F` |
| 8 | Po válce a dnes | dioxazinová fialová | `#5A4A9C` | `#5A4A9C` | `#B5A8F0` |

Hodnoty jsou z dnešního `docs/design.md`, takže mapa, osa a pás období zůstávají v barvách, které student zná. Tinty, soft tóny a desky (`--period-N-tint`, `-soft`, `-plate`) D2 nemění; viz otázka 5.

### Písma

| Token | Písmo | Notebook / telefon | Řádek, prostrkání | Kde |
| --- | --- | --- | --- | --- |
| `jmeno` | Newsreader 400 | 104 / 56 | 0,92 · −3,5 % | jméno na vytrženém listu |
| `h1` | Newsreader 400 | 64 / 40 | 1,0 · −2 % | nadpis stránky a kroku |
| `h2` | Newsreader 400 | 44 / 30 | 1,05 · −1,5 % | oddíly |
| `h3` | Newsreader 400 | 30 / 24 | 1,12 | kapitoly, bloky |
| `citat` | Newsreader 400 | 31 / 23 | 1,25 | citát s páskou |
| `perex` | Newsreader 400 | 23 / 19 | 1,55 | úvod stránky |
| `text` | Newsreader 400 | 21 / 18 | 1,65 | čtení, sloupec 680 px |
| `ruka-l` | Kalam 700 | 40 / 26 | 1,15 | pruh se jménem |
| `ruka` | Kalam 400 | 19 / 17 | 1,35 | poznámky, lístek pojmu; pole 18 px na řádku 28 px |
| `ovladani-l` | Instrument Sans 600 | 17 | 1,3 | velká tlačítka |
| `ovladani` | Instrument Sans 500 a 600 | 15 | 1,45 | tlačítka, štítky, záhlaví |
| `popisek` | Instrument Sans 400 | 13 / 12 | 1,5 | popisky, „Cesta“ nad názvem; malými písmeny |

### Zaoblení a mezery

- Zaoblení: `papir` 0 (listy, citát, karta, fotka), `razitko` 3, `ovladani` 10 (tlačítko, lístek, možnost), `plne` 999 (štítek, ikona, přepínač).
- Mezery: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96 (beze změny). Okraj stránky 48 px na notebooku (Spojení), 16 px na telefonu. Dotykový cíl aspoň 44 × 44, tlačítka 48.

### Stavy prvků

| Prvek | Klid | Najetí | Stisk | Zvoleno | Zakázáno |
| --- | --- | --- | --- | --- | --- |
| Hlavní tlačítko | plný inkoust, `--vyst-ink` | `--zved-ink`, −1 px | `--vtla-ink`, +1 px | nemá | zploštělé, čárkovaný okraj tužkou, text `--ink-3` |
| Vedlejší tlačítko | `--plocha`, `--vyst` | `--zved`, −1 px | `--papir`, `--vtla-hl` | `--vtla` a ✓ (`aria-pressed`) | totéž jako u hlavního |
| Tiché tlačítko | podtržené tužkou | podtržení inkoustem 2 px | +1 px | nemá | bez podtržení, `--ink-3` |
| Ikonové | kolečko 48, `--vyst-m` | `--zved` | `--vtla-hl` | `--vtla` | zploštělé, čárkované |
| Lístek cesty | `--vyst` | `--zved`, −2 px | `--vtla-hl` | cesta, ve které jsi: `--vtla`, pahýl „3 ze 7“ | připravujeme: bez stínu, čárkovaný, pahýl „brzy“ |
| Štítek otázky | vtlačený `--vtla` | `--vtla-mele`, text `--ink`, podtržení | `--vtla-hl` | tečka v barvě období a tučně (`aria-current`) | bez stínu, čárkovaný |
| Karta | ležící, −0,8°, `--lezi` | narovná se, −3 px, `--lezi-zved` | `--lezi-tlak` | zapadne do papíru `--vtla` | bez stínu a šipky, čárkovaná |
| Pole | řádky `--linka`, spodní linka `--tuzka` 1,5 px | linka `--ink` | nemá; místo toho vyplněno | nemá | řádky slabší, spodní linka čárkovaná |
| Možnost Volby | `--vyst` | `--zved`, −1 px | `--vtla-hl` | `--vtla` a kroužek tužkou v barvě období | po odeslání tahu zploštělá, čárkovaná |
| Pojem | vlnovka `--tuzka` | vlnovka `--ink`, poznámka podložená lístkem | nemá | nemá | nemá |

Fokus z klávesnice má všechno stejný: 2 px `--ink`, odsazení 3 px, jen `:focus-visible`. Přechody stavů na plátně: 120 ms, `ease`; při omezeném pohybu žádné. Citát, deska s fotkou, titulek s pruhem, razítko a Proč kalich stavy nemají, plátno ukazuje jejich varianty.

### Kontrola kontrastu

Skript `scripts/kontrast-d2.mjs` (vzorec relativního jasu z WCAG 2.1, po výpisu smazán) prošel 152 dvojic v obou režimech: **0 pod hranicí AA.**

- **Text (4,5 : 1)** na papíru, listu, ploše, malé ploše a lístku pro `--ink`, `--ink-2`, `--ruka` a `--ink-3`: den nejméně 5,1 : 1, noc nejméně 4,72 : 1 (`--ink-3` na lístku pojmu).
- **Inkousty období** na papíru, listu, ploše a lístku: den nejméně 5,1 : 1 (období 4 na papíru), noc nejméně 4,82 : 1 (období 1 na lístku).
- **Text na pruhu** `#FBF4EE` na papíru osmi období: nejméně 5,48 : 1 (období 4). Text na hlavním tlačítku 14,84 : 1 (den) a 14,09 : 1 (noc).
- **Hranice ovládání (3 : 1):** tužka den nejméně 3,24 : 1 (na papíru), noc 4,02 : 1; rámeček fokusu a hlavní tlačítko proti papíru přes 12 : 1; postup cesty v drážce nejméně 5,10 : 1.
- **Co výpočet nepokrývá a jak je to vyřešené:** stín v neumorfismu hranici neunese (u světlého papíru je pod 1,5 : 1). Proto žádný stav nestojí jen na stínu: zvolenou možnost nese kroužek, zvolený štítek tečka a tučný řez, zvolené tlačítko ✓, pole spodní linka, zakázaný prvek čárkovaný okraj, a tlačítka a lístky identifikuje jejich text. Tečky papíru, páska a perforace jsou ozdoba.

### Nad čím jsem váhal a co by šlo jinak

- **Neumorfismus a přístupnost.** Stín sám nestačí, proto má každý stav druhý znak (viz výš). Jinak by šel tenký obrys tužkou u všech vystouplých prvků: bezpečnější, ale papír by přestal vystupovat a vypadal by jako běžný formulář.
- **Štítek otázky je vtlačený, a přitom je to odkaz.** Je to jediná výjimka z pravidla „vtlačené = zvolené“. Schválené Spojení ho tak má (slepotisk z B) a odkaz ho odliší najetím a podtržením. Jinak: štítek plochý s obrysem tužkou, nebo vystouplý jako malé tlačítko.
- **Noční zápisník v teplé tmě**, ne modročerný: papír `#1D1B18`, list jen o stupeň světlejší (bílý list by v noci svítil). Pruh a páska jsou v noci stejný barevný papír, inkousty období se zesvětlí a fotka se ztlumí na 80 % jasu. Jinak by šly v noci tmavší papíry období; pruh by pak méně zářil, ale na papíru by se ztrácel lapis a pruská modř.
- **Popisky malými písmeny místo verzálkových nadtitulků.** Spojení už má „Cesta“ malými písmeny; nadtitulek verzálkami nad každým nadpisem je poznávací znak šablonových webů. Dotkne se mnoha komponent (K3 až K6), proto otázka 3.
- **Zakázáno = zploštělé s čárkovaným okrajem**, ne průhledné. Navazuje na dnešní „připravujeme“ v Kam dál a na pravidlo papíru (co nevystupuje, nejde zmáčknout) a zůstane čitelné.
- **Zvolená karta zapadne do papíru.** Šla by i přilepit páskou, ale páska už nese barvu období a citáty; dvojí význam by mátl.
- **Stupnice písma bez `display-1` a `display-2`.** Jméno má 104 px jako ve Spojení (dřív 148). Jestli velký display potřebuje stránka období nebo Domů, ukáže D4. Text na telefonu 18 px místo 19, jak to má krok cesty ve Spojení.
- **Přechod stínu není jen `transform` a `opacity`,** jak chce zásada pohybu 5. Na plátně se stín přepíná přechodem `box-shadow`; v kódu ho D3 a K1 mají udělat přes pseudoprvek s větším stínem, kterému se mění jen průhlednost.
- **Tinty období** (zpětná vazba Volby, Zkus to žít, karta týdne, kolečka v hodině) D2 nemění. V novém vzhledu by je mohl nahradit list s páskou v barvě období; potvrdí to obrazovky v D4.

## Co rozhodnout po D2

Prázdná odpověď znamená souhlas s doporučením.

1. **Štítek otázky vtlačený, i když je to odkaz** (výjimka z pravidla, jak je ve Spojení)? Doporučuji ano.
   Odpověď:

2. **Noční zápisník v teplé tmě, list jen o stupeň světlejší, pruh a páska stejné ve dne i v noci, fotka v noci ztlumená?** Doporučuji ano.
   Odpověď:

3. **Popisky malými písmeny místo verzálkových nadtitulků v celém atlasu?** Doporučuji ano.
   Odpověď:

4. **Zakázané prvky zploštělé s čárkovaným okrajem tužkou?** Doporučuji ano.
   Odpověď:

5. **Tinty období nahradit listem s páskou** (zpětná vazba Volby, Zkus to žít, karta týdne)? Doporučuji ano; D4 to ukáže na obrazovkách, než se rozhodne v kódu.
   Odpověď:

6. **Chceš něco změnit v barvách, stínech nebo písmu?** Napiš co a kde (třeba „páska světlejší“, „noc modřejší“, „pruh menší“). Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání D3: pohyb na plátně

Opus 5.5 · high. Pusť v novém chatu v Projektu Atlas filozofie, až vyplníš odpovědi po D2 (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok D3 větve design-v2, pohyb na plátně. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Pohyb, Po D2 a Co rozhodnout po D2 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti. Načti skill frontend-design. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti moje komentáře, project/canvas.json a z project/DesignSystem.dc.html jen <helmet> se styly (tokeny a prvky, ze kterých ukázky postavíš). Když odpovědi po D2 něco mění, oprav nejdřív design systém na plátně.

1. Na plátno přidej stránku Pohyb (den i noční zápisník jako u design systému): každý řádek katalogu z oddílu Pohyb jako živá ukázka, kterou spustí student (tlačítko Přehrát nebo opravdový čin: klepnutí, volba, odkrytí): přechod mezi stránkami jako list v deníku a fotka z karty v Lidech, která přeletí na desku profilu; další krok cesty doleva a zpátky doprava; příchod na profil (páska se jednou přilepí, titulek a pruh se usadí); najetí a stisk tlačítka, lístku a karty; Volba (vtlačení, tužka dokreslí kroužek, zpětná vazba se rozloží jako lístek); Odkryj (odklopení přeloženého papíru); Roztřiď (karta přeletí do koše); Spor (mince po škále); pojem (lístek se rozbalí ze slova, poznámka na okraji se zvýrazní); razítko v deníku po dokončené cestě; body lidí v Mapě a čase s rokem. U každé ukázky přepínač Omezený pohyb, který ukáže její klidový stav.

2. Tokeny pohybu: pojmenované délky a křivky (odezva na stisk asi 120 ms, rozložení lístku a odkrytí 200 až 300 ms, přechod mezi stránkami 350 až 450 ms, kamera mapy 600 ms) a u každé ukázky, které tokeny používá. Jen transform a opacity; stín najetí přes pseudoprvek, kterému se mění průhlednost, ne přechodem box-shadow. Nic se nehýbe samo kromě jednoho okamžiku při příchodu na stránku a kreseb.

3. Do plánu větve zapiš oddíl Po D3: tokeny pohybu jako tabulka, pravidla pohybu (kdy ano, kdy ne, omezený pohyb, Firefox bez přechodů mezi stránkami), nad čím jsi váhal a co by šlo jinak, otázky Co rozhodnout po D3 a zadání D4 v plném znění. docs/design.md nepřepisuj (to udělá krok O). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

4. Pak se zastav a napiš mi, na co se mám na plátně podívat.
```

## Po D3 (8. 11. 2026)

**Na plátně** pod design systémem přibyla řada „D3 Pohyb“ se dvěma stránkami: „Pohyb: den“ a „Pohyb: noční zápisník“ (`project/Pohyb.dc.html`, noc ji vkládá s režimem `noc`). Nahoře přepínače Den / Noční zápisník a Skutečná / Čtyřikrát pomaleji (zpomalí všechny délky, aby šel pohyb prohlédnout). Pak Délky a křivky s tlačítkem Přehrát délky, jedenáct živých ukázek a Pravidla. Každá ukázka má přepínač Omezený pohyb, tokeny, které používá, a větu o klidovém stavu. Titulek stránky sám ukazuje jediný povolený okamžik bez činu: při otevření se jednou usadí.

**Komentáře na plátně.** U Osmi období v design systému: první verze pásu (osm papírů, které na hranách plynule přecházely do sebe jako dnešní `PasObdobi`) se autorovi nelíbila. Pás je teď **osm odtrhávacích lístků**, každý na papíře svého období, a od souseda ho dělí perforace jako pahýl u lístku cesty: čárkovaná linka v `--na-papiru` na 55 % a dva výseky v barvě papíru stránky. Názvy období jsou v Newsreaderu, ne v Kalamu (autor: „ten font tam nepoužívejme“). Podle autora má pás „trochu prostorový look“: vystupuje z papíru (`--vyst`), každý lístek má světlo vlevo nahoře a stín vpravo dole a výseky perforace jsou vtlačené (`--vtla-mele`); text na nejsvětlejším místě lístku má nejméně 4,6 : 1 (období 4). Na autorovu otázku, jestli může mít každé období i svůj design mimo barvu („předtím měly i grafický design“), nese každý lístek nahoře ornament svého období jako slepotisk: stejná kresba jako v dnešním pásu (`src/lib/ornamenty.js`, meandr s amforou, mozaika s obloukem, gotická okna s růžicí, perspektiva, sluneční paprsky, ozubená kola, kruh s diagonálou, síť bodů), do ztracena k perforaci a s jemným reliéfem. Ve dne i v noci je pás stejný. U ukázky Mapa a čas chyběla mapa: podkladem je teď Egejské moře z Natural Earth (`world-atlas` 50m, `geoConicConformal` jako `src/lib/mapa.ts`), pevnina `--list` s obrysem tužkou, moře je tečkovaný papír. Odpovědi po D2 byly prázdné, takže platí všech šest doporučení.

### Tokeny pohybu

| Token | Hodnota | Křivka | Kde |
| --- | --- | --- | --- |
| `--d-stisk` | 120 ms | `--k-stisk` | najetí, stisk, vtlačení možnosti, zvýraznění poznámky na okraji, zvednutí vybrané karty |
| `--d-bod` | 180 ms | `--k-papir` | body lidí v Mapě a čase |
| `--d-listek` | 240 ms | `--k-papir`; `--k-dopad` u razítka a pásky | lístek zpětné vazby, lístek pojmu, razítko, páska |
| `--d-odkryti` | 280 ms | `--k-papir` | Odkryj |
| `--d-tah` | 300 ms | `--k-papir` | tužka dokreslí kroužek |
| `--d-presun` | 320 ms | `--k-papir` | karta do koše, mince po škále |
| `--d-list` | 400 ms | `--k-list` | přechod mezi stránkami, další krok, let fotky z karty na desku |
| `--d-prichod` | 420 ms, krok `--z-prichod` 80 ms | `--k-papir` | příchod na profil: titulek, pruh a dvě pásky po sobě, celé do 480 ms |
| `--d-kamera` | 600 ms | `--k-list` | kamera Mapy a času (beze změny) |

| Křivka | Hodnota | Povaha |
| --- | --- | --- |
| `--k-stisk` | `cubic-bezier(.25, .1, .25, 1)` | stav prvku; rychle se rozjede a je tam |
| `--k-papir` | `cubic-bezier(.22, .61, .36, 1)` | papír se rozkládá nebo pokládá: vyjede hned a dlouho dosedá, nikdy nepřestřelí |
| `--k-list` | `cubic-bezier(.65, 0, .35, 1)` | celý list a kamera: pomalu se zvedne, přejede, pomalu dosedne |
| `--k-dopad` | `cubic-bezier(.55, 0, 1, .45)` | razítko a páska: zrychlují k papíru a zastaví se naráz, bez odskoku |

**Ukázky a jejich tokeny:** mezi stránkami `--d-list`, `--k-list` (páska `--d-listek`, `--k-dopad`); další krok `--d-list`, `--k-list`; příchod `--d-prichod`, `--z-prichod`, `--k-papir`, pásky `--d-listek`, `--k-dopad`; najetí a stisk `--d-stisk`, `--k-stisk`; Volba `--d-stisk`, `--d-tah`, `--d-listek`, `--k-papir`; Odkryj `--d-odkryti`, `--k-papir`; Roztřiď `--d-presun`, `--k-papir`, `--d-stisk`; Spor `--d-presun`, `--k-papir`; pojem `--d-stisk`, `--k-stisk`, `--d-listek`, `--k-papir`; razítko `--d-listek`, `--k-dopad`; Mapa a čas `--d-bod`, `--k-papir`, `--d-kamera`, `--k-list`.

**Pro K1:** dnešní `--pohyb-rychle` (150 ms), `--pohyb` (250 ms) a `--pohyb-kamera` (600 ms) používá 25 souborů. K1 je nechá jako přezdívky (`--pohyb-rychle` = `--d-stisk`, `--pohyb` = `--d-listek`, `--pohyb-kamera` = `--d-kamera`), aby se nic nerozbilo; kroky K2 až K7 je při přepisu komponent nahradí novými jmény a O přezdívky smaže.

**Stín najetí bez přechodu `box-shadow`.** Prvek nese vtlačený stín (`--vtla-hl`, u zvoleného `--vtla`) a pod obsahem má dvě vrstvy: `::before` s plochou a stínem `--vyst` a `::after` jen se stínem `--zved`. Najetí rozsvítí `::after`, stisk zhasne obě a odkryje vtlačený stín, zvolení totéž s `--vtla`. Mění se jen `opacity` vrstev a `transform` prvku. Karta má totéž s `--lezi`, `--lezi-zved` a `--lezi-tlak`, poznámka na okraji s lístkem pod sebou.

### Pravidla pohybu

- **Kdy ano:** po činu studenta (stisk, volba, odkrytí, otevření pojmu, další krok, posun roku); jednou při příchodu na stránku s titulkem s pruhem nebo deskou s páskou; v kresbách, které pohyb mají v sobě.
- **Kdy ne:** oddíly při posouvání nevyjíždějí, nic nebliká, aby si toho student všiml, nic neodskakuje ani nepřestřelí. Pohyb nikdy neschovává obsah: text je čitelný i uprostřed přechodu a odpověď v Odkryj je v kódu od začátku.
- **Jen `transform` a `opacity`.** Jediná výjimka je tah tužky (`stroke-dashoffset` v malém SVG): kroužek ve Volbě a kresby.
- **Omezený pohyb:** při `prefers-reduced-motion` se nic nehýbe a každý stav je tam hned. Klidový stav ukazuje konec pohybu, ne začátek: kroužek celý, lístek rozložený, razítko otištěné, nová stránka hned. Kresby stojí a text pod nimi říká totéž.
- **Příchod na profil** jen při nové návštěvě (`pagereveal` s typem navigace jiným než návrat v historii), ne po tlačítku Zpět.
- **Přechody mezi stránkami** (`@view-transition { navigation: auto }`, typy `dalsi` a `zpet` z `navigation.activation` v `pagereveal`): Chrome a Edge od 126, Safari od 18.2. Firefox umí od verze 144 jen přechody v rámci jedné stránky, mezi dokumenty zatím ne; stránka se tam přepne bez animace jako dnes a nic nechybí. Fotka z karty na desku: `view-transition-name` jen na kliknuté kartě a cílové desce, nastavené těsně před přechodem (`pageswap`, `pagereveal`) a po něm zase odebrané.

### Nad čím jsem váhal a co by šlo jinak

- **List v deníku, nebo posun.** Stránka se otočí kolem levé hrany (`rotateY`, rub skrytý) a ztmavne, jak se odvrací od světla; nová leží pod ní. Je to nejvíc „deník“, ale na celé obrazovce telefonu může působit těžce. Jinak: nový list se položí shora s malým posunem a natočením a starý zprůhlední. Rozhodne otázka 1; K2 to vyzkouší na levném telefonu v revizi.
- **Devět délek místo čtyř ze zásad.** Každá má jednu práci a ukázka Délky ukazuje, že rostou s velikostí papíru. Šlo by i se čtyřmi (stisk, lístek, list, kamera) a zbytek odvodit, ale v kódu by se pak pod jedním jménem schovávaly různé věci.
- **Volba po sobě:** vtlačení, pak kroužek, a lístek, až je kroužek z půlky hotový. Celé trvá asi půl vteřiny. Šlo by všechno najednou (rychlejší, ale tři pohyby naráz se tříští).
- **Kroužek tužkou jako výjimka** z `transform` a `opacity`. Kreslí se jen kousek SVG o 40 × 38 px, takže výkon nebolí. Jinak: kroužek se objeví naráz s průhledností, ale pak by nebylo vidět, že ho „někdo nakreslil“.
- **Razítko a páska s `--k-dopad`** zrychlují a zastaví se naráz. Pružné doskočení by bylo živější, ale odporuje zásadě, že nic neodskakuje.
- **Mince se kutálí:** posune se a zároveň otočí o celé otáčky, takže na zastávce stojí rovně. Šlo by bez otáčení; kutálení ale říká, že mince je věc, ne ukazatel.
- **Odkryj: papír se odklopí a zmizí.** Zůstat přeložený nahoře nemůže, zakryl by otázku. Odkrytou odpověď zase přeloží Zase přeložit.
- **Mapa a čas:** lidé z Athén stojí ve sloupci vedle města, aby se jména nepřekrývala; skutečná Mapa a čas je rozkládá podle toho, kde kdo v roce byl. Celou obrazovku ukáže D4.
- **Pás období jako odtrhávací lístky** dělí období ostře, takže mezi nimi už není plynulý přechod jako dnes. Každý lístek nese ornament svého období, takže se období liší barvou i kresbou; ornament stojí nad názvem, ne za ním, aby kontrast názvu zůstal čistý.

## Co rozhodnout po D3

Prázdná odpověď znamená souhlas s doporučením. Autor 8. 11. 2026: k otázce 4 komentář na plátně, zbytek „může být“.

1. **Stránka se otočí jako list v deníku** (kolem levé hrany), fotka přeletí na desku? Doporučuji ano; když se ti otočení na telefonu nebude líbit, zbude položení listu shora.
   Odpověď: může být.

2. **Kroužek tužkou jako jediná výjimka z `transform` a `opacity`** (spolu s kresbami)? Doporučuji ano.
   Odpověď: může být.

3. **Příchod na profil jen při nové návštěvě, celé do 480 ms**, a nikde jinde nic samo? Doporučuji ano.
   Odpověď: může být.

4. **Pás období jako jeden pruh bez hranic** (podle tvého komentáře), ve dne i v noci stejný, na Domů a v Mapě a čase? Doporučuji ano; D4 ho ukáže na obrazovkách.
   Odpověď (komentář na plátně): „Toto se mi moc nelíbí, udělej to třeba jako ty oddělení u cesty a počtu kroků, kde to je jak odtrhávací lístek, a každá část bude mít svou barvu.“ Provedeno v design systému (viz Po D3).

5. **Chceš něco změnit v pohybu?** Napiš kterou ukázku a co (třeba „list rychleji“, „mince bez otáčení“, „razítko víc dopadne“). Bez odpovědi zůstává, jak je.
   Odpověď: může být; k ukázce Mapa a čas komentář na plátně („chybí ta mapa samotná“), mapa doplněna.

## Zadání D4: obrazovky na plátně

Opus 5.5 · high. Pusť v novém chatu v Projektu Atlas filozofie, až vyplníš odpovědi po D3 (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok D4 větve design-v2, obrazovky na plátně. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Vzhled: Spojení, Po D2 (jen Nad čím jsem váhal), Po D3, Co rozhodnout po D2 a Co rozhodnout po D3 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti. Načti skill frontend-design. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti moje komentáře, project/canvas.json, z project/DesignSystem.dc.html a project/Pohyb.dc.html jen <helmet> se styly a z project/Spojeni.dc.html a project/Spojeni-telefon.dc.html, co potřebuješ ke skladbě profilu a kroku cesty. Obsah obrazovek ber ze skutečných stránek atlasu (src/content, src/data), jen části, které obrazovka ukazuje. Když odpovědi po D3 nebo komentáře něco mění, oprav nejdřív design systém nebo stránku Pohyb na plátně.

1. Na plátno přidej obrazovky, každou na notebooku (1440) i telefonu (390), ve dne i v nočním zápisníku, postavené jen z tokenů a prvků design systému: Domů (s pásem období jako odtrhávacími lístky), Mapa a čas (podklad mapy, karta člověka, posuvník, body lidí), profil Sókrata (celá hlavička, kapitola, citát, Doba a lidé, Kam dál), krok cesty s Volbou a zpětnou vazbou, stránka velké otázky s osou hlasů, stránka období v jiné barvě (Helenismus a Řím), Můj deník s razítkem a jedna kresba v novém papíru. Pohyb, který na obrazovce je (přechod, příchod, volba), ať jde spustit jako na stránce Pohyb, s Omezeným pohybem. Tinty období nahraď listem s páskou, kde to obrazovka potřebuje (otázka 5 po D2), a ukaž, jestli stránka období nebo Domů potřebuje větší display než jmeno 104 px.

2. Kontrast nových dvojic barev ověř výpočtem (krátký skript v scripts/, po výpisu ho smaž). Telefon: dotykové cíle aspoň 44 × 44, nic nepřetéká do stran.

3. Do plánu větve zapiš oddíl Po D4: co je na kterých obrazovkách, co se proti design systému změnilo, nad čím jsi váhal a co by šlo jinak, otázky Co rozhodnout po D4 (mezi nimi schválení návrhu jako brána před kódem) a zadání K1 v plném znění. docs/design.md nepřepisuj (to udělá krok O). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

4. Pak se zastav a napiš mi, na co se mám na plátně podívat.
```

## Po D4 (8. 11. 2026)

**Na plátně** pod Pohybem přibyla řada „D4 Obrazovky“: osm obrazovek, každá ve čtyřech artboardech (notebook 1440 ve dne, notebook v nočním zápisníku, telefon 390 ve dne, telefon v noci). Den na notebooku je komponenta (`project/<Obrazovka>.dc.html`), ostatní tři ji vkládají s režimem `noc`; telefon je táž stránka v úzkém rámu (rozvržení přes container queries, jako to bude v kódu). Nahoře na každé obrazovce je pult **Náhled pohybu** s čárkovanou hranou, který k obrazovce nepatří: spouští pohyb, který obrazovka má, a přepíná Omezený pohyb a Čtyřikrát pomaleji jako stránka Pohyb. Domů a Období mají v panelu vlastností přepínač `titulek` 104 / 148 px. Obsah je ze skutečných stránek (`src/content`, `src/data`), mapy z Natural Earth (`world-atlas`, `geoConicConformal` jako `src/lib/mapa.ts`).

**Komentáře autora během D4:** medailonky (kolečka s písmenem) se nelíbily, autor zvolil razítko s ikonou a pak poštovní razítko se jménem po obvodu; mapa života v profilu má mít šipky a oblouky místo rovných čar. Po prohlídce (8. 11. odpoledne): štítky otázek v hlavičce profilu se nelíbily, autor zvolil záložky v deníku; mapa v Mapě a čase má vypadat jako mapa; v pásu období mají ornamenty zapadnout přirozeněji a mezi lístky má být perforace z teček; vykrojení na okrajích má zůstat, ale jako skutečný výsek v papíře, ne kolečko navrch, které přesahovalo ven; jména na mapě mají lépe sednout do mapy; trasy na mapě v profilu mají vypadat nakreslené rukou a mapa nesmí přesahovat rámeček; kresby (JS animace) mají dostat týž scrapbookový vzhled. Všechno provedeno, pás i v design systému.

### Co je na kterých obrazovkách

- **Domů** (`Domu`): titulek na vytrženém listu „Velké otázky mají dlouhé dějiny.“ s pruhem „Filozofie od Thaléta po dnešek.“, perex, hlavní tlačítko Začít první cestu s údajem a tiché Poznat Sókrata; první cesta jako velký lístek s pahýlem (7 kroků, asi 14 min) a razítky Sókrata a Prótagora; Osm období jako pás odtrhávacích lístků s ornamenty (na telefonu svisle, perforace vodorovně), lístky 3 až 8 bez odkazu s „připravujeme“; tři vstupy jako karty; Na začátek. Pohyb: příchod (titulek, pruh).
- **Mapa a čas** (`MapaCas`): malý pás období (zvolené období vtlačené, na telefonu vodorovně posuvný), Egejské moře jako vystřižená stará mapa přilepená páskou (moře šrafované tužkou, vodní linky podél pobřeží, pevnina na lístkovém papíře, rámeček se stupnicí, názvy moří kurzívou a krajů prostrkaně, větrná růžice, měřítko 100 km), lidé roku 424 př. n. l. na přišpendlených lístečcích u Athén, Délia a Abdéry, posuvník 560 až 300 př. n. l. s drážkou a jezdcem jako razítko, věta „žije 8 lidí z atlasu“, karta člověka na listu s páskou (razítko, kdo, proč, rámeček V roce…, Život na mapě se zastávkami, Předchozí a Další, Otevřít stránku). Pohyb: lístečky se při posunu roku objeví a zmizí, rozvinou se po klepnutí (`--d-listek`), karta se vymění při výběru člověka.
- **Profil Sókrata** (`ProfilSokrates`): celá hlavička (razítko místa, titulek, pruh, dva lístky cest, tři záložky velkých otázek, deska s bustou a dvěma páskami, Proč kalich, popisek), úvod, velký citát, kapitola 01 s pojmem „Delfy“ (poznámka na okraji na notebooku, lístek po klepnutí na telefonu) a blokem Nejdřív sám (srovnání se rozloží jako lístek), Doba a lidé (Současníci na ose, Kde žil: tři tažení obloukem se šipkou a rokem, Žáci a Znali se s razítky), Zkus to žít na listu s páskou, Kam dál. Pohyb: přechod z Lidí (list se otočí kolem levé hrany) a příchod (titulek, pruh, dvě pásky).
- **Krok cesty** (`KrokCesty`): cesta 1, krok 2. Lišta cesty s drážkou postupu, titulek kroku na listu, „kde jsme“ rukou, Volba se čtyřmi možnostmi z `cesta1-jak-zjistit`, Proč právě tohle, Tohle je můj tah (zakázané, dokud nevybereš), zpětná vazba jako lístek s páskou a pod ní Co udělal Sókratés; Další krok posune list na krok 3. Telefon: horní lišta (zpět, postup, Odejít) a spodní lišta Předchozí a Další krok. Pohyb: vtlačení, kroužek tužkou, rozložení lístku, posun kroku.
- **Velká otázka 1** (`VelkaOtazka`): titulek „Jak mám žít?“ s pruhem bez období „Pět odpovědí na jedno léto.“, případ Sklad, nebo tábor? na listu, pět hlasů, osa Kdy žili (razítka v polovině života ve dvou řadách, na telefonu ve čtyřech, pruhy životů, zlom, dnes), Kdo z nich je ti nejblíž? (razítko se na ose zvýrazní, u dneška se objeví Ty, věty z `vetyPoVolbe` na lístku), Cesty k otázce.
- **Období 2** (`ObdobiHelenismus`): místo razítka odtržený lístek období 2 z pásu (ornament mozaika a oblouk), titulek a pruh v tyrském purpuru, deska s mapou Středomoří roku 161 n. l., Příběh Tři filozofové v senátu, Otázky doby (pět, s lístky cest), Lidé a směry (štítky směrů, osm lidí s razítky). Pohyb: příchod.
- **Můj deník** (`MujDenik`): titulek a pruh bez období, Rozpracované, záznam cesty 1 s razítkem Cesta prošlá, Na začátku × Teď, odpovědi z kroků, Návrat (Zpráva před čtvrtletkou) na lístku s páskou, stanovisko, přijatá výzva s Označit jako hotové, deník v souboru. Pohyb: razítko dopadne (`--k-dopad`).
- **Kresba** (`KresbaVitr`): Stejný vítr v kapitole 01 Prótagora jako koláž: plátno je tečkovaný papír s linkou, zem natržený pruh papíru, postavy vystřižené z listu se stínem výstřižku (bez obrysu), šála z papíru období, repliky na lístečcích přilepených páskou, mráček z papíru, který se zvolna posouvá, vítr jako tečkované stopy tužkou, po kterých poryvem přeletí tah, papírové listí unášené větrem a postava, které je zima, se třese, přepínače čekání a chůze ve vtlačené drážce, Zastavit pohyb; s Omezeným pohybem kresba stojí a text pod ní říká totéž.

### Co se proti design systému změnilo

- **Poštovní razítko člověka místo mince** (autor 8. 11.: medailonky s písmenem a pak prosté kruhové razítko „nejsou v topu“, zvolil poštovní razítko). Dva soustředné kruhy v inkoustu období, po obvodu nahoře jméno a dole roky (Instrument Sans), mezi nimi dvě tečky, uprostřed atribut z dat (`atribut.ikona`); kdo atribut nemá, má uprostřed razítkové vlnovky. Inkoust je trochu nedotištěný (SVG filtr se šumem), bez stínu, každé razítko natočené jinak (−14° až +12° podle id). Velikost `--mv`: 72 px v Doba a lidé, 78 na kartě v Mapě a čase, 64 u hlasů a lidí období, 56 na ose; pod 48 px (osa na telefonu, tlačítka volby) obvod mizí a zůstane kruh s atributem. Ikony jsou na plátně nakreslené nově; v kódu je K3 sjednotí se spritem atlasu.
- **Záložky velkých otázek místo štítků** (v hlavičce profilu): papírové záložky v barvě období zastrčené pod okrajem listu, každá trochu jinak vysoko, nahoře rukou „otázka 7“, pod tím znění; po najetí se povytáhnou (`--d-stisk`). Na telefonu vyčnívají zleva pod sebou z listu vpravo. Záložka je i v deníku (otázka, ke které ses ještě nevrátil). Štítky směrů a Otázky doby na stránce období zatím zůstávají (otázka 10).
- **Lidé na mapě** nemají na mapě jména (autor: „pořád vypadají agresivně“), mapa drží vzhled opravdové mapy na nástěnce: každé místo je lísteček (post-it, `--listek`, horní lepicí proužek, natočený podle místa) přišpendlený špendlíkem v papíru období přesně na místo; na lístečku rukou název a počet lidí. Klepnutí lísteček rozvine a pod názvem jsou jména rukou; vybraný člověk je podtržený barvou období. Na notebooku je lísteček vybraného člověka otevřený, na telefonu jsou všechny zavřené (cíle 44 px). Trasy v mini mapě profilu jsou ručně kreslené (rozechvělá čára se slabším druhým tahem a nesouměrná šipka). Všechno na mapě je oříznuté vnitřním rámečkem.
- **Mapa jako výstřižek:** Mapa a čas, mini mapa v profilu a mapa na desce období jsou vystřižená stará mapa: moře šrafované tužkou, tři vodní linky podél pobřeží, pevnina `--listek` s obrysem `--ink-2`, dvojitý rámeček se stupnicí; v Mapě a čase páska, názvy moří a krajů, větrná růžice a měřítko. Jen tokeny, ve dne i v noci.
- **Pruh bez období:** stránky, které nepatří jednomu období (velká otázka, Můj deník), mají pruh v inkoustu (`--ink`, text `--na-inkoustu`).
- **Odtržený lístek období** na stránce období místo razítka místa: týž lístek jako v pásu na Domů, s ornamentem a perforací.
- **Tinty období nahradil lístek s páskou** (otázka 5 po D2): zpětná vazba Volby, věty po volbě na ose hlasů, Návrat, srovnání v Nejdřív sám; Zkus to žít je list s páskou. Karta týdne a kolečka v hodině na obrazovkách nejsou; navrhuji totéž.
- **Plátna nejsou vtlačená.** Mapa, mini mapa a kresba jsou tečkovaný papír s tenkou linkou; vtlačené zůstává jen zvolené a aktivní.
- **Pás období:** výseky nahoře a dole i perforace mezi nimi jsou opravdu vykrojené (maska na každém lístku, polovina výseku a každé dírky na každé straně hranice, takže sedí na střed); stín pásu je `drop-shadow` celého pásu, takže jde i do výseků a dírek. Po najetí se lístek u perforace natrhne: pootočí se kolem horní hrany a klesne o pár px (`--d-listek`, `--k-papir`), na telefonu se vysune do strany; ornament jde přes celou šířku lístku a do ztracena dolů k názvu, takže sousední ornamenty na sebe navazují (opraveno i v design systému). Na telefonu svisle; malý pás v Mapě a čase se zvoleným obdobím vtlačeným; lístky bez stránky nesou „připravujeme“ a po najetí se nezvednou.
- **Navigace:** odkazy v záhlaví i spodní lišta telefonu jsou ploché, aktivní je vtlačený (jako ve Spojení); vystupuje jen Můj deník. Autor 8. 11. chtěl, aby název seděl ke zbytku a nerušil, a zvolil nový úderný název **Agora** (athénské tržiště, kde se Sókratés ptal lidí); jak daleko přejmenování sahá, je otázka 11. Logo je koláž bez piktogramu: pět písmen A-g-o-r-a, každé na vlastním vytrženém útržku papíru (`--list` a `--listek`, Newsreader 23 px), mírně natočených a přes sebe; velké A je o kus větší a nese barvu období, ve kterém student je (papír `--pp`, text `--na-papiru`: purpur na stránce Helenismu, terakota v profilu Sókrata, v kroku cesty 1, v Mapě a čase roku 424 př. n. l.); na stránkách bez období (Domů, velká otázka, Můj deník) je v inkoustu (`--ink`, text `--na-inkoustu`) jako pruh bez období. V kódu ho K2 vezme z období stránky. Celek má jeden společný měkký stín, po najetí se písmena srovnají do řady (`--d-stisk`, respektuje Omezený pohyb). Na telefonu 19 px. Odkaz má popisek „Agora, domů“, jednotlivá písmena čtečka nečte.
- **Lístek se rozkládá při vložení** (`@keyframes` s `rotateX`, `--d-listek`, `--k-papir`), takže v kódu nemusí čekat schovaný v rozvržení.
- **Display:** 104 px stačí. Na Domů láme 148 px větu do tří řádků a přebije pás období; jméno období drží 104 px jako jméno člověka. `display-1` ani `display-2` nepřidávám.

- **Kresby jako koláž** (pravidla pro K7 a všech 13 kreseb): plátno je tečkovaný papír přilepený na list; postavy a předměty jsou výstřižky (`--list`, `--listek`, papír období `--pp`) se stínem výstřižku, bez obrysových čar; zem a horizont natržený pruh papíru; směr, pohyb a síly (vítr, šipky, paprsky) tužkou (`--tuzka`, čárkovaně); barva období jen na jednom nositeli významu; text v kresbě na lístečku s páskou Kalamem, popisky Instrument Sans; v noci tytéž tokeny. Pohyb jen `transform`, `opacity` a tah tužky; s Omezeným pohybem kresba stojí a text pod ní říká totéž.

### Kontrola

- **Kontrast** 19 nových dvojic ve dne i v noci výpočtem (`scripts/kontrast-d4.mjs`, po výpisu smazaný): všechny projdou. Nejnižší text 4,72 : 1 (popisek na lístku v noci), nejnižší netextový prvek 3,24 : 1 (vítr tužkou na papíru ve dne).
- **Telefon a notebook:** zdroje obrazovek jsem vykreslil v Chrome na 390 a 1440 px ve dne i v noci (vlastním jednoduchým během komponent, bez písem z Google, ne v editoru plátna). Nic nepřetéká do stran; všechny dotykové cíle mají aspoň 44 × 44 px kromě pojmu v řádku textu („z Delf“ 42 × 27), který má plochu klepnutí zvětšenou neviditelným okrajem (výjimka pro odkaz v textu). Výšky artboardů jsou podle změřené výšky s rezervou na otevřené lístky.

### Nad čím jsem váhal a co by šlo jinak

- **Pult náhledu přímo nad obrazovkou.** Ovládání pohybu je vidět u obrazovky, kterou spouští, a čárkovaná hrana ho odděluje. Jinak: obrazovky čisté a ovládání v samostatném artboardu, ale pak by se pohyb spouštěl daleko od místa, kde se děje.
- **Poštovní razítko** nese jméno a roky po obvodu, takže je čitelné i samo; vedle jména v seznamu je to zdvojení, ale razítko pak funguje i tam, kde jméno vedle není (osa hlasů). Text po obvodu je od 56 px dolů drobný (asi 6 px), proto pod 48 px mizí. Jinak: razítko bez textu, jen dva kruhy a atribut, menší a klidnější. Ikony jsou jednoduché tahy (kalich, jeskyně, váhy, lucerna, přesýpací hodiny, vavřín…); lidé bez atributu mají vlnovky jako na poštovním razítku.
- **Lístky období bez stránky** vypadají jako ostatní, protože pás je jeden předmět. Jinak: zploštit je a dát čárkovaný okraj jako zakázaným prvkům; pás by pak vypadal rozbitý.
- **Krok cesty na notebooku** má záhlaví webu i lištu cesty. Jinak: jen lišta cesty, víc soustředění, ale z kroku by nebylo vidět, kde v atlasu student je.
- **Lidé v Mapě a čase na lístečcích:** jména se nepřekrývají a mapa zůstane čistá, ale kdo kde je, uvidí student až po klepnutí. Jinak: rozklikávací tabulka vedle mapy, přehlednější, ale mapa by pak nenesla lidi.
- **Osa hlasů** skládá razítka do řad, aby se nepřekrývala (Diogenés a Aristotelés žili skoro současně). Jinak: jedna řada a razítka menší.
- **Přechod v profilu** ukazuje otočení listu a příchod; let fotky z karty na desku je jen na stránce Pohyb, protože na obrazovce není karta, ze které by vyletěla.

## Co rozhodnout po D4

Prázdná odpověď znamená souhlas s doporučením. Jen u otázky 9 potřebuji výslovnou odpověď.

1. **Poštovní razítko s atributem místo mince v celém atlasu** (Lidé, Mapa a čas, osa hlasů, Doba a lidé, karta týdne, příprava hodiny)? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

2. **Pruh bez období v inkoustu** na stránkách, které nepatří jednomu období (otázka, deník, Otázky, Lidé)? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

3. **Odtržený lístek období** v hlavičce stránky období místo razítka? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

4. **Lístek s páskou místo tint i u karty týdne a koleček v přípravě hodiny?** Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

5. **Bez většího displeje:** titulky na Domů i na stránce období 104 px jako jméno člověka? Doporučuji ano (přepínač `titulek` na plátně ukáže 148 px).
   Odpověď: (prázdná, souhlas s doporučením)

6. **Pás období na telefonu svisle na Domů a vodorovně posuvný v Mapě a čase?** Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

7. **Krok cesty na notebooku se záhlavím webu nad lištou cesty?** Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

8. **Chceš něco změnit na obrazovkách?** Napiš kterou a co (nebo komentář na plátně). Bez odpovědi zůstává, jak je.
   Odpověď: (prázdná, souhlas s doporučením)

9. **Brána: schvaluješ návrh na plátně (design systém, pohyb a obrazovky) jako podklad pro kód?** Bez výslovného „ano“ K1 nezačne.
   Odpověď: ano (8. 11. 2026)

10. **Záložky i jinde místo vtlačených štítků** (Otázky doby na stránce období, štítky směrů)? Doporučuji ano u otázek, štítky směrů nechat vtlačené.
   Odpověď: (prázdná, souhlas s doporučením)

11. **Jak daleko sahá nový název Agora?** Doporučuji: záhlaví, titulek stránek v prohlížeči, popis pro sdílení, úvodní věta na Domů a README; repozitář, adresa webu a soubory v `docs/` zůstávají, jak jsou (o přejmenování adresy rozhodneš zvlášť). V textech pro studenty zůstává „atlas“ tam, kde mluví o tom, jak se v něm pohybovat.
   Odpověď: (prázdná, souhlas s doporučením)

## Zadání K1: základ v kódu

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po D4 a schválíš bránu (otázka 9).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K1 větve design-v2, základ nového vzhledu v kódu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co se proti design systému změnilo) a Co rozhodnout po D4 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. Když otázka 9 (brána) nemá „ano“, zastav se a napiš mi to. docs/design.md nečti celý, jen nadpisy a oddíl o tokenech. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/DesignSystem.dc.html a project/Domu.dc.html jen <helmet> se styly: to je zdroj hodnot tokenů (den a noc), stínů, pásky, razítka, titulku s pruhem, razítka člověka a tokenů pohybu. Když odpovědi po D4 něco mění, oprav nejdřív plátno.

1. src/styles/tokens.css: nové tokeny papíru, ploch, inkoustů a tužky pro den a noční zápisník (noc přes dnešní přepínač režimu i prefers-color-scheme, jak to atlas dělá teď), osm období (--p a papír pruhu --pp, v noci zesvětlené inkousty), stíny (--vyst, --vyst-m, --zved, --vtla, --vtla-mele, --vtla-hl, --vyst-ink, --zved-ink, --vtla-ink, --lezi, --lezi-zved, --lezi-tlak, --odlep), páska (--paska-a, --paska-b), filtr fotky (--foto), stupnice písma z D2 (jméno 104 px, na telefonu 56 px, text 21 a 18 px), zaoblení a mezery z D2, tokeny pohybu (--d-stisk až --d-kamera, --z-prichod, --k-stisk, --k-papir, --k-list, --k-dopad). Dnešní jména tokenů, která komponenty používají, nech jako přezdívky na nové hodnoty, aby se nic nerozbilo (barvy i --pohyb-rychle = --d-stisk, --pohyb = --d-listek, --pohyb-kamera = --d-kamera); co přezdívka nepokryje, zapiš do plánu jako práci pro K2 až K7.

2. src/styles/global.css: tečkovaný papír jen v CSS (radial-gradient), vytržený okraj (clip-path), třídy pro list, pásku, razítko místa, titulek s pruhem, razítko člověka (atribut v kruhu podle Po D4), lístek s páskou místo tint období, vrstvy stínu pro najetí a stisk bez přechodu box-shadow (::before a ::after, mění se jen opacity a transform), pravidlo zakázaného prvku (zploštělé s čárkovaným okrajem tužkou), viditelný fokus, a omezený pohyb (prefers-reduced-motion: žádný přechod ani animace, stav hned na konci). Klíčové snímky rozložení lístku (rotateX) a dopadu razítka.

3. Písma: Kalam lokálně (@fontsource/kalam, podmnožiny latin a latin-ext, řezy 400 a 700) vedle Newsreaderu a Instrument Sans; ověř, že se načtou česká písmena. Nic z externích serverů za běhu.

4. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro testy rozvržení a snímků, které se tokeny změní), node scripts/snimky-listy.mjs na Domů, profil Sókrata a krok cesty 1/2 na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž). Snímky, které se mění kvůli novému vzhledu, aktualizuj a v plánu napiš které. Restartuj náhled npm run dev.

5. Do plánu větve zapiš oddíl Po K1: co je v tokens.css a global.css, které přezdívky zůstaly a pro který krok, co se na webu změnilo už teď a co čeká na K2 až K7, nad čím jsi váhal, otázky Co rozhodnout po K1 a zadání K2 v plném znění. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

6. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Po K1 (8. 11. 2026)

Odpovědi po D4: otázka 9 (brána) „ano“, ostatní prázdné, takže platí doporučení. Plátno se kvůli nim neměnilo: všechny potvrzují stav, který na něm je (otázky 4 a 10 se týkají K4 a K6).

### Co je v `tokens.css`

- **Papír, plochy, inkousty a tužka** pro den a noční zápisník podle `<helmet>` design systému (`--papir`, `--tecka`, `--list`, `--plocha`, `--plocha-m`, `--listek`, `--linka`, `--tuzka`, `--ink`, `--ink-2`, `--ruka`, `--ink-3`, `--na-inkoustu`, `--na-papiru`). Noc běží jako dřív: podle systému (`prefers-color-scheme`, když student nezvolil den) a ručně přes `data-theme` z přepínače režimu.
- **Osm období:** inkoust `--p-1` až `--p-8` (v noci zesvětlený) a papír `--pp-1` až `--pp-8` (ve dne i v noci stejný). Hodnoty jsou tytéž jako dosud, jen pod novým jménem. Podstromu je nastaví třída `.obdobi-N` (`--p`, `--pp`, `--na-pp`), bez třídy nebo s `.bez-obdobi` je pruh i páska v inkoustu.
- **Stíny** `--vyst`, `--vyst-m`, `--zved`, `--vtla`, `--vtla-mele`, `--vtla-hl`, `--vyst-ink`, `--zved-ink`, `--vtla-ink`, `--lezi`, `--lezi-zved`, `--lezi-tlak`, filtr `--odlep`, a navíc z obrazovek D4 `--deska` (rám fotky), `--pas-stin` (pás období) a `--lista-stin` (spodní lišta telefonu). V tisku jsou všechny stíny `none`.
- **Páska** `--paska-a`, `--paska-b` a tvar `--paska-tvar`, **vytržený okraj** `--trh`, **filtr fotky** `--foto`, krok teček `--tecky-krok` (22 px, na telefonu 20 px).
- **Písma:** `--font-ruka` (Kalam) a stupnice z D2: `--fs-jmeno` 104 / 56 px, `--fs-h1` 64 / 40, `--fs-h2` 44 / 30, `--fs-h3` 30 / 24, `--fs-citat` 31 / 23, `--fs-perex` 23 / 19, `--fs-text` 21 / 18, `--fs-ruka-l` 40 / 26, `--fs-ruka` 19 / 17, ovládání a popisky beze změny.
- **Zaoblení** `--r-papir` 0, `--r-razitko` 3, `--r-ovladani` 10, `--r-plne` 999; **okraj stránky** 16 px na telefonu, 48 px na notebooku (dřív 80); mezery beze změny.
- **Pohyb:** `--d-stisk` 120 ms až `--d-kamera` 600 ms, `--z-prichod` 80 ms, křivky `--k-stisk`, `--k-papir`, `--k-list`, `--k-dopad`. Při omezeném pohybu jsou všechny délky 0.

### Co je v `global.css`

- **Tečkovaný papír** na `body` jen v CSS (`radial-gradient`, tečka 1,1 px), třída `.papir` pro plochy uvnitř stránky (plátno mapy, kresby).
- **Vytržený okraj** `.trh` (clip-path) a `.odlep` (stín, který sleduje zubatý okraj; patří obalu).
- **Třídy papíru:** `.papirovy-list` (ležící list), `.paska` s polohami `--nahore`, `--vlevo`, `--vpravo` a menší `--mala`, `.razitko-mista`, titulek s pruhem `.titulek` › `.titulek__list` › `.titulek__jmeno` a `.titulek-pruh` › `.titulek-pruh__papir` (Kalam 700 v papíru období), `.razitko-cloveka` (velikost `--mv`, natočení `--rr`, části SVG `.rz-k`, `.rz-b`, `.rz-ik`, `.rz-t`, `.rz-r`, pod 48 px `--bez-obvodu`), `.listek-paska` (lístek místo tinty období).
- **Vrstvy stínu bez přechodu `box-shadow`:** `.vystouple` (varianty `--m` a `--ink` pro hlavní tlačítko) a `.lezi-odkaz` (karta). Prvek nese vtlačený stín, `::before` plochu se stínem vystouplého, `::after` stín zvednutého; najetí, stisk a zvolení (`aria-pressed`, `aria-current`, `aria-selected`) mění jen `opacity` vrstev a `transform`.
- **Zakázaný prvek** (`.zakazane`, `:disabled`, `aria-disabled`): bez stínu a vrstev, čárkovaný okraj tužkou, text `--ink-3`. **Fokus** z klávesnice zůstává rámeček 2 px v inkoustu, i u zakázaného a na plném inkoustu.
- **Klíčové snímky:** `listek-rozlozit` (třída `.rozlozit`: `rotateX` od horní hrany, `--d-listek`, `--k-papir`) a `razitko-dopad` (třída `.dopad`: z 1,35 na 1, `--k-dopad`, bez odskoku).
- **Omezený pohyb:** přechody a animace trvají 0,01 ms a zpoždění se ruší, takže stav je hned na konci; `.rozlozit` a `.dopad` nemají animaci vůbec.
- **Kalam** lokálně z `@fontsource/kalam` (latin a latin-ext, 400 a 700) v `Pisma.astro`, bez přednačtení, protože ho zatím žádná stránka nepoužívá. Ověřeno vykreslením: obě podmnožiny i oba řezy se načtou, česká písmena včetně ď, ť, ů a Ů jsou v Kalamu, žádný požadavek mimo web (`Claude outputs/snimky/design-v2-k1/kalam-cestina.png`).

### Přezdívky: co zůstalo a pro který krok

| Staré jméno | Ukazuje na | Kdo ho používá | Nahradí |
| --- | --- | --- | --- |
| `--paper` | `--papir` | 35 míst: deník, mapa, kresby, bloky; ✓ rám (K2), ✓ stránky osob (K3) | K4 až K7 podle komponenty |
| `--surface` | `--list` | 73 míst: bloky, karty, lišty cesty; ✓ rám (K2), ✓ stránky osob (K3; zbývá bod mini mapy, K7) | K4 (bloky), K5, K6, K7 |
| `--sunk` | papír smíchaný s linkou (`color-mix`) | 22 míst: přepínače, najetí, podklady; ✓ rám (K2: hledání, lišta hodiny) | K4 a K7 (vtlačené místo barvy) |
| `--rule` | `--linka` | 115 míst; ✓ rám (K2), ✓ stránky osob (K3; zbývá mini osa, K7) | K4 až K7; kde je linka jedinou hranicí ovládání, přejde na stín nebo tužku |
| `--muted` | stará hodnota `#6B6154` / `#A69B8A` | 89 míst; ✓ rám (K2), ✓ stránky osob (K3; zbývá mini osa, K7) | K3 až K7; nový `--ink-3` je o odstín světlejší a na tintě období 2 by měl 4,47 : 1, proto přezdívka drží starou hodnotu, dokud tinty nezmizí |
| `--period-N` | `--p-N` | 10 míst: přiřazení `.obdobi-N` v `global.css`, deník, Domů; ✓ stránky osob (K3, nepoužívaly ho) | K6, K7 |
| `--pc`, `--pc-tint`, `--pc-soft`, `--pc-plate`, `--pc-on-plate` (třída `.obdobi-N`) | staré tinty a desky | 359 míst (`--pc` 257, tint 55, soft 28, plate 10, on-plate 9); ✓ desky (K3: deska je list s páskami, `--pc-plate` už jen kresby v `global.css` a hlavička stránky období přes `--period-N-plate`), ✓ stránky osob mimo mini mapu a mini osu (K7) | K4 (tinty ve zpětné vazbě, Mince v blocích), K6 (hlavička období), K7 (kresby, mini mapa, mini osa) |
| `--period-N-tint`, `-soft`, `-plate`, `-on-plate` | dnešní hodnoty | přes `--pc-*` | K3 až K7, pak smazat |
| `--fs-display-1`, `--fs-display-2` | `--fs-jmeno` | jen třídy `.t-display-*` v `global.css`; ✓ stránky osob (K3: titulek s pruhem), žádná komponenta je už nepoužívá | O je smaže i s třídami (K6 je nepotřebuje) |
| `--r-xs`, `--r-sm`, `--r-md`, `--r-lg`, `--r-full` | `--r-razitko`, `--r-ovladani`, `--r-plne` | 132 míst; ✓ rám (K2); `--r-lg` už nepoužívá nikdo | K3 až K7, `--r-lg` smaže O |
| `--stin-mapa`, `--stin-list` | `--lezi`, `--lista-stin` | 8 míst: mapa a Mapa a čas; ✓ rám (K2: hledání) | K7 |
| `--pohyb-rychle`, `--pohyb`, `--pohyb-kamera` | `--d-stisk`, `--d-listek`, `--d-kamera` | 117 výskytů (počítáno i s `var(--pohyb…)` v hodnotách); ✓ stránky osob (K3: vstupy, obsah profilu) | K4 až K7 |
| `--map-*` | beze změny | mapa a mini mapa | K7 (mapa jako výstřižek) |

**Co přezdívka nepokryje (práce pro K2 až K7):**

- ~~**K2:** hlavička a spodní lišta mají plné pozadí `--paper` bez stínu; logo Agora, vtlačená aktivní položka, vystouplý Můj deník a hledání ve vtlačené drážce chybí.~~ Hotovo v K2 (oddíl Po K2).
- ~~**K3:** desky s fotkou jsou dál v duotónu období (`--pc-plate`), ne na listu s páskami a filtrem `--foto`; jméno není na vytrženém listu s pruhem; mince místo razítka člověka.~~ Hotovo v K3 (oddíl Po K3).
- **K4:** bloky jsou plochá karta `--surface` s linkou a zaoblením 10 px; hlavní tlačítko je plný inkoust bez `--vyst-ink`; možnosti Volby nejsou vystouplé; zpětná vazba je tinta, ne `.listek-paska` s `.rozlozit`; pole na psaní nejsou v Kalamu.
- **K5:** lišta cesty a drážka postupu jsou ploché; lístek cesty nemá pahýl.
- **K6:** pás období je dnešní plynulý pruh, ne odtrhávací lístky; štítky otázek, karta týdne a kolečka hodiny jsou tinty.
- **K7:** mapa má moře a pevninu z `--map-*`, ne výstřižek staré mapy; kresby berou tři tóny z desky (`--pc-plate`, `--pc-on-plate`), ne koláž z papíru.

### Co se na webu změnilo už teď

Každá stránka leží na tečkovaném papíře v nových barvách: papír je chladnější a šedší (`#EFEDE6` místo `#F4EFE6`), noc je noční zápisník (`#1D1B18`). Inkoust je o odstín teplejší. Nadpisy h2, h3 a citát jsou o kus menší, text na telefonu má 18 px. Okraj stránky na notebooku je 48 px místo 80, takže obsah je širší. Tlačítka a bloky mají zaoblení 10 px místo 8 a 14. Najetí je rychlejší (120 ms místo 150) a při omezeném pohybu se ruší i zpoždění. Rozvržení, komponenty a texty zůstávají, jak byly; stránky se nerozbily (snímky níž).

### Testy a kontrola

- `npm run build` prošel. Kontrola typů (`astro check`) bez chyb, Vitest: 1 121 testů prošlo. `tests/data/kontrast.test.ts` hlídá nově 234 dvojic ve dne i v noci: čtyři inkousty na papíru, listu, ploše a lístku, tužka jako hranice 3 : 1, text na hlavním tlačítku, inkoust období na papíru, listu a lístku, text na pruhu všech osmi období, razítko místa s průhledností, a do K7 staré tinty a desky.
- Kontrast nových dvojic jsem spočítal i jednorázovým skriptem (`scripts/kontrast-k1.mjs`, po výpisu smazaný): nejnižší text ve dne 4,71 : 1 (razítko místa období 4 na papíře), v noci 4,58 : 1 (razítko místa období 1 na lístku); nejnižší hranice tužkou 3,24 : 1 ve dne a 3,34 : 1 v noci. Text na pruhu období má nejméně 5,48 : 1 (období 4).
- Playwright (celá sada, 713 testů) prošel po třech opravách: prohlídka a přepínač režimu ověřovaly barvu papíru natvrdo (`prohlidka.spec.ts`), graf barvu inkoustu (`graf.spec.ts`) a axe našel `--muted` na tintě období 2 (Mapa a čas, Dva životy) s 4,47 : 1, což vyřešila stará hodnota přezdívky. Celé `npm test` pak prošlo až na dva testy kreseb v `jeskyne.spec.ts`, které po tabulátoru měřily polohu tlačítka nad lištou cesty hned, ještě během plynulého posunu (text 18 px na telefonu posunul tlačítko blíž k liště a závod se projevil zhruba jednou z pěti). Měří teď až po dojetí posunu (`expect.poll`); deset běhů po sobě prošlo.
- **Snímky:** testy v repozitáři žádné referenční snímky nemají (snímky v `test-results/` jsou jen pro prohlédnutí a Playwright je maže), takže se žádné neaktualizovaly. Snímky pro autora jsou v `Claude outputs/snimky/design-v2-k1/`: `domu-`, `sokrates-` a `krok2-` (cesta 1, krok 2) na 390 a 1440 px ve dne (`light`) i v noci (`dark`), a `kalam-cestina.png`.

### Nad čím jsem váhal a co by šlo jinak

- **Průhlednost razítka místa 0,96 místo 0,92 z plátna.** S 0,92 má text razítka období 4 ve dne a období 1, 2 a 7 na lístku v noci 4,32 až 4,44 : 1. Jinak: nechat 0,92 a ztmavit inkoust období, ale inkousty drží barvy, které student zná z mapy a osy.
- **Natočení ve vlastnosti `rotate`, ne v `transform`.** List, páska, razítko a karta se tak dají rozložit, otisknout nebo zvednout animací `transform`, a natočení zůstane. Jinak: natočení v `transform` a animace s ním v každém snímku, což by každá komponenta musela opakovat.
- **Omezený pohyb 0,01 ms místo `none`.** Animace tak skončí ve svém posledním snímku a události konce přijdou jako jindy (na nich stojí některé ostrovy); zpoždění se ruší, takže příchod po částech je hned celý. Rozložení lístku a dopad razítka mají `none`, protože jejich klidový styl už je konec pohybu.
- **`--sunk` jako papír smíchaný s linkou.** Nový systém zapuštěnou barvu nemá (vtlačené je papír se stínem), ale 25 míst ji dnes používá jako podklad přepínačů a najetí; bez ní by splynula s papírem. Zmizí s K4 a K7.
- **Okraj 48 px už v K1.** Je to hodnota z D2 a rám ji v K2 stejně převezme. Jinak: nechat 80 px do K2; obsah na notebooku by se pak rozšířil až s novou hlavičkou.
- **Display jako jméno.** `--fs-display-1` a `-2` ukazují na `--fs-jmeno` (104 / 56 px), protože Po D4 větší display nepřidává. Dnes je žádná stránka nepoužívá, takže se nic nezměnilo.
- **Razítko člověka jen jako CSS.** SVG s textem po obvodu, ikonou atributu a filtrem nedotištěného inkoustu je komponenta; postaví ji K3 místo `Mince.svelte`, aby ikony šly ze spritu atlasu.
- **Kalam bez přednačtení.** Zatím ho nic nepoužívá, takže se ani nestáhne; přednačtení latin podmnožiny 700 přijde s pruhem se jménem v K3 (je na první obrazovce profilu).
- **Jména tříd** jsem volil tak, aby se nepotkala s třídami komponent: `list`, `pruh`, `mince`, `karta`, `deska` a `tecky` už v komponentách jsou, proto `.papirovy-list`, `.titulek-pruh`, `.razitko-cloveka`, `.lezi-odkaz` a `.papir`.

## Co rozhodnout po K1

Prázdná odpověď znamená souhlas s doporučením.

1. **Razítko místa s průhledností 0,96** místo 0,92 z plátna, aby text razítka měl ve všech obdobích aspoň 4,5 : 1? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

2. **Okraj stránky 48 px na notebooku už teď** (obsah je širší než dřív, ještě před novou hlavičkou)? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

3. **Chceš něco změnit na snímcích po K1** (papír, barvy, velikost písma)? Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď: (prázdná, souhlas s doporučením)

## Zadání K2: rám webu

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K1 (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K2 větve design-v2, rám webu v novém vzhledu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Po D3 (Pravidla pohybu), Po D4 (Co se proti design systému změnilo: Navigace a logo), Co rozhodnout po D4 (otázka 11, Agora), Po K1 a Co rozhodnout po K1 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a oddíl Navigace a rozvržení. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/Domu.dc.html v <helmet> jen část „rám: hlavička, drobečky, spodní lišta“ a @container pro telefon, z těla jen hlavičku, drobečky a spodní lištu, a z project/Pohyb.dc.html jen styly a skript ukázky „mezi stránkami“. Když odpovědi po K1 něco mění, oprav nejdřív tokens.css nebo global.css.

1. Hlavička na notebooku: logo Agora jako koláž pěti vytržených písmen (velké A v papíru období stránky přes --pp a --na-pp, na stránkách bez období v inkoustu; po najetí se písmena srovnají do řady, --d-stisk; odkaz s popiskem „Agora, domů“, jednotlivá písmena čtečka nečte), navigace jako ploché odkazy s vtlačenou aktivní položkou (--vtla), hledání ve vtlačené drážce, Můj deník vystouplý (.vystouple .vystouple--m) a přepínač režimu jako malé vystouplé tlačítko. Drobečky v --ink-3. Telefon: horní lišta se Zpět, hledáním ikonou a přepínačem, spodní lišta s vtlačenou aktivní položkou a stínem --lista-stin. Lišta hodiny a promítání musí fungovat dál. Stránka 404 na vytrženém listu s titulkem a pruhem bez období.

2. Název Agora podle odpovědi 11 po D4: záhlaví, titulek stránek v prohlížeči, popis pro sdílení, úvodní věta na Domů a README; repozitář, adresa webu a docs/ zůstávají. V textech pro studenty zůstává „atlas“ tam, kde mluví o tom, jak se v něm pohybovat (skill atlas-psani). Věty hlídají testy přesným zněním: najdi je v tests/ a uprav v témže commitu.

3. Přechody mezi stránkami podle Po D3 (Pravidla pohybu): @view-transition { navigation: auto }, typy dalsi a zpet z navigation.activation v pagereveal, list se otočí kolem levé hrany (--d-list, --k-list); při omezeném pohybu a ve Firefoxu se stránka přepne bez animace. Let fotky z karty na desku nech na K3.

4. Rám přepiš na nová jména tokenů (Po K1, tabulka přezdívek); co rám přestane používat, odškrtni v tabulce přezdívek v plánu.

5. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro prohlídku, fokus a lištu, hledání, noindex, odkazy, hodinu a promítání), node scripts/kontrola-fokus.mjs, klávesnicí na dvou výškách okna, a node scripts/snimky-listy.mjs na Domů, profil Sókrata, krok cesty 1/2, Mapa a čas a 404 na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Restartuj náhled npm run dev.

6. Do plánu větve zapiš oddíl Po K2: co se v rámu změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K2 a zadání K3 v plném znění. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

7. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Po K2 (8. 11. 2026)

Odpovědi po K1 byly prázdné, takže platí doporučení: razítko místa s průhledností 0,96, okraj 48 px a snímky beze změny. `tokens.css` ani `global.css` se kvůli nim neměnily.

### Co se v rámu změnilo

- **Hlavička** (`Hlavicka.astro`) leží na tečkovaném papíře a drží nahoře jako dřív; stín `--hlavicka-stin` dostane až po posunu stránky (vrstva, mění se jen průhlednost). Notebook: logo, ploché vstupy s vtlačenou aktivní položkou (`--vtla`, po najetí podtržení tužkou), hledání ve vtlačené drážce s klávesou `/` jako malým vystouplým knoflíkem, Můj deník vystouplý (`.vystouple .vystouple--m`, na stránce deníku vtlačený) a přepínač režimu jako malé vystouplé kolečko.
- **Logo Agora:** pět písmen na útržcích papíru (`--list` a `--listek`), mírně natočených a přes sebe, se společným malým stínem (nový token `--odlep-m`); po najetí nebo fokusu z klávesnice se srovnají do řady (`--d-stisk`, natočení ve vlastnostech `rotate` a `translate`). Velké A nese papír období stránky přes `--pp` a `--na-pp`: stránka ho dostane parametrem `obdobi` v `Zakladni.astro` (profil, medailonek, směr, období, tradice, úvod, pokus, přehled cesty, týden). Stránky bez období (Domů, otázky, deník, Lidé, hodina, 404) mají A v inkoustu. **Mapa a čas** přebarví A podle zvoleného roku (`src/lib/logo.ts`, atribut `data-logo`); výchozí rok dostane barvu už při sestavení. Odkaz má popisek „Agora, domů“, písmena jsou pro čtečku skrytá.
- **Telefon:** horní lišta má „‹ Zpět na …“, nebo logo, a vpravo hledání jako vtlačené kolečko s ikonou a přepínač režimu. Krátký titulek stránky v horní liště zmizel (parametr `kratkyTitulek` jsem odstranil ze třinácti stránek): kde není Zpět, je logo jako na plátně.
- **Spodní lišta** na tečkovaném papíře se stínem `--lista-stin`; pět plochých vstupů, aktivní vtlačený (`--vtla`, tučně), ostatní v `--ink-2`. Výška 72 px zůstává.
- **Drobečky** celé v `--ink-3`, odkazy podtržené, aktuální stránka bez podtržení (rozdíl nenese jen barva).
- **Okno hledání** je ležící list (`--list`, `--lezi-zved`, bez rámečku), pole Pagefindu má okraj tužkou (3 : 1), zvýraznění nálezu na lístku.
- **Lišta hodiny a promítání** fungují jako dřív; lišta dostala jen nová jména tokenů (list, linka, vtlačené najetí, čárkovaný okraj tužkou na kraji hodiny). Nový vzhled jejích tlačítek patří k přípravě hodiny v K6.
- **Patička** v `--ink-3` s linkou `--linka` a podpisem „Agora · Vojtěch Czempka · …“.
- **Stránka 404:** titulek „Tady nic není.“ na vytrženém listu a pod ním pruh bez období „Stránka nenalezena“ (Kalam, v inkoustu). Tlačítko Domů je zatím dnešní `Tlacitko` (K4).
- **Název Agora** (otázka 11 po D4): titulek stránek „… · Agora“ (Domů jen „Agora“), výchozí popis „Agora: interaktivní atlas filozofie pro střední školy. Lidé, otázky, mapa a čas.“, nově `og:site_name`, `og:title`, `og:description` a `og:locale` pro sdílení, nadtitulek na Domů „Agora · filozofie od Thaléta po dnešek“, README, patička a záhlaví tisku přehledu hodiny. Barva lišty prohlížeče (`theme-color`) má nové hodnoty papíru. Repozitář, adresa webu, `docs/` a texty pro studenty, které mluví o pohybu v atlasu („Tahle stránka v atlasu neexistuje“), zůstávají. Testy žádnou z vět s názvem nehlídaly.
- **Přechody mezi stránkami** (`global.css`, konec souboru): `@view-transition { navigation: auto }` jen bez omezeného pohybu. Při příchodu (typ `dalsi`) se stará stránka otočí kolem levé hrany jako list v sešitu a pod ní leží nová; při návratu v historii (typ `zpet`) se nová přiklopí zpátky přes starou. Po dvou autorových připomínkách (níž) se list neotáčí jako tuhá deska, ale ohýbá: od pravého dolního rohu se zvedne cíp, ohyb přejede ke hřbetu, zahnutý kus ukazuje rub papíru se stínem a pod ním se odkrývá nová stránka (900 ms, `--d-otoceni`). Typ nastaví skript v hlavičce `Zakladni.astro` v `pagereveal` z `navigation.activation` (návrat = `traverse` na starší záznam). Hlavička a spodní lišta mají vlastní `view-transition-name`, takže stojí a změní se hned. Firefox a omezený pohyb přepnou stránku bez animace.
- **`docs/design.md`** › Navigace a rozvržení: notebook, telefon a přechod popsané podle K2 (zbytek souboru přepíše O).

### Přezdívky

Rám už nepoužívá žádnou přezdívku (`--paper`, `--surface`, `--sunk`, `--rule`, `--muted`, `--r-*`, `--stin-mapa`); v tabulce přezdívek výš jsou odškrtnuté s počtem zbylých míst. `--r-lg` už nepoužívá nikdo, smaže ho O. `--stin-list` zbývá jen v Mapě a čase (K7). Přezdívky pohybu (`--pohyb…`) rám nepoužíval. `--muted` drží dál starou hodnotu kvůli tintám (K3 až K7).

### Testy a kontrola

- `npm run build` prošel, kontrola typů (`astro check`) bez chyb, Vitest 1 129 testů (nově `tests/data/logo.test.ts` a tři trvalé dvojice v `kontrast.test.ts`: `--ink` a `--ink-2` na `--plocha-m`, `--na-inkoustu` na `--ink-2`).
- **Nový test rámu** `tests/e2e/ram.spec.ts` (8 testů): logo s popiskem a skrytými písmeny, A v papíru období na profilu a v inkoustu na Otázkách, Mapa a čas přebarví A podle roku, logo na telefonu ustoupí Zpět, Agora v titulku a v `og:`, vtlačená aktivní položka v hlavičce i ve spodní liště a vystouplý deník a přepínač, stín hlavičky až po posunu, 404 a typ přechodu (`dalsi` po kliknutí, `zpet` po Zpět, žádný přechod při omezeném pohybu).
- Dotčené sady (prohlídka, fokus a lišta, hledání a přepínač režimu v prohlídce, noindex, odkazy, hodina, hodina-student s promítáním, hodina-podoby, Domů, obsah, nové stránky, cesta): 299 testů prošlo bez úprav; axe nehlásí nic na 29 stránkách × 2 šířky × 2 režimy.
- Celé `npm test`: 720 z 721 prošlo. Jednou spadl `mapa.spec.ts` (rok −360, 390 px, noc): po přepnutí řeky na seznam čekal minutu na tlačítko Řeka. Samostatně dvakrát po sobě (80 testů s mini mapou) prošel; rám se řeky nedotýká, ale ať si toho revize všimne, kdyby se to opakovalo.
- **Kontrast** nových dvojic výpočtem (jednorázový `scripts/kontrast-k2.mjs`, smazaný): nejnižší text ve dne 5,12 : 1 (`--ink-3` na papíru: drobečky, drážka hledání, patička), v noci 5,68 : 1 (`--ink-3` na listu v liště hodiny); A v papíru období nejméně 5,48 : 1 (období 4), A bez období 14,84 : 1 ve dne a 14,09 : 1 v noci; hranice tužkou na listu 3,63 : 1 ve dne a 4,02 : 1 v noci.
- **Klávesnice:** `scripts/kontrola-fokus.mjs` na Domů, Sókratovi, kroku 1/2, Mapě a čase, 404, Otázkách, Lidech a deníku na 390 a 1440 px: rám bez nálezu. Hlásí jen překryvy uvnitř mapy (popisky bodů a událostí na ose, K7) a na 404 chybu konzole, kterou je sama odpověď 404. Tabulátor tam i zpátky na 1440 × 700, 1440 × 1000, 390 × 640 a 390 × 844 (Domů, Sókratés, 404): fokus nikdy pod hlavičkou ani pod spodní lištou, rámeček vidět vždy (jednorázový skript, smazaný).
- **Snímky** pro autora v `Claude outputs/snimky/design-v2-k2/`: `domu-`, `sokrates-`, `krok1-2-`, `mapa-` a `404-` na 390 a 1440 px ve dne (`light`) i v noci (`dark`). Krok cesty má dál hlavičku cesty, ne hlavičku webu (K5).

### Nad čím jsem váhal a co by šlo jinak

- **Logo místo titulku stránky na telefonu.** Plátno má v horní liště telefonu logo nebo Zpět; titulek stránky stojí hned pod lištou jako nadpis a aktivní položka spodní lišty říká, kde student je. Jinak: logo a vedle něj krátký titulek; na 390 px by se s hledáním a přepínačem vešel jen krátký (otázka 1).
- **Hlavička drží nahoře** jako dřív, i když plátno ji kreslí jen na začátku stránky. Na papíře bez čáry by se při posouvání text pod ní ztrácel, proto stín až po posunu. Jinak: hlavička odjede se stránkou a vrátí se při posunu nahoru; to by změnilo lišty Obsah a hodiny, které se o ni opírají.
- **Logo v Mapě a čase přebarvuje ostrov** podle roku, jak to ukazuje plátno (terakota roku 424 př. n. l.). Při přehrávání života se A mění s obdobím; přechod barvy nemá, aby nic neblikalo.
- **Ohyb listu ořezem.** Stará stránka se ořízne podél ohybové hrany (`clip-path`) a rub listu je pruh s ořezem za hranou; ohyb jinak nakreslit nejde. Je to druhá výjimka z pravidla `transform` a `opacity` (vedle tahu tužky); animuje se jen jeden ořez na snímku a jeden na rubu, takže by plynulost na telefonu neměla trpět. Ověří revize R na levném telefonu.
- **Kroky cesty se zatím otáčejí jako stránky** a hlavička cesty s nimi, protože krok je samostatná stránka. Vlastní přechod mezi kroky (list posune, drážka postupu doběhne, hlavička a lišta stojí) je v K5 podle ukázky „další krok“ na plátně.
- **Agora i v patičce a v tisku přehledu hodiny.** Otázka 11 je nejmenovala, ale je to podpis webu; „Atlas myšlení“ by vedle loga Agora působil jako jiný web (otázka 2).
- **Ikona v záložce prohlížeče** zůstala glóbus (`public/favicon.svg`); nová by měla být velké A na útržku, ale to je obrázek, ne rám (otázka 3).
- **Parametr `kratkyTitulek` jsem smazal**, ne nechal bez užitku: nic ho už nečte a nová stránka by ho zbytečně vyplňovala.

## Co rozhodnout po K2

Prázdná odpověď znamená souhlas s doporučením.

1. **Na telefonu bez Zpět jen logo**, bez krátkého titulku stránky v horní liště? Doporučuji ano.
   Odpověď: souhlasím (8. 11. 2026)

2. **Agora i v patičce a v záhlaví tisku přehledu hodiny?** Doporučuji ano.
   Odpověď: souhlasím (8. 11. 2026)

3. **Nová ikona v záložce prohlížeče:** velké A na útržku papíru v inkoustu místo glóbu (udělá ji K3 spolu s razítkem člověka)? Doporučuji ano.
   Odpověď: souhlasím (8. 11. 2026)

4. **Chceš něco změnit na snímcích po K2** (logo, hlavička, spodní lišta, 404, přechod)? Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď: „Co bych rád změnil je ten přechod. Jako základ se mi líbí, ale je to víc, že to působí jako prostě slide jako u prezentace než otočení listu. Je to možná moc rychlé a moc statické. Kdyby to šlo udělat víc jako otočení papírového listu, bylo by to super.“ Provedeno hned (8. 11. 2026, oddíl Přechod po připomínce).

### Přechod po připomínce (8. 11. 2026)

- **První pokus** (po první připomínce, že přechod působí jako slide a je rychlý a statický): celá stránka se otáčela kolem levé hrany od čtenáře ke hřbetu, pomaleji, se zvednutím, prohnutím, ztmavnutím a stínem. Autor: „Za mě to je pořád jak překlopení krychle než přetočení stránky. Zkus se kdyžtak podívat jestli nenajdeš nějaký plugin nebo skill který bys na to mohl použít.“
- **Plugin ani skill** na otáčení stránky v katalogu není (hledáno: animace, přechody stránek, page curl, view transitions); nejblíž je komunitní balík pro React a GSAP, který na statický web s nativními přechody nesedí.
- **Proč krychle:** tuhá plocha otočená v perspektivě je vždycky deska nebo stěna krychle, ať se otáčí kamkoli. Papír se ohýbá.
- **Teď: ohyb listu.** Od pravého dolního rohu se zvedne cíp (spodek ohybu jde napřed, hrana je šikmá), ohyb přejede zprava doleva ke hřbetu a zahnutý kus listu ukazuje rub papíru (o stupeň tmavší než list, užší než odhalená část, protože je papír prohnutý). Rub vrhá stín na obě strany ohybu. Pod listem se odkrývá nová stránka. Návrat v historii přehraje totéž pozpátku: list se odvine od hřbetu zpátky přes stránku. Trvá 900 ms (`--d-otoceni`) s vyrovnanou rychlostí, aby byl ohyb vidět celou dobu.
- **Technika:** stará stránka se v přechodu ořízne podél ohybové hrany (`clip-path`, 17 klíčových snímků spočítaných podle křivky času) a rub je prvek `.otoceni-ohyb` v nové stránce s vlastním `view-transition-name`, takže leží nad oběma stránkami a pod hlavičkou a spodní lištou. Vidět je jen během přechodu (třída `otaci-se` na `<html>`).
- **Ověřeno** snímky v pěti okamžicích (150 až 750 ms) na 1440 px ve dne a na 390 px v noci (`Claude outputs/snimky/design-v2-k2/prechod-1440-light.jpg` a `prechod-390-dark.jpg`); test rámu hlídá typ přechodu a že rub po přechodu zmizí. Omezený pohyb a Firefox beze změny: stránka se přepne hned.

## Zadání K3: stránky osob

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K2 (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K3 větve design-v2, stránky osob v novém vzhledu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Po D3 (Pravidla pohybu), Po D4 (Co se proti design systému změnilo: poštovní razítko, záložky velkých otázek), Co rozhodnout po D4 (otázka 1), Po K1 (třídy papíru a přezdívky), Po K2 a Co rozhodnout po K2 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a v oddílu Komponenty části o hlavičce profilu, desce, minci, citátu, Době a lidech, Kam dál a obsahu profilu, a oddíl Atributy osobností. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/ProfilSokrates.dc.html v <helmet> jen části, které nejsou v tokens.css a global.css (hlavička profilu, deska, záložky, lístky cest, Proč kalich, kapitoly, citát, Doba a lidé, myšlenky, Zkus to žít, Kam dál, obsah profilu, razítko člověka) a @container pro telefon, z těla jen hlavičku profilu, jednu kapitolu, Dobu a lidi a Kam dál; z project/Pohyb.dc.html jen styly a skript ukázek „mezi stránkami“ (let fotky z karty na desku) a „příchod na profil“. Když odpovědi po K2 něco mění, oprav nejdřív rám (src/components/rozvrzeni/, src/layouts/Zakladni.astro) nebo tokens.css.

1. Hlavička profilu: jméno na vytrženém listu s pruhem v papíru období (.titulek, .titulek-pruh; Kalam 700 latin přednačíst, je na první obrazovce), razítko místa a času, deska s fotkou na listu se dvěma páskami a filtrem --foto místo duotónu --pc-plate, záložky velkých otázek místo štítků (papír období, po najetí se povytáhnou, na telefonu vyčnívají zleva pod sebou), lístky cest s pahýlem a Proč kalich. Na telefonu deska a první odstavec na první obrazovce i s pěti a více otázkami (test hlavičky).

2. Razítko člověka jako komponenta podle Po D4 (dva kruhy v inkoustu období, jméno a roky po obvodu, atribut uprostřed ze spritu public/ikony/atributy.svg, bez atributu razítkové vlnovky, filtr nedotištěného inkoustu, natočení podle id, pod 48 px bez obvodu; CSS .razitko-cloveka je hotové) místo Mince na stránkách osob: Doba a lidé, Kam dál, medailonky. Ostatní místa (Lidé, Mapa a čas, osa hlasů, karta týdne, hodina) nech na Minci, ať K6 a K7 přepnou jen import; zapiš je do plánu. Když jsem po K2 schválil novou ikonu záložky prohlížeče, udělej ji tady (velké A na útržku papíru v inkoustu, SVG).

3. Kapitoly, citát na listu s páskou, Doba a lidé (mini mapa a mini osa zůstanou do K7, nový je jen rám a razítka), Dvě velké myšlenky, Zkus to žít jako list s páskou, Kam dál jako ležící karty (.lezi-odkaz, připravované čárkované bez šipky), Prameny a obsah profilu (řádek odkazů a lišta Obsah) v novém papíru. Medailonek a společný profil (Kratés a Hipparchia) tytéž části. Stránky směru, období a tradice, které sdílejí HlavickaStranky a Kam dál, převezmou jen to, co se změní ve sdílených komponentách; zbytek je K6 a nic na nich nesmí spadnout.

4. Pohyb podle Po D3: příchod na profil (titulek, pruh a pásky po sobě, --d-prichod, --z-prichod) jen při nové návštěvě (pagereveal, typ navigace jiný než traverse) a let fotky z karty na desku (view-transition-name jen na kliknuté kartě a cílové desce, nastavené v pageswap a pagereveal a po přechodu odebrané; přechod listu z K2 v global.css zůstává). Klidový stav ukazuje konec pohybu; při omezeném pohybu a ve Firefoxu nic, stránka je hned celá.

5. Stránky osob přepiš na nová jména tokenů (Po K1, tabulka přezdívek); co přestanou používat (desky --pc-plate, --fs-display, --period-N, tinty u osob), odškrtni v tabulce přezdívek v plánu.

6. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro prohlídku, obsah, platon, seneca, aristoteles, celek7-profily, krates-hipparchia, medailonky, mini-mapa, doba-odkazy, obrazky-licence, otazka, ram), node scripts/kontrola-fokus.mjs na profilu, medailonku a společném profilu, klávesnicí na dvou výškách okna, a node scripts/snimky-listy.mjs na profilu Sókrata, Platóna, Kratéta a Hipparchie a jednom medailonku na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po K3: co se na stránkách osob změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K3 a zadání K4 v plném znění. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

8. Pak se zastav a napiš mi, na které snímky se mám podívat (kontrolní bod se snímky po K3).
```

## Po K3 (9. 11. 2026)

Odpovědi po K2 jsou v repozitáři (otázky 1 až 3 „souhlasím“, otázka 4 vyřízená přechodem po připomínce), takže rám ani `tokens.css` se kvůli nim neměnily; nová ikona v záložce prohlížeče (otázka 3) je hotová tady.

### Co se na stránkách osob změnilo

- **Hlavička profilu** (`StrankaProfilu.astro`): nahoře razítko místa a času (`.razitko-mista`: rodiště, roky, odkaz „období N · název“). Nadtitulek z obsahu („Senekův portrét“) jsem nejdřív dal rukou vedle razítka; autor 9. 11. řekl, že je navíc, takže v hlavičce není (pole `nadtitulek` v datech zůstává). Pod nimi nadpis h1 složený ze dvou kusů papíru: jméno s tečkou na vytrženém listu (`.titulek`) a pointa na pruhu v papíru období (`.titulek-pruh`, Kalam 700). Čtečka je čte jako jeden nadpis („Sókratés. Muž, který se ptal.“), takže testy nadpisů se neměnily. Kalam 700 latin se na stránkách osob přednačítá (`Pisma ruka`, parametr `strankaOsoby` v `Zakladni.astro`). Společný profil má menší jméno (`--fs-h1`), aby se „Kratés a Hipparchia.“ vešlo na jeden řádek. **Po připomínkách autora (9. 11.: jméno a dovětek vypadaly jako text položený na papír, dva různé prvky; pak jméno bylo u okrajů ustřižené a mělo drobné čárky):** přes list i pruh leží zrno papíru (šum v obrázku SVG, `mix-blend-mode: multiply`, v noci `soft-light`), které jde i přes písmo; inkoust jména je trochu nedotištěný (maska se šumem) a ve dne lehce vtlačený, fix na pruhu (`.titulek-pruh__text`) má stejnou masku. Maska i zrno jsou jeden obrázek přes celou plochu (bez dlaždic, ty měly po natočení listu na švech čárky) a maska má kolem písmen rezervu (dřív ustřihla čárku nad Ó a začátek S). Barvy písma i papíru zůstávají, takže kontrast se nemění (zrno text i papír ztmaví stejně). Platí i pro titulek stránky 404.
- **Deska** (`Deska.astro`, sdílí ji i Příběh v cestách): fotka na ležícím listu se dvěma páskami v papíru období, filtr `--foto` místo duotónu `--pc-plate`; bez obrazu tečkovaný papír s razítkem člověka (104 px) místo mince s ornamentem. Pod deskou „Proč kalich?“ s ikonou atributu ve vtlačeném kolečku (`.vlys` v `global.css`) a popisek obrazu v `--ink-3`.
- **Lístky cest** (`VstupyOsoby.astro`): dva kusy vystouplého papíru, hlavní díl a za perforací pahýl s počtem kroků v inkoustu období a minutami; délku čtečka slyší dál za slovem Cesta. **Po připomínkách autora (9. 11.):** po najetí se lístek u perforace odtrhne (první pokus pahýl jen pootočil a autor řekl, že to vypadá jako prohnutí: teď pahýl odjede o 14 px doprava a lehce se stočí, mezi díly se otevře mezera a oba okraje u perforace jsou zubaté, proužky papíru s ořezem; jen `transform`, `rotate` a `opacity`, `--d-stisk`), a lístky stojí vždy v jedné řadě a zúží se: u Seneky se tři zalomily pod sebe a odsunuly záložky otázek. Tři lístky v navigaci užší než 980 px a dva v užší než 620 px mají menší název a užší pahýl (container query). Na telefonu pod 600 px zůstává řádek odkazů (lístky by u Seneky odsunuly desku z první obrazovky).
- **Záložky velkých otázek** místo tlačítek s obrysem: papír období, nahoře rukou „otázka 7“, pod tím znění; po najetí se povytáhnou (`--d-stisk`), při fokusu z klávesnice vylezou nad okraj listu. **Po připomínce autora (9. 11.)**: u Aristotela (osm otázek) se záložky zalomily do dvou řad a horní řada visela ve vzduchu. Teď jsou vždy zastrčené pod jedním okrajem listu: v jedné řadě, když se vejdou (do čtyř od 520 px šířky navigace, pět a víc od 860 px a menším písmem), jinak pod sebou, vyčnívající zleva z okraje listu vpravo (telefon, užší okno). Rozhoduje container query nad navigací a počet záložek (`:has`).
- **Razítko člověka** (`src/components/ui/RazitkoCloveka.astro`, `src/lib/razitko.ts`): dva kruhy v inkoustu období, jméno a roky po obvodu (dlouhý text se stáhne na místo mezi tečkami), atribut ze spritu `atributy.svg`, bez atributu vlnovky, natočení −14° až +12° podle id, pod 48 px bez obvodu. Nedotištěný inkoust je jedna maska se šumem v CSS (obrázek SVG s `feTurbulence`), ne SVG filtr u každého razítka jako na plátně. Je v Doba a lidé (72 px) a na desce bez obrazu. **Na Minci zůstávají** (K6 a K7 přepnou jen import): Lidé a směry, Mapa a čas (karta člověka, body, osa), osa hlasů a hlasy na stránce otázky, karta cesty a první cesta na Domů, přehled cesty, rodokmen a osa událostí na stránkách období a směru, hlavička stránky směru, lidé období, Tvoje antika, a v blocích (BlokHlava, BlokFilozof, Spor, Kdo žil dřív?) Svelte verze `mapa/Mince.svelte` (K4).
- **Ikona v záložce prohlížeče** (`public/favicon.svg`): velké A (Newsreader jako cesta, ne písmo) v `--na-inkoustu` na vytrženém útržku v inkoustu, mírně natočeném; glóbus zmizel.
- **Tělo profilu:** kapitola má číslo rukou v inkoustu období a nadpis `--fs-h2` (dřív `--fs-h1`); citát leží na listu s páskou (kompaktní citát v kartách a na ose otázky zůstává bez listu); Doba a lidé má současníky a Dva životy na jednom listu a mini mapu na vystřiženém listu (obě komponenty samy zůstávají do K7), u lidí razítka místo mincí, tlačítko „Přehrát život na mapě“ malé vystouplé; myšlenky jsou ležící listy; Zkus to žít list s páskou (tlačítko „Přijmout výzvu“ je ostrov, nový vzhled dostane v K4); Kam dál ležící karty (`.lezi-odkaz`, připravovaná karta `.zakazane`: čárkovaná tužkou, bez šipky a stínu), na notebooku až čtyři vedle sebe; Prameny a řádek obsahu mezi čárkovanými linkami tužkou; lišta Obsah na papíru, rozbalený seznam jako list se stínem `--lezi-zved`, čtený oddíl na lístku s linkou v inkoustu období.
- **Vnořený papír s páskou** (připomínka autora 9. 11.: citát s páskou uvnitř myšlenky nebo Zkus to žít, který sám drží páska, vypadal špatně): citát uvnitř jiného přilepeného papíru (`.papirovy-list`, `.listek-paska`, `.blok`) nemá pásku, je to lepicí lístek v barvě období (lístek tónovaný 16 % papíru období, nahoře o stupeň tmavší lepicí proužek, roh nadzvednutý stínem, natočení 0,8°), podpis v `--ink-2`. Týká se myšlenek Marka Aurelia, Epiktéta a Kratéta a Hipparchie a Zkus to žít u Seneky. Kontrast hlídá `kontrast.test.ts` (nejméně 6,15 : 1). Stejné pravidlo má K4 pro bloky.
- **Medailonek** (`StrankaMedailonku.astro`): jméno na vytrženém listu bez pruhu (medailonek pointu nemá), razítko místa pod ním, kdo a proč beze změny, deska jako u profilu.
- **Sdílené komponenty** na stránkách období, směru, otázky, pokusu a tradice: změnil se jen Kam dál a Citát (a Deska v Příběhu v cestách); hlavička stránky (`HlavickaStranky`) a zbytek zůstávají pro K6. Testy těch stránek prošly beze změny.
- **Pohyb** (Po D3): *příchod na profil* (titulek, pruh a dvě pásky na desce po sobě, `--d-prichod`, `--z-prichod`, pásky `--d-listek` a `--k-dopad`) jen při nové návštěvě: třídu `prichod` dá `<html>` skript v hlavičce `Zakladni.astro`, když typ navigace není `traverse` (ani `back_forward`), není omezený pohyb a prohlížeč zná `pagereveal` (Firefox ne). Po přechodu listu z K2 začne příchod, až se list skoro odvine. Animace jen přidávají začátek, klidový stav je konec pohybu. *Let fotky z karty na desku*: skript si pamatuje poslední kliknutý odkaz; v `pageswap` dá kartě (odkaz vyšší než 40 px, v okně, cíl je stránka osoby) `view-transition-name: deska-osoby` a cíl zapíše do `sessionStorage`; nová stránka v `pagereveal` dá totéž jméno desce `#deska-osoby` a po přechodu ho obě stránky zase smažou. Aby deska byla v DOM před prvním vykreslením, mají stránky osob `<link rel="expect" href="#deska-osoby" blocking="render">`. Jméno v řádku textu (Doba a lidé) ani Zpět let nespustí.
- **`docs/design.md`** › Komponenty: deska, razítko člověka, citát, Kam dál a vstupy osobnosti podle K3 (zbytek přepíše O).

### Přezdívky

V tabulce přezdívek (Po K1) jsou odškrtnuté stránky osob s počty zbylých míst. Stránky osob už nepoužívají `--pc-plate`, `--fs-display`, `--period-N` ani tinty; zbývají jen v mini mapě a mini ose (`--pc`, `--pc-tint`, `--rule`, `--muted`, `--surface`, K7) a v blocích uvnitř profilu (K4). Třídy `.t-display-*` nepoužívá už nic, O je smaže.

### Testy a kontrola

- `npm run build` prošel, Vitest 1 149 testů (nově `tests/data/razitko.test.ts`: natočení, místo na obvodu pro každého člověka v datech; v `kontrast.test.ts` nově inkoust období na vystouplé ploše, číslo v pahýlu).
- **Nový test** `tests/e2e/stranky-osob.spec.ts` (7 testů): hlavička (jméno na listu, pointa na pruhu v papíru období a Kalamu, razítko místa, dvě pásky, filtr fotky, Kalam přednačtený), lístky a záložky (natržení u perforace po najetí, tři lístky Seneky v jedné řadě na 1440 i 1180 px se záložkami na první obrazovce, záložky v jedné řadě na notebooku, na telefonu pod sebou se třemi odsazeními a společným pravým okrajem, deska Epikúra se sedmi otázkami na první obrazovce, nic nepřetéká), razítka (počet, jméno a roky po obvodu, atribut, vlnovky, jedinečná id, různé natočení, deska bez obrazu), Kam dál, příchod (nová návštěva ano, po Zpět a při omezeném pohybu ne, klidový stav celý), let fotky, ikona.
- **Upravené testy:** `krates-hipparchia.spec.ts` (atribut u popisku je `.vlys`, ne mince), `bloky.spec.ts` (Příběh v dílně: deska bez obrazu nese razítko s popiskem „Sókratés · kalich“) a `celek7-profily.spec.ts` (skrytý přepínač ve Změň jednu věc ležel po posunu přesně na spodní hraně okna a Playwright ho hlásil jako mimo okno; možnost se teď nejdřív posune doprostřed).
- Dotčené sady (prohlídka, obsah, platon, seneca, aristoteles, celek7-profily, krates-hipparchia, medailonky, mini-mapa, doba-odkazy, obrazky-licence, otazka, ram) prošly; axe na stránkách osob bez nálezu. Celé `npm test` (kontrola typů, Vitest, 728 testů v Playwrightu): 722 prošlo, 6 spadlo. Čtyři byly Příběh v dílně (test čekal minci) a jeden kontrola kotev: `<link rel="expect" href="#deska-osoby">` měly i medailonky bez desky (odkaz na neexistující kotvu); teď ho dostane jen stránka s deskou (`deskaOsoby` v `Zakladni.astro`). Šestý, tažení karty v Roztřiď (`bloky.spec.ts`), spadl jen pod zátěží celého běhu; samostatně prošel čtyřikrát po sobě. Po opravách prošly `bloky`, `odkazy`, `stranky-osob`, `medailonky` a `krates-hipparchia`; celé `npm test` jsem znovu nepouštěl. Po všech připomínkách autora (záložky, lístky a jejich odtržení, nadtitulek, zrno papíru, vnořený citát) po `npm run build`: Vitest 1 181 testů prošlo; Playwright `stranky-osob`, `prohlidka`, `obsah`, `platon`, `seneca`, `aristoteles`, `celek7-profily`, `krates-hipparchia`, `medailonky`, `mini-mapa`, `doba-odkazy`, `obrazky-licence`, `otazka`, `ram`, `bloky`, `nove-stranky` a `odkazy`: 352 z 353. Znovu spadlo jen tažení v Roztřiď pod zátěží; test teď před měřením karty počká na písma a `bloky`, `stranky-osob` a `prohlidka` pak prošly (164 testů).
- **Kontrast** nových dvojic výpočtem (jednorázový skript, smazaný): nejnižší ve dne razítko člověka období 4 na papíře 4,71 : 1 (průhlednost 0,96 jako razítko místa), v noci razítko období 1 na lístku 4,58 : 1; text záložky (`--na-papiru` na papíru období) nejméně 5,48 : 1 a přechod záložku jen ztmavuje.
- **Klávesnice:** `scripts/kontrola-fokus.mjs` na Sókratovi, Thalétovi a společném profilu na 390 a 1440 px bez nálezu. Tabulátor tam i zpátky na 1440 × 700, 1440 × 1000, 390 × 640 a 390 × 844 (jednorázový skript, smazaný): nic pod lištami; jediný nález je pole Odkryj v kapitole 01 Sókrata na 1440 × 700, které po tabulátoru končí 4 px pod oknem (blok, K4).
- **Snímky** pro autora v `Claude outputs/snimky/design-v2-k3/`: `sokrates-`, `platon-`, `seneca-` (tři cesty), `krates-a-hipparchia-` a `thales-` (medailonek) na 390 a 1440 px ve dne (`light`) i v noci (`dark`), každá stránka na 1 až 4 listech.

### Nad čím jsem váhal a co by šlo jinak

- **Přechod listu na stránky osob v testech často odpadne, už od K2.** V headless Chromiu nová stránka osoby přechod většinou nedostane (`pagereveal` bez `viewTransition`), i na stavu před K3 a i bez letu fotky; na stránky bez osob (Lidé, Otázky, cesty) jde. Odpadá to náhodně (jednou z několika pokusů projde) a pomohlo odebrat čtyři styly, které mají jen stránky osob, takže tipuji časování načtení stylů v headless prohlížeči. Test letu proto ověřuje vždy kartu a úklid a jméno desky jen tehdy, když přechod nastal. V opravdovém Chromu jsem to neověřil (otázka 8); revize R to má zkusit na telefonu.
- **Maska místo SVG filtru u razítka.** Plátno má u každého razítka filtr `url(#…)` se šumem. Při hledání předchozí chyby to chvíli vypadalo jako viník, opakování to nepotvrdilo; maska vypadá stejně, je jedna pro všechna razítka a nepotřebuje desítky id, tak zůstala.
- **Nadtitulek v hlavičce** jsem nejdřív nechal rukou vedle razítka (nese autorský text); autor ho 9. 11. označil za navíc, takže zmizel jako na plátně. Medailonek nadtitulek má dál, protože nese odkaz na směr („Stoicismus · medailonek“); kdyby měl zmizet i tam, je to otázka 2.
- **Medailonek bez pruhu.** Medailonek nemá pointu; pruh by musel nést něco vymyšleného. Jméno je na listu bez tečky.
- **Velikost písma na razítku.** 11 a 9 jednotek ze sta dává na 72 px asi 8 a 6,5 px. Je to jako na plátně a razítko je pro čtečku skryté (jméno stojí hned vedle), ale přečíst se dá jen zblízka (otázka 3).
- **Kapitola o stupeň menší** (`--fs-h2` místo `--fs-h1`), jak ji kreslí plátno; tam je 48 px.
- **Mince mimo stránky osob zůstaly** podle zadání; seznam míst je výš. Bloky v profilu (Kdo žil dřív?, Spor, Volba s filozofem) mají v profilu zatím minci vedle razítek v Doba a lidé.

## Co rozhodnout po K3

Prázdná odpověď znamená souhlas s doporučením. Autor 12. 11. 2026 (spolu s odpověďmi po auditu): „U otázek souhlasím, může to tak být.“

1. **Záložky otázek v jedné řadě, a když se nevejdou, pod sebou** (nikdy dvě řady nad sebou), **lístky cest vždy v jedné řadě** a natržení u perforace po najetí? Doporučuji ano.
   Odpověď: souhlasím (12. 11. 2026)

2. **Medailonek bez pruhu a s nadtitulkem nad jménem** (nadtitulek tam nese odkaz na směr; u profilu nadtitulek po tvé připomínce zmizel)? Doporučuji ano.
   Odpověď: souhlasím (12. 11. 2026)

3. **Text po obvodu razítka** (jméno a roky, na 72 px asi 8 px): nechat, nebo razítko v Doba a lidé zvětšit na 84 px? Doporučuji nechat.
   Odpověď: souhlasím (12. 11. 2026)

4. **Citát na listu s páskou na všech stránkách** (i v cestách a na stránkách otázek), kompaktní citát bez listu? Doporučuji ano.
   Odpověď: souhlasím (12. 11. 2026)

5. **Jméno a dovětek „vytištěné“ na papíře** (zrno přes písmo, nedotištěný inkoust): stačí to, nebo víc (silnější zrno, výraznější otisk)? Doporučuji nechat, jak je, a doladit při revizi R na skutečném displeji.
   Odpověď: souhlasím (12. 11. 2026)

6. **Vnořený citát jako lepicí lístek v barvě období** (místo druhé pásky) a totéž pravidlo pro bloky v K4 (lístek zpětné vazby uvnitř bloku na listu s páskou)? Doporučuji ano.
   Odpověď: souhlasím (12. 11. 2026)

7. **Chceš něco změnit na snímcích po K3?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď: souhlasím, tedy beze změny (12. 11. 2026)

8. **Otočí se list a přiletí fotka, když v Chromu (nebo v Safari) klepneš v náhledu na Sókratovi dole v Kam dál na kartu Platóna?** Napiš ano, nebo ne. Při „ne“ to K4 opraví jako první věc.
   Odpověď: „souhlasím“ (12. 11. 2026); výslovné ano, nebo ne chybí, proto přechod listu a let fotky ověří v opravdovém Chromu jako první věc K3 dodatek (D5 je na plátně a kódu se nedotkne)

## Po auditu (12. 11. 2026)

Audit atlasu (`docs/revize/audit-2026-11-12.md`) a dvě recenze (`docs/revize/recenze-obsahu-2026-11-12.md`, `docs/revize/recenze-mapa-denik-2026-11-12.md`) vedly k plánu `docs/plany/po-auditu.md`; autor ho 12. 11. 2026 přijal se všemi doporučeními. Pro tuhle větev z něj plyne:

- **Rozsah zůstává celý** včetně mapy jako výstřižku, kreseb jako koláže a pojmů. Návrh auditu zmenšit K7 neplatí: kresby jsou to nejzábavnější, co atlas má.
- **Design se dotáhne pro hry.** Herna (`herna-v1`) po sloučení postaví desítku nových formátů; nový krok D5 pro ně na plátně navrhne předměty a pohyb a K4a postaví jeden společný rám aktivity, takže nová hra pak znamená jen vnitřek.
- **Nové kroky:** D5 (plátno), K3 dodatek (stránky osob), K4 rozdělený na K4a a K4b, K7 na K7a a K7b. K5, K6, P, R a O mají navíc to, co je v tabulce kroků tučně nebo s číslem bodu z Vizuálních zlepšení.
- **Hotový obsah se nemění.** Kde krok narazí na slabé místo textu nebo stavby, zapíše ho do `docs/navraty.md` (kde, co, jedna věta) a jde dál.
- **Pořadí:** D5 → K3 dodatek → K4a → K4b → K5 → K6 → K7a → K7b → P → R → O → Uzavření. Kontrolní body se snímky pro autora jsou po D5, K4a (čtenářský sloupec), K5 a K7b.

### Vizuální zlepšení (12. 11. 2026)

Návrhy nad schválený vzhled, podle snímků po K2 a K3 a podle toho, že atlas má bavit a střídat formy. Nejdřív na plátno (D5), pak do kódu v uvedeném kroku. Pořadí je podle přínosu.

| # | Co | Proč | Kde |
| --- | --- | --- | --- |
| 1 | **Čtení a dělání vypadají jinak.** Souvislý text kapitoly leží na čistém listu vlepeném do zápisníku; aktivity jsou předměty položené na tečkovaném papíře mezi listy | dnes je zápisník jen v hlavičce a pod ní je obyčejný článek; student na první pohled pozná, kde čte a kde je na řadě on; řeší i tečky pod textem | D5, K3 dodatek, K4a |
| 2 | **Každá rodina aktivit je jiný předmět.** Volba: lístky, které se štípnou. Roztřiď: kapsy a obálky. Spor: dva přišpendlené lístky a mince na provázku. Seřaď na ose: šňůra s kolíčky. Tipni si: pravítko. Kdo to řekl?: otočné kartičky. Doplň citát: vystřižená slova jako v logu. Porota: hlasovací kotouček (v Athénách se hlasovalo bronzovými kotoučky). Pravý, nebo podvržený?: razítko. Najdi slabé místo: červená tužka | pestrost má být vidět dřív, než student začne číst zadání; dnes vypadá každý blok jako stejná karta | D5, K4a a K4b, `herna-v1` |
| 3 | **Studentova ruka.** Co student napíše nebo zvolí, je jeho perem: vlastní barva inkoustu a Kalam, odlišené od tisku atlasu. Barvu pera si jednou vybere ze tří | zápisník je pak vidět jako jeho; v deníku i v cestě pozná svoje stopy; malá volba, která dělá vlastnictví | D5, K4a, K6 |
| 4 | **Postup jako lístek, který se štípe.** Místo teček v hlavičce cesty týž lístek jako na přehledu: každý krok do něj štípne dírku, na konci se pahýl odtrhne a přistane v deníku | spojí lístek cesty, postup a sbírku do jednoho předmětu; odměna bez bodů | K5, K6 |
| 5 | **Každé období má vlastní papírnictví.** Vedle barvy tři věci: vzor pásky, ozdoba začátku kapitoly a styl razítka. Antika meandr, středověk iniciála a zlatá linka, renesance síť perspektivy, osvícenství rytina z encyklopedie, 19. století novinový tisk, 20. století psací stroj, dnes čtverečkovaný papír | průchod dějinami je vidět a pamatuje se podle prostředí; rozhodnout teď, než vznikne středověk | D5, K6 (tokeny `.obdobi-N`) |
| 6 | **Okraj stránky žije.** Na notebooku je vedle sloupce 680 px prázdno: poznámky tužkou („A ty?“), malý výstřižek mapy „kde jsme“, pojmy; kapitoly jako záložky na hraně stránky místo řádku odkazů | prázdný okraj je místo pro zvědavost a orientaci; na telefonu se totéž vejde mezi odstavce | K6, P |
| 7 | **Vlepené věci se nelepí stejně.** Pět citátů na stránce Sókrata má stejnou pásku ve stejném úhlu. Střídat: páska, sponka, špendlík, zastrčený roh, citát rukou na okraji; nejvýš jedna páska na obrazovku | co je všude, přestane být vidět | K3 dodatek |
| 8 | **Razítko člověka jako poštovní razítko doopravdy.** Kdo nemá atribut, má uprostřed rodné město a rok místo vlnovek | šest stejných razítek vedle sebe (Znali se u Sókrata) nic neříká; město učí, odkud kdo je | K3 dodatek |
| 9 | **Obraz ke kapitole.** Atribut nebo předmět kapitoly (pohárek, lucerna, loď) vytištěný jako velké vybledlé razítko u jejího nadpisu | filozofové jsou samé mramorové busty; kapitola dostane obraz, podle kterého se pamatuje | K3 dodatek, K7b |
| 10 | **Domů jako stůl se třemi až pěti věcmi k vzetí:** první lístek, dnešní pokus na pět minut, pohlednice s příběhem, složená mapa, a když už student něco má, pruh z jeho zápisníku | dnes je Domů text a tlačítko; krátké vstupy mají být vidět (pravidlo pestrosti 14) | K6 |
| 11 | **Aktivita na telefonu přes celou šířku** jako jeviště od okraje k okraji, ovládání v dosahu palce | hra se pozná od čtení i na malé obrazovce | K4a |
| 12 | **Klidný režim umí i čistý papír:** bez teček, bez natočení, krátké přechody | pro čtenáře, kterým zdobení ztěžuje čtení | O |

**Pravidlo střídmosti.** Papír je kulisa, ne obsah: na obrazovce nejvýš jedna ozdoba, která nic nenese, text delší než dvě věty se nenatáčí a rukou (Kalam) se nepíše nic delšího než poznámka. Každý nový předmět se staví z tokenů, které už jsou, a má klidový stav pro omezený pohyb.

**Co vyžaduje vrátit se do hotového:** body 7, 8 a 9 se dotýkají stránek osob z K3 (krátký dodatek před K4a); bod 1 mění rám kapitoly z K3.

### Mapa a deník: funkce (12. 11. 2026)

Podle `docs/revize/recenze-mapa-denik-2026-11-12.md`. Oběma nástrojům chybí úkol a to nejcennější v deníku je schované.

| Kde | Co |
| --- | --- |
| K6, deník | hlavní pohled **Moje filozofie** po velkých otázkách (na začátku, teď, kdo stál se mnou, **kdo by mi nejvíc odporoval**), výpis podle data až druhý; záznam jako lístek s cestou, krokem a volbou; záznamy podle cest; sbírka (razítka potkaných filozofů, odtržené pahýly lístků prošlých cest, vystřižené citáty) |
| K6, deník | přenos deníku odkazem nebo kódem QR, připomenutí zálohy po dokončené cestě; Moje filozofie na jednu stránku k vytištění; tichá tečka u ikony Deník, když čeká Návrat |
| K6, profil na telefonu | záložky otázek až za úvodní odstavec (dělá už K3 dodatek) |
| K7a, mapa | řeka životů: výchozí jen učitel a žák, větší řádky, legenda barev, zvýraznění současníků vybraného člověka; pravý panel bez vybraného člověka (co se ten rok dělo, všichni žijící); nové jméno pro Stín odkazu („Ukázat i ty, na které někdo navazuje“); popisky na telefonu bez překryvů; první návštěva jen s mapou, rokem a jednou výpravou, zbytek pod „Víc“ |
| K7a, mapa | razítko u lidí, které student už potkal; klepnutí na město ukáže, co tu bylo |
| `herna-v1` | **Výpravy** na mapě (tři až pět otázek na období: tipni, ověř na mapě, zapiš) a **Přehrát období** (minuta, kdy rok běží sám) |
| celek nebo `herna-v1` | hračka Čtyři školy v jednom městě (plán Athén) |

Pravidla pro každý další nástroj (osa, přehled, mapa náboženství): začíná otázkou a končí krokem dál; nejcennější věc je první obrazovka; ukazuje studentovy stopy; výchozí pohled má jedno kódování; zrcadlo ukáže i protivníka.

## Zadání D5: herní prvky a vizuální zlepšení na plátně

Opus 5.5 · high se skillem `frontend-design`. Pusť v novém chatu v Projektu Atlas filozofie. Jedno až dvě sezení; když se nevejde do jednoho, zapiš do plánu, kde jsi skončil.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok D5 větve design-v2, herní prvky a vizuální zlepšení na plátně. Kód atlasu se v tomhle kroku nemění. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co se proti design systému změnilo), Po K3, Co rozhodnout po K3 s odpověďmi, Po auditu (Vizuální zlepšení, Pravidlo střídmosti, Mapa a deník: funkce) a toto zadání. Z docs/plany/po-auditu.md jen oddíly Zásada a Katalog aktivit. docs/design.md nečti. Načti skill frontend-design. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti moje komentáře, project/canvas.json, z project/DesignSystem.dc.html a project/Pohyb.dc.html jen <helmet> se styly a z project/KrokCesty.dc.html a project/ProfilSokrates.dc.html z těla jen jeden blok Volba, jednu kapitolu a hlavičku cesty. Obsah ukázek ber ze skutečných stránek atlasu (src/content, src/data), jen co ukázka potřebuje.

1. Na plátno přidej řadu „D5 Herna“ se stránkou Herní prvky (den i noční zápisník jako u design systému, notebook 1440 i telefon 390). Nejdřív společný rám aktivity: hlava (nadtitulek rodiny aktivit, název), zadání, plocha, zpětná vazba jako lístek, Začít znovu; na telefonu přes celou šířku jako jeviště, ovládání v dosahu palce (bod 11). Pak předmět pro každou rodinu aktivit (bod 2: Volba lístky ke štípnutí, Roztřiď kapsy a obálky, Spor dva přišpendlené lístky a mince na provázku, Seřaď na ose šňůra s kolíčky, Tipni si pravítko, Kdo to řekl? otočné kartičky, Doplň citát vystřižená slova, Porota hlasovací kotouček, Pravý, nebo podvržený? razítko, Najdi slabé místo červená tužka), každý se skutečným obsahem z antiky a ve všech stavech (klid, najetí, stisk, zvoleno, zakázáno, fokus). Herní pohyb jako živé ukázky s přepínačem Omezený pohyb: otočení karty, zamíchání, přichycení karty na osu a do koše, klepnutí do mapy, odhad posuvníkem a odhalení, razítko „sedí“ a lístek „zkus to jinak“ (bez červené a zelené; rozdíl nese tvar a slovo), panel příběhu v obrazech (čtyři až šest panelů koláže, student listuje). Přehrávač zvuku nenavrhuj, zvuk je odložený. Nové délky a křivky jen tam, kde žádný token z Po D3 nesedí.

2. Na plátno přidej stránku Zlepšení vzhledu s body 1 až 5 z Vizuálních zlepšení, každý jako před a po na skutečné stránce: (1) kapitola Sókrata na čistém listu vlepeném do zápisníku a aktivita na tečkovaném papíře mezi listy, k tomu tři varianty čtenářského sloupce (tečky, ztlumené tečky, čistý list); (2) viz krok 1; (3) studentova ruka: tři barvy pera k výběru, odpověď v poli a zvolená možnost jeho perem, kontrast výpočtem; (4) postup cesty jako lístek, do kterého každý krok štípne dírku, a pahýl, který se na konci odtrhne; (5) papírnictví osmi období: vzor pásky, ozdoba začátku kapitoly a styl razítka (antika meandr, středověk iniciála a zlatá linka, renesance síť perspektivy, osvícenství rytina z encyklopedie, 19. století novinový tisk, 20. století psací stroj, dnes čtverečkovaný papír). Drž Pravidlo střídmosti.

3. Kontrast nových dvojic barev výpočtem (krátký skript v scripts/, po výpisu ho smaž). Telefon: dotykové cíle aspoň 44 × 44, nic nepřetéká do stran.

4. Do plánu větve zapiš oddíl Po D5: co je na kterých stránkách plátna, nové tokeny (barvy pera, papírnictví období, případné délky pohybu), co se proti design systému změnilo, nad čím jsi váhal a co by šlo jinak, otázky Co rozhodnout po D5 (mezi nimi volba čtenářského sloupce a barev pera) a zadání K3 dodatek v plném znění (body 1, 7, 8 a 9 z Vizuálních zlepšení na stránkách osob; záložky otázek na telefonu za úvodní odstavec; jako první věc ověřit v opravdovém Chromu přechod listu a let fotky ze Sókrata na Platóna v Kam dál a opravit, když nefungují). docs/design.md nepřepisuj (to udělá krok O). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

5. Pak se zastav a napiš mi, na co se mám na plátně podívat.
```

## Zadání K4a: společný rám aktivity a první bloky

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po D5 a po K3 dodatku (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K4a větve design-v2, společný rám aktivity a první bloky v novém vzhledu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co se proti design systému změnilo: tinty období nahradil lístek s páskou), Po K1 (třídy papíru, vrstvy stínu, přezdívky), Po K3 (Vnořený papír s páskou), Po auditu (body 1, 3 a 11 z Vizuálních zlepšení, Pravidlo střídmosti), Po D5, Po K3 dodatku a odpovědi po D5 a po K3 dodatku, a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a v oddílu Bloky popis vzhledu a stavů Volby a Odkryj. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti ze stránky Herní prvky (D5) jen styly a tělo společného rámu aktivity, Volby a Odkryj, ze stránky Zlepšení vzhledu jen bod 1 a 3, z project/DesignSystem.dc.html v <helmet> jen části o tlačítkách, možnostech, poli na psaní a lístku zpětné vazby, které nejsou v tokens.css a global.css, a z project/Pohyb.dc.html jen styly a skript ukázek Volba (kroužek tužkou, lístek) a Odkryj. Když odpovědi po D5 nebo po K3 dodatku něco mění, oprav nejdřív to.

1. Společný rám aktivity jako jedna komponenta pro všechny dnešní i budoucí bloky a hry (Astro i Svelte verze, jak to bloky potřebují): hlava (nadtitulek rodiny aktivit v inkoustu období, název), zadání, plocha, zpětná vazba jako lístek s páskou (.listek-paska, při vložení .rozlozit; uvnitř jiného přilepeného papíru lepicí lístek v barvě období podle Po K3), „Začít znovu“ všude stejně. Aktivita leží na tečkovaném papíře mezi listy, souvislý text na čistém listu (bod 1, podle varianty čtenářského sloupce zvolené po D5). Na telefonu přes celou šířku, ovládání v dosahu palce (bod 11). Nová hra pak znamená jen vnitřek plochy; zapiš do docs/design.md › Bloky krátce, jak rám použít.

2. Tlačítka a pole: hlavní tlačítko na plném inkoustu (.vystouple .vystouple--ink), vedlejší a tiché podle design systému (src/components/ui/Tlacitko.astro i tlačítka v ostrovech, blok__tl), zakázané čárkované tužkou; pole na psaní v Kalamu na linkách a co student napíše nebo zvolí, je jeho perem v barvě zvolené po D5 (bod 3; volba pera jednou, uložená v localStorage s ostatním postupem). Poznámka po K3: pole Odkryj v kapitole 01 Sókrata končí po tabulátoru na 1440 × 700 o 4 px pod oknem; oprav.

3. Volba s důvodem (možnosti jako lístky podle D5, zvolená vtlačená, kroužek tužkou kolem písmene, --d-tah) a Odkryj (odklopení přeloženého papíru, --d-odkryti) v novém rámu. Pohyb podle Po D3; při omezeném pohybu je každý stav hned na konci (kroužek celý, lístek rozložený).

4. Tři snímky čtenářského sloupce (tečky, ztlumené tečky, čistý list) na kapitole Sókrata a na kroku cesty 1/2, na 390 a 1440 px ve dne i v noci, aby šlo rozhodnout na skutečném textu (kontrolní bod). Nové bloky přepiš na nová jména tokenů (Po K1, tabulka přezdívek) a odškrtni je v tabulce.

5. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro bloky, pruchod, cesta, cesta2 až cesta8, cesta33, cesta34, stranky-osob, prohlidka, hodina-podoby), node scripts/kontrola-fokus.mjs na kroku cesty 1/2, 6/3 a na profilu Sókrata, klávesnicí na dvou výškách okna, node scripts/snimky-cesta.mjs na cestě 1 (s odpověďmi i bez) a node scripts/snimky-prvek.mjs na Volbě a Odkryj na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

6. Do plánu větve zapiš oddíl Po K4a: rám aktivity a jak ho použít, co se na Volbě a Odkryj změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K4a (mezi nimi čtenářský sloupec podle snímků) a uprav zadání K4b podle toho, co rám umí. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

7. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Zadání K4b: zbylé bloky

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K4a (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K4b větve design-v2, zbylé bloky ve společném rámu aktivity a jejich pohyb. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (poštovní razítko), Po K1 (přezdívky), Po auditu (bod 2 z Vizuálních zlepšení, Pravidlo střídmosti), Po D5, Po K4a a Co rozhodnout po K4a s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a v oddílu Bloky u každého bloku popis vzhledu a stavů (ne příklady YAML). Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti ze stránky Herní prvky (D5) jen styly a tělo předmětů pro Roztřiď, Spor a ukázky přichycení karty do koše, a z project/Pohyb.dc.html jen styly a skript ukázek Roztřiď a Spor. Když odpovědi po K4a něco mění, oprav nejdřív rám aktivity nebo Volbu a Odkryj.

1. Bloky ve společném rámu z K4a, jeden po druhém, každá rodina jako svůj předmět podle D5 (bod 2): Roztřiď (kapsy a obálky, karta se zvedne, přesun --d-presun), Změň jednu věc, Spor (dva přišpendlené lístky a mince na provázku po škále), Slož argument, Kdo žil dřív?, Příběh (deska z K3 už je nová), Kdo je na tvé straně, Návrat, Závěr cesty, Moje stanovisko, první názor, Zkus to žít (tlačítko v ostrovu), Dva životy (společná léta místo tinty). Pohyb podle Po D3 a D5; při omezeném pohybu je každý stav hned na konci.

2. Razítko člověka v blocích: Svelte verze (src/components/ui/RazitkoCloveka.svelte nad src/lib/razitko.ts, stejné SVG a CSS .razitko-cloveka jako Astro verze, i s městem a rokem z K3 dodatku) místo mapa/Mince.svelte v BlokHlava, BlokFilozof, Spor a Kdo žil dřív?; pod 48 px bez obvodu. Ostatní místa s mincí (seznam v Po K3) nech pro K6 a K7a.

3. Bloky přepiš na nová jména tokenů (Po K1, tabulka přezdívek): --surface, --rule, --sunk, --muted, --pc-tint, --pc-soft, --pohyb…; co přestanou používat, odškrtni v tabulce přezdívek v plánu. Když tinty období (--pc-tint, --period-N-tint) už nikdo nepoužívá, zapiš to; smaže je O.

4. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro bloky, pruchod, cesta, cesta2 až cesta8, cesta33, cesta34, sloz-argument, spor-reflexe, navrat, zaver, dva-zivoty, tyden, otazka, stranky-osob, prohlidka, hodina-podoby), node scripts/kontrola-fokus.mjs na kroku cesty 1/2, 6/3 a 4/6 a na profilu Sókrata, klávesnicí na dvou výškách okna, node scripts/snimky-cesta.mjs na cestě 1 (s odpověďmi i bez) a node scripts/snimky-prvek.mjs na každém bloku na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

5. Do plánu větve zapiš oddíl Po K4b: co se na blocích změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K4b a zadání K5 v plném znění (podle tabulky kroků: postup jako lístek, který se štípe, tichý Další krok, krátký přechod mezi kroky). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

6. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Uzavření

Po revizi a opravách otázka na schválení, kterou zodpoví jen autor. Po ní sloučení do hlavní větve, GitHub, plán a zadání do `docs/archiv/`, řádek v `docs/plan.md` a na řadě větev `herna-v1` (`docs/plan.md` › Další větve v pořadí).
