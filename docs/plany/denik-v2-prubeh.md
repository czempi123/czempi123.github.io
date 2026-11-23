# Větev denik-v2: průběh kroků

Zápisy „Po …“ starších kroků větve `denik-v2` (výsledky, nad čím krok váhal). Plán, formáty, tabulka kroků a poslední zápis jsou v `docs/plany/denik-v2.md`, zadání kroků v `docs/plany/denik-v2-zadani.md`. Rozděleno 22. 11. 2026 v K3, aby plán zůstal pod 35 kB pro Projekt.

## Po Plán (22. 11. 2026)

- **GitHub:** po výslovném povolení autora poslán `main` z cloudu přes git bundle (`d68e6ec..fd86def`; balíček přes složku `Claude outputs`, ke které autor dal přístup). Stejnou cestou poslat `main` i v Uzavření.
- **Kontrola nasazení herna-v1** (zapsaná v `docs/archiv/plany/herna-v1.md` › Po Uzavření, bod 3): zveřejnění prošlo a nasazený web herna-v1 ukazuje (`Claude outputs/nasazeni-herna-v1/`). Sestavení a kontroly ale skončily zrušením: spadl `herna-k2.spec.ts:278` (dotyk do slepé mapy na telefonu) a limit 20 minut nestačil na 902 testů. Oprava je první část K1.

## Po K1 (22. 11. 2026)

**Kontroly na GitHubu.**
- Log běhu přes API stáhnout nejde (403, chce administrátorská práva k repozitáři) a připojení repozitáře z cloudu automatická kontrola oprávnění znovu zamítla. Chybu ale ukázaly veřejné anotace běhu (`api.github.com/repos/czempi123/czempi123.github.io/check-runs/137191863017/annotations`): `herna-k2.spec.ts:306`, po `tap()` do `.slepa` žádný `.spendlik`, v prvním i opakovaném pokusu; testy pak po 18,5 minuty zrušil limit 20 minut.
- **Příčina:** komponenta je v pořádku. Klepnutí krátce po dotykovém tažení na téže stránce (lístek v Doplň citát) Chromium na Linuxu za klepnutí nepovažuje a `click` nevznikne. V cloudu (Linux, `CI=true`, klon `main`) to jde vyvolat: bez čekání i s čekáním 150 a 300 ms test padl čtyřikrát ze čtyř, s 500 ms prošel; GitHub je pomalejší a 500 ms mu nestačilo. Na Macu se klepnutí rozpozná hned.
- **Oprava v testu:** Kde to bylo? se klepe na nové stránce téhož kontextu, čekání 500 ms je pryč. V cloudu 12 z 12 při čtyřech souběžných bězích, na Macu celý `herna-k2.spec.ts` 19 z 19. Limit v `.github/workflows/kontroly.yml` je 30 minut. Věta o příčině je v `docs/pouceni.md` › Technika.
- Zelené kontroly se ukážou až po sloučení do `main` v Uzavření; na GitHub se v K1 nic neposlalo.

**Datový základ v `src/lib/denik.ts`** (bez UI):
- Typy `Karticka`, `ZdrojKarticky`, pole `karticky` v deníku podle Formátů; konstanty `ROZESTUP` (0, 1, 3, 7, 16, 35), `PRIHRADKA_NEJVYS`, `HROMADKA` (5).
- Čisté funkce: `sKartickou`, `bezKarticky`, `sHodnocenim` (Vím o přihrádku dál, nejvýš pátá; Zopakuj si do první), `naRade(d, dnes, zdrojExistuje?)`, `hromadka(d, dnes, 5, zdrojExistuje?)`, `naRadeOd`, `jeNaRade`, `maZdroj`, `klicKarticky`, `mistniDatum`, `posunDatum`. Pro ostrovy: `pridatKarticku`, `vyndatKarticku`, `ohodnotitKarticku`, `maKarticku`.
- Citáty: `poznamka` a `upraveno` u `CitatVDeniku`, `CITATY_NEJVYS = 300`, `sbirkaPlna`. `sCitatem` vrací `null`, když je sbírka plná a citát v ní není; `vystrihniCitat` vrací `false`. `sPoznamkouCitatu` a `ulozPoznamkuCitatu` (prázdná poznámka se smaže).
- `rozeberDenik` pročistí kartičky (zdroj, přihrádka 0–5, datum RRRR-MM-DD, klíč se složí znovu) i poznámky; `spojDeniky` spojí kartičky (vyhraje novější `kdy`) a poznámky citátů (vyhraje novější `upraveno`, i smazaná). Export je JSON celého deníku, takže obojí obsahuje beze změny `exportuj`.

**Testy.** Nový `tests/data/karticky.test.ts` (rozestup přes všech pět přihrádek, Zopakuj si, hromádka a Ještě pět, zdroj, který zmizel, týden a měsíc bez návštěvy, půlnoc a změna času, spojení dvou deníků, poškozený soubor, starý deník bez polí, plná sbírka, uložení a export). Ve čtyřech časových pásmech (UTC, Praha, Auckland, Los Angeles) prošel spolu s `denik.test.ts` a `zapisnik.test.ts`: 67 z 67. Test stropu sbírky v `zapisnik.test.ts` hlídá nové chování (plná sbírka citát nepřijme). Celé `npm test` na Macu: kontrola typů bez chyb, Vitest 1613 z 1613, Playwright 902 z 902 (10,5 min). Commit `e51262b`.

Pro kontrolu jako na GitHubu běželo celé `npm test` i v cloudu (Linux, `CI=true`, jeden pracovník, 38 min): 899 prošlo, dva testy napodruhé (`denik-kapitoly.spec.ts:101`, `mapa.spec.ts:448` na 1280 px) a jeden spadl i napodruhé: `mapa.spec.ts:448` na 1440 px (názvy událostí na posuvníku se potkají). Ten padá v cloudu asi jednou ze tří i na čistém `main` bez změn K1, takže ho K1 nezpůsobil. Na GitHubu se v běhu 45017169458 nehlásil; kdyby po sloučení spadl tam, patří do Uzavření jako samostatná oprava (měření šířky názvů v Linuxu).

**Nad čím jsem váhal.**
- *Kartička bez zdroje se neukáže, ale nesmaže.* Plán říká „tiše zmizí“. Smazání by ale vzalo i přihrádku pokaždé, když student v bloku dá Začít znovu a napíše odpověď znovu (Začít znovu zápis maže). Kartička bez citátu nebo bez zápisu s textem se proto v hromádce neukáže a vrátí se, když se zdroj vrátí. Pojmy a otázky kvízu deník nezná: `hromadka` bere `zdrojExistuje` od volajícího (K2 a K3 předají seznam z dat); bez něj je bere jako existující. Kdyby se tichá kartička někde ukázala (stisknuté Do kartiček u smazaného zápisu), K3 ji může mazat při Vyndat ze sbírky a Začít znovu.
- *Test, nebo komponenta?* Komponenta by se dala přepsat na `pointerup` místo `click` a na rychlosti by nezávisela. Změnila by ale chování: klepnutí, které jen zastaví dojíždějící posun stránky, by zapíchlo špendlík. Skutečný student lístek nepřetáhne a do mapy neklepne do půl sekundy; problém je jen v testu, a tak se opravil test.
- *Spojení deníků bez stropu.* Dvě sbírky dohromady můžou mít víc než 300 citátů. Spojení nic nevyhodí (s citátem by zmizela poznámka a kartička); plná sbírka jen nepřijme další vystřižení.
- *Znovu vystřižený citát* se posune navrch a poznámku si nechá; jde to i v plné sbírce, protože nic nepřibývá.
- *„Ještě pět“* nepotřebuje vlastní funkci: kartičky ohodnocené dnes už na řadě nejsou, takže další `hromadka` vrátí dalších pět. Hranici „Na dnes stačí“ po první pětce drží ostrov (K3).
- *Datum.* Dnešek je místní datum (`mistniDatum`), rozestup se přičítá k datu v UTC (`posunDatum`), aby změna času den neposunula. Kartička ohodnocená ve 23:59 je na řadě další den ráno, ne o 24 hodin později.
- *Přihrádka ze souboru mimo 0–5* se ořízne; přihrádka bez data posledního opakování se bere jako nová kartička.
- `vystrihniCitat` už pozná plnou sbírku, ale `src/scripts/vystrihnout.ts` výsledek zatím nečte; hláška „sbírka je plná“ patří do K4.

## Po K2 (22. 11. 2026)

**Skladatel otázek** (`src/lib/herna/zustalo.ts`, čisté funkce; data čte `src/lib/herna/zustalo-data.ts` přes `import.meta.glob` jako text, takže totéž běží při sestavení, ve Vitestu i ve výpisu):
- Antika dává 68 otázek: myšlenka v situaci 16, hlas k případu 41, obraz a otázka 11. Celý výpis jako text: `Claude outputs/zustalo-antika.md` (skript `npx vite-node scripts/zustalo-vypis.ts`), i s tím, co do kvízu nepřišlo.
- *Pojem:* situace z Párů (`epikureismus-pary` před `dilna-pary`), jinak `priklad`, jen když nejmenuje pojem ani jeho tvary (vypadlo deset pojmů: ctnost, dialog, duše, etika, idea, látka, mýtus, obec, osud, rozum). Další dvě možnosti z téhož bloku Párů, jinak z pojmů téhož období, nikdy pojem, který situace jmenuje. Vysvětlení: první věta `vysvetleni` a „Najdeš ho u: …“ z `uKoho`. Potká: výskyty pojmu a stránka pojmu.
- *Hlas:* úvodní případ stránky otázky (odstavce před první komponentou, bez odstavce, který uvádí citát dvojtečkou), zadání „Co by ti na to řekl X?“, možnosti jsou odpovědi tří hlasů téže otázky, přednostně jiného směru. Odpověď, která vysloví jméno některého mluvčího, vypadne (Diogenés v Jak spolu máme žít?). Vysvětlení: citát hlasu s údajem, bez citátu důvod z myšlenky. Potká: stránka otázky.
- *Kresba:* jedenáct kreseb v cestách antiky; podnět „Kresba „…“. “ a úsek textu kroku, možnosti tři velké otázky, ke kterým vede cesta antiky. Vysvětlení: krok a cesta. Potká: krok.
- Kontrola při sestavení (`chybyZustalo`) zastaví build: situace nejmenuje svůj pojem, tři různé možnosti se správnou mezi nimi, vysvětlení a podnět z dat, kresba neprozradí otázku, id jen jednou.
- Výběr kola: jen potkané (kroky cest z deníku, navštívené stránky, čtení profilů, stránky s aktivitou), nejvýš osm, nejvýš čtyři jednoho druhu, dva stejné nikdy po sobě (kolo se zkrátí, když jeden druh převládá), pořadí ze semínka `zustalo:<kolo>`. Pod čtyři otázky pozvánka do první nedokončené cesty antiky.

**Ostrov** `src/components/ostrovy/CoTiZustalo.svelte` v rámu aktivity (nadtitulek = druh otázky), obal `src/components/denik/CoTiZustalo.astro` skládá katalog. Otázka po otázce s „Otázka 3 z 8“ (postup, ne výsledek), jedna odpověď, hned rub v lístku s páskou (`aria-live`, fokus na něj): „Víš.“ / „Zopakuj si.“ (`VIS`, `ZOPAKUJ_SI`, `vybaveni()` vedle „Sedí.“ v `verdikt.ts`), vysvětlení a odkaz zpět na první místo z `potkal`, kde student opravdu byl. Možnosti po odpovědi leží: zvolená vtlačená, správná s ✓ a tučně, pro čtečku „(tvoje odpověď)“, „(správná odpověď)“. Konec kola bez počtu: „Tohle si zopakuj“ se seznamem a odkazy zpět, Dát do kartiček (`pridatKarticku('zustalo', id)`, pak „✓ V kartičkách“ a fokus na Nové kolo) a Nové kolo; uprostřed kola Začít znovu. Oddíl „Co ti zůstalo?“ stojí na stránce Tvoje antika pod přehledem (texty v `TVOJE_ANTIKA.zustalo`), ukázka v dílně (`/dilna/bloky/#h-zustalo`) s připraveným deníkem dvou prošlých cest a vlastním klíčem stavu `co-ti-zustalo/dilna`.

**Testy.** `tests/data/zustalo.test.ts` (20: text, skládání, kontrola, data antiky včetně „žádná situace nejmenuje svůj pojem“ a vět kreseb doslova v kroku, výběr kola na 30 kolech, deník, stav). `tests/e2e/co-ti-zustalo.spec.ts` (6: pozvánka, průchod celým kolem klávesnicí s obnovením stránky uprostřed a kartičkami, Začít znovu, čtečka a axe ve světlém i tmavém režimu, omezený pohyb a 44 px na 390 px, dílna). Snímky: `Claude outputs/snimky-zustalo/` (prázdný deník, prošlé dvě cesty s rubem, konec kola; 390 a 1440 px, světlý i tmavý; ve světlém i celá stránka), skript `scripts/snimky-zustalo.mjs`. Celé `npm test` na Macu: kontrola typů bez chyb, Vitest 1633 z 1633, Playwright 907 z 908 (11,1 min). Spadl `denik-kapitoly.spec.ts:101` (po obnovení stránky je otevřená i kapitola Helenismus a Řím); sám padá dvakrát z pěti a K2 stránku deníku nemění. Tentýž test hlásil cloud už v Po K1 jako opakovaný. `otevreneKapitoly` otevře kapitolu, ve které student byl po uložení stavu kapitol, takže podezření je zápis času v deníku při načtení stránky; oprava patří do O nebo do Uzavření.

**Nad čím jsem váhal.**
- *Věta ke kresbě.* Věta nad kresbou vybraná skriptem sedla jen u tří kreseb z jedenácti; jinde vyšla ozvěna z jeskyně, „Nebe snese nejdřív v noci.“ nebo věta, která uvádí citát dvojtečkou. Úsek textu kroku jsem proto vybral ručně (`VETY_KRESEB` v `src/lib/kresby.ts`) a test hlídá, že v kroku doslova stojí; nic nového se nepíše. Skript zůstal jako záloha pro novou kresbu.
- *Další možnosti u pojmů.* Z Párů jsou prověřené proti sobě; u pojmů z `priklad` jsou z období podle semínka (Atom × Příčina × Religionistika). Situace u nich T a R přečtou proti vysvětlení sousedních pojmů.
- *Hlasy.* Druhá a třetí odpověď jsou přednostně jiného směru (dva stoikové radí podobně). Citát pod rubem k případu někde sedí slabě (Parmenidés B8 u duhy): je to citát, který stojí u hlasu na stránce otázky, a T ho může nahradit důvodem z myšlenky.
- *Zmrazené kolo.* Ke stavu z Formátů jsem přidal `poradi`, `pozice` a `volby`: kdo mezi otázkami projde další krok, kolo se mu pod rukama nezmění, a rub po obnovení ví, co zvolil.
- *Kolo začíná hned první otázkou*, bez tlačítka Začít; nic se neuloží, dokud student neodpoví.
- *Co student potkal.* Kroky cest deník drží trvale, navštívené stránky jen posledních dvacet. Hlas ze stránky otázky, kterou student viděl dávno, se proto do kola nemusí dostat; pomohla by trvalá stopa stránek otázek v deníku (na později, kdyby to vadilo).
- *Nabídka pera* po první odpovědi zůstala jako v ostatních hrách (dává ji rám aktivity).
- *Velikost.* Katalog má 77 kB JSON, hlasy opakují případ u každého mluvčího; stránka Tvoje antika 213 kB (gzip 37 kB). Případ jednou za otázku by ušetřil asi 20 kB; zatím jsem nechal formát z plánu.
- *K3* potřebuje pro kartičky druhu `zustalo` líc a rub z katalogu: na stránku deníku stačí id, podnět, zadání, text správné možnosti, vysvětlení a zpět, ne celý katalog.

## Po K3 (22. 11. 2026)

**Oddíl Kartičky** (`src/components/denik/Karticky.svelte`, logika `src/lib/karticky.ts`) v Můj deník hned pod Návratem, nad připomenutím zálohy a Moje filozofie. Ukáže se, jen když student kartičky má, nebo když je nemá, ale potkal pojmy (prázdné kartičky s tlačítkem Přidat pojmy, které jsi potkal: pojmy z `vyskyty`, kde student byl, podle `potkaneZDeniku` z K2). Deník, který má jen kartičky, už není prázdný.
- *Hromádka na dnes:* nejvýš pět kartiček na řadě od té, která čeká nejdéle (`hromadka` z K1 se `zdrojExistuje` z dat). Deník si ji pamatuje pro den (`bloky['karticky/dnes'] = { den, klice }`), takže obnovení stránky nerozdá novou pětku; vyndaná kartička se do pětky počítá dál. Menší hromádka se doplní kartičkou přidanou během dne. Kdo kartičky nemá, tomu se nic nezapisuje.
- *Kartička:* líc (nadtitulek zdroje, název, otázka, tlačítko Otočit; klepnutí na líc taky otočí), rub (Vím, Zopakuj si, Vyndat z kartiček). Rub nahradí líc a přetočí se k divákovi (`karta-otoceni`, tokeny `--d-listek`, `--k-papir`); při omezeném pohybu je tam hned. Fokus jde na rub a po hodnocení na líc další kartičky, nebo na Na dnes stačí. Líc i rub jsou `role="group"` s popisem pro čtečku. Barva horního okraje podle období zdroje; když za kartičkou v dnešní hromádce leží další, vykoukne pod ní okraj druhé (jen ano, nebo ne).
- *Na dnes stačí* a Ještě pět, jen když je na řadě ještě něco mimo dnešní hromádku. „Dnes žádná. Kartičky se ozvou samy…“, když hromádka byla prázdná. Nikde počet, datum ani zameškané dny (test hlídá, že v oddílu není číslice).
- *Líc a rub podle tabulky zdrojů* (`obsahKarticky`): pojem (název; vysvětlení, příklad, odkaz na první místo, kde ho student potkal, jinak stránka pojmu), citát (autor, dílo, místo a „stránka: …“; znění a poznámka perem, odkaz zpět), zápis (otázka zápisu; odpověď perem, Platí to pro tebe pořád?, Přepsat odpověď), Co ti zůstalo? (podnět a zadání bez možností a bez názvu, který by u pojmu prozradil odpověď; správná odpověď tučně, vysvětlení, odkaz zpět z katalogu).
- *Data* (`src/components/denik/_karticky-data.ts`, `pojmyKarticek` v `zustalo-data.ts`): pojmy 26 (asi 21 kB JSON), z kvízu 68 otázek s podnětem jednou na případ (35 podnětů; asi 36 kB). Celý katalog kvízu má 77 kB.

**Do kartiček** (`src/components/denik/DoKarticek.svelte`, `aria-pressed`, znak + / ✓, popis pro čtečku v `aria-label`; skrytý text by se v deníku zdvojil s otázkou zápisu a `getByText` v `sloz-argument.spec.ts` by našel dvě místa): u výstřižku ve sbírce vedle Vyndat ze sbírky, u lístku zápisu v obou výpisech (podle cest i podle data) a na stránce pojmu pod perexem. Zápis ho dostane jen s vlastními slovy (`zapisSTextem`): odpověď, pravidlo, sebehodnocení, důvod volby („Proč:“), důvod ve Sporu; Volba bez důvodu, Změň jednu věc a Roztřiď ne. Konec kola Co ti zůstalo? přidává kartičky beze změny z K2.

**Otázky pro autora** zůstaly bez odpovědi: kartička z vlastního zápisu má Vím a Zopakuj si (2), tečka na ikoně Deníku svítí jen pro Návrat (1, test). Zapsáno v `docs/rozhodnuti.md`.

**Testy.** `tests/data/karticky-obsah.test.ts` (14: zápis s textem, líc a rub všech zdrojů, chybějící zdroj, hromádka dne a obnovení, doplnění, Ještě pět, po týdnu, potkané pojmy, data antiky včetně „líc kvízu neprozradí odpověď“). `tests/e2e/karticky.spec.ts` (11: přidání ze stránky pojmu, z výstřižku, z lístku zápisu a z konce kola; Volba bez důvodu bez tlačítka; hodnocení klávesnicí s Vím, Zopakuj si, Vyndat, Na dnes stačí, obnovením a Ještě pět; deník po týdnu s posunutým datem `page.clock`; prázdné kartičky; axe ve světlém i tmavém režimu na lícu i rubu; omezený pohyb, 44 px a přetečení na 390 px; tečka Deníku). `scripts/kontrola-fokus.mjs` na `/denik/` s kartičkami a na `/pojem/klid/`: bez nálezu na 390 i 1440 px. Referenční snímek `denik-kapitoly-390-noc` obnoven (tlačítka u lístků a výstřižku); `snimky.spec.ts` ve snímcích prvků schovává i odkaz Přeskočit na obsah, který se ve vysokém snímku objevil. Snímky: `Claude outputs/snimky-karticky/` (prázdné kartičky, hromádka, rub každého zdroje, Na dnes stačí, tlačítka u zdrojů; 390 a 1440 px, světlý i tmavý; přehledové listy `list-*.jpg`), skript `scripts/snimky-karticky.mjs`. Celé `npm test` na Macu: kontrola typů bez chyb, Vitest 1647 z 1647, Playwright 919 z 919 (11,0 min). Předtím jeden běh spadl na `sloz-argument.spec.ts:365` (popis tlačítka Do kartiček jako skrytý text zdvojil otázku zápisu); popis je teď v `aria-label` a druhý běh prošel celý.

**Nad čím jsem váhal.**
- *Hromádka pro den, ne pro otevření stránky.* Bez zapamatování by obnovení stránky bylo nekonečné Ještě pět. Vyndaná kartička se do pětky počítá, jinak by vyndání přivolalo další.
- *Ještě pět jen, když je co.* Tlačítko, které nic nepřinese, by mátlo; prozradí jen, že něco čeká, ne kolik.
- *Otočení.* Dvě strany v 3D by potřebovaly obě v DOM (čtečka by četla rub dřív, než se student rozhodne). Rub proto nahradí líc a jen se přetočí k divákovi.
- *Název na rubu.* Pojem a otázka zápisu stojí malým písmem i na rubu, ať student ví, co hodnotí; u kvízu název není ani na lícu (u pojmu by byl odpovědí).
- *Odkaz zpět u kartičky kvízu* je výchozí z katalogu (stránka pojmu, otázka, krok kresby), ne „kde jsi to potkal“: to by na stránku deníku přidalo mapu míst. U pojmů místo, kde ho student potkal, je (stačí výskyty pojmu).
- *Citát* má na lícu „stránka: Epikúros“ a zpět „Zpátky tam, kde sis ho vystřihl“: jméno z dat je v 1. pádě a „ze stránky Epikúros“ zní špatně. Učeše T.
- *Váha dat.* Asi 57 kB JSON na stránce deníku i pro studenta bez kartiček. Šlo by je dát do sdíleného souboru (jako `/dva-zivoty.json`) a načíst jen tomu, kdo kartičky má; nechal jsem je na stránce podle zadání.
- *Zápis s textem.* Roztřiď s vlastní kartou a Změň jednu věc tlačítko nemají: v zápisu jsou volby a karty, ne myšlenka, kterou by si student vybavoval. Spor jen s důvodem.
- *Prázdné kartičky jen s potkanými pojmy.* Bez nich by tlačítko Přidat pojmy nic nepřidalo, a oddíl se proto neukáže.

## Po K4 (22. 11. 2026)

**Výpis míst, kde se kreslí citát ze `zdroje.yaml`** (grep `citatyPodleId`, `.cesky`, `<Citat`, `blockquote`):

| Místo | Kde | Nůžky před K4 | Po K4 |
| --- | --- | --- | --- |
| Citát na listu (`ui/Citat.astro`) | profily, kroky cest, úvody, směry, období, tradice, pokusy; i uvnitř Kdo je na tvé straně (`Strany`, sbalené „Kdo hájil jiné odpovědi“) | ano | ano (značka `ui/Nuzky.svelte`) |
| Kompaktní citát (`Citat.astro kompaktni`) | hlasy na stránce otázky (`otazka/HlasyOsa.astro`, 42 citátů na 8 otázkách), námitka Stoického týdne | ne | ano |
| Den týdne (`ostrovy/Tyden.svelte`) | Stoický týden, citát dne | ne | ano |
| Rub Kdo to řekl? (`KdoToRekl.svelte`) | dílna, cesty, hry na stránkách osob (`HraOsoby.astro`) | ne | až po otočení |
| Hotový Doplň citát (`DoplnCitat.svelte`, oblast Celý citát) | dílna, cesty, hry osob | ne | až se správným slovem |
| Hlas her (`HlasHerny.svelte`) | Kdo by to řekl? (Atlas by vybral, Kdo by odmítl), Najdi slabé místo (Kdo stál s tebou) | ne | až po zapsání |
| Původ v Pravý, nebo podvržený? (`.puvod__citat`) | dílna, hry osob | ne | po verdiktu, když pramen citát má |
| Líc Kdo to řekl?, ústřižek Pravého, souhrn série | hry | ne | ne: líc a ústřižek by prozradily odpověď, souhrn opakuje ruby |
| Vysvětlení Co ti zůstalo? a jeho kartička | Tvoje antika, deník | ne | ne: citát je součást věty vysvětlení; jeho stránka otázky nůžky má |
| Kartička citátu, výstřižek, Prameny | deník, konec stránek | ne | ne: už ve sbírce, nebo jen údaje bez znění |

Osa hlasů (`OsaHlasu.svelte`) a Spor (`Spor.svelte`), které plán jmenoval, citát nevykreslují: citát hlasu stojí pod osou v `HlasyOsa.astro`.

**Nůžky všude stejně.** `ui/Nuzky.svelte` je jen značka (`data-vystrihnout`, `data-text`, `data-kde` s autorem, dílem a místem z `udajeCitatu`); v Astru bez `client:`, v ostrovech až po odkrytí. `src/scripts/vystrihnout.ts` drží stav (`aria-pressed`) a nůžky z ostrovů najde pozorovatelem změn; pro hlasy her přibylo `id` a `udaje` v `HlasHerny`, pro původ v Pravém `id`. Na rubu Kdo to řekl? stojí nůžky v řádku s Otevřít stránku (`vRadku`), protože pravý dolní roh patří otisku „sedí“; ostatní sedí vpravo dole u údajů. Plná sbírka: nůžky nic nevystřihnou, pod citátem se objeví věta s odkazem Moje sbírka (`role="status"`) a zmizí, jakmile se místo uvolní.

**Výstřižek** (`denik/Vystrizek.svelte`): lístek v papíru období stránky, odkud citát je (`obdobiVystrizku`; v kapitole deníku barvu dá kapitola), střih nůžkami (rovné šikmé hrany se dvěma zoubky, stín filtrem obalu), citát v Newsreaderu, údaje jako odkaz zpět. Poznámka: tiché tlačítko Proč sis ho vystřihl? otevře pole (Enter uloží, Escape zruší, fokus zpět na Přepsat), poznámka pak perem (Kalam, `--pero`); na rubu kartičky citátu ji ukazuje už K3. Pod lístkem Do kartiček a Vyndat ze sbírky (kartička zůstane schovaná). Páska jen u prvního výstřižku na stránce Moje sbírka; v kapitole deníku žádná (páska v deníku patří Návratu). Pod výstřižky v kapitole odkaz Celá sbírka.

**Moje sbírka** (`src/pages/denik/sbirka.astro`, ostrov `denik/MojeSbirka.svelte`, logika `src/lib/sbirka.ts`, texty `src/lib/sbirka-texty.ts`): titulek s pruhem, perex, Vytisknout a Stáhnout jako text, výstřižky od nejnovějšího ve sloupcích po 300 px (na telefonu jeden), prázdný stav, věta o plné sbírce. Tisk (`html[data-tisk='sbirka']`): jen titulek a lístky po dvou na A4, čárkovaný střih, bez lišt, tlačítek a pásky. Text podle Formátů (`sbirkaJakoText`, soubor `atlas-citaty-RRRR-MM-DD.txt`).

**Texty** jsou pracovní a stojí v `TEXTY_SBIRKY`; učeše je T (mužský rod „vystřihl“, „zastavil“ zatím všude).

**Testy.** `tests/data/sbirka.test.ts` (7: pořadí, údaje, období stránky, jméno souboru, text s poznámkou i bez, prázdná sbírka, plná sbírka v `sCitatem`). `tests/e2e/sbirka.spec.ts` (9: nůžky v pěti hrách až po odkrytí a po obnovení stisknuté, kompaktní citát a den týdne, plná sbírka klávesnicí a po uvolnění místa, Moje sbírka s pořadím, páskou, poznámkou klávesnicí, staženým textem, Do kartiček, Vyndat a tiskem, prázdná a bez localStorage, odkaz z kapitoly, axe, 44 px a přetečení na 390 a 1440 px ve dne i v noci). `karticky.spec.ts` hledá výstřižek novou třídou `.vyst-citat`. `scripts/kontrola-fokus.mjs` s plnou sbírkou (300) na `/denik/sbirka/` a `/denik/` a s `tests/e2e/data/sbirka.json`: bez nálezu na 390 i 1440 px. Referenční snímek `denik-kapitoly-390-noc` obnoven s `--update-snapshots=all` a prohlédnut (nový výstřižek, odkaz Celá sbírka). Snímky a PDF tisku: `Claude outputs/snimky-sbirka/` (skript `scripts/snimky-sbirka.mjs`, data `tests/e2e/data/sbirka.json`). Nůžky na nových místech: `scripts/snimky-nuzky.mjs`, listy `list-nuzky-*.jpg`.

**Nestálý test kapitol vyřešen.** `denik-kapitoly.spec.ts:101` (Po K1 a Po K2: po obnovení otevřená i Helenismus) po K4 padal pokaždé. Příčina není zápis času v deníku: událost `toggle` u `<details>` přijde jako samostatná úloha a test stránku obnovil dřív, než se zavření kapitoly uložilo (měřeno 24 ms). Test teď před obnovením počká, až je stav v úložišti; 30 z 30 při trojím opakování. Věta v `docs/pouceni.md` › Technika.

**Nad čím jsem váhal.**
- *Páska v deníku.* Zadání chce u výstřižku pásku, design (revize R) ji v deníku nechává jen Návratu. V kapitole proto žádná, na Moje sbírka jen první: tím platí střídmost na každé obrazovce. Šlo by dát pásku prvnímu výstřižku každé kapitoly.
- *Barva papíru.* Podle stránky, odkud student citát vystřihl (stejně jako rozdělení do kapitol), ne podle autora; citát ze stránky otázky je tak bez období. Druhá cesta: období autora z `lide.yaml`.
- *Střih.* Rovné šikmé hrany se zoubkem, kde se střih navázal, ne zubatý okraj: vytržený okraj má titulek a zubatý ústřižek Doplň citát. Je nenápadný; R řekne, jestli stačí.
- *Jeden skript pro nůžky.* Ostrov jen vykreslí značku, stav drží `vystrihnout.ts` s pozorovatelem změn na celé stránce. Pozorovatel reaguje jen na přidané prvky a hned končí, když v nich nůžky nejsou.
- *Poznámka za tlačítkem.* Čtyři prázdná pole pod sebou by vypadala jako formulář. Pole má 200 znaků; delší myšlenka patří do zápisu.
- *Hlasy her.* Nůžky u každého hlasu (Kdo by odmítl, Kdo stál s tebou), i když jich je v bloku víc: jsou celé a nic už neskrývají. Kdyby rušily, šlo by je nechat jen u Atlas by vybral.
- *Tisk bez `@page`.* Okraje A4 dává prohlížeč; `@page` by platilo i pro tisk Moje filozofie.

## Po T (23. 11. 2026)

**Co ti zůstalo?** Texty kvízu stojí pohromadě v `TEXTY_ZUSTALO` (`src/lib/herna/zustalo.ts`), ostrov je bere odtud.
- *Úvod oddílu* (`TVOJE_ANTIKA.zustalo.uvod`): „Poznáš Epikúrův klid, když pípne mobil, a víš, co by ti po hádce s kamarádem řekl Epiktétos? Tady zjistíš, co ti z antiky zůstalo a kde najdeš to, co ti vypadlo.“ Mobil je z `priklad` pojmu klid, hádka je případ otázky Jsem svobodný?, na kterou odpovídá i Epiktétos.
- *Zadání:* „Který pojem v tom poznáš?“ (věštírna, tyran ani religionistika nejsou myšlenky; nadtitulek druhu je „Pojem v životě“), „Co by ti na to řekl X?“ beze změny, „Ke které velké otázce ta kresba patří?“ (kresba na otázku neodpovídá).
- *Pozvánka:* „Otázky se tu ptají jen na to, co už z antiky znáš. Zatím by jich bylo málo.“ a odkaz „Projdi cestu …“ (sedí prázdnému deníku i rozjeté cestě). Konec kola beze změny.

**Výpis všech otázek** (`Claude outputs/zustalo-antika.md`) přečtený jako text. Opravy:
- *Situace patří jednomu pojmu.* `blizkePojmy`: pojem, který vysvětlení správného jmenuje, nebo naopak, mezi možnostmi není (slast „je to klid“, v naší moci „naše soudy“). Dřív stál klid se slastí v jedné otázce a soud s v naší moci. Pravidlo jde z dat, takže platí i pro další období.
- *Vysvětlení pojmu* je celé `vysvetleni` (dvě věty) místo první věty a „Najdeš ho u: …“: u slasti teprve druhá věta říká, proč je situace po tréninku slast, a „Najdeš ho u:“ mělo rod pojmu a jména v 1. pádě.
- *Kresby:* `BLIZKE_OTAZKY_KRESEB` (`src/lib/kresby.ts`, s důvodem u každé) drží velké otázky, na které by obraz poctivě odpovídal taky; mezi možnostmi nejsou (jeskyně a Jak poznám, co je pravda?, Třetí čára a Jsem svobodný?…). Strhni masku do kvízu nepřišla: tvář pod maskou svádí ke čtyřem otázkám z pěti. Antika má 67 otázek (kresby 10).
- *Podnět kresby* má název na vlastním řádku („Kresba „Kde je střed?““ bez tečky za uvozovkou). Úseky kroku u Přesýpacích hodin, Třetí čáry, Cesty ven a Roztrhni kartu začínají o větu dřív (doslova z kroku), ať „jeho hodiny“, „každý“ a „každou“ mají k čemu patřit.
- *Vysvětlení kresby:* „Kresba patří k cestě *Kolik je dost?*, která hledá odpověď na otázku *Jak mám žít?*“; krok nese odkaz zpět. Kartička teď vykresluje odstavce přes `radek` (kurzíva).
- *Hlasy, kde citát mluví o jiné části myšlenky než odpověď* (`VYSVETLENI_HLASU`, `zustalo-data.ts`): Parmenidés u duhy dostal B8, 38–41 (`parmenides-b8-jmena`, odpověď je jeho převod), Marcus u Kdo tě zná líp?, Epikúros a Aristotelés u Sklad, nebo tábor? důvod z myšlenky. Ostatní citáty odpovídají.
- *Údaj citátu:* závorka v místě jde do hranatých („Hlavní myšlenky 37 [Diogenés Laertios X, 152]“). Dopis Hérodotovi má v `zdroje.yaml` místo „64 (Diogenés Laertios X, 64)“ jako Dopis Menoikeovi; dřív se četl „Dopis Hérodotovi Diogenés Laertios X, 64“ i na stránce otázky.
- *Hlasy se liší myšlenkou:* prošel jsem všech 41. Nejblíž jsou Seneca a Epikúros u fotky z roku 1926 („s jakou myslí“ × „příjemně a beze strachu“) a Platón a Aristotelés u Kdo tě zná líp? (rozdíl nese přítel); nechal jsem.

**Kartičky** (`TEXTY_KARTICEK`): „Nejdřív si odpověz v duchu, pak kartičku otoč.“; prázdné „Do kartiček si můžeš dát pojem, vystřižený citát nebo vlastní odpověď z cesty. Za pár dní se ti vrátí a uvidíš, co ti z nich zůstalo.“; „Přidat pojmy, které už znáš“; líc citátu „Co v té větě říká? Stačí myšlenka, přesná slova ne.“ a pod údajem „Stránka Epikúros“ (jméno z dat jako přístavek v 1. pádě); „Vybavíš si svou odpověď?“; „Zpátky na místo, odkud je“. Na dnes stačí, Dnes žádná a tlačítka beze změny.

**Sbírka** (`TEXTY_SBIRKY`): pruh „Věty, které tě zastavily.“; perex „Citáty z celého atlasu pohromadě, nejnovější nahoře. Ke každému si můžeš připsat, co pro tebe znamená, a celou sbírku vytisknout nebo stáhnout jako text.“ (věta o prohlížeči pryč, ukládání řeší deník); prázdná „Zatím tu nic není. Až tě v atlasu nějaká věta zastaví, vystřihni ji nůžkami pod citátem.“; poznámka „Proč zrovna tenhle?“, ve staženém textu „Proč zrovna tenhle:“; plná u nůžek „Do sbírky se vejde 300 citátů a teď je plná. Než vystřihneš další, některý z ní vyndej:“ s odkazem, na stránce „Sbírka je plná, vejde se do ní 300 citátů. …“. Titulek, Vytisknout, Stáhnout jako text, Přepsat, Celá sbírka a hlavička textu beze změny.

**Rod.** Mužský tvar zůstal jen v doslovném úseku kroku (Zrcadlo: „Kde jsi byl?“); jinde formulace bez rodu.

**Pro P6: nic.** Žádná věta nepotřebovala nové tvrzení: všechno je z pojmů, hlasů, `zdroje.yaml` a textu kroků.

**Mimo větev, pro R:** mužský rod v textech deníku, které větev nepsala („Koho jsem potkal“ v `SbirkaDeniku`, „Co sis myslel a kdo s tebou stál.“ na Tvoje antika, `PrenosDeniku`); údaj „Dopis z posledního dne Diogenés Laertios X, 22“ má stejný tvar jako Hérodotovi dřív; hlavička staženého textu říká „Atlas myšlení“, záhlaví webu „Agora“.

**Testy.** `zustalo.test.ts` (+5: blízké pojmy, blízké otázky kresby, data antiky bez blízkých dvojic, kresby s blízkými otázkami, vysvětlení hlasu z citátu odpovědi nebo z myšlenky; podnět a vysvětlení kresby), nové znění v `karticky-obsah.test.ts`, `sbirka.test.ts`, `karticky.spec.ts`, `sbirka.spec.ts`, `co-ti-zustalo.spec.ts` a `scripts/snimky-sbirka.mjs`. Vitest 1659 z 1659, dotčené Playwright (co-ti-zustalo, karticky, sbirka, tvoje-antika, denik-kapitoly, snimky) 60 z 60. Celé `npm test` na Macu: kontrola typů bez chyb, Vitest 1659 z 1659, Playwright 928 z 928 (9,2 min). Snímky 390 a 1440 px ve světlém i tmavém režimu: `Claude outputs/denik-v2-T/` (přehledové listy `list-*-390.jpg`).

**Nad čím jsem váhal.**
- *Blízké pojmy z dat, ne ze seznamu.* Vyřadí i dvojice, které by snesly (ctnost a vědění), ale kandidátů je dost a pravidlo se nezapomene. U kreseb to z dat nejde, proto ruční seznam s důvody.
- *Strhni masku mimo kvíz.* Šlo by jí dát jiný úsek kroku, ale obraz sám otázku Má život smysl? nenese.
- *Vysvětlení z myšlenky místo citátu* u tří hlasů: přijde se o živý hlas, ale vysvětlí se odpověď. U Parmenida citát zůstal, jen ten, ze kterého odpověď je.
- *„Proč zrovna tenhle?“* místo „Proč sis ho vystřihl?“: bez rodu a kratší; perex říká „co pro tebe znamená“, aby student nemusel psát jen důvod.
- *„Stránka Epikúros“* místo „stránka: Epikúros“: přístavek v 1. pádě sedí i na cestu („Stránka Kolik je dost?“). „Ze stránky Epikúra“ by potřebovalo pády jmen stránek, které data nemají.
- *Úvod jmenuje Epikúra a Epiktéta:* je to pozvánka, ne slib, že otázky budou o nich.

## Po R (23. 11. 2026)

Revize skillem `atlas-revize` (s `atlas-psani`), záznam `docs/revize/denik-v2-2026-11-23.md`. **Verdikt: po opravách.** Kartičky působí jako hra a nůžky nic neprozradí; kvíz potřebuje opravit hlasy a kresby a kartička ze zápisu o smrti nesmí přijít bez varování.

**Jak se zkoušelo.** Celý výpis 67 otázek; `scripts/revize-denik-v2.mjs` (nový): deník po třech týdnech se zápisy z cest o smrti a o nejhorším, dvanáct kartiček po týdnu a po měsíci (v oddílu žádná číslice mimo údaje citátů a „krok 3“, žádné slovo odpočtu), Co ti zůstalo? s chybnou odpovědí, Moje sbírka na obrazovce, v tisku a jako text. Snímky 390 a 1440 px, světlý i tmavý: `Claude outputs/denik-v2-R/`. `kontrola-fokus.mjs` s plným deníkem na čtyřech stránkách bez nálezu. Celé `npm test`: viz níž.

**Nálezy** (podrobně a s hotovou opravou v záznamu revize):
1. *Tři otázky hlasů mají dvě obhajitelné odpovědi* (Platón × Aristotelés, Aristotelés × Epikúros, Seneca × Epikúros): ruční `BLIZKE_HLASY` s důvodem.
2. *Rub hlasu neřekne, čí odpověď student zvolil:* po odpovědi jméno u každé možnosti.
3. *Obraz a otázka nemá obraz ani důvod:* náhled kresby a věta proč doslova z kroku (`PROC_KRESEB`).
4. *Kartička ze zápisu o smrti přijde bez varování:* na lícu odkud, tiché Vyndat, bez pokynu „Napiš…“ (otázka 1).
5. *Vysvětlení Platónových hlasů mluví ústy jiných postav* („já jsem tenhle Sókratés“ pod Platónem): uvozovací věta z `myslenka`.
6. *Tisk sbírky pro učitele bez jména a data* (drobné): tisková hlavička.

**Opraveno rovnou.** Hlavička staženého textu „z Agory“ (otázka 2); Dopis z posledního dne s místem „u Diogena Laertia X, 22“; rod v textech deníku, které student čte o sobě („Koho už znám“, pruh a perex Tvoje antika, `PrenosDeniku`); odkaz na Tvoje antika v Můj deník zmíní, co ti z antiky zůstalo (dřív o kvízu nic).

**Mimo větev z Po T, rozhodnuto.** Mužský rod: v textech deníku opraven, v ostatním atlasu patří do revize obsahu (fáze 5) jako jedno rozhodnutí. Údaj Dopisu z posledního dne a Agora v hlavičce: opraveno v R.

**Testy.** Celé `npm test` s opravami z Opraveno rovnou (kromě odkazu a perexu Tvoje antika): kontrola typů bez chyb, Vitest 1659 z 1659, Playwright 928 z 928 (9,2 min). Po odkazu a perexu znovu Vitest 1659 z 1659 a dotčené Playwright (tvoje-antika, denik-kapitoly, denik-soubor, snímky) 60 z 60.

**Nad čím jsem váhal.**
- *Blízké hlasy ručně, ne z dat.* U pojmů pozná blízkost vysvětlení, které jmenuje druhý pojem; u hlasů je společná myšlenka schovaná v jiných slovech. Ruční seznam s důvodem jako u kreseb; tři dvojice z 41 otázek.
- *Jména pod možnostmi.* Prozradí po odpovědi, kdo co říká, a to je cíl: z jedné otázky tři myslitelé. Před odpovědí jména nejsou.
- *Náhled kresby jako obrázek, ne ostrov.* Deset ostrovů kreseb na stránce Tvoje antika by ji zatížilo; snímek v klidovém stavu stačí na vybavení a nehýbe se.
- *Kartička ze zápisu o smrti ano.* Student si ji dal do kartiček sám a tentýž zápis vidí v kapitole deníku. Varování odkud a Vyndat bez otáčení mu nechá volbu; zakázat tlačítko by rozhodlo za něj.
- *Agora ve staženém textu.* Rozhodnutí, kam až přejmenování sahá, je otevřené; učitel ale vidí Agoru v záložce i na tisku hodiny, a soubor s jiným jménem by mátl.
- *Hlavička tisku s linkou na jméno* místo pole na jméno na obrazovce: jméno do deníku nepatří.

### Otázky pro autora (po R)

Prázdná odpověď znamená souhlas s doporučením.

1. **Kartičky ze zápisů v cestách Proč se bát smrti? a Co když přijde to nejhorší?** Po třech týdnech přijde na lícu třeba „Je rozumné bát se smrti?“ a na rubu vlastní věta o strachu. Doporučuji tlačítko Do kartiček nechat s opravou nálezu 4: na lícu, z které cesty kartička je, a Vyndat z kartiček bez otáčení. Druhá možnost: u zápisů těch dvou cest tlačítko nebude.
   Odpověď: bez odpovědi = doporučení (O: tlačítko zůstává, na lícu odkud a Vyndat z kartiček).
2. **„Moje sbírka citátů z Agory“ ve staženém textu** (dřív „z Atlasu myšlení“). Učitel vidí Agoru v záložce prohlížeče i na tisku hodiny. Doporučuji nechat Agoru. Druhá možnost: vrátit „z Atlasu myšlení“.
   Odpověď: bez odpovědi = doporučení (O: Agora zůstává).
