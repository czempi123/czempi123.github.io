<script lang="ts">
  // Záloha a přenos deníku (design-v2, K6): soubor ke stažení a nahrání (revize antiky, O) a odkaz, který celý
  // deník přenese do jiného prohlížeče (src/lib/prenos.ts; deník je v kotvě adresy, na server nejde nic).
  // Kdo otevře odkaz s deníkem, dostane nahoře lístek s nabídkou přidat ho ke svému: nic se nesmaže (spojDeniky).
  // Kód QR (K7a): po klepnutí na „Ukázat kód QR“ se načte knihovna a list ukáže kód téhož odkazu (src/lib/qr.ts).
  // <PrenosDeniku cast="prichozi" />  nahoře v deníku (nabídka z odkazu), <PrenosDeniku cast="zaloha" /> dole
  import { onMount, tick } from 'svelte';
  import { nacti, uloz, exportuj, nahrajDenik, spojDeniky, oznacZalohu, type Denik } from '../../lib/denik';
  import { zakodujDenik, dekodujDenik, kodZKotvy, odkazPrenosu } from '../../lib/prenos';
  import { kodQrOdkazu, type KodQr } from '../../lib/qr';

  interface Props {
    /** prichozi: lístek s deníkem z odkazu (nahoře); zaloha: soubor a odkaz (dole) */
    cast: 'prichozi' | 'zaloha';
  }
  let { cast }: Props = $props();

  let vyberSouboru = $state<HTMLInputElement>();
  let zpravaSouboru = $state('');
  let odkaz = $state('');
  let zpravaOdkazu = $state('');
  let poleOdkazu = $state<HTMLInputElement>();
  let prichozi = $state<Denik | null>(null);
  let zpravaPrichozi = $state('');
  let umiSdilet = $state(false);
  let lzePrenest = $state(true);
  let qr = $state<KodQr | null>(null);
  let zpravaQr = $state('');

  onMount(async () => {
    umiSdilet = typeof navigator.share === 'function';
    lzePrenest = typeof CompressionStream === 'function';
    if (cast !== 'prichozi') return;
    const kod = kodZKotvy(location.hash);
    if (!kod) return;
    prichozi = await dekodujDenik(kod);
    if (!prichozi) zpravaPrichozi = 'Odkaz s deníkem je poškozený. Nech si ho poslat znovu.';
  });

  async function nahraj() {
    const soubor = vyberSouboru?.files?.[0];
    if (!soubor) return;
    let text = '';
    try { text = await soubor.text(); } catch { /* nečitelný soubor */ }
    zpravaSouboru = nahrajDenik(text)
      ? 'Deník ze souboru je přidaný k tomuto. Nic se nesmazalo.'
      : 'Tenhle soubor deník z atlasu není. Vyber soubor stažený tady v deníku.';
    if (vyberSouboru) vyberSouboru.value = '';
  }

  async function vytvorOdkaz() {
    qr = null;
    zpravaQr = '';
    odkaz = odkazPrenosu(location.origin, await zakodujDenik(nacti()));
    oznacZalohu();
    zpravaOdkazu = 'Otevři tenhle odkaz v prohlížeči, kam chceš deník přenést.';
    await tick();
    poleOdkazu?.select();
  }

  async function zkopiruj() {
    try {
      await navigator.clipboard.writeText(odkaz);
      zpravaOdkazu = 'Odkaz je zkopírovaný. Pošli si ho třeba do zpráv.';
    } catch {
      poleOdkazu?.select();
      zpravaOdkazu = 'Zkopírovat se nepovedlo. Odkaz je označený, zkopíruj si ho ručně.';
    }
  }

  async function ukazQr() {
    try { qr = await kodQrOdkazu(odkaz); } catch { qr = null; }
    zpravaQr = qr ? 'Namiř na kód fotoaparát telefonu a otevři odkaz.' : 'Deník je na kód QR moc velký. Pošli si odkaz.';
  }

  async function sdilej() {
    try { await navigator.share({ title: 'Můj deník', url: odkaz }); } catch { /* student sdílení zavřel */ }
  }

  function zavriPrichozi() {
    prichozi = null;
    history.replaceState(null, '', location.pathname + location.search);
  }
  function prijmi() {
    if (!prichozi) return;
    uloz(spojDeniky(nacti(), prichozi));
    zavriPrichozi();
    zpravaPrichozi = 'Deník z odkazu je přidaný k tomuto. Nic se nesmazalo.';
  }
</script>

{#if cast === 'prichozi' && (prichozi || zpravaPrichozi)}
  <div class="listek-paska prichozi" aria-live="polite">
    <span class="paska paska--mala paska--nahore" aria-hidden="true"></span>
    {#if prichozi}
      <p class="prichozi__text">Tenhle odkaz nese deník z jiného prohlížeče. Přidat ho k tomu, co máš tady?</p>
      <div class="blok__akce">
        <button class="blok__tl blok__tl--hlavni" type="button" onclick={prijmi}>Přidat k mému deníku</button>
        <button class="blok__tl blok__tl--tiche" type="button" onclick={zavriPrichozi}>Nechat být</button>
      </div>
    {:else}
      <p class="prichozi__text">{zpravaPrichozi}</p>
    {/if}
  </div>
{/if}

{#if cast === 'zaloha'}
<section class="prenos" aria-labelledby="prenos-n">
  <h2 class="t-h3 prenos__nadpis" id="prenos-n">Záloha a přenos</h2>
  <p class="t-popisek prenos__popis">Deník je jen v tomhle prohlížeči. Ulož si ho do souboru, nebo si ho pošli odkazem do jiného zařízení.</p>
  <div class="soubor">
    <button type="button" class="blok__tl blok__tl--vedlejsi export" onclick={exportuj}>Stáhnout deník do souboru</button>
    <button type="button" class="blok__tl blok__tl--vedlejsi export" onclick={() => vyberSouboru?.click()}>Nahrát deník ze souboru</button>
    <input bind:this={vyberSouboru} type="file" accept=".json,application/json" class="vizualne-skryte" tabindex="-1" aria-hidden="true" onchange={nahraj} />
    {#if lzePrenest}<button type="button" class="blok__tl blok__tl--tiche" onclick={vytvorOdkaz}>Poslat deník odkazem</button>{/if}
  </div>
  <p class="t-popisek soubor__popis">Nahraný deník se přidá k tomu, co máš tady. Nic se nesmaže.</p>
  {#if zpravaSouboru}<p class="soubor__zprava t-ovladani" role="status">{zpravaSouboru}</p>{/if}
  {#if odkaz}
    <div class="odkaz">
      <label class="blok__popis" for="odkaz-prenosu">Odkaz s tvým deníkem</label>
      <input class="odkaz__pole" id="odkaz-prenosu" type="text" readonly value={odkaz} bind:this={poleOdkazu} onfocus={(e) => e.currentTarget.select()} />
      <div class="blok__akce">
        <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={zkopiruj}>Zkopírovat odkaz</button>
        {#if umiSdilet}<button class="blok__tl blok__tl--tiche" type="button" onclick={sdilej}>Sdílet</button>{/if}
        {#if !qr}<button class="blok__tl blok__tl--tiche" type="button" onclick={ukazQr}>Ukázat kód QR</button>{/if}
      </div>
      {#if qr}
        <figure class="qr papirovy-list">
          <svg viewBox="-4 -4 {qr.strana + 8} {qr.strana + 8}" role="img" aria-label="Kód QR s odkazem na tvůj deník" shape-rendering="crispEdges"><path d={qr.d} /></svg>
        </figure>
      {/if}
      {#if zpravaQr}<p class="t-popisek odkaz__zprava" role="status">{zpravaQr}</p>{/if}
      <p class="t-popisek odkaz__zprava" aria-live="polite">{zpravaOdkazu}</p>
    </div>
  {/if}
</section>
{/if}

<style>
  .prichozi { margin: var(--s-5) 0 0; }
  .prichozi__text { margin: 0; }
  .prenos { margin-top: var(--s-7); padding-top: var(--s-5); border-top: 1px dashed var(--tuzka); }
  .prenos__nadpis { margin: 0 0 var(--s-2); }
  .prenos__popis { margin: 0 0 var(--s-4); color: var(--ink-2); }
  .soubor { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3); }
  .soubor__popis { margin: var(--s-3) 0 0; }
  .soubor__zprava { margin: var(--s-3) 0 0; color: var(--ink-2); }
  .odkaz { margin-top: var(--s-5); }
  .odkaz__pole {
    display: block;
    width: 100%;
    min-height: var(--dotyk);
    padding: 10px 14px;
    border: 0;
    border-radius: var(--r-ovladani);
    background: var(--papir);
    box-shadow: var(--vtla);
    color: var(--ink-2);
    font: 14px/1.4 var(--font-sans);
  }
  .odkaz__pole:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .odkaz__zprava { margin: var(--s-2) 0 0; color: var(--ink-2); }
  /* Kód QR na ležícím listu: moduly v inkoustu, okraj čtyř modulů z listu; v noci je list tmavý, proto bílé pole. */
  .qr { display: inline-block; margin: var(--s-4) 0 0; padding: 10px; rotate: calc(-.8deg * var(--natoceni)); background: #fff; }
  .qr svg { display: block; width: min(240px, 70vw); height: auto; }
  .qr path { fill: #1d1b18; }
</style>
