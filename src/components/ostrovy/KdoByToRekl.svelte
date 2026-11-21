<script lang="ts">
  // Kdo by to řekl? (herna-v1, K3): dnešní věta jako výstřižek (bublina chatu, rada kamaráda, komentář; nebo
  // plakátek reklamy či motivačního obrázku). Student vybere razítkem filozofa, který by ji podepsal; pod jménem
  // stojí věta z pole proc v lide.yaml, čím se ten člověk zabýval (jako Kdo to řekl? po K2). Nepovinně připíše proč
  // a zapíše do deníku. Pak lístek „Atlas by vybral…“ s důvodem a citátem z pramene a s tím, kdo by větu odmítl.
  // Volba studenta zůstává a nehodnotí se.
  // Použití v MDX (obsah v src/content/bloky/dilna-kdo-by-mene.yaml, druh: kdo-by):
  // <KdoByToRekl id="dilna-kdo-by-mene" />
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku, ulozZapis, smazZapis } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import { platnyStavKdoBy, zapisKdoBy, otazkaZapisuKdoBy } from '../../lib/herna';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import HlasHerny from './HlasHerny.svelte';
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import type { ClovekBloku, Dal, HlasHerny as THlas } from './bloky-typy';

  interface Props {
    id: string;
    blok: {
      obdobi: number; nadtitulek: string; nazev: string; scena?: string; otazka: string; pokyn: string;
      veta: string; popisek: string; podoba: 'bublina' | 'plakat';
      moznosti: { id: string; clovek: ClovekBloku; myslenka: string }[];
      atlas: THlas[]; odmitl: THlas[];
    };
    odkaz: string;
    dal?: Dal;
  }
  let { id, blok, odkaz, dal }: Props = $props();

  let osoba = $state<string | null>(null);
  let proc = $state('');
  let zapsano = $state(false);
  let cerstve = $state(false);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();

  const zvoleny = $derived(blok.moznosti.find((m) => m.id === osoba));

  onMount(() => {
    const s = platnyStavKdoBy(stavBloku(id), blok.moznosti.map((m) => m.id));
    if (s) ({ osoba, proc, zapsano } = s);
  });

  function ulozStav() {
    if (!osoba) return smazStavBloku(id);
    ulozStavBloku(id, { osoba, proc, zapsano }, { odkaz, otazka: blok.otazka, druh: 'kdo-by', hotovo: zapsano });
  }

  function vyber(o: string) {
    if (zapsano) return;
    osoba = osoba === o ? null : o;
    ulozStav();
    hlaseni = zvoleny ? `Vybráno: ${zvoleny.clovek.jmeno}.` : 'Nic není vybrané.';
  }

  async function zapis() {
    if (!zvoleny || zapsano) return;
    proc = proc.trim();
    zapsano = true;
    cerstve = true;
    ulozStav();
    ulozZapis({ id, otazka: otazkaZapisuKdoBy(blok.otazka, blok.veta), odpoved: zapisKdoBy(zvoleny.clovek.jmeno, proc), odkaz, druh: 'kdo-by' });
    hlaseni = 'Zapsáno do deníku.';
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    osoba = null;
    proc = '';
    zapsano = false;
    cerstve = false;
    hlaseni = 'Nic není vybrané.';
    smazStavBloku(id);
    smazZapis(id);
    await tick();
    document.getElementById(id)?.querySelector<HTMLElement>('.razitko-volby')?.focus();
  }
</script>

{#snippet vazba()}
  {#if zvoleny}<p class="tvuj-vyber"><span class="t-popisek">Tvůj výběr:</span> <span class="blok__ruka">{zvoleny.clovek.jmeno}</span></p>{/if}
  <p class="blok__zpetna-titulek">Atlas by vybral…</p>
  <ul class="hlasy-herny">{#each blok.atlas as h (h.osoba)}<HlasHerny hlas={h} />{/each}</ul>
  <p class="hlasy__titulek">Kdo by větu odmítl</p>
  <ul class="hlasy-herny">{#each blok.odmitl as h (h.osoba)}<HlasHerny hlas={h} />{/each}</ul>
{/snippet}

{#snippet akce()}
  {#if zapsano}
    <BlokDal {dal} />
  {:else}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={zapis} disabled={!osoba}>Zapsat do deníku</button>
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="kdo-by"
  nadtitulek={blok.nadtitulek}
  nazev={blok.nazev}
  labelledby={`${id}-otazka`}
  vazba={zapsano ? vazba : undefined}
  vazbaPopisek="Atlas by vybral"
  {cerstve}
  bind:vazbaPrvek={oblast}
  ulozeno={zapsano ? 'Tvoje volba je uložená v deníku.' : undefined}
  znovu={osoba ? znovu : undefined}
  hlavni={zapsano ? (dal ? akce : undefined) : akce}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}

  <div class={['vystrizek-dnes', `vystrizek-dnes--${blok.podoba}`]} data-cast="scena">
    <p class="vystrizek-dnes__odkud">{blok.popisek}</p>
    <blockquote class="vystrizek-dnes__veta"><p>{@html radek(blok.veta)}</p></blockquote>
  </div>

  <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>
  {#if !zapsano}<p class="volby__pokyn" id={`${id}-pokyn`}>{@html radek(blok.pokyn)}</p>{/if}
  <ul class="volby" aria-label="Filozofové" aria-describedby={zapsano ? undefined : `${id}-pokyn`} data-cast="moznosti">
    {#each blok.moznosti as m (m.id)}
      <li>
        <button
          class={['razitko-volby', 'vystouple', osoba === m.id && 'razitko-volby--zvolene']}
          type="button"
          aria-pressed={osoba === m.id}
          disabled={zapsano}
          onclick={() => vyber(m.id)}
        >
          <RazitkoCloveka razitko={m.clovek.razitko} obdobi={m.clovek.obdobi} velikost={52} />
          <span class="volba__text">
            <span class="volba__jmeno">{m.clovek.jmeno}</span>
            <span class="volba__myslenka">{@html radek(m.myslenka)}</span>
          </span>
        </button>
      </li>
    {/each}
  </ul>

  {#if osoba && !zapsano}
    <label class="blok__popis" for={`${id}-proc`} data-cast="duvod">Proč? <span class="nepovinne">Nepovinné</span></label>
    <textarea class="blok__pole blok__pole--kratke" data-cast="duvod" id={`${id}-proc`} rows="2" bind:value={proc} onchange={ulozStav} placeholder="Stačí pár slov…"></textarea>
  {:else if zapsano && proc}
    <p class="tvuj-duvod" data-cast="duvod"><span class="t-popisek">Tvůj důvod:</span> <span class="blok__ruka">{proc}</span></p>
  {/if}
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
</RamAktivity>

<style>
  /* Výstřižek dnešní věty: bublina chatu (zaoblená, s ocáskem), nebo plakátek (velké písmo, papír lístku). */
  .vystrizek-dnes { position: relative; max-width: 420px; margin: var(--s-2) 0 var(--s-5); padding: 12px 18px 16px; background: var(--list); box-shadow: var(--lezi); rotate: calc(-.7deg * var(--natoceni)); }
  .vystrizek-dnes__odkud { margin: 0 0 var(--s-2); font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .vystrizek-dnes__veta { margin: 0; }
  .vystrizek-dnes__veta p { margin: 0; font-family: var(--font-sans); font-weight: 600; line-height: 1.3; }
  .vystrizek-dnes--bublina { border-radius: 20px 20px 20px 4px; }
  .vystrizek-dnes--bublina .vystrizek-dnes__veta p { font-size: calc(var(--meritko) * 20px); }
  .vystrizek-dnes--bublina::after { content: ''; position: absolute; left: 0; bottom: -10px; width: 18px; height: 12px; background: var(--list); clip-path: polygon(0 0, 100% 0, 0 100%); }
  .vystrizek-dnes--plakat { background: var(--listek); text-align: center; padding: 20px 22px 26px; }
  .vystrizek-dnes--plakat .vystrizek-dnes__veta p { font-size: calc(var(--meritko) * 30px); font-weight: 800; letter-spacing: -.01em; text-transform: uppercase; text-wrap: balance; }

  .volby__pokyn { margin: 0 0 var(--s-3); font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .volby { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-3); margin: 0 0 var(--s-4); padding: 0; list-style: none; }
  @container (min-width: 520px) { .volby { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .volby li { display: flex; }
  .razitko-volby {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    width: 100%;
    min-height: 44px;
    padding: var(--s-3);
    border: 0;
    border-radius: var(--r-ovladani);
    color: var(--ink);
    font-family: var(--font-sans);
    text-align: left;
    cursor: pointer;
  }
  .razitko-volby :global(.razitko-cloveka) { flex: none; }
  .volba__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .volba__jmeno { font-size: var(--fs-ovladani); font-weight: 600; line-height: 1.2; }
  .volba__myslenka { font-family: var(--font-serif); font-size: calc(var(--meritko) * 15px); line-height: 1.35; color: var(--ink-2); }
  .razitko-volby:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  /* Zvolené je vtlačené s podtrženým jménem v barvě pera (stav nestojí jen na stínu). */
  .razitko-volby.razitko-volby--zvolene { box-shadow: var(--vtla); }
  .razitko-volby--zvolene .volba__jmeno { text-decoration: underline; text-decoration-color: var(--pero); text-decoration-thickness: 2px; text-underline-offset: 4px; }
  .razitko-volby:disabled { cursor: default; color: var(--ink); }
  .razitko-volby:disabled:not(.razitko-volby--zvolene) :global(.razitko-cloveka) { opacity: .55; }

  .tvuj-vyber { margin: 0 0 var(--s-3); }
  .hlasy-herny { display: grid; gap: var(--s-4); margin: 0; padding: 0; list-style: none; }
  .hlasy__titulek { margin: var(--s-4) 0 var(--s-2); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
</style>
