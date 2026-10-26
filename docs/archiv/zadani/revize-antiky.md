# Provedená zadání větve revize-antiky

Plné znění zadání, která už proběhla. Stav a výsledky jsou v plánu větve `docs/plany/revize-antiky.md`.

## Zadání S

V novém chatu projektu Atlas s připojenou složkou Atlas a zapnutým Desktop Commanderem. **Fable 5.1 · high.** Běží dlouho; nech ho pracovat a vrať se k hotovému záznamu.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Krok S větve revize-antiky: souhrnná revize celé antiky (P11). Plán větve je v projektu Claude i v repozitáři jako docs/plany/revize-antiky.md; řiď se oddílem „Co revize prověří“ (devět bodů). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv otevři jen tam, kde to plán jmenuje.

0. git switch revize-antiky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, skill atlas-revize (kontrolní seznam platí pro každou stránku; plán větve přidává pohled napříč) a skill atlas-psani (čtivost, úvody, citáty, lidský hlas; v oddílu Postup při revizi jsou příkazy, které vypíšou úvody cest a první věty kroků vedle sebe). Restartuj náhled npm run dev.

1. Inventura: vypiš si všechny stránky antiky (cesty, osobnosti, medailonky, otázky, deník, mapa, hodina), délky cest přes scripts/slova-cesta.mjs, seznam kreseb a animací v src/components/ostrovy s tím, na kterých stránkách jsou (a které typy stránek nemají žádnou), a citátů podle id v src/content (které id se používá na víc stránkách). Inventuru dej do záznamu jako první oddíl.

2. Čtení napříč: projdi cesty v pořadí katalogu, pak osobnosti a otázky, s otevřeným zápisníkem opakování (citát, příběh, případ, Zkus to žít, obrat, stavba kroku). Snímky přes scripts/snimky-listy.mjs a scripts/snimky-cesta.mjs; prohlížej listy, ne jednotlivé obrazovky. Záznam piš průběžně do docs/revize/antika-<dnešní datum>.md po oddílech plánu, ať se při dlouhé práci nic neztratí.

3. Kontroly: konzistence jmen, dat, citací a překladů proti src/data; odkazy; zastavený pohyb u všech kreseb (obsah vidět bez pohybu i při omezeném pohybu); hlavička Seneky na 390 px; oprav nestálý test tests/e2e/cesta.spec.ts:79 a ověř ho třikrát po sobě; celé npm test jednou na pozadí s výstupem do souboru; axe přes scripts/revize-axe.mjs.

4. Drobnosti (překlep, rozbitý odkaz, nesoulad roku s daty, oprava testu) oprav rovnou, každý druh v samostatném commitu, a zapiš je do záznamu. Zásadní nálezy neopravuj: seřaď je podle dopadu (blokující, důležité, drobné) ve formátu skillu atlas-revize, každý s konkrétním návrhem opravy.

5. Do záznamu přidej oddíl „Co z plánu F3 chybí“ (bod 7 plánu) jako tabulku s doporučením u každé položky (před zkouškou / před středověkem / později) a návrh pořadí dalších větví, a oddíl „Zkouška se studenty“ (bod 8): které cesty, co sledovat, a podklad pro rozhodnutí o zveřejnění (bez zveřejňování), a oddíl „Interaktivita“ (bod 9) s tabulkou návrhů; u tří nejlepších popiš, co student uvidí v zastaveném obrázku a co se pohne. Verdikt revize: schváleno / po opravách / přepracovat.

6. Do plánu větve napiš oddíl „Po S (datum)“: co jsi našel, nad čím jsi váhal a co jsi zvolil, a oddíl „Co rozhodnout po S“ s očíslovanými otázkami, každou s doporučením a prázdným řádkem „Odpověď:“ (prázdná odpověď znamená souhlas). Připrav tam i zadání kroku O ve stejné podobě jako toto (model, úsilí, text promptu). Zadání S přesuň do docs/archiv/zadani/revize-antiky.md. Rozhodnutí zapiš do docs/rozhodnuti.md, aktualizuj řádek revize-antiky v docs/plan.md. Commit.

7. Nic neslučuj a nic neposílej na GitHub. Plán větve a docs/plan.md nahraj do projektu Claude. Pak mi krátce napiš verdikt, tři nejdůležitější nálezy a na co mám odpovědět.
```

Provedeno 25. 10. 2026 (Opus 5.5 místo Fable 5.1 v tomto chatu); záznam `docs/revize/antika-2026-10-25.md`.

## Zadání O

V novém chatu projektu Atlas s připojenou složkou Atlas a zapnutým Desktop Commanderem, až odpovíš na otázky výš. **Opus 5.5 · high** (xhigh, když se zasekne úprava hlavičky profilu nebo kreseb).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Krok O větve revize-antiky: opravy po souhrnné revizi antiky (P11). Záznam revize je docs/revize/antika-2026-10-25.md, moje odpovědi jsou v plánu větve docs/plany/revize-antiky.md v oddílu „Co rozhodnout po S“ (prázdná odpověď znamená souhlas s doporučením). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch revize-antiky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, skill atlas-psani a ze záznamu revize oddíl 9 Nálezy; pro úpravy UI skill atlas-komponenta. Restartuj náhled npm run dev.

1. Texty (nálezy 1, 2, 3, 4, 7 a 10, podle mých odpovědí 1, 2 a 7): nové úvody všech deseti cest a nové závěrečné odstavce posledních kroků; kapitola Věštba z Delf v portrétu Sókrata; mezititulky v posledních krocích cest 2, 7, 8, 33 a 34; krok 2 cesty 6; úvod seznamu otázek; odstavec Rozsah pro studenta v docs/architektura.md. Návrhy ze záznamu ber jako výchozí znění: ověř je proti textu cesty a datům bloků (názvy košů a vrstev), věty do 25 slov, žádné nové tvrzení bez podkladů. Každou větu, kterou měníš, najdi nejdřív v tests/ (grep -rn) a test uprav v tomtéž commitu. Commit po druzích: úvody, závěry, portrét a krok 6, mezititulky.

2. Kresby (nález 5): Třetí čára a Cesta ven v zastaveném stavu (.kresba--pohyb bez .kresba--bezi) kreslí stav jako při omezeném pohybu: šest jedniček a otazník nad „ty“, vězeň na strmé cestě. Ověř node scripts/revize-pohyb.mjs (snímky si prohlédni) a přidej test zastavení hned po načtení podle vzoru Přesýpacích hodin. Doplň Masku a Přesýpací hodiny do dílny (/dilna/bloky/).

3. Navigace (nálezy 6, 8 a 9, podle odpovědí 3, 4 a 8): hlavička profilu na telefonu, čísla cest ve studentském rozhraní, „Další cesta“ v Kam dál hotové cesty, a jestli platí odpověď 8, nahrání deníku ze souboru (ověř, že soubor ze Stáhnout deník do souboru jde nahrát zpět, a co se stane s jiným deníkem v prohlížeči). Ověř na 390 a 1440 px ve světlém i tmavém režimu, klávesnicí a node scripts/kontrola-fokus.mjs na profilech Seneky, Epikúra, Epiktéta a Aristotela; hlavičky vyfoť node scripts/revize-hlavicky.mjs.

4. Ověření: node scripts/slova-cesta.mjs pro všech deset cest a štítky minut podle výsledku; npm run build; node scripts/hodiny-katalog.mjs (Chyb: 0); celé npm test jednou na pozadí s výstupem do souboru; axe přes node scripts/revize-axe.mjs na stránkách, které jsi změnil. Snímky změněných kroků přes scripts/snimky-cesta.mjs do Claude outputs/snimky-revize-antiky-O/ a prohlédni listy.

5. Do plánu větve napiš oddíl „Po O (datum)“: co jsi změnil, nad čím jsi váhal a co jsi zvolil, a „Co rozhodnout po O“ s očíslovanými otázkami, doporučením a prázdným řádkem „Odpověď:“. Připrav zadání kroku P13 ve stejné podobě (model, úsilí, text promptu); P13 zobecní do skillů a docs/pouceni.md poučení z antiky: šablona napříč cestami (úvody, závěry, Kdo je na tvé straně), délka posledního kroku, kresba po zastavení, opakování mezi portrétem a cestou, pořadí bloků pro středověk, hledání místa pro interaktivní prvek v atlas-osobnost a atlas-data. Zadání O přesuň do docs/archiv/zadani/revize-antiky.md. Rozhodnutí zapiš do docs/rozhodnuti.md, aktualizuj řádek revize-antiky v docs/plan.md. Commit.

6. Nic neslučuj a nic neposílej na GitHub. Plán větve, docs/plan.md a docs/architektura.md (jestli se změnila) nahraj do projektu Claude. Pak mi krátce napiš, co je hotové, nad čím jsi váhal a na co mám odpovědět.
```
