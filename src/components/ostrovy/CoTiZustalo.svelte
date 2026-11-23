<script lang="ts">
  // Co ti zůstalo? (denik-v2, K2; plán › 1): kvíz na konci období z toho, co student v atlasu potkal. Jedna otázka
  // po druhé, jedna odpověď, hned rub „Víš.“, nebo „Zopakuj si.“ s vysvětlením z dat a odkazem tam, kde to potkal.
  // Druhý pokus není (jde o vybavení, ne o hádání). Konec kola bez počtu: seznam Zopakuj si, Dát do kartiček a Nové kolo.
  // Stav kola v blocích deníku (bloky[klic]); žádný zápis, žádná aktivita. Logika src/lib/herna/zustalo.ts.
  // Použití (src/components/denik/CoTiZustalo.astro, katalog skládá src/lib/herna/zustalo-data.ts):
  // <CoTiZustalo client:load katalog={katalog} klic="co-ti-zustalo/antika" obdobi={2} />
  // Dílna: `ukazka` (klíče míst, která „student prošel“) místo deníku a vlastní klíč stavu.
  import { onMount, tick } from 'svelte';
  import { nacti, stavBloku, ulozStavBloku, smazStavBloku, pridatKarticku, maKarticku } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import { vybaveni } from '../../lib/herna/verdikt';
  import {
    dalsiOtazka, kZopakovani, konecKola, noveKolo, odpovez, platnyStavZustalo, potkaneZDeniku, pozvanka, zpetPro,
    NAZVY_DRUHU, TEXTY_ZUSTALO as T, ZUSTALO_NEJMENE, type CestaZustalo, type KatalogZustalo, type StavZustalo,
  } from '../../lib/herna/zustalo';
  import RamAktivity from './RamAktivity.svelte';

  interface Props {
    katalog: KatalogZustalo;
    /** klíč stavu v blocích deníku („co-ti-zustalo/antika“) */
    klic: string;
    /** barva období */
    obdobi: number;
    /** dílna: místa, která „student prošel“, místo deníku */
    ukazka?: string[];
  }
  let { katalog, klic, obdobi, ukazka }: Props = $props();

  const uid = $derived(klic.replace(/[^a-z0-9-]/g, '-'));
  const podleId = $derived(new Map(katalog.otazky.map((o) => [o.id, o])));

  let pripraveno = $state(false);
  let potkane = $state<Set<string>>(new Set());
  let stav = $state<StavZustalo | null>(null);
  let pozvani = $state<CestaZustalo | undefined>();
  let vKartickach = $state<Set<string>>(new Set());
  let cerstve = $state(false);
  let oblast = $state<HTMLElement>();
  let hlaseni = $state('');

  const malo = $derived(!!stav && stav.poradi.length < ZUSTALO_NEJMENE && !Object.keys(stav.odpovedi).length);
  const konec = $derived(!!stav && konecKola(stav));
  const otazka = $derived(stav && !konec ? podleId.get(stav.poradi[stav.pozice]) : undefined);
  const odpoved = $derived(otazka && stav ? stav.odpovedi[otazka.id] : undefined);
  const volba = $derived(otazka && stav ? stav.volby[otazka.id] : undefined);
  const zopakuj = $derived(stav ? kZopakovani(stav).map((id) => podleId.get(id)!).filter(Boolean) : []);
  const vseVKartickach = $derived(zopakuj.length > 0 && zopakuj.every((o) => vKartickach.has(o.id)));

  onMount(() => {
    const d = nacti();
    potkane = ukazka ? new Set(ukazka) : potkaneZDeniku(d);
    stav = platnyStavZustalo(stavBloku(klic), katalog.otazky) ?? noveKolo(1, katalog.otazky, potkane);
    pozvani = pozvanka(katalog.cesty, ukazka ? null : d);
    obnovKarticky();
    pripraveno = true;
  });

  function obnovKarticky() {
    vKartickach = new Set(katalog.otazky.filter((o) => maKarticku('zustalo', o.id)).map((o) => o.id));
  }
  const prvek = (vyber: string) => document.getElementById(uid)?.querySelector<HTMLElement>(vyber);

  async function odpovedet(moznost: string) {
    if (!stav || !otazka || odpoved) return;
    stav = odpovez(stav, otazka, moznost);
    ulozStavBloku(klic, $state.snapshot(stav));
    cerstve = true;
    hlaseni = '';
    await tick();
    oblast?.focus();
  }

  async function dalsi() {
    if (!stav) return;
    stav = dalsiOtazka(stav);
    ulozStavBloku(klic, $state.snapshot(stav));
    cerstve = false;
    await tick();
    if (konecKola(stav)) {
      obnovKarticky();
      hlaseni = `${T.konec}.`;
      prvek('.zustalo__konec')?.focus();
    } else {
      hlaseni = `Otázka ${stav.pozice + 1} z ${stav.poradi.length}.`;
      prvek('.zustalo__postup')?.focus();
    }
  }

  async function zacit(kolo: number) {
    stav = noveKolo(kolo, katalog.otazky, potkane);
    if (kolo === 1) smazStavBloku(klic);
    else ulozStavBloku(klic, $state.snapshot(stav));
    cerstve = false;
    hlaseni = `Kolo ${kolo}. Otázka 1 z ${stav.poradi.length}.`;
    await tick();
    prvek('.zustalo__postup')?.focus();
  }

  async function doKarticek() {
    for (const o of zopakuj) pridatKarticku('zustalo', o.id);
    obnovKarticky();
    hlaseni = T.hlaseniKarticky;
    // Tlačítko zmizelo: fokus na Nové kolo, ať se klávesnice neztratí na začátek stránky.
    await tick();
    prvek('.zustalo__nove')?.focus();
  }
</script>

{#snippet rub()}
  {#if otazka && odpoved}
    {@const zpet = zpetPro(otazka, potkane, katalog.mista)}
    <p class={['zustalo__slovo', odpoved === 'vim' && 'zustalo__slovo--vis']}>{vybaveni(odpoved === 'vim')}</p>
    <p class="zustalo__vysvetleni">{@html radek(otazka.vysvetleni)}</p>
    <p class="zustalo__zpet"><a href={zpet.href}>{@html radek(zpet.text)}</a></p>
  {/if}
{/snippet}

{#snippet akceOtazky()}
  <button class="blok__tl blok__tl--hlavni zustalo__dalsi" type="button" onclick={dalsi}>
    {stav && stav.pozice >= stav.poradi.length - 1 ? T.konec : T.dalsi}
  </button>
{/snippet}

{#snippet akceKonce()}
  <div class="zustalo__akce">
    {#if zopakuj.length}
      {#if vseVKartickach}
        <p class="zustalo__ulozeno t-popisek"><span aria-hidden="true">✓ </span>{T.vKartickach}</p>
      {:else}
        <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={doKarticek}>{T.doKarticek}</button>
      {/if}
    {/if}
    <button class="blok__tl blok__tl--hlavni zustalo__nove" type="button" onclick={() => stav && zacit(stav.kolo + 1)}>{T.noveKolo}</button>
  </div>
{/snippet}

{#if pripraveno && stav}
  {#if malo}
    <div class="zustalo__pozvanka" id={uid}>
      <p>{@html radek(T.malo)}</p>
      {#if pozvani}<p class="t-ovladani"><a href={pozvani.adresa}>{@html radek(`${T.pozvanka} ${pozvani.nazev}`)}</a></p>{/if}
    </div>
  {:else if konec}
    <RamAktivity id={uid} {obdobi} trida="zustalo" nadtitulek={T.konec} labelledby={`${uid}-konec`} hlavni={akceKonce}>
      <h3 class="t-h3 blok__otazka blok__otazka--mala zustalo__konec" id={`${uid}-konec`} tabindex="-1">
        {zopakuj.length ? T.zopakuj : T.vse}
      </h3>
      {#if zopakuj.length}
        <ul class="zustalo__zopakuj">
          {#each zopakuj as o (o.id)}
            {@const zpet = zpetPro(o, potkane, katalog.mista)}
            <li><span class="zustalo__nazev">{@html radek(o.nazev)}</span> <a href={zpet.href}>{@html radek(zpet.text)}</a></li>
          {/each}
        </ul>
      {/if}
    </RamAktivity>
  {:else if otazka}
    <RamAktivity
      id={uid}
      {obdobi}
      trida="zustalo"
      nadtitulek={NAZVY_DRUHU[otazka.druh]}
      labelledby={`${uid}-zadani`}
      vazba={odpoved ? rub : undefined}
      vazbaPopisek={odpoved ? vybaveni(odpoved === 'vim') : undefined}
      {cerstve}
      bind:vazbaPrvek={oblast}
      znovu={Object.keys(stav.odpovedi).length ? () => zacit(stav!.kolo) : undefined}
      hlavni={odpoved ? akceOtazky : undefined}
    >
      <p class="zustalo__postup t-popisek" tabindex="-1">{@html radek(`Otázka ${stav.pozice + 1} z ${stav.poradi.length}`)}</p>
      <div class={['zustalo__podnet', otazka.druh === 'pojem' && 'zustalo__podnet--situace']} data-cast="scena">
        {#each odstavce(otazka.podnet) as o, i (i)}<p class="blok__scena">{@html o}</p>{/each}
      </div>
      <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${uid}-zadani`}>{@html radek(otazka.zadani)}</h3>
      {#if !odpoved}
        <ul class={['zustalo__moznosti', otazka.druh === 'pojem' && 'zustalo__moznosti--kratke']} aria-labelledby={`${uid}-zadani`} data-cast="moznosti">
          {#each otazka.moznosti as m (m.id)}
            <li><button class="zustalo__moznost vystouple" type="button" onclick={() => odpovedet(m.id)}>{@html radek(m.text)}</button></li>
          {/each}
        </ul>
      {:else}
        <ul class={['zustalo__moznosti', 'zustalo__moznosti--hotove', otazka.druh === 'pojem' && 'zustalo__moznosti--kratke']} aria-labelledby={`${uid}-zadani`} data-cast="moznosti">
          {#each otazka.moznosti as m (m.id)}
            <li class={['zustalo__hotova', m.id === volba && 'zustalo__hotova--zvolena', m.id === otazka.spravna && 'zustalo__hotova--spravna']}>
              <span class="zustalo__znacka" aria-hidden="true">{m.id === otazka.spravna ? '✓' : ''}</span>
              <span class="zustalo__text">{@html radek(m.text)}</span>
              {#if m.id === volba}<span class="vizualne-skryte">{' (tvoje odpověď)'}</span>{/if}
              {#if m.id === otazka.spravna}<span class="vizualne-skryte">{' (správná odpověď)'}</span>{/if}
            </li>
          {/each}
        </ul>
      {/if}
    </RamAktivity>
  {/if}
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
{/if}

<style>
  .zustalo__postup { margin: 0 0 var(--s-3); color: var(--ink-2); }
  .zustalo__postup:focus-visible, .zustalo__konec:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  /* Situace a případ čte student jako scénu: okraj tužkou vlevo ji oddělí od zadání. */
  .zustalo__podnet { margin: 0 0 var(--s-2); padding-left: var(--s-4); border-left: 2px solid var(--tuzka); }

  .zustalo__moznosti { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-3); margin: var(--s-3) 0 0; padding: 0; list-style: none; }
  @container (min-width: 520px) { .zustalo__moznosti--kratke { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  .zustalo__moznosti li { display: flex; }
  .zustalo__moznost {
    width: 100%;
    min-height: 48px;
    padding: var(--s-3) var(--s-4);
    border: 0;
    border-radius: var(--r-ovladani);
    color: var(--ink);
    font-family: var(--font-serif);
    font-size: calc(var(--meritko) * 17px);
    line-height: 1.4;
    text-align: left;
    cursor: pointer;
  }
  .zustalo__moznosti--kratke .zustalo__moznost { font-family: var(--font-sans); font-size: var(--fs-ovladani-l); font-weight: 600; text-align: center; }
  .zustalo__moznost:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

  /* Po odpovědi: možnosti leží (čtou se), zvolená je vtlačená, správná má ✓ a tučný řez. */
  .zustalo__hotova {
    display: flex;
    align-items: baseline;
    gap: var(--s-2);
    width: 100%;
    min-height: 48px;
    padding: var(--s-3) var(--s-4);
    border-radius: var(--r-ovladani);
    border: 1px dashed transparent;
    color: var(--ink-2);
    font-family: var(--font-serif);
    font-size: calc(var(--meritko) * 17px);
    line-height: 1.4;
  }
  .zustalo__moznosti--kratke .zustalo__hotova { justify-content: center; font-family: var(--font-sans); font-size: var(--fs-ovladani-l); }
  .zustalo__hotova--zvolena { box-shadow: var(--vtla); background: var(--plocha); color: var(--ink); }
  .zustalo__hotova--spravna { color: var(--ink); font-weight: 600; }
  .zustalo__hotova:not(.zustalo__hotova--zvolena):not(.zustalo__hotova--spravna) { border-color: var(--tuzka); }
  .zustalo__znacka { flex: none; min-width: 1ch; font-family: var(--font-sans); font-weight: 700; color: var(--p); }
  .zustalo__moznosti--kratke .zustalo__znacka:empty { display: none; }

  .zustalo__slovo { margin: 0 0 var(--s-2); font-family: var(--font-ruka); font-size: calc(var(--meritko) * 24px); line-height: 1.3; color: var(--ruka); }
  .zustalo__vysvetleni { margin: 0 0 var(--s-2); }
  .zustalo__zpet { margin: 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
  .zustalo__zpet a, .zustalo__zopakuj a { display: inline-block; min-height: 24px; color: var(--ink); text-decoration-color: var(--tuzka); text-decoration-thickness: 1.5px; text-underline-offset: 5px; }

  .zustalo__zopakuj { margin: var(--s-3) 0 0; padding: 0; list-style: none; }
  .zustalo__zopakuj li { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: var(--s-3); padding: var(--s-3) 0; border-top: 1px dashed var(--tuzka); }
  .zustalo__nazev { font-family: var(--font-sans); font-weight: 600; color: var(--ink); }
  .zustalo__zopakuj a { font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }

  .zustalo__akce { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: var(--s-3); }
  .zustalo__ulozeno { margin: 0; color: var(--ink-2); }

  .zustalo__pozvanka { padding: 26px 24px 20px; background: var(--list); box-shadow: var(--lezi); }
  .zustalo__pozvanka p { margin: 0; }
  .zustalo__pozvanka p + p { margin-top: var(--s-4); }
</style>
