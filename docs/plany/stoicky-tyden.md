# Plán větve stoicky-tyden: Stoický týden

Architektura slibuje sérii sedmi krátkých cvičení v duchu Zkus to žít, jedno na den, kterou si student spustí po cestě 5, 33 nebo 34 a učitel ji může dát třídě jako týdenní výzvu (`docs/architektura.md` › Stoický týden). Atlas má dnes osmnáct karet Zkus to žít, každá je výzva na týden; žádná neprovede studenta týdnem den po dni. Tahle větev týden postaví: podklady ke cvičením, stránku týdne, propojení s deníkem a místy, odkud se spouští, a list pro učitele. Větev založena z hlavní větve 26. 10. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: zkouška se studenty měla jít před týdnem (rozhodnutí 25. a 26. 10. 2026), autor ale zatím studenty nemá. Atlas je zveřejněný s `noindex` a čeká na ně; mezitím pokračuje pořadí z 26. 10. 2026 další větví.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| P6 | Podklady: sedm cvičení, prameny, citáty, meze, co už atlas má | Sonnet 5.5 · high s vyhledáváním; Opus 5.5 · high u sporných pramenů | hotovo 26. 10. 2026 (Po P6) |
| K | Stránka týdne a deník: nová komponenta podle `atlas-komponenta` | Opus 5.5 · high (xhigh při zaseknutí) | po P6 a odpovědích |
| T | Texty sedmi dnů, úvod, vstupy z cest a profilů, list pro učitele | Opus 5.5 · high se skilly `atlas-psani` a `atlas-cesta` | po K |
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
   Odpověď:
3. **Dny 3 a 6** s vlastním krátkým zněním a odkazem na celé cvičení v cestě 33 a portrétu Seneky. Doporučuji.
   Odpověď:
4. **Učitel:** týden jako zastavení v přípravě hodiny a list `ucitel/stoicky-tyden.md`. Doporučuji.
   Odpověď:

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
