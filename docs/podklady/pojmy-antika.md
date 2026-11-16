# Podklady: pojmy z antiky (design-v2, krok P)

Ověřeno 15. 11. 2026. Hesla SEP a IEP stažená na autorově Macu a prohledaná v textu (`scripts/pojmy-prameny.py`), původ slov v LSJ na Perseu (`scripts/pojmy-lsj.py`; Perseus teď chce cookie, curl ji drží v souboru). Oba skripty byly pracovní a po zápisu podkladů jsou smazané; vyznačení v textech dělá `scripts/vyznac-pojmy.py`.

## Jak vznikl výběr

Výpis kmenů ze všech textů antiky (`src/content`: osobnosti, cesty a kroky, otázky, období, směry, pokusy, úvody, náboženství). **Řecká slova, která zadání jmenuje (ataraxia, apatheia, logos, elenchos, eudaimonia, akrasia), v textech pro studenty nestojí ani jednou**: atlas je od začátku překládá do češtiny („klid“, „štěstí“, „neovládnutí“, „protipříklad“, „rozum“). Pojmy proto nesou česká slova, která student opravdu čte, a řecké slovo je v původu. Kdo na stránce pojmu hledá ataraxii, najde ji (tvary pro hledání).

Do výběru nešly: jména lidí a míst (Delfy z plátna je místo; vysvětlení nese pojem věštírna), školy, které mají vlastní stránku směru (kynik, stoik, epikurejec, sofista, akademie), slova, která text vysvětlí hned ve stejné větě a lístek by ho jen opakoval, a obecná slova bez filozofického obsahu v daném místě („soud“ nad Sókratem, „osud“ v běžném smyslu, „klid“ jako odpočinek).

Sloupec **výskyty** jmenuje stránky, kde slovo v tom smyslu stojí (první výskyt na stránce). **Vyznačeno** jsou ta místa, kde je obalené komponentou Pojem: jen první výskyt na stránce, nejvýš jeden pojem v odstavci, ne v nadpisu, odkazu, citátu, bloku ani v obsahu ostrovu, a ne tam, kde stránka slovo vykládá sama o dvě věty dál (Aristotelova ctnost u oka a koně).

## Přehled

| # | Pojem | Řecky | Vyznačeno |
| --- | --- | --- | --- |
| 1 | ctnost | aretḗ | Kam mi mizí čas? 8, Stačí vědět, co je správné? 6, Kratés a Hipparchia, Sókratés, stoicismus |
| 2 | idea | idea | Je to, co vidím, celá skutečnost? 8, Platón, akademie, kynismus |
| 3 | duše | psȳchḗ | Je to, co vidím, celá skutečnost? 7, Aristotelés, Platón, Seneca |
| 4 | rozpomínání | anamnēsis | Platón |
| 5 | slast | hēdonḗ | Epikúros, epikureismus |
| 6 | klid | ataraxia | Co když přijde to nejhorší? 4, Kolik je dost? 7, Epikúros |
| 7 | štěstí | eudaimonia | Co mám ve svých rukou? 5 |
| 8 | vědění | epistḗmē | Stačí vědět, co je správné? 3, Seneca |
| 9 | neovládnutí | akrasia | Stačí vědět, co je správné? 5 |
| 10 | střed | mesotēs | Stačí vědět, co je správné? 8 |
| 11 | etika | ēthikḗ | Stačí vědět, co je správné? 4, Aristotelés, Co je filozofie? |
| 12 | mýtus | mȳthos | Prótagorás |
| 13 | dialog | dialogos | Stačí vědět, co je správné? 3, Prótagorás, Co je skutečné? |
| 14 | protipříklad | elenchos | Sókratés |
| 15 | obec | polis | Je to, co vidím, celá skutečnost? 7, Kdy mám dobrý důvod věřit? 5, Aristotelés, Diogenés, Platón, Prótagorás, Sókratés, epikureismus, stoicismus |
| 16 | tyran | tyrannos | Epiktétos, Platón |
| 17 | věštírna | manteion | Diogenés, Sókratés |
| 18 | v naší moci | ef’ hēmin | Co když přijde to nejhorší? 3, Co mám ve svých rukou? 3 |
| 19 | soud | dogma | nikde (všechny výskyty jsou v citátu nebo v bloku) |
| 20 | lhostejné věci | adiafora | Co mám ve svých rukou? 5 |
| 21 | osud | (neověřeno) | stoicismus |
| 22 | příčina | aitia | Aristotelés |
| 23 | atom | atomos | Proč se bát smrti? 3 |
| 24 | látka | hylē, archē | Co je filozofie? |
| 25 | rozum | logos | Stačí vědět, co je správné? 5, Platón, akademie, stoicismus |
| 26 | religionistika | (lat. religio) | Co je náboženství? |

Přesná místa drží data (`src/content/pojmy/<id>.md`, pole `vyskyty`) a hlídá je `tests/data/pojmy.test.ts`: každé vyznačení je ve výskytech a každý výskyt má na stránce některý tvar slova.

## Pojmy

Formát: **původ** (zdroj), **vysvětlení** na dvě věty (jde do lístku a na stránku beze změny), **u koho co** tam, kde slovo znamená u různých filozofů různé věci, **příklad** ze života studenta (autorský, bez pramene), **prameny**. Typ tvrzení je u všech výklad (`atlas-overeni`), podávaný přímo.

### 1. ctnost
- **Původ:** aretḗ, „zdatnost, výtečnost čehokoli“ (LSJ: „goodness, excellence, of any kind“), https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0057:entry=a%29reth%2F
- **Vysvětlení:** Řekové tak neříkali poslušnosti, ale tomu, v čem je kdo nebo co dobré: ctnost oka je, že dobře vidí. Sókratés měl ctnost člověka za vědění, Aristotelés za získaný návyk a stoikové za jediné opravdové dobro.
- **U koho co:** Sókratés: kdo opravdu ví, co je dobré, jedná dobře; Platón ho tak nechává mluvit v Prótagorovi (SEP Plato's Ethics: popření akrasie). Aristotelés: aretḗ jako „excellence“, ustálená povaha, ke které se člověk dobře návykem vychová (SEP Aristotle's Ethics, 1.–5.). Stoikové: „virtue is the only good“, zdraví a bohatství jsou lhostejné (SEP Stoicism, 4.2 a 4.3).
- **Příklad:** Dobrý brankář není ten, kdo poslouchá trenéra, ale ten, kdo chytá. V čem by byla tvoje ctnost jako kamaráda?
- **Prameny:** https://plato.stanford.edu/entries/aristotle-ethics/, https://plato.stanford.edu/entries/plato-ethics/, https://plato.stanford.edu/entries/stoicism/
- **Výskyty:** Sókratés (kap. 02), Aristotelés (vykládá sám, nevyznačeno), Kratés a Hipparchia, Kam mi mizí čas? 8, Stačí vědět? 4 (vykládá sám), Stačí vědět? 6, stoicismus. Atribut Aristotela o ctnosti je na desce (`docs/pouceni.md`): lístek k němu nepatří.

### 2. idea
- **Původ:** idea, od idein „uvidět“: podoba, tvar (LSJ: „form“, z ἰδεῖν).
- **Vysvětlení:** Platón tak nazval to, co mají všechny krásné věci nebo všechny kruhy společné a co nevidíš očima, jen rozumem. Ideje se podle něj nemění, kdežto věci kolem nás vznikají a zanikají.
- **U koho co:** Platón: ideje jsou skutečnější než věci, které jsou jejich obrazy (SEP Plato's Middle Period Metaphysics). Aristotelés je odmítl jako samostatné bytí; tvar je podle něj ve věci (atlas, Akademie a cesta Je to, co vidím? 8).
- **Příklad:** Když řekneš „mám ideu“, myslíš nápad. Platónova idea kruhu je to, podle čeho poznáš, že je nakreslený kruh křivý, i když dokonalý kruh jsi nikdy neviděl.
- **Prameny:** https://plato.stanford.edu/entries/plato-metaphysics/, LSJ https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0057:entry=i%29de%2Fa

### 3. duše
- **Původ:** psȳchḗ, původně „život“ (LSJ: „life“).
- **Vysvětlení:** Pro Řeky to, čím je živé tělo živé, a zároveň to, co v nás myslí, chce a bojí se. Z čeho je duše a jestli přežije smrt, na tom se filozofové neshodli.
- **U koho co:** Platón: nesmrtelná, ve třech částech: rozumová, horlivá a žádostivá (logistikon, thumoeides, epithumētikon; SEP Plato's Ethics, Ústava 434d–441c). Atlas říká „rozum, hněv, žádostivost“ (rozhodnutí autora ze 4. 10. 2026). Aristotelés: duše je „first actuality of a natural organic body“, má ji i rostlina (SEP Aristotle's Psychology, De anima II 1). Epikúros: jemné atomy rozptýlené tělem, se smrtí se rozpadnou (SEP Epicurus).
- **Příklad:** Když do něčeho dáváš celou duši, myslíš to podobně jako Řekové: celého sebe, ne jen ruce.
- **Prameny:** https://plato.stanford.edu/entries/plato-ethics/, https://plato.stanford.edu/entries/aristotle-psychology/, https://plato.stanford.edu/entries/epicurus/

### 4. rozpomínání
- **Původ:** anamnēsis, „připomenutí, vzpomínka“ (LSJ: „calling to mind, reminiscence“, Pl. Phd. 72e).
- **Vysvětlení:** Platón nechává Sókrata tvrdit, že učit se znamená vzpomínat si na to, co duše věděla, než se narodila. Proto chlapec v Menónovi najde řešení úlohy sám, když se ho někdo dobře ptá.
- **Pramen k výkladu:** IEP Plato: Meno („theory of recollection“, lekce geometrie s otrokem).
- **Příklad:** Znáš to z matiky: nikdo ti řešení neřekne, a najednou ho vidíš, jako bys ho věděl odjakživa.
- **Prameny:** https://iep.utm.edu/meno/

### 5. slast
- **Původ:** hēdonḗ, „potěšení, požitek“ (LSJ: „enjoyment, pleasure“); odtud hédonismus.
- **Vysvětlení:** Epikúros učil, že slast je cílem všeho, co děláme, a že nejvyšší slast není požitek navíc. Je to klid: tělo, které nebolí, a mysl, která se nebojí.
- **U koho co:** Epikúros rozlišuje slast v pohybu (vůně, hudba) a slast klidovou („catastematic“, „static“), která je nejvyšší (SEP Epicurus). Kyrénaikové v atlasu slovo nemají, rozdíl proto lístek neřeší.
- **Příklad:** Večer po dlouhém výletě nepotřebuješ oslavu. Stačí, že tě nic nebolí a ničeho se nebojíš.
- **Prameny:** https://plato.stanford.edu/entries/epicurus/

### 6. klid (ataraxia)
- **Původ:** ataraxia, z a- „ne“ a tarassein „rozvířit, zneklidnit“ (LSJ: „impassiveness, calmness“, Epikúros, Dopis Hérodotovi).
- **Vysvětlení:** Řecky ataraxia: mysl, kterou nic nerozbouří, ani strach, ani touha po dalším. Epikúros k ní šel skromností a přáteli, stoikové životem bez vášní, kterému říkali apatheia.
- **U koho co:** Epikúros: ataraxia jako cíl (SEP Epicurus). Stoikové: šťastný život je „passion-free (apathês)“ (SEP Stoicism, 4.7). Epiktétos mluví i o klidu (Co mám ve svých rukou? 3); lístek nerozlišuje víc, než unesou dvě věty.
- **Příklad:** Telefon pípne a ty se nepotřebuješ hned podívat. Tak nějak vypadá ataraxia v malém.
- **Prameny:** https://plato.stanford.edu/entries/epicurus/, https://plato.stanford.edu/entries/stoicism/

### 7. štěstí (eudaimonia)
- **Původ:** eudaimonia, z eu „dobře“ a daimōn „božstvo“; LSJ: „prosperity, good fortune“.
- **Vysvětlení:** Pro řecké filozofy ne nálada, ale celý život, který se vydařil. Neshodli se, z čeho se skládá: Aristotelés k němu počítal i zdraví a přátele, stoikům stačila ctnost.
- **U koho co:** Aristotelés: eudaimonia jako „flourishing“, k plnému štěstí patří i vnější dobra (SEP Aristotle's Ethics). Stoikové: štěstí je plně v naší moci a jediné dobro je ctnost (SEP Stoicism, 4.1). Atlas to říká v cestě Co mám ve svých rukou? 5 („jestli mu velká rána bere kus štěstí“).
- **Příklad:** Den, kdy se ti něco povede, je dobrý den. Eudaimonia se ptá dál: řekl bys o celém svém životě, že se vydařil?
- **Prameny:** https://plato.stanford.edu/entries/aristotle-ethics/, https://plato.stanford.edu/entries/stoicism/

### 8. vědění
- **Původ:** epistḗmē, „porozumění, dovednost“, později vědění a věda (LSJ: „understanding, skill“).
- **Vysvětlení:** Vědět neznamená mít názor, který náhodou sedí, ale umět říct, proč je pravdivý. Sókratés si myslel, že kdo opravdu ví, co je dobré, ten to i udělá; Aristotelés mu odporoval.
- **U koho co:** Platón (Menón 98a): vědění je pravdivé mínění „uvázané“ důvodem (SEP Plato's Middle Period Metaphysics, 10.). Sókratés v Prótagorovi: rozum nemůže přemoci vášeň (SEP Plato's Ethics). Aristotelés: kdo se neovládne, vědění v tu chvíli nemá plně (atlas, Stačí vědět? 5 a 8).
- **Příklad:** Odpověď v testu jsi trefil. Víš ji, nebo ses jen strefil? Rozdíl poznáš, když máš vysvětlit proč.
- **Prameny:** https://plato.stanford.edu/entries/plato-metaphysics/, https://plato.stanford.edu/entries/plato-ethics/

### 9. neovládnutí (akrasia)
- **Původ:** akrasia, doslova „nedostatek vlády“ nad sebou (SEP Aristotle's Ethics, 7.: „incontinence; literally: lack of mastery“); LSJ má i tvar akrateia, „want of self-control“.
- **Vysvětlení:** Víš, co je správné, a stejně uděláš opak, protože tě strhne hněv nebo chuť. Sókratés tvrdil, že to vlastně nejde, Aristotelés, že se to stává a že to není totéž co špatnost.
- **Příklad:** Rozhodneš se, že dnes nebudeš do noci na mobilu. V jednu ráno pořád scrolluješ.
- **Prameny:** https://plato.stanford.edu/entries/aristotle-ethics/, https://plato.stanford.edu/entries/plato-ethics/

### 10. střed
- **Původ:** mesotēs, „prostřednost, poloha uprostřed“ (LSJ: „central position“).
- **Vysvětlení:** Aristotelés hledal ctnost mezi dvěma chybami: statečnost leží mezi zbabělostí a zbrklostí. Střed ale není průměr, je pro každého člověka a každou situaci jinde.
- **Pramen k výkladu:** SEP Aristotle's Ethics, 5.: aritmetický střed mezi 10 a 2 je vždy 6, střed volený odborníkem se liší podle situace (1106a36–b7).
- **Příklad:** Kamarádovi řekneš, co si myslíš o jeho tričku. Mlčet by bylo málo, vysmát se mu moc. Kde je střed, záleží i na tom, kdo stojí před tebou.
- **Prameny:** https://plato.stanford.edu/entries/aristotle-ethics/
- **Výskyty:** Stačí vědět? 6 (krok se střed celý vykládá, nevyznačeno), Stačí vědět? 8.

### 11. etika
- **Původ:** ēthikós, „mravní“, od ēthos „povaha“ (LSJ: „moral“, τὰ ἠθικά „treatise on morals“).
- **Vysvětlení:** Část filozofie, která se ptá, jak žít a co je správné udělat. Jméno má od řeckého slova pro povahu, protože jde o to, jakým člověkem se staneš.
- **Příklad:** Když se v partě řeší, jestli je v pořádku poslat dál cizí fotku bez ptaní, už děláte etiku.
- **Prameny:** LSJ https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0057:entry=h%29qiko%2Fs, https://plato.stanford.edu/entries/aristotle-ethics/

### 12. mýtus
- **Původ:** mȳthos, původně „slovo, řeč“ (LSJ: „word, speech“).
- **Vysvětlení:** Posvátné vyprávění o bozích a počátcích, které říká, proč je svět takový, jaký je. V běžné řeči znamená omyl; filozofové a religionisté to slovo tak nemyslí.
- **Pramen k výkladu:** shodně s úvodem Co je náboženství? a jeho podklady (`docs/podklady/nabozenstvi-uvod.md`, Eliade).
- **Příklad:** Rodinné vyprávění o tom, jak se prababička dostala přes hory, taky říká, kdo jste. Mýtus dělá totéž pro celé město.
- **Prameny:** LSJ https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0057:entry=mu%3Dqos
- **Výskyty:** Prótagorás, Co je filozofie? a Co je náboženství? (obě stránky slovo vykládají samy, nevyznačeno).

### 13. dialog
- **Původ:** dialogos, „rozhovor“ (LSJ: „conversation, dialogue“).
- **Vysvětlení:** Platón psal filozofii jako rozhovory, ve kterých se lidé přou a nejčastěji se ptá Sókratés. Sám Platón v nich nikdy nemluví: všechno tvrdí, zpochybňují a dokazují postavy.
- **Pramen k výkladu:** SEP Plato, 1.: „Plato never speaks to his audience directly … and in his own voice“.
- **Příklad:** Na kamarádův názor neodpovíš esejí, ale otázkou, on zas tobě. Dialog nechá čtenáře, aby si stranu vybral sám.
- **Prameny:** https://plato.stanford.edu/entries/plato/

### 14. protipříklad (elenchos)
- **Původ:** Sókratovo zkoušení otázkami Řekové nazývali elenchos, „prověrka, vyvrácení“ (SEP Plato's Ethics: „Socrates' cross-examinations (elenchos)“; SEP Socrates: „elenctic dialogues“).
- **Vysvětlení:** Jediný případ, kterým vyvrátíš tvrzení o všech: stačí jedna bílá vrána. Sókratés jimi zkoušel lidi, kteří tvrdili, že vědí, co je odvaha nebo spravedlnost.
- **Příklad:** Někdo řekne, že všichni, kdo hrají hry, jsou líní. Stačí jedna kamarádka, která hraje a každý den trénuje.
- **Prameny:** https://plato.stanford.edu/entries/plato-ethics/, https://plato.stanford.edu/entries/socrates/

### 15. obec (polis)
- **Původ:** polis, „město, obec“ (LSJ πόλις); u Aristotela „city-state“ (SEP Aristotle's Political Theory).
- **Vysvětlení:** Ne vesnice ani úřad, ale řecký městský stát: město s okolím, které si samo vládne a má vlastní zákony, bohy a vojsko. Řek se představoval jménem své obce.
- **Pramen k výkladu:** SEP Aristotle's Political Theory (city-state, ústava obce); věta o představování je z profilu Diogena (atlas, ověřeno v podkladech celku 2).
- **Příklad:** Kdyby si tvůj kraj sám psal zákony, měl vlastní armádu a vlastní svátky, byl by obcí v řeckém smyslu.
- **Prameny:** https://plato.stanford.edu/entries/aristotle-politics/

### 16. tyran
- **Původ:** tyrannos, „samovládce, neomezený zákonem ani ústavou“ (LSJ: „an absolute ruler, unlimited by law or constitution“).
- **Vysvětlení:** Řekové tak říkali vládci, který se nikomu nezodpovídal, i kdyby vládl mírně. Aristotelés tyranidu řadil k pokaženým ústavám: vládne v ní jeden, a ne pro obec.
- **Pramen k výkladu:** SEP Aristotle's Political Theory (šest ústav, Politika III, 7: tyranida jako úchylka království).
- **Příklad:** Kapitán týmu, kterého nikdo nezvolil, sám určuje pravidla a nikdo ho nemůže sesadit.
- **Prameny:** LSJ https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0057:entry=tu%2Frannos, https://plato.stanford.edu/entries/aristotle-politics/

### 17. věštírna
- **Původ:** manteion, od mantis „věštec“ (LSJ: „oracle“).
- **Vysvětlení:** Svatyně, kde se lidé ptali boha na radu a odpovídala kněžka nebo kněz. Nejslavnější byla Apollónova věštírna v Delfách a její odpovědi se musely vykládat.
- **Pramen k výkladu:** SEP Socrates (věštírna Apollóna v Delfách, Obrana 20e–23b); výklad odpovědi je v atlasu doložený u Sókrata i Diogena (ražba).
- **Příklad:** Jako kdyby ses před přijímačkami zeptal někoho, kdo vidí do budoucnosti, a dostal odpověď, které musíš porozumět sám.
- **Prameny:** https://plato.stanford.edu/entries/socrates/

### 18. v naší moci
- **Původ:** ef’ hēmin, „na nás, u nás“ (SEP Ancient Theories of Freedom: „up to us (eph’ hemin)“; IEP Epictetus, Rozpravy I, 22).
- **Vysvětlení:** Epiktétos dělil věci na dvě půlky: na nás záleží naše soudy, chtění a odpor, nezáleží tělo, majetek a pověst. O první se máme starat, druhou přijímat.
- **Pramen k výkladu:** Příručka 1 (citát v datech cesty Co mám ve svých rukou?), IEP Epictetus.
- **Příklad:** Jestli tě učitel zítra vyvolá, v moci nemáš. Jestli se připravíš, ano.
- **Prameny:** https://iep.utm.edu/epictetu/, https://plato.stanford.edu/entries/freedom-ancient/

### 19. soud
- **Původ:** dogma, „co se komu zdá, mínění“ (LSJ: „that which seems to one, opinion or belief“).
- **Vysvětlení:** Ne soud u soudu, ale úsudek, který si o věci uděláš: že je strašná, nespravedlivá nebo že ji musíš mít. Stoikové učili, že se dá prozkoumat a opravit.
- **Pramen k výkladu:** SEP Epictetus: „If we correct our judgments, our feelings will be corrected as well“ (Rozpravy I, 11, 28–33).
- **Příklad:** Kamarád ti neodepsal. Fakt je jen to, že zpráva zůstala bez odpovědi; že tě ignoruje, je už tvůj soud.
- **Prameny:** https://plato.stanford.edu/entries/epictetus/
- Lístek stojí v kroku vedle citátu „Lidi neznepokojují věci, ale jejich soudy o věcech“; vysvětlení proto citát neopakuje.

### 20. lhostejné věci
- **Původ:** adiafora, „co se neliší“ (LSJ: „not different“).
- **Vysvětlení:** Stoikové tak říkali zdraví, penězům i pověsti: samy nejsou dobré ani zlé, rozhoduje, jak s nimi naložíš. Lhostejné neznamená, že na nich nezáleží; zdraví je lepší si přát než nemoc.
- **Pramen k výkladu:** SEP Stoicism, 4.3: „neither good nor bad … indifferent (adiaphora)“ a upřednostňované lhostejné věci (proēgmena).
- **Příklad:** Nový telefon tě neudělá lepším ani horším člověkem. Záleží na tom, k čemu ho použiješ.
- **Prameny:** https://plato.stanford.edu/entries/stoicism/

### 21. osud
- **Původ:** řecký termín stoiků (heimarmenē) jsem v LSJ ani v SEP nenašel, proto pole zůstává prázdné (do `k-overeni.md`).
- **Vysvětlení:** Pro stoiky řetěz příčin, ve kterém má všechno, co se stane, svou příčinu. Chrýsippos přesto učil, že na nás záleží: některé věci jsou osudem spojené s tím, co uděláme sami.
- **Pramen k výkladu:** SEP Stoicism (Chrýsippos, „co-fated“: zavolání lékaře, jeho příchod a uzdravení).
- **Příklad:** Řekneš, že uzdravení je „dané osudem“. Chrýsippos by dodal: i to, že zavoláš lékaře.
- **Prameny:** https://plato.stanford.edu/entries/stoicism/, https://plato.stanford.edu/entries/freedom-ancient/
- **Výskyty:** stoicismus, Seneca (osud rozhoduje, kdo je otrokem). Diogenés, Epikúros, Kolik je dost? 7 a Proč se bát smrti? 9 mají osud v běžném smyslu: nejsou ve výskytech.

### 22. příčina
- **Původ:** aitia, původně „vina, odpovědnost“ (LSJ: „responsibility … guilt, blame“).
- **Vysvětlení:** Aristotelés rozeznal čtyři odpovědi na otázku proč: z čeho věc je, jaký má tvar, kdo nebo co ji udělal a k čemu je. Až dohromady podle něj věc vysvětlí.
- **Pramen k výkladu:** SEP Aristotle on Causality, 2. („four causes“, bronzová socha).
- **Příklad:** Proč máš na sobě mikinu? Je z bavlny, má kapuci, koupila ti ji máma a je ti v ní teplo. Čtyři pravdivé odpovědi.
- **Prameny:** https://plato.stanford.edu/entries/aristotle-causality/

### 23. atom
- **Původ:** atomos, „neřezaný, nedělitelný“ (LSJ: „uncut“); SEP Ancient Atomism („indivisible“).
- **Vysvětlení:** Démokritos a po něm Epikúros učili, že svět se skládá z nepatrných těles, která se už dál dělit nedají, a z prázdna mezi nimi. Dnešní atom se dělit dá, jméno mu zůstalo po nich.
- **Příklad:** Krájíš chleba na půlky, pak zas a zas. Démokritos si myslel, že jednou narazíš na kousek, který už rozříznout nejde.
- **Prameny:** https://plato.stanford.edu/entries/atomism-ancient/, https://plato.stanford.edu/entries/democritus/

### 24. látka
- **Původ:** hylē, původně „les, dřevo“ (LSJ: „forest, woodland“); počátku všeho říkali archē, „počátek“ (LSJ: „beginning, origin“).
- **Vysvětlení:** To, z čeho věc je, jako bronz u sochy. První filozofové hledali jedinou látku, ze které vzniká všechno: Thalés říkal, že je to voda.
- **U koho co:** Milétští: archē jako jedna látka (IEP Thales: „the nature, the archê … water“). Aristotelés: látka jako jedna ze čtyř příčin (SEP Aristotle on Causality). Stoikové: látka v nás teče a jedinec trvá (atlas, Jsem pořád tentýž? 8, Plútarchos v `zdroje.yaml`).
- **Příklad:** Kostky lega jsou látka hradu. Když hrad rozebereš a postavíš loď, látka zůstane stejná.
- **Prameny:** https://iep.utm.edu/thales/, https://plato.stanford.edu/entries/aristotle-causality/

### 25. rozum (logos)
- **Původ:** logos, „slovo, řeč, výpočet, důvod“ (LSJ: podstatné jméno od legein); Platónova rozumová část duše je logistikon.
- **Vysvětlení:** Schopnost uvažovat a dávat důvody, kterou mnozí řečtí filozofové měli za to, co dělá člověka člověkem. Platón z něj dělá vládce duše, stoikové rozum, který prostupuje celý svět.
- **U koho co:** Platón: rozum (logistikon) má vládnout hněvu a žádostivosti (SEP Plato's Ethics). Stoikové: bůh jako „eternal reason (logos)“ prostupující kosmos (SEP Stoicism, 2.).
- **Příklad:** Když se v hádce zastavíš a zeptáš se, proč to vlastně tvrdíš, pouštíš ke slovu rozum.
- **Prameny:** https://plato.stanford.edu/entries/plato-ethics/, https://plato.stanford.edu/entries/stoicism/

### 26. religionistika
- **Původ:** z latinského religio, původně „svědomitost“ (SEP The Concept of Religion: religio jako svědomitost).
- **Vysvětlení:** Obor, který náboženství zkoumá zvenku: jak lidé věří, slaví a vyprávějí posvátné příběhy. Religionista se ptá, co náboženství lidem dává a jak funguje, ne jestli má pravdu.
- **Pramen k výkladu:** úvod Co je náboženství? a jeho podklady (`docs/podklady/nabozenstvi-uvod.md`); SEP The Concept of Religion.
- **Příklad:** Jako sociolog, který zkoumá fanoušky fotbalu: nezajímá ho, který klub je nejlepší, ale co lidi táhne na stadion.
- **Prameny:** https://plato.stanford.edu/entries/concept-religion/

## Nové zdroje v `zdroje.yaml`

`sep-plato-ethics`, `sep-aristotle-psychology`, `sep-atomism-ancient`, `iep-meno` a `lsj` (slovník, celý). Ostatní hesla už v datech byla.

## Otevřené

- **Řecký termín pro osud** (heimarmenē) není ověřený: v LSJ na Perseu jsem heslo nenašel, SEP ho neuvádí. Do té doby pojem osud nemá původ (`docs/podklady/k-overeni.md`).
- **Ataraxia, apatheia, logos, elenchos, eudaimonia, akrasia** zůstávají jen v původu a v tvarech pro hledání; do textů je atlas nevkládá (texty se teď nemění, rozhodnutí autora z 12. 11. 2026).
