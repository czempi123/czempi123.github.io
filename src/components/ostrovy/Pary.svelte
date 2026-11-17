<script lang="ts">
  // Páry (herna-v1, K3): dvě řady lístků, pojmy z kolekce pojmy (pod jménem první věta vysvětlení) a situace ze
  // života šestnáctiletého. Spojení klepnutím na pojem a situaci (v libovolném pořadí); z klávesnice také výběrem
  // v seznamu u každého pojmu a tlačítkem Spojit. Spojený pár drží čára tužkou v SVG; pár, který nesedí, ukáže
  // čárkovanou čáru a lístek „zkus to jinak“ s větou, co ta situace ukazuje místo toho. Mezi situacemi jsou pasti
  // se stejným slovem. Po spojení všech otisk „sedí“ a jedna věta ke každému páru; po třech párech vedle Ukázat
  // páry. Do deníku jen stav. Na úzkém rámu stojí lístky pod sebou a čáry vedou levým okrajem.
  // Použití v MDX (obsah v src/content/bloky/dilna-pary.yaml, druh: pary):
  // <Pary id="dilna-pary" />
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import {
    platnyStavPar, spojPar, hotovePary, verdiktPar, sediPar, pokusPar, PARU_DO_UKAZANI, PRAZDNY_STAV_PAR, SEDI,
    type StavPar, type SituacePar,
  } from '../../lib/herna';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { Dal } from './bloky-typy';

  interface PojemPary { id: string; nazev: string; vyklad: string; vazba: string; adresa?: string }
  interface Props {
    id: string;
    blok: { obdobi: number; nadtitulek: string; nazev: string; scena?: string; otazka: string; pokyn: string; pojmy: PojemPary[]; situace: SituacePar[] };
    odkaz: string;
    dal?: Dal;
  }
  let { id, blok, odkaz, dal }: Props = $props();

  const pojmyIds = $derived(blok.pojmy.map((p) => p.id));
  let stav = $state<StavPar>({ ...PRAZDNY_STAV_PAR });
  let vybrany = $state<{ druh: 'pojem' | 'situace'; id: string } | null>(null);
  let cerstve = $state(false);
  let novaCara = $state<string | null>(null);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();
  let plocha = $state<HTMLElement>();
  let cary = $state<{ klic: string; d: string; vedle: boolean }[]>([]);
  let vybery = $state<Record<string, string>>({});

  const hotovo = $derived(hotovePary(stav, pojmyIds));
  const spojene = $derived(stav.ukazano ? pojmyIds : stav.spojeno);
  const situace = (sid: string) => blok.situace.find((s) => s.id === sid);
  const pojem = (pid: string) => blok.pojmy.find((p) => p.id === pid);
  const zkus = $derived.by(() => {
    if (hotovo || !stav.posledni) return null;
    const [p, s] = stav.posledni.split('|');
    const si = situace(s);
    return si ? { pojem: pojem(p), situace: si, v: verdiktPar(p, si) } : null;
  });
  const nabidnoutUkazani = $derived(!hotovo && stav.vedle.length >= PARU_DO_UKAZANI);
  const zacato = $derived(stav.spojeno.length > 0 || stav.vedle.length > 0 || stav.ukazano);
  const pasti = $derived(blok.situace.filter((s) => s.past));

  onMount(() => {
    const s = platnyStavPar(stavBloku(id), pojmyIds, blok.situace.map((x) => x.id));
    if (s) stav = s;
    const pozor = new ResizeObserver(() => prekresli());
    // Výběr ze seznamu je cesta pro klávesnici: ukáže se u pojmu s fokusem, jen když student ovládá klávesnicí
    // (Tab, Enter, mezerník v ploše). Myš a prst ho nevidí, jinak by lístek při klepnutí poskočil.
    const klavesa = (e: KeyboardEvent) => { if (['Tab', 'Enter', ' '].includes(e.key)) plocha!.dataset.klavesnice = ''; };
    const ukazatel = () => { delete plocha!.dataset.klavesnice; };
    if (plocha) {
      pozor.observe(plocha);
      for (const el of plocha.querySelectorAll('[data-pojem], [data-situace]')) pozor.observe(el);
      plocha.addEventListener('keydown', klavesa);
      plocha.addEventListener('pointerdown', ukazatel);
    }
    tick().then(prekresli);
    return () => {
      pozor.disconnect();
      plocha?.removeEventListener('keydown', klavesa);
      plocha?.removeEventListener('pointerdown', ukazatel);
    };
  });

  /** Čáry mezi spojenými lístky: vedle sebe přes mezeru mezi sloupci, pod sebou levým okrajem. */
  function prekresli() {
    if (!plocha) return;
    const r = plocha.getBoundingClientRect();
    const pod = r.width < 560;
    const kotva = (el: Element, vpravo: boolean) => {
      const b = el.getBoundingClientRect();
      return { x: (vpravo ? b.right : b.left) - r.left, y: b.top + b.height / 2 - r.top };
    };
    const usek = (p: string, s: string, i: number) => {
      const a = plocha!.querySelector(`[data-pojem="${p}"] .par-listek`);
      const b = plocha!.querySelector(`[data-situace="${s}"] .par-listek`);
      if (!a || !b) return null;
      const z = kotva(a, !pod);
      const k = kotva(b, false);
      if (pod) {
        const x = Math.max(3, z.x - 12 - (i % 4) * 5);
        return `M${z.x} ${z.y} C${x} ${z.y} ${x} ${k.y} ${k.x} ${k.y}`;
      }
      const dx = (k.x - z.x) / 2;
      return `M${z.x} ${z.y} C${z.x + dx} ${z.y} ${k.x - dx} ${k.y} ${k.x} ${k.y}`;
    };
    const nove: typeof cary = [];
    spojene.forEach((p, i) => {
      const d = usek(p, p, i);
      if (d) nove.push({ klic: pokusPar(p, p), d, vedle: false });
    });
    if (zkus) {
      const [p, s] = stav.posledni!.split('|');
      const d = usek(p, s, spojene.length);
      if (d) nove.push({ klic: stav.posledni!, d, vedle: true });
    }
    cary = nove;
  }

  function uloz() {
    if (!zacato) return smazStavBloku(id);
    ulozStavBloku(id, stav, { odkaz, otazka: blok.otazka, druh: 'pary', hotovo: hotovePary(stav, pojmyIds) });
  }
  const prvek = (vyber: string) => document.getElementById(id)?.querySelector<HTMLElement>(vyber);

  async function spoj(p: string, s: string, zKlavesnice: boolean) {
    const pred = stav;
    stav = spojPar(stav, p, s);
    vybrany = null;
    if (stav === pred) return;
    cerstve = true;
    novaCara = pokusPar(p, s);
    uloz();
    const ok = sediPar(p, s);
    const nazev = pojem(p)?.nazev ?? '';
    hlaseni = ok ? `${SEDI} Pojem ${nazev} je spojený.` : `Pojem ${nazev} a tahle situace: zkus to jinak.`;
    await tick();
    prekresli();
    if (hotovePary(stav, pojmyIds) || !ok) oblast?.focus();
    else if (zKlavesnice) {
      const dalsi = blok.pojmy.find((x) => !stav.spojeno.includes(x.id));
      if (dalsi) prvek(`[data-pojem="${dalsi.id}"] .par-listek`)?.focus();
    }
  }

  function klepniPojem(p: string, e: MouseEvent) {
    if (hotovo || spojene.includes(p)) return;
    if (vybrany?.druh === 'situace') return spoj(p, vybrany.id, e.detail === 0);
    vybrany = vybrany?.druh === 'pojem' && vybrany.id === p ? null : { druh: 'pojem', id: p };
    hlaseni = vybrany ? `Vybraný pojem ${pojem(p)?.nazev}. Teď klepni na situaci.` : '';
  }
  function klepniSituaci(s: string, e: MouseEvent) {
    if (hotovo || spojene.includes(s)) return;
    if (vybrany?.druh === 'pojem') return spoj(vybrany.id, s, e.detail === 0);
    vybrany = vybrany?.druh === 'situace' && vybrany.id === s ? null : { druh: 'situace', id: s };
    hlaseni = vybrany ? 'Vybraná situace. Teď klepni na pojem.' : '';
  }
  function spojVyberem(p: string) {
    const s = vybery[p];
    if (!s) return;
    vybery = { ...vybery, [p]: '' };
    spoj(p, s, true);
  }

  async function ukaz() {
    stav = { ...stav, ukazano: true, posledni: null };
    vybrany = null;
    cerstve = true;
    novaCara = null;
    uloz();
    hlaseni = 'Takhle to sedí.';
    await tick();
    prekresli();
    oblast?.focus();
  }

  async function znovu() {
    stav = { ...PRAZDNY_STAV_PAR };
    vybrany = null;
    vybery = {};
    cerstve = false;
    novaCara = null;
    hlaseni = 'Lístky jsou zase volné.';
    smazStavBloku(id);
    await tick();
    prekresli();
    prvek('.par-listek')?.focus();
  }
</script>

{#snippet vazba()}
  {#if hotovo}
    <p class="blok__zpetna-titulek">{stav.ukazano ? 'Takhle to sedí.' : SEDI}</p>
    <ul class="vety-paru">
      {#each blok.pojmy as p (p.id)}
        <li><span class="vety-paru__pojem">{p.nazev}</span> {@html radek(p.vazba)}</li>
      {/each}
    </ul>
    {#if pasti.length}
      <p class="vety-paru__titulek">A situace, které pojem jen připomínají</p>
      <ul class="vety-paru">
        {#each pasti as s (s.id)}
          <li><span class="vety-paru__past">„{@html radek(s.text)}“</span> {@html radek(s.jinak)}</li>
        {/each}
      </ul>
    {/if}
  {:else if zkus}
    <p class="zkus"><svg class="zkus__sipka" width="30" height="18" viewBox="0 0 30 18" aria-hidden="true" focusable="false"><path d="M2 12c6-7 15-9 24-4M20 3l6 5-7 3" /></svg>{zkus.v.slovo}</p>
    {#if zkus.v.veta}<p>{@html radek(zkus.v.veta)}</p>{/if}
  {/if}
{/snippet}

{#snippet akce()}
  {#if hotovo}
    <BlokDal {dal} />
  {:else}
    <button class="blok__tl blok__tl--vedlejsi vystouple" type="button" onclick={ukaz}>Ukázat páry</button>
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="pary"
  nadtitulek={blok.nadtitulek}
  nazev={blok.nazev}
  labelledby={`${id}-otazka`}
  vazba={hotovo || zkus ? vazba : undefined}
  vazbaPopisek={hotovo ? 'Spojené páry' : 'Zkus to jinak'}
  {cerstve}
  bind:vazbaPrvek={oblast}
  znovu={zacato ? znovu : undefined}
  hlavni={hotovo ? (dal ? akce : undefined) : nabidnoutUkazani ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>
  {#if !hotovo}<p class="pary__pokyn" id={`${id}-pokyn`}>{@html radek(blok.pokyn)}</p>{/if}

  <div class={['pary', hotovo && !stav.ukazano && 'pary--sedi']} bind:this={plocha} data-cast="moznosti">
    <svg class="pary__cary" aria-hidden="true" focusable="false">
      {#each cary as c (c.klic)}
        <path class={['cara', c.vedle && 'cara--vedle', cerstve && c.klic === novaCara && !c.vedle && 'cara--nova']} d={c.d} pathLength={c.vedle ? undefined : 1} />
      {/each}
    </svg>
    <ul class="pary__pojmy" aria-label="Pojmy">
      {#each blok.pojmy as p (p.id)}
        {@const spojen = spojene.includes(p.id)}
        {@const s = spojen ? situace(p.id) : undefined}
        <li class="par-pojem" data-pojem={p.id}>
          <button
            class={['par-listek', 'par-listek--pojem', spojen && 'par-listek--spojeny', vybrany?.druh === 'pojem' && vybrany.id === p.id && 'par-listek--vybrany']}
            type="button"
            aria-pressed={vybrany?.druh === 'pojem' && vybrany.id === p.id}
            aria-describedby={hotovo ? undefined : `${id}-pokyn`}
            disabled={spojen || hotovo}
            onclick={(e) => klepniPojem(p.id, e)}
          >
            <span class="par-listek__nazev">{#if spojen}<span aria-hidden="true">✓ </span>{/if}{p.nazev}</span>
            <span class="par-listek__vyklad">{@html radek(p.vyklad)}</span>
            {#if s}<span class="vizualne-skryte">Spojeno se situací: {s.text}</span>{/if}
          </button>
          {#if !spojen && !hotovo}
            <div class="par-vyber">
              <label class="vizualne-skryte" for={`${id}-vyber-${p.id}`}>Situace k pojmu {p.nazev}</label>
              <select id={`${id}-vyber-${p.id}`} class="par-vyber__seznam" bind:value={vybery[p.id]}>
                <option value="">Vyber situaci…</option>
                {#each blok.situace.filter((x) => !spojene.includes(x.id)) as x (x.id)}<option value={x.id}>{x.text}</option>{/each}
              </select>
              <button class="blok__tl blok__tl--tiche par-vyber__spojit" type="button" disabled={!vybery[p.id]} onclick={() => spojVyberem(p.id)}>Spojit</button>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
    <ul class="pary__situace" aria-label="Situace">
      {#each blok.situace as s (s.id)}
        {@const spojena = spojene.includes(s.id)}
        <li data-situace={s.id}>
          <button
            class={['par-listek', 'par-listek--situace', spojena && 'par-listek--spojeny', vybrany?.druh === 'situace' && vybrany.id === s.id && 'par-listek--vybrany']}
            type="button"
            aria-pressed={vybrany?.druh === 'situace' && vybrany.id === s.id}
            disabled={spojena || hotovo}
            onclick={(e) => klepniSituaci(s.id, e)}
          >{@html radek(s.text)}{#if spojena}<span class="vizualne-skryte"> Spojeno s pojmem {pojem(s.id)?.nazev}.</span>{/if}</button>
        </li>
      {/each}
    </ul>
    {#if hotovo && !stav.ukazano}<span class={['herni-otisk', 'pary__otisk', cerstve && 'otisk']} aria-hidden="true">sedí</span>{/if}
  </div>
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
</RamAktivity>

<style>
  .pary__pokyn { margin: 0 0 var(--s-3); font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  /* Úzký rám: pojmy nad situacemi, čáry vedou levým okrajem (34 px). Od 560 px šířky rámu dva sloupce a čáry
     přes mezeru mezi nimi. */
  .pary { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-5); margin: var(--s-3) 0 var(--s-5); padding-left: 34px; }
  @container (min-width: 560px) {
    .pary { grid-template-columns: minmax(0, 1fr) 72px minmax(0, 1.35fr); gap: 0; padding-left: 0; align-items: start; }
    .pary__situace { grid-column: 3; }
  }
  .pary__cary { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .cara { fill: none; stroke: var(--tuzka); stroke-width: 2; stroke-linecap: round; }
  .cara--nova { stroke-dasharray: 1; animation: tah-cary var(--d-tah) var(--k-papir) both; }
  .cara--vedle { stroke-dasharray: 3 6; }
  @keyframes tah-cary { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @media (prefers-reduced-motion: reduce) { .cara--nova { animation: none; } }
  :global(:root[data-klidny]) .cara--nova { animation: none; }

  .pary__pojmy, .pary__situace { display: grid; gap: var(--s-3); margin: 0; padding: 0; list-style: none; }
  .par-pojem { display: grid; gap: var(--s-1); }
  .par-listek {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    min-height: 44px;
    padding: var(--s-3) var(--s-4);
    border: 0;
    border-radius: 2px;
    background: var(--list);
    box-shadow: var(--lezi);
    color: var(--ink);
    text-align: left;
    cursor: pointer;
    transition: translate var(--d-stisk) var(--k-stisk);
  }
  .par-listek--pojem { background: var(--listek); }
  .par-listek--situace { font-family: var(--font-serif); font-size: calc(var(--meritko) * 16px); line-height: 1.4; }
  .par-listek__nazev { font-family: var(--font-sans); font-size: var(--fs-ovladani-l); font-weight: 700; line-height: 1.2; }
  .par-listek__vyklad { font-family: var(--font-serif); font-size: calc(var(--meritko) * 14.5px); line-height: 1.38; color: var(--ink-2); }
  @media (hover: hover) { .par-listek:not(:disabled):hover { translate: 0 -2px; } }
  .par-listek:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  /* Vybraný lístek čeká na druhý: obrys v barvě pera. Spojený je vtlačený s ✓ (stav nestojí jen na stínu). */
  .par-listek--vybrany { outline: 2px solid var(--pero); outline-offset: 3px; translate: 0 -2px; }
  .par-listek:disabled { cursor: default; color: var(--ink); }
  .par-listek--spojeny { box-shadow: var(--vtla); background: var(--plocha); }
  .par-listek--situace.par-listek--spojeny::after { content: '✓'; position: absolute; right: 8px; top: 4px; font-family: var(--font-sans); font-weight: 700; color: var(--ink-2); }
  .par-listek:disabled:not(.par-listek--spojeny) { opacity: .78; }

  /* Výběr z klávesnice: řádek se seznamem se ukáže u pojmu s fokusem, když plocha ví, že student ovládá klávesnicí
     (data-klavesnice nastaví klávesa, sundá ho ukazatel). Myš a prst ho nevidí. */
  .par-vyber { display: flex; gap: var(--s-2); align-items: center; }
  .pary:not([data-klavesnice]) .par-vyber, .par-pojem:not(:focus-within) .par-vyber { display: none; }
  .par-vyber__seznam { flex: 1; min-width: 0; min-height: 44px; padding: 0 var(--s-2); border: 1px solid var(--tuzka); border-radius: var(--r-ovladani); background: var(--list); color: var(--ink); font-family: var(--font-sans); font-size: var(--fs-ovladani); }
  .par-vyber__seznam:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .par-vyber__spojit { flex: none; min-height: 44px; }

  /* Otisk „sedí“ pod posledním lístkem, aby nezakryl text situace. */
  .pary--sedi { margin-bottom: calc(var(--s-5) + 72px); }
  .pary__otisk { position: absolute; right: 6px; bottom: -86px; z-index: 2; }

  .vety-paru { display: grid; gap: var(--s-2); margin: 0; padding: 0; list-style: none; }
  .vety-paru__pojem { font-family: var(--font-sans); font-weight: 700; }
  .vety-paru__pojem::after { content: ':'; }
  .vety-paru__past { font-style: italic; }
  .vety-paru__titulek { margin: var(--s-3) 0 var(--s-1); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }

  .zkus { display: flex; align-items: center; gap: var(--s-2); margin: 0 0 var(--s-2); font-family: var(--font-ruka); font-size: calc(var(--meritko) * 22px); line-height: 1.3; color: var(--ruka); }
  .zkus__sipka { flex: none; fill: none; stroke: var(--tuzka); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>
