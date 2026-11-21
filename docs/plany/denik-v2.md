# Větev denik-v2: deník se sbírkou a kvízem

Druhá větev fáze 2 (herna) podle `docs/plany/po-auditu.md` › Větve: kvíz **Co ti zůstalo?** na konci antiky, **kartičky s rozestupem** v deníku a **vystřižené citáty** do sbírky. Zkouška na obsahu: Tvoje antika. Plán zatím není napsaný; vznikne prvním krokem (Plán).

## Co už platí

- Výsledek kvízu i kartiček je bez bodů, jen „víš“ a „zopakuj si“ s odkazem zpět (`docs/rozhodnuti.md`, odpověď 2 po auditu). Jde o znalost, ne o názor; za názory se body nedávají nikdy.
- Deník je zápisník se sbírkou: razítka, pahýly lístků, vystřižené citáty (odpověď 1 po auditu).
- Pointa není paměť (autor, 17. 11. 2026, `docs/archiv/plany/herna-v1.md` › Co platí): žádné učení citátů nazpaměť ani hádání, kdo co řekl; přesné roky jen tam, kde vysvětlují, kdo na koho navázal.
- Do atlasu nepatří žebříčky ani série dní (`CLAUDE.md`): kartičky s rozestupem nesmí student vnímat jako povinnost s odpočtem.

## Kroky

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| Plán | Plán větve: proč, co platí, kroky s modelem a úsilím, zadání všech kroků, otázky jen pro autora | Opus 5.5 · high | na řadě (Zadání Plán) |

## Zadání Plán

Opus 5.5 · high, nový chat.

```
Na Macu (/Users/vojtechczempka/Atlas, Desktop Commander). Když je main napřed před origin/main (git fetch, git status), pošli ho nejdřív na GitHub sám a udělej kontrolu z docs/archiv/plany/herna-v1.md › Po Uzavření, bod 3 (gh run list, nasazený web na 390 a 1440 px, snímky do Claude outputs/); výsledek dopiš tamtéž. Pak založ z main větev denik-v2 (git switch -c denik-v2). Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md (oddíl Technika jen přelétni) a docs/plany/denik-v2.md. Z docs/plany/po-auditu.md čti jen oddíly Zásada, Katalog aktivit, Pravidla pestrosti, Větve a v Co rozhodnout odpovědi 1 a 2; z docs/plany/kurikulum.md jen to, co jmenuje deník, sebehodnocení nebo kvíz (grep). Podívej se, jak je dnes postavený deník a Tvoje antika (najdi soubory grepem, čti jen to, co plán potřebuje) a co z herna-v1 už umí ukládat stav (src/lib/herna/). Archiv nečti.

Napiš plán větve denik-v2 do docs/plany/denik-v2.md ve stejném tvaru jako hotové plány (Proč, Co platí, Kroky s modelem a úsilím, Formáty, zadání každého kroku celým promptem, Co zůstává na později):
1. Co ti zůstalo? na konci antiky: z čeho se otázky skládají (data a ověřené podklady, žádné nové tvrzení bez skillu atlas-overeni), co student dostane po odpovědi (vysvětlení a odkaz zpět, bez bodů), kde stojí (Tvoje antika) a co si odnese do života.
2. Kartičky s rozestupem v deníku: co na kartičce je (vlastní zápisy studenta, pojmy, vystřižené citáty), jak se počítá rozestup bez odpočtu a sérií, co se stane, když student týden nepřijde.
3. Vystřižené citáty: odkud se dají vystřihnout, jak vypadají ve sbírce deníku, export.
4. Kroky: podklady (P6) jen pokud kvíz potřebuje nová ověřená tvrzení, kód (K…) se skillem atlas-komponenta, texty (T) se skillem atlas-psani, revize R se skillem atlas-revize, opravy O a Uzavření (VoiceOver s autorem u Macu, pokud bude u Macu; sloučení, GitHub, kontrola nasazení, plán do archivu).
Kde si nejsi jistý, zvol nejlepší cestu a napiš, nad čím jsi váhal; autorovi polož jen otázky, které smí rozhodnout jen on (prázdná odpověď = souhlas s doporučením). Aktualizuj řádek denik-v2 v docs/plan-vetve.md a oba soubory nahraj do Projektu Claude (docs/plany/denik-v2.md jako plán, podle kterého se pracuje). Commit ve větvi denik-v2, na GitHub nic. Ve zprávě autorovi: co plán navrhuje, otázky a celý prompt prvního kroku s modelem a úsilím (i do plánu). Zastav se.
```

## Co zůstává na později

- VoiceOver s autorem z herna-v1 a design-v2 (postup v `docs/archiv/plany/herna-v1.md` › Po O): připojí se k Uzavření této větve, když bude autor u Macu.
