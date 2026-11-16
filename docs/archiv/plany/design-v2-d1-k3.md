# Větev design-v2: provedená zadání D2 až K3 a D5, zodpovězené otázky

Přesunuto z `docs/archiv/plany/design-v2.md` v kroku K3 dodatek (13. 11. 2026) beze změny textu, aby se plán větve četl levněji. Oddíly Po D2 až Po D5 a otevřené otázky zůstaly v plánu.

## Co rozhodnout před D2

Prázdná odpověď znamená souhlas s doporučením.

1. **Jedna větev až do konce s kontrolními snímky po K3, K5 a K7?** Doporučuji ano.
   Odpověď:

2. **Přechody mezi stránkami nativně v prohlížeči, bez routeru Astra?** Doporučuji ano.
   Odpověď:

3. **Bez další knihovny animací (jen CSS a Svelte)?** Doporučuji ano.
   Odpověď:

4. **Pojmy ručně, jen první výskyt na stránce, první vlna asi 25 pojmů z antiky?** Doporučuji ano.
   Odpověď:

5. **Razítko v deníku po dokončené cestě?** Doporučuji ano.
   Odpověď:

6. **Plugin Design pro revizi:** přidáš ho? Bez odpovědi revize proběhne bez něj.
   Odpověď:

## Zadání D2: design systém na plátně

Opus 5.5 · high. Pusť v novém chatu v Projektu Atlas filozofie, až vyplníš odpovědi (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok D2 větve design-v2, design systém na plátně. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Vzhled: Spojení, Pohyb, Co rozhodnout před D2 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. V docs/design.md jen Principy, Barvy, Typografie, Mezery, mřížka, tvary a Komponenty. Načti skill frontend-design. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti moje komentáře a soubory project/Spojeni.dc.html a project/Spojeni-telefon.dc.html.

1. Na plátno přidej stránku Design systém: tokeny jako vzorník (papír a plochy, stíny vystouplé a vtlačené, inkousty, pigmenty osmi období s páskou a razítkem, písma a jejich role se stupnicí velikostí, zaoblení, mezery) a knihovnu prvků ve všech stavech (klid, najetí, stisk, zvoleno, zakázáno, fokus z klávesnice): tlačítka, lístek cesty, štítek otázky, karta, pole pro text, možnost Volby, citát s páskou, deska s fotkou, titulek s pruhem, razítko, Proč kalich, pojem na okraji a lístek pojmu. Všechno ve světlém i tmavém režimu (noční zápisník).

2. Kontrast AA všech textů a hranic ovládání ověř výpočtem (krátký skript v scripts/, po výpisu ho smaž), ne odhadem.

3. Do plánu větve zapiš oddíl Po D2: tokeny jako tabulky (světlý a tmavý), výsledek kontroly kontrastu, nad čím jsi váhal a co by šlo jinak, otázky Co rozhodnout po D2 a zadání D3 v plném znění. docs/design.md nepřepisuj (to udělá krok O). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

4. Pak se zastav a napiš mi, na co se mám na plátně podívat.
```

## Co rozhodnout po D2

Prázdná odpověď znamená souhlas s doporučením.

1. **Štítek otázky vtlačený, i když je to odkaz** (výjimka z pravidla, jak je ve Spojení)? Doporučuji ano.
   Odpověď:

2. **Noční zápisník v teplé tmě, list jen o stupeň světlejší, pruh a páska stejné ve dne i v noci, fotka v noci ztlumená?** Doporučuji ano.
   Odpověď:

3. **Popisky malými písmeny místo verzálkových nadtitulků v celém atlasu?** Doporučuji ano.
   Odpověď:

4. **Zakázané prvky zploštělé s čárkovaným okrajem tužkou?** Doporučuji ano.
   Odpověď:

5. **Tinty období nahradit listem s páskou** (zpětná vazba Volby, Zkus to žít, karta týdne)? Doporučuji ano; D4 to ukáže na obrazovkách, než se rozhodne v kódu.
   Odpověď:

6. **Chceš něco změnit v barvách, stínech nebo písmu?** Napiš co a kde (třeba „páska světlejší“, „noc modřejší“, „pruh menší“). Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání D3: pohyb na plátně

Opus 5.5 · high. Pusť v novém chatu v Projektu Atlas filozofie, až vyplníš odpovědi po D2 (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok D3 větve design-v2, pohyb na plátně. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Pohyb, Po D2 a Co rozhodnout po D2 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti. Načti skill frontend-design. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti moje komentáře, project/canvas.json a z project/DesignSystem.dc.html jen <helmet> se styly (tokeny a prvky, ze kterých ukázky postavíš). Když odpovědi po D2 něco mění, oprav nejdřív design systém na plátně.

1. Na plátno přidej stránku Pohyb (den i noční zápisník jako u design systému): každý řádek katalogu z oddílu Pohyb jako živá ukázka, kterou spustí student (tlačítko Přehrát nebo opravdový čin: klepnutí, volba, odkrytí): přechod mezi stránkami jako list v deníku a fotka z karty v Lidech, která přeletí na desku profilu; další krok cesty doleva a zpátky doprava; příchod na profil (páska se jednou přilepí, titulek a pruh se usadí); najetí a stisk tlačítka, lístku a karty; Volba (vtlačení, tužka dokreslí kroužek, zpětná vazba se rozloží jako lístek); Odkryj (odklopení přeloženého papíru); Roztřiď (karta přeletí do koše); Spor (mince po škále); pojem (lístek se rozbalí ze slova, poznámka na okraji se zvýrazní); razítko v deníku po dokončené cestě; body lidí v Mapě a čase s rokem. U každé ukázky přepínač Omezený pohyb, který ukáže její klidový stav.

2. Tokeny pohybu: pojmenované délky a křivky (odezva na stisk asi 120 ms, rozložení lístku a odkrytí 200 až 300 ms, přechod mezi stránkami 350 až 450 ms, kamera mapy 600 ms) a u každé ukázky, které tokeny používá. Jen transform a opacity; stín najetí přes pseudoprvek, kterému se mění průhlednost, ne přechodem box-shadow. Nic se nehýbe samo kromě jednoho okamžiku při příchodu na stránku a kreseb.

3. Do plánu větve zapiš oddíl Po D3: tokeny pohybu jako tabulka, pravidla pohybu (kdy ano, kdy ne, omezený pohyb, Firefox bez přechodů mezi stránkami), nad čím jsi váhal a co by šlo jinak, otázky Co rozhodnout po D3 a zadání D4 v plném znění. docs/design.md nepřepisuj (to udělá krok O). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

4. Pak se zastav a napiš mi, na co se mám na plátně podívat.
```

## Co rozhodnout po D3

Prázdná odpověď znamená souhlas s doporučením. Autor 8. 11. 2026: k otázce 4 komentář na plátně, zbytek „může být“.

1. **Stránka se otočí jako list v deníku** (kolem levé hrany), fotka přeletí na desku? Doporučuji ano; když se ti otočení na telefonu nebude líbit, zbude položení listu shora.
   Odpověď: může být.

2. **Kroužek tužkou jako jediná výjimka z `transform` a `opacity`** (spolu s kresbami)? Doporučuji ano.
   Odpověď: může být.

3. **Příchod na profil jen při nové návštěvě, celé do 480 ms**, a nikde jinde nic samo? Doporučuji ano.
   Odpověď: může být.

4. **Pás období jako jeden pruh bez hranic** (podle tvého komentáře), ve dne i v noci stejný, na Domů a v Mapě a čase? Doporučuji ano; D4 ho ukáže na obrazovkách.
   Odpověď (komentář na plátně): „Toto se mi moc nelíbí, udělej to třeba jako ty oddělení u cesty a počtu kroků, kde to je jak odtrhávací lístek, a každá část bude mít svou barvu.“ Provedeno v design systému (viz Po D3).

5. **Chceš něco změnit v pohybu?** Napiš kterou ukázku a co (třeba „list rychleji“, „mince bez otáčení“, „razítko víc dopadne“). Bez odpovědi zůstává, jak je.
   Odpověď: může být; k ukázce Mapa a čas komentář na plátně („chybí ta mapa samotná“), mapa doplněna.

## Zadání D4: obrazovky na plátně

Opus 5.5 · high. Pusť v novém chatu v Projektu Atlas filozofie, až vyplníš odpovědi po D3 (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok D4 větve design-v2, obrazovky na plátně. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Vzhled: Spojení, Po D2 (jen Nad čím jsem váhal), Po D3, Co rozhodnout po D2 a Co rozhodnout po D3 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti. Načti skill frontend-design. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti moje komentáře, project/canvas.json, z project/DesignSystem.dc.html a project/Pohyb.dc.html jen <helmet> se styly a z project/Spojeni.dc.html a project/Spojeni-telefon.dc.html, co potřebuješ ke skladbě profilu a kroku cesty. Obsah obrazovek ber ze skutečných stránek atlasu (src/content, src/data), jen části, které obrazovka ukazuje. Když odpovědi po D3 nebo komentáře něco mění, oprav nejdřív design systém nebo stránku Pohyb na plátně.

1. Na plátno přidej obrazovky, každou na notebooku (1440) i telefonu (390), ve dne i v nočním zápisníku, postavené jen z tokenů a prvků design systému: Domů (s pásem období jako odtrhávacími lístky), Mapa a čas (podklad mapy, karta člověka, posuvník, body lidí), profil Sókrata (celá hlavička, kapitola, citát, Doba a lidé, Kam dál), krok cesty s Volbou a zpětnou vazbou, stránka velké otázky s osou hlasů, stránka období v jiné barvě (Helenismus a Řím), Můj deník s razítkem a jedna kresba v novém papíru. Pohyb, který na obrazovce je (přechod, příchod, volba), ať jde spustit jako na stránce Pohyb, s Omezeným pohybem. Tinty období nahraď listem s páskou, kde to obrazovka potřebuje (otázka 5 po D2), a ukaž, jestli stránka období nebo Domů potřebuje větší display než jmeno 104 px.

2. Kontrast nových dvojic barev ověř výpočtem (krátký skript v scripts/, po výpisu ho smaž). Telefon: dotykové cíle aspoň 44 × 44, nic nepřetéká do stran.

3. Do plánu větve zapiš oddíl Po D4: co je na kterých obrazovkách, co se proti design systému změnilo, nad čím jsi váhal a co by šlo jinak, otázky Co rozhodnout po D4 (mezi nimi schválení návrhu jako brána před kódem) a zadání K1 v plném znění. docs/design.md nepřepisuj (to udělá krok O). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

4. Pak se zastav a napiš mi, na co se mám na plátně podívat.
```

## Zadání K1: základ v kódu

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po D4 a schválíš bránu (otázka 9).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K1 větve design-v2, základ nového vzhledu v kódu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co se proti design systému změnilo) a Co rozhodnout po D4 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. Když otázka 9 (brána) nemá „ano“, zastav se a napiš mi to. docs/design.md nečti celý, jen nadpisy a oddíl o tokenech. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/DesignSystem.dc.html a project/Domu.dc.html jen <helmet> se styly: to je zdroj hodnot tokenů (den a noc), stínů, pásky, razítka, titulku s pruhem, razítka člověka a tokenů pohybu. Když odpovědi po D4 něco mění, oprav nejdřív plátno.

1. src/styles/tokens.css: nové tokeny papíru, ploch, inkoustů a tužky pro den a noční zápisník (noc přes dnešní přepínač režimu i prefers-color-scheme, jak to atlas dělá teď), osm období (--p a papír pruhu --pp, v noci zesvětlené inkousty), stíny (--vyst, --vyst-m, --zved, --vtla, --vtla-mele, --vtla-hl, --vyst-ink, --zved-ink, --vtla-ink, --lezi, --lezi-zved, --lezi-tlak, --odlep), páska (--paska-a, --paska-b), filtr fotky (--foto), stupnice písma z D2 (jméno 104 px, na telefonu 56 px, text 21 a 18 px), zaoblení a mezery z D2, tokeny pohybu (--d-stisk až --d-kamera, --z-prichod, --k-stisk, --k-papir, --k-list, --k-dopad). Dnešní jména tokenů, která komponenty používají, nech jako přezdívky na nové hodnoty, aby se nic nerozbilo (barvy i --pohyb-rychle = --d-stisk, --pohyb = --d-listek, --pohyb-kamera = --d-kamera); co přezdívka nepokryje, zapiš do plánu jako práci pro K2 až K7.

2. src/styles/global.css: tečkovaný papír jen v CSS (radial-gradient), vytržený okraj (clip-path), třídy pro list, pásku, razítko místa, titulek s pruhem, razítko člověka (atribut v kruhu podle Po D4), lístek s páskou místo tint období, vrstvy stínu pro najetí a stisk bez přechodu box-shadow (::before a ::after, mění se jen opacity a transform), pravidlo zakázaného prvku (zploštělé s čárkovaným okrajem tužkou), viditelný fokus, a omezený pohyb (prefers-reduced-motion: žádný přechod ani animace, stav hned na konci). Klíčové snímky rozložení lístku (rotateX) a dopadu razítka.

3. Písma: Kalam lokálně (@fontsource/kalam, podmnožiny latin a latin-ext, řezy 400 a 700) vedle Newsreaderu a Instrument Sans; ověř, že se načtou česká písmena. Nic z externích serverů za běhu.

4. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro testy rozvržení a snímků, které se tokeny změní), node scripts/snimky-listy.mjs na Domů, profil Sókrata a krok cesty 1/2 na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž). Snímky, které se mění kvůli novému vzhledu, aktualizuj a v plánu napiš které. Restartuj náhled npm run dev.

5. Do plánu větve zapiš oddíl Po K1: co je v tokens.css a global.css, které přezdívky zůstaly a pro který krok, co se na webu změnilo už teď a co čeká na K2 až K7, nad čím jsi váhal, otázky Co rozhodnout po K1 a zadání K2 v plném znění. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

6. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Co rozhodnout po K1

Prázdná odpověď znamená souhlas s doporučením.

1. **Razítko místa s průhledností 0,96** místo 0,92 z plátna, aby text razítka měl ve všech obdobích aspoň 4,5 : 1? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

2. **Okraj stránky 48 px na notebooku už teď** (obsah je širší než dřív, ještě před novou hlavičkou)? Doporučuji ano.
   Odpověď: (prázdná, souhlas s doporučením)

3. **Chceš něco změnit na snímcích po K1** (papír, barvy, velikost písma)? Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď: (prázdná, souhlas s doporučením)

## Zadání K2: rám webu

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K1 (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K2 větve design-v2, rám webu v novém vzhledu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Po D3 (Pravidla pohybu), Po D4 (Co se proti design systému změnilo: Navigace a logo), Co rozhodnout po D4 (otázka 11, Agora), Po K1 a Co rozhodnout po K1 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a oddíl Navigace a rozvržení. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/Domu.dc.html v <helmet> jen část „rám: hlavička, drobečky, spodní lišta“ a @container pro telefon, z těla jen hlavičku, drobečky a spodní lištu, a z project/Pohyb.dc.html jen styly a skript ukázky „mezi stránkami“. Když odpovědi po K1 něco mění, oprav nejdřív tokens.css nebo global.css.

1. Hlavička na notebooku: logo Agora jako koláž pěti vytržených písmen (velké A v papíru období stránky přes --pp a --na-pp, na stránkách bez období v inkoustu; po najetí se písmena srovnají do řady, --d-stisk; odkaz s popiskem „Agora, domů“, jednotlivá písmena čtečka nečte), navigace jako ploché odkazy s vtlačenou aktivní položkou (--vtla), hledání ve vtlačené drážce, Můj deník vystouplý (.vystouple .vystouple--m) a přepínač režimu jako malé vystouplé tlačítko. Drobečky v --ink-3. Telefon: horní lišta se Zpět, hledáním ikonou a přepínačem, spodní lišta s vtlačenou aktivní položkou a stínem --lista-stin. Lišta hodiny a promítání musí fungovat dál. Stránka 404 na vytrženém listu s titulkem a pruhem bez období.

2. Název Agora podle odpovědi 11 po D4: záhlaví, titulek stránek v prohlížeči, popis pro sdílení, úvodní věta na Domů a README; repozitář, adresa webu a docs/ zůstávají. V textech pro studenty zůstává „atlas“ tam, kde mluví o tom, jak se v něm pohybovat (skill atlas-psani). Věty hlídají testy přesným zněním: najdi je v tests/ a uprav v témže commitu.

3. Přechody mezi stránkami podle Po D3 (Pravidla pohybu): @view-transition { navigation: auto }, typy dalsi a zpet z navigation.activation v pagereveal, list se otočí kolem levé hrany (--d-list, --k-list); při omezeném pohybu a ve Firefoxu se stránka přepne bez animace. Let fotky z karty na desku nech na K3.

4. Rám přepiš na nová jména tokenů (Po K1, tabulka přezdívek); co rám přestane používat, odškrtni v tabulce přezdívek v plánu.

5. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro prohlídku, fokus a lištu, hledání, noindex, odkazy, hodinu a promítání), node scripts/kontrola-fokus.mjs, klávesnicí na dvou výškách okna, a node scripts/snimky-listy.mjs na Domů, profil Sókrata, krok cesty 1/2, Mapa a čas a 404 na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Restartuj náhled npm run dev.

6. Do plánu větve zapiš oddíl Po K2: co se v rámu změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K2 a zadání K3 v plném znění. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

7. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Co rozhodnout po K2

Prázdná odpověď znamená souhlas s doporučením.

1. **Na telefonu bez Zpět jen logo**, bez krátkého titulku stránky v horní liště? Doporučuji ano.
   Odpověď: souhlasím (8. 11. 2026)

2. **Agora i v patičce a v záhlaví tisku přehledu hodiny?** Doporučuji ano.
   Odpověď: souhlasím (8. 11. 2026)

3. **Nová ikona v záložce prohlížeče:** velké A na útržku papíru v inkoustu místo glóbu (udělá ji K3 spolu s razítkem člověka)? Doporučuji ano.
   Odpověď: souhlasím (8. 11. 2026)

4. **Chceš něco změnit na snímcích po K2** (logo, hlavička, spodní lišta, 404, přechod)? Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď: „Co bych rád změnil je ten přechod. Jako základ se mi líbí, ale je to víc, že to působí jako prostě slide jako u prezentace než otočení listu. Je to možná moc rychlé a moc statické. Kdyby to šlo udělat víc jako otočení papírového listu, bylo by to super.“ Provedeno hned (8. 11. 2026, oddíl Přechod po připomínce).

### Přechod po připomínce (8. 11. 2026)

- **První pokus** (po první připomínce, že přechod působí jako slide a je rychlý a statický): celá stránka se otáčela kolem levé hrany od čtenáře ke hřbetu, pomaleji, se zvednutím, prohnutím, ztmavnutím a stínem. Autor: „Za mě to je pořád jak překlopení krychle než přetočení stránky. Zkus se kdyžtak podívat jestli nenajdeš nějaký plugin nebo skill který bys na to mohl použít.“
- **Plugin ani skill** na otáčení stránky v katalogu není (hledáno: animace, přechody stránek, page curl, view transitions); nejblíž je komunitní balík pro React a GSAP, který na statický web s nativními přechody nesedí.
- **Proč krychle:** tuhá plocha otočená v perspektivě je vždycky deska nebo stěna krychle, ať se otáčí kamkoli. Papír se ohýbá.
- **Teď: ohyb listu.** Od pravého dolního rohu se zvedne cíp (spodek ohybu jde napřed, hrana je šikmá), ohyb přejede zprava doleva ke hřbetu a zahnutý kus listu ukazuje rub papíru (o stupeň tmavší než list, užší než odhalená část, protože je papír prohnutý). Rub vrhá stín na obě strany ohybu. Pod listem se odkrývá nová stránka. Návrat v historii přehraje totéž pozpátku: list se odvine od hřbetu zpátky přes stránku. Trvá 900 ms (`--d-otoceni`) s vyrovnanou rychlostí, aby byl ohyb vidět celou dobu.
- **Technika:** stará stránka se v přechodu ořízne podél ohybové hrany (`clip-path`, 17 klíčových snímků spočítaných podle křivky času) a rub je prvek `.otoceni-ohyb` v nové stránce s vlastním `view-transition-name`, takže leží nad oběma stránkami a pod hlavičkou a spodní lištou. Vidět je jen během přechodu (třída `otaci-se` na `<html>`).
- **Ověřeno** snímky v pěti okamžicích (150 až 750 ms) na 1440 px ve dne a na 390 px v noci (`Claude outputs/snimky/design-v2-k2/prechod-1440-light.jpg` a `prechod-390-dark.jpg`); test rámu hlídá typ přechodu a že rub po přechodu zmizí. Omezený pohyb a Firefox beze změny: stránka se přepne hned.

## Zadání K3: stránky osob

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K2 (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K3 větve design-v2, stránky osob v novém vzhledu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Po D3 (Pravidla pohybu), Po D4 (Co se proti design systému změnilo: poštovní razítko, záložky velkých otázek), Co rozhodnout po D4 (otázka 1), Po K1 (třídy papíru a přezdívky), Po K2 a Co rozhodnout po K2 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a v oddílu Komponenty části o hlavičce profilu, desce, minci, citátu, Době a lidech, Kam dál a obsahu profilu, a oddíl Atributy osobností. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/ProfilSokrates.dc.html v <helmet> jen části, které nejsou v tokens.css a global.css (hlavička profilu, deska, záložky, lístky cest, Proč kalich, kapitoly, citát, Doba a lidé, myšlenky, Zkus to žít, Kam dál, obsah profilu, razítko člověka) a @container pro telefon, z těla jen hlavičku profilu, jednu kapitolu, Dobu a lidi a Kam dál; z project/Pohyb.dc.html jen styly a skript ukázek „mezi stránkami“ (let fotky z karty na desku) a „příchod na profil“. Když odpovědi po K2 něco mění, oprav nejdřív rám (src/components/rozvrzeni/, src/layouts/Zakladni.astro) nebo tokens.css.

1. Hlavička profilu: jméno na vytrženém listu s pruhem v papíru období (.titulek, .titulek-pruh; Kalam 700 latin přednačíst, je na první obrazovce), razítko místa a času, deska s fotkou na listu se dvěma páskami a filtrem --foto místo duotónu --pc-plate, záložky velkých otázek místo štítků (papír období, po najetí se povytáhnou, na telefonu vyčnívají zleva pod sebou), lístky cest s pahýlem a Proč kalich. Na telefonu deska a první odstavec na první obrazovce i s pěti a více otázkami (test hlavičky).

2. Razítko člověka jako komponenta podle Po D4 (dva kruhy v inkoustu období, jméno a roky po obvodu, atribut uprostřed ze spritu public/ikony/atributy.svg, bez atributu razítkové vlnovky, filtr nedotištěného inkoustu, natočení podle id, pod 48 px bez obvodu; CSS .razitko-cloveka je hotové) místo Mince na stránkách osob: Doba a lidé, Kam dál, medailonky. Ostatní místa (Lidé, Mapa a čas, osa hlasů, karta týdne, hodina) nech na Minci, ať K6 a K7 přepnou jen import; zapiš je do plánu. Když jsem po K2 schválil novou ikonu záložky prohlížeče, udělej ji tady (velké A na útržku papíru v inkoustu, SVG).

3. Kapitoly, citát na listu s páskou, Doba a lidé (mini mapa a mini osa zůstanou do K7, nový je jen rám a razítka), Dvě velké myšlenky, Zkus to žít jako list s páskou, Kam dál jako ležící karty (.lezi-odkaz, připravované čárkované bez šipky), Prameny a obsah profilu (řádek odkazů a lišta Obsah) v novém papíru. Medailonek a společný profil (Kratés a Hipparchia) tytéž části. Stránky směru, období a tradice, které sdílejí HlavickaStranky a Kam dál, převezmou jen to, co se změní ve sdílených komponentách; zbytek je K6 a nic na nich nesmí spadnout.

4. Pohyb podle Po D3: příchod na profil (titulek, pruh a pásky po sobě, --d-prichod, --z-prichod) jen při nové návštěvě (pagereveal, typ navigace jiný než traverse) a let fotky z karty na desku (view-transition-name jen na kliknuté kartě a cílové desce, nastavené v pageswap a pagereveal a po přechodu odebrané; přechod listu z K2 v global.css zůstává). Klidový stav ukazuje konec pohybu; při omezeném pohybu a ve Firefoxu nic, stránka je hned celá.

5. Stránky osob přepiš na nová jména tokenů (Po K1, tabulka přezdívek); co přestanou používat (desky --pc-plate, --fs-display, --period-N, tinty u osob), odškrtni v tabulce přezdívek v plánu.

6. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro prohlídku, obsah, platon, seneca, aristoteles, celek7-profily, krates-hipparchia, medailonky, mini-mapa, doba-odkazy, obrazky-licence, otazka, ram), node scripts/kontrola-fokus.mjs na profilu, medailonku a společném profilu, klávesnicí na dvou výškách okna, a node scripts/snimky-listy.mjs na profilu Sókrata, Platóna, Kratéta a Hipparchie a jednom medailonku na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po K3: co se na stránkách osob změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K3 a zadání K4 v plném znění. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

8. Pak se zastav a napiš mi, na které snímky se mám podívat (kontrolní bod se snímky po K3).
```

## Zadání D5: herní prvky a vizuální zlepšení na plátně

Opus 5.5 · high se skillem `frontend-design`. Pusť v novém chatu v Projektu Atlas filozofie. Jedno až dvě sezení; když se nevejde do jednoho, zapiš do plánu, kde jsi skončil.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok D5 větve design-v2, herní prvky a vizuální zlepšení na plátně. Kód atlasu se v tomhle kroku nemění. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co se proti design systému změnilo), Po K3, Co rozhodnout po K3 s odpověďmi, Po auditu (Vizuální zlepšení, Pravidlo střídmosti, Mapa a deník: funkce) a toto zadání. Z docs/plany/po-auditu.md jen oddíly Zásada a Katalog aktivit. docs/design.md nečti. Načti skill frontend-design. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti moje komentáře, project/canvas.json, z project/DesignSystem.dc.html a project/Pohyb.dc.html jen <helmet> se styly a z project/KrokCesty.dc.html a project/ProfilSokrates.dc.html z těla jen jeden blok Volba, jednu kapitolu a hlavičku cesty. Obsah ukázek ber ze skutečných stránek atlasu (src/content, src/data), jen co ukázka potřebuje.

1. Na plátno přidej řadu „D5 Herna“ se stránkou Herní prvky (den i noční zápisník jako u design systému, notebook 1440 i telefon 390). Nejdřív společný rám aktivity: hlava (nadtitulek rodiny aktivit, název), zadání, plocha, zpětná vazba jako lístek, Začít znovu; na telefonu přes celou šířku jako jeviště, ovládání v dosahu palce (bod 11). Pak předmět pro každou rodinu aktivit (bod 2: Volba lístky ke štípnutí, Roztřiď kapsy a obálky, Spor dva přišpendlené lístky a mince na provázku, Seřaď na ose šňůra s kolíčky, Tipni si pravítko, Kdo to řekl? otočné kartičky, Doplň citát vystřižená slova, Porota hlasovací kotouček, Pravý, nebo podvržený? razítko, Najdi slabé místo červená tužka), každý se skutečným obsahem z antiky a ve všech stavech (klid, najetí, stisk, zvoleno, zakázáno, fokus). Herní pohyb jako živé ukázky s přepínačem Omezený pohyb: otočení karty, zamíchání, přichycení karty na osu a do koše, klepnutí do mapy, odhad posuvníkem a odhalení, razítko „sedí“ a lístek „zkus to jinak“ (bez červené a zelené; rozdíl nese tvar a slovo), panel příběhu v obrazech (čtyři až šest panelů koláže, student listuje). Přehrávač zvuku nenavrhuj, zvuk je odložený. Nové délky a křivky jen tam, kde žádný token z Po D3 nesedí.

2. Na plátno přidej stránku Zlepšení vzhledu s body 1 až 5 z Vizuálních zlepšení, každý jako před a po na skutečné stránce: (1) kapitola Sókrata na čistém listu vlepeném do zápisníku a aktivita na tečkovaném papíře mezi listy, k tomu tři varianty čtenářského sloupce (tečky, ztlumené tečky, čistý list); (2) viz krok 1; (3) studentova ruka: tři barvy pera k výběru, odpověď v poli a zvolená možnost jeho perem, kontrast výpočtem; (4) postup cesty jako lístek, do kterého každý krok štípne dírku, a pahýl, který se na konci odtrhne; (5) papírnictví osmi období: vzor pásky, ozdoba začátku kapitoly a styl razítka (antika meandr, středověk iniciála a zlatá linka, renesance síť perspektivy, osvícenství rytina z encyklopedie, 19. století novinový tisk, 20. století psací stroj, dnes čtverečkovaný papír). Drž Pravidlo střídmosti.

3. Kontrast nových dvojic barev výpočtem (krátký skript v scripts/, po výpisu ho smaž). Telefon: dotykové cíle aspoň 44 × 44, nic nepřetéká do stran.

4. Do plánu větve zapiš oddíl Po D5: co je na kterých stránkách plátna, nové tokeny (barvy pera, papírnictví období, případné délky pohybu), co se proti design systému změnilo, nad čím jsi váhal a co by šlo jinak, otázky Co rozhodnout po D5 (mezi nimi volba čtenářského sloupce a barev pera) a zadání K3 dodatek v plném znění (body 1, 7, 8 a 9 z Vizuálních zlepšení na stránkách osob; záložky otázek na telefonu za úvodní odstavec; jako první věc ověřit v opravdovém Chromu přechod listu a let fotky ze Sókrata na Platóna v Kam dál a opravit, když nefungují). docs/design.md nepřepisuj (to udělá krok O). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

5. Pak se zastav a napiš mi, na co se mám na plátně podívat.
```
