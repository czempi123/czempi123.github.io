<script lang="ts">
  import { NAZVY_KRESEB, NADTITULKY_KRESEB } from '../../lib/kresby';
  // Zrcadlo času: kresba k Lucretiovu argumentu (cesta 8, krok 4). Osa času, uprostřed život, vlevo čas před
  // narozením s letopočty z dějepisu, vpravo čas po smrti bez letopočtů. Pohled „Zrcadlo“: tlačítko přiloží
  // k životu zrcadlo a čas po smrti se překlopí na čas před narozením; kryjí se. Pohled „Námitka“: posuvníkem
  // student zkouší život prodloužit; doprava se prodlouží tentýž život, doleva se nepohne a vlevo se objeví někdo jiný.
  // Rám dává Kresba.svelte; nic tu neběží samo, proto kresba nemá tlačítko pohybu. Oba pohyby jsou přechody:
  // při omezeném pohybu se stav změní hned. Pravý konec života nemá letopočet ani věk.
  // Stav, geometrie a texty: src/lib/zrcadlo.ts. Podklad: docs/podklady/celek-6-proc-se-bat-smrti.md ›
  // Kresba s pohybem: zrcadlo na ose času (Lucretius, O přírodě III, 832–842 a 972–977).
  // Použití v MDX: <Zrcadlo id="zrcadlo-casu" />
  import Kresba from './Kresba.svelte';
  import { KROK_NAVIC, LETOPOCTY, OSA, PLATNO, PO, POHLEDY_ZRCADLA, POSUNY, PRED, VYCHOZI_POSUN, ZIVOT, popisZrcadla, useckyNamitky, type PohledZrcadla } from '../../lib/zrcadlo';

  interface Props {
    id: string;
    /** barva období (1–8) */
    obdobi?: number;
  }
  let { id, obdobi = 2 }: Props = $props();

  let pohled = $state<string>('zrcadlo');
  let prilozeno = $state(false);
  let posun = $state(VYCHOZI_POSUN);
  let u = $derived(useckyNamitky(posun));
  let popis = $derived(popisZrcadla(pohled as PohledZrcadla, prilozeno, posun));

  const Y = OSA.y;
  const V = OSA.vyska;
  /** nejdelší prodloužení života; kratší se z něj dělá měřítkem */
  const NAVIC_MAX = KROK_NAVIC * (POSUNY.length - 1 - VYCHOZI_POSUN);
  /** výchozí poloha cizího života (o něco dřív); dál doleva se posouvá */
  const CIZI_X = useckyNamitky(VYCHOZI_POSUN - 1).cizi!.x;
</script>

<Kresba {id} {obdobi} nadtitulek={NADTITULKY_KRESEB.Zrcadlo} nazev={NAZVY_KRESEB.Zrcadlo} pohledy={POHLEDY_ZRCADLA} bind:pohled {popis} viewBox="0 0 {PLATNO.sirka} {PLATNO.vyska}" maPohyb={false}>
  {#snippet kresba()}
    <!-- Koláž (K7b): osa času jsou dva stejné pruhy černého papíru a mezi nimi život z papíru období (jediný nositel
         barvy, i když se prodlouží); cizí život lístkový papír, dílky tužkou. -->
    <g class="k-vystrih pruhy-tmy">
      <rect class="k-tma" x={PRED.x} y={Y} width={PRED.sirka} height={V} />
      <rect class="k-tma" x={PO.x} y={Y} width={PO.sirka} height={V} />
    </g>
    {#each LETOPOCTY as l (l.rok)}
      <line class="dilek" x1={l.x} y1={Y + V} x2={l.x} y2={Y + V + 6} />
      <text class="k-popisek" x={l.x} y={Y + V + 20} text-anchor="middle">{l.rok}</text>
    {/each}
    <text class="k-popisek" x="10" y={Y - 10}>před narozením</text>
    <text class="k-popisek" x={PLATNO.sirka - 10} y={Y - 10} text-anchor="end">po smrti</text>

    {#if pohled === 'zrcadlo'}
      <!-- Odraz času po smrti: leží vpravo a po přiložení zrcadla se překlopí doleva. -->
      <g class="odraz" class:prilozeno>
        <rect class="odraz__plocha" x={PO.x} y={Y - 5} width={PO.sirka} height={V + 10} />
      </g>
      <g class="zrc" class:prilozeno>
        <!-- Čára zrcadla vede středem života; přes něj ji kryje světlá úsečka s popiskem. -->
        <line class="zrc__cara" x1={OSA.stred} y1="30" x2={OSA.stred} y2={PLATNO.vyska - 18} />
        <text class="k-popisek" x={OSA.stred} y="22" text-anchor="middle">zrcadlo</text>
        <text class="k-popisek" x={PRED.sirka / 2} y={Y + V + 44} text-anchor="middle">odraz času po smrti</text>
      </g>
    {:else}
      <!-- Doprava: tentýž život, delší. Doleva: život stojí a vlevo je někdo jiný. -->
      <rect class="k-papir-obdobi navic" x={PO.x} y={Y} width={NAVIC_MAX} height={V} style:transform="scaleX({u.navic / NAVIC_MAX})" />
      <line class="sev" class:je={u.navic > 0} x1={PO.x} y1={Y + 4} x2={PO.x} y2={Y + V - 4} />
      <text class="k-popisek dole" class:je={u.navic > 0} x={PO.x - 6} y={Y + V + 44}>tentýž život, delší</text>
      <g class="cizi" class:je={!!u.cizi} style:transform="translateX({(u.cizi?.x ?? CIZI_X) - CIZI_X}px)">
        <rect class="cizi__usecka" x={CIZI_X} y={Y + 3} width={ZIVOT.sirka} height={V - 6} />
        <text class="k-popisek" x={CIZI_X + ZIVOT.sirka / 2} y={Y + V + 44} text-anchor="middle">někdo jiný</text>
      </g>
    {/if}

    <rect class="k-papir-obdobi k-vystrih zivot" x={ZIVOT.x} y={Y} width={ZIVOT.sirka} height={V} />
    <text class="k-popisek k-popisek--svetly" x={OSA.stred} y={Y + V / 2 + 4} text-anchor="middle">život</text>
  {/snippet}

  {#snippet ovladani()}
    {#if pohled === 'zrcadlo'}
      <div class="blok__akce">
        <button type="button" class="blok__tl blok__tl--vedlejsi" onclick={() => (prilozeno = !prilozeno)}>
          {prilozeno ? 'Odložit zrcadlo' : 'Přiložit zrcadlo'}
        </button>
      </div>
    {:else}
      <div class="k-posuvnik">
        <label for="{id}-posun">Posuň: zkus životu přidat čas</label>
        <input id="{id}-posun" type="range" min="0" max={POSUNY.length - 1} step="1" bind:value={posun} aria-valuetext={POSUNY[posun].nazev} />
        <output for="{id}-posun">{POSUNY[posun].nazev}</output>
      </div>
    {/if}
  {/snippet}
</Kresba>

<style>
  /* Hrana pruhu tužkou: v noci by černý papír na tmavém papíře zmizel. */
  .pruhy-tmy rect { stroke: var(--tuzka); stroke-width: 0.8; }
  /* Život nese světlý popisek, proto je i v noci papír období (text pro papír období na něm má 5,7 : 1 a víc). */
  .k-papir-obdobi { fill: var(--pp); }
  .dilek { stroke: var(--tuzka); stroke-width: 1.2; stroke-linecap: round; }

  /* Zrcadlo: odraz se otočí kolem svislé čáry uprostřed života. Bez přiložení není vidět. */
  .odraz { transform-box: view-box; transform-origin: 170px 96px; opacity: 0; transition: transform var(--d-kamera) var(--k-papir), opacity var(--d-listek); }
  .odraz.prilozeno { transform: scaleX(-1); opacity: 1; }
  .odraz__plocha { fill: var(--k-svetlo); fill-opacity: 0.26; stroke: var(--k-svetlo); stroke-width: 1.4; stroke-dasharray: 4 4; }
  .zrc { opacity: 0; transition: opacity var(--d-listek); }
  .zrc.prilozeno { opacity: 1; }
  .zrc__cara { stroke: var(--ink-2); stroke-width: 1.6; stroke-linecap: round; }

  /* Námitka: prodloužení roste od konce života doprava; cizí život se posouvá jen vlevo. */
  .navic { transform-box: fill-box; transform-origin: 0 50%; transition: transform var(--d-kamera) var(--k-papir); }
  .sev { stroke: var(--na-papiru); stroke-width: 1.2; stroke-dasharray: 3 3; opacity: 0; transition: opacity var(--d-listek); }
  .sev.je { opacity: 0.8; }
  .dole { opacity: 0; transition: opacity var(--d-listek); }
  .dole.je { opacity: 1; }
  .cizi { opacity: 0; transition: opacity var(--d-listek), transform var(--d-kamera) var(--k-papir); }
  .cizi.je { opacity: 1; }
  .cizi__usecka { fill: var(--listek); stroke: var(--tuzka); stroke-width: 1.4; stroke-dasharray: 4 4; }
</style>
