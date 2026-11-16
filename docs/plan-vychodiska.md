# Atlas myšlení — východiska plánu: kritika prototypu a volba techniky

29. 9. 2026 · Vojtěch Czempka · část plánu vývoje (`docs/plan.md`), oddělená 14. 11. 2026, aby se plán dal nahrát do Projektu Claude vcelku. Historický podklad; pro další práci ho není potřeba číst a do Projektu se nedává.

## Kritika současného stavu

Největší problém není technika, ale tón: atlas zatím učí hlavně argumentační hygienu na vymyšlených školních případech, a příběh, krása a životní váha filozofie se z něj vytrácejí.

### Technika souboru

- **3 MB v jednom souboru, 21 tisíc řádků.** Z toho 2,2 MB tvoří dva obrázky vložené jako base64 a 0,6 MB celá knihovna ikon Lucide, i když se používá pár ikon. Vlastní logika aplikace má kolem 60 kB.
- **Data, texty, styly a kód jsou promíchané.** 27 myslitelů je jeden řádek JSONu uvnitř skriptu, texty lekcí jsou v řetězcích JavaScriptu. Každá obsahová změna znamená zásah do kódu a v gitu je nečitelný rozdíl.
- **Není to ani skutečně samostatné:** písmo Manrope se načítá z Google Fonts, offline se tedy vzhled rozpadne (a v EU je vkládání Google Fonts i právně sporné).
- **Odpovědi po obnovení stránky mizí.** Pro domácí studium a „vrať se za pár dní“ je to zásadní nedostatek; aplikace to navíc musí studentovi vysvětlovat.
- Pro atlas s desítkami období a stovkami osobností by soubor rostl do desítek MB a práce s ním by byla pro člověka i pro AI čím dál pomalejší a chybovější.

### UI

- **Dva vizuální jazyky vedle sebe.** Profil Marca je hezký „časopisecký“ (velká patičková typografie, portrét, kapitoly). Profil Sókrata je generická karta s nadpisem „Ukázkový profil“, jiným písmem a zdvojeným nadpisem.
- **Viditelná chyba na každé stránce:** hlavní nadpis dostává programově fokus a kolem něj se kreslí silný černý rámeček.
- **Navigace se mění podle stránky:** jednou „Zpět na mapu“ v hlavičce, jinde kulaté tlačítko zpět plus drobečková navigace, jinde spodní lišta. Student nemá stálý pocit, kde je.
- **Mapa je šedá a prázdná:** moře a pevnina skoro splývají, města jsou velké bubliny, lidé se vybírají z rozbalovacího seznamu v bočním panelu. Na telefonu zabírá polovinu obrazovky prázdná plocha.
- **Osa je jen posuvník.** Životy nejsou vidět přímo pod mapou (jsou schované v bočním panelu), takže právě to, co má atlas nejlépe ukazovat (kdo žil s kým a jak daleko od sebe), není na první pohled vidět.
- **Lekce vypadají jako formulář:** textové pole, přepínače A/B/C, stránkování 1–6. Chybí obraz, scéna, atmosféra.

### Obsah a příklady

- **Příklady jsou býrokratické:** smazaný plakát ve sdílené složce, placená studijní aplikace, prodloužené přestávky, pochvala za školní projekt, sluchátka. Jsou bezpečné, ale nikoho nechytí a působí jako cvičení z kritického myšlení, ne jako filozofie.
- **Chybí skutečné příběhy, které má filozofie po ruce.** Cesta „Kdy mám dobrý důvod věřit?“ může začít věštírnou v Delfách („nikdo není moudřejší než Sókratés“), které Sókratés nevěří a jde ji prověřit. Lachétův argument o odvaze při ústupu má skvělý osobní protějšek: Alkibiadés v Symposiu líčí, jak Sókratés klidně ustupoval od Délia. Epiktétos byl otrok s chromou nohou, Diogenés řekl Alexandrovi, ať mu nestíní. To jsou vstupy, které si student zapamatuje.
- **Profily jsou tenké a nesourodé.** Marcus má 11 kapitol, Sókratés tři odstavce, Prótagorás je jen bod na mapě.
- **Hodnotový záměr (smysl života, autenticita, být lepším člověkem) se v aplikaci skoro neprojevuje.** Osobní rovina je zredukovaná na nepovinnou větu na konci.

### Plánovací dokumenty a prompty

- **Je jich příliš a jsou předělané na bezpečnost:** H01–H10, R1–R4, X1, stavy „implementováno, čeká na revizi“, desítky zákazů typu „nevytvářej“, „netvrd“, „neprezentuj“. Tahle obranná řeč pak prosakuje i do studentských textů, které se následně musí čistit (H01).
- **Čeština je kostrbatá a zhuštěná** („Neanimovat domyšlené cesty“, „Studentský text nech plynout“), místy obtížně srozumitelná i pro autora.
- **Prompty jsou psané pro jiný nástroj** (skilly v ChatGPT, modely Astra/Sol/Luna). Pro Clauda je potřeba je přepsat; samotné skilly navíc v repozitáři nejsou.
- **Workflow má zbytečné předávky:** scénář v Markdownu → specifikace interakcí → ruční přepsání do JavaScriptu → revize. Když se lekce píše rovnou z hotových komponent, dvě z těchto fází odpadají.

### README

- **Popisuje soubory, které v repozitáři nejsou:** `skills/`, `Plány hodin/`, `overeni/`, `docs/`, `AGENTS.md`. Ve skutečnosti je tam 6 souborů.
- **Místo pozvání je to provozní zápis** (import, kontrolní součty, „fiktivní git historie“). Chybí, proč projekt existuje, pro koho je, jak vypadá (snímek) a kde se dá vyzkoušet.
- **Chybí licence**, ačkoli projekt používá cizí fotografie pod CC BY. Zvolena nekomerční licence: CC BY-NC-SA 4.0 pro texty, MIT pro kód.

## Je jeden .html soubor správná volba?

Pro prototyp ano, pro atlas celé filozofie ne. Doporučuji statický web v Astru: výsledek jsou pořád obyčejné HTML stránky bez serveru, ale obsah, data a kód žijí odděleně.

| Varianta | Co získáme | Co ztratíme | Verdikt |
| --- | --- | --- | --- |
| Zůstat u jednoho HTML | Otevře se dvojklikem, jde poslat e-mailem | Roste do desítek MB, obsah zamčený v kódu, žádná kontrola dat, nečitelná historie změn | Jen pro prototyp |
| Více souborů bez sestavení (HTML + JS moduly + JSON) | Žádné nástroje | Nefunguje z disku (prohlížeč blokuje načítání JSON přes file://), žádné šablony stránek, vše ručně | Polovičaté |
| **Astro, statický web** | Obsah v Markdownu/MDX, data v YAML se schématem, každá stránka má vlastní adresu, interaktivní prvky jen tam, kde jsou potřeba, rychlé na telefonu | Je potřeba `npm run build` (udělá za tebe GitHub automaticky) | **Doporučuji** |
| Webová aplikace se serverem a účty | Synchronizace mezi zařízeními, třídy | Provoz, náklady, GDPR u nezletilých, údržba | Zatím ne |

Proč právě Astro:

- **Obsah jako text.** Profil Sókrata je soubor `socrates.mdx`, který se čte jako článek. Do něj se vkládají komponenty jako `<Volba>`, `<Odkryj>`, `<Pribeh>`. Lekci tak lze napsat rovnou v konečné podobě.
- **Obsahový kontrakt hlídá stroj.** Každý typ obsahu (osobnost, směr, pojem…) má schéma; chybějící rok úmrtí nebo odkaz na neexistující osobu zastaví sestavení dřív, než se dostane ke studentům.
- **Rychlost a dostupnost:** stránky jsou předpočítané, JavaScript se načítá jen pro mapu a cvičení. Offline režim (PWA) umožní atlas „nainstalovat“ na telefon.
- **Dobře se s ním pracuje v Claude Code:** malé soubory, jasná struktura, čitelné rozdíly v gitu.
- **Lokálně i veřejně:** zatím se spouští na tvém počítači příkazem `npm run dev`; zveřejnění na GitHub Pages je později jedno nastavení.

Další technické volby: interaktivní prvky ve Svelte (malé a čitelné komponenty), mapa přes d3-geo nad daty Natural Earth, vyhledávání Pagefind (statické, bez serveru), obrázky přes obrazovou pipeline Astra (automaticky zmenšené AVIF/WebP), písma uložená lokálně, ikony jen ty použité. Postup studenta a deník v prohlížeči (localStorage) s exportem do souboru, aby si je mohl přenést bez registrace.

