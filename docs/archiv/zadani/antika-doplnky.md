# Provedená zadání větve antika-doplnky

Zadání kroků v plném znění, jak byla v plánu větve (`docs/plany/antika-doplnky.md`), přesunutá při uzavření 3. 11. 2026.

## Zadání P6

Model: Sonnet 5.5 · high s vyhledáváním; sporná místa (citáty, přisouzení, Thalés a mýtus) Opus 5.5 · high.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Krok P6: podklady k filozofické části větve se skillem atlas-overeni. Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti, kromě míst, na která tě pošle tento plán.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/pouceni.md, tento plán celý (včetně odpovědí v Co rozhodnout před prvním krokem), v docs/architektura.md oddíly Deset velkých otázek, Osm období (řádky 1 a 2), Průřezové linie (Stoicismus) a Vazba na RVP G, v docs/plan.md oddíl Informační architektura a typy stránek, v docs/revize/antika-2026-10-25.md oddíl 10. Hotové podklady (docs/podklady/celek-*.md, data-obdobi-1-2.md) jen tam, kde hledáš už ověřený citát; nejdřív grep, pak oddíl.

1. Podkladový list docs/podklady/antika-doplnky.md podle šablony skillu atlas-overeni, s oddíly:
   a) Co je filozofie?: Thalés jako první přírodní vysvětlení (co je doložené, co tradované: Aristotelés, Metafyzika I, 3; Diogenés Laertios I); rozlišení mýtu, náboženství, filozofie, vědy a umění tak, aby šlo na středoškoláka a neodporovalo stránce Co je náboženství?; návrh pěti odpovědí na tutéž otázku pro vlastní pokus; disciplíny k deseti otázkám.
   b) Období 1 a 2: úvodní scéna každého období (skutečná událost, ne vymyšlená), otázky doby, kotvy z src/data/udalosti.yaml, které chybí, se zdrojem; Mezitím jinde u období 1 jednou dvěma větami (Konfucius, Buddha, Lao-c’), bez nových osob v datech.
   c) Čtyři směry (stoicismus, epikureismus, kynismus, Akademie): scéna založení, tři hlavní myšlenky, spor s jiným směrem, Zkus to žít (u stoicismu odkaz na Stoický týden místo nové výzvy), kdo navazoval; rodokmen jen z vztahy.yaml, chybějící vztah navrhni se zdrojem.
   d) Otázky 2 a 8: úvodní případ (u jedné z nich otázka před případem), pět až sedm hlasů jen od lidí se stránkou (src/content/osobnosti/ a medailonky), u každého odpověď na případ, myšlenka a citát; nejdřív hotové citáty ze src/data/zdroje.yaml a kolikrát už v atlasu zazní, nové jen ověřené s návrhem záznamu do zdroje.yaml.
   e) Pokusy Gygův prsten (Platón, Ústava II, 359c–360d) a zrcadlo času (Lucretius, O přírodě III, 972–977): co převzít z bloku platon-gyguv-prsten a kresby Zrcadlo, scéna, volba, změna podmínky, hlasy (u Gyga i Epikúros a smlouva o neškození, Hlavní myšlenky 31–35).
   f) Cesta 6, krok 4: náhrada za seneca-ep-18-9, věta bez hladu a omezování jídla, která drží myšlenku kroku (meze z docs/podklady/stoicky-tyden.md, den 5).
   g) Pět vztahů: Theofrastos → Aristotelés (učitel a žák), Chairefón a Kritón se Sókratem (znali-se), Karneadés a Chrýsippos (vliv-textem), každý se zdrojem a poznámkou podle docs/pouceni.md › Co se skládá z dat.
   h) Obrázky: návrh ke stránkám obou období, čtyř směrů a obou pokusů s licencí a odkazem; nic nestahuj.
2. Otevřené otázky a řádky do docs/podklady/k-overeni.md (oddíl antika-doplnky).
3. Do plánu větve oddíl „Po P6 (datum)“: co je ověřené, co ne, nad čím jsi váhal; „Co rozhodnout po P6“ s doporučeními a řádky Odpověď:. Plán větve aktualizuj i v Projektu Claude (docs/plany/antika-doplnky.md), nic dalšího do projektu nepřidávej. Commit ve větvi, nic neposílej na GitHub.
```

## Zadání P6N

Model: Opus 5.5 · high s vyhledáváním. Může běžet souběžně s K1.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Krok P6N: podklady ke stránkám Co je náboženství? a judaismus se skillem atlas-overeni. Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/pouceni.md (hlavně Student, kterého se téma bolestně týká), tento plán (tabulku, oddíl 6 Obsahu větve, Co rozhodnout před prvním krokem s odpověďmi, Po P6, pokud už je), v docs/architektura.md oddíly Náboženství světa a Vazba na RVP G (řádky 1 a 6), z docs/podklady/antika-doplnky.md oddíl a, pokud už existuje (rozlišení náboženství a filozofie musí sedět na obou stránkách).

1. Podkladový list docs/podklady/nabozenstvi-uvod.md podle šablony skillu atlas-overeni:
   a) Co je náboženství?: posvátné, mýtus, rituál, společenství; religionistika jako věda (Durkheim, Otto, Eliade: co kdo tvrdil, v kterém díle, nejsilnější námitka); úvodní scéna nebo pokus, ve kterém student nejdřív sám rozhodne, co z několika jevů je náboženství (bohoslužba, fotbalový fanklub, svatba, horoskop, minuta ticha), a teprve pak dostane rozlišení; jak mluvit o víře tak, aby se necítil dotčený věřící ani nevěřící student; vazba na otázku 9 a cestu 35 bez slibu, co kde bude.
   b) Judaismus: Tóra, smlouva, exil, rabínská tradice; jedna skutečná scéna nebo tradovaný příběh na začátek (vypráví se, že…) s pramenem; citáty jen z ověřených překladů (český ekumenický překlad, Mišna, Talmud), každý s návrhem záznamu do zdroje.yaml; vazby na Filóna Alexandrijského (je v datech) a zmínka o Maimonidovi, Spinozovi a Buberovi bez nových osob v datech; místa vzniku a šíření jen z mista.yaml, chybějící navrhni.
   c) Co do stránek nepatří: vykládání pravdivosti tradice, srovnávání „lepší a horší“, holokaust jen tam, kde nese myšlenku, a s mezí podle docs/pouceni.md.
   d) Obrázky: návrh s licencí a odkazem; nic nestahuj.
2. Otevřené otázky a řádky do docs/podklady/k-overeni.md (oddíl náboženství).
3. Do plánu větve oddíl „Po P6N (datum)“ a „Co rozhodnout po P6N“ s doporučeními a řádky Odpověď:. Plán větve aktualizuj i v Projektu Claude, nic dalšího do projektu nepřidávej. Commit ve větvi, nic neposílej na GitHub.
```

## Zadání K1

Model: Opus 5.5 · high; xhigh, když se zasekne (navigace, katalog zastavení). Odpovědi před prvním krokem a po P6 jsou zapsané výše a v `docs/rozhodnuti.md`.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Krok K1: šablony pěti nových typů stránek a cesty k nim, se skillem atlas-komponenta. Texty nepíšeš (to jsou T1 a T2); stránky naplň prozatímním textem z podkladů, označeným komentářem v souboru. Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md, skills/atlas-komponenta/SKILL.md, docs/styl.md, docs/pouceni.md (hlavně Co se skládá z dat a Technika), tento plán (tabulku, Obsah větve, Co rozhodnout před prvním krokem, Po P6, Co rozhodnout po P6, Po P6N, Co rozhodnout po P6N s odpověďmi), docs/design.md (tokeny, barvy období, oddíly o stránce a kartě), v src/content.config.ts kolekce obdobi, smery, pokusy, nabozenstvi a otazky. Jako vzor stránky otevři jen src/pages/osobnost/[id].astro a src/pages/otazka/[otazka].astro, z dat src/data/obdobi.yaml a udalosti.yaml.

1. Stránka období /obdobi/<slug>/: hlavička v barvě období, úvodní scéna, malá osa kotev z udalosti.yaml, otázky doby, lidé a směry z dat (vzor Lidé a směry), cesty období, výřez mapy s odkazem do Mapy a času; prázdná část se neukáže. Pás období (PasObdobi) na Domů a v Lidech vede na stránku, když existuje, jinak jako dnes.
2. Stránka směru /smer/<id>/: založení, tři myšlenky, rodokmen z vztahy.yaml (učitel a žák), spor, Zkus to žít, kam dál; štítky směrů v Lidech a na stránkách osob odkazují na stránku, když existuje. Drobečky Stoického týdne přes stránku stoicismu.
3. Stránka pokusu /pokus/<slug>/: scéna, Volba, Změň jednu věc nebo kresba (tentýž blok platon-gyguv-prsten, tatáž kresba Zrcadlo), co řekli filozofové, kam dál; odkaz z portrétu Platóna a z cesty 8.
4. Co je filozofie? (/co-je-filozofie/) a Náboženství (/nabozenstvi/ a /nabozenstvi/<slug>/) podle odpovědí 3 a 8; u náboženství i schéma citátu bez osoby v datech (pole `tradice`) a pole `mista` v kolekci `nabozenstvi` podle odpovědí 8 a 9 po P6N (návrh v docs/podklady/nabozenstvi-uvod.md › Návrh dat); vstup z Domů, z přehledu otázek a z Lidí a směrů. Rozhodni, jestli Co je filozofie? potřebuje vlastní kolekci, nebo stačí stránka s MDX; zapiš do docs/design.md.
5. Navigace a vyhledávání: hlavička a spodní lišta beze změny; nové typy v Pagefind, v drobečcích a v Kam dál. Příprava hodiny: zastavení z nových stránek (bloky, kresby, kapitoly s kotvami) a jejich podoby na plátně v docs/design.md.
6. Testy a snímky. Vitest: schémata, odkazy z pásu období a štítků směrů jen na existující stránky, rodokmen z dat, katalog zastavení. Playwright: každá nová stránka na 390 a 1440 px, světlý i tmavý režim, klávesnice, blok Gygův prsten sdílí stav s portrétem Platóna. node scripts/snimky-listy.mjs na všechny nové stránky. Celé npm test jednou před posledním commitem; npm spouštěj na Macu přes Desktop Commander, ne v device_bash. Restartuj náhled (CLAUDE.md › Práce na autorově Macu).
7. Do plánu větve oddíl „Po K1 (datum)“: co je hotové, co ne, nad čím jsi váhal; „Co rozhodnout po K1“, pokud je co. Rozhodnutí do docs/rozhodnuti.md. Plán aktualizuj i v Projektu Claude. Commity česky a stručně, ve větvi, nic neposílej na GitHub.
```

## Zadání T1

Model: Opus 5.5 · high se skilly `atlas-psani`, `atlas-osobnost`, `atlas-cesta` a `atlas-data`. Odpovědi po P6 a po K1 jsou zapsané výše.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Krok T1: všechny texty filozofické části větve a změny v datech. Šablony jsou hotové z K1; komponenty měň, jen když text bez úpravy nejde (pak to napiš do Po T1). Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, skills/atlas-psani/SKILL.md, ze skillu atlas-osobnost oddíly o stránce směru a Zkus to žít, ze skillu atlas-cesta oddíly o myšlenkovém pokusu a stránce velké otázky, skills/atlas-data/SKILL.md (vztahy), tento plán (tabulku, Obsah větve, odpovědi, Po P6, Po K1), docs/podklady/antika-doplnky.md celý. Jako vzor tónu jen jednu hotovou stránku otázky (src/content/otazky/jak-zit.mdx) a úvod jednoho portrétu.

1. Co je filozofie?, stránky období 1 a 2, čtyři směry, pokusy Gygův prsten a Zrcadlo, stránky otázek 2 a 8 (případ, hlasy, citáty). Každý text podle atlas-psani: úvod řekne, o čem stránka je a co si student odnese, ne osnovu; citát odpovídá na otázku textu; nic nezní jako stroj. Srovnej úvody a závěry nových stránek mezi sebou a s hotovými stránkami otázek (revize antiky, nálezy 1, 2 a 10), ať nemluví jednou šablonou.
2. Data: nové citáty do zdroje.yaml (ověřené v P6), pět vztahů do vztahy.yaml se zdrojem, chybějící kotvy do udalosti.yaml; testy, které drží přesné seznamy (otazka.spec.ts, vstupy v hlavičkách profilů, Dva životy, Kdo žil dřív?), uprav v témže commitu podle vykreslených stránek z dist/. Hlavičky profilů s víc otázkami vyfoť na telefonu (docs/pouceni.md › Co se skládá z dat).
3. Cesta 6, krok 4: náhrada citátu seneca-ep-18-9 podle P6 a navázání textu kroku.
4. Obrázky stáhni jen ty, které autor v odpovědích po P6 povolil, s licencí v datech.
5. Testy jen dotčené při práci, celé npm test jednou před posledním commitem; snímky listů nových stránek a dotčených profilů.
6. Do plánu větve oddíl „Po T1 (datum)“ a „Co rozhodnout po T1“, pokud je co. Plán aktualizuj i v Projektu Claude. Commity česky, ve větvi, nic neposílej na GitHub.
```

## Zadání T2

Model: Opus 5.5 · high se skilly `atlas-psani` a `atlas-osobnost`. Odpovědi po P6N a po K1 jsou zapsané výše.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Krok T2: texty stránek Co je náboženství? a judaismus. Šablona je hotová z K1. Čti jen, co krok potřebuje; archiv nečti.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (hlavně Student, kterého se téma bolestně týká), skills/atlas-psani/SKILL.md, tento plán (Obsah větve, oddíl 6, odpovědi po P6N, Po K1, Po T1), docs/podklady/nabozenstvi-uvod.md celý a z docs/podklady/antika-doplnky.md oddíl a. Hotovou stránku Co je filozofie? si přečti celou: obě stránky musí rozlišovat filozofii a náboženství stejně.

1. Co je náboženství?: úvod, vlastní pokus před rozlišením, posvátné, mýtus, rituál, společenství, religionistika jako věda, seznam tradic (zatím judaismus, ostatní bez odkazu a bez slibu). Atlas popisuje zevnitř i zvenku a o pravdivosti nerozhoduje; každou větu čti očima věřícího i nevěřícího studenta.
2. Judaismus: scéna na začátek, Tóra, smlouva, exil, rabínská tradice, vazby (Filón Alexandrijský s odkazem, ostatní jména bez odkazu), místa z mista.yaml.
3. Citáty a místa do dat podle P6N; obrázky jen povolené.
4. Testy dotčené, celé npm test před posledním commitem; snímky listů obou stránek.
5. Do plánu oddíl „Po T2 (datum)“ a „Co rozhodnout po T2“, pokud je co. Plán aktualizuj i v Projektu Claude. Commity česky, ve větvi, nic neposílej na GitHub.
```

## Zadání K2

Model: Opus 5.5 · high; xhigh, když se zasekne (čtení deníku napříč cestami a otázkami).

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Krok K2: deník na konci období „Tvoje antika“, se skillem atlas-komponenta a texty podle atlas-psani. Čti jen, co krok potřebuje; archiv nečti.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md, skills/atlas-komponenta/SKILL.md, skills/atlas-psani/SKILL.md, docs/styl.md, docs/pouceni.md, tento plán (Obsah větve, oddíl 7, odpověď 9, Po T1, Po T2), v docs/revize/antika-2026-10-25.md oddíl 12 řádek Deník na konci období, v docs/plan.md oddíl Pedagogické pilíře (Moje filozofie). Z kódu src/lib/denik.ts, src/lib/strany.ts, src/lib/zaver.ts a stránku deníku src/pages/denik/index.astro.

1. Logika v src/lib: z deníku poskládej, co student v antice udělal (závěrečná pravidla cest, stanoviska u otázek včetně 2 a 8, konečné polohy ve Sporech, volby v blocích, které Kdo je na tvé straně už mapuje na myslitele) a ke každé velké otázce myslitele, kterým je nejblíž, s důvodem z jeho vlastní odpovědi. Žádná procenta, skóre, typy osobnosti ani „chybí ti“; co student neudělal, se neukáže. Vitest na prázdný, částečný a plný deník a na starý deník bez nových polí.
2. Komponenta a místo podle odpovědi 9: přehled po otázkách, u každé studentova vlastní věta nahoře a myslitelé pod ní; student může stanovisko u otázky upravit (Na začátku × Teď platí i tady). Vstup z deníku a ze stránky období 2; export deníku beze změny formátu, verze zůstává.
3. Krátké texty (nadpis, úvod jednou dvěma větami, prázdný stav) podle atlas-psani: nic nehodnotí, nic nevyčítá.
4. Testy a snímky: Playwright na 390 a 1440 px, světlý i tmavý režim, klávesnice, čtečka; deník po obnovení stránky; snimky-listy.mjs. Celé npm test před posledním commitem, na Macu přes Desktop Commander.
5. Do plánu oddíl „Po K2 (datum)“ a „Co rozhodnout po K2“, pokud je co. Rozhodnutí do docs/rozhodnuti.md. Plán aktualizuj i v Projektu Claude. Commity česky, ve větvi, nic neposílej na GitHub.
```

## Zadání R

Model: Opus 5.5 · high se skillem `atlas-revize`.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Krok R: revize celé větve se skillem atlas-revize (čtení očima filozofa, historika, studenta, učitele a uživatele) a atlas-psani. Drobnosti oprav rovnou, zásadní nálezy seřaď podle dopadu s návrhem opravy. Archiv nečti.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, skills/atlas-revize/SKILL.md, skills/atlas-psani/SKILL.md, tento plán celý, oba podkladové listy větve. Sestav web a projdi každou novou stránku v prohlížeči na 390 a 1440 px.
1. Zvlášť zkontroluj: Co je filozofie? a Co je náboženství? rozlišují stejně; stránky období a směrů neříkají totéž co portréty slovo od slova; nové stránky otázek a úvody nemluví šablonou hotových (revize antiky, nálezy 1, 2, 10); Tvoje antika nic nehodnotí a funguje s prázdným, částečným i plným deníkem; náboženství očima věřícího i nevěřícího studenta; citát nejvýš dvakrát v celku; každý odkaz z pásu období, štítků směrů a Kam dál vede na existující stránku; příprava hodiny zná nová zastavení.
2. Záznam docs/revize/antika-doplnky-<datum>.md s verdiktem a nálezy; do plánu oddíl „Po R (datum)“ a „Co rozhodnout po R“ s doporučeními a řádky Odpověď:. Plán aktualizuj i v Projektu Claude. Commit ve větvi, nic neposílej na GitHub.
```

## Zadání O

Model: Opus 5.5 · high.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Krok O: opravy všech nálezů revize podle odpovědí po R a úprava skillů. Archiv nečti.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/pouceni.md, tento plán (tabulku, Po R, Co rozhodnout po R s odpověďmi) a záznam revize větve.
1. Oprav nálezy v pořadí dopadu; texty podle atlas-psani.
2. Skilly: atlas-osobnost (stránka směru), atlas-cesta (stránka pokusu, stránky otázek 2 a 8), atlas-komponenta (nové šablony, Tvoje antika), atlas-revize (co hlídat u stránek z dat a u náboženství); poučení z větve do docs/pouceni.md; kopie skillů ve skills/ a v účtu Claude stejné. Poznámky pro atlas-obdobi do skills/atlas-obdobi/poznamky.md (šablona období, směry, náboženství doby).
3. Celé npm test, snímky dotčených stránek. Do plánu oddíl „Po O (datum)“ a oddíl Uzavření s otázkou pro autora. Plán aktualizuj i v Projektu Claude. Commit ve větvi, nic neposílej na GitHub.
```

## Zadání Uzavření

Model: Opus 5.5 · medium.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Uzavření větve po schválení autorem. Archiv nečti.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md a v tomto plánu tabulku, oddíl Po O a Uzavření s odpovědí. Bez souhlasu v odpovědi nic neslučuj.
1. git switch main, git merge --no-ff antika-doplnky, celé npm test, git push origin main. Počkej, až kontroly na GitHubu doběhnou (gh run list), a podívej se na nasazený web.
2. Plán větve a záznam revize do docs/archiv/, řádek v docs/plan.md (rozcestník a Další větve v pořadí). V Projektu Claude plán větve odstraň a aktualizuj docs/plan.md. Commit v hlavní větvi a push.
```
