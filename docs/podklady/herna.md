# Podklady: herna-v1, formáty herny (P6)

Ověřeno 17. 11. 2026 skillem `atlas-overeni`. Větev `herna-v1`: podklady pro Kdo to řekl?, Doplň citát, Pravý, nebo podvržený?, Kdo by to řekl?, Páry, Tipni si, Seřaď na ose, Výpravy a stránku Argumentační klamy a manipulace. Odpovědi v Co rozhodnout před P6 zůstaly prázdné, platí tedy doporučení (jen doložená připsání, Kdo by to řekl? bez správné odpovědi, výpravy čtyři a čtyři).

## Co jsem četl sám a co ne

**Četl jsem sám** (celý text místa, soubory PerseusDL a First1KGreek na GitHubu, stažené na Mac mimo repozitář):

- Plútarchos, O poslouchání 48C (řecky Bernardakis, anglicky Babbitt, oddíl 18).
- Aristotelés, Athénská ústava 68 (řecky Kenyon).
- Platón: Euthydémos 275d–278a (anglicky, 275e řecky); Gorgiás 471e–472c (řecky i anglicky); Obrana 19c, 23c–e, 34c–35c (řecky i anglicky); Kritón 44c–d a 47a–c (řecky i anglicky); Theaitétos 167c a 171a–b (171a řecky i anglicky); Prótagorás 339b–d (řecky i anglicky); Ústava VIII 563e–564a (řecky i anglicky).
- Aristotelés, Etika Nikomachova I, 8 (1099a31–b2), IV, 9 (1128b10–21), VII, 13 (1153b17–21), řecky i anglicky; O sofistických důkazech 4, 5, 22 a 27 (řecky, vydání bez Bekkerova číslování).
- Cicero, O povaze bohů I, 10 a Tuskulské hovory V, 108 (latinsky); Seneca, Dopisy 9, 13 (latinsky).

**Četl nástroj WebFetch** (stránku jsem sám neviděl): Quote Investigator o nádobě a ohni a o „Be kind“; heslo NASSCAL o dopisech Seneky a Pavla; česká příručka MELIA Dovednosti kritického myšlení.

**Jen výtah z vyhledávače** (doklad, že věta koluje, ne doklad původu): TheCollector, Correio Braziliense, Check Your Fact, Pedagogická orientace (J. Skácelová), WIST Quotations (Hérakleitos, Marcus), OKDIARIO. U každého připsání je původ doložený ze stránky, kterou jsem četl sám nebo kterou četl nástroj; výtah z vyhledávače dokládá jen to, kde věta koluje.

**Nečetl:** Xenofón, Vzpomínky na Sókrata I, 6, 10 (soubor jsem stáhl, místo jsem v anglickém textu nenašel); Cicero, Lucullus (sorités u Chrýsippa, soubor PerseusDL má jen Akademiky I); Santayana, Soliloquies in England (1922); Šedý, Kritické myšlení (Galén 2021).

**Čísla** v oddílech Tipni si, Seřaď na ose a Výpravy počítá `npx vite-node scripts/herna-cisla.ts` z `src/data/` funkcemi atlasu (`vzdalenost`, `kdeVRoce`, `zijiciVRoce`, `rozdilLet`). Výpis citátů a osob dává `node scripts/herna-vypis.mjs citaty|lide|pojmy`.

## Shrnutí

- **Kdo to řekl? a Doplň citát:** patnáct vět ze `zdroje.yaml`. U tří jsem z možností vyřadil člověka, kterému prameny podobnou větu připisují taky (Sókratés u „občana světa“ a u změny mysli, Aristotelés u údivu).
- **Pravý, nebo podvržený?:** osm vět, šest podvržených a dvě pravé. Věta o nádobě a ohni je Plútarchova (48C), jen jinými slovy a o mysli, ne o vzdělání. Hlasovací kotoučky z Athénské ústavy 68 sedí, ale popisují soudy 30. a 20. let 4. století, ne Sókratův proces.
- **Kdo by to řekl?:** osm dnešních vět, každá s podepisujícím a odmítajícím z pramene; nikde nejde o správnou odpověď.
- **Páry:** dvanáct pojmů, u každého situace, která pojem ukazuje, a jedna, ve které jde jen o stejné slovo.
- **Tipni si a Seřaď na ose:** sedm čísel a pět pětic. Nejsilnější: Isokratés se dožil 98 let, Diogenés a Aristotelés zemřeli rok po sobě, Démokritos přežil Sókrata asi o 29 let.
- **Výpravy:** čtyři a čtyři otázky „Kde byl…?“, všechny s místem, které mapa ukáže jako určité.
- **Klamy:** deset klamů, každý s antickým místem, kde ho filozof pojmenoval, odmítl nebo použil, a s dnešním případem ze sociálních sítí.
- **Data:** třináct nových citátů, dvacet jedna nových pramenů a nový druh záznamu `pripsani` (osm vět) se schématem a kontrolami.

## 1. Kdo to řekl? a Doplň citát

Vybírám jen z citátů, které už jsou v `zdroje.yaml`; věta nenese jméno a pozná se podle myšlenky. Možnosti jsou lidé z dat; první je ten správný. „Slovo“ je místo, které Doplň citát vystřihne; záměny mají stejný pád a dávají větě smysl, ale jinou myšlenku.

| # | Citát (id) | Věta | Možnosti | Slovo | Záměny | Poznámka |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `rukojet-5` | Lidi neznepokojují věci, ale jejich soudy o věcech. | Epiktétos, Epikúros, Aristotelés, Diogenés | soudy | řeči, zprávy | „představy“ jako záměna ne: řecké dogmata se tak někdy překládá |
| 2 | `vs-68` | Komu je málo to, co stačí, tomu nestačí nic. | Epikúros, Diogenés, Platón, Aristotelés | stačí (první) | má, chce | Seneca by tu mátl: podobnou Epikúrovu větu cituje (Dopisy 9, 20), proto mezi možnostmi není |
| 3 | `obrana-38a` | Život, který nezkoumáme, nestojí za to, aby ho člověk žil. | Sókratés, Epiktétos, Epikúros, Aristotelés | nezkoumáme | nesdílíme, neriskujeme | po otočení: Platón, Obrana Sókratova 38a |
| 4 | `theaitetos-152a` | Člověk je měřítkem všech věcí: těch, které jsou, že jsou, a těch, které nejsou, že nejsou. | Prótagorás, Sókratés, Hérakleitos, Parmenidés | měřítkem | pánem, středem | Prótagorův zlomek u Platóna (DK 80 B1) |
| 5 | `dl-ix-72-demokritos` | Chladné je podle zvyku, teplé je podle zvyku. Ve skutečnosti jsou atomy a prázdno. | Démokritos, Parmenidés, Platón, Thalés | atomy | ideje, čísla | „ideje“ je Platónova odpověď na tutéž otázku |
| 6 | `herakleitos-b12` | Na ty, kdo vstupují do týchž řek, tečou jiné a zase jiné vody. | Hérakleitos, Parmenidés, Thalés, Démokritos | týchž | různých, hlubokých | „různých“ obrátí myšlenku: řeka zůstává, voda se mění |
| 7 | `parmenides-b8-ted` | Nebylo a nebude, protože je teď, celé najednou, jedno, souvislé. | Parmenidés, Hérakleitos, Démokritos | teď | všude, navždy | „navždy“ je výklad, o který se badatelé přou; zpětná vazba: Parmenidés neříká „byl a bude“, říká „je teď“ |
| 8 | `metafyzika-980a` | Všichni lidé od přirozenosti touží vědět. Je to vidět na tom, jak rádi máme smysly. | Aristotelés, Platón, Epikúros, Sókratés | vědět | vládnout, milovat | Platóna od Aristotela odliší smysly |
| 9 | `politika-1253a` | Člověk je od přírody tvor obce. | Aristotelés, Diogenés, Epikúros, Prótagorás | obce | světa, zvyku | „světa“ je Diogenova odpověď (#10) |
| 10 | `dl-vi-63` | Jsem občan světa. | Diogenés, Aristotelés, Epikúros | světa | Athén, Říma | Sókratés mezi možnostmi není: Cicero mu tutéž odpověď připisuje („mundanum“, Tuskulské hovory V, 108, čteno) |
| 11 | `hovory-viii-59` | Lidé jsou tu jeden pro druhého. Tak je pouč, nebo je snášej. | Marcus Aurelius, Epikúros, Diogenés, Aristotelés | snášej | opusť, potrestej | |
| 12 | `seneca-ep-28-1` | Musíš změnit mysl, ne oblohu. | Seneca, Epikúros, Aristotelés, Diogenés | mysl | přátele, cíl | Sókratés mezi možnostmi není: Seneca v témž dopise (28, 2) podobnou odpověď vypráví o něm |
| 13 | `brevitate-1-3` | Nemáme málo času, jen jsme ho hodně promarnili. | Seneca, Epikúros, Aristotelés | promarnili | prospali, spočítali | „rozdali“ ne: i to Seneca v témž spisu tvrdí |
| 14 | `dl-vi-104` | Bohům je vlastní nic nepotřebovat. Těm, kdo se bohům podobají, potřebovat málo. | Diogenés, Epikúros, Platón, Aristotelés | málo | všechno, jen sebe | Sókratés mezi možnostmi není (podobná věta u Xenofónta, k ověření) |
| 15 | `theaitetos-155d` | Údiv je pro filozofa příznačný. Filozofie totiž nemá jiný počátek než tenhle. | Sókratés, Epikúros, Diogenés, Démokritos | Údiv | Pochybnost, Strach | Aristotelés a Platón mezi možnostmi nejsou: Aristotelés říká totéž (Metafyzika I, 2, 982b12) a Platón je autor dialogu |

**Doporučená formulace po otočení** (ostrov ji skládá z dat): „Sókratés v Platónově dialogu Theaitétos (155d)“ u citátů, kde mluví postava; jinak autor, dílo, místo. U „zkus to jinak“ jedna věta, kam se podívat, např. u #5: „Atomy a prázdno: tak odpovídal ten, kdo věřil, že svět je složený z nedělitelných kousků.“

**Vypadlo:** věty o smrti (`kd-2`, `seneca-ep-24-20` a další): do hry s otáčením karet se nehodí (pouceni, Student, kterého se téma bolestně týká). Věty se jménem uvnitř (`hovory-iv-41`, `herakleitos-b40`). Dlouhé věty nad 110 znaků.

## 2. Pravý, nebo podvržený?

Do atlasu jde jen věta s doloženým připsáním (kde koluje) i původem. Všech osm je v `zdroje.yaml` jako nový druh záznamu `pripsani` (Návrh dat níž).

| # | Věta, jak koluje | Komu se připisuje | Razítko | Odkud je doopravdy | Doklad, že koluje |
| --- | --- | --- | --- | --- | --- |
| 1 | Vím, že nic nevím. | Sókratés | neřekl to | Přepis Obrany 21d: „nevím, ale ani si nemyslím, že vím“ (`obrana-21d`) | TheCollector (výtah) |
| 2 | Vzdělání není plnění nádoby, ale zapalování ohně. | Sókratés (také W. B. Yeats) | neřekl to | Plútarchos, O poslouchání 48C, jinými slovy a o mysli (`plutarchos-o-poslouchani-48c`); podoba se slovy vzdělání a vědro až 1968 | Quote Investigator |
| 3 | Jsme to, co opakovaně děláme. Dokonalost tedy není čin, ale zvyk. | Aristotelés | neřekl to | Will Durant, The Story of Philosophy (1926), shrnutí Etiky Nikomachovy; skutečné znění `etika-1103a` | Correio Braziliense 2026 (výtah); Wikiquote |
| 4 | Buď laskavý, každý, koho potkáš, svádí těžký boj. | Platón (také Filón Alexandrijský) | neřekl to | Ian Maclaren (John Watson), vánoční poselství, nejstarší doklad 6. 1. 1898: „Be pitiful, for every man is fighting a hard battle“ | Quote Investigator; Check Your Fact (výtah) |
| 5 | Neučíme se pro školu, ale pro život. | Seneca | neřekl to | Seneca napsal opak jako výtku (Dopisy 106, 12; `seneca-ep-106-12`) | Pedagogická orientace (výtah) |
| 6 | Do téže řeky nevstoupíš dvakrát, protože už to není táž řeka a ty už nejsi týž člověk. | Hérakleitos | neřekl to | První půlka až u Platóna (Kratylos 402a) a Plútarcha (O delfském E 392b, DK B91); dodatek o člověku v antických svědectvích není, původ neznámý | WIST (výtah) |
| 7 | Nejlepší pomsta je nebýt jako on. | Marcus Aurelius | řekl to | Hovory k sobě VI, 6 (`hovory-vi-6`); sloveso ἀμύνεσθαι je bránit se i oplácet | WIST (výtah) |
| 8 | Víc věcí nás straší, než nás tíží. | Seneca | řekl to | Dopisy Luciliovi 13, 4 (`seneca-ep-13-4`) | OKDIARIO 2026 (výtah) |

**Doporučené zpětné vazby** (jedna věta o původu a jedna, jak si příště citát ověřit sám; podle `atlas-psani` je ještě projde T):

1. „Sókratés u Platóna říká víc: neví, ale ani si nemyslí, že ví. Když citát nemá dílo a místo, hledej ho v textu, ze kterého má být.“
2. „Je to Plútarchova věta o posluchači: mysl se má zapálit jako dřevo, ne naplnit jako nádoba. Kdo cituje bez díla, často přidá slova, která v originále nejsou.“
3. „Tuhle větu napsal roku 1926 Will Durant, když Aristotela vykládal. Aristotelés sám píše, že stavitelem se člověk stává stavěním.“
4. „Poprvé ji roku 1898 napsal skotský kazatel Ian Maclaren, a místo laskavý stálo soucitný. Hledej nejstarší doklad věty, ne nejhezčí obrázek s ní.“
5. „Seneca napsal opak a myslel to jako výčitku: učíme se pro školu, ne pro život. Citát vytržený z dopisu může říkat obráceně, než autor chtěl.“
6. „Hérakleitovi se připisuje jen první půlka, a i tu známe až od Platóna. Konec o člověku k větě přibyl později.“
7. „Stojí to v Hovorech k sobě VI, 6. Řecké slovo znamená bránit se i oplácet, proto ho jeden překládá jako obranu a druhý jako pomstu.“
8. „Stojí to v Senekově 13. dopise Luciliovi. Pokračuje: častěji trpíme představou než skutečností.“

**Záloha** (nejsou v datech): „Jen mrtví viděli konec války“ (Platón) je od George Santayany, Soliloquies in England (1922); doloženo jen výtahy (Check Your Fact, Wikipedie jako rozcestník), knihu jsem neotevřel. „Člověk je měřítkem všech věcí“ (Prótagorás) je pravá věta (`theaitetos-152a`), kdyby bylo potřeba třetí „řekl to“.

### Věta o nádobě a ohni (Plútarchos, O poslouchání 48C)

Ověřeno řecky i anglicky. Plútarchos radí línému posluchači: z toho, co slyšel, má sám dál stavět. Pak: „Mysl totiž nepotřebuje naplnit jako nádoba, ale jako dřevo jen zapálit, aby v ní vznikla chuť objevovat a touha po pravdě.“ (οὐ γὰρ ὡς ἀγγεῖον ὁ νοῦς ἀποπληρώσεως ἀλλʼ ὑπεκκαύματος μόνον ὥσπερ ὕλη δεῖται). Následuje obraz souseda, který si přijde pro oheň a zůstane se u cizího jen ohřívat. Typ: **doložený citát**, ale ne věta, která koluje. Doporučená formulace: „Plútarchos psal o posluchači přednášek: mysl se má zapálit jako dřevo, ne naplnit jako nádoba.“ Slova vzdělání, vědro a jméno Sókrata nebo Yeatse k větě přibyla později (Quote Investigator: nejstarší podoba s „pail“ v knize J. J. Sweeneyho, 1968, tam s Plútarchovým jménem).

### Hlasovací kotoučky (Aristotelés, Athénská ústava 68)

Ověřeno řecky (Kenyon). Hlasovací kotoučky jsou bronzové s trubičkou uprostřed, polovina provrtaná, polovina plná. Každý porotce dostane dva, provrtaný a plný, ukázané oběma stranám. Drží je za trubičku tak, aby nikdo neviděl který, a platný hodí do bronzové amfory, neplatný do dřevěné. Hlasatel ohlásí: provrtaný pro toho, kdo mluvil první (žalobce), plný pro toho, kdo mluvil potom (obžalovaný). Typ: **doložený fakt** pro soudy v době spisu. Spis vznikl v Aristotelově škole ve 30. a 20. letech 4. století př. n. l.; že ho psal Aristotelés sám, se pochybuje. Doporučená formulace pro kresbu nebo popisek: „Na athénském soudu hlasovali porotci bronzovými kotoučky: provrtaný pro žalobce, plný pro obžalovaného.“ **Nespojovat se Sókratovým procesem (399 př. n. l.)**: ten byl asi o 70 let dřív a jak se při něm hlasovalo, spis neříká (k ověření). U Sókrata atlas drží jen Obranu 36a: „třicet hlasů“.

## 3. Kdo by to řekl?

Žádná odpověď není správná. Student vybere filozofa a připíše proč; pak uvidí lístek „atlas by vybral…“ s důvodem z pramene a s tím, kdo by větu odmítl. Věty jsou vymyšlené, typické pro chat, reklamu, motivační obrázek nebo radu kamaráda; u odmítajícího je důvod z citátu v datech.

| # | Dnešní věta (odkud) | Podepsal by | Důvod z pramene | Odmítl by | Důvod z pramene |
| --- | --- | --- | --- | --- | --- |
| 1 | „Méně je víc.“ (reklama na minimalistický byt) | Diogenés; Epikúros | `dl-vi-104` potřebovat málo je božské; `vs-68` komu je málo to, co stačí, tomu nestačí nic | Aristotelés | `etika-1099a`: bez prostředků nejde, nebo aspoň těžko, dělat krásné věci; přátelé, bohatství a moc jsou nástroje |
| 2 | „Co nezměníš, to neřeš.“ (rada kamaráda) | Epiktétos | `rukojet-1`: některé věci v naší moci nejsou, tělo, majetek, pověst | Marcus Aurelius | `hovory-ix-5`: křivdí často i ten, kdo něco nedělá; stoik nepovažuje nečinnost za klid |
| 3 | „Všechno je jen úhel pohledu.“ (komentář pod videem) | Prótagorás | `theaitetos-152a`: člověk je měřítkem všech věcí | Sókratés (u Platóna) | `theaitetos-171a`: kdo uznává, že všichni mají pravdu, uznává i pravdu těch, kdo ho mají za omyl |
| 4 | „Nenech si nic líbit. Kdo ti ublíží, ať to schytá.“ (chat) | Aristotelés, jen první půlku | `etika-1126a`: snášet urážky a přehlížet, když urážejí blízké, je otrocké | Sókratés; Marcus Aurelius | `kriton-49c`: neoplácet křivdu křivdou; `hovory-vi-6`: nejlepší obrana je nestat se stejným |
| 5 | „Spát budeš, až umřeš. Teď se maká.“ (motivační obrázek) | Marcus Aurelius, jen „maká“ | `hovory-v-1`: když se ti ráno nechce vstávat, vstávám k práci člověka | Seneca | `brevitate-20-4`: tak moc to těší, umřít zaneprázdněný? |
| 6 | „Na tom, co si o tobě myslí ostatní, nezáleží.“ (influencer) | Antisthenés | `dl-vi-8-chvala`: „Mnoho lidí tě chválí.“ – „A co jsem provedl špatného?“ | Aristotelés | `etika-1128b`: stud, strach ze ztráty dobrého jména, se hodí k mladému věku; mladé, kteří se stydí, chválíme |
| 7 | „Hlavně se nestresuj, všechno je to jen v hlavě.“ (chat) | Epiktétos; Marcus Aurelius | `rukojet-5`: lidi neznepokojují věci, ale soudy o nich; `hovory-viii-47`: soud můžeš smazat hned | Aristotelés | `etika-1153b`: kdo tvrdí, že dobrý člověk je šťastný, i když ho lámou kolem a stihne ho velké neštěstí, mluví naprázdno |
| 8 | „Když to sdílí všichni, bude to pravda.“ (sociální síť) | Kritón | `kriton-44d`: je nutné dbát i na mínění většiny | Sókratés | `kriton-47b`: bát se má hany a vítat chválu toho jednoho, kdo tomu rozumí, ne většiny |

**Pozor při psaní (T):** u #4 a #5 podepisuje filozof jen půlku věty; lístek to musí říct („Aristotelés by podepsal první půlku…“), jinak tvrdí víc než pramen. U #8 Kritón ve skutečnosti nemluví o pravdě, ale o pověsti a nebezpečí od většiny; formulace: „Kritón radil dbát na to, co si myslí většina: umí ublížit tomu, koho pomluví.“ U #7 je obraz lámání kolem drsný: v lístku stačí „ani v mučení a velkém neštěstí“. Prótagorás u #3 větu podepisuje podle Platónova Theaitéta; jeho vlastní spis se nedochoval.

**Vypadlo:** „Bez kamarádů nejsi nic“ (Seneca, Dopisy 9, 13 by odmítl jen napůl: moudrý si vystačí ke šťastnému životu, ne k životu; ověřeno latinsky, citát do dat nepřidán, kdyby byl potřeba náhradník). Věty o smrti a jídle (pouceni).

## 4. Páry

Ke každému pojmu z kolekce `pojmy` situace ze života šestnáctiletého, která pojem ukazuje, a jedna, ve které jde jen o stejné slovo v běžném smyslu (nebo o jeho opak). Situace se neopakují s polem `priklad` u pojmu. Typ: výklad; zdroj je pole `prameny` u pojmu.

| Pojem | Situace, která pojem ukazuje | Situace, která ho jen připomíná |
| --- | --- | --- |
| ctnost | Kamarádce řekneš pravdu o jejím plánu, i když by se ti hodilo mlčet, a děláš to tak dlouho, až tě to nestojí námahu. | Babička pochválí, že jsi „ctnostná“, protože nechodíš po večerech ven. |
| idea | Učitel nakreslí na tabuli křivý kruh a všichni stejně víte, jaký by měl být. | Kamarád má ideu, že v sobotu pojedete na kole. |
| klid | Před přijímačkami víš, co umíš, a večer usneš bez převalování. | Ležíš celou neděli u seriálu, protože máš klid od školy. |
| lhostejné věci | Ztratíš sluchátka. Je to nepříjemné, ale den si kvůli tomu nezkazíš a dobrým nebo špatným člověkem tě to neudělá. | Spolužákovi je lhostejné, jestli dostane pětku. |
| neovládnutí | Víš, že se máš učit, a stejně si pustíš další díl. | Celý večer hraješ, protože ses tak předem rozhodl, a nelituješ. |
| příčina | Ptáš se, proč most drží: z čeho je, jak je postavený, kdo ho stavěl a k čemu slouží. | „Z jaké příčiny jsi přišel pozdě?“ ptá se třídní a čeká omluvenku. |
| protipříklad | Někdo napíše, že kdo nosí brýle, je šprt, a ty mu pošleš fotku brankáře s brýlemi. | Na všechno, co řekneš, odpovíš „to není pravda“, bez jediného případu. |
| slast | Po tréninku si sedneš, nic tě nebolí a ničeho se nebojíš, a víc nepotřebuješ. | Do rána hraješ, protože tě to baví, a celý další den jsi jako přejetý. |
| soud | Spolužák se na tebe na chodbě nepodívá a ty si všimneš, že „ignoruje mě“ si říkáš ty. | Kamarád dostal pokutu u okresního soudu za jízdu na koloběžce. |
| střed | Na oslavě se nebojíš promluvit, ale ani nepřekřičíš celý stůl. | Ve skupinové práci uděláš přesně polovinu, aby to bylo napůl. |
| v naší moci | Zítra je zápas. Počasí neovlivníš, rozcvičku a spánek ano. | Máš moc nad tím, kdo bude ve třídě předseda, protože jsi oblíbený. |
| štěstí | Ve třiceti se ohlédneš a řekneš, že se ti život zatím vydařil, i když ne každý den byl dobrý. | Vyhraješ v tombole sluchátka a máš štěstí. |

**Pozor:** u neovládnutí situace nesmí tvrdit, že student je líný; zpětná vazba vysvětlí, že Aristotelés to nepovažoval za špatnost. U „štěstí“ obě situace spojuje slovo, ale eudaimonia je celý život, ne náhoda; zpětná vazba to řekne jednou větou. U slasti se situace s jídlem vyhýbám (pouceni, Student, kterého se téma bolestně týká).

## 5. Tipni si a Seřaď na ose

Spočítáno skriptem `scripts/herna-cisla.ts` 17. 11. 2026. Kde jsou roky v datech přibližné, číslo nese „asi“ a pravítko má toleranci aspoň dvacet let (pouceni: mez větší než nejistota roků).

### Tipni si (sedm čísel)

| # | Otázka | Číslo z dat | Jistota | Proč překvapí |
| --- | --- | --- | --- | --- |
| 1 | Kolika let se dožil Isokratés? | 98 let (436–338 př. n. l.) | přesně podle dat | nejdelší život s přesnými roky v datech atlasu |
| 2 | Kolika let se dožil Gorgiás? | asi 108 let | přibližné | nejdelší život v datech; „asi“ nechat |
| 3 | Kolik let dělí smrt Diogena a Aristotela? | 1 rok (323 a 322 př. n. l.) | Diogenův rok je tradovaný (zemřel prý v týž den jako Alexandr) | dva tak rozdílní lidé, a umírají skoro spolu |
| 4 | O kolik let přežil Démokritos Sókrata? | asi 29 let | přibližné | Démokritos je „předsókratik“, a přitom Sókrata přežil |
| 5 | Kolik let žili současně Konfucius a Pýthagorás? | asi 61 let | tradiční roky Konfucia (551–479), k ověření | současníci na dvou koncích světa |
| 6 | Kolik let dělí Thaléta a Hypatii? | asi 915 let, asi dvanáct lidských životů | přibližné | mezi prvním a posledním filozofem antiky v atlasu je skoro tisíc let |
| 7 | Kolik let žili současně Epiktétos a Marcus Aurelius? | asi 14 let | přibližné | císař, který Epiktétovy zápisky dostal od Rustika (Hovory I, 7), se narodil, když starý učitel ještě učil |

Záloha: Aristotelés a Epikúros žili současně 19 let (přesně); Marcus Aurelius zemřel 180 a Plótínos se narodil asi o 24 let později; Diogenés přežil Platóna o 24 let. Mezi Plótínovou smrtí (270) a narozením Hypatie (asi 370) nežije nikdo z lidí atlasu: to je mezera v atlasu, ne v dějinách, do Tipni si ji nedávat.

### Seřaď na ose (pět pětic)

| # | Pětice | Správné pořadí s roky | Nejmenší mezera |
| --- | --- | --- | --- |
| 1 | Kdo se narodil dřív | Thalés (asi 620) → Konfucius (asi 551) → Parmenidés (asi 515) → Sókratés (469) → Aristotelés (384 př. n. l.) | 36 let (přibližné) |
| 2 | Kdo zemřel dřív | Sókratés (399) → Démokritos (asi 370) → Platón (347) → Diogenés (323) → Epikúros (270 př. n. l.) | 23 let (přibližné) |
| 3 | Období 1 | Bitva u Marathónu (490) → Peloponéská válka (431) → Sókratův proces (399) → Platón umírá (347) → Tažení Alexandra Velikého (334 př. n. l.) | 13 let (přesné roky) |
| 4 | Období 2, Athény a Řím | Epikúros zakládá Zahradu (306 př. n. l.) → Poselstvo filozofů v Římě (155 př. n. l.) → Cicero umírá (43 př. n. l.) → Seneca na Korsice (41 n. l.) → Marcus Aurelius se narodil (121 n. l.) | 80 let |
| 5 | Stoikové podle narození | Zénón z Kitia (asi 335 př. n. l.) → Chrýsippos (asi 280 př. n. l.) → Seneca (asi 1 př. n. l.) → Epiktétos (asi 55 n. l.) → Marcus Aurelius (121 n. l.) | 55 let (přibližné) |

Nejsilnější jsou 1 (Konfucius před Parmenidem) a 2 (Démokritos a Diogenés přežijí ty, za jejichž předchůdce nebo učitele je student má). V pětici 3 jsou proces a Platónova smrt z dat osob, ostatní z `udalosti.yaml`.

## 6. Výpravy

Otázky „Kde byl…?“ ve tvaru dnešní výpravy (`PRVNI_VYPRAVA` v `src/lib/mapa-listky.ts`); odpověď je místo, které mapa v tom roce ukáže (`kdeVRoce`, vždy pobyt s časem, tedy „určitě“). Sókratés 424 už je první výprava, proto tu není.

| Období | Otázka | Odpověď z dat | Poznámka |
| --- | --- | --- | --- |
| 1 | Kde učil Pýthagorás roku 520 př. n. l.? | Krotón (působení asi 530–510) | rodiště Samos je jinde: student uvidí, že odešel |
| 1 | Kde působil Anaxagorás roku 440 př. n. l.? | Athény (působení do 436) | Iónec v Athénách, ještě před vyhnanstvím |
| 1 | Kam odešel Aristotelés roku 343 př. n. l.? | Pella (působení 343–341) | učí tu mladého Alexandra |
| 1 | Kde byl Diogenés roku 323 př. n. l.? | Korinth (místo smrti) | podle tradice zemřel v týž den jako Alexandr; to vyprávět „vypráví se“ |
| 2 | Kde učil Epikúros roku 310 př. n. l.? | Mytiléna (od 311) | Zahrada v Athénách přijde až 306 |
| 2 | Kde byl Seneca roku 45 n. l.? | Korsika (vyhnanství 41–49) | |
| 2 | Kde byl Marcus Aurelius roku 173 n. l.? | Carnuntum (vojenské tažení asi 172–174) | tady psal část Hovorů k sobě |
| 2 | Kde studoval Plótínos roku 240 n. l.? | Alexandrie (studium 232–243) | |

Záloha: Epiktétos roku 100 n. l. (Níkopolis), Aristotelés roku 346 př. n. l. (Assos).

**Postřeh k datům (zapsán do `docs/navraty.md`, data jsem neměnil):** Musonius Rufus má vyhnanství na Gyaru od roku 65 bez konce, takže ho mapa ukazuje na ostrově až do smrti (101). Pouceni o místech jen s „do“ platí i obráceně. Do výprav jsem ho proto nedal.

## 7. Argumentační klamy a manipulace

Pro stránku `/argumentacni-klamy/` (K5). České názvy podle příručky MELIA (Dovednosti kritického myšlení, pro střední školy; četl WebFetch); kde se liší, uvádím i běžnější název. Přesné znění očekávaného výstupu RVP G doplní K5 z `docs/plany/kurikulum.md`.

| # | Klam | Antický případ (místo) | Dnešní případ ze sociálních sítí |
| --- | --- | --- | --- |
| 1 | Útok na osobu (osobní útok) | Platón nechává Sókrata říct, že ti, které vyzkoušel, nemají co říct; aby nevypadali bezradně, říkají to, co se po ruce říká proti všem filozofům (Obrana 23d, `obrana-23d`). Aristotelés: taková odpověď neřeší argument, ale člověka (O sofistických důkazech 22). | Pod videem o klimatu: „Co ty víš, je ti patnáct.“ |
| 2 | Slaměný panák | Plútarchos vyčítá Kólótovi, že útočí na Parmenida, který „nezrušil oheň ani vodu“ (Proti Kólótovi 1114b, `plutarchos-kolotes-1114b`); Sókratés odmítá Aristofanova Sókrata, který kráčí po vzduchu (Obrana 19c, `obrana-19c`). | „Chceš omezit telefony ve škole? Takže chceš zakázat internet.“ |
| 3 | Chybné (falešné) dilema | Euthydémos se ptá Kleinia, kdo se učí, moudří, nebo hloupí; Dionýsodóros šeptá, že chlapec bude vyvrácen, ať odpoví jakkoli (Euthydémos 275d–e, `euthydemos-275e`). Sókratés pak ukáže, že trik stojí na dvojím významu slova „učit se“ (277e–278a). | „Buď jsi s námi, nebo proti nám.“ |
| 4 | Šikmá plocha (kluzký svah) | Platón nechává Sókrata vést řetěz od příliš velké svobody k tyranii: příliš velká svoboda se „jak se zdá“ mění v příliš velké otroctví (Ústava VIII, 564a, `ustava-564a`). Platón řetěz podává jako pravděpodobný, ne nutný; klam vzniká, když se z „asi“ stane „určitě“. | „Dneska jedna vynechaná hodina, za rok propadneš a skončíš na ulici.“ |
| 5 | Důraz na autoritu | Cicero: v rozpravě je třeba hledat spíš váhu důvodů než autority; neschvaluje pýthagorejce, kteří na otázku proč odpovídali „on sám to řekl“ (O povaze bohů I, 10, `cicero-nd-i-10`). Cicero to podává jako vyprávění („quos ferunt“). | „Řekl to doktor v podcastu, tak to tak je“ (o věci mimo jeho obor). |
| 6 | Důraz na rozšířený názor (na většinu) | Sókratés Pólovi: vyvracet tím, že přivedeš mnoho svědků, nemá pro pravdu cenu (Gorgiás 471e–472a, `gorgias-471e`); Kritónovi: dbát se má na toho jednoho, kdo tomu rozumí (Kritón 47b, `kriton-47b`). | „Milion lajků, to nemůže být lež.“ |
| 7 | Logický kruh | Aristotelés pojmenoval braní toho, co se má dokázat (τὸ ἐν ἀρχῇ αἰτεῖσθαι), a radí: když se tazatel ptá právě na to, nepřiznávej mu to (O sofistických důkazech 5 a 27, `sofisticke-dukazy-27`). | „Ten influencer nelže. Proč? Protože říká pravdu.“ |
| 8 | Vytržení z kontextu | Prótagorás staví vedle sebe dva verše Símónidovy básně a ptá se, jestli si básník neodporuje (Prótagorás 339c, `protagoras-339c`); Sókratés pak báseň čte celou. Aristotelés: kdo bere, co platí jen nějak, jako by platilo prostě (Ind černý, ale s bílými zuby; O sofistických důkazech 5). | Sestříhané video: z věty „Neříkám, že je to správné, ale…“ zbude jen „je to správné“. |
| 9 | Podvržený citát | Dopisy, které si prý psali Seneca a apoštol Pavel: čtrnáct listů, vzniklých nejspíš ve 4. století; zmiňuje je už Jeroným (O slavných mužích 12) a za pravé platily do renesance (NASSCAL). Druhý případ z atlasu: Sedmý list pod Platónovým jménem, jehož pravost je sporná (`platon-sedmy-list`). | Obrázek se Sókratem a větou „Vzdělání je zapalování ohně“ (Pravý, nebo podvržený?, #2). |
| 10 | Apel na soucit (citové vydírání) | Sókratés odmítá přivést k soudu své tři syny, aby porotce dojal: soudce nesedí proto, aby z práva dělal laskavost, ale aby soudil (Obrana 34c–35c, `obrana-35c`). | „Kdo to nesdílí, tomu je jedno, že pejsek umře.“ |

**Typy:** antická místa jsou doložený text (výklad); u Cicerona a pýthagorejců tradovaný příběh; u Seneky a Pavla doložený fakt o podvrhu ze sekundárního zdroje. Uvození pro dialogy: „Platón nechává Sókrata…“ (pouceni). Dnešní případy jsou vymyšlené, bez skutečných lidí a značek.

**Česká literatura:** příručka MELIA (`melia-kriticke-mysleni`) má české názvy s jednovětými definicemi; J. Šedý, Kritické myšlení (Galén, 2021) je česká monografie, kterou jsem neotevřel. Do Pramenů stránky jen MELIA.

## Citáty

Nové citáty v `zdroje.yaml` (vlastní převody, všechny s originálem):

| Id | Znění v atlasu | Autor, dílo, místo | Překlad podle |
| --- | --- | --- | --- |
| `plutarchos-o-poslouchani-48c` | Mysl totiž nepotřebuje naplnit jako nádoba, ale jako dřevo jen zapálit, aby v ní vznikla chuť objevovat a touha po pravdě. | Plútarchos, O poslouchání 48C | Bernardakis, Babbitt |
| `etika-1128b` | Stud se nehodí ke každému věku, jen k mladému. Mladé, kteří se stydí, chválíme; staršího by za to nikdo nepochválil. | Aristotelés, EN IV, 9, 1128b16–20 | Bywater, Rackham |
| `theaitetos-171a` | Prótagorás uznává, že všichni lidé mají pravdivá mínění. Tím uznává za pravdivé i mínění těch, kdo si myslí, že se mýlí on. | Platón, Theaitétos 171a (mluví Sókratés) | Burnet, Fowler |
| `kriton-44d` | Vidíš přece, Sókrate, že je nutné dbát i na mínění většiny. | Platón, Kritón 44d (mluví Kritón) | Burnet, Fowler |
| `kriton-47b` | Bát se má tedy hany a vítat chválu toho jednoho, a ne většiny. | Platón, Kritón 47b (Sókratés) | Burnet, Fowler |
| `gorgias-471e` | Takové vyvracení nemá pro pravdu žádnou cenu. Křivě proti někomu může svědčit i mnoho lidí, kteří vypadají, že něco znamenají. | Platón, Gorgiás 471e–472a (Sókratés) | Burnet, Lamb |
| `euthydemos-275e` | Říkám ti předem, Sókrate: ať ten chlapec odpoví tak, nebo tak, bude vyvrácen. | Platón, Euthydémos 275e (Dionýsodóros, `bezOsoby`) | Burnet, Lamb |
| `obrana-23d` | Nemají co říct. Aby ale nevypadali bezradně, říkají to, co se po ruce říká proti všem filozofům. | Platón, Obrana 23d | Burnet, Fowler |
| `obrana-35c` | Soudce tu nesedí proto, aby z práva dělal laskavost, ale aby soudil. | Platón, Obrana 35c | Burnet, Fowler |
| `cicero-nd-i-10` | V rozpravě je třeba hledat spíš váhu důvodů než váhu autority. | Cicero, O povaze bohů I, 10 | Plasberg |
| `ustava-564a` | Příliš velká svoboda se, jak se zdá, nemění v nic jiného než v příliš velké otroctví, u člověka i u obce. | Platón, Ústava VIII, 564a | Burnet, Shorey |
| `protagoras-339c` | Všímáš si, že tentýž člověk říká tohle i to, co předtím? | Platón, Prótagorás 339c (mluví Prótagorás) | Burnet, Lamb |
| `sofisticke-dukazy-27` | Když se tazatel ptá právě na to, co má teprve dokázat, a je to vidět, nemá se mu to přiznat, ani kdyby to bylo věrohodné a pravdivé. | Aristotelés, O sofistických důkazech 27 | First1KGreek |

Ostatní věty herny jsou citáty, které už v datech jsou (`etika-1099a`, `etika-1153b`, `etika-1126a`, `etika-1103a`, `obrana-19c`, `obrana-21d`, `kriton-49c`, `plutarchos-kolotes-1114b` a další v tabulkách výš). Ověřil jsem znovu i dvě místa, o která se opírají vyřazené možnosti: Seneca, Dopisy 9, 20 (Epikúrova věta o tom, komu jeho vlastní nestačí) a 28, 2 (Sókratés: „Proč se divíš, že ti cesty nepomáhají, když s sebou všude vláčíš sebe?“).

## Návrh dat

**Nový druh záznamu `pripsani`** v `zdroje.yaml` (schéma `Pripsani` v `src/lib/schema.ts`, kontroly v `src/lib/kontroly.ts`, testy v `tests/data/data.test.ts`):

```yaml
pripsani:
  - id: skola-zivot
    cesky: "Neučíme se pro školu, ale pro život."   # věta, jak koluje
    osoba: seneca                    # komu ji internet připisuje (lide.yaml)
    tez: []                          # komu dalšímu se připisuje (volitelné)
    verdikt: nerekl                  # rekl | nerekl (razítko)
    druh: obraceny                   # pravy | prepsany | obraceny | cizi | neznamy
    skutecne: seneca-ep-106-12       # co ten člověk opravdu řekl (citát v datech)
    koluje: { kde: "…", zdroj: skacelova-vitae }   # doklad, kde věta koluje
    puvod: { citat?, autor?, dilo?, misto?, rok?, popis: "…", zdroj: seneca-epistulae-zivot }
```

Pravidla, která hlídá schéma a kontroly: „řekl to“ platí právě u druhu `pravy`; pravý, přepsaný a obrácený mají `skutecne` a skutečný citát patří témuž člověku; cizí má v původu autora nebo citát; každý odkaz (osoba, citát, pramen) existuje; id se neopakuje mezi citáty a připsáními.

## Rozpory a rozhodnutí

- **Hérakleitova řeka:** dodatek „a ty nejsi týž člověk“ mají weby pod jeho jménem; antická svědectví (Platón, Plútarchos, Eusebios pro B12) ho nemají. Plútarchos má podobnou myšlenku jinde (O delfském E 392d). Razítko „neřekl to“ s vysvětlením, že první půlka je jeho.
- **Marcus VI, 6, obrana, nebo pomsta:** data mají „Nejlepší obrana je nestat se stejným“, internet „pomsta“. Sloveso unese obojí; karta ukáže internetovou podobu a zpětná vazba vysvětlí obě slova. Razítko „řekl to“.
- **Nádoba a oheň:** je to Plútarchos, ale slova i téma jsou jiné (mysl posluchače, ne vzdělání). Na kartě se Sókratovým jménem jasné „neřekl to“; s Plútarchovým jménem by šlo o „přepsaný“ a do hry se nehodí.
- **Konfucius:** roky 551–479 jsou tradiční; atlas je má jako přibližné. Číslo 61 let nechávám s „asi“ a tolerancí 20 let.

## Otevřené otázky pro autora

- Nové osoby nepotřebuji. Ve studentském textu by padla jen jména, která v datech nejsou a nemají mít kartu: Dionýsodóros a Kleinias (Euthydémos), Pólos (Gorgiás), Símónidés (Prótagorás), Kólótés, apoštol Pavel a Jeroným, Will Durant a Ian Maclaren. Doporučuji jmenovat je jen v textu, bez záznamu v datech.
- Kotoučky z D5: kde je plátno použilo? Pokud u Sókratova procesu, doporučuji kresbu přesunout k obecnému popisu athénského soudu (Athénská ústava 68), u Sókrata jen „třicet hlasů“.

## Ověření v kroku O (21. 11. 2026)

| Tvrzení | Typ | Zdroj a místo | Jak v atlasu |
| --- | --- | --- | --- |
| Na „Většina lidí se ti směje“ Diogenés odpověděl, že jim se možná smějí osli, a jako se oni neohlížejí na osly, on se neohlíží na ně | tradovaný výrok | D. L. VI, 58 (Perseus Hopper, řecky 1999.01.0257, angl. Hicks 1999.01.0258); podobná odpověď „ale já se vysmát nedám“ je ve VI, 54 | citát `dl-vi-58-osli`, vlastní převod, v lístku Kdo by to řekl? na otázce 1 |
| Stud je cit vyvolaný špatnými činy, a ty musí být dobrovolné; ctnostný se proto nestydí | výklad | Aristotelés, EN IV, 9, 1128b21–29 (Rackham, Perseus) | `proc` Aristotela: „Stud podle něj patří jen k tomu, co člověk sám udělal špatně“ |
| Stud drží mladé, kteří žijí citem a chybují, na uzdě | výklad | EN IV, 9, 1128b16–18 | „strach o dobré jméno drží mladé od chyb“ |
| „Člověk je měřítkem všech věcí“ je začátek Prótagorovy věty z Platónova Theaitéta 152a (totéž D. L. IX, 51) a koluje zkráceně | doložený fakt; doklad o šíření jen výtahem z vyhledávače | `theaitetos-152a`; anglická Wikipedie, heslo Protagoras (`wikipedia-protagoras-meritko`) | připsání `clovek-meritkem`, druh pravý |
| Dvanáct vět `oCem` | výklad | místo každého citátu v `zdroje.yaml` (Ústava 360b, 433a, 489a; Timaios 51d; Prótagorás 352b, 356c; Obrana 23c–d, 36d; Parmenidés B8; Dopis Menoikeovi 134; EN 1098a; Hovory VI, 54); u dialogů mluvčí podle pole `podle` | jedna věta na rubu, citát neopakuje (test `prozrazuje`) |
