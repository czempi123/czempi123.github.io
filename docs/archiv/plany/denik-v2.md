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
| R | Revize větve se skillem `atlas-revize` | Opus 5.5 · high | hotovo 23. 11. 2026 (Po R) |
| O | Opravy po revizi | Opus 5.5 · high | hotovo 23. 11. 2026 (Po O) |
| Uzavření | VoiceOver s autorem (je-li u Macu), sloučení, GitHub, kontrola nasazení, plán do archivu | Opus 5.5 · medium | hotovo 24. 11. 2026 (Po Uzavření) |

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
  moznosti: { id: string; text: string; kdo?: string; zena?: boolean }[]; // tři, pořadí ze semínka; kdo u hlasu (O)
  spravna: string;
  vysvetleni: string;    // z dat: vysvětlení pojmu, citát hlasu s údajem (nebo důvod z myšlenky), cesta a otázka
  obraz?: { svetly: string; tmavy: string; alt: string }; // náhled kresby (O)
  zpet: { href: string; text: string };
  /** kde to student potkal: adresy stránek a „cesta/<slug>/<krok>“ (výběr podle deníku) */
  potkal: string[];
}
```

Stav kola v deníku: `bloky['co-ti-zustalo/antika'] = { kolo: number; poradi: string[]; pozice: number; odpovedi: Record<string, 'vim' | 'zopakuj'>; volby: Record<string, string> }` (K2 přidal zmrazené pořadí kola, pozici a zvolenou možnost pro rub po obnovení). Kvíz neukládá zápis ani aktivitu, jen stav. Otázka má navíc `nazev` (krátký název do seznamu Zopakuj si a do kartičky).

**Sbírka jako text** (`atlas-citaty-RRRR-MM-DD.txt`, UTF-8), jeden výstřižek za druhým, mezi nimi prázdný řádek:

```
Moje sbírka citátů z Agory (<datum stažení>)

„<znění ze zdroje.yaml>“
<autor>, <dílo> <místo>
Proč zrovna tenhle: <poznámka, jen když ji student napsal>
https://czempi123.github.io<stránka, odkud citát je>
```

## Zadání kroků

Celá zadání kroků K1 až Uzavření, s modelem a úsilím, jsou v `docs/archiv/plany/denik-v2-zadani.md`. Krok, který zadání upraví, upraví ho tam.

## Otázky pro autora

Jen to, co smí rozhodnout jen autor. Prázdná odpověď znamená souhlas s doporučením.

1. **Tečka na ikoně Deníku i pro kartičky na řadě?** 12. 11. jsi schválil tichou tečku, když čeká Návrat. Kartičky by ji rozsvěcely skoro denně a z tečky by se stala připomínka povinnosti. Doporučuji ne: kartičky se ukážou až v deníku.
   Odpověď: bez odpovědi = doporučení (K3: tečka jen pro Návrat).
2. **Kartička z vlastního zápisu s „Vím“ a „Zopakuj si“?** Líc se zeptá „Vybavíš si, co jsi napsal?“ a rub ukáže tvé pravidlo. Hodnotí se jen to, jestli si vlastní pravidlo pamatuješ, nikdy pravidlo samo; pravidlo, které si nepamatuješ, tě nevede. Doporučuji ano. Když ne, dostane taková kartička jen „Vrátit za čas“ a „Stačí“.
   Odpověď: bez odpovědi = doporučení (K3: Vím a Zopakuj si).
3. **GitHub z cloudu.** Na Macu git přihlášení ke GitHubu nemá a připojení repozitáře s právem zápisu z cloudu dnes zamítla automatická kontrola oprávnění. Smí Claude v K1 a v Uzavření připojit repozitář czempi123/czempi123.github.io s právem zápisu a poslat `main` sám? Doporučuji ano (zadání K1 to povolení obsahuje). Druhá možnost bez Terminálu: aplikace GitHub Desktop, v ní jednou otevřít složku Atlas a klepnout na Push origin.
   Odpověď: ano, výslovně povoleno (22. 11. 2026); `main` poslaný týž den z cloudu přes git bundle (Po Plán).

## Průběh

Zápisy Po Plán až Po R jsou v `docs/archiv/plany/denik-v2-prubeh.md`; sem patří jen poslední zápis, starší se při dalším kroku přesunou tam.

## Po O (23. 11. 2026)

Opravy šesti nálezů revize (`docs/archiv/revize/denik-v2-2026-11-23.md`). Obě otázky po R zůstaly bez odpovědi, platí doporučení: tlačítko Do kartiček u zápisů z cest Proč se bát smrti? a Co když přijde to nejhorší? zůstává (s opravou nálezu 4) a stažený text má hlavičku „z Agory“. Zápis Po R a otázky po R jsou v `docs/archiv/plany/denik-v2-prubeh.md`.

**Co se opravilo.**
1. *Blízké hlasy.* `BLIZKE_HLASY` v `src/lib/herna/zustalo-data.ts` s důvodem u každé dvojice: Platón × Aristotelés (Kdo tě zná líp?, oba: jsem to, co ve mně myslí), Aristotelés × Epikúros (Může za to?, oba: chvála a trest předpokládají, že je to na nás), Seneca × Epikúros (fotka z roku 1926, oba: délka života nerozhoduje). `otazkyHlasu` blízký hlas vyřadí oběma směry. Výpis znovu: na uvolněná místa přišly jiné hlasy téže stránky (u Aristotela Chrýsippos a Epiktétos) a žádná z nových trojic nemá dvě obhajitelné odpovědi.
2. *Kdo to říká.* Možnost hlasu nese `kdo` (a `zena`). Po odpovědi stojí pod každou možností drobně jméno (popisek, `--ink-2`); u zvolené cizí odpovědi slyší čtečka „(tvoje odpověď, takhle by odpověděl Chrýsippos)“ a viditelné jméno přeskočí. Před odpovědí jména nejsou.
3. *Obraz a otázka.* Náhled kresby v klidovém stavu nad podnětem: dvacet WebP (deset kreseb, světlý a tmavý, 480 px, dohromady 180 kB) v `public/kresby/nahled/`, vyrábí je nový `scripts/nahledy-kreseb.mjs` přes `scripts/snimky-prvek.mjs` (nová proměnná `WEBP`); `<picture>` s `prefers-color-scheme`, `alt` je název kresby. Týž náhled má i líc kartičky z kvízu. Věta, proč obraz k otázce patří, stojí před větou o cestě u sedmi kreseb (`PROC_KRESEB` v `src/lib/kresby.ts`, doslova z kroku nebo závěru cesty; test hlídá, že tam stojí). Kdy je dost?, Loď po prknech a Zrcadlo času ji nemají: v kroku ani v závěru není věta, která by bez okolí obstála.
4. *Kartička ze zápisu.* Na lícu pod otázkou drobně, odkud je („Cesta Proč se bát smrti?“, mimo cestu „Stránka …“), vedle Otočit tiché Vyndat z kartiček (jen u zápisů) a otázka bez posledního pokynu „Napiš…“ (`otazkaBezPokynu` v `src/lib/karticky.ts`).
5. *Platónovy hlasy.* `VYSVETLENI_HLASU` dostal u pěti Platónových hlasů `uvod` z jejich `myslenka`: „V Platónově Faidónu to říká Sókratés v den své smrti:“ (Kdo vlastně jsem?, Má život smysl?), „V Platónově Tímaiovi to říká Tímaios:“, „V Platónově Ústavě to říká Sókratés:“, „V Platónově Ústavě přirovnává Sókratés obec k lodi:“.
6. *Tisk sbírky.* Jen na papíře nad výstřižky „Moje sbírka citátů z Agory · 23. 11. 2026 · Jméno: ________“ (datum tisku, `beforeprint`); „Jméno:“ a linka drží spolu.

Poučení z revize je v `docs/pouceni.md` › Co se skládá z dat. Testy upravené v témže commitu: `zustalo.test.ts` (blízké hlasy, jména, Platón, věta proč, náhledy), `karticky-obsah.test.ts` (zápis odkud a bez pokynu, náhled kresby), `co-ti-zustalo.spec.ts` (jména po odpovědi, čtečka), `karticky.spec.ts` (zápis o smrti: odkud, bez Napiš, Vyndat bez otočení), `sbirka.spec.ts` (tisková hlavička).

**Jak se zkoušelo.** Snímky 390 a 1440 px, světlý i tmavý: `Claude outputs/denik-v2-O/` (`scripts/revize-denik-v2.mjs` rozšířený o hlas se jmény, Obraz a otázka před odpovědí i po ní a kartičku kresby; `snimky-zustalo.mjs`, `snimky-karticky.mjs`), prohlédnuté. `scripts/kontrola-fokus.mjs` s plným deníkem (kapitoly, kartičky zápisu, citátu, pojmu a kresby, kolo s kresbou) na /denik/, /denik/antika/ a /denik/sbirka/, 390 i 1440 px: bez nálezu. Celé `npm test`: kontrola typů bez chyb, Vitest 1666 z 1666, Playwright 930 z 930 (9,3 min).

**Nad čím jsem váhal.**
- *Blízké hlasy oběma směry.* Revize jmenovala jen otázku jednoho z dvojice. Když Platón a Aristotelés říkají totéž, platí to i v Aristotelově otázce, a tak tam Platónova odpověď taky není.
- *Věta proč u Roztrhni kartu má dvě věty* („Otrok a císař se shodli… Epiktétos v tom viděl svobodu, Marcus pevnost.“): svoboda, kvůli které obraz k otázce patří, stojí až ve druhé. U Cesty ven věta začíná „Někdo mu říká…“; podnět mluví o témž vězni taky bez jména, a tak obstojí.
- *Bez věty proč nechávám tři kresby.* Loď by unesla „Loď je věc… U člověka na téže otázce záleží víc.“, ta ale stojí v pátém kroku, ne v kroku kresby ani v závěru. U Zrcadla času by každá věta z kroku byla o smrti vytržená z okolí. Kdy je dost? má jen věty s „podle něj“ bez jména.
- *Náhled i na kartičce.* Revize vytkla, že „tři karty z koše Zčásti“ po týdnech bez obrazu nedávají smysl; kartička kresby z kvízu má proto týž náhled.
- *Vyndat na lícu jen u zápisů.* U pojmu a citátu není co minout; víc tlačítek na lícu by z kartičky dělalo formulář.
- *„Cesta …“ jen u zápisu.* Citát vystřižený v kroku cesty má dál „Stránka Proč se bát smrti?“. Sjednotit by šlo jedním řádkem, ale revize to nežádala a test citátu drží dnešní znění.
- *Náhled z telefonu.* Plátno je vyfocené na 390 px, kde má kresba největší popisky, a zmenšené na 480 px; na stránce je nejvýš 20 rem široké. Ostrov kresby by stránku zatížil (rozhodnutí z R).

## Otázky pro autora (po O)

Prázdná odpověď znamená souhlas s doporučením.

1. **Schvaluješ větev denik-v2 ke sloučení do main a poslání na GitHub?** Doporučuji ano; Uzavření pak větev sloučí, pošle `main` na GitHub, zkontroluje nasazení a plán přesune do archivu.
   Odpověď: bez odpovědi = souhlas (Uzavření 24. 11. 2026).

## Zadání Uzavření (další krok)

Opus 5.5 · medium, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander), větev denik-v2. Přečti CLAUDE.md a v docs/archiv/plany/denik-v2.md oddíly Kroky, Otázky pro autora, Po O (s odpovědí autora) a Co zůstává na později, v docs/archiv/plany/denik-v2-prubeh.md oddíl Po Plán. Nejdřív se autora zeptej, jestli je u Macu: když ano, projdi s ním VoiceOverem postup z docs/archiv/plany/herna-v1.md › Po O (design-v2, herna-v1) a k němu Co ti zůstalo?, kartičky a Moje sbírku; nálezy oprav, nebo zapiš na později. Když ne, VoiceOver vynech a zapiš to.

Když autor v Po O větev schválil (prázdná odpověď = souhlas): git merge --no-ff denik-v2 do main, celé npm test na main na pozadí. Push: git fetch; main pošli na GitHub stejně jako v Po Plán (git bundle přes Claude outputs, push z cloudu; autor to výslovně povolil, otázka 3); když push nejde, nic dalšího nezkoušej a zapiš to. Po pushi kontrola nasazení: běh kontrol přes api.github.com/repos/czempi123/czempi123.github.io/actions/runs a nasazený web na 390 a 1440 px (ZAKLAD=https://czempi123.github.io node scripts/snimky-listy.mjs pro /denik/antika/, /denik/sbirka/, /denik/ a jednu stránku pojmu) do Claude outputs/; když dosud neproběhla kontrola z herna-v1, udělej ji taky a dopiš ji tamtéž. Plán větve přesuň do docs/archiv/plany/denik-v2.md (i se zadáním a průběhem: denik-v2-zadani.md, denik-v2-prubeh.md), záznam revize do docs/archiv/revize/, oprav odkazy (grep), řádek denik-v2 v docs/plan-vetve.md, dopiš Po Uzavření. V Projektu Claude nahraď plán větve plánem další větve film-0 (docs/plany/film-0.md s prvním zadáním podle po-auditu.md › Větve) a nahraj docs/plan-vetve.md. Ve zprávě autorovi: co se sloučilo a nasadilo, co zůstalo na později a celý prompt prvního kroku film-0 s modelem a úsilím. Zastav se.
```

## Po Uzavření (24. 11. 2026)

1. **VoiceOver:** neproběhl. Autor nebyl u Macu (odpověď „Ne, vynech VoiceOver“). Postup z `docs/archiv/plany/herna-v1.md` › Po O spolu s Co ti zůstalo?, kartičkami a Moje sbírkou zůstává na později (Co zůstává na později).
2. **Sloučení:** odpověď na otázku po O zůstala prázdná, tedy souhlas. `git merge --no-ff denik-v2` do `main` (commit `cb4a57e` „Sloučení větve denik-v2: deník se sbírkou a kvízem“). Celé `npm test` na `main`: kontrola typů bez chyb, Vitest 1 666 z 1 666, Playwright 930 z 930 (10,0 min).
3. **GitHub:** `main` poslaný z cloudu stejně jako v Po Plán (git bundle přes složku `Claude outputs`, push z cloudové kopie); na GitHubu byl předtím `fd86def`. Výsledek kontrol a nasazení je v bodě 5.
4. **Archiv:** plán, zadání a průběh v `docs/archiv/plany/denik-v2.md`, `denik-v2-zadani.md` a `denik-v2-prubeh.md`, záznam revize v `docs/archiv/revize/denik-v2-2026-11-23.md`; odkazy v nich a v `docs/archiv/plany/herna-v1.md` opravené, řádek v `docs/plan-vetve.md`. Kontrola nasazení herna-v1 proběhla už 22. 11. 2026 (Po Plán), znovu se nedělala.
5. **Nasazení:** doplní se po pushi.
6. **Další větev:** `film-0` (`docs/plany/po-auditu.md` › Větve), soubor `docs/plany/film-0.md` se zadáním prvního kroku (Plán).

## Co zůstává na později

- Co ti zůstalo? a kartičky pro další období: každé období dostane svou stránku Tvoje <období> s kvízem ze svých pojmů, hlasů a kreseb. Do skillu `atlas-obdobi` to zapíše `uklid-v1` (spolu s pravidly pestrosti).
- Kartičky z dalších zdrojů (hlas, který byl studentovi nejblíž, Návrat), až je student bude chtít.
- Lístek z cesty pro učitele a odevzdání sbírky ve třídě: `trida-v1` (kurikulum, odpověď 4).
- VoiceOver s autorem z herna-v1, design-v2 a denik-v2 (postup v `docs/archiv/plany/herna-v1.md` › Po O, k němu Co ti zůstalo?, kartičky a Moje sbírka): neproběhl ani v Uzavření denik-v2. Připojí se k Uzavření `film-0`, když bude autor u Macu.
- Mužský rod v ostatních textech atlasu (oslovení, zpětné vazby, kroky): revize obsahu (fáze 5), jedno rozhodnutí pro celý atlas (R).
- Trvalá stopa stránek otázek v deníku (Po K2) a data kartiček ve sdíleném souboru místo na stránce deníku (Po K3): až budou vadit, nejpozději `uklid-v1` (R).
- Věta, proč obraz k otázce patří, u kreseb Kdy je dost?, Loď po prknech a Zrcadlo času (`PROC_KRESEB`): v kroku ani v závěru cesty taková věta není. Až se budou cesty revidovat (fáze 5), stojí za to ji tam napsat (O).
