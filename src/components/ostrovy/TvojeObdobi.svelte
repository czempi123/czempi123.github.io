<script lang="ts">
  // Tvoje antika: deník na konci období. Po velkých otázkách studentova vlastní odpověď (Na začátku × Teď, Teď jde
  // přepsat), pravidla z cest a pod nimi myslitelé, kteří to viděli podobně, s důvodem z jejich vlastní odpovědi.
  // Jen z toho, co student v atlasu udělal (src/lib/tvoje-obdobi.ts); nic se nepočítá, nic se neodesílá.
  // Přehled se složí jednou při otevření stránky: když student smaže odpověď Teď, otázka mu pod rukama nezmizí.
  // Použití (src/pages/denik/antika.astro): <TvojeObdobi client:load katalog={katalog} obdobi={2} prvniCesta={…} />
  import { onMount } from 'svelte';
  import { nacti } from '../../lib/denik';
  import { klicOtazky } from '../../lib/otazky';
  import { prehledObdobi, NEJBLIZ, TVOJE_ANTIKA, type Blizky, type KatalogObdobi, type OtazkaPrehledu } from '../../lib/tvoje-obdobi';
  import MojeStanovisko from './MojeStanovisko.svelte';
  import Mince from '../mapa/Mince.svelte';
  import { nezlomitelne } from '../../lib/sazba.js';

  const PRAZDNY = nezlomitelne('Zatím tu nic není. Až v některé cestě antiky zvolíš odpověď nebo napíšeš svoje pravidlo, objeví se tady i s filozofy, kteří to viděli podobně.');

  interface Props {
    katalog: KatalogObdobi;
    /** barva období */
    obdobi: number;
    /** kam vést studenta, který zatím nic nemá */
    prvniCesta?: { nazev: string; adresa: string };
  }
  let { katalog, obdobi, prvniCesta }: Props = $props();

  let prehled = $state<OtazkaPrehledu[] | null>(null);
  onMount(() => {
    prehled = prehledObdobi(nacti(), katalog);
  });

  const odkazTed = (adresa: string) => (adresa.includes('#') ? adresa : `${adresa}#zmenil-se`);
</script>

{#if prehled}
  {#if prehled.length === 0}
    <div class="prazdny">
      <p>{PRAZDNY}</p>
      {#if prvniCesta}<p class="t-ovladani"><a href={prvniCesta.adresa}>Začít cestou {prvniCesta.nazev}</a></p>{/if}
    </div>
  {:else}
    {#each prehled as o (o.slug)}
      <section class="otazka obdobi-{obdobi}" aria-labelledby={`tvoje-${o.slug}`}>
        <p class="t-nadtitulek nadtitulek">Velká otázka {o.cislo}</p>
        <h2 class="t-h2 otazka__nadpis" id={`tvoje-${o.slug}`}><a href={o.adresa}>{o.otazka}</a></h2>

        <div class={['odpoved', o.zacatek && 'odpoved--dve']}>
          {#if o.zacatek}
            <div class="zacatek">
              <h3 class="blok__zpetna-titulek">Na začátku</h3>
              <p class="zacatek__text">{o.zacatek}</p>
            </div>
          {/if}
          <div class="ted">
            {#if o.zacatek}<h3 class="blok__zpetna-titulek">Teď</h3>{/if}
            <MojeStanovisko
              rozbalene
              id={klicOtazky(o.slug).ted}
              otazka={`${o.otazka} Po setkání s filozofy`}
              popisek={o.zacatek ? 'Jak odpovíš teď?' : 'Jak bys odpověděl ty?'}
              odkaz={odkazTed(o.adresa)}
              druh="stanovisko"
            />
          </div>
        </div>

        {#if o.pravidla.length}
          <h3 class="t-h3 podnadpis">{o.pravidla.length === 1 ? 'Tvoje pravidlo z cesty' : 'Tvoje pravidla z cest'}</h3>
          <ul class="seznam pravidla">
            {#each o.pravidla as p (p.adresa)}
              <li>
                <p class="t-popisek kde"><a href={p.adresa}>{p.cesta}</a></p>
                <p class="pravidlo">{p.text}</p>
              </li>
            {/each}
          </ul>
        {/if}

        {#if o.nejbliz}
          <!-- Volba na ose hlasů stránky otázky stojí nad mysliteli z cest: student ji udělal sám a výslovně. -->
          <div class="blizky nejbliz">
            <Mince ikona={o.nejbliz.osoba.ikona} obdobi={o.nejbliz.osoba.obdobi} varianta="sel" velikost={40} />
            <div class="blizky__text">
              <p class="nejbliz__veta">{TVOJE_ANTIKA.nejbliz.pred}<a href={o.nejbliz.adresa}>{TVOJE_ANTIKA.nejbliz.odkaz}</a>{TVOJE_ANTIKA.nejbliz.po}{#if o.nejbliz.osoba.adresa}<a class="jmeno-odkaz" href={o.nejbliz.osoba.adresa}>{o.nejbliz.osoba.jmeno}</a>{:else}<strong>{o.nejbliz.osoba.jmeno}</strong>{/if}.</p>
              {#if o.nejbliz.duvod}<p class="duvod">{o.nejbliz.duvod}</p>{/if}
            </div>
          </div>
        {/if}

        {#if o.blizci.length}
          <h3 class="t-h3 podnadpis">Kdo to viděl podobně jako ty</h3>
          <ul class="seznam blizci">
            {#each o.blizci.slice(0, NEJBLIZ) as b (b.osoba.id)}{@render blizky(b)}{/each}
          </ul>
          {#if o.blizci.length > NEJBLIZ}
            <details class="dalsi">
              <summary class="t-ovladani">A další filozofové</summary>
              <ul class="seznam blizci">
                {#each o.blizci.slice(NEJBLIZ) as b (b.osoba.id)}{@render blizky(b)}{/each}
              </ul>
            </details>
          {/if}
        {/if}
      </section>
    {/each}
  {/if}
{/if}

{#snippet blizky(b: Blizky)}
  <li class="blizky">
    <Mince ikona={b.osoba.ikona} obdobi={b.osoba.obdobi} varianta="tint" velikost={40} />
    <div class="blizky__text">
      <p class="jmeno">{#if b.osoba.adresa}<a href={b.osoba.adresa}>{b.osoba.jmeno}</a>{:else}{b.osoba.jmeno}{/if}</p>
      <!-- Cesta a odpověď nad důvodem: důvod začíná větou kroku („Jestli nemáš…“) a bez ní je hádanka (revize R, nález 7). -->
      <ul class="stopy">
        {#each b.stopy as s (s.adresa + s.odpoved)}
          <li class="t-popisek"><a href={s.adresa}>{s.cesta}</a> · <span class="vizualne-skryte">{'tvoje odpověď '}</span>{s.odpoved}</li>
        {/each}
      </ul>
      {#if b.duvod}<p class="duvod">{b.duvod}</p>{/if}
    </div>
  </li>
{/snippet}

<style>
  .prazdny { margin-top: var(--s-6); padding: var(--s-5); border: 1px solid var(--rule); border-radius: var(--r-md); background: var(--surface); }
  .prazdny p { margin: 0; }
  .prazdny p + p { margin-top: var(--s-4); }
  .otazka { margin-top: var(--s-8); padding-top: var(--s-5); border-top: 2px solid var(--pc); }
  .otazka:first-child { margin-top: var(--s-6); }
  .nadtitulek { margin: 0 0 var(--s-2); color: var(--pc); }
  .otazka__nadpis { margin: 0 0 var(--s-5); }
  .otazka__nadpis a { color: inherit; text-decoration-thickness: 1px; text-underline-offset: 0.18em; }
  .odpoved { display: grid; gap: var(--s-5); }
  /* Na telefonu pod sebou, od 700 px vedle sebe (stejně jako závěr cesty a Změnil se?). */
  @media (min-width: 700px) {
    .odpoved--dve { grid-template-columns: 1fr 1fr; gap: var(--s-6); align-items: start; }
    .odpoved--dve .ted { padding-top: var(--s-4); }
  }
  .zacatek { padding: var(--s-4) var(--s-5); border-radius: var(--r-sm); background: var(--pc-tint, var(--sunk)); }
  .zacatek__text { margin: 0; font-size: var(--fs-ovladani-l); line-height: 1.45; white-space: pre-line; overflow-wrap: anywhere; }
  .ted .blok__zpetna-titulek { margin-bottom: var(--s-3); }
  .ted :global(.stanovisko) { margin-top: 0; }
  .podnadpis { margin: var(--s-6) 0 var(--s-3); }
  .seznam { margin: 0; padding: 0; list-style: none; }
  .seznam > li { padding: var(--s-4) 0; border-top: 1px solid var(--rule); }
  .kde { margin: 0 0 var(--s-1); }
  .pravidlo { margin: 0; white-space: pre-line; overflow-wrap: anywhere; }
  .blizky { display: grid; grid-template-columns: 40px 1fr; gap: var(--s-4); align-items: start; }
  .blizky__text { min-width: 0; }
  .jmeno { margin: var(--s-2) 0 var(--s-2); font-family: var(--font-sans); font-weight: 600; font-size: var(--fs-ovladani-l); }
  .jmeno a { display: inline-block; min-height: 24px; }
  .duvod { margin: var(--s-2) 0 0; }
  .nejbliz { margin-top: var(--s-6); padding: var(--s-4) var(--s-5); border-radius: var(--r-sm); background: var(--pc-tint, var(--sunk)); }
  .nejbliz__veta { margin: var(--s-2) 0 0; font-family: var(--font-sans); font-size: var(--fs-ovladani-l); }
  .nejbliz__veta a { display: inline-block; min-height: 24px; }
  .jmeno-odkaz { font-weight: 600; }
  .stopy { margin: 0; padding: 0; list-style: none; color: var(--ink-2); }
  .stopy li + li { margin-top: var(--s-1); }
  .stopy a { display: inline-block; min-height: 24px; }
  .dalsi { margin-top: var(--s-2); border-top: 1px solid var(--rule); }
  .dalsi summary { display: flex; align-items: center; min-height: 48px; cursor: pointer; font-weight: 600; }
  .dalsi summary:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
</style>
