<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Přesýpací hodiny: kresba k Senekově výzvě „spočítej si léta“ (cesta 34, krok 3). Horní baňka drží písek
  // jednoho všedního dne (24 zrnek, hodina na zrnko). Student posuvníky rozdělí hodiny podle toho, kdo o nich
  // rozhodl; co nerozdělí, proteklo. Zrnka padají jedno po druhém hrdlem dolů a usazují se po vrstvách (spánek
  // dole, navrchu to, co proteklo); po krátkém zastavení kolo začne znovu. Pohyb jde zastavit, při omezeném pohybu
  // leží všechna zrnka dole a text pod kresbou říká totéž slovy. V kresbě není nic mimo model: sklo, rámy, zrnka
  // a legenda vrstev. Spánek ani škola nejsou ztráta, jen vrstva. Rám dává Kresba.svelte; nic se neukládá.
  // Stav, geometrie a texty: src/lib/presypaci.ts. Podklad: docs/podklady/celek-9.md › g) Kresba (krok 3).
  // Použití v MDX: <PresypaciHodiny id="presypaci-hodiny" />
  import Kresba from './Kresba.svelte';
  import {
    DOLE, HRDLO, LEGENDA_PROTEKLA, MAX_SKUPINA, NAHORE, RAMY, SKLO, SKUPINY, VYCHOZI_DEN, ZRNO,
    hodinSlovy, kosoctverec, nastav, popisDne, protekla, startZrnka, vrstva, type Skupina, type StavDne, type Vrstva,
  } from '../../lib/presypaci';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 2 }: Props = $props();

  const NAZEV = NAZVY_KRESEB.PresypaciHodiny;
  const POHLEDY = [{ id: 'den', nazev: NAZEV }];
  let pohled = $state<string>('den');
  let den = $state<StavDne>({ ...VYCHOZI_DEN });
  /** Každé kolo písku je nové: po konci kola se zrnka vrátí nahoru a padají znovu. */
  let kolo = $state(0);

  let zbytek = $derived(protekla(den));
  let vrstvy = $derived(DOLE.map((_, i) => vrstva(den, i)));

  /** Legenda shora dolů ve stejném pořadí, v jakém vrstvy leží v baňce. */
  let legenda = $derived([
    { id: 'protekla' as Vrstva, text: LEGENDA_PROTEKLA, hodin: zbytek },
    ...[...SKUPINY].reverse().map((g) => ({ id: g.id as Vrstva, text: g.legenda, hodin: den[g.id] })),
  ]);
  const LEGENDA_Y = [136, 156, 176, 196, 216];

  function zmen(kdo: Skupina, e: Event & { currentTarget: HTMLInputElement }) {
    den = nastav(den, kdo, Number(e.currentTarget.value));
    // Když posuvník chtěl víc, než do 24 hodin zbývá, vrátí se tam, kde hodina skončila.
    e.currentTarget.value = String(den[kdo]);
  }
</script>

{#snippet zrno(v: Vrstva, x: number, y: number)}
  {#if v === 'jiny'}
    <path class="z z--jiny" d={kosoctverec(x, y)} />
  {:else}
    <circle class="z z--{v}" cx={x} cy={y} r={v === 'protekla' ? ZRNO - 0.6 : ZRNO} />
  {/if}
{/snippet}

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.PresypaciHodiny} nazev={NAZEV} pohledy={POHLEDY} bind:pohled popis={popisDne(den)}>
  {#snippet kresba()}
    <!-- Koláž (K7b): sklo výstřižek z černého papíru, rámy lístkový papír, zrnka světlá; tvoje volba je papír
         období (jediný nositel barvy), v baňce i v legendě. -->
    <path class="sklo k-vystrih" d={SKLO} />
    <g class="k-vystrih">
      {#each RAMY as r, i (i)}
        <rect class="ram" x={r.x} y={r.y} width={r.sirka} height={r.vyska} />
      {/each}
    </g>

    {#key kolo}
      <!-- Horní baňka: písek dne, ještě bez vrstvy. Zrnko zmizí ve chvíli, kdy začne padat. -->
      {#each NAHORE as m, i (i)}
        <circle class="horni k-hybe" cx={m.x} cy={m.y} r={ZRNO} style:animation-delay="{startZrnka(i)}s" />
      {/each}
      <!-- Spodní baňka: zrnko přiletí od hrdla na své místo; bez pohybu tam leží rovnou. -->
      {#each DOLE as m, i (i)}
        <g class="pad k-hybe" style:--nx="{HRDLO.x - m.x}px" style:--ny="{HRDLO.y - m.y}px" style:animation-delay="{startZrnka(i)}s">
          {@render zrno(vrstvy[i], m.x, m.y)}
        </g>
      {/each}
      <!-- Hodiny kola: až doběhne, začne písek padat znovu. Zastavený pohyb zastaví i je. -->
      <rect class="kolo k-hybe" width="0" height="0" onanimationend={() => (kolo += 1)} />
    {/key}

    <!-- Legenda vrstev, shora dolů jako v baňce. -->
    <text class="k-popisek" x="178" y="56">jeden všední den</text>
    <text class="k-popisek" x="178" y="72">24 hodin</text>
    {#each legenda as l, i (l.id)}
      <g class="legenda">{@render zrno(l.id, 186, LEGENDA_Y[i] - 4)}</g>
      <text class="k-popisek" x="198" y={LEGENDA_Y[i]}>{l.text}</text>
      <text class="k-popisek" x="332" y={LEGENDA_Y[i]} text-anchor="end">{l.hodin} h</text>
    {/each}
  {/snippet}

  {#snippet ovladani()}
    <div class="den">
      <p class="den__pokyn">Rozděl hodiny podle toho, kdo o nich rozhodl</p>
      {#each SKUPINY as g (g.id)}
        <div class="den__radek">
          <label for="{id}-{g.id}">{g.nazev}</label>
          <input
            id="{id}-{g.id}"
            type="range"
            min="0"
            max={MAX_SKUPINA}
            step="1"
            value={den[g.id]}
            aria-valuetext={hodinSlovy(den[g.id])}
            oninput={(e) => zmen(g.id, e)}
          />
          <output for="{id}-{g.id}">{den[g.id]} h</output>
        </div>
      {/each}
      <p class="den__zbytek">Protekla a nevíš kam: <strong>{zbytek} h</strong></p>
    </div>
  {/snippet}
</Kresba>

<style>
  /* Hrana skla tužkou: v noci by černé sklo na tmavém papíře zmizelo. */
  .sklo { fill: var(--k-tma); stroke: var(--tuzka); stroke-width: 0.9; stroke-linejoin: round; }
  .ram { fill: var(--listek); }

  .z { stroke-width: 1.2; }
  .z--spanek { fill: none; stroke: var(--k-svetlo); }
  .z--skola { fill: var(--k-svetlo); fill-opacity: 0.45; stroke: none; }
  .z--ja { fill: var(--p); stroke: var(--k-svetlo); stroke-width: 0.8; }
  .z--jiny { fill: var(--k-stin); stroke: var(--k-svetlo); stroke-linejoin: round; }
  .z--protekla { fill: none; stroke: var(--k-svetlo); stroke-dasharray: 1.6 1.6; opacity: 0.75; }
  /* Legenda leží na papíře, ne na skle: zrnka v inkoustu. */
  .legenda .z--spanek, .legenda .z--protekla { stroke: var(--ink-2); opacity: 1; }
  .legenda .z--skola { fill: var(--ink-2); }
  .legenda .z--ja { stroke: none; }
  .legenda .z--jiny { fill: var(--ink-3); stroke: var(--ink-2); }

  .horni { fill: var(--k-svetlo); fill-opacity: 0.6; opacity: 0; }

  /* Pohyb: zrnko po zrnku hrdlem dolů, pak chvíle klidu a nové kolo. Bez pohybu (omezený pohyb, sestavení) leží
     všechna zrnka dole a horní baňka je prázdná. Rozepsané vlastnosti: zkratka bez jména animace se při sestavení
     zminifikuje na „none“. Délky odpovídají PAD a KOLO v src/lib/presypaci.ts. */
  :global(.kresba--pohyb) .horni {
    animation-name: presypani-horni;
    animation-duration: 0.25s;
    animation-timing-function: ease-out;
    animation-iteration-count: 1;
    animation-fill-mode: both;
  }
  :global(.kresba--pohyb) .pad {
    animation-name: presypani-pad;
    animation-duration: 0.7s;
    animation-timing-function: cubic-bezier(0.55, 0, 0.9, 0.6);
    animation-iteration-count: 1;
    animation-fill-mode: both;
  }
  :global(.kresba--pohyb) .kolo {
    animation-name: presypani-kolo;
    animation-duration: 13.5s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: none;
  }
  /* Zastavený pohyb ukazuje výsledek kola: písek dole po vrstvách, horní baňka prázdná, i když student pohyb
     zastavil hned po načtení. Odchylka od rámu (zastavená kresba jinak stojí tam, kde je; docs/design.md).
     Pustit pohyb začne nové kolo. */
  :global(.kresba--pohyb:not(.kresba--bezi)) .horni,
  :global(.kresba--pohyb:not(.kresba--bezi)) .pad,
  :global(.kresba--pohyb:not(.kresba--bezi)) .kolo { animation-name: none; }
  @keyframes presypani-horni {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes presypani-pad {
    0% { opacity: 0; transform: translate(var(--nx), var(--ny)); }
    12% { opacity: 1; }
    100% { opacity: 1; transform: translate(0, 0); }
  }
  @keyframes presypani-kolo {
    from { opacity: 0; }
    to { opacity: 0; }
  }

  .den { margin: 0; font-family: var(--font-sans); font-size: var(--fs-ovladani); }
  .den__pokyn { margin: 0 0 var(--s-1); font-weight: 600; color: var(--ink); }
  .den__radek { display: grid; grid-template-columns: 8.5em 1fr 2.5em; align-items: center; column-gap: var(--s-2); }
  .den__radek label { color: var(--ink); }
  .den__radek input { width: 100%; height: 44px; margin: 0; accent-color: var(--p, var(--ink)); cursor: pointer; }
  .den__radek output { color: var(--ink-2); text-align: right; font-variant-numeric: lining-nums tabular-nums; }
  .den__zbytek { margin: var(--s-1) 0 0; color: var(--ink-2); }
  .den__zbytek strong { color: var(--ink); font-variant-numeric: lining-nums tabular-nums; }
</style>
