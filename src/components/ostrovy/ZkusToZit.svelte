<script lang="ts">
  // Zkus to žít: týdenní výzva. Jedno hlavní tlačítko „Přijmout výzvu“ (tlačítko rámu aktivity na plném inkoustu,
  // K4b); přijetí se uloží do deníku a místo tlačítka se otiskne razítko „přijato“ (dopad jen po kliknutí).
  import { onMount, tick } from 'svelte';
  import { nacti, prijmiVyzvu } from '../../lib/denik';

  interface Props { id: string; nazev: string; odkaz: string }
  let { id, nazev, odkaz }: Props = $props();
  let prijato = $state(false);
  let cerstve = $state(false);
  let potvrzeni = $state<HTMLElement>();

  onMount(() => { prijato = nacti().vyzvy.some((v) => v.id === id); });

  // Tlačítko po přijetí zmizí: fokus jde na potvrzení, ať z klávesnice nespadne na začátek stránky.
  async function prijmi() {
    prijmiVyzvu({ id, nazev, odkaz });
    prijato = true;
    cerstve = true;
    await tick();
    potvrzeni?.focus();
  }
</script>

{#if prijato}
  <p class="prijato" role="status" tabindex="-1" bind:this={potvrzeni}><span class={['prijato__razitko', cerstve && 'dopad']} aria-hidden="true">přijato</span> Výzva je v tvém deníku. Za týden si tam zapiš, jak dopadla.</p>
{:else}
  <button class="blok__tl blok__tl--hlavni" type="button" onclick={prijmi}>Přijmout výzvu</button>
{/if}

<style>
  .prijato { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3); margin: 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 500; color: var(--ink); }
  /* Razítko v inkoustu (bez barvy pro správně a špatně): dvojitý rámeček jako razítko místa, natočené. */
  /* Fokus po přijetí: rámeček nesmí ležet na textu. */
  .prijato:focus-visible { outline-offset: 6px; border-radius: var(--r-ovladani); }
  .prijato__razitko {
    display: inline-block;
    padding: 4px 12px 5px;
    border: 2px solid var(--ink);
    outline: 1px solid var(--ink);
    outline-offset: 2px;
    border-radius: var(--r-razitko);
    font-weight: 700;
    letter-spacing: .04em;
    rotate: -6deg;
    opacity: .9;
  }
</style>
