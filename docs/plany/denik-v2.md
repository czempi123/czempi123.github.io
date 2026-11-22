# Větev denik-v2: deník se sbírkou a kvízem

Druhá větev fáze 2 (herna) podle `docs/plany/po-auditu.md` › Větve: kvíz **Co ti zůstalo?** na konci antiky, **kartičky s rozestupem** v deníku a **vystřižené citáty** ve sbírce. Zkouška na obsahu: Tvoje antika. Plán napsaný 22. 11. 2026 (krok Plán).

## Proč

Kurikulum (`docs/plany/kurikulum.md`, řádek „Student vidí vlastní pokrok“) má mezeru: student neposoudí, co už umí a co ne. Strategie 2030+ chce formativní hodnocení, sebehodnocení a portfolio. Atlas dnes nabízí odpovědi Na začátku × Teď a sebehodnocení na konci cesty, ale nic, co by se po týdnech vrátilo a zeptalo: zůstalo ti to?

Tahle větev dá deníku tři věci, které mají jeden smysl. Student si vybaví, co potkal (kvíz), sám si určí, co se mu má vracet (kartičky), a sbírá věty, které ho zasáhly (citáty). Do života si odnese dvě dovednosti: pozná myšlenku filozofa v obyčejné situaci a zažije, že se paměť drží vybavováním a návratem po čase, ne opakovaným čtením. Obojí se mu hodí v každém předmětu.

## Co platí

- Výsledek kvízu i kartiček je bez bodů, jen „Víš.“ a „Zopakuj si.“ s odkazem zpět (`docs/rozhodnuti.md`, odpověď 2 po auditu). Jde o znalost, ne o názor; za názory se body nedávají nikdy. Na konci kola žádný počet („6 z 8“), žádná procenta.
- Deník je zápisník se sbírkou: razítka, pahýly lístků, vystřižené citáty (odpověď 1 po auditu).
- Pointa není paměť (autor, 17. 11. 2026): žádné učení citátů nazpaměť ani hádání, kdo co řekl; přesné roky jen tam, kde vysvětlují, kdo na koho navázal. Kvíz se proto ptá na myšlenky a kartička s citátem chce myšlenku, ne slova.
- Do atlasu nepatří žebříčky ani série dní (`CLAUDE.md`): kartičky nemají odpočet, datum dalšího opakování, počet zameškaných ani sérii. Kdo nepřijde, nic neztratí a nic mu nevyčítáme.
- Žádné nové historické tvrzení bez skillu `atlas-overeni`. Kvíz i kartičky skládají jen to, co už v datech a v ověřeném obsahu je.
- Všechno zůstává v prohlížeči studenta (`atlas-denik` v localStorage) a je součástí exportu i spojení deníku ze souboru.
- Zásada aktivit (`po-auditu.md` › Zásada): po kvízu umí student jednou větou říct, co si odnesl; přemýšlí sám; kartičky i kvíz jsou dobrovolné a chce je dělat, protože se dozví něco o sobě, ne protože musí.
- Kde se změní studentský text, platí skill `atlas-psani`; kód a UI se staví se skillem `atlas-komponenta` (390 a 1440 px, světlý i tmavý režim, klávesnice, omezený pohyb).

## 1. Co ti zůstalo? na konci antiky

**Kde stojí.** Na stránce Tvoje antika (`src/pages/denik/antika.astro`) jako vlastní oddíl pod přehledem velkých otázek (`TvojeObdobi.svelte`), s nadpisem „Co ti zůstalo?“. Stránka tak má dvě poloviny: co sis myslel (a kdo s tebou stál) a co ti zůstalo. Vstup z deníku a z Kam dál stránky období 2 už vede sem; nový se nepřidává. Ukázka s připraveným deníkem přibude do dílny.

**Z čeho se otázky skládají.** Tři druhy, všechny z hotových a ověřených dat, nic se nepíše nově:

1. **Myšlenka v situaci** (pojmy, `src/content/pojmy/`, podklady `docs/podklady/pojmy-antika.md`). Situace ze života šestnáctiletého, student volí ze tří pojmů téhož období, která myšlenka se v ní ukazuje. Situace bere z Párů (herna-v1, `src/lib/herna/pary.ts`, už revidované i s pastmi), jinak z pole `priklad` pojmu, ale jen když pojem nejmenuje (kontrola tvarů z pole `tvary`, stejně jako `prozrazuje` v `src/lib/herna/citaty.ts`). Vysvětlení: první věta `vysvetleni` a u koho ten pojem stojí (`uKoho`).
2. **Hlas k případu** (hlasy na stránkách velkých otázek, `src/content/otazky/`). Úvodní případ otázky a jméno filozofa; student volí ze tří odpovědí hlasů téže otázky, jak by s případem naložil právě on. Nehádá se jméno ani citát: jméno stojí v zadání, rozhoduje porozumění myšlence. Vysvětlení: citát hlasu s údajem (z `zdroje.yaml`).
3. **Obraz a otázka** (kresby, `src/lib/kresby.ts`, a cesty, ve kterých stojí). Název kresby a jedna věta, co v ní student dělal (z kroku cesty); volí, na kterou velkou otázku obraz odpovídá. Vysvětlení: cesta a krok, kde kresbu potkal. Jiný druh paměti než slova (pravidlo pestrosti 5).

**Které otázky dostane.** Jen z toho, co student opravdu prošel: z kroků cest v deníku (`cesty[slug].navstivene`) a z navštívených stránek (`navstivene`, `prectene`). Kolo má osm otázek, nejvýš čtyři jednoho druhu, dvě stejného druhu nikdy po sobě. Pořadí je pevné ze semínka (číslo kola), po obnovení stránky stejné. Když prošel méně, kolo je kratší; pod čtyři otázky se kvíz neotevře a místo něj stojí jedna věta s pozváním do první cesty antiky, kterou student nedokončil.

**Co dostane po odpovědi.** Jedna odpověď, pak hned rub: „Víš.“, nebo „Zopakuj si.“, pod tím vysvětlení (jedna až dvě věty z dat) a odkaz zpět na místo, kde to potkal („Zpátky do kroku 3 cesty Kolik je dost?“). Druhý pokus není, protože jde o vybavení, ne o hádání. Konec kola: seznam „Zopakuj si“ jako odkazy, tlačítko „Dát do kartiček“ (přidá je jako kartičky druhu `zustalo`) a „Nové kolo“. Žádný počet.

**Co si odnese do života.** Pozná ataraxii u zprávy, která pípne, a ví, co by jeho problému řekl Epiktétos. A z kartiček se naučí, že co si vybaví po týdnu, to mu zůstane. Úvod oddílu to řekne jednou větou, bez metodických slov.

## 2. Kartičky s rozestupem v deníku

**Co na kartičce je.** Kartičky si student skládá sám; nic do nich nepřibude bez jeho klepnutí. Čtyři zdroje, každý s tlačítkem „Do kartiček“:

| Zdroj | Kde se přidá | Líc | Rub |
| --- | --- | --- | --- |
| Pojem | stránka pojmu `/pojem/<id>/`; v prázdných kartičkách jedno tlačítko „Přidat pojmy, které jsi potkal“ | pojem a otázka „Co to znamená? Řekni si to vlastními slovy.“ | vysvětlení, příklad, odkaz na místo, kde ho potkal |
| Vystřižený citát | sbírka citátů | autor, dílo a místo, stránka odkud; „Co v té větě říká? Stačí myšlenka.“ | citát a studentova poznámka |
| Vlastní zápis | lístek zápisu v kapitole deníku (pravidlo z cesty, odpověď Teď, sebehodnocení) | otázka zápisu; „Vybavíš si, co jsi napsal?“ | studentova odpověď a „Platí to pro tebe pořád?“ s odkazem, kde ji jde přepsat |
| Co ti zůstalo? | konec kola kvízu | podnět a zadání bez možností | správná odpověď, vysvětlení, odkaz zpět |

Zápis z Volby s `bezDuvodu: true` a zápisy bez textu tlačítko nemají. Když student zdroj smaže (vyndá citát, smaže zápis), kartička tiše zmizí.

**Jak se počítá rozestup.** Pět přihrádek (Leitner). Nová kartička je na řadě hned. „Vím“ ji posune o přihrádku dál, „Zopakuj si“ ji vrátí do první. Dny od posledního opakování podle přihrádky: 1, 3, 7, 16, 35. Počítá se podle místního data, ne podle hodin, aby se kartička nevracela o půlnoci. Na rubu je jen „Vím“, „Zopakuj si“ a „Vyndat z kartiček“.

**Co student vidí.** Oddíl Kartičky v Můj deník (pod Návratem, nad Moje filozofie), jen když nějaké kartičky má. Ukáže **hromádku na dnes**: nejvýš pět kartiček, které jsou na řadě, od nejdéle čekající. Po hromádce „Na dnes stačí.“ a nepovinně „Ještě pět“. Nikde není, kolik čeká celkem, kdy přijde další, ani kolik dní student vynechal. Když nic na řadě není: „Dnes žádná. Kartičky se ozvou samy, až přijde jejich čas.“

**Když student týden nepřijde.** Nic se nestane. Kartičky zůstanou v přihrádkách, hromádka je pořád nejvýš pět a začne těmi, které čekají nejdéle. Žádné upozornění, žádný počet zameškaných, žádný rozdíl v textu. Kdo po měsíci řekne „Vím“, posune se jako kdokoli jindy.

**Tečka na ikoně Deníku** svítí dál jen pro Návrat; kartičky ji nerozsvítí (otázka 1 pro autora).

## 3. Vystřižené citáty

**Co už je** (design-v2, K6): nůžky u citátu na listu (`src/components/ui/Citat.astro`, skript `src/scripts/vystrihnout.ts`), sbírka v kapitole období (`SbirkaDeniku.svelte`), uložení v `citaty` deníku s textem a údaji, nejvýš 60 citátů (nejstarší tiše vypadne).

**Odkud se dají vystřihnout nově.** Pravidlo: nůžky má každý citát ze `zdroje.yaml`, který student vidí celý a který už nic neskrývá. Přibudou u kompaktního citátu (časová osa otázky `HlasyOsa.astro`, Stoický týden), v ostrovech, které citát vykreslí samy (osa hlasů `OsaHlasu.svelte`, strany Sporu), a ve hrách až po odkrytí (rub Kdo to řekl?, hotový Doplň citát). Před odkrytím nůžky nejsou, prozradily by odpověď. Krok K4 nejdřív vypíše všechna místa, kde se citát vykresluje, a k nim, jestli nůžky má.

**Jak vypadají ve sbírce.** Výstřižek: lístek v papíru období, odkud citát je, se střiženým okrajem a páskou (vzor `docs/design.md` › páska), citát v Newsreaderu, pod ním autor, dílo, místo jako odkaz na stránku, odkud ho student vystřihl. Nově **poznámka**: jeden řádek „Proč sis ho vystřihl?“, nepovinný, studentovým perem. U každého výstřižku „Do kartiček“ a „Vyndat ze sbírky“. V kapitole období zůstává část sbírky z toho období; nová stránka **Moje sbírka** (`/denik/sbirka/`) ukáže všechny výstřižky pohromadě, nejnovější nahoře.

**Limit.** Tichý výpadek nejstaršího citátu se ruší (vzal by s sebou i kartičku). Sbírka drží 300 citátů; když je plná, nůžky citát nevystřihnou a řeknou proč.

**Export.** Celý deník se dál stahuje jako soubor JSON (`exportuj`). Stránka Moje sbírka navíc nabídne „Vytisknout“ (tisková podoba: lístky na A4, bez lišt a tlačítek) a „Stáhnout jako text“ (soubor `.txt`, formát níž). Text si student může vložit kamkoli nebo ho odevzdat učiteli, aniž odevzdá deník (kurikulum, řádek Portfolio).

## Kroky

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| Plán | Plán větve | Opus 5.5 · high | hotovo 22. 11. 2026 |
| K1 | Kontroly na GitHubu (limit času, test Kde to bylo? na telefonu); data deníku: kartičky a rozestup, poznámka a limit citátů, spojení a export | Opus 5.5 · high | hotovo 22. 11. 2026 (Po K1) |
| K2 | Co ti zůstalo?: skladatel otázek z dat, ostrov, oddíl v Tvoje antika, dílna | Opus 5.5 · high | hotovo 22. 11. 2026 (Po K2) |
| K3 | Kartičky v deníku: hromádka, otočení, Vím a Zopakuj si, tlačítka Do kartiček u zdrojů | Opus 5.5 · high | hotovo 22. 11. 2026 (Po K3) |
| K4 | Vystřižené citáty: nůžky na dalších místech, výstřižek s poznámkou, Moje sbírka, tisk a text | Opus 5.5 · medium | hotovo 22. 11. 2026 (Po K4) |
| P6 | Podklady, jen když T narazí na tvrzení, které v ověřených datech není | Sonnet 5.5 · high s vyhledáváním | jen při potřebě |
| T | Texty větve se skillem `atlas-psani` | Opus 5.5 · high | **na řadě** (Zadání T) |
| R | Revize větve se skillem `atlas-revize` | Opus 5.5 · high | čeká na T |
| O | Opravy po revizi | Opus 5.5 · high | čeká na R |
| Uzavření | VoiceOver s autorem (je-li u Macu), sloučení, GitHub, kontrola nasazení, plán do archivu | Opus 5.5 · medium | čeká na O |

**Nad čím jsem váhal.**
- *Kvíz jen z prošlého, nebo z celé antiky?* Zvolil jsem prošlé: kvíz se jmenuje „Co ti zůstalo?“ a otázka na něco, co student nepotkal, by ho jen zkoušela. Jinak by šlo doplňovat kolo z celé antiky s větou „tohle tě teprve čeká“.
- *Třetí druh otázky.* Zvažoval jsem vztahy („na koho navázal“) a Kdo by to řekl?. Vztahy vedou k učení jmen a let, Kdo by to řekl? nemá správnou odpověď, jen „Atlas by vybral“. Obraz a otázka cvičí jinou paměť a stojí jen na struktuře atlasu.
- *Automatické kartičky.* Kartičky ze všeho, co student potkal, by narostly v povinnost. Jen klepnutím studenta, s jedinou výjimkou tlačítka „Přidat pojmy, které jsi potkal“ v prázdném stavu.
- *Hromádka po pěti.* Menší číslo působí jako hra, větší jako úkol. „Ještě pět“ nechává víc tomu, kdo chce.
- *Celá sbírka na vlastní stránce.* Sbírka po kapitolách období zůstává; pro tisk a export je potřeba jedno místo se vším.
- *P6 předem?* Kvíz ani kartičky nové tvrzení nepotřebují (pojmy mají podklady, hlasy citáty z `zdroje.yaml`, kresby jen strukturu atlasu). P6 proto jen při potřebě, kdyby ho T přece jen našel.
- *K4 s úsilím medium.* Datový model a vzhled lístku už stojí; jde hlavně o rozšíření nůžek a tiskovou podobu. Kdyby výpis míst s citáty ukázal víc ostrovů, než čekám, přepni na high.

## Formáty

**Kartička v deníku** (`src/lib/denik.ts`, nové nepovinné pole `karticky`, součást exportu):

```ts
/** klíč: `${zdroj}:${ref}`, např. „pojem:klid“, „zapis:<id zápisu>“ */
karticky?: Record<string, Karticka>;
interface Karticka {
  zdroj: 'pojem' | 'citat' | 'zapis' | 'zustalo';
  /** id ve zdroji: pojem, citát ze zdroje.yaml, zápis v deníku, otázka kvízu */
  ref: string;
  /** 0 = nová, 1–5 = přihrádka */
  prihradka: number;
  /** místní datum posledního opakování (RRRR-MM-DD); nová ho nemá */
  naposledy?: string;
  pridano: string; // ISO
  /** poslední změna (ISO); při spojení deníku ze souboru vyhraje novější */
  kdy: string;
}
```

Rozestup ve dnech podle přihrádky: `[0, 1, 3, 7, 16, 35]`. Na řadě je kartička, když `naposledy` chybí, nebo když `naposledy + ROZESTUP[prihradka] ≤ dnes`. Hromádka: kartičky na řadě seřazené podle dne, kdy na řadu přišly (nejstarší první), pak podle `pridano`; prvních pět.

**Vystřižený citát** (`CitatVDeniku`) dostane nepovinné `poznamka?: string` a `upraveno?: string` (ISO, pro spojení deníku). `CITATY_NEJVYS = 300`; `sCitatem` nad limitem citát nepřidá a dá to volajícímu vědět.

**Otázka Co ti zůstalo?** (skládá se při sestavení z dat, ostrov ji dostane hotovou):

```ts
interface OtazkaZustalo {
  id: string;            // „pojem:klid“, „hlas:<otázka>:<osoba>“, „kresba:<komponenta>“
  druh: 'pojem' | 'hlas' | 'kresba';
  podnet: string;        // situace / případ a jméno filozofa / název kresby a co v ní student dělal
  zadani: string;        // věta nad možnostmi
  moznosti: { id: string; text: string }[]; // tři, pořadí ze semínka
  spravna: string;
  vysvetleni: string;    // z dat: první věta vysvětlení pojmu, citát hlasu s údajem, cesta a krok
  zpet: { href: string; text: string };
  /** kde to student potkal: adresy stránek a „cesta/<slug>/<krok>“ (výběr podle deníku) */
  potkal: string[];
}
```

Stav kola v deníku: `bloky['co-ti-zustalo/antika'] = { kolo: number; poradi: string[]; pozice: number; odpovedi: Record<string, 'vim' | 'zopakuj'>; volby: Record<string, string> }` (K2 přidal zmrazené pořadí kola, pozici a zvolenou možnost pro rub po obnovení). Kvíz neukládá zápis ani aktivitu, jen stav. Otázka má navíc `nazev` (krátký název do seznamu Zopakuj si a do kartičky).

**Sbírka jako text** (`atlas-citaty-RRRR-MM-DD.txt`, UTF-8), jeden výstřižek za druhým, mezi nimi prázdný řádek:

```
Moje sbírka citátů z Atlasu myšlení (<datum stažení>)

„<znění ze zdroje.yaml>“
<autor>, <dílo> <místo>
Proč jsem si ho vystřihl: <poznámka, jen když ji student napsal>
https://czempi123.github.io<stránka, odkud citát je>
```

## Zadání kroků

Celá zadání kroků K1 až Uzavření, s modelem a úsilím, jsou v `docs/plany/denik-v2-zadani.md`. Krok, který zadání upraví, upraví ho tam.

## Otázky pro autora

Jen to, co smí rozhodnout jen autor. Prázdná odpověď znamená souhlas s doporučením.

1. **Tečka na ikoně Deníku i pro kartičky na řadě?** 12. 11. jsi schválil tichou tečku, když čeká Návrat. Kartičky by ji rozsvěcely skoro denně a z tečky by se stala připomínka povinnosti. Doporučuji ne: kartičky se ukážou až v deníku.
   Odpověď: bez odpovědi = doporučení (K3: tečka jen pro Návrat).
2. **Kartička z vlastního zápisu s „Vím“ a „Zopakuj si“?** Líc se zeptá „Vybavíš si, co jsi napsal?“ a rub ukáže tvé pravidlo. Hodnotí se jen to, jestli si vlastní pravidlo pamatuješ, nikdy pravidlo samo; pravidlo, které si nepamatuješ, tě nevede. Doporučuji ano. Když ne, dostane taková kartička jen „Vrátit za čas“ a „Stačí“.
   Odpověď: bez odpovědi = doporučení (K3: Vím a Zopakuj si).
3. **GitHub z cloudu.** Na Macu git přihlášení ke GitHubu nemá a připojení repozitáře s právem zápisu z cloudu dnes zamítla automatická kontrola oprávnění. Smí Claude v K1 a v Uzavření připojit repozitář czempi123/czempi123.github.io s právem zápisu a poslat `main` sám? Doporučuji ano (zadání K1 to povolení obsahuje). Druhá možnost bez Terminálu: aplikace GitHub Desktop, v ní jednou otevřít složku Atlas a klepnout na Push origin.
   Odpověď: ano, výslovně povoleno (22. 11. 2026); `main` poslaný týž den z cloudu přes git bundle (Po Plán).

## Průběh

Zápisy Po Plán až Po K3 jsou v `docs/plany/denik-v2-prubeh.md`; sem patří jen poslední zápis, starší se při dalším kroku přesunou tam.

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

## Co zůstává na později

- Co ti zůstalo? a kartičky pro další období: každé období dostane svou stránku Tvoje <období> s kvízem ze svých pojmů, hlasů a kreseb. Do skillu `atlas-obdobi` to zapíše `uklid-v1` (spolu s pravidly pestrosti).
- Kartičky z dalších zdrojů (hlas, který byl studentovi nejblíž, Návrat), až je student bude chtít.
- Lístek z cesty pro učitele a odevzdání sbírky ve třídě: `trida-v1` (kurikulum, odpověď 4).
- VoiceOver s autorem z herna-v1 a design-v2 (postup v `docs/archiv/plany/herna-v1.md` › Po O): připojí se k Uzavření této větve, když bude autor u Macu.
- Kontroly na GitHubu po opravě v K1 zezelenají až po sloučení větve v Uzavření; do té doby je poslední běh na `main` zrušený.
