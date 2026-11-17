# Atlas myšlení: design systém

Vzhled Spojení a jeho pohyb (větev design-v2, 7. až 15. 11. 2026). Hodnoty žijí v kódu, tady jsou jen pravidla a mapa souborů: tokeny v `src/styles/tokens.css`, třídy papíru a pohybu v `src/styles/global.css`, komponenty v `src/components/`. Jak se komponenta staví, testuje a fotí, drží skill `atlas-komponenta`; tenhle dokument to neopakuje. Dlouhá verze z 15. 11. 2026 (podrobnosti bloků, deníku a Mapy a času) je v `docs/archiv/design-2026-11-15.md`, plátno s návrhem: https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ.

## Principy

1. **Papír, inkoust a páska.** Tečkovaný papír je stůl, na kterém leží listy, lístky a výstřižky. Co vystupuje z papíru, jde zmáčknout; co je vtlačené, je zvolené nebo aktivní; co leží, se čte.
2. **Barva říká, kde v dějinách jsem.** Každé období má inkoust a papír; rozlišení nikdy nestojí jen na barvě, vždy je u ní číslo nebo název.
3. **Klid pro čtení, hra pro dělání.** Souvislý text leží na čistém listu, aktivita v rámu na tečkách. Student na první pohled pozná, kde čte a kde je na tahu.
4. **Pohyb odpovídá na čin studenta.** Nic se nehýbe samo, aby si toho všiml.
5. **Den a noc jsou rovnocenné.** Oba režimy drží WCAG AA; noc je teplý noční zápisník, ne modročerná.

## Tokeny

Všechno v `src/styles/tokens.css`; komponenta bere barvy, stíny, písma i délky jen odtud. Kontrast celé matice inkoustů na plochách ve dne i v noci hlídá `tests/data/kontrast.test.ts`.

| Skupina | Tokeny | Kdy |
| --- | --- | --- |
| Papír a plochy | `--papir`, `--tecka`, `--list`, `--plocha`, `--plocha-m`, `--listek` | stůl, list ke čtení, vystouplé ovládání, malé vystouplé, lístek a poznámka |
| Linky | `--linka` (řádky, perforace), `--tuzka` (hranice ovládání 3 : 1) | `--linka` nikdy jako jediná hranice ovládání |
| Inkousty | `--ink`, `--ink-2`, `--ink-3`, `--ruka`, `--na-inkoustu`, `--na-papiru` | text, perex, popisek, poznámka rukou, text na hlavním tlačítku, text na pruhu období |
| Období | `--p-N` inkoust, `--pp-N` papír (pruh, páska, lístek pásu); třída `.obdobi-N` nastaví `--p` a `--pp` | inkoust se v noci zesvětlí, papír zůstává |
| Pero studenta | `--pero` (modré, fialové, sépiové podle `data-pero` na `<html>`), `--cervena-tuzka` | co student napíše nebo zvolí; červená tužka jen v Najdi slabé místo |
| Stíny | `--vyst`, `--vyst-m`, `--zved`, `--vtla`, `--vtla-mele`, `--vtla-hl`, `--vyst-ink`, `--zved-ink`, `--vtla-ink`, `--lezi`, `--lezi-zved`, `--lezi-tlak`, `--deska`, `--odlep`, `--lista-stin`, `--hlavicka-stin` | vystouplé, zvednuté při najetí, vtlačené, ležící papír |
| Tvary | `--trh` (vytržený okraj), `--paska-tvar`, `--paska-a`, `--paska-b`, `--foto` (filtr fotky), `--tecky-krok`, `--natoceni` | `--natoceni` násobí malá natočení papíru (Klidný režim ho dá na 0) |
| Písma | `--font-serif` Newsreader (nadpisy, čtení), `--font-sans` Instrument Sans (ovládání, popisky), `--font-ruka` Kalam (poznámky, pruh se jménem, studentova ruka) | všechna lokálně (`Pisma.astro`) |
| Stupnice | `--fs-jmeno`, `--fs-h1` až `--fs-h3`, `--fs-citat`, `--fs-perex`, `--fs-text`, `--fs-ruka-l`, `--fs-ruka`, `--fs-ovladani-l`, `--fs-ovladani`, `--fs-popisek`, `--fs-nadtitulek` (s `--lh-*`, `--ls-*`) | plynule mezi 390 a 1440 px; `--meritko` zvětší vše (promítání 1,5) |
| Mezery a rozvržení | `--s-1` až `--s-10` (4 až 96 px), `--okraj`, `--ctenarsky-sloupec` 680 px, `--hlavicka`, `--spodni-lista`, `--dotyk` 44 px, `--hodina` | |
| Zaoblení | `--r-papir` 0, `--r-razitko` 3 px, `--r-ovladani` 10 px, `--r-plne` | papír se nezaobluje |
| Pohyb | délky `--d-*` a křivky `--k-*` (oddíl Pohyb) | při omezeném pohybu všechny délky 0 |

Přezdívky starých jmen (`--paper`, `--surface`, `--pc*`, `--period-N`, tinty a desky období, `--muted`, `--r-full`) už v `tokens.css` nejsou. Kdo je najde ve starém vzoru nebo v archivu, vezme nové jméno. Barva období v `obdobi.yaml` je `--p-N`.

## Papír

### Spojení

Schválené 7. 11. 2026 ze tří směrů na plátně:

- **Z A (Cestovní deník):** tečkovaný papír, fotka a citát přilepené páskou v barvě období, razítko, cesty jako lístky s pahýlem, otázky vtlačené do papíru, pojem s poznámkou na okraji, zakroužkovaná vtlačená možnost a linkované pole; písma.
- **Z B:** záhlaví (aktivní vstup a hledání vtlačené, Můj deník vystouplý) a Proč kalich (ikona ve vtlačeném kolečku).
- **Z C:** jméno na vytrženém listu a pod ním pruh papíru v barvě období s větou o člověku (titulek s pruhem).

**Hlavní třídy** (`global.css`): `.cisty-list` (souvislý text na listu), `.listek-paska` (lístek zpětné vazby s páskou), `.paska` s `--nahore`, `--vlevo`, `--vpravo`, `--mala`, `.vystouple` a `.vystouple--m` (vrstvy stínu najetí a stisku), `.lezi-odkaz` (ležící karta, která se po najetí zvedne), `.titulek` a `.titulek-pruh` (jméno na listu a pruh), `.rozlozit` (lístek se rozloží), `.blok` a `.blok__*` (rám aktivity). Deska s fotkou je `ui/Deska.astro`, razítko člověka `ui/RazitkoCloveka.astro`.

**Noc** (`data-theme="dark"` nebo nastavení systému): papír `#1D1B18`, list o stupeň světlejší, pruh a páska stejný papír období, fotka ztlumená. Tisk: bílý papír bez teček a stínů.

### Pravidlo střídmosti

Papír je kulisa, ne obsah.

- **Na obrazovce nejvýš jedna ozdoba, která nic nenese, a nejvýš jedna páska.** Další papír drží sponka (`--sponka`), špendlík, ohyb, nebo prostě leží (revize R: Výprava v Mapě a čase bez pásky, druhý lístek „na začátek“ na Domů se sponkou, kapitoly deníku s ohybem dole, páska v deníku jen u Návratu, první kapitola profilu pod deskou bez pásky).
- **Text delší než dvě věty se nenatáčí.** Natočení je jen u lístků, karet a desek, vždy přes `calc(Xdeg * var(--natoceni))`.
- **Rukou (Kalam) nic delšího než poznámka.** Zpětná vazba, citát a vysvětlení pojmu na stránce jsou tiskem; v Klidném režimu i poznámka na okraji.
- **Nový předmět se staví z tokenů, které už jsou,** a má klidový stav pro omezený pohyb.
- **Deska bez obrazu a bez osoby** nese ornament období tužkou, nikdy prázdný rámeček.

### Stavy prvků

| Prvek | Klid | Najetí | Stisk | Zvoleno | Zakázáno |
| --- | --- | --- | --- | --- | --- |
| Hlavní tlačítko | plný inkoust, `--vyst-ink` | `--zved-ink`, −1 px | `--vtla-ink`, +1 px | nemá | zploštělé, čárkovaný okraj tužkou, text `--ink-3` |
| Vedlejší tlačítko | `--plocha`, `--vyst` | `--zved`, −1 px | `--papir`, `--vtla-hl` | `--vtla` a ✓ (`aria-pressed`) | jako hlavní |
| Tiché tlačítko | podtržené tužkou | podtržení inkoustem 2 px | +1 px | nemá | bez podtržení, `--ink-3` |
| Ikonové (přepínače v záhlaví) | kolečko, `--vyst-m` | `--zved` | `--vtla-hl` | `--vtla-mele` (Klidný režim zapnutý) | zploštělé, čárkované |
| Lístek cesty | `--vyst` | `--zved`, −2 px | `--vtla-hl` | cesta, ve které jsi: `--vtla`, pahýl „3 ze 7“ | připravujeme: bez stínu, čárkovaný |
| Štítek otázky | vtlačený `--vtla` | `--vtla-mele`, podtržení | `--vtla-hl` | tečka v barvě období, tučně (`aria-current`) | bez stínu, čárkovaný |
| Karta | ležící, natočená, `--lezi` | narovná se, −3 px, `--lezi-zved` | `--lezi-tlak` | zapadne do papíru `--vtla` | bez stínu a šipky, čárkovaná |
| Pole | řádky `--linka`, spodní linka `--tuzka` | linka `--ink` | nemá | nemá | řádky slabší, linka čárkovaná |
| Možnost Volby | `--vyst` | `--zved`, −1 px | `--vtla-hl` | `--vtla` a kroužek tužkou v barvě období | po odeslání zploštělá, čárkovaná |
| Pojem | vlnovka `--tuzka` | vlnovka `--ink`, poznámka podložená lístkem | nemá | nemá | nemá |

Žádný stav nestojí jen na stínu (neumorfismus hranici 3 : 1 neunese): zvolené má kroužek, tečku, ✓ nebo tučný řez, zakázané čárkovaný okraj. Fokus z klávesnice je všude stejný: 2 px `--ink`, odsazení 3 px, jen `:focus-visible`. Najetí mění jen průhlednost vrstev stínu (`::before`, `::after`) a `transform`, ne `box-shadow`.

## Pohyb

### Tokeny

| Token | Hodnota | Kde |
| --- | --- | --- |
| `--d-stisk` | 120 ms, `--k-stisk` | najetí, stisk, vtlačení, zvednutí karty |
| `--d-bod` | 180 ms | body lidí v Mapě a čase |
| `--d-listek` | 240 ms, `--k-papir` (razítko a páska `--k-dopad`) | lístek zpětné vazby a pojmu, razítko, páska, krátký přechod |
| `--d-odkryti` | 280 ms | Odkryj |
| `--d-tah` | 300 ms | tužka dokreslí kroužek |
| `--d-presun` | 320 ms | karta do koše, mince po škále, Dva životy |
| `--d-list` | 400 ms, `--k-list` | posun listu mezi kroky cesty, let fotky na desku |
| `--d-otoceni` | 900 ms | otočení listu mezi stránkami |
| `--d-prichod`, `--z-prichod` | 420 ms, krok 80 ms | příchod na profil: titulek, pruh, pásky po sobě |
| `--z-karta` | krok 40 ms | rozdání karet po jedné (herna: `.rozdat` s `--i`) |
| `--d-kamera` | 600 ms | kamera Mapy a času |

Křivky: `--k-stisk` (stav prvku), `--k-papir` (papír se pokládá, nikdy nepřestřelí), `--k-list` (celý list a kamera), `--k-dopad` (razítko a páska dopadnou bez odskoku).

### Pravidla

- **Kdy ano:** po činu studenta (stisk, volba, odkrytí, pojem, další krok, posun roku); jednou při příchodu na stránku s titulkem s pruhem nebo deskou s páskou; v kresbách, které pohyb mají v sobě.
- **Kdy ne:** oddíly při posouvání nevyjíždějí, nic nebliká a neodskakuje. Pohyb nikdy neschovává obsah: text je čitelný i uprostřed přechodu.
- **Jen `transform` a `opacity`;** výjimka je tah tužky (`stroke-dashoffset` v malém SVG).
- **Omezený pohyb** (`prefers-reduced-motion`): délky v `tokens.css` jsou 0 a `global.css` zkrátí každý přechod na 0,01 ms. Klidový stav je konec pohybu, ne začátek: kroužek celý, lístek rozložený, nová stránka hned. Kresby stojí a text pod nimi říká totéž. Co má být skryté jen do připravení, skrývej přes `display`, ne `visibility`.

### Přechody mezi stránkami

`@view-transition { navigation: auto }` a typy z `pagereveal` (skript v hlavičce `src/layouts/Zakladni.astro`, styly `global.css` › Přechody):

| Typ | Kdy | Co se stane |
| --- | --- | --- |
| `dalsi`, `zpet` | běžný příchod, návrat v historii | list se ohne od pravého dolního rohu ke hřbetu a odkryje novou stránku (`--d-otoceni`, rub listu `.otoceni-ohyb`, třída `otaci-se`); Zpět ho odvine |
| `krok-dal`, `krok-zpet` | sousední kroky téže cesty (`typPrechoduKroku`) | list se posune doleva nebo doprava (`--d-list`) |
| `kratky` | pojistka plynulosti nebo Klidný režim | stará stránka jen zmizí nad novou (`--d-listek`, jen průhlednost) |

Hlavička a spodní lišta stojí. **Příchod na profil** (titulek, pruh, pásky) jen při nové návštěvě, ne po Zpět; **let fotky** z karty na desku nastaví `view-transition-name` jen na kliknuté kartě a cílové desce. Firefox přechody mezi dokumenty nemá: stránka se přepne bez animace a nic nechybí.

### Pojistka plynulosti

`src/scripts/plynulost-prechodu.ts`: skript v hlavičce změří každé otočení listu (snímky od `pagereveal` do konce přechodu, jen ve viditelném okně). Když dvě ze tří posledních měření mají pod 30 snímků za sekundu, zapíše do `localStorage` (`atlas-plynulost`) krátký přechod a další příchody na tom zařízení dostanou typ `kratky`. Na plynulém zařízení se nic nemění (rozhodnutí po R, otázka 5: otočení zůstává 900 ms). Testy `tests/data/plynulost-prechodu.test.ts`, `tests/e2e/ram.spec.ts`.

### Klidný režim

Přepínač v záhlaví (`src/components/rozvrzeni/KlidnyRezim.astro`, ikona `klid`; bod 12 Vizuálních zlepšení) pro čtenáře, kterým zdobení ztěžuje čtení. Stav je v `localStorage` (`atlas-klidny` = `1`); atribut `data-klidny` na `<html>` nastaví první skript v hlavičce ještě před vykreslením, takže nic neproblikne. Zapnutý dá:

- **krátké přechody** i bez nastavení systému: každý příchod typ `kratky` (i mezi kroky cesty), bez příchodu na profil a bez letu fotky;
- **čistý papír:** `--tecka: transparent` a `--natoceni: 0` (`:root[data-klidny][data-klidny]`, dvojitý atribut drží váhu nad nočním režimem);
- **poznámky pojmů na okraji tiskem** (Newsreader 15 px, `ui/Pojem.astro`); přepnutí rozmístí poznámky znovu (`resize`).

Kresby s pohybem a pohyb bloků po činu studenta zůstávají; výjimka je herní pohyb (rozdání, otočení kartičky, otisk „sedí“), který stojí na konci stejně jako při omezeném pohybu. Ovládá se klávesnicí (tlačítko s `aria-pressed`). Test `tests/e2e/klidny-rezim.spec.ts` (390 a 1440 px, den a noc, axe, bez probliknutí, krátký přechod, poznámky tiskem).

## Rozvržení

- **Hlavička** (`rozvrzeni/Hlavicka.astro`): logo Agora, vstupy (aktivní vtlačený), hledání ve vtlačené drážce (`/`), Můj deník s tichou tečkou, když čeká Návrat, Klidný režim a přepínač dne a noci. Na telefonu Zpět místo loga a spodní lišta s pěti vstupy (`SpodniLista.astro`).
- **Čtenářský sloupec** 680 px na středové ose; přes celou šířku jen hlavičky s deskou a oddíly na mřížce (Doba a lidé, Velké myšlenky, Zkus to žít, Kam dál). Blok v profilu má 680 px, v kroku cesty až 960 px.
- **Pevné lišty** (telefon, krok cesty, lišta hodiny) nesmějí zakrýt prvek s fokusem: `scroll-padding` a dorovnání po fokusu z klávesnice v `Zakladni.astro` (test `fokus-lista.spec.ts`). Nová pevná lišta patří do jeho selektoru.
- **Domů** je stůl s věcmi k vzetí: jeden začátek (Začít první cestu), první lístek cesty, dnešní pokus a pohlednice (střídají se po dnech, `vyberDne`), složená mapa, pruh zápisníku, pás období a lístky „na začátek“.

## Bloky a aktivity

Blok se do MDX vkládá jedním řádkem z `src/components/bloky/index.ts`; obsah Volby, Roztřiď, Změň jednu věc, Spor, Slož argument a her herny (Seřaď na ose, Kdo to řekl?, Tipni si, Kde to bylo?, Doplň citát) je v YAML (`src/content/bloky/<id>.yaml`, schéma `src/lib/bloky-schema.ts`), Příběh, Odkryj a Kdo žil dřív? se píšou v MDX. Jak blok psát, drží skill `atlas-cesta`; jak ho stavět, `atlas-komponenta`. Všechny bloky a kresby jsou pohromadě v dílně `/dilna/bloky/`.

- **Rám aktivity** (`ostrovy/RamAktivity.svelte`, bez stavu `bloky/RamAktivity.astro`): pole na tečkách se čtyřmi rohovými značkami; hlava (nadtitulek z dat, tečka období, název, razítka lidí), zadání (`.blok__scena`, `.blok__otazka`), plocha, zpětná vazba jako lístek s páskou (snippet `vazba`), pata (`Začít znovu` vlevo, hlavní čin vpravo; snippety `hlavni`, `znovu`). Props `id`, `obdobi`, `nadtitulek`, `nazev`, `lide`, `labelledby`, `ulozeno`, `cerstve`, `bind:vazbaPrvek`. Nová hra je jen vnitřek plochy; kořen má třídu `.blok`.
- **Studentova ruka:** pole `.blok__pole` a zvolené `.blok__ruka` jsou Kalamem v barvě `--pero`; pero se vybírá jednou (`VolbaPera.svelte`).
- **Co se ukládá:** vše jen v prohlížeči, záznam `atlas-denik` verze 1 (`src/lib/denik.ts`): zápisy do Mých odpovědí, stav bloků, aktivita, postup cest, čtení profilů, hodiny, výzvy a týdny. Při promítání hodiny pracuje deník promítání v `sessionStorage`. Bez `localStorage` bloky fungují do zavření stránky.
- **Herní pohyb** (`global.css` › Herní pohyb, herna-v1): `.rozdat` (karta přiletí z balíčku, zpoždění `--i` × `--z-karta`), `.otocna` s `.otocna__vnitrek`, `.otocna__lic`, `.otocna__rub` a stavem `.otocena` (otočení `--d-list`, `--k-list`), `.herni-otisk` s `.otisk` (kulaté razítko „sedí“ v inkoustu období, dopad `--d-listek`, `--k-dopad`). Jen po činu studenta; při omezeném pohybu i v Klidném režimu stav hned na konci.
- **Hry herny** (znalostní): nadtitulek „Hra“, název formátu pod ním (`nazev` rámu), otázka `.blok__otazka--mala`. Výsledek je jen „sedí“ (otisk a lístek), nebo „zkus to jinak“ (lístek s šipkou tužkou, Kalam, a jedna věta tiskem, kam se podívat); nic se nepočítá. Do deníku jen stav bloku a aktivita, žádný zápis. Logika a zamíchání se semínkem (stejné pořadí po obnovení) v `src/lib/herna/`. **Pointa není paměť** (K2): hra dává do ruky, podle čeho uvažovat (myšlenku osoby z `proc`, vztahy z `vztahy.yaml`), odkrytí řekne, o čem věta je a kdo na koho navázal; roky jsou jen drobný údaj (`.karta-osy__rok` 12,5 px, `--ink-2`).
  - **Seřaď na ose** (`<SeradNaOse id="…" />`, druh `serad`): tři až šest karet (lidé podle narození nebo smrti, události) na šňůře s kolíčky, v rámu pod 560 px svisle; tažení, klepnutí na dvě karty (prohodí se), klávesnice (šipky, Enter zvedne a položí, Escape vrátí); po kontrole značky dvojic ✓ a ⇄; roky drobně až po správném pořadí, mezi sousedy `.vazba-osy` (vztah z dat, tradovaný s „vypráví se“, jinak „mohli se potkat“, u jiné tradice jen „žili ve stejné době“; `src/lib/herna/vazby.ts`); po třech kontrolách Ukázat pořadí.
  - **Kdo to řekl?** (`<KdoToRekl id="…" />`, druh `kdo-rekl`): série otočných kartiček s citátem ze `zdroje.yaml`, nad razítky pokyn Kalamem (`pokyn`), u razítka jméno a první věta `proc` z dat (pod 520 px rámu pod sebou, jinak dva sloupce); věta, která citát opisuje, zastaví sestavení (`prozrazuje`); zkusené razítko zakázané, po trefě rub s pointou nahoře (`pointa` v YAML), větou, jménem, dílem a místem („Zapsal Platón: …“) a odkazem na stránku osoby; Další karta v patě, po poslední souhrn.
  - **Tipni si** (`<TipniSi id="…" />`, druh `tipni`, osoby `a` a `b`): papírové pravítko v lidských životech (ryska po generaci), jezdec v barvě pera nad průhledným `input type="range"` (`aria-valuetext` „tři lidské životy“, 0 = „mohli se potkat“); Zkontrolovat odhad, „sedí“ v rozpětí (`sediOdhad`), jinak směr; po dvou odhadech Ukázat, jak to bylo; po odhalení ryska v inkoustu období, čárkovaná svorka k odhadu a věty z dat (`vzdalenost()` z `cas-mapy.ts`, vztah z `vazbaDvou`).
  - **Kde to bylo?** (`<KdeToBylo id="…" />`, druh `kde`, `osoba`, `misto`, `role`, `kde` v 6. pádu): slepý výřez mini mapy osoby (sdílený obrys `/podklad/<klíč>.svg`, nejvýš 640 px), klepnutí nebo kříž šipkami a Enter položí špendlík; razítko místa, čárkovaná spojnice, vzdálenost jen slovem (`vzdalenostSlovem`), věta z dat o pobytu (`vetaPobytu`); popisky na opačných stranách (`stranyKde`).
  - **Doplň citát** (`<DoplnCitat id="…" />`, druh `doplnit`, `citat`, `slovo`, `zameny` se `vazba`, `pointa`): věta s vtlačenou mezerou a tři výstřižky (tři papíry a písma, zubatý okraj), tažení, klepnutí nebo Enter; u záměny „zkus to jinak“ s tím, co by věta tvrdila; se správným slovem pointa, celý citát s místem a „A kdyby tam stálo…“ u všech záměn.
- **Kresba s pohybem** (`ostrovy/Kresba.svelte`): rám s Pustit a Zastavit pohyb; zastavená kresba kreslí obsah, ne začátek smyčky; při omezeném pohybu stojí a popis říká totéž.

## Komponenty

Jen co komponenta dělá a kde je; props a ukázka použití jsou v úvodním komentáři souboru (výpis: `python3 scripts/komponenty-api.py`).

| Oblast | Soubory | Co |
| --- | --- | --- |
| Rám webu | `rozvrzeni/Hlavicka.astro`, `SpodniLista.astro`, `Drobecky.astro`, `KlidnyRezim.astro`, `PrepinacRezimu.astro`, `ListaHodiny.astro`, `Pisma.astro`; `layouts/Zakladni.astro` | hlavička, lišty, přepínače, písma, skripty v hlavičce (režim, klid, pero, hodina, přechody) |
| Papír a znaky | `ui/Deska.astro`, `ui/Citat.astro`, `ui/RazitkoCloveka.astro` (`.svelte` pro ostrovy), `ui/Pojem.astro`, `ui/PasObdobi.astro`, `ui/Ikona.astro`, `ui/Tlacitko.astro`, `ui/GrafKrivek.astro`, `ui/RadekPomoci.astro` | deska s fotkou a páskami (`<Deska osoba={o} osobni />`), citát z dat (`<Citat id="…" kompaktni />`), razítko, pojem s poznámkou (`<Pojem id="…">slovo</Pojem>`), pás období, ikony ze spritů |
| Bloky do MDX | `bloky/*.astro` (index `bloky/index.ts`) | `<Volba id="…" />`, `<Odkryj id="…" otazka="…" tlacitko="…">`, `<Pribeh id="…" osoba="…" nadtitulek="…" titulek="…" popisek="…">`, `<Spor id="…" />`, `<Roztrid id="…" />`, `<ZmenJednuVec id="…" />`, `<SlozArgument id="…" />`, `<SeradNaOse id="…" />`, `<KdoToRekl id="…" />`, `<TipniSi id="…" />`, `<KdeToBylo id="…" />`, `<DoplnCitat id="…" />`, `<KdoZilDriv a="…" b="…" />`, `<Strany blok="…">`, `<ZaverCesty id="…" otazka="…" />` a kresby (`<Jeskyne />`, `<Lod />`, `<TretiCara />`…) |
| Ostrovy (Svelte) | `ostrovy/*.svelte` | stav bloků, kresby, deník, hledání (Pagefind), Pokračuj, první názor a Změnil se na stránce otázky, osa hlasů, Dva životy, Tvoje antika, týden |
| Cesta | `cesta/CestaHlavicka.astro`, `CestaLista.astro`, `ListekCesty.astro`, `ListyKroku.astro`, `CestaKarta.astro`, `PostupCesty.svelte` | lišta kroku s postupem, pevná lišta Předchozí/Další (další je tichý, dokud student neodpoví), lístek cesty s pahýlem, listy kroku |
| Stránky osob | `osobnost/StrankaProfilu.astro`, `StrankaMedailonku.astro`, `Kapitola.astro`, `ListyProfilu.astro`, `ObsahProfilu.astro`, `VstupyOsoby.astro`, `DobaALide.astro`, `MiniMapa.astro`, `MiniOsa.astro`, `DvaZivoty.astro`, `Myslenky.astro`, `ZkusToZitKarta.astro`, `KamDal.astro`, `Prameny.astro` | hlavička s titulkem a deskou, kapitoly na čistém listu, Doba a lidé, Kam dál, Prameny |
| Stránky z dat | `stranka/HlavickaStranky.astro`, `Oddil.astro`, `OkrajObdobi.astro`, `OsaUdalosti.astro`, `Rodokmen.astro`, `MistaTradice.astro`, `SeznamTradic.astro`, `StrankaUvodu.astro`, `DesetOtazek.astro` | období, směr, pokus, úvody, tradice; hlavička i pro Stoický týden |
| Velká otázka | `otazka/HlasyOdpovedi.astro`, `HlasyOsa.astro`, `OsaHlasu.astro` | hlasy myslitelů na ose a odpovědi na úvodní případ |
| Mapa a čas | `mapa/MapaACas.svelte`, `Mapa.svelte`, `Posuvnik.svelte`, `Reka.svelte`, `KartaCloveka.svelte`, `PasObdobi.svelte`, `LegendaVztahu.svelte` | výstřižek mapy s lístečky (`src/lib/mapa-listky.ts`), posuvník roku s kotvami (`src/lib/kotvy.ts`), řeka životů, karta člověka a Přehrát život (`src/lib/zivot-na-mape.ts`) |
| Deník a hodina | `denik/MojeFilozofie.svelte`, `SbirkaDeniku.svelte`, `PrenosDeniku.svelte`, `ostrovy/Denik.svelte`; `hodina/Skladatel.svelte`, `HodinaStudent.svelte`, `MojeHodiny.svelte`; `tyden/TydenKarta.astro`, `TydenOdkaz.astro` | zápisník po kapitolách období, sbírka, záloha a přenos, příprava a promítání hodiny, týdny cvičení |

**Sdílené soubory místo opakování na každé stránce** (revize R, otázka 4): obrys pobřeží mini mapy je `/podklad/<klíč>.svg` (`src/lib/podklad-sdileny.ts`, `src/pages/podklad/[klic].svg.ts`) a jména a roky pro Dva životy `/dva-zivoty.json` (`src/lib/dva-zivoty-data.ts`). Stránka nese jen to, co je jen její.

## Sazba

Jednopísmenné předložky a spojky a letopočty („423 př. n. l.“) mají nezlomitelné mezery. Do textů se ručně nepíšou: v MDX je doplní plugin `sazbaMdast`, v textech bloků `radek` a `odstavce`, u textů z dat a atributů zavolá komponenta `nezlomitelne()` (`src/lib/sazba.js`). Text skládaný v ostrovu (Svelte) potřebuje totéž. Test `tests/e2e/letopocty-dist.spec.ts` hledá v celém sestaveném webu letopočet s obyčejnou mezerou; výpis podle místa dá `python3 scripts/letopocty-dist.py`.

## Přístupnost

WCAG 2.1 AA ve dne i v noci. Každý stav má druhý znak mimo stín a barvu. Dotykový cíl aspoň 44 × 44 px. Ikony mají `aria-hidden`, razítko a mince nesou jméno. Rozbalovací kapitola deníku je `details` s nadpisem v `summary` (ověření VoiceOverem v Safari: plán větve, Po O). Mapa a čas: lístečky a místa jsou tlačítka, řeka má textovou alternativu, popisky krajů pod lístečkem, měřítkem nebo špendlíkem se schovají a překryté lístečky přejdou na špendlík. Hlídají to axe v testech nových stránek, `scripts/kontrola-fokus.mjs` a `scripts/revize-tabulator.mjs`.

## Referenční snímky

`tests/e2e/snimky.spec.ts`: dvanáct obrazovek (Domů, profil, krok cesty se Sporem, přehled cesty, velká otázka, období, Mapa a čas, deník s kapitolami, pojem, kresba; telefon a notebook, den a noc) proti snímkům v `tests/e2e/snimky/`, jen Chromium, jeden snímek pro Mac i Linux (tolerance na vyhlazení písma). Po záměrné změně vzhledu `--update-snapshots` a nové snímky si prohlédnout.
