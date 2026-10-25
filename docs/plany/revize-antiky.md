# Plán větve revize-antiky: souhrnná revize antiky (P11)

Antika má hotových všech deset cest z katalogu (1–8, 33, 34), dvanáct stránek osobností (šest portrétů, šest profilů), 34 medailonků, šest plných stránek velkých otázek a přípravu hodiny. Každý celek prošel vlastní revizí, ale nikdo zatím nečetl antiku jako jeden celek: jestli se cesty neopakují, jestli drží stejná jména, data a citace, jestli student projde atlasem od Domů po deník bez slepých míst a co z plánu fáze F3 ještě chybí před zkouškou se studenty. To je úkol P11. Větev založena z hlavní větve 25. 10. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| S | Souhrnná revize antiky: čtení napříč celky, kontroly dat a rozhraní, inventura mezer vůči F3, připravenost na zkoušku se studenty | Fable 5.1 · high se skillem `atlas-revize` | zadání níž |
| O | Opravy po revizi | Opus 5.5 · high (xhigh u delších zásahů do UI) | zadání vznikne po S |
| P13 | Úprava skillů po fázi: co se v antice opakovaně nepovedlo, zobecnit do skillů a `docs/pouceni.md` | Opus 5.5 · high | zadání vznikne po O |
| Uzavření | Schválení autorem, sloučení do hlavní větve, hlavní větev na GitHub | Opus 5.5 · medium | zadání vznikne po P13 |

Stav a zadání dalších kroků se zapisují sem. Provedená zadání se v plném znění přesouvají do `docs/archiv/zadani/revize-antiky.md`.

## Proč teď a proč takhle

- **Pořadí z `docs/plan.md` a `docs/rozhodnuti.md` (25. 10. 2026):** cesta 33 byla poslední cesta antiky; další je P11, Stoický týden a zkouška se studenty.
- **Fable 5.1 podle katalogu promptů:** souhrnná revize potřebuje držet v hlavě desítky stránek najednou a hledat souvislosti, které revize jednoho celku nevidí.
- **Stoický týden jako vlastní větev po P11, ne uvnitř revize** (o tom jsem váhal, viz níž). Revize jen řekne, kam se týden napojí (Zkus to žít v cestách 5, 33 a 34, hlavička Seneky) a co z ověřených cvičení už je připravené.
- **Odložené úkoly z celků 9 a 10** patří sem (rozhodnutí z 23. a 25. 10. 2026): zastavený pohyb u ostatních kreseb, hlavička Seneky se třemi cestami na telefonu, nestálý test `cesta.spec.ts:79`.

## Co revize prověří (nad rámec revize jednoho celku)

### 1. Antika jako celek

- **Opakování napříč cestami:** stejný citát, příběh, případ, Zkus to žít nebo stavba kroku ve více cestách. Nejvíc hrozí u tří stoických cest (5, 33, 34), u kyniků a epikurejců (6, 7, profily Diogena, Kratéta a Hipparchie) a u Seneky, který nese cesty 8, 33 a 34.
- **Vyváženost:** otázka 1 „Jak mám žít?“ má čtyři cesty (4, 6, 7, 34), otázka 3 dvě, otázky 2, 8, 9 a 10 žádnou. Etika má podle architektury mít nejvýš třetinu cest; jak na tom je antika a co z toho plyne pro středověk.
- **Délka cest:** cíl je 15–20 minut, cesta 33 má podle `scripts/slova-cesta.mjs` 29. Změřit všech deset a říct, kde je délka problém (autor nechce zkracovat kvůli délce, takže doporučení musí stát na jiném důvodu, třeba únavě uprostřed kroku nebo opakování).
- **Monotónnost:** jestli všech deset cest nepoužívá stejnou šablonu kroků, stejné obraty („Představ si…“, závěrečné pravidlo) a stejné typy bloků ve stejném pořadí.

### 2. Konzistence

- Jména (závazná podoba v `src/data/lide.yaml`), letopočty, přepisy, citace (autor, dílo, místo), překlady stejného citátu na různých stránkách.
- Text proti datům: roky, místa a vztahy ve vyprávění proti `lide.yaml`, `vztahy.yaml`, `mista.yaml` a `udalosti.yaml`.
- Odkazy mezi stránkami: Kam dál, karty cest na otázkách, Doba a lidé, medailonky.

### 3. Průchod studenta napříč atlasem

- Domů → první cesta → pokračování → další cesta → deník. Kudy student z hotové cesty pokračuje a jestli atlas někde nekončí slepou uličkou.
- **Deník na konci období:** plán slibuje, že student na konci období uvidí, ke kterým odpovědím na velké otázky se přiklonil („V otázce dobrého života máš blízko k Epikúrovi…“). Ověřit, jestli to deník umí, a pokud ne, navrhnout, jak a kdy.
- Mapa a čas pro celou antiku: všech 50 lidí, kamera, řeka životů, vztahy, události.

### 4. Učitel

- Příprava hodiny: jsou v katalogu všechny cesty, bloky, kapitoly a hlasy z celé antiky?
- Učitelské podklady v `ucitel/` jsou jen pro celky 5 až 8; co chybí a jestli je to potřeba před zkouškou.
- Mapování na RVP G: které výstupy antika pokrývá a které ne.

### 5. Rozhraní a technika

- Zastavený pohyb u všech kreseb a animací v `src/components/ostrovy` (Jeskyně, Kde je střed, Kolik je dost, Loď, Maska, Přesýpací hodiny, Stejný vítr, Třetí čára, Zdvoj čtverec, Zrcadlo a další): obsah musí být vidět i bez pohybu (pravidlo z celku 9).
- Hlavička Seneky se třemi cestami na telefonu, s výhledem na Stoický týden.
- Nestálý test `cesta.spec.ts:79`: oprava (čekání na hydrataci v `pripravit` delší než pět vteřin, nebo posun po menších krocích).
- Celé `npm test`, axe, snímky klíčových stránek na 390 a 1440 px ve světlém i tmavém režimu.

### 6. Lidský hlas a čtivost napříč

Podle skillu `atlas-psani` (vznikl 25. 10. 2026). Znaky strojového textu, které se v jednom celku neprojeví, ale v deseti ano: oblíbené obraty, stejné otevírání kroků, stejná stavba zpětné vazby. Dál:

- **Úvody všech deseti cest a stránek otázek:** říkají, o čem cesta je a co si student odnese, nebo shrnují kroky a končí pořád stejnou větou („Než si přečteš…, odpověz sám“)? U úvodů cest navrhni nové znění všech deseti, i těch, které obstojí, ať se nečtou stejně.
- **Citáty:** odpovídá každý na otázku textu před ním, nebo jsou někde sbírkou? Zkouška zakrytím u citátů, které se opakují napříč celky.
- **Čtivost:** kde by student v cestě přestal číst; holá fakta na začátku profilů a kapitol.

### 7. Co z plánu F3 chybí

Inventura proti `docs/plan.md` (Plán etap, F3) a `docs/architektura.md` (Pořadí výroby, F3), každá položka s doporučením „před zkouškou se studenty“, „před středověkem“, nebo „později“:

- stránka období `/obdobi/antika` (kolekce `obdobi` je prázdná);
- stránky směrů (13 směrů má jen název, stránku žádný);
- myšlenkové pokusy jako samostatné stránky (Gygův prsten, Achilleus a želva, Karneadova deska, Lucretiovo zrcadlo času);
- pojmy, Příběh týdne, náboženství (Co je filozofie?, Co je náboženství?, judaismus, buddhismus, čínská tradice) a okno „Mezitím jinde“;
- stránky otázek 2, 8, 9 a 10 jsou prázdné, přitom antika na ně má hlasy z hotových stránek (Gygův prsten u Platóna, obec u Aristotela); doplnit z hotových osob, nebo počkat na další období? (nové osoby se nepřidávají);
- Stoický týden;
- skill `atlas-obdobi` (podle plánu vlna 3, po dokončení antiky).

### 8. Připravenost na zkoušku se studenty

Co je potřeba, aby šla jedna skutečná hodina nebo několik domácích průchodů: které cesty vybrat, co sledovat, jak sbírat zjištění. Web zatím běží jen lokálně; plán z 29. 9. 2026 říká, že o zveřejnění se rozhodne před zkouškou. Revize připraví podklad pro to rozhodnutí (GitHub Pages: co by se zveřejnilo, licence obrázků, co by se muselo dodělat), rozhodne autor.

## Nad čím jsem váhal

- **Stoický týden uvnitř P11, nebo zvlášť:** zvolil jsem zvlášť. Je to nový obsah se sedmi cvičeními, nejspíš i s novou komponentou (týdenní výzva v deníku), a potřebuje vlastní podklady, psaní a revizi. V revizi by se míchalo hodnocení hotového s psaním nového. Kdybys ho chtěl v téhle větvi, stačí říct; přibude krok mezi O a P13.
- **Jedna revize, nebo po částech:** jedno zadání pro Fable s pokynem psát záznam průběžně po oddílech. Rozdělit revizi do několika chatů by šetřilo kontext, ale ztratilo by se právě to, kvůli čemu P11 existuje: srovnání napříč.

## Co zůstává na později

- **Stoický týden** jako vlastní větev po P11 (`stoicky-tyden`); ověřená cvičení jsou v `docs/podklady/k-overeni.md` (večerní ohlédnutí, představa nejhoršího „Pět minut, jedna věc“).
- **Zkouška se studenty** po P11 a Stoickém týdnu; před ní rozhodnutí o zveřejnění.
- **Plán středověku (P12)** se skillem `atlas-obdobi`, cesta 9 „Je Bůh?“ jako první celek období 3.

## Zadání S

V novém chatu projektu Atlas s připojenou složkou Atlas a zapnutým Desktop Commanderem. **Fable 5.1 · high.** Běží dlouho; nech ho pracovat a vrať se k hotovému záznamu.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Krok S větve revize-antiky: souhrnná revize celé antiky (P11). Plán větve je v projektu Claude i v repozitáři jako docs/plany/revize-antiky.md; řiď se oddílem „Co revize prověří“ (osm bodů). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv otevři jen tam, kde to plán jmenuje.

0. git switch revize-antiky, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md skill atlas-revize (kontrolní seznam platí pro každou stránku; plán větve přidává pohled napříč) a skill atlas-psani (čtivost, úvody, citáty, lidský hlas; v oddílu Postup při revizi jsou příkazy, které vypíšou úvody cest a první věty kroků vedle sebe). Restartuj náhled npm run dev.

1. Inventura: vypiš si všechny stránky antiky (cesty, osobnosti, medailonky, otázky, deník, mapa, hodina), délky cest přes scripts/slova-cesta.mjs, seznam kreseb a animací v src/components/ostrovy a citátů podle id v src/content (které id se používá na víc stránkách). Inventuru dej do záznamu jako první oddíl.

2. Čtení napříč: projdi cesty v pořadí katalogu, pak osobnosti a otázky, s otevřeným zápisníkem opakování (citát, příběh, případ, Zkus to žít, obrat, stavba kroku). Snímky přes scripts/snimky-listy.mjs a scripts/snimky-cesta.mjs; prohlížej listy, ne jednotlivé obrazovky. Záznam piš průběžně do docs/revize/antika-<dnešní datum>.md po oddílech plánu, ať se při dlouhé práci nic neztratí.

3. Kontroly: konzistence jmen, dat, citací a překladů proti src/data; odkazy; zastavený pohyb u všech kreseb (obsah vidět bez pohybu i při omezeném pohybu); hlavička Seneky na 390 px; oprav nestálý test tests/e2e/cesta.spec.ts:79 a ověř ho třikrát po sobě; celé npm test jednou na pozadí s výstupem do souboru; axe přes scripts/revize-axe.mjs.

4. Drobnosti (překlep, rozbitý odkaz, nesoulad roku s daty, oprava testu) oprav rovnou, každý druh v samostatném commitu, a zapiš je do záznamu. Zásadní nálezy neopravuj: seřaď je podle dopadu (blokující, důležité, drobné) ve formátu skillu atlas-revize, každý s konkrétním návrhem opravy.

5. Do záznamu přidej oddíl „Co z plánu F3 chybí“ (bod 7 plánu) jako tabulku s doporučením u každé položky (před zkouškou / před středověkem / později) a návrh pořadí dalších větví, a oddíl „Zkouška se studenty“ (bod 8): které cesty, co sledovat, a podklad pro rozhodnutí o zveřejnění (bez zveřejňování). Verdikt revize: schváleno / po opravách / přepracovat.

6. Do plánu větve napiš oddíl „Po S (datum)“: co jsi našel, nad čím jsi váhal a co jsi zvolil, a oddíl „Co rozhodnout po S“ s očíslovanými otázkami, každou s doporučením a prázdným řádkem „Odpověď:“ (prázdná odpověď znamená souhlas). Připrav tam i zadání kroku O ve stejné podobě jako toto (model, úsilí, text promptu). Zadání S přesuň do docs/archiv/zadani/revize-antiky.md. Rozhodnutí zapiš do docs/rozhodnuti.md, aktualizuj řádek revize-antiky v docs/plan.md. Commit.

7. Nic neslučuj a nic neposílej na GitHub. Plán větve a docs/plan.md nahraj do projektu Claude. Pak mi krátce napiš verdikt, tři nejdůležitější nálezy a na co mám odpovědět.
```
