<script lang="ts">
  // Volba pera (K4a, bod 3): tři pera, výchozí modré. Ukáže se jednou v rámu aktivity při první odpovědi
  // (RamAktivity.svelte) a pořád v deníku. Změna se hned projeví na celé stránce (data-pero na <html>).
  // <VolbaPera />  ·  <VolbaPera kompaktni />
  import { onMount } from 'svelte';
  import { PERA, VYCHOZI_PERO, ukazPero, type Pero } from '../../lib/pero';
  import { peroDeniku, ulozPero } from '../../lib/denik';

  interface Props { kompaktni?: boolean }
  let { kompaktni = false }: Props = $props();
  let pero = $state<Pero>(VYCHOZI_PERO);
  const uid = $props.id();
  const id = `pero-${uid}`;

  onMount(() => {
    pero = peroDeniku() ?? VYCHOZI_PERO;
    const zmena = () => { pero = peroDeniku() ?? VYCHOZI_PERO; };
    addEventListener('atlas-denik', zmena);
    return () => removeEventListener('atlas-denik', zmena);
  });

  function vyber(p: Pero) {
    pero = p;
    ulozPero(p);
    ukazPero(p);
  }
</script>

<div class={['volba-pera', kompaktni && 'volba-pera--kompaktni']} role="group" aria-labelledby={id}>
  <p class="volba-pera__popis" id={id}>{kompaktni ? 'Tohle je tvoje pero. Chceš jiné?' : 'Moje pero'}</p>
  <div class="volba-pera__pera">
    {#each PERA as p (p.id)}
      <button type="button" class="vystouple volba-pera__tl" aria-pressed={pero === p.id} onclick={() => vyber(p.id)}>
        <b style={`color: var(--pero-${p.id})`} aria-hidden="true">moje pero</b>
        <span>{p.nazev}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .volba-pera { margin-top: var(--s-5); }
  .volba-pera__popis { margin: 0 0 var(--s-3); font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .volba-pera__pera { display: flex; flex-wrap: wrap; gap: var(--s-3); }
  .volba-pera__tl {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    min-width: 132px;
    min-height: 56px;
    padding: 8px 16px 10px;
    border-radius: var(--r-ovladani);
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.3;
    color: var(--ink-2);
  }
  .volba-pera__tl b { font-family: var(--font-ruka); font-size: 22px; font-weight: 400; line-height: 1.1; }
  .volba-pera__tl[aria-pressed='true'] span { color: var(--ink); font-weight: 600; }
  .volba-pera__tl b { white-space: nowrap; }
  .volba-pera--kompaktni .volba-pera__tl { min-width: 0; flex: 1 1 96px; padding-inline: 12px; }
  .volba-pera--kompaktni .volba-pera__tl b { font-size: 19px; }
  .volba-pera__tl:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
</style>
