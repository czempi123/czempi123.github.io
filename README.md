# Agora

Interaktivní atlas filozofie pro střední školy, pojmenovaný po athénském tržišti, kde se Sókratés ptal lidí. Od Thaléta, který spadl do studny, protože se díval na hvězdy, až po filozofy dneška.

Atlas vzniká jako závěrečná práce pedagogického minima a jako pomůcka, kterou si studenti mohou projít ve třídě i doma. Nechce jen předat učivo. Chce ukázat, že lidé před námi řešili stejné otázky jako my: čemu věřit, co je v mé moci, kolik je dost, jak žít s druhými. A dát studentovi prostor, aby si na ně začal odpovídat sám.

## Co v atlasu student najde

- **Mapu a čas.** Posuvníkem roku projíždí dějiny; na mapě vidí, kdo právě žije, a pod ní celé životy filozofů. Na první pohled pozná, kdo s kým žil, kdo se od koho učil a kolik let je od sebe dělí.
- **Lidi a jejich příběhy.** Sókratés, který nic nenapsal a přesto změnil filozofii. Epiktétos, otrok, který učil svobodě. Marcus Aurelius, císař, který si psal poznámky sám pro sebe.
- **Velké otázky.** Každá otázka je rozhovor napříč staletími: nejdřív odpovídá student, potom filozofové.
- **Cesty.** Dvacetiminutové interaktivní průchody: příběh, vlastní pokus, setkání s filozofem, silná námitka, nový případ a pozdější návrat.
- **Můj deník.** Soukromé místo pro vlastní stanoviska. Nikdo je nehodnotí; student v nich postupně vidí svou vlastní filozofii.

## Stav

Nová verze vzniká jako statický web v [Astru](https://astro.build) podle plánu v [`docs/plan.md`](docs/plan.md). Hotová je kostra: design systém, ověřená data období 1 a 2, šablona osobnosti na Sókratovi, stránky Domů, Lidé a směry, Otázky, Můj deník a interaktivní Mapa a čas (mapa, posuvník roku, řeka životů, karta člověka). Prvních šest interaktivních bloků je v ukázkové cestě „Kdy mám dobrý důvod věřit?“ a v Sókratově profilu. Dosavadní prototyp (jeden soubor HTML) je v `docs/archiv/` jako verze 9.

| Fáze | Obsah | Stav |
| --- | --- | --- |
| F0 Základ | Archiv, pravidla projektu, průvodce stylem, první skilly, [architektura celé filozofie](docs/architektura.md) | hotovo |
| F1 Design a kostra | Vizuální návrh, web v Astru s ověřenými daty období 1–2 a šablonou na Sókratovi | hotovo |
| F2 Vertikální řez antiky | Mapa a čas v2, portréty, tři cesty, deník, zkoušení se studenty | rozpracováno: Mapa a čas v2 a prvních šest bloků s ukázkovou cestou 1 hotové; další jsou podklady k celku „Jak poznám, co je pravda?“ (P6) |

## Spuštění

Potřebuješ [Node.js](https://nodejs.org) 22.12 nebo novější.

```bash
npm install          # jednou, stáhne závislosti
npm run dev          # atlas poběží na http://localhost:4321 a obnovuje se při každé změně
npm run build        # sestaví web do složky dist/ včetně vyhledávání (Pagefind)
npm run preview      # spustí sestavený web; jen tady funguje hledání
npm test             # kontroly dat a testy v prohlížeči (390 a 1440 px, světlý i tmavý režim)
```

Testy v prohlížeči potřebují jednou `npx playwright install chromium`. Ve vývojovém režimu (`npm run dev`) jsou u Sókrata vidět i osnovy nenapsaných kapitol; v sestaveném webu nejsou. Web zatím běží jen lokálně.

## Uspořádání repozitáře

```text
CLAUDE.md            pravidla projektu (pro lidi i pro Clauda)
docs/plan.md         kritika prototypu, technika, strategie a rozcestník plánů
docs/plany/          plány větví: zadání kroků a stav každého celku
docs/architektura.md období, velké otázky, cesty a osobnosti
docs/design.md       design systém (barvy, písma, komponenty) a podklady v docs/design/
docs/styl.md         průvodce tónem: jak v atlasu psát
docs/rozhodnuti.md   zásadní rozhodnutí a jejich důvody
docs/podklady/       ověřené podklady, co zbývá ověřit, návrhy atributů
docs/archiv/         prototyp v9 a jeho plánovací dokumenty
skills/              postupy pro opakovanou práci (ověřování, revize…)
src/data/            lidé, místa, vztahy, události, období a prameny (YAML)
src/content/         texty: osobnosti, směry, otázky, cesty… (MDX a Markdown)
src/components/      komponenty (ui/, rozvržení, osobnost/, ostrovy ve Svelte)
src/lib/             schémata dat, kontroly, letopočty, mapa, deník
src/styles/          design tokeny a základní styly
tests/               kontroly dat (Vitest) a průchody v prohlížeči (Playwright)
```

Později přibude `ucitel/` s podklady pro hodiny.

## Jak se na atlasu pracuje

Každý obsahový celek projde čtyřmi kroky: podklady s ověřenými zdroji → psaní přímo do atlasu → revize → schválení autorem. Podrobnosti jsou v `CLAUDE.md` a v plánu.

## Licence

- **Texty, data a obrazová úprava:** [CC BY-NC-SA 4.0](LICENSE-OBSAH.md). Atlas smíš používat, sdílet a upravovat pro výuku a další nekomerční účely, pokud uvedeš autora a upravenou verzi sdílíš pod stejnou licencí. Prodávat ho nelze.
- **Zdrojový kód:** [MIT](LICENSE).
- **Převzaté obrázky** mají vlastní licence, uvedené u každého obrázku.

Autor: Vojtěch Czempka
