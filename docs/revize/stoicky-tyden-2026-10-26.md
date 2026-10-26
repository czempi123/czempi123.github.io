# Revize větve stoicky-tyden (krok R)

26. 10. 2026 · Opus 5.5 · skilly `atlas-revize` a `atlas-psani`. Předmět: stránka `/tyden/stoicky/` (data `src/content/tydny/stoicky.yaml`), karta týdne na posledním kroku a přehledu cest 5, 33 a 34, karty v Kam dál portrétů Seneky, Epiktéta a Marca, deník, zastavení `t:stoicky` a list `ucitel/stoicky-tyden.md`.

**Verdikt: po opravách.** Dva důležité nálezy, tři drobné, žádný blokující. Týden je postavený poctivě: den 5 nesahá na jídlo, den 6 se ptá jen na studentovy činy, den 7 bere „nepomohl žádný“ jako odpověď a nikde není série ani počítání. Slabá místa jsou v jedné větě námitky, která o Epiktétovi říká víc, než řekl, a ve dvou mezích, které nedržely pravidla týdne z podkladů.

## Co jsem ověřil

- **Citáty proti originálu v `zdroje.yaml`:** `seneca-ep-18-6-val` sedí s latinou (*decurrit* „cvičí“, *sine ullo hoste* „bez jediného nepřítele“, *ut sufficere necessario possit* „aby zvládl tu nutnou“); `hovory-v-1`, `rukojet-1-5`, `hovory-ix-30`, `seneca-ira-iii-36-otazky`, `rozpravy-iii-2-4` a `seneca-ep-13-4` mají dílo, místo, originál a převod.
- **Senekova otázka** „Tohle bylo to, čeho jsem se bál?“ je *Hoc est quod timebatur?* z Dopisu 18, 5; jako slova sedí, v týdnu ji student klade nad pohodlím místo nad chudou stravou, a to text nezastírá.
- **Světlo a žena** (O hněvu III, 36, 3: *cum sublatum e conspectu lumen est et conticuit uxor*) i to, že otázky jsou Sextiovy a zvyk Senekův, drží pramen.
- **„Epiktétos učil žáky“** u Rukojeti 1, 5 obstojí: Rukojeť je Arriánův výtah z jeho výuky a cvičení stojí v rozkazovacím způsobu (μελέτα ἐπιλέγειν). „Tomu prvnímu, co se v nich zvedne“ je volný, ale věrný převod „drsného dojmu“.
- **Výklad a pramen v listu pro učitele** jsou oddělené (Hadot, Irvine, Ellis a Beck v tabulce pozdějšího podání; Gellius a Diogenés Laertios jen tam).
- **Rozhraní:** `node scripts/kontrola-fokus.mjs` na `/tyden/stoicky/`, `/tyden/stoicky/#den-7`, přehledu a kroku 8 cest 5, 33 a 34, portrétech Seneky, Epiktéta a Marca a deníku na 390 i 1440 px bez nálezu. Snímky `Claude outputs/tyden/tyden-r-*` (stránka na 390 světlá a 1440 tmavá, dny 2, 4 a 6, karta týdne na kroku 8 cesty 5 tmavá). Hotovo, zrušení, Další den, den 7 a deník po obnovení, deník bez týdne, export a nahrání drží `tests/e2e/tyden.spec.ts` a `tests/data/tydny.test.ts`; prošly v celém `npm test`.

## Opraveno rovnou

- **Den 4, text za citátem:** „Pojmenuj tři věci kolem sebe a řekni si jednu, kterou s tou starostí dnes uděláš“ se četlo, jako by „jedna“ byla jedna ze tří věcí kolem. Nově: „Pak se vrať a pojmenuj tři věci kolem sebe. Nakonec si řekni jednu věc, kterou s tou starostí dnes uděláš.“
- **Nadtitulek karty v Kam dál portrétů** „Zkus to žít · sedm dní“ sjednocen se stránkou a kartou týdne na „Zkus to žít · 7 dní“ (test `seneca.spec.ts`).
- **List pro učitele:** otázka ke dni 5 už nemá v uvozovkách „dokud se nic neděje“ (Seneca to tak neříká); den 3 v tabulce mezí ukazuje na kartu v cestě 33 a citát zvlášť; poslední věta nově netvrdí, že „každý den“ má větu „řekni to někomu“ (dny 4 až 6 ji nemají; den 4 ji dostane v nálezu 2).

## Nálezy

### [důležité] Námitka na první obrazovce říká, že Epiktétos nechtěl klid
- **Kde:** `src/content/tydny/stoicky.yaml`, `namitka.text`; stránka týdne nahoře, nad citátem `rozpravy-iii-2-4`.
- **Co je špatně:** „Česky se ‚stoicky‘ říká tomu, co člověk snese bez hnutí, ale Epiktétos od svých žáků chtěl něco jiného“. Snést věci bez hnutí mysli je přesně to, co Epiktétos chtěl (*apatheia*, Rukojeť 1 a 5); Rozpravy III, 2, 4 odmítají jen necitelnost sochy. Podklady (oddíl Kde je odpověď slabá) výslovně říkají, že týden nesmí tvrdit víc, než že stoikové nechtěli kamennou tvář.
- **Proč to vadí studentovi:** odnese si, že stoicismus klid nehledá, a za dva dny čte ve dni 2 cvičení na přesně takový klid. Námitka, kterou má týden poctivě unést, se tím rozpustí ve slovní hříčce.
- **Oprava:** „Česky se ‚stoicky‘ říká tomu, co člověk snese bez hnutí. Epiktétos chtěl po svých žácích klid, a přesto jim říkal:“ (citát beze změny; test `tyden.spec.ts:21` hlídá jen první větu a projde).

### [důležité] Meze dnů 3 a 4 nedrží pravidla týdne
- **Kde:** `stoicky.yaml`, pole `mez` dnů 3 a 4.
- **Co je špatně:** Podklady (Pravidla týdne, body 2 a 5) chtějí, aby blízcí, nemoc a smrt do cvičení nepatřily a aby student, kterému je po cvičení hůř, řekl to někomu. Den 3 (představa nejhoršího) vylučuje jen přemítání a člověka, který ubližuje; nemoc a strach o někoho ne. Den 4 je vylučuje, ale u pocitu odcizení říká jen „přestaň“, bez věty, komu to říct; podklady ji tam měly („pojmenuj tři věci nahlas a řekni to někomu“).
- **Proč to vadí studentovi:** student, jehož matka čeká na výsledky vyšetření, si ve dni 3 vybere právě tohle a pět minut si představuje nejhorší; „malá věc“ ho nezastaví. Student, kterého pohled shora odpojí od sebe, zůstane s tím pocitem sám, přičemž je to jediný den, kde podklady takové riziko jmenují.
- **Oprava:**
  - den 3: „Když se ti ta věc točí v hlavě už teď, dnešek přeskoč. Na nemoc, strach o někoho ani na člověka, který ti ubližuje, cvičení není: o tom řekni někomu, komu věříš.“
  - den 4: „Na ztrátu, nemoc, strach o někoho ani na to, co ti někdo dělá, cvičení není. Když se po něm cítíš od všeho daleko, přestaň a řekni to někomu, komu věříš.“
  - v listu pro učitele řádky 3 a 4 tabulky mezí podle toho doplnit („nemoc a strach o někoho“; „říct to někomu“).

### [drobné] Den 3: citát odpovídá na jinou otázku a tři dny po sobě začínají „Vyber“
- **Kde:** `stoicky.yaml`, den 3, `text`.
- **Co je špatně:** „Proč na to myslet schválně…? Seneca to příteli vysvětlil v dopise:“ a pak Dopis 13, 4. Ten je v Senekově dvojici rad druhá strana („netrp předem“, podklady celku 10, oddíl b); proč promýšlet, vysvětluje Dopis 24, 2. Spojovací věta tak Senekovi připisuje odpověď, kterou citát nedává. Navíc dny 3, 4 a 5 začínají „Vyber“ (a den 1 po citátu „vyber si“), a dny 3 a 5 mají stejnou stavbu „Proč … schválně…? Seneca … v dopise“.
- **Proč to vadí studentovi:** čte-li týden najednou, pozná šablonu; a kdo zná cestu 33, ví, že tahle věta tam stála jako protiváha představy nejhoršího.
- **Oprava:** první odstavec „Které malé věci se v nejbližších dnech trochu bojíš? Třeba testu nebo rozhovoru. Vezmi jednu a na pět minut si ji promysli. Co nejhoršího se může rozumně stát? Co bys pak udělal jako první? Co z toho máš v rukou už dnes?“; druhý „Myslet na to, čeho se bojíš, zní jako zbytečné trápení. Seneca ale příteli v dopise napsal, jak to se strachem bývá:“. Text za citátem beze změny.

### [drobné] Den 5: příklad „odpověď na zprávu až večer“ si někdo všimne
- **Kde:** `stoicky.yaml`, den 5, `text`; list pro učitele, oddíl Den 5.
- **Co je špatně:** cvičení chce pohodlí, „bez kterého se dnes obejdeš a nikdo si nevšimne, že chybí“. Odpověď na zprávu až večer si všimne ten, kdo psal, a může to být kamarád, který zrovna potřebuje odpověď.
- **Proč to vadí studentovi:** příklad odporuje pravidlu o dvě věty dřív a staví cvičení na úkor druhého.
- **Oprava:** „Cesta autobusem bez sluchátek, přestávka bez telefonu, večer bez seriálu.“ V listu pro učitele „(sluchátka, telefon o přestávce, seriál)“.

### [drobné] Den 2: „Vztek ani strach tím nezmizí“ je přísnější než Epiktétos
- **Kde:** `stoicky.yaml`, den 2, `poCitatu`.
- **Co je špatně:** u Epiktéta se vášeň nerozhoří, když dojmu nedám souhlas; nezabránitelné je jen první hnutí (Gellius XIX, 1, v listu pro učitele). Věta bez „hned“ říká, že cvičení na cit nemá žádný vliv.
- **Proč to vadí studentovi:** dostane o Epiktétovi opačnou informaci než v cestě 5 a nebude vědět, proč to cvičení dělat.
- **Oprava:** „Vztek ani strach tím hned nezmizí. Dostaneš jen chvíli, než podle nich něco uděláš.“
