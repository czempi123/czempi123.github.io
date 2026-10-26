# Atlas myšlení: pravidla projektu

Interaktivní atlas filozofie pro středoškoláky (15–19 let), od antiky po současnost. Slouží ve třídě i k samostudiu doma. Kromě učiva má předávat lásku k filozofii, odvahu hledat vlastní odpovědi, poctivost k sobě a ohled na druhé. Páteří je západní filozofie s okny do islámské, židovské, indické a čínské tradice; součástí je úvod do religionistiky podle RVP G a stoicismus má zvláštní váhu. Autor a pedagog: Vojtěch Czempka.

Než začneš pracovat, přečti si `docs/styl.md` (tón), `docs/pouceni.md` (co se nepovedlo a nemá opakovat) a plán větve, na které pracuješ: `docs/plany/<větev>.md` (zadání kroku, stav, co zůstalo na později); stav a další zadání zapisuj tam. Strategie a rozcestník větví jsou v `docs/plan.md`, období, velké otázky, cesty a osobnosti v `docs/architektura.md`, zásadní rozhodnutí v `docs/rozhodnuti.md` (nové zapiš tamtéž). Co z toho číst a co ne, říká oddíl Co číst a jak šetřit.

## Jak píšeme pro studenty

- **Příběh před pojmem.** Každá osobnost i cesta začíná scénou ze skutečného života nebo silným myšlenkovým pokusem. Tradovaný příběh vyprávěj jako příběh: „Vypráví se, že…“. Vymyšlenou současnou situaci uveď „Představ si…“.
- **Piš přímo a živě.** Studentský text neobsahuje redakční poznámky, výhrady k vlastní práci, metodické popisky ani vysvětlování, proč je něco zpracované tak, jak je. Tvrzení formuluj tak, aby platilo samo o sobě; nejisté datum „kolem roku…“, sporný detail vynech.
- **Pochybnost patří filozofii, ne redakci.** Námitky, spory a otevřené otázky jsou obsah výuky a zůstávají. Pochybnosti o pramenech se řeší v podkladech (`docs/podklady/`), ne v textu pro studenty.
- **Nejdřív student, pak filozof.** Před výkladem vlastní pokus; odpověď a zpětná vazba se odkrývají až po něm.
- **Nejsilnější verze druhého.** Každý filozof i protivník dostane svůj nejlepší argument.
- **Jako dobrá kniha.** Text se má číst sám: otázka táhne dál, informaci nese scéna, úvod řekne, o čem to je a co si student odnese, citát odpovídá na otázku textu a nic nezní jako stroj. Jak na to, drží skill `atlas-psani`.
- **Příklady, které chytnou.** Skutečné příběhy filozofů, klasické myšlenkové pokusy a situace, které teenagery opravdu zajímají (přátelství, strach, láska, sociální sítě, rozhodování o budoucnosti). Ne úřední školní scénky.
- **Osobní rovina je dobrovolná.** Zpětná vazba hodnotí důvody, nikdy souhlas s filozofem. Názory se neznámkují.
- **Úkoly jako otázky:** „Co bys udělal?“, „Který důvod tě přesvědčuje?“, „Změní se tvá odpověď, když…?“

## Co číst a jak šetřit

Každé čtení stojí tokeny. Čti jen to, co potřebuješ ke kroku, na kterém pracuješ:

- **Vždy:** tento soubor, `docs/styl.md`, `docs/pouceni.md` a v plánu větve tabulku stavu a poslední oddíl „Po …“. `docs/plan.md` a `docs/architektura.md` otevři, jen když na ně zadání odkáže, a jen jmenovaný oddíl nebo řádek.
- **Dlouhé soubory po oddílech.** Nejdřív si vypiš nadpisy (`grep -n '^## '`), pak čti jen oddíly, které zadání jmenuje: podkladový list, `docs/podklady/k-overeni.md`, `docs/design.md`, `docs/rozhodnuti.md` (jen záznamy běžícího celku).
- **Archiv nečti.** `docs/archiv/` drží hotové plány větví, záznamy revizí, provedená zadání, starší rozhodnutí a prototyp v9. Otevři ho, jen když tě tam pošle zadání nebo autor. Co se z revizí má dodržovat, je v `docs/pouceni.md`.
- **Vzory střídmě.** Z hotových stránek stačí jedna jako vzor a z ní části, které potřebuješ.
- **Testy:** při práci jen dotčené (`npx vitest run`; po `npm run build` pak `PW_BEZ_BUILDU=1 npx playwright test <soubor>`). Celé `npm test` jednou před posledním commitem.
- **Snímky:** `node scripts/snimky-listy.mjs` složí celou stránku do pár obrázků, `node scripts/snimky-cesta.mjs` vyfotí kroky cesty s odpověďmi i bez nich, `node scripts/snimky-prvek.mjs` jeden blok nebo kresbu a `node scripts/snimky-montaz.mjs` složí několik snímků vedle sebe. Prohlížej tyhle listy, ne jednotlivé obrazovky.
- **Projekt v Claude** drží jen `docs/plan.md`, `docs/architektura.md` a plán běžící větve. Když se některý z nich v repozitáři změní, aktualizuj ho i tam; nic dalšího do projektu nepřidávej.

## České konvence

- Tykáme studentovi. Věty do 25 slov, odstavce do 4 vět.
- Řecká jména s délkami podle české tradice: Sókratés, Platón, Aristotelés, Epikúros, Diogenés, Hérakleitos, Parmenidés, Démokritos, Epiktétos. Závazná podoba každého jména je v datech osob (`src/data/lide.yaml`).
- Letopočty: „399 př. n. l.“, „121 n. l.“, rozpětí „469–399 př. n. l.“ (pomlčka, nezlomitelné mezery). Rok nula neexistuje.
- Uvozovky „takto“, citát s údajem autor, dílo, místo (Marcus Aurelius, Hovory k sobě VI, 30).

## Obsah a zdroje

- Historická tvrzení, citáty a vztahy mezi lidmi pocházejí z ověřených podkladů (skill `atlas-overeni`). Každý citát má v datech dílo, místo a překlad.
- Přímou řeč skutečných osob používáme jen jako citát z pramene. Scény můžeme vyprávět živě, ale bez vymyšlených výroků a myšlenek historických lidí.
- Vztah mezi lidmi má vždy typ: učitel a žák, osobně se znali, vliv přes texty, polemika.
- Učitelské a redakční podklady patří do `ucitel/` a `docs/`, nikdy do studentského obsahu.
- Obrázky jen s ověřenou licencí, zapsanou u obrázku.

## Technika (od fáze F1)

- Astro se statickým výstupem, TypeScript, interaktivní ostrovy ve Svelte, obsah v MDX, data v YAML se schématy.
- `npm run dev` spustí atlas lokálně, `npm run build` sestaví, `npm test` spustí kontroly dat a testy v Playwrightu.
- Písma a ikony lokálně, žádné externí závislosti za běhu. Postup studenta a deník v localStorage s exportem.
- Každou změnu UI ověř v prohlížeči na šířce 390 a 1440 px, ve světlém i tmavém režimu, a ovládáním klávesnicí.
- Web je zveřejněný na GitHub Pages (`https://czempi123.github.io/`): po každém pushi do `main` ho sestaví a nasadí `.github/workflows/pages.yml`. Do konce zkoušky se studenty má každá stránka `noindex` (`src/layouts/Zakladni.astro`), aby atlas nebyl ve vyhledávačích.

## Práce na autorově Macu

- Repozitář je na Macu v `/Users/vojtechczempka/Atlas`. Terminál macOS máš přes Desktop Commander (`start_process`, zsh): pracuj přímo v repozitáři, spouštěj `npm test` a commituj tam. Kopii repozitáře a git bundle použij jen tehdy, když Desktop Commander není k dispozici.
- Linuxový shell Coworku (`device_bash`) vidí složku taky, ale `node_modules` jsou pro macOS: `npm` v něm nespouštěj a nic do `node_modules` neinstaluj.
- Autor nepracuje v Terminálu rád. Když musí něco spustit sám, dej mu jeden příkaz a řekni, co udělá.
- Náhled `npm run dev` (port 4321) běží na pozadí. Po přidání stránky, bloku nebo změně dat ho restartuj (`npx astro dev stop`, pak `nohup npm run dev > /tmp/atlas-dev.log 2>&1 &`), jinak autor uvidí starý stav nebo stránku bez obsahu.

## Workflow a skilly

Celek (velká otázka s cestou a potřebnými profily) prochází kroky: podklady (`atlas-overeni`) → psaní přímo do atlasu (`atlas-cesta`, `atlas-osobnost`, `atlas-data`) → revize (`atlas-revize`) → schválení autorem. Každý text pro studenty se píše i reviduje se skillem `atlas-psani` (čtivost, úvody, citáty, lidský hlas); skilly psaní a revize na něj odkazují. Nová komponenta vzniká se skillem `atlas-komponenta`, nové období se plánuje se skillem `atlas-obdobi`. Zdrojová verze skillů je ve složce `skills/` (používají se uložené v účtu Claude); ty, které zatím chybí, vzniknou podle plánu. Když skill upravíš, uprav i jeho kopii ve `skills/`.

**Bez mezikroku schvalování** (rozhodnutí autora ze 4. 10. 2026). Osnovu ani návrh neposílej předem ke schválení. Kde si nejsi jistý, zvol podle sebe nejlepší cestu, práci dokonči a ve zprávě na konci napiš, nad čím jsi váhal, co jsi zvolil a co by šlo jinak; autor řekne, co změnit. Předem se ptej jen na to, co nejde snadno vrátit nebo co smí rozhodnout jen autor: GitHub a slučování větví, stahování obrázků, nové osoby v datech, mazání. Kde skill nebo starší zadání říká „navrhni autorovi a počkej na odpověď“, platí tohle pravidlo.

**Celek je hotový, když:** má jasnou otázku a úplný průchod, student dostane zpětnou vazbu a nový případ, obsah drží historicky i argumentačně, všechny odkazy a kroky fungují na telefonu i notebooku a text zní jako vyprávění, ne jako posudek.

## Git

Pracuj ve větvích, commity piš česky a stručně (co a proč). Do hlavní větve jde jen schválený celek. Po závěrečné revizi a schválení celku se větev sloučí do hlavní a hlavní větev se pošle na GitHub; jinak na GitHub nic neposílej bez pokynu autora.

## Do atlasu nepatří

Žebříčky, série dní, body za názory, osobnostní testy, AI chat s filozofy (zatím), automaticky se měnící karusely, nekonečný feed.
