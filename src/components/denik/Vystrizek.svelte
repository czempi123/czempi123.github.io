<script lang="ts">
  // Výstřižek citátu ve sbírce (denik-v2, K4; plán › 3): lístek v papíru období stránky, odkud citát je, se
  // střiženým okrajem; citát v Newsreaderu, pod ním autor, dílo a místo jako odkaz zpět na stránku. Poznámka
  // „Proč sis ho vystřihl?“ je nepovinná a píše se perem studenta (ulozPoznamkuCitatu). Pod lístkem Do kartiček
  // a Vyndat ze sbírky: vyndání kartičku nemaže, jen ji schová, než se citát vrátí (denik.ts › maZdroj).
  // Páska jen u prvního výstřižku na stránce Moje sbírka (pravidlo střídmosti: nejvýš jedna na obrazovce).
  //   <ul class="vystrizky"><Vystrizek c={c} paska={i === 0} obdobi={3} /></ul>
  //   obdobi: číslo období, null = bez období (inkoust), vynechané = barvu dá předek (kapitola deníku)
  import { tick } from 'svelte';
  import { ulozPoznamkuCitatu, zrusCitat, type CitatVDeniku } from '../../lib/denik';
  import { TEXTY_SBIRKY } from '../../lib/sbirka-texty';
  import { nezlomitelne } from '../../lib/sazba.js';
  import DoKarticek from './DoKarticek.svelte';

  interface Props {
    c: CitatVDeniku;
    obdobi?: number | null;
    paska?: boolean;
  }
  let { c, obdobi, paska = false }: Props = $props();

  let pise = $state(false);
  let text = $state('');
  let pole = $state<HTMLInputElement>();
  let tlacitko = $state<HTMLButtonElement>();
  const idPole = $derived(`poznamka-${c.id.replace(/[^\w-]/g, '-')}`);

  async function otevri() {
    text = c.poznamka ?? '';
    pise = true;
    await tick();
    pole?.focus();
  }
  async function zavri(ulozit: boolean) {
    if (ulozit) ulozPoznamkuCitatu(c.id, text);
    pise = false;
    await tick();
    tlacitko?.focus();
  }
  function klavesa(e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); zavri(true); }
    else if (e.key === 'Escape') { e.preventDefault(); zavri(false); }
  }
</script>

<li class={['vyst-citat', obdobi === null ? 'bez-obdobi' : obdobi ? `obdobi-${obdobi}` : '', paska && 'vyst-citat--paska']} data-citat={c.id}>
  <div class="vyst-citat__obal">
  {#if paska}<span class="paska paska--nahore paska--mala" aria-hidden="true"></span>{/if}
  <div class="vyst-citat__papir">
    <blockquote><p>„{nezlomitelne(c.text)}“</p></blockquote>
    <p class="t-popisek vyst-citat__kde"><a href={c.odkaz}>{c.kde}</a></p>
    <div class="vyst-citat__poznamka">
      {#if pise}
        <label class="vyst-citat__popis" for={idPole}>{TEXTY_SBIRKY.poznamka}</label>
        <div class="vyst-citat__psani">
          <input class="vyst-citat__pole" id={idPole} type="text" maxlength="200" autocomplete="off" bind:value={text} bind:this={pole} onkeydown={klavesa} />
          <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={() => zavri(true)}>{TEXTY_SBIRKY.ulozit}</button>
          <button class="blok__tl blok__tl--tiche" type="button" onclick={() => zavri(false)}>{TEXTY_SBIRKY.zrusit}</button>
        </div>
      {:else if c.poznamka}
        <p class="vyst-citat__pero">{c.poznamka}</p>
        <button class="blok__tl blok__tl--tiche vyst-citat__tl netisk" type="button" bind:this={tlacitko} onclick={otevri} aria-label={`${TEXTY_SBIRKY.prepsat}: ${TEXTY_SBIRKY.poznamka}`}>{TEXTY_SBIRKY.prepsat}</button>
      {:else}
        <button class="blok__tl blok__tl--tiche vyst-citat__tl netisk" type="button" bind:this={tlacitko} onclick={otevri}>{TEXTY_SBIRKY.poznamka}</button>
      {/if}
    </div>
  </div>
  </div>
  <div class="blok__akce vyst-citat__akce netisk">
    <DoKarticek zdroj="citat" ref={c.id} popis={c.kde} />
    <button class="blok__tl blok__tl--tiche" type="button" onclick={() => zrusCitat(c.id)} aria-label={`${TEXTY_SBIRKY.vyndat}: ${c.kde}`}>{TEXTY_SBIRKY.vyndat}</button>
  </div>
</li>

<style>
  /* Lístek leží na tečkovaném papíře; stín sleduje střih (filtr na obalu, ořez na papíru). */
  .vyst-citat { position: relative; display: flex; flex-direction: column; min-width: 0; rotate: calc(-.4deg * var(--natoceni)); }
  .vyst-citat:nth-child(2n) { rotate: calc(.5deg * var(--natoceni)); }
  .vyst-citat:nth-child(3n) { rotate: calc(-.2deg * var(--natoceni)); }
  .vyst-citat__papir {
    flex: 1;
    padding: 22px 22px 12px;
    background: color-mix(in srgb, var(--pp, var(--listek)) 16%, var(--listek));
    /* Střih nůžkami: rovné, mírně šikmé hrany a na dvou místech zoubek, kde se střih navázal. */
    clip-path: polygon(0 3px, 41% 0, 42% 2px, 100% 1px, calc(100% - 2px) 54%, 100% 100%, 63% calc(100% - 2px), 62% 100%, 2px calc(100% - 1px), 0 47%);
  }
  .vyst-citat__obal { position: relative; flex: 1; display: flex; flex-direction: column; filter: var(--odlep-m); }
  .vyst-citat--paska .vyst-citat__papir { padding-top: 26px; }
  blockquote { margin: 0; }
  blockquote p { margin: 0 0 var(--s-2); font-family: var(--font-serif); font-size: 19px; line-height: 1.45; color: var(--ink); }
  .vyst-citat__kde { margin: 0; color: var(--ink-2); }
  .vyst-citat__kde a { color: inherit; display: inline-flex; min-height: 24px; align-items: center; text-decoration-color: var(--tuzka); text-underline-offset: 3px; }
  .vyst-citat__poznamka { margin-top: var(--s-2); }
  .vyst-citat__pero { margin: 0; font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--pero); }
  .vyst-citat__tl { margin-left: -8px; }
  .vyst-citat__popis { display: block; margin-bottom: var(--s-1); font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .vyst-citat__psani { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-2); }
  .vyst-citat__pole {
    flex: 1 1 100%;
    min-width: 0;
    min-height: var(--dotyk);
    padding: 6px 10px;
    border: 0;
    border-bottom: 1.5px solid var(--tuzka);
    background: color-mix(in srgb, var(--list) 70%, transparent);
    font-family: var(--font-ruka);
    font-size: var(--fs-ruka);
    color: var(--pero);
  }
  .vyst-citat__pole:focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }
  .vyst-citat__akce { margin-top: var(--s-2); }
</style>
