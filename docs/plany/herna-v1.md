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

Hotové kroky (zadání P6 až K3, odpovědi před P6, Po P6, Po K1 a Po K2) jsou v `docs/plany/herna-v1-1.md`.

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| P6 | Podklady pro formáty: citáty pro Kdo to řekl? a Doplň citát, podvržené citáty s doloženým původem, věty pro Kdo by to řekl?, situace pro Páry, čísla pro Tipni si, otázky pro Výpravy, látka stránky Argumentační klamy a manipulace | Opus 5.5 · high se skillem `atlas-overeni` | hotovo 17. 11. 2026 (Po P6) |
| K1 | Herní jádro a první dva formáty: sdílená logika v `src/lib/herna/`, herní pohyb (zamíchání, otočení karty, razítko), **Seřaď na ose** a **Kdo to řekl?** | Opus 5.5 · high se skillem `atlas-komponenta` | hotovo 17. 11. 2026 (Po K1) |
| K2 | Úprava Seřaď na ose a Kdo to řekl? podle zásady Pointa není paměť, pak **Tipni si**, **Kde to bylo?** (slepá mapa), **Doplň citát** | totéž | hotovo 17. 11. 2026 (Po K2) |
| K3 | **Páry**, **Pravý, nebo podvržený?**, **Najdi slabé místo**, **Kdo by to řekl?** | totéž | hotovo 17. 11. 2026 (Po K3) |
| K4 | Stránky osob a mapa: **střídání malých aktivit** na medailoncích a profilech, **Výpravy** pro období 1 a 2, **Přehrát období**, trasy na mini mapě | totéž | na řadě |
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

## Zadání K4: stránky osob a mapa

Opus 5.5 · high, skill `atlas-komponenta` (texty skillem `atlas-psani`), nový chat.

```
Ve větvi herna-v1 na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Přečti CLAUDE.md, docs/pouceni.md, docs/design.md (Pohyb, Bloky a aktivity, Komponenty; z Mapy a času a Stránek osob jen to, co se týká Přehrát život, mini mapy a Doby a lidí, podle nadpisů), v docs/plany/herna-v1.md Co platí (hlavně Pointa není paměť), Formáty a Po K3, skilly atlas-komponenta a atlas-psani, z podkladů docs/podklady/herna.md jen oddíly 5 (Tipni si a Seřaď na ose) a 6 (Výpravy) a z docs/navraty.md jen řádek o mini mapě (oddíl Stránky osob). Archiv nečti. Ze src/lib čti jen to, co použiješ: herna/index.ts a soubory her, které budeš vybírat (vazby.ts, odhad.ts, mista.ts, citaty.ts), zivot-na-mape.ts, medailonek.ts, stranky-osob.ts, cas-mapy.ts; vzor ostrovu je KdeToBylo.svelte (mapa a špendlík) a Pary.svelte (čáry v SVG přepočítané po změně velikosti), vzor stránky osoby StrankaMedailonku.astro a DobaALide.astro.

Zásada kroku stejná jako v K2 a K3: student se nic neučí nazpaměť ani nehádá, o koho jde. Hra mu dá do ruky, podle čeho uvažovat (myšlenku osoby z pole proc, vztahy, pobyty z dat), a odkrytí řekne, kdo na koho navázal a proč tam byl. Roky jsou jen drobný údaj. Pohyb jen po činu studenta; při omezeném pohybu a v Klidném režimu stojí na konci.

1. Střídání malých aktivit na medailoncích a profilech (pravidlo pestrosti 4): funkce vyberAktivitu v src/lib/herna/ vybere pro osobu podle dat jednu aktivitu: překvapivý současník → Kdo žil dřív?, daleká cesta nebo vyhnanství → Kde to bylo?, ověřený citát s osobou (a věta proc, která ho neopisuje) → Kdo to řekl?, dlouhý život nebo velká mezera k učiteli → Tipni si. Sousední stránky v seznamu Lidé se liší. Výběr je při sestavení pevný (semínko z id osoby), ne náhodný. Medailonek dostane hru bez YAML, sestavenou z dat (obaly her umějí vzít obsah místo id). Test projde všech 34 medailonků: žádný bez aktivity, žádné dvě sousední stejné, každá hra má dost dat.
2. Výpravy pro období 1 a 2 v Mapě a čase nad dnešní Výpravou (jedna a pevná, Sókratés 424 př. n. l.): výběr výpravy podle období na pásu, lístek s otázkou z podkladů P6 (oddíl 6), ověření na mapě, razítko „sedí“. Jedna páska na obrazovku. Logika v src/lib/herna/vypravy.ts, obsah v YAML se schématem.
3. Přehrát období: tlačítko u pásu období, rok běží sám asi minutu, Zastavit a Pokračovat; při omezeném pohybu a v Klidném režimu skoky po desetiletích bez animace; po zastavení ukáže totéž co při omezeném pohybu. Navazuje na Přehrát život (src/lib/zivot-na-mape.ts).
4. Trasy na mini mapě v Době a lidech: oblouky se šipkou a rokem mezi místy (plátno D4), jen kde jsou roky pobytu v datech; popisky se nepotkají (test obdélníků na 390 a 1440 px).
5. Zapojení: dílna, docs/design.md (jedna řádka na novou věc), testy stránek osob a mapy, které změna dotkne (otazka.spec.ts, mini-mapa.spec.ts, hodina-podoby.spec.ts, prohlidka.spec.ts), nové stavy do scripts/snimky-herna.mjs. Změř váhu stránek osob před a po (podklad pro revizi R) a co se opakuje na každé stránce, dej do sdíleného souboru.
6. Testy: Vitest na výběr aktivity a výpravy (tests/data/herna-k4.test.ts), Playwright (tests/e2e/herna-k4.spec.ts) na 390 a 1440 px, světlý a tmavý režim, axe, jen klávesnicí, dotyk přes CDP (scrollY měř před touchEnd), obnovení stránky, bez localStorage, omezený pohyb, Klidný režim. Snímky si prohlédni.
7. docs/rozhodnuti.md, celé npm test (na pozadí s výstupem do souboru), commit, oddíl Po K4 v plánu, restart npm run dev, plán do Projektu Claude. Na konci zprávy napiš, na které snímky se mám podívat, a celý prompt pro K5 (do zprávy i do plánu), s modelem a úsilím.
```

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

## Po K3 (17. 11. 2026)

Zásada Pointa není paměť platí i pro čtyři nové formáty: Páry dávají pod pojem první větu jeho vysvětlení, Pravý, nebo podvržený? razítko člověka s větou `proc`, Kdo by to řekl? větu `proc` pod každým jménem. Názorové formáty nic nehodnotí: student uvidí, kdo stál s ním.

**Co vzniklo**

- **Páry** (`Pary.astro`, `ostrovy/Pary.svelte`, druh `pary`, logika `src/lib/herna/pary.ts`): pojmy z kolekce `pojmy` (pod jménem první věta vysvětlení) a situace; dvě pasti stejného slova (okresní soud, klid od školy). Spojení klepnutím na pojem a situaci v libovolném pořadí; z klávesnice seznam u pojmu a Spojit, řádek se ukáže jen při ovládání klávesnicí (`data-klavesnice` na ploše). Čára tužkou v SVG (tah `--d-tah`): pod 560 px rámu levým okrajem, jinak přes mezeru mezi sloupci; přepočítá se po změně velikosti. Pár vedle čárkovaně a lístek „zkus to jinak“ s větou, co situace ukazuje, bez jména pojmu; po třech párech vedle Ukázat páry. Nakonec otisk „sedí“ pod lístky a věta ke každému páru i ke každé pasti.
- **Pravý, nebo podvržený?** (`PravyNeboPodvrzeny.astro`, `ostrovy/PravyNeboPodvrzeny.svelte`, druh `pravy`, logika `pripsani.ts`): ústřižek z obrazovky telefonu, pod ním razítko člověka s větou `proc`, dvě razítka (kulaté „řekl to“, hranaté „neřekl to“, podle rodu). Po otisku otisk v barvě pera přes roh ústřižku, proužek s opravou přímo na ústřižku (`Neřekl to · Will Durant, 1926`) a lístek z dat: titulek podle druhu záznamu, co doopravdy stojí v pramenu, kdo větu napsal, popis, kde koluje a jak si citát ověřit. Další ústřižek, nakonec souhrn s opravou u každé věty. V dílně pět karet (Vím, že nic nevím; Víc věcí nás straší; Jsme to, co opakovaně děláme; Neučíme se pro školu; Nejlepší pomsta).
- **Najdi slabé místo** (`NajdiSlabeMisto.astro`, `ostrovy/NajdiSlabeMisto.svelte`, druh `slabe`, nadtitulek „Tvůj škrt“, logika `slabe.ts`): stoický argument na linkovaném listu (linky nese každá věta), klepnutí přeškrtne premisu červenou tužkou po každém řádku (`getClientRects`, `stroke-dashoffset`), nebo „Žádnou, argument mi drží“; nepovinné Proč a Zapsat do deníku. Pak kdo by větu škrtl s tebou (Aristotelés, Etika Nikomachova 1100b a 1149a) a kdo ji hájil (Epiktétos, Marcus Aurelius); u „drží mi“ zastánce a kdo by argument napadl. Zápis „Škrtám větu: „…“. Proč: …“.
- **Kdo by to řekl?** (`KdoByToRekl.astro`, `ostrovy/KdoByToRekl.svelte`, druh `kdo-by`, nadtitulek „Dnešní věta“, logika `kdo-by.ts`): výstřižek jako plakátek (reklama, motivační obrázek) nebo bublina (chat, rada kamaráda, komentář), razítka lidí s větou `proc`, nepovinné Proč, Zapsat do deníku; lístek „Tvůj výběr“, „Atlas by vybral…“ s citátem z pramene a „Kdo by větu odmítl“. V dílně „Méně je víc.“ (Diogenés, Epikúros × Aristotelés) a „Všechno je jen úhel pohledu.“ (Prótagorás × Sókratés u Platóna).
- **Sdílené:** hlas (razítko, jméno, proč, citát s místem) je `ostrovy/HlasHerny.svelte` a `hlasHerny` v `bloky/_kontrola.ts`; typ `HlasHerny` v `bloky-typy.ts`.
- **Zapojení:** `bloky/index.ts`, schémata `BlokPary`, `BlokPravy`, `BlokSlabe`, `BlokKdoBy` (a seznam druhů v `tests/data/bloky.test.ts`), nadtitulky, `DruhBloku` a druhy zápisů `slabe`, `kdo-by` v `denik.ts`, `BLOKY_S_ODPOVEDI`, `BLOKY_Z_YAML`, dílna (`#h-pary`, `#h-pravy`, `#h-slabe`, `#h-kdo-by`), `pruchod.spec.ts`, `scripts/slova-cesta.mjs` a `scripts/snimky-cesta.mjs` (nové větve před Slož argument) a `scripts/snimky-herna.mjs`.
- **Testy:** `tests/data/herna-k3.test.ts` (logika všech čtyř formátů a obsah bloků proti pojmům, připsáním, citátům a osobám) a `tests/e2e/herna-k3.spec.ts` (23 testů: 390 a 1440 px, světlý i tmavý režim, jen klávesnicí, axe, obnovení, klepnutí v obou pořadích, dotyk přes CDP se `scrollY` před koncem dotyku, cíle 44 px, bez `localStorage`, plný a omezený pohyb, Klidný režim). Celé `npm test`: kontrola typů bez chyb, 1490 testů ve Vitestu a všech 853 v Playwrightu.
- `docs/design.md` (Bloky a aktivity, Komponenty), `docs/rozhodnuti.md` (17. 11. 2026, K3) a dvě poučení v `docs/pouceni.md` (schované prvky a Playwright, linky listu).

**Nad čím jsem váhal a co by šlo jinak**

- **Páry hodnotí každý pár hned.** Zadání chce „zkus to jinak“ u páru, který nesedí; kdyby se hodnotilo až po spojení všech, student by nevěděl, ke kterému páru věta patří. Jinak: spojovat všechno a pak jedna kontrola se značkami jako u Seřaď na ose.
- **Seznam u pojmu jen pro klávesnici.** Viditelný pořád by na telefonu zdvojnásobil výšku lístků pojmů; viditelný po klepnutí myší by lístek roztáhl a situace pod prstem uskočily. Rozhoduje poslední klávesa na ploše, protože `:focus-visible` po programovém fokusu Chromium nedává.
- **Pravý, nebo podvržený? je jeden otisk na ústřižek**, bez „zkus to jinak“, jako Kde to bylo?: druhý pokus u dvou razítek je jen to druhé. Sedí-li otisk, přibude kulaté „sedí“; jinak lístek začne rovnou titulkem z dat („Takhle to neřekl.“).
- **Texty z dat, které by šly líp:** popis u Senekova 13. dopisu opakuje konec citátu, který lístek ukazuje o řádek výš, a věta `proc` Marca Aurelia („Jeho Hovory k sobě patří k nejčtenějším knihám stoicismu“) nedává myšlenku, podle které by student uvažoval. Data se v herně nepřepisují; krok T může vybrat jiné karty, nebo navrhnout úpravu dat do `docs/navraty.md`.
- **Hlasy proti stoickému argumentu jsou oba Aristotelovy** (1100b: rána bolí doopravdy; 1149a: hněv přeslechne rozum). Jiný doložený hlas proti „soudy máme ve své moci“ v datech není. Říkají, kdo by větu škrtl, ne že s Epiktétem vedl spor.
- **Nadtitulky „Tvůj škrt“ a „Dnešní věta“** jsem zvolil sám; jinak třeba „Kde nesouhlasíš?“ a „Komu to sedí?“.
- **Texty v dílně** (situace a věty k párům, hlavičky ústřižků, věty o ověření, proč u hlasů) jsem psal sám z podkladů P6 a pramenů, které už v datech jsou; do antiky je projde krok T se skillem `atlas-psani`.

**Na které snímky se podívat** (`Claude outputs/snimky/`): `herna-pary-zkus-390-svetly.png` a `herna-pary-sedi-1440-tmavy.png` (čáry levým okrajem a mezi sloupci), `herna-pravy-otisk-390-svetly.png` a `herna-pravy-souhrn-390-svetly.png` (ústřižek s opravou, souhrn), `herna-slabe-skrt-390-svetly.png` a `herna-slabe-hlasy-1440-tmavy.png` (červená tužka na linkách, hlasy), `herna-kdoby-klid-390-svetly.png` a `herna-kdoby-atlas-1440-svetly.png` (plakátek, lístek atlasu), `herna-kdoby-bublina-390-svetly.png`. V dílně: `/dilna/bloky/#h-pary`, `#h-pravy`, `#h-slabe`, `#h-kdo-by`.

Další krok: K4 v novém chatu, Opus 5.5 · high se skillem `atlas-komponenta`; celé znění promptu je v Zadání K4.

## Co zůstává na později

- Porota, Dialog, Úryvek s otázkou, Příběh v obrazech a hračky vzniknou v celku, který je první potřebuje (`docs/plany/po-auditu.md` › Větve).
- Co ti zůstalo?, kartičky s rozestupem a vystřižené citáty: `denik-v2`.
- Zvuk (Poslechni si) a film: `film-0`, zvuk později.
- Pravidla pestrosti a katalog aktivit do skillů: `uklid-v1`.
- Kontrola VoiceOverem z design-v2 (`docs/archiv/plany/design-v2.md` › Co zůstává na později) se hodí k revizi R, když bude autor u Macu.
