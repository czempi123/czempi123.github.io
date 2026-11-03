---
name: atlas-komponenta
description: Stavba nové komponenty nebo interaktivního bloku Atlasu myšlení (Svelte ostrov v Astru) a každá změna UI — podle design tokenů, s přístupností, testy v Playwrightu a snímky ve světlém i tmavém režimu. Použij VŽDY, když vzniká nebo se mění blok knihovny (Volba s důvodem, Odkryj, Spor…), stránka s interakcí nebo ostrov, a když uživatel řekne „postav komponentu“, „nový blok“, „uprav rozhraní“, „oprav vzhled“.
---

# Komponenta Atlasu myšlení

Komponenta je hotová, když ji autor vloží do MDX jedním řádkem, student ji ovládá prstem i klávesnicí, vypadá stejně dobře ve světlém i tmavém režimu a testy to dokazují. Tón a pravidla obsahu platí i pro texty uvnitř komponent (`CLAUDE.md`, `docs/styl.md`).

## Postup

1. **Přečti** `docs/design.md` (Barvy, Typografie, Komponenty, Přístupnost), `docs/plan.md` (tabulka bloků v oddílu Mechanismy učení), podobné hotové ostrovy v `src/components/` a sdílenou logiku v `src/lib/`. Nejdřív hledej, co už existuje (Mince, deník, letopočty, časová logika mapy); nic nepiš dvakrát.
2. **Navrhni rozhraní** dřív než kód: props, sloty/snippety pro MDX, co blok ukládá (deník, localStorage) a jak vypadá stav po obnovení stránky. Jednu ukázku použití v MDX napiš hned na začátek souboru komponenty jako komentář.
3. **Logiku odděl do `src/lib/`** jako čisté funkce bez DOM a Astra (vyhodnocení, převody, formátování). Ty dostanou jednotkové testy ve Vitestu.
4. **Postav ostrov** podle `references/vzor-komponenty.md`: Svelte 5 (runes), jen tokeny, barva období přes třídu `obdobi-N`, fokus jen při klávesnici, dotykové cíle aspoň 44 px, pohyb vypnutý při omezeném pohybu.
5. **Vyzkoušej v prohlížeči** na 390 a 1440 px, světlý i tmavý režim, jen klávesnicí, a jednou se zpomaleným procesorem, pokud komponenta reaguje na tažení nebo psaní. Snímky si prohlédni; obrázek v testu nestačí, musíš ho vidět.
6. **Napiš testy** podle `references/kontrolni-seznam.md` a spusť celé `npm test` (ne jen nové testy).
7. **Zapiš** do `docs/design.md` (oddíl Komponenty) krátký popis bloku a jeho API, zásadní volbu do `docs/rozhodnuti.md`. Commituj česky po ucelených krocích ve vlastní větvi.
8. **Předej** snímky obou šířek v obou režimech, seznam odchylek od `docs/design.md` s důvodem a co zůstalo na později.

## Zásady

- **Student první.** Odpověď a zpětná vazba se odkrývají až po vlastním pokusu. Zpětná vazba hodnotí důvody, nikdy souhlas s filozofem; nic se neboduje, nic se nesoutěží.
- **Nic neodkrývej dřív, než se student rozhodne.** Když blok po pokusu klade další otázku (volbu, odhad), nesmí nad ní stát odpověď, místo, kam míří jiní, ani zvýraznění, které ji napovídá: student by zvolil to zvýrazněné. Co by odkrytí řeklo, přijde až za jeho volbu, i když to znamená zastavení navíc (Slož argument: zpětná vazba → „Ukázat chybějící větu“ → volba → Kde se dá argument napadnout a silnější okraj řádku). Otázka ve zpětné vazbě nemá odpověď o řádek výš. Každé zastavení vydrží obnovení stránky.
- **„Začít znovu“ ve všech blocích.** Tlačítko, které smaže stav bloku i zápis v deníku, se jmenuje všude stejně (tiché tlačítko v `blok__akce`); „Zkusit znovu“ zní jako druhý pokus u zkoušky. Výjimkou je jen odhad Kdo žil dřív?, kde tlačítko dává nový odhad a nic nemaže.
- **Žádná redakce v rozhraní.** Popisky tlačítek a nápovědy jsou krátké pokyny („Porovnat se Sókratem“), ne vysvětlování, jak je blok udělaný.
- **Soukromí.** Odpovědi zůstávají v prohlížeči (`src/lib/denik.ts`), nikam se neodesílají; komponenta musí fungovat i bez localStorage.
- **Bez externích závislostí za běhu.** Žádné CDN, písma a ikony lokálně (`public/ikony/*.svg`, komponenta Mince).
- **Data z `src/data`, ne ručně.** Jména, roky a vztahy ber z dat přes `src/lib/data.ts` nebo z výtahu předaného ostrovu; text v komponentě nesmí odporovat datům.

## Časté pasti

- Nezlomitelnou mezeru v TypeScriptu piš jako `'\u00a0'`, v šabloně jako `&nbsp;`. Znak vložený přímo se při úpravách souboru může změnit na obyčejnou mezeru. Za jednopísmenné předložky a spojky ji doplňuje sestavení (`src/lib/sazba.js`): v MDX plugin `sazbaMdast`, v textech bloků `radek` a `odstavce`. Komponenta, která vypisuje delší text z dat nebo z atributu, zavolá `nezlomitelne()` sama.
- `requestAnimationFrame`, `matchMedia`, `localStorage` a `history` nejsou při sestavení (SSR) k dispozici: používej je jen v `onMount`, v obsluze událostí nebo za kontrolou `typeof`.
- Efekt (`$effect`), který zapisuje stav, jenž sám čte, se zacyklí nebo si zruší vlastní práci; čtení zabal do `untrack`.
- Ostrov s `client:visible` se hydratuje až po posunu k němu; test musí počkat na `astro-island[component-url*="Jmeno"]:not([ssr])`, jinak klikne dřív než skript.
- Prvek skrytý přes `display: none` v CSS mřížce posune ostatní do jiných sloupců; sloupec nastav explicitně (`grid-column`).
- Text jen pro čtečky: třída `vizualne-skryte` z `global.css`. Je umístěná absolutně, takže ji čtečka od viditelného textu oddělí mezerou: nezačínej ji interpunkcí („Dát sem“ + „kartu … do koše …“, ne „: …“).
- Běžící `npm run dev` po změně schématu kolekce (`content.config.ts`, `bloky-schema.ts`) vrací chybu, dokud ho autor nerestartuje. Na náhled si sestav web (`npx astro build`) a pusť `npx astro preview --port 4323 --ignore-lock`.
- Playwright před každým během smaže `test-results/`: pomocné skripty a pracovní snímky drž jinde (`/tmp`), ne tam.
- Volání přes Desktop Commander delší než minuta se přeruší, i když proces běží dál. Dlouhé příkazy (`npm test`) pouštěj na pozadí s výstupem do souboru a čti ho po částech.
- Když je cílem klepnutí celá plocha (tlačítko roztažené přes koš pomocí `::after`), Playwright nahlásí, že prvek pod ním něco překrývá: v testu klepej na tlačítko, nebo s `force`.
- Tažení prstem: `touch-action: none` dej jen prvku, který se táhne, ať se stránka dá posouvat všude kolem; ke každému tažení patří cesta bez tažení (tlačítko, klávesnice).
- Tažení prstem ověř i skutečnými dotykovými událostmi (CDP `Input.dispatchTouchEvent`), ne jen syntetickými událostmi ukazatele: jen tak poznáš, jestli se při tažení neposouvá stránka.
- Astro 7 zpracovává Markdown a MDX procesorem Sätteri. Remark a rehype pluginy se bez balíčku `@astrojs/markdown-remark` nespustí: v `markdown.rehypePlugins` zastaví sestavení, v `mdx({ … })` se tiše ignorují. Úpravu textu napiš jako plugin pro Sätteri (`markdown.processor: satteri({ mdastPlugins: [...] })`).
- Pevná lišta dole (telefon, krok cesty) zakryje prvek, na který přijde fokus z klávesnice. `html` má proto `scroll-padding-bottom` na výšku lišty, ale to pomůže jen prvku mimo okno: když prvek leží ve viditelné části okna pod lištou, prohlížeč stránku neposune. Dorovnává to skript v `src/layouts/Zakladni.astro` (jen po fokusu z klávesnice, po klepnutí myší ne); nová pevná lišta musí přibýt do jeho selektoru. Prvku, jehož rámeček fokusu je větší než on sám (koš kolem tlačítka), přidej `scroll-margin-bottom`. Hlídá `tests/e2e/fokus-lista.spec.ts`; při ladění měř až po dojetí plynulého posunu, nebo s omezeným pohybem.
- Vypnuté tlačítko musí vypadat vypnutě v každé variantě (hlavní, vedlejší, tiché). Varianta bez stylu pro `:disabled` vypadá jako živá.
- Dva prvky stejného druhu pod sebou musí mít stejnou stavbu při každé délce textu: `flex-wrap` zalomí jen ten delší a tlačítka pak vypadají každé jinak. Zkoušej s nejkratším i nejdelším skutečným textem.
- Doplněk za popiskem („Nepovinné“) s `margin-left` po zalomení odskočí od kraje; dej obalu `column-gap`.
- Věta složená z dat s pádem: „život {jmeno2}“, ne „{jmeno2} život“. Přečti ji se třemi různými jmény.
- Popisky v SVG (mini mapa): překryvy počítej z obdélníků jednotlivých řádků, ne z jednoho obalu. Šířku textu změř v prohlížeči (úzké znaky mají asi poloviční šířku) a výsledek ověř testem přes `getBoundingClientRect` na obou šířkách.
- `npx astro build` nevytvoří index hledání, ten dělá až `npm run build` (Pagefind). Test hledání pak s `PW_BEZ_BUILDU=1` selže a není to chyba komponenty.
- Snímek jednoho prvku (`locator.screenshot`) na stránce s pevnou hlavičkou má lištu uprostřed a text přesahující prvek je uříznutý. Je to vlastnost snímku, ne chyba stránky; lišty před snímkem skryj stylem.
- Styl ostrovu platí i pro obsah snippetu, který ostrov předá jiné komponentě, ale ne pro prvky, které ta komponenta vykreslí sama: scéna kresby se styluje v ostrovu kresby, rám v rámu. Stav rámu chytíš přes `:global(.kresba--pohyb) .prvek`.
- CSS `transform` na prvku SVG přepíše jeho atribut `transform`. Co se má hýbat a zároveň stát posunuté, zabal do `<g transform="…">` a animuj vnitřní prvek; střed otáčení nebo zvětšení nastav přes `transform-box: fill-box` a `transform-origin`.
- Zkratka `animation` ve stylu ostrovu přebije `animation-play-state` z `global.css`, když mají obě pravidla stejnou váhu. Zastavení kresby proto řeší rám pravidlem s `!important` nad třídou `k-hybe`.
- **Zastavená kresba kreslí obsah, ne začátek smyčky.** Rám animaci zastaví tam, kde je; kdo pohyb zastaví hned po načtení, uvidí první okamžik (jedna rozsvícená bublina, vězeň mezi ostatními) a obsah nikdy. Pod `.kresba--pohyb:not(.kresba--bezi)` proto vypni jméno animace a kresli totéž co při omezeném pohybu (Třetí čára, Cesta ven, Přesýpací hodiny, Maska); Pustit pohyb začne smyčku znovu. Každá kresba s pohybem má test: načíst, hned Zastavit pohyb a ověřit stav jako při omezeném pohybu.
- Kresba s pohybem mimo vzor jeskyně: ovládání pod plátnem jde do snippetu `ovladani` (posuvník `k-posuvnik`, přepínač `k-prepinac` v obalu `k-volba`, tlačítka `blok__tl` v řádku `blok__akce`); kresba, ve které nic neběží samo, předá rámu `maPohyb={false}`; vlastní barvy mimo tři tóny smí mít jen kresba, jejímž tématem je barva (šaty), a má je v `src/lib/<tema>.ts` s testem; kresba smí stát i pod blokem, který k ní vede vlastním Kam dál. Podrobně `references/vzor-komponenty.md` a `docs/design.md` › Kresba s pohybem.
- Průhledný `<input>` roztažený přes popisek (přepínač pohledů) zachytí klepnutí: v testu zaškrtni přepínač (`getByRole('radio').check({ force: true })`), neklepej na text.
- **Přeskládání po hydrataci na první obrazovce problikne.** Sestavená stránka je celá a ostrov ji přeskládá až po načtení skriptů; na telefonu student mezitím čte odstavec, který mu pak zmizí, a text uskočí o stovky pixelů. Co má být skryté hned, skryje skript před vykreslením hned za obalem (`<script is:inline set:html={…} />`; najde obal přes `document.currentScript.previousElementSibling`). Pravidlo zůstane jedna funkce: vlož ji do skriptu jako text (`fn.toString()`), ne opis; funkce smí sahat jen na své parametry, pomůcky z jiného modulu dostane parametrem (vzor `skriptStranPredem` v `src/lib/strany.ts`, hlavní tlačítko na Domů). Ostrov po hydrataci skryté ukáže a značku sundá; pojistka (`load` + pár sekund) ukáže vše, kdyby se ostrov nehydratoval. Test: co je vidět při `DOMContentLoaded` (`addInitScript`), a stránka se zablokovanými moduly; blokuj celé `/_astro/*.js`, jeden soubor ostrova přijde i přes přednačtení. Skript ověř v `dist/`, ne jen ve Vitestu (sestavení může přejmenovat proměnné).
- **`figcaption` je první, nebo poslední potomek `figure`.** Ovládání k obrázku (nabídka, posuvník) dej za `</figure>` do společného obalu s `id`, na který míří kotva a testy; jinak čtečka čte popisek jako součást obrázku a ovládání za ním jako jeho pokračování.
- **Nový druh bloku, nebo nové tlačítko v kroku bloku, musí znát i to, co cestu prochází samo:** `tests/e2e/pruchod.spec.ts` (`odpovez`), `scripts/slova-cesta.mjs` a `scripts/snimky-cesta.mjs`. Slož argument na nich spadl při prvním použití v cestě a znovu, když přibylo „Ukázat chybějící větu“.

## Stránky skládané z dat

Pět typů stránek nad hotovou látkou (období, směr, myšlenkový pokus, úvod oddílu, náboženská tradice) a přehled období v deníku (Tvoje antika) vznikly ve větvi `antika-doplnky`. Šablony a API popisuje `docs/design.md` › Stránky období, směru, pokusu, úvodu a tradice; schémata jsou v `src/lib/stranky-schema.ts`, adresy a oddíly v `src/lib/stranky.ts`, seznam existujících stránek v `src/lib/stranky-typu.ts`.

- **Odkaz na novou stránku se objeví sám**, jakmile stránka existuje (`adresaObdobi`, `adresaSmeru`, `adresaOtazky`): do té doby vede tam, kam dosud. Ručně psaný odkaz na stránku, která ještě není, je slepá ulička (karta „Je Bůh?“ vedla na řádek přehledu bez odkazu).
- **Vazba stránky na lidi patří do dat**, ne do konstanty v komponentě: tradice zná své osoby polem `tradice` (judaismus má `tradice: zidovska`) a medailonek z něj skládá kartu Kam dál (`kamDalMedailonku`).
- **Prameny se skládají z textu** (`pramenyZTextu`): citáty a bloky. Pramen výkladu v próze nebo v Odkryj zapiš do `zdroje` ve frontmatteru (úvody), jinak v Pramenech chybí.
- **Mapka s blízkými body** (Javne a Jeruzalém leží padesát kilometrů od sebe): kde pod mapkou stojí seznam míst s rolí a roky, nese mapka jen jména (`MistaTradice.astro`). Popisek západnějšího z blízkých bodů jde doleva sám (`stranyPopisku`); ověř snímkem na 390 px a testem, že se obdélníky názvů nepotkají.
- **Nová stránka** patří do `STRANKY` v `tests/e2e/nove-stranky.spec.ts` (390 a 1440 px, světlý a tmavý režim, axe, oddíly) a do katalogu hodin; ten ověř skriptem `scripts/hodiny-katalog.mjs` proti `dist/`.
- **Přehled období v deníku** (`TvojeObdobi.svelte`, logika `src/lib/tvoje-obdobi.ts`, stránka `src/pages/denik/antika.astro`) ukazuje jen to, co student udělal: žádná procenta, typy ani „chybí ti“, s prázdným, částečným i plným deníkem. Student ho čte o týdny později, bez kroku cesty: u myslitele stojí nejdřív odkud (cesta · tvoje odpověď), pak věta, proč je blízko, protože ta často začíná větou kroku („Jestli nemáš…“). Testy hledají podle tříd, ne podle pořadí. Další období dostane vlastní stránku deníku nad stejnou logikou.
- **`scripts/kontrola-fokus.mjs`** vynechává prvky, pro které `checkVisibility()` vrací false: odkazy v zavřeném `<details>` mají v Chromiu rozměry a hlásily se jako překryv.

## Když nemáš terminál na autorově počítači

Pracuj v kopii repozitáře a hotovou větev předej jako git bundle do složky Atlas (do `.git` zapisovat nelze): `git bundle create mapa.bundle <zakladni-vetev>..<nova-vetev>` a autorovi napiš jeden příkaz, jak ji načíst (`git fetch ./soubor.bundle vetev:vetev`, nebo `git pull ./soubor.bundle vetev`, pokud je větev zrovna vybraná). Postup si nejdřív ověř na kopii.
