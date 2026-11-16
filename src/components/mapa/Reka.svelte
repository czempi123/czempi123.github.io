<script lang="ts">
  // Řeka životů: pruhy celých životů v okně kolem zvoleného roku. Žijící v barvě období, ostatní vybledlí,
  // vybraný silnější s prstencem. Svislá čára roku navazuje na jezdec posuvníku nad řekou.
  // Oblouky vztahů: plná čára učitel a žák, tečkovaná znali se, čárkovaná vliv textem, vlnovka polemika.
  // Čáry vysvětluje legenda (LegendaVztahu): na notebooku řádek pod řekou, na telefonu tlačítko Legenda v hlavičce.
  // Textová alternativa: seznam žijících ve zvoleném roce.
  // K7a: výchozí jsou jen čáry učitel a žák (Všechny čáry přidají ostatní), větší řádky, legenda barev období
  // a zvýraznění současníků vybraného člověka (kdo s ním aspoň rok žil).
  import { tick, untrack } from 'svelte';
  import type { OsobaV, MistoV, VstupMapy, ObdobiV } from '../../lib/mapa-vstup';
  import { naAstro, zivotOsoby, zijeVRoce, kdeVRoce, vekVRoce, let_ } from '../../lib/cas-mapy';
  import { rok as rokText } from '../../lib/casy';
  import { LEGENDA_VZTAHU } from '../../lib/vztahy';
  import LegendaVztahu from './LegendaVztahu.svelte';

  const NAZEV_TYPU: Record<string, string> = Object.fromEntries(LEGENDA_VZTAHU.map((v) => [v.typ, v.nazev]));

  interface Props {
    lide: OsobaV[];
    vztahy: VstupMapy['vztahy'];
    mista: Map<string, MistoV>;
    rok: number;
    okno: [number, number];
    vybrany?: string;
    telefon: boolean;
    obdobi: ObdobiV[];
    onvyber: (id: string) => void;
  }
  let { lide, vztahy, mista, rok, okno, vybrany, telefon, obdobi, onvyber }: Props = $props();

  const podil = (r: number) => (naAstro(r) - naAstro(okno[0])) / (naAstro(okno[1]) - naAstro(okno[0]));
  let radek = $derived(telefon ? 30 : 22);
  // Výchozí jen učitel a žák: jedno kódování na první pohled (pravidla nástrojů po auditu).
  let vsechnyCary = $state(false);
  let typyCar = $derived(vsechnyCary ? undefined : ['ucitel']);

  let radky = $derived(
    lide
      .map((o) => ({ o, z: zivotOsoby(o)! }))
      .filter(({ z }) => z && z.do >= okno[0] && z.od <= okno[1])
      .sort((a, b) => a.z.od - b.z.od || a.z.do - b.z.do),
  );
  let indexPodleId = $derived(new Map(radky.map((r, i) => [r.o.id, i])));
  let zijici = $derived(radky.filter(({ o }) => zijeVRoce(o, rok)));
  // Současníci vybraného: jejich životy se s jeho aspoň rok překrývají.
  let zivotVybraneho = $derived(vybrany ? radky.find((r) => r.o.id === vybrany)?.z : undefined);
  const soucasnik = (z: { od: number; do: number }, id: string) => !!zivotVybraneho && id !== vybrany && z.od <= zivotVybraneho.do && z.do >= zivotVybraneho.od;
  // Legenda barev: období, jejichž lidé jsou v okně řeky.
  let obdobiVOkne = $derived(obdobi.filter((ob) => radky.some(({ o }) => o.obdobi === ob.id)));

  // Osa po 50 letech.
  let znacky = $derived.by(() => {
    const out: number[] = [];
    const krok = naAstro(okno[1]) - naAstro(okno[0]) > 400 ? 100 : 50;
    for (let r = Math.ceil(okno[0] / krok) * krok; r <= okno[1]; r += krok) out.push(r === 0 ? 1 : r);
    return out.filter((r) => r >= okno[0]);
  });
  const popisZnacky = (r: number, i: number) => {
    const text = String(Math.abs(r));
    const prvni = i === 0 || (r > 0 && znacky[i - 1] < 0);
    return prvni ? `${text}${r < 0 ? ' př. n. l.' : ' n. l.'}` : text;
  };

  // Oblouky vztahů mezi lidmi, kteří jsou v okně.
  const W = 1000;
  let oblouky = $derived.by(() => {
    const out: { d: string; typ: string; vybrany: boolean; tradovany: boolean; popis: string }[] = [];
    for (const v of vztahy) {
      if (typyCar && !typyCar.includes(v.typ)) continue;
      const a = indexPodleId.get(v.od);
      const b = indexPodleId.get(v.k);
      if (a === undefined || b === undefined) continue;
      const za = radky[a].z;
      const zb = radky[b].z;
      const od = Math.max(za.od, zb.od);
      const do_ = Math.min(za.do, zb.do);
      let r: number;
      if (v.typ === 'vliv-textem') r = Math.max(za.do, zb.od + 15);
      else if (od <= do_) r = Math.round((od + do_) / 2);
      else r = zb.od;
      r = Math.min(Math.max(r, zb.od), zb.do);
      const x = Math.min(W - 4, Math.max(4, podil(r) * W));
      const y1 = a * radek + radek / 2;
      const y2 = b * radek + radek / 2;
      const ohyb = Math.min(40, 8 + Math.abs(y2 - y1) * 0.12);
      let d: string;
      if (v.typ === 'polemika') {
        const n = Math.max(3, Math.round(Math.abs(y2 - y1) / 8));
        d = `M${x} ${y1}`;
        for (let i = 1; i <= n; i++) {
          const y = y1 + ((y2 - y1) * i) / n;
          d += ` L${x + (i % 2 ? 7 : -1)} ${y - (y2 - y1) / n / 2} L${x} ${y}`;
        }
      } else d = `M${x} ${y1} Q${x + ohyb} ${(y1 + y2) / 2} ${x} ${y2}`;
      const jm = (id: string) => radky[indexPodleId.get(id)!].o.jmeno;
      const popisTypu = NAZEV_TYPU[v.typ];
      out.push({ d, typ: v.typ, vybrany: v.od === vybrany || v.k === vybrany, tradovany: !!v.tradovany, popis: `${jm(v.od)} → ${jm(v.k)}: ${popisTypu}` });
    }
    return out.sort((p, q) => Number(p.vybrany) - Number(q.vybrany));
  });

  let seznam = $state(false);
  // Legenda na telefonu: rozbalovací panel u tlačítka; zavře ho Esc (fokus se vrátí na tlačítko) nebo klepnutí vedle.
  let legenda = $state(false);
  let tlLegenda: HTMLButtonElement | undefined = $state();
  function klavesaOkna(e: KeyboardEvent) {
    if (e.key === 'Escape' && legenda) {
      legenda = false;
      tlLegenda?.focus();
    }
  }
  function klepnutiOkna(e: PointerEvent) {
    if (legenda && !(e.target as Element | null)?.closest?.('.legenda-obal')) legenda = false;
  }
  let telo: HTMLDivElement | undefined = $state();
  let vyskaTela = $state(0);
  let aktivniIndex = $state(0);

  // Posun, aby byl vidět vybraný člověk (nebo první žijící) po změně výběru či okna.
  $effect(() => {
    void okno;
    // i když se řeka právě ukázala (na telefonu v záložce)
    if (!vyskaTela) return;
    const v = vybrany;
    const cil = v && indexPodleId.has(v) ? indexPodleId.get(v)! : untrack(() => radky.findIndex(({ o }) => zijeVRoce(o, rok)));
    if (!telo || cil < 0) return;
    aktivniIndex = cil;
    const y = cil * radek;
    if (y < telo.scrollTop + 4 || y + radek > telo.scrollTop + telo.clientHeight - 4) {
      telo.scrollTo({ top: Math.max(0, y - telo.clientHeight / 3), behavior: 'auto' });
    }
  });

  async function klavesa(e: KeyboardEvent, i: number) {
    let j = i;
    if (e.key === 'ArrowDown') j = Math.min(radky.length - 1, i + 1);
    else if (e.key === 'ArrowUp') j = Math.max(0, i - 1);
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = radky.length - 1;
    else return;
    e.preventDefault();
    aktivniIndex = j;
    await tick();
    (telo?.querySelector(`[data-radek="${j}"]`) as HTMLElement | null)?.focus();
  }
  const kde = (o: OsobaV) => {
    const p = kdeVRoce(o, rok);
    return p ? mista.get(p.misto)?.nazev : undefined;
  };
  const vekText = (o: OsobaV) => {
    const v = vekVRoce(o, rok);
    return v === null ? '' : `${o.narozen?.priblizne ? 'asi ' : ''}${let_(v)}`;
  };
</script>

<svelte:window onkeydown={klavesaOkna} onpointerdown={klepnutiOkna} />

<section class="reka" class:reka--telefon={telefon} style:--radek="{radek}px" aria-labelledby="reka-nadpis">
  <div class="reka__osa">
    <div class="reka__hlava">
      <h2 id="reka-nadpis" class="reka__nadpis">Řeka životů</h2>
      <div class="reka__tlacitka">
        {#if !seznam}
          <button type="button" class="prepinac" aria-pressed={vsechnyCary} onclick={() => (vsechnyCary = !vsechnyCary)}>Všechny čáry</button>
        {/if}
        {#if telefon && !seznam}
          <div class="legenda-obal">
            <button type="button" class="prepinac" bind:this={tlLegenda} aria-expanded={legenda} aria-controls="legenda-vztahu" onclick={() => (legenda = !legenda)}>Legenda</button>
            {#if legenda}
              <div class="legenda-panel" id="legenda-vztahu">
                <LegendaVztahu svisle typy={typyCar} />
                {@render barvy()}
              </div>
            {/if}
          </div>
        {/if}
        <button type="button" class="prepinac" aria-pressed={seznam} onclick={() => { seznam = !seznam; legenda = false; }}>{seznam ? 'Řeka' : 'Seznam'}</button>
      </div>
    </div>
    <div class="reka__znacky" aria-hidden="true">
      {#each znacky as z, i (z)}
        <span class="znacka" style:left="{podil(z) * 100}%">{popisZnacky(z, i)}</span>
      {/each}
      <span class="cara-roku cara-roku--osa" style:left="{podil(rok) * 100}%"></span>
    </div>
  </div>

  {#if seznam}
    <div class="reka__seznam">
      <p class="seznam__uvod">V roce {rokText(rok)} {zijici.length === 1 ? 'žije' : 'žije'} {zijici.length} {zijici.length === 1 ? 'člověk' : zijici.length < 5 ? 'lidé' : 'lidí'} z atlasu.</p>
      <ul>
        {#each zijici as { o } (o.id)}
          <li class="obdobi-{o.obdobi}">
            <button type="button" class="seznam__jmeno" aria-pressed={o.id === vybrany} onclick={() => onvyber(o.id)}>{o.jmeno}</button>
            <span class="seznam__udaje">{[vekText(o), kde(o)].filter(Boolean).join(' · ')}</span>
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <div class="reka__telo" bind:this={telo} bind:clientHeight={vyskaTela}>
      <div class="reka__obsah" style:height="{radky.length * radek}px">
        <svg class="oblouky" viewBox="0 0 {W} {Math.max(1, radky.length * radek)}" preserveAspectRatio="none" aria-hidden="true">
          {#each oblouky as ob}
            <path d={ob.d} class="oblouk oblouk--{ob.typ}" class:oblouk--vybrany={ob.vybrany} class:oblouk--tradovany={ob.tradovany}><title>{ob.popis}</title></path>
          {/each}
        </svg>
        <span class="cara-roku" style:left="{podil(rok) * 100}%" aria-hidden="true"></span>
        <ul class="radky" aria-label="Životy v letech {rokText(okno[0])} až {rokText(okno[1])}">
          {#each radky as { o, z }, i (o.id)}
            {@const zije = rok >= z.od && rok <= z.do}
            {@const l = Math.max(0, podil(z.od))}
            {@const p = Math.min(1, podil(z.do))}
            <li class="radek obdobi-{o.obdobi}" class:radek--vybrany={o.id === vybrany} class:radek--soucasnik={soucasnik(z, o.id)} class:radek--mimo={!!zivotVybraneho && o.id !== vybrany && !soucasnik(z, o.id)} style:top="{i * radek}px">
              <span class="radek__jmeno" aria-hidden="true"><span>{o.jmeno}</span><small>{o.zivot}</small></span>
              <div class="radek__cas">
                <button
                  type="button"
                  class="pruh"
                  class:pruh--zije={zije}
                  class:pruh--asi-od={z.odPriblizne}
                  class:pruh--asi-do={z.doPriblizne}
                  style:left="{l * 100}%"
                  style:width="{Math.max(0.6, (p - l) * 100)}%"
                  data-radek={i}
                  tabindex={i === aktivniIndex ? 0 : -1}
                  aria-pressed={o.id === vybrany}
                  aria-label="{o.jmeno}, {o.zivot}{zije ? ', žije' : ''}{soucasnik(z, o.id) ? ', současník' : ''}"
                  onclick={() => onvyber(o.id)}
                  onkeydown={(e) => klavesa(e, i)}
                  onfocus={() => (aktivniIndex = i)}
                >
                  <span class="pruh__jmeno" aria-hidden="true">{o.jmeno}</span>
                </button>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
    {#if !telefon}
      <div class="reka__legenda">
        <span class="reka__legenda-nadpis" aria-hidden="true">Čáry mezi životy</span>
        <LegendaVztahu typy={typyCar} />
        {@render barvy()}
      </div>
    {/if}
  {/if}
</section>

{#snippet barvy()}
  <ul class="barvy" aria-label="Barvy období">
    {#each obdobiVOkne as ob (ob.id)}
      <li class="obdobi-{ob.id}"><span class="barvy__vzorek" aria-hidden="true"></span>{ob.kratce}</li>
    {/each}
  </ul>
{/snippet}

<style>
  .reka { display: grid; grid-template-rows: 24px minmax(0, 1fr) auto; height: 100%; min-height: 0; font-family: var(--font-sans); }
  .reka__osa { display: grid; grid-template-columns: var(--zlab) 1fr; padding-right: var(--s-4); border-bottom: 1px solid var(--linka); }
  .reka__hlava { display: flex; align-items: center; justify-content: space-between; gap: var(--s-2); padding: 0 var(--s-2) 0 var(--s-3); }
  .reka__nadpis { font-family: var(--font-sans); font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-3); }
  .prepinac {
    height: 22px;
    padding: 0 9px;
    border: 0;
    border-radius: var(--r-plne);
    background: var(--plocha);
    box-shadow: var(--vyst-m);
    color: var(--ink);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  .prepinac[aria-pressed='true'] { background: var(--papir); box-shadow: var(--vtla-mele); }
  .reka__tlacitka { display: flex; align-items: center; gap: var(--s-2); }
  /* Legenda: na notebooku stále viditelný řádek pod řekou, na telefonu panel u tlačítka. */
  .reka__legenda { display: flex; flex-wrap: wrap; align-items: center; gap: 0 var(--s-3); min-height: 24px; padding: 0 var(--s-4) 0 var(--s-3); border-top: 1px solid var(--linka); }
  .reka__legenda-nadpis { flex: none; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-3); }
  @media (max-width: 1279px) { .reka__legenda-nadpis { display: none; } }
  .legenda-obal { position: relative; display: flex; }
  .legenda-panel {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 6;
    padding: var(--s-2) var(--s-3);
    border-radius: var(--r-ovladani);
    background: var(--listek);
    box-shadow: var(--lezi);
  }
  .prepinac[aria-expanded='true'] { background: var(--papir); box-shadow: var(--vtla-mele); }
  .barvy { display: flex; flex-wrap: wrap; gap: 0 var(--s-2); margin: 0; padding: 0; list-style: none; font-size: var(--fs-popisek); color: var(--ink-2); }
  .barvy li { display: flex; align-items: center; gap: 6px; min-height: 24px; white-space: nowrap; }
  .barvy__vzorek { width: 18px; height: 6px; border-radius: 3px; background: var(--p); }
  .legenda-panel .barvy { flex-direction: column; margin-top: var(--s-2); padding-top: var(--s-2); border-top: 1px dashed var(--tuzka); }
  .reka__znacky { position: relative; }
  .znacka {
    position: absolute;
    top: 4px;
    padding-left: 4px;
    border-left: 1px solid var(--linka);
    font-size: var(--fs-popisek);
    line-height: 16px;
    color: var(--ink-3);
    white-space: nowrap;
    font-variant-numeric: lining-nums;
  }
  .cara-roku { position: absolute; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: var(--ink); pointer-events: none; z-index: 2; }
  .reka__telo { position: relative; min-height: 0; overflow-y: auto; scrollbar-width: none; overscroll-behavior: contain; }
  .reka__telo::-webkit-scrollbar { display: none; }
  .reka__obsah { position: relative; margin-left: var(--zlab); margin-right: var(--s-4); }
  .oblouky { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; overflow: visible; }
  .oblouk { fill: none; stroke: var(--ink-2); stroke-width: 1.3; opacity: 0.4; vector-effect: non-scaling-stroke; }
  .oblouk--znali-se { stroke-dasharray: 1.5 3; stroke-linecap: round; }
  .oblouk--vliv-textem { stroke-dasharray: 6 4; }
  .oblouk--tradovany { opacity: 0.25; }
  .oblouk--vybrany { stroke: var(--ink); stroke-width: 1.8; opacity: 1; }
  .radky { margin: 0; padding: 0; list-style: none; }
  .radek { position: absolute; left: calc(-1 * var(--zlab)); right: 0; height: var(--radek); display: grid; grid-template-columns: var(--zlab) 1fr; }
  .radek--vybrany { background: var(--papir); box-shadow: var(--vtla-mele); }
  .radek--soucasnik .radek__jmeno span { font-weight: 600; color: var(--ink); }
  .radek--soucasnik .pruh::before { background: var(--p); opacity: 0.7; }
  .radek--soucasnik .pruh--zije::before { opacity: 1; }
  .radek--mimo .pruh::before { opacity: 0.18; }
  .radek--mimo .radek__jmeno { color: var(--ink-3); }
  .radek__jmeno {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding: 0 var(--s-2) 0 var(--s-3);
    overflow: hidden;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
  }
  .radek__jmeno span { overflow: hidden; text-overflow: ellipsis; }
  .radek__jmeno small { font-size: 11px; color: var(--ink-3); font-variant-numeric: lining-nums; }
  .radek--vybrany .radek__jmeno span { font-weight: 600; }
  .radek__cas { position: relative; grid-column: 2; }
  .pruh {
    position: absolute;
    top: 0;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
  }
  .pruh::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 8px;
    margin-top: -4px;
    border-radius: 4px;
    background: var(--ink-3);
    opacity: 0.32;
  }
  .pruh--zije::before { background: var(--p); opacity: 1; }
  .pruh--asi-od::before { -webkit-mask-image: linear-gradient(90deg, transparent, #000 10px); mask-image: linear-gradient(90deg, transparent, #000 10px); }
  .pruh--asi-do::before { -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 10px), transparent); mask-image: linear-gradient(90deg, #000 calc(100% - 10px), transparent); }
  .pruh--asi-od.pruh--asi-do::before { -webkit-mask-image: linear-gradient(90deg, transparent, #000 10px, #000 calc(100% - 10px), transparent); mask-image: linear-gradient(90deg, transparent, #000 10px, #000 calc(100% - 10px), transparent); }
  .radek--vybrany .pruh::before { height: 12px; margin-top: -6px; border-radius: 6px; box-shadow: 0 0 0 2px var(--papir), 0 0 0 3.5px var(--p); }
  .pruh:hover::before { opacity: 1; }
  .pruh:focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }
  .pruh__jmeno { display: none; }

  /* Telefon: jméno nad pruhem, bez levého sloupce */
  .reka--telefon { grid-template-rows: 66px minmax(0, 1fr) auto; }
  .reka--telefon .prepinac { font-size: 13px; white-space: nowrap; }
  /* Na telefonu nese název záložka nad listem; v hlavičce řeky zůstanou tlačítka. */
  /* Název nese záložka (telefon) a zbytek nástroje; v hlavičce řeky zůstanou tlačítka (název jen pro čtečku). */
  .reka__nadpis { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .reka__hlava { justify-content: flex-end; }
  .reka--telefon .reka__osa { grid-template-columns: var(--zlab) 1fr; grid-template-rows: 44px 22px; }
  .reka--telefon .reka__hlava { grid-column: 1 / -1; padding: 0 0 0 var(--zlab); }
  .reka--telefon .reka__znacky { grid-column: 2; }
  .reka--telefon .radek__jmeno { display: none; }
  /* Tlačítka v hlavičce řeky: na telefonu vyšší a s dotykovým cílem 44 px, který se celý vejde do hlavičky. */
  .reka--telefon .reka__hlava { padding-right: var(--s-3); }
  .reka--telefon .prepinac { position: relative; height: 32px; padding: 0 12px; font-size: 13px; }
  .reka--telefon .prepinac::after { content: ''; position: absolute; inset: -6px -3px; }
  .reka--telefon .pruh::before { top: auto; bottom: 4px; margin-top: 0; }
  .reka--telefon .pruh__jmeno {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    font-size: var(--fs-popisek);
    line-height: 13px;
    color: var(--ink-2);
    white-space: nowrap;
  }
  .reka--telefon .pruh--zije .pruh__jmeno, .reka--telefon .radek--vybrany .pruh__jmeno { color: var(--ink); font-weight: 600; }
  .reka--telefon .radek--vybrany .pruh::before { bottom: 2px; }

  .reka__seznam { overflow-y: auto; padding: var(--s-3) var(--s-4) var(--s-4); }
  .seznam__uvod { margin: 0 0 var(--s-2); font-size: 14px; color: var(--ink-2); }
  .reka__seznam ul { columns: 15rem; margin: 0; padding: 0; list-style: none; }
  .reka__seznam li { break-inside: avoid; padding: 2px 0; font-size: 14px; }
  .seznam__jmeno { padding: 0; border: 0; background: none; font-weight: 600; text-decoration: underline; text-decoration-color: var(--p); text-underline-offset: 3px; cursor: pointer; }
  .seznam__jmeno[aria-pressed='true'] { text-decoration-thickness: 2px; }
  .seznam__udaje { color: var(--ink-3); font-size: 13px; }
</style>
