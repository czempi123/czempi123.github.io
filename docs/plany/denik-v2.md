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
| K2 | Co ti zůstalo?: skladatel otázek z dat, ostrov, oddíl v Tvoje antika, dílna | Opus 5.5 · high | **na řadě** (Zadání K2) |
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

## Zadání kroků

Celá zadání kroků K1 až Uzavření, s modelem a úsilím, jsou v `docs/plany/denik-v2-zadani.md`. Krok, který zadání upraví, upraví ho tam.

## Otázky pro autora

Jen to, co smí rozhodnout jen autor. Prázdná odpověď znamená souhlas s doporučením.

1. **Tečka na ikoně Deníku i pro kartičky na řadě?** 12. 11. jsi schválil tichou tečku, když čeká Návrat. Kartičky by ji rozsvěcely skoro denně a z tečky by se stala připomínka povinnosti. Doporučuji ne: kartičky se ukážou až v deníku.
   Odpověď:
2. **Kartička z vlastního zápisu s „Vím“ a „Zopakuj si“?** Líc se zeptá „Vybavíš si, co jsi napsal?“ a rub ukáže tvé pravidlo. Hodnotí se jen to, jestli si vlastní pravidlo pamatuješ, nikdy pravidlo samo; pravidlo, které si nepamatuješ, tě nevede. Doporučuji ano. Když ne, dostane taková kartička jen „Vrátit za čas“ a „Stačí“.
   Odpověď:
3. **GitHub z cloudu.** Na Macu git přihlášení ke GitHubu nemá a připojení repozitáře s právem zápisu z cloudu dnes zamítla automatická kontrola oprávnění. Smí Claude v K1 a v Uzavření připojit repozitář czempi123/czempi123.github.io s právem zápisu a poslat `main` sám? Doporučuji ano (zadání K1 to povolení obsahuje). Druhá možnost bez Terminálu: aplikace GitHub Desktop, v ní jednou otevřít složku Atlas a klepnout na Push origin.
   Odpověď: ano, výslovně povoleno (22. 11. 2026); `main` poslaný týž den z cloudu přes git bundle (Po Plán).

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

## Co zůstává na později

- Co ti zůstalo? a kartičky pro další období: každé období dostane svou stránku Tvoje <období> s kvízem ze svých pojmů, hlasů a kreseb. Do skillu `atlas-obdobi` to zapíše `uklid-v1` (spolu s pravidly pestrosti).
- Kartičky z dalších zdrojů (hlas, který byl studentovi nejblíž, Návrat), až je student bude chtít.
- Lístek z cesty pro učitele a odevzdání sbírky ve třídě: `trida-v1` (kurikulum, odpověď 4).
- VoiceOver s autorem z herna-v1 a design-v2 (postup v `docs/archiv/plany/herna-v1.md` › Po O): připojí se k Uzavření této větve, když bude autor u Macu.
- Kontroly na GitHubu po opravě v K1 zezelenají až po sloučení větve v Uzavření; do té doby je poslední běh na `main` zrušený.
