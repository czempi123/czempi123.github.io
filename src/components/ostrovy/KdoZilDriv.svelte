<script lang="ts">
  // Kdo žil dřív?: student odhadne pořadí dvou lidí (karty), nebo jejich vzdálenost tak, že přetáhne
  // život druhého člověka na osu (myší, prstem i šipkami). Pak se ukáže skutečnost: osa, věta
  // „Žili současně … / Dělí je …“ z časové logiky mapy a odkaz do Mapy a času na správný rok.
  // Odhad se jen popíše vedle skutečnosti; nic se neboduje. Do deníku nejde, stav vydrží obnovení.
  // V rámu aktivity (K4b): odhad je studentovým perem (zvolený lístek s tečkou perem, tažený život v barvě pera),
  // skutečnost v inkoustu období; odhalení na lístku s páskou.
  // Použití v MDX: <KdoZilDriv a="sokrates" b="diogenes" druh="poradi" />
  //                <KdoZilDriv a="platon" b="diogenes" druh="vzdalenost" />
  import { VYCHOZI_NADTITULKY } from '../../lib/nadtitulky';
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import {
    faktaDvojice, hodnotPoradi, hodnotVzdalenost, platnyStavKdoZil, osaDvou,
    osaOdhadu, odhadZPolohy, popisOdhadu, naProcenta, znackyOsy, otazkaKdoZil,
    type OdhadPoradi,
  } from '../../lib/bloky';
  import { let_, zAstro, type OsobaMapy } from '../../lib/cas-mapy';
  import { rok as rokText } from '../../lib/casy';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { Dal, UdajeRazitka } from './bloky-typy';

  type Clovek = OsobaMapy & { obdobi: number; zivotText: string; ikona?: string; razitko?: UdajeRazitka };
  interface Props {
    id: string;
    druh: 'poradi' | 'vzdalenost';
    a: Clovek;
    b: Clovek;
    odkaz: string;
    otazka?: string;
    /** další krok vedle odkazu do mapy (v cestě další krok) */
    dal?: Dal;
  }
  let { id, druh, a, b, odkaz, otazka, dal }: Props = $props();

  const fakta = faktaDvojice(a, b)!;
  const osa = osaDvou(a, b)!;
  const tahOsa = osaOdhadu(a, b)!;
  const nazevOtazky = otazka ?? otazkaKdoZil(a.jmeno, b.jmeno, druh);

  let poradi = $state<OdhadPoradi | null>(null);
  let start = $state(tahOsa.vychozi);
  let pohnuto = $state(false);
  let odkryto = $state(false);
  let oblast = $state<HTMLElement>();
  let cerstve = $state(false);

  let odhadVzd = $derived(odhadZPolohy(tahOsa, start));
  let hotovyOdhad = $derived(druh === 'poradi' ? poradi !== null : pohnuto);
  let vyhodnoceni = $derived(
    !odkryto ? '' : druh === 'poradi' ? hodnotPoradi(poradi!, fakta, a, b) : hodnotVzdalenost(odhadVzd, fakta),
  );

  onMount(() => {
    const s = platnyStavKdoZil(stavBloku(id), druh, tahOsa);
    if (!s) return;
    if (druh === 'poradi') poradi = s.odhad as OdhadPoradi;
    else {
      start = (s.odhad as { start: number }).start;
      pohnuto = true;
    }
    odkryto = s.odkryto;
  });

  const ulozStav = () => {
    if (!hotovyOdhad) return;
    ulozStavBloku(id, { odhad: druh === 'poradi' ? poradi : { start }, odkryto }, { odkaz, otazka: nazevOtazky, druh: 'kdo-zil-driv', hotovo: odkryto });
  };

  async function odhal() {
    if (!hotovyOdhad) return;
    odkryto = true;
    cerstve = true;
    ulozStav();
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    poradi = null;
    start = tahOsa.vychozi;
    pohnuto = false;
    odkryto = false;
    cerstve = false;
    smazStavBloku(id);
    await tick();
    document.getElementById(id)?.querySelector<HTMLElement>('input, [role="slider"]')?.focus();
  }

  const volbyPoradi: { hodnota: OdhadPoradi; text: string }[] = [
    { hodnota: 'a', text: a.jmeno },
    { hodnota: 'b', text: b.jmeno },
    { hodnota: 'soucasne', text: 'Žili ve stejné době' },
  ];
  const popisky = [zAstro(osa.od), zAstro(osa.do)].map((r) => rokText(r));
  /** Popisek pod pruhem: zleva od začátku pruhu, v pravé polovině osy zprava od jeho konce. */
  const zarovnani = (p: { zacatek: number; sirka: number }) =>
    p.zacatek + p.sirka / 2 > 50
      ? `text-align:right;padding-right:${Math.max(0, 100 - p.zacatek - p.sirka)}%`
      : `padding-left:${p.zacatek}%`;

  // ── Tažení života B po ose ──
  const pct = (r: number) => naProcenta(tahOsa, r);
  const znacky = znackyOsy(tahOsa);
  const krajniEra = zAstro(tahOsa.do) < 0 ? 'př.\u00a0n.\u00a0l.' : zAstro(tahOsa.od) > 0 ? 'n.\u00a0l.' : '';
  const popisZnacky = (r: number) => {
    const x = zAstro(r);
    return krajniEra ? String(Math.abs(x)) : rokText(x);
  };
  const omez = (r: number) => Math.min(tahOsa.maxStart, Math.max(tahOsa.minStart, Math.round(r / tahOsa.krok) * tahOsa.krok));
  function posun(nove: number) {
    start = omez(nove);
    pohnuto = true;
  }
  let radek = $state<HTMLElement>();
  let tazeni: { posun: number } | null = null;
  const rokZBodu = (x: number) => {
    const r = radek!.getBoundingClientRect();
    return tahOsa.od + ((x - r.left) / r.width) * (tahOsa.do - tahOsa.od);
  };
  function stisk(e: PointerEvent) {
    if (odkryto || e.button !== 0 || !radek) return;
    const rok = rokZBodu(e.clientX);
    // Chytil-li pruh, táhne se za místo, kde ho drží; klik vedle pruhu ho tam přesune středem.
    const naPruhu = rok >= start && rok <= start + tahOsa.delkaB;
    tazeni = { posun: naPruhu ? rok - start : tahOsa.delkaB / 2 };
    try { radek.setPointerCapture(e.pointerId); } catch { /* syntetická událost bez ukazatele */ }
    posun(rok - tazeni.posun);
  }
  function tah(e: PointerEvent) {
    if (tazeni) posun(rokZBodu(e.clientX) - tazeni.posun);
  }
  function pust(e: PointerEvent) {
    if (!tazeni) return;
    tazeni = null;
    try { radek?.releasePointerCapture(e.pointerId); } catch { /* už uvolněno */ }
    ulozStav();
    radek?.querySelector<HTMLElement>('[role="slider"]')?.focus({ preventScroll: true });
  }
  function klavesa(e: KeyboardEvent) {
    if (odkryto) return;
    const k = tahOsa.krok;
    const mapa: Record<string, number> = {
      ArrowLeft: start - k, ArrowDown: start - k, ArrowRight: start + k, ArrowUp: start + k,
      PageDown: start - 5 * k, PageUp: start + 5 * k, Home: tahOsa.minStart, End: tahOsa.maxStart,
    };
    if (!(e.key in mapa)) return;
    e.preventDefault();
    posun(mapa[e.key]);
    ulozStav();
  }
  /** Popisek u pruhu: v levé polovině od začátku pruhu, v pravé zarovnaný na jeho konec (nevyjede z osy). */
  const popisU = (od: number, delka: number) => {
    const l = pct(od);
    const p = pct(od + delka);
    return (l + p) / 2 > 50 ? `right:${Math.max(0, 100 - p)}%;text-align:right` : `left:${Math.max(0, l)}%`;
  };
  let textOdhadu = $derived(`${b.jmeno}: ${popisOdhadu(odhadVzd)}`);
  let prekryv = $derived(
    odhadVzd.potkali && odhadVzd.let > 0 ? { od: Math.max(tahOsa.a.od, start), do: Math.min(tahOsa.a.do, start + tahOsa.delkaB) } : null,
  );
</script>

{#snippet odhaleni()}
  {#if odkryto}
    <p class="blok__zpetna-titulek">{fakta.vzdalenost.text}</p>
    <p>{vyhodnoceni.replace(fakta.vzdalenost.text, '').replace(/ {2,}/g, ' ').trim()}</p>
    {#if fakta.vetaOVeku}<p>{fakta.vetaOVeku}</p>{/if}

    {#if druh === 'poradi'}
      <figure class="osa" aria-label={`${a.jmeno} ${a.zivotText}, ${b.jmeno} ${b.zivotText}`}>
        {#each [{ o: a, p: osa.a }, { o: b, p: osa.b }] as r (r.o.id)}
          <div class="osa__radek obdobi-{r.o.obdobi}" aria-hidden="true">
            <div class="osa__pruh" style={`margin-left:${r.p.zacatek}%;width:${r.p.sirka}%`}></div>
            <p class="osa__popis t-popisek" style={zarovnani(r.p)}>
              <strong>{r.o.jmeno}</strong> <span class="t-letopocet">{r.o.zivotText}</span>
            </p>
          </div>
        {/each}
        <div class="osa__meze t-popisek t-letopocet" aria-hidden="true"><span>{popisky[0]}</span><span>{popisky[1]}</span></div>
      </figure>
    {:else}
      <p class="legenda t-popisek"><span class="legenda__odhad" aria-hidden="true"></span> tvůj odhad <span class="legenda__skutecnost" aria-hidden="true"></span> skutečnost</p>
    {/if}
  {/if}
{/snippet}

{#snippet akce()}
  {#if !odkryto}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={odhal} disabled={!hotovyOdhad}>Odhalit</button>
  {:else}
    <BlokDal {dal} vedlejsi={{ href: fakta.odkazMapy, text: `Ukázat na mapě v roce ${rokText(fakta.rokMapy)}` }} />
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={a.obdobi}
  trida="kdo-zil"
  nadtitulek={VYCHOZI_NADTITULKY.KdoZilDriv}
  lide={[{ jmeno: a.jmeno, obdobi: a.obdobi, ikona: a.ikona, razitko: a.razitko }, { jmeno: b.jmeno, obdobi: b.obdobi, ikona: b.ikona, razitko: b.razitko }]}
  labelledby={`${id}-otazka`}
  vazba={odkryto ? odhaleni : undefined}
  vazbaPopisek="Odhalení"
  {cerstve}
  bind:vazbaPrvek={oblast}
  znovu={odkryto ? znovu : undefined}
  znovuText="Zkusit znovu"
  hlavni={akce}
>
  <h3 class="t-h3 blok__otazka" id={`${id}-otazka`} data-cast="otazka">{nazevOtazky}</h3>

  {#if druh === 'poradi'}
    <div class="volby" data-cast="moznosti" role="radiogroup" aria-labelledby={`${id}-otazka`}>
      {#each volbyPoradi as v (v.hodnota)}
        <label class={['volba', 'vystouple', poradi === v.hodnota && 'volba--vybrana vystouple--zvoleno']}>
          <input class="vizualne-skryte" type="radio" name={`${id}-poradi`} value={v.hodnota} bind:group={poradi} onchange={ulozStav} disabled={odkryto} />
          <span class="volba__bod" aria-hidden="true"></span>
          <span>{v.text}</span>
        </label>
      {/each}
    </div>
  {:else}
    {#if !odkryto}<p class="pokyn" data-cast="moznosti">Přetáhni život, který patří jménu {b.jmeno}, tam, kde podle tebe žil.</p>{/if}
    <div data-cast="moznosti" class={['tah', odkryto && 'tah--odkryto']}>
      <div class="tah__plocha">
        {#each znacky as z (z)}<span class="tah__mrizka" style={`left:${pct(z)}%`} aria-hidden="true"></span>{/each}
        {#if prekryv && !odkryto}
          <span class="tah__prekryv" style={`left:${pct(prekryv.od)}%;width:${pct(prekryv.do) - pct(prekryv.od)}%`} aria-hidden="true"></span>
        {/if}
        <div class="tah__radek obdobi-{a.obdobi}">
          <span class="tah__pruh" style={`left:${pct(tahOsa.a.od)}%;width:${pct(tahOsa.a.do) - pct(tahOsa.a.od)}%`}></span>
          <span class="tah__popis t-popisek" style={popisU(tahOsa.a.od, tahOsa.a.do - tahOsa.a.od)}><strong>{a.jmeno}</strong> <span class="t-letopocet">{a.zivotText}</span></span>
        </div>
        <div
          class="tah__radek tah__radek--b obdobi-{b.obdobi}"
          bind:this={radek}
          onpointerdown={stisk}
          onpointermove={tah}
          onpointerup={pust}
          onpointercancel={pust}
        >
          <span
            class={['tah__pruh', 'tah__pruh--b', odkryto && 'tah__pruh--odhad']}
            style={`left:${pct(start)}%;width:${pct(start + tahOsa.delkaB) - pct(start)}%`}
            role="slider"
            tabindex={odkryto ? -1 : 0}
            aria-label={`Kdy žil ${b.jmeno}? Posuň jeho život na ose`}
            aria-valuemin={tahOsa.minStart}
            aria-valuemax={tahOsa.maxStart}
            aria-valuenow={start}
            aria-valuetext={textOdhadu}
            aria-disabled={odkryto}
            onkeydown={klavesa}
          ><span class="tah__uchop" aria-hidden="true"></span></span>
          {#if odkryto}
            <span
              class={['tah__pruh', 'tah__pruh--skutecny', cerstve && 'dopad']}
              style={`left:${pct(tahOsa.startB)}%;width:${pct(tahOsa.startB + tahOsa.delkaB) - pct(tahOsa.startB)}%`}
            ></span>
          {/if}
          <span class="tah__popis t-popisek" style={popisU(odkryto ? tahOsa.startB : start, tahOsa.delkaB)}>
            <strong>{b.jmeno}</strong>
            {#if odkryto}<span class="t-letopocet">{b.zivotText}</span>{:else}<span>žil asi {let_(tahOsa.delkaB)}</span>{/if}
          </span>
        </div>
      </div>
      <div class="tah__osa t-popisek t-letopocet" aria-hidden="true">
        {#each znacky as z (z)}<span style={`left:${pct(z)}%`}>{popisZnacky(z)}</span>{/each}
        {#if krajniEra}<span class="tah__era">{krajniEra}</span>{/if}
      </div>
    </div>
    {#if !odkryto}
      <p class="tah__odhad t-ovladani" data-cast="moznosti" aria-hidden="true">
        {#if pohnuto}Tvůj odhad: <strong class="blok__ruka">{popisOdhadu(odhadVzd)}</strong>{:else}Ještě jsi s ním nepohnul.{/if}
      </p>
    {/if}
  {/if}
</RamAktivity>

<style>
  .volby { display: grid; gap: var(--s-3); margin-bottom: var(--s-5); }
  @container (min-width: 600px) {
    .volby { grid-template-columns: repeat(3, 1fr); }
  }
  /* Volba pořadí: vystouplé lístky, zvolený vtlačený s tečkou perem studenta. */
  .volba {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-3);
    min-height: 56px;
    padding: var(--s-3) var(--s-4);
    border-radius: var(--r-ovladani);
    font-size: var(--fs-ovladani-l);
    text-align: center;
    color: var(--ink);
  }
  .volba:has(input:focus-visible) { outline: 2px solid var(--ink); outline-offset: 3px; }
  .volba__bod { flex: none; width: 16px; height: 16px; border-radius: var(--r-plne); box-shadow: inset 0 0 0 1.5px var(--tuzka); }
  .volba--vybrana .volba__bod { background: var(--pero); box-shadow: inset 0 0 0 3px var(--papir); outline: 1.5px solid var(--pero); }

  .pokyn { margin: 0 0 var(--s-4); font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .tah { margin: 0 0 var(--s-3); padding: var(--s-4) 0 0; }
  .tah__plocha { position: relative; padding: var(--s-2) 0; }
  .tah__mrizka { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--linka); }
  /* Společná léta podle odhadu: šrafa perem, ne tinta. */
  .tah__prekryv { position: absolute; top: 0; bottom: 0; background: repeating-linear-gradient(-45deg, color-mix(in srgb, var(--pero) 14%, transparent) 0 4px, transparent 4px 8px); border-inline: 1.5px dashed var(--pero); }
  .tah__radek { position: relative; height: 64px; }
  .tah__radek--b { touch-action: pan-y; cursor: grab; user-select: none; }
  .tah--odkryto .tah__radek--b { cursor: default; }
  .tah__pruh {
    position: absolute;
    top: 10px;
    height: 14px;
    border-radius: var(--r-plne);
    background: var(--p);
  }
  /* Tažený pruh je studentův odhad: perem. Dotykový cíl 44 px kolem tenkého pruhu. */
  .tah__pruh--b {
    top: -5px;
    height: 44px;
    background: transparent;
    outline-offset: 2px;
  }
  .tah__pruh--b::before {
    content: '';
    position: absolute;
    inset: 15px 0;
    border-radius: var(--r-plne);
    background: var(--pero);
    box-shadow: 0 0 0 3px var(--papir);
  }
  .tah__pruh--b:focus-visible { outline: 2px solid var(--ink); border-radius: var(--r-razitko); }
  .tah__uchop {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 28px;
    height: 28px;
    border-radius: var(--r-plne);
    background: var(--list);
    box-shadow: var(--lezi), inset 0 0 0 2px var(--pero);
    transform: translate(-50%, -50%);
  }
  .tah__uchop::before {
    content: '';
    position: absolute;
    inset: 8px 8px;
    border-inline: 2px solid var(--pero);
  }
  .tah__pruh--odhad::before { background: transparent; border: 2px dashed var(--pero); box-shadow: none; }
  .tah__pruh--odhad .tah__uchop { display: none; }
  .tah__pruh--skutecny { top: 10px; }
  .tah__popis {
    position: absolute;
    top: 32px;
    max-width: 70%;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tah__radek--b .tah__popis { top: 40px; pointer-events: none; }
  .tah__popis strong { font-weight: 600; }
  .tah__popis .t-letopocet, .tah__popis > span { color: var(--ink-2); }
  .tah__osa { position: relative; height: 22px; border-top: 1.5px solid var(--tuzka); color: var(--ink-2); }
  .tah__osa span { position: absolute; top: 4px; transform: translateX(-50%); white-space: nowrap; }
  .tah__osa .tah__era { right: 0; left: auto; transform: none; top: 22px; }
  .tah__odhad { margin: var(--s-5) 0 var(--s-4); color: var(--ink-2); }
  @media (max-width: 599px) {
    .tah__osa span:nth-child(even):not(.tah__era) { visibility: hidden; }
  }

  .legenda { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-2); margin: var(--s-3) 0 0; color: var(--ink-2); }
  .legenda__odhad, .legenda__skutecnost { display: inline-block; width: 28px; height: 10px; border-radius: var(--r-plne); }
  .legenda__odhad { border: 2px dashed var(--pero); }
  .legenda__skutecnost { margin-left: var(--s-3); background: var(--p); }

  .osa { margin: var(--s-5) 0 0; }
  .osa__radek { margin-bottom: var(--s-3); }
  .osa__pruh { height: 10px; border-radius: var(--r-plne); background: var(--p); }
  .osa__popis { margin: var(--s-1) 0 0; color: var(--ink); }
  .osa__popis strong { font-weight: 600; }
  .osa__popis .t-letopocet { color: var(--ink-2); }
  .osa__meze { display: flex; justify-content: space-between; padding-top: var(--s-2); border-top: 1px dashed var(--tuzka); color: var(--ink-2); }
</style>
