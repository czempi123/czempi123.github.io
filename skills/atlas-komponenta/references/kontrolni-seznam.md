# Kontrolní seznam komponenty

## Jednotkové testy (Vitest, `tests/data/`)

- Každá čistá funkce v `src/lib/`: běžný případ, hranice, prázdný vstup.
- Letopočty vždy i přes přelom letopočtu (rok nula neexistuje: po −1 následuje 1).
- Čeština: tvary podle čísla (1 rok, 2 roky, 5 let) a rodu (je mu / je jí), nezlomitelné mezery v letopočtech.

## Průchod v prohlížeči (Playwright, `tests/e2e/`)

- Šířky 390 × 844 a 1440 × 900, světlý i tmavý režim (`emulateMedia({ colorScheme })`), omezený pohyb zapnutý.
- Počkej na hydrataci ostrovu a na písma (`document.fonts.ready`).
- Axe s tagy `wcag2a`, `wcag2aa`, `wcag21aa` bez nálezů.
- Žádné vodorovné posouvání stránky; u celoobrazovkových nástrojů ani svislé.
- Hlavní scénář studenta: pokus → odkrytí → zpětná vazba → uložení; obnovení stránky zachová, co má zachovat.
- Ovládání jen klávesnicí: Tab dosáhne všech prvků ve smysluplném pořadí, Enter/mezerník/šipky dělají, co mají, Escape zavře, co se otevřelo.
- Fokus z klávesnice nezůstane pod pevnou lištou: dolní okraj prvku s fokusem je nad horním okrajem lišty.
- Nic se nepřekrývá: ovládací prvky ani popisky v SVG, na 390 i 1440 px.
- Snímek každé kombinace do `test-results/snimky/<blok>-<sirka>-<svetly|tmavy>.png`.
- Kresba s pohybem: běží a jde zastavit; zastavená hned po načtení ukáže totéž co při omezeném pohybu (test), při omezeném pohybu stojí a nemá tlačítko pohybu; pohledy a posuvník jdou klávesnicí.

## Než řekneš „hotovo“

- `npm run build` a `npm test` prošly celé, ne jen nové testy.
- Snímky jsi viděl a porovnal s `docs/design.md`.
- Texty v komponentě odpovídají `docs/styl.md`; žádná redakční poznámka.
- Popis a API bloku je v `docs/design.md`, rozhodnutí v `docs/rozhodnuti.md`.
