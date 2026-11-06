<script lang="ts">
  // Osa hlasů na začátku oddílu Proč to tak viděli (stránka velké otázky; větev interaktivita-v2, krok K1).
  // Hlasy na vodorovné ose v poměru let: mince v polovině života, pod ní pruh života, nad osou letopočty, za posledním
  // hlasem zlom a „dnes“. Mince jsou odkazy na hlas v seznamu pod osou (#hlas-<osoba>). Volba je zvlášť: výzva
  // „Kdo z nich je ti nejblíž?“ a tlačítko pro každý hlas a „Nikdo z nich“; po volbě dojede značka „Ty“, mince se
  // zvýrazní, pod osou jsou dvě věty z dat a hlas v seznamu dostane štítek „Tobě nejblíž“. Volba je stav bloku
  // otazka-<slug>-osa v deníku; jde změnit i smazat (Začít znovu). Kresba je SVG ve třech šířkách, které přepíná
  // dotaz na šířku obalu, takže stojí i bez JavaScriptu; výzva se ukáže až po hydrataci. Na plátně (promítání)
  // výzva zůstane jako otázka pro třídu, tlačítka, značka a věty se neukážou.
  // Logika a texty: src/lib/osa-hlasu.ts. Použití (jen v src/components/otazka/OsaHlasu.astro):
  //   <OsaHlasu client:load slug="jak-zit" hlasy={hlasy} popis={popisOsy(hlasy)} />
  import { onMount, tick, untrack } from 'svelte';
  import { omezenyPohyb } from '../../lib/pohyb';
  import { stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { klicOtazky } from '../../lib/otazky';
  import {
    rozlozeniOsy, vetyPoVolbe, volbaZeStavu, stavZVolby, OSA_HLASU, NIKDO, VETA_NIKDO, VYSKA_TY,
    type HlasOsy, type SirkaOsy,
  } from '../../lib/osa-hlasu';
  import Mince from '../mapa/Mince.svelte';

  interface Props {
    slug: string;
    /** hlasy v pořadí stránky (podle narození) */
    hlasy: HlasOsy[];
    /** popis kresby pro čtečky (popisOsy) */
    popis: string;
  }
  let { slug, hlasy, popis }: Props = $props();

  const klic = klicOtazky(slug).osa;
  const ids = hlasy.map((h) => h.id);
  const podleId = new Map(hlasy.map((h) => [h.id, h]));
  const SIRKY: SirkaOsy[] = ['uzka', 'stredni', 'siroka'];
  const kresby = SIRKY.map((s) => ({ s, r: rozlozeniOsy(hlasy, s) }));

  let koren: HTMLElement | undefined = $state();
  let skupina: HTMLElement | undefined = $state();
  let pripraveno = $state(false);
  let volba = $state<string | null>(null);
  /** Kam míří značka „Ty“: hlas, „nikdo“ (u dneška), nebo nic. Při první volbě stojí chvíli u dneška a pak dojede. */
  let znacka = $state<string | null>(null);
  let vety = $derived(vetyPoVolbe(volba, hlasy));
  /** Ke které minci vede čára od značky: až značka dojede (při omezeném pohybu hned). */
  let cara = $state<string | null>(null);
  $effect(() => {
    const z = znacka;
    untrack(() => {
      cara = null;
    });
    if (!z || z === NIKDO) return;
    const t = setTimeout(() => {
      cara = z;
    }, omezenyPohyb() ? 0 : 600);
    return () => clearTimeout(t);
  });

  /** Štítek „Tobě nejblíž“ u hlasu v seznamu pod osou (HlasyOsa.astro ho má skrytý u každého hlasu). */
  function stitky() {
    const sekce = koren?.closest('section') ?? document;
    sekce.querySelectorAll<HTMLElement>('[data-nejbliz]').forEach((el) => {
      el.hidden = el.dataset.nejbliz !== volba;
    });
  }

  onMount(() => {
    volba = volbaZeStavu(stavBloku(klic), ids);
    znacka = volba;
    pripraveno = true;
    stitky();
  });

  async function zvol(id: string) {
    const prvni = znacka === null;
    volba = id;
    ulozStavBloku(klic, stavZVolby(id));
    stitky();
    if (prvni && id !== NIKDO) {
      znacka = NIKDO;
      await tick();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (volba === id) znacka = id;
      }));
    } else znacka = id;
  }

  function znovu() {
    volba = null;
    znacka = null;
    cara = null;
    smazStavBloku(klic);
    stitky();
    skupina?.querySelector<HTMLButtonElement>('button')?.focus();
  }

  type Kresba = (typeof kresby)[number]['r'];
  /** Vodorovná poloha značky „Ty“ v jedné kresbě: pod zvolenou mincí, u „nikdo“ u dneška. */
  function poloha(r: Kresba): number {
    const m = znacka && znacka !== NIKDO ? r.mince.find((x) => x.id === znacka) : undefined;
    return m ? m.x : r.dnes - 14;
  }
  /** Svislá čára od zvolené mince ke značce; začíná pod jménem (pod pruhem na úzké kresbě), aby nepřetnula text. */
  function caraKMinci(r: Kresba): { x: number; y: number; vyska: number } | null {
    const m = cara ? r.mince.find((x) => x.id === cara) : undefined;
    if (!m) return null;
    const y = m.popisek ? m.popisek.y + 6 : m.pruhY + 7;
    return { x: m.x, y, vyska: Math.max(0, r.yTy - y) };
  }
</script>

<div class="osa" bind:this={koren}>
  {#each kresby as { s, r } (s)}
    {@const R = r.rozmery}
    {@const x = poloha(r)}
    {@const c = caraKMinci(r)}
    <svg class="osa__kresba osa__kresba--{s}" viewBox="0 0 {R.sirka} {r.vyska}" role="group" aria-label={popis} style:--pismo="{R.pismo}px">
      <!-- Osa, letopočty, zlom a dnešek -->
      <g class="osa__cas" aria-hidden="true">
        <line class="osa__linka" x1="4" x2={r.zlom - 5} y1={r.yOsa} y2={r.yOsa} />
        <line class="osa__linka" x1={r.zlom + 5} x2={r.dnes} y1={r.yOsa} y2={r.yOsa} />
        {#each r.znacky as z (z.x)}
          <line class="osa__dilek" x1={z.x} x2={z.x} y1={r.yOsa - 4} y2={r.yOsa + 4} />
          <text class="osa__rok" x={z.x} y={r.yOsa - 10} text-anchor="middle">{z.text}</text>
        {/each}
        <line class="osa__zlom" x1={r.zlom - 7} y1={r.yOsa + 7} x2={r.zlom - 2} y2={r.yOsa - 7} />
        <line class="osa__zlom" x1={r.zlom + 2} y1={r.yOsa + 7} x2={r.zlom + 7} y2={r.yOsa - 7} />
        <line class="osa__dnes" x1={r.dnes} x2={r.dnes} y1={r.yOsa - 6} y2={r.yOsa + 6} />
        <text class="osa__rok osa__rok--dnes" x={R.sirka - 2} y={r.yOsa - 10} text-anchor="end">dnes</text>
        <text class="osa__doDneska" x={(r.zlom + 8 + r.dnes) / 2} y={r.yOsa + 18} text-anchor="middle">{r.doDneska}</text>
      </g>

      <!-- Značka „Ty“ (pod pruhy a mincemi, aby čára vedla za nimi) -->
      {#if pripraveno && znacka}
        <!-- Čára se nehýbe: objeví se u mince, až k ní značka dojede (cara), při omezeném pohybu hned. -->
        <g class="ty" data-cast="zpetna" aria-hidden="true">
          {#if c && c.vyska > 0}<rect class="ty__cara" x={c.x - 0.75} y={c.y} width="1.5" height={c.vyska} />{/if}
          <g class="ty__znacka" style:transform="translate({x}px, 0px)">
            <rect class="ty__stitek" x="-17" y={r.yTy} width="34" height={VYSKA_TY - 4} rx="11" />
            <text class="ty__text" x="0" y={r.yTy + 15.5} text-anchor="middle">{OSA_HLASU.ty}</text>
          </g>
        </g>
      {/if}

      <!-- Spojky od osy k mincím a pruhy životů -->
      <g aria-hidden="true">
        {#each r.mince as m (m.id)}
          {@const h = podleId.get(m.id)!}
          <g class="obdobi-{h.obdobi}">
            <line class="osa__spojka" x1={m.x} x2={m.x} y1={r.yOsa + 5} y2={m.cy - R.r - 1} />
            <rect class="osa__pruh" x={m.odX} y={m.pruhY} width={Math.max(2, m.doX - m.odX)} height="3" rx="1.5" />
          </g>
        {/each}
      </g>

      <!-- Mince: odkazy na hlas v seznamu -->
      {#each r.mince as m (m.id)}
        {@const h = podleId.get(m.id)!}
        {@const ik = Math.round(R.r * 1.12)}
        <a href={`#hlas-${m.id}`} class="m obdobi-{h.obdobi}" class:m--zvolena={volba === m.id} aria-label={`${h.jmeno}, ${h.zivotText}`}>
          <circle class="m__plocha" cx={m.x} cy={m.cy} r={R.r + 6} />
          <circle class="m__fokus" cx={m.x} cy={m.cy} r={R.r + 4} />
          <circle class="m__kruh" cx={m.x} cy={m.cy} r={R.r} />
          <circle class="m__vnitrek" cx={m.x} cy={m.cy} r={R.r - 3.5} />
          {#if h.ikona}
            <use class="m__ikona" href={`/ikony/atributy.svg#${h.ikona}`} x={m.x - ik / 2} y={m.cy - ik / 2} width={ik} height={ik} />
          {/if}
          {#if m.popisek}
            <text class="m__jmeno" x={m.popisek.x} y={m.popisek.y} text-anchor="middle">{h.jmeno}</text>
          {/if}
        </a>
      {/each}
    </svg>
  {/each}

  {#if pripraveno}
    <div class="volba">
      <p class="volba__vyzva" id={`${slug}-osa-vyzva`} data-cast="otazka">{OSA_HLASU.vyzva}</p>
      <div class="volba__moznosti" bind:this={skupina} role="group" aria-labelledby={`${slug}-osa-vyzva`} data-cast="moznosti">
        {#each hlasy as h (h.id)}
          <button type="button" class="moznost obdobi-{h.obdobi}" aria-pressed={volba === h.id} data-osoba={h.id} onclick={() => zvol(h.id)}>
            <Mince ikona={h.ikona} obdobi={h.obdobi} varianta={volba === h.id ? 'sel' : 'tint'} velikost={28} />
            <span>{h.jmeno}</span>
          </button>
        {/each}
        <button type="button" class="moznost moznost--nikdo" aria-pressed={volba === NIKDO} data-osoba={NIKDO} onclick={() => zvol(NIKDO)}>
          <span>{OSA_HLASU.nikdo}</span>
        </button>
      </div>
      <div class="volba__vety" class:volba__vety--plne={!!volba} aria-live="polite" data-cast="zpetna">
        {#if vety.vzdalenost}<p>{vety.vzdalenost}</p>{/if}
        {#if vety.nejdal}<p>{vety.nejdal}</p>{/if}
        {#if vety.nikdo}<p>{VETA_NIKDO.text}<a href={VETA_NIKDO.kotva}>{VETA_NIKDO.odkaz}</a></p>{/if}
      </div>
      {#if volba}
        <p class="blok__akce volba__akce" data-cast="moznosti">
          <button class="blok__tl blok__tl--tiche" type="button" onclick={znovu}>{OSA_HLASU.znovu}</button>
        </p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .osa { container-type: inline-size; }
  .osa__kresba { display: none; width: 100%; height: auto; overflow: visible; font-family: var(--font-sans); }
  .osa__kresba--uzka { display: block; }
  @container (min-width: 520px) {
    .osa__kresba--uzka { display: none; }
    .osa__kresba--stredni { display: block; }
  }
  @container (min-width: 800px) {
    .osa__kresba--stredni { display: none; }
    .osa__kresba--siroka { display: block; }
  }

  .osa__linka { stroke: var(--ink-2); stroke-width: 1.5; }
  .osa__dilek, .osa__dnes { stroke: var(--ink-2); stroke-width: 1.5; }
  .osa__zlom { stroke: var(--ink-2); stroke-width: 1.5; stroke-linecap: round; }
  .osa__rok { font-size: var(--pismo); fill: var(--ink-2); font-variant-numeric: lining-nums; }
  .osa__rok--dnes { font-weight: 600; fill: var(--ink); }
  .osa__doDneska { font-size: calc(var(--pismo) - 1px); fill: var(--muted); font-variant-numeric: lining-nums; }
  .osa__spojka { stroke: var(--rule); stroke-width: 1; stroke-dasharray: 2 3; }
  .osa__pruh { fill: var(--pc); opacity: 0.55; }

  .m { cursor: pointer; text-decoration: none; }
  .m__plocha { fill: transparent; }
  .m__fokus { fill: none; stroke: transparent; stroke-width: 2.5; }
  .m:focus { outline: none; }
  .m:focus-visible .m__fokus { stroke: var(--ink); }
  .m__kruh { fill: var(--surface); stroke: var(--pc); stroke-width: 1.5; transition: fill var(--pohyb) ease; }
  .m__vnitrek { fill: var(--pc-tint); stroke: var(--pc-soft); stroke-width: 1; transition: fill var(--pohyb) ease; }
  .m__ikona { color: var(--pc); }
  /* Obrys v barvě papíru: čára značky „Ty“ k minci v nižším řádku jde za jménem, ne přes něj. */
  .m__jmeno { font-size: var(--pismo); fill: var(--ink); font-weight: 500; paint-order: stroke; stroke: var(--paper); stroke-width: 5px; stroke-linejoin: round; }
  .m:hover .m__kruh { fill: var(--pc-tint); }
  .m--zvolena .m__kruh, .m--zvolena .m__vnitrek { fill: var(--pc); }
  .m--zvolena .m__vnitrek { stroke: color-mix(in srgb, var(--paper) 45%, transparent); }
  .m--zvolena .m__ikona { color: var(--paper); }
  .m--zvolena .m__jmeno { font-weight: 700; }

  .ty__znacka { transition: transform var(--pohyb-kamera) ease; }
  .ty__cara { fill: var(--ink); }
  .ty__stitek { fill: var(--ink); }
  .ty__text { font-size: 13px; font-weight: 700; fill: var(--paper); }

  .volba { margin-top: var(--s-5); }
  .volba__vyzva { margin: 0 0 var(--s-3); font-family: var(--font-serif); font-size: var(--fs-h3); line-height: var(--lh-h3); }
  .volba__moznosti { display: flex; flex-wrap: wrap; gap: var(--s-2); }
  .moznost {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    min-height: 44px;
    padding: 6px var(--s-4) 6px 8px;
    border: 1.5px solid var(--rule);
    border-radius: var(--r-full);
    background: var(--surface);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 500;
    cursor: pointer;
  }
  .moznost--nikdo { padding-left: var(--s-4); }
  .moznost:hover { border-color: var(--pc, var(--muted)); }
  .moznost[aria-pressed='true'] { border: 2px solid var(--pc, var(--ink)); background: var(--pc-tint, var(--sunk)); font-weight: 700; }
  .moznost--nikdo[aria-pressed='true'] { border-color: var(--ink); background: var(--sunk); }
  .moznost:focus { outline: none; }
  .moznost:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .volba__vety { max-width: var(--ctenarsky-sloupec); }
  .volba__vety--plne { margin-top: var(--s-4); padding: var(--s-4) var(--s-5); border-radius: var(--r-sm); background: var(--sunk); }
  .volba__vety p { margin: 0; }
  .volba__vety p + p { margin-top: var(--s-3); }
  .volba__akce { margin-top: var(--s-3); }

  /* Na plátně hlasuje třída zvednutím ruky: zůstane osa a otázka. */
  :global(html.promitani) .osa [data-cast='moznosti'],
  :global(html.promitani) .osa [data-cast='zpetna'] { display: none; }
</style>
