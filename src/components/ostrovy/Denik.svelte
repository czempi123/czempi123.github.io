<script lang="ts">
  // Můj deník: rozpracované cesty a otázky, odpovědi a stanoviska, přijaté výzvy a export do souboru.
  // Vše jen v tomto prohlížeči; stažený soubor jde nahrát zpět a přidá se k deníku tady (spojDeniky). Nahoře nejvýš jedna tichá nabídka Návratu: nový případ ke zkoušce vlastního
  // pravidla, nejdřív tři dny po dokončení cesty. Jde zkusit, odložit, nebo skrýt; jinde v atlasu o ní nic neví.
  import { onMount, tick } from 'svelte';
  import { nacti, exportuj, nahrajDenik, stavBloku, ulozStavBloku, type Denik } from '../../lib/denik';
  import { nabidkaNavratu, platnyStavNavratu, type NavratDeniku } from '../../lib/navrat';
  import Navrat from './Navrat.svelte';
  import MojeHodiny from '../hodina/MojeHodiny.svelte';

  interface Props {
    /** návraty všech cest (obsah z YAML); který a kdy nabídnout, rozhodne nabidkaNavratu */
    navraty?: NavratDeniku[];
  }
  let { navraty = [] }: Props = $props();

  let denik = $state<Denik | null>(null);
  // Nabídka se určí jednou při otevření deníku: po odložení nebo skrytí se hned nenabídne další.
  let nabidka = $state<NavratDeniku | null>(null);
  let otevreny = $state(false);
  let zprava = $state('');
  let obalNavratu = $state<HTMLElement>();
  let zpravaPrvek = $state<HTMLElement>();
  let vyberSouboru = $state<HTMLInputElement>();
  let zpravaSouboru = $state('');
  let cesty = $derived(denik ? Object.entries(denik.cesty).sort((a, b) => b[1].kdy.localeCompare(a[1].kdy)) : []);
  let rozpracovane = $derived(denik ? denik.aktivita.filter((a) => !a.hotovo) : []);
  // Hodiny, které student otevřel z odkazu učitele (nejnovější první); Moje hodiny učitele jsou zvlášť.
  let hodiny = $derived(denik?.hodiny ?? []);
  const datum = (iso: string) => new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  onMount(() => {
    denik = nacti();
    nabidka = nabidkaNavratu(denik, navraty, Date.now());
    const obnov = () => (denik = nacti());
    window.addEventListener('atlas-denik', obnov);
    return () => window.removeEventListener('atlas-denik', obnov);
  });

  /** Přidá deník ze staženého souboru k deníku v tomto prohlížeči; nic nesmaže. */
  async function nahraj() {
    const soubor = vyberSouboru?.files?.[0];
    if (!soubor) return;
    let text = '';
    try { text = await soubor.text(); } catch { /* nečitelný soubor */ }
    zpravaSouboru = nahrajDenik(text)
      ? 'Deník ze souboru je přidaný k tomuto. Nic se nesmazalo.'
      : 'Tenhle soubor deník z atlasu není. Vyber soubor, který jsi stáhl tady v deníku.';
    if (vyberSouboru) vyberSouboru.value = '';
  }

  async function zkusit() {
    otevreny = true;
    await tick();
    obalNavratu?.focus();
  }
  /** Odloží (vrátí se za pár dní), nebo skryje (už se nenabídne); odpověď rozepsanou v bloku nechá být. */
  async function odloz(natrvalo: boolean) {
    if (!nabidka) return;
    const stav = platnyStavNavratu(stavBloku(nabidka.id));
    ulozStavBloku(nabidka.id, natrvalo ? { ...stav, skryto: true } : { ...stav, odlozeno: new Date().toISOString() });
    zprava = natrvalo ? 'Tenhle návrat se už nenabídne.' : 'Návrat se nabídne znovu za pár dní.';
    nabidka = null;
    await tick();
    zpravaPrvek?.focus();
  }
</script>

{#if denik}
  {#if denik.zapisy.length === 0 && denik.vyzvy.length === 0 && cesty.length === 0 && rozpracovane.length === 0 && hodiny.length === 0}
    <p class="t-perex">Zatím je prázdný. Když v cestě, u osobnosti nebo u otázky napíšeš vlastní odpověď nebo přijmeš výzvu, najdeš ji tady.</p>
  {:else}
    {#if nabidka}
      <section class="navrat" aria-labelledby="navrat-nadpis">
        <h2 class="t-h3 nadpis" id="navrat-nadpis">Návrat</h2>
        {#if otevreny}
          <div class="navrat__blok" tabindex="-1" bind:this={obalNavratu}><Navrat navrat={nabidka} /></div>
        {:else}
          <div class="nabidka obdobi-{nabidka.blok.obdobi}">
            <p class="t-nadtitulek nabidka__cesta">{nabidka.nazevCesty}</p>
            <p class="nabidka__text">Tuhle cestu máš za sebou. Zkusíš své pravidlo na jednom novém případu?</p>
            <div class="blok__akce">
              <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={zkusit}>Zkusit</button>
              <button class="blok__tl blok__tl--tiche" type="button" onclick={() => odloz(false)}>Později</button>
              <button class="blok__tl blok__tl--tiche" type="button" onclick={() => odloz(true)}>Už nenabízet</button>
            </div>
          </div>
        {/if}
      </section>
    {:else if zprava}
      <p class="navrat-zprava t-ovladani" role="status" tabindex="-1" bind:this={zpravaPrvek}>{zprava}</p>
    {/if}
    {#if cesty.length || rozpracovane.length}
      <h2 class="t-h3 nadpis">Rozpracované</h2>
      <ul class="seznam seznam--rozpracovane">
        {#each cesty as [slug, c] (slug)}
          {@const hotova = c.navstivene.length >= c.pocet}
          <li>
            <p class="t-popisek">Cesta · {hotova ? 'prošel jsi celou' : `krok ${c.krok} z ${c.pocet}`}</p>
            <p class="otazka"><a href={hotova ? `/cesta/${slug}/` : `/cesta/${slug}/${c.krok}/`}>{c.nazev}</a></p>
            <span class="postup" aria-hidden="true"><span style={`width:${(c.navstivene.length / c.pocet) * 100}%`}></span></span>
          </li>
        {/each}
        {#each rozpracovane as a (a.id)}
          <li>
            <p class="t-popisek">Otázka, ke které ses ještě nevrátil</p>
            <p class="otazka"><a href={a.odkaz}>{a.otazka}</a></p>
          </li>
        {/each}
      </ul>
    {/if}
    {#if hodiny.length}
      <h2 class="t-h3 nadpis" id="denik-hodiny">Hodiny</h2>
      <ul class="seznam seznam--hodiny" aria-labelledby="denik-hodiny">
        {#each hodiny as h (h.adresa)}
          <li>
            <p class="t-popisek">otevřeno {datum(h.kdy)}</p>
            <p class="otazka"><a href={h.adresa}>{h.nazev || 'Hodina bez názvu'}</a></p>
          </li>
        {/each}
      </ul>
    {/if}
    {#if denik.zapisy.length}
      <h2 class="t-h3 nadpis">Moje odpovědi a stanoviska</h2>
      <ul class="seznam seznam--zapisy">
        {#each denik.zapisy as z (z.id)}
          <li>
            <p class="t-popisek">{datum(z.kdy)} · <a href={z.odkaz}>zpět ke stránce</a></p>
            <p class="otazka">{z.otazka}</p>
            <p class="odpoved">{z.odpoved}</p>
          </li>
        {/each}
      </ul>
    {/if}
    {#if denik.vyzvy.length}
      <h2 class="t-h3 nadpis">Přijaté výzvy</h2>
      <ul class="seznam">
        {#each denik.vyzvy as v (v.id)}
          <li>
            <p class="t-popisek">přijato {datum(v.prijato)}</p>
            <p class="otazka"><a href={v.odkaz}>{v.nazev}</a></p>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
  <MojeHodiny />
  <div class="soubor">
    <button type="button" class="export" onclick={exportuj}>Stáhnout deník do souboru</button>
    <button type="button" class="export" onclick={() => vyberSouboru?.click()}>Nahrát deník ze souboru</button>
    <input bind:this={vyberSouboru} type="file" accept=".json,application/json" class="vizualne-skryte" tabindex="-1" aria-hidden="true" onchange={nahraj} />
  </div>
  <p class="t-popisek soubor__popis">Nahraný deník se přidá k tomu, co máš tady. Nic se nesmaže.</p>
  {#if zpravaSouboru}<p class="soubor__zprava t-ovladani" role="status">{zpravaSouboru}</p>{/if}
{/if}

<style>
  .nadpis { margin: var(--s-7) 0 var(--s-4); }
  .navrat .nadpis { margin-top: var(--s-5); }
  .nabidka { padding: var(--s-4) var(--s-5); border: 1px solid var(--rule); border-radius: var(--r-md); background: var(--surface); }
  .nabidka__cesta { margin: 0 0 var(--s-2); color: var(--pc); }
  .nabidka__text { margin: 0; }
  .nabidka .blok__akce { margin-top: var(--s-4); }
  .navrat__blok { outline: none; }
  .navrat__blok :global(.blok) { margin: 0; }
  .navrat-zprava { margin: var(--s-5) 0 0; color: var(--ink-2); outline: none; }
  .navrat-zprava:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
  .seznam { margin: 0; padding: 0; list-style: none; }
  .seznam li { padding: var(--s-4) 0; border-top: 1px solid var(--rule); }
  .seznam p { margin: 0 0 var(--s-1); }
  .otazka { font-family: var(--font-sans); font-weight: 600; font-size: var(--fs-ovladani); }
  .otazka a { display: inline-block; min-height: 24px; }
  .postup { display: block; max-width: 240px; height: 6px; margin-top: var(--s-2); border-radius: var(--r-full); background: var(--sunk); overflow: hidden; }
  .postup span { display: block; height: 100%; background: var(--period-1); }
  .soubor { display: flex; flex-wrap: wrap; gap: var(--s-3); margin-top: var(--s-6); }
  .soubor__popis { margin: var(--s-3) 0 0; }
  .soubor__zprava { margin: var(--s-3) 0 0; color: var(--ink-2); }
  .export {
    min-height: 48px;
    padding: 0 var(--s-5);
    border: 1.5px solid var(--ink);
    border-radius: var(--r-sm);
    background: transparent;
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani-l);
    font-weight: 600;
    cursor: pointer;
  }
  .export:hover { background: var(--sunk); }
</style>
