# Větev design-v2, část: zbylé bloky

Část plánu větve `docs/plany/design-v2.md` (oddíl Části plánu). Plán se 15. 11. 2026 rozdělil, aby každý soubor pro Projekt Claude měl pod 35 kB; text oddílů je beze změny.

## Zadání K4b: zbylé bloky

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K4a (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K4b větve design-v2, zbylé bloky ve společném rámu aktivity a jejich pohyb. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (poštovní razítko), Po K1 (přezdívky), Po auditu (bod 2 z Vizuálních zlepšení, Pravidlo střídmosti), Po D5, Po K4a a Co rozhodnout po K4a s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy, oddíl Bloky › Rám aktivity a u každého bloku popis vzhledu a stavů (ne příklady YAML). Načti skill atlas-komponenta. Vzor bloku v rámu je src/components/ostrovy/Volba.svelte (RamAktivity.svelte). Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti ze stránky Herní prvky (project/Herna.dc.html) jen styly a tělo předmětů pro Roztřiď a Spor a ukázky přichycení karty do kapsy, a z project/Pohyb.dc.html jen styly a skript ukázek Roztřiď a Spor. Když odpovědi po K4a něco mění, oprav nejdřív rám aktivity, Volbu nebo Odkryj (při odpovědi 6 b: lišta Obsah na telefonu až pod první odstavec úvodu profilu).

1. Bloky do společného rámu z K4a, jeden po druhém: každý ostrov postav na RamAktivity.svelte (hlava, zadání a plocha v children s data-cast, zpětná vazba ve snippetu vazba jako lístek s páskou místo .blok__zpetna s tintou, vlastní čin v hlavni, reset ve znovu, cerstve po činu studenta). Každá rodina jako svůj předmět podle D5 (bod 2): Roztřiď (papírové kapsy, karta se zvedne a zasune za čelo kapsy, --d-presun), Změň jednu věc, Spor (dva přišpendlené lístky a mince na prověšeném provázku po škále, mince v barvě pera), Slož argument, Kdo žil dřív? (odhad perem), Kdo je na tvé straně, Návrat, Závěr cesty, Moje stanovisko, první názor, Zkus to žít (tlačítko v ostrovu), Dva životy (společná léta místo tinty). Co student zvolí nebo napíše, je jeho perem (--pero, .blok__ruka). Příběh je čtení, ne aktivita: deska z K3 je nová, text Příběhu patří na čistý list (bod 1), ne do rámu. Pohyb podle Po D3 a D5; při omezeném pohybu je každý stav hned na konci a po obnovení stránky se nic nehýbe.

2. Razítko člověka v blocích: Svelte verze (src/components/ui/RazitkoCloveka.svelte nad src/lib/razitko.ts, stejné SVG a CSS .razitko-cloveka jako Astro verze, i s městem a rokem z K3 dodatku) místo mapa/Mince.svelte v BlokHlava, BlokFilozof, Spor a Kdo žil dřív?; pod 48 px bez obvodu. Ostatní místa s mincí nech pro K6 a K7a.

3. Bloky přepiš na nová jména tokenů (Po K1, tabulka přezdívek): --surface, --rule, --sunk, --muted, --pc-tint, --pc-soft, --pohyb…; co přestanou používat, odškrtni v tabulce přezdívek v plánu. Když .blok__zpetna a tinty období (--pc-tint, --period-N-tint) už nikdo nepoužívá, smaž .blok__zpetna z global.css a zapiš to; tinty smaže O.

4. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro bloky, ram-aktivity, pruchod, cesta, cesta2 až cesta8, cesta33, cesta34, sloz-argument, spor-reflexe, navrat, zaver, dva-zivoty, tyden, otazka, stranky-osob, prohlidka, hodina-podoby), node scripts/kontrola-fokus.mjs na kroku cesty 1/2, 1/5, 6/3 a 4/6 a na profilu Sókrata, klávesnicí na dvou výškách okna (pata na telefonu drží nad lištou), node scripts/snimky-cesta.mjs na cestě 1 a 6 (s odpověďmi i bez) a node scripts/snimky-prvek.mjs na každém bloku na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

5. Do plánu větve zapiš oddíl Po K4b: co se na blocích změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K4b a zadání K5 v plném znění (podle tabulky kroků: postup jako lístek, který se štípe, tichý Další krok, krátký přechod mezi kroky). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

6. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Po K4b (13. 11. 2026)

Odpovědi po K4a byly prázdné v repozitáři i v Projektu Claude, takže platí všech sedm doporučení. Jako první věc K4b udělal odpověď 6 b: **na telefonu stojí lišta Obsah až pod prvním odstavcem úvodu profilu.** Skript v `ListyProfilu.astro`, který už přesouval záložky otázek a popisek desky, dá první odstavec (i s „Proč kalich?“) do mělkých kopií obalů `.obsah` a `.uvod` před lištu; lišta zůstává sourozencem obsahu stránky, takže při čtení drží pod horní lištou až do konce. Na notebooku a u společného profilu (dvojice) se nic nemění. Kontrola fokusu na profilu Sókrata už nic nehlásí (tlačítko Obsah při načtení pod spodní lištou bylo otázkou 6). Snímky jsou v `Claude outputs/snimky/design-v2-k4b/`.

### Co se na blocích změnilo

Všechny bloky stojí ve společném rámu (`RamAktivity.svelte`): rodina aktivit s tečkou a razítky lidí v hlavě, zadání a plocha, zpětná vazba na lístku s páskou, který se po činu studenta rozloží, pata se Začít znovu vlevo a hlavním činem vpravo (na telefonu drží nad lištou). Zpětná vazba v tintě (`.blok__zpetna`) už nikde není a z `global.css` je smazaná.

- **Roztřiď** (předmět D5: kapsy). Koš je papírová kapsa: vtlačené ústí a před ním čelo s výřezem do V (`--plocha`, stín výstřižku), na čele název, popis a Dát sem. Karta navrchu je ležící lístek; po stisku se zvedne a dostane obrys perem. Karta, kterou student dá do kapsy (tažením, klepnutím kamkoli do kapsy, nebo Dát sem), přejede z místa, kde byla, za čelo kapsy a kus z ní kouká (`prelet()` v `src/lib/pohyb.ts`: jen `transform`, `--d-presun`, `--k-papir`; vrácená karta přejede zpátky navrch). Výsledek je na lístku s páskou, vlastní karty perem.
- **Spor** (předmět D5: dva přišpendlené lístky a mince na provázku). Postoje visí na špendlíku v papíru období. Škála je prověšený provázek s pěti uzlíky (cíle 44 px na křivce provázku) a po něm jezdí studentova mince „ty“ v barvě pera (`--d-presun`, jen po činu studenta; po obnovení stojí). Kde student začal, ukazuje čárkovaný kroužek perem, šipka odkud kam je čárkovaně perem nad provázkem. Argumenty leží na dvou listech s razítky (nenatočené: text delší než dvě věty), posun na lístku s páskou, reflexe pod ním; možnosti reflexe jsou vystouplé lístky s tečkou perem.
- **Změň jednu věc.** Možnosti jsou vystouplé lístky, zvolená vtlačená s tečkou perem; podmínky malé vystouplé čipy, zapnutý vtlačený. Změněná scéna leží na vloženém listu se štítkem rukou „jedna věc jinak“ (rozloží se při přepnutí podmínky); „Předtím → Teď“ perem na lístku s páskou, Co udělal pod ním.
- **Slož argument.** Karty jsou ležící lístky (každý jinak natočený), vybraná se zvedne s obrysem perem; řádky jsou list s čárkovaným místem tužkou, odkrytý předpoklad lepicí lístek v řádku, místo k napadení silnější okraj v inkoustu období. Přesun karet `--d-presun`. Zpětná vazba i „K tvé volbě“ na lístku s páskou; Ukázat chybějící větu a Tohle bych napadl zůstávají u otázky, pata má Zkontrolovat, pak Kam dál.
- **Kdo žil dřív?** Odhad perem: zvolený lístek s tečkou perem, tažený život v barvě pera, společná léta odhadu šrafou perem; skutečnost v inkoustu období (po odhalení dopadne). Odhalení na lístku s páskou, v patě Zkusit znovu (výjimka ze skillu, rám dostal `znovuText`).
- **Kdo je na tvé straně:** štítek „Na tvé straně“ s tečkou jako rodina aktivit, linka v inkoustu období, ostatní odpovědi s čárkovanou linkou tužkou.
- **Návrat** v rámu: rodina aktivit je název cesty, pravidlo perem, možnosti vystouplé lístky, věta po odpovědi na lístku.
- **Závěr cesty:** „Na začátku“ na lepicím lístku a studentova odpověď perem. **Moje stanovisko:** pole perem na linkách, tlačítka rámu. **První názor:** hlava rámu, pořadí tlačítek beze změny (z pole tabulátorem rovnou na Uložit). **Změnil se?:** srovnání na lístku s páskou, obě odpovědi perem.
- **Zkus to žít:** tlačítko rámu na plném inkoustu; po přijetí se otiskne razítko „přijato“ (dopad jen po kliknutí).
- **Dva životy:** společná léta jsou šrafa tužkou mezi pruhy, ne tinta; posun po výběru `--d-presun`, nabídka ve vtlačené drážce.
- **Příběh** je čtení: text scény leží na čistém listu (bez pásky, pásky nese deska z K3), ne v rámu.
- **Razítko člověka v blocích:** `src/components/ui/RazitkoCloveka.svelte` (stejné SVG a CSS `.razitko-cloveka` jako Astro verze, s městem a rokem; id oblouků přes `$props.id()`), údaje skládá `clovek()` v `bloky/_kontrola.ts` (`razitko` v `ClovekBloku`). V hlavě rámu 56 px, v Co udělal 44 px bez obvodu, na koncích provázku 34 px. `mapa/Mince.svelte` zůstává pro Mapu a čas, osu hlasů a deník (K6, K7a).
- **Lepicí lístek zpětné vazby uvnitř čistého listu** má papír období 12 % místo 16 %: píše na něm i studentovo pero a sépiové by na lístku období 7 mělo 4,27 : 1.
- **Promítání:** čelo kapsy v podobě na plátně roste do výšky, Dát sem zůstává ve stejné výšce u všech kapes.
- **Pata, která na telefonu drží u spodní hrany** (Tady stojím, Rozhodnuto, Odhalit…), zakrývala ovládání těsně nad sebou, když k němu prohlížeč posunul (fokus, skok): ovládání v takovém rámu má na telefonu `scroll-margin-bottom: 84px` (`global.css` › Rám aktivity).

### Přezdívky

Odškrtnuté v tabulce Po K1 (bloky K4b): `--paper`, `--surface`, `--sunk`, `--rule`, `--muted`, `--pc`, `--pc-tint`, `--pc-soft`, `--pohyb-rychle`, `--pohyb`, `--pohyb-kamera`, `--r-sm`, `--r-md`, `--r-full`. Zbývá (počet `var(--…)` v `src` mimo `tokens.css`, v závorce před K4b): `--paper` 19 (32), `--surface` 60 (71), `--sunk` 14 (17), `--rule` 82 (103), `--muted` 55 (79), `--pc` 97 (128), `--pc-tint` 29 (39), `--pc-soft` 8 (12), `--pohyb-rychle` 4 (18), `--pohyb` 20 (22), `--pohyb-kamera` 15 (21), `--r-sm` 23 (37), `--r-md` 19 (32), `--r-full` 16 (28), `--r-xs` 18 (18). Zbývají cesta (K5), deník, Domů, období, osa hlasů, týden, hodina (K6), mapa a kresby (K7a, K7b). Tinty období (`--pc-tint`, `--period-N-tint`) bloky už nepoužívají; smaže je O.

### Testy a kontrola

- `npm run build` prošel. Vitest celý (v `kontrast.test.ts` nově lepicí lístek zpětné vazby 12 % se třemi pery a tiskem ve všech obdobích a inkoust období na malé vystouplé ploše).
- Playwright `bloky`, `ram-aktivity`, `pruchod`, `cesta`, `cesta2` až `cesta8`, `cesta33`, `cesta34`, `sloz-argument`, `spor-reflexe`, `navrat`, `zaver`, `dva-zivoty`, `tyden`, `otazka`, `stranky-osob`, `prohlidka`, `hodina-podoby`: prošly. Upravené testy: v Roztřiď stojí karty v kapse nad čelem, tedy v pořadí tabulátoru před Dát sem (`bloky.spec.ts`); razítka v hlavě nesou jména po obvodu, takže volba v Kdo žil dřív? se hledá jako přepínač, ne podle textu (`bloky`, `dva-zivoty`); ve Sporu je po reflexi v patě nejdřív Začít znovu, pak Další krok (`spor-reflexe`); úvod profilu má na telefonu dva obaly (`otazka.spec.ts`, `.first()`); šířka Dát sem na plátně se měří proti vnitřku čela (`hodina-podoby`); rámeček fokusu Dát sem nese celá kapsa (`nove-stranky`, klávesnice) a změněná scéna se po přepnutí podmínky rozloží, test počká (`nove-stranky`, Gýgův prsten).
- `scripts/kontrola-fokus.mjs` na kroku cesty 1/2, 1/5, 6/3, 4/6 a na profilu Sókrata (390 a 1440 px): bez nálezu.
- Klávesnicí (jednorázový skript, smazaný) na 390 × 844, 390 × 640, 1440 × 900 a 1440 × 700: Spor na kroku 1/5, šipka a Tab na Tady stojím: tlačítko nad lištou, pata na telefonu drží (`sticky`) nad lištou; Roztřiď na kroku 6/2, Tab na Dát sem: kapsa nad lištou.
- **Kontrast** nových dvojic (jednorázový skript, smazaný), nejmenší den / noc: pero na lepicím lístku zpětné vazby 4,55 / 5,05 (po změně na 12 %; při 16 % 4,27), štítek „jedna věc jinak“ `--na-papiru` na papíru období 5,48 / 5,48, inkoust období na malé vystouplé ploše 5,29 / 6,27, tužka (uzlíky, čárkované okraje) na papíru 3,24 / 4,65 a na listu 3,63 / 4,02, název a popis na čele kapsy 14,84 / 12,68 a 10,43 / 9,61.
- **Celé `npm test`** (kontrola typů, Vitest 1 323 testů, Playwright 735 testů) prošlo. Při prvním běhu spadly čtyři testy: dva kvůli pořadí a rámečku fokusu (testy upravené výš) a dva kvůli patě, která na telefonu zakrývala ovládání nad sebou (oprava `scroll-margin-bottom` výš). Běh dotčených souborů přes noc spadl na usnutí Macu (časové limity); ráno 14. 11. prošel celý.
- **Snímky** v `Claude outputs/snimky/design-v2-k4b/`: `bloky/` (každý blok z dílny na 390 a 1440 px ve dne i v noci, před tahem a s `-po-` po něm: Roztřiď, Změň jednu věc, Spor, Kdo žil dřív? pořadí i vzdálenost, Slož argument, Návrat; k tomu Příběh, Dva životy, první názor a Zkus to žít) a `cesty/` (cesta 1 a 6 na 390 px s odpověďmi i bez, na 1440 px v noci s odpověďmi).

### Nad čím jsem váhal a co by šlo jinak

- **Karty v kapse jsou celé, ne zmenšené.** Plátno je na telefonu zmenšuje na 60 % a překrývá; text pak nejde přečíst a vrácení karty je trefa. Karty v kapse proto stojí pod sebou celé a čelo zakryje jen spodek poslední. Jinak: menší karty přes sebe jako na plátně, kapsy nižší.
- **Do kapsy jde klepnout kamkoli** (myš, prst), klávesnice má Dát sem. Dřív pokrývalo celý koš neviditelné tlačítko; pod čelem se stínem výstřižku by ale zakrylo karty v kapse. Pořadí tabulátoru odpovídá pořadí na obrazovce: karty v kapse, pak Dát sem.
- **Šipka ve Sporu je rovná nad provázkem**, ne po jeho křivce. Po křivce by se kryla s provázkem a uzlíky.
- **Rozhodnout znovu ve Změň jednu věc zůstává ve změněné scéně**, ne v patě: patří k té podmínce a student ho hledá pod možnostmi. Stejně Ukázat chybějící větu a Tohle bych napadl ve Slož argument: jsou to mezikroky u otázky; pata má jen první a poslední čin.
- **První názor nemá patu se Začít znovu vlevo:** z pole jde tabulátor rovnou na Uložit a ukázat filozofy, Přeskočit tiše za ním (Enter z pole nesmí stisknout Přeskočit).
- **Štítek „jedna věc jinak“** nad změněnou scénou je nový krátký text rukou; říká, co se změnilo, dřív než student čte. Jinak: lístek bez štítku.
- **Razítko „přijato“ u Zkus to žít** je nové slovo v rozhraní. Jinak: jen věta jako dřív.
- **Společná léta:** v Dvou životech šrafa tužkou (údaj atlasu), v Kdo žil dřív? šrafa perem (studentův odhad).
- **Spor na telefonu:** postoje pod sebou (dva sloupce až od 460 px rámu), na notebooku vedle sebe; argumenty vedle sebe od 620 px.
- **Stoický týden, osa hlasů a Tvoje antika** zůstaly beze změny (K6), stejně jako Mince v Mapě a čase a v deníku.

## Co rozhodnout po K4b

Prázdná odpověď znamená souhlas s doporučením.

1. **Roztřiď jako papírové kapsy** s kartami celými, které koukají nad čelem (snímky `bloky/cesta6-tri-kose-*`, `-po-*`)? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K5 14. 11. 2026)

2. **Spor jako dva přišpendlené lístky a mince „ty“ perem na prověšeném provázku**, argumenty na dvou listech (snímky `bloky/platon-diogenes-skutecnost-*`, `-po-*`, a krok 5 cesty 1 v `cesty/`)? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K5 14. 11. 2026)

3. **Studentovo pero i ve zpětné vazbě:** Tvůj důvod, Předtím → Teď, vlastní karta, pravidlo v Návratu, Na začátku v závěru cesty? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K5 14. 11. 2026)

4. **Změň jednu věc: štítek rukou „jedna věc jinak“** nad změněnou scénou (snímky `bloky/utek-z-vezeni-*`)? Doporučuji nechat.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K5 14. 11. 2026)

5. **Zkus to žít: razítko „přijato“** po přijetí výzvy (snímky `bloky/zkus-to-zit-*` jsou před přijetím; razítko uvidíš po kliknutí na profilu)? Doporučuji nechat.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K5 14. 11. 2026)

6. **Příběh na čistém listu bez pásky** vedle desky (snímky `bloky/pribeh-*`)? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K5 14. 11. 2026)

7. **Chceš něco změnit na snímcích po K4b?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K5 14. 11. 2026)

## Zadání K5: cesta

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K4b (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K5 větve design-v2, cesta. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Krok cesty), Po K1 (přezdívky), Po auditu (bod 4 z Vizuálních zlepšení, Pravidlo střídmosti), Po D5 (bod 4 na stránce Zlepšení vzhledu), Po K4a, Po K4b a Co rozhodnout po K4b s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a oddíl Cesta. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/Zlepseni.dc.html jen styly a tělo bodu 4 (postup jako lístek), z project/KrokCesty.dc.html jen lištu cesty, postup a spodní lištu a z project/Pohyb.dc.html jen styly a skript ukázky Další krok. Když odpovědi po K4b něco mění, oprav nejdřív bloky.

1. Hlavička cesty: postup jako lístek cesty, který se štípe (bod 4): týž lístek s pahýlem jako na přehledu cesty, každý hotový krok je vyštípnutá dírka (--d-listek, --k-dopad, jen po činu studenta), běžící krok číslo v kroužku perem studenta (--pero), na posledním kroku se pahýl odtrhne (tah dolů a otočení, --d-list) a přistane v deníku (záznam pro K6; teď jen stav v deníku, který K6 ukáže). Při omezeném pohybu a po obnovení stránky jsou dírky i odtržený pahýl hned na konci. Na telefonu horní lišta (zpět, postup, Odejít) podle D4, na notebooku lišta cesty pod záhlavím webu.

2. Další krok je tichý, dokud student neodpoví nebo krok výslovně nepřeskočí: hlavní je tlačítko bloku (Tohle je můj tah, Tady stojím…); Další krok v liště je do té doby tiché tlačítko (podtržené tužkou) a po činu studenta v bloku, nebo po „Přeskočit krok“, se stane hlavním (plný inkoust). Krok bez bloku (jen text) má Další krok hlavní hned. Pata rámu aktivity s Kam dál a lišta cesty nesmějí nabízet totéž dvakrát vedle sebe (Po K4a: pata s Kam dál na telefonu nedrží). Spodní lišta telefonu (Předchozí a Další krok) podle D4. Přehled cesty a karta cesty (lístek s pahýlem z K3) na nová jména tokenů.

3. Přechod mezi kroky krátký: posun listu (--d-list, --k-list) podle ukázky Další krok na stránce Pohyb; otočení listu zůstává mezi stránkami (K2). Typ přechodu se pozná z adresy (krok n → n+1 a zpět), ne z odkazu. Při omezeném pohybu nový krok hned.

4. Komponenty cesty (CestaLista, CestaHlavicka, PostupCesty, CestaKarta, přehled cesty) přepiš na nová jména tokenů (Po K1, tabulka přezdívek); co přestanou používat, odškrtni v tabulce přezdívek v plánu.

5. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro cesta, cesta2 až cesta8, cesta33, cesta34, pruchod, ram-aktivity, fokus-lista, prohlidka, prechody a ty, které spadnou kvůli liště), node scripts/kontrola-fokus.mjs na krocích cesty 1/1, 1/2, 1/7, 6/2 a na přehledu cesty 1, klávesnicí na dvou výškách okna (lišta i pata bloku), přechod mezi kroky v opravdovém Chromu (node scripts/overeni-prechodu.mjs), node scripts/snimky-cesta.mjs na cestě 1 a 6 (s odpověďmi i bez) a snímky lišty na 390 a 1440 px ve dne i v noci na prvním, prostředním a posledním kroku. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

6. Do plánu větve zapiš oddíl Po K5: co se na cestě změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K5 (kontrolní bod se snímky pro autora) a zadání K6 v plném znění (podle tabulky kroků). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

7. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

