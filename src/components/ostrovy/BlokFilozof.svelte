<script lang="ts">
  // Oddíl „Co udělal …“ s razítkem filozofa (pod 48 px bez obvodu).
  import type { Snippet } from 'svelte';
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import type { ClovekBloku } from './bloky-typy';

  interface Props { filozof: ClovekBloku; nadpis?: string; children: Snippet }
  let { filozof, nadpis, children }: Props = $props();
</script>

<div class="blok__oddil obdobi-{filozof.obdobi}">
  <div class="blok__filozof">
    <RazitkoCloveka razitko={filozof.razitko} obdobi={filozof.obdobi} velikost={44} />
    <h4 class="blok__zpetna-titulek">{nadpis ?? `Co ${filozof.zena ? 'udělala' : 'udělal'} ${filozof.jmeno}`}</h4>
  </div>
  {@render children()}
</div>
