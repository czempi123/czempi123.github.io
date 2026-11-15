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
- `docs/plany/design-v2-9-k6d-k7b.md` (deník po obdobích a zadání kreseb): Po K6 dodatku (15. 11. 2026), Co rozhodnout po K6 dodatku, Zadání K7b: kresby jako koláž
- `docs/plany/design-v2-10-k7b-p.md` (kresby jako koláž a zadání pojmů): Po K7b (15. 11. 2026), Co rozhodnout po K7b, Zadání P: pojmy
- `docs/plany/design-v2-11-p-r.md` (pojmy a zadání revize): Po P (15. 11. 2026), Co rozhodnout po P, Zadání R: revize celé větve

## Po R (15. 11. 2026)

Odpovědi po P byly prázdné v repozitáři i v Projektu Claude, takže platí všech šest doporučení a na pojmech se nic neměnilo. Záznam revize s inventurou, měřeními a nálezy ve formátu `atlas-revize` je v `docs/revize/design-v2.md`; snímky v `Claude outputs/snimky/design-v2-r/`.

### Co revize našla

- **Strojově čisté:** axe na všech 24 typech stránek (390 a 1440 px, den a noc, plný deník) bez nálezu; kontrast úplné matice inkoustů na plochách ve dne i v noci v pořádku (doplněno do `kontrast.test.ts`); skutečný tabulátor na čtyřech velikostech okna nikde pod lištou; omezený pohyb vypne všechno; sám od sebe se hýbe jen příchod na stránku a kresby s pohybem.
- **Výkon** (Chrome, procesor 6× pomalejší, Fast 3G, 390 px): otočení listu 45 až 57 snímků za sekundu, ale první snímek 117 až 201 ms; posun mezi kroky 57 až 64; Mapa a čas 57; kresby 60. Stránky osob 230 až 269 kB (mini mapa s obrysem pobřeží 50 kB, Dva životy 23 kB).
- **Zásadní nálezy k rozhodnutí** (otázky níž): víc pásek na obrazovce (Mapa a čas, Domů, deník), popisky a lístečky přes sebe v Mapě a čase na telefonu, Stoický týden ve starém vzhledu, těžké stránky osob, kapitoly deníku neověřené VoiceOverem, ruční písmo poznámek pojmů, čtyři vysvětlení pojmů se stejnou stavbou.

### Co revize opravila

- **Prázdná deska:** Příběh bez obrazu a bez osoby (sedm kroků cest, Co je filozofie?, Judaismus) ukazoval prázdný rámeček; teď na desce leží ornament období tužkou (`Deska.astro`).
- **Letopočty:** `nezlomitelne()` váže i „423 př. n. l.“ (test v `sazba.test.ts`); pohlednice na Domů stojí rovně (text o pěti větách se nenatáčí); „Zpět na Lidi a směry“.
- **Zod v ostrovu Slož argument:** konstanty v `src/lib/argument-id.ts`, balíček ze 114 kB na 17 kB; validace zůstává při sestavení.
- **Pojistka plynulosti:** `src/scripts/plynulost-prechodu.ts` měří každé otočení listu; po dvou ze tří pod 30 snímků za sekundu dostane zařízení krátké prolnutí (typ přechodu `kratky`, `global.css`). Testy `plynulost-prechodu.test.ts` a `ram.spec.ts`.
- **Nástroje pro další revize:** `scripts/revize-tabulator.mjs` (skutečný Tab na více velikostech okna), `revize-design-v2-pohyb.mjs` (co se hýbe bez činu studenta a při omezeném pohybu), `revize-ctecka.mjs` (strom přístupnosti), `revize-vykon.mjs` (snímky za sekundu při zpomalení), `revize-design-v2-snimky.sh` (listy všech typů); `revize-axe.mjs` umí plný deník (`ULOZISTE`).

### Testy

`npm run build` prošel; celé `npm test` před commitem: kontrola typů bez chyb, Vitest 1 485 z 1 485, Playwright 775 ze 776 (10,3 min). Spadl `zivot-na-mape.spec.ts:117` (Přehrát: test vzorkuje roky za běhu a při zátěži stroje jeden rok přeskočí); samostatně prošel třikrát ze tří, oprav se netýká. Krok O ho má zpevnit (číst rok z historie přehrávání, ne vzorkovat). `denik-kapitoly.spec.ts:101`, který po P spadl, tentokrát prošel.

### Nad čím jsem váhal

- **Ornament, ne prázdná deska ani žádná deska.** Šlo by desku bez obrazu vynechat a dát textu celou šířku; Příběh by ale v kroku cesty ztratil rozvržení scény a obraz, podle kterého si student krok pamatuje. Ornament je ozdoba, která nic netvrdí, a komentář Příběhu ho sliboval.
- **Pojistka, i když emulace pod 30 snímků nespadla.** Zadání chtělo přepnutí jen tam, kde otočení trhá; skutečný levný telefon může být pomalejší než šestkrát zpomalený Mac, a měření na zařízení samo rozhodne. Na plynulém zařízení se nic nemění.
- **VoiceOver jsem nepouštěl:** mluví nahlas a ovládá celý Mac, kdežto ty jsi u počítače nebyl. Strom přístupnosti v Chromiu ukazuje jména a pořadí; co s nadpisem v rozbalovacím lístku udělá Safari, ověří O.
- **Pásky a Stoický týden jen navrhuji:** obrazovky s páskami jsi na kontrolních bodech viděl a schválil; pravidlo střídmosti mluví jinak, tak rozhodni ty.

## Co rozhodnout po R

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-r/`; záznam `docs/revize/design-v2.md`). Prázdná odpověď znamená souhlas s doporučením.

1. **Jedna páska na obrazovku** (snímky `r-mapa-390-dark-*`, `r-domu-390-light-*`, `r-denik-390-light-*`): Výprava v Mapě a čase bez pásky, druhý lístek „na začátek“ na Domů se sponkou, kapitoly deníku bez pásky (lístek s ohybem), páska jen u Návratu. Doporučuji ano.
   Odpověď:

2. **Mapa a čas na telefonu** (`r-mapa-390-*`, `r-mapa-1440-light-*`): popisky krajů a moří, které by ležely pod lístečkem, měřítkem nebo kreditem, se schovají; ze dvou překrytých lístečků zůstane u menšího místa špendlík; kratší událost na ose dostane popisek pod osou. Doporučuji ano.
   Odpověď:

3. **Stoický týden ve vzhledu Spojení** (`r-tyden-*`): titulek s pruhem, dny jako lístky, otevřený den jako čistý list; texty beze změny. Doporučuji ano.
   Odpověď:

4. **Lehčí stránky osob:** obrys pobřeží mini mapy jako jeden sdílený soubor a Dva životy jen s nabídkou jmen a roků; asi o 70 kB méně na každé stránce osoby, vzhled beze změny. Doporučuji ano.
   Odpověď:

5. **Otočení listu:** ponechat 900 ms s pojistkou (krátké prolnutí jen na zařízení, kde trhá), nebo otočení zkrátit pro všechny? Doporučuji ponechat; krátký přechod na přání dá Klidný režim v O.
   Odpověď:

6. **Kapitoly deníku a VoiceOver:** v kroku O je ověřím VoiceOverem v Safari na tvém Macu (ovládání počítače; VoiceOver bude mluvit nahlas) a jen když nadpis zmizí nebo jméno kapitoly je nesrozumitelné, předělám kapitolu na nadpis s tlačítkem a datum dám do popisu. Doporučuji ano; napiš, kdy u Macu nebudeš potřebovat zvuk.
   Odpověď:

7. **Poznámky pojmů v Klidném režimu tiskem** (`r-okraj-sokrates-1440-*`): na okraji Newsreader místo Kalamu, jen když je Klidný režim zapnutý. Doporučuji ano.
   Odpověď:

8. **Texty:** obec a soud bez úvodního „Ne…, ale“ (znění v záznamu revize), štěstí a vědění beze změny; perex deníku bez věty, kterou už říká pruh. Doporučuji ano.
   Odpověď:

9. **Chceš něco změnit na snímcích po R** (hlavně `r-opravy-montaz.jpg`: ornament na desce a rovná pohlednice)? Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání O: opravy po revizi

Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta`; texty se skillem `atlas-psani`. Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po R. Když se krok nevejde do jednoho sezení, udělej nejdřív body 1 až 3 a commitni, `docs/design.md` a skill nech na další sezení.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok O větve design-v2, opravy po revizi. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/plany/design-v2.md tabulku kroků, oddíl Po R, Co rozhodnout po R s mými odpověďmi a toto zadání, a záznam docs/revize/design-v2.md; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. Z docs/design.md jen oddíly, které měníš. Načti skilly atlas-komponenta a atlas-psani (a computer-use, když v otázce 6 souhlasím s VoiceOverem).

1. Opravy podle odpovědí po R: pásky (otázka 1), popisky a lístečky v Mapě a čase (2), Stoický týden ve vzhledu Spojení (3), lehčí stránky osob (4: obrys pobřeží mini mapy jako sdílený soubor, Dva životy jen s nabídkou), otočení listu (5), texty pojmů a deníku (8). K tomu zbylé letopočty mimo sazbu (84 míst v dist/: popisky obrázků, Kde jsme, kredity, nadtitulky Příběhu, popisky osy Dvou životů) přes nezlomitelne() a test, který v dist/ hledá „př. n. l.“ s obyčejnou mezerou.

2. Přepínač Klidný režim v záhlaví (bod 12 Vizuálních zlepšení): krátké přechody i bez nastavení systému (týž typ kratky jako pojistka plynulosti), čistý papír bez teček a bez natočení, poznámky pojmů na okraji tiskem (otázka 7). Stav v localStorage, nastavený skriptem v hlavičce před vykreslením (bez probliknutí), dostupný z klávesnice, s testem na 390 a 1440 px ve dne i v noci a s axe.

3. VoiceOver (otázka 6): v Safari na mém Macu projdi profil s pojmem, krok cesty s blokem, kresbu, deník s kapitolami a Mapu a čas; zapiš, co hlásí a v jakém pořadí. Kapitolu deníku předělej jen, když nadpis zmizí nebo jméno kapitoly nedává smysl.

4. Do testů dvanáct referenčních snímků klíčových obrazovek (Domů, profil, krok cesty s blokem, přehled cesty, velká otázka, období, Mapa a čas, deník s kapitolami, pojem, kresba, telefon a notebook, den a noc podle rozumu) s tolerancí, která snese rozdíl písma mezi Macem a Linuxem na GitHubu; snímky jen pro Chromium. Zpevni i zivot-na-mape.spec.ts:117 (rok z historie přehrávání, ne vzorkování).

5. docs/design.md napiš znovu a krátce (dnes 144 kB): tokeny, Papír (Spojení, Pravidlo střídmosti, stavy prvků), Pohyb (pravidla, přechody, pojistka plynulosti, Klidný režim), komponenty jen API a odkaz na soubor; co je ve skillu, neopakuj. Starou verzi beze změny do docs/archiv/. Skill atlas-komponenta dostane oddíly Papír a Pohyb (i kopie ve skills/) a docs/pouceni.md poučení z R a O jednou větou každé.

6. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro dotčené stránky a ty, které spadnou), axe a scripts/revize-tabulator.mjs na stránkách, kterých se oprava dotkla, celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po O (co se změnilo, snímky v Claude outputs/snimky/design-v2-o/, nad čím jsi váhal) a otázku na schválení větve, kterou zodpovím jen já. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md a části plánu, které se změnily.

8. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Uzavření

Po revizi a opravách otázka na schválení, kterou zodpoví jen autor. Po ní sloučení do hlavní větve, GitHub, plán a zadání do `docs/archiv/`, řádek v `docs/plan.md` a na řadě větev `herna-v1` (`docs/plan.md` › Další větve v pořadí).
