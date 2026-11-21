# Větev herna-v1: hotové kroky (3)

Po T a zadání R. Plán, stav a další zadání jsou v `docs/plany/herna-v1.md`.

## Po T (21. 11. 2026)

Každý formát herny stojí na jednom místě antiky, karta Do hodiny je ve všech deseti cestách a tři profily mají místo Kdo žil dřív? hru z dat. Okolní věty se nezměnily: přibyly jen řádky s bloky a řádek `hra:` ve frontmatteru dvou období a jedné otázky. Nic se neboduje; hra dává do ruky větu `proc`, vztah nebo situaci a odkrytí říká, odkud věc je.

**Co vzniklo**

| Formát | Kde | Blok | Podle čeho student uvažuje |
| --- | --- | --- | --- |
| Seřaď na ose | období 1, pod Lidé a směry | `obdobi1-serad` | Xenofanés → Parmenidés → Sókratés → Platón → Aristotelés; napověda karty říká, kdo s kým mluvil nebo koho učil, odkrytí ukáže vztahy a že se žák nakonec přel s učitelem o ideje |
| Tipni si | období 2, pod Lidé a směry | `obdobi2-tipni` | Epikúros a Cicero: spor na dálku přes dva lidské životy („starají se bohové o lidi?“) |
| Kdo to řekl? | Stoicismus, za oddílem Spor | `stoicismus-kdo-rekl` | dvě stoické věty (Rukojeť 5, Hovory II, 1) a jedna Epikúrova (VS 68): pozná školu podle myšlenky |
| Doplň citát | portrét Sókrata, konec kapitoly Muž z agory (jiné místo, viz níž) | `sokrates-doplnit-sochy` | Menón 98a: pravdivý názor se stane věděním, až ho přiváže důvod; záměny „pravdou“ a „zvykem“ |
| Páry | Epikureismus, za Třemi myšlenkami | `epikureismus-pary` | slast, klid, štěstí; pasti „do rána hraješ“ a „tombola“ |
| Pravý, nebo podvržený? | cesta 1, krok 7, před Závěrem cesty | `cesta1-pravy` | „Vím, že nic nevím“, nádoba a oheň, Marcus VI, 6; Kam dál vede na pravidlo |
| Najdi slabé místo | cesta Kolik je dost?, krok 6, za citáty KD 15 a VS 68 (jiné místo, viz níž) | `cesta6-slabe` | škrtl by Aristotelés (EN 1099a) a Seneca (O blaženém životě 26); s argumentem stojí Epikúros (VS 33); Kam dál na studii |
| Kdo by to řekl? | otázka Jak mám žít?, pod Proč to tak viděli | `jak-zit-kdo-by` | „Na tom, co si o tobě myslí ostatní, nezáleží.“ Antisthenés by podepsal, Aristotelés (stud) by odmítl |

- **Hra na stránce bez textu pod oddíly:** stránka období a otázky má v MDX jen úvodní scénu, takže hra stojí ve frontmatteru (`hra: <id>`, schéma v `stranky-schema.ts` a `content.config.ts`) a šablona ji vloží obalem `bloky/HraStranky.astro` do čtenářského sloupce na konec Lidí a směrů, resp. pod Proč to tak viděli. Jméno komponenty podle druhu bloku je v `src/lib/herna/komponenty.ts`; katalog hodin (`hodiny.ts`, `katalog.json.ts`) ji zná na konci téhož oddílu a Prameny stránky dostanou prameny bloku. Prameny stránek směrů a úvodů vidí i hry herny v textu (`prameny-stranky.ts`), profil i Doplň citát (`StrankaProfilu.astro`).
- **Karta Do hodiny** v devíti cestách (`src/content/do-hodiny/<slug>.yaml`, `<DoHodiny />` na konci posledního kroku): dvojice vždy něco spolu udělá (rozdělí starost na dvě půlky, zkusí argument proti námitce, vybere drobný zvyk), třída se ptá na to, co cesta opravdu dělala. U cesty 8 nic osobního, u cesty 33 jen drobná obava, u cesty 4 žádné vyznání vlastního selhání.
- **Hry v profilech:** `<HraOsoby osoba="…" />` nad `<DobaALide>` u Aristotela (Kdo to řekl?, Platónova věta o spravedlnosti), Parmenida (Kdo to řekl?, Sókratova věta, rub „znali se, vypráví se“) a Epiktéta (`bez="kde"`, Kdo to řekl?, Marcova věta o úlu a včele, rub „Marcus četl Epiktéta“). Výběr (`aktivity.ts`, `stranky-osob.ts`): profil s `<HraOsoby>` vybírá z dat jako medailonek, ale citáty bere až po medailoncích (karty medailonků jsou stejné jako po K4, ověřeno výpisem), citát z vlastního textu profilu na kartu nejde (`naStrance`), autor díla mezi razítka nejde (Platón u Sókratovy věty) a `bez` vyloučí druh. Kde ne, je v `docs/navraty.md` a v Nad čím jsem váhal.
- **Štítek času:** cesta 1 asi 17 minut (bylo 14), Kolik je dost? asi 21 (bylo 19), přepočteno `scripts/slova-cesta.mjs`.
- **Skill `atlas-cesta`** (`skills/atlas-cesta/SKILL.md`): v Jak psát bloky odstavec Hry herny (devět formátů, každý s jednou řádkou a příkladem, hra ve frontmatteru, `HraOsoby` v profilu), karta Do hodiny s příkladem a sebehodnocení; v Kdy je hotovo řádek o kartě. Verzi v účtu jsem navrhl kartou k uložení.
- **Oprava mimochodem:** citát, který je sám rozhovorem (D. L. VI, 8: „Mnoho lidí tě chválí.“ – „A co…?“), dostával v hlasech herny ještě jedny uvozovky (`HlasHerny.svelte`).
- **Testy a skripty:** `pruchod.spec.ts` odehraje hru i v posledním kroku a u cest 1 a 6 ji čeká; `snimky-cesta.mjs` taky; `slova-cesta.mjs` ji už znal. Upravené: `cesta.spec.ts` (krok 6 má text ve dvou částech), `aristoteles.spec.ts` (hra místo Kdo žil dřív?), `herna-k5.spec.ts` a `herna-k5.test.ts` (karta je ve všech cestách), `zaver.spec.ts` (společná příprava s posunem, hra nad závěrem), `listek-cesty.spec.ts` (krok 7 je hotový až s hrou), `domu.spec.ts`, `stranky-osob.spec.ts`, `otazka.spec.ts` (minuty). Katalog hodin: `node scripts/hodiny-katalog.mjs` 182 stránek, 0 chyb, všech osm přídavků, deset karet a tři hry profilů jako zastavení. Snímky skládá `node scripts/snimky-herna-t.mjs` (klid a po činu, 390 a 1440 px, oba režimy; nic nepřetéká do strany).
- **Celé `npm test`:** kontrola typů bez chyb, 1590 testů ve Vitestu a všech 898 v Playwrightu (9,8 min). V prvním běhu 19. 11. spadlo 24 testů: devět kvůli přídavkům (opravené výš) a zbytek na časový limit, když stroj běžel 48 minut pod zátěží; v druhém běhu prošly všechny.

**Čtyři otázky zásady a otázka pilíře**

| Přídavek | Odnese si něco | Přemýšlí sám | Zůstává otevřená | Chtěl by i bez povinnosti | Do života |
| --- | --- | --- | --- | --- | --- |
| Seřaď na ose (období 1) | že filozofie té doby je řetěz rozhovorů od člověka k člověku | pořadí skládá z napověd o tom, kdo s kým mluvil, ne z roků | pořadí je dané, otevřené zůstává, co si kdo od koho vzal | krátká hra s kolíčky a překvapením na konci (žák se přel s učitelem) | i myšlenka, kterou máš za svou, k tobě od někoho přišla |
| Tipni si (období 2) | že spor jde vést s někým, kdo dávno nežije | odhaduje vzdálenost v lidských životech | ano: jestli je spor přes knihy opravdový spor, nechává na něm | jedno posunutí jezdce a překvapivá ryska | s myšlenkou se dá přít, ať je stará jakkoli |
| Kdo to řekl? (Stoicismus) | čím se stoická věta liší od epikurejské | rozhoduje podle vět `proc` pod razítky | odkrytí říká jen, čí věta je; souhlas nechává na něm | tři karty, poslední s otočkou „tahle stoická není“ | poznat, z jaké školy pochází rada, kterou dostává |
| Doplň citát (Sókratés) | rozdíl mezi mít pravdu a vědět proč | vybírá slovo podle smyslu, záměny ukážou, co by věta tvrdila jinak | jestli mu stačí mít pravdu, nechává na něm | jedno slovo, ale navazuje na Lachéta, který odvahu poznal, a neuměl říct proč | ptát se sám sebe, proč si něco myslím |
| Páry (Epikureismus) | slast a klid podle Epikúra nejsou volno a zábava | spojuje pojem se situací ze svého týdne | Epikúrovo měřítko nikomu nevnucuje; past jen ukáže druhý význam slova | situace jsou z jeho týdne (boty, trénink, hraní do rána) | rozeznat, co ho opravdu zklidní a co jen na chvíli pobaví |
| Pravý, nebo podvržený? (cesta 1) | dohledat citát dřív, než ho pošle dál | rozhoduje podle toho, čím se ten člověk zabýval, a podle kroku 3 | otázka „máš dobrý důvod věřit?“ vede rovnou k jeho pravidlu | ústřižky z obrazovky, které zná z vlastního telefonu | ověřit si citát, zprávu i obrázek, než mu uvěří |
| Najdi slabé místo (cesta 6) | že argument má místa, kde se dá nesouhlasit, a kdo tam nesouhlasil | škrtá sám a může připsat proč | žádná odpověď není správná, i „argument mi drží“ má zastánce | jeden tah tužkou a hned vidí, kdo stál s ním | nesouhlasit s konkrétní větou, ne s celým člověkem |
| Kdo by to řekl? (otázka 1) | že věta z videa má staré zastánce i odpůrce | vybírá filozofa a může připsat proč | atlas ukáže svůj výběr, studentův nehodnotí | věta, kterou slyšel minulý týden | podívat se na rady ze sítí s odstupem |
| Karty Do hodiny | učitel dostane úkol pro dvojici a pro třídu ke každé cestě | dvojice pracuje se svým, třída diskutuje | otázky nemají správnou odpověď | rozhovor místo zkoušení | mluvit o myšlence s druhým |
| Hry v profilech | totéž co hra medailonku: vztah a myšlenku člověka | razítka s větou `proc` | odkrytí řekne vztah, nic víc | střídání her mezi sousedními stránkami | kdo na koho navázal |

**Nad čím jsem váhal a co by šlo jinak**

- **Doplň citát není v kapitole Soud.** Kapitola cituje Obranu 36a, 36d a 38a (38a i jako motto nad portrétem), takže hra s nimi by zkoušela, co student o obrazovku výš četl. Jediná další věta ze soudu, Obrana 35c i se třemi syny, nese stránku klamů, na kterou vede Kam dál cesty 1. Proto Menón 98a na konci kapitoly Muž z agory: Lachés tam odvážného pozná, ale neumí říct proč. Jinak: Obrana 29a (strach ze smrti jako zdání moudrosti), ta ale otevírá otázku smrti, které se celek 1 vyhýbá.
- **Najdi slabé místo není v cestě 8.** Epikúrův argument tam napadá Slož argument (vyber, kterou větu bys napadl) i Odkryj (napiš námitku) v kroku 3 a zrcadlo s Nagelovou námitkou v kroku 4; třetí škrtání by bylo stejnou scénou podruhé. Proto Epikúrův argument o bohatství v cestě Kolik je dost?, krok 6. Text kroku je teď ve dvou papírech (citáty, hra, studie); Kam dál hry vede na studii.
- **Pravý, nebo podvržený? stojí před Závěrem cesty, ne za ním.** Za závěrem držela hra krok nedokončený i s napsaným pravidlem (lišta Dokončit cestu zůstala tichá, pahýl lístku se neodtrhl). Před závěrem je to poslední nový případ: student se zeptá, jestli má dobrý důvod věřit, a pak píše pravidlo. Krok 7 je teď hotový, až když je odehraná i hra.
- **Hry jen ve třech profilech.** Výběr z dat by dal Platónovi Kde to bylo? se Syrákúsami z kapitoly výš, nebo Kdo to řekl? vedle stejné hry u Aristotela; Senekovi hru hned za kapitolou o smrti s řádkem pomoci; Prótagorovi Thurioi, které profil nezmiňuje; Hérakleitovi Aristotelovu větu o kameni (s Markem mezi razítky), Diogenovi Kratétova ženicha a Epikúrovi Plútarchovu větu o změně. Sókratés má Doplň citát. Jinak: hru u těch profilů vybrat ručně, nebo doplnit data (`docs/navraty.md`).
- **Parmenidés dostal Obranu 35c** (soudce a laskavost): výběr z dat bere přednostně citát, který atlas už použil v textu, a ten stojí na stránce klamů. Rub říká jen „Vypráví se, že se Parmenidés a Sókratés znali“, ne o čem věta je; tak to dělají i medailonky.
- **Hra na stránce období a otázky ve frontmatteru**, ne na konci MDX: tam by stála v úvodní scéně nad lidmi, které student na stránce ještě nepotkal, a na stránce otázky dokonce před Tvým prvním názorem. Jinak: hru dát do textu úvodu a pravidlo „až tam, kde lidi potkal“ obětovat.
- **Řetěz v období 1 začíná Xenofanem** (medailonek), aby měla každá dvojice sousedů vztah v datech; s Hérakleitem by mezi ním a Parmenidem stálo jen „mohli se potkat“, a jestli o sobě věděli, data výslovně neříkají.
- **Na stránce Stoicismu je jedna věta Epikúrova**: na stránce, kde stoikové jsou všude, by tři stoické věty šly poznat podle stránky, ne podle myšlenky. Napověda u ní říká „Tahle věta stoická není“.
- **Kdo by to řekl? má mezi razítky Hipparchii**, hlas stránky, který se na očekávání druhých neohlížel; atlas ji v lístku neuvádí, protože její citát stojí na stránce o kus výš.
- **Bloky na stránkách směrů jsou ve čtenářském sloupci** (`<div class="ctenarsky">`): bez něj se Kdo to řekl? na 1440 px roztáhl přes celou šířku pod lístky pojmů na okraji. Bloky na stránce klamů z K5 sloupec nemají; nechal jsem je.

**Na které snímky se podívat** (`Claude outputs/snimky/`): `herna-t-obdobi1-serad-cin-390-light.png` (vztahy na šňůře), `herna-t-obdobi2-tipni-cin-390-light.png`, `herna-t-stoicismus-kdo-rekl-cin-1440-dark.png`, `herna-t-sokrates-doplnit-sochy-cin-390-dark.png`, `herna-t-epikureismus-pary-cin-390-light.png`, `herna-t-cesta1-pravy-cin-390-light.png`, `herna-t-cesta6-slabe-cin-1440-light.png`, `herna-t-jak-zit-kdo-by-cin-390-dark.png`, `herna-t-hra-epiktetos-kdo-rekl-klid-390-dark.png`; celé stránky `t-obdobi1-390-light-1.jpg` a `-2.jpg`, `t-obdobi2-1440-dark-1.jpg`, `t-stoicismus-390-dark-2.jpg`, `t-epikureismus-1440-light-1.jpg`; kroky `kdy-mam-dobry-duvod-verit-390-light-odkryt-7.jpg` a `kolik-je-dost-1440-dark-odkryt-6.jpg`. Naživo: `/obdobi/pocatky-a-klasicke-recko/#lide-a-smery`, `/smer/stoicismus/`, `/osobnost/sokrates/#muz-z-agory`, `/cesta/kdy-mam-dobry-duvod-verit/7/`, `/cesta/kolik-je-dost/6/`, `/otazka/jak-zit/` (po prvním názoru), `/hodina/nova/` (hledat „Do hodiny“).

Další krok: R v novém chatu, Opus 5.5 · high se skillem `atlas-revize` a pluginem Design; celé znění promptu je v Zadání R.

## Zadání R: revize větve

Opus 5.5 · high, skill `atlas-revize` (perspektivy student, učitel, uživatel, přístupnost), `design:accessibility-review` a `design:design-critique`, nový chat. Ověření VoiceOverem jen s autorem u Macu.

```
Ve větvi herna-v1 na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v docs/plany/herna-v1.md Co platí (hlavně Pointa není paměť), Formáty a Po T, v docs/plany/herna-v1-2.md jen Po K4 a Po K5 (Nad čím jsem váhal), docs/design.md (Pohyb, Bloky a aktivity, Přístupnost), skilly atlas-revize a atlas-psani. Archiv nečti. Z podkladů docs/podklady/herna.md čti jen místa, která ověřuješ.

Revize celé větve herna-v1 (K1 až T) podle skillu atlas-revize, perspektivy student, učitel, uživatel a přístupnost (skilly design:accessibility-review a design:design-critique). Zásada: nic se neboduje, nic se neučí nazpaměť, hra dá do ruky, podle čeho uvažovat, a stojí až tam, kde student lidi ze hry potkal. Hotový text se nepřepisuje; drobnosti oprav rovnou, zásadní nálezy seřaď podle dopadu s hotovým návrhem opravy.

1. Každý formát (Seřaď na ose, Kdo to řekl?, Tipni si, Kde to bylo?, Doplň citát, Páry, Pravý, nebo podvržený?, Najdi slabé místo, Kdo by to řekl?, Výpravy, Přehrát období, hra na medailoncích a ve třech profilech, Do hodiny, sebehodnocení, stránka Argumentační klamy a manipulace) na místě v antice i v dílně: čtyři otázky zásady (odnese si něco, přemýšlí sám, zůstává otevřená, chtěl by ji udělat i bez povinnosti) a otázka pilíře. Porovnej s odpověďmi v Po T a řekni, kde nesedí.
2. Texty přídavků z T a všech deseti karet Do hodiny přečti třikrát podle atlas-psani (čtivost, citáty, stroj) a proti podkladům: každé tvrzení, citát a místo v díle. Zvlášť: scéna Doplň citát (Menón 98a, Daidalovy sochy), Tipni si Epikúros a Cicero, napovědy Seřaď na ose (Xenofanés a Parmenidés tradovaně), hlasy Najdi slabé místo v cestě Kolik je dost? (Aristotelés 1099a, Seneca O blaženém životě 26), Kdo by to řekl? na otázce 1 očima studenta, kterému se druzí posmívají (Aristotelův stud).
3. Rozhodnutí z T zkontroluj a řekni, jestli platí: Doplň citát mimo kapitolu Soud, Najdi slabé místo mimo cestu 8, Pravý, nebo podvržený? před Závěrem cesty 1 (krok je hotový až s hrou), hry jen ve třech profilech, hra na stránce období a otázky ve frontmatteru, Parmenidés s Obranou 35c.
4. Telefon 390 a notebook 1440 px, světlý i tmavý režim, Klidný režim, jen klávesnicí (skutečný Tab na dvou výškách okna, scripts/kontrola-fokus.mjs), dotyk skutečnými událostmi přes CDP, cíle 44 px, axe. Snímky node scripts/snimky-herna.mjs a node scripts/snimky-herna-t.mjs (náhled sestaveného webu na portu 4323); celé stránky scripts/snimky-listy.mjs, kroky scripts/snimky-cesta.mjs. VoiceOver jen jako krok s autorem (pouceni: nastavení přístupnosti mění autor), připrav mu krátký postup.
5. Váha stránek osob a cest po K4 a K5 (node scripts/vaha-stranek-osob.mjs a --cesty): je někde co zmenšit bez ztráty?
6. Katalog hodin proti dist/ (node scripts/hodiny-katalog.mjs) a příprava hodiny s novými zastaveními (hry na stránkách období, otázky a profilů, karty Do hodiny) jen klávesnicí.
7. Záznam do docs/revize/herna-v1.md (nálezy podle dopadu: zásadní, důležité, drobné; u každého návrh opravy), drobnosti opravené rovnou s testy, celé npm test na pozadí s výstupem do souboru, commit, oddíl Po R v plánu s otázkami jen pro autora (prázdná odpověď = souhlas s doporučením), restart npm run dev, plán do Projektu Claude. Na konci zprávy napiš, na které snímky se mám podívat, a celý prompt pro O (do zprávy i do plánu), s modelem a úsilím. Zastav se.
```

## Po R (21. 11. 2026)

Revize celé větve je v `docs/revize/herna-v1.md`. **Verdikt: po opravách.** Technicky drží všechno (axe, fokus pod lištou, skutečný Tab na dvou výškách okna, dotyk přes CDP, cíle 44 px, katalog hodin). Zásadu „hra dá do ruky, podle čeho uvažovat“ ale na dvou místech porušuje sama stavba hry a šest nálezů se týká toho, kdo ve hře mluví.

**Nejdůležitější nálezy**

1. **Seřaď na ose (zásadní):** karty nesou jen jméno, napovědy přijdou až po chybě a roky stojí o obrazovku výš v Lidech a směrech; Xenofanés na stránce není. Oprava: napověda viditelná od začátku.
2. **Páry na Epikureismu (zásadní):** situace pro slast odpovídá i vysvětlení klidu pod pojmem a hlasu Epikúra na otázce 1; správná úvaha dostane „zkus to jinak“. Oprava: slast jen tělem podle VS 33.
3. **Kdo to řekl? z dat** neřekne, o čem věta je (rub jen se vztahem, razítka s nesouvisející větou `proc`). Oprava: pole `oCem` u dvanácti citátů.
4. **Parmenidés s Obranou 35c** (věta o soudci na stránce o bytí): vrátit Kdo žil dřív? Parmenidés a Sókratés.
5. **Kdo by to řekl? na otázce 1:** Aristotelův stud čte student, kterému se smějí, jako „máš se stydět“; Antisthenés na stránce nemluví. Oprava: `proc` se studem za vlastní činy, Diogenés (D. L. VI, 58) v lístku.
6. **Najdi slabé místo:** Seneka škrtá životopisem („sám byl bohatý“), ne důvodem. Nové `proc`.
7. **Pravý, nebo podvržený? v cestě 1:** Marcus, kterého student v první cestě nepotkal. Prótagorás „Člověk je měřítkem všech věcí“.
8. **Tipni si z dlouhého života** na čtyřech medailoncích je kvíz o letech bez vztahu: vyřadit.

**Opraveno rovnou:** hra stránky otázky (i osa hlasů) se při promítání hodiny neukázala, protože `#<slug>-po` čeká na první názor; `src/scripts/hodina-lista.ts` ho odkryje i pro blok uvnitř, test `tests/e2e/herna-r.spec.ts`. Tři věty přídavků: „napsali stoikové“ → „jsou od stoiků“ (Epiktétos nic nenapsal), scéna Menónu „bez obrazu“ → „co tím myslí“, napověda Sókrata „zapsal až jeho žák“ → „psali až jeho žáci“.

**Rozhodnutí z T:** Doplň citát mimo Soud platí, Najdi slabé místo mimo cestu 8 platí, Pravý před Závěrem cesty 1 platí, hra ve frontmatteru platí, hry ve třech profilech platí u Aristotela a Epiktéta, Parmenidés s Obranou 35c neplatí.

**Nové skripty:** `scripts/revize-herna-dotyk.mjs` (přídavky prstem přes CDP na 390 px, cíle 44 px, přetečení) a `scripts/revize-hodina-klavesnice.mjs` (příprava hodiny s novými zastaveními jen klávesnicí a promítání).

**Celé `npm test`:** kontrola typů bez chyb, 1590 testů ve Vitestu, v Playwrightu 899 z 900 (10,9 min). Spadl jen `denik-kapitoly.spec.ts:101` (kapitola Helenismus a Řím po obnovení), deníku se R nedotkla; samotný soubor pak prošel třikrát po sobě (30 z 30). Kdyby se objevil znovu, hledat příčinu (`docs/pouceni.md`, flaky).

**VoiceOver s autorem** (nastavení přístupnosti mění autor; asi deset minut, Safari a `npm run dev`):

1. V Safari otevři `http://localhost:4321/smer/stoicismus/#stoicismus-kdo-rekl`, zapni VoiceOver (Cmd + F5).
2. Tabulátorem na první razítko pod kartičkou: má zaznít jméno a věta, čím se ten člověk zabýval. Mezerník vybere. Po trefě má VoiceOver sám přečíst lístek („Sedí…“), po chybě „Zkus to jinak“ a napovědu.
3. `http://localhost:4321/obdobi/pocatky-a-klasicke-recko/#obdobi1-serad`: Tab na kartu, Enter ji zvedne, šipka dolů posune, Enter položí. Má zaznít jméno a „místo 2 z 5“.
4. `http://localhost:4321/cesta/kolik-je-dost/6/#cesta6-slabe`: Tab na větu, Enter ji přeškrtne. Má zaznít, že je přeškrtnutá, a pak lístek, kdo by ji škrtl s tebou.
5. Zapiš, co VoiceOver neřekl, řekl dvakrát, nebo řekl anglicky. Cmd + F5 ho vypne.

**Otázky jen pro autora** (prázdná odpověď = souhlas s doporučením):

1. Seřaď na ose: napovědy na kartách hned od začátku (doporučuji), nebo dál jen po chybě, s tím, že hra na období 1 je hlavně hádání? Odpověď:
2. Kdo by to řekl? na otázce 1: v lístku Diogenés s odpovědí na posměch (doporučuji, po ověření D. L. VI, 58), nebo dál Antisthenés, kterého student zná z cesty Čí život vlastně žiju?? Odpověď:
3. Pravý, nebo podvržený? v cestě 1: Prótagorás místo Marka Aurelia (doporučuji), nebo nechat Marka a smířit se s tím, že ho student v první cestě nezná? Odpověď:
4. Parmenidés: vrátit Kdo žil dřív? (doporučuji), nebo vybrat jinou hru z dat (Kde to bylo? s Athénami), pokud ji data unesou? Odpověď:
5. VoiceOver: projít s tebou v kroku O (doporučuji, deset minut u Macu), nebo odložit do Uzavření? Odpověď:

**Na které snímky se podívat** (`Claude outputs/snimky/`): `herna-t-obdobi1-serad-klid-390-light.png` (jen jména na šňůře; roky nad hrou na `t-obdobi1-390-light-1.jpg`), `herna-t-epikureismus-pary-klid-390-light.png` (vysvětlení klidu pod pojmem a situace po tréninku), `herna-t-jak-zit-kdo-by-cin-390-dark.png` (lístek s Aristotelovým studem), `herna-t-cesta6-slabe-cin-1440-light.png` (Seneka v lístku), `herna-t-cesta1-pravy-cin-390-light.png`, `revize-r-promitani-b-jak-zit-kdo-by.png` (promítání hry otázky před opravou: prázdná stránka).

Další krok: O v novém chatu, Opus 5.5 · high se skilly `atlas-komponenta` a `atlas-psani`; celé znění promptu je v Zadání O.

## Zadání O

Opus 5.5 · high, skilly `atlas-komponenta` a `atlas-psani`, pro nové citáty `atlas-overeni`, nový chat. VoiceOver jen s autorem u Macu.

```
Ve větvi herna-v1 na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v docs/plany/herna-v1.md Co platí, Formáty a Po R (i odpovědi autora; prázdná odpověď = souhlas s doporučením), celý záznam docs/revize/herna-v1.md, v docs/design.md Bloky a aktivity, Přístupnost a Referenční snímky, skilly atlas-komponenta a atlas-psani; před každým novým citátem nebo připsáním skill atlas-overeni. Archiv nečti. Ze src/ čti jen soubory, které nálezy jmenují.

Opravy po revizi R. Hotový text mimo bloky herny se nemění; nové věty piš skillem atlas-psani a ověř proti místu v díle.

1. Seřaď na ose (zásadní): napověda karty viditelná od začátku pod jménem, karta bez napovědy dostane první větu proc z dat, „zkus to jinak“ jmenuje obrácenou dvojici. Změř šňůru na 390 px. Testy herna-k1, herna-k2 a data.
2. Páry na Epikureismu (zásadní): nové znění páru slast podle záznamu revize, zdroj gnomologium-vaticanum.
3. Kdo to řekl? z dat: nepovinné pole oCem u citátu v zdroje.yaml, obsahAktivity ho dá na rub nad vztah, výběr bere jen citáty s oCem (kontrola při sestavení). Dvanáct citátů z výpisu npx vite-node scripts/herna-k4-vypis.ts (výpis nejdřív uprav, ať zná HraOsoby v profilech).
4. Parmenidés: zpět řádek KdoZilDriv a="parmenides" b="sokrates" druh="vzdalenost"; ověř výpisem, že se hry medailonků kolem nezměnily.
5. Kdo by to řekl? na otázce 1: nové proc Aristotela (ověř EN IV, 9, 1128b21–29) a Diogenés s D. L. VI, 58 místo Antisthena v lístku (nový citát přes atlas-overeni; když se nepotvrdí, nech Antisthena a napiš proč).
6. Najdi slabé místo v Kolik je dost?: nové proc Seneky ze záznamu.
7. Pravý, nebo podvržený? v cestě 1: Prótagorás „Člověk je měřítkem všech věcí.“ jako připsání druhu pravy (Theaitétos 152a, doklad, kde koluje) místo Marka.
8. Tipni si na stránkách osob jen z četby přes lidský život; dlouhý život z kandidátů vyřaď a podle výpisu zkontroluj, co dostanou Démokritos, Gorgiás, Isokratés a Pyrrhón.
9. Drobné: vysvětlení Tipni si na období 2 a název her z dat v katalogu hodin („Čí je ta věta? · u Theofrasta“).
10. Referenční snímky nových formátů v tests/e2e/snimky.spec.ts (jedna hra herny na telefonu a notebooku, den a noc; po --update-snapshots si je prohlédni), docs/design.md (Seřaď na ose s napovědou, oCem, promítání bloku pod prvním názorem) a docs/pouceni.md (poučení z R jednou větou každé).
11. VoiceOver: jestli je autor u Macu, projdi s ním postup z Po R a zapiš, co čtečka řekla; jinak to zapiš do Co zůstává na později.
12. Snímky oprav (node scripts/snimky-herna.mjs a node scripts/snimky-herna-t.mjs nad náhledem sestaveného webu na portu 4323) si prohlédni na 390 a 1440 px v obou režimech; node scripts/revize-herna-dotyk.mjs a node scripts/revize-hodina-klavesnice.mjs znovu. Celé npm test na pozadí s výstupem do souboru, docs/rozhodnuti.md, commit, oddíl Po O v plánu s jedinou otázkou pro autora (schválení větve), restart npm run dev, plán do Projektu Claude. Na konci zprávy napiš, na které snímky se mám podívat, a celý prompt pro Uzavření (do zprávy i do plánu), s modelem a úsilím. Zastav se.
```
