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

Hotové kroky jsou ve dvou souborech: zadání P6 až K3, odpovědi před P6, Po P6, Po K1 a Po K2 v `docs/plany/herna-v1-1.md`, zadání K4 a Po K3 v `docs/plany/herna-v1-2.md`.

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| P6 | Podklady pro formáty: citáty pro Kdo to řekl? a Doplň citát, podvržené citáty s doloženým původem, věty pro Kdo by to řekl?, situace pro Páry, čísla pro Tipni si, otázky pro Výpravy, látka stránky Argumentační klamy a manipulace | Opus 5.5 · high se skillem `atlas-overeni` | hotovo 17. 11. 2026 (Po P6) |
| K1 | Herní jádro a první dva formáty: sdílená logika v `src/lib/herna/`, herní pohyb (zamíchání, otočení karty, razítko), **Seřaď na ose** a **Kdo to řekl?** | Opus 5.5 · high se skillem `atlas-komponenta` | hotovo 17. 11. 2026 (Po K1) |
| K2 | Úprava Seřaď na ose a Kdo to řekl? podle zásady Pointa není paměť, pak **Tipni si**, **Kde to bylo?** (slepá mapa), **Doplň citát** | totéž | hotovo 17. 11. 2026 (Po K2) |
| K3 | **Páry**, **Pravý, nebo podvržený?**, **Najdi slabé místo**, **Kdo by to řekl?** | totéž | hotovo 17. 11. 2026 (Po K3) |
| K4 | Stránky osob a mapa: **střídání malých aktivit** na medailoncích a profilech, **Výpravy** pro období 1 a 2, **Přehrát období**, trasy na mini mapě | totéž | hotovo 17. 11. 2026 (Po K4) |
| K5 | Kurikulum: karta **Do hodiny**, **sebehodnocení** na konci cesty, stránka **Argumentační klamy a manipulace** | komponenty `atlas-komponenta`, text `atlas-psani` · Opus 5.5 · high | na řadě |
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

## Zadání K5: Do hodiny, sebehodnocení, Argumentační klamy a manipulace

Opus 5.5 · high, skill `atlas-komponenta` (texty skillem `atlas-psani`), nový chat.

```
Ve větvi herna-v1 na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Přečti CLAUDE.md, docs/pouceni.md, docs/design.md (Pohyb, Rozvržení, Bloky a aktivity, Komponenty, Přístupnost), v docs/plany/herna-v1.md Co platí (hlavně Pointa není paměť), Formáty a Po K4, v docs/plany/herna-v1-1.md jen odpovědi 6 a 7 v Co rozhodnout před P6, v docs/plany/kurikulum.md jen řádek herna-v1 a odpovědi 3 až 5, skilly atlas-komponenta a atlas-psani, z podkladů docs/podklady/herna.md jen oddíl 7 (Argumentační klamy a manipulace) a z oddílu Citáty jen citáty, které oddíl 7 potřebuje. Archiv nečti. Ze src/lib čti jen to, co použiješ: hodiny.ts a pruchod-hodiny.ts (příprava a promítání hodiny), denik.ts (zápis k cestě, Na začátku × Teď), stranky.ts a stranky-schema.ts (nová stránka z dat), herna/slabe.ts a herna/pripsani.ts; vzor stránky je StrankaUvodu.astro, vzor bloku ZaverCesty a ostrovy NajdiSlabeMisto.svelte a PravyNeboPodvrzeny.svelte, vzor lišty hodiny ListaHodiny.astro.

Zásada kroku stejná jako v K2 až K4: nic se neboduje, nic se neučí nazpaměť. Student dostane do ruky, podle čeho uvažovat, a odkrytí mu řekne, odkud věc pochází. Sebehodnocení nehodnotí, jen ukládá, co student o sobě napíše. Pohyb jen po činu studenta; při omezeném pohybu a v Klidném režimu stojí na konci. Hotový text cest se nepřepisuje: nové věci přibývají jako přídavek.

1. Karta Do hodiny: jedna otázka do dvojice a jedna pro celou třídu, obsah v YAML k cestě (schéma, kontrola při sestavení), vzhled lístku pro učitele (ne blok pro studenta). Student ji vidí jen v promítání hodiny a v přípravě hodiny (Skladatel), jinak ne; katalog hodin ji zná jako zastavení. Zkouška v cestě 1 jako přídavek na konci posledního kroku; otázky napiš skillem atlas-psani.
2. Sebehodnocení na konci cesty (odpověď 6): dvě krátké otázky (co už umím, v čem si jistý nejsem), bez bodů a bez správné odpovědi, nepovinné; zápis do deníku k cestě a v deníku vedle Na začátku × Teď. Zapojit tak, aby ho dostaly všechny cesty bez úpravy jejich textu (ZaverCesty nebo stránka cesty), a ověř na cestě 1 a jedné další.
3. Stránka Argumentační klamy a manipulace (odpověď 7) z podkladů P6, oddíl 7: úvod podle atlas-psani (o čem to je a co si student odnese), u každého klamu antický a dnešní případ, uprostřed Najdi slabé místo a Pravý, nebo podvržený? (nové bloky v YAML, ne kopie dílny), na konci odkaz do deníku. Odkazy na stránku z Otázek a z Kam dál cesty 1 bez přepsání textu cesty. Stránka do tests/e2e/nove-stranky.spec.ts, do katalogu hodin (ověř skriptem scripts/hodiny-katalog.mjs proti dist/) a do hledání.
4. Zapojení: dílna (Do hodiny a sebehodnocení), docs/design.md (jedna řádka na novou věc), testy, které změna dotkne (pruchod.spec.ts, hodina-podoby.spec.ts, denik testy, otazka.spec.ts, nove-stranky.spec.ts), scripts/slova-cesta.mjs a scripts/snimky-cesta.mjs, pokud přibude tlačítko v kroku, nové stavy do scripts/snimky-herna.mjs. Změř váhu stránek cest před a po (node scripts/vaha-stranek-osob.mjs dělá totéž pro stránky osob; přidej volbu pro cesty).
5. Testy: Vitest (tests/data/herna-k5.test.ts) na schémata, kontrolu obsahu a zápis sebehodnocení; Playwright (tests/e2e/herna-k5.spec.ts) na 390 a 1440 px, světlý a tmavý režim, axe, jen klávesnicí, dotyk přes CDP (scrollY měř před touchEnd), obnovení stránky, bez localStorage, omezený pohyb, Klidný režim, promítání a příprava hodiny. Snímky si prohlédni.
6. docs/rozhodnuti.md, celé npm test (na pozadí s výstupem do souboru), commit, oddíl Po K5 v plánu, restart npm run dev, plán do Projektu Claude. Na konci zprávy napiš, na které snímky se mám podívat, a celý prompt pro T (do zprávy i do plánu), s modelem a úsilím.
```

## Zadání T: přídavky v antice

Ve větvi `herna-v1`. Přečti `CLAUDE.md`, `docs/styl.md`, `docs/pouceni.md`, v tomto plánu Formáty a oddíly Po K4 a Po K5, v `docs/plany/herna-v1-1.md` odpovědi před P6, Po K1 a Po K2, v `docs/plany/herna-v1-2.md` Po K3, skilly `atlas-cesta` a `atlas-psani`.

1. Každý formát vlož na jedno místo antiky podle tabulky v Co rozhodnout, otázka 1 (`docs/plany/herna-v1-1.md`). Napiš jen zadání, scénu a zpětné vazby nového bloku; okolní text se nemění. Kde se přídavek k místu nehodí, navrhni jiné a zapiš proč.
2. U každého přídavku čtyři otázky zásady a otázka pilíře, odpovědi do Po T.
3. Nové bloky do skillu `atlas-cesta` (knihovna bloků, jedna řádka a příklad) i do jeho kopie ve `skills/`; pravidla pestrosti tam zapíše až `uklid-v1`.
4. Celé `npm test`, commit, Po T, snímky kroků se skriptem `scripts/snimky-cesta.mjs`, plán do Projektu. Zastav se.

## Zadání R a O

**R** podle skillu `atlas-revize` s perspektivami student, učitel, uživatel a přístupnost (`design:accessibility-review`, `design:design-critique`): u každého formátu čtyři otázky zásady, otázka pilíře, telefon a notebook v obou režimech, Klidný režim, jen klávesnice, VoiceOver jen s autorem (pouceni: nastavení přístupnosti mění autor), dotyk skutečnými událostmi, váha stránek osob po K4. Záznam do `docs/revize/herna-v1.md`, nálezy podle dopadu, drobnosti rovnou opravit.

**O** opraví nálezy, přidá referenční snímky nových formátů do `tests/e2e/snimky.spec.ts`, doplní `docs/design.md` a `docs/pouceni.md` a skončí otázkou na schválení větve, kterou zodpoví jen autor.

## Po K4 (17. 11. 2026)

Zásada Pointa není paměť platí i na stránkách osob a v mapě: hra dá do ruky pobyt, vztah nebo myšlenku z dat a odkrytí řekne, kdo na koho navázal a proč tam člověk byl. Roky jsou drobný údaj.

**Co vzniklo**

- **Hra na medailonku** (`osobnost/HraOsoby.astro`, logika `src/lib/herna/aktivity.ts`, výpis všech stránek `npx vite-node scripts/herna-k4-vypis.ts`): `kandidatiAktivit` najde, co data u člověka unesou (vyhnanství nebo pobyt s časem aspoň 500 km od rodiště → Kde to bylo?; citát člověka ze vztahů → Kdo to řekl?; četba přes aspoň jeden lidský život nebo život od 90 let → Tipni si; vždy Kdo žil dřív?), `vyberAktivity` vybere celou řadu v pořadí seznamu Lidé naráz (sousedé různí, silnější kandidát dřív, semínko z id), `obsahAktivity` složí obsah stejnými schématy jako YAML. Obaly `KdeToBylo`, `KdoToRekl` a `TipniSi` berou `obsah` místo id (`blokZObsahu` v `_kontrola.ts`). Na 34 medailoncích: Kdo žil dřív? 9, Kdo to řekl? 9, Tipni si 9, Kde to bylo? 7. Kdo to řekl? s jednou kartou nemá počítadlo ani souhrn. Katalog hodin zná hru medailonku jako zastavení se stejným id a otázkou; hledání ji neindexuje (`data-pagefind-ignore`), jinak rub „…se učil u Sókrata“ na sedmi medailoncích vytlačil profil Sókrata z výsledků.
- **Místa v 6. pádu** (`kde` v `mista.yaml`, všech 55; schéma `Misto`).
- **Výpravy** (`src/data/vypravy.yaml`, devět výprav z P6: pět v období 1 včetně Sókrata 424, čtyři v období 2; schéma a logika `src/lib/herna/vypravy.ts`; kontrola proti `kdeVRoce` zastaví sestavení): lístek pro období na pásu s počtem („1 z 5“), Další výprava, ověření na mapě (vybraný člověk v roce výpravy), razítko „sedí“ jen ve chvíli splnění a odpověď z dat (pobyt, rodiště, jedna ověřená věta z YAML). Stav v `localStorage` (`atlas-vypravy`). Lístek je vidět i v celé mapě, dokud není vybraný jiný člověk.
- **Přehrát období** (u pásu v `MapaACas.svelte`, `planObdobi`, `desetiletiDal`, `desetiletiZpet`, `zacatekObdobi` v `src/lib/zivot-na-mape.ts`): Přehrát období, Zastavit, po zastavení Pokračovat a 10 let zpět a dál; při omezeném pohybu a v Klidném režimu jen skoky po desetiletích. Na telefonu jen značky, cíl 44 px. Testy si přehrávání zkrátí háčkem `window.atlasPrehravaniObdobi`.
- **Trasy na mini mapě** (`src/lib/trasy-mapy.ts`, `MiniMapa.astro`): oblouk se šipkou a rokem jen tam, kde je rok příchodu v datech; tam a zpět na dvou stranách, opakovaná cesta jeden oblouk se všemi roky („asi 366 a 361 př. n. l.“); rok hledá místo, kde se nepotká s názvy, rolemi, body ani jiným rokem (41 ze 47 oblouků ho má). Trasy jsou i v popisu mapy pro čtečku.
- **Váha stránek osob** (`node scripts/vaha-stranek-osob.mjs [dist]`): medailonek před 68,6 kB HTML (16,9 kB gzip), po 60,5 kB (14,4 kB); profil 154,6 → 137,6 kB (35,6 → 31,2 kB gzip). Co se opakovalo na každé stránce: styly v `<style>` (písma, mini mapa, Kam dál, Prameny, asi 13 kB) jsou teď vždy v souborech (`inlineStylesheets: 'never'`) a skript fokusu nad lištou je modul `src/scripts/fokus-lista.ts`. Stránka načte víc souborů CSS (medailonek 11 místo 4, Sókratés 19 místo 6), ty si prohlížeč uloží. Zbytek opakovaných skriptů v hlavičce (režim, pero, hodina, přechod, příchod) musí běžet před vykreslením a zůstal vložený.
- **Zapojení:** dílna (`#h-hra-osoby`, `#h-trasy`), `docs/design.md`, `docs/rozhodnuti.md`, `docs/navraty.md` (trasy hotové; profily a Thalés), `scripts/snimky-herna.mjs` (nové stavy K4 a čekání na ostrov konkrétního bloku), `mapa-k7a.spec.ts` (výprava zůstane po Víc nad kartou, odpověď „U Délia…“).
- **Testy:** `tests/data/herna-k4.test.ts` (62: výběr, všech 34 medailonků, výpravy proti datům, přehrávání období, trasy) a `tests/e2e/herna-k4.spec.ts` (19: hry na medailoncích jen klávesnicí, sousedé v seznamu Lidé, výpravy podle období s obnovením, Přehrát období v plném a omezeném pohybu a v Klidném režimu, dotyk přes CDP a cíle 44 px, bez `localStorage`, trasy na 390 a 1440 px ve světlém i tmavém režimu, axe). Celé `npm test`: kontrola typů bez chyb, 1552 testů ve Vitestu a 872 v Playwrightu; čtyři spadly v prvním běhu a po opravě prošly znovu (test hry nad Dobou a lidmi v `dva-zivoty.spec.ts`, letopočet ve větě `proc` pod razítkem, hledání „Sókrata“ a jednou časový limit mapy v roce 121 na 390 px, který se v dalším běhu neopakoval).

**Nad čím jsem váhal a co by šlo jinak**

- **Profily jsem nechal.** Mají ručně psanou Kdo žil dřív? v MDX a hotový text se do fáze 5 nemění; výběr je bere jako pevné a medailonky kolem se jim vyhnou. Tři portréty a tři profily vedle sebe proto mají tutéž hru a Thalés (jen Kdo žil dřív?) stojí vedle Hérakleita. Jinak: v kroku T nahradit řádek `<KdoZilDriv …>` v profilech komponentou `HraOsoby`, pak by se střídaly i profily. Zapsáno v `docs/navraty.md`.
- **Kdo to řekl? na medailonku nese větu člověka ze vztahů**, ne osoby stránky: medailonky vlastní citáty skoro nemají a vlastní věta na vlastní stránce by byla hádání jména. Rub nahoře řekne vztah („Theofrastos se učil u Aristotela.“). Další dvě razítka jsou lidé kolem osoby, pak kolem mluvčího, pak z období; scéna proto říká „někdo z lidí kolem Theofrasta“, ne kdo přesně.
- **Které citáty:** přednost mají hlasy velkých otázek, pak citáty, které atlas cituje v textu; jinak se z citátů v datech (5 až 25 slov, bez jména a bez vypuštěného místa) vybírá semínkem. Některé věty jsou i tak vytržené z dialogu (Chairefón: „Má člověk dodržet, na čem se s někým dohodl…“); krok T nebo revize je může vyměnit, pak stačí citát ve výpisu přeskočit.
- **Tipni si z dlouhého života** dává odpověď „mohli se potkat“ (Gorgiás a Diogenés, Isokratés a Kratés). Je to překvapení, o které jde, ale pětkrát za sebou by se student naučil vzor; v řadě jsou čtyři.
- **Výprava zůstává splněná** i po obnovení; razítko dopadne jen jednou. Jinak: splněnou ukazovat jen s vybraným člověkem.
- **Přehrát období začne v aktuálním roce**, leží-li v okně období a ne na jeho konci; jinak na začátku okna. Výběr člověka přehrávání nezastaví (karta se dá číst), posun času ano.
- **Styly v souborech** zmenšily stránky, ale přidaly požadavky při první návštěvě. Kdyby revize R chtěla méně souborů, jde vrátit `inlineStylesheets: 'auto'` a vytáhnout jen písma a mini mapu.
- **Rok trasy v kurzívě v barvě období** (`--p`), stejné velikosti jako role místa; oblouk čárkovaný. Rok stojí i v řádku role u místa, takže oblouk bez roku nic neschová.

**Na které snímky se podívat** (`Claude outputs/snimky/`): `herna-k4-kdorekl-rub-390-svetly.png` (Kdo to řekl? z dat, rub se vztahem), `herna-k4-tipni-klid-1440-svetly.png` a `herna-k4-kde-klid-390-svetly.png` (Tipni si a Kde to bylo? z dat), `herna-k4-mapa-vyprava-390-tmavy.png` a `herna-k4-mapa-vyprava-1440-svetly.png` (splněná výprava nad kartou), `herna-k4-obdobi-bezi-1440.png` a `herna-k4-obdobi-zastaveno-390.png` (Přehrát období během běhu a po zastavení), `herna-k4-trasy-sokrates-390-svetly.png` a `herna-k4-trasy-sokrates-1440-tmavy.png` (trasy). Naživo: medailonky Theofrasta, Kleantha a Musonia Rufa, `/mapa/` (období 1 a 2 na pásu) a dílna `#h-hra-osoby`, `#h-trasy`.

Další krok: K5 v novém chatu, Opus 5.5 · high se skillem `atlas-komponenta`; celé znění promptu je v Zadání K5.

## Co zůstává na později

- Porota, Dialog, Úryvek s otázkou, Příběh v obrazech a hračky vzniknou v celku, který je první potřebuje (`docs/plany/po-auditu.md` › Větve).
- Co ti zůstalo?, kartičky s rozestupem a vystřižené citáty: `denik-v2`.
- Zvuk (Poslechni si) a film: `film-0`, zvuk později.
- Pravidla pestrosti a katalog aktivit do skillů: `uklid-v1`.
- Kontrola VoiceOverem z design-v2 (`docs/archiv/plany/design-v2.md` › Co zůstává na později) se hodí k revizi R, když bude autor u Macu.
