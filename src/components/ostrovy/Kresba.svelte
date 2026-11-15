<script lang="ts">
  // Kresba s pohybem: společný rám pro vlastní kresby atlasu, které se hýbou (jeskyně ve dvou pohledech, cesta ven).
  // Rám dává list s páskou, název, plátno (tečkovaný papír přilepený na list), drážku s ovládáním (přepínač pohledů,
  // ovládání kresby, Zastavit pohyb) a text pod kresbou. Scéna (obsah <svg>) a případné další ovládání (posuvník)
  // přicházejí jako snippety z ostrovu konkrétní kresby.
  // Pravidla (docs/design.md › Bloky a aktivity): pohyb běží jen tam, kde ho student nemá omezený,
  // jde zastavit a zastavená kresba ukáže obsah; text pod kresbou říká totéž slovy a je popisem obrázku pro čtečky;
  // kresba nic neukládá a nenabízí Kam dál.
  // Koláž (design-v2 K7b, plátno project/KresbaVitr.dc.html): výstřižky z papíru (k-list, k-listek, k-pp) se stínem
  // výstřižku (k-vystrih, filtr z rámu), zem natržený pruh (natrzenyPruh v src/lib/kresby.ts), směr a síly tužkou
  // (k-tuzka), světlo a tma tóny k-svetlo, k-stin, k-tma (global.css › Kresba s pohybem), repliky na lístečku
  // (KresbaListek.svelte), popisky Instrument Sans (k-popisek). Barva období jen na jednom nositeli významu.
  // Pohyblivý prvek dostane třídu k-hybe a vlastní animaci pod :global(.kresba--pohyb); zastavení řeší rám.
  // Posuvník ve snippetu ovladani dostane třídu k-posuvnik, přepínač třídy k-volba a k-prepinac (global.css).
  // Kresba bez vlastního pohybu: maPohyb={false}.
  // Použití: viz src/components/ostrovy/Jeskyne.svelte, JeskyneVen.svelte, Saty.svelte, StejnyVitr.svelte,
  // DvePulky.svelte, KolikJeDost.svelte a Lod.svelte (posuvník, dva pohledy a pohyb, který běží sám).
  import { onMount, type Snippet } from 'svelte';
  import { omezenyPohyb } from '../../lib/pohyb';
  import { nezlomitelne } from '../../lib/sazba.js';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
    nadtitulek?: string;
    nazev: string;
    /** pohledy kresby; jeden pohled přepínač neukáže */
    pohledy: { id: string; nazev: string }[];
    /** zvolený pohled (bind:pohled) */
    pohled: string;
    /** text pod kresbou: říká totéž co kresba */
    popis: string;
    /** obsah plátna (prvky SVG) */
    kresba: Snippet;
    /** další ovládání pod plátnem (posuvník) */
    ovladani?: Snippet;
    /** rozměr plátna; výchozí 340 × 240 jednotek (na telefonu vyjde jednotka asi na pixel) */
    viewBox?: string;
    /** běží v kresbě něco samo? Kresba, kterou hýbe jen student (posuvník), tlačítko pohybu nemá. */
    maPohyb?: boolean;
  }
  let { id, obdobi = 1, nadtitulek = 'Podívej se', nazev, pohledy, pohled = $bindable(), popis, kresba, ovladani, viewBox = '0 0 340 240', maPohyb = true }: Props = $props();
  /** Široká kresba (víc než 1,8 : 1): na plátně v podobě Jen kresba zůstane ovládání pod ní, ne vedle (src/styles/promitani.css). */
  let siroka = $derived.by(() => {
    const [, , w, h] = viewBox.split(/[\s,]+/).map(Number);
    return w > 0 && h > 0 && w / h > 1.8;
  });

  /** smí se kresba hýbat (student nemá zapnutý omezený pohyb) */
  let smiPohyb = $state(false);
  let bezi = $state(false);

  onMount(() => {
    smiPohyb = !omezenyPohyb();
    bezi = smiPohyb;
  });

  let nazevPohledu = $derived(pohledy.find((p) => p.id === pohled)?.nazev ?? nazev);
  let maOvladani = $derived(pohledy.length > 1 || !!ovladani || (smiPohyb && maPohyb));
</script>

<figure class="kresba obdobi-{obdobi}" class:kresba--pohyb={smiPohyb} class:kresba--bezi={bezi} {id} data-siroka={siroka ? '' : undefined} style:--k-vystrih="url(#{id}-vystrih)">
  <span class="paska paska--mala kresba__paska" aria-hidden="true"></span>
  <figcaption class="kresba__hlava" data-cast="hlava">
    <p class="t-nadtitulek kresba__nadtitulek">{nadtitulek}</p>
    <p class="t-h3 kresba__nazev" id="{id}-nazev">{nazev}</p>
  </figcaption>

  <svg class="kresba__platno papir" data-cast="platno" {viewBox} role="img" aria-label={nazevPohledu} aria-describedby="{id}-popis">
    <defs>
      <!-- Stín výstřižku: papír leží na papíře, bez obrysové čáry. -->
      <filter id="{id}-vystrih" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow class="kresba__vrzeny" dx="0" dy="1.3" stdDeviation="0.9" />
      </filter>
    </defs>
    {@render kresba()}
  </svg>

  {#if maOvladani}
    <div class="kresba__ovladani">
      {#if pohledy.length > 1}
        <div class="kresba__prepinac k-prepinac" role="radiogroup" aria-labelledby="{id}-nazev">
          {#each pohledy as p (p.id)}
            <label>
              <input type="radio" name="{id}-pohled" value={p.id} bind:group={pohled} />
              <span>{p.nazev}</span>
            </label>
          {/each}
        </div>
      {/if}

      {#if ovladani}{@render ovladani()}{/if}

      {#if smiPohyb && maPohyb}
        <button type="button" class="blok__tl blok__tl--tiche kresba__pohyb" onclick={() => (bezi = !bezi)}>
          {bezi ? 'Zastavit pohyb' : 'Pustit pohyb'}
        </button>
      {/if}
    </div>
  {/if}

  <!-- Text přichází z JavaScriptu kresby, plugin pro MDX ho nevidí: nezlomitelné mezery doplní rám. -->
  <p class="kresba__popis" data-cast="popis" id="{id}-popis" aria-live="polite">{nezlomitelne(popis)}</p>
</figure>

<style>
  /* List s páskou, na něm přilepené plátno z tečkovaného papíru (design-v2 K7b; plátno project/KresbaVitr.dc.html). */
  .kresba {
    position: relative;
    max-width: 520px;
    /* Na střed sloupce jako text kolem (autor 15. 11. 2026: kresby stály u levého kraje). */
    margin: var(--s-7) auto var(--s-6);
    padding: 26px var(--s-3) var(--s-3);
    background: var(--list);
    box-shadow: var(--lezi);
    border-radius: var(--r-papir);
    scroll-margin-top: calc(var(--hlavicka) + var(--hodina) + var(--s-4));
  }
  @media (min-width: 700px) {
    .kresba { padding: 30px var(--s-4) var(--s-4); }
  }
  .kresba__paska { top: -11px; left: calc(50% - 45px); rotate: -2deg; }
  .kresba__hlava { margin: 0 0 var(--s-3); }
  .kresba__nadtitulek { margin: 0 0 var(--s-1); color: var(--p, var(--ink)); }
  .kresba__nazev { margin: 0; }

  /* Plátno: tečkovaný papír (třída papir v global.css) s tenkou linkou a stínem přilepeného papíru. */
  .kresba__platno {
    display: block;
    width: 100%;
    height: auto;
    background-size: 18px 18px;
    box-shadow: inset 0 0 0 1px var(--linka), var(--lezi-tlak);
  }
  .kresba__vrzeny { flood-color: color-mix(in srgb, var(--papir) 30%, rgb(40 30 20)); flood-opacity: .5; }

  /* Ovládání ve vtlačené drážce pod plátnem: přepínač pohledů, posuvník, tlačítka, Zastavit pohyb. */
  .kresba__ovladani {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--s-2);
    margin: var(--s-3) 0 0;
    padding: var(--s-2) var(--s-3) var(--s-3);
    border-radius: var(--r-ovladani);
    background: var(--papir);
    box-shadow: var(--vtla-mele);
  }
  .kresba__ovladani > :global(*) { margin-top: 0; margin-bottom: 0; }
  .kresba__ovladani > :global(:is(.k-posuvnik, .blok__akce, .den)) { align-self: stretch; }
  .kresba__prepinac { margin-top: var(--s-1) !important; }

  .kresba__popis {
    margin: var(--s-3) 0 0;
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    line-height: 1.5;
    color: var(--ink-2);
  }
</style>
