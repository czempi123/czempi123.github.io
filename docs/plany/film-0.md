# Větev film-0: zkouška minutového filmu

Stav, kroky a zadání větve `film-0`. Vzniklo 24. 11. 2026 při Uzavření větve `denik-v2` podle `docs/plany/po-auditu.md` › Větve; celý plán (formáty, kroky, otázky pro autora) napíše krok Plán.

## Proč

Katalog aktivit (`docs/plany/po-auditu.md` › Katalog aktivit, řádek Obraz a pohyb) počítá s minutovým filmem: animovanou scénou s titulky. `film-0` je zkouška na jedné scéně, Augustinových hruškách (Vyznání II). Rozhodne, jestli film dostane každý celek. Autor 12. 11. 2026: atlas má hlavně bavit a cvičit různé druhy paměti; video je jeden z nich.

## Co platí

- **Žádné cizí video.** Vložené video (YouTube) odporuje pravidlu, že atlas nic nenačítá zvenku, a odkazy stárnou. Scéna je vlastní, v kódu, jako animace jeskyně (`src/components/ostrovy/Jeskyne.svelte`, blok `src/components/bloky/Jeskyne.astro`). Hotové video jako soubor zkouší tahle větev taky; jak dobře vyjde, předem nevíme.
- **Bez zvuku.** Poslechni si je odložené na později (rozhodnutí 12. 11. 2026, `docs/rozhodnuti.md`); film nese titulky.
- **Do minuty**, student ho spustí sám, může zastavit a vrátit se; žádné automatické přehrání. Omezený pohyb (`prefers-reduced-motion`), klávesnice a čtečka mají plnohodnotnou podobu (titulky jako text, popis obrazu).
- **Zásada aktivit** (`docs/plany/po-auditu.md` › Zásada): film nesmí nechat studenta jen dívat se. Po něm přijde otázka nebo čin, který zůstane otevřený.
- **Prameny.** Augustin zatím v datech není a podkladový list k němu neexistuje. Titulky stojí jen na ověřeném překladu (skill `atlas-overeni`, krok P6); Augustinovu přímou řeč jen jako citát z pramene. Nová osoba v datech smí vzniknout jen se souhlasem autora.
- **Hotový obsah se nemění.** Zkouška žije v dílně; do celku 11 (cesta 10, `docs/plany/stredovek.md`) se film dostane až s ním.

## Kroky

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| Plán | Plán větve: formát filmu (scéna v kódu, nebo soubor), scénář po záběrech, ovládání, co následuje po filmu, kroky a kritérium, podle kterého se rozhodne o filmech v dalších celcích | Opus 5.5 · high | **na řadě** (Zadání Plán) |

Další kroky (pravděpodobně P6, K1 a další, T, R, O, Uzavření) doplní Plán.

## Otázky pro autora

Doplní krok Plán. Prázdná odpověď znamená souhlas s doporučením.

## Zadání Plán (další krok)

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Založ větev film-0 z main (git switch -c film-0). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíly Bloky, Co se skládá z dat a Technika), docs/plany/film-0.md celý, v docs/plany/po-auditu.md oddíly Zásada, Katalog aktivit, Pravidla pestrosti a Větve a v docs/plany/stredovek.md jen řádky o Augustinovi a celku 11 (grep -n Augustin). Načti skilly atlas-komponenta a atlas-psani. Z kódu čti jen src/components/ostrovy/Jeskyne.svelte a blok src/components/bloky/Jeskyne.astro (jak je postavená dnešní animace) a jak dílna řadí ukázky.

Napiš plán větve do docs/plany/film-0.md: (1) formát: animovaná scéna v kódu (Svelte, SVG nebo canvas), nebo vyrenderované video jako soubor v repozitáři; porovnej velikost, ostrost na 390 a 1440 px, světlý a tmavý režim, omezený pohyb, čtečku a pracnost dalších filmů, a zvol; (2) scénář Augustinových hrušek po záběrech do minuty s titulky; titulky jen z ověřeného překladu Vyznání II, proto naplánuj krok P6 (atlas-overeni) před psaním; (3) ovládání: spustit, zastavit, vrátit záběr, bez automatického přehrání, klávesnice, popis obrazu pro čtečku; (4) co student udělá po filmu podle Zásady aktivit, otevřené a do deníku; (5) kde zkouška žije (dílna, ne hotový obsah) a jak se dostane do celku 11; (6) kritérium, podle kterého autor po zkoušce rozhodne, jestli film dostane každý celek; (7) kroky s modelem a úsilím a celá zadání kroků (při velikosti přes 35 kB do docs/plany/film-0-zadani.md). Otázky pro autora jen na to, co smí rozhodnout jen on (Augustin jako nová osoba v datech, stažení obrázku, sloučení a GitHub); prázdná odpověď = souhlas s doporučením.

Kde si nejsi jistý, zvol nejlepší cestu a zapiš, nad čím jsi váhal. Řádek film-0 v docs/plan-vetve.md. Commit ve větvi film-0, na GitHub nic. Nahraj docs/plany/film-0.md a docs/plan-vetve.md do Projektu Claude. Ve zprávě autorovi: co plán navrhuje, nad čím jsi váhal, otázky a celý prompt prvního kroku po Plánu s modelem a úsilím. Zastav se.
```

## Co zůstává na později

- Zvuk (Poslechni si): odložený, autor ho možná namluví sám (rozhodnutí 12. 11. 2026).
