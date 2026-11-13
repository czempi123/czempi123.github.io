<script lang="ts">
  // Společný rám aktivity (design-v2, K4a; plátno Herna.dc.html › Rám aktivity): jeden pro všechny bloky a hry.
  // Hlava (rodina aktivit v inkoustu období, nepovinný název, mince lidí), zadání a plocha (children),
  // zpětná vazba jako lístek s páskou, který se po činu studenta rozloží, pata: Začít znovu vlevo, hlavní čin vpravo.
  // Nová hra = jen vnitřek plochy. Vzhled je v global.css › Rám aktivity, popis v docs/design.md › Bloky › Rám aktivity.
  //
  // <RamAktivity id={id} obdobi={1} nadtitulek="Tvůj tah" labelledby={`${id}-otazka`} lide={[filozof]}
  //   vazba={zpetna ? vazbaVolby : undefined} cerstve={cerstve} bind:vazbaPrvek={oblast}
  //   znovu={potvrzeno ? znovu : undefined} hlavni={akce} ulozeno={potvrzeno ? 'Tvůj tah je uložený v deníku.' : undefined}>
  //   <h3 class="t-h3 blok__otazka" id={`${id}-otazka`} data-cast="otazka">…</h3>
  //   <div class="blok__plocha" data-cast="moznosti">…předmět hry…</div>
  // </RamAktivity>
  import { untrack, type Snippet } from 'svelte';
  import BlokHlava from './BlokHlava.svelte';
  import VolbaPera from './VolbaPera.svelte';
  import { peroDeniku, ulozPero } from '../../lib/denik';
  import { VYCHOZI_PERO } from '../../lib/pero';
  import type { ClovekBloku } from './bloky-typy';

  interface Props {
    id: string;
    /** barva období (obdobi-N); bez ní rám převezme barvu stránky */
    obdobi?: number;
    /** další třídy kořene (druh bloku: 'volba', 'odkryj') */
    trida?: string;
    /** rodina aktivit: nadtitulek z dat */
    nadtitulek: string;
    /** krátký název aktivity nad zadáním (nepovinný; hry z herny) */
    nazev?: string;
    lide?: ClovekBloku[];
    /** id nadpisu, který rám pojmenuje (otázka) */
    labelledby: string;
    /** atributy kořene navíc (data-podoba ap.) */
    [atribut: `data-${string}`]: string | undefined;
    children?: Snippet;
    /** obsah lístku zpětné vazby; bez něj lístek není */
    vazba?: Snippet;
    vazbaPopisek?: string;
    /** lístek vznikl činem studenta teď: rozloží se (po obnovení stránky leží rovnou) a nabídne pero */
    cerstve?: boolean;
    vazbaPrvek?: HTMLElement;
    /** pod lístkem (Co kdybys zvolil jinak?, Kam dál mimo patu) */
    poVazbe?: Snippet;
    /** věta o uložení v deníku nad patou */
    ulozeno?: string;
    /** Začít znovu: bez funkce tlačítko není */
    znovu?: () => void;
    /** hlavní čin vpravo v patě */
    hlavni?: Snippet;
  }
  let {
    id, obdobi, trida, nadtitulek, nazev, lide = [], labelledby, children, vazba, vazbaPopisek = 'Zpětná vazba',
    cerstve = false, vazbaPrvek = $bindable(), poVazbe, ulozeno, znovu, hlavni, ...data
  }: Props = $props();

  // Pero se nabídne jednou, při první odpovědi: kdo ještě nevolil, dostane modré a může ho tu hned změnit.
  let nabidkaPera = $state(false);
  $effect(() => {
    if (vazba && cerstve) untrack(() => {
      if (nabidkaPera || peroDeniku()) return;
      ulozPero(VYCHOZI_PERO);
      nabidkaPera = true;
    });
  });
</script>

<section class={['blok', trida, obdobi && `obdobi-${obdobi}`]} id={id} aria-labelledby={labelledby} {...data}>
  <BlokHlava {nadtitulek} {nazev} {lide} />
  {@render children?.()}
  {#if vazba}
    <div
      class={['listek-paska', 'blok__vazba', cerstve && 'rozlozit']}
      data-cast="zpetna"
      role="region"
      aria-label={vazbaPopisek}
      aria-live="polite"
      tabindex="-1"
      bind:this={vazbaPrvek}
    >
      <span class="paska paska--mala paska--nahore" aria-hidden="true"></span>
      {@render vazba()}
    </div>
  {/if}
  {@render poVazbe?.()}
  {#if vazba && nabidkaPera}<div data-cast="duvod"><VolbaPera kompaktni /></div>{/if}
  {#if ulozeno}<p class="blok__ulozeno" data-cast="ulozeno">{ulozeno}</p>{/if}
  {#if znovu || hlavni}
    <!-- Pata nese značky podob hodiny na svých částech (data-cast="akce"), sama žádnou: otevřená otázka ji skryje celou. -->
    <div class="blok__pata">
      {#if znovu}<button class="blok__tl blok__tl--tiche" type="button" data-cast="akce" onclick={znovu}>Začít znovu</button>{/if}
      {#if hlavni}<div class="blok__pata-hlavni" data-cast="akce">{@render hlavni()}</div>{/if}
    </div>
  {/if}
</section>
