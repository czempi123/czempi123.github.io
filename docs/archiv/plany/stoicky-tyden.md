# Plán větve stoicky-tyden: Stoický týden

Architektura slibuje sérii sedmi krátkých cvičení v duchu Zkus to žít, jedno na den, kterou si student spustí po cestě 5, 33 nebo 34 a učitel ji může dát třídě jako týdenní výzvu (`docs/architektura.md` › Stoický týden). Atlas má dnes osmnáct karet Zkus to žít, každá je výzva na týden; žádná neprovede studenta týdnem den po dni. Tahle větev týden postaví: podklady ke cvičením, stránku týdne, propojení s deníkem a místy, odkud se spouští, a list pro učitele. Větev založena z hlavní větve 26. 10. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: zkouška se studenty měla jít před týdnem (rozhodnutí 25. a 26. 10. 2026), autor ale zatím studenty nemá. Atlas je zveřejněný s `noindex` a čeká na ně; mezitím pokračuje pořadí z 26. 10. 2026 další větví.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| P6 | Podklady: sedm cvičení, prameny, citáty, meze, co už atlas má | Sonnet 5.5 · high s vyhledáváním; Opus 5.5 · high u sporných pramenů | hotovo 26. 10. 2026 (Po P6) |
| K | Stránka týdne a deník: nová komponenta podle `atlas-komponenta` | Opus 5.5 · high (xhigh při zaseknutí) | hotovo 26. 10. 2026 (Po K) |
| T | Texty sedmi dnů, úvod, vstupy z cest a profilů, list pro učitele | Opus 5.5 · high se skilly `atlas-psani` a `atlas-cesta` | hotovo 26. 10. 2026 (Po T) |
| R | Revize větve | Opus 5.5 · high se skillem `atlas-revize` | hotovo 26. 10. 2026 (Po R) |
| O | Opravy po revizi | Opus 5.5 · high | hotovo 26. 10. 2026 (Po O) |
| Uzavření | Schválení autorem, sloučení, push hlavní větve (nasadí web) | Opus 5.5 · medium | hotovo 26. 10. 2026: schváleno, sloučeno, na GitHubu (Po Uzavření) |

Provedená zadání P6, K, T, R a O jsou v plném znění v `docs/archiv/zadani/stoicky-tyden.md`. Větev je uzavřená a plán je v archivu.

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

## Po T (26. 10. 2026)

Krok navázal na necommitnuté změny z dřívějšího běhu téhož zadání (stejný den 18:13–18:15, nedokončený): převzal jsem je jako návrh a všechno prošel znovu.

**Hotové.**

- **Texty týdne** v `src/content/tydny/stoicky.yaml`: úvod, námitka jednou větou před `rozpravy-iii-2-4`, vstup („Na každý den jedno krátké stoické cvičení“), pravidla jednou větou, sedm dnů (název, doba, text, mez pod „Kdy přestat“, odkaz na celé cvičení), popisky polí dne 7 („Věta, kterou si necháš“, „Který den ti pomohl a který ne“) a věta pro studenta, kterému týden nepomohl („Když nepomohl žádný, napiš to tak. I to je odpověď.“). Komentář PROZATÍMNÍ ZNĚNÍ je pryč.
- **Citát dne 5** `seneca-ep-18-6-val` v `src/data/zdroje.yaml` přesně podle návrhu v podkladech; pramen `seneca-epistulae` má v poznámce 18, 5–6 s větou, že týden bere jen 18, 6.
- **Nové pole dne `poCitatu`** (odstavce za citátem): schéma, kontrola (text za citátem bez citátu zastaví sestavení), stránka, ostrov `Tyden.svelte` (jen vykreslení, logika beze změny), test v `tydny.test.ts` a věta v `docs/design.md`. Komponentu jsem změnil, protože bez úpravy text nešel: ostrov skládal den jako text → citát → mez, takže šest dnů ze sedmi by končilo citátem jako tečkou a k případu by se po citátu vrátit nešlo (`atlas-psani` › Citáty). Teď je den případ nebo otázka → citát → co uděláš ty.
- **Ostatní studentské texty:** karty Stoického týdne v Kam dál portrétů Seneky, Epiktéta a Marca říkají, které dny jsou od koho; tichý odkaz v deníku „… Začni, až budeš chtít.“. Větu po přijetí („Týden je v tvém deníku. Začni, kdy chceš.“) a hlášení v ostrově jsem nechal: jsou krátké a nic neukládají za povinnost.
- **List pro učitele** `ucitel/stoicky-tyden.md`: k čemu týden je, jak ho dát třídě (zastavení `t:stoicky`), co se nesbírá, jak o týdnu mluvit potom (otázky i co nedělat), meze dnů v tabulce s důvody, den 5 a proč ne Senekův půst, námitka s doklady (Rozpravy III, 2, 4; Diogenés Laertios VII, 116–117; Gellius XIX, 1; Dopisy 63 a 99) a kde je odpověď slabá, doložené × pozdější podání (Hadot, Irvine, Ellis, Beck), kontakty.
- **Testy:** `tyden.spec.ts` (námitka, pravidla, popisky polí, odkaz v deníku), `tydny.test.ts`. Dotčené testy prošly (vitest 46, Playwright 41: týden, Seneca, otázky, deník ze souboru); celé `npm test` prošlo (vitest 752, Playwright 570). Snímky v `Claude outputs/tyden/tyden-t-*` (stránka 390 světlá a 1440 tmavá, den 5, den 7 s poli, karta na kroku 8 cesty 34).

**Citáty a opakování.** V týdnu zazní každý citát jednou. V týdnu a atlasu dohromady dvakrát: `rozpravy-iii-2-4` (cesta 5, krok 7), `seneca-ira-iii-36-otazky` (portrét Seneky), `seneca-ep-13-4` (cesta 33, krok 5); ostatní jednou. Doložené detaily: večer, odnesené světlo a žena, která zmlkne (O hněvu III, 36, 3), stojí v portrétu citátem a ve dni 6 slovy, tedy dvakrát; Sextius v kartě Tři otázky večer a ve dni 6. Den 3 přebírá kartu Pět minut, jedna věc, jak podklady chtěly. „Zápisník“ u Marca je jen ve dni 1, „pokyny sám sobě“ jen ve dni 7.

**Co jsem z podkladů vzal a co ne, po dnech.**

1. Vzal jsem V, 1 a obě meze (člověk, který ubližuje; nechce se vstávat celé týdny) v jedné větě; II, 1 a Rukojeť 4 ne a „není to lenost“ vypadlo, aby se mez vešla do jedné věty.
2. Vzal jsem `rukojet-1-5` a otázku „Je tohle moje?“ s mezí o ubližování; druhou mez z podkladů („když nic necítíš, přestaň“) nese místo meze věta za citátem „Vztek ani strach tím nezmizí.“ a odkaz na Kamennou tvář.
3. Vzal jsem kartu Pět minut zkrácenou o věty mířící za týden; místo nepovinného hrnku (Epiktétos, láska a ztráta věci) dávám Senekův Dopis 13, 4, protože den je Senekův a citát odpovídá na otázku, proč na nejhorší myslet schválně; věta „nic nezmeškáš“ vypadla.
4. Vzal jsem IX, 30 v krátké podobě, mapu shora a návrat přes tři věci kolem sebe; konec IX, 30 a XII, 24 ne, oči zavřít je „klidně“, ne pokyn.
5. Vzal jsem 18, 6 (voják a val) a Senekovu otázku „Tohle bylo to, čeho jsem se bál?“, výčet toho, co do cvičení nepatří, i mez o jídle a těle; z 18, 5 a 18, 9 nic.
6. Vzal jsem tři otázky a zvyk se světlem a ženou; „Teď ti odpouštím“ jen jako slovo v mezi („odpusť si, jako si odpouštěl Seneca“), „nic nepřecházím“ ne, „každý večer v týdnu“ a věta o konci týdne vypadly.
7. Vzal jsem jednu větu sobě ve druhé osobě, poznámku a „žádný nepomohl je odpověď“; Epiktétovo denní psaní (Rozpravy I, 1, 25) jen v listu, větu „až ta věc přijde, všimni si…“ z karty dne 3 do dne 7 nepřevádím, vázala by den 7 na den 3.

**Nad čím jsem váhal.**

- **Meze dnů 1 a 2 pod nadpisem „Kdy přestat“.** Nejsou o přestávání, ale o tom, na co cvičení není. Pod nadpisem se čtou dobře; přepisovat je na „Přestaň, když…“ by je prodloužilo.
- **Den 2 bez meze o necitlivosti.** Mez má jednu větu a přednost dostal člověk, který ubližuje. Námitka je na první obrazovce a v odkazu.
- **„Proč…? Seneca…“ ve dnech 3 a 5.** Dva dny s otázkou před citátem; uvozovací věty jsem rozlišil („vysvětlil v dopise“, „odpověděl obrazem z vojska“), stavba zůstává podobná. Den 1, 2, 4 a 6 začínají jinak.
- **Sextius ve studentském textu.** V datech osob není, ale portrét Seneky ho jmenuje už v kartě; nechal jsem ho, nese původ otázek.

**`seneca-ep-18-9` v cestě „Kolik je dost?“, krok 4 (odpověď 3 po P6).** Nález: odstavec před citátem chválí, že se kynici „cvičili v nepohodlí tak dlouho, dokud je nepřestalo bolet“, a citát pokračuje „Cvičil se i Epikúros“: dny, kdy jen skrovně tišil hlad, aby viděl, jestli mu něco chybí. Studenta nevyzývá, ale omezování jídla podává jako vzorné cvičení. To je přesně to, co týden vylučuje, a student s potížemi s jídlem si to přečte jako návod. Doporučení: ve větvi `antika-doplnky` citát a uvozovací větu vyměnit za větu, která drží pointu kroku („Kynik i Epikúros tedy jedli chléb a pili vodu. Každý ale kvůli něčemu jinému.“) bez hladu, třeba `menoikeus-131-maza` („Ječná placka a voda dají tu nejvyšší slast, když je jí ten, kdo je potřebuje.“; v atlasu jednou, portrét Epikúra). Nic jsem neměnil.

## Co rozhodnout po T

Prázdná odpověď znamená souhlas s doporučením.

1. **Pole `poCitatu`** (odstavec za citátem dne) zůstane a unese i další týdny. Doporučuji.
   Odpověď:
2. **Den 3 se Senekovým Dopisem 13, 4** místo nepovinného hrnku z Rukojeti 3. Doporučuji.
   Odpověď:
3. **`seneca-ep-18-9` v cestě „Kolik je dost?“** vyměnit ve větvi `antika-doplnky` za `menoikeus-131-maza` nebo jinou větu bez hladu. Doporučuji.
   Odpověď:

## Po R (26. 10. 2026)

Záznam revize: `docs/revize/stoicky-tyden-2026-10-26.md`. **Verdikt: po opravách**, dva důležité nálezy, tři drobné, žádný blokující.

**Nálezy jednou větou.**

1. **[důležité] Námitka** na první obrazovce říká, že Epiktétos od žáků chtěl „něco jiného“ než snést věci bez hnutí; chtěl právě to a odmítal jen necitelnost sochy.
2. **[důležité] Meze dnů 3 a 4** nedrží pravidla týdne: den 3 nevylučuje nemoc a strach o někoho, den 4 u pocitu odcizení neříká, komu to říct.
3. **[drobné] Den 3:** spojovací věta připisuje Dopisu 13, 4 odpověď, proč na nejhorší myslet (ten říká „netrp předem“), a dny 3 až 5 začínají „Vyber“.
4. **[drobné] Den 5:** „odpověď na zprávu až večer“ odporuje „nikdo si nevšimne, že chybí“.
5. **[drobné] Den 2:** „Vztek ani strach tím nezmizí“ je přísnější než Epiktétos; stačí „hned nezmizí“.

**Opraveno rovnou:** nejednoznačná věta ve dni 4 („řekni si jednu“), nadtitulek karty týdne v Kam dál portrétů sjednocen na „Zkus to žít · 7 dní“, tři věty v listu pro učitele (uvozovky u dne 5, den 3 v tabulce mezí, věta o mezích na konci). Ověřeno: citáty týdne proti originálu, Senekova otázka, světlo a žena, „Epiktétos učil žáky“; kontrola fokusu na stránce týdne, kartách cest, portrétech a deníku na obou šířkách bez nálezu; celé `npm test` prošlo.

**Nad čím jsem váhal.**

- **Karta týdne na telefonu** je se sedmi dlaždicemi pod sebou vysoká (asi 800 px) a na kroku 8 cest 33 a 34 stojí pod kartou Zkus to žít. Autor chtěl týden vidět, nález jsem z toho nedělal.
- **Mez pod nadpisem „Kdy přestat“ stojí za cvičením,** student ji tedy čte až po pokynu. U dnů 3 a 4 to opravují první věty („malá věc“, „starost, která se týká jen tebe“); přesouvat mez nad text jsem nenavrhoval.
- **„Řekni to někomu, komu věříš“** zní po opravě ve dnech 1 až 4 a 7. Je to věta, kterou má student najít v každém dni, kde se může vrátit něco těžkého; opakování beru jako záměr, ne šablonu.

## Co rozhodnout po R

Prázdná odpověď znamená souhlas s doporučením.

1. **Opravit všech pět nálezů** podle hotového znění v záznamu revize. Doporučuji.
   Odpověď: bez odpovědi, tedy souhlas s doporučením (26. 10. 2026).
2. **Nová věta námitky:** „Česky se ‚stoicky‘ říká tomu, co člověk snese bez hnutí. Epiktétos chtěl po svých žácích klid, a přesto jim říkal:“. Doporučuji.
   Odpověď: bez odpovědi, tedy souhlas s doporučením (26. 10. 2026).

## Po O (26. 10. 2026)

**Opraveno, všech pět nálezů.**

1. **Námitka:** „Česky se ‚stoicky‘ říká tomu, co člověk snese bez hnutí. Epiktétos chtěl po svých žácích klid, a přesto jim říkal:“ přesně podle revize; test na první obrazovce hlídá i druhou větu.
2. **Meze dnů 3 a 4** vylučují nemoc a strach o někoho a říkají, komu to říct; v listu pro učitele řádky 3 a 4 tabulky mezí podle toho. Nový test v `tests/data/tydny.test.ts` hlídá obě meze a „komu věříš“ v mezích dnů 1 až 4 a 7.
3. **Den 3:** první odstavec začíná otázkou („Které malé věci se v nejbližších dnech trochu bojíš?“), spojovací věta nese Dopis 13, 4 jako to, „jak to se strachem bývá“.
4. **Den 5:** „večer bez seriálu“ místo „odpověď na zprávu až večer“, v listu pro učitele totéž.
5. **Den 2:** „Vztek ani strach tím hned nezmizí.“

**Kde jsem znění z revize upravil a proč.**

- **Den 3, první odstavec** má po úpravě šest vět, CLAUDE.md dovoluje čtyři. Rozdělil jsem ho na dva: co si vybrat, a tři otázky na pět minut.
- **Den 3, spojovací věta:** „Seneca ale příteli napsal“ bez „v dopise“. Den 5 má „Seneca na to v dopise odpověděl“ a „příteli napsal“ dopis říká i tak.
- **Den 3, mez:** „Nemoc, strach o někoho ani člověk, který ti ubližuje, sem nepatří: o tom řekni někomu, komu věříš.“ Revize navrhla „Na nemoc, strach o někoho ani na člověka… cvičení není“; spolu s mezí dne 2 („Na to, co ti dělá…, tohle cvičení není“) a dne 4 („Na ztrátu, nemoc… cvičení není“) by to byla stejná věta tři dny po sobě.
- **List pro učitele, den 3:** důvod v tabulce nově jmenuje případ z revize (blízký čeká na výsledky vyšetření) místo „žádní blízcí ani nemoc“, protože to už stojí v mezi.

**Neopraveno:** nic. Dny 4 a 5 dál začínají slovesem „vybrat“ („Vyber jednu starost“, „Ráno si vyber jedno pohodlí“); po změně dne 3 to už nejsou tři dny po sobě a každý vybírá něco jiného, tak jsem je nechal.

**Ověřeno očima studenta:** kdo truchlí nebo je nemocný, čte ve dni 3 i 4 výslovně, že jeho věc do cvičení nepatří, a komu to říct; den 5 nikde nesahá na jídlo ani na druhé lidi; den 2 už neříká, že cvičení na cit nepůsobí. Vitest týdne (16 testů) a `tyden.spec.ts` (16) prošly po sestavení; snímky `Claude outputs/tyden/tyden-o-*` (stránka na 390, dny 3 a 4). Celé `npm test` prošlo (vitest 753, Playwright 570).

**Do `docs/pouceni.md`** dvě věty: spojovací věta k námitce nesmí filozofovi upřít, co chtěl; mez představy nejhoršího vylučuje i nemoc a strach o někoho.

**Nad čím jsem váhal.**

- **„Sem nepatří“ ve dni 3** zní příkřeji než „cvičení na to není“. Je ale krátké a pod nadpisem „Kdy přestat“ se čte jako hranice cvičení, ne jako soud o studentovi; hned za ním je, komu to říct.
- **„Nemoc“ bez přivlastnění** (ve dni 3 i 4): kryje vlastní nemoc i nemoc blízkého, a to je záměr.

## Uzavření

Větev je po opravách hotová: stránka týdne, deník, vstupy z cest 5, 33, 34 a portrétů, zastavení `t:stoicky`, list pro učitele a opravy po revizi.

**Otázka pro autora (26. 10. 2026):** schvaluješ Stoický týden? Po schválení větev sloučím do hlavní větve a hlavní větev pošlu na GitHub, čímž se týden objeví na `https://czempi123.github.io/` (pořád s `noindex`). Další v pořadí z 26. 10. 2026 je `interaktivita-v1`.

Odpověď: schvaluji (autor 26. 10. 2026).

## Po Uzavření (26. 10. 2026)

Schváleno autorem 26. 10. 2026. Větev `stoicky-tyden` je sloučená do `main` (`--no-ff`) a hlavní větev je na GitHubu; workflow Zveřejnění na GitHub Pages týden nasadí na `https://czempi123.github.io/tyden/stoicky/` (pořád s `noindex`).

- **Testy:** `main` se od odbočení větve nezměnila, sloučený strom je tedy krok O (`87806a0`, celé `npm test` prošlo: vitest 753, Playwright 570) plus tento zápis v dokumentech. Celé testy jsem po sloučení znovu nepouštěl.
- **Archiv:** plán větve v `docs/archiv/plany/stoicky-tyden.md`, provedená zadání v `docs/archiv/zadani/stoicky-tyden.md`; řádek v `docs/plan.md` a Další větve v pořadí (další je `interaktivita-v1`).
- **Projekt Claude:** aktualizovaný `docs/plan.md`; plán větve z projektu odstraněn, protože žádná větev neběží (projekt drží jen plán běžící větve).
- **Na později z větve:** odpověď 3 po T (`seneca-ep-18-9` v cestě „Kolik je dost?“ vyměnit za větu bez hladu) patří do `antika-doplnky`; zkouška týdne se studenty, až je autor bude mít; další týdny (epikurejský, sokratovský) podle toho, jak se osvědčí tenhle.
