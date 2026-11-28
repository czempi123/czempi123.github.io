# Revize větve sokrates-opravy (28. 11. 2026)

Revize jen toho, co větev změnila (`git diff main...sokrates-opravy`), skillem `atlas-revize`: očima studenta na telefonu, učitele a filozofa. Snímky jsou v `Claude outputs/revize-sokrates-opravy/` (mimo git).

**Verdikt:** připraveno ke schválení. Jedna věc rozbíjela smysl bodu 1 (razítka s roky ve hře) a je opravená; zbytek jsou drobnosti, opravené rovnou, a dva návrhy pro autora.

## Co bylo ověřeno

- **Kdo žil dřív? na devíti portrétech** stojí mezi poslední kapitolou a Dobou a lidmi (výpis z `dist/` a snímky 390 px). Nad hrou nejsou roky druhé osoby. Na Marcově stránce: „Jak daleko od sebe žili Marcus Aurelius a Seneca?“, „Přetáhni život, který patří jménu Seneca…“, „Seneca žil asi 65 let“, po odhalení „Dělí je asi 56 let.“ Na Senekově: „…Seneca a Sókratés?“, „Sókratés žil asi 70 let“, „Dělí je asi 398 let.“ Obojí sedí s daty a čte se bez skoku.
- **Spor `cesta1-meritko-spor`** (argument-analyst udělaný ručně, skill v sezení nebyl): Prótagorás odpovídá na sebevyvrácení dřív, než ho student u Sókrata přečte, a jeho odpověď (výhrada „pro ně“) kryje i Sókratův nový závěr „Není pravdou pro nikoho“. Sókratův krok sedí na Theaitéta 171a–c, jak ho drží podklad; Prótagorova odpověď na SEP, Protagoras 2.2. Postoje nejsou krajnější než citáty. Scéna neohlašuje vítěze („kdyby vystrčil hlavu…“, „rozhodni sám“).
- **`cesta8-argument`**: „Z obou důvodů závěr ještě neplyne.“ stojí pod titulkem „Tvůj závěr: …“ a mluví o argumentu, ne o studentovi. Zní jako další krok, ne jako výčitka.
- **Odkryj „Odklopit bez odpovědi“**: vedlejší tlačítko, pokyn bez hodnocení; sedí se slovem na přeloženém papíře („Nejdřív napiš svoje, pak odklop.“).
- **Fokus** (Playwright, klávesnice, 390 i 1440 px, světlý i tmavý): Moje stanovisko → fokus v poli s popiskem otázky; Uložit → fokus na „Upravit stanovisko v deníku“; Zkus to žít → fokus na potvrzení, čtečka slyší „status: Výzva je v tvém deníku…“ (razítko „přijato“ je skryté). Nic neleží pod spodní lištou. VoiceOver sám spuštěný nebyl; strom přístupnosti je ověřený přes `ariaSnapshot`.
- `npm run build` a celé `npm test` (výsledek v plánu větve, Po R).

## Nálezy

### [důležité] Razítka ve hře Kdo žil dřív? nesla odpověď — opraveno
- **Kde:** `src/components/ostrovy/KdoZilDriv.svelte`, hlavička rámu aktivity (razítka obou lidí).
- **Co bylo špatně:** po obvodu razítek stály roky obou lidí („asi 412–323 př. n. l.“, „asi 427–347 př. n. l.“). Přesun hry nad Dobu a lidi tak odpověď neschoval: ležela přímo v hlavičce hry, na všech portrétech i v cestách.
- **Proč to vadí studentovi:** kdo si razítko přiblíží, odpověď opíše místo odhadu.
- **Oprava (provedená):** do odhalení razítka nesou jen jméno a atribut, bez let a bez roku narození uprostřed; roky se ukážou s odhalením.

### [drobné] První letopočet osy uříznutý na telefonu — opraveno
- **Kde:** `KdoZilDriv.svelte`, osa odhadu vzdálenosti na 390 px („00 př. n. l.“ na Marcově a Senekově stránce).
- **Oprava (provedená):** popisek u kraje osy se zarovná ke značce dovnitř rámu.

### [drobné] Prótagorova odpověď říkala totéž dvakrát — opraveno
- **Kde:** `cesta1-meritko-spor.yaml`, Prótagorás, třetí argument.
- **Oprava (provedená):** „Jenže oni mají pravdu pro sebe. Že se Prótagorás mýlí, je pravda pro ně, ne pro něj.“ → „Jenže to, že se mýlí, je pravda pro ně, ne pro něj.“

### [drobné] Rámeček fokusu na potvrzení Zkus to žít ležel na textu — opraveno
- **Kde:** `ZkusToZit.svelte`, `.prijato:focus-visible`.
- **Oprava (provedená):** odstup rámečku od textu.

### [drobné, návrh] Hra hned pod Linkou bezpečí na Senekově stránce
- **Kde:** `src/content/osobnosti/seneca.mdx`, konec kapitoly Co zůstalo (`<RadekPomoci />`) a pod ním Kdo žil dřív?.
- **Co je špatně:** po přesunu následuje po řádku s Linkou bezpečí rovnou hra s tažením života. Dřív mezi nimi stála Doba a lidé.
- **Proč to vadí studentovi:** student, kterého se řádek pomoci týká, dostane hned pod ním kvíz. Je to skok v tónu, ne chyba.
- **Oprava (návrh):** na Senekově stránce může hra stát i pod Dobou a lidmi: Sókratés v ní není, takže roky neprozradí. Druhá možnost je nechat to tak, jak to je, a mít na všech devíti portrétech stejné místo. Rozhodne autor; já bych to nechal.

### [drobné, návrh] Potvrzení Zkus to žít se čtečce ozve dvakrát
- **Kde:** `ZkusToZit.svelte`, `<p role="status" tabindex="-1">`.
- **Co je špatně:** živá oblast ohlásí změnu a fokus na tomtéž odstavci ji přečte znovu.
- **Oprava (návrh):** ověřit se skutečným VoiceOverem; pokud čte dvakrát, `role="status"` odebrat (fokus hlášení nese sám).
