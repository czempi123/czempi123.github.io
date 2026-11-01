# Podklady: Co je náboženství? a judaismus (P6N)

Ověřeno 1. 11. 2026 skillem `atlas-overeni`. Celek: větev `antika-doplnky`, vrstva Náboženství světa (stránky `/nabozenstvi/` a `/nabozenstvi/judaismus/`). Filozofická část větve má vlastní list (`docs/podklady/antika-doplnky.md`); rozlišení náboženství a filozofie navazuje na jeho oddíl a.

## Co jsem četl sám a co ne

**Četl jsem sám** (celý text místa; soubory stažené na Mac do `/tmp`, mimo repozitář):

- SEP „The Concept of Religion“ (Kevin Schilbrack, 2022): úvod, oddíl 1 (Tylor, substantivní a funkční definice, Durkheim, Tillich), oddíl 2.2 (rodová podobnost, pět znaků, Smart, Alston), oddíl 3 (námitka „náboženství není věc“).
- Durkheim, The Elementary Forms of the Religious Life (přel. J. W. Swain, 1915; Project Gutenberg č. 41360): Úvod (o tom, že nepravdivá náboženství nejsou), kniha I, kap. 1 (definice, buddhismus, magie bez církve), kniha II, kap. 7 (bůh klanu je klan sám), Závěr (námitka, že jedno náboženství je úzký základ).
- Otto, Das Heilige, 13. vydání 1925 (archive.org, `dasheiligeuberda00otto`): kap. 2 (slovo *numinózní*), kap. 3 (výzva čtenáři), kap. 4 (*mysterium tremendum*), kap. 6 (*fascinans*).
- Český ekumenický překlad (vydání 2001, obohu.cz, `styl=CEP`, název stránky „Czech Ecumenical Translation (2001)“): Ex 19,4–6; Lv 19,18; Dt 6,4–9; Dt 30,15–19; Ž 29,1–11; Ž 137,1–6; Jr 29,4–9; Mi 6,8.
- Sefaria (přes API, četl nástroj WebFetch, stránky jsem sám neviděl): Babylonský talmud, Šabat 31a (Hillel a pohan na jedné noze), Gitin 56a a 56b (Jochanan ben Zakkaj, Javne), anglicky William Davidson Edition; Mišna, Avot 1, 1–2, 1, 14 a 2, 16, anglicky J. Kulp (Mishnah Yomit), hebrejsky Torat Emet.
- SEP „Philo of Alexandria“ (C. Lévy; oddíl 4.1 Alegorie), „Maimonides“ (K. Seeskin; oddíl 1), „Baruch Spinoza“ (S. Nadler; oddíl 1), „Martin Buber“ (M. Zank; úvod a oddíl 3).
- Britannica (četl nástroj WebFetch): „Mircea Eliade“, „Babylonian Exile“, „Mishna“, „Johanan ben Zakkai“, „Talmud“; USHMM „Introduction to the Holocaust“.
- Pleiades (JSON): 687928 Hierosolyma, 893951 Babylon, 687925 Iamneia.
- The Met Collection API: předměty v oddíle d.

**Nečetl jsem:** Eliadovo Posvátné a profánní (česky ani anglicky; PDF na is.muni.cz nástroje nepustí), české překlady Durkheima (Oikoymenh 2002) a Otta (Vyšehrad 1998) mimo výpisky v kurzu UK, Tylora v originále (jen citace v SEP), Evans-Pritcharda a jiné kritiky Durkheima v originále, data dokončení obou talmudů (Britannica je neuvádí), Josepha Flavia o pádu Jeruzaléma, Arch of Titus na místě ani na fotografii. Co z toho se níže objeví, je označeno jako neověřené.

České citáty z Bible jsou z ČEP doslova. Ostatní česká znění jsou vlastní převody (Durkheim podle Swaina, Otto z němčiny, Mišna a Talmud podle angličtiny a hebrejštiny ze Sefarie).

## Shrnutí: co je nejsilnější a co se změnilo

Nejsilnější příběhy a pokusy:

1. **Pět jevů a čtyři definice** (pokus na začátek Co je náboženství?): bohoslužba, fotbalový fanklub, svatba, horoskop, minuta ticha. Podle toho, kterou definici vezmeš (Tylor, Durkheim, Otto, pět znaků podle SEP), vyjde pokaždé jiná hranice. Student zjistí, že spor o slovo je skutečný spor religionistů, ne chyták.
2. **Otto žádá čtenáře, ať nečte dál** (Das Heilige, kap. 3): kdo si nevzpomene na chvíli silného náboženského pohnutí, ať knihu odloží. Nejlepší vstup k Ottovi i k námitce proti němu.
3. **Durkheim: „Nepravdivá náboženství nejsou.“** (Úvod): věta religionisty, který sám nevěřil, a přesto bere každou tradici vážně. Opora pro tón obou stránek.
4. **Jochanan ben Zakkaj vynesený z obleženého Jeruzaléma** (Gitin 56a–b): učitel se nechá vynést jako mrtvý, vyprosí si od Vespasiána Javne a jeho učence. Chrám padne, učení přežije. Vstupní scéna judaismu.
5. **Hillel a pohan na jedné noze** (Šabat 31a): „Co je ti protivné, nečiň druhému. To je celá Tóra, ostatní je výklad. Jdi a uč se.“
6. **U řek babylónských** (Ž 137,1–4) a **Usilujte o pokoj toho města** (Jr 29,7): dvě odpovědi na exil, pláč a život mezi cizími.

Co mění plán větve:

- **Citát v datech potřebuje osobu.** `Citat.osoba` je v `src/lib/schema.ts` povinné id osoby. Verše Bible, Mišny a Talmudu nemají v datech koho (Hillel, Tarfon, Mojžíš ani prorok tam nejsou a nové osoby nepřibývají). K1 musí schéma rozšířit (návrh v oddíle Návrh dat), jinak T2 nemá kam citáty zapsat.
- **Kolekce `nabozenstvi` nemá místa.** Architektura počítá s místy vzniku a šíření, schéma v `content.config.ts` má jen `nazev`, `poradi`, `obdobi`. Pro mapku na stránce judaismu je třeba pole `mista` (K1).
- **Pokus „Proč hřmí?“ (P6, oddíl a) dostane Žalm 29 v ČEP**: „Hospodinův hlas burácí nad vodami, zahřímal Bůh slávy“ (Ž 29,3). Znění, které P6 uvedl („Hlas Hospodinův nad vodami, Bůh slávy hřímá“), je jiný překlad; obě stránky budou mít ČEP.
- **Eliade jen opatrně.** Jeho knihu jsem nečetl, mám jen Britannicu. Stránka o něm smí říct jednu dvě věty (posvátné se zjevuje, hierofanie, náboženský člověk), bez citátu.

## a) Co je náboženství?

### Slovo a definice

| # | Tvrzení | Typ | Zdroj a místo | Doporučená formulace pro studenty |
| --- | --- | --- | --- | --- |
| 1 | Latinské *religio* znamenalo zhruba svědomitost, oddanost, pocit závazku; vznikalo z tabu, slibů a kleteb, i bez vztahu k bohům. Význam „druh společenských praktik“ (judaismus, křesťanství, islám…) je novější | výklad | SEP „Concept of Religion“, oddíl 1 | „Římané slovem *religio* mysleli spíš svědomitost: pocit, že něco musíš dodržet. Že je to jméno pro judaismus, křesťanství nebo buddhismus, je novější.“ |
| 2 | Shoda na tom, co náboženství je, mezi badateli není; SEP cituje P. Griffithse, že v debatách o pojmu skoro nikdo neví, o čem mluví, a obor nemá sdílené pojetí svého hlavního tématu | doložené (výklad) | SEP, úvod (Griffiths 2000: 30) | „Ani vědci, kteří náboženství zkoumají, se neshodnou, co přesně to je.“ |
| 3 | Tylor (1871) navrhl „minimální definici“: víra v duchovní bytosti | doložené | SEP, oddíl 1 (Tylor 1871 [1970: 8]) | „Edward Tylor řekl: náboženství je víra v duchovní bytosti.“ |
| 4 | Tylor chtěl jednou definicí spojit i kultury, kterými Evropa pohrdala („natřené načerno na misijních mapách“), se náboženstvím svých čtenářů | doložené | SEP, oddíl 1 (Tylor 1871 [1970: 4]) | Do textu jen tehdy, když nese myšlenku (definice jako krok k uznání druhých); jinak vynechat |
| 5 | Definice *substantivní* určují náboženství podle toho, v co se věří (zvláštní druh skutečnosti); *funkční* podle toho, co dělá v životě (Durkheim: spojuje lidi v jedno morální společenství; Tillich: to, na čem člověku nejvíc záleží) | výklad | SEP, oddíl 1 | „Jedni se ptají, v co lidé věří. Druzí, co to s nimi dělá.“ |
| 6 | Funkční definice může za náboženství počítat i nacionalismus, marxismus, kapitalismus nebo fandění; substantivní je vyloučí. Naopak amulet proti duchům je pro Durkheima magie, ne náboženství | výklad | SEP, oddíl 1 | Pro zpětnou vazbu pokusu (fanklub, horoskop) |
| 7 | Kdo definuje náboženství funkčně, najde ho u všech lidí, ale to je „produkt definice, ne objev“ | výklad (námitka) | SEP, oddíl 1 | „Když náboženství definuješ tím, co dělá, najdeš ho všude. To ale nevyplývá z výzkumu, nýbrž z definice.“ |
| 8 | Rodová podobnost (Wittgenstein, Filozofická zkoumání § 68): náboženství nemusí mít jeden společný znak, stačí síť podobností. Příklad SEP: pět znaků (víra v nadempirické bytosti nebo síly, etické normy, obřady, účast přináší užitek, účastníci se vidí jako zvláštní společenství); kdo má všech pět, je typické náboženství, tři jsou hraniční případ, dva „kvazináboženství“ | výklad; pětice je ilustrace autora hesla, ne ustálený seznam | SEP, oddíl 2.2 | Pro pokus jako čtvrté měřítko: „Kolik z pěti znaků má?“ Pětici podávat jako „jeden z návrhů“, ne jako definici |
| 9 | Ninian Smart (1996): sedm rozměrů náboženství (prožitek a cit, nauka a filozofie, vyprávění a mýtus, etika a právo, obřad, společenství a instituce, hmotný rozměr) | výklad | SEP, oddíl 2.2 (Smart 1996) | Podklad pro rozdělení stránky (posvátné, mýtus, rituál, společenství); jméno Smart do textu nemusí |
| 10 | Někteří kritici tvrdí, že pojem „náboženství“ je evropský vynález spojený s kolonialismem a „žádná taková věc“ neexistuje | výklad (námitka) | SEP, oddíl 3 | Jednou větou, nejvýš v oddíle o religionistice |

### Durkheim

Émile Durkheim (1858–1917), Elementární formy náboženského života. Systém totemismu v Austrálii (1912). Česky: Oikoymenh, Praha 2002, 491 s. (ISBN 80-7298-056-4; vydání potvrzuje katalog MU, překladatele jsem neověřil). Četl jsem anglicky (Swain 1915).

| # | Tvrzení | Typ | Zdroj a místo | Doporučená formulace |
| --- | --- | --- | --- | --- |
| 11 | Náboženské jevy vždy předpokládají rozdělení světa na posvátné a profánní; posvátné věci chrání a oddělují zákazy | doložené (Durkheimův výklad) | Elementární formy, kniha I, kap. 1, § 3 | „Posvátné je podle Durkheima to, co lidé oddělí od všedního a chrání zákazy.“ |
| 12 | Definice: náboženství je jednotný systém věr a praktik vztahujících se k posvátným věcem, oddělovaným a zakázaným, které spojují všechny, kdo k nim lnou, v jedno morální společenství zvané církev | doložené | kniha I, kap. 1, § 4 | Citát 1 níže |
| 13 | Buddhismus je náboženství i bez bohů: má posvátné věci, čtyři ušlechtilé pravdy a praxi z nich | doložené | kniha I, kap. 1, § 2 a 3 | „Durkheim počítal mezi náboženství i buddhismus, i když v něm bohové nejsou to hlavní.“ (Durkheim píše „in default of gods“; formulaci nezpřísňovat na „buddhismus nemá bohy“) |
| 14 | Magie církev nemá: mág má klienty, ne společenství; mezi ním a těmi, kdo se ho radí, nejsou trvalá pouta | doložené | kniha I, kap. 1, § 4 | Pro horoskop ve zpětné vazbě |
| 15 | „Bůh klanu … nemůže být nic jiného než klan sám“, zosobněný v totemu | doložené (Durkheimova teze) | kniha II, kap. 7 | „Durkheim tvrdil: když lidé uctívají boha, uctívají vlastně svou společnost.“ Hned s námitkou (16) |
| 16 | Námitky: (a) Durkheim vyvozuje z jediného případu (australský totemismus); sám tu námitku čekal a odpověděl, že dobře provedený pokus platí obecně; (b) věřící namítne, že vysvětlit, co náboženství *dělá*, neznamená vysvětlit, *k čemu* se vztahuje; (c) funkční definice najde náboženství všude (SEP, řádek 7) | (a) doložené u Durkheima; (b) moje formulace běžné námitky, bez autora; (c) SEP | Závěr („too narrow a base“); SEP oddíl 1 | (b) psát bez jména: „Věřící namítne…“ |
| 17 | V Úvodu: nepravdivá náboženství nejsou, všechna jsou svým způsobem pravdivá, odpovídají na podmínky lidské existence; lze je sice řadit, ale ne na pravdivá a nepravdivá | doložené | Úvod, § 1 | Citát 2 níže; pozor, Durkheim tím nemíní, že je pravdivé, co náboženství tvrdí o Bohu (míní pravdivost jako odpověď na skutečnou potřebu); stránka to řekne |

### Otto

Rudolf Otto (1869–1937), Posvátno (Das Heilige, 1917). Česky: Posvátno. Iracionalita v ideji božství a její poměr k racionalitě, Vyšehrad, Praha 1998, 160 s. (ISBN 80-7021-260-8; podle výpisků kurzu UK, překladatele jsem neověřil). Četl jsem německy, 13. vydání (1925). Otto byl evangelický teolog.

| # | Tvrzení | Typ | Zdroj a místo | Doporučená formulace |
| --- | --- | --- | --- | --- |
| 18 | „Svaté“ obvykle znamená mravní dokonalost, ale má v sobě ještě prvek mimo etiku; pro něj Otto razí slovo *numinózní* (z lat. *numen*) | doložené | Das Heilige, kap. 2 | „Otto si pro to musel vymyslet nové slovo: numinózní.“ |
| 19 | Numinózní je *mysterium tremendum et fascinans*: tajemství, které děsí (*tremendum*), a zároveň přitahuje (*fascinans*); ta „kontrastní harmonie“ je podle něj nejpodivnější jev v dějinách náboženství | doložené | kap. 4 (s. 13) a kap. 6 | „Tajemství, které děsí, a přitom tě k sobě táhne.“ |
| 20 | Ten pocit může projít duší „mírným přílivem“ ztišené zbožnosti, nebo vytrysknout náhle, až k extázi; může skončit tichým zachvěním tvora před tím, co je v nevyslovitelném tajemství nad vším tvorstvem | doložené | kap. 4 (s. 12–13) | Parafráze; z citátu jen krátký úsek (citát 3) |
| 21 | Na začátku kap. 3 Otto vyzve čtenáře, ať si vybaví chvíli silného náboženského pohnutí; kdo to nedokáže nebo takové chvíle nemá, ať dál nečte | doložené | kap. 3 (s. 8) | Scéna: „Rudolf Otto na začátku jedné kapitoly čtenáře požádá…“ Citát 4 |
| 22 | *Mysterium* pojmově neříká nic víc než skryté, nepochopené, nevšední; je to jen záporné určení | doložené | kap. 4 (s. 13) | Pro výklad, proč se o posvátném těžko mluví |
| 23 | Námitky: (a) prožitek, ke kterému má přístup jen ten, kdo ho zažil, se nedá zkontrolovat zvenku (sám Otto zve jen ty, kdo ho mají; kap. 3); (b) Otto vychází z křesťanské, hlavně luterské zkušenosti a čte ji do jiných tradic; (c) Durkheimovo pojetí naopak začíná u společenství, ne u pocitu | (a) moje formulace z kap. 3; (b) běžná námitka v literatuře, kterou jsem v originále nečetl (Eliade v předmluvě Posvátného a profánního podle výňatku: Otto jako čtenář Luthera); (c) výklad | — | (a) do stránky; (b) jen jako otázka, bez autora; neověřené tvrzení o Lutherovi nepsat |

### Eliade

Mircea Eliade (1907 Bukurešť – 1986 Chicago). Posvátné a profánní (německy 1957, anglicky 1959); česky přel. Filip Karfík, Česká křesťanská akademie, Praha 1994 (ISBN 80-85795-11-6; tiráž podle výňatku PDF), druhé vydání Oikoymenh 2006 (podle práce na theses.cz, nečteno).

| # | Tvrzení | Typ | Zdroj a místo | Doporučená formulace |
| --- | --- | --- | --- | --- |
| 24 | Eliade chápal člověka jako bytost náboženskou (*homo religiosus*) a mluvil o hierofaniích, zjeveních posvátného ve světě | výklad (Britannica) | Britannica „Mircea Eliade“ | „Eliade si všímal, že posvátné se lidem ukazuje v něčem viditelném: v hoře, stromu, chrámu, svátku. Říkal tomu hierofanie.“ Příklady (hora, strom, svátek) jsou moje, z knihy neověřené; T2 je smí použít jen jako ilustraci, ne jako Eliadovy |
| 25 | Kritika: mnozí badatelé napadli jeho práci jako subjektivní a nevědeckou; kritici tvrdí, že zkreslil dějinná a moderní náboženství | doložené (Britannica) | tamtéž | „Kritici mu vyčítali, že víc vykládal, než zkoumal.“ |
| 26 | V mládí sympatie k rumunskému fašismu (Železná garda), které podle kritiků později zamlčel | doložené (Britannica) | tamtéž | Na stránku nepatří: myšlenku stránky nenese |

### Citáty (a)

| # | Znění v atlasu | Autor, dílo, místo | Překlad | Poznámka |
| --- | --- | --- | --- | --- |
| 1 | „Náboženství je jednotný systém věr a praktik, které se vztahují k věcem posvátným, totiž odděleným a zakázaným. Tyto víry a praktiky spojují všechny, kdo k nim lnou, v jedno morální společenství, kterému se říká církev.“ | Durkheim, Elementární formy náboženského života I, 1, 4 | vlastní převod podle Swaina (1915); rozděleno do dvou vět | nový, `durkheim-definice`; francouzský originál nečten |
| 2 | „Nepravdivá náboženství tedy ve skutečnosti nejsou. Všechna jsou svým způsobem pravdivá: všechna odpovídají, každé jinak, na dané podmínky lidské existence.“ | Durkheim, Elementární formy, Úvod, 1 | vlastní převod podle Swaina | nový, `durkheim-uvod`; viz řádek 17 |
| 3 | „Tajemství, které děsí, a zároveň neodolatelně přitahuje.“ | Otto, Posvátno, kap. 4 a 6 | **ne citát**, parafráze dvou míst | nepoužívat jako citát s uvozovkami; jako citát jen 4 |
| 4 | „Vyzýváme čtenáře, aby si vybavil chvíli silného a co nejvýlučněji náboženského pohnutí. Kdo to nedokáže nebo takové chvíle vůbec nezná, toho prosíme, ať dál nečte.“ | Otto, Posvátno, kap. 3 (13. vyd., s. 8) | vlastní převod z němčiny („Wir fordern auf, sich auf einen Moment starker und möglichst einseitiger religiöser Erregtheit zu besinnen. Wer das nicht kann oder solche Momente überhaupt nicht hat, ist gebeten, nicht weiter zu lesen.“) | nový, `otto-posvatno-3`; *einseitig* = jednostranný, tj. čistě náboženský, bez příměsi jiných citů; Otto hned dodává, že kdo zná jen pocity z puberty, zažívání nebo sociální city, neví, o čem mluví |
| 5 | „Mysterium tremendum“ | Otto, Posvátno, kap. 4 | latinsky | jen jako termín, ne citát |

### Úvodní pokus: Co z toho je náboženství?

Pět jevů, jak je chce zadání. Student nejdřív sám u každého rozhodne (ano, ne, záleží na…) a připíše proč. Pak dostane čtyři měřítka a uvidí, že každé kreslí hranici jinde. Navrhuju blok Roztřiď (tři koše: ano, ne, záleží na…), pak Změň jednu věc (přepínač měřítka), nebo jednodušší Volbu s důvodem ke každé kartě; vybere K1 podle toho, co knihovna unese.

| Jev | Tylor (víra v duchovní bytosti) | Durkheim (posvátné + společenství) | Otto (prožitek numinózního) | Pět znaků (SEP) |
| --- | --- | --- | --- | --- |
| Bohoslužba | ano | ano | zvenku nepoznáš; záleží, co prožívá ten, kdo se modlí | všech pět: typické náboženství |
| Fotbalový fanklub | ne | blízko: posvátné věci (dres, stadion, chorál), obřady, silné společenství; funkční pojetí ho počítá (SEP: fandění jako náboženská identita) | ne, pokud fanoušek nemluví o něčem „zcela jiném“ | obřady, společenství, užitek: tři, hraniční případ |
| Svatba | záleží: v kostele, synagoze nebo mešitě ano, na radnici ne | obřad, který mění postavení dvou lidí ve společenství; s náboženstvím i bez něj | záleží na prožitku | církevní všech pět, civilní dva až tři |
| Horoskop | spíš ne (hvězdy nejsou duchovní bytosti), ale víra v síly, které nejdou ověřit, ano | ne: magie bez církve, čtenář horoskopu nepatří do společenství (Durkheim I, 1, 4) | ne | nadempirické síly, užitek: dva, „kvazináboženství“ |
| Minuta ticha | ne | blízko: společný obřad úcty, posvátné jako to, co se odděluje od všedního | může, ale nemusí | obřad, společenství: dva |

**Co si student odnese:** že slovo „náboženství“ neoznačuje jednu věc s ostrou hranicí, že vědci, kteří ho zkoumají, se o hranici přou z dobrých důvodů, a že každé měřítko něco ukáže a něco přehlédne. Tohle je první očekávaný výstup RVP G (porovnat východiska mýtu, náboženství, filozofie…), řádek 1 v `docs/architektura.md` › Vazba na RVP G.

**Meze pokusu** (zpětná vazba je musí říct sama, na téže obrazovce):

- **Fanklub:** že má rysy podobné náboženství, neříká, že víra je „jen fandění“, ani nic o tom, jestli je pravdivé, k čemu se věřící vztahuje. Věta pro zpětnou vazbu: „Podobnost v tom, *jak* lidé něco dělají, nic neříká o tom, *jestli* je pravda, čemu věří.“
- **Horoskop:** nesmí se mu stránka posmívat; student, který horoskopy čte, je tu stejně vítaný. Durkheimovo „magie“ je religionistický termín, ne nadávka; říct to.
- **Minuta ticha** bývá za oběti neštěstí nebo za zemřelé. Karta řekne jen „minuta ticha“ (třeba na začátku zápasu nebo ve škole), bez konkrétní tragédie; čte ji i student, kterému někdo zemřel (`docs/pouceni.md` › Student, kterého se téma bolestně týká).
- **Svatba:** nepsat, že civilní svatba je „méně“. Karta je dobrá právě tím, že vyjde podle provedení.
- Pokus **neznámkuje**; u každé karty vede zpětná vazba k důvodu, ne k „správnému koši“. Správná odpověď je „záleží na měřítku“, a i to jen jako jedna z poctivých odpovědí.

### Posvátné, mýtus, rituál, společenství (pracovní znění pro T2)

Čtyři části stránky podle architektury. Rozlišení je moje, stojí na Durkheimovi (posvátné, obřad, společenství), Ottovi (prožitek) a Smartovi (rozměry podle SEP). Musí sedět na tabulku z `docs/podklady/antika-doplnky.md`, oddíl a: tam je náboženství „život ve vztahu k posvátnému: obřad, modlitba, společenství, tradice“ a mýtus „jedna jeho součást“. Sedí.

| Část | Co říct | Opora |
| --- | --- | --- |
| **Posvátné** | Co lidé oddělují od všedního, k čemu se chovají jinak (zujmou boty, ztiší se, nesmí to každý). Dva pohledy: Durkheim zvenku (posvátné je to, co společenství oddělí a chrání), Otto zevnitř (prožitek něčeho „zcela jiného“, co děsí i přitahuje). | ř. 11, 18–22 |
| **Mýtus** | Posvátné vyprávění o počátku, o tom, proč je svět takový a jak v něm žít. **Slovo mýtus tu neznamená „výmysl“.** V běžné češtině mýtus = omyl; religionisté tak říkají vyprávění, které nese smysl, bez soudu o pravdivosti. Věřící, který čte „příběh o stvoření je mýtus“, musí z téže věty poznat, že mu nikdo neříká, že je to lež. | výklad; Eliade (Britannica: „primordial, mythic time“) jen jako opora, ne citát |
| **Rituál** | Jednání, které se opakuje v pevném tvaru a něco znamená: modlitba, svátek, obřad přechodu (narození, dospělost, svatba, pohřeb). Durkheim: rity jsou pravidla, jak se chovat v přítomnosti posvátného. | ř. 11 (Durkheim I, 1, 3) |
| **Společenství** | Náboženství se žije s druhými (Durkheim: „církev“ v širokém smyslu, i synagoga nebo sangha). Proto se pozná podle toho, kdo k němu patří, co slaví a co jí. | ř. 12, 14 |

**Religionistika jako věda.** Popisuje a srovnává, nerozhoduje, která tradice je pravdivá. Smí ji dělat věřící i nevěřící. Durkheim (sociolog, z rabínské rodiny, sám nevěřící; **neověřeno**, SEP heslo o Durkheimovi nemá, nepoužít), Otto (teolog), Eliade (historik náboženství): tři různá východiska a každé má svou nejsilnější námitku (ř. 16, 23, 25). Ve studentském textu jen jména a myšlenky, životopisy ne.

### Jak mluvit o víře, aby se necítil dotčený věřící ani nevěřící

Tohle jsou meze pro T2 a pro revizi; ve studentském textu nebudou jako pravidla, ale jako tón.

1. **Popisuj, nesuď.** „Křesťané věří, že…“, „Pro Židy je Tóra…“, ne „Bůh přikázal…“ ani „lidé si vymysleli…“. Obě věty berou postoj, který stránka nebere.
2. **Zevnitř i zvenku, a říct, který pohled to je.** „Pro věřícího je sabat dar. Sociolog v něm vidí den, který drží rodinu a obec pohromadě.“ Ani jeden pohled není ten „skutečný“.
3. **Vysvětlit neznamená odbýt.** Kde stránka říká, co náboženství *dělá* (spojuje, utěšuje, dává řád), řekne i to, že tím neodpovídá na otázku, *jestli* je pravda, k čemu se věřící vztahuje. To je otázka Je Bůh? (otázka 9).
4. **Nevěřící student** nesmí číst, že mu něco chybí (Eliade: *homo religiosus* jako člověk vůbec; Otto: kdo nemá prožitek, ať nečte). Obojí podat jako tvrzení autora s námitkou, ne jako hlas stránky.
5. **Věřící student** nesmí číst, že jeho víra je přežitek, psychologie nebo „jen“ společenství. Slovo „jen“ ve spojení s vírou na stránku nepatří.
6. **Žádné „primitivní“ náboženství.** Durkheim i Tylor to slovo používají; stránka ne. Když jde o Austrálii, „náboženství původních obyvatel Austrálie“.
7. **Žádné pořadí tradic** (vyšší, vyvinutější, rozumnější). Durkheim sám říká, že je lze řadit, ale ne na pravdivé a nepravdivé; stránka neřadí vůbec.
8. **Student, kterého se téma bolestně týká:** student z rodiny, která se rozešla kvůli víře, student, kterému skupina brala svobodu, student, jehož víru spolužáci zesměšňují. Žádný příklad nemá působit jako vtip na něčí účet; sekty patří na vlastní stránku (později), ne do příkladů úvodu.

### Vazba na otázku 9 a cestu 35

Otázka 9 (Je Bůh?) zatím nemá stránku, cesta 35 (Proč lidé věří?, William James) neexistuje. Stránka proto **nic neslibuje a neodkazuje**. Stačí jedna věta, která hranici řekne jako obsah: „Jestli to, k čemu se náboženství vztahuje, opravdu je, religionistika nerozhoduje. To je otázka pro filozofii.“ Až stránka otázky 9 vznikne, dostane věta odkaz (zapsat do Co zůstává na později).

## b) Judaismus

### Vstupní scéna: Jochanan ben Zakkaj a Javne

Babylonský talmud, Gitin 56a–b (anglicky William Davidson Edition, přes Sefaria; četl nástroj WebFetch). Tradovaný příběh: Talmud vzniká staletí po události. Že se po roce 70 učenci shromáždili v Javne (Jamnii) a že tam Jochanan ben Zakkaj založil školu a autoritativní rabínský sbor, říká Britannica („founder of an academy and an authoritative rabbinic body at Jamnia“; „decisive influence on the continuance and development of traditional Judaism“). Útěk v rakvi jako fakt Britannica nepotvrzuje.

Co pramen vypráví (Gitin 56a, konec, a 56b, začátek):

1. Jeruzalém je obležen Římany. Zélóti spálí sklady pšenice a ječmene, aby obyvatele donutili k boji; přijde hlad. (56a)
2. Jochananův synovec Abba Sikara, vůdce zélótů, mu poradí: předstírej nemoc, pak smrt; ať tě vynesou k pohřbu jen tví žáci. Rabi Eliezer a rabi Jehošua ho nesou, každý z jedné strany. Stráže u brány chtějí tělo probodnout nebo do něj strčit; Abba Sikara je odradí. (56a) **Rakev text nezmiňuje**; mluví o tom, že ho nesou k pohřbu.
3. V římském táboře pozdraví Vespasiána jako krále. Vespasián odpoví, že tím si zaslouží dvojí trest, když králem není; v tu chvíli přijde zpráva, že se stal císařem. (56a–b)
4. Vespasián mu dovolí o něco požádat. Jochanan žádá: „Dej mi Javne a jeho mudrce“, ušetři rod rabana Gamliela a dej lékaře pro rabiho Cadoka. Talmud dodává, že prosil o málo, protože se bál, že víc nedostane. (56b)

**Doporučená formulace:** „Vypráví se, že když Římané obléhali Jeruzalém, nechal se rabi Jochanan ben Zakkaj vynést z města jako mrtvý. Jeho žáci ho nesli k pohřbu. Před římským velitelem pak nežádal záchranu města, ale malé město Javne a jeho učence.“ Pak doložené: „Roku 70 Římané Jeruzalém dobyli a chrám zbořili. V Javne se sešli učenci a z učení se stalo to, co dřív držel chrám.“

**Proč tahle scéna:** nese dvě ze čtyř témat (exil a rabínskou tradici) a otázku, kterou si student položí sám: co z víry zbude, když zmizí místo, kde se slavila? Je to příběh o učení, ne o bitvě.

**Meze:** zélóti nejsou „fanatici“ ani obraz pro nikoho dnešního; obléhání a hlad jednou větou, bez obrazu. Nepřirovnávat k dnešním konfliktům.

**Druhá možnost:** Hillel a pohan na jedné noze (Šabat 31a), viz citát 6. Kratší a veselejší, ale nese jen jedno téma; navrhuju ho do oddílu o rabínské tradici.

### Tvrzení

| # | Tvrzení | Typ | Zdroj a místo | Doporučená formulace |
| --- | --- | --- | --- | --- |
| 27 | Tóra (Pět knih Mojžíšových) je jádro hebrejské Bible; Židé jí říkají Tanach (Tóra, Proroci, Spisy) | běžný výklad, v otevřeném zdroji jsem ho neověřoval | — (T2 ověří: Britannica „Torah“, „Tanakh“) | „Hebrejská Bible“, ne „Starý zákon“ (to je křesťanské jméno) |
| 28 | Smlouva: Bůh nabízí Izraeli smlouvu u Sinaje; budou-li ji dodržovat, budou mu „zvláštním vlastnictvím“, „královstvím kněží, pronárodem svatým“ | doložené (text) | Ex 19,5–6 (ČEP) | Citát 8 |
| 29 | Šema: „Slyš, Izraeli, Hospodin je náš Bůh, Hospodin jediný.“ Slova mají být v srdci, vštěpovaná synům, na veřejích domu | doložené (text) | Dt 6,4–9 (ČEP) | Citát 7; že se Šema modlí ráno a večer, je běžný výklad, neověřeno (Mišna, Berachot 1; T2 ověří, nebo vynechá) |
| 30 | Volba: „Předložil jsem ti život i smrt, požehnání i zlořečení; vyvol si tedy život“ | doložené (text) | Dt 30,19 (ČEP) | Citát 9; nese smlouvu jako volbu, vazba na otázku 4 |
| 31 | Babylonské zajetí: deportace 598/597 a 587/586 př. n. l. po dobytí Judska; formálně skončilo 538 př. n. l., když Kýros dobyl Babylónii | doložené | Britannica „Babylonian Exile“ | „Roku 587 př. n. l. dobyl babylonský král Jeruzalém a část lidu odvlekl do Babylónu.“ Zboření Prvního chrámu v hesle jsem nečetl (výtah byl zkrácený): T2 ověří, než napíše „a chrám zbořil“ |
| 32 | Pláč v exilu: „U řek babylónských, tam jsme sedávali s pláčem ve vzpomínkách na Sijón… Jak bychom však mohli zpívat píseň Hospodinovu v té cizí zemi?“ | doložené (text) | Ž 137,1–4 (ČEP) | Citát 10. **Verše 7–9 nikdy** (pomsta Edómu a Babylónu, v. 9 o dětech) |
| 33 | Život v exilu: Jeremjáš píše přesídlencům, ať stavějí domy, sázejí zahrady, žení se a „usilují o pokoj toho města“, kam byli přestěhováni, protože „v jeho pokoji i vy budete mít pokoj“ | doložené (text) | Jr 29,4–7 (ČEP) | Citát 11; vazba na otázku 8 (Jak spolu máme žít?) |
| 34 | Druhý chrám zbořili Římané roku 70 n. l. | doložené | Britannica „Johanan ben Zakkai“ („after the destruction of the Temple (ad 70)“) | Přímo |
| 35 | Mišna: nejstarší autoritativní sbírka ústního práva, sestavená učenci (tanaité) asi za dvě stě let a uzavřená na počátku 3. století n. l. Jehudou ha-Nasim | doložené | Britannica „Mishna“ | „Kolem roku 200 n. l. sepsali učenci ústní výklad Tóry do Mišny.“ („kolem roku 200“ je zaokrouhlení „early in the 3rd century“; lepší „na začátku 3. století“) |
| 36 | Talmud = Mišna + Gemara (výklad Mišny pozdějšími učenci, amoraity, v Palestině a Babylónii); dva talmudy | doložené | Britannica „Mishna“, „Talmud“ | Data dokončení **neověřena** (Britannica je v hesle nemá); ve studentském textu „v dalších staletích“ |
| 37 | Řetěz tradice: „Mojžíš přijal Tóru na Sinaji a předal ji Jozuovi, Jozue starším, starší prorokům a proroci mužům Velkého shromáždění.“ | doložené (text) | Mišna, Avot 1, 1 | Citát 12; nese „ústní Tóru“ |
| 38 | Šimon Spravedlivý: svět stojí na třech věcech: na Tóře, na bohoslužbě (v chrámu) a na skutcích lásky | doložené (text) | Avot 1, 2 | Citát 13; po roce 70 se „bohoslužba“ chrámu stává modlitbou (to je výklad, neověřený; nepsat) |
| 39 | Hillel: „Nejsem-li já pro sebe, kdo je pro mě? A jsem-li jen pro sebe, co jsem? A ne-li teď, kdy?“ | doložené (text) | Avot 1, 14 | Citát 14; velmi silný pro studenty (vazba na linii Jak být sám sebou) |
| 40 | Tarfon: „Není na tobě, abys dílo dokončil, ale nejsi svobodný se ho vzdát.“ | doložené (text) | Avot 2, 16 | Citát 15 |
| 41 | Hillel a pohan: pohan chce přestoupit, když ho naučí celou Tóru, zatímco stojí na jedné noze. Šamaj ho odežene stavitelským loktem, Hillel řekne: „Co je ti protivné, nečiň druhému. To je celá Tóra a ostatní je její výklad. Jdi a uč se.“ | tradovaný příběh | Babylonský talmud, Šabat 31a | „Vypráví se, že…“ Citát 6. Hillelova věta je aramejsky (ne hebrejsky) |
| 42 | „Miluj svého bližního jako sebe samého. Já jsem Hospodin.“ | doložené (text) | Lv 19,18 (ČEP) | Citát 16; celý verš začíná „Nebudeš se mstít synům svého lidu…“ |
| 43 | „Bylo ti oznámeno, co je dobré a co od tebe Hospodin žádá: jen to, abys zachovával právo, miloval milosrdenství a pokorně chodil se svým Bohem.“ | doložené (text) | Mi 6,8 (ČEP) | Citát 17; jen jeden z 16 a 17, ať citátů není moc |

### Vazby na osobnosti

| Osoba | V datech | Co je doložené | Doporučená formulace |
| --- | --- | --- | --- |
| **Filón Alexandrijský** | ano (`filon-alexandrijsky`, medailonek, `tradice: zidovska`) | Žil v Alexandrii, účastnil se poselstva ke Caligulovi (SEP, už v `zdroje.yaml`). Jeho jméno „se stalo skoro synonymem alegorie“, ale nebyl jen alegorik (SEP 4.1); obdivoval Platóna (Timaios je v jeho O stvoření světa „masivně“ přítomen, SEP). V Alexandrii nejspíš byli Židé, kteří vykládali Bibli, jako stoikové vykládali Homéra (SEP 4.1). Septuaginta, řecký překlad Bible, asi 270 př. n. l. (SEP) | S odkazem: „Filón Alexandrijský četl Tóru řecky a hledal v jejích příbězích skrytý smysl, podobně jako filozofové v Homérovi.“ |
| **Maimonides** | ne | Narozen 1138 v Córdobě pod muslimskou vládou, od 1166 v Egyptě, Fustat (část Káhiry), zemřel 1204; Průvodce zbloudilých dokončen 1190, psán jako dopis studentovi, který neví, jestli následovat filozofii, nebo učení svého náboženství (SEP „Maimonides“, oddíl 1) | Jméno bez odkazu, jedna věta: „Ve 12. století Maimonides napsal Průvodce zbloudilých pro studenta, který nevěděl, jestli má věřit filozofii, nebo Tóře.“ |
| **Spinoza** | ne | 27. 7. 1656 ho sefardská obec v Amsterdamu stihla nejtvrdším *cherem* (klatbou), jaký kdy vyhlásila; nikdy nebyl odvolán; přesné důvody neznáme (SEP „Spinoza“, oddíl 1) | Bez odkazu; na judaismu jen tehdy, když nese myšlenku (spor tradice a svobodného zkoumání). Doporučuju ho ze stránky vynechat a nechat ho renesanci |
| **Martin Buber** | ne | Já a Ty (1923): dvě základní slova Já–Ty a Já–Ono, setkání versus užívání; vztah i k Božímu Ty; od 1938 do smrti 1965 v Jeruzalémě (SEP „Buber“). Česky Já a Ty, Mladá fronta 1969 (podle seznamu literatury kurzu UK, nečteno) | Jméno bez odkazu, jedna věta, pokud stránka má oddíl „judaismus a filozofie“ |

Vztahy do `vztahy.yaml` nepřibývají (nikdo z nových v datech není).

### Citáty (b)

Všechny citáty Bible doslova z ČEP (2001), přepis podle obohu.cz. Mišna a Talmud: vlastní převod podle angličtiny ze Sefarie (Kulp; William Davidson Edition) a hebrejštiny (Torat Emet); hebrejské znění do `original` jen tam, kde ho mám doslova (14, 15, 6).

| # | Znění v atlasu | Dílo, místo | Překlad | Návrh id; poznámka |
| --- | --- | --- | --- | --- |
| 6 | „Co je ti protivné, nečiň druhému. To je celá Tóra a ostatní je její výklad. Jdi a uč se.“ | Babylonský talmud, Šabat 31a | vlastní převod podle W. Davidson Edition a aramejského textu (דַּעֲלָךְ סְנֵי לְחַבְרָךְ לָא תַּעֲבֵיד — זוֹ הִיא כׇּל הַתּוֹרָה כּוּלָּהּ, וְאִידַּךְ פֵּירוּשָׁהּ הוּא, זִיל גְּמוֹר) | `talmud-sabat-31a`; *chavrach* = tvůj druh, bližní; „druhému“ drží smysl |
| 7 | „Slyš, Izraeli, Hospodin je náš Bůh, Hospodin jediný.“ | Dt 6,4 | ČEP | `dt-6-4` |
| 8 | „Budete-li mě skutečně poslouchat a dodržovat mou smlouvu, budete mi zvláštním vlastnictvím jako žádný jiný lid.“ | Ex 19,5 | ČEP, zkráceno (vynecháno „Nyní tedy“ a „třebaže má je celá země“) | `ex-19-5`; zkrácení dát do `podle` |
| 9 | „Předložil jsem ti život i smrt, požehnání i zlořečení; vyvol si tedy život.“ | Dt 30,19 | ČEP, zkráceno (začátek „Dovolávám se dnes proti vám svědectví nebes i země:“ a konec „abys byl živ ty i tvé potomstvo“) | `dt-30-19` |
| 10 | „U řek babylónských, tam jsme sedávali s pláčem ve vzpomínkách na Sijón. … Jak bychom však mohli zpívat píseň Hospodinovu v té cizí zemi?“ | Ž 137,1.4 | ČEP | `z-137`; verše 7–9 ne |
| 11 | „Usilujte o pokoj toho města, do něhož jsem vás přestěhoval, modlete se za ně k Hospodinu, neboť v jeho pokoji i vy budete mít pokoj.“ | Jr 29,7 | ČEP | `jr-29-7` |
| 12 | „Mojžíš přijal Tóru na Sinaji a předal ji Jozuovi, Jozue starším, starší prorokům a proroci ji předali mužům Velkého shromáždění.“ | Mišna, Avot 1, 1 | vlastní převod podle Kulpa | `avot-1-1` |
| 13 | „Svět stojí na třech věcech: na Tóře, na bohoslužbě a na skutcích lásky.“ | Mišna, Avot 1, 2 (Šimon Spravedlivý) | vlastní převod podle Kulpa („the Temple service“, „acts of piety“) | `avot-1-2`; *gemilut chasadim* jako „skutky lásky“ je běžný český převod, Kulp má „acts of piety“; T2 zváží „skutky milosrdenství“ |
| 14 | „Nejsem-li já pro sebe, kdo je pro mě? A jsem-li jen sám pro sebe, co jsem? A ne-li teď, kdy?“ | Mišna, Avot 1, 14 (Hillel) | vlastní převod z hebrejštiny (אִם אֵין אֲנִי לִי, מִי לִי. וּכְשֶׁאֲנִי לְעַצְמִי, מָה אֲנִי. וְאִם לֹא עַכְשָׁיו, אֵימָתָי) | `avot-1-14` |
| 15 | „Není na tobě, abys dílo dokončil, ale nejsi svobodný se ho vzdát.“ | Mišna, Avot 2, 16 (Tarfon) | vlastní převod z hebrejštiny (לֹא עָלֶיךָ הַמְּלָאכָה לִגְמֹר, וְלֹא אַתָּה בֶן חוֹרִין לִבָּטֵל מִמֶּנָּה) | `avot-2-16`; číslování podle Sefarie (v některých vydáních 2, 21) |
| 16 | „Budeš milovat svého bližního jako sebe samého. Já jsem Hospodin.“ | Lv 19,18 | ČEP | `lv-19-18` |
| 17 | „Bylo ti oznámeno, co je dobré a co od tebe Hospodin žádá: jen to, abys zachovával právo, miloval milosrdenství a pokorně chodil se svým Bohem.“ | Mi 6,8 | ČEP, bez oslovení „Člověče,“ | `mi-6-8` |
| 18 | „Hospodinův hlas burácí nad vodami, zahřímal Bůh slávy, Hospodin nad mocným vodstvem.“ | Ž 29,3 | ČEP | `z-29-3`; pro pokus „Proč hřmí?“ na stránce Co je filozofie? (P6, oddíl a); na stránce judaismu ne, ať se nezdvojí |

Citátů je víc, než stránka unese: T2 vybere nejvýš šest až osm. Doporučené jádro: 6, 7, 10, 11, 12, 14, 9.

### Kde a kdy (mapa)

V `mista.yaml` je jen `alexandrie` (Filón) a `rim`. Chybí:

```yaml
# Blízký východ (nový oddíl v mista.yaml)
- { id: jeruzalem, nazev: Jeruzalém, dobovy: Hierosolyma, dnes: "Jeruzalém", souradnice: [35.235, 31.777], pleiades: "687928" }
- { id: babylon, nazev: Babylón, dnes: "u Hilly, Irák", souradnice: [44.425, 32.537], pleiades: "893951" }
- { id: javne, nazev: Javne, dobovy: Iamneia, dnes: "Javne, Izrael", souradnice: [34.738, 31.876], pleiades: "687925" }
```

- Souřadnice jsou `reprPoint` z Pleiad, zaokrouhlené na tři desetinná místa.
- **U Jeruzaléma pole `dnes` bez státu.** Komu město patří, je dnešní politický spor; atlas ho nerozhoduje a nemá ho ani naznačit.
- **Sinaj nepřidávat:** kde hora ze Ex 19 byla, nevíme (tradiční Džebel Músá je pozdější určení; neověřeno). Na mapě by bod tvrdil, co pramen netvrdí.
- Babylónský talmud vznikl v akademiích v Babylónii (Sura, Pumbedita): **neověřeno**, místa nepřidávat.
- Šíření (diaspora: Alexandrie, Řím, Babylón; později Córdoba, Amsterdam) jen z toho, co mapa už má nebo co přinese středověk.

## c) Co do stránek nepatří

- **Pravdivost tradice.** Ani „Bůh dal Tóru“, ani „Tóru sepsali lidé“. Stránka říká, čemu Židé věří a jak to žijí; o tom, jestli je to pravda, mluví otázka 9.
- **Srovnávání lepší a horší.** Ani mezi judaismem a křesťanstvím („Starý zákon zákona, Nový zákon lásky“ je křesťanské klišé, které Lv 19,18 a Mi 6,8 vyvracejí, ale stránka se do sporu nepouští), ani mezi náboženstvím a nevírou.
- **Křesťanský pohled jako výchozí:** „Starý zákon“, „předchůdce křesťanství“, „Ježíšovi současníci“ jako rámec. Judaismus je živá tradice o sobě, ne kapitola před křesťanstvím. Ježíš na stránce judaismu nebude; patří na stránku křesťanství.
- **Protižidovská klišé:** farizeové jako pokrytci, „Židé ukřižovali Ježíše“, peníze, spiknutí. Nic z toho, ani jako ukázka předsudku na této stránce (předsudky patří na stránku Tolerance a nesnášenlivost, později).
- **Dnešní politika:** stát Izrael, konflikt s Palestinci, sionismus. Stránka je o tradici, ne o státu. Jediná výjimka by byla, kdyby to neslo myšlenku; v úvodu ne.
- **Holokaust (šoa)** jen tam, kde nese myšlenku, a ne jako obraz. Navrhuju **jednu větu** v oddíle o exilu a rozptýlení, bez čísel a bez fotografie: „Ve 20. století zavraždil nacistický režim a jeho spojenci šest milionů evropských Židů; Židé tomu říkají šoa, katastrofa.“ (USHMM: „systematic, state-sponsored persecution and murder of six million European Jews by the Nazi German regime and its allies and collaborators“, 1933–1945; „Shoah“, hebrejsky katastrofa.) Víc patří do 7. období (víra po holokaustu), ne sem. Podle `docs/pouceni.md`: věta nestojí na začátku stránky ani oddílu, nemá kolem sebe otázku pro studenta s polem na psaní a hned po ní pokračuje text o tom, jak tradice žije dál. Student z rodiny, které se to týkalo, má číst fakt, ne efekt.
- **Obléhání Jeruzaléma** ve vstupní scéně: hlad a spálené sklady jednou větou, bez obrazu utrpení.
- **Spinozova klatba** na stránce judaismu jako příběh o „netolerantním náboženství“: ne. Pokud vůbec, pak na stránce renesance a Spinozy.

## d) Obrázky (návrhy; nic nestahovat)

Všechny z The Metropolitan Museum of Art, v API `isPublicDomain: true` (CC0, Open Access), `primaryImage` existuje. **Co přesně obrázek ukazuje, jsem neviděl** (API vrací jen údaje); T2 se na stránku předmětu podívá, než ho použije.

| Předmět | Co zobrazuje | Autor / instituce | Licence | Odkaz | K čemu |
| --- | --- | --- | --- | --- | --- |
| 254966 | Mramorový votivní reliéf zasvěcený héróovi, Attika, konec 4. stol. př. n. l. | Met, inv. 57.42 | CC0 | https://www.metmuseum.org/art/collection/search/254966 | Co je náboženství?: obřad a oběť v antice (most k obdobím 1–2) |
| 633650 | Pojítko na svitek Tóry (*mapa*), vyšívala Miriam Foa, 1615–16 | Met, inv. 2013.1143 | CC0 | https://www.metmuseum.org/art/collection/search/633650 | Judaismus, oddíl Tóra; dílo konkrétní ženy |
| 239512 | Koruna na Tóru (*keter*), Andrea Zambelli, asi 1740–50, stříbro, částečně zlacené | Met, inv. 2013.443 | CC0 | https://www.metmuseum.org/art/collection/search/239512 | Judaismus, Tóra (rezerva) |
| 192064 | Chanukový svícen, konec 17. stol., stříbro | Met, inv. 13.41.9 | CC0 | https://www.metmuseum.org/art/collection/search/192064 | Judaismus, svátky (rezerva) |
| 403379 | Titův oblouk, rytina ze Speculum Romanae Magnificentiae, 1558 | Met, inv. 41.72(1.76) | CC0 | https://www.metmuseum.org/art/collection/search/403379 | Judaismus, rok 70; **jen pokud je na rytině vidět reliéf s menorou**, jinak nepoužít |

Fotografie reliéfu na Titově oblouku (menora z jeruzalémského chrámu) by byla nejsilnější, ale je jen na Wikimedia Commons: podle `skills/atlas-overeni/references/zdroje.md` ji musí autor najít a licenci potvrdit sám.

## Návrh dat

```yaml
# zdroje.yaml › prameny (nové)
- { id: sep-concept-religion, druh: encyklopedie, nazev: "The Concept of Religion", autor: "Kevin Schilbrack", dilo: Stanford Encyclopedia of Philosophy, url: "https://plato.stanford.edu/entries/concept-religion/", overeno: 2026-11-01, poznamka: "1. vyd. 28. 3. 2022. Religio jako svědomitost; Tylor 1871 (víra v duchovní bytosti); substantivní a funkční definice (Durkheim, Tillich); funkční pojetí zahrnuje nacionalismus i fandění, univerzalita je produkt definice; rodová podobnost (Wittgenstein § 68), pět znaků, Smart (sedm rozměrů), Alston; námitka, že náboženství není věc." }
- { id: durkheim-formy, druh: pramen, nazev: "The Elementary Forms of the Religious Life", autor: "Émile Durkheim (přel. J. W. Swain)", dilo: "Project Gutenberg č. 41360", url: "https://www.gutenberg.org/ebooks/41360", overeno: 2026-11-01, poznamka: "Les formes élémentaires de la vie religieuse (1912), anglicky 1915. Úvod § 1 (nepravdivá náboženství nejsou); I, 1, § 2–4 (buddhismus, posvátné a profánní, magie bez církve, definice); II, 7 (bůh klanu je klan); Závěr (námitka o jednom případu). Česky Oikoymenh 2002, nečteno." }
- { id: otto-heilige, druh: pramen, nazev: "Das Heilige", autor: "Rudolf Otto", dilo: "13. vydání, Gotha 1925 (archive.org)", url: "https://archive.org/details/dasheiligeuberda00otto", overeno: 2026-11-01, poznamka: "1. vyd. 1917. Kap. 2 numinózní; kap. 3 výzva čtenáři (s. 8); kap. 4 mysterium tremendum (s. 12–13); kap. 6 fascinans. Česky Posvátno, Vyšehrad 1998, nečteno." }
- { id: britannica-eliade, druh: encyklopedie, nazev: "Mircea Eliade", dilo: Encyclopaedia Britannica, url: "https://www.britannica.com/biography/Mircea-Eliade", overeno: 2026-11-01, poznamka: "Četl nástroj WebFetch. 1907 Bukurešť – 1986 Chicago; The Sacred and the Profane (1959); hierofanie; homo religiosus; kritika: subjektivní a nevědecké, zkreslení dějinných náboženství; fašistická minulost." }
- { id: cep, druh: pramen, nazev: "Bible. Český ekumenický překlad", dilo: "Česká biblická společnost, vydání 2001 (obohu.cz)", url: "https://www.obohu.cz/bible/index.php?styl=CEP", overeno: 2026-11-01, poznamka: "Čteno: Ex 19,4–6; Lv 19,18; Dt 6,4–9; Dt 30,15–19; Ž 29; Ž 137,1–6; Jr 29,4–9; Mi 6,8." }
- { id: sefaria-talmud, druh: pramen, nazev: "Babylonský talmud (William Davidson Edition)", dilo: Sefaria, url: "https://www.sefaria.org/Shabbat.31a", overeno: 2026-11-01, poznamka: "Četl nástroj WebFetch přes API. Šabat 31a (Hillel a pohan na jedné noze); Gitin 56a–b (Jochanan ben Zakkaj vynesen z Jeruzaléma, Javne a jeho mudrci)." }
- { id: sefaria-avot, druh: pramen, nazev: "Mišna, Avot", dilo: "Sefaria (angl. J. Kulp, Mishnah Yomit; hebr. Torat Emet)", url: "https://www.sefaria.org/Pirkei_Avot.1", overeno: 2026-11-01, poznamka: "Četl nástroj WebFetch přes API. 1, 1 (řetěz tradice); 1, 2 (Šimon Spravedlivý); 1, 14 (Hillel); 2, 16 (Tarfon)." }
- { id: britannica-babylonian-exile, druh: encyklopedie, nazev: "Babylonian Exile", dilo: Encyclopaedia Britannica, url: "https://www.britannica.com/event/Babylonian-Exile", overeno: 2026-11-01, poznamka: "Četl nástroj WebFetch (zkrácený výtah). Deportace 598/7 a 587/6 př. n. l.; konec 538 př. n. l. za Kýra." }
- { id: britannica-mishna, druh: encyklopedie, nazev: "Mishna", dilo: Encyclopaedia Britannica, url: "https://www.britannica.com/topic/Mishna", overeno: 2026-11-01, poznamka: "Četl nástroj WebFetch. Nejstarší autoritativní sbírka ústního práva; tanaité asi dvě století; uzavřel Jehuda ha-Nasi na počátku 3. století; Mišna + Gemara = Talmud." }
- { id: britannica-johanan, druh: encyklopedie, nazev: "Johanan ben Zakkai", dilo: Encyclopaedia Britannica, url: "https://www.britannica.com/biography/Johanan-ben-Zakkai", overeno: 2026-11-01, poznamka: "Četl nástroj WebFetch. Zboření chrámu 70 n. l.; zakladatel akademie a rabínského sboru v Jamnii; rozhodující vliv na pokračování judaismu. Útěk z Jeruzaléma heslo nezmiňuje." }
- { id: ushmm-holocaust, druh: encyklopedie, nazev: "Introduction to the Holocaust", dilo: "United States Holocaust Memorial Museum, Holocaust Encyclopedia", url: "https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust", overeno: 2026-11-01, poznamka: "Četl nástroj WebFetch. Šest milionů evropských Židů, nacistický režim, spojenci a kolaboranti, 1933–1945; šoa = hebrejsky katastrofa." }
- { id: sep-maimonides, druh: encyklopedie, nazev: "Maimonides", autor: "Kenneth Seeskin", dilo: Stanford Encyclopedia of Philosophy, url: "https://plato.stanford.edu/entries/maimonides/", overeno: 2026-11-01, poznamka: "Córdoba 1138, Egypt 1166, Fustat; Průvodce zbloudilých 1190 jako dopis studentovi mezi filozofií a náboženstvím; zemřel 1204." }
- { id: sep-spinoza, druh: encyklopedie, nazev: "Baruch Spinoza", autor: "Steven Nadler", dilo: Stanford Encyclopedia of Philosophy, url: "https://plato.stanford.edu/entries/spinoza/", overeno: 2026-11-01, poznamka: "Cherem 27. 7. 1656, sefardská obec Amsterdam, nejtvrdší, nikdy neodvolán; důvody přesně neznámé." }
- { id: sep-buber, druh: encyklopedie, nazev: "Martin Buber", autor: "Michael Zank", dilo: Stanford Encyclopedia of Philosophy, url: "https://plato.stanford.edu/entries/buber/", overeno: 2026-11-01, poznamka: "Já a Ty (1923): Já–Ty a Já–Ono, i Boží Ty; v Jeruzalémě od 1938 do smrti 1965." }
```

`sep-philo` už v datech je; do poznámky doplnit: „1. 11. 2026 (P6N): oddíl 4.1 Alegorie: jméno skoro synonymum alegorie, nebyl ale jen alegorik; v Alexandrii nejspíš Židé, kteří vykládali Bibli jako stoikové Homéra; Septuaginta asi 270 př. n. l.“

**Citáty a schéma (pro K1).** `Citat.osoba` je povinné id osoby z `lide.yaml`. Verše z Bible, Mišny a Talmudu nemají osobu v datech a nové osoby nepřibývají. Návrh: `osoba` volitelné, když je vyplněné nové pole `tradice` (id z `nabozenstvi`, tady `judaismus`), a test, že citát má aspoň jedno z obou. U citátů 6, 14 a 15 se mluvčí (Hillel, Tarfon) řekne v poli `autor` („Hillel“, „rabi Tarfon“), `osoba` zůstane prázdná. Alternativa bez změny schématu (citáty jen v MDX bez `zdroje.yaml`) porušuje pravidlo z `CLAUDE.md` › Obsah a zdroje; nedoporučuju.

```yaml
# zdroje.yaml › citaty (tvar; osoba vynechána podle návrhu výše)
- id: avot-1-14
  tradice: judaismus
  autor: Hillel
  dilo: Mišna, Avot
  misto: "1, 14"
  cesky: "Nejsem-li já pro sebe, kdo je pro mě? A jsem-li jen sám pro sebe, co jsem? A ne-li teď, kdy?"
  original: "אִם אֵין אֲנִי לִי, מִי לִי. וּכְשֶׁאֲנִי לְעַצְמִי, מָה אֲנִי. וְאִם לֹא עַכְשָׁיו, אֵימָתָי"
  preklad: { druh: vlastni, podle: "hebrejský text (Torat Emet) a anglický překlad J. Kulpa (Sefaria)" }
  zdroj: sefaria-avot
- id: jr-29-7
  tradice: judaismus
  autor: Jeremjáš
  dilo: Kniha Jeremjášova
  misto: "29, 7"
  cesky: "Usilujte o pokoj toho města, do něhož jsem vás přestěhoval, modlete se za ně k Hospodinu, neboť v jeho pokoji i vy budete mít pokoj."
  preklad: { druh: publikovany, prekladatel: "Český ekumenický překlad", podle: "vydání 2001" }
  zdroj: cep
- id: durkheim-uvod
  osoba: ~          # Durkheim v datech není; u religionistů stejný problém
  autor: Émile Durkheim
  dilo: Elementární formy náboženského života
  misto: "Úvod, 1"
  cesky: "Nepravdivá náboženství tedy ve skutečnosti nejsou. Všechna jsou svým způsobem pravdivá: všechna odpovídají, každé jinak, na dané podmínky lidské existence."
  preklad: { druh: vlastni, podle: "anglický překlad J. W. Swaina (1915); francouzský originál nečten" }
  zdroj: durkheim-formy
```

Stejný problém mají Durkheim a Otto: v datech nejsou. Tam navrhuju `osoba` volitelné bez `tradice` a v `autor` celé jméno; K1 rozhodne o tvaru (třeba pole `bezStranky: true`), test hlídá, že citát bez osoby nikde neodkazuje na stránku osoby.

**Kolekce `nabozenstvi` (pro K1):** pole `mista` (seznam `{ misto, role: vznik | centrum | siren, od?, do?, zdroj }`) pro mapku a přehled; pro judaismus `jeruzalem` (centrum, do 70), `babylon` (exil, od −587 do −538), `alexandrie` (diaspora, Filón), `javne` (centrum, od 70), `rim` (diaspora). Role a roky jen podle tvrzení 31, 34 a vazeb výše.

## Rozpory a rozhodnutí

- **Rakev.** Rozšířené vyprávění („nechal se vynést v rakvi“) Talmud v Gitin 56a nemá; říká jen, že ho žáci nesli k pohřbu. Doporučuju „jako mrtvého“, bez rakve.
- **Rok babylonského dobytí.** Britannica dává 587/6 př. n. l.; v Česku se často píše 586. Doporučuju „587 př. n. l.“ podle Britanniky, v datech `rozmezi: [-587, -586]`.
- **Mišna „kolem roku 200“** vs. Britannica „early in the 3rd century“: doporučuju „na začátku 3. století“.
- **Avot 2, 16 vs. 2, 21:** číslování se v různých vydáních liší; v datech „2, 16“ podle Sefarie a v `podle` poznámka.
- **Gemilut chasadim:** Kulp „acts of piety“, česky běžně „prokazování lásky“ nebo „skutky milosrdenství“; doporučuju „skutky lásky“ (krátké, srozumitelné), T2 může zvolit jinak.
- **„Posvátné“ ve dvojím smyslu.** Durkheim (oddělené společenstvím) a Otto (prožitek zcela jiného) nejsou totéž. Stránka musí říct obojí a nespojit je do jedné definice; jinak by tvrdila, že fanklub má Ottovo numinózní.

## Otevřené otázky pro autora

Viz plán větve, oddíl „Co rozhodnout po P6N“.
