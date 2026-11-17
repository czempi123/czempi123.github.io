# Větev herna-v1: knihovna nových aktivit

Plán 16. 11. 2026 (Opus 5.5). Fáze 2 plánu po auditu (`docs/plany/po-auditu.md` › Fáze 2: zásada, katalog, pravidla pestrosti, větve) a přídavky z kurikula (`docs/plany/kurikulum.md`, řádek `herna-v1`). Vzhled předmětů a herní pohyb navrhl krok D5 větve design-v2 (`docs/archiv/plany/design-v2-4-audit-d5.md` › Po D5, plátno Herní prvky). Společný rám aktivity (`RamAktivity.svelte`) a tokeny jsou hotové (`docs/design.md` › Bloky a aktivity, Pohyb).

## Proč

Z devadesáti míst, kde student v antice něco dělá, je jen třináct hraček, zbytek je volba, věta do pole a třídění. Na každém medailonku je tatáž aktivita (Kdo žil dřív?). Herna postaví formáty, které se plní z dat a z YAML, takže je pak každý celek jen vybere. Každý formát musí projít čtyřmi otázkami zásady (odnese si něco, přemýšlí sám, zůstává otevřená, chtěl by ji udělat i bez povinnosti) a nosným pilířem: co si z toho student odnese do života.

## Co platí

- **Hotový text se nepřepisuje.** Každý nový formát se objeví jednou v dílně (`/dilna/bloky/`) a na jednom místě antiky jako přídavek: nový blok mezi hotové odstavce nebo na konec stránky, bez změny okolních vět. Postřehy k hotovému obsahu jdou do `docs/navraty.md`.
- **Data, ne ruční text.** Jména, roky a místa z `src/data/`; citáty jen ze `zdroje.yaml`; každý nový citát, číslo nebo připsání projde skillem `atlas-overeni`.
- **Předmět podle D5.** Seřaď na ose je šňůra s kolíčky, Tipni si pravítko, Kdo to řekl? otočná kartička, Doplň citát vystřižená slova, Pravý, nebo podvržený? dvě razítka, Najdi slabé místo červená tužka. „Sedí“ a „zkus to jinak“ jsou jediná dvojice pro správně a jinak, bez červené a zelené.
- **Pointa není paměť** (autor, 17. 11. 2026). Student se nemá učit citáty nazpaměť ani hádat, o koho jde; roky a přesné životy nejsou učivo. Znalostní hra stojí na myšlence a na vlivu: kdo na koho mohl navázat, čí myšlenka větě sedí, co by věta tvrdila s jiným slovem. Hra dává studentovi do ruky to, podle čeho může uvažovat (myšlenku osoby z dat, vztahy), a odkrytí řekne, o čem věta je a kdo na koho navázal. Roky jsou jen drobný údaj vedle toho. Hra stojí až tam, kde student lidi ze hry už potkal.
- **Bez bodů a skóre.** Znalostní formáty říkají „sedí“ nebo „zkus to jinak“ s jednou větou, kam se podívat. Názorové formáty (Kdo by to řekl?, Najdi slabé místo) nemají správnou odpověď: student uvidí, kdo stál s ním.
- **Každé tažení má cestu bez tažení** (klepnutí, klávesnice); cíle aspoň 44 px; omezený pohyb a Klidný režim vypnou zamíchání i otočení.
- **Do deníku jen to, co si student vytvořil nebo zvolil** (stanovisko, sebehodnocení, slabé místo). Znalostní hry ukládají jen stav, aby šly obnovit.

## Kroky

Hotové kroky (zadání P6, K1 a K2, odpovědi před P6, Po P6 a Po K1) jsou v `docs/plany/herna-v1-1.md`.

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| P6 | Podklady pro formáty: citáty pro Kdo to řekl? a Doplň citát, podvržené citáty s doloženým původem, věty pro Kdo by to řekl?, situace pro Páry, čísla pro Tipni si, otázky pro Výpravy, látka stránky Argumentační klamy a manipulace | Opus 5.5 · high se skillem `atlas-overeni` | hotovo 17. 11. 2026 (Po P6) |
| K1 | Herní jádro a první dva formáty: sdílená logika v `src/lib/herna/`, herní pohyb (zamíchání, otočení karty, razítko), **Seřaď na ose** a **Kdo to řekl?** | Opus 5.5 · high se skillem `atlas-komponenta` | hotovo 17. 11. 2026 (Po K1) |
| K2 | Úprava Seřaď na ose a Kdo to řekl? podle zásady Pointa není paměť, pak **Tipni si**, **Kde to bylo?** (slepá mapa), **Doplň citát** | totéž | hotovo 17. 11. 2026 (Po K2) |
| K3 | **Páry**, **Pravý, nebo podvržený?**, **Najdi slabé místo**, **Kdo by to řekl?** | totéž | na řadě |
| K4 | Stránky osob a mapa: **střídání malých aktivit** na medailoncích a profilech, **Výpravy** pro období 1 a 2, **Přehrát období**, trasy na mini mapě | totéž | čeká na K3 |
| K5 | Kurikulum: karta **Do hodiny**, **sebehodnocení** na konci cesty, stránka **Argumentační klamy a manipulace** | komponenty `atlas-komponenta`, text `atlas-psani` · Opus 5.5 · high | čeká na K4 |
| T | Přídavky v antice: každý formát na jednom místě (tabulka v Co rozhodnout, otázka 1), zadání a zpětné vazby skillem `atlas-psani`, zápis bloků do skillu `atlas-cesta` | Opus 5.5 · high se skilly `atlas-cesta` a `atlas-psani` | čeká na K5 |
| R | Revize větve: čtyři otázky zásady u každého formátu, 390 a 1440 px, světlý i tmavý režim, Klidný režim, klávesnice, čtečka, dotyk skutečnými událostmi, výkon stránek osob | Opus 5.5 · high se skillem `atlas-revize` a pluginem Design | čeká na T |
| O | Opravy po revizi, referenční snímky nových formátů, `docs/design.md` a `docs/pouceni.md` | Opus 5.5 · high | čeká na R |
| Uzavření | Schválení autorem, sloučení, GitHub, kontrola nasazeného webu a běhu kontrol, plán do archivu | Opus 5.5 · medium | čeká na O |

Každý krok končí commitem ve větvi `herna-v1`, oddílem „Po <krok>“ v tomto souboru, otázkami, jen když něco smí rozhodnout jen autor, a celým promptem dalšího kroku ve zprávě i tady v plánu. Na GitHub se nic neposílá až do Uzavření.

## Formáty

| Formát | Co student dělá | Z čeho se plní | Uloží | Otázka pilíře (co si odnese) |
| --- | --- | --- | --- | --- |
| Seřaď na ose | Pět karet (lidé, události, díla) seřadí na šňůru; roky se ukážou až po správném pořadí | `lide.yaml`, `udalosti.yaml`, výběr id v YAML bloku | stav | kdo navazoval na koho; dějiny jako řetěz rozhovorů |
| Kdo to řekl? | Otočí kartičku s větou a tipne, čí je ze tří až čtyř lidí; po otočení dílo a místo | `zdroje.yaml` (jen ověřené citáty) | stav | poznat hlas myslitele podle toho, co ho trápilo |
| Doplň citát | Do vtlačené mezery vloží jedno ze tří vystřižených slov; pak celý citát s místem | `zdroje.yaml` a slova v YAML bloku | stav | slovo, na kterém věta stojí |
| Tipni si | Posuvníkem na pravítku odhadne číslo (roky mezi dvěma lidmi, délku života, vzdálenost); pak ryska a svorka rozdílu | data osob a míst, nebo ověřené číslo v YAML | stav | jak daleko a jak blízko jsou dějiny; překvapení |
| Kde to bylo? | Klepne do slepé mapy, kde se něco stalo; špendlík, razítko místa a čárkovaná spojnice ke správnému místu | `mista.yaml`, podklad mapy z `src/lib/podklad-sdileny.ts` | stav | odkud kdo byl a kam musel odejít |
| Páry | Spojí pojem se situací ze života (ne s definicí) | kolekce `pojmy` a situace v YAML bloku | stav | pojem jako nástroj na vlastní den |
| Pravý, nebo podvržený? | U citátu z internetu otiskne razítko „řekl to“, nebo „neřekl to“; pak kdo to doopravdy řekl, nebo odkud věta pochází | ověřené podvržené připsání v `zdroje.yaml` (nový druh záznamu) | stav | ověřit si citát dřív, než ho pošlu dál |
| Najdi slabé místo | Červenou tužkou přeškrtne premisu argumentu, kterou odmítá; pak vidí, kdo ji odmítl taky a proč | argument z YAML (stejný tvar jako Slož argument) | deník | najít v argumentu místo, kde se dá nesouhlasit |
| Kdo by to řekl? | K dnešní větě (z chatu, z reklamy, od kamaráda) vybere filozofa, který by ji podepsal, a připíše proč; pak uvidí, koho atlas navrhuje a proč | věty a vazby na hlasy v YAML | deník | spojit starou myšlenku s dnešní situací |
| Výpravy | Tři až pět otázek na období v Mapě a čase: tipni, ověř na mapě, zapiš | YAML výprav nad daty osob | stav | orientace v době, ne jen v lidech |
| Přehrát období | Minuta, kdy rok běží sám a lidé se objevují a mizí; dá se zastavit | data osob a období (`src/lib/zivot-na-mape.ts`) | nic | kdo žil s kým, kolik generací uplynulo |

Formáty se staví jednou jako ostrov v rámu aktivity a vkládají se jedním řádkem (`<SeradNaOse id="…" />`); obsah je v `src/content/bloky/<id>.yaml` se schématem v `src/lib/bloky-schema.ts`. Medailonek dostane formát bez YAML, sestavený z dat (K4).

## Zadání K3: Páry, Pravý, nebo podvržený?, Najdi slabé místo, Kdo by to řekl?

Opus 5.5 · high, skill `atlas-komponenta` (texty skillem `atlas-psani`), nový chat.

```
Ve větvi herna-v1 na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Přečti CLAUDE.md, docs/pouceni.md, docs/design.md (Pohyb, Bloky a aktivity, Komponenty), v docs/plany/herna-v1.md Co platí (hlavně Pointa není paměť), Formáty a Po K2, z docs/plany/herna-v1-1.md jen Po K1, skilly atlas-komponenta a atlas-psani a z podkladů docs/podklady/herna.md jen oddíly 2 (Pravý, nebo podvržený?), 3 (Kdo by to řekl?) a 4 (Páry). Archiv nečti. Ze src/lib/herna si přečti jen index.ts a ty soubory, které použiješ (verdikt.ts, michani.ts, vazby.ts); vzor ostrovu je DoplnCitat.svelte (tažení, klepnutí, klávesnice) a TipniSi.svelte (Ukázat, jak to bylo).

Zásada kroku stejná jako v K2: student se nemá nic učit nazpaměť ani hádat, o koho jde. Hra mu dá do ruky, podle čeho uvažovat (myšlenku osoby z pole proc v lide.yaml, situaci, argument), a odkrytí řekne, o čem to je a proč. Názorové formáty nemají správnou odpověď: student uvidí, kdo stál s ním, a nic se nehodnotí.

1. Páry: dvě řady lístků (pojem z kolekce pojmy, situace ze života šestnáctiletého z podkladů P6), spojení klepnutím na jeden a druhý (čára tužkou v SVG mezi nimi), z klávesnice výběrem v seznamu u každého pojmu. U páru, který nesedí, „zkus to jinak“ s větou, co ta situace ukazuje místo toho; po spojení všech jedna věta ke každému páru. Situace, která pojem jen připomíná (stejné slovo), patří mezi lístky jako past, ne jako správný pár. Logika (vyhodnocení párů, stav) v src/lib/herna/pary.ts.
2. Pravý, nebo podvržený?: citát jako ústřižek z obrazovky telefonu, dvě razítka (kulaté „řekl to“, hranaté „neřekl to“) s otiskem; po otisku původ z dat (druh záznamu pripsani v zdroje.yaml: kde koluje, kdo to doopravdy řekl, nebo že původ není znám) a jedna věta, jak si citát příště ověřit sám. Série karet jako Kdo to řekl? (Další karta). Podvržená věta nikdy nestojí bez opravy na téže obrazovce.
3. Najdi slabé místo: věty argumentu na linkovaném listu (tvar YAML jako Slož argument), tah červenou tužkou přes zvolenou premisu (stroke-dashoffset v malém SVG), pak kdo ji odmítl a proč (hlasy z dat, citát se zdrojem); nejde o správnou odpověď. Uloží se do deníku jako zápis (premisa a volitelné „proč“).
4. Kdo by to řekl?: dnešní věta jako výstřižek (chat, reklama, rada kamaráda), výběr filozofa razítkem s větou proc pod jménem (jako Kdo to řekl? po K2) a důvod do pole; pak lístek „atlas by vybral…“ s důvodem z pramene a tím, kdo by větu odmítl. Volba studenta zůstává, nehodnotí se, uloží se do deníku.
5. Všechny čtyři formáty do bloky/index.ts, schéma do bloky-schema.ts (a seznam druhů v tests/data/bloky.test.ts), nadtitulky (nadtitulky.ts: znalostní „Hra“, názorové vlastní slovo), denik.ts (DruhBloku), postup.ts (BLOKY_S_ODPOVEDI), hodiny.ts (BLOKY_Z_YAML), do dílny, do pruchod.spec.ts, scripts/slova-cesta.mjs a scripts/snimky-cesta.mjs (nová větev před Slož argument: getByRole bez exact chytí i delší název tlačítka); nové stavy do scripts/snimky-herna.mjs.
6. Testy: Vitest na logiku (tests/data/herna-k3.test.ts a obsah YAML proti datům); Playwright (tests/e2e/herna-k3.spec.ts) na 390 a 1440 px, světlý a tmavý režim, axe, jen klávesnicí, dotyk přes CDP (scrollY měř před touchEnd, po něm jde fokus na lístek), obnovení stránky, bez localStorage, omezený pohyb, Klidný režim. Snímky si prohlédni.
7. docs/design.md (Bloky a aktivity, jedna řádka na formát), docs/rozhodnuti.md, celé npm test (na pozadí s výstupem do souboru), commit, oddíl Po K3 v plánu, restart npm run dev, plán do Projektu Claude. Na konci zprávy napiš, na které snímky se mám podívat, a celý prompt pro K4 (do zprávy i do plánu), s modelem a úsilím.
```

## Zadání K4: stránky osob a mapa

Jako K1, navíc Po K3 a `docs/design.md` › Mapa a čas a Stránky z dat.

1. **Střídání malých aktivit** na medailoncích a profilech (pravidlo pestrosti 4): funkce v `src/lib/` vybere pro osobu podle dat jednu aktivitu (překvapivý současník: Kdo žil dřív?; daleká cesta: Kde to bylo?; ověřený citát: Kdo to řekl?; dlouhý život nebo mezera: Tipni si) tak, aby se sousední stránky v seznamu Lidé lišily. Výběr je při sestavení pevný, ne náhodný při každém načtení. Test projde všech 34 medailonků.
2. **Výpravy** pro období 1 a 2 v Mapě a čase nad dnešní Výpravou (jedna a pevná, Sókratés 424 př. n. l.): výběr výpravy podle období na pásu, lístek s otázkou, ověření na mapě, razítko „Sedí“. Jedna páska na obrazovku.
3. **Přehrát období:** tlačítko u pásu období, rok běží sám asi minutu, Zastavit a pokračovat, při omezeném pohybu a v Klidném režimu skoky po desetiletích bez animace. Navazuje na Přehrát život (`src/lib/zivot-na-mape.ts`).
4. **Trasy na mini mapě** v Době a lidech: oblouky se šipkou a rokem mezi místy (plátno D4, `docs/navraty.md` › mini mapa), jen kde jsou roky pobytu v datech.

## Zadání K5: Do hodiny, sebehodnocení, Argumentační klamy a manipulace

Jako K1, navíc Po K4, `docs/plany/kurikulum.md` (jen řádek `herna-v1` a odpovědi), skill `atlas-psani` pro všechny texty.

1. **Do hodiny:** karta s jednou otázkou do dvojice a jednou pro třídu, data v YAML k cestě, vzhled lístku pro učitele; v cestě ji student vidí jen v promítání hodiny a v přípravě hodiny, jinak ne. Zkouška v cestě 1.
2. **Sebehodnocení na konci cesty** (podle odpovědi 6): dvě krátké otázky (co už umím, v čem si jistý nejsem), bez bodů, do deníku k cestě; v deníku vedle Na začátku × Teď.
3. **Stránka Argumentační klamy a manipulace** podle odpovědi 7, z podkladů P6: úvod podle `atlas-psani`, u každého klamu antický a dnešní případ, uprostřed Najdi slabé místo a Pravý, nebo podvržený?, na konci odkaz do deníku. Odkazy na stránku z Otázek a z Kam dál cesty 1 (bez přepsání textu cesty). Stránka do `nove-stranky.spec.ts` a katalogu hodin.

## Zadání T: přídavky v antice

Ve větvi `herna-v1`. Přečti `CLAUDE.md`, `docs/styl.md`, `docs/pouceni.md`, v tomto plánu Formáty a oddíly Po K2 až Po K5, v `docs/plany/herna-v1-1.md` odpovědi před P6 a Po K1, skilly `atlas-cesta` a `atlas-psani`.

1. Každý formát vlož na jedno místo antiky podle tabulky v Co rozhodnout, otázka 1 (`docs/plany/herna-v1-1.md`). Napiš jen zadání, scénu a zpětné vazby nového bloku; okolní text se nemění. Kde se přídavek k místu nehodí, navrhni jiné a zapiš proč.
2. U každého přídavku čtyři otázky zásady a otázka pilíře, odpovědi do Po T.
3. Nové bloky do skillu `atlas-cesta` (knihovna bloků, jedna řádka a příklad) i do jeho kopie ve `skills/`; pravidla pestrosti tam zapíše až `uklid-v1`.
4. Celé `npm test`, commit, Po T, snímky kroků se skriptem `scripts/snimky-cesta.mjs`, plán do Projektu. Zastav se.

## Zadání R a O

**R** podle skillu `atlas-revize` s perspektivami student, učitel, uživatel a přístupnost (`design:accessibility-review`, `design:design-critique`): u každého formátu čtyři otázky zásady, otázka pilíře, telefon a notebook v obou režimech, Klidný režim, jen klávesnice, VoiceOver jen s autorem (pouceni: nastavení přístupnosti mění autor), dotyk skutečnými událostmi, váha stránek osob po K4. Záznam do `docs/revize/herna-v1.md`, nálezy podle dopadu, drobnosti rovnou opravit.

**O** opraví nálezy, přidá referenční snímky nových formátů do `tests/e2e/snimky.spec.ts`, doplní `docs/design.md` a `docs/pouceni.md` a skončí otázkou na schválení větve, kterou zodpoví jen autor.

## Po K2 (17. 11. 2026)

Zásada Pointa není paměť (Co platí) platí pro všech pět her: hra dává do ruky myšlenku osoby a vztahy z dat, odkrytí říká, o čem věta je a kdo na koho navázal, roky jsou drobný údaj.

**Co vzniklo**

- **Kdo to řekl? po úpravě:** pod jménem u každého razítka první věta pole `proc` z `lide.yaml` (`prvniVeta`), nad razítky pokyn Kalamem „Nemusíš to vědět: hledej, čí myšlence věta sedí.“ (pole `pokyn`, výchozí v schématu). Na 390 px jsou razítka pod sebou (ve dvou sloupcích by věta měla šest řádků), od 520 px šířky rámu dva sloupce. Na rubu nahoře pointa (nové povinné pole `pointa` u karty), pod ní věta menší a jméno s dílem a místem. Věta pod razítkem, která citát opisuje (dva společné kořeny slov za sebou), zastaví sestavení (`prozrazuje`, `chybyVetKdoRekl`): Démokritos (`proc` „podle zvyku… atomy a prázdno“) proto z dílny vypadl a místo něj je Parmenidés (B8, s Hérakleitem a Démokritem). Nápovědy v dílně se ptají po myšlence („Komu z nich šlo o to, co máme ve své moci, a co ne?“).
- **Seřaď na ose po úpravě:** po správném pořadí (i po Ukázat pořadí) mezi sousedy `.vazba-osy` z `vazbaDvou` (`src/lib/herna/vazby.ts`): vztah z dat (učitel a žák, znali se, četl ho se šipkou k prvnímu, přel se, spor na dálku), tradovaný s „vypráví se“ na vlastním řádku, jinak „mohli se potkat“ (oba dospělí a stejná tradice), u jiné tradice jen „žili ve stejné době“. Čtečka slyší celou větu („Vypráví se, že se Diogenés učil u Antisthena.“). Roky drobně (12,5 px, `--ink-2`). Pětice v dílně je řetěz Sókratés → Antisthenés → Diogenés → Kratés → Zénón z Kitia (čtyři vztahy učitel a žák, jeden tradovaný), otázka „Kdo na koho navázal? Seřaď je od nejstaršího.“ a nápověda u každé karty říká, u koho se kdo učil.
- **Tipni si** (`TipniSi.astro`, `ostrovy/TipniSi.svelte`, druh `tipni`, logika `odhad.ts`): pravítko v lidských životech (75 let, `LIDSKY_ZIVOT`), rysky po generaci, jezdec v barvě pera nad průhledným `input type="range"` (`aria-valuetext` „tři lidské životy“, 0 „mohli se potkat“). Délka pravítka s rezervou, aby konec stupnice odpověď neprozradil (`delkaPravitka`). „Sedí“ u současníků jen 0, jinak nejvýš o život nebo čtvrtinu vedle; jinak „zkus to jinak“ se směrem; po dvou odhadech Ukázat, jak to bylo. Po odhalení ryska v inkoustu období, čárkovaná svorka k odhadu, věta `vzdalenost()` z `cas-mapy.ts` („Dělí je asi 915 let. To je asi dvanáct lidských životů.“) a vztah z dat s poznámkou („Marcus Aurelius četl texty Epiktéta: Epiktétovy zápisky mu půjčil učitel Rusticus.“). V dílně Thalés a Hypatia a Epiktétos a Marcus Aurelius (podklady, čísla 6 a 7).
- **Kde to bylo?** (`KdeToBylo.astro`, `ostrovy/KdeToBylo.svelte`, druh `kde`, logika `mista.ts`): slepý výřez mini mapy osoby, obrys ze sdíleného `/podklad/<klíč>.svg`, nejvýš 640 px; klepnutí, nebo kříž šipkami (Shift po větším kroku) a Enter. Pak razítko místa, čárkovaná spojnice, vzdálenost jen slovem (přesně tam, blízko, kus dál, o moře dál; „sedí“ do 250 km) a věta z dat o pobytu (`vetaPobytu`: „Na Korsice žil Seneca ve vyhnanství v letech 41–49 n. l.“). Popisky místa a tipu na opačných stranách, u blízkého tipu jen název (`stranyKde`); test ověřuje obdélníky. V dílně Seneca na Korsice.
- **Doplň citát** (`DoplnCitat.astro`, `ostrovy/DoplnCitat.svelte`, druh `doplnit`, logika `doplnit.ts`): věta s vtlačenou mezerou, tři výstřižky (tři papíry a písma, zubatý okraj, natočení přes `--natoceni`), tažení myší i prstem, klepnutí, Enter. Záměna zůstává v mezeře s lístkem „zkus to jinak“, co by věta tvrdila; se správným slovem pointa, celý citát s místem a „A kdyby tam stálo…“ u všech záměn. V dílně Hérakleitos B12 („týchž“, záměny „různých“, „hlubokých“).
- **Zapojení:** `bloky/index.ts`, schémata `BlokTipni`, `BlokKde`, `BlokDoplnit` (a `pointa`, `pokyn` u Kdo to řekl?), nadtitulek „Hra“, `BLOKY_S_ODPOVEDI`, `DruhBloku`, katalog hodin (`BLOKY_Z_YAML`), dílna, `pruchod.spec.ts`, `scripts/slova-cesta.mjs`, `scripts/snimky-cesta.mjs` (nové větve stojí před Slož argument, protože „Zkontrolovat“ bez `exact` chytí i „Zkontrolovat odhad“) a `scripts/snimky-herna.mjs`.
- **Testy:** `tests/data/herna-k2.test.ts` (vazby, odhad, mapa, Doplň citát, věta pod razítkem, obsah YAML proti datům), `tests/e2e/herna-k2.spec.ts` a upravený `tests/e2e/herna.spec.ts` (390 a 1440 px, světlý i tmavý režim, jen klávesnicí, axe, obnovení, tažení myší, dotyk přes CDP, cíle 44 px, bez `localStorage`, plný a omezený pohyb, Klidný režim). Celé `npm test`: kontrola typů bez chyb, 1465 testů ve Vitestu a všech 830 v Playwrightu.
- `docs/design.md` (Bloky a aktivity, Komponenty) a `docs/rozhodnuti.md` (17. 11. 2026, K2).

**Nad čím jsem váhal a co by šlo jinak**

- **Kde to bylo? jako jeden tah.** Zadání chce po klepnutí rovnou razítko a vzdálenost slovem, tak druhý pokus není a „zkus to jinak“ tam nedává smysl; daleký tip dostane titulek „Takhle to bylo.“. Jinak: špendlík by šel posunout a potvrdit, pak by šlo i „zkus to jinak“.
- **Hranice „sedí“:** Tipni si do jednoho života nebo čtvrtiny, Kde to bylo? do 250 km (Korsika je dlouhá asi 180 km). Obě čísla jsou v `src/lib/herna/` na jednom místě a šla by přitáhnout.
- **Konfucius z dílny vypadl.** Šňůra s řetězem vlivu má čtyři vztahy; s Konfuciem by jeden soused zůstal jen „žili ve stejné době“. Logika ho umí (test `vazbaDvou` s Konfuciem a Parmenidem), takže se může vrátit v kroku T jako překvapení na stránce období 1.
- **Věta pod razítkem je `proc`, i když je dlouhá** (Epikúros má tři řádky na telefonu). Kratší pole v datech by bylo hezčí, ale data se v herně nepřepisují; T může u konkrétní hry zvolit jiné lidi.
- **Vazba „četl ho“ u dvou sousedů** má šipku k prvnímu (← ve vodorovné šňůře, ↑ ve svislé); učitel a žák šipku nemá, pořadí na šňůře směr říká samo.
- **Pointy a vazby v dílně jsem psal sám** z podkladů P6 a pramenů, které už v datech jsou (Rukojeť 5, Obrana 38a, B8, Politika 1253a, Dopisy 28, B12). Do antiky je projde krok T se skillem `atlas-psani`.

**Na které snímky se podívat** (`Claude outputs/snimky/`): `herna-serad-sedi-390-svetly.png` a `herna-serad-sedi-1440-tmavy.png` (vztahy mezi kartami), `herna-kdo-klid-390-svetly.png` (razítka s větou pod sebou), `herna-kdo-otocena-1440-tmavy.png` (pointa na rubu), `herna-tipni-sedi-390-svetly.png` a `herna-tipni-ukazano-1440-tmavy.png` (pravítko, ryska a svorka), `herna-kde-tip-390-svetly.png` (slepá mapa po klepnutí), `herna-doplnit-zkus-390-svetly.png` a `herna-doplnit-sedi-1440-tmavy.png`. V dílně: `/dilna/bloky/#h-tipni`, `#h-kde`, `#h-doplnit`.

Další krok: K3 v novém chatu, Opus 5.5 · high se skillem `atlas-komponenta`; celé znění promptu je v Zadání K3.

## Co zůstává na později

- Porota, Dialog, Úryvek s otázkou, Příběh v obrazech a hračky vzniknou v celku, který je první potřebuje (`docs/plany/po-auditu.md` › Větve).
- Co ti zůstalo?, kartičky s rozestupem a vystřižené citáty: `denik-v2`.
- Zvuk (Poslechni si) a film: `film-0`, zvuk později.
- Pravidla pestrosti a katalog aktivit do skillů: `uklid-v1`.
- Kontrola VoiceOverem z design-v2 (`docs/archiv/plany/design-v2.md` › Co zůstává na později) se hodí k revizi R, když bude autor u Macu.
