<script lang="ts">
  // Moje stanovisko: krátký zápis do deníku k otázce. Dobrovolné, nic se nehodnotí ani neodesílá.
  // Použití v MDX:
  // <MojeStanovisko client:visible id="sokrates-nikdo-nedela-zlo" otazka="…" odkaz="/osobnost/sokrates/#myslenky" />
  // <MojeStanovisko client:visible rozbalene id="cesta1-moje-pravidlo" otazka="…" odkaz="/cesta/…/7/" />
  // S `rozbalene` je pole vidět hned a zápis se do deníku ukládá sám během psaní (závěr cesty).
  // `popisek` je text nad polem, když se liší od otázky zápisu v deníku; `nepovinne` k němu přidá „Nepovinné“.
  import { onMount } from 'svelte';
  import { nacti, ulozZapis, smazZapis, type Zapis } from '../../lib/denik';
  import { nezlomitelne } from '../../lib/sazba.js';

  // `druh` se zapíše k zápisu (Tvoje antika: odpověď u otázky jako stanovisko, stejně jako Změnil se?).
  interface Props { id: string; otazka: string; odkaz: string; rozbalene?: boolean; popisek?: string; nepovinne?: boolean; druh?: Zapis['druh'] }
  let { id, otazka, odkaz, rozbalene = false, popisek, nepovinne = false, druh }: Props = $props();
  let otevreno = $state(false);
  let text = $state('');
  let ulozeno = $state(false);
  let casovac: ReturnType<typeof setTimeout> | undefined;

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
    otevreno = false;
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
    <textarea class={[nepovinne && 'kratke']} id={`${id}-stanovisko`} rows={nepovinne ? 2 : 3} bind:value={text} oninput={piseSe} onblur={ulozSamo} aria-describedby={`${id}-stav`}></textarea>
    <p class="t-popisek stav" id={`${id}-stav`} aria-live="polite">{ulozeno ? 'Uloženo v deníku.' : 'Ukládá se samo do deníku.'}</p>
  {:else if !otevreno}
    <button class="vedlejsi" type="button" onclick={() => (otevreno = true)} aria-expanded="false">
      {ulozeno ? 'Upravit stanovisko v deníku' : 'Moje stanovisko'}
    </button>
    {#if ulozeno}<span class="t-popisek">Uloženo v deníku.</span>{/if}
  {:else}
    <label class="t-ovladani" for={`${id}-stanovisko`}>{nezlomitelne(otazka)}</label>
    <textarea id={`${id}-stanovisko`} rows="3" bind:value={text}></textarea>
    <div class="akce">
      <button class="hlavni" type="button" onclick={uloz}>Uložit do deníku</button>
      <button class="tiche" type="button" onclick={() => (otevreno = false)}>Zrušit</button>
    </div>
  {/if}
</div>

<style>
  .stanovisko { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3); margin-top: var(--s-4); }
  label { flex-basis: 100%; }
  /* „Nepovinné“ za popiskem: po zalomení začíná u kraje, ne odsazené. */
  label:has(.nepovinne) { display: flex; flex-wrap: wrap; column-gap: var(--s-2); }
  .nepovinne { font-weight: 400; color: var(--muted); }
  textarea {
    flex-basis: 100%;
    min-height: 88px;
    padding: var(--s-3);
    border: 1px solid var(--rule);
    border-radius: var(--r-sm);
    background: var(--paper);
    font-family: var(--font-serif);
    font-size: var(--fs-text);
  }
  textarea.kratke { min-height: 64px; }
  .stav { flex-basis: 100%; margin: 0; color: var(--ink-2); }
  .akce { display: flex; gap: var(--s-3); }
  button {
    min-height: 48px;
    padding: 0 var(--s-5);
    border-radius: var(--r-sm);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani-l);
    font-weight: 600;
    cursor: pointer;
  }
  .hlavni { border: 1.5px solid var(--ink); background: var(--ink); color: var(--paper); }
  .vedlejsi { border: 1.5px solid var(--ink); background: transparent; color: var(--ink); }
  .vedlejsi:hover { background: var(--sunk); }
  .tiche { border: 1px solid var(--rule); background: transparent; color: var(--ink); }
</style>
