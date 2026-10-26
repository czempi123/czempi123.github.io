---
name: atlas-data
description: Vyplňování a oprava dat osob v Atlasu myšlení (src/data/lide.yaml, vztahy.yaml, mista.yaml, zdroje.yaml) — životní roky, místa s rolí, směr, věty „kdo“ a „proč“, vztahy mezi lidmi se zdrojem a příznak medailonek, který osobě dá stránku. Použij VŽDY, když se mají doplnit nebo opravit údaje o lidech, když se připravuje vlna medailonků (P9), když uživatel řekne „doplň data“, „vyplň medailonky“, „oprav roky“, „přidej vztah“, a když jiný skill (atlas-osobnost, atlas-cesta) potřebuje nový vztah nebo místo v datech.
---

# Data osob v Atlasu myšlení

Data jsou páteř atlasu: z nich se skládá Mapa a čas, Lidé a směry, Doba a lidé na každé stránce i celé stránky medailonků. Co je v datech, student uvidí na pěti místech najednou, proto platí: **každý údaj má pramen, každá věta drží sama o sobě a nic se nevymýšlí.** Tento skill vyplňuje data z pramenů, které už jsou ověřené nebo které ověříš; pramennou práci do hloubky dělá `atlas-overeni`.

## Postup

1. **Přečti** `CLAUDE.md`, `docs/styl.md`, `docs/pouceni.md` a zadání kroku v plánu větve. Pusť `node scripts/medailonky-inventura.mjs` a otevři `Claude outputs/medailonky/inventura.md`: u každé osoby vlny vidíš, co chybí (Chybí) a na co dát pozor (Poznámky).
2. **U každé osoby vlny** si otevři její záznam v `src/data/lide.yaml`, její vztahy (`grep -n '<id>' src/data/vztahy.yaml`) a prameny z jejího pole `zdroje` v `src/data/zdroje.yaml`. Pole `poznamka` u pramene často říká, co v něm stojí; pokud ne, pramen otevři (WebFetch).
3. **Doplň chybějící údaje** podle `references/schema-a-priklady.md`, v tomto pořadí: roky → místa s rolí → směr → vztahy → věty kdo a proč (podle `references/kdo-a-proc.md`) → atribut, jen když ho prameny nesou a ikona už existuje. Každý nový údaj dostane pramen, který jsi skutečně četl.
4. **Nový pramen** zapiš do `zdroje.yaml › prameny` s datem `overeno` (dnešní den) a do `poznamka` stručně napiš, co z něj bereš (roky, místa, vztah). Nový pramen patří i do pole `zdroje` osoby.
5. **Sporné a neověřitelné** nevyplňuj odhadem: zapiš do podkladů vlny (`references/podklady-vlny.md`) a přepni na `atlas-overeni` (oddíl Kdy přepnout níže). Osoba, u které spor zůstal, příznak `medailonek` nedostane a v podkladech má řádek pro autora.
6. **Zkontroluj** testy (oddíl Testy). Až osoba projde, přidej k ní `medailonek: true` (hned pod `hloubka`) a pusť testy znovu.
7. **Zapiš podklady vlny** do `docs/podklady/medailonky-vlna-<n>.md` podle `references/podklady-vlny.md`: co se u koho změnilo, z jakého pramene a co zůstalo otevřené. Commituj česky po osobách nebo po malých skupinách.

## Kdy je osoba hotová (příznak `medailonek: true`)

Hlídá to `tests/data/medailonky.test.ts` (funkce `chybiMedailonku` v `src/lib/medailonek.ts`); přidej příznak, jen když platí všechno:

- **Roky:** `narozen` i `zemrel`, nebo `aktivni` (doba činnosti). Přibližné s `priblizne: true`, horní či dolní mez s `nejpozdeji` / `nejdrive`, rozpětí z pramenů v `rozmezi`.
- **Místa:** aspoň jedno, a mezi nimi rodiště (`narozeni`) nebo místo působení (`pusobeni`). Každé s pramenem.
- **Kdo a proč:** každá jedna věta, nejvýš 25 slov, bez oslovení studenta, s tečkou na konci; proč neopakuje atribut.
- **Vztahy:** aspoň jeden, s typem a pramenem. Medailonek stojí na Době a lidech: kdo nemá vztah, nemá na stránce co ukázat.
- **Prameny:** každé id v `zdroje`, u místa a vztahu existuje v `zdroje.yaml` (hlídá `tests/data/data.test.ts`).
- **Žádný profil:** osoba s vlastním MDX v `src/content/osobnosti/` (i jako `dalsi`) příznak mít nesmí; sestavení se zastaví.
- **Směr** není podmínka: má ho jen ten, kdo ke škole patřil (Aristofanés ani Alkibiadés ho nemají). Id směru musí mít text v `src/content/smery/`.

## Zásady

- **Pramen, ne paměť.** Rok, místo ani vztah nepiš z hlavy, i když ho „víš“. Když pramen nemáš otevřený, údaj nevyplníš.
- **Přibližné značkou, ne slovem.** Nejistotu nese `priblizne`, `nejpozdeji`, `nejdrive`, `rozmezi` nebo `tradovany`. Do vět „kdo“ a „proč“ nepiš „asi“, „snad“, „údajně“.
- **Věty „kdo“ a „proč“ jsou studentský text.** Ukazuje je karta v Mapě a čase a stránka medailonku: konkrétní čin nebo otázka místo hodnocení, žádný nafouknutý význam („položil základy“, „sehrál klíčovou roli“). Zkontroluj je podle skillu `atlas-psani` › Ať text nezní jako stroj.
- **Rok nula neexistuje.** Po 1 př. n. l. (`-1`) následuje 1 n. l. (`1`). Záporná čísla = př. n. l.
- **Narození před úmrtím, pobyt uvnitř života** (u přibližných dat tolerance 10 let), **rok u místa `narozeni` = rok v `narozen`**, u `smrt` = `zemrel`. **Učitel je starší než žák.** Kontroluje `kontrolaCasu` v `src/lib/kontroly.ts`.
- **Současnost nedokazuje setkání.** `znali-se` jen tam, kde pramen setkání popisuje. Kde to tvrdí jen antická tradice (Diogenés Laertios) a moderní prameny pochybují, přidej `tradovany: true`.
- **Nové osoby nepřidávej.** Autor si je přeje až nakonec; když vztah vede k člověku, který v datech není, zapiš ho do podkladů vlny.
- **Nic nemaž** z cizích záznamů a neměň data osob se stránkou (profil, portrét) bez zadání: jejich stránky na datech stojí a texty s nimi musí souhlasit.
- **Jména** v podobě z `lide.yaml` (Sókratés, Zénón z Kitia); `jmeno2` je 2. pád pro věty „život Kleantha“.
- **Tykání v datech ne.** Data se skládají do karet, popisu stránky a mapy, kde oslovení nesedí; tykání patří do textů stránek.

## Prvky z dat

Medailonek nemá text, ale data ano. Prvky, které se skládají jen z dat (Kdo žil dřív? s náhodným současníkem nebo předchůdcem, Dva životy s posuvníkem dvou pruhů na ose, trasa míst podle let), poslouží všem osobám najednou a bez psaní: 34 medailonkům antiky i stovce dalších. Proto drž roky, místa s rolí a `od`/`do` a vztahy úplné i tam, kde je dnešní stránka neukazuje. Narazíš-li při vyplňování na dvojici, u které by takový prvek něco naučil (žili současně a nepotkali se, dělí je staletí a přesto na sebe navazují), zapiš ji do podkladů vlny jako námět. Měřítko: student něco udělá a uvidí myšlenku, kterou by z textu pochopil hůř; ozdoba ani hra na body ne. Prvky staví `atlas-komponenta` (větev `interaktivita-v1`).

## Kdy přepnout na atlas-overeni

- Prameny dávají jiné roky (rozdíl větší než deset let) nebo jiné místo narození.
- Vztah stojí jen na jednom antickém svědectví, nebo ho moderní prameny zpochybňují (a nevíš, jestli stačí `tradovany`).
- Údaj potřebuješ z pramene, který ještě není v `zdroje.yaml`, a není to encyklopedické heslo (SEP, IEP, Britannica), které stačí otevřít a zapsat.
- Chceš do věty „proč“ dát tradovaný příběh nebo citát (citát do dat osoby nepatří vůbec; jde do `zdroje.yaml › citaty` přes atlas-overeni).
- Atribut by potřeboval novou ikonu (není v `docs/design/atributy-ikony.json`): zapiš návrh do podkladů, ikona je práce pro `atlas-komponenta` a autora.

Model: hromadné vyplňování zvládne Sonnet 5.5 · medium s tímto skillem; sporné prameny dej Opus 5.5 · high se skillem `atlas-overeni`.

## Testy

Po každé dávce (osoba nebo malá skupina):

```
npx vitest run tests/data/data.test.ts tests/data/medailonky.test.ts
node scripts/medailonky-inventura.mjs
```

Na konci vlny, když přibyly příznaky `medailonek: true`:

```
npm run build
node scripts/doba-odkazy-vypis.mjs
PW_BEZ_BUILDU=1 npx playwright test tests/e2e/medailonky.spec.ts tests/e2e/doba-odkazy.spec.ts tests/e2e/mini-mapa.spec.ts tests/e2e/mapa.spec.ts
```

`doba-odkazy-vypis.mjs` musí skončit „Chyb: 0“. Nové místo v `mista.yaml` může na mini mapě překrýt popisek: hlídá to `mini-mapa.spec.ts`. Snímky nového medailonku: `VEN="Claude outputs/medailonky" node scripts/snimky-listy.mjs /osobnost/<id>/ <id>-390-light 390 light 3 2000 1` (náhled `npx astro preview --port 4323`). Celé `npm test` jednou před posledním commitem, na pozadí s výstupem do souboru.

## Časté pasti

- **Dvě věty v „proč“**: „Vedl Akademii. Psal o číslech.“ se nevejde; spoj je, nebo vyber to podstatnější. Zkratky „př. n. l.“ a „n. l.“ větu nekončí, test je pozná.
- **„Proč“ opakuje atribut** (Zénón: „Stoikové mají jméno podle sloupoví“ a atribut „sloupoví“): na stránce stojí obojí pod sebou. „Proč“ říká myšlenku nebo čin, atribut předmět.
- **Věta končící zkratkou letopočtu** („…konzul roku 63 př. n. l.“): test ji počítá jako nula vět, protože zkratky větu nekončí. Přeformuluj ji tak, aby poslední slovo nebyla zkratka.
- **Stejné jméno, jiný člověk** (Plútarchos z Athén v BEA o Hypatii, Plútarchos z Chairóneie v datech): vztah zapisuj, až ověříš, o kterého jde.
- **Rok u místa bez `priblizne`**, když ho má osoba přibližný: test `kontrolaCasu` pak hlásí rok mimo život.
- **Vztah opačným směrem.** `ucitel`: `od` je učitel, `k` žák. `vliv-textem`: `od` je ten, koho čtou. `polemika`: `od` je ten, kdo polemizoval.
- **Poznámka u vztahu jako věta.** Píše se malým písmenem bez tečky a sedí na obou stránkách (u polemiky otázka, o kterou šlo: „je člověk měřítkem všech věcí?“).
- **YAML:** text s dvojtečkou nebo uvozovkami dej do uvozovek (`proc: "Svobodu vysvětloval na válci: …"`); jednořádkové záznamy `{ … }` drž v tom tvaru, v jakém jsou.
- **Vzdálené místo** (Kition na Kypru) zvětší výřez mini mapy a zmenší ostatní popisky. Je to v pořádku, jen to zkontroluj na snímku.
