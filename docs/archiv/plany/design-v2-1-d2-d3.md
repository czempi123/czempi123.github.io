# Větev design-v2, část: plátno: design systém a pohyb

Část plánu větve `docs/archiv/plany/design-v2.md` (oddíl Části plánu). Plán se 15. 11. 2026 rozdělil, aby každý soubor pro Projekt Claude měl pod 35 kB; text oddílů je beze změny.

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

