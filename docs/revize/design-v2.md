# Revize větve design-v2 (krok R, 15. 11. 2026)

Revize celé větve: všechny typy stránek na 390 a 1440 px ve dne i v noci, přístupnost, pohyb a výkon. Odpovědi po P byly prázdné v repozitáři i v Projektu Claude, takže platí doporučení a na pojmech se nic neměnilo.

**Verdikt:** po opravách. Nic blokujícího. Atlas drží Spojení na všech typech stránek kromě Stoického týdne; axe je čistý všude, tabulátor nikde nezůstane pod lištou, omezený pohyb vypne všechno. Zbývá střídmost ozdob (pásky), popisky v Mapě a čase na telefonu, Stoický týden, váha stránek osob a ověření kapitol deníku skutečným VoiceOverem.

## Inventura: typy stránek a adresy

| Typ | Adresa |
| --- | --- |
| Domů | `/` |
| Lidé a směry | `/lide/` |
| Otázky | `/otazky/` |
| Mapa a čas | `/mapa/` |
| Profil | `/osobnost/sokrates/` |
| Společný profil | `/osobnost/krates-a-hipparchia/` |
| Medailonek | `/osobnost/thales/` |
| Přehled cesty | `/cesta/kdy-mam-dobry-duvod-verit/` |
| Krok cesty | `/cesta/kdy-mam-dobry-duvod-verit/5/` (Spor), `/3/` (Příběh) |
| Velká otázka | `/otazka/jak-zit/` |
| Období | `/obdobi/helenismus-a-rim/` |
| Směr | `/smer/stoicismus/` |
| Myšlenkový pokus | `/pokus/gyguv-prsten/` |
| Úvody | `/co-je-filozofie/`, `/nabozenstvi/` |
| Tradice | `/nabozenstvi/judaismus/` |
| Pojem a Pojmy | `/pojem/ctnost/`, `/pojmy/` |
| Můj deník s kapitolami | `/denik/` (plný deník z `tests/e2e/data/denik-kapitoly.json`) |
| Tvoje antika | `/denik/antika/` |
| Stoický týden | `/tyden/stoicky/` |
| Příprava hodiny | `/hodina/nova/` |
| Hodina a promítání | `/hodina/?v=1&n=Delfy&z=k:kdy-mam-dobry-duvod-verit/1,k:kdy-mam-dobry-duvod-verit/2` (promítání tlačítkem Promítat hodinu) |
| Dílna | `/dilna/bloky/` |
| 404 | `/neexistuje/` |

## Co prošlo strojově

- **Axe** (WCAG 2.1 AA) na všech 24 adresách výš, 390 a 1440 px, den a noc, plný deník zvlášť: 0 nálezů, nic nepřetéká do šířky (`scripts/revize-axe.mjs`, nově s proměnnou `ULOZISTE`).
- **Kontrast tokenů výpočtem:** úplná matice 17 inkoustů (tisk, ruka, `muted`, tři pera, červená tužka, osm inkoustů období) na pěti plochách (papír, list, plocha, malá plocha, lístek) ve dne i v noci a tužka jako hranice i na malé ploše; doplněno do `tests/data/kontrast.test.ts` (494 kontrol, všechny projdou). Pod hranicí jsou jen dvojice, které v atlasu nestojí: text na tmavém papíru období (nese ho `--na-papiru`), text přes tečku papíru (tečka je ozdoba) a `--period-N-soft` (jen okraj mince).
- **Fokus** (`scripts/kontrola-fokus.mjs`) na všech typech na 390 a 1440 px: v pořádku kromě dvou překryvů v Mapě a čase (nález 3).
- **Skutečný tabulátor** (`scripts/revize-tabulator.mjs`, nový) na 1440 × 900, 1440 × 640, 390 × 844 a 390 × 640 na 15 typech a v plném deníku: nic pod lištou, nic bez rámečku. Hlášení „Dát sem“ v Roztřiď je planý poplach (rámeček kreslí koš přes `:has`).
- **Pohyb** (`scripts/revize-design-v2-pohyb.mjs`, nový) na 17 typech: sám od sebe se hýbe jen příchod (titulek, pruh, pásky na Domů a stránkách osob) a kresby s pohybem; posouvání stránky nespustí nic kromě stínu hlavičky (120 ms). Při omezeném pohybu na žádné stránce animace delší než 1 ms.
- **Čtečka:** strom přístupnosti pěti míst (`scripts/revize-ctecka.mjs`, nový). Pojem je „věštírny, tlačítko“ uprostřed věty, Spor skupina přepínačů „Kde stojíš ty?“ s vypnutým „Tady stojím“, kresba figure s přepínačem pohledů a popisem, Mapa a čas lístečky „Athény: 7 lidí“, aktivní období s `aria-current`. Kapitola deníku je v Chromiu rozbalovací tlačítko se stavem a uvnitř nadpis 3. úrovně. VoiceOver na Macu jsem nepouštěl (nález 6).
- **Výkon** (`scripts/revize-vykon.mjs`, nový; viditelný Chrome, 390 × 844, procesor 6× pomalejší, síť Fast 3G): otočení listu Otázky → Lidé 45, 56 a 57 snímků za sekundu, nejdelší snímek 117 až 182 ms; let fotky Lidé → Sókratés 43 snímků, nejdelší 167 až 201 ms, první příchod 4,6 s; posun listu mezi kroky 57 až 64; posun roku v Mapě a čase 57 (nejdelší 132 ms); kresby Jeskyně a Stejný vítr 60. Pod 30 snímků za sekundu nic.

## Nálezy

### [důležité] Příběh bez obrazu a bez osoby ukazoval prázdný rámeček (opraveno)
- **Kde:** `src/components/ui/Deska.astro`; první kroky šesti cest, krok 3 cesty Kdy mám dobrý důvod věřit?, Co je filozofie?, Judaismus, dílna.
- **Co je špatně:** deska bez obrazu kreslila razítko jen u osoby; scéna bez osoby dostala prázdný tečkovaný list se dvěma páskami a popiskem („Athény. Tady Sókratés hledal…“). Komentář Příběhu přitom slibuje ornament období.
- **Proč to vadí studentovi:** na telefonu je první obrazovka kroku prázdný rámeček přes 300 px, který vypadá jako nenačtená fotka.
- **Oprava:** deska bez obrazu a bez osoby kreslí ornament období z pásu na Domů (amfora a meandr, oblouk, …) tužkou v barvě období, poloprůhledně (`.deska__orn`). Snímek `r-opravy-montaz.jpg`.

### [důležité] Víc pásek na jedné obrazovce
- **Kde:** Mapa a čas (dvě pásky na rozích výstřižku a třetí nad Výpravou, na telefonu na jedné obrazovce); Domů (oba lístky „na začátek“); Můj deník (Návrat, každá kapitola, Napříč obdobími); deska v hlavičce osoby a hned pod ní páska listu kapitoly.
- **Co je špatně:** Pravidlo střídmosti dovoluje na obrazovce nejvýš jednu ozdobu, která nic nenese, a bod 7 nejvýš jednu pásku.
- **Proč to vadí studentovi:** co je všude, přestane být vidět; pásky soupeří s obsahem a deník s kapitolami vypadá jako lepicí arch.
- **Oprava (návrh, otázka 1):** Výprava bez pásky (stačí ležící list); druhý lístek „na začátek“ se sponkou místo pásky; kapitoly deníku bez pásky (lístek s ohybem jako rozpracované otázky), páska jen u Návratu; deska osoby nechá své dvě pásky, první list kapitoly pod ní pásku nedostane.

### [důležité] Mapa a čas na telefonu: popisky přes sebe a lístečky přes sebe
- **Kde:** `/mapa/`, 390 px (rok 360 př. n. l.); osa událostí na 1440 px.
- **Co je špatně:** „Středozemní moře“ leží přes měřítko a „Natural Earth“, KRÉTA pod kreditem, IÓNIE pod lístečkem Athén; lístečky Kyzikos a Chalkédón se překrývají (dvě tlačítka přes sebe, `kontrola-fokus.mjs`). Na notebooku se na ose překrývají tlačítka „Řecko-perské války“ a „Bitva u Salamíny“.
- **Proč to vadí studentovi:** názvy moří a krajů nejdou přečíst a prstem trefí jiné město, než chtěl.
- **Oprava (návrh, otázka 2):** popisek kraje nebo moře, který by ležel pod lístečkem, měřítkem nebo kreditem, se schová (obdélníky jako u lístečků); z dvou překrytých lístečků zůstane u menšího místa jen špendlík, jak už to mapa dělá, když se lísteček nevejde; kratší událost na ose dostane popisek pod osou.

### [důležité] Stoický týden zůstal ve starém vzhledu
- **Kde:** `/tyden/stoicky/`.
- **Co je špatně:** titulek bez vytrženého listu a pruhu, dny jako karty s barevným okrajem vlevo (starý vzhled s tintou), ne lístky na tečkovaném papíru.
- **Proč to vadí studentovi:** jediná stránka atlasu, která vypadá jako z jiného webu; z deníku na ni vede Zkus to žít.
- **Oprava (návrh, otázka 3):** v kroku O titulek s pruhem („Stoický týden.“ / „Sedm dní, sedm cvičení“), dny jako lístky, otevřený den jako čistý list, „Kdy přestat“ jako lepicí lístek; texty beze změny.

### [důležité] Stránky osob jsou těžké: mini mapa a Dva životy
- **Kde:** `dist/osobnost/*/index.html`. Nejtěžší Aristotelés 269 kB, Platón 265 kB, Sókratés 237 kB (po kompresi asi 56 až 60 kB).
- **Co je nese:** obrys pobřeží v mini mapě je v každé stránce znovu jako SVG (50 kB z 269), vlastnosti ostrovu Dva životy s daty všech osob 23 kB, skripty v hlavičce 24 kB, styly 20 kB, razítka 14 kB, čitelný text 29 kB.
- **Proč to vadí studentovi:** na pomalé síti první příchod na profil trval 4,6 s; padesát stránek osob stahuje tentýž obrys pobřeží znovu.
- **Oprava (návrh, otázka 4):** obrys pobřeží jako jeden soubor (`<use href>` nebo `<img>` pod body mini mapy), který prohlížeč stáhne jednou; Dva životy dostanou jen seznam do nabídky (jméno a roky) a zbytek si dočtou. Úspora asi 70 kB na stránku.

### [důležité] Otočení listu: první snímek trvá až 200 ms (pojistka doplněna)
- **Kde:** přechod mezi stránkami (`global.css` › Přechody), měřeno při šestkrát pomalejším procesoru.
- **Co je špatně:** v průměru 43 až 57 snímků za sekundu, ale první snímek přechodu trvá 117 až 201 ms (nová stránka se vykresluje); na levném telefonu, který je pomalejší než emulace, může otočení trhat.
- **Proč to vadí studentovi:** cukající list působí jako chyba, ne jako papír.
- **Oprava:** pojistka `src/scripts/plynulost-prechodu.ts`: skript v hlavičce změří každé otočení a po dvou ze tří pod 30 snímků za sekundu dává zařízení krátké prolnutí (typ přechodu `kratky`, 240 ms, jen průhlednost). Test `tests/data/plynulost-prechodu.test.ts` a `ram.spec.ts` (krátký přechod bez rubu listu). Na emulaci se nepřepnula, protože průměr drží nad 30 (otázka 5).

### [důležité] Kapitoly deníku a VoiceOver neověřené
- **Kde:** `/denik/`, `details.kapitola` s `<h3>` v `<summary>` (K6 dodatek).
- **Co je špatně:** v Chromiu je kapitola rozbalovací tlačítko se stavem a nadpis uvnitř zůstává (jde na něj skočit). Safari s VoiceOverem ale dává `summary` roli tlačítka, jehož obsah může čtečka sloučit do jednoho jména bez nadpisu; tohle jsem skutečnou čtečkou neověřil. Jméno tlačítka je navíc dlouhé: „období 1 Počátky a klasické Řecko 650–300 př. n. l. · naposledy 9. listopadu 2026“.
- **Proč to vadí studentovi:** nevidomý student by v rotoru nadpisů kapitoly nenašel a u každé slyšel datum.
- **Oprava (návrh, otázka 6):** v kroku O ověřit VoiceOverem v Safari (pět míst z kroku R); když nadpis zmizí, předělat kapitolu na vzor nadpis s tlačítkem uvnitř (`<h3><button aria-expanded>`); datum dát do popisu (`aria-describedby`), ne do jména.

### [drobné] Poznámky pojmů na okraji jsou ručním písmem o dvou větách
- **Kde:** profily a kroky cest od 1100 px.
- **Co je špatně:** vysvětlení pojmu (dvě věty, sedm až devět řádků) je Kalamem v malém stupni; Pravidlo střídmosti dovoluje ruku na poznámku, a tahle je na hraně.
- **Proč to vadí studentovi:** student, kterému čtení dělá potíže, ruku čte pomaleji než tisk.
- **Oprava (návrh, otázka 7):** v Klidném režimu (krok O) jsou poznámky na okraji tiskem (Newsreader 15 px); jinak beze změny.

### [drobné] Texty větve: čtyři vysvětlení pojmů začínají záporem
- **Kde:** `src/content/pojmy/obec.md`, `soud.md`, `stesti.md`, `vedeni.md`; `/denik/` pruh a perex.
- **Co je špatně:** „Ne vesnice ani úřad, ale…“, „Ne soud u soudu, ale…“, „…ne nálada, ale…“, „Vědět neznamená…, ale…“ je čtyřikrát tatáž stavba (`atlas-psani` › záporná paralela). Pruh deníku „Jen tvůj, jen v tomhle prohlížeči.“ a perex „…Zůstávají jen v tomto prohlížeči; nikdo jiný je nevidí…“ říkají totéž dvakrát pod sebou. Ostatní nové texty (popisky, nápovědy, stůl, mapa, deník, 26 pojmů) jsou v pořádku: krátké, konkrétní, bez strojových obratů.
- **Proč to vadí studentovi:** stejný začátek čtvrtý den za sebou student pozná a přestane číst pozorně.
- **Oprava (návrh, otázka 8):** obec „Řecký městský stát: město s okolím, které si samo vládne a má vlastní zákony, bohy a vojsko. Řek se představoval jménem své obce, ne vesnice.“; soud „Úsudek, který si o věci uděláš: že je strašná, nespravedlivá nebo že ji musíš mít. Stoikové učili, že se dá prozkoumat a opravit.“; štěstí nechat, jak je; perex deníku „Tvoje odpovědi, stanoviska a výzvy. Nikdo jiný je nevidí a nic se nehodnotí.“

### [drobné] Letopočty se lámaly a několik oprav na jednom řádku (opraveno)
- **Kde a co:** „423 př. n. / l.“ v pohlednici a ve 107 místech sestaveného webu: `nezlomitelne()` (`src/lib/sazba.js`) teď váže i letopočet (číslo, „př.“, „n.“, „l.“; test v `tests/data/sazba.test.ts`), v sestavení zbylo 84 míst mimo sazbu (popisky obrázků, „Kde jsme“, kredity, nadtitulky Příběhu, popisky osy Dvou životů), ty projde krok O. Pohlednice na Domů s pěti větami byla natočená o 0,8°: stojí rovně (text delší než dvě věty se nenatáčí). „Zpět na Lidé a směry“ → „Zpět na Lidi a směry“ (`Hlavicka.astro`, `ram.spec.ts`). Zod v ostrovu Slož argument: ostrov bral konstantu z `bloky-schema.ts` a přibalil si celé schéma; konstanty jsou v `src/lib/argument-id.ts` a balíček klesl ze 114 kB na 17 kB (po kompresi z 33 na 6,4 kB); validace zůstává při sestavení.

## Co se neověřilo

- **iPhone autora** a skutečný levný Android: měřeno jen v Chromu se šestkrát zpomaleným procesorem a pomalou sítí. Pojistka plynulosti se na opravdovém zařízení zapne sama, když bude potřeba.
- **VoiceOver:** jen strom přístupnosti v Chromiu (nález 6).
- **Přehrát život** v Mapě a čase skript nespustil (tlačítko je až v kartě člověka); plynulost posunu roku se měřila šipkou.

## Snímky

`Claude outputs/snimky/design-v2-r/`: `r-<typ>-<šířka>-<režim>-*.jpg` pro všech 24 typů (390 a 1440 px, den a noc), kroky cesty Kdy mám dobrý důvod věřit? (`kdy-mam-dobry-duvod-verit-<šířka>-<režim>-odkryt-<krok>.jpg`), okraj s pojmem (`r-okraj-sokrates-1440-*`, `r-listek-sokrates-390-dark`) a opravy (`r-opravy-montaz.jpg`).
