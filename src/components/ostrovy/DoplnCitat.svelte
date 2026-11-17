<script lang="ts">
  // Doplň citát (herna-v1, K2; plátno D5 › Doplň citát): věta z pramene s vtlačenou mezerou a tři vystřižená slova
  // jako ve vzkazu z novin (každé jiným písmem a na jiném papíře). Slovo jde do mezery tažením (myš i prst),
  // klepnutím, nebo z klávesnice (Tab na slovo, Enter). Nejde o to trefit slovo z paměti: u záměny lístek „zkus to
  // jinak“ s tím, co by věta s tím slovem tvrdila a čím se to liší; slovo jde kdykoli vyměnit. Se správným slovem
  // „sedí“, celý citát s místem, věta, o čem je, a co by tvrdily ostatní záměny. Do deníku jen stav (vložená slova).
  // Použití v MDX (obsah v src/content/bloky/dilna-doplnit-reka.yaml, druh: doplnit):
  // <DoplnCitat id="dilna-doplnit-reka" />
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import { platnyStavDoplnit, verdikt as verdiktHry, SEDI } from '../../lib/herna';
  import { omezenyPohyb } from '../../lib/pohyb';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { Dal } from './bloky-typy';

  interface BlokDoplnit {
    obdobi: number;
    nadtitulek: string;
    nazev: string;
    scena?: string;
    otazka: string;
    pred: string;
    po: string;
    slovo: string;
    /** lístky v pořadí podle semínka */
    listky: string[];
    zameny: { slovo: string; vazba: string }[];
    pointa: string;
    kdo: string;
    puvod: string;
  }
  interface Props { id: string; blok: BlokDoplnit; odkaz: string; dal?: Dal }
  let { id, blok, odkaz, dal }: Props = $props();

  let vlozeno = $state<string[]>([]);
  let cerstve = $state(false);
  let kolo = $state(0);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();

  const vMezere = $derived(vlozeno.at(-1));
  const hotovo = $derived(vMezere === blok.slovo);
  const zamena = $derived(!hotovo && vMezere ? blok.zameny.find((z) => z.slovo === vMezere) : undefined);
  const zkus = $derived(zamena ? verdiktHry(false, zamena.vazba) : null);
  /** Papír a písmo každého lístku podle jeho místa v balíčku (jako výstřižky z různých novin). */
  const vzhled = (slovo: string) => blok.listky.indexOf(slovo) % 3;
  const NATOCENI = [-2.2, 1.6, -1.1];

  onMount(() => {
    const s = platnyStavDoplnit(stavBloku(id), blok.listky);
    if (s) vlozeno = s.vlozeno;
  });

  async function vloz(slovo: string) {
    if (hotovo || slovo === vMezere) return;
    vlozeno = [...vlozeno, slovo];
    cerstve = true;
    const ok = slovo === blok.slovo;
    ulozStavBloku(id, { vlozeno }, { odkaz, otazka: blok.otazka, druh: 'doplnit', hotovo: ok });
    hlaseni = ok ? `${SEDI} „${blok.pred}${slovo}${blok.po}“ ${blok.kdo}.` : `Slovo „${slovo}“ je v mezeře. Zkus to jinak.`;
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    vlozeno = [];
    cerstve = false;
    hlaseni = 'Mezera je zase prázdná.';
    smazStavBloku(id);
    if (!omezenyPohyb()) kolo += 1;
    await tick();
    document.getElementById(id)?.querySelector<HTMLElement>('.vystrizek')?.focus();
  }

  // ── Tažení lístku do mezery (myš i prst); klepnutí a klávesnici obstará vloz() ──
  let tah = $state<{ slovo: string; x: number; y: number } | null>(null);
  let start: { slovo: string; x: number; y: number } | null = null;
  let potlacKlik = false;
  let nadMezerou = $state(false);
  const mezera = () => document.getElementById(id)?.querySelector<HTMLElement>('.vzkaz__mezera');
  function vMezereBod(e: PointerEvent): boolean {
    const r = mezera()?.getBoundingClientRect();
    if (!r) return false;
    const rez = 24;
    return e.clientX >= r.left - rez && e.clientX <= r.right + rez && e.clientY >= r.top - rez && e.clientY <= r.bottom + rez;
  }
  function stisk(e: PointerEvent, slovo: string) {
    if (hotovo || e.button !== 0) return;
    start = { slovo, x: e.clientX, y: e.clientY };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* syntetická událost */ }
  }
  function pohyb(e: PointerEvent) {
    if (!start) return;
    const x = e.clientX - start.x;
    const y = e.clientY - start.y;
    if (!tah && Math.hypot(x, y) < 6) return;
    tah = { slovo: start.slovo, x, y };
    nadMezerou = vMezereBod(e);
  }
  function pusteni(e: PointerEvent) {
    if (!start) return;
    const slovo = start.slovo;
    const tazeno = !!tah;
    const cil = tazeno && e.type === 'pointerup' && vMezereBod(e);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* už uvolněno */ }
    start = null;
    tah = null;
    nadMezerou = false;
    if (!tazeno) return;
    potlacKlik = e.type === 'pointerup';
    setTimeout(() => { potlacKlik = false; }, 400);
    if (cil) vloz(slovo);
  }
  function klepnuti(slovo: string) {
    if (potlacKlik) { potlacKlik = false; return; }
    vloz(slovo);
  }
</script>

{#snippet vazba()}
  {#if hotovo}
    <p class="blok__zpetna-titulek">{SEDI}</p>
    <p>{@html radek(blok.pointa)}</p>
    <p class="cely"><span class="cely__veta">„{@html radek(blok.pred + blok.slovo + blok.po)}“</span> <span class="cely__kdo">{blok.kdo}, {blok.puvod}</span></p>
    <p class="kdyby__titulek">A kdyby tam stálo…</p>
    <ul class="kdyby">
      {#each blok.zameny as z (z.slovo)}<li><span class="kdyby__slovo">{z.slovo}</span> {@html radek(z.vazba)}</li>{/each}
    </ul>
  {:else if zkus && zamena}
    <p class="zkus"><svg class="zkus__sipka" width="30" height="18" viewBox="0 0 30 18" aria-hidden="true" focusable="false"><path d="M2 12c6-7 15-9 24-4M20 3l6 5-7 3" /></svg>{zkus.slovo}</p>
    <p><span class="kdyby__slovo">{zamena.slovo}</span> {@html radek(zamena.vazba)}</p>
  {/if}
{/snippet}

{#snippet akce()}<BlokDal {dal} />{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="doplnit"
  nadtitulek={blok.nadtitulek}
  nazev={blok.nazev}
  labelledby={`${id}-otazka`}
  vazba={hotovo || zkus ? vazba : undefined}
  vazbaPopisek={hotovo ? 'Celý citát' : 'Zkus to jinak'}
  {cerstve}
  bind:vazbaPrvek={oblast}
  znovu={vlozeno.length ? znovu : undefined}
  hlavni={hotovo && dal ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  <blockquote class="vzkaz" data-cast="moznosti">
    <p>„{@html radek(blok.pred)}<span class={['vzkaz__mezera', vMezere && 'vzkaz__mezera--plna', nadMezerou && 'vzkaz__mezera--nad']}>{#if vMezere}<span class={['vystrizek', 'vystrizek--vlozeny', `vystrizek--${vzhled(vMezere)}`]}>{vMezere}</span>{:else}<span class="vizualne-skryte">mezera</span>{/if}</span>{@html radek(blok.po)}“</p>
    {#if hotovo}<span class={['herni-otisk', 'vzkaz__otisk', cerstve && 'otisk']} aria-hidden="true">sedí</span>{/if}
  </blockquote>

  {#if !hotovo}
    <p class="vystrizky__napoveda" id={`${id}-jak`}>Přetáhni slovo do mezery, nebo na něj klepni.</p>
    <ul class="vystrizky" aria-label="Vystřižená slova">
      {#each blok.listky as s, i (`${kolo}-${s}`)}
        {@const zkuseno = vlozeno.includes(s) && s !== vMezere}
        <li class={[kolo > 0 && 'rozdat']} style={`--i: ${i}`}>
          <button
            class={['vystrizek', `vystrizek--${vzhled(s)}`, zkuseno && 'vystrizek--zkuseny', tah?.slovo === s && 'vystrizek--tazeny']}
            type="button"
            disabled={s === vMezere}
            aria-describedby={`${id}-jak`}
            style={`--nat: ${NATOCENI[i % 3]}deg; ${tah?.slovo === s ? `transform: translate(${tah.x}px, ${tah.y}px)` : ''}`}
            onclick={() => klepnuti(s)}
            onpointerdown={(e) => stisk(e, s)}
            onpointermove={pohyb}
            onpointerup={pusteni}
            onpointercancel={pusteni}
          >{s}{#if zkuseno}<span class="vizualne-skryte"> (zkusil jsi)</span>{/if}{#if s === vMezere}<span class="vizualne-skryte"> (v mezeře)</span>{/if}</button>
        </li>
      {/each}
    </ul>
  {/if}
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
</RamAktivity>

<style>
  /* Vzkaz: věta na listu, mezera vtlačená do papíru (zvolené je vtlačené), vložené slovo jako výstřižek v ní. */
  .vzkaz { position: relative; margin: var(--s-4) 0 var(--s-4); padding: var(--s-5) var(--s-5) var(--s-4); background: var(--list); box-shadow: var(--lezi); }
  .vzkaz p { margin: 0; font-family: var(--font-serif); font-size: var(--fs-perex); line-height: 1.9; text-wrap: pretty; }
  .vzkaz__mezera {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 5.5em;
    min-height: 1.7em;
    margin: 0 .15em;
    padding: 0 .2em;
    vertical-align: baseline;
    border-radius: 3px;
    box-shadow: var(--vtla);
    background: var(--plocha);
  }
  .vzkaz__mezera--plna { min-width: 0; margin: 0; background: transparent; box-shadow: none; padding: 0; }
  .vzkaz__mezera--nad { outline: 2px dashed var(--pero); outline-offset: 3px; }
  .vzkaz__otisk { position: absolute; right: 10px; bottom: -22px; z-index: 2; }

  /* Výstřižky: tři papíry a tři písma, každý trochu natočený (přes --natoceni, Klidný režim je srovná). */
  .vystrizky__napoveda { margin: 0 0 var(--s-2); font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .vystrizky { display: flex; flex-wrap: wrap; gap: var(--s-4); margin: 0 0 var(--s-3); padding: var(--s-2) 0; list-style: none; }
  .vystrizek {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    min-width: 44px;
    padding: 6px 14px;
    border: 0;
    border-radius: 1px;
    color: var(--ink);
    font-size: calc(var(--meritko) * 21px);
    line-height: 1.1;
    rotate: calc(var(--nat, 0deg) * var(--natoceni));
    box-shadow: var(--lezi);
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    transition: translate var(--d-stisk) var(--k-stisk), box-shadow var(--d-stisk) var(--k-stisk);
    /* zubatý okraj ústřižku */
    clip-path: polygon(0 4%, 6% 0, 20% 3%, 38% 0, 55% 4%, 72% 0, 90% 3%, 100% 0, 98% 30%, 100% 62%, 97% 100%, 80% 96%, 62% 100%, 44% 97%, 26% 100%, 9% 96%, 0 100%, 3% 65%, 0 34%);
  }
  .vystrizek--0 { background: var(--list); font-family: var(--font-serif); font-style: italic; }
  .vystrizek--1 { background: var(--listek); font-family: var(--font-sans); font-weight: 700; text-transform: uppercase; letter-spacing: .04em; font-size: calc(var(--meritko) * 17px); }
  .vystrizek--2 { background: var(--plocha); font-family: var(--font-serif); font-weight: 700; }
  @media (hover: hover) { .vystrizek:not(:disabled):hover { translate: 0 -2px; box-shadow: var(--lezi-zved); } }
  .vystrizek:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; clip-path: none; }
  .vystrizek--tazeny { z-index: 5; cursor: grabbing; transition: none; box-shadow: var(--lezi-zved); }
  /* Zkusené slovo: čárkovaný okraj tužkou, ale jde vložit znovu. */
  .vystrizek--zkuseny { outline: 1.5px dashed var(--tuzka); outline-offset: 3px; clip-path: none; }
  .vystrizek:disabled { opacity: .4; cursor: default; }
  .vystrizek--vlozeny { box-shadow: none; rotate: 0deg; cursor: default; clip-path: none; min-height: 0; min-width: 0; padding: 0 .15em; font-size: inherit; }
  .vystrizek--vlozeny.vystrizek--1 { font-size: .82em; }

  .cely { margin: var(--s-3) 0; }
  .cely__veta { font-style: italic; }
  .cely__kdo { font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .kdyby__titulek { margin: var(--s-3) 0 var(--s-1); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
  .kdyby { display: grid; gap: var(--s-2); margin: 0; padding: 0; list-style: none; }
  .kdyby__slovo { font-family: var(--font-sans); font-weight: 700; }
  .kdyby__slovo::after { content: ':'; }

  .zkus { display: flex; align-items: center; gap: var(--s-2); margin: 0 0 var(--s-2); font-family: var(--font-ruka); font-size: calc(var(--meritko) * 22px); line-height: 1.3; color: var(--ruka); }
  .zkus__sipka { flex: none; fill: none; stroke: var(--tuzka); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>
