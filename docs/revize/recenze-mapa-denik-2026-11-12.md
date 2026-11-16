# Recenze Mapy a času a Mého deníku

12. 11. 2026 · Fable 5.2 · stav `main` (8f6cfc0) a větev `design-v2` po K3 (mapa a deník v ní ještě nový vzhled nemají)

**Otázka:** jsou oba nástroje dobře navržené z funkčního a vzdělávacího hlediska, jsou přehledné a přidávají hodnotu?

**Jak jsem četl:** snímky Mapy a času na 1440 a 390 px (rok 360 př. n. l.), snímky deníku a stránky Tvoje antika na 390 px, a kód obou (`src/components/mapa/`, `Denik.svelte`, `TvojeObdobi.svelte`, `src/lib/denik.ts`). Živě jsem neklikal: kartu člověka, Přehrát život, Změř vzdálenost, Přehled a Návrat znám z kódu a z plánu, ne z obrazovky. Snímek deníku je s testovacími daty (místo otázek v něm stojí id); v kódu záznam nese znění otázky.

## Verdikt

Oba nástroje jsou poctivě postavené a mají dobrý základ. Oběma chybí totéž: **úkol**. Mapa je přístroj, u kterého student neví, co má zjistit. Deník je sklad, do kterého nemá proč chodit. A to nejcennější, co deník umí (Na začátku × Teď a Kdo to viděl podobně jako ty), je schované za jednou kartou.

## Mapa a čas

**Co je silné:** zásada „na mapě je jen ten, kdo ten rok žije“, dějinné události nad posuvníkem, stav v adrese (jde poslat odkaz na rok a člověka), přehledné rozvržení na telefonu (mapa, rok, dvě záložky), Přehrát život a Změř vzdálenost.

| # | Nález | Proč to vadí | Návrh |
| --- | --- | --- | --- |
| 1 | **[zásadní] Nástroj bez úkolu.** Stránka říká „V roce 360 př. n. l. žije 13 lidí z atlasu. Klepni na minci…“ a dál nic | student si pohraje s posuvníkem a odejde; nic si neodnese a nemá o čem přemýšlet | **Výpravy:** tři až pět otázek na období, na které odpoví jen mapa („Kdo z nich mohl potkat Sókrata?“, „Kde žilo roku 300 nejvíc filozofů a proč asi tam?“). Student nejdřív tipne, pak si to na mapě ověří; odpověď jde do deníku |
| 2 | **[důležité] Co mapa umí ukázat nejlíp, musí student objevit sám:** kdo žil současně, jak daleko od sebe a kudy se myšlení stěhovalo | hlavní poznatek zůstane neviděn | **Přehrát období:** minuta, kdy rok běží sám, těžiště se stěhuje z Milétu do Athén, Alexandrie a Říma a události se hlásí titulkem. Hotové pohledy („Athény 399“, „Tři generace“) |
| 3 | **[důležité] Řeka životů je nejcennější a nejhůř čitelná část.** Drobné písmo, pět druhů čar mezi životy, barvy pruhů bez legendy (barva je období, šedý pruh znamená „ten rok nežije“), vlnovky na okraji | pět kódů naráz nepřečte ani dospělý | výchozí jen učitel a žák, ostatní čáry po zapnutí; větší řádky; legenda barev; po výběru člověka zvýraznit jeho současníky a ostatní ztlumit |
| 4 | **[důležité] Pravý panel na notebooku je většinu času prázdný** a ukazuje pět lidí z třinácti, kteří ten rok žijí | nejlepší místo obrazovky nic neříká | bez vybraného člověka: co se ten rok dělo, jedna výprava a všichni žijící |
| 5 | **[důležité] Mapa nezná studenta.** Neukazuje, koho už potkal a koho ne (původní plán sliboval, že se mapa bude vybarvovat) | chybí důvod se vracet a chuť „doplnit si“ zbytek | razítko u lidí, jejichž stránku nebo cestu má student za sebou; „ještě jsi nepotkal“ |
| 6 | **[důležité] Místa nic neznamenají,** mapa nese jen lidi | prostor se pamatuje podle toho, co se kde stalo | klepnutí na město: co tu bylo. Hračka **Čtyři školy v jednom městě:** plán Athén s Akademií, Lykeiem, Stoou a Zahradou |
| 7 | [drobné] „Stín odkazu“ je název, který potřebuje vlastní otazník | ovládání, které se musí vysvětlovat | „Ukázat i ty, na které někdo navazuje“ |
| 8 | [drobné] Na telefonu se popisky překrývají (měřítko přes Středozemní moře, jména přes názvy krajů) | působí neuklizeně | K7a |
| 9 | [drobné] Na první pohled devět ovládacích prvků | první návštěva je zahlcená | poprvé jen mapa, rok a jedna výprava; zbytek pod „Víc“ |

## Můj deník

**Co je silné:** soukromí bez účtu, nic se nehodnotí, ukládá se samo, jde stáhnout a nahrát. Na začátku × Teď je nejlepší vzdělávací prvek atlasu vedle cest: student vidí, že se jeho názor pohnul. Návrat po několika dnech je správná myšlenka.

| # | Nález | Proč to vadí | Návrh |
| --- | --- | --- | --- |
| 1 | **[zásadní] To nejcennější je schované.** Hlavní stránka je výpis záznamů podle data; Tvoje antika je za malou kartou „Na konci období“ | student, který deník otevře, vidí sklad vět, ne sebe | hlavní pohled deníku je **Moje filozofie** po velkých otázkách (na začátku, teď, kdo stál se mnou); výpis podle data až druhý |
| 2 | **[důležité] Deník nemá důvod k návštěvě.** Nic v něm viditelně neroste a Návrat se nabízí jen tam | kdo deník neotevře, Návrat nikdy neuvidí, a tím padá i dlouhodobé zapamatování | sbírka (razítka, pahýly lístků, vystřižené citáty; už v plánu K6) a tichá tečka u ikony Deník, když čeká Návrat |
| 3 | **[důležité] Zrcadlo ukazuje jen spojence** a opakuje dlouhé texty z posledního kroku cesty | potvrzuje, místo aby podněcovalo | spojenci krátce jako razítka s důvodem na rozkliknutí; k tomu **Kdo by ti nejvíc odporoval** s jednou větou a odkazem. Nikdy nálepka („jsi stoik“), vždy „v téhle otázce jsi odpověděl podobně jako…“ |
| 4 | **[důležité] Záznam je věta bez souvislosti:** otázka, odpověď, datum | za měsíc student neví, kde a proč to napsal | záznam jako lístek: cesta, krok, co jsi zvolil a co jsi k tomu napsal; záznamy seskupené podle cesty |
| 5 | **[důležité] Deník žije v jednom prohlížeči.** Telefon a školní počítač jsou dva deníky; smazaná data prohlížeče jsou konec | ztráta deníku je ztráta všeho, co drží studenta u atlasu | přenos odkazem nebo kódem QR (jako u hodiny), připomenutí zálohy po dokončené cestě |
| 6 | [drobné] Nedá se hledat ani třídit | po třech obdobích bude dlouhý | podle otázek a období |
| 7 | [drobné] Z deníku nic nevznikne | práce v něm nemá výsledek, který by šel ukázat | na konci období **Moje filozofie na jednu stránku** k vytištění nebo jako obrázek; kdo chce, ukáže ji učiteli |

## Poučení

1. **Nástroj potřebuje úkol.** Každý pohled, který není text (mapa, osa, deník, přehled), začíná otázkou, na kterou odpoví, a končí krokem dál.
2. **Nejcennější věc je první obrazovka,** ne karta pod čarou.
3. **Atlas má znát studenta.** Mapa i deník ukazují jeho stopy: koho potkal, co si myslel, kam se posunul.
4. **Jedna vrstva naráz.** Výchozí pohled má jedno kódování; další se zapínají.
5. **Zrcadlo ukáže i protivníka.** Kde atlas říká „tohle si myslíš“, řekne taky, kdo by nesouhlasil a proč.
6. **Co student udělal, má někam vést:** do sbírky, na jednu stránku, k Návratu.
