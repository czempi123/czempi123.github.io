---
name: atlas-overeni
description: Rešerše a ověření podkladů pro Atlas myšlení — životní data, místa, tradované příběhy, citáty a jejich překlady, vztahy mezi filozofy. Použij VŽDY před psaním nového obsahu atlasu (osobnost, směr, cesta, období), když je třeba ověřit citát nebo datum, když se objeví pochybnost o pramenu a když uživatel řekne „ověř“, „najdi zdroj“, „je to pravda?“, „kdo to řekl?“. Výstupem je podkladový list v docs/podklady/.
---

# Ověření podkladů

Tady se odvádí všechna pramenná práce, aby studentský text mohl vyprávět bez výhrad. Cíl: pro každé tvrzení, které se objeví v atlasu, víme, odkud je, jak jisté je a jak ho smíme podat.

## Postup

1. **Vypiš, co celek potřebuje.** Z plánu celku nebo zadání sestav seznam tvrzení: životní data, místa a pobyty, příběhy a anekdoty, citáty, vztahy mezi lidmi, dobový kontext, výklad hlavních myšlenek. Hledej hlavně silné příběhy: scény, rozhodnutí, střety. Právě ty atlas nese.
2. **Dohledej zdroje** podle pořadí spolehlivosti v `references/zdroje.md`. U každého tvrzení otevři skutečnou stránku nebo text; úryvek z vyhledávače není zdroj. Wikipedie slouží jen jako rozcestník k lepším zdrojům.
3. **Zařaď každé tvrzení** do jednoho typu a urči, jak ho smí studentský text podat:

   | Typ | Příklad | Jak ho podat studentovi |
   | --- | --- | --- |
   | Doložený fakt | Sókratés byl odsouzen roku 399 př. n. l. | Přímo |
   | Přibližný fakt | Epiktétos se narodil kolem roku 55 | „kolem roku 55“ |
   | Tradovaný příběh | Diogenés řekl Alexandrovi, ať mu nestíní | „Vypráví se, že…“ nebo uvedením vypravěče („Podle Plútarcha…“) |
   | Výklad | Stoikové rozlišují, co je v naší moci | Přímo, jako výklad myšlenky, se zdrojem v datech |
   | Sporné nebo nedoložené | Přesný rok narození Pýthagora | Nahradit opatrnější formulací, nebo vynechat |
   | Podvržené | „Vím, že nic nevím“ jako doslovný Sókratův výrok | Nepoužít; použít skutečné znění z pramene |

4. **Citáty ověř zvlášť.** Najdi místo v díle (kniha, kapitola, paragraf; u Platóna Stephanovo číslování, u předsókratiků číslo zlomku DK). Zjisti český překlad a překladatele; pokud překlad chybí nebo je nevhodný, připrav vlastní převod a označ ho v podkladech jako vlastní. Nikdy nevkládej do úst historické osobě větu, kterou nelze najít v prameni.
5. **Obrázky:** zjisti autora, instituci, licenci a odkaz (muzeum s otevřeným přístupem, nebo Wikimedia Commons). Bez jasné licence obrázek nepoužívej. Soubor stahuj až po souhlasu autora; při žádosti uveď název souboru, zdroj a velikost.
6. **Zapiš podkladový list** do `docs/podklady/<id-celku>.md` podle šablony v `references/podkladovy-list.md`. Návrhy dat (životní data, místa, vztahy) připrav rovnou ve tvaru, který se přenese do `src/data/`.
7. **Předej** v pár větách: co je ověřeno, které příběhy jsou nejsilnější a co zůstalo otevřené a vyžaduje rozhodnutí autora.

## Zásady

- Pochybnosti se řeší tady, ne ve studentském textu. Výsledkem je formulace, která je pravdivá sama o sobě.
- Doporučená formulace je studentský text, který se do atlasu často přenese beze změny: piš ji podle skillu `atlas-psani` (konkrétní věc, činný rod, bez nafouknutého významu) a nikdy silněji, než říká tvrzení.
- Když se zdroje rozcházejí, zapiš obě verze a doporuč, kterou atlas použije a proč.
- Datování: rok nula neexistuje. Záporná čísla v datech znamenají roky př. n. l.
- Vztah mezi dvěma lidmi zapisuj s typem: `ucitel`, `znali-se`, `vliv-textem`, `polemika`. Současnost dvou lidí sama nedokazuje, že se znali.
- Nepředstírej ověření, které neproběhlo. Co jsi nemohl otevřít, zapiš jako neověřené.

## Kdy je hotovo

Každé tvrzení, které se objeví ve studentském textu, má v podkladovém listu typ, zdroj s místem a doporučenou formulaci; každý citát má dílo, místo a překlad; otevřené otázky jsou vypsané pro autora.
