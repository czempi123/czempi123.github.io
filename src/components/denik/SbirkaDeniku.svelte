<script lang="ts">
  // Sbírka v deníku (design-v2, K6): razítka filozofů, které student potkal, odtržené pahýly lístků prošlých cest
  // (K5: cesty[slug].pahyl) a citáty, které si na stránkách vystřihl. Odměna bez bodů: nic se nepočítá a nic
  // nechybí; prázdná část se neukáže. Logika v src/lib/zapisnik.ts.
  // <SbirkaDeniku potkani={['sokrates']} razitka={…} osoby={…} pahyly={…} citaty={…} />
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import { zrusCitat, type CitatVDeniku } from '../../lib/denik';
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
  }
  let { potkani, razitka, osoby, pahyly, citaty, obdobiCest = {} }: Props = $props();
  const lide = $derived(potkani.filter((id) => razitka[id] && osoby[id]));
  const datum = (iso: string) => new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
</script>

{#if lide.length || pahyly.length || citaty.length}
  <section class="sbirka" aria-labelledby="sbirka-n">
    <h2 class="t-h2 sbirka__nadpis" id="sbirka-n">Sbírka</h2>
    {#if lide.length}
      <h3 class="t-ovladani-l sbirka__cast">Koho jsem potkal</h3>
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
      <h3 class="t-ovladani-l sbirka__cast">Prošlé cesty</h3>
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
      <h3 class="t-ovladani-l sbirka__cast">Vystřižené citáty</h3>
      <ul class="sb-citaty">
        {#each citaty as c (c.id)}
          <li class="sb-citat">
            <blockquote><p>„{c.text}“</p></blockquote>
            <p class="t-popisek sb-citat__kde"><a href={c.odkaz}>{c.kde}</a></p>
            <button class="blok__tl blok__tl--tiche sb-citat__vratit" type="button" onclick={() => zrusCitat(c.id)}>Vyndat ze sbírky<span class="vizualne-skryte">{`: ${c.kde}`}</span></button>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
{/if}

<style>
  .sbirka { margin-top: var(--s-8); }
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
  /* Vystřižený citát: ústřižek lístku s rovnými střihy, bez pásky. */
  .sb-citaty { display: grid; gap: var(--s-4); margin: 0; padding: 0; list-style: none; }
  @media (min-width: 700px) { .sb-citaty { grid-template-columns: 1fr 1fr; } }
  .sb-citat { padding: 20px 20px 10px; background: var(--listek); box-shadow: var(--lezi); }
  .sb-citat:nth-child(2n) { rotate: .5deg; }
  .sb-citat blockquote { margin: 0; }
  .sb-citat blockquote p { margin: 0 0 var(--s-2); font-size: 19px; line-height: 1.45; }
  .sb-citat__kde { margin: 0; color: var(--ink-2); }
  .sb-citat__kde a { color: inherit; display: inline-flex; min-height: 24px; align-items: center; }
  .sb-citat__vratit { margin-top: var(--s-1); }
</style>
