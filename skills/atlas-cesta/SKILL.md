---
name: "atlas-cesta"
description: "Psaní cesty, kroku cesty, myšlenkového pokusu, případu pro Návrat nebo stránky velké otázky v Atlasu myšlení z bloků knihovny (Příběh, Volba, Odkryj, Roztřiď, Změň jednu věc, Spor, Kdo žil dřív?)."
---

# Cesta Atlasu myšlení

Cesta je vedený průchod jednou velkou otázkou, v antice 14 až 35 minut (průměrně 27). Student nejdřív sám zkusí odpovědět, pak potká filozofa, narazí na silnou námitku, vyzkouší myšlenku na novém případu a zapíše si vlastní pravidlo. Je hotová, když ji šestnáctiletý člověk projde na telefonu bez nápovědy, dostane zpětnou vazbu k důvodům (ne ke shodě s filozofem) a na konci ví víc, než si myslel.

Tón a pravidla obsahu jsou v `CLAUDE.md` a `docs/styl.md`; platí i pro texty uvnitř bloků. Jak psát, aby se cesta četla jako dobrá kniha a nezněla jako stroj (úvody, citáty, rytmus, strojové obraty), drží skill `atlas-psani`: načti ho před psaním.

## Postup

1. **Přečti** `CLAUDE.md`, `docs/styl.md`, skill `atlas-psani`, `docs/pouceni.md` (co se z revizí hotových celků má dodržovat), v `docs/architektura.md` řádek cesty v Katalogu cest, v `docs/design.md` oddíly **Bloky**, **Cesta** a **Velká otázka** (API a stavba) a ukázkovou cestu 1 (`src/content/cesty/kdy-mam-dobry-duvod-verit*`). Záznam revize hotového celku (`docs/archiv/revize/`) otevři, jen když upravuješ jeho cestu.
2. **Podklady nejdřív.** Každé historické tvrzení, citát a příběh musí být v podkladovém listu (`docs/podklady/`, skill `atlas-overeni`). Co ověřené není, do cesty nepiš; zapiš to do `docs/podklady/k-overeni.md`. Vymyšlené situace uváděj „Představ si…“ a nevkládej do nich historické osoby.
3. **Navrhni si osnovu** (6–8 kroků). Autorovi ji předem neposílej: kde váháš, zvol nejlepší cestu a na konci napiš, nad čím jsi váhal a co by šlo jinak. Každý krok má jeden úkol pro studenta. Osvědčené pořadí:

   | Krok | Úkol studenta | Blok |
   | --- | --- | --- |
   | Scéna | Čte skutečný příběh, ze kterého vyroste otázka | Příběh |
   | Vlastní tah | Rozhodne a připíše proč | Volba s důvodem |
   | Setkání | Vidí, co udělal filozof a proč | Příběh s citátem |
   | Vlastní pokus | Napíše odpověď, pak srovná s modelovými | Odkryj |
   | Třídění | Roztřídí karty do košů podle filozofova rozlišení, smí přidat vlastní | Roztřiď |
   | Náraz | Postaví se mezi dva filozofy, přečte nejsilnější argumenty obou | Spor |
   | Nový případ | Rozhodne v dnešní situaci a mění jednu podmínku | Změň jednu věc |
   | Souvislosti | Kdo kdy žil, s kým se mohl potkat | Kdo žil dřív? |
   | Tvoje pravidlo | Vrátí se ke svému prvnímu tahu a zapíše si vlastní pravidlo; pole je vidět hned a ukládá se samo. Vedle něj stojí, co uložil na začátku | Závěr cesty (`ZaverCesty`) |

   Ne každý blok musí být v každé cestě. Dva stejné bloky za sebou jen výjimečně.

   **Stavba podle látky, ne podle tabulky.** V antice mají všechny cesty stejné pořadí (Volba nebo Roztřiď, filozof, Spor, nový případ, zastánci, pravidlo) a student ho od třetí cesty čte jako formulář. Každé období proto zkusí aspoň jednu cestu jiné stavby a nové bloky (Dialog, Slož argument, Úryvek s otázkou) dřív, než vznikne další cesta stejné stavby. Před osnovou si vypiš bloky hotových cest období (`grep -ohE '<[A-Z][A-Za-z]+ id' src/content/cesty/*/*.mdx`) a názvy jejich kroků: stejný krok 2 ani stejný název kroku podruhé nepoužij (Tři koše v cestách 5 a 6). Kde text popisuje prostor, děj nebo pořadí, které si student musí představit, zvaž k němu kresbu s pohybem (níž v Jak psát bloky).
4. **Napiš soubory** (návod v `docs/design.md` › Cesta a › Bloky):
   - přehled `src/content/cesty/<slug>.mdx` (frontmatter `cislo`, `nazev`, `obdobi`, `otazka`, `vstup`, `filozofove`, `minut`, `zacatek`; text = krátký úvod, dvě až tři věty: o čem cesta je, proč se studenta týká a co si z ní odnese, bez osnovy kroků (`atlas-psani` › Úvody); napiš ho naposledy, spolu se závěrečným odstavcem, a porovnej s úvody ostatních cest téhož období (příkaz v `atlas-psani` › Postup při revizi); `minut` spočítej ze slov, která student opravdu přečte, při 150 za minutu a přidej ovládání, neopisuj ho z minulé cesty),
   - kroky `src/content/cesty/<slug>/<n>-<nazev>.mdx` (frontmatter `cesta`, `krok`, `nazev`, `kdeJsme`), číslované 1…n bez mezer,
   - obsah Volby, Roztřiď, Změň jednu věc a Sporu do `src/content/bloky/<id>.yaml`; v MDX jen `<Volba id="…" />`.
   Text kroku patří před blok: po dokončení nabídne blok další krok a text pod ním student přeskočí.
   Bloky v kroku nabídnou „Kam dál“ na další krok samy; `client:visible` ani odkaz do deníku nepiš.
   - **Závěr:** poslední krok končí mimo čtenářský sloupec řádkem `<ZaverCesty id="<cesta>-moje-pravidlo" otazka="… Napiš svoje pravidlo." />`. Do přehledu cesty zapiš `zacatek: <id bloku>`: blok, ve kterém student poprvé sám odpověděl (obvykle krok 2). Poslední krok pak ukáže jeho odpověď vedle pravidla („Na začátku“ × „Teď“). Kdo začátek přeskočil, panel neuvidí; věta, která na začátek odkazuje, proto musí sedět s panelem i bez něj: „Vrať se ke svému tahu z kroku&nbsp;2“, ne „Níž vidíš svůj tah“.
   - **Závěrečný odstavec** před `ZaverCesty` píšeš naposledy a porovnáš ho se závěry ostatních cest období. Nevyjmenovává, co student v cestě dělal („Ty jsi dnes třídil…, stál mezi…“), a ptá se konkrétně na první tah téhle cesty: „Podívej se na své koše z kroku&nbsp;2. Kterou kartu bys teď dal jinam?“ Obecné „Odpověděl bys teď stejně?“ jen tam, kde by konkrétní otázka mířila na bolest (cesta 8).
   - **Kdo je na tvé straně** (zastánci odpovědí, vlastní krok za novým případem): mezititulky podle bloků a odpovědí, ke kterým zastánci patří („Loď z prvního kroku“, „Senátor“), ať student skočí ke své odpovědi a cizí číst nemusí. Krok s víc než asi 450 slovy dostane mezititulky vždy; slova kroků vypíše `node scripts/slova-cesta.mjs <slug>`.
   - **Návrat:** ke každé cestě napiš jeden případ do `src/content/bloky/<cesta>-navrat.yaml` (`docs/design.md` › Bloky › Návrat; jak ho psát, je níž v Jak psát bloky). Do MDX cesty se nevkládá, nabízí ho deník.
   - **Krok se dvěma bloky** (odhad a čtení pokusu): první blok dostane vlastní Kam dál na kotvu pod sebou, `<Volba id="…" dal={{ href: '#co-vyslo', text: 'Co z pokusu vyšlo' }} />`. Jinak nabídne další krok a student přeskočí text mezi bloky. Další krok nabízí až poslední blok.
5. **Vstupy do cesty:** karta `<CestaKarta slug="…" />` u filozofa cesty a odkaz v jeho Kam dál; u velké otázky odkaz na cestu. Kartu nedávej hned za kapitolu, kterou první kroky cesty převyprávějí; student by tytéž odstavce četl dvakrát za sebou. Na Domů jen jedna doporučená cesta. Číslo cesty (`cislo`) je jen v datech a v přípravě hodiny: student ho nevidí, v textu i v Kam dál je cesta názvem s nadtitulkem „Cesta“. Kam dál přehledu nabídne Další cestu sám podle deníku; cestu, kterou by student po téhle četl jinak, než je myšlená (po cestě o smrti „Co když přijde to nejhorší?“), vyluč polem `nenabizet` v přehledu.
6. **Ověř** `npm test` celé, projdi cestu v prohlížeči na 390 a 1440 px ve světlém i tmavém režimu a jen klávesnicí, snímky si prohlédni. Fotí je `scripts/snimky-cesta.mjs` (kroky s odpověďmi i bez nich) a `scripts/snimky-prvek.mjs` (jeden blok nebo kresba). Projdi ji jednou i bez odkrytí bloků (viz Jak psát). Projdi ji i očima studenta, který s filozofem cesty nesouhlasí. Všechny texty cesty včetně zpětných vazeb v YAML přečti třikrát podle Postupu při psaní ve skillu `atlas-psani` (čtivost, úvody a citáty, stroj). Pak skill `atlas-revize`.
7. **Zapiš** stav do plánu větve (`docs/plany/<větev>.md`), do `docs/rozhodnuti.md` zásadní volby, potřeby ověření do `k-overeni.md`. Commituj česky po ucelených krocích ve vlastní větvi.

## Jak psát

- **Druh pramene řekni jednou větou na začátku scény:** „Platón vypráví…“ (scéna z dialogu), „Platón si ten spor představil…“ (literární konstrukce, třeba spor s mrtvým Prótagorem), „Vypráví se…“ (tradovaný příběh), „Představ si…“ (vymyšlená situace). Doložená událost z dneška (šaty z roku 2015) se vypráví přímo. Dál už bez výhrad.
- **Pointa má přednost před sporem badatelů.** Historická tvrzení (kdo, kdy, kde, co řekl) jen z podkladů. Výklad myšlenky, o kterém se badatelé přou, smí do textu, když slouží pointě a podává se jako výklad, ne jako fakt (Prótagorova odpověď na sebevyvrácení).
- **Shrnutí drží rozdíly z pramene.** Když pramen líčí několik skupin nebo kroků, nezobecňuj je do jedné věty. V Obraně opravdu rozuměli jen řemeslníci; politik si jen myslel, že ví, a básníci nevěděli, co říkají. Citát dej hned k tomu, o kom mluví.
- **Text drží souvislost i bez bloků.** Na co navazuje další odstavec (protipříklad, odpověď filozofa, obrat v rozhovoru), musí stát v hlavním textu, ne jen ve zpětné vazbě nebo ve srovnání v Odkryj. Srovnání v Odkryj vede studenta ke zkoušce jeho vlastní odpovědi; příběh dopředu nevyzrazuje.
- **Citát odpovídá na otázku kroku.** Stojí za větou, která ji položila, má uvozovací větu se situací (komu, kdy, na co odpovídal) a text se po něm vrací k případu. Žádná sbírka citátů za sebou (`atlas-psani` › Citáty).
- **Přímá řeč skutečných osob jen jako citát** ze `zdroje.yaml` přes `<Citat id="…" />`. Ostatní v nepřímé řeči nebo jako výklad; ani otázku filozofa nepiš jako vymyšlenou přímou řeč. Postoj ve Sporu („To, co vidím.“) je zkratka stanoviska, ne citát.
- **Jména a podrobnosti střídmě** (`docs/styl.md`, pravidlo 6). Jménem nazvi jen toho, kdo nese příběh nebo myšlenku; ostatní popiš tím, kým jsou: „Sókratův přítel“, „žena, která šaty viděla na svatbě“, „mladý básník“. Vedlejší postava smí jménem nanejvýš v první větě, kde vstoupí; v popiscích, „Kde jsme“ a scénách bloků už popisem. Vzhled, povaha, místa, částky a data jen tam, kde něco říkají o člověku nebo o myšlence.
- **„Kde jsme“** orientuje studenta, který zná jen dosavadní kroky: místo a chvíli, případně dialog („Platónův dialog Theaitétos. Athény, krátce před Sókratovým soudem“). Neodkazuje na události, o kterých cesta nemluví.
- **Myšlenka má přednost před ozdobou.** Když podklad nabízí další krok argumentu (Prótagorův lékař, Sókratova budoucnost), vezmi ho; když nabízí jen další jméno, kulisu nebo posměšek, vynech ho.
- **Krok neříká dopředu, co řekne další.** Když text slíbí „dozvíš se za chvíli“, srovnání v bloku to nesmí hned vyzradit celé: řekne jen tolik, kolik student potřebuje ke zkoušce své odpovědi, zbytek nese citát v dalším kroku.
- **Spojovací věta není historické tvrzení zadarmo.** „Proti Epiktétovi tu otázku položil už Aristotelés“ tvrdí spor, který nebyl, a otázku, kterou Aristotelés nepoložil. Piš, co kdo opravdu tvrdil („podle něj záleží i na tom, co člověka potká“), a že se nepotkali.
- **Neopakuj, co student v celku už četl.** Cesta musí stát sama, takže smí vyprávět scénu z portrétu; portrét ji pak vypráví kratší a odkáže na krok cesty (`atlas-osobnost`). Píšeš cestu k hotovému portrétu, zkrať v témže celku jeho kapitolu (portrét Sókrata opakoval cestu 1 slovo od slova). Na stránce otázky a v profilu ale ukaž filozofa na jiném příkladu (Sókratés s Lachétem místo Delf). Tentýž citát nanejvýš dvakrát v celém celku. Totéž platí pro doložený detail: Epikúrovy dny skrovného jídla smějí v cestě zaznít dvakrát, ne třikrát, i když pokaždé jinými slovy.
- **Hlas i proti filozofovi cesty.** Cesta o tom, jak žít (peníze, věci, úspěch), nesmí mluvit jen zkouškou svého filozofa. Každá zpětná vazba může být v pořádku, a celek přesto tlačí k jedné odpovědi. Závěrečný krok proto řekne, že souhlasit student nemusí, a pošle ho za myslitelem, který odpovídá jinak (hlas na stránce velké otázky). Srovnání s filozofem v bloku se zeptá i proti němu („A nechal bys to tam i tak?“).
- **Počty z jiných stránek do textu nepiš** („odpovídají tam i tři další“): zastarají s prvním novým hlasem nebo cestou (závěr cesty 4). Napiš, kam jít, a když počet potřebuješ, ověř ho proti sestavené stránce; při přidání hlasu nebo cesty hledej počty v textech, které na stránku odkazují.
- **Pravidlo filozofa není pravidlo atlasu.** „Smíš“, „musíš“ a „stačí ti“ piš s „podle něj“.
- **Student, kterému někdo ubližuje.** Cestu o tom, co má člověk unést, přijmout nebo co nemá v moci, čti jeho očima, hlavně první obrazovku každého kroku. Citát o ráně nebo bití nedávej na začátek kroku: z téže kapitoly vyber větu, která nese myšlenku bez rány (z Rukojeti 20 „Když tě někdo podráždí…“, ne „kdo tě bije“). Otázka kroku ať je stejně široká jako citát („když tě někdo urazí“, ne „když ti někdo ublíží“). Křivdu nenazývej slovem, které z ní dělá studentovu ostudu („trapas“). Hlas, který říká, že křivdu je třeba nazvat a řešit, má stát na téže obrazovce jako věta, která by šla číst jako rada snášet.
- **Poslední slovo před otázkou.** Citát filozofa těsně před hlasováním zní jako odpověď předem. Jeho citáty dej na začátek kroku; před blokem ať stojí věta, která nikomu nestraní.
- **„Asi“ z podkladů se nesmí ztratit.** „Asi tři sta svitků“ není „přes tři sta“ a „asi pětina“ není „pětina“. Platí i pro popis grafu a pro doporučenou formulaci v podkladovém listu: porovnej ji se sloupcem Tvrzení.
- **Zájmeno po dvou osobách.** Když věta před „on“ jmenuje dva lidi, napiš jméno.
- **Sazba.** Nezlomitelnou mezeru za jednopísmenné předložky a spojky nepiš, doplní ji sestavení. Mezi slovo a číslo, které k němu patří („z kroku 6“), napiš `&nbsp;`.

## Jak psát bloky

- **Otázka** je jedna věta ve druhé osobě: „Co uděláš?“, „Utečeš?“, „Změní se tvá odpověď, když…?“ Žádné „Zamysli se nad tím, že…“.
- **Možnosti ve Volbě** (2–4) jsou skutečné tahy, které by šestnáctiletý člověk udělal, ne jedna správná a tři hloupé. Každá má vlastní zpětnou vazbu: co ten tah umí, kde má slabinu a otázku, která posune dál. Nikdy „správně“ ani „špatně“.
- **Volba bez pole „Proč“:** otázka na vlastní selhání nebo bolestnou chvíli („Co ti tehdy chybělo?“) dostane `bezDuvodu: true`. Blok uloží jen zvolenou možnost, text kroku řekne „Nikam ji nepiš“ a žádná zpětná vazba nepochybuje o tom, co student zažil.
- **Tah** (`tah:`) je krátké sloveso: „zeptat se znovu“, „hledat protipříklad“.
- **„Co udělal …“** jen s doloženým faktem. Verze „stejně jako ty“ i „jinou cestou“ nehodnotí studenta. Po volbě „ne“ nesmí oddíl vyznít jako správná odpověď: když by filozofové cesty jednali různě, řekni, co by udělal každý, a domyšlené podej jako výklad („by nejspíš vynechal“). Když oddíl říká jen to, co by lidé nejspíš řekli k vymyšlenému případu, dej mu vlastní nadpis (`coUdelal.nadpis: Co by na to řekli`); „Co udělal Epiktétos“ nad domněnkou je nepravda.
- **Modelové odpovědi v Odkryj** (2–3) jsou různě silné odpovědi, jaké by napsal student; komentář řekne, co odpověď umí a jaký test ještě zkusit. Sebekontrola jsou věty, které si student může zaškrtnout („Můj znak by odhalil…“), ne kvíz.
- **Změň jednu věc** mění vždy jen jednu podmínku. Zpětná vazba `posun` a `stejne` se ptá, co přesně rozhodlo; neopakuje titulek „Tvoje odpověď se posunula“ (ten doplní blok). Možnosti jsou pro všechny podmínky stejné: přečti každou možnost v každé podmínce, jestli v ní pořád dává smysl („i bez pátků“ přestalo platit, když v podmínce pátky zůstaly). `posun` a `stejne` nevidí, kterou možnost student zvolil, jen jestli ji změnil: nesmějí proto usuzovat z jedné z nich („O pověst ti tedy nejde“ neplatí pro toho, kdo čekal, až se zapomene). Ptej se otázkou, která sedí na všechny.
- **Spor:** obě strany dostanou nejsilnější verzi, ideálně skutečný střet z pramene. Postoj je krátká věta v první osobě („To, co vidím.“), argumenty 1–3 odstavce. Kdo má pravdu, blok neříká, a neříká to ani scéna („a potom ho vyvrací“ ne; „Kdo z nich má pravdu, rozhodni sám.“ ano). Námitka útočí na tezi druhého v jeho vlastním znění, i s výhradami („pro toho, kdo ho má“). Když jedna strana má silnou námitku, dej druhé straně odpověď na ni. Zkontroluj, kdo mluví poslední na telefonu (druhá strana stojí pod první): když jeho poslední námitka obrací obraz protivníka („i to je provázek“), musí na ni protivník odpovědět už ve svých argumentech. Postoj strany nesmí být krajnější než její vlastní citát („Potřebovat co nejméně“, ne „Obejít se bez všeho“). Odpověď první strany na námitku, kterou druhá strana řekne až pod ní, uveď tou námitkou („Aristotelés namítá, že…“); jinak na telefonu odpovídá na něco, co student ještě nečetl.
- **Spor se směrem:** když za jednu stranu nemluví člověk, ale směr (kynici proti Epikúrovi), dej straně `oznaceni` malým písmenem a ve scéně řekni, že se ti dva nepotkali. Smyšlené setkání nepiš. Domyšlenou odpověď podej jako výklad („kynik by mohl namítnout“).
- **Roztřiď:** dva až čtyři koše s krátkým názvem slovy studenta a jednou větou, podle čeho do koše věc patří. Názvy košů odpovídají na otázku bloku stejným tvarem („Ze zkušenosti · Od lidí · Z obrazovky“, ne „Viděl jsem sám · Znám jen z obrazovky“) a každá karta má koš, kam ji student může poctivě dát. Karty (3–8) jsou věci ze studentova života, jiné než příklady v profilu; aspoň jedna má v sobě dvě věci, které patří do různých košů. Zpětná vazba ke kartě se ptá dál a žádný koš neoznačí za správný; `kdyz` jen tam, kde poloha karty mění otázku. Filozofovo rozlišení stojí v textu před blokem, jeho zkouška ve srovnání a znovu v textu dalšího kroku. Srovnání s osobou jen z doložených faktů. Kartě, jejíž obecná zpětná vazba vede právě ke koši, kam ji student může dát, napiš pro ten koš `kdyz`; jinak čte otázku, na kterou už odpověděl. Zpětná vazba vlastní karty (`vlastni.zpetna`) musí obstát, i když student napíše něco bolestného („hádka doma“): ptej se, co má v rukou on a co někdo jiný, ne co je „jeho dílo“, a proč kartu dal do koše, ne jak moc si jí je jistý.
- **Studie a graf:** doložená studie se vypráví přímo, čísla jen z podkladů. Graf je vlastní kresba směru (`GrafKrivek`, `docs/design.md` › Komponenty) s textem pod kresbou, který říká totéž slovy; graf ze studie se nekopíruje. Výhrady ke studii (koho měřili, souvislost není příčina, co se vlastně měřilo) patří do zpětné vazby, ne do vyprávění. Shrnutí ale drží i to, co měli účastníci dělat („přemýšlet tak, aby nic necítili“, ne „brát film jinak“), i když se to filozofovi cesty nehodí; právě z toho bývá nejlepší otázka kroku. Úvodní věta říká, co pokus zkoušel, ne co „ukázal“. Výsledek pokusu se dvěma skupinami je rozdíl mezi nimi: „na názorech se to neprojevilo“, ne „názory se nezměnily“.
- **Křivka nejsou data.** Křivku v grafu pojmenuj podle tvaru („Rychlý průběh“), ne podle měřené věci („Jeden účastník“), a text pod grafem řekne, odkud ten tvar je („Dva průběhy, jaké studie popisuje“).
- **Kresba s pohybem:** vlastní kresba, která se hýbe a kterou student ovládá (`docs/design.md` › Komponenty › Kresba s pohybem). Autor ji chce v atlasu častěji (4. 10. 2026). Sáhni po ní, když text popisuje prostor, děj nebo pořadí, které se špatně představuje: kdo kde sedí a kam vidí (jeskyně), jak něco postupuje (oči si zvykají na světlo), jak se věc mění, když se změní jedna podmínka. Hotové jsou `<Jeskyne />` (dva pohledy) a `<JeskyneVen />` (řez s cestou a posuvník); novou stav skillem `atlas-komponenta` na rámu `Kresba.svelte`.
  - *Kam s ní:* za odstavec, který zobrazuje, a před pointu kroku nebo scény (jeskyně stojí před „Podobní nám“). Nejvýš jedna v kroku. Není to blok: nic se neptá, nic neukládá a nenabízí další krok. Kresba, která by prozradila odpověď bloku, stojí pod ním (šaty v cestě 1, dvě půlky v cestě 5): blok k ní vede vlastním Kam dál a pod kresbou je otázka v kurzívě, ne závěr.
  - *Text drží i bez ní.* Kresba nenese nic, co neříká text kroku; kdo ji přeskočí nebo neuvidí, o nic nepřijde. Text pod kresbou říká totéž slovy.
  - *Odkud se student dívá.* Výchozí pohled ho nechává v situaci (mezi vězni), ne nad ní. Pohled shora dostane větu, komu patří, a nenechá studenta nad těmi dole („Tenhle pohled nemá žádný z nich. Ty jsi ho před chvílí taky neměl.“).
  - *Pramen.* Popisy pohledů a stupňů jsou studentský text: věty do 25 slov, jen to, co je v podkladech, a „kdyby“ zůstává „kdyby“. Co je v kresbě naše volba (které věci nosiči nesou, kolik je vězňů), zapiš do `k-overeni.md`.
  - *Ovládání:* přepínač, kde jsou dva pohledy na totéž; posuvník, kde jde o pořadí nebo míru. Samo se nic nestřídá: pohyb je děj uvnitř jednoho pohledu a jde zastavit. Zastavená kresba ukáže totéž co při omezeném pohybu, ne začátek smyčky (`atlas-komponenta`).
- **Zkus to žít v posledním kroku** (`ZkusToZitKarta`) jen tam, kde výzva stojí na radě filozofa cesty (Aristotelovo křivé dřevo v cestě 4). Karta stojí hned za citátem s radou, dovoluje nezkoušet nic, nenapovídá, jak má pokus dopadnout, a nemíří na druhého člověka. Cesta bez takové rady končí jen vlastním pravidlem.
- **Kdo žil dřív?** jen pro dvojice, kde výsledek překvapí nebo souvisí s příběhem (Sókratés a Diogenés žili současně, Platón byl při Sókratově smrti mladý muž).
- **Návrat:** krátký nový případ, který deník nabídne pár dní po dokončení cesty. Student na něm zkouší své závěrečné pravidlo; není to opakování cvičení.
  - *Případ* (`scena`): „Představ si…“, dva krátké odstavce, bez historických osob a bez tvrzení, která by potřebovala pramen. Situace ze života studenta, ve které se musí rozhodnout. Poslední věta ho v ní nechá stát („Máš před sebou sešit a rozhoduješ se, jestli ho zavřít.“).
  - *Musí jít posoudit jakýmkoli pravidlem,* které si student z cesty mohl odnést, i tím, které s filozofem cesty nesouhlasí. Případ nesmí napovídat, co je správně.
  - *Neopakuje* nové případy cesty, karty z Roztřiď ani úvod stránky velké otázky. Změň to, na čem případ stojí: bunda v kroku 3 stála na ceně a teple, telefon v návratu na tom, že ho mají druzí. Vedlejší důvod, který by otázku rozmělnil, z případu odeber (na telefon má student našetřeno, aby nešlo o cenu).
  - *Otázku* „Platí tvoje pravidlo i tady?“ a možnosti Ano / Upravím ho / Nevím píše blok. Ty píšeš `po`: ke každé odpovědi jednu větu do 25 slov, která končí otazníkem a ptá se dál. Po Ano, co pravidlo v tom případu říká udělat. Po Upravím ho, co mu chybělo. Po Nevím, na čem to vázne. Žádná nehodnotí a žádná nečeká změnu názoru: nechat si pravidlo je stejně dobrý výsledek.
  - *Rod:* věty piš v přítomném nebo budoucím čase („Co do něj připíšeš…?“), ať rod neřeší. `nazev` je krátký název případu do deníku („Nový telefon“).
- Věty do 25 slov, odstavce do 4 vět, tykání, české uvozovky, jména podle `lide.yaml`.

## Stránka velké otázky

Stránka `/otazka/<slug>/` (`docs/design.md` › Velká otázka) je rozhovor napříč staletími: úvod scénou, Tvůj první názor, odpovědi myslitelů na tentýž případ, proč to tak viděli (časová osa), cesty k otázce a na konci Změnil se?. Obsah je v `src/content/otazky/<slug>.mdx`.

- **Úvod** je „Představ si…“ ze života studenta, dva až tři krátké odstavce, které končí otázkami. Nepoužívej scénu, kterou už nese cesta k téže otázce nebo profil, ani stejný druh případu jako nový případ cesty (dvě zprávy z chatu v jednom celku): cesta posílá studenta na stránku otázky hned po svém posledním kroku. Otázku případu zapiš do `pripad` („Komu věřit?“).
- **Hlasy** ve frontmatteru: `hlasy: [{ osoba, odpoved, myslenka, citat, zdroje }]`. Pořadí podle narození dopočítá stránka; zkontroluj, kdo stránku otevírá (Diogenés je starší než Aristotelés). Jen myslitelé, kteří spolu opravdu vedou spor a mají ověřenou myšlenku v podkladech; další přibudou s vlastním profilem.
- **Nejdřív odpověď, pak myšlenka.** `odpoved` je jedna až dvě věty, jak by myslitel naložil s úvodním případem, v tykání, ve třetí osobě a bez uvozovek (převod jeho myšlenky, ne citát). Odpovědi mají stejný tvar, aby bylo na první pohled vidět, kde se rozcházejí. Dvě věty jsou strop a hlídá ho test: dvě otázky myslitele spoj do jedné věty.
- **Poznal by se v tom?** Každá odpověď musí říct, co by na případ řekl jen tenhle myslitel. Radikální postoj nesmí znít jako obecná rada („rozhodni rozumem“); Parmenidés řekne „ani babičce, ani učitelce, obojí je jen mínění“. Když má myslitel klíčový obraz (Prótagorův lékař), patří i do odpovědi. Nezmenšuj to, čím se myslitel liší od ostatních: Aristotelés peníze ke štěstí počítá, „jen jako nástroj“ z něj dělá dalšího, kdo je odsouvá.
- **Myšlenka** (`myslenka`) jsou 2–4 věty z podkladů: proč to tak viděl. Nesmí opakovat odpověď ani citát pod ní a musí dát důvod, ne jen tezi podruhé. Může na citát navázat („Sám řekl, co je pravda, jednou větou:“).
- **Citát** jen ze `zdroje.yaml` a jen ten, který patří téže osobě (kontroluje sestavení). `zdroje` = prameny věty.
- Cesty k otázce se na stránce ukážou samy z `otazka:` v přehledu cesty. Na otázku odkazuj adresou `/otazka/<slug>/`.

## Čtivost a lidský hlas

Cesta se má číst jako dobrá kniha, ne jako cvičení: otázka táhne dál, informaci nese scéna, citát přijde jako odpověď a nic nezní jako stroj. Všechno k tomu je ve skillu `atlas-psani` (Co dělá dobrou knihu, Úvody, Citáty, Ať text nezní jako stroj, Postup při psaní); platí pro každý text cesty včetně scén a zpětných vazeb v YAML, titulků, popisků a „Kde jsme“.

V cestě hlídej hlavně dvě věci, které se v ní opakují deset kroků za sebou: aby kroky nezačínaly pořád stejně (vždy „Představ si…“, vždy citát) a aby zpětné vazby nebyly psané podle jedné formy.

## Časté chyby

- Cesta začíná výkladem místo scény. První krok je vždy příběh nebo silný pokus.
- Filozof mluví větou, která není v prameni. Přímá řeč jen jako citát s místem.
- Zpětná vazba chválí shodu s filozofem („Přesně jako Sókratés!“). Hodnotí se důvod, ne shoda.
- Nový případ je úřední školní scénka. Lepší jsou situace, které studenty opravdu zajímají: přátelé, sociální sítě, zprávy ve skupině, rozhodování o budoucnosti.
- V kroku je redakční poznámka, metodický popisek nebo cesta k souboru. Do studentských stránek nepatří nic z toho.
- Krok má dva úkoly naráz. Rozděl ho.
- Ve vymyšlené situaci vystupuje historická osoba, nebo v doložené události přibude detail, který v podkladech není.
- V textu je víc jmen, než příběh potřebuje.
- Mezi „zeptal se“ a „zkusil to znovu“ chybí krok, protože protipříklad zůstal schovaný v bloku.
- Shrnutí pramene je hladší než pramen a tím nepravdivé.
- Spor dá jedné straně poslední slovo a druhé nenechá odpověď.
- Závěrečné pravidlo je schované za tlačítkem nebo se dá ztratit.
- Cesta má hlasy jen pro jednu odpověď a student s opačným názorem v ní nemá zastánce. Nebo mu přitaká jen filozof cesty („to přiznal sám“) a námitka se promění v souhlas s ním: spojenec má být jiný myslitel.
- Spojovací věta před citátem mu dává adresáta, kterého pramen nemá („Aristotelés mu odpověděl“), nebo text filozofa zpřísní, aby nezněl jako omluva, a ztratí rozdíl, kvůli kterému citát v kroku stojí.
- Možnost ve Změň jednu věc v některé podmínce nedává smysl.
- Zpětná vazba se ptá, kam věc patří, a student ji tam právě dal.
- Číslo je v textu silnější než v podkladech („přes“ místo „asi“).
- Krok o tom, co má člověk unést, začíná citátem o ráně a protihlas přijde až o obrazovku níž.
- Zpětná vazba vlastní karty nebo podmínky předpokládá něco, co student nezvolil nebo nenapsal.
- Shrnutí studie vynechá pokyn, který skupina dostala, a krok pak vyznívá jako důkaz.
- Věta by se dala beze změny napsat o jiném filozofovi, nebo zpětná vazba začíná pochvalou („Skvělá volba!“).
- Přehled cesty shrnuje, co bude v krocích („Cesta začíná…, pak…“), místo aby řekl, o čem cesta je a co si student odnese.
- Citáty stojí za sebou jako sbírka, nebo citát neodpovídá na otázku, kterou krok těsně před ním položil.
- Všechny kroky začínají stejně, nebo všechny zpětné vazby mají stejnou stavbu.
- Případ pro Návrat opakuje nový případ cesty, napovídá odpověď, nebo věta po odpovědi hodnotí místo toho, aby se ptala.
- Věta posledního kroku počítá s panelem „Na začátku“, který student bez počáteční odpovědi neuvidí.
- Kresba s pohybem nese pointu, kterou text nemá, nebo dává studentovi pohled, který mu lichotí.
- Koše v Roztřiď neodpovídají na otázku stejným tvarem, nebo karta nemá koš, kam se dá poctivě dát.
- Krok má dva bloky a první nabízí další krok: student přeskočí text mezi nimi.
- Závěrečný odstavec vyjmenovává, co student dělal, a končí stejnou otázkou jako ostatní cesty období.
- Poslední krok vyjmenuje zastánce všech odpovědí za sebou bez mezititulků; student svou hledá v řadě cizích.
- Cesta má stejnou stavbu a stejný krok 2 jako jiná cesta období.

## Kdy je hotovo

- Každé historické tvrzení má podklad; ve zprávě autorovi stojí, nad čím jsi u osnovy váhal.
- Kroky 1…n fungují na telefonu i notebooku, lišta Další vede až k Dokončit cestu a přehled cesty ukáže prošlé kroky.
- Text dává smysl i tomu, kdo bloky neodkryje.
- Každá zpětná vazba vysvětluje důvod a ptá se dál; nic se neboduje.
- Texty prošly třemi čteními podle skillu `atlas-psani`; přehled cesty říká, o čem cesta je a co si student odnese. Úvod a závěrečný odstavec jsou porovnané s ostatními cestami období; krok se zastánci má mezititulky.
- Na konci se student vrátí ke svému prvnímu tahu a zapíše si vlastní pravidlo do deníku; přehled cesty má `zacatek` a poslední krok `ZaverCesty`.
- Cesta má případ pro Návrat: jiný než její nové případy, s jednou větou po každé ze tří odpovědí.
- Student, který s filozofem cesty nesouhlasí, najde v cestě nebo na jejím konci myslitele, který mu dává za pravdu.
- Student, kterému někdo ubližuje, projde cestou, aniž by četl, že se má smířit.
- Kresba s pohybem, pokud v cestě je, jde zastavit a zastavená hned po načtení ukáže obsah, při omezeném pohybu stojí a text pod ní i text kroku říkají totéž co ona.
- `npm test` prošlo celé, snímky jsou prohlédnuté, revize (`atlas-revize`) bez zásadních nálezů.