<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Kde je střed?: kresba k Aristotelovu středu „vzhledem k nám“ (cesta 4, krok 6). V řece někdo volá o pomoc,
  // na břehu stojí člověk. Student mění, kdo to je (plavčík, dobrý plavec, neplavec) a jaká je voda (klidná, rozvodněná).
  // Na čáře pod scénou stojí slabá značka v půli a výrazný bod „střed“: značka se nehýbe, bod se posouvá
  // a v půli neleží nikdy. Samy se hýbou jen vlny a ruka toho, kdo volá; jde to zastavit.
  // Rám dává Kresba.svelte; stav, polohy a texty počítá src/lib/stred.ts.
  // Podklad: docs/podklady/celek-5-staci-vedet.md › Kresba s pohybem: „Kde je střed?“ (Etika Nikomachova 1106a26–b7, 1109a1–12).
  // Použití v MDX: <KdeJeStred id="kde-je-stred" />
  import Kresba from './Kresba.svelte';
  import KresbaListek from './KresbaListek.svelte';
  import { natrzenyPruh } from '../../lib/kresby';
  import { KRAJE, LIDE_NA_BREHU, PULKA, VODY, VYCHOZI_STRED, popisStredu, stred, type StavStredu } from '../../lib/stred';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 1 }: Props = $props();

  const NAZEV = NAZVY_KRESEB.KdeJeStred;
  const POHLEDY = [{ id: 'reka', nazev: NAZEV }];
  let pohled = $state<string>('reka');
  let stav = $state<StavStredu>({ ...VYCHOZI_STRED });

  /** Čára pod scénou: odkud kam vede a v jaké výšce. */
  const OSA = { od: 34, do: 306, y: 206 };
  const naOse = (misto: number) => OSA.od + misto * (OSA.do - OSA.od);
  /** Vlna přes celé plátno a kus za něj; perioda 40 jednotek, takže posun o 40 na sebe navazuje. */
  const vlna = (y: number, a: number) => `M-40,${y} q10,${-a} 20,0${' t20,0'.repeat(20)}`;

  let s = $derived(stred(stav));
  let rozvodnena = $derived(stav.voda === 'rozvodnena');
  /** Výška hladiny: rozvodněná řeka stojí výš. */
  let hladina = $derived(rozvodnena ? 124 : 138);
  // Koláž (K7b): voda je pruh tmavého papíru s vlnami, břeh natržený šedý papír, lidé výstřižky z listu, směr a hlas
  // tužkou. Barva období nese jen bod „střed“ na čáře pod scénou.
  const BREH = 'M0,112 L6,110 L13,113 L20,111 L27,113 L34,110 L41,112 L48,110 L55,113 L62,111 L69,112 L76,110 L83,112 L92,112 Q108,112 114,126 L128,182 H0 Z';
  const PAS = natrzenyPruh(0, 340, 182, 240, { zub: 2, semeno: 6 });
  let jmeno = $derived(LIDE_NA_BREHU.find((c) => c.id === stav.kdo)!.nazev);
</script>

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.KdeJeStred} nazev={NAZEV} pohledy={POHLEDY} bind:pohled popis={popisStredu(stav)}>
  {#snippet kresba()}
    <!-- Řeka: klidná a rozvodněná leží na sobě, vidět je ta, která platí. -->
    <g class="voda" class:je={!rozvodnena}>
      <rect class="hloubka" y="138" width="340" height="44" />
      <path class="vlna vlna--klidna k-hybe" d={vlna(138, 3)} />
      <path class="vlna vlna--klidna vlna--druha k-hybe" d={vlna(158, 2.5)} />
    </g>
    <g class="voda" class:je={rozvodnena}>
      <rect class="hloubka" y="124" width="340" height="58" />
      <path class="vlna vlna--divoka k-hybe" d={vlna(124, 7)} />
      <path class="vlna vlna--divoka vlna--druha k-hybe" d={vlna(144, 6)} />
      <path class="vlna vlna--divoka vlna--druha k-hybe" d={vlna(164, 5)} />
      <g transform="translate(186 150)"><rect class="klada k-hybe" x="-13" y="-3" width="26" height="6" rx="3" /></g>
    </g>

    <!-- Ten, kdo volá o pomoc: hlava nad hladinou a ruka, která mává. -->
    <g class="tonouci" style="transform: translateY({hladina - 138}px)">
      <circle class="k-svetlo k-vystrih" cx="258" cy="134" r="6.5" />
      <g transform="translate(264 136)"><path class="telo ruka k-hybe" d="M0,0 L8,-20" /></g>
      <path class="kruhy" d="M244,141 q14,-6 28,0 M238,147 q20,-8 40,0" />
      <KresbaListek x={294} y={106} natoceni={3} text="„Pomoc!“" semeno={5} />
    </g>

    <!-- Břeh. -->
    <path class="k-stin k-vystrih" d={BREH} />

    <!-- Plavčík má u sebe záchranný kruh na kůlu. -->
    <g class="poza" class:je={stav.kdo === 'plavcik'}>
      <rect class="k-svetlo" x="19" y="86" width="3" height="26" />
      <circle class="kruh" cx="20.5" cy="80" r="7.5" />
    </g>

    <!-- Skok: tělo ve vzduchu nad vodou. Plavčík v rozvodněné řece je přivázaný k břehu. -->
    <g class="poza" class:je={s.cin === 'skok' || s.cin === 'skok-na-lane'}>
      <g transform="translate(150 86) rotate(27)">
        <path class="telo" d="M-34,-3 L-10,0 M-34,4 L-10,0 M-10,0 L12,0 M10,0 L37,-3 M10,0 L37,3" />
        <circle class="hlava" cx="22" cy="0" r="7" />
      </g>
      <path class="smer" d="M104,70 q8,-6 16,-5 M100,80 q8,-5 14,-4" />
    </g>
    <g class="poza" class:je={s.cin === 'skok-na-lane'}>
      <rect class="k-svetlo" x="88" y="100" width="4" height="12" />
      <path class="lano" d="M90,102 Q112,112 141,82" />
    </g>

    <!-- Hodit lano: stojí na břehu, lano letí k tomu, kdo volá. -->
    <g class="poza" class:je={s.cin === 'lano'}>
      <path class="telo" d="M62,86 L55,111 M62,86 L71,111 M62,86 L64,66 M64,68 L82,58 M64,68 L54,82" />
      <circle class="k-svetlo" cx="65" cy="55" r="7" />
      <path class="lano" d="M82,58 Q170,6 244,{hladina - 8}" />
      <circle class="kruh kruh--maly" cx="247" cy={hladina - 6} r="4.5" />
    </g>

    <!-- Volat o pomoc: stojí na břehu, mává a křičí k lidem za sebou. -->
    <g class="poza" class:je={s.cin === 'volani'}>
      <path class="telo" d="M62,86 L56,111 M62,86 L69,111 M62,86 L62,66 M62,68 L50,46 M62,68 L72,56" />
      <circle class="k-svetlo" cx="61" cy="55" r="7" />
      <path class="hlas" d="M46,58 q-5,-6 -1,-12 M39,62 q-8,-10 -2,-20 M32,66 q-11,-14 -3,-28" />
    </g>

    <text class="k-popisek k-popisek--svetly" x="56" y="152" text-anchor="middle">{jmeno}</text>

    <!-- Čára od „nic neudělat“ po „skočit za každou cenu“. Značka v půli stojí, bod se posouvá. -->
    <path class="k-listek-papir k-vystrih" d={PAS} />
    <path class="osa" d="M{OSA.od},{OSA.y} H{OSA.do} M{OSA.od},{OSA.y - 5} v10 M{OSA.do},{OSA.y - 5} v10" />
    <path class="pulka" d="M{naOse(PULKA)},{OSA.y - 6} v12" />
    <text class="k-popisek kraj" x="14" y="230">{KRAJE.malo}</text>
    <text class="k-popisek kraj pulka-text" x={naOse(PULKA)} y="230" text-anchor="middle">{KRAJE.pulka}</text>
    <text class="k-popisek kraj" x="326" y="230" text-anchor="end">{KRAJE.mnoho}</text>
    <g class="bod" style="transform: translateX({naOse(s.misto)}px)">
      <circle class="bod__kruh" cx="0" cy={OSA.y} r="7" />
      <text class="k-popisek" x="0" y={OSA.y - 12} text-anchor="middle">střed: {s.popisek}</text>
    </g>
  {/snippet}

  {#snippet ovladani()}
    <div class="k-volba">
      <span class="k-volba__popisek" id="{id}-kdo">Kdo stojí na břehu</span>
      <div class="k-prepinac" role="radiogroup" aria-labelledby="{id}-kdo">
        {#each LIDE_NA_BREHU as c (c.id)}
          <label>
            <input type="radio" name="{id}-kdo" value={c.id} bind:group={stav.kdo} />
            <span>{c.nazev}</span>
          </label>
        {/each}
      </div>
    </div>
    <div class="k-volba">
      <span class="k-volba__popisek" id="{id}-voda">Jaká je voda</span>
      <div class="k-prepinac" role="radiogroup" aria-labelledby="{id}-voda">
        {#each VODY as v (v.id)}
          <label>
            <input type="radio" name="{id}-voda" value={v.id} bind:group={stav.voda} />
            <span>{v.nazev}</span>
          </label>
        {/each}
      </div>
    </div>
  {/snippet}
</Kresba>

<style>
  /* Řeka: pruh tmavého papíru, vlny tahy světlé tužky (v noci je řeka vidět podle vln); břeh šedý papír. */
  .hloubka { fill: var(--k-tma); }
  .vlna { fill: none; stroke: var(--k-svetlo); stroke-width: 1.6; stroke-linecap: round; opacity: 0.85; }
  .vlna--druha { opacity: 0.5; }
  .klada { fill: var(--listek); transform-box: fill-box; transform-origin: center; }

  /* Lidé: výstřižky z listu bez obrysu; stín výstřižku je dá od vody i od papíru. */
  .poza { filter: var(--k-vystrih); }
  .telo { fill: none; stroke: var(--k-svetlo); stroke-width: 5.5; stroke-linecap: round; stroke-linejoin: round; }
  .hlava { fill: var(--k-svetlo); }
  .ruka { transform-box: fill-box; transform-origin: 0% 100%; }
  .kruhy { fill: none; stroke: var(--k-svetlo); stroke-width: 1.4; stroke-linecap: round; opacity: 0.7; }
  .kruh { fill: none; stroke: var(--listek); stroke-width: 4; }
  .kruh--maly { stroke-width: 2.5; }
  .lano { fill: none; stroke: var(--ink-2); stroke-width: 1.6; stroke-linecap: round; }
  /* Směr skoku a hlas: tužkou. */
  .smer, .hlas { fill: none; stroke: var(--tuzka); stroke-width: 1.6; stroke-linecap: round; }

  /* Vody a pózy leží na sobě; vidět je ta, která platí. */
  .voda, .poza { opacity: 0; transition: opacity var(--d-listek); }
  .voda.je, .poza.je { opacity: 1; }
  .tonouci { transition: transform var(--d-kamera) var(--k-papir); }

  .osa { fill: none; stroke: var(--ink-2); stroke-width: 1.8; stroke-linecap: round; }
  .pulka { fill: none; stroke: var(--tuzka); stroke-width: 1.5; stroke-dasharray: 3 3; }
  .kraj { font-weight: 500; }
  .pulka-text { fill: var(--ink-3); }
  .bod { transition: transform var(--d-kamera) var(--k-papir); }
  .bod__kruh { fill: var(--p); filter: var(--k-vystrih); }

  /* Pohyb jen tam, kde ho student nemá omezený; zastavení řídí rám (třída k-hybe, global.css). */
  :global(.kresba--pohyb) .vlna--klidna { animation: proud 5s linear infinite; }
  :global(.kresba--pohyb) .vlna--divoka { animation: proud 1.3s linear infinite; }
  :global(.kresba--pohyb) .ruka { animation: mava 0.7s ease-in-out infinite alternate; }
  :global(.kresba--pohyb) .klada { animation: klada 1.1s ease-in-out infinite alternate; }

  @keyframes proud { to { transform: translateX(40px); } }
  @keyframes mava { from { transform: rotate(-16deg); } to { transform: rotate(22deg); } }
  @keyframes klada { from { transform: rotate(-9deg); } to { transform: rotate(7deg); } }
</style>
