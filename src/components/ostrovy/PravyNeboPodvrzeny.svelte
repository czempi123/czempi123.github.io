<script lang="ts">
  // Pravý, nebo podvržený? (herna-v1, K3; plátno D5 › dvě razítka): série ústřižků z obrazovky telefonu s větou,
  // která koluje pod jménem filozofa (záznam pripsani v zdroje.yaml). Pod ústřižkem razítko člověka s větou z dat,
  // čím se zabýval, aby student uvažoval, ne hádal. Dvě razítka: kulaté „řekl to“, hranaté „neřekl to“. Po otisku
  // proužek s opravou přímo na ústřižku (podvržená věta nikdy nestojí bez opravy) a lístek s původem z dat: co
  // doopravdy stojí v pramenu, kdo větu napsal, nebo že původ neznáme, kde věta koluje a jak si citát ověřit.
  // Jeden otisk na kartu, Další karta v patě, po poslední souhrn. Do deníku jen stav.
  // Použití v MDX (obsah v src/content/bloky/dilna-pravy.yaml, druh: pravy):
  // <PravyNeboPodvrzeny id="dilna-pravy" />
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import { platnyStavPravy, hotovaSeriePravy, sediRazitko, textRazitka, RAZITKA, SEDI, type Razitko, type PuvodKarty } from '../../lib/herna';
  import { omezenyPohyb } from '../../lib/pohyb';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import Nuzky from '../ui/Nuzky.svelte';
  import type { ClovekBloku, Dal } from './bloky-typy';

  interface KartaPravy {
    id: string;
    /** věta, jak koluje */
    veta: string;
    clovek: ClovekBloku;
    /** čím se člověk zabýval: první věta pole proc */
    myslenka: string;
    zena: boolean;
    odkud: string;
    overeni: string;
    verdikt: Razitko;
    puvod: PuvodKarty;
  }
  interface Props {
    id: string;
    blok: { obdobi: number; nadtitulek: string; nazev: string; scena?: string; otazka: string; pokyn: string; karty: KartaPravy[] };
    odkaz: string;
    dal?: Dal;
  }
  let { id, blok, odkaz, dal }: Props = $props();

  const n = $derived(blok.karty.length);
  let karta = $state(0);
  let tipy = $state<(Razitko | null)[]>(blok.karty.map(() => null));
  let cerstve = $state(false);
  let rozdat = $state(false);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();

  const k = $derived(blok.karty[karta]);
  const tip = $derived(tipy[karta] ?? null);
  const sedi = $derived(tip !== null && sediRazitko(tip, k));
  const hotovo = $derived(hotovaSeriePravy({ karta, tipy }));
  const zacato = $derived(tipy.some((t) => t !== null));

  onMount(() => {
    const s = platnyStavPravy(stavBloku(id), n);
    if (s) ({ karta, tipy } = s);
  });

  function ulozStav() {
    if (!zacato) return smazStavBloku(id);
    ulozStavBloku(id, { karta, tipy }, { odkaz, otazka: blok.otazka, druh: 'pravy', hotovo });
  }
  const prvek = (vyber: string) => document.getElementById(id)?.querySelector<HTMLElement>(vyber);

  async function otiskni(r: Razitko) {
    if (tip !== null) return;
    tipy = tipy.map((t, i) => (i === karta ? r : t));
    cerstve = true;
    rozdat = false;
    ulozStav();
    hlaseni = `${sediRazitko(r, k) ? `${SEDI} ` : ''}${k.puvod.titulek} ${k.puvod.oprava}.`;
    await tick();
    oblast?.focus();
  }

  async function dalsi() {
    if (tip === null || karta >= n - 1) return;
    karta += 1;
    cerstve = false;
    rozdat = !omezenyPohyb();
    hlaseni = `Ústřižek ${karta + 1} z ${n}.`;
    ulozStav();
    await tick();
    prvek('.razitko-verdikt')?.focus();
  }

  async function znovu() {
    karta = 0;
    tipy = blok.karty.map(() => null);
    cerstve = false;
    rozdat = !omezenyPohyb();
    hlaseni = `Ústřižek 1 z ${n}.`;
    smazStavBloku(id);
    await tick();
    prvek('.razitko-verdikt')?.focus();
  }
</script>

{#snippet vazba()}
  {#if tip !== null}
    {#if sedi}<p class="blok__zpetna-titulek">{SEDI}</p>{/if}
    <p class={sedi ? 'puvod__titulek' : 'blok__zpetna-titulek'}>{k.puvod.titulek}</p>
    {#if k.puvod.autor}<p class="puvod__autor">{k.puvod.autor}</p>{/if}
    {#if k.puvod.citat}
      <blockquote class="puvod__citat"><p>„{@html radek(k.puvod.citat.text)}“</p><footer>{k.puvod.citat.kde}</footer><Nuzky id={k.puvod.citat.id} text={k.puvod.citat.text} kde={k.puvod.citat.kde} kompaktni /></blockquote>
    {/if}
    <p>{@html radek(k.puvod.popis)}</p>
    <p class="puvod__koluje"><span class="puvod__stitek">Kde koluje:</span> {@html radek(k.puvod.koluje)}.</p>
    <p class="puvod__overeni"><span class="puvod__stitek">Jak si citát ověřit:</span> {@html radek(k.overeni)}</p>
    {#if hotovo}{@render souhrn()}{/if}
  {/if}
{/snippet}

{#snippet souhrn()}
  <p class="souhrn__titulek">Všech {n} ústřižků</p>
  <ul class="souhrn">
    {#each blok.karty as c (c.id)}
      <li><span class="souhrn__veta">„{@html radek(c.veta)}“</span> <span class="souhrn__oprava">{c.puvod.oprava}</span></li>
    {/each}
  </ul>
{/snippet}

{#snippet akce()}
  {#if hotovo}
    <BlokDal {dal} />
  {:else}
    <button class="blok__tl blok__tl--hlavni serie__dalsi" type="button" onclick={dalsi}>Další ústřižek</button>
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="pravy"
  nadtitulek={blok.nadtitulek}
  nazev={blok.nazev}
  labelledby={`${id}-otazka`}
  vazba={tip !== null ? vazba : undefined}
  vazbaPopisek="Odkud věta je"
  {cerstve}
  bind:vazbaPrvek={oblast}
  znovu={zacato ? znovu : undefined}
  hlavni={hotovo ? (dal ? akce : undefined) : tip !== null ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  <div class="serie" data-cast="moznosti">
    <p class="serie__postup t-popisek">Ústřižek {karta + 1} z {n}</p>
    {#key karta}
      <div class={['ustrizek', rozdat && 'rozdat']} style={`--nat: ${[-0.8, 0.6, -0.5, 0.9, -0.7, 0.4, -1, 0.7][karta % 8]}deg`}>
        <p class="ustrizek__lista"><span>{k.odkud}</span><span class="ustrizek__tecky" aria-hidden="true">···</span></p>
        <blockquote class="ustrizek__veta"><p>{@html radek(k.veta)}</p></blockquote>
        <p class="ustrizek__kdo"><span class="vizualne-skryte">Pod větou stojí jméno </span><span aria-hidden="true">— </span>{k.clovek.jmeno}</p>
        {#if tip !== null}
          <span class={['otisk-studenta', `otisk-studenta--${tip}`, cerstve && 'otisk']} aria-hidden="true">{textRazitka(tip, k.zena)}</span>
          {#if sedi}<span class={['herni-otisk', 'ustrizek__sedi', cerstve && 'otisk']} aria-hidden="true">sedí</span>{/if}
          <p class="ustrizek__oprava">{k.puvod.oprava}</p>
        {/if}
      </div>
    {/key}

    <div class="pripisuje">
      <RazitkoCloveka razitko={k.clovek.razitko} obdobi={k.clovek.obdobi} velikost={44} />
      <p><span class="pripisuje__jmeno">{k.clovek.jmeno}</span> <span class="pripisuje__myslenka">{@html radek(k.myslenka)}</span></p>
    </div>

    {#if tip === null}<p class="razitka__pokyn" id={`${id}-pokyn`}>{@html radek(blok.pokyn)}</p>{/if}
    <ul class="razitka" aria-label="Razítka" aria-describedby={tip === null ? `${id}-pokyn` : undefined}>
      {#each RAZITKA as r (r)}
        <li>
          <button
            class={['razitko-verdikt', `razitko-verdikt--${r}`, 'vystouple', tip === r && 'razitko-verdikt--otisknute']}
            type="button"
            aria-pressed={tip === r}
            disabled={tip !== null}
            onclick={() => otiskni(r)}
          ><span class="razitko-verdikt__tvar">{textRazitka(r, k.zena)}</span></button>
        </li>
      {/each}
    </ul>
  </div>
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
</RamAktivity>

<style>
  .serie { margin: var(--s-3) 0 0; }
  .serie__postup { margin: 0 0 var(--s-3); color: var(--ink-2); }

  /* Ústřižek z obrazovky telefonu: zaoblené horní rohy, lišta aplikace, věta velkým bezpatkovým písmem, dole
     čárkovaná linka střihu. Natočení přes --natoceni (Klidný režim ho srovná). */
  .ustrizek {
    position: relative;
    max-width: 440px;
    margin: 0 0 56px;
    padding: 12px 20px 26px;
    border-radius: 22px 22px 2px 2px;
    border-bottom: 2px dashed var(--tuzka);
    background: var(--list);
    box-shadow: var(--lezi);
    rotate: calc(var(--nat, 0deg) * var(--natoceni));
  }
  .ustrizek__lista { display: flex; justify-content: space-between; gap: var(--s-3); margin: 0; padding-bottom: 8px; border-bottom: 1px solid var(--linka); font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .ustrizek__tecky { letter-spacing: .1em; }
  .ustrizek__veta { margin: var(--s-4) 0 var(--s-2); }
  .ustrizek__veta p { margin: 0; font-family: var(--font-sans); font-size: calc(var(--meritko) * 22px); font-weight: 700; line-height: 1.3; text-wrap: balance; }
  .ustrizek__kdo { margin: 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); color: var(--ink-2); }
  /* Otisk studenta v barvě pera (jeho ruka): tvar razítka, které zvolil, přes pravý horní roh ústřižku,
     aby nezakryl větu. */
  .otisk-studenta {
    position: absolute;
    z-index: 2;
    right: -12px;
    top: -20px;
    background: var(--list);
    display: inline-grid;
    place-items: center;
    padding: 6px 10px;
    border: 2.5px solid var(--pero);
    color: var(--pero);
    font-family: var(--font-sans);
    font-size: calc(var(--meritko) * 15px);
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    rotate: calc(-11deg * var(--natoceni));
    pointer-events: none;
  }
  /* Na telefonu by otisk přes roh (right: -12px) vystrčil stránku o pixel do strany (K5): přes roh jen kousek. */
  @media (max-width: 479px) { .otisk-studenta { right: -2px; } }
  .otisk-studenta--rekl { width: 80px; height: 80px; padding: 0; border-radius: 50%; text-align: center; line-height: 1.1; }
  .otisk-studenta--nerekl { border-radius: 3px; }
  .ustrizek__sedi { position: absolute; right: 4px; bottom: -44px; z-index: 2; }
  /* Oprava: proužek papíru přes spodek ústřižku, aby věta nikdy nestála bez ní. */
  .ustrizek__oprava {
    position: relative;
    display: inline-block;
    max-width: calc(100% - 100px);
    margin: var(--s-3) 0 -38px -6px;
    padding: 6px 12px;
    background: var(--listek);
    box-shadow: var(--lezi);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 600;
    line-height: 1.35;
    color: var(--ink);
    rotate: calc(.8deg * var(--natoceni));
  }

  .pripisuje { display: flex; align-items: center; gap: var(--s-3); margin: 0 0 var(--s-3); }
  .pripisuje :global(.razitko-cloveka) { flex: none; }
  .pripisuje p { margin: 0; }
  .pripisuje__jmeno { font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
  .pripisuje__myslenka { font-family: var(--font-serif); font-size: calc(var(--meritko) * 15px); line-height: 1.35; color: var(--ink-2); }

  .razitka__pokyn { margin: 0 0 var(--s-3); font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .razitka { display: flex; flex-wrap: wrap; gap: var(--s-4); margin: 0; padding: 0; list-style: none; }
  /* Razítka: vystouplá tlačítka, uvnitř tvar razítka (kulaté „řekl to“, hranaté „neřekl to“). Otisknuté je vtlačené. */
  .razitko-verdikt {
    display: grid;
    place-items: center;
    min-width: 120px;
    min-height: 120px;
    padding: var(--s-3);
    border: 0;
    border-radius: var(--r-ovladani);
    color: var(--ink);
    cursor: pointer;
  }
  .razitko-verdikt__tvar {
    display: grid;
    place-items: center;
    border: 2.5px solid currentColor;
    box-shadow: inset 0 0 0 3px var(--plocha, transparent), inset 0 0 0 4.5px currentColor;
    font-family: var(--font-sans);
    font-size: calc(var(--meritko) * 15px);
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    line-height: 1.1;
    text-align: center;
  }
  .razitko-verdikt--rekl .razitko-verdikt__tvar { width: 92px; height: 92px; border-radius: 50%; }
  .razitko-verdikt--nerekl .razitko-verdikt__tvar { width: 112px; height: 64px; border-radius: 3px; }
  .razitko-verdikt:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .razitko-verdikt:disabled { cursor: default; }
  .razitko-verdikt.razitko-verdikt--otisknute:disabled { outline: 0; box-shadow: var(--vtla); color: var(--pero); }
  .razitko-verdikt:disabled:not(.razitko-verdikt--otisknute) .razitko-verdikt__tvar { opacity: .5; }

  .puvod__titulek { margin: 0 0 var(--s-2); font-weight: 600; }
  .puvod__autor { margin: 0 0 var(--s-2); font-family: var(--font-sans); font-size: var(--fs-ovladani); color: var(--ink-2); }
  .puvod__citat { position: relative; margin: 0 0 var(--s-3); padding-left: var(--s-3); border-left: 2px solid var(--tuzka); }
  .puvod__citat p { margin: 0; font-style: italic; }
  .puvod__citat footer { padding-right: 44px; min-height: 24px; font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .puvod__stitek { font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
  .puvod__overeni { margin-bottom: 0; }

  .souhrn__titulek { margin: var(--s-4) 0 var(--s-2); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; }
  .souhrn { display: grid; gap: var(--s-2); margin: 0; padding: 0; list-style: none; }
  .souhrn li { display: flex; flex-wrap: wrap; column-gap: var(--s-2); }
  .souhrn__veta { font-style: italic; }
  .souhrn__oprava { font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; color: var(--ink); }
  .souhrn__oprava::before { content: '· '; color: var(--ink-3); }
</style>
