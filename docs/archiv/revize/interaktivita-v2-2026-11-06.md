# Revize větve interaktivita-v2 (krok R)

6. 11. 2026 · Opus 5.5 se skillem `atlas-revize` · osa hlasů (K1), Přehrát život (K2), skill `atlas-obdobi` (S)

**Verdikt: po opravách.** Osa hlasů funguje na všech osmi stránkách otázek, volba, změna, „Nikdo z nich“, obnovení stránky, Začít znovu i Tvoje antika dělají, co mají; Přehrát život je klidné a ovladatelné klávesnicí. Jeden blokující nález je v datech, která Život na mapě poprvé ukazuje jako příběh: místo jen s „do“ platí jen v jediném roce, takže Epiktétos v Římě nikdy nebyl a Anaxagorás šel do vyhnanství dřív než do Athén. Další tři nálezy jsou o letopočtech a slovech, která tvrdí víc než data. Skill `atlas-obdobi` drží postup i tvar plánu; chybí mu dluh antiky vůči architektuře.

## Co jsem prošel

- **Stránky otázek** Kdo vlastně jsem? (sedm hlasů), Co je správné? (šest) a Jsem svobodný? (čtyři) na 390 px ve světlém a 1440 px v tmavém režimu: bez volby, první volba, změna, štítek „Tobě nejblíž“, obnovení, „Nikdo z nich“, Začít znovu (fokus se vrátí na první tlačítko). Skript `scripts/revize-osa-hlasu.mjs` vypíše věty a vyfotí osu; rozvržení všech osmi stránek ve třech šířkách `scripts/osa-hlasu-rady.ts`. Celá stránka Kdo vlastně jsem? `snimky-listy.mjs` (`otazka-kdo-*`).
- **Tvoje antika** s volbou z osy (Jsem svobodný?, Epiktétos): řádek „Na stránce otázky je ti nejblíž Epiktétos.“ s důvodem z hlasu.
- **Mapa a čas:** Aristotelés na 390 a 1440 px, s pohybem i při omezeném pohybu (`snimky-zivot-na-mape.mjs`), fokus na poslední zastávce v posuvném panelu na telefonu, odkaz z mini mapy na stránce Aristotela. Zastávky všech 27 lidí s oddílem `scripts/zivot-na-mape-vypis.ts --podrobne` proti datům (`lide.yaml`) a mini mapám. Přehrát do konce, Zastavit, Zpět, Seneca přes rok nula, Plótínos a Hérakleitos bez oddílu hlídá `zivot-na-mape.spec.ts`, který prošel v celém `npm test`.
- **Fokus a překryvy:** `kontrola-fokus.mjs` na třech stránkách otázek, Mapě a čase s Aristotelem, stránce Aristotela a Tvoje antika. Stránky otázek, Aristotelés a Tvoje antika bez potíží. Mapa hlásí překryvy (na telefonu 19, na notebooku 8): na telefonu jsou to prvky karty odrolované z posuvného panelu, které skript vidí pod pásem období (stejné hlášení má Hérakleitos bez oddílu, sedm potíží); na notebooku značky mapy a kotvy, které větev nemění. Planý poplach; skript nepozná ořez posuvným panelem.
- **Skill** `skills/atlas-obdobi/SKILL.md` a `references/kontrola-planu.md` proti `docs/architektura.md` (Osm období, Kostra osobností, Náboženství světa, Pořadí výroby) a proti tvaru tohoto plánu. Čísla v referenci jsem ověřil výpisem: 50 lidí (30 + 20; 6 portrétů, 18 profilů, 26 medailonků), 34 medailonků, 10 cest s průměrem 26,6 minuty, 42 hlasů, 13 směrů, 91 bloků, 63 vztahů (22, 22, 10, 9), 55 míst, 21 lidí se třemi místy, 18 s místem s časem, 17 událostí (9 + 8), 383 + 365 + 23 pramenů. Všechno sedí.
- **Odložený nález z Po K2** (`cesta.spec.ts`, průchod cesty 1): příčina níže, oprava v testu hotová.

## Opraveno rovnou

- **Věta po „Nikdo z nich“:** „stojí za to napsat tvou odpověď“ → „stojí za to napsat **svou** odpověď“ (zvratné přivlastňovací zájmeno; `src/lib/osa-hlasu.ts`, test `osa-hlasu.spec.ts`, `docs/design.md`).
- **Příprava stránky v `tests/e2e/cesta.spec.ts`** (`pripravit`): posun po stránce s `behavior: 'instant'` a posun prvního potomka ostrova místo ostrova. Průchod cesty 1 prošel čtyřikrát souběžně; příčina je v nálezu 6.

## Nálezy

### [blokující] Místo jen s „do“ platí jen v jediném roce: Epiktétos v Římě nebyl, Anaxagorás šel do vyhnanství před Athénami
- **Kde:** `kdeVRoce` v `src/lib/cas-mapy.ts` (pravidlo 1: „chybí-li od, platí … jen v roce do“) a tři místa v `src/data/lide.yaml`: Anaxagorás Athény `do: -436`, Seneca Řím `do: 41`, Epiktétos Řím `do: 93` (čtvrté takové, Epikúrův Samos `do: -323`, platí od narození, protože Epikúros v datech rodiště nemá). Ukazuje to karta Život na mapě a stejně tak mapa samotná.
- **Co je špatně:** Epiktétos má zastávky Hierapolis → Níkopolis; Řím, kde byl otrokem a kde učil, v jeho životě není. Seneca jde z Cordoby rovnou na Korsiku (mapa ho od osmnácti do čtyřiceti ukazuje v Cordubě). Anaxagorás má Klazomeny → Lampsakos (vyhnanství) → Athény 436 → Lampsakos: vyhnanství před Athénami.
- **Proč to vadí studentovi:** Přehrát život vypráví život jako cestu. Student, který prošel portrét Epiktéta, vidí na mapě, že v Římě nikdy nebyl; u Anaxagora čte opačné pořadí, než jaké se stalo.
- **Oprava:** pravidlo, ne nová data. Pobyt s „do“ a bez „od“ platí od osmnácti let (jako působiště bez času v pravidle 2), nebo od konce předchozího pobytu s časem, až do roku „do“. Pak Epiktétos: Hierapolis → Řím (bez roku, „působení“/„pobyt“ podle dat) → Níkopolis 93; Seneca: Corduba → Řím → Korsika 41 → Řím 49; Anaxagorás: Klazomeny → Athény → Lampsakos 435. V `tests/data/zivot-na-mape.test.ts` přidat tyto tři trasy, v testech mapy ověřit Senecu v roce 20 n. l. v Římě. Nakonec `zivot-na-mape-vypis.ts --podrobne` znovu projít očima u všech 27 lidí s oddílem (Epiktétos dostane třetí zastávku).

### [důležité] Osa hlasů na telefonu nemá ani jeden letopočet našeho letopočtu
- **Kde:** `znackyLet` v `src/lib/osa-hlasu.ts`, úzká kresba (do 520 px). Týká se šesti stránek, jejichž hlasy sahají za přelom: Co je správné?, Jak spolu máme žít?, Jak mám žít?, Jsem svobodný?, Kdo vlastně jsem?, Má život smysl?.
- **Co je špatně:** krok značek vychází 200 nebo 250 let, rok nula se přeskočí a první značka n. l. (200 nebo 250 n. l.) je za koncem měřítka. Kdo vlastně jsem? má na telefonu jen „500 | 250 př. n. l.“, Co je správné? jediné „250 př. n. l.“; Epiktétos a Marcus Aurelius stojí vpravo bez popisku.
- **Proč to vadí studentovi:** na telefonu, kde student atlas čte nejčastěji, vypadají Epiktétos a Marcus Aurelius jako lidé z let kolem 100 př. n. l. Osa, která má ukázat vzdálenost v čase, na přelomu letopočtu mlčí.
- **Oprava:** když měřítko přelom letopočtu obsahuje, dostane osa vždy značku „1 n. l.“ (polohou `naAstro(1)`) a sousední značky blíž než `R.pismo * 6` odpadnou (přednost má značka přelomu); éra u posledního roku př. n. l. zůstane. Na každé ose aspoň dvě značky s popiskem. Test v `tests/data/osa-hlasu.test.ts`: na všech osmi stránkách a třech šířkách, když rozsah obsahuje přelom, některá značka končí „n. l.“ a nezačíná „př.“; a každá kresba má aspoň dvě značky.

### [důležité] Zastávky tvrdí přesný rok tam, kde data říkají „asi“
- **Kde:** `zastavkyZivota` v `src/lib/zivot-na-mape.ts` (`asiRok` jen u první zastávky), `Poloha` v `src/lib/cas-mapy.ts` nenese `priblizne` pobytu.
- **Co je špatně:** Aristotelés v kartě: „Athény · studium · 367 př. n. l. · 17 let“, „Assos · pobyt · 347 př. n. l. · 37 let“, „Lesbos · 345“, „Pella · 343“; mini mapa na jeho stránce o kus výš píše u týchž míst „asi“, protože v datech mají `priblizne: true`. Totéž Platón (Syrákúsy asi 387, 366) a další. Návrat do rodiště hned po přibližném pobytu („Stageira · rodiště · 340 př. n. l.“) bere rok z konce přibližného pobytu jako jistý.
- **Proč to vadí studentovi:** dvě místa atlasu říkají o témž roce jednou „asi“ a jednou nic. Z čísel zmizelo „asi“, které pramen má (kontrolní seznam revize, Historik).
- **Oprava:** `kdeVRoce` vrátí u pobytu s časem i `priblizne` (z dat); zastávka má `asiRok`, když je přibližný pobyt, ze kterého je, nebo pobyt, po kterém přišla (návrat). Věk u přibližného roku zastávky dostane „asi“ také („Assos · pobyt · asi 347 př. n. l. · asi 37 let“). Oznámení pro čtečku totéž. Testy: Aristotelés Athény 367 a Assos 347 s „asi“, Stageira 384 bez.

### [důležité] Návrat domů má v kartě roli „rodiště“
- **Kde:** `roleZastavky` a `radekZastavky` v `src/lib/zivot-na-mape.ts`.
- **Co je špatně:** Sókratés má třikrát „Athény · rodiště · 431 př. n. l. · 38 let“ (po Potidaii, Déliu, Amfipoli), Aristotelés „Stageira · rodiště · 340 př. n. l. · 44 let“. Role popisuje místo, ne to, co se v tom roce dělo.
- **Proč to vadí studentovi:** „rodiště · 431 př. n. l.“ čte šestnáctiletý jako rok narození, nebo nerozumí, proč se Sókratés v osmatřiceti „rodí“.
- **Oprava:** zastávka s rolí `narozeni`, která není první, má roli „zpátky doma“: „Athény · zpátky doma · 431 př. n. l. · 38 let“, oznámení „Athény, zpátky doma, 431 př. n. l., 38 let.“. První zastávka zůstane „rodiště · … · narodil se“. Test v `zivot-na-mape.test.ts` (Sókratés) a přesné znění v `zivot-na-mape.spec.ts`, kde je.

### [důležité] Skill atlas-obdobi neví, co antika architektuře ještě dluží
- **Kde:** `skills/atlas-obdobi/SKILL.md` › Postup, krok 1, a `references/kontrola-planu.md` › Antika jako ukázka.
- **Co je špatně:** reference ukazuje antiku jako hotový vzor („Tytéž stránky má každé další období od prvního celku“) a tabulka říká „18 profilů“. Proti Kostře osobností a Pořadí výroby (F3) ale antice chybí: stránky 11 lidí s hloubkou profil (Thalés, Pýthagorás, Démokritos, Zénón z Eleje, Zénón z Kitia, Chrýsippos, Pyrrhón, Lucretius, Cicero, Hypatia, Plótínos; devět z nich má jen medailonek), tradice buddhismus a čínská tradice a pokusy Achilleus a želva a Karneadova deska. Skill nikde neříká, že plán dalšího období má tenhle dluh vidět. Drobnost navíc: „ve středověku podle architektury patristika a scholastika“ – architektura neříká, které směry dostanou stránku.
- **Proč to vadí:** plán středověku (P12) podle skillu přeskočí, že F3 není hotová, a buddhismus a čínská tradice (okna Mezitím jinde období 1 a 2) zůstanou viset bez kroku. Studentovi pak v antice chybí profily lidí, kteří mluví na stránkách otázek a mapě jen medailonkem.
- **Oprava:** v SKILL › Postup, krok 1 přidat: „**Dluh předchozího období.** Porovnej předchozí období s jeho řádky v Kostře osobností, Náboženství světa, Myšlenkových pokusech a Pořadí výroby (výpis stránek, ne čtení). Co chybí, vypiš v plánu jako první otázku pro autora: dodělat před prvním celkem, souběžně, nebo později.“ Do reference pod tabulku „Co antika má“ oddíl „Co antika proti architektuře ještě nemá (6. 11. 2026)“ se třemi řádky výše a v tabulce u Lidí doplnit „vlastní stránku má 13 z 24 portrétů a profilů“. V Směrech: „ve středověku třeba patristika a scholastika“.

### [drobné] Průchod cesty 1 padal na plynulém posunu, ne na kresbě
- **Kde:** `tests/e2e/cesta.spec.ts` (`pripravit`), stejná smyčka posunu v `cesta3`, `cesta4`, `cesta5`, `cesta8`, `pruchod` a `prohlidka.spec.ts`.
- **Co je špatně:** kresba Šaty nulovou výšku nemá (obrázek 646 px); nulovou výšku má `astro-island` sám, protože má `display: contents`. Test průchodu neemuluje omezený pohyb, takže `<html>` má `scroll-behavior: smooth` a `scrollTo` po 500 px se za 40 ms posune o 11 px: smyčka se ke kresbě v kroku 6 (1022 px od začátku) dostala jen podle toho, jak rychle zrovna běžel prohlížeč. Záložní posun ostrovů do okna pak volal `scrollIntoView` na ostrov, a ten u prvku bez boxu nedělá nic. Ověřeno výpisem v prohlížeči.
- **Proč to vadí:** test padá asi jednou ze čtyř a na GitHubu může shodit kontroly bez chyby v atlasu.
- **Oprava:** v `cesta.spec.ts` hotová (`behavior: 'instant'`, posun `el.firstElementChild ?? el`; čtyři běhy souběžně prošly). V kroku O převést stejnou přípravu do jedné funkce v `tests/e2e/strany.ts` a použít ji v ostatních šesti souborech; poučení do `docs/pouceni.md`.

### [drobné] Druhá věta po volbě: neokrouhlené „asi 376 let“ a podruhé „lidských životů“
- **Kde:** `vetaONejdelsiVzdalenosti` v `src/lib/osa-hlasu.ts` (text z `vzdalenost()` mapy).
- **Co je špatně:** „Od Aristotela tě dělí asi 2 350 let. To je víc než 31 lidských životů. … Nejdál od sebe tu žili Aristotelés a Epiktétos. Dělí je asi 376 let. To je asi pět lidských životů.“ Přesné číslo s „asi“ a dvakrát za sebou „To je … lidských životů“.
- **Proč to vadí studentovi:** věty znějí jako šablona (stejný rytmus dvakrát) a „asi 376“ je přesnost, kterou data nemají.
- **Oprava:** druhá věta jedna, zaokrouhlená jako první (`zaokrouhliLeta`): „Nejdál od sebe tu žili Aristotelés a Epiktétos: dělí je asi 380 let.“ U dvou žen „žily“ jako dosud. Testy přesného znění v `osa-hlasu.test.ts` a `osa-hlasu.spec.ts` upravit v témže commitu.

### [drobné] Popis osy pro čtečku bez „asi“
- **Kde:** `popisOsy` v `src/lib/osa-hlasu.ts`.
- **Co je špatně:** „od roku 540 př. n. l. do roku 180 n. l.“ – Hérakleitův rok narození je v datech přibližný a seznam pod osou píše „asi 540–480 př. n. l.“.
- **Oprava:** „asi“ před rokem, který je přibližný: „od roku asi 540 př. n. l. do roku 180 n. l., a pak asi 1 850 let do dneška.“

### [drobné] Mini mapa a karta pojmenují tutéž roli jinak
- **Kde:** `src/components/osobnost/MiniMapa.astro` (`studia`, `válečné tažení`, `narození`, `smrt`) proti `ROLE` v `src/lib/zivot-na-mape.ts` (`studium`, `vojenské tažení`, `rodiště`, `místo smrti`).
- **Co je špatně:** na stránce Aristotela stojí nad sebou „studia asi 367 př. n. l.“ (mini mapa) a po kliknutí na Přehrát život „studium · 367 př. n. l.“.
- **Oprava:** jeden slovník rolí v `src/lib/vztahy.ts` nebo `cas-mapy.ts`, ze kterého čtou obě; doporučuji „studium“, „vojenské tažení“, u mini mapy (popisek u místa s rokem) „narození“ a „smrt“ ponechat jako událost, v kartě „rodiště“ a „místo smrti“ jako místo. Stačí sjednotit `studia` → `studium` a `válečné` → `vojenské`.

### [drobné] Rozhodnutí kroku S nejsou v `docs/rozhodnuti.md`
- **Kde:** `docs/rozhodnuti.md` má záznamy K1 a K2 z 5. 11., záznam S (6. 11.) chybí.
- **Co je špatně:** S rozhodl, že plán období žije v `docs/plany/<slug>.md` s celky jako budoucími větvemi, že u nových osob prázdná odpověď souhlas není a že strop hlasů na ose rozhodne revize středověku.
- **Oprava:** záznam „6. 11. 2026: Interaktivita-v2, krok S (skill atlas-obdobi)“ s těmito třemi řádky v kroku O.

## Nad čím jsem váhal

- **Blokující, nebo důležité u míst s „do“.** Chyba je starší než větev (mapa ji měla), ale Život na mapě z ní dělá vyprávění a oddíl stojí v kartě každého z těch lidí. Za blokující ho mám, protože student čte opak toho, co se stalo, a oprava je malá.
- **Pravidlo, nebo data.** Doplnit `od` u tří míst by chtělo zdroj ke každému a rozhodnutí z 2. 10. 2026 nová data zatím nepřidává. Pravidlo „s do bez od platí od osmnácti“ dělá to, co „do“ znamená, a opraví i místa, která přibudou. Proto ho navrhuji (otázka 1).
- **„Zpátky doma“.** Zvažoval jsem „návrat“ (zní jako cesta, ne pobyt) a „doma“ (u Sókrata v Athénách po čtyřiceti letech zní divně samo). „Zpátky doma“ říká obojí.
- **Dva nálezy skillu jsem spojil** do jednoho (dluh antiky a směry), aby revize nepřesáhla deset.
- **Hlášení `kontrola-fokus.mjs` na mapě** nepočítám jako nález. Skript by mohl brát ohled na ořez posuvným panelem, ale to je úprava nástroje, ne atlasu.

## Testy

Celé `npm test` jednou na konci (výstup `/tmp/atlas-test-r.log`): kontrola typů bez chyb, vitest 989 z 989, Playwright 712 z 712 (6,8 min), včetně průchodu cesty 1.
