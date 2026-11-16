# Větev design-v2, část: Mapa a čas

Část plánu větve `docs/archiv/plany/design-v2.md` (oddíl Části plánu). Plán se 15. 11. 2026 rozdělil, aby každý soubor pro Projekt Claude měl pod 35 kB; text oddílů je beze změny.

## Zadání K7a: Mapa a čas

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K6 (prázdná odpověď znamená souhlas). Když se krok nevejde do jednoho sezení, udělej nejdřív podklad mapy, lístečky lidí a kartu člověka (bod 1 a 2) a zapiš, co zbylo.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K7a větve design-v2, Mapa a čas. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co je na kterých obrazovkách: Mapa a čas; Co se proti design systému změnilo), Po K1 (přezdívky), Po auditu (Pravidlo střídmosti, Mapa a deník: funkce, řádky K7a), Po K6 a Co rozhodnout po K6 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a oddíly o Mapě a čase (mapa, řeka životů, karta člověka, posuvník, Přehrát život). Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/MapaCas.dc.html jen styly a tělo obrazovky (ne pult náhledu a skript). Když odpovědi po K6 něco mění, oprav to nejdřív (kód QR v deníku jen s mým souhlasem z otázky 3). Podle otázky 6 po K6 nejdřív ověř přechod mezi stránkami v opravdovém Chromu (scripts/overeni-prechodu.mjs; Otázky → Lidé a zpět, Lidé → profil) a test ram.spec.ts:85 (--repeat-each=6, srovnej s commitem před K6); když přechod vypadává i v opravdovém Chromu, najdi příčinu (podezřelé je záhlaví a spodní lišta po K6: data-navraty a tečka u Deníku) a oprav ji.

1. Podklad mapy jako výstřižek staré mapy přilepený páskou (Po D4, MapaCas): moře šrafované tužkou, vodní linky podél pobřeží, pevnina na lístkovém papíře, rámeček se stupnicí, názvy moří kurzívou a krajů prostrkaně, větrná růžice, měřítko; v tmavém režimu týž výstřižek v noci. Barvy mapy (--map-*) převeď na papír a inkousty z tokens.css. Malý pás období nad mapou jako v K6 (zvolené období vtlačené, na telefonu vodorovně posuvný).

2. Lidé roku jako přišpendlené lístečky (razítko člověka místo mapa/Mince.svelte), které se při posunu roku objeví a zmizí a po klepnutí se rozvinou (--d-listek); razítko u lidí, které student už potkal (deník, potkaniFilozofove v src/lib/zapisnik.ts); klepnutí na město ukáže, co tu bylo. Karta člověka na listu s páskou (razítko, kdo, proč, rámeček V roce…, Život na mapě se zastávkami, Předchozí a Další, Otevřít stránku); při výběru jiného člověka se vymění. Popisky na telefonu bez překryvů (ověř testem přes getBoundingClientRect na obou šířkách).

3. Posuvník roku s drážkou a jezdcem jako razítko, věta „žije N lidí z atlasu“; Přehrát život v novém papíru. Pravý panel bez vybraného člověka: co se ten rok dělo a všichni žijící. První návštěva jen s mapou, rokem a jednou výpravou, zbytek pod „Víc“.

4. Řeka životů: výchozí jen učitel a žák, větší řádky, legenda barev, zvýraznění současníků vybraného člověka; Stín odkazu přejmenuj na „Ukázat i ty, na které někdo navazuje“.

5. Přepiš komponenty mapy (src/components/mapa/: Mapa, Reka, Posuvnik, KartaCloveka, Mince a další) na nová jména tokenů (Po K1, tabulka přezdívek): --paper, --surface, --sunk, --rule, --muted, --pc, --pc-tint, --pc-soft, --pohyb…, --r-…, --stin-mapa, --stin-list, --map-*; co přestanou používat, odškrtni v tabulce přezdívek v plánu. Zapiš, co z tint období (--pc-tint, --pc-soft, --period-N-tint, --period-N-soft) po K7a ještě zbývá (po K6: jen mapa, MiniOsa.astro a nepoužívaný ui/Mince.astro); smaže je O.

6. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro mapa, mini-mapa, zivot-na-mape, dva-zivoty, doba-odkazy, ram, domu a ty, které spadnou), node scripts/kontrola-fokus.mjs na Mapě a čase (bez vybraného člověka, s vybraným člověkem, s řekou životů) a na Domů, klávesnicí na dvou výškách okna (posuvník, lístečky, karta, řeka), jednou se zpomaleným procesorem při tažení posuvníku a tažení prstem skutečnými dotykovými událostmi (CDP), node scripts/snimky-listy.mjs na Mapě a čase (rok 424 př. n. l. s vybraným Sókratem, řeka životů, první návštěva) na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po K7a: co se na mapě změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K7a a zadání K7b v plném znění (podle tabulky kroků). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

8. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Po K7a (15. 11. 2026)

Odpovědi po K6 byly prázdné v repozitáři i v Projektu Claude, takže platí všech sedm doporučení. Z nich plynuly dvě věci před mapou (otázky 3 a 6). Během práce autor připomněl dvě věci na mapě (otevřený lísteček města s mnoha lidmi končil pod okrajem, jezdec a drážka posuvníku neseděly na čáru roku v řece); obě jsou opravené. Jeho připomínky mimo mapu (kapitoly v deníku, zvýrazněná kurzíva, odkazy dole na Domů, zarovnání aktivit) jsou v oddílu Připomínky autora mimo mapu níž. Snímky jsou v `Claude outputs/snimky/design-v2-k7a/`.

### Krok 0: přechod mezi stránkami a kód QR

- **Přechod nevypadával kvůli webu, ale kvůli náhledovému serveru.** Ve viditelném Chromiu nad `npm run dev` prošlo Otázky → Lidé šestkrát ze šesti, zpět taky, Lidé → profil i Sókratés → Platón s letem fotky. Nad sestaveným webem pod `astro preview` vypadával i ve viditelném okně (od druhého průchodu); stará stránka přechod založila (`pageswap` s `viewTransition`), nová ho nedostala. Tentýž `dist/` ze statického serveru: šestkrát ze šesti, i headless. Záhlaví ani tečka u Deníku za tím nejsou (zkoušeno i bez `data-navraty`). Proč přesně to `astro preview` dělá, jsem nezjišťoval: posílá `Cache-Control: no-cache` a drží spojení, nic víc vidět není.
- **Testy v Playwrightu teď běží nad `scripts/staticky-server.mjs`**, který se chová jako GitHub Pages (složka dostane `index.html`, adresa bez lomítka přesměruje, co není, vrátí `404.html` se stavem 404). `ram.spec.ts:85` s `--repeat-each=6` prošel šestkrát ze šesti (na `astro preview` dvakrát ze šesti, jako před K6 pětkrát). `scripts/overeni-prechodu.mjs` umí opakovat Otázky → Lidé a zpět (`OPAKOVANI=6`, `JEN_OTAZKY=1`, `PODROBNE=1`).
- **Kód QR** (otázka 3): `qrcode-generator` se načte až po klepnutí na „Ukázat kód QR“ u odkazu s deníkem; kód kreslí deník sám jako jednu cestu SVG (`src/lib/qr.ts`), tmavý na bílém poli i v noci (pevné barvy, jinak ho fotoaparát nepřečte). Na kód moc velký deník řekne „Deník je na kód QR moc velký. Pošli si odkaz.“

### Co se na mapě změnilo

- **Podklad jako výstřižek staré mapy** (`Mapa.svelte`): list s okrajem a dvěma páskami, moře šrafované tužkou, tři vodní linky podél pobřeží (tahy tužkou, mezi nimi papír moře), pevnina na lístkovém papíře s obrysem v inkoustu, dvojitý rámeček se stupnicí, názvy moří kurzívou a krajů prostrkaně, větrná růžice a měřítko s kostkovanou čarou. Síť poledníků zmizela. Ve tmě týž výstřižek z týchž tokenů.
- **Lidé roku na přišpendlených lístečcích** místo mincí: jeden lísteček na místo, rukou název a počet, špendlík v papíru období přesně na místě. Lístečky se při posunu roku objeví a zmizí, po klepnutí se rozvinou (jména; u potkaných razítko, čtečka slyší „razítko ve sbírce“). Pod jmény **Tady dřív**: události v místě a lidé, kteří tu byli (nejdřív ti, kdo už nežijí); klepnutí na jméno posune čas do jeho života. Otevřený lísteček visí na špendlíku, roste tam, kde je víc místa, a co se nevejde, posune se v něm (okraj vyblední). Na notebooku je lísteček vybraného otevřený, na telefonu zavřené (hlava 44 px).
- **Rozmístění bez překryvů** (`src/lib/mapa-listky.ts` › `rozmistiListky`): čtyři rohy u místa, pak posun nahoru nebo dolů s nití k místu (na telefonu nejvýš dva kroky, na notebooku tři), vyhne se lístečkům lidí mimo výřez, přepínači, růžici s měřítkem a razítkům navazujících. Kdo se nikam nevejde, zůstane jen špendlík (cíl 44 px), který se po klepnutí rozvine. Na telefonu mají přednost místa s nejvíc lidmi, na notebooku místo vybraného. Hlídá jednotkový test a test v prohlížeči přes `getBoundingClientRect` na 390 a 1440 px v pěti letech a na telefonu i se záložkou Řeka životů.
- **Karta člověka na listu s páskou** (`KartaCloveka.svelte`): poštovní razítko 78 px, jméno, kdo, proč, Proč…?, rámeček „V roce…“ vtlačený do papíru, Život na mapě se zastávkami a pod nimi Předchozí, Přehrát a Další v jedné řadě, vztahy, Změř vzdálenost, Otevřít stránku. Při výběru jiného člověka se list vymění.
- **Pravý panel bez vybraného člověka**: Rok…, Co se ten rok dělo, Žije N lidí z atlasu se seznamem všech (razítko jen u potkaných, ostatní prázdný kroužek).
- **Posuvník**: letopočet rukou v inkoustu období a pod ním „žije N lidí z atlasu“, drážka vtlačená do papíru, jezdec jako razítko s dvojitým kruhem. Posuvník má vpravo stejný okraj jako řeka, takže jezdec sedí na čáru roku (předtím o 16 px vedle).
- **První návštěva** jen s mapou, rokem a jednou výpravou (Kde byl Sókratés roku 424 př. n. l.?); po výběru Sókrata v tom roce razítko „Sedí“ a místo z dat (Délion, vojenské tažení). Řeka, přepínač navazujících a panel roku jsou pod „Víc: řeka životů a kdo všechno žije“ (zapamatuje `localStorage`). Odkaz s člověkem, srovnáním nebo Přehrát život otevře mapu celou. Skript na stránce pozná první návštěvu před vykreslením, takže rozvržení po hydrataci neuskočí.
- **Řeka životů**: výchozí jen čáry učitel a žák, „Všechny čáry“ přidá ostatní; řádky 22 px (telefon 30), pruhy 8 px; současníci vybraného tučně a v barvě období, ostatní vyblednou; vedle legendy čar „Barvy období“. Název řeky nese v hlavičce jen čtečka (vizuálně by se s tlačítky nevešel).
- **Stín odkazu** se jmenuje „Ukázat i ty, na které někdo navazuje“, „?“ má popisek „Koho to ukáže?“. Zesnulí jsou vybledlá razítka bez obvodu vlevo nad místem smrti.
- **Malý pás období** jako odtrhávací lístky v papíru období s perforací z teček, zvolené období vtlačené, na telefonu vodorovně posuvný.
- **Tokeny:** komponenty mapy berou jen nová jména; `--map-*` jsou v `tokens.css` přezdívky na papír a inkousty (`--list`, `--tuzka`, `--listek`, `--ink-2`), Mapa a čas je nepoužívá, používá je jen mini mapa v profilu.

### Přezdívky

Odškrtnuté v tabulce Po K1 (K7a): `--stin-mapa`, `--stin-list` (0), `--map-*` (Mapa a čas; zbývá mini mapa). Mapa (`src/components/mapa/`) už žádnou přezdívku nepoužívá kromě nepoužívaného `mapa/Mince.svelte`.

Zbývá (počet `var(--…)` v `src` mimo `tokens.css`, v závorce po K6): `--paper` 5 (10), `--surface` 9 (35), `--sunk` 1 (3), `--rule` 6 (40), `--muted` 6 (27), `--pc` 11 (30), `--pc-tint` 7 (11), `--pc-soft` 2 (3), `--pohyb` 18 (18), `--pohyb-kamera` 14 (14), `--r-xs` 1 (16), `--r-sm` 2 (10), `--r-md` 2 (4), `--r-full` 4 (4), `--stin-mapa` 0 (7), `--stin-list` 0 (1), `--map-*` 9 (jen `MiniMapa.astro`). Všechno je v kresbách (`ostrovy/*.svelte`, `Kresba.svelte`, `GrafKrivek.astro`), v mini mapě a mini ose profilu, v pravidlech kreseb v `global.css` a v nepoužívaných `ui/Mince.astro` a `mapa/Mince.svelte` (K7b, O).

**Tinty období** (`--pc-tint`, `--pc-soft`, `--period-N-tint`, `--period-N-soft`) po K7a: jen `MiniOsa.astro`, nepoužívané `ui/Mince.astro` a `mapa/Mince.svelte` a přiřazení `.obdobi-N` v `global.css`. Mapa je nepoužívá. Smaže je O (s `--muted`, který drží starou hodnotu kvůli tintám), mini osu přepíše K7b.

### Testy a kontrola

- `npm run build` prošel, kontrola typů bez chyb.
- Vitest: nové `tests/data/mapa-listky.test.ts` (rozmístění, posun, jen špendlík, co tu bylo, razítko z dat mapy, odpověď první výpravy v datech) a `tests/data/qr.test.ts`; v `tests/data/kontrast.test.ts` dvojice mapy na papíře (název moře na šrafě, štítek malého pásu aspoň 5 : 1) místo dvojic s `--map-*`.
- Playwright: nový `tests/e2e/mapa-k7a.spec.ts` (první návštěva a Víc, příznak před vykreslením se zablokovanými skripty, lístečky bez překryvů na obou šířkách, razítko u potkaných, Tady dřív, panel roku, klávesnice na lístečku, karta jako list s páskou, řeka). Upravené `mapa.spec.ts` (lísteček místo shluku, nové jméno přepínače a vysvětlení, výchozí legenda jen učitel a žák, „Všechny čáry“, řádek legendy smí mít dva řádky a řece zůstane aspoň 120 px), `zivot-na-mape.spec.ts` (ovládání pod seznamem, jedna řada tlačítek na natočeném listu) a `denik-soubor.spec.ts` (kód QR, knihovna až po klepnutí). Starší testy mapy zapínají úplnou mapu (`atlas-mapa-vic`).
- `scripts/kontrola-fokus.mjs` na Mapě a čase (první návštěva, úplná bez vybraného člověka, se Sókratem a řekou) a na Domů, 390 a 1440 px: žádný prvek pod lištou, nic nepřetéká, konzole čistá. Skript nově ořízne obdélník prvku posuvným rodičem (dřív hlásil desítky překryvů od odscrollovaných řádků řeky). Zbývají jen záměrné: tečka bitvy na pruhu války nad posuvníkem a otevřený lísteček přes zavřený (a jeho natočené řádky).
- Klávesnicí (jednorázový skript, smazaný) na 1440 × 900, 1440 × 700, 390 × 844 a 390 × 640: fokus prošel posuvník, lístečky, kartu a řeku, nikdy mimo okno ani pod jiným prvkem (prvek s fokusem se vytáhne nad otevřený lísteček).
- Zpomalený procesor (6×) a tažení jezdce myší: 30 kroků, 30 změn roku, nejdelší mezera 140 ms. Prstem přes CDP (`Input.dispatchTouchEvent`) na 390 px: jezdec posune rok, stránka se neposune; tažení po mapě rok nemění a stránku taky ne.
- Kontrast nových dvojic výpočtem (jednorázový skript, smazaný), ve dne i v noci: nejnižší text 4,72 : 1 (kraj na pevnině a „Tady dřív“ v noci), štítek pásu aspoň 5,48, název moře na šrafě 5,46 v noci; netextové prvky aspoň 3,63 (nit tužkou ve dne).
- **Celé `npm test`** dvakrát: po mapě (kontrola typů bez chyb, Vitest 1 386, Playwright 748 ze 748, 8,3 min) a po připomínkách mimo mapu (748 ze 748, 9,4 min). Po druhém běhu jsem jen opravil odsazení lístků na Domů (váha pravidla) a pustil dotčené testy Domů, nových stránek a prohlídky.

### Nad čím jsem váhal a co by šlo jinak

- **Rozvržení nástroje zůstalo celé obrazovky** (pás, mapa, posuvník, řeka, vpravo karta), jen v novém papíru. Plátno má mapu jako obrázek na stránce s titulkem; nástroj bez posouvání je ale pro mapu, řeku a kartu najednou lepší a testy ho drží.
- **Výstřižek se nenatáčí.** Plátno ho má o půl stupně natočený; v nástroji by tím rozmazal ručně psané lístečky a posunul dotykové cíle. Natočené jsou lístečky (±3°) a karta (0,4°).
- **Jen špendlík tam, kde se lísteček nevejde.** Šlo by slučovat blízká místa do jednoho lístečku („Athény a okolí“), ale klepnutí na město by pak neukázalo jen to město.
- **Na telefonu mají přednost plná místa**, ne místo vybraného (toho ukazuje karta pod mapou). Na notebooku je to obráceně.
- **„Tady dřív“ jsou události místa a lidé**, nejdřív ti, kdo už nežijí, nejvýš čtyři jména a „a další N“. Nejcennější mi přišlo, že student uvidí, kdo v Athénách chyběl (Sókratés roku 395).
- **Výprava je jedna a pevná** (Sókratés, 424 př. n. l.); odpověď skládají data. Výpravy na každé období patří do `herna-v1`.
- **Razítko jen u potkaných**, ostatní mají v panelu prázdný kroužek: sbírka tak roste s tím, co student prošel. Jinak: razítko u všech a u potkaných značka navíc.
- **Ovládání Života na mapě je pod zastávkami** jako na plátně (dřív nad nimi; docs/design.md opravené).
- **Letopočet je Kalamem** (rukou) jako na plátně; na notebooku 21 px, aby se „424 př. n. l.“ vešlo mezi šipky.
- **Testy jsou na statickém serveru**, ne na `astro preview`: je to blíž GitHub Pages a přechody v nich drží. `npm run preview` zůstává.

### Připomínky autora mimo mapu (15. 11. 2026)

Řešené po K7a (oddíl níž, nebo jako další krok, viz otázky).

1. **Deník se bude plnit a stane se z něj velmi dlouhá stránka**: potřebuje kapitoly (podle cest, nebo podle období) a jen jedno další členění, aby nebyl zmatek sám o sobě.
2. **Zvýrazněná kurzíva v barvě** („Nikdo není *moudřejší.*“ na lístku cesty na Domů, „Proč to tak *viděli*“, „Změnil *se?*“ na stránce otázky, `em` v titulku stránky z dat) působí jako typický znak textu od AI. Jestli něco ozvláštnit, tak jinak.
3. **Odkazy „Co je filozofie?“ a „Co je náboženství?“ dole na Domů** esteticky nesedí.
4. **Aktivity (bloky a kresby) v průchodu cest a na stránkách otázek** jsou zarovnané doleva, zbytek stránky na střed.

### Připomínky autora mimo mapu: co je hotové a co ne

- **Zarovnání aktivit (4): hotovo.** Kresby (JS animace, 520 px) a grafy (420 px) stály u levého kraje čtenářského sloupce (380–900 px místo na střed); teď mají `margin-inline: auto` (`Kresba.svelte`, `GrafKrivek.astro`). Bloky v rámu aktivity byly na středu už dřív. Dvousloupcový první krok cesty (deska vlevo, citát vpravo) je tak záměrně.
- **Zvýrazněná kurzíva (2): hotovo.** Kurzíva v nadpisech nic nezvýrazňuje (`global.css`: `em` v `h1`–`h4` a třídách nadpisů dědí řez i barvu; totéž v `CestaKarta`, `HlavickaStranky`, `Oddil`, `Myslenka`, `Kapitola`). Hvězdičky v obsahu zůstaly (hotový obsah se teď nemění), takže se nadpis dá kdykoli jinak ozvláštnit bez úprav textů. V běžném textu kurzíva zůstává (názvy děl).
- **Odkazy dole na Domů (3): hotovo.** Řádek „na začátek · Co je filozofie? · Co je náboženství?“ je teď dvojice menších lístků s páskou pod třemi vstupy (rukou „na začátek“, název, první věta perexu stránky).
- **Kapitoly v deníku (1): navrženo, ne postaveno** (otázka 5). Je to změna stavby hlavní stránky studenta; patří k ní snímky s plným deníkem a rozhodnutí, podle čeho dělit.

## Co rozhodnout po K7a

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-k7a/`). Prázdná odpověď znamená souhlas s doporučením.

1. **Mapa jako výstřižek a lidé na lístečcích** (snímky `mapa-424-sokrates-*`, `mapa-reka-*`): podklad, lístečky s počtem a špendlíkem, rozvinutý lísteček s „Tady dřív“, karta člověka na listu s páskou, posuvník s jezdcem jako razítko. Doporučuji ano.
   Odpověď:

2. **První návštěva** (snímky `mapa-prvni-navsteva-*`): jen mapa, rok a výprava „Kde byl Sókratés roku 424 př. n. l.?“, zbytek pod „Víc“. Doporučuji ano.
   Odpověď:

3. **Kde se lísteček nevejde, zůstane jen špendlík** (na telefonu se záložkou Řeka životů, v hustých místech), po klepnutí se rozvine. Jinak: slučovat blízká místa do jednoho lístečku. Doporučuji ano (špendlík).
   Odpověď:

4. **Testy nad statickým serverem místo `astro preview`** (přechod mezi stránkami tam drží a je to blíž GitHub Pages). Doporučuji ano.
   Odpověď:

5. **Kapitoly v deníku** (tvoje připomínka): doporučuji jedno další členění **podle období**. Nahoře zůstane Moje filozofie (už dnes po velkých otázkách, přes všechna období) a Návrat; pod ní kapitoly Antika, Středověk… jako rozbalovací lístky, otevřená je kapitola období, ve kterém student naposledy byl. V kapitole jsou rozpracované cesty, odpovědi a stanoviska seřazené podle cest (nadpis cesty je jen řádek, ne další rozbalování) a sbírka toho období. Proč období: je jich osm, odpovídají pásu období a stránce Tvoje antika a kapitola se nerozroste přes míru. Podle cest by kapitol bylo časem desítky. Napiš „cesty“, jestli chceš kapitoly podle cest. Postaví to krok K6 dodatek (zadání níž), před K7b.
   Odpověď:

6. **Chceš něco změnit na snímcích po K7a?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání K6 dodatek: kapitoly v deníku

Opus 5.5 · high se skillem `atlas-komponenta`. Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K7a.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K6 dodatek větve design-v2, kapitoly v deníku. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Po K6 (Můj deník jako zápisník), Po K7a (Připomínky autora mimo mapu) a Co rozhodnout po K7a s mými odpověďmi; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. Z docs/design.md jen oddíl o Mém deníku. Načti skill atlas-komponenta.

1. Deník dostane jedno další členění podle odpovědi 5 po K7a (doporučení: období). Moje filozofie a Návrat zůstanou nahoře. Pod nimi kapitoly jako rozbalovací lístky (otevřená je kapitola, kde student naposledy byl; stav kapitol si deník pamatuje), v kapitole rozpracované cesty, odpovědi a stanoviska seřazené podle cest (nadpis cesty je řádek, ne další rozbalování) a sbírka té kapitoly. Prázdná kapitola (období bez stránky nebo bez záznamů) se neukazuje. Výpis podle data zůstane jako přepínač uvnitř kapitoly. Záloha a přenos zůstanou dole jednou pro celý deník.

2. Logiku (rozdělení záznamů do kapitol, pořadí, která je otevřená) dej do src/lib/zapisnik.ts s testy ve Vitestu; deník s jedním, se dvěma obdobími (testovací záznamy) a prázdný.

3. Ověř: npm run build, npx vitest run, PW_BEZ_BUILDU=1 npx playwright test pro denik, navrat, tvoje-antika, denik-soubor a ty, které spadnou; node scripts/kontrola-fokus.mjs na /denik/ s prázdným a plným deníkem; klávesnicí (rozbalení kapitoly, Esc nic nerozbije); node scripts/snimky-listy.mjs na /denik/ s plným deníkem (ULOZISTE) na 390 a 1440 px ve dne i v noci. Celé npm test jednou před commitem. Restartuj náhled npm run dev.

4. Do plánu větve zapiš oddíl Po K6 dodatku (co se změnilo, nad čím jsi váhal, otázky). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

5. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

