<script lang="ts">
  // Volba s důvodem v rámu aktivity (K4a): možnosti jsou kroužkovací arch (od K5; štípací lístek s pahýlem patří cestě):
  // proužky papíru s písmenem na okraji. Volba proužek vtlačí do papíru a pero studenta zakroužkuje písmeno. Nepovinné „Proč právě tohle?“,
  // ke každé možnosti vlastní zpětná vazba „Tvůj tah: …“ na lístku s páskou a oddíl „Co udělal …“.
  // Zpětná vazba vysvětluje důvod, nikdy neznámkuje. Blok s `bezDuvodu: true` pole „Proč právě tohle?“ nemá (cesta 4, krok 2).
  // Použití v MDX (obsah v src/content/bloky/cesta1-jak-zjistit.yaml):
  // <Volba id="cesta1-jak-zjistit" />
  import { VYCHOZI_NADTITULKY } from '../../lib/nadtitulky';
  import { onMount, tick } from 'svelte';
  import { ulozZapis, smazZapis, stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { zpetnaVolby, zapisVolby, platnyStavVolby, pismeno, odstavce, radek } from '../../lib/bloky';
  import type { TBlokVolba } from '../../lib/bloky-schema';
  import RamAktivity from './RamAktivity.svelte';
  import BlokFilozof from './BlokFilozof.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { ClovekBloku, Dal } from './bloky-typy';

  interface Props {
    id: string;
    blok: Omit<TBlokVolba, 'zdroje' | 'kOvereni' | 'dal'>;
    /** filozof z oddílu „Co udělal …“ (jméno, období a atribut z dat) */
    filozof?: ClovekBloku;
    odkaz: string;
    /** Kam dál po tahu */
    dal?: Dal;
  }
  let { id, blok, filozof, odkaz, dal }: Props = $props();
  const meta = (hotovo: boolean) => ({ odkaz, otazka: blok.otazka, druh: 'volba' as const, hotovo });

  let vyber = $state<number | null>(null);
  let proc = $state('');
  let potvrzeno = $state(false);
  /** student s blokem teď pracoval: štípnutí, kroužek a lístek se pohnou (po obnovení stránky stojí rovnou) */
  let ziva = $state(false);
  let cerstve = $state(false);
  let oblast = $state<HTMLElement>();
  let zpetna = $derived(potvrzeno && vyber !== null ? zpetnaVolby(blok, vyber, filozof) : null);

  onMount(() => {
    const s = platnyStavVolby(stavBloku(id), blok.moznosti.length);
    if (s) ({ vyber, proc, potvrzeno } = s);
  });

  function ulozRozpracovane() {
    ziva = true;
    if (vyber !== null) ulozStavBloku(id, { vyber, proc, potvrzeno }, meta(potvrzeno));
  }

  async function potvrd() {
    if (vyber === null) return;
    potvrzeno = true;
    ziva = true;
    cerstve = true;
    ulozStavBloku(id, { vyber, proc: proc.trim(), potvrzeno }, meta(true));
    ulozZapis({ id, otazka: blok.otazka, odpoved: zapisVolby(blok, vyber, proc), odkaz, druh: 'volba' });
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    vyber = null;
    proc = '';
    potvrzeno = false;
    cerstve = false;
    smazStavBloku(id);
    smazZapis(id);
    await tick();
    document.getElementById(id)?.querySelector<HTMLElement>('input, textarea')?.focus();
  }
</script>

{#snippet vazbaVolby()}
  {#if zpetna}
    <p class="blok__zpetna-titulek">{zpetna.titulek}</p>
    {#each odstavce(zpetna.text) as o, i (i)}<p>{@html o}</p>{/each}
    {#if zpetna.coUdelal && filozof}
      <BlokFilozof {filozof} nadpis={zpetna.coUdelal.nadpis}>
        {#each odstavce(zpetna.coUdelal.text) as o, i (i)}<p>{@html o}</p>{/each}
      </BlokFilozof>
    {/if}
  {/if}
{/snippet}

{#snippet ostatni()}
  {#if zpetna}
    <details class="ostatni" data-cast="zpetna">
      <summary>Co kdybys zvolil jinak?</summary>
      <ul>
        {#each blok.moznosti as m, i (i)}
          {#if i !== vyber}
            <li>
              <p class="blok__zpetna-titulek">{pismeno(i)} · Tah: {m.tah}.</p>
              {#each odstavce(m.zpetna) as o, j (j)}<p>{@html o}</p>{/each}
            </li>
          {/if}
        {/each}
      </ul>
    </details>
  {/if}
{/snippet}

{#snippet akce()}
  {#if !potvrzeno}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={potvrd} disabled={vyber === null}>Tohle je můj tah</button>
  {:else}
    <BlokDal {dal} />
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida={['volba', ziva && 'volba--ziva'].filter(Boolean).join(' ')}
  nadtitulek={blok.nadtitulek ?? VYCHOZI_NADTITULKY.Volba}
  lide={filozof ? [filozof] : []}
  labelledby={`${id}-otazka`}
  vazba={zpetna ? vazbaVolby : undefined}
  {cerstve}
  bind:vazbaPrvek={oblast}
  poVazbe={ostatni}
  ulozeno={zpetna ? 'Tvůj tah je uložený v deníku.' : undefined}
  znovu={potvrzeno ? znovu : undefined}
  hlavni={!potvrzeno || dal ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  <div class="moznosti" data-cast="moznosti" role="radiogroup" aria-labelledby={`${id}-otazka`}>
    {#each blok.moznosti as m, i (i)}
      <label class={['vystouple', 'karta', vyber === i && 'karta--vybrana vystouple--zvoleno', potvrzeno && 'karta--zamcena', potvrzeno && vyber !== i && 'karta--skryta']}>
        <input
          class="vizualne-skryte"
          type="radio"
          name={`${id}-moznost`}
          value={i}
          bind:group={vyber}
          onchange={ulozRozpracovane}
          disabled={potvrzeno}
        />
        <span class="okraj" aria-hidden="true">
          <span class="pismeno">{pismeno(i)}<svg class="kruh" viewBox="0 0 40 38" focusable="false"><path pathLength="1" d="M21 3C10 2 3 9 4 20c1 11 11 16 21 14 9-2 13-10 11-19C34 7 27 2 17 4" /></svg></span>
        </span>
        <span class="text">{@html radek(m.text)}</span>
      </label>
    {/each}
  </div>

  {#if !potvrzeno}
    {#if !blok.bezDuvodu}
      <label class="blok__popis" for={`${id}-proc`} data-cast="duvod">Proč právě tohle? <span class="nepovinne">Nepovinné</span></label>
      <textarea class="blok__pole blok__pole--kratke" data-cast="duvod" id={`${id}-proc`} rows="2" bind:value={proc} onchange={ulozRozpracovane} placeholder="Stačí pár slov…"></textarea>
    {/if}
  {:else if proc.trim()}
    <p class="tvuj-duvod" data-cast="duvod"><span class="t-popisek">Tvůj důvod:</span> <span class="blok__ruka">{proc}</span></p>
  {/if}
</RamAktivity>

<style>
  .moznosti { display: grid; gap: 14px; margin-bottom: var(--s-5); }
  /* Dva sloupce jen v širokém rámu (krok cesty na notebooku); v čtenářském sloupci profilu pod sebou. */
  @container (min-width: 760px) {
    .moznosti { grid-template-columns: 1fr 1fr; }
  }
  /* Kroužkovací arch (K5, připomínka autora 14. 11.: štípací lístek s pahýlem patří cestě): proužek papíru, vystouplý
     (global.css › Vrstvy stínu), zvolený vtlačený do papíru. Na okraji písmeno jako u testu; zvolené písmeno
     zakroužkuje pero studenta, dřív kolem písmen nic není. Bez pahýlu, perforace a dírky. */
  .karta {
    display: flex;
    align-items: stretch;
    min-height: 58px;
    border-radius: var(--r-ovladani);
    font-family: var(--font-serif);
    font-size: var(--fs-ovladani-l);
    line-height: 1.4;
    color: var(--ink);
  }
  .karta:has(input:focus-visible) { outline: 2px solid var(--ink); outline-offset: 3px; }
  .karta--zamcena { cursor: default; }
  /* Po tahu zůstane vidět jen vybraný lístek; ostatní tahy jsou v „Co kdybys zvolil jinak?“. */
  .karta--skryta { display: none; }
  .moznosti:has(.karta--skryta) { grid-template-columns: 1fr; }
  /* Okraj s písmenem: kroužek perem až u zvolené možnosti (autor 14. 11.: nic předem zakroužkované). */
  .okraj {
    flex: none;
    display: grid;
    place-items: center;
    width: 52px;
  }
  .pismeno {
    position: relative;
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    font-family: var(--font-ruka);
    font-size: calc(var(--meritko) * 18px);
    color: var(--ruka);
  }
  /* Kroužek perem studenta: tah tužky (stroke-dashoffset), jediná výjimka z transform a opacity (Po D3). */
  /* Kroužek na střed písmene: pozice od středu, ne od okrajů (s insety ho mřížka písmene posunula o 7 px doleva). */
  .kruh {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    width: 40px;
    height: 38px;
    fill: none;
    stroke: var(--pero);
    stroke-width: 1.8;
    stroke-linecap: round;
    overflow: visible;
  }
  /* Nezvolený kroužek není vidět ani jako tečka (kulatý konec tahu nulové délky). */
  .kruh { opacity: 0; }
  .kruh path { stroke-dasharray: 1; stroke-dashoffset: 1; }
  .karta--vybrana .kruh { opacity: 1; }
  .karta--vybrana .kruh path { stroke-dashoffset: 0; }
  .karta--vybrana .pismeno { color: var(--pero); }
  /* Pohyb jen po činu studenta: po obnovení stránky je kroužek rovnou celý. */
  :global(.volba--ziva) .kruh path { transition: stroke-dashoffset var(--d-tah) var(--k-papir) var(--d-stisk); }
  .text { align-self: center; padding: 14px 16px 14px 2px; }
  .nepovinne { margin-left: var(--s-2); font-weight: 400; color: var(--ink-3); }
  .tvuj-duvod { margin: 0; }
  .tvuj-duvod .t-popisek { color: var(--ink-2); }
  .ostatni { margin-top: var(--s-4); }
  .ostatni summary {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 600;
    text-decoration: underline;
    text-decoration-color: var(--tuzka);
    text-underline-offset: 0.2em;
    cursor: pointer;
  }
  .ostatni ul { margin: var(--s-3) 0 0; padding: 0; list-style: none; display: grid; gap: var(--s-4); }
  .ostatni li { padding-left: var(--s-4); border-left: 2px solid var(--linka); }
  .ostatni li > :last-child { margin-bottom: 0; }
</style>
