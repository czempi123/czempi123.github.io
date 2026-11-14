<script lang="ts">
  // Spor v rámu aktivity (K4b; plátno Herna.dc.html › Spor): dva přišpendlené lístky s postoji a mezi nimi prověšený
  // provázek s pěti uzlíky, po kterém jezdí studentova mince v barvě pera (--d-presun). Student se postaví na provázek
  // (tažením, klepnutím nebo šipkami), přečte si nejsilnější argumenty obou stran a může se přesunout; šipka tužkou
  // ukáže, odkud kam. Do deníku se zapíše první i konečná
  // poloha; nic se nehodnotí. Po konečné poloze nabídne zavřenou nepovinnou reflexi: nejsilnější argument
  // druhé strany (kdo stojí uprostřed, vybírá z obou) a odpověď na něj; ukládá se sama do téhož zápisu.
  // Použití v MDX (obsah v src/content/bloky/platon-diogenes-skutecnost.yaml):
  // <Spor id="platon-diogenes-skutecnost" />
  import { VYCHOZI_NADTITULKY } from '../../lib/nadtitulky';
  import { onMount, tick } from 'svelte';
  import { ulozZapis, smazZapis, stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import {
    POLOHY, popisPolohy, zpetnaSporu, zapisSporu, platnyStavSporu, odstavce, radek, velke,
    argumentyReflexe, mistoArgumentu, otazkaReflexe, reflexeVyplnena, uryvekArgumentu, type ReflexeSporu,
  } from '../../lib/bloky';
  import type { TBlokSpor } from '../../lib/bloky-schema';
  import RamAktivity from './RamAktivity.svelte';
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { ClovekBloku, Dal } from './bloky-typy';

  interface Props {
    id: string;
    blok: Omit<TBlokSpor, 'zdroje' | 'kOvereni' | 'dal'>;
    /** obě strany z dat (jméno, období, atribut), ve stejném pořadí jako blok.strany */
    lide: [ClovekBloku, ClovekBloku];
    odkaz: string;
    dal?: Dal;
  }
  let { id, blok, lide, odkaz, dal }: Props = $props();
  // Strana se jmenuje po osobě, nebo po směru, za který osoba mluví („kynici“); v nadpisech s velkým písmenem.
  const [A, B] = [lide[0].oznaceni ?? lide[0].jmeno, lide[1].oznaceni ?? lide[1].jmeno];
  const nadpisy = [velke(A), velke(B)];
  const polohy = Array.from({ length: POLOHY }, (_, i) => i);

  let navrh = $state<number | null>(null);
  let prvni = $state<number | null>(null);
  let konecna = $state<number | null>(null);
  let duvod = $state('');
  let argumenty = $state<HTMLElement>();
  let oblast = $state<HTMLElement>();
  /** student s provázkem teď pracoval: mince jede (po obnovení stránky stojí rovnou na místě) */
  let ziva = $state(false);
  let cerstve = $state(false);

  // Reflexe. Výběr je pořadí v nabídce, „puvodni“ (uložený argument, který blok už nemá), nebo „jiny“.
  let otevrena = $state(false);
  let vyber = $state<string | null>(null);
  let puvodni = $state<{ strana: 0 | 1; text: string } | null>(null);
  let vlastni = $state('');
  let odpoved = $state('');
  let reflexeUlozena = $state(false);
  let souhrn = $state<HTMLElement>();
  let casovac: ReturnType<typeof setTimeout> | undefined;
  let moznosti = $derived(konecna === null ? [] : argumentyReflexe(blok.strany, konecna));

  onMount(() => {
    // Odchod ze stránky uloží, co je v reflexi rozepsané.
    const priOdchodu = () => { if (casovac !== undefined) ulozReflexi(); };
    addEventListener('pagehide', priOdchodu);
    const uklid = () => { clearTimeout(casovac); removeEventListener('pagehide', priOdchodu); };
    const s = platnyStavSporu(stavBloku(id));
    if (!s) return uklid;
    prvni = s.prvni;
    konecna = s.konecna;
    duvod = s.duvod;
    navrh = s.konecna ?? s.prvni;
    const r = s.reflexe;
    if (r && s.konecna !== null) {
      odpoved = r.odpoved;
      const a = r.argument;
      if (a && 'strana' in a) {
        // Hledá se text, ne pořadí: když autor argument změnil nebo ubral, zůstane vidět ten, který student vybral.
        const i = mistoArgumentu(argumentyReflexe(blok.strany, s.konecna), a);
        if (i >= 0) vyber = String(i);
        else { puvodni = a; vyber = 'puvodni'; }
      } else if (a) {
        vyber = 'jiny';
        vlastni = a.vlastni;
      }
      reflexeUlozena = reflexeVyplnena(r);
      otevrena = true;
    }
    return uklid;
  });

  function reflexe(): ReflexeSporu | null {
    let argument: ReflexeSporu['argument'] = null;
    if (vyber === 'jiny') argument = { vlastni: vlastni.trim() };
    else if (vyber === 'puvodni') argument = puvodni;
    else if (vyber !== null && moznosti[Number(vyber)]) argument = { strana: moznosti[Number(vyber)].strana, text: moznosti[Number(vyber)].text };
    return argument || odpoved.trim() ? { argument, odpoved: odpoved.trim() } : null;
  }

  const ulozStav = () =>
    ulozStavBloku(
      id,
      { prvni, konecna, duvod: duvod.trim(), reflexe: konecna === null ? null : reflexe() },
      { odkaz, otazka: blok.otazka, druh: 'spor', hotovo: konecna !== null },
    );

  /** Reflexe se ukládá sama: do stavu bloku a do téhož zápisu v deníku jako další věta. */
  function ulozReflexi() {
    clearTimeout(casovac);
    casovac = undefined;
    if (prvni === null || konecna === null) return;
    const r = reflexe();
    ulozStav();
    ulozZapis({ id, otazka: blok.otazka, odpoved: zapisSporu(prvni, konecna, A, B, duvod, r), odkaz, druh: 'spor' });
    reflexeUlozena = reflexeVyplnena(r);
  }
  function piseSe() {
    clearTimeout(casovac);
    casovac = setTimeout(ulozReflexi, 600);
  }
  function klavesaReflexe(e: KeyboardEvent) {
    if (e.key !== 'Escape' || !otevrena) return;
    if (casovac !== undefined) ulozReflexi();
    otevrena = false;
    souhrn?.focus();
  }

  async function postavSe() {
    if (navrh === null) return;
    prvni = navrh;
    ulozStav();
    await tick();
    argumenty?.focus();
  }

  async function zapis() {
    if (navrh === null || prvni === null) return;
    konecna = navrh;
    cerstve = true;
    ulozStav();
    ulozZapis({ id, otazka: blok.otazka, odpoved: zapisSporu(prvni, konecna, A, B, duvod), odkaz, druh: 'spor' });
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    navrh = null;
    prvni = null;
    konecna = null;
    cerstve = false;
    duvod = '';
    clearTimeout(casovac);
    casovac = undefined;
    otevrena = false;
    vyber = null;
    puvodni = null;
    vlastni = '';
    odpoved = '';
    reflexeUlozena = false;
    smazStavBloku(id);
    smazZapis(id);
    await tick();
    document.getElementById(id)?.querySelector<HTMLElement>('input, textarea')?.focus();
  }

  // ── Tažení po škále (myš i prst); klávesnici obstarají přepínače ──
  let tazeni = false;
  function polohaZUdalosti(e: PointerEvent, stopa: HTMLElement): number {
    const r = stopa.getBoundingClientRect();
    const x = Math.min(r.right - 22, Math.max(r.left + 22, e.clientX));
    return Math.round(((x - r.left - 22) / (r.width - 44)) * (POLOHY - 1));
  }
  function stisk(e: PointerEvent) {
    if (e.button !== 0) return;
    const stopa = e.currentTarget as HTMLElement;
    tazeni = true;
    ziva = true;
    try { stopa.setPointerCapture(e.pointerId); } catch { /* syntetická událost bez ukazatele */ }
    navrh = polohaZUdalosti(e, stopa);
  }
  function pohyb(e: PointerEvent) {
    if (tazeni) navrh = polohaZUdalosti(e, e.currentTarget as HTMLElement);
  }
  function pusteni(e: PointerEvent) {
    if (!tazeni) return;
    tazeni = false;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* už uvolněno */ }
    // Po tažení přenes fokus na vybraný přepínač, ať jde pokračovat šipkami.
    const vstup = (e.currentTarget as HTMLElement).querySelectorAll<HTMLInputElement>('input')[navrh ?? 0];
    vstup?.focus({ preventScroll: true });
  }
  /** Střed uzlíku i v procentech šířky stopy (uzlíky mají cíl 44 px a jsou rozložené od kraje ke kraji). */
  const stred = (i: number) => `calc(22px + (100% - 44px) * ${i / (POLOHY - 1)})`;
  /** Provázek je prověšený (kvadratická křivka): o kolik px je uzlík i níž než konce. */
  const PROVES = 24;
  const proves = (i: number) => { const t = i / (POLOHY - 1); return 4 * PROVES * t * (1 - t); };
</script>

{#snippet skala(jmeno: string, zamceno: boolean, popisek: string, sipka: boolean)}
  <fieldset class="skala" data-cast="moznosti">
    <legend class="vizualne-skryte">{popisek}</legend>
    <div class="skala__konce" aria-hidden="true">
      <span class="obdobi-{lide[0].obdobi}"><RazitkoCloveka razitko={lide[0].razitko} obdobi={lide[0].obdobi} velikost={34} />{nadpisy[0]}</span>
      <span class="obdobi-{lide[1].obdobi}">{nadpisy[1]}<RazitkoCloveka razitko={lide[1].razitko} obdobi={lide[1].obdobi} velikost={34} /></span>
    </div>
    <div
      class={['skala__stopa', zamceno && 'skala__stopa--zamcena']}
      onpointerdown={zamceno ? undefined : stisk}
      onpointermove={zamceno ? undefined : pohyb}
      onpointerup={zamceno ? undefined : pusteni}
      onpointercancel={zamceno ? undefined : pusteni}
    >
      <!-- Prověšený provázek mezi dvěma špendlíky: stejná křivka jako poloha uzlíků (proves). -->
      <svg class="provazek" viewBox="0 0 100 48" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 0Q50 48 100 0" /></svg>
      <span class="provazek__konec provazek__konec--l" aria-hidden="true"></span>
      <span class="provazek__konec provazek__konec--r" aria-hidden="true"></span>
      {#if sipka && prvni !== null && navrh !== null && navrh !== prvni}
        <span
          class={['sipka', navrh > prvni ? 'sipka--vpravo' : 'sipka--vlevo']}
          style={`left:${stred(Math.min(prvni, navrh))};width:calc((100% - 44px) * ${Math.abs(navrh - prvni) / (POLOHY - 1)})`}
          aria-hidden="true"
        ></span>
      {/if}
      {#each polohy as i (i)}
        <label class={['stop', navrh === i && 'stop--vybrany', sipka && prvni === i && 'stop--zacatek', zamceno && 'stop--zamceny']} style={`left:calc(${stred(i)} - 22px);top:${proves(i)}px`}>
          <input class="vizualne-skryte" type="radio" name={jmeno} value={i} bind:group={navrh} disabled={zamceno} onchange={() => (ziva = true)} />
          <span class="vizualne-skryte">{popisPolohy(i, A, B)}{sipka && prvni === i ? ' (tady jsi začal)' : ''}</span>
          <span class="stop__bod" aria-hidden="true"></span>
        </label>
      {/each}
      <!-- Studentova mince v barvě pera jede po provázku na zvolený uzlík. -->
      <span class="draha" aria-hidden="true">
        {#if navrh !== null}<span class="mince-pera" style={`--t:${navrh / (POLOHY - 1)};--y:${proves(navrh)}px`}>ty</span>{/if}
      </span>
    </div>
    <p class="skala__stav" aria-hidden="true">
      {#if navrh !== null}Stojíš: <strong>{popisPolohy(navrh, A, B)}</strong>{#if sipka && prvni !== null && prvni !== navrh}{' · '}začal jsi: {popisPolohy(prvni, A, B)}{/if}{:else}Přetáhni nebo klepni na uzlík, kde stojíš.{/if}
    </p>
  </fieldset>
{/snippet}

{#snippet posun()}
  {#if prvni !== null && konecna !== null}
    <p class="blok__zpetna-titulek">Začal jsi: {popisPolohy(prvni, A, B)}. Teď: {popisPolohy(konecna, A, B)}.</p>
    <p>{zpetnaSporu(prvni, konecna, A, B)}</p>
    {#if duvod.trim()}<p class="duvod"><span class="t-popisek">Tvůj důvod:</span> <span class="blok__ruka">{duvod}</span></p>{/if}
  {/if}
{/snippet}

{#snippet reflexeSporu()}
  {#if konecna !== null}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <details class="reflexe" data-cast="duvod" bind:open={otevrena} onkeydown={klavesaReflexe}>
      <summary bind:this={souhrn}><span class="reflexe__otazka">{otazkaReflexe(konecna)}</span><span class="nepovinne">Nepovinné</span></summary>
      <div class="reflexe__telo">
        <fieldset class="reflexe__vyber">
          <legend class="vizualne-skryte">{otazkaReflexe(konecna)}</legend>
          {#each moznosti as m, i (i)}
            {#if i === 0 || moznosti[i - 1].strana !== m.strana}
              <p class="reflexe__strana obdobi-{lide[m.strana].obdobi}" aria-hidden="true">{nadpisy[m.strana]}</p>
            {/if}
            <label class={['arg', 'vystouple', vyber === String(i) && 'arg--vybrany vystouple--zvoleno']}>
              <input class="vizualne-skryte" type="radio" name={`${id}-reflexe`} value={String(i)} bind:group={vyber} onchange={ulozReflexi} />
              <span class="arg__bod" aria-hidden="true"></span>
              <span><span class="vizualne-skryte">{nadpisy[m.strana]}</span>{@html radek(m.uryvek)}</span>
            </label>
          {/each}
          {#if puvodni}
            <label class={['arg', 'vystouple', vyber === 'puvodni' && 'arg--vybrany vystouple--zvoleno']}>
              <input class="vizualne-skryte" type="radio" name={`${id}-reflexe`} value="puvodni" bind:group={vyber} onchange={ulozReflexi} />
              <span class="arg__bod" aria-hidden="true"></span>
              <span><span class="vizualne-skryte">{nadpisy[puvodni.strana]}</span>{@html radek(uryvekArgumentu(puvodni.text))}</span>
            </label>
          {/if}
          <label class={['arg', 'arg--jiny', 'vystouple', vyber === 'jiny' && 'arg--vybrany vystouple--zvoleno']}>
            <input class="vizualne-skryte" type="radio" name={`${id}-reflexe`} value="jiny" bind:group={vyber} onchange={ulozReflexi} />
            <span class="arg__bod" aria-hidden="true"></span>
            <span>Jiný argument</span>
          </label>
        </fieldset>
        {#if vyber === 'jiny'}
          <label class="blok__popis" for={`${id}-jiny`}>Který?</label>
          <textarea class="blok__pole blok__pole--kratke" id={`${id}-jiny`} rows="2" bind:value={vlastni} oninput={piseSe} onblur={ulozReflexi}></textarea>
        {/if}
        <label class="blok__popis" for={`${id}-odpoved`}>Co na něj odpovíš?</label>
        <textarea
          class="blok__pole blok__pole--kratke"
          id={`${id}-odpoved`}
          rows="2"
          bind:value={odpoved}
          oninput={piseSe}
          onblur={ulozReflexi}
          placeholder="Stačí pár slov…"
          aria-describedby={`${id}-reflexe-stav`}
        ></textarea>
        <p class="blok__ulozeno reflexe__stav" data-cast="ulozeno" id={`${id}-reflexe-stav`} aria-live="polite">{reflexeUlozena ? 'Uloženo v deníku.' : 'Ukládá se samo do deníku.'}</p>
      </div>
    </details>
  {/if}
{/snippet}

{#snippet akce()}
  {#if prvni === null}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={postavSe} disabled={navrh === null}>Tady stojím</button>
  {:else if konecna === null}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={zapis} disabled={navrh === null}>Zapsat konečnou polohu</button>
  {:else}
    <BlokDal {dal} />
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida={['spor', ziva && 'spor--ziva'].filter(Boolean).join(' ')}
  nadtitulek={blok.nadtitulek ?? VYCHOZI_NADTITULKY.Spor}
  {lide}
  labelledby={`${id}-otazka`}
  vazba={konecna !== null ? posun : undefined}
  vazbaPopisek="Tvůj posun"
  {cerstve}
  bind:vazbaPrvek={oblast}
  poVazbe={reflexeSporu}
  ulozeno={konecna !== null ? 'První i konečná poloha jsou uložené v deníku.' : undefined}
  znovu={konecna !== null ? znovu : undefined}
  hlavni={konecna === null || dal ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>
  <!-- Dva přišpendlené lístky: každá strana visí na špendlíku v papíru svého období. -->
  <div class="postoje" data-cast="moznosti">
    {#each blok.strany as s, i (i)}
      <p class="postoj obdobi-{lide[i].obdobi}"><span class="spendlik" aria-hidden="true"></span><span class="postoj__jmeno">{nadpisy[i]}</span> {@html radek(s.postoj)}</p>
    {/each}
  </div>

  {#if prvni === null}
    {@render skala(`${id}-prvni`, false, 'Kde stojíš ty?', false)}
  {:else}
    <div class="argumenty" data-cast="zpetna" role="region" aria-label="Argumenty obou stran" tabindex="-1" bind:this={argumenty}>
      <p class="zacatek t-ovladani">Začal jsi: <strong class="blok__ruka">{popisPolohy(prvni, A, B)}</strong>. Teď si přečti, co říkají oba.</p>
      <div class="strany">
        {#each blok.strany as s, i (i)}
          <article class={['strana', `obdobi-${lide[i].obdobi}`, ziva && 'rozlozit']} aria-labelledby={`${id}-strana-${i}`}>
            <div class="strana__hlava">
              <RazitkoCloveka razitko={lide[i].razitko} obdobi={lide[i].obdobi} velikost={56} />
              <h4 class="strana__jmeno" id={`${id}-strana-${i}`}>{nadpisy[i]}</h4>
            </div>
            {#each s.argumenty as arg, j (j)}
              {#each odstavce(arg) as o, k (k)}<p>{@html o}</p>{/each}
            {/each}
          </article>
        {/each}
      </div>
    </div>

    {#if konecna === null}
      <h4 class="t-ovladani-l posunout" data-cast="moznosti">Chceš se posunout?</h4>
      {@render skala(`${id}-konecna`, false, 'Kde stojíš teď?', true)}
      <label class="blok__popis" for={`${id}-duvod`} data-cast="duvod">Co tě posunulo, nebo co tě udrželo? <span class="nepovinne">Nepovinné</span></label>
      <textarea class="blok__pole blok__pole--kratke" data-cast="duvod" id={`${id}-duvod`} rows="2" bind:value={duvod} onchange={ulozStav} placeholder="Stačí pár slov…"></textarea>
    {:else}
      {@render skala(`${id}-hotovo`, true, 'Tvoje konečná poloha', true)}
    {/if}
  {/if}
</RamAktivity>

<style>
  /* Postoje: dva ležící lístky přišpendlené špendlíkem v papíru období. */
  .postoje { display: grid; gap: var(--s-5) var(--s-4); margin: var(--s-5) 0 var(--s-4); }
  @container (min-width: 460px) {
    .postoje { grid-template-columns: 1fr 1fr; }
  }
  .postoj {
    position: relative;
    margin: 0;
    padding: 22px var(--s-4) var(--s-3);
    background: var(--list);
    box-shadow: var(--lezi);
    rotate: -1deg;
    font-size: calc(var(--meritko) * 19px);
    line-height: 1.35;
  }
  .postoj + .postoj { rotate: .8deg; }
  .postoj__jmeno { display: block; margin-bottom: var(--s-1); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; line-height: 1.3; color: var(--p); }
  .spendlik {
    position: absolute;
    top: -7px;
    left: calc(50% - 8px);
    width: 16px;
    height: 16px;
    border-radius: var(--r-plne);
    background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--pp) 55%, #fff), var(--pp) 62%);
    box-shadow: 1px 3px 4px rgb(0 0 0 / .35);
  }

  .skala { margin: 0 0 var(--s-4); padding: 0; border: 0; min-width: 0; }
  .skala__konce { display: flex; justify-content: space-between; margin-bottom: var(--s-1); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
  .skala__konce span { display: inline-flex; align-items: center; gap: var(--s-2); color: var(--ink); }
  /* Stopa: provázek s pěti uzlíky; uzlíky mají cíl 44 px a sedí na křivce provázku. */
  .skala__stopa {
    position: relative;
    height: calc(44px + 24px + 8px);
    /* Svislé posouvání stránky zůstává, vodorovný pohyb prstu patří provázku. */
    touch-action: pan-y;
    cursor: pointer;
    user-select: none;
  }
  .skala__stopa--zamcena { cursor: default; }
  .provazek { position: absolute; left: 22px; right: 22px; top: 22px; width: calc(100% - 44px); height: 48px; overflow: visible; fill: none; stroke: var(--tuzka); stroke-width: 1.5; }
  .provazek path { vector-effect: non-scaling-stroke; }
  .provazek__konec { position: absolute; top: 17px; width: 10px; height: 10px; border-radius: var(--r-plne); background: var(--tuzka); }
  .provazek__konec--l { left: 17px; }
  .provazek__konec--r { right: 17px; }
  /* Šipka tužkou nad provázkem: odkud kam se student posunul. */
  .sipka { position: absolute; top: 0; height: 0; border-top: 1.5px dashed var(--pero); }
  .sipka::after { content: ''; position: absolute; top: -6.5px; width: 0; height: 0; border-block: 5.5px solid transparent; }
  .sipka--vpravo::after { right: -2px; border-left: 9px solid var(--pero); }
  .sipka--vlevo::after { left: -2px; border-right: 9px solid var(--pero); }
  .stop {
    position: absolute;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--r-plne);
  }
  .stop:has(input:focus-visible) { outline: 2px solid var(--ink); outline-offset: 2px; }
  .stop__bod {
    width: 10px;
    height: 10px;
    border-radius: var(--r-plne);
    background: var(--tuzka);
    transition: scale var(--d-stisk) var(--k-stisk);
  }
  /* Uprostřed (nevím, obojí) prázdný uzlík. */
  .stop:nth-of-type(3) .stop__bod { background: var(--papir); box-shadow: inset 0 0 0 1.5px var(--tuzka); }
  @media (hover: hover) { .skala__stopa:not(.skala__stopa--zamcena) .stop:hover .stop__bod { scale: 1.6; background: var(--ink); } }
  .stop--vybrany .stop__bod { opacity: 0; }
  /* Kde student začal: čárkovaný kroužek jeho perem. */
  .stop--zacatek::before { content: ''; position: absolute; inset: 4px; border-radius: var(--r-plne); border: 1.5px dashed var(--pero); }
  /* Mince studenta: list papíru s dvojitým kroužkem perem a „ty“ rukou. Jede jen po činu studenta (--d-presun). */
  .draha { position: absolute; left: 22px; right: 22px; top: 0; height: 0; container-type: inline-size; pointer-events: none; }
  .mince-pera {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: var(--r-plne);
    background: var(--list);
    box-shadow: var(--lezi), inset 0 0 0 2px var(--pero), inset 0 0 0 5px var(--list), inset 0 0 0 6px var(--pero);
    color: var(--pero);
    font-family: var(--font-ruka);
    font-size: calc(var(--meritko) * 17px);
    font-weight: 700;
    line-height: 1;
    transform: translate(calc(var(--t) * 100cqw - 23px), calc(var(--y) - 1px));
  }
  :global(.spor--ziva) .mince-pera { transition: transform var(--d-presun) var(--k-papir); }
  .skala__stav { margin: var(--s-1) 0 0; text-align: center; font-family: var(--font-sans); font-size: var(--fs-ovladani); color: var(--ink-2); }
  .skala__stav strong { font-family: var(--font-ruka); font-size: calc(var(--meritko) * 19px); font-weight: 400; color: var(--pero); }

  .argumenty { margin-top: var(--s-3); outline: none; }
  .argumenty:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
  .zacatek { margin: 0 0 var(--s-4); color: var(--ink-2); }
  /* Argumenty: dva ležící listy (text delší než dvě věty se nenatáčí). */
  .strany { display: grid; gap: var(--s-5) var(--s-4); margin-bottom: var(--s-6); }
  @container (min-width: 620px) {
    .strany { grid-template-columns: 1fr 1fr; }
  }
  .strana { padding: var(--s-4) var(--s-5) var(--s-5); background: var(--list); box-shadow: var(--lezi); }
  .strana > :last-child { margin-bottom: 0; }
  .strana p { font-size: var(--fs-ovladani-l); line-height: 1.55; }
  @media (min-width: 900px) { .strana p { font-size: calc(var(--meritko) * 19px); } }
  .strana__hlava { display: flex; align-items: center; gap: var(--s-3); margin-bottom: var(--s-3); }
  .strana__jmeno { margin: 0; font-family: var(--font-sans); font-size: var(--fs-ovladani-l); font-weight: 600; color: var(--p); }
  .posunout { margin: 0 0 var(--s-3); }
  .nepovinne { margin-left: var(--s-2); font-weight: 400; color: var(--ink-3); }

  /* Reflexe: zavřená je jeden řádek pod lístkem (stejný vzor jako „Co kdybys zvolil jinak?“ ve Volbě). */
  .reflexe { margin-top: var(--s-4); }
  .reflexe summary {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: var(--s-2);
    min-height: 44px;
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 600;
    cursor: pointer;
  }
  .reflexe__otazka { text-decoration: underline; text-decoration-color: var(--tuzka); text-underline-offset: 0.2em; }
  .reflexe summary .nepovinne { margin-left: 0; }
  .reflexe__telo { margin-top: var(--s-3); padding-left: var(--s-4); border-left: 1.5px dashed var(--tuzka); }
  .reflexe__vyber { display: grid; gap: var(--s-3); min-width: 0; margin: 0 0 var(--s-4); padding: 0; border: 0; }
  .reflexe__strana { margin: var(--s-2) 0 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; color: var(--p); }
  .reflexe__strana:first-of-type { margin-top: 0; }
  .arg {
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    min-height: 48px;
    padding: var(--s-3) var(--s-4);
    border-radius: var(--r-ovladani);
    font-size: var(--fs-ovladani-l);
    line-height: 1.45;
    color: var(--ink);
  }
  .arg:has(input:focus-visible) { outline: 2px solid var(--ink); outline-offset: 3px; }
  .arg--jiny { font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 500; }
  .arg__bod { flex: none; width: 18px; height: 18px; margin-top: 3px; border-radius: var(--r-plne); box-shadow: inset 0 0 0 1.5px var(--tuzka); }
  .arg--vybrany .arg__bod { background: var(--pero); box-shadow: inset 0 0 0 3px var(--list); outline: 1.5px solid var(--pero); }
  .reflexe__stav { margin: 0; }
</style>
