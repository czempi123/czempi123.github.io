# Větev herna-v1: knihovna nových aktivit

Plán 16. 11. 2026 (Opus 5.5). Fáze 2 plánu po auditu (`docs/plany/po-auditu.md` › Fáze 2: zásada, katalog, pravidla pestrosti, větve) a přídavky z kurikula (`docs/plany/kurikulum.md`, řádek `herna-v1`). Vzhled předmětů a herní pohyb navrhl krok D5 větve design-v2 (`docs/archiv/plany/design-v2-4-audit-d5.md` › Po D5, plátno Herní prvky). Společný rám aktivity (`RamAktivity.svelte`) a tokeny jsou hotové (`docs/design.md` › Bloky a aktivity, Pohyb).

## Proč

Z devadesáti míst, kde student v antice něco dělá, je jen třináct hraček, zbytek je volba, věta do pole a třídění. Na každém medailonku je tatáž aktivita (Kdo žil dřív?). Herna postaví formáty, které se plní z dat a z YAML, takže je pak každý celek jen vybere. Každý formát musí projít čtyřmi otázkami zásady (odnese si něco, přemýšlí sám, zůstává otevřená, chtěl by ji udělat i bez povinnosti) a nosným pilířem: co si z toho student odnese do života.

## Co platí

- **Hotový text se nepřepisuje.** Každý nový formát se objeví jednou v dílně (`/dilna/bloky/`) a na jednom místě antiky jako přídavek: nový blok mezi hotové odstavce nebo na konec stránky, bez změny okolních vět. Postřehy k hotovému obsahu jdou do `docs/navraty.md`.
- **Data, ne ruční text.** Jména, roky a místa z `src/data/`; citáty jen ze `zdroje.yaml`; každý nový citát, číslo nebo připsání projde skillem `atlas-overeni`.
- **Předmět podle D5.** Seřaď na ose je šňůra s kolíčky, Tipni si pravítko, Kdo to řekl? otočná kartička, Doplň citát vystřižená slova, Pravý, nebo podvržený? dvě razítka, Najdi slabé místo červená tužka. „Sedí“ a „zkus to jinak“ jsou jediná dvojice pro správně a jinak, bez červené a zelené.
- **Pointa není paměť** (autor, 17. 11. 2026). Student se nemá učit citáty nazpaměť ani hádat, o koho jde; roky a přesné životy nejsou učivo. Znalostní hra stojí na myšlence a na vlivu: kdo na koho mohl navázat, čí myšlenka větě sedí, co by věta tvrdila s jiným slovem. Hra dává studentovi do ruky to, podle čeho může uvažovat (myšlenku osoby z dat, vztahy), a odkrytí řekne, o čem věta je a kdo na koho navázal. Roky jsou jen drobný údaj vedle toho. Hra stojí až tam, kde student lidi ze hry už potkal.
- **Bez bodů a skóre.** Znalostní formáty říkají „sedí“ nebo „zkus to jinak“ s jednou větou, kam se podívat. Názorové formáty (Kdo by to řekl?, Najdi slabé místo) nemají správnou odpověď: student uvidí, kdo stál s ním.
- **Každé tažení má cestu bez tažení** (klepnutí, klávesnice); cíle aspoň 44 px; omezený pohyb a Klidný režim vypnou zamíchání i otočení.
- **Do deníku jen to, co si student vytvořil nebo zvolil** (stanovisko, sebehodnocení, slabé místo). Znalostní hry ukládají jen stav, aby šly obnovit.

## Kroky

Hotové kroky jsou ve třech souborech: zadání P6 až K3, odpovědi před P6, Po P6, Po K1 a Po K2 v `docs/plany/herna-v1-1.md`, zadání K4, K5 a T, Po K3, Po K4 a Po K5 v `docs/plany/herna-v1-2.md`, Po T a zadání R v `docs/plany/herna-v1-3.md`.

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| P6 | Podklady pro formáty: citáty pro Kdo to řekl? a Doplň citát, podvržené citáty s doloženým původem, věty pro Kdo by to řekl?, situace pro Páry, čísla pro Tipni si, otázky pro Výpravy, látka stránky Argumentační klamy a manipulace | Opus 5.5 · high se skillem `atlas-overeni` | hotovo 17. 11. 2026 (Po P6) |
| K1 | Herní jádro a první dva formáty: sdílená logika v `src/lib/herna/`, herní pohyb (zamíchání, otočení karty, razítko), **Seřaď na ose** a **Kdo to řekl?** | Opus 5.5 · high se skillem `atlas-komponenta` | hotovo 17. 11. 2026 (Po K1) |
| K2 | Úprava Seřaď na ose a Kdo to řekl? podle zásady Pointa není paměť, pak **Tipni si**, **Kde to bylo?** (slepá mapa), **Doplň citát** | totéž | hotovo 17. 11. 2026 (Po K2) |
| K3 | **Páry**, **Pravý, nebo podvržený?**, **Najdi slabé místo**, **Kdo by to řekl?** | totéž | hotovo 17. 11. 2026 (Po K3) |
| K4 | Stránky osob a mapa: **střídání malých aktivit** na medailoncích a profilech, **Výpravy** pro období 1 a 2, **Přehrát období**, trasy na mini mapě | totéž | hotovo 17. 11. 2026 (Po K4) |
| K5 | Kurikulum: karta **Do hodiny**, **sebehodnocení** na konci cesty, stránka **Argumentační klamy a manipulace** | komponenty `atlas-komponenta`, text `atlas-psani` · Opus 5.5 · high | hotovo 19. 11. 2026 (Po K5) |
| T | Přídavky v antice: každý formát na jednom místě (tabulka v Co rozhodnout, otázka 1), karta Do hodiny ve zbylých devíti cestách, zadání a zpětné vazby skillem `atlas-psani`, zápis bloků do skillu `atlas-cesta` | Opus 5.5 · high se skilly `atlas-cesta` a `atlas-psani` | hotovo 21. 11. 2026 (Po T) |
| R | Revize větve: čtyři otázky zásady u každého formátu, 390 a 1440 px, světlý i tmavý režim, Klidný režim, klávesnice, čtečka, dotyk skutečnými událostmi, výkon stránek osob | Opus 5.5 · high se skillem `atlas-revize` a pluginem Design | hotovo 21. 11. 2026 (Po R, `docs/revize/herna-v1.md`) |
| O | Opravy po revizi, referenční snímky nových formátů, `docs/design.md` a `docs/pouceni.md`, VoiceOver s autorem | Opus 5.5 · high | na řadě (Zadání O) |
| Uzavření | Schválení autorem, sloučení, GitHub, kontrola nasazeného webu a běhu kontrol, plán do archivu | Opus 5.5 · medium | čeká na O |

Každý krok končí commitem ve větvi `herna-v1`, oddílem „Po <krok>“ v tomto souboru, otázkami, jen když něco smí rozhodnout jen autor, a celým promptem dalšího kroku ve zprávě i tady v plánu. Na GitHub se nic neposílá až do Uzavření.

## Formáty

| Formát | Co student dělá | Z čeho se plní | Uloží | Otázka pilíře (co si odnese) |
| --- | --- | --- | --- | --- |
| Seřaď na ose | Pět karet (lidé, události, díla) seřadí na šňůru; roky se ukážou až po správném pořadí | `lide.yaml`, `udalosti.yaml`, výběr id v YAML bloku | stav | kdo navazoval na koho; dějiny jako řetěz rozhovorů |
| Kdo to řekl? | Otočí kartičku s větou a tipne, čí je ze tří až čtyř lidí; po otočení dílo a místo | `zdroje.yaml` (jen ověřené citáty) | stav | poznat hlas myslitele podle toho, co ho trápilo |
| Doplň citát | Do vtlačené mezery vloží jedno ze tří vystřižených slov; pak celý citát s místem | `zdroje.yaml` a slova v YAML bloku | stav | slovo, na kterém věta stojí |
| Tipni si | Posuvníkem na pravítku odhadne číslo (roky mezi dvěma lidmi, délku života, vzdálenost); pak ryska a svorka rozdílu | data osob a míst, nebo ověřené číslo v YAML | stav | jak daleko a jak blízko jsou dějiny; překvapení |
| Kde to bylo? | Klepne do slepé mapy, kde se něco stalo; špendlík, razítko místa a čárkovaná spojnice ke správnému místu | `mista.yaml`, podklad mapy z `src/lib/podklad-sdileny.ts` | stav | odkud kdo byl a kam musel odejít |
| Páry | Spojí pojem se situací ze života (ne s definicí) | kolekce `pojmy` a situace v YAML bloku | stav | pojem jako nástroj na vlastní den |
| Pravý, nebo podvržený? | U citátu z internetu otiskne razítko „řekl to“, nebo „neřekl to“; pak kdo to doopravdy řekl, nebo odkud věta pochází | ověřené podvržené připsání v `zdroje.yaml` (nový druh záznamu) | stav | ověřit si citát dřív, než ho pošlu dál |
| Najdi slabé místo | Červenou tužkou přeškrtne premisu argumentu, kterou odmítá; pak vidí, kdo ji odmítl taky a proč | argument z YAML (stejný tvar jako Slož argument) | deník | najít v argumentu místo, kde se dá nesouhlasit |
| Kdo by to řekl? | K dnešní větě (z chatu, z reklamy, od kamaráda) vybere filozofa, který by ji podepsal, a připíše proč; pak uvidí, koho atlas navrhuje a proč | věty a vazby na hlasy v YAML | deník | spojit starou myšlenku s dnešní situací |
| Výpravy | Tři až pět otázek na období v Mapě a čase: tipni, ověř na mapě, zapiš | YAML výprav nad daty osob | stav | orientace v době, ne jen v lidech |
| Přehrát období | Minuta, kdy rok běží sám a lidé se objevují a mizí; dá se zastavit | data osob a období (`src/lib/zivot-na-mape.ts`) | nic | kdo žil s kým, kolik generací uplynulo |

Formáty se staví jednou jako ostrov v rámu aktivity a vkládají se jedním řádkem (`<SeradNaOse id="…" />`); obsah je v `src/content/bloky/<id>.yaml` se schématem v `src/lib/bloky-schema.ts`. Medailonek dostane formát bez YAML, sestavený z dat (K4).

## Zadání O

Opus 5.5 · high, skilly `atlas-komponenta` a `atlas-psani`, pro nové citáty `atlas-overeni`, nový chat. VoiceOver jen s autorem u Macu.

```
Ve větvi herna-v1 na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v docs/plany/herna-v1.md Co platí, Formáty a Po R (i odpovědi autora; prázdná odpověď = souhlas s doporučením), celý záznam docs/revize/herna-v1.md, v docs/design.md Bloky a aktivity, Přístupnost a Referenční snímky, skilly atlas-komponenta a atlas-psani; před každým novým citátem nebo připsáním skill atlas-overeni. Archiv nečti. Ze src/ čti jen soubory, které nálezy jmenují.

Opravy po revizi R. Hotový text mimo bloky herny se nemění; nové věty piš skillem atlas-psani a ověř proti místu v díle.

1. Seřaď na ose (zásadní): napověda karty viditelná od začátku pod jménem, karta bez napovědy dostane první větu proc z dat, „zkus to jinak“ jmenuje obrácenou dvojici. Změř šňůru na 390 px. Testy herna-k1, herna-k2 a data.
2. Páry na Epikureismu (zásadní): nové znění páru slast podle záznamu revize, zdroj gnomologium-vaticanum.
3. Kdo to řekl? z dat: nepovinné pole oCem u citátu v zdroje.yaml, obsahAktivity ho dá na rub nad vztah, výběr bere jen citáty s oCem (kontrola při sestavení). Dvanáct citátů z výpisu npx vite-node scripts/herna-k4-vypis.ts (výpis nejdřív uprav, ať zná HraOsoby v profilech).
4. Parmenidés: zpět řádek KdoZilDriv a="parmenides" b="sokrates" druh="vzdalenost"; ověř výpisem, že se hry medailonků kolem nezměnily.
5. Kdo by to řekl? na otázce 1: nové proc Aristotela (ověř EN IV, 9, 1128b21–29) a Diogenés s D. L. VI, 58 místo Antisthena v lístku (nový citát přes atlas-overeni; když se nepotvrdí, nech Antisthena a napiš proč).
6. Najdi slabé místo v Kolik je dost?: nové proc Seneky ze záznamu.
7. Pravý, nebo podvržený? v cestě 1: Prótagorás „Člověk je měřítkem všech věcí.“ jako připsání druhu pravy (Theaitétos 152a, doklad, kde koluje) místo Marka.
8. Tipni si na stránkách osob jen z četby přes lidský život; dlouhý život z kandidátů vyřaď a podle výpisu zkontroluj, co dostanou Démokritos, Gorgiás, Isokratés a Pyrrhón.
9. Drobné: vysvětlení Tipni si na období 2 a název her z dat v katalogu hodin („Čí je ta věta? · u Theofrasta“).
10. Referenční snímky nových formátů v tests/e2e/snimky.spec.ts (jedna hra herny na telefonu a notebooku, den a noc; po --update-snapshots si je prohlédni), docs/design.md (Seřaď na ose s napovědou, oCem, promítání bloku pod prvním názorem) a docs/pouceni.md (poučení z R jednou větou každé).
11. VoiceOver: jestli je autor u Macu, projdi s ním postup z Po R a zapiš, co čtečka řekla; jinak to zapiš do Co zůstává na později.
12. Snímky oprav (node scripts/snimky-herna.mjs a node scripts/snimky-herna-t.mjs nad náhledem sestaveného webu na portu 4323) si prohlédni na 390 a 1440 px v obou režimech; node scripts/revize-herna-dotyk.mjs a node scripts/revize-hodina-klavesnice.mjs znovu. Celé npm test na pozadí s výstupem do souboru, docs/rozhodnuti.md, commit, oddíl Po O v plánu s jedinou otázkou pro autora (schválení větve), restart npm run dev, plán do Projektu Claude. Na konci zprávy napiš, na které snímky se mám podívat, a celý prompt pro Uzavření (do zprávy i do plánu), s modelem a úsilím. Zastav se.
```

## Po R (21. 11. 2026)

Revize celé větve je v `docs/revize/herna-v1.md`. **Verdikt: po opravách.** Technicky drží všechno (axe, fokus pod lištou, skutečný Tab na dvou výškách okna, dotyk přes CDP, cíle 44 px, katalog hodin). Zásadu „hra dá do ruky, podle čeho uvažovat“ ale na dvou místech porušuje sama stavba hry a šest nálezů se týká toho, kdo ve hře mluví.

**Nejdůležitější nálezy**

1. **Seřaď na ose (zásadní):** karty nesou jen jméno, napovědy přijdou až po chybě a roky stojí o obrazovku výš v Lidech a směrech; Xenofanés na stránce není. Oprava: napověda viditelná od začátku.
2. **Páry na Epikureismu (zásadní):** situace pro slast odpovídá i vysvětlení klidu pod pojmem a hlasu Epikúra na otázce 1; správná úvaha dostane „zkus to jinak“. Oprava: slast jen tělem podle VS 33.
3. **Kdo to řekl? z dat** neřekne, o čem věta je (rub jen se vztahem, razítka s nesouvisející větou `proc`). Oprava: pole `oCem` u dvanácti citátů.
4. **Parmenidés s Obranou 35c** (věta o soudci na stránce o bytí): vrátit Kdo žil dřív? Parmenidés a Sókratés.
5. **Kdo by to řekl? na otázce 1:** Aristotelův stud čte student, kterému se smějí, jako „máš se stydět“; Antisthenés na stránce nemluví. Oprava: `proc` se studem za vlastní činy, Diogenés (D. L. VI, 58) v lístku.
6. **Najdi slabé místo:** Seneka škrtá životopisem („sám byl bohatý“), ne důvodem. Nové `proc`.
7. **Pravý, nebo podvržený? v cestě 1:** Marcus, kterého student v první cestě nepotkal. Prótagorás „Člověk je měřítkem všech věcí“.
8. **Tipni si z dlouhého života** na čtyřech medailoncích je kvíz o letech bez vztahu: vyřadit.

**Opraveno rovnou:** hra stránky otázky (i osa hlasů) se při promítání hodiny neukázala, protože `#<slug>-po` čeká na první názor; `src/scripts/hodina-lista.ts` ho odkryje i pro blok uvnitř, test `tests/e2e/herna-r.spec.ts`. Tři věty přídavků: „napsali stoikové“ → „jsou od stoiků“ (Epiktétos nic nenapsal), scéna Menónu „bez obrazu“ → „co tím myslí“, napověda Sókrata „zapsal až jeho žák“ → „psali až jeho žáci“.

**Rozhodnutí z T:** Doplň citát mimo Soud platí, Najdi slabé místo mimo cestu 8 platí, Pravý před Závěrem cesty 1 platí, hra ve frontmatteru platí, hry ve třech profilech platí u Aristotela a Epiktéta, Parmenidés s Obranou 35c neplatí.

**Nové skripty:** `scripts/revize-herna-dotyk.mjs` (přídavky prstem přes CDP na 390 px, cíle 44 px, přetečení) a `scripts/revize-hodina-klavesnice.mjs` (příprava hodiny s novými zastaveními jen klávesnicí a promítání).

**Celé `npm test`:** kontrola typů bez chyb, 1590 testů ve Vitestu, v Playwrightu 899 z 900 (10,9 min). Spadl jen `denik-kapitoly.spec.ts:101` (kapitola Helenismus a Řím po obnovení), deníku se R nedotkla; samotný soubor pak prošel třikrát po sobě (30 z 30). Kdyby se objevil znovu, hledat příčinu (`docs/pouceni.md`, flaky).

**VoiceOver s autorem** (nastavení přístupnosti mění autor; asi deset minut, Safari a `npm run dev`):

1. V Safari otevři `http://localhost:4321/smer/stoicismus/#stoicismus-kdo-rekl`, zapni VoiceOver (Cmd + F5).
2. Tabulátorem na první razítko pod kartičkou: má zaznít jméno a věta, čím se ten člověk zabýval. Mezerník vybere. Po trefě má VoiceOver sám přečíst lístek („Sedí…“), po chybě „Zkus to jinak“ a napovědu.
3. `http://localhost:4321/obdobi/pocatky-a-klasicke-recko/#obdobi1-serad`: Tab na kartu, Enter ji zvedne, šipka dolů posune, Enter položí. Má zaznít jméno a „místo 2 z 5“.
4. `http://localhost:4321/cesta/kolik-je-dost/6/#cesta6-slabe`: Tab na větu, Enter ji přeškrtne. Má zaznít, že je přeškrtnutá, a pak lístek, kdo by ji škrtl s tebou.
5. Zapiš, co VoiceOver neřekl, řekl dvakrát, nebo řekl anglicky. Cmd + F5 ho vypne.

**Otázky jen pro autora** (prázdná odpověď = souhlas s doporučením):

1. Seřaď na ose: napovědy na kartách hned od začátku (doporučuji), nebo dál jen po chybě, s tím, že hra na období 1 je hlavně hádání? Odpověď:
2. Kdo by to řekl? na otázce 1: v lístku Diogenés s odpovědí na posměch (doporučuji, po ověření D. L. VI, 58), nebo dál Antisthenés, kterého student zná z cesty Čí život vlastně žiju?? Odpověď:
3. Pravý, nebo podvržený? v cestě 1: Prótagorás místo Marka Aurelia (doporučuji), nebo nechat Marka a smířit se s tím, že ho student v první cestě nezná? Odpověď:
4. Parmenidés: vrátit Kdo žil dřív? (doporučuji), nebo vybrat jinou hru z dat (Kde to bylo? s Athénami), pokud ji data unesou? Odpověď:
5. VoiceOver: projít s tebou v kroku O (doporučuji, deset minut u Macu), nebo odložit do Uzavření? Odpověď:

**Na které snímky se podívat** (`Claude outputs/snimky/`): `herna-t-obdobi1-serad-klid-390-light.png` (jen jména na šňůře; roky nad hrou na `t-obdobi1-390-light-1.jpg`), `herna-t-epikureismus-pary-klid-390-light.png` (vysvětlení klidu pod pojmem a situace po tréninku), `herna-t-jak-zit-kdo-by-cin-390-dark.png` (lístek s Aristotelovým studem), `herna-t-cesta6-slabe-cin-1440-light.png` (Seneka v lístku), `herna-t-cesta1-pravy-cin-390-light.png`, `revize-r-promitani-b-jak-zit-kdo-by.png` (promítání hry otázky před opravou: prázdná stránka).

Další krok: O v novém chatu, Opus 5.5 · high se skilly `atlas-komponenta` a `atlas-psani`; celé znění promptu je v Zadání O.

## Co zůstává na později

- Porota, Dialog, Úryvek s otázkou, Příběh v obrazech a hračky vzniknou v celku, který je první potřebuje (`docs/plany/po-auditu.md` › Větve).
- Co ti zůstalo?, kartičky s rozestupem a vystřižené citáty: `denik-v2`.
- Zvuk (Poslechni si) a film: `film-0`, zvuk později.
- Pravidla pestrosti a katalog aktivit do skillů: `uklid-v1`.
- Kontrola VoiceOverem z design-v2 (`docs/archiv/plany/design-v2.md` › Co zůstává na později) se hodí k revizi R, když bude autor u Macu.
