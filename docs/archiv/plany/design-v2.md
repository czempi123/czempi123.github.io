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
| K7b | Třináct kreseb jako koláž na rámu `Kresba.svelte` v novém papíru a v tmavém režimu (pravidla v Po D4); obraz ke kapitole (bod 9) tam, kde ho nese kresba; kontrolní snímky | totéž | hotovo 15. 11. 2026 (oddíl Po K7b); kontrolní bod se snímky |
| P | Pojmy: kolekce `pojmy`, komponenta Pojem (poznámka na okraji na notebooku, lístek po klepnutí na telefonu, fokus z klávesnice), stránka `/pojem/<id>/`, první vlna pojmů z antiky s podklady, vyznačení v textech; české tvary jmen pro hledání (Pagefind neskloňuje) | podklady Opus 5.5 · high (`atlas-overeni`), komponenta Opus 5.5 · high (`atlas-komponenta`), texty `atlas-psani` | hotovo 15. 11. 2026 (oddíl Po P); kontrolní bod se snímky |
| R | Revize celé větve: všechny typy stránek na 390 a 1440 px ve světlém i tmavém režimu, kontrast, klávesnice, čtečka, omezený pohyb, výkon na autorově telefonu a na jednom levném se systémem Android (když otočení listu trhá, přepne se samo na krátký přechod), váha HTML stránek osob, Zod v ostrovu `SlozArgument` | Opus 5.5 · high se skillem `atlas-revize` a pluginem Design (`design:accessibility-review`, `design:design-critique`) | hotovo 15. 11. 2026 (oddíl Po R, záznam `docs/revize/design-v2.md`); kontrolní bod se snímky |
| O | Opravy po revizi, **přepínač Klidný režim** v záhlaví (krátké přechody i bez nastavení systému, čistý papír; bod 12), `docs/design.md` napsat znovu a krátce (dnes 144 kB), do testů dvanáct referenčních snímků klíčových obrazovek, skill `atlas-komponenta` s oddíly Papír a Pohyb, `docs/pouceni.md` | Opus 5.5 · high | hotovo 15. 11. 2026 (oddíl Po O); VoiceOver neověřený, odložený (Co zůstává na později); kontrolní bod se snímky |
| Uzavření | Podle odpovědí po O: VoiceOver s autorem u Macu (otázka 2), smazání nepoužívaných Mincí a zbylých přezdívek (otázka 3); pak sloučení, GitHub, kontrola nasazeného webu a prvního běhu kontrol (referenční snímky na Linuxu) | Opus 5.5 · medium | hotovo 16. 11. 2026 (oddíl Uzavření): Mince a přezdívky smazané, VoiceOver odložený, větev sloučená do hlavní větve a na GitHubu |

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
- Kontrola VoiceOverem (odložená autorem 16. 11. 2026; axe a klávesnice jsou čisté): kapitoly deníku (nadpis s tlačítkem, nesmí zmizet z přehledu nadpisů), pojem na okraji, krok cesty s blokem, kresba, Mapa a čas. Nejjednodušší je zapnout VoiceOver na iPhonu a deník poslechnout; když nadpis kapitoly zmizí, předělat ho na `h3` s tlačítkem uvnitř a datem v `aria-describedby`.

Provedená zadání D2 až K3 a D5 a zodpovězené otázky před D2, po D2, po D3, po K1 a po K2 jsou beze změny textu v `docs/archiv/plany/design-v2-d1-k3.md` (přesunuto v K3 dodatku 13. 11. 2026).

## Části plánu

Plán se 15. 11. 2026 rozdělil (pravidlo z `CLAUDE.md`: soubor pro Projekt Claude pod 35 kB). V tomhle souboru je stav, tabulka kroků, obsah větve a oddíly běžícího kroku; hotové oddíly jsou beze změny textu v částech níž. Když zadání jmenuje oddíl („Po D3“, „Po K1 › přezdívky“), najdeš ho podle tohoto seznamu. Když hlavní soubor přeroste 35 kB, hotové oddíly „Po …“, „Co rozhodnout po …“ a provedená zadání se přesunou do nové části a přibude řádek sem; tabulku přezdívek (Po K1) a odškrtávání v ní dál upravuj v části 2.

- `docs/archiv/plany/design-v2-1-d2-d3.md` (plátno: design systém a pohyb): Po D2 (8. 11. 2026), Po D3 (8. 11. 2026)
- `docs/archiv/plany/design-v2-2-d4-k1.md` (plátno: obrazovky, a základ kódu (tokeny, přezdívky)): Po D4 (8. 11. 2026), Co rozhodnout po D4, Po K1 (8. 11. 2026)
- `docs/archiv/plany/design-v2-3-k2-k3.md` (rám webu a stránky osob): Po K2 (8. 11. 2026), Po K3 (9. 11. 2026), Co rozhodnout po K3
- `docs/archiv/plany/design-v2-4-audit-d5.md` (po auditu a herní prvky na plátně): Po auditu (12. 11. 2026), Po D5 (13. 11. 2026), Co rozhodnout po D5, Zadání K3 dodatek: stránky osob po auditu
- `docs/archiv/plany/design-v2-5-k3d-k4a.md` (stránky osob po auditu, rám aktivity a první bloky): Po K3 dodatku (13. 11. 2026), Co rozhodnout po K3 dodatku, Zadání K4a: společný rám aktivity a první bloky, Po K4a (13. 11. 2026), Co rozhodnout po K4a
- `docs/archiv/plany/design-v2-6-k4b.md` (zbylé bloky): Zadání K4b: zbylé bloky, Po K4b (13. 11. 2026), Co rozhodnout po K4b, Zadání K5: cesta
- `docs/archiv/plany/design-v2-7-k5-k6.md` (cesta, stránky z dat a deník): Po K5 (14. 11. 2026), Co rozhodnout po K5, Zadání K6: stránky z dat a deník, Po K6 (14. 11. 2026), Co rozhodnout po K6
- `docs/archiv/plany/design-v2-8-k7a.md` (Mapa a čas): Zadání K7a: Mapa a čas, Po K7a (15. 11. 2026), Co rozhodnout po K7a, Zadání K6 dodatek: kapitoly v deníku
- `docs/archiv/plany/design-v2-9-k6d-k7b.md` (deník po obdobích a zadání kreseb): Po K6 dodatku (15. 11. 2026), Co rozhodnout po K6 dodatku, Zadání K7b: kresby jako koláž
- `docs/archiv/plany/design-v2-10-k7b-p.md` (kresby jako koláž a zadání pojmů): Po K7b (15. 11. 2026), Co rozhodnout po K7b, Zadání P: pojmy
- `docs/archiv/plany/design-v2-11-p-r.md` (pojmy a zadání revize): Po P (15. 11. 2026), Co rozhodnout po P, Zadání R: revize celé větve
- `docs/archiv/plany/design-v2-12-r-o.md` (revize a zadání oprav): Po R (15. 11. 2026), Co rozhodnout po R, Zadání O: opravy po revizi

## Po O (15. 11. 2026)

Odpovědi po R byly prázdné v repozitáři i v Projektu Claude, takže platí všech devět doporučení (otázka 9 bez změn). Snímky pro kontrolu v `Claude outputs/snimky/design-v2-o/` (`o-01` až `o-16`, jedno okno každý; `scripts/snimky-o.mjs`).

### Co se změnilo

- **Jedna páska na obrazovku (1):** Výprava v Mapě a čase bez pásky; druhý lístek „na začátek“ na Domů drží sponka; kapitoly deníku mají místo pásky ohyb dole v inkoustu období (jako záložky rozpracovaných otázek), páska v deníku zůstala jen Návratu; první kapitola profilu pod deskou se dvěma páskami pásku nemá.
- **Mapa a čas (2):** popisky krajů a moří, které by ležely pod lístečkem, lístečkem člověka mimo výřez, měřítkem s kreditem, růžicí nebo špendlíkem, se schovají celé (šířka se měří písmem názvu, dřív odhad podle počtu písmen a jen ztlumení). Lísteček, který by zakryl cizí špendlík (celé tlačítko 44 px, `rozmistiListky(…, cilSpendliku)`), hledá jiný roh, jinak zůstane jen špendlík: Kyzikos a Chalkédón mají v roce 360 př. n. l. na telefonu oba špendlík. Na ose na notebooku je pruh s bitvou uvnitř (Řecko-perské války s Marathónem a Salamínou) tlačítkem jen svým názvem nad osou, tečky bitev na pruhu jsou vlastní tlačítka.
- **Stoický týden ve Spojení (3):** hlavička stránek z dat (titulek s pruhem „Sedm dní, sedm cvičení“, ve stupni h1, aby se vešel do sloupce), námitka a pravidla na čistém listu, dny jako lístky, otevřený den jako čistý list, „Kdy přestat“ jako lepicí lístek s proužkem lepidla, hotový den má číslo přeškrtnuté tužkou. Texty beze změny.
- **Lehčí stránky osob (4):** obrys pobřeží mini mapy je sdílený soubor `/podklad/<klíč>.svg` (33 výřezů; `src/lib/podklad-sdileny.ts`), Dva životy nesou jen osobu, výchozí dvojici a id lidí v nabídce, jména a roky si stáhnou ze sdíleného `/dva-zivoty.json`. Aristotelés 269 → 207 kB, Platón 265 → 217 kB, Sókratés 237 → 180 kB.
- **Otočení listu (5):** beze změny, 900 ms s pojistkou plynulosti.
- **Texty (8):** obec a soud bez úvodního „Ne…, ale“, perex deníku bez věty, kterou říká pruh.
- **Letopočty:** 80 míst v `dist/` s obyčejnou mezerou (popisky a kredity obrázků, Prameny, Kde jsme, nadtitulky Příběhu, Mapa a čas v přehledu cesty, poznámky vztahů, osa Dvou životů a Kdo žil dřív?, karta v Mapě a čase) je na nule; test `tests/e2e/letopocty-dist.spec.ts` hledá v celém sestaveném webu i ve vlastnostech ostrovů, výpis `scripts/letopocty-dist.py`.
- **Klidný režim (bod 12, otázka 7):** přepínač s lístkem v záhlaví vedle dne a noci (`KlidnyRezim.astro`, `aria-pressed`), stav `atlas-klidny` v `localStorage`, nastavený skriptem v hlavičce před vykreslením. Zapnutý dá každému příchodu krátké prolnutí (typ `kratky` jako pojistka plynulosti, i mezi kroky cesty), vypne příchod na profil a let fotky, papír je bez teček (`--tecka`) a bez natočení (nový token `--natoceni`, 47 natočení v komponentách ho teď násobí) a poznámky pojmů na okraji jsou tiskem (Newsreader 15 px). Test `klidny-rezim.spec.ts`: 390 a 1440 px ve dne i v noci, z klávesnice, axe, bez probliknutí, krátký přechod, poznámky tiskem.
- **VoiceOver (6): neověřený.** Spustit VoiceOver a povolit jeho ovládání AppleScriptem je nastavení přístupnosti, které mi systém neprovedl (zaškrtnutí v Utilitě VoiceOver odmítl, klávesy do Safari computer use nepouští). Kapitoly deníku jsou proto beze změny; ověření je otázka 2 níž.
- **Referenční snímky:** `tests/e2e/snimky.spec.ts`, dvanáct obrazovek (Domů na telefonu ve dne a na notebooku v noci, profil obojí, krok cesty se Sporem, přehled cesty, velká otázka, období, Mapa a čas, kapitoly deníku, pojem, kresba Jeskyně), jen Chromium, jeden snímek pro Mac i Linux v `tests/e2e/snimky/` (`snapshotPathTemplate` v `playwright.config.ts`), tolerance `threshold 0,3`, `maxDiffPixelRatio 0,04`, pevné datum a omezený pohyb. Třikrát po sobě stabilní.
- **`zivot-na-mape.spec.ts:117`:** roky se čtou z historie přehrávání, kterou si Mapa a čas vede sama (`rokyMeziSnimky`: i zastávka, kterou snímek při zátěži přeskočil), ne vzorkováním posuvníku; test ve Vitestu.
- **`docs/design.md`** napsaný znovu: 163 kB → 21 kB (tokeny, Papír se Spojením, Pravidlem střídmosti a stavy prvků, Pohyb s přechody, pojistkou a Klidným režimem, bloky, komponenty jako mapa souborů). Stará verze beze změny v `docs/archiv/design-2026-11-15.md`; odkazy v kódu na zrušené oddíly vedou tam. Výpis API komponent `scripts/komponenty-api.py`.
- **Skill `atlas-komponenta`** má oddíly Papír a Pohyb (i kopie ve `skills/`, včetně `references/vzor-komponenty.md` s novými tokeny); `docs/pouceni.md` má sedm vět z R a O.
- **Úklid:** smazané přezdívky tokenů, které nikdo nepoužíval (`--sunk`, `--rule`, `--map-*`, `--fs-display-*` s třídami, `--r-xs` až `--r-lg`, `--stin-*`, `--pohyb*`) a pravidla `html[data-sloupec]` ze snímků K4a. Odkaz Přeskočit na obsah je pevný vůči oknu (po Tabu z konce stránky byl mimo obrazovku).

### Testy a kontrola

`npm run build` prošel. Dotčené testy (týden, Klidný režim, letopočty, snímky, Mapa a čas, Život na mapě, Dva životy, mini mapa, deník, Domů, pojem, rám, stránky osob, nové stránky, Doba a lidé, cesty): 252 z 252. Axe (`revize-axe.mjs`) na 12 dotčených stránkách a v plném deníku: 0 nálezů. Skutečný tabulátor (`revize-tabulator.mjs`) na Domů, Mapě a čase, týdnu, profilu, přehledu cesty a plném deníku: po opravě tlačítka války a odkazu Přeskočit na obsah bez potíží. Celé `npm test` před commitem: kontrola typů bez chyb, Vitest 1 486 z 1 486, Playwright 796 z 796 (9,2 min); po něm jen menší titulek Stoického týdne, `tyden.spec.ts` znovu 16 z 16.

### Nad čím jsem váhal

- **Válka na ose bez popisku pod osou.** Doporučení mluvilo o popisku kratší události pod osou; pod osou je ale hned drážka posuvníku a nový řádek by osu rozšířil. Bitvy uvnitř války jsou tečky s názvem po najetí a fokusu (tak to bylo), válka se vybírá svým názvem. Jinak: řádek pod drážkou jen pro takové bitvy.
- **Dva malé lístečky vedle sebe dají dva špendlíky.** Kyzikos i Chalkédón mají po jednom člověku; menší místo nemá žádné, a tak lísteček nedostal ani jeden. Jinak: lísteček dostane to, které je v pořadí dřív, i za cenu, že zakryje polovinu cizího špendlíku.
- **Klidný režim zkracuje i posun mezi kroky cesty** a vypíná příchod na profil; kresby s pohybem a pohyb po činu studenta (lístek, kroužek) zůstávají, protože je spouští student. Ikona je lístek ze stromu, ne list papíru, aby se nepletla s Deníkem.
- **Tolerance snímků jsem na Linuxu neověřil.** Písma jsou lokální, takže zalomení je stejné; jestli vyhlazení hran na GitHubu nepřekročí 4 % pixelů, ukáže první běh kontrol po sloučení. Kdyby ano, stačí zvednout `maxDiffPixelRatio` v `snimky.spec.ts`.
- **Zbylé přezdívky** (`--paper`, `--surface`, `--pc*`, `--r-full`, `--muted`) drží jen nepoužívané `ui/Mince.astro` a `mapa/Mince.svelte` a `.t-popisek`. Smazat je znamená smazat soubory, proto otázka 3.

## Co rozhodnout po O

Prázdná odpověď znamená souhlas s doporučením, kromě otázky 1.

1. **Schvaluješ větev design-v2 ke sloučení do hlavní větve a poslání na GitHub?** Tuhle otázku zodpovídáš jen ty; bez odpovědi se nic neslučuje.
   Odpověď: ano (16. 11. 2026, „Vše schvaluji“).

2. **VoiceOver:** chceš kapitoly deníku a čtyři další místa ověřit VoiceOverem před sloučením? Potřebuju, abys sám zapnul v Utilitě VoiceOver „Povolit ovládání funkce VoiceOver pomocí AppleScriptu“ (a pak ho zase vypnul). Doporučuji ano, na začátku kroku Uzavření; když nadpis kapitoly zmizí, předělám ji na nadpis s tlačítkem.
   Odpověď: ano; nastavení v Utilitě VoiceOver zapíná a vypíná autor.

3. **Smazat nepoužívané `ui/Mince.astro` a `mapa/Mince.svelte`** i se zbylými přezdívkami tokenů a `.t-popisek` přepnout na `--ink-3`? Doporučuji ano, v kroku Uzavření.
   Odpověď: ano; hotovo v kroku Uzavření (barva období v `obdobi.yaml` je teď `--p-N`).

4. **Chceš něco změnit na snímcích po O?** Hlavně `o-01` (Mapa a čas na telefonu), `o-03` (osa), `o-05` a `o-06` (deník), `o-07` až `o-09` (Stoický týden), `o-11` až `o-14` (Klidný režim). Bez odpovědi zůstává, jak je.
   Odpověď: snímky zůstávají, jak jsou.

## Uzavření

Po revizi a opravách otázka na schválení, kterou zodpoví jen autor (Co rozhodnout po O, otázka 1). Před sloučením podle odpovědí 2 a 3 ověření VoiceOverem s autorem a smazání nepoužívaných Mincí. Po ní sloučení do hlavní větve, GitHub, plán a zadání do `docs/archiv/`, řádek v `docs/plan.md` a na řadě větev `herna-v1` (`docs/plan-vetve.md` › Další větve v pořadí).

**Hotovo 16. 11. 2026.** Autor schválil všechny čtyři odpovědi po O. Smazané nepoužívané `ui/Mince.astro` a `mapa/Mince.svelte` i se zbylými přezdívkami tokenů (tinty a desky období, `--muted`, `--paper`, `--surface`, `--period-N`, `--r-full`); `.t-popisek` je v `--ink-3`, barva období v `obdobi.yaml` je `--p-N`. Ovládání VoiceOveru přes AppleScript se na Macu nezapnulo a autor kontrolu odložil (Co zůstává na později). Celé `npm test` prošlo (Vitest 1412, Playwright 796). Větev je sloučená do hlavní větve a na GitHubu; plán je v `docs/archiv/plany/`.
