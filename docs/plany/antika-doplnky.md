# Plán větve antika-doplnky: co antice chybí před středověkem

Souhrnná revize antiky sepsala, co z plánu F3 v atlasu ještě není, a rozdělila to na „před středověkem“ a „později“ (`docs/revize/antika-2026-10-25.md`, oddíl 10). Tahle větev dodělá všechno z první skupiny: vstupní stránku Co je filozofie?, stránky období 1 a 2, čtyři směry, které nesou cesty, stránky otázek 2 a 8, dva myšlenkové pokusy jako samostatné stránky, Co je náboženství? s judaismem a deník na konci období. K tomu dvě drobnosti odložené z dřívějších větví: výměna citátu `seneca-ep-18-9` v cestě 6 a pět chybějících vztahů z `interaktivita-v1`. Větev založena z hlavní větve (`812fbed`) 1. 11. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: antika má deset cest a dvanáct stránek osobností, ale student z ní nemá kudy vstoupit do celku. Pás osmi období na Domů vede jen na kotvy v Lidech, třináct směrů jsou jen jména, polovina otázek nemá stránku a slovo „filozofie“ nikde nikdo nevysvětlí. Středověk na tyhle stránky naváže (období 3, směry scholastika a patristika, otázka 9, islám a judaismus), proto mají šablony vzniknout teď, na hotové látce.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| P6 | Podklady k filozofii: Co je filozofie?, období 1 a 2, čtyři směry, hlasy otázek 2 a 8, oba pokusy, náhrada `seneca-ep-18-9`, pět vztahů | Sonnet 5.5 · high s vyhledáváním; Opus 5.5 · high u sporných pramenů | hotovo 1. 11. 2026 (`docs/podklady/antika-doplnky.md`); čeká na odpovědi po P6 |
| P6N | Podklady k náboženství: Co je náboženství?, judaismus | Opus 5.5 · high s vyhledáváním | hotovo 1. 11. 2026 (`docs/podklady/nabozenstvi-uvod.md`); čeká na odpovědi po P6N |
| K1 | Šablony nových stránek (období, směr, pokus, náboženství, Co je filozofie?) a navigace k nim | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | hotovo 1. 11. 2026 (prozatímní texty); odpovědi po K1 prázdné (souhlas) |
| T1 | Texty filozofie: Co je filozofie?, období 1 a 2, čtyři směry, dva pokusy, otázky 2 a 8, cesta 6, vztahy v datech | Opus 5.5 · high se skilly `atlas-psani`, `atlas-osobnost`, `atlas-cesta` a `atlas-data` | hotovo 1. 11. 2026; čeká na odpovědi po T1 |
| T2 | Texty náboženství: Co je náboženství?, judaismus | Opus 5.5 · high se skilly `atlas-psani` a `atlas-osobnost` | hotovo 1. 11. 2026; čeká na odpovědi po T2 |
| K2 | Deník na konci období: „Tvoje antika“, vlastní myšlenkový autoportrét | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | hotovo 1. 11. 2026 (`/denik/antika/`); odpovědi po K2 prázdné (souhlas; odpověď 3 provedena v R) |
| R | Revize větve | Opus 5.5 · high se skillem `atlas-revize` | hotovo 3. 11. 2026 (`docs/revize/antika-doplnky-2026-11-03.md`); čeká na odpovědi po R |
| O | Opravy po revizi a úprava skillů | Opus 5.5 · high | hotovo 3. 11. 2026; odpovědi po R prázdné (souhlas) |
| Uzavření | Schválení autorem, sloučení, push hlavní větve (nasadí web), kontroly na GitHubu zelené | Opus 5.5 · medium | schváleno 3. 11. 2026; sloučeno |

**Proč v tomhle pořadí.** Podklady jsou první, protože všech jedenáct nových stránek stojí na tvrzeních a citátech, které atlas zatím nemá. Náboženství má vlastní krok podkladů: má jiné prameny, jinou míru opatrnosti (student může být věřící, atlas o pravdivosti tradice nerozhoduje) a jeho úvod se dá psát nezávisle na filozofii. Šablony (K1) vzniknou dřív než texty, stejně jako ve větvích `stoicky-tyden` a `interaktivita-v1`; P6N může běžet souběžně s K1. Deník na konci období (K2) je nejtěžší komponenta větve a čte všechno, co student v antice udělal, včetně nových stránek otázek 2 a 8; proto jde po textech.

## Co už atlas má

- **Kolekce se schématy jsou připravené a prázdné:** `obdobi` (období a perex), `pokusy` (název, období, otázka, osoby), `nabozenstvi` (název, pořadí, období) v `src/content.config.ts`; `smery` má 13 záznamů jen s názvem, obdobím a pořadím. Stránky pro ně (`/obdobi/…`, `/smer/…`, `/pokus/…`, `/nabozenstvi/…`) zatím nejsou; adresy navrhuje `docs/plan.md` › Informační architektura.
- **Data období:** `src/data/obdobi.yaml` (slug, okno, barva, ornament, výřez mapy pro všech osm období) a `src/data/udalosti.yaml` (dějinné kotvy a události ze životů pro období 1 a 2, každá se zdrojem). Stránka období se z nich složí bez psaní dat.
- **Pás období na Domů** (`PasObdobi.astro`) vede zatím na `/lide/#obdobi-<id>`; Lidé a směry ukazují u období štítky směrů s počtem lidí.
- **Gygův prsten** je blok Změň jednu věc v portrétu Platóna (`platon-gyguv-prsten`); **Zrcadlo** je kresba v cestě 8, krok 4 (`Zrcadlo.svelte`, `src/lib/zrcadlo.ts`).
- **Otázky 2 a 8** mají v `src/content/otazky/` jen číslo, znění a disciplínu; otázka bez hlasů nemá stránku. Šablona stránky otázky se šesti hotovými stránkami a 30 hlasy je vzor.
- **Osoby, které hlasy a stránky potřebují, v datech jsou:** Sókratés, Platón, Aristotelés, Prótagorás, Epikúros, Diogenés, Kratés a Hipparchia, Seneca, Epiktétos, Marcus Aurelius (se stránkou); Thalés, Zénón z Kitia, Chrýsippos, Cicero, Filón Alexandrijský, Konfucius, Chairefón, Kritón, Theofrastos, Karneadés (medailonek nebo jen data). Nové osoby nepřibývají (rozhodnutí autora).
- **Deník** (`src/lib/denik.ts`) drží stav všech bloků (`stavBloku`), stanoviska, závěrečná pravidla cest a výzvy; **Kdo je na tvé straně** (`src/lib/strany.ts`, `Strany.svelte`) už umí z odpovědí v blocích vybrat myslitele, kterým je student nejblíž. Na tom stojí deník na konci období.
- **Příprava hodiny** přidá zastavení z bloků a kreseb na nových stránkách sama, když mají id; podoby na plátně je třeba zapsat (`docs/design.md` › Komponenty).
- **Stoický týden** má drobečky přes Lidé a směry, „dokud nevznikne stránka směru“ (rozhodnutí 26. 10. 2026).

## Obsah větve

### 1. Co je filozofie? (P6, K1, T1)

Vstupní stránka nad deseti otázkami a první očekávaný výstup RVP G: jak se filozofie liší od mýtu, náboženství, vědy a umění a jak otázky odpovídají disciplínám (`docs/architektura.md` › Deset velkých otázek, poslední odstavec; › Vazba na RVP G). Začíná Thalétem, který hledal přírodní vysvětlení místo mýtu; student si sám vyzkouší, čím se liší pět odpovědí na tutéž otázku (třeba proč hřmí), dřív než dostane rozlišení. Odkaz z Domů a z horní části přehledu otázek.

### 2. Stránky období 1 a 2 (P6, K1, T1)

Podle `docs/plan.md` › Informační architektura: úvodní scéna, co se dělo ve světě (kotvy z `udalosti.yaml` na malé ose), otázky doby, lidé a směry, cesty období, výřez mapy s odkazem do Mapy a času v roce, kdy období vrcholí. Skládá se hlavně z dat; píše se jen scéna, perex a krátký odstavec ke každé otázce doby. Pás období na Domů a v Lidech povede na tyto stránky. Okno „Mezitím jinde“ jen jednou dvěma větami u období 1 (Konfucius, Buddha, Lao-c’) bez nových osob v datech.

### 3. Čtyři směry (P6, K1, T1)

Stoicismus, epikureismus, kynismus a Akademie, protože nesou cesty a portréty. Šablona podle plánu: založení (scéna), tři hlavní myšlenky, rodokmen učitelů a žáků z `vztahy.yaml`, spor s jiným směrem, Zkus to žít a kam dál. Stoicismus odkáže na Stoický týden; drobečky týdne se přepojí na stránku směru. Zbylých devět směrů zůstává jen jako štítek v Lidech.

### 4. Otázky 2 a 8 (P6, T1)

„Co je správné a co dlužím druhým?“ a „Jak spolu máme žít?“ s úvodním případem a hlasy jen od lidí, kteří v atlasu mají stránku. Kandidáti podle revize a architektury: u otázky 2 Sókratés (Kritón: nevracet křivdu), Platón (Gygův prsten), Prótagorás, Aristotelés, Epikúros (smlouva o neškození); u otázky 8 Prótagorás (mýtus o Prométheovi, stud a právo), Platón (Ústava), Aristotelés (člověk jako tvor obce), Epikúros (žij skrytě), Diogenés (občan světa), Marcus Aurelius. Výběr pěti až sedmi hlasů s nejsilnější verzí každého je práce P6. Jedna z obou stránek otevře otázkou místo „Představ si…“ (revize antiky, nález 10). Žádná antická cesta k otázkám nevede; stránky odkážou na kroky a kapitoly, kde téma je (Gygův prsten u Platóna, Kritón v cestě 7).

### 5. Dva myšlenkové pokusy (P6, K1, T1)

Gygův prsten a Lucretiovo zrcadlo času jako samostatné stránky `/pokus/<slug>/`: scéna, vlastní volba, změna podmínky, co řekli filozofové, kam dál. Obsah je z velké části hotový (blok u Platóna, kresba v cestě 8); stránka ho postaví tak, aby se dal použít jako začátek hodiny. Achilleus a želva a Karneadova deska později, s vlastními podklady.

### 6. Co je náboženství? a judaismus (P6N, K1, T2)

Úvod vrstvy Náboženství světa a první tradice, kterou středověk potřebuje (Maimonides, Avicenna a Averroes přijdou s ním). Podle architektury: posvátné, mýtus, rituál a společenství; religionistika jako věda; u judaismu Tóra, smlouva, exil a rabínská tradice, vazba na Filóna Alexandrijského. Atlas tradici popisuje zevnitř i zvenku a o její pravdivosti nerozhoduje; to je otázka 9. Vstup z Lidí a směrů a ze stránky Co je filozofie?. Buddhismus a čínská tradice později s okny Mezitím jinde.

### 7. Deník na konci období: Tvoje antika (K2)

Revize ho dala před středověk (oddíl 12, „Deník na konci období“): student uvidí své závěrečné pravidlo z každé prošlé cesty, svá stanoviska u otázek a polohy ve Sporech, a vedle nich myslitele, kterým je nejblíž („V otázce dobrého života máš blízko k Epikúrovi“). Jen z toho, co student udělal; žádná procenta, skóre ani typ osobnosti. Vstup z deníku a ze stránky období 2. Nic se neodesílá.

### 8. Drobnosti z dřívějších větví (P6, T1)

- **Cesta 6, krok 4:** citát `seneca-ep-18-9` podává omezování jídla jako vzorné cvičení; P6 navrhne náhradu bez hladu, T1 ji zapíše (rozhodnutí 26. 10. 2026, Stoický týden).
- **Pět vztahů:** Theofrastos jako Aristotelův žák, Chairefón a Kritón se Sókratem (`znali-se`), Karneadés a Chrýsippos (`vliv-textem`), se zdrojem skillem `atlas-data` (`docs/archiv/plany/interaktivita-v1.md` › Co zůstává na později). Změní výchozí dvojice Dvou životů a možná i Kdo žil dřív? na medailoncích; testy upravit v témže commitu. **Po P6 viz oprava: z pěti je jeden chybějící, jeden špatného typu a dva už v datech.**

## Nad čím jsem váhal

- **Rozsah.** Jedenáct nových stránek, pět nových šablon a jedna těžká komponenta je víc než kterýkoli celek. Šlo by to rozdělit na tři větve (filozofie, náboženství, deník), každá by ale měnila Domů, Lidi a přípravu hodiny zvlášť a třikrát by se procházelo totéž. Navrhuju jednu větev s krokem podkladů navíc; kdyby se protáhla, K2 se dá oddělit do vlastní větve bez dopadu na ostatní kroky. Otázka 1.
- **Osa hlasů a Přehrát život.** Revize je dala také před středověk a `interaktivita-v1` je odložila „do další větve interaktivity nebo do `antika-doplnky`“. Do téhle větve je nedávám: obojí mění hotové stránky (všech šest otázek, mapu), ne nové. Navrhuju krátkou větev `interaktivita-v2` hned po této, souběžně se skillem `atlas-obdobi`, aby osa hlasů byla hotová dřív, než otázky dostanou středověké hlasy. Otázka 2.
- **Gygův prsten dvakrát.** Stránka pokusu může mít vlastní blok, nebo použít tentýž blok jako portrét Platóna. Tentýž blok (stejné id) znamená, že student, který ho prošel u Platóna, ho na stránce pokusu najde hotový, a v deníku je jeden záznam. Navrhuju tentýž blok, kolem něj na stránce pokusu nová scéna, Volba předem a hlasy; portrét Platóna dostane odkaz. Otázka 6.
- **Jména bez stránky v náboženství.** Co je náboženství? stojí na Durkheimovi, Ottovi a Eliadem, judaismus na Maimonidovi, Spinozovi a Buberovi; nikdo z nich v datech není a nové osoby nepřibývají. Navrhuju jména v textu bez odkazu tam, kde nesou myšlenku, a odkazy doplnit, až přijdou se svým obdobím. Otázka 8.
- **Mezitím jinde bez osob.** Konfucius je v datech bez stránky, Buddha a Lao-c’ v datech nejsou. Jedna dvě věty na stránce období 1 bez odkazu stačí; okno s mapkou podle architektury přijde s buddhismem a čínskou tradicí. Otázka 4.

## Co zůstává na později

- **`interaktivita-v2`:** osa hlasů na stránkách otázek, Přehrát život na mapě (podle odpovědi 2).
- **Zbylých devět směrů** (milétská škola, pythagorejci, eleaté, atomisté, sofisté, peripatetici, kyrenaici, skepticismus, novoplatonismus) jako stránky, nejspíš hlavně z dat.
- **Pokusy Achilleus a želva a Karneadova deska**; **pojmy** a **Příběh týdne** (F5).
- **Buddhismus a čínská tradice** s okny Mezitím jinde; **vrstva náboženství na mapě**.
- **Odkaz na otázku 9** z věty o hranici religionistiky na stránce Co je náboženství?, až otázka 9 dostane stránku; stejně cesta 35. Třetí karta Kam dál na Co je náboženství? se pak vrátí z otázky 6 na otázku 9 (odpověď 4 po R).
- **Nahrání deníku ze souboru zpět** jen před zkouškou s domácími průchody (revize antiky, nález 8).
- **Zkouška se studenty**, až je autor bude mít; do té doby `noindex`.
- Skill `atlas-obdobi` a plán středověku (P12) v pořadí z 26. 10. 2026.

## Co rozhodnout před prvním krokem

Prázdná odpověď znamená souhlas s doporučením.

1. **Rozsah a pořadí:** jedna větev s kroky P6, P6N, K1, T1, T2, K2, R, O, Uzavření (důvod pod tabulkou); K2 se oddělí, kdyby se větev protáhla. Doporučuji.
   Odpověď:
2. **Osa hlasů a Přehrát život** mimo tuto větev, v krátké větvi `interaktivita-v2` hned po ní, souběžně se skillem `atlas-obdobi`. Doporučuji.
   Odpověď:
3. **Co je filozofie?** na adrese `/co-je-filozofie/`, vstup z Domů a z přehledu otázek; Thalés jako příběh, vlastní pokus s pěti odpověďmi na tutéž otázku (mýtus, náboženství, filozofie, věda, umění), pak deset otázek a jejich disciplíny. Doporučuji.
   Odpověď:
4. **Stránka období** `/obdobi/<slug>/` (slug z `obdobi.yaml`), skládaná hlavně z dat; pás období na Domů a v Lidech na ni povede, jakmile stránka existuje; Mezitím jinde u období 1 jen větou bez odkazu. Doporučuji.
   Odpověď:
5. **Směry:** plné stránky jen stoicismus, epikureismus, kynismus a Akademie; drobečky Stoického týdne přes stránku stoicismu; zbylých devět zatím bez stránky. Doporučuji.
   Odpověď:
6. **Gygův prsten** na stránce pokusu jako tentýž blok `platon-gyguv-prsten` s novou scénou, Volbou a hlasy; portrét Platóna dostane odkaz na pokus. Zrcadlo jako tatáž kresba z cesty 8. Doporučuji.
   Odpověď:
7. **Otázky 2 a 8:** pět až sedm hlasů jen od lidí se stránkou, jedna ze stránek otevře otázkou místo „Představ si…“. Doporučuji.
   Odpověď:
8. **Náboženství:** `/nabozenstvi/` je stránka Co je náboženství? se seznamem tradic (zatím judaismus), `/nabozenstvi/judaismus/`; jména bez stránky (Durkheim, Otto, Eliade, Maimonides, Spinoza, Buber) v textu bez odkazu; žádné nové osoby v datech. Doporučuji.
   Odpověď:
9. **Tvoje antika:** stránka v deníku (`/denik/antika/` nebo oddíl deníku, rozhodne K2), jen z toho, co student udělal, bez procent a typů; vstup z deníku a ze stránky období 2; kdo prošel jedinou cestu, uvidí jedinou řádku a žádné „chybí ti“. Doporučuji.
   Odpověď:
10. **Obrázky:** P6 a P6N navrhnou obrázky k období, směrům, pokusům a judaismu s licencí; stáhnout je smí až krok T po tvé odpovědi po P6. Doporučuji.
    Odpověď:

## Po P6 (1. 11. 2026)

Podkladový list `docs/podklady/antika-doplnky.md` (8 oddílů a–h, návrh dat, rozpory, otázky) a řádky v `docs/podklady/k-overeni.md` (oddíl „Větev antika-doplnky, filozofická část“). Texty jsem četl v Perseu (Platón, Aristotelés, Hérodotos, Hésiodos, Aristofanés, Diogenés Laertios, Marcus, Epikúrovy Vatikánské výroky v First1KGreek), SEP a IEP jsem četl na Macu přes `curl`. Nic jsem nestahoval kromě textů do `/tmp`, nic neposlal na GitHub.

**Ověřeno (čteno v plném znění místa):**
- **Thalés:** Aristotelés (voda, důvod „snad“, jeho váhání o stáří mínění), Hérodotos I, 74 (zatmění), Platón Theaitétos 174a (studna), Aristotelés Politika 1259a (lisy), Diogenés Laertios I, 23–24 a 34.
- **Scény:** Oblaka 218–226 (Sókratés v koši) a Obrana 19b–c (o čtyřiadvacet let později); Gellius VI, 14 (poselstvo tří filozofů); Diogenés Laertios VII, 2–3 (Zénón), X, 10–11 (Zahrada), VI, 20–21 (Antisthenova hůl).
- **Citáty pro otázky 2 a 8:** Ústava I 331c–d, VI 488–489c (489a řecky), Prótagorás 322c–323a, Kritón 49e, Politika III, 11 (1281b řecky), Hlavní myšlenky 14, 31–37, Hovory VI, 54 (řecky), Vatikánský výrok 58 (řecky).
- **Vztahy:** Diogenés Laertios V, 35–36 (Theofrastos), IV, 62 a VII, 183 (Karneadés a Chrýsippos).
- **Věda o hromu:** NOAA (weather.gov), blesk a hrom.
- **Obrázky:** sedm nových návrhů z Met Open Access (CC0 podle API), nestaženo.

**Neověřeno (v podkladech označeno, do studentského textu nepatří):** Žalm 29 česky, Beethoven (Pastorální), Aëtios, Plútarchos o Catonovi, původ slova *filosofia*, název Stoy, rok založení Akademie, ostatní kotvy do `udalosti.yaml` mimo Halys, čísla veršů u Hésioda, číslo oddílu DL VII, 121, řecké znění nových citátů (T1 vytáhne ze souborů). Úplný seznam je v `k-overeni.md`.

**Co plán koriguje:**
- **Pět „chybějících“ vztahů je jeden chybějící, jeden špatného typu a dva už v datech.** Kritón a Chairefón mají `znali-se` od 29. 9. 2026; Dva životy je ale nečtou, protože `vychoziDvojice` bere jen `ucitel`, `zak` a `vliv-textem`. Doplnit: `chrysippos → karneades` (`vliv-textem`, DL IV, 62) a změnit Theofrasta na `ucitel` (DL V, 36). Kdyby autor chtěl, aby Dva životy řekly u přátel „přátelé“, je to změna kódu, ne dat.
- **Cesta 6, krok 4:** nestačí vyměnit citát `seneca-ep-18-9`. Věty „Cvičil se i Epikúros“ a „jedli chléb a pili vodu“ jsou o jídle taky a meze Stoického týdne je vylučují. Doporučuju přepsat tři věty a citát vyměnit za `menoikeus-130` (podklady f).
- **Zrcadlo jako pokus je o smrti**, takže „vhodné na začátek hodiny“ z architektury pro něj neplatí. Stránka musí držet pravidla cesty 8 a nedostane v Přípravě hodiny štítek „na začátek hodiny“.
- **Gygův prsten:** blok se použije se stejným `id`; kromě Platóna nový hlas Epikúra (`kd-35`: nelze si být jistý, že se to nedozví); Epikúrova odpověď má vlastní nejsilnější námitku, kterou stránka řekne.

**Nad čím jsem váhal:**
- **Případ otázky 2.** Platónův příklad se zbraní jsem převedl na mobil přes noc (kamarád v hněvu chce zpátky věc, kterou ti svěřil, když byl klidný). Alternativa byla „klíče od skútru“ a „zbraň“; zvolil jsem hněv a ne alkohol (studenti, kterým je blízký rodič s alkoholem).
- **Otázka před případem.** Zvolil jsem otázku 8 („Kdo má rozhodovat, když se třída nemůže shodnout?“); otázka 2 začíná případem.
- **Hrom jako pokus.** Plán říká „třeba proč hřmí“. Pět druhů odpovědi není pět stupňů, a věda tu zní nejpřesněji; proto navrhuju, ať pokus řekne, co kdo umí a co mu uniká. Alternativa „Odkud se vzal svět?“ je neověřená.
- **Scéna období 1.** Sókratés v koši (Oblaka) a Obrana jsou ověřené a dávají oblouk 24 let; Halys by byla druhá možnost, ale Thalés by byl na dvou stránkách. Pro hrom v pokusu jsem proto scénu období vzal z jiné části komedie.
- **Epikúrova „hostina z mála“ a hlad.** Ve směru Epikureismus jsem nepoužil nic o jídle (zahrada, přátelé, společný majetek) a Zkus to žít jsem postavil na večeru s přítelem, ne na jídle.
- **Karneadés jako sedmý hlas** u otázky 2: vynechán, protože jeho dvě řeči jsou jen tradice.

### Co rozhodnout po P6

Prázdná odpověď znamená souhlas s doporučením.

1. **Pokus v Co je filozofie?:** „Proč hřmí?“ (hlasy: Hésiodos, Žalm 29, Anaximandros, NOAA, Beethoven) s větou, že jde o pět druhů odpovědi, ne pět stupňů. Žalm 29 a Beethoven T1 ověří, jinak vymění. Doporučuji.
   Odpověď:
2. **Scéna období 1:** Sókratés v koši (Oblaka 423) a o čtyřiadvacet let později Obrana 19b–c; zatmění u Halyu jen jako kotva na ose. Doporučuji.
   Odpověď:
3. **Scéna období 2:** poselstvo tří filozofů v Římě 155 př. n. l. (Gellius VI, 14, Karneadovy dvě řeči jen „vypráví se“). Doporučuji.
   Odpověď:
4. **Otázka 2:** případ „Mobil přes noc“, šest hlasů (Platón, Sókratés, Prótagorás, Aristotelés, Epikúros, Marcus), bez Karneada. Doporučuji.
   Odpověď:
5. **Otázka 8:** otevírá otázkou („Kdo má rozhodovat, když se třída nemůže shodnout?“) a případem „Výlet“, šest hlasů (Prótagorás, Platón s kormidelníkem, Aristotelés, Epikúros, Diogenés, Marcus). Doporučuji.
   Odpověď:
6. **Směry:** scény Zénón (knihkupectví), Zahrada (společný majetek, přátelé), Antisthenova hůl, Akademie jako škola, kde se spor nebere jako zrada; Epikureismus: Zkus to žít „Večer s přítelem“ bez jídla; Kynismus: „Den bez ‚protože se to čeká‘“; Stoicismus odkáže na Stoický týden. Doporučuji.
   Odpověď:
7. **Vztahy v datech:** změnit `aristoteles → theofrastos` na `ucitel` (DL V, 36), přidat `chrysippos → karneades` (`vliv-textem`, DL IV, 62); Chairefón a Kritón beze změny, kód Dvou životů se tím nemění. Doporučuji.
   Odpověď:
8. **Cesta 6, krok 4:** přepsat tři věty a citát vyměnit za `menoikeus-130`; alternativy `kd-15` nebo krok bez Epikúrovy citace. Doporučuji.
   Odpověď:
9. **Zrcadlo jako pokus:** stránka drží pravidla cesty 8 a nemá štítek „na začátek hodiny“. Doporučuji.
   Odpověď:
10. **Obrázky:** smí T stáhnout těchto sedm (Met CC0): neznámý filozof (255445), amfora (248902), tetradrachma Alexandra (326395), hlava Chrýsippa (251787), prsten s Hermem (256193), zrcadlo (253640), soška Dia nebo Poseidóna (251078); pro Epikúra, Diogena a Platóna se použijí obrázky, které už v atlasu jsou. Doporučuji, nebo škrtni, které ne.
    Odpověď:

## Po P6N (1. 11. 2026)

Podkladový list `docs/podklady/nabozenstvi-uvod.md` (oddíly a–d, návrh dat, rozpory) a řádky v `docs/podklady/k-overeni.md` (oddíl „Větev antika-doplnky, náboženství“). Texty jsem četl na Macu přes `curl` (SEP, Gutenberg, archive.org, ČEP na obohu.cz, Pleiades, API Met), Sefarii a Britannicu nástrojem WebFetch. Nic jsem nestahoval kromě textů do `/tmp`, nic neposlal na GitHub.

**Ověřeno (čteno v plném znění místa):**
- **Pojem náboženství:** SEP „The Concept of Religion“ (Schilbrack 2022): *religio*, Tylor, substantivní a funkční definice, fandění a nacionalismus jako hraniční případy, rodová podobnost a pět znaků, Smart.
- **Durkheim** (Swain 1915): definice, posvátné a profánní, buddhismus, magie bez církve, „bůh klanu je klan“, „nepravdivá náboženství nejsou“ a jeho vlastní odpověď na námitku o jednom případu.
- **Otto** (Das Heilige, 1925, německy): numinózní, *mysterium tremendum*, *fascinans* a výzva čtenáři, ať nečte dál, když takový prožitek nezná.
- **Judaismus:** ČEP (Ex 19,5–6; Lv 19,18; Dt 6,4–9; Dt 30,19; Ž 29; Ž 137,1–4; Jr 29,4–7; Mi 6,8); Mišna, Avot 1, 1, 1, 2, 1, 14 a 2, 16; Talmud, Šabat 31a a Gitin 56a–b; data exilu, roku 70 a Mišny z Britanniky; Filón, Maimonides, Spinoza a Buber ze SEP; Jeruzalém, Babylón a Javne z Pleiad; holokaust z USHMM.
- **Obrázky:** pět návrhů z Met (CC0 podle API), nestaženo a nezhlédnuto.

**Neověřeno:** Eliadova kniha (jen Britannica), české překlady Durkheima a Otta, Tanach a Šema ráno a večer, zboření Prvního chrámu v hesle Britanniky, data dokončení talmudů, poloha Sinaje. Seznam je v `k-overeni.md`.

**Co plán koriguje:**
- **Citát v datech potřebuje osobu** (`Citat.osoba` v `src/lib/schema.ts`). Verše Bible, Mišny a Talmudu, Durkheim ani Otto osobu v datech nemají a nové osoby nepřibývají. K1 musí schéma upravit; návrh je v podkladech (Návrh dat).
- **Kolekce `nabozenstvi` nemá místa**; pro mapku judaismu je K1 doplní (pole `mista`) a do `mista.yaml` přibudou `jeruzalem`, `babylon` a `javne`.
- **Žalm 29 v ČEP zní jinak, než uvedl P6:** „Hospodinův hlas burácí nad vodami, zahřímal Bůh slávy“ (Ž 29,3). Pokus „Proč hřmí?“ ho dostane v tomto znění.
- **Rakev** ze známé verze příběhu o Jochananovi v Talmudu není; žáci ho nesou „k pohřbu“.

**Nad čím jsem váhal:**
- **Vstupní scéna judaismu.** Jochanan ben Zakkaj (Javne) nese exil i rabínskou tradici a otázku, co z víry zbude bez chrámu; Hillel na jedné noze je kratší a veselejší, ale nese jen jedno téma, proto je navržený dovnitř stránky. Třetí možnost, Žalm 137, je doložený text, ne scéna, a jeho konec (v. 7–9) do atlasu nepatří.
- **Horoskop a fanklub v pokusu** mohou věřícímu i čtenáři horoskopů znít jako posměch. Nechal jsem je (zadání je chce a nesou Durkheimovo rozlišení magie a náboženství), ale zpětná vazba na téže obrazovce řekne, že podobnost v tom, *jak* lidé něco dělají, nic neříká o tom, *jestli* je pravda, čemu věří.
- **Holokaust:** jedna věta v oddíle o exilu a rozptýlení, bez čísel na začátku a bez obrazu. Bez ní by stránka o judaismu, která mluví o exilu, mlčela o největší katastrofě jeho dějin (pravidlo z 9. 10. 2026: co je podstatné, nemá chybět jen z ohleduplnosti). Víc patří do 7. období.
- **Spinoza** na stránce judaismu jako „vyloučený z obce“ by z tradice udělal příklad nesnášenlivosti; navrhuju ho vynechat a nechat renesanci.
- **Jeruzalém v datech** bez státu v poli `dnes`.

### Co rozhodnout po P6N

Prázdná odpověď znamená souhlas s doporučením.

1. **Pokus v Co je náboženství?:** pět jevů (bohoslužba, fotbalový fanklub, svatba, horoskop, minuta ticha), student je nejdřív sám roztřídí (ano, ne, záleží na…), pak čtyři měřítka (Tylor, Durkheim, Otto, pět znaků podle SEP) ukážou čtyři různé hranice; zpětná vazba bez „správného koše“. Doporučuji.
   Odpověď:
2. **Tři religionisté:** Durkheim a Otto s citátem a nejsilnější námitkou, Eliade jen jednou dvěma větami bez citátu (knihu jsem nečetl); Eliadova fašistická minulost na stránku nepatří. Doporučuji.
   Odpověď:
3. **Slovo mýtus** na obou stránkách (Co je filozofie?, Co je náboženství?) jako „posvátné vyprávění“ s větou, že tu neznamená výmysl. Doporučuji.
   Odpověď:
4. **Vstupní scéna judaismu:** Jochanan ben Zakkaj vynesený z obleženého Jeruzaléma a Javne („vypráví se“, bez rakve), Hillel na jedné noze uvnitř stránky v oddíle o rabínské tradici. Doporučuji.
   Odpověď:
5. **Citáty judaismu:** jádro sedmi (Šabat 31a, Dt 6,4, Ž 137,1.4, Jr 29,7, Avot 1, 1, Avot 1, 14, Dt 30,19), ostatní v rezervě; Bible jen v ČEP, Mišna a Talmud ve vlastním převodu; „hebrejská Bible“, ne „Starý zákon“. Doporučuji.
   Odpověď:
6. **Holokaust** jednou větou v oddíle o exilu a rozptýlení podle USHMM (šest milionů, šoa), bez obrazu a bez otázky s polem na psaní; nic víc na této stránce. Doporučuji.
   Odpověď:
7. **Osoby bez stránky:** Filón s odkazem; Maimonides a Buber jednou větou bez odkazu; Spinoza na stránce judaismu vůbec ne. Doporučuji.
   Odpověď:
8. **Místa:** přidat `jeruzalem` (bez státu v `dnes`), `babylon` a `javne` s ID z Pleiad; Sinaj ne. Doporučuji.
   Odpověď:
9. **Schéma citátu (pro K1):** `osoba` volitelné, nové pole `tradice` u citátů z Bible, Mišny a Talmudu, test, že citát má osobu, nebo tradici, nebo `autor` bez stránky (Durkheim, Otto). Doporučuji; alternativa jsou citáty jen v MDX, což porušuje `CLAUDE.md`.
   Odpověď:
10. **Obrázky:** smí T2 stáhnout votivní reliéf (Met 254966) pro Co je náboženství? a pojítko na Tóru Miriam Foa (633650) pro judaismus, s korunou na Tóru (239512) a chanukovým svícnem (192064) v rezervě; rytinu Titova oblouku (403379) jen tehdy, když je na ní vidět reliéf s menorou. Doporučuji, nebo škrtni, které ne.
    Odpověď:

## Po K1 (1. 11. 2026)

Šablony pěti nových typů stránek stojí a vedou na ně odkazy odevšad, kde je student čeká. Texty jsou prozatímní, vzaté z podkladů a v každém souboru označené komentářem `PROZATÍMNÍ TEXT (K1)`; přepíšou je T1 a T2. Popis šablon je v `docs/design.md` › Stránky období, směru, pokusu, úvodu a tradice, rozhodnutí v `docs/rozhodnuti.md` (1. 11. 2026). Snímky listů všech nových stránek na 390 a 1440 px ve světlém i tmavém režimu jsou v `Claude outputs/snimky/k1/`. Nic jsem nestahoval, nic neposlal na GitHub.

**Hotové:**
- **Stránky:** `/obdobi/pocatky-a-klasicke-recko/` a `/obdobi/helenismus-a-rim/` (hlavička jako deska období, scéna, Co se dělo z `udalosti.yaml` a Mezitím jinde, Otázky doby s cestami, Lidé a směry, Cesty, Na mapě s odkazem do Mapy a času, Kam dál); `/smer/stoicismus/`, `/smer/epikureismus/`, `/smer/kynismus/`, `/smer/akademie/` (založení, tři myšlenky, rodokmen z `vztahy.yaml`, spor, Zkus to žít, u stoicismu karta Stoického týdne, Kam dál); `/pokus/gyguv-prsten/` (Volba předem nová, Změň jednu věc tentýž blok jako u Platóna) a `/pokus/zrcadlo-casu/` (tatáž kresba jako v cestě 8, řádek pomoci); `/co-je-filozofie/` (Thalés jako Příběh, pět odpovědí a Odkryj, deset otázek s disciplínami z dat); `/nabozenstvi/` (Roztřiď pěti jevů, citát Durkheima, seznam tradic z kolekce) a `/nabozenstvi/judaismus/` (oddíly, citát Jr 29,7, Kde a kdy z pole `mista`).
- **Data a schémata:** kolekce `obdobi`, `smery`, `pokusy`, `uvody` a `nabozenstvi` se schématy v `src/lib/stranky-schema.ts`; citát má právě jedno z polí `osoba`, `tradice`, `bezOsoby` (zapsané `jr-29-7` a `durkheim-uvod` a jejich prameny `cep`, `durkheim-formy`, `sep-concept-religion`, `britannica-johanan`, `britannica-babylonian-exile`); místa `jeruzalem` (bez státu), `babylon`, `javne`; pole `smer` u týdne.
- **Cesty k novým stránkám:** pás období na Domů, název období a štítky směrů v Lidech a směrech, drobečky a „období N“ v hlavičce profilu a medailonku, směr v nadtitulku medailonku, drobečky Stoického týdne přes stoicismus, řádek Na začátek na Domů, odkaz v přehledu otázek, řádek v Lidech, Kam dál bloku Gýgův prsten v portrétu Platóna, odkaz v cestě 8, krok 4. Odkaz vede na stránku, jen když existuje (`adresaObdobi`, `adresaSmeru`); hlavička webu a spodní lišta beze změny; hledání nové stránky indexuje samo.
- **Příprava hodiny:** jedenáct nových celých stránek (druh `stranka`, skupina „Období, směry a další stránky“), jejich oddíly, bloky, kresby a příběhy; sdílený blok a kresba zůstávají zastavením tam, kde stály. Kotvy ověřil `scripts/hodiny-katalog.mjs` proti `dist/` (0 chyb).
- **Opravy vzhledu po snímcích:** ornament na desce období je na telefonu pruh nad textem a na notebooku vpravo vedle textu, takže se s nadpisem nepotká; karta cesty má sloupec mincí pevné šířky, takže text ve všech kartách pod sebou začíná na stejném místě (dřív se sloupec smršťoval podle délky textu; týká se i stránek otázek).
- **Testy:** `tests/data/stranky.test.ts` (schémata, citát bez osoby, odkazy jen na existující stránky, rodokmen, oddíly období, katalog) a `tests/e2e/nove-stranky.spec.ts` (všech jedenáct stránek na 390 a 1440 px ve světlém i tmavém režimu s axe, klávesnice, osa a mapa období, rodokmen, odkazy z Domů, Lidí, medailonku, drobečků a týdne, Gýgův prsten sdílí stav s portrétem). Celé `npm test` prošlo.

**Co zůstává na T1 a T2:**
- Všechny texty označené `PROZATÍMNÍ TEXT (K1)`: perexy, scény, odstavce otázek doby, Mezitím jinde, směry, oba pokusy (úvody, hlasy, Volba předem), Co je filozofie? a obě stránky náboženství. V prozatímních textech stojí dva citáty bez záznamu v datech (Theaitétos 174a u Thaléta, Žalm 29, 3 v pěti odpovědích); T1 je zapíše do `zdroje.yaml` a vloží komponentou Citát, nebo převypráví.
- Hlas Epikúra u Gýgova prstenu je bez citátu: `kd-35` zapíše T1 (podklady e).
- Stránky otázek 2 a 8 K1 nemění: šablona stránky otázky je hotová, chybí jen hlasy (T1). Kam dál pokusu Gýgův prsten zatím vede na řádek otázky 2 v přehledu.
- Odkaz v cestě 8, krok 4 na Zrcadlo času je prozatímní věta pod otázkou kroku; T1 rozhodne o znění, nebo ho přesune do Kam dál přehledu cesty.
- Obrázky (desky směrů, pokusů a tradice) přidá T po stažení; šablony je zatím nemají a hlavička je bez obrazu.

**Nad čím jsem váhal:**
- **Pokus Proč hřmí? je seznam pěti odpovědí a pod ním Odkryj**, ne Roztřiď: Roztřiď má nejvýš čtyři koše a pět druhů odpovědi se do něj nevejde. Alternativy: Roztřiď se čtyřmi koši bez umění, nebo rozšířit Roztřiď na pět košů (na 1440 px v pásu 960 se čtyři koše už jednou rozsypaly). Otázka 1.
- **Mapa období ukazuje jen lidi s profilem nebo portrétem, u každého jedno místo.** Se všemi místy působení a s medailonky se popisky v egejském výřezu přetahovaly přes sebe; medailonky najde student v oddílu Lidé a směry.
- **Rodokmen bere vliv přes texty jen uvnitř směru.** Jinak by stoický rodokmen začínal Hérakleitem a obsahoval Epikúra (Seneca ho četl). Učitele zvenku (Kratés u Zénóna, Sókratés u Platóna) bere, protože bez nich směr nemá začátek.
- **Řádek „Na začátek“ na Domů místo čtvrté karty.** Domů má jeden začátek a tři vstupy (`docs/design.md`); čtvrtá karta by soupeřila s vstupy do hlavních sekcí. Otázka 2.
- **Směr v hlavičce profilu jsem nepřidal.** Zadání chce odkaz u štítků směrů; profil štítek nemá (medailonek ho má v nadtitulku a tam odkaz je). Profil vede na směr přes rodokmen a Kam dál, které píše T1. Otázka 3.
- **Úvody mají vlastní kolekci** (rozhodnutí v `docs/design.md`); adresa Co je náboženství? (`/nabozenstvi/`) je jediná, kterou katalog hodin skládá zvláštním pravidlem.
- **Zrcadlo času nese řádek pomoci** jako přehled a krok 7 cesty 8; T1 ho může nechat, nebo přesunout.

### Co rozhodnout po K1

Prázdná odpověď znamená souhlas s doporučením.

1. **Pokus v Co je filozofie?:** pět odpovědí jako seznam a pod ním Odkryj „Čím se těch pět odpovědí liší?“, s rozlišením v odkryté části. Doporučuji; alternativa Roztřiď se čtyřmi koši (bez umění).
   Odpověď:
2. **Vstup na Co je filozofie? a Co je náboženství? z Domů** jako tichý řádek pod třemi vstupy, ne čtvrtá karta. Doporučuji.
   Odpověď:
3. **Směr v hlavičce profilu:** zatím ne; na směr vedou Lidé a směry, medailonky, stránka období a Kam dál v textech T1. Doporučuji; alternativa je odkaz za „období N“ v řádku pod jménem (krátká úprava šablony v T1).
   Odpověď:

## Po T1 (1. 11. 2026)

Všechny texty filozofické části větve jsou napsané a značky `PROZATÍMNÍ TEXT (K1)` z nich zmizely (zůstaly jen u náboženství pro T2). Každý text prošel skillem `atlas-psani`; úvody nových stránek jsem porovnal mezi sebou a s hotovými stránkami otázek a přepsal ty, které začínaly stejně („Škola, která…“, „Uvidíš…“). Snímky listů na 390 px jsou v `Claude outputs/snimky/t1/`. Nic jsem neposlal na GitHub.

**Hotové:**
- **Co je filozofie?** Thalés u studny a s lisy na olivy (Platón, Aristotelés), voda jako počátek (Metafyzika I, 3), údiv jako počátek filozofie (Theaitétos 155d), pět odpovědí na Proč hřmí? bez štítků (Hésiodos, Žalm 29, Anaximandros, NOAA, Beethoven) a Odkryj „Odkud jsou“ s rozlišením mýtu, náboženství, filozofie, vědy a umění, oddíl Čím je filozofie jiná (Metafyzika I, 2) a deset otázek.
- **Období 1 a 2:** scéna Filozof v koši (Oblaka 225 a Obrana 19c, s amforou), scéna Tři filozofové v senátu (Gellius VI, 14), odstavce k otázkám doby včetně nových otázek 2 a 8, Mezitím jinde.
- **Čtyři směry:** založení s vlastním titulkem (Zénón a knihkupec, Zahrada, Antisthenova hůl s citátem Diogenés Laertios VI, 21, Aristotelés v Akademii), tři myšlenky s odkazem na cestu nebo pokus, kde se dají vyzkoušet, u stoicismu příběh Chrýsippa s hlavou z Metu, spor, Zkus to žít (Večer s přítelem, Den bez „protože se to čeká“, Jeden sokratovský rozhovor; u stoicismu týden). Na směry vedou nově Kam dál sedmi profilů a portrétů.
- **Pokusy:** Gýgův prsten (scéna s prstenem z Metu, Volba předem se zpětnými vazbami, hlasy Platóna s Ústavou X, 612b a Epikúra s Hlavní myšlenkou 35 i nejsilnější námitkou proti němu); Zrcadlo času (rok 1969 místo cestovního 1914, věta o bolesti blízkých na téže obrazovce jako argument, Nagelova námitka, řádek pomoci, hlasy Epikúra a Seneky).
- **Otázky 2 a 8:** případ Mobil přes noc a otázka Kdo má rozhodovat, když se třída nemůže shodnout?, každá se šesti hlasy (Prótagorás, Sókratés nebo Diogenés, Platón, Aristotelés, Epikúros, Marcus Aurelius) a Kam dál. Stránka otázky má kvůli tomu nové pole `kamDal` (jediná změna šablony v T1, `src/pages/otazka/[otazka].astro`).
- **Cesta 6, krok 4:** citát `seneca-ep-18-9` a věty o chlebu a vodě nahradil návrat k Dopisu Menoikeovi 130 z minulého kroku; citát se podruhé necituje.
- **Data:** 17 nových citátů s řeckým zněním z PerseusDL, 8 nových pramenů, kotva Zatmění Slunce nad bitvou u řeky Halys (−585), Theofrastos jako Aristotelův žák (Diogenés Laertios V, 36), Chrýsippos → Karneadés `vliv-textem` (IV, 62), u Thaléta nové `kdo` a `proc` (bez „prvního filozofa“ a „místo mýtu“), u Theofrasta `kdo` bez „spolupracovníka“.
- **Obrázky:** čtyři z Metu (CC0): amfora s běžci, hlava Chrýsippa, zlatý prsten s Hermem, bronzové zrcadlo. Originály v `~/Pictures/Atlas-originaly/`, v repozitáři zmenšené na 1280 px.
- **Dvojice:** Dva životy u Theofrasta Aristotelés [učitel] místo Kratéta [současník], u Karneada Chrýsippos [četl] místo [současník]. Kdo žil dřív? beze změny, žádné id bloku ani zastavení v hodinách se nezměnilo.
- **Testy:** upravené přesné seznamy (vstupy v hlavičkách Sókrata, Platóna, Epikúra a Diogena, přehled otázek, Kam dál Platóna a Seneky, Doba a lidé Aristotela, osa období 1, nadpisy oddílů nových stránek, věta kroku 4 cesty 6, osm skupin hlasů v Přípravě hodiny, Kam dál Epiktéta a Marca), nový test otázek 2 a 8, obě otázky v prohlídce. Celé `npm test` jsem pustil jednou; padly tři testy s přesnými seznamy (počet citátů v kroku 4 cesty 6, skupiny hlasů v Přípravě hodiny, odkazy Kam dál u Epiktéta a Marca), po úpravě prošly. `scripts/hodiny-katalog.mjs` proti `dist/`: 0 chyb.

**Nad čím jsem váhal:**
- **Menoikeus 130 podruhé.** Odpověď 8 chtěla citát vyměnit za `menoikeus-130`. Ten ale stojí o krok dřív, a tak krok 4 na něj jen odkáže („Viděl jsi to v minulém kroku“) a citát nezopakuje. Přehled cesty a krok 7 dál říkají, že kynik i Epikúros jedli chléb a pili vodu: mluví o tom, jak žili, ne o cvičení v hladu, proto jsem je nechal.
- **Anaximandros odpovídá o blesku**, ne o hromu: IEP má jen záblesk na tmavém mraku a zprávu Aëtia o hromu z větru P6 nečetl. Mezi pěti odpověďmi je to vidět; nechal jsem to, protože odpověď je doložená a o bouři celé je.
- **Hlas Platóna u Gýgova prstenu** částečně opakuje Co by na to řekli v bloku; odlišuje ho citát z Ústavy X, 612b, který blok jen převypráví.
- **Směry bez Mého stanoviska.** Skill chce u myšlenky vlastní pokus; směr je ale rozcestník a každá jeho myšlenka vede na cestu, pokus nebo kapitolu, kde student odpovídá. Ke každému směru je Zkus to žít.
- **Mobil přes noc** zní „pohádal s přítelkyní“; nechtěl jsem do případu přidávat lomítka ani obecné „s někým“, které by případ oslabilo.
- **Období 2 bez obrázku.** Tetradrachma Alexandra ke scéně v římském senátu nesedí; Pribeh má ornament a minci Karneada.

### Co rozhodnout po T1

Prázdná odpověď znamená souhlas s doporučením.

1. **Kotva Halys bez „asi“:** osa období 1 ukáže „585 př. n. l.“, protože událost v datech přibližný rok neumí. Doporučuji nechat (rok je většinový výklad a jde o dějinnou kotvu, ne o tvrzení v textu); alternativa je pole `priblizne` u událostí a „asi“ na ose (malá změna schématu a komponenty).
   Odpověď:
2. **Tři povolené obrázky nestažené** (tetradrachma Alexandra, hlava neznámého filozofa, soška Dia nebo Poseidóna): žádná stránka pro ně nemá scénu, ke které by popisek seděl. Doporučuji nestahovat.
   Odpověď:
3. **Hlavička Aristotela má osm tlačítek otázek** (Epikúros sedm, Platón pět). Na telefonu stojí pod deskou, takže první obrazovka (jméno, cesta, deska) se nezměnila, jen první odstavec textu je níž. Doporučuji nechat a řešit souhrnně v plánované úpravě designu nebo v `interaktivita-v2`.
   Odpověď:

## Po T2 (1. 11. 2026)

Obě stránky náboženství mají texty a značka `PROZATÍMNÍ TEXT (K1)` zmizela z celé větve. Každý text prošel skillem `atlas-psani` a každou větu jsem četl očima věřícího i nevěřícího studenta. Snímky listů na 390 px jsou v `Claude outputs/snimky/t2/`. Nic jsem neposlal na GitHub.

**Hotové:**
- **Co je náboženství?** Úvod s kostelem a stadionem, Roztřiď pěti jevů se zpětnou vazbou podle koše (`kdyz`) a srovnáním čtyř měřítek (Tylor, Durkheim, Otto, pět znaků podle SEP), scéna Hostina s mrtvým (votivní reliéf z Metu a jeho popiska), oddíl Posvátné, mýtus, rituál, společenství s Durkheimovou definicí, oddíl Jak náboženství zkoumá věda (Durkheim se dvěma námitkami a větou o nepravdivých náboženstvích, Otto a jeho výzva čtenáři, Eliade dvěma větami, otázka pro věřícího i nevěřícího) a ostatní tradice jménem nad kartou judaismu, bez odkazu a bez slibu.
- **Judaismus.** Scéna Jochanana ben Zakkaje (Gitin 56a–b, bez rakve), Tóra a smlouva (Ex 19, Šema, Dt 6,6–9 převyprávěné, Dt 30,19), Exil a rozptýlení (587 př. n. l., Ž 137 a Jr 29,7 jako dvě odpovědi, Kýros, Alexandrie, holokaust jednou větou a hned po ní Tóra, která se čte dál), Rabínská tradice (Avot 1, 1, Mišna, Talmud), příběh Hillela na jedné noze s korunou na Tóru a Avot 1, 14, nový oddíl Víra a filozofie (Filón s odkazem, Maimonides a Buber bez odkazu). Spinoza na stránce není.
- **Data:** 8 citátů (`durkheim-definice`, `otto-posvatno-3`, `dt-6-4`, `dt-30-19`, `z-137`, `avot-1-1`, `talmud-sabat-31a`, `avot-1-14`), 10 pramenů, doplněná poznámka u `sep-philo`. Obrázky votivní reliéf (Met 254966) a koruna na Tóru (Met 239512), oba CC0; originály v `~/Pictures/Atlas-originaly/`, v repozitáři zmenšené na 1280 px.
- **Ověřeno navíc v T2:** Ex 19,5–8, Dt 6,4–9 a Ž 137 znovu v ČEP (obohu.cz); Tóra a ústní Tóra v Britannice („Torah“); popisky Metu k reliéfu a ke koruně. Řádky v `docs/podklady/k-overeni.md` doplněné, rozhodnutí v `docs/rozhodnuti.md`.
- **Šablona:** `SeznamTradic` přijme krátký text nad kartami (slot). Nic dalšího jsem neměnil.
- **Testy:** oddíly judaismu v `tests/e2e/nove-stranky.spec.ts` (přibyl Víra a filozofie). Celé `npm test` prošlo napoprvé (kontrola typů, 922 testů dat, 676 testů v Playwrightu); `scripts/hodiny-katalog.mjs` proti `dist/`: 0 chyb, oba nové příběhy jsou zastavení v přípravě hodiny.

**Nad čím jsem váhal:**
- **Stadion v úvodu.** Úvod staví vedle sebe kostel a stadion, protože pokus se na tu podobnost ptá. Věřícímu to může znít jako srovnání víry s fanděním. Proto úvod nic netvrdí („Asi řekneš, že ne“) a srovnání po třídění řekne, že podobnost v tom, jak lidé něco dělají, nic neříká o pravdě. Ottova výzva čtenáři by jako začátek patřila k Ottovi, ne ke všem.
- **Hostina s mrtvým** čte i student po ztrátě. Obraz je klidný (hostina, ne smrt), mrtvý je hrdina z doby před dvěma a čtvrt tisíci let a scéna o truchlení nemluví; nechal jsem ji.
- **Holokaust** stojí jako poslední odstavec oddílu Exil, ne na jeho začátku, bez obrazu a bez otázky; hned po něm věta, že Tóra se čte dál, „jako v Javne“.
- **„Pro část Židů“** u ústní Tóry drží Britannicu („for some Jews“); „pro Židy“ by tvrdilo víc.
- **Šema ráno a večer** jsem vynechal (nečteno); stránka místo toho převypráví Dt 6,7 („když budeš uléhat nebo vstávat“).
- **Kam dál judaismu** vede na otázku 8 (Jr 29,7) místo řádku otázky 9 v přehledu otázek; Co je náboženství? řádek otázky 9 nechává, protože o ní mluví.
- **Pět znaků** připisuju „jednomu filozofovi náboženství“ bez jména (Schilbrack v SEP); jméno by nic neneslo.
- **Pojítko Miriam Foa** jsem nepoužil: je to vyšívaný pás 368 × 19 cm a na desce by z něj zbyl proužek. Koruna na Tóru je z rezervy v odpovědi 10 po P6N.

### Co rozhodnout po T2

Prázdná odpověď znamená souhlas s doporučením.

1. **Mapka Kde a kdy u judaismu:** na 390 px se popisek Alexandrie kříží s popiskem Javne (Javne a Jeruzalém leží blízko u sebe). Šablona je z K1. Doporučuji opravit v revizi (R) tak, aby se popisky blízkých bodů rozestoupily; týká se i dalších tradic.
   Odpověď:
2. **Odkaz z medailonku Filóna na judaismus:** na stránku tradice zatím vedou jen Co je náboženství? a odkaz z judaismu na Filóna, ne naopak. Doporučuji v R nebo O doplnit medailonkům s `tradice: zidovska` Kam dál na stránku judaismu (pravidlo z dat, ne ruční odkaz).
   Odpověď:

## Po K2 (1. 11. 2026)

Tvoje antika je hotová jako vlastní stránka `/denik/antika/`. Vede na ni tichý odkaz nahoře v Můj deník (jen když v deníku něco je) a první karta Kam dál na stránce období 2. Snímky (390 px světlý, 1440 px tmavý, prázdný a částečný deník, odkaz v deníku) jsou v `Claude outputs/snimky/k2/`. Nic jsem neposlal na GitHub.

**Hotové:**
- **Přehled po velkých otázkách.** Otázka se ukáže, jen když u ní student něco má. Nahoře jeho odpověď: Na začátku (první názor ze stránky otázky) × Teď (pole, které se ukládá samo; tentýž zápis jako Změnil se?, takže se odpověď přepíše na obou místech). Pod ní pravidla z cest a pod nimi „Kdo to viděl podobně jako ty“: mince, jméno s odkazem na stránku, důvod a řádek „cesta · tvoje odpověď“ s odkazem na blok. Tři myslitelé hned, další pod „A další filozofové“.
- **Texty** (podle `atlas-psani`): nadpis Tvoje antika; úvod „Tvoje odpovědi na velké otázky a vedle nich filozofové, kteří to viděli podobně jako ty. Je tu jen to, co jsi v atlasu sám napsal a zvolil, a svou odpověď můžeš kdykoli přepsat.“; prázdný stav „Zatím tu nic není. Až v některé cestě antiky zvolíš odpověď nebo napíšeš svoje pravidlo, objeví se tady i s filozofy, kteří to viděli podobně.“ s odkazem do první cesty. Texty jsou v jednom místě (`TVOJE_ANTIKA` v `src/lib/tvoje-obdobi.ts`).
- **Odkud myslitelé:** Volba, Spor a Změň jednu věc v krocích cest období 1 a 2, přes `odpovedStudenta` z Kdo je na tvé straně. U oddílů Kdo je na tvé straně rozhoduje nový atribut `osoby` u `<Strana>` (doplněný ve 34 odstavcích cest 2, 7, 8, 33 a 34; sestavení zastaví neznámé id), u Sporu bez oddílu strana, ke které se student přiklonil, uprostřed obě.
- **Důvod** je text cesty k odpovědi, kterou student zvolil (odstavec Kdo je na tvé straně jako prostý text s citátem v uvozovkách, u Sporu postoj a první argument strany). Hlas ze stránky otázky ho doplní, kde cesta důvod nemá.
- **Deník a export beze změny:** žádné nové pole, verze 1; Moje stanovisko umí nepovinný `druh`, aby zápis Teď nesl `stanovisko` jako ze Změnil se?.
- **Testy:** `tests/data/tvoje-obdobi.test.ts` (14 testů: prázdný, částečný, plný deník, starý deník bez polí `bloky` a `aktivita` a s poškozenými zápisy, čtení MDX a zastánců), `tests/e2e/tvoje-antika.spec.ts` (10 testů: prázdný a jediná cesta, plný deník se skutečnými bloky, Teď po obnovení stránky a na stránce otázky, formát deníku, klávesnice, axe na 390 a 1440 px ve světlém i tmavém režimu, vstupy z deníku a z období 2). Popis v `docs/design.md` › Tvoje antika, rozhodnutí v `docs/rozhodnuti.md`.

**Nad čím jsem váhal:**
- **Stránka, nebo oddíl deníku.** Vlastní stránka: jde na ni odkázat z období 2 a později z dalších období, a deník zůstává seznamem. Oddíl by deník prodloužil o celý přehled.
- **Důvod z hlasu u otázky, nebo z cesty.** Zkusil jsem nejdřív hlas (první odstavec „Proč to tak viděl“). Asi šest ze čtyřiceti pěti je ale úvodem k citátu, který bez stránky otázky visí („Seneca to napsal příteli…“, „Tvůj případ je starší…“). Text cesty navíc mluví přímo o studentově odpovědi. Hlas proto jen doplňuje a hlas, jehož první věta ukazuje na něco nad sebou, se nepoužije.
- **Odstavec o dvou myslitelích** stojí jako důvod jen u prvního jmenovaného. U Hipparchie tak důvod končí Epiktétovým citátem („A stoika Epiktéta, který svým žákům říkal…“), protože odstavec cesty 7 je o obou; nechal jsem to, oddíl je tak napsaný.
- **Cesta 33, odpověď A** má v odstavci „jeho větu o budoucnosti najdeš na konci tohohle kroku“. Pod Epikúrem v Tvoje antika ten krok nikde není. Otázka 3 níž.
- **Odpovědi bez myslitele z dat.** Kdo v cestě 2 řekl B, C nebo D (Hobbes), v cestě 7 v posledním bloku D (Asch), u senátora v cestě 33 D, v cestě 34 v prvním kroku D nebo v cestě 8 B, myslitele u otázky neuvidí; uvidí pravidlo a odpověď. U D v cestě 34 a B v cestě 8 odstavec Seneku a Epikúra jmenuje, ale tu odpověď nehájí, proto jsem je do `osoby` nedal.
- **Cesty 1 a 3 až 6** nemají oddíl Kdo je na tvé straně; myslitelé z nich přijdou jen ze Sporů.
- **Pole Teď** stojí u každé ukázané otázky, i když student na stránce otázky nic nenapsal. Je to pozvánka, ne výtka: bez prvního názoru má popisek „Jak bys odpověděl ty?“ a nic nad sebou.
- **Bloky mimo cesty** (Spor v portrétu Platóna, Gýgův prsten, pokusy, Moje stanovisko u myšlenek profilů) do přehledu nevstupují: nemají jednoznačnou velkou otázku. Otázky 2 a 8 proto zatím ukážou jen studentovu odpověď. Otázka 2 níž.

### Co rozhodnout po K2

Prázdná odpověď znamená souhlas s doporučením.

1. **Odpovědi bez myslitele z dat** (Hobbes, Asch, Stockdale, Diotima): student s takovou odpovědí u otázky myslitele neuvidí. Doporučuji nechat; připsat nejbližšího myslitele z dat by tvrdilo víc, než cesta říká, a nové osoby nepřibývají.
   Odpověď:
2. **Bloky mimo cesty** (Gýgův prsten k otázce 2, Spor Platón × Diogenés k otázce 6, pokusy): doporučuji je přidat až spolu s polem velké otázky u bloku nebo stránky, nejspíš s prvním středověkým celkem; teď ne.
   Odpověď:
3. **Cesta 33, odpověď A:** doporučuji v R přepsat „najdeš na konci tohohle kroku“ na znění, které platí i mimo krok („jeho větu o budoucnosti najdeš na konci cesty“).
   Odpověď:
4. **Kam dál období 2:** Tvoje antika je první ze čtyř karet (před připravovaným obdobím 3). Doporučuji nechat; antika tam končí.
   Odpověď:

## Po R (3. 11. 2026)

Záznam revize je v `docs/revize/antika-doplnky-2026-11-03.md`. Verdikt: **připraveno ke schválení po opravách**, nic blokujícího. Snímky všech nových stránek na 390 px světle a 1440 px tmavě a Tvoje antika s prázdným a plným deníkem jsou v `Claude outputs/snimky/r/`. Nic jsem neposlal na GitHub.

**Ověřeno:** sestavení; odkazy nad `dist/` (165 stránek, žádný rozbitý odkaz ani kotva, včetně pásu období, štítků směrů a všech Kam dál); `scripts/hodiny-katalog.mjs` (0 chyb, 11 nových stránek a 12 nových hlasů jsou zastavení, Zrcadlo času bez štítku „na začátek hodiny“); `scripts/kontrola-fokus.mjs` na 14 stránkách a obou šířkách (nic pod lištou, nic nepřetéká; pět „překryvů“ na 390 px je planý poplach skriptu, nález 10); citáty nových stránek nejvýš dvakrát v atlasu; Co je filozofie? a Co je náboženství? rozlišují mýtus, náboženství a filozofii stejně. Celé `npm test` po opravách prošlo (kontrola typů bez chyb, 936 testů dat, 686 testů v Playwrightu).

**Opraveno rovnou** (žádnou větu nehlídal test): cesta 33, krok 8 „na konci tohohle kroku“ → „na konci cesty“ (odpověď 3 po K2); období 1 bez třetího opakování věty o Sókratovi, který „se ptal lidí na věci, kterým podle sebe rozuměli“; Akademie bez dvou vět o Karneadovi a Chrýsippovi, které stály slovo od slova na stránce stoicismu; kynismus („vysedával u něj, dokud ho nepřijal“ odporovalo holi o dvě věty dál; zdvojený odkaz na cestu Kolik je dost?); stoicismus (odkaz na otázku Jsem svobodný? slibuje Chrýsippa, ne „stejnou otázku na začátku“); období 2 (interpunkce); Gýgův prsten („Epikúros by se o duši nepřel“ se četlo jako souhlas); otázka 2 (uvozovací věta Sókratova hlasu).

**Nálezy podle dopadu** (podrobně v záznamu):
1. Pokus Proč hřmí?: za filozofii stojí věta o blesku bez důvodu. Seneca zapsal Anaximandrův výklad hromu i s odpověďmi na námitky (Naturales quaestiones II, 18, ověřeno v latinském textu); hotové znění v záznamu.
2. Otázka 2: kdo by mobil vrátil, nemá mezi šesti hlasy zastánce. Marcus podle Hovorů VIII, 59 („pouč, nebo snášej“) jím být může.
3. Období 1 končí větou, že se lidé „začali ptát po důvodech tam, kde dřív stačil příběh“: opak Co je filozofie? a výslovná mez podkladů.
4. Mapka judaismu: popisky Alexandrie, Javne a Jeruzaléma přes sebe (odpověď 1 po T2). Patří do O, protože jde o sdílenou mini mapu s testy a snímky.
5. Náboženství očima věřícího: závěrečná otázka Co je náboženství? počítá se čtenářem, který do kostela nechodí; judaismus podává „Volit musí každý sám“ jako výklad jednotného čísla v Dt 30,19.
6. „Občan světa“ třikrát ve větvi (období 2, kynismus, otázka 8).
7. Tvoje antika: důvod u myslitele někdy začíná větou z kroku cesty („Jestli nemáš…“); řádek „cesta · tvoje odpověď“ patří nad něj.
8. Uvozovací věty hlasů otázek 2 a 8 bez situace („O zákonech to napsal takhle:“).
9. Kam dál „Je Bůh?“ na Co je náboženství? vede na řádek přehledu bez stránky.
10. `scripts/kontrola-fokus.mjs` hlásí odkazy ze zavřených Pramenů.

**Nad čím jsem váhal:**
- **Mapka v R, nebo v O.** Odpověď 1 po T2 ji dávala do R. Oprava ale mění `MiniMapa.astro`, kterou používají všechny profily a medailonky, a chce testy a snímky podle `atlas-komponenta`; revize má opravovat jen drobnosti. Návrh je v nálezu 4.
- **Anaximandros přes Seneku.** Pramen je o šest set let mladší, stejně jako u Thaléta Aristotelés o dvě stě. Výhoda: odpověď má důvody i odpovědi na námitky a navazuje na Oblaka na stránce období 1. Nechat větu o blesku a jen zmírnit Odkryj by pokus nezachránilo.
- **Opakování z profilů.** Kritónova scéna je teď v portrétu Sókrata, v bloku cesty 7, u otázky 2 a jednou větou na stránce období 1; ve větvi samé dvakrát, proto bez nálezu. „Občan světa“ je ve větvi třikrát, proto nález 6.
- **Epikureismus odkazuje scénou založení na profil** (jak to Zahrada dělala s penězi). Založení je tak krátké, ale neopakuje profil. Nechal jsem to.
- **„A další filozofové“ v Tvoje antika** nemá značku rozbalení, stejně jako Prameny všude v atlasu. Není to nález větve; patří do plánované úpravy designu.

### Co rozhodnout po R

Prázdná odpověď znamená souhlas s doporučením.

1. **Proč hřmí?:** odpověď 3 a Odkryj podle Seneky, Naturales quaestiones II, 18 (hrom je zvuk mraku, do kterého narazí vítr; odpovědi na námitky), nový pramen `seneca-nq-ii`. Doporučuji; alternativa je ponechat Anaximandrův blesk a v Odkryj napsat, že důvod se nedochoval (slabší).
   Odpověď:
2. **Otázka 2:** Marcus jako zastánce vrácení („Vrať mu ho: je jeho a slíbil jsi to. Řekni mu napřed, čeho se bojíš, a když tě neposlechne, nezlob se a snášej ho dál.“). Doporučuji; alternativa je sedmý hlas Epiktéta.
   Odpověď:
3. **Náboženství:** nová znění obou vět z nálezu 5 (závěrečná otázka Co je náboženství? a otázka místo výkladu u Dt 30,19). Doporučuji.
   Odpověď:
4. **Kam dál na Co je náboženství?:** do vzniku stránky otázky 9 místo „Je Bůh?“ karta „Velká otázka 6 · Co je skutečné?“. Doporučuji; alternativa je nechat řádek přehledu, jak ho chtěl T2.
   Odpověď:
5. **Mapka tradice (pro O):** v mapce tradice jen jména, role a roky v seznamu pod ní; u blízkých bodů popisek západnějšího bodu doleva. Doporučuji.
   Odpověď:

## Po O (3. 11. 2026)

Všech deset nálezů revize je opravených podle doporučení (odpovědi po R prázdné, tedy souhlas) a k tomu odkaz z medailonků židovské tradice na judaismus (odpověď 2 po T2). Skilly jsou upravené, celé `npm test` prošlo (kontrola typů bez chyb, 937 testů dat, 687 testů v Playwrightu) a snímky dotčených stránek jsou v `Claude outputs/snimky/o/`. Nic jsem neposlal na GitHub.

**Opraveno:**
1. **Proč hřmí?** Odpověď 3 a Odkryj podle Seneky, Naturales quaestiones II, 18, 1. Latinský text jsem si před zápisem přečetl celý (Anaximandros „omnia ad spiritum rettulit“, hrom je „nubis ictae sonus“). Nový pramen `seneca-nq-ii`, řádek v `k-overeni.md`; úvody oddílů mají nově pole `zdroje`, takže Seneca stojí v Pramenech stránky.
2. **Otázka 2:** Marcus je zastánce vrácení („Vrať mu ho: je jeho a slíbil jsi to. Řekni mu napřed, čeho se bojíš, a když tě neposlechne, nezlob se a snášej ho dál.“).
3. **Období 1:** „Lidé v ní začali chtít důvody, o kterých se dá přít, a ne všem se to líbilo.“
4. **Mapka tradice:** jen jména, role a roky zůstaly v seznamu pod ní. Popisek Javne jde doleva podle pravidla, které v mapce už bylo; sdílená `MiniMapa.astro` se změnila jen v popisu pro čtečku (místo bez řádků nemá prázdné závorky), mapky profilů se nehnuly. Nový test v `nove-stranky.spec.ts` (jen jména, názvy se nepřekrývají, seznam).
5. **Náboženství:** závěrečná otázka Co je náboženství? („spolužákovi, který každý týden chodí do kostela, do synagogy nebo do mešity… kdyby ses ptal sám na sebe?“) a u Dt 30,19 otázka „Volí tu celý lid jako jeden, nebo každý sám za sebe?“.
6. **Občan světa:** období 2 u otázky 8 končí Marcem a úlem místo Diogena; anekdota je teď v kynismu, u otázky 8 a v profilu Diogena, `hovory-vi-54` dvakrát.
7. **Tvoje antika:** řádek „cesta · tvoje odpověď“ stojí nad důvodem.
8. **Uvozovací věty:** otázka 2 Epikúros „Ukázal to na zákonech:“, Marcus „Co dělat s člověkem, který dělá chybu, si v zápisníku shrnul do dvou vět:“; otázka 8 Epikúros „Z jeho knih zbyly hlavně krátké výroky. V jednom vysvětluje, kde je bezpečí nejčistší:“, Marcus „Připomínal si to obrazem z včelína:“.
9. **Kam dál na Co je náboženství?:** „Velká otázka 6 · Co je skutečné?“; návrat na otázku 9 je v Co zůstává na později.
10. **`scripts/kontrola-fokus.mjs`** vynechává prvky, které `checkVisibility()` nevidí.
- **Filón a judaismus:** stránka tradice má pole `tradice` (`zidovska`) a medailonek osoby téže tradice z něj dostane kartu „Náboženství · Judaismus“ (`kamDalMedailonku`); jednotkový test a test v prohlížeči.

**Skilly a poučení:** `atlas-osobnost` má oddíl Stránka směru; `atlas-cesta` oddíl Stránka myšlenkového pokusu a u stránky otázky zastánce každé odpovědi, uvozovací věty a otázky bez cesty; `atlas-komponenta` oddíl Stránky skládané z dat (šablony, vazba v datech, Prameny z textu, mapka, Tvoje antika, kontrola fokusu); `atlas-revize` novou perspektivu Stránky z dat a náboženství. Poučení z větve jsou v `docs/pouceni.md`, poznámky pro `atlas-obdobi` (šablona období, směry, náboženství doby, pokusy, přehled v deníku) v `skills/atlas-obdobi/poznamky.md`. Kopie v `skills/` jsou upravené; do účtu Claude jsem je dal ke schválení na kartách v chatu (čtyři skilly, `atlas-cesta` zvlášť). Rozhodnutí kroku jsou v `docs/rozhodnuti.md`, `docs/design.md` popisuje pole `tradice` a `zdroje`.

**Nad čím jsem váhal:**
- **Odkryj u Anaximandra.** Revize navrhovala „Odpovídal ale i na námitky“. Otázky a odpovědi jsou ale Senekova forma výkladu, ne doložený spor; napsal jsem „Jeho výklad ale odpovídá i na otázky, které by mu položil pochybovač, a dá se zkoumat.“ a „převyprávěl“ místo „zapsal“.
- **Epikúros u otázky 8.** Komu Hlavní myšlenky psal, podklady neříkají; uvozovací věta stojí na tom, co říká profil (zbyly dopisy a sbírky krátkých výroků), a nic nevymýšlí.
- **Druhá půlka odpovědi 5** (popisek západnějšího bodu doleva) už v kódu byla. Nové pravidlo pro blízké body jsem nepřidával, aby se nehýbaly mapky profilů a medailonků.
- **Karta tradice místo druhého člověka.** Kam dál medailonku má tři místa; u Filóna je teď Platón, Judaismus a Mapa a čas a Lidé a směry zůstaly v drobečcích. Šlo by dát kartu tradice až místo Mapy a času.
- **Snímky** jsem pořídil jen u změněných míst (pokus Proč hřmí?, otázky 2 a 8, období 1 a 2, Co je náboženství?, judaismus s mapkou, Tvoje antika, Filón), ne celé stránky znovu.

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

## Uzavření

Odpověď na otázku níž rozhodne, jestli se větev uzavře. Prázdná odpověď tu souhlas neznamená: sloučení a GitHub smí rozhodnout jen ty.

**Schvaluješ větev antika-doplnky po opravách (O)?** Když ano, sloučí se do hlavní větve a hlavní větev se pošle na GitHub (nasadí web, pořád s `noindex`). Když ne, napiš, co změnit.
Odpověď: Schvaluji (3. 11. 2026).

Model: Opus 5.5 · medium. Až po schválení autorem: sloučení `antika-doplnky` do `main` (`--no-ff`), push hlavní větve (nasadí web, pořád s `noindex`), pohled, že kontroly na GitHubu jsou zelené, plán a zadání do archivu, řádek v `docs/plan.md` a Další větve v pořadí, plán větve z Projektu Claude odstranit a aktualizovat tam `docs/plan.md`.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev antika-doplnky. Uzavření větve po schválení autorem. Archiv nečti.

0. git switch antika-doplnky, git status bez necommitnutých změn. Přečti CLAUDE.md a v tomto plánu tabulku, oddíl Po O a Uzavření s odpovědí. Bez souhlasu v odpovědi nic neslučuj.
1. git switch main, git merge --no-ff antika-doplnky, celé npm test, git push origin main. Počkej, až kontroly na GitHubu doběhnou (gh run list), a podívej se na nasazený web.
2. Plán větve a záznam revize do docs/archiv/, řádek v docs/plan.md (rozcestník a Další větve v pořadí). V Projektu Claude plán větve odstraň a aktualizuj docs/plan.md. Commit v hlavní větvi a push.
```
