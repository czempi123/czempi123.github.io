<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Zdvoj čtverec: kresba k chlapci z Menóna (portrét Platóna, kapitola 02). Mřížka stopa na stopu, tři pokusy
  // o čtverec s dvojnásobným obsahem: strana čtyři, strana tři a čtverec na úhlopříčce. Student přepíná pokusy
  // a tlačítkem si nechá čtverečky spočítat; před spočítáním kresba výsledek neříká. Původní čtverec (obsah čtyři)
  // je v mřížce vždy vyznačený. Nic tu neběží samo, proto kresba nemá tlačítko pohybu.
  // Rám dává Kresba.svelte. Texty a geometrie: src/lib/ctverec.ts.
  // Použití v MDX: <ZdvojCtverec id="zdvoj-ctverec" />
  import Kresba from './Kresba.svelte';
  import { HLEDANY, JEDNOTKA, NADPIS_HLEDAME, POKUSY, PUVODNI, TLACITKO_SKRYT, TLACITKO_SPOCITAT, VELKY, X0, Y0, bodyNaPlatno, pocet, pokus, popisPokusu, rozdelCtverecky } from '../../lib/ctverec';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 1 }: Props = $props();

  const POHLEDY = POKUSY.map((p) => ({ id: p.id, nazev: p.nazev }));
  const CARY = [0, 1, 2, 3, 4];
  const CTVERCE = [0, 1].flatMap((y) => [0, 1].map((x) => ({ x: x * PUVODNI, y: y * PUVODNI })));
  const KRAJ = X0 + VELKY * JEDNOTKA;

  let pohled = $state<string>(POKUSY[0].id);
  /** které pokusy už student nechal spočítat */
  let spocitane = $state<Record<string, boolean>>({});

  let p = $derived(pokus(pohled));
  let spocitano = $derived(!!spocitane[p.id]);
  let rozdeleno = $derived(rozdelCtverecky(p.body));
  let pocty = $derived(pocet(p));

  /** Řádky vpravo po spočítání: co student napočítal. */
  /** Čtverečky číslované po řadě (celé 1, 2, 3 …), půlky jako ½. */
  let cisla = $derived([
    ...rozdeleno.cele.map((c, i) => ({ ...c, text: String(i + 1) })),
    ...rozdeleno.pulky.map((c) => ({ ...c, text: '½' })),
  ]);

  let vysledek = $derived(p.id === 'uhlopricka' ? [`${pocty.cele} celé`, `${pocty.pulky} půlek`, `= ${pocty.soucet}`] : [`${pocty.soucet}`]);
</script>

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.ZdvojCtverec} nazev={NAZVY_KRESEB.ZdvojCtverec} pohledy={POHLEDY} bind:pohled popis={popisPokusu(p, spocitano)} maPohyb={false}>
  {#snippet kresba()}
    <defs>
      <clipPath id="{id}-klip"><polygon points={bodyNaPlatno(p.body)} /></clipPath>
    </defs>
    <!-- Koláž (K7b): mřížka tužkou na tečkovaném papíře, původní čtverec lístkový papír, pokus výstřižek z papíru
         období (jediný nositel barvy), spočítané čtverečky světlé výstřižky na něm. -->
    <rect class="puvodni-vypln" x={X0} y={Y0} width={PUVODNI * JEDNOTKA} height={PUVODNI * JEDNOTKA} />
    {#each POKUSY as q (q.id)}
      <polygon class="plocha" class:aktivni={q.id === p.id} points={bodyNaPlatno(q.body)} />
    {/each}

    {#if spocitano}
      <g class="pocet">
        {#each rozdeleno.cele as c (`${c.x}-${c.y}`)}
          <rect class="cele" x={X0 + c.x * JEDNOTKA} y={Y0 + c.y * JEDNOTKA} width={JEDNOTKA} height={JEDNOTKA} />
        {/each}
        <g clip-path="url(#{id}-klip)">
          {#each rozdeleno.pulky as c (`${c.x}-${c.y}`)}
            <rect class="pulka" x={X0 + c.x * JEDNOTKA} y={Y0 + c.y * JEDNOTKA} width={JEDNOTKA} height={JEDNOTKA} />
          {/each}
        </g>
      </g>
    {/if}

    {#each CARY as i (i)}
      <line class="mrizka" x1={X0 + i * JEDNOTKA} y1={Y0} x2={X0 + i * JEDNOTKA} y2={Y0 + VELKY * JEDNOTKA} />
      <line class="mrizka" x1={X0} y1={Y0 + i * JEDNOTKA} x2={KRAJ} y2={Y0 + i * JEDNOTKA} />
    {/each}

    {#each CTVERCE as c (`${c.x}-${c.y}`)}
      <rect class="puvodni" x={X0 + c.x * JEDNOTKA} y={Y0 + c.y * JEDNOTKA} width={PUVODNI * JEDNOTKA} height={PUVODNI * JEDNOTKA} />
    {/each}
    <polygon class="okraj" points={bodyNaPlatno(p.body)} />

    {#if spocitano}
      {#each cisla as c (`${c.x}-${c.y}`)}
        <text class="k-popisek cislo" class:pulka-cislo={c.text === '½'} x={X0 + c.x * JEDNOTKA + JEDNOTKA / 2} y={Y0 + c.y * JEDNOTKA + JEDNOTKA / 2 + 7} text-anchor="middle">{c.text}</text>
      {/each}
    {/if}

    <text class="k-popisek puvodni-popisek" x={X0 + 6} y={Y0 + 12}>původní</text>
    <text class="k-popisek" x="234" y="58">{p.strana[0]}</text>
    <text class="k-popisek" x="234" y="75">{p.strana[1]}</text>
    {#if spocitano}
      <text class="k-popisek" x="234" y="116">obsah</text>
      {#each vysledek as radek, i (i)}
        <text class="k-popisek" x="234" y={133 + i * 17}>{radek}</text>
      {/each}
    {/if}
    <text class="k-popisek" x="234" y="214">{NADPIS_HLEDAME}: {HLEDANY}</text>
  {/snippet}

  {#snippet ovladani()}
    <div class="blok__akce">
      <button type="button" class="blok__tl blok__tl--vedlejsi" aria-pressed={spocitano} onclick={() => (spocitane[p.id] = !spocitano)}>
        {spocitano ? TLACITKO_SKRYT : TLACITKO_SPOCITAT}
      </button>
    </div>
  {/snippet}
</Kresba>

<style>
  /* Plocha pokusu zůstává v kresbě, jen se mění, která je vidět; přechod hlídá token pohybu. */
  .plocha { fill: var(--p); opacity: 0; filter: var(--k-vystrih); transition: opacity var(--d-listek); }
  .plocha.aktivni { opacity: 0.82; }
  /* Hrana pokusu: tah tužky po okraji výstřižku. */
  .okraj { fill: none; stroke: var(--ink-2); stroke-width: 1.6; stroke-linejoin: round; }
  .mrizka { stroke: var(--tuzka); stroke-width: 1; opacity: 0.7; }
  .puvodni-vypln { fill: var(--listek); filter: var(--k-vystrih); }
  .puvodni { fill: none; stroke: var(--ink-2); stroke-width: 1.4; stroke-dasharray: 4 3; opacity: 0.75; }
  /* Čísla mají okraj popisku (k-popisek): čtou se na výstřižku i na papíře, ve dne i v noci. */
  .cislo { font-size: 14px; }
  .cele { fill: var(--k-svetlo); opacity: 0.8; }
  .pulka { fill: var(--k-svetlo); opacity: 0.45; }
</style>
