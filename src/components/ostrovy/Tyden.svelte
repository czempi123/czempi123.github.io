<script lang="ts">
  // Týden cvičení (Stoický týden): sedm dnů pod sebou, jeden otevřený. Každý den jde označit jako hotový, zrušit
  // i přeskočit (Další den); nic se nepočítá jako přerušení, žádné série, body ani procenta. Student pokračuje dnem,
  // na kterém skončil (denKOtevreni). Přijetí týdne je výzva v deníku; hotové dny, den a věta jsou v deníku
  // v poli tydny, poznámka u výzvy. Při promítání hodiny pracuje s deníkem promítání, do deníku studenta nic nezapíše.
  // Použití (stránka src/pages/tyden/[tyden].astro): <Tyden client:load id="stoicky" nazev="…" odkaz="/tyden/stoicky/" dny={…} />
  import { onMount, tick } from 'svelte';
  import { nacti, prijmiVyzvu, stavTydne, ulozTyden, ulozPoznamkuVyzvy } from '../../lib/denik';
  import { cisteDny, denKOtevreni, idVyzvyTydne, kotvaDne, oznacDen } from '../../lib/tydny';

  interface DenUI {
    cislo: number;
    nazev: string;
    /** jméno osoby, od které cvičení je */
    kdo: string;
    doba: string;
    /** odstavce textu jako HTML (radek: kurzíva, nezlomitelné mezery) */
    text: string[];
    citat?: { cesky: string; autor: string; dilo: string; misto: string };
    /** odstavce za citátem jako HTML */
    poCitatu?: string[];
    /** mez jako HTML */
    mez: string;
    odkaz?: { href: string; text: string };
    psani?: { veta: string; poznamka: string };
  }
  interface Props { id: string; nazev: string; odkaz: string; dny: DenUI[] }
  let { id, nazev, odkaz, dny }: Props = $props();
  const pocet = $derived(dny.length);
  const vyzva = $derived(idVyzvyTydne(id));

  let prijato = $state(false);
  let hotove = $state<number[]>([]);
  // Před načtením deníku (a bez JavaScriptu) je otevřený první den.
  let otevreny = $state<number | null>(1);
  let veta = $state('');
  let poznamka = $state('');
  let ulozenoPsani = $state(false);
  let hlaseni = $state('');
  let tlacitka = $state<Record<number, HTMLButtonElement>>({});
  let casovac: ReturnType<typeof setTimeout> | undefined;

  onMount(() => {
    const d = nacti();
    const stav = stavTydne(id, d);
    const v = d.vyzvy.find((x) => x.id === vyzva);
    prijato = !!v;
    hotove = cisteDny(stav?.hotove, pocet);
    veta = stav?.veta ?? '';
    poznamka = v?.poznamka ?? '';
    ulozenoPsani = !!(veta || poznamka);
    // Odkaz na den (#den-3) otevře ten den, jinak den, na kterém student skončil.
    const m = /^#den-(\d+)$/.exec(location.hash);
    const zOdkazu = m ? Number(m[1]) : NaN;
    otevreny = zOdkazu >= 1 && zOdkazu <= pocet ? zOdkazu : denKOtevreni(stav, pocet);
    const priOdchodu = () => ulozPsani();
    addEventListener('pagehide', priOdchodu);
    return () => { clearTimeout(casovac); removeEventListener('pagehide', priOdchodu); };
  });

  function prijmi() {
    if (prijato) return;
    prijmiVyzvu({ id: vyzva, nazev, odkaz });
    prijato = true;
  }

  function prijmiTlacitkem() {
    prijmi();
    hlaseni = 'Týden je v tvém deníku.';
  }

  function prepni(n: number) {
    otevreny = otevreny === n ? null : n;
  }

  function hotovo(n: number) {
    const nyni = !hotove.includes(n);
    if (nyni) prijmi();
    hotove = oznacDen(hotove, n, nyni);
    // Po hotovém dni se příště otevře další; zrušený den zůstane tam, kde je.
    ulozTyden(id, { hotove, den: nyni && n < pocet ? n + 1 : n });
    hlaseni = nyni ? `Den ${n} je hotový.` : `Den ${n} už není označený jako hotový.`;
  }

  async function dalsi(n: number) {
    const cil = Math.min(n + 1, pocet);
    otevreny = cil;
    if (prijato) ulozTyden(id, { den: cil });
    await tick();
    tlacitka[cil]?.focus();
  }

  function ulozPsani() {
    clearTimeout(casovac);
    const v = veta.trim();
    const p = poznamka.trim();
    if (!prijato && !v && !p) return;
    prijmi();
    ulozTyden(id, { veta: v });
    ulozPoznamkuVyzvy(vyzva, p);
    ulozenoPsani = true;
  }

  function piseSe() {
    ulozenoPsani = false;
    clearTimeout(casovac);
    casovac = setTimeout(ulozPsani, 600);
  }
</script>

<div class="tyden">
  <div class="prijeti">
    {#if prijato}
      <p class="t-ovladani prijeti__stav">Týden je v tvém deníku. Začni, kdy chceš.</p>
    {:else}
      <button type="button" class="blok__tl blok__tl--hlavni" onclick={prijmiTlacitkem}>Přijmout týden</button>
    {/if}
  </div>

  <ol class="dny">
    {#each dny as d (d.cislo)}
      {@const jeOtevreny = otevreny === d.cislo}
      {@const jeHotovy = hotove.includes(d.cislo)}
      <li class={['den', jeOtevreny && 'den--otevreny', jeHotovy && 'den--hotovy']} id={kotvaDne(d.cislo)}>
        <h2 class="den__hlava">
          <button
            type="button"
            class="den__tl"
            aria-expanded={jeOtevreny}
            aria-controls={`${kotvaDne(d.cislo)}-obsah`}
            onclick={() => prepni(d.cislo)}
            bind:this={tlacitka[d.cislo]}
          >
            <span class="den__radek">
              <span class="t-nadtitulek den__cislo">Den {d.cislo}</span>
              {#if jeHotovy}<span class="t-popisek den__znacka"><span aria-hidden="true">✓&nbsp;</span>hotovo</span>{/if}
            </span>
            <span class="den__nazev">{d.nazev}</span>
            <span class="t-popisek den__meta">{d.kdo} · {d.doba}</span>
            <svg class="den__sipka" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </h2>
        <div class="den__obsah" id={`${kotvaDne(d.cislo)}-obsah`} hidden={!jeOtevreny}>
          {#each d.text as o}<p>{@html o}</p>{/each}
          {#if d.citat}
            <figure class="den__citat">
              <blockquote><p>„{d.citat.cesky}“</p></blockquote>
              <figcaption class="t-popisek">{d.citat.autor}, <cite>{d.citat.dilo}</cite> {d.citat.misto}</figcaption>
            </figure>
            {#each d.poCitatu ?? [] as o}<p>{@html o}</p>{/each}
          {/if}
          <p class="den__mez"><span class="den__mez-nadpis">Kdy přestat</span> {@html d.mez}</p>
          {#if d.psani}
            <div class="psani">
              <label class="blok__popis" for={`${id}-veta`}>{d.psani.veta}</label>
              <textarea class="blok__pole blok__pole--kratke" id={`${id}-veta`} rows="2" bind:value={veta} oninput={piseSe} onblur={ulozPsani}></textarea>
              <label class="blok__popis" for={`${id}-poznamka`}>{d.psani.poznamka}</label>
              <textarea class="blok__pole" id={`${id}-poznamka`} rows="3" bind:value={poznamka} oninput={piseSe} onblur={ulozPsani} aria-describedby={`${id}-psani-stav`}></textarea>
              <p class="t-popisek psani__stav" id={`${id}-psani-stav`} aria-live="polite">{ulozenoPsani ? 'Uloženo v deníku.' : 'Ukládá se samo do deníku.'}</p>
            </div>
          {/if}
          {#if d.odkaz}<p class="den__odkaz t-ovladani"><a href={d.odkaz.href}>{d.odkaz.text}</a></p>{/if}
          <div class="blok__akce">
            <button type="button" class={['blok__tl', 'den__hotovo', jeHotovy ? 'blok__tl--hlavni' : 'blok__tl--vedlejsi']} aria-pressed={jeHotovy} onclick={() => hotovo(d.cislo)}>
              {#if jeHotovy}<span aria-hidden="true">✓</span>{/if}Hotovo
            </button>
            {#if d.cislo < pocet}
              <button type="button" class="blok__tl blok__tl--tiche" onclick={() => dalsi(d.cislo)}>Další den</button>
            {/if}
          </div>
        </div>
      </li>
    {/each}
  </ol>
  <p class="vizualne-skryte" role="status" aria-live="polite">{hlaseni}</p>
</div>

<style>
  .prijeti { margin: 0 0 var(--s-6); }
  .prijeti__stav { margin: 0; color: var(--ink); }
  .dny { display: grid; gap: var(--s-3); margin: 0; padding: 0; list-style: none; }
  .den {
    border: 1px solid var(--rule);
    border-left: 4px solid var(--rule);
    border-radius: var(--r-md);
    background: var(--surface);
    scroll-margin-top: calc(var(--hlavicka) + var(--hodina) + var(--s-4));
  }
  .den--hotovy { border-left-color: var(--pc-soft); }
  .den--otevreny { border-left-color: var(--pc); }
  .den__hlava { margin: 0; font: inherit; }
  .den__tl {
    position: relative;
    display: grid;
    gap: var(--s-1);
    width: 100%;
    min-height: 64px;
    padding: var(--s-4) calc(var(--s-5) + 28px) var(--s-4) var(--s-5);
    border: 0;
    border-radius: var(--r-md);
    background: transparent;
    color: var(--ink);
    text-align: left;
    cursor: pointer;
  }
  .den__tl:hover .den__nazev { text-decoration: underline; text-underline-offset: 3px; }
  .den__radek { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: var(--s-3); }
  .den__cislo { color: var(--pc); }
  .den__znacka { color: var(--ink-2); font-weight: 600; }
  .den__nazev { font-family: var(--font-serif); font-size: var(--fs-h3); line-height: 1.25; }
  .den__meta { color: var(--muted); }
  .den__sipka { position: absolute; right: var(--s-4); top: var(--s-5); color: var(--ink-2); transition: rotate var(--pohyb-rychle); }
  .den--otevreny .den__sipka { rotate: 180deg; }
  .den__obsah { padding: 0 var(--s-5) var(--s-5); }
  .den__obsah > p { margin: 0 0 var(--s-3); }
  .den__citat { margin: var(--s-4) 0; padding: var(--s-4) 0 var(--s-3); border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .den__citat blockquote { margin: 0; }
  .den__citat blockquote p { margin: 0 0 var(--s-2); font-size: var(--fs-text); line-height: 1.5; }
  .den__citat figcaption { color: var(--muted); }
  .den__citat cite { font-style: italic; }
  .den__mez { margin: var(--s-4) 0 0; padding: var(--s-3) var(--s-4); border-radius: var(--r-sm); background: var(--pc-tint); color: var(--ink); }
  .den__mez-nadpis { display: block; margin-bottom: var(--s-1); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
  .psani { margin-top: var(--s-5); }
  .psani__stav { margin: 0; color: var(--ink-2); }
  .den__odkaz { margin: var(--s-4) 0 0; }
  .den__odkaz a { display: inline-flex; align-items: center; min-height: 44px; }
  .den__hotovo span { margin-right: var(--s-1); }
  @media (min-width: 700px) {
    .den__tl { padding-inline: var(--s-6) calc(var(--s-6) + 28px); }
    .den__obsah { padding: 0 var(--s-6) var(--s-6); }
  }
</style>
