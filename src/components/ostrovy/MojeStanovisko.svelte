<script lang="ts">
  // Moje stanovisko: krátký zápis do deníku k otázce. Dobrovolné, nic se nehodnotí ani neodesílá.
  // Použití v MDX:
  // <MojeStanovisko client:visible id="sokrates-nikdo-nedela-zlo" otazka="…" odkaz="/osobnost/sokrates/#myslenky" />
  // <MojeStanovisko client:visible rozbalene id="cesta1-moje-pravidlo" otazka="…" odkaz="/cesta/…/7/" />
  // S `rozbalene` je pole vidět hned a zápis se do deníku ukládá sám během psaní (závěr cesty).
  // `popisek` je text nad polem, když se liší od otázky zápisu v deníku; `nepovinne` k němu přidá „Nepovinné“.
  // Pole je studentova ruka (K4b): Kalam perem na linkách (.blok__pole), tlačítka rámu aktivity.
  import { onMount, tick } from 'svelte';
  import { nacti, ulozZapis, smazZapis, type Zapis } from '../../lib/denik';
  import { nezlomitelne } from '../../lib/sazba.js';

  // `druh` se zapíše k zápisu (Tvoje antika: odpověď u otázky jako stanovisko, stejně jako Změnil se?).
  interface Props { id: string; otazka: string; odkaz: string; rozbalene?: boolean; popisek?: string; nepovinne?: boolean; druh?: Zapis['druh'] }
  let { id, otazka, odkaz, rozbalene = false, popisek, nepovinne = false, druh }: Props = $props();
  let otevreno = $state(false);
  let text = $state('');
  let ulozeno = $state(false);
  let casovac: ReturnType<typeof setTimeout> | undefined;
  // Tlačítko a pole se střídají na stejném místě: fokus jde po otevření do pole a po zavření zpět na tlačítko,
  // jinak by z klávesnice spadl na začátek stránky (zkouška skillů, sokrates-opravy, bod 4).
  let tlacitko = $state<HTMLButtonElement>();
  let pole = $state<HTMLTextAreaElement>();

  async function otevri() {
    otevreno = true;
    await tick();
    pole?.focus();
  }

  async function zavri() {
    otevreno = false;
    await tick();
    tlacitko?.focus();
  }

  onMount(() => {
    const z = nacti().zapisy.find((x) => x.id === id);
    if (z) { text = z.odpoved; ulozeno = true; }
    if (!rozbalene) return;
    // Odchod ze stránky (Dokončit cestu, Odejít, zavření) uloží, co je rozepsané.
    const priOdchodu = () => ulozSamo();
    addEventListener('pagehide', priOdchodu);
    return () => { clearTimeout(casovac); removeEventListener('pagehide', priOdchodu); };
  });

  function uloz() {
    if (!text.trim()) return;
    ulozZapis({ id, otazka, odpoved: text.trim(), odkaz, ...(druh ? { druh } : {}) });
    ulozeno = true;
    zavri();
  }

  function ulozSamo() {
    clearTimeout(casovac);
    if (text.trim()) {
      ulozZapis({ id, otazka, odpoved: text.trim(), odkaz, ...(druh ? { druh } : {}) });
      ulozeno = true;
    } else if (ulozeno) {
      smazZapis(id);
      ulozeno = false;
    }
  }

  function piseSe() {
    clearTimeout(casovac);
    casovac = setTimeout(ulozSamo, 600);
  }
</script>

<div class="stanovisko">
  {#if rozbalene}
    <label class="t-ovladani" for={`${id}-stanovisko`}>{nezlomitelne(popisek ?? otazka)}{#if nepovinne}<span class="nepovinne">Nepovinné</span>{/if}</label>
    <textarea class={['blok__pole', nepovinne && 'blok__pole--kratke']} id={`${id}-stanovisko`} rows={nepovinne ? 2 : 3} bind:value={text} oninput={piseSe} onblur={ulozSamo} aria-describedby={`${id}-stav`}></textarea>
    <p class="t-popisek stav" id={`${id}-stav`} aria-live="polite">{ulozeno ? 'Uloženo v deníku.' : 'Ukládá se samo do deníku.'}</p>
  {:else if !otevreno}
    <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={otevri} bind:this={tlacitko}>
      {ulozeno ? 'Upravit stanovisko v deníku' : 'Moje stanovisko'}
    </button>
    {#if ulozeno}<span class="t-popisek">Uloženo v deníku.</span>{/if}
  {:else}
    <label class="t-ovladani" for={`${id}-stanovisko`}>{nezlomitelne(otazka)}</label>
    <textarea class="blok__pole" id={`${id}-stanovisko`} rows="3" bind:value={text} bind:this={pole}></textarea>
    <div class="akce">
      <button class="blok__tl blok__tl--hlavni" type="button" onclick={uloz}>Uložit do deníku</button>
      <button class="blok__tl blok__tl--tiche" type="button" onclick={zavri}>Zrušit</button>
    </div>
  {/if}
</div>

<style>
  .stanovisko { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3); margin-top: var(--s-4); }
  label { flex-basis: 100%; }
  /* „Nepovinné“ za popiskem: po zalomení začíná u kraje, ne odsazené. */
  label:has(.nepovinne) { display: flex; flex-wrap: wrap; column-gap: var(--s-2); }
  .nepovinne { font-weight: 400; color: var(--ink-3); }
  textarea { flex-basis: 100%; margin-bottom: 0; }
  .stav { flex-basis: 100%; margin: 0; color: var(--ink-2); }
  .akce { display: flex; flex-wrap: wrap; gap: var(--s-3); }
</style>
