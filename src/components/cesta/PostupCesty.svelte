<script lang="ts">
  // Postup na přehledu cesty: tlačítko Začít / Pokračovat / Projít znovu a pod ním seznam kroků s tím, co student
  // už prošel (prošlý krok má číslo ve vyštípnuté dírce jako na lístku cesty). Postup v kroku nese lístek cesty
  // v hlavičce (ListekCesty.astro, K5); návštěvu kroku zapisuje src/scripts/postup-cesty.ts.
  import { onMount } from 'svelte';
  import { nacti } from '../../lib/denik';

  interface Krok { n: number; nazev: string; href: string }
  interface Props {
    /** jen přehled; hlavička kroku má od K5 lístek cesty */
    varianta?: 'prehled';
    slug: string;
    nazev: string;
    kroky: Krok[];
  }
  let { slug, kroky }: Props = $props();
  let navstivene = $state<number[]>([]);
  let posledni = $state<number | null>(null);
  let hotovo = $derived(kroky.every((k) => navstivene.includes(k.n)));

  onMount(() => {
    const c = nacti().cesty[slug];
    navstivene = c?.navstivene ?? [];
    posledni = c?.krok ?? null;
  });
</script>

<div class="akce">
  {#if hotovo}
    <p class="hotovo t-ovladani" role="status">Cestu jsi prošel celou. Tvoje odpovědi jsou v <a href="/denik/">deníku</a>.</p>
    <a class="blok__tl blok__tl--vedlejsi" href={kroky[0].href}>Projít znovu</a>
  {:else if posledni}
    <a class="blok__tl blok__tl--hlavni" href={kroky.find((k) => k.n === posledni)?.href ?? kroky[0].href}>Pokračovat: krok {posledni}</a>
  {:else}
    <a class="blok__tl blok__tl--hlavni" href={kroky[0].href}>Začít cestu</a>
  {/if}
</div>
<h2 class="t-h3 kroky-nadpis" id="kroky-nadpis">Kroky</h2>
<ol class="seznam">
  {#each kroky as k (k.n)}
    <li class={[navstivene.includes(k.n) && 'prosel']}>
      <a href={k.href}>
        <span class="cislo t-letopocet" aria-hidden="true">{k.n}</span>
        <span class="nazev">{k.nazev}</span>
        {#if navstivene.includes(k.n)}<span class="vizualne-skryte"> (prošel jsi)</span>{/if}
      </a>
    </li>
  {/each}
</ol>

<style>
  .kroky-nadpis { margin: 0 0 var(--s-4); }
  .seznam { display: grid; margin: 0; padding: 0; list-style: none; }
  /* Kroky jako řádky v zápisníku: mezi nimi čárkovaná linka tužkou, číslo v kruhu tužkou, prošlý ve vyštípnuté dírce. */
  .seznam li + li { border-top: 1.5px dashed var(--linka); }
  .seznam a {
    display: flex;
    align-items: center;
    gap: var(--s-4);
    min-height: 56px;
    padding: var(--s-2) var(--s-2);
    border-radius: var(--r-ovladani);
    color: var(--ink);
    text-decoration: none;
  }
  @media (hover: hover) {
    .seznam a:hover .nazev { text-decoration: underline; text-decoration-color: var(--tuzka); text-decoration-thickness: 1.5px; text-underline-offset: 0.14em; }
  }
  .cislo {
    flex: none;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--r-plne);
    box-shadow: inset 0 0 0 1.5px var(--tuzka);
    color: var(--ink-2);
    font-family: var(--font-sans);
    font-weight: 600;
  }
  .prosel .cislo { background: var(--papir); box-shadow: var(--vtla-hl); color: var(--ink-3); }
  .nazev { font-size: var(--fs-perex); line-height: 1.3; }
  .akce { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-4); margin-bottom: var(--s-6); }
  .hotovo { margin: 0; }
</style>
