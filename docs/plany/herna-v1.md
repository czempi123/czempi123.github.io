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

Hotové kroky jsou ve dvou souborech: zadání P6 až K3, odpovědi před P6, Po P6, Po K1 a Po K2 v `docs/plany/herna-v1-1.md`, zadání K4 a K5, Po K3 a Po K4 v `docs/plany/herna-v1-2.md`.

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| P6 | Podklady pro formáty: citáty pro Kdo to řekl? a Doplň citát, podvržené citáty s doloženým původem, věty pro Kdo by to řekl?, situace pro Páry, čísla pro Tipni si, otázky pro Výpravy, látka stránky Argumentační klamy a manipulace | Opus 5.5 · high se skillem `atlas-overeni` | hotovo 17. 11. 2026 (Po P6) |
| K1 | Herní jádro a první dva formáty: sdílená logika v `src/lib/herna/`, herní pohyb (zamíchání, otočení karty, razítko), **Seřaď na ose** a **Kdo to řekl?** | Opus 5.5 · high se skillem `atlas-komponenta` | hotovo 17. 11. 2026 (Po K1) |
| K2 | Úprava Seřaď na ose a Kdo to řekl? podle zásady Pointa není paměť, pak **Tipni si**, **Kde to bylo?** (slepá mapa), **Doplň citát** | totéž | hotovo 17. 11. 2026 (Po K2) |
| K3 | **Páry**, **Pravý, nebo podvržený?**, **Najdi slabé místo**, **Kdo by to řekl?** | totéž | hotovo 17. 11. 2026 (Po K3) |
| K4 | Stránky osob a mapa: **střídání malých aktivit** na medailoncích a profilech, **Výpravy** pro období 1 a 2, **Přehrát období**, trasy na mini mapě | totéž | hotovo 17. 11. 2026 (Po K4) |
| K5 | Kurikulum: karta **Do hodiny**, **sebehodnocení** na konci cesty, stránka **Argumentační klamy a manipulace** | komponenty `atlas-komponenta`, text `atlas-psani` · Opus 5.5 · high | hotovo 19. 11. 2026 (Po K5) |
| T | Přídavky v antice: každý formát na jednom místě (tabulka v Co rozhodnout, otázka 1), karta Do hodiny ve zbylých devíti cestách, zadání a zpětné vazby skillem `atlas-psani`, zápis bloků do skillu `atlas-cesta` | Opus 5.5 · high se skilly `atlas-cesta` a `atlas-psani` | na řadě |
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

## Zadání T: přídavky v antice

Opus 5.5 · high, skilly `atlas-cesta` a `atlas-psani` (blok, který se mění, i `atlas-komponenta`), nový chat.

```
Ve větvi herna-v1 na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v docs/plany/herna-v1.md Co platí (hlavně Pointa není paměť), Formáty a Po K5, v docs/plany/herna-v1-1.md odpovědi v Co rozhodnout před P6, Po K1 a Po K2, v docs/plany/herna-v1-2.md Po K3 a Po K4, skilly atlas-cesta a atlas-psani. Z podkladů docs/podklady/herna.md čti jen oddíly formátů, které právě vkládáš, a z oddílu Citáty jen citáty, které ty oddíly potřebují. Archiv nečti. Ze src/lib a src/components čti jen to, co použiješ; vzory bloků jsou v dílně (src/pages/dilna/bloky/index.mdx) a v src/content/bloky/dilna-*.yaml.

Zásada kroku jako v K2 až K5: nic se neboduje, nic se neučí nazpaměť. Student dostane do ruky, podle čeho uvažovat (myšlenku osoby z dat, vztahy), odkrytí mu řekne, odkud věc pochází a kdo na koho navázal. Hra stojí až tam, kde student lidi ze hry už potkal. Hotový text se nepřepisuje: nový blok jde mezi hotové odstavce nebo na konec stránky jedním řádkem, okolní věty se nemění. Postřehy k hotovému textu patří do docs/navraty.md.

1. Každý formát herny vlož na jedno místo antiky podle odpovědi 1 v docs/plany/herna-v1-1.md (Co rozhodnout před P6): Seřaď na ose na stránce období 1, Tipni si na stránce období 2, Kdo to řekl? na stránce směru Stoicismus, Doplň citát na konci kapitoly o soudu v portrétu Sókrata, Páry na stránce směru Epikureismus, Pravý, nebo podvržený? v posledním kroku cesty 1, Najdi slabé místo v kroku cesty 8 s Epikúrovým argumentem, Kdo by to řekl? na stránce otázky 1. Stránka klamů a karta Do hodiny v cestě 1 jsou hotové z K5. Každý přídavek je nový YAML blok (ne kopie dílny ani stránky klamů); napiš jen zadání, scénu a zpětné vazby skillem atlas-psani. Kde se přídavek k místu nehodí (stejný citát nebo stejná scéna podruhé v celku, blok by prozradil, co text řekne až za ním), zvol jiné místo a zapiš proč.
2. Karta Do hodiny ve zbylých devíti cestách: src/content/do-hodiny/<slug>.yaml a <DoHodiny /> na konci posledního kroku. Otázka do dvojice (co spolu dva udělají) a otázka pro třídu, obě k tomu, co cesta opravdu dělala; skillem atlas-psani, bez rodu studenta, věty do 25 slov.
3. Profily: Po K4 navrhuje nahradit řádek <KdoZilDriv …> v profilech komponentou HraOsoby, ať se hry střídají i tam (docs/navraty.md). Udělej to jen tam, kde se tím nezmění okolní text, a zapiš, kde ne.
4. Nový blok v kroku cesty musí znát i to, co cestu prochází samo (docs/pouceni.md › Technika): tests/e2e/pruchod.spec.ts (odpovez), scripts/slova-cesta.mjs a scripts/snimky-cesta.mjs. Stránky, kterých se přídavky dotknou, si projdi testy obsahu (grep -rn věty v tests/) a katalog hodin ověř skriptem scripts/hodiny-katalog.mjs proti dist/.
5. U každého přídavku čtyři otázky zásady (odnese si něco, přemýšlí sám, zůstává otevřená, chtěl by ji udělat i bez povinnosti) a otázka pilíře (co si odnese do života); odpovědi do Po T.
6. Nové bloky, karta Do hodiny a sebehodnocení do skillu atlas-cesta (knihovna bloků, jedna řádka a příklad) i do jeho kopie ve skills/; pravidla pestrosti tam zapíše až uklid-v1.
7. Snímky přídavků (scripts/snimky-cesta.mjs pro kroky, scripts/snimky-listy.mjs pro stránky) si prohlédni na 390 a 1440 px ve světlém i tmavém režimu. Celé npm test na pozadí s výstupem do souboru, docs/rozhodnuti.md, commit, oddíl Po T v plánu, restart npm run dev, plán do Projektu Claude. Na konci zprávy napiš, na které snímky se mám podívat, a celý prompt pro R (do zprávy i do plánu), s modelem a úsilím. Zastav se.
```

## Zadání R a O

**R** podle skillu `atlas-revize` s perspektivami student, učitel, uživatel a přístupnost (`design:accessibility-review`, `design:design-critique`): u každého formátu čtyři otázky zásady, otázka pilíře, telefon a notebook v obou režimech, Klidný režim, jen klávesnice, VoiceOver jen s autorem (pouceni: nastavení přístupnosti mění autor), dotyk skutečnými událostmi, váha stránek osob po K4. Záznam do `docs/revize/herna-v1.md`, nálezy podle dopadu, drobnosti rovnou opravit.

**O** opraví nálezy, přidá referenční snímky nových formátů do `tests/e2e/snimky.spec.ts`, doplní `docs/design.md` a `docs/pouceni.md` a skončí otázkou na schválení větve, kterou zodpoví jen autor.

## Po K5 (19. 11. 2026)

Kurikulum v herně: učitel dostal kartu do hodiny, student na konci každé cesty místo na dvě poznámky o sobě a atlas stránku o tricích, které vypadají jako důvod. Nic se neboduje a hotový text cest se nezměnil.

**Co vzniklo**

- **Karta Do hodiny** (`bloky/DoHodiny.astro`, schéma a kontrola `src/lib/do-hodiny.ts`, obsah `src/content/do-hodiny/<slug cesty>.yaml`, kolekce `doHodiny`): otázka do dvojice („Vyměňte si pravidla, která jste právě napsali…“) a pro celou třídu („Prótagorás by řekl…“) na lístku z kartotéky učitele (červená linka pod nadtitulkem, Ve dvojici a Celá třída se značkou). V cestě 1 jako přídavek na konci kroku 7 (`<DoHodiny />`). Na stránce je skrytá (`display: none`, `data-pagefind-ignore`), vidí ji jen promítání. Katalog hodin ji zná jako zastavení `b:cesta1-do-hodiny` (typ DoHodiny, nadtitulek Do hodiny, název je otázka pro třídu, pole `doHodiny` s oběma otázkami); Skladatel ukáže pod názvem „Ve dvojici: …“ ve výběru, v hodině i v tisku. Sestavení se zastaví, když soubor nepatří žádné cestě, věta má víc než 25 slov, nebo když `<DoHodiny />` nestojí v posledním kroku.
- **Sebehodnocení** (`ostrovy/Sebehodnoceni.svelte`, `src/lib/sebehodnoceni.ts`): pod Závěrem cesty ve všech deseti cestách, vkládá ho `bloky/ZaverCesty.astro`. Nadtitulek Pro sebe, nadpis Kam tě cesta dovedla?, věta „Dvě poznámky jen pro tebe, bez známky a bez správné odpovědi…“ a dvě nepovinná pole Co už umím a Co mi ještě není jasné (MojeStanovisko, ukládá se samo). Zápisy `<slug>-umim` a `<slug>-nejsem`, druh `sebehodnoceni`, odkaz na kotvu `<slug>-sebehodnoceni`; prázdné pole zápis smaže. Deník: zápisník u cesty a Moje filozofie u velké otázky cesty pod Na začátku × Teď („na konci cesty …“, Co už umím, Co mi ještě není jasné, nenapsané jako „Nenapsáno.“).
- **Argumentační klamy a manipulace** (`/argumentacni-klamy/`, `src/content/uvody/argumentacni-klamy.mdx`, šablona `StrankaUvodu.astro` s novou volbou `tvary` pro hledání): úvod (perex: co si student odnese), scéna z Euthydéma (Kleinias a otázka, na kterou nešlo odpovědět; Dionýsodóros šeptá citát 275e) a výklad, co je sofistické vyvrácení. Oddíly Triky na lidi (útok na osobu, autorita, většina, soucit), Triky s myšlenkou (slaměný panák, falešné dilema, šikmá plocha, kruh, vytržení z kontextu), Věta s cizím jménem (podvržený citát) a závěr Proč?; u každého klamu antický i dnešní případ z P6 a věta, co se dá odpovědět. Citáty v textu jen čtyři (275e, Obrana 23d a 35c, Ústava 564a). Uprostřed nové bloky `klamy-slabe-video` (influencer a vitamín C; škrtl by Cicero a Sókratés z Gorgia, s argumentem by stál Kritón) a `klamy-pravy` (nádoba a oheň, Senekova pravá věta, laskavý a těžký boj, řeka a týž člověk; s dílnou má společnou jen Senekovu větu). Na konci Kam dál do deníku, na cestu 1 a na Co je filozofie?. Odkazy: druhý lístek na Otázkách, řádek v Kam dál přehledu cesty 1 z nového pole `kamDal` ve frontmatteru cesty. Stránka je v katalogu hodin (stránka, tři oddíly, příběh, dva bloky; `scripts/hodiny-katalog.mjs`: 182 stránek, 0 chyb), v hledání (najde „manipulace“, „klamy“, „slaměný panák“) a v deníku mezi úvody (`_zapisnik-data.ts`).
- **Zapojení:** dílna (`#h-do-hodiny` s lístkem vždy vidět, `#h-sebehodnoceni`), `docs/design.md` (Do hodiny, Sebehodnocení, úvod klamů), `docs/rozhodnuti.md`, `scripts/snimky-herna.mjs` (stavy K5; `SKUPINA=k5` pustí jen je), `scripts/vaha-stranek-osob.mjs --cesty`. Tlačítko v kroku nepřibylo, `scripts/slova-cesta.mjs` a `scripts/snimky-cesta.mjs` se proto neměnily (kartu `innerText` nevidí, sebehodnocení se počítá do čtení).
- **Oprava mimochodem:** otisk „neřekl to“ v Pravý, nebo podvržený? vystrčil na 390 px stránku o pixel do strany (od K3, i v dílně); na telefonu jde přes roh ústřižku jen o 2 px.
- **Váha stránek cest** (`node scripts/vaha-stranek-osob.mjs --cesty`): poslední krok každé cesty +2,1 až 2,7 kB HTML (+0,3 až 0,5 kB gzip) za sebehodnocení; krok 7 cesty 1 +4,4 kB (+1,0 kB gzip) i s kartou; přehled cesty 1 +0,2 kB. Průměr všech stránek cest 51,8 → 52,0 kB (13,4 kB gzip beze změny), průměr posledních kroků 53,0 → 55,5 kB (13,6 → 14,0 kB gzip).
- **Testy:** `tests/data/herna-k5.test.ts` (17: schéma a kontrola karty, katalog s kartou i bez ní, zápis a čtení sebehodnocení, Moje filozofie, každá cesta končí Závěrem cesty, stránka klamů: perex, deset klamů s oběma případy, citáty, bloky proti datům, Kam dál, pole `kamDal`) a `tests/e2e/herna-k5.spec.ts` (23: karta skrytá na stránce a vidět při promítání na 390 a 1440 px v obou režimech, příprava hodiny jen klávesnicí, sebehodnocení v cestě 1 a v Kolik je dost?, jen klávesnicí s obnovením a deníkem, bez localStorage, stránka klamů, hledání, bloky v obou režimech s axe, klávesnice s obnovením, dotyk přes CDP a cíle 44 px, omezený pohyb a Klidný režim). Upravené: `pruchod.spec.ts` (sebehodnocení je na konci každé cesty a průchod ho nechá prázdné), `nove-stranky.spec.ts` (stránka klamů v STRANKY, dva lístky na Otázkách), `zaver.spec.ts` (pod závěrem jsou dvě pole navíc a cesta klávesnicí k Dokončit cestu je o dva tabulátory delší). Celé `npm test`: kontrola typů bez chyb, 1573 testů ve Vitestu a 898 v Playwrightu; v prvním běhu spadlo deset testů závěru (počet polí, Tab k Dokončit cestu a ostrov sebehodnocení s `client:visible`, který se bez posunu nehydratoval; teď `client:idle`), po opravě prošly.

**Nad čím jsem váhal a co by šlo jinak**

- **Karta jako vlastní kolekce, ne blok.** Nemá stav ani deník a v unii bloků by ji musel znát každý kód, který bloky prochází. Jinak: druh `do-hodiny` v `src/content/bloky/`.
- **Karta je jen v cestě 1** jako zkouška; zbylých devět cest dostane kartu v kroku T (zadání, bod 2). Při promítání celého kroku 7 stojí karta až na konci, kam učitel dojede; jako samostatné zastavení je na plátně sama.
- **„Co mi ještě není jasné“ místo „v čem si jistý nejsem“** a nadpis „Kam tě cesta dovedla?“: texty atlasu nenesou rod studenta. Jinak: „Čím si ještě nejsem jistý“ (pořád s rodem).
- **Sebehodnocení stojí hned pod závěrem**, který je ve všech cestách poslední v textu kroku; karta Stoického týdne (šablona kroku) zůstává pod ním. Jinak: šablona kroku by ho dala až pod kartu týdne.
- **Odpovědní věty u klamů** („Dá se odpovědět otázkou…“, „Zeptej se, jestli jsou to opravdu jediné dvě možnosti.“) v podkladech nejsou; jsou moje a nic historického netvrdí. Ze dvou antických případů u slaměného panáka a podvrženého citátu jsem nechal jeden (Aristofanés, dopisy Seneky a Pavla); Kólótés a Sedmý list zůstávají v podkladech.
- **Najdi slabé místo nemá u premis nikoho, kdo by je hájil** (`hajil` je nepovinné): Kritón stojí s celým argumentem v „Žádnou, argument mi drží“. Jinak: Kritón i u premisy 2, pak by se jeho citát ukázal dvakrát.
- **Štítek času cest (`minut`) jsem neměnil:** sebehodnocení je nepovinné a přidá asi čtyřicet slov.

**Na které snímky se podívat** (`Claude outputs/snimky/`): `herna-k5-dohodiny-dilna-1440-svetly.png` (lístek), `herna-k5-promitani-karta-1440.png` a `herna-k5-promitani-krok-1440.png` (karta na plátně sama a na konci kroku), `herna-k5-sebe-vyplnene-390-svetly.png` a `herna-k5-sebe-kolik-390-tmavy.png` (sebehodnocení), `herna-k5-denik-filozofie-390.png` (Moje filozofie), `k5-klamy-390-light-1.jpg` a `-2.jpg`, `k5-klamy-1440-dark-1.jpg` a `-2.jpg` (celá stránka klamů), `herna-k5-klamy-slabe-hlasy-390-svetly.png` a `herna-k5-klamy-pravy-otisk-1440-tmavy.png` (bloky po činu), `herna-k5-otazky-listky-1440.png` a `herna-k5-cesta1-kamdal-390.png` (odkazy). Naživo: `/argumentacni-klamy/`, `/cesta/kdy-mam-dobry-duvod-verit/7/` (sebehodnocení; karta jen při promítání), `/hodina/nova/` (hledat „Prótagorás by řekl“), dílna `#h-do-hodiny` a `#h-sebehodnoceni`.

Další krok: T v novém chatu, Opus 5.5 · high se skilly `atlas-cesta` a `atlas-psani`; celé znění promptu je v Zadání T.

## Co zůstává na později

- Porota, Dialog, Úryvek s otázkou, Příběh v obrazech a hračky vzniknou v celku, který je první potřebuje (`docs/plany/po-auditu.md` › Větve).
- Co ti zůstalo?, kartičky s rozestupem a vystřižené citáty: `denik-v2`.
- Zvuk (Poslechni si) a film: `film-0`, zvuk později.
- Pravidla pestrosti a katalog aktivit do skillů: `uklid-v1`.
- Kontrola VoiceOverem z design-v2 (`docs/archiv/plany/design-v2.md` › Co zůstává na později) se hodí k revizi R, když bude autor u Macu.
