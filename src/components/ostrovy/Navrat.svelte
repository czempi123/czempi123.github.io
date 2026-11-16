<script lang="ts">
  // Návrat: krátký nový případ, na kterém student zkouší své závěrečné pravidlo z cesty. Ukáže pravidlo
  // (jen ke čtení), případ a otázku „Platí tvoje pravidlo i tady?“ se třemi možnostmi a nepovinným důvodem.
  // Po odpovědi nic nehodnotí: jedna věta se ptá dál. Odpověď je nový zápis v deníku; pravidlo se nepřepisuje.
  // Ve skutečném atlasu ho otevírá jen deník (Denik.svelte), pár dní po dokončení cesty.
  // V rámu aktivity (K4b): pravidlo je studentovým perem, možnosti vystouplé lístky, věta po odpovědi na lístku s páskou.
  // Použití v dílně (obsah v src/content/bloky/cesta1-navrat.yaml):
  // <Navrat id="cesta1-navrat" ukazka="Věřím tomu, co si můžu ověřit jinde." />
  import { onMount, tick } from 'svelte';
  import { najdiZapis, ulozZapis, smazZapis, stavBloku, ulozStavBloku } from '../../lib/denik';
  import { odstavce, radek } from '../../lib/bloky';
  import {
    OTAZKA_NAVRATU, ODPOVEDI_NAVRATU, platnyStavNavratu, zapisNavratu, otazkaZapisuNavratu,
    type NavratDeniku, type OdpovedNavratu,
  } from '../../lib/navrat';
  import RamAktivity from './RamAktivity.svelte';

  interface Props {
    navrat: NavratDeniku;
    /** pravidlo na ukázku, dokud student vlastní nemá (jen dílna) */
    ukazka?: string;
  }
  let { navrat, ukazka }: Props = $props();
  const { id, blok } = navrat;

  let pravidlo = $state(ukazka ?? '');
  let vyber = $state<OdpovedNavratu | null>(null);
  let duvod = $state('');
  let zapsano = $state(false);
  let oblast = $state<HTMLElement>();
  let cerstve = $state(false);

  onMount(() => {
    pravidlo = najdiZapis(navrat.pravidlo)?.odpoved.trim() || ukazka || '';
    const s = platnyStavNavratu(stavBloku(id));
    vyber = s.odpoved;
    duvod = s.duvod;
    zapsano = s.zapsano;
  });

  // Odložení a skrytí nabídky patří ke stejnému stavu; blok je jen přenáší dál.
  const ulozStav = () => ulozStavBloku(id, { ...platnyStavNavratu(stavBloku(id)), odpoved: vyber, duvod: duvod.trim(), zapsano });

  async function zapis() {
    if (!vyber) return;
    zapsano = true;
    cerstve = true;
    ulozStav();
    ulozZapis({ id, otazka: otazkaZapisuNavratu(blok.nazev), odpoved: zapisNavratu(vyber, duvod), odkaz: navrat.odkaz, druh: 'navrat' });
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    vyber = null;
    duvod = '';
    zapsano = false;
    cerstve = false;
    ulozStav();
    smazZapis(id);
    await tick();
    document.getElementById(id)?.querySelector<HTMLElement>('input')?.focus();
  }
</script>

{#snippet odpovedNavratu()}
  {#if zapsano && vyber}
    <p class="blok__zpetna-titulek">Tvoje odpověď: <span class="blok__ruka">{ODPOVEDI_NAVRATU.find((o) => o.id === vyber)?.text}</span>.</p>
    {#if duvod.trim()}<p class="duvod"><span class="t-popisek">Tvůj důvod:</span> <span class="blok__ruka">{duvod}</span></p>{/if}
    <p>{@html radek(blok.po[vyber])}</p>
  {/if}
{/snippet}

{#snippet akce()}
  <button class="blok__tl blok__tl--hlavni" type="button" onclick={zapis} disabled={vyber === null}>Zapsat do deníku</button>
{/snippet}

<!-- Blok stojí vždy pod nadpisem „Návrat“ (deník, dílna); rodina aktivit proto říká jen, ke které cestě patří. -->
<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="navrat"
  nadtitulek={navrat.nazevCesty}
  labelledby={`${id}-otazka`}
  vazba={zapsano && vyber ? odpovedNavratu : undefined}
  vazbaPopisek="Tvoje odpověď"
  {cerstve}
  bind:vazbaPrvek={oblast}
  ulozeno={zapsano && vyber ? 'Odpověď je v deníku. Tvoje pravidlo zůstává beze změny.' : undefined}
  znovu={zapsano && vyber ? znovu : undefined}
  hlavni={!zapsano ? akce : undefined}
>
  {#if pravidlo}
    <p class="blok__popis pravidlo__popis">Tvoje pravidlo</p>
    <p class="pravidlo">{pravidlo}</p>
  {:else}
    <p class="blok__scena">Své pravidlo si zapíšeš <a href={navrat.odkaz}>na konci cesty</a>.</p>
  {/if}
  {#each odstavce(blok.scena) as o, i (i)}<p class="pripad">{@html o}</p>{/each}
  <h3 class="t-h3 blok__otazka" id={`${id}-otazka`}>{OTAZKA_NAVRATU}</h3>

  {#if !zapsano}
    <div class="moznosti" role="radiogroup" aria-labelledby={`${id}-otazka`}>
      {#each ODPOVEDI_NAVRATU as o (o.id)}
        <label class={['karta', 'vystouple', vyber === o.id && 'karta--vybrana vystouple--zvoleno']}>
          <input class="vizualne-skryte" type="radio" name={`${id}-odpoved`} value={o.id} bind:group={vyber} onchange={ulozStav} />
          <span class="karta__bod" aria-hidden="true"></span>
          <span>{o.text}</span>
        </label>
      {/each}
    </div>
    <label class="blok__popis proc" for={`${id}-duvod`}>Proč?<span class="nepovinne">Nepovinné</span></label>
    <textarea class="blok__pole blok__pole--kratke" id={`${id}-duvod`} rows="2" bind:value={duvod} onchange={ulozStav} placeholder="Stačí pár slov…"></textarea>
  {/if}
</RamAktivity>

<style>
  .pravidlo__popis { margin-bottom: var(--s-1); color: var(--ink-2); }
  /* Pravidlo je studentovo: jeho perem, s čárkovanou linkou tužkou. */
  .pravidlo {
    margin: 0 0 var(--s-5);
    padding-left: var(--s-4);
    border-left: 1.5px dashed var(--tuzka);
    color: var(--pero);
    font-family: var(--font-ruka);
    font-size: calc(var(--meritko) * 19px);
    line-height: 1.4;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  .pripad:last-of-type { margin-bottom: var(--s-5); }
  /* Karty vedle sebe jen tam, kde se do bloku vejdou celé (dílna); v deníku a na telefonu stojí pod sebou. */
  .moznosti { display: grid; gap: var(--s-3); margin-bottom: var(--s-5); }
  @container (min-width: 600px) {
    .moznosti { grid-template-columns: repeat(3, 1fr); }
  }
  .karta {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    min-height: 56px;
    padding: var(--s-3) var(--s-4);
    border-radius: var(--r-ovladani);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani-l);
    font-weight: 600;
    white-space: nowrap;
    color: var(--ink);
  }
  .karta:has(input:focus-visible) { outline: 2px solid var(--ink); outline-offset: 3px; }
  .karta__bod { flex: none; width: 18px; height: 18px; border-radius: var(--r-plne); box-shadow: inset 0 0 0 1.5px var(--tuzka); }
  .karta--vybrana .karta__bod { background: var(--pero); box-shadow: inset 0 0 0 3px var(--papir); outline: 1.5px solid var(--pero); }
  .proc { display: flex; flex-wrap: wrap; column-gap: var(--s-2); }
  .nepovinne { font-weight: 400; color: var(--ink-3); }
  .duvod .t-popisek { color: var(--ink-2); }
</style>
