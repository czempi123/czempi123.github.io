# Plán větve stoicky-tyden: Stoický týden

Architektura slibuje sérii sedmi krátkých cvičení v duchu Zkus to žít, jedno na den, kterou si student spustí po cestě 5, 33 nebo 34 a učitel ji může dát třídě jako týdenní výzvu (`docs/architektura.md` › Stoický týden). Atlas má dnes osmnáct karet Zkus to žít, každá je výzva na týden; žádná neprovede studenta týdnem den po dni. Tahle větev týden postaví: podklady ke cvičením, stránku týdne, propojení s deníkem a místy, odkud se spouští, a list pro učitele. Větev založena z hlavní větve 26. 10. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: zkouška se studenty měla jít před týdnem (rozhodnutí 25. a 26. 10. 2026), autor ale zatím studenty nemá. Atlas je zveřejněný s `noindex` a čeká na ně; mezitím pokračuje pořadí z 26. 10. 2026 další větví.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| P6 | Podklady: sedm cvičení, prameny, citáty, meze, co už atlas má | Sonnet 5.5 · high s vyhledáváním; Opus 5.5 · high u sporných pramenů | hotovo 26. 10. 2026 (Po P6) |
| K | Stránka týdne a deník: nová komponenta podle `atlas-komponenta` | Opus 5.5 · high (xhigh při zaseknutí) | hotovo 26. 10. 2026 (Po K) |
| T | Texty sedmi dnů, úvod, vstupy z cest a profilů, list pro učitele | Opus 5.5 · high se skilly `atlas-psani` a `atlas-cesta` | zadání níž |
| R | Revize větve | Opus 5.5 · high se skillem `atlas-revize` | po T |
| O | Opravy po revizi | Opus 5.5 · high | po R |
| Uzavření | Schválení autorem, sloučení, push hlavní větve (nasadí web) | Opus 5.5 · medium | po O |

## Co už atlas má

- **Dvě cvičení napsaná a ověřená:** večerní ohlédnutí je karta „Tři otázky večer“ v portrétu Seneky (`seneca-vecer`, O hněvu III, 36); představa nejhoršího je „Pět minut, jedna věc“ v cestě 33 (`cesta33-pet-minut`, s mezí proti přemítání z `docs/podklady/celek-10.md`, oddíl h).
- **Citáty v datech, které podklady odložily pro týden:** `rukojet-1-5`, `hovory-v-1`, `rozpravy-iii-2-4`, `hovory-vi-6`; dál `hovory-ii-1` (ranní příprava) a `hovory-ix-30` (pohled shora). Před použitím P6 projde, jestli citát v celku nezazní víc než dvakrát (`atlas-osobnost`).
- **Deník** umí přijmout výzvu (`Vyzva` v `src/lib/denik.ts`: název, odkaz, kdy přijata, poznámka) a spojit deník ze souboru. Dny týdne neumí.
- **Příprava hodiny** umí zastavení z cest, bloků, kapitol a hlasů; týden v ní není.

## Sedm dnů podle architektury

| Den | Cvičení | Kdo | Stav podkladů |
| --- | --- | --- | --- |
| 1 | Ranní příprava na den | Marcus (Hovory II, 1) | citát v datech, cvičení neověřené |
| 2 | Co je v mé moci | Epiktétos (Rukojeť 1) | citát v datech, cvičení neověřené |
| 3 | Představa nejhoršího | Seneca | ověřeno, karta v cestě 33 |
| 4 | Pohled shora na vlastní starosti | Marcus (Hovory IX, 30 a další) | citát v datech, cvičení neověřené |
| 5 | Jeden den skromnosti | Seneca (Dopisy 18 a další) | neověřeno |
| 6 | Večerní ohlédnutí | Seneca (O hněvu III, 36) | ověřeno, karta v portrétu |
| 7 | Zápis do deníku | Marcus jako píšící sám sobě | neověřeno |

Pořadí dnů je z architektury. P6 může navrhnout jiné, kde to má důvod (třeba ohlédnutí jako večerní rytmus všech dnů, ne jen šestého).

## Nad čím jsem váhal

- **Kde týden bydlí.** Stránka směru stoicismus ještě není a karta Zkus to žít je na sedm dnů malá. Navrhuju vlastní stránku `/tyden/stoicky/` se sedmi dny pod sebou, spouštěnou z cest 5, 33 a 34, z portrétů Seneky, Epiktéta a Marca a z deníku; až vznikne stránka směru stoicismus, odkáže na ni. Otázka 1.
- **Týden bez série dní.** Plán atlasu zakazuje série dní a body. Týden proto nesmí trestat vynechaný den: dny nejsou vázané na kalendář, student pokračuje dnem, na kterém skončil, a deník ukáže jen hotové dny a jeho poznámky, žádné „přerušil jsi sérii“. Otázka 2.
- **Dva hotové dny dvakrát.** Den 3 a 6 by mohly jen odkázat na hotové karty, ale student by z týdne odcházel jinam. Navrhuju vlastní krátké znění dne se stejnými citáty a odkaz „celé cvičení je v…“; citáty pak zazní dvakrát, což pravidlo dovoluje. Otázka 3.
- **Učitel.** Týden pro třídu jako zastavení v přípravě hodiny (jeden odkaz, třída ho projde doma) a list `ucitel/stoicky-tyden.md` s tím, jak o cvičeních mluvit po týdnu. Režim třídy čeká na vlastní větev. Otázka 4.

## Co zůstává na později

- **Zkouška se studenty**, až autor studenty bude mít; do té doby `noindex`.
- **Další týdny** (epikurejský, sokratovský) až podle toho, jak se osvědčí tenhle; komponenta má být napsaná tak, aby je unesla bez přestavby.
- `interaktivita-v1`, `antika-doplnky`, skill `atlas-obdobi` a plán středověku (P12) v pořadí z 26. 10. 2026.

## Co rozhodnout před K

Prázdná odpověď znamená souhlas s doporučením.

1. **Stránka `/tyden/stoicky/`** se sedmi dny, vstupy z cest 5, 33, 34, portrétů Seneky, Epiktéta a Marca a z deníku. Doporučuji.
   Odpověď:
2. **Dny bez kalendáře a bez série:** student si týden přijme, každý den označí jako hotový a připíše poznámku; pokračuje, kde skončil, nic se nepočítá jako přerušení. Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).
3. **Dny 3 a 6** s vlastním krátkým zněním a odkazem na celé cvičení v cestě 33 a portrétu Seneky. Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).
4. **Učitel:** týden jako zastavení v přípravě hodiny a list `ucitel/stoicky-tyden.md`. Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).

## Zadání P6

Model: Sonnet 5.5 · high s vyhledáváním; sporná místa Opus 5.5 · high.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev stoicky-tyden. Krok P6 Stoického týdne: podklady k sedmi cvičením se skillem atlas-overeni. Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch stoicky-tyden, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/pouceni.md, plán větve docs/plany/stoicky-tyden.md celý, v docs/architektura.md oddíl Stoický týden, v docs/podklady/k-overeni.md řádky se slovy „Stoický týden“ a oddíl celku 3, v docs/podklady/celek-10.md oddíly b, e, f a h (představa nejhoršího a její meze).

1. Podkladový list docs/podklady/stoicky-tyden.md podle šablony skillu atlas-overeni, oddíl na každý ze sedmi dnů:
   - pramen cvičení v originále (řecky nebo latinsky) a v českém překladu, který atlas cituje; co je doložené jako stoická praxe a co je pozdější podání (Hadot, moderní stoicismus, terapie);
   - citát pro den: nejdřív hotové citáty v src/data/zdroje.yaml (rukojet-1-5, hovory-v-1, hovory-ii-1, hovory-ix-30, rozpravy-iii-2-4, hovory-vi-6, seneca-ira-iii-36…), u každého kolikrát už v atlasu zazní; nové citáty jen ověřené, s návrhem záznamu do zdroje.yaml;
   - co student ten den udělá (pár minut, bez pomůcek, bez psaní kromě dne 7 a poznámky do deníku) a mez: kdy cvičení přestat (přemítání, smutek, ztráta), jak to říct studentovi bez kázání; u dne 5 i zdraví a jídlo (žádný půst, nic, co by se dalo číst jako omezování jídla);
   - dny 3 a 6: jen co z hotových karet převzít a co zkrátit.
2. Nejsilnější námitka proti týdnu jako celku (stoicismus jako potlačování citů, „stoický klid“ jako lhostejnost) s odpovědí z pramenů; kam ji v týdnu dát.
3. Návrh pořadí dnů s důvodem, pokud se odchyluje od architektury.
4. Otevřené otázky pro autora a řádky do docs/podklady/k-overeni.md (oddíl Stoický týden).
5. Do plánu větve oddíl „Po P6 (datum)“: co je ověřené, co ne, nad čím jsi váhal; „Co rozhodnout po P6“ s doporučeními, pokud je co rozhodnout. Commit ve větvi, nic neposílej na GitHub.
```

## Po P6 (26. 10. 2026)

Podklady: `docs/podklady/stoicky-tyden.md`; řádky v `docs/podklady/k-overeni.md` u řádku Stoický týden (celek 3). Do zdrojů ani do obsahu jsem nesáhl; návrh jednoho nového citátu je v podkladech.

**Ověřeno (řecky nebo latinsky přečteno v tomhle kroku):** Marcus II, 1, V, 1, VII, 48, IX, 30, XII, 24; Epiktétos, Rukojeť 1, 3, 4, Rozpravy III, 2, III, 3, 1, I, 1, 25; Seneca, Dopisy 18, 63, 99, O hněvu III, 36; Gellius XIX, 1; Diogenés Laertios VII, 116–117. U deseti citátů, které atlas už má, se `original` shoduje slovo od slova.

**Neověřeno:** Hadot, Irvine, Ellis, Beck jen z recenzí; český překlad Hovorů, Rukojeti a Rozprav neotevřen; číslování oddílů v Dopisech 18, 63, 99, v Gelliovi a v Diogenovi Laertiovi jsem v souborech z Perseu nemohl zkontrolovat; Rukojeť 33 a 47, Marcus I, 7 a Epikúrův dopis Polyainovi nečteny.

**Čtyři dny jsou jinak, než říkala architektura:**

- **Den 5 se nestaví na Dopisu 18, 5–9.** Je to celé o nejhorším jídle, hrubém lůžku a Epikúrových hladových dnech, tedy přesně to, co zadání zakázalo. Navrhuju „Den bez jednoho pohodlí“ na principu z 18, 6 (voják v míru staví val), s větou, že jídlo, pití, spánek, léky a teplo do cvičení nepatří.
- **Den 1 ne z II, 1, ale z V, 1.** II, 1 je výčet lidí, které ráno potkám; to nesmí mířit na toho, kdo ubližuje.
- **Dny 3 a 6** se jen převezmou z hotových karet a zkrátí (vyndat věty mířící za týden).
- **Den 7** není „deník Marcův“: Hovory deník nejsou (SEP) a Seneca ohlédnutí nezapisoval. Den 7 = jedna věta sobě a poznámka do deníku; překrývá se s kartou „Věta pro sebe“.

**Námitka „stoik beze citu“** už má v atlasu dva domovy (cesta 5, krok 7; cesta 7, krok 7). Týden nový Spor nestaví: jedna věta na první obrazovce a odkaz ve dni 2. Poctivě musí zaznít i slabé místo: stoikové zármutek podle nauky nepřijímají bez výhrad.

**Nad čím jsem váhal.**

- **Jestli den 5 nevynechat úplně.** Vynechání by bylo nejbezpečnější a týden by měl šest dnů. Nechal jsem ho, protože princip z 18, 6 se dá cvičit bez jídla a bez chudoby, a protože týden bez jediného „dělání“ (vše ostatní je v hlavě) by byl jednostranný. Je to na autorovi (otázka 2).
- **`seneca-ep-18-9` v cestě „Kolik je dost?“, krok 4.** Epikúrovy hladové dny tam jsou už dnes. Mimo tuhle větev jsem nic neměnil, jen to hlásím (otázka 3).
- **Jak hluboko cvičení zasahuje.** Dny 2 a 4 („jsi dojem“, „shora“) se dají číst jako „není to skutečné“; v obou jsem napsal výslovnou mez (nepoužívat na to, co ti někdo dělá, ani na ztrátu). Je to můj úsudek o riziku, ne doložená věc.
- **Večerní ohlédnutí jako rytmus všech dnů** (nápad z tohoto plánu) nedoporučuju: dvě cvičení denně by překročila „pár minut“ a trestala by vynechaný den.
- **Deník.** Kde se poznámky týdne ukládají a co vidí učitel, je otázka pro K; v podkladech je jako otázka 6.
- **Zdroje.** Perseus jsem četl místo Leopolda; shodu jsem zkontroloval jen u míst, která jsou v datech.

## Co rozhodnout po P6

Autor 26. 10. 2026: „Souhlasím s doporučeními“ (u všech deseti). Úplné znění otázek je v `docs/podklady/stoicky-tyden.md` (Otevřené otázky pro autora).

1. **Den 1 z V, 1 místo II, 1.** Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).
2. **Den 5 jako „Den bez jednoho pohodlí“** s Dopisem 18, 6 a výslovnou větou o jídle, pití, spánku, lécích a teplu; ne Dopis 18, 5–9. Doporučuji. Alternativy: den 5 vynechat (týden o šesti dnech), nebo ho nahradit jiným cvičením po ověření.
   Odpověď: souhlas s doporučením (26. 10. 2026).
3. **`seneca-ep-18-9` v cestě „Kolik je dost?“, krok 4:** podívat se, zda věta o Epikúrových hladových dnech neodporuje pravidlu o jídle. Doporučuji jen podívat se; nic neměním bez tebe.
   Odpověď: souhlas s doporučením (26. 10. 2026).
4. **Název dne 5:** „Den bez jednoho pohodlí“ místo „Jeden den skromnosti“ („skromnost“ přivolává „stačí málo“). Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).
5. **Den 7 jako jedna věta**, karta „Věta pro sebe“ zůstane samostatnou sedmidenní variantou; konec karty „Tři otázky večer“ se v týdnu přesune do dne 7. Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).
6. **Soukromí poznámek týdne** (uložení, sdílení, co vidí učitel v režimu třídy): rozhodnout před K.
   Odpověď: autor 26. 10. 2026 přenechal rozhodnutí mně. **Doporučení a platí:** poznámky týdne jsou jen v deníku v prohlížeči (`Vyzva.poznamka`, localStorage, nic se neodesílá, součást exportu do souboru), týden přidá jen značku hotových dnů, bez dat a sérií; učitel žádné poznámky nevidí a list pro učitele řekne, že se nesbírají; promítání týdne do deníku nic nezapíše (jako každé promítání). Student může poznámku vynechat a deník může mazat.
7. **Námitka v týdnu:** jedna věta s `rozpravy-iii-2-4` na první obrazovce, odkaz na cestu 5, krok 7 ve dni 2, nový Spor nestavět. Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).
8. **Plán píše devatenáct karet Zkus to žít, napočítal jsem osmnáct.** Překlep, nebo mi karta uniká?
   Odpověď: autor 26. 10. 2026 přenechal rozhodnutí mně. **Ověřeno:** v obsahu je 18 různých karet (`ZkusToZitKarta id=`), žádná se neopakuje; „devatenáct“ byl překlep a je opraveno na osmnáct.
9. **`hovory-vi-6`** („Nejlepší obrana je nestat se stejným“) v týdnu nepoužít. Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).
10. **Gellius a Diogenés Laertios** (jako doklad k námitce) jen v listu pro učitele, ne ve studentském textu. Doporučuji.
    Odpověď: souhlas s doporučením (26. 10. 2026).

## Zadání K

Model: Opus 5.5 · high; xhigh, když se zasekne (data a export deníku, katalog zastavení). Odpovědi po P6 jsou zapsané výše a v `docs/rozhodnuti.md` (26. 10. 2026); podklady jsou `docs/podklady/stoicky-tyden.md`.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev stoicky-tyden. Krok K Stoického týdne: stránka týdne a deník, se skillem atlas-komponenta. Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti. Texty sedmi dnů nepíšeš, to je krok T; K staví, do čeho se vejdou.

0. git switch stoicky-tyden, git status bez necommitnutých změn (dvě nesledované položky, „Atlas myšlení — kritika…md“ a „Claude outputs/“, nech být a necommituj). Přečti CLAUDE.md, skills/atlas-komponenta/SKILL.md, docs/styl.md, docs/pouceni.md, docs/design.md (jen tokeny a oddíly o stránce, kartě a mapě na telefonu), tento plán (tabulku, Po P6, Co rozhodnout po P6 s odpověďmi), z docs/podklady/stoicky-tyden.md oddíl Pravidla týdne a mez každého dne, z docs/rozhodnuti.md záznamy 26. 10. 2026 ke Stoickému týdnu a k hodinám (zastavení, promítání). Jako vzor stránky a karty otevři jen src/pages/osobnost/[id].astro, ZkusToZitKarta a src/lib/denik.ts (Vyzva, export, slučování). src/lib/hodiny.ts jen oddíl Zastavení.

1. Data týdne. Týden je data, ne napevno psané stránky, aby unesl další týdny (epikurejský, sokratovský) bez přestavby: kolekce nebo YAML se schématem (id týdne, název, úvodní věta, sedm dnů; u dne číslo, název, doba, text cvičení, citát podle id ze zdroje.yaml nebo bez citátu, mez jednou větou, odkaz na celé cvičení). Schéma zkontroluje, že citát existuje, a test hlídá, že žádný citát v týdnu nezazní víc než dvakrát. Texty dnů jsou zatím prozatímní: vezmi „Návrh znění pro T“ z podkladů a v souboru je označ komentářem. Do T se nic nesloučí.

2. Stránka /tyden/stoicky/. Sedm dnů pod sebou, jeden den otevřený, ostatní sbalené; nahoře jedna věta o tom, že stoik neznamená člověk beze citu, a pravidla týdne jednou větou („Kdykoli přestaň, den můžeš přeskočit, nic se nepočítá“). U každého dne mez a tlačítko Hotovo; den lze označit i zrušit a vynechat. Žádné série, body, procenta, pořadí ani odznaky a nic jako „přerušil jsi“; student pokračuje dnem, na kterém skončil. Den 7 má pole na jednu větu a poznámku. Telefon první, 44 px cíle, klávesnice, čtečka, světlý i tmavý režim, bez autoplay, bez zvuku.

3. Deník. Poznámky týdne jsou jen v deníku v prohlížeči. Rozhodnutí z 26. 10. 2026: týden přidá značku hotových dnů, bez dat a sérií; učitel poznámky nevidí; promítání do deníku nic nezapíše. Přijetí týdne je Vyzva (název, odkaz, kdy přijata, poznámka); hotové dny a věta ze dne 7 jsou v nepovinném poli deníku (starší deníky ho nemají, verze zůstává 1), součástí exportu i slučování souboru (u téhož vyhraje novější, nic se nemaže). Deník týden ukáže stejně jako ostatní výzvy a „hotové dny“ jen jako počet z N, bez procent. Vstup do týdne se v deníku nesmí tvářit jako povinnost.

4. Odkud se týden spouští. Z cest 5, 33 a 34 (poslední krok, KamDal nebo karta), z portrétů Seneky, Epiktéta a Marca (KamDal) a z deníku. Pozor: texty těch odkazů jsou studentský text, napiš je podle atlas-psani a drž je krátké. Karta „Věta pro sebe“ (marcus-veta-pro-sebe) a „Tři otázky večer“ (seneca-vecer) zůstanou, jak jsou; jen se k nim případně přidá odkaz na týden.

5. Příprava hodiny. Týden jako zastavení (id t:<týden>, např. t:stoicky) v katalogu v src/lib/hodiny.ts: jeden odkaz, třída ho projde doma; poznámky učitele do odkazu nejdou. Promítání týdne nezapíše nic do deníku a Hotovo v něm nic neukládá. List pro učitele (ucitel/stoicky-tyden.md) a režim třídy sem nepatří, to je T a pozdější větev.

6. Testy a snímky. Vitest: schéma a počty citátů, slučování a export deníku s novým polem včetně starého deníku bez něj, katalog zastavení. Playwright: otevření stránky, Hotovo a zrušení, poznámka ve dni 7, přeskočení dne, deník po obnovení stránky, telefon 375 px, světlý i tmavý režim, klávesnice; node scripts/snimky-listy.mjs a snimky-prvek.mjs na stránku týdne. Celé npm test jednou před posledním commitem. V linuxovém prostředí (device_bash) npm nespouštěj, spouštěj ho na Macu přes Desktop Commander.

7. Do plánu větve oddíl „Po K (datum)“: co je hotové, co ne, nad čím jsi váhal; „Co rozhodnout po K“ s doporučeními, pokud je co rozhodnout. Rozhodnutí do docs/rozhodnuti.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/stoicky-tyden.md), nic dalšího do projektu nepřidávej. Commity česky a stručně, ve větvi, nic neposílej na GitHub.
```

## Po K (26. 10. 2026)

**Hotové.**

- **Data:** kolekce `tydny`, `src/content/tydny/stoicky.yaml` se schématem `src/lib/tydny-schema.ts` (název, období, vstup, úvod, námitka s citátem, pravidla, odkud se nabízí, prameny, dny: číslo, název, osoba, doba, text, citát, mez, odkaz, psaní). Texty jsou prozatímní („Návrh znění pro T“, dny 3 a 6 zkrácené karty) a soubor to říká v komentáři nahoře. Den 5 je bez citátu: `seneca-ep-18-6-val` přidá T. Kontrola (`kontrolaTydne`) zastaví sestavení při chybějícím citátu, prameni, osobě nebo mezeře v číslech; test hlídá nejvýš dva výskyty citátu v týdnu i v týdnu a atlasu dohromady (dnes všechny 1 nebo 2).
- **Stránka `/tyden/stoicky/`** (ostrov `Tyden.svelte`): hlavička s námitkou a citátem `rozpravy-iii-2-4`, pravidla jednou větou, Přijmout týden, sedm dnů pod sebou, jeden otevřený. Hotovo jako přepínač (označit i zrušit), Další den (přeskočí bez značky, fokus na další den), mez u každého dne, ve dni 7 pole na větu a poznámku, které se ukládají samy. Otevře se den, na kterém student skončil; `#den-N` otevře den N.
- **Deník:** výzva `tyden-stoicky` (poznámka u ní), nepovinné pole `tydny` (hotové dny, den, věta, čas změny jen pro spojení), export i nahrání ze souboru; v deníku řádek „Hotové dny: 1 ze 7“ a věta s poznámkou, nepřijatý týden jako tichý odkaz v oddílu Zkus to žít.
- **Vstupy:** karta týdne na posledním kroku a v Kam dál cest 5, 33 a 34 (z dat, viz odpověď 1 níž), karta v Kam dál portrétů Seneky, Epiktéta a Marca, deník. Karty Věta pro sebe a Tři otázky večer beze změny.
- **Příprava hodiny:** zastavení `t:stoicky` (druh `tyden`, skupina „Týdny Zkus to žít“, štítek „Celý týden“); promítání zapisuje jen do deníku promítání.
- **Testy:** `tests/data/tydny.test.ts` (schéma, kontrola, citáty, den k otevření, počet dnů, deník, export, spojení), doplněné `hodiny.test.ts` a `skladatel.test.ts`, `tests/e2e/tyden.spec.ts` (stránka, Hotovo a zrušení, přeskočení, den 7 a deník po obnovení, deník bez týdne, klávesnice, axe na 375 a 1440 px ve světlém i tmavém režimu, promítání, vstupy, karta týdne, katalog), stránka týdne v `prohlidka.spec.ts`. Snímky jsou v `Claude outputs/tyden/`. Popis v `docs/design.md` (Komponenty › Týden cvičení, Co se ukládá), rozhodnutí v `docs/rozhodnuti.md`.

**Nehotové (patří T):** texty dnů, úvodu, meze a popisků polí; citát dne 5; list `ucitel/stoicky-tyden.md`; věta pro studenta, kterému týden nepomohl (podklady, den 7).

**Nad čím jsem váhal.**

- **Kde je vstup z cest.** Zadání nabízelo poslední krok, Kam dál nebo kartu. Poslední krok končí závěrečným pravidlem a cesty 33 a 34 už v něm mají kartu Zkus to žít; další odkaz by studenta odvedl dřív, než pravidlo napíše. Zvolil jsem řádek v Kam dál na přehledu cesty, kam vede Dokončit cestu. Šlo by i vložit odkaz pod kartu v posledním kroku. (Autor nesouhlasil, viz odpověď 1.)
- **Přijmout týden vedle Hotovo.** Hotovo i psaní týden přijmou samy, takže tlačítko nahoře je navíc. Nechal jsem ho, protože zadání mluví o přijetí a student, který si týden chce jen „vzít“, nemusí nic označovat.
- **Čas změny v deníku.** Rozhodnutí říká „bez dat“. Dny data nemají; jediný čas je u celého záznamu a slouží jen tomu, aby při nahrání souboru vyhrál novější. Nikde se neukazuje.
- **Spojení hotových dnů.** U cest se otevřené kroky sčítají, u týdne vyhraje novější záznam celý: sečtení by vrátilo den, jehož značku student zrušil.
- **Nadpis meze „Kdy přestat“** sedí na dny 1 až 6, mez dne 7 („Deník je tvůj…“) zní jinak. Nechávám na T.
- **Jeden citát na den.** Den 6 má jen tři otázky (`seneca-ira-iii-36-otazky`); „Teď ti odpouštím“ by potřebovalo druhý citát, schéma ho nemá.
- **Drobečky** „Lidé a směry / Stoický týden“ a sekce Lidé, dokud není stránka směru stoicismus.

## Co rozhodnout po K

Autor 26. 10. 2026: souhlas se vším kromě otázky 1.

1. **Vstup z cest 5, 33 a 34 jen v Kam dál na přehledu cesty**, ne v textu posledního kroku. Doporučuji.
   Odpověď (26. 10. 2026): nesouhlas, řádek je „dost nenápadně zahrabaný“; týden potřebuje přehlednou strukturu a místo, kde ho jde vidět. **Provedeno:** karta týdne se sedmi dny (`src/components/tyden/TydenKarta.astro`) na posledním kroku cest 5, 33 a 34 pod závěrečným pravidlem a na přehledu cesty v Kam dál místo řádku; kde se ukáže, říká `nabizet.cesty`. Snímky `Claude outputs/tyden/karta-*`.
2. **Den 6 s jedním citátem** (tři otázky); „Teď ti odpouštím“ zůstane v portrétu. Kdyby T chtěl oba, přidám do schématu seznam citátů. Doporučuji jeden.
   Odpověď: souhlas s doporučením (26. 10. 2026).
3. **Nadpis meze „Kdy přestat“** u všech dnů; T přepíše mez dne 7 tak, aby pod něj seděla. Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).
4. **Drobečky přes Lidé a směry**, dokud nevznikne stránka směru stoicismus; pak povedou přes ni. Doporučuji.
   Odpověď: souhlas s doporučením (26. 10. 2026).

## Zadání T

Model: Opus 5.5 · high se skilly `atlas-psani` a `atlas-cesta`. Odpovědi po K jsou zapsané výše a v `docs/rozhodnuti.md` (26. 10. 2026, krok K a odpovědi autora).

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev stoicky-tyden. Krok T Stoického týdne: všechny texty týdne pro studenty a list pro učitele, se skilly atlas-psani a atlas-cesta. Stránka, deník a karta týdne jsou hotové z kroku K; komponenty neměň, jen když text bez úpravy nejde (pak to napiš do Po T). Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch stoicky-tyden, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (hlavně Student, kterého se téma bolestně týká, a Celek), skills/atlas-psani/SKILL.md, tento plán (tabulku, Po K, Co rozhodnout po K), docs/podklady/stoicky-tyden.md celý (je to podklad pro všechny texty), src/content/tydny/stoicky.yaml, v docs/design.md oddíl Komponenty › Týden cvičení. Jako vzor tónu jen karty seneca-vecer (src/content/osobnosti/seneca.mdx) a cesta33-pet-minut (src/content/cesty/co-kdyz-prijde-to-nejhorsi/8-kdo-je-na-tve-strane.mdx).

1. Texty týdne v src/content/tydny/stoicky.yaml, všechny podle atlas-psani a pravidel týdne z podkladů (oddíl Pravidla týdne):
   - úvod (proč týden a co si student odnese, ne osnova), námitka jednou větou před citátem rozpravy-iii-2-4, vstup (jde na kartu týdne, do deníku a do popisu stránky) a pravidla jednou větou;
   - sedm dnů: název, doba, text cvičení (pár minut, bez pomůcek; psaní jen den 7), mez jednou větou, která sedí pod nadpis „Kdy přestat“ (mez dne 7 přepiš), text odkazu na celé cvičení; každý den čti očima studenta, kterému někdo ubližuje, který truchlí, je nemocný nebo má potíže s jídlem (meze z podkladů u každého dne);
   - den 3 a 6: zkrácené karty podle podkladů, bez vět mířících za týden; den 6 s jedním citátem (seneca-ira-iii-36-otazky), text nesmí citát opisovat;
   - den 5: přidej do src/data/zdroje.yaml citát seneca-ep-18-6-val přesně podle návrhu v podkladech (oddíl Návrh dat) a dej ho dni 5; věta, že jídlo, pití, spánek, léky a teplo do cvičení nepatří, zůstane ve studentském textu;
   - den 7: popisky obou polí a jedna věta pro studenta, kterému týden nepomohl (podklady, den 7: je to platná odpověď);
   - smaž komentář PROZATÍMNÍ ZNĚNÍ nahoře v YAML.
2. Ostatní studentské texty týdne: text karty v Kam dál portrétů Seneky, Epiktéta a Marca (src/content/osobnosti/*.mdx), tichý odkaz v deníku (src/components/ostrovy/Denik.svelte, oddíl Zkus to žít), věta po přijetí týdne a hlášení v ostrově Tyden.svelte (texty, ne logiku). Krátce, žádná povinnost, žádné „měl bys“.
3. Citáty: po změnách projdi počty (nejvýš dvakrát v týdnu i v týdnu a atlasu dohromady; test tests/data/tydny.test.ts) a opakování podle klíčových slov z pramenů napříč dny, kartou a kartami Zkus to žít v portrétech (docs/pouceni.md › Celek).
4. seneca-ep-18-9 v cestě „Kolik je dost?“, krok 4 (odpověď 3 po P6): jen se podívej, jestli věta o Epikúrových hladových dnech neodporuje pravidlu o jídle; nic neměň, napiš nález a doporučení do Po T.
5. List pro učitele ucitel/stoicky-tyden.md: k čemu týden je, jak ho dát třídě (zastavení t:stoicky v přípravě hodiny, třída ho projde doma), co se nesbírá (poznámky jsou jen v deníku studenta, učitel je nevidí), jak o cvičeních mluvit po týdnu bez hodnocení a bez vyptávání na osobní věci, meze dnů pro učitele, námitka „stoik beze citu“ s doklady z podkladů (Diogenés Laertios VII, 116–117, Gellius XIX, 1, Seneca, Dopisy 63 a 99) a co je pozdější podání (Hadot, moderní stoicismus). Jména Gellia a Diogena Laertia jen tady, ne ve studentském textu.
6. Testy, které hlídají studentské věty přesným zněním, uprav v témže commitu (grep -rn v tests/). Sestav web, pusť dotčené testy (tests/e2e/tyden.spec.ts, seneca.spec.ts, otazka.spec.ts, denik-soubor.spec.ts, vitest), node scripts/slova-cesta.mjs nepouštěj (týden není cesta). Snímky: node scripts/snimky-listy.mjs /tyden/stoicky/ na 390 světlý a 1440 tmavý, snimky-prvek.mjs na den 5, den 7 s poli a kartu týdne na /cesta/kam-mi-mizi-cas/8/; prohlédni je. Celé npm test jednou před posledním commitem, na Macu přes Desktop Commander na pozadí s výstupem do souboru.
7. Do plánu větve oddíl „Po T (datum)“: co je hotové, co ne, nad čím jsi váhal (u každého dne jednou větou, co jsi z podkladů vzal a co ne); „Co rozhodnout po T“ s doporučeními, pokud je co rozhodnout; a hned za tím zadání kroku R (revize větve se skillem atlas-revize), ať se nečeká na pokyn. Rozhodnutí do docs/rozhodnuti.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/stoicky-tyden.md), nic dalšího do projektu nepřidávej. Commity česky a stručně, ve větvi, nic neposílej na GitHub.
```
