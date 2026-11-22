# Větev denik-v2: zadání kroků

Zadání kroků větve denik-v2 ke zkopírování do nového chatu. Plán, stav a oddíly Po … jsou v `docs/plany/denik-v2.md` (rozdělené 22. 11. 2026, aby se plán vešel do Projektu Claude).

## Zadání K1

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2 (git switch denik-v2). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíl Technika celý) a v docs/plany/denik-v2.md oddíly Co platí, 2, 3, Formáty, Otázky pro autora a Po Plán. Načti skill atlas-komponenta. V src/lib/denik.ts čti jen typy, sCitatem, rozeberDenik a spojDeniky.

Nejdřív kontroly na GitHubu (Po Plán): běh 45017169458 po pushi herna-v1 spadl na tests/e2e/herna-k2.spec.ts:278 (po klepnutí do slepé mapy Kde to bylo? na 390 px žádný .spendlik; na Macu test prochází) a pak ho zrušil limit 20 minut v .github/workflows/kontroly.yml. Log si stáhni (curl na api.github.com/repos/czempi123/czempi123.github.io/actions/jobs/137191863017/logs, nebo gh run view --log z cloudu), najdi, proč dotyk na GitHubu nezapíchne špendlík (pomalejší stroj, načtení mapy, pozice klepnutí), a oprav test nebo komponentu tak, aby nebyl závislý na rychlosti. Limit zvedni na 30 minut. Do docs/pouceni.md › Technika jedna věta o příčině.

Pak postav datový základ větve, bez UI:
1. Kartičky v deníku podle Formátů: typ Karticka, pole karticky, funkce přidat, vyndat, ohodnotit (Vím, Zopakuj si), naRade(d, dnes) a hromadka(d, dnes, 5), místní datum bez hodin. Kartička, jejíž zdroj v deníku ani v datech už není, se v hromádce neukáže.
2. Citáty: poznamka a upraveno u CitatVDeniku, CITATY_NEJVYS 300 bez tichého výpadku (nad limitem se citát nepřidá a volající to pozná), ulozPoznamkuCitatu.
3. rozeberDenik a spojDeniky znají karticky (vyhraje novější kdy) a poznámku citátu (vyhraje novější upraveno); export je obsahuje beze změny exportuj.
4. Testy ve Vitestu: rozestup přes přihrádky, Zopakuj si vrací do první, týden a měsíc bez návštěvy (hromádka zůstane nejvýš pět, nic se neztratí), půlnoc, spojení dvou deníků, starý deník bez polí, plná sbírka.
Kde si nejsi jistý, zvol nejlepší cestu a zapiš, nad čím jsi váhal. Pusť dotčené testy, pak celé npm test na pozadí s výstupem do souboru. Commit ve větvi denik-v2, na GitHub nic dalšího. Do plánu dopiš oddíl Po K1 (co vzniklo, výsledky testů, nad čím jsi váhal), uprav tabulku Kroky a nahraj docs/plany/denik-v2.md do Projektu Claude. Ve zprávě autorovi: co vzniklo, co jsi zvolil a celý prompt kroku K2 s modelem a úsilím (je v plánu). Zastav se.
```

## Zadání K2

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíly Bloky, Co se skládá z dat a Technika) a v docs/plany/denik-v2.md oddíly Co platí, 1, Formáty, Otázky pro autora a Po K1. Načti skill atlas-komponenta. Podívej se jen na to, co krok potřebuje: src/pages/denik/antika.astro, src/components/denik/_katalog-obdobi.ts, src/lib/herna/pary.ts a citaty.ts (prozrazuje), src/lib/herna/verdikt.ts, src/lib/kresby.ts, schéma pojmů v src/lib/pojmy.ts a hlasů v src/content.config.ts.

Postav Co ti zůstalo? pro antiku podle oddílu 1 a Formátů:
1. Skladatel otázek z dat (čisté funkce v src/lib/herna/, testy ve Vitestu): tři druhy (pojem v situaci ze situací Párů nebo z priklad bez tvaru pojmu, hlas k případu ze tří hlasů téže otázky, obraz a otázka z kresby a cesty), u každé otázky potkal; výběr kola podle deníku (jen prošlé, osm otázek, nejvýš čtyři jednoho druhu, nikdy dva stejné po sobě, semínko z čísla kola, pod čtyři otázky pozvánka). Kontrola při sestavení: žádná situace nejmenuje svůj pojem, každá otázka má tři různé možnosti a vysvětlení z dat. Výpis všech otázek antiky skriptem do Claude outputs/, ať je T a R přečtou jako text.
2. Ostrov CoTiZustalo.svelte: jedna otázka po druhé, jedna odpověď, rub „Víš.“ nebo „Zopakuj si.“ s vysvětlením a odkazem zpět (dvojice slov vedle té ve verdikt.ts, podle Co platí), konec kola bez počtu se seznamem Zopakuj si, Dát do kartiček (funkce z K1) a Nové kolo. Stav v bloky deníku.
3. Oddíl Co ti zůstalo? na stránce Tvoje antika pod přehledem; ukázka v dílně s připraveným deníkem.
Texty piš pracovně krátce; učeše je krok T. Snímky stránky Tvoje antika (prázdný deník, prošlé dvě cesty, konec kola) na 390 a 1440 px ve světlém i tmavém režimu do Claude outputs/ a prohlédni je. Ovládání klávesnicí, čtečka (role, aria-live u rubu), omezený pohyb. Testy v Playwrightu pro průchod kolem. Dotčené testy, pak celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po K2, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co vzniklo, nad čím jsi váhal a celý prompt kroku K3 s modelem a úsilím. Zastav se.
```

## Zadání K3

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíly Bloky, Student, kterého se téma bolestně týká, a Technika) a v docs/plany/denik-v2.md oddíly Co platí, 2, Formáty, Otázky pro autora a Po K2. Načti skill atlas-komponenta. Z kódu čti jen src/components/ostrovy/Denik.svelte (rozvržení oddílů), lístek zápisu v kapitole, src/components/denik/SbirkaDeniku.svelte a stránku pojmu /pojem/<id>/, z K2 typy v src/lib/herna/zustalo.ts (OtazkaZustalo) a funkci katalogZustalo v src/lib/herna/zustalo-data.ts.

Postav kartičky v deníku podle oddílu 2:
1. Oddíl Kartičky v Můj deník pod Návratem, jen když student kartičky má: hromádka na dnes (nejvýš pět), kartička s lícem a rubem podle tabulky zdrojů, otočení (tlačítko, ne jen klepnutí na kartu; při omezeném pohybu bez animace), Vím, Zopakuj si a Vyndat z kartiček, po hromádce Na dnes stačí a nepovinně Ještě pět. Nikde počet čekajících, datum dalšího opakování ani zameškané dny. Funkce bere z K1 (hromadka s parametrem zdrojExistuje z dat: pojmy a otázky kvízu, které existují; Po K1). Prázdný stav s tlačítkem Přidat pojmy, které jsi potkal (pojmy z vyskyty, které student navštívil).
2. Tlačítko Do kartiček (stisknuté = kartička existuje, druhý stisk ji vyndá) u výstřižku ve sbírce, u lístku zápisu s textem (pravidlo, odpověď Teď, sebehodnocení; ne u Volby bez důvodu) a na stránce pojmu. Konec kola Co ti zůstalo? už kartičky přidává z K2 (zdroj zustalo, ref = id otázky); líc a rub skládej z katalogZustalo([1, 2]) a na stránku deníku dej jen id, podnět, zadání, text správné možnosti, vysvětlení a odkaz zpět (celý katalog má 77 kB).
3. Když otázka 2 pro autora dopadla ne, kartička z vlastního zápisu nemá Vím a Zopakuj si, jen Vrátit za čas a Stačí; jinak podle Formátů.
4. Tečka na ikoně Deníku podle otázky 1 pro autora (výchozí: kartičky ji nerozsvítí).
Texty pracovně krátce, učeše je T. Snímky deníku (prázdné kartičky, hromádka, rub každého zdroje, Na dnes stačí) na 390 a 1440 px ve světlém i tmavém režimu do Claude outputs/ a prohlédni je; klávesnice, čtečka, omezený pohyb, skript scripts/kontrola-fokus.mjs. Testy v Playwrightu: přidání ze všech zdrojů, hodnocení, deník po týdnu (posunuté datum v testu). Dotčené testy, pak celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po K3, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co vzniklo, nad čím jsi váhal a celý prompt kroku K4 s modelem a úsilím. Zastav se.
```

## Zadání K4

Opus 5.5 · medium, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíl Technika) a v docs/plany/denik-v2.md oddíly Co platí, 3, Formáty a Po K3. Načti skill atlas-komponenta. Z kódu čti src/components/ui/Citat.astro, src/scripts/vystrihnout.ts, src/components/denik/SbirkaDeniku.svelte a jen ta místa, kde se citát vykresluje.

Postav vystřižené citáty podle oddílu 3:
1. Nejdřív výpis: grepem najdi všechna místa, kde se vykresluje citát ze zdroje.yaml (Citat.astro i kompaktní, ostrovy jako OsaHlasu a strany Sporu, hry po odkrytí), a zapiš do Po K4, které nůžky mají a které dostanou. Pak nůžky doplň podle pravidla (celý citát, nic už neskrývá; ve hrách až po odkrytí), v ostrovech stejným data-vystrihnout, aby vystrihnout.ts fungoval všude.
2. Výstřižek ve sbírce: papír období, střižený okraj a páska podle docs/design.md, poznámka Proč sis ho vystřihl? (nepovinná, perem studenta, ulozPoznamkuCitatu z K1), Do kartiček z K3, Vyndat ze sbírky.
3. Stránka Moje sbírka /denik/sbirka/ se všemi výstřižky (nejnovější nahoře), odkaz na ni z části sbírky v kapitole deníku; Vytisknout (tisková podoba: lístky na A4 bez lišt a tlačítek) a Stáhnout jako text podle Formátů.
4. Plná sbírka (300): nůžky citát nevystřihnou a řeknou proč.
Texty pracovně krátce, učeše je T. Snímky sbírky a stránky Moje sbírka na 390 a 1440 px ve světlém i tmavém režimu a náhled tisku (PDF z Playwrightu) do Claude outputs/ a prohlédni je; klávesnice a čtečka. Testy v Playwrightu: nůžky na nových místech, poznámka, stažený text. Dotčené testy, pak celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po K4, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co vzniklo, nad čím jsi váhal a celý prompt kroku T s modelem a úsilím. Zastav se.
```

## Zadání P6 (jen při potřebě)

Sonnet 5.5 · high s vyhledáváním, nový chat. Spouští se, jen když krok T zapíše do Po T tvrzení, které v ověřených datech není.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/pouceni.md (oddíl Prameny a formulace) a v docs/plany/denik-v2.md oddíly Co platí a Po T. Načti skill atlas-overeni. Ověř jen tvrzení, která krok T vypsal v Po T jako chybějící v datech; podkladový list docs/podklady/denik-v2.md podle skillu, doporučená formulace u každého. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po P6, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co se ověřilo a co ne a celý prompt kroku, který čeká (T znovu, nebo R), s modelem a úsilím. Zastav se.
```

## Zadání T

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíly Bloky, Celek, Student, kterého se téma bolestně týká, a Co se skládá z dat) a v docs/plany/denik-v2.md oddíly Proč, Co platí, 1 až 3 a Po K1 až Po K4. Načti skill atlas-psani.

Napiš a učeš všechny studentské texty větve: úvod oddílu Co ti zůstalo? (o čem to je a co si student odnese, jednou až dvěma větami, bez metodických slov), zadání tří druhů otázek, pozvánku pod čtyři otázky, konec kola, texty kartiček (nadpis, úvod, výzvy na líci, Na dnes stačí, prázdný stav, Dnes žádná), sbírku a stránku Moje sbírka (titulek, perex, poznámka, tisk, stažení, plná sbírka) a hlavičku staženého textu. Přečti výpis všech otázek Co ti zůstalo? z K2 jako text: každá situace musí poctivě patřit jedinému pojmu, odpovědi hlasů se musí lišit tím, čím se hlasy liší, a vysvětlení nesmí říct víc než data. Kde by věta potřebovala nové tvrzení, nepiš ji a zapiš ji do Po T pro P6. Před opravou věty ji najdi v tests/ a test uprav v tomtéž commitu. Snímky změněných míst na 390 px do Claude outputs/. Dotčené testy, pak celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po T, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co vzniklo, nad čím jsi váhal a celý prompt dalšího kroku (P6, když něco chybí, jinak R) s modelem a úsilím. Zastav se.
```

## Zadání R

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v docs/plany/denik-v2.md oddíly Proč, Co platí, 1 až 3 a Po K1 až Po T. Načti skill atlas-revize (s atlas-psani). Spusť npm run dev na pozadí podle CLAUDE.md.

Zreviduj větev očima filozofa, historika, studenta, učitele a uživatele. Zvlášť: (1) Co ti zůstalo?: projdi celý výpis otázek antiky; sedí každá situace jen na jeden pojem, poznají se hlasy podle myšlenky a ne podle slova, neříká vysvětlení víc než data, nezní rub „Zopakuj si.“ jako výtka? (2) Kartičky: působí jako hra, nebo jako povinnost? Hledej každou stopu odpočtu, počtu a série, i v textu tlačítek; zkus deník po týdnu a po měsíci. Kartička z vlastního zápisu v celku o smrti nebo o strachu: co uvidí student po třech týdnech bez varování? (3) Citáty: nůžky nikde neprozradí odpověď hry; tisk a stažený text čte i učitel. (4) Zásada aktivit a pravidla pestrosti 5 a 14 (docs/plany/po-auditu.md). (5) Klávesnice, čtečka, omezený pohyb, 390 a 1440 px, světlý a tmavý režim, export a spojení deníku ze souboru. Drobnosti oprav rovnou, zásadní nálezy seřaď podle dopadu s návrhem opravy do docs/revize/denik-v2-<datum>.md. Celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po R s otázkami jen pro autora (prázdná odpověď = souhlas s doporučením), tabulka Kroky a celé Zadání O, nahraj plán do Projektu Claude. Ve zprávě autorovi: verdikt, nálezy, otázky a celý prompt kroku O s modelem a úsilím. Zastav se.
```

## Zadání O

Opus 5.5 · high, nový chat. Celé znění doplní krok R podle nálezů; kostra:

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v docs/plany/denik-v2.md oddíly Co platí a Po R (s odpověďmi autora; prázdná = souhlas s doporučením) a záznam revize docs/revize/denik-v2-<datum>.md. Načti skilly, které nálezy potřebují (atlas-komponenta, atlas-psani). Oprav všechny nálezy podle odpovědí, poučení z revize připiš jednou větou do docs/pouceni.md. Snímky opravených míst do Claude outputs/, celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po O s otázkou jen pro autora, jestli větev schvaluje ke sloučení, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co se opravilo, otázka a celý prompt Uzavření s modelem a úsilím. Zastav se.
```

## Zadání Uzavření

Opus 5.5 · medium, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md a v docs/plany/denik-v2.md oddíly Kroky, Otázky pro autora, Po Plán, Po O (s odpovědí autora) a Co zůstává na později. Nejdřív se autora zeptej, jestli je u Macu: když ano, projdi s ním VoiceOverem postup z docs/archiv/plany/herna-v1.md › Po O (design-v2, herna-v1) a k němu Co ti zůstalo?, kartičky a Moje sbírku; nálezy oprav, nebo zapiš na později. Když ne, VoiceOver vynech a zapiš to.

Když autor v Po O větev schválil (prázdná odpověď = souhlas): git merge --no-ff denik-v2 do main, celé npm test na main na pozadí. Push: git fetch; main pošli na GitHub stejně jako v Po Plán (git bundle přes Claude outputs, push z cloudu; autor to výslovně povolil, otázka 3); když push nejde, nic dalšího nezkoušej a zapiš to. Po pushi kontrola nasazení: běh kontrol přes api.github.com/repos/czempi123/czempi123.github.io/actions/runs a nasazený web na 390 a 1440 px (ZAKLAD=https://czempi123.github.io node scripts/snimky-listy.mjs pro /denik/antika/, /denik/sbirka/, /denik/ a jednu stránku pojmu) do Claude outputs/; když dosud neproběhla kontrola z herna-v1, udělej ji taky a dopiš ji tamtéž. Plán větve přesuň do docs/archiv/plany/denik-v2.md, záznam revize do docs/archiv/revize/, oprav odkazy (grep), řádek denik-v2 v docs/plan-vetve.md, dopiš Po Uzavření. V Projektu Claude nahraď plán větve plánem další větve film-0 (docs/plany/film-0.md s prvním zadáním podle po-auditu.md › Větve) a nahraj docs/plan-vetve.md. Ve zprávě autorovi: co se sloučilo a nasadilo, co zůstalo na později a celý prompt prvního kroku film-0 s modelem a úsilím. Zastav se.
```
