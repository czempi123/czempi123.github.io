<script lang="ts">
  // Kde to bylo? (herna-v1, K2; plátno D5 › Kde to bylo?): slepý výřez staré mapy bez popisků. Klepnutí položí
  // špendlík v barvě pera; z klávesnice se šipkami posouvá kříž (Shift po větších krocích), Enter nebo mezerník
  // špendlík položí. Pak razítko místa s názvem, čárkovaná spojnice ke špendlíku a vzdálenost jen slovem („blízko“,
  // „o moře dál“), bez kilometrů a bodů. Pointa je, proč tam člověk byl: věta z dat o pobytu (vyhnanství, škola).
  // Popisky stojí na opačných stranách (src/lib/herna/mista.ts › stranyKde). Do deníku jen stav (tip).
  // Použití v MDX (obsah v src/content/bloky/dilna-kde-seneca.yaml, druh: kde):
  // <KdeToBylo id="dilna-kde-seneca" />
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import { kmMezi, vzdalenostSlovem, stranyKde, platnyStavKde, SEDI } from '../../lib/herna';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { ClovekBloku, Dal } from './bloky-typy';

  interface BlokKde {
    obdobi: number;
    nadtitulek: string;
    nazev: string;
    scena?: string;
    otazka: string;
    lide: ClovekBloku[];
    sirka: number;
    vyska: number;
    pevnina?: string;
    pevninaCesta?: string;
    meritko: { px: number; km: number };
    misto: { nazev: string; xy: [number, number] };
    veta: string;
    vysvetleni?: string;
  }
  interface Props { id: string; blok: BlokKde; odkaz: string; dal?: Dal }
  let { id, blok, odkaz, dal }: Props = $props();

  let tip = $state<[number, number] | null>(null);
  let kriz = $state<[number, number]>([blok.sirka / 2, blok.vyska / 2]);
  let klavesnice = $state(false);
  let cerstve = $state(false);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();
  let svg = $state<SVGSVGElement>();

  const pevnina = $derived(blok.pevnina ?? `#${id}-pevnina`);
  const k = $derived(blok.sirka / 600);
  const vysledek = $derived(tip ? vzdalenostSlovem(kmMezi(tip, blok.misto.xy, blok.meritko)) : null);
  const strany = $derived(tip ? stranyKde(tip, blok.misto.xy, blok.sirka) : null);
  const ram = (x: number) => ({ x: x * k, y: x * k, width: blok.sirka - 2 * x * k, height: blok.vyska - 2 * x * k });

  onMount(() => {
    const s = platnyStavKde(stavBloku(id), blok.sirka, blok.vyska);
    if (s) tip = s.tip;
  });

  async function poloz(bod: [number, number]) {
    if (tip) return;
    tip = [Math.round(bod[0] * 10) / 10, Math.round(bod[1] * 10) / 10];
    cerstve = true;
    const v = vzdalenostSlovem(kmMezi(tip, blok.misto.xy, blok.meritko));
    hlaseni = `${v.sedi ? `${SEDI} ` : ''}Tvůj špendlík je ${v.slovo}. ${blok.misto.nazev}. ${blok.veta}`;
    ulozStavBloku(id, { tip }, { odkaz, otazka: blok.otazka, druh: 'kde', hotovo: true });
    await tick();
    oblast?.focus();
  }

  function klepnuti(e: MouseEvent) {
    if (tip || !svg) return;
    klavesnice = false;
    const r = svg.getBoundingClientRect();
    poloz([((e.clientX - r.left) / r.width) * blok.sirka, ((e.clientY - r.top) / r.height) * blok.vyska]);
  }

  function klavesa(e: KeyboardEvent) {
    if (tip) return;
    const krok = (e.shiftKey ? 0.1 : 0.025) * blok.sirka;
    const posun: Record<string, [number, number]> = { ArrowLeft: [-krok, 0], ArrowRight: [krok, 0], ArrowUp: [0, -krok], ArrowDown: [0, krok] };
    if (posun[e.key]) {
      e.preventDefault();
      klavesnice = true;
      const [dx, dy] = posun[e.key];
      kriz = [Math.min(blok.sirka, Math.max(0, kriz[0] + dx)), Math.min(blok.vyska, Math.max(0, kriz[1] + dy))];
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      poloz(kriz);
    }
  }

  async function znovu() {
    tip = null;
    cerstve = false;
    kriz = [blok.sirka / 2, blok.vyska / 2];
    hlaseni = 'Špendlík je pryč, mapa je zase slepá.';
    smazStavBloku(id);
    await tick();
    document.getElementById(id)?.querySelector<HTMLElement>('.slepa')?.focus();
  }
</script>

{#snippet vazba()}
  {#if tip && vysledek}
    <p class="blok__zpetna-titulek">{vysledek.sedi ? SEDI : 'Takhle to bylo.'}</p>
    <p>Tvůj špendlík je <strong>{vysledek.slovo}</strong>.</p>
    <p>{@html radek(blok.veta)}</p>
    {#if blok.vysvetleni}{#each odstavce(blok.vysvetleni) as o, i (i)}<p>{@html o}</p>{/each}{/if}
  {/if}
{/snippet}

{#snippet akce()}<BlokDal {dal} />{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="kde"
  nadtitulek={blok.nadtitulek}
  nazev={blok.nazev}
  lide={blok.lide}
  labelledby={`${id}-otazka`}
  vazba={tip ? vazba : undefined}
  vazbaPopisek="Kde to bylo"
  {cerstve}
  bind:vazbaPrvek={oblast}
  znovu={tip ? znovu : undefined}
  hlavni={tip && dal ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>
  {#if !tip}<p class="slepa__napoveda" id={`${id}-jak`}>Klepni do mapy tam, kde to podle tebe bylo.</p>{/if}

  <!-- Mapa jako jedna plocha: klepnutí, nebo kříž šipkami a Enter (role application, ať čtečka pustí šipky). -->
  <div
    class={['slepa', tip && 'slepa--hotovo', klavesnice && 'slepa--klavesnice']}
    data-cast="moznosti"
    role="application"
    tabindex={tip ? -1 : 0}
    aria-label={tip ? `Mapa: ${blok.misto.nazev}` : 'Slepá mapa'}
    aria-describedby={tip ? undefined : `${id}-klavesy`}
    onclick={klepnuti}
    onkeydown={klavesa}
    onpointerdown={() => { klavesnice = false; }}
  >
    <svg bind:this={svg} viewBox={`0 0 ${blok.sirka} ${blok.vyska}`} style={`--k:${k}`} aria-hidden="true" focusable="false">
      {#if blok.pevninaCesta}<defs><path id={`${id}-pevnina`} d={blok.pevninaCesta} /></defs>{/if}
      <use href={pevnina} class="linka linka--1" />
      <use href={pevnina} class="mezera mezera--1" />
      <use href={pevnina} class="linka linka--2" />
      <use href={pevnina} class="mezera mezera--2" />
      <use href={pevnina} class="linka linka--3" />
      <use href={pevnina} class="mezera mezera--3" />
      <use href={pevnina} class="pevnina" />
      <g class="ram">
        <rect class="ram__vnejsi" {...ram(4)} />
        <rect class="ram__stupnice" {...ram(7)} />
        <rect class="ram__vnitrni" {...ram(9.5)} />
      </g>
      {#if tip && strany}
        <line class="spojnice" x1={tip[0]} y1={tip[1]} x2={blok.misto.xy[0]} y2={blok.misto.xy[1]} />
        <g class="bod" transform={`translate(${blok.misto.xy[0]} ${blok.misto.xy[1]})`}>
          <circle r="9" class="bod__kruh" /><circle r="4.6" class="bod__kruh bod__kruh--vnitrni" /><circle r="2" class="bod__stred" />
          <text class="nazev" x={strany.misto === 'vlevo' ? -14 : 14} y="6" text-anchor={strany.misto === 'vlevo' ? 'end' : 'start'}>{blok.misto.nazev}</text>
        </g>
        <g class="spendlik" transform={`translate(${tip[0]} ${tip[1]})`}>
          <path d="M0 0 L-4 -16 A7 7 0 1 1 4 -16 Z" class="spendlik__telo" />
          <circle cy="-20" r="2.6" class="spendlik__lesk" />
          {#if strany.tip}<text class="spendlik__popisek" x={strany.tip === 'vlevo' ? -12 : 12} y="-12" text-anchor={strany.tip === 'vlevo' ? 'end' : 'start'}>tvůj tip</text>{/if}
        </g>
      {:else}
        <g class="kriz" transform={`translate(${kriz[0]} ${kriz[1]})`}>
          <circle r="12" /><path d="M-22 0h14M8 0h14M0 -22v14M0 8v14" />
        </g>
      {/if}
    </svg>
    {#if tip && vysledek?.sedi}<span class={['herni-otisk', 'slepa__otisk', cerstve && 'otisk']} aria-hidden="true">sedí</span>{/if}
  </div>
  <p class="vizualne-skryte" id={`${id}-klavesy`}>Šipkami posuneš kříž po mapě, se Shiftem o větší kus. Enter položí špendlík.</p>
  <p class="slepa__podklad t-popisek">Podklad: Natural Earth.</p>
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
</RamAktivity>

<style>
  /* Výstřižek staré mapy jako mini mapa (osobnost/MiniMapa.astro): moře šrafované tužkou, tři vodní linky,
     pevnina na lístkovém papíře. Slepá: bez názvů, bodů a měřítka. */
  .slepa { position: relative; max-width: 640px; margin: var(--s-3) 0 var(--s-2); cursor: crosshair; touch-action: manipulation; --fs-nazev: 17px; --fs-tip: 18px; }
  .slepa--hotovo { cursor: default; }
  .slepa:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
  .slepa__napoveda { margin: 0 0 var(--s-2); font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  svg {
    display: block;
    width: 100%;
    height: auto;
    background:
      repeating-linear-gradient(0deg, color-mix(in srgb, var(--tuzka) 38%, transparent) 0 0.7px, transparent 0.7px 6px),
      var(--list);
    box-shadow: var(--lezi);
  }
  .linka { fill: none; stroke: var(--tuzka); stroke-linejoin: round; }
  .mezera { fill: none; stroke: var(--list); stroke-linejoin: round; }
  .linka--1 { stroke-width: calc(17px * var(--k)); opacity: 0.14; }
  .mezera--1 { stroke-width: calc(14px * var(--k)); }
  .linka--2 { stroke-width: calc(10.5px * var(--k)); opacity: 0.22; }
  .mezera--2 { stroke-width: calc(8px * var(--k)); }
  .linka--3 { stroke-width: calc(5px * var(--k)); opacity: 0.32; }
  .mezera--3 { stroke-width: calc(3px * var(--k)); }
  .pevnina { fill: var(--listek); stroke: var(--ink-2); stroke-width: calc(1.2px * var(--k)); stroke-linejoin: round; }
  .ram { fill: none; stroke: var(--ink-2); }
  .ram__vnejsi { stroke-width: calc(1.4px * var(--k)); }
  .ram__stupnice { stroke-width: calc(3px * var(--k)); stroke-dasharray: calc(26px * var(--k)) calc(26px * var(--k)); }
  .ram__vnitrni { stroke-width: calc(0.7px * var(--k)); }
  /* Kříž z klávesnice: jen když mapa má fokus. */
  .kriz { display: none; fill: none; stroke: var(--pero); stroke-width: 2.5; }
  .slepa:focus-visible .kriz, .slepa--klavesnice:focus .kriz { display: inline; }
  .spojnice { stroke: var(--tuzka); stroke-width: 2; stroke-dasharray: 6 5; }
  .bod__kruh { fill: var(--list); stroke: var(--p); stroke-width: 2.4; }
  .bod__kruh--vnitrni { fill: none; stroke-width: 1.2; }
  .bod__stred { fill: var(--p); }
  .nazev { font-family: var(--font-sans); font-size: var(--fs-nazev); font-weight: 600; fill: var(--ink); paint-order: stroke; stroke: var(--listek); stroke-width: 4px; stroke-linejoin: round; }
  .spendlik__telo { fill: var(--pero); stroke: var(--list); stroke-width: 1.2; }
  .spendlik__lesk { fill: var(--list); }
  .spendlik__popisek { font-family: var(--font-ruka); font-size: var(--fs-tip); fill: var(--pero); paint-order: stroke; stroke: var(--list); stroke-width: 4px; stroke-linejoin: round; }
  .slepa__otisk { position: absolute; right: 14px; top: 14px; z-index: 2; }
  .slepa__podklad { margin: 0 0 var(--s-2); color: var(--ink-2); }
  /* Na telefonu se SVG zmenší zhruba na 70 %, popisky proto zvětšíme (jako mini mapa). */
  @container (max-width: 560px) { .slepa { --fs-nazev: 24px; --fs-tip: 25px; } }
</style>
