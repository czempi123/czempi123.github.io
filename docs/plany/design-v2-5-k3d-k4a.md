# Větev design-v2, část: stránky osob po auditu, rám aktivity a první bloky

Část plánu větve `docs/plany/design-v2.md` (oddíl Části plánu). Plán se 15. 11. 2026 rozdělil, aby každý soubor pro Projekt Claude měl pod 35 kB; text oddílů je beze změny.

## Po K3 dodatku (13. 11. 2026)

Odpovědi po D5 byly prázdné v repozitáři i v Projektu Claude, takže platí všechna doporučení: čtenářský sloupec je **čistý list** (K4a ho na krocích cest ještě vyfotí ve třech variantách), rám aktivity se čtyřmi značkami, tři pera s výchozí modrou, zpětná vazba tiskem, deset předmětů, červená tužka, strojopis jen naznačený, lístek postupu, a hotová zadání D2 až K3 a D5 se zodpovězenými otázkami před D2 až po K2 jsou v `docs/archiv/plany/design-v2-d1-k3.md` (samostatný commit). Plán měl po přesunu 127 kB místo 161 kB.

### Přechod listu a let fotky (otázka 8 po K3)

**Fungují.** Ověřeno v opravdovém, viditelném okně Chromu 153 na Macu nad `npm run dev` (Playwright s `headless: false`, skript `scripts/overeni-prechodu.mjs`, zůstává pro revizi R): Sókratés → karta Platóna v Kam dál: přechod typu `dalsi`, list se otočí (`otaci-se`), příchod začne po listu a deska má skupinu `::view-transition-group(deska-osoby)`, fotka tedy z karty přiletí. Lidé → Sókratés totéž. Zpět ze Sókrata na Lidi i z Platóna na Sókrata: typ `zpet`, list se přiklopí, příchod žádný. Odpadání přechodu v K3 byla vlastnost headless Chromia, ne webu.

- **Vestavěný prohlížeč** to ověřit neuměl: když je panel v aplikaci skrytý, stránka nekreslí snímky (`requestAnimationFrame` stojí), `pagereveal` nepřijde a přechod po 4 s odpadne. **Claude in Chrome** nebyl připojený.
- Drobná oprava: po Zpět zůstávala na `<html>` třída `prichod--po-listu` (bez příchodu nic nedělala); teď ji `pagereveal` dá jen spolu s `prichod` (`Zakladni.astro`).

### Co se na stránkách osob změnilo

- **Čistý list (bod 1).** `Kapitola.astro` vykreslí svůj obsah do řetězce a `useky()` ze `src/lib/listy.ts` ho rozdělí na souvislý text a aktivity (čtou se jen prvky nejvyšší úrovně; odstavce, seznamy a citáty jsou text, bloky, ostrovy a kresby aktivita). Číslo, nadpis a první text kapitoly leží na listu `.cisty-list` (global.css: `--list`, stín `--lezi`, okraje 38/40/26 px, nenatáčí se) s malou páskou vlevo nahoře; za aktivitou pokračuje list **bez pásky** (páska patří kapitole, na obrazovce je nejvýš jedna). Aktivity zůstávají na tečkách. Na notebooku má řádek asi 70 znaků, na telefonu jde list skoro po okraj obrazovky (8 px teček kolem) a řádek má asi 40 znaků. **Medailonek:** kdo a proč na listu s páskou v hlavičce (na telefonu bez přesahu k okraji, jinak stránka přetékala o 5 px). **Úvod profilu** zůstal na tečkách jako perex k hlavičce (otázka 2).
- **Vlepené věci (bod 7).** `ListyProfilu.astro` obalí obsah profilu a `uchytCitaty()` dá citátům podle pořadí na stránce třídu `citat--sponka`, `--spendlik`, `--roh` (zastrčený roh: dvě kapsičky v inkoustu období) a `--okraj` (rukou Kalamem: na notebooku od 1240 px v okraji vedle listu, užší okno v textu s linkou tužkou), pak znovu. Rukou jen citát do 110 znaků a nikdy velký citát pod úvodem; ten okraj přeskočí a řada jde dál, ať se dva stejné nesejdou. **Páska patří listům**: citát na stránce osoby vlastní pásku nemá, takže je na obrazovce nejvýš jedna páska (u Sókrata pod úvodem sponka). Vnořený citát (myšlenka, Zkus to žít) zůstává lepicím lístkem; citáty v cestách a na otázkách mají pásku dál (K4a, K6).
- **Razítko člověka (bod 8).** Kdo nemá atribut a má rodiště (role `narozeni`), má uprostřed město, pod ním rok narození a letopočet („asi 450 / př. n. l.“; `stredRazitka()` v `src/lib/razitko.ts`, „asi“, „před“ a „po“ zůstávají). Týká se 13 lidí (Anaximandros, Anaximenés, Xenofanés, Empedoklés, Anaxagorás, Gorgiás, Aspasie, Konfucius, Alkibiadés, Xenokratés, Kleanthés, Musonius Rufus, Karneadés); šest dalších bez atributu i rodiště má vlnovky dál. Pod 48 px vlnovky (text by nešel přečíst). Dlouhé město se stáhne do středu.
- **Obraz ke kapitole (bod 9).** `Kapitola` má pole `predmet` (id ze spritu `atributy.svg`, výchozí nic): vybledlé razítko (dva kruhy a předmět, inkoust období, 0,17 ve dne a 0,24 v noci, 128 px, na telefonu 84 px) vpravo u nadpisu, pod textem. Vzory: Sókratés 01 Věštba z Delf (trojnožka), Diogenés 02 Lucerna (lucerna), Epikúros 01 Zahrada (výhonek). Zbytek je v `docs/navraty.md` › Stránky osob. Text kapitol se neměnil.
- **Záložky otázek na telefonu (do 899 px) až za úvodem** (a velkým citátem pod ním), před první kapitolou. Přesouvá je skript, který `ListyProfilu` vloží před první kapitolu; běží při čtení stránky a první vykreslení na něj čeká (`<link rel="expect" href="#otazky-za-uvodem" blocking="render">`, nové pole `ocekavat` v `Zakladni.astro`), takže nic nepřeskočí před očima. Při rozšíření okna se vrátí do hlavičky. Společný profil (Kratés a Hipparchia) má záložku vedle cesty a nemění se.

### Testy a kontrola

- `npm run build` prošel. Vitest celý (1 195 testů; nově `tests/data/listy.test.ts`: uzly, úseky, uchycení citátů; v `razitko.test.ts` střed razítka pro každého člověka v datech; v `kontrast.test.ts` kapsička rohu 3 : 1).
- Playwright `stranky-osob` (nově čistý list, uchycení citátů, obraz ke kapitole, město v razítku, záložky za úvodem i při `DOMContentLoaded` a návrat na notebooku), `prohlidka`, `obsah`, `platon`, `seneca`, `aristoteles`, `celek7-profily`, `krates-hipparchia`, `medailonky`, `doba-odkazy`, `otazka`, `ram` a `odkazy`. Upravený test: `otazka.spec.ts` (otázky na telefonu nově za úvodem, ne před lištou Obsah).
- `scripts/kontrola-fokus.mjs` na Sókratovi a Thalétovi na 390 a 1440 px bez nálezu.
- **Kontrast** (jednorázový skript, smazaný): text na okraji (`--ruka` na papíru i listu) 7,85 ve dne a 7,99 v noci, podpis 5,12 a 6,57; střed razítka (inkoust období 0,96 na listu) nejméně 5,26 a 5,47; sponka (`--tuzka` na listu) 3,63 a 4,02; kapsička rohu nejméně 3,62 ve dne (v noci byla v papíru období 1,55, proto je v inkoustu období). Obraz ke kapitole je ozdoba skrytá čtečce (1,27 a 1,53).
- **Snímky** v `Claude outputs/snimky/design-v2-k3d/`: `sokrates-`, `seneca-` a `thales-` na 390 a 1440 px ve dne i v noci.
- **Celé `npm test`** (kontrola typů, Vitest 1 211 testů, Playwright 731): 726 prošlo, 5 spadlo. Tři byly promítání hodiny na 1280 × 720: citát rukou v okraji vedle listu přetekl při písmu o polovinu větším o 190 px; při promítání teď zůstává v textu a v okraji nikdy není širší než místo vedle listu. Čtvrtý byl přechod Otázky → Lidé v `ram.spec.ts` (headless Chromium přechod pod zátěží vynechá, viz Po K3) a pátý průhlednost natrženého lístku těsně před koncem přechodu (0,98); test teď na konec počká. Po opravě `hodina-student`, `ram` a `stranky-osob` prošly (45 testů); celé `npm test` jsem znovu nepouštěl.

### Nad čím jsem váhal a co by šlo jinak

- **Páska u citátu.** Zadání jmenuje pásku mezi způsoby uchycení citátu a zároveň nejvýš jednu pásku na obrazovku. Listy kapitol mají každý pásku a citáty leží na nich nebo těsně u nich, takže citát pásku nedostává nikdy; střídají se čtyři ostatní způsoby. Jinak: list bez pásky (přilepený) a páska u každého čtvrtého citátu (otázka 1).
- **Pokračovací list bez pásky.** Kapitola se dvěma bloky má tři listy; tři pásky by byly na obrazovce i dvě. Jinak: páska na každém listu, jak říká zadání doslova.
- **Úvod na tečkách.** Úvod je perex k hlavičce a s listem by se na telefonu první odstavec posunul ještě níž; bod 1 mluví o kapitolách (otázka 2).
- **První odstavec na telefonu není na první obrazovce ani bez záložek.** Na 390 × 844 začíná úvod u většiny profilů 900 až 1 050 px od horního okraje (Sókratés 950, Seneca 1 050, Prótagorás 810); první obrazovku zaplní razítko, jméno, cesty, deska, „Proč kalich?“ a popisek obrazu. Test proto hlídá, že mezi deskou a prvním odstavcem je jen lišta Obsah, a ne že je odstavec nahoře (otázka 4).
- **Rozdělení kapitoly v řetězci HTML.** Nemusel jsem měnit MDX ani bloky; čte se jen nejvyšší úroveň, dovnitř bloků a ostrovů dělení nesahá a skripty i komentáře přeskočí. Kdyby nový druh obsahu v kapitole měl ležet na listu (třeba tabulka), stačí ho přidat do `TEXT` v `src/lib/listy.ts`.
- **Bloky v profilu vypadají vedle listů zatím jako bílé karty** (nový rám se značkami přijde v K4a); na snímcích proto list a blok ještě nejsou tak odlišné, jak budou.
- **Okraj od 1240 px.** Pod tím by se poznámka (220 px) do okraje vedle sloupce 680 px nevešla; v užším okně je citát rukou v textu.
- **Medailonek má na obrazovce tři pásky** (list s kdo a proč a deska se dvěma); otázka 5.
- `docs/design.md` jsem podle zadání nečetl ani neměnil; API `Kapitola` (`predmet`), `.cisty-list`, uchycení citátů a střed razítka do něj zapíše krok O.

## Co rozhodnout po K3 dodatku

Prázdná odpověď znamená souhlas s doporučením.

1. **Páska patří listům, citáty střídají sponku, špendlík, zastrčený roh a citát rukou na okraji** (páska u citátu se na stránkách osob nevyskytne)? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4a 13. 11. 2026)

2. **Úvod profilu na tečkách** (perex k hlavičce), na čistém listu jen kapitoly? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4a 13. 11. 2026)

3. **Pokračovací list kapitoly za blokem bez pásky?** Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4a 13. 11. 2026)

4. **První odstavec na telefonu:** začíná pod první obrazovkou (844 px), i když záložky už jsou za úvodem. (a) nechat, (b) na telefonu „Proč kalich?“ a popisek obrazu až pod první odstavec úvodu, (c) nižší deska (2 : 1 místo 16 : 10). Doporučuji (b); udělá to K4a jako první věc.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4a 13. 11. 2026)

5. **Medailonek: list s kdo a proč bez pásky** (vedle desky se dvěma páskami), nebo s páskou jako teď? Doporučuji bez pásky; udělá to K4a.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4a 13. 11. 2026)

6. **Obraz ke kapitole**: vybledlé razítko předmětu u nadpisu, síla 0,17 ve dne a 0,24 v noci, vzory u Sókrata, Diogena a Epikúra? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4a 13. 11. 2026)

7. **Razítko s městem a rokem** uprostřed (na 72 px asi 5 až 7 px písma, jako text po obvodu)? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4a 13. 11. 2026)

8. **Chceš něco změnit na snímcích po K3 dodatku?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4a 13. 11. 2026)

## Zadání K4a: společný rám aktivity a první bloky

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po D5 a po K3 dodatku (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K4a větve design-v2, společný rám aktivity a první bloky v novém vzhledu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co se proti design systému změnilo: tinty období nahradil lístek s páskou), Po K1 (třídy papíru, vrstvy stínu, přezdívky), Po K3 (Vnořený papír s páskou), Po auditu (body 1, 3 a 11 z Vizuálních zlepšení, Pravidlo střídmosti), Po D5, Po K3 dodatku a odpovědi po D5 a po K3 dodatku, a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen nadpisy a v oddílu Bloky popis vzhledu a stavů Volby a Odkryj. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti ze stránky Herní prvky (D5) jen styly a tělo společného rámu aktivity, Volby a Odkryj, ze stránky Zlepšení vzhledu jen bod 1 a 3, z project/DesignSystem.dc.html v <helmet> jen části o tlačítkách, možnostech, poli na psaní a lístku zpětné vazby, které nejsou v tokens.css a global.css, a z project/Pohyb.dc.html jen styly a skript ukázek Volba (kroužek tužkou, lístek) a Odkryj. Když odpovědi po D5 nebo po K3 dodatku něco mění, oprav nejdřív to.

1. Společný rám aktivity jako jedna komponenta pro všechny dnešní i budoucí bloky a hry (Astro i Svelte verze, jak to bloky potřebují): hlava (nadtitulek rodiny aktivit v inkoustu období, název), zadání, plocha, zpětná vazba jako lístek s páskou (.listek-paska, při vložení .rozlozit; uvnitř jiného přilepeného papíru lepicí lístek v barvě období podle Po K3), „Začít znovu“ všude stejně. Aktivita leží na tečkovaném papíře mezi listy, souvislý text na čistém listu (bod 1, podle varianty čtenářského sloupce zvolené po D5; na stránkách osob už hotové z K3 dodatku: .cisty-list v global.css a useky() ze src/lib/listy.ts, v krocích cest použij totéž). Na telefonu přes celou šířku, ovládání v dosahu palce (bod 11). Nová hra pak znamená jen vnitřek plochy; zapiš do docs/design.md › Bloky krátce, jak rám použít.

2. Tlačítka a pole: hlavní tlačítko na plném inkoustu (.vystouple .vystouple--ink), vedlejší a tiché podle design systému (src/components/ui/Tlacitko.astro i tlačítka v ostrovech, blok__tl), zakázané čárkované tužkou; pole na psaní v Kalamu na linkách a co student napíše nebo zvolí, je jeho perem v barvě zvolené po D5 (bod 3; volba pera jednou, uložená v localStorage s ostatním postupem). Poznámka po K3: pole Odkryj v kapitole 01 Sókrata končí po tabulátoru na 1440 × 700 o 4 px pod oknem; oprav.

3. Volba s důvodem (možnosti jako lístky podle D5, zvolená vtlačená, kroužek tužkou kolem písmene, --d-tah) a Odkryj (odklopení přeloženého papíru, --d-odkryti) v novém rámu. Pohyb podle Po D3; při omezeném pohybu je každý stav hned na konci (kroužek celý, lístek rozložený).

4. Tři snímky čtenářského sloupce (tečky, ztlumené tečky, čistý list) na kapitole Sókrata a na kroku cesty 1/2, na 390 a 1440 px ve dne i v noci, aby šlo rozhodnout na skutečném textu (kontrolní bod). Nové bloky přepiš na nová jména tokenů (Po K1, tabulka přezdívek) a odškrtni je v tabulce.

5. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro bloky, pruchod, cesta, cesta2 až cesta8, cesta33, cesta34, stranky-osob, prohlidka, hodina-podoby), node scripts/kontrola-fokus.mjs na kroku cesty 1/2, 6/3 a na profilu Sókrata, klávesnicí na dvou výškách okna, node scripts/snimky-cesta.mjs na cestě 1 (s odpověďmi i bez) a node scripts/snimky-prvek.mjs na Volbě a Odkryj na 390 a 1440 px ve dne i v noci. Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

6. Do plánu větve zapiš oddíl Po K4a: rám aktivity a jak ho použít, co se na Volbě a Odkryj změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K4a (mezi nimi čtenářský sloupec podle snímků) a uprav zadání K4b podle toho, co rám umí. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

7. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

## Po K4a (13. 11. 2026)

Odpovědi po K3 dodatku byly prázdné v repozitáři i v Projektu Claude, takže platí všechna doporučení. Dvě z nich udělal K4a jako první věc: **na telefonu „Proč kalich?“ a popisek obrazu až za prvním odstavcem úvodu** (odpověď 4 b: skript v `ListyProfilu.astro`, který už přesouval záložky otázek, přesune obsah popisku desky do `.deska-za-uvodem` a na notebooku ho vrátí) a **list s kdo a proč v medailonku bez pásky** (odpověď 5). Snímky jsou v `Claude outputs/snimky/design-v2-k4a/`.

### Rám aktivity a jak ho použít

- **Jeden rám pro všechny bloky a hry.** `src/components/ostrovy/RamAktivity.svelte` (Svelte) a `src/components/bloky/RamAktivity.astro` (bez stavu). Kořen má dál třídu `.blok`, takže ho znají testy, průchod cest, promítání hodiny i katalog. Vzhled je v `global.css` › Rám aktivity a platí i pro bloky, které K4b ještě nepřepsal: všechny už leží v rámu na tečkách a mají nová tlačítka a pole, zpětnou vazbu mají zatím v tintě (`.blok__zpetna`).
- **Rám je pole na tečkách se čtyřmi rohovými značkami tužkou** (D5), ne list. Hlava: rodina aktivit (dnešní nadtitulek z dat, např. „Tvůj tah“, „Než budeš číst dál“) s tečkou v inkoustu období, nepovinný název (pro hry z herny), mince lidí. Zadání: scéna a otázka. Plocha: předmět. Zpětná vazba: lístek s páskou (`.listek-paska`, tiskem 19 px `--ink-2`), který se po činu studenta rozloží (`.rozlozit`); uvnitř jiného přilepeného papíru je to lepicí lístek v barvě období bez pásky (Po K3). Pata: Začít znovu vlevo, hlavní čin vpravo.
- **Jak ho použít** (zapsáno i v `docs/design.md` › Bloky › Rám aktivity): obsah zadání a plochy do `children` s `data-cast` pro podoby hodiny, obsah lístku do snippetu `vazba` (bez něj lístek není), vlastní čin do `hlavni`, reset do `znovu`, `cerstve` po činu studenta (lístek se rozloží a jednou se nabídne pero), `bind:vazbaPrvek` pro fokus. Nová hra tak znamená jen vnitřek plochy.
- **Telefon (bod 11):** rám od okraje k okraji, rohové značky u hran obrazovky. Pata s vlastním činem bloku (Tohle je můj tah, Porovnat se Sókratem) drží u spodní hrany nad lištou (`position: sticky`), v jednom řádku se Začít znovu; pata s Kam dál nebo jen se Začít znovu nedrží (další krok nabízí lišta cesty). Skript fokusu v `Zakladni.astro` drží prvek s fokusem nad patou a nově i nad spodní hranou okna tam, kde lišta není.
- **Čistý list v krocích cest (bod 1):** `ListyKroku.astro` obalí obsah kroku (`listyKroku()` v `src/lib/listy.ts`): text v `<div class="ctenarsky">` i text na nejvyšší úrovni leží na čistém listu, bloky a kresby mezi listy na tečkách, páska jen na prvním listu kroku. Citáty na listu se uchytí jako na stránkách osob (sponka, špendlík, roh, okraj), takže citát v cestě vlastní pásku už nemá. `h2` (mezititulky kroků) patří k textu.

### Tlačítka, pole a studentova ruka

- **Tlačítka podle design systému:** `.blok__tl--hlavni` na plném inkoustu a `--vedlejsi` vystouplé mají vrstvy stínu (`global.css` › Vrstvy stínu, stejné jako `.vystouple`), `--tiche` je podtržené tužkou, zakázané čárkované tužkou. `Tlacitko.astro` dává tytéž třídy, takže se tlačítko chová všude stejně.
- **Pole na psaní** píše Kalamem 19 px na linkách po 28 px (s měřítkem promítání) a **perem studenta** (`--pero`); spodní linka tužkou. Co student zvolil nebo napsal a ukazuje se po tahu, má třídu `.blok__ruka`.
- **Pero (bod 3):** tokeny `--pero-modra`, `--pero-fialova`, `--pero-sepiova` a `--cervena-tuzka` (den, noc, tisk), `--pero` podle `data-pero` na `<html>`. Volba je v deníku (nepovinné pole `pero`, součást exportu; při spojení se souborem vyhraje prohlížeč), na `<html>` ji před vykreslením nastaví hlavička (`skriptPera` v `src/lib/pero.ts`). Nabídne se **jednou, při první odpovědi** pod lístkem zpětné vazby („Tohle je tvoje pero. Chceš jiné?“; kdo nevolí, má modré a nabídka už nepřijde) a pořád je v Mém deníku (`VolbaPera.svelte`, nad zálohou deníku; deník jako zápisník přinese K6).
- **Oprava po K3:** pole Odkryj v kapitole 01 Sókrata na 1440 × 700 po tabulátoru už pod oknem nekončí; na 1440 × 900 končilo 35 px pod oknem (Chromium posune textarea jen tak, aby byl vidět kurzor). Opraveno obecně ve skriptu fokusu (hlídá i spodní hranu okna).

### Co se na Volbě a Odkryj změnilo

- **Volba:** možnosti jsou lístky s pahýlem (perforace čárkovaně, dva výseky v barvě papíru), vystouplé; zvolený je vtlačený (`.vystouple--zvoleno`), v pahýlu se vyštípne dírka (`--d-listek`, `--k-dopad`) a pero studenta zakroužkuje písmeno (`--d-tah`, se zpožděním `--d-stisk`). Kroužek stojí na středu písmene (autor 13. 11. po prvních snímcích: nebyl vycentrovaný, mřížka písmene ho posunula o 7 px doleva; teď ho drží střed a hlídá to `ram-aktivity.spec.ts`). Dva sloupce jen v rámu širším než 760 px (krok cesty na notebooku), v profilu pod sebou. Zpětná vazba „Tvůj tah: …“ a „Co udělal …“ na lístku s páskou; „Co kdybys zvolil jinak?“ pod lístkem; v patě Začít znovu a Kam dál. Pohyb jen po činu studenta: po obnovení stránky jsou dírka i kroužek rovnou celé a lístek leží.
- **Odkryj:** pole perem; na místě srovnání leží **přeložený papír** s poznámkou rukou „Nejdřív napiš svoje, pak odklop.“, po kliknutí se odklopí od horní hrany (`rotateX`, `--d-odkryti`) a pod ním je srovnání na lístku s páskou. Srovnání se vykreslí až odkrytím (dřív není vidět ani pro čtečku). „Upravit odpověď“ stojí pod polem; **Odkryj má nově Začít znovu** (smaže odpověď, stav i zápis), jak chce skill pro všechny bloky.
- **Omezený pohyb:** kroužek celý, dírka vyštípnutá, lístek rozložený, přeložený papír hned pryč.

### Přezdívky

Odškrtnuté v tabulce Po K1: `--paper`, `--surface`, `--sunk`, `--rule`, `--muted`, `--pc`/`--pc-tint` (Volba a Odkryj), `--pohyb-rychle` a `--r-*` pro rám aktivity, Volbu, Odkryj, tlačítka bloků a `Tlacitko.astro`. Zbývá (počet `var(--…)` v `src`): `--paper` 32, `--surface` 71, `--sunk` 17, `--rule` 103, `--muted` 79, `--pc` 128, `--pc-tint` 39, `--pc-soft` 12, `--pohyb-rychle` 18, `--pohyb` 22, `--pohyb-kamera` 21, `--r-sm` 37, `--r-md` 32, `--r-full` 28, `--r-xs` 18. `--pc-tint` v rámu drží už jen `.blok__zpetna` pro bloky K4b.

### Testy a kontrola

- `npm run build` prošel. Vitest celý (nově `tests/data/pero.test.ts`; `listy.test.ts` s obsahem kroku na listech; `kontrast.test.ts` s pery na všech plochách a červenou tužkou).
- Playwright `bloky`, `pruchod`, `cesta`, `cesta2` až `cesta8`, `cesta33`, `cesta34`, `stranky-osob`, `prohlidka`, `hodina-podoby`, `medailonky` a nový `ram-aktivity.spec.ts` (rám, lístky, kroužek perem, pero jednou a po obnovení, telefon s patou nad lištou, Odkryj s přeloženým papírem a Začít znovu, krok cesty na listech). Upravené testy: v cestách odstavce kroku na listu (`:scope > .cisty-list > p`), sousedé citátu v cestě 2, medailonek bez pásky, telefonní profil s popiskem desky za úvodem; popisek obrazu a atribut desky se na telefonu hledají za úvodem (`.obraz-popisek`, `.osobnost .proc` v `aristoteles`, `celek7-profily`, `platon`, `seneca`, `prohlidka`).
- `scripts/kontrola-fokus.mjs` na kroku cesty 1/2, 6/3 a profilu Sókrata: po opravách bez nálezu kromě jednoho (viz níž, otázka 6). Klávesnicí na 1440 × 700 a 1440 × 900 a na 390 × 844 a 390 × 640: pole i tlačítko Odkryj nad spodní hranou okna nebo lišty.
- **Kontrast** (jednorázový skript, smazaný), nejmenší hodnoty den / noc: pero modré 6,89 / 6,19, fialové 7,53 / 6,14, sépiové 6,66 / 6,19 (papír, list, plocha, lístek); rodina aktivit `--p-N` na papíře 5,10 / 6,70; zpětná vazba `--ink-2` na lístku 9,80 / 7,68, na lepicím lístku období 7,57 / 6,91; přeložený papír `--ruka` na listu 8,81 / 7,99; písmeno možnosti 8,52 / 8,31; rohové značky a podtržení tužkou 3,24 / 4,65; zakázané 5,12 / 6,57; hlavní tlačítko 14,84 / 14,09; červená tužka na listu 6,26 / 6,12.
- **Celé `npm test`** (kontrola typů, Vitest, Playwright 735 testů) prošlo. Při prvním běhu spadlo deset testů: písmo zadání a zpětné vazby při promítání mělo 27 px místo nejméně 28 (teď 19 px × měřítko), tiché tlačítko bylo nižší než ostatní (teď 48 px), tlačítko pod ukazatelem se po najetí zvedne o 1 px (test kresby „Kdy je dost“ měří stavbu s ukazatelem jinde) a test klepnutí myší v `fokus-lista` klepal pod okno (pole si teď nejdřív posune nad lištu); hledání v `prohlidka` napoprvé nedoběhlo, samostatně prošlo.
- **Snímky** v `Claude outputs/snimky/design-v2-k4a/`: `sloupec-sokrates-*` a `sloupec-cesta1-krok5-*` (tři varianty čtenářského sloupce vedle sebe, 390 a 1440 px, den a noc; skript `scripts/snimky-sloupec.mjs`), `volba-*`, `volba-po-tahu-*`, `odkryj-*`, `odkryj-po-*` (390 a 1440 px, den a noc) a `cesta1/` (cesta 1 na 390 px s odpověďmi i bez, na 1440 px v noci s odpověďmi).

### Nad čím jsem váhal a co by šlo jinak

- **Čtenářský sloupec na kroku 1/2.** Krok 2 cesty 1 má jen Volbu, žádný text, takže tam tři varianty vypadají stejně. Vyfotil jsem krok 5 cesty 1 (text, citát a Spor) a kapitolu 01 Sókrata. Varianty přepíná `data-sloupec` na `<html>` (jen pro snímky; po rozhodnutí je krok O smaže).
- **Název v hlavě rámu.** D5 má nad zadáním krátký název („Věštba z Delf“); bloky v datech ho nemají a hotový obsah se nemění. Rodina aktivit je proto dnešní nadtitulek a otázka zůstává nadpisem rámu; název umí rám jako nepovinný (hry z herny).
- **Začít znovu ve Volbě až po tahu.** D5 ukazuje Začít znovu v patě pořád; před tahem by ale stálo v pořadí tabulátoru před „Tohle je můj tah“ a Enter z pole by ho zmáčkl místo tahu. Před tahem není co mazat.
- **Pata na telefonu drží jen s vlastním činem bloku.** Po tahu je v patě Kam dál a tentýž další krok je v liště cesty; dvě lišty nad sebou by braly třetinu obrazovky.
- **Pero se nabídne pod lístkem, až po první odpovědi**, ne před ní: před první odpovědí by volba barvy předběhla otázku. Kdo nevolí, má modré a nabídka už nepřijde.
- **Odkryj dostal Začít znovu.** Dřív ho neměl; skill `atlas-komponenta` ho chce ve všech blocích.
- **Přeložený papír má poznámku rukou** „Nejdřív napiš svoje, pak odklop.“ (nový krátký text v rozhraní). Jinak: papír bez textu.
- **První odstavec profilu na telefonu** je po přesunu „Proč kalich?“ o 125 px výš, ale pořád ne na první obrazovce: na 390 × 844 začíná u Sókrata v 825 px (lišta 772 px), u Prótagory v 773 px, u Seneky v 907 px. Mezi deskou a odstavcem stojí lišta Obsah (76 px). Kontrola fokusu teď hlásí, že tlačítko Obsah při načtení stránky leží pod spodní lištou telefonu (otázka 6).
- **Spor, Roztřiď a ostatní bloky** už stojí v novém rámu, ale jejich vnitřek je starý (karty s linkou, tinta); na snímcích cesty 1 je to vidět u Sporu. Přepíše je K4b.

## Co rozhodnout po K4a

Prázdná odpověď znamená souhlas s doporučením.

1. **Čtenářský sloupec** (snímky `sloupec-sokrates-*` a `sloupec-cesta1-krok5-*`): tečky, ztlumené tečky, nebo čistý list? Doporučuji čistý list (je hotový na stránkách osob i v cestách); po rozhodnutí O smaže přepínač variant.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4b 13. 11. 2026)

2. **Rám aktivity jako pole se čtyřmi značkami, lístky Volby, lístek zpětné vazby s páskou a pata Začít znovu vlevo, hlavní čin vpravo** (snímky `volba-*`, `volba-po-tahu-*`)? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4b 13. 11. 2026)

3. **Pata na telefonu drží u spodní hrany jen s vlastním činem bloku** (Tohle je můj tah, Porovnat), po tahu ne? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4b 13. 11. 2026)

4. **Pero:** nabídka jednou pod první zpětnou vazbou („Tohle je tvoje pero. Chceš jiné?“) a stálá volba v Mém deníku? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4b 13. 11. 2026)

5. **Odkryj:** přeložený papír s poznámkou rukou, který se odklopí, a nově Začít znovu (snímky `odkryj-*`, `odkryj-po-*`)? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4b 13. 11. 2026)

6. **První odstavec profilu na telefonu** je pořád pod první obrazovkou (Sókratés 825 px, lišta 772 px). (a) nechat, (b) lišta Obsah na telefonu až pod první odstavec úvodu (odstavec o 76 px výš: Sókratés, Platón, Epikúros, Diogenés i Prótagorás na první obrazovce, Seneca ne), (c) k tomu nižší deska 2 : 1. Doporučuji (b); udělá to K4b jako první věc.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4b 13. 11. 2026)

7. **Chceš něco změnit na snímcích po K4a?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K4b 13. 11. 2026)

