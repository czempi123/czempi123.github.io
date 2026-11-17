<script lang="ts">
  // Najdi slabé místo (herna-v1, K3; plátno D5 › červená tužka): věty argumentu na linkovaném listu, premisy
  // s číslem a závěr. Student klepne na premisu, kterou nepřijímá, a červená tužka ji přeškrtne (stroke-dashoffset
  // v malém SVG, čára po každém řádku věty); jinak zvolí „Žádnou, argument mi drží“. Nepovinně připíše proč
  // a zapíše do deníku. Pak lístek: kdo by tu větu škrtl s ním a kdo ji hájil, hlasy z dat s citátem a místem.
  // Správná odpověď není a nic se nehodnotí.
  // Použití v MDX (obsah v src/content/bloky/dilna-slabe-zapas.yaml, druh: slabe):
  // <NajdiSlabeMisto id="dilna-slabe-zapas" />
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku, ulozZapis, smazZapis } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import { platnyStavSlabe, zapisSlabe, ZADNA } from '../../lib/herna';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import HlasHerny from './HlasHerny.svelte';
  import type { Dal, HlasHerny as THlas } from './bloky-typy';

  interface VetaSlabe { id: string; text: string; misto: 1 | 2 | 3 | 'zaver'; skrtl: THlas[]; hajil: THlas[] }
  interface Props {
    id: string;
    blok: { obdobi: number; nadtitulek: string; nazev: string; scena?: string; otazka: string; vety: VetaSlabe[]; drzi: THlas[] };
    odkaz: string;
    dal?: Dal;
  }
  let { id, blok, odkaz, dal }: Props = $props();

  const premisy = $derived(blok.vety.filter((v) => v.misto !== 'zaver'));
  let volba = $state<string | null>(null);
  let proc = $state('');
  let zapsano = $state(false);
  let cerstve = $state(false);
  let novyTah = $state(false);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();
  let list = $state<HTMLElement>();
  /** čáry přes řádky přeškrtnuté věty (v px vůči řádku listu) */
  let tahy = $state<{ x1: number; x2: number; y: number }[]>([]);

  const skrtnuta = $derived(premisy.find((v) => v.id === volba));

  onMount(() => {
    const s = platnyStavSlabe(stavBloku(id), premisy.map((v) => v.id));
    if (s) ({ volba, proc, zapsano } = s);
    const pozor = new ResizeObserver(() => prekresli());
    if (list) pozor.observe(list);
    tick().then(prekresli);
    return () => pozor.disconnect();
  });

  /** Čára červené tužky po každém řádku věty: obdélníky řádků textu (getClientRects) vůči řádku listu. */
  function prekresli() {
    if (!list || !skrtnuta) { tahy = []; return; }
    const radekListu = list.querySelector<HTMLElement>(`[data-veta="${skrtnuta.id}"]`);
    const text = radekListu?.querySelector('.veta-arg__text');
    if (!radekListu || !text) { tahy = []; return; }
    const r = radekListu.getBoundingClientRect();
    tahy = [...text.getClientRects()].filter((x) => x.width > 2).map((x) => ({ x1: x.left - r.left - 4, x2: x.right - r.left + 4, y: x.top - r.top + x.height * 0.56 }));
  }

  function ulozStav() {
    if (!volba) return smazStavBloku(id);
    ulozStavBloku(id, { volba, proc, zapsano }, { odkaz, otazka: blok.otazka, druh: 'slabe', hotovo: zapsano });
  }

  async function vyber(v: string) {
    if (zapsano) return;
    volba = volba === v ? null : v;
    novyTah = volba !== null && volba !== ZADNA;
    ulozStav();
    const text = premisy.find((x) => x.id === volba)?.text;
    hlaseni = volba === ZADNA ? 'Argument ti drží.' : text ? `Přeškrtnuto: ${text}` : 'Nic není přeškrtnuté.';
    await tick();
    prekresli();
  }

  async function zapis() {
    if (!volba || zapsano) return;
    proc = proc.trim();
    zapsano = true;
    cerstve = true;
    novyTah = false;
    ulozStav();
    ulozZapis({ id, otazka: blok.otazka, odpoved: zapisSlabe(blok.vety, volba, proc), odkaz, druh: 'slabe' });
    hlaseni = 'Zapsáno do deníku.';
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    volba = null;
    proc = '';
    zapsano = false;
    cerstve = false;
    novyTah = false;
    tahy = [];
    hlaseni = 'Nic není přeškrtnuté.';
    smazStavBloku(id);
    smazZapis(id);
    await tick();
    document.getElementById(id)?.querySelector<HTMLElement>('.veta-arg')?.focus();
  }

  const cislo = (m: VetaSlabe['misto']) => (m === 'zaver' ? 'Tedy' : String(m));
</script>

{#snippet vazba()}
  {#if skrtnuta}
    <p class="blok__zpetna-titulek">Kdo by tu větu škrtl s tebou</p>
    <ul class="hlasy-herny">{#each skrtnuta.skrtl as h (h.osoba + h.citat.kde)}<HlasHerny hlas={h} />{/each}</ul>
    {#if skrtnuta.hajil.length}
      <p class="hlasy__titulek">Kdo ji hájil</p>
      <ul class="hlasy-herny">{#each skrtnuta.hajil as h (h.osoba + h.citat.kde)}<HlasHerny hlas={h} />{/each}</ul>
    {/if}
  {:else}
    <p class="blok__zpetna-titulek">Kdo stál s argumentem</p>
    <ul class="hlasy-herny">{#each blok.drzi as h (h.osoba + h.citat.kde)}<HlasHerny hlas={h} />{/each}</ul>
    <p class="hlasy__titulek">Kdo by ho napadl</p>
    <ul class="napadl">
      {#each premisy as v (v.id)}
        <li><span class="napadl__veta">„{@html radek(v.text.replace(/\.$/, ''))}“</span> {v.skrtl.map((h) => h.clovek.jmeno).join(', ')}</li>
      {/each}
    </ul>
  {/if}
{/snippet}

{#snippet akce()}
  {#if zapsano}
    <BlokDal {dal} />
  {:else}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={zapis} disabled={!volba}>Zapsat do deníku</button>
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="slabe"
  nadtitulek={blok.nadtitulek}
  nazev={blok.nazev}
  labelledby={`${id}-otazka`}
  vazba={zapsano ? vazba : undefined}
  vazbaPopisek="Kdo stál s tebou"
  {cerstve}
  bind:vazbaPrvek={oblast}
  ulozeno={zapsano ? 'Tvoje volba je uložená v deníku.' : undefined}
  znovu={volba ? znovu : undefined}
  hlavni={zapsano ? (dal ? akce : undefined) : akce}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  <div class="list-argumentu" bind:this={list} data-cast="moznosti">
    <ol class="argument-radky" aria-label="Argument">
      {#each blok.vety as v (v.id)}
        {@const premisa = v.misto !== 'zaver'}
        <li class={['argument-radek', !premisa && 'argument-radek--zaver']} data-veta={v.id}>
          <span class="argument-radek__cislo" aria-hidden="true">{cislo(v.misto)}</span>
          {#if premisa}
            <button
              class={['veta-arg', volba === v.id && 'veta-arg--skrtnuta']}
              type="button"
              aria-pressed={volba === v.id}
              disabled={zapsano}
              onclick={() => vyber(v.id)}
            ><span class="vizualne-skryte">Premisa {v.misto}. </span><span class="veta-arg__text">{@html radek(v.text)}</span>{#if volba === v.id}<span class="vizualne-skryte"> (přeškrtnutá)</span>{/if}</button>
          {:else}
            <p class="veta-arg veta-arg--zaver"><span class="vizualne-skryte">Závěr. </span><span class="veta-arg__text">{@html radek(v.text)}</span></p>
          {/if}
          {#if volba === v.id && tahy.length}
            <svg class="skrt" aria-hidden="true" focusable="false">
              {#each tahy as t, i (i)}
                <path class={['skrt__tah', novyTah && 'skrt__tah--novy']} style={`--i: ${i}`} d={`M${t.x1} ${t.y + 1.5} C${t.x1 + (t.x2 - t.x1) * 0.3} ${t.y - 2} ${t.x1 + (t.x2 - t.x1) * 0.7} ${t.y + 3} ${t.x2} ${t.y - 1}`} pathLength="1" />
              {/each}
            </svg>
          {/if}
        </li>
      {/each}
    </ol>
  </div>

  <div class="zadna">
    <button
      class={['blok__tl', 'blok__tl--vedlejsi', 'vystouple', volba === ZADNA && 'zadna--zvolena']}
      type="button"
      aria-pressed={volba === ZADNA}
      disabled={zapsano}
      onclick={() => vyber(ZADNA)}
    >{#if volba === ZADNA}<span aria-hidden="true">✓ </span>{/if}Žádnou, argument mi drží</button>
  </div>

  {#if volba && !zapsano}
    <label class="blok__popis" for={`${id}-proc`} data-cast="duvod">Proč? <span class="nepovinne">Nepovinné</span></label>
    <textarea class="blok__pole blok__pole--kratke" data-cast="duvod" id={`${id}-proc`} rows="2" bind:value={proc} onchange={ulozStav} placeholder="Stačí pár slov…"></textarea>
  {:else if zapsano && proc}
    <p class="tvuj-duvod" data-cast="duvod"><span class="t-popisek">Tvůj důvod:</span> <span class="blok__ruka">{proc}</span></p>
  {/if}
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
</RamAktivity>

<style>
  /* Linkovaný list: každá věta leží na linkách po 2,45 em (--linka), linky nese sama věta, aby seděly pod řádky
     textu na každé šířce. Vlevo okraj s čísly premis za červenou čarou; závěr „Tedy“ o řádek níž. */
  .list-argumentu { --radek: calc(var(--fs-text) * 2.45); position: relative; margin: var(--s-3) 0 var(--s-4); padding: var(--s-3) var(--s-4) var(--s-4) 0; background: var(--list); box-shadow: var(--lezi); font-size: var(--fs-text); }
  .argument-radky { margin: 0; padding: 0; list-style: none; }
  .argument-radek { position: relative; display: grid; grid-template-columns: 3.4em minmax(0, 1fr); align-items: start; }
  .argument-radek__cislo {
    align-self: stretch;
    padding-right: .6em;
    border-right: 1.5px solid var(--cervena-tuzka);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 600;
    line-height: var(--radek);
    text-align: right;
    color: var(--ink-2);
  }
  .argument-radek--zaver { margin-top: var(--radek); }
  .argument-radek--zaver .argument-radek__cislo { font-style: italic; font-weight: 400; }
  .veta-arg {
    display: block;
    width: 100%;
    min-height: 44px;
    margin: 0;
    padding: 0 var(--s-3);
    border: 0;
    border-radius: 0;
    background-color: transparent;
    background-image: repeating-linear-gradient(to bottom, transparent 0 calc(var(--radek) - 1px), var(--linka) calc(var(--radek) - 1px) var(--radek));
    color: var(--ink);
    font-family: var(--font-serif);
    font-size: inherit;
    line-height: var(--radek);
    text-align: left;
    cursor: pointer;
  }
  .veta-arg--zaver { font-style: italic; cursor: default; }
  @media (hover: hover) { button.veta-arg:not(:disabled):hover { background-color: var(--plocha); } }
  .veta-arg:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .veta-arg:disabled { cursor: default; color: var(--ink); }
  .veta-arg--skrtnuta .veta-arg__text { color: var(--ink-2); }
  /* Tah červené tužky: dokreslí se po řádcích (--d-tah), při omezeném pohybu a v Klidném režimu stojí hotový. */
  .skrt { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .skrt__tah { fill: none; stroke: var(--cervena-tuzka); stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 1; }
  .skrt__tah--novy { animation-name: tah-skrtu; animation-duration: var(--d-tah); animation-timing-function: var(--k-papir); animation-delay: calc(var(--i, 0) * var(--d-tah)); animation-fill-mode: both; }
  @keyframes tah-skrtu { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @media (prefers-reduced-motion: reduce) { .skrt__tah--novy { animation: none; } }
  :global(:root[data-klidny]) .skrt__tah--novy { animation: none; }

  .zadna { margin: 0 0 var(--s-4); }
  .zadna--zvolena { box-shadow: var(--vtla); }

  .hlasy-herny { display: grid; gap: var(--s-4); margin: 0; padding: 0; list-style: none; }
  .hlasy__titulek { margin: var(--s-4) 0 var(--s-2); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
  .napadl { display: grid; gap: var(--s-2); margin: 0; padding: 0; list-style: none; }
  .napadl__veta { font-style: italic; }
  .napadl__veta::after { content: ' ·'; font-style: normal; color: var(--ink-3); }
</style>
