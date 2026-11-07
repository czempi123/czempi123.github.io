# Větev design-v2: úprava designu

Nový vzhled atlasu ve stylu scrapbooku s prvky neumorfismu a krátké vysvětlení pojmu po najetí na slovo v textu (třeba „ontologie“). Přání autora z 1. 11. 2026; ladí se společně s ním. Podle rozhodnutí z 7. 11. 2026 běží ještě před prvním celkem středověku. Větev založena 7. 11. 2026, plátno se směry: https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ

**Proč teď.** Středověk přinese nové šablony a bloky (stránka období, Úryvek s otázkou, Dialog, Kolo Štěstěny) a hodně pojmů. V novém stylu vzniknou jen jednou a nebudou se předělávat.

## Kroky

| Krok | Co | Model | Stav |
| --- | --- | --- | --- |
| D1 | Tři směry na plátně: profil Sókrata na notebooku a krok 2 cesty 1 na telefonu; po odpovědích autora jejich spojení | Opus 5.5 · high se skillem `frontend-design` | hotovo 7. 11. 2026, spojení 7. 11. 2026 |
| D2 | Ladění zvoleného směru: Domů, Mapa a čas, profil a krok cesty na notebooku i telefonu, tmavý režim, barvy všech období, kresba a pojem; návrh tokenů | Opus 5.5 · high se skillem `frontend-design`, společně s autorem | čeká na odpovědi po spojení |
| D3 | Tokeny a komponenty v kódu: papír, plochy, stíny, písma, hlavička, karty, tlačítka, bloky, deska, kresby; `docs/design.md` | Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta` | čeká |
| D4 | Pojmy po najetí: kolekce `pojmy`, komponenta Pojem (najetí myší, fokus z klávesnice, klepnutí na telefonu), stránka `/pojem/<id>/`, první pojmy z antiky s podklady | podklady Sonnet 5.5 · high (`atlas-overeni`), komponenta Opus 5.5 · high (`atlas-komponenta`), texty `atlas-psani` | čeká |
| R | Revize: vzhled na všech typech stránek, kontrast AA, tmavý režim, omezený pohyb, klávesnice, snímky na 390 a 1440 px | Opus 5.5 · high se skillem `atlas-revize` | čeká |
| O | Opravy po revizi, úprava `docs/design.md` a skillu `atlas-komponenta` | Opus 5.5 · high | čeká |
| Uzavření | Sloučení a GitHub po schválení autorem | Opus 5.5 · medium | čeká |

**Proč v tomhle pořadí.** Nejdřív obraz, pak kód: směr a tokeny se ladí na plátně, kde se dají měnit za minuty. Pojmy přijdou až na novém stylu, protože bublina a poznámka na okraji jsou jeho součást.

## Co už atlas má

- `docs/design.md`: schválený návrh P1 (29. 9. 2026), papír a pigment, Newsreader a Instrument Sans, bez stínů; plátno P1 https://claude.ai/artifact/YVzSX5emgdTG3U4V8sr9Mu.
- Barvy osmi období se čtyřmi tokeny (`docs/design.md` › Barvy), ornamenty pásu období, ikony atributů.
- Kolekce `src/content/pojmy/` je prázdná (jen `_README.md`); typ stránky Pojem je v `docs/plan.md` › Informační architektura („také jako vyskakovací bublina v textu“).

## Obsah větve

### D1: tři směry

Na plátně je každý směr v jedné řadě: profil Sókrata (hlavička s deskou, vstupy cest a otázek, začátek textu s pojmem, citát) a krok 2 cesty 1 na telefonu (Volba, pojem po klepnutí, pole pro důvod). Možnosti ve Volbě a pojem na telefonu jdou na plátně v Play zkusit. Písma, barvy období, rozvržení a obsah se neměnily.

- **A Cestovní deník.** Tečkovaný papír jako zápisník. Fotka přilepená páskou v barvě období, razítko období místo nadtitulku, druhý řádek titulku a poznámky rukou (Kalam). Cesty jsou lístky s odtrhávacím pahýlem (kroky a minuty), otázky jsou vtlačené do papíru, zvolená možnost je vtlačená a zakroužkovaná. Pojem má vlnité podtržení tužkou a vysvětlení rukou na okraji; na telefonu lístek po klepnutí.
- **B Slepotisk.** Jeden šedobílý papír a všechno do něj vytlačené. Co jde zmáčknout, je vystouplé; co je zvolené nebo aktivní, je vtlačené. Druhý řádek titulku je jen vytlačený, bez inkoustu; portrét leží ve vtlačené jamce v duotónu. Pojem má tečkované podtržení v barvě období a vystouplou bublinu.
- **C Koláž.** Balicí papír a vytržené bílé listy s roztřepeným okrajem. Titulek na vytrženém listu a pruh papíru v barvě období, cesty připíchnuté špendlíkem, fotka se sponkou. Neumorfismus jen v ovládání: otázky vystouplé z balicího papíru, tlačítka. Pojem má zvýrazňovač a žlutý lístek na okraji.

## Nad čím jsem váhal

- **Scrapbook a neumorfismus jdou proti sobě:** jeden je papír, lepidlo a nedokonalost, druhý měkké plastové ovládání. Spojuje je papír: neumorfismus jako slepotisk (vystouplý a vtlačený papír) a scrapbook jako to, co je na papír nalepené. Pro všechny tři směry platí totéž pravidlo: vystouplé jde zmáčknout, vtlačené je zvolené.
- **Dnešní krémový papír s terakotou** je vzhled, který dnes mají tisíce generovaných webů. Všechny tři směry ho mění: šedší tečkovaný papír, šedobílý papír, balicí papír.
- **Ručně psané písmo** jen na poznámky a jednu větu titulku, nikdy na text kapitol ani na ovládání. Kalam (A) i Shantell Sans (C) mají celou češtinu.
- **Přístupnost:** neumorfismus mívá slabý kontrast. Text v návrzích drží AA; hranici tlačítka nese stín, a proto D3 přidá viditelný fokus a tvar, který nestojí jen na stínu. Tmavý režim a omezený pohyb až v D2.
- **Pojem na telefonu** se otevírá klepnutím (najetí tam není), z klávesnice fokusem; „Celý pojem“ vede na stránku pojmu.

## Co zůstává na později

- Mapa a čas, kresby a ornamenty pásu období v novém stylu (D2).
- Tmavý režim zvoleného směru (D2).

## Co rozhodnout po D1

Prázdná odpověď znamená souhlas s doporučením.

1. **Který směr?** Doporučuji A Cestovní deník a z B pravidlo vystouplé a vtlačené. Drží slovník atlasu (cesty jako lístky, Můj deník, razítko období), dlouhý text zůstává klidný a scrapbook je vidět hlavně v hlavičkách, fotkách a poznámkách. B se od dneška liší málo a C je hlasitý: na dlouhé čtení unavuje. Míchat jde i jinak (třeba koláž jen na Domů).
   Odpověď (7. 11. 2026): u každého se mi něco líbí. A je nejlepší jako celek, hlavně části dál v průchodu a lepky; z B navigace v záhlaví a část Proč kalich; z C popis jména („Sókratés.“ a „Muž, který se ptal.“).

2. **Ručně psané písmo:** Kalam, Shantell Sans, nebo žádné? Doporučuji Kalam, jen na poznámky a jednu větu titulku.
   Odpověď (7. 11. 2026): písmo se mi nejvíc líbí u A.

3. **Pojmy:** vysvětlení na okraji na notebooku, lístek po klepnutí na telefonu a vlastní stránka pojmu? Doporučuji ano.
   Odpověď:

4. **Co ti na plátně chybí nebo vadí?** Cokoli od barvy papíru po jednotlivý prvek; komentář jde napsat přímo na plátno.
   Odpověď:

## Po D1: spojení (7. 11. 2026)

Podle odpovědí je na plátně nová první řada Spojení (profil Sókrata a krok cesty); směry A, B a C zůstaly pod ní pro srovnání.

- **Z A:** tečkovaný papír, fotka a citát přilepené páskou v barvě období, razítko období, cesty jako lístky s pahýlem, otázky vtlačené do papíru, čtení s pojmem na okraji, na telefonu karta s páskou, lístek pojmu, zakroužkovaná vtlačená možnost a linkované pole.
- **Z B:** záhlaví (aktivní vstup a hledání vtlačené, Můj deník vystouplý) a Proč kalich (ikona ve vtlačeném kolečku, tučná otázka a text). Na telefonu horní lišta: vystouplé tlačítko zpět a Odejít, postup ve vtlačené drážce.
- **Z C:** jméno na vytrženém bílém listu a pod ním pruh papíru v barvě období s větou o člověku. Na telefonu stojí na vytrženém listu i nadpis kroku.
- **Písmo z A:** Newsreader na nadpisy a čtení, Kalam na poznámky, lístky a pruh se jménem, Instrument Sans na ovládání a popisky.

**Nad čím jsem váhal**
- Pruh pod jménem je v C psaný Newsreaderem kurzívou. Protože se ti písmo nejvíc líbilo u A, je v pruhu Kalam; jde vrátit jedním řádkem.
- Razítko období zůstalo nad jménem. Vytržený list a pruh jsou pak tři prvky nad sebou; bez razítka by období a roky musely jinam (třeba pod pruh rukou).
- Proč kalich má písmo z B (Instrument Sans), ne rukou jako v A, aby se nepletl s poznámkami na okraji.

## Co rozhodnout po spojení

Prázdná odpověď znamená souhlas s doporučením.

1. **Pruh se jménem psaný rukou (Kalam), nebo kurzívou jako v C?** Doporučuji rukou.
   Odpověď:

2. **Razítko období nad jménem nechat?** Doporučuji nechat; říká období a roky dřív, než student začne číst.
   Odpověď:

3. **Co ještě doladit?** Cokoli na plátně; komentář jde napsat přímo k prvku.
   Odpověď:

## Zadání D2: ladění zvoleného směru

Opus 5.5 · high. Pusť v novém chatu v Projektu Atlas filozofie, až vyplníš odpovědi po spojení (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok D2 větve design-v2, ladění zvoleného směru na plátně. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, v plánu větve docs/plany/design-v2.md tabulku kroků, oddíly D1, Co rozhodnout po D1, Po D1: spojení, Co rozhodnout po spojení s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. V docs/design.md jen Principy, Barvy, Typografie a Mezery, mřížka, tvary. Načti skill frontend-design. Přečti moje komentáře na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ.

1. Zvolený směr je Spojení (první řada plátna, soubory project/Spojeni.dc.html a project/Spojeni-telefon.dc.html). Na plátno přidej jeho řadu se skutečným obsahem atlasu: Domů (podle src/pages/index.astro), Mapa a čas, profil Sókrata a krok cesty, na notebooku (1280) i telefonu (390), ve světlém i tmavém režimu. Ukaž i stránku období jiné barvy (Helenismus a Řím), jednu kresbu (Loď po prknech) a pojem zavřený i otevřený. Zapracuj moje odpovědi a komentáře.

2. Navrhni tokeny: papír, plochy, stíny vystouplé a vtlačené (světlý i tmavý), písma a jejich role, páska a razítko v barvách všech osmi období. Kontrast AA pro všechen text ověř výpočtem, ne odhadem.

3. Do plánu větve zapiš oddíl Po D2 (co je na plátně, nad čím jsi váhal, co by šlo jinak) s otázkami Co rozhodnout po D2 a zadání D3 v plném znění. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md.

4. Pak se zastav a napiš mi, na co se mám na plátně podívat.
```

## Uzavření

Po revizi a opravách otázka na schválení, kterou zodpoví jen autor. Po ní sloučení do hlavní větve, GitHub, plán a zadání do `docs/archiv/`, řádek v `docs/plan.md` a na řadě krok Z plánu středověku.
