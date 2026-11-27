# Větev sokrates-opravy: opravy po zkušební jízdě skillů

Stav, kroky a zadání větve `sokrates-opravy`. Vznikla 27. 11. 2026 z `main` po zkušební jízdě skillů impeccable, svelte a argument-analyst na portrétu Sókrata. Nálezy jsou v `Claude outputs/zkouska-skillu-sokrates.md` (mimo git), seřazené podle dopadu na studenta na telefonu.

## Proč

Zkouška našla deset věcí. Tři z nich mají na studenta velký dopad:
- **Kdo žil dřív?** má odpověď nad sebou.
- **Spor o měřítku pravdy** odpovídá na námitku, kterou student ještě nečetl.
- **Sókratův argument** je ve Sporu slabší, než ho napsal Platón.

Další body se týkají ovládání: fokus z klávesnice, Odkryj naprázdno a starý obal bloku na portrétu.

## Kroky

| Krok | Co | Model · úsilí | Stav |
| --- | --- | --- | --- |
| O | Opravy bodů 1–7 ze zkoušky (P3 jen když zbude čas) | Opus 5.5 · high | hotovo 27. 11. 2026 |
| R | Revize změn skillem `atlas-revize` | Opus 5.5 · high | **na řadě** (Zadání R) |
| Uzavření | Schválení autorem, sloučení do `main` | Opus 5.5 · medium | čeká |

## Po O (27. 11. 2026)

**Co se změnilo**

1. **Kdo žil dřív? na všech devíti portrétech** stojí mezi poslední kapitolou a Dobou a lidmi, ne pod nimi:
   - Dva životy, Současníci a Žáci už nad hrou roky druhé osoby neukazují. Na stránkách Hérakleita a Parmenida stálo nad hrou dokonce „Ve stejné době žil…“.
   - Na stránkách Marca Aurelia a Seneky byla osobou b sama osoba stránky, jejíž roky jsou v hlavičce. Osoby jsou prohozené: Marcus táhne Seneku, Seneca Sókrata. Nová id `kdo-marcus-aurelius-seneca-vzdalenost` a `kdo-seneca-sokrates-vzdalenost`. Starý uložený odhad těchto dvou her se nenačte a učitel, který si je uložil do hodiny, je tam musí přidat znovu.
   - Katalog hodin řadí Kdo žil dřív? v profilu pod celou stránku, jako hru z dat (`src/lib/hodiny.ts`).
   - Šablona v `skills/atlas-osobnost/SKILL.md` má hru nad Dobou a lidmi a pravidlo s důvodem. V účtu Claude je skill novější (odstavec o transfer-bridge z větve film-0): změnu tam musí přenést autor.
   - Ověřeno skriptem na `dist/`: nad hrou nejsou roky osoby b. Výjimkou jsou drobná razítka osob na kartách cest (SVG, asi 6–9 px) u Epikúra a Prótagora, ta zůstala.
2. **Spor `cesta1-meritko-spor`:**
   - Prótagorův třetí argument začíná Sókratovou námitkou.
   - Sókratův druhý argument jde až k závěru Theaitéta 171c („true to nobody, neither to anyone else nor to him“).
   - Podklad `docs/podklady/celek-1-pravda.md` má celý krok 171a–c ověřený ve Fowlerově překladu (Perseus) a Prótagorovu odpověď podle SEP, Protagoras 2.2.
3. **`cesta8-argument`:** obecná zpětná vazba začíná „Z obou důvodů závěr ještě neplyne.“
4. **Fokus z klávesnice:**
   - Moje stanovisko: fokus jde po otevření do pole a po Uložit i Zrušit zpět na tlačítko.
   - Zkus to žít: po přijetí jde fokus na potvrzení.
   - `aria-expanded` z tlačítka Moje stanovisko zmizel místo vázání na stav. Tlačítko se po otevření nahradí polem, takže nemá co rozbalovat.
   - Test v `tests/e2e/fokus-bloku.spec.ts`.
5. **Kapitola 01 portrétu Sókrata:** `<Odkryj filozof="sokrates">` místo obalu `NejdrivSam` (id beze změny, deník drží). Blok má minci Sókrata.
6. **Odkryj s prázdným polem:** vedlejší tlačítko „Odklopit bez odpovědi“. Po prvním znaku je tu hlavní tlačítko s původním textem. Jde o návrh k rozhodnutí autora.

**Testy:** celé `npm test` prošlo (kontrola typů, 1666 testů ve Vitestu, Playwright) až na dva testy:
- `bloky.spec.ts:448` čekal hlavní tlačítko Odkryj u prázdného pole. Je upravený na nové chování a prochází.
- `herna-k4.spec.ts:230` (Přehrát období, rok −431 po −430) s větví nesouvisí. Při třech opakováních prošel, jde o kolísání času.

**Co zůstalo**

- **`src/components/ostrovy/NejdrivSam.svelte`** nikdo nepoužívá. Smazat ho (i s klíči `NejdrivSam` v `src/lib/nadtitulky.ts`, `hodiny.ts`, `skladatel.ts` a `tests/data/podoby.test.ts`) smí jen autor.
- **P3 ze zkoušky:**
  - Bod 8: Sókratův první argument ve Sporu cesty 4 nepotřebuje změnu.
  - Bod 9: Popisky mapy Kde žil se na 390 px překrývají. Je to samostatná úprava MiniMapa, ve vlastním kroku.
  - Bod 10: Hygiena Svelte (`sebekontrola` čtená jednou v Odkryj, nabídka pera zdvojená v Odkryj a RamAktivity) bez dopadu na studenta.
- **Platónův portrét:** text říká, že Aristotelés přišel do Akademie sedmnáctiletý a zůstal dvacet let, až do Platónovy smrti roku 347. Pozorný čtenář si z toho rok narození spočítá. Je to úvaha nad textem, ne vyzrazená odpověď, a zůstalo to.

## Zadání R

Model Opus 5.5, úsilí high.

```
Krok R větve sokrates-opravy: revize oprav po zkušební jízdě skillů. Přečti CLAUDE.md, docs/styl.md, docs/pouceni.md a v docs/plany/sokrates-opravy.md tabulku kroků a oddíl Po O. Nálezy zkoušky jsou v „Claude outputs/zkouska-skillu-sokrates.md“.

Projdi skillem atlas-revize jen to, co větev změnila (`git diff main...sokrates-opravy`), očima studenta na telefonu, učitele a filozofa:
1. Kdo žil dřív? na devíti portrétech: hra stojí nad Dobou a lidmi; navazuje poslední kapitola na hru a hra na Dobu a lidi bez skoku? Na Marcově a Senekově stránce prohozené osoby: dává otázka i odkrytí smysl (věta s pádem, „žil asi N let“)?
2. Spor cesta1-meritko-spor: drží obě strany nejsilnější verzi (argument-analyst, pravidla Sporu v atlas-cesta), nemluví nikdo naposled bez odpovědi druhé strany, sedí znění na podklad (Theaitétos 171a–c, SEP Protagoras 2.2)?
3. Zpětná vazba cesta8-argument a nové tlačítko Odkryj „Odklopit bez odpovědi“ (atlas-psani: zní jako pokyn, ne jako výčitka?).
4. Fokus v Moje stanovisko a Zkus to žít: klávesnicí a s VoiceOverem na 390 i 1440 px, světlý i tmavý režim.
Drobnosti oprav rovnou, zásadní nálezy seřaď podle dopadu s návrhem opravy. Snímky přes scripts/snimky-listy.mjs a scripts/snimky-cesta.mjs. Na konci zapiš Po R do plánu větve a připrav prompt kroku Uzavření (schválení autorem, sloučení do main; na GitHub jen s pokynem autora).
```
