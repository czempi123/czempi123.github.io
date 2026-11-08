# Větev design-v2: nový vzhled a pohyb

Nový vzhled atlasu ve stylu scrapbooku s prvky neumorfismu, přechody a animace, díky kterým web působí živě a odpovídá na každý čin studenta, a krátké vysvětlení pojmu po najetí na slovo (třeba „ontologie“). Přání autora z 1. 11. 2026, ladí se společně s ním; podle rozhodnutí ze 7. 11. 2026 běží ještě před prvním celkem středověku. Větev založena 7. 11. 2026, plátno: https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ

**Proč teď.** Středověk přinese nové šablony a bloky (stránka období, Úryvek s otázkou, Dialog, Kolo Štěstěny) a hodně pojmů. V novém vzhledu a s novým pohybem vzniknou jen jednou.

## Kroky

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| D1 | Tři směry na plátně a jejich spojení podle autora | Opus 5.5 · high se skillem `frontend-design` | hotovo 7. 11. 2026; spojení autor schválil 7. 11. 2026 |
| D2 | Design systém na plátně: tokeny (papír, plochy, stíny vystouplé a vtlačené, inkousty, páska a razítko pro osm období, písma a jejich role), knihovna prvků ve všech stavech, tmavý režim („noční zápisník“); kontrast AA výpočtem | Opus 5.5 · high se skillem `frontend-design` | hotovo 8. 11. 2026 (oddíl Po D2) |
| D3 | Pohyb na plátně: živé ukázky celého jazyka pohybu (oddíl Pohyb) a jeho pravidla | Opus 5.5 · high se skillem `frontend-design` | hotovo 8. 11. 2026 (oddíl Po D3); odpovědi po D3 8. 11. 2026 |
| D4 | Obrazovky na plátně: Domů, Mapa a čas, profil, krok cesty, stránka otázky, stránka období jiné barvy (Helenismus a Řím), Můj deník a jedna kresba; notebook a telefon, světlý a tmavý režim | Opus 5.5 · high se skillem `frontend-design` | na řadě |
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

## Uzavření

Po revizi a opravách otázka na schválení, kterou zodpoví jen autor. Po ní sloučení do hlavní větve, GitHub, plán a zadání do `docs/archiv/`, řádek v `docs/plan.md` a na řadě krok Z plánu středověku.
