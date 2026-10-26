# Podklady: Stoický týden

Ověřeno 26. 10. 2026 (krok P6, větev `stoicky-tyden`). Celek: sedm krátkých cvičení v duchu Zkus to žít, jedno na den (`docs/architektura.md` › Stoický týden; plán větve `docs/plany/stoicky-tyden.md`).

**Co jsem četl sám.** Řecké a latinské znění všech míst, která list cituje, jsem v tomhle kroku znovu četl v textech z projektu Perseus (Marcus, Hovory II, 1, V, 1, VII, 48, IX, 30, XII, 24; Epiktétos, Rukojeť 1, 3, 4, Rozpravy III, 2, III, 3, I, 1; Seneca, Dopisy 18, 63, 99; Gellius XIX, 1; Diogenés Laertios VII, 116–117) a O hněvu III, 36 přes WebFetch z latinského textu. Řecké a latinské `original` u citátů, které atlas už má (`hovory-ii-1`, `hovory-v-1`, `hovory-ix-30`, `rukojet-1`, `rukojet-1-5`, `rukojet-3-hrnek`, `rozpravy-iii-2-4`, `seneca-ep-18-9`, `seneca-ep-63-1`, `seneca-ep-99-15`), odpovídá slovo od slova tomu, co jsem četl. Hadota, Irvinea, Ellise a Becka znám jen z recenzí a přehledů (viz konec listu, oddíl „Co jsem neviděl sám“). Číslování oddílů v Dopisech 18, 63 a 99, v Gelliovi a v Diogenovi Laertiovi se v použitých souborech nedalo zkontrolovat (Perseus tam oddíly neznačí); držím se čísel, která atlas už používá, a běžné citace.

**Překlady.** Všechny české věty v atlasu jsou „vlastní“, převedené z řeckého nebo latinského znění. Publikovaný český překlad jsem neotvíral; kde dole píšu „český překlad, který atlas cituje“, myslím vlastní převod v `src/data/zdroje.yaml`.

## Pravidla týdne (společná mez)

Platí pro všech sedm dnů; ve studentském textu stačí jednou, na stránce týdne nahoře, a u každého dne jen jeho vlastní mez.

1. **Kdykoli přestaň.** Každé cvičení se dá přerušit nebo vynechat bez následku; vynechaný den se nepočítá jako přerušení (plán větve, otázka 2). Žádné série, body ani pořadí.
2. **Když to zhoršuje, ne zlepšuje:** jedna věta „Když ti po tom bývá hůř, přestaň a řekni to někomu, komu věříš“. Žádné vysvětlování proč.
3. **Cvičení je na vlastní reakci, ne na to, co ti dělá někdo druhý.** Člověk, který ubližuje, není látka cvičení (pravidlo z `docs/pouceni.md`); u každého dne jsem to napsal ke konkrétnímu místu, kde by se to dalo přečíst jinak.
4. **Nic o jídle, pití, spánku, lécích, teplu a oblečení, které je potřeba.** Ve dnech 1 až 7 žádná věta, která by šla číst jako „omez se“ (viz den 5).
5. **Blízcí lidé, nemoc a smrt do cvičení nepatří** (celek 10, oddíl f; Rukojeť 3 jen hrnek).
6. **Bez pomůcek, pár minut.** Psaní jen v den 7 a poznámka do deníku.

## Den 1: Ranní příprava (Marcus Aurelius)

**Pramen cvičení.** Marcus Aurelius, *Hovory k sobě* II, 1 a V, 1; formu „příprava před činem“ má i Epiktétos, *Rukojeť* 4. Řecky (čteno):

- II, 1: „Ἕωθεν προλέγειν ἑαυτῷ· συντεύξομαι περιέργῳ, ἀχαρίστῳ, ὑβριστῇ, δολερῷ, βασκάνῳ, ἀκοινωνήτῳ“ (hned ráno si předem říkat: potkám člověka všetečného, nevděčného, zpupného, lstivého, závistivého, sobeckého). Marcus pokračuje: všechno to jim přišlo z neznalosti dobra a zla; já nemohu být poškozen a nemohu se na příbuzného hněvat, protože jsme stvořeni ke spolupráci jako nohy, ruce a oční víčka.
- V, 1: „Ὄρθρου, ὅταν δυσόκνως ἐξεγείρῃ, πρόχειρον ἔστω ὅτι ἐπὶ ἀνθρώπου ἔργον ἐγείρομαι“ (když se ti za svítání nechce vstávat, měj po ruce: vstávám k práci člověka). Pokračování (nechat stranou, viz níže) mluví o míře v jídle a pití a o tom, že „nemiluješ sám sebe“.
- Epiktétos, *Rukojeť* 4: „ὅταν ἅπτεσθαί τινος ἔργου μέλλῃς, ὑπομίμνῃσκε σεαυτόν, ὁποῖόν ἐστι τὸ ἔργον“ (až se do něčeho chystáš, připomeň si, co je to za věc); příklad: jdeš-li se umýt, představ si, co se v lázních děje (cákají, strkají, nadávají, kradou), a řekni si „chci se umýt a zachovat si své rozhodování v souladu s přírodou“ (τὴν ἐμαυτοῦ προαίρεσιν κατὰ φύσιν ἔχουσαν τηρῆσαι).

**Český překlad, který atlas cituje:** `hovory-ii-1` a `hovory-v-1` (vlastní, podle Leopolda). `Rukojeť 4` v datech není.

**Co je doložené a co pozdější.**

| Tvrzení | Typ | Poznámka |
| --- | --- | --- |
| Marcus si sám sobě píše pokyny v druhé osobě („když se ti nechce vstávat“ V, 1; „dívej se shora“, „představ si“ IX, 30; řecky čteno) | doložený fakt | Odtud „oslov se ‚ty‘“ v den 7. |
| Marcus dělal tohle každé ráno | **nedoloženo** | II, 1 je pokyn („říkat si“), ne zpráva o zvyku. Že jsou Hovory aspoň zčásti z posledních let tažení, píše SEP (Kamtekar); k čemu přesně sloužily, se vykladači liší. |
| Příprava před činem (Epiktétos, Rukojeť 4) | doložený fakt | Jiný autor, stejná forma; neříká „ráno“. |
| Hovory jako soubor duchovních cvičení, tři „disciplíny“ (touha, jednání, souhlas) | **výklad Pierra Hadota** | Tři tópy jsou u Epiktéta (Rozpravy III, 2, 1–3, čteno), na Marca je přenesl Hadot. Znám jen z recenze (BMCR, Kamtekar), knihu jsem nečetl. |
| „Ranní rutina“ jako návod k dnešnímu stoicismu | pozdější podání | Z moderního stoicismu (Irvine a další); jen z recenzí. |

**Citát pro den.** `hovory-v-1` (v datech, kolikrát v atlasu: **0**). „Když se ti za svítání nechce vstávat, měj po ruce: vstávám k práci člověka.“

**Proč ne `hovory-ii-1`** (v datech, **0** výskytů; architektura ho jmenuje):

- Je to **seznam typů lidí**, které student potká. Ráno si říct „potkám lstivého a zpupného“ je pro studenta, kterému někdo ubližuje (třída, rodina), pokyn smířit se. `docs/pouceni.md`: cvičení nesmí mířit na člověka, který ubližuje druhým.
- Marcova pointa („to jim přišlo z neznalosti dobra a zla“) se dá číst jako omluva toho, kdo ubližuje.
- Kdyby ho autor přesto chtěl, jen do učitelského listu; do studentského textu ne. Žádná zkrácená podoba, která by výčet vynechala a Marcovu pointu nechala, mi nepřipadá poctivá.

**V, 1 jen první větou, jak ji data mají.** Pokračování o míře v jídle a pití a výtka „nemiluješ sám sebe“ do studentského textu nepatří: první se týká jídla, druhá by studentovi, kterému se nechce vstávat z jiného důvodu než lenosti, přidala vinu.

**Co student ten den udělá** (jedna až dvě minuty, bez pomůcek). Než vstane nebo vyjde z domu, vybere jednu věc dne, která bude těžká nebo se mu do ní nechce, a jednou větou si řekne, co je v ní jeho práce. Nic nepíše. Návrh znění pro T: „Než vstaneš: vyber jednu věc dneška, která bude těžká nebo se do ní nechce. Řekni si: tohle je dnes moje práce. Víc nepotřebuješ.“

**Mez.**

- Když je těžké vstávat několik týdnů, ne jen dnes, není to lenost a cvičení to nespraví: řekni to někomu (jedna věta, ne kázání: „Tohle cvičení není zkouška vůle.“).
- Když je „těžká věc“ člověk, který ti ubližuje, není to cvičení na něj.
- Slovo „práce“ ve studentském textu: ne „povinnost“ ani „máš“; Marcus píše o práci člověka, ne o tom, co student dluží.

## Den 2: Co je v mé moci (Epiktétos)

**Pramen cvičení.** Epiktétos, *Rukojeť* 1, hlavně §1 a §5; *Rozpravy* III, 3, 1 a III, 2, 1–4. Řecky (čteno):

- §1: „τῶν ὄντων τὰ μέν ἐστιν ἐφʼ ἡμῖν, τὰ δὲ οὐκ ἐφʼ ἡμῖν. ἐφʼ ἡμῖν μὲν ὑπόληψις, ὁρμή, ὄρεξις, ἔκκλισις […]· οὐκ ἐφʼ ἡμῖν δὲ τὸ σῶμα, ἡ κτῆσις, δόξαι, ἀρχαὶ […]“ (z toho, co je, je něco v naší moci a něco ne: v naší moci je úsudek, podnět k činu, touha a odpor; v naší moci není tělo, majetek, pověst a úřady). To je `rukojet-1`.
- §5, vlastní cvičení: „εὐθὺς οὖν πάσῃ φαντασίᾳ τραχείᾳ μελέτα ἐπιλέγειν ὅτι φαντασία εἶ καὶ οὐ πάντως τὸ φαινόμενον. ἔπειτα ἐξέταζε αὐτὴν καὶ δοκίμαζε τοῖς κανόσι τούτοις […], πρώτῳ δὲ τούτῳ καὶ μάλιστα, πότερον περὶ τὰ ἐφʼ ἡμῖν ἐστιν ἢ περὶ τὰ οὐκ ἐφʼ ἡμῖν“ (cvič se každému drsnému dojmu hned říkat: jsi dojem a vůbec ne to, čím se zdáš být; pak ho zkoumej podle pravidel, především podle toho, zda se týká toho, co je v naší moci, nebo toho, co není). To je `rukojet-1-5`. Konec §5, jak jsem ho četl: „κἂν περί τι τῶν οὐκ ἐφʼ ἡμῖν ᾖ, πρόχειρον ἔστω τὸ διότι οὐδὲν πρὸς ἐμέ“ (a jde-li o něco z toho, co v naší moci není, měj po ruce, že se mě to netýká).
- *Rozpravy* III, 3, 1: „ἔργον δὲ καλοῦ καὶ ἀγαθοῦ τὸ χρῆσθαι ταῖς φαντασίαις κατὰ φύσιν“ (dílem dobrého člověka je užívat dojmů podle přírody).

**Český překlad, který atlas cituje:** `rukojet-1` (vlastní, podle Schenkla a Longa; v atlasu **1×**, cesta 5, krok 3 „Dvě půlky“) a `rukojet-1-5` („Jsi dojem, a vůbec ne to, čím se zdáš být“; **0×**).

**Co je doložené a co pozdější.**

| Tvrzení | Typ | Poznámka |
| --- | --- | --- |
| Epiktétos učí rozlišovat, co je a co není v naší moci, a velí k tomu cvičit (μελέτα) | doložený fakt | Rukojeť 1, 1 a 5 čteno řecky. |
| Cvičení je „říct si hned při dojmu“ | doložený fakt | §5, imperativ „μελέτα ἐπιλέγειν“. |
| Rozdělení jako „dichotomie kontroly“ a návod na klid | pozdější podání | Název z moderního stoicismu; Ellis se k Epiktétovi hlásil, Beck ho podle jednoho přehledu (Dickinson 2024) v příručkách od 1980 neuvádí. Znám jen z přehledů. |
| Stockdale se o Epiktéta opíral | doložený fakt | Podle jeho vlastních textů, `docs/podklady/celek-10.md` oddíl a. |

**Citát pro den.** `rukojet-1-5` (**0×**): věta, kterou si student řekne. `rukojet-1` jen odkazem na cestu 5 (nerozepisovat znovu).

**Co je ve znění nebezpečné.**

- *„Jsi dojem“ může znít jako „jen si to namlouváš“.* U studenta, kterému někdo opravdu ubližuje, je to věta, která znevažuje, co se děje. Mez: cvičení je na **vlastní zlost a strach**, ne na to, co ti někdo dělá („to není jen dojem“).
- *„Tělo není v naší moci“* (§1) čte jinak student s nemocí nebo trápením s vlastním tělem. `rukojet-1` ho obsahuje a atlas ho v cestě 5 už má; v týdnu ho **nezdůrazňovat**: na den 2 stačí `rukojet-1-5` a samotná rozdělovací otázka („je to moje, nebo ne?“).
- *Pokračování §1* („nikdo ti neublíží, nepřítele mít nebudeš“) platí jen ve stoickém smyslu (újma na vlastním rozhodování) a doslova je nepravdivé. Do studentského textu ne.
- *„Nic z toho se mě netýká“* (konec §5) se dá přečíst jako lhostejnost k druhým. Epiktétos to říká o dojmech, které míří na to, co není v mé moci, ne o bolesti druhého. Odpověď: *Rozpravy* III, 2, 4 (viz oddíl o námitce).

**Co student ten den udělá** (jedna minuta, jednou nebo dvakrát). Když ho dnes něco rozzlobí nebo vyděsí, řekne si v duchu „je to dojem“ a zeptá se: je tohle moje, nebo ne? Co s tím můžu udělat já? Nic nepíše. Návrh znění pro T: „Když tě dnes něco rozčílí nebo vyděsí, řekni si: Je to dojem. Pak se zeptej: je tohle moje, nebo ne? Co s tím můžu udělat já?“

**Mez.**

- Nepoužívat na to, co ti dělá člověk, který ti ubližuje: „to není jen dojem; o tom řekni někomu.“
- Když po cvičení máš pocit, že ti „nic nevadí“ a nic necítíš, přestaň: cílem není necítit.
- Neříkat „nemělo by ti to vadit“. Stačí „zeptej se“.

**Kam sem dát námitku.** Na den 2 jen odkaz na větu z první obrazovky týdne a na cestu 5, krok 7, bez opakování citátu (viz oddíl „Nejsilnější námitka“).

## Den 3: Představa nejhoršího (Seneca) — jen převzít a zkrátit

Cvičení je hotové a ověřené: karta „Pět minut, jedna věc“ (`cesta33-pet-minut`) v cestě 33, krok 8, s podklady v `docs/podklady/celek-10.md` oddíl b (Dopisy 24, 2; 98, 5–8; 13, 4; O duševním klidu 11, 6; Rukojeť 3) a mezí v oddílu e a h. Název *praemeditatio futurorum malorum* je Ciceronův (Tuskulské hovory III, 29), „negativní vizualizace“ je moderní název (Irvine; jen z recenze).

**Převzít z karty (doslova nebo těsně):**

- jedna malá věc, které se v nejbližších dnech trochu bojíš (test, rozhovor);
- pět minut: Co nejhoršího se může rozumně stát? Co bys pak udělal jako první? Co z toho máš v rukou už dnes?
- obrat: „Pak to odlož a jdi dělat něco, co máš rád.“
- mez: „Když se ti to začne točit dokola, přestaň: na to tohle cvičení není. Na člověka, který ti ubližuje, taky ne: o tom řekni někomu, komu věříš.“

**Zkrátit:**

- Poslední větu karty („Až ta věc přijde, všimni si, jestli tě zaskočila“) z dne 3 vyndat: míří za týden a dalo by se číst jako zkouška. Patří do dne 7 jako volná poznámka do deníku, nebo zůstane jen v kartě.
- Výčet příkladů zkrátit na dva („test, rozhovor“); zápas a prezentace nechat kartě.
- Nepřidávat Rukojeť 3 dál než k hrnku, nic o blízkých (celek 10, oddíl f).

**Citát pro den:** nepovinný, `rukojet-3-hrnek` („začni od nejmenších věcí; máš-li rád hrnek…“; v atlasu **1×**, cesta 33, krok 3) — dává týdnu to, co chce celek 10: začátek od malého. Seneca z Dopisu 24, 12 (`seneca-ep-24-12`, **1×**, cesta 33, krok 4) zní jako rozkaz „připrav se na to nejnespravedlivější“ a ve dni 3 ho nedoporučuju.

**Mez navíc pro týden:** den 3 se dá **vynechat bez důvodu**; student, kterému se věc už točí v hlavě, ho nemá dělat. Stačí jedna věta: „Když se ti ta věc už teď vrací v hlavě, dnešek přeskoč. Nic nezmeškáš.“

## Den 4: Pohled shora na vlastní starosti (Marcus Aurelius)

**Pramen cvičení.** Marcus Aurelius, *Hovory k sobě* IX, 30, dále VII, 48 a XII, 24. Řecky (čteno):

- IX, 30: „Ἄνωθεν ἐπιθεωρεῖν ἀγέλας μυρίας καὶ τελετὰς μυρίας καὶ πλοῦν παντοῖον ἐν χειμῶσι καὶ γαλήναις“ (dívat se shora: nespočetná stáda, nespočetné obřady, plavby všeho druhu v bouřích i za bezvětří). Pokračuje: představ si i život, který žili jiní dávno před tebou a který budou žít po tobě; a „καὶ ὡς οὔτε ἡ μνήμη ἀξιόλογόν γε οὔτε ἡ δόξα οὔτε ἄλλο τι τὸ σύμπαν“ (vzpomínka ani sláva ani nic jiného není hodno řeči).
- VII, 48: „Καλὸν τὸ τοῦ Πλάτωνος“ (krásné je to Platónovo): když mluvíš o lidech, dívej se i na pozemské věci „ὥσπερ ποθὲν ἄνωθεν“ (jako odněkud shora): stáda, vojska, hospodářství, svatby, rozchody, zrození, úmrtí, hluk soudů, pusté kraje, nesčetné národy, svátky, nářky, trhy.
- XII, 24: třetí věc, kterou mít po ruce: kdybys byl náhle vynesen vzhůru a pozoroval lidské věci, „καταφρονήσεις“ (budeš jimi pohrdat).

**Český překlad, který atlas cituje:** `hovory-ix-30` (**0×**; vlastní, podle Leopolda, **zkráceno** na první větu: „Dívej se shora: nespočetná stáda, nespočetné obřady, lodě v bouři i za bezvětří.“).

**Co je doložené a co pozdější.**

| Tvrzení | Typ | Poznámka |
| --- | --- | --- |
| Marcus si píše, že se má dívat shora (IX, 30; VII, 48; XII, 24) | doložený fakt | Řecky čteno. |
| Pohled shora je „platónský“ | doložený fakt s výhradou | VII, 48 sám říká „Platónovo“, kde to Platón říká, jsem nehledal; vydání se liší, kam věta patří (`docs/podklady/k-overeni.md`): Platóna u cvičení nejmenovat. |
| „Pohled shora“ jako pojmenované duchovní cvičení | **Hadotův výklad** | Hadot z těchhle míst skládá samostatné cvičení; znám jen z recenze. |
| Cvičení se „dělá“ (dívat se shora a cítit se menší) | pozdější podání | U Marca jde o text, ne o popsaný postup; představa, že student si to ten den vyzkouší, je výklad. |

**Co je ve znění nebezpečné.**

- *Konec IX, 30* („ani vzpomínka, ani sláva, ani nic jiného není hodno řeči“) a *XII, 24* („budeš jimi pohrdat“) vedou k „nic nemá váhu“ a k pohrdání lidmi. Citát v datech je před tímhle koncem zkrácen; **neprodlužovat**.
- Pohled shora **zmenšuje**. U starosti o to, co si o mně myslí druzí, nebo o výkon, to pomáhá. U ztráty, žalu, strachu o někoho nebo u toho, co mi někdo dělá, „malé“ neznamená „nic“ a cvičení by tu bylo přehlížením. Proto jen na „vlastní starosti“, jak říká architektura.
- *Odstup od sebe samého.* Představa „dívám se na sebe zvenku“ může být nepříjemná pro studenta, který se často cítí vzdálený od sebe nebo od okolí, a může to zesílit. To je můj úsudek o riziku, nic jsem k tomu nedoložil; řeší ho druhý bod meze níž a v T mu patří jedna věta.

**Co student ten den udělá** (dvě až tři minuty, bez pomůcek, oči otevřené nebo zavřené). Vybere jednu starost, ne bolest, ale starost (co si o mně pomyslí, dopadne to špatně?). Představí si ulici, město, zemi jako mapu shora, se spoustou lidí, z nichž každý má svůj den. Najde na té mapě svou starost. Pak se vrátí: tři věci v místnosti pojmenuje, a řekne si, co s tou starostí dnes udělá jednu věc. Návrh znění pro T: „Vyber jednu starost, která se týká toho, co si o tobě pomyslí druzí nebo jak ti něco dopadne. Dívej se shora: ulice, město, země, spousta lidí a každý má svůj den. Kde je tam tvoje starost? Pak se vrať: pojmenuj tři věci kolem sebe a řekni si, co s ní dnes uděláš jednu věc.“

**Mez.**

- Nepoužívat na ztrátu, žal, nemoc, strach o někoho ani na to, co ti někdo dělá. „Malé“ neznamená „nic“.
- Když se po cvičení cítíš jako bez sebe, vzdálený od všeho nebo prázdný, přestaň, pojmenuj tři věci kolem sebe nahlas a řekni to někomu.
- Neříkat „je to malé“ ani „nic z toho nemá váhu“. Takový závěr tahá Marcus na konci IX, 30 (ani vzpomínka, ani sláva nic neznamenají) a student ho slyšet nemá; cvičení má jen ukázat, kde starost na mapě leží.

## Den 5: Jeden den skromnosti (Seneca) — a jídlo

Tohle je den, na kterém se architektura a zadání lámou. **Rozhodnutí P6: den 5 se nestaví na Dopisu 18, 5–9, protože ten je celý o jídle.** Níž proč, a co navrhuju místo toho.

**Pramen cvičení.** Seneca, *Dopisy Luciliovi* 18, 5–9 (latinsky čteno). Seneca radí příteli, aby si „vložil několik dní“ (*interponas aliquot dies*), kdy se spokojí „s nejmenším a nejhorším jídlem, drsným a hrubým oděvem“ (*contentus minimo ac vilissimo cibo, dura atque horrida veste*) a řekne si „Je tohle to, čeho jsme se báli?“ (*Hoc est quod timebatur?*). Říká „tři nebo čtyři dny“ (*triduo et quatriduo*), s hrubým lůžkem (*grabatus*), pláštěm a tvrdým špinavým chlebem (*panis durus ac sordidus*); jako vzor uvádí Epikúra, který „měl určité dny, kdy hlad jen skrovně tišil“ (*certos habebat dies […], quibus maligne famem extingueret*, 18, 9; to je `seneca-ep-18-9`). Mezi tím stojí věta, na které cvičení stojí (18, 6): „Miles in media pace decurrit, sine ullo hoste vallum iacit et supervacuo labore lassatur, ut sufficere necessario possit. Quem in ipsa re trepidare nolueris, ante rem exerceas“ (voják i uprostřed míru cvičí, bez nepřítele staví val a unavuje se zbytečnou prací, aby vydržel tu nutnou; koho nechceš mít při skutečné věci roztřeseného, toho cvič předem).

**Proč ne 18, 5–9 jako cvičení:**

1. **Je to půst a omezování jídla.** Slovo „jídlo“ je v těch odstavcích hlavní téma (nejmenší a nejhorší jídlo, tvrdý chléb, hladové dny Epikúra). Autor zadal: žádný půst, nic, co by se dalo číst jako omezování jídla. Do studentského textu proto nepatří ani přibližně („jez jednoduše“, „den jen s chlebem a vodou“), ani s varováním.
2. **Je to hra na chudobu.** Seneca sám píše, že tak žijí „tisíce otroků a tisíce chudých“ (*multa milia servorum, multa milia pauperum*): cvičení po bohatém přítelovi chce, aby si na chvíli zahrál nouzi. Student, jehož rodina opravdu šetří, by v tom četl výsměch.
3. **Je to spánek, teplo a oblečení** (hrubé lůžko, hrubý plášť): také věci, které se neomezují.
4. **Slovní stopy k zakázání** i bez jídla: „odříkání“, „sebeovládání“, „vydrž“, „silná vůle“, „skromné jídlo“, „stačí málo“, „hlad“. Že lákavé pro studenta s poruchou příjmu potravy je právě „ovládnutí“, vím jako obecnou věc; v tomhle kroku jsem to nedoložil a netvrdím to jako fakt, jen jako důvod opatrnosti.

**Co z toho zůstává použitelné.** Princip z 18, 6: *cvičit předem na něco, čeho se bojím, v době, kdy se nic neděje.* Vojenská metafora (cvičení bez nepřítele) je z Dopisu 18 a obsahuje vodítko „zbytečná práce kvůli nutné“. Otázka *Hoc est quod timebatur?* je sama o sobě bez jídla.

**Návrh pro den 5: „Den bez jednoho pohodlí“** (pracovní název; „skromnost“ v názvu já bych vypustil, přivolává „stačí málo“).

- **Co student udělá.** Ráno vybere jedno pohodlí, které není potřeba a které by nikdo nepoznal, že chybí: ne jídlo, pití, spánek, léky, teplo, oblečení ani nic, co patří k bezpečí. Například: v tramvaji bez sluchátek, pauza bez telefonu, cesta bez zkratky, odpověď na zprávu až večer. A ten den ho vynechá. Večer si v duchu odpoví na Senekovu otázku: Bylo to to, čeho jsem se bál? Nic nepíše. Návrh znění pro T: „Vyber jedno pohodlí, které není nutné a nikdo by si nevšiml, že chybí. Ne jídlo, pití, spánek, léky ani teplo. Dnes se bez něj obejdi. Večer se zeptej: bylo to to, čeho jsem se bál?“
- **Citát pro den:** nový, ověřený, **návrh `seneca-ep-18-6-val`** (voják a val, viz „Návrh dat“). Kolikrát v atlasu: **0×**. Seneca 18, 9 (`seneca-ep-18-9`) **ne**.
- **Čím se liší od hotových karet** (aby den 5 nebyl čtvrtá verze téhož):
  - Epikúros, „Hostina z mála“ (`epikuros-hostina-z-mala`): s chlebem a čajem s kamarády, o jídle; den 5 se jí nedotýká.
  - Diogenés, „Vyhoď pohárek“ (`diogenes-vyhod-poharek`): týden bez věci, kterou mám ze zvyku nebo kvůli druhým; otázka „chybí mi věc, nebo to, co si o mně myslí“. Den 5 je jeden den a ptá se jinak: neptá se na druhé, ptá se na strach ze ztráty.
  - Cesta 34, „Proč teď?“ (`cesta34-proc-ted`): telefon v jednom dni s otázkou „je to nutné?“. Den 5 *nesmí* být jen telefon; telefon je v seznamu příkladů jen jednou z několika možností a student si vybírá.
- **Mez.**
  - **Jídlo, pití, spánek, léky, teplo, oblečení a bezpečí do cvičení nepatří**, a to **výslovně** ve studentském textu jednou větou (viz návrh výše), ne jen v listu pro učitele. Student si totiž „pohodlí“ rád vybere z jídla (vynechat svačinu, dezert).
  - Student, jehož rodina opravdu šetří, nemá „chudobu zkoušet“: cvičení žádnou chudobu nezkouší, věta o chudobě v textu nezazní.
  - Když se při cvičení přistihneš, že vybíráš něco, co souvisí s jídlem nebo s vlastním tělem: přestaň, vyber jiné nebo den vynech. Jak to říct: „Tohle cvičení není o jídle. Když ti napadá jídlo, den přeskoč.“
  - Žádné „vydrž“, „zvládni“, „dokaž“, „dokonče den bez“.
- **Co by nesmělo v týdnu zaznít:** postup „zkus zůstat hladový, abys viděl, co potřebuješ“, „spi na zemi“, „studená sprcha“ (u moderního stoicismu běžné; z recenze Irvinea vím, že „dobrovolné nepohodlí“ doporučuje, jak přesně, jsem nečetl). Ani v listu pro učitele jako příklad.

**Co je doložené a co pozdější.**

| Tvrzení | Typ | Poznámka |
| --- | --- | --- |
| Seneca radí několik dní chudé stravy a hrubého oděvu a vysvětluje to cvičením předem (18, 5–9) | doložený fakt | Latinsky čteno. |
| Epikúros měl dny, kdy jen skrovně tišil hlad | **zpráva Senekova** | Seneca odkazuje na Epikúrův dopis Polyainovi; Epikúrovu dopis jsem nečetl. |
| Stoikové tohle dělali a doporučovali | částečně | Seneca doporučuje; že to dělal sám Seneca, ze 18 neplyne. Epiktétos má podobné (Rukojeť 47 o vodě a cvičení pro sebe, ne pro ostatní; **nečetl jsem, a protože je o pití, nedoporučuju**). |
| Moderní „stoické výzvy“ (půst, studená voda) | pozdější podání | Jen z přehledů. |

**Otázky pro autora ke dni 5** jsou v seznamu níže (č. 2, 3 a 4).

## Den 6: Večerní ohlédnutí (Seneca) — jen převzít a zkrátit

Cvičení je hotové a ověřené: karta „Tři otázky večer“ (`seneca-vecer`) v portrétu Seneky; O hněvu III, 36, 1–3 čteno v latinském textu (celek 6, 8. 10. 2026; v tomhle kroku znovu přes WebFetch). Tři otázky jsou Sextiovy (*quod hodie malum tuum sanasti? cui vitio obstitisti? qua parte melior es?*), zvyk Senekův; Seneca ho popisuje jako ústní (žena zmlkne, on „probírá den“), ne písemný.

**Převzít z karty:**

- tři otázky (`seneca-ira-iii-36-otazky`; v atlasu **1×**, portrét Seneky) a zakončení „Hleď, ať to už neuděláš. Teď ti odpouštím.“ (`seneca-ira-iii-36-odpoustim`, **1×**, portrét Seneky);
- „Odpověz si v duchu, nic nepiš.“
- závěrečný odstavec o tom, že je to soud nad tím, co jsem udělal já, a když se mi večer co večer vrací něco, co mi dělá někdo druhý, tři otázky na to nestačí (to je mez karty a zůstane).

**Zkrátit:**

- Úvod „Každý večer v tomhle týdnu…“ přepsat na „Dnes večer…“. Karta radí týdenní rytmus; týden má jen jeden večer s touhle kartou.
- Poslední větu karty („Na konci týdne si zapiš jednu věc, kterou jsi díky těm večerům udělal jinak“) z dne 6 vyndat: do týdne patří den 7 a ta věta by dnu 7 vzala obsah.
- `seneca-ira-iii-36` („nic před sebou neskrývám, nic nepřecházím“, **1×**) do dne 6 **nebrat**: „nic nepřecházím“ je přísnější než karta a pro studenta s perfekcionismem je to pokyn k seznamu chyb.

**Mez navíc:** pokud večer najde jen to, co udělal špatně, ať skončí u třetí otázky („v čem jsi dnes byl lepší, i malá věc“). Student, který se večer propadá do výčitek, nemá pokračovat. Jak to říct: „Když ti to večer vypíše jen chyby, zastav se u třetí otázky.“

**Citáty pro den:** `seneca-ira-iii-36-otazky` (×1 → v týdnu ×2) a `seneca-ira-iii-36-odpoustim` (×1 → ×2). Plán to dovoluje (max. dvakrát na celek).

## Den 7: Zápis do deníku (Marcus jako píšící sám sobě)

**Pramen cvičení.** Žádné jedno místo; tři věci dohromady:

- *Marcus píše sám sobě v druhé osobě* (V, 1 „měj po ruce“, IX, 30 „dívej se“, „představ si“; řecky čteno). To je doložený fakt a dává smysl „napiš větu a oslov se ‚ty‘“.
- *Epiktétos radí psát denně.* *Rozpravy* I, 1, 25 (řecky čteno): „ταῦτα ἔδει μελετᾶν τοὺς φιλοσοφοῦντας, ταῦτα καθʼ ἡμέραν γράφειν, ἐν τούτοις γυμνάζεσθαι“ (to mají ti, kdo filozofují, procvičovat, to denně zapisovat, v tom se cvičit). Ale **to „to“ jsou výměny s tyranem o vězení a stětí** („svážeš mi nohu, ale rozhodování mi ani Zeus nepřemůže“). Do studentského textu věta **ne** (bez kontextu nedává smysl, s kontextem je o popravě). Učiteli jako doklad, že psaní k cvičení patřilo.
- *Epiktétovy zápisky.* Marcus I, 7: Rusticus mu půjčil Epiktétovy zápisky (podle SEP, Kamtekar; místo samo jsem nečetl).

**Český překlad, který atlas cituje:** v datech žádný citát o psaní. Marcovu větu pro den 7 nevyžaduju: stačí vrátit se k větě dne 1 (`hovory-v-1`).

**Co je doložené a co pozdější.**

| Tvrzení | Typ | Poznámka |
| --- | --- | --- |
| Marcus psal sám sobě | doložený fakt | Hovory, aspoň zčásti z posledních let tažení (SEP). |
| Hovory jsou deník | **nepřesné** | Události svého života popisuje tak, že je nelze poznat (SEP); je to soubor pokynů sobě, ne záznam dne. |
| Seneca si zapisoval večerní ohlédnutí | **nedoloženo** | O hněvu III, 36 mluví o ústním zvyku. |
| Zápisky (*hypomnémata*) jako duchovní cvičení | **výklad Hadotův** | Znám jen z recenze. |
| Deník dnes jako stoická praxe | pozdější podání | Moderní stoicismus (ranní a večerní zápis); jen z přehledů. |

**Co student ten den udělá** (psaní jen tady, pár minut). Napíše **jednu větu sobě**, v druhé osobě, o tom, co si z týdne chce nechat, a poznámku do deníku (`Vyzva`: název, kdy přijata, poznámka). Návrh znění pro T: „Napiš si jednu větu: co si z týdne chceš nechat. Oslov se v ní ‚ty‘, jako Marcus. Nikomu ji neukazuj. Pak si do deníku napiš poznámku: který den ti pomohl a který ne.“

**Překryvy s hotovými kartami:**

- **„Věta pro sebe“** (`marcus-veta-pro-sebe`, portrét Marca): „Sedm dní si každý den napiš jednu větu sám sobě… na konci týdne všech sedm přečti.“ Je to tentýž pokus v sedmidenní podobě. Doporučuju **nezdvojit**: den 7 týdne = jedna věta (ne sedm) a karta zůstane samostatnou variantou; na kartu by T mohl dát odkaz „týden i s denními cvičeními je na /tyden/stoicky/“. Rozhodne autor (otázka 4).
- **Konec karty „Tři otázky večer“** („na konci týdne si zapiš jednu věc, kterou jsi udělal jinak“): v týdnu den 6 tuhle větu nemá (viz výše), den 7 ji dostane jako poznámku do deníku.
- **Poslední věta karty „Pět minut, jedna věc“** („až ta věc přijde, všimni si, jestli tě zaskočila“): volitelný odkaz ve dni 7, nic navíc.

**Mez.**

- Psát jen to, co bys nechal přečíst i sám sobě za rok. Když chceš psát o něčem těžkém, piš to někam, kde to je v bezpečí, a řekni to někomu. Věta ve studentském textu: „Deník je tvůj. Piš si, co chceš, a když je to těžké, řekni to i někomu.“
- Žádné „zhodnoť, jak ses zlepšil“, žádné stupnice, žádné „dokonči týden“.
- Pokud žádný den nepomohl, je to platná odpověď. Poznámka do deníku nemá znít jako vysvědčení.
- **Soukromí poznámek týdne** (kde jsou uložené, kdo je může číst) je otázka pro krok K, ne pro P6 (otázka 6 níž).

## Nejsilnější námitka proti týdnu jako celku

### Námitka v nejsilnější podobě

Týden učí studenta „nedat nic znát“. Stoik je podle slovníku i podle školní představy člověk beze citu, „stoický klid“ je lhostejnost, a týden z dospívajícího dělá někoho, kdo si řekne „je to jen dojem“, „je to malé“ a „není to moje“, a tak odejde od toho, co mu opravdu dělá zle. Navíc má námitka pravdivé jádro: stoikové **opravdu** usilovali o to, aby mudrc byl bez *páthé* (vášní), a k nim počítali i zármutek. Že to „není lhostejnost“, není tedy samo sebou.

### Odpověď z pramenů

| Kdo | Co říká | Kde (čteno) | V atlasu |
| --- | --- | --- | --- |
| **Epiktétos** | „οὐ δεῖ γάρ με εἶναι ἀπαθῆ ὡς ἀνδριάντα, ἀλλὰ τὰς σχέσεις τηροῦντα τὰς φυσικὰς καὶ ἐπιθέτους ὡς εὐσεβῆ, ὡς υἱόν, ὡς ἀδελφόν, ὡς πατέρα, ὡς πολίτην.“ (Nemám být bez citu jako socha, ale zachovávat vztahy přirozené i přijaté: jako zbožný člověk, jako syn, bratr, otec, občan.) Druhá oblast cvičení je tedy povinnost k druhým a ta jde před klidem. | Rozpravy III, 2, 4 | `rozpravy-iii-2-4`, **1×** (cesta 5, krok 7 „Kamenná tvář“); citát zkrácen na první půlku |
| **Stoikové o dvojím „bez citu“** | „Φασὶ δὲ καὶ ἀπαθῆ εἶναι τὸν σοφόν, διὰ τὸ ἀνέμπτωτον εἶναι· εἶναι δὲ καὶ ἄλλον ἀπαθῆ τὸν φαῦλον, ἐν ἴσῳ λεγόμενον τῷ σκληρῷ καὶ ἀτέγκτῳ.“ (Říkají, že mudrc je bez vášní, protože nepadá; ale je i jiný „bez vášní“, ten špatný, označovaný jako tvrdý a nepoddajný.) | Diogenés Laertios VII, 117 (číslo oddílu podle běžné citace) | není |
| **Stoikové o dobrých citech** | „Εἶναι δὲ καὶ εὐπαθείας φασὶ τρεῖς, χαράν, εὐλάβειαν, βούλησιν“ (jsou prý tři dobré city: radost, opatrnost, chtění); „φοβηθήσεσθαι μὲν γὰρ τὸν σοφὸν οὐδαμῶς, εὐλαβηθήσεσθαι δέ“ (mudrc se nebude bát, ale bude opatrný). | Diogenés Laertios VII, 116 | není |
| **Gellius o Epiktétovi** | Gellius vypráví, že filozof při bouři na lodi zbledl, a na dotaz čte z Epiktétových Rozprav: dojmy (*visa animi*) nejsou věc vůle; „sapientis quoque animum paulisper moveri et contrahi et pallescere necessum est“ (i mudrcova duše se na okamžik musí pohnout, stáhnout a zbledět); rozdíl je v tom, že mudrc svůj souhlas nedá. Zblednout tedy není selhání. | Gellius XIX, 1, 14–21 (výrok z Epiktétovy ztracené 5. knihy Rozprav, jak ho cituje Gellius) | není |
| **Seneca o zármutku** | „Nec sicci sint oculi amisso amico nec fluant“ (ať oči nejsou suché, ale ať ani nepřetékají); „Lacrimandum est, non plorandum“ (je třeba plakat, ne naříkat); Dopis 99: „Inhumanitas est ista, non virtus“ (to je nelidskost, ne ctnost) a „Permittamus illis cadere, non imperemus“ (nechme slzám padat, nepřikazujme jim). | Dopisy 63, 1; 99, 15–16 | `seneca-ep-63-1` **0×**; `seneca-ep-99-15` **1×** (cesta 7, krok 7 „Ti druzí“) |

### Kde je odpověď slabá (musí zaznít poctivě)

- **Pravdivé jádro zůstává.** Pro stoika je zármutek nad ztrátou podle nauky založen na falešném soudu (že ztráta je zlo); Seneca slzy **povoluje jako ústupek nedokonalým** („Nobis autem ignosci potest prolapsis ad lacrimas“, 63, 1: nám, kdo jsme sklouzli k slzám, se dá prominout) a Dopis 99 otce, kterému zemřel syn, přísně kárá. Tři „dobré city“ nemají protějšek zármutku (v textu jsou tři: radost, opatrnost, chtění; čtvrtou vášeň, *lypé*, jsem tu nečetl a nespoléhám na ni).
- „**Dojem**“ a „**shora**“ (dny 2 a 4) se dají číst jako „není to skutečné“. Mez je v těch dnech.
- „**Není moje věc**“ (Rukojeť 1, 5) se dá číst jako lhostejnost k druhým; proti tomu stojí Rozpravy III, 2, 4, ale týden to musí říct.
- **Co tedy týden může a nemůže tvrdit:** může říct, že stoici nechtěli kamennou tvář a že dopřávali slzy; **nemůže** říct, že se u nich smutek přijímá bez výhrad.

### Kam v týdnu

1. **Na první obrazovce týdne jedna věta**, než student začne: „Stoik neznamená člověk beze citu. Epiktétos o tom píše: ‚Nemám být bez citu jako socha.‘“ (`rozpravy-iii-2-4`: v týdnu 1×, v atlasu tím 2×.) Student, který se bojí stát kamenným, ji uslyší dřív než první cvičení.
2. **Ve dni 2** jen odkaz „Víc o tom v cestě 5, krok 7“ (Kamenná tvář), bez opakování citátu.
3. **Spor ani novou kartu nestavět.** Námitka má v atlasu dva domovy (cesta 5, krok 7; cesta 7, krok 7), týden na ně odkáže. Učiteli list: Diogenés Laertios VII, 116–117 a Gellius XIX, 1 jako nové doklady, bez jmen autorů ve studentském textu (pravidlo o nových osobách; u Gellia a Diogena Laertia by byly nové).
4. Návrh nejkratší odpovědi pro T (citát přesný, zbytek parafráze): „Epiktétos píše: ‚Nemám být bez citu jako socha.‘ A Seneca píše příteli, který ztratil přítele, aby měl oči ‚ne suché, ale ať ani nepřetékají‘. O to jim šlo: ne o to nic necítit, ale nenechat se tím odnést.“ (Poslední věta je moje shrnutí, ne citát; T ji má zvážit s ohledem na slabá místa výše.)

## Pořadí dnů

**Navrhuju zachovat pořadí z architektury.** Důvody:

- Den 1 (ráno) a den 6 (večer) rámují den; den 7 (zápis) je přirozený závěr po večeru.
- Den 2 (co je v mé moci) je předpoklad dne 3: třetí otázka dne 3 („co z toho mám v rukou“) je otázka dne 2.
- Den 4 (shora) po dni 3 nese úlevu po „nejhorším“, ale jen u starostí o to, co si pomyslí druzí; mez je výslovná.
- Den 5 je jediný, který vyžaduje chování, ne myšlenku; uprostřed týdne přeruší řadu myšlenkových cvičení (dny 2 až 4) a nechá co zhodnotit na večer a zápis.

**Změny, které navrhuju (v obsahu, ne v pořadí):**

1. Den 1: citát a cvičení z V, 1 (a Rukojeť 4 jako forma), ne II, 1.
2. Den 5: ne Dopis 18, 5–9, ale „Den bez jednoho pohodlí“ s Dopisem 18, 6 (viz den 5).
3. Večerní ohlédnutí zůstane **jen v den 6**. Nápad z plánu větve („ohlédnutí jako večerní rytmus všech dnů“) nedoporučuju: každý den by měl dvě cvičení, překročil by „pár minut“ a odporoval by pravidlu bez povinné série; student, který den vynechá, by večer ztratil. Kdyby autor rytmus chtěl, pak jako nepovinnou jednu otázku „Co se dnes povedlo?“ bez zápisu.

**Zkoumal jsem a zavrhl:** přesunout den 3 (nejhorší) na konec týdne. Důvod pro: student s úzkostí by měl dřív pochopit tón a meze cvičení. Důvod proti: den 3 potřebuje dvojku (co je v mé moci) a mez z dne 2. Mez stejně platí od začátku (pravidla týdne) a den 3 se dá vynechat bez důvodu. Zachovat.

## Nejsilnější příběhy

1. **Bouře na lodi a zbledlý filozof (Gellius XIX, 1).** Gellius vypráví, že na cestě z Kassiopy do Brundisia za bouře všichni naříkali, jen stoický filozof nenaříkal, ale zbledl; po bouři se mu bohatý Řek z Asie vysmál a ve chvíli klidu v Brundisiu pak filozof Gelliovi přečetl z Epiktéta, že i mudrcova duše se na okamžik pohne. — typ: **zpráva jednoho autora o vlastním zážitku** (nedoloženo jinde) — zdroj: Gellius XIX, 1, 14–21 — doporučená formulace pro učitele: „Římský spisovatel Gellius vypráví, že…“ Ve studentském textu **jen s „vypráví se“** a bez jména (nová osoba).
2. **Voják, který staví val v čase míru (Seneca, Dopis 18, 6).** Nejlepší kus Dopisu 18 pro den 5: věta, ne stůl s chlebem. — typ: **Senekova metafora**, ne příběh.
3. **Seneca, Sextius a večerní ohlédnutí (O hněvu III, 36).** Hotové (celek 6), v atlasu 3× v portrétu Seneky.

## Citáty

Počty jsou hledání `id="…"` ve `src/content` a `src/data` mimo `zdroje.yaml` (26. 10. 2026). „V týdnu“ je počet použití, který tenhle list navrhuje.

| Den | Id | Znění v atlasu (zkráceně) | Dílo, místo | V atlasu dnes | V týdnu | Poznámka |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `hovory-v-1` | „Když se ti za svítání nechce vstávat, měj po ruce: vstávám k práci člověka.“ | Hovory V, 1 | 0 | 1 | Jen první věta (viz den 1). |
| 1 | `hovory-ii-1` | „Hned ráno si řekni: potkám člověka všetečného…“ | Hovory II, 1 | 0 | 0 | **Nedoporučuju** do studentského textu (viz den 1). |
| 2 | `rukojet-1-5` | „Jsi dojem, a vůbec ne to, čím se zdáš být.“ | Rukojeť 1, 5 | 0 | 1 | Věta, kterou si student řekne. |
| 2 | `rukojet-1` | rozdělení na to, co je a není v naší moci | Rukojeť 1 | 1 (cesta 5, krok 3) | 0 | Jen odkaz. Obsahuje „tělo“ (viz den 2). |
| 3 | `rukojet-3-hrnek` | „…začni od nejmenších věcí. Máš-li rád hrnek…“ | Rukojeť 3 | 1 (cesta 33, krok 3) | 1 | Nepovinný. |
| 3 | `seneca-ep-24-12` | „Doufej v to nejspravedlivější a připrav se na to nejnespravedlivější.“ | Dopis 24, 12 | 1 (cesta 33, krok 4) | 0 | **Nedoporučuju** (zní jako rozkaz). |
| 4 | `hovory-ix-30` | „Dívej se shora: nespočetná stáda, nespočetné obřady, lodě v bouři i za bezvětří.“ | Hovory IX, 30 | 0 | 1 | Neprodlužovat (konec je „nic nemá váhu“). |
| 5 | `seneca-ep-18-6-val` (**návrh**) | „Voják i uprostřed míru cvičí, bez jediného nepřítele staví val…“ | Dopis 18, 6 | — | 1 | Viz „Návrh dat“. |
| 5 | `seneca-ep-18-9` | Epikúrovy hladové dny | Dopis 18, 9 | 1 (cesta „Kolik je dost?“, krok 4) | **0** | V týdnu **ne**; viz otázka 3. |
| 6 | `seneca-ira-iii-36-otazky` | „Kterou svou chybu jsi dnes vyléčil?…“ | O hněvu III, 36, 1 | 1 (portrét Seneky) | 1 | Plán: dvakrát smí. |
| 6 | `seneca-ira-iii-36-odpoustim` | „Hleď, ať to už neuděláš. Teď ti odpouštím.“ | O hněvu III, 36, 3 | 1 (portrét Seneky) | 1 | |
| 6 | `seneca-ira-iii-36` | „…nic před sebou neskrývám, nic nepřecházím.“ | O hněvu III, 36, 3 | 1 (portrét Seneky) | 0 | „Nic nepřecházím“ do dne 6 nebrat. |
| námitka | `rozpravy-iii-2-4` | „Nemám být bez citu jako socha.“ | Rozpravy III, 2, 4 | 1 (cesta 5, krok 7) | 1 | První obrazovka týdne. |
| námitka | `seneca-ep-63-1` | „…ať oči nejsou suché, ale ať ani nepřetékají.“ | Dopis 63, 1 | 0 | 0 | Do učitelského listu. |
| námitka | `seneca-ep-99-15` | „To není ctnost, to je nelidskost…“ | Dopis 99, 15 | 1 (cesta 7, krok 7) | 0 | Jen odkaz. |
| nepoužito | `hovory-vi-6` | „Nejlepší obrana je nestat se stejným.“ | Hovory VI, 6 | 0 | 0 | V týdnu nechat; student, kterému někdo ubližuje, by ji četl jako „nevracej to“ (viz otázka 9). |

## Návrh dat

Do `src/data/zdroje.yaml`, **nepřidáno** (P6 jen navrhuje; přidá T, až bude den 5 schválen). Formát podle `seneca-ep-18-9`.

```yaml
  - id: seneca-ep-18-6-val
    osoba: seneca
    autor: Seneca
    dilo: Dopisy Luciliovi
    misto: 18, 6
    cesky: "Voják i uprostřed míru cvičí, bez jediného nepřítele staví val a unavuje se zbytečnou prací, aby zvládl tu nutnou."
    original: "Miles in media pace decurrit, sine ullo hoste vallum iacit et supervacuo labore lassatur, ut sufficere necessario possit."
    preklad:
      druh: vlastni
      podle: "latinský text (Perseus); zkráceno o následující větu"
    zdroj: seneca-epistulae
```

Volitelný, jen kdyby T chtěl pro den 1 formu z Rukojeti 4:

```yaml
  - id: rukojet-4-priprava
    osoba: epiktetos
    autor: Epiktétos
    dilo: Rukojeť
    misto: "4"
    cesky: "Než se do něčeho dáš, připomeň si, co je to za věc."
    original: "ὅταν ἅπτεσθαί τινος ἔργου μέλλῃς, ὑπομίμνῃσκε σεαυτόν, ὁποῖόν ἐστι τὸ ἔργον"
    preklad:
      druh: vlastni
      podle: "řecký text (Perseus, H. Schenkl)"
    zdroj: epiktetos-rukojet
```

(Pokračování o koupeli a o slově *prohairesis* nezkracuju ani nepřekládám: studentům by ho T musel vysvětlit; `rukojet-4-priprava` je jen první věta.)

## Obrázky

Žádné. Týden žádný obrázek nepotřebuje (nic jsem nestahoval).

## Rozpory a rozhodnutí

- **Architektura × zadání: den 5.** Architektura: „Seneca (Dopisy 18 a další)“. Zadání: „žádný půst, nic, co by se dalo číst jako omezování jídla“. Dopis 18, 5–9 je o jídle a o hladu. **Rozhodnuto v P6 (nahlášeno autorovi):** den 5 stavím na principu z 18, 6 a necituju 18, 5 ani 18, 9.
- **Architektura × pravidlo o člověku, který ubližuje: den 1.** II, 1 je seznam typů lidí; V, 1 ne. **Rozhodnuto:** V, 1.
- **Plán větve × karty.** „Devatenáct karet Zkus to žít“ (plán) × osmnáct, které jsem napočítal (`ZkusToZitKarta id=…` v `src/content`); autor ať rozhodne, zda je rozdíl důležitý (otázka 8).
- **Perseus × Leopold.** Řecký text Marca jsem četl v Perseu, atlas cituje Leopolda; u tří míst, která jsou v datech (II, 1; V, 1; IX, 30), se `original` shoduje slovo od slova. VII, 48 a XII, 24 v datech nejsou a jen jsem je přečetl. Že se Perseus a Leopold neliší jinde, neříkám.
- **Epiktétos × Gellius.** Gellius cituje 5. knihu Rozprav, která se nedochovala; že je Epiktétova, plyne jen z Gellia.

## Otevřené otázky pro autora

Prázdná odpověď = souhlas s doporučením.

1. **Den 1: V, 1 místo II, 1.** Doporučuju (viz den 1). Odpověď:
2. **Den 5: „Den bez jednoho pohodlí“** s Dopisem 18, 6 a výslovnou větou o jídle, pití, spánku, lécích a teple, místo Dopisu 18, 5–9. Doporučuju. Alternativy: (b) den 5 vynechat a týden má šest dnů; (c) den 5 nahradit jiným cvičením (Rukojeť 33 o mlčení jsem nečetl a je v ní řeč o hostinách). Odpověď:
3. **`seneca-ep-18-9` v cestě „Kolik je dost?“, krok 4** (`src/content/cesty/kolik-je-dost/4-zit-jako-kynik.mdx`): citát o Epikúrových hladových dnech. Zadání týdne zakazuje všechno, co by se dalo číst jako omezování jídla; stejná věta tam už je. Mimo tuhle větev; **nenavrhuju změnu bez tebe, jen aby ses podíval**. Odpověď:
4. **Název dne 5:** „Jeden den skromnosti“ (architektura) × „Den bez jednoho pohodlí“. „Skromnost“ přivolává „stačí málo“. Doporučuju nový název. Odpověď:
5. **Den 7 × „Věta pro sebe“** (`marcus-veta-pro-sebe`) **a konec „Tří otázek večer“:** nezdvojit (viz den 7). Doporučuju den 7 = jedna věta a karta zůstane. Odpověď:
6. **Soukromí poznámek týdne** (uložení, sdílení se souborem, co vidí učitel v režimu třídy): otázka pro krok K, ne pro P6; píšu ji sem, aby se neztratila. Odpověď: vyřízeno 26. 10. 2026 (autor přenechal rozhodnutí): poznámky jen v deníku v prohlížeči (`src/lib/denik.ts`: localStorage, nic se neodesílá, export do souboru), učitel je nevidí, promítání do deníku nic nezapíše; týden přidá jen značku hotových dnů, bez dat a sérií.
7. **Námitka v týdnu:** jedna věta na první obrazovce + odkaz ve dni 2; nový Spor nestavět. Doporučuju. Odpověď:
8. **„Devatenáct karet“** v plánu × osmnáct, které jsem nalezl: je to překlep, nebo mi karta uniká? Odpověď: vyřízeno 26. 10. 2026: v obsahu je 18 různých karet, plán opraven.
9. **`hovory-vi-6`** („Nejlepší obrana je nestat se stejným“): v týdnu ji nenavrhuju. Chceš ji jako citát k dnu 6, s mezí „na to, co ti někdo dělá, ne“? Odpověď:
10. **Nové osoby ve studentském textu:** Gellius a Diogenés Laertios (jako zdroj, ne postava) se ve studentském textu neobjeví; učitel je dostane v listu. Souhlasíš? Odpověď:

## Co jsem neviděl sám

- **Hadot** (*Philosophy as a Way of Life*, *The Inner Citadel*), **Irvine** (*A Guide to the Good Life*), **Ellis**, **Beck**, **Dickinson (2024)**: jen z recenzí a přehledů (BMCR, SEP); knihy ani články jsem nečetl. Výroky o „pozdějším podání“ nesou tuhle výhradu.
- **Český překlad** Hovorů, Rukojeti a Rozprav jsem neotvíral.
- **Rukojeť 33 a 47**, **Rozpravy III, 24, 103**, **Marcus I, 7**, **Diogenés Laertios VII, 110** (čtyři vášně): jen odkazy z jiných zdrojů nebo vůbec; v textu se o ně neopírá nic, co nese váhu.
- **Číslování oddílů** v Dopisech 18, 63, 99, v Gelliovi XIX, 1 a v Diogenovi Laertiovi VII, 116–117 jsem v použitých souborech nemohl zkontrolovat (Perseus je u těchhle děl neznačí). Slovní znění je čteno; čísla odpovídají tomu, co atlas už používá (`seneca-ep-18-9`, 63, 1, 99, 15), a běžné citaci. U Gellia je číslo oddílu pro konkrétní větu („sapientis quoque…“) neověřené, proto uvádím rozsah 14–21.
- **Epiktétova Rukojeť v angličtině (Long)** jsem v tomhle kroku z Perseu nevytáhl; atlas ji cituje v `podle`, shodu s Longem jsem znovu nezkoušel.
- **Epikúrův dopis Polyainovi** (Seneca 18, 9 na něj odkazuje) jsem nečetl.
