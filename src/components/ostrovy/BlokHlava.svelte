<script lang="ts">
  // Hlava rámu aktivity (K4a): rodina aktivit (nadtitulek z dat) s tečkou v inkoustu období, nepovinný název
  // a mince lidí, o kterých blok je (razítko člověka místo mince přinese K4b).
  import Mince from '../mapa/Mince.svelte';
  import type { ClovekBloku } from './bloky-typy';

  interface Props { nadtitulek: string; nazev?: string; lide?: ClovekBloku[] }
  let { nadtitulek, nazev, lide = [] }: Props = $props();
</script>

<div class="blok__hlava" data-cast="hlava">
  <div class="blok__hlava-text">
    <p class="t-nadtitulek blok__nadtitulek">{nadtitulek}</p>
    {#if nazev}<p class="blok__nazev">{nazev}</p>{/if}
  </div>
  {#if lide.length}
    <span class="blok__mince" aria-hidden="true">
      {#each lide as c (c.jmeno)}<Mince ikona={c.ikona} obdobi={c.obdobi} varianta="tint" velikost={40} />{/each}
    </span>
  {/if}
</div>
