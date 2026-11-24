<script lang="ts">
  // Sbírka v deníku (design-v2, K6): razítka filozofů, které student potkal, odtržené pahýly lístků prošlých cest
  // (K5: cesty[slug].pahyl) a citáty, které si na stránkách vystřihl. Odměna bez bodů: nic se nepočítá a nic
  // nechybí; prázdná část se neukáže. Logika v src/lib/zapisnik.ts. Výstřižky z období (denik-v2, K4: Vystrizek.svelte)
  // a pod nimi odkaz na celou sbírku /denik/sbirka/.
  // <SbirkaDeniku potkani={['sokrates']} razitka={…} osoby={…} pahyly={…} citaty={…} />
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import type { CitatVDeniku } from '../../lib/denik';
  import { ADRESA_SBIRKY, TEXTY_SBIRKY } from '../../lib/sbirka-texty';
  import Vystrizek from './Vystrizek.svelte';
  import type { PahylCesty } from '../../lib/zapisnik';
  import type { UdajeRazitka } from '../ostrovy/bloky-typy';

  interface Props {
    potkani: string[];
    razitka: Record<string, UdajeRazitka>;
    osoby: Record<string, { obdobi: number; adresa?: string }>;
    pahyly: PahylCesty[];
    citaty: CitatVDeniku[];
    /** období cesty podle slugu (barva čísla na pahýlu) */
    obdobiCest?: Record<string, number>;
    /** úroveň nadpisu Sbírka (v kapitole deníku 4, části o jednu níž) */
    uroven?: 2 | 3 | 4;
    /** kapitola deníku, ve které sbírka stojí (jedinečné id nadpisu) */
    klic?: string;
  }
  let { potkani, razitka, osoby, pahyly, citaty, obdobiCest = {}, uroven = 2, klic = '' }: Props = $props();
  const idNadpisu = $derived(klic ? `sbirka-${klic}` : 'sbirka-n');
  const lide = $derived(potkani.filter((id) => razitka[id] && osoby[id]));
  const datum = (iso: string) => new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
</script>

{#if lide.length || pahyly.length || citaty.length}
  <!-- V kapitole deníku je sbírka obyčejný oddíl pod nadpisem: oblast se stejným názvem by tam byla v každé kapitole. -->
  <svelte:element this={klic ? 'div' : 'section'} class={['sbirka', { 'sbirka--kapitola': uroven > 2 }]} aria-labelledby={klic ? undefined : idNadpisu}>
    <svelte:element this={`h${uroven}`} class={uroven > 2 ? 't-h3 sbirka__nadpis' : 't-h2 sbirka__nadpis'} id={idNadpisu}>Sbírka</svelte:element>
    {#if lide.length}
      <svelte:element this={`h${uroven + 1}`} class="t-ovladani-l sbirka__cast">Koho už znám</svelte:element>
      <ul class="sb-razitka">
        {#each lide as id (id)}
          <li>
            <RazitkoCloveka razitko={razitka[id]} obdobi={osoby[id].obdobi} velikost={72} />
            {#if osoby[id].adresa}<a href={osoby[id].adresa}>{razitka[id].jmeno}</a>{:else}<span>{razitka[id].jmeno}</span>{/if}
          </li>
        {/each}
      </ul>
    {/if}
    {#if pahyly.length}
      <svelte:element this={`h${uroven + 1}`} class="t-ovladani-l sbirka__cast">Prošlé cesty</svelte:element>
      <ul class="sb-pahyly">
        {#each pahyly as p (p.slug)}
          <li class={obdobiCest[p.slug] ? `obdobi-${obdobiCest[p.slug]}` : 'bez-obdobi'}>
            <a class="sb-pahyl" href={`/cesta/${p.slug}/`}>
              <span class="sb-pahyl__trh" aria-hidden="true"></span>
              <b>{p.pocet}</b><span class="sb-pahyl__kroku">kroků</span>
              <span class="sb-pahyl__nazev">{p.nazev}</span>
              <span class="sb-pahyl__kdy">{datum(p.kdy)}</span>
            </a>
          </li>
        {/each}
      </ul>
    {/if}
    {#if citaty.length}
      <svelte:element this={`h${uroven + 1}`} class="t-ovladani-l sbirka__cast">Vystřižené citáty</svelte:element>
      <!-- V kapitole deníku bez pásky: páska v deníku patří Návratu (design-v2, R); páska je na stránce Moje sbírka. -->
      <ul class="vystrizky">
        {#each citaty as c (c.id)}<Vystrizek {c} />{/each}
      </ul>
      <p class="sb-cela"><a href={ADRESA_SBIRKY}>{TEXTY_SBIRKY.celaSbirka}</a></p>
    {/if}
  </svelte:element>
{/if}

<style>
  .sbirka { margin-top: var(--s-8); }
  .sbirka--kapitola { margin-top: var(--s-6); }
  .sbirka__nadpis { margin: 0 0 var(--s-3); }
  .sbirka__cast { margin: var(--s-5) 0 var(--s-3); }
  /* Razítka leží přímo na tečkovaném papíře, každé natočené jinak (natočení podle id). */
  .sb-razitka { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: var(--s-4) var(--s-3); margin: 0; padding: 0; list-style: none; }
  .sb-razitka li { display: flex; flex-direction: column; align-items: center; gap: var(--s-2); text-align: center; font-family: var(--font-sans); font-size: var(--fs-ovladani); }
  .sb-razitka :is(a, span) { display: inline-flex; align-items: center; min-height: var(--dotyk); color: var(--ink); }
  /* Pahýl: kus lístku cesty s natrženou perforací vlevo (jako po odtržení v liště cesty). */
  .sb-pahyly { display: flex; flex-wrap: wrap; align-items: stretch; gap: var(--s-4); margin: 0; padding: 0; list-style: none; }
  .sb-pahyl {
    position: relative;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 1px;
    width: 132px;
    min-height: 132px;
    padding: 12px 10px 12px 16px;
    background: var(--plocha);
    box-shadow: var(--lezi);
    color: var(--ink-2);
    text-align: center;
    text-decoration: none;
    height: 100%;
    rotate: var(--sb-rot, -1deg);
    font-family: var(--font-sans);
    font-size: var(--fs-popisek);
  }
  .sb-pahyly li { display: flex; }
  .sb-pahyly li:nth-child(2n) .sb-pahyl { --sb-rot: 1deg; }
  .sb-pahyly li:nth-child(3n) .sb-pahyl { --sb-rot: -.5deg; }
  .sb-pahyl__trh {
    position: absolute;
    inset: 0 auto 0 0;
    width: 6px;
    background: radial-gradient(circle at 0 50%, var(--papir) 0 2.4px, transparent 2.9px) 0 3px / 6px 10px repeat-y;
  }
  .sb-pahyl b { font-family: var(--font-serif); font-size: 26px; font-weight: 500; line-height: 1; color: var(--p, var(--ink)); }
  .sb-pahyl__nazev { margin-top: var(--s-2); font-family: var(--font-serif); font-size: 16px; line-height: 1.2; color: var(--ink); }
  .sb-pahyl__kdy { margin-top: var(--s-1); color: var(--ink-3); }
  .sb-pahyl:hover .sb-pahyl__nazev { text-decoration: underline; text-decoration-color: var(--tuzka); text-underline-offset: 3px; }
  .sb-pahyl:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  /* Vystřižené citáty (denik-v2, K4): výstřižky z Vystrizek.svelte, pod nimi odkaz na celou sbírku. */
  /* Dva sloupce jen tam, kde se do sloupce vejde lístek i s tlačítky pod ním (kapitola je užší než stránka). */
  .vystrizky { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); align-items: start; gap: var(--s-5) var(--s-4); margin: 0; padding: 0; list-style: none; }
  .sb-cela { margin: var(--s-4) 0 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); }
  .sb-cela a { display: inline-flex; align-items: center; min-height: var(--dotyk); color: var(--ink); font-weight: 600; text-decoration-color: var(--tuzka); text-underline-offset: 5px; }
</style>
