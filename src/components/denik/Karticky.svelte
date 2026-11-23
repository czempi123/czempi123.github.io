<script lang="ts">
  // Kartičky v Můj deník (denik-v2, K3; plán › 2): hromádka na dnes (nejvýš pět), kartička s lícem a rubem podle
  // zdroje, otočení tlačítkem (i klepnutím na líc), Vím, Zopakuj si a Vyndat z kartiček, po hromádce Na dnes stačí
  // a nepovinně Ještě pět. Nikde počet čekajících, datum dalšího opakování ani zameškané dny. Bez kartiček jen
  // pozvánka s tlačítkem Přidat pojmy, které už znáš (když nějaké potkal). Logika v src/lib/karticky.ts.
  //   <Karticky denik={denik} data={karticky} stranky={stranky} />   (uvnitř Denik.svelte; deník předává živý)
  import { onMount, tick } from 'svelte';
  import { nacti, mistniDatum, ulozStavBloku, ohodnotitKarticku, vyndatKarticku, pridatKarticku, type Denik, type HodnoceniKarticky } from '../../lib/denik';
  import {
    aktualniKarticka, dalsiVHromadce, hromadkaDne, jestePet, obsahKarticky, platnaHromadka, potkanePojmy, zbyvaNaRade,
    zdrojExistuje, KLIC_HROMADKY, TEXTY_KARTICEK as T, type DataKarticek, type StavHromadky, type StrankaKarticky,
  } from '../../lib/karticky';
  import { potkaneZDeniku } from '../../lib/herna/zustalo';
  import { radek } from '../../lib/bloky';

  interface Props {
    denik: Denik;
    data: DataKarticek;
    /** název a období stránky podle adresy (odkud je citát, kde vznikl zápis) */
    stranky?: Record<string, StrankaKarticky>;
  }
  let { denik, data, stranky = {} }: Props = $props();

  let hrom = $state<StavHromadky | null>(null);
  let otoceno = $state(false);
  let licEl = $state<HTMLElement>();
  let rubEl = $state<HTMLElement>();
  let konecEl = $state<HTMLElement>();
  let obalEl = $state<HTMLElement>();

  const ex = $derived(zdrojExistuje(data));
  const potkane = $derived(potkaneZDeniku(denik));
  const maKarticky = $derived(Object.keys(denik.karticky ?? {}).length > 0);
  const kPridani = $derived(maKarticky ? [] : potkanePojmy(data, potkane, denik));
  const aktualni = $derived(hrom ? aktualniKarticka(denik, hrom, ex) : undefined);
  const obsah = $derived(aktualni && denik.karticky?.[aktualni] ? obsahKarticky(denik.karticky[aktualni], denik, data, potkane, stranky) : null);
  const dalsi = $derived(hrom ? dalsiVHromadce(denik, hrom, aktualni, ex) : false);
  const zadna = $derived(!!hrom && !aktualni && hrom.klice.length === 0);
  const zbyva = $derived(!!hrom && !aktualni && !zadna && zbyvaNaRade(denik, hrom, ex));

  onMount(() => {
    zacni();
    // Kartička přidaná na téže stránce (sbírka, lístek zápisu) se do menší dnešní hromádky doplní hned.
    window.addEventListener('atlas-denik', zacni);
    return () => window.removeEventListener('atlas-denik', zacni);
  });

  /** Dnešní hromádka z deníku (nebo nová); uloží se jen, když se změnila. */
  function zacni() {
    const d = nacti();
    const ulozena = platnaHromadka(d.bloky?.[KLIC_HROMADKY]);
    const h = hromadkaDne(d, mistniDatum(), ulozena, ex);
    hrom = h;
    // Kdo kartičky nemá, tomu se do deníku nic nezapisuje.
    if (Object.keys(d.karticky ?? {}).length && JSON.stringify(h) !== JSON.stringify(ulozena)) ulozStavBloku(KLIC_HROMADKY, h);
  }

  async function otoc() {
    if (otoceno) return;
    otoceno = true;
    await tick();
    rubEl?.focus();
  }
  /** Po hodnocení nebo vyndání přijde další kartička líc nahoru (nebo Na dnes stačí). */
  async function dalsiKarticka() {
    otoceno = false;
    await tick();
    (licEl ?? konecEl ?? obalEl)?.focus();
  }
  function hodnot(h: HodnoceniKarticky) {
    if (!aktualni) return;
    ohodnotitKarticku(aktualni, h);
    dalsiKarticka();
  }
  function vyndat() {
    if (!aktualni) return;
    vyndatKarticku(aktualni);
    dalsiKarticka();
  }
  function pet() {
    if (!hrom) return;
    hrom = jestePet(nacti(), hrom, ex);
    ulozStavBloku(KLIC_HROMADKY, hrom);
    dalsiKarticka();
  }
  async function pridatPojmy() {
    for (const id of kPridani) pridatKarticku('pojem', id);
    zacni();
    await tick();
    (licEl ?? obalEl)?.focus();
  }
</script>

{#if maKarticky || kPridani.length}
  <section class="karticky" aria-labelledby="karticky-n" tabindex="-1" bind:this={obalEl}>
    <h2 class="t-h3 karticky__nadpis" id="karticky-n">{T.nadpis}</h2>
    {#if !maKarticky}
      <p class="karticky__text">{T.prazdne}</p>
      <div class="blok__akce"><button class="blok__tl blok__tl--vedlejsi" type="button" onclick={pridatPojmy}>{T.pridatPojmy}</button></div>
    {:else if obsah}
      {@const o = obsah}
      <p class="t-popisek karticky__uvod">{T.uvod}</p>
      <div class={['hromadka', { 'hromadka--dalsi': dalsi }]}>
        <div class={['karta', o.obdobi ? `obdobi-${o.obdobi}` : 'bez-obdobi', `karta--${o.zdroj}`]} data-klic={o.klic}>
          {#if !otoceno}
            <!-- Líc jde otočit i klepnutím; klávesnice a čtečka mají tlačítko Otočit. -->
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
            <div class="karta__strana karta__lic" role="group" aria-label={`Kartička, líc: ${o.nadtitulek}`} tabindex="-1" bind:this={licEl} onclick={otoc}>
              <p class="karta__nad">{o.nadtitulek}</p>
              {#if o.lic.nazev}<p class="karta__nazev">{o.lic.nazev}</p>{/if}
              {#if o.lic.pod}<p class="t-popisek karta__pod">{o.lic.pod}</p>{/if}
              {#each o.lic.odstavce as odst, i (i)}<p class="karta__podnet">{@html radek(odst)}</p>{/each}
              <p class="karta__otazka">{o.lic.otazka}</p>
              <div class="blok__akce"><button class="blok__tl blok__tl--hlavni" type="button" onclick={otoc}>{T.otocit}</button></div>
            </div>
          {:else}
            <div class="karta__strana karta__rub" role="group" aria-label={`Kartička, rub: ${o.nadtitulek}`} tabindex="-1" bind:this={rubEl}>
              <p class="karta__nad">{o.nadtitulek}</p>
              {#if o.lic.nazev}<p class="karta__nazev karta__nazev--rub">{o.lic.nazev}</p>{/if}
              {#if o.rub.odpoved}<p class="karta__odpoved">{o.rub.odpoved}</p>{/if}
              {#if o.rub.citat}<blockquote class="karta__citat"><p>„{o.rub.citat}“</p></blockquote>{/if}
              {#if o.rub.pero}<p class="karta__pero">{o.rub.pero}</p>{/if}
              {#each o.rub.odstavce as odst, i (i)}<p class="karta__text">{@html radek(odst)}</p>{/each}
              {#if o.rub.dotaz}<p class="karta__otazka">{o.rub.dotaz}</p>{/if}
              {#if o.rub.zpet}<p class="karta__zpet"><a href={o.rub.zpet.href}>{@html radek(o.rub.zpet.text)}</a></p>{/if}
              <div class="blok__akce">
                <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={() => hodnot('vim')}>{T.vim}</button>
                <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={() => hodnot('zopakuj')}>{T.zopakuj}</button>
                <button class="blok__tl blok__tl--tiche" type="button" onclick={vyndat}>{T.vyndat}</button>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {:else if zadna}
      <p class="karticky__text" tabindex="-1" bind:this={konecEl}>{T.zadna}</p>
    {:else if hrom}
      <p class="karticky__text karticky__stacilo" tabindex="-1" bind:this={konecEl}>{T.stacilo}</p>
      {#if zbyva}<div class="blok__akce"><button class="blok__tl blok__tl--tiche" type="button" onclick={pet}>{T.jestePet}</button></div>{/if}
    {/if}
  </section>
{/if}

<style>
  .karticky { margin-top: var(--s-7); outline: none; }
  .karticky__nadpis { margin: 0 0 var(--s-3); }
  .karticky__text { margin: 0; font-size: 19px; line-height: 1.5; outline: none; }
  .karticky__stacilo { font-family: var(--font-serif); font-size: 22px; }
  .karticky .blok__akce { margin-top: var(--s-4); }
  .karticky__uvod { margin: 0 0 var(--s-4); color: var(--ink-2); }
  /* Hromádka: kartička na lístku; když za ní v dnešní hromádce leží další, vykoukne pod ní okraj druhé (bez počtu). */
  .hromadka { position: relative; isolation: isolate; max-width: 600px; }
  .hromadka--dalsi::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--listek);
    box-shadow: var(--lezi);
    translate: 7px 7px;
    rotate: calc(1.2deg * var(--natoceni));
  }
  .karta { background: var(--list); box-shadow: var(--lezi); border-top: 4px solid var(--p, var(--tuzka)); }
  .karta__strana { padding: 18px 22px 16px; outline: none; }
  .karta__lic { cursor: pointer; }
  .karta__strana p { margin: 0 0 var(--s-2); }
  .karta__nad { font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .karta__nazev { font-family: var(--font-serif); font-weight: 500; font-size: 26px; line-height: 1.2; color: var(--ink); }
  .karta__nazev--rub { font-size: 19px; }
  .karta__pod { color: var(--ink-2); }
  .karta__podnet, .karta__text { font-size: 19px; line-height: 1.5; }
  .karta__otazka { margin-top: var(--s-3) !important; font-family: var(--font-sans); font-weight: 600; font-size: var(--fs-ovladani); }
  .karta__odpoved { font-family: var(--font-serif); font-weight: 600; font-size: 21px; line-height: 1.35; }
  .karta__citat { margin: 0; }
  .karta__citat p { font-family: var(--font-serif); font-size: 20px; line-height: 1.45; }
  /* Co student napsal, jeho perem. */
  .karta__pero { font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--pero); white-space: pre-line; overflow-wrap: anywhere; }
  .karta__zpet a { display: inline-flex; align-items: center; min-height: var(--dotyk); color: var(--ink); text-decoration-color: var(--tuzka); text-underline-offset: 4px; }
  .karta .blok__akce { margin-top: var(--s-3); }
  /* Otočení: rub se po stisku přetočí k divákovi; při omezeném pohybu je tam hned. */
  .karta__rub {
    animation-name: karta-otoceni;
    animation-duration: var(--d-listek);
    animation-timing-function: var(--k-papir);
    transform-origin: 50% 50%;
  }
  @keyframes karta-otoceni {
    from { transform: perspective(1200px) rotateY(-75deg); opacity: .3; }
    to { transform: none; opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .karta__rub { animation: none; }
  }
  @media (max-width: 699px) {
    .karta__strana { padding: 16px 16px 12px; }
    .karta__nazev { font-size: 23px; }
  }
</style>
