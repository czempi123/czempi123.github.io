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
- `docs/plany/design-v2-10-k7b-p.md` (kresby jako koláž a zadání pojmů): Po K7b (15. 11. 2026), Co rozhodnout po K7b, Zadání P: pojmy

## Po P (15. 11. 2026)

Odpovědi po K7b byly prázdné v repozitáři i v Projektu Claude, takže platí všech šest doporučení: na kresbách, mini mapě ani mini ose se nic neměnilo a trasy v mini mapě jsou zapsané v `docs/navraty.md` (patří k `herna-v1`). Snímky jsou v `Claude outputs/snimky/design-v2-p/`.

### Co vzniklo

- **Podklady** `docs/podklady/pojmy-antika.md`: výběr výpisem ze všech textů antiky, u každého pojmu původ (LSJ na Perseu), vysvětlení na dvě věty, u koho co, příklad ze života, výskyty a prameny (SEP, IEP). Pět nových zdrojů v `zdroje.yaml` (`sep-plato-ethics`, `sep-aristotle-psychology`, `sep-atomism-ancient`, `iep-meno`, `lsj`). Otevřený zůstal řecký termín pro osud (`k-overeni.md`).
- **Data** `src/content/pojmy/<id>.md`, schéma `Pojem` v `src/lib/pojmy.ts` (pojem, původ, vysvětlení právě na dvě věty, u koho co, příklad, výskyty, prameny, období, tvary pro hledání). Kontrola dat `tests/data/pojmy.test.ts`: schéma, prameny v datech, každý výskyt vede na stránku a stojí na ní tvar slova, každé vyznačení je ve výskytech, jeden pojem na stránce jednou, nejvýš jeden v odstavci, ne v nadpisu, import komponenty, vysvětlení nezačínají všechna stejně.
- **Komponenta Pojem** (`src/components/ui/Pojem.astro`, skript `src/scripts/pojmy.ts`): slovo s vlnovkou tužkou je tlačítko, vysvětlení jeho popis. Na notebooku poznámka rukou (Kalam) na okraji vedle odstavce se šipkou tužkou, po najetí podložená lístkem; na telefonu lístek pod odstavcem po klepnutí, rozloží se (`--d-listek`, `--k-papir`), při omezeném pohybu je tam hned; „Celý pojem“ a „Zavřít“. Enter dá fokus na „Celý pojem“, Esc vrátí fokus na slovo. Rozmístění na okraji je čistá funkce `rozmistitPoznamky` v `src/lib/okraj-pojmu.ts` (test `tests/data/okraj-pojmu.test.ts`): poznámky pod sebe, obejdou citát rukou na okraji i všechno, co do okraje zasahuje; co by začalo pod svým odstavcem, zůstane lístkem.
- **Stránka** `/pojem/<id>/` (šablona stránek z dat): hlavička s vysvětlením jako perexem, oddíly Odkud je slovo, U koho co, Ze života (příklad rukou na lístku), Kde v atlasu stojí (odkazy), Prameny. **Seznam** `/pojmy/` podle abecedy; vede na něj patička každé stránky. Obojí v `tests/e2e/nove-stranky.spec.ts`; pojmy jsou v katalogu hodin (typ `pojem`, štítek „Pojem“; `scripts/hodiny-katalog.mjs`: 181 stránek, chyb 0).
- **Hledání:** Pagefind neskloňuje, proto má `Zakladni.astro` prop `tvary` a v `main` neviditelný odstavec `.tvary-hledani` (`hidden`, `aria-hidden`, váha 3). Profily a medailonky v něm mají 2., 3. a 7. pád jména (`tvaryJmena` ze `jmeno2`), pojmy své tvary z dat i řecké slovo. „Sókrata“ a „Sókratovi“ najdou profil, „ctnosti“ pojem ctnost, „ataraxie“ pojem klid (test v `prohlidka.spec.ts`).
- **Nástroje:** `scripts/vyznac-pojmy.py` (vyznačí pojmy podle seznamu míst, pozná obsah ostrovu i značku přes víc řádků; pro další vlnu stačí doplnit seznam) a `scripts/snimky-okno.mjs` (snímek celého okna u jednoho místa: poznámky na okraji leží mimo sloupec a snímek prvku je neukáže).
- **Dokumentace:** `docs/design.md` (Komponenty: Pojem; Stránky z dat: Pojem a Pojmy), `docs/rozhodnuti.md`, `docs/pouceni.md` (Perseus a cookie, značka přes víc řádků, Enter před prvním snímkem, první snímek při omezeném pohybu).

### Které pojmy a kde

Dvacet šest pojmů, vyznačených 57krát na 31 stránce: ctnost, idea, duše, rozpomínání, slast, klid (ataraxia), štěstí (eudaimonia), vědění, neovládnutí (akrasia), střed, etika, mýtus, dialog, protipříklad (elenchos), obec (polis), tyran, věštírna, v naší moci, soud, lhostejné věci, osud, příčina, atom, látka, rozum (logos), religionistika. Přesně kde, ukazuje tabulka Přehled v podkladech a pole `vyskyty` v datech; stránka každého pojmu vypisuje všechna místa, kde slovo v tom smyslu stojí, i ta nevyznačená.

### Testy a kontrola

- `npm run build` prošel; Vitest `pojmy`, `okraj-pojmu`, `kontrast` (nový oddíl pojem: ruka na papíru i přes tečku, inkoust a ink-2 na lístku, tužka 3 : 1 na listu, lístku a papíru).
- Playwright: `pojem.spec.ts` (okraj, klávesnice, telefon, rozložení, žádný překryv na všech 31 stránkách s pojmy a počet tlačítek proti zdroji, odkazy stránky pojmu, axe ve dne i v noci s poznámkami i otevřeným lístkem), `nove-stranky.spec.ts`, `prohlidka.spec.ts`.
- `scripts/kontrola-fokus.mjs` na profilu Sókrata, kroku 5 cesty Stačí vědět, co je správné?, stránce pojmu a Pojmech na 390 a 1440 px: v pořádku.
- **Klávesnicí** skutečným tabulátorem (jednorázový skript, smazaný) na 1440 × 900, 1440 × 640, 390 × 844 a 390 × 640 na profilu Sókrata a v kroku cesty: slovo vidět, Enter na „Celý pojem“ (vidět, ne pod lištou), Esc zpátky na slovo. První měření v kroku cesty selhalo: Enter přišel dřív, než skript poznámky poprvé rozložil; otevření si teď rozložení vynutí samo.
- Věty v testech, kterých se vyznačení dotklo (`cesta4`, `cesta5`, `cesta8`, `otazka`), ověřují `toContainText`, které obalené slovo snese.
- Celé `npm test` před commitem jednou: kontrola typů bez chyb, Vitest 1 440 ze 1 440, Playwright 774 ze 775 (9,6 min). Spadl `denik-kapitoly.spec.ts:101` (klávesnice v kapitolách deníku: mezerník kapitolu Helenismus nezavřel); samostatně prošel třikrát ze tří, pojmů se netýká. Revize R ho má mezi náhodnými testy prověřit.

### Nad čím jsem váhal a co by šlo jinak

- **Řecká slova v textu nejsou.** Zadání jmenuje ataraxii, apatheiu, logos, elenchos, eudaimonii a akrasii, ale texty antiky je nikde nemají: atlas je od začátku říká česky. Vyznačil jsem česká slova (klid, štěstí, neovládnutí, protipříklad, rozum) a řecké slovo dal do původu a do tvarů pro hledání; texty jsem neměnil (rozhodnutí z 12. 11.). Jinak: vložit řecká slova do textů jako závorku („klid (ataraxia)“), což je změna hotových vět. Otázka 1.
- **Co vyznačit:** jen tam, kde slovo nese filozofický význam a stránka ho o dvě věty dál sama nevykládá (Aristotelova ctnost u oka a koně, Thalés a látka v úvodu ano, mýtus v úvodech ne). Obec je nejčastější: vyznačená na deseti stránkách, protože student pod ní vidí vesnici nebo úřad.
- **Soud nikde vyznačený není.** Jediný výskyt ve smyslu stoiků je v citátu („soudy o věcech“) a do citátu pojem nepatří. Stránka a seznam pojmů ho mají. Otázka 4.
- **Tlačítko, ne odkaz.** Čtečka slyší „věštírny, tlačítko“ a hned popis; odkaz by studenta posílal pryč ze stránky. Na stránku pojmu vede „Celý pojem“ ve vysvětlení.
- **Poznámka na okraji smí pokračovat podél aktivity pod listem**, protože ta do okraje nesahá; zastaví ji jen věc v okraji (citát rukou na okraji, širší blok, další kapitola). Bez toho by se na okraj vešla jen první poznámka listu. Druhá poznámka v sousedním odstavci (Epikúros: slast a klid) se často nevejde a zůstane lístkem: vysvětlení slasti je vysoké.
- **Od 1100 px a jen s 190 px vedle listu.** Pod tím je vysvětlení lístkem jako na telefonu. Při promítání hodiny poznámky na okraji nejsou.
- **Astro komponenta se sdíleným skriptem, ne ostrov.** Pojem stojí uprostřed věty v MDX; Svelte by kvůli jednomu tlačítku hydratoval na každé stránce. Pojmy v obsahu ostrovu (Nejdřív sám, bloky) proto vyznačené nejsou; skript na vyznačení je přeskočí.
- **Nadpis stránky pojmu s tečkou** („Ctnost.“) jako ostatní stránky z dat; seznam má titulek „Slova, která *unesou víc*“.
- **Odkaz na Pojmy jen v patičce**, ne v Otázkách: patička je na každé stránce. Otázka 5.

## Co rozhodnout po P

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-p/`). Prázdná odpověď znamená souhlas s doporučením.

1. **Česká slova s řeckým původem** (klid s ataraxií v původu, štěstí s eudaimonií): texty beze změny, řecké slovo na stránce pojmu a v hledání. Jinak: doplnit do textů řecké slovo v závorce. Doporučuji, jak je.
   Odpověď:

2. **Poznámka na okraji a lístek** (snímky `p-okraj-sokrates-1440-light`, `p-okraj-sokrates-1440-dark`, `p-okraj-epikuros-1440-light`, `p-listek-vestirna-390-light`, `p-listek-vestirna-390-dark`): rukou na tečkovaném papíře se šipkou, po najetí na lístku; na telefonu lístek pod odstavcem s Celý pojem a Zavřít. Doporučuji ano.
   Odpověď:

3. **Stránka pojmu a seznam** (snímky `p-pojem-ctnost-*`; seznam si otevři v náhledu na `/pojmy/`): oddíly Odkud je slovo, U koho co, Ze života, Kde v atlasu stojí, Prameny. Doporučuji ano.
   Odpověď:

4. **Soud bez vyznačení:** stoický soud stojí v atlasu jen v citátu. Nechat ho jako pojem se stránkou (vede na něj seznam), nebo vyřadit? Doporučuji nechat.
   Odpověď:

5. **Odkaz na Pojmy:** dnes v patičce každé stránky. Přidat i do Otázek nebo do hlavní navigace? Doporučuji jen patičku; revize R posoudí, jestli ho studenti najdou.
   Odpověď:

6. **Chceš něco změnit na snímcích po P** (i na celém profilu Sókrata `p-sokrates-*`)? Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání R: revize celé větve

Opus 5.5 · high se skillem `atlas-revize` a pluginem Design (`design:accessibility-review`, `design:design-critique`). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po P. Když se krok nevejde do jednoho sezení, udělej nejdřív inventuru, snímky a přístupnost (body 1 až 3), zapiš nálezy a výkon nech na další sezení.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok R větve design-v2, revize celé větve. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíl Obsah větve, Co rozhodnout po P s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. Z částí plánu jen Po D2 (Stavy prvků, Kontrola kontrastu), Po D3 (Pravidla pohybu), Po auditu (Vizuální zlepšení, Pravidlo střídmosti) a oddíly „Nad čím jsem váhal“ kroků K1 až P (podle seznamu Části plánu) jako seznam míst, kde hledat nejdřív. docs/design.md nečti celý. Načti skilly atlas-revize, atlas-komponenta a atlas-psani a z pluginu Design design:accessibility-review a design:design-critique. Když odpovědi po P něco mění na pojmech, oprav to nejdřív.

1. Inventura: vypiš všechny typy stránek (Domů, Lidé a směry, Otázky, Mapa a čas, profil, společný profil, medailonek, přehled a krok cesty, velká otázka, období, směr, myšlenkový pokus, úvody, tradice, pojem a Pojmy, Můj deník s kapitolami, Tvoje antika, Stoický týden, příprava hodiny, hodina a promítání, dílna, 404) a ke každému jednu adresu.

2. Vzhled: snímky každého typu na 390 a 1440 px ve dne i v noci (scripts/snimky-listy.mjs, kroky cest scripts/snimky-cesta.mjs, okraj scripts/snimky-okno.mjs) do Claude outputs/snimky/design-v2-r/ a jejich prohlídka očima studenta, učitele a autora (skill atlas-revize, design:design-critique): soulad se Spojením a s Pravidlem střídmosti (nejvýš jedna ozdoba na obrazovku, text delší než dvě věty se nenatáčí, Kalam jen na poznámku), co vystupuje, jde zmáčknout, a co je vtlačené, je zvolené, papírnictví období, pohyb jen po činu studenta, čtení a dělání vypadají jinak. Texty, které větev přidala (popisky, nápovědy, pojmy), projdi se skillem atlas-psani.

3. Přístupnost (design:accessibility-review): axe ve dne i v noci na každém typu stránky; kontrast všech dvojic tokenů výpočtem (co v tests/data/kontrast.test.ts chybí, doplň); klávesnice skutečným tabulátorem na dvou výškách okna a scripts/kontrola-fokus.mjs na všech typech; čtečka (VoiceOver na Macu: profil s pojmem, krok cesty s blokem, kresba, deník s kapitolami, Mapa a čas; co hlásí a v jakém pořadí, nadpis kapitoly v lístku deníku); omezený pohyb (každá animace má klidový stav, který říká totéž).

4. Výkon: na mém iPhonu a na levném telefonu se systémem Android (když ho nemám, Chrome se zpomaleným procesorem 6× a pomalou sítí) přechod listu mezi stránkami, otočení listu, Mapa a čas, kresby s pohybem. Když otočení listu trhá (pod 30 snímků za sekundu), ať se tam samo přepne na krátký přechod (skript v src/scripts/ s testem). Váha HTML stránek osob (dist/osobnost/*/index.html: tři nejtěžší a co je nese) a Zod v ostrovu SlozArgument (velikost balíčku; jde validace přesunout do sestavení?).

5. Nálezy zapiš do docs/revize/design-v2.md ve formátu skillu atlas-revize (dopad, kde, co, návrh opravy) seřazené podle dopadu. Drobnosti (chybějící popisek, jeden token, překlep) oprav rovnou a zapiš; zásadní změny vzhledu jen navrhni, rozhoduji o nich po R.

6. Ověř opravy: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro dotčené stránky a ty, které spadnou), celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po R: co revize našla a co opravila, snímky, otázky Co rozhodnout po R (každý zásadní nález jako otázka s doporučením; prázdná odpověď znamená souhlas) a zadání kroku O v plném znění (podle tabulky kroků). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md a části plánu, které se změnily.

8. Pak se zastav a napiš mi, na které snímky a nálezy se mám podívat.
```

## Uzavření

Po revizi a opravách otázka na schválení, kterou zodpoví jen autor. Po ní sloučení do hlavní větve, GitHub, plán a zadání do `docs/archiv/`, řádek v `docs/plan.md` a na řadě větev `herna-v1` (`docs/plan.md` › Další větve v pořadí).
