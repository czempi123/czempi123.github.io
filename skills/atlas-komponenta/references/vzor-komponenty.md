# Vzor komponenty

## Soubory

| Co | Kde |
| --- | --- |
| Ostrov (interaktivní) | `src/components/ostrovy/Jmeno.svelte`, u velkých nástrojů vlastní složka (`src/components/mapa/`) |
| Statická část bez JavaScriptu | `src/components/<oblast>/Jmeno.astro` |
| Čistá logika | `src/lib/<tema>.ts` + `tests/data/<tema>.test.ts` |
| Průchod v prohlížeči | `tests/e2e/<tema>.spec.ts`, snímky do `test-results/snimky/` |
| Kresba s pohybem | ostrov `src/components/ostrovy/<Jmeno>.svelte` na rámu `Kresba.svelte`, obal `src/components/bloky/<Jmeno>.astro`, texty a geometrie v `src/lib/<tema>.ts` |

## Kostra ostrovu

```svelte
<script lang="ts">
  // Volba s důvodem: student vybere možnost a může připsat proč; zpětná vazba patří k volbě.
  // Použití v MDX:
  // <Volba client:visible id="sokrates-utek" otazka="Co bys udělal?" moznosti={[...]} />
  import { onMount } from 'svelte';
  import { ulozZapis } from '../../lib/denik';

  interface Props {
    id: string;
    otazka: string;
  }
  let { id, otazka }: Props = $props();
  let vybrano = $state<string | null>(null);

  onMount(() => {
    // Jen tady (ne při sestavení): localStorage, matchMedia, requestAnimationFrame.
  });
</script>

<section class="blok" aria-labelledby="{id}-otazka">
  <p class="t-nadtitulek nadtitulek">Tvůj tah</p>
  <h3 class="t-h3" id="{id}-otazka">{otazka}</h3>
  …
</section>

<style>
  .blok { padding: var(--s-5); border: 1px solid var(--rule); border-radius: var(--r-md); background: var(--surface); }
  .nadtitulek { color: var(--pc, var(--ink)); }
</style>
```

## Tokeny a vzhled

- Barvy jen přes proměnné z `src/styles/tokens.css`: `--paper`, `--surface`, `--sunk`, `--rule`, `--muted`, `--ink-2`, `--ink`; barva období přes třídu `obdobi-N` na předkovi (`--pc`, `--pc-tint`, `--pc-soft`, `--pc-plate`, `--pc-on-plate`).
- Písma: `--font-serif` (Newsreader) pro čtení a otázky, `--font-sans` (Instrument Sans) pro ovládání; velikosti třídami `t-h3`, `t-ovladani`, `t-popisek`…
- Mezery `--s-1` až `--s-10`, zaoblení `--r-*`, pohyb `--pohyb*` (při omezeném pohybu nulový).
- Tlačítka podle design.md: hlavní (`--ink`, text `--paper`, výška 48–56), vedlejší (obrys `--ink`), tiché (obrys `--rule`).
- Volba s důvodem: karty A–D aspoň 60 px, vybraná s okrajem 2 px a tintem období, zpětná vazba v tintu s titulkem „Tvůj tah: …“ a oddílem „Co udělal …“.

## Přístupnost

- Každý ovládací prvek je `<button>`, `<input>`, `<a>` nebo má správnou roli (`slider`, `tab`…) a ovládání klávesnicí podle ARIA vzorů.
- Seznam mnoha podobných prvků (řádky, karty) = jedna zastávka tabulátoru a šipky mezi nimi (roving tabindex).
- Změny, které student má slyšet (odkrytí, zpráva), jdou do oblasti `aria-live="polite"`.
- Fokus 2 px `--ink` s odsazením, jen při `:focus-visible`.
- Kontrast AA pro všechen text ve světlém i tmavém režimu; ikony `aria-hidden`, význam nese text nebo `aria-label`.

## Kresba s pohybem

Vlastní kresba, která se hýbe a kterou student ovládá: prostor, děj nebo pořadí, které se z textu špatně představuje. Autor ji chce v atlasu častěji (rozhodnutí ze 4. 10. 2026). Vzor jsou `Jeskyne.svelte` (dva pohledy) a `JeskyneVen.svelte` (řez s postavami na cestě a posuvník). Kdy po ní sáhnout a kam ji dát, říkají skilly `atlas-cesta` a `atlas-osobnost`.

- **Rám nepiš znovu.** `src/components/ostrovy/Kresba.svelte` dává kartu, název, přepínač pohledů, plátno, text pod kresbou a tlačítko Zastavit pohyb / Pustit pohyb. Ostrov kresby mu předá scénu (snippet `kresba` s prvky SVG) a případné další ovládání (snippet `ovladani`, třeba posuvník). K ostrovu patří obal `src/components/bloky/<Jmeno>.astro` s `client:visible` a řádek v `bloky/index.ts`.
- **Koláž** (od K7b větve design-v2): výstřižky bez obrysových čar se stínem výstřižku (`k-list`, `k-listek-papir`, `k-pp` a `k-vystrih`), zem natržený pruh (`natrzenyPruh` v `src/lib/kresby.ts`), směr a síly tužkou (`k-tuzka`), barva období jen na jednom nositeli významu (`k-pp`), repliky na lístečku s páskou (`KresbaListek.svelte`), popisky `k-popisek` (na tmavém `k-popisek--svetly`). Světlo a tma tři tóny `k-svetlo`, `k-stin`, `k-tma`, které drží pořadí ve dne i v noci (`global.css` › Kresba s pohybem). Jiné barvy ne; kresba tak sedí ve světlém i tmavém režimu sama. Výjimka je kresba, jejímž tématem je barva (`Saty.svelte`): barvy má vlastní, zapsané v `src/lib/<tema>.ts` s testem, a v obou režimech stejné. Novou kresbu si prohlédni i v noci: černý papír na tmavém papíře zmizí (hrana tužkou), postava z listu taky (`k-svetlo`).
- **Plátno 340 × 240 jednotek:** na telefonu vyjde jednotka asi na pixel. Popisky v kresbě mají 11,5 jednotky a jedno až tři slova. Postavy a věci jsou jednoduché siluety; hlava má poloměr aspoň 3,5 jednotky.
- **Pohyb je CSS, ne JavaScript.** Animaci dej pod `:global(.kresba--pohyb)` a prvku třídu `k-hybe`; zastavení a omezený pohyb pak řeší rám. Bez `.kresba--pohyb` (omezený pohyb, sestavení) musí kresba vypadat dobře i stát: výchozí poloha je součást návrhu. Změny stavu jdou přes `transition` s tokeny `--pohyb*`.
- **Nic se nestřídá samo.** Pohyb je děj uvnitř jednoho pohledu (stíny jdou po stěně, dvojice stoupá). Pohled nebo stupeň mění jen student: přepínačem (dva pohledy na totéž) nebo posuvníkem (`<input type="range">` s `aria-valuetext`, pořadí nebo míra).
- **Text pod kresbou říká totéž slovy** (`popis`, `aria-live`) a je popisem obrázku pro čtečky. Texty pohledů a stupňů patří do `src/lib/<tema>.ts` s testem (věty do 25 slov, co říká pramen); tam patří i geometrie (kde leží stín, co je na kterém stupni vidět).
- **Ovládání pod plátnem** jde do snippetu `ovladani`: posuvník má třídu `k-posuvnik`, přepínač pilulky rámu (`k-prepinac`) v obalu `k-volba` s popiskem nad sebou nebo `k-volba--radek` s popiskem vlevo, tlačítka jsou běžná `blok__tl` v řádku `blok__akce`. Vzory: `StejnyVitr.svelte` (dva přepínače), `DvePulky.svelte` (přepínač karet rámu, tlačítko, volba pod plátnem), `KolikJeDost.svelte` (tlačítka).
- **Kresba, ve které nic neběží samo,** předá rámu `maPohyb={false}` a tlačítko pohybu nemá (šaty, dvě půlky, pohár). Jednorázový děj po klepnutí (proud vody) je přechod, ne animace: při omezeném pohybu se neukáže a stav se změní hned.
- **Není to blok:** žádná třída `.blok`, žádný zápis do deníku, žádné Kam dál. Testy průchodu cest ji proto míjejí. Smí stát i pod blokem (šaty pod Změň jednu věc, dvě půlky pod Odkryj, vítr v profilu pod Volbou): blok k ní pak vede vlastním Kam dál a další krok nabízí lišta.
- **Testy navíc:** animace běží a po zastavení stojí (`animation-play-state`; polohu čti až po dalším snímku prohlížeče), při omezeném pohybu tlačítko chybí, přepínač a posuvník jdou klávesnicí, popisky v SVG se nepřekrývají, snímek každého pohledu a stupně. Hodnotu po přechodu čti přes `expect.poll`. Snímky pro autora: `node scripts/snimky-prvek.mjs` (`POHYB=1` nechá animaci běžet, `POSUVNIK=n` nastaví posuvník).
