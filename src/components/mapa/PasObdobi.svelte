<script lang="ts">
  // Malý pás období: přepínač období se závorkou okna řeky a značkou zvoleného roku.
  // Tlačítko Přehled otevře celých 2 600 let s hustotou myslitelů pro rychlý skok.
  // Připravované období je šrafované (ne jen vybledlé) a po klepnutí to řekne zprávou.
  // Číslo a název stojí na čistém štítku v papíru období: ornament ani šrafování pod textem neprobíhají.
  // Vzhled (design-v2, K7a; jako pás na Domů z K6): odtrhávací lístky v papíru období, mezi nimi perforace z teček,
  // zvolené období je vtlačené; na telefonu je pás vodorovně posuvný.
  import type { ObdobiV } from '../../lib/mapa-vstup';
  import { naAstro } from '../../lib/cas-mapy';
  import { rok as rokText } from '../../lib/casy';

  interface Props {
    obdobi: ObdobiV[];
    aktivni: number;
    rok: number;
    okno: [number, number];
    hustota: { od: number; pocet: number }[];
    dejiny: [number, number];
    rozsah: [number, number];
    onvyber: (id: number) => void;
    onskok: (rok: number) => void;
    /** klepnutí na období, které ještě není otevřené */
    onpripravuje?: (o: ObdobiV) => void;
  }
  let { obdobi, aktivni, rok, okno, hustota, dejiny, rozsah, onvyber, onskok, onpripravuje }: Props = $props();

  const podil = (r: number, od: number, do_: number) => Math.min(1, Math.max(0, (naAstro(r) - naAstro(od)) / (naAstro(do_) - naAstro(od))));

  let akt = $derived(obdobi.find((o) => o.id === aktivni)!);
  let zavorka = $derived({ l: podil(okno[0], akt.okno.od, akt.okno.do), p: podil(okno[1], akt.okno.od, akt.okno.do) });
  let znacka = $derived(podil(rok, akt.okno.od, akt.okno.do));

  let prehled = $state(false);
  let tlacitko: HTMLButtonElement;
  const maxPocet = $derived(Math.max(1, ...hustota.map((h) => h.pocet)));
  const obdobiRoku = (r: number) => obdobi.find((o) => r >= o.okno.od && r <= o.okno.do)?.id ?? 8;
  const W = 1000;
  const x = (r: number) => podil(r, dejiny[0], dejiny[1]) * W;
  const stoleti = $derived.by(() => {
    const out: number[] = [];
    for (let r = Math.ceil(rozsah[0] / 100) * 100; r <= rozsah[1]; r += 100) out.push(r === 0 ? 1 : r);
    return out;
  });

  function skok(r: number) {
    onskok(r);
    prehled = false;
    tlacitko?.focus();
  }
  function klikGraf(e: MouseEvent) {
    const svg = e.currentTarget as SVGSVGElement;
    const b = svg.getBoundingClientRect();
    const f = (e.clientX - b.left) / b.width;
    const a = naAstro(dejiny[0]) + f * (naAstro(dejiny[1]) - naAstro(dejiny[0]));
    let r = Math.round(a);
    r = r <= 0 ? r - 1 : r;
    if (r < rozsah[0] || r > rozsah[1]) return;
    skok(r);
  }
  function klavesa(e: KeyboardEvent) {
    if (e.key === 'Escape' && prehled) {
      prehled = false;
      tlacitko?.focus();
    }
  }
</script>

<svelte:window onkeydown={klavesa} />

<div class="pas">
  <nav class="pas__segmenty" aria-label="Období">
    {#each obdobi as o (o.id)}
      {@const siroky = o.id === aktivni}
      <button
        type="button"
        class="mseg obdobi-{o.id}"
        class:mseg--aktivni={siroky}
        aria-current={siroky ? 'true' : undefined}
        aria-disabled={!o.otevrene ? 'true' : undefined}
        title={o.otevrene ? `${o.nazev} · ${o.oknoText}` : `${o.nazev} · ${o.oknoText} · připravujeme`}
        onclick={() => (o.otevrene ? onvyber(o.id) : onpripravuje?.(o))}
      >
        <svg viewBox="0 0 {siroky ? 180 : 60} 26" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d={siroky ? o.ornament.siroky : o.ornament.uzky} fill="none" stroke="currentColor" stroke-width="1" opacity="0.55" />
        </svg>
        <span class="mseg__text"><span class="mseg__stitek">{siroky ? `${o.id} · ${o.kratce}` : o.id}</span></span>
        <span class="vizualne-skryte">{siroky ? '' : o.nazev}{o.otevrene ? '' : ' připravujeme'}</span>
        {#if siroky}
          <span class="zavorka" style:left="{zavorka.l * 100}%" style:width="{(zavorka.p - zavorka.l) * 100}%" aria-hidden="true"></span>
          <span class="znacka" style:left="{znacka * 100}%" aria-hidden="true"></span>
        {/if}
      </button>
    {/each}
  </nav>
  <button type="button" class="pas__prehled" bind:this={tlacitko} aria-expanded={prehled} aria-controls="prehled-dejin" onclick={() => (prehled = !prehled)}>
    Přehled
  </button>

  {#if prehled}
    <div class="prehled" id="prehled-dejin" role="dialog" aria-label="Přehled dějin: skok na rok">
      <p class="prehled__nadpis">2 600 let myšlení · výška = kolik myslitelů v atlasu žije</p>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <svg class="prehled__graf" viewBox="0 0 {W} 70" preserveAspectRatio="none" onclick={klikGraf} role="img" aria-label="Hustota myslitelů v čase">
        {#each obdobi as o (o.id)}
          <rect x={x(o.okno.od)} y="62" width={Math.max(1, x(Math.min(o.okno.do, obdobi[o.id]?.okno.od ?? o.okno.do)) - x(o.okno.od))} height="8" fill="var(--p-{o.id})" opacity={o.otevrene ? 0.9 : 0.35} />
        {/each}
        {#each hustota as h}
          {#if h.pocet}
            <rect x={x(h.od)} y={58 - (h.pocet / maxPocet) * 52} width={W / hustota.length - 1} height={(h.pocet / maxPocet) * 52} fill="var(--p-{obdobiRoku(h.od + 12)})" />
          {/if}
        {/each}
        <line x1={x(rok)} x2={x(rok)} y1="0" y2="70" stroke="var(--ink)" stroke-width="2" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="prehled__osa" aria-hidden="true">
        <span>{rokText(dejiny[0])}</span><span class="prehled__prelom" style:left="{(x(1) / W) * 100}%">1 n. l.</span><span>dnes</span>
      </div>
      <ul class="prehled__stoleti" aria-label="Skok na rok">
        {#each stoleti as r}
          <li><button type="button" onclick={() => skok(r)} aria-current={Math.abs(naAstro(r) - naAstro(rok)) < 50 ? 'true' : undefined}>{rokText(r)}</button></li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .pas { position: relative; display: flex; align-items: center; gap: var(--s-3); height: 100%; }
  /* Odtrhávací lístky: papír období, perforace z teček mezi nimi, jemný reliéf; celý pás vystupuje z papíru. */
  .pas__segmenty { display: flex; flex: 1; min-width: 0; height: 30px; filter: var(--pas-stin); }
  .mseg {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    padding: 0;
    border: 0;
    background: linear-gradient(155deg, rgb(255 255 255 / .08) 0%, transparent 40%, transparent 60%, rgb(0 0 0 / .14) 100%), var(--pp);
    box-shadow: inset 1.5px 1.5px 0 rgb(255 255 255 / .18), inset -2px -3px 6px rgb(0 0 0 / .22);
    color: var(--na-papiru);
    font-family: var(--font-sans);
    cursor: pointer;
    transition: transform var(--d-listek) var(--k-papir);
    transform-origin: 50% 0;
  }
  .mseg:first-child { border-radius: var(--r-ovladani) 0 0 var(--r-ovladani); }
  .mseg:last-child { border-radius: 0 var(--r-ovladani) var(--r-ovladani) 0; }
  /* Perforace: tečky v papíru stránky na hranici mezi lístky. */
  .mseg + .mseg::after {
    content: '';
    position: absolute;
    left: -1px;
    top: 3px;
    bottom: 3px;
    width: 2px;
    z-index: 1;
    background: radial-gradient(circle, var(--papir) 0 1px, transparent 1.3px) 0 0 / 2px 5px repeat-y;
    pointer-events: none;
  }
  @media (hover: hover) {
    .mseg:not(.mseg--aktivni):not([aria-disabled='true']):hover { transform: translateY(3px) rotate(1.6deg); z-index: 2; }
  }
  /* Připravované období: šrafování a čárkovaný rámeček, aby rozdíl nestál jen na barvě; po najetí se nezvedne. */
  .mseg[aria-disabled='true'] {
    cursor: default;
    background: repeating-linear-gradient(135deg, transparent 0 4px, rgb(0 0 0 / 26%) 4px 6px), var(--pp);
  }
  .mseg[aria-disabled='true']::before { content: ''; position: absolute; inset: 3px; z-index: 1; border: 1px dashed currentColor; border-radius: 2px; opacity: 0.75; pointer-events: none; }
  /* Zvolené období je vtlačené. */
  .mseg--aktivni { flex: 3.2 1 0; box-shadow: inset 3px 3px 9px rgb(0 0 0 / .5), inset -2px -2px 5px rgb(255 255 255 / .14); cursor: default; }
  .mseg svg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .7; }
  .mseg__text {
    position: relative;
    display: grid;
    place-items: center;
    height: 100%;
    font-size: 12px;
    font-weight: 700;
    font-variant-numeric: lining-nums;
    white-space: nowrap;
    overflow: hidden;
  }
  /* Štítek pod textem: plný papír období s měkkým okrajem, text v barvě pro papír období (aspoň 5 : 1). */
  .mseg__stitek {
    padding: 0 4px;
    border-radius: 2px;
    background: var(--pp);
    box-shadow: 0 0 3px 2px var(--pp);
    color: var(--na-papiru);
    line-height: 16px;
  }
  .mseg--aktivni .mseg__stitek { padding: 0 8px; box-shadow: 0 0 5px 3px var(--pp); }
  @media (min-width: 900px) {
    .mseg__text { font-size: 13px; }
  }
  .mseg:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; z-index: 3; }
  .zavorka {
    position: absolute;
    bottom: -7px;
    height: 5px;
    border: 1.5px solid var(--ink);
    border-top: 0;
    border-radius: 0 0 2px 2px;
    pointer-events: none;
  }
  .znacka { position: absolute; top: 62%; bottom: -8px; width: 2px; margin-left: -1px; background: var(--ink); pointer-events: none; }
  .pas__prehled {
    flex: none;
    height: 32px;
    padding: 0 var(--s-3);
    border: 0;
    border-radius: var(--r-plne);
    background: var(--plocha);
    box-shadow: var(--vyst-m);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
  .pas__prehled[aria-expanded='true'] { background: var(--papir); box-shadow: var(--vtla-mele); }
  .prehled {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    z-index: 30;
    padding: var(--s-4) var(--s-4) var(--s-4);
    background: var(--list);
    box-shadow: var(--lezi);
    font-family: var(--font-sans);
  }
  .prehled__nadpis { margin: 0 0 var(--s-2); font-size: 13px; color: var(--ink-2); }
  .prehled__graf { width: 100%; height: 70px; cursor: pointer; }
  .prehled__prelom { position: absolute; translate: -50% 0; }
  .prehled__osa { position: relative; display: flex; justify-content: space-between; font-size: 12px; color: var(--ink-3); }
  .prehled__stoleti { display: flex; flex-wrap: wrap; gap: 4px; margin: var(--s-3) 0 0; padding: 0; list-style: none; }
  .prehled__stoleti button {
    min-height: 32px;
    padding: 0 8px;
    border: 0;
    border-radius: var(--r-razitko);
    background: var(--papir);
    box-shadow: var(--vtla-mele);
    color: var(--ink);
    font-size: 12px;
    font-variant-numeric: lining-nums;
    cursor: pointer;
  }
  .prehled__stoleti button[aria-current] { box-shadow: var(--vtla); font-weight: 700; }
  /* Telefon: pás je vodorovně posuvný, lístky mají svou šířku (zvolené období širší). */
  @media (max-width: 899px) {
    .pas__segmenty { overflow-x: auto; overflow-y: hidden; scrollbar-width: none; padding-bottom: 8px; margin-bottom: -8px; height: 38px; }
    .pas__segmenty::-webkit-scrollbar { display: none; }
    .mseg { flex: 0 0 44px; height: 30px; }
    .mseg--aktivni { flex: 0 0 150px; }
  }
</style>
