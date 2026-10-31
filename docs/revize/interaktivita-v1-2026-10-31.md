# Revize větve interaktivita-v1 (krok R), 31. 10. 2026

Revize K0 až T2 podle skillu `atlas-revize` (šest perspektiv, texty se skillem `atlas-psani`). Prošel jsem poslední kroky cest 2, 7, 8, 33 a 34 oddíl po oddílu pro každou odpověď (jako první odstavec pod štítkem i ve sbalené části), Slož argument v cestě 8, krok 3 proti podkladům celku 6, prameni a krokům 4 až 6, výpis dvojic Dvou životů a Kdo žil dřív? ze skutečných dat (`VYPIS=1 npx vitest run tests/data/dvojice.test.ts`), čas cest skriptem `slova-cesta.mjs` na sestaveném webu a kontroly na GitHubu.

## Verdikt

**Po opravách.** Nic blokujícího: žádná věcná chyba, citáty sedí na pramen, nic nehodnotí názor a všechny tři prvky fungují bez JavaScriptu, klávesnicí i na telefonu. Čtyři nálezy jsou důležité. Dva jdou proti zásadě „nejdřív student, pak filozof“ nebo proti smyslu prvku (Slož argument ukáže místo k napadení dřív, než se student rozhodne; Kdo žil dřív? na medailoncích má skoro všude stejnou odpověď), dva mění, co student vidí na první obrazovce nebo jako první dvojici.

## Nálezy

### [důležité] Slož argument ukáže odpověď dřív, než se student rozhodne
- **Kde:** `src/components/ostrovy/SlozArgument.svelte` (pořadí po Zkontrolovat), `cesta8-argument` v cestě 8, krok 3, i ukázka v dílně `dilna-sokrates-zemre`. Snímek `Claude outputs/r-sloz-argument-po-kontrole.jpg`.
- **Co je špatně:** po jedné kontrole se najednou ukáže zpětná vazba, skrytý předpoklad i oddíl „Kde se dá argument napadnout“ a řádek místa k napadení dostane silnější okraj. Až pod tím se blok ptá „Kterou premisu bys napadl ty?“. Zpětná vazba navíc končí otázkou „Přidal bys k argumentu větu, kterou k tomu potřebuje?“, a ta věta stojí o řádek výš v řádku s otazníkem (v dílně stejně: „Co ten skok drží?“).
- **Proč to vadí studentovi:** volba je názor do deníku, ale student ji dělá až poté, co mu blok řekl, kam míří ti, kdo argument napadli; zvolí to, co je zvýrazněné. Otázka, na kterou hned pod ní odpovídá text, je přesně ten vzor, který `atlas-psani` zakazuje („otázka, kterou si text hned sám zodpoví“). Tím blok ztrácí to, kvůli čemu ho plán postavil: dát smysl i tomu, kdo pořadí uhádne.
- **Oprava:** dvě zastavení místo jednoho, bez druhého pokusu o složení.
  1. Po Zkontrolovat jen titulek „Tvůj závěr…“ a `zpetna` (otázka na konci teď opravdu čeká na studenta). Řádek s otazníkem zůstane „Jedna věta tu chybí.“ a pod zpětnou vazbou je tlačítko **Ukázat chybějící větu**. Stav „složeno, předpoklad skrytý“ se ukládá jako dnes (vydrží obnovení).
  2. Tlačítko odkryje řádek s otazníkem a oddíl Skrytý předpoklad; pod ním volba „Kterou premisu bys napadl ty?“. Řádek místa k napadení zatím nemá silnější okraj.
  3. Po Tohle bych napadl zpětná vazba k volbě (`kdyzNapadnes` / `zadnou`) a pod ní teprve oddíl **Kde se dá argument napadnout** (`napadnout.proc`) a zvýraznění řádku.
  Texty YAML se nemění. Podoby na plátně: „jen otázka a možnosti“ ukáže karty, řádky a volbu bez oddílu Kde se dá napadnout. Zápis do `docs/design.md` › Slož argument, testy `sloz-argument.spec.ts`, `cesta8.spec.ts`, `hodina-podoby.spec.ts`, `pruchod.spec.ts` a skripty `slova-cesta.mjs`, `snimky-cesta.mjs` (nové tlačítko).

### [důležité] Kdo žil dřív? na medailoncích má skoro všude odpověď „Žili ve stejné době“
- **Kde:** `druhyKdoZilDriv` v `src/lib/dvojice.ts`; výpis v Po K2.
- **Co je špatně:** pravidlo bere nejbližší známou osobu podle poloviny života, a ta s osobou medailonku skoro vždy žila. U 28 z 34 medailonků je správně „Žili ve stejné době“ (dělí je jen Thalés a Anaximandros od Hérakleita, Cicero od Seneky, Hypatia od Marca Aurelia, Plótínos od Marca Aurelia a Karneadés od Epikúra). Prótagorás je druhým člověkem sedmkrát, Platón pětkrát, Diogenés, Epikúros a Hérakleitos čtyřikrát.
- **Proč to vadí studentovi:** kdo projde dva tři medailonky, pochopí, že odpověď je vždycky prostřední karta, a dál neodhaduje nic. Stejná otázka s Prótagorou za sebou zní jako chyba stránky.
- **Oprava:** pravidlo zůstane pevné, změní se, koho bere. Osoba s profilem nebo portrétem bez vztahu, jejíž život se s osobou stránky **nepřekrývá**, nejbližší podle poloviny života; každá známá osoba nejvýš na třech medailoncích (přiděluje se v pořadí `lide.yaml`, přeskočí se plná). Kdo takovou osobu nemá, dostane tu dnešní. Odpověď pak je A, nebo B, a odkrytí řekne „Dělí je…“, což je to, co se student z bloku má dozvědět. Změní se id bloků (`kdo-<osoba>-<druhý>-poradi`) a s nimi zastavení v katalogu; uložené hodiny žádné medailonky zatím nemají (katalog je nese od K2, větev není na GitHubu). Po změně `VYPIS=1 npx vitest run tests/data/dvojice.test.ts` a `dva-zivoty.spec.ts`.

### [důležité] Poslední kroky probliknou celé, než se sbalí
- **Kde:** `Strany.svelte` (`client:load`); cesty 2, 7, 33 a 34 začínají krok oddílem se zastánci, cesta 8 má první oddíl hned pod úvodním odstavcem. Po K1 to popsal jen u cesty 2.
- **Co je špatně:** sestavená stránka je celá a ostrov ji přeskládá až po hydrataci. Kdo má zápis, vidí na první obrazovce všechny odpovědi a pak text uskočí o stovky pixelů nahoru (u cesty 7 se oddíl na telefonu zkrátí z 2750 na 1539 px).
- **Proč to vadí studentovi:** na veřejném webu z telefonu je hydratace pomalejší než v náhledu na Macu; student začne číst odstavec, který mu pod rukama zmizí do „Kdo hájil jiné odpovědi“. Týká se všech pěti cest, ne jedné.
- **Oprava:** skript hned za obalem oddílu (`<script is:inline>` v `Strany.astro`, jako hlavní tlačítko na Domů) přečte odpověď z deníku a ostatní odpovědi skryje ještě před vykreslením (třída na obalu, `display: none` u cizích `[data-odpoved]`); ostrov po hydrataci doplní štítek a sbalenou část a třídu sundá. Pravidlo, co je odpověď studenta, zůstane jedno: skript dostane z obalu kódy a druh bloku jako JSON a volá tutéž funkci (vložit ji do stránky jako text z `src/lib/strany.ts`, ne opisovat). Bez JavaScriptu a bez zápisu se nic nemění; kotvy zůstávají. Test: se zápisem nesmí být cizí odpověď vidět v prvním snímku po načtení (`page.goto` s `waitUntil: 'commit'` a snímek).

### [důležité] Dva životy: výchozí dvojice, která nic neříká
- **Kde:** `vychoziDvojice` v `src/lib/dvojice.ts`; 21 ze 46 stránek osob nemá v datech učitele ani žáka a dostane „současníka“ (`VYPIS=1 npx vitest run tests/data/dvojice.test.ts`), mezi nimi Seneca, Cicero, Hypatia a Epikúros. Část dvojic dobrá je (Marcus Aurelius → Epiktétos, Plútarchos → Epiktétos).
- **Co je špatně:** kdo nemá v datech učitele ani žáka, dostane nejbližšího současníka s vlastní stránkou podle poloviny života, i když ho s ním nic nespojuje: Seneca → Filón Alexandrijský, Cicero → Filón („Dělí je asi 28 let“, tedy ani současník), Démokritos ↔ Aristofanés, Pyrrhón → Hipparchia.
- **Proč to vadí studentovi:** Dva životy je první obrázek v Době a lidech; dvojice bez důvodu působí jako náhoda a u Seneky, jedné z nejčtenějších stránek, je to člověk, o kterém se v atlasu nic nedozví.
- **Oprava:** za učitele a žáka přidat do pravidla vztah `vliv-textem`: nejdřív koho osoba četla, pak kdo četl ji, z lidí s vlastní stránkou ten nejbližší v čase; teprve potom nejbližšího současníka jako dnes. Podle `vztahy.yaml` tak Hypatia dostane Plótína a Epikúros Démokrita; Cicero a Seneca někoho, koho četli (u Cicerona Platón, u Seneky ze čtyř přečtených s vlastní stránkou ten nejbližší, kterého ukáže výpis). Výsledek ověřit výpisem a dvojice, které i pak nic neříkají, vypsat v Po O.

### [drobné] Věta o lidských životech zaokrouhluje hrubě
- **Kde:** `vzdalenost()` v `src/lib/cas-mapy.ts` (Mapa a čas, Kdo žil dřív?, Dva životy).
- **Co je špatně:** počet životů se zaokrouhluje na celé po 75 letech: 56 let je „asi jeden lidský život“ (Karneadés a Epikúros), 100 let taky, 113 let už „asi dva“.
- **Proč to vadí studentovi:** šestnáctiletý ví, že 56 let není celý život; věta, která má čas zhmotnit, tu přehání.
- **Oprava:** do 50 let bez přirovnání; 50–74 let „To je skoro jeden lidský život.“; dál podle podílu n / 75 = k + zbytek: zbytek pod čtvrt „To je asi k …“ (pro 2–4 „To jsou asi …“), čtvrt až tři čtvrtě „To je víc než k …“, nad tři čtvrtě „To je skoro k + 1 …“. Příklady: 56 → skoro jeden lidský život, 100 → víc než jeden lidský život, 190 → víc než dva lidské životy, 453 → asi šest lidských životů (test Mapy se nemění), 519 → skoro sedm lidských životů. Test v `tests/data/cas-mapy.test.ts` na každou větev.

### [drobné] Krok 3 cesty 8 chce námitku napsat dvakrát za sebou
- **Kde:** `cesta8-argument` (pole „Proč právě tahle?“) a hned pod textem Odkryj „Co bys Epikúrovi namítl? Napiš jednu větu.“
- **Co je špatně:** student vybere premisu a nepovinně napíše proč; o pár odstavců níž píše námitku znovu a třídí ji do košů.
- **Proč to vadí studentovi:** druhé pole na totéž působí jako opakovaný úkol; unavený student jedno z nich přeskočí, nejspíš Odkryj, které nese koše a navázání na kroky 4 až 7.
- **Oprava:** nepovinné `bezDuvodu: true` ve schématu Slož argument (jako u Volby) a v `cesta8-argument`; do deníku jde jen zvolená věta. V dílně pole zůstane. Text kroku se nemění.

### [drobné] Opakování „po smrti nikdo nevnímá“ v kroku 3 a obraz mrtvého těla
- **Kde:** `cesta8-argument` › `karty.ztrata.kdyzNapadnes`; `3-netyka-se-nas.mdx`, odstavec za citátem 125.
- **Co je špatně:** kdo blok projde a napadne druhou premisu, čte skoro totéž dvakrát za sebou („tělo přece cítit přestane“ v oddílu Skrytý předpoklad, „Že mrtvé tělo nevnímá, uzná skoro každý“ ve zpětné vazbě). V textu pod blokem zazní konec vnímání v řádku, v odstavci „Nezbude nikdo, kdo by cokoli zakoušel“, v citátu 125 a hned potom znovu „nebude tu nikdo, kdo by ji zakoušel“.
- **Proč to vadí studentovi:** opakování v jednom kroku čte student jako přešlap; „mrtvé tělo“ je pro studenta, kterému někdo nedávno zemřel, obraz konkrétního člověka, a blok ho nepotřebuje.
- **Oprava:**
  - `ztrata.kdyzNapadnes`: „Míříš na druhý důvod, a ten skoro nikdo nepopírá. Spor je spíš o tom, kolik smrt bere: jestli jen to, co cítí tělo, nebo všechno. Napadáš opravdu tuhle větu, nebo tu, která v argumentu chybí?“
  - Krok 3 za citátem 125: „Pozor na jedno slovo. Epikúros neříká, že smrt nic není. Říká, že se netýká nás.“ (dvojtečka a „nebude tu nikdo, kdo by ji zakoušel“ pryč; citát těsně nad tím to říká). Souměrná věta „dobré ani zlé“ v prvním odstavci zůstává.

### [drobné] „Zkusit znovu“ ve Slož argument, „Začít znovu“ jinde
- **Kde:** `SlozArgument.svelte`.
- **Co je špatně:** tlačítko dělá totéž co v ostatních blocích (smaže stav i zápis), jen se jinak jmenuje.
- **Proč to vadí studentovi:** „Zkusit znovu“ po kontrole zní jako druhý pokus u zkoušky; K3 sám zdůvodnil jednu kontrolu tím, že blok nemá zkoušet. Učitel v přípravě hodiny vidí dvě jména pro totéž.
- **Oprava:** „Začít znovu“ (komponenta, `docs/design.md`, testy `sloz-argument.spec.ts` a `cesta8.spec.ts`).

### [drobné] Dva životy: popisek obrázku není jeho poslední částí
- **Kde:** `DvaZivoty.svelte`: po hydrataci stojí nabídka Druhý život v `<figure>` za `<figcaption>`.
- **Co je špatně:** `figcaption` má být první, nebo poslední potomek `figure`; některé čtečky pak čtou popisek jako součást obrázku a nabídku za ním jako jeho pokračování. Nabídka sama je v pořádku: nativní `select` s popiskem „Druhý život“, výběr napsáním jména, věta v `aria-live`.
- **Proč to vadí studentovi:** student se čtečkou slyší větu o vzdálenosti jako popis obrázku a hned za ní nabídku bez hranice.
- **Oprava:** nabídku přesunout za `</figure>` do společného obalu s `id` (kotva a testy hledají `#dva-zivoty`), věta zůstane `figcaption` s `aria-live`.

## Co jsem prošel a v pořádku

- **Kdo je na tvé straně, každý oddíl a každá odpověď.** Úvodní věty se čtou nad sbalenou i rozbalenou částí („I tady se zastánci dělí podobně.“ a „O člověku se rozcházeli stejně.“ navazují na předchozí oddíl, který je vždy vidět). Jako první odstavec stojí sama každá odpověď kromě jedné v cestě 2 (opraveno, viz níž). Krátké odpovědi („Jestli si to promyslíš a pustíš z hlavy, máš Seneku.“) jsou holé, ale srozumitelné; senátor D v cestě 33 zastánce nemá („máš pravdu, že z jedné historky…“) a nový psát by znamenalo tvrzení bez podkladu: nechávám. Štítek „Na tvé straně“ je srozumitelný a ladí s názvem kroku; nechávám ho.
- **Cesta 8 jako tři oddíly k jedné Volbě:** nechat. Oddíly jsou podle témat a jejich text (ti druzí, víra v posmrtný život) se týká všech; jeden oddíl by sbalil i to, co má číst každý, a vzal by kroku kotvy.
- **Slož argument proti prameni a krokům 4 až 6:** karty sedí na Dopis Menoikeovi 124, skrytý předpoklad na Dopis Hérodotovi 65–66 (podklady celku 6, doplněk T2). Žádná zpětná vazba nepředbíhá námitky z kroků 4 až 6: `napadnout.proc` říká, na kterou větu se dá mířit, a jako případ nabízí něco zlého, o čem se člověk nedozví, ne asymetrii zrcadla (krok 4) ani ztrátu dobrého života (kroky 5 a 6). Očima studenta, kterému někdo zemřel, a studenta s myšlenkami na smrt: konec vnímání je souměrný („dobré ani zlé“), nic neslibuje, že to nebude bolet, a Odkryj v témže kroku říká, že věta o těch, kdo zůstanou, nemluví. Výjimka je „mrtvé tělo“ (nález výš).
- **Blok na 390 a 1440 px, klávesnicí, dotykem a na plátně:** drží testy K3 a T2 (`sloz-argument.spec.ts`, `cesta8.spec.ts`, `hodina-podoby.spec.ts`), které v celém `npm test` prošly; snímek po kontrole bez přetečení v obou režimech.
- **Čas na štítcích:** na štítek patří čas studenta, který bloky prochází, tedy viditelný text po odpovědích, jak ho počítá `slova-cesta.mjs`; kdo bloky přeskočí, čte víc, ale nic neovládá. Štítek = výsledek zaokrouhlený na minuty (opraveno, viz níž).
- **Kontrola typů:** `kontroly.yml` pouští `npx astro check` jako samostatný krok za `npx vitest run`, `npm test` na začátku; obsah je stejný, liší se jen pořadí. Jestli kontroly na GitHubu projdou, ukáže až push při uzavření (Po K0).

## Co jsem rovnou opravil

- **„To je asi tři lidské životy“** → „To jsou asi tři lidské životy“ (`vzdalenost()` pro dva až čtyři životy; Hypatia a Marcus Aurelius na medailonku, Mapa a čas), s testem v `tests/data/cas-mapy.test.ts`.
- **Cesta 2, krok 8, odpověď B** stála sama bez opory („druhá strana toho sporu“ odkazovala na odstavec A, který může být sbalený): „stojí za tebou druhá strana sporu, o kterém vypráví Plútarchos, a úvaha o oblázcích“; test v `cesta2.spec.ts`.
- **Scéna bloku `cesta8-argument`** se četla jako tři věty, dva důvody a ještě závěr: „Epikúrova rada má tři věty: dva důvody a to, co z nich plyne. Tady leží rozházené.“
- **Štítky času** podle `slova-cesta.mjs` (31. 10. 2026): cesta 2 35 → 34 min (33,5), cesta 7 30 → 28 (28,1), cesta 33 29 → 28 (27,8); cesta 8 35 (34,7) a cesta 34 28 (27,7) sedí.
- **`kontroly.yml`:** zastaralá poznámka „Web se nenasazuje (zatím běží jen lokálně)“ → web nasazuje `pages.yml`.
