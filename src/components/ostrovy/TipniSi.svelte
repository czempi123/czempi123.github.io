<script lang="ts">
  // Tipni si (herna-v1, K2; plátno D5 › Tipni si): papírové pravítko v lidských životech s jezdcem v barvě pera.
  // Student odhadne, kolik lidských životů je mezi dvěma lidmi (0 = mohli se potkat); posuvník je skutečný
  // input type="range" (klávesnice, čtečka, prst), jezdec a pravítko jsou jen obraz nad ním. Zkontrolovat odhad:
  // „sedí“ v rozumném rozpětí, jinak „zkus to jinak“ s jedním směrem; po dvou odhadech Ukázat, jak to bylo.
  // Po odhalení ryska skutečné vzdálenosti, čárkovaná svorka k odhadu a věty z dat: kolik let a životů je dělí
  // a kdo na koho navázal. Roky jsou jen v té větě. Nic se nepočítá; do deníku jen stav.
  // Použití v MDX (obsah v src/content/bloky/dilna-tipni-thales-hypatia.yaml, druh: tipni):
  // <TipniSi id="dilna-tipni-thales-hypatia" />
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import { sediOdhad, verdiktOdhadu, popisOdhadu, platnyStavOdhadu, ODHADU_DO_UKAZANI, SEDI } from '../../lib/herna';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { ClovekBloku, Dal } from './bloky-typy';

  interface BlokTipni {
    obdobi: number;
    nadtitulek: string;
    nazev: string;
    scena?: string;
    otazka: string;
    lide: ClovekBloku[];
    zeny: boolean;
    /** skutečná vzdálenost v lidských životech (0 = současníci) */
    zivotu: number;
    /** délka pravítka v životech */
    delka: number;
    vzdalenost: string;
    vazba?: string;
    vysvetleni?: string;
  }
  interface Props { id: string; blok: BlokTipni; odkaz: string; dal?: Dal }
  let { id, blok, odkaz, dal }: Props = $props();

  const vychozi = () => Math.round(blok.delka / 3);
  let odhad = $state(vychozi());
  let pokusy = $state<number[]>([]);
  let hotovo = $state(false);
  let ukazano = $state(false);
  let cerstve = $state(false);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();
  /** student jezdcem pohnul (výchozí poloha sama odhad není) */
  let pohnuto = $state(false);

  const posledni = $derived(pokusy.at(-1));
  const verdikt = $derived(!hotovo && posledni !== undefined ? verdiktOdhadu(posledni, blok.zivotu) : null);
  const sedi = $derived(hotovo && !ukazano);
  const smiKontrolovat = $derived(!hotovo && odhad !== posledni && !(pokusy.length === 0 && odhad === vychozi() && !pohnuto));
  const nabidnoutUkazani = $derived(!hotovo && pokusy.length >= ODHADU_DO_UKAZANI);

  /** Popisky čísel: každý život, nebo každý druhý či pátý, ať se na telefonu nepotkají. */
  const krok = $derived(blok.delka <= 10 ? 1 : blok.delka <= 20 ? 2 : 5);
  const cisla = $derived(Array.from({ length: Math.floor(blok.delka / krok) + 1 }, (_, i) => i * krok));
  /** Ryska každého života a mezi nimi dvě slabší po generaci (asi 25 let). */
  const rysky = $derived(Array.from({ length: blok.delka * 3 + 1 }, (_, i) => i / 3));
  const pomer = (x: number) => Math.min(1, Math.max(0, x / blok.delka));

  onMount(() => {
    const s = platnyStavOdhadu(stavBloku(id), blok.delka);
    if (s) {
      ({ odhad, pokusy, hotovo, ukazano } = s);
      pohnuto = true;
    }
  });

  function ulozStav() {
    if (!pokusy.length && !hotovo) return smazStavBloku(id);
    ulozStavBloku(id, { odhad, pokusy, hotovo, ukazano }, { odkaz, otazka: blok.otazka, druh: 'tipni', hotovo });
  }

  async function zkontroluj() {
    if (!smiKontrolovat) return;
    pokusy = [...pokusy, odhad];
    cerstve = true;
    if (sediOdhad(odhad, blok.zivotu)) {
      hotovo = true;
      hlaseni = `${SEDI} ${blok.vzdalenost}`;
    } else {
      hlaseni = '';
    }
    ulozStav();
    await tick();
    oblast?.focus();
  }

  async function ukaz() {
    ukazano = true;
    hotovo = true;
    cerstve = true;
    hlaseni = blok.vzdalenost;
    ulozStav();
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    odhad = vychozi();
    pokusy = [];
    hotovo = false;
    ukazano = false;
    pohnuto = false;
    cerstve = false;
    hlaseni = 'Odhad je zpátky na začátku.';
    smazStavBloku(id);
    await tick();
    document.getElementById(id)?.querySelector<HTMLInputElement>('.pravitko__vstup')?.focus();
  }
</script>

{#snippet vazba()}
  {#if hotovo}
    <p class="blok__zpetna-titulek">{ukazano ? 'Takhle daleko od sebe jsou.' : SEDI}</p>
    <p>{@html radek(blok.vzdalenost)}</p>
    {#if blok.vazba}<p>{@html radek(blok.vazba)}</p>{/if}
    {#if blok.vysvetleni}{#each odstavce(blok.vysvetleni) as o, i (i)}<p>{@html o}</p>{/each}{/if}
  {:else if verdikt}
    <p class="zkus"><svg class="zkus__sipka" width="30" height="18" viewBox="0 0 30 18" aria-hidden="true" focusable="false"><path d="M2 12c6-7 15-9 24-4M20 3l6 5-7 3" /></svg>{verdikt.slovo}</p>
    {#if verdikt.veta}<p>{@html radek(verdikt.veta)}</p>{/if}
  {/if}
{/snippet}

{#snippet akce()}
  {#if !hotovo}
    {#if nabidnoutUkazani}<button class="blok__tl blok__tl--vedlejsi vystouple" type="button" onclick={ukaz}>Ukázat, jak to bylo</button>{/if}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={zkontroluj} disabled={!smiKontrolovat}>Zkontrolovat odhad</button>
  {:else}
    <BlokDal {dal} />
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="tipni"
  nadtitulek={blok.nadtitulek}
  nazev={blok.nazev}
  lide={blok.lide}
  labelledby={`${id}-otazka`}
  vazba={hotovo || verdikt ? vazba : undefined}
  vazbaPopisek={hotovo ? 'Jak daleko' : 'Zkus to jinak'}
  {cerstve}
  bind:vazbaPrvek={oblast}
  znovu={hotovo || pokusy.length ? znovu : undefined}
  hlavni={!hotovo || dal ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  <div class={['pravitko', hotovo && 'pravitko--odhaleno']} data-cast="moznosti" style={`--odhad: ${pomer(odhad)}; --pravda: ${pomer(blok.zivotu)}`}>
    <p class="pravitko__tip blok__ruka" aria-hidden="true">{popisOdhadu(odhad, blok.zeny)}</p>
    <div class="pravitko__list">
      <svg class="pravitko__rysky" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {#each rysky as r, i (i)}
          {@const x = pomer(r) * 1000}
          <line x1={x} x2={x} y1="0" y2={i % 3 === 0 ? 22 : 10} class={i % 3 === 0 ? 'rys rys--zivot' : 'rys'} vector-effect="non-scaling-stroke" />
        {/each}
      </svg>
      <div class="pravitko__cisla" aria-hidden="true">
        {#each cisla as c (c)}<span style={`--x: ${pomer(c)}`}>{c}</span>{/each}
      </div>
      {#if hotovo}
        {#if Math.abs(blok.zivotu - odhad) > 0.05}
          <span class="pravitko__svorka" aria-hidden="true" style={`--od: ${Math.min(pomer(odhad), pomer(blok.zivotu))}; --do: ${Math.max(pomer(odhad), pomer(blok.zivotu))}`}></span>
        {/if}
        <span class="pravitko__pravda" aria-hidden="true"></span>
      {/if}
      <span class="pravitko__jezdec" aria-hidden="true"></span>
      <input
        class="pravitko__vstup"
        type="range"
        min="0"
        max={blok.delka}
        step="1"
        bind:value={odhad}
        oninput={() => { pohnuto = true; }}
        disabled={hotovo}
        aria-labelledby={`${id}-otazka`}
        aria-valuetext={popisOdhadu(odhad, blok.zeny)}
        aria-describedby={`${id}-legenda`}
      />
    </div>
    <p class="pravitko__legenda t-popisek" id={`${id}-legenda`}>0 znamená, že se mohli potkat. Jeden lidský život jsou asi tři generace.</p>
    {#if sedi}<span class={['herni-otisk', 'pravitko__otisk', cerstve && 'otisk']} aria-hidden="true">sedí</span>{/if}
  </div>
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
</RamAktivity>

<style>
  /* Pravítko: proužek papíru s ryskami po generacích a čísly po životech. Jezdec (trojúhelník a čára v barvě pera)
     ukazuje odhad; skutečná vzdálenost je po odhalení ryska v inkoustu období a čárkovaná svorka k odhadu. */
  .pravitko { --okraj: 18px; position: relative; margin: var(--s-4) 0 var(--s-3); }
  .pravitko__tip { min-height: 1.5em; margin: 0 0 var(--s-1); color: var(--pero); }
  .pravitko__list {
    position: relative;
    height: 78px;
    padding: 0 var(--okraj);
    border-radius: 2px;
    background: var(--listek);
    box-shadow: var(--lezi);
    rotate: calc(-.4deg * var(--natoceni));
  }
  .pravitko__rysky { position: absolute; left: var(--okraj); right: var(--okraj); top: 0; width: calc(100% - 2 * var(--okraj)); height: 40px; overflow: visible; }
  .rys { stroke: var(--ink-3); stroke-width: 1; }
  .rys--zivot { stroke: var(--ink-2); stroke-width: 1.5; }
  .pravitko__cisla { position: absolute; left: var(--okraj); right: var(--okraj); top: 24px; height: 20px; }
  .pravitko__cisla span { position: absolute; left: calc(var(--x) * 100%); translate: -50% 0; font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .pravitko__jezdec {
    position: absolute;
    top: -10px;
    bottom: 0;
    left: calc(var(--okraj) + (100% - 2 * var(--okraj)) * var(--odhad));
    width: 0;
    border-left: 2.5px solid var(--pero);
    translate: -1.25px 0;
    pointer-events: none;
  }
  .pravitko__jezdec::before {
    content: '';
    position: absolute;
    left: -9px;
    top: -6px;
    border: 8px solid transparent;
    border-top: 12px solid var(--pero);
    border-bottom: 0;
  }
  .pravitko__pravda {
    position: absolute;
    top: -6px;
    bottom: -6px;
    left: calc(var(--okraj) + (100% - 2 * var(--okraj)) * var(--pravda));
    width: 0;
    border-left: 3px solid var(--p, var(--ink));
    translate: -1.5px 0;
    pointer-events: none;
  }
  /* Svorka: čárkovaná závorka pod pravítkem mezi odhadem a skutečností. */
  .pravitko__svorka {
    position: absolute;
    bottom: 6px;
    height: 14px;
    left: calc(var(--okraj) + (100% - 2 * var(--okraj)) * var(--od));
    width: calc((100% - 2 * var(--okraj)) * (var(--do) - var(--od)));
    border: 2px dashed var(--tuzka);
    border-top: 0;
    border-radius: 0 0 6px 6px;
    pointer-events: none;
  }
  /* Posuvník leží přes celé pravítko a je průhledný: jezdec je obraz, ovládá se skutečný input. Úchyt má šířku
     44 px a input je o ni širší, aby poloha úchytu seděla na rysky (prohlížeč ho vede od poloviny úchytu). */
  .pravitko__vstup {
    position: absolute;
    left: calc(var(--okraj) - 22px);
    width: calc(100% - 2 * var(--okraj) + 44px);
    top: 0;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
  }
  .pravitko__vstup::-webkit-slider-runnable-track { height: 78px; background: transparent; }
  .pravitko__vstup::-webkit-slider-thumb { -webkit-appearance: none; width: 44px; height: 78px; background: transparent; }
  .pravitko__vstup::-moz-range-thumb { width: 44px; height: 78px; border: 0; background: transparent; }
  .pravitko__vstup:disabled { cursor: default; }
  .pravitko__list:has(.pravitko__vstup:focus-visible) { outline: 2px solid var(--ink); outline-offset: 4px; }
  .pravitko__legenda { margin: var(--s-2) 0 0; color: var(--ink-2); }
  /* Otisk vpravo nad pravítkem: dole se dotkne rysek, čísla nezakryje. */
  .pravitko__otisk { position: absolute; right: 4px; top: -46px; z-index: 4; }

  .zkus { display: flex; align-items: center; gap: var(--s-2); margin: 0 0 var(--s-2); font-family: var(--font-ruka); font-size: calc(var(--meritko) * 22px); line-height: 1.3; color: var(--ruka); }
  .zkus__sipka { flex: none; fill: none; stroke: var(--tuzka); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>
