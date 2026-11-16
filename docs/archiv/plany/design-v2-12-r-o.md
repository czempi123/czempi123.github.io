# Větev design-v2, část: revize a zadání oprav

Část plánu větve `docs/archiv/plany/design-v2.md` (rozdělení podle pravidla z `CLAUDE.md`, soubor pro Projekt Claude pod 35 kB). Text oddílů je beze změny; odpovědi po R byly prázdné, takže platí doporučení.

## Po R (15. 11. 2026)

Odpovědi po P byly prázdné v repozitáři i v Projektu Claude, takže platí všech šest doporučení a na pojmech se nic neměnilo. Záznam revize s inventurou, měřeními a nálezy ve formátu `atlas-revize` je v `docs/revize/design-v2.md`; snímky v `Claude outputs/snimky/design-v2-r/`.

### Co revize našla

- **Strojově čisté:** axe na všech 24 typech stránek (390 a 1440 px, den a noc, plný deník) bez nálezu; kontrast úplné matice inkoustů na plochách ve dne i v noci v pořádku (doplněno do `kontrast.test.ts`); skutečný tabulátor na čtyřech velikostech okna nikde pod lištou; omezený pohyb vypne všechno; sám od sebe se hýbe jen příchod na stránku a kresby s pohybem.
- **Výkon** (Chrome, procesor 6× pomalejší, Fast 3G, 390 px): otočení listu 45 až 57 snímků za sekundu, ale první snímek 117 až 201 ms; posun mezi kroky 57 až 64; Mapa a čas 57; kresby 60. Stránky osob 230 až 269 kB (mini mapa s obrysem pobřeží 50 kB, Dva životy 23 kB).
- **Zásadní nálezy k rozhodnutí** (otázky níž): víc pásek na obrazovce (Mapa a čas, Domů, deník), popisky a lístečky přes sebe v Mapě a čase na telefonu, Stoický týden ve starém vzhledu, těžké stránky osob, kapitoly deníku neověřené VoiceOverem, ruční písmo poznámek pojmů, čtyři vysvětlení pojmů se stejnou stavbou.

### Co revize opravila

- **Prázdná deska:** Příběh bez obrazu a bez osoby (sedm kroků cest, Co je filozofie?, Judaismus) ukazoval prázdný rámeček; teď na desce leží ornament období tužkou (`Deska.astro`).
- **Letopočty:** `nezlomitelne()` váže i „423 př. n. l.“ (test v `sazba.test.ts`); pohlednice na Domů stojí rovně (text o pěti větách se nenatáčí); „Zpět na Lidi a směry“.
- **Zod v ostrovu Slož argument:** konstanty v `src/lib/argument-id.ts`, balíček ze 114 kB na 17 kB; validace zůstává při sestavení.
- **Pojistka plynulosti:** `src/scripts/plynulost-prechodu.ts` měří každé otočení listu; po dvou ze tří pod 30 snímků za sekundu dostane zařízení krátké prolnutí (typ přechodu `kratky`, `global.css`). Testy `plynulost-prechodu.test.ts` a `ram.spec.ts`.
- **Nástroje pro další revize:** `scripts/revize-tabulator.mjs` (skutečný Tab na více velikostech okna), `revize-design-v2-pohyb.mjs` (co se hýbe bez činu studenta a při omezeném pohybu), `revize-ctecka.mjs` (strom přístupnosti), `revize-vykon.mjs` (snímky za sekundu při zpomalení), `revize-design-v2-snimky.sh` (listy všech typů); `revize-axe.mjs` umí plný deník (`ULOZISTE`).

### Testy

`npm run build` prošel; celé `npm test` před commitem: kontrola typů bez chyb, Vitest 1 485 z 1 485, Playwright 775 ze 776 (10,3 min). Spadl `zivot-na-mape.spec.ts:117` (Přehrát: test vzorkuje roky za běhu a při zátěži stroje jeden rok přeskočí); samostatně prošel třikrát ze tří, oprav se netýká. Krok O ho má zpevnit (číst rok z historie přehrávání, ne vzorkovat). `denik-kapitoly.spec.ts:101`, který po P spadl, tentokrát prošel.

### Nad čím jsem váhal

- **Ornament, ne prázdná deska ani žádná deska.** Šlo by desku bez obrazu vynechat a dát textu celou šířku; Příběh by ale v kroku cesty ztratil rozvržení scény a obraz, podle kterého si student krok pamatuje. Ornament je ozdoba, která nic netvrdí, a komentář Příběhu ho sliboval.
- **Pojistka, i když emulace pod 30 snímků nespadla.** Zadání chtělo přepnutí jen tam, kde otočení trhá; skutečný levný telefon může být pomalejší než šestkrát zpomalený Mac, a měření na zařízení samo rozhodne. Na plynulém zařízení se nic nemění.
- **VoiceOver jsem nepouštěl:** mluví nahlas a ovládá celý Mac, kdežto ty jsi u počítače nebyl. Strom přístupnosti v Chromiu ukazuje jména a pořadí; co s nadpisem v rozbalovacím lístku udělá Safari, ověří O.
- **Pásky a Stoický týden jen navrhuji:** obrazovky s páskami jsi na kontrolních bodech viděl a schválil; pravidlo střídmosti mluví jinak, tak rozhodni ty.

## Co rozhodnout po R

Kontrolní bod se snímky (`Claude outputs/snimky/design-v2-r/`; záznam `docs/revize/design-v2.md`). Prázdná odpověď znamená souhlas s doporučením.

1. **Jedna páska na obrazovku** (snímky `r-mapa-390-dark-*`, `r-domu-390-light-*`, `r-denik-390-light-*`): Výprava v Mapě a čase bez pásky, druhý lístek „na začátek“ na Domů se sponkou, kapitoly deníku bez pásky (lístek s ohybem), páska jen u Návratu. Doporučuji ano.
   Odpověď:

2. **Mapa a čas na telefonu** (`r-mapa-390-*`, `r-mapa-1440-light-*`): popisky krajů a moří, které by ležely pod lístečkem, měřítkem nebo kreditem, se schovají; ze dvou překrytých lístečků zůstane u menšího místa špendlík; kratší událost na ose dostane popisek pod osou. Doporučuji ano.
   Odpověď:

3. **Stoický týden ve vzhledu Spojení** (`r-tyden-*`): titulek s pruhem, dny jako lístky, otevřený den jako čistý list; texty beze změny. Doporučuji ano.
   Odpověď:

4. **Lehčí stránky osob:** obrys pobřeží mini mapy jako jeden sdílený soubor a Dva životy jen s nabídkou jmen a roků; asi o 70 kB méně na každé stránce osoby, vzhled beze změny. Doporučuji ano.
   Odpověď:

5. **Otočení listu:** ponechat 900 ms s pojistkou (krátké prolnutí jen na zařízení, kde trhá), nebo otočení zkrátit pro všechny? Doporučuji ponechat; krátký přechod na přání dá Klidný režim v O.
   Odpověď:

6. **Kapitoly deníku a VoiceOver:** v kroku O je ověřím VoiceOverem v Safari na tvém Macu (ovládání počítače; VoiceOver bude mluvit nahlas) a jen když nadpis zmizí nebo jméno kapitoly je nesrozumitelné, předělám kapitolu na nadpis s tlačítkem a datum dám do popisu. Doporučuji ano; napiš, kdy u Macu nebudeš potřebovat zvuk.
   Odpověď:

7. **Poznámky pojmů v Klidném režimu tiskem** (`r-okraj-sokrates-1440-*`): na okraji Newsreader místo Kalamu, jen když je Klidný režim zapnutý. Doporučuji ano.
   Odpověď:

8. **Texty:** obec a soud bez úvodního „Ne…, ale“ (znění v záznamu revize), štěstí a vědění beze změny; perex deníku bez věty, kterou už říká pruh. Doporučuji ano.
   Odpověď:

9. **Chceš něco změnit na snímcích po R** (hlavně `r-opravy-montaz.jpg`: ornament na desce a rovná pohlednice)? Napiš kde a co. Bez odpovědi zůstává, jak je.
   Odpověď:

## Zadání O: opravy po revizi

Opus 5.5 · high (xhigh při zaseknutí) se skillem `atlas-komponenta`; texty se skillem `atlas-psani`. Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po R. Když se krok nevejde do jednoho sezení, udělej nejdřív body 1 až 3 a commitni, `docs/design.md` a skill nech na další sezení.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok O větve design-v2, opravy po revizi. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md, v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíl Po R, Co rozhodnout po R s mými odpověďmi a toto zadání, a záznam docs/revize/design-v2.md; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. Z docs/design.md jen oddíly, které měníš. Načti skilly atlas-komponenta a atlas-psani (a computer-use, když v otázce 6 souhlasím s VoiceOverem).

1. Opravy podle odpovědí po R: pásky (otázka 1), popisky a lístečky v Mapě a čase (2), Stoický týden ve vzhledu Spojení (3), lehčí stránky osob (4: obrys pobřeží mini mapy jako sdílený soubor, Dva životy jen s nabídkou), otočení listu (5), texty pojmů a deníku (8). K tomu zbylé letopočty mimo sazbu (84 míst v dist/: popisky obrázků, Kde jsme, kredity, nadtitulky Příběhu, popisky osy Dvou životů) přes nezlomitelne() a test, který v dist/ hledá „př. n. l.“ s obyčejnou mezerou.

2. Přepínač Klidný režim v záhlaví (bod 12 Vizuálních zlepšení): krátké přechody i bez nastavení systému (týž typ kratky jako pojistka plynulosti), čistý papír bez teček a bez natočení, poznámky pojmů na okraji tiskem (otázka 7). Stav v localStorage, nastavený skriptem v hlavičce před vykreslením (bez probliknutí), dostupný z klávesnice, s testem na 390 a 1440 px ve dne i v noci a s axe.

3. VoiceOver (otázka 6): v Safari na mém Macu projdi profil s pojmem, krok cesty s blokem, kresbu, deník s kapitolami a Mapu a čas; zapiš, co hlásí a v jakém pořadí. Kapitolu deníku předělej jen, když nadpis zmizí nebo jméno kapitoly nedává smysl.

4. Do testů dvanáct referenčních snímků klíčových obrazovek (Domů, profil, krok cesty s blokem, přehled cesty, velká otázka, období, Mapa a čas, deník s kapitolami, pojem, kresba, telefon a notebook, den a noc podle rozumu) s tolerancí, která snese rozdíl písma mezi Macem a Linuxem na GitHubu; snímky jen pro Chromium. Zpevni i zivot-na-mape.spec.ts:117 (rok z historie přehrávání, ne vzorkování).

5. docs/design.md napiš znovu a krátce (dnes 144 kB): tokeny, Papír (Spojení, Pravidlo střídmosti, stavy prvků), Pohyb (pravidla, přechody, pojistka plynulosti, Klidný režim), komponenty jen API a odkaz na soubor; co je ve skillu, neopakuj. Starou verzi beze změny do docs/archiv/. Skill atlas-komponenta dostane oddíly Papír a Pohyb (i kopie ve skills/) a docs/pouceni.md poučení z R a O jednou větou každé.

6. Ověř: npm run build, dotčené testy (npx vitest run; PW_BEZ_BUILDU=1 npx playwright test pro dotčené stránky a ty, které spadnou), axe a scripts/revize-tabulator.mjs na stránkách, kterých se oprava dotkla, celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

7. Do plánu větve zapiš oddíl Po O (co se změnilo, snímky v Claude outputs/snimky/design-v2-o/, nad čím jsi váhal) a otázku na schválení větve, kterou zodpovím jen já. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md a části plánu, které se změnily.

8. Pak se zastav a napiš mi, na které snímky se mám podívat.
```
