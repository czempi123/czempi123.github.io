<script lang="ts">
  // Závěr cesty: závěrečné pravidlo (ukládá se samo) a vedle něj to, co student uložil na začátku cesty.
  // „Na začátku“ se čte z deníku tak, jak to tehdy zapsal; nic se neukládá podruhé. Když tam zápis není
  // (student krok přeskočil nebo odpověď smazal), panel se neukáže a zůstane jen pole s pravidlem jako dřív.
  // „Teď“ je přímo pole s pravidlem. Pod srovnáním je nepovinná otázka, co se změnilo; nic se nehodnotí.
  // K4b: „Na začátku“ leží na lepicím lístku a studentova odpověď je jeho perem (místo tónovaného rámečku).
  // Použití v MDX posledního kroku (obal src/components/bloky/ZaverCesty.astro):
  // <ZaverCesty id="cesta1-moje-pravidlo" otazka="Kdy mám dobrý důvod něčemu věřit? Napiš svoje pravidlo." />
  import { onMount } from 'svelte';
  import { najdiZapis } from '../../lib/denik';
  import { castiZacatku, type CastZacatku, type DruhZacatku } from '../../lib/zaver';
  import MojeStanovisko from './MojeStanovisko.svelte';

  interface Zacatek {
    /** id bloku, jehož zápis je počáteční odpověď */
    id: string;
    krok: number;
    nazev: string;
    druh: DruhZacatku;
    /** názvy košů (Roztřiď), podle kterých se zápis rozloží */
    kose?: string[];
  }
  interface Props {
    id: string;
    otazka: string;
    odkaz: string;
    /** název cesty: stojí v deníku před otázkou, co se změnilo */
    cesta: string;
    obdobi: number;
    zacatek?: Zacatek;
  }
  let { id, otazka, odkaz, cesta, obdobi, zacatek }: Props = $props();
  const idZmeny = `${id}-zmena`;
  const OTAZKA_ZMENY = 'Co se změnilo, nebo proč si myslíš totéž?';

  let casti = $state<CastZacatku[]>([]);
  // Otázka pod srovnáním se ukáže, až je co srovnávat; pak už nezmizí, ani když student pravidlo smaže.
  let ukazZmenu = $state(false);

  function nactiZDeniku() {
    casti = zacatek ? castiZacatku(najdiZapis(zacatek.id)?.odpoved ?? '', zacatek.druh, zacatek.kose) : [];
    ukazZmenu = ukazZmenu || !!najdiZapis(id)?.odpoved.trim() || !!najdiZapis(idZmeny);
  }

  onMount(() => {
    nactiZDeniku();
    addEventListener('atlas-denik', nactiZDeniku);
    return () => removeEventListener('atlas-denik', nactiZDeniku);
  });
</script>

{#if zacatek && casti.length}
  <section class="blok zaver obdobi-{obdobi}" {id} aria-label="Na začátku a teď">
    <div class="sloupce">
      <div class="zacatek">
        <h3 class="blok__zpetna-titulek">Na začátku</h3>
        <p class="t-popisek odkud">Krok {zacatek.krok} · {zacatek.nazev}</p>
        {#each casti as c, i (i)}
          <div class="cast">
            {#if c.nadpis}<p class="t-nadtitulek cast__nadpis">{c.nadpis}</p>{/if}
            {#if c.radky.length > 1}
              <ul>{#each c.radky as r, j (j)}<li>{r}</li>{/each}</ul>
            {:else}
              <p>{c.radky[0]}</p>
            {/if}
          </div>
        {/each}
      </div>
      <div class="ted">
        <h3 class="blok__zpetna-titulek">Teď</h3>
        <MojeStanovisko rozbalene {id} {otazka} {odkaz} />
      </div>
    </div>
    {#if ukazZmenu}
      <div class="zmena">
        <MojeStanovisko rozbalene nepovinne id={idZmeny} otazka={`${cesta} ${OTAZKA_ZMENY}`} popisek={OTAZKA_ZMENY} {odkaz} />
      </div>
    {/if}
  </section>
{:else}
  <div class="ctenarsky samo" {id}><MojeStanovisko rozbalene {id} {otazka} {odkaz} /></div>
{/if}

<style>
  .samo { margin-inline: auto; }
  .zaver { margin: var(--s-6) 0 0; }
  .sloupce { display: grid; gap: var(--s-5); }
  /* Na telefonu pod sebou, od 700 px vedle sebe (stejně jako Změnil se? u velké otázky). */
  @container (min-width: 640px) {
    .sloupce { grid-template-columns: 1fr 1fr; gap: var(--s-6); align-items: start; }
    /* Nadpis „Teď“ ve stejné výšce jako „Na začátku“ na lístku. */
    .ted { padding-top: var(--s-4); }
  }
  /* Na začátku: lepicí lístek (ležící, mírně natočený), co tehdy student zapsal, jeho perem. */
  .zacatek { padding: var(--s-4) var(--s-5); background: var(--listek); box-shadow: var(--lezi); rotate: calc(-.6deg * var(--natoceni)); }
  .odkud { margin: 0 0 var(--s-3); color: var(--ink-2); }
  .cast + .cast { margin-top: var(--s-3); }
  .cast__nadpis { margin: 0 0 var(--s-1); color: var(--ink); }
  .cast ul { margin: 0; padding: 0; list-style: none; }
  .cast p:not(.cast__nadpis), .cast li { margin: 0; font-family: var(--font-ruka); font-size: calc(var(--meritko) * 19px); line-height: 1.4; color: var(--pero); white-space: pre-line; overflow-wrap: anywhere; }
  .cast li + li { margin-top: var(--s-1); }
  .ted :global(.stanovisko), .zmena :global(.stanovisko) { margin-top: 0; }
  .ted .blok__zpetna-titulek { margin-bottom: var(--s-3); }
  .zmena { margin-top: var(--s-5); padding-top: var(--s-4); border-top: 1.5px dashed var(--tuzka); }
</style>
