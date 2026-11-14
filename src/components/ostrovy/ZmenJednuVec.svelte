<script lang="ts">
  // Změň jednu věc v rámu aktivity (K4b): myšlenkový pokus s přepínačem podmínky. Student rozhodne (vystouplé lístky,
  // zvolený vtlačený s tečkou perem), přepne jednu věc ve scéně (záložky), přečte změněnou scénu na vloženém lístku,
  // rozhodne znovu a na lístku s páskou vidí „Předtím → Teď“ svým perem. Zpětná vazba se ptá na důvod posunu.
  // Použití v MDX (obsah v src/content/bloky/utek-z-vezeni.yaml):
  // <ZmenJednuVec id="utek-z-vezeni" />
  import { VYCHOZI_NADTITULKY } from '../../lib/nadtitulky';
  import { onMount, tick } from 'svelte';
  import { ulozZapis, smazZapis, stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { posunZmeny, zapisZmeny, platnyStavZmeny, odstavce, radek, veta } from '../../lib/bloky';
  import type { TBlokZmena } from '../../lib/bloky-schema';
  import { odkryti } from '../../lib/pohyb';
  import RamAktivity from './RamAktivity.svelte';
  import BlokFilozof from './BlokFilozof.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { ClovekBloku, Dal } from './bloky-typy';

  interface Props {
    id: string;
    blok: Omit<TBlokZmena, 'zdroje' | 'kOvereni' | 'dal'>;
    filozof?: ClovekBloku;
    odkaz: string;
    dal?: Dal;
  }
  let { id, blok, filozof, odkaz, dal }: Props = $props();

  /** rozpracovaná volba v základu a v podmínkách (před potvrzením) */
  let navrhZaklad = $state<string | null>(null);
  let navrhPodminka = $state<string | null>(null);
  let zaklad = $state<string | null>(null);
  let odpovedi = $state<Record<string, string>>({});
  let aktivni = $state<string | null>(null);
  let oblast = $state<HTMLElement>();
  let cerstve = $state(false);
  /** student s blokem teď pracoval: změněná scéna se vloží pohybem (po obnovení stránky leží) */
  let ziva = $state(false);

  let podminka = $derived(blok.podminky.find((p) => p.id === aktivni) ?? null);
  let odpovedTed = $derived(aktivni ? (odpovedi[aktivni] ?? null) : null);
  let textMoznosti = (mid: string | null) => blok.moznosti.find((m) => m.id === mid)?.text ?? '';
  let nejakaOdpoved = $derived(Object.keys(odpovedi).length > 0);

  onMount(() => {
    const s = platnyStavZmeny(stavBloku(id), blok);
    if (!s) return;
    zaklad = s.zaklad;
    navrhZaklad = s.zaklad;
    odpovedi = s.podminky;
    aktivni = s.aktivni;
    navrhPodminka = s.aktivni ? (s.podminky[s.aktivni] ?? null) : null;
  });

  function ulozStav() {
    ulozStavBloku(id, { zaklad, podminky: odpovedi, aktivni }, { odkaz, otazka: blok.otazka, druh: 'zmena', hotovo: Object.keys(odpovedi).length > 0 });
  }

  let prepinace = $state<HTMLElement>();
  async function rozhodni() {
    if (!navrhZaklad) return;
    zaklad = navrhZaklad;
    ulozStav();
    // Tlačítko zmizí; fokus přejde na přepínač podmínek, ať klávesnice nezůstane na začátku stránky.
    await tick();
    prepinace?.querySelector('input')?.focus();
  }

  function prepni(pid: string) {
    ziva = true;
    cerstve = false;
    aktivni = pid;
    navrhPodminka = odpovedi[pid] ?? null;
    ulozStav();
  }

  async function rozhodniZnovu() {
    if (!aktivni || !navrhPodminka) return;
    odpovedi = { ...odpovedi, [aktivni]: navrhPodminka };
    cerstve = true;
    ulozStav();
    ulozZapis({ id, otazka: blok.otazka, odpoved: zapisZmeny(blok, { zaklad, podminky: odpovedi }), odkaz, druh: 'zmena' });
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    zaklad = null;
    navrhZaklad = null;
    navrhPodminka = null;
    odpovedi = {};
    aktivni = null;
    cerstve = false;
    smazStavBloku(id);
    smazZapis(id);
    await tick();
    document.getElementById(id)?.querySelector<HTMLElement>('input, textarea')?.focus();
  }
</script>

{#snippet moznosti(jmeno: string, zamceno: boolean, getter: () => string | null, setter: (v: string) => void, popisek: string)}
  <div class="moznosti" data-cast="moznosti" role="radiogroup" aria-label={popisek}>
    {#each blok.moznosti as m (m.id)}
      <label class={['moznost', 'vystouple', getter() === m.id && 'moznost--vybrana vystouple--zvoleno']}>
        <input
          class="vizualne-skryte"
          type="radio"
          name={jmeno}
          value={m.id}
          checked={getter() === m.id}
          disabled={zamceno}
          onchange={() => setter(m.id)}
        />
        <span class="moznost__bod" aria-hidden="true"></span>
        <span>{@html radek(m.text)}</span>
      </label>
    {/each}
  </div>
{/snippet}

{#snippet posunVazba()}
  {#if podminka && odpovedTed && zaklad}
    {@const posun = posunZmeny(zaklad, odpovedTed)}
    <p class="posun t-ovladani">
      <span class="posun__cast"><span class="t-popisek">Předtím</span> <span class="blok__ruka">{veta(textMoznosti(zaklad))}</span></span>
      <span class="posun__sipka" aria-hidden="true">→</span>
      <span class="posun__cast"><span class="t-popisek">Teď</span> <span class="blok__ruka">{veta(textMoznosti(odpovedTed))}</span></span>
    </p>
    <p class="blok__zpetna-titulek">{posun === 'posun' ? 'Tvoje odpověď se posunula.' : 'Tvoje odpověď zůstala stejná.'}</p>
    {#each odstavce(posun === 'posun' ? podminka.posun : podminka.stejne) as o, i (i)}<p>{@html o}</p>{/each}
  {/if}
{/snippet}

{#snippet coUdelal()}
  {#if zaklad && nejakaOdpoved && blok.coUdelal && filozof}
    <div class="co-udelal" data-cast="zpetna" in:odkryti>
      <BlokFilozof {filozof} nadpis={blok.coUdelal.nadpis}>
        {#each odstavce(blok.coUdelal.text) as o, i (i)}<p>{@html o}</p>{/each}
      </BlokFilozof>
    </div>
  {/if}
{/snippet}

{#snippet akce()}
  {#if !zaklad}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={rozhodni} disabled={!navrhZaklad}>Rozhodnuto</button>
  {:else}
    <BlokDal {dal} />
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida={['zmena', ziva && 'zmena--ziva'].filter(Boolean).join(' ')}
  nadtitulek={blok.nadtitulek ?? VYCHOZI_NADTITULKY.ZmenJednuVec}
  lide={filozof ? [filozof] : []}
  labelledby={`${id}-otazka`}
  vazba={zaklad && podminka && odpovedTed ? posunVazba : undefined}
  vazbaPopisek="Posun odpovědi"
  {cerstve}
  bind:vazbaPrvek={oblast}
  poVazbe={coUdelal}
  ulozeno={zaklad && nejakaOdpoved ? 'Tvoje rozhodnutí jsou uložená v deníku.' : undefined}
  znovu={zaklad ? znovu : undefined}
  hlavni={!zaklad || (nejakaOdpoved && dal) ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  {#if !zaklad}
    {@render moznosti(`${id}-zaklad`, false, () => navrhZaklad, (v) => (navrhZaklad = v), 'Tvoje rozhodnutí')}
  {:else}
    <p class="rozhodnuti" data-cast="moznosti"><span class="t-popisek">Tvoje rozhodnutí:</span> <strong class="blok__ruka">{veta(textMoznosti(zaklad))}</strong></p>

    <fieldset class="prepinac" data-cast="moznosti">
      <legend class="t-ovladani-l">Změň jednu věc</legend>
      <div class="podminky" bind:this={prepinace}>
        {#each blok.podminky as p (p.id)}
          <label class={['cip', 'vystouple', 'vystouple--m', aktivni === p.id && 'cip--zapnuty vystouple--zvoleno']}>
            <input class="vizualne-skryte" type="radio" name={`${id}-podminka`} value={p.id} checked={aktivni === p.id} onchange={() => prepni(p.id)} />
            <span>{p.prepinac}</span>
            {#if odpovedi[p.id]}<span class="vizualne-skryte"> (zodpovězeno)</span><span class="tecka" aria-hidden="true"></span>{/if}
          </label>
        {/each}
      </div>
    </fieldset>

    {#if podminka}
      {#key aktivni}
        <div class={['zmenena', ziva && 'rozlozit']} data-cast="moznosti">
          <span class="zmenena__stitek" aria-hidden="true">jedna věc jinak</span>
          {#each odstavce(podminka.zmena) as o, i (i)}<p>{@html o}</p>{/each}
          <p class="znovu-otazka t-ovladani-l">{@html radek(blok.otazka)}</p>
          {@render moznosti(`${id}-p-${podminka.id}`, false, () => navrhPodminka, (v) => (navrhPodminka = v), `Tvoje rozhodnutí: ${podminka.prepinac}`)}
          <button class="blok__tl blok__tl--hlavni" type="button" onclick={rozhodniZnovu} disabled={!navrhPodminka || navrhPodminka === odpovedTed}>
            {odpovedTed ? 'Rozhodnout jinak' : 'Rozhodnout znovu'}
          </button>
        </div>
      {/key}
    {:else}
      <p class="napoveda" data-cast="moznosti">Vyber jednu změnu a rozhodni se znovu.</p>
    {/if}
  {/if}
</RamAktivity>

<style>
  .moznosti { display: grid; gap: var(--s-3); margin-bottom: var(--s-4); }
  @container (min-width: 560px) {
    .moznosti { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
  }
  /* Možnost je vystouplý lístek; zvolená je vtlačená a tečka v ní je studentovým perem. */
  .moznost {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    min-height: 56px;
    padding: var(--s-3) var(--s-4);
    border-radius: var(--r-ovladani);
    font-size: var(--fs-ovladani-l);
    line-height: 1.35;
    color: var(--ink);
  }
  .moznost__bod { flex: none; width: 18px; height: 18px; border-radius: var(--r-plne); box-shadow: inset 0 0 0 1.5px var(--tuzka); }
  .moznost--vybrana .moznost__bod { background: var(--pero); box-shadow: inset 0 0 0 3px var(--papir); outline: 1.5px solid var(--pero); }
  .moznost:has(input:focus-visible), .cip:has(input:focus-visible) { outline: 2px solid var(--ink); outline-offset: 3px; }
  .rozhodnuti { margin: 0 0 var(--s-5); }
  .rozhodnuti .t-popisek { color: var(--ink-2); }
  .prepinac { margin: 0 0 var(--s-4); padding: 0; border: 0; }
  .prepinac legend { margin-bottom: var(--s-3); padding: 0; color: var(--ink); }
  .podminky { display: flex; flex-wrap: wrap; gap: var(--s-3); }
  /* Podmínky: malé vystouplé, zapnutá vtlačená. Zodpovězená má tečku v inkoustu období. */
  .cip {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    min-height: 44px;
    padding: var(--s-2) var(--s-4);
    border-radius: var(--r-plne);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 500;
    line-height: 1.3;
    color: var(--ink-2);
  }
  .cip--zapnuty { color: var(--ink); font-weight: 600; }
  .tecka { width: 8px; height: 8px; border-radius: var(--r-plne); background: var(--p); }
  /* Změněná scéna: vložený lístek (text delší než dvě věty se nenatáčí), nahoře štítek rukou. */
  .zmenena {
    position: relative;
    margin-top: var(--s-5);
    padding: var(--s-5) var(--s-5) var(--s-5);
    background: var(--list);
    box-shadow: var(--lezi);
  }
  .zmenena__stitek {
    position: absolute;
    top: -12px;
    left: var(--s-4);
    padding: 1px 10px 2px;
    background: var(--pp);
    color: var(--na-pp);
    font-family: var(--font-ruka);
    font-size: var(--fs-ruka);
    line-height: 1.3;
    rotate: -2deg;
  }
  .znovu-otazka { margin: var(--s-4) 0 var(--s-3); }
  .napoveda { margin: 0; font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .posun {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--s-2) var(--s-4);
    margin: 0 0 var(--s-4);
  }
  .posun__cast { display: inline-flex; flex-direction: column; }
  .posun__cast .t-popisek { color: var(--ink-2); }
  .posun__sipka { font-size: var(--fs-ovladani-l); color: var(--pero); }
  .co-udelal { margin-top: var(--s-5); }
  .co-udelal :global(.blok__oddil) { margin-top: 0; padding-top: var(--s-4); border-top: 1.5px dashed var(--tuzka); }
  .co-udelal :global(.blok__oddil > :last-child) { margin-bottom: 0; }
</style>
