<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Třetí čára: kresba k Aschovu pokusu (cesta 7, krok 6). Nahoře karta se vzorem a karta se třemi čarami,
  // dole osm židlí. Bubliny s odpověďmi se rozsvěcují jedna po druhé a řada se zastaví na předposlední židli,
  // kde sedí student (otazník). Pohled „Se spojencem“ změní jednu věc: čtvrtý v řadě řekne správnou čáru.
  // Samy se hýbou jen bubliny a jdou zastavit; při omezeném pohybu svítí všechny naráz a text pod kresbou
  // říká totéž slovy. Kresba neukazuje odpověď studenta, výsledek pokusu ani smích. Nic neukládá a nenabízí Kam dál.
  // Rám dává Kresba.svelte. Geometrie a texty: src/lib/treti-cara.ts. Podklad: docs/podklady/celek-8-ci-zivot-ziju.md ›
  // Kresba s pohybem: „Třetí čára“ (Asch 1951 a 1956).
  // Použití v MDX: <TretiCara id="treti-cara" obdobi={2} />
  import Kresba from './Kresba.svelte';
  import { BUBLINA, CARY, KARTA_TRI, KARTA_VZOR, MISTA, PLATNO, POHLEDY_CARY, POPISEK_CAR_Y, POPISKY_CARY, POSTAVA, SPODEK_CAR, TLOUSTKA_CARY, TY, VZOR, ZEM, odpovedi, popisCary, poradiBubliny, tvarBubliny, type PohledCary } from '../../lib/treti-cara';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 2 }: Props = $props();

  let pohled = $state<string>('sam');
  let popis = $derived(popisCary(pohled as PohledCary));
  let bubliny = $derived(odpovedi(pohled as PohledCary));

  const telo = (x: number) => {
    const s = POSTAVA.sirka / 2;
    return `M${x - s},${POSTAVA.spodek} L${x - s},${POSTAVA.ramenaY + 8} Q${x - s},${POSTAVA.ramenaY} ${x},${POSTAVA.ramenaY} Q${x + s},${POSTAVA.ramenaY} ${x + s},${POSTAVA.ramenaY + 8} L${x + s},${POSTAVA.spodek} Z`;
  };
</script>

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.TretiCara} nazev={NAZVY_KRESEB.TretiCara} pohledy={POHLEDY_CARY} bind:pohled {popis} viewBox="0 0 {PLATNO.sirka} {PLATNO.vyska}">
  {#snippet kresba()}
    <rect class="k-stin" width={PLATNO.sirka} height={PLATNO.vyska} />

    <!-- Tabule: vlevo karta se vzorem, vpravo karta se třemi čarami. Délky jsou z Aschova prvního kritického kola. -->
    <rect class="k-svetlo karta" x={KARTA_VZOR.x} y={KARTA_VZOR.y} width={KARTA_VZOR.sirka} height={KARTA_VZOR.vyska} rx="2" />
    <rect class="k-svetlo karta" x={KARTA_TRI.x} y={KARTA_TRI.y} width={KARTA_TRI.sirka} height={KARTA_TRI.vyska} rx="2" />
    <rect class="k-tma cara" x={VZOR.x - TLOUSTKA_CARY / 2} y={VZOR.y} width={TLOUSTKA_CARY} height={VZOR.delka} />
    {#each CARY as c (c.cislo)}
      <rect class="k-tma cara" x={c.x - TLOUSTKA_CARY / 2} y={c.y} width={TLOUSTKA_CARY} height={c.delka} />
      <text class="k-popisek k-popisek--tmavy" x={c.x} y={POPISEK_CAR_Y} text-anchor="middle">{c.cislo}</text>
    {/each}
    <line class="spodek" x1={KARTA_TRI.x + 10} y1={SPODEK_CAR + 0.5} x2={KARTA_TRI.x + KARTA_TRI.sirka - 10} y2={SPODEK_CAR + 0.5} />

    <!-- Řada židlí: siluety bez obličejů. Student sedí předposlední, po něm odpoví ještě jeden. -->
    <rect class="k-tma zem" x="0" y={ZEM} width={PLATNO.sirka} height={PLATNO.vyska - ZEM} />
    {#each MISTA as x, i (i)}
      <g class="postava" class:postava--ty={i === TY}>
        <circle cx={x} cy={POSTAVA.hlavaY} r={POSTAVA.hlavaR} />
        <path d={telo(x)} />
      </g>
      {#if bubliny[i] !== null}
        <g class="bublina k-hybe bublina--{poradiBubliny(i)}" class:bublina--ty={i === TY}>
          <path d={tvarBubliny(x)} />
          <text x={x} y={BUBLINA.y + 14.5} text-anchor="middle">{bubliny[i]}</text>
        </g>
      {/if}
    {/each}
    <text class="k-popisek" x={MISTA[TY]} y={PLATNO.vyska - 5} text-anchor="middle">{POPISKY_CARY.ty}</text>
  {/snippet}
</Kresba>

<style>
  .karta { stroke: var(--k-tma); stroke-width: 0.8; }
  .spodek { stroke: var(--k-tma); stroke-width: 0.6; stroke-dasharray: 2 3; opacity: 0.35; }
  .zem { fill-opacity: 0.3; }

  .postava { fill: var(--k-tma); }
  .postava--ty { fill: var(--k-svetlo); stroke: var(--k-tma); stroke-width: 1; }

  .bublina path { fill: var(--k-svetlo); stroke: var(--k-tma); stroke-width: 0.9; stroke-linejoin: round; }
  .bublina text { font-family: var(--font-sans); font-size: 12.5px; font-weight: 700; fill: var(--k-tma); }
  .bublina--ty path { fill: none; stroke: var(--k-svetlo); stroke-dasharray: 3 2.5; stroke-width: 1.2; }
  .bublina--ty text { fill: var(--k-svetlo); }

  /* Odpovědi přicházejí jedna po druhé (krok 0,8 s, kolo 8 s). U studenta se řada zastaví a čeká,
     pak všechno zhasne a kolo začne znovu. Bez pohybu (omezený pohyb, sestavení) svítí všechny bubliny. */
  /* Rozepsané vlastnosti: zkratka bez jména animace se při sestavení zminifikuje na „none“. */
  :global(.kresba--pohyb) .bublina { animation-duration: 8s; animation-timing-function: linear; animation-iteration-count: infinite; animation-fill-mode: both; }
  :global(.kresba--pohyb) .bublina--0 { animation-name: cara-b0; }
  :global(.kresba--pohyb) .bublina--1 { animation-name: cara-b1; }
  :global(.kresba--pohyb) .bublina--2 { animation-name: cara-b2; }
  :global(.kresba--pohyb) .bublina--3 { animation-name: cara-b3; }
  :global(.kresba--pohyb) .bublina--4 { animation-name: cara-b4; }
  :global(.kresba--pohyb) .bublina--5 { animation-name: cara-b5; }
  :global(.kresba--pohyb) .bublina--6 { animation-name: cara-b6; }
  /* Zastavený pohyb ukáže totéž co omezený: všechny bubliny naráz, i hned po načtení (revize antiky, nález 5). */
  :global(.kresba--pohyb:not(.kresba--bezi)) .bublina { animation-name: none; }
  @keyframes cara-b0 { 0% { opacity: 0; } 3%, 93% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes cara-b1 { 0%, 10% { opacity: 0; } 13%, 93% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes cara-b2 { 0%, 20% { opacity: 0; } 23%, 93% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes cara-b3 { 0%, 30% { opacity: 0; } 33%, 93% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes cara-b4 { 0%, 40% { opacity: 0; } 43%, 93% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes cara-b5 { 0%, 50% { opacity: 0; } 53%, 93% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes cara-b6 { 0%, 60% { opacity: 0; } 63%, 93% { opacity: 1; } 100% { opacity: 0; } }
</style>
