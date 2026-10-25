---
name: "atlas-osobnost"
description: "Psaní stránky osobnosti v Atlasu myšlení (portrét, profil, medailonek), stránky směru nebo pojmu: příběh scénou, velké myšlenky s vlastním pokusem, Zkus to žít, šablona MDX, rychlá kontrola."
---

# Osobnost v Atlasu myšlení

Stránka osobnosti má studentovi ukázat živého člověka při práci: scénu, ve které se rozhoduje nebo ptá, myšlenku v nejsilnější verzi a jeden pokus, který si student vyzkouší sám. Je hotová, když ji šestnáctiletý člověk dočte dobrovolně, na konci ví, co ten člověk myslel a proč, a aspoň jednou sám odpověděl dřív, než si přečetl filozofa.

Tón a pravidla obsahu jsou v `CLAUDE.md` a `docs/styl.md`. Jak psát, aby se stránka četla jako dobrá kniha a nezněla jako stroj (úvody, citáty, rytmus, strojové obraty), drží skill `atlas-psani`: načti ho před psaním. Bloky a jejich API v `docs/design.md` › Bloky, rozvržení stránky v › Mezery, mřížka, tvary (středová osa stránky osobnosti). Hotové vzory: `src/content/osobnosti/sokrates.mdx` (portrét) a `protagoras.mdx` (profil).

## Tři hloubky

| Hloubka | Pro koho | Co stránka má | Kde vzniká |
| --- | --- | --- | --- |
| **Medailonek** | každý na mapě | jméno, roky, místa, směr, věta „kdo to byl“ (`kdo`), věta „proč si ho pamatujeme“ (`proc`), vztahy | jen data v `src/data/lide.yaml`, bez MDX |
| **Profil** | důležití lidé období | úvod scénou, velký citát, 1–2 kapitoly s blokem, Doba a lidé, dvě velké myšlenky s vlastním pokusem, Zkus to žít, Kam dál | `src/content/osobnosti/<id>.mdx`, `hloubka: profil` |
| **Portrét** | 1–3 klíčové postavy období | totéž, ale celý život ve 4–6 kapitolách, každá s blokem pro studenta; navíc Spor nebo Změň jednu věc | `src/content/osobnosti/<id>.mdx`, `hloubka: portret` |

Hloubku určuje `docs/architektura.md` a pole `hloubka` v `lide.yaml`. Doba a lidé, mini osa, mapa a vztahy se generují z dat; ručně se do nich píšou jen dvě až tři věty (místo narození, konec života).

Stránka směru a pojmu se řídí stejnými zásadami (scéna, nejsilnější verze, vlastní pokus), jen místo životního příběhu vypráví okamžik, kdy směr nebo pojem vznikl.

## Postup

1. **Přečti** `CLAUDE.md`, `docs/styl.md`, skill `atlas-psani`, podkladový list celku (`docs/podklady/…`: Nejsilnější příběhy, Tvrzení s doporučenými formulacemi, Citáty, Rozpory a rozhodnutí), poslední záznamy v `docs/rozhodnuti.md`, osobu v `lide.yaml` a citáty osoby v `zdroje.yaml`.
2. **Podklady nejdřív.** Každé historické tvrzení musí být v podkladovém listu nebo v datech. Když příběh něco potřebuje a v podkladech to není, nepiš to a zapiš to do `docs/podklady/k-overeni.md` (co, kde by se hodilo, co udělat). Když podklady chybějí úplně, nejdřív skill `atlas-overeni`.
3. **Rozvrhni si** v pár bodech, jakou scénou otevřeš úvod a každou kapitolu, jaký blok v ní bude a které dvě myšlenky vybereš. Autorovi osnovu předem neposílej: kde váháš, zvol nejlepší cestu a na konci napiš, nad čím jsi váhal a co by šlo jinak.
4. **Piš** podle šablony níže. Obsah Volby, Změň jednu věc a Sporu patří do `src/content/bloky/<id>.yaml`, do MDX jen `<Volba id="…" />`. Odkryj a Moje stanovisko se píšou přímo do MDX.
5. **Data:** pramen, ze kterého stránka čerpá a v osobě chybí, přidej do `zdroje` osoby v `lide.yaml`. Na novou stránku odkaž z Kam dál souvisejících osob.
6. **Ověř:** `npm test` celé (testy v prohlížeči běží na portu 4322). Novou stránku přidej do `STRANKY` v `tests/e2e/prohlidka.spec.ts`, ať se kontroluje axe, přesah a snímky na 390 a 1440 px ve světlém i tmavém režimu. Snímky si prohlédni a aspoň jeden blok vyzkoušej v prohlížeči. Text přečti třikrát podle Postupu při psaní ve skillu `atlas-psani` (čtivost, úvody a citáty, stroj). Projdi rychlou kontrolu níže.
7. **Zapiš** zásadní volby do `docs/rozhodnuti.md`, vynechané a neověřené do `k-overeni.md`. Commituj česky po ucelených krocích (portrét, profil, kontrola); na GitHub nic bez pokynu autora.

## Jak najít a vyprávět příběh

- **Hledej chvíli rozhodnutí nebo otázky,** ne životopis. Dobrá scéna má člověka, místo a napětí: Kritón sedí před úsvitem u spícího Sókrata a přišel ho přemluvit k útěku. Mladý Athéňan buší holí na dveře, protože do Athén přijel Prótagorás.
- **Scéna nese myšlenku.** Lachés definuje odvahu jako „neutéct“, a přitom chválí Sókrata za ústup od Délia. Ze dvou kapitol tak vyroste jedna otázka, kterou student sám rozhodne.
- **Druh pramene řekni jednou větou na začátku scény:** „Platón vypráví…“ (scéna z dialogu), „Alkibiadés vyprávěl…“ (vyprávění postavy), „Vypráví se…“ (tradovaný příběh), „Představ si…“ (vymyšlená situace). Dál už vyprávěj bez výhrad.
- **Citát odpovídá na otázku kapitoly.** Stojí za větou, která ji položila, má uvozovací větu se situací (komu, kdy, na co odpovídal) a text se po něm vrací k příběhu. Žádná sbírka citátů za sebou (`atlas-psani` › Citáty).
- **Přímá řeč skutečných osob jen jako citát** ze `zdroje.yaml` přes `<Citat id="…" />`. Ostatní v nepřímé řeči: „Lachés odpověděl, že odvážný je ten, kdo…“. Ani otázku filozofa nepiš jako vymyšlenou přímou řeč.
- **Jména a podrobnosti střídmě** (`docs/styl.md`, pravidlo 6). Jménem nazvi jen toho, kdo nese příběh nebo myšlenku; ostatní popiš tím, kým jsou: „dva athénští otcové“, „druhý rádce“, „přítel, který u toho byl“, „přátelé z ciziny“. Vzhled, místa, částky a seznamy žáků jen tam, kde něco říkají o člověku nebo o myšlence. V Sókratově portrétu stačí Alkibiadés, Lachés, Euthyfrón, Kritón, Xanthippa a Platón.
- **Myšlenka má přednost před ozdobou.** Když scéna nabízí další krok argumentu (Lachétova druhá definice, Sókratova námitka o lodích), vezmi ho; když nabízí jen další jméno nebo kulisu, vynech ji.
- **Sporné vynech,** nejisté zmírni („kolem roku“, „asi“, „prý“). Pochybnosti o pramenech patří do podkladů, ne do textu.
- **Protivník a pokušitel dostanou nejsilnější verzi.** Kritónovy důvody k útěku jsou dobré důvody, jinak Sókratova odpověď nic neváží.
- **Co s příběhem děláme my, nepřipisuj filozofovi.** Epiktétos nevyprávěl o senátorovi jako odpověď na námitku rezignace; za odpověď ho bereme my. Piš „Epiktétos k ní má příběh“, ne „na ni odpovídal příběhem“. Stejně tak spojovací věta k jinému mysliteli nesmí tvrdit spor nebo otázku, které nebyly („Proti Epiktétovi tu otázku položil už Aristotelés“).
- **Formulace nesmí být silnější než tvrzení v podkladech.** „Velkou část vlády“ není „skoro celou vládu“; porovnej doporučenou formulaci se sloupcem Tvrzení.
- **Scéna, kde silnější odmítne pomoct nebo kde hrdina křivdu mlčky unese,** dostane hned za sebou otázku pro studenta („Stačila by ti taková odpověď od učitele?“). Student, kterému někdo ubližuje, jinak čte, že se ho nikdo zastat nemá.
- **Konec kapitoly** nech na silné větě nebo na otázce pro studenta v kurzívě. Pointu nevysvětluj.
- **Titulek kapitoly** je pointa s kurzívou na konci: „Místo trestu *odměna.*“, „Spravedlnost dostal *každý.*“

## Blok pro studenta v kapitole

Každá kapitola portrétu má jeden blok, vybraný podle toho, co scéna nese. Blok stojí **před** tím, co filozof udělal, aby student rozhodl dřív, než to ví.

| Scéna nese… | Blok | Příklad |
| --- | --- | --- |
| definici nebo pojem, který jde vyzkoušet | Odkryj | „Co je odvaha? Najdeš případ, kdy tvá definice neplatí?“ |
| soud o činu nebo o tvrzení | Volba s důvodem bez `coUdelal` | „Byl Sókratův ústup od Délia odvážný?“ |
| rozhodnutí, které filozof udělal | Volba s důvodem s `coUdelal` | „Soud tě uznal vinným. Co navrhneš jako trest?“ |
| dilema, které záleží na podmínkách | Změň jednu věc | „Utečeš?“ (rozsudek spravedlivý, přátelé by pykali, nikdo se to nedozví) |
| prostor, děj nebo pořadí, které se špatně představuje | Kresba s pohybem, vedle bloku, ne místo něj | jeskyně ve dvou pohledech; cesta ven s posuvníkem |
| otázku k zamyšlení, kterou blok nepotřebuje | kurzíva v textu | „*Je to správné, protože to někdo přikázal? Nebo to přikázal, protože je to správné?*“ |

**Kresba s pohybem** (`docs/design.md` › Komponenty) není blok: nic se neptá a nic neukládá. Autor ji chce v atlasu častěji (4. 10. 2026). V portrétu ji dej tam, kde kapitola stojí na místě nebo ději, který si student musí představit (bitva, cesta, pokus s věcmi): nejvýš jednu na kapitolu, za odstavec, který zobrazuje. Text drží i bez ní, popisy pohledů jsou studentský text z podkladů a výchozí pohled nechává studenta v situaci, ne nad ní. Kresbu, kterou už nese cesta celku, do portrétu podruhé nedávej; odkaž na cestu. Novou stav skillem `atlas-komponenta`.

Možnosti ve Volbě jsou skutečné tahy, každá se zpětnou vazbou, která řekne, co tah umí, kde má slabinu, a položí otázku dál. Modelové odpovědi v Odkryj jsou různě silné studentské odpovědi s komentářem. Nikdy „správně“ ani hodnocení názoru. Podrobně v `docs/design.md` › Bloky a ve skillu `atlas-cesta`.

## Výběr velkých myšlenek

- **Dvě myšlenky** (portrét i profil), každá z jiné disciplíny (Poznání, Etika, Argumentace, Politika…).
- Vyber myšlenky, které **studenta osobně zasáhnou** a dají se vyzkoušet na vlastním životě: „Nikdo nedělá zlo *dobrovolně.*“, „O každé věci se dá mluvit *pro i proti.*“
- Titulek je teze s pointou v kurzívě. Výklad má dvě až čtyři věty v nejsilnější verzi, bez sloganu (`docs/styl.md`, dvojice 10).
- Pak otázka v kurzívě, která tezi vystaví protipříkladu („*Platí to všude? Je krutost špatná jen pro toho, komu se špatná zdá?*“), a vlastní pokus: `<MojeStanovisko client:visible id="<osoba>-<tema>" otazka="…" odkaz="/osobnost/<id>/#myslenky" />`.
- Myšlenka, kterou nese jiný blok (Spor v cestě, stránka velké otázky), se na stránce osobnosti neopakuje.

## Zkus to žít

Jedna výzva na týden, kterou jde opravdu udělat ve škole nebo s kamarády a která v praxi procvičí myšlenku stránky. Tři až čtyři věty: co udělat, jak, co si na konci zapsat. Žádné body ani série.

Výzva, která cvičí něco unést, přehodnotit nebo přijmout (stoici), nesmí mířit na člověka, který studentovi ubližuje. Příklady ber z věcí, které štvou (povinnost, prohra, něčí zlozvyk), a jednou větou řekni, že křivdu, se kterou se dá něco dělat, si student nevybírá: ta potřebuje někoho, komu o ní řekne.

> **Řekni to za druhého.** Až se s někým neshodneš, nezačínej svým názorem. Nejdřív zopakuj ten jeho, a tak dobře, aby řekl: přesně tak. Teprve pak odpověz. Na konci týdne si zapiš, jestli to něco změnilo.

## Čtivost a lidský hlas

Stránka osobnosti se má číst jako kapitola dobré knihy: otázka táhne dál, informaci nese scéna, citát přijde jako odpověď a nic nezní jako stroj. Všechno k tomu je ve skillu `atlas-psani` (Co dělá dobrou knihu, Úvody, Citáty, Příběh a informace dohromady, Ať text nezní jako stroj); platí pro každý text stránky včetně scén a zpětných vazeb v YAML, titulků, popisku pod deskou a vět `kdo` a `proc`.

Ve stránce osobnosti hlídej hlavně úvod (scéna a proč toho člověka poznat, dřív než místa a data) a výklad velkých myšlenek (nejdřív problém, na který myšlenka odpovídá, pak myšlenka).

## Šablona MDX

```mdx
---
osoba: <id z lide.yaml>
nadtitulek: <kdo · Xův portrét / Xův profil>
titulek: <Jméno>
pointa: <jedna věta, vysází se kurzívou: „Muž, který se ptal.“>
citat: <id hlavního citátu ze zdroje.yaml>
kapitoly:
  - cislo: "01"
    kotva: <bez-diakritiky>
    nazev: <krátký název>
    stav: hotovo
---
import Kapitola from '../../components/osobnost/Kapitola.astro';
import Citat from '../../components/ui/Citat.astro';
import DobaALide from '../../components/osobnost/DobaALide.astro';
import Myslenky from '../../components/osobnost/Myslenky.astro';
import Myslenka from '../../components/osobnost/Myslenka.astro';
import MojeStanovisko from '../../components/ostrovy/MojeStanovisko.svelte';
import ZkusToZitKarta from '../../components/osobnost/ZkusToZitKarta.astro';
import KamDal from '../../components/osobnost/KamDal.astro';
import { KdoZilDriv, Volba, Odkryj } from '../../components/bloky';

<div class="uvod ctenarsky">

Scéna: člověk, místo, napětí. Dva až tři krátké odstavce.

</div>

<div class="ctenarsky"><Citat id="<hlavní citát>" velky /></div>

<Kapitola cislo="01" kotva="<kotva>" nazev="<název>">
  <Fragment slot="titulek">Pointa s kurzívou na <em>konci.</em></Fragment>

Scéna… → blok pro studenta → co udělal filozof → citát → silná poslední věta.
</Kapitola>

<DobaALide osoba={props.osoba}>

Dvě až tři věty: odkud byl, kam chodil, jak skončil.

</DobaALide>

<div class="ctenarsky"><KdoZilDriv a="<id>" b="<id>" druh="poradi" /></div>

<Myslenky>
  <Myslenka cislo={1} disciplina="Poznání">
    <Fragment slot="titulek">Teze s <em>pointou.</em></Fragment>

Výklad v nejsilnější verzi. *Otázka s protipříkladem?*

<MojeStanovisko client:visible id="<id>-<tema>" otazka="…" odkaz="/osobnost/<id>/#myslenky" />

  </Myslenka>
</Myslenky>

<ZkusToZitKarta id="<id>-<vyzva>" nazev="<Název výzvy>" odkaz="/osobnost/<id>/#zkus-to-zit">

Výzva na týden.

</ZkusToZitKarta>

<KamDal odkazy={[
  { href: '/cesta/<slug>/', nadtitulek: 'Cesta N', text: '…' },
  { href: '/osobnost/<id>/', nadtitulek: 'Portrét', text: '…' },
  { href: '/otazky/#<kotva>', nadtitulek: 'Velká otázka N', text: '…' },
]} />
```

Poznámky k šabloně:

- Velký citát z úvodu se v textu nemusí opakovat; když se k němu kapitola vrací, odkaž na něj slovy („začínala právě větou o člověku jako měřítku“). Znovu jako citát má smysl jen tam, kde zazněl (Sókratés, Obrana 38a v kapitole Soud).
- Osoba bez autentického portrétu má na desce minci s atributem; nic nepřidávej. Fotografie jen s ověřenou licencí v `zdroje.yaml` › `obrazky`. Popisek obrázku (`popisek`) se ukazuje pod deskou vedle „Proč …?“: u rytiny, kresby nebo pozdější sochy v něm řekni, čí je to představa a z kdy, hlavně když obraz ukazuje něco, co text popírá (Epiktétos s perem × „Sám nenapsal nic“).
- Doba a lidé skládá skupiny vztahů z dat: „Znali se a přeli se“ jen pro `znali-se` a `polemika` lidí, kteří se přít mohli, vliv přes texty má skupiny „Četli ho a navázali“ a „Koho četl“. Lidem, kteří se nepotkali, dej v `vztahy.yaml` typ `vliv-textem`; když jeden s druhým nesouhlasil, typ `polemika` (stránka ji sama zařadí pod „S kým se přel na dálku“ a „Kdo se s ním přel později“) a do poznámky otázku, o kterou šlo, ne větu s podmětem. Po sestavení si oddíl přečti, nikdo jiný ho nepíše.
- Blok v portrétu stojí v čtenářském sloupci (680 px), v kroku cesty má až 960 px: podívej se na něj na 1440 px přímo ve stránce.
- Letopočty s nezlomitelnými mezerami: `399 př. n. l.` (U+00A0 mezi číslem a „př.“ i uvnitř zkratky).
- `id` bloků malými písmeny bez diakritiky a na celém webu jedinečné, `<osoba>-<tema>`.
- Kapitolu se stavem `osnova` ukazuje stránka jen ve vývojovém režimu; po dopsání nastav `stav: hotovo` a pole `osnova` smaž.

## Ukázky z hotových stránek

**Úvod scénou (profil Prótagora):**

> Platón vypráví, jak jednou před úsvitem bušil někdo holí na Sókratovy dveře. Byl to jeden mladý Athéňan a nesl novinu: do Athén přijel Prótagorás! Chtěl, aby ho k němu Sókratés vzal. Rád by Prótagorovi zaplatil, jen aby ho udělal moudrým.

Proč funguje: první věta řekne pramen a hned je tu zvuk, čas a spěch. Mladík nemusí mít jméno: příběh nese jeho spěch, ne on. Fakta o Prótagorovi (kdo byli sofisté, první placený učitel) přijdou až potom.

**Scéna, ze které vyroste blok (Sókratés, kapitola 03):**

> Alkibiadés z koně viděl, že Sókratés je klidnější než Lachés. Šel stejně jako po athénských ulicích, vzpřímeně a s pohledem na všechny strany. Díval se po přátelích i po nepřátelích. Z dálky bylo vidět, že kdo na něj sáhne, narazí.

Pak Volba „Byl Sókratův ústup od Délia odvážný?“ s Lachétovou definicí ve scéně bloku. Student soudí sám; text pak nic nerozhodne za něj.

**Nejsilnější verze druhé strany (Sókratés, kapitola 05):**

> Peníze jsou připravené, přispějí i přátelé z ciziny. Daleko od Athén čekají lidé, kteří ho ochrání. A když zůstane, zradí sám sebe, udělá radost nepřátelům a opustí vlastní syny.

Hned za tím Změň jednu věc „Utečeš?“ a teprve pak Sókratova odpověď s citátem `kriton-49c`. Jména dárců a cíl útěku (Simmiás, Kebés, Thesálie) by tu jen zdržovala.

**Tradovaný příběh s otázkou na konci (profil Prótagora, kapitola 02):**

> Vypráví se, že při závodech zabil oštěp nešťastnou náhodou jednoho muže. Periklés prý pak s Prótagorou celý den rozebíral, kdo za to může: oštěp, ten, kdo ho hodil, nebo pořadatelé. Posměšně to o otci vyprávěl Periklův vlastní syn.
>
> *Kdo za to podle tebe může? A je to pro tebe hloupá otázka, nebo ta nejdůležitější?*

**Takhle ne:**

> ✗ Prameny o Prótagorově konci se rozcházejí; pozdní tradice o vyhnání je nespolehlivá.
>
> ✓ Dožil se asi sedmdesáti let a čtyřicet z nich učil. Vážnost si podle Platóna udržel až do smrti.

## Rychlá kontrola před odevzdáním

- Začíná úvod i každá kapitola scénou, člověkem nebo otázkou?
- Nese každé jméno a každý detail příběh nebo myšlenku? Ostatní popsat, nebo vynechat.
- Má každé historické tvrzení podklad, a co chybělo, je v `k-overeni.md`?
- Je přímá řeč skutečných osob jen v `<Citat />`? Má scéna z dialogu „Platón vypráví…“ a tradovaný příběh „Vypráví se…“?
- Stojí blok před tím, co udělal filozof? Má každá volba vlastní zpětnou vazbu s důvodem?
- Dostal protivník i filozof svou nejsilnější verzi?
- Přečetl by stránku student, kterému někdo ubližuje, aniž by v ní našel radu smířit se (scéna, kde silnější nepomůže; výzva Zkus to žít; citát o snášení bez otázky za ním)?
- Sedí oddíl Doba a lidé a popisek pod deskou na to, co říká text (nikdo se „neznal“ jen proto, že četl; obraz neodporuje vyprávění)?
- Je ve stránce věta, která mluví o naší práci, o pramenech nebo o tom, proč je něco zpracované takhle? Smazat.
- Dala by se některá věta beze změny napsat o jiném filozofovi? Prošel text třemi čteními podle skillu `atlas-psani`? Odpovídá každý citát na otázku před ním?
- Věty do 25 slov, odstavce do 4 vět, tykání, jména a skloňování podle `lide.yaml`, letopočty s nezlomitelnými mezerami?
- Je-li ve stránce kresba s pohybem: říká text totéž i bez ní, jde pohyb zastavit a neopakuje kresbu z cesty?
- Prošlo `npm test` celé a jsou snímky na 390 a 1440 px ve světlém i tmavém režimu prohlédnuté?
- Přečetl by to šestnáctiletý člověk dobrovolně až do konce?