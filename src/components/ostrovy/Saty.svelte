<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Stejné šaty, jiné světlo: kresba k šatům z roku 2015 (cesta 1, krok 6). Postava v šatech stojí v místnosti
  // s obrazem, lampou, kočkou a vázou. Šaty mají pořád stejné dvě barvy, modrou a hnědou, jako body té fotky.
  // Posuvník mění světlo v místnosti a s ním barvy všeho ostatního. V chladném světle se šaty shodují s bílým
  // okrajem obrazu a zlatým rámem, v teplém s modrou vázou a černou kočkou (počítá src/lib/saty.ts).
  // Rám dává Kresba.svelte; nic tu neběží samo, proto kresba nemá tlačítko pohybu. Barvy jsou vlastní:
  // kresba je o barvě, tři tóny období na ni nestačí.
  // Podklad: docs/podklady/celek-1-pravda.md › Tvrzení: nový případ (šaty, 2015), bod 4. Fotku atlas nepřebírá.
  // Použití v MDX: <Saty id="saty-svetlo" />
  import Kresba from './Kresba.svelte';
  import { BARVY_SATU, STUPNE_SVETLA, VYCHOZI_STUPEN, scena } from '../../lib/saty';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 1 }: Props = $props();

  const NAZEV = NAZVY_KRESEB.Saty;
  const POHLEDY = [{ id: 'saty', nazev: NAZEV }];
  let pohled = $state<string>('saty');
  let stupen = $state(VYCHOZI_STUPEN);
  let s = $derived(scena(stupen));
  let b = $derived(s.veci);

  /** Obrys šatů; pruhy se do něj ořezávají. */
  const STRIH = 'M152,58 L162,58 Q170,72 178,58 L188,58 L194,90 L187,116 L212,206 L128,206 L153,116 L146,90 Z';
  /** Horní hrany hnědých pruhů: ramena, pas a tři volány sukně. */
  const PRUHY = [58, 110, 144, 170, 196];
  const KOCKA = 'M52,222 C44,222 40,214 42,204 C44,194 50,188 56,186 L54,176 L60,181 L66,181 L72,176 L70,186 C78,190 82,198 82,208 C82,216 78,222 72,222 Z M78,218 C92,220 98,212 94,202';
  const LISTY = 'M272,150 C262,128 250,120 242,96 C262,104 270,122 274,146 Z M274,150 C276,120 284,104 300,88 C298,112 290,132 278,150 Z M273,150 C270,126 272,104 276,82 C282,106 280,128 277,150 Z';
</script>

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.Saty} nazev={NAZEV} pohledy={POHLEDY} bind:pohled popis={STUPNE_SVETLA[stupen].popis} maPohyb={false}>
  {#snippet kresba()}
    <defs>
      <clipPath id="{id}-strih"><path d={STRIH} /></clipPath>
      <radialGradient id="{id}-zare">
        <stop offset="0" stop-color="#fffbe0" stop-opacity="1" />
        <stop offset="1" stop-color="#fffbe0" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect class="vec stena" width="340" height="192" style:fill={b.stena} />
    <rect class="vec vec-bila" y="192" width="340" height="6" style:fill={b.bila} />
    <rect class="vec podlaha" y="198" width="340" height="42" style:fill={b.podlaha} />

    <!-- Obraz: zlatý rám a bílý okraj. V chladném světle mají barvy šatů. Koláž (K7b): věci jsou výstřižky se stínem,
         barvy mají vlastní (kresba je o barvě). -->
    <g class="k-vystrih">
    <rect class="vec vec-zlata" x="26" y="44" width="78" height="98" style:fill={b.zlata} />
    <rect class="vec vec-bila" x="34" y="52" width="62" height="82" style:fill={b.bila} />
    <rect class="vec" x="45" y="63" width="40" height="60" style:fill={b.obraz} />
    </g>

    <!-- Lampa: svítí jen v teplém světle. -->
    <circle class="zare" cx="272" cy="52" r="46" fill="url(#{id}-zare)" style:opacity={s.lampa} />
    <rect class="vec" x="271" y="0" width="2" height="24" style:fill={b.cerna} />
    <path class="vec vec-bila" d="M256,44 L263,24 L281,24 L288,44 Z" style:fill={b.bila} />

    <!-- Černá kočka a modrá váza. V teplém světle mají barvy šatů. -->
    <g class="k-vystrih">
    <path class="vec vec-cerna" d={KOCKA} stroke-width="3" stroke-linecap="round" style:fill={b.cerna} style:stroke={b.cerna} />
    <path class="vec" d={LISTY} style:fill={b.list} />
    <path class="vec vec-modra" d="M258,218 C250,196 254,170 264,150 L284,150 C294,170 298,196 290,218 Z" style:fill={b.modra} />

    </g>
    <!-- Postava: pleť, černé vlasy a boty. -->
    <g class="k-vystrih">
    <path class="vec" d="M153,66 L142,128 M187,66 L198,128 M161,204 V226 M179,204 V226" fill="none" stroke-width="7" stroke-linecap="round" style:stroke={b.plet} />
    <ellipse class="vec" cx="159" cy="230" rx="8" ry="4" style:fill={b.cerna} />
    <ellipse class="vec" cx="181" cy="230" rx="8" ry="4" style:fill={b.cerna} />
    <rect class="vec" x="166" y="48" width="8" height="12" style:fill={b.plet} />
    <circle class="vec" cx="170" cy="34" r="15" style:fill={b.cerna} />
    <circle class="vec" cx="170" cy="39" r="11.5" style:fill={b.plet} />

    </g>
    <!-- Šaty. Jejich barvy jsou pořád tytéž. -->
    <g class="saty" clip-path="url(#{id}-strih)">
      <rect class="saty-modra" x="110" y="50" width="120" height="170" fill={BARVY_SATU.modra} />
      {#each PRUHY as y (y)}
        <rect class="saty-hneda" x="110" {y} width="120" height="10" fill={BARVY_SATU.hneda} />
      {/each}
    </g>
  {/snippet}

  {#snippet ovladani()}
    <div class="k-posuvnik">
      <label for="{id}-svetlo">Posuň: mění se jen světlo</label>
      <input id="{id}-svetlo" type="range" min="0" max={STUPNE_SVETLA.length - 1} step="1" bind:value={stupen} aria-valuetext={STUPNE_SVETLA[stupen].nazev} />
      <output for="{id}-svetlo">{stupen + 1} z {STUPNE_SVETLA.length} · {STUPNE_SVETLA[stupen].nazev}</output>
    </div>
    <p class="vzorky">
      <span class="vzorek" style:background={BARVY_SATU.modra}></span>
      <span class="vzorek" style:background={BARVY_SATU.hneda}></span>
      Barvy šatů: pořád tyhle dvě.
    </p>
  {/snippet}
</Kresba>

<style>
  .vec { transition: fill var(--d-kamera), stroke var(--d-kamera); }
  .zare { transition: opacity var(--d-kamera); }

  .vzorky {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    color: var(--ink-2);
  }
  .vzorek { flex: none; width: 24px; height: 24px; border-radius: var(--r-razitko); box-shadow: var(--lezi-tlak); }
</style>
