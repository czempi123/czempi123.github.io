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
| D5 | Herní prvky a vizuální zlepšení na plátně (oddíl Po auditu): společný rám aktivity, předmět pro každou rodinu aktivit, otočení karty, zamíchání, přichycení karty na osu a do koše, klepnutí do mapy, odhad posuvníkem a odhalení, razítko „sedí“ a lístek „zkus to jinak“ (bez červené a zelené), panel příběhu v obrazech (přehrávač zvuku odložený se zvukem, 12. 11. 2026); body 1 až 5 z Vizuálních zlepšení | Opus 5.5 · high se skillem `frontend-design` | hotovo 13. 11. 2026 (oddíl Po D5) |
| K3 dodatek | Stránky osob: body 1, 7, 8 a 9 z Vizuálních zlepšení (kapitola na čistém listu, vlepené věci různě, razítko s městem a rokem, obraz ke kapitole); na telefonu záložky otázek až za úvodní odstavec profilu; nejdřív ověřit přechod listu a let fotky v opravdovém Chromu (otázka 8 po K3) | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | hotovo 13. 11. 2026 (oddíl Po K3 dodatku); kontrolní bod se snímky |
| K4a | Společný rám aktivity pro všechny dnešní i budoucí aktivity (hlava, zadání, plocha, zpětná vazba jako lístek, Začít znovu) a první bloky: Volba, Odkryj, tlačítka, pole; studentova ruka (bod 3), aktivita na telefonu přes celou šířku (bod 11); tři snímky čtenářského sloupce (tečky, ztlumené tečky, čistý list) k rozhodnutí | totéž | hotovo 13. 11. 2026 (oddíl Po K4a); kontrolní bod se snímky |
| K4b | Zbylé bloky: Roztřiď, Změň jednu věc, Spor, Slož argument, Kdo žil dřív?, Příběh, Kdo je na tvé straně, Návrat, Závěr cesty, Moje stanovisko, první názor, Zkus to žít, Dva životy; každá rodina aktivit jako svůj předmět (bod 2); razítko člověka v blocích | totéž | hotovo 13. 11. 2026 (oddíl Po K4b) |
| K5 | Cesta: hlavička s postupem jako lístek, který se štípe (bod 4), spodní lišta, přehled cesty, karta cesty. **Další krok je tichý, dokud student neodpoví** nebo krok výslovně nepřeskočí; hlavní je tlačítko bloku. Přechod mezi kroky krátký (posun listu), otočení listu zůstává mezi stránkami; snímky pro autora | totéž | hotovo 14. 11. 2026 (oddíl Po K5); kontrolní bod se snímky |
| K6 | Stránky z dat a deník: Domů jako stůl s věcmi k vzetí (bod 10), období a pás období, papírnictví období (bod 5, tokeny `.obdobi-N`), živý okraj (bod 6), směr, otázka s osou hlasů, pokus, úvody, náboženství, Lidé, Otázky, **Můj deník jako opravdový zápisník** (Moje filozofie, sbírka, záznam jako lístek, přenos a záloha, tichá tečka u ikony Deník, když čeká Návrat; oddíl Mapa a deník: funkce), Tvoje antika, Stoický týden, příprava hodiny a promítání | totéž | hotovo 14. 11. 2026 (oddíl Po K6); kontrolní bod se snímky |
| K7a | Mapa a čas: podklad mapy jako výstřižek, karta člověka, řeka životů, posuvník, mince, Přehrát život a funkce z oddílu Mapa a deník: funkce; kontrolní snímky | totéž | hotovo 15. 11. 2026 (oddíl Po K7a); kontrolní bod se snímky |
| K6 dodatek | Kapitoly v deníku (připomínka autora 15. 11. 2026, otázka 5 po K7a): jedno další členění, doporučeně podle období | totéž | hotovo 15. 11. 2026 (oddíl Po K6 dodatku); kontrolní bod se snímky |
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

Provedená zadání D2 až K3 a D5 a zodpovězené otázky před D2, po D2, po D3, po K1 a po K2 jsou beze změny textu v `docs/archiv/plany/design-v2-d1-k3.md` (přesunuto v K3 dodatku 13. 11. 2026).

## Části plánu

Plán se 15. 11. 2026 rozdělil (pravidlo z `CLAUDE.md`: soubor pro Projekt Claude pod 35 kB). V tomhle souboru je stav, tabulka kroků, obsah větve a oddíly běžícího kroku; hotové oddíly jsou beze změny textu v částech níž. Když zadání jmenuje oddíl („Po D3“, „Po K1 › přezdívky“), najdeš ho podle tohoto seznamu. Když hlavní soubor přeroste 35 kB, hotové oddíly „Po …“, „Co rozhodnout po …“ a provedená zadání se přesunou do nové části a přibude řádek sem; tabulku přezdívek (Po K1) a odškrtávání v ní dál upravuj v části 2.

- `docs/plany/design-v2-1-d2-d3.md` (plátno: design systém a pohyb): Po D2 (8. 11. 2026), Po D3 (8. 11. 2026)
- `docs/plany/design-v2-2-d4-k1.md` (plátno: obrazovky, a základ kódu (tokeny, přezdívky)): Po D4 (8. 11. 2026), Co rozhodnout po D4, Po K1 (8. 11. 2026)
- `docs/plany/design-v2-3-k2-k3.md` (rám webu a stránky osob): Po K2 (8. 11. 2026), Po K3 (9. 11. 2026), Co rozhodnout po K3
- `docs/plany/design-v2-4-audit-d5.md` (po auditu a herní prvky na plátně): Po auditu (12. 11. 2026), Po D5 (13. 11. 2026), Co rozhodnout po D5, Zadání K3 dodatek: stránky osob po auditu
- `docs/plany/design-v2-5-k3d-k4a.md` (stránky osob po auditu, rám aktivity a první bloky): Po K3 dodatku (13. 11. 2026), Co rozhodnout po K3 dodatku, Zadání K4a: společný rám aktivity a první bloky, Po K4a (13. 11. 2026), Co rozhodnout po K4a
- `docs/plany/design-v2-6-k4b.md` (zbylé bloky): Zadání K4b: zbylé bloky, Po K4b (13. 11. 2026), Co rozhodnout po K4b, Zadání K5: cesta
- `docs/plany/design-v2-7-k5-k6.md` (cesta, stránky z dat a deník): Po K5 (14. 11. 2026), Co rozhodnout po K5, Zadání K6: stránky z dat a deník, Po K6 (14. 11. 2026), Co rozhodnout po K6
- `docs/plany/design-v2-8-k7a.md` (Mapa a čas): Zadání K7a: Mapa a čas, Po K7a (15. 11. 2026), Co rozhodnout po K7a, Zadání K6 dodatek: kapitoly v deníku

## Po K6 dodatku (15. 11. 2026)

Odpovědi po K7a byly prázdné v repozitáři i v Projektu Claude, takže platí všech šest doporučení: kapitoly v deníku **po obdobích**. Snímky jsou v `Claude outputs/snimky/design-v2-k6-dodatek/`.

### Co se v deníku změnilo

- **Nahoře beze změny:** titulek, Návrat, připomenutí zálohy a Moje filozofie po velkých otázkách.
- **Kapitoly** pod Moje filozofie (nadpis Kapitoly): jedna na období, které má stránku a v deníku něco. Kapitola je rozbalovací lístek s páskou v papíru období: rukou „období 2“, název období, léta a „naposledy 14. listopadu 2026“, vpravo vystouplý knoflík se šipkou. Rozbalená pokračuje listem s čárkovaným okrajem v inkoustu období.
- **V kapitole:** Rozpracované (lístky cest a oranžové záložky bloků toho období), Moje odpovědi a stanoviska seřazené podle cest a stránek, Sbírka období (koho jsem potkal, prošlé cesty, vystřižené citáty) a na konci poslední antické kapitoly odkaz Tvoje antika. Nadpis cesty je řádek („cesta · Kolik je dost?“ s odkazem), ne další rozbalování; profil, směr nebo pokus má stejný řádek se „stránka“. Přepínač Podle cest / Podle data je v každé kapitole a platí pro všechny.
- **Napříč obdobími** je poslední kapitola: zápisy ze stránek velkých otázek (první názor, Změnil se?) a z období, které ještě nemá stránku. Úvody Co je filozofie? a Co je náboženství? mají v datech období 1, takže jsou v kapitole Řecko.
- **Která je otevřená:** ta, kde student naposledy byl (zápis, krok cesty, návštěva stránky, kterou atlas zná; deník, Domů a mapa se nepočítají), a k ní ty, které si nechal otevřené. Stav kapitol a řazení si deník pamatuje v `localStorage` pod `atlas-denik-kapitoly` (ne v exportu deníku). Kapitola, kde student byl až po poslední změně stavu, se otevře znovu; zavřená zůstane zavřená, dokud tam student nebude.
- **Prázdná kapitola** se neukazuje; prázdný deník nemá ani nadpis Kapitoly.
- **Dole jednou pro celý deník:** Zkus to žít, přijaté výzvy, hodiny, pero, Záloha a přenos.
- **Kód:** logika `kapitolyDeniku`, `otevreneKapitoly`, `rozeberStavKapitol` a `adresaStranky` v `src/lib/zapisnik.ts` (`zaznamyPodleCest` teď stojí na společném výpisu záznamů); mapa stránek s obdobím a seznam období v `src/components/denik/_zapisnik-data.ts`; ostrov `Denik.svelte`; `SbirkaDeniku.svelte` umí úroveň nadpisu a id kapitoly (v kapitole je oddíl bez oblasti, ať se oblasti nejmenují osmkrát stejně). Popis v `docs/design.md` › Můj deník jako zápisník, rozhodnutí v `docs/rozhodnuti.md`.

### Testy a kontrola

- `npm run build` prošel. Vitest celý (1 397 testů); nový `tests/data/zapisnik-kapitoly.test.ts`: deník prázdný, s jedním a se dvěma obdobími, kapitola Napříč obdobími, kapitola bez záznamů, otevřená kapitola a zapamatovaný stav.
- Playwright: nový `tests/e2e/denik-kapitoly.spec.ts` (prázdný, jedno a dvě období, přepínač podle data po obnovení, klávesnice, zapamatované kapitoly, axe a přetečení na 390 a 1440 px ve dne i v noci se všemi kapitolami otevřenými). Starší testy, které čtou zápisy v deníku (13 souborů), přepnou výpis podle data pomůckou `tests/e2e/denik.ts`; `tvoje-antika` hledá odkaz na konci kapitoly. Dotčené soubory: 202 testů prošlo.
- **Klávesnice:** lístek kapitoly se otevře a zavře Enterem i mezerníkem, Esc nic nezmění a fokus zůstane na lístku, tabulátor jde z lístku dovnitř kapitoly; stav vydrží obnovení (v testu).
- `scripts/kontrola-fokus.mjs` (nově umí `ULOZISTE`) na `/denik/` s prázdným deníkem (19 prvků), plným (52) a plným se všemi kapitolami otevřenými (70), na 390 a 1440 px: bez nálezu.
- **Celé `npm test`** před commitem jednou: kontrola typů bez chyb, Vitest 1 397, Playwright 758 ze 758 (8,8 min; i `ram.spec.ts:85`, který po K6 vypadával).
- **Snímky** (`scripts/snimky-listy.mjs`, plný deník z `tests/e2e/data/denik-kapitoly.json`): `denik-kapitoly-*` na 390 a 1440 px ve dne i v noci (otevřená poslední kapitola), `denik-kapitoly-vse-390-light-1` a `denik-kapitoly-vse-1440-dark-1` se všemi kapitolami otevřenými.

### Nad čím jsem váhal a co by šlo jinak

- **Kam dát zápisy z otázek.** Stránka velké otázky nepatří jednomu období; jejich zápisy jsou v kapitole Napříč obdobími a zároveň (jako dosud) v Moje filozofie. Jinak: kapitolu Napříč obdobími vynechat a nechat je jen v Moje filozofie; zmizel by ale jejich výpis podle data.
- **Rozpracované bloky** (oranžové záložky) jsou v kapitole svého období, ne nahoře. Rozpracovaný blok na stránce otázky je v Napříč obdobími.
- **Přepínač je jeden pro celý deník**, i když stojí v každé kapitole: kdo chce výpis podle data, chce ho všude. Výchozí je podle cest, jak říká zadání.
- **Stav kapitol není v exportu deníku**: je to nastavení pohledu, ne studentova práce. Na novém zařízení se otevře kapitola, kde student naposledy byl.
- **Tvoje antika** stojí na konci kapitoly Helenismus a Řím (poslední kapitola antiky); když ji student nemá, na konci kapitol. Dál vede na ni i odkaz pod Moje filozofie.
- **Nadpis kapitoly je v lístku** (`<h3>` v `<summary>`, HTML to dovoluje), aby šlo v deníku skákat po nadpisech. Jak to čte VoiceOver, ověří revize R.
- **Profily, směry a pokusy** dostaly v kapitole vlastní řádek vedle cest („stránka · Epikúros“), řazený podle poslední návštěvy. Jinak: všechno mimo cesty pod jeden řádek „Stránky období“.

## Co rozhodnout po K6 dodatku

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-k6-dodatek/`). Prázdná odpověď znamená souhlas s doporučením.

1. **Kapitoly po obdobích jako rozbalovací lístky** (snímky `denik-kapitoly-*`): lístek s páskou, období rukou, léta a „naposledy“, knoflík se šipkou, rozbalená kapitola s čárkovaným okrajem. Doporučuji ano.
   Odpověď:

2. **Kapitola Napříč obdobími** na konci pro zápisy ze stránek otázek (snímek `denik-kapitoly-vse-390-light-1`). Doporučuji ano.
   Odpověď:

3. **Výpis podle cest jako výchozí, jeden zapamatovaný přepínač pro všechny kapitoly.** Doporučuji ano.
   Odpověď:

4. **Výzvy, Stoický týden a hodiny zůstávají pod kapitolami pro celý deník** (je jich málo). Jinak: přijaté výzvy do kapitol podle stránky, odkud jsou. Doporučuji nechat.
   Odpověď:

5. **Chceš něco změnit na snímcích po K6 dodatku?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání K7b: kresby jako koláž

Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta`. Pusť v novém chatu v Projektu Atlas filozofie, až bude hotový K6 dodatek. Když se krok nevejde do jednoho sezení, udělej nejdřív rám `Kresba.svelte` a polovinu kreseb a zapiš, co zbylo.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K7b větve design-v2, kresby jako koláž. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků a oddíl Části plánu, podle něj z částí oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co je na kterých obrazovkách: Kresba; Co se proti design systému změnilo: Kresby jako koláž), Po K1 (přezdívky), Po auditu (Pravidlo střídmosti, Vizuální zlepšení bod 9), Po K7a (Přezdívky), Co rozhodnout po K7a a Co rozhodnout po K6 dodatku s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen oddíl Kresba s pohybem. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/KresbaVitr.dc.html jen styly a tělo obrazovky (ne pult náhledu a skript). Když odpovědi po K7a něco mění na mapě nebo odpovědi po K6 dodatku na deníku (Denik.svelte, src/lib/zapisnik.ts), oprav to nejdřív.

1. Rám Kresba.svelte v novém papíru: plátno je tečkovaný papír přilepený na list, ovládání (přepínače, posuvník, Zastavit pohyb) ve vtlačené drážce, popisek pod kresbou. Pravidla kreseb v global.css (k-svetlo, k-stin, k-tma a další) převeď z desky období (--pc-plate, --pc-on-plate) na koláž: výstřižky (--list, --listek, papír období --pp) se stínem výstřižku bez obrysových čar, zem a horizont natržený pruh papíru, směr, pohyb a síly tužkou (--tuzka, čárkovaně), barva období jen na jednom nositeli významu, text v kresbě na lístečku s páskou Kalamem, popisky Instrument Sans; v noci tytéž tokeny (pravidla v Po D4).

2. Všech třináct kreseb (src/components/ostrovy: Jeskyne a ostatní, které Kresba.svelte obaluje, i GrafKrivek.astro) přepiš na koláž. Pohyb jen transform, opacity a tah tužky; s omezeným pohybem kresba stojí a text pod ní říká totéž; po Zastavit pohyb kreslí obsah, ne začátek smyčky (skill atlas-komponenta). Kresba, kterou autor zná jako „úžasnou“ (jeskyně), nesmí ztratit nic z toho, co ukazuje.

3. Obraz ke kapitole (Vizuální zlepšení, bod 9) tam, kde ho nese kresba: atribut nebo předmět kapitoly jako velké vybledlé razítko u nadpisu.

4. Mini mapa a mini osa v profilu (MiniMapa.astro, MiniOsa.astro) v novém papíru jako výstřižek (jako Mapa a čas po K7a: moře šrafované tužkou, vodní linky, pevnina na lístkovém papíře, rámeček), razítka místo mincí; trasy zůstanou ručně kreslené.

5. Přepiš kresby, mini mapu a mini osu na nová jména tokenů (Po K1, tabulka přezdívek): --paper, --surface, --sunk, --rule, --muted, --pc, --pc-tint, --pc-soft, --pohyb, --pohyb-kamera, --r-…, --map-*; co přestanou používat, odškrtni v tabulce přezdívek (část 2 plánu, Po K1). Zapiš, co z přezdívek a tint období po K7b ještě zbývá (po K7a: kresby, mini mapa, mini osa, global.css a nepoužívané ui/Mince.astro a mapa/Mince.svelte); smaže je O.

6. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro kresby, cesty s kresbami, mini-mapa, stranky-osob, dilna a ty, které spadnou), node scripts/kontrola-fokus.mjs na stránkách s kresbami (cesta 3 krok 1, dílna Kresby) a na profilu Sókrata, klávesnicí na dvou výškách okna (ovládání kreseb), jednou se zpomaleným procesorem u kresby s pohybem a posuvníkem, node scripts/snimky-prvek.mjs na každé kresbě ve dne i v noci na 390 a 1440 px a node scripts/snimky-listy.mjs na profilu Sókrata (mini mapa, mini osa). Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po K7b: co se na kresbách změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K7b a zadání kroku P v plném znění (podle tabulky kroků). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md a části plánu, které se změnily.

8. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Uzavření

Po revizi a opravách otázka na schválení, kterou zodpoví jen autor. Po ní sloučení do hlavní větve, GitHub, plán a zadání do `docs/archiv/`, řádek v `docs/plan.md` a na řadě větev `herna-v1` (`docs/plan.md` › Další větve v pořadí).
