# Revize větve herna-v1 (R, 21. 11. 2026)

Opus 5.5 · high, skill `atlas-revize` (perspektivy student, učitel, uživatel, přístupnost), `atlas-psani`, plugin Design (`accessibility-review`, `design-critique`). Celá větev K1 až T: jedenáct formátů herny v dílně a na místě v antice, hry na 34 medailoncích a ve třech profilech, Do hodiny v deseti cestách, sebehodnocení a stránka klamů.

**Verdikt: po opravách.** Formáty jsou technicky v pořádku (axe, fokus, dotyk, cíle 44 px na všech místech bez nálezu). Zásadu „hra dá do ruky, podle čeho uvažovat“ ale na dvou místech nedrží samotná stavba hry: Seřaď na ose dává studentovi jen jména a roky stojí o obrazovku výš, Páry trestají správnou úvahu. Šest důležitých nálezů jsou hlasy a výběr lidí: kdo ve hře mluví, jestli ho student potkal a jestli dostal nejsilnější důvod.

## Zásadní

### [zásadní] Seřaď na ose nedává do ruky, podle čeho řadit
- **Kde:** `src/components/ostrovy/SeradNaOse.svelte` (karta nese jen `karta.text`), `src/lib/herna/poradi.ts › verdiktPoradi`; přídavek `obdobi1-serad` na stránce období 1, dílna.
- **Co je špatně:** Otázka zní „Kdo s kým mluvil a kdo koho učil?“, karty ale nesou jen jméno. Napovědy (kdo koho učil) se ukážou až po chybné kontrole, a to jen u první obrácené dvojice. O obrazovku výš stojí v Lidech a směrech čtyři z pěti lidí i s roky; Xenofanés na stránce není vůbec.
- **Proč to vadí studentovi:** Napoprvé buď opíše roky z oddílu nad hrou, nebo hádá. To je přesně „roky jako učivo“, které zásada Pointa není paměť vylučuje; Po T tvrdí, že pořadí skládá z napověd, a to nesedí.
- **Oprava:** Napověda karty viditelná od začátku pod jménem (tiskem jako věta `proc` pod razítkem v Kdo to řekl?: Newsreader 14 px, `--ink-2`, nová třída `.karta-osy__napoveda`); karta bez `napoveda` v YAML dostane první větu `proc` z dat. „Zkus to jinak“ pak jmenuje obrácenou dvojici (`„Platón“ a „Sókratés“ zatím visí obráceně.`, větev, která v `verdiktPoradi` už je). Na 390 px změř výšku šňůry (pět karet se dvěma řádky). Testy: `herna-k1.spec.ts`, `herna-k2.spec.ts` (text verdiktu), `tests/data/herna-*.test.ts`, snímek dílny.

### [zásadní] Páry na Epikureismu trestají správnou úvahu
- **Kde:** `src/content/bloky/epikureismus-pary.yaml`, pár `slast`.
- **Co je špatně:** Situace „Po tréninku si sedneš, nic tě nebolí a ničeho se nebojíš, a víc nepotřebuješ“ má být slast. Pod pojmem klid ale stojí „mysl, kterou nic nerozbouří, ani strach, ani touha po dalším“, a hlas Epikúra na otázce 1 říká, že nejvyšší slast je klid, „kdy nic nebolí a ničeho se nebojíš“.
- **Proč to vadí studentovi:** Kdo situaci spojí s klidem, čte vysvětlení pod pojmem přesně, a dostane „zkus to jinak“. Hra ho učí, že atlas sám sobě odporuje.
- **Oprava:** Slast jen tělem, podle VS 33 (bez jídla, `docs/podklady/herna.md` › 4):
  - `situace`: „Po tréninku si sedneš, nemáš žízeň, není ti zima, nic tě nebolí a víc v tu chvíli nechceš.“
  - `jinak`: „Tady jde o tělo, kterému nic nechybí: nebolí, nežízní, nemrzne.“
  - `vazba`: „Epikúros tomu říkal hlas těla. Kdo tohle má, mohl by se podle něj o štěstí přít i se samotným Diem.“
  - `zdroje`: přidat `gnomologium-vaticanum`. Test `pruchod`/`herna-k3` hledá páry podle id, ne podle věty (ověř `grep -rn "Po tréninku" tests/`).

## Důležité

### [důležité] Kdo to řekl? z dat neřekne, o čem věta je
- **Kde:** `src/lib/herna/aktivity.ts › obsahAktivity` (pole `pointa` = vztah), 9 medailonků a profily Aristotela, Parmenida a Epiktéta.
- **Co je špatně:** Rub řekne jen vztah („Theofrastos se učil u Aristotela.“). Razítka nesou `proc`, které s větou nesouvisí (věta o vlaštovce × „Zkoumal živou přírodu, úsudek i obec“). Co platí přitom chce, aby odkrytí řeklo, o čem věta je a kdo na koho navázal; Po T to vědomě přiznává.
- **Proč to vadí studentovi:** Vybere podle toho, na čí stránce je (učitel osoby stránky), a odejde se jménem, ne s myšlenkou.
- **Oprava:** Nepovinné pole `oCem` u citátu v `zdroje.yaml` (jedna věta, o čem citát je, skillem `atlas-psani`); `obsahAktivity` ho dá na rub nad vztah; výběr pro Kdo to řekl? z dat bere jen citáty s `oCem` (kontrola zastaví sestavení). Dvanáct citátů z výpisu `npx vite-node scripts/herna-k4-vypis.ts`; u hlasu otázky jde vzít první větu odpovědi hlasu.

### [důležité] Parmenidés s Obranou 35c: věta, která s ním nemá nic společného
- **Kde:** `src/content/osobnosti/parmenides.mdx:114` (`<HraOsoby osoba="parmenides" />`).
- **Co je špatně:** Na stránce o bytí a nebytí hádá student Sókratovu větu o soudci a laskavosti. Rub řekne jen „Vypráví se, že se Parmenidés a Sókratés znali“. Táž věta nese stránku klamů (trik se soucitem).
- **Proč to vadí studentovi:** Nic z věty nepatří k Parmenidovi ani k tomu, co o obrazovku výš četl; je to hádání jména.
- **Oprava:** Vrátit původní řádek `<div class="ctenarsky"><KdoZilDriv a="parmenides" b="sokrates" druh="vzdalenost" /></div>` a import `KdoZilDriv` místo `HraOsoby` (vzdálenost starého Parmenida a mladého Sókrata nese scénu profilu). Pak výpis aktivit: medailonky kolem se nesmějí změnit, jinak upravit testy (`stranky-osob.spec.ts`, `herna-k4.test.ts`).

### [důležité] Kdo by to řekl? na otázce 1 očima studenta, kterému se druzí posmívají
- **Kde:** `src/content/bloky/jak-zit-kdo-by.yaml` (`odmitl` Aristotelés, `atlas` Antisthenés).
- **Co je špatně:** (a) Pod „Kdo by větu odmítl“ stojí „Mladé, kteří se stydí, chválíme.“ Aristotelés tam mluví o studu za vlastní špatné činy, lístek to ale neříká. (b) Atlas navrhuje Antisthena, jediného z trojice, který na stránce nemluví.
- **Proč to vadí studentovi:** Šestnáctiletý, kterému se ve třídě smějí, čte: v tvém věku se máš stydět a je to chvályhodné. A lístek ho posílá k člověku, kterého na stránce nepotkal.
- **Oprava:** (a) `proc` u Aristotela: „Namítl by, že strach o dobré jméno drží mladé od špatných činů. Stud podle něj patří jen k tomu, co člověk sám udělal:“ (ověřit EN IV, 9, 1128b21–29: stud se týká špatných a dobrovolných činů). (b) Místo Antisthena Diogenés, hlas stránky: D. L. VI, 58, odpověď na „Spousta lidí se ti směje“ (osli a lidé), po ověření skillem `atlas-overeni` jako nový citát; `proc`: „Podepsal by ji. Na posměch odpovídal po svém:“. Antisthenés zůstane jako možnost, jen bez lístku.

### [důležité] Najdi slabé místo v Kolik je dost?: Seneka škrtá životopisem, ne důvodem
- **Kde:** `src/content/bloky/cesta6-slabe.yaml`, premisa `navic`, `proc` u Seneky.
- **Co je špatně:** „Sám byl velmi bohatý a ve spise o blaženém životě se proti výčitkám bránil:“ dává Senekovi místo důvodu obhajobu sebe. Táž věta (O blaženém životě 26, 1) je na otázce 1 jeho hlasem „hlídej, kdo komu slouží“.
- **Proč to vadí studentovi:** Student, který premisu 2 škrtne, dostane spojence, který vypadá, že se jen hájí. Nejsilnější verze Seneky to není.
- **Oprava:** `proc`: „Že každé „navíc“ je prázdná představa, by nepřijal:“ (citát pak řekne proč, nic neopakuje dopředu).

### [důležité] Pravý, nebo podvržený? v cestě 1: Marcus, kterého student ještě nepotkal
- **Kde:** `src/content/bloky/cesta1-pravy.yaml`, třetí ústřižek `pomsta-nebyt-jako-on`.
- **Co je špatně:** Cesta 1 je první cesta atlasu; Marcus Aurelius přijde až v cestě 5. Po dvou „neřekl to“ rozhoduje student podle vzoru, ne podle toho, čím se ten člověk zabýval.
- **Proč to vadí studentovi:** Hra stojí tam, kde lidi ze hry nepotkal, a „sedí“ dostane za tip.
- **Oprava:** Pravá věta člověka z cesty 1: Prótagorás, „Člověk je měřítkem všech věcí.“ (Platón, Theaitétos 152a; i D. L. IX, 51), nový záznam `pripsani` druhu `pravy` se `skutecne: theaitetos-152a` a dokladem, kde koluje (skill `atlas-overeni`). `overeni`: „Prótagorův spis se nedochoval. Větu ale cituje Platón, který s ní nesouhlasil, a to je dobrý důvod jí věřit.“ Marcus zůstává na stránce klamů a v dílně.

### [důležité] Tipni si z dlouhého života na medailoncích je kvíz o letech
- **Kde:** `src/lib/herna/aktivity.ts › kandidatiAktivit` (`DLOUHY_ZIVOT`), medailonky Démokrita, Gorgia, Isokrata a Pyrrhóna.
- **Co je špatně:** Dvojice nemá vztah (Gorgiás a Diogenés), odpověď je čtyřikrát „mohli se potkat“ a nic o tom, kdo na koho navázal.
- **Proč to vadí studentovi:** Je to přesně „roky a přesné životy jako učivo“; čtvrtý stejný vzor se naučí a hádat přestane.
- **Oprava:** Tipni si na stránce osoby jen z četby přes lidský život (vztah vliv přes texty: Cicero a Platón, Kleanthés a Hérakleitos); dlouhý život z kandidátů vyřadit. Ty čtyři stránky dostanou podle výpisu Kdo to řekl?, Kde to bylo?, nebo Kdo žil dřív?; testy `herna-k4.test.ts` (počty druhů).

## Drobné

### [drobné] Tipni si na období 2 zavírá, co mělo zůstat otevřené
- **Kde:** `src/content/bloky/obdobi2-tipni.yaml`, `vysvetleni`.
- **Co je špatně:** „Spor se nemusí vést tváří v tvář“ rozhodne otázku, kterou Po T nechává na studentovi. Roky obou stojí v hlavičce hry, takže odhad je odečítání.
- **Oprava:** `vysvetleni`: „Cicero nesouhlasil s člověkem, který zemřel dávno před jeho narozením, a přel se s ním přes knihy. Je to ještě spor, když druhý už nemůže odpovědět?“

### [drobné] Dvanáct her z dat má v přípravě hodiny stejný název
- **Kde:** `src/lib/hodiny.ts`, katalog: `b:hra-<osoba>-kdo-rekl` s názvem „Čí je ta věta?“.
- **Co je špatně:** Ve výsledcích hledání je učitel rozezná jen podle skupiny stránky.
- **Oprava:** V katalogu (ne na stránce) název „Čí je ta věta? · u Theofrasta“ (2. pád jména z dat, jako `kde` u míst); test `hodina-*.spec.ts` podle id.

## Opraveno rovnou

- **Hra stránky otázky se při promítání neukázala.** Zastavení `b:jak-zit-kdo-by` (i `b:jak-zit-osa`) otevřelo stránku se skrytým `#jak-zit-po`: odkrývalo se jen u hlasů. `src/scripts/hodina-lista.ts › oznacUsek` odkryje i blok uvnitř `.po`; test `tests/e2e/herna-r.spec.ts`.
- **„Dvě z těch tří vět napsali stoikové“** → „jsou od stoiků“: Epiktétos nenapsal nic, Rukojeť sepsal Arriános (`stoicismus-kdo-rekl.yaml`).
- **Scéna Doplň citát:** „Pak to řekne bez obrazu:“ → „Pak řekne, co tím myslí:“; citát obraz přivázání drží dál (`sokrates-doplnit-sochy.yaml`).
- **Napověda Sókrata v Seřaď na ose:** „Jeho rozhovory zapsal až jeho žák.“ → „O rozhovorech s ním psali až jeho žáci.“ Platónovy dialogy nejsou zápis a psal i Xenofón (`obdobi1-serad.yaml`).

## Čtyři otázky zásady: kde Po T nesedí

| Formát a místo | Odnese si | Přemýšlí sám | Otevřená | Chtěl by | Pilíř | Proti Po T |
| --- | --- | --- | --- | --- | --- | --- |
| Seřaď na ose, období 1 | řetěz rozhovorů, až po odkrytí | **ne:** jména bez napověd, roky o obrazovku výš | ano | ano | ano | nesedí „pořadí z napověd“ (zásadní) |
| Tipni si, období 2 | spor na dálku | slabě: roky v hlavičce, odečítání | **ne:** vysvětlení rozhodne | ano | ano | nesedí „otevřená“ (drobné) |
| Kdo to řekl?, Stoicismus | škola podle myšlenky | ano (`proc` a napověda) | ano | ano | ano | sedí |
| Doplň citát, Sókratés | mít pravdu × vědět proč | ano | ano | ano | ano | sedí; vazbu na Lachéta student musí udělat sám, scéna ji neříká |
| Páry, Epikureismus | slast a klid nejsou zábava | **ne u slasti:** správná úvaha dostane „zkus to jinak“ | ano | ano | ano | nesedí (zásadní) |
| Pravý, nebo podvržený?, cesta 1 | ověřit citát | ano u Sókrata, **ne** u Marka | ano | ano | ano | nesedí u třetí karty |
| Najdi slabé místo, cesta 6 | kde nesouhlasit a s kým | ano | ano | ano | ano | sedí; Seneka slabší, než by měl být |
| Kdo by to řekl?, otázka 1 | stará myšlenka k dnešní větě | ano | ano | ano | ano, s výhradou studenta, kterému se smějí | nesedí „potkal“ u Antisthena |
| Hry z dat (medailonky, profily) | vztah | **ne** u Kdo to řekl? (razítka bez souvislosti), Tipni si z dlouhého života | ano | střídání ano | slabě | Po T přiznává, Co platí chce víc |
| Kde to bylo? (medailonky, dílna) | odkud kdo byl a kam musel | ano | ano | ano | ano | sedí |
| Výpravy, Přehrát období | orientace v době | Výpravy ano; Přehrát období se jen dívá | ano | ano | ano | sedí; Přehrát období zůstává nástrojem, ne aktivitou |
| Do hodiny (10 cest) | rozhovor místo zkoušení | ano | ano | ano | ano | sedí; každá karta drží, co cesta opravdu dělala |
| Sebehodnocení | dvě poznámky bez známky | ano | ano | nepovinné | ano | sedí |
| Stránka klamů | trik, který vypadá jako důvod | ano | ano | ano | ano | sedí (bez nového čtení textu; revize K5 bez nálezu) |

## Rozhodnutí z T

- **Doplň citát mimo kapitolu Soud:** platí. Menón 98a navazuje na Lachéta, který odvahu poznal a neuměl říct proč; hra stojí za posledním odstavcem kapitoly, ne uprostřed scény.
- **Najdi slabé místo mimo cestu 8:** platí. Třetí útok na Epikúrův argument o smrti by byl stejnou scénou podruhé.
- **Pravý, nebo podvržený? před Závěrem cesty 1:** platí. Krok 7 je hotový až s hrou, a to je v pořádku: hra je poslední případ před pravidlem. Výměna třetí karty viz nález.
- **Hry jen ve třech profilech:** platí pro Aristotela a Epiktéta, **ne pro Parmenida** (nález výš).
- **Hra na stránce období a otázky ve frontmatteru:** platí; promítání hry na stránce otázky bylo rozbité a je opravené.
- **Parmenidés s Obranou 35c:** neplatí, vrátit Kdo žil dřív? Parmenidés a Sókratés.

## Texty a prameny (třikrát podle `atlas-psani`)

Čteno: osm přídavků z T, deset karet Do hodiny a všechny citáty, které nesou, proti `zdroje.yaml` a podkladům. Všechna místa sedí (Menón 98a; EN I, 8, 1099a31–33; O blaženém životě 26, 1; VS 33 a 68; Rukojeť 5; Hovory II, 1; D. L. VI, 8; EN IV, 9, 1128b16–20; Metafyzika A 5 pro Xenofana a Parmenida jako „říkalo se“; Parmenidés 127b pro starého Parmenida a mladého Sókrata). Cicero proti Epikúrovi: vztah polemika z IEP. Strojové obraty v přídavcích nejsou; zpětné vazby nezačínají pochvalou. Karty Do hodiny: věty do 25 slov, bez rodu studenta, každá se ptá na to, co cesta dělala (třetí krok cesty 34 je opravdu počítání dne, Epiktétova socha je v pokusu cesty 5, Cicero a Epikúros v kroku 6 cesty 33, chléb a voda v kroku 7 cesty 6).

## Technika

- **axe** (WCAG 2 AA) na 14 stránkách s přídavky a hrami, 390 a 1440 px, den i noc: 0 nálezů (`scripts/revize-axe.mjs`).
- **Fokus pod lištou, překryvy, přetečení** (`scripts/kontrola-fokus.mjs`, totéž): v pořádku.
- **Skutečný Tab** na 1440 × 900 a 920 a 390 × 844 a 640 (`scripts/revize-tabulator.mjs`): krok 7 cesty 1, krok 6 Kolik je dost?, Epikureismus, Sókratés a obě období na všech čtyřech oknech, Stoicismus na 1440 px, bez potíží. Jeden běh na 390 × 844 spadl na zavřeném prohlížeči a po opakování prošel.
- **Dotyk skutečnými událostmi přes CDP** na 390 px (`scripts/revize-herna-dotyk.mjs`, nový): všech osm přídavků reaguje na prst, tažení karty v Seřaď neposune stránku, cíle aspoň 44 px, nic nepřetéká.
- **Příprava hodiny jen klávesnicí** (`scripts/revize-hodina-klavesnice.mjs`, nový): pět nových zastavení přidaných hledáním a Enterem, promítnutých Tab na Další; hra otázky byla skrytá (opraveno). Období 2 je ve výsledcích až po 54 tabulátorech, protože hledání vrátí celou stránku s oddíly.
- **Katalog hodin** proti `dist/` (`scripts/hodiny-katalog.mjs`): 182 stránek, 0 chyb.
- **Váha stránek:** medailonky 54 až 66 kB HTML (13 až 15 kB gzip), profily 115 až 190 kB (Aristotelés 183 kB, z toho 21 kB vlastností ostrovů: dva Roztřiď po 4 kB, hra 2,7 kB). Hra z dat nese jen to, co ukazuje; zmenšit bez ztráty nejde nic podstatného. Kroky cest s přídavkem: krok 7 cesty 1 55,3 kB, krok 6 Kolik je dost? 59,0 kB, průměr cest 52,5 kB.
- **Klidný režim a omezený pohyb:** hlídají `herna-k1` až `herna-k5.spec.ts` a `klidny-rezim.spec.ts` v celém `npm test`; přídavky používají tytéž komponenty.
- **VoiceOver:** nastavení přístupnosti mění autor; postup pro něj je v plánu (Po R).
