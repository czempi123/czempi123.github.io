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
- `docs/plany/design-v2-9-k6d-k7b.md` (deník po obdobích a zadání kreseb): Po K6 dodatku (15. 11. 2026), Co rozhodnout po K6 dodatku, Zadání K7b: kresby jako koláž

## Po K7b (15. 11. 2026)

Odpovědi po K7a a po K6 dodatku byly prázdné v repozitáři i v Projektu Claude, takže platí všechna doporučení a na mapě ani v deníku se nic neměnilo. Snímky jsou v `Claude outputs/snimky/design-v2-k7b/`.

### Co se na kresbách změnilo

- **Rám** (`Kresba.svelte`): kresba leží na listu (`--list`, `--lezi`) s malou páskou v papíru období; plátno je tečkovaný papír s tenkou linkou a stínem přilepeného papíru; pod ním **vtlačená drážka** s přepínačem pohledů, ovládáním kresby a Zastavit pohyb (pilulky vystouplé, zvolená vtlačená); text pod kresbou je pod drážkou. Pořadí tabulátoru zůstalo (pohled, ovládání, pohyb). Rám dává do `<defs>` filtr stínu výstřižku, kresby ho berou třídou `k-vystrih`. Na plátně v promítání (Jen kresba) list a páska odpadnou, ať má kresba celou výšku.
- **Pravidla v `global.css`:** materiály `k-list`, `k-listek-papir`, `k-pp`, stín `k-vystrih`, tužka `k-tuzka`, popisek `k-popisek` (Instrument Sans s okrajem v barvě listu, na tmavém `k-popisek--svetly`), lísteček s páskou Kalamem (`KresbaListek.svelte`). Desky období (`--pc-plate`, `--pc-on-plate`) kresby nepoužívají.
- **Světlo a tma.** Tři tóny zůstaly, jen z jiného papíru: `k-svetlo` (ve dne skoro bílý list, v noci ztlumený), `k-stin` (šedý papír z tužky) a `k-tma` (černý papír). Drží pořadí světlý > střední > tmavý i v noci. Samotné „tytéž tokeny“ by v noci slily stěnu jeskyně se stíny: list je v noci tmavý. Proto jsou z těchto tónů věci, kde světlo a tma něco znamenají, a postavy, které musí být vidět i v noci.
- **Barva období na jednom nositeli:** oheň (jeskyně), slunce (cesta ven), šála (vítr), čára „dost“, plocha pokusu (čtverec), bod středu, život (zrcadlo), ty (třetí čára), tvoje volba (hodiny), maska. Ve dne je to papír období, v noci inkoust období (`k-pp`): papír období má na nočním papíře jen 2,1 až 2,8 : 1. Loď barvu období nemá, nic v ní ji nenese.
- **Třináct kreseb a graf:** zem, břeh, horizont a podlaha jsou natržené pruhy papíru (`natrzenyPruh` v `src/lib/kresby.ts`, natržený lísteček `natrzenyList`); vítr, paprsky, hlas, směr skoku, míra „chybí“, mřížka a obrys druhé lodi jsou tužkou; repliky „Je mi zima.“ a „Pomoc!“ stojí na lístečcích s páskou; odpovědi v Třetí čáře na lístečcích (číslice v Instrument Sans: jednička Kalamem vypadala jako lomítko). Postavy a věci jsou výstřižky bez obrysových čar. Graf křivek je list s páskou a plátnem z tečkovaného papíru. Šaty mají dál vlastní barvy, jen se stínem výstřižku.
- **Jeskyně** ukazuje všechno jako dřív: v pohledu vězňů stěna (natržený světlý list se ztmavlými kraji a září ohně v barvě období), průvod pěti stínů věcí, stín zídky s hlavami a tři vězni z černého papíru; z boku oheň v barvě období, paprsky ke stěně, nosiči, zídka, vězni v poutech a stěna se stíny na přímkách z ohně. Pohyb je týž (průvod, mihotání, plamen, nosič, stín věci).
- **Pohyb** jen `transform`, `opacity` a tah tužky. Nový je jen pohup papírového listí ve větru na místě (vítr nic neodnáší); proudy větru jsou tečky tužkou, po kterých přebíhá tah. Zastavené kresby kreslí obsah jako dřív (testy zastavení prošly).
- **Obraz ke kapitole (bod 9):** Prótagorás 01 Měřítko všech věcí má razítko pravítka (jeho atribut), Platón 02 Chlapec a čtverec novou ikonu `square` (čtverec a v něm čtverec na úhlopříčce; `docs/design/atributy-ikony.json`, `npm run ikony`). Ostatní kresby stojí v krocích cest, ne v kapitolách. Řádek v `docs/navraty.md` upravený.
- **Mini mapa** (`MiniMapa.astro`) je výstřižek jako Mapa a čas: moře šrafované tužkou, tři vodní linky (užší než v Mapě a čase, výřez je malý a ostrovů hodně), pevnina na lístkovém papíře s obrysem, dvojitý rámeček se stupnicí; místa jsou razítka v inkoustu období (dva kruhy a střed), ne tečky. Síť poledníků zmizela.
- **Mini osa** (`MiniOsa.astro`): pruhy současníků tužkou, život osoby stránky proužek papíru období na lístečku přiloženém přes osu; linky čárkovaně.
- **Dokumentace:** `docs/design.md` › Kresba s pohybem (Rám, Koláž, Světlo a tma) a Graf křivek; `docs/rozhodnuti.md`; kopie skillu `skills/atlas-komponenta/references/vzor-komponenty.md` (koláž místo tří tónů z desky). Skill v účtu přepíše krok O spolu s oddíly Papír a Pohyb.

### Přezdívky

Odškrtnuté v tabulce Po K1 (část 2): kresby, graf, mini mapa a mini osa nepoužívají žádnou přezdívku ani tintu období; `--sunk`, `--rule`, `--pohyb`, `--pohyb-kamera`, `--r-xs`, `--r-sm`, `--r-md`, `--pc-plate`, `--pc-on-plate` a `--map-*` mají 0 použití.

**Zbývá po K7b** (smaže O): `--paper` 4, `--surface` 3, `--pc` 8, `--pc-tint` 5, `--pc-soft` 2 a `--r-full` 2, vše jen v nepoužívaných `ui/Mince.astro` a `mapa/Mince.svelte`; `--muted` 1 ve třídě `.t-popisek` v `global.css` (používá ji celý web; O ji přepne na `--ink-3`, až zmizí tinty); přiřazení `.obdobi-N` s `--period-N-tint`, `-soft`, `-plate`, `-on-plate` v `global.css`; definice přezdívek v `tokens.css`.

### Testy a kontrola

- `npm run build` prošel, kontrola typů bez chyb.
- Vitest: nový `tests/data/kresby-kolaz.test.ts` (natržený pruh a lísteček: tvar, meze zubu, stejné semeno); v `tests/data/kontrast.test.ts` dvojice kreseb (světlý popisek na černém a šedém papíře, šedý od černého, hrana tužkou, nositel barvy období na tečkovaném papíře ve všech osmi obdobích).
- Playwright: kresby, cesty s kresbami, mini mapa, stránky osob, graf, Platón a podoby hodiny (123 testů). Spadl jen `hodina-podoby.spec.ts` (plátno široké kresby v promítání o 13 px nižší kvůli listu): v promítání list a páska odpadnou. Upravený test: `stranky-osob.spec.ts` (obraz ke kapitole i u Platóna a Prótagora; kapitola bez předmětu se ověřuje u Aristotela).
- `scripts/kontrola-fokus.mjs` na cestě 3 kroku 1, dílně bloků a profilu Sókrata, 390 a 1440 px: bez nálezu.
- **Klávesnicí** (jednorázový skript, smazaný) na 1440 × 900, 1440 × 640, 390 × 844 a 390 × 640 u cesty ven, přesýpacích hodin a větru: tabulátorem od začátku stránky, každé zastavení v kresbě vidět a nic přes něj neleží. První měření hlásilo zastavení pod oknem; byl to skript, který mačkal tabulátor rychleji, než stránka plynule dojela.
- **Zpomalený procesor (6×)** u přesýpacích hodin, kde písek padá: tažení posuvníku Spánek myší, 31 kroků, 14 změn (víc hodnot posuvník nemá), nejdelší mezera 100 ms.
- **Kontrast** výpočtem (jednorázový skript, smazaný): světlý popisek na černém papíře 14,74, na šedém 4,71 ve dne a 4,63 v noci, na papíru období 5,68 a víc; repliky a odpovědi na lístečku 10,14 a víc; šedý papír od černého 3,13 a 3,19; hrana tužkou na černém 4,24; nositel barvy období na papíře ve dne 5,28 a v noci (inkoust) přes 5. Výstřižek z listu na tečkovaném papíře má ve dne 1,09 : 1 a odlišuje ho jen stín výstřižku, jako na plátně (otázka 3).
- **Snímky** (`scripts/snimky-prvek.mjs`): všech třináct kreseb a dva grafy ve dne i v noci na 390 a 1440 px, kresby s víc pohledy v každém pohledu (`k7b-*`), a Doba a lidé Sókrata (`k7b-sokrates-doba-*`); celý profil Sókrata `scripts/snimky-listy.mjs` (`k7b-sokrates-*`).
- **Celé `npm test`** před commitem jednou: kontrola typů bez chyb, Vitest 1 419, Playwright 758 ze 758 (8,3 min).

### Nad čím jsem váhal a co by šlo jinak

- **Tytéž tokeny v noci.** Plátno má v noci postavy z listu (tmavé na tmavém papíře). Jeskyně, noc venku a zrcadlo by tak v noci ztratily to hlavní, rozdíl světla a tmy. Tóny světla a tmy jsou proto z tužky a listu tak, aby jejich pořadí v noci drželo; vypadá to jako bílé a černé výstřižky v nočním zápisníku. Jinak: držet se plátna doslova a v noci kresby jen ztmavit.
- **Inkoust období v noci místo papíru období** u nositele barvy. Ve dne je to totéž; v noci je maska, šála nebo oheň světlejší, jako jsou světlejší nadpisy a razítka.
- **Drážka pod plátnem, ne nad ním.** Přepínač pohledů stál dřív nad kresbou; teď je s ostatním ovládáním v jedné drážce pod ní, jak chce zadání. Student vidí nejdřív obraz, pak volí. Jinak: přepínač pohledů nad plátnem a jen ostatní ovládání v drážce.
- **Kresba se nenatáčí** (plátno ji má o 0,3° natočenou): text pod ní je delší než dvě věty a pravidlo střídmosti natáčení textu zakazuje; natočené jsou lístečky v kresbě.
- **Ozdoby navíc:** z plátna jsem vzal papírové listí ve větru, mráček ne (jedna ozdoba na obrazovku). Listí nese vítr, proto zůstalo.
- **Prótagorás 01 má pravítko**, ne vítr: kapitola se jmenuje Měřítko všech věcí a pravítko je jeho atribut. Ikona větru by byla nová a říkala by jen to, co kresba pod nadpisem.
- **Trasy v mini mapě** zadání chce nechat ručně kreslené, ale v kódu žádné nejsou: mini mapa má jen místa s rolemi a roky. Trasy (oblouky se šipkou mezi místy) byly jen na plátně D4. Otázka 5.
- **Vodní linky v mini mapě** jsou o polovinu užší než v Mapě a čase; v plné šíři se kolem drobných ostrovů slévaly do šedé skvrny.

## Co rozhodnout po K7b

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-k7b/`). Prázdná odpověď znamená souhlas s doporučením.

1. **Kresby jako koláž** (snímky `k7b-*-1440-light`, `k7b-*-390-dark`): list s páskou, plátno z tečkovaného papíru, ovládání ve vtlačené drážce pod plátnem, výstřižky bez obrysů, tužka, lístečky. Doporučuji ano.
   Odpověď:

2. **Jeskyně** (snímky `k7b-jeskyne-vezni-*`, `k7b-jeskyne-bok-*`, `k7b-jeskyne-ven-*`): ukazuje všechno, co dřív? Doporučuji ano.
   Odpověď:

3. **Světlo a tma v noci:** bílé a černé výstřižky v nočním zápisníku (jeskyně, zrcadlo, hodiny, lidé na břehu), nositel barvy období v noci světlejší. Jinak: v noci držet plátno doslova (postavy z tmavého listu, viditelné jen stínem). Doporučuji, jak je.
   Odpověď:

4. **Obraz ke kapitole:** Prótagorás 01 pravítko a Platón 02 čtverec na úhlopříčce (snímky profilu nebo stránky v náhledu). Doporučuji ano.
   Odpověď:

5. **Trasy v mini mapě** (oblouky se šipkou a rokem mezi místy, jako na plátně D4) v kódu nejsou. Postavit je? Doporučuji ne teď: patří k Životu na mapě a výpravám v `herna-v1`; zapíšu je do `docs/navraty.md`. Napiš „ano“, jestli je chceš v tomto kroku.
   Odpověď:

6. **Chceš něco změnit na snímcích po K7b?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání P: pojmy

Podklady Opus 5.5 · high se skillem `atlas-overeni`, komponenta Opus 5.5 · high se skillem `atlas-komponenta`, texty se skillem `atlas-psani`. Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K7b. Když se krok nevejde do jednoho sezení, udělej nejdřív výběr pojmů a podklady (kroky 1 a 2), zapiš stav a zbytek nech na další sezení.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok P větve design-v2, pojmy. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíl Obsah větve › Pojmy (krok P), Co rozhodnout po K7b s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. Z částí plánu jen Po D2 (Stavy prvků: řádek Pojem; Písma: ruka), Po D3 (Tokeny pohybu: lístek pojmu; Pravidla pohybu) a Po auditu (Pravidlo střídmosti, Vizuální zlepšení bod 6). docs/design.md nečti celý, jen oddíly, které zadání jmenuje. Načti skilly atlas-overeni, atlas-komponenta a atlas-psani. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/ProfilSokrates.dc.html jen styly a značky pojmu („Delfy“: poznámka na okraji a lístek), ne pult náhledu a skript. Když odpovědi po K7b něco mění na kresbách, mini mapě nebo mini ose, oprav to nejdřív.

1. Výběr pojmů: výpisem z textů antiky (src/content: osobnosti, cesty, otázky, období, směry, pokusy, úvody, náboženství) najdi slova, která student potká a která potřebují vysvětlení (ataraxia, apatheia, ctnost, logos, idea, elenchos, eudaimonia, akrasia a další); asi 25. U každého zapiš, kde všude stojí (první výskyt na stránce). Jména lidí a míst pojmy nejsou.

2. Podklady (skill atlas-overeni) do docs/podklady/pojmy-antika.md: u každého pojmu původ slova, vysvětlení na dvě věty, příklad ze života studenta, kde se v atlasu objevuje, prameny (SEP, IEP nebo slovník s adresou). Vysvětlení drží rozdíly, které dělá pramen; jeden pojem u různých filozofů znamená různé věci (ctnost u Sókrata, Aristotela a stoiků): pak řekni, u koho co.

3. Data: kolekce src/content/pojmy/ se schématem (pojem, původ, vysvětlení, příklad, výskyty, prameny, období), kontrola dat ve Vitestu. Texty pojmů piš se skillem atlas-psani: dvě věty, které se dají pochopit bez dalšího čtení, žádná slovníková šablona.

4. Komponenta Pojem (skill atlas-komponenta) podle Po D2 a plátna: vlnité podtržení tužkou; na notebooku vysvětlení rukou (Kalam) na okraji stránky vedle odstavce (bod 6: okraj žije), na telefonu lístek po klepnutí pod odstavcem, z klávesnice fokusem (Enter otevře, Esc zavře a vrátí fokus); „Celý pojem“ vede na stránku pojmu. Lístek se rozkládá (--d-listek, --k-papir), při omezeném pohybu je tam hned. Poznámky na okraji se nesmějí překrývat: dvě na jedné výšce posune skript pod sebe (čistá funkce v src/lib/ s testem), co se nevejde, zůstane jen lístek po klepnutí. Čtečka slyší slovo a vysvětlení jako popis, ne jako odkaz.

5. Stránka /pojem/<id>/ (šablona stránek z dat, docs/design.md › Stránky období, směru, pokusu, úvodu a tradice): pojem, původ, vysvětlení, příklad, kde se v atlasu objevuje (odkazy), prameny; seznam pojmů /pojmy/ a odkaz na něj z Otázek nebo z patičky. Stránky přidej do tests/e2e/nove-stranky.spec.ts a do katalogu hodin (ověř scripts/hodiny-katalog.mjs proti dist/).

6. Vyznačení v textech: ručně v MDX, jen první výskyt na stránce, nejvýš jeden pojem v odstavci; hotové věty se nemění (jen obalí slovo). Najdi věty v tests/ (grep), které vyznačení může rozbít (toContainText snese, textContent.includes ne).

7. Hledání: Pagefind neskloňuje, takže pojmy a jména dostanou české tvary pro hledání (meta nebo skrytý text pro index, ne pro čtečku): ataraxie, ataraxii; Sókrata, Sókratovi. Ověř, že „Sókrata“ najde profil a „ctnosti“ pojem ctnost.

8. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro pojem, stránky s pojmy, nove-stranky, hledani, prohlidka a ty, které spadnou), node scripts/kontrola-fokus.mjs na profilu Sókrata, kroku cesty s pojmem a stránce pojmu, klávesnicí na dvou výškách okna, axe ve dne i v noci, kontrast nových dvojic výpočtem (trvalé do tests/data/kontrast.test.ts), node scripts/snimky-listy.mjs na profilu Sókrata a jedné stránce pojmu ve dne i v noci na 390 a 1440 px a node scripts/snimky-prvek.mjs na lístku pojmu otevřeném na telefonu. Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

9. Do plánu větve zapiš oddíl Po P: co vzniklo, které pojmy a kde, nad čím jsi váhal, otázky Co rozhodnout po P a zadání kroku R v plném znění (podle tabulky kroků). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md a části plánu, které se změnily.

10. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Uzavření

Po revizi a opravách otázka na schválení, kterou zodpoví jen autor. Po ní sloučení do hlavní větve, GitHub, plán a zadání do `docs/archiv/`, řádek v `docs/plan.md` a na řadě větev `herna-v1` (`docs/plan.md` › Další větve v pořadí).
