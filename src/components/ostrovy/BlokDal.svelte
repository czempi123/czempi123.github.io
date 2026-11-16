<script lang="ts">
  // „Kam dál“ po dokončení bloku: jeden další krok (další krok cesty, profil, mapa, kotva pod blokem).
  // V kroku cesty nabízí další krok lišta (Další krok se po odpovědi rozsvítí, K5): blok tentýž odkaz
  // neopakuje, aby vedle sebe nestála dvě stejná tlačítka. Vlastní Kam dál (kotva) a vedlejší odkaz zůstávají.
  import { onMount } from 'svelte';
  import { odkryti } from '../../lib/pohyb';
  import type { Dal } from './bloky-typy';

  interface Props { dal?: Dal; vedlejsi?: Dal }
  let { dal, vedlejsi }: Props = $props();
  let vListe = $state(false);
  onMount(() => {
    const dalsi = document.querySelector('[data-dalsi-krok]')?.getAttribute('href');
    vListe = !!dal && !!dalsi && dalsi === dal.href;
  });
  let ukaz = $derived(dal && !vListe ? dal : undefined);
</script>

{#if ukaz || vedlejsi}
  <nav class="blok__dal" aria-label="Kam dál" data-cast="dal" in:odkryti>
    {#if ukaz}
      <a class="blok__tl blok__tl--hlavni" href={ukaz.href}>
        <span>{ukaz.text}</span>
        <svg width="20" height="20" aria-hidden="true" focusable="false"><use href="/ikony/ui.svg#dal" /></svg>
      </a>
    {/if}
    {#if vedlejsi}
      <a class="blok__tl blok__tl--vedlejsi" href={vedlejsi.href}>{vedlejsi.text}</a>
    {/if}
  </nav>
{/if}
