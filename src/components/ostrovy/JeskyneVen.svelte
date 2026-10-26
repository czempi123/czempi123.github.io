<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Cesta ven z jeskyně: druhá kresba s pohybem k Platónově jeskyni. „Cesta ven“ je řez jeskyní: někdo vězně
  // vleče strmou cestou nahoru. „Venku“ je pohled vězně; posuvníkem si student projde, jak si oči zvykají
  // (záře, stíny, odrazy ve vodě, věci samé, noční nebe, slunce). Rám dává Kresba.svelte.
  // Podklad: Ústava VII, 515c–516b (docs/podklady/celek-4-co-je-skutecne.md › Vstupní scéna, řádky 8–13).
  // Použití v MDX: <JeskyneVen id="jeskyne-ven" />
  import Kresba from './Kresba.svelte';
  import { POHLEDY_VEN, POPIS_CESTY, STUPNE, vrstvyVenku } from '../../lib/jeskyne';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 1 }: Props = $props();

  let pohled = $state<string>('cesta');
  let stupen = $state(0);
  let v = $derived(vrstvyVenku(stupen));
  let popis = $derived(pohled === 'cesta' ? POPIS_CESTY : STUPNE[stupen].popis);

  const HVEZDY = [[24, 22], [52, 70], [108, 30], [140, 84], [168, 18], [206, 58], [238, 26], [276, 80], [306, 34], [322, 104], [88, 108], [190, 112]];
  const PAPRSKY = [0, 45, 90, 135, 180, 225, 270, 315];
</script>

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.JeskyneVen} nazev={NAZVY_KRESEB.JeskyneVen} pohledy={POHLEDY_VEN} bind:pohled {popis}>
  {#snippet kresba()}
    {#if pohled === 'cesta'}
      <g class="pohled-cesta">
        <!-- Nahoře svět venku, pod ním skála s jeskyní a strmou cestou. -->
        <rect class="k-svetlo" width="340" height="60" />
        <circle class="slunce-kotouc" cx="292" cy="26" r="11" />
        <rect class="k-stin" x="24" y="44" width="4" height="16" />
        <circle class="k-stin" cx="26" cy="38" r="11" />
        <rect class="k-tma" y="60" width="340" height="180" />
        <path class="k-stin" d="M60,60 L100,60 L184,150 L140,216 Z" />
        <path class="k-stin" d="M140,216 L140,176 C150,146 200,132 250,132 C300,132 332,144 332,172 L332,216 Z" />
        <path class="denni-svetlo" d="M60,60 L100,60 L96,88 L72,84 Z" />

        <!-- Oheň, nosiči za zídkou, vězni a stěna se stíny, jak je zná krok 1. -->
        <path class="k-tma" d="M186,216 L192,200 H214 L220,216 Z" />
        <circle class="zare k-hybe" cx="203" cy="192" r="16" />
        <g transform="translate(203 200) scale(0.55)">
          <path class="plamen k-svetlo k-hybe" d="M0,0 C-13,-5 -14,-19 -5,-31 C-3,-22 3,-21 4,-36 C12,-26 15,-12 9,-4 C7,-1 3,0 0,0 Z" />
        </g>
        <g class="k-svetlo">
          <circle cx="241" cy="197.5" r="3.4" />
          <path d="M237.5,201.5 h7 l0.8,14.5 h-8.6 z" />
          <path transform="translate(244 187) scale(0.22)" d="M-9,0 C-20,-10 -20,-30 -9,-38 L-7,-46 L-11,-50 L11,-50 L7,-46 L9,-38 C20,-30 20,-10 9,0 Z" />
          <rect x="252" y="188" width="4" height="28" />
          {#each [290, 310] as x (x)}
            <circle cx={x} cy="201" r="3.8" />
            <path d="M{x - 3.4},205.5 h6.8 l1,10.5 h-8.8 z" />
            <rect x={x + 2} y="212.5" width="12" height="3.5" rx="1.5" />
          {/each}
          <rect x="326" y="150" width="5" height="66" />
        </g>
        <line class="tyc" x1="243" y1="200" x2="244" y2="187" />
        <rect class="k-tma" x="326" y="160" width="5" height="30" />
        <rect class="k-tma" x="326" y="206" width="5" height="10" />

        <!-- Cesta: od místa vězňů kolem ohně a strmě nahoru. Dvojice po ní jde, když se kresba hýbe. -->
        <path class="stopa" d="M276,214 L140,214 L64,64 L38,60" />
        <g class="dvojice k-hybe">
          <path class="paze" d="M-3,-8 L2,-7" />
          <circle cx="-6" cy="-15" r="3.6" />
          <path d="M-9.5,-11 h7 l0.8,11 h-8.6 z" />
          <circle cx="5" cy="-14" r="3.6" />
          <path d="M1.5,-10 h7 l0.8,10 h-8.6 z" />
        </g>

        <text class="k-popisek k-popisek--tmavy" x="160" y="36" text-anchor="middle">venku</text>
        <text class="k-popisek" x="8" y="150">strmá cesta</text>
        <text class="k-popisek" x="203" y="232" text-anchor="middle">oheň</text>
        <text class="k-popisek" x="302" y="232" text-anchor="middle">vězni</text>
      </g>
    {:else}
      <g class="pohled-venku">
        <defs>
          <clipPath id="{id}-rybnik"><ellipse cx="262" cy="216" rx="58" ry="14" /></clipPath>
          <radialGradient id="{id}-oslneni" cx="50%" cy="42%" r="72%">
            <stop offset="0.35" class="oslneni0" />
            <stop offset="1" class="oslneni1" />
          </radialGradient>
        </defs>
        <rect class="k-svetlo" width="340" height="150" />
        <rect class="k-stin" y="150" width="340" height="90" />

        <!-- Noc: nebe s hvězdami a měsícem snese dřív než slunce. -->
        <g class="vrstva noc" style="opacity: {v.noc}">
          <rect class="k-stin" width="340" height="150" />
          <rect class="k-tma zem-v-noci" y="150" width="340" height="90" />
          {#each HVEZDY as [x, y], i (i)}
            <circle class="k-svetlo hvezda k-hybe" cx={x} cy={y} r={i % 3 === 0 ? 1.9 : 1.3} style="animation-delay: {(i % 5) * 0.4}s" />
          {/each}
          <circle class="k-svetlo" cx="64" cy="38" r="12" />
          <circle class="k-stin" cx="69.5" cy="34" r="10" />
        </g>

        <!-- Slunce samo až nakonec. -->
        <g class="vrstva slunce" style="opacity: {v.slunce}">
          <circle class="slunce-kotouc" cx="286" cy="40" r="13" />
          <g class="paprsky k-hybe">
            {#each PAPRSKY as u (u)}
              <line class="paprsek" x1="286" y1="20" x2="286" y2="13" transform="rotate({u} 286 40)" />
            {/each}
          </g>
        </g>

        <!-- Stíny stromu a člověka: to první, co venku rozezná. -->
        <g class="vrstva stiny k-tma" style="opacity: {v.stiny * 0.5}">
          <path d="M82,178 L90,178 L64,187 L50,187 Z" />
          <ellipse cx="38" cy="188" rx="30" ry="7" />
          <path d="M257,201 L267,201 L232,207 L218,207 Z" />
          <ellipse cx="212" cy="207" rx="8" ry="3.5" />
        </g>

        <!-- Voda a v ní odraz člověka. -->
        <g class="vrstva voda" style="opacity: {v.voda}">
          <ellipse class="k-svetlo hladina" cx="262" cy="216" rx="58" ry="14" />
          <g clip-path="url(#{id}-rybnik)">
            <g class="odraz k-hybe">
              <g class="k-stin" transform="translate(0 404) scale(1 -1)">
                <circle cx="262" cy="160" r="7" />
                <path d="M255,168 h14 l3,34 h-20 z" />
              </g>
            </g>
          </g>
        </g>

        <!-- Věci samé: strom a člověk. -->
        <g class="vrstva veci k-tma" style="opacity: {v.veci}">
          <rect x="82" y="138" width="8" height="40" />
          <circle cx="86" cy="124" r="22" />
          <circle cx="68" cy="136" r="14" />
          <circle cx="104" cy="136" r="14" />
          <circle cx="262" cy="160" r="7" />
          <path d="M255,168 h14 l3,34 h-20 z" />
        </g>

        <!-- Záře: oči plné světla, nic není vidět. -->
        <g class="vrstva zare-venku" style="opacity: {v.zare}">
          <rect class="k-svetlo" width="340" height="240" />
          <rect class="oslneni k-hybe" width="340" height="240" fill="url(#{id}-oslneni)" />
        </g>
      </g>
    {/if}
  {/snippet}

  {#snippet ovladani()}
    {#if pohled === 'venku'}
      <div class="k-posuvnik">
        <label for="{id}-stupen">Posuň: oči si zvykají</label>
        <input id="{id}-stupen" type="range" min="0" max={STUPNE.length - 1} step="1" bind:value={stupen} aria-valuetext={STUPNE[stupen].nazev} />
        <output for="{id}-stupen">{stupen + 1} z {STUPNE.length} · {STUPNE[stupen].nazev}</output>
      </div>
    {/if}
  {/snippet}
</Kresba>

<style>
  .slunce-kotouc { fill: var(--k-svetlo); stroke: var(--k-stin); stroke-width: 2.5; }
  .paprsek { stroke: var(--k-stin); stroke-width: 2.5; stroke-linecap: round; }
  .paprsky { transform-origin: 286px 40px; }
  .denni-svetlo { fill: var(--k-svetlo); opacity: 0.35; }
  .zare { fill: var(--k-svetlo); opacity: 0.16; }
  .plamen { transform-box: fill-box; transform-origin: 50% 100%; }
  .tyc { stroke: var(--k-svetlo); stroke-width: 1.2; stroke-linecap: round; }
  .stopa { fill: none; stroke: var(--k-svetlo); stroke-width: 1.4; stroke-dasharray: 2 4; stroke-linecap: round; opacity: 0.75; }
  /* Dvojice má světlou výplň a tmavý obrys, aby byla vidět v jeskyni i venku na světle. */
  .dvojice { fill: var(--k-svetlo); stroke: var(--k-tma); stroke-width: 1.2; paint-order: stroke; transform: translate(104px, 144px); }
  .dvojice .paze { fill: none; stroke: var(--k-svetlo); stroke-width: 1.8; stroke-linecap: round; }

  .vrstva { transition: opacity var(--pohyb-kamera) ease; }
  .zem-v-noci { opacity: 0.45; }
  .oslneni0 { stop-color: var(--k-stin); stop-opacity: 0; }
  .oslneni1 { stop-color: var(--k-stin); stop-opacity: 0.3; }
  .hladina { opacity: 0.92; }
  .odraz { opacity: 0.7; }


  /* Pohyb jen tam, kde ho student nemá omezený; zastavení řídí rám (třída k-hybe, global.css). */
  :global(.kresba--pohyb) .dvojice { animation: dvojice 18s linear infinite; }
  :global(.kresba--pohyb) .plamen { animation: plamen 1.1s ease-in-out infinite alternate; }
  :global(.kresba--pohyb) .zare { animation: zare 1.1s ease-in-out infinite alternate; }
  :global(.kresba--pohyb) .hvezda { animation: hvezda 2.4s ease-in-out infinite alternate; }
  :global(.kresba--pohyb) .paprsky { animation: paprsky 24s linear infinite; }
  :global(.kresba--pohyb) .odraz { animation: odraz 2.8s ease-in-out infinite alternate; }
  :global(.kresba--pohyb) .oslneni { animation: oslneni 1.6s ease-in-out infinite alternate; }
  /* Zastavený pohyb ukáže totéž co omezený: vězeň na strmé cestě, ne dole mezi ostatními (revize antiky, nález 5). */
  :global(.kresba--pohyb:not(.kresba--bezi)) .dvojice { animation-name: none; }

  @keyframes dvojice {
    0%, 6% { transform: translate(276px, 214px); }
    20%, 30% { transform: translate(226px, 214px); }
    44% { transform: translate(140px, 214px); }
    86% { transform: translate(64px, 64px); }
    92%, 100% { transform: translate(40px, 60px); }
  }
  @keyframes plamen { from { transform: scale(1, 1); } to { transform: scale(0.92, 1.14); } }
  @keyframes zare { from { opacity: 0.1; } to { opacity: 0.22; } }
  @keyframes hvezda { from { opacity: 1; } to { opacity: 0.35; } }
  @keyframes paprsky { to { transform: rotate(360deg); } }
  @keyframes oslneni { from { opacity: 1; } to { opacity: 0.35; } }
  @keyframes odraz { from { transform: translateX(-1.5px); } to { transform: translateX(1.5px); } }
</style>
