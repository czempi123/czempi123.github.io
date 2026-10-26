# Atlas myšlení: design systém

29. 9. 2026 · schválený vizuální návrh (P1) · plátno s obrazovkami: https://claude.ai/artifact/YVzSX5emgdTG3U4V8sr9Mu

Podklady k převzetí do kódu: `docs/design/atributy-ikony.json` (ikony atributů), `docs/design/ornamenty.js` (ornamenty pásu období), `docs/design/mapa-podklad.mjs` (referenční generátor podkladové mapy).

Atlas vypadá jako dobře udělaný časopis nebo muzejní průvodce: teplý papír, silná patková typografie, velké obrazy a jedna barva pro každé období. Tento dokument je závazný pro P2, P4, P5 a skill `atlas-komponenta`.

## Principy

1. **Barva říká, kde v dějinách jsem.** Každé období má svůj pigment; na mapě, na ose, u lidí i v pásu období.
2. **Klid pro čtení, bohatost v navigaci.** Čtenářské stránky jsou tiché (papír, inkoust, jeden akcent). Barvy a ornamenty patří do pásu období, desek s obrazy a map.
3. **Každý znak se vysvětlí.** Atribut, ornament i čára na mapě mají při prvním setkání odpověď na otázku „Proč?“.
4. **Student vždy ví, kde je, jak se vrátí a co dál.** Stálá hlavička, drobečková navigace na stejném místě, jedno hlavní tlačítko.
5. **Světlý i tmavý režim jsou rovnocenné.** Oba splňují WCAG AA pro všechen text.

## Barvy

Výchozí je **varianta A · Papír a pigment**. Varianta B · Mramor a inkoust je zdokumentovaná níže jako alternativa (chladnější, blíž profilu Marca v9); zatím se neimplementuje.

### Základ (A)

| Token | Světlý | Tmavý | Použití |
| --- | --- | --- | --- |
| `--paper` | `#F4EFE6` | `#17140F` | pozadí stránky |
| `--surface` | `#FBF8F2` | `#211D17` | karty, panely, spodní list |
| `--sunk` | `#EAE3D6` | `#2B261F` | zapuštěné plochy, stopa posuvníku |
| `--rule` | `#DDD3C3` | `#3B342B` | linky, okraje |
| `--muted` | `#6B6154` | `#A69B8A` | popisky, letopočty (AA i na `--sunk`) |
| `--ink-2` | `#4A4239` | `#D2C9BB` | druhotný text, perexy |
| `--ink` | `#211C17` | `#F1EBE0` | text, hlavní tlačítko (text na něm `--paper`) |

### Období (A)

Každé období má čtyři tokeny: `--period-N` (text, čáry, značky), `--period-N-tint` (světlé podbarvení kapitol, zpětné vazby), `--period-N-soft` (jemné pruhy, linky na tintu), a pro duotónové desky `--period-N-plate` / `--period-N-on-plate` (ve světlém režimu = barva / tint, v tmavém = soft / barva).

| N | Období | Pigment | Světlý: barva · tint · soft | Tmavý: barva · tint · soft | Ornament |
| --- | --- | --- | --- | --- | --- |
| 1 | Počátky a klasické Řecko | terakota | `#A34329` · `#ECDED3` · `#E2C9BC` | `#E48B68` · `#34251B` · `#483023` | meandr a amfora |
| 2 | Helenismus a Řím | tyrský purpur | `#7B3565` · `#E8DCD9` · `#D9C6CA` | `#D48DBF` · `#312528` · `#44303A` | mozaika a oblouk |
| 3 | Středověk | lapis lazuli | `#2D4E9B` · `#E0DFDE` · `#C8CCD6` | `#95ACEE` · `#29292E` · `#393C4C` | gotická okna a rozeta |
| 4 | Renesance a raný novověk | olovnato-cínová žluť | `#865B0F` · `#E9E0D0` · `#DCCEB7` | `#E0B359` · `#332A19` · `#534425` | perspektivní mřížka |
| 5 | Osvícenství | pruská modř | `#1C5B6B` · `#DEE0DA` · `#C4CECB` | `#6DBFCE` · `#232C2A` · `#314748` | paprsky světla |
| 6 | 19. století | smaragdová zeleň | `#3D6B38` · `#E2E2D5` · `#CCD2C0` | `#93C486` · `#282D20` · `#3C4933` | ozubená kola a koleje |
| 7 | 20. století: krize a hledání | kadmiová červeň | `#A12538` · `#ECDBD5` · `#E2C3C0` | `#F0848F` · `#352421` · `#4B2E2D` | konstruktivistické tvary |
| 8 | Po válce a dnes | dioxazinová fialová | `#5A4A9C` · `#E5DEDF` · `#D2CBD6` | `#B5A8F0` · `#2D292E` · `#433D4F` | síť bodů a uzlů |

Sousední období se liší odstínem (teplá a studená se střídají); rozlišení nikdy nestojí jen na barvě, vždy je u ní číslo nebo název.

### Mapa (A)

| Token | Světlý | Tmavý |
| --- | --- | --- |
| `--map-sea` | `#D6E0DC` | `#0E1618` |
| `--map-sea-line` | `#B4C5BF` | `#1F3136` |
| `--map-land` | `#F8F4EB` | `#241F19` |
| `--map-coast` | `#A3957E` | `#5E5446` |

### Varianta B · Mramor a inkoust (alternativa)

Základ světlý: paper `#EEEDE9`, surface `#FFFFFF`, sunk `#E3E2DD`, rule `#D5D4CF`, muted `#5E646B`, ink-2 `#3B4046`, ink `#141619`. Tmavý: `#0F1114`, `#171A1E`, `#20242A`, `#2D3238`, `#99A0A8`, `#C9CED3`, `#F2F3F4`.
Období světlý 1–8: `#A83B26` `#8B2A6C` `#1D53AE` `#805B00` `#0A657A` `#226F49` `#AC1C3B` `#5C41AE`; tmavý: `#F08B6D` `#E68ECA` `#88AFFF` `#F2C150` `#60CCE0` `#7FD2A3` `#FF8497` `#B5A3FF`. Tinty a soft tóny jsou na plátně (deska Design tokeny).
Mapa světlý: `#DAE2E9` `#B8C6D1` `#FAFAF8` `#949EA7`; tmavý: `#0A1015` `#1B2934` `#1B1F24` `#4B545D`.

## Typografie

- **Newsreader** (Production Type, OFL): nadpisy, čtení, citáty; optická velikost 6–72, řezy 300–700, kurzíva. Kurzíva nese pointu nadpisu („Nikdo není *moudřejší.*“).
- **Instrument Sans** (OFL): ovládání, popisky, nadtitulky, letopočty; řezy 400–700.
- Obě písma lokálně (WOFF2, podmnožiny latin a latin-ext), žádné Google Fonts za běhu.
- Letopočty tabulkovými číslicemi, „469–399 př. n. l.“ s nezlomitelnými mezerami, české uvozovky „…“.

| Token | Písmo | Notebook | Telefon | Řádkování, prostrkání |
| --- | --- | --- | --- | --- |
| `display-1` | Newsreader 400 | 148 | 76 | 0,9 · −3,5 % |
| `display-2` | Newsreader 400 | 92 | 50 | 0,98 · −2,5 % |
| `h1` | Newsreader 400 | 64 | 44 | 1,0 · −2 % |
| `h2` | Newsreader 400 | 48 | 34 | 1,05 · −1,5 % |
| `h3` | Newsreader 400 | 34 | 27 | 1,12 |
| `citat` | Newsreader 400 | 32 | 25 | 1,25 |
| `perex` | Newsreader 400 | 23 | 19 | 1,55 |
| `text` | Newsreader 400 | 21 | 19 | 1,65 |
| `ovladani-l` | Instrument Sans 600 | 17 | 17 | 1,3 |
| `ovladani` | Instrument Sans 500 | 15 | 15 | 1,45 |
| `popisek` | Instrument Sans 400 | 13 | 12 | 1,5 |
| `nadtitulek` | Instrument Sans 600, verzálky | 12 | 11 | +0,14 až 0,16 em |

**Jednopísmenné předložky a spojky** (k, s, v, z, o, u, a, i) nezůstávají na konci řádku. Nezlomitelnou mezeru za ně doplní sestavení, do textů se ručně nepíše: v MDX plugin `sazbaMdast` (zapojený v `astro.config.mjs`), v textech bloků a hlasů funkce `radek` a `odstavce`, u textů z dat a z atributů komponent `nezlomitelne()` v komponentě (citát, karta cesty, popisek Příběhu, otázka v Odkryj a v Mém stanovisku). Vše je v `src/lib/sazba.js`. Nová komponenta, která vypisuje delší text z dat, si `nezlomitelne()` zavolá sama.

## Mezery, mřížka, tvary

- Mezery (základ 4 px): 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96.
- Mřížka 12 sloupců, mezera 24; okraj stránky 80 (notebook) / 16 (telefon); čtenářský sloupec 680 px.
- **Středová osa stránky osobnosti:** úvod, citát, kapitoly, vložené bloky (Kdo žil dřív?, Změň jednu věc, Spor) a Prameny leží v jednom čtenářském sloupci uprostřed stránky. Přes celou šířku jdou jen hlavička s deskou a oddíly, které stojí na mřížce: Doba a lidé (osa, mapa, vztahy), Velké myšlenky, Zkus to žít a Kam dál. Text uvnitř širokých oddílů začíná u jejich levého okraje. Na telefonu je všechno v jednom sloupci. V hlavičce stojí u letopočtů rodiště; když ho neznáme, místo, kde člověk působil naposledy. Hned pod nimi jsou **vstupy osobnosti** (viz Komponenty): cesty, kde člověka potkáš; velké otázky stojí na telefonu až pod deskou, od 900 px pod cestou vlevo od desky.
- Zaoblení: `xs` 4 (obrazy, pásy) · `sm` 8 (tlačítka, pole) · `md` 14 (karty, panely) · `lg` 20 (spodní list) · `full` (mince, čipy).
- Stín: překryv na mapě `0 6px 18px rgb(0 0 0 / 12%)`; spodní list `0 -8px 28px rgb(0 0 0 / 14%)`. Jinak bez stínů.
- Hlavička 72 px (notebook) / 56 px (telefon), spodní lišta 72 px, dotykový cíl nejméně 44 × 44.
- Pohyb: přechody 150–250 ms, kamera mapy 600 ms; při `prefers-reduced-motion` bez animací.

## Navigace a rozvržení

- **Notebook:** hlavička s logem (glóbus a „Atlas myšlení“), vstupy Domů · Mapa a čas · Otázky · Lidé a směry (aktivní podtržený inkoustem), hledání s klávesou `/`, Můj deník, přepínač režimu.
- **Telefon:** horní lišta s názvem nebo „‹ Zpět na …“, spodní lišta s pěti ikonami a popisky (Domů, Mapa, Otázky, Lidé, Deník).
- **Drobečková navigace** vždy pod hlavičkou vlevo (Lidé a směry / období / osoba).
- **Cesta** má soustředěnou hlavičku: vlevo zpět na přehled cesty, uprostřed postup po krocích, vpravo Režim třídy a Uložit a odejít. Dole pevná lišta Předchozí krok / Další krok. Obsah kroku i přehledu cesty stojí na středové ose stránky (oddíl Cesta).
- **Nic nesmí zapadnout.** Ke každé cestě a stránce otázky vede vstup z míst, kde ji student čeká: z Domů nebo přehledu otázek, z hlavičky profilu každého jejího filozofa, z karty člověka v Lidech a z Kam dál. Vstup je vidět bez rozbalování a cesta i bez posouvání. Otázky v hlavičce profilu stojí na telefonu až pod deskou: s pěti a více otázkami by jinak odsunuly obraz i první odstavec na druhou obrazovku (revize celku 7, nález 6).
- **Domů má jeden začátek** (`src/pages/index.astro`). Nadpis `h1` (64 / 44 px), perex a jediné hlavní tlačítko „Začít první cestu“, které vede rovnou na krok 1 cesty 1; pod ním údaj z dat cesty („Cesta 1 · asi 20 minut · 7 kroků“) a vedle něj textový odkaz „Poznat Sókrata“. Vedle úvodu (na telefonu pod ním) stojí panel první cesty: mince filozofů, „Cesta 1 · název“, titulek a vstup cesty z dat; nemá vlastní tlačítko a vede na tentýž krok. Pod úvodem Osm období a tři vstupy (Mapa a čas, Otázky, Lidé a směry). Karta cesty, tlačítko do mapy ani Příběh na začátek na Domů nejsou. Na 1280 × 720 a 390 × 844 je nadpis, perex i tlačítko s údajem vidět bez posouvání a pod nimi kus dalšího obsahu; hlídá to test v prohlížeči (`tests/e2e/domu.spec.ts`).
- **Kam dál na stránce osobnosti** (`KamDal.astro`): dvě až čtyři karty s odkazem a šipkou. Položka bez `href` je stránka, která teprve vznikne (cesta celku, než ji dopíše další krok): karta má čárkovaný okraj, nemá šipku, nikam nevede a její nadtitulek končí slovem „připravujeme“ jako připravovaná období v Mapě a čase. Až stránka vznikne, doplní se `href`.
- **Obsah stránky osobnosti** (`ObsahProfilu.astro`) vypisuje kapitoly a za nimi další oddíly, které na stránce opravdu jsou (Doba a lidé, Dvě velké myšlenky, Zkus to žít, Kam dál, Prameny). Notebook: pod hlavičkou profilu řádek odkazů; když odjede z obrazovky, drží pod hlavičkou webu tenká lišta (44 px) s tlačítkem „Obsah“ a názvem právě čteného oddílu, která rozbalí seznam. Lišta nezabírá místo: čtenářský sloupec (680 px) se nezúží ani neposune a široké oddíly nic z boku nepřekrývá. Sloupec s obsahem v okraji se nepoužívá: vedle čtenářského sloupce je na 1440 px 300 px, na 1280 px 230 px a pod 1200 px se nevejde, a ve druhé půlce stránky by ležel přes široké oddíly. Telefon: tatáž lišta stojí místo řádku odkazů hned od začátku. Podrobnosti v Komponentách.
- Rámeček fokusu 2 px `--ink`, odsazení 3 px, jen při `:focus-visible`.

## Komponenty

- **Tlačítka:** hlavní (`--ink` / text `--paper`, výška 48–56), vedlejší (obrys `--ink`), tiché (obrys `--rule`), textový odkaz s podtržením.
- **Mince (atribut osobnosti):** kruh s ikonou atributu, dvojitý okraj (1,5 px barva období, mezera, 1 px soft). Varianty: `ring` (na mapě, povrch), `tint` (karty), `sel` (vybraný člověk, plná barva). Velikosti 24–26 (mapa), 36–44 (karty, portrét), 56–64 (přehledy). Nikdy iniciála.
- **Deska:** duotónová plocha pro fotografii (busta, freska, rukopis) v barvách `--period-N-plate` / `--period-N-on-plate`, vždy s popiskem pod obrazem a licencí v Pramenech (oddíl Obrázky: popisek, autor, instituce, licence s odkazem). Výřez drží tvář v horní třetině (`object-position: 50% 25%`). Na stránce osobnosti s fotografií se mince s atributem přesune k popisku „Proč …?“; pod ním stojí i popisek obrázku (`.obraz-popisek`), protože u rytiny nebo kresby říká, čí je to představa a z kdy. Vlastnost `obrazOsoby={false}` vypne portrét osoby (používá Příběh). Obrázek, u kterého by výchozí výřez usekl to podstatné (rytina, kresba), má v `zdroje.yaml` vlastní střed výřezu `vyrez` („50% 37%“). Deska v hlavičce osobnosti je na telefonu na šířku (16 : 10); obrázek na výšku, kterému tam jeden střed nestačí, má pro ni druhý střed `vyrezNaSirku` (Epiktétos, Marcus Aurelius). Oba výřezy hlídá test v prohlížeči.
- **Mini mapa osoby** (Doba a lidé): výchozí egejský výřez, dokud jsou v něm vidět všechna místa osoby; jinak se střed a měřítko spočítají z míst i s popisky (`vyrezMiniMapy` v `src/lib/mapa.ts`), takže je vidět i Sinópé nebo Thurioi. Popisek stojí vpravo od bodu; vlevo u pravého okraje a u bodu, který má těsně vpravo souseda (Korinth vedle Athén). Když by se řádky dvou popisků potkaly (Athény se třemi řádky vedle Kolofónu), vysune se popisek s méně řádky nad svůj bod: název stojí nahoře a poslední řádek rolí vedle bodu (`umisteniPopisku`). Že se popisky nepřekrývají, hlídá test v prohlížeči na obou šířkách u všech profilů. Rok v popisku, který je v datech přibližný (`priblizne`), nese „asi“ („působení asi 93 n. l.“). Když jsou všechna místa ve výchozím výřezu vidět, ale popisek u kraje by vyjel ven (Pella u Aristotela má popisek vlevo kvůli Stageiře), výřez se o málo oddálí a posune: hledá se nejmenší oddálení a k němu nejmenší posun, při kterém se vejdou body i popisky a žádný řádek neleží těsně u cizího bodu ani u cizího řádku (`vyrezProPopisky`).
- **Mini osa současníků** (Doba a lidé, `MiniOsa.astro`): pruhy životů lidí, kteří žili zároveň s osobou, na ose po 50 letech. Když osa přechází přelom letopočtu (Seneca u Epiktéta), nesou značky vlevo od přelomu „př. n. l.“; osa jen z roků před naším letopočtem to říká popiskem pod sebou. Hlídá test v prohlížeči.
- **Vztahy v Době a lidech** (`skupinyVztahu` a `roleVztahu` v `src/lib/vztahy.ts`): skupiny Učitelé, Žáci, Znali se a přeli se (`znali-se`, `polemika`) a dvě skupiny pro `vliv-textem` podle směru: Četli ho a navázali („navázal na jeho texty“) a Koho četl („znal ho z textů“). Pod „Znali se a přeli se“ nesmí stát nikdo, kdo druhého jen četl (Epiktétos a Marcus Aurelius, Epikúros a Lucretius); hlídá jednotkový test i test v prohlížeči. Prázdná skupina se nevypisuje. **Spor na dálku** (`sporNaDalku`): polemika lidí, kteří se osobně přít nemohli, má vlastní skupiny podle směru: S kým se přel na dálku (osoba stránky je kritik: Aristotelés a Sókratés) a Kdo se s ním přel později (osoba stránky je ten, s kým se kritik pře); popisek je „přel se s jeho učením“, stejně v kartě člověka na mapě. Osobně se mohli přít ti, kdo aspoň rok žili zároveň a oběma bylo aspoň patnáct (`mohliSePrit`; Karneadovi bylo sedm, když Chrýsippos zemřel). Poznámka u takového vztahu je otázka, o kterou šlo („stačí vědět, co je dobré?“), aby seděla na obou stránkách.
- **Pás období:** osm segmentů bez mezer; pozadí každého segmentu je gradient, který na hranách přechází do poloviční směsi se sousedem; ornament období je maskovaný do ztracena k okrajům. Varianty: velký (Domů, 250 px), malý přepínač (mapa, 26–28 px, aktivní období širší).
- **Volba s důvodem:** karty možností A–D (min. 60 px), vybraná má okraj 2 px a tint období; pole „Proč právě tohle?“ nepovinné (blok s `bezDuvodu: true` ho nemá); zpětná vazba v tintu období s titulkem „Tvůj tah: …“ a oddílem „Co udělal …“.
- **Odkryj (dříve Nejdřív sám):** povrchová karta s nadtitulkem v barvě období, otázkou v Newsreaderu, polem a tlačítkem „Porovnat…“; po odkrytí srovnání v tintu období, modelové odpovědi a sebekontrola. API v oddílu Bloky.
- **Zkus to žít:** karta v tintu období, jedno hlavní tlačítko „Přijmout výzvu“. Stojí v profilu; smí stát i v posledním kroku cesty mezi textem a závěrečným pravidlem (cesta 4: `<ZkusToZitKarta id="cesta4-kam-te-to-tahne" nazev="…" odkaz="/cesta/<slug>/<n>/#zkus-to-zit">`), mimo čtenářský sloupec jako blok.
- **Moje stanovisko:** krátký zápis do deníku (`MojeStanovisko.svelte`, druh `stanovisko`). V profilu za tlačítkem „Moje stanovisko“ s Uložit / Zrušit. S vlastností `rozbalene` (závěr cesty) je otázka s polem vidět hned, text se ukládá sám 600 ms po psaní, při opuštění pole i při odchodu ze stránky; pod polem „Ukládá se samo do deníku.“ / „Uloženo v deníku.“ (`aria-live`). Smazaný text zmizí i z deníku.
- **Graf křivek** (`src/components/ui/GrafKrivek.astro`, geometrie v `src/lib/graf.ts`): vlastní jednoduchá kresba jedné až tří křivek pro studii nebo průzkum, bez JavaScriptu. Ukazuje směr, ne přesné hodnoty: vodorovná osa má dílky bez čísel a nejvýš jednu svislou značku s popiskem („100 000 dolarů“), svislá jen název a směr („lépe“). Popisky stojí přímo u křivek, legenda není. První křivka má barvu období, druhá inkoust a čárkování, takže se neliší jen barvou. Karta na povrchu (`--surface`) s okrajem `--rule`, nejvýš 420 px; na telefonu vyjde jednotka kresby na pixel (písmo 13 a 12 px). Text pod kresbou (slot, povinný) říká totéž slovy a je popisem obrázku pro čtečky (`role="img"`, `aria-describedby`). Čísla jen z podkladů; graf ze studie se nepřekresluje bod po bodu.
  ```mdx
  <GrafKrivek id="graf-penize-stesti" osaY="Jak se lidé právě cítí" smerY="lépe" osaX="Roční příjem domácnosti"
    poznamkaX="Každý dílek je dvojnásobek předchozího." dilku={5} znacka={{ x: 3, text: '100 000 dolarů' }}
    krivky={[{ nazev: 'Většina lidí', body: [[0, 0.42], [5, 0.86]] }, { nazev: 'Nejméně šťastná pětina', body: [[0, 0.1], [3, 0.4], [5, 0.4]], carkovana: true }]}>
    U většiny lidí nálada s příjmem roste dál. …
  </GrafKrivek>
  ```
  Bod křivky je `[dílek 0…n, výška 0…1]`; `popisek: [dílek, výška]` posune popisek křivky jinam než nad její konec. Chybné zadání zastaví sestavení (`chybyGrafu`).
- **Kresba s pohybem** (rám `src/components/ostrovy/Kresba.svelte`, styly `global.css` › Kresba s pohybem): vlastní kresba, která se hýbe a kterou student ovládá. Je to forma pro prostor, děj nebo pořadí, které se z textu špatně představuje; autor ji chce v atlasu častěji (4. 10. 2026). Kdy po ní sáhnout, říká skill `atlas-cesta`, jak ji postavit, skill `atlas-komponenta`.
  - **Rám** dává kartu jako Graf křivek (povrch, okraj `--rule`, nejvýš 520 px), nadtitulek „Podívej se“, název, přepínač pohledů (skupina přepínačů, šipky, cíle 44 px; při jediném pohledu chybí), plátno SVG, místo pro další ovládání, text pod kresbou (`aria-live`, zároveň popis obrázku pro čtečky; nezlomitelné mezery za jednopísmennými předložkami mu doplní rám, protože text jde z JavaScriptu kresby) a tlačítko „Zastavit pohyb / Pustit pohyb“. Rozhraní: `id`, `obdobi`, `nadtitulek`, `nazev`, `pohledy`, `pohled` (`bind:`), `popis`, `viewBox`, `maPohyb` a snippety `kresba` (scéna) a `ovladani` (třeba posuvník s třídou `k-posuvnik`). Kresba, ve které nic neběží samo, předá `maPohyb={false}` a tlačítko pohybu nemá. Přepínač rámu (pilulky, třída `k-prepinac` v `global.css`) může kresba použít i ve svém ovládání: obal `k-volba` mu dá popisek nad sebe, `k-volba--radek` vlevo od sebe. Tlačítka v ovládání jsou běžná `blok__tl` v řádku `blok__akce`.
  - **Tři tóny** vycházejí z desky období: třídy `k-svetlo` (`--pc-on-plate`), `k-stin` (`--pc-plate`) a `k-tma` (stín smíchaný s černou přes `color-mix`; jediná barva kresby mimo tokeny). Popisky v kresbě mají třídu `k-popisek`. Výjimka je kresba, jejímž tématem je barva (šaty): ta má barvy vlastní, zapsané v `src/lib/saty.ts`. Plátno má 340 × 240 jednotek, takže na telefonu vyjde jednotka asi na pixel.
  - **Pohyb** je CSS animace pod `.kresba--pohyb` na prvcích s třídou `k-hybe`. Běží po načtení; při omezeném pohybu kresba stojí a tlačítko chybí. **Zastavená kresba ukáže totéž co při omezeném pohybu**, ne okamžik, kde se zastavila (pod `.kresba--pohyb:not(.kresba--bezi)` jméno animace `none`): kdo pohyb zastaví hned po načtení, by jinak obsah nikdy neviděl. Pustit pohyb začne smyčku znovu. Každá kresba s pohybem má test zastavení hned po načtení. Pravidlo platí od 26. 10. 2026 (revize antiky, nález 5); vzniklo u Přesýpacích hodin. Nic se nestřídá samo: pohled a stupeň mění jen student.
  - **Není to blok:** nic se neukládá a kresba nenabízí Kam dál, proto nemá třídu `.blok`. Je to obraz k textu, ne úkol; text kroku drží i bez ní.
  - **Jeskyně** (`<Jeskyne id="jeskyne-pohledy" />`, krok 1 cesty 3; texty a geometrie `src/lib/jeskyne.ts`): Platónova jeskyně ve dvou pohledech. **Pohled vězňů** (výchozí): osvětlená stěna, po které přecházejí stíny nesených věcí (džbán, soška, kůň, kladivo, pták), dole stín zídky se stíny hlav a v popředí tři vězni zezadu; student sedí mezi nimi. **Pohled z boku**: oheň na vyvýšeném místě, nosiči za zídkou, vězni v poutech a stěna; stíny na stěně leží na přímkách z ohně (`stinNaStene`), popisky stojí přímo v kresbě.
  - **Cesta ven** (`<JeskyneVen id="jeskyne-ven" />`, krok 3 cesty 3): pohled **Cesta ven** je řez jeskyní s pruhem světla nahoře, strmou chodbou a ohněm, nosiči, vězni a stěnou dole; chodbou stoupá dvojice, ten, kdo vleče, a vězeň. Pohled **Venku** má posuvník „Posuň: oči si zvykají“ se šesti stupni v pořadí pramene (516a–b): záře, stíny, odrazy ve vodě, věci samé, noční nebe, slunce. Co je na kterém stupni vidět, počítá `vrstvyVenku`; vrstvy se prolínají přechodem, posuvník jde šipkami a má `aria-valuetext`.
  - **Stejné šaty, jiné světlo** (`<Saty id="saty-svetlo" />`, krok 6 cesty 1; texty a barvy `src/lib/saty.ts`): postava v šatech stojí v místnosti s obrazem, lampou, kočkou a vázou. Šaty mají dvě barvy, které se nemění (modrá `#8f9bd0`, hnědá `#74633f`). Posuvník „Posuň: mění se jen světlo“ vede místnost pěti stupni od chladného denního světla přes bílé k teplému umělému a přebarvuje všechno ostatní. Světla jsou spočítaná tak, aby se šaty na krajích shodly s věcmi známé barvy: v chladném světle s bílým okrajem obrazu a zlatým rámem, v teplém s modrou vázou a černou kočkou (`scena` v `src/lib/saty.ts`). Na té shodě dojem stojí; barevné okolí samo ho nevyvolalo. Pod posuvníkem jsou dva vzorky barev šatů. Kresba má jeden pohled a nic v ní neběží samo: nemá přepínač ani tlačítko pohybu. Text pod kresbou tu shodu pojmenuje a říká, co na fotce vidí ten, kdo dané světlo čeká; neříká, co vidí student. Stojí pod blokem Změň jednu věc: blok k ní vede vlastním Kam dál („Proč je každý vidí jinak“), další krok nabízí lišta.
  - **Stejný vítr** (`<StejnyVitr id="vitr-dva-lide" />`, profil Prótagora, kapitola 01, pod blokem Volba; stav a texty `src/lib/vitr.ts`): dva lidé, Ty a Kamarád, stojí v jednom větru. Čtyři proudy větru vedou přes celou kresbu a šály obou vlají stejně; to je jediný pohyb a jde zastavit. Pod plátnem je pokyn „Změň, co má kdo za sebou“ a u každého přepínač čekání / chůze. Kdo čekal, stojí schoulený a říká „Je mi zima.“, kdo šel, stojí rovně a říká „Není mi zima.“ Pózy se prolínají přechodem, proudy větru se nemění nikdy. Text pod kresbou popisuje stav a končí tím, že vítr je stejný; kdo má pravdu, neříká. Otázku klade až kurzíva pod kresbou.
  - **Roztrhni kartu** (`<DvePulky id="dve-pulky-karta" />`, krok 3 cesty 5, pod blokem Odkryj; karty a texty `src/lib/dve-pulky.ts`): přepínač rámu vybírá jednu ze tří karet z koše Zčásti (Zpráva, Známka, Zápas; karty zná student z kroku 2). Karta je světlý list na tmavém plátně, vlevo věta o tom, co udělám já, vpravo to, v co doufám. Tlačítko „Roztrhnout kartu“ list roztrhne po klikaté trhlině: levá půlka („moje půlka“) zůstane světlá, pravá ustoupí do barvy desky a dostane štítek, čí je. Pod plátnem se pak volí, „Co se stane na druhé půlce“ (tři možnosti na kartu). Mění se jen pravá půlka a text pod kresbou; levá věta zůstává. Co je už roztržené, zůstane roztržené i po přepnutí karty. Věty na kartě jsou zalomené ručně (nejvýš dva řádky po 16 znacích). Nic neběží samo.
  - **Kdy je dost?** (`<KolikJeDost id="kolik-je-dost-pohar" />`, krok 3 cesty 6, před blokem Volba; stav a texty `src/lib/pohar.ts`): pohár v řezu a nad ním čárkovaná čára „dost“. Hladina ukazuje, kolik žízně je pryč, ne kolik vody student vypil; míra „chybí“ vlevo se s každým dolitím zkracuje. Tlačítko „Dolít vodu“ zvedne hladinu třikrát, potřetí k čáře. U čáry přibudou „Přidat mátu“ / „Vyndat mátu“ a „Od začátku“: další voda hladinu nezvedne, máta změní vodu (vlnky, snítka, popisek „voda s mátou“), hladinu ne. Proud vody je jednorázový děj po klepnutí a při omezeném pohybu se neukáže; nic neběží samo.
  - **Zdvoj čtverec** (`<ZdvojCtverec id="zdvoj-ctverec" />`, portrét Platóna, kapitola 02, za odstavcem o úhlopříčkách a pod blokem Odkryj; geometrie a texty `src/lib/ctverec.ts`): mřížka 4 × 4 stopy z Menóna 82b–85b; původní čtverec o straně dvě stopy je vyznačený v levém horním rohu, ostatní tři jsou jeho kopie. Přepínač rámu volí jeden ze tří pokusů: strana čtyři (obsah 16), strana tři (obsah 9) a čtverec na úhlopříčce (obsah 8). Vpravo je vždy štítek strany a „hledáme: 8“. Tlačítko „Spočítat čtverečky“ vybarví čtverečky (celé silněji, půlené slaběji), očísluje celé čtverečky 1, 2, 3 … a půlené označí ½, a vpravo ukáže počet; před spočítáním kresba ani text výsledek neříkají. Spočítání si každý pokus pamatuje zvlášť. Nic neběží samo, přepnutí pokusu je jen přechod průhlednosti.
  - **Kde je střed?** (`<KdeJeStred id="kde-je-stred" />`, krok 6 cesty 4, za odstavcem „Představ si řeku…“ a před Aristotelovým přiznáním; stav, polohy a texty `src/lib/stred.ts`): v řece někdo volá o pomoc, na břehu stojí člověk. Pod scénou vede čára od „nic neudělat“ po „skočit za každou cenu“ se slabou čárkovanou značkou „půlka“ a výrazným bodem „střed: …“. Pod plátnem jsou dva přepínače: Kdo stojí na břehu (plavčík, dobrý plavec, neplavec) a Jaká je voda (klidná, rozvodněná). Bod se po přepnutí plynule posune a v půli neleží nikdy; značka stojí. Scéna ukazuje, co je pro toho člověka střed: skok, skok na laně, hozené lano, volání o pomoc. Kresba nemá čísla, aby nevypadala jako měřák správné odpovědi. Samy se hýbou jen vlny, kláda a ruka toho, kdo volá; jde to zastavit. Text pod kresbou říká, kdo stojí na břehu, jaká je voda, co udělá a na které straně od půlky střed leží, a končí větou „Půlka se nehnula.“ Otázku, kdo střed určí, klade až text kroku.
  - **Zrcadlo času** (`<Zrcadlo id="zrcadlo-casu" />`, krok 4 cesty 8, za Lucretiovým zrcadlem a Senekovou lampou a před námitkou; stav, geometrie a texty `src/lib/zrcadlo.ts`): osa času přes celé plátno (340 × 190), uprostřed světlá úsečka „život“, vlevo tmavý pruh „před narozením“ s letopočty 1348, 1620 a 1914, vpravo stejně dlouhý pruh „po smrti“ bez letopočtů. Pravý konec života nemá letopočet ani věk a student ho nenastavuje: kresba není odhad, kdy kdo zemře. Přepínač rámu má dva pohledy. **Zrcadlo:** tlačítko „Přiložit zrcadlo“ / „Odložit zrcadlo“ překlopí poloprůhledný odraz pravého pruhu kolem svislé čáry uprostřed života na levý pruh; kryjí se. **Námitka:** posuvník „Posuň: zkus životu přidat čas“ s pěti stupni (o hodně dřív, o něco dřív, jak je, o něco déle, o hodně déle). Doprava se prodlouží tentýž život (se švem a popiskem „tentýž život, delší“), doleva se život nehne a v čase před narozením se objeví čárkovaná úsečka „někdo jiný“. Nic neběží samo (`maPohyb={false}`); oba pohyby jsou přechody a při omezeném pohybu se stav změní hned. Text pod kresbou říká u zrcadla „Lucretius říká“ a u námitky „podle námitky“: atlas svým hlasem netvrdí ani jedno. Žádná lebka, svíčka ani hodiny.
  - **Loď po prknech** (`<Lod id="lod-po-prknech" />`, krok 4 cesty 2, za výzvou „zastav tam, kde podle tebe přestala být Théseovou lodí“ a před Hobbesovou druhou lodí; stav, geometrie a texty `src/lib/lod.ts`): vpravo na hladině stojí loď se čtyřiadvaceti prkny ve třech řadách, vlevo je břeh (plátno 340 × 116). Posuvník „Posuň: vyměň prkna“ (0–24) prkna vyměňuje v pevném pořadí, které nejde zleva doprava: staré prkno (tmavší, s léty dřeva) odjede na břeh a na jeho místě se ukáže nové (světlé, hladké). Krajní prkna horní řady nesou zdvižené konce lodi a mění se poslední. Přepínač rámu má dva pohledy. **Výměna prken:** stará prkna leží na hromadě po pěti. **Druhá loď:** táž prkna stojí v čárkovaném obrysu trupu na podpěrách, každé na místě, které mělo. Řádek pod posuvníkem („Vyměněná prkna: 9 z 24 · původní: 15 z 24“) nemá skloňování. Samy se hýbou jen vlny a jdou zastavit; přesun prkna je přechod a při omezeném pohybu se stav změní hned. Text pod kresbou říká, co vypráví Plútarchos (výměna prken; kolik jich vyměnili, neříká) a co přidal Hobbes v 17. století (výměnu až po poslední prkno a druhou loď); světlejší barva nových prken je „v kresbě“, ne u Plútarcha. Krok autorů atlasu kresba nejmenuje (revize celku 7, nález 4); neříká, která loď je Théseova, a slovo „pravá“ v kresbě není. Otázku „Která z nich je Théseova?“ klade až Volba pod kresbou. Kresba nemá stěžeň ani vesla: všechno dřevo, které v ní je, se dá vyměnit.
  - **Třetí čára** (`<TretiCara id="treti-cara" obdobi={2} />`, krok 6 cesty 7, za větou „Sedni si na jeho místo.“ a nad Volbou „Co řekneš, až na tebe přijde řada?“, která vede vlastním Kam dál na výsledky pod sebou; geometrie a texty `src/lib/treti-cara.ts`): Aschův pokus (plátno 340 × 240). Nahoře karta se vzorem a karta se třemi čarami očíslovanými 1–3; délky drží poměr prvního kritického kola z Asche 1956 (Trial 1, před ním dvě neutrální) (vzor 3 palce, možnosti 3¾, 4¼ a 3, palec = 20 jednotek). Dole osm postav v řadě (siluety bez obličejů); student sedí předposlední, je světlý a má pod sebou popisek „ty“. Pohyb: bubliny s odpověďmi se rozsvěcují jedna po druhé po 0,8 s (kolo 8 s, sedm vlastních animací `cara-b0`…`cara-b6`), u studenta se řada zastaví na čárkované bublině s otazníkem a pak začne znovu; poslední postava ještě mlčí. Při omezeném pohybu svítí všechny bubliny naráz. Přepínač rámu: **Bez spojence** (šest jedniček) a **Se spojencem** (čtvrtý v řadě řekne trojku; čtvrté místo má spojenec i u Asche 1951). Text pod kresbou říká, která čára je stejně dlouhá a kdo co řekl, a neprozrazuje výsledek pokusu. Kresba nikdy neukazuje odpověď studenta, smích ani obličeje (obrácený pokus je jen v listu pro učitele). Animace má rozepsané vlastnosti (`animation-duration` atd.): zkratka `animation` bez jména se při sestavení zminifikovala na `none`.
  - **Přesýpací hodiny** (`<PresypaciHodiny id="presypaci-hodiny" />`, krok 3 cesty 34, za Senekovou výzvou „spočítej si léta“ a před otázkou v kurzívě; stav, geometrie a texty `src/lib/presypaci.ts`): přesýpací hodiny (atribut Seneky) vlevo, legenda vrstev vpravo (plátno 340 × 240). Horní baňka drží písek jednoho všedního dne, 24 zrnek, hodina na zrnko. Pod plátnem pokyn „Rozděl hodiny podle toho, kdo o nich rozhodl“ a čtyři posuvníky po hodinách (Spánek, Škola a rodina, Tvoje volba, Někdo, něco; každý 0–12, dohromady nejvýš 24, `nastav`) a řádek „Protekla a nevíš kam: N h“: co student nerozdělí, proteklo. Zrnka padají jedno po druhém hrdlem dolů (0,4 s po sobě, kolo 13,5 s, pak začne znovu; konec kola hlídá neviditelný prvek s animací, takže zastavený pohyb zastaví i nové kolo) a ve spodní baňce se usazují po vrstvách zdola: spánek, škola a rodina, tvoje volba, někdo nebo něco, protekla. Vrstvy se neliší jen tónem: prstenec, poloprůhledné zrnko, plné zrnko, kosočtverec a čárkovaný prstenec, stejně v legendě. Při omezeném pohybu leží všechna zrnka dole a horní baňka je prázdná. **Zastavený pohyb ukáže výsledek kola** (od 23. 10. 2026, celek 9, krok O; rozhodnutí autora po revizi): písek dole po vrstvách a prázdnou horní baňku, i když student pohyb zastaví hned po načtení, a posuvníky pak mění vrstvy v baňce; Pustit pohyb začne nové kolo. Z téhle kresby vzniklo pravidlo pro všechny kresby (Pohyb výš): obsah tu vzniká teprve pohybem, takže zamrzlý okamžik by ho studentovi nikdy neukázal. Ostrov k tomu pod `.kresba--pohyb:not(.kresba--bezi)` vypne jméno animace. Spánek ani škola nejsou v kresbě ztráta, jen vrstva; ciferník, logo aplikace ani jiné ozdoby v ní nejsou. Text pod kresbou říká hodiny zkratkou „h“, ať věta nemusí skloňovat; čtečka u posuvníku slyší „8 hodin“ (`hodinSlovy`).
  - **Strhni masku** (`<Maska id="maska" />`, krok 4 cesty 33, za Senekovým citátem o masce (Dopisy 24, 13) a před otázkou, k čemu je masku strhávat; stav, geometrie a texty `src/lib/maska.ts`): vlevo obyčejná tvář (vlasy, uši, oči, klidná ústa), přes ni velká tragická maska s tkanicemi, prázdnýma očima a otevřenými ústy s koutky dolů (plátno 340 × 240). Pohyb: maska drží na tváři, sjede nahoru a stranou, leží vedle tváře natočená o 9°, zmizí a znovu se nasadí (smyčka 11 s, rozepsané vlastnosti animace); popisky „tvář“ a „maska“ svítí, jen když maska leží vedle. Přepínač rámu: **První maska** (tvář menší, asi polovina výšky masky) a **Druhá maska** (tvář skoro stejně velká): kresba neslibuje, že všechno je menší, než se zdá. **Zastavená kresba a kresba při omezeném pohybu ukážou výsledek**, masku vedle tváře, stejně jako přesýpací hodiny (pod `.kresba--pohyb:not(.kresba--bezi)` jméno animace `none`); Pustit pohyb začne od nasazené masky. Nadtitulek „Podívej se“. Text pod kresbou popisuje výsledek; u druhé masky říká, že strhnout masku věc nezmenšilo, a „podle Seneky“ tě nezaskočí jako nová. V kresbě není nic mimo model: žádné jeviště, světla ani šipky.
  - Hlídají `tests/e2e/jeskyne.spec.ts`, `tests/e2e/saty.spec.ts`, `tests/e2e/kresby-pokusu.spec.ts`, `tests/e2e/ctverec.spec.ts`, `tests/e2e/stred.spec.ts`, `tests/e2e/zrcadlo.spec.ts`, `tests/e2e/lod.spec.ts`, `tests/e2e/treti-cara.spec.ts`, `tests/e2e/cesta33.spec.ts` a v `tests/data/` testy `jeskyne`, `saty`, `vitr`, `dve-pulky`, `pohar`, `ctverec`, `stred`, `zrcadlo`, `lod`, `presypaci` a `maska`; průchod cesty 34 s kresbou `tests/e2e/cesta34.spec.ts`.
- **Začátek na Domů** (`zacatekDomu` v `src/lib/pokracuj.ts`): hlavní tlačítko má tři stavy podle deníku. Nový student: „Začít první cestu“ (krok 1). Rozpracovaná cesta, kterákoli, bere se naposledy otevřená: „Pokračovat v cestě“ na naposledy otevřený krok, údaj „název · krok 4 z 7“. První cesta hotová a nic rozpracovaného: „Vybrat další cestu“ do přehledu otázek, údaj „První cesta je hotová · zbývají 2 cesty“; číslo cesty z katalogu student nevidí nikde (revize antiky, nález 9) (cesty na sebe nenavazují, pořadí si volí student). Stránka se sestaví ve stavu pro nového studenta; skript hned za tlačítkem ho přepíše ještě před vykreslením, takže nic neproblikne. Rozhoduje jedna funkce: sestavení ji volá a do skriptu se vkládá její text, proto nesmí sahat na nic mimo sebe (hlídá jednotkový test).
- **Pokračuj** (`Pokracuj.svelte`): tichý řádek textových odkazů pod hlavním tlačítkem („Naposledy jsi četl: Sókratés“), bez karet a rámečků, odkaz vysoký 44 px. Nenabízí cestu, kterou už nabízí hlavní tlačítko, ani rozpracovaný blok v ní. Vracejícímu se studentovi se pro něj vyhradí řádek předem, aby se obsah pod úvodem po načtení neposunul.
- **Obsah stránky osobnosti** (`src/components/osobnost/ObsahProfilu.astro`, logika `src/lib/obsah.ts`): obaluje celý obsah profilu pod hlavičkou (`<ObsahProfilu adresa="/osobnost/sokrates/">…</ObsahProfilu>`) a seznam skládá ze sestavené stránky, ne ze seznamu v kódu. Oddíl se hlásí sám atributem `data-oddil` s názvem, který na stránce nese (kapitola navíc `data-oddil-cislo`, kotva v `id` nebo v `data-oddil-kotva`); oddíl, který profil nemá, v obsahu není. Nová komponenta oddílu se do obsahu dostane tím, že si atribut přidá.
  - **Řádek odkazů** (`nav` „Obsah stránky“): bez JavaScriptu vždy, s ním na notebooku. Odkazy 44 px vysoké, čísla kapitol v barvě období.
  - **Lišta** (`nav` „Obsah při čtení“): 44 px, papír s linkou přes celou šířku, tlačítko „Obsah · 02 Muž z agory“ se šipkou (`aria-expanded`). Seznam je rozbalovací panel na povrchu (`--surface`, okraj `--rule`, bez stínu): na notebooku 360 px od levého okraje stránky, na telefonu přes šířku stránky; kapitoly od ostatních oddílů dělí linka. Vejde se mezi lištu a spodní okraj viditelné části (na telefonu nad spodní lištu) a posouvá se uvnitř; když lišta ještě stojí nízko na obrazovce, otevře se nad ni. Zavře ho výběr oddílu, Esc (fokus se vrátí na tlačítko), klepnutí vedle nebo odchod fokusu. Skok na Prameny je rozbalí.
  - **Právě čtený oddíl** (`ctenyOddil`): poslední oddíl, jehož začátek přešel čáru v horní třetině viditelné části; nad první kapitolou žádný. Má `aria-current="location"` v obou seznamech, tučný řez a linku (v panelu svislou v barvě období na tintu), ne jen barvu.
  - **Pokračovat ve čtení:** textový odkaz v hlavičce profilu pod letopočty („Pokračovat ve čtení: Ústup od Délia“), vidět bez posouvání i na telefonu. Ukáže se, jen když se student vrátí a naposledy četl jiný než první oddíl, který na stránce pořád je (`kamPokracovat`). Vyplní ho skript před vykreslením, takže neproblikne. Stránka se sama nikdy neposune.
- **Karta cesty** (`src/components/cesta/CestaKarta.astro`): povrchová karta s okrajem v barvě období a silnou levou hranou (6 px), nadtitulek („Cesta · N kroků · asi M minut“), otázka cesty `t-h3`, vstup, mince filozofů a hlavní tlačítko „Vydat se na cestu“ (`--ink` / `--paper`, 48 px). Odkaz je celá karta; po najetí dostane tint období.
- **Vstupy osobnosti** (`src/components/osobnost/VstupyOsoby.astro`, logika `src/lib/vstupy.ts`): dvě navigace v hlavičce profilu. Cesty stojí pod letopočty („Cesta, kde potkáš …“ nebo „Cesty, kde…“, `cast="cesty"`), velké otázky jsou samostatná navigace („Velká otázka, kde potkáš …“ nebo „Velké otázky, kde…“, `cast="otazky"`). Na telefonu jde hlavička v pořadí jméno, cesty, deska, otázky a pak obsah; od 900 px stojí otázky pod cestou vlevo a deska vpravo přes oba řádky, takže pořadí je na obou šířkách stejné. Od 15. 10. 2026 (revize celku 7, nález 6: Aristotelés a Epikúros měli pod jménem sedm tlačítek, asi 480 px). Druhá možnost z revize, rozbalovací řádek „Další otázky (3)“, by vstupy skrývala; zvolena první. Cesta je plná deska v barvě období (dva řádky: „Cesta · K kroků · asi M minut“ a název, aspoň 64 px; pod 600 px jen řádek odkazů „Cesta“ a název, bez délky, desky a šipky, aby deska osoby zůstala na první obrazovce, revize antiky, nález 6), stránky velkých otázek jsou vedlejší tlačítka s obrysem (aspoň 48 px; na telefonu stojí „Velká otázka N“ nad názvem u každé otázky stejně, od 700 px je otázka na jednom řádku). Pořadí: cesty podle čísla, pak otázka, ke které cesta osoby vede, pak ostatní otázky podle čísla. Nic se nepíše ručně: cesty se berou z `filozofove` v přehledu cesty, otázky z `hlasy` stránky otázky. Osoba bez cesty i bez hlasu navigaci nemá. Telefon pod sebou přes celou šířku, od 700 px v řadě.
- **Společný profil** (od 16. 10. 2026, Kratés a Hipparchia): jedna stránka pro dvě osoby, které mají v datech každá svůj záznam. V obsahu profilu nepovinné pole `dalsi: [hipparchia]`; hlavní osoba (`osoba`) dává období, obraz a adresu. Hlavička: titulek z `titulek` („Kratés a Hipparchia“), řádek dat pro každou osobu se jménem a období jednou na konci; deska s jedním obrazem v poměru 6 : 5 (rytina na šířku; na telefonu 16 : 10 jako jinde) a pod ní atribut každé osoby s mincí, pak popisek obrazu. Vstupy osobnosti sjednotí cesty a otázky všech osob (každou jednou; `aria-label` „Cesta, kde je potkáš: Kratés a Hipparchia“, protože 2. pád ženského jména není 4. pád). Doba a lidé je jedna pro obě osoby: nadpis „S kým Kratés a Hipparchia žili“, vztahy obou sloučené, vztah mezi nimi se nevypíše (řekne ho úvodní věta), u učitele a žáka stojí čí („učitel Kratéta“), u ostatních typů jméno před rolí; mini osa zvýrazní pásy obou, mini mapa ukáže místa obou s rolí v 2. pádě („narození Hipparchie“). Adresa stránky osoby se skládá jen přes `adresaOsoby` (`src/lib/adresa-osoby.ts`), která zná i `dalsi`: Lidé a směry, přehled cesty (Kam dál dá jeden odkaz „Kratés a Hipparchia: celý příběh“), stránka otázky a Mapa a čas. Žádný nový ostrov. **Na telefonu (do 899 px) od P8:** cesta a otázka stojí vedle sebe v jednom řádku nad deskou (titulek hlavičky má `display: contents`, otázka se do druhého sloupce doplní přes `grid-auto-flow: row dense`); délka cesty (`.vstup__meta`) a šipky se tu skrývají, deska má poměr 2 : 1, titulek 34 px a mezery `--s-2`/`--s-3`. Bez toho by tlačítko cesty a otázky odsunulo první odstavec pod spodní lištu; začátek odstavce je na 732 px při výšce 844 (`krates-hipparchia.spec.ts`).
- **Citát:** Newsreader, linka nad i pod, pod ním autor, dílo, místo (Platón, Obrana Sókratova 38a). Varianta `velky` pro hlavní citát stránky, `kompaktni` (menší okraje, velikost textu) pro citát na časové ose otázky.
- **Skladatel hodiny** (`/hodina/nova/`, ostrov `src/components/hodina/Skladatel.svelte`, logika `src/lib/skladatel.ts`, úložiště `src/lib/hodiny-uloziste.ts`; od 17. 10. 2026, větev `hodiny-v1`): stránka pro učitele mimo hlavní navigaci a mimo hledání. Vstupy: odkaz „Pro učitele: připravit hodinu“ v patičce každé stránky (vpravo na notebooku, pod licencí na telefonu, cíl 44 px) a oddíl Moje hodiny v deníku. Bez rozhraní pro autory MDX; `<Skladatel client:load obdobi={…} />` stojí jen na této stránce.
  - **Rozvržení:** od 900 px výběr vlevo a hodina vpravo (340–440 px, drží pod hlavičkou a posouvá se uvnitř); pod 900 px pod sebou ve stejném pořadí jako v DOM a nad výběrem přilepený řádek „V hodině: N zastavení · K hodině ↓“ (48 px, pod hlavičkou webu). Prvky výběru mají `scroll-margin-top`, aby fokus z klávesnice nezajel pod ten řádek.
  - **Výběr:** hledání podle názvu (bez diakritiky, všechna slova; počítá se i štítek druhu zastavení a název stránky, kroku a kapitoly, do které zastavení patří, takže „Epiktétos“ najde profil i s kapitolami a „spor smrt“ Spor v cestě o smrti), filtr období (jen období, která katalog má) a druhu (celé stránky, kroky, bloky a kresby, příběhy, kapitoly, oddíly, hlasy). Skupiny Cesty, Profily, Velké otázky; každá stránka je `<details>` s levou linkou v barvě období, nadtitulkem druhu, názvem v Newsreaderu a počtem zastavení („· v hodině 2“). Uvnitř stránka sama (Přehled cesty, Celý profil, Stránka otázky) a pod ní zastavení stromem podle `rodic` (krok a v něm bloky). Řádek: štítek druhu („Krok 3“, „Volba s důvodem“, „Kresba“, „Kapitola 02“), název jako odkaz do nové karty se šipkou ↗ (náhled) a tlačítko Přidat (vedlejší), které se po přidání přepne na Odebrat (tiché) a fokus zůstane na něm. S filtrem jsou skupiny otevřené a předci shod stojí slabším řezem jako souvislost; bez shody „Nic takového v atlasu není…“ a Zrušit filtr.
  - **Hodina:** název, poznámka k hodině (linkované pole deníku, „jen pro tebe“), číslovaná zastavení (kolečko s číslem v tintu období, druh a místo, název jako náhled, poznámka, tlačítka Výš, Níž, Odebrat; vypnuté tlačítko má čárkovaný okraj). Po přeřazení se fokus vrátí na totéž tlačítko, na kraji na druhé; po odebrání na další zastavení. Zastavení, které katalog nezná, ukáže „Tohle místo už v atlasu není“ a své id. Pod poznámkou má blok a kresba řádek **Na plátně:** s nativním `<select>` (jen podoby, které komponenta má, `podobyZastaveni`; popisek pro čtečky „Na plátně, zastavení 2“); změna se ohlásí ve stavu („Co uděláš…: na plátně otevřená otázka.“) a jde do odkazu i do souboru. Akce Uložit (hlavní), Stáhnout soubor, Nahrát soubor; stav „uloženo 17. 10. 2026 16:20“ nebo „neuložené změny“ a hlášení v `role="status"`. Pod nimi Odkaz pro studenty (jen čtení, Kopírovat) s větou, že poznámky v něm nejsou. Uložená hodina se otevře přes `?hodina=<id>`; po uložení se adresa přepíše na ni. Při odchodu s neuloženými změnami se prohlížeč zeptá.
- **Moje hodiny** (`src/components/hodina/MojeHodiny.svelte`, v ostrovu Deník nad tlačítkem exportu): seznam uložených hodin od naposledy změněné, u každé počet zastavení, datum změny, název („Hodina bez názvu“, když chybí) a Upravit, Kopírovat odkaz pro studenty, Smazat. Smazání se potvrdí přímo v řádku („Smazat hodinu i s poznámkami? Vrátit to nepůjde.“ · Smazat hodinu · Nechat), bez dialogu prohlížeče. Bez uložených hodin oddíl nic neukazuje.
  Pod seznamem hodin skladatele (od H3) řádek Promítat hodinu (vedlejší; jen u uložené hodiny, promítá pořadí, jak je ve skladateli) a Vytisknout přehled (tiché). Tisková podoba je jen na papíře: „Přehled hodiny · Atlas myšlení“, název, od kroku O pod ním menším písmem „Odkaz pro studenty: …“ (celá adresa s doménou, diakritika čitelně, mezera jako `%20`), poznámka k hodině a zastavení v pořadí (číslo, štítek · kde stojí, název, od H4 „na plátně: otevřená otázka“ u bloku, který není celý, celá adresa s doménou, „Poznámka: …“), bez hlavičky, patičky, výběru a tlačítek. V tisku jsou tokeny vždy světlé (`@media print` v `tokens.css`).
- **Stránka hodiny pro studenta** (`/hodina/?v=1&n=…&z=…`, ostrov `src/components/hodina/HodinaStudent.svelte`; od 17. 10. 2026, H3): nadtitulek „Hodina · N zastavení“, název (h1; bez názvu „Hodina“), Začít hodinu (hlavní, na první zastavení, které v atlasu je) a Promítat hodinu (vedlejší). Pod tím číslovaná zastavení ve čtenářském sloupci: kolečko s číslem v tintu období, „štítek · kde stojí“ (`stitekStudenta`, `kdeStoji`; u bloku a kresby od kroku O nadtitulek, jak stojí na stránce nad blokem, „Tvůj tah“, „Nejdřív sám“, „Zkus si to“, jinak štítek druhu „Krok 2“, „Kapitola 04“, „Hlas“; katalog ho nese v poli `nadtitulek`, výchozí nadtitulky komponent jsou v `src/lib/nadtitulky.ts` a `NADTITULKY_KRESEB`) a název jako odkaz na místo v atlasu; zastavení, které katalog nezná, je kurzívou „Tohle místo už v atlasu není“ bez odkazu. Oddíl **Doma projdi** (h2, věta „Tohle v hodině nebylo. Projdi si to, až budeš mít chvíli.“) má skupinu pro každou cestu a profil, kterých se hodina dotkla: levá linka v barvě období, nadtitulek Cesta / Profil a název jako odkaz, pod tím kroky a kapitoly mimo hodinu („Krok 3 Politik, básníci, řemeslníci“) a u prošlých „✓ prošel jsi“ (krok) nebo „✓ dočteno“ (kapitola). Adresa bez hodiny nebo s jinou verzí: „Tenhle odkaz žádnou hodinu nenese. Zkus ho otevřít ještě jednou celý.“ a odkaz Domů. Poznámky učitele tu nejsou. Otevřená hodina se zapíše do deníku a stane se aktivní pro kartu.
- **Hodiny v deníku** (oddíl Hodiny v ostrovu Deník, mezi Rozpracovanými a odpověďmi): hodiny otevřené z odkazu, nejnovější první, nejvýš deset; „otevřeno 17. října 2026“ a název jako odkaz zpět na stránku hodiny. Moje hodiny učitele zůstávají zvlášť.
- **Lišta hodiny** (`src/components/rozvrzeni/ListaHodiny.astro` v `Zakladni.astro` hned pod hlavičkou, chování `src/scripts/hodina-lista.ts`, logika `src/lib/pruchod-hodiny.ts`): na stránce, kde stojí zastavení hodiny aktivní v této kartě, přilepená pod hlavičkou, 48 px (`--hodina`), papír `--surface` s linkou dole. Vlevo „Hodina: **Delfy** · 3 z 5“ (zkrátí se třemi tečkami), vpravo Předchozí, Další (obrys `--ink`), Přehled hodiny a Zavřít; na telefonu jen ikony (zpět, dál, tři čárky, křížek) s textem pro čtečky, od 700 px s textem. Tlačítko na kraji hodiny je odkaz bez adresy s `aria-disabled`, tlumené a u Další s čárkovaným okrajem. Místo pro lištu drží třída `s-hodinou` na `<html>` od prvního vykreslení (skript v hlavičce), obsah se ukáže, až ho skript vyplní. Lišta Obsah na profilu drží pod ní; `scroll-padding-top`, `scroll-margin-top` bloků, kreseb a grafu a deska příběhu počítají s `--hodina`. V tisku se neukazuje.
  - **Mimo hodinu** (od 23. 10. 2026, krok O; `zastaveniMimoHodinu`): na stránce, kde žádné zastavení hodiny nestojí, má lištu, když student už na některém zastavení byl. Vlevo „Hodina: **Delfy** · mimo hodinu“, Předchozí s textem „Zpět na 2 z 8“ (ikona zpět, na telefonu jen ikona a text pro čtečky) vede na poslední navštívené zastavení, Další na zastavení za ním, Přehled hodiny a Zavřít jako jinde; atribut `data-mimo`. Poslední navštívené zastavení (`posledni`) je to, na jehož stránce student naposled stál, ať tam přišel z lišty, ze stránky hodiny, z Kam dál nebo z odkazu. Bez lišty zůstávají stránky `/hodina/…`, stránky před prvním zastavením a promítání.
  - **Příchod na zastavení** z lišty nebo ze stránky hodiny je okamžitý skok na kotvu: aktivní hodina dostane jednorázový příznak `skok`, skript v hlavičce dá `<html>` třídu `skok-na-zastaveni` (vypne `scroll-behavior: smooth`) a skript lišty ji po načtení stránky sundá. Skok na zastavení na téže stránce jde přes `scrollIntoView` s `behavior: 'instant'`. Kam dál, obsah profilu a ostatní odkazy na kotvu posouvají plynule jako dosud.
- **Promítání** (třída `promitani` na `<html>`, styly `src/styles/promitani.css`): lišta hodiny nahoře sama (60 px) s „Delfy · 3 ze 4“, Předchozí, Další, Přehled hodiny, Celá obrazovka (`aria-pressed`) a Ukončit promítání. Bez hlavičky, hlavičky kroku, drobečků, patičky, spodní lišty, lišty kroku a lišty Obsah. `--meritko: 1.5` zvětší všechna písma z tokenů, `--ctenarsky-sloupec: 1320px`, `--max-sirka: 1920px`, okraj `clamp(24px, 5vw, 96px)`; široké pásy (krok, blok, odpovědi otázky) drží šířku sloupce. U zastavení s kotvou je vidět jen jeho úsek (blok, příběh, kapitola, oddíl, hlas s roky nad jménem), u kroku a celé stránky celý obsah. Ovládání: šipka vpravo, PageDown, mezerník (o plochu bez 12 %, na konci úseku další zastavení; od kroku O je zbytek úseku pod 32 px konec úseku, takže žádný stisk nepohne stránkou o pár pixelů, `ZBYTEK_USEKU`), šipka vlevo, PageUp, Shift+mezerník (na předchozí zastavení na jeho konec), F celá obrazovka, Esc konec (v celé obrazovce první Esc zavře jen ji, prohlížeč klávesu stránce nepošle). Klávesy nesahají do polí, posuvníků a přepínačů bloků. Bloky a kresby fungují dál; Roztřiď má na plátně Dát sem pod popisem koše přes jeho šířku a v koších vedle sebe ve stejné výšce (krok O). Od H4: na plátně užším než 1600 px mají Přehled hodiny a Celá obrazovka jen ikonu (text pro čtečky) a pořadí „3 ze 4“ se nezkracuje nikdy, zkracuje se jen název hodiny. Esc i Ukončit promítání stránku načtou znovu: bloky pak ukážou deník studenta, stránka se otevře na zastavení a fokus dostane Přehled hodiny. Bloky na plátně pracují s deníkem promítání (oddíl Co se ukládá) a věta „… je uložený v deníku“ (`data-cast="ulozeno"`) se na plátně neukazuje.
- **Podoba na plátně** (od 18. 10. 2026, H4; `Podoba` v `src/lib/hodiny.ts`, styly `src/styles/promitani.css`): blok a kresba se na plátně ukážou v podobě, kterou učitel vybral ve skladateli. Platí jen v promítání; doma a s lištou je stránka celá. Skript lišty dá úseku zastavení `data-podoba` a styly skryjí části bloku podle pevných značek `data-cast` v komponentách: `hlava` (nadtitulek a mince, `BlokHlava`), `scena`, `otazka`, `moznosti` (karty, strany sporu, škála, koše, odhad, přepínač podmínek), `akce` (potvrzení, odkrytí), `duvod` (vlastní psaní studenta: důvod, odpověď v Odkryj, vlastní karta, reflexe), `zpetna` (zpětná vazba, argumenty, odkrytá část), `dal` (Kam dál, `BlokDal`), `ulozeno`, u kresby `platno` a `popis`.
  - **Celý blok** (výchozí, bez `data-podoba`): blok jako dosud, jen bez věty o uložení.
  - **Jen otázka a možnosti** (`~m`): bez `scena`, `duvod`, `dal`; zpětná vazba až po kliknutí učitele. U Odkryj se jmenuje „Jen otázka a odkrytí“.
  - **Otevřená otázka** (`~o`): z bloku zůstanou jen přímí potomci `hlava` a `otazka` (cokoli dalšího, i budoucí části bloku, je skryté), otázka písmem `--fs-h2` (na plátně asi 69 px na 1280 px) uprostřed plochy pod lištou. Lišta má tlačítko **Ukázat možnosti** (ikona čtyř polí, obrys `--ink`, stisknuté plné `--ink`, `aria-pressed`, `aria-keyshortcuts="M"`) a klávesu M mimo pole: úsek se přepne na „jen otázka a možnosti“, dokud učitel nepřejde jinam. Po návratu na zastavení jsou možnosti zase skryté.
  - **Jen kresba** (`~k`): hlava, přepínač pohledů, plátno a ovládání; text pod kresbou (`popis`) zůstane čtečkám, vidět není. Kresba vyplní plochu pod lištou bez okrajů. Na plátně 4 : 3 a širším stojí plátno vlevo přes celou výšku a přepínač s ovládáním vpravo (sloupec `minmax(18rem, 32 %)`); široká kresba (`data-siroka` na `<figure>`, `viewBox` víc než 1,8 : 1, třeba Loď po prknech) má ovládání pod sebou, vedle by se zmenšila.

  | Komponenta | Podoby | Co je v „možnostech“ |
  | --- | --- | --- |
  | Volba | celý blok, jen otázka a možnosti, otevřená otázka | karty A–D, Tohle je můj tah, zpětná vazba a Co kdybys zvolil jinak |
  | Odkryj, Nejdřív sám | celý blok, jen otázka a odkrytí, otevřená otázka | tlačítko odkrytí a skrytá část (modelové odpovědi, sebekontrola, srovnání s filozofem); pole na vlastní odpověď skryté |
  | Spor | celý blok, jen otázka a možnosti, otevřená otázka | postoje obou stran, škála, Tady stojím, argumenty, druhá škála a posun; důvod a reflexe skryté |
  | Změň jednu věc | celý blok, jen otázka a možnosti, otevřená otázka | možnosti, Rozhodnuto, přepínač podmínek a nové rozhodnutí, posun a Co udělal filozof |
  | Kdo žil dřív? | celý blok, jen otázka a možnosti, otevřená otázka | volby pořadí nebo tažení života na ose, Odhalit, odhalení s osou |
  | Roztřiď | celý blok, jen otázka a možnosti | karta na stole, koše, Mám roztříděno, výsledky a srovnání; vlastní karta skrytá. Otevřená otázka chybí: bez karet nemá co ukázat |
  | Závěr cesty | celý blok | jen otázka a pole na vlastní pravidlo, nic dalšího k zúžení |
  | kresby (všech třináct) | celý blok, jen kresba | (nemají možnosti) |

  Ostatní zastavení (krok, příběh, kapitola, oddíl, hlas, celá stránka) podobu nemají. Podoba, kterou zastavení nemá (třeba ze souboru), se ukáže jako celý blok (`ucinnaPodoba`).

## Bloky

Interaktivní bloky, ze kterých se skládají cesty, profily a otázky (`docs/plan.md` › Mechanismy učení). Každý se do MDX vkládá jedním řádkem. Ve skutečném atlasu jsou v cestě 1 „Kdy mám dobrý důvod věřit?“ (`/cesta/kdy-mam-dobry-duvod-verit/`), v cestě 6 „Kolik je dost?“ (`/cesta/kolik-je-dost/`) a v profilech; sedm bloků a Návrat jsou pohromadě a bez kódu pro autora na `/dilna/bloky/` (mimo navigaci a hledání, `noindex`). Závěr cesty patří jen do posledního kroku cesty a Návrat ve skutečném atlasu nabízí jen deník. Tento oddíl používá skill `atlas-cesta`.

### Jak blok vložit do MDX

1. Na začátek MDX jeden import (cestu uprav podle hloubky souboru):
   ```mdx
   import { Pribeh, Volba, Odkryj, Roztrid, ZmenJednuVec, Spor, KdoZilDriv } from '../../components/bloky';
   ```
2. Volba s důvodem, Roztřiď, Změň jednu věc a Spor mají obsah v YAML v `src/content/bloky/<id>.yaml` (schéma `src/lib/bloky-schema.ts`). Do MDX pak stačí `<Volba id="<id>" />`. Příběh, Odkryj a Kdo žil dřív? se píšou přímo v MDX. Poslední krok cesty končí `<ZaverCesty id="…" otazka="…" />` (ze stejného importu); případ pro Návrat je taky v YAML (`druh: navrat`), ale do MDX cesty se nevkládá.
3. `client:visible` ani odkaz zpět z deníku nepiš. Doplní je obal v `src/components/bloky/`; odkaz je stránka a kotva `#<id>`.
4. `id` je malými písmeny bez diakritiky, s pomlčkami a na celém webu jedinečné (`sokrates-utek`, `cesta1-jak-zjistit`). Podle něj se ukládá odpověď. Když ho později změníš, studentům zmizí rozpracovaný stav.
5. V textech YAML funguje `*kurzíva*` a prázdný řádek dělí odstavce. Jména lidí se berou z `lide.yaml` podle id; v textu je piš v podobě z dat.
6. Historická tvrzení v bloku musí stát na pramenech v `zdroje` (id ze `zdroje.yaml`). Co ještě čeká na ověření, zapiš do `kOvereni`. Takový blok smí být jen v dílně, jinde zastaví sestavení.
7. Zpětná vazba vysvětluje důvod a ptá se dál. Nikdy „správně“ nebo „špatně“, nikdy hodnocení názoru; nic se neboduje.

8. **Kam dál:** každý blok po dokončení nabídne jeden další krok. V kroku cesty je to sám od sebe další krok (na konci „Dokončit cestu“); jinde ho nastav vlastností `dal={{ href: '/…', text: '…' }}` nebo v YAML polem `dal: { href, text }`. Kdo žil dřív? má navíc vždy odkaz do Mapy a času.
9. Do studentských stránek nepatří kód ani cesty k souborům; ani v dílně.

Sestavení zkontroluje schéma, druh bloku, osoby a prameny (`src/components/bloky/_kontrola.ts`, test `tests/data/bloky.test.ts`). Prameny bloků z YAML se na profilu samy přidají do rozbalovacích Pramenů.

### Co se ukládá

Vše jen v prohlížeči, v záznamu `atlas-denik` (`src/lib/denik.ts`). Bez localStorage bloky fungují do zavření stránky.

| Blok | Do deníku (Moje odpovědi) | Jen stav bloku (vydrží obnovení, je v exportu) |
| --- | --- | --- |
| Příběh | nic | nic |
| Volba s důvodem | „B · text možnosti. Proč: …“ | vybraná karta, důvod, potvrzeno |
| Odkryj | vlastní pokus | odkryto, zaškrtnutá sebekontrola, rozepsaná odpověď |
| Roztřiď | „Potřebuju: … Těší mě: … Prázdné: …“ (karty v koších) | která karta je v kterém koši, vlastní karty, hotovo |
| Změň jednu věc | „Na začátku: … Podmínka: … (posun)“ | základní rozhodnutí, odpověď v každé podmínce, zapnutá podmínka |
| Spor | „Na začátku: spíš Platón. Po argumentech: uprostřed. Co mě posunulo: … Nejsilnější argument druhé strany (Diogenés): … Moje odpověď: …“ (reflexe jen, když ji student vyplnil) | první a konečná poloha, důvod, reflexe (text vybraného argumentu nebo vlastní, odpověď) |
| Kdo žil dřív? | nic (fakt, ne názor) | odhad, odkryto |
| Závěr cesty | pravidlo (Moje stanovisko, `<id>`) a nepovinně `<id>-zmena`: „Co se změnilo, nebo proč si myslíš totéž?“ | nic; „Na začátku“ se jen čte ze zápisu bloku, který je začátkem cesty |
| Návrat | „Upravím ho. Proč: …“ s otázkou „Návrat · Nový telefon: platí moje pravidlo i tady?“ (druh `navrat`) | odpověď, důvod, zapsáno, odloženo (čas), skryto |

Profil si navíc pamatuje naposledy čtený oddíl: `cteni` (adresa profilu → kotva oddílu), nepovinné pole deníku verze 1, které je v exportu. Zapisuje se při změně oddílu, ne při každém posunu, a drží nejvýš třicet stránek.

Od H3 větve `hodiny-v1` má deník (pořád verze 1) další dvě nepovinná pole v exportu: `prectene` (adresa profilu → kotvy kapitol dočtených do konce; dočtená je kapitola, jejíž konec byl vidět a ve které student strávil aspoň čas přelétnutí při 500 slovech za minutu, nejméně 10 s, `kapitolaDoctena`) a `hodiny` (otevřené hodiny: adresa, název, kdy; nejvýš deset). Aktivní hodina karty (lišta, promítání) je v `sessionStorage` pod `atlas-hodina-aktivni`, mimo deník.

**Deník promítání** (H4): dokud v kartě existuje `sessionStorage` `atlas-denik-promitani`, `nacti` a `uloz` v `src/lib/denik.ts` pracují s ním místo s `atlas-denik`. Promítat hodinu ho vždy založí prázdný (`zalozDenikPromitani` ve `vstupDoHodiny`), každé uložení aktivní hodiny bez promítání ho smaže (`ulozAktivni`). Bloky, Pokračuj, postup cest a dočtené kapitoly o promítání nic nevědí: na plátně začínají od nuly, během jednoho promítání si stav drží napříč stránkami a do deníku studenta nezapíšou nic. Skripty před vykreslením (Domů, Pokračovat ve čtení na profilu, Tvůj první názor na stránce otázky) čtou deník přes `TEXT_DENIKU_SKRIPT`, takže se na plátně chovají jako u prázdného deníku. Po konci promítání se stránka zastavení načte znovu jako **tichá** (`atlas-denik-ticho`, `ztisStranku`): do odchodu z ní se nezapíše otevřený krok, návštěva, místo čtení ani dočtená kapitola, práce v blocích ano. Otevření stránky hodiny (i učitelem, který z ní pak promítá) ji zapíše do oddílu Hodiny jako dosud.

Uložená hodina nese u zastavení nepovinné `podoba` (`moznosti`, `otevrena`, `kresba`; chybí = celý blok, starší hodiny ji nemají) a odkaz pro studenty ji nese značkou za id (`b:cesta1-jak-zjistit~o`, `~m`, `~k`). Verze odkazu zůstává 1; bez značky nebo s neznámou značkou je zastavení celé. Id v katalogu, v Doma projdi a v liště zůstává bez značky.

„Začít znovu“ smaže stav bloku i jeho zápis v deníku. Bloky navíc zapisují poslední aktivitu (`aktivita`: otázka, odkaz, hotovo) a cesty svůj postup (`cesty`: naposledy otevřený krok a prošlé kroky). Z toho staví hlavní tlačítko a „Pokračuj, kde jsi skončil“ na Domů (`src/lib/pokracuj.ts`) a oddíl Rozpracované v deníku.

Cesta má navíc nepovinný čas dokončení `cesty[slug].dokonceno`. Zapíše se jednou, ve chvíli, kdy má student poprvé otevřené všechny kroky, a pozdější otevření kroku ho neposouvá (to mění jen `kdy`). Starší deník, který ho nemá a cestu má prošlou celou, se řídí časem naposledy otevřeného kroku a při příští návštěvě kroku si ho zapíše natrvalo (`dokonceniCesty` v `src/lib/denik.ts`, `casDokonceni` v `src/lib/navrat.ts`). Od času dokončení se počítá Návrat. Deník zůstává verze 1.

### Příběh

Scéna se stejnou typografií jako profil a deska v barvě období: obraz scény, když ho předáš v `obrazek`, jinak ornament a mince s atributem osoby. Portrét osoby (`obrazek` v `lide.yaml`) se v Příběhu nepoužije, protože popisek patří k místu scény. Bez JavaScriptu (komponenta Astro, ne ostrov).

Rozvržení se řídí šířkou místa, ne obrazovky: od 800 px stojí deska vedle textu (krok cesty), v užším sloupci nad textem (profil, telefon). Obraz na výšku dostane `pomer="4 / 5"` a nad textem zůstává nejvýš 400 px široký. Obrázek z Příběhu se na stránce osobnosti sám přidá do Pramenů.

```mdx
<Pribeh id="delfy" osoba="sokrates" nadtitulek="Delfy" titulek="Nikdo není *moudřejší.*" popisek="Delfy. Tady se Chairefón zeptal věštírny na Sókrata.">

Text scény v odstavcích…

</Pribeh>
```

| Vlastnost | Povinná | Význam |
| --- | --- | --- |
| `popisek` | ano | popisek pod deskou |
| `osoba` | ne* | id v `lide.yaml`: barva období a mince |
| `obdobi` | ne* | 1–8, když scéna nepatří k jedné osobě (*jedno z `osoba`/`obdobi` je nutné) |
| `obrazek` | ne | id obrázku v `zdroje.yaml` (licence povinná) |
| `nadtitulek`, `titulek` | ne | titulek s pointou v `*kurzívě*` |
| `pomer` | ne | poměr stran desky, výchozí `4 / 3`; kresba nebo rytina na výšku `4 / 5` |
| `id` | ne | kotva scény |

### Volba s důvodem

Karty A–D (radiogroup, šipky), nepovinné „Proč právě tohle?“, tlačítko „Tohle je můj tah“. Pak zpětná vazba „Tvůj tah: …“ v tintu období, oddíl „Co udělal …“ a rozbalovací „Co kdybys zvolil jinak?“ se zpětnou vazbou ostatních tahů.

```mdx
<Volba id="cesta1-jak-zjistit" />
```

```yaml
# src/content/bloky/cesta1-jak-zjistit.yaml
druh: volba
obdobi: 1
nadtitulek: Tvůj tah            # nepovinné (výchozí „Co uděláš?“)
scena: Chairefón se vrátil z Delf…   # nepovinné
otazka: Co uděláš, abys zjistil, jestli má věštírna pravdu?
moznosti:                       # 2–4
  - text: Zeptám se věštírny znovu, jinými slovy.
    tah: zeptat se znovu        # → „Tvůj tah: zeptat se znovu.“
    zpetna: Dostaneš jen další odpověď ze stejného zdroje…
  - text: Najdu lidi, kteří mají pověst moudrých, a vyzkouším je.
    tah: hledat protipříklad
    jeho: true                  # tuhle cestu zvolil filozof (právě jedna, když je coUdelal)
    zpetna: …
coUdelal:                       # nepovinné
  osoba: sokrates               # nadpis „Co udělal Sókratés“ z dat
  stejne: Šel stejnou cestou jako ty…
  jinak: Šel jinou cestou: …
zdroje: [platon-obrana]
```

Blok s `bezDuvodu: true` nemá pole „Proč právě tohle?“ a do deníku uloží jen zvolenou možnost. Je pro otázky, u kterých by důvod byl zpověď (cesta 4, krok 2: „Co ti tehdy chybělo?“); text kroku pak říká „Nikam ji nepiš“.

### Odkryj

Vlastní pokus, pak srovnání, volitelně modelové odpovědi a sebekontrola (zaškrtávací věty, nic se nesčítá). Po odkrytí jde odpověď připsat nebo upravit. S `filozof="sokrates"` má hlavička minci filozofa a barvu jeho období. `NejdrivSam.svelte` zůstává jako starší jméno téhož bloku kvůli hotovým stránkám.

```mdx
<Odkryj
  id="sokrates-kdo-je-moudry"
  otazka="Koho považuješ za moudrého člověka? Podle čeho to poznáš?"
  tlacitko="Porovnat se Sókratem"
  modelove={[{ text: 'Moudrý je ten, kdo pozná, kde jeho vědění končí.', komentar: 'Znak, podle kterého…' }]}
  sebekontrola={['Napsal jsem znak, podle kterého moudrost poznám, ne jen jméno.']}
>

Srovnání s filozofem v odstavcích…

</Odkryj>
```

| Vlastnost | Povinná | Význam |
| --- | --- | --- |
| `id`, `otazka` | ano | otázka se ukládá do deníku |
| `tlacitko` | ne | výchozí „Odkrýt“; lépe „Porovnat se Sókratem“ |
| `nadtitulek` | ne | výchozí „Než budeš číst dál“ |
| `modelove` | ne | `[{ text, komentar? }]`, nadpis „Jak se dá odpovědět“ |
| `sebekontrola` | ne | věty, které si student zaškrtne |
| `obdobi` | ne | barva, když ji blok nemá převzít ze stránky |
| `filozof` | ne | id osoby: mince v hlavičce a barva období |
| `dal` | ne | Kam dál po odkrytí (v cestě další krok sám) |

### Roztřiď

Třídění karet do dvou až čtyř košů. Navrchu leží jedna karta („Zbývá 4 z 6“); student ji **přetáhne** do koše (myší i prstem), nebo u koše zvolí **Dát sem** (klepnutí, Enter, mezerník; cílem je celý koš). Karta položená v koši je tlačítko, které ji vrátí navrch, takže jde přendat. S `vlastni` smí student připsat vlastní karty. Když je hromádka prázdná, „Mám roztříděno“ odkryje výsledek: koše vedle sebe (na telefonu pod sebou), u každé karty její zpětná vazba a pod nimi srovnání s mincí filozofa. Žádný koš není „správně“: zpětná vazba vysvětluje důvod a ptá se dál, `kdyz` dovolí jinou otázku pro kartu v určitém koši.

Tažení patří jen kartě navrchu (`touch-action: none`), stránka se prstem posouvá všude kolem ní; koš pod kartou se zvýrazní okrajem a tintem období. Klávesnicí: Tab jde po koších a položených kartách, po Enteru zůstává fokus u koše, po poslední kartě přejde na „Mám roztříděno“. Co se stalo, slyší čtečka z oblasti `aria-live` („… je v koši Potřebuju. Další karta: …“).

Koše se řídí šířkou bloku, ne obrazovky (`container-type` na bloku): v kroku cesty je blok široký až 960 px, v čtenářském sloupci profilu 680 px. Dva a tři koše stojí vedle sebe, když má blok uvnitř aspoň 660 px (v profilu jsou tedy pod sebou jako na telefonu); čtyři koše jsou od 620 px po dvou a od 860 px ve čtyřech sloupcích. Výsledek drží stejné rozložení, čtyři koše jsou v užším bloku pod sebou. Nový blok do profilu zkoušej v čtenářském sloupci, ne jen v dílně.

```mdx
<Roztrid id="cesta6-tri-kose" />
```

```yaml
# src/content/bloky/cesta6-tri-kose.yaml
druh: roztrid
obdobi: 2
nadtitulek: Tvůj tah            # nepovinné (výchozí „Roztřiď“)
scena: Tady je šest věcí z jednoho obyčejného týdne.   # nepovinné
otazka: Do kterého koše která patří?
kose:                           # 2–4
  - { id: nutne, nazev: Potřebuju, popis: Bez toho to bolí. }
  - { id: prijemne, nazev: Těší mě, popis: "Je to příjemné, ale obejdu se bez toho." }
karty:                          # 3–8, text nejvýš 60 znaků
  - id: lajky
    text: Sto lajků pod fotkou
    zpetna: Lajky nenasytí ani nezahřejí…        # ke kartě, ať je kdekoli (nepovinné)
    kdyz: { nutne: "Dal jsi je mezi věci, bez kterých to bolí…" }   # jen pro některý koš; má přednost
vlastni:                        # nepovinné: karty, které přidá student
  pocet: 2                      # 1–3
  vyzva: Přidej věc, kterou jsi tento týden chtěl ty
  zpetna: Tuhle kartu jsi přidal sám…
srovnani:                       # nepovinné; s osobou jen doložená fakta
  osoba: epikuros
  nadpis: Jak třídil Epikúros
  text: Epikúros měl na třídění jednu zkoušku…
zdroje: [dl-x-122, dl-x-139]
```

### Změň jednu věc

Scéna a rozhodnutí; pak přepínač podmínky (čipy, 1–3), v každé podmínce nové rozhodnutí a „Předtím → Teď“ se zpětnou vazbou pro posun, nebo pro stejnou odpověď. Po první změně oddíl „Co udělal …“; když text říká, co by lidé nejspíš řekli k vymyšlenému případu, dostane oddíl vlastní nadpis (`coUdelal.nadpis`, v cestě 5 „Co by na to řekli“).

```mdx
<ZmenJednuVec id="utek-z-vezeni" />
```

```yaml
druh: zmena
obdobi: 1
nadtitulek: Myšlenkový pokus
scena: Představ si, že tě soud odsoudil k smrti…
otazka: Utečeš?
moznosti:                       # 2–4, stejné pro všechny podmínky
  - { id: uteku, text: Uteču. }
  - { id: zustanu, text: Zůstanu. }
podminky:                       # 1–3
  - id: spravedlivy
    prepinac: Rozsudek je spravedlivý      # text čipu
    zmena: Teď si představ, že soud byl poctivý…
    posun: Rozhoduje tedy pro tebe, jestli…    # titulek „Tvoje odpověď se posunula.“ doplní blok
    stejne: Na tom, jestli je rozsudek spravedlivý, tvé rozhodnutí nestojí…
coUdelal: { osoba: sokrates, text: Sókratés utéct mohl, ale neutekl… }   # nepovinné
zdroje: [platon-kriton, platon-faidon]
```

### Spor

Otázka a postoje obou stran; škála s pěti polohami („Platón“, „spíš Platón“, „uprostřed“, „spíš Diogenés“, „Diogenés“) s mincemi na koncích. Poloha se volí tažením nebo klepnutím (prst svisle dál posouvá stránku) i šipkami (přepínače, body 44 px). Po „Tady stojím“ se otevřou argumenty obou stran s mincemi, student se může přesunout a šipka na škále ukazuje odkud kam; může připsat, co ho posunulo nebo udrželo. Zpětnou vazbu k posunu píše blok sám (`zpetnaSporu` v `src/lib/bloky.ts`), nikdy neříká, kdo má pravdu.

**Reflexe** (nepovinná): pod zpětnou vazbou stojí zavřený řádek „Který argument druhé strany byl nejsilnější?“ · Nepovinné (`<details>`, stejný vzor jako „Co kdybys zvolil jinak?“ ve Volbě); „Další krok“ je vidět i bez ní. Druhá strana je ta, na které student nakonec nestojí. Kdo skončil uprostřed, čte „Který argument byl nejsilnější?“ a vybírá z obou stran.

Po otevření: přepínače s argumenty, které už četl (začátek argumentu, celé věty asi do 110 znaků, `uryvekArgumentu`), „Jiný argument“ s polem „Který?“ a pole „Co na něj odpovíš?“. Ukládá se sama do stavu bloku a jako další věta téhož zápisu v deníku; Escape ji zavře, „Začít znovu“ ji smaže.

Zpětná vazba k reflexi jen dovede („I strana, kterou hájí Epikúros, má argument, který stojí za odpověď.“) a sama se neptá, aby otázka zazněla jednou. Jméno strany stojí ve složených větách vždy v 1. pádě za „kterou hájí“ nebo v závorce, takže věty sedí i na označení směru.

Argumenty nemají v YAML id. Reflexe proto ukládá text vybraného argumentu, ne jeho pořadí, a po obnovení ho hledá podle textu (`mistoArgumentu`). Když autor argument později přepíše nebo ubere, uvidí student svůj původní výběr jako zvláštní možnost a žádný jiný argument se nevybere. YAML Sporů se kvůli reflexi nemění.

```mdx
<Spor id="platon-diogenes-skutecnost" />
```

```yaml
druh: spor
obdobi: 1
otazka: Co je skutečnější, to, co vidíš, nebo to, co pochopíš?
strany:                         # právě dvě různé osoby; jména z dat
  - osoba: platon
    # oznaceni: kynici          # nepovinné: strana se jmenuje po směru, za který osoba mluví (mince zůstává její)
    postoj: To, co pochopím.
    argumenty: [Za proměnlivým světem, který vidíme, stojí neměnné ideje., …]   # 1–3, nejsilnější verze
  - osoba: diogenes
    postoj: To, co vidím.
    argumenty: […]
zdroje: [platon-ustava]
kOvereni: [ … ]                 # dokud není prázdné, jen v dílně
```

Když za jednu stranu nemluví člověk, ale směr (kynici proti Epikúrovi), dostane strana `oznaceni` malým písmenem. Když za ni mluví autor, kterého atlas v datech nemá, smí strana `osoba` vynechat a mít jen `oznaceni` se jménem („Plútarchos“): na škále i v argumentech pak stojí označení a mince je prázdný prstenec v barvě období bloku. Aspoň jedna strana musí být osoba z dat. Obsah tuhle možnost teď nepoužívá: cesta 8 ji měla pro Plútarcha jen do 9. 10. 2026, od té doby je Plútarchos v datech a jeho mince nese trojnožku. Na škále, v polohách („spíš kynici“), ve zpětné vazbě i v deníku pak stojí označení místo jména; v nadpisech se první písmeno zvětší samo. Scéna má říct, čí slova strana používá a že se ti dva nepotkali.

### Kdo žil dřív?

Odhad pořadí (karty A / B / Žili ve stejné době), nebo vzdálenosti: na ose s kulatými letopočty leží pevně život A a student přetáhne život B (jeho skutečnou délku) tam, kde podle něj žil, myší, prstem nebo šipkami (PageUp/PageDown po 25 letech). Pod osou se průběžně píše „žili by současně 30 let“ / „dělilo by je 120 let“. Osa je souměrná kolem A, takže její rozsah neprozradí stranu. Po „Odhalit“ se ukáže věta „Žili současně … / Dělí je …“ a věta o věku (`src/lib/cas-mapy.ts`), skutečná poloha vedle čárkovaného odhadu (u pořadí malá osa) a odkaz „Ukázat na mapě v roce …“. Mapa se otevře u současníků v posledním společném roce, jinak v roce úmrtí staršího, s vybraným člověkem a srovnáním. Odhad se jen popíše vedle skutečnosti.

```mdx
<KdoZilDriv a="sokrates" b="diogenes" druh="poradi" />
<KdoZilDriv a="platon" b="diogenes" druh="vzdalenost" />
```

| Vlastnost | Povinná | Význam |
| --- | --- | --- |
| `a`, `b` | ano | id dvou lidí s roky v `lide.yaml` |
| `druh` | ne | `poradi` (výchozí) nebo `vzdalenost` |
| `otazka` | ne | vlastní znění otázky |
| `dal` | ne | další krok vedle odkazu do mapy (v cestě sám) |
| `id` | ne | výchozí `kdo-<a>-<b>-<druh>` |

### Závěr cesty

Poslední krok cesty: závěrečné pravidlo a vedle něj to, co student opravdu uložil na začátku. Jeden řádek v MDX, mimo čtenářský sloupec:

```mdx
<ZaverCesty id="cesta1-moje-pravidlo" otazka="Kdy mám dobrý důvod něčemu věřit? Napiš svoje pravidlo." />
```

Panel má dva sloupce, na telefonu pod sebou a od 700 px vedle sebe (vzor ze Změnil se?). **Na začátku** (tónovaný rámeček, jen ke čtení): „Krok 2 · název kroku“ a zápis z deníku. U Volby je to zvolená možnost bez písmene a zvlášť „Proč“, u Roztřiď názvy košů s kartami po řádcích, u ostatních bloků text, jak je uložený (`castiZacatku` v `src/lib/zaver.ts`). **Teď** je přímo pole s pravidlem (Moje stanovisko s `rozbalene`, ukládá se samo), ne kopie textu.

Pod srovnáním je nepovinné „Co se změnilo, nebo proč si myslíš totéž?“ Ukáže se, až je pravidlo napsané, a ukládá se jako vlastní zápis `<id>-zmena`. Nic se nehodnotí a změna názoru se nečeká.

Když počáteční odpověď v deníku není (student krok přeskočil nebo ji smazal), panel se neukáže vůbec a pole s pravidlem stojí ve čtenářském sloupci jako dřív. Text kroku proto musí sedět s panelem i bez něj: „Vrať se ke svému tahu z kroku 2“, ne „Níž vidíš svůj tah“.

Který blok je začátkem cesty, říká pole `zacatek` v přehledu cesty (viz Cesta). Počáteční odpověď se jen čte, nic se neukládá podruhé.

### Návrat

Krátký nový případ, na kterém student po několika dnech zkouší své závěrečné pravidlo. Není to opakování cvičení. Nabízí ho **jen deník** (`/denik/`), nejdřív tři dny po dokončení cesty a jen tomu, kdo má uložené pravidlo. Na Domů, v navigaci ani jinde na něj nic neupozorňuje: žádné odznaky, počítadla ani série dní.

Nabídka stojí v deníku nahoře pod nadpisem Návrat: název cesty, věta „Tuhle cestu máš za sebou. Zkusíš své pravidlo na jednom novém případu?“ a tlačítka Zkusit (vedlejší), Později a Už nenabízet (tichá). Později ji vrátí po třech dnech, Už nenabízet ji skryje natrvalo. Nabízí se nejvýš jeden návrat, u cesty dokončené nejdéle, a určí se jednou při otevření deníku: po odpovědi, odložení nebo skrytí přijde další až při příští návštěvě. Rozhoduje `nabidkaNavratu` v `src/lib/navrat.ts` s časem jako parametrem.

Zkusit otevře blok přímo v deníku: název cesty, „Tvoje pravidlo“ (jen ke čtení), případ, otázka „Platí tvoje pravidlo i tady?“, karty Ano / Upravím ho / Nevím (přepínače, šipky), nepovinné „Proč?“ a „Zapsat do deníku“. Po odpovědi blok nic nehodnotí: ukáže odpověď, důvod a jednu větu z YAML, která se ptá dál. Odpověď je nový zápis v deníku; pravidlo se nepřepisuje. „Začít znovu“ odpověď smaže.

```yaml
# src/content/bloky/cesta6-navrat.yaml
druh: navrat
obdobi: 2
cesta: kolik-je-dost            # slug cesty; nejvýš jeden návrat na cestu, cesta bez návratu je v pořádku
pravidlo: cesta6-moje-pravidlo  # id z <ZaverCesty id="…" /> v posledním kroku
nazev: Nový telefon             # krátký název případu, stojí v zápisu v deníku
scena: Představ si, že tvůj telefon funguje…   # „Představ si…“, bez historických osob
po:                             # po každé odpovědi jedna věta, která se ptá dál
  ano: "A kdyby ho z party neměl nikdo: chtěl bys ho stejně?"
  upravim: Co do něj připíšeš o věcech, které chceš hlavně proto, že je mají druzí?
  nevim: "Co vlastně chceš: ten telefon, nebo nebýt u stolu jediný?"
```

Sestavení se zastaví, když cesta neexistuje, má dva návraty nebo pravidlo nestojí v jejím posledním kroku (`chybyNavratu`). Návrat s neprázdným `kOvereni` se do deníku nedostane. V dílně je blok jako `<Navrat id="cesta1-navrat" ukazka="…" />`; `ukazka` je pravidlo na ukázku, dokud autor vlastní nemá.

### Společné pro všechny bloky

- Karta `.blok` (povrch, okraj `--rule`, zaoblení `md`), hlavička s nadtitulkem v barvě období a mincemi lidí, o kterých blok je; otázka `t-h3`; styly v `global.css` › Interaktivní bloky. „Co udělal …“ má minci filozofa.
- Pole na psaní vypadají jako linkovaný deník (spodní linka `--muted`, kontrast 3 : 1). Po tahu ve Volbě zůstane vidět jen vybraná karta, ostatní tahy jsou v „Co kdybys zvolil jinak?“.
- Zpětná vazba se odkrývá krátkým vyjetím (260 ms), při omezeném pohybu bez animace (`src/lib/pohyb.ts`).
- V profilu patří bloky do čtenářského sloupce, i Spor se dvěma sloupci argumentů: uvnitř kapitoly stojí bez obalu, mimo kapitolu v `.blok-sloupec`, který má na stránce osobnosti stejnou šířku (680 px; jinde 960 px).
- Karty možností jsou nativní přepínače v popiscích (šipky, mezerník, dotyk), cíle aspoň 44 px (karty 56–60).
- Po odkrytí jde fokus na zpětnou vazbu (`aria-live="polite"`), po „Začít znovu“ na první volbu.
- Blok funguje bez JavaScriptu jen jako text; interaktivní část se hydratuje, až je vidět.

## Cesta

Cesta je vedený průchod po krocích, v antice 14 až 35 minut (průměrně 27) (`docs/architektura.md` › Katalog cest). Ukázková je cesta 1 „Kdy mám dobrý důvod věřit?“ (sedm kroků, Sókratés a Prótagorás); druhá hotová je cesta 6 „Kolik je dost?“ (sedm kroků, Epikúros a kynici), třetí cesta 5 „Co mám ve svých rukou?“ (osm kroků, Epiktétos a Marcus Aurelius). Čtvrtá je cesta 3 „Je to, co vidím, celá skutečnost?“ (osm kroků, Platón, ve Sporu Aristotelés); její krok 6 má dva bloky a krok 1 kresbu jeskyně. Pátá je cesta 4 „Stačí vědět, co je správné?“ (osm kroků, Aristotelés a Sókratés): krok 6 nemá blok s odpovědí, jen kresbu „Kde je střed?“, krok 7 má dva bloky a mezi nimi graf, poslední krok kartu Zkus to žít. Šestá je cesta 8 „Proč se bát smrti?“ (devět kroků, Epikúros, Lucretius a Seneca; ve Sporu Plútarchos, od 9. 10. 2026 osoba z dat s mincí): začátek cesty je už v kroku 1 (Příběh a pod ním Volba), krok 4 má jen kresbu „Zrcadlo času“, krok 7 nemá blok vůbec a končí tichým řádkem pomoci (`<RadekPomoci />`, týž řádek stojí pod úvodem na přehledu cesty), krok 8 má dva bloky. Sedmá je cesta 2 „Jsem pořád tentýž, když se měním?“ (osm kroků, Hérakleitos a Parmenidés; ve Sporu Seneca a Plútarchos, kteří filozofy cesty nejsou): začátek cesty je v kroku 1 (Příběh s obrazem číše a pod ním Volba), krok 4 má kresbu „Loď po prknech“ a pod ní Volbu, krok 7 nový případ s Volbou, která nabídne další krok sama, a krok 8 „Kdo je na tvé straně“ zastánce odpovědí z kroků 1 a 4, kartu Zkus to žít a Závěr cesty. Do 15. 10. 2026 byly kroky 7 a 8 jeden krok se dvěma bloky; revize ho rozdělila, protože dělal dvě práce a na telefonu měl sedm obrazovek pod nadpisem, který druhou půlku nepopisoval. Osmá je cesta 7 „Čí život vlastně žiju?“ (osm kroků, Diogenés, Kratés a Hipparchia; ve Sporu Aristotelés, který filozofem cesty není): začátek cesty je v kroku 1 (Příběh s rytinou Cats 1637 a pod ním Volba), krok 2 má Roztřiď bez vlastní karty, krok 6 kresbu „Třetí čára“ a pod ní Volbu s vlastním Kam dál na výsledky pokusu (`#co-vyslo`), krok 7 zastánce odpovědí ze všech Voleb a ze Změň jednu věc bez bloku a krok 8 kartu Zkus to žít a Závěr cesty. Mince Kratéta i Hipparchie v hlavičce cesty vedou na společný profil (`adresaOsoby`). Devátá je cesta 34 „Kam mi mizí čas?“ (osm kroků, Seneca a Marcus Aurelius): začátek cesty je v kroku 1 (Příběh bez obrazu a pod ním Volba), krok 3 má jen kresbu „Přesýpací hodiny“, krok 4 Odkryj s vlastním Kam dál na Senekovu otázku pod sebou (`#na-co-se-ptal`), krok 6 Spor s vlastním Kam dál na Tacitovo vyprávění (`#seneca-sam`), krok 8 zastánce odpovědí, kartu Zkus to žít „Proč teď?“ (`delka="jeden den"`) a Závěr cesty. Desátá je cesta 33 „Co když přijde to nejhorší?“ (osm kroků, Seneca a Epiktétos; ve Sporu Epikúros, který filozofem cesty není; James Stockdale jen v textu, bez záznamu v datech): začátek cesty je v kroku 1 (Příběh s portrétem U.S. Navy a pod ním Volba s vlastním Kam dál na Stockdalovu větu, `#co-si-zaseptal`), krok 2 Odkryj s vlastním Kam dál (`#co-nasel`), krok 3 Volba s vlastním Kam dál na Epiktétovu větu (`#mit-nacviceno`), krok 4 jen kresbu „Strhni masku“, krok 5 Roztřiď cizích vět bez vlastní karty, krok 6 Spor, krok 7 nový případ ve Změň jednu věc a krok 8 zastánce odpovědí ze všech Voleb, ze Sporu i ze Změň jednu věc, kartu Zkus to žít „Pět minut, jedna věc“ (`delka="pět minut"`) a Závěr cesty. Čas na štítku počítá `node scripts/slova-cesta.mjs <slug>`; blok v posledním kroku před závěrečným pravidlem se počítá jako každý jiný.

- **Soubory:** přehled `src/content/cesty/<slug>.mdx` (frontmatter `cislo`, `nazev`, `obdobi`, `otazka`, `vstup`, `filozofove`, `minut`, volitelně `mapa: { rok, osoba, text }` pro odkaz do Mapy a času v Kam dál, `zacatek: <id bloku>` pro závěr cesty a `nenabizet: [<slug>]` pro cesty, které Kam dál nemá nabízet jako další; text = úvod), kroky `src/content/cesty/<slug>/<n>-<název>.mdx` (frontmatter `cesta`, `krok`, `nazev`, volitelně `kdeJsme`; text = obsah kroku s bloky). Kroky se číslují 1…n bez mezer, jinak se sestavení zastaví.
- **Přehled cesty** `/cesta/<slug>/`: nadtitulek („Cesta · asi M minut · N kroků“; číslo z katalogu student nevidí), otázka, vstup, mince filozofů, úvod, tlačítko Začít / Pokračovat: krok n / Projít znovu, pod ním nadpis Kroky a seznam kroků s tím, co student prošel, a oddíl Kam dál (`#hotovo`). Kam dál začíná odkazem „Další cesta“: první cesta, kterou student podle deníku nemá hotovou, nejdřív z téže otázky, pak podle katalogu (`poradiDalsichCest` v `src/lib/cesty.ts`); když má hotové všechny, odkaz zmizí. Tlačítko stojí nad seznamem, aby bylo na telefonu vidět bez posouvání a klávesnicí na dosah. Celý přehled je jeden čtenářský sloupec (680 px) uprostřed stránky.
- **Krok** `/cesta/<slug>/<n>/`: soustředěná hlavička (vlevo zpět na přehled, uprostřed „Krok n z N“ s tečkami kroků, vpravo Uložit a odejít; postup se ukládá sám), nadtitulek, název kroku, „Kde jsme“ a obsah. Dole pevná lišta Předchozí / Další krok (na telefonu bez názvu kroku), na konci Dokončit cestu.
- **Středová osa kroku:** nadpis kroku a text leží v čtenářském sloupci (680 px), bloky v pásu 960 px; obojí má společný střed uprostřed stránky, takže vlevo i vpravo zbývá stejně místa. Od 1100 px stojí tlačítka lišty pod okraji bloku, ne u okrajů okna. Na telefonu jde obsah od okraje k okraji jako dřív.
- **Vstupy:** hlavní tlačítko a panel první cesty na Domů (cesta 1), karta cesty v profilu a na stránce otázky; deska cesty v hlavičce profilu každého filozofa cesty (vstupy osobnosti, samy z dat); odkaz „Cesta“ a název u otázky v přehledu `/otazky/` (i u otázky, která ještě nemá stránku); řádek „Cesta: Název“ na kartě člověka v Lidech; odkaz v Kam dál profilu, Pokračuj na Domů a Rozpracované v deníku. Test hlídá, že každá cesta je dosažitelná z profilu aspoň jednoho svého filozofa.
- Bloky v kroku nabídnou po dokončení další krok samy. Krok se dvěma bloky (odhad a čtení pokusu v cestě 3): první blok dostane vlastní Kam dál na kotvu pod sebou, `<Volba id="…" dal={{ href: '#co-vyslo', text: 'Co z pokusu vyšlo' }} />`, a cílový nadpis `tabindex="-1"`; další krok nabízí až poslední blok.
- **Začátek a závěr:** pole `zacatek` v přehledu cesty je id bloku, ve kterém student poprvé sám odpověděl (cesta 1: Volba `cesta1-jak-zjistit`, cesty 5 a 6: Roztřiď `cesta5-tri-kose` a `cesta6-tri-kose`, vždy krok 2). Smí to být Volba, Odkryj, Roztřiď, Změň jednu věc nebo Spor v některém kroku před posledním; jinak se sestavení zastaví (`zacatekCesty` v `src/lib/cesty.ts`). Poslední krok končí blokem `<ZaverCesty id="…" otazka="…" />` (Bloky › Závěr cesty), který ukáže „Na začátku“ vedle „Teď“. Nová cesta tedy přidá jeden řádek do přehledu.
- **Návrat:** cesta smí mít jeden návrat v `src/content/bloky/<id>.yaml` (Bloky › Návrat). Deník ho nabídne nejdřív tři dny po dokončení cesty; dokončená je cesta, když má student otevřené všechny kroky.

## Velká otázka

Stránka `/otazka/<slug>/` (`src/pages/otazka/[otazka].astro`) je rozhovor napříč staletími. Ukázková je otázka 7 „Jak poznám, co je pravda?“.

- **Soubor:** `src/content/otazky/<slug>.mdx`. Frontmatter `cislo`, `otazka`, `disciplina`, `pripad` (otázka úvodního případu, „Komu věřit?“) a `hlasy: [{ osoba, odpoved, myslenka, citat?, zdroje? }]` (osoba z `lide.yaml`, citát a prameny ze `zdroje.yaml`); text = úvod scénou („Představ si…“), dva až tři krátké odstavce. Otázka bez hlasů stránku nemá, zůstává jen řádek v přehledu `/otazky/`. Sestavení se zastaví, když osoba, citát nebo pramen chybí nebo když citát patří jiné osobě (`chybyHlasu` v `src/lib/otazky.ts`).
- **Pořadí:** nadtitulek (Velká otázka N · disciplína), otázka jako h1, úvod → **Tvůj první názor** (`PrvniNazor.svelte`) → **odpovědi na úvodní případ** (nadtitulek „Tentýž případ, čtyři odpovědi“, nadpis z `pripad`) → **Proč to tak viděli** (časová osa) → **Cesta / Cesty k otázce** (karty všech cest s touto otázkou, samy z dat) → **Změnil se?** (`ZmenilSe.svelte`) → Prameny.
- **Nejdřív student:** dokud student neuloží první názor nebo nestiskne Přeskočit, je všechno pod prvním názorem skryté (atribut `data-otazka-zavreno` na `<html>`, nastaví ho malý skript před vykreslením). Bez JavaScriptu je stránka vidět celá. Po odkrytí jde fokus na nadpis odpovědí.
- **Odpovědi** (`HlasyOdpovedi.astro`): karty s horní linkou v barvě období, mince 40 px, jméno, `odpoved` (jedna až dvě věty, jak by myslitel naložil s případem; převod jeho myšlenky, ne citát) a „Proč takhle?“. Celá karta je odkaz na `#hlas-<osoba>` na časové ose. Telefon pod sebou, od 700 px dva sloupce v pásu 960 px.
- **Časová osa** (`HlasyOsa.astro`): hlasy seřazené podle narození (`seradHlasy`). Svislá linka `--rule` 2 px prochází středem mincí 44 px (`tint`, barva období osoby); vedle mince letopočty (`t-popisek`, `--pc`, 600), jméno `t-h3` (odkaz, jen když má osoba stránku), `myslenka` (odstavce) a citát `<Citat kompaktni />`. Telefon: letopočty nad jménem. Od 1100 px letopočty v levém okraji vedle mince, text drží čtenářský sloupec. Rozestupy jsou stejné, ne podle let.
- **Deník:** `otazka-<slug>-prvni` (Můj první názor) a `otazka-<slug>-ted` (Po setkání s filozofy), druh `stanovisko`; přeskočení je stav `otazka-<slug>`. Změnil se? ukáže po uložení obě odpovědi vedle sebe („Na začátku“ / „Teď“) a otázku, co by názor změnilo ještě jednou. Nic se nehodnotí.
- **Odkazy:** na otázku odkazuj `adresaOtazky(id, data)`; vede na stránku, a dokud otázka stránku nemá, na kotvu v přehledu.

## Mapa a čas

- **Notebook 1440 × 900 (a 1280 × 800) bez posouvání:** hlavička 72 · pás období 40 · mapa 408 · posuvník roku 72 · osa 24 · řeka 272 (z toho dole řádek legendy 24) · vpravo karta člověka 408 px široká.
- **Telefon:** stav A = mapa 300, posuvník, spodní list s kartou; stav B = zmenšená mapa, vysunutá řeka životů. Přepínání záložkami v listu.
- **Jen žijící:** na mapě jen ti, kdo ve zvoleném roce žijí (od narození do úmrtí včetně; rok nula neexistuje). Více lidí v jednom místě = shluk (pilulka s mincemi a textem „Athény · a dalších 5“). Lidé mimo výřez = čárkovaný štítek se šipkou u okraje.
- **Značky:** mince `ring` 26 px + jméno na povrchové podložce; vybraný `sel` 36 px. Nápověda po najetí nebo klepnutí: jméno, věk, místo a „Proč …?“ k atributu.
- **Mapa:** Natural Earth (balíček `world-atlas`, `land-10m`), polygony regionu, projekce `geoConicConformal`, rovnoběžky 35° a 41° (pro antiku); tři vodní linky podél pobřeží (tah 16 px / 28 %, 7 px / 55 %, v tmavém 16 % a 32 %), síť poledníků po 2° velmi jemně. Názvy krajin verzálkami s prostrkáním v `--muted`, moře kurzívou Newsreaderu v `--ink-2` (`--muted` má na světlém moři kontrast 4,49 : 1, těsně pod AA). Měřítko a „Podklad: Natural Earth“ vlevo dole.
- **Cesty osob:** tečkovaná čára v barvě období (Platónova cesta domů, 360 př. n. l.).
- **Posuvník roku:** velký letopočet v Newsreaderu, šipky po 10 letech, stopa `--sunk`, uplynulá část `--period-N-soft`, jezdec s okrajem `--ink`. Nad stopou dějinné kotvy ve dvou řádcích: nahoře názvy, pod nimi značky (pruh 5 px pro období, tečka 7 px pro jeden rok), takže značka nikdy nezasáhne do cizího názvu. Tečka uvnitř pruhu (bitva během války) má okraj 2 px v barvě `--surface`. Název stojí nad začátkem své značky; názvy drží mezeru aspoň 9 px a žádný se nepotká s jiným (`rozmistiNazvy` v `src/lib/kotvy.ts`, šířky názvů měří `Posuvnik.svelte` skutečným písmem). Období mají přednost před událostmi jednoho roku a období celé v okně před obdobím, které okno ořezává. Když událost jednoho roku následuje těsně po období, jehož název je delší než pruh (Sókratův proces po Peloponéské válce), zarovná se název období ke konci svého pruhu a uvolní místo. U pravého okraje se název zarovná ke konci značky. Název, který se nevejde, se schová: zbude značka a název se ukáže jako štítek po najetí myší nebo při fokusu z klávesnice. Na telefonu jsou vidět jen značky. Hlídá jednotkový test (`tests/data/kotvy.test.ts`) a test v prohlížeči na 1440, 1280 a 1024 px.
- **Řeka životů:** řádek 16 px (telefon 22 px se jménem nad pruhem); žijící pruh 6 px v barvě období, ostatní `--muted` na 32 %; vybraný 10 px s prstencem a tintem řádku. Svislá čára roku navazuje na jezdec. Vztahy: plná čára učitel a žák, tečkovaná znali se, čárkovaná vliv přes texty, vlnovka polemika; tradovaný vztah slabší. Vlevo sloupec jmen 208 px (pod 1100 px 176 px), stopa posuvníku má stejné měřítko jako řeka. Vlevo jména a letopočty, nahoře osa po 50 letech.
- **Stín odkazu:** přepínač vlevo nahoře na mapě, výchozí stav vypnutý. Vedle něj tlačítko „?“ (32 px, dotykový cíl 44 px, `aria-expanded`): klepnutím nebo klávesnicí otevře pod přepínačem krátké vysvětlení a nikdy ho nezakryje. Zavře ho Esc (fokus se vrátí na „?“), klepnutí vedle nebo další stisk. Znění říká, co dělá `stinOdkazu` v `src/lib/cas-mapy.ts`: „Kdo zemřel, z mapy zmizí. Se stínem odkazu tam vybledle zůstane, dokud žije někdo, kdo ho znal, četl, učil se u něj nebo se s ním přel.“ U polemiky zůstává ten, s kým se žijící pře (Chrýsippos, dokud žije Karneadés), ne zesnulý kritik.
- **Legenda čar** (`LegendaVztahu.svelte`, názvy `LEGENDA_VZTAHU` v `src/lib/vztahy.ts`): „Čáry mezi životy“ pro čtyři typy z dat a tradovaný vztah: plná „učitel a žák“, tečkovaná „osobně se znali“, čárkovaná „vliv přes texty“, vlnovka „polemika“, slabší čára „vypráví se“. U každé vzorek čáry a text, vzorky stejné jako v kartě člověka. Notebook: stále viditelný řádek (24 px) na spodním okraji řeky; pod 1280 px bez nadpisu a smí se zalomit. Telefon: tlačítko „Legenda“ vedle „Seznam“ v záložce Řeka životů otevře panel; zavře ho Esc (fokus zpět na tlačítko) nebo klepnutí vedle. V seznamu žijících čáry nejsou, legenda tedy také ne. Nový typ vztahu do legendy patří, až když je ve schématu dat (hlídá test).
- **Přepínač období:** malý pás období, závorka pod ním ukazuje okno řeky, svislá značka zvolený rok. Připravované období se pozná bez najetí myší a nejen z barvy: je šrafované, číslo má v čárkovaném rámečku a v názvu pro čtečky stojí „připravujeme“. Klepnutí na ně ukáže zprávu („Středověk: připravujeme.“). Číslo a název období stojí na štítku v plné barvě desky s měkkým okrajem (`.mseg__stitek`), takže pod textem neprobíhá ornament ani šrafování; text je skoro bílý (směs `on-plate` a bílé 1 : 3), tučný, na notebooku 13 px, na telefonu 12 px. Kontrast textu ke štítku je aspoň 5 : 1 v obou režimech (hlídá test v prohlížeči).
- **Drobné popisky:** žádný text v nástroji není na telefonu menší než token `popisek` (12 px); verzálkové nadtitulky smí mít token `nadtitulek`. Hlídá test v prohlížeči. Hlavička řeky je na telefonu 44 px vysoká, aby tlačítka Legenda a Seznam (32 px) měla dotykový cíl 44 px.
- **Karta člověka:** deska s mincí, jméno (h2), letopočty, „Proč …?“ k atributu, box „V roce … je mu … let“ s místem a příběhem, vztahy (typ čáry, role, jméno, poznámka „zemřel před 39 lety“), Změř vzdálenost („Dělí je 467 let. To je asi šest lidských životů.“), tlačítka Otevřít stránku / cesta.
- **Mezitím jinde:** malá karta vpravo dole na mapě.

## Atributy osobností

Každá osobnost s hloubkou profil nebo portrét má atribut: jednu věc ze svého příběhu (jako atributy světců v ikonografii). V datech jako `atribut: { ikona, proc }`. Při prvním setkání se vždy ukáže „Proč …?“.

| Osobnost | Atribut | Proč |
| --- | --- | --- |
| Sókratés | kalich | Když ho Athény odsoudily, vypil ve vězení číši jedu. Mohl utéct, ale neutekl. |
| Platón | jeskyně | Přirovnal nás k vězňům, kteří mají stíny na zdi za skutečnost. |
| Aristotelés | váhy | Správná míra leží mezi dvěma krajnostmi a není pro každého stejná. |
| Xenofón | přilba | Vedl ústup deseti tisíc řeckých vojáků. |
| Archytás | holubice | Vypráví se, že sestrojil létající dřevěnou holubici. |
| Isokratés | svitek | Učil řečnictví. |
| Eudoxos | nebeské sféry | Navrhl první model nebe ze soustředných sfér. |
| Theofrastos | rostlina | Napsal první velké dílo o rostlinách; říká se mu otec botaniky. |
| Diogenés | lucerna | Za bílého dne hledal s lucernou člověka. |
| Kratés | mošna (`bag`) | Složil o ní báseň jako o městě, kde se nikdo nepere o peníze ani o slávu. |
| Hipparchia | člunek (`shuttle`, tkalcovský) | Čas, který měla strávit u tkalcovského stavu, dala vzdělání. |
| Aristippos | loď | Po ztroskotání našel v písku geometrické obrazce a poznal, že je mezi vzdělanými lidmi. |
| Epikúros | výhonek | Jeho škole se říkalo Zahrada. |
| Seneca | přesýpací hodiny | Psal o tom, že nemáme málo času, jen ho hodně promarníme. |
| Epiktétos | berla | Byl chromý otrok, a přesto svobodný uvnitř. |
| Marcus Aurelius | vavřín | Filozof na císařském trůnu. |
| Augustin | planoucí srdce | „Neklidné je naše srdce, dokud nespočine v tobě.“ |
| Descartes | souřadnice | Kartézská soustava souřadnic nese jeho jméno. |
| Spinoza | čočka | Živil se broušením čoček. |
| Kant | hvězda | „Hvězdné nebe nade mnou a mravní zákon ve mně.“ |
| Nietzsche | kladivo | Chtěl „filozofovat kladivem“. |
| Arendtová | pero | Jako reportérka psala o Eichmannově procesu. |
| Havel | klíče | V listopadu 1989 lidé na náměstích zvonili klíči. |

Ikony jsou tahové, mřížka 24 × 24, tah 1,5–1,8, zakončení kulatá, barva `currentColor`. Cesty ikon jsou v `docs/design/atributy-ikony.json`; v P2 se převedou do jednoho SVG se symboly. Tvrzení u atributů projdou skillem `atlas-overeni`, než se dostanou do dat.

## Obrázky

Fotografie busty, fresky a rukopisy v duotónu barvy období (`plate` / `on-plate`), výřez podle desky, vždy s popiskem a s licencí v `zdroje.yaml`. Dokud obraz chybí, zobrazuje se deska s mincí atributu, nikdy generická silueta.

## Přístupnost

Kontrast AA pro všechen text ve všech čtyřech kombinacích (A/B × světlý/tmavý) je ověřený výpočtem. Každá osoba na mapě i pruh v řece je tlačítko ovladatelné klávesnicí; řeka má textovou alternativu (seznam žijících ve zvoleném roce). Ikony mají `aria-hidden`, mince nese jméno a atribut v `title` / `aria-label`. Pevná spodní lišta (telefon, krok cesty) nesmí zakrýt prvek s fokusem: `html` má `scroll-padding-bottom` na výšku lišty (`global.css`). To pomůže jen prvku mimo okno: když prvek leží ve viditelné části okna pod lištou, prohlížeč stránku neposune. Základní rozvržení (`src/layouts/Zakladni.astro`) proto po fokusu z klávesnice stránku dorovná o přesah; po klepnutí myší ne. Hlídá `tests/e2e/fokus-lista.spec.ts`. Na profilu drží pod hlavičkou lišta Obsah: `scroll-padding-top` je tam o její výšku větší, takže skok na kotvu ani prvek s fokusem pod ni nezajede. Při omezeném pohybu trvá každý přechod 0,01 ms, i přechod viditelnosti: test, který na prvek sáhne hned po jeho zobrazení, na něj musí počkat (`toBeVisible`).
