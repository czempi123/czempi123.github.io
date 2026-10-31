<script lang="ts">
  // Slož argument: student seřadí premisy a závěr do řádků „1“, „2“ a „Závěr“. Kartu přesune klepnutím
  // (vybere kartu, pak řádek), tažením (myší i prstem) nebo klávesnicí (Enter na kartě, Enter na řádku, Escape
  // výběr zruší). Po Zkontrolovat zpětná vazba popíše, co složil, a ptá se, co argumentu chybí; tlačítko
  // „Ukázat chybějící větu“ pak odkryje skrytý předpoklad (řádek s otazníkem) a volbu „Kterou premisu bys
  // napadl ty?“ s nepovinným důvodem (bez něj s bezDuvodu): to je názor, jde do deníku. Kde se dá argument
  // napadnout a zvýrazněný řádek přijdou až po volbě, aby student nevolil podle zvýraznění. Nic se neboduje.
  // Použití v MDX (obsah v src/content/bloky/dilna-sokrates-zemre.yaml):
  // <SlozArgument id="dilna-sokrates-zemre" />
  import { VYCHOZI_NADTITULKY } from '../../lib/nadtitulky';
  import { onMount, tick } from 'svelte';
  import { crossfade } from 'svelte/transition';
  import { ulozZapis, smazZapis, stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import {
    radkyArgumentu, nazevRadku, doRadku, volneKarty, poloz, vrat, jeSlozeno, vyhodnot, zpetnaArgumentu, hlaseniPolozeni,
    moznostiNapadeni, napadnutelne, zapisArgumentu, platnyStavArgumentu, radekKarty, ZAVER, OTAZKA_NAPADENI, otazkaZapisu,
    type Rozlozeni, type Karta,
  } from '../../lib/argument';
  import { ID_SKRYTY, type TBlokArgument } from '../../lib/bloky-schema';
  import { odstavce, radek } from '../../lib/bloky';
  import { odkryti, omezenyPohyb } from '../../lib/pohyb';
  import BlokHlava from './BlokHlava.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { Dal } from './bloky-typy';

  interface Props {
    id: string;
    blok: Omit<TBlokArgument, 'zdroje' | 'kOvereni' | 'dal'>;
    odkaz: string;
    /** Kam dál po volbě */
    dal?: Dal;
  }
  let { id, blok, odkaz, dal }: Props = $props();

  let roz = $state<Rozlozeni>({});
  let vybrana = $state<string | null>(null);
  let zkontrolovano = $state(false);
  let odkryto = $state(false);
  let napadnout = $state<string | null>(null);
  let proc = $state('');
  let zapsano = $state(false);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();
  let oblastVolby = $state<HTMLElement>();
  let oblastSkryty = $state<HTMLElement>();

  let radky = $derived(radkyArgumentu(blok));
  let premisy = $derived(radky.filter((r) => r !== ZAVER));
  let volne = $derived(volneKarty(blok, roz));
  let slozeno = $derived(jeSlozeno(blok, roz));
  let zpetna = $derived(zkontrolovano ? zpetnaArgumentu(blok, roz) : null);
  let moznosti = $derived(moznostiNapadeni(blok));
  let slabe = $derived(napadnutelne(blok));
  let zvolena = $derived(moznosti.find((m) => m.id === napadnout) ?? null);
  const karta = (kid: string | undefined) => blok.karty.find((k) => k.id === kid);
  const textKarty = (kid: string | null) => (kid ? karta(kid)?.text ?? '' : '');

  // Karta se při přesunu posune na své místo; při omezeném pohybu skočí.
  const [odjezd, prijezd] = crossfade({ duration: () => (omezenyPohyb() ? 0 : 220), fallback: () => ({ duration: 0 }) });

  onMount(() => {
    const s = platnyStavArgumentu(stavBloku(id), blok);
    if (s) ({ rozlozeni: roz, zkontrolovano, odkryto, napadnout, proc, zapsano } = s);
  });

  const meta = () => ({ odkaz, otazka: blok.otazka, druh: 'argument' as const, hotovo: zapsano });
  function ulozStav() {
    if (!Object.keys(roz).length && !zkontrolovano) return smazStavBloku(id);
    ulozStavBloku(id, { rozlozeni: roz, zkontrolovano, odkryto, napadnout, proc, zapsano }, meta());
  }
  const prvek = (vyber: string) => document.getElementById(id)?.querySelector<HTMLElement>(vyber);

  /** Klávesnice (click bez ukazatele má detail 0): fokus jde dál za studentem. */
  const zKlavesnice = (e?: MouseEvent) => !!e && e.detail === 0;

  async function vyber(kid: string, e?: MouseEvent) {
    if (zkontrolovano) return;
    if (poTahu) { poTahu = false; return; }
    vybrana = vybrana === kid ? null : kid;
    hlaseni = vybrana ? `Vybráno: „${textKarty(kid)}“. Vyber řádek.` : 'Výběr zrušen.';
    if (vybrana && zKlavesnice(e)) {
      await tick();
      const prazdny = radky.find((r) => !roz[r] && radekKarty(roz, kid) !== r);
      prvek(`[data-radek="${prazdny ?? radky.find((r) => radekKarty(roz, kid) !== r)}"] .radek__sem`)?.focus();
    }
  }

  async function dejDo(r: string, kid = vybrana, e?: MouseEvent) {
    if (!kid || zkontrolovano) return;
    const { rozlozeni, vymenena } = poloz(roz, kid, r);
    roz = rozlozeni;
    vybrana = null;
    ulozStav();
    hlaseni = hlaseniPolozeni(blok, kid, r, vymenena, rozlozeni);
    if (!e || zKlavesnice(e)) await dalsiFokus();
  }

  async function vratMeziKarty(kid = vybrana, e?: MouseEvent) {
    if (!kid || zkontrolovano) return;
    roz = vrat(roz, kid);
    vybrana = null;
    ulozStav();
    hlaseni = `„${textKarty(kid)}“ je zpátky mezi kartami.`;
    if (!e || zKlavesnice(e)) {
      await tick();
      prvek(`[data-karta="${kid}"]`)?.focus();
    }
  }

  async function dalsiFokus() {
    await tick();
    if (volne.length) prvek(`[data-karta="${volne[0].id}"]`)?.focus();
    else prvek('.argument__zkontrolovat')?.focus();
  }

  async function zkontroluj() {
    if (!slozeno) return;
    zkontrolovano = true;
    vybrana = null;
    ulozStav();
    await tick();
    oblast?.focus();
  }

  async function odkryj() {
    odkryto = true;
    ulozStav();
    await tick();
    oblastSkryty?.focus();
  }

  function zmenVolbu() {
    if (napadnout) ulozStav();
  }

  async function zapis() {
    if (!napadnout) return;
    proc = blok.bezDuvodu ? '' : proc.trim();
    zapsano = true;
    ulozStav();
    ulozZapis({ id, otazka: otazkaZapisu(blok), odpoved: zapisArgumentu(blok, napadnout, proc), odkaz, druh: 'argument' });
    await tick();
    oblastVolby?.focus();
  }

  async function znovu() {
    roz = {};
    vybrana = null;
    zkontrolovano = false;
    odkryto = false;
    napadnout = null;
    proc = '';
    zapsano = false;
    hlaseni = '';
    smazStavBloku(id);
    smazZapis(id);
    await tick();
    prvek('.karta')?.focus();
  }

  function klavesa(e: KeyboardEvent) {
    if (e.key !== 'Escape' || !vybrana) return;
    const kid = vybrana;
    vybrana = null;
    hlaseni = 'Výběr zrušen.';
    tick().then(() => prvek(`[data-karta="${kid}"]`)?.focus());
  }

  // ── Tažení karty (myš i prst); klepnutí a klávesnici obstará výběr karty a řádku ──
  let tah = $state<{ kid: string; x: number; y: number } | null>(null);
  let nad = $state<string | null>(null);
  let start: { kid: string; x: number; y: number } | null = null;
  let poTahu = false;
  const PRAH = 6;

  function cilPod(x: number, y: number): string | null {
    const sekce = document.getElementById(id);
    for (const e of sekce?.querySelectorAll<HTMLElement>('[data-radek], [data-hromadka]') ?? []) {
      const r = e.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return e.dataset.radek ?? 'hromadka';
    }
    return null;
  }
  function stisk(e: PointerEvent, kid: string) {
    if (e.button !== 0 || zkontrolovano) return;
    start = { kid, x: e.clientX, y: e.clientY };
    poTahu = false;
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* syntetická událost bez ukazatele */ }
  }
  function pohyb(e: PointerEvent) {
    if (!start) return;
    const x = e.clientX - start.x;
    const y = e.clientY - start.y;
    if (!tah && Math.hypot(x, y) < PRAH) return;
    tah = { kid: start.kid, x, y };
    nad = cilPod(e.clientX, e.clientY);
  }
  function pusteni(e: PointerEvent) {
    if (!start) return;
    const kid = start.kid;
    const cil = tah && e.type === 'pointerup' ? cilPod(e.clientX, e.clientY) : null;
    poTahu = !!tah;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* už uvolněno */ }
    start = null;
    tah = null;
    nad = null;
    // Po tažení přijde ještě klepnutí (click); to výběr nezmění. Klepnutí bez tažení vybírá dál normálně.
    if (poTahu) setTimeout(() => (poTahu = false), 0);
    if (cil === 'hromadka') {
      if (radekKarty(roz, kid)) vratMeziKarty(kid, new MouseEvent('click', { detail: 1 }));
    } else if (cil) dejDo(cil, kid, new MouseEvent('click', { detail: 1 }));
  }
</script>

{#snippet kartaTl(k: Karta)}
  <button
    class={['karta', vybrana === k.id && 'karta--vybrana', tah?.kid === k.id && 'karta--tazena']}
    type="button"
    data-karta={k.id}
    aria-pressed={vybrana === k.id}
    style={tah?.kid === k.id ? `transform: translate(${tah.x}px, ${tah.y}px)` : undefined}
    onclick={(e) => vyber(k.id, e)}
    onpointerdown={(e) => stisk(e, k.id)}
    onpointermove={pohyb}
    onpointerup={pusteni}
    onpointercancel={pusteni}
    in:prijezd={{ key: k.id }}
    out:odjezd={{ key: k.id }}
  >
    <svg class="karta__uchyt" width="12" height="20" viewBox="0 0 12 20" aria-hidden="true" focusable="false">
      <circle cx="3" cy="4" r="1.6" /><circle cx="9" cy="4" r="1.6" /><circle cx="3" cy="10" r="1.6" /><circle cx="9" cy="10" r="1.6" /><circle cx="3" cy="16" r="1.6" /><circle cx="9" cy="16" r="1.6" />
    </svg>
    <span class="karta__text">{@html radek(k.text)}</span>
  </button>
{/snippet}

{#snippet radekArg(r: string)}
  {@const k = karta(roz[r])}
  <li
    class={['radek', r === ZAVER && 'radek--zaver', nad === r && 'radek--nad', zapsano && slabe.id === k?.id && 'radek--slabe']}
    data-radek={r}
  >
    <span class="radek__cislo" aria-hidden="true">{nazevRadku(r)}</span>
    <div class="radek__misto">
      {#if k}
        {#if zkontrolovano}
          <p class="karta karta--pevna"><span class="vizualne-skryte">{r === ZAVER ? 'Závěr' : `Řádek ${r}`}: </span>{@html radek(k.text)}</p>
        {:else}
          <span class="vizualne-skryte">{r === ZAVER ? 'Závěr' : `Řádek ${r}`}</span>
          {@render kartaTl(k)}
        {/if}
      {:else}
        <span class="vizualne-skryte">{r === ZAVER ? 'Závěr' : `Řádek ${r}`}, prázdný</span>
      {/if}
    </div>
    {#if vybrana && !zkontrolovano && roz[r] !== vybrana}
      <button class="radek__sem" type="button" onclick={(e) => dejDo(r, vybrana, e)}>
        Sem<span class="vizualne-skryte">dát „{textKarty(vybrana)}“ {doRadku(r)}</span>
      </button>
    {/if}
  </li>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section class="blok argument obdobi-{blok.obdobi}" id={id} aria-labelledby={`${id}-otazka`} onkeydown={klavesa}>
  <BlokHlava nadtitulek={blok.nadtitulek ?? VYCHOZI_NADTITULKY.SlozArgument} />
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  <div class={['sklad', !zkontrolovano && 'sklad--dve']} data-cast="moznosti">
    {#if !zkontrolovano}
      <div class={['hromadka', nad === 'hromadka' && 'hromadka--nad']} data-hromadka>
        <p class="hromadka__napoveda t-popisek">Vyber kartu a pak řádek, nebo ji přetáhni.</p>
        {#if volne.length}
          <ul class="hromadka__karty" aria-label="Karty">
            {#each volne as k (k.id)}<li>{@render kartaTl(k)}</li>{/each}
          </ul>
        {:else}
          <p class="hromadka__prazdna">Všechny karty leží v řádcích. Kartu přesuneš, když ji vybereš.</p>
        {/if}
        {#if vybrana && radekKarty(roz, vybrana)}
          <button class="blok__tl blok__tl--tiche hromadka__zpet" type="button" onclick={(e) => vratMeziKarty(vybrana, e)}>
            Vrátit mezi karty
          </button>
        {/if}
      </div>
    {/if}

    <ol class="radky" aria-label="Argument">
      {#each premisy as r (r)}{@render radekArg(r)}{/each}
      <li class={['radek', 'radek--skryty', odkryto && 'radek--odkryty', zapsano && slabe.id === ID_SKRYTY && 'radek--slabe']}>
        <span class="radek__cislo" aria-hidden="true">?</span>
        <div class="radek__misto">
          {#if odkryto}
            <p class="radek__skryty" in:odkryti><span class="vizualne-skryte">Skrytý předpoklad: </span>{@html radek(blok.skryty.text)}</p>
          {:else}
            <p class="radek__chybi">Jedna věta tu chybí.</p>
          {/if}
        </div>
      </li>
      {@render radekArg(ZAVER)}
    </ol>
  </div>
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>

  {#if !zkontrolovano}
    <button class="blok__tl blok__tl--hlavni argument__zkontrolovat" data-cast="akce" type="button" onclick={zkontroluj} disabled={!slozeno}>Zkontrolovat</button>
  {:else if zpetna}
    <div class="blok__zpetna" data-cast="zpetna" role="region" aria-label="Zpětná vazba" aria-live="polite" tabindex="-1" bind:this={oblast} in:odkryti>
      <p class="blok__zpetna-titulek">{zpetna.titulek}</p>
      {#each odstavce(zpetna.text) as o, i (i)}<p>{@html o}</p>{/each}
      {#if odkryto}
        <div class="blok__oddil" role="region" aria-label="Skrytý předpoklad" tabindex="-1" bind:this={oblastSkryty} in:odkryti>
          <h4 class="blok__zpetna-titulek">Skrytý předpoklad</h4>
          {#each odstavce(blok.skryty.zpetna) as o, i (i)}<p>{@html o}</p>{/each}
        </div>
      {/if}
    </div>

    {#if !odkryto}
      <button class="blok__tl blok__tl--hlavni argument__odkryt" data-cast="akce" type="button" onclick={odkryj}>Ukázat chybějící větu</button>
    {:else}
      <div class="napadeni" data-cast="moznosti">
        <h4 class="t-h3 napadeni__otazka" id={`${id}-napadeni`}>{OTAZKA_NAPADENI}</h4>
        <div class="napadeni__moznosti" role="radiogroup" aria-labelledby={`${id}-napadeni`}>
          {#each moznosti as m (m.id)}
            <label class={['moznost', napadnout === m.id && 'moznost--vybrana', zapsano && 'moznost--zamcena', zapsano && napadnout !== m.id && 'moznost--skryta']}>
              <input class="vizualne-skryte" type="radio" name={`${id}-napadeni`} value={m.id} bind:group={napadnout} onchange={zmenVolbu} disabled={zapsano} />
              {#if m.stitek}<span class="moznost__stitek">{m.stitek}</span>{/if}
              <span class="moznost__text">{@html radek(m.text)}</span>
            </label>
          {/each}
        </div>
        {#if !zapsano}
          {#if !blok.bezDuvodu}
            <label class="blok__popis" for={`${id}-proc`} data-cast="duvod">Proč právě tahle? <span class="nepovinne">Nepovinné</span></label>
            <textarea class="blok__pole blok__pole--kratke" data-cast="duvod" id={`${id}-proc`} rows="2" bind:value={proc} onchange={zmenVolbu} placeholder="Stačí pár slov…"></textarea>
          {/if}
          <button class="blok__tl blok__tl--hlavni" data-cast="akce" type="button" onclick={zapis} disabled={!napadnout}>Tohle bych napadl</button>
        {:else}
          {#if proc}<p class="tvuj-duvod" data-cast="duvod"><span class="t-popisek">Tvůj důvod:</span> {proc}</p>{/if}
          {#if zvolena}
            <div class="blok__zpetna" data-cast="zpetna" role="region" aria-label="K tvé volbě" aria-live="polite" tabindex="-1" bind:this={oblastVolby} in:odkryti>
              {#each odstavce(zvolena.zpetna) as o, i (i)}<p>{@html o}</p>{/each}
              <div class="blok__oddil" data-cast="napadnout">
                <h4 class="blok__zpetna-titulek">Kde se dá argument napadnout</h4>
                {#each odstavce(slabe.proc) as o, i (i)}<p>{@html o}</p>{/each}
              </div>
            </div>
          {/if}
        {/if}
      </div>
    {/if}

    {#if zapsano}<BlokDal {dal} />{/if}
    <div class="blok__akce" data-cast="akce">
      {#if zapsano}<p class="blok__ulozeno" data-cast="ulozeno">Tvoje volba je uložená v deníku.</p>{/if}
      <button class="blok__tl blok__tl--tiche" type="button" onclick={znovu}>Začít znovu</button>
    </div>
  {/if}
</section>

<style>
  /* Rozvržení se řídí šířkou bloku: v kroku cesty až 960 px, v čtenářském sloupci profilu 680 px, na telefonu karty nad řádky. */
  .argument { container-type: inline-size; }
  .sklad { display: grid; gap: var(--s-4); margin-bottom: var(--s-5); }
  @container (min-width: 600px) {
    .sklad--dve { grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); align-items: start; gap: var(--s-5); }
  }

  .hromadka { min-height: 64px; border-radius: var(--r-md); transition: background var(--pohyb-rychle); }
  .hromadka--nad { outline: 1.5px dashed var(--pc); outline-offset: var(--s-2); background: var(--pc-tint); }
  .hromadka__napoveda { margin: 0 0 var(--s-3); color: var(--ink-2); }
  .hromadka__karty { display: grid; gap: var(--s-3); margin: 0; padding: 0; list-style: none; }
  .hromadka__prazdna { margin: 0; padding: var(--s-3) var(--s-4); border: 1px dashed var(--muted); border-radius: var(--r-md); color: var(--ink-2); font-family: var(--font-sans); font-size: var(--fs-ovladani); line-height: var(--lh-ovladani); }
  .hromadka__zpet { margin-top: var(--s-3); }

  .karta {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: var(--s-3);
    width: 100%;
    min-height: 56px;
    margin: 0;
    padding: var(--s-2) var(--s-3);
    border: 1.5px solid var(--pc-soft);
    border-radius: var(--r-md);
    background: var(--surface);
    color: var(--ink);
    font-family: var(--font-serif);
    font-size: var(--fs-ovladani-l);
    line-height: 1.35;
    text-align: left;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    /* Kartu vede prst; stránka se posouvá všude kolem ní. */
    touch-action: none;
  }
  button.karta:hover { border-color: var(--pc); }
  .karta:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .karta--vybrana { border: 2px solid var(--pc); padding: calc(var(--s-2) - 0.5px) calc(var(--s-3) - 0.5px); background: var(--pc-tint); }
  .karta--tazena { z-index: 5; border-color: var(--ink); cursor: grabbing; box-shadow: 0 6px 18px color-mix(in srgb, var(--ink) 18%, transparent); }
  .karta--pevna { min-height: 0; padding: 0; border: 0; background: none; cursor: default; touch-action: auto; }
  .karta__uchyt { flex: none; fill: var(--pc); }
  .karta__text { flex: 1; }

  .radky { display: grid; gap: var(--s-2); margin: 0; padding: 0; list-style: none; }
  .radek {
    position: relative;
    display: grid;
    grid-template-columns: 3.75rem minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--s-2);
    min-height: 68px;
    padding: var(--s-2) var(--s-3) var(--s-2) var(--s-2);
    border: 1px dashed var(--muted);
    border-radius: var(--r-md);
    background: var(--paper);
    transition: border-color var(--pohyb-rychle), background var(--pohyb-rychle);
  }
  .radek:has(.karta) { border-style: solid; border-color: var(--rule); }
  .radek--nad, .radek--nad:has(.karta) { border: 2px solid var(--pc); padding: calc(var(--s-2) - 1px) calc(var(--s-3) - 1px) calc(var(--s-2) - 1px) calc(var(--s-2) - 1px); background: var(--pc-tint); }
  /* Závěr pod čarou, jak se argument píše v logice. */
  .radek--zaver { margin-top: var(--s-4); }
  .radek--zaver::before { content: ''; position: absolute; left: 0; right: 0; top: calc(-1 * var(--s-3) - 1px); border-top: 2px solid var(--ink); }
  .radek__cislo { font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; color: var(--pc); text-align: center; }
  .radek--zaver .radek__cislo { color: var(--ink); }
  .radek__misto { min-width: 0; }
  .radek--skryty .radek__cislo { font-family: var(--font-serif); font-size: var(--fs-h3); line-height: 1; }
  .radek__chybi { margin: 0; color: var(--ink-2); font-size: var(--fs-ovladani-l); line-height: 1.35; font-style: italic; }
  .radek--odkryty { border: 1.5px solid var(--pc); background: var(--pc-tint); }
  .radek__skryty { margin: 0; font-size: var(--fs-ovladani-l); line-height: 1.35; font-style: italic; }
  /* Místo, kde se dá argument napadnout: silnější okraj v barvě období. */
  .radek--slabe, .radek--slabe:has(.karta) { border: 2.5px solid var(--pc); }

  /* „Sem“ je tlačítko; jeho plocha pokrývá celý řádek, karta v řádku leží nad ní. */
  .radek__sem {
    flex: none;
    min-height: 44px;
    padding: 0 var(--s-3);
    border: 1.5px solid var(--ink);
    border-radius: var(--r-sm);
    background: transparent;
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 600;
    cursor: pointer;
    scroll-margin-bottom: 56px;
  }
  .radek__sem::after { content: ''; position: absolute; inset: 0; border-radius: var(--r-md); }
  .radek__sem:focus-visible { outline: none; }
  .radek:has(.radek__sem:focus-visible) { outline: 2px solid var(--ink); outline-offset: 3px; }
  .radek:has(.radek__sem:hover) { border-color: var(--pc); }

  .moznost__stitek { font-family: var(--font-sans); font-size: var(--fs-popisek); font-style: normal; font-weight: 600; letter-spacing: 0.02em; color: var(--pc); }

  .argument__odkryt { margin-top: var(--s-2); }
  .napadeni { margin-top: var(--s-6); }
  .napadeni__otazka { margin: 0 0 var(--s-4); }
  .napadeni__moznosti { display: grid; gap: var(--s-3); margin-bottom: var(--s-5); }
  .moznost {
    position: relative;
    display: grid;
    gap: var(--s-1);
    min-height: 60px;
    padding: var(--s-3) var(--s-4);
    border: 1px solid var(--rule);
    border-radius: var(--r-md);
    background: var(--paper);
    font-family: var(--font-serif);
    font-size: var(--fs-ovladani-l);
    line-height: 1.4;
    cursor: pointer;
    transition: border-color var(--pohyb-rychle), background var(--pohyb-rychle);
  }
  .moznost:hover { border-color: var(--muted); }
  .moznost:has(input:focus-visible) { outline: 2px solid var(--ink); outline-offset: 3px; }
  .moznost--vybrana { border: 2px solid var(--pc); padding: calc(var(--s-3) - 1px) calc(var(--s-4) - 1px); background: var(--pc-tint); }
  .moznost--zamcena { cursor: default; }
  .moznost--skryta { display: none; }
  .nepovinne { margin-left: var(--s-2); font-weight: 400; color: var(--muted); }
  .tvuj-duvod { margin: 0 0 var(--s-4); font-style: italic; }
</style>
