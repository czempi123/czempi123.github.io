# Větev design-v2, část: kresby jako koláž a zadání pojmů

Část plánu větve `docs/archiv/plany/design-v2.md` (oddíl Části plánu). Text oddílů je beze změny.

## Po K7b (15. 11. 2026)

Odpovědi po K7a a po K6 dodatku byly prázdné v repozitáři i v Projektu Claude, takže platí všechna doporučení a na mapě ani v deníku se nic neměnilo. Snímky jsou v `Claude outputs/snimky/design-v2-k7b/`.

### Co se na kresbách změnilo

- **Rám** (`Kresba.svelte`): kresba leží na listu (`--list`, `--lezi`) s malou páskou v papíru období; plátno je tečkovaný papír s tenkou linkou a stínem přilepeného papíru; pod ním **vtlačená drážka** s přepínačem pohledů, ovládáním kresby a Zastavit pohyb (pilulky vystouplé, zvolená vtlačená); text pod kresbou je pod drážkou. Pořadí tabulátoru zůstalo (pohled, ovládání, pohyb). Rám dává do `<defs>` filtr stínu výstřižku, kresby ho berou třídou `k-vystrih`. Na plátně v promítání (Jen kresba) list a páska odpadnou, ať má kresba celou výšku.
- **Pravidla v `global.css`:** materiály `k-list`, `k-listek-papir`, `k-pp`, stín `k-vystrih`, tužka `k-tuzka`, popisek `k-popisek` (Instrument Sans s okrajem v barvě listu, na tmavém `k-popisek--svetly`), lísteček s páskou Kalamem (`KresbaListek.svelte`). Desky období (`--pc-plate`, `--pc-on-plate`) kresby nepoužívají.
- **Světlo a tma.** Tři tóny zůstaly, jen z jiného papíru: `k-svetlo` (ve dne skoro bílý list, v noci ztlumený), `k-stin` (šedý papír z tužky) a `k-tma` (černý papír). Drží pořadí světlý > střední > tmavý i v noci. Samotné „tytéž tokeny“ by v noci slily stěnu jeskyně se stíny: list je v noci tmavý. Proto jsou z těchto tónů věci, kde světlo a tma něco znamenají, a postavy, které musí být vidět i v noci.
- **Barva období na jednom nositeli:** oheň (jeskyně), slunce (cesta ven), šála (vítr), čára „dost“, plocha pokusu (čtverec), bod středu, život (zrcadlo), ty (třetí čára), tvoje volba (hodiny), maska. Ve dne je to papír období, v noci inkoust období (`k-pp`): papír období má na nočním papíře jen 2,1 až 2,8 : 1. Loď barvu období nemá, nic v ní ji nenese.
- **Třináct kreseb a graf:** zem, břeh, horizont a podlaha jsou natržené pruhy papíru (`natrzenyPruh` v `src/lib/kresby.ts`, natržený lísteček `natrzenyList`); vítr, paprsky, hlas, směr skoku, míra „chybí“, mřížka a obrys druhé lodi jsou tužkou; repliky „Je mi zima.“ a „Pomoc!“ stojí na lístečcích s páskou; odpovědi v Třetí čáře na lístečcích (číslice v Instrument Sans: jednička Kalamem vypadala jako lomítko). Postavy a věci jsou výstřižky bez obrysových čar. Graf křivek je list s páskou a plátnem z tečkovaného papíru. Šaty mají dál vlastní barvy, jen se stínem výstřižku.
- **Jeskyně** ukazuje všechno jako dřív: v pohledu vězňů stěna (natržený světlý list se ztmavlými kraji a září ohně v barvě období), průvod pěti stínů věcí, stín zídky s hlavami a tři vězni z černého papíru; z boku oheň v barvě období, paprsky ke stěně, nosiči, zídka, vězni v poutech a stěna se stíny na přímkách z ohně. Pohyb je týž (průvod, mihotání, plamen, nosič, stín věci).
- **Pohyb** jen `transform`, `opacity` a tah tužky. Nový je jen pohup papírového listí ve větru na místě (vítr nic neodnáší); proudy větru jsou tečky tužkou, po kterých přebíhá tah. Zastavené kresby kreslí obsah jako dřív (testy zastavení prošly).
- **Obraz ke kapitole (bod 9):** Prótagorás 01 Měřítko všech věcí má razítko pravítka (jeho atribut), Platón 02 Chlapec a čtverec novou ikonu `square` (čtverec a v něm čtverec na úhlopříčce; `docs/design/atributy-ikony.json`, `npm run ikony`). Ostatní kresby stojí v krocích cest, ne v kapitolách. Řádek v `docs/navraty.md` upravený.
- **Mini mapa** (`MiniMapa.astro`) je výstřižek jako Mapa a čas: moře šrafované tužkou, tři vodní linky (užší než v Mapě a čase, výřez je malý a ostrovů hodně), pevnina na lístkovém papíře s obrysem, dvojitý rámeček se stupnicí; místa jsou razítka v inkoustu období (dva kruhy a střed), ne tečky. Síť poledníků zmizela.
- **Mini osa** (`MiniOsa.astro`): pruhy současníků tužkou, život osoby stránky proužek papíru období na lístečku přiloženém přes osu; linky čárkovaně.
- **Dokumentace:** `docs/design.md` › Kresba s pohybem (Rám, Koláž, Světlo a tma) a Graf křivek; `docs/rozhodnuti.md`; kopie skillu `skills/atlas-komponenta/references/vzor-komponenty.md` (koláž místo tří tónů z desky). Skill v účtu přepíše krok O spolu s oddíly Papír a Pohyb.

### Přezdívky

Odškrtnuté v tabulce Po K1 (část 2): kresby, graf, mini mapa a mini osa nepoužívají žádnou přezdívku ani tintu období; `--sunk`, `--rule`, `--pohyb`, `--pohyb-kamera`, `--r-xs`, `--r-sm`, `--r-md`, `--pc-plate`, `--pc-on-plate` a `--map-*` mají 0 použití.

**Zbývá po K7b** (smaže O): `--paper` 4, `--surface` 3, `--pc` 8, `--pc-tint` 5, `--pc-soft` 2 a `--r-full` 2, vše jen v nepoužívaných `ui/Mince.astro` a `mapa/Mince.svelte`; `--muted` 1 ve třídě `.t-popisek` v `global.css` (používá ji celý web; O ji přepne na `--ink-3`, až zmizí tinty); přiřazení `.obdobi-N` s `--period-N-tint`, `-soft`, `-plate`, `-on-plate` v `global.css`; definice přezdívek v `tokens.css`.

### Testy a kontrola

- `npm run build` prošel, kontrola typů bez chyb.
- Vitest: nový `tests/data/kresby-kolaz.test.ts` (natržený pruh a lísteček: tvar, meze zubu, stejné semeno); v `tests/data/kontrast.test.ts` dvojice kreseb (světlý popisek na černém a šedém papíře, šedý od černého, hrana tužkou, nositel barvy období na tečkovaném papíře ve všech osmi obdobích).
- Playwright: kresby, cesty s kresbami, mini mapa, stránky osob, graf, Platón a podoby hodiny (123 testů). Spadl jen `hodina-podoby.spec.ts` (plátno široké kresby v promítání o 13 px nižší kvůli listu): v promítání list a páska odpadnou. Upravený test: `stranky-osob.spec.ts` (obraz ke kapitole i u Platóna a Prótagora; kapitola bez předmětu se ověřuje u Aristotela).
- `scripts/kontrola-fokus.mjs` na cestě 3 kroku 1, dílně bloků a profilu Sókrata, 390 a 1440 px: bez nálezu.
- **Klávesnicí** (jednorázový skript, smazaný) na 1440 × 900, 1440 × 640, 390 × 844 a 390 × 640 u cesty ven, přesýpacích hodin a větru: tabulátorem od začátku stránky, každé zastavení v kresbě vidět a nic přes něj neleží. První měření hlásilo zastavení pod oknem; byl to skript, který mačkal tabulátor rychleji, než stránka plynule dojela.
- **Zpomalený procesor (6×)** u přesýpacích hodin, kde písek padá: tažení posuvníku Spánek myší, 31 kroků, 14 změn (víc hodnot posuvník nemá), nejdelší mezera 100 ms.
- **Kontrast** výpočtem (jednorázový skript, smazaný): světlý popisek na černém papíře 14,74, na šedém 4,71 ve dne a 4,63 v noci, na papíru období 5,68 a víc; repliky a odpovědi na lístečku 10,14 a víc; šedý papír od černého 3,13 a 3,19; hrana tužkou na černém 4,24; nositel barvy období na papíře ve dne 5,28 a v noci (inkoust) přes 5. Výstřižek z listu na tečkovaném papíře má ve dne 1,09 : 1 a odlišuje ho jen stín výstřižku, jako na plátně (otázka 3).
- **Snímky** (`scripts/snimky-prvek.mjs`): všech třináct kreseb a dva grafy ve dne i v noci na 390 a 1440 px, kresby s víc pohledy v každém pohledu (`k7b-*`), a Doba a lidé Sókrata (`k7b-sokrates-doba-*`); celý profil Sókrata `scripts/snimky-listy.mjs` (`k7b-sokrates-*`).
- **Celé `npm test`** před commitem jednou: kontrola typů bez chyb, Vitest 1 419, Playwright 758 ze 758 (8,3 min).

### Nad čím jsem váhal a co by šlo jinak

- **Tytéž tokeny v noci.** Plátno má v noci postavy z listu (tmavé na tmavém papíře). Jeskyně, noc venku a zrcadlo by tak v noci ztratily to hlavní, rozdíl světla a tmy. Tóny světla a tmy jsou proto z tužky a listu tak, aby jejich pořadí v noci drželo; vypadá to jako bílé a černé výstřižky v nočním zápisníku. Jinak: držet se plátna doslova a v noci kresby jen ztmavit.
- **Inkoust období v noci místo papíru období** u nositele barvy. Ve dne je to totéž; v noci je maska, šála nebo oheň světlejší, jako jsou světlejší nadpisy a razítka.
- **Drážka pod plátnem, ne nad ním.** Přepínač pohledů stál dřív nad kresbou; teď je s ostatním ovládáním v jedné drážce pod ní, jak chce zadání. Student vidí nejdřív obraz, pak volí. Jinak: přepínač pohledů nad plátnem a jen ostatní ovládání v drážce.
- **Kresba se nenatáčí** (plátno ji má o 0,3° natočenou): text pod ní je delší než dvě věty a pravidlo střídmosti natáčení textu zakazuje; natočené jsou lístečky v kresbě.
- **Ozdoby navíc:** z plátna jsem vzal papírové listí ve větru, mráček ne (jedna ozdoba na obrazovku). Listí nese vítr, proto zůstalo.
- **Prótagorás 01 má pravítko**, ne vítr: kapitola se jmenuje Měřítko všech věcí a pravítko je jeho atribut. Ikona větru by byla nová a říkala by jen to, co kresba pod nadpisem.
- **Trasy v mini mapě** zadání chce nechat ručně kreslené, ale v kódu žádné nejsou: mini mapa má jen místa s rolemi a roky. Trasy (oblouky se šipkou mezi místy) byly jen na plátně D4. Otázka 5.
- **Vodní linky v mini mapě** jsou o polovinu užší než v Mapě a čase; v plné šíři se kolem drobných ostrovů slévaly do šedé skvrny.

## Co rozhodnout po K7b

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-k7b/`). Prázdná odpověď znamená souhlas s doporučením.

1. **Kresby jako koláž** (snímky `k7b-*-1440-light`, `k7b-*-390-dark`): list s páskou, plátno z tečkovaného papíru, ovládání ve vtlačené drážce pod plátnem, výstřižky bez obrysů, tužka, lístečky. Doporučuji ano.
   Odpověď:

2. **Jeskyně** (snímky `k7b-jeskyne-vezni-*`, `k7b-jeskyne-bok-*`, `k7b-jeskyne-ven-*`): ukazuje všechno, co dřív? Doporučuji ano.
   Odpověď:

3. **Světlo a tma v noci:** bílé a černé výstřižky v nočním zápisníku (jeskyně, zrcadlo, hodiny, lidé na břehu), nositel barvy období v noci světlejší. Jinak: v noci držet plátno doslova (postavy z tmavého listu, viditelné jen stínem). Doporučuji, jak je.
   Odpověď:

4. **Obraz ke kapitole:** Prótagorás 01 pravítko a Platón 02 čtverec na úhlopříčce (snímky profilu nebo stránky v náhledu). Doporučuji ano.
   Odpověď:

5. **Trasy v mini mapě** (oblouky se šipkou a rokem mezi místy, jako na plátně D4) v kódu nejsou. Postavit je? Doporučuji ne teď: patří k Životu na mapě a výpravám v `herna-v1`; zapíšu je do `docs/navraty.md`. Napiš „ano“, jestli je chceš v tomto kroku.
   Odpověď:

6. **Chceš něco změnit na snímcích po K7b?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání P: pojmy

Podklady Opus 5.5 · high se skillem `atlas-overeni`, komponenta Opus 5.5 · high se skillem `atlas-komponenta`, texty se skillem `atlas-psani`. Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po K7b. Když se krok nevejde do jednoho sezení, udělej nejdřív výběr pojmů a podklady (kroky 1 a 2), zapiš stav a zbytek nech na další sezení.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok P větve design-v2, pojmy. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíl Obsah větve › Pojmy (krok P), Co rozhodnout po K7b s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. Z částí plánu jen Po D2 (Stavy prvků: řádek Pojem; Písma: ruka), Po D3 (Tokeny pohybu: lístek pojmu; Pravidla pohybu) a Po auditu (Pravidlo střídmosti, Vizuální zlepšení bod 6). docs/design.md nečti celý, jen oddíly, které zadání jmenuje. Načti skilly atlas-overeni, atlas-komponenta a atlas-psani. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/ProfilSokrates.dc.html jen styly a značky pojmu („Delfy“: poznámka na okraji a lístek), ne pult náhledu a skript. Když odpovědi po K7b něco mění na kresbách, mini mapě nebo mini ose, oprav to nejdřív.

1. Výběr pojmů: výpisem z textů antiky (src/content: osobnosti, cesty, otázky, období, směry, pokusy, úvody, náboženství) najdi slova, která student potká a která potřebují vysvětlení (ataraxia, apatheia, ctnost, logos, idea, elenchos, eudaimonia, akrasia a další); asi 25. U každého zapiš, kde všude stojí (první výskyt na stránce). Jména lidí a míst pojmy nejsou.

2. Podklady (skill atlas-overeni) do docs/podklady/pojmy-antika.md: u každého pojmu původ slova, vysvětlení na dvě věty, příklad ze života studenta, kde se v atlasu objevuje, prameny (SEP, IEP nebo slovník s adresou). Vysvětlení drží rozdíly, které dělá pramen; jeden pojem u různých filozofů znamená různé věci (ctnost u Sókrata, Aristotela a stoiků): pak řekni, u koho co.

3. Data: kolekce src/content/pojmy/ se schématem (pojem, původ, vysvětlení, příklad, výskyty, prameny, období), kontrola dat ve Vitestu. Texty pojmů piš se skillem atlas-psani: dvě věty, které se dají pochopit bez dalšího čtení, žádná slovníková šablona.

4. Komponenta Pojem (skill atlas-komponenta) podle Po D2 a plátna: vlnité podtržení tužkou; na notebooku vysvětlení rukou (Kalam) na okraji stránky vedle odstavce (bod 6: okraj žije), na telefonu lístek po klepnutí pod odstavcem, z klávesnice fokusem (Enter otevře, Esc zavře a vrátí fokus); „Celý pojem“ vede na stránku pojmu. Lístek se rozkládá (--d-listek, --k-papir), při omezeném pohybu je tam hned. Poznámky na okraji se nesmějí překrývat: dvě na jedné výšce posune skript pod sebe (čistá funkce v src/lib/ s testem), co se nevejde, zůstane jen lístek po klepnutí. Čtečka slyší slovo a vysvětlení jako popis, ne jako odkaz.

5. Stránka /pojem/<id>/ (šablona stránek z dat, docs/design.md › Stránky období, směru, pokusu, úvodu a tradice): pojem, původ, vysvětlení, příklad, kde se v atlasu objevuje (odkazy), prameny; seznam pojmů /pojmy/ a odkaz na něj z Otázek nebo z patičky. Stránky přidej do tests/e2e/nove-stranky.spec.ts a do katalogu hodin (ověř scripts/hodiny-katalog.mjs proti dist/).

6. Vyznačení v textech: ručně v MDX, jen první výskyt na stránce, nejvýš jeden pojem v odstavci; hotové věty se nemění (jen obalí slovo). Najdi věty v tests/ (grep), které vyznačení může rozbít (toContainText snese, textContent.includes ne).

7. Hledání: Pagefind neskloňuje, takže pojmy a jména dostanou české tvary pro hledání (meta nebo skrytý text pro index, ne pro čtečku): ataraxie, ataraxii; Sókrata, Sókratovi. Ověř, že „Sókrata“ najde profil a „ctnosti“ pojem ctnost.

8. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro pojem, stránky s pojmy, nove-stranky, hledani, prohlidka a ty, které spadnou), node scripts/kontrola-fokus.mjs na profilu Sókrata, kroku cesty s pojmem a stránce pojmu, klávesnicí na dvou výškách okna, axe ve dne i v noci, kontrast nových dvojic výpočtem (trvalé do tests/data/kontrast.test.ts), node scripts/snimky-listy.mjs na profilu Sókrata a jedné stránce pojmu ve dne i v noci na 390 a 1440 px a node scripts/snimky-prvek.mjs na lístku pojmu otevřeném na telefonu. Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

9. Do plánu větve zapiš oddíl Po P: co vzniklo, které pojmy a kde, nad čím jsi váhal, otázky Co rozhodnout po P a zadání kroku R v plném znění (podle tabulky kroků). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md a části plánu, které se změnily.

10. Pak se zastav a napiš mi, na které snímky se mám podívat.
```
