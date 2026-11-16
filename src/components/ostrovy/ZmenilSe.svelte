<script lang="ts">
  // Změnil se? Návrat k prvnímu názoru na konci stránky velké otázky: student vidí, co napsal na začátku,
  // a odpoví znovu. Obě odpovědi jsou v deníku vedle sebe; nic se nehodnotí. Srovnání leží na lístku s páskou
  // a obě odpovědi jsou studentovým perem (K4b).
  // Použití: <ZmenilSe client:visible slug="jak-poznam-pravdu" otazka="Jak poznám, co je pravda?" odkaz="/otazka/jak-poznam-pravdu/#zmenil-se" />
  import { onMount, tick } from 'svelte';
  import { najdiZapis, ulozZapis } from '../../lib/denik';
  import { klicOtazky } from '../../lib/otazky';

  interface Props { slug: string; otazka: string; odkaz: string }
  let { slug, otazka, odkaz }: Props = $props();
  const klic = klicOtazky(slug);

  let prvni = $state('');
  let ted = $state('');
  let ulozeno = $state(false);
  let upravuji = $state(false);
  let srovnani = $state<HTMLElement>();
  /** srovnání vzniklo uložením teď: lístek se rozloží (po obnovení stránky leží) */
  let cerstve = $state(false);

  function nactiPrvni() {
    prvni = najdiZapis(klic.prvni)?.odpoved ?? '';
  }

  onMount(() => {
    nactiPrvni();
    const z = najdiZapis(klic.ted);
    if (z) {
      ted = z.odpoved;
      ulozeno = true;
    }
    window.addEventListener('atlas:prvni-nazor', nactiPrvni);
    return () => window.removeEventListener('atlas:prvni-nazor', nactiPrvni);
  });

  async function uloz() {
    if (!ted.trim()) return;
    ulozZapis({ id: klic.ted, otazka: `${otazka} Po setkání s filozofy`, odpoved: ted.trim(), odkaz, druh: 'stanovisko' });
    ulozeno = true;
    upravuji = false;
    cerstve = true;
    await tick();
    srovnani?.focus();
  }
</script>

<div class="blok zmenil-se">
  {#if !ulozeno || upravuji}
    {#if prvni}
      <p class="blok__popis">Na začátku jsi napsal:</p>
      <p class="puvodni blok__ruka">„{prvni}“</p>
    {:else}
      <p class="blok__popis">Na začátku jsi neodpověděl. Teď už víš, jak odpovídali filozofové.</p>
    {/if}
    <label class="blok__popis" for={`${slug}-ted-pole`}>Jak odpovíš teď? Klidně stejně jako na začátku. Připiš, co tě posunulo, nebo co tě udrželo.</label>
    <textarea class="blok__pole" id={`${slug}-ted-pole`} rows="3" bind:value={ted} placeholder="Napiš pár slov…"></textarea>
    <div class="blok__akce">
      <button class="blok__tl blok__tl--hlavni" type="button" onclick={uloz} disabled={!ted.trim()}>Uložit do deníku</button>
    </div>
  {:else}
    <div class={['listek-paska', 'blok__vazba', 'srovnani', cerstve && 'rozlozit']} role="region" aria-label="Na začátku a teď" aria-live="polite" tabindex="-1" bind:this={srovnani}>
      <span class="paska paska--mala paska--nahore" aria-hidden="true"></span>
      <div class="sloupce">
        <div>
          <h3 class="blok__zpetna-titulek">Na začátku</h3>
          {#if prvni}<p class="blok__ruka">{prvni}</p>{:else}<p>Bez odpovědi.</p>{/if}
        </div>
        <div>
          <h3 class="blok__zpetna-titulek">Teď</h3>
          <p class="blok__ruka">{ted}</p>
        </div>
      </div>
      <p class="dal"><em>Co by tě přimělo změnit názor ještě jednou?</em></p>
    </div>
    <div class="blok__akce">
      <p class="blok__ulozeno">Obě odpovědi jsou v deníku.</p>
      <button class="blok__tl blok__tl--tiche" type="button" onclick={() => (upravuji = true)}>Upravit</button>
    </div>
  {/if}
</div>

<style>
  .zmenil-se { margin: 0; }
  /* Co student napsal na začátku: jeho perem, s čárkovanou linkou tužkou (K4b). */
  .puvodni {
    margin: 0 0 var(--s-5);
    padding-left: var(--s-4);
    border-left: 1.5px dashed var(--tuzka);
    white-space: pre-line;
  }
  .sloupce { display: grid; gap: var(--s-4); }
  .sloupce p { margin: 0; white-space: pre-line; }
  .dal { margin: var(--s-4) 0 0; padding-top: var(--s-4); border-top: 1.5px dashed var(--tuzka); }
  @container (min-width: 600px) {
    .sloupce { grid-template-columns: 1fr 1fr; gap: var(--s-6); }
  }
</style>
