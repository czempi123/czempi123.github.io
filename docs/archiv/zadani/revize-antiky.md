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

## Zadání P13

V novém chatu projektu Atlas s připojenou složkou Atlas a zapnutým Desktop Commanderem, až odpovíš na otázky výš. **Opus 5.5 · high.**

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Krok P13 větve revize-antiky: úprava skillů po fázi antiky. Co se v antice opakovaně nepovedlo, zobecni do skillů a do docs/pouceni.md tak, aby se to ve středověku neopakovalo. Moje odpovědi jsou v plánu větve docs/plany/revize-antiky.md v oddílu „Co rozhodnout po O“ (prázdná odpověď znamená souhlas). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch revize-antiky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/pouceni.md, v plánu větve oddíly Po S a Po O a ze záznamu revize docs/revize/antika-2026-10-25.md oddíly 2 (Antika jako celek), 6 (Lidský hlas a čtivost), 9 (Nálezy) a 12 (Interaktivita). Skilly ve skills/ otevírej jen ty, které upravuješ.

1. Poučení z antiky zobecni a zapiš tam, kam patří (skill, ne opis do pouceni; do docs/pouceni.md jen věta s odkazem, kde jde o pravidlo napříč skilly):
   - Šablona napříč cestami: úvody, závěrečné odstavce a krok Kdo je na tvé straně. Do atlas-cesta pravidlo, že úvod cesty i závěrečný odstavec se píší naposledy a porovnají se s úvody a závěry ostatních cest téhož období (příkaz z atlas-psani › Postup při revizi); závěr se ptá konkrétně na první tah té cesty a nevyjmenovává, co student dělal. Do atlas-revize kontrolu napříč cestami období.
   - Délka posledního kroku: zastánci odpovědí mají mezititulky podle bloků; krok s více než asi 450 slovy dostane mezititulky vždy. Do atlas-cesta a do kontrolního seznamu atlas-revize.
   - Kresba po zastavení: zastavený stav (.kresba--pohyb bez .kresba--bezi) kreslí obsah jako při omezeném pohybu, ne začátek smyčky; každá kresba s pohybem má test zastavení hned po načtení. Do atlas-komponenta (Časté pasti a kontrolní seznam) a do docs/design.md › Kresba s pohybem.
   - Opakování mezi portrétem a cestou: když scénu nese cesta, portrét ji vypráví kratší a odkáže na krok cesty; citát stojí v celku nejvýš dvakrát. Do atlas-osobnost a atlas-cesta.
   - Pořadí bloků pro středověk: v antice mají všechny cesty stejnou stavbu (Volba nebo Roztřiď, filozof, Spor, nový případ, zastánci, pravidlo). Do atlas-cesta a do poznámek pro skill atlas-obdobi zapiš, že každé období zkusí aspoň jednu cestu jiné stavby a nové bloky (Dialog, Slož argument, Úryvek s otázkou) dřív, než vznikne další cesta stejné stavby.
   - Hledání místa pro interaktivní prvek: do atlas-osobnost (profily a portréty: u každé velké myšlenky se zeptat, jestli by ji student pochopil líp, kdyby něčím pohnul; nejdřív hotová komponenta) a do atlas-data (medailonky: prvky z dat jako Kdo žil dřív? a Dva životy poslouží všem osobám bez psaní textu). Měřítko účelnosti z plánu větve, bod 9.
   - Navigace: číslo cesty je jen v datech a v přípravě hodiny; studentské rozhraní ho neukazuje (Kam dál profilů píše nadtitulek „Cesta“). Do atlas-osobnost a atlas-cesta.
   - Údaje, které se rozejdou s daty: věta „odpovídají tam i tři další“ v závěru cesty 4 zastarala, když na otázku 1 přibyly hlasy. Do atlas-cesta: počty hlasů a cest v textu nepiš, nebo je ověř proti stránce, když přibude hlas.
2. Každou úpravu skillu udělej ve skills/<skill>/SKILL.md (zdrojová verze) a stručně; nic neopakuj, co skill už říká. Poučení, která skilly drží, z docs/pouceni.md nemaž. Zkontroluj, že skilly nepřesáhly rozumnou délku a že atlas-psani zůstal jediným místem pro pravidla čtivosti.
3. Rozhodnutí zapiš do docs/rozhodnuti.md. Do plánu větve napiš oddíl „Po P13 (datum)“: co se změnilo ve kterém skillu, nad čím jsi váhal, a „Co rozhodnout po P13“ (očíslované otázky s doporučením a prázdným řádkem „Odpověď:“). Připrav zadání kroku Uzavření (Opus 5.5 · medium): schválení autorem, sloučení revize-antiky do hlavní větve, hlavní větev na GitHub a zveřejnění na GitHub Pages s noindex do konce zkoušky se studenty (podklad v záznamu revize, oddíl 11 Zkouška se studenty; licence obrázků ověřit před zveřejněním). Zadání P13 přesuň do docs/archiv/zadani/revize-antiky.md, aktualizuj řádek revize-antiky v docs/plan.md. Commit.
4. Nic neslučuj a nic neposílej na GitHub. Plán větve a docs/plan.md nahraj do projektu Claude. Napiš mi, které skilly si mám znovu uložit do účtu Claude (soubory ve skills/), a krátce, nad čím jsi váhal a na co mám odpovědět.
```
