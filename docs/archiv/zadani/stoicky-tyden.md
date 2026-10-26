# Provedená zadání větve stoicky-tyden

Zadání kroků P6, K, T, R a O v plném znění, jak byla v plánu větve (`docs/archiv/plany/stoicky-tyden.md`). Přesunuto při uzavření 26. 10. 2026.

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

## Zadání R

Model: Opus 5.5 · high se skillem `atlas-revize` (perspektiva čtivosti se skillem `atlas-psani`).

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev stoicky-tyden. Krok R Stoického týdne: revize celé větve se skillem atlas-revize. Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch stoicky-tyden, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, skills/atlas-revize/SKILL.md, skills/atlas-psani/SKILL.md, tento plán (tabulku, Po K, Co rozhodnout po K, Po T, Co rozhodnout po T), z docs/podklady/stoicky-tyden.md oddíly Pravidla týdne, meze dnů a Nejsilnější námitka, v docs/design.md oddíl Komponenty › Týden cvičení, záznamy 26. 10. 2026 ke Stoickému týdnu v docs/rozhodnuti.md. Změny větve proti hlavní větvi: git diff main...stoicky-tyden --stat, pak jen soubory, které revize potřebuje.

1. Projdi větev perspektivami atlas-revize:
   - filozof a historik: každá věta dne, úvodu, námitky a listu pro učitele proti podkladům a citátům v zdroje.yaml (seneca-ep-18-6-val proti latině, Senekova otázka „Tohle bylo to, čeho jsem se bál?“, světlo a žena z O hněvu III, 36, „Epiktétos učil žáky“ u Rukojeti 1, 5); co je výklad (Hadot, moderní stoicismus) a co pramen;
   - student, kterého se téma bolestně týká (docs/pouceni.md): každý den otevři a čti očima studenta, kterému někdo ubližuje, který truchlí, je nemocný, má potíže s jídlem nebo se cítí odcizený; meze dnů, den 4 (pohled shora), den 5 (pohodlí), den 7 (psaní);
   - učitel: list ucitel/stoicky-tyden.md, zastavení t:stoicky v přípravě hodiny, promítání;
   - čtivost a lidský hlas podle atlas-psani: úvod, první věty dnů vedle sebe, uvozovací věty citátů, poCitatu (vrací se text k případu?), opakování napříč dny, kartami Zkus to žít v portrétech a cestami 5, 33 a 34;
   - uživatel: stránka /tyden/stoicky/ na 390 a 1440 px ve světlém i tmavém režimu, klávesnicí (scripts/kontrola-fokus.mjs), Hotovo, zrušení, Další den, den 7 a deník po obnovení, karta týdne na posledním kroku a přehledu cest 5, 33, 34, Kam dál v portrétech, deník bez přijatého týdne, export a nahrání deníku; snímky node scripts/snimky-listy.mjs a snimky-prvek.mjs do Claude outputs/tyden/, prohlédni je.
2. Drobnosti oprav rovnou (testy hlídají přesné znění: grep -rn v tests/, uprav v témže commitu). Zásadní nálezy zapiš do docs/revize/stoicky-tyden-<datum>.md ve formátu atlas-revize, seřazené podle dopadu, s hotovým zněním opravy a verdiktem.
3. Celé npm test jednou před posledním commitem, na Macu přes Desktop Commander na pozadí s výstupem do souboru.
4. Do plánu větve oddíl „Po R (datum)“ (verdikt, nálezy jednou větou, co je opravené rovnou) a „Co rozhodnout po R“ s doporučeními; hned za tím zadání kroku O (opravy po revizi). Rozhodnutí do docs/rozhodnuti.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/stoicky-tyden.md), nic dalšího do projektu nepřidávej. Commity česky a stručně, ve větvi, nic neposílej na GitHub.
```

## Zadání O

Model: Opus 5.5 · high se skillem `atlas-psani`.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev stoicky-tyden. Krok O Stoického týdne: opravy po revizi. Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch stoicky-tyden, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, skills/atlas-psani/SKILL.md (oddíly Citáty a Ať text nezní jako stroj), tento plán (tabulku, Po R, Co rozhodnout po R s odpověďmi) a záznam revize docs/revize/stoicky-tyden-2026-10-26.md celý.

1. Oprav nálezy 1 až 5 podle hotového znění v záznamu revize, s ohledem na odpovědi autora: námitka (src/content/tydny/stoicky.yaml, namitka.text), meze dnů 3 a 4, první dva odstavce dne 3, příklady dne 5, text za citátem dne 2. U nálezu 2 uprav i řádky 3 a 4 tabulky mezí v ucitel/stoicky-tyden.md, u nálezu 4 větu o pohodlí v oddílu Den 5 téhož listu.
2. Každé nové znění přečti očima studenta, kterému někdo ubližuje, který truchlí, je nemocný nebo má potíže s jídlem (docs/pouceni.md), a proti pravidlům atlas-psani (věty do 25 slov, žádná šablona napříč dny). Když hotové znění z revize nesedí, uprav ho a napiš proč.
3. Testy hlídají přesné znění: grep -rn v tests/ (hlavně tests/e2e/tyden.spec.ts) a uprav je v témže commitu. Po npm run build pusť PW_BEZ_BUILDU=1 npx playwright test tests/e2e/tyden.spec.ts a npx vitest run tests/data/tydny.test.ts; snímek node scripts/snimky-listy.mjs /tyden/stoicky/ tyden-o-390 390 light 4 2000 1 (VEN="Claude outputs/tyden") a snimky-prvek.mjs na dny 3 a 4, prohlédni je. Celé npm test jednou před posledním commitem, na Macu přes Desktop Commander na pozadí s výstupem do souboru.
4. Do docs/pouceni.md jednou větou, co se z revize má dodržovat napříč atlasem (spojovací věta k námitce nesmí filozofovi upřít to, co opravdu chtěl; mez cvičení o představě nejhoršího vylučuje i nemoc a strach o někoho).
5. Do plánu větve oddíl „Po O (datum)“ (co je opravené, co ne a proč, nad čím jsi váhal) a „Uzavření“ s otázkou na schválení, sloučení a push hlavní větve (nasadí web). Rozhodnutí do docs/rozhodnuti.md. Plán větve aktualizuj i v Projektu Claude (docs/plany/stoicky-tyden.md), nic dalšího do projektu nepřidávej. Commity česky a stručně, ve větvi, nic neposílej na GitHub.
```
