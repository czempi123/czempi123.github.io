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
| K1 | Data deníku: kartičky a rozestup, poznámka a limit citátů, spojení a export; push main a kontrola nasazení herna-v1 | Opus 5.5 · high | **na řadě** (Zadání K1) |
| K2 | Co ti zůstalo?: skladatel otázek z dat, ostrov, oddíl v Tvoje antika, dílna | Opus 5.5 · high | čeká na K1 |
| K3 | Kartičky v deníku: hromádka, otočení, Vím a Zopakuj si, tlačítka Do kartiček u zdrojů | Opus 5.5 · high | čeká na K2 |
| K4 | Vystřižené citáty: nůžky na dalších místech, výstřižek s poznámkou, Moje sbírka, tisk a text | Opus 5.5 · medium | čeká na K3 |
| P6 | Podklady, jen když T narazí na tvrzení, které v ověřených datech není | Sonnet 5.5 · high s vyhledáváním | jen při potřebě |
| T | Texty větve se skillem `atlas-psani` | Opus 5.5 · high | čeká na K4 |
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

Stav kola v deníku: `bloky['co-ti-zustalo/antika'] = { kolo: number; odpovedi: Record<string, 'vim' | 'zopakuj'> }`. Kvíz neukládá zápis, jen stav (jako hry herny).

**Sbírka jako text** (`atlas-citaty-RRRR-MM-DD.txt`, UTF-8), jeden výstřižek za druhým, mezi nimi prázdný řádek:

```
Moje sbírka citátů z Atlasu myšlení (<datum stažení>)

„<znění ze zdroje.yaml>“
<autor>, <dílo> <místo>
Proč jsem si ho vystřihl: <poznámka, jen když ji student napsal>
https://czempi123.github.io<stránka, odkud citát je>
```

## Zadání K1

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2 (git switch denik-v2). Nejdřív git fetch a git status: když je main pořád napřed před origin/main a autor v docs/plany/denik-v2.md › Otázky pro autora nechal otázku 3 prázdnou nebo odpověděl ano, autor tím povoluje připojit repozitář czempi123/czempi123.github.io v cloudu s právem zápisu a poslat main na GitHub: na Macu git bundle create "Claude outputs/main.bundle" origin/main..main, bundle přenes do cloudu (device_stage_files, jinak base64 přes Desktop Commander), v klonu git fetch z bundlu do main a git push origin main. Když main na GitHubu je, udělej kontrolu z docs/archiv/plany/herna-v1.md › Po Uzavření, bod 3 (běh kontrol přes api.github.com/repos/czempi123/czempi123.github.io/actions/runs, protože gh na Macu není; nasazený web na 390 a 1440 px, snímky do Claude outputs/) a výsledek dopiš tamtéž. Když push nejde, nic dalšího nezkoušej a napiš to do Po K1.

Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíl Technika celý) a v docs/plany/denik-v2.md oddíly Co platí, 2, 3, Formáty a Otázky pro autora. Načti skill atlas-komponenta. V src/lib/denik.ts čti jen typy, sCitatem, rozeberDenik a spojDeniky.

Postav datový základ větve, bez UI:
1. Kartičky v deníku podle Formátů: typ Karticka, pole karticky, funkce přidat, vyndat, ohodnotit (Vím, Zopakuj si), naRade(d, dnes) a hromadka(d, dnes, 5), místní datum bez hodin. Kartička, jejíž zdroj v deníku ani v datech už není, se v hromádce neukáže.
2. Citáty: poznamka a upraveno u CitatVDeniku, CITATY_NEJVYS 300 bez tichého výpadku (nad limitem se citát nepřidá a volající to pozná), ulozPoznamkuCitatu.
3. rozeberDenik a spojDeniky znají karticky (vyhraje novější kdy) a poznámku citátu (vyhraje novější upraveno); export je obsahuje beze změny exportuj.
4. Testy ve Vitestu: rozestup přes přihrádky, Zopakuj si vrací do první, týden a měsíc bez návštěvy (hromádka zůstane nejvýš pět, nic se neztratí), půlnoc, spojení dvou deníků, starý deník bez polí, plná sbírka.
Kde si nejsi jistý, zvol nejlepší cestu a zapiš, nad čím jsi váhal. Pusť dotčené testy, pak celé npm test na pozadí s výstupem do souboru. Commit ve větvi denik-v2, na GitHub nic dalšího. Do plánu dopiš oddíl Po K1 (co vzniklo, výsledky testů, nad čím jsi váhal), uprav tabulku Kroky a nahraj docs/plany/denik-v2.md do Projektu Claude. Ve zprávě autorovi: co vzniklo, co jsi zvolil a celý prompt kroku K2 s modelem a úsilím (je v plánu). Zastav se.
```

## Zadání K2

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíly Bloky, Co se skládá z dat a Technika) a v docs/plany/denik-v2.md oddíly Co platí, 1, Formáty, Otázky pro autora a Po K1. Načti skill atlas-komponenta. Podívej se jen na to, co krok potřebuje: src/pages/denik/antika.astro, src/components/denik/_katalog-obdobi.ts, src/lib/herna/pary.ts a citaty.ts (prozrazuje), src/lib/herna/verdikt.ts, src/lib/kresby.ts, schéma pojmů v src/lib/pojmy.ts a hlasů v src/content.config.ts.

Postav Co ti zůstalo? pro antiku podle oddílu 1 a Formátů:
1. Skladatel otázek z dat (čisté funkce v src/lib/herna/, testy ve Vitestu): tři druhy (pojem v situaci ze situací Párů nebo z priklad bez tvaru pojmu, hlas k případu ze tří hlasů téže otázky, obraz a otázka z kresby a cesty), u každé otázky potkal; výběr kola podle deníku (jen prošlé, osm otázek, nejvýš čtyři jednoho druhu, nikdy dva stejné po sobě, semínko z čísla kola, pod čtyři otázky pozvánka). Kontrola při sestavení: žádná situace nejmenuje svůj pojem, každá otázka má tři různé možnosti a vysvětlení z dat. Výpis všech otázek antiky skriptem do Claude outputs/, ať je T a R přečtou jako text.
2. Ostrov CoTiZustalo.svelte: jedna otázka po druhé, jedna odpověď, rub „Víš.“ nebo „Zopakuj si.“ s vysvětlením a odkazem zpět (dvojice slov vedle té ve verdikt.ts, podle Co platí), konec kola bez počtu se seznamem Zopakuj si, Dát do kartiček (funkce z K1) a Nové kolo. Stav v bloky deníku.
3. Oddíl Co ti zůstalo? na stránce Tvoje antika pod přehledem; ukázka v dílně s připraveným deníkem.
Texty piš pracovně krátce; učeše je krok T. Snímky stránky Tvoje antika (prázdný deník, prošlé dvě cesty, konec kola) na 390 a 1440 px ve světlém i tmavém režimu do Claude outputs/ a prohlédni je. Ovládání klávesnicí, čtečka (role, aria-live u rubu), omezený pohyb. Testy v Playwrightu pro průchod kolem. Dotčené testy, pak celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po K2, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co vzniklo, nad čím jsi váhal a celý prompt kroku K3 s modelem a úsilím. Zastav se.
```

## Zadání K3

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíly Bloky, Student, kterého se téma bolestně týká, a Technika) a v docs/plany/denik-v2.md oddíly Co platí, 2, Formáty, Otázky pro autora a Po K2. Načti skill atlas-komponenta. Z kódu čti jen src/components/ostrovy/Denik.svelte (rozvržení oddílů), lístek zápisu v kapitole, src/components/denik/SbirkaDeniku.svelte a stránku pojmu /pojem/<id>/.

Postav kartičky v deníku podle oddílu 2:
1. Oddíl Kartičky v Můj deník pod Návratem, jen když student kartičky má: hromádka na dnes (nejvýš pět), kartička s lícem a rubem podle tabulky zdrojů, otočení (tlačítko, ne jen klepnutí na kartu; při omezeném pohybu bez animace), Vím, Zopakuj si a Vyndat z kartiček, po hromádce Na dnes stačí a nepovinně Ještě pět. Nikde počet čekajících, datum dalšího opakování ani zameškané dny. Prázdný stav s tlačítkem Přidat pojmy, které jsi potkal (pojmy z vyskyty, které student navštívil).
2. Tlačítko Do kartiček (stisknuté = kartička existuje, druhý stisk ji vyndá) u výstřižku ve sbírce, u lístku zápisu s textem (pravidlo, odpověď Teď, sebehodnocení; ne u Volby bez důvodu) a na stránce pojmu. Konec kola Co ti zůstalo? už kartičky přidává z K2.
3. Když otázka 2 pro autora dopadla ne, kartička z vlastního zápisu nemá Vím a Zopakuj si, jen Vrátit za čas a Stačí; jinak podle Formátů.
4. Tečka na ikoně Deníku podle otázky 1 pro autora (výchozí: kartičky ji nerozsvítí).
Texty pracovně krátce, učeše je T. Snímky deníku (prázdné kartičky, hromádka, rub každého zdroje, Na dnes stačí) na 390 a 1440 px ve světlém i tmavém režimu do Claude outputs/ a prohlédni je; klávesnice, čtečka, omezený pohyb, skript scripts/kontrola-fokus.mjs. Testy v Playwrightu: přidání ze všech zdrojů, hodnocení, deník po týdnu (posunuté datum v testu). Dotčené testy, pak celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po K3, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co vzniklo, nad čím jsi váhal a celý prompt kroku K4 s modelem a úsilím. Zastav se.
```

## Zadání K4

Opus 5.5 · medium, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíl Technika) a v docs/plany/denik-v2.md oddíly Co platí, 3, Formáty a Po K3. Načti skill atlas-komponenta. Z kódu čti src/components/ui/Citat.astro, src/scripts/vystrihnout.ts, src/components/denik/SbirkaDeniku.svelte a jen ta místa, kde se citát vykresluje.

Postav vystřižené citáty podle oddílu 3:
1. Nejdřív výpis: grepem najdi všechna místa, kde se vykresluje citát ze zdroje.yaml (Citat.astro i kompaktní, ostrovy jako OsaHlasu a strany Sporu, hry po odkrytí), a zapiš do Po K4, které nůžky mají a které dostanou. Pak nůžky doplň podle pravidla (celý citát, nic už neskrývá; ve hrách až po odkrytí), v ostrovech stejným data-vystrihnout, aby vystrihnout.ts fungoval všude.
2. Výstřižek ve sbírce: papír období, střižený okraj a páska podle docs/design.md, poznámka Proč sis ho vystřihl? (nepovinná, perem studenta, ulozPoznamkuCitatu z K1), Do kartiček z K3, Vyndat ze sbírky.
3. Stránka Moje sbírka /denik/sbirka/ se všemi výstřižky (nejnovější nahoře), odkaz na ni z části sbírky v kapitole deníku; Vytisknout (tisková podoba: lístky na A4 bez lišt a tlačítek) a Stáhnout jako text podle Formátů.
4. Plná sbírka (300): nůžky citát nevystřihnou a řeknou proč.
Texty pracovně krátce, učeše je T. Snímky sbírky a stránky Moje sbírka na 390 a 1440 px ve světlém i tmavém režimu a náhled tisku (PDF z Playwrightu) do Claude outputs/ a prohlédni je; klávesnice a čtečka. Testy v Playwrightu: nůžky na nových místech, poznámka, stažený text. Dotčené testy, pak celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po K4, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co vzniklo, nad čím jsi váhal a celý prompt kroku T s modelem a úsilím. Zastav se.
```

## Zadání P6 (jen při potřebě)

Sonnet 5.5 · high s vyhledáváním, nový chat. Spouští se, jen když krok T zapíše do Po T tvrzení, které v ověřených datech není.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/pouceni.md (oddíl Prameny a formulace) a v docs/plany/denik-v2.md oddíly Co platí a Po T. Načti skill atlas-overeni. Ověř jen tvrzení, která krok T vypsal v Po T jako chybějící v datech; podkladový list docs/podklady/denik-v2.md podle skillu, doporučená formulace u každého. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po P6, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co se ověřilo a co ne a celý prompt kroku, který čeká (T znovu, nebo R), s modelem a úsilím. Zastav se.
```

## Zadání T

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíly Bloky, Celek, Student, kterého se téma bolestně týká, a Co se skládá z dat) a v docs/plany/denik-v2.md oddíly Proč, Co platí, 1 až 3 a Po K1 až Po K4. Načti skill atlas-psani.

Napiš a učeš všechny studentské texty větve: úvod oddílu Co ti zůstalo? (o čem to je a co si student odnese, jednou až dvěma větami, bez metodických slov), zadání tří druhů otázek, pozvánku pod čtyři otázky, konec kola, texty kartiček (nadpis, úvod, výzvy na líci, Na dnes stačí, prázdný stav, Dnes žádná), sbírku a stránku Moje sbírka (titulek, perex, poznámka, tisk, stažení, plná sbírka) a hlavičku staženého textu. Přečti výpis všech otázek Co ti zůstalo? z K2 jako text: každá situace musí poctivě patřit jedinému pojmu, odpovědi hlasů se musí lišit tím, čím se hlasy liší, a vysvětlení nesmí říct víc než data. Kde by věta potřebovala nové tvrzení, nepiš ji a zapiš ji do Po T pro P6. Před opravou věty ji najdi v tests/ a test uprav v tomtéž commitu. Snímky změněných míst na 390 px do Claude outputs/. Dotčené testy, pak celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po T, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co vzniklo, nad čím jsi váhal a celý prompt dalšího kroku (P6, když něco chybí, jinak R) s modelem a úsilím. Zastav se.
```

## Zadání R

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v docs/plany/denik-v2.md oddíly Proč, Co platí, 1 až 3 a Po K1 až Po T. Načti skill atlas-revize (s atlas-psani). Spusť npm run dev na pozadí podle CLAUDE.md.

Zreviduj větev očima filozofa, historika, studenta, učitele a uživatele. Zvlášť: (1) Co ti zůstalo?: projdi celý výpis otázek antiky; sedí každá situace jen na jeden pojem, poznají se hlasy podle myšlenky a ne podle slova, neříká vysvětlení víc než data, nezní rub „Zopakuj si.“ jako výtka? (2) Kartičky: působí jako hra, nebo jako povinnost? Hledej každou stopu odpočtu, počtu a série, i v textu tlačítek; zkus deník po týdnu a po měsíci. Kartička z vlastního zápisu v celku o smrti nebo o strachu: co uvidí student po třech týdnech bez varování? (3) Citáty: nůžky nikde neprozradí odpověď hry; tisk a stažený text čte i učitel. (4) Zásada aktivit a pravidla pestrosti 5 a 14 (docs/plany/po-auditu.md). (5) Klávesnice, čtečka, omezený pohyb, 390 a 1440 px, světlý a tmavý režim, export a spojení deníku ze souboru. Drobnosti oprav rovnou, zásadní nálezy seřaď podle dopadu s návrhem opravy do docs/revize/denik-v2-<datum>.md. Celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po R s otázkami jen pro autora (prázdná odpověď = souhlas s doporučením), tabulka Kroky a celé Zadání O, nahraj plán do Projektu Claude. Ve zprávě autorovi: verdikt, nálezy, otázky a celý prompt kroku O s modelem a úsilím. Zastav se.
```

## Zadání O

Opus 5.5 · high, nový chat. Celé znění doplní krok R podle nálezů; kostra:

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v docs/plany/denik-v2.md oddíly Co platí a Po R (s odpověďmi autora; prázdná = souhlas s doporučením) a záznam revize docs/revize/denik-v2-<datum>.md. Načti skilly, které nálezy potřebují (atlas-komponenta, atlas-psani). Oprav všechny nálezy podle odpovědí, poučení z revize připiš jednou větou do docs/pouceni.md. Snímky opravených míst do Claude outputs/, celé npm test na pozadí. Commit ve větvi denik-v2, na GitHub nic. Do plánu Po O s otázkou jen pro autora, jestli větev schvaluje ke sloučení, tabulka Kroky, nahraj plán do Projektu Claude. Ve zprávě autorovi: co se opravilo, otázka a celý prompt Uzavření s modelem a úsilím. Zastav se.
```

## Zadání Uzavření

Opus 5.5 · medium, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md a v docs/plany/denik-v2.md oddíly Kroky, Otázky pro autora, Po K1, Po O (s odpovědí autora) a Co zůstává na později. Nejdřív se autora zeptej, jestli je u Macu: když ano, projdi s ním VoiceOverem postup z docs/archiv/plany/herna-v1.md › Po O (design-v2, herna-v1) a k němu Co ti zůstalo?, kartičky a Moje sbírku; nálezy oprav, nebo zapiš na později. Když ne, VoiceOver vynech a zapiš to.

Když autor v Po O větev schválil (prázdná odpověď = souhlas): git merge --no-ff denik-v2 do main, celé npm test na main na pozadí. Push: git fetch; main pošli na GitHub způsobem, který fungoval v K1 (Po K1), podle otázky 3 pro autora; když push nejde, nic dalšího nezkoušej a zapiš to. Po pushi kontrola nasazení: běh kontrol přes api.github.com/repos/czempi123/czempi123.github.io/actions/runs a nasazený web na 390 a 1440 px (ZAKLAD=https://czempi123.github.io node scripts/snimky-listy.mjs pro /denik/antika/, /denik/sbirka/, /denik/ a jednu stránku pojmu) do Claude outputs/; když dosud neproběhla kontrola z herna-v1, udělej ji taky a dopiš ji tamtéž. Plán větve přesuň do docs/archiv/plany/denik-v2.md, záznam revize do docs/archiv/revize/, oprav odkazy (grep), řádek denik-v2 v docs/plan-vetve.md, dopiš Po Uzavření. V Projektu Claude nahraď plán větve plánem další větve film-0 (docs/plany/film-0.md s prvním zadáním podle po-auditu.md › Větve) a nahraj docs/plan-vetve.md. Ve zprávě autorovi: co se sloučilo a nasadilo, co zůstalo na později a celý prompt prvního kroku film-0 s modelem a úsilím. Zastav se.
```

## Otázky pro autora

Jen to, co smí rozhodnout jen autor. Prázdná odpověď znamená souhlas s doporučením.

1. **Tečka na ikoně Deníku i pro kartičky na řadě?** 12. 11. jsi schválil tichou tečku, když čeká Návrat. Kartičky by ji rozsvěcely skoro denně a z tečky by se stala připomínka povinnosti. Doporučuji ne: kartičky se ukážou až v deníku.
   Odpověď:
2. **Kartička z vlastního zápisu s „Vím“ a „Zopakuj si“?** Líc se zeptá „Vybavíš si, co jsi napsal?“ a rub ukáže tvé pravidlo. Hodnotí se jen to, jestli si vlastní pravidlo pamatuješ, nikdy pravidlo samo; pravidlo, které si nepamatuješ, tě nevede. Doporučuji ano. Když ne, dostane taková kartička jen „Vrátit za čas“ a „Stačí“.
   Odpověď:
3. **GitHub z cloudu.** Na Macu git přihlášení ke GitHubu nemá a připojení repozitáře s právem zápisu z cloudu dnes zamítla automatická kontrola oprávnění. Smí Claude v K1 a v Uzavření připojit repozitář czempi123/czempi123.github.io s právem zápisu a poslat `main` sám? Doporučuji ano (zadání K1 to povolení obsahuje). Druhá možnost bez Terminálu: aplikace GitHub Desktop, v ní jednou otevřít složku Atlas a klepnout na Push origin.
   Odpověď:

## Co zůstává na později

- Co ti zůstalo? a kartičky pro další období: každé období dostane svou stránku Tvoje <období> s kvízem ze svých pojmů, hlasů a kreseb. Do skillu `atlas-obdobi` to zapíše `uklid-v1` (spolu s pravidly pestrosti).
- Kartičky z dalších zdrojů (hlas, který byl studentovi nejblíž, Návrat), až je student bude chtít.
- Lístek z cesty pro učitele a odevzdání sbírky ve třídě: `trida-v1` (kurikulum, odpověď 4).
- VoiceOver s autorem z herna-v1 a design-v2 (postup v `docs/archiv/plany/herna-v1.md` › Po O): připojí se k Uzavření této větve, když bude autor u Macu.
- Kontrola nasazení herna-v1 (`docs/archiv/plany/herna-v1.md` › Po Uzavření, bod 3): v K1, jakmile bude `main` na GitHubu, nejpozději v Uzavření.
