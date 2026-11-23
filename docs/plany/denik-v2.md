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

1. **Pojem v životě** (pojmy, `src/content/pojmy/`, podklady `docs/podklady/pojmy-antika.md`). Situace ze života šestnáctiletého, student volí ze tří pojmů téhož období, který pojem v ní pozná (bez pojmů blízkých správnému, Po T). Situace bere z Párů (herna-v1, `src/lib/herna/pary.ts`, už revidované i s pastmi), jinak z pole `priklad` pojmu, ale jen když pojem nejmenuje (kontrola tvarů z pole `tvary`, stejně jako `prozrazuje` v `src/lib/herna/citaty.ts`). Vysvětlení: celé `vysvetleni` pojmu (Po T).
2. **Hlas k případu** (hlasy na stránkách velkých otázek, `src/content/otazky/`). Úvodní případ otázky a jméno filozofa; student volí ze tří odpovědí hlasů téže otázky, jak by s případem naložil právě on. Nehádá se jméno ani citát: jméno stojí v zadání, rozhoduje porozumění myšlence. Vysvětlení: citát hlasu s údajem (z `zdroje.yaml`).
3. **Obraz a otázka** (kresby, `src/lib/kresby.ts`, a cesty, ve kterých stojí). Název kresby a jedna věta, co v ní student dělal (z kroku cesty); volí, ke které velké otázce obraz patří (bez otázek, na které by odpovídal taky, Po T). Vysvětlení: cesta a její otázka, odkaz zpět do kroku. Jiný druh paměti než slova (pravidlo pestrosti 5).

**Které otázky dostane.** Jen z toho, co student opravdu prošel: z kroků cest v deníku (`cesty[slug].navstivene`) a z navštívených stránek (`navstivene`, `prectene`). Kolo má osm otázek, nejvýš čtyři jednoho druhu, dvě stejného druhu nikdy po sobě. Pořadí je pevné ze semínka (číslo kola), po obnovení stránky stejné. Když prošel méně, kolo je kratší; pod čtyři otázky se kvíz neotevře a místo něj stojí jedna věta s pozváním do první cesty antiky, kterou student nedokončil.

**Co dostane po odpovědi.** Jedna odpověď, pak hned rub: „Víš.“, nebo „Zopakuj si.“, pod tím vysvětlení (jedna až dvě věty z dat) a odkaz zpět na místo, kde to potkal („Zpátky do kroku 3 cesty Kolik je dost?“). Druhý pokus není, protože jde o vybavení, ne o hádání. Konec kola: seznam „Zopakuj si“ jako odkazy, tlačítko „Dát do kartiček“ (přidá je jako kartičky druhu `zustalo`) a „Nové kolo“. Žádný počet.

**Co si odnese do života.** Pozná ataraxii u zprávy, která pípne, a ví, co by jeho problému řekl Epiktétos. A z kartiček se naučí, že co si vybaví po týdnu, to mu zůstane. Úvod oddílu to řekne jednou větou, bez metodických slov.

## 2. Kartičky s rozestupem v deníku

**Co na kartičce je.** Kartičky si student skládá sám; nic do nich nepřibude bez jeho klepnutí. Čtyři zdroje, každý s tlačítkem „Do kartiček“:

| Zdroj | Kde se přidá | Líc | Rub |
| --- | --- | --- | --- |
| Pojem | stránka pojmu `/pojem/<id>/`; v prázdných kartičkách jedno tlačítko „Přidat pojmy, které už znáš“ | pojem a otázka „Co to znamená? Řekni si to vlastními slovy.“ | vysvětlení, příklad, odkaz na místo, kde ho potkal |
| Vystřižený citát | sbírka citátů | autor, dílo a místo, stránka odkud; „Co v té větě říká? Stačí myšlenka, přesná slova ne.“ | citát a studentova poznámka |
| Vlastní zápis | lístek zápisu v kapitole deníku (pravidlo z cesty, odpověď Teď, sebehodnocení) | otázka zápisu; „Vybavíš si svou odpověď?“ | studentova odpověď a „Platí to pro tebe pořád?“ s odkazem, kde ji jde přepsat |
| Co ti zůstalo? | konec kola kvízu | podnět a zadání bez možností | správná odpověď, vysvětlení, odkaz zpět |

Zápis z Volby s `bezDuvodu: true` a zápisy bez textu tlačítko nemají. Když student zdroj smaže (vyndá citát, smaže zápis), kartička tiše zmizí.

**Jak se počítá rozestup.** Pět přihrádek (Leitner). Nová kartička je na řadě hned. „Vím“ ji posune o přihrádku dál, „Zopakuj si“ ji vrátí do první. Dny od posledního opakování podle přihrádky: 1, 3, 7, 16, 35. Počítá se podle místního data, ne podle hodin, aby se kartička nevracela o půlnoci. Na rubu je jen „Vím“, „Zopakuj si“ a „Vyndat z kartiček“.

**Co student vidí.** Oddíl Kartičky v Můj deník (pod Návratem, nad Moje filozofie), jen když nějaké kartičky má. Ukáže **hromádku na dnes**: nejvýš pět kartiček, které jsou na řadě, od nejdéle čekající. Po hromádce „Na dnes stačí.“ a nepovinně „Ještě pět“. Nikde není, kolik čeká celkem, kdy přijde další, ani kolik dní student vynechal. Když nic na řadě není: „Dnes žádná. Kartičky se ozvou samy, až přijde jejich čas.“

**Když student týden nepřijde.** Nic se nestane. Kartičky zůstanou v přihrádkách, hromádka je pořád nejvýš pět a začne těmi, které čekají nejdéle. Žádné upozornění, žádný počet zameškaných, žádný rozdíl v textu. Kdo po měsíci řekne „Vím“, posune se jako kdokoli jindy.

**Tečka na ikoně Deníku** svítí dál jen pro Návrat; kartičky ji nerozsvítí (otázka 1 pro autora).

## 3. Vystřižené citáty

**Co už je** (design-v2, K6): nůžky u citátu na listu (`src/components/ui/Citat.astro`, skript `src/scripts/vystrihnout.ts`), sbírka v kapitole období (`SbirkaDeniku.svelte`), uložení v `citaty` deníku s textem a údaji, nejvýš 60 citátů (nejstarší tiše vypadne).

**Odkud se dají vystřihnout nově.** Pravidlo: nůžky má každý citát ze `zdroje.yaml`, který student vidí celý a který už nic neskrývá. Přibudou u kompaktního citátu (časová osa otázky `HlasyOsa.astro`, Stoický týden), v ostrovech, které citát vykreslí samy (osa hlasů `OsaHlasu.svelte`, strany Sporu), a ve hrách až po odkrytí (rub Kdo to řekl?, hotový Doplň citát). Před odkrytím nůžky nejsou, prozradily by odpověď. Krok K4 nejdřív vypíše všechna místa, kde se citát vykresluje, a k nim, jestli nůžky má.

**Jak vypadají ve sbírce.** Výstřižek: lístek v papíru období, odkud citát je, se střiženým okrajem a páskou (vzor `docs/design.md` › páska), citát v Newsreaderu, pod ním autor, dílo, místo jako odkaz na stránku, odkud ho student vystřihl. Nově **poznámka**: jeden řádek „Proč zrovna tenhle?“, nepovinný, studentovým perem. U každého výstřižku „Do kartiček“ a „Vyndat ze sbírky“. V kapitole období zůstává část sbírky z toho období; nová stránka **Moje sbírka** (`/denik/sbirka/`) ukáže všechny výstřižky pohromadě, nejnovější nahoře.

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
| P6 | Podklady, jen když T narazí na tvrzení, které v ověřených datech není | Sonnet 5.5 · high s vyhledáváním | nebyl potřeba (Po T) |
| T | Texty větve se skillem `atlas-psani` | Opus 5.5 · high | hotovo 23. 11. 2026 (Po T) |
| R | Revize větve se skillem `atlas-revize` | Opus 5.5 · high | **na řadě** (Zadání R) |
| O | Opravy po revizi | Opus 5.5 · high | čeká na R |
| Uzavření | VoiceOver s autorem (je-li u Macu), sloučení, GitHub, kontrola nasazení, plán do archivu | Opus 5.5 · medium | čeká na O |

**Nad čím jsem váhal.**
- *Kvíz jen z prošlého, nebo z celé antiky?* Zvolil jsem prošlé: kvíz se jmenuje „Co ti zůstalo?“ a otázka na něco, co student nepotkal, by ho jen zkoušela. Jinak by šlo doplňovat kolo z celé antiky s větou „tohle tě teprve čeká“.
- *Třetí druh otázky.* Zvažoval jsem vztahy („na koho navázal“) a Kdo by to řekl?. Vztahy vedou k učení jmen a let, Kdo by to řekl? nemá správnou odpověď, jen „Atlas by vybral“. Obraz a otázka cvičí jinou paměť a stojí jen na struktuře atlasu.
- *Automatické kartičky.* Kartičky ze všeho, co student potkal, by narostly v povinnost. Jen klepnutím studenta, s jedinou výjimkou tlačítka „Přidat pojmy, které už znáš“ v prázdném stavu.
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
  vysvetleni: string;    // z dat: vysvětlení pojmu, citát hlasu s údajem (nebo důvod z myšlenky), cesta a otázka
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
Proč zrovna tenhle: <poznámka, jen když ji student napsal>
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

Zápisy Po Plán až Po K4 jsou v `docs/plany/denik-v2-prubeh.md`; sem patří jen poslední zápis, starší se při dalším kroku přesunou tam.

## Po T (23. 11. 2026)

**Co ti zůstalo?** Texty kvízu stojí pohromadě v `TEXTY_ZUSTALO` (`src/lib/herna/zustalo.ts`), ostrov je bere odtud.
- *Úvod oddílu* (`TVOJE_ANTIKA.zustalo.uvod`): „Poznáš Epikúrův klid, když pípne mobil, a víš, co by ti po hádce s kamarádem řekl Epiktétos? Tady zjistíš, co ti z antiky zůstalo a kde najdeš to, co ti vypadlo.“ Mobil je z `priklad` pojmu klid, hádka je případ otázky Jsem svobodný?, na kterou odpovídá i Epiktétos.
- *Zadání:* „Který pojem v tom poznáš?“ (věštírna, tyran ani religionistika nejsou myšlenky; nadtitulek druhu je „Pojem v životě“), „Co by ti na to řekl X?“ beze změny, „Ke které velké otázce ta kresba patří?“ (kresba na otázku neodpovídá).
- *Pozvánka:* „Otázky se tu ptají jen na to, co už z antiky znáš. Zatím by jich bylo málo.“ a odkaz „Projdi cestu …“ (sedí prázdnému deníku i rozjeté cestě). Konec kola beze změny.

**Výpis všech otázek** (`Claude outputs/zustalo-antika.md`) přečtený jako text. Opravy:
- *Situace patří jednomu pojmu.* `blizkePojmy`: pojem, který vysvětlení správného jmenuje, nebo naopak, mezi možnostmi není (slast „je to klid“, v naší moci „naše soudy“). Dřív stál klid se slastí v jedné otázce a soud s v naší moci. Pravidlo jde z dat, takže platí i pro další období.
- *Vysvětlení pojmu* je celé `vysvetleni` (dvě věty) místo první věty a „Najdeš ho u: …“: u slasti teprve druhá věta říká, proč je situace po tréninku slast, a „Najdeš ho u:“ mělo rod pojmu a jména v 1. pádě.
- *Kresby:* `BLIZKE_OTAZKY_KRESEB` (`src/lib/kresby.ts`, s důvodem u každé) drží velké otázky, na které by obraz poctivě odpovídal taky; mezi možnostmi nejsou (jeskyně a Jak poznám, co je pravda?, Třetí čára a Jsem svobodný?…). Strhni masku do kvízu nepřišla: tvář pod maskou svádí ke čtyřem otázkám z pěti. Antika má 67 otázek (kresby 10).
- *Podnět kresby* má název na vlastním řádku („Kresba „Kde je střed?““ bez tečky za uvozovkou). Úseky kroku u Přesýpacích hodin, Třetí čáry, Cesty ven a Roztrhni kartu začínají o větu dřív (doslova z kroku), ať „jeho hodiny“, „každý“ a „každou“ mají k čemu patřit.
- *Vysvětlení kresby:* „Kresba patří k cestě *Kolik je dost?*, která hledá odpověď na otázku *Jak mám žít?*“; krok nese odkaz zpět. Kartička teď vykresluje odstavce přes `radek` (kurzíva).
- *Hlasy, kde citát mluví o jiné části myšlenky než odpověď* (`VYSVETLENI_HLASU`, `zustalo-data.ts`): Parmenidés u duhy dostal B8, 38–41 (`parmenides-b8-jmena`, odpověď je jeho převod), Marcus u Kdo tě zná líp?, Epikúros a Aristotelés u Sklad, nebo tábor? důvod z myšlenky. Ostatní citáty odpovídají.
- *Údaj citátu:* závorka v místě jde do hranatých („Hlavní myšlenky 37 [Diogenés Laertios X, 152]“). Dopis Hérodotovi má v `zdroje.yaml` místo „64 (Diogenés Laertios X, 64)“ jako Dopis Menoikeovi; dřív se četl „Dopis Hérodotovi Diogenés Laertios X, 64“ i na stránce otázky.
- *Hlasy se liší myšlenkou:* prošel jsem všech 41. Nejblíž jsou Seneca a Epikúros u fotky z roku 1926 („s jakou myslí“ × „příjemně a beze strachu“) a Platón a Aristotelés u Kdo tě zná líp? (rozdíl nese přítel); nechal jsem.

**Kartičky** (`TEXTY_KARTICEK`): „Nejdřív si odpověz v duchu, pak kartičku otoč.“; prázdné „Do kartiček si můžeš dát pojem, vystřižený citát nebo vlastní odpověď z cesty. Za pár dní se ti vrátí a uvidíš, co ti z nich zůstalo.“; „Přidat pojmy, které už znáš“; líc citátu „Co v té větě říká? Stačí myšlenka, přesná slova ne.“ a pod údajem „Stránka Epikúros“ (jméno z dat jako přístavek v 1. pádě); „Vybavíš si svou odpověď?“; „Zpátky na místo, odkud je“. Na dnes stačí, Dnes žádná a tlačítka beze změny.

**Sbírka** (`TEXTY_SBIRKY`): pruh „Věty, které tě zastavily.“; perex „Citáty z celého atlasu pohromadě, nejnovější nahoře. Ke každému si můžeš připsat, co pro tebe znamená, a celou sbírku vytisknout nebo stáhnout jako text.“ (věta o prohlížeči pryč, ukládání řeší deník); prázdná „Zatím tu nic není. Až tě v atlasu nějaká věta zastaví, vystřihni ji nůžkami pod citátem.“; poznámka „Proč zrovna tenhle?“, ve staženém textu „Proč zrovna tenhle:“; plná u nůžek „Do sbírky se vejde 300 citátů a teď je plná. Než vystřihneš další, některý z ní vyndej:“ s odkazem, na stránce „Sbírka je plná, vejde se do ní 300 citátů. …“. Titulek, Vytisknout, Stáhnout jako text, Přepsat, Celá sbírka a hlavička textu beze změny.

**Rod.** Mužský tvar zůstal jen v doslovném úseku kroku (Zrcadlo: „Kde jsi byl?“); jinde formulace bez rodu.

**Pro P6: nic.** Žádná věta nepotřebovala nové tvrzení: všechno je z pojmů, hlasů, `zdroje.yaml` a textu kroků.

**Mimo větev, pro R:** mužský rod v textech deníku, které větev nepsala („Koho jsem potkal“ v `SbirkaDeniku`, „Co sis myslel a kdo s tebou stál.“ na Tvoje antika, `PrenosDeniku`); údaj „Dopis z posledního dne Diogenés Laertios X, 22“ má stejný tvar jako Hérodotovi dřív; hlavička staženého textu říká „Atlas myšlení“, záhlaví webu „Agora“.

**Testy.** `zustalo.test.ts` (+5: blízké pojmy, blízké otázky kresby, data antiky bez blízkých dvojic, kresby s blízkými otázkami, vysvětlení hlasu z citátu odpovědi nebo z myšlenky; podnět a vysvětlení kresby), nové znění v `karticky-obsah.test.ts`, `sbirka.test.ts`, `karticky.spec.ts`, `sbirka.spec.ts`, `co-ti-zustalo.spec.ts` a `scripts/snimky-sbirka.mjs`. Vitest 1659 z 1659, dotčené Playwright (co-ti-zustalo, karticky, sbirka, tvoje-antika, denik-kapitoly, snimky) 60 z 60. Celé `npm test` na Macu: kontrola typů bez chyb, Vitest 1659 z 1659, Playwright 928 z 928 (9,2 min). Snímky 390 a 1440 px ve světlém i tmavém režimu: `Claude outputs/denik-v2-T/` (přehledové listy `list-*-390.jpg`).

**Nad čím jsem váhal.**
- *Blízké pojmy z dat, ne ze seznamu.* Vyřadí i dvojice, které by snesly (ctnost a vědění), ale kandidátů je dost a pravidlo se nezapomene. U kreseb to z dat nejde, proto ruční seznam s důvody.
- *Strhni masku mimo kvíz.* Šlo by jí dát jiný úsek kroku, ale obraz sám otázku Má život smysl? nenese.
- *Vysvětlení z myšlenky místo citátu* u tří hlasů: přijde se o živý hlas, ale vysvětlí se odpověď. U Parmenida citát zůstal, jen ten, ze kterého odpověď je.
- *„Proč zrovna tenhle?“* místo „Proč sis ho vystřihl?“: bez rodu a kratší; perex říká „co pro tebe znamená“, aby student nemusel psát jen důvod.
- *„Stránka Epikúros“* místo „stránka: Epikúros“: přístavek v 1. pádě sedí i na cestu („Stránka Kolik je dost?“). „Ze stránky Epikúra“ by potřebovalo pády jmen stránek, které data nemají.
- *Úvod jmenuje Epikúra a Epiktéta:* je to pozvánka, ne slib, že otázky budou o nich.

## Co zůstává na později

- Co ti zůstalo? a kartičky pro další období: každé období dostane svou stránku Tvoje <období> s kvízem ze svých pojmů, hlasů a kreseb. Do skillu `atlas-obdobi` to zapíše `uklid-v1` (spolu s pravidly pestrosti).
- Kartičky z dalších zdrojů (hlas, který byl studentovi nejblíž, Návrat), až je student bude chtít.
- Lístek z cesty pro učitele a odevzdání sbírky ve třídě: `trida-v1` (kurikulum, odpověď 4).
- VoiceOver s autorem z herna-v1 a design-v2 (postup v `docs/archiv/plany/herna-v1.md` › Po O): připojí se k Uzavření této větve, když bude autor u Macu.
- Kontroly na GitHubu po opravě v K1 zezelenají až po sloučení větve v Uzavření; do té doby je poslední běh na `main` zrušený.
