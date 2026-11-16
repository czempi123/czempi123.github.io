<script lang="ts">
  // Legenda čar mezi životy v řece: čtyři typy vztahů z dat a tradovaný vztah.
  // U každého typu vzorek čáry a text, ne jen barva; vzorky jsou stejné jako v kartě člověka.
  // Použití: <LegendaVztahu /> (řádek pod řekou na notebooku), <LegendaVztahu svisle /> (panel na telefonu)
  import { LEGENDA_VZTAHU, LEGENDA_TRADOVANY } from '../../lib/vztahy';

  interface Props {
    svisle?: boolean;
    /** jen tyhle typy (řeka ve výchozím stavu ukazuje jen učitele a žáky); bez nich všechny */
    typy?: string[];
  }
  let { svisle = false, typy }: Props = $props();
  let polozky = $derived(typy ? LEGENDA_VZTAHU.filter((v) => typy.includes(v.typ)) : LEGENDA_VZTAHU);
</script>

<ul class="legenda" class:legenda--svisle={svisle} aria-label="Čáry mezi životy">
  {#each polozky as v (v.typ)}
    <li>
      <svg class="cara" width="28" height="12" viewBox="0 0 28 12" aria-hidden="true">
        {#if v.cara === 'vlnovka'}
          <path d="M1 6 L5 2 L9 10 L13 2 L17 10 L21 2 L25 6" />
        {:else}
          <path d="M1 6 H27" class="cara--{v.cara}" />
        {/if}
      </svg>
      <span>{v.nazev}</span>
    </li>
  {/each}
  <li>
    <svg class="cara cara--slaba" width="28" height="12" viewBox="0 0 28 12" aria-hidden="true"><path d="M1 6 H27" /></svg>
    <span>slabší čára: {LEGENDA_TRADOVANY}</span>
  </li>
</ul>

<style>
  .legenda {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 var(--s-3);
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--font-sans);
    font-size: var(--fs-popisek);
    line-height: 1.2;
    color: var(--ink-2);
  }
  li { display: flex; align-items: center; gap: 6px; min-height: 24px; white-space: nowrap; }
  .cara { flex: none; fill: none; stroke: var(--ink-2); stroke-width: 1.6; }
  .cara--teckovana { stroke-dasharray: 1.5 3.5; stroke-linecap: round; }
  .cara--carkovana { stroke-dasharray: 6 4; }
  /* Tradovaný vztah je v řece stejná čára, jen slabší. */
  .cara--slaba { opacity: 0.45; }
  .legenda--svisle { flex-direction: column; align-items: flex-start; gap: 0; }
  .legenda--svisle li { min-height: 28px; }
</style>
