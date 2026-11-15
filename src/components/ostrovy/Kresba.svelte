<script lang="ts">
  // Kresba s pohybem: společný rám pro vlastní kresby atlasu, které se hýbou (jeskyně ve dvou pohledech, cesta ven).
  // Rám dává kartu, název, přepínač pohledů, plátno, text pod kresbou a tlačítko, které pohyb zastaví a pustí.
  // Scéna (obsah <svg>) a případné další ovládání (posuvník) přicházejí jako snippety z ostrovu konkrétní kresby.
  // Pravidla (docs/design.md › Komponenty › Kresba s pohybem): pohyb běží jen tam, kde ho student nemá omezený,
  // jde zastavit a zastavený zůstane stát; text pod kresbou říká totéž slovy a je popisem obrázku pro čtečky;
  // kresba nic neukládá a nenabízí Kam dál. Barvy: třídy k-svetlo, k-stin a k-tma (global.css › Kresba s pohybem).
  // Pohyblivý prvek dostane třídu k-hybe a vlastní animaci pod :global(.kresba--pohyb); zastavení řeší rám.
  // Posuvník ve snippetu ovladani dostane třídu k-posuvnik, přepínač třídy k-volba a k-prepinac (global.css).
  // Kresba bez vlastního pohybu: maPohyb={false}.
  // Použití: viz src/components/ostrovy/Jeskyne.svelte, JeskyneVen.svelte, Saty.svelte, StejnyVitr.svelte,
  // DvePulky.svelte, KolikJeDost.svelte a Lod.svelte (posuvník, dva pohledy a pohyb, který běží sám).
  import { onMount, type Snippet } from 'svelte';
  import { omezenyPohyb } from '../../lib/pohyb';
  import { nezlomitelne } from '../../lib/sazba.js';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
    nadtitulek?: string;
    nazev: string;
    /** pohledy kresby; jeden pohled přepínač neukáže */
    pohledy: { id: string; nazev: string }[];
    /** zvolený pohled (bind:pohled) */
    pohled: string;
    /** text pod kresbou: říká totéž co kresba */
    popis: string;
    /** obsah plátna (prvky SVG) */
    kresba: Snippet;
    /** další ovládání mezi plátnem a popisem (posuvník) */
    ovladani?: Snippet;
    /** rozměr plátna; výchozí 340 × 240 jednotek (na telefonu vyjde jednotka asi na pixel) */
    viewBox?: string;
    /** běží v kresbě něco samo? Kresba, kterou hýbe jen student (posuvník), tlačítko pohybu nemá. */
    maPohyb?: boolean;
  }
  let { id, obdobi = 1, nadtitulek = 'Podívej se', nazev, pohledy, pohled = $bindable(), popis, kresba, ovladani, viewBox = '0 0 340 240', maPohyb = true }: Props = $props();
  /** Široká kresba (víc než 1,8 : 1): na plátně v podobě Jen kresba zůstane ovládání pod ní, ne vedle (src/styles/promitani.css). */
  let siroka = $derived.by(() => {
    const [, , w, h] = viewBox.split(/[\s,]+/).map(Number);
    return w > 0 && h > 0 && w / h > 1.8;
  });

  /** smí se kresba hýbat (student nemá zapnutý omezený pohyb) */
  let smiPohyb = $state(false);
  let bezi = $state(false);

  onMount(() => {
    smiPohyb = !omezenyPohyb();
    bezi = smiPohyb;
  });

  let nazevPohledu = $derived(pohledy.find((p) => p.id === pohled)?.nazev ?? nazev);
</script>

<figure class="kresba obdobi-{obdobi}" class:kresba--pohyb={smiPohyb} class:kresba--bezi={bezi} {id} data-siroka={siroka ? '' : undefined}>
  <figcaption class="kresba__hlava" data-cast="hlava">
    <p class="t-nadtitulek kresba__nadtitulek">{nadtitulek}</p>
    <p class="t-h3 kresba__nazev" id="{id}-nazev">{nazev}</p>
  </figcaption>

  {#if pohledy.length > 1}
    <div class="kresba__prepinac k-prepinac" role="radiogroup" aria-labelledby="{id}-nazev">
      {#each pohledy as p (p.id)}
        <label>
          <input type="radio" name="{id}-pohled" value={p.id} bind:group={pohled} />
          <span>{p.nazev}</span>
        </label>
      {/each}
    </div>
  {/if}

  <svg class="kresba__platno" data-cast="platno" {viewBox} role="img" aria-label={nazevPohledu} aria-describedby="{id}-popis">
    {@render kresba()}
  </svg>

  {#if ovladani}{@render ovladani()}{/if}

  <!-- Text přichází z JavaScriptu kresby, plugin pro MDX ho nevidí: nezlomitelné mezery doplní rám. -->
  <p class="kresba__popis" data-cast="popis" id="{id}-popis" aria-live="polite">{nezlomitelne(popis)}</p>

  {#if smiPohyb && maPohyb}
    <button type="button" class="blok__tl blok__tl--tiche kresba__pohyb" onclick={() => (bezi = !bezi)}>
      {bezi ? 'Zastavit pohyb' : 'Pustit pohyb'}
    </button>
  {/if}
</figure>

<style>
  .kresba {
    max-width: 520px;
    /* Na střed sloupce jako text kolem (autor 15. 11. 2026: kresby stály u levého kraje). */
    margin: var(--s-6) auto;
    padding: var(--s-3);
    border: 1px solid var(--rule);
    border-radius: var(--r-md);
    background: var(--surface);
    scroll-margin-top: calc(var(--hlavicka) + var(--hodina) + var(--s-4));
  }
  @media (min-width: 700px) {
    .kresba { padding: var(--s-4); }
  }
  .kresba__hlava { margin: 0 0 var(--s-3); }
  .kresba__nadtitulek { margin: 0 0 var(--s-1); color: var(--pc, var(--ink)); }
  .kresba__nazev { margin: 0; }

  /* Vzhled přepínače je v global.css (k-prepinac); sdílí ho s přepínači v ovládání kreseb. */
  .kresba__prepinac { margin: 0 0 var(--s-3); }

  .kresba__platno { display: block; width: 100%; height: auto; border-radius: var(--r-sm); }
  .kresba__popis {
    margin: var(--s-3) 0 0;
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    line-height: 1.5;
    color: var(--ink-2);
  }
  .kresba__pohyb { margin-top: var(--s-3); }
</style>
