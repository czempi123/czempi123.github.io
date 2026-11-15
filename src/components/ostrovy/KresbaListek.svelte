<svelte:options namespace="svg" />

<script lang="ts">
  // Lísteček s páskou v kresbě (koláž, design-v2 K7b; plátno project/KresbaVitr.dc.html › repliky):
  // text v kresbě, který někdo říká nebo píše, stojí Kalamem na lístečku přilepeném páskou v papíru období.
  // Popisky věcí v kresbě lísteček nemají (Instrument Sans, třída k-popisek).
  // Použití uvnitř snippetu kresba: <KresbaListek x={100} y={76} text="Je mi zima." natoceni={-3} />
  import { natrzenyList } from '../../lib/kresby';

  interface Props {
    /** střed lístečku */
    x: number;
    y: number;
    text: string;
    /** natočení ve stupních */
    natoceni?: number;
    /** šířka lístečku; výchozí podle délky textu */
    sirka?: number;
    /** bez pásky (třeba lísteček, který visí na šňůře) */
    bezPasky?: boolean;
    /** semeno natržení okraje */
    semeno?: number;
    trida?: string;
  }
  let { x, y, text, natoceni = 0, sirka, bezPasky = false, semeno = 3, trida = '' }: Props = $props();
  // Kalam 13,5 jednotky: znak vyjde asi na 6,4 jednotky; okraj 9 po stranách.
  let s = $derived(sirka ?? Math.max(34, Math.round(text.length * 6.4 + 18)));
  let tvar = $derived(natrzenyList(-s / 2, -12.5, s, 25, { semeno }));
</script>

<g class="k-listek {trida}" transform="translate({x} {y}) rotate({natoceni})">
  <path class="k-listek__papir k-vystrih" d={tvar} />
  {#if !bezPasky}<rect class="k-listek__paska" x="-11" y="-16.5" width="22" height="7" transform="rotate(-4)" />{/if}
  <text class="k-listek__text" x="0" y="4.6" text-anchor="middle">{text}</text>
</g>
