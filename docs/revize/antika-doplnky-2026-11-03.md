# Revize větve antika-doplnky (R), 3. 11. 2026

Skilly `atlas-revize` a `atlas-psani`. Revidováno všech jedenáct nových stránek (Co je filozofie?, Co je náboženství?, judaismus, období 1 a 2, čtyři směry, dva pokusy), stránky otázek 2 a 8, Tvoje antika a změny v cestách 6 a 33. Podklady: `docs/podklady/antika-doplnky.md`, `docs/podklady/nabozenstvi-uvod.md`. Archiv jsem nečetl.

## Verdikt

**Připraveno ke schválení po opravách.** Nic blokujícího. Stránky drží podklady, rozlišení filozofie a náboženství je na obou úvodních stránkách stejné, odkazy i katalog hodin jsou bez chyby a Tvoje antika nic nehodnotí. Tři nálezy se týkají toho, co se student na stránce naučí: v pokusu Proč hřmí? stojí za filozofii věta bez důvodu, na stránce otázky 2 nemá zastánce student, který slib dodrží, a stránka období 1 říká o mýtu a filozofii opak toho, co učí Co je filozofie?.

## Co bylo ověřeno

- **Sestavení a testy:** `npm run build` prošlo; celé `npm test` po opravách prošlo (kontrola typů bez chyb, 936 testů dat, 686 testů v Playwrightu).
- **Odkazy:** skript nad `dist/` (165 stránek, dílna vynechána): žádný odkaz ani kotva nevede na neexistující stránku, včetně pásu období na Domů a v Lidech, štítků směrů, drobečků, nadtitulků medailonků a všech Kam dál.
- **Příprava hodiny:** `scripts/hodiny-katalog.mjs` proti `dist/`: 0 chyb, 155 stránek, 11 celých nových stránek, 42 hlasů (30 + 12 nových), oddíly, bloky a příběhy nových stránek jsou zastavení; Zrcadlo času nemá štítek „na začátek hodiny“.
- **Prohlížeč:** listy všech nových stránek na 390 px světle a 1440 px tmavě (`Claude outputs/snimky/r/`, skript `scripts/revize-antika-doplnky-snimky.sh`), Tvoje antika s prázdným a plným deníkem; částečný deník a obnovení stránky hlídá `tests/e2e/tvoje-antika.spec.ts`.
- **Fokus a překryvy:** `scripts/kontrola-fokus.mjs` na 14 stránkách a obou šířkách: nic pod lištou, nic nepřetéká. Pět hlášených „překryvů“ na 390 px je planý poplach: odkazy v zavřených Pramenech mají v Chromiu rozměry, i když nejsou vidět (`checkVisibility()` = false); po otevření Pramenů se nic nepřekrývá (`scripts/revize-antika-doplnky-prameny.mjs`). Nález 10.
- **Citáty:** každý citát z nových stránek je v atlasu nejvýš dvakrát. Doložený detail „občan světa“ je ve větvi třikrát (nález 6).
- **Pramen navíc:** Seneca, Naturales quaestiones II, 18 (The Latin Library), Anaximandrův výklad hromu; IEP „Anaximander“ a SEP „Anaximander“ o hromu nemají nic víc než podklady (nález 1).

### Kontroly ze zadání

| Kontrola | Výsledek |
| --- | --- |
| Co je filozofie? a Co je náboženství? rozlišují stejně | ano: mýtus je na obou „posvátné vyprávění“, které „neznamená výmysl“, náboženství je modlitba, obřad a společenství kolem posvátného a o pravdivosti rozhoduje otázka 9. Rozpor je jen na stránce období 1 (nález 3). |
| Období a směry neříkají totéž co portréty slovo od slova | dvě shody opraveny rovnou (Sókratés „se ptal lidí na věci, kterým podle sebe rozuměli“ potřetí; Karneadés a Chrýsippos dvakrát na sousedních směrech); Epikureismus kvůli tomu nechává scénu založení na profilu. |
| Nové stránky otázek a úvody nemluví šablonou | ano: otázka 8 otevírá otázkou, takže „Představ si…“ má pět z osmi stránek otázek; perexy nových stránek začínají každý jinak. Slabší jsou uvozovací věty hlasů otázky 2 (nález 8). |
| Tvoje antika nic nehodnotí, prázdný, částečný i plný deník | ano; důvod u myslitele někdy začíná větou, která bez kroku cesty nedává smysl (nález 7). |
| Náboženství očima věřícího i nevěřícího | Roztřiď, Durkheim i Otto drží obě strany; závěrečná otázka Co je náboženství? a jedna věta judaismu ne (nález 5). |
| Citát nejvýš dvakrát v celku | citáty ano; detail „občan světa“ ne (nález 6). |
| Odkazy z pásu období, štítků směrů a Kam dál | všechny vedou na existující stránku; Kam dál „Je Bůh?“ vede na řádek přehledu bez stránky (nález 9). |
| Příprava hodiny zná nová zastavení | ano. |

## Opraveno rovnou

- **Cesta 33, krok 8** (odpověď 3 po K2): „jeho větu o budoucnosti najdeš na konci tohohle kroku“ → „na konci cesty“; platí i v Tvoje antika, kde krok není.
- **Období 1:** „skutečný Sókratés chodil po stejném městě a ptal se lidí na věci, kterým podle sebe rozuměli“ (potřetí po portrétu a cestě 1) → „skutečného Sókrata potkávali v ulicích téhož města“.
- **Akademie, Spor:** dvě věty o Karneadovi a Chrýsippovi opakovaly stránku stoicismu slovo od slova a odkaz sliboval „jak to viděla druhá strana“, ač tam stojí totéž. Nově: „Karneadés si za protivníka vybral stoiky, hlavně Chrýsippa. Proč by bez Chrýsippa nebylo ani Karneada, vypráví stránka stoicismu.“
- **Kynismus:** v Založení Diogenés „vysedával u něj, dokud ho nepřijal“ a o dvě věty dál ho přijme až po holi → „chodil za ním dál“; z myšlenky 2 vypuštěna věta o Epikúrovi a cestě Kolik je dost?, kterou odstavec Spor říká o kus níž znovu.
- **Stoicismus, Spor:** „Stejná otázka stojí na začátku velké otázky Jsem svobodný?“ (otázka 4 začíná jinou otázkou) → „Jak na ni odpovídal sám Chrýsippos, najdeš u velké otázky Jsem svobodný?“ (Chrýsippův válec tam je).
- **Období 2:** „Stoikové učili víc, lidé jsou…“ → dvojtečka.
- **Gýgův prsten, hlas Epikúra:** „Epikúros by se o duši nepřel“ se čte jako souhlas → „Epikúros by odpověděl jinak, bez řádu v duši.“
- **Otázka 2, hlas Sókrata:** prázdná uvozovací věta „Platón ji zapsal takhle:“ → „Kritón musel nejdřív odpovědět na otázku, kterou mu Sókratés položil:“.

Žádnou z vět nehlídal test.

## Nálezy

### [důležité] 1. Za filozofii stojí v pokusu Proč hřmí? věta bez důvodu, a o blesku
- **Kde:** `src/content/uvody/co-je-filozofie.mdx`, oddíl Proč hřmí?, odpověď 3, a odstavec o Anaximandrovi v Odkryj.
- **Co je špatně:** Odpověď 3 zní „Blesk je záblesk světla, který na okamžik zazáří na tmavém mraku.“ Na otázku, proč hřmí, neodpovídá a žádný důvod v ní není. Odkryj pak tvrdí, že filozofie je „odpověď, která stojí na důvodu, a s důvodem můžeš souhlasit, nebo se o něj přít“.
- **Proč to vadí studentovi:** Pokus je první výstup RVP G na celé stránce: student má poznat, čím se filozofie liší. Ve větě, která filozofii zastupuje, ten rozdíl nenajde; nejpřesněji zní věda a filozofie vypadá jako slabší popis.
- **Oprava:** Seneca zapsal Anaximandrův výklad hromu i s odpověďmi na námitky (Naturales quaestiones II, 18; latinský text jsem četl v The Latin Library: „Tonitrua, inquit, sunt nubis ictae sonus. Quare inaequalia sunt? Quia et ipse ictus inaequalis est. […] At quare aliquando non fulgurat et tonat? Quia spiritus infirmior non valuit in flammam, in sonum valuit.“). Odpověď 3: „Hrom je zvuk mraku, do kterého narazí vítr. Proč nezní každý hrom stejně? Protože ani náraz není pokaždé stejný. A proč někdy zahřmí, a neblýskne se? Na oheň byl vítr moc slabý, na zvuk mu síla stačila.“ Odkryj, třetí odstavec: „Náraz větru do mraku je výklad Anaximandra, Thalétova krajana z Milétu; po šesti stoletích ho zapsal Seneca. To je filozofie: odpověď, která stojí na důvodu, a s důvodem můžeš souhlasit, nebo se o něj přít. Anaximandros neměl čím hrom změřit. Odpovídal ale i na námitky, a jeho odpověď šlo zkoumat.“ Do `zdroje.yaml` pramen `seneca-nq-ii` (The Latin Library, `https://www.thelatinlibrary.com/sen/sen.qn2.shtml`), řádek do `k-overeni.md` jako ověřený; IEP „Anaximander“ v poznámce Odkryj nahradit. Navazuje i na Oblaka na stránce období 1 (Sókratés tam vysvětluje hrom mraky, které do sebe narážejí).

### [důležité] 2. Otázka 2: kdo by mobil vrátil, nemá zastánce
- **Kde:** `src/content/otazky/co-je-spravne.md`, odpovědi všech šesti hlasů.
- **Co je špatně:** Případ končí volbou „splněný slib, nebo to, co chtěl večer“. Platón, Prótagorás, Aristotelés, Epikúros i Marcus radí mobil teď nevracet, Sókratés slib podmiňuje spravedlností. Podklady (d) dávaly odpovědi „vrať, slíbil jsi“ Sókrata a Marca; Marcus nakonec radí opak („Nevracej mu ho jen proto, že křičí“).
- **Proč to vadí studentovi:** Student, který slib dodrží (a tím respektuje, že mobil je kamarádův), čte šest hlasů proti sobě. Stránka mluví jedním hlasem, i když „vrať a nech ho rozhodnout“ je poctivá odpověď; `docs/pouceni.md`: cesta dá slovo i tomu, kdo nesouhlasí.
- **Oprava:** Marcus podle Hovorů VIII, 59 („Tak je pouč, nebo je snášej“): „Vrať mu ho: je jeho a slíbil jsi to. Řekni mu napřed, čeho se bojíš, a když tě neposlechne, nezlob se a snášej ho dál.“ Myšlenka hlasu a citát zůstávají. Alternativa: sedmý hlas Epiktéta (co kamarád napíše, není v tvé moci; tvoje je, jestli dodržíš slovo), s citátem z Rukojeti 1 nebo 5, který už atlas má.

### [důležité] 3. Období 1 říká o mýtu a filozofii opak Co je filozofie?
- **Kde:** `src/content/obdobi/pocatky-a-klasicke-recko.mdx`, poslední odstavec scény.
- **Co je špatně:** „Lidé se v ní začali ptát po důvodech tam, kde dřív stačil příběh, a ne všem se to líbilo.“ Věta tvrdí přechod od příběhu k důvodu. Co je filozofie? učí, že pět odpovědí „nejsou schody“ a že vodu jako počátek znali už básníci; podklady (a, ř. 4) psát „opustil mýtus“ výslovně zakazují.
- **Proč to vadí studentovi:** Student z obou stránek odnese dvě protichůdné věci, a věřící student z období 1 to, že příběh je stupeň před rozumem.
- **Oprava:** „Lidé v ní začali chtít důvody, o kterých se dá přít, a ne všem se to líbilo.“

### [důležité] 4. Mapka judaismu: popisky přes sebe
- **Kde:** `/nabozenstvi/judaismus/`, Kde a kdy na 390 px (`MistaTradice.astro` → `MiniMapa.astro`); odpověď 1 po T2.
- **Co je špatně:** Popisek Alexandrie leží na řádku „centrum od 70 n. l.“ u Javne a body Javne a Jeruzaléma splývají; na 1440 px je to lepší, ale ne čisté.
- **Proč to vadí studentovi:** Mapka má ukázat, kudy tradice šla; na telefonu se nedá přečíst. Seznam pod ní to zachrání jen napůl.
- **Oprava:** V O, ne v R: jde o sdílenou komponentu mini mapy (profily a medailonky), která potřebuje testy a snímky ve skillu `atlas-komponenta`. Návrh: v mapce tradice jen jména (role a roky zůstanou v seznamu pod ní) a u bodů blíž než asi 40 px popisek západnějšího bodu doleva (`text-anchor: end`).

### [důležité] 5. Náboženství očima věřícího: dvě místa staví čtenáře zvenku
- **Kde:** `src/content/uvody/co-je-nabozenstvi.mdx`, poslední odstavec oddílu Jak náboženství zkoumá věda; `src/content/nabozenstvi/judaismus.mdx`, oddíl Tóra a smlouva, odstavec za Dt 30,19.
- **Co je špatně:** Závěrečná otázka stránky zní „Komu z těch tří bys dal za pravdu, kdybys chtěl rozumět kamarádovi, který chodí každou neděli do kostela? A komu, kdybys tam chodil sám?“ Čtenář je tu nevěřící a věřící jen v podmínce; a stránka, která začíná kostelem, končí zase kostelem. Na judaismu stojí „Volit musí každý sám.“ jako výklad jednotného čísla v Dt 30,19; jednotné „ty“ v Deuteronomiu ale často oslovuje celý lid, a o smyslu posvátného textu tu rozhoduje atlas.
- **Proč to vadí studentovi:** Věřící student (a muslimský či židovský tím spíš) čte, že stránka počítá s tím, že nevěří, a jeho víru vidí jako možnost. Židovský student čte výklad své Tóry podaný jako fakt.
- **Oprava:** Co je náboženství?: „Komu z těch tří bys dal za pravdu, kdybys chtěl rozumět spolužákovi, který každý týden chodí do kostela, do synagogy nebo do mešity? A komu, kdyby ses ptal sám na sebe?“ Judaismus: „Všimni si, že Mojžíš mluví k celému lidu, a přesto říká ti, ne vám. Volí tu celý lid jako jeden, nebo každý sám za sebe?“

### [drobné] 6. „Občan světa“ třikrát ve větvi
- **Kde:** `src/content/obdobi/helenismus-a-rim.mdx` (otázka doby 8), `src/content/smery/kynismus.mdx` (myšlenka 3), `src/content/otazky/jak-spolu-mame-zit.md` (hlas Diogena, citát `dl-vi-63`); k tomu profil Diogena.
- **Co je špatně:** Tentýž doložený detail (Diogenés na otázku, odkud je, odpoví jediným slovem) je ve větvi třikrát, na směru a u otázky skoro stejnými slovy.
- **Proč to vadí studentovi:** Kdo jde z období přes kynismus k otázce 8, čte totéž potřetí a hlas Diogena ho už nepřekvapí.
- **Oprava:** Období 2, otázka 8: „Stoikové učili, že moudrý se má starat o obec, pokud mu v tom nic nebrání. Epikúros radil žít spíš stranou, mezi přáteli. A Marcus Aurelius, který se o obec starat musel, si připomínal, že co neprospívá úlu, neprospívá ani včele.“ (`hovory-vi-54` je pak dvakrát.)

### [drobné] 7. Tvoje antika: důvod někdy začíná větou z kroku cesty
- **Kde:** `/denik/antika/`, „Kdo to viděl podobně jako ty“ (`TvojeObdobi.svelte`); třeba Marcus („Jestli nemáš, protože máš moc povinností…“) a Seneca („Jestli jsi stál uprostřed, máš Seneku.“) u otázky 1.
- **Co je špatně:** Důvod je první věta odstavce Kdo je na tvé straně, která navazuje na otázku kroku. Co student „nemá“ a „uprostřed“ čeho stál, řekne až řádek „cesta · tvoje odpověď“ pod důvodem.
- **Proč to vadí studentovi:** Přehled čte o týdny později, bez kroku cesty; první věta u myslitele je hádanka.
- **Oprava:** Řádek „cesta · tvoje odpověď“ dát nad důvod (pořadí v `TvojeObdobi.svelte`, testy hledají podle tříd, ne pořadí). Nic jiného se nemění.

### [drobné] 8. Uvozovací věty hlasů otázky 2 bez situace
- **Kde:** `src/content/otazky/co-je-spravne.md` (Epikúros „O zákonech to napsal takhle:“, Marcus „Do zápisníku si to shrnul do dvou vět:“), `jak-spolu-mame-zit.md` (Marcus „Stačila mu na to jedna věta:“, Epikúros „napsal v jedné ze svých hlavních myšlenek:“).
- **Co je špatně:** `atlas-psani`: uvozovací věta dá citátu situaci (komu, kdy, na co odpovídal). Tyhle říkají jen, že teď přijde citát; hotové stránky otázek mají situaci skoro u každého hlasu.
- **Proč to vadí studentovi:** Šest hlasů pod sebou s uvozovkou „takhle:“ čte jako výčet.
- **Oprava:** V O ke každé situaci z podkladů nebo z hotového portrétu, nic nevymýšlet; kde žádná není, krátce a věcně („O zákonech napsal:“). Sókratovu větu jsem opravil rovnou.

### [drobné] 9. Kam dál na Co je náboženství? vede na otázku bez stránky
- **Kde:** `src/content/uvody/co-je-nabozenstvi.mdx`, třetí karta Kam dál „Velká otázka 9 · Je Bůh?“ (`/otazky/#je-buh`).
- **Co je špatně:** Karta vypadá jako další stránka, ale vede na řádek přehledu otázek, kde otázka 9 odkaz nemá. T2 ji nechal úmyslně, protože o otázce 9 stránka mluví.
- **Proč to vadí studentovi:** Slepá ulička: klepne a nic nenajde.
- **Oprava:** Do vzniku stránky otázky 9 kartu nahradit stránkou, která existuje a na hranici religionistiky navazuje: „Velká otázka 6 · Co je skutečné?“ (`/otazka/co-je-skutecne/`). Až otázka 9 stránku dostane, vrátit (zapsat do Co zůstává na později).

### [drobné] 10. Kontrola fokusu hlásí odkazy ze zavřených Pramenů
- **Kde:** `scripts/kontrola-fokus.mjs`; na 390 px u stoicismu, kynismu, Akademie a období 2.
- **Co je špatně:** Obsah zavřeného `<details>` má v Chromiu rozměry, a skript ho počítá jako překryv s odkazem v patičce. Po otevření Pramenů se nic nepřekrývá.
- **Proč to vadí studentovi:** Nevadí; vadí revizi, protože planý poplach zakryje skutečný.
- **Oprava:** Ve skriptu vynechat prvky, pro které `checkVisibility()` vrací false, a poučení do `docs/pouceni.md` › Technika.

## Co zůstává na O mimo nálezy

- Kam dál z medailonků s `tradice: zidovska` na stránku judaismu (odpověď 2 po T2, pravidlo z dat).
- Úprava skillů a poučení podle zadání O.
