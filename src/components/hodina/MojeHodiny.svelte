<script lang="ts">
  // Moje hodiny (oddíl deníku): hodiny uložené v tomto prohlížeči (src/lib/hodiny-uloziste.ts).
  // U každé Upravit (skladatel /hodina/nova/?hodina=<id>), Kopírovat odkaz pro studenty a Smazat s potvrzením
  // přímo v řádku. Bez uložených hodin oddíl nic neukazuje. Použití: <MojeHodiny /> uvnitř ostrovu Deník.
  import { onMount, tick } from 'svelte';
  import { adresaHodiny, type UlozenaHodina } from '../../lib/hodiny';
  import { nactiHodiny, smazHodinu } from '../../lib/hodiny-uloziste';
  import { pocetZastaveni } from '../../lib/skladatel';

  let hodiny = $state<UlozenaHodina[]>([]);
  let mazana = $state<string | null>(null);
  let zprava = $state('');
  let nadpis = $state<HTMLElement>();
  const datum = (iso: string) => new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const nazev = (h: UlozenaHodina) => h.nazev || 'Hodina bez názvu';

  onMount(() => {
    hodiny = nactiHodiny();
    const obnov = () => (hodiny = nactiHodiny());
    addEventListener('atlas-hodiny', obnov);
    return () => removeEventListener('atlas-hodiny', obnov);
  });

  async function kopiruj(h: UlozenaHodina) {
    const odkaz = location.origin + adresaHodiny(h);
    try {
      await navigator.clipboard.writeText(odkaz);
      zprava = `Odkaz pro studenty na hodinu ${nazev(h)} je zkopírovaný.`;
    } catch {
      zprava = `Odkaz pro studenty: ${odkaz}`;
    }
  }

  async function chciSmazat(id: string) {
    mazana = id;
    await tick();
    document.querySelector<HTMLElement>(`[data-nechat="${id}"]`)?.focus();
  }

  async function nechat(id: string) {
    mazana = null;
    await tick();
    document.querySelector<HTMLElement>(`[data-smazat="${id}"]`)?.focus();
  }

  async function smaz(h: UlozenaHodina) {
    const i = hodiny.findIndex((x) => x.id === h.id);
    smazHodinu(h.id);
    hodiny = nactiHodiny();
    mazana = null;
    zprava = `Hodina ${nazev(h)} je smazaná.`;
    await tick();
    const dalsi = hodiny[i] ?? hodiny[i - 1];
    (dalsi ? document.querySelector<HTMLElement>(`[data-upravit="${dalsi.id}"]`) : nadpis)?.focus();
  }
</script>

{#if hodiny.length || zprava}
  <section class="moje-hodiny" aria-labelledby="moje-hodiny-nadpis">
    <h2 class="t-h3 nadpis" id="moje-hodiny-nadpis" tabindex="-1" bind:this={nadpis}>Moje hodiny</h2>
    {#if hodiny.length}
      <ul class="seznam">
        {#each hodiny as h (h.id)}
          <li>
            <p class="t-popisek">{pocetZastaveni(h.zastaveni.length)} · změněno {datum(h.zmeneno)}</p>
            <p class="nazev">{nazev(h)}</p>
            {#if mazana === h.id}
              <div class="potvrzeni" role="group" aria-label="Smazat hodinu {nazev(h)}?">
                <p class="t-ovladani">Smazat hodinu i s poznámkami? Vrátit to nepůjde.</p>
                <div class="blok__akce">
                  <button type="button" class="blok__tl blok__tl--vedlejsi" onclick={() => smaz(h)}>Smazat hodinu</button>
                  <button type="button" class="blok__tl blok__tl--tiche" data-nechat={h.id} onclick={() => nechat(h.id)}>Nechat</button>
                </div>
              </div>
            {:else}
              <div class="blok__akce akce">
                <a class="blok__tl blok__tl--vedlejsi" data-upravit={h.id} href="/hodina/nova/?hodina={encodeURIComponent(h.id)}" aria-label="Upravit hodinu {nazev(h)}">Upravit</a>
                <button type="button" class="blok__tl blok__tl--tiche" onclick={() => kopiruj(h)} aria-label="Kopírovat odkaz pro studenty: {nazev(h)}">Kopírovat odkaz pro studenty</button>
                <button type="button" class="blok__tl blok__tl--tiche" data-smazat={h.id} onclick={() => chciSmazat(h.id)} aria-label="Smazat hodinu {nazev(h)}">Smazat</button>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
    <p class="zprava t-ovladani" role="status">{zprava}</p>
  </section>
{/if}

<style>
  .nadpis { margin: var(--s-7) 0 var(--s-4); }
  .nadpis:focus { outline: none; }
  .nadpis:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .seznam { margin: 0; padding: 0; list-style: none; }
  .seznam li { padding: var(--s-4) 0; border-top: 1px solid var(--linka); }
  .seznam p { margin: 0 0 var(--s-1); }
  .nazev { font-family: var(--font-sans); font-weight: 600; font-size: var(--fs-ovladani-l); overflow-wrap: anywhere; }
  .akce { margin-top: var(--s-2); }
  .akce .blok__tl { min-height: 44px; font-size: var(--fs-ovladani); }
  .potvrzeni { margin-top: var(--s-2); padding: var(--s-3) var(--s-4); border-radius: var(--r-ovladani); background: var(--papir); }
  .potvrzeni .blok__akce { margin-top: var(--s-2); }
  .zprava { margin: var(--s-3) 0 0; color: var(--ink-2); overflow-wrap: anywhere; }
  .zprava:empty { margin: 0; }
</style>
