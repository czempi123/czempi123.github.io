<script lang="ts">
  // Posuvník roku: po jednom roce (tažení, šipky na klávesnici), tlačítky a PageUp/PageDown po deseti.
  // Stopa ukazuje okno řeky životů, takže jezdec navazuje na svislou čáru roku v řece pod ním.
  // U okraje stopy se okno při tažení samo posouvá. Nad stopou jsou dějinné kotvy ve dvou řádcích:
  // nahoře názvy, pod nimi značky (pruh pro období, tečka pro jeden rok). Značka tak nikdy nezasáhne do cizího názvu
  // a tečka uvnitř pruhu (bitva během války) má světlý okraj. Název, který se nevejde vedle sousedního, se schová
  // a ukáže se jako štítek po najetí myší nebo při fokusu z klávesnice (rozmístění: src/lib/kotvy.ts).
  // Vzhled (design-v2, K7a): drážka vtlačená do papíru, jezdec jako razítko s dvojitým kruhem v inkoustu období,
  // letopočet rukou v inkoustu období.
  import { onMount } from 'svelte';
  import type { UdalostV } from '../../lib/mapa-vstup';
  import { rozmistiNazvy, mistoStitku, type KotvaNaOse } from '../../lib/kotvy';
  import { naAstro, zAstro, posunRok, omezRok } from '../../lib/cas-mapy';
  import { rok as rokText, rozpeti } from '../../lib/casy';

  interface Props {
    rok: number;
    okno: [number, number];
    rozsah: [number, number];
    kotvy: UdalostV[];
    onzmena: (rok: number, zdroj: 'tah' | 'klavesa' | 'tlacitko' | 'konec-tahu') => void;
    onokno: (okno: [number, number]) => void;
    /** kolik lidí z atlasu ve zvoleném roce žije (věta pod letopočtem) */
    zije?: number;
  }
  let { rok, okno, rozsah, kotvy, onzmena, onokno, zije }: Props = $props();
  const vetaZije = (n: number) => (n === 1 ? 'žije 1 člověk z atlasu' : n > 1 && n < 5 ? `žijí ${n} lidé z atlasu` : `žije ${n} lidí z atlasu`);

  const podil = (r: number) => (naAstro(r) - naAstro(okno[0])) / (naAstro(okno[1]) - naAstro(okno[0]));
  let poloha = $derived(Math.min(1, Math.max(0, podil(rok))));
  let sirkaStopy = $state(800);
  // Šířky názvů změřené v prohlížeči skutečným písmem; do té doby odhad podle počtu znaků.
  let sirky = $state<Record<string, number>>({});
  let kotvyEl: HTMLUListElement;
  /** šířka cíle pro myš u události jednoho roku */
  const CIL = 16;
  function zmerNazvy() {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx || !kotvyEl) return;
    const cs = getComputedStyle(kotvyEl);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    sirky = Object.fromEntries(kotvy.map((k) => [k.id, Math.ceil(ctx.measureText(k.nazev).width) + 2]));
  }
  onMount(() => {
    zmerNazvy();
    document.fonts?.ready.then(zmerNazvy);
    addEventListener('resize', zmerNazvy);
    return () => removeEventListener('resize', zmerNazvy);
  });
  // Kotvy v okně a místo pro jejich názvy: název jen tam, kde se nepotká s jiným (jinak značka a štítek po najetí).
  let viditelneKotvy = $derived.by(() => {
    const v = kotvy.filter((k) => (k.do ?? k.od) >= okno[0] && k.od <= okno[1]).sort((a, b) => a.od - b.od);
    const naOse: KotvaNaOse[] = v.map((k) => ({
      id: k.id,
      x1: podil(k.od) * sirkaStopy,
      x2: k.do ? podil(k.do) * sirkaStopy : null,
      sirka: sirky[k.id] ?? k.nazev.length * 7.2 + 8,
    }));
    const mista = rozmistiNazvy(naOse, sirkaStopy);
    return v.map((k, i) => {
      const o = naOse[i];
      const levy = o.x2 === null ? o.x1 - CIL / 2 : Math.max(0, o.x1);
      const nazev = mista.get(k.id);
      return { k, popisek: nazev !== undefined, posun: Math.round((nazev ?? mistoStitku(o, sirkaStopy)) - levy) };
    });
  });

  let stopa: HTMLDivElement;
  let tahne = $state(false);
  let posunTimer: ReturnType<typeof setInterval> | null = null;
  let posledniF = 0;

  function rokZPodilu(f: number): number {
    const a = naAstro(okno[0]) + f * (naAstro(okno[1]) - naAstro(okno[0]));
    return omezRok(zAstro(Math.round(a)), rozsah[0], rozsah[1]);
  }
  function podilZUdalosti(e: PointerEvent) {
    const b = stopa.getBoundingClientRect();
    return (e.clientX - b.left) / b.width;
  }
  function zastavPosun() {
    if (posunTimer) clearInterval(posunTimer);
    posunTimer = null;
  }
  function posunOkna(smer: -1 | 1) {
    if (posunTimer) return;
    posunTimer = setInterval(() => {
      const [od, do_] = okno;
      if ((smer < 0 && od <= rozsah[0]) || (smer > 0 && do_ >= rozsah[1])) return zastavPosun();
      const krok = 2 * smer;
      const nove: [number, number] = [posunRok(od, krok), posunRok(do_, krok)];
      if (nove[0] < rozsah[0] || nove[1] > rozsah[1]) return zastavPosun();
      onokno(nove);
      onzmena(smer < 0 ? nove[0] : nove[1], 'tah');
    }, 40);
  }
  // Tažení: nejvýš jedna změna roku za snímek (na slabém telefonu chodí pointermove častěji, než stíhá kreslení).
  let snimek = 0;
  function tah(e: PointerEvent) {
    const f = podilZUdalosti(e);
    posledniF = f;
    if (f < 0.015) posunOkna(-1);
    else if (f > 0.985) posunOkna(1);
    else zastavPosun();
    if (snimek) return;
    snimek = requestAnimationFrame(() => {
      snimek = 0;
      if (tahne) onzmena(rokZPodilu(Math.min(1, Math.max(0, posledniF))), 'tah');
    });
  }
  function dolu(e: PointerEvent) {
    if (e.button !== 0) return;
    tahne = true;
    stopa.setPointerCapture(e.pointerId);
    posledniF = podilZUdalosti(e);
    (stopa.querySelector('[role=slider]') as HTMLElement)?.focus({ preventScroll: true });
    tah(e);
  }
  function pohyb(e: PointerEvent) {
    if (tahne) tah(e);
  }
  function nahoru(e: PointerEvent) {
    if (!tahne) return;
    tahne = false;
    zastavPosun();
    cancelAnimationFrame(snimek);
    snimek = 0;
    stopa.releasePointerCapture?.(e.pointerId);
    onzmena(rokZPodilu(Math.min(1, Math.max(0, posledniF))), 'konec-tahu');
  }
  function klavesa(e: KeyboardEvent) {
    const krok: Record<string, number> = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -10, PageUp: 10 };
    let novy: number | null = null;
    if (e.key in krok) novy = posunRok(rok, krok[e.key] * (e.shiftKey && Math.abs(krok[e.key]) === 1 ? 10 : 1));
    else if (e.key === 'Home') novy = rozsah[0];
    else if (e.key === 'End') novy = rozsah[1];
    if (novy === null) return;
    e.preventDefault();
    onzmena(omezRok(novy, rozsah[0], rozsah[1]), 'klavesa');
  }
  const o10 = (smer: -1 | 1) => onzmena(omezRok(posunRok(rok, 10 * smer), rozsah[0], rozsah[1]), 'tlacitko');
  const kotvaText = (k: UdalostV) => `${k.nazev}, ${k.do ? rozpeti(k.od, k.do) : rokText(k.od)}`;
</script>

<div class="posuvnik">
  <div class="posuvnik__rok">
    <button type="button" class="sipka vystouple vystouple--m" onclick={() => o10(-1)} disabled={rok <= rozsah[0]} aria-label="O 10 let zpět">
      <svg width="20" height="20" aria-hidden="true"><use href="/ikony/ui.svg#zpet" /></svg>
    </button>
    <output class="letopocet" aria-live="off">{rokText(rok)}</output>
    <button type="button" class="sipka vystouple vystouple--m" onclick={() => o10(1)} disabled={rok >= rozsah[1]} aria-label="O 10 let vpřed">
      <svg width="20" height="20" aria-hidden="true"><use href="/ikony/ui.svg#dal" /></svg>
    </button>
    {#if zije !== undefined}<p class="zije">{vetaZije(zije)}</p>{/if}
  </div>

  <div class="posuvnik__cas">
    <ul class="kotvy" aria-label="Dějinné události" bind:this={kotvyEl} bind:clientWidth={sirkaStopy}>
      {#each viditelneKotvy as { k, popisek, posun } (k.id)}
        {@const l = Math.max(0, podil(k.od))}
        {@const p = Math.min(1, podil(k.do ?? k.od))}
        <li class:kotva--pruh={!!k.do} class:kotva--bez-popisku={!popisek} style:left="{l * 100}%" style:width={k.do ? `${(p - l) * 100}%` : undefined}>
          <button type="button" class="kotva" title={kotvaText(k)} aria-label="{kotvaText(k)}: přejít" onclick={() => onzmena(k.od, 'tlacitko')}>
            <span class="kotva__znak" aria-hidden="true"></span>
            <span class="kotva__text" aria-hidden="true" style:left="{posun}px">{k.nazev}</span>
          </button>
        </li>
      {/each}
    </ul>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="stopa"
      class:stopa--tah={tahne}
      bind:this={stopa}
      onpointerdown={dolu}
      onpointermove={pohyb}
      onpointerup={nahoru}
      onpointercancel={nahoru}
    >
      <div class="stopa__draha"><div class="stopa__uplynulo" style:width="{poloha * 100}%"></div></div>
      <div
        class="jezdec"
        style:left="{poloha * 100}%"
        role="slider"
        tabindex="0"
        aria-label="Rok"
        aria-valuemin={rozsah[0]}
        aria-valuemax={rozsah[1]}
        aria-valuenow={rok}
        aria-valuetext={rokText(rok)}
        aria-keyshortcuts="ArrowLeft ArrowRight PageUp PageDown Home End"
        onkeydown={klavesa}
      ></div>
    </div>
  </div>
</div>

<style>
  .posuvnik {
    display: grid;
    grid-template-columns: var(--zlab) 1fr;
    align-items: stretch;
    height: 100%;
    font-family: var(--font-sans);
  }
  .posuvnik__rok { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-content: center; align-items: center; gap: 2px 4px; padding: 0 var(--s-2) 0 var(--s-3); }
  .zije { grid-column: 1 / -1; margin: 0; font-size: 13px; line-height: 1.2; color: var(--ink-2); text-align: center; }
  .letopocet {
    flex: 1;
    font-family: var(--font-ruka);
    font-size: var(--posuvnik-rok, 21px);
    font-weight: 700;
    line-height: 1;
    color: var(--p);
    text-align: center;
    white-space: nowrap;
    font-variant-numeric: lining-nums tabular-nums;
  }
  .sipka {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    flex: none;
    padding: 0;
    border-radius: var(--r-plne);
    color: var(--ink);
  }
  .sipka:disabled { opacity: 0.5; cursor: default; }
  .posuvnik__cas { position: relative; padding-right: var(--s-4); }
  /* Dějinné kotvy: řádek názvů (0–16 px) a pod ním řádek značek (16–27 px). */
  .kotvy {
    position: absolute;
    inset: 4px var(--s-4) auto 0;
    height: 28px;
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--ink-2);
    font-size: var(--fs-popisek);
    font-weight: 500;
    line-height: 1.2;
  }
  .kotvy li { position: absolute; top: 16px; height: 11px; }
  /* Událost jednoho roku leží nad pruhem období, ve kterém se stala, a dá se na ni klepnout. */
  .kotvy li:not(.kotva--pruh) { z-index: 1; }
  .kotvy li:hover, .kotvy li:focus-within { z-index: 3; }
  .kotva {
    position: absolute;
    left: -8px;
    top: 0;
    width: 16px;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .kotva--pruh .kotva { left: 0; width: 100%; min-width: 6px; }
  .kotva:focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; border-radius: var(--r-razitko); }
  .kotva__znak {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 7px;
    height: 7px;
    margin: -3.5px 0 0 -3.5px;
    border-radius: 999px;
    background: var(--ink-2);
    box-shadow: 0 0 0 2px var(--papir);
  }
  .kotva--pruh .kotva__znak {
    left: 0;
    right: 0;
    top: 3px;
    width: auto;
    height: 5px;
    margin: 0;
    border-radius: 3px;
    background: color-mix(in srgb, var(--tuzka) 55%, transparent);
    box-shadow: none;
  }
  .kotva__text { position: absolute; top: -16px; white-space: nowrap; }
  .kotva:hover .kotva__text, .kotva:focus-visible .kotva__text { color: var(--ink); text-decoration: underline; }
  .kotva:hover .kotva__znak, .kotva:focus-visible .kotva__znak { background: var(--ink); }
  .kotva--pruh .kotva:hover .kotva__znak, .kotva--pruh .kotva:focus-visible .kotva__znak { background: color-mix(in srgb, var(--ink-2) 60%, transparent); }
  /* Událost bez místa na název: název je schovaný a ukáže se po najetí nebo při fokusu jako štítek nad ostatními. */
  .kotva--bez-popisku .kotva__text { display: none; }
  .kotva--bez-popisku .kotva:hover .kotva__text,
  .kotva--bez-popisku .kotva:focus-visible .kotva__text {
    display: block;
    top: -18px;
    padding: 1px 6px;
    background: var(--listek);
    box-shadow: var(--lezi-tlak);
    text-decoration: none;
  }
  /* Drážka vtlačená do papíru (plátno .rozsah) a jezdec jako razítko: plocha vystoupí, dva kruhy v inkoustu období. */
  .stopa { position: absolute; left: 0; right: var(--s-4); bottom: 4px; height: 36px; touch-action: none; cursor: pointer; }
  .stopa__draha { position: absolute; left: 0; right: 0; top: 11px; height: 14px; border-radius: var(--r-plne); background: var(--papir); box-shadow: var(--vtla); }
  .stopa__uplynulo { display: none; }
  .jezdec {
    position: absolute;
    top: 3px;
    width: 30px;
    height: 30px;
    margin-left: -15px;
    border-radius: 50%;
    background: var(--plocha);
    box-shadow: var(--vyst-m), inset 0 0 0 2px var(--p), inset 0 0 0 7px var(--plocha), inset 0 0 0 9px var(--p);
    transition: transform var(--d-stisk) var(--k-stisk);
  }
  .jezdec::after { content: ''; position: absolute; left: 50%; top: 28px; width: 2px; height: 14px; margin-left: -1px; background: var(--ink); }
  .stopa--tah .jezdec { transform: scale(1.1); }
  .jezdec:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  @media (max-width: 899px) {
    .posuvnik { grid-template-rows: 36px 1fr; }
    .posuvnik__rok { grid-column: 1 / -1; display: flex; justify-content: center; gap: var(--s-3); padding: 4px var(--s-3) 0; }
    .zije { margin: 0; font-size: 12px; text-align: left; }
    .letopocet { flex: 0 1 auto; min-width: 9ch; }
    .sipka { width: 32px; height: 32px; }
    .posuvnik__cas { grid-column: 2; }
    /* Telefon: jen značky; název se ukáže jako štítek po klepnutí nebo při fokusu. */
    .kotvy { top: 0; height: 14px; }
    .kotvy li { top: 0; height: 14px; }
    .kotva:focus-visible { outline-offset: 0; }
    .kotva__znak { width: 6px; height: 6px; margin: -3px 0 0 -3px; }
    .kotva--pruh .kotva__znak { top: 5px; height: 4px; }
    .kotva__text { display: none; }
    .kotva:hover .kotva__text,
    .kotva:focus-visible .kotva__text {
      display: block;
      top: -4px;
      padding: 1px 6px;
      background: var(--listek);
      box-shadow: var(--lezi-tlak);
      text-decoration: none;
    }
    .stopa { bottom: 0; }
  }
</style>
