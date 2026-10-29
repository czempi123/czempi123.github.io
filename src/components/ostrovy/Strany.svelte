<script lang="ts">
  // Kdo je na tvé straně: oddíl posledního kroku cesty. Text píše autor v MDX (obal src/components/bloky/Strany.astro):
  // <Strany blok="cesta2-je-to-ona"> Úvod. <Strana odpoved="A">…</Strana> … </Strany>
  // Po načtení ostrov přečte z deníku, co student v bloku zvolil (src/lib/strany.ts), a oddíl přeskládá:
  // co patří všem, zůstane, kde je; odpověď studenta stojí na místě první odpovědi pod štítkem „Na tvé straně“
  // a ostatní odpovědi jsou pod sbaleným „Kdo hájil jiné odpovědi“. Nic se neškrtá a nic se neukládá.
  // Sestavená stránka je celá: bez JavaScriptu, bez zápisu nebo bez odstavce k odpovědi se nic nemění.
  // Nadpis oddílu (a s ním kotva) stojí mimo ostrov, takže odkazy z přípravy hodiny platí v obou stavech.
  import { onMount, type Snippet } from 'svelte';
  import { stavBloku } from '../../lib/denik';
  import { odpovedStudenta, rozvrhOddilu, kodyStrany, JINE_ODPOVEDI, NA_TVE_STRANE, type PopisStran } from '../../lib/strany';

  interface Props {
    /** id bloku cesty, k jehož odpovědím text oddílu patří */
    blok: string;
    popis: PopisStran;
    children?: Snippet;
  }
  let { blok, popis, children }: Props = $props();
  let obal = $state<HTMLElement>();

  /** Přeskládá oddíl podle odpovědi v deníku; vrací, jestli se něco změnilo. */
  function preskladej(): boolean {
    const koren = obal?.querySelector<HTMLElement>(':scope > astro-slot') ?? obal;
    if (!koren) return false;
    const potomci = [...koren.children] as HTMLElement[];
    const rozvrh = rozvrhOddilu(
      potomci.map((e) => (e.dataset.odpoved !== undefined ? kodyStrany(e.dataset.odpoved) : null)),
      odpovedStudenta(popis, stavBloku(blok)),
    );
    if (!rozvrh) return false;
    const stitek = document.createElement('p');
    stitek.className = 't-nadtitulek strany__stitek';
    stitek.textContent = NA_TVE_STRANE;
    const tvoje = rozvrh.tvoje.map((i) => potomci[i]);
    for (const e of tvoje) e.classList.add('strana--tvoje');
    const poradi: HTMLElement[] = [...rozvrh.pred.map((i) => potomci[i]), stitek, ...tvoje];
    if (rozvrh.jine.length) {
      const jine = document.createElement('details');
      jine.className = 'strany__jine';
      const souhrn = document.createElement('summary');
      souhrn.textContent = JINE_ODPOVEDI;
      jine.append(souhrn, ...rozvrh.jine.map((i) => potomci[i]));
      poradi.push(jine);
    }
    poradi.push(...rozvrh.po.map((i) => potomci[i]));
    koren.append(...poradi);
    obal!.dataset.preskladano = '';
    return true;
  }

  onMount(() => { preskladej(); });
</script>

<div class="strany" data-strany={blok} bind:this={obal}>{@render children?.()}</div>

<style>
  /* Odpověď studenta: linka v barvě období, nad ní štítek. Ostatní odpovědi pod odkazem jako „Co kdybys zvolil jinak?“ ve Volbě. */
  .strany :global(.strany__stitek) { margin: 0 0 var(--s-2); color: var(--pc); }
  .strany :global(.strana--tvoje) { margin-bottom: var(--s-4); padding-left: var(--s-4); border-left: 3px solid var(--pc); }
  .strany :global(.strana--tvoje > :last-child) { margin-bottom: 0; }
  .strany :global(.strana--tvoje:has(+ .strana--tvoje)) { margin-bottom: 0; padding-bottom: var(--s-4); }
  .strany :global(.strany__jine) { margin: 0 0 var(--s-5); }
  .strany :global(.strany__jine > summary) {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    cursor: pointer;
  }
  .strany :global(.strany__jine[open] > summary) { margin-bottom: var(--s-3); }
  .strany :global(.strany__jine > .strana) { padding-left: var(--s-4); border-left: 2px solid var(--pc-soft); }
  .strany :global(.strany__jine > .strana + .strana) { margin-top: var(--s-4); }
  .strany :global(.strany__jine > .strana > :last-child) { margin-bottom: 0; }
  /* Bez přeskládání vypadá oddíl jako dřív: obaly odpovědí nemají vlastní okraje. */
</style>
