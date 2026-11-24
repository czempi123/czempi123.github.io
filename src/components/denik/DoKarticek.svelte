<script lang="ts">
  // Tlačítko Do kartiček (denik-v2, K3; plán › 2): stisknuté = kartička z tohoto zdroje je v deníku, druhý stisk ji
  // vyndá. U výstřižku ve sbírce, u lístku zápisu s vlastním textem v deníku a na stránce pojmu.
  //   <DoKarticek zdroj="pojem" ref="ataraxie" popis="ataraxie" />            (v Astru s client:idle)
  //   <DoKarticek zdroj="zapis" ref={zapis.id} popis={zapis.otazka} />
  // `popis` čte jen čtečka za názvem tlačítka (aria-label), aby se tlačítka v seznamu dala rozlišit.
  import { onMount } from 'svelte';
  import { maKarticku, pridatKarticku, vyndatKarticku, klicKarticky, type ZdrojKarticky } from '../../lib/denik';
  import { TEXTY_KARTICEK } from '../../lib/karticky';

  interface Props {
    zdroj: ZdrojKarticky;
    ref: string;
    popis?: string;
  }
  let { zdroj, ref, popis }: Props = $props();
  let v = $state(false);

  onMount(() => {
    const obnov = () => (v = maKarticku(zdroj, ref));
    obnov();
    window.addEventListener('atlas-denik', obnov);
    return () => window.removeEventListener('atlas-denik', obnov);
  });

  function prepni() {
    if (v) vyndatKarticku(klicKarticky(zdroj, ref));
    else pridatKarticku(zdroj, ref);
    v = maKarticku(zdroj, ref);
  }
</script>

<!-- Popis jde do jména tlačítka přes aria-label, ne skrytým textem: ten by se v deníku zdvojil s otázkou zápisu. -->
<button class="blok__tl blok__tl--vedlejsi do-karticek" type="button" aria-pressed={v} aria-label={popis ? `${TEXTY_KARTICEK.doKarticek} ${popis}` : undefined} onclick={prepni}>
  <span class="do-karticek__znak" aria-hidden="true">{v ? '✓' : '+'}</span>{TEXTY_KARTICEK.doKarticek}
</button>

<style>
  .do-karticek { gap: 8px; }
  .do-karticek__znak { display: inline-block; min-width: 1ch; font-weight: 600; text-align: center; }
  .do-karticek[aria-pressed='true'] { font-weight: 600; }
  .do-karticek[aria-pressed='true'] .do-karticek__znak { color: var(--pero); }
</style>
