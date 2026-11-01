# Plán větve antika-doplnky: co antice chybí před středověkem

Souhrnná revize antiky sepsala, co z plánu F3 v atlasu ještě není, a rozdělila to na „před středověkem“ a „později“ (`docs/revize/antika-2026-10-25.md`, oddíl 10). Tahle větev dodělá všechno z první skupiny: vstupní stránku Co je filozofie?, stránky období 1 a 2, čtyři směry, které nesou cesty, stránky otázek 2 a 8, dva myšlenkové pokusy jako samostatné stránky, Co je náboženství? s judaismem a deník na konci období. K tomu dvě drobnosti odložené z dřívějších větví: výměna citátu `seneca-ep-18-9` v cestě 6 a pět chybějících vztahů z `interaktivita-v1`. Větev založena z hlavní větve (`812fbed`) 1. 11. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: antika má deset cest a dvanáct stránek osobností, ale student z ní nemá kudy vstoupit do celku. Pás osmi období na Domů vede jen na kotvy v Lidech, třináct směrů jsou jen jména, polovina otázek nemá stránku a slovo „filozofie“ nikde nikdo nevysvětlí. Středověk na tyhle stránky naváže (období 3, směry scholastika a patristika, otázka 9, islám a judaismus), proto mají šablony vzniknout teď, na hotové látce.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| P6 | Podklady k filozofii: Co je filozofie?, období 1 a 2, čtyři směry, hlasy otázek 2 a 8, oba pokusy, náhrada `seneca-ep-18-9`, pět vztahů | Sonnet 5.5 · high s vyhledáváním; Opus 5.5 · high u sporných pramenů | hotovo 1. 11. 2026 (`docs/podklady/antika-doplnky.md`); čeká na odpovědi po P6 |
| P6N | Podklady k náboženství: Co je náboženství?, judaismus | Opus 5.5 · high s vyhledáváním | hotovo 1. 11. 2026 (`docs/podklady/nabozenstvi-uvod.md`); čeká na odpovědi po P6N |
| K1 | Šablony nových stránek (období, směr, pokus, náboženství, Co je filozofie?) a navigace k nim | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | čeká |
| T1 | Texty filozofie: Co je filozofie?, období 1 a 2, čtyři směry, dva pokusy, otázky 2 a 8, cesta 6, vztahy v datech | Opus 5.5 · high se skilly `atlas-psani`, `atlas-osobnost`, `atlas-cesta` a `atlas-data` | čeká |
| T2 | Texty náboženství: Co je náboženství?, judaismus | Opus 5.5 · high se skilly `atlas-psani` a `atlas-osobnost` | čeká |
| K2 | Deník na konci období: „Tvoje antika“, vlastní myšlenkový autoportrét | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | čeká |
| R | Revize větve | Opus 5.5 · high se skillem `atlas-revize` | čeká |
| O | Opravy po revizi a úprava skillů | Opus 5.5 · high | čeká |
| Uzavření | Schválení autorem, sloučení, push hlavní větve (nasadí web), kontroly na GitHubu zelené | Opus 5.5 · medium | čeká |

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
- **Odkaz na otázku 9** z věty o hranici religionistiky na stránce Co je náboženství?, až otázka 9 dostane stránku; stejně cesta 35.
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

Model: Opus 5.5 · medium. Až po schválení autorem: sloučení `antika-doplnky` do `main` (`--no-ff`), push hlavní větve (nasadí web, pořád s `noindex`), pohled, že kontroly na GitHubu jsou zelené, plán a zadání do archivu, řádek v `docs/plan.md` a Další větve v pořadí, plán větve z Projektu Claude odstranit a aktualizovat tam `docs/plan.md`.
