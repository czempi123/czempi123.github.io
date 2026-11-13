<script lang="ts">
  // Odkryj (dříve Nejdřív sám) v rámu aktivity (K4a): student napíše vlastní pokus svým perem; srovnání, modelové
  // odpovědi a sebekontrola leží pod přeloženým papírem, který se po činu studenta odklopí od horní hrany
  // (--d-odkryti, plátno Pohyb.dc.html › Odkryj). Srovnání je lístek s páskou. Nic se nehodnotí; odpověď jde do deníku
  // a vydrží obnovení. Srovnání se vykreslí až odkrytím, dřív není vidět ani pro čtečku (student první).
  // Použití v MDX (přes obal src/components/bloky/Odkryj.astro):
  // <Odkryj id="sokrates-kdo-je-moudry" otazka="Koho považuješ za moudrého?" tlacitko="Porovnat se Sókratem"
  //   modelove={[{ text: '…', komentar: '…' }]} sebekontrola={['…']}>Srovnání s filozofem…</Odkryj>
  import { VYCHOZI_NADTITULKY } from '../../lib/nadtitulky';
  import { onMount, tick, type Snippet } from 'svelte';
  import { najdiZapis, ulozZapis, smazZapis, stavBloku, ulozStavBloku, smazStavBloku, peroDeniku, ulozPero } from '../../lib/denik';
  import { platnyStavOdkryj, radek } from '../../lib/bloky';
  import { nezlomitelne } from '../../lib/sazba.js';
  import { VYCHOZI_PERO } from '../../lib/pero';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import VolbaPera from './VolbaPera.svelte';
  import type { ClovekBloku, Dal } from './bloky-typy';

  interface Modelova { text: string; komentar?: string }
  interface Props {
    id: string;
    nadtitulek?: string;
    otazka: string;
    tlacitko?: string;
    odkaz: string;
    modelove?: Modelova[];
    sebekontrola?: string[];
    /** CSS třída období (obdobi-N); bez ní blok převezme barvu stránky */
    obdobi?: number;
    /** filozof, se kterým se student srovnává (mince v hlavičce) */
    filozof?: ClovekBloku;
    /** Kam dál po odkrytí */
    dal?: Dal;
    children?: Snippet;
  }
  let { id, nadtitulek = VYCHOZI_NADTITULKY.Odkryj, otazka, tlacitko = 'Odkrýt', odkaz, modelove = [], sebekontrola = [], obdobi, filozof, dal, children }: Props = $props();

  let odpoved = $state('');
  let odkryto = $state(false);
  let upravuji = $state(false);
  let ulozeno = $state(false);
  let kontrola = $state<boolean[]>(sebekontrola.map(() => false));
  let oblast = $state<HTMLElement>();
  /** přeložený papír se právě odklápí (po kliknutí); po obnovení stránky žádný není */
  let klopi = $state(false);
  let nabidkaPera = $state(false);

  onMount(() => {
    const s = platnyStavOdkryj(stavBloku(id), sebekontrola.length);
    const z = najdiZapis(id);
    if (s) {
      odkryto = s.odkryto;
      kontrola = s.kontrola;
      odpoved = s.odpoved;
    }
    if (z) {
      odpoved = z.odpoved;
      odkryto = true;
      ulozeno = true;
    }
  });

  function ulozStav() {
    ulozStavBloku(id, { odpoved: odpoved.trim(), odkryto, kontrola }, { odkaz, otazka, druh: 'odkryj', hotovo: odkryto });
  }

  function zapis() {
    if (odpoved.trim()) {
      ulozZapis({ id, otazka, odpoved: odpoved.trim(), odkaz, druh: 'odkryj' });
      ulozeno = true;
    }
    ulozStav();
  }

  async function porovnej() {
    klopi = true;
    odkryto = true;
    zapis();
    // Pero se nabídne jednou, při první odpovědi (jako v RamAktivity).
    if (!peroDeniku()) { ulozPero(VYCHOZI_PERO); nabidkaPera = true; }
    // Pojistka, kdyby konec přechodu nepřišel (skrytá karta, starý prohlížeč).
    setTimeout(() => (klopi = false), 1200);
    await tick();
    oblast?.focus();
  }

  function ulozUpravu() {
    upravuji = false;
    zapis();
  }

  function zaskrtni(i: number, ano: boolean) {
    kontrola[i] = ano;
    ulozStav();
  }

  async function znovu() {
    odpoved = '';
    odkryto = false;
    upravuji = false;
    ulozeno = false;
    klopi = false;
    kontrola = sebekontrola.map(() => false);
    smazStavBloku(id);
    smazZapis(id);
    await tick();
    document.getElementById(`${id}-pole`)?.focus();
  }
</script>

{#snippet akce()}
  {#if !odkryto}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={porovnej}>{tlacitko}</button>
  {:else if upravuji}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={ulozUpravu}>Uložit do deníku</button>
  {:else}
    <BlokDal {dal} />
  {/if}
{/snippet}

<RamAktivity
  {id}
  {obdobi}
  trida="odkryj"
  {nadtitulek}
  lide={filozof ? [filozof] : []}
  labelledby={`${id}-otazka`}
  ulozeno={ulozeno && odkryto ? 'Tvoje odpověď je uložená v deníku.' : undefined}
  znovu={odkryto ? znovu : undefined}
  hlavni={!odkryto || upravuji || dal ? akce : undefined}
>
  <h3 class="t-h3 blok__otazka" id={`${id}-otazka`} data-cast="otazka">{nezlomitelne(otazka)}</h3>
  <label class="vizualne-skryte" for={`${id}-pole`} data-cast="duvod">Tvoje odpověď</label>
  <textarea
    class="blok__pole"
    data-cast="duvod"
    id={`${id}-pole`}
    rows="3"
    bind:value={odpoved}
    onchange={() => !odkryto && ulozStav()}
    placeholder="Tady píšeš ty…"
    disabled={odkryto && !upravuji}
  ></textarea>
  {#if odkryto && !upravuji}
    <p class="odkryj__uprava" data-cast="duvod">
      <button class="blok__tl blok__tl--tiche" type="button" onclick={() => (upravuji = true)}>
        {odpoved.trim() ? 'Upravit odpověď' : 'Připsat odpověď'}
      </button>
    </p>
  {/if}

  <!-- Přeložený papír: dokud student neodkryje, leží na místě srovnání složený list; po kliknutí se odklopí nahoru. -->
  <div class={['odkryj__slozka', odkryto && 'odkryj__slozka--odkryto']} data-cast="slozka">
    {#if odkryto}
      <div class="listek-paska blok__vazba odkryto" data-cast="zpetna" role="region" aria-label="Srovnání" aria-live="polite" tabindex="-1" bind:this={oblast}>
        <span class="paska paska--mala paska--nahore" aria-hidden="true"></span>
        {#if children}{@render children()}{/if}

        {#if modelove.length}
          <div class="blok__oddil">
            <h4 class="blok__zpetna-titulek">Jak se dá odpovědět</h4>
            <ul class="modelove">
              {#each modelove as m, i (i)}
                <li>
                  <p class="modelova">„{@html radek(m.text)}“</p>
                  {#if m.komentar}<p class="komentar">{@html radek(m.komentar)}</p>{/if}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if sebekontrola.length}
          <fieldset class="blok__oddil kontrola">
            <legend class="blok__zpetna-titulek">Zkontroluj svou odpověď</legend>
            {#each sebekontrola as k, i (i)}
              <label class="zaskrtnuti">
                <input type="checkbox" checked={kontrola[i]} onchange={(e) => zaskrtni(i, e.currentTarget.checked)} />
                <span>{@html radek(k)}</span>
              </label>
            {/each}
          </fieldset>
        {/if}
      </div>
    {/if}
    {#if !odkryto || klopi}
      <div class="odkryj__kryt" aria-hidden="true" ontransitionend={() => (klopi = false)}>
        <p>Nejdřív napiš svoje, pak odklop.</p>
        <i class="odkryj__sero"></i>
      </div>
    {/if}
  </div>
  {#if nabidkaPera && odkryto}<div data-cast="duvod"><VolbaPera kompaktni /></div>{/if}
</RamAktivity>

<style>
  .odkryj__uprava { margin: calc(-1 * var(--s-3)) 0 var(--s-3); }
  /* Přeložený papír (Pohyb.dc.html › Odkryj): list ležící přes místo srovnání, ohyb nahoře.
     Po odkrytí se odklopí kolem horní hrany (rotateX), rubem pryč, a srovnání pod ním je hned čitelné. */
  .odkryj__slozka { position: relative; min-height: 96px; margin-top: var(--s-5); perspective: 1100px; }
  .odkryj__slozka--odkryto { min-height: 0; }
  .odkryj__slozka--odkryto > .blok__vazba { margin-top: 0; }
  .odkryj__kryt {
    position: absolute;
    inset: 0 0 auto;
    height: 96px;
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(to bottom, color-mix(in srgb, var(--ink) 6%, transparent) 0 1px, transparent 1px 12px), var(--list);
    box-shadow: var(--lezi);
    transform-origin: 50% 0;
    backface-visibility: hidden;
    rotate: -.4deg;
    transition: transform var(--d-odkryti) var(--k-papir);
  }
  .odkryj__kryt p { margin: 0; font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .odkryj__sero { position: absolute; inset: 0; background: #000; opacity: 0; pointer-events: none; transition: opacity var(--d-odkryti) var(--k-papir); }
  .odkryj__slozka--odkryto .odkryj__kryt { transform: rotateX(-178deg); pointer-events: none; }
  .odkryj__slozka--odkryto .odkryj__sero { opacity: .3; }
  .modelove { margin: 0; padding: 0; list-style: none; display: grid; gap: var(--s-4); }
  .modelova { margin: 0 0 var(--s-1); font-style: italic; }
  .komentar { margin: 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); line-height: var(--lh-ovladani); color: var(--ink-2); }
  .kontrola { margin-inline: 0; padding-inline: 0; padding-bottom: 0; border: 0; border-top: 1px dashed var(--tuzka); }
  .kontrola legend { float: left; width: 100%; padding: 0; }
  .zaskrtnuti {
    clear: both;
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    min-height: 44px;
    padding: var(--s-2) 0;
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    line-height: var(--lh-ovladani);
    cursor: pointer;
  }
  .zaskrtnuti input {
    flex: none;
    width: 22px;
    height: 22px;
    margin: 0;
    accent-color: var(--pero);
    cursor: pointer;
  }
  .zaskrtnuti input:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
</style>
