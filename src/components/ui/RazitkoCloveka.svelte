<script lang="ts">
  // Razítko člověka ve Svelte (K4b) pro ostrovy bloků: stejné SVG a CSS .razitko-cloveka (global.css) jako Astro verze
  // ui/RazitkoCloveka.astro. Dva soustředné kruhy v inkoustu období, po obvodu jméno a roky, uprostřed atribut,
  // bez atributu rodné město a rok narození (K3 dodatek, bod 8), bez rodiště vlnovky. Pod 48 px bez obvodu.
  // Údaje skládá obal bloku z dat (clovek() v src/components/bloky/_kontrola.ts); bez nich (strana Sporu jen
  // s označením) prázdné razítko s vlnovkami.
  // <RazitkoCloveka razitko={c.razitko} obdobi={c.obdobi} velikost={40} />
  import { natoceniRazitka, delkaNaObvodu, delkaVeStredu, BEZ_OBVODU_POD } from '../../lib/razitko';
  import type { UdajeRazitka } from '../ostrovy/bloky-typy';

  interface Props {
    razitko?: UdajeRazitka;
    obdobi: number;
    velikost?: number;
    /** obrázek s popiskem pro čtečku; jinak aria-hidden */
    popis?: boolean;
    trida?: string;
  }
  let { razitko: r, obdobi, velikost = 56, popis = false, trida }: Props = $props();
  // Id oblouků musí být na stránce jedinečné a stejné při sestavení i po hydrataci.
  const uid = $props.id();
  const bezObvodu = $derived(velikost < BEZ_OBVODU_POD || !r);
  const stred = $derived(bezObvodu || r?.ikona ? undefined : r?.stred);
  const yMesta = $derived(stred?.rok ? 47 : 53.5);
  const nazev = $derived(r ? (r.atribut ? `${r.jmeno} · ${r.atribut}` : stred ? `${r.jmeno} · ${stred.mesto}` : r.jmeno) : '');
  const vlnovka = 'M-14 -5c4-3 8 3 12 0s8-3 12 0 8 3 12 0M-14 1c4-3 8 3 12 0s8-3 12 0 8 3 12 0M-14 7c4-3 8 3 12 0s8-3 12 0 8 3 12 0';
</script>

<span
  class={['razitko-cloveka', `obdobi-${obdobi}`, bezObvodu && 'razitko-cloveka--bez-obvodu', trida]}
  style={`--mv:${velikost}px;--rr:${natoceniRazitka(r?.id ?? String(obdobi))}deg`}
  role={popis && r ? 'img' : undefined}
  aria-label={popis && r ? nazev : undefined}
  aria-hidden={popis && r ? undefined : 'true'}
  data-razitko={r?.id}
>
  <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
    {#if !bezObvodu && r}
      <defs>
        <path id={`${uid}-h`} d="M14 50a36 36 0 0 1 72 0" />
        <path id={`${uid}-d`} d="M6 50a44 44 0 0 0 88 0" />
      </defs>
    {/if}
    <g>
      <circle class="rz-k" cx="50" cy="50" r="47" stroke-width="3.4" />
      <circle class="rz-k" cx="50" cy="50" r="31" stroke-width="1.8" />
      {#if !bezObvodu && r}
        <text class="rz-t"><textPath href={`#${uid}-h`} startOffset="50%" text-anchor="middle" textLength={delkaNaObvodu(r.jmeno, 11)} lengthAdjust={delkaNaObvodu(r.jmeno, 11) ? 'spacingAndGlyphs' : undefined}>{r.jmeno}</textPath></text>
        <text class="rz-t rz-r"><textPath href={`#${uid}-d`} startOffset="50%" text-anchor="middle" textLength={delkaNaObvodu(r.roky, 9)} lengthAdjust={delkaNaObvodu(r.roky, 9) ? 'spacingAndGlyphs' : undefined}>{r.roky}</textPath></text>
        <circle class="rz-b" cx="9.5" cy="50" r="1.6" />
        <circle class="rz-b" cx="90.5" cy="50" r="1.6" />
      {/if}
      {#if r?.ikona}
        <use class="rz-ik" href={`/ikony/atributy.svg#${r.ikona}`} x="30.2" y="30.2" width="39.6" height="39.6" />
      {:else if stred}
        <g class="rz-stred">
          <line class="rz-l" x1="30" y1={yMesta - 10.5} x2="70" y2={yMesta - 10.5} />
          <text class="rz-m" x="50" y={yMesta} text-anchor="middle" textLength={delkaVeStredu(stred.mesto)} lengthAdjust={delkaVeStredu(stred.mesto) ? 'spacingAndGlyphs' : undefined}>{stred.mesto}</text>
          {#if stred.rok}<text class="rz-rok" x="50" y={yMesta + 10} text-anchor="middle">{stred.rok}</text>{/if}
          {#if stred.era}<text class="rz-era" x="50" y={yMesta + 17.5} text-anchor="middle">{stred.era}</text>{/if}
          {#if !stred.rok}<line class="rz-l" x1="30" y1={yMesta + 6} x2="70" y2={yMesta + 6} />{/if}
        </g>
      {:else}
        <path class="rz-ik" transform="translate(50 50)" d={vlnovka} />
      {/if}
    </g>
  </svg>
</span>
