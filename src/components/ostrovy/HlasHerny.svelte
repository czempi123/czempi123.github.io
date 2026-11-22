<script lang="ts">
  // Jeden hlas ve hrách herny (Najdi slabé místo, Kdo by to řekl?; herna-v1, K3): razítko a jméno, proč tiskem
  // a citát s místem z dat a nůžkami (denik-v2, K4: hlas se ukáže až po volbě, nic neprozradí). Položka seznamu: <ul class="hlasy-herny"><HlasHerny hlas={h} /></ul>
  import { radek } from '../../lib/bloky';
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import Nuzky from '../ui/Nuzky.svelte';
  import type { HlasHerny } from './bloky-typy';

  let { hlas }: { hlas: HlasHerny } = $props();
  // Citát, který je sám rozhovorem („Mnoho lidí tě chválí.“ – „A co…?“), už uvozovky má: druhé se nepřidávají.
  const vlastniUvozovky = $derived(hlas.citat.text.trimStart().startsWith('„'));
</script>

<li class="hlas-herny">
  <RazitkoCloveka razitko={hlas.clovek.razitko} obdobi={hlas.clovek.obdobi} velikost={40} />
  <div class="hlas-herny__telo">
    <p class="hlas-herny__jmeno">{hlas.clovek.jmeno}</p>
    <p class="hlas-herny__proc">{@html radek(hlas.proc)}</p>
    <blockquote class="hlas-herny__citat"><p>{vlastniUvozovky ? '' : '„'}{@html radek(hlas.citat.text)}{vlastniUvozovky ? '' : '“'}</p><footer>{hlas.citat.kde}</footer><Nuzky id={hlas.citat.id} text={hlas.citat.text} kde={hlas.citat.udaje} kompaktni /></blockquote>
  </div>
</li>

<style>
  .hlas-herny { display: flex; align-items: flex-start; gap: var(--s-3); }
  .hlas-herny :global(.razitko-cloveka) { flex: none; margin-top: 2px; }
  .hlas-herny__telo { min-width: 0; }
  .hlas-herny__jmeno { margin: 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
  .hlas-herny__proc { margin: 2px 0 var(--s-1); }
  .hlas-herny__citat { position: relative; margin: 0; padding-left: var(--s-3); border-left: 2px solid var(--tuzka); }
  .hlas-herny__citat p { margin: 0; font-style: italic; }
  .hlas-herny__citat footer { padding-right: 44px; min-height: 24px; font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
</style>
