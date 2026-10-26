# Plán větve stoicky-tyden: Stoický týden

Architektura slibuje sérii sedmi krátkých cvičení v duchu Zkus to žít, jedno na den, kterou si student spustí po cestě 5, 33 nebo 34 a učitel ji může dát třídě jako týdenní výzvu (`docs/architektura.md` › Stoický týden). Atlas má dnes devatenáct karet Zkus to žít, každá je výzva na týden; žádná neprovede studenta týdnem den po dni. Tahle větev týden postaví: podklady ke cvičením, stránku týdne, propojení s deníkem a místy, odkud se spouští, a list pro učitele. Větev založena z hlavní větve 26. 10. 2026, plán připraven týž den. Rozhodnutí se zapisují do `docs/rozhodnuti.md`.

Proč teď: zkouška se studenty měla jít před týdnem (rozhodnutí 25. a 26. 10. 2026), autor ale zatím studenty nemá. Atlas je zveřejněný s `noindex` a čeká na ně; mezitím pokračuje pořadí z 26. 10. 2026 další větví.

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| P6 | Podklady: sedm cvičení, prameny, citáty, meze, co už atlas má | Sonnet 5.5 · high s vyhledáváním; Opus 5.5 · high u sporných pramenů | zadání níž |
| K | Stránka týdne a deník: nová komponenta podle `atlas-komponenta` | Opus 5.5 · high (xhigh při zaseknutí) | po P6 a odpovědích |
| T | Texty sedmi dnů, úvod, vstupy z cest a profilů, list pro učitele | Opus 5.5 · high se skilly `atlas-psani` a `atlas-cesta` | po K |
| R | Revize větve | Opus 5.5 · high se skillem `atlas-revize` | po T |
| O | Opravy po revizi | Opus 5.5 · high | po R |
| Uzavření | Schválení autorem, sloučení, push hlavní větve (nasadí web) | Opus 5.5 · medium | po O |

## Co už atlas má

- **Dvě cvičení napsaná a ověřená:** večerní ohlédnutí je karta „Tři otázky večer“ v portrétu Seneky (`seneca-vecer`, O hněvu III, 36); představa nejhoršího je „Pět minut, jedna věc“ v cestě 33 (`cesta33-pet-minut`, s mezí proti přemítání z `docs/podklady/celek-10.md`, oddíl h).
- **Citáty v datech, které podklady odložily pro týden:** `rukojet-1-5`, `hovory-v-1`, `rozpravy-iii-2-4`, `hovory-vi-6`; dál `hovory-ii-1` (ranní příprava) a `hovory-ix-30` (pohled shora). Před použitím P6 projde, jestli citát v celku nezazní víc než dvakrát (`atlas-osobnost`).
- **Deník** umí přijmout výzvu (`Vyzva` v `src/lib/denik.ts`: název, odkaz, kdy přijata, poznámka) a spojit deník ze souboru. Dny týdne neumí.
- **Příprava hodiny** umí zastavení z cest, bloků, kapitol a hlasů; týden v ní není.

## Sedm dnů podle architektury

| Den | Cvičení | Kdo | Stav podkladů |
| --- | --- | --- | --- |
| 1 | Ranní příprava na den | Marcus (Hovory II, 1) | citát v datech, cvičení neověřené |
| 2 | Co je v mé moci | Epiktétos (Rukojeť 1) | citát v datech, cvičení neověřené |
| 3 | Představa nejhoršího | Seneca | ověřeno, karta v cestě 33 |
| 4 | Pohled shora na vlastní starosti | Marcus (Hovory IX, 30 a další) | citát v datech, cvičení neověřené |
| 5 | Jeden den skromnosti | Seneca (Dopisy 18 a další) | neověřeno |
| 6 | Večerní ohlédnutí | Seneca (O hněvu III, 36) | ověřeno, karta v portrétu |
| 7 | Zápis do deníku | Marcus jako píšící sám sobě | neověřeno |

Pořadí dnů je z architektury. P6 může navrhnout jiné, kde to má důvod (třeba ohlédnutí jako večerní rytmus všech dnů, ne jen šestého).

## Nad čím jsem váhal

- **Kde týden bydlí.** Stránka směru stoicismus ještě není a karta Zkus to žít je na sedm dnů malá. Navrhuju vlastní stránku `/tyden/stoicky/` se sedmi dny pod sebou, spouštěnou z cest 5, 33 a 34, z portrétů Seneky, Epiktéta a Marca a z deníku; až vznikne stránka směru stoicismus, odkáže na ni. Otázka 1.
- **Týden bez série dní.** Plán atlasu zakazuje série dní a body. Týden proto nesmí trestat vynechaný den: dny nejsou vázané na kalendář, student pokračuje dnem, na kterém skončil, a deník ukáže jen hotové dny a jeho poznámky, žádné „přerušil jsi sérii“. Otázka 2.
- **Dva hotové dny dvakrát.** Den 3 a 6 by mohly jen odkázat na hotové karty, ale student by z týdne odcházel jinam. Navrhuju vlastní krátké znění dne se stejnými citáty a odkaz „celé cvičení je v…“; citáty pak zazní dvakrát, což pravidlo dovoluje. Otázka 3.
- **Učitel.** Týden pro třídu jako zastavení v přípravě hodiny (jeden odkaz, třída ho projde doma) a list `ucitel/stoicky-tyden.md` s tím, jak o cvičeních mluvit po týdnu. Režim třídy čeká na vlastní větev. Otázka 4.

## Co zůstává na později

- **Zkouška se studenty**, až autor studenty bude mít; do té doby `noindex`.
- **Další týdny** (epikurejský, sokratovský) až podle toho, jak se osvědčí tenhle; komponenta má být napsaná tak, aby je unesla bez přestavby.
- `interaktivita-v1`, `antika-doplnky`, skill `atlas-obdobi` a plán středověku (P12) v pořadí z 26. 10. 2026.

## Co rozhodnout před K

Prázdná odpověď znamená souhlas s doporučením.

1. **Stránka `/tyden/stoicky/`** se sedmi dny, vstupy z cest 5, 33, 34, portrétů Seneky, Epiktéta a Marca a z deníku. Doporučuji.
   Odpověď:
2. **Dny bez kalendáře a bez série:** student si týden přijme, každý den označí jako hotový a připíše poznámku; pokračuje, kde skončil, nic se nepočítá jako přerušení. Doporučuji.
   Odpověď:
3. **Dny 3 a 6** s vlastním krátkým zněním a odkazem na celé cvičení v cestě 33 a portrétu Seneky. Doporučuji.
   Odpověď:
4. **Učitel:** týden jako zastavení v přípravě hodiny a list `ucitel/stoicky-tyden.md`. Doporučuji.
   Odpověď:

## Zadání P6

Model: Sonnet 5.5 · high s vyhledáváním; sporná místa Opus 5.5 · high.

```
Pracuješ v repozitáři atlas (/Users/vojtechczempka/Atlas), větev stoicky-tyden. Krok P6 Stoického týdne: podklady k sedmi cvičením se skillem atlas-overeni. Čti jen, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit); archiv nečti.

0. git switch stoicky-tyden, git status bez necommitnutých změn. Přečti CLAUDE.md, docs/pouceni.md, plán větve docs/plany/stoicky-tyden.md celý, v docs/architektura.md oddíl Stoický týden, v docs/podklady/k-overeni.md řádky se slovy „Stoický týden“ a oddíl celku 3, v docs/podklady/celek-10.md oddíly b, e, f a h (představa nejhoršího a její meze).

1. Podkladový list docs/podklady/stoicky-tyden.md podle šablony skillu atlas-overeni, oddíl na každý ze sedmi dnů:
   - pramen cvičení v originále (řecky nebo latinsky) a v českém překladu, který atlas cituje; co je doložené jako stoická praxe a co je pozdější podání (Hadot, moderní stoicismus, terapie);
   - citát pro den: nejdřív hotové citáty v src/data/zdroje.yaml (rukojet-1-5, hovory-v-1, hovory-ii-1, hovory-ix-30, rozpravy-iii-2-4, hovory-vi-6, seneca-ira-iii-36…), u každého kolikrát už v atlasu zazní; nové citáty jen ověřené, s návrhem záznamu do zdroje.yaml;
   - co student ten den udělá (pár minut, bez pomůcek, bez psaní kromě dne 7 a poznámky do deníku) a mez: kdy cvičení přestat (přemítání, smutek, ztráta), jak to říct studentovi bez kázání; u dne 5 i zdraví a jídlo (žádný půst, nic, co by se dalo číst jako omezování jídla);
   - dny 3 a 6: jen co z hotových karet převzít a co zkrátit.
2. Nejsilnější námitka proti týdnu jako celku (stoicismus jako potlačování citů, „stoický klid“ jako lhostejnost) s odpovědí z pramenů; kam ji v týdnu dát.
3. Návrh pořadí dnů s důvodem, pokud se odchyluje od architektury.
4. Otevřené otázky pro autora a řádky do docs/podklady/k-overeni.md (oddíl Stoický týden).
5. Do plánu větve oddíl „Po P6 (datum)“: co je ověřené, co ne, nad čím jsi váhal; „Co rozhodnout po P6“ s doporučeními, pokud je co rozhodnout. Commit ve větvi, nic neposílej na GitHub.
```
