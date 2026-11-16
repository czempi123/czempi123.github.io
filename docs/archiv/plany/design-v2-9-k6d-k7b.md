# Větev design-v2, část: Deník po obdobích a zadání kreseb

Část plánu větve `docs/archiv/plany/design-v2.md` (oddíl Části plánu). Přesunuto po K7b 15. 11. 2026, aby hlavní soubor zůstal pod 35 kB; text oddílů je beze změny.

## Po K6 dodatku (15. 11. 2026)

Odpovědi po K7a byly prázdné v repozitáři i v Projektu Claude, takže platí všech šest doporučení: kapitoly v deníku **po obdobích**. Snímky jsou v `Claude outputs/snimky/design-v2-k6-dodatek/`.

### Co se v deníku změnilo

- **Nahoře beze změny:** titulek, Návrat, připomenutí zálohy a Moje filozofie po velkých otázkách.
- **Kapitoly** pod Moje filozofie (nadpis Kapitoly): jedna na období, které má stránku a v deníku něco. Kapitola je rozbalovací lístek s páskou v papíru období: rukou „období 2“, název období, léta a „naposledy 14. listopadu 2026“, vpravo vystouplý knoflík se šipkou. Rozbalená pokračuje listem s čárkovaným okrajem v inkoustu období.
- **V kapitole:** Rozpracované (lístky cest a oranžové záložky bloků toho období), Moje odpovědi a stanoviska seřazené podle cest a stránek, Sbírka období (koho jsem potkal, prošlé cesty, vystřižené citáty) a na konci poslední antické kapitoly odkaz Tvoje antika. Nadpis cesty je řádek („cesta · Kolik je dost?“ s odkazem), ne další rozbalování; profil, směr nebo pokus má stejný řádek se „stránka“. Přepínač Podle cest / Podle data je v každé kapitole a platí pro všechny.
- **Napříč obdobími** je poslední kapitola: zápisy ze stránek velkých otázek (první názor, Změnil se?) a z období, které ještě nemá stránku. Úvody Co je filozofie? a Co je náboženství? mají v datech období 1, takže jsou v kapitole Řecko.
- **Která je otevřená:** ta, kde student naposledy byl (zápis, krok cesty, návštěva stránky, kterou atlas zná; deník, Domů a mapa se nepočítají), a k ní ty, které si nechal otevřené. Stav kapitol a řazení si deník pamatuje v `localStorage` pod `atlas-denik-kapitoly` (ne v exportu deníku). Kapitola, kde student byl až po poslední změně stavu, se otevře znovu; zavřená zůstane zavřená, dokud tam student nebude.
- **Prázdná kapitola** se neukazuje; prázdný deník nemá ani nadpis Kapitoly.
- **Dole jednou pro celý deník:** Zkus to žít, přijaté výzvy, hodiny, pero, Záloha a přenos.
- **Kód:** logika `kapitolyDeniku`, `otevreneKapitoly`, `rozeberStavKapitol` a `adresaStranky` v `src/lib/zapisnik.ts` (`zaznamyPodleCest` teď stojí na společném výpisu záznamů); mapa stránek s obdobím a seznam období v `src/components/denik/_zapisnik-data.ts`; ostrov `Denik.svelte`; `SbirkaDeniku.svelte` umí úroveň nadpisu a id kapitoly (v kapitole je oddíl bez oblasti, ať se oblasti nejmenují osmkrát stejně). Popis v `docs/design.md` › Můj deník jako zápisník, rozhodnutí v `docs/rozhodnuti.md`.

### Testy a kontrola

- `npm run build` prošel. Vitest celý (1 397 testů); nový `tests/data/zapisnik-kapitoly.test.ts`: deník prázdný, s jedním a se dvěma obdobími, kapitola Napříč obdobími, kapitola bez záznamů, otevřená kapitola a zapamatovaný stav.
- Playwright: nový `tests/e2e/denik-kapitoly.spec.ts` (prázdný, jedno a dvě období, přepínač podle data po obnovení, klávesnice, zapamatované kapitoly, axe a přetečení na 390 a 1440 px ve dne i v noci se všemi kapitolami otevřenými). Starší testy, které čtou zápisy v deníku (13 souborů), přepnou výpis podle data pomůckou `tests/e2e/denik.ts`; `tvoje-antika` hledá odkaz na konci kapitoly. Dotčené soubory: 202 testů prošlo.
- **Klávesnice:** lístek kapitoly se otevře a zavře Enterem i mezerníkem, Esc nic nezmění a fokus zůstane na lístku, tabulátor jde z lístku dovnitř kapitoly; stav vydrží obnovení (v testu).
- `scripts/kontrola-fokus.mjs` (nově umí `ULOZISTE`) na `/denik/` s prázdným deníkem (19 prvků), plným (52) a plným se všemi kapitolami otevřenými (70), na 390 a 1440 px: bez nálezu.
- **Celé `npm test`** před commitem jednou: kontrola typů bez chyb, Vitest 1 397, Playwright 758 ze 758 (8,8 min; i `ram.spec.ts:85`, který po K6 vypadával).
- **Snímky** (`scripts/snimky-listy.mjs`, plný deník z `tests/e2e/data/denik-kapitoly.json`): `denik-kapitoly-*` na 390 a 1440 px ve dne i v noci (otevřená poslední kapitola), `denik-kapitoly-vse-390-light-1` a `denik-kapitoly-vse-1440-dark-1` se všemi kapitolami otevřenými.

### Nad čím jsem váhal a co by šlo jinak

- **Kam dát zápisy z otázek.** Stránka velké otázky nepatří jednomu období; jejich zápisy jsou v kapitole Napříč obdobími a zároveň (jako dosud) v Moje filozofie. Jinak: kapitolu Napříč obdobími vynechat a nechat je jen v Moje filozofie; zmizel by ale jejich výpis podle data.
- **Rozpracované bloky** (oranžové záložky) jsou v kapitole svého období, ne nahoře. Rozpracovaný blok na stránce otázky je v Napříč obdobími.
- **Přepínač je jeden pro celý deník**, i když stojí v každé kapitole: kdo chce výpis podle data, chce ho všude. Výchozí je podle cest, jak říká zadání.
- **Stav kapitol není v exportu deníku**: je to nastavení pohledu, ne studentova práce. Na novém zařízení se otevře kapitola, kde student naposledy byl.
- **Tvoje antika** stojí na konci kapitoly Helenismus a Řím (poslední kapitola antiky); když ji student nemá, na konci kapitol. Dál vede na ni i odkaz pod Moje filozofie.
- **Nadpis kapitoly je v lístku** (`<h3>` v `<summary>`, HTML to dovoluje), aby šlo v deníku skákat po nadpisech. Jak to čte VoiceOver, ověří revize R.
- **Profily, směry a pokusy** dostaly v kapitole vlastní řádek vedle cest („stránka · Epikúros“), řazený podle poslední návštěvy. Jinak: všechno mimo cesty pod jeden řádek „Stránky období“.

## Co rozhodnout po K6 dodatku

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-k6-dodatek/`). Prázdná odpověď znamená souhlas s doporučením.

1. **Kapitoly po obdobích jako rozbalovací lístky** (snímky `denik-kapitoly-*`): lístek s páskou, období rukou, léta a „naposledy“, knoflík se šipkou, rozbalená kapitola s čárkovaným okrajem. Doporučuji ano.
   Odpověď:

2. **Kapitola Napříč obdobími** na konci pro zápisy ze stránek otázek (snímek `denik-kapitoly-vse-390-light-1`). Doporučuji ano.
   Odpověď:

3. **Výpis podle cest jako výchozí, jeden zapamatovaný přepínač pro všechny kapitoly.** Doporučuji ano.
   Odpověď:

4. **Výzvy, Stoický týden a hodiny zůstávají pod kapitolami pro celý deník** (je jich málo). Jinak: přijaté výzvy do kapitol podle stránky, odkud jsou. Doporučuji nechat.
   Odpověď:

5. **Chceš něco změnit na snímcích po K6 dodatku?** Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání K7b: kresby jako koláž

Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta`. Pusť v novém chatu v Projektu Atlas filozofie, až bude hotový K6 dodatek. Když se krok nevejde do jednoho sezení, udělej nejdřív rám `Kresba.svelte` a polovinu kreseb a zapiš, co zbylo.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K7b větve design-v2, kresby jako koláž. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků a oddíl Části plánu, podle něj z částí oddíly Po D3 (Tokeny pohybu, Pravidla pohybu), Po D4 (Co je na kterých obrazovkách: Kresba; Co se proti design systému změnilo: Kresby jako koláž), Po K1 (přezdívky), Po auditu (Pravidlo střídmosti, Vizuální zlepšení bod 9), Po K7a (Přezdívky), Co rozhodnout po K7a a Co rozhodnout po K6 dodatku s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti celý, jen oddíl Kresba s pohybem. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/KresbaVitr.dc.html jen styly a tělo obrazovky (ne pult náhledu a skript). Když odpovědi po K7a něco mění na mapě nebo odpovědi po K6 dodatku na deníku (Denik.svelte, src/lib/zapisnik.ts), oprav to nejdřív.

1. Rám Kresba.svelte v novém papíru: plátno je tečkovaný papír přilepený na list, ovládání (přepínače, posuvník, Zastavit pohyb) ve vtlačené drážce, popisek pod kresbou. Pravidla kreseb v global.css (k-svetlo, k-stin, k-tma a další) převeď z desky období (--pc-plate, --pc-on-plate) na koláž: výstřižky (--list, --listek, papír období --pp) se stínem výstřižku bez obrysových čar, zem a horizont natržený pruh papíru, směr, pohyb a síly tužkou (--tuzka, čárkovaně), barva období jen na jednom nositeli významu, text v kresbě na lístečku s páskou Kalamem, popisky Instrument Sans; v noci tytéž tokeny (pravidla v Po D4).

2. Všech třináct kreseb (src/components/ostrovy: Jeskyne a ostatní, které Kresba.svelte obaluje, i GrafKrivek.astro) přepiš na koláž. Pohyb jen transform, opacity a tah tužky; s omezeným pohybem kresba stojí a text pod ní říká totéž; po Zastavit pohyb kreslí obsah, ne začátek smyčky (skill atlas-komponenta). Kresba, kterou autor zná jako „úžasnou“ (jeskyně), nesmí ztratit nic z toho, co ukazuje.

3. Obraz ke kapitole (Vizuální zlepšení, bod 9) tam, kde ho nese kresba: atribut nebo předmět kapitoly jako velké vybledlé razítko u nadpisu.

4. Mini mapa a mini osa v profilu (MiniMapa.astro, MiniOsa.astro) v novém papíru jako výstřižek (jako Mapa a čas po K7a: moře šrafované tužkou, vodní linky, pevnina na lístkovém papíře, rámeček), razítka místo mincí; trasy zůstanou ručně kreslené.

5. Přepiš kresby, mini mapu a mini osu na nová jména tokenů (Po K1, tabulka přezdívek): --paper, --surface, --sunk, --rule, --muted, --pc, --pc-tint, --pc-soft, --pohyb, --pohyb-kamera, --r-…, --map-*; co přestanou používat, odškrtni v tabulce přezdívek (část 2 plánu, Po K1). Zapiš, co z přezdívek a tint období po K7b ještě zbývá (po K7a: kresby, mini mapa, mini osa, global.css a nepoužívané ui/Mince.astro a mapa/Mince.svelte); smaže je O.

6. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro kresby, cesty s kresbami, mini-mapa, stranky-osob, dilna a ty, které spadnou), node scripts/kontrola-fokus.mjs na stránkách s kresbami (cesta 3 krok 1, dílna Kresby) a na profilu Sókrata, klávesnicí na dvou výškách okna (ovládání kreseb), jednou se zpomaleným procesorem u kresby s pohybem a posuvníkem, node scripts/snimky-prvek.mjs na každé kresbě ve dne i v noci na 390 a 1440 px a node scripts/snimky-listy.mjs na profilu Sókrata (mini mapa, mini osa). Kontrast nových dvojic výpočtem (krátký skript v scripts/, po výpisu ho smaž; trvalé dvojice přidej do tests/data/kontrast.test.ts). Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po K7b: co se na kresbách změnilo, přezdívky odškrtnuté a zbylé, nad čím jsi váhal, otázky Co rozhodnout po K7b a zadání kroku P v plném znění (podle tabulky kroků). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md a části plánu, které se změnily.

8. Pak se zastav a napiš mi, na které snímky se mám podívat.
```
