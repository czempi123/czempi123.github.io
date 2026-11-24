<script lang="ts">
  // Nůžky u citátu ze zdroje.yaml (design-v2, K6; denik-v2, K4): jen značka s data-vystrihnout. Stav (aria-pressed),
  // vystřižení, vyndání a větu o plné sbírce řeší src/scripts/vystrihnout.ts na každé stránce, i u nůžek, které
  // ostrov vykreslí později. Rodič potřebuje position: relative; nůžky sedí vpravo dole (global.css › .citat__nuzky).
  //   v Astru:   <Nuzky id={id} text={c.cesky} kde={udajeCitatu(c)} />       (bez client:, jen HTML)
  //   v ostrovu: {#if odkryto}<Nuzky id={k.citat} text={k.veta} kde={k.udaje} />{/if}
  // Pravidlo (plán › 3): nůžky má citát, který student vidí celý a který už nic neskrývá; ve hrách až po odkrytí.
  import { TEXTY_SBIRKY } from '../../lib/sbirka-texty';

  interface Props {
    /** id citátu ze zdroje.yaml */
    id: string;
    /** znění, jak ho uloží sbírka */
    text: string;
    /** autor, dílo a místo (udajeCitatu) */
    kde: string;
    /** kompaktní citát (bez listu): nůžky menší okraj od kraje */
    kompaktni?: boolean;
    /** v řádku s jinými ovládacími prvky, ne v rohu (rub Kdo to řekl?, kde roh patří otisku „sedí“) */
    vRadku?: boolean;
  }
  let { id, text, kde, kompaktni = false, vRadku = false }: Props = $props();
</script>

<button
  class={['citat__nuzky', kompaktni && 'citat__nuzky--kompaktni', vRadku && 'citat__nuzky--v-radku']}
  type="button"
  aria-pressed="false"
  aria-label={TEXTY_SBIRKY.nuzky}
  title={TEXTY_SBIRKY.nuzky}
  data-vystrihnout={id}
  data-text={text}
  data-kde={kde}
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" /></svg>
</button>
