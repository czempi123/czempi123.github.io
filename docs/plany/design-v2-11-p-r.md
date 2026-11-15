# Větev design-v2, část: pojmy a zadání revize

Část plánu větve `docs/plany/design-v2.md` (oddíl Části plánu). Text oddílů je beze změny.

## Po P (15. 11. 2026)

Odpovědi po K7b byly prázdné v repozitáři i v Projektu Claude, takže platí všech šest doporučení: na kresbách, mini mapě ani mini ose se nic neměnilo a trasy v mini mapě jsou zapsané v `docs/navraty.md` (patří k `herna-v1`). Snímky jsou v `Claude outputs/snimky/design-v2-p/`.

### Co vzniklo

- **Podklady** `docs/podklady/pojmy-antika.md`: výběr výpisem ze všech textů antiky, u každého pojmu původ (LSJ na Perseu), vysvětlení na dvě věty, u koho co, příklad ze života, výskyty a prameny (SEP, IEP). Pět nových zdrojů v `zdroje.yaml` (`sep-plato-ethics`, `sep-aristotle-psychology`, `sep-atomism-ancient`, `iep-meno`, `lsj`). Otevřený zůstal řecký termín pro osud (`k-overeni.md`).
- **Data** `src/content/pojmy/<id>.md`, schéma `Pojem` v `src/lib/pojmy.ts` (pojem, původ, vysvětlení právě na dvě věty, u koho co, příklad, výskyty, prameny, období, tvary pro hledání). Kontrola dat `tests/data/pojmy.test.ts`: schéma, prameny v datech, každý výskyt vede na stránku a stojí na ní tvar slova, každé vyznačení je ve výskytech, jeden pojem na stránce jednou, nejvýš jeden v odstavci, ne v nadpisu, import komponenty, vysvětlení nezačínají všechna stejně.
- **Komponenta Pojem** (`src/components/ui/Pojem.astro`, skript `src/scripts/pojmy.ts`): slovo s vlnovkou tužkou je tlačítko, vysvětlení jeho popis. Na notebooku poznámka rukou (Kalam) na okraji vedle odstavce se šipkou tužkou, po najetí podložená lístkem; na telefonu lístek pod odstavcem po klepnutí, rozloží se (`--d-listek`, `--k-papir`), při omezeném pohybu je tam hned; „Celý pojem“ a „Zavřít“. Enter dá fokus na „Celý pojem“, Esc vrátí fokus na slovo. Rozmístění na okraji je čistá funkce `rozmistitPoznamky` v `src/lib/okraj-pojmu.ts` (test `tests/data/okraj-pojmu.test.ts`): poznámky pod sebe, obejdou citát rukou na okraji i všechno, co do okraje zasahuje; co by začalo pod svým odstavcem, zůstane lístkem.
- **Stránka** `/pojem/<id>/` (šablona stránek z dat): hlavička s vysvětlením jako perexem, oddíly Odkud je slovo, U koho co, Ze života (příklad rukou na lístku), Kde v atlasu stojí (odkazy), Prameny. **Seznam** `/pojmy/` podle abecedy; vede na něj patička každé stránky. Obojí v `tests/e2e/nove-stranky.spec.ts`; pojmy jsou v katalogu hodin (typ `pojem`, štítek „Pojem“; `scripts/hodiny-katalog.mjs`: 181 stránek, chyb 0).
- **Hledání:** Pagefind neskloňuje, proto má `Zakladni.astro` prop `tvary` a v `main` neviditelný odstavec `.tvary-hledani` (`hidden`, `aria-hidden`, váha 3). Profily a medailonky v něm mají 2., 3. a 7. pád jména (`tvaryJmena` ze `jmeno2`), pojmy své tvary z dat i řecké slovo. „Sókrata“ a „Sókratovi“ najdou profil, „ctnosti“ pojem ctnost, „ataraxie“ pojem klid (test v `prohlidka.spec.ts`).
- **Nástroje:** `scripts/vyznac-pojmy.py` (vyznačí pojmy podle seznamu míst, pozná obsah ostrovu i značku přes víc řádků; pro další vlnu stačí doplnit seznam) a `scripts/snimky-okno.mjs` (snímek celého okna u jednoho místa: poznámky na okraji leží mimo sloupec a snímek prvku je neukáže).
- **Dokumentace:** `docs/design.md` (Komponenty: Pojem; Stránky z dat: Pojem a Pojmy), `docs/rozhodnuti.md`, `docs/pouceni.md` (Perseus a cookie, značka přes víc řádků, Enter před prvním snímkem, první snímek při omezeném pohybu).

### Které pojmy a kde

Dvacet šest pojmů, vyznačených 57krát na 31 stránce: ctnost, idea, duše, rozpomínání, slast, klid (ataraxia), štěstí (eudaimonia), vědění, neovládnutí (akrasia), střed, etika, mýtus, dialog, protipříklad (elenchos), obec (polis), tyran, věštírna, v naší moci, soud, lhostejné věci, osud, příčina, atom, látka, rozum (logos), religionistika. Přesně kde, ukazuje tabulka Přehled v podkladech a pole `vyskyty` v datech; stránka každého pojmu vypisuje všechna místa, kde slovo v tom smyslu stojí, i ta nevyznačená.

### Testy a kontrola

- `npm run build` prošel; Vitest `pojmy`, `okraj-pojmu`, `kontrast` (nový oddíl pojem: ruka na papíru i přes tečku, inkoust a ink-2 na lístku, tužka 3 : 1 na listu, lístku a papíru).
- Playwright: `pojem.spec.ts` (okraj, klávesnice, telefon, rozložení, žádný překryv na všech 31 stránkách s pojmy a počet tlačítek proti zdroji, odkazy stránky pojmu, axe ve dne i v noci s poznámkami i otevřeným lístkem), `nove-stranky.spec.ts`, `prohlidka.spec.ts`.
- `scripts/kontrola-fokus.mjs` na profilu Sókrata, kroku 5 cesty Stačí vědět, co je správné?, stránce pojmu a Pojmech na 390 a 1440 px: v pořádku.
- **Klávesnicí** skutečným tabulátorem (jednorázový skript, smazaný) na 1440 × 900, 1440 × 640, 390 × 844 a 390 × 640 na profilu Sókrata a v kroku cesty: slovo vidět, Enter na „Celý pojem“ (vidět, ne pod lištou), Esc zpátky na slovo. První měření v kroku cesty selhalo: Enter přišel dřív, než skript poznámky poprvé rozložil; otevření si teď rozložení vynutí samo.
- Věty v testech, kterých se vyznačení dotklo (`cesta4`, `cesta5`, `cesta8`, `otazka`), ověřují `toContainText`, které obalené slovo snese.
- Celé `npm test` před commitem jednou: kontrola typů bez chyb, Vitest 1 440 ze 1 440, Playwright 774 ze 775 (9,6 min). Spadl `denik-kapitoly.spec.ts:101` (klávesnice v kapitolách deníku: mezerník kapitolu Helenismus nezavřel); samostatně prošel třikrát ze tří, pojmů se netýká. Revize R ho má mezi náhodnými testy prověřit.

### Nad čím jsem váhal a co by šlo jinak

- **Řecká slova v textu nejsou.** Zadání jmenuje ataraxii, apatheiu, logos, elenchos, eudaimonii a akrasii, ale texty antiky je nikde nemají: atlas je od začátku říká česky. Vyznačil jsem česká slova (klid, štěstí, neovládnutí, protipříklad, rozum) a řecké slovo dal do původu a do tvarů pro hledání; texty jsem neměnil (rozhodnutí z 12. 11.). Jinak: vložit řecká slova do textů jako závorku („klid (ataraxia)“), což je změna hotových vět. Otázka 1.
- **Co vyznačit:** jen tam, kde slovo nese filozofický význam a stránka ho o dvě věty dál sama nevykládá (Aristotelova ctnost u oka a koně, Thalés a látka v úvodu ano, mýtus v úvodech ne). Obec je nejčastější: vyznačená na deseti stránkách, protože student pod ní vidí vesnici nebo úřad.
- **Soud nikde vyznačený není.** Jediný výskyt ve smyslu stoiků je v citátu („soudy o věcech“) a do citátu pojem nepatří. Stránka a seznam pojmů ho mají. Otázka 4.
- **Tlačítko, ne odkaz.** Čtečka slyší „věštírny, tlačítko“ a hned popis; odkaz by studenta posílal pryč ze stránky. Na stránku pojmu vede „Celý pojem“ ve vysvětlení.
- **Poznámka na okraji smí pokračovat podél aktivity pod listem**, protože ta do okraje nesahá; zastaví ji jen věc v okraji (citát rukou na okraji, širší blok, další kapitola). Bez toho by se na okraj vešla jen první poznámka listu. Druhá poznámka v sousedním odstavci (Epikúros: slast a klid) se často nevejde a zůstane lístkem: vysvětlení slasti je vysoké.
- **Od 1100 px a jen s 190 px vedle listu.** Pod tím je vysvětlení lístkem jako na telefonu. Při promítání hodiny poznámky na okraji nejsou.
- **Astro komponenta se sdíleným skriptem, ne ostrov.** Pojem stojí uprostřed věty v MDX; Svelte by kvůli jednomu tlačítku hydratoval na každé stránce. Pojmy v obsahu ostrovu (Nejdřív sám, bloky) proto vyznačené nejsou; skript na vyznačení je přeskočí.
- **Nadpis stránky pojmu s tečkou** („Ctnost.“) jako ostatní stránky z dat; seznam má titulek „Slova, která *unesou víc*“.
- **Odkaz na Pojmy jen v patičce**, ne v Otázkách: patička je na každé stránce. Otázka 5.

## Co rozhodnout po P

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-p/`). Prázdná odpověď znamená souhlas s doporučením.

1. **Česká slova s řeckým původem** (klid s ataraxií v původu, štěstí s eudaimonií): texty beze změny, řecké slovo na stránce pojmu a v hledání. Jinak: doplnit do textů řecké slovo v závorce. Doporučuji, jak je.
   Odpověď:

2. **Poznámka na okraji a lístek** (snímky `p-okraj-sokrates-1440-light`, `p-okraj-sokrates-1440-dark`, `p-okraj-epikuros-1440-light`, `p-listek-vestirna-390-light`, `p-listek-vestirna-390-dark`): rukou na tečkovaném papíře se šipkou, po najetí na lístku; na telefonu lístek pod odstavcem s Celý pojem a Zavřít. Doporučuji ano.
   Odpověď:

3. **Stránka pojmu a seznam** (snímky `p-pojem-ctnost-*`; seznam si otevři v náhledu na `/pojmy/`): oddíly Odkud je slovo, U koho co, Ze života, Kde v atlasu stojí, Prameny. Doporučuji ano.
   Odpověď:

4. **Soud bez vyznačení:** stoický soud stojí v atlasu jen v citátu. Nechat ho jako pojem se stránkou (vede na něj seznam), nebo vyřadit? Doporučuji nechat.
   Odpověď:

5. **Odkaz na Pojmy:** dnes v patičce každé stránky. Přidat i do Otázek nebo do hlavní navigace? Doporučuji jen patičku; revize R posoudí, jestli ho studenti najdou.
   Odpověď:

6. **Chceš něco změnit na snímcích po P** (i na celém profilu Sókrata `p-sokrates-*`)? Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání R: revize celé větve

Opus 5.5 · high se skillem `atlas-revize` a pluginem Design (`design:accessibility-review`, `design:design-critique`). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po P. Když se krok nevejde do jednoho sezení, udělej nejdřív inventuru, snímky a přístupnost (body 1 až 3), zapiš nálezy a výkon nech na další sezení.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok R větve design-v2, revize celé větve. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/plany/design-v2.md tabulku kroků, oddíl Obsah větve, Co rozhodnout po P s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. Z částí plánu jen Po D2 (Stavy prvků, Kontrola kontrastu), Po D3 (Pravidla pohybu), Po auditu (Vizuální zlepšení, Pravidlo střídmosti) a oddíly „Nad čím jsem váhal“ kroků K1 až P (podle seznamu Části plánu) jako seznam míst, kde hledat nejdřív. docs/design.md nečti celý. Načti skilly atlas-revize, atlas-komponenta a atlas-psani a z pluginu Design design:accessibility-review a design:design-critique. Když odpovědi po P něco mění na pojmech, oprav to nejdřív.

1. Inventura: vypiš všechny typy stránek (Domů, Lidé a směry, Otázky, Mapa a čas, profil, společný profil, medailonek, přehled a krok cesty, velká otázka, období, směr, myšlenkový pokus, úvody, tradice, pojem a Pojmy, Můj deník s kapitolami, Tvoje antika, Stoický týden, příprava hodiny, hodina a promítání, dílna, 404) a ke každému jednu adresu.

2. Vzhled: snímky každého typu na 390 a 1440 px ve dne i v noci (scripts/snimky-listy.mjs, kroky cest scripts/snimky-cesta.mjs, okraj scripts/snimky-okno.mjs) do Claude outputs/snimky/design-v2-r/ a jejich prohlídka očima studenta, učitele a autora (skill atlas-revize, design:design-critique): soulad se Spojením a s Pravidlem střídmosti (nejvýš jedna ozdoba na obrazovku, text delší než dvě věty se nenatáčí, Kalam jen na poznámku), co vystupuje, jde zmáčknout, a co je vtlačené, je zvolené, papírnictví období, pohyb jen po činu studenta, čtení a dělání vypadají jinak. Texty, které větev přidala (popisky, nápovědy, pojmy), projdi se skillem atlas-psani.

3. Přístupnost (design:accessibility-review): axe ve dne i v noci na každém typu stránky; kontrast všech dvojic tokenů výpočtem (co v tests/data/kontrast.test.ts chybí, doplň); klávesnice skutečným tabulátorem na dvou výškách okna a scripts/kontrola-fokus.mjs na všech typech; čtečka (VoiceOver na Macu: profil s pojmem, krok cesty s blokem, kresba, deník s kapitolami, Mapa a čas; co hlásí a v jakém pořadí, nadpis kapitoly v lístku deníku); omezený pohyb (každá animace má klidový stav, který říká totéž).

4. Výkon: na mém iPhonu a na levném telefonu se systémem Android (když ho nemám, Chrome se zpomaleným procesorem 6× a pomalou sítí) přechod listu mezi stránkami, otočení listu, Mapa a čas, kresby s pohybem. Když otočení listu trhá (pod 30 snímků za sekundu), ať se tam samo přepne na krátký přechod (skript v src/scripts/ s testem). Váha HTML stránek osob (dist/osobnost/*/index.html: tři nejtěžší a co je nese) a Zod v ostrovu SlozArgument (velikost balíčku; jde validace přesunout do sestavení?).

5. Nálezy zapiš do docs/revize/design-v2.md ve formátu skillu atlas-revize (dopad, kde, co, návrh opravy) seřazené podle dopadu. Drobnosti (chybějící popisek, jeden token, překlep) oprav rovnou a zapiš; zásadní změny vzhledu jen navrhni, rozhoduji o nich po R.

6. Ověř opravy: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro dotčené stránky a ty, které spadnou), celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po R: co revize našla a co opravila, snímky, otázky Co rozhodnout po R (každý zásadní nález jako otázka s doporučením; prázdná odpověď znamená souhlas) a zadání kroku O v plném znění (podle tabulky kroků). Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/plany/design-v2.md a části plánu, které se změnily.

8. Pak se zastav a napiš mi, na které snímky a nálezy se mám podívat.
```
