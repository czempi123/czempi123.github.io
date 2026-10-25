# Provedená zadání větve celek-10

Zadání kroků celku 10 v plném znění, jak byla provedena. Plán větve je v `docs/plany/celek-10.md`.

## Zadání P6: podklady (provedeno 25. 10. 2026)

V novém chatu projektu Atlas s připojenou složkou Atlas a zapnutým Desktop Commanderem. **Opus 5.5 · high** s vyhledáváním. Krok je stavěný tak, aby přežil přerušení: podkladový list se píše a commituje po oddílech a stejné zadání po resetu kreditů pokračuje tam, kde práce skončila.

```text
Pracuješ v repozitáři atlas na mém Macu (/Users/vojtechczempka/Atlas). Terminál máš přes Desktop Commander: pracuj přímo v repozitáři, ne v kopii. Krok P6 celku 10 „Co když přijde to nejhorší?“ (cesta 33). Plán celku je docs/plany/celek-10.md (oddíly Co celek staví a Hranice vůči hotovým celkům), postup ve skillu atlas-overeni (skills/atlas-overeni/). Čti jen to, co krok potřebuje (CLAUDE.md › Co číst a jak šetřit).

0. Přepni se do větve celek-10 (je založená, plán v ní je). Když existuje docs/podklady/celek-10.md, pokračuješ po přerušení: oddíly mají v nadpisu stav (hotovo / rozpracováno); pokračuj prvním, který není hotový, a hotové znovu neověřuj.

1. Podkladový list docs/podklady/celek-10.md podle šablony skillu. Piš ho po oddílech a po každém oddílu commitni (česky). Nejdřív se podívej do podkladů celků 3, 6 a 9 v docs/podklady/ (Epiktétos, Seneca): co je tam ověřené, znovu neověřuj, jen odkaž. Oddíly:
   a) Stockdale: příběh z jeho vlastních textů (esej Courage Under Fire z roku 1993, Thoughts of a Philosophical Fighter Pilot, kniha In Love and War se Sybil Stockdaleovou). Data sestřelu a propuštění, zranění nohy, samovazba, kdo mu dal Rukojeť a kdy, co si řekl pod padákem, která Epiktétova místa v zajetí používal (role herce, noha jako překážka těla, ne vůle, ostuda, co je v mé moci) a jak je sám vykládal. U každého tvrzení zdroj; co je jen z druhé ruky, výslovně označ. Krátké citace (pod 15 slov), jinak parafráze.
   b) Seneca: představa nejhoršího. Dopis 24 (1–15), Dopis 91 (požár Lugduna a Liberalis), O klidu duše 11, Útěcha Marcii 9, Dopis 13 (víc nás straší, než tíží), případně Dopis 78 a 98. Latinský text a české znění s překladatelem a vydáním, nebo vlastní překlad výslovně označený jako vlastní. Seneca patří k nejčastěji podvrhovaným autorům: každý citát ověř v latině; zvlášť zjisti, odkud je „tela praevisa minus feriunt“ (podezření, že není Senekovo).
   c) Epiktétos: místa, o která se Stockdale opíral, a místa o přípravě na ztrátu (Rukojeť 3, 9, 17, 21; Rozpravy podle potřeby) v překladu, který atlas už používá. Co už nese cesta 5, jen odkaž.
   d) Spor: připravit se, nebo se nemučit předem? Epikúros podle Cicerona (Tuskulské hovory III, 28–35 a 76; číslování ověř), kyrénaikové a Anaxagorova věta; napětí uvnitř Seneky (Dopis 13 proti Dopisu 91). Je to poctivé čtení obou stran? Nejsilnější verze každé jednou větou. Doporuč, kdo bude v bloku Spor proti Senekovi; žádná nová osoba v datech.
   e) Nejsilnější námitka: představa nejhoršího jako cesta k úzkosti a katastrofickému přemítání. Co by odpověděli Seneca a Epiktétos a kde je odpověď slabá. „Stockdalův paradox“: najdi původní znění u Jima Collinse (Good to Great, 2001), urči, co je Stockdalovo a co Collinsovo, a doporuč, jestli a jak ho vyprávět („Vypráví se, že…“).
   f) Citlivá místa: mučení, Stockdalovo sebepoškození v zajetí, politika vietnamské války, student s úzkostí. Ke každému výslovné doporučení, co jde do studentského textu a co ne, v souladu s pravidly celku 6 (docs/archiv/plany/celek-6.md, oddíl o tom, co do cesty nepatří) a se zásadou z 9. 10. 2026 v docs/rozhodnuti.md.
   g) Dnešní případ pro studenta 15–19 let: situace, kde se člověk dopředu bojí ztráty nebo neúspěchu (zkouška, sport, nemoc v rodině, rozchod), jako „Představ si…“ bez skutečných osob. Pointa cesty není „mysli negativně“, ale „co se změní, když tu ránu čekám“.
   h) Návrh cesty: osnova 7–8 kroků s bloky z knihovny ke každému kroku, námět na kresbu nebo animaci (mám rád pohyblivé kresby jako jeskyně v cestě 3; obsah musí být vidět i v zastaveném obrázku), závěrečné pravidlo, tři případy pro Návrat, Zkus to žít (odlišné od večerního ohlédnutí; navrhni, jestli z něj bude i cvičení Stoického týdne), vazby na portréty Seneky a Epiktéta a na stránku otázky 3 (Seneca i Epiktétos tam jsou jako hlasy; zjisti, jestli cesta přinese odpověď, která tam chybí). Žádné nové osoby v datech; Stockdale jen v textu cesty.
   i) Obrázky: oficiální fotografie Stockdala (US Navy, dílo federální vlády USA) pro vstup, případně další obraz. Návrh se zdrojem a licencí; stahuj až s mým souhlasem.
   j) Otevřené otázky pro mě, každá s doporučením a řádkem „Odpověď:“ (prázdná odpověď znamená souhlas s doporučením).

2. Do plánu větve zapiš stav P6, oddíl „Po P6“ (co jsi zvažoval), oddíl „Co rozhodnout po P6“ s otázkami z oddílu j a zadání P8 (Opus 5.5 · high se skillem atlas-cesta); do zadání P8 napiš, že nové bloky a kresby potřebují značky data-cast podle docs/design.md › Podoba na plátně a že do kontroly patří node scripts/hodiny-katalog.mjs. Zadání P6 přesuň do docs/archiv/zadani/celek-10.md. Do docs/podklady/k-overeni.md zapiš, co jsi ověřil ke Stoickému týdnu (představa nejhoršího). Plán větve a docs/plan.md nahraj do projektu Claude (docs/plany/celek-10.md, docs/plan.md). Nic neposílej na GitHub a nic nesluč. Pak mi krátce napiš, co jsi našel a co je potřeba rozhodnout.
```
