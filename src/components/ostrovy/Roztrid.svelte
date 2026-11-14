<script lang="ts">
  // Roztřiď v rámu aktivity (K4b; plátno Herna.dc.html › Roztřiď): koše jsou papírové kapsy. Karta navrchu je ležící
  // lístek; student ji přetáhne do kapsy (myší i prstem), klepne na kapsu, nebo u kapsy zvolí „Dát sem“ (i klávesnicí).
  // Karta se zvedne a zasune za čelo kapsy, kus z ní kouká (--d-presun); klepnutím ji vrátí navrch. Smí přidat vlastní
  // karty. Po roztřídění dostane ke kartám zpětnou vazbu a srovnání na lístku; nic se neboduje a žádný koš není „správně“.
  // Použití v MDX (obsah v src/content/bloky/cesta6-tri-kose.yaml):
  // <Roztrid id="cesta6-tri-kose" />
  import { VYCHOZI_NADTITULKY } from '../../lib/nadtitulky';
  import { onMount, tick } from 'svelte';
  import { ulozZapis, smazZapis, stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import {
    kartyRoztrid, hromadkaRoztrid, kartyVKosi, idVlastniKarty, textVlastniKarty, zpetnaKarty, zapisRoztrid, platnyStavRoztrid,
    odstavce, radek, DELKA_KARTY, type KartaRoztrid, type StavRoztrid,
  } from '../../lib/bloky';
  import type { TBlokRoztrid } from '../../lib/bloky-schema';
  import { prelet } from '../../lib/pohyb';
  import RamAktivity from './RamAktivity.svelte';
  import BlokFilozof from './BlokFilozof.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { ClovekBloku, Dal } from './bloky-typy';

  interface Props {
    id: string;
    blok: Omit<TBlokRoztrid, 'zdroje' | 'kOvereni' | 'dal'>;
    /** filozof ze srovnání (jméno, období a atribut z dat) */
    filozof?: ClovekBloku;
    odkaz: string;
    /** Kam dál po roztřídění */
    dal?: Dal;
  }
  let { id, blok, filozof, odkaz, dal }: Props = $props();

  let umisteni = $state<Record<string, string>>({});
  let vlastni = $state<StavRoztrid['vlastni']>([]);
  let hotovo = $state(false);
  /** karta, kterou student vzal zpět z koše: jde navrch před ostatní */
  let vybrana = $state<string | null>(null);
  let nova = $state('');
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();
  /** výsledek vznikl činem studenta teď: lístek se rozloží (po obnovení stránky leží) */
  let cerstve = $state(false);

  let karty = $derived(kartyRoztrid(blok, vlastni));
  let hromadka = $derived(hromadkaRoztrid(karty, umisteni));
  let aktivni = $derived<KartaRoztrid | null>(hromadka.find((k) => k.id === vybrana) ?? hromadka[0] ?? null);
  let smiPridat = $derived(!!blok.vlastni && vlastni.length < blok.vlastni.pocet);
  const nazevKose = (kos: string) => blok.kose.find((k) => k.id === kos)?.nazev ?? '';

  onMount(() => {
    const s = platnyStavRoztrid(stavBloku(id), blok);
    if (s) ({ umisteni, vlastni, hotovo } = s);
  });

  function ulozStav() {
    if (!Object.keys(umisteni).length && !vlastni.length) return smazStavBloku(id);
    ulozStavBloku(id, { umisteni, vlastni, hotovo }, { odkaz, otazka: blok.otazka, druh: 'roztrid', hotovo });
  }
  const prvek = (vyber: string) => document.getElementById(id)?.querySelector<HTMLElement>(vyber);

  /** odkud: kde karta byla (tažená, nebo navrchu), aby přejela do kapsy */
  async function dej(kos: string, odkud?: DOMRect) {
    const k = aktivni;
    if (!k || hotovo) return;
    odkud ??= prvek('.stul .karta')?.getBoundingClientRect();
    umisteni = { ...umisteni, [k.id]: kos };
    vybrana = null;
    ulozStav();
    const dalsi = aktivni;
    hlaseni = `„${k.text}“ je v koši ${nazevKose(kos)}. ${dalsi ? `Další karta: „${dalsi.text}“.` : 'Všechny karty jsou roztříděné.'}`;
    await tick();
    prelet(prvek(`[data-karta="${k.id}"]`), odkud);
    // Tlačítka „Dát sem“ s poslední kartou zmizí; fokus nesmí zůstat viset.
    if (!dalsi && !document.getElementById(id)?.contains(document.activeElement)) prvek('.roztrid__hotovo')?.focus();
  }

  async function vrat(karta: KartaRoztrid) {
    if (hotovo) return;
    const kos = umisteni[karta.id];
    const odkud = prvek(`[data-karta="${karta.id}"]`)?.getBoundingClientRect();
    const { [karta.id]: _pryc, ...zbytek } = umisteni;
    umisteni = zbytek;
    vybrana = karta.id;
    ulozStav();
    hlaseni = `„${karta.text}“ je zpátky navrchu.`;
    await tick();
    prelet(prvek('.stul .karta'), odkud);
    prvek(`[data-kos="${kos}"] .kos__sem`)?.focus();
  }

  async function pridej(e: SubmitEvent) {
    e.preventDefault();
    const text = textVlastniKarty(nova);
    if (!text || !smiPridat) return;
    const karta = { id: idVlastniKarty(vlastni), text };
    vlastni = [...vlastni, karta];
    vybrana = karta.id;
    nova = '';
    ulozStav();
    hlaseni = `Přidáno: „${text}“. Vyber pro ni koš.`;
    await tick();
    prvek('.kos__sem')?.focus();
  }

  function smazVlastni(karta: KartaRoztrid) {
    vlastni = vlastni.filter((k) => k.id !== karta.id);
    const { [karta.id]: _pryc, ...zbytek } = umisteni;
    umisteni = zbytek;
    vybrana = null;
    ulozStav();
    hlaseni = `Karta „${karta.text}“ je smazaná.`;
  }

  /** Klepnutí kamkoli do kapsy (myš, prst) dá kartu do ní; klávesnice má tlačítko Dát sem. */
  function klepDoKapsy(e: MouseEvent, kos: string) {
    if (!aktivni || (e.target as Element).closest('button, a, input')) return;
    dej(kos);
  }

  async function porovnej() {
    if (hromadka.length) return;
    hotovo = true;
    cerstve = true;
    ulozStav();
    ulozZapis({ id, otazka: blok.otazka, odpoved: zapisRoztrid(blok, { umisteni, vlastni }), odkaz, druh: 'roztrid' });
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    umisteni = {};
    vlastni = [];
    hotovo = false;
    cerstve = false;
    vybrana = null;
    nova = '';
    hlaseni = '';
    smazStavBloku(id);
    smazZapis(id);
    await tick();
    prvek('.kos__sem')?.focus();
  }

  // ── Tažení karty navrchu (myš i prst); klávesnici a klepnutí obstará „Dát sem“ ──
  let tah = $state<{ x: number; y: number } | null>(null);
  let nad = $state<string | null>(null);
  let start: { x: number; y: number } | null = null;
  const PRAH = 6;

  function kosPod(x: number, y: number): string | null {
    for (const e of document.getElementById(id)?.querySelectorAll<HTMLElement>('[data-kos]') ?? []) {
      const r = e.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return e.dataset.kos ?? null;
    }
    return null;
  }
  function stisk(e: PointerEvent) {
    if (e.button !== 0 || !aktivni) return;
    start = { x: e.clientX, y: e.clientY };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* syntetická událost bez ukazatele */ }
  }
  function pohyb(e: PointerEvent) {
    if (!start) return;
    const x = e.clientX - start.x;
    const y = e.clientY - start.y;
    if (!tah && Math.hypot(x, y) < PRAH) return;
    tah = { x, y };
    nad = kosPod(e.clientX, e.clientY);
  }
  function pusteni(e: PointerEvent) {
    if (!start) return;
    const cil = tah && e.type === 'pointerup' ? kosPod(e.clientX, e.clientY) : null;
    const odkud = cil ? (e.currentTarget as HTMLElement).getBoundingClientRect() : undefined;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* už uvolněno */ }
    start = null;
    tah = null;
    nad = null;
    if (cil) dej(cil, odkud);
  }
</script>

{#snippet vysledek()}
  <div class={['vysledky', blok.kose.length > 3 && 'vysledky--ctyri']} style={`--kosu: ${blok.kose.length}`}>
    {#each blok.kose as k (k.id)}
      {@const vKosi = kartyVKosi(karty, umisteni, k.id)}
      <div class="vysledek">
        <h4 class="blok__zpetna-titulek">{k.nazev}{#if !vKosi.length}: nic{/if}</h4>
        {#if vKosi.length}
          <ul class="vysledek__karty">
            {#each vKosi as c (c.id)}
              {@const z = zpetnaKarty(blok, c, k.id)}
              <li>
                <p class={['vysledek__karta', c.vlastni && 'vysledek__karta--vlastni']}>{c.text}</p>
                {#if z}{#each odstavce(z) as o, j (j)}<p class="vysledek__zpetna">{@html o}</p>{/each}{/if}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
  </div>
  {#if blok.srovnani}
    {#if filozof}
      <BlokFilozof {filozof} nadpis={blok.srovnani.nadpis}>
        {#each odstavce(blok.srovnani.text) as o, i (i)}<p>{@html o}</p>{/each}
      </BlokFilozof>
    {:else}
      <div class="blok__oddil">
        <h4 class="blok__zpetna-titulek">{blok.srovnani.nadpis}</h4>
        {#each odstavce(blok.srovnani.text) as o, i (i)}<p>{@html o}</p>{/each}
      </div>
    {/if}
  {/if}
{/snippet}

{#snippet akce()}
  {#if !hotovo}
    <button class="blok__tl blok__tl--hlavni roztrid__hotovo" type="button" onclick={porovnej} disabled={hromadka.length > 0}>Mám roztříděno</button>
  {:else}
    <BlokDal {dal} />
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="roztrid"
  nadtitulek={blok.nadtitulek ?? VYCHOZI_NADTITULKY.Roztrid}
  lide={filozof ? [filozof] : []}
  labelledby={`${id}-otazka`}
  vazba={hotovo ? vysledek : undefined}
  vazbaPopisek="Tvoje třídění"
  {cerstve}
  bind:vazbaPrvek={oblast}
  ulozeno={hotovo ? 'Tvoje třídění je uložené v deníku.' : undefined}
  znovu={hotovo ? znovu : undefined}
  hlavni={!hotovo || dal ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  {#if !hotovo}
    <div class="stul" data-cast="moznosti">
      {#if aktivni}
        <p class="stul__postup t-popisek">Zbývá {hromadka.length} z {karty.length}</p>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class={['karta', tah && 'karta--tazena']}
          style={tah ? `transform: translate(${tah.x}px, ${tah.y}px)` : undefined}
          onpointerdown={stisk}
          onpointermove={pohyb}
          onpointerup={pusteni}
          onpointercancel={pusteni}
        >
          <svg class="karta__uchyt" width="12" height="20" viewBox="0 0 12 20" aria-hidden="true" focusable="false">
            <circle cx="3" cy="4" r="1.6" /><circle cx="9" cy="4" r="1.6" /><circle cx="3" cy="10" r="1.6" /><circle cx="9" cy="10" r="1.6" /><circle cx="3" cy="16" r="1.6" /><circle cx="9" cy="16" r="1.6" />
          </svg>
          <span class="karta__text">{aktivni.text}</span>
        </div>
        <p class="stul__napoveda">Přetáhni kartu do kapsy, nebo u kapsy zvol Dát sem.</p>
        {#if aktivni.vlastni}
          <button class="blok__tl blok__tl--tiche stul__smazat" type="button" onclick={() => smazVlastni(aktivni)}>Smazat tuhle kartu</button>
        {/if}
      {:else}
        <p class="stul__prazdny">Všechno je roztříděné. Kartu vrátíš klepnutím na ni.</p>
      {/if}
    </div>

    <ul data-cast="moznosti" class={['kose', blok.kose.length > 3 && 'kose--ctyri', aktivni && 'kose--ceka']} style={`--kosu: ${blok.kose.length}`}>
      {#each blok.kose as k (k.id)}
        {@const vKosi = kartyVKosi(karty, umisteni, k.id)}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
        <li class={['kos', nad === k.id && 'kos--nad']} data-kos={k.id} onclick={(e) => klepDoKapsy(e, k.id)}>
          <div class="kos__usti">
            {#if vKosi.length}
              <ul class="kos__karty" aria-label={`V koši ${k.nazev}`}>
                {#each vKosi as c, j (c.id)}
                  <li style={`--nat: ${[-1.4, 1, -.6, 1.3, -1, .7][j % 6]}deg`}>
                    <button class="zeton" type="button" data-karta={c.id} onclick={() => vrat(c)}>
                      <span class={[c.vlastni && 'zeton__vlastni']}>{c.text}</span>
                      <svg width="16" height="16" aria-hidden="true" focusable="false"><use href="/ikony/ui.svg#zavrit" /></svg>
                      <span class="vizualne-skryte">(vzít zpět z koše {k.nazev})</span>
                    </button>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
          <div class="kos__celo">
            <div class="kos__hlava">
              <div>
                <h4 class="kos__nazev">{k.nazev}</h4>
                {#if k.popis}<p class="kos__popis">{@html radek(k.popis)}</p>{/if}
              </div>
              {#if aktivni}
                <button class="kos__sem" type="button" onclick={() => dej(k.id)}>
                  Dát sem<span class="vizualne-skryte">kartu „{aktivni.text}“ do koše {k.nazev}</span>
                </button>
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
    <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>

    {#if smiPridat && blok.vlastni}
      <form class="vlastni" data-cast="duvod" onsubmit={pridej}>
        <label class="blok__popis" for={`${id}-vlastni`}>{blok.vlastni.vyzva} <span class="nepovinne">Nepovinné</span></label>
        <div class="vlastni__radek">
          <input class="vlastni__pole" id={`${id}-vlastni`} type="text" maxlength={DELKA_KARTY} bind:value={nova} autocomplete="off" />
          <button class="blok__tl blok__tl--vedlejsi" type="submit" disabled={!textVlastniKarty(nova)}>Přidat kartu</button>
        </div>
      </form>
    {/if}
  {/if}
</RamAktivity>

<style>
  .stul { margin: var(--s-5) 0 var(--s-5); }
  .stul__postup { margin: 0 0 var(--s-3); color: var(--ink-2); }
  .stul__napoveda { margin: var(--s-3) 0 0; font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .stul__prazdny { margin: 0; padding: var(--s-4); border: 1.5px dashed var(--tuzka); color: var(--ink-2); font-family: var(--font-sans); font-size: var(--fs-ovladani); }
  .stul__smazat { margin-top: var(--s-2); }
  /* Karta navrchu: ležící lístek. Po stisku se zvedne a obrys dostane barvu pera (D5); tažení vede prst. */
  .karta {
    position: relative;
    z-index: 6;
    display: flex;
    align-items: center;
    gap: var(--s-3);
    max-width: 440px;
    min-height: 64px;
    padding: var(--s-3) var(--s-4);
    background: var(--list);
    box-shadow: var(--lezi);
    rotate: -1deg;
    font-size: var(--fs-perex);
    line-height: 1.3;
    color: var(--ink);
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    /* Kartu vede prst; stránka se posouvá všude kolem ní. */
    touch-action: none;
    transition: rotate var(--d-stisk) var(--k-stisk), box-shadow var(--d-stisk) var(--k-stisk);
  }
  .karta:active, .karta--tazena { rotate: 0deg; box-shadow: var(--lezi-zved); outline: 2px solid var(--pero); outline-offset: 3px; cursor: grabbing; }
  .karta__uchyt { flex: none; fill: var(--tuzka); }

  /* Kapsy se řídí šířkou bloku, ne obrazovky: v kroku cesty je blok široký až 960 px, v čtenářském sloupci profilu 680 px.
     Vedle sebe stojí, když na každou vyjde aspoň asi 210 px (název a tlačítko Dát sem vedle sebe). V profilu jsou
     proto dvě nebo tři kapsy pod sebou jako na telefonu a čtyři po dvou. */
  .kose { display: grid; gap: var(--s-5) var(--s-4); margin: 0 0 var(--s-5); padding: 0; list-style: none; }
  @container (min-width: 620px) {
    .kose--ctyri { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: end; }
  }
  @container (min-width: 660px) {
    .kose:not(.kose--ctyri) { grid-template-columns: repeat(var(--kosu), minmax(0, 1fr)); align-items: end; }
  }
  @container (min-width: 860px) {
    .kose--ctyri { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
  /* Kapsa: vtlačené ústí, ve kterém karty stojí, a před ním papírové čelo s výřezem do V, za které se karty zasunou. */
  .kos { position: relative; isolation: isolate; display: flex; flex-direction: column; }
  .kose--ceka .kos { cursor: pointer; }
  .kos__usti {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 84px;
    padding: var(--s-3) var(--s-3) 34px;
    border-radius: 6px 6px 0 0;
    background: var(--papir);
    box-shadow: var(--vtla);
  }
  /* Kapsa čeká na kartu (najetí, tažení nad ní): čárkovaný okraj tužkou uvnitř ústí. */
  .kos__usti::after { content: ''; position: absolute; inset: 5px; border-radius: 4px; border: 1.5px dashed var(--tuzka); opacity: 0; transition: opacity var(--d-stisk) var(--k-stisk); pointer-events: none; }
  @media (hover: hover) { .kose--ceka .kos:hover .kos__usti::after { opacity: 1; } }
  .kos--nad .kos__usti::after { opacity: 1; border-color: var(--ink); }
  .kos__celo { position: relative; z-index: 2; margin-top: -30px; filter: var(--odlep); }
  .kos__celo::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--plocha); clip-path: polygon(0 0, 50% 16px, 100% 0, 100% 100%, 0 100%); }
  .kos__hlava { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--s-3); padding: 24px var(--s-3) var(--s-3); }
  .kos__nazev { margin: 0; font-family: var(--font-sans); font-size: var(--fs-ovladani-l); font-weight: 600; line-height: var(--lh-ovladani-l); }
  .kos__popis { margin: var(--s-1) 0 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); line-height: 1.35; color: var(--ink-2); }
  /* „Dát sem“ je tlačítko pro klávesnici; myš a prst mohou klepnout kamkoli do kapsy. Fokus ukáže celou kapsu. */
  .kos__sem {
    flex: none;
    min-height: 44px;
    padding: 0 var(--s-3);
    border: 1.5px solid var(--ink);
    border-radius: var(--r-ovladani);
    background: transparent;
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 600;
    cursor: pointer;
    /* Fokus z klávesnice ukáže celou kapsu, ne jen tlačítko nad spodní lištou. */
    scroll-margin-bottom: 56px;
  }
  .kos__sem:focus-visible { outline: none; }
  .kos:has(.kos__sem:focus-visible) { outline: 2px solid var(--ink); outline-offset: 3px; }
  /* Karty v kapse stojí za čelem: spodní kus zakrývá čelo, nahoře koukají. */
  .kos__karty { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
  .kos__karty li { rotate: var(--nat, 0deg); }
  .zeton {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--s-2);
    width: 100%;
    min-height: 44px;
    padding: var(--s-2) var(--s-3);
    border: 0;
    background: var(--list);
    box-shadow: var(--lezi-tlak);
    color: var(--ink);
    font-family: var(--font-serif);
    font-size: var(--fs-ovladani-l);
    line-height: 1.25;
    text-align: left;
    cursor: pointer;
    transition: translate var(--d-stisk) var(--k-stisk);
  }
  @media (hover: hover) { .zeton:hover { translate: 0 -3px; box-shadow: var(--lezi); } }
  .zeton:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .zeton svg { flex: none; margin-top: 2px; color: var(--ink-3); }

  .vlastni { margin-bottom: var(--s-5); }
  .vlastni__radek { display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--s-3); }
  .vlastni__pole {
    flex: 1 1 220px;
    min-width: 0;
    min-height: 48px;
    padding: 0 var(--s-1);
    border: 0;
    border-bottom: 1.5px solid var(--tuzka);
    border-radius: 0;
    background: transparent;
    color: var(--pero);
    font-family: var(--font-ruka);
    font-size: calc(var(--meritko) * 19px);
  }
  .vlastni__pole:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; border-bottom-color: var(--ink); }
  /* Popisek se na telefonu láme; „Nepovinné“ pak stojí na novém řádku od kraje, ne odsazené. */
  .vlastni .blok__popis { display: flex; flex-wrap: wrap; column-gap: var(--s-2); }
  .nepovinne { font-weight: 400; color: var(--ink-3); }

  /* Výsledek na lístku drží rozložení kapes: na telefonu pod sebou, na notebooku vedle sebe. */
  .vysledky { display: grid; gap: var(--s-4); }
  .vysledek + .vysledek { padding-top: var(--s-4); border-top: 1px dashed var(--tuzka); }
  @container (min-width: 660px) {
    .vysledky:not(.vysledky--ctyri) { grid-template-columns: repeat(var(--kosu), minmax(0, 1fr)); gap: var(--s-5); }
    .vysledky:not(.vysledky--ctyri) .vysledek + .vysledek { padding-top: 0; padding-left: var(--s-5); border-top: 0; border-left: 1px dashed var(--tuzka); }
  }
  @container (min-width: 860px) {
    .vysledky--ctyri { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s-5); }
    .vysledky--ctyri .vysledek + .vysledek { padding-top: 0; padding-left: var(--s-5); border-top: 0; border-left: 1px dashed var(--tuzka); }
  }
  :global(.roztrid) :global(.blok__oddil p) { max-width: var(--ctenarsky-sloupec); }
  .vysledek__karty { margin: 0; padding: 0; list-style: none; display: grid; gap: var(--s-3); }
  .vysledek__karta { margin: 0 0 var(--s-1); font-style: italic; color: var(--ink); }
  /* Vlastní karta je studentova: jeho perem. */
  .vysledek__karta--vlastni, .zeton__vlastni { font-family: var(--font-ruka); font-style: normal; color: var(--pero); }
  .vysledek__zpetna { margin: 0 0 var(--s-1); font-family: var(--font-sans); font-size: var(--fs-ovladani); line-height: var(--lh-ovladani); color: var(--ink-2); }
</style>
