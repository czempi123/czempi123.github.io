<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Strhni masku: kresba k Senekovu obrazu z Dopisů Luciliovi 24, 13 (cesta 33, krok 4). Velká tragická maska zakrývá
  // tvář, sjede z ní stranou a zůstane ležet vedle; pak zmizí a znovu se nasadí. Pohled „První maska“: pod ní je tvář
  // menší. Pohled „Druhá maska“: tvář skoro stejně velká, kresba tedy neslibuje, že všechno je menší, než se zdá.
  // Pohyb jde zastavit. Zastavená kresba a kresba při omezeném pohybu ukážou výsledek (maska vedle tváře), ne zamrzlý
  // okamžik: kdo pohyb zastaví hned po načtení, by jinak tvář nikdy neviděl (poučení z celku 9). Rám dává Kresba.svelte;
  // nic se neukládá. Stav, geometrie a texty: src/lib/maska.ts. Podklad: docs/podklady/celek-10.md › h) Kresba „Maska“.
  // Použití v MDX: <Maska id="maska" />
  import Kresba from './Kresba.svelte';
  import { MASKA_CESTY, MASKA_VEDLE, PLATNO, POHLEDY_MASKY, POPISKY, TVARE, TVAR_STRED, popisMasky, tvar, type PohledMasky } from '../../lib/maska';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 2 }: Props = $props();

  let pohled = $state<string>('mensi');
  let t = $derived(tvar(TVARE[pohled as PohledMasky].rx, TVARE[pohled as PohledMasky].ry));
  let popis = $derived(popisMasky(pohled as PohledMasky));
</script>

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.Maska} nazev={NAZVY_KRESEB.Maska} pohledy={POHLEDY_MASKY} bind:pohled {popis} viewBox="0 0 {PLATNO.sirka} {PLATNO.vyska}">
  {#snippet kresba()}
    <rect class="k-stin" width={PLATNO.sirka} height={PLATNO.vyska} />

    {#key pohled}
      <!-- Tvář: obyčejná, s vlasy a ušima. Stojí pořád na místě. -->
      <g class="tvar" transform="translate({TVAR_STRED.x} {TVAR_STRED.y})">
        {#each t.usi as u, i (i)}<ellipse class="k-svetlo tvar__obrys" cx={u.cx} cy={u.cy} rx={u.rx} ry={u.ry} />{/each}
        <ellipse class="k-svetlo tvar__obrys" cx="0" cy="0" rx={t.rx} ry={t.ry} />
        <path class="k-tma" d={t.vlasy} />
        {#each t.oci as o, i (i)}<circle class="k-tma" cx={o.cx} cy={o.cy} r={o.r} />{/each}
        {#each t.oboci as d, i (i)}<path class="tvar__cara" d={d} />{/each}
        <path class="tvar__cara" d={t.nos} />
        <path class="tvar__cara" d={t.usta} />
      </g>

      <!-- Maska: střed nad tváří; vnitřní skupina se posouvá (atribut transform vnější skupiny tak zůstane platit). -->
      <g transform="translate({TVAR_STRED.x} {TVAR_STRED.y})">
        <g class="maska k-hybe" style:--dx="{MASKA_VEDLE.dx}px" style:--dy="{MASKA_VEDLE.dy}px" style:--rot="{MASKA_VEDLE.natoceni}deg">
          {#each MASKA_CESTY.tkanice as d, i (i)}<path class="maska__tkanice" d={d} />{/each}
          <path class="k-svetlo maska__obrys" d={MASKA_CESTY.obrys} />
          {#each MASKA_CESTY.oci as d, i (i)}<path class="k-tma" d={d} />{/each}
          {#each MASKA_CESTY.oboci as d, i (i)}<path class="maska__cara" d={d} />{/each}
          <path class="maska__cara maska__nos" d={MASKA_CESTY.nos} />
          <path class="k-tma" d={MASKA_CESTY.usta} />
        </g>
      </g>

      <g class="stitky k-hybe">
        <text class="k-popisek" x={POPISKY.tvar} y={POPISKY.y} text-anchor="middle">tvář</text>
        <text class="k-popisek" x={POPISKY.maska} y={POPISKY.y} text-anchor="middle">maska</text>
      </g>
    {/key}
  {/snippet}
</Kresba>

<style>
  .tvar__obrys { stroke: var(--k-tma); stroke-width: 1.6; }
  .tvar__cara { fill: none; stroke: var(--k-tma); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .maska__obrys { stroke: var(--k-tma); stroke-width: 2.2; }
  .maska__cara { fill: none; stroke: var(--k-tma); stroke-width: 2.4; stroke-linecap: round; }
  .maska__nos { stroke-width: 1.8; }
  .maska__tkanice { fill: none; stroke: var(--k-svetlo); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  /* Bez pohybu (omezený pohyb, sestavení, zastaveno) leží maska vedle tváře a popisky svítí: to je výsledek. */
  .maska {
    transform-box: fill-box;
    transform-origin: 50% 50%;
    transform: translate(var(--dx), var(--dy)) rotate(var(--rot));
  }

  /* Pohyb: maska drží na tváři, sjede stranou, leží vedle, zmizí a znovu se nasadí. Popisky svítí, jen když leží
     vedle. Rozepsané vlastnosti: zkratka bez jména animace se při sestavení zminifikuje na „none“. */
  :global(.kresba--pohyb) .maska {
    animation-name: maska-strhni;
    animation-duration: 11s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }
  :global(.kresba--pohyb) .stitky {
    animation-name: maska-stitky;
    animation-duration: 11s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }
  /* Zastavená kresba ukazuje výsledek, ne okamžik, kdy ji student zastavil (jako přesýpací hodiny v cestě 34).
     Pustit pohyb začne znovu od nasazené masky. */
  :global(.kresba--pohyb:not(.kresba--bezi)) .maska,
  :global(.kresba--pohyb:not(.kresba--bezi)) .stitky { animation-name: none; }

  @keyframes maska-strhni {
    0%, 18% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
    31% { transform: translate(38px, -30px) rotate(-6deg); opacity: 1; }
    46%, 84% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 1; }
    90% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
    91% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
    100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  }
  @keyframes maska-stitky {
    0%, 44% { opacity: 0; }
    50%, 84% { opacity: 1; }
    89%, 100% { opacity: 0; }
  }
</style>
