<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Loď po prknech: kresba k Théseově lodi (cesta 2, krok 4). Vpravo stojí loď v přístavu, vlevo je břeh.
  // Posuvník vyměňuje prkna: staré prkno odjede na břeh a na jeho místě se ukáže nové, světlejší.
  // Pohled „Výměna prken“ skládá stará prkna na hromadu, pohled „Druhá loď“ z nich na břehu skládá loď,
  // každé prkno na místě, které mělo. Samy se hýbou jen vlny a jdou zastavit; výměna prkna je přechod
  // a při omezeném pohybu se stav změní hned. Kresba nic neukládá a nenabízí Kam dál.
  // Rám dává Kresba.svelte. Stav, geometrie a texty: src/lib/lod.ts. Podklad: docs/podklady/celek-7-jsem-porad-tentyz.md ›
  // Kresba s pohybem: loď po prknech a druhá loď (Plútarchos, Théseus 23, 1; Hobbes, O tělese II, 11, 7).
  // Použití v MDX: <Lod id="lod-po-prknech" />
  import Kresba from './Kresba.svelte';
  import { natrzenyPruh } from '../../lib/kresby';
  import { BREH, HLADINA, OBRYS_TRUPU, PLATNO, POCET, POHLEDY_LODI, POPISKY_LODI, PRKNA, SIRKA_TRUPU, TRUP_A, TRUP_B, ZEM, jeVymenene, popisLodi, posunPrkna, stavPosuvniku, type PohledLodi } from '../../lib/lod';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 1 }: Props = $props();

  let pohled = $state<string>('vymena');
  let n = $state(0);
  let popis = $derived(popisLodi(pohled as PohledLodi, n));
  let stav = $derived(stavPosuvniku(n));

  /** vlnovka přes celou hladinu; o jednu vlnu delší na obě strany, aby se dala posouvat ve smyčce */
  // Koláž (K7b): břeh natržený pruh lístku, moře pruh šedého papíru, vlny světlou tužkou, prkna výstřižky.
  const BREH_PRUH = natrzenyPruh(0, BREH - 8, ZEM, PLATNO.vyska, { zub: 1.6, semeno: 4 });
  const VLNA = 24;
  const vlna = (y: number) => {
    let d = `M${BREH - 2 * VLNA},${y} q${VLNA / 4},-3 ${VLNA / 2},0`;
    for (let x = BREH - 2 * VLNA + VLNA / 2; x < PLATNO.sirka + VLNA; x += VLNA / 2) d += ` t${VLNA / 2},0`;
    return d;
  };
</script>

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.Lod} nazev={NAZVY_KRESEB.Lod} pohledy={POHLEDY_LODI} bind:pohled {popis} viewBox="0 0 {PLATNO.sirka} {PLATNO.vyska}">
  {#snippet kresba()}
    <defs>
      <clipPath id="{id}-more"><rect x={BREH} y={HLADINA} width={PLATNO.sirka - BREH} height={PLATNO.vyska - HLADINA} /></clipPath>
    </defs>
    <!-- Břeh vlevo, hladina vpravo. Samy se hýbou jen vlny. -->
    <path class="k-listek-papir k-vystrih" d={BREH_PRUH} />
    <path class="more k-vystrih" d="M{BREH - 8},{PLATNO.vyska} L{BREH - 8},{ZEM} L{BREH},{HLADINA} L{PLATNO.sirka},{HLADINA} L{PLATNO.sirka},{PLATNO.vyska} Z" />
    <g clip-path="url(#{id}-more)">
      <g class="vlny k-hybe">
        <path d={vlna(HLADINA + 7)} />
        <path d={vlna(HLADINA + 15)} />
      </g>
    </g>

    <!-- Druhá loď na břehu: čárkovaný obrys a podpěry jsou vidět jen v pohledu Druhá loď. -->
    <g class="druha" class:je={pohled === 'druha'}>
      <g transform="translate({TRUP_B.x} {TRUP_B.y})">
        <path class="obrys" d={OBRYS_TRUPU} />
        <rect class="podpera" x="36" y="33" width="3" height={ZEM - TRUP_B.y - 33} />
        <rect class="podpera" x={SIRKA_TRUPU - 39} y="33" width="3" height={ZEM - TRUP_B.y - 33} />
      </g>
      <text class="k-popisek" x="12" y={PLATNO.vyska - 9}>{POPISKY_LODI.druha}</text>
    </g>
    <text class="k-popisek hromada" class:je={pohled === 'vymena'} x="12" y={PLATNO.vyska - 9}>{POPISKY_LODI.hromada}</text>
    <text class="k-popisek k-popisek--svetly" x={TRUP_A.x + SIRKA_TRUPU / 2} y={PLATNO.vyska - 7} text-anchor="middle">{POPISKY_LODI.pristav}</text>

    <!-- Loď v přístavu: nová prkna leží pod starými a ukážou se, až staré odjede. -->
    <g transform="translate({TRUP_A.x} {TRUP_A.y})">
      {#each PRKNA as p (p.i)}
        <path class="nove" class:je={jeVymenene(p, n)} d={p.tvar} />
      {/each}
      {#each PRKNA as p (p.i)}
        {@const posun = posunPrkna(p, n, pohled as PohledLodi)}
        <g class="stare" class:venku={jeVymenene(p, n)} style:transform="translate({posun.dx}px, {posun.dy}px)">
          <path class="stare__tvar" d={p.tvar} />
          <path class="stare__leta" d="M{p.stred.x - 3.5},{p.stred.y - 1.8} h6 M{p.stred.x - 1.5},{p.stred.y + 2} h5.5" />
        </g>
      {/each}
    </g>
  {/snippet}

  {#snippet ovladani()}
    <div class="k-posuvnik">
      <label for="{id}-prkna">Posuň: vyměň prkna</label>
      <input id="{id}-prkna" type="range" min="0" max={POCET} step="1" bind:value={n} aria-valuetext={stav} />
      <output for="{id}-prkna">{stav}</output>
    </div>
  {/snippet}
</Kresba>

<style>
  .more { fill: var(--k-stin); }

  /* Vlny: jediný pohyb, který běží sám. Posun o jednu vlnu se opakuje beze švu. */
  .vlny path { fill: none; stroke: var(--k-svetlo); stroke-width: 1.3; stroke-linecap: round; opacity: 0.7; }
  :global(.kresba--pohyb) .vlny { animation: lod-vlny 3.6s linear infinite; }
  @keyframes lod-vlny { to { transform: translateX(24px); } }

  /* Nové prkno je světlé a hladké; staré je tmavší a má léta, takže se neliší jen barvou. */
  .nove { fill: var(--k-svetlo); stroke: var(--k-tma); stroke-width: 0.7; stroke-linejoin: round; opacity: 0; transition: opacity var(--d-listek); }
  .nove.je { opacity: 1; }
  .stare { transition: transform var(--d-kamera) var(--k-papir); }
  .stare__tvar { fill: color-mix(in srgb, var(--k-svetlo) 46%, var(--k-stin)); stroke: var(--k-tma); stroke-width: 0.7; stroke-linejoin: round; }
  .stare__leta { fill: none; stroke: var(--k-tma); stroke-width: 0.9; stroke-linecap: round; opacity: 0.75; }

  .druha { opacity: 0; transition: opacity var(--d-listek); }
  .druha.je { opacity: 1; }
  /* Obrys druhé lodi tužkou, čárkovaně: zatím jen místo, kam se prkna skládají. */
  .obrys { fill: none; stroke: var(--tuzka); stroke-width: 1.2; stroke-dasharray: 3 3; }
  .podpera { fill: var(--ink-3); }
  .hromada { opacity: 0; transition: opacity var(--d-listek); }
  .hromada.je { opacity: 1; }
</style>
