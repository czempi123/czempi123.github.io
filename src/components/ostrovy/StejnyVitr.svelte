<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Stejný vítr: kresba k větru z Theaitéta (profil Prótagora, kapitola 01). Dva lidé stojí v jednom větru,
  // jednomu je zima, druhému ne. Student mění jen to, co má kdo za sebou (čekání na místě, nebo chůzi);
  // proudy větru a šály obou se při tom hýbou pořád stejně. Text pod kresbou neříká, kdo má pravdu.
  // Rám dává Kresba.svelte; texty a stav počítá src/lib/vitr.ts.
  // Podklad: docs/podklady/celek-1-pravda.md › Tvrzení: Prótagorás, bod 1 (Theaitétos 152a–b).
  // Použití v MDX: <StejnyVitr id="vitr-dva-lide" />
  import Kresba from './Kresba.svelte';
  import KresbaListek from './KresbaListek.svelte';
  import { natrzenyPruh } from '../../lib/kresby';
  import { LIDE, PREDTIM, VYCHOZI_VITR, jeZima, popisVetru, rec, type Kdo, type StavVetru } from '../../lib/vitr';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 1 }: Props = $props();

  const NAZEV = NAZVY_KRESEB.StejnyVitr;
  const POHLEDY = [{ id: 'vitr', nazev: NAZEV }];
  let pohled = $state<string>('vitr');
  let stav = $state<StavVetru>({ ...VYCHOZI_VITR });

  /** Kde kdo stojí (osa postavy); zem je ve výšce 206. */
  const STRED: Record<Kdo, number> = { ty: 100, kamarad: 240 };
  /** Proudy větru: vedou přes celou kresbu, kolem obou postav stejně. Druhá hodnota je hrot šipky. */
  const PROUDY: [string, number, number][] = [
    ['M12,24 C50,16 86,32 124,24 S198,16 236,24 S300,30 326,24', 326, 24],
    ['M30,50 C66,44 100,56 136,50 S206,44 242,50 S290,54 308,50', 308, 50],
    ['M12,128 C50,120 86,136 124,128 S198,120 236,128 S300,134 326,128', 326, 128],
    ['M24,172 C60,166 94,178 130,172 S200,166 236,172 S294,176 316,172', 316, 172],
  ];
  // Koláž (K7b, plátno project/KresbaVitr.dc.html): zem natržený pruh lístku, postavy výstřižky z listu,
  // šála z papíru období (jediný nositel barvy), vítr tečkami tužkou, repliky na lístečcích s páskou.
  const ZEM = natrzenyPruh(0, 340, 205, 240, { semeno: 3 });
  /** Papírové listí, které vítr nese: kde leží, když kresba stojí. */
  const LISTI: [number, number, number, boolean][] = [[60, 150, 20, true], [170, 112, -30, false], [282, 160, 50, true], [124, 58, -10, false]];
</script>

<!-- Čára těla (paže, nohy): proužek lístkového papíru, takže je vidět i přes trup z listu. -->
{#snippet cara(d: string, sirka: number)}
  <path class="telo-cara" {d} stroke-width={sirka} />
{/snippet}

<!-- Konec šály vlaje ve větru; u obou postav stejně. -->
{#snippet sala(x: number, y: number)}
  <g transform="translate({x} {y})"><path class="sala k-hybe" d="M0,0 q7,-5 14,-1 t13,-2" /></g>
{/snippet}

{#snippet postava(kdo: Kdo)}
  <g transform="translate({STRED[kdo]} 206)">
    <!-- Po čekání: schoulený, ruce křížem, hlava mezi rameny, šála až k bradě. -->
    <g class="poza poza-zima" class:je={jeZima(stav[kdo])}>
      <g class="k-vystrih">
      <ellipse class="bota" cx="-7" cy="-3" rx="7" ry="3.5" />
      <ellipse class="bota" cx="8" cy="-3" rx="7" ry="3.5" />
      {@render cara('M-5,-42 L-6,-6 M5,-42 L6,-6', 9)}
      <path class="trup" d="M-14,-76 Q-15,-85 -8,-86 H9 Q16,-85 15,-76 L11,-40 H-11 Z" />
      {@render cara('M15,-78 L18,-62 L-9,-58', 6)}
      {@render cara('M-14,-78 L-17,-64 L10,-66', 6)}
      <circle class="trup" cx="2" cy="-94" r="10" />
      <path class="k-pp" d="M-8,-89 Q2,-83 12,-89 L12,-82 Q2,-76 -8,-82 Z" />
      {@render sala(11, -85)}
      </g>
      <path class="tres k-hybe" d="M-23,-84 q-4,5 0,10 M-28,-86 q-5,7 0,14 M25,-84 q4,5 0,10 M30,-86 q5,7 0,14" />
    </g>
    <!-- Po chůzi: stojí rovně, jedna ruka volně, druhá v bok, šála povolená. -->
    <g class="poza poza-teplo" class:je={!jeZima(stav[kdo])}>
      <g class="k-vystrih">
      <ellipse class="bota" cx="-10" cy="-3" rx="7" ry="3.5" />
      <ellipse class="bota" cx="12" cy="-3" rx="7" ry="3.5" />
      {@render cara('M-6,-46 L-9,-6 M6,-46 L10,-6', 9)}
      <path class="trup" d="M-15,-86 Q-15,-92 -9,-92 H9 Q15,-92 15,-86 L12,-44 H-12 Z" />
      {@render cara('M-15,-86 L-22,-52', 6)}
      {@render cara('M15,-86 L27,-68 L15,-54', 6)}
      <circle class="trup" cx="0" cy="-104" r="10" />
      <path class="k-pp" d="M-9,-93 Q0,-88 9,-93 L9,-89 Q0,-84 -9,-89 Z" />
      {@render sala(8, -90)}
      </g>
    </g>
  </g>
{/snippet}

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.StejnyVitr} nazev={NAZEV} pohledy={POHLEDY} bind:pohled popis={popisVetru(stav)}>
  {#snippet kresba()}
    <path class="k-listek-papir k-vystrih" d={ZEM} />

    <!-- Vítr: čtyři proudy zleva doprava tužkou. Dva vedou za postavami. -->
    {#each PROUDY as [d, x, y] (d)}
      <path class="proud k-hybe" {d} />
      <path class="hrot" d="M{x - 8},{y - 5} L{x},{y} L{x - 8},{y + 5}" />
    {/each}
    {#each LISTI as [x, y, u, pp], i (i)}
      <g transform="translate({x} {y}) rotate({u})">
        <g class="listi k-hybe listi--{i}"><path class={pp ? 'k-pp' : 'k-listek-papir'} d="M-6 0c3-5 9-5 12 0-3 5-9 5-12 0z" /></g>
      </g>
    {/each}

    {#each LIDE as clovek, i (clovek.id)}
      {@render postava(clovek.id)}
      <KresbaListek x={STRED[clovek.id]} y={76} natoceni={i === 0 ? -3 : 2.5} sirka={96} semeno={i + 2} trida="rec" text={rec(stav[clovek.id])} />
      <text class="k-popisek" x={STRED[clovek.id]} y="227" text-anchor="middle">{clovek.nazev}</text>
    {/each}
  {/snippet}

  {#snippet ovladani()}
    <p class="pokyn">Změň, co má kdo za sebou</p>
    {#each LIDE as clovek (clovek.id)}
      <div class="k-volba k-volba--radek">
        <span class="k-volba__popisek" id="{id}-{clovek.id}">{clovek.nazev}</span>
        <div class="k-prepinac" role="radiogroup" aria-labelledby="{id}-{clovek.id}">
          {#each PREDTIM as p (p.id)}
            <label>
              <input type="radio" name="{id}-{clovek.id}" value={p.id} bind:group={stav[clovek.id]} />
              <span>{p.nazev}</span>
            </label>
          {/each}
        </div>
      </div>
    {/each}
  {/snippet}
</Kresba>

<style>
  /* Vítr tužkou: tečkované stopy, po kterých přebíhá tah. */
  .proud { fill: none; stroke: var(--tuzka); stroke-width: 1.5; stroke-linecap: round; stroke-dasharray: 3 7; }
  .hrot { fill: none; stroke: var(--tuzka); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

  /* Postava: světlý výstřižek, paže a nohy o odstín tmavší proužky, boty tmavý papír. Bez obrysových čar. */
  /* Světlý tón: v noci postava zůstane světlejší než papír pod ní. */
  .trup { fill: var(--k-svetlo); }
  .bota { fill: var(--k-tma); }
  .telo-cara { fill: none; stroke: color-mix(in srgb, var(--k-svetlo) 82%, var(--k-stin)); stroke-linecap: round; stroke-linejoin: round; }
  .sala { fill: none; stroke: var(--p); stroke-width: 4.5; stroke-linecap: round; transform-box: fill-box; transform-origin: 0% 70%; }
  .tres { fill: none; stroke: var(--tuzka); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
  .listi { transform-box: fill-box; transform-origin: center; }

  /* Obě pózy leží na sobě; vidět je ta, která platí. */
  .poza { opacity: 0; transition: opacity var(--d-listek); }
  .poza.je { opacity: 1; }

  .pokyn { margin: 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; color: var(--ink); }

  /* Pohyb jen tam, kde ho student nemá omezený; zastavení řídí rám (třída k-hybe, global.css). */
  :global(.kresba--pohyb) .proud { animation: proud 1.8s linear infinite; }
  :global(.kresba--pohyb) .sala { animation: sala 0.9s ease-in-out infinite alternate; }
  :global(.kresba--pohyb) .tres { animation: tres 0.28s ease-in-out infinite alternate; }
  /* Listí se jen pohupuje na místě: vítr je pořád týž, kresba nic neodnáší pryč. */
  :global(.kresba--pohyb) .listi { animation: listi 2.4s ease-in-out infinite alternate; }
  :global(.kresba--pohyb) .listi--1 { animation-duration: 3.1s; animation-delay: -1.2s; }
  :global(.kresba--pohyb) .listi--2 { animation-duration: 2.7s; animation-delay: -0.6s; }
  :global(.kresba--pohyb) .listi--3 { animation-duration: 3.4s; animation-delay: -2s; }

  @keyframes proud { to { stroke-dashoffset: -30; } }
  @keyframes sala { from { transform: rotate(-7deg); } to { transform: rotate(9deg); } }
  @keyframes listi { from { transform: translate(-4px, 1px) rotate(-18deg); } to { transform: translate(5px, -2px) rotate(24deg); } }
  @keyframes tres { from { transform: translateX(-0.6px); } to { transform: translateX(0.6px); } }
</style>
