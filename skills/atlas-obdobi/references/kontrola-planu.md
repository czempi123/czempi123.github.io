# Kontrola plánu období

Projdi seznam nad hotovým plánem. Každý bod plán buď splňuje, nebo z něj udělá otázku pro autora. Pod seznamem je antika jako ukázka: co měla, co jí po celcích chybělo a co našla souhrnná revize. Čísla jsou z repozitáře k 6. 11. 2026 (větev `interaktivita-v2`); pro další období je spočítej znovu stejným výpisem.

## Kontrolní seznam

### Lidé
- [ ] Každá osoba z Kostry osobností má hloubku (portrét, profil, medailonek) a celek, ve kterém vznikne její stránka.
- [ ] Nové osoby v datech jsou otázkou pro autora (kdo, hloubka, proč, který celek ji nese); krok, který na nich stojí, čeká na odpověď.
- [ ] Protihlas se v celcích střídá a aspoň jeden přichází z jiné tradice; žádný myslitel nemluví ve většině cest období.
- [ ] Každá strana Sporu a každý hlas na stránce otázky má v datech aspoň medailonek s atributem.
- [ ] Ženy z architektury mluví v celcích jako plné hlasy.

### Otázky a cesty
- [ ] Etika (otázky 1 a 2) nejvýš třetina cest období; otázka s nejvíc cestami v atlasu nedostane další, dokud otázky bez cesty nemají žádnou.
- [ ] Každá cesta má jednu hlavní otázku, příběh z období a současný případ.
- [ ] Aspoň jedna cesta má jinou stavbu než antika a nový blok (Dialog, Úryvek s otázkou) je naplánovaný v kroku před ní.
- [ ] Zadání každého celku připomíná: úvod a závěr naposledy, srovnat s hotovými cestami období; závěr se ptá na první tah té cesty.
- [ ] Názvy kroků a první bloky se mezi cestami téže otázky neopakují (cesty 5 a 6 měly oba „Tři koše“).
- [ ] Scéna, kterou nese cesta, má v portrétu kratší kapitolu s odkazem na krok cesty.
- [ ] Délka cest se nekrátí; plán vybere cesty pro zkoušku se studenty a pro přípravu hodiny.
- [ ] Otázka bez cesty v období má stránku jen s hlasy lidí se stránkou a zastánce každé možnosti úvodního případu; aspoň jedna stránka otázky otevře otázkou místo „Představ si…“.
- [ ] Jeden dva myšlenkové pokusy na vlastní stránce; blok nebo kresba odjinud se vkládá se stejným id.

### Interaktivita
- [ ] Každý celek má jednu pohyblivou myšlenku a plán řekne, jestli je nová (krok K), nebo hotová.
- [ ] Nová kresba s pohybem jde zastavit, po zastavení ukáže stav omezeného pohybu a autor ji uvidí dřív, než je hotová.
- [ ] Hlasy každé otázky po období jsou spočítané; nad sedm hlasů nebo přes tisíc let rozpětí kontroluje revize osu na 390 px.
- [ ] Hlavičky profilů s mnoha otázkami a cestami (víc než pět tlačítek) má revize vyfotit na telefonu.

### Mapa, čas a data
- [ ] Výřez mapy období je schválený, nebo je jeho úprava otázkou pro autora.
- [ ] Kotvy z architektury mají krok v `udalosti.yaml` se zdrojem; stránka období má rok a osobu pro Mapu a čas.
- [ ] Portréty a profily mají v kroku dat místa s rolí a časem ze zdroje; tenké trasy jsou vypsané.
- [ ] Nové osoby mají vztahy s typem a zdrojem (učitel a žák, vliv textem), aby Dva životy a rodokmeny nevzaly náhodného současníka.

### Náboženství a jinde
- [ ] Tradice období mají stránku ze šablony a vlastní krok podkladů P6N; čtení očima věřícího i nevěřícího je v zadání.
- [ ] Mezitím jinde dvěma větami bez odkazu, dokud nepřibudou osoby z jiné tradice.

### Stránky ze šablon a deník
- [ ] Stránka období, směry s cestami nebo portréty, pokusy a tradice mají krok nejpozději v celku, který je poprvé potřebuje, ne až na konci.
- [ ] Směr se stránkou má v datech zakladatele, vztahy učitel a žák a spor s jiným směrem.
- [ ] Anekdoty a citáty přidělené stránkám z dat jsou vyhledané napříč `src/content`.
- [ ] Tvoje <období> má krok se vstupem z deníku a z poslední stránky období; Kam dál předchozího období vede na nové období.

### Pořadí a tvar
- [ ] Šablony a bloky jdou před texty, které je potřebují; podklady před vším.
- [ ] Na konci souhrnná revize období (P11), úprava skillů (P13) a zkouška nebo hodina se studenty.
- [ ] Plán má tvar ze skillu (tabulka kroků s modelem, otázky s doporučením, Po, zadání dalšího kroku v plném znění).

## Jak spočítat, co atlas má

Stránky nečti, vypiš je:

```
ls src/content/*/
grep -c 'medailonek: true' src/data/lide.yaml
for f in src/content/cesty/*.mdx; do echo "$f $(grep -m1 '^minut' $f) $(grep -m1 '^otazka' $f)"; done
grep -c 'osoba:' src/content/otazky/*
grep -rl '<Spor' src/content/cesty | wc -l
npx vite-node scripts/zivot-na-mape-vypis.ts
```

Počty v datech (lidé podle hloubky a období, vztahy podle typu, události podle druhu) dá krátký skript v `scripts/` s `js-yaml` (`node scripts/<skript>.mjs`, po výpisu ho smaž). Python na Macu modul `yaml` nemá a skript mimo repozitář `js-yaml` nenajde.

## Antika jako ukázka

### Co antika má (6. 11. 2026)

| Co | Počet | Poznámka |
| --- | --- | --- |
| Stránky období | 2 | Počátky a klasické Řecko (`mapa: { rok: -399, osoba: sokrates }`), Helenismus a Řím |
| Lidé v datech | 50 | 30 v období 1, 20 v období 2; hloubka 6 portrétů, 18 profilů, 26 medailonků; vlastní stránku má 13 z 24 portrétů a profilů |
| Stránky osob | 12 + 34 | 12 MDX (13 lidí, Kratés a Hipparchia společně) a 34 medailonků z dat; bez stránky Lucretius, Konfucius, Pýthagorás |
| Cesty | 10 | 14 až 35 minut, průměrně 27; k otázce 1 čtyři, k otázce 3 dvě, k 4, 5, 6, 7 po jedné, k 2, 8, 9, 10 žádná |
| Stránky otázek | 8 | 42 hlasů, 4 až 7 na stránku, s osou hlasů; otázky 9 a 10 bez stránky |
| Směry | 13 | stránku mají 4: stoicismus, epikureismus, kynismus, Akademie |
| Myšlenkové pokusy | 2 | Gýgův prsten, Zrcadlo času |
| Úvody a tradice | 2 + 1 | Co je filozofie?, Co je náboženství?; judaismus |
| Bloky v datech | 91 | kroků cest s blokem: Volba 19, Odkryj 12, Příběh 11, Spor 10, Roztřiď 8, Změň jednu věc 8, Kdo je na tvé straně 5, Slož argument 1; Dialog a Úryvek s otázkou nikde |
| Kresby | 13 | ostrovy na rámu `Kresba.svelte` |
| Deník | 2 | Tvoje antika (`/denik/antika/`), Stoický týden |
| Vztahy | 63 | 22 učitel a žák, 22 vliv textem, 10 znali se, 9 polemika |
| Místa | 55 | aspoň tři místa má 21 lidí, místo s časem 18; Život na mapě má 27 z 50, tenkou trasu 6 |
| Události | 17 | 9 kotev, 8 ze životů |
| Prameny | 383 + 365 + 23 | prameny, citáty, obrázky v `zdroje.yaml` |

### Co po celcích chybělo a doplnila větev `antika-doplnky`

Deset celků postavilo cesty, portréty a profily, ale student neměl kudy vstoupit do celku: pás období vedl jen na kotvy v Lidech, směry byly jména, polovina otázek neměla stránku. Větev `antika-doplnky` (3. 11. 2026) dodělala Co je filozofie?, stránky období 1 a 2, čtyři směry, stránky otázek 2 a 8, pokusy Gýgův prsten a Zrcadlo času, Co je náboženství? s judaismem a Tvoje antika. Tytéž stránky má každé další období od prvního celku.

### Co antika proti architektuře ještě nemá (6. 11. 2026)

Antika není hotový vzor celá: proti Kostře osobností, Náboženství světa, Myšlenkovým pokusům a fázi F3 v Pořadí výroby jí chybí tohle. Plán středověku (P12) to dá autorovi jako první otázku: dodělat před prvním celkem středověku, souběžně, nebo později.

| Co chybí | Podle architektury | Dnes |
| --- | --- | --- |
| Stránky 11 lidí s hloubkou profil | Thalés, Pýthagorás, Démokritos, Zénón z Eleje, Zénón z Kitia, Chrýsippos, Pyrrhón, Lucretius, Cicero, Hypatia, Plótínos | devět z nich má jen medailonek z dat, Pýthagorás a Lucretius žádnou stránku |
| Stránky tradic | buddhismus a čínská tradice (okna Mezitím jinde období 1 a 2, F3) | jen judaismus |
| Myšlenkové pokusy období 1 a 2 | Achilleus a želva, Karneadova deska | jen Gýgův prsten a Zrcadlo času |

### Co našla souhrnná revize (25. 10. 2026) a co z toho plyne pro plán

| Nález revize | Bod plánu |
| --- | --- |
| Úvody cest mají stejný konec a dva popisují stavbu | Úvod naposledy, srovnat s obdobím (zadání každého celku) |
| Všechny cesty končí stejným odstavcem | Závěr se ptá na první tah té cesty |
| Portrét Sókrata opakuje cestu 1 slovo od slova | Scéna patří jednomu místu, druhé ji vypráví kratší s odkazem |
| Krok Kdo je na tvé straně je nejdelší a cizí | Blok Kdo je na tvé straně a mezititulky; nový případ a zastánci jsou dva kroky |
| Dvě kresby po zastavení neukazují obsah | Pravidlo kresby s pohybem v každém kroku K |
| Hlavička profilu na telefonu odsune desku | Vyfotit hlavičky osob s mnoha cestami a otázkami |
| Cesty 5 a 6 mají stejný krok 2 | Názvy kroků a první bloky napříč otázkou |
| Deník nejde nahrát zpět | Před zkouškou se studenty, když budou pracovat doma |
| Čísla cest z katalogu, žádná další cesta | Student číslo cesty nevidí; Kam dál nabízí další cestu |
| Stránky otázek otevírají „Představ si…“ | Aspoň jedna stránka otázky otevře otázkou |

K tomu revize napříč celky: deset cest stejné stavby (jiná stavba v každém období), Aristotelés v sedmi cestách (protihlas z jiné tradice), čtyři cesty k otázce 1 a žádná ke čtyřem jiným (vyváženost), cesty 14 až 35 minut (délka se nekrátí, vybírá se).
