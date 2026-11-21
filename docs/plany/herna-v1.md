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

Hotové kroky jsou ve třech souborech: zadání P6 až K3, odpovědi před P6, Po P6, Po K1 a Po K2 v `docs/plany/herna-v1-1.md`, zadání K4, K5 a T, Po K3, Po K4 a Po K5 v `docs/plany/herna-v1-2.md`, Po T, zadání R, Po R (s celým výčtem nálezů) a zadání O v `docs/plany/herna-v1-3.md`.

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
| O | Opravy po revizi, referenční snímky nových formátů, `docs/design.md` a `docs/pouceni.md`, VoiceOver s autorem | Opus 5.5 · high | hotovo 21. 11. 2026 (Po O; VoiceOver přesunut do Uzavření) |
| Uzavření | VoiceOver s autorem, schválení, sloučení, GitHub, kontrola nasazeného webu a běhu kontrol, plán do archivu | Opus 5.5 · medium | na řadě (Zadání Uzavření) |

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

## Zadání Uzavření

Opus 5.5 · medium, nový chat. VoiceOver jen s autorem u Macu.

```
Ve větvi herna-v1 na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Přečti CLAUDE.md, v docs/pouceni.md oddíl Technika a v docs/plany/herna-v1.md tabulku Kroky, Po O (i odpověď autora; prázdná odpověď = souhlas se sloučením) a Co zůstává na později. Archiv nečti.

Uzavření větve herna-v1.

1. VoiceOver s autorem (asi deset minut, Safari a npm run dev): projdi s ním postup v Po O a zapiš tamtéž, co čtečka řekla, neřekla, řekla dvakrát nebo anglicky. Co jde opravit malou změnou (aria-label, hlášení, pořadí čtení), oprav s testem; větší nález zapiš do Co zůstává na později. Když autor u Macu není, krok vynech a napiš to do Po Uzavření.
2. Když autor větev schválil: git switch main, git merge --no-ff herna-v1, celé npm test na pozadí s výstupem do souboru (výsledek čti po částech), pak push na GitHub (sám, ne autor).
3. Po pushi zkontroluj běh kontrol a nasazení (gh run list, gh run view --log-failed) a nasazený web: https://czempi123.github.io/obdobi/pocatky-a-klasicke-recko/, /smer/epikureismus/, /otazka/jak-zit/ a /osobnost/demokritos/ na 390 a 1440 px (Playwright proti nasazené adrese, snímky do Claude outputs/). Test, který padne jen na GitHubu, zkus na Linuxu s CI=true (docs/pouceni.md › Technika); flaky test hledej příčinou, ne dalším pokusem.
4. Plány větve (docs/plany/herna-v1.md, herna-v1-1.md až herna-v1-3.md) přesuň do docs/archiv/plany/ a záznam docs/revize/herna-v1.md do docs/archiv/revize/; oprav odkazy na ně (grep -rn "plany/herna-v1\|revize/herna-v1" docs src skills tests). V docs/plan-vetve.md označ herna-v1 jako hotovou a podle docs/plany/po-auditu.md › Větve napiš, která větev je další. docs/plan-vetve.md (a docs/plan.md, pokud se změnil) nahraj do Projektu Claude, herna-v1.md z Projektu smaž.
5. Commit na main, push, restart npm run dev a zpráva autorovi: co je na webu, co zůstalo na později a celý prompt pro první krok další větve s modelem a úsilím (i do jejího plánu). Zastav se.
```

## Po O (21. 11. 2026)

Opravy všech nálezů revize R podle odpovědí autora (všechny prázdné = souhlas s doporučením). Celý výčet nálezů je v `docs/plany/herna-v1-3.md` › Po R a v `docs/revize/herna-v1.md`.

**Co se změnilo**

1. **Seřaď na ose:** pod jménem je od začátku napověda (z YAML, jinak první věta `proc`), „zkus to jinak“ jmenuje obrácenou dvojici („„Kratés“ a „Diogenés“ zatím visí obráceně.“). Na 390 px měří šňůra s pěti kartami 471 px (karty 81 až 85 px) a celý blok 856 px; v čtenářském sloupci na notebooku 377 px. Šňůra visí vodorovně až od 860 px rámu (dílna, krok cesty), v čtenářském sloupci svisle: pět karet po 109 px s napovědou mělo šest až sedm řádků dělených slov. Otisk „sedí“ je svisle dole u konce šňůry, nahoře by zakryl napovědu první karty.
2. **Páry na Epikureismu:** slast jen tělem podle VS 33 („nemáš žízeň, není ti zima a nic tě nebolí“), zdroj `gnomologium-vaticanum`. Ve vazbě zůstalo „a doufá, že to mít bude“: stojí to ve VS 33 a revize to vynechala.
3. **Kdo to řekl? z dat:** nepovinné pole `oCem` u citátu; dvanáct citátů z výpisu ho má (věty skillem `atlas-psani`, ověřené proti místu v díle, u dialogů s mluvčím). Rub ukáže `oCem` nahoře a vztah drobně pod ním (`.kartka__vztah`). Vybraný citát bez `oCem` zastaví sestavení. Nabídka se podle `oCem` **nefiltruje**: filtr přeskládal půlku medailonků (do `pouzite` jdou citáty všech kandidátů) a Aristotelés zůstal bez hry. `scripts/herna-k4-vypis.ts` zná `<HraOsoby>` v profilech, `bez` i citáty profilu a ukazuje id citátu a obě věty rubu.
4. **Parmenidés:** zase `<KdoZilDriv a="parmenides" b="sokrates" druh="vzdalenost" />`, stav jako před T; výpis: Zénón z Eleje a Thalés kolem beze změny.
5. **Kdo by to řekl? na otázce 1:** Aristotelés „Namítl by, že strach o dobré jméno drží mladé od chyb. Stud podle něj patří jen k tomu, co člověk sám udělal špatně:“ (EN IV, 9, 1128b16–18 a 21–29, Rackham na Perseu). V lístku Diogenés s novým citátem `dl-vi-58-osli` (D. L. VI, 58, řecky i Hicks na Perseu); Antisthenés zůstal mezi čtyřmi možnostmi bez lístku.
6. **Najdi slabé místo:** Seneka „Že každé „navíc“ je prázdná představa, by nepřijal:“.
7. **Pravý, nebo podvržený? v cestě 1:** Prótagorás „Člověk je měřítkem všech věcí.“ (připsání `clovek-meritkem`, druh pravý, doklad šíření `wikipedia-protagoras-meritko`), ověření „Cituje ji odpůrce, který s ní nesouhlasil, a to je dobrý důvod jí věřit.“ (Platóna jmenuje už lístek o původu). Marcus zůstal na stránce klamů a v dílně.
8. **Tipni si na stránkách osob** jen z četby přes lidský život. Démokritos: Kdo to řekl? (Epikúros proti nutnosti atomistů, Menoikeus 134), Gorgiás: Kde to bylo? (Athény), Isokratés: Kdo žil dřív? s Hérakleitem, Pyrrhón: Kdo žil dřív? se Sókratem. Řada se tím přeskládala u Chairefónta, Kritóna, Alkibiada, Aristofana, Antisthena a Aspasie (střídání kdo-rekl a kdo-zil se otočilo, jinak to data nedovolí). Zénón z Eleje a Démokritos mají vedle sebe dvě Kdo to řekl?: Zénón sousedí s Prótagorovým Kdo žil dřív?, Démokritos s Anaximandrem, který má jen Kdo žil dřív?. Test to má jako jedinou výjimku. Počty na medailoncích: Kdo to řekl? 10, Kdo žil dřív? 11, Kde to bylo? 8, Tipni si 5.
9. **Drobné:** vysvětlení Tipni si na období 2 končí otázkou „Je to ještě spor, když druhý už nemůže odpovědět?“; katalog hodin dává hrám z dat název se stránkou („Čí je ta věta? · u Theofrasta“, `otazkaVKatalogu` v `src/lib/herna/aktivity.ts`).
10. **Referenční snímky:** `hra-serad-390-den` a `hra-serad-1440-noc` v `tests/e2e/snimky.spec.ts` (prohlédnuté; na 390 px leží přes konec bloku pevná pata s Zkontrolovat pořadí, protože blok je o 12 px vyšší než okno). `docs/design.md` (Seřaď na ose, rub z dat, promítání hry pod prvním názorem, čtrnáct snímků), `docs/pouceni.md` (devět vět z R a O), `docs/podklady/herna.md` (Ověření v kroku O), `docs/rozhodnuti.md`.
11. **VoiceOver:** neproběhl. Autorův Mac se uprostřed kroku asi na půl hodiny odpojil a krok jsem pak dokončoval bez něj; postup je níž a je v Zadání Uzavření.
12. **Kontroly:** `scripts/revize-herna-dotyk.mjs` všech osm přídavků bez nálezu (prst mění blok, cíle aspoň 44 px, nic nepřetéká), `scripts/revize-hodina-klavesnice.mjs` 0 nálezů; snímky her v dílně a přídavků na 390 a 1440 px v obou režimech prohlédnuté (`scripts/snimky-herna-t.mjs` místo Parmenida fotí Démokrita). Celé `npm test`: kontrola typů bez chyb, Vitest 1 591 testů, Playwright 897 z 902 (10,3 min). Padlo pět testů, všechny kvůli O: čtyřikrát Seřaď na ose v `herna.spec.ts` (vzor věty s „a“ bez nezlomitelné mezery) a sousední hry v `herna-k4.spec.ts` (Zénón z Eleje a Démokritos). Po opravě oba soubory prošly (34 z 34).

**VoiceOver s autorem** (nastavení přístupnosti mění autor; asi deset minut, Safari a `npm run dev`):

1. V Safari otevři `http://localhost:4321/smer/stoicismus/#stoicismus-kdo-rekl`, zapni VoiceOver (Cmd + F5).
2. Tabulátorem na první razítko pod kartičkou: má zaznít jméno a věta, čím se ten člověk zabýval. Mezerník vybere. Po trefě má VoiceOver sám přečíst lístek („Sedí…“), po chybě „Zkus to jinak“ a napovědu.
3. `http://localhost:4321/obdobi/pocatky-a-klasicke-recko/#obdobi1-serad`: Tab na kartu, Enter ji zvedne, šipka dolů posune, Enter položí. Má zaznít jméno, napověda a „místo 2 z 5“.
4. `http://localhost:4321/cesta/kolik-je-dost/6/#cesta6-slabe`: Tab na větu, Enter ji přeškrtne. Má zaznít, že je přeškrtnutá, a pak lístek, kdo by ji škrtl s tebou.
5. Zapiš, co VoiceOver neřekl, řekl dvakrát, nebo řekl anglicky. Cmd + F5 ho vypne.

**Na které snímky se podívat** (`Claude outputs/snimky/`): `herna-t-obdobi1-serad-klid-390-light.png` a `herna-t-obdobi1-serad-klid-1440-light.png` (napovědy na šňůře), `herna-serad-zkus-1440-tmavy.png` (dílna vodorovně, „zkus to jinak“ s dvojicí), `herna-serad-sedi-390-svetly.png` (otisk dole), `herna-t-jak-zit-kdo-by-cin-390-dark.png` (Diogenés a Aristotelés v lístku), `herna-t-hra-demokritos-kdo-rekl-cin-390-light.png` (rub s `oCem` a vztahem).

**Otázka jen pro autora** (prázdná odpověď = souhlas):

1. Schvaluješ větev herna-v1, aby se v Uzavření (po VoiceOveru) sloučila do hlavní větve a poslala na GitHub? Odpověď:

Další krok: Uzavření v novém chatu, Opus 5.5 · medium; celé znění promptu je v Zadání Uzavření.

## Co zůstává na později

- Porota, Dialog, Úryvek s otázkou, Příběh v obrazech a hračky vzniknou v celku, který je první potřebuje (`docs/plany/po-auditu.md` › Větve).
- Co ti zůstalo?, kartičky s rozestupem a vystřižené citáty: `denik-v2`.
- Zvuk (Poslechni si) a film: `film-0`, zvuk později.
- Pravidla pestrosti a katalog aktivit do skillů: `uklid-v1`.
- VoiceOver s autorem (z design-v2 a z R): krok O ho nestihl, protože se Mac během práce odpojil; je v Zadání Uzavření, postup v Po O.
- Zénón z Eleje a Démokritos mají na medailoncích vedle sebe dvě Kdo to řekl?. Jinou hru dostanou, až bude mít Zénón v datech pobyt v Athénách s rokem (Parmenidés 127b: Kde to bylo?), nebo až přibude jiný vztah.
