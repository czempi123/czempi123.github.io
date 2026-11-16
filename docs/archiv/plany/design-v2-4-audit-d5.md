# Větev design-v2, část: po auditu a herní prvky na plátně

Část plánu větve `docs/archiv/plany/design-v2.md` (oddíl Části plánu). Plán se 15. 11. 2026 rozdělil, aby každý soubor pro Projekt Claude měl pod 35 kB; text oddílů je beze změny.

## Po auditu (12. 11. 2026)

Audit atlasu (`docs/revize/audit-2026-11-12.md`) a dvě recenze (`docs/revize/recenze-obsahu-2026-11-12.md`, `docs/revize/recenze-mapa-denik-2026-11-12.md`) vedly k plánu `docs/plany/po-auditu.md`; autor ho 12. 11. 2026 přijal se všemi doporučeními. Pro tuhle větev z něj plyne:

- **Rozsah zůstává celý** včetně mapy jako výstřižku, kreseb jako koláže a pojmů. Návrh auditu zmenšit K7 neplatí: kresby jsou to nejzábavnější, co atlas má.
- **Design se dotáhne pro hry.** Herna (`herna-v1`) po sloučení postaví desítku nových formátů; nový krok D5 pro ně na plátně navrhne předměty a pohyb a K4a postaví jeden společný rám aktivity, takže nová hra pak znamená jen vnitřek.
- **Nové kroky:** D5 (plátno), K3 dodatek (stránky osob), K4 rozdělený na K4a a K4b, K7 na K7a a K7b. K5, K6, P, R a O mají navíc to, co je v tabulce kroků tučně nebo s číslem bodu z Vizuálních zlepšení.
- **Hotový obsah se nemění.** Kde krok narazí na slabé místo textu nebo stavby, zapíše ho do `docs/navraty.md` (kde, co, jedna věta) a jde dál.
- **Pořadí:** D5 → K3 dodatek → K4a → K4b → K5 → K6 → K7a → K7b → P → R → O → Uzavření. Kontrolní body se snímky pro autora jsou po D5, K4a (čtenářský sloupec), K5 a K7b.

### Vizuální zlepšení (12. 11. 2026)

Návrhy nad schválený vzhled, podle snímků po K2 a K3 a podle toho, že atlas má bavit a střídat formy. Nejdřív na plátno (D5), pak do kódu v uvedeném kroku. Pořadí je podle přínosu.

| # | Co | Proč | Kde |
| --- | --- | --- | --- |
| 1 | **Čtení a dělání vypadají jinak.** Souvislý text kapitoly leží na čistém listu vlepeném do zápisníku; aktivity jsou předměty položené na tečkovaném papíře mezi listy | dnes je zápisník jen v hlavičce a pod ní je obyčejný článek; student na první pohled pozná, kde čte a kde je na řadě on; řeší i tečky pod textem | D5, K3 dodatek, K4a |
| 2 | **Každá rodina aktivit je jiný předmět.** Volba: lístky, které se štípnou. Roztřiď: kapsy a obálky. Spor: dva přišpendlené lístky a mince na provázku. Seřaď na ose: šňůra s kolíčky. Tipni si: pravítko. Kdo to řekl?: otočné kartičky. Doplň citát: vystřižená slova jako v logu. Porota: hlasovací kotouček (v Athénách se hlasovalo bronzovými kotoučky). Pravý, nebo podvržený?: razítko. Najdi slabé místo: červená tužka | pestrost má být vidět dřív, než student začne číst zadání; dnes vypadá každý blok jako stejná karta | D5, K4a a K4b, `herna-v1` |
| 3 | **Studentova ruka.** Co student napíše nebo zvolí, je jeho perem: vlastní barva inkoustu a Kalam, odlišené od tisku atlasu. Barvu pera si jednou vybere ze tří | zápisník je pak vidět jako jeho; v deníku i v cestě pozná svoje stopy; malá volba, která dělá vlastnictví | D5, K4a, K6 |
| 4 | **Postup jako lístek, který se štípe.** Místo teček v hlavičce cesty týž lístek jako na přehledu: každý krok do něj štípne dírku, na konci se pahýl odtrhne a přistane v deníku | spojí lístek cesty, postup a sbírku do jednoho předmětu; odměna bez bodů | K5, K6 |
| 5 | **Každé období má vlastní papírnictví.** Vedle barvy tři věci: vzor pásky, ozdoba začátku kapitoly a styl razítka. Antika meandr, středověk iniciála a zlatá linka, renesance síť perspektivy, osvícenství rytina z encyklopedie, 19. století novinový tisk, 20. století psací stroj, dnes čtverečkovaný papír | průchod dějinami je vidět a pamatuje se podle prostředí; rozhodnout teď, než vznikne středověk | D5, K6 (tokeny `.obdobi-N`) |
| 6 | **Okraj stránky žije.** Na notebooku je vedle sloupce 680 px prázdno: poznámky tužkou („A ty?“), malý výstřižek mapy „kde jsme“, pojmy; kapitoly jako záložky na hraně stránky místo řádku odkazů | prázdný okraj je místo pro zvědavost a orientaci; na telefonu se totéž vejde mezi odstavce | K6, P |
| 7 | **Vlepené věci se nelepí stejně.** Pět citátů na stránce Sókrata má stejnou pásku ve stejném úhlu. Střídat: páska, sponka, špendlík, zastrčený roh, citát rukou na okraji; nejvýš jedna páska na obrazovku | co je všude, přestane být vidět | K3 dodatek |
| 8 | **Razítko člověka jako poštovní razítko doopravdy.** Kdo nemá atribut, má uprostřed rodné město a rok místo vlnovek | šest stejných razítek vedle sebe (Znali se u Sókrata) nic neříká; město učí, odkud kdo je | K3 dodatek |
| 9 | **Obraz ke kapitole.** Atribut nebo předmět kapitoly (pohárek, lucerna, loď) vytištěný jako velké vybledlé razítko u jejího nadpisu | filozofové jsou samé mramorové busty; kapitola dostane obraz, podle kterého se pamatuje | K3 dodatek, K7b |
| 10 | **Domů jako stůl se třemi až pěti věcmi k vzetí:** první lístek, dnešní pokus na pět minut, pohlednice s příběhem, složená mapa, a když už student něco má, pruh z jeho zápisníku | dnes je Domů text a tlačítko; krátké vstupy mají být vidět (pravidlo pestrosti 14) | K6 |
| 11 | **Aktivita na telefonu přes celou šířku** jako jeviště od okraje k okraji, ovládání v dosahu palce | hra se pozná od čtení i na malé obrazovce | K4a |
| 12 | **Klidný režim umí i čistý papír:** bez teček, bez natočení, krátké přechody | pro čtenáře, kterým zdobení ztěžuje čtení | O |

**Pravidlo střídmosti.** Papír je kulisa, ne obsah: na obrazovce nejvýš jedna ozdoba, která nic nenese, text delší než dvě věty se nenatáčí a rukou (Kalam) se nepíše nic delšího než poznámka. Každý nový předmět se staví z tokenů, které už jsou, a má klidový stav pro omezený pohyb.

**Co vyžaduje vrátit se do hotového:** body 7, 8 a 9 se dotýkají stránek osob z K3 (krátký dodatek před K4a); bod 1 mění rám kapitoly z K3.

### Mapa a deník: funkce (12. 11. 2026)

Podle `docs/revize/recenze-mapa-denik-2026-11-12.md`. Oběma nástrojům chybí úkol a to nejcennější v deníku je schované.

| Kde | Co |
| --- | --- |
| K6, deník | hlavní pohled **Moje filozofie** po velkých otázkách (na začátku, teď, kdo stál se mnou, **kdo by mi nejvíc odporoval**), výpis podle data až druhý; záznam jako lístek s cestou, krokem a volbou; záznamy podle cest; sbírka (razítka potkaných filozofů, odtržené pahýly lístků prošlých cest, vystřižené citáty) |
| K6, deník | přenos deníku odkazem nebo kódem QR, připomenutí zálohy po dokončené cestě; Moje filozofie na jednu stránku k vytištění; tichá tečka u ikony Deník, když čeká Návrat |
| K6, profil na telefonu | záložky otázek až za úvodní odstavec (dělá už K3 dodatek) |
| K7a, mapa | řeka životů: výchozí jen učitel a žák, větší řádky, legenda barev, zvýraznění současníků vybraného člověka; pravý panel bez vybraného člověka (co se ten rok dělo, všichni žijící); nové jméno pro Stín odkazu („Ukázat i ty, na které někdo navazuje“); popisky na telefonu bez překryvů; první návštěva jen s mapou, rokem a jednou výpravou, zbytek pod „Víc“ |
| K7a, mapa | razítko u lidí, které student už potkal; klepnutí na město ukáže, co tu bylo |
| `herna-v1` | **Výpravy** na mapě (tři až pět otázek na období: tipni, ověř na mapě, zapiš) a **Přehrát období** (minuta, kdy rok běží sám) |
| celek nebo `herna-v1` | hračka Čtyři školy v jednom městě (plán Athén) |

Pravidla pro každý další nástroj (osa, přehled, mapa náboženství): začíná otázkou a končí krokem dál; nejcennější věc je první obrazovka; ukazuje studentovy stopy; výchozí pohled má jedno kódování; zrcadlo ukáže i protivníka.

## Po D5 (13. 11. 2026)

Autor 12. 11. večer poslal zadání K4 ze staré kopie plánu v Projektu Claude (kopie byla z 9. 11., bez kroků po auditu); po dotazu zvolil D5 podle plánu. Kód atlasu se nezměnil. Na plátně přibyla řada „D5 Herna“ se dvěma stránkami, každá ve dne i v nočním zápisníku a na notebooku (1440) i telefonu (390). Komentáře na plátně žádné nebyly.

### Co je na kterých stránkách plátna

- **Herní prvky** (`project/Herna.dc.html`; noc a telefon ji vkládají s `rezim="noc"` a `uzky="1"`). Nahoře přepínače Den / Noční zápisník, Skutečná / Čtyřikrát pomaleji a Omezený pohyb (jeden pro celou stránku). Pak:
  - **Rám aktivity** na živé Volbě z cesty 1: hlava (rodina aktivit v inkoustu období s tečkou, název), zadání (scéna a otázka), plocha, zpětná vazba jako lístek s páskou, pata (Začít znovu vlevo, hlavní čin vpravo). Rám není list: je to pole přímo na tečkovaném papíře, vymezené čtyřmi rohovými značkami tužkou. Na telefonu jde od okraje k okraji a pata drží u spodní hrany okna (`position: sticky`), hlavní tlačítko přes celou šířku.
  - **Deset předmětů**, každý živý, se skutečným obsahem a s řadou stavů (klid, najetí, stisk, zvoleno, zakázáno, fokus): Volba = lístky s pahýlem, které se štípnou (dírka, vtlačení, kroužek perem kolem písmene); Roztřiď = papírové kapsy s čelem do V, karta se zasune za čelo a kus kouká (cesta 6); Spor = dva přišpendlené lístky a mince na prověšeném provázku s pěti uzlíky (cesta 1); Seřaď na ose = šňůra s kolíčky, na telefonu svisle, výměna dvou karet klepnutím, roky až po správném pořadí; Tipni si = papírové pravítko 0 až 1000 let s jezdcem v barvě pera, po odhalení ryska a čárkovaná svorka rozdílu; Kdo to řekl? = otočná kartička (Diogenés o stolovosti, DL VI, 53); Doplň citát = vystřižená slova do vtlačené mezery (Obrana 38a); Porota = dva hlasovací kotoučky, plná a dutá osa, a štěrbina urny; Pravý, nebo podvržený? = kulaté razítko „řekl to“ a hranaté „neřekl to“, otisk na ústřižku; Najdi slabé místo = věty argumentu na linkovaném listu a tah červenou tužkou (Epikúrův argument z cesty 8).
  - **Herní pohyb**, který v předmětech není: zamíchání (balíček a rozdání po jedné), klepnutí do slepé mapy (špendlík v barvě pera, razítko místa, čárkovaná spojnice; z klávesnice kříž šipkami a Enter), razítko „sedí“ a lístek „zkus to jinak“, příběh v obrazech (pět panelů koláže o věštbě z Delf, student listuje).
  - **Tokeny**: přehled, který pohyb bere kterou délku a křivku (jen na notebooku).
- **Zlepšení vzhledu** (`project/Zlepseni.dc.html`): body 1 až 5 z Vizuálních zlepšení, každý jako dnes a návrh.
  1. Kapitola 01 Sókrata: dnes text na tečkách a blok jako karta s linkou; návrh text na čistém listu s jednou páskou a aktivita v rámu na tečkách. Přepínač tří variant čtenářského sloupce: tečky, ztlumené tečky (tečka na 35 %), čistý list.
  2. Odkaz na Herní prvky a seznam deseti předmětů.
  3. Studentova ruka: tři pera na výběr (tlačítka s tahem „moje pero“), Volba se zakroužkovaným písmenem, pole v Kalamu a záznam v deníku, vše v barvě zvoleného pera; kontrast u každého pera.
  4. Postup cesty: dnes tečky a „Krok 2 ze 7“; návrh lístek cesty se sedmi místy, hotový krok je vyštípnutá dírka, běžící krok číslo v kroužku perem, pahýl „7 kroků, 14 min“ se po posledním kroku odtrhne (tlačítko Další krok to přehraje).
  5. Papírnictví osmi období: pro každé období páska, začátek kapitoly a razítko.

### Nové tokeny

| Token | Den | Noc | Kde |
| --- | --- | --- | --- |
| `--z-karta` | 40 ms | 40 ms | krok mezi kartami při zamíchání a rozdání; jediná nová délka, ostatní herní pohyb bere tokeny z Po D3 |
| `--pero` (výchozí modrá) | `#1F4AA8` | `#9DB7F5` | stopa studenta: kroužek, text v poli (Kalam), záznam v deníku, jezdec, mince ve Sporu, špendlík v mapě, obrys zvednuté karty, běžící krok na lístku |
| pero fialová | `#6B2D8C` | `#D2A6EE` | druhé pero na výběr |
| pero sépiová | `#7B4420` | `#E0AE7C` | třetí pero na výběr |
| `--cervena-tuzka` | `#B3261E` | `#F08A7E` | jen tah v Najdi slabé místo; správně a špatně se barvou nerozlišuje nikde |

**Který pohyb co bere:** otočení kartičky `--d-list`, `--k-list`; přichycení (karta do kapsy, na šňůru, mince po provázku, kotouček do urny) `--d-presun`, `--k-papir`; dopad (štípnutí lístku, razítko „sedí“, otisk, ryska na pravítku, špendlík, slovo do mezery) `--d-listek`, `--k-dopad`; rozložení lístku zpětné vazby a „zkus to jinak“ `--d-listek`, `--k-papir`; kroužek a tah červené tužky `--d-tah`, `--k-papir`; zvednutí karty a uzlík `--d-stisk`; panel příběhu `--d-list`, `--k-list`.

**Papírnictví období** (K6 je zapíše do `.obdobi-N`):

| Období | Páska | Začátek kapitoly | Razítko |
| --- | --- | --- | --- |
| 1 Počátky a klasické Řecko | meandr | řecký klíč u čísla | dvojitý rámeček (dnešní) |
| 2 Helenismus a Řím | mozaika | oblouk z kostek nad číslem | ovál |
| 3 Středověk | dvě linky s kosočtverci | číslo v dvojitém rámečku iniciály | lomený oblouk |
| 4 Renesance a raný novověk | síť perspektivy | úběžník za číslem v kruhu | kruh s vnitřním kruhem |
| 5 Osvícenství | šrafy rytiny | šrafovaný medailon | kartuše s dvojitou linkou |
| 6 19. století | novinový rastr | novinová hlavička (dvojitá linka, tučný titulek) | dvě dvojité linky nad a pod |
| 7 20. století | přeškrtnuto na stroji (řada x) | strojopis s čárkovanou linkou | čárkovaný rámeček |
| 8 Po válce a dnes | čtverečkovaný papír | čtverečky pod nadpisem | tečkovaný štítek |

### Co se proti design systému a Po D3 změnilo

- **Blok není ležící list, ale pole na tečkách se čtyřmi značkami.** List (`--list`) patří čtení; tím se čtení a dělání liší na první pohled (bod 1). Staré zadání K4 počítalo s `.papirovy-list`.
- **Lístek zpětné vazby je tiskem (Newsreader 18 px), ne Kalamem** jako v ukázce Volby v D3: zpětná vazba má dvě až tři věty a Pravidlo střídmosti rukou dovoluje jen poznámku. Kalam zůstává nápovědám o jedné větě („Vyber kartu, pak kapsu.“) a slovům „zkus to jinak“.
- **Kroužek kolem písmene má barvu pera**, ne inkoust období.
- **Koše jsou kapsy, škála Sporu je provázek**, místo vtlačené plochy a vtlačené drážky z D3.
- **„Sedí“ a „zkus to jinak“** jsou jediná dvojice pro správně a jinak: kulatý otisk v inkoustu a lístek s šipkou tužkou a jednou větou, kam se podívat. Bez červené a zelené.
- **Roky v Seřaď na ose** se ukážou až po správném pořadí.

### Kontrola

- **Kontrast** nových dvojic výpočtem (jednorázový skript, smazaný) na papíru, listu, ploše a lístku: pero modrá nejméně 6,89 : 1 ve dne a 6,19 : 1 v noci, fialová 7,53 a 6,14, sépiová 6,66 a 6,19; červená tužka 5,58 a 5,09; zlato (ozdoba, mez 3 : 1) 3,44 ve dne a 6,35 v noci; rohové značky tužkou 3,24 a 3,34; text lístku zpětné vazby (`--ink-2` na lístku) 9,80 a 7,68; inkoust období na listu nejméně 5,72 ve dne a 5,80 v noci.
- **Vykreslení:** obě stránky jsem vykreslil v Chrome na 390 a 1440 px ve dne i v noci vlastním jednoduchým během komponent (ne v editoru plátna) a proklikal všech deset předmětů i čtyři pohyby. Nic nepřetéká do stran, všechna tlačítka a pole mají aspoň 44 × 44 px (karta v kapse na telefonu 100 × 45). Plynulost pohybu jsem tím během ověřit nemohl (překresluje celou stránku); délky a křivky jsou z tokenů.
- **V editoru plátna jsem stránky neotevřel.** Kdyby se něco nevykreslilo, napiš, která stránka a co.

### Nad čím jsem váhal a co by šlo jinak

- **Červená tužka má vlastní barvu.** Plán ji jmenuje jako předmět. Jinak: podtrhávat perem studenta a žádnou červenou nemít (otázka 6).
- **Psací stroj bez strojového písma.** Atlas má tři písma; 20. století proto nese řada x na pásce, proložený bezpatkový řez a čárkovaná linka. Opravdový strojopis by chtěl čtvrté písmo (otázka 7).
- **Karty v kapse na telefonu jsou zmenšené** (60 %) a text na nich je čitelný jen zčásti; co v kapse je, říká čtečce popisek kapsy a studentovi lístek zpětné vazby. Jinak: na telefonu kapsy pod sebou přes celou šířku.
- **Obsah ukázek nových formátů není ověřený a do atlasu nejde bez `atlas-overeni`:** kotoučky s plnou a dutou osou (Aristotelés, Athénská ústava 68, popisuje 4. století; jestli se tak hlasovalo už roku 399 př. n. l., je třeba ověřit), věta o nádobě a ohni (Plútarchos, O poslouchání 48C, na internetu připisovaná Sókratovi), 519 let mezi roky 399 př. n. l. a 121 n. l. Volba, Roztřiď, Spor, Slož argument, citáty a kapitola Sókrata jsou z atlasu.
- **Mapa v ukázce** je po připomínce autora (13. 11.: „mapa by měla být kvalitnější“) pobřeží z Natural Earth (`world-atlas` 50m, `geoConicConformal`) jako výstřižek staré mapy: pevnina `--listek` s obrysem `--ink-2`, dvě vodní linky podél pobřeží, moře šrafované tužkou, dvojitý rámeček. Delfy jsou na skutečném místě.
- **Středověk v papírnictví** po dvou připomínkách autora (13. 11.: velké P vypadalo špatně; plná dlaždice se zlatem pak „měla jinou stylistiku“ než ostatní období): středověk se kreslí stejně jako ostatní, jen linkou ve svém inkoustu. Zlato (`--zlato`) z návrhu vypadlo. **Pravidlo papírnictví:** každé období má jeden inkoust a ozdoby jsou tenká kresba kolem čísla psaného rukou; žádné plné plochy, druhá barva ani vložená písmena.
- **Stránky jsou vyšší než strop rámu plátna** (8000 px): Herní prvky mají na notebooku asi 10 300 px a na telefonu 12 600 px, stejně jako design systém z D2 přetékají rám.
- **Jeden přepínač Omezený pohyb pro celou stránku**, ne u každé ukázky jako v D3: ukázek je čtrnáct.
- **Příběh v obrazech** je koláž z nejjednodušších výstřižků (postava, chrám, hora, zem); výtvarně ho dotáhne až `herna-v1` s obsahem.

## Co rozhodnout po D5

Prázdná odpověď znamená souhlas s doporučením.

1. **Čtenářský sloupec:** tečky, ztlumené tečky, nebo čistý list (přepínač u bodu 1 na stránce Zlepšení vzhledu)? Doporučuji čistý list; K4a ho vyfotí na skutečném textu a můžeš to tam změnit.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K3 dodatku 13. 11. 2026)

2. **Rám aktivity jako pole se čtyřmi značkami na tečkách** (ne ležící list) a pata s Začít znovu vlevo a hlavním činem vpravo? Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K3 dodatku 13. 11. 2026)

3. **Tři pera: modrá, fialová, sépiová, výchozí modrá.** Vyhovují barvy? Doporučuji ano; volba pera bude v deníku a při první odpovědi.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K3 dodatku 13. 11. 2026)

4. **Zpětná vazba tiskem na lístku s páskou, rukou jen krátké nápovědy?** Doporučuji ano.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K3 dodatku 13. 11. 2026)

5. **Deset předmětů** (lístky, kapsy, mince na provázku, šňůra s kolíčky, pravítko, otočná kartička, vystřižená slova, kotouček, razítko, červená tužka): chceš některý jinak? Bez odpovědi zůstávají.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K3 dodatku 13. 11. 2026)

6. **Červená tužka s vlastní barvou jen v Najdi slabé místo**, nebo tam podtrhávat perem studenta? Doporučuji červenou tužku.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K3 dodatku 13. 11. 2026)

7. **Papírnictví osmi období** podle tabulky. U 20. století: stačí strojopis naznačený (řada x, čárkovaná linka), nebo později přidat čtvrté, strojové písmo jen pro to období? Doporučuji teď nepřidávat a rozhodnout, až 20. století vznikne.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K3 dodatku 13. 11. 2026)

8. ~~Zlatá linka u středověku~~ Vyřízeno 13. 11. 2026: autor chtěl středověk ve stejné stylistice jako ostatní období, zlato vypadlo.
   Odpověď: bez zlata (13. 11. 2026)

9. **Lístek postupu:** hotový krok vyštípnutá dírka, běžící krok číslo v kroužku perem, pahýl se po posledním kroku odtrhne do deníku? Doporučuji ano (K5 a K6).
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K3 dodatku 13. 11. 2026)

10. **Plán větve má 143 kB.** Provedená zadání (D2 až K3, D5) a zodpovězené otázky (před D2, po D2, po D3, po K1, po K2) přesunout do `docs/archiv/`, aby se plán i jeho kopie v Projektu Claude četly levněji? Doporučuji ano; udělá to K3 dodatek jako první věc.
   Odpověď: prázdná, tedy souhlas s doporučením (zjištěno v K3 dodatku 13. 11. 2026)

## Zadání K3 dodatek: stránky osob po auditu

Opus 5.5 · high (xhigh při zaseknutí). Pusť v novém chatu v Projektu Atlas filozofie, až odpovíš na otázky po D5 (prázdná odpověď znamená souhlas).

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Úkol: krok K3 dodatek větve design-v2, stránky osob po auditu. Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit). Archiv nečti.

0. git switch design-v2, git status bez necommitnutých změn (nesledované „Atlas myšlení — kritika…md“ a „Claude outputs/“ nech být). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v plánu větve docs/archiv/plany/design-v2.md tabulku kroků, oddíly Po K3 (Co se na stránkách osob změnilo, Vnořený papír s páskou), Po auditu (body 1, 7, 8 a 9 z Vizuálních zlepšení, Pravidlo střídmosti), Po D5 a Co rozhodnout po D5 s mými odpověďmi a toto zadání; když odpovědi v repozitáři nejsou, vezmi je z Projektu Claude. docs/design.md nečti. Načti skill atlas-komponenta. Na plátně https://claude.ai/artifact/LFhmRMNnjzfSfq5xvt7dNQ přečti z project/Zlepseni.dc.html jen styly a tělo bodu 1 (třídy ct, kap, paska). Když odpovědi po D5 něco mění, zapiš to do Po K3 dodatku a drž se jich.

1. Když je odpověď 10 po D5 ano (nebo prázdná): přesuň z plánu větve do docs/archiv/plany/design-v2-d1-k3.md provedená zadání (D2, D3, D4, K1, K2, K3, D5) a zodpovězené otázky (Co rozhodnout před D2, po D2, po D3, po K1, po K2) beze změny textu; v plánu po nich nech jeden řádek s odkazem. Oddíly Po D3, Po D4, Po K1, Po K3, Po auditu a Po D5 zůstávají. Samostatný commit.

2. Přechod listu a let fotky (otázka 8 po K3): v opravdovém Chromu (ne headless; Claude in Chrome nebo vestavěný prohlížeč nad npm run dev) otevři profil Sókrata, dole v Kam dál klepni na kartu Platóna a ověř, že se list otočí a fotka z karty přiletí na desku; totéž z Lidí na Sókrata a tlačítkem Zpět (bez příchodu). Když ne, oprav (src/layouts/Zakladni.astro, global.css › Přechody, Příchod, Let fotky) a zapiš příčinu.

3. Kapitola na čistém listu (bod 1), podle varianty čtenářského sloupce z odpovědi 1 po D5: souvislý text kapitoly profilu a medailonku leží na čistém listu vlepeném do zápisníku (jedna páska na list, text se nenatáčí), bloky a kresby mezi kapitolami zůstávají na tečkovaném papíře. Jen stránky osob; kroky cest a ostatní stránky udělá K4a a K6. Ověř čtení na telefonu (okraje, délka řádku do 80 znaků).

4. Vlepené věci se nelepí stejně (bod 7): citáty na stránce střídají pásku, sponku, špendlík, zastrčený roh a citát rukou na okraji (krátký citát na notebooku); nejvýš jedna páska na obrazovku. Pořadí dej podle pořadí citátu na stránce, ne náhodně, ať se stránka při načtení nemění. Vnořený citát zůstává lepicí lístek (Po K3).

5. Razítko člověka (bod 8): kdo nemá atribut, má uprostřed rodné město a rok narození z dat (src/data/lide.yaml, mista.yaml; „asi“ zůstává „asi“) místo vlnovek; Astro verze (src/components/ui/RazitkoCloveka.astro, src/lib/razitko.ts). Kdo nemá ani místo, vlnovky zůstanou. tests/data/razitko.test.ts doplň.

6. Obraz ke kapitole (bod 9): atribut nebo předmět kapitoly ze spritu atributy.svg jako velké vybledlé razítko u nadpisu kapitoly, jen tam, kde kapitola předmět má (pole v MDX, výchozí nic); u Sókrata, Diogena a Epikúra vyber po jedné kapitole jako vzor a zbytek zapiš do docs/navraty.md. Obsah textu neměň.

7. Na telefonu záložky velkých otázek až za úvodní odstavec profilu (VstupyOsoby.astro, StrankaProfilu.astro); deska a první odstavec zůstávají na první obrazovce (test v stranky-osob.spec.ts).

8. Ověř: npm run build, npx vitest run, PW_BEZ_BUILDU=1 npx playwright test pro stranky-osob, prohlidka, obsah, platon, seneca, aristoteles, celek7-profily, krates-hipparchia, medailonky, doba-odkazy, otazka, ram a odkazy; node scripts/kontrola-fokus.mjs na profilu Sókrata a Thaléta na 390 a 1440 px; kontrast nových dvojic výpočtem (skript v scripts/, po výpisu smaž; trvalé dvojice do tests/data/kontrast.test.ts). Snímky node scripts/snimky-listy.mjs pro Sókrata, Seneku a Thaléta na 390 a 1440 px ve dne i v noci do Claude outputs/snimky/design-v2-k3d/. Celé npm test jednou před posledním commitem. Restartuj náhled npm run dev.

9. Do plánu větve zapiš oddíl Po K3 dodatku: co se změnilo, výsledek ověření přechodu, nad čím jsi váhal, otázky Co rozhodnout po K3 dodatku; zadání K4a nech, jak je, jen když něco z tohoto kroku mění jeho předpoklady, uprav ho. Commit v design-v2, na GitHub nic. V Projektu Claude aktualizuj docs/archiv/plany/design-v2.md.

10. Pak se zastav a napiš mi, na které snímky se mám podívat.
```

