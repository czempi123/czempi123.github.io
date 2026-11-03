# Podklady: antika-doplnky, filozofická část (P6)

Ověřeno 1. 11. 2026 skillem `atlas-overeni`. Celek: Co je filozofie?, období 1 a 2, směry stoicismus, epikureismus, kynismus a Akademie, otázky 2 a 8, pokusy Gygův prsten a Zrcadlo, cesta 6 (krok 4) a vztahy v datech. Náboženství má vlastní list (P6N).

## Co jsem četl sám a co ne

**Četl jsem sám** (celý text místa, ne úryvek z vyhledávače; soubory z PerseusDL na GitHubu, stažené na Mac mimo repozitář):

- Aristotelés, Metafyzika I, 2 (982b11–22) a I, 3 (983b6–984a3, anglicky i řecky); Politika I, 11 (1259a) a III, 11 (1281a–b, 1282a; anglicky i řecky u 1281b).
- Platón, Theaitétos 155d a 174a–b (řecky i anglicky); Obrana 19b–c; Kritón 48b–50a; Ústava I 331c–d (řecky i anglicky), VI 488–489c (489a řecky); Prótagorás 320c–323a (322c–d řecky i anglicky).
- Hérodotos I 74 (zatmění) a I 75 (Thalés u Halyu); Hésiodos, Theogonie (kyklopové, anglicky); Aristofanés, Oblaka 218–226 a 373–394 (řecky).
- Diogenés Laertios (anglicky, R. D. Hicks): I 23–24 a 34, IV 62, V 35–39, VI 20–21, VII 1–4 a 183, X 10–11, X 119, X 139–153 (Hlavní myšlenky); Hlavní myšlenka 14 i řecky.
- Marcus Aurelius, Hovory VI, 54 (řecky); Epikúrovy Vatikánské výroky 58 a 63 (řecky, First1KGreek).
- SEP „Theophrastus“ (úvod), „Carneades“ (poselstvo, Chrýsippos), „Buddha“, „Laozi“; IEP „Anaximander“ (blesk); NOAA „Understanding Lightning: Thunder“ (weather.gov); Gellius, Noci na Attice VI, 14 (anglicky).
- Hotové citáty v `src/data/zdroje.yaml` a počty jejich použití v `src/content` (spočítáno skriptem 1. 11. 2026).

**Nečetl jsem:** Britannicu (curl ji nepustí), Plútarchova Catona Staršího, Aëtia, Cicerovu Republiku III, Žalm 29 v českém překladu, nic o Beethovenově Pastorální, nic o Buddhovi mimo SEP, Epikúrův dopis Polyainovi, RVP G (odkaz a znění jsou převzaté z `docs/architektura.md`), Cicero Tuskulské hovory V (původ slova „filozofie“ u Pýthagory). Co z toho se v podkladech objeví, je výslovně označeno jako neověřené.

Anglické překlady v Perseu: Tredennick (Metafyzika), Rackham (Politika), Shorey (Ústava), Lamb (Prótagorás), Fowler (Theaitétos a Kritón), Godley (Hérodotos), Hicks (Diogenés Laertios), Evelyn-White (Hésiodos), Rolfe (Gellius). Česká znění níže jsou vlastní převody z řeckého nebo latinského textu a z těchto překladů.

## Shrnutí: co je nejsilnější a co se změnilo

Nejsilnější příběhy:

1. **Thalés padá do studny, jeho lisy na olivy** (Platón, Aristotelés): jedna scéna o posměchu a o tom, k čemu je filozofie.
2. **Sókratés v koši v Oblacích a o čtyřiadvacet let později před soudem** (Aristofanés, Platón, Obrana 19b–c): komedie, ve které diváci poznali, že se v Athénách hledají důvody, proč hřmí.
3. **Tři filozofové jako vyslanci v Římě roku 155 př. n. l.** (Gellius VI, 14): filozofie přijíždí do Říma jako delegace.
4. **Mobil přes noc** (moderní podoba Platónova příkladu o zbrani, kterou chce zpátky šílený přítel, Ústava I 331c–d): úvodní případ otázky 2.
5. **Zénón: ztroskotání, knihkupectví a „Jdi za tím mužem“** (Diogenés Laertios VII, 2–3).
6. **Diogenés, mince a Antisthenova hůl** (Diogenés Laertios VI, 20–21): „Tluč, nenajdeš dost tvrdé dřevo“.
7. **Kormidelník, kterého námořníci nazvou hvězdopravcem** (Ústava VI 488–489a): totéž nadávka jako ta, kterou dostal Thalés.

Co mění plán větve:

- **Tři z „pěti chybějících vztahů“ v datech už jsou.** `vztahy.yaml` má od 29. 9. 2026 `sokrates → chairefon` a `sokrates → kriton` (`znali-se`) a od 2. 10. 2026 `karneades → chrysippos` (`polemika`). Dva životy je ale nečte, protože `vychoziDvojice` bere jen `ucitel`, `zak` a `vliv-textem`. Co opravdu chybí, je `vliv-textem` Chrýsippos → Karneadés a `ucitel` Aristotelés → Theofrastos (viz g).
- **Hrom jako otázka pokusu má proti sobě vlastní scénu období 1:** Oblaka 423 vyprávějí o hromu taky. Proto navrhuju scénu období 1 z jiné části komedie (Sókratés v koši, ne hrom), viz b.
- **Cesta 6, krok 4:** nejde vyměnit jen citát. Navazující věty o „chlebu a vodě“ jsou taky o jídle, viz f.
- **Zrcadlo je o smrti.** Jako samostatná stránka „vhodná na začátek hodiny“ potřebuje stejná opatření jako cesta 8 (viz e a Otevřené otázky).

## a) Co je filozofie?

### Thalés: co je doložené a co tradované

Thalés nic jistě nenapsal (Diogenés Laertios I, 23: „podle jiných“ jen dva spisy o slunovratu a rovnodennosti), takže všechno, co o něm víme, je podání pozdějších autorů. Nejstarší jsou Hérodotos (asi 150 let po něm) a Platón a Aristotelés (asi dvě stě let po něm). IEP „Thales“ dává roky asi 620–546 př. n. l.; v datech jsou.

| # | Tvrzení | Typ | Zdroj a místo | Doporučená formulace pro studenty |
| --- | --- | --- | --- | --- |
| 1 | Aristotelés nazývá Thaléta zakladatelem „tohoto druhu filozofie“: hledání jedné látky, která trvá a ze které je všechno ostatní | doložené jako Aristotelův výrok | Metafyzika I, 3, 983b6–21 | „Aristotelés po dvou stech letech řekl, že tohle přemýšlení začal Thalés.“ |
| 2 | Podle Aristotela Thalés tvrdil, že tou látkou je voda a že země na vodě plave | doložené jako Aristotelův výrok | Metafyzika I, 3, 983b20–22 | „Thalés prý učil, že všechno je voda.“ |
| 3 | Důvod, proč voda: Aristotelés hádá („snad“, řecky *ísós*), že vzal v úvahu, že výživa všeho je vlhká, teplo vzniká z vlhka a semena mají vlhkou přirozenost | Aristotelova domněnka, ne Thalétovo znění | Metafyzika I, 3, 983b22–27 | „Aristotelés soudí, že k tomu Thalés došel pozorováním: všechno živé potřebuje vlhko a semena jsou vlhká.“ |
| 4 | Že šlo o rozchod s mýtem, Aristotelés nepotvrzuje: dávní básníci dělali Okeana a Téthys rodiči všeho a bohové přísahali vodou Stygy; Aristotelés dodává, že není jisté, jestli je tohle mínění staré, a že „se říká“, že to byl Thalétův názor | sporné; Aristotelés sám váhá | Metafyzika I, 3, 983b27–984a3 | Nepsat „Thalés opustil mýtus“. Psát: „Voda jako počátek znali už básníci. Nové bylo, že se pro ni hledal důvod, který si může ověřit každý.“ (viz poznámka pod tabulkou) |
| 5 | Thalés předpověděl Iónům zatmění Slunce, které přerušilo bitvu Lýdů s Médy: „stanovil rok, ve kterém se to opravdu stalo“ | Hérodotos to podává jako fakt; jak to Thalés dokázal, je sporné, a někteří badatelé předpověď zpochybňují | Hérodotos I, 74, 2 | „Hérodotos vypráví, že Thalés Iónům předpověděl, že se den obrátí v noc.“ |
| 6 | Zatmění odpovídá 28. 5. 585 př. n. l. | většinový výklad (jiná data se navrhují, ale jen tento se hodí místem a viditelností); NASA (F. Espenak) ho vede jako zatmění č. −0584; stránku NASA jsem neotevřel, vycházím z Wikipedie a ze Summersova článku | Wikipedia „Eclipse of Thales“, Leloux 2016 (Polemos 19/2) | V datech „asi 585 př. n. l.“, ne konkrétní den |
| 7 | Thalés padl do studny, protože se díval na hvězdy; posmála se mu služebná | tradovaný příběh; dvě verze: Platón (thrácká služebná, studna) a Diogenés Laertios (stařena, příkop) | Theaitétos 174a–b; Diogenés Laertios I, 34 | „Vypráví se, že…“, verze Platónova. Platón z toho dělá obecný vtip na filozofy (174a–b) |
| 8 | Thalés z hvězd předpověděl bohatou úrodu oliv, zaplatil zálohy na všechny lisy v Milétu a na Chiu, v sezoně je pronajal draho a ukázal, že filozofové by mohli zbohatnout, kdyby chtěli | tradovaný příběh; Aristotelés má „prý“ a dodává, že jde o obecný obchodní trik (monopol) | Politika I, 11, 1259a6–18 | „Vypráví se, že…“ |
| 9 | Aristotelés zná příběh jako odpověď na výtku, že filozofie je k ničemu (Thalés byl chudý) | doložené jako Aristotelovo podání | Politika I, 11, 1259a6–9 | Motiv „k čemu je filozofie“ patří do scény o studni a lisech |

**Poznámka k řádku 4.** Doporučená formulace je moje: výraz „důvod, který si může ověřit každý“ drží jen první polovinu (Aristotelés opravdu uvádí pozorovatelné důvody), druhou (že si je ověří každý) přidává výklad. T1 ji může psát tak, nebo ji zjednodušit na „Voda jako počátek znali už básníci. Thalés k ní prý přidal důvod.“ Slovo „první“ u Thaléta nepoužívat bez Aristotela: tvrdí jen, že je zakladatel „tohoto druhu“ (983b20).

**Co nepoužít.** Slovo *filosofia* a Pýthagoras jako ten, kdo si první řekl *filosofos* (Diogenés Laertios I, 12; Cicero, Tuskulské hovory V, 8–9): nečetl jsem, nepoužít. „Thalés je první filozof“ jako holá věta: Aristotelés to takhle neříká.

### Citáty (a)

| # | Znění v atlasu | Autor, dílo, místo | Překlad | Poznámka |
| --- | --- | --- | --- | --- |
| 1 | „Thalés, zakladatel tohoto druhu filozofie, říká, že je to voda.“ | Aristotelés, Metafyzika I, 3, 983b20–21 | vlastní převod podle řeckého textu a Tredennicka; řecké znění `original` doplní T1 ze souboru | nový, `metafyzika-983b`; v atlasu 0× |
| 2 | „Kdo žasne a neví si rady, cítí, že neví. Proto je milovník mýtů svým způsobem filozof, protože mýty se skládají z divů.“ | Aristotelés, Metafyzika I, 2, 982b17–19 | vlastní převod podle Tredennicka; řecké znění doplní T1 | nový, `metafyzika-982b`; 0×. Závorka „(protože mýty jsou složeny z divů)“ je u Aristotela v závorce, tedy jeho poznámka |
| 3 | „Údiv je vlastní filozofovi. Filozofie totiž nemá jiný počátek než tenhle.“ | Platón, Theaitétos 155d; mluví Sókratés | vlastní převod podle Fowlera; řecké znění doplní T1 | nový, `theaitetos-155d`; 0×. Hned za tím Sókratés říká, že kdo Iris nazval dcerou Thaumanta (Údiv), „dobře určil rodokmen“; Hésiodos |
| 4 | „Thalés prý při pozorování hvězd, jak se díval vzhůru, spadl do studny, a hezká a vtipná thrácká služebná se mu vysmála: tak moc chce znát, co je na nebi, že nevidí, co má před nohama.“ | Platón, Theaitétos 174a; vypráví Sókratés | vlastní převod z řeckého textu (Θαλῆν ἀστρονομοῦντα … πεσόντα εἰς φρέαρ, Θρᾷττά τις ἐμμελὴς καὶ χαρίεσσα θεραπαινίς) | nový, `theaitetos-174a`; 0×. Platón dodává (174a–b), že totéž platí o všech, kdo žijí filozofií |
| 5 | „Thalés prý předvídal z hvězd bohatou úrodu oliv: v zimě zaplatil zálohy na všechny lisy v Milétu a na Chiu, a když přišla sezona, pronajímal je, jak chtěl. Ukázal tím, že filozofům by bohatnutí šlo, kdyby chtěli, ale o to jim nejde.“ | Aristotelés, Politika I, 11, 1259a6–18 | vlastní převod podle Rackhama; skráceno | nový, `politika-1259a`; 0×. Lépe parafrází než citátem (je dlouhý) |
| 6 | „Thalés z Milétu předpověděl Iónům, že se den změní v noc, a stanovil rok, ve kterém se to opravdu stalo.“ | Hérodotos, Dějiny I, 74, 2 | vlastní převod podle Godleye | nový, `herodotos-i-74`; 0×. Pramen `herodotos-64` už v datech je (jiné místo) |

### Rozlišení mýtu, náboženství, filozofie, vědy a umění (pracovní znění pro T1)

Rozlišení je moje, není z jednoho pramene. Z pramenů drží Aristotelovo „milovník mýtů je svým způsobem filozof“ (Metafyzika I, 2) a Platónův údiv jako počátek filozofie, a ty obě věty říkají, že hranice jsou propustné. RVP G očekává, že student „porovná východiska filozofie, mýtu, náboženství, vědy a umění k uchopení skutečnosti a člověka“ (převzato z `docs/architektura.md`, neotevřeno znovu).

| | Co dělá | Jak odpovídá | Na čem stojí odpověď |
| --- | --- | --- | --- |
| **Mýtus** | vypráví, jak vznikl svět a řád, kdo za čím stojí | příběhem se jmény a činy | vyprávění, které se předává ve společenství |
| **Náboženství** | žije ve vztahu k posvátnému: obřad, modlitba, společenství, tradice | obřadem a životem uvnitř tradice (mýtus je jedna jeho součást) | zkušenost, tradice a důvěra; o pravdivosti tady atlas nerozhoduje (to je otázka 9) |
| **Filozofie** | ptá se na důvody, i na to, co všichni berou jako samozřejmé | argumentem, který smí kdokoli zkoumat a napadnout | důvody |
| **Věda** | zkoumá, jak věci jsou, a odpovědi ověřuje | pozorováním, měřením, pokusem a opakováním jinými | ověření, které si smí zopakovat kdokoli; vyrostla z filozofie |
| **Umění** | ukazuje a nechává prožít | obrazem, tónem, příběhem | zážitek; neptá se, jestli je to pravda, ale jaké to je |

Mantinely, ať stránka neodporuje budoucímu **Co je náboženství?** (T2 čte oba texty vedle sebe, viz zadání T2):

- **Nepsat** „mýtus je vymyšlený příběh“ ani „náboženství je víra bez důkazů“ ani „filozofie je rozumnější“. Každé z toho je soud, o kterém má rozhodovat otázka 9, ne úvodní stránka.
- **Mýtus a náboženství jsou ve stránce o filozofii dva různé pojmy**: mýtus je příběh, náboženství je celý život kolem něj (obřad, společenství). Stejné dělení musí mít Co je náboženství? (P6N: posvátné, mýtus, rituál, společenství).
- Řecký mýtus v pokusu stojí **za sebe, ne za dnešní náboženství**. Student věřící nesmí z pokusu odnést, že jeho tradice je „taky mýtus“.

### Pokus: pět odpovědí na tutéž otázku

Otázka z plánu: **Proč hřmí?** Student dostane pět krátkých odpovědí bez štítků a třídí je podle toho, *jak* odpovídají, pak teprve přečte rozlišení.

| Hlas | Odpověď (zkráceně) | Zdroj | Stav |
| --- | --- | --- | --- |
| Mýtus | Zeus je pán hromu a blesku; dostal je od kyklopů | Hésiodos, Theogonie (kyklopové, kteří „dali Diovi hrom a udělali blesk“, v. 139–141; Zeus „držící blesk a zářící hromový klín“, v. 71–72) | četl jsem anglicky (Evelyn-White); čísla veršů z paměti, neověřená v souboru, T1 je ověří |
| Náboženství | Hrom jako hlas Boha | doporučuji Žalm 29 („Hlas Hospodinův nad vodami, Bůh slávy hřímá“) | **neověřeno**: český text nečten; P6N dodá z podkladů k judaismu, ať stránky nepoužívají dva různé překlady |
| Filozofie | Anaximandros: blesk je záblesk světla na tmavém mraku | IEP „Anaximander“: „Lightning … is a momentary flash of light against a dark cloud“ | čteno (IEP). Zprávu Aëtia III, 3, 1–2, že hrom i blesk vznikají z větru uvězněného v mraku, jsem nečetl: nepoužít |
| Věda | Hrom je zvuk způsobený bleskem; výboj prudce ohřeje vzduch, ten se rozpíná a zase smršťuje | NOAA, weather.gov „Understanding Lightning: Thunder“ (kanál blesku až asi 27 800 °C; 50 000 °F podle zdroje) | **ověřeno** |
| Umění | Beethoven, 6. symfonie „Pastorální“, 4. věta Bouře (1808) | — | **neověřeno** (Beethoven-Haus Bonn nebo Britannica); T1 ověří, nebo vymění |

**Rozhodnutí P6.** Ponechávám „Proč hřmí?“, jak navrhla architektura, ale pět řádků vyjde jako pět *druhů* odpovědi, ne pět stupňů: věda tu mluví zřetelně nejpřesněji a student si z toho snadno odnese pořadí, které stránka tvrdit nechce. Ať pokus řekne, co každý hlas umí a co mu uniká (věda nepoví, proč se bát nebo děkovat; mýtus nepoví, odkud ten zvuk skutečně přichází). **Alternativa** s menším rizikem pořadí: „Odkud se vzal svět?“ (Hésiodos o Chaosu, Genesis 1, Thalés a voda, velký třesk, jeden obraz): neověřeno a delší; navrhuju ji, jen kdyby autor chtěl otázku, na kterou věda nemá ani hlavní slovo. Bonus: Aristofanés v Oblacích (373–394) dává hromu přírodní vysvětlení z Sókratových úst (mraky plné vody do sebe narážejí) a zesměšňuje ho; poslouží stránce období 1, ne pokusu (viz b).

### Disciplíny k deseti otázkám

Tabulka je z `docs/architektura.md` (sloupec Disciplína), „pro studenta“ jsou návrhy vět pro T1.

| # | Otázka | Disciplína | Pro studenta (návrh) |
| --- | --- | --- | --- |
| 1 | Jak mám žít? | Etika, dobrý život a štěstí | Co je dobrý život a co k němu patří |
| 2 | Co je správné a co dlužím druhým? | Etika, morálka | Co smím a nesmím a komu co dlužím |
| 3 | Má život smysl? | Existenciální filozofie, smrt | K čemu to všechno, když to skončí |
| 4 | Jsem svobodný? | Metafyzika svobody, odpovědnost | Kolik z toho, co dělám, je opravdu moje |
| 5 | Kdo vlastně jsem? | Já, identita, mysl, vědomí | Co mě dělá mnou, i když se měním |
| 6 | Co je skutečné? | Metafyzika, ontologie | Co je za tím, co vidím |
| 7 | Jak poznám, co je pravda? | Teorie poznání, věda, argumentace | Komu a čemu věřit a proč |
| 8 | Jak spolu máme žít? | Politická filozofie, spravedlnost, moc | Kdo má rozhodovat a co si lidé dluží |
| 9 | Je Bůh? | Filozofie náboženství, víra a rozum | Co lze o Bohu říct rozumem a co věrou |
| 10 | Proč nás něco dojímá? | Estetika, krása a umění | Co dělá krásu krásou |

Podle architektury (oddíl Vazba na RVP G; znění MŠMT z února 2026 jsem neotevřel) pracuje oborová příloha Kompetenčního rámce s disciplínami etika, teorie poznání, metafyzika, filozofie společnosti a filozofie náboženství. Otázka 10 (estetika) mezi nimi není: stránka ji zmíní bez RVP.

## b) Období 1 a 2

### Úvodní scéna období 1: Oblaka (423 př. n. l.) a Obrana (399 př. n. l.)

Skutečná událost: komedie Oblaka je v datech (`udalosti.yaml`, `oblaka`, −423, zdroj `sep-socrates`). Přečetl jsem řecký text scény (218–226) a Platónovu Obranu 19b–c.

| # | Tvrzení | Typ | Zdroj a místo | Doporučená formulace |
| --- | --- | --- | --- | --- |
| 1 | V Aristofanových Oblacích najde Strepsiadés Sókrata, jak visí v koši; Sókratés mu na otázku, co dělá, odpoví „kráčím po vzduchu a obhlížím slunce“ (řecky *aerobató kai periphronó ton hélion*) | doložený text hry | Oblaka 218–226 | „Na jevišti visel v koši muž jménem Sókratés a na otázku, co dělá, odpověděl: ‚Kráčím po vzduchu a obhlížím slunce.‘“ |
| 2 | Sókratés před soudem o té komedii mluví: „sami jste v Aristofanově komedii viděli“, jak „jakýsi Sókratés“ prohlašuje, že kráčí po vzduchu, a dodává, že o tom nic neví | doložený text Obrany; Platón nechává mluvit Sókrata | Obrana 19b–c | „O čtyřiadvacet let později o tom Sókratés mluvil před soudem.“ (423 → 399 = 24 let) |
| 3 | Aristofanův Sókratés vysvětluje hrom mraky plnými vody, které do sebe narážejí; Strepsiadés se diví, že to není Zeus (373–381) | doložený text hry; je to karikatura, ne věrné podání Sókratových názorů | Oblaka 373–381 (řecky čteno) | zahrnout jen jednou větou, nebo vůbec; hrom patří do pokusu v Co je filozofie? |

**Doporučení.** Scéna období 1 = **košík**, ne hrom: „V Athénách se roku 423 př. n. l. hrála komedie, ve které visel v koši muž jménem Sókratés a prohlašoval, že kráčí po vzduchu. Diváci se smáli, protože věděli, o čem je řeč: i v Athénách už se hledaly vysvětlení, která nepotřebovala bohy. O čtyřiadvacet let později…“ Věta o „vysvětleních bez bohů“ je výklad z mé hlavy; pramen drží jen Obrana (Sókratés sám říká, že viděli, co viděli) a SEP (Oblaka jako zdroj starého pomlouvání: `sep-socrates`). T1 ji formuluje tak, aby tvrdila jen to, co drží.

**Záložní scéna:** zatmění u Halyu (Hérodotos I, 74, 2; viz a, řádky 5–6), „bitva, kterou zastavil den proměněný v noc“. Hodí se na úvod období 1 doslova (počátky), ale Thalés by pak byl v Co je filozofie? a na stránce období dvakrát; zvolit jen jednu.

### Úvodní scéna období 2: poselstvo tří filozofů v Římě (155 př. n. l.)

V datech je (`karneades-v-rime`, −155, `sep-carneades`).

| # | Tvrzení | Typ | Zdroj a místo | Doporučená formulace |
| --- | --- | --- | --- | --- |
| 1 | Athéňané poslali do Říma filozofy jako vyslance, aby senát přesvědčili, ať jim odpustí pokutu za vyplenění Oropu (asi pět set talentů): Karneada z Akademie, stoika Diogena a peripatetika Kritolaa | doložený fakt | Gellius, Noci na Attice VI, 14; SEP „Carneades“ | „Roku 155 př. n. l. přijeli do Říma tři filozofové jako vyslanci Athén.“ |
| 2 | Do senátu mluvili s tlumočníkem (senátor Gaius Acilius); před tím každý zvlášť přednášel pro posluchače; Rutilius a Polybios prý uvádějí, že všichni tři vzbudili obdiv, každý jinak: Karneadés prudce, Kritolaos hladce, Diogenés střídmě | doložené jako Gelliovo podání, Gellius se odvolává na Rutilia a Polybia | Gellius VI, 14 | „Každý z nich mluvil jinak: Karneadés se strhující silou, Diogenés střízlivě, Kritolaos uhlazeně.“ |
| 3 | Karneadés prý v Římě přednášel dva dny po sobě: nejdřív hájil spravedlnost, pak ji vyvracel | **tradovaný příběh**: všechny prameny jsou mnohem pozdější a SEP uvádí, že se pochybuje o všech částech příběhu včetně toho, že přednášky byly | SEP „Carneades“ (Drecoll 2004, Powell 2013) | „Vypráví se, že…“; pro otázku 2 jako oblouk na Karneadovu desku (později) |
| 4 | Karneadés byl před rokem 155 hlavou Akademie | doložený fakt | SEP „Carneades“ | — |
| 5 | Cato Starší žádal, ať se filozofové z Říma co nejdřív pošlou pryč | **nečteno** (Plútarchos, Cato Starší 22) | — | nepoužít |

### Otázky doby

Z mapy otázek a období v `docs/architektura.md`; všech deset antických cest existuje.

| Období | Otázky doby (číslo cesty z katalogu) |
| --- | --- |
| 1 | 7 Jak poznám pravdu (cesta 1); 5 Kdo vlastně jsem (cesta 2); 6 Co je skutečné (cesta 3); 1 Jak mám žít (cesta 4); nově 2 a 8 (Platón, Prótagorás, Sókratés) |
| 2 | 1 Jak mám žít (cesty 6, 7, 34); 4 Jsem svobodný (cesta 5); 3 Má život smysl (cesty 8, 33); nově 2 a 8 (Epikúros, Marcus Aurelius, Diogenés) |

### Chybějící kotvy v `udalosti.yaml`

Dnes má období 1 deset kotev (první je rok 492 př. n. l.) a období 2 pět kotev (od 306). Osa kotev bude mít v období 1 mezeru 650–492, v období 2 mezeru 306–155 a 161–476. Návrhy, vždy se stavem ověření:

| Kotva | Rok | Zdroj | Stav |
| --- | --- | --- | --- |
| Bitva u Halyu, zatmění Slunce (Thalés) | −585 | Hérodotos I, 74; Wikipedia „Eclipse of Thales“ (NASA se odkazuje na Espenaka, neotevřeno) | text Hérodota **ověřen**; rok většinový výklad, v datech `priblizne: true`; `druh: kotva`, období 1 |
| Poselstvo filozofů v Římě | −155 | už v datech (`sep-carneades`) | doporučuji přidat druhý pramen `gellius-vi-14` (nový pramen v `zdroje.yaml`, viz Návrh dat) |
| Sókratův proces | −399 | už v datech | — |
| Kleisthenovy reformy, Alexandrova smrt, Alexandrijská knihovna, dobytí Řecka Římem (146), zavření athénských škol (529) | | Britannica, Pleiades | **nečteno**, nepřidávat bez ověření; doporučuji v T1 jen Halys, ostatní nechat |

### „Mezitím jinde“ u období 1 (jednou dvěma větami, bez nových osob v datech)

Konfucius je v datech jako medailonek (`konfucius`, 551–479 podle tradice, `sep-confucius`); Buddha a Lao-c’ v datech nejsou a nepřibývají.

| # | Tvrzení | Typ | Zdroj a místo | Doporučená formulace |
| --- | --- | --- | --- | --- |
| 1 | Konfucius žil tradičně v letech 551–479 př. n. l. | přibližný fakt (tradiční data) | SEP „Confucius“ (v datech) | „Konfucius učil v Číně asi v době, kdy…“ |
| 2 | Buddha působil asi kolem roku 450 př. n. l.; dřív se jeho data kladla na 560–480, dnes mnozí badatelé říkají, že zemřel asi 405 př. n. l. | spor; SEP uvádí oba | SEP „Buddha“ | „Buddha učil v severní Indii v 5. století př. n. l.“ (bez roků) |
| 3 | Lao-c’ byl podle čínských pramenů současník Konfuciův z 6. století, podle některých badatelů je zcela legendární | sporné | SEP „Laozi“ | „Lao-c’, o kterém vypráví čínské prameny, že napsal krátkou knihu…“ (Vypráví se, že…) |

Doporučená věta pro T1: „Zatímco v Athénách přemýšleli o hromu a o spravedlnosti, v Číně učil Konfucius a v Indii Buddha; Lao-c’, kterému se připisuje kniha o cestě, je spíš legenda než známý člověk.“ Poslední polovina je výklad SEP „Laozi“ („some modern scholars … entirely legendary“), proto „spíš“. Okno s mapkou přijde s buddhismem a čínskou tradicí.

## c) Čtyři směry

Myšlenky a citáty jsou z velké části už v atlasu (cesty 5, 6, 7, 8, 33, 34 a portréty). Níže jsou jen scéna založení, tři myšlenky s pramenem, spor, Zkus to žít a rodokmen. U citátů uvádím id, která už v `zdroje.yaml` jsou; počty použití v atlasu a přesné znění vybere T1 (žádné z nich jsem pro tenhle krok nečetl znovu).

Pořadí směrů v tabulkách odpovídá dnešním souborům (`src/content/smery/`): stoicismus (10), kynismus (9), epikureismus (11), Akademie (6).

### Stoicismus

**Scéna založení (ověřeno, Diogenés Laertios VII, 2–3, anglicky čteno).** Zénón z Kitia se na cestě z Fénicie do Pireu s nákladem purpuru ztroskotal. V Athénách se posadil v knihkupectví, četl druhou knihu Xenofóntových Vzpomínek na Sókrata, líbila se mu a zeptal se, kde se takoví lidé jako Sókratés najdou. Zrovna šel kolem Kratés. Knihkupec ukázal a řekl: „Jdi za tím mužem.“ Typ: tradovaný příběh (zpráva Diogena Laertia, 6. století po události; Zénón v datech: vztah `krates → zenon-z-kitia` je `ucitel`, `xenofon → zenon-z-kitia` je `vliv-textem` s `tradovany: true`; stránka to už říká). Formulace: „Vypráví se, že…“. Zénónovi bylo tehdy (podle téhož místa) kolem třiceti. Název Stoy (malovaný sloup v Athénách) jsem nečetl: nepoužít, dokud ho T1 neověří (DL VII, 5 nebo SEP „Stoicism“).

| Myšlenka | Pramen | Hotové citáty |
| --- | --- | --- |
| Rozliš, co je v tvé moci a co ne | Epiktétos, Rukojeť 1; SEP „Epictetus“ | `rukojet-1`, `rukojet-1-5` |
| Jediným dobrem je ctnost; zdraví a bohatství jsou „lhostejná“, ale lze jim dát přednost | SEP „Stoicism“ 4.1 (`sep-stoicism`), Seneca O blaženém životě | `vita-beata-13`, `vita-beata-26` |
| Žít v souladu s rozumem a přírodou, i v tom, co je těžké | SEP „Stoicism“, Marcus Aurelius, Hovory | `hovory-x-16`, `hovory-vi-30` |

**Spor s epikurejci (ověřeno).** Stoikové říkají, že moudrý se bude podílet na veřejných věcech, pokud mu nic nebrání: „Stoikové tvrdí, že moudrý se bude zabývat politikou, pokud mu nic nebrání, a to proto, že tím zadržuje neřest a podporuje ctnost“ (Diogenés Laertios VII, 121 podle mé paměti, číslo oddílu neověřeno; text čten, odvolává se na Chrýsippa, O různých druzích života; parafráze). Epikúros podle téhož autora říká opak: moudrý se politikou zabývat nebude (X, 119; citát `dl-x-119` je z téhož místa, jiná věta). Spor se hodí i na otázku 8 (viz d). Jiné spory (o slast a ctnost) drží cesta 6.

**Zkus to žít:** místo nové výzvy odkaz na **Stoický týden** (`src/content/tydny/stoicky.yaml`); stránka směru mu dá vstup, a drobečky týdne se přepojí na `/smer/stoicismus/`.

**Kdo navazoval (z `vztahy.yaml`, nic nepřidávat kromě bodu g):** Kratés → Zénón (učitel), Zénón → Kleanthés → Chrýsippos (učitel), Musonius → Epiktétos (učitel), Epiktétos → Marcus (vliv textem), Kleanthés → Seneca a Hérakleitos → Kleanthés (vliv textem), Karneadés ↔ Chrýsippos (polemika), k tomu **návrh nového vztahu Chrýsippos → Karneadés** (viz g). Zajímavá věta, kterou nese Diogenés Laertios VII, 183 i SEP „Carneades“: „Kdyby nebylo Chrýsippa, nebylo by ani Stoy.“ (SEP: „If Chrysippus had not been, there would have been no Stoa“), a o Karneadovi (IV, 62): „Kdyby nebylo Chrýsippa, kde bych byl?“ (vzájemné žertování: Chrýsippos tvoří Stou, Karneadés žije z jejího vyvracení). Obě věty tradované.

### Epikureismus

**Scéna založení (ověřeno, Diogenés Laertios X, 10–11).** Epikúros koupil v Athénách zahradu (podle Apollodora za osmdesát min) a přátelé k němu přijížděli odevšad a bydleli s ním v ní. Epikúros zároveň nechtěl, aby měli majetek společný, jak žádal Pýthagorův výrok o majetku přátel: podle něj by to znamenalo nedůvěru, a bez důvěry přátelství není. Typ: doložený fakt (zahrada v datech: událost `epikurova-zahrada`, −306, `sep-epicurus`); nákup za osmdesát min podává Apollodoros. Formulace: „Koupil v Athénách zahradu, ve které s ním bydleli přátelé, kteří přijeli odevšad. Společný majetek nechtěl: kdo se bojí, že mu přítel něco vezme, není přítel.“ (Poslední věta je Diogenova parafráze Epikúrova důvodu „nedůvěra“, ne Epikúrova věta; T1 ji pustí s „podle něj“.) Zahradu a nápis nad její bránou má už cesta 6, krok 1 (`seneca-ep-21-10`, 1×): scéna směru se z té liší záměrně.

| Myšlenka | Pramen | Hotové citáty |
| --- | --- | --- |
| Slast je nebolet a nebát se; k tomu stačí málo, když víš, co potřebuješ | Epikúrův Dopis Menoikeovi, 130–132 | `menoikeus-131-slast`, `menoikeus-132`, `kd-15` |
| Smrt se nás netýká | Hlavní myšlenka 2 | `kd-2`, `vs-31` |
| Přátelství je to nejdůležitější, co moudrost přináší k šťastnému životu; spravedlnost je dohoda, že si neublížíme | Hlavní myšlenky 27, 31–35, 37; Vatikánské výroky 52 | `kd-27`, `vs-52`; nové `kd-31`, `kd-33`, `kd-34`, `kd-37` (viz d) |

**Spor:** s kyniky (cesta 6, krok 4) a se stoiky o politice (viz Stoicismus a d). Jiný spor, který tu stojí za zmínku a je ověřený: Epikúros říká, že tělo chce nehladovět, nežíznit, nemrznout (`vs-33`): tohle slovo se ve stránce o směru nepoužije (kvůli hranici ve Stoickém týdnu: nic o jídle, hladu a vydržení).

**Zkus to žít:** tam, kam nepatří jídlo ani „vydrž“: **Večer s přítelem bez cíle**, jeden večer s člověkem, na kterém ti záleží, bez telefonu. Opora: Hlavní myšlenka 27, Vatikánský výrok 52 („Přátelství tančí kolem celého světa“). Návrh znění T1 podle `atlas-osobnost`; mez: kdo žádného přítele nemá, výzva mu nesmí říct, že mu něco chybí („komukoli, na kom ti záleží, i rodině“).

**Kdo navazoval:** Démokritos → Epikúros (atomy a prázdno), Epikúros → Lucretius a Epikúros → Seneca (vliv textem), Plútarchos → Epikúros a Cicero → Epikúros (spor na dálku). V datech jsou jen tito.

### Kynismus

**Scéna založení (ověřeno, Diogenés Laertios VI, 20–21).** Diogenés z Sinópy opustil rodné město pro falšování mincí: podle jedné verze se zeptal věštce, jestli má změnit „politickou měnu“, a když dostal svolení, pochopil to po svém. (Verze dvě: otec mu svěřil peníze a on je znehodnotil; v díle Pordalos sám přiznává, že mince falšoval.) V Athénách přišel k Antisthenovi, který žáky nepřijímal; Antisthenés se po něm ohnal holí a Diogenés nastavil hlavu se slovy: „Tluč, nenajdeš dost tvrdé dřevo, abys mě od sebe odehnal, dokud mám pocit, že máš co říct.“ Od té chvíle byl jeho žákem. Typ: tradovaný příběh s několika verzemi; vztah `antisthenes → diogenes` je v datech `tradovany: true` a stránka to říká. Formulace: „Vypráví se, že…“. Jednu verzi nepřetahovat; doporučuji začít Antisthenovou holí a o minci říct jen „opustil město kvůli falešným mincím“ (to, že pramen to dává jako důvod odchodu, je ve všech verzích společné).

| Myšlenka | Pramen | Hotové citáty |
| --- | --- | --- |
| Žít podle přírody, ne podle zvyku; všechno, za čím se lidé honí, chtějí podle Diogena kvůli ostatním | Diogenés Laertios VI, 71 | `dl-vi-71`, `dl-vi-44` |
| Soběstačnost: bohové nepotřebují nic, bohům podobní lidé potřebují málo | Diogenés Laertios VI, 104 | `dl-vi-104` |
| Nic nevlastním, nikam nepatřím: občan světa | Diogenés Laertios VI, 63 | `dl-vi-63` |

**Spor:** s Epikúrem (cesta 6, krok 4; citát `dl-x-119`) a s Platónem (oškubaný kohout, `dl-vi-53-diogenes`, `dl-vi-53-platon`; vztah `diogenes → platon` je `polemika`, `tradovany: true`).

**Zkus to žít:** **Den bez „protože se to čeká“**: u každé věci, kterou ten den uděláš, si polož otázku, jestli ji děláš, protože chceš, nebo protože se to čeká. Opora: kynické přesvědčení, že mnohé, po čem lidé touží, chtějí jen kvůli ostatním (Diogenés Laertios VI, 71, `dl-vi-71`). Mez (poučení z celku 8): věta „dělám to jen kvůli ostatním“ nesmí obrátit studenta proti lidem, o které pečuje; text má říct „klidně i kvůli někomu jinému, jen ať o tom rozhodneš ty“. Nic o jídle ani o oblečení (kynici mají „jedna roucha a mošnu“, což se do výzvy nepřenáší).

**Kdo navazoval:** Antisthenés → Diogenés (učitel, tradované), Diogenés → Kratés (učitel), Kratés → Zénón (učitel; z kynismu vzniká Stoa), Kratés a Hipparchia (manželé).

### Akademie

**Scéna: Aristotelés přichází do Akademie.** Zakládací scénu (rok asi 387 př. n. l.) jsem **neověřil** (SEP „Plato“ jsem otevřel, rok tam nenašel; Britannica nečtena): nepoužít, dokud ho T1 neověří. Místo ní máme ověřeno: Aristotelés přišel do Akademie asi v sedmnácti letech a zůstal dvacet let, až do Platónovy smrti (SEP „Aristotle“, `sep-aristotle`; už je v portrétu Platóna). Z toho vychází scéna, kterou atlas zná a kterou směr nemusí opakovat: Platón učí a nejlepší žák s ním nesouhlasí a řekne to nahlas (`etika-1096a`, 1× v portrétu Platóna; ve směru stačí odkaz na portrét). **Doporučení:** scéna směru je Akademie **jako škola, v níž se spor nebere jako zrada**; pro druhou polovinu příběhu je ověřená zpráva o Karneadovi (SEP: Akademie argumentuje „na obě strany“, *in utramque partem*).

**Rodina Akademie (ověřeno, Diogenés Laertios I, 14).** Platón je zakladatel Staré Akademie; po něm Speusippos a Xenokratés, pak další (Polemón, Krantor, Kratés) a Arkesilaos, zakladatel Střední Akademie, Lakydés, zakladatel Nové Akademie, Karneadés a Kleitomachos. Z toho jsou v datech jen Platón, Speusippos, Xenokratés a Karneadés; ostatní jména se na stránce neobjeví a nové osoby nepřibývají.

| Myšlenka | Pramen | Hotové citáty |
| --- | --- | --- |
| Za tím, co vidíme, jsou „ideje“: to, čím je stůl stolem | Platón, Ústava VII (jeskyně), Timaios 51d | `ustava-515a`, `ustava-517b`, `timaios-51d` |
| Duše má části a spravedlnost je řád v duši, ne jen pověst před lidmi | Platón, Ústava IV, II (Gýgův prsten, Leontios) | `ustava-440a`, `ustava-360b`, `ustava-433a` |
| Středoakademická tradice: argumentovat za i proti, nic nepřijmout bez zkoušky | SEP „Carneades“, DL I, 14 | — (nový citát nepotřebuje) |

**Spor:** s Aristotelem o ideje (`aristoteles → platon`, `polemika`, „spor o ideje“, `aristoteles-metafyzika-ideje`); Karneadés s Chrýsippem (`karneades → chrysippos`, `polemika`).

**Zkus to žít:** výzva z portrétu Platóna už existuje v textu („Zkus to se svým nejpevnějším názorem. Jakou nejtvrdší námitku proti němu znáš?“): směr na ni odkáže a přidá **jeden sokratovský rozhovor s kamarádem** (z plánu architektury): neptat se, abys vyhrál, ale abys zjistil, co ten druhý myslí.

**Kdo navazoval:** Platón → Speusippos, Xenokratés, Aristotelés (učitel), Platón → Plótínos, Filón Alexandrijský, Cicero (vliv textem), Archytás a Eudoxos (znali-se); Aristotelés ↔ Platón (polemika).

## d) Otázky 2 a 8

Hlasy jen od lidí se stránkou (portrét, profil nebo medailonek); šest hlasů u každé otázky. Odpověď hlasu má nejvýš dvě věty (poučení z revize). **Odpovědi na případ jsou použití myšlenky, ne věta, kterou autor řekl:** stránka je píše jako „mohl by říct“, ne jako citát. Každý citát nese pramen a překlad.

### Otázka 2: Co je správné a co dlužím druhým?

**Úvodní případ: Mobil přes noc.** (Moderní podoba Platónova příkladu z Ústavy I 331c–d, který stojí o zbrani půjčené příteli, který pak zešílel. Student ho nepozná jako příklad z knihy.) Návrh: „Kamarád se večer pohádal s přítelkyní a dal ti na uschování mobil, ať jí v zuřivosti nic nenapíše. Řekl: ‚Vrať mi ho, kdykoli si o něj řeknu.‘ V půl jedné v noci ti volá z cizího telefonu a chce ho hned, že jí musí něco napsat. Slíbil jsi mu to. Vrátíš mu ho?“ Případ má být jiného druhu než nové případy cest (poučení z `docs/pouceni.md`); žádný z nich, který znám z plánu, není o slibu a svěřené věci, ale cesty jsem pro tenhle krok znovu nečetl, T1 je porovná. Studentova otázka na konci: „Co dlužíš kamarádovi: slib, nebo to, co chtěl večer?“

Poznámka: případ počítá s hněvem, ne s alkoholem (kvůli studentům, kterým je blízký rodič s alkoholem, viz `docs/pouceni.md`).

| Hlas | Odpověď na případ (návrh) | Myšlenka (pramen) | Citát |
| --- | --- | --- | --- |
| **Platón** | „Nevracej mu ho teď. Spravedlnost není vracet všechno, co jsem dostal: zbraň vrácená příteli, který zešílel, by byla křivda.“ | Platón nechává Sókrata vyvrátit definici „pravdu říkat a vracet, co jsem dostal“ jediným příkladem; Sókratés ho předkládá jako něco, s čím by souhlasil každý. Ústava I 331c–d. | nový `ustava-331c`: „Kdyby někdo vzal od přítele, který byl při smyslech, zbraně, a ten by pak zešílel a chtěl je zpátky, nikdo by neřekl, že mu je má vrátit, ani že by byl spravedlivý ten, kdo by je vrátil.“ Řecky: *εἴ τις λάβοι παρὰ φίλου ἀνδρὸς σωφρονοῦντος ὅπλα, εἰ μανεὶς ἀπαιτοῖ, ὅτι οὔτε χρὴ τὰ τοιαῦτα ἀποδιδόναι, οὔτε δίκαιος ἂν εἴη ὁ ἀποδιδούς*. Vlastní převod podle řeckého textu a Shoreyho; mluví Sókratés. V atlasu 0× |
| **Sókratés** | „Dodrž slib, když je spravedlivý, a nikomu neubližuj, ani když se zlobíš. Kdyby ho vrácení zranilo, slib bys neplnil.“ | Sókratés v Kritónovi: ani za křivdu se neoplácí křivdou (49c) a dohodu je třeba plnit, je-li spravedlivá (49e). | `kriton-49c` (1×, `sokrates.mdx`; po použití 2×); nový `kriton-49e`: „Má člověk dělat to, na čem se s někým dohodl, jestliže je to spravedlivé, nebo to smí obejít?“ (řecké znění doplní T1; vlastní převod podle Fowlera) |
| **Prótagorás** | „Stud a právo mají podle mýtu všichni: zeptej se i někoho dalšího a rozhodni tak, aby se to dalo říct nahlas.“ | Podle Platónova Prótagory Zeus poslal Herma, aby lidem přinesl stud (*aidós*) a právo (*díké*), „aby v obcích byl řád a pouta přátelství“. Platón nechává Prótagoru, aby to vyprávěl. Prótagorás 320c–322d. | nový `protagoras-322c` (Hermés dostane úkol přinést lidem stud a právo, 322c); vlastní převod z řeckého textu a Lamba, mluví Prótagorás podle Platóna. V atlasu 0× |
| **Aristotelés** | „Žádné ‚vždy vrať‘ ani ‚nikdy nevracej‘: tehdy, kdy se má, vůči komu se má, kvůli čemu a jak.“ | Správné jednání je trefit střed vzhledem k situaci, ne držet jedno pravidlo (Etika Nikomachova II, 6). | `etika-1106b` (1×, cesta 6 krok 6; po použití 2×) |
| **Epikúros** | „Slib je dohoda, že si neublížíme. Když vrácení škodí, slib přestal dělat, k čemu byl, a přestal být spravedlivý.“ | Spravedlnost je podle Epikúra dohoda o neškození (Hlavní myšlenky 31–33); zákon, který přestane sloužit užitku soužití, přestává být spravedlivý (37). **Použití na slib je výklad** (Epikúros mluví o zákonech a smlouvách). | nový `kd-37`: „Co se v zákonech uznává za spravedlivé, je spravedlivé jen potud, pokud se ukáže užitečné pro soužití; a kdyby zákon přestal odpovídat tomu, co soužití prospívá, už by nebyl spravedlivý.“ Vlastní převod podle řeckého textu a Hickse (X, 152; řecké znění doplní T1). Doplňkově `kd-34` (0×) |
| **Marcus Aurelius** | „Nevracej mu ho z hněvu a nenech ho propadnout: lidé jsou tu jeden pro druhého. Pouč ho, nebo ho snášej.“ | Co dlužíme druhým, plyne podle stoiků z toho, že jsme společenští tvorové a existujeme jeden pro druhého (Hovory VIII, 59). | `hovory-viii-59` (1×, `marcus-aurelius.mdx`; po použití 2×) |

**Karneadés** (medailonek) by byl sedmý hlas: jeho „dvě řeči o spravedlnosti“ jsou jen tradice (SEP, Gellius je nezmiňuje v mém čtení) a pro otázku 2 by měl i slabší pramen. **Doporučuji vynechat**, vrátit se k němu s pokusem Karneadova deska.

Stránka otázky 2 má v plánu odkázat na kroky a kapitoly, kde téma je: pokus Gygův prsten (e), cesta 7 (Kratés, Hipparchia, Sókratés z Kritóna). Ostatní odkazy vybere T1.

### Otázka 8: Jak spolu máme žít?

**Otázka před případem** (plán: jedna z obou stránek otevře otázkou, revize antiky nález 10): „Kdo má rozhodovat, když se třída nemůže shodnout?“

Případ: „Máte vybrat cíl závěrečného výletu. Jedni chtějí hlasovat a rozhodne většina. Druzí říkají, že o tom má rozhodnout ten, kdo ví, kolik to stojí a co jde zařídit. Třetí odpoví: ‚Je mi to jedno, nechte mě na pokoji.‘ Kdo z nich má pravdu?“ Případ nepředstírá, že jedna z cest je správná: všechny tři jsou odpovědi, které pozdější hlasy opravdu dávají.

| Hlas | Odpověď na případ (návrh) | Myšlenka (pramen) | Citát |
| --- | --- | --- | --- |
| **Prótagorás** | „Rozhoduje se všemi: obce nevznikly, kdyby stud a právo měli jen znalci.“ | Platónův Prótagorás vypráví mýtus, ve kterém Zeus přikazuje, aby stud a právo dostali všichni, a proto se v obcích smí radit každý (Prótagorás 322c–323a). | nový `protagoras-322d`: „Všem. Ať mají všichni podíl. Obce by nevznikly, kdyby stud a právo měli jen někteří, jako je tomu u jiných umění.“ Řecky: *ἐπὶ πάντας … καὶ πάντες μετεχόντων· οὐ γὰρ ἂν γένοιντο πόλεις, εἰ ὀλίγοι αὐτῶν μετέχοιεν ὥσπερ ἄλλων τεχνῶν*. Vlastní převod podle řeckého textu a Lamba |
| **Platón** | „Rozhoduje ten, kdo se vyzná. Na lodi taky nehlasujete o kurzu.“ | Platón (Ústava VI, 488a–489c): obec je loď, na které se námořníci hádají o kormidlo, i když se nikdo nenaučil kormidlovat; pravého kormidelníka označí za pozorovatele nebes a k ničemu. Souznění s Thalétem (a): táž nadávka. | nový `ustava-489a`: „Skutečného kormidelníka by námořníci na takových lodích nazvali pozorovatelem nebes, žvanilem a k ničemu.“ Řecky: *τὸν ὡς ἀληθῶς κυβερνητικὸν … μετεωροσκόπον τε καὶ ἀδολέσχην καὶ ἄχρηστον*. Vlastní převod podle řeckého textu a Shoreyho; mluví Sókratés. V atlasu 0× (`ustava-473d` o filozofech králích je v portrétu 1×) |
| **Aristotelés** | „Rozhodněte společně, ale poslechněte toho, kdo se vyzná: mnozí dohromady posoudí leccos líp než jeden.“ | Mnozí, kteří nejsou dobří každý zvlášť, mohou dohromady být lepší (Politika III, 11). | nový `politika-1281b`: „Je možné, že mnozí, i když každý zvlášť nejsou dobří, mohou být dohromady lepší než ti dobří, jako jsou společné hostiny, na které přispívá mnoho lidí, lepší než hostina z jedné kapsy.“ Řecky: *οἷον τὰ συμφορητὰ δεῖπνα τῶν ἐκ μιᾶς δαπάνης χορηγηθέντων*. Vlastní převod podle řeckého textu a Rackhama. Alternativa `politika-1253a` (0×, „Člověk je od přírody tvor obce“) |
| **Epikúros** | „Nemusíš se do toho plést: kdo je v bezpečí před druhými, žije klidně a nepotřebuje výlet řídit.“ | Klid zdaleka není jediný cíl: nejdřív „tolik bezpečí před lidmi, kolik se dá“, a pak klid mimo dav (Hlavní myšlenka 14); moudrý se politikou zabývat nebude (DL X, 119, v nepřímé řeči). | nový `kd-14`: „Když je zajištěno tolik bezpečí před lidmi, kolik jen lze, vzniká na základě síly a hojnosti v nejčistší podobě bezpečí, které plyne z klidu a z odstupu od davu.“ Řecky: *Τῆς ἀσφαλείας τῆς ἐξ ἀνθρώπων γενομένης μέχρι τινὸς … ἡ ἐκ τῆς ἡσυχίας καὶ ἐκχωρήσεως τῶν πολλῶν ἀσφάλεια*. Vlastní převod podle řeckého textu a Hickse (X, 143–144). Alternativa `vs-58`: řecky čteno, *Ἐκλυτέον ἑαυτοὺς ἐκ τοῦ περὶ τὰ ἐγκύκλια καὶ πολιτικὰ δεσμωτηρίου*; překlad kolísá (*enkyklia* jako „běžné záležitosti“ nebo „běžné vzdělání“), proto nepoužít, dokud T1 neověří překlad |
| **Diogenés** | „Neptej se, kam patříš: moje obec je svět a o tom se nehlasuje.“ | Na otázku, odkud je, odpověděl jediným slovem, že je „občan světa“ (kosmopolités) (DL VI, 63; řecky jediné slovo). | `dl-vi-63` (1×, `diogenes.mdx`; po použití 2×) |
| **Marcus Aurelius** | „Rozhodni, co je dobré pro třídu, ne jen pro tebe: co neprospívá úlu, neprospívá ani včele.“ | Jednotlivec je součást celku, jehož prospěch je i jeho (Hovory VI, 54). | nový `hovory-vi-54`: „Co neprospívá úlu, neprospívá ani včele.“ Řecky: *Τὸ τῷ σμήνει μὴ συμφέρον οὐδὲ τῇ μελίσσῃ συμφέρει*. Vlastní převod podle řeckého textu; 0×. (VI 44 „jako Antoninus mám za obec Řím, jako člověk svět“ je 1× v portrétu a zněním se kryje s Diogenem) |

Případ otázky 8 poslouží i jako zadání pro třídu (jedna odpověď na lístku, pak výběr hlasů); T1 ho nepoužije jako „test“, nic se nehodnotí.

Obě stránky otázek slibují zastánce pro **každou odpověď případu** (poučení „Když poslední krok slíbí, že každá odpověď má zastánce…“): u otázky 8 má odpověď „je mi to jedno“ Epikúra, odpověď „rozhodne ten, kdo se vyzná“ Platóna, „hlasujeme“ Prótagoru a Aristotela; u otázky 2 má „vrať, slíbil jsi“ Sókrata a Marca, „nevracej“ Platóna a Epikúra, „záleží na situaci“ Aristotela.

## e) Pokusy: Gygův prsten a Zrcadlo času

### Gygův prsten (Ústava II, 359c–360d)

Blok `platon-gyguv-prsten` (`src/content/bloky/platon-gyguv-prsten.yaml`) je už psaný pro samostatnou stránku: scéna říká, kdo příběh vypráví (Glaukón, který názor, jaký předvádí, sám nevěří, 357a–358d), v textu je „pastýř“ a „Gýgův prsten“, tři podmínky („Nikdo se to nikdy nedozví“, „Dozvědí se to jen tví nejbližší“, „Budeš to vědět jen ty“) a oddíl Co by na to řekli.

| Co převzít | Co přidat stránka pokusu |
| --- | --- |
| Celý blok se stejným `id` (stav, deník a Příprava hodiny pak sdílí jeden záznam): scéna, otázka „Máš ten prsten na týden. Co uděláš?“, tři možnosti, tři podmínky, Co by na to řekli | Úvod stránky; volba předem (před příběhem: „Myslíš, že by většina lidí dělala totéž, kdyby ji nikdo neviděl?“); hlasy; Kam dál |
| Citát `ustava-360b` (1×, portrét Platóna; po použití 2×) | Hlasy: **Platón** (celá Ústava: spravedlnost je řád v duši; `ustava-433a` 1×, `ustava-440a`), **Epikúros** (nový `kd-35`, viz níže), případně Glaukón jen jako postava, ne jako hlas (nemá stránku) |

Nový citát pro **Epikúra**, který na prsten odpovídá z jiné strany (nelze si být jistý, že se to nedozví): **`kd-35`**: „Nelze, aby ten, kdo tajně poruší některou z dohod o neškození, mohl věřit, že zůstane skryt, i kdyby už desetitisíckrát unikl; až do smrti totiž neví, jestli ho nechytí.“ Hlavní myšlenka 35 (Diogenés Laertios X, 151, anglicky Hicks čteno; řecké znění doplní T1). Doplňuje `kd-34` (X, 151): „Nespravedlnost není zlo sama o sobě, ale ve strachu z toho, že se přijde na ni“ (0× v atlasu, dává se jako doplněk).

Epikúrova odpověď *nepopírá*, že by prsten byl svobodou: kdyby neodhalení bylo zaručené, strach z KD 34–35 by odpadl (to je můj výklad, ne Epikúrova věta). Tuhle poslední větu stránka řekne otevřeně; je to nejsilnější námitka proti Epikúrovi a student ji má znát (nejsilnější verze druhého).

### Zrcadlo času (Lucretius, O přírodě III, 972–977)

Kresba `Zrcadlo.svelte` (`src/lib/zrcadlo.ts`, id bloku `zrcadlo-casu`) je z cesty 8, krok 4. Citát pro stránku je kratší podoba **`lucretius-iii-972-zrcadlo`** (1×, cesta 8; po použití 2×), bez poslední otázky o spánku. Plná podoba `lucretius-iii-972` (0×) se nepoužije: závěr „není to klidnější než každý spánek“ je právě ten obraz, kterému se celek o smrti vyhnul (`docs/pouceni.md`, celek 6).

| Co převzít | Co přidat stránka pokusu |
| --- | --- |
| Scéna: Lucretius, asi dvě stě let po Epikúrovi; otázka do minulosti („je rok 1914, kde jsi byl?“); kresba s přepínačem Zrcadlo ↔ Námitka (Nagel) | Úvod; hlasy: **Epikúros** (`kd-2` 1×, `vs-31` 1×, `kd-19`), **Seneca** (`seneca-ep-54-4`, `seneca-ep-54-5-lampa`, v cestě 8, krok 4). Lucretius a Nagel nemají stránku: jen jména v textu, bez odkazu |

**Mezi (nutné pro T1 a pro Přípravu hodiny).** Zrcadlo je o smrti. Architektura říká o pokusech „vhodné i na začátek hodiny“; u tohoto pokusu to **neplatí**: začínat třídu otázkou, kdy nás nebude, nemá učitel dělat bez úvahy o studentovi, kterému někdo zemřel nebo je vážně nemocný (`docs/pouceni.md`, celek 6 a 7). Stránka musí držet všechna pravidla z cesty 8: první obrazovka čtená očima člověka po ztrátě, argument o konci vnímání psaný souměrně, věta „o tvé bolesti tenhle argument není“ na téže obrazovce, žádná vlastní karta o strachu. Stránka pokusu nedostane v Přípravě hodiny štítek „na začátek hodiny“.

## f) Cesta 6, krok 4: náhrada za `seneca-ep-18-9`

Krok „Žít jako kynik?“ (`src/content/cesty/kolik-je-dost/4-zit-jako-kynik.mdx`) říká: „Cvičil se i Epikúros. Seneca o něm píše: [Epikúros měl určité dny, kdy hlad jen skrovně tišil]… Kynik i Epikúros tedy jedli chléb a pili vodu. Každý ale kvůli něčemu jinému.“ Meze ze `docs/podklady/stoicky-tyden.md`, den 5: **žádné hladové dny, půst ani omezování jídla**; slovní stopy k zakázání: „odříkání“, „sebeovládání“, „vydrž“, „silná vůle“, „skromné jídlo“, „stačí málo“, „hlad“.

**Zjištění.** Nestačí vyměnit citát: věty kolem něj („Cvičil se i Epikúros“, „jedli chléb a pili vodu“) jsou o jídle taky. Měnit se musí tři věty: úvod citátu, citát a závěr kroku.

**Doporučená náhrada: `menoikeus-130`** (hotový citát, v atlase 1× v kroku 3 téže cesty, `3-kde-ma-slast-strop.mdx`; po použití 2×, ve dvou sousedních krocích, což je slabina, viz alternativy):

> „Soběstačnost je velké dobro. Ne proto, abychom vždycky žili s málem, ale abychom si s málem vystačili, když víc nemáme. Přepych si nejvíc užijí ti, kdo ho nejméně potřebují.“ (Epikúros, Dopis Menoikeovi 130)

Drží myšlenku kroku (Epikúros nežije z mála jako program, proti kynikům), nezmiňuje jídlo ani hlad a neobsahuje slova z černé listiny kromě „s málem“; poslední je v jeho vlastní větě a řekne opak „žít vždycky z mála“. Návrh přepsání pro T1 (slova nejsou závazná): úvod: „Epikúros tu míru viděl jinak. V dopise Menoikeovi píše:“ [citát]; závěr: „Kynik i Epikúros tedy žili skromně. Každý ale kvůli něčemu jinému: kynik se cvičil v tom, že nepotřebuje, Epikúros chtěl víc volnosti pro přátele a klid.“ (Druhá polovina věty je výklad cesty 6; pramen je Hlavní myšlenka 27 a kd-15.)

**Alternativy** (v pořadí doporučení):
- **B:** `kd-15` (v atlase 1×, krok 6) „Bohatství, které žádá příroda, má své meze a snadno se získá…“: o bohatství, ne o jídle; stejná slabina (opakování v téže cestě).
- **C:** krok 4 bez Epikúrovy citace: zůstane `dl-x-119` (Epikúros odmítá kynický život) a Spor; čtyři věty o Seneku a hladu se vypustí. Nejvíc čisté, nejméně živé; Epikúrovo „proč“ unese Spor.
- **Nepoužít:** `vs-63` (řecky čteno, `ἐν λεπτότητι καθαριότης`): překlad kolísá (jemnost, prostota, střídmost) a v některých podáních se čte jako „střídmost má mez“; nelze se spolehnout; nečíst jako citát bez ověření. Dopis Polyainovi (zdroj Senekovy věty) jsem nečetl.

## g) Pět vztahů

Pět „chybějících vztahů“ z `interaktivita-v1` (Po O) je ve skutečnosti **jeden chybějící (Chrýsippos → Karneadés), jeden špatného typu (Theofrastos) a dva už v datech (Chairefón, Kritón)**. Příčina: výchozí dvojice Dvou životů (`vychoziDvojice`, `src/lib/dvojice.ts`) bere jen `ucitel`, `zak` a `vliv-textem`; `znali-se` a `polemika` nečte.

| # | Vztah | Stav v `vztahy.yaml` | Doporučení | Zdroj | Poznámka (studentský text) |
| --- | --- | --- | --- | --- | --- |
| 1 | Theofrastos ← Aristotelés | `aristoteles → theofrastos`, `znali-se`, poznámka „Theofrastos s ním pracoval a po něm vedl Lykeion“, zdroj `sep-theophrastus` | **změnit typ na `ucitel`** | Diogenés Laertios V, 36 (čteno): „nejdřív poslouchal Alkippa, pak Platóna, kterého opustil kvůli Aristotelovi; když Aristotelés odešel do Chalkidy, převzal školu“; V, 35: „z Aristotelových posluchačů byl nejpřednější Theofrastos“. SEP „Theophrastus“ ho nazývá „Aristotelovým blízkým spolupracovníkem a nástupcem“ (čteno úvod). Obojí je slučitelné | „poslouchal ho po odchodu z Akademie a po něm převzal Lykeion“ (druhé slovo `vedl` zůstane; nepsat „spolupracovník“ vedle typu učitel) |
| 2 | Chairefón a Sókratés | `sokrates → chairefon`, `znali-se`, „přítel od mládí“, zdroj `platon-obrana` | **nic nepřidávat** | (zdroj už v datech; Obranu 20e–21a jsem znovu nečetl) | — |
| 3 | Kritón a Sókratés | `sokrates → kriton`, `znali-se`, „vrstevník a přítel“, `platon-obrana` | **nic nepřidávat** | totéž | — |
| 4 | Karneadés a Chrýsippos | `karneades → chrysippos`, `polemika`, „je-li všechno dáno předchozími příčinami, není nic v naší moci“, `cicero-de-fato-perseus` | **přidat druhý vztah** `chrysippos → karneades`, `vliv-textem` | Diogenés Laertios IV, 62 (čteno): Karneadés „pečlivě studoval spisy stoiků, hlavně Chrýsippovy, a úspěšným vyvracením se proslavil“ a říkal: „Kdyby nebylo Chrýsippa, kde bych byl?“; SEP „Carneades“ cituje totéž rčení | „prostudoval jeho spisy a vyvracením se proslavil“ |
| 5 | Karneadés a Chrýsippos jako současníci | podle `mohliSePrit` (Karneadovi nebylo ve Chrýsippových posledních letech víc než sedm) | polemika se vykreslí jako **spor na dálku**, nic opravovat | — | — |

Dopady (T1 ověří testy, `dvojice.test.ts` a `data.test.ts`):

- Theofrastos: výchozí dvojice se změní z „Kratés [současník]“ na „Aristotelés [učitel]“; stránka Aristotela získá v Době a lidé řádek učitel → žák.
- Karneadés: výchozí dvojice se změní z „Chrýsippos [současník]“ na „Chrýsippos [četl]“.
- Chairefón a Kritón: výchozí dvojice zůstává Sókratés [současník]. Kdyby autor chtěl, aby Dva životy u nich řekly „přátelé“, je to změna kódu (`vychoziDvojice` by přibrala `znali-se`), ne dat; patří do K1 nebo K2, ne do T1.

## h) Obrázky (návrhy; nic nestahovat)

Ověřeno API Metropolitan Museum of Art (`isPublicDomain: true`, CC0 Open Access; stránky předmětů na `https://www.metmuseum.org/art/collection/search/<id>`). Soubory ani pole `primaryImage` jsem nestahoval ani neotevíral. Stažení až po autorově souhlasu v odpovědích po P6 (krok T).

| Stránka | Návrh | Instituce, inv. č. | Licence | Poznámka |
| --- | --- | --- | --- | --- |
| Co je filozofie? | Met 255445, „Portrait head of philosopher?“, 4. st. př. n. l. | Metropolitan Museum of Art | CC0 | popisek: „neznámý filozof“; označeno otazníkem i v Metu; jinak žádný nový obraz (Thalés nemá dochovaný portrét) |
| Období 1 | Met 248902, panathénajská cenná amfora, Euphiletos Painter, asi 530 př. n. l. | Metropolitan Museum of Art | CC0 | Athény, hry, kult; ne filozofové |
| Období 2 | Met 326395, tetradrachma Alexandra Velikého, asi 325–319 př. n. l. | Metropolitan Museum of Art | CC0 | Alexandr jako předěl období; mince: dobový předmět |
| Stoicismus | Met 251787, mramorová hlava filozofa Chrýsippa, 1. st. n. l. | Metropolitan Museum of Art | CC0 | římská kopie, ne současný portrét |
| Epikureismus | už v datech: `epikuros-met` (Met 248475) | | CC0 | bez nového souboru |
| Kynismus | už v datech: `diogenes-carpi` (Met 354611); Caraglio, Diogenés (Met 366705, asi 1527) jako záložní | | CC0 | |
| Akademie | už v datech: `platon-smk` (SMK, KAS2111) | | volné dílo | bez nového souboru |
| Gygův prsten | Met 256193, zlatý prsten s Hermem, 2. polovina 4. st. př. n. l. | Metropolitan Museum of Art | CC0 | Hermés je i hrdinou mýtu u Prótagory; popisek: „řecký prsten“, ne „Gýgův“ |
| Zrcadlo času | Met 253640, bronzové zrcadlo, asi 330–300 př. n. l. | Metropolitan Museum of Art | CC0 | popisek bez smrti; zrcadlo jako předmět |
| Pokus Co je filozofie? (hrom) | Met 251078, bronzová soška Dia nebo Poseidóna, počátek 5. st. př. n. l. | Metropolitan Museum of Art | CC0 | popisek musí říct „Zeus, nebo Poseidón“; Met sám neví |

U obrázků z řecké keramiky a mincí platí z `docs/styl.md`: popisek říká, co je to za předmět, ne co si student má myslet.

## Návrh dat

```yaml
# zdroje.yaml › prameny (nové; ostatní id už existují)
- { id: herodotos-i-74, druh: pramen, nazev: "Dějiny I, 74", autor: Hérodotos, ... }
- { id: dl-iv-62, druh: pramen, nazev: "Životy filozofů IV, 62", autor: Diogenés Laertios, ... }
- { id: dl-v-36, druh: pramen, nazev: "Životy filozofů V, 36", autor: Diogenés Laertios, ... }
- { id: gellius-vi-14, druh: pramen, nazev: "Noci na Attice VI, 14", autor: Aulus Gellius, ... }
- { id: noaa-thunder, druh: web, nazev: "Understanding Lightning: Thunder", url: "https://www.weather.gov/safety/lightning-science-thunder", ... }
- { id: sep-buddha }, { id: sep-laozi }
# existují: hesiodos-theogonia, platon-theaitetos, platon-protagoras, platon-kriton, platon-ustava-perseus,
#   aristoteles-metafyzika, aristoteles-politika-i, aristoteles-politika-iii, iep-anaximander, sep-carneades
# citaty (nové): metafyzika-983b, metafyzika-982b, theaitetos-155d, theaitetos-174a, politika-1259a, herodotos-i-74,
#   ustava-331c, ustava-489a, kriton-49e, protagoras-322c, protagoras-322d, kd-14, kd-35, kd-37, hovory-vi-54, politika-1281b
# vztahy.yaml
- { od: aristoteles, k: theofrastos, typ: ucitel, poznamka: "poslouchal ho po odchodu z Akademie a po něm převzal Lykeion", zdroj: dl-v-36 }  # nahradí znali-se
- { od: chrysippos, k: karneades, typ: vliv-textem, poznamka: "prostudoval jeho spisy a vyvracením se proslavil", zdroj: dl-iv-62 }
# udalosti.yaml
- { id: halys-zatmeni, nazev: Zatmění Slunce zastaví bitvu u Halyu, od: -585, priblizne: true, obdobi: [1], misto: milet, osoby: [thales], druh: zivot, zdroj: herodotos-i-74 }  # ověřit schéma (pole priblizne) a místo; Thalés je v datech
```

Řetězce `…` a pole `druh`/`priblizne` si T1 srovná se schématem v `src/lib/schema.ts` (neotevřel jsem ho); návrh drží jen obsah.

## Rozpory a rozhodnutí

- **Theofrastos:** SEP „kolega a nástupce“ × Diogenés Laertios V, 36 „posluchač“. Doporučení `ucitel`, protože Dva životy pracují s typy, a poznámka drží obojí (poslouchal; po něm převzal školu). Důvod: DL V, 35–36 je výslovný; SEP mu neodporuje.
- **Rok zatmění:** 28. 5. 585 př. n. l. je většinový výklad, který přijímá i NASA (podle Wikipedie); jiné roky se navrhují (609, 587 př. n. l. u lunárních zatmění), a někteří badatelé tvrdí, že Thalés nic nepředpověděl. V datech `priblizne`, ve studentském textu „asi 585“.
- **Thalés a mýtus:** Aristotelés sám váhá (984a1–3), jestli je „voda“ nové. Rozhodnuto nepsat „Thalés opustil mýtus“ (viz a, řádek 4).
- **Studna:** Platón (thrácká služebná, studna) × Diogenés Laertios (stařena, příkop). Doporučuju Platónovu verzi, jedna z obou, bez vyprávění o rozporu.
- **Případ otázky 2:** jiný než Platónův (zbraň × mobil), ale se stejnou logikou. Atlas nepíše, že jde o Platónův příklad, dokud student sám nepřijde k hlasu Platóna.
- **Sedmý hlas Karneadés u otázky 2:** vynechat (viz d).

## Otevřené otázky pro autora

1. **Pokus v Co je filozofie?:** „Proč hřmí?“ (plán), nebo „Odkud se vzal svět?“ (menší riziko pořadí, ale delší a neověřené); viz a.
2. **Scéna období 1:** Sókratés v koši (doporučeno), nebo zatmění u Halyu; viz b.
3. **Karneadés:** doplnit vztah `vliv-textem` Chrýsippos → Karneadés a změnit Theofrasta na `ucitel`; viz g.
4. **Cesta 6, krok 4:** náhrada `menoikeus-130` (doporučeno), `kd-15`, nebo krok bez Epikúrovy citace; viz f. **Mimo tuhle větev jde jen o tuhle jednu větu, kterou meze Stoického týdne odmítají.**
5. **Obrázky:** které z návrhů v h smí T stáhnout.
6. **Zrcadlo jako pokus:** nezařazovat do Přípravy hodiny jako „začátek hodiny“; viz e.
7. **Stránka otázky 8 otevírá otázkou, stránka otázky 2 případem** (nebo naopak).
