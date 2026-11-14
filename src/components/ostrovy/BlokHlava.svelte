<script lang="ts">
  // Hlava rámu aktivity (K4a): rodina aktivit (nadtitulek z dat) s tečkou v inkoustu období, nepovinný název
  // a razítka lidí, o kterých blok je (poštovní razítko, K4b).
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
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
      {#each lide as c (c.jmeno)}<RazitkoCloveka razitko={c.razitko} obdobi={c.obdobi} velikost={56} />{/each}
    </span>
  {/if}
</div>
