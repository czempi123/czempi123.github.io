<script lang="ts">
  // Moje sbírka (/denik/sbirka/; denik-v2, K4, plán › 3): všechny vystřižené citáty pohromadě, nejnovější nahoře,
  // každý v papíru období stránky, odkud ho student vystřihl. Vytisknout (lístky na A4 bez lišt a tlačítek,
  // global.css › html[data-tisk='sbirka']) a Stáhnout jako text (src/lib/sbirka.ts › sbirkaJakoText).
  // Bez localStorage nebo bez výstřižků prázdný stav. Použití: <MojeSbirka client:load obdobiStranek={…} />
  import { onMount } from 'svelte';
  import { nacti, sbirkaPlna, type Denik } from '../../lib/denik';
  import { ceskeDatum, obdobiVystrizku, sbirkaJakoText, seradSbirku, souborSbirky, TEXTY_SBIRKY } from '../../lib/sbirka';
  import Vystrizek from './Vystrizek.svelte';

  interface Props {
    /** adresa stránky (bez kotvy) → období; stránky bez období chybí */
    obdobiStranek: Record<string, number>;
  }
  let { obdobiStranek }: Props = $props();

  let denik = $state<Denik | null>(null);
  const citaty = $derived(denik ? seradSbirku(denik.citaty ?? []) : []);
  const plna = $derived(!!denik && sbirkaPlna(denik));

  /** datum tisku do hlavičky: kdo nechá stránku otevřenou přes půlnoc, vytiskne dnešek */
  let dnes = $state(new Date());

  onMount(() => {
    const obnov = () => (denik = nacti());
    const datum = () => (dnes = new Date());
    obnov();
    window.addEventListener('atlas-denik', obnov);
    window.addEventListener('beforeprint', datum);
    return () => {
      window.removeEventListener('atlas-denik', obnov);
      window.removeEventListener('beforeprint', datum);
    };
  });

  function stahni() {
    const kdy = new Date();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([sbirkaJakoText(denik?.citaty ?? [], kdy)], { type: 'text/plain;charset=utf-8' }));
    a.download = souborSbirky(kdy);
    a.click();
    URL.revokeObjectURL(a.href);
  }
</script>

<div class="moje-sbirka">
  {#if denik && citaty.length}
    <div class="blok__akce moje-sbirka__akce netisk">
      <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={() => print()}>{TEXTY_SBIRKY.vytisknout}</button>
      <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={stahni}>{TEXTY_SBIRKY.stahnout}</button>
    </div>
    {#if plna}<p class="t-popisek moje-sbirka__plna netisk">{TEXTY_SBIRKY.plnaStranka}</p>{/if}
    <!-- Jen v tisku (global.css › Tisk sbírky): čí sbírka a z kdy; jméno se píše rukou, do deníku nepatří. -->
    <p class="moje-sbirka__tisk">
      <span>{TEXTY_SBIRKY.hlavickaTextu}</span><span aria-hidden="true">·</span><span>{ceskeDatum(dnes)}</span><span aria-hidden="true">·</span>
      <span class="moje-sbirka__jmeno">{TEXTY_SBIRKY.jmenoTisk}<span class="moje-sbirka__linka"></span></span>
    </p>
    <ul class="vystrizky" aria-label="Vystřižené citáty">
      {#each citaty as c, i (c.id)}
        <Vystrizek {c} paska={i === 0} obdobi={obdobiVystrizku(c.odkaz, obdobiStranek) ?? null} />
      {/each}
    </ul>
  {:else if denik}
    <p class="moje-sbirka__prazdna">{TEXTY_SBIRKY.prazdna}</p>
  {/if}
</div>

<style>
  .moje-sbirka { margin-top: var(--s-6); }
  .moje-sbirka__akce { justify-content: flex-start; margin-bottom: var(--s-5); }
  .moje-sbirka__plna { margin: 0 0 var(--s-5); color: var(--ink-2); }
  .moje-sbirka__prazdna { margin: 0; }
  .moje-sbirka__tisk { display: none; }
  .vystrizky { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); align-items: start; gap: var(--s-6) var(--s-5); margin: 0; padding: var(--s-3) 0 0; list-style: none; }
</style>
